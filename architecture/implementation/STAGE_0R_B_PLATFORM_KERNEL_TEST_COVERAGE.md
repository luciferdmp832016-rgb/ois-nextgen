# Stage 0R-B Platform Kernel Test Coverage

Stage 0R-B result: `PLATFORM_KERNEL_TEST_COVERAGE_ADDED`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0r-b-platform-kernel-test-coverage` |
| Stage 0R-A commit | `dcb8d148e2c938f4be114ca89d9607a0cafc99b3` |
| Prior verdict | Stage 0R-A `PLATFORM_KERNEL_TEST_COVERAGE_REQUIRED` |
| Local task type | Focused tests plus a tiny testability refactor with no endpoint behavior change. |

Stage 0R-B did not deploy, modify Abacus runtime, run migrations, run seed, call `prisma db push`, touch production or legacy resources, print secrets, commit `.env` values or probe live endpoints.

## Code Change

`buildCoreApi()` now accepts an optional Prisma client dependency for tests:

| File | Change |
|---|---|
| `apps/core-api/src/app.ts` | Added `BuildCoreApiOptions` and `CoreApiPrismaClient`; production default remains `new PrismaClient()`. |

This is a testability refactor only. Existing callers can continue calling `buildCoreApi()` with no arguments, and runtime behavior is unchanged.

## Tests Added

Focused tests were added in `apps/core-api/src/app.test.ts`.

| Test area | Behavior locked |
|---|---|
| Core API root | Root `/` remains deterministic and performs no Prisma reads/writes. |
| `/health` | Returns HTTP 200 with `status=ok`, `service=core-api`, `stage=bootstrap-stage-a`. |
| `/health` no-DB behavior | Test deletes `DATABASE_URL` and verifies `/health` still succeeds with a mocked Prisma client. |
| `/health` no Prisma reads | Verifies `/health` does not call count/read delegates, `findUnique` delegates or disconnect before app close. |
| `/platform/overview` count mapping | Verifies the response maps all eight mocked Prisma count results into `kernel`. |
| `/platform/overview` read-only behavior | Verifies only count operations are called and write guards for create/update/delete/upsert operations are not called. |
| `/platform/overview` banner | Verifies `DEMO DATA - NOT PRODUCTION`. |
| `/platform/overview` phase gates | Verifies `PLATFORM_KERNEL=IN_PROGRESS`, `PITS_BUSINESS_LOGIC=BLOCKED_BY_PHASE2`, `KNOWLEDGE_PORTING=BLOCKED_BY_PHASE2`, `FULL_STARTER_DATA=BLOCKED_BY_PHASE3` and `REGRESSION_CERTIFICATION=BLOCKED_BY_PHASE3`. |
| DB-unavailable behavior | Verifies current behavior is HTTP 500 when a Prisma count rejects; no fallback was invented. |
| Legacy resource guard | Statically verifies Core API runtime/test config files do not reference `ois_phase1_dev`, `emerald_bql_web_dev`, `ois.dmp247.com`, `oisys.abacusai.app`, `49816/` or `52067/`. |

## Platform Kernel Gate Decision

`PLATFORM_KERNEL` remains intentionally `IN_PROGRESS`.

The Stage 0R-B tests lock the current rule that Platform Kernel gate status is not promoted by seed counts. Future gate advancement still requires:

| Requirement | Status |
|---|---|
| Explicit promotion rule | Still required. |
| Owner approval for promotion semantics | Still required. |
| Tests for the future promotion rule | Required before changing behavior. |
| No legacy/prod resource references | Guard test added. |
| No hidden count-driven promotion | Guarded by the phase gate assertion. |

Stage 0R-B does not mark `PLATFORM_KERNEL_TESTABILITY_REFACTOR_REQUIRED` because the required refactor was already completed safely in this stage.

Stage 0R-B does not mark `PLATFORM_OVERVIEW_TEST_BLOCKED_UNSAFE_BEHAVIOR` because tests confirm `/platform/overview` uses read-only count calls in the mocked contract.

Stage 0R-B does not mark `PLATFORM_KERNEL_TEST_COVERAGE_BLOCKED` because meaningful tests were added and pass.

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

Stage 0R-B did not execute these endpoint checks locally; they remain owner/staging test checklist entries from the registry.

## Safety Statement

Stage 0R-B honored these constraints:

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
| `pnpm test` | PASS; 2 files, 20 tests. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; Stage 0R-B source/test/documentation changes pending commit. |
