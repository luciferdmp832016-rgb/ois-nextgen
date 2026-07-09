# OIMA Product Boundary

Product key: `OIMA`

Product code: `OIMA`

Product name: `Organizational Intelligence Meeting Agent`

Display name: `OIMA — Organizational Intelligence Meeting Agent`

Product type: `MEETING_INTELLIGENCE_PRODUCT`

Positioning: OIS understands the organization. OIMA understands the meeting.

Vietnamese positioning: OIS hiểu tổ chức. OIMA hiểu cuộc họp.

## Boundary

OIMA is a distinct Powered by OIS product. It is not a feature buried inside the generic OIS Platform, and it is not a separate knowledge source of truth.

Stage 2I / OIMA-0 hardens the product shell only. Current runtime capabilities are `OVERVIEW`, `PRODUCT_BOUNDARY` and `KNOWLEDGE_API_LINKAGE`.

Planned runtime capabilities are `MEETING_INTAKE`, `TRANSCRIPT_PROCESSING`, `AUDIO_PROCESSING`, `OFFLINE_AGENT_ANALYSIS`, `SUBJECT_CLARIFICATION`, `SELF_IMPROVEMENT` and `LISTENER_MODE`.

OIMA owns meeting-specific product UX:

- Meeting Library
- Upload Meeting
- Transcript processing
- Optional audio/voice recorder processing
- OIS Agent offline meeting analysis
- Subject clarification
- Decision/action/risk extraction
- Meeting dashboard
- Monthly operating report
- Self-improvement review
- Future Listener Mode

OIMA reuses OIS Core:

- Workspace
- RBAC / future permission model
- Product Registry
- Canonical Entity Registry
- Knowledge Fabric KL-0 to KL-5
- Universal Knowledge API
- OIS Agent Runtime
- Learning Signal / Candidate / Policy / Audit
- Self-Improvement Governance
- Architecture Map Manifest

## Source Modes

`TRANSCRIPT_ONLY` is the primary OIMA foundation and must work without audio. Transcript is the primary input path.

`AUDIO_ONLY` and `TRANSCRIPT_AND_AUDIO` are future enrichment modes. Audio may improve speaker identity and confidence later, but it does not block transcript-first analysis.

`LISTENER_CAPTURED` is future-only. Initial Listener Mode, when implemented, may record meetings only with permission and is limited to listen, record and analyze.

## Safety

Stage 2I / OIMA-0 explicitly blocks meeting upload runtime, transcript processing, audio processing, Listener Mode runtime, live speaking agents, voice clone, impersonation, autonomous decisions, real LLM/OpenRouter calls, production secrets and `prisma db push`.
