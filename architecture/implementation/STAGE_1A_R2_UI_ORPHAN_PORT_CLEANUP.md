# Stage 1A-R2 UI Orphan Port Cleanup

Stage 1A-R2 result: `UI_ORPHAN_PORT_CLEANUP_READY`.

## Objective

Make the Stage 1A-R1 manual Abacus runtime fix permanent by adding safe orphan UI port cleanup to public staging restart operations.

Stage 1A-R2 is an ops/documentation hotfix. It does not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, use UI `DATABASE_URL` or touch legacy resources.

## Runtime Evidence

After Stage 1A-R1, route artifacts existed and `verify-ui-route-manifests.sh` passed, but OIS/PITS systemd services still failed because orphan or legacy Next.js processes were holding ports `3000` and `3001`.

Manual Abacus recovery:

```sh
sudo systemctl stop ois-nextgen-ois-console ois-nextgen-pits-shell
sudo fuser -k 3000/tcp 3001/tcp
sudo systemctl reset-failed ois-nextgen-ois-console ois-nextgen-pits-shell
sudo systemctl start ois-nextgen-ois-console ois-nextgen-pits-shell
```

After manual cleanup:

| Check | Result |
|---|---|
| `ois-nextgen-ois-console` | Active. |
| `ois-nextgen-pits-shell` | Active. |
| OIS local `/` | PASS. |
| OIS local `/dashboard` | PASS. |
| OIS local `/products` | PASS. |
| OIS local `/workspaces` | PASS. |
| OIS local `/runtime` | PASS. |
| PITS local `/` | PASS. |
| PITS local `/projects` | PASS. |
| PITS local `/runtime` | PASS. |
| `https://ois-ng.dmp247.com` | PASS. |
| `https://ois-ng.dmp247.com/dashboard` | PASS. |
| `https://ois-ng.dmp247.com/products` | PASS. |
| `https://ois-ng.dmp247.com/workspaces` | PASS. |
| `https://ois-ng.dmp247.com/runtime` | PASS. |
| `https://pits-ng.dmp247.com` | PASS. |
| `https://pits-ng.dmp247.com/projects` | PASS. |
| `https://pits-ng.dmp247.com/runtime` | PASS. |

Manual decision labels achieved:

- `PRODUCT_SHELL_ROUTE_404_HOTFIX_RUNTIME_VERIFIED`
- `PRODUCT_SHELL_NAVIGATION_BASELINE_RUNTIME_VERIFIED`
- `PUBLIC_STAGING_RUNTIME_STATUS_PASSED`
- `PUBLIC_STAGING_ENDPOINT_CHECK_PASSED`

## Root Cause

`ORPHAN_UI_PORT_PROCESS_BLOCKED_SYSTEMD_RESTART`

The Stage 1A-R1 route artifact guard was correct, but restart operations could still fail when non-service-owned or stale Next.js processes continued listening on UI ports after systemd service stop/restart attempts.

## Permanent Hotfix

Updated `ops/abacus/restart-public-staging-runtime.sh` so the UI restart sequence is:

1. Verify UI route manifests.
2. Restart Core API and wait for Core API readiness.
3. Stop `ois-nextgen-ois-console` and `ois-nextgen-pits-shell`.
4. Stop legacy temporary UI demo PID-file processes.
5. Print listeners on ports `3000` and `3001`.
6. If listeners remain while the corresponding service is inactive, print `ORPHAN_UI_PROCESS_SUSPECTED`.
7. Kill only listeners bound to `3000/tcp` and `3001/tcp` with `sudo fuser -k 3000/tcp 3001/tcp`.
8. Print listeners after cleanup.
9. Reset failed state for the OIS/PITS UI services.
10. Start the OIS/PITS UI services.
11. Verify both services are active.
12. Print listeners after systemd start.
13. Verify all Stage 1A local routes.
14. Verify public endpoints.

Added helper logic in `ops/abacus/lib-public-staging-runtime.sh`:

- `public_staging_port_has_listener`
- `public_staging_wait_for_route`

## Safety Boundaries

- UI orphan cleanup targets only `3000/tcp` and `3001/tcp`.
- Core API port `4000` is never killed by the orphan cleanup.
- `cloudflared` is never killed by the orphan cleanup.
- No process command lines, environment values, `.env`, `DATABASE_URL`, Cloudflare tokens or secrets are printed.
- Cloudflare/DNS state is not changed.
- No migrations, seed or `prisma db push` runs.
- No production/legacy resource is touched.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | N/A |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| `https://ois-ng.dmp247.com/products` | `BLOCKED` after Stage 1A runtime 404. | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Owner manual cleanup evidence: HTTP 200/pass after orphan UI port cleanup. |
| `https://ois-ng.dmp247.com/workspaces` | `BLOCKED` after Stage 1A runtime 404. | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Owner manual cleanup evidence: HTTP 200/pass after orphan UI port cleanup. |
| `https://ois-ng.dmp247.com/runtime` | `BLOCKED` after Stage 1A runtime 404. | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Owner manual cleanup evidence: HTTP 200/pass after orphan UI port cleanup. |
| `https://pits-ng.dmp247.com/runtime` | `BLOCKED` after Stage 1A runtime 404. | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | Owner manual cleanup evidence: HTTP 200/pass after orphan UI port cleanup. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Core API health remains current. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | DB-backed read-only Platform Overview remains current. |
| `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console root remains passing. |
| `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console dashboard remains passing. |
| `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Shell root remains passing. |
| `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS projects remains passing. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint/process | Status | Reason |
|---|---|---|
| Orphan UI listeners on `3000/tcp` and `3001/tcp` | `DEPRECATED` | Public staging restart now removes only those listeners when they remain after OIS/PITS systemd stop. |

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
| Public staging runtime restart | `bash ops/abacus/restart-public-staging-runtime.sh` | Core API restart, UI orphan port cleanup, OIS/PITS systemd start, local route checks and public endpoint checks pass. |
| Public staging runtime status | `bash ops/abacus/status-public-staging-runtime.sh` | Core API, OIS Console, PITS Shell, token-safe cloudflared status and expanded route checks pass. |
| Public endpoint smoke | `bash ops/abacus/check-public-staging-endpoints.sh` | Core API, OIS and PITS public marker/count checks pass across the Stage 1A routes. |

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS. |
| `pnpm lint` | PASS. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS. |
| `pnpm -r --if-present build` | PASS. |
| `ops/abacus/verify-ui-route-manifests.sh` | PASS. |
| `git status -sb` | PASS; Stage 1A-R2 hotfix changes pending commit only. |
