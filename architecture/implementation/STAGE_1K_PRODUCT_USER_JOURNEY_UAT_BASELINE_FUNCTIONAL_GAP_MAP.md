# Stage 1K - Product User Journey UAT Baseline & Functional Gap Map

## Stage Summary

Stage name: `Stage 1K - Product User Journey UAT Baseline & Functional Gap Map`

Branch name: `codex/stage-1k-product-user-journey-uat-baseline`

Previous local/runtime commit: `af90e7089917cca043e6d35041d8a7ca7ea54b93`

Current verified runtime branch from handoff: `stage-0b-complete-handoff-ingestion`

New commit: recorded in the final Codex response after local commit creation.

Decision label: `PRODUCT_USER_JOURNEY_UAT_BASELINE_READY`

Expected runtime verified label after owner Abacus pass and Browser/UAT: `PRODUCT_USER_JOURNEY_UAT_BASELINE_RUNTIME_VERIFIED`

## Objective

Stage 1K adds a read-only product-level UAT baseline and functional gap map for OIS Console and PITS Shell. It answers what real users can test today, which surfaces are platform/control-plane only, which product functions are missing, and which user journey should be built next.

## Files Changed

- `apps/core-api/src/app.ts`
- `apps/core-api/src/app.test.ts`
- `apps/ois-console/app/dashboard/page.tsx`
- `apps/ois-console/app/globals.css`
- `apps/ois-console/app/installations/[id]/page.tsx`
- `apps/ois-console/app/page.test.tsx`
- `apps/ois-console/app/page.tsx`
- `apps/ois-console/app/products/[id]/page.tsx`
- `apps/ois-console/app/runtime/page.tsx`
- `apps/ois-console/app/shell.tsx`
- `apps/ois-console/app/workspaces/[id]/page.tsx`
- `apps/pits-shell/app/globals.css`
- `apps/pits-shell/app/page.test.tsx`
- `apps/pits-shell/app/page.tsx`
- `apps/pits-shell/app/projects/[id]/page.tsx`
- `apps/pits-shell/app/projects/page.tsx`
- `apps/pits-shell/app/runtime/page.tsx`
- `apps/pits-shell/app/shell.tsx`
- `packages/shared-ui/src/index.ts`
- `ops/abacus/check-public-staging-endpoints.sh`
- `ops/abacus/status-public-staging-runtime.sh`
- `ops/abacus/README.md`
- `architecture/implementation/IMPLEMENTATION_STATUS.md`
- `architecture/implementation/PHASE_GATE_REGISTER.md`
- `architecture/implementation/STAGE_1K_PRODUCT_USER_JOURNEY_UAT_BASELINE_FUNCTIONAL_GAP_MAP.md`
- `docs/deployment/ABACUS_STAGING_DEPLOY.md`
- `docs/deployment/PUBLISHED_ENDPOINT_REGISTRY.md`

## What Was Implemented

- Added read-only Core API `GET /platform/product-uat`.
- Added deterministic product UAT categories:
  - `AVAILABLE_FOR_BROWSER_UAT`
  - `PLATFORM_CONTROL_PLANE_ONLY`
  - `PLACEHOLDER_OR_SHELL_ONLY`
  - `FUTURE_PRODUCT_FUNCTION`
  - `BLOCKED_BY_MISSING_DATA_MODEL`
  - `BLOCKED_BY_WRITE_BOUNDARY`
  - `BLOCKED_BY_AUTH_OR_PERMISSION`
  - `NEEDS_OWNER_DECISION`
- Added OIS and PITS product UAT maps with visible pages, current user-test paths, current reality, functional gaps, blockers, evidence and recommended next product journeys.
- Added shared UI parsing/helpers for the product UAT payload.
- Added OIS `Product User Journey UAT` panels on root, dashboard, runtime, product detail, workspace detail and installation detail surfaces.
- Added PITS `Product User Journey UAT` panels on root, projects, runtime and project detail surfaces.
- Extended tests and ops checks for the endpoint, UI markers, forbidden-link absence, no mutation endpoints and no UI DB/Prisma boundary regression.

## What Was Not Changed

- No product workflow write action was added.
- No admin/write/sync action was enabled.
- No mutation endpoint was added for product UAT, user journeys or product capabilities.
- No schema changes.
- No Prisma migrations.
- No seed execution.
- No `prisma db push`.
- No `/auth/demo-login` changes.
- No auth changes.
- No LLM or intelligence behavior.
- No Cloudflare, DNS, nginx or systemd changes from Codex.
- No UI Prisma import and no UI `DATABASE_URL` usage.
- No legacy or production resource access.
- No Stage 1L or later work.

## Validation Commands And Results

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS via `C:\Program Files\Git\bin\bash.exe`. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS, 65/65 tests. |
| `pnpm -r --if-present build` | PASS. |
| `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | PASS via Git Bash; `UI_ROUTE_MANIFEST_CHECK_PASSED`. |

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/platform/product-uat` | Source-ready | HTTP 200 read-only product UAT/gap-map payload with `Product User Journey UAT`, `Testable now`, `Control-plane only`, `Functional gap map`, `Next product journey` and `NOT_ALLOWED_IN_STAGE_1K`. | Core API test and ops checks. |

### Changed

| Endpoint | Previous result | New result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com` | OIS root cockpit/shell/design markers. | Adds product UAT summary after owner runtime sync. | Source tests and ops marker checks. |
| `https://ois-ng.dmp247.com/dashboard` | OIS cockpit/readiness/health plus review/admin boundaries. | Adds Product User Journey / UAT Baseline panel. | Source tests and ops marker checks. |
| `https://ois-ng.dmp247.com/runtime` | OIS runtime/readiness/health plus review/admin boundaries. | Adds product capability/UAT status panel. | Source tests and ops marker checks. |
| OIS product/workspace/installation detail routes | Detail UAT/readiness/health plus review/admin boundary surfaces. | Adds entity-aware product UAT/gap-map surfaces. | Source tests and ops marker checks. |
| `https://pits-ng.dmp247.com` | PITS root cockpit/shell/design markers. | Adds PITS product UAT summary after owner runtime sync. | Source tests and ops marker checks. |
| `https://pits-ng.dmp247.com/projects` | PITS project selector/cockpit plus review/admin boundary surfaces. | Adds product UAT baseline that distinguishes project registry shell from true workflow app behavior. | Source tests and ops marker checks. |
| `https://pits-ng.dmp247.com/runtime` | PITS runtime/readiness/health plus review/admin boundaries. | Adds product capability/UAT status panel. | Source tests and ops marker checks. |
| PITS project detail route | Project UAT/readiness/health plus review/admin boundary surfaces. | Adds project-scoped functional gap map. | Source tests and ops marker checks. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview |
| `https://ois-nextgen.abacusai.cloud/platform/registry` | Source-ready | Read-only aggregate registry |
| `https://ois-nextgen.abacusai.cloud/platform/registry/health` | Source-ready | Read-only registry runtime health |
| `https://ois-nextgen.abacusai.cloud/platform/registry/readiness` | Source-ready | Read-only registry governance/readiness |
| `https://ois-nextgen.abacusai.cloud/platform/owner-review` | Source-ready | Read-only owner review safe action-boundary payload |
| `https://ois-nextgen.abacusai.cloud/platform/admin-boundary` | Source-ready | Read-only audit/admin permission model payload |

### Deprecated / Stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | N/A |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain |

## Owner Browser/UAT Checklist

1. Open https://ois-ng.dmp247.com
   - Confirm OIS Console loads.
   - Confirm no regression from Stage 1G/1H/1I/1J.
   - Confirm product UAT/user journey summary is visible or linked.
2. Open https://ois-ng.dmp247.com/dashboard
   - Confirm Product User Journey / UAT Baseline panel appears.
   - Confirm it clearly separates:
     - testable now
     - control-plane only
     - not implemented yet
     - next product journey
3. Open https://ois-ng.dmp247.com/runtime
   - Confirm UAT/product capability status appears if applicable.
   - Confirm status wording is understandable for owner/operator.
4. Open https://ois-ng.dmp247.com/products
   - Click one product.
   - Confirm product detail shows what can be tested today and what is still future/missing.
5. Open https://ois-ng.dmp247.com/workspaces
   - Click one workspace.
   - Confirm workspace detail does not pretend to have end-user functions that are not implemented yet.
   - Confirm the gap map is honest and clear.
6. Open https://pits-ng.dmp247.com
   - Confirm PITS Shell loads.
   - Confirm PITS product/UAT status is visible or linked.
7. Open https://pits-ng.dmp247.com/projects
   - Confirm project list shows whether current PITS is project registry shell, readiness shell, or true workflow app.
   - Click one project.
   - Confirm project detail shows current testable functions and future functional gaps.
8. Confirm:
   - No localhost links.
   - No ois.dmp247.com links.
   - No oisys.abacusai.app links.
   - No secret/env/internal error output.
   - No mutation/write/admin action is enabled.
   - UI honestly distinguishes current platform foundation from actual end-user product functions.
   - Owner can decide what product-level function to build next.

## Safety Confirmation

Stage 1K is a read-only product UAT/gap-map stage. It does not execute product writes, expose mutation endpoints, change database schema, run migrations, run seed, run `prisma db push`, connect to production, use production credentials or touch legacy resources.
