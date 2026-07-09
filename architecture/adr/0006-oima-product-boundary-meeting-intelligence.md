# ADR 0006: OIMA Product Boundary And Meeting Intelligence Architecture

Status: Accepted

## Context

Stage 2G closed the Canonical Knowledge Fabric foundation. The next OIS-powered product boundary is OIMA, the Organizational Intelligence Meeting Agent. OIMA needs a distinct product identity without becoming a separate knowledge silo or pretending that meeting upload, transcript parsing, audio processing or Listener Mode exists yet.

Meeting transcripts are the dependable initial data source. Audio may be available later and may improve confidence, but it must not block transcript-first meeting intelligence.

## Decision

Add OIMA as a Powered by OIS product with product key `OIMA` and product type `MEETING_INTELLIGENCE_PRODUCT`.

OIMA reuses OIS Core for workspace context, future RBAC/permissions, Product Registry, Canonical Entity Registry, Knowledge Fabric KL-0 through KL-5, Universal Knowledge API, OIS Agent Runtime, Learning Signal/Candidate/Policy/Audit, Self-Improvement Governance and the architecture map.

OIMA owns the meeting product experience: Meeting Library, Upload Meeting, transcript-first processing, optional future audio enrichment, offline meeting analysis, subject clarification, decision/action/risk extraction, meeting dashboards, monthly operating reports, self-improvement review and future Listener Mode.

Stage 2H adds only contracts, deterministic read endpoints, product registry projection, OIS Console `/oima`, documentation and smoke checks. It adds a versioned Prisma enum migration for `MEETING_INTELLIGENCE_PRODUCT` so the Stage 2F ecosystem product registry can truthfully seed OIMA. It does not add meeting tables, ProductDefinition installs, upload flows or LLM calls.

## Boundaries

- `TRANSCRIPT_ONLY` is the primary source mode and must work without audio.
- `AUDIO_ONLY` and `TRANSCRIPT_AND_AUDIO` are future enrichment modes.
- `LISTENER_CAPTURED` is future-only and limited to listen, record and analyze.
- No live speaking agent.
- No voice clone.
- No impersonation.
- No autonomous decisions.
- No direct canonical knowledge writes from OIMA, OIS Agent or widget paths.
- No real OpenRouter/LLM calls in Stage 2H.

## Consequences

- Public and local smoke checks can verify OIMA as a distinct Powered by OIS product.
- OIMA has explicit source-mode, safety and roadmap contracts before data-model work starts.
- OIS remains the source of truth for organizational context and knowledge.
- Future meeting intake requires a separate schema/design stage with migrations, audit rules and tests.
