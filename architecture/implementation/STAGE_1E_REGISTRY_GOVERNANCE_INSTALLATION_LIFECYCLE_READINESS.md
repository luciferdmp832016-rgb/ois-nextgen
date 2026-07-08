# Stage 1E - Registry Governance & Installation Lifecycle Readiness

## Stage Summary

Stage name: `Stage 1E - Registry Governance & Installation Lifecycle Readiness`

Branch name: `codex/stage-1e-registry-governance-installation-lifecycle-readiness`

Previous local commit: `6dc5df1510721a1cde0c1c5093099ac2d65797ce`

Current verified runtime branch from handoff: `stage-0b-complete-handoff-ingestion`

New commit: recorded in the final Codex response after local commit creation.

Decision label: `REGISTRY_GOVERNANCE_INSTALLATION_LIFECYCLE_READY`

Expected runtime verified label after owner Abacus pass: `REGISTRY_GOVERNANCE_INSTALLATION_LIFECYCLE_RUNTIME_VERIFIED`

## Files Changed

- `apps/core-api/src/app.ts`
- `apps/core-api/src/app.test.ts`
- `packages/shared-ui/src/index.ts`
- `apps/ois-console/app/shell.tsx`
- `apps/ois-console/app/dashboard/page.tsx`
- `apps/ois-console/app/products/page.tsx`
- `apps/ois-console/app/products/[id]/page.tsx`
- `apps/ois-console/app/workspaces/page.tsx`
- `apps/ois-console/app/workspaces/[id]/page.tsx`
- `apps/ois-console/app/modules/[id]/page.tsx`
- `apps/ois-console/app/installations/[id]/page.tsx`
- `apps/ois-console/app/runtime/page.tsx`
- `apps/ois-console/app/globals.css`
- `apps/ois-console/app/page.test.tsx`
- `apps/pits-shell/app/shell.tsx`
- `apps/pits-shell/app/page.tsx`
- `apps/pits-shell/app/projects/page.tsx`
- `apps/pits-shell/app/projects/[id]/page.tsx`
- `apps/pits-shell/app/runtime/page.tsx`
- `apps/pits-shell/app/globals.css`
- `apps/pits-shell/app/page.test.tsx`
- `ops/abacus/check-public-staging-endpoints.sh`
- `ops/abacus/status-public-staging-runtime.sh`
- `ops/abacus/README.md`
- `architecture/implementation/IMPLEMENTATION_STATUS.md`
- `architecture/implementation/PHASE_GATE_REGISTER.md`
- `architecture/implementation/STAGE_1E_REGISTRY_GOVERNANCE_INSTALLATION_LIFECYCLE_READINESS.md`
- `docs/deployment/ABACUS_STAGING_DEPLOY.md`
- `docs/deployment/PUBLISHED_ENDPOINT_REGISTRY.md`

## What Was Implemented

- Added read-only Core API endpoint `GET /platform/registry/readiness`.
- Derived readiness deterministically from the existing Stage 1B/1C registry snapshot and staging-safe runtime config.
- Added readiness statuses for `READY`, `INCOMPLETE`, `BLOCKED`, `NOT_APPLICABLE` and `UNKNOWN`.
- Added owner-readable checks for configured products, workspace/project/module/installation links, runtime URL presence, staging URL safety, forbidden link absence, cross-product links and owner UAT requirement.
- Exposed staging-safe public links only:
  - Core API: `https://ois-nextgen.abacusai.cloud`
  - OIS Console: `https://ois-ng.dmp247.com`
  - PITS Shell: `https://pits-ng.dmp247.com`
- Added aggregate `Registry Governance / Readiness` panels to OIS Console dashboard/products/workspaces/runtime pages.
- Added OIS Console detail readiness panels:
  - `Product Governance / Readiness`
  - `Workspace Governance / Readiness`
  - `Module Governance / Readiness`
  - `Installation Governance / Readiness`
- Added aggregate `Registry Governance / Readiness` panels to PITS Shell overview/projects/runtime pages.
- Added PITS Shell detail readiness panel:
  - `Project Governance / Readiness`
- Added visible `What is missing?` sections on entity readiness panels.
- Extended public staging checks to verify:
  - `/platform/registry/readiness`
  - OIS/PITS readiness UI markers
  - Stage 1D health checks still pass
  - absence of `localhost`, `127.0.0.1`, `ois.dmp247.com` and `oisys.abacusai.app` in Stage 1E public UI/API readiness surfaces.

## What Was Not Changed

- No schema changes.
- No Prisma migrations.
- No seed execution.
- No `prisma db push`.
- No writes or mutation endpoints.
- No admin sync flows.
- No `/auth/demo-login` changes.
- No auth changes.
- No Cloudflare, DNS, nginx or systemd changes from Codex.
- No UI Prisma import and no UI `DATABASE_URL` usage.
- No legacy or production resource access.
- No Stage 1F or later work.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/registry/readiness` | `PLANNED_NOT_CREATED` until owner runtime sync | HTTP 200 read-only registry readiness payload with `source=default-db`, `mode=read-only`, `summary`, `entities`, `READY` and staging-safe URLs. | Source, tests and ops checks ready in Stage 1E. |

### Changed

| Endpoint | Previous result | New expected result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com/dashboard` | Dashboard with registry runtime health. | Dashboard also shows `Registry Governance / Readiness`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/products` | Products list with registry runtime health. | Products list also shows `Registry Governance / Readiness`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/products/{id}` | Product detail with source, health and cross-links. | Product detail also shows `Product Governance / Readiness` and `What is missing?`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/workspaces` | Workspaces list with registry runtime health. | Workspaces list also shows `Registry Governance / Readiness`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/workspaces/{id}` | Workspace detail with source, health and cross-links. | Workspace detail also shows `Workspace Governance / Readiness` and `What is missing?`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/modules/{id}` | Module detail with source and health. | Module detail also shows `Module Governance / Readiness` and `What is missing?`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/installations/{id}` | Installation detail with source and health. | Installation detail also shows `Installation Governance / Readiness` and `What is missing?`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/runtime` | Runtime page with registry runtime health. | Runtime page also shows `Registry Governance / Readiness`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/projects` | Project selector with registry runtime health. | Projects route also shows `Registry Governance / Readiness`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/projects/{id}` | Project detail with source, health and OIS links. | Project detail also shows `Project Governance / Readiness` and `What is missing?`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/runtime` | Runtime page with registry runtime health. | Runtime page also shows `Registry Governance / Readiness`. | Source, tests and ops checks ready. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://ois-nextgen.abacusai.cloud/platform/registry/health` | `PLANNED_NOT_CREATED` until owner runtime sync | Stage 1D health endpoint remains part of the checks. |
| `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console root. |
| `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Shell root. |

### Deprecated / Stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | Stage 1E does not deprecate or stop endpoints. |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Legacy database. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Legacy database. |

## Validation Commands And Results

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | Passed via Git Bash loop over `ops/abacus/*.sh`; the Windows WSL `bash` shim is present but cannot find `/bin/bash`. |
| `pnpm lint` | Passed. |
| `pnpm typecheck` | Passed. |
| `pnpm test` | Passed: 5 test files, 60 tests. |
| `pnpm -r --if-present build` | Passed: Core API, OIS Console and PITS Shell builds passed. |
| `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | Passed via Git Bash after build. |

## Safety Confirmation

Stage 1E is read-only and Core-API-driven. It does not add writes, seeds, migrations, schema changes, auth changes, production credentials, direct UI database access, Cloudflare/DNS changes or legacy resource probes. Readiness is computed from existing registry data and staging-safe URL configuration; the Core API does not call LLMs, mutate installation lifecycle state or probe external UI routes while building the readiness response.

## Owner Browser/UAT Checklist

1. Open `https://ois-ng.dmp247.com/dashboard`.
   - Confirm `Registry Governance / Readiness` panel appears.
   - Confirm statuses are understandable.

2. Open `https://ois-ng.dmp247.com/products`.
   - Confirm product readiness appears on list or detail flow.
   - Click one product.
   - Confirm readiness status and missing/blocked reasons are understandable.

3. Open `https://ois-ng.dmp247.com/workspaces`.
   - Click one workspace.
   - Confirm workspace readiness appears.

4. Open one module detail page.
   - Confirm module readiness appears.

5. Open one installation detail page.
   - Confirm installation readiness/lifecycle status appears.

6. Open `https://pits-ng.dmp247.com/projects`.
   - Confirm project readiness appears.

7. Click one PITS project.
   - Confirm project readiness appears.
   - Confirm OIS cross-link works if present.

8. Confirm:
   - No localhost links.
   - No `ois.dmp247.com` links.
   - No `oisys.abacusai.app` links.
   - Labels are owner-friendly, not overly technical.
   - UI helps answer: "Cái này đã sẵn sàng vận hành chưa? Nếu chưa thì thiếu gì?"
