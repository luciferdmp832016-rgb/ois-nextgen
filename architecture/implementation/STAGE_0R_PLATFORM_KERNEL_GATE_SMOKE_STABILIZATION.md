# Stage 0R-A Platform Kernel Gate Smoke Stabilization

Stage 0R-A result: `PLATFORM_KERNEL_TEST_COVERAGE_REQUIRED`.

## Baseline

| Item | Result |
|---|---|
| Documentation branch | `stage-0r-platform-kernel-gate-smoke-stabilization` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `6eaa315181d74c1046a8cc960a85eef95bbce27d` |
| Prior stage | Stage 0Q `PLATFORM_KERNEL_SEED_APPLIED` |
| Local task type | Code inspection and documentation only. |

Stage 0R-A did not deploy, modify Abacus runtime, run migrations, run seed, call `prisma db push`, touch production or legacy resources, print secrets, commit `.env` values or probe live endpoints.

## Scope Inspected

| Area | Files inspected |
|---|---|
| Core API health and platform overview | `apps/core-api/src/app.ts` |
| Core API tests | `apps/core-api/src/app.test.ts`, `tests/e2e/runtime-smoke.spec.ts` |
| Platform kernel domain tests | `domains/organization/test/kernel.test.ts` |
| Prisma schema and seed | `prisma/schema.prisma`, `prisma/seed.ts` |
| Platform constants and shell labels | `packages/architecture-contracts/src/index.ts`, `apps/ois-console/app/dashboard/page.tsx` |
| Stage evidence docs | Stage 0O, Stage 0P, Stage 0Q, published endpoint registry, Abacus staging deploy runbook and staging inputs checklist |

## Platform Kernel Gate Logic

`PLATFORM_KERNEL` is currently computed by the Core API `/platform/overview` route as a literal response value:

| Question | Finding |
|---|---|
| Source | `apps/core-api/src/app.ts` |
| Route | `GET /platform/overview` |
| Gate field | `phaseGates.PLATFORM_KERNEL` |
| Current value | `IN_PROGRESS` |
| Gate mechanism | Hardcoded API response literal. |
| Count-driven | No. Seeded counts are returned separately under `kernel`. |
| Config-driven | No. The route does not read `FeatureFlag`, `EffectiveConfigurationSnapshot` or environment config for this gate. |
| Feature-flag-driven | No. `prisma/seed.ts` creates `stage_a.kernel_only`, but `/platform/overview` does not read it. |
| Manually controlled in DB | No. There is no phase-gate table or DB state read for this response. |

The gate remains `IN_PROGRESS` after Stage 0Q because the route always returns that value. Seeded counts prove demo/staging data exists; they do not advance the lifecycle gate.

This is correct for Stage 0Q/0R-A. A count-driven auto-promotion would be unsafe because it would treat data presence as implementation readiness. The Platform Kernel can have seed data while still needing explicit gate criteria, test coverage and owner-approved status semantics before being marked ready, passed or complete.

## Required Conditions Before Gate Advancement

Before changing `PLATFORM_KERNEL` from `IN_PROGRESS`, a later stage should define and test the gate contract:

| Requirement | Reason |
|---|---|
| Explicit status semantics for `READY`, `PASS` or `COMPLETE` | Avoid treating seeded demo data as production readiness. |
| Test coverage for `/platform/overview` count response | Prove the DB-backed smoke endpoint shape and count mapping. |
| Test coverage for `phaseGates.PLATFORM_KERNEL` | Lock the expected `IN_PROGRESS` behavior or the new advancement rule. |
| Health no-DB test | Preserve the Stage 0O/0P behavior that `/health` does not require Prisma connectivity. |
| Missing/unavailable DB behavior test for `/platform/overview` | Make failure mode explicit when `DATABASE_URL` or the migrated schema is unavailable. |
| Legacy/prod resource reference guard | Prove Core API smoke paths do not reference `ois_phase1_dev`, `emerald_bql_web_dev`, `oisys.abacusai.app`, `ois.dmp247.com`, `49816/` or `52067/`. |
| Owner approval for any status promotion | Gate advancement is a product/platform decision, not only a data-count result. |

## `/platform/overview` Inspection

| Check | Finding |
|---|---|
| Read-only | Confirmed. The route only awaits Prisma `count()` calls and returns a JSON object. |
| Prisma operation type | Eight read-only count queries: `industry`, `organization`, `workspace`, `project`, `productDefinition`, `productInstallation`, `moduleDefinition` and `auditRecord`. |
| Writes or side effects | None observed in the route. No `create`, `update`, `upsert`, `delete`, seed, migration or service mutation is called. |
| DB connection source | Prisma uses `DATABASE_URL` from `prisma/schema.prisma`. |
| Missing `DATABASE_URL` behavior | No route-level fallback exists. `/health` remains no-DB, but `/platform/overview` is expected to fail if Prisma cannot connect or initialize. |
| Migrated but empty DB behavior | Stage 0P evidence shows HTTP 200 with zero counts after the Prisma baseline migration and before seed data. |
| Seeded DB behavior | Stage 0Q evidence shows HTTP 200 with seeded counts: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3 and auditRecords 1. |
| Demo banner | Static `DEMO DATA - NOT PRODUCTION` banner is returned with the overview payload. |
| Phase gates | Static values are returned by the route; `PLATFORM_KERNEL` remains `IN_PROGRESS`. |

## `/health` Inspection

`GET /health` returns a static object:

```json
{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}
```

It does not perform Prisma reads or writes and remains the safe Core API no-DB health endpoint.

## Test Coverage Inspection

| Test file | Current coverage |
|---|---|
| `apps/core-api/src/app.test.ts` | Core API root `/` deterministic service identity only. |
| `tests/e2e/runtime-smoke.spec.ts` | Runtime smoke for Console, PITS, Core API `/`, Core API `/health` and `/docs`. |
| `domains/organization/test/kernel.test.ts` | In-memory kernel hierarchy, scope, permissions, audit, idempotency and product-runtime boundary behavior. |

Missing coverage:

| Needed test | Purpose |
|---|---|
| Core API `/health` no-DB unit test | Prove health remains static/no-DB when `DATABASE_URL` is absent. |
| Core API `/platform/overview` count mapping test | Mock or isolate Prisma counts and assert the response maps all eight counts correctly. |
| `PLATFORM_KERNEL` gate status test | Assert the current `IN_PROGRESS` logic or later documented rule. |
| Empty DB overview smoke | Preserve Stage 0P zero-count behavior when the schema exists but seed data is absent. |
| Seeded DB overview smoke | Preserve Stage 0Q seeded count behavior. |
| Missing/unavailable DB behavior | Document and test the error mode for `/platform/overview` when Prisma cannot connect. |
| Legacy/prod resource reference guard | Assert the Core API smoke routes do not reference legacy domains, DB names or storage prefixes. |

## Decision

Stage 0R-A is marked `PLATFORM_KERNEL_TEST_COVERAGE_REQUIRED`.

The gate logic is correct for Stage 0Q/0R-A because Platform Kernel seed readiness should not automatically promote a phase gate. However, the code-level behavior is not yet protected by focused tests for `/platform/overview` and `phaseGates.PLATFORM_KERNEL`. The next safe step is test coverage and an explicit gate contract, not runtime behavior changes.

Stage 0R-A does not mark `PLATFORM_KERNEL_GATE_LOGIC_UPDATE_REQUIRED` because the current behavior matches the Stage 0Q expectation.

Stage 0R-A does not mark `PLATFORM_OVERVIEW_SMOKE_BLOCKED` because the inspected route is read-only and Stage 0P/0Q evidence shows the endpoint returned HTTP 200 before and after seed.

Recommended next stage: Stage 0R-B - Platform Kernel Gate and Overview Test Coverage.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None. | N/A | N/A | N/A |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| None. | N/A | N/A | N/A |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None. | N/A | N/A |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Storage prefixes `49816/` and `52067/` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Legacy storage boundaries. |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 and Core API health payload. |
| Seeded DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, demo-data banner, seeded Platform Kernel counts and `phaseGates.PLATFORM_KERNEL=IN_PROGRESS`. |

Stage 0R-A did not execute these endpoint checks locally; they remain owner/staging test checklist entries from the registry.

## Safety Statement

Stage 0R-A honored these constraints:

- No Abacus deploy.
- No Abacus runtime modification.
- No runtime process start or stop.
- No migration.
- No seed.
- No `prisma db push`.
- No production database, production storage, production OpenRouter key or production credential use.
- No secret printing.
- No `.env` commit.
- No live endpoint probe from this local task.
- No OIS Phase 1 or Emerald/BQL resource touch.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 16 tests. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; documentation-only Stage 0R-A changes pending commit. |
