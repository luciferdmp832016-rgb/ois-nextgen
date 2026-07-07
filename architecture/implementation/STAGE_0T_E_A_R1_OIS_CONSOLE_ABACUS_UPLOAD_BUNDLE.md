# Stage 0T-E-A-R1 OIS Console Abacus Upload Bundle

Stage 0T-E-A-R1 result: `OIS_CONSOLE_UPLOAD_BUNDLE_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0t-e-a-r1-ois-console-abacus-upload-bundle` |
| Base commit | `6b82a0c7dc6acbbbe2eae5bd8339c64780347d4d` |
| Prior stage | Stage 0T-D-R2 `PITS_SHELL_APP_SHELL_DEPLOYED_FROM_BUNDLE` |
| Objective | Prepare an uploadable source bundle for restoring or redeploying OIS Console App Shell because the prior preview URL now returns HTTP 404. |
| Local task type | Packaging script and documentation only. No Abacus deploy or runtime mutation from this workspace. |

Stage 0T-C previously deployed OIS Console at `https://161acd4ff8.na116.preview.abacusai.app`. Stage 0T-D-R2 recorded that URL as `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404`. Because the Abacus App Shell environment could not clone the external GitHub repository directly for PITS, Stage 0T-E-A-R1 uses the same direct upload bundle strategy for OIS Console.

## Dependency Inspection

| Area | Finding |
|---|---|
| OIS Console package | `apps/ois-console/package.json` defines `@ois/ois-console` and depends on `@ois/shared-ui`. |
| Next config | `apps/ois-console/next.config.mjs` transpiles `@ois/shared-ui`. |
| OIS Console imports | Console pages import `demoBannerText` from `@ois/shared-ui`. |
| Shared package | `packages/shared-ui` is required for the OIS Console build. |
| Root workspace files | `package.json`, `pnpm-lock.yaml`, `pnpm-workspace.yaml` and `tsconfig.base.json` are required for reproducible workspace install/build. |
| Direct DB usage | None required by OIS Console. UI must not set `DATABASE_URL` or `ABACUS_DATABASE_URL`. |

## Bundle Structure

Smallest reliable upload bundle:

| Included path | Reason |
|---|---|
| `apps/ois-console/**` | OIS Console App Shell source and config. |
| `packages/shared-ui/**` | Only workspace package imported by OIS Console. |
| `package.json` | Root package manager, dependency and script metadata. |
| `pnpm-lock.yaml` | Reproducible dependency lock. |
| `pnpm-workspace.yaml` | Workspace discovery for OIS Console and shared-ui. |
| `tsconfig.base.json` | Required by OIS Console TypeScript config. |

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
ops/abacus/package-ois-console-upload-bundle.sh
```

Default command:

```sh
bash ops/abacus/package-ois-console-upload-bundle.sh
```

Default output:

```text
artifacts/abacus/ois-console-abacus-upload-bundle.zip
```

The script runs from the repo root, creates `artifacts/abacus/`, checks required paths, blocks dirty bundle paths, refuses root or included-path env files, uses `git archive` with an allowlist and prints output path, size and source commit. Generated artifacts are ignored by git.

## Abacus Upload Contract

| Field | Value |
|---|---|
| App name | `OIS NextGen Console Demo` |
| App type | `nextjs` |
| Source method | Direct source ZIP upload. |
| Upload file | `artifacts/abacus/ois-console-abacus-upload-bundle.zip` |
| Package | `@ois/ois-console` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` |
| Start command | `pnpm --filter @ois/ois-console start` |
| Expected port | `3000` |

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
| None | N/A | N/A | Stage 0T-E-A-R1 prepares an upload bundle only; no deployment occurred. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://161acd4ff8.na116.preview.abacusai.app` | `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404`. | Unchanged; still `OIS_CONSOLE_APP_SHELL_PREVIEW_UNAVAILABLE_404` until redeploy succeeds. | Stage 0T-E-A-R1 is packaging/docs only. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://113d93f4db-3001.na116.preview.abacusai.app` | `ABACUS_APP_SHELL_PREVIEW_PUBLIC` | HTTP 200 PITS Shell demo/status page. |
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
| Package upload bundle | `bash ops/abacus/package-ois-console-upload-bundle.sh` | Creates `artifacts/abacus/ois-console-abacus-upload-bundle.zip`. |
| OIS Console App Shell preview | `curl -i https://161acd4ff8.na116.preview.abacusai.app` | Currently HTTP 404 until restored or redeployed. |
| PITS App Shell preview | `curl -i https://113d93f4db-3001.na116.preview.abacusai.app` | HTTP 200 PITS Shell demo/status page. |
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 Core API health. |
| DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200 seeded Platform Kernel counts. |

## Safety Statement

Stage 0T-E-A-R1 preserves these rules:

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

Stage 0T-E-A-R1 is marked `OIS_CONSOLE_UPLOAD_BUNDLE_READY`.

Recommended next stage: Stage 0T-E-A-R2 - OIS Console App Shell Redeploy From Bundle.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS using Git Bash at `C:\Program Files\Git\bin\bash.exe`. Plain `bash` on this Windows host resolves to a broken WSL relay, so Git Bash was invoked explicitly. |
| `bash ops/abacus/package-ois-console-upload-bundle.sh` | PASS using Git Bash; created `artifacts/abacus/ois-console-abacus-upload-bundle.zip`, size `38808` bytes, from source commit `6b82a0c7dc6acbbbe2eae5bd8339c64780347d4d`. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 5 files, 25 tests. Expected mocked HTTP 500 log line came from deliberate Core API DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. |
| `git status -sb` | PASS; Stage 0T-E-A-R1 source/docs changes pending commit only, generated `artifacts/` ignored. |
