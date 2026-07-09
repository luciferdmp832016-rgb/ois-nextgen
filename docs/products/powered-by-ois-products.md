# Powered by OIS Products

Stage 2F introduces a canonical product registry for OIS-powered products.

| Product key | Display name | Type | Stage 2F status |
|---|---|---|---|
| OIS_PLATFORM | OIS Platform | Core platform | Enabled. Mounted widget and Learning Center foundation. |
| PITS | PITS | Ecosystem product | Enabled registry/context support. Runtime behavior remains staged by prior PITS phases. |
| OIMA | OIMA — Organizational Intelligence Meeting Agent | Meeting intelligence product | Stage 2H product boundary ready. Transcript-first and audio-optional; no meeting upload or analysis runtime yet. |
| KEIHB | KEIHB | Future product | Registry, adapter and extension point only. |
| ICR | ICR | Future product | Registry, adapter and extension point only. |
| CSAGENT | CSAgent | Future product | Registry, adapter and extension point only. |
| FUTURE_PRODUCT | Future Product | Future product | Extension slot. |
| CUSTOM | Custom | Custom product | Custom adapter slot. |

## Product Role

Products can:

- ask OIS
- show evidence
- explain product context
- submit corrections/new knowledge
- report wrong answers
- view learning status

Products cannot:

- write directly to canonical knowledge
- bypass confidence/policy/review
- treat high-authority input as final truth
- claim complete product functionality before implementation exists

New OIS-powered products can be added as registry rows and adapter contracts without redesigning the schema.

## OIMA Stage 2I / OIMA-0 Boundary

OIMA is the meeting intelligence product powered by OIS.

OIS understands the organization. OIMA understands the meeting.

Vietnamese positioning: OIS hiểu tổ chức. OIMA hiểu cuộc họp.

OIMA reuses OIS Workspace, future RBAC, Product Registry, Canonical Entity Registry, Knowledge Fabric, Universal Knowledge API, OIS Agent Runtime, Learning Governance and Audit. OIMA owns meeting-specific UX but does not own canonical organizational knowledge.

Stage 2I / OIMA-0 hardens the product shell. Current OIMA runtime capabilities are `OVERVIEW`, `PRODUCT_BOUNDARY` and `KNOWLEDGE_API_LINKAGE`.

Planned runtime capabilities are `MEETING_INTAKE`, `TRANSCRIPT_PROCESSING`, `AUDIO_PROCESSING`, `OFFLINE_AGENT_ANALYSIS`, `SUBJECT_CLARIFICATION`, `SELF_IMPROVEMENT` and `LISTENER_MODE`.

Transcript is the primary input path. Audio is optional future enrichment. Future Listener Mode may record meetings only with permission. Live speaking and voice clone are explicitly out of scope.
