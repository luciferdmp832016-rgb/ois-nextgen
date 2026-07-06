# Stage 0T-A Abacus App Shell Deployment Contract

Stage 0T-A result: `ABACUS_APP_SHELL_DEPLOYMENT_CONTRACT_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0t-a-abacus-app-shell-deployment-contract` |
| Base commit | `18a161b294f441480457e022c6f5e8529149b359` |
| Prior stage | Stage 0S-B `TWO_UI_SHELL_PREVIEW_OPS_READY` |
| Objective | Correct the OIS/PITS UI deployment path from SuperComputer preview/nginx routing to proper Abacus App Shell deployment through Apps Management Console. |
| Local task type | Documentation/status update only. No Abacus runtime execution from this workspace. |

Stage 0T-A did not deploy, modify Abacus runtime, run migrations, run seed, run `prisma db push`, use production credentials, commit secrets, touch OIS Phase 1, touch Emerald/BQL or probe legacy endpoints.

## Corrected Abacus Deployment Model

Owner-provided Abacus screenshots and notes establish the corrected model:

| Area | Correct contract |
|---|---|
| Apps Management Console | Source of truth for Abacus App Shell inventory and deployment lifecycle. |
| App Shell resources | Each App Shell has its own Deployment URL, Database, Storage, Versions and Custom Domain configuration. |
| SuperComputer sessions | Project/VM execution plane and Core API staging host; not the App Shell inventory source of truth. |
| VM preview proxy | Temporary process-bound port preview route; not canonical proof for UI App Shell deployment. |
| Connected Services | Connector management, not App Shell deployment. |
| Abacus CLI | Not currently usable for this stage because API metering must be enabled first. |

Existing App Shell evidence from owner screenshots:

| Existing App Shell | Evidence | Boundary |
|---|---|---|
| `9 - Organizational Intelligence System` | Deployment URL `oisys.abacusai.app`; custom domain, database, storage and version links visible. | OIS Phase 1; do not touch. |
| `Multi-Tenant Condo App PRD` | Deployment URL starts with `emerald-bql-web-`; custom domain, database, storage and version links visible. | Emerald/BQL legacy app; do not touch. |

## Corrected OIS NextGen Topology

| Component | Deployment plane | Contract |
|---|---|---|
| Core API | Existing SuperComputer/nginx/systemd staging path. | Remains at `https://ois-nextgen.abacusai.cloud`; owns DB access. |
| OIS Console | New Abacus App Shell. | Separate Abacus-managed deployment URL; calls Core API only. |
| PITS Shell | New Abacus App Shell. | Separate Abacus-managed deployment URL; calls Core API only. |

OIS Console and PITS Shell must not connect directly to any DB. They must call:

```text
https://ois-nextgen.abacusai.cloud
```

Custom `dmp247.com` subdomains are optional later publication layers and must not be configured in Stage 0T-A.

## OIS Console App Shell Contract

| Field | Value |
|---|---|
| App name | `OIS NextGen Console Demo` |
| Source repo | `luciferdmp832016-rgb/ois-nextgen` |
| Branch | `stage-0b-complete-handoff-ingestion` |
| App path | `apps/ois-console` |
| Package | `@ois/ois-console` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` |
| Start command | `pnpm --filter @ois/ois-console start` |
| Initial domain | Abacus-managed deployment URL from Apps Management Console. |
| Later custom domain candidates | `ois-ng.dmp247.com` or `ois-staging.dmp247.com`. |

Environment names and values:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `DATABASE_URL` | Do not set. |

Do not touch `ois.dmp247.com`.

## PITS Shell App Shell Contract

| Field | Value |
|---|---|
| App name | `PITS NextGen Shell Demo` |
| Source repo | `luciferdmp832016-rgb/ois-nextgen` |
| Branch | `stage-0b-complete-handoff-ingestion` |
| App path | `apps/pits-shell` |
| Package | `@ois/pits-shell` |
| Build command | `corepack enable || true && pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` |
| Start command | `pnpm --filter @ois/pits-shell start` |
| Initial domain | Abacus-managed deployment URL from Apps Management Console. |
| Later custom domain candidates | `pits-ng.dmp247.com` or `pits-staging.dmp247.com`. |

Environment names and values:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `DATABASE_URL` | Do not set. |

## Manual Deployment Checklist

This checklist is for a later owner-assisted deployment stage. Stage 0T-A does not execute it.

1. Create or open `OIS NextGen Console Demo` in Apps Management Console.
2. Configure source repo, branch and app path/package for OIS Console.
3. Configure OIS Console environment values without `DATABASE_URL`.
4. Deploy OIS Console to its Abacus-managed deployment URL.
5. Verify the OIS page shows `OIS_CONSOLE` and Core API seeded counts.
6. Create or open `PITS NextGen Shell Demo` in Apps Management Console.
7. Configure source repo, branch and app path/package for PITS Shell.
8. Configure PITS Shell environment values without `DATABASE_URL`.
9. Deploy PITS Shell to its Abacus-managed deployment URL.
10. Verify the PITS page shows `PITS_SHELL` and Core API seeded counts.
11. Verify both App Shell URLs are separate and both call the same Core API.
12. Only after both pass, plan optional custom staging subdomains.

## Superseded Preview Path

Stage 0S-B temporary SuperComputer preview ops are useful for VM-local diagnostics but no longer represent the canonical UI App Shell proof.

| Previous preview endpoint | Stage 0T-A status | Reason |
|---|---|---|
| `https://<abacus-preview-base>-3000.../` | `DEPRECATED` for App Shell proof. | OIS Console must be validated as its own Abacus App Shell. |
| `https://<abacus-preview-base>-3001.../` | `DEPRECATED` for App Shell proof. | PITS Shell must be validated as its own Abacus App Shell. |

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| OIS Console Abacus App Shell managed deployment URL | `PLANNED_NOT_CREATED` | HTTP 200 OIS Console demo/status page after later Apps Management Console deployment. | Stage 0T-A contract ready; deployment not executed. |
| PITS Shell Abacus App Shell managed deployment URL | `PLANNED_NOT_CREATED` | HTTP 200 PITS Shell demo/status page after later Apps Management Console deployment. | Stage 0T-A contract ready; deployment not executed. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://<abacus-preview-base>-3000.../` | `PLANNED_NOT_CREATED` temporary OIS Console preview. | `DEPRECATED` for App Shell proof. | Apps Management Console is the source of truth for UI App Shell deployment. |
| `https://<abacus-preview-base>-3001.../` | `PLANNED_NOT_CREATED` temporary PITS Shell preview. | `DEPRECATED` for App Shell proof. | Apps Management Console is the source of truth for UI App Shell deployment. |

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
| `https://<abacus-preview-base>-3000.../` | `DEPRECATED` for App Shell proof. | Temporary SuperComputer preview is not the canonical OIS Console App Shell deployment path. |
| `https://<abacus-preview-base>-3001.../` | `DEPRECATED` for App Shell proof. | Temporary SuperComputer preview is not the canonical PITS Shell App Shell deployment path. |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Storage prefixes `49816/` and `52067/` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Legacy storage boundaries. |

### Current Test Checklist

Stage 0T-A is documentation-only. The next owner-assisted stage should verify:

| Check | Expected |
|---|---|
| OIS Console App Shell deployment URL | HTTP 200, `OIS_CONSOLE`, Core API URL, demo banner and seeded counts. |
| PITS Shell App Shell deployment URL | HTTP 200, `PITS_SHELL`, Core API URL, demo banner and seeded counts. |
| Core API health | `https://ois-nextgen.abacusai.cloud/health` remains HTTP 200. |
| Core API overview | `https://ois-nextgen.abacusai.cloud/platform/overview` remains HTTP 200 with seeded counts. |

## Safety Statement

Stage 0T-A preserves these rules:

- No deploy.
- No Abacus runtime modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No production credentials.
- No secret printing or commit.
- No UI `DATABASE_URL`.
- No Core API DB/runtime logic change.
- No OIS Phase 1 touch.
- No Emerald/BQL touch.
- No `dmp247.com` custom domain change.

## Decision

Stage 0T-A is marked `ABACUS_APP_SHELL_DEPLOYMENT_CONTRACT_READY`.

Recommended next stage: Stage 0T-B - Owner-Assisted Abacus App Shell Creation Evidence.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 20 tests. Expected mocked HTTP 500 log line came from deliberate DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. |
| `git status -sb` | PASS; Stage 0T-A documentation/status changes pending commit. |
