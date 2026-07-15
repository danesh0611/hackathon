import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status, Form, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import json

import models, schemas, database
from database import get_db

# Create DB tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Police Dashboard API")

# Setup CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Auth setup
SECRET_KEY = "HACKATHON_SUPER_SECRET_KEY"
ALGORITHM = "HS256"
pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(hours=24)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

@app.post("/api/login", response_model=schemas.LoginResponse)
def login(payload: schemas.LoginRequest, db: Session = Depends(get_db)):
    officer = db.query(models.Officer).filter(models.Officer.badge == payload.username).first()
    if not officer or not pwd_context.verify(payload.password, officer.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect badge number or password",
        )
    
    token = create_access_token(data={"sub": officer.badge, "name": officer.name})
    
    return schemas.LoginResponse(
        token=token,
        officer=schemas.OfficerProfile(
            id=officer.id,
            name=officer.name,
            badge=officer.badge,
            rank=officer.rank,
            station=officer.station
        )
    )

@app.get("/api/dashboard", response_model=schemas.DashboardMetrics)
def get_dashboard(db: Session = Depends(get_db)):
    from sqlalchemy import func
    today = datetime.utcnow().date()
    
    # Calculate today's complaints
    today_count = db.query(models.Case).filter(func.date(models.Case.created_at) == today).count()
    
    # Counterfeit cases
    counterfeit_count = db.query(models.Case).filter(models.Case.type == "counterfeit").count()
    
    # Unread AI Alerts
    unread_alerts = db.query(models.AIAlert).filter(models.AIAlert.is_read == False).count()
    
    # High Risk Areas
    high_risk_areas = db.query(models.MapMarker).filter(models.MapMarker.severity == "high").count()

    # Active Officers
    active_officers = db.query(models.Officer).count()
    
    # Resolution Rate
    total = db.query(models.Case).count()
    resolved = db.query(models.Case).filter(models.Case.status.in_(["resolved", "closed"])).count()
    resolution_rate = int((resolved / total * 100)) if total > 0 else 0

    return {
        "todayComplaints": {"value": today_count, "trend": "up", "trendValue": 0},
        "counterfeitCases": {"value": counterfeit_count, "trend": "neutral", "trendValue": 0},
        "activeFraudRings": {"value": 3, "trend": "up", "trendValue": 1}, # Fixed for MVP
        "highRiskAreas": {"value": high_risk_areas, "trend": "up"},
        "aiAlerts": {"value": unread_alerts, "trend": "up", "trendValue": 0},
        "officersOnline": active_officers,
        "resolutionRate": resolution_rate
    }

@app.get("/api/cases", response_model=schemas.PaginatedCaseResponse)
def get_cases(status: str = None, type: str = None, search: str = None, page: int = 1, pageSize: int = 10, db: Session = Depends(get_db)):
    query = db.query(models.Case)
    if status:
        query = query.filter(models.Case.status == status)
    if type:
        query = query.filter(models.Case.type == type)
    if search:
        query = query.filter(models.Case.citizen_name.ilike(f"%{search}%") | models.Case.id.ilike(f"%{search}%"))
    
    total = query.count()
    cases = query.offset((page - 1) * pageSize).limit(pageSize).all()
    
    formatted_cases = []
    for c in cases:
        formatted_cases.append(schemas.CaseListItem(
            id=c.id,
            citizenName=c.citizen_name,
            citizenPhone=c.citizen_phone,
            type=c.type,
            status=c.status,
            officerAssigned=c.officer_assigned,
            createdAt=c.created_at.isoformat(),
            summary=c.summary
        ))
    
    return schemas.PaginatedCaseResponse(
        data=formatted_cases,
        total=total,
        page=page,
        pageSize=pageSize,
        totalPages=(total + pageSize - 1) // pageSize
    )

@app.get("/api/case/{id}")
def get_case_detail(id: str, db: Session = Depends(get_db)):
    c = db.query(models.Case).filter(models.Case.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    
    return {
        "id": c.id,
        "citizenName": c.citizen_name,
        "citizenPhone": c.citizen_phone,
        "type": c.type,
        "status": c.status,
        "officerAssigned": c.officer_assigned,
        "createdAt": c.created_at.isoformat(),
        "summary": c.summary,
        "description": c.description,
        "location": {"lat": c.lat, "lng": c.lng} if c.lat and c.lng else None,
        "attachments": [],
        "statusHistory": []
    }

@app.put("/api/case/{id}")
def update_case(id: str, payload: schemas.CaseUpdatePayload, db: Session = Depends(get_db)):
    c = db.query(models.Case).filter(models.Case.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Case not found")
    
    if payload.status:
        c.status = payload.status
        if payload.status == "resolved" or payload.status == "closed":
            c.closed_at = datetime.utcnow()
    if payload.officerAssigned:
        c.officer_assigned = payload.officerAssigned
        
    db.commit()
    db.refresh(c)
    return get_case_detail(id, db)

@app.get("/api/map", response_model=list[schemas.MapMarker])
def get_map_markers(db: Session = Depends(get_db)):
    markers = db.query(models.MapMarker).all()
    return [schemas.MapMarker(
        id=m.id, type=m.type, lat=m.lat, lng=m.lng, 
        severity=m.severity, title=m.title, summary=m.summary, 
        date=m.date, caseId=m.case_id
    ) for m in markers]

@app.get("/api/alerts", response_model=list[schemas.AIAlert])
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(models.AIAlert).all()
    return [schemas.AIAlert(
        id=a.id, title=a.title, description=a.description,
        confidence=a.confidence, location=a.location,
        timestamp=a.timestamp.isoformat(), isRead=a.is_read, severity=a.severity
    ) for a in alerts]

@app.get("/api/fraud-network", response_model=schemas.FraudNetworkData)
def get_fraud_network(db: Session = Depends(get_db)):
    nodes = db.query(models.GraphNode).all()
    edges = db.query(models.GraphEdge).all()
    
    return schemas.FraudNetworkData(
        nodes=[schemas.GraphNode(id=n.id, label=n.label, type=n.type, riskScore=n.risk_score) for n in nodes],
        edges=[schemas.GraphEdge(source=e.source_id, target=e.target_id, relationship=e.relationship, strength=e.strength) for e in edges]
    )

@app.get("/api/statistics")
def get_statistics(db: Session = Depends(get_db)):
    from sqlalchemy import func
    
    # 1. Total Reports Analyzed
    total_reports = db.query(models.Case).count()
    
    # 2. Total Fake Currency Detected
    fake_currency = db.query(models.Case).filter(models.Case.type == "counterfeit").count()
    
    # 3. Total Active Officers
    active_officers = db.query(models.Officer).count()
    
    # 4. Scam Types (Pie Chart Data)
    type_counts = db.query(models.Case.type, func.count(models.Case.id)).group_by(models.Case.type).all()
    
    color_map = {
        "scam": "#EF4444",
        "counterfeit": "#F59E0B",
        "fraud_call": "#8B5CF6",
        "digital_arrest": "#3B82F6"
    }
    
    scam_types = []
    for case_type, count in type_counts:
        name_formatted = case_type.replace('_', ' ').title()
        color = color_map.get(case_type, "#10B981")
        scam_types.append({"name": name_formatted, "value": count, "color": color})
        
    # 5. Average Resolution Time (in days)
    # Get all closed cases
    closed_cases = db.query(models.Case).filter(models.Case.closed_at != None).all()
    
    total_days = 0
    if len(closed_cases) > 0:
        for c in closed_cases:
            diff = c.closed_at - c.created_at
            total_days += diff.total_seconds() / (24 * 3600)
        avg_resolution_days = round(total_days / len(closed_cases), 1)
    else:
        avg_resolution_days = 0 # No closed cases yet
        
    # 6. Resolution by day (Mocking for last 7 days based on data)
    weekly_resolution = [
        {"day": "Mon", "resolved": len(closed_cases)},
        {"day": "Tue", "resolved": 0},
        {"day": "Wed", "resolved": 0},
        {"day": "Thu", "resolved": 0},
        {"day": "Fri", "resolved": 0},
        {"day": "Sat", "resolved": 0},
        {"day": "Sun", "resolved": 0}
    ]

    return {
        "dailyComplaints": [],
        "weeklyComplaints": [],
        "scamTypes": scam_types,
        "stateWiseCases": [{"label": "Tamil Nadu", "value": total_reports}],
        "counterfeitAccuracy": [],
        "totalReportsAnalyzed": total_reports,
        "totalFakeCurrencyDetected": fake_currency,
        "totalActiveOfficers": active_officers,
        "avgResolutionTime": avg_resolution_days,
        "weeklyResolutionData": weekly_resolution
    }

@app.post("/api/report")
def submit_report(
    phone: str = Form(...),
    description: str = Form(...),
    lat: float = Form(...),
    lng: float = Form(...),
    screenshot: UploadFile = File(None),
    currencyImage: UploadFile = File(None),
    audio: UploadFile = File(None),
    video: UploadFile = File(None),
    db: Session = Depends(get_db)
):
    import random
    case_id = f"CMP-2026-{random.randint(1000, 9999)}"
    
    # Simple logic to guess type based on description
    case_type = "scam"
    if "fake" in description.lower() or currencyImage:
        case_type = "counterfeit"
    elif "call" in description.lower() or audio:
        case_type = "fraud_call"
    
    new_case = models.Case(
        id=case_id,
        citizen_name="Anonymous Citizen",
        citizen_phone=phone,
        type=case_type,
        status="open",
        summary=description[:50] + "..." if len(description) > 50 else description,
        description=description,
        lat=lat,
        lng=lng
    )
    db.add(new_case)
    db.commit()
    
    return {
        "success": True,
        "complaintId": case_id,
        "message": "Your complaint has been registered successfully. An officer will review it shortly."
    }

@app.get("/api/map-alerts")
def get_alerts(lat: float = None, lng: float = None, radius: float = None, db: Session = Depends(get_db)):
    # Return map markers as alerts
    markers = db.query(models.MapMarker).all()
    alerts = []
    for m in markers:
        alerts.append({
            "id": m.id,
            "type": m.type,
            "title": m.title,
            "description": "Reported incident in your vicinity.",
            "lat": m.lat,
            "lng": m.lng,
            "date": datetime.utcnow().strftime("%Y-%m-%d"),
            "severity": m.severity
        })
    return alerts

@app.get("/api/heatmap")
def get_heatmap(db: Session = Depends(get_db)):
    # Generate heatmap points from all real cases
    cases = db.query(models.Case).filter(models.Case.lat != None).all()
    points = []
    for c in cases:
        points.append({
            "lat": c.lat,
            "lng": c.lng,
            "intensity": 0.8 if c.status == "open" else 0.4
        })
    return points

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
