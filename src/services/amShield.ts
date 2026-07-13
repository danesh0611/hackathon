import axios from "axios";

const amShieldApi = axios.create({
  baseURL: "/api/scamshield",
  timeout: 60000,
  headers: {
    "Content-Type": "application/json",
  },
});

export interface AnalyzeTextRequest {
  text: string;
  engine?: string;
  model_id?: string;
  aws_region?: string;
  aws_access_key_id?: string;
  aws_secret_access_key?: string;
  aws_bearer_token_bedrock?: string;
}

export const amShieldService = {
  /**
   * Health Check
   */
  checkHealth: async () => {
    const response = await amShieldApi.get("/health");
    return response.data;
  },

  /**
   * Analyze Text for Scam Detection
   */
  analyzeText: async (data: AnalyzeTextRequest) => {
    const response = await amShieldApi.post("/analyze-text", data);
    return response.data;
  },

  /**
   * Analyze Audio for Speech-To-Text and Scam Detection
   */
  analyzeAudio: async (formData: FormData) => {
    const response = await amShieldApi.post("/analyze-audio", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
};
