# Abacus SSH Operations

Stage 0R-D result: `SAFE_SSH_OPERATIONS_READY`.

Stage 0R-E result: `ABACUS_SSH_RELAY_BLOCKED_WEB_TERMINAL_FALLBACK_READY`.

Stage 0R-F result: `OPS_RESTART_GRACE_WINDOW_ADDED`.

Stage 0R-G result: `OPS_SCRIPT_UNBOUND_VARIABLE_FIX_READY`.

These scripts let the owner run common OIS NextGen Abacus SuperComputer checks, syncs and restarts through SSH when the relay works, or through Abacus Web Terminal while the relay is blocked, without spending Abacus Agent credits.

The scripts still run on Abacus VM resources. They do not replace owner approval for migrations, seed operations, deployments, production access or destructive rollback.

## Stage 0R-E SSH Relay Diagnostic

Direct external SSH is currently blocked by the Abacus platform edge/relay path.

Owner attempted:

```powershell
ssh ubuntu@ois-nextgen.ssh4.abacusai.cloud -p 22469
```

External SSH failed from both Wi-Fi and 5G. `Test-NetConnection` returned `TcpTestSucceeded False`, and `ssh -vvv` timed out before authentication.

Abacus internal diagnostics confirmed that `sshd` is active and healthy inside the VM, listens on `0.0.0.0:22` and `[::]:22`, and has a valid `authorized_keys` file containing one ED25519 key:

```text
SHA256:majzUhvYdiEw8IRkimxA5RXJXgiHF6bmi5CP1pey+5A ois-nextgen-abacus
```

The local VM SSH TCP path works. No in-VM tunnel agent exists, and VM metadata exposes HTTP ingress only, not SSH relay information. The external SSH endpoint is platform-managed by Abacus edge/relay.

Conclusion: the SSH failure is a platform-side Abacus edge/relay routing issue, not a local key or in-VM `sshd` issue.

Until Abacus fixes the relay, use Abacus Web Terminal plus the same `ops/abacus/*.sh` scripts.

## Stage 0R-F Restart Grace Window

Owner-run Web Terminal evidence showed an initial false negative immediately after restart: local `/health` and local `/platform/overview` could not connect, while public `/health` and `/platform/overview` returned HTTP 502. Process inspection immediately after showed the Core API process was running, and a later `ops/abacus/status.sh` run passed with health OK, overview OK, seeded counts unchanged and `PLATFORM_KERNEL=IN_PROGRESS`.

Conclusion: systemd can report the service as active before the Node/Fastify process has fully bound port `4000`. During that short warm-up period, a temporary local connection failure or public HTTP 502 is expected and must not be treated as a final restart failure.

`ops/abacus/safe-restart-core-api.sh` and `ops/abacus/runtime-sync.sh` now use a restart verification grace window:

| Setting | Default | Purpose |
|---|---:|---|
| `RESTART_VERIFY_TIMEOUT` | `30` seconds | Maximum time to wait before reporting failure. |
| `RESTART_VERIFY_INTERVAL` | `2` seconds | Retry interval during warm-up. |

Verification order:

1. Wait for local `/health` to return HTTP 200.
2. Check public `/health`.
3. Check local `/platform/overview`.
4. Check public `/platform/overview`.

Expected output labels:

- `WARMING_UP`
- `LOCAL_HEALTH_READY`
- `PUBLIC_HEALTH_READY`
- `PLATFORM_OVERVIEW_READY`
- `RESTART_VERIFICATION_PASSED`
- `RESTART_VERIFICATION_TIMEOUT`

Failure should only be reported after `RESTART_VERIFICATION_TIMEOUT`. Temporary HTTP 502 responses immediately after restart are warm-up evidence until the timeout expires.

## Stage 0R-G Unbound Variable Fix

After Stage 0R-F was merged and pulled into the Abacus VM, `ops/abacus/status.sh` crashed with:

```text
/home/ubuntu/ois-nextgen/ops/abacus/lib-core-api-checks.sh: line 110: body: unbound variable
```

The systemd service was still active/running, so this was an ops shell helper bug, not evidence that Core API runtime was broken.

Stage 0R-G fixes `lib-core-api-checks.sh` so response body/code variables are initialized safely and helper internals do not shadow caller variables under `set -u`. Empty-body, HTTP 502, timeout and curl-error cases now report clean check failures instead of crashing.

No-network helper self-test:

```sh
bash ops/abacus/self-test-core-api-checks.sh
```

This self-test stubs `curl`; it does not call live endpoints or print secrets.

## Setup Once

1. Generate an SSH key on your local machine.

Windows PowerShell:

```powershell
ssh-keygen -t ed25519 -f "$env:USERPROFILE\.ssh\ois_nextgen_abacus" -C "ois-nextgen-abacus"
```

macOS/Linux:

```sh
ssh-keygen -t ed25519 -f ~/.ssh/ois_nextgen_abacus -C "ois-nextgen-abacus"
```

2. Add the public key to the Abacus SSH tile.

Windows PowerShell:

```powershell
Get-Content "$env:USERPROFILE\.ssh\ois_nextgen_abacus.pub"
```

macOS/Linux:

```sh
cat ~/.ssh/ois_nextgen_abacus.pub
```

3. Copy the current SSH host and port from the Abacus SSH tile.

The Abacus SSH port may change after restart or platform maintenance. Always copy the latest port from the SSH tile before connecting.

4. Test the SSH connection.

Windows PowerShell:

```powershell
ssh -i "$env:USERPROFILE\.ssh\ois_nextgen_abacus" -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "pwd"
```

macOS/Linux:

```sh
ssh -i ~/.ssh/ois_nextgen_abacus -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "pwd"
```

If SSH times out before authentication and `Test-NetConnection` reports `TcpTestSucceeded False`, stop treating the failure as a key problem. Use the Web Terminal fallback below and escalate the Abacus relay issue with the support text in this document.

## Web Terminal Fallback

Open the Abacus Web Terminal for the OIS NextGen SuperComputer and run safe scripts from the VM repo root:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/status.sh
bash ops/abacus/check-live-endpoints.sh
bash ops/abacus/safe-restart-core-api.sh
bash ops/abacus/runtime-sync.sh
```

Print the rollback plan only:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/rollback-core-api-nginx-poc.sh
```

Execute rollback only after owner approval:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback
```

The Web Terminal fallback still runs on Abacus VM resources. Do not use it to print `.env`, print secrets, run migrations, run seed, call `prisma db push`, call write endpoints, probe legacy resources by default or run destructive rollback without explicit owner approval.

## Run Safe Operations

Status check from Windows PowerShell:

```powershell
ssh -i "$env:USERPROFILE\.ssh\ois_nextgen_abacus" -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "cd /home/ubuntu/ois-nextgen && bash ops/abacus/status.sh"
```

Status check from macOS/Linux:

```sh
ssh -i ~/.ssh/ois_nextgen_abacus -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "cd /home/ubuntu/ois-nextgen && bash ops/abacus/status.sh"
```

Check active public staging endpoints:

```sh
ssh -i ~/.ssh/ois_nextgen_abacus -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "cd /home/ubuntu/ois-nextgen && bash ops/abacus/check-live-endpoints.sh"
```

Restart Core API safely:

```sh
ssh -i ~/.ssh/ois_nextgen_abacus -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "cd /home/ubuntu/ois-nextgen && bash ops/abacus/safe-restart-core-api.sh"
```

Sync runtime to the integration branch after a safe merge:

```sh
ssh -i ~/.ssh/ois_nextgen_abacus -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "cd /home/ubuntu/ois-nextgen && bash ops/abacus/runtime-sync.sh"
```

Print rollback plan only:

```sh
ssh -i ~/.ssh/ois_nextgen_abacus -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "cd /home/ubuntu/ois-nextgen && bash ops/abacus/rollback-core-api-nginx-poc.sh"
```

Execute rollback only after owner approval:

```sh
ssh -i ~/.ssh/ois_nextgen_abacus -p <PORT> ubuntu@ois-nextgen.ssh4.abacusai.cloud "cd /home/ubuntu/ois-nextgen && bash ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback"
```

Use these SSH forms only after the Abacus SSH relay is confirmed working again. While the Stage 0R-E relay blocker remains active, prefer the Web Terminal fallback commands above.

## Script Catalog

| Script | Purpose | Safety |
|---|---|---|
| `ops/abacus/status.sh` | Shows repo branch/commit/status, Core API service status and local/public health/overview seeded counts. | Read-only. |
| `ops/abacus/check-live-endpoints.sh` | Checks `https://ois-nextgen.abacusai.cloud/health` and `/platform/overview`. | Read-only. Does not probe legacy endpoints by default. |
| `ops/abacus/check-live-endpoints.sh --include-legacy-readonly` | Also checks readonly HTTP status for `https://oisys.abacusai.app` and `https://ois.dmp247.com`. | Optional owner-approved legacy status probe only; labels them `LEGACY_DO_NOT_TOUCH`. |
| `ops/abacus/safe-restart-core-api.sh` | Restarts `ois-nextgen-core-api`, waits up to 30 seconds for readiness and verifies local/public health and overview. | Service restart only; no nginx/systemd unit edits. |
| `ops/abacus/runtime-sync.sh` | Fetches/pulls `stage-0b-complete-handoff-ingestion`, runs install/lint/typecheck/test/build, restarts Core API and verifies health/overview with the restart grace window. | Source sync and service restart only. Stops if Prisma schema, migration or seed files changed. |
| `ops/abacus/lib-core-api-checks.sh` | Shared helper for health/overview payload validation and restart readiness retry logic. | Sourced helper; no direct operations. |
| `ops/abacus/self-test-core-api-checks.sh` | No-network self-test for helper parsing and `set -u` safety. | Local parser test only; no live endpoints. |
| `ops/abacus/rollback-core-api-nginx-poc.sh` | Prints the Stage 0O rollback plan. | No-op without `--confirm-rollback`. |
| `ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback` | Stops/disables Core API service, removes Stage 0O systemd unit and nginx vhost, validates and reloads nginx. | Destructive; owner approval required. |

## Never Run Manually

Do not run these commands during normal OIS NextGen staging operations:

```sh
cat .env
printenv
env
set -x
prisma db push
prisma migrate dev
pnpm db:seed
sudo rm -rf
```

Also do not manually print `DATABASE_URL`, Abacus database URLs, storage keys, OpenRouter keys, JWT secrets or session secrets.

## Support Escalation Text

```text
OIS NextGen SuperComputer SSH relay appears blocked at the Abacus edge/relay layer.

External endpoint attempted:
ssh ubuntu@ois-nextgen.ssh4.abacusai.cloud -p 22469

Owner generated an ED25519 key and added it to the Abacus SSH tile. External SSH failed from both Wi-Fi and 5G. Windows Test-NetConnection returned TcpTestSucceeded False, and ssh -vvv timed out before authentication.

Internal VM diagnostics show sshd is active and healthy, listening on 0.0.0.0:22 and [::]:22. authorized_keys exists with correct permissions and includes one ED25519 key fingerprint:
SHA256:majzUhvYdiEw8IRkimxA5RXJXgiHF6bmi5CP1pey+5A ois-nextgen-abacus

The local VM SSH TCP path works. No in-VM tunnel agent was found, and VM metadata exposes HTTP ingress only, not SSH relay details. Please inspect or refresh the platform-managed SSH edge/relay route for this SuperComputer.
```

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
| `https://ois-nextgen.abacusai.cloud/health` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 Core API health. |
| `https://ois-nextgen.abacusai.cloud/platform/overview` | `ABACUS_MANAGED_PUBLIC_STAGING` | HTTP 200 DB-backed read-only platform overview with seeded counts. |
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

| Check | Command | Expected |
|---|---|---|
| Core API staging health | `curl -i https://ois-nextgen.abacusai.cloud/health` | HTTP 200 and Core API health payload. |
| Seeded DB-backed platform overview | `curl -i https://ois-nextgen.abacusai.cloud/platform/overview` | HTTP 200, demo-data banner, seeded Platform Kernel counts and `phaseGates.PLATFORM_KERNEL=IN_PROGRESS`. |
