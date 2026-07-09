# Stage 2F - OIS Agent Runtime & Self-Improvement Engine Foundation

Architecture Package: 5.12A

Branch: `codex/Stage2F—OISAgentRuntime&Self-ImprovementEngineFoundation-ArchitecturePackage5.12A`

Base observed at start: `6c7a88463aabfa57e84b96fcde7c0ba03a143c54` (`Stage 2E PITS action request audit-safe boundary`). Local `main` was not present; local `master` was far behind Stage 2E. Work proceeded on the clean Stage 2F branch.

## Result

Status: `OIS_AGENT_RUNTIME_SELF_IMPROVEMENT_FOUNDATION_READY`

Stage 2F adds the governed foundation for the OIS Self-Improvement Engine and reusable OIS Agent Runtime without promoting any widget input into canonical Knowledge Layer tables.

## Implemented

- Powered by OIS product registry for `OIS_PLATFORM`, `PITS`, `KEIHB`, `ICR`, `CSAGENT`, `FUTURE_PRODUCT` and `CUSTOM`.
- Learning scopes: `ORGANIZATION`, `INDUSTRY`, `PLATFORM`.
- Source authority classification from CEO/BOD/C-level through system/unknown.
- Learning policies with `ALWAYS_ASK`, `AUTO_IF_CONFIDENCE`, `FULL_AUTO_PILOT` and `LOG_ONLY`.
- Learning Signal and Learning Candidate foundations with confidence, conflict, policy and provenance fields.
- Executive Intent foundation through high-authority signal/candidate support and SuperAdmin queue.
- OIS Agent Runtime contracts and deterministic chat stub.
- OIS Agent Widget shell mounted in OIS Console with Ask, Teach OIS, Evidence and Status tabs.
- SuperAdmin OIS Learning Center v0 route with overview, stream, pending review, policies, executive queue, product map and audit placeholder.

## Database / Schema

ADR: `architecture/adr/0004-agent-runtime-self-improvement-foundation.md`

Migration: `prisma/migrations/202607090001_stage_2f_agent_runtime_self_improvement/migration.sql`

New tables:

- `OisEcosystemProduct`
- `OisLearningPolicy`
- `OisLearningSignal`
- `OisLearningCandidate`
- `OisAgentSession`
- `OisAgentMessage`
- `OisAgentFeedback`
- `OisAgentLearningSubmission`

Seed updates:

- idempotent product registry rows
- idempotent default learning policy rows
- Stage 2F module declarations for self-improvement engine, agent runtime, learning center and universal knowledge API

## API Routes

- `GET /platform/ecosystem-products`
- `POST /platform/learning/signals`
- `GET /platform/learning/signals`
- `POST /platform/learning/signals/:signalId/candidates`
- `GET /platform/learning/candidates`
- `PATCH /platform/learning/candidates/:id/review`
- `GET /platform/learning/policies`
- `PATCH /platform/learning/policies/:id`
- `GET /platform/learning/center`
- `POST /platform/agent/chat`
- `POST /platform/agent/learning-submissions`

## UI Routes / Components

- `apps/ois-console/app/learning-center/page.tsx`
- `packages/shared-ui/src/ois-agent-widget.tsx`
- OIS Console navigation adds `Learning`.
- OIS Console shell mounts the widget with `OIS_PLATFORM` product context.

## Tests Added

- product registry foundation
- learning confidence scoring
- policy evaluation threshold behavior
- executive/sensitive signals force review
- candidate generation from signal
- widget learning submission creates a Learning Signal
- no direct canonical knowledge write from widget/candidate path
- SuperAdmin Learning Center guard limitation display

## Canonical Knowledge Boundary

Confirmed by design and tests: widget and agent learning submission paths create Learning Signals, Learning Candidates, Agent Learning Submissions and AuditRecords only. They do not write Master Knowledge, Entity Registry, Decisions, Commitments or Risks.

## Known Limitations

- Chat is deterministic stub mode; no LLM/OpenRouter call is made.
- AUTO_LEARN means candidate status/log only.
- Knowledge promotion and rollback execution are future work.
- SuperAdmin route guard is documented and mutation endpoints require explicit admin role payloads; full session middleware is not implemented yet.
- KEIHB, ICR, CSAgent, Future Product and Custom are registry/adapters only.

## Validation

| Command | Result |
|---|---|
| `pnpm db:generate` | Passed; Prisma Client generated successfully. |
| `pnpm db:migrate` | Initial run without `DATABASE_URL` failed as expected; rerun with local non-production `postgresql://ois_nextgen:***@localhost:5432/ois_nextgen?schema=public` passed and applied `202607090001_stage_2f_agent_runtime_self_improvement`. |
| `pnpm db:seed` run 1 | Passed against local non-production DB. |
| `pnpm db:seed` run 2 | Passed against local non-production DB; seed is idempotent for Stage 2F rows. |
| `pnpm lint` | Passed; architecture guard passed. |
| `pnpm typecheck` | Passed. |
| `pnpm test` | Passed; 7 files, 103 tests. |
| `pnpm e2e` | Passed; 5 tests. |
| `pnpm -r --if-present build` | Passed; Core API, OIS Console and PITS Shell builds passed. |

## Published Endpoint Delta

Source-ready, not deployed from Codex:

- Core API: `/platform/ecosystem-products`
- Core API: `/platform/learning/signals`
- Core API: `/platform/learning/candidates`
- Core API: `/platform/learning/policies`
- Core API: `/platform/learning/center`
- Core API: `/platform/agent/chat`
- Core API: `/platform/agent/learning-submissions`
- OIS Console: `/learning-center`
- OIS Console: floating OIS Agent Widget shell on existing OIS Console pages

## Recommended Next Stage

Stage 2G should add governed review actions and owner-approved promotion design without enabling canonical knowledge writes until promotion tests, rollback tests and runtime ADRs are present.
