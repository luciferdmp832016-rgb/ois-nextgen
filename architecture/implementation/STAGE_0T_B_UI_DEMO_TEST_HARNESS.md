# Stage 0T-B UI Demo Test Harness

Stage 0T-B result: `UI_DEMO_TEST_HARNESS_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0t-b-ui-demo-test-harness` |
| Base commit | `7239ae7ebdb520a1ccc1ca7ca7d222859030692b` |
| Prior stage | Stage 0T-A `ABACUS_APP_SHELL_DEPLOYMENT_CONTRACT_READY` |
| Objective | Add local/Codex test harness coverage for the OIS Console and PITS Shell demo pages before owner-assisted Abacus App Shell deployment. |
| Local task type | Test and documentation update only. No Abacus runtime execution from this workspace. |

Stage 0T-B did not deploy, modify Abacus runtime, run migrations, run seed, run `prisma db push`, use production credentials, commit secrets, touch OIS Phase 1, touch Emerald/BQL or probe legacy endpoints.

## Harness Added

| Area | Evidence |
|---|---|
| OIS Console page test | `apps/ois-console/app/page.test.tsx` renders the async server page with mocked Core API `/health` and `/platform/overview` responses. |
| PITS Shell page test | `apps/pits-shell/app/page.test.tsx` renders the async server page with the same mocked Core API responses. |
| Static UI guard | `apps/ui-demo-static-guard.test.ts` scans `apps/ois-console` and `apps/pits-shell`, excluding generated build directories, for forbidden direct DB and legacy/production references. |
| Test config | `vitest.config.ts` now includes `apps/**/*.test.tsx` and uses the automatic React JSX runtime for server-rendered page tests. |
| UI runtime copy | OIS Console and PITS Shell data-boundary copy now says the shells do not import Prisma or read database connection settings, avoiding direct DB env var references in UI runtime source. |

## Mocked Core API Contract

The page tests do not call live staging. They stub `fetch` with the Stage 0Q seeded Core API contract:

| Route | Mock result |
|---|---|
| `/health` | `{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}` |
| `/platform/overview` | Demo banner, seeded Platform Kernel counts and `PLATFORM_KERNEL=IN_PROGRESS`. |

The mocked overview counts are:

| Count | Value |
|---|---:|
| industries | 1 |
| organizations | 1 |
| workspaces | 1 |
| projects | 2 |
| products | 5 |
| installations | 2 |
| modules | 3 |
| auditRecords | 1 |

## Coverage

| Requirement | Status |
|---|---|
| OIS Console App Shell name renders | Covered. |
| OIS Console product code `OIS_CONSOLE` renders | Covered. |
| OIS Console Core API URL renders | Covered. |
| OIS Console health OK state renders from mock | Covered. |
| OIS Console seeded counts render from mock | Covered. |
| OIS Console demo banner renders | Covered. |
| OIS Console does not require direct DB env value | Covered. |
| PITS Shell App Shell name renders | Covered. |
| PITS Shell product code `PITS_SHELL` renders | Covered. |
| PITS Shell Core API URL renders | Covered. |
| PITS Shell health OK state renders from mock | Covered. |
| PITS Shell seeded counts render from mock | Covered. |
| PITS Shell demo banner renders | Covered. |
| PITS Shell does not require direct DB env value | Covered. |
| UI packages avoid direct DB/legacy/prod references | Covered by static guard. |

The static guard blocks UI package references to direct database URL env names, `ois_phase1_dev`, `emerald_bql_web_dev`, `ois.dmp247.com` and `oisys.abacusai.app`.

## Screenshot Artifact Decision

Playwright exists in the repo for e2e smoke tests, but there is no existing screenshot/demo artifact harness for mocked App Shell pages. Stage 0T-B therefore keeps coverage to fast Vitest server-render tests and a static guard. Browser screenshot artifacts are deferred to a later stage that can intentionally add server orchestration and artifact collection for App Shell URLs.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0T-B is local/Codex test harness only. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| None | N/A | N/A | No endpoint status changed. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| OIS Console Apps Management Console deployment URL | `PLANNED_NOT_CREATED` | Future App Shell URL; not deployed in Stage 0T-B. |
| PITS Shell Apps Management Console deployment URL | `PLANNED_NOT_CREATED` | Future App Shell URL; not deployed in Stage 0T-B. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | No runtime endpoint was started or stopped. |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Storage prefixes `49816/` and `52067/` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Legacy storage boundaries. |

### Current Test Checklist

Stage 0T-B local/Codex checks:

| Check | Command | Expected |
|---|---|---|
| UI demo page harness | `pnpm test` | OIS Console and PITS Shell page tests pass with mocked Core API data. |
| UI package static guard | `pnpm test` | No forbidden direct DB or legacy/production references in UI packages. |
| Core API staging health | Not probed in Stage 0T-B. | Remains governed by prior live evidence. |
| DB-backed platform overview | Not probed in Stage 0T-B. | Remains governed by prior live evidence. |

## Safety Statement

Stage 0T-B preserves these rules:

- No deploy.
- No Abacus runtime modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No production credentials.
- No secret printing or commit.
- No direct UI DB access.
- No Core API DB/runtime logic change.
- No OIS Phase 1 touch.
- No Emerald/BQL touch.
- No `dmp247.com` custom domain change.

## Decision

Stage 0T-B is marked `UI_DEMO_TEST_HARNESS_READY`.

Recommended next stage: Stage 0T-C - Owner-Assisted Abacus App Shell Creation Evidence.

## Validation

| Command | Result |
|---|---|
| `pnpm test` | PASS; 5 files, 25 tests. Expected mocked HTTP 500 log line came from deliberate Core API DB-error-path test. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. |
| `git status -sb` | PASS; Stage 0T-B test/docs changes pending commit only. |
