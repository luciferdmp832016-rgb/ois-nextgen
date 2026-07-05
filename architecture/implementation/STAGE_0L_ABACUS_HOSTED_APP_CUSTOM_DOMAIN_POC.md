# Stage 0L Abacus Hosted-App Custom Domain POC

Final verdict: `ABACUS_HOSTED_APP_CUSTOM_DOMAIN_DEPLOY_BLOCKED_FROM_VM`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0l-abacus-hosted-app-custom-domain-blocker` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `cc463a39d081f38a8a15590f6552aae8244abdb5` |
| Stage 0K PR merge | PR #11 merged `stage-0k-abacus-preview-public-routing-poc` into integration. |
| Stage 0K commit | `7ff274f0004d5af0dae1b78f0097c1172a6e1e38` |
| Stage 0K result | `ABACUS_CORE_API_PREVIEW_PUBLIC_HEALTH_VERIFIED` |
| Stage 0L objective | Document the Abacus Agent hosted-app custom-domain investigation and blocker evidence. |
| Hosted-app deployment | Blocked from VM shell; not forced. |
| Code changes on Abacus | None. |
| Runtime | Controlled Core API-only boot for evidence capture, then stopped. |
| Migrations | Not executed. |
| Production | Untouched. |

Opening checks:

| Command | Result |
|---|---|
| `git fetch origin --prune` | PASS; integration branch advanced to include Stage 0K merge. |
| `git log --oneline --decorate -10 origin/stage-0b-complete-handoff-ingestion` | PASS; shows `cc463a3 Merge pull request #11` and Stage 0K commit `7ff274f`. |
| `git checkout stage-0b-complete-handoff-ingestion` | PASS. |
| `git pull --ff-only origin stage-0b-complete-handoff-ingestion` | PASS; local integration fast-forwarded to `cc463a3`. |
| `git checkout -b stage-0l-abacus-hosted-app-custom-domain-blocker` | PASS. |

## Source Of Truth Reviewed

| File | Use |
|---|---|
| `architecture/implementation/STAGE_0K_ABACUS_PREVIEW_PUBLIC_ROUTING_POC.md` | Preview proxy success and hosted-domain distinction. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Abacus staging runbook, stop conditions and Stage 0L direction. |
| `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` | Redacted owner checklist and routing status tracker. |
| `architecture/implementation/IMPLEMENTATION_STATUS.md` | Current stage and gate status register. |
| `architecture/implementation/PHASE_GATE_REGISTER.md` | Current phase gate evidence. |

## Abacus Execution Context

Stage 0L was executed on Abacus SuperComputer by Abacus Agent. This repository change only documents the evidence.

| Item | Evidence | Status |
|---|---|---|
| Repo path | `/home/ubuntu/ois-nextgen` | `CONFIRMED` |
| Branch | `stage-0b-complete-handoff-ingestion` | `CONFIRMED` |
| Abacus execution commit | `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70` | `CONFIRMED` |
| Working tree | Clean except untracked `.abacus.donotdelete` platform file. | `CONFIRMED_PLATFORM_FILE_UNTRACKED` |
| Code changes during Stage 0L | None. | `CONFIRMED_NOT_CHANGED` |
| `.env` file | No `.env` created or committed. | `CONFIRMED_NOT_CREATED` |
| Scope | Investigation plus controlled Core API-only boot. | `CONFIRMED` |
| Hosted app/service created | None. | `CONFIRMED_NOT_CREATED` |
| Always On | Not changed. | `CONFIRMED_NOT_CHANGED` |

Note: Stage 0L investigated hosted-app/custom-domain routing for the application behavior at commit `64486c1`. Later documentation-only commits describe the evidence and do not change the runtime code that was started.

## Key Findings

| Finding | Evidence | Status |
|---|---|---|
| VM cannot bind custom domain | No VM-side mechanism was found to bind `ois-nextgen.abacusai.cloud` to a Core API process. | `BLOCKED_FROM_VM` |
| Deploy CLI unavailable | No `abacus` or `abacusai` deploy CLI exists on `PATH`. | `BLOCKED_FROM_VM` |
| SDK mismatch | Abacus SDK deployment methods found are for ML models/agents, not generic Node/Fastify web-service deployment to a custom domain. | `BLOCKED_FROM_VM` |
| VM preview origin | VM controls preview route via `APP_ORIGIN` / `PREVIEW_URL` = `https://7a162f29d.na116.preview.abacusai.app`. | `CONFIRMED` |
| Port preview route | Port 4000 preview route works through `https://7a162f29d-4000.na116.preview.abacusai.app/health`. | `CONFIRMED` |
| Custom domain edge | `ois-nextgen.abacusai.cloud` is served by Abacus edge/cloudflare/envoy. | `CONFIRMED` |
| Custom domain root | `https://ois-nextgen.abacusai.cloud/` returned HTTP 200 body `READY`. | `EDGE_PLACEHOLDER_CONFIRMED` |
| Custom domain health | `https://ois-nextgen.abacusai.cloud/health` returned HTTP 404. | `BACKEND_MAPPING_MISSING` |
| Bind/PORT/Always On limits | Binding `0.0.0.0`, setting `PORT`, or changing Always On cannot solve custom-domain routing from inside the VM without platform-side hosted-app deployment config. | `BLOCKED_FROM_VM` |

## Routing Result

| Route | Meaning | Result | Conclusion |
|---|---|---|---|
| `http://127.0.0.1:4000/health` | Local VM Core API health route. | HTTP 200. | Core API boot remained healthy. |
| `https://7a162f29d-4000.na116.preview.abacusai.app/health` | Abacus VM preview proxy route for port 4000. | HTTP 200. | Preview proxy public route remains verified. |
| `https://ois-nextgen.abacusai.cloud/health` | Abacus hosted-app custom domain health route. | HTTP 404. | Backend hosted app is not mapped. |
| `https://ois-nextgen.abacusai.cloud/` | Abacus hosted-app custom domain root. | HTTP 200 body `READY`. | Edge placeholder is provisioned, but it is not the Core API. |

Custom domain hosted-app routing is provisioned at the edge but not deployed/mapped to the Core API backend. This cannot be completed from the VM shell alone.

## Start Command Used

The Core API was started with mock-safe configuration and DB/storage variables removed:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_* \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test \
  LOCALHOST_REQUIRED=false AI_PROVIDER=mock AI_PROVIDER_MODE=mock \
  OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=0.0.0.0 CORE_API_PORT=4000 \
  pnpm --filter @ois/core-api start
```

No production database, storage or OpenRouter value was supplied. No secret values are recorded in this report.

## Runtime Evidence

| Item | Evidence | Status |
|---|---|---|
| Service scope | Core API only. | `CONFIRMED` |
| Console/PITS | Not started. | `CONFIRMED_NOT_STARTED` |
| PID during test | `782` | `RECORDED` |
| Local health | `http://127.0.0.1:4000/health` returned HTTP 200. | `PASS` |
| Preview health | `https://7a162f29d-4000.na116.preview.abacusai.app/health` returned HTTP 200. | `PASS` |
| Custom domain health | `https://ois-nextgen.abacusai.cloud/health` returned HTTP 404. | `BLOCKED_BACKEND_MAPPING_MISSING` |
| Custom domain root | `https://ois-nextgen.abacusai.cloud/` returned HTTP 200 body `READY`. | `EDGE_PLACEHOLDER_CONFIRMED` |
| Process cleanup | Process stopped after evidence capture. | `PASS` |
| Post-stop listener | No listener remained on port 4000 after stop. | `PASS` |

## Preview Vs Hosted Domain Distinction

| Surface | Stage 0L status | Notes |
|---|---|---|
| VM preview proxy public route | Verified | `https://7a162f29d-4000.na116.preview.abacusai.app/health` returns Core API HTTP 200. |
| Custom domain edge/root | Provisioned placeholder | `https://ois-nextgen.abacusai.cloud/` returns `READY`. |
| Custom domain hosted-app `/health` | Blocked | `https://ois-nextgen.abacusai.cloud/health` returns HTTP 404 because no backend hosted app is mapped. |
| VM shell deployment path | Blocked | No generic Node/Fastify hosted-app deploy mechanism found in VM shell. |
| Platform/console registration | Required | Owner-assisted Abacus hosted-app service registration is needed. |

## Compliance

| Rule | Stage 0L evidence |
|---|---|
| No hosted app/service created | No hosted app or service was created. |
| No Always On change | Always On was not changed. |
| No migrations | No migrations were run. |
| No `prisma db push` | `prisma db push` was not used. |
| No production DB/storage/OpenRouter credentials | No production credentials were used. |
| No secrets printed | No secret values were printed. |
| No `.env` committed | No `.env` was created or committed. |
| No DB-backed endpoints | No DB-backed endpoints were called. |
| Core API only | OIS Console and PITS Shell were not started. |

## Remaining Blockers

| Blocker | Required resolution |
|---|---|
| Hosted-app service registration | Owner or Abacus UI/console must register a Core API hosted app/service. |
| Custom domain backend mapping | Map `https://ois-nextgen.abacusai.cloud/health` to the Core API hosted app backend. |
| Platform-required port behavior | Confirm whether hosted app uses fixed port `4000` or platform-provided `PORT`. |
| Always-On scope | Enable Always On only for the single Core API service if required and owner-approved. |
| Env/secrets injection path | Keep mock-safe env for first hosted-app POC; defer DB/storage/AI secrets. |

## Recommended Next Stage

Recommended next stage: Stage 0M - Owner-Assisted Abacus Hosted-App Service Registration.

Recommended Stage 0M topology:

- Core API only hosted app first.
- Mock-safe env.
- No DB, storage or real AI/OpenRouter provider.
- Healthcheck path `/health`.
- Port `4000` or platform-required `PORT`.
- Always On only for the single Core API service, and only with owner approval.
- Console and PITS later.

## Decision

Stage 0L did not force deployment. It confirmed that VM preview proxy public routing works, but custom-domain hosted-app routing requires Abacus platform/console hosted-app service registration and cannot be completed from the VM shell alone.

The final decision is `ABACUS_HOSTED_APP_CUSTOM_DOMAIN_DEPLOY_BLOCKED_FROM_VM`.

## Safety Statement

Stage 0L evidence documentation is documentation-only in this repository.

- No new Abacus action was executed by Codex.
- No hosted app/service was created.
- No Always On setting was changed.
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
