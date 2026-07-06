# Stage 0R-G Ops Script Unbound Variable Fix

Stage 0R-G result: `OPS_SCRIPT_UNBOUND_VARIABLE_FIX_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0r-g-ops-script-unbound-variable-fix` |
| Base integration commit | `124741498e1557e660aa1f960f9f5c8e1c3e55c9` |
| Prior stage | Stage 0R-F `OPS_RESTART_GRACE_WINDOW_ADDED` |
| Objective | Fix Abacus ops shell scripts so helper response parsing cannot crash with unbound variables under `set -u`. |
| Local task type | Ops script, self-test, documentation and status update. No Abacus runtime execution from this workspace. |

Stage 0R-G did not deploy, modify Abacus runtime, run migrations, run seed, call `prisma db push`, print `.env`, print `DATABASE_URL`, print secrets, call write endpoints, call `/auth/demo-login`, touch production/legacy resources or change published endpoints.

## Owner-Run Evidence

After Stage 0R-F was merged and pulled into the Abacus VM, the owner ran:

```sh
cd /home/ubuntu/ois-nextgen && git fetch origin && git checkout stage-0b-complete-handoff-ingestion && git pull --ff-only && bash ops/abacus/status.sh
```

The pull succeeded and the VM reached integration commit:

```text
124741498e1557e660aa1f960f9f5c8e1c3e55c9
```

The systemd service `ois-nextgen-core-api` was active/running, but `status.sh` crashed with:

```text
/home/ubuntu/ois-nextgen/ops/abacus/lib-core-api-checks.sh: line 110: body: unbound variable
```

This is an ops shell script bug, not evidence that Core API runtime is broken.

## Root Cause

`ops/abacus/lib-core-api-checks.sh` used a helper-local variable named `body` inside `http_get_body`, while callers also passed an output variable named `body`.

Bash uses dynamic scoping for local variables. Under `set -u`, `printf -v body ...` inside the helper wrote to the helper-local `body` variable instead of the caller-local `body` variable. The helper returned successfully, but the caller's `body` remained unset and later crashed when referenced.

The same risk applied to empty response bodies, HTTP 502 responses and curl timeout/no-body cases unless response variables were initialized before use.

## Fix

| File | Change |
|---|---|
| `ops/abacus/lib-core-api-checks.sh` | Renamed helper internals to avoid caller output-variable shadowing, initialized response body/code/error variables, preserved curl error details before cleanup and made missing/empty body cases safe under `set -u`. |
| `ops/abacus/self-test-core-api-checks.sh` | Added no-network self-test that stubs `curl` and verifies helper parsing for HTTP 200, empty-body HTTP 502, curl timeout and overview payload cases. |
| `ops/abacus/README.md` | Documents the self-test and the no-unbound-variable coverage. |
| `docs/deployment/ABACUS_SSH_OPERATIONS.md` | Documents the Stage 0R-G bug, runtime interpretation and self-test command. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Records the Stage 0R-G result in the staging runbook. |

Preserved output labels:

- `WARMING_UP`
- `LOCAL_HEALTH_READY`
- `PUBLIC_HEALTH_READY`
- `PLATFORM_OVERVIEW_READY`
- `RESTART_VERIFICATION_PASSED`
- `RESTART_VERIFICATION_TIMEOUT`

## No-Network Self-Test

Run:

```sh
bash ops/abacus/self-test-core-api-checks.sh
```

The self-test stubs `curl` and does not call live endpoints. It verifies:

| Case | Expected behavior |
|---|---|
| Health HTTP 200 with valid body | Passes under `set -u`. |
| Health HTTP 502 with empty body | Clean failure detail includes `HTTP 502`; no crash. |
| Curl timeout | Clean failure detail includes `curl_exit=28`; no crash. |
| Platform overview HTTP 200 with valid body | Passes under `set -u`. |

## Safety Rules Preserved

The updated scripts still preserve the Stage 0R-D/0R-F safety contract:

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
| Helper self-test | `bash ops/abacus/self-test-core-api-checks.sh` | `SELF_TEST_PASS` lines and no live endpoint calls. |
| Read-only status | `bash ops/abacus/status.sh` | No unbound variable crash; Core API active/running, health OK, overview OK, seeded counts unchanged and `PLATFORM_KERNEL=IN_PROGRESS` when runtime is healthy. |
| Restart Core API with grace window | `bash ops/abacus/safe-restart-core-api.sh` | `RESTART_VERIFICATION_PASSED` after local health, public health and overview checks. |
| Runtime sync with grace window | `bash ops/abacus/runtime-sync.sh` | Validation passes, restart uses warm-up retry loop and endpoints pass after readiness. |

## Decision

Stage 0R-G is marked `OPS_SCRIPT_UNBOUND_VARIABLE_FIX_READY`.

The ops helper now handles empty/missing response bodies, HTTP 502 responses and curl timeouts without unbound-variable crashes under `set -u`. Runtime health still needs owner/Web Terminal confirmation after this fix is pulled to Abacus.

Recommended next stage: Stage 0R-G1 - Owner Web Terminal retry evidence, or Stage 0S-A - Platform Kernel Gate Advancement Plan after ops scripts are confirmed on the VM.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS via Git Bash `C:\Program Files\Git\bin\bash.exe`. |
| `bash ops/abacus/self-test-core-api-checks.sh` | PASS; health 200, empty-body 502, curl timeout and overview 200 parsing cases passed under `set -u` without live endpoint calls. |
| ShellCheck | Unavailable locally; `Get-Command shellcheck` returned no installed command. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 20 tests. Expected mocked HTTP 500 log line came from deliberate DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; Stage 0R-G ops script/documentation/status changes pending commit. |
