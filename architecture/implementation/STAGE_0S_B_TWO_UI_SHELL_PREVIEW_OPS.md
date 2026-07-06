# Stage 0S-B Two UI Shell Preview Ops

Stage 0S-B result: `TWO_UI_SHELL_PREVIEW_OPS_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0s-b-two-ui-shell-preview-ops` |
| Base commit | `15c13cec86cedf7fe9c42c85d2d4d8bd8a167149` |
| Prior stage | Stage 0S-A `TWO_UI_SHELL_DEMO_READY_FOR_ABACUS_PREVIEW` |
| Objective | Add safe Abacus operations scripts to build, start, status-check, stop and restart two separate UI demo shells. |
| Local task type | Ops scripts, deployment documentation and status update. No Abacus runtime execution from this workspace. |

Stage 0S-B did not deploy to Abacus, deploy to `dmp247.com`, modify Core API DB/runtime logic, modify nginx, run migrations, run seed, run `prisma db push`, use UI `DATABASE_URL`, print or commit secrets, touch OIS Phase 1, touch Emerald/BQL or probe legacy endpoints.

## Runtime Topology

| Service | Port | Runtime role | Stage 0S-B status |
|---|---:|---|---|
| Core API | 4000 | Existing Abacus-managed public staging API. | Unchanged. |
| OIS Console demo | 3000 | Temporary UI preview shell. | Ops scripts ready; preview execution pending owner/Web Terminal. |
| PITS Shell demo | 3001 | Temporary UI preview shell. | Ops scripts ready; preview execution pending owner/Web Terminal. |

Both UI shells must call the same Core API:

```text
https://ois-nextgen.abacusai.cloud
```

UI shell DB access remains forbidden. The UI shells read seeded default DB data only through Core API `/platform/overview`.

## Scripts Added

| Script | Purpose | Mutation scope |
|---|---|---|
| `ops/abacus/lib-ui-demo-shells.sh` | Shared helper for temporary UI demo process management, preview URL inference and page marker/count validation. | Helper only. |
| `ops/abacus/start-ui-demo-shells.sh` | Builds and starts OIS Console and PITS Shell as temporary `nohup` processes, then verifies local HTTP 200 pages. | Starts UI demo processes only. |
| `ops/abacus/status-ui-demo-shells.sh` | Reports PID status, verifies local pages and verifies preview proxy URLs when `PREVIEW_URL` or `APP_ORIGIN` is available. | Read-only. |
| `ops/abacus/stop-ui-demo-shells.sh` | Stops only the two temporary UI demo processes recorded by PID files. | Stops UI demo processes only. |
| `ops/abacus/restart-ui-demo-shells.sh` | Stop/start/status wrapper for both UI demo shells. | Restarts UI demo processes only. |

The scripts use temporary `nohup` with PID/log files under:

```text
.abacus-ui-demo/
```

This directory is gitignored.

## Safe Environment

The start/build path passes only safe UI env values:

| Key | Value |
|---|---|
| `CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_PUBLIC_CORE_API_URL` | `https://ois-nextgen.abacusai.cloud` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `PORT` | `3000` for OIS Console, `3001` for PITS Shell. |
| `DATABASE_URL` | Explicitly unset. |
| `ABACUS_DATABASE_URL` | Explicitly unset. |

No `.env`, `DATABASE_URL` or secret values are printed.

## Abacus Web Terminal Instructions

Run from the Abacus SuperComputer Web Terminal after the integration branch includes this stage:

```sh
cd /home/ubuntu/ois-nextgen
git fetch origin
git checkout stage-0b-complete-handoff-ingestion
git pull --ff-only origin stage-0b-complete-handoff-ingestion
bash ops/abacus/start-ui-demo-shells.sh
bash ops/abacus/status-ui-demo-shells.sh
```

Stop only the UI demo shells:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/stop-ui-demo-shells.sh
```

Restart and verify both UI demo shells:

```sh
cd /home/ubuntu/ois-nextgen
bash ops/abacus/restart-ui-demo-shells.sh
```

Optional tuning:

```sh
UI_DEMO_READY_TIMEOUT=60 UI_DEMO_READY_INTERVAL=2 bash ops/abacus/start-ui-demo-shells.sh
BUILD_UI_DEMO_SHELLS=false bash ops/abacus/start-ui-demo-shells.sh
```

## Expected Verification

| Check | Expected |
|---|---|
| OIS Console local | `http://127.0.0.1:3000/` returns HTTP 200 and includes `OIS_CONSOLE`. |
| PITS Shell local | `http://127.0.0.1:3001/` returns HTTP 200 and includes `PITS_SHELL`. |
| OIS Console preview | `<preview-base>-3000.../` returns HTTP 200 when `PREVIEW_URL` or `APP_ORIGIN` is available. |
| PITS Shell preview | `<preview-base>-3001.../` returns HTTP 200 when `PREVIEW_URL` or `APP_ORIGIN` is available. |
| Core API data | Each page includes `DEMO DATA - NOT PRODUCTION` and seeded Platform Kernel counts. |

Expected seeded counts:

| Field | Count |
|---|---:|
| `industries` | 1 |
| `organizations` | 1 |
| `workspaces` | 1 |
| `projects` | 2 |
| `products` | 5 |
| `installations` | 2 |
| `modules` | 3 |
| `auditRecords` | 1 |

## Published Endpoint Delta

### Added

| Endpoint | Status | Expected result | Evidence |
|---|---|---|---|
| `https://<abacus-preview-base>-3000.../` | `PLANNED_NOT_CREATED` | OIS Console demo/status page over Abacus preview proxy after owner-run execution. | Stage 0S-B scripts ready; Abacus execution pending. |
| `https://<abacus-preview-base>-3001.../` | `PLANNED_NOT_CREATED` | PITS Shell demo/status page over Abacus preview proxy after owner-run execution. | Stage 0S-B scripts ready; Abacus execution pending. |

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
| Start UI demos | `bash ops/abacus/start-ui-demo-shells.sh` | Builds and starts both shells; local OIS Console/PITS pages return HTTP 200. |
| Status UI demos | `bash ops/abacus/status-ui-demo-shells.sh` | PIDs running, local HTTP 200 checks pass and preview checks pass or are skipped if preview env is unavailable. |
| Stop UI demos | `bash ops/abacus/stop-ui-demo-shells.sh` | Only UI demo processes stop; Core API remains untouched. |
| Restart UI demos | `bash ops/abacus/restart-ui-demo-shells.sh` | Stop/start/status flow passes. |

## Safety Statement

Stage 0S-B preserves these rules:

- Do not deploy to `dmp247.com`.
- Do not touch OIS Phase 1.
- Do not run migrations.
- Do not run seed.
- Do not run `prisma db push`.
- Do not use `DATABASE_URL` in UI shells.
- Do not modify Core API DB/runtime logic.
- Do not modify nginx.
- Do not stop Core API.
- Do not call write endpoints.
- Do not call `/auth/demo-login`.
- Do not print `.env`, `DATABASE_URL` or secrets.

## Decision

Stage 0S-B is marked `TWO_UI_SHELL_PREVIEW_OPS_READY`.

The next recommended stage is Stage 0S-C - Owner-run Abacus UI Preview Evidence.

## Validation

| Command | Result |
|---|---|
| `bash -n ops/abacus/*.sh` | PASS via Git Bash `C:\Program Files\Git\bin\bash.exe`. |
| Preview URL helper dry-run | PASS; `PREVIEW_URL=https://7a162f29d.na116.preview.abacusai.app` inferred `https://7a162f29d-3000.na116.preview.abacusai.app` and `https://7a162f29d-3001.na116.preview.abacusai.app`. |
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 20 tests. Expected mocked HTTP 500 log line came from deliberate DB-error-path test. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next builds completed. |
| `git status -sb` | PASS; Stage 0S-B ops/documentation/status changes pending commit. |
