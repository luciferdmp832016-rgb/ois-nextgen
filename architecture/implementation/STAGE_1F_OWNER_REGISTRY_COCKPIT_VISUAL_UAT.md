# Stage 1F - Owner Registry Cockpit & Visual UAT Navigation Surface

## Stage Summary

Stage name: `Stage 1F - Owner Registry Cockpit & Visual UAT Navigation Surface`

Branch name: `codex/stage-1f-owner-registry-cockpit-visual-uat`

Previous local commit: `92c27c897d7f8feb41990c81b8cdef63b9ed434c`

Current verified runtime branch from handoff: `stage-0b-complete-handoff-ingestion`

New commit: recorded in the final Codex response after local commit creation.

Decision label: `OWNER_REGISTRY_COCKPIT_VISUAL_UAT_READY`

Expected runtime verified label after owner Abacus pass: `OWNER_REGISTRY_COCKPIT_VISUAL_UAT_RUNTIME_VERIFIED`

## Files Changed

- `packages/shared-ui/src/index.ts`
- `apps/ois-console/app/page.tsx`
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
- `architecture/implementation/STAGE_1F_OWNER_REGISTRY_COCKPIT_VISUAL_UAT.md`
- `docs/deployment/ABACUS_STAGING_DEPLOY.md`
- `docs/deployment/PUBLISHED_ENDPOINT_REGISTRY.md`

## What Was Implemented

- Added shared owner-friendly helpers for readiness labels, health labels, readiness gaps and missing/forbidden link counts.
- Added OIS `Owner Registry Cockpit / Registry Runtime Summary` to `/`, `/dashboard`, `/runtime`, `/products` and `/workspaces`.
- Added OIS list card summaries for runtime health, readiness, linked relationships, `Linked to PITS` and `What is missing?`.
- Added OIS detail `Owner-facing UAT summary` panels for products, workspaces, modules and installations.
- Added PITS `PITS Registry Cockpit / Project Runtime Summary` to `/`, `/projects` and `/runtime`.
- Added PITS project card summaries for project readiness, runtime health, linked workspace/product facts and OIS cross-links.
- Added PITS project detail `Owner-facing project UAT summary`.
- Extended public staging checks for root cockpit markers, OIS/PITS cockpit markers, per-card health/readiness markers, detail UAT summary markers and forbidden local/legacy link absence.

## What Was Not Changed

- No new Core API endpoint was added; Stage 1F composes existing `/platform/registry`, `/platform/registry/health` and `/platform/registry/readiness`.
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
- No Stage 1G or later work.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | Stage 1F adds no endpoint. | Existing Stage 1B/1D/1E endpoints are reused. |

### Changed

| Endpoint | Previous result | New expected result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com` | OIS Console root shell. | Root also shows or links the owner registry cockpit with `Owner Registry Cockpit / Registry Runtime Summary`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/dashboard` | Dashboard with registry health/readiness panels. | Dashboard starts with owner cockpit counts, health summary, readiness summary and guard status. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/products` | Products list with registry panels. | Product cards show `Runtime health:`, `Readiness:`, linked relationships, `Linked to PITS` and `What is missing?`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/workspaces` | Workspaces list with registry panels. | Workspace/project cards show `Runtime health:`, `Readiness:`, linked relationships and `What is missing?`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/runtime` | Runtime page with registry health/readiness panels. | Runtime page also starts with the owner cockpit. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/products/{id}` | Product detail with source, health and readiness panels. | Product detail also shows `Owner-facing UAT summary`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/workspaces/{id}` | Workspace detail with source, health and readiness panels. | Workspace detail also shows `Owner-facing UAT summary`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/modules/{id}` | Module detail with source, health and readiness panels. | Module detail also shows `Owner-facing UAT summary`. | Source, tests and ops checks ready. |
| `https://ois-ng.dmp247.com/installations/{id}` | Installation detail with source, health and readiness panels. | Installation detail also shows `Owner-facing UAT summary`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com` | PITS Shell root. | Root also shows `PITS Registry Cockpit / Project Runtime Summary`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/projects` | Project selector with registry panels. | Project cards show project readiness, runtime health, linked product/workspace facts and OIS cross-links. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/projects/{id}` | Project detail with source, health and readiness panels. | Project detail also shows `Owner-facing project UAT summary`. | Source, tests and ops checks ready. |
| `https://pits-ng.dmp247.com/runtime` | Runtime page with registry health/readiness panels. | Runtime page also starts with the PITS project cockpit. | Source, tests and ops checks ready. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://ois-nextgen.abacusai.cloud/platform/registry` | `PLANNED_NOT_CREATED` until owner runtime sync | Existing Stage 1B aggregate registry endpoint remains part of the checks. |
| `https://ois-nextgen.abacusai.cloud/platform/registry/health` | `PLANNED_NOT_CREATED` until owner runtime sync | Existing Stage 1D health endpoint remains part of the checks. |
| `https://ois-nextgen.abacusai.cloud/platform/registry/readiness` | `PLANNED_NOT_CREATED` until owner runtime sync | Existing Stage 1E readiness endpoint remains part of the checks. |

### Deprecated / Stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | Stage 1F does not deprecate or stop endpoints. |

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
| `bash -n ops/abacus/*.sh` | Passed via Git Bash loop over `ops/abacus/*.sh`. |
| `pnpm lint` | Passed: architecture guard. |
| `pnpm typecheck` | Passed. |
| `pnpm test` | Passed: 5 test files, 60 tests. |
| `pnpm -r --if-present build` | Passed: Core API, OIS Console and PITS Shell builds passed. |
| `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | Passed via Git Bash after build. |

## Safety Confirmation

Stage 1F is read-only and UI-compositional. It does not add writes, seeds, migrations, schema changes, auth changes, production credentials, direct UI database access, Cloudflare/DNS changes or legacy resource probes. The cockpit summarizes existing registry, health and readiness payloads and uses only approved staging links: `https://ois-nextgen.abacusai.cloud`, `https://ois-ng.dmp247.com` and `https://pits-ng.dmp247.com`.

## Owner Browser/UAT Checklist

1. Open `https://ois-ng.dmp247.com`.
   - Confirm OIS Console loads.
   - Confirm owner-facing registry/runtime summary is visible or linked.

2. Open `https://ois-ng.dmp247.com/dashboard`.
   - Confirm `Owner Registry Cockpit / Registry Runtime Summary` appears.
   - Confirm counts, badges and labels are understandable.

3. Open `https://ois-ng.dmp247.com/runtime`.
   - Confirm runtime health/readiness summary appears.

4. Open `https://ois-ng.dmp247.com/products`.
   - Confirm product rows/cards show health/readiness.
   - Click one product.
   - Confirm detail page shows owner-friendly readiness/health panel and missing/blocked reason if any.

5. Open `https://ois-ng.dmp247.com/workspaces`.
   - Confirm workspace rows/cards show health/readiness.
   - Click one workspace.
   - Confirm detail page shows readiness/linked project/product/module/installation information.

6. Open one module detail page.
   - Confirm module readiness/health panel appears.

7. Open one installation detail page.
   - Confirm installation lifecycle/readiness panel appears.

8. Open `https://pits-ng.dmp247.com`.
   - Confirm PITS Shell loads.
   - Confirm project/runtime registry summary is visible or linked.

9. Open `https://pits-ng.dmp247.com/projects`.
   - Confirm project rows/cards show readiness/health status.
   - Click one project.
   - Confirm project detail shows registry readiness and OIS cross-link if available.

10. Confirm:
   - No localhost links.
   - No `ois.dmp247.com` links.
   - No `oisys.abacusai.app` links.
   - Labels are owner-friendly.
   - UI helps answer: "Cái này đã sẵn sàng vận hành chưa? Nếu chưa thì thiếu gì?"
   - Owner can visually test something meaningful after this stage.
