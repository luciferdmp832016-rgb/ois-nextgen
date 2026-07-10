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

Stage 2K / OIMA-2 adds the transcript processing foundation on top of the Stage 2J meeting intake foundation. Current runtime capabilities are `OVERVIEW`, `PRODUCT_BOUNDARY`, `KNOWLEDGE_API_LINKAGE`, `MEETING_INTAKE` and `TRANSCRIPT_PROCESSING`.

Planned runtime capabilities are `AUDIO_PROCESSING`, `OFFLINE_AGENT_ANALYSIS`, `SUBJECT_CLARIFICATION`, `SELF_IMPROVEMENT` and `LISTENER_MODE`.

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

`TRANSCRIPT_ONLY` is the primary OIMA foundation and works without audio. Transcript source file metadata can be registered and raw transcript text can be deterministically parsed in OIMA-2.

`TRANSCRIPT_AND_AUDIO` can register optional audio source metadata while preserving transcript as the primary input. OIMA-2 parses the transcript only; audio processing remains planned.

`AUDIO_ONLY` may be accepted as source metadata and remains review-oriented because audio processing is not runtime in OIMA-2.

`LISTENER_CAPTURED` is future-only. Initial Listener Mode, when implemented, may record meetings only with permission and is limited to listen, record and analyze.

## Transcript Evidence

Raw transcript content is immutable. OIMA stores raw transcript versions separately from normalized transcript versions, and reprocessing creates a new parse run rather than overwriting evidence.

Microsoft Teams-style speaker names, timestamps, raw text and source order are preserved as captured. Normalized text is stored separately for later review and future processing. Low-confidence segments or missing speaker/timestamp structure are marked `NEEDS_REVIEW`.

## Safety

Stage 2K / OIMA-2 explicitly blocks binary file storage, audio processing, OIS Agent meeting analysis, issues, decisions, actions, risks, Listener Mode runtime, live speaking agents, voice clone, impersonation, autonomous decisions, real LLM/OpenRouter calls, production secrets and `prisma db push`.
