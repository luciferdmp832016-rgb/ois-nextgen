# Stage 1D - Registry Runtime Health & Owner UAT Surface

## Stage Summary

Stage name: `Stage 1D - Registry Runtime Health & Owner UAT Surface`

Branch name: `codex/stage-1d-registry-runtime-health-owner-uat`

Previous local commit: `3e1ddbc67bcd8ea55c872691ea25184ff5ec0c93`

Previous verified Abacus runtime commit from handoff: `8ff4e3541d94a4740c2cf3335a444c7496167912`

New commit: recorded in the final Codex response after local commit creation.

Decision label: `REGISTRY_RUNTIME_HEALTH_OWNER_UAT_READY`

Expected runtime verified label after owner Abacus pass: `REGISTRY_RUNTIME_HEALTH_OWNER_UAT_RUNTIME_VERIFIED`

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
- `architecture/implementation/STAGE_1D_REGISTRY_RUNTIME_HEALTH_OWNER_UAT.md`
- `docs/deployment/ABACUS_STAGING_DEPLOY.md`
- `docs/deployment/PUBLISHED_ENDPOINT_REGISTRY.md`

## What Was Implemented

- Added read-only Core API endpoint `GET /platform/registry/health`.
- Derived registry runtime health deterministically from the existing Stage 1B/1C registry snapshot.
- Added health statuses and badges for `Healthy`, `Configured`, `Linked`, `Reachable`, `Missing URL`, `Not applicable`, `Degraded` and `Unavailable`.
- Exposed staging-safe public links only:
  - Core API: `https://ois-nextgen.abacusai.cloud`
  - OIS Console: `https://ois-ng.dmp247.com`
  - PITS Shell: `https://pits-ng.dmp247.com`
- Added aggregate `Registry Runtime Health` panels to OIS Console dashboard/products/workspaces/runtime pages.
- Added OIS Console detail health panels:
  - `Product Runtime Health`
  - `Workspace Runtime Health`
  - `Module Runtime Health`
  - `Installation Runtime Health`
- Added aggregate `Registry Runtime Health` panels to PITS Shell overview/projects/runtime pages.
- Added PITS Shell detail health panel:
  - `Project Runtime Health`
- Extended public staging checks to verify:
  - `/platform/registry/health`
  - OIS/PITS health UI markers
  - Stage 1D detail health markers
  - absence of `localhost`, `127.0.0.1`, `ois.dmp247.com` and `oisys.abacusai.app` in Stage 1D public UI/API health surfaces.

## What Was Not Changed

- No schema changes.
- No Prisma migrations.
- No seed execution.
- No `prisma db push`.
- No writes or mutation endpoints.
- No `/auth/demo-login` changes.
- No auth changes.
- No Cloudflare, DNS, nginx or systemd changes from Codex.
- No UI Prisma import and no UI `DATABASE_URL` usage.
- No legacy or production resource access.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/registry/health` | `PLANNED_NOT_CREATED` until owner runtime sync | HTTP 200 read-only registry runtime health payload with `source=default-db`, `mode=read-only`, `summary`, `entities` and staging-safe URLs. | Source, tests and ops checks ready in Stage 1D. |

### Changed

| Endpoint | Previous result | New expected result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com/dashboard` | Dashboard with registry source/runtime cards. | Dashboard also shows `Registry Runtime Health`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/products/{id}` | Product detail with source marker and cross-links. | Product detail also shows `Product Runtime Health`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/workspaces/{id}` | Workspace detail with source marker and cross-links. | Workspace detail also shows `Workspace Runtime Health`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/modules/{id}` | Module detail with source marker and relationships. | Module detail also shows `Module Runtime Health`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/installations/{id}` | Installation detail with source marker and cross-links. | Installation detail also shows `Installation Runtime Health`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/projects` | Project selector and installation registry. | Projects route also shows `Registry Runtime Health`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/projects/{id}` | Project detail with source marker and OIS links. | Project detail also shows `Project Runtime Health`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/runtime` | Runtime status and registry panels. | Runtime route also shows `Registry Runtime Health`. | Source, tests and ops checks ready. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console root. |
| `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Shell root. |

### Deprecated / Stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | Stage 1D does not deprecate or stop endpoints. |

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
| `pnpm typecheck` | Passed. |
| `pnpm test` | Passed. |
| `bash -n ops/abacus/*.sh` | Passed via Git Bash at `C:\Program Files\Git\bin\bash.exe`; the Windows WSL `bash` shim is present but cannot find `/bin/bash`. |
| `pnpm lint` | Passed. |
| `pnpm -r --if-present build` | Passed. |
| `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | Passed via Git Bash after build. |

## Safety Confirmation

Stage 1D is read-only and Core-API-driven. It does not add writes, seeds, migrations, schema changes, auth changes, production credentials, direct UI database access, Cloudflare/DNS changes or legacy resource probes. `Reachable` in the health payload means a staging-safe public URL is configured; the Core API does not probe UI routes or external services while building the read-only health response.

## Owner Browser/UAT Checklist

1. Open `https://ois-ng.dmp247.com`.
   - PASS: OIS Console opens, shows `OIS_CONSOLE`, demo banner and Core API health.
   - BLOCK: The page does not load, shows a non-OIS shell, or points at localhost/legacy URLs.

2. Open `https://ois-ng.dmp247.com/dashboard`.
   - PASS: `Registry Runtime Health` appears with readable healthy/degraded/missing URL counts.
   - BLOCK: The health section is missing or contains localhost/legacy links.

3. Open `https://ois-ng.dmp247.com/products`.
   - Click a product name.
   - PASS: The product detail page loads, `Product Detail Source` and `Product Runtime Health` appear, health badges are understandable, and related links point only to OIS/PITS/Core API staging URLs.
   - BLOCK: The detail page fails, health is missing, or links point to localhost, `ois.dmp247.com` or `oisys.abacusai.app`.

4. Open `https://ois-ng.dmp247.com/workspaces`.
   - Click a workspace name.
   - PASS: Workspace details load, `Workspace Runtime Health` is visible, and linked product/project/module/installation data is understandable.
   - BLOCK: Workspace health is missing, relationships are confusing, or staging-safe links are absent when relationships exist.

5. From OIS Console, open at least one module detail page.
   - PASS: `Module Runtime Health` appears and explains configured/product-link/Core API detail status.
   - BLOCK: The module page lacks health context or implies unsupported module runtime behavior.

6. From OIS Console, open at least one installation detail page.
   - PASS: `Installation Runtime Health` appears and shows product/workspace/project links plus PITS project link where applicable.
   - BLOCK: The installation page cannot explain whether product/workspace/project links are present.

7. Open `https://pits-ng.dmp247.com`.
   - PASS: PITS Shell opens, shows `PITS_SHELL`, demo banner and Core API health.
   - BLOCK: The page does not load, shows OIS Console, or uses localhost/legacy URLs.

8. Open `https://pits-ng.dmp247.com/projects`.
   - PASS: `Registry Runtime Health` appears with project availability context and project cards still load.
   - BLOCK: Project selector fails or health context is missing.

9. Click a project detail page from PITS.
   - PASS: `Project Detail Source` and `Project Runtime Health` appear, OIS product/workspace links work if present, and Core API detail source is understandable.
   - BLOCK: Project detail fails, health is missing, OIS cross-links are broken, or labels are too technical to act on.

10. Confirm UX wording.
    - Are `Healthy`, `Configured`, `Linked`, `Reachable`, `Missing URL`, `Not applicable`, `Degraded` and `Unavailable` understandable?
    - Are cross-links useful?
    - Is any label too technical for an owner/operator?
    - Is anything visually confusing?
    - Does the page help an owner know what is configured, linked, reachable or missing?
