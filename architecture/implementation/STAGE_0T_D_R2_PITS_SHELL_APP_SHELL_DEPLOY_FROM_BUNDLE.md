# Stage 0T-D-R2 PITS Shell App Shell Deploy From Bundle

Stage 0T-D-R2 result: `PITS_SHELL_APP_SHELL_DEPLOYED_FROM_BUNDLE`.

Two-App-Shell verification status: `TWO_APP_SHELL_VERIFICATION_BLOCKED_BY_OIS_CONSOLE_PREVIEW_404`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0t-d-r2-pits-shell-app-shell-deploy-from-bundle` |
| Base commit | `cd26e1aed5a7d8ee101414d5c2ba91e79428dd34` |
| Prior stage | Stage 0T-D-R1 `PITS_SHELL_UPLOAD_BUNDLE_READY` |
| Objective | Record owner/Abacus evidence that PITS Shell deployed successfully as an Abacus App Shell from the uploaded source bundle. |
| Local task type | Documentation/status update only. No local Abacus deploy or runtime mutation from this workspace. |

Stage 0T-D first attempted to deploy PITS Shell from GitHub, but the Abacus App Shell environment reported it could not clone the external repository. Stage 0T-D-R1 prepared a source-of-truth upload bundle. Stage 0T-D-R2 records the successful owner/Abacus retry using that uploaded bundle.

## Deployment Result

| Item | Evidence |
|---|---|
| Result label | `PITS_SHELL_APP_SHELL_DEPLOYED_FROM_BUNDLE` |
| App Shell | PITS Shell only. |
| App Shell URL | `https://113d93f4db-3001.na116.preview.abacusai.app` |
| Uploaded bundle | `pits-shell-abacus-upload-bundle.zip` |
| Extracted source path | `/home/ubuntu/pits_shell_bundle` |
| Bundle structure | Preserved monorepo structure with `apps/pits-shell`, `packages/shared-ui` and root workspace files. |
| Product code | `PITS_SHELL` |
| Shared Core API | `https://ois-nextgen.abacusai.cloud` |
| DB access model | PITS Shell reads DB-backed demo data through Core API only. |
| OIS Console status | Previously deployed preview URL currently returns HTTP 404; two-shell verification remains blocked until restored or redeployed. |
| Core API status | Not modified in Stage 0T-D-R2. |

## Abacus App Shell Execution

| Step | Evidence |
|---|---|
| Install | `pnpm install --frozen-lockfile` passed. |
| Build | `pnpm --filter @ois/pits-shell build` passed. |
| Start | `pnpm --filter @ois/pits-shell start`. |
| Runtime port | `3001`. |
| Preview URL | `https://113d93f4db-3001.na116.preview.abacusai.app`. |
| HTTP result | PITS URL returned HTTP 200. |

## PITS Verification

| Check | Result |
|---|---|
| Product code displayed | `PITS_SHELL`. |
| Core API URL displayed | `https://ois-nextgen.abacusai.cloud`. |
| Core API health | Healthy / OK. |
| Demo data banner | `DEMO DATA - NOT PRODUCTION` displayed. |
| Direct DB env | No `DATABASE_URL`; no `ABACUS_DATABASE_URL`. |
| DB access boundary | PITS Shell does not connect to DB directly; it reads data only through Core API. |

Seeded Platform Kernel counts displayed by PITS:

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

## Core API Verification

| Endpoint | Result |
|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | HTTP 200. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200 with expected JSON structure. |

## Verification Caveat

The overall verification script result was `FAIL` only because the previously deployed OIS Console App Shell preview URL returned HTTP 404:

```text
https://161acd4ff8.na116.preview.abacusai.app
```

This is recorded as `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404`, not as a PITS deployment failure. Stage 0T-D-R2 PITS deployment evidence remains successful.

Two-App-Shell simultaneous verification remains blocked until OIS Console App Shell preview is restored or redeployed.

## Published Endpoint Delta

### Added

| Endpoint | Status | App | Product code | Core API | DB access | Stage introduced |
|---|---|---|---|---|---|---|
| `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | PITS Shell | `PITS_SHELL` | `https://ois-nextgen.abacusai.cloud` | Through Core API only. | Stage 0T-D-R2 |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://161acd4ff8.na116.preview.abacusai.app` | Stage 0T-C `ABACUS_APP_SHELL_PREVIEW_PUBLIC`; HTTP 200 OIS Console screenshot evidence. | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404`; currently HTTP 404 and blocks two-shell verification. | Stage 0T-D-R2 verification script caveat. |
| PITS Shell Apps Management Console deployment URL | Stage 0T-D-R1 `SOURCE_ACCESS_BLOCKED`; upload bundle ready. | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` at `https://113d93f4db-3001.na116.preview.abacusai.app`. | Uploaded bundle deploy returned HTTP 200 and displayed PITS verification data. |

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
| None | N/A | No endpoint was intentionally deprecated or stopped in Stage 0T-D-R2. |

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
| PITS App Shell preview | `curl -i https://113d93f4db-3001.na116.preview.abacusai.app` | HTTP 200 and PITS Shell demo/status page with `PITS_SHELL`, Core API URL, demo banner and seeded counts. |
| OIS Console App Shell preview | `curl -i https://161acd4ff8.na116.preview.abacusai.app` | Currently HTTP 404; restore or redeploy before two-shell verification. |
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 Core API health. |
| DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200 seeded Platform Kernel counts. |

## Safety Statement

Stage 0T-D-R2 preserves these rules:

- PITS Shell only.
- Core API was not modified.
- No migrations.
- No seed.
- No `prisma db push`.
- No write endpoints.
- No `/auth/demo-login`.
- No production DB/storage/OpenRouter credentials.
- No direct UI DB access.
- No `dmp247.com` custom domain change.
- No OIS Phase 1 domain modification.
- No OIS Phase 1 database or storage touch.
- No Emerald/BQL database or storage touch.

## Decision

Stage 0T-D-R2 is marked `PITS_SHELL_APP_SHELL_DEPLOYED_FROM_BUNDLE`.

Two-App-Shell simultaneous verification is marked `TWO_APP_SHELL_VERIFICATION_BLOCKED_BY_OIS_CONSOLE_PREVIEW_404`.

Recommended next stages:

1. Stage 0T-E-A - Restore or Redeploy OIS Console App Shell Preview.
2. Stage 0T-E-B - Two App Shell Verification.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 5 files, 25 tests. Expected mocked HTTP 500 log line came from the deliberate Core API DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. |
| `git status -sb` | PASS; Stage 0T-D-R2 documentation/status changes pending commit only. |
