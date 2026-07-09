# OIMA Powered By OIS Architecture

OIMA is a meeting intelligence product powered by the OIS organizational intelligence backbone.

## Architecture Rule

OIS understands the organization. OIMA understands the meeting.

OIMA does not create a new canonical knowledge store. Meeting intelligence reads organization context through the OIS Universal Knowledge API and contributes future reviewed signals through OIS Learning Governance.

## Reuse Map

| OIS Core capability | OIMA use |
|---|---|
| Workspace | Meeting library and future meeting records are workspace scoped. |
| RBAC / future permissions | Meeting actions require owner-approved permission gates before writes. |
| Product Registry | OIMA is registered as a Powered by OIS product with key `OIMA`. |
| Canonical Entity Registry | Meeting subjects, projects and people references resolve through OIS entities. |
| Knowledge Fabric | OIMA reads KL-0 through KL-5 context from OIS. |
| Universal Knowledge API | Offline meeting analysis requests context through `/platform/knowledge/context`. |
| OIS Agent Runtime | Stage 2H keeps analysis deterministic/offline-boundary only; no LLM call. |
| Learning Governance | Future extracted corrections become Learning Signals/Candidates first. |
| Audit | Future sensitive writes require audited events. |

## Stage 2H API Boundary

All OIMA endpoints are read-only deterministic contract endpoints. They expose product metadata, source modes, safety boundaries, OIS Core reuse and roadmap status.

No endpoint accepts meeting uploads, stores transcripts, processes audio, calls OpenRouter, writes canonical knowledge or changes meeting state.

## Knowledge Boundary

OIMA can consume all canonical knowledge layers:

- `KL_0_LEGAL_REGULATORY_CORE`
- `KL_1_INDUSTRY_CORE`
- `KL_2_ORGANIZATION_CORE`
- `KL_3_PRODUCT_KNOWLEDGE_PACK`
- `KL_4_WORKSPACE_PROJECT_OVERLAY`
- `KL_5_LIVE_OPERATIONAL_SIGNALS`

Stage 2H only records that contract. It does not claim any meeting bundle or analysis item already includes those layers.
