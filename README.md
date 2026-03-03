# Clara Answers – Zero-Cost Automation Pipeline

## Overview

This project implements a fully automated, zero-cost pipeline that converts:

Demo Call Transcript  
→ Structured Account Memo (v1)  
→ Retell Agent Draft Specification  
→ Onboarding Updates  
→ Versioned Agent Revision (v2)

The system simulates Clara Answers’ real-world onboarding workflow:

Human conversations → Structured operational rules → AI voice agent configuration.

The entire solution runs locally using:

- Node.js
- Docker
- n8n (self-hosted)
- JSON file storage

No paid APIs, external LLMs, or paid services are used.

---

# Architecture & Data Flow
Demo Transcript (.txt)
↓
extractDemo.js
↓
v1 Account Memo (JSON)
↓
generateAgent.js
↓
v1 Retell Agent Spec
↓
Onboarding Transcript (.txt)
↓
applyOnboarding.js
↓
Conflict-aware Patch Merge
↓
v2 Account Memo
↓
generateAgent.js
↓
v2 Retell Agent Spec
↓
Task Tracker Log


n8n (Docker) acts as the orchestration layer.
The full automation pipeline is executed via:


node runAll.js


This ensures:

- Zero-cost compliance
- Reproducibility
- Local execution
- Batch processing
- Idempotency

---

# Folder Structure


clara-automation/
│
├── data/
│ ├── demo/
│ └── onboarding/
│
├── scripts/
│ ├── extractDemo.js
│ ├── applyOnboarding.js
│ ├── generateAgent.js
│ ├── taskTracker.js
│ └── runAll.js
│
├── outputs/
│ └── <account_id>/
│ ├── v1/
│ ├── v2/
│ └── changes.json
│
├── tracking/
│ └── tasks.json
│
├── workflows/
│ └── n8n-workflow.json
│
├── docker-compose.yml
├── package.json
└── README.md


---

# How to Run Locally

## 1️⃣ Prerequisites

- Node.js (v18+ recommended)
- Docker Desktop installed and running

---

## 2️⃣ Run Full Pipeline


npm start


or


node runAll.js


This will:

- Process all demo transcripts
- Generate v1 memos
- Generate v1 agent specs
- Apply onboarding updates
- Generate v2 memos
- Generate v2 agent specs
- Log task tracker entries

---

# Running via Docker + n8n (Orchestrator Layer)

## 1️⃣ Start Docker


docker compose up


## 2️⃣ Open n8n


http://localhost:5678


## 3️⃣ Import Workflow

Import:


workflows/n8n-workflow.json


## 4️⃣ Execute Workflow

Click "Execute Workflow".

The workflow acts as orchestration trigger.
The actual automation pipeline runs locally via:


node runAll.js


---

# Account Memo Schema

Each memo includes:

- account_id
- company_name
- business_hours
- office_address
- services_supported
- emergency_definition
- emergency_routing_rules
- non_emergency_routing_rules
- call_transfer_rules
- integration_constraints
- after_hours_flow_summary
- office_hours_flow_summary
- questions_or_unknowns
- notes

Missing data is explicitly flagged under `questions_or_unknowns`.
No hallucinated values are added.

---

# Versioning & Conflict Handling

- v1 = Demo-derived assumptions
- v2 = Onboarding-confirmed configuration
- Field-level conflict tracking
- Safe array merging
- No unrelated fields overwritten
- Explicit change logging in `changes.json`

Each `changes.json` includes:

- version_from
- version_to
- applied_patch
- detailed_changes (field-level diff)

---

# Task Tracker

The system includes a lightweight task tracker:


tracking/tasks.json


Each stage logs:

- account_id
- stage (demo_processed / onboarding_processed)
- timestamp
- status

This simulates integration with a task management system.

---

# Zero-Cost Compliance

This project strictly follows zero-spend constraints:

- No paid APIs
- No external LLM calls
- No cloud services
- Rule-based extraction only
- Self-hosted Docker + n8n

All components are fully reproducible locally.

---

# Idempotency & Reliability

- Running the pipeline multiple times does not corrupt data.
- Patches are applied only if changes are detected.
- Outputs are versioned cleanly.
- Folder structure is deterministic.

---

# Known Limitations

- Extraction is rule-based (not LLM-powered).
- Transcript phrasing variations may affect detection accuracy.
- No direct Retell API integration (spec generated as JSON draft).
- No UI dashboard or diff visualizer (future enhancement).

---

# Future Improvements (Production Version)

With production access:

- LLM-based structured extraction
- Direct Retell API integration
- Real task management integration (e.g., Asana/Supabase)
- Structured onboarding form ingestion
- Advanced rule engine for routing logic
- UI dashboard with diff viewer

---

# What This Demonstrates

- Systems thinking
- Schema design for operational logic
- Safe automation under uncertainty
- Version-controlled AI agent configuration
- Clear separation of exploratory vs confirmed data
- Reproducible infrastructure

