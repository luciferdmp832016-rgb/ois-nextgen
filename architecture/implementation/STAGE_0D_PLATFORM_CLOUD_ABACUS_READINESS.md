# Stage 0D Platform, Cloud Test And Abacus Readiness

Final verdict: `PASS_WITH_MANUAL_ABACUS_AND_GITHUB_SETUP`.

## 1. Objective

Stage 0D adds platform readiness, cloud test readiness, GitHub Actions readiness and Abacus readiness documentation without changing product business behavior.

## 2. Baseline

Expected baseline HEAD: `124f38847265da0063bec3998343e1f66aa02387`.

## 3. Starting Repository State

| Check | Result |
|---|---|
| `git status --short` | Clean at Stage 0D start. |
| `git branch --show-current` | `stage-0d-platform-cloud-abacus-readiness` |
| `git rev-parse HEAD` | `124f38847265da0063bec3998343e1f66aa02387` |
| Recent history | `124f388 chore(stage-0c): close exact-port local runtime gate`; `28747a7`; `0cc8506` |
| Remote | `origin https://github.com/luciferdmp832016-rgb/ois-nextgen.git` |

## 4. Scope

Included: docs, workflows, env placeholders, smoke tests, deployment manifest template and implementation reporting.

## 5. Explicit Non-Scope

Excluded: PITS Field Report, Case/Task lifecycle, Knowledge, Learning, Wisdom, Intelligence, native apps, production deploy and schema changes.

## 6. Constitution Compliance

No production credentials, no Abacus production database, no `prisma db push` and no schema mutation are part of Stage 0D.

## 7. Source Material

Used repo architecture docs, Stage 0C reports and the Abacus scale-up kit as reference. The kit was not copied wholesale.

## 8. OIS Bible

Added `docs/OIS-BIBLE/` context, architecture, compute, data, AI, deployment, standards, ADR index and runbook index.

## 9. LLM Context

Added `docs/llm-context/AI_AGENT_BRIEF.md` and `docs/llm-context/CODEX_TASK_PROTOCOL.md`.

## 10. Deployment Docs

Added Codex Cloud, GitHub CI, Abacus staging, Abacus production readiness, environment matrix, release/rollback, migration, storage, OpenRouter, deployment health, script reference and no-localhost docs.

## 11. Agent Rules

Root `AGENTS.md` now records Stage 0D readiness rules while preserving the original constitution.

## 12. Environment Placeholders

Expanded `.env.example` with non-secret placeholders for deployment, Abacus, storage, OpenRouter and health.

## 13. GitHub CI

Added CI workflow with PostgreSQL service, Prisma generate, migrations, seed rerun, lint, typecheck, unit tests, e2e smoke tests, build and evidence upload.

## 14. Release Preflight

Added manual release preflight workflow that validates a release ref and drafts a deployment manifest artifact.

## 15. Smoke Tests

Added Playwright smoke tests for Console, PITS Shell, Core API root, Core API health and Core API docs.

## 16. Screenshot Strategy

Screenshots are written to `test-results/stage-0d/` and uploaded from CI as artifacts.

## 17. Runtime URLs

Smoke tests read `OIS_CONSOLE_URL`, `PITS_SHELL_URL` and `CORE_API_URL`, then fall back to Stage 0C local ports.

## 18. Playwright Web Server

Playwright starts canonical `pnpm dev` and waits for Core API `/health`.

## 19. Deployment Manifest

Added `ops/DEPLOYMENT_MANIFEST_TEMPLATE.md` with release, migration, storage, AI, health and approval fields.

## 20. Abacus Staging

Staging remains manual and requires CI/preflight green, staging secrets and smoke evidence.

## 21. Abacus Production

Production remains blocked until staging, rollback rehearsal, manifest completion and owner approval are complete.

## 22. Storage Readiness

Storage provider stays `mock`; runtime storage activation is deferred pending ADR and tests.

## 23. OpenRouter Readiness

OpenRouter variables are placeholders only; runtime calls remain disabled pending an AI gateway ADR and provenance tests.

## 24. Product Runtime Boundary

PITS Shell remains a product runtime shell and does not import OIS Console or Prisma.

## 25. Product Administration Boundary

OIS Console remains Control Plane shell and does not import Prisma.

## 26. Core API Boundary

Core API remains the server/database boundary and exposes `/`, `/health`, `/docs` and `/platform/overview`.

## 27. Schema

No schema changes were made in Stage 0D.

## 28. Migrations

Migration policy remains `prisma migrate deploy`; `prisma db push` remains forbidden.

## 29. Seed Idempotency

Seed reruns remain part of CI and release preflight.

## 30. Evidence Artifacts

CI captures Playwright screenshots, report output and platform-kernel counts/fingerprints.

## 31. Platform And Cloud-Deploy Assessment

| Area | Current posture | Cloud readiness score | Notes |
|---|---|---:|---|
| Core API | Fastify service with Prisma boundary | 3 | Needs production-grade health metadata before deploy. |
| OIS Console | Next.js Control Plane shell | 3 | Shell renders; no production auth yet. |
| PITS Shell | Next.js Product Runtime shell | 3 | Shell renders; business behavior deferred. |
| Worker | Placeholder worker app | 2 | No active background jobs. |
| Architecture packages | Pure TypeScript contracts | 5 | Platform-neutral. |
| Audit and tenant packages | Pure TypeScript kernel helpers | 5 | Platform-neutral. |
| Files package | Mock/local adapter placeholder | 2 | Needs storage ADR and tests before runtime use. |
| Observability | Pino logger wrapper | 3 | Needs deployment health expansion. |
| Organization domain | In-memory kernel tests/services | 4 | Good for Stage A, not production adapter. |
| Prisma schema | Versioned migration present | 4 | Production readiness needs rollout rehearsal. |
| CI | New GitHub workflows | 3 | Requires GitHub branch protection and workflow execution. |
| Abacus | Runbooks and placeholders | 2 | Requires manual staging setup. |

## 32. Manual Setup Remaining

GitHub branch protection, GitHub Actions first run, Codex Cloud secrets, Abacus staging secrets and Abacus production readiness are manual.

## 33. Validation Plan

Required commands: `pnpm db:generate`, `pnpm db:migrate`, `pnpm db:seed` twice, `pnpm lint`, `pnpm typecheck`, `pnpm test`, `pnpm e2e`, `pnpm -r --if-present build`.

## 34. Validation Result

| Gate | Result | Evidence |
|---|---|---|
| `pnpm db:generate` | PASS | Generated Prisma Client v6.19.3. |
| `pnpm db:migrate` | PASS | One migration found; no pending migrations. |
| `pnpm db:seed` run 1 | PASS | Seed executed with demo-data warning. |
| `pnpm db:seed` run 2 | PASS | Seed executed again without duplicate failure. |
| Seed fingerprint | PASS | Overall fingerprint `4a83d1852d3eca5ea2970f7204825b1d4719a344fe27155ec272d404019054f7`; duplicate product installations `0`; negative fixture rows `0`. |
| `pnpm lint` | PASS | Architecture guard passed. |
| `pnpm typecheck` | PASS | TypeScript project check passed. |
| `pnpm test` | PASS | 2 files, 16 tests passed. |
| `pnpm e2e` | PASS | 5 Playwright tests passed after installing the local Chromium browser required by Playwright. |
| Smoke screenshots | PASS | `test-results/stage-0d/ois-console-home.png`, `pits-shell-home.png`, `core-api-docs.png`. |
| `pnpm -r --if-present build` | PASS | Core API, OIS Console and PITS Shell builds passed. |
| Runtime cleanup | PASS | No listeners remained on ports 3000, 3001 or 4000 after e2e. |

## 35. Risk Register

| Risk | Status | Mitigation |
|---|---|---|
| GitHub workflows unproven until pushed | Manual setup required | First GitHub run must be reviewed before branch protection depends on it. |
| Abacus APIs and secrets not configured | Manual setup required | Use staging runbook and manifest before production. |
| AI and storage runtime not implemented | Deferred | Keep provider mode mocked until ADRs and tests exist. |

## 36. Final Verdict

`PASS_WITH_MANUAL_ABACUS_AND_GITHUB_SETUP`.

Manual follow-up remains for GitHub branch protection, first GitHub Actions run, Codex Cloud secret configuration, Abacus staging setup and Abacus production readiness approval.
