import datetime
from sqlalchemy.orm import Session
from passlib.context import CryptContext
import json

from database import engine, SessionLocal
import models

pwd_context = CryptContext(schemes=["sha256_crypt"], deprecated="auto")

def seed_db():
    print("Creating tables...")
    models.Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    
    try:
        # Check if already seeded
        if db.query(models.Officer).first():
            print("Database already seeded! Skipping...")
            return

        print("Seeding Officer...")
        officer = models.Officer(
            id="OFF-001",
            badge="POL-12345",
            name="Insp. Rajesh Kumar",
            rank="Inspector",
            station="Cyber Crime Cell, Chennai",
            hashed_password=pwd_context.hash("password123")
        )
        db.add(officer)
        
        print("Seeding Cases...")
        cases = [
            models.Case(id="CMP-2026-0001", citizen_name="Anita Sharma", citizen_phone="+91 98765 43210", type="scam", status="open", officer_assigned="Insp. Kumar", summary="Digital arrest scam — caller impersonated CBI officer", description="Victim transferred money.", lat=13.0827, lng=80.2707),
            models.Case(id="CMP-2026-0002", citizen_name="Ravi Patel", citizen_phone="+91 87654 32109", type="counterfeit", status="investigating", officer_assigned="SI Meena", summary="Fake ₹500 notes received at grocery store", description="Found in cash register.", lat=13.0604, lng=80.2496),
        ]
        db.add_all(cases)
        
        print("Seeding Map Markers...")
        markers = [
            models.MapMarker(id="M-001", type="scam_report", lat=13.0827, lng=80.2707, severity="high", title="Digital Arrest Scam", summary="CBI impersonation scam cluster", date="2026-07-08", case_id="CMP-2026-0001"),
            models.MapMarker(id="M-002", type="fake_currency", lat=13.0604, lng=80.2496, severity="medium", title="Counterfeit ₹500", summary="Fake notes at T. Nagar market", date="2026-07-07", case_id="CMP-2026-0002")
        ]
        db.add_all(markers)
        
        print("Seeding AI Alerts...")
        alerts = [
            models.AIAlert(id="AIA-001", title="Digital Arrest Scam Cluster", description="5 reports of CBI impersonation in last 2 hours — Chennai Central", confidence=98, location="Chennai Central", severity="high")
        ]
        db.add_all(alerts)
        
        print("Seeding Graph Network...")
        nodes = [
            models.GraphNode(id="N1", label="SBI Acc. ***4521", type="account", risk_score=0.95),
            models.GraphNode(id="N2", label="+91 98765 XXXXX", type="phone", risk_score=0.9),
            models.GraphNode(id="N3", label="Device #A7F3", type="device", risk_score=0.85)
        ]
        db.add_all(nodes)
        
        edges = [
            models.GraphEdge(source_id="N1", target_id="N2", relationship="registered_phone", strength=0.95),
            models.GraphEdge(source_id="N2", target_id="N3", relationship="used_device", strength=0.9)
        ]
        db.add_all(edges)
        
        print("Seeding Dashboard Stats...")
        dash_metrics = {
            "todayComplaints": {"value": 47, "trend": "up", "trendValue": 12},
            "counterfeitCases": {"value": 156, "trend": "down", "trendValue": 3},
            "activeFraudRings": {"value": 8, "trend": "up", "trendValue": 2},
            "highRiskAreas": {"value": 12, "trend": "neutral"},
            "aiAlerts": {"value": 23, "trend": "up", "trendValue": 7}
        }
        db.add(models.DashboardStatistic(key="dashboard_metrics", value=dash_metrics))
        
        full_stats = {
          "dailyComplaints": [{"label": "Mon", "value": 23}, {"label": "Tue", "value": 35}],
          "weeklyComplaints": [{"label": "Week 1", "value": 120}],
          "scamTypes": [{"name": "Digital Arrest", "value": 35, "color": "#EF4444"}],
          "stateWiseCases": [{"label": "Tamil Nadu", "value": 245}],
          "counterfeitAccuracy": [{"label": "Jan", "value": 87}],
          "totalReportsAnalyzed": 15847,
          "totalFakeCurrencyDetected": 3291,
          "totalActiveOfficers": 234
        }
        db.add(models.DashboardStatistic(key="statistics_data", value=full_stats))
        
        db.commit()
        print("Successfully seeded all data!")
        
    except Exception as e:
        print(f"Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    seed_db()
