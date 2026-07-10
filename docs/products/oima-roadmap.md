# OIMA Roadmap

## OIMA-0: Product Shell & Boundary Hardening

Phase: Stage 2I

Status: `PRODUCT_SHELL_HARDENED`

Delivered:

- Powered by OIS product identity for `OIMA`.
- Shared source-mode, meeting-status, analysis-mode, safety-boundary and reuse-map contracts.
- Deterministic Core API endpoints:
  - `/platform/products/code/OIMA`
  - `/platform/oima/overview`
  - `/platform/oima/source-modes`
  - `/platform/oima/roadmap`
  - `/platform/oima/boundary`
- OIS Console `/oima` product boundary shell.
- OIMA product overview.
- Explicit current/planned runtime capability contract.
- Empty-state cards for Meeting Library, Upload Meeting, Agent Analysis, Clarification Review, Dashboard, Self-Improvement Center and Listener Mode.
- Architecture map, docs, ADR and Abacus smoke-check coverage.

## OIMA-1: Meeting Intake

Phase: Stage 2J

Status: `RUNTIME_FOUNDATION_READY`

Delivered:

- Versioned Prisma schema for meeting records and source file metadata.
- Tenant/workspace scoping.
- Audit-backed meeting intake writes.
- Meeting Library, Upload/Register Meeting and Meeting Detail UI.
- Transcript source file metadata registration.
- Optional audio source file metadata registration.
- Intake statuses: `DRAFT`, `UPLOADED`, `READY_FOR_PROCESSING`, `NEEDS_REVIEW`, `FAILED`.
- No seeded fake meeting data, transcript parsing, audio processing or real AI calls.

## OIMA-2: Transcript Processing

Phase: Stage 2K

Status: `TRANSCRIPT_PROCESSING_READY`

Delivered:

- Deterministic transcript parsing contracts.
- Immutable raw transcript versions.
- Separate normalized transcript versions.
- Microsoft Teams-style and generic text segment parsing.
- Ordered transcript segments with raw speaker, timestamp, raw text, normalized text, source order and confidence.
- Parse runs with status, segment count, warning count and confidence.
- Parse warnings that mark low-confidence or incomplete transcript structure for human review.
- Meeting Detail transcript processing UI.
- No fake analysis, no issue/decision/action/risk extraction, no audio processing, no Listener Mode, no voice clone and no LLM/OpenRouter calls.

## OIMA-3: OIS Agent Offline Analysis

Phase: Next recommended stage

Planned:

- Evidence-backed offline analysis contracts.
- No real LLM/OpenRouter call in OIMA-2.
- Review payloads that keep provenance visible.

## OIMA-4: Subject Clarification

Planned:

- Clarification workflow for ambiguous subjects, owners and meeting context.
- Human review before any learning candidate moves forward.

## OIMA-5: Dashboard & Monthly Report

Planned:

- Meeting dashboard.
- Monthly operating report.
- Organization-level patterns sourced through governed evidence.

## OIMA-6: Self-Improvement Review

Planned:

- Meeting-derived learning candidates.
- Policy and audit review.
- No automatic canonical knowledge promotion.

## OIMA-7: Optional Audio Intelligence

Planned:

- Optional audio enrichment.
- Audio may improve confidence but must not block transcript-first analysis.

## OIMA-8: Voice Sample Speaker Identity

Planned:

- Future speaker identity support only with explicit governance.
- No voice clone.
- No impersonation.

## OIMA-9: Listener Mode

Planned:

- Listener-captured records for listen/record/analyze only.
- Future Listener Mode may record meetings only with permission.
- No live speaking agent, voice clone, impersonation or autonomous decisions.
