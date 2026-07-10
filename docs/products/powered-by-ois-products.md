# Powered by OIS Products

Stage 2F introduces a canonical product registry for OIS-powered products.

| Product key | Display name | Type | Current status |
|---|---|---|---|
| OIS_PLATFORM | OIS Platform | Core platform | Enabled. Mounted widget, Learning Center foundation and Knowledge Fabric control plane. |
| PITS | PITS | Ecosystem product | Enabled registry/context support. Runtime behavior remains staged by prior PITS phases. |
| OIMA | OIMA - Organizational Intelligence Meeting Agent | Meeting intelligence product | Stage 2L standalone app shell ready at `apps/oima-shell` with custom domain foundation `https://oima.dmp247.com`. Transcript-first and audio-optional; no meeting analysis, Listener Mode, voice clone or LLM runtime yet. |
| KEIHB | KEIHB | Future product | Registry, adapter and extension point only. |
| ICR | ICR | Future product | Registry, adapter and extension point only. |
| CSAGENT | CSAgent | Future product | Registry, adapter and extension point only. |
| FUTURE_PRODUCT | Future Product | Future product | Extension slot. |
| CUSTOM | Custom | Custom product | Custom adapter slot. |

Stage 2L update: OIMA is now a standalone product app shell at `apps/oima-shell`, served on port `3002` and prepared for `https://oima.dmp247.com`. It still reuses OIS Core API for Stage 2J meeting intake and Stage 2K transcript processing; no separate data silo or duplicate backend was added.

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

## OIMA Stage 2L / OIMA-A0 Standalone App Shell

OIMA is the meeting intelligence product powered by OIS.

OIS understands the organization. OIMA understands the meeting.

OIMA reuses OIS Workspace, future RBAC, Product Registry, Canonical Entity Registry, Knowledge Fabric, Universal Knowledge API, OIS Agent Runtime, Learning Governance and Audit. OIMA owns meeting-specific UX but does not own canonical organizational knowledge.

Stage 2J / OIMA-1 adds audited meeting intake records and source file metadata registration. Stage 2K / OIMA-2 adds immutable raw transcript versions, separate normalized transcript versions, deterministic parse runs, ordered transcript segments and review warnings. Stage 2L / OIMA-A0 gives OIMA its own product runtime shell at `apps/oima-shell` while OIS Console keeps launcher/compatibility routes only.

Current OIMA runtime capabilities are `OVERVIEW`, `PRODUCT_BOUNDARY`, `KNOWLEDGE_API_LINKAGE`, `MEETING_INTAKE` and `TRANSCRIPT_PROCESSING`.

Planned runtime capabilities are `AUDIO_PROCESSING`, `OFFLINE_AGENT_ANALYSIS`, `SUBJECT_CLARIFICATION`, `SELF_IMPROVEMENT` and `LISTENER_MODE`.

Transcript is the primary input path. Audio metadata is optional. Future Listener Mode may record meetings only with permission. Live speaking, voice clone, fake analytics, issue/decision/action/risk extraction and LLM/OpenRouter calls are explicitly out of scope.
