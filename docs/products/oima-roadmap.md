# OIMA Roadmap

## OIMA-0: Product Shell & Boundary

Phase: Stage 2H

Status: `PRODUCT_BOUNDARY_READY`

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
- Architecture map, docs, ADR and Abacus smoke-check coverage.

## OIMA-1: Meeting Intake

Phase: Stage 2I

Planned:

- Versioned Prisma schema for meeting records and transcript artifacts.
- Tenant/workspace scoping and audit requirements.
- No production data or real AI calls.

## OIMA-2: Transcript Processing

Phase: Stage 2J

Planned:

- Deterministic transcript parsing contracts.
- Subject clarification queue.
- Decision/action/risk extraction review payloads.
- Learning Candidate flow only; no canonical knowledge promotion.

## OIMA-3: OIS Agent Offline Analysis

Planned:

- Evidence-backed offline analysis contracts.
- No real LLM/OpenRouter call in Stage 2H.
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
- No live speaking agent, voice clone, impersonation or autonomous decisions.
