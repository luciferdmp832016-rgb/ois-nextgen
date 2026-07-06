# Stage 0T-C OIS Console App Shell Deploy

Stage 0T-C result: `OIS_CONSOLE_APP_SHELL_DEPLOYED`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0t-c-ois-console-app-shell-deploy` |
| Base commit | `608ee133e8c59169a8bda8c06a95ed072cad2fa4` |
| Prior stage | Stage 0T-B `UI_DEMO_TEST_HARNESS_READY` |
| Objective | Record owner/Abacus App Shell evidence that OIS Console deployed as its own Abacus App Shell, separate from Core API and separate from PITS. |
| Local task type | Documentation/status update only. No local Abacus runtime execution from this workspace. |

Stage 0T-C evidence was produced through the Abacus App Shell flow. This local Codex work records the evidence only.

## Deployment Result

| Item | Evidence |
|---|---|
| Result label | `OIS_CONSOLE_APP_SHELL_DEPLOYED` |
| App Shell | OIS Console only. |
| App Shell URL | `https://161acd4ff8.na116.preview.abacusai.app` |
| Product code | `OIS_CONSOLE` |
| Shared Core API | `https://ois-nextgen.abacusai.cloud` |
| DB access model | OIS Console reads DB-backed demo data through Core API only. |
| PITS status | Not deployed in Stage 0T-C. |
| Core API status | Not modified in Stage 0T-C. |

## Abacus App Shell Configuration

| Field | Value |
|---|---|
| `appName` | `OIS NextGen Console Demo` |
| `appType` | `nextjs` |
| `repoUrl` | `https://github.com/luciferdmp832016-rgb/ois-nextgen` |
| `branch` | `stage-0b-complete-handoff-ingestion` |
| `appPath` | `apps/ois-console` |
| `packageName` | `@ois/ois-console` |
| `buildCommand` | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` |
| `startCommand` | `pnpm --filter @ois/ois-console start` |
| `port` | `3000` |

Environment variable names and safe values recorded for this App Shell:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

Excluded variables:

| Key | Status |
|---|---|
| `DATABASE_URL` | Excluded from OIS Console App Shell. |
| `ABACUS_DATABASE_URL` | Excluded from OIS Console App Shell. |

Safety confirmation: `OIS_CONSOLE_ONLY_NO_DB_NO_PROD_CREDS`.

## Screenshot Evidence

Owner-provided screenshot evidence confirms:

| Field | Screenshot result |
|---|---|
| OIS Console page visible | Confirmed. |
| Product code | `OIS_CONSOLE`. |
| Core API URL shown | `https://ois-nextgen.abacusai.cloud`. |
| Core API health status | `ok`. |
| Core API health service | `core-api`. |
| Core API health stage | `bootstrap-stage-a`. |
| Core API health HTTP | `200`. |
| Demo banner | `DEMO DATA - NOT PRODUCTION`. |
| Data access boundary | UI shell does not import Prisma or read DB connection settings; DB-backed demo data is accessed only through Core API. |

Canonical seeded counts shown in the screenshot:

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

Important correction: the pasted Abacus text report included a likely typo saying `workspaces=2` and `products=1`. Stage 0T-C uses the screenshot/canonical seeded counts above and does not record that typo as canonical.

## Published Endpoint Delta

### Added

| Endpoint | Status | App | Product code | Core API | DB access | Stage introduced |
|---|---|---|---|---|---|---|
| `https://161acd4ff8.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | OIS Console | `OIS_CONSOLE` | `https://ois-nextgen.abacusai.cloud` | Through Core API only. | Stage 0T-C |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| OIS Console Apps Management Console deployment URL | `PLANNED_NOT_CREATED` after Stage 0T-B. | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` at `https://161acd4ff8.na116.preview.abacusai.app`. | Owner/Abacus App Shell screenshot evidence. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| PITS Shell Apps Management Console deployment URL | `PLANNED_NOT_CREATED` | Future App Shell URL; not deployed in Stage 0T-C. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | No endpoint was deprecated or stopped in Stage 0T-C. |

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
| OIS Console App Shell | `curl -i https://161acd4ff8.na116.preview.abacusai.app` | HTTP 200 and OIS Console demo/status page with `OIS_CONSOLE`, Core API URL, demo banner and seeded counts. |
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 and Core API health payload. |
| DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, demo-data banner and seeded Platform Kernel counts. |

## Safety Statement

Stage 0T-C preserves these rules:

- OIS Console only.
- PITS was not deployed.
- Core API was not modified.
- No migrations.
- No seed.
- No `prisma db push`.
- No write endpoints.
- No `/auth/demo-login`.
- No production DB/storage/OpenRouter credentials.
- No `dmp247.com` custom domain attached.
- OIS Phase 1 domains `https://oisys.abacusai.app` and `https://ois.dmp247.com` remain untouched.

## Decision

Stage 0T-C is marked `OIS_CONSOLE_APP_SHELL_DEPLOYED`.

Recommended next stage: Stage 0T-D - PITS Shell App Shell Deploy.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 5 files, 25 tests. Expected mocked HTTP 500 log line came from deliberate Core API DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. |
| `git status -sb` | PASS; Stage 0T-C documentation/status changes pending commit only. |
