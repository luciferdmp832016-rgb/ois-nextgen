# Stage 0R-F Ops Restart Grace Window

Stage 0R-F result: `OPS_RESTART_GRACE_WINDOW_ADDED`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0r-f-ops-restart-grace-window` |
| Base integration commit | `ebee1f1516810a982fe6d9b2da44f59c094cb644` |
| Prior stage | Stage 0R-E `ABACUS_SSH_RELAY_BLOCKED_WEB_TERMINAL_FALLBACK_READY` |
| Objective | Improve Abacus ops scripts so restart verification allows a warm-up grace window before declaring endpoint failures. |
| Local task type | Ops script, documentation and status update. No Abacus runtime execution from this workspace. |

Stage 0R-F did not deploy, start Abacus runtime from this workspace, run migrations, run seed, call `prisma db push`, call write endpoints, call `/auth/demo-login`, print secrets, touch production/legacy resources or change published endpoints.

## Owner-Run Evidence

The owner ran `runtime-sync` and `status` through the Abacus Web Terminal after Stage 0R-E made Web Terminal the fallback operation path.

Initial restart verification reported four failures:

| Check | Initial result |
|---|---|
| Local `/health` | Connection failed. |
| Public `/health` | HTTP 502. |
| Local `/platform/overview` | Connection failed. |
| Public `/platform/overview` | HTTP 502. |

Immediately after the failure, process inspection showed the service was running:

```text
pnpm start -> tsx src/server.ts -> node
```

A later rerun of `ops/abacus/status.sh` passed:

| Check | Later result |
|---|---|
| Core API systemd state | Active/running. |
| `/health` | OK. |
| `/platform/overview` | OK. |
| Seeded counts | Unchanged. |
| `PLATFORM_KERNEL` | `IN_PROGRESS`. |

## Conclusion

The initial failures were false negatives caused by checking endpoints too quickly after `systemctl restart`. systemd can report the service as active before the Node/Fastify process has fully bound port `4000`. During that short warm-up interval, local connection failures and public HTTP 502 responses are expected transient states.

Restart verification should only fail after a bounded retry timeout.

## Script Changes

| File | Change |
|---|---|
| `ops/abacus/lib-core-api-checks.sh` | Added shared Core API health/overview HTTP validation and restart readiness retry helpers. |
| `ops/abacus/safe-restart-core-api.sh` | Uses the shared helper to wait up to 30 seconds, retrying every 2 seconds, before reporting restart verification failure. |
| `ops/abacus/runtime-sync.sh` | Prints that restart verification now uses the grace window before delegating to `safe-restart-core-api.sh`. |
| `ops/abacus/status.sh` | Reuses the shared payload validators for read-only point-in-time status checks without adding wait behavior. |
| `ops/abacus/README.md` | Documents the grace window, labels, order and optional tuning variables. |
| `docs/deployment/ABACUS_SSH_OPERATIONS.md` | Documents why transient HTTP 502 after restart is expected and when failure should be reported. |

## Restart Verification Contract

Defaults:

| Setting | Default | Purpose |
|---|---:|---|
| `RESTART_VERIFY_TIMEOUT` | `30` seconds | Maximum time to wait before reporting restart verification failure. |
| `RESTART_VERIFY_INTERVAL` | `2` seconds | Retry interval during warm-up. |

Verification order:

1. Wait for local `/health` to return HTTP 200.
2. Check public `/health`.
3. Check local `/platform/overview`.
4. Check public `/platform/overview`.

Required output labels:

| Label | Meaning |
|---|---|
| `WARMING_UP` | A check failed during the retry window, such as connection refused or HTTP 502. |
| `LOCAL_HEALTH_READY` | Local `/health` returned HTTP 200 with the expected Core API payload. |
| `PUBLIC_HEALTH_READY` | Public `/health` returned HTTP 200 with the expected Core API payload. |
| `PLATFORM_OVERVIEW_READY` | `/platform/overview` returned HTTP 200 with seeded counts and expected phase gates. |
| `RESTART_VERIFICATION_PASSED` | All restart readiness checks passed. |
| `RESTART_VERIFICATION_TIMEOUT` | A readiness check did not pass before timeout and the restart should be treated as failed. |

Temporary HTTP 502 immediately after restart is treated as warm-up evidence until `RESTART_VERIFICATION_TIMEOUT` expires.

## Safety Rules Preserved

The updated scripts still preserve the Stage 0R-D safety contract:

- Never print `.env`.
- Never print `DATABASE_URL`.
- Never print secrets.
- Never run `prisma db push`.
- Never run migrations.
- Never run seed.
- Never call write endpoints.
- Never call `/auth/demo-login`.
- Never touch `ois_phase1_dev`.
- Never touch `emerald_bql_web_dev`.
- Never touch `ois.dmp247.com` or `oisys.abacusai.app` by default.
- Never touch storage prefixes `49816/` or `52067/`.

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| None. | N/A | N/A | N/A |

### Changed

| Endpoint | Previous status/result | New status/result | Evidence |
|---|---|---|---|
| None. | N/A | N/A | N/A |

### Unchanged

| Endpoint | Status | Expected result |
|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health after warm-up. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts after warm-up. |
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 live App Shell; do not touch. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Existing OIS Phase 1 custom domain; do not touch. |

### Deprecated / stopped

| Endpoint | Status | Reason |
|---|---|---|
| None. | N/A | N/A |

### Do Not Touch

| Endpoint/resource | Status | Reason |
|---|---|---|
| `https://oisys.abacusai.app` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 live App Shell. |
| `https://ois.dmp247.com` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 custom domain. |
| `ois_phase1_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | OIS Phase 1 production-equivalent DB. |
| `emerald_bql_web_dev` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Emerald/BQL legacy DB. |
| Storage prefixes `49816/` and `52067/` | `LEGACY_PRODUCTION_DO_NOT_TOUCH` | Legacy storage boundaries. |

### Current Test Checklist

No live endpoint checks were run from this local stage. Owner-run Abacus checks should use:

| Check | Command | Expected |
|---|---|---|
| Restart Core API with grace window | `bash ops/abacus/safe-restart-core-api.sh` | `RESTART_VERIFICATION_PASSED` after local health, public health and overview checks. |
| Runtime sync with grace window | `bash ops/abacus/runtime-sync.sh` | Validation passes, restart uses warm-up retry loop and endpoints pass after readiness. |
| Read-only status | `bash ops/abacus/status.sh` | Core API active/running, health OK, overview OK, seeded counts unchanged and `PLATFORM_KERNEL=IN_PROGRESS`. |

## Decision

Stage 0R-F is marked `OPS_RESTART_GRACE_WINDOW_ADDED`.

The safe ops scripts now distinguish a genuine restart failure from the expected short warm-up interval after systemd restart. Transient local connection failures or public HTTP 502 responses only fail the operation if they persist beyond the retry timeout.

Recommended next stage: Stage 0R-F1 - Owner Web Terminal retry evidence after the grace window scripts are synced to Abacus, or Stage 0S-A - Platform Kernel Gate Advancement Plan.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS via Git Bash `C:\Program Files\Git\bin\bash.exe`; the plain Windows `bash` shim points to missing WSL on this workstation. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 20 tests. Expected mocked HTTP 500 log line came from deliberate DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; Stage 0R-F ops script/documentation/status changes pending commit. |
