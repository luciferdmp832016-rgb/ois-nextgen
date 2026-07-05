# Stage 0F-R2 Staging Runtime Discovery

Final verdict: `BLOCKED_STAGING_INPUTS`.

## Baseline

| Item | Result |
|---|---|
| Requested branch | `stage-0f-r2-staging-runtime-discovery` |
| Actual branch | `stage-0f-r2-staging-runtime-discovery` |
| Requested base | `main` |
| Actual repository base | `stage-0b-complete-handoff-ingestion`; no local or remote `main` branch is present and `origin/HEAD` points to `stage-0b-complete-handoff-ingestion`. |
| Base commit | `9381490bd1ce5833f471da18923381a81908a17a` |
| Stage 0F-R1 PR | `https://github.com/luciferdmp832016-rgb/ois-nextgen/pull/2` |
| Stage 0F-R1 PR state | Closed and merged. |
| Stage 0F-R1 merge status | Merged into `stage-0b-complete-handoff-ingestion`; production remained untouched. |
| Abacus project | `OIS NextGen Staging` |
| Abacus access | Partial. |
| Selected topology | Split-app staging. |
| Staging runtime POC | Not executed. |

Opening checks:

| Command | Result |
|---|---|
| `git status -sb` | Clean on `stage-0f-r2-staging-runtime-discovery`, tracking `origin/stage-0b-complete-handoff-ingestion`. |
| `git branch --show-current` | `stage-0f-r2-staging-runtime-discovery` |
| `git log -1 --oneline` | `9381490 chore(stage-0f): record abacus partial access check` |
| `git remote show origin` | `HEAD branch: stage-0b-complete-handoff-ingestion`; no tracked `main` branch. |

## Source Of Truth Reviewed

| File | Use |
|---|---|
| `architecture/implementation/IMPLEMENTATION_STATUS.md` | Current gate summary and prior Stage 0F-R1 verdict. |
| `architecture/implementation/PHASE_GATE_REGISTER.md` | Phase gate status and evidence language. |
| `architecture/implementation/STAGE_0F_ABACUS_STAGING_POC.md` | Stage 0F and Stage 0F-R1 Abacus access findings, selected topology, missing inputs and safety constraints. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Staging prerequisites, split-app build/start commands, required env/secrets and stop conditions. |
| `.env.example` | Expected non-secret env names and placeholder-only secret names. |
| `package.json` and app package scripts | Runtime build, start, lint, typecheck and test commands. |
| `apps/core-api/src/server.ts` | Core API host and port assumptions. |
| `prisma/schema.prisma` | Database env source: `DATABASE_URL`. |
| `.github/workflows/ci.yml` and `.github/workflows/release-preflight.yml` | Existing CI/preflight use local CI PostgreSQL, `AI_PROVIDER=mock` and `STORAGE_PROVIDER=mock`; not Abacus staging credentials. |

## Minimum Staging-Only Inputs Required

The minimum safe runtime POC requires all of these inputs to be confirmed as staging-only before any deploy or smoke run:

1. Staging PostgreSQL connection string for `DATABASE_URL`, or a documented mock DB mode that requires no production database.
2. Staging storage credentials, or confirmed `STORAGE_PROVIDER=mock` in the Abacus staging runtime.
3. Staging AI configuration with `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock`, or another explicitly non-production provider/key.
4. Abacus project plus service/app/task identifiers for the Core API, OIS Console and PITS Shell staging runtimes.
5. Abacus env/secrets injection path that can set non-secret variables and secrets without exposing values in repo, logs or Codex.
6. Staging subdomain/path identifiers for Core API, OIS Console and PITS Shell.
7. Runtime entrypoint and port behavior confirmation for each service, including whether Abacus supplies a dynamic `PORT`.
8. Owner approval before running `pnpm db:migrate` and optional demo-only `pnpm db:seed` against any staging database.

## Staging Runtime Readiness Matrix

| Area | Expected repo/config names | Current evidence | Staging-only proof | R2 status | POC decision |
|---|---|---|---|---|---|
| DB | `DATABASE_URL`, optional `ABACUS_DATABASE_URL`, `MIGRATION_MODE=deploy`; Prisma reads `env("DATABASE_URL")`. | `.env.example`, `prisma/schema.prisma` and `docs/deployment/ABACUS_STAGING_DEPLOY.md` define expected names and migration mode. No staging DB URL was available in this runtime. | Unknown. The only concrete DB values found are local placeholder or CI-local PostgreSQL values; no Abacus staging database was confirmed. | Missing staging-only input. | Blocked; do not migrate, seed or deploy. |
| Storage | `STORAGE_PROVIDER=mock` for Stage 0F; optional `ABACUS_STORAGE_BUCKET`, `ABACUS_STORAGE_ENDPOINT`, `ABACUS_STORAGE_ACCESS_KEY`, `ABACUS_STORAGE_SECRET_KEY` after storage tests are approved. | `.env.example`, storage test plan and Abacus deploy docs keep storage mock-first. Local environment has no Abacus/staging env names. | Unknown for Abacus. Repo guidance is staging-safe only if Abacus is configured with mock storage or staging-only storage credentials. | Missing staging-only confirmation. | Blocked; keep storage inactive/mock. |
| OpenRouter or mock key | `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`; `OPENROUTER_API_KEY` blank unless an approved non-production key is supplied. | `.env.example`, GitHub CI and release preflight use mock AI. No production or paid OpenRouter key was used or inspected. | Unknown for Abacus. The repo default is safe, but the Abacus runtime values are unverified. | Missing staging-only confirmation. | Blocked; do not use production OpenRouter. |
| Abacus project/app/task identifiers | Project `OIS NextGen Staging`; recommended services `ois-nextgen-core-api-staging`, `ois-nextgen-console-staging`, `ois-nextgen-pits-staging`; `ABACUS_APP_ID`, `ABACUS_PUBLIC_APP_URL`. | Project access is partial. App/chat/task editing is possible via redirect to Abacus AI Agent. Exact service/app/task IDs are not recorded. | Partial. The project name is staging-specific, but service IDs and deploy targets are unknown. | Partial. | Blocked until exact staging app/service identifiers are confirmed. |
| Deploy/runtime entrypoint | Core API: `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build`, start `pnpm --filter @ois/core-api start`; Console/PITS use Next build/start package scripts. | Package scripts and deploy docs define split-app commands. Core API reads `CORE_API_HOST` and `CORE_API_PORT`; frontends currently start on fixed ports 3000 and 3001. | Repo-known only. It is not proven that Abacus staging accepts these entrypoints or fixed port behavior. | Partially known. | Blocked until Abacus runtime/port behavior is confirmed. |
| Secrets/env injection path | Abacus staging env/secrets UI or equivalent agent configuration for non-secret variables and secret values. | Abacus CLI is not available; local environment has no `ABACUS_`, `STAGING_` or deploy-provider env names. Abacus AI Agent deployment configuration UI was not directly accessible from this chat interface. | Unknown. No safe injection path was verified. | Missing. | Blocked; no values can be configured safely from this runtime. |
| Staging URLs/subdomains | `CORE_API_URL`, `OIS_CONSOLE_URL`, `PITS_SHELL_URL`, `ABACUS_PUBLIC_APP_URL`. | Repo docs define URL placeholders only. No Abacus staging subdomain/path was provided. | Unknown. | Missing staging-only input. | Blocked; smoke tests cannot target staging URLs. |

## Safe Abacus Discovery Result

Only safe, non-mutating discovery was performed:

- Confirmed Abacus access remains partial from the Stage 0F-R1 access check.
- Confirmed the project name `OIS NextGen Staging` is the only staging-specific Abacus identifier currently documented.
- Confirmed app/chat/task editing is possible only via redirect to Abacus AI Agent.
- Confirmed env/secrets/deploy configuration access remains unknown.
- Confirmed no Abacus CLI is available in this runtime.
- Confirmed no local `ABACUS_`, `STAGING_` or deploy-provider env variable names are present.

No Abacus production path was inspected or mutated.

## POC Decision

Stage 0F-R2 did not execute the staging runtime POC.

Reason: at least one required staging-only input is still unknown. In practice, all deploy-critical areas remain unconfirmed: staging database, staging storage or storage mock mode, staging AI mock configuration, exact Abacus app/service identifiers, env/secrets injection path, deploy/runtime port behavior and staging subdomain/path identifiers.

Exact blockers:

| Blocker | Status | Required resolution |
|---|---|---|
| Staging DB | Missing | Provide a staging-only `DATABASE_URL` or confirm a mock DB mode. |
| Staging storage | Missing | Confirm `STORAGE_PROVIDER=mock` in Abacus or provide staging-only storage credentials after storage test approval. |
| Staging AI provider | Missing | Confirm `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock`, or provide a non-production AI key. |
| Abacus service IDs | Missing | Record exact staging app/service/task identifiers for Core API, OIS Console and PITS Shell. |
| Env/secrets injection | Unknown | Verify the Abacus staging UI/agent path for environment values and secrets. |
| Staging URLs | Missing | Provide staging subdomains or paths for all split-app services. |
| Runtime port behavior | Unknown | Confirm whether Abacus uses fixed service ports or injects a dynamic `PORT`. |
| Owner approval for staging DB operations | Missing | Approve `pnpm db:migrate` and optional demo-only `pnpm db:seed` against the staging database after the database is confirmed staging-only. |

## Production Safety

Stage 0F-R2 was discovery-only and documentation-only.

- No production credentials were used.
- No production database was used.
- No production storage was used.
- No paid or production OpenRouter key was used.
- No Abacus production deployment was executed.
- No Abacus staging deployment was executed.
- No `prisma db push` was used.
- No application behavior, schema, runtime code or business feature was changed.
- Production remains untouched and is not live.

## Validation

Stage 0F-R2 changed documentation/status files only. Required local validation for the documentation update:

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit` completed successfully. |
| `pnpm test` | PASS; 2 files and 16 tests passed. |
| `git status -sb` | PASS; docs/status-only changes present before commit. |
