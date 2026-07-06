# Stage 0S-A Two UI Shell Demo

Stage 0S-A result: `TWO_UI_SHELL_DEMO_READY_FOR_ABACUS_PREVIEW`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0s-a-two-ui-shell-demo` |
| Base integration commit | `2a68c23dfc35e074cc560aea5ff06a5451fc8a1a` |
| Prior stage | Stage 0R-G `OPS_SCRIPT_UNBOUND_VARIABLE_FIX_READY` |
| Objective | Add minimal OIS Console and PITS Shell demo/status pages that both read the same Core API staging surface. |
| Local task type | UI shell demo code, deployment documentation and status update. No Abacus runtime execution from this workspace. |

Stage 0S-A did not deploy, modify Abacus runtime, run migrations, run seed, run `prisma db push`, print or commit secrets, create `.env` files, use production credentials, touch production/legacy resources, call live endpoints from this workspace or change active published endpoints.

## Demo Implementation

| Shell | Package | Page | Product code | Runtime behavior |
|---|---|---|---|---|
| OIS Console | `@ois/ois-console` | `/` | `OIS_CONSOLE` | Dynamic server-rendered Next page fetches Core API `/health` and `/platform/overview`. |
| PITS Shell | `@ois/pits-shell` | `/` | `PITS_SHELL` | Dynamic server-rendered Next page fetches Core API `/health` and `/platform/overview`. |

Both pages show:

- App shell name.
- Product code.
- Core API URL.
- Core API health status, service, stage and HTTP status.
- Platform overview counts.
- `DEMO DATA - NOT PRODUCTION` banner.
- A data-boundary note stating that DB-backed demo data is accessed only through Core API.

## Shared Core API Configuration

| Item | Contract |
|---|---|
| Preferred env key | `CORE_API_URL` |
| Browser-safe fallback key | `NEXT_PUBLIC_CORE_API_URL` |
| Default URL | `https://ois-nextgen.abacusai.cloud` |
| Health path | `/health` |
| Overview path | `/platform/overview` |
| Fetch location | Server-side from the Next root page. |
| Cache behavior | `cache: "no-store"` for demo freshness. |
| UI DB access | None. UI shells do not import Prisma and do not use `DATABASE_URL`. |

The same Core API URL is used by both shells. This keeps the Stage 0S-A demo aligned with the two-App-Shell topology while leaving all DB access inside the Core API boundary.

## Expected Seeded Counts

The existing Abacus Core API staging endpoint is expected to return these Stage 0Q demo/staging counts through `/platform/overview`:

| Field | Expected count |
|---|---:|
| `industries` | 1 |
| `organizations` | 1 |
| `workspaces` | 1 |
| `projects` | 2 |
| `products` | 5 |
| `installations` | 2 |
| `modules` | 3 |
| `auditRecords` | 1 |

The UI pages render unavailable markers instead of failing the build if the Core API cannot be reached during a future runtime preview.

## Abacus Preview Readiness

Stage 0S-A is code-ready for a later Abacus preview POC. It does not create or verify public UI shell URLs.

| Planned shell | Planned command | Planned port | Status |
|---|---|---:|---|
| OIS Console | `CORE_API_URL=https://ois-nextgen.abacusai.cloud pnpm --filter @ois/ois-console start` | 3000 | `PLANNED_NOT_CREATED` |
| PITS Shell | `CORE_API_URL=https://ois-nextgen.abacusai.cloud pnpm --filter @ois/pits-shell start` | 3001 | `PLANNED_NOT_CREATED` |

Recommended next stage: Stage 0S-B - Abacus OIS Console and PITS Shell Preview POC.

Stage 0S-B should keep the Core API URL pointed at `https://ois-nextgen.abacusai.cloud`, should not use UI `DATABASE_URL`, should not start migrations or seed and should not touch OIS Phase 1 or Emerald/BQL resources.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://<ois-console-abacus-preview-or-app-shell>/` | `PLANNED_NOT_CREATED` | HTTP 200 and OIS Console demo/status page after a future preview stage creates it. | Stage 0S-A code ready, not deployed. |
| `https://<pits-shell-abacus-preview-or-app-shell>/` | `PLANNED_NOT_CREATED` | HTTP 200 and PITS Shell demo/status page after a future preview stage creates it. | Stage 0S-A code ready, not deployed. |

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
| OIS Console local demo | `CORE_API_URL=https://ois-nextgen.abacusai.cloud pnpm --filter @ois/ois-console dev` then `curl -i http://127.0.0.1:3000/` | HTTP 200 and OIS Console demo/status page when the shell is running. |
| PITS Shell local demo | `CORE_API_URL=https://ois-nextgen.abacusai.cloud pnpm --filter @ois/pits-shell dev` then `curl -i http://127.0.0.1:3001/` | HTTP 200 and PITS Shell demo/status page when the shell is running. |

The active Core API endpoints were not probed from this local Stage 0S-A task. Stage 0S-A validation used local lint, typecheck, tests and builds only.

## Safety Statement

Stage 0S-A honored these constraints:

- No Abacus deploy.
- No Abacus runtime modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No production DB, storage or OpenRouter credentials.
- No secrets printed or committed.
- No `.env` files created or committed.
- No direct UI DB access.
- No UI Prisma import.
- No write endpoints called.
- No `/auth/demo-login` call.
- No OIS Phase 1, Emerald/BQL, legacy domain or legacy storage-prefix touch.

## Decision

Stage 0S-A is marked `TWO_UI_SHELL_DEMO_READY_FOR_ABACUS_PREVIEW`.

The two UI shells are now code-ready for a controlled Abacus preview stage. Active Core API staging remains unchanged, and public UI shell endpoints remain planned until a later no-production preview POC creates them.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 20 tests. Expected mocked HTTP 500 log line came from deliberate DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. Both shell root pages are dynamic server-rendered routes. |
| `git status -sb` | PASS; Stage 0S-A UI/demo documentation/status changes pending commit. |
