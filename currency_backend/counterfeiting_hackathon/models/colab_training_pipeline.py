import os
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
import kagglehub
import google.generativeai as genai

# =====================================================================
# PART 1: ML MODEL TRAINING (Run this section in Google Colab)
# =====================================================================

def train_ml_model():
    print("Downloading dataset...")
    # Download dataset from Kaggle
    dataset_path = kagglehub.dataset_download("preetrank/indian-currency-real-vs-fake-notes-dataset")
    print(f"Dataset downloaded to: {dataset_path}")
    
    # Dataset structure usually has train/val or classes inside the main folder.
    # Update this path if the dataset has a specific subfolder (e.g., dataset_path + '/dataset')
    data_dir = dataset_path 
    
    # 1. Preprocessing (Data Augmentation and Normalization)
    print("Setting up Data Generators...")
    datagen = ImageDataGenerator(
        rescale=1./255,
        rotation_range=20,
        width_shift_range=0.2,
        height_shift_range=0.2,
        shear_range=0.2,
        zoom_range=0.2,
        horizontal_flip=True,
        validation_split=0.2 # Use 20% for validation
    )

    train_generator = datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='binary', # Assuming 2 classes: Real and Fake
        subset='training'
    )

    val_generator = datagen.flow_from_directory(
        data_dir,
        target_size=(224, 224),
        batch_size=32,
        class_mode='binary',
        subset='validation'
    )

    # 2. ML Model Architecture (Transfer Learning with MobileNetV2)
    print("Building Model...")
    base_model = MobileNetV2(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
    
    # Freeze the base model
    base_model.trainable = False 

    # Add custom classification head
    x = base_model.output
    x = GlobalAveragePooling2D()(x)
    x = Dense(128, activation='relu')(x)
    predictions = Dense(1, activation='sigmoid')(x) # Sigmoid for binary classification

    model = Model(inputs=base_model.input, outputs=predictions)
    
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])

    # 3. Training
    print("Starting Training...")
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=10 # Increase for better results
    )

    # Save the trained model
    model_save_path = 'fake_currency_model.h5'
    model.save(model_save_path)
    print(f"Model saved to {model_save_path}")
    
    return model, train_generator.class_indices

# =====================================================================
# PART 2: THE PIPELINE (Input -> Preprocessing -> ML Model -> LLM -> Decision)
# =====================================================================

class CurrencyDetectionPipeline:
    def __init__(self, model_path, gemini_api_key, class_indices):
        """
        Initializes the pipeline with the trained ML model and LLM client.
        """
        # Load ML Model
        self.ml_model = tf.keras.models.load_model(model_path)
        
        # Invert class indices to map output back to labels (e.g. {0: 'Fake', 1: 'Real'})
        self.class_labels = {v: k for k, v in class_indices.items()}
        
        # Configure LLM (Gemini)
        genai.configure(api_key=gemini_api_key)
        self.llm = genai.GenerativeModel('gemini-1.5-flash')
        
    def preprocess_input(self, image_path):
        """Step 1 & 2: Input and Preprocessing"""
        img = tf.keras.preprocessing.image.load_img(image_path, target_size=(224, 224))
        img_array = tf.keras.preprocessing.image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0 # Normalize
        return img_array
        
    def get_ml_prediction(self, preprocessed_image):
        """Step 3: ML Model Prediction"""
        prediction = self.ml_model.predict(preprocessed_image)[0][0]
        
        # Convert sigmoid output to class label and confidence
        if prediction > 0.5:
            label = self.class_labels[1]
            confidence = prediction
        else:
            label = self.class_labels[0]
            confidence = 1 - prediction
            
        return label, confidence

    def get_llm_decision(self, ml_label, confidence, image_path=None):
        """Step 4 & 5: LLM Contextualization and Final Decision"""
        prompt = f"""
        You are an expert AI system designed to assist users in identifying counterfeit Indian currency.
        
        A specialized Computer Vision (ML) model has analyzed an image of a currency note provided by the user.
        The ML model predicted that the note is **{ml_label}** with a confidence score of **{confidence * 100:.2f}%**.
        
        Based on this ML prediction, please provide:
        1. A clear final decision to the user on whether they should accept this note.
        2. If it's predicted as Fake, explain common security features of Indian currency (like the watermark, security thread, micro-lettering, latent image, etc.) that they should manually verify to confirm the ML model's suspicion.
        3. If it's Real, explain what features likely contributed to this classification.
        
        Keep your response helpful, concise, and structured. Do not claim to see the image yourself; rely on the ML model's finding.
        """
        
        response = self.llm.generate_content(prompt)
        return response.text

    def run(self, image_path):
        """Executes the full architecture"""
        print(f"--- Running Pipeline for {image_path} ---")
        
        # Pipeline execution
        preprocessed_img = self.preprocess_input(image_path)
        ml_label, confidence = self.get_ml_prediction(preprocessed_img)
        final_decision_report = self.get_llm_decision(ml_label, confidence)
        
        return {
            "ml_prediction": ml_label,
            "confidence": confidence,
            "llm_report": final_decision_report
        }

# =====================================================================
# EXAMPLE USAGE
# =====================================================================
if __name__ == "__main__":
    # Note: To run this locally, you'd need the dataset downloaded and model trained.
    # In Colab, you would run train_ml_model() first.
    
    print("This script contains the architecture. To train, run train_ml_model() in Colab.")
    
    # UNCOMMENT BELOW TO RUN THE PIPELINE (Requires trained model and API key)
    '''
    # 1. Train the model (or load if already trained)
    # model, indices = train_ml_model() 
    # Or mock indices if already trained: indices = {'Fake': 0, 'Real': 1}
    
    # 2. Initialize Pipeline
    # GEMINI_API_KEY = "YOUR_API_KEY_HERE"
    # pipeline = CurrencyDetectionPipeline('fake_currency_model.h5', GEMINI_API_KEY, indices)
    
    # 3. Run Pipeline
    # test_image = "path_to_test_image.jpg"
    # result = pipeline.run(test_image)
    
    # print(f"ML Model Output: {result['ml_prediction']} ({result['confidence']*100:.2f}%)")
    # print("\nLLM Decision Report:\n", result['llm_report'])
    '''
