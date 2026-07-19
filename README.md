ScamGuard: Comprehensive Project Documentation
1. Project Overview
ScamGuard (also known as ScamShield Pro) is a next-generation, AI-powered platform designed to combat the rapidly evolving landscape of digital fraud. By bridging the gap between public safety and law enforcement, ScamGuard provides real-time protection for citizens and advanced investigative tools for the police.

The platform is split into a Dual-Portal Ecosystem, ensuring that reporting is frictionless for the public while providing law enforcement with a highly technical, data-rich environment to track down organized crime syndicates.

2. Core Features
2.1 Citizen Portal (Public-Facing)
The Citizen Portal focuses on prevention, awareness, and secure reporting.

Scam Analyzer (Audio & Text): Citizens can upload suspicious audio recordings (e.g., deepfake calls, WhatsApp voice notes) or paste text messages. The AI transcribes the audio and analyzes the content to provide a "Scam Probability Score" and actionable advice.
Counterfeit Currency Checker: Utilizes computer vision to analyze uploaded images of currency notes, instantly flagging potential counterfeits.
Frictionless Scam Reporting: A streamlined form allows victims to report scams with automatic geolocation tagging, multimedia evidence uploads, and specific fields for suspect phone numbers or UPI IDs.
Nearby Alerts: A live, interactive community map that displays active scam clusters based on the user's current location, warning them of localized threats (e.g., ATM skimming hotspots).
Complaint Tracking: Citizens can track the status of their submitted reports in real-time.
2.2 Police Portal (Law Enforcement)
The Police Portal is a secure, authenticated dashboard designed to accelerate investigations.

Graph AI Fraud Network: The flagship investigative tool. It visually maps complex criminal networks using a Force-Directed Graph. It automatically extracts entities (Phone Numbers, UPI IDs, IP Addresses) from citizen reports and links them together, revealing organized fraud rings (e.g., multiple victims linked to the same scammer phone number).
Live Heatmap & Geospatial Tracking: Visualizes crime hotspots across the city or state, allowing for optimized deployment of police resources.
Advanced Analytics Dashboard: Real-time metrics on daily complaints, resolution rates, trending scam types (e.g., "Digital Arrest" vs. "Counterfeit"), and active AI alerts.
Automated Intelligence Extraction: When a report is submitted, the backend automatically uses NLP and Regex to parse the description, dynamically updating the database with new suspects without requiring manual data entry.
3. Technology Stack
ScamGuard is built on a modern, highly scalable microservices architecture.

3.1 Frontend (Client)
Framework: React 18 with TypeScript
Build Tool: Vite (for rapid HMR and optimized production bundling)
Styling: Tailwind CSS (utility-first CSS with dark-mode support)
State Management: Redux Toolkit
Routing: React Router DOM (v6)
Data Visualization: Recharts (Analytics), react-force-graph-2d (Graph AI Network)
Icons & UI Components: Lucide React, Radix UI primitives
3.2 Police Operations Backend (Microservice 1)
Framework: FastAPI (Python)
Database: SQLite with SQLAlchemy ORM
Authentication: JWT (JSON Web Tokens) with Passlib (SHA256 Crypt)
Role: Handles all relational data including Case Management, Officer Profiles, Map Markers, and Graph Node/Edge generation. (Runs on Port 8002).
3.3 AI Analytics Backend (Microservice 2)
Framework: FastAPI (Python)
Audio Transcription: Supports local Whisper models, AWS Transcribe, and Azure OpenAI Speech-to-Text.
NLP & Scam Detection: Integrates with large language models (Meta Llama 3 via AWS Bedrock) to analyze transcripts and text for malicious intent, urgency markers, and deepfake signatures.
Role: Dedicated exclusively to heavy machine learning and AI inference tasks to prevent blocking the operational database. (Runs on Port 8000).
4. System Architecture & Data Flow
Reverse Proxy (NGINX): Deployed on an Azure Virtual Machine, NGINX acts as the API Gateway.
Requests to /api/scamshield/* are routed to the AI Backend.
Requests to /api/* are routed to the Police Backend.
All other requests serve the React Single Page Application (SPA).
Graph Extraction Pipeline:
Frontend sends multipart/form-data containing the scam report.
Police Backend receives the payload, creates a Case record, and triggers the Graph Generator.
The Graph Generator extracts standard strings (10-digit phones, UPI patterns) using Regex.
Nodes (scam_report, victim, suspect) and Edges (reported_by, mentions_suspect) are instantly committed to the database.
Process Management: PM2 is utilized on the server to run both Python FastAPI applications continuously as background daemons, ensuring zero downtime and auto-restarts on crash.
5. Security & Privacy
Role-Based Access Control (RBAC): Police dashboards are strictly protected by JWT authentication; unauthenticated users are seamlessly redirected.
Data Minimization: The Graph AI extracts only necessary identifiers (Phone, UPI) to establish links, while keeping citizen identities segregated.
CORS Protection: Cross-Origin Resource Sharing is strictly configured to only allow requests from the designated frontend domain.
