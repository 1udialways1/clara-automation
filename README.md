# Clara Answers – Technical Associate Intern Assignment

**Technical Associate – Clara Answers Intern Assignment Implementation**

This repository implements a zero-cost, end-to-end automation pipeline that processes:

- 5 Demo Call Transcripts
- 5 Onboarding Call Transcripts

It generates:

- Versioned Account Memos (v1 and v2)
- Retell Agent Draft Specifications (v1 and v2)
- Field-level Change Logs
- Task Tracking Records

The system runs entirely locally using Node.js and Docker (n8n self-hosted).  
No paid APIs or external LLM services are used.

---

## Overview

This project simulates Clara Answers' real-world workflow:

Demo Call → Structured Account Memo (v1)  
Onboarding Call → Confirmed Account Memo (v2)  
→ Retell Agent Configuration Draft  
→ Versioned Change Tracking  

The system emphasizes:

- Structured extraction
- Explicit versioning
- Safe patch application
- Change transparency
- Reproducibility
- Zero-cost compliance

---

## Architecture
Demo Transcript (.txt)
→ extractDemo.js
→ account_memo (v1)
→ generateAgent.js
→ agent_spec (v1)
→ applyOnboarding.js
→ updated memo (v2)
→ generateAgent.js
→ agent_spec (v2)
→ changes.json
→ taskTracker.js

**Orchestration Layer:** Docker + n8n  
**Execution Layer:** Node.js scripts  

---

## Folder Structure
clara-automation/
│
├── data/
│ ├── demo/ # 5 demo transcripts
│ └── onboarding/ # 5 onboarding transcripts
│
├── scripts/
│ ├── extractDemo.js
│ ├── applyOnboarding.js
│ ├── generateAgent.js
│ └── taskTracker.js
│
├── outputs/
│ ├── abc_fire_protection/
│ │ ├── v1/
│ │ │ ├── memo.json
│ │ │ └── agent_spec.json
│ │ ├── v2/
│ │ │ ├── memo.json
│ │ │ └── agent_spec.json
│ │ └── changes.json
│ └── ... (5 accounts total)
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

## Dataset Assumptions

This repository assumes:

- 5 demo transcripts in `data/demo/`
- 5 onboarding transcripts in `data/onboarding/`

All 10 files are processed in batch.

---

## How to Run Locally

### Prerequisites

- Node.js (v18+ recommended)
- Docker Desktop installed and running

---

### Example Output

```json
{
  "company_name": "ABC Fire Protection",
  "business_hours": "Mon-Fri 8am-6pm",
  "services_supported": [
    "sprinkler repair",
    "inspection"
  ]
}
```
### Batch Run (All Accounts)

Run the full dataset end-to-end:

``` bash
npm start
or
node runAll.js
```
This will:

Process 5 demo transcripts → v1 memos

Generate 5 agent_spec (v1)

Process 5 onboarding transcripts → v2 memos

Generate 5 agent_spec (v2)

Produce changes.json per account

Log task stages in tracking/tasks.json

The pipeline is idempotent — running it multiple times safely overwrites structured outputs without duplication.

Orchestrator (n8n)

Start Docker:

docker compose up

Open:

http://localhost:5678

Import:

workflows/n8n-workflow.json

The file workflows/n8n-workflow.json is the exact exported workflow from n8n and can be imported directly without additional configuration.

Output Artifacts

For each account:

v1/memo.json

v1/agent_spec.json

v2/memo.json

v2/agent_spec.json

changes.json

Example changes.json
{
  "version_from": "v1",
  "version_to": "v2",
  "detailed_changes": [
    {
      "field": "business_hours",
      "old": "Mon-Fri 9-5",
      "new": "Mon-Fri 8-6",
      "reason": "Confirmed during onboarding call"
    }
  ]
}

No hallucinated fields are introduced.
Missing data is placed in questions_or_unknowns.

Retell Setup & Manual Import

This project generates Retell Agent Draft Specifications as JSON files.
To maintain zero-cost compliance, the Retell API is not called directly.

Step 1 — Create Free Retell Account

Go to https://retellai.com

Sign up for the free tier

Create a new Voice Agent

Step 2 — Locate Generated Spec

Example:

outputs/abc_fire_protection/v2/agent_spec.json
Step 3 — Manual Import

Open the agent_spec.json file

Copy:

Agent name

System prompt

Flow logic

Transfer rules

Paste into Retell UI fields

Save the agent

This mirrors how production systems would push configuration via API.

Mapping to Assignment Requirements
Pipeline A (Demo → v1)

Ingest demo transcript

Extract structured Account Memo JSON

Generate Retell Agent Draft Spec v1

Store outputs in versioned folders

Create task tracker entry

Pipeline B (Onboarding → v2)

Ingest onboarding transcript

Apply structured patch

Generate Retell Agent Draft Spec v2

Produce field-level changelog

Log task tracker entry

Non-Functional Requirements

Zero-cost (no paid APIs used)

End-to-end batch execution

Idempotent processing

Local orchestration via Docker + n8n

Clear versioning and diff tracking

Reproducible folder structure

Zero-Cost Compliance

No paid APIs

No external LLM services

No cloud compute

Rule-based extraction

Self-hosted n8n via Docker

Local JSON storage

Limitations

Extraction is rule-based (not LLM-powered)

Transcript phrasing variations may reduce extraction accuracy

Retell integration is manual (spec-only mode)

No production database

Future Improvements

LLM-based structured extraction

Direct Retell API integration

Persistent database storage

Admin dashboard for diff visualization

Robust schema validation

Conclusion

This implementation demonstrates:

Systems thinking

Structured schema design

Version-controlled automation

Safe patch merging

Explicit change tracking

Zero-cost execution

Reproducible orchestration

The pipeline is complete, versioned, batch-capable, and aligned with the Clara Answers assignment requirements.
