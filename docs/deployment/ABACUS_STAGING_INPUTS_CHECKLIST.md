# Abacus Staging Inputs Checklist

This is the Stage 0F-R3 owner handoff package for unblocking the Abacus staging runtime POC.

Do not commit real secret values to this file. Fill this checklist with staging-only confirmations, secret names, private secret-manager paths, redacted identifiers and owner approval evidence only. If real values are needed, enter them directly into Abacus or an approved private secret manager outside the repository.

## Current Decision

Stage 0F-R2 blocked safely because staging-only inputs were missing or unknown. Stage 0F-R3 does not deploy and does not run the runtime POC. The runtime POC remains blocked until every required item below is confirmed as staging-only.

Stage 0O verified the first Core API-only SuperComputer nginx/systemd staging health POC. `https://ois-nextgen.abacusai.cloud/health` now returns HTTP/2 200 with the Core API health payload. This does not approve DB-backed endpoints, storage-backed endpoints, Console deployment, PITS deployment, worker deployment, migrations, `prisma db push`, real OpenRouter usage or external `dmp247.com` custom-domain publication.

Stage 0I discovery status: live Abacus/SuperComputer runtime configuration is still blocked. No Abacus connector, CLI, authenticated UI, screenshots or owner-filled checklist were available. Use the table below for redacted status tracking only.

| Item | Stage 0I status | Redacted reference |
|---|---|---|
| Project name | `CANDIDATE_VISIBLE_BUT_UNVERIFIED` | `OIS NextGen Staging` from prior notes; not re-confirmed live in Stage 0I. |
| Project ID | `UNKNOWN` | `<staging-project-id>` |
| SuperComputer/cloud ID | `UNKNOWN` | `<staging-cloud-id>` |
| Public URL | `UNKNOWN` | `<staging-public-url>` |
| Always On | `UNKNOWN` | `<enabled | disabled | unknown>` |
| GitHub connected | `UNKNOWN` | `<connected | disconnected | unknown>` |
| OIS repo cloned | `UNKNOWN` | `<repo-path-branch-commit>` |
| Core API service/task ID | `UNKNOWN` | `<staging-core-api-service-id>` |
| OIS Console service/task ID | `UNKNOWN` | `<staging-console-service-id>` |
| PITS Shell service/task ID | `UNKNOWN` | `<staging-pits-service-id>` |
| Env/secrets injection path | `BLOCKED` | `<staging-only-path-description>` |
| `DATABASE_URL` staging secret/reference | `UNKNOWN` | `<secret-name-or-private-reference-only>` |
| Storage mock mode | `UNKNOWN` | Expected `STORAGE_PROVIDER=mock`; live Abacus value not confirmed. |
| AI mock mode | `UNKNOWN` | Expected `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock`; live Abacus value not confirmed. |
| OpenRouter key | `UNKNOWN` | Expected unset for first POC; no value recorded. |
| Runtime port/proxy behavior | `UNKNOWN` | `<fixed-ports | dynamic-port | split-app-proxy>` |
| Multiple service support | `UNKNOWN` | `<split-apps | multi-service | unknown>` |
| Build/start entrypoint options | `UNKNOWN` | Repo commands known; Abacus UI support not confirmed. |
| Healthcheck config options | `UNKNOWN` | Repo healthchecks known; Abacus UI support not confirmed. |

Stage 0I-R1 owner-assisted source evidence update: Abacus source bootstrap is now confirmed, but runtime configuration remains blocked. The rows below record non-secret evidence only and do not approve deployment, runtime start, DB use, storage use, OpenRouter use or migrations.

| Item | Stage 0I-R1 status | Redacted reference |
|---|---|---|
| GitHub connected | `CONFIRMED` | Abacus UI shows GitHub account `@luciferdmp832016-rgb` connected. |
| Abacus git command support | `CONFIRMED` | Abacus UI says git commands work automatically in the VM. |
| OIS repo cloned | `CONFIRMED` | `/home/ubuntu/ois-nextgen` |
| Repo remote | `CONFIRMED` | `origin -> https://github.com/luciferdmp832016-rgb/ois-nextgen.git` |
| Active branch | `CONFIRMED` | `stage-0b-complete-handoff-ingestion` |
| Active commit | `CONFIRMED` | `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70` |
| Working tree | `CONFIRMED` | Clean and up to date with `origin/stage-0b-complete-handoff-ingestion`. |
| Fetch/checkout/pull verification | `CONFIRMED` | `git fetch origin`, `git checkout`, and `git pull --ff-only` completed without errors or new refs to pull. |
| Package install/build/runtime | `CONFIRMED_NOT_RUN` | No `pnpm install`, build or app start was run. |
| Migration / `prisma db push` | `CONFIRMED_NOT_RUN` | No migrations and no `prisma db push` were run. |
| Secret printing | `CONFIRMED_NOT_RUN` | No secret values were printed. |
| Public URL candidate | `CANDIDATE_VISIBLE_BUT_UNVERIFIED` | `https://ois-nextgen.abacusai.cloud`; runtime mapping unknown. |
| SuperComputer/cloud ID candidate | `CANDIDATE_VISIBLE_BUT_UNVERIFIED` | `151e3ee5ff` |
| Storage mechanism | `CONFIRMED_USAGE_DEFERRED` | `s3://abacusai-apps-63d0fc416a01edba9893570e-us-west-2/59543/`; first POC remains mock-only. |
| Database mechanism | `CONFIRMED_USAGE_BLOCKED` | Attached DB `default`; available DBs `default`, `emerald_bql_web_dev`, `ois_phase1_dev`; DB use requires staging-only approval. |
| SSH endpoints | `CONFIRMED_VISIBLE` | IPv6 `ssh ubuntu@ois-nextgen.ssh.abacusai.cloud`; IPv4 `ssh ubuntu@ois-nextgen.ssh4.abacusai.cloud -p 22411`. |
| Always On | `CONFIRMED_VISIBLE` | Appears OFF. |
| Env/secrets injection path | `PARTIAL/UNKNOWN` | Mechanism still not confirmed; record names/references only when available. |
| Runtime port/proxy behavior | `UNKNOWN` | No runtime was started and no port mapping was inspected. |
| Public URL runtime mapping | `UNKNOWN` | Candidate URL exists, but `/health` mapping has not been tested. |

Stage 0J Core API only POC evidence update: Abacus VM code/build/local runtime is confirmed for Core API with mock-safe env. Public routing remains blocked. This table does not approve DB-backed endpoints, storage-backed endpoints, real AI providers, migrations or production resources.

| Item | Stage 0J status | Redacted reference |
|---|---|---|
| Abacus repo path | `CONFIRMED` | `/home/ubuntu/ois-nextgen` |
| Abacus execution branch | `CONFIRMED` | `stage-0b-complete-handoff-ingestion` |
| Abacus execution commit | `CONFIRMED` | `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70` |
| Abacus working tree | `CONFIRMED_WITH_PLATFORM_FILE` | Clean except untracked `.abacus.donotdelete` platform file. |
| `.env` file | `CONFIRMED_NOT_CREATED` | No `.env` created or committed. |
| Node.js version | `CONFIRMED` | `v22.14.0` |
| pnpm version | `CONFIRMED` | `9.15.4` |
| Install/build/test | `CONFIRMED` | `corepack enable`, `pnpm install`, lint, typecheck, tests and recursive build passed. |
| Prisma client generation | `CONFIRMED` | Generated during install; no migration ran. |
| Core API local listener | `CONFIRMED` | `127.0.0.1:4000` |
| Core API local `/health` | `CONFIRMED` | HTTP 200 with `status=ok`. |
| Core API local `/` | `CONFIRMED` | HTTP 200 with service `ois-nextgen-core-api`. |
| Console/PITS runtime | `CONFIRMED_NOT_STARTED` | Core API only POC. |
| DB-backed endpoints | `CONFIRMED_NOT_CALLED` | No DB-backed endpoints called. |
| Storage-backed endpoints | `CONFIRMED_NOT_CALLED` | No storage-backed endpoints called. |
| AI/OpenRouter real key | `CONFIRMED_NOT_USED` | Mock mode; `OPENROUTER_API_KEY` empty. |
| Public URL `/health` | `BLOCKED_PUBLIC_MAPPING` | `https://ois-nextgen.abacusai.cloud/health` returned HTTP 404 from cloudflare/nginx. |
| Process cleanup | `CONFIRMED` | SIGTERM sent, exit 143, post-stop port 4000 listener check clear. |

Stage 0K preview public routing evidence update: Abacus VM preview routing is confirmed for Core API `/health`. Hosted-app/custom-domain routing is still unverified. This table does not approve DB-backed endpoints, storage-backed endpoints, real AI providers, migrations, hosted-app deployment or production resources.

| Item | Stage 0K status | Redacted reference |
|---|---|---|
| Abacus repo path | `CONFIRMED` | `/home/ubuntu/ois-nextgen` |
| Abacus execution branch | `CONFIRMED` | `stage-0b-complete-handoff-ingestion` |
| Abacus execution commit | `CONFIRMED` | `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70` |
| Abacus working tree | `CONFIRMED_WITH_PLATFORM_FILE` | Clean except untracked `.abacus.donotdelete` platform file. |
| `.env` file | `CONFIRMED_NOT_CREATED` | No `.env` created or committed. |
| Service scope | `CONFIRMED_CORE_API_ONLY` | Console and PITS were not started. |
| Runtime bind | `CONFIRMED` | `0.0.0.0:4000` |
| Process | `CONFIRMED` | PID `682`, `tsx src/server.ts`. |
| Local Core API `/health` | `CONFIRMED` | `http://127.0.0.1:4000/health` returned HTTP 200. |
| Preview proxy Core API `/health` | `CONFIRMED` | `https://7a162f29d-4000.na116.preview.abacusai.app/health` returned HTTP 200 with Core API health payload. |
| Hosted custom domain `/health` | `EXPECTED_NOT_ROUTED` | `https://ois-nextgen.abacusai.cloud/health` returned HTTP 404; no hosted-app deployment exists. |
| Preview vs hosted distinction | `CONFIRMED` | Preview URL maps to VM process; hosted-app domain requires deployment/Always-On app. |
| Always On | `CONFIRMED_NOT_TOUCHED` | Always On was not touched. |
| DB-backed endpoints | `CONFIRMED_NOT_CALLED` | No DB-backed endpoints called. |
| Storage-backed endpoints | `CONFIRMED_NOT_CALLED` | No storage-backed endpoints called. |
| AI/OpenRouter real key | `CONFIRMED_NOT_USED` | Mock mode; no real OpenRouter key. |
| Secret printing | `CONFIRMED_NOT_PRINTED` | No secrets printed. |
| Process lifecycle | `INTENTIONALLY_RUNNING` | Core API process was intentionally kept running for live verification. |

Stage 0L hosted-app custom domain evidence update: VM preview routing remains confirmed, but custom-domain hosted-app deployment is blocked from the VM shell. This table does not approve DB-backed endpoints, storage-backed endpoints, real AI providers, migrations, hosted-app creation without owner registration, Always On changes or production resources.

| Item | Stage 0L status | Redacted reference |
|---|---|---|
| Abacus repo path | `CONFIRMED` | `/home/ubuntu/ois-nextgen` |
| Abacus execution branch | `CONFIRMED` | `stage-0b-complete-handoff-ingestion` |
| Abacus execution commit | `CONFIRMED` | `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70` |
| Abacus working tree | `CONFIRMED_WITH_PLATFORM_FILE` | Clean except untracked `.abacus.donotdelete` platform file. |
| Code changes | `CONFIRMED_NOT_CHANGED` | No code changes made during Abacus Stage 0L. |
| `.env` file | `CONFIRMED_NOT_CREATED` | No `.env` created or committed. |
| Hosted app/service creation | `CONFIRMED_NOT_CREATED` | No hosted app/service was created. |
| Always On | `CONFIRMED_NOT_CHANGED` | Always On was not changed. |
| VM deploy CLI | `BLOCKED` | No `abacus`/`abacusai` deploy CLI found on `PATH`. |
| SDK deploy path | `BLOCKED` | Found deployment methods target ML models/agents, not generic Node/Fastify custom-domain web service. |
| VM preview origin | `CONFIRMED` | `APP_ORIGIN` / `PREVIEW_URL` = `https://7a162f29d.na116.preview.abacusai.app`. |
| Preview proxy Core API `/health` | `CONFIRMED` | `https://7a162f29d-4000.na116.preview.abacusai.app/health` returned HTTP 200. |
| Custom domain root | `EDGE_PLACEHOLDER_CONFIRMED` | `https://ois-nextgen.abacusai.cloud/` returned HTTP 200 body `READY`. |
| Custom domain `/health` | `BLOCKED_BACKEND_MAPPING_MISSING` | `https://ois-nextgen.abacusai.cloud/health` returned HTTP 404. |
| Core API local `/health` | `CONFIRMED` | `http://127.0.0.1:4000/health` returned HTTP 200. |
| Process lifecycle | `CONFIRMED_STOPPED` | PID `782` stopped after evidence; no listener remained on port 4000. |
| DB-backed endpoints | `CONFIRMED_NOT_CALLED` | No DB-backed endpoints called. |
| Storage-backed endpoints | `CONFIRMED_NOT_CALLED` | No storage-backed endpoints called. |
| AI/OpenRouter real key | `CONFIRMED_NOT_USED` | Mock mode; no real OpenRouter key. |
| Secret printing | `CONFIRMED_NOT_PRINTED` | No secrets printed. |

Stage 0N resource boundary evidence update: the Abacus-managed public domain and SuperComputer/App Shell resource boundaries are clarified. This table does not approve deployment, runtime start, migrations, `prisma db push`, production resources, external custom-domain changes or reuse of Phase 1 secrets.

| Item | Stage 0N status | Redacted reference |
|---|---|---|
| Audit verdict | `PARTIALLY_CONFIRMED_APP_SHELLS_FOUND` | User-provided Abacus Resource Boundary and App Shell Inventory Audit. |
| SuperComputer/cloud ID | `CONFIRMED` | `151e3ee5ff` |
| OIS NextGen Abacus-managed public domain | `CONFIRMED` | `https://ois-nextgen.abacusai.cloud` |
| Domain wording | `CONFIRMED` | Use "Abacus-managed public domain". |
| Current domain status | `CONFIRMED` | Static `READY` page; no app deployed yet. |
| Active nginx vhost | `CONFIRMED` | Only `default.conf`. |
| User-deployed systemd services | `CONFIRMED_NONE` | None. |
| GitHub integration | `CONFIRMED` | Connected to `luciferdmp832016-rgb`. |
| Repo state | `SESSION_DEPENDENT` | `/home/ubuntu/ois-nextgen` not present in audit VM session; always preflight clone/pull. |
| OIS NextGen database | `CONFIRMED_SAFE_STAGING` | `default`, active, empty, 0 tables. |
| OIS NextGen storage | `CONFIRMED_SAFE_STAGING` | S3 prefix `59543/`, empty. |
| OIS Phase 1 App Shell | `CONFIRMED_DO_NOT_TOUCH` | `oisys.abacusai.app`, `ois.dmp247.com`, live Next.js app. |
| OIS Phase 1 database | `DO_NOT_TOUCH` | `ois_phase1_dev` |
| OIS Phase 1 storage | `DO_NOT_TOUCH` | Inferred prefix `52067/` |
| Emerald/BQL database | `DO_NOT_TOUCH` | `emerald_bql_web_dev` |
| Emerald/BQL storage | `DO_NOT_TOUCH` | Inferred prefix `49816/` |
| PITS current placement | `PRODUCT_BOUNDARY_RISK` | PITS is bundled inside OIS Phase 1 shell. |
| Next deployment path | `CONTRACT_READY` | Stage 0O SuperComputer nginx + systemd Core API staging POC. |

Stage 0O managed-domain Core API health evidence update: Core API `/health` is now verified on the Abacus-managed public staging domain. This table records non-secret evidence only and does not approve DB/storage-backed behavior, migrations, `prisma db push`, real AI providers, Console deployment, PITS deployment or production resources.

| Item | Stage 0O status | Redacted reference |
|---|---|---|
| Abacus execution branch | `CONFIRMED` | `stage-0b-complete-handoff-ingestion` |
| Abacus execution commit | `CONFIRMED` | `cc7ed28704c9e804385f6d2a4c21e8d887a775e3` |
| Package deployed | `CONFIRMED_CORE_API_ONLY` | `@ois/core-api`, path `apps/core-api`. |
| Framework | `CONFIRMED` | Fastify. |
| Runtime entrypoint | `CONFIRMED` | `pnpm start` via `tsx src/server.ts`. |
| Install | `CONFIRMED` | `pnpm install --frozen-lockfile` passed; Prisma client generation only. |
| systemd service | `CONFIRMED` | `/etc/systemd/system/ois-nextgen-core-api.service`, enabled at boot and active/running. |
| systemd env file | `CONFIRMED_REDACTED` | `/home/ubuntu/ois-nextgen/.env`; gitignored; no values recorded. |
| nginx vhost | `CONFIRMED` | `/etc/nginx/conf.d/ois-nextgen.conf`; `sudo nginx -t` passed. |
| nginx routes | `CONFIRMED` | `/health`, `/api/` and `/` proxy to `127.0.0.1:4000`. |
| Local health | `CONFIRMED` | `http://127.0.0.1:4000/health` returned HTTP 200. |
| Public managed-domain health | `CONFIRMED` | `https://ois-nextgen.abacusai.cloud/health` returned HTTP/2 200. |
| Health payload | `CONFIRMED` | `status=ok`, `service=core-api`, `stage=bootstrap-stage-a`. |
| OIS Console runtime | `CONFIRMED_NOT_STARTED` | Not deployed in Stage 0O. |
| PITS runtime | `CONFIRMED_NOT_STARTED` | Not deployed in Stage 0O. |
| Worker runtime | `CONFIRMED_NOT_STARTED` | Not deployed in Stage 0O. |
| DB-backed functionality | `CONFIRMED_NOT_ENABLED` | No database connection and no DB-backed endpoints called. |
| Storage-backed functionality | `CONFIRMED_NOT_ENABLED` | No real storage values and no storage-backed endpoints called. |
| AI/OpenRouter real key | `CONFIRMED_NOT_USED` | `OPENROUTER_API_KEY` empty; mock-safe env only. |
| `DATABASE_URL` | `CONFIRMED_ABSENT` | Not present in VM env for Stage 0O. |
| `ABACUS_DATABASE_URL` | `CONFIRMED_ABSENT` | Not present in VM env for Stage 0O. |
| Migrations | `CONFIRMED_NOT_RUN` | No migrations. |
| `prisma db push` | `CONFIRMED_NOT_RUN` | Not used. |
| External custom domains | `CONFIRMED_NOT_TOUCHED` | `ois.dmp247.com` untouched. |
| OIS Phase 1 | `CONFIRMED_NOT_TOUCHED` | `oisys.abacusai.app` and `ois_phase1_dev` untouched. |
| Emerald/BQL | `CONFIRMED_NOT_TOUCHED` | `emerald_bql_web_dev` untouched. |
| Rollback | `CONFIRMED_DOCUMENTED` | Stop/disable service, remove service/vhost, reload nginx; expected domain reverts to `READY`. |

## Required Readiness Summary

| Area | Required for POC | Optional for first POC | Safe handoff format |
|---|---|---|---|
| DB | Staging-only `DATABASE_URL`, or confirmed mock DB mode. | Demo seed approval. | Secret name/private path and redacted evidence only. |
| Storage | `STORAGE_PROVIDER=mock` confirmed in Abacus. | Staging storage credentials after tests are approved. | Mode checkbox or secret names/private paths only. |
| AI | `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock`. | Non-production OpenRouter key. | Non-secret env values or secret name/private path only. |
| Abacus identifiers | Staging project and split service/app/task IDs. | Owner-private screenshots or links. | IDs/names that are clearly staging-only. |
| Env/secrets injection | Verified Abacus staging UI/agent path. | Separate owner runbook link. | Path description, not values. |
| Staging URLs | Core API, Console and PITS staging URLs. | Preview aliases. | Public staging URL or redacted placeholder. |
| Runtime entrypoint | Build/start commands and port behavior confirmed. | Dynamic port adaptation decision. | Checkbox plus notes. |
| DB operations approval | `pnpm db:migrate` approval for staging only. | Demo-only `pnpm db:seed` approval. | Owner/date checkbox. |

Stage 0O readiness additions:

| Area | Required for Stage 0O | Safe handoff format |
|---|---|---|
| Source checkout | Repo cloned/pulled in current VM session. | Commit SHA and clean-tree evidence. |
| systemd service | Core API-only user service. | Service name and redacted unit path. |
| nginx vhost | OIS NextGen-only vhost for `ois-nextgen.abacusai.cloud`. | vhost filename and redacted config excerpt. |
| Domain target | `https://ois-nextgen.abacusai.cloud/health` returns HTTP 200. | HTTP status evidence only. |
| Resource boundary | `default` DB and `59543/` are the only allowed NextGen staging resources. | Confirmation checklist, no secret values. |

## 1. Staging Database

Required decision:

- [ ] Staging DB is provisioned and is not production.
- [ ] Staging DB is not connected to production data.
- [ ] Secret value will be entered only in Abacus or an approved private secret manager.
- [ ] `DATABASE_URL` will be available to the Core API runtime.
- [ ] If `ABACUS_DATABASE_URL` is used, the owner confirms it is mapped to `DATABASE_URL` before Prisma commands run.
- [ ] No `prisma db push` will be used.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| DB mode | Yes | `<staging-postgres | mock-db-mode>` |
| Secret name exposed to runtime | Yes | `DATABASE_URL` |
| Private secret-manager path | Yes if managed outside Abacus | `<private-secret-path-without-value>` |
| Redacted DB identifier | Yes | `<staging-db-host-or-db-name-without-credentials>` |
| Schema | Yes | `public` or `<staging-schema>` |
| Staging-only proof | Yes | `<private-evidence-reference>` |
| Migration approval owner | Yes | `<owner-name-or-role>` |
| Migration approval date | Yes | `<YYYY-MM-DD>` |
| Seed approval | Optional | `<approved | denied | deferred>` |

Approval:

- [ ] Owner approves `pnpm db:migrate` against the staging DB only.
- [ ] Owner approves demo-only `pnpm db:seed` against the staging DB.
- [ ] Owner defers `pnpm db:seed`; POC must not seed data.

## 2. Storage Or Mock Mode

Required decision:

- [ ] First POC uses `STORAGE_PROVIDER=mock`.
- [ ] No production storage bucket, endpoint, access key or secret key is used.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Storage mode | Yes | `mock` |
| `STORAGE_PROVIDER` | Yes | `mock` |
| Storage credential use | Yes | `none for first POC` |
| Staging-only proof | Yes | `<private-evidence-reference>` |

Optional future storage fields, only after storage tests are approved:

| Field | Required | Redacted owner value |
|---|---|---|
| `ABACUS_STORAGE_BUCKET` secret name/path | Optional | `<private-secret-path-without-value>` |
| `ABACUS_STORAGE_ENDPOINT` secret name/path | Optional | `<private-secret-path-without-value>` |
| `ABACUS_STORAGE_ACCESS_KEY` secret name/path | Optional | `<private-secret-path-without-value>` |
| `ABACUS_STORAGE_SECRET_KEY` secret name/path | Optional | `<private-secret-path-without-value>` |

## 3. AI / OpenRouter Or Mock Mode

Required decision:

- [ ] First POC uses `AI_PROVIDER=mock`.
- [ ] First POC uses `AI_PROVIDER_MODE=mock`.
- [ ] `OPENROUTER_API_KEY` is unset for the first POC.
- [ ] No production or paid OpenRouter key is used.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| `AI_PROVIDER` | Yes | `mock` |
| `AI_PROVIDER_MODE` | Yes | `mock` |
| `OPENROUTER_API_KEY` | Required to be unset for first POC | `<unset>` |
| Non-production key proof | Optional | `<private-evidence-reference>` |

Optional future AI key fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Non-production AI key secret name/path | Optional | `<private-secret-path-without-value>` |
| Budget cap | Optional | `<non-production-budget-cap>` |
| Approved model names | Optional | `<non-production-model-list>` |

## 4. Abacus Staging Identifiers

Required decision:

- [ ] Project is `OIS NextGen Staging`.
- [ ] Core API staging app/service ID is known.
- [ ] OIS Console staging app/service ID is known.
- [ ] PITS Shell staging app/service ID is known.
- [ ] Deployment task/chat/agent identifiers are staging-only if Abacus requires them.
- [ ] No production Abacus app, project or task is mutated.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Abacus staging project name | Yes | `OIS NextGen Staging` |
| Abacus staging project ID | Yes | `<staging-project-id>` |
| Core API app/service name | Yes | `ois-nextgen-core-api-staging` |
| Core API app/service ID | Yes | `<staging-core-api-service-id>` |
| OIS Console app/service name | Yes | `ois-nextgen-console-staging` |
| OIS Console app/service ID | Yes | `<staging-console-service-id>` |
| PITS Shell app/service name | Yes | `ois-nextgen-pits-staging` |
| PITS Shell app/service ID | Yes | `<staging-pits-service-id>` |
| Abacus AI Agent task/chat ID | Required if used for deploy config | `<staging-agent-task-or-chat-id>` |
| Staging-only proof | Yes | `<private-evidence-reference>` |

## 5. Env / Secrets Injection Path

Required decision:

- [ ] Owner can configure non-secret environment variables for each staging service.
- [ ] Owner can configure secrets for the Core API staging service.
- [ ] The path is staging-only and does not expose values in repository, Codex, GitHub logs or public screenshots.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Injection method | Yes | `<Abacus UI | Abacus AI Agent | approved owner-run path>` |
| UI/agent path description | Yes | `<staging-only-path-description>` |
| Owner role with access | Yes | `<owner-role>` |
| Secrets visibility policy | Yes | `<masked | write-only | private-manager>` |
| Audit/evidence reference | Yes | `<private-evidence-reference>` |

Required non-secret values:

| Variable | Required value |
|---|---|
| `APP_ENV` | `staging` |
| `DEPLOY_TARGET` | `abacus-staging` |
| `ABACUS_ENV` | `staging` |
| `AI_PROVIDER` | `mock` |
| `AI_PROVIDER_MODE` | `mock` |
| `STORAGE_PROVIDER` | `mock` |
| `DEPLOYMENT_VERSION_ENABLED` | `false` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

Required secret names:

| Variable | Required for | Value handling |
|---|---|---|
| `DATABASE_URL` | Core API | Enter value in Abacus/private manager only. |
| `JWT_SECRET` | Core API if auth/session code requires it | Enter value in Abacus/private manager only. |
| `SESSION_SECRET` | Core API/frontend if session code requires it | Enter value in Abacus/private manager only. |
| `ABACUS_APP_ID` | Service identification if Abacus requires it | Enter value in Abacus/private manager only. |
| `ABACUS_PUBLIC_APP_URL` | Public staging URL mapping if Abacus requires it | Public URL or private manager path. |

## 6. Staging URLs

Required decision:

- [ ] Core API staging URL exists.
- [ ] OIS Console staging URL exists.
- [ ] PITS Shell staging URL exists.
- [ ] URLs are staging-only and do not route to production.

Safe fields:

| Service | Required | Redacted owner value |
|---|---|---|
| Core API URL | Yes | `https://<abacus-core-api-staging>` |
| OIS Console URL | Yes | `https://<abacus-console-staging>` |
| PITS Shell URL | Yes | `https://<abacus-pits-staging>` |
| Shared public app URL | Optional | `https://<abacus-public-staging>` |
| Staging-only proof | Yes | `<private-evidence-reference>` |

## 7. Runtime Entrypoint And Port Behavior

Required split-app commands:

| Service | Build command | Start command | Health check |
|---|---|---|---|
| Core API | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build` | `pnpm --filter @ois/core-api start` | `/health` |
| OIS Console | `pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` | `pnpm --filter @ois/ois-console start` | `/` |
| PITS Shell | `pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` | `pnpm --filter @ois/pits-shell start` | `/` |

Required decision:

- [ ] Abacus accepts the split-app topology.
- [ ] Abacus supports the listed build/start commands.
- [ ] Abacus supports Core API `CORE_API_HOST` and `CORE_API_PORT`, or provides a documented dynamic port behavior.
- [ ] Abacus supports the current Next.js start commands for Console and PITS, or a future config-only port adaptation is approved before POC.

Safe fields:

| Field | Required | Redacted owner value |
|---|---|---|
| Runtime model | Yes | `<three services | one project with three services>` |
| Dynamic `PORT` provided by Abacus | Yes | `<yes | no | unknown>` |
| Core API port setting | Yes | `<CORE_API_PORT value or dynamic PORT mapping>` |
| Console port behavior | Yes | `<fixed 3000 | dynamic PORT mapping | needs future change>` |
| PITS port behavior | Yes | `<fixed 3001 | dynamic PORT mapping | needs future change>` |
| Build command support proof | Yes | `<private-evidence-reference>` |
| Start command support proof | Yes | `<private-evidence-reference>` |

If dynamic `PORT` is required and the current scripts cannot consume it, stop. A future config-only branch must adapt runtime start scripts before any staging POC.

## 8. Final Owner Approval

All required checkboxes below must be checked before a future stage can run the minimum safe staging runtime POC.

- [ ] I reviewed the Stage 0H Abacus staging runtime handoff package.
- [ ] I confirm the first Abacus POC scope excludes DB-backed endpoints unless staging DB approval is separately granted.
- [ ] I confirm every provided input is staging-only.
- [ ] I confirm no production database, storage bucket, OpenRouter key, Abacus app, Abacus project or Abacus task is used.
- [ ] I confirm all secret values are stored only in Abacus or an approved private secret manager.
- [ ] I confirm no real secret values are committed to this repository.
- [ ] I approve `pnpm db:migrate` only against the confirmed staging DB.
- [ ] I approve demo-only `pnpm db:seed`, or I explicitly marked seed as deferred above.
- [ ] I approve a future Stage 0F runtime POC only after this checklist is reviewed and all required rows are complete.

Owner signoff:

| Field | Redacted owner value |
|---|---|
| Owner name or role | `<owner-name-or-role>` |
| Approval date | `<YYYY-MM-DD>` |
| Private evidence location | `<private-evidence-reference>` |
| Notes | `<redacted-notes>` |

## Stop Conditions

Do not deploy if any of these are true:

- Any required checkbox is incomplete.
- Any secret value appears in a document, pull request, issue, chat transcript or log.
- Any input points to production or cannot be proven staging-only.
- Abacus env/secrets/deploy configuration remains inaccessible.
- The staging database is missing or not approved for migrations.
- `STORAGE_PROVIDER=mock` is not confirmed and staging storage tests are not approved.
- `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock` are not confirmed and no non-production AI key is approved.
- Abacus runtime requires dynamic `PORT` behavior that the current scripts do not support.
- Owner signoff is missing.
