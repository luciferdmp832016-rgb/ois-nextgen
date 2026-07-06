# Abacus Staging Deploy

Stage 0F defines the first safe staging path. Use staging/demo data only.

## Recommended Topology

Use split app staging unless Abacus explicitly supports one app supervising three public Node processes.

| Service | Build command | Start command | Health check |
|---|---|---|---|
| Core API | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build` | `pnpm --filter @ois/core-api start` | `/health` |
| OIS Console | `pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` | `pnpm --filter @ois/ois-console start` | `/` |
| PITS Shell | `pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` | `pnpm --filter @ois/pits-shell start` | `/` |

Recommended service names:

- `ois-nextgen-core-api-staging`
- `ois-nextgen-console-staging`
- `ois-nextgen-pits-staging`

Use the same release ref for all three services.

## Prerequisites

- CI green on the release ref.
- Release preflight green on the same ref.
- Abacus staging app exists.
- Abacus staging project access is sufficient to configure environment values, secrets and deployment settings.
- Abacus staging database and storage are provisioned.
- Production credentials are absent.
- Deployment manifest draft is complete.

Stage 0F-R2 discovery result: these prerequisites are not yet satisfied from Codex. Access to the `OIS NextGen Staging` project is partial, but staging env/secrets/deploy configuration, service identifiers, staging URLs, staging database, staging storage or mock mode, and staging AI mock values are still unknown.

Stage 0F-R3 owner acquisition package: complete `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` with staging-only confirmations, secret names/private paths and approvals before any staging runtime POC is attempted. Do not commit real secret values.

Stage 0F-R4 discovery result: repo/local verification confirms the expected env var names, split-app package scripts, `.env.example`, mock AI/storage defaults and Prisma `DATABASE_URL` contract. It does not confirm owner-filled staging values, Abacus project/service IDs, env/secrets injection, staging URLs, SuperComputer/cloud evidence, Always On status, GitHub connection status or Abacus port behavior. The runtime POC remains blocked.

Stage 0H handoff result: the Abacus staging runtime handoff package is documented in `architecture/implementation/STAGE_0H_ABACUS_STAGING_RUNTIME_HANDOFF.md`. Use it as the no-deploy source of truth for the first Abacus staging POC. The handoff is ready, but Abacus owner inputs remain blocked.

Stage 0I discovery result: Abacus live runtime configuration remains blocked. No Abacus connector, CLI, authenticated UI, screenshots or owner-filled checklist were available in Stage 0I. Treat project ID, SuperComputer/cloud ID, public URL, GitHub/source state, service IDs, env/secrets mechanism, live mock config and port/proxy behavior as unknown until owner evidence is provided.

Stage 0I-R1 owner-assisted source result: GitHub/source bootstrap is confirmed on Abacus SuperComputer. The repo is cloned at `/home/ubuntu/ois-nextgen`, `origin` points to `https://github.com/luciferdmp832016-rgb/ois-nextgen.git`, branch `stage-0b-complete-handoff-ingestion` is checked out at commit `64486c1ebf9d5bc96cadc8220d1616dea9ccbf70`, and the working tree is clean/up to date. No `pnpm install`, build, app start, migration, `prisma db push` or secret printing occurred. Runtime port/proxy behavior, env/secrets injection and public URL mapping remain unknown, so the runtime POC remains blocked.

Stage 0J Core API only POC result: Abacus Agent verified the VM can install, lint, typecheck, test, build and start the Core API locally with mock-safe configuration. Core API `/health` and `/` returned HTTP 200 on `127.0.0.1:4000`, then the process was stopped and port 4000 was clear. `https://ois-nextgen.abacusai.cloud/health` returned HTTP 404 from cloudflare/nginx because no public deployment/routing was performed. Public URL routing remains blocked; this is not a Core API boot failure.

Stage 0K preview public routing result: Abacus Agent verified public health through the Abacus VM preview proxy. Core API was bound to `0.0.0.0:4000`; local `http://127.0.0.1:4000/health` and preview `https://7a162f29d-4000.na116.preview.abacusai.app/health` both returned HTTP 200. The hosted-app custom domain `https://ois-nextgen.abacusai.cloud/health` still returned HTTP 404 because it requires an actual Abacus hosted-app deployment or Always-On app. Preview routing is suitable for controlled public POC evidence, not final live hosting.

Stage 0L hosted-app custom domain result: Abacus Agent confirmed the custom domain cannot be mapped to Core API from the VM shell alone. No `abacus`/`abacusai` deploy CLI exists on `PATH`, and observed Abacus SDK deploy paths are for ML models/agents rather than a generic Node/Fastify web-service hosted-app deploy. `https://ois-nextgen.abacusai.cloud/` returns HTTP 200 body `READY` from the Abacus edge placeholder, while `https://ois-nextgen.abacusai.cloud/health` returns HTTP 404 because no backend hosted app is mapped. Owner-assisted Abacus hosted-app service registration is required.

Stage 0N resource boundary contract: `https://ois-nextgen.abacusai.cloud` is the Abacus-managed public domain for the OIS NextGen SuperComputer/App Shell. Codex/GitHub is the engineering/test plane. Abacus SuperComputer is the staging VM/App Shell plane with nginx, systemd, SSH, GitHub integration, attached `default` DB and S3 prefix `59543/`. VM preview proxy URLs remain temporary. External `dmp247.com` custom domains are optional branding/publication layers and must not be touched until NextGen is validated.

Stage 0O managed-domain Core API health result: Abacus Agent verified the first SuperComputer nginx/systemd staging slice. `@ois/core-api` runs under systemd, nginx proxies the Abacus-managed public staging domain to `127.0.0.1:4000`, and `https://ois-nextgen.abacusai.cloud/health` returns HTTP/2 200 with the Core API health payload. Console, PITS and worker were not started. DB-backed functionality, storage-backed functionality and real AI/OpenRouter usage remain disabled.

Stage 0P default DB Prisma baseline result: Abacus Agent verified readiness label `DEFAULT_DB_PRISMA_READINESS_CONFIRMED`, then applied migration `202607040001_platform_kernel` to the `default` DB only with `pnpm db:migrate`, which maps to `prisma migrate deploy`. Final verdict is `DEFAULT_DB_PRISMA_BASELINE_APPLIED`; Abacus execution label is `DEFAULT_DB_MIGRATION_APPLIED_SUCCESS`. `https://ois-nextgen.abacusai.cloud/platform/overview` now returns HTTP 200 as the first DB-backed read-only public staging endpoint. Counts are 0 because no seed data exists yet. Console, PITS, worker, `/auth/demo-login`, write endpoints and custom `dmp247.com` domains remain out of scope.

Stage 0Q Platform Kernel seed result: Abacus Agent verified readiness label `PLATFORM_KERNEL_SEED_SCRIPT_READY`, then executed `pnpm db:seed`, which maps to `prisma db seed -> tsx prisma/seed.ts`. Final result is `PLATFORM_KERNEL_SEED_APPLIED`. The seed populated 66 `DEMO DATA - NOT PRODUCTION` records across all 18 application tables in the `default` DB. `https://ois-nextgen.abacusai.cloud/platform/overview` remains HTTP 200 and now returns seeded Platform Kernel counts. `PLATFORM_KERNEL` remains `IN_PROGRESS` by API-controlled logic, which is expected. Console, PITS, worker, `/auth/demo-login`, write endpoints and custom `dmp247.com` domains remain out of scope.

Stage 0R-A Platform Kernel gate smoke stabilization result: local code inspection confirms `/platform/overview` is read-only, uses eight Prisma `count()` queries, and returns `phaseGates.PLATFORM_KERNEL` as a hardcoded API response literal `IN_PROGRESS`. The gate is not count-driven, config-driven, feature-flag-driven or manually DB-controlled. This is correct for Stage 0Q/0R-A, but focused tests for overview counts, gate behavior, no-DB health and legacy/prod reference guards are required before gate advancement. Final result is `PLATFORM_KERNEL_TEST_COVERAGE_REQUIRED`.

Published endpoint registry: use `docs/deployment/PUBLISHED_ENDPOINT_REGISTRY.md` as the persistent source of truth for local, Codex Cloud, Abacus VM local, preview proxy, Abacus-managed public staging, legacy production/do-not-touch and future planned endpoints. Every future stage report must include a Published Endpoint Delta section covering added, changed, unchanged, deprecated/stopped, do-not-touch and current test checklist entries.

## Stage 0H Handoff Summary

Initial Abacus POC scope must reproduce the Stage 0G mock-safe boot only:

| Service | Build command | Start command | Port | Healthcheck |
|---|---|---|---:|---|
| Core API | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build` | `pnpm --filter @ois/core-api start` | 4000 | `/health` |
| OIS Console | `pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` | `pnpm --filter @ois/ois-console start` | 3000 | `/` |
| PITS Shell | `pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` | `pnpm --filter @ois/pits-shell start` | 3001 | `/` |

Initial POC exclusions:

- Do not call DB-backed endpoints.
- Do not run `pnpm db:migrate` unless a staging-only DB and owner approval are confirmed.
- Do not run `pnpm db:seed` unless demo-only staging seed approval is confirmed.
- Do not use OpenRouter or storage runtime credentials; keep AI and storage mock-only.
- Do not deploy to production or use production values.

Stage 0I go/no-go remains blocked until the following are confirmed with redacted staging-only evidence:

- Abacus project ID and SuperComputer/cloud ID.
- GitHub connection or cloned repo path, branch and commit.
- Core API, OIS Console and PITS service/task IDs.
- Env/secrets injection path with names only and values hidden.
- `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`, `STORAGE_PROVIDER=mock`, and no production OpenRouter key.
- Public staging URLs and healthcheck path configuration.
- Fixed port or proxy behavior for 4000, 3000 and 3001, or a split-app equivalent.

Stage 0I-R1 recommendation for Stage 0J: perform a Core API only POC first, using mock-safe env only. Do not call DB-backed endpoints, storage-backed endpoints or real AI/OpenRouter providers. Confirm local HTTP 200 at `127.0.0.1:4000/health` before trying any public URL `/health` mapping. Stop if Abacus requires production credentials, migrations, `prisma db push`, secret printing or an unconfirmed port/proxy path.

Stage 0J outcome and Stage 0K direction: keep the next POC Core API only and solve public routing/deployment mapping. Do not expand to Console, PITS, DB-backed endpoints, storage-backed endpoints or real AI providers until the public Core API `/health` route is mapped safely.

Stage 0J mock-safe Core API start command used by Abacus:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_* \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test LOCALHOST_REQUIRED=false \
  AI_PROVIDER=mock AI_PROVIDER_MODE=mock OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=127.0.0.1 CORE_API_PORT=4000 CORE_API_URL=http://127.0.0.1:4000 \
  NEXT_TELEMETRY_DISABLED=1 \
  pnpm --filter @ois/core-api start
```

Stage 0K preview proxy conclusion: for VM preview checks, bind Core API to `0.0.0.0:4000` and use the Abacus preview hostname with the `-4000` suffix. For hosted-app/custom-domain checks, do not expect `https://ois-nextgen.abacusai.cloud/health` to work until a controlled hosted-app deployment or Always-On app is configured.

Stage 0K mock-safe Core API start command used by Abacus:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_ENDPOINT -u ABACUS_STORAGE_ACCESS_KEY -u ABACUS_STORAGE_SECRET_KEY \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test LOCALHOST_REQUIRED=false \
  AI_PROVIDER=mock AI_PROVIDER_MODE=mock OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=0.0.0.0 CORE_API_PORT=4000 CORE_API_URL=http://0.0.0.0:4000 NEXT_TELEMETRY_DISABLED=1 \
  pnpm --filter @ois/core-api start
```

Recommended Stage 0L direction: Abacus Hosted-App Core API Deployment / Custom Domain POC. Keep Core API only, keep mock-safe env, avoid DB/storage-backed endpoints and real AI providers, and verify whether `https://ois-nextgen.abacusai.cloud/health` maps to the hosted Core API only after the hosted-app deployment path is configured.

Stage 0L conclusion and Stage 0M direction: do not keep trying to bind the custom domain from the VM shell. Register a Core API hosted app/service through Abacus platform/console owner assistance, then map `https://ois-nextgen.abacusai.cloud/health` to that hosted backend. Keep the topology Core API only, mock-safe, no DB/storage/AI, healthcheck `/health`, port `4000` or platform-required `PORT`, and Always On only for the single Core API service with owner approval.

Stage 0L mock-safe Core API start command used during investigation:

```sh
env -u DATABASE_URL -u ABACUS_DATABASE_URL -u ABACUS_STORAGE_* \
  APP_ENV=codex-cloud-test DEPLOY_TARGET=codex-cloud-test \
  LOCALHOST_REQUIRED=false AI_PROVIDER=mock AI_PROVIDER_MODE=mock \
  OPENROUTER_API_KEY= STORAGE_PROVIDER=mock \
  CORE_API_HOST=0.0.0.0 CORE_API_PORT=4000 \
  pnpm --filter @ois/core-api start
```

Stage 0N deployment pivot: the safer immediate path is SuperComputer nginx + systemd on the Abacus-managed public domain. Stage 0O should deploy Core API only behind nginx/systemd and target `https://ois-nextgen.abacusai.cloud/health` HTTP 200. The initial Stage 0O POC must remain mock-safe, must not call DB-backed or storage-backed endpoints, must not run migrations, and must not use `prisma db push`.

Stage 0O result: Core API `/health` is verified on the Abacus-managed public staging domain. Continue to treat this as Core API-only staging health, not full product deployment.

Stage 0P result: the `default` DB Prisma baseline is applied and `/platform/overview` is verified as the first DB-backed read-only public staging endpoint. Recommended next stage: Stage 0Q - Platform Kernel Seed / DB-backed Smoke Stabilization.

Stage 0Q result: Platform Kernel demo/staging seed data is applied to the `default` DB and `/platform/overview` is verified with seeded counts. Recommended next stage: Stage 0R - Platform Kernel Gate Logic / DB-backed Smoke Stabilization.

Stage 0R-A result: Platform Kernel gate logic is confirmed as intentionally not count-driven, and no endpoint delta occurred. Recommended next stage: Stage 0R-B - Platform Kernel Gate and Overview Test Coverage.

## Stage 0N Resource Boundaries

| Resource | Contract |
|---|---|
| OIS NextGen public staging surface | `https://ois-nextgen.abacusai.cloud` Abacus-managed public domain. |
| OIS NextGen database | `default` only; attached, active, empty and safe for staging. |
| OIS NextGen storage | S3 numeric prefix `59543/` only; attached and empty. |
| OIS Phase 1 App Shell | `oisys.abacusai.app` and `ois.dmp247.com`; do not touch. |
| OIS Phase 1 database/storage | `ois_phase1_dev` and inferred prefix `52067/`; do not touch. |
| Emerald/BQL database/storage | `emerald_bql_web_dev` and inferred prefix `49816/`; do not touch. |
| Secrets | Create fresh OIS NextGen staging secrets. Never reuse Phase 1 JWT, DB, Redis, MinIO or Neo4j secrets. |
| Repo state | Session-dependent; always preflight clone/pull before deployment work. |

## Stage 0O Gate And Result

Stage 0O is SuperComputer Nginx/Systemd Core API Staging Deploy POC.

Required constraints:

- Core API only first.
- Mock-safe env only.
- No DB-backed endpoints.
- No storage-backed endpoints.
- No real AI/OpenRouter provider.
- No migrations.
- No `prisma db push`.
- User-deployed systemd service scoped to Core API only.
- nginx vhost scoped to OIS NextGen only.
- Target health: `https://ois-nextgen.abacusai.cloud/health` returns HTTP 200.
- Do not touch `ois.dmp247.com`, `oisys.abacusai.app`, `ois_phase1_dev`, `emerald_bql_web_dev`, `49816/` or `52067/`.

Stage 0O verified result:

| Area | Evidence |
|---|---|
| Package | `@ois/core-api` from `apps/core-api`. |
| Abacus VM commit | `cc7ed28704c9e804385f6d2a4c21e8d887a775e3`. |
| Install | `pnpm install --frozen-lockfile` passed in 24s; Prisma client generation only. |
| systemd service | `/etc/systemd/system/ois-nextgen-core-api.service`, enabled at boot and active/running. |
| nginx vhost | `/etc/nginx/conf.d/ois-nextgen.conf`; `sudo nginx -t` passed. |
| Local health | `http://127.0.0.1:4000/health` returned HTTP 200. |
| Public health | `https://ois-nextgen.abacusai.cloud/health` returned HTTP/2 200 via Cloudflare/Envoy. |
| Exclusions | Console, PITS and worker not started; no DB-backed endpoints, storage-backed endpoints, migrations, `prisma db push` or real credentials. |

Stage 0O VM env names, values redacted or omitted:

| Key | Contract |
|---|---|
| `APP_ENV` | Runtime env key only; value kept on VM. |
| `DEPLOY_TARGET` | Runtime env key only; value kept on VM. |
| `LOCALHOST_REQUIRED` | Runtime env key only; value kept on VM. |
| `AI_PROVIDER` | Mock-safe. |
| `AI_PROVIDER_MODE` | Mock-safe. |
| `OPENROUTER_API_KEY` | Empty. |
| `STORAGE_PROVIDER` | Mock-safe. |
| `CORE_API_HOST` | Runtime env key only; value kept on VM. |
| `CORE_API_PORT` | Port `4000`. |
| `CORE_API_URL` | Runtime env key only; value kept on VM. |
| `NEXT_TELEMETRY_DISABLED` | Runtime env key only; value kept on VM. |
| `DATABASE_URL` | Absent. |
| `ABACUS_DATABASE_URL` | Absent. |

Stage 0O rollback:

```sh
sudo systemctl stop ois-nextgen-core-api
sudo systemctl disable ois-nextgen-core-api
sudo rm /etc/systemd/system/ois-nextgen-core-api.service
sudo systemctl daemon-reload
sudo rm /etc/nginx/conf.d/ois-nextgen.conf
sudo nginx -t && sudo systemctl reload nginx
```

Expected rollback result: `https://ois-nextgen.abacusai.cloud` reverts to the default `READY` page.

## Stage 0P Default DB Prisma Baseline

Stage 0P-A readiness facts:

| Area | Evidence |
|---|---|
| Prisma schema | `/home/ubuntu/ois-nextgen/prisma/schema.prisma`, provider `postgresql`. |
| DB env var | `DATABASE_URL`. |
| Existing migration | `202607040001_platform_kernel`, creating 18 tables, 36 indexes and 5 enum types. |
| Target DB | `default`, DB ID/name `2c30a48b7`; empty with 0 tables before migration. |
| Correct command | `pnpm db:migrate`, mapping to `prisma migrate deploy`. |
| Forbidden command | `prisma db push` was not required and must not be used. |

Stage 0P-B execution facts:

| Area | Evidence |
|---|---|
| Backup | `/home/ubuntu/ois-nextgen/.abacus-backups/default_schema_pre_0p_b_20260706_023524.sql`, 728 B and 27 lines. |
| Migration command | `pnpm db:migrate`; exit code 0. |
| Applied migration | `202607040001_platform_kernel`. |
| Migration status | Database schema is up to date. |
| Post-migration schema | 19 tables: 18 domain tables plus `_prisma_migrations`; 55 public indexes; 5 enum types. |
| Runtime env | `DATABASE_URL` added to VM `.env`; value not printed, `.env` not committed. |
| Service restart | `sudo systemctl restart ois-nextgen-core-api` succeeded; service active/running with Main PID `5754`. |
| nginx | Unchanged and active. |
| Public DB-backed check | `https://ois-nextgen.abacusai.cloud/platform/overview` returned HTTP 200 after 8 live Prisma `count()` queries. |

Stage 0P exclusions:

- No `prisma db push`.
- No `prisma migrate dev`.
- No production database, storage or OpenRouter credentials.
- No secrets or `DATABASE_URL` value printed.
- No `.env` committed.
- No row data inspected.
- No seed data created.
- No `/auth/demo-login` call.
- No write endpoints called.
- No OIS Console, PITS Shell or worker runtime.
- No custom `dmp247.com` domain changes.
- No legacy DB, legacy domain or legacy storage-prefix touch.

## Stage 0Q Platform Kernel Seed

Stage 0Q-A readiness facts:

| Area | Evidence |
|---|---|
| Seed script | `prisma/seed.ts`. |
| Seed command | `pnpm db:seed`. |
| Command mapping | `prisma db seed -> tsx prisma/seed.ts`. |
| Table coverage | All 18 application tables. |
| Expected total records | 66. |
| Idempotency | Deterministic IDs with `ensureRecord` / `findUnique` -> create if missing -> update if changed. |
| Data label | `DEMO DATA - NOT PRODUCTION`. |
| Stage 0Q-A writes | None. |

Stage 0Q-B execution facts:

| Area | Evidence |
|---|---|
| Seed command | `pnpm db:seed`; exit code 0. |
| Output summary | `DEMO DATA - NOT PRODUCTION`; `The seed command has been executed.` |
| Stderr | Non-blocking Prisma 7 deprecation notice about `package.json#prisma` config. |
| Second seed run | Not performed. |
| Public DB-backed check | `https://ois-nextgen.abacusai.cloud/platform/overview` returned HTTP 200 with seeded Platform Kernel counts. |
| Public health | `https://ois-nextgen.abacusai.cloud/health` remained HTTP 200. |
| Service continuity | `ois-nextgen-core-api.service` remained active and was never interrupted. |

Seeded `/platform/overview` expected counts:

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

`PLATFORM_KERNEL` remains `IN_PROGRESS` because gate advancement is API-controlled logic, not purely count-driven. This is expected.

Stage 0Q backlog note: Prisma emitted a non-blocking Prisma 7 deprecation warning that `package.json#prisma` seed configuration should later migrate to `prisma.config.ts`. Do not fix that in Stage 0Q unless separately planned.

Stage 0Q exclusions:

- No `prisma db push`.
- No `prisma migrate dev`.
- No secrets or `DATABASE_URL` value printed.
- No `.env` committed.
- No second seed run.
- No write HTTP endpoints called.
- No `/auth/demo-login` call.
- No real Phase 1 data imported.
- No OIS Console, PITS Shell or worker runtime.
- No nginx/systemd config modification.
- No legacy DB, legacy domain or legacy storage-prefix touch.

## Stage 0R-A Platform Kernel Gate Smoke Stabilization

Stage 0R-A code inspection facts:

| Area | Finding |
|---|---|
| `/health` | Static no-DB health response. |
| `/platform/overview` | Read-only Core API route using eight Prisma `count()` queries. |
| Counted models | `Industry`, `Organization`, `Workspace`, `Project`, `ProductDefinition`, `ProductInstallation`, `ModuleDefinition`, `AuditRecord`. |
| Writes/side effects | None observed in the route. |
| `PLATFORM_KERNEL` gate | Hardcoded API response literal `IN_PROGRESS`. |
| Count-driven gate | No. Seeded counts do not promote the gate. |
| Config/feature-flag gate | No. The route does not read `FeatureFlag`, `EffectiveConfigurationSnapshot` or environment config for the gate. |
| Missing DB behavior | No route-level fallback for `/platform/overview`; `/health` remains no-DB. |
| Empty DB behavior | Stage 0P verified HTTP 200 with zero counts after migration. |
| Seeded DB behavior | Stage 0Q verified HTTP 200 with seeded counts after seed. |
| Stage 0R-A result | `PLATFORM_KERNEL_TEST_COVERAGE_REQUIRED`. |

Stage 0R-A required follow-up tests:

- Core API `/health` no-DB behavior.
- Core API `/platform/overview` count mapping.
- `phaseGates.PLATFORM_KERNEL=IN_PROGRESS` behavior or later documented promotion rule.
- Empty DB and seeded DB overview behavior.
- Missing/unavailable DB behavior for `/platform/overview`.
- Legacy/prod reference guard for smoke paths.

Stage 0R-A exclusions:

- No Abacus deploy.
- No runtime modification.
- No migration.
- No seed.
- No `prisma db push`.
- No live endpoint probe from the local documentation task.
- No production or legacy resource touch.

## Stage 0F-R2 Readiness Matrix

| Area | Minimum staging-only input | Stage 0F-R2 status |
|---|---|---|
| DB | Staging-only `DATABASE_URL`, or confirmed mock DB mode. | Missing; no staging database URL or mock DB mode was confirmed. |
| Storage | Confirmed `STORAGE_PROVIDER=mock`, or staging-only storage credentials after storage tests are approved. | Missing; Abacus storage/mock configuration remains unknown. |
| AI | Confirmed `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock`, or approved non-production AI key. | Missing; Abacus AI env values remain unknown. |
| Abacus identifiers | Exact project/app/service/task identifiers for the split Core API, Console and PITS services. | Partial; project `OIS NextGen Staging` is known, exact app/service/task IDs are not. |
| Runtime entrypoint | Confirmed split-app build/start commands and port behavior accepted by Abacus. | Partially known from repo scripts, but Abacus runtime and dynamic port behavior remain unknown. |
| Secrets/env injection | Verified Abacus staging UI or agent path for environment values and secrets. | Unknown; no safe injection path was verified. |
| Staging URLs | Staging subdomain/path for Core API, Console and PITS. | Missing. |

Do not execute a staging deployment until every row above is confirmed as staging-only. If any row remains unknown, document the blocker and stop.

## Required Staging Secrets

- `ABACUS_ENV=staging`
- `ABACUS_APP_ID`
- `ABACUS_PUBLIC_APP_URL`
- `ABACUS_DATABASE_URL`
- `ABACUS_STORAGE_BUCKET`
- `ABACUS_STORAGE_ENDPOINT`
- `ABACUS_STORAGE_ACCESS_KEY`
- `ABACUS_STORAGE_SECRET_KEY`

Keep storage secrets unset and `STORAGE_PROVIDER=mock` until staging storage tests are approved.

## Required Non-Secret Variables

- `APP_ENV=staging`
- `DEPLOY_TARGET=abacus-staging`
- `AI_PROVIDER=mock`
- `AI_PROVIDER_MODE=mock`
- `STORAGE_PROVIDER=mock`
- `DEPLOYMENT_VERSION_ENABLED=false`
- `NEXT_TELEMETRY_DISABLED=1`

## Staging Steps

Do not begin these steps until the Stage 0F-R3 checklist is complete and reviewed.
Stage 0F-R4 did not execute these steps.
Stage 0H did not execute these steps.
Stage 0I-R1 did not execute these steps.
Stage 0J executed only a local VM Core API health POC, not a public deployment or full split-app staging POC.
Stage 0K executed only a VM preview proxy Core API health POC, not a hosted-app deployment or full split-app staging POC.
Stage 0L executed hosted-app/custom-domain investigation plus controlled Core API boot only; no hosted app/service was created.
Stage 0N did not execute staging steps; it records the resource boundary and SuperComputer nginx/systemd deployment contract.
Stage 0O executed the Core API-only SuperComputer nginx/systemd staging health POC and verified `https://ois-nextgen.abacusai.cloud/health` HTTP/2 200. It did not execute Console, PITS, worker, DB-backed functionality, storage-backed functionality or real AI/OpenRouter usage.
Stage 0P executed the default DB Prisma baseline on Abacus and verified `https://ois-nextgen.abacusai.cloud/platform/overview` HTTP 200 as a DB-backed read-only endpoint. It did not seed data, call `/auth/demo-login`, call write endpoints, start Console/PITS/worker or touch legacy resources.
Stage 0Q executed the Platform Kernel seed on Abacus and verified `https://ois-nextgen.abacusai.cloud/platform/overview` HTTP 200 with seeded demo/staging counts. It did not call `/auth/demo-login`, call write endpoints, start Console/PITS/worker, modify nginx/systemd or touch legacy resources.
Stage 0R-A performed local code inspection and documentation only. It did not deploy, run runtime, migrate, seed, call endpoints or touch legacy resources.

1. Confirm release ref and commit SHA.
2. Apply Prisma migrations using deploy mode only.
3. Run the idempotent seed only if the staging owner approves demo bootstrap data.
4. Start Core API, OIS Console and PITS Shell.
5. Run smoke tests against Abacus staging URLs.
6. Attach manifest and smoke evidence to the release record.

## Smoke Checks

- Core API `/` returns service identity `ois-nextgen-core-api`.
- Core API `/health` returns `status=ok`.
- Core API `/platform/overview` returns HTTP 200, `DEMO DATA - NOT PRODUCTION` banner and seeded Platform Kernel counts.
- Core API `/docs` renders Swagger UI.
- OIS Console `/` renders `OIS Console`.
- PITS Shell `/` renders `PITS Shell`.

Stage 0J verified only the first two checks locally on `127.0.0.1:4000`; public `/health` still returned 404 until routing/deployment is configured.
Stage 0K verified Core API `/health` publicly through the VM preview proxy at `https://7a162f29d-4000.na116.preview.abacusai.app/health`; the hosted custom domain remains unverified.
Stage 0L confirmed `https://ois-nextgen.abacusai.cloud/` returns edge placeholder `READY`, while `https://ois-nextgen.abacusai.cloud/health` remains HTTP 404 until Abacus platform/console maps a hosted app backend.
Stage 0N pivots the next target to SuperComputer nginx/systemd on the Abacus-managed public domain, with `https://ois-nextgen.abacusai.cloud/health` as the Stage 0O target healthcheck.
Stage 0O verified `https://ois-nextgen.abacusai.cloud/health` returns HTTP/2 200 with the Core API health payload. Core API `/`, `/docs`, Console `/` and PITS `/` remain outside the Stage 0O public managed-domain smoke scope.
Stage 0P verified `https://ois-nextgen.abacusai.cloud/platform/overview` returns HTTP 200 and executes live Prisma reads against the migrated `default` DB. Counts are expected to be 0 until Stage 0Q or a later approved seed stage.
Stage 0Q verified `https://ois-nextgen.abacusai.cloud/platform/overview` returns HTTP 200 with seeded Platform Kernel counts: industries 1, organizations 1, workspaces 1, projects 2, products 5, installations 2, modules 3 and auditRecords 1.
Stage 0R-A did not change endpoints. It confirmed by code inspection that `/platform/overview` is read-only and `PLATFORM_KERNEL` remains `IN_PROGRESS` by hardcoded API logic until a later tested gate rule changes it.

## Stop Conditions

- Missing migration evidence.
- Abacus access is limited to project/chat/task editing and does not expose staging env/secrets/deploy configuration.
- Staging-only mock database mode, mock storage mode, staging subdomain/path or AI provider config is missing.
- Stage 0F-R3 owner checklist is incomplete or contains real secret values.
- Stage 0H go/no-go gate is incomplete.
- Hosted-app port behavior and Console/PITS service port behavior remain unverified.
- Core API managed-domain `/health` returns non-200 after nginx/systemd changes.
- `/platform/overview` returns non-200 after the Stage 0P Prisma baseline or Stage 0Q seed.
- `/platform/overview` gains writes, side effects or legacy/prod resource references.
- `PLATFORM_KERNEL` gate promotion is attempted without a documented rule, focused tests and owner approval.
- Any additional seed execution, `/auth/demo-login`, write endpoint or row-data inspection is attempted without later owner approval.
- A workflow tries to use hosted-app service registration or external custom-domain publication instead of the verified SuperComputer nginx/systemd path without owner approval.
- Any action would touch OIS Phase 1 or Emerald/BQL databases, storage prefixes, app shells or external custom domains.
- Any action would reuse Phase 1 JWT, DB, Redis, MinIO or Neo4j secrets.
- Any production credential appears in CI, Codex or staging logs.
- Any smoke test fails.
- Manual owner sign-off is missing.
