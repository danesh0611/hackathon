/* ===================================================================
 * API Contract Types
 * All TypeScript interfaces mirroring the backend API contracts.
 * These types are the source of truth for the UI — build components
 * against these even if the real backend response differs slightly.
 * =================================================================== */

// ─── Auth ────────────────────────────────────────────────────────────

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  officer: OfficerProfile;
}

export interface OfficerProfile {
  id: string;
  name: string;
  badge: string;
  rank: string;
  station: string;
  avatar?: string;
}

// ─── Citizen: Report ─────────────────────────────────────────────────

export interface ReportPayload {
  phone: string;
  description: string;
  screenshot?: File;
  currencyImage?: File;
  audio?: File;
  video?: File;
  lat?: number;
  lng?: number;
}

export interface ReportResponse {
  success: boolean;
  complaintId: string;
  message: string;
}

// ─── Citizen: Currency Detection ─────────────────────────────────────

export interface CurrencyDetectionResult {
  result: "Real" | "Fake";
  confidence: number; // 0-100
  missingSecurityFeatures: string[];
  aiExplanation: string;
}

// ─── Citizen: Scam Text Detection ────────────────────────────────────

export type ScamSource = "sms" | "whatsapp" | "email" | "audio";

export interface ScamDetectRequest {
  text?: string;
  source: ScamSource;
  audioFile?: File;
}

export interface ScamDetectionResult {
  risk: "Low" | "Medium" | "High";
  reason: string;
  confidence?: number;
}

// ─── Alerts & Heatmap ────────────────────────────────────────────────

export type AlertType = "scam" | "counterfeit";

export interface AlertItem {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  lat: number;
  lng: number;
  date: string;
  severity: "low" | "medium" | "high";
}

export interface HeatmapPoint {
  lat: number;
  lng: number;
  intensity: number;
}

// ─── Police: Dashboard ───────────────────────────────────────────────

export interface DashboardMetrics {
  todayComplaints: MetricCard;
  counterfeitCases: MetricCard;
  activeFraudRings: MetricCard;
  highRiskAreas: MetricCard;
  aiAlerts: MetricCard;
  officersOnline?: number;
  resolutionRate?: number;
}

export interface MetricCard {
  value: number;
  trend: "up" | "down" | "neutral";
  trendValue?: number;
}

// ─── Police: Cases / Complaints ──────────────────────────────────────

export type CaseStatus = "open" | "investigating" | "resolved" | "closed";
export type CaseType = "scam" | "counterfeit" | "fraud_call" | "digital_arrest";

export interface CaseListItem {
  id: string;
  citizenName: string;
  citizenPhone: string;
  type: CaseType;
  status: CaseStatus;
  officerAssigned: string;
  createdAt: string;
  summary: string;
}

export interface CaseDetail extends CaseListItem {
  description: string;
  attachments: Attachment[];
  statusHistory: StatusHistoryEntry[];
  location?: { lat: number; lng: number };
}

export interface Attachment {
  id: string;
  type: "image" | "audio" | "video" | "document";
  url: string;
  name: string;
}

export interface StatusHistoryEntry {
  status: CaseStatus;
  changedBy: string;
  changedAt: string;
  note?: string;
}

export interface CaseUpdatePayload {
  status?: CaseStatus;
  officerAssigned?: string;
  note?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CaseQueryParams {
  page?: number;
  pageSize?: number;
  status?: CaseStatus;
  type?: CaseType;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

// ─── Police: Map ─────────────────────────────────────────────────────

export type MarkerType = "scam_report" | "fake_currency" | "fraud_call";

export interface MapMarker {
  id: string;
  type: MarkerType;
  lat: number;
  lng: number;
  severity: "low" | "medium" | "high";
  title: string;
  summary: string;
  date: string;
  caseId?: string;
}

// ─── Police: Analytics / Statistics ──────────────────────────────────

export interface StatisticsData {
  dailyComplaints: ChartDataPoint[];
  weeklyComplaints: ChartDataPoint[];
  scamTypes: PieChartDataPoint[];
  stateWiseCases: ChartDataPoint[];
  counterfeitAccuracy: ChartDataPoint[];
  totalReportsAnalyzed: number;
  totalFakeCurrencyDetected: number;
  totalActiveOfficers: number;
}

export interface ChartDataPoint {
  label: string;
  value: number;
}

export interface PieChartDataPoint {
  name: string;
  value: number;
  color: string;
}

// ─── Police: Fraud Network (optional) ────────────────────────────────

export type FraudNodeType = "account" | "phone" | "device";

export interface FraudNetworkData {
  nodes: FraudNode[];
  edges: FraudEdge[];
}

export interface FraudNode {
  id: string;
  label: string;
  type: FraudNodeType;
  riskScore?: number;
}

export interface FraudEdge {
  source: string;
  target: string;
  relationship: string;
  strength: number; // 0-1
}

// ─── Police: AI Alerts ───────────────────────────────────────────────

export interface AIAlert {
  id: string;
  title: string;
  description: string;
  confidence: number;
  location: string;
  timestamp: string;
  isRead: boolean;
  severity: "low" | "medium" | "high";
}
