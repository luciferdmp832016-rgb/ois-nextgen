# Stage 0K Abacus Preview Public Routing POC

Final verdict: `ABACUS_CORE_API_PREVIEW_PUBLIC_HEALTH_VERIFIED`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0k-abacus-preview-public-routing-poc` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `59112af0e4981dafc7ad340e0beba4f9aaf2f1d6` |
| Stage 0J PR merge | PR #10 merged `stage-0j-abacus-core-api-only-poc-evidence` into integration. |
| Stage 0J commit | `b90c7d1af8de0b335d8fefce8fcd4d446c16a25f` |
| Stage 0J result | `ABACUS_CORE_API_LOCAL_BOOT_VERIFIED_PUBLIC_MAPPING_BLOCKED` |
| Stage 0K objective | Document the owner/Abacus Agent controlled public routing POC through the Abacus VM preview proxy. |
| Abacus hosted-app deployment | Not executed. |
| Always On | Not touched. |
| Abacus preview routing | Verified for Core API `/health` through the VM preview proxy. |
| Migrations | Not executed. |
| Production | Untouched. |

Opening checks:

| Command | Result |
|---|---|
| `git fetch origin --prune` | PASS; integration branch advanced to include Stage 0J merge. |
| `git log --oneline --decorate -10 origin/stage-0b-complete-handoff-ingestion` | PASS; shows `59112af Merge pull request #10` and Stage 0J commit `b90c7d1`. |
| `git checkout stage-0b-complete-handoff-ingestion` | PASS. |
| `git pull --ff-only origin stage-0b-complete-handoff-ingestion` | PASS; local integration fast-forwarded to `59112af`. |
| `git checkout -b stage-0k-abacus-preview-public-routing-poc` | PASS. |

## Source Of Truth Reviewed

| File | Use |
|---|---|
| `architecture/implementation/STAGE_0J_ABACUS_CORE_API_ONLY_POC.md` | Prior local Core API boot evidence and public mapping blocker. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Abacus staging runbook, stop conditions and Core API-only staging path. |
| `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` | Redacted owner checklist and preview routing status tracker. |
| `architecture/implementation/IMPLEMENTATION_STATUS.md` | Current stage and gate status register. |
| `architecture/implementation/PHASE_GATE_REGISTER.md` | Current phase gate evidence. |

## Abacus Execution Context

Stage 0K was executed on Abacus SuperComputer by Abacus Agent. This repository change only documents the evidence.

| Item | Evidence | Status |
|---|---|---|
| Repo path | `/home/ubuntu/ois-nextgen` | `CONFIRMED` |
| Branch | `stage-0b-complete-handoff-ingestion` | `CONFIRMED` |
| Abacus execution commit | `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70` | `CONFIRMED` |
| Working tree | Clean except untracked `.abacus.donotdelete` platform file. | `CONFIRMED_PLATFORM_FILE_UNTRACKED` |
| `.env` file | No `.env` created or committed. | `CONFIRMED_NOT_CREATED` |
| Scope | Core API only. OIS Console and PITS Shell were not started. | `CONFIRMED` |
| Hosted-app deployment | Not performed. | `CONFIRMED_NOT_RUN` |
| Always On | Not touched. | `CONFIRMED_NOT_TOUCHED` |

Note: Stage 0K verified preview proxy routing for the application behavior at commit `64486c1`. Later documentation-only commits describe the evidence and do not change the runtime code that was started.

## Routing Analysis

| Route | Meaning | Result | Conclusion |
|---|---|---|---|
| `https://ois-nextgen.abacusai.cloud/health` | Abacus hosted-app custom domain. | HTTP 404 from cloudflare/nginx. | Expected because no hosted-app deployment or Always-On app was performed. It does not route directly to the VM process. |
| `https://7a162f29d-4000.na116.preview.abacusai.app/health` | Abacus VM preview proxy route for port 4000. | HTTP 200 with Core API health payload. | Preview proxy public routing is verified for the Core API health route. |

The preview proxy maps public traffic to processes running inside the VM. The `-4000` hostname suffix exposes VM port `4000`. This preview URL is suitable for a controlled public POC, but it is not final live hosting and does not replace a hosted-app deployment/custom-domain setup.

## Selected Stage 0K Approach

| Area | Selection |
|---|---|
| Service scope | Core API only. |
| Environment posture | Mock-safe env. |
| Database | Not used. |
| Storage | Not used. |
| AI/OpenRouter | Mock mode only; no real key. |
| Host bind | `0.0.0.0` |
| Port | `4000` |
| Public route | Abacus VM preview proxy, not the custom hosted-app domain. |

## Core API Start Command

The Core API was started with mock-safe configuration and DB/storage variables removed:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_ENDPOINT -u ABACUS_STORAGE_ACCESS_KEY -u ABACUS_STORAGE_SECRET_KEY \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test LOCALHOST_REQUIRED=false \
  AI_PROVIDER=mock AI_PROVIDER_MODE=mock OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=0.0.0.0 CORE_API_PORT=4000 CORE_API_URL=http://0.0.0.0:4000 NEXT_TELEMETRY_DISABLED=1 \
  pnpm --filter @ois/core-api start
```

No production database, storage or OpenRouter value was supplied. No secret values are recorded in this report.

## Evidence

| Probe | Evidence | Status |
|---|---|---|
| Core API PID | `682` | `RECORDED` |
| Process | `tsx src/server.ts` | `RECORDED` |
| Listener | `0.0.0.0:4000` | `PASS` |
| Local health | `GET http://127.0.0.1:4000/health` returned HTTP 200. | `PASS` |
| Public preview health | `GET https://7a162f29d-4000.na116.preview.abacusai.app/health` returned HTTP 200 with Core API health payload. | `PASS` |
| Hosted custom domain health | `GET https://ois-nextgen.abacusai.cloud/health` returned HTTP 404. | `EXPECTED_HOSTED_APP_NOT_DEPLOYED` |
| Always On | Not touched. | `CONFIRMED_NOT_TOUCHED` |
| DB-backed endpoints | Not called. | `CONFIRMED_NOT_CALLED` |
| Secret exposure | No secrets printed. | `CONFIRMED_NOT_PRINTED` |
| `.env` file | No `.env` file created or committed. | `CONFIRMED_NOT_CREATED` |
| Working tree | Clean except Abacus platform file `.abacus.donotdelete`. | `CONFIRMED_PLATFORM_FILE_UNTRACKED` |
| Process lifecycle | Process intentionally kept running for live verification. | `INTENTIONALLY_RUNNING` |

Stage 0K verifies Abacus VM preview public routing for the Core API health route. It does not verify Abacus hosted-app deployment, Always-On routing, custom domain routing or final live hosting.

## Preview Vs Hosted Domain Distinction

| Surface | Verified in Stage 0K | Notes |
|---|---|---|
| VM local process on port 4000 | Yes | Core API bound to `0.0.0.0:4000`. |
| VM preview proxy public URL | Yes | `https://7a162f29d-4000.na116.preview.abacusai.app/health` returned HTTP 200. |
| Hosted-app custom domain | No | `https://ois-nextgen.abacusai.cloud/health` returned HTTP 404 because no hosted-app deployment exists. |
| Always-On app | No | Always On was not touched. |
| Final live hosting | No | Preview route is only suitable for controlled POC evidence. |

## Compliance

| Rule | Stage 0K evidence |
|---|---|
| No migrations | No migrations were run. |
| No `prisma db push` | `prisma db push` was not used. |
| No production DB/storage/OpenRouter credentials | No production credentials were used. |
| No secrets printed | No secret values were printed. |
| No `.env` committed | No `.env` was created or committed. |
| No DB/storage-backed endpoints | No DB-backed or storage-backed endpoints were called. |
| Core API only | OIS Console and PITS Shell were not started. |
| Hosted app untouched | No hosted-app deployment or Always-On setup was performed. |

## Remaining Blockers

| Blocker | Required resolution |
|---|---|
| Hosted-app deployment | Configure a controlled Abacus hosted-app Core API deployment or equivalent app service. |
| Custom domain routing | Confirm `https://ois-nextgen.abacusai.cloud/health` maps to the hosted Core API after deployment. |
| Always-On behavior | Confirm whether the hosted app must be Always-On and record owner approval before enabling it. |
| Env/secrets injection path | Still required before any DB-backed, storage-backed or AI-provider scope. |
| Final live hosting | Preview URL is not final hosting; use it only for controlled public POC evidence. |

## Recommended Next Stage

Recommended next stage: Stage 0L - Abacus Hosted-App Core API Deployment / Custom Domain POC.

Stage 0L should keep the Core API only topology first, preserve mock-safe env, avoid DB-backed endpoints, avoid storage-backed endpoints, avoid real OpenRouter keys, and stop immediately if a production credential, migration, `prisma db push` or secret printing path appears.

## Decision

Stage 0K verified Abacus VM preview public routing for Core API `/health`. The final decision is `ABACUS_CORE_API_PREVIEW_PUBLIC_HEALTH_VERIFIED`.

Custom hosted-app domain routing remains unverified and requires a future hosted-app deployment or Always-On app POC.

## Safety Statement

Stage 0K evidence documentation is documentation-only in this repository.

- No new Abacus action was executed by Codex.
- No hosted-app deployment was executed by Codex.
- No production deployment was executed.
- No migrations were run.
- No `prisma db push` was used.
- No production database was connected to or mutated.
- No production storage was used.
- No production OpenRouter key was used.
- No secret values were printed or committed.
- No real secrets or `.env` files were committed.
- No DB-backed or storage-backed endpoints were called in the Abacus POC.
- Only the Core API was started in the Abacus POC.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit` completed successfully. |
| `pnpm test` | PASS; 2 files and 16 tests passed. |
| `pnpm -r --if-present build` | PASS; Core API, OIS Console and PITS Shell builds completed. |
| `git status -sb` | PASS; documentation/evidence-only changes present before commit. |
