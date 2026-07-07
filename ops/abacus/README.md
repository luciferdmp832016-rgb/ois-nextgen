# Abacus Safe SSH Operations

Reusable scripts for OIS NextGen Abacus SuperComputer operations.

Run these from the repository root on the Abacus VM:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/status.sh
```

## Scripts

| Script | Default behavior | Mutates runtime? |
|---|---|---|
| `status.sh` | Shows repo branch/commit/status, Core API systemd status, local/public health, local/public platform overview and seeded counts. | No. Read-only. |
| `check-live-endpoints.sh` | Checks active OIS NextGen public staging endpoints only. Legacy probes require `--include-legacy-readonly`. | No. Read-only. |
| `safe-restart-core-api.sh` | Restarts `ois-nextgen-core-api`, waits for local `/health`, then verifies public `/health` and local/public `/platform/overview`. | Yes, service restart only. |
| `runtime-sync.sh` | Fetches/pulls the integration branch, runs install/lint/typecheck/test/build, then restarts Core API through `safe-restart-core-api.sh` with the restart grace window. | Yes, source sync and service restart only. |
| `start-ui-demo-shells.sh` | Builds and starts OIS Console on port 3000 and PITS Shell on port 3001 as temporary `nohup` demo processes. | Yes, temporary UI demo processes only. |
| `status-ui-demo-shells.sh` | Checks temporary OIS Console/PITS demo PIDs, local HTTP 200 pages, expected shell markers and seeded Core API data; checks preview URLs when `PREVIEW_URL` or `APP_ORIGIN` is available. | No. Read-only. |
| `stop-ui-demo-shells.sh` | Stops only the temporary OIS Console and PITS Shell demo processes recorded by PID files. | Yes, stops UI demo processes only. |
| `restart-ui-demo-shells.sh` | Stops, starts and verifies both temporary UI demo shell processes. | Yes, temporary UI demo processes only. |
| `package-pits-shell-upload-bundle.sh` | Creates `artifacts/abacus/pits-shell-abacus-upload-bundle.zip` for direct PITS Shell App Shell source upload. | No. Local packaging only. |
| `rollback-core-api-nginx-poc.sh` | Prints the Stage 0O rollback plan by default. Requires `--confirm-rollback` to stop/disable service and remove nginx/systemd POC files. | Yes, destructive only with explicit confirmation. |
| `lib-core-api-checks.sh` | Shared helper for health/overview validation and restart readiness retry logic. | No direct use; sourced by scripts. |
| `lib-ui-demo-shells.sh` | Shared helper for temporary UI demo shell start/stop/status, preview URL inference and page marker/count validation. | No direct use; sourced by scripts. |
| `self-test-core-api-checks.sh` | No-network self-test for `lib-core-api-checks.sh` response parsing under `set -u`. | No. Local parser test only. |

## UI Demo Shells

Stage 0S-B adds temporary preview operations for two separate UI shells:

| Shell | Package | Port | Required Core API URL |
|---|---|---:|---|
| OIS Console | `@ois/ois-console` | 3000 | `https://ois-nextgen.abacusai.cloud` |
| PITS Shell | `@ois/pits-shell` | 3001 | `https://ois-nextgen.abacusai.cloud` |

The UI demo scripts intentionally use `nohup` plus PID files under `.abacus-ui-demo/` instead of systemd. This is temporary preview/demo operation only and does not modify nginx, the Core API systemd service, DB schema, seed data or legacy resources.

Safe environment passed to both UI shells:

- `CORE_API_URL=https://ois-nextgen.abacusai.cloud`
- `NEXT_PUBLIC_CORE_API_URL=https://ois-nextgen.abacusai.cloud`
- `NEXT_TELEMETRY_DISABLED=1`
- `PORT=3000` for OIS Console
- `PORT=3001` for PITS Shell

The scripts explicitly unset `DATABASE_URL` and `ABACUS_DATABASE_URL` for UI shell build/start commands.

Start and verify both UI demo shells:

```sh
bash ops/abacus/start-ui-demo-shells.sh
```

Check status:

```sh
bash ops/abacus/status-ui-demo-shells.sh
```

Stop only the UI demo shells:

```sh
bash ops/abacus/stop-ui-demo-shells.sh
```

Restart and verify:

```sh
bash ops/abacus/restart-ui-demo-shells.sh
```

Expected local URLs:

- `http://127.0.0.1:3000/` for OIS Console.
- `http://127.0.0.1:3001/` for PITS Shell.

Expected Abacus preview URLs, when `PREVIEW_URL` or `APP_ORIGIN` is available:

- `<preview-base>-3000.../` for OIS Console.
- `<preview-base>-3001.../` for PITS Shell.

The status script verifies HTTP 200, product markers and seeded Platform Kernel counts in each UI page. It does not probe legacy endpoints.

## PITS Shell Upload Bundle

Stage 0T-D-R1 adds a direct source upload bundle path for PITS Shell because Abacus App Shell deployment reported that external GitHub clone is blocked.

Create the bundle from the repo root:

```sh
bash ops/abacus/package-pits-shell-upload-bundle.sh
```

Output:

```text
artifacts/abacus/pits-shell-abacus-upload-bundle.zip
```

The script packages only `apps/pits-shell`, `packages/shared-ui`, root package/lock/workspace metadata and `tsconfig.base.json`. It refuses env files and excludes generated output, `.git`, secrets, runtime files and unrelated apps/domains/Prisma assets. Do not commit the generated ZIP.

## Restart Grace Window

After `systemctl restart`, systemd can report the service as active before `tsx src/server.ts` has bound port `4000`. During that warm-up gap, local requests can fail and public nginx/Cloudflare can briefly return HTTP 502.

`safe-restart-core-api.sh` now waits up to 30 seconds and retries every 2 seconds:

1. Wait for local `/health` to return HTTP 200.
2. Check public `/health`.
3. Check local `/platform/overview`.
4. Check public `/platform/overview`.

Transient connection failures or HTTP 502 responses during this window are printed as warm-up progress, not immediate failure. A restart is failed only after `RESTART_VERIFICATION_TIMEOUT`.

Output labels:

- `WARMING_UP`
- `LOCAL_HEALTH_READY`
- `PUBLIC_HEALTH_READY`
- `PLATFORM_OVERVIEW_READY`
- `RESTART_VERIFICATION_PASSED`
- `RESTART_VERIFICATION_TIMEOUT`

Optional tuning:

```sh
RESTART_VERIFY_TIMEOUT=30 RESTART_VERIFY_INTERVAL=2 bash ops/abacus/safe-restart-core-api.sh
```

## Helper Self-Test

Run this after changing `lib-core-api-checks.sh`:

```sh
bash ops/abacus/self-test-core-api-checks.sh
```

The self-test stubs `curl` and does not call live endpoints. It verifies:

- Health HTTP 200 body parsing.
- Empty-body HTTP 502 clean failure.
- Curl timeout clean failure.
- Platform overview HTTP 200 body parsing.
- No unbound variables under `set -u`.

## Security Rules

- Do not `cat .env`.
- Do not print `DATABASE_URL`.
- Do not print secrets.
- Do not run `printenv`, `env` or `set -x`.
- Do not run `prisma db push`.
- Do not run `prisma migrate dev`.
- Do not run migrations or seed unless a future owner-approved stage explicitly calls for it.
- Do not call write endpoints.
- Do not call `/auth/demo-login`.
- Do not use `DATABASE_URL` in UI shells.
- Do not modify Core API DB/runtime logic from UI demo scripts.
- Do not deploy to `dmp247.com`.
- Do not touch `ois_phase1_dev`, `emerald_bql_web_dev`, `ois.dmp247.com`, `oisys.abacusai.app`, storage prefix `49816/` or storage prefix `52067/`.

## Examples

Read-only status:

```sh
bash ops/abacus/status.sh
```

Read-only active endpoint check:

```sh
bash ops/abacus/check-live-endpoints.sh
```

Optional legacy readonly status probes, only with owner approval:

```sh
bash ops/abacus/check-live-endpoints.sh --include-legacy-readonly
```

Safe Core API restart:

```sh
bash ops/abacus/safe-restart-core-api.sh
```

Runtime sync after a safe integration merge:

```sh
bash ops/abacus/runtime-sync.sh
```

Start temporary UI demo shells:

```sh
bash ops/abacus/start-ui-demo-shells.sh
```

Check temporary UI demo shells:

```sh
bash ops/abacus/status-ui-demo-shells.sh
```

Stop temporary UI demo shells:

```sh
bash ops/abacus/stop-ui-demo-shells.sh
```

Rollback plan only:

```sh
bash ops/abacus/rollback-core-api-nginx-poc.sh
```

Execute rollback after owner approval:

```sh
bash ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback
```
