# Stage 1G - Modern Responsive Shell Layout & Navigation Standard

## Stage Summary

Stage name: `Stage 1G - Modern Responsive Shell Layout & Navigation Standard`

Branch name: `codex/stage-1g-modern-responsive-shell-navigation-standard`

Previous local/runtime commit: `9813a17a6ee4801c7298b26e413ec9bfd7109d17`

Current verified runtime branch from handoff: `stage-0b-complete-handoff-ingestion`

New commit: recorded in the final Codex response after local commit creation.

Decision label: `MODERN_RESPONSIVE_SHELL_NAVIGATION_STANDARD_READY`

Expected runtime verified label after owner Abacus pass and Browser/UAT: `MODERN_RESPONSIVE_SHELL_NAVIGATION_STANDARD_RUNTIME_VERIFIED`

## Objective

Stage 1G standardizes the OIS Console and PITS Shell product layout before additional UI surfaces are added. The stage introduces a shared modern shell frame with fixed navigation, fixed header, independent main-content scrolling, responsive drawer behavior and deterministic shell markers.

## Files Changed

- `apps/ois-console/app/globals.css`
- `apps/ois-console/app/page.test.tsx`
- `apps/ois-console/app/shell.tsx`
- `apps/pits-shell/app/globals.css`
- `apps/pits-shell/app/page.test.tsx`
- `apps/pits-shell/app/shell.tsx`
- `packages/shared-ui/src/index.ts`
- `packages/shared-ui/src/product-shell.tsx`
- `tsconfig.check.json`
- `ops/abacus/check-public-staging-endpoints.sh`
- `ops/abacus/status-public-staging-runtime.sh`
- `ops/abacus/README.md`
- `architecture/implementation/IMPLEMENTATION_STATUS.md`
- `architecture/implementation/PHASE_GATE_REGISTER.md`
- `architecture/implementation/STAGE_1G_MODERN_RESPONSIVE_SHELL_LAYOUT_NAVIGATION_STANDARD.md`
- `docs/deployment/ABACUS_STAGING_DEPLOY.md`
- `docs/deployment/PUBLISHED_ENDPOINT_REGISTRY.md`

## What Was Implemented

- Added shared client shell frame `ModernProductShell` in `@ois/shared-ui`.
- Standardized OIS Console and PITS Shell around the same layout contract:
  - fixed desktop sidebar navigation,
  - fixed top bar,
  - independent scrollable main content,
  - lightweight bottom/status bar,
  - desktop hide/show navigation control,
  - responsive mobile drawer control,
  - product-specific visual tokens for OIS and PITS.
- Added deterministic Stage 1G shell markers:
  - `Modern Shell Layout`
  - `Shell Navigation Toggle`
  - `Fixed Navigation Shell`
  - `Responsive Product Shell`
- Preserved active route highlighting, existing product routes and existing OIS/PITS cross-links.
- Extended local UI tests for shell markers and preserved cockpit/detail route markers.
- Extended read-only public staging ops checks with separate Stage 1G shell-standard marker checks.

## What Was Not Changed

- No Core API endpoint was added.
- No registry data behavior changed.
- No Stage 1F cockpit content was removed.
- No health/readiness panels were removed.
- No deterministic Stage 1B/1C/1D/1E/1F ops marker was removed or weakened.
- No PITS lifecycle, case, task or domain runtime behavior was added.
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
- No Stage 1H or later work.

## Validation Commands And Results

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS |
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS |
| `pnpm -r --if-present build` | PASS |
| `REPO_DIR=$(pwd) bash ops/abacus/verify-ui-route-manifests.sh` | PASS; `UI_ROUTE_MANIFEST_CHECK_PASSED` |

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 1G changes shell HTML/layout only. |

### Changed

| Endpoint | Previous result | New result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com` | OIS root cockpit markers. | Existing markers plus `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell` and `Responsive Product Shell` after owner runtime sync. | Source tests and ops marker checks. |
| `https://pits-ng.dmp247.com` | PITS root cockpit markers. | Existing markers plus `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell` and `Responsive Product Shell` after owner runtime sync. | Source tests and ops marker checks. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview |
| `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Existing OIS dashboard content plus modern shell after sync |
| `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Existing PITS projects content plus modern shell after sync |

### Deprecated / Stopped

| Endpoint | Status | Reason |
|---|---|---|
| None | N/A | N/A |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| OIS Console shell standard after Stage 1G sync | `curl -i https://ois-ng.dmp247.com` | HTTP 200 with `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell`, `Responsive Product Shell` and existing cockpit markers. |
| PITS Shell standard after Stage 1G sync | `curl -i https://pits-ng.dmp247.com` | HTTP 200 with `Modern Shell Layout`, `Shell Navigation Toggle`, `Fixed Navigation Shell`, `Responsive Product Shell` and existing cockpit markers. |

## Safety Confirmation

Stage 1G is a read-only UI shell layout and marker standardization stage. It does not change runtime data, registry API behavior, Core API endpoints, ops safety boundaries, Cloudflare/DNS, credentials, migrations, seed data, writes, auth or legacy resources.

## Owner Browser/UAT Checklist

1. Open `https://ois-ng.dmp247.com`.
   - Confirm OIS Console root loads.
   - Confirm sidebar/navigation is fixed or behaves as a modern shell.
   - Confirm main content scrolls independently.
   - Confirm navigation does not scroll away with page content.
   - Confirm hide/show navigation button exists and works.
   - Confirm `Ready to operate` / owner cockpit marker still exists.

2. Open `https://ois-ng.dmp247.com/dashboard`.
   - Confirm Owner Registry Cockpit still appears.
   - Scroll page content.
   - Confirm sidebar/header remain stable.
   - Toggle sidebar hide/show and confirm main content expands/contracts smoothly.

3. Open `https://ois-ng.dmp247.com/products`.
   - Confirm product page is readable with the new shell.
   - Click one product.
   - Confirm detail page still works and shell remains consistent.

4. Open `https://ois-ng.dmp247.com/workspaces`.
   - Confirm workspace page is readable with the new shell.
   - Click one workspace.
   - Confirm detail page still works and shell remains consistent.

5. Open one module detail page.
   - Confirm shell remains consistent.

6. Open one installation detail page.
   - Confirm shell remains consistent.

7. Open `https://pits-ng.dmp247.com`.
   - Confirm PITS Shell root loads.
   - Confirm sidebar/navigation/header follow the same shell standard.

8. Open `https://pits-ng.dmp247.com/projects`.
   - Confirm project list works.
   - Toggle navigation hide/show if available.
   - Click one project and confirm detail still works.

9. Test responsive/mobile behavior.
   - Resize browser width narrower.
   - Confirm navigation collapses or becomes usable as drawer/compact nav.
   - Confirm content remains readable.
   - Confirm no horizontal overflow.

10. Confirm:
   - No localhost links.
   - No `ois.dmp247.com` links.
   - No `oisys.abacusai.app` links.
   - UI feels more modern and less cramped.
   - Owner can use more screen space for main content.
   - Navigation/header/bottom layout standard is suitable for future OIS/PITS product expansion.
