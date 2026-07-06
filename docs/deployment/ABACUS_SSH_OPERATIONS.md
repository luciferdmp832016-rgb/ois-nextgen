# Abacus SSH Operations

Stage 0R-D result: `SAFE_SSH_OPERATIONS_READY`.

These scripts let the owner run common OIS NextGen Abacus SuperComputer checks, syncs and restarts through SSH without spending Abacus Agent credits.

The scripts still run on Abacus VM resources. They do not replace owner approval for migrations, seed operations, deployments, production access or destructive rollback.

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

## Script Catalog

| Script | Purpose | Safety |
|---|---|---|
| `ops/abacus/status.sh` | Shows repo branch/commit/status, Core API service status and local/public health/overview seeded counts. | Read-only. |
| `ops/abacus/check-live-endpoints.sh` | Checks `https://ois-nextgen.abacusai.cloud/health` and `/platform/overview`. | Read-only. Does not probe legacy endpoints by default. |
| `ops/abacus/check-live-endpoints.sh --include-legacy-readonly` | Also checks readonly HTTP status for `https://oisys.abacusai.app` and `https://ois.dmp247.com`. | Optional owner-approved legacy status probe only; labels them `LEGACY_DO_NOT_TOUCH`. |
| `ops/abacus/safe-restart-core-api.sh` | Restarts `ois-nextgen-core-api` and verifies local/public health and overview. | Service restart only; no nginx/systemd unit edits. |
| `ops/abacus/runtime-sync.sh` | Fetches/pulls `stage-0b-complete-handoff-ingestion`, runs install/lint/typecheck/test/build, restarts Core API and verifies health/overview. | Source sync and service restart only. Stops if Prisma schema, migration or seed files changed. |
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
