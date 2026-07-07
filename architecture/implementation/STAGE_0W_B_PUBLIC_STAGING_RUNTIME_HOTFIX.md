# Stage 0W-B Public Staging Runtime Hotfix

Stage 0W-B runtime decision: `PUBLIC_STAGING_RUNTIME_OPERATIONAL`.

Stage 0W-B hotfix decision: `PUBLIC_STAGING_RUNTIME_SECRET_SAFE_HOTFIX_READY`.

## Objective

Hotfix the Stage 0W-A public staging runtime operations after owner runtime verification proved the OIS/PITS public staging services are operational and exposed one logging safety issue.

## Runtime Evidence From Stage 0W-A Execution

Owner/Abacus runtime execution confirmed:

| Check | Result |
|---|---|
| `ois-nextgen-core-api` | Active. |
| `ois-nextgen-ois-console` | Active. |
| `ois-nextgen-pits-shell` | Active. |
| `cloudflared` | Active. |
| `https://ois-ng.dmp247.com` | PASS. |
| `https://ois-ng.dmp247.com/dashboard` | PASS. |
| `https://pits-ng.dmp247.com` | PASS. |
| `https://pits-ng.dmp247.com/projects` | PASS. |
| `ops/abacus/check-public-staging-endpoints.sh` | PASS. |

Stage 0W-A required stopping legacy temporary UI demo processes before restarting the durable OIS/PITS systemd services. After that cleanup, public staging operation passed.

## Issue Found

`ops/abacus/status-public-staging-runtime.sh` used the generic service reporter for `cloudflared`, which printed full `systemctl status cloudflared` output. On Abacus, that output can include the tunnel token in the process command line.

This is a logging safety issue in the ops script, not an endpoint failure and not a runtime behavior regression.

## Hotfixes

### Secret-Safe Cloudflared Status

`status-public-staging-runtime.sh` now uses a dedicated cloudflared status reporter that prints only:

```sh
systemctl is-active cloudflared
systemctl show cloudflared --property=ActiveState,SubState,MainPID,NRestarts --no-pager
```

It does not print:

- `systemctl status cloudflared`.
- `ExecStart`.
- Process command lines.
- Tunnel tokens.
- Environment variables.

The final success label remains:

```text
PUBLIC_STAGING_RUNTIME_STATUS_PASSED
```

### Restart-Time Legacy Demo Cleanup

`restart-public-staging-runtime.sh` now stops legacy temporary UI demo processes before restarting the durable OIS/PITS systemd services by reusing:

```sh
bash ops/abacus/stop-ui-demo-shells.sh
```

The cleanup is scoped to the temporary UI demo PID files and does not stop Core API or cloudflared.

### Safe Port Diagnostics

`restart-public-staging-runtime.sh` now prints safe listener diagnostics for ports `3000` and `3001` before and after OIS/PITS systemd restart.

The diagnostics use listener tables only and avoid process command lines and environment values.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0W-B does not add endpoints. |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| None | N/A | N/A | Stage 0W-B changes ops behavior only. |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Console public staging root remains passing. |
| `https://ois-ng.dmp247.com/dashboard` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | OIS Platform Overview remains passing. |
| `https://pits-ng.dmp247.com` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Shell public staging root remains passing. |
| `https://pits-ng.dmp247.com/projects` | `CLOUDFLARE_TUNNEL_PUBLIC_VERIFIED` | PITS Project Selector remains passing. |
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | Core API health remains current. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | DB-backed read-only Platform Overview remains current. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / Stopped

| Endpoint/process | Status | Reason |
|---|---|---|
| Temporary `nohup` UI demo process model | `DEPRECATED` | Durable OIS/PITS systemd services are the public staging runtime path. |

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
| Public staging runtime status | `bash ops/abacus/status-public-staging-runtime.sh` | Core API, OIS Console, PITS Shell, token-safe cloudflared status and endpoint checks pass. |
| Public endpoint smoke | `bash ops/abacus/check-public-staging-endpoints.sh` | Core API, OIS and PITS public checks pass. |
| Public staging restart | `bash ops/abacus/restart-public-staging-runtime.sh` | Legacy UI demo processes are stopped, Core/OIS/PITS services restart, ports 3000/3001 are diagnosed and endpoint checks pass. |

## Safety Statement

- No Cloudflare token committed.
- No Cloudflare token printed in docs.
- No `systemctl status cloudflared` in the public staging status script.
- No `ExecStart` or process command line for cloudflared printed by the public staging status script.
- No migrations.
- No seed.
- No `prisma db push`.
- No DNS changes.
- No Cloudflare dashboard changes.
- No production credentials.
- No legacy DB/storage/resource touch.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS. |
| `pnpm lint` | PASS. |
| `pnpm typecheck` | PASS. |
| `pnpm test` | PASS. |
| `pnpm -r --if-present build` | PASS. |
| `git status -sb` | PASS; Stage 0W-B hotfix changes pending commit only. |
