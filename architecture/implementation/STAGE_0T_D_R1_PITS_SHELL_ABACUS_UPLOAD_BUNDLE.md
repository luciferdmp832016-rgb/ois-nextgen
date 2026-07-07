# Stage 0T-D-R1 PITS Shell Abacus Upload Bundle

Stage 0T-D-R1 result: `PITS_SHELL_UPLOAD_BUNDLE_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0t-d-r1-pits-shell-abacus-upload-bundle` |
| Base commit | `ba8093a9c829903753b6d4c8650b9ee595fa59cd` |
| Prior stage | Stage 0T-C `OIS_CONSOLE_APP_SHELL_DEPLOYED` |
| Objective | Prepare an uploadable source bundle for deploying PITS Shell as an Abacus App Shell because the Abacus App Shell environment cannot clone the external GitHub repo directly. |
| Local task type | Packaging script and documentation only. No Abacus deployment from this workspace. |

Stage 0T-D attempted to deploy PITS Shell from GitHub. Abacus reported that the App Shell deployment environment does not allow cloning external GitHub repositories and offered direct source upload, spec-build or another deployment method. Stage 0T-D-R1 rejects spec-build for now because the App Shell must come from the OIS NextGen source-of-truth repo, and chooses direct source upload.

## Dependency Inspection

| Area | Finding |
|---|---|
| PITS package | `apps/pits-shell/package.json` defines `@ois/pits-shell` and depends on `@ois/shared-ui`. |
| Next config | `apps/pits-shell/next.config.mjs` transpiles `@ois/shared-ui`. |
| PITS imports | PITS app imports `@ois/shared-ui` from `home` and `projects`; root demo page uses only framework/runtime APIs and fetches Core API. |
| Shared package | `packages/shared-ui` exports `demoBannerText`. |
| Root workspace files | `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` and `tsconfig.base.json` are required for reproducible workspace install/build. |
| Direct DB usage | None required by PITS Shell. UI must not set `DATABASE_URL` or `ABACUS_DATABASE_URL`. |

## Bundle Structure

Smallest reliable upload bundle:

| Included path | Reason |
|---|---|
| `apps/pits-shell/**` | PITS Shell App Shell source and config. |
| `packages/shared-ui/**` | Only workspace package imported by PITS Shell. |
| `package.json` | Root package manager, dependency and script metadata. |
| `pnpm-lock.yaml` | Reproducible dependency lock. |
| `pnpm-workspace.yaml` | Workspace discovery for PITS and shared-ui. |
| `tsconfig.base.json` | Required by PITS Shell TypeScript config. |

Excluded:

- `node_modules`
- `.next`
- `dist` and build output
- `.env` and `.env.*`
- secrets
- `.git`
- `.abacus-*` runtime files
- backups
- generated upload artifacts
- unrelated apps, packages, domains, Prisma schema, migrations and seeds

## Packaging Script

Created:

```text
ops/abacus/package-pits-shell-upload-bundle.sh
```

Default command:

```sh
bash ops/abacus/package-pits-shell-upload-bundle.sh
```

Default output:

```text
artifacts/abacus/pits-shell-abacus-upload-bundle.zip
```

The script runs from the repo root, creates `artifacts/abacus/`, checks required paths, blocks dirty bundle paths, refuses root or included-path env files, uses `git archive` with an allowlist and prints output path, size and source commit. Generated artifacts are ignored by git.

## Abacus Upload Contract

| Field | Value |
|---|---|
| App name | `PITS NextGen Shell Demo` |
| App type | `nextjs` |
| Source method | Direct source ZIP upload. |
| Upload file | `artifacts/abacus/pits-shell-abacus-upload-bundle.zip` |
| Package | `@ois/pits-shell` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` |
| Start command | `pnpm --filter @ois/pits-shell start` |
| Expected port | `3001` |

Environment values:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

Do not set `DATABASE_URL`, `ABACUS_DATABASE_URL`, production DB/storage/OpenRouter credentials or Phase 1 secrets.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0T-D-R1 prepares an upload bundle only; no deployment occurred. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| PITS Shell Apps Management Console deployment URL | `PLANNED_NOT_CREATED` after Stage 0T-C. | `SOURCE_ACCESS_BLOCKED`; upload bundle ready for direct source upload. | Abacus reported external GitHub clone is not allowed in the App Shell environment. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://161acd4ff8.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | OIS Console App Shell remains deployed. |
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | No endpoint was deprecated or stopped. |

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
| Package upload bundle | `bash ops/abacus/package-pits-shell-upload-bundle.sh` | Creates `artifacts/abacus/pits-shell-abacus-upload-bundle.zip`. |
| PITS App Shell URL | Not available in Stage 0T-D-R1. | Remains blocked until the upload bundle is used in Abacus. |
| OIS Console App Shell | `curl -i https://161acd4ff8.na116.preview.abacusai.app` | HTTP 200 OIS Console demo/status page. |
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 Core API health. |
| DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200 seeded Platform Kernel counts. |

## Safety Statement

Stage 0T-D-R1 preserves these rules:

- No deploy.
- No Abacus runtime modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No write endpoints.
- No `/auth/demo-login`.
- No production DB/storage/OpenRouter credentials.
- No direct UI DB access.
- No `dmp247.com` custom domain change.
- No OIS Phase 1 touch.
- No Emerald/BQL touch.
- Generated upload ZIP is not committed.

## Decision

Stage 0T-D-R1 is marked `PITS_SHELL_UPLOAD_BUNDLE_READY`.

Recommended next stage: Stage 0T-D-R2 - PITS Shell App Shell Upload Deploy Evidence.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS using Git Bash at `C:\Program Files\Git\bin\bash.exe`. Plain `bash` on this Windows host resolves to a broken WSL relay, so Git Bash was invoked explicitly. |
| `bash ops/abacus/package-pits-shell-upload-bundle.sh` | PASS using Git Bash; created `artifacts/abacus/pits-shell-abacus-upload-bundle.zip`, size `39177` bytes, from source commit `ba8093a9c829903753b6d4c8650b9ee595fa59cd`. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 5 files, 25 tests. Expected mocked HTTP 500 log line came from deliberate Core API DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. |
| `git status -sb` | PASS; Stage 0T-D-R1 source/docs changes pending commit only, generated `artifacts/` ignored. |
