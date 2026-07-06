# Stage 0N Abacus Resource Boundary SuperComputer Contract

Final verdict: `ABACUS_RESOURCE_BOUNDARY_SUPERCOMPUTER_DEPLOYMENT_CONTRACT_READY`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0n-abacus-resource-boundary-supercomputer-contract` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `b90605b` |
| Latest repo merge observed | PR #12 merged `stage-0l-abacus-hosted-app-custom-domain-blocker` into integration. |
| Stage 0L result | `ABACUS_HOSTED_APP_CUSTOM_DOMAIN_DEPLOY_BLOCKED_FROM_VM` |
| Stage 0N source evidence | User-provided Abacus Resource Boundary and App Shell Inventory Audit, final verdict `PARTIALLY_CONFIRMED_APP_SHELLS_FOUND`. |
| Stage 0N objective | Record the corrected Abacus architecture, resource isolation contract and safer SuperComputer deployment path. |
| Abacus deploy | Not executed. |
| Runtime start | Not executed. |
| Migrations | Not executed. |
| Production | Untouched. |

Opening checks:

| Command | Result |
|---|---|
| `git fetch origin --prune` | PASS; integration branch advanced to include Stage 0L merge. |
| `git log --oneline --decorate -12 origin/stage-0b-complete-handoff-ingestion` | PASS; shows Stage 0L merge `b90605b`. |
| Stage 0M repo artifact search | No Stage 0M branch/report was present in the fetched repo refs. Stage 0N uses the user-provided audit facts as source evidence. |
| `git checkout stage-0b-complete-handoff-ingestion` | PASS. |
| `git pull --ff-only origin stage-0b-complete-handoff-ingestion` | PASS; local integration fast-forwarded to `b90605b`. |
| `git checkout -b stage-0n-abacus-resource-boundary-supercomputer-contract` | PASS. |

## Source Of Truth Reviewed

| File | Use |
|---|---|
| `architecture/implementation/STAGE_0L_ABACUS_HOSTED_APP_CUSTOM_DOMAIN_POC.md` | Hosted-app custom domain blocker and preview route evidence. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Current Abacus staging runbook and stop conditions. |
| `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` | Current Abacus input/evidence checklist. |
| `architecture/implementation/IMPLEMENTATION_STATUS.md` | Current stage and gate status register. |
| `architecture/implementation/PHASE_GATE_REGISTER.md` | Current phase gate evidence. |

## Corrected Abacus Architecture

| Plane or surface | Contract |
|---|---|
| Codex/GitHub | Engineering and test plane. Source control, PRs, CI, docs and local validation live here. |
| Abacus SuperComputer | Staging VM/app shell plane. It has its own public Abacus-managed domain, attached database, storage prefix, GitHub integration, SSH, nginx and systemd. |
| `https://ois-nextgen.abacusai.cloud` | Abacus-managed public domain for the OIS NextGen SuperComputer/App Shell. It is suitable for staging and team access after controlled deployment. |
| VM preview proxy | Temporary port preview route for VM processes, such as `https://7a162f29d-4000.na116.preview.abacusai.app/health`. Useful for controlled POC evidence, not final staging contract. |
| `dmp247.com` custom domains | Optional branded/publication layer. Do not touch external custom domains until NextGen is validated on the Abacus-managed public domain. |
| App Shell resources | Isolated by database name, storage numeric prefix and secrets. One product should use one App Shell. |

## Confirmed Audit Facts

| Item | Evidence | Stage 0N status |
|---|---|---|
| SuperComputer/cloud ID | `151e3ee5ff` | `CONFIRMED` |
| OIS NextGen Abacus-managed public domain | `https://ois-nextgen.abacusai.cloud` | `CONFIRMED` |
| Current public domain status | Serves static `READY` page; no app deployed yet. | `CONFIRMED` |
| Active nginx vhost | Only `default.conf`. | `CONFIRMED` |
| User-deployed systemd services | None. | `CONFIRMED` |
| GitHub integration | Connected to `luciferdmp832016-rgb`. | `CONFIRMED` |
| Repo state in audit VM session | `/home/ubuntu/ois-nextgen` was not present, despite earlier sessions cloning/booting it. | `SESSION_DEPENDENT` |
| Repo preflight requirement | Always clone/pull before deployment work. | `REQUIRED` |
| OIS NextGen database | `default` attached, active, empty, 0 tables. | `CONFIRMED_SAFE_STAGING` |
| OIS NextGen storage prefix | `59543/` attached, empty. | `CONFIRMED_SAFE_STAGING` |
| OIS Phase 1 App Shell | Active at `oisys.abacusai.app` and `ois.dmp247.com`, same backend/buildId, live Next.js app, database connected. | `CONFIRMED_DO_NOT_TOUCH` |
| OIS Phase 1 database | `ois_phase1_dev` | `DO_NOT_TOUCH` |
| Emerald/BQL database | `emerald_bql_web_dev` | `DO_NOT_TOUCH` |
| Inferred Emerald/BQL storage prefix | `49816/` | `DO_NOT_TOUCH` |
| Inferred OIS Phase 1 storage prefix | `52067/` | `DO_NOT_TOUCH` |
| OIS NextGen storage prefix | `59543/` | `USE_ONLY_FOR_NEXTGEN_STAGING` |
| PITS placement today | Bundled inside OIS Phase 1 shell. | `PRODUCT_BOUNDARY_RISK` |

## Resource Isolation Contract

| Resource | OIS NextGen staging rule |
|---|---|
| Database | Use `default` only. It is attached, active, empty and safe for OIS NextGen staging. |
| Storage | Use S3 numeric prefix `59543/` only. |
| Secrets | Create fresh OIS NextGen staging secrets only. |
| Phase 1 DB | Never touch `ois_phase1_dev`. |
| Phase 1 storage | Never touch inferred prefix `52067/`. |
| Emerald/BQL DB | Never touch `emerald_bql_web_dev`. |
| Emerald/BQL storage | Never touch inferred prefix `49816/`. |
| Phase 1 secrets | Never reuse Phase 1 JWT, DB, Redis, MinIO or Neo4j secrets. |
| Product shells | Future products should use one App Shell per product with isolated DB, S3 prefix and secrets. |

## Deployment Pivot

Stage 0L showed the hosted-app registration path was blocked from VM/Agent. The Stage 0N audit clarifies a safer immediate path:

| Previous assumption | Corrected contract |
|---|---|
| Hosted-app registration must be solved first. | SuperComputer nginx + systemd can serve the Abacus-managed public domain for the OIS NextGen App Shell. |
| `ois-nextgen.abacusai.cloud` is only a hosted-app custom domain. | It is the Abacus-managed public domain for the SuperComputer/App Shell. |
| VM preview URL is the only public route available before hosted-app registration. | VM preview remains temporary, while nginx/systemd on SuperComputer is the next staging deployment path. |
| External custom domain should be part of early validation. | `dmp247.com` custom domains are optional branding/publication layers and must remain untouched until NextGen is validated. |

## Stage 0O Gate

Recommended next stage: Stage 0O - SuperComputer Nginx/Systemd Core API Staging Deploy POC.

Stage 0O gate:

- Core API only first.
- Mock-safe env only.
- No DB-backed endpoints.
- No storage-backed endpoints.
- No real AI/OpenRouter provider.
- No migrations.
- No `prisma db push`.
- Preflight clone/pull because repo state is session-dependent.
- Use OIS NextGen `default` database only if a future step explicitly approves DB use; initial Stage 0O should not use DB-backed routes.
- Use OIS NextGen storage prefix `59543/` only if a future step explicitly approves storage use; initial Stage 0O should keep storage mock-only.
- Configure a user-deployed systemd service for Core API only.
- Configure an nginx vhost for the Abacus-managed public domain.
- Target health: `https://ois-nextgen.abacusai.cloud/health` returns HTTP 200.
- Do not touch `ois.dmp247.com`, `oisys.abacusai.app`, `ois_phase1_dev`, `emerald_bql_web_dev`, `49816/` or `52067/`.

## Stop Conditions

Stop Stage 0O immediately if any of these occur:

- A production or Phase 1 credential is requested.
- A migration, seed or `prisma db push` is suggested.
- The workflow would touch `ois_phase1_dev`, `emerald_bql_web_dev`, `49816/`, `52067/`, `oisys.abacusai.app` or `ois.dmp247.com`.
- The workflow would reuse Phase 1 JWT, DB, Redis, MinIO or Neo4j secrets.
- The nginx/systemd change cannot be scoped to OIS NextGen Core API only.
- The repo clone/pull preflight cannot establish the expected source ref.

## Decision

The resource boundary and deployment contract are ready. Stage 0N result is `ABACUS_RESOURCE_BOUNDARY_SUPERCOMPUTER_DEPLOYMENT_CONTRACT_READY`.

No deployment, runtime start, migration, `prisma db push`, production credential use or secret commit occurred in Stage 0N.

## Safety Statement

Stage 0N is documentation-only.

- No Abacus deployment was executed.
- No runtime was started.
- No nginx or systemd changes were made.
- No migrations were run.
- No `prisma db push` was used.
- No production database, storage or OpenRouter credentials were used.
- No OIS Phase 1 or Emerald/BQL resources were touched.
- No secret values were printed or committed.
- No real secrets or `.env` files were committed.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit`. |
| `pnpm test` | PASS; 2 files, 16 tests. |
| `pnpm -r --if-present build` | PASS; Core API TypeScript build and OIS Console/PITS Shell Next.js static builds completed. |
| `git status -sb` | PASS; documentation-only Stage 0N changes pending commit. |
