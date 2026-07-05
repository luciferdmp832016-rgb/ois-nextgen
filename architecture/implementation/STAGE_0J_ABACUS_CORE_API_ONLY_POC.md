# Stage 0J Abacus Core API Only POC

Final verdict: `ABACUS_CORE_API_LOCAL_BOOT_VERIFIED_PUBLIC_MAPPING_BLOCKED`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0j-abacus-core-api-only-poc-evidence` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `507b47bf2173127ac53b0266215cd7952ac37f95` |
| Stage 0I-R1 PR merge | PR #9 merged `stage-0i-r1-owner-assisted-abacus-source-evidence` into integration. |
| Stage 0I-R1 commit | `f90bee4dbced8d963c638698ec0fa733e88a3d7c` |
| Stage 0I-R1 result | `ABACUS_SOURCE_CONNECTED_RUNTIME_STILL_BLOCKED` |
| Stage 0J objective | Document the owner/Abacus Agent controlled Core API only POC evidence from Abacus SuperComputer. |
| Abacus deployment/public routing | Not performed. |
| Abacus local runtime | Core API only, started on `127.0.0.1:4000` for evidence capture and then stopped. |
| Migrations | Not executed. |
| Production | Untouched. |

Opening checks:

| Command | Result |
|---|---|
| `git fetch origin --prune` | PASS; integration branch advanced to include Stage 0I-R1 merge. |
| `git log --oneline --decorate -10 origin/stage-0b-complete-handoff-ingestion` | PASS; shows `507b47b Merge pull request #9` and Stage 0I-R1 commit `f90bee4`. |
| `git checkout stage-0b-complete-handoff-ingestion` | PASS. |
| `git pull --ff-only origin stage-0b-complete-handoff-ingestion` | PASS; local integration fast-forwarded to `507b47b`. |
| `git checkout -b stage-0j-abacus-core-api-only-poc-evidence` | PASS. |

## Source Of Truth Reviewed

| File | Use |
|---|---|
| `architecture/implementation/STAGE_0I_R1_OWNER_ASSISTED_ABACUS_SOURCE_EVIDENCE.md` | Source bootstrap evidence and remaining runtime blockers. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Abacus staging runbook, stop conditions and Stage 0J topology recommendation. |
| `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` | Redacted owner checklist and status tracker. |
| `architecture/implementation/IMPLEMENTATION_STATUS.md` | Current stage and gate status register. |
| `architecture/implementation/PHASE_GATE_REGISTER.md` | Current phase gate evidence. |

## Abacus Execution Context

Stage 0J was executed on Abacus SuperComputer by Abacus Agent. This repository change only documents the evidence.

| Item | Evidence | Status |
|---|---|---|
| Repo path | `/home/ubuntu/ois-nextgen` | `CONFIRMED` |
| Branch | `stage-0b-complete-handoff-ingestion` | `CONFIRMED` |
| Abacus execution commit | `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70` | `CONFIRMED` |
| Working tree | Clean except untracked `.abacus.donotdelete` platform file. | `CONFIRMED_PLATFORM_FILE_UNTRACKED` |
| `.env` file | No `.env` created or committed. | `CONFIRMED_NOT_CREATED` |
| Scope | Core API only. OIS Console and PITS Shell were not started. | `CONFIRMED` |

Note: Stage 0J verified Abacus VM build/runtime behavior for commit `64486c1`. Later documentation-only commits describe the evidence and handoff state, but do not change the application behavior that was booted.

## Toolchain And Build Evidence

| Check | Evidence | Status |
|---|---|---|
| Corepack | `corepack enable` passed. | `PASS` |
| Node.js | Abacus used `v22.14.0`. | `PASS` |
| pnpm | Abacus used `9.15.4`. | `PASS` |
| Install | `pnpm install` passed in 26.8s with 185 packages. | `PASS` |
| Prisma client generation | Prisma client generated during install. | `PASS` |
| Lint | `pnpm lint` passed with `Architecture guard passed`. | `PASS` |
| Typecheck | `pnpm typecheck` passed. | `PASS` |
| Tests | `pnpm test` passed; 2 files, 16/16 tests. | `PASS` |
| Recursive build | `pnpm -r --if-present build` passed. | `PASS` |
| Core API build output | Core API build emitted `dist` server/app files. | `PASS` |
| OIS Console build | Next.js static build succeeded. | `PASS` |
| PITS Shell build | Next.js static build succeeded. | `PASS` |

## Core API Only Start Command

The Core API was started with mock-safe configuration and with DB/storage variables explicitly removed or mocked:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_* \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test LOCALHOST_REQUIRED=false \
  AI_PROVIDER=mock AI_PROVIDER_MODE=mock OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=127.0.0.1 CORE_API_PORT=4000 CORE_API_URL=http://127.0.0.1:4000 \
  NEXT_TELEMETRY_DISABLED=1 \
  pnpm --filter @ois/core-api start
```

No production database, storage or OpenRouter value was supplied. No secret values are recorded in this report.

## Boot Evidence

| Probe | Evidence | Status |
|---|---|---|
| Listener | Server listening at `http://127.0.0.1:4000`. | `PASS` |
| PID | `3285` | `RECORDED` |
| OIS Console | Not started. | `CONFIRMED_NOT_STARTED` |
| PITS Shell | Not started. | `CONFIRMED_NOT_STARTED` |
| `GET /health` | HTTP 200; response `{"status":"ok","service":"core-api","stage":"bootstrap-stage-a"}`. | `PASS` |
| `GET /` | HTTP 200; response `{"service":"ois-nextgen-core-api","status":"ok","version":"0.1.0","health":"/health","docs":"/docs"}`. | `PASS` |
| DB-backed endpoints | Not called. | `CONFIRMED_NOT_CALLED` |

This verifies that the OIS Core API can install, build, start and answer local health probes on the Abacus VM with mock-safe configuration.

## Public URL Result

| Probe | Evidence | Status |
|---|---|---|
| `GET https://ois-nextgen.abacusai.cloud/health` | HTTP 404 from cloudflare/nginx. | `PUBLIC_MAPPING_BLOCKED` |

Conclusion: the public URL does not yet map to the locally-running Core API. This is expected because no public deployment or routing was performed in Stage 0J. The public 404 is a routing/deployment issue, not a Core API boot failure.

## Process Cleanup

| Cleanup item | Evidence | Status |
|---|---|---|
| Stop signal | SIGTERM sent to Core API process. | `PASS` |
| Exit code | `143` | `RECORDED` |
| Port cleanup | Post-stop check confirmed no listener on port 4000. | `PASS` |

## Compliance

| Rule | Stage 0J evidence |
|---|---|
| No migrations | No migrations were run. |
| No `prisma db push` | `prisma db push` was not used. |
| No production DB/storage/OpenRouter credentials | No production credentials were used. |
| No secrets printed | No secret values were printed. |
| No `.env` committed | No `.env` was created or committed. |
| No DB/storage-backed endpoints | No DB-backed or storage-backed endpoints were called. |
| Core API only | OIS Console and PITS Shell were not started. |
| Process stopped | The Core API process was stopped after evidence capture. |

## Remaining Blockers

| Blocker | Required resolution |
|---|---|
| Public routing | Configure or discover Abacus public routing so the public URL maps to the local Core API health route. |
| Deployment mechanism | Confirm the controlled deployment/routing path without production credentials or secret exposure. |
| Runtime URL mapping | Confirm whether `/health` on `https://ois-nextgen.abacusai.cloud` can map to Core API port `4000` or whether a service-specific route is required. |
| Env/secrets injection path | Still required before any DB-backed, storage-backed or AI-provider scope. |
| DB/storage/AI scope | Remains excluded until staging-only approval and mock/non-production configuration are confirmed. |

## Recommended Next Stage

Recommended next stage: Stage 0K - Abacus Public Routing / Controlled Deployment POC.

Stage 0K should keep the Core API only topology first, preserve mock-safe env, avoid DB-backed endpoints, avoid storage-backed endpoints, avoid real OpenRouter keys, and stop immediately if a production credential, migration, `prisma db push` or secret printing path appears.

## Decision

Stage 0J verified code/build/runtime on the Abacus VM for Core API local health probes. Public URL routing is not yet verified. The final decision is `ABACUS_CORE_API_LOCAL_BOOT_VERIFIED_PUBLIC_MAPPING_BLOCKED`.

## Safety Statement

Stage 0J evidence documentation is documentation-only in this repository.

- No new Abacus deployment was executed by Codex.
- No production deployment was executed.
- No migrations were run.
- No `prisma db push` was used.
- No production database was connected to or mutated.
- No production storage was used.
- No production OpenRouter key was used.
- No secret values were printed or committed.
- No real secrets or `.env` files were committed.
- No DB-backed or storage-backed endpoints were called in the Abacus POC.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit` completed successfully. |
| `pnpm test` | PASS; 2 files and 16 tests passed. |
| `pnpm -r --if-present build` | PASS; Core API, OIS Console and PITS Shell builds completed. |
| `git status -sb` | PASS; documentation/evidence-only changes present before commit. |
