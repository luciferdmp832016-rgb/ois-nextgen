# Stage 0G Codex Cloud + GitHub Test Environment Bootstrap

Final verdict: `CODEX_CLOUD_APP_BOOT_VERIFIED`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0g-codex-cloud-github-test-bootstrap` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `0c41044` |
| R4 merge | PR #5 merged `stage-0f-r4-discovery-verification` into integration. |
| R4 commit | `83f4fcf3a40a10ffe2ad14a04f289d844907f337` |
| R4 result | `BLOCKED_STAGING_INPUTS` |
| Stage 0G objective | Prove the app can build and boot in a mock-safe cloud-test posture without Abacus, production resources or real secrets. |
| Abacus deploy | Not executed. |
| Runtime POC | Codex/cloud-test local boot only; no Abacus runtime POC. |
| Migrations | Not executed. |
| Production | Untouched. |

Opening checks:

| Command | Result |
|---|---|
| `git fetch origin --prune` | Updated integration branch to include R4 merge. |
| `git log --oneline --decorate -8 origin/stage-0b-complete-handoff-ingestion` | Shows `0c41044 Merge pull request #5` followed by R4 commit `83f4fcf`. |
| `git switch stage-0b-complete-handoff-ingestion` | PASS. |
| `git merge --ff-only origin/stage-0b-complete-handoff-ingestion` | PASS; local integration fast-forwarded to `0c41044`. |
| `git switch -c stage-0g-codex-cloud-github-test-bootstrap` | PASS. |

## Source Of Truth Reviewed

| File | Use |
|---|---|
| `architecture/implementation/STAGE_0F_R4_DISCOVERY_VERIFICATION.md` | R4 blockers and mock-safe discovery baseline. |
| `architecture/implementation/IMPLEMENTATION_STATUS.md` | Current status register. |
| `architecture/implementation/PHASE_GATE_REGISTER.md` | Current phase gate evidence. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Abacus staging constraints and stop conditions. |
| `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` | Owner checklist and missing staging inputs. |
| `package.json` | Root scripts and validation commands. |
| `.env.example` | Mock-safe env names and placeholders. |
| `prisma/schema.prisma` | Confirms Prisma datasource uses `DATABASE_URL`. |
| App package scripts | Confirms Core API, Console and PITS build/start commands. |
| `apps/core-api/src/app.ts` and `apps/core-api/src/server.ts` | Confirms root/health probes do not query the database and Core API listens on `CORE_API_HOST`/`CORE_API_PORT`. |

## Safe Mock/Test Assumptions

| Area | Stage 0G assumption | Evidence |
|---|---|---|
| AI | Use mock mode only. | `.env.example` defines `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`, and empty `OPENROUTER_API_KEY`. |
| Storage | Use mock mode only. | `.env.example` and deployment docs define `STORAGE_PROVIDER=mock`. |
| Database | Do not run migrations or DB-backed smoke checks. | Prisma requires `DATABASE_URL` for DB-backed runtime paths; root and health checks do not query the DB. |
| Abacus | Do not deploy or mutate Abacus resources. | R4 remains blocked on Abacus staging inputs. |
| Production | Do not use production DB/storage/OpenRouter credentials. | No production values were read, printed, used or committed. |
| GitHub test posture | Existing CI/preflight use disposable PostgreSQL and mock AI/storage. | `.github/workflows/ci.yml` and `release-preflight.yml` already define mock-safe CI env. |

## Commands

| Purpose | Command | Result |
|---|---|---|
| Lint | `pnpm lint` | PASS; architecture guard passed. |
| Typecheck | `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit` completed successfully. |
| Unit tests | `pnpm test` | PASS; 2 files and 16 tests passed. |
| Build | `pnpm -r --if-present build` | PASS; Core API, OIS Console and PITS Shell builds completed. |
| Root build script | `pnpm build` | Not available; root `package.json` has no `build` script. |

Safe build command for this repo: `pnpm -r --if-present build`.

## Runtime Boot Plan

The controlled boot used split-app start commands after the successful build:

| Service | Start command | Expected port | Probe |
|---|---|---:|---|
| Core API | `pnpm --filter @ois/core-api start` | 4000 | `http://127.0.0.1:4000/health` and `/` |
| OIS Console | `pnpm --filter @ois/ois-console start` | 3000 | `http://127.0.0.1:3000/` |
| PITS Shell | `pnpm --filter @ois/pits-shell start` | 3001 | `http://127.0.0.1:3001/` |

Mock-safe process env used for the boot:

| Variable | Value |
|---|---|
| `APP_ENV` | `codex-cloud-test` |
| `DEPLOY_TARGET` | `codex-cloud-test` |
| `LOCALHOST_REQUIRED` | `false` |
| `AI_PROVIDER` | `mock` |
| `AI_PROVIDER_MODE` | `mock` |
| `OPENROUTER_API_KEY` | empty |
| `STORAGE_PROVIDER` | `mock` |
| `CORE_API_HOST` | `127.0.0.1` |
| `CORE_API_PORT` | `4000` |
| `OIS_CONSOLE_URL` | `http://127.0.0.1:3000` |
| `PITS_SHELL_URL` | `http://127.0.0.1:3001` |
| `CORE_API_URL` | `http://127.0.0.1:4000` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

`DATABASE_URL`, Abacus DB vars and Abacus storage vars were removed from the child process environment for this boot. No DB-backed endpoints were called.

## Boot Evidence

The boot was executed from temporary logs outside the repository:

| Evidence | Result |
|---|---|
| Pre-boot port check | No listeners on ports 3000, 3001 or 4000. |
| Core API log | `Server listening at http://127.0.0.1:4000`. |
| OIS Console log | Next.js started on `http://localhost:3000` and reported ready. |
| PITS Shell log | Next.js started on `http://localhost:3001` and reported ready. |
| Core API health | HTTP 200, `{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}`. |
| Core API root | HTTP 200, `{"service":"ois-nextgen-core-api","status":"ok","version":"0.1.0","health":"/health","docs":"/docs"}`. |
| OIS Console root | HTTP 200, HTML response length 5291. |
| PITS Shell root | HTTP 200, HTML response length 5372. |
| Listener evidence | Ports 3000, 3001 and 4000 were listening during the boot check. |
| Process cleanup | Processes were stopped after evidence capture; post-stop listener check found no listeners on 3000, 3001 or 4000. |

## Blockers And Limits

| Item | Status | Notes |
|---|---|---|
| Abacus staging runtime POC | Still blocked. | Stage 0G did not change the R4 Abacus blocker state. |
| DB-backed runtime paths | Not verified. | No `DATABASE_URL` was supplied and no migrations were run. A future DB-backed cloud test needs an ephemeral/test-safe PostgreSQL service and explicit migration approval for that test environment only. |
| Root `pnpm build` | Not available. | Use `pnpm -r --if-present build`. |
| Dynamic cloud port behavior | Not proven. | Controlled boot used repo-defined ports 4000, 3000 and 3001. |
| GitHub environment bootstrap | Partially already present. | CI/preflight workflows already use mock AI/storage and disposable PostgreSQL; no new GitHub secrets were required. |

## Decision

Build passed and controlled app boot evidence was captured with mock-safe configuration. Stage 0G is therefore `CODEX_CLOUD_APP_BOOT_VERIFIED`.

This does not unblock Abacus staging deployment. Stage 0F remains blocked until the owner checklist and Abacus staging inputs are confirmed.

## Safety Statement

Stage 0G was build and local cloud-test boot verification only.

- No Abacus deployment was executed.
- No Abacus staging or production resource was mutated.
- No migrations were run.
- No `prisma db push` was used.
- No production database was used.
- No production storage was used.
- No production OpenRouter key was used.
- No real secrets or `.env` files were committed.
- No secret values were printed.
- No DB-backed endpoints were called during the boot check.
