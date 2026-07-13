import api, { useMockData } from "./api";
import type {
  ReportPayload,
  ReportResponse,
  CurrencyDetectionResult,
  ScamDetectRequest,
  ScamDetectionResult,
  AlertItem,
  HeatmapPoint,
} from "@/types/api";
import axios from "axios";

// ─── Mock Data ───────────────────────────────────────────────────────

const mockReportResponse: ReportResponse = {
  success: true,
  complaintId: "CMP-2026-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0"),
  message: "Your complaint has been registered successfully. An officer will review it shortly.",
};

const mockCurrencyResult: CurrencyDetectionResult = {
  result: "Fake",
  confidence: 94.5,
  missingSecurityFeatures: [
    "Watermark absent or faded",
    "Security thread not embedded properly",
    "Micro-lettering inconsistent",
    "Color-shifting ink not responsive",
  ],
  aiExplanation:
    "The submitted ₹500 note shows significant deviations from authentic currency. The watermark of Mahatma Gandhi is absent, the security thread appears to be pasted on rather than embedded, and the micro-lettering 'RBI' and '500' under magnification are blurred and inconsistent. The intaglio printing on the Ashoka Pillar emblem lacks the characteristic raised texture. These findings strongly indicate a counterfeit note produced via high-resolution color printing.",
};

const mockScamResult: ScamDetectionResult = {
  risk: "High",
  reason: "Digital Arrest Pattern — impersonating government authority, demanding immediate payment via UPI, threatening legal action. Classic social engineering attack.",
  confidence: 96,
};

const mockAlerts: AlertItem[] = [
  { id: "ALT-001", type: "scam", title: "UPI Fraud Cluster", description: "Multiple UPI fraud reports in this area", lat: 13.0827, lng: 80.2707, date: "2026-07-08", severity: "high" },
  { id: "ALT-002", type: "counterfeit", title: "Fake ₹500 Notes", description: "Counterfeit ₹500 notes detected at local market", lat: 13.0604, lng: 80.2496, date: "2026-07-07", severity: "medium" },
  { id: "ALT-003", type: "scam", title: "Digital Arrest Scam", description: "Reports of digital arrest scam calls from this zone", lat: 13.0524, lng: 80.2508, date: "2026-07-06", severity: "high" },
  { id: "ALT-004", type: "counterfeit", title: "Fake ₹2000 Notes", description: "Counterfeit ₹2000 notes found at petrol bunk", lat: 13.0878, lng: 80.2785, date: "2026-07-05", severity: "low" },
  { id: "ALT-005", type: "scam", title: "Lottery Scam", description: "Fake lottery SMS scam targeting elderly", lat: 13.0475, lng: 80.2090, date: "2026-07-04", severity: "medium" },
  { id: "ALT-006", type: "counterfeit", title: "Fake ₹100 Notes", description: "Low quality counterfeit notes circulating", lat: 13.0350, lng: 80.2400, date: "2026-07-03", severity: "low" },
];

const mockHeatmapPoints: HeatmapPoint[] = [
  { lat: 13.0827, lng: 80.2707, intensity: 0.9 },
  { lat: 13.0604, lng: 80.2496, intensity: 0.7 },
  { lat: 13.0524, lng: 80.2508, intensity: 0.85 },
  { lat: 13.0878, lng: 80.2785, intensity: 0.4 },
  { lat: 13.0475, lng: 80.2090, intensity: 0.6 },
  { lat: 13.0350, lng: 80.2400, intensity: 0.3 },
  { lat: 13.0700, lng: 80.2600, intensity: 0.5 },
  { lat: 13.0900, lng: 80.2300, intensity: 0.65 },
  { lat: 13.0200, lng: 80.2500, intensity: 0.45 },
  { lat: 13.0650, lng: 80.2200, intensity: 0.55 },
];

// ─── Service Functions ───────────────────────────────────────────────

export async function submitReport(payload: ReportPayload): Promise<ReportResponse> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 1500));
    return { ...mockReportResponse, complaintId: "CMP-2026-" + Math.floor(Math.random() * 10000).toString().padStart(4, "0") };
  }

  const formData = new FormData();
  formData.append("phone", payload.phone);
  formData.append("description", payload.description);
  if (payload.screenshot) formData.append("screenshot", payload.screenshot);
  if (payload.currencyImage) formData.append("currencyImage", payload.currencyImage);
  if (payload.audio) formData.append("audio", payload.audio);
  if (payload.video) formData.append("video", payload.video);

  const { data } = await api.post<ReportResponse>("/report", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function detectCurrency(image: File): Promise<CurrencyDetectionResult> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 2000));
    return mockCurrencyResult;
  }

  const formData = new FormData();
  formData.append("image", image);
  const { data } = await api.post<CurrencyDetectionResult>("/currency-detect", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return data;
}

export async function detectScam(payload: ScamDetectRequest): Promise<ScamDetectionResult> {
  // Call the actual API regardless of mock settings
  const { data } = await axios.post("/api/scamshield/analyze-text", {
    text: payload.text,
  });

  let risk: "Low" | "Medium" | "High" = "Medium";
  if (data.scam_probability > 75) risk = "High";
  else if (data.scam_probability < 30) risk = "Low";

  const reason = data.reasons?.length 
    ? data.reasons.map((r: any) => r.why).join(" ") 
    : data.verdict;

  return {
    risk,
    reason,
    confidence: Math.round(data.scam_probability),
  };
}

export async function fetchAlerts(lat?: number, lng?: number): Promise<AlertItem[]> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 600));
    return mockAlerts;
  }

  const { data } = await api.get<AlertItem[]>("/alerts", { params: { lat, lng, radius: 10 } });
  return data;
}

export async function fetchHeatmapData(): Promise<HeatmapPoint[]> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 400));
    return mockHeatmapPoints;
  }

  const { data } = await api.get<HeatmapPoint[]>("/heatmap");
  return data;
}
