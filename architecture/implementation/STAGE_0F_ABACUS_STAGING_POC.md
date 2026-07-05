# Stage 0F Abacus Staging Runtime POC

Final verdict: `PASS_WITH_MANUAL_ABACUS_STEPS`.

## Baseline

| Item | Result |
|---|---|
| Current branch | `stage-0b-complete-handoff-ingestion` |
| Current commit | `888c52487684a5f0308ac0b75d6eb355ee0a68e0` |
| Stage 0F source state | Merged integration branch containing Stage 0E evidence. |
| PR | `https://github.com/luciferdmp832016-rgb/ois-nextgen/pull/1` |
| PR state | Closed and merged. |
| PR merge commit | `888c52487684a5f0308ac0b75d6eb355ee0a68e0` |
| Final PR head | `622d42d42572e44ace34795f860231e5027feb55` |

Opening checks:

| Command | Result |
|---|---|
| `git status --short` | Clean. |
| `git branch --show-current` | `stage-0b-complete-handoff-ingestion` |
| `git rev-parse HEAD` | `888c52487684a5f0308ac0b75d6eb355ee0a68e0` |
| `git log -8 --oneline --decorate` | Includes `888c524`, `622d42d`, `e097fca`, `26c6947`, `a8abe06`, `c81bf4f`, `124f388`, `28747a7`. |
| `git remote -v` | `origin https://github.com/luciferdmp832016-rgb/ois-nextgen.git` |

## Stage 0E Continuity

| Item | Result |
|---|---|
| GitHub CI | PASS |
| Workflow run | `https://github.com/luciferdmp832016-rgb/ois-nextgen/actions/runs/28738991764` |
| Workflow | `ci` |
| Run number | `8` |
| Job | `validate` |
| Job ID | `85218259618` |
| Final PR head SHA | `622d42d42572e44ace34795f860231e5027feb55` |
| Artifact | `stage-0d-evidence` |
| Artifact ID | `8091246012` |
| Artifact digest | `sha256:db44aff7b9eae2b7eafce90398f220c3d0a4f7509cbd0573e5024d6df6bc85fb` |

Artifact ZIP inspection confirmed:

- `test-results/stage-0d/ois-console-home.png`
- `test-results/stage-0d/pits-shell-home.png`
- `test-results/stage-0d/core-api-docs.png`
- `playwright-report/index.html`

No connector-visible GitHub Actions run was found for the merge commit `888c52487684a5f0308ac0b75d6eb355ee0a68e0`; the final PR-head CI above is the continuity evidence for the merged change.

## Abacus Access Check

| Check | Result |
|---|---|
| Abacus CLI | Not available in this runtime. |
| Abacus staging environment variable names | None present in the local process environment. |
| Staging credentials | Not available. |
| Abacus UI access | Not available from this runtime. |
| Actual staging deployment | Not executed. |

No production database, production storage, production OpenRouter key or production deployment was used.

## Runtime Topology Options

### Option A: Full Monorepo Staging

| Field | Value |
|---|---|
| Shape | One Abacus staging app starts Core API, OIS Console and PITS Shell together. |
| Build command | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm -r --if-present build` |
| Start command | `pnpm dev` for development-like staging, or a process manager that starts all three package `start` scripts. |
| Required env | `APP_ENV=staging`, `DEPLOY_TARGET=abacus-staging`, `DATABASE_URL`, `CORE_API_URL`, `OIS_CONSOLE_URL`, `PITS_SHELL_URL`, `AI_PROVIDER=mock`, `STORAGE_PROVIDER=mock` |
| Database mode | Abacus staging PostgreSQL only. |
| Seed policy | Run `pnpm db:seed` only with owner approval for demo/staging data. |
| Storage mode | `mock` for Stage 0F unless staging storage credentials and storage tests are approved. |
| Health check | Core API `/health`. |
| URL strategy | Requires Abacus to route three public services or expose subpaths/subdomains. |
| Limitation | Current repo has three independent long-running processes and fixed local default ports. |

### Option B: Split App Staging

| Field | Core API | OIS Console | PITS Shell |
|---|---|---|---|
| Runtime | Node/Fastify | Next.js | Next.js |
| Build command | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build` | `pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` | `pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` |
| Start command | `pnpm --filter @ois/core-api start` | `pnpm --filter @ois/ois-console start` | `pnpm --filter @ois/pits-shell start` |
| Required URL | `CORE_API_URL=https://<abacus-core-api>` | `OIS_CONSOLE_URL=https://<abacus-console>` | `PITS_SHELL_URL=https://<abacus-pits>` |
| Health check | `/health` | `/` | `/` |
| Database | Staging PostgreSQL | None directly | None directly |
| Storage | `mock` in Stage 0F | None directly | None directly |

Recommended option: `B. Split app staging`.

Reason: the current topology already separates API and product shell runtimes. Split staging avoids requiring one Abacus app to supervise three public Node processes and keeps database access limited to Core API.

### Option C: Static/Frontend Preview Plus API Staging

| Field | Value |
|---|---|
| Shape | Core API on Abacus staging, frontends as preview/static-like deployments if Abacus supports them. |
| Build command | API build plus each Next build. |
| Start command | API `pnpm --filter @ois/core-api start`; frontend command depends on Abacus static/Next support. |
| Limitation | The repo does not currently define `next export`; use only if Abacus supports Next.js runtime or preview hosting. |

### Option D: Documentation-Only Blocker

| Field | Value |
|---|---|
| Shape | No staging deploy from this runtime. |
| Cause | Abacus CLI, UI access and staging-only credentials are unavailable. |
| Result | Manual setup required. |

## Selected Topology

Selected topology: `B. Split app staging`.

Abacus staging should use three staging apps or three services under one staging project:

- `ois-nextgen-core-api-staging`
- `ois-nextgen-console-staging`
- `ois-nextgen-pits-staging`

Use one release ref across all three services. The first recommended tag is `abacus-staging-poc-v0.1.0`.

## Staging Environment Plan

Non-secret variables:

| Variable | Value |
|---|---|
| `APP_ENV` | `staging` |
| `DEPLOY_TARGET` | `abacus-staging` |
| `ABACUS_ENV` | `staging` |
| `AI_PROVIDER` | `mock` |
| `AI_PROVIDER_MODE` | `mock` |
| `STORAGE_PROVIDER` | `mock` |
| `DEPLOYMENT_VERSION_ENABLED` | `false` |
| `NEXT_TELEMETRY_DISABLED` | `1` |

Required staging-only secrets:

- `DATABASE_URL` or `ABACUS_DATABASE_URL` for Abacus staging PostgreSQL only.
- `JWT_SECRET`
- `SESSION_SECRET`
- `ABACUS_APP_ID`
- `ABACUS_PUBLIC_APP_URL`

Optional staging storage secrets, only after storage tests are approved:

- `ABACUS_STORAGE_BUCKET`
- `ABACUS_STORAGE_ENDPOINT`
- `ABACUS_STORAGE_ACCESS_KEY`
- `ABACUS_STORAGE_SECRET_KEY`

Production secrets must not be present in Codex, GitHub Actions, local runs or Abacus staging.

## Deployment Steps Performed

No Abacus staging deployment was executed from this runtime.

Performed:

- Read Stage 0D and Stage 0E deployment runbooks.
- Inspected package scripts and start commands.
- Checked for Abacus CLI availability.
- Checked for Abacus/staging environment variable names without printing secret values.
- Verified PR #1 merged state and final PR-head CI.
- Verified final PR-head `stage-0d-evidence` artifact and screenshot file names.

## Local Validation

Stage 0F changed documentation and status files only. Lightweight validation passed:

| Command | Result |
|---|---|
| `pnpm lint` | PASS |
| `pnpm typecheck` | PASS |
| `pnpm test` | PASS; 2 files and 16 tests. |

Fuller database, e2e and build gates were not rerun because Stage 0F did not change source code, runtime config, Prisma schema or package scripts. PR #1 final-head CI already passed those gates on `622d42d42572e44ace34795f860231e5027feb55`.

## Required Manual POC Steps

1. Create Abacus staging services for Core API, OIS Console and PITS Shell.
2. Pin all services to the same release ref, preferably `abacus-staging-poc-v0.1.0`.
3. Configure Core API staging secrets with staging database only.
4. Configure frontend services with public staging URLs only.
5. Run `pnpm db:migrate` against Abacus staging database through the Core API service release process.
6. Run `pnpm db:seed` only if the owner approves demo/staging bootstrap data.
7. Start all three staging services.
8. Verify:
   - OIS Console staging URL returns title or heading `OIS Console`.
   - PITS Shell staging URL returns title or heading `PITS Shell`.
   - Core API `/` returns service `ois-nextgen-core-api`.
   - Core API `/health` returns `status=ok`.
   - Core API `/docs` renders Swagger UI.
9. Save URL/status evidence outside the repo or as an approved deployment artifact.
10. Complete a deployment manifest from `ops/DEPLOYMENT_MANIFEST_TEMPLATE.md`.

## Health Check Plan

| Surface | URL placeholder | Expected |
|---|---|---|
| Core API root | `https://<abacus-core-api>/` | JSON service identity `ois-nextgen-core-api`. |
| Core API health | `https://<abacus-core-api>/health` | JSON `status=ok`. |
| Core API docs | `https://<abacus-core-api>/docs` | Swagger UI. |
| OIS Console | `https://<abacus-console>/` | `OIS Console` and demo banner. |
| PITS Shell | `https://<abacus-pits>/` | `PITS Shell` and demo banner. |

## Blockers And Limitations

| Item | Status | Action |
|---|---|---|
| Abacus CLI/UI access | Unavailable | Owner must provide staging access or run manual setup. |
| Staging-only credentials | Unavailable | Owner must configure staging secrets in Abacus. |
| Multi-process topology | Unknown Abacus support | Prefer split app staging. |
| Dynamic port behavior | Unknown Abacus requirement | If Abacus requires `$PORT`, add a small runtime script in a future config-only stage. |
| Storage runtime | Deferred | Keep `STORAGE_PROVIDER=mock` until storage ADR/tests exist. |

## Production Untouched

Stage 0F did not access or deploy production. It did not use production database, production storage, production OpenRouter key or `prisma db push`.

## Recommendation For Stage 1A

Do not start PITS Field Report yet. Recommended next stage is a Stage 0F continuation or Stage 0G owner-assisted Abacus staging execution if staging access becomes available. If the owner accepts manual Abacus setup as sufficient, Stage 1A should be a platform-only stabilization pass: branch protection, release-preflight dispatch, and staging manifest capture before any PITS business slice begins.
