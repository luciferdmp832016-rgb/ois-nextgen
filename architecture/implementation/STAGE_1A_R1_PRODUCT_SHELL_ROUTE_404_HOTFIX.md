# Stage 1A-R1 Product Shell Route 404 Hotfix

Stage 1A-R1 result: `PRODUCT_SHELL_ROUTE_404_HOTFIX_READY`.

## Objective

Fix the OIS Console and PITS Shell product route HTTP 404s discovered during Abacus public staging runtime verification after Stage 1A.

Stage 1A-R1 is a safe ops/test/documentation hotfix. It does not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL` or touch legacy resources.

## Runtime Failure Evidence

After Abacus pulled Stage 1A, ran `pnpm -r --if-present build` and restarted the public staging runtime, these routes returned HTTP 404 both locally and publicly:

| Shell | Route | Local result | Public result |
|---|---|---|---|
| OIS Console | `/products` | `http://127.0.0.1:3000/products` -> HTTP 404 | `https://ois-ng.dmp247.com/products` -> HTTP 404 |
| OIS Console | `/workspaces` | `http://127.0.0.1:3000/workspaces` -> HTTP 404 | `https://ois-ng.dmp247.com/workspaces` -> HTTP 404 |
| OIS Console | `/runtime` | `http://127.0.0.1:3000/runtime` -> HTTP 404 | `https://ois-ng.dmp247.com/runtime` -> HTTP 404 |
| PITS Shell | `/runtime` | `http://127.0.0.1:3001/runtime` -> HTTP 404 | `https://pits-ng.dmp247.com/runtime` -> HTTP 404 |

These routes continued to pass:

- `https://ois-ng.dmp247.com`
- `https://ois-ng.dmp247.com/dashboard`
- `https://pits-ng.dmp247.com`
- `https://pits-ng.dmp247.com/projects`

Core API, systemd services, Cloudflare Tunnel, root routes, dashboard and projects were healthy. Because loopback routes also returned HTTP 404, the failure is not a Cloudflare, DNS or tunnel problem.

## Investigation

Checked route source files:

| File | Status |
|---|---|
| `apps/ois-console/app/products/page.tsx` | Present. |
| `apps/ois-console/app/workspaces/page.tsx` | Present. |
| `apps/ois-console/app/runtime/page.tsx` | Present. |
| `apps/pits-shell/app/runtime/page.tsx` | Present. |

Checked package and Next.js runtime assumptions:

| Item | Finding |
|---|---|
| OIS Console `build` | `next build`. |
| OIS Console `start` | `next start -p 3000`. |
| PITS Shell `build` | `next build`. |
| PITS Shell `start` | `next start -p 3001`. |
| Next config | Only `transpilePackages: ["@ois/shared-ui"]`; no `basePath`, route group, middleware or `trailingSlash` setting. |
| Expected systemd working dirs | `apps/ois-console` and `apps/pits-shell`. |

Checked local build artifacts:

| Artifact | Status |
|---|---|
| `apps/ois-console/.next/routes-manifest.json` | Includes `/`, `/dashboard`, `/products`, `/workspaces`, `/runtime`. |
| `apps/ois-console/.next/server/app/products/page.js` | Present. |
| `apps/ois-console/.next/server/app/workspaces/page.js` | Present. |
| `apps/ois-console/.next/server/app/runtime/page.js` | Present. |
| `apps/pits-shell/.next/routes-manifest.json` | Includes `/`, `/projects`, `/runtime`. |
| `apps/pits-shell/.next/server/app/runtime/page.js` | Present. |

Inference: the Stage 1A source and local production build artifacts contain the routes. The Abacus 404 pattern is consistent with stale or unverified UI `.next` artifacts on the service path being restarted after sync. Stage 1A-R1 therefore hardens the Abacus build/restart path instead of changing route behavior.

## Hotfix

Added `ops/abacus/verify-ui-route-manifests.sh`.

The script is read-only and checks:

- OIS Console `.next/routes-manifest.json` includes `/`, `/dashboard`, `/products`, `/workspaces` and `/runtime`.
- OIS Console `.next/server/app/**/page.js` entries exist for the same routes.
- PITS Shell `.next/routes-manifest.json` includes `/`, `/projects` and `/runtime`.
- PITS Shell `.next/server/app/**/page.js` entries exist for the same routes.

Updated Abacus ops scripts:

| Script | Stage 1A-R1 change |
|---|---|
| `ops/abacus/runtime-sync.sh` | Removes only generated OIS/PITS `.next` folders before build by default, then runs the route manifest guard after `pnpm -r --if-present build`. |
| `ops/abacus/install-ui-shell-systemd-services.sh` | Removes only generated OIS/PITS `.next` folders before UI builds by default, then runs the route manifest guard before installing/restarting services. |
| `ops/abacus/restart-public-staging-runtime.sh` | Runs the route manifest guard before service restarts and blocks restart if expected production route artifacts are missing. |

Updated tests:

- `apps/ui-demo-static-guard.test.ts` now asserts every Stage 1A public route has an App Router `page.tsx`.
- The existing static guard continues to block direct UI `DATABASE_URL` and legacy production references.

## Expected Owner Runtime Path

After Stage 1A-R1 is merged:

```sh
cd /home/ubuntu/ois-nextgen
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

Expected hotfix behavior:

- `runtime-sync.sh` cleans generated UI `.next` folders.
- `pnpm -r --if-present build` rebuilds OIS Console and PITS Shell.
- `verify-ui-route-manifests.sh` proves the expected Stage 1A route artifacts exist.
- `restart-public-staging-runtime.sh` refuses to restart if the route artifacts are missing.
- Public endpoint checks verify all Stage 1A routes.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | N/A |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com/products` | Stage 1A planned route. | `BLOCKED` until Stage 1A-R1 owner runtime sync verifies HTTP 200. | Stage 1A Abacus runtime verification returned local/public HTTP 404. |
| `https://ois-ng.dmp247.com/workspaces` | Stage 1A planned route. | `BLOCKED` until Stage 1A-R1 owner runtime sync verifies HTTP 200. | Stage 1A Abacus runtime verification returned local/public HTTP 404. |
| `https://ois-ng.dmp247.com/runtime` | Stage 1A planned route. | `BLOCKED` until Stage 1A-R1 owner runtime sync verifies HTTP 200. | Stage 1A Abacus runtime verification returned local/public HTTP 404. |
| `https://pits-ng.dmp247.com/runtime` | Stage 1A planned route. | `BLOCKED` until Stage 1A-R1 owner runtime sync verifies HTTP 200. | Stage 1A Abacus runtime verification returned local/public HTTP 404. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Core API health remains current. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | DB-backed read-only Platform Overview remains current. |
| `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console root remained passing in Stage 1A Abacus verification. |
| `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console dashboard remained passing in Stage 1A Abacus verification. |
| `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Shell root remained passing in Stage 1A Abacus verification. |
| `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS projects remained passing in Stage 1A Abacus verification. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint/process | Status | Reason |
|---|---|---|
| None | N/A | N/A |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Cloudflare tunnel token | Secret | Never document, print, store or commit. |

### Current Test Checklist

| Check | Command | Expected |
|---|---|---|
| UI route manifest guard after build | `bash ops/abacus/verify-ui-route-manifests.sh` | `UI_ROUTE_MANIFEST_CHECK_PASSED`. |
| Public staging runtime status after owner sync | `bash ops/abacus/status-public-staging-runtime.sh` | Core API, OIS Console, PITS Shell, token-safe cloudflared status and expanded route checks pass. |
| Public endpoint smoke after owner sync | `bash ops/abacus/check-public-staging-endpoints.sh` | Core API, OIS and PITS public marker/count checks pass across the Stage 1A routes. |

## Safety Statement

- No Cloudflare dashboard change.
- No DNS change.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No `DATABASE_URL` usage in UI shells.
- No Prisma imports in UI shells.
- No `ois.dmp247.com` modification.
- No `oisys.abacusai.app` modification.
- No legacy DB/storage/resource touch.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS. |
| `pnpm lint` | PASS. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS. |
| `pnpm -r --if-present build` | PASS. |
| `git status -sb` | PASS; Stage 1A-R1 hotfix changes pending commit only. |
