import os
import base64
import uuid
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from colab_training_pipeline import CurrencyDetectionPipeline

app = FastAPI(title="Fake Currency Detection API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

try:
    indices = {'Fake': 0, 'Real': 1}
    gemini_key = os.environ.get("GEMINI_API_KEY", "YOUR_GEMINI_API_KEY_HERE") # IMPORTANT: Set this
    pipeline = CurrencyDetectionPipeline('fake_currency_model.h5', gemini_key, indices)
    print("✅ Model and Pipeline loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    pipeline = None

class PredictRequest(BaseModel):
    image: str # Base64 encoded string from frontend

@app.get("/")
def health_check():
    return {"status": "healthy"}

@app.post("/api/predict/upload")
async def predict(req: PredictRequest):
    if pipeline is None:
        raise HTTPException(status_code=500, detail="Pipeline is not initialized. Please check backend logs.")
        
    try:
        # 1. Clean the base64 string if it contains the Data URI scheme (data:image/jpeg;base64,...)
        base64_data = req.image
        if "," in base64_data:
            base64_data = base64_data.split(",")[1]
            
        # 2. Decode to bytes and save to a temporary file
        image_bytes = base64.b64decode(base64_data)
        temp_file_path = f"temp_{uuid.uuid4().hex}.jpg"
        
        with open(temp_file_path, "wb") as f:
            f.write(image_bytes)
            
        # 3. Run the ML Pipeline
        result = pipeline.run(temp_file_path)
        
        # 4. Cleanup temp file
        os.remove(temp_file_path)
        
        # 5. Return JSON matching EXACTLY what `citizen.ts` expects
        return {
            "authentic": result["ml_prediction"] == "Real",
            "confidence": result["confidence"],
            "description": result["llm_report"],
            "features": {} # We let Gemini explain the features in 'description'
        }
        
    except Exception as e:
        print("Prediction Error:", e)
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="127.0.0.1", port=8000)
