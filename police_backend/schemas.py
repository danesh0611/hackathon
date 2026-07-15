from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class LoginRequest(BaseModel):
    username: str
    password: str

class OfficerProfile(BaseModel):
    id: str
    name: str
    badge: str
    rank: str
    station: str
    avatar: Optional[str] = None

class LoginResponse(BaseModel):
    token: str
    officer: OfficerProfile

class CaseListItem(BaseModel):
    id: str
    citizenName: str
    citizenPhone: str
    type: str
    status: str
    officerAssigned: Optional[str] = None
    createdAt: str
    summary: str

    class Config:
        orm_mode = True

class CaseUpdatePayload(BaseModel):
    status: Optional[str] = None
    officerAssigned: Optional[str] = None
    note: Optional[str] = None

class MapMarker(BaseModel):
    id: str
    type: str
    lat: float
    lng: float
    severity: str
    title: str
    summary: str
    date: str
    caseId: Optional[str] = None

    class Config:
        orm_mode = True

class AIAlert(BaseModel):
    id: str
    title: str
    description: str
    confidence: int
    location: str
    timestamp: str
    isRead: bool
    severity: str

    class Config:
        orm_mode = True

class GraphNode(BaseModel):
    id: str
    label: str
    type: str
    riskScore: float

class GraphEdge(BaseModel):
    source: str
    target: str
    relationship: str
    strength: float

class FraudNetworkData(BaseModel):
    nodes: List[GraphNode]
    edges: List[GraphEdge]

class PaginatedCaseResponse(BaseModel):
    data: List[CaseListItem]
    total: int
    page: int
    pageSize: int
    totalPages: int

class TrendMetric(BaseModel):
    value: int
    trend: str
    trendValue: Optional[int] = None

class DashboardMetrics(BaseModel):
    todayComplaints: TrendMetric
    counterfeitCases: TrendMetric
    activeFraudRings: TrendMetric
    highRiskAreas: TrendMetric
    aiAlerts: TrendMetric
    officersOnline: Optional[int] = None
    resolutionRate: Optional[int] = None
    officersOnline: Optional[int] = None
    resolutionRate: Optional[int] = None
