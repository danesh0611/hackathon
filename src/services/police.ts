import api, { useMockData } from "./api";
import type {
  DashboardMetrics,
  CaseListItem,
  CaseDetail,
  CaseUpdatePayload,
  CaseQueryParams,
  PaginatedResponse,
  MapMarker,
  StatisticsData,
  FraudNetworkData,
  AIAlert,
} from "@/types/api";

// ─── Mock Data ───────────────────────────────────────────────────────

const mockDashboard: DashboardMetrics = {
  todayComplaints: { value: 47, trend: "up", trendValue: 12 },
  counterfeitCases: { value: 156, trend: "down", trendValue: 3 },
  activeFraudRings: { value: 8, trend: "up", trendValue: 2 },
  highRiskAreas: { value: 12, trend: "neutral" },
  aiAlerts: { value: 23, trend: "up", trendValue: 7 },
};

const mockCases: CaseListItem[] = [
  { id: "CMP-2026-0001", citizenName: "Anita Sharma", citizenPhone: "+91 98765 43210", type: "scam", status: "open", officerAssigned: "Insp. Kumar", createdAt: "2026-07-08T10:30:00", summary: "Digital arrest scam — caller impersonated CBI officer" },
  { id: "CMP-2026-0002", citizenName: "Ravi Patel", citizenPhone: "+91 87654 32109", type: "counterfeit", status: "investigating", officerAssigned: "SI Meena", createdAt: "2026-07-08T09:15:00", summary: "Fake ₹500 notes received at grocery store" },
  { id: "CMP-2026-0003", citizenName: "Priya Nair", citizenPhone: "+91 76543 21098", type: "fraud_call", status: "open", officerAssigned: "Unassigned", createdAt: "2026-07-07T16:45:00", summary: "OTP fraud — bank account drained ₹45,000" },
  { id: "CMP-2026-0004", citizenName: "Suresh Reddy", citizenPhone: "+91 65432 10987", type: "digital_arrest", status: "resolved", officerAssigned: "Insp. Kumar", createdAt: "2026-07-07T11:20:00", summary: "Digital arrest threat via WhatsApp video call" },
  { id: "CMP-2026-0005", citizenName: "Meera Gupta", citizenPhone: "+91 54321 09876", type: "scam", status: "closed", officerAssigned: "SI Meena", createdAt: "2026-07-06T14:00:00", summary: "Lottery scam SMS — no money lost" },
  { id: "CMP-2026-0006", citizenName: "Arjun Singh", citizenPhone: "+91 43210 98765", type: "counterfeit", status: "investigating", officerAssigned: "Insp. Kumar", createdAt: "2026-07-06T08:30:00", summary: "Multiple fake ₹2000 notes at petrol bunk" },
  { id: "CMP-2026-0007", citizenName: "Kavitha Rao", citizenPhone: "+91 32109 87654", type: "fraud_call", status: "open", officerAssigned: "Unassigned", createdAt: "2026-07-05T17:00:00", summary: "Impersonation of telecom company executive" },
  { id: "CMP-2026-0008", citizenName: "Deepak Joshi", citizenPhone: "+91 21098 76543", type: "scam", status: "investigating", officerAssigned: "SI Meena", createdAt: "2026-07-05T12:15:00", summary: "Investment fraud — fake trading app" },
];

const mockCaseDetail: CaseDetail = {
  ...mockCases[0],
  description: "Victim received a call from someone claiming to be a CBI officer. The caller stated that a parcel with illegal substances was intercepted at Mumbai customs with the victim's Aadhaar details. They threatened immediate arrest unless the victim transferred money for 'verification.' The victim transferred ₹2,50,000 via UPI before realizing it was a scam.",
  attachments: [
    { id: "ATT-001", type: "image", url: "/mock/screenshot.png", name: "WhatsApp Screenshot.png" },
    { id: "ATT-002", type: "audio", url: "/mock/recording.mp3", name: "Call Recording.mp3" },
  ],
  statusHistory: [
    { status: "open", changedBy: "System", changedAt: "2026-07-08T10:30:00", note: "Complaint registered via citizen portal" },
  ],
  location: { lat: 13.0827, lng: 80.2707 },
};

const mockMapMarkers: MapMarker[] = [
  { id: "M-001", type: "scam_report", lat: 13.0827, lng: 80.2707, severity: "high", title: "Digital Arrest Scam", summary: "CBI impersonation scam cluster", date: "2026-07-08", caseId: "CMP-2026-0001" },
  { id: "M-002", type: "fake_currency", lat: 13.0604, lng: 80.2496, severity: "medium", title: "Counterfeit ₹500", summary: "Fake notes at T. Nagar market", date: "2026-07-07", caseId: "CMP-2026-0002" },
  { id: "M-003", type: "fraud_call", lat: 13.0524, lng: 80.2508, severity: "high", title: "OTP Fraud", summary: "Bank OTP phishing calls", date: "2026-07-07", caseId: "CMP-2026-0003" },
  { id: "M-004", type: "scam_report", lat: 13.0878, lng: 80.2785, severity: "low", title: "Lottery Scam", summary: "SMS lottery scam reports", date: "2026-07-06" },
  { id: "M-005", type: "fake_currency", lat: 13.0475, lng: 80.2090, severity: "high", title: "Counterfeit ₹2000", summary: "High-quality fake notes detected", date: "2026-07-06", caseId: "CMP-2026-0006" },
  { id: "M-006", type: "fraud_call", lat: 13.0350, lng: 80.2400, severity: "medium", title: "Telecom Fraud", summary: "Fake telecom executive calls", date: "2026-07-05", caseId: "CMP-2026-0007" },
];

const mockStatistics: StatisticsData = {
  dailyComplaints: [
    { label: "Mon", value: 23 }, { label: "Tue", value: 35 }, { label: "Wed", value: 28 },
    { label: "Thu", value: 42 }, { label: "Fri", value: 38 }, { label: "Sat", value: 15 }, { label: "Sun", value: 12 },
  ],
  weeklyComplaints: [
    { label: "Week 1", value: 120 }, { label: "Week 2", value: 145 }, { label: "Week 3", value: 98 },
    { label: "Week 4", value: 167 }, { label: "Week 5", value: 189 },
  ],
  scamTypes: [
    { name: "Digital Arrest", value: 35, color: "#EF4444" },
    { name: "UPI Fraud", value: 28, color: "#F59E0B" },
    { name: "Counterfeit Currency", value: 20, color: "#8B5CF6" },
    { name: "Investment Scam", value: 12, color: "#3B82F6" },
    { name: "Lottery Scam", value: 5, color: "#10B981" },
  ],
  stateWiseCases: [
    { label: "Tamil Nadu", value: 245 }, { label: "Maharashtra", value: 198 },
    { label: "Delhi", value: 156 }, { label: "Karnataka", value: 134 },
    { label: "Uttar Pradesh", value: 112 }, { label: "West Bengal", value: 89 },
    { label: "Gujarat", value: 76 }, { label: "Rajasthan", value: 67 },
  ],
  counterfeitAccuracy: [
    { label: "Jan", value: 87 }, { label: "Feb", value: 89 }, { label: "Mar", value: 91 },
    { label: "Apr", value: 92 }, { label: "May", value: 94 }, { label: "Jun", value: 95 },
    { label: "Jul", value: 96 },
  ],
  totalReportsAnalyzed: 15847,
  totalFakeCurrencyDetected: 3291,
  totalActiveOfficers: 234,
};

const mockAIAlerts: AIAlert[] = [
  { id: "AIA-001", title: "Digital Arrest Scam Cluster", description: "5 reports of CBI impersonation in last 2 hours — Chennai Central", confidence: 98, location: "Chennai Central", timestamp: "2026-07-08T10:45:00", isRead: false, severity: "high" },
  { id: "AIA-002", title: "Counterfeit Note Pattern", description: "Same serial number prefix detected across 3 locations", confidence: 91, location: "T. Nagar, Chennai", timestamp: "2026-07-08T09:30:00", isRead: false, severity: "high" },
  { id: "AIA-003", title: "UPI Fraud Ring Activity", description: "Linked accounts performing rapid micro-transactions", confidence: 85, location: "Anna Nagar, Chennai", timestamp: "2026-07-08T08:15:00", isRead: true, severity: "medium" },
  { id: "AIA-004", title: "New Scam Template Detected", description: "AI identified a new phishing SMS template targeting SBI customers", confidence: 79, location: "Pan-city", timestamp: "2026-07-07T22:00:00", isRead: true, severity: "medium" },
  { id: "AIA-005", title: "Suspicious Call Pattern", description: "Spike in international calls to elderly residents in Adyar", confidence: 72, location: "Adyar, Chennai", timestamp: "2026-07-07T18:45:00", isRead: true, severity: "low" },
];

const mockFraudNetwork: FraudNetworkData = {
  nodes: [
    { id: "N1", label: "SBI Acc. ***4521", type: "account", riskScore: 0.95 },
    { id: "N2", label: "+91 98765 XXXXX", type: "phone", riskScore: 0.9 },
    { id: "N3", label: "Device #A7F3", type: "device", riskScore: 0.85 },
    { id: "N4", label: "HDFC Acc. ***7890", type: "account", riskScore: 0.7 },
    { id: "N5", label: "+91 87654 XXXXX", type: "phone", riskScore: 0.6 },
    { id: "N6", label: "UPI: fraud@ybl", type: "account", riskScore: 0.92 },
    { id: "N7", label: "Device #B2E1", type: "device", riskScore: 0.5 },
  ],
  edges: [
    { source: "N1", target: "N2", relationship: "registered_phone", strength: 0.95 },
    { source: "N2", target: "N3", relationship: "used_device", strength: 0.9 },
    { source: "N3", target: "N4", relationship: "accessed_account", strength: 0.8 },
    { source: "N4", target: "N5", relationship: "called_number", strength: 0.7 },
    { source: "N1", target: "N6", relationship: "transferred_to", strength: 0.98 },
    { source: "N6", target: "N7", relationship: "used_device", strength: 0.6 },
    { source: "N5", target: "N3", relationship: "used_device", strength: 0.55 },
  ],
};

// ─── Service Functions ───────────────────────────────────────────────

export async function fetchDashboard(): Promise<DashboardMetrics> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 500));
    return mockDashboard;
  }
  const { data } = await api.get<DashboardMetrics>("/dashboard");
  return data;
}

export async function fetchCases(params?: CaseQueryParams): Promise<PaginatedResponse<CaseListItem>> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 600));
    let filtered = [...mockCases];
    if (params?.status) filtered = filtered.filter((c) => c.status === params.status);
    if (params?.type) filtered = filtered.filter((c) => c.type === params.type);
    if (params?.search) {
      const q = params.search.toLowerCase();
      filtered = filtered.filter((c) => c.citizenName.toLowerCase().includes(q) || c.id.toLowerCase().includes(q) || c.summary.toLowerCase().includes(q));
    }
    const page = params?.page ?? 1;
    const pageSize = params?.pageSize ?? 10;
    return {
      data: filtered.slice((page - 1) * pageSize, page * pageSize),
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  }
  const { data } = await api.get<PaginatedResponse<CaseListItem>>("/cases", { params });
  return data;
}

export async function fetchCaseDetail(id: string): Promise<CaseDetail> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 400));
    return { ...mockCaseDetail, id };
  }
  const { data } = await api.get<CaseDetail>(`/case/${id}`);
  return data;
}

export async function updateCase(id: string, payload: CaseUpdatePayload): Promise<CaseDetail> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 500));
    return { ...mockCaseDetail, id, status: payload.status ?? mockCaseDetail.status };
  }
  const { data } = await api.put<CaseDetail>(`/case/${id}`, payload);
  return data;
}

export async function fetchMapMarkers(): Promise<MapMarker[]> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 500));
    return mockMapMarkers;
  }
  const { data } = await api.get<MapMarker[]>("/map");
  return data;
}

export async function fetchStatistics(): Promise<StatisticsData> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 700));
    return mockStatistics;
  }
  const { data } = await api.get<StatisticsData>("/statistics");
  return data;
}

export async function fetchFraudNetwork(): Promise<FraudNetworkData> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 800));
    return mockFraudNetwork;
  }
  const { data } = await api.get<FraudNetworkData>("/fraud-network");
  return data;
}

export async function fetchAIAlerts(): Promise<AIAlert[]> {
  if (useMockData()) {
    await new Promise((r) => setTimeout(r, 300));
    return mockAIAlerts;
  }
  const { data } = await api.get<AIAlert[]>("/alerts");
  return data;
}
