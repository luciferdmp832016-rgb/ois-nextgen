# Stage 0R-D Safe SSH Operations

Stage 0R-D result: `SAFE_SSH_OPERATIONS_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0r-d-safe-ssh-operations` |
| Prior stage | Stage 0R-C `ABACUS_RUNTIME_SYNCED_NO_BEHAVIOR_REGRESSION` |
| Objective | Create reusable safe SSH operation scripts for Abacus SuperComputer checks, runtime sync, Core API restart and guarded rollback. |
| Local task type | Scripts and documentation only. |

Stage 0R-D does not SSH to Abacus, deploy, modify Abacus runtime, run migrations, run seed, call `prisma db push`, touch production/legacy resources, print secrets or probe live endpoints from this local workspace.

## Scripts Added

| Script | Purpose | Default safety |
|---|---|---|
| `ops/abacus/status.sh` | Shows repo branch/commit/status, Core API systemd status, local/public `/health`, local/public `/platform/overview` and seeded counts. | Read-only. |
| `ops/abacus/check-live-endpoints.sh` | Checks current active OIS NextGen public staging endpoints. | Read-only; does not probe legacy endpoints by default. |
| `ops/abacus/check-live-endpoints.sh --include-legacy-readonly` | Optional owner-approved readonly status probes for `https://oisys.abacusai.app` and `https://ois.dmp247.com`. | Labels legacy endpoints `LEGACY_DO_NOT_TOUCH`; no mutation. |
| `ops/abacus/safe-restart-core-api.sh` | Restarts `ois-nextgen-core-api`, then verifies local/public `/health` and `/platform/overview`. | Service restart only; no nginx/systemd unit edits. |
| `ops/abacus/runtime-sync.sh` | Fetches/pulls `stage-0b-complete-handoff-ingestion`, runs install/lint/typecheck/test/build, restarts Core API and verifies health/overview. | Source sync and service restart only; stops if Prisma schema, migration or seed files changed. |
| `ops/abacus/rollback-core-api-nginx-poc.sh` | Prints Stage 0O rollback plan by default. | No-op without `--confirm-rollback`. |
| `ops/abacus/rollback-core-api-nginx-poc.sh --confirm-rollback` | Stops/disables Core API systemd service, removes Stage 0O systemd unit and nginx vhost, validates and reloads nginx. | Destructive rollback only after explicit confirmation. |

## Documentation Added

| File | Purpose |
|---|---|
| `ops/abacus/README.md` | Script catalog, examples and security rules for running from the Abacus VM repo root. |
| `docs/deployment/ABACUS_SSH_OPERATIONS.md` | Owner-facing SSH setup, Windows PowerShell examples, macOS/Linux examples, safe script usage and dangerous command warnings. |
| `.gitattributes` | Keeps `ops/abacus/*.sh` checked out with LF line endings for Linux/Abacus execution. |

## Safety Rules Locked Into Scripts

The scripts are designed around these constraints:

- Never print `.env`.
- Never print `DATABASE_URL`.
- Never print secrets.
- Never run `prisma db push`.
- Never run `prisma migrate dev`.
- Never run migrations or seed in default scripts.
- Never call write endpoints.
- Never call `/auth/demo-login`.
- Never touch `ois_phase1_dev`.
- Never touch `emerald_bql_web_dev`.
- Never touch `ois.dmp247.com` or `oisys.abacusai.app` by default.
- Never touch storage prefixes `49816/` or `52067/`.
- Legacy endpoint probes require the explicit `--include-legacy-readonly` flag.
- Rollback requires the explicit `--confirm-rollback` flag.

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

Stage 0R-D did not execute endpoint checks locally.

## Decision

Stage 0R-D is marked `SAFE_SSH_OPERATIONS_READY`.

The owner can use SSH one-liners to run safe status checks, endpoint checks, Core API restarts and runtime syncs without Abacus Agent prompts. The rollback path is documented but gated by `--confirm-rollback`.

Recommended next stage: Stage 0S-A - Platform Kernel Gate Advancement Plan, unless the owner first wants Stage 0R-D1 to test these scripts manually over SSH and record owner-run evidence.

## Validation

| Command | Result |
|---|---|
| `shellcheck ops/abacus/*.sh` or `bash -n ops/abacus/*.sh` | PASS via Git Bash `bash -n`; ShellCheck was not available locally. |
| `chmod +x ops/abacus/*.sh` | PASS. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 20 tests. Expected mocked HTTP 500 log line came from deliberate DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; Stage 0R-D scripts/documentation/status changes pending commit. |
