# Stage 2H OIMA Product Boundary And Meeting Intelligence Architecture

Verdict: `STAGE_2H_OIMA_PRODUCT_BOUNDARY_MEETING_INTELLIGENCE_ARCHITECTURE_READY`

## Scope

Stage 2H establishes OIMA as a distinct Powered by OIS meeting intelligence product boundary.

## Added

- OIMA shared contracts for source modes, meeting statuses, analysis modes, safety boundaries, capability codes, OIS Core reuse map and roadmap.
- Powered by OIS ecosystem product registry entry for product key `OIMA`.
- Versioned Prisma migration `202607090003_stage_2h_oima_product_boundary` for `MEETING_INTELLIGENCE_PRODUCT`.
- Core API read endpoints:
  - `/platform/products/code/OIMA`
  - `/platform/oima/overview`
  - `/platform/oima/source-modes`
  - `/platform/oima/roadmap`
  - `/platform/oima/boundary`
- OIS Console `/oima` product boundary shell.
- Architecture mindmap OIMA product node, flow, API contracts and governance checkpoints.
- Abacus public/local smoke checks for OIMA API and UI markers.
- ADR 0006 and product/architecture docs.

## Boundaries

- No meeting upload.
- No transcript storage/parser.
- No audio ingestion or speaker identity.
- No Listener Mode runtime.
- No live speaking agent.
- No voice clone.
- No impersonation.
- No autonomous decisions.
- No real LLM/OpenRouter call.
- No production secret or production DB use.
- No `prisma db push`.
- No OIMA direct canonical knowledge write.

## Product Contract

`TRANSCRIPT_ONLY` is primary and works without audio.

Audio modes are future enrichment only.

OIMA reads OIS Knowledge Fabric and Universal Knowledge API. Future meeting extraction must enter OIS Learning Governance first and cannot auto-promote to canonical knowledge.

## Published Endpoint Delta

Added source-ready Core API routes:

- `/platform/products/code/OIMA`
- `/platform/oima/overview`
- `/platform/oima/source-modes`
- `/platform/oima/roadmap`
- `/platform/oima/boundary`

Added source-ready UI route:

- `/oima`

Unchanged:

- Stage 2F OIS Agent and Learning endpoints.
- Stage 2G Knowledge Fabric and KEIHB endpoints.
- OIS/PITS public staging base URLs.

Do not touch:

- OIS Phase 1 app shell and custom domain.
- Abacus production database.
- Production credentials.

## Validation Checklist

Required local validation:

- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm -r --if-present build`
- `pnpm e2e` if supported/relevant
- `git diff --check`

Runtime sync and public browser/UAT remain owner-controlled after merge.
