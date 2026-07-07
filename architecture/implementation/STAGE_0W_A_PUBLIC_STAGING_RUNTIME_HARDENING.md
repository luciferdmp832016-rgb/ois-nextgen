# Stage 0W-A Public Staging Runtime Hardening

Stage 0W-A result: `PUBLIC_STAGING_RUNTIME_HARDENING_READY`.

## Objective

Create safe, repeatable Abacus SuperComputer operations scripts and documentation to promote OIS Console and PITS Shell public staging runtimes from temporary `nohup` demo processes into durable systemd services.

Stage 0W-A is a Codex documentation and safe-ops commit only. It does not deploy from Codex, modify Cloudflare dashboard, modify DNS, run migrations, run seed, run `prisma db push`, commit credentials, touch legacy domains or mutate the Abacus runtime from this workspace.

## Baseline

Stage 0V-B/C verified:

| Endpoint | Result |
|---|---|
| `https://ois-ng.dmp247.com` | Opens OIS Console. |
| `https://ois-ng.dmp247.com/dashboard` | Opens OIS Platform Overview. |
| `https://pits-ng.dmp247.com` | Opens PITS Shell. |
| `https://pits-ng.dmp247.com/projects` | Opens PITS Project Selector. |
| Cloudflare Tunnel `ois-nextgen-abacus` | Healthy, 1 active replica, 2 routes. |
| Shared Core API | `https://ois-nextgen.abacusai.cloud`. |
| UI DB boundary | UI shells do not use `DATABASE_URL`; DB-backed data is accessed only through Core API. |

## Scripts Added

| Script | Purpose | Runtime mutation when owner runs it |
|---|---|---|
| `ops/abacus/install-ui-shell-systemd-services.sh` | Builds OIS/PITS UI shells, writes systemd units and enables/starts durable services. | Yes, OIS/PITS systemd unit write/reload/start only. |
| `ops/abacus/uninstall-ui-shell-systemd-services.sh` | Removes only the Stage 0W-A OIS/PITS systemd units after `--confirm`. | Yes, OIS/PITS systemd stop/disable/remove only. |
| `ops/abacus/restart-public-staging-runtime.sh` | Restarts Core API, OIS Console and PITS Shell, then verifies local/public endpoints. | Yes, service restart only; cloudflared only with `--include-cloudflared`. |
| `ops/abacus/status-public-staging-runtime.sh` | Read-only status for Core API, OIS, PITS, cloudflared and local/public endpoints. | No. |
| `ops/abacus/check-public-staging-endpoints.sh` | Read-only public endpoint marker/count checks. | No. |
| `ops/abacus/lib-public-staging-runtime.sh` | Shared constants and helper checks for public staging runtime scripts. | No direct use; sourced by scripts. |

`ops/abacus/runtime-sync.sh` now supports `PUBLIC_STAGING_RESTART_SCOPE=all` for a later owner-run sync that restarts Core API, OIS Console and PITS Shell after validation. Default remains `PUBLIC_STAGING_RESTART_SCOPE=core`. `cloudflared` is not restarted unless `RESTART_CLOUDFLARED=true` is also explicitly set.

## Systemd Service Contract

| Service | Working directory | Port | Start command |
|---|---|---:|---|
| `ois-nextgen-ois-console` | `/home/ubuntu/ois-nextgen/apps/ois-console` | 3000 | `pnpm start` |
| `ois-nextgen-pits-shell` | `/home/ubuntu/ois-nextgen/apps/pits-shell` | 3001 | `pnpm start` |

Shared UI service environment:

| Variable | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `PORT` | `3000` for OIS Console, `3001` for PITS Shell |

The UI systemd services do not set `DATABASE_URL` or `ABACUS_DATABASE_URL`.

The installer does not modify:

- `ois-nextgen-core-api` service unit.
- `cloudflared` service unit or token.
- nginx configuration.
- Cloudflare dashboard.
- DNS records.
- DB schema or seed data.

## Owner-Run Install Sequence

From Abacus Web Terminal after pulling a branch containing Stage 0W-A:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/install-ui-shell-systemd-services.sh
bash ops/abacus/status-public-staging-runtime.sh
bash ops/abacus/check-public-staging-endpoints.sh
```

If temporary `nohup` demo shells are still running on ports 3000/3001, stop them first:

```sh
bash ops/abacus/stop-ui-demo-shells.sh
```

## Restart And Sync

Restart public staging app runtime without restarting cloudflared:

```sh
bash ops/abacus/restart-public-staging-runtime.sh
```

Restart cloudflared only with explicit owner intent:

```sh
bash ops/abacus/restart-public-staging-runtime.sh --include-cloudflared
```

Runtime sync options:

```sh
PUBLIC_STAGING_RESTART_SCOPE=core bash ops/abacus/runtime-sync.sh
PUBLIC_STAGING_RESTART_SCOPE=all bash ops/abacus/runtime-sync.sh
PUBLIC_STAGING_RESTART_SCOPE=all RESTART_CLOUDFLARED=true bash ops/abacus/runtime-sync.sh
```

## Verification Coverage

`status-public-staging-runtime.sh` verifies:

- `systemctl status ois-nextgen-core-api`.
- `systemctl status ois-nextgen-ois-console`.
- `systemctl status ois-nextgen-pits-shell`.
- `systemctl status cloudflared`.
- Local `http://127.0.0.1:4000/health`.
- Local `http://127.0.0.1:3000`.
- Local `http://127.0.0.1:3001`.
- Public `https://ois-nextgen.abacusai.cloud/health`.
- Public `https://ois-nextgen.abacusai.cloud/platform/overview`.
- Public `https://ois-ng.dmp247.com`.
- Public `https://ois-ng.dmp247.com/dashboard`.
- Public `https://pits-ng.dmp247.com`.
- Public `https://pits-ng.dmp247.com/projects`.

`check-public-staging-endpoints.sh` verifies:

- OIS root contains `OIS_CONSOLE`.
- PITS root contains `PITS_SHELL`.
- OIS dashboard returns HTTP 200 with expected route markers.
- PITS projects returns HTTP 200 with expected route markers.
- Core API URL `https://ois-nextgen.abacusai.cloud` is visible where expected.
- Seeded counts are visible where expected.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0W-A does not add endpoints. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0W-A keeps existing public endpoints unchanged. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console public staging root. |
| `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Platform Overview. |
| `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Shell public staging root. |
| `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Project Selector. |
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint | Status | Reason |
|---|---|---|
| Temporary `nohup` UI demo process model | `DEPRECATED` | Stage 0W-A provides durable systemd services for continued public staging operation. |

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
| Public staging runtime status | `bash ops/abacus/status-public-staging-runtime.sh` | All systemd and endpoint checks pass. |
| Public endpoint smoke | `bash ops/abacus/check-public-staging-endpoints.sh` | Core API, OIS and PITS public checks pass. |

## Safety Statement

- No deploy from Codex.
- No Cloudflare dashboard or DNS modification.
- No migrations.
- No seed.
- No `prisma db push`.
- No credentials committed.
- No Cloudflare token printed or committed.
- No `DATABASE_URL` in UI services.
- No Core API service unit modification.
- No `cloudflared` token or credential modification.
- No `ois.dmp247.com` modification.
- No `oisys.abacusai.app` modification.
- No legacy DB/storage/resource touch.

## Decision

Stage 0W-A is marked `PUBLIC_STAGING_RUNTIME_HARDENING_READY`.

Recommended next stage: Stage 0W-B - Owner-Executed Systemd UI Shell Install Evidence.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS. |
| `pnpm lint` | PASS. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS. |
| `pnpm -r --if-present build` | PASS. |
| `git status -sb` | PASS; Stage 0W-A safe ops/docs changes pending commit only. |
