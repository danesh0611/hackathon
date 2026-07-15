from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Officer(Base):
    __tablename__ = "officers"

    id = Column(String, primary_key=True, index=True)
    badge = Column(String, unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    rank = Column(String, nullable=False)
    station = Column(String, nullable=False)
    hashed_password = Column(String, nullable=False)

class Case(Base):
    __tablename__ = "cases"

    id = Column(String, primary_key=True, index=True)
    citizen_name = Column(String, nullable=False)
    citizen_phone = Column(String, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="open")
    officer_assigned = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    summary = Column(String, nullable=False)
    description = Column(String, nullable=True)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    closed_at = Column(DateTime, nullable=True)

class MapMarker(Base):
    __tablename__ = "map_markers"

    id = Column(String, primary_key=True, index=True)
    type = Column(String, nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    severity = Column(String, nullable=False)
    title = Column(String, nullable=False)
    summary = Column(String, nullable=False)
    date = Column(String, nullable=False)
    case_id = Column(String, nullable=True)

class AIAlert(Base):
    __tablename__ = "ai_alerts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    confidence = Column(Integer, nullable=False)
    location = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
    is_read = Column(Boolean, default=False)
    severity = Column(String, nullable=False)

class GraphNode(Base):
    __tablename__ = "graph_nodes"

    id = Column(String, primary_key=True, index=True)
    label = Column(String, nullable=False)
    type = Column(String, nullable=False)
    risk_score = Column(Float, nullable=False)

class GraphEdge(Base):
    __tablename__ = "graph_edges"

    id = Column(Integer, primary_key=True, autoincrement=True)
    source_id = Column(String, nullable=False)
    target_id = Column(String, nullable=False)
    relationship = Column(String, nullable=False)
    strength = Column(Float, nullable=False)

# Storing dynamic dashboard statistics simply as a key-value JSON store for flexibility
class DashboardStatistic(Base):
    __tablename__ = "dashboard_statistics"

    key = Column(String, primary_key=True, index=True)
    value = Column(JSON, nullable=False)
