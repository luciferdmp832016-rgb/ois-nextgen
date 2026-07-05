# Stage 0I Abacus Staging Inputs Runtime Config

Final verdict: `ABACUS_INPUTS_STILL_BLOCKED`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0i-abacus-staging-inputs-runtime-config` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `64486c1` |
| Stage 0H PR merge | PR #7 merged `stage-0h-abacus-staging-runtime-handoff` into integration. |
| Stage 0H commit | `cbbc2d2445ca35db74e392a55bbd5baad728b88f` |
| Stage 0H result | `HANDOFF_READY_ABACUS_INPUTS_BLOCKED` |
| Stage 0I objective | Discover Abacus staging inputs and runtime configuration without deploying, starting runtime, running migrations or exposing secrets. |
| Abacus deploy | Not executed. |
| Abacus public runtime | Not started. |
| Migrations | Not executed. |
| Production | Untouched. |

Opening checks:

| Command | Result |
|---|---|
| `git fetch origin --prune` | PASS; integration branch advanced to include Stage 0H merge. |
| `git merge-base --is-ancestor cbbc2d2445ca35db74e392a55bbd5baad728b88f origin/stage-0b-complete-handoff-ingestion` | PASS; Stage 0H is in integration. |
| `git switch stage-0b-complete-handoff-ingestion` | PASS. |
| `git merge --ff-only origin/stage-0b-complete-handoff-ingestion` | PASS; local integration fast-forwarded to `64486c1`. |
| `git switch -c stage-0i-abacus-staging-inputs-runtime-config` | PASS. |

## Source Of Truth Reviewed

| File | Use |
|---|---|
| `architecture/implementation/STAGE_0H_ABACUS_STAGING_RUNTIME_HANDOFF.md` | Stage 0H handoff, commands, ports, healthchecks, POC scope and go/no-go criteria. |
| `architecture/implementation/STAGE_0G_CODEX_CLOUD_GITHUB_TEST_BOOTSTRAP.md` | Codex Cloud build and mock-safe boot evidence. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Existing staging runbook and stop conditions. |
| `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` | Owner checklist and missing staging input fields. |
| `architecture/implementation/IMPLEMENTATION_STATUS.md` | Current stage status register. |
| `architecture/implementation/PHASE_GATE_REGISTER.md` | Current phase gate evidence. |

## Discovery Access Result

Stage 0I attempted only safe, non-mutating discovery from the available local context.

| Discovery path | Result |
|---|---|
| Abacus-specific Codex connector/tool | Not available in this session. |
| Abacus CLI | Not available; `Get-Command abacus` returned no command. |
| Local Abacus/staging env names | None exposed in process env; values were not printed. |
| Authenticated Abacus/SuperComputer browser session | Not available in this session. |
| User-provided screenshots/manual notes for Stage 0I | Not available. |
| Owner-filled R3 checklist | Not available; checklist remains placeholder/redacted. |

Because no safe live Abacus access path was available, Stage 0I could not directly confirm project ID, cloud ID, public URL, Always On, GitHub connection, cloned repo state, service IDs, env/secrets injection screens, runtime port/proxy behavior or healthcheck configuration from Abacus itself.

## Discovery Findings

| Item | Finding | Status |
|---|---|---|
| Project name | Prior Stage 0F notes name `OIS NextGen Staging`; Stage 0I could not re-confirm from live Abacus. | `CANDIDATE_VISIBLE_BUT_UNVERIFIED` |
| Project ID | No live Abacus evidence available. | `UNKNOWN` |
| SuperComputer/cloud ID | No live Abacus evidence available. | `UNKNOWN` |
| Public URL | No live Abacus evidence available. | `UNKNOWN` |
| Always On | No live Abacus evidence available. | `UNKNOWN` |
| GitHub connected | No live Abacus evidence available. | `UNKNOWN` |
| OIS repo cloned in Abacus | No live Abacus evidence available. | `UNKNOWN` |
| Abacus repo path/branch/commit | No live Abacus evidence available. | `UNKNOWN` |
| App/service/task IDs | No live Abacus evidence available. | `UNKNOWN` |
| Env/secrets mechanism | No Abacus UI/agent/CLI path available to inspect. | `BLOCKED` |
| Live env var names | No live Abacus env screen available; repo-expected names only are known. | `UNKNOWN` |
| `DATABASE_URL` staging secret/reference | No live Abacus env/secrets evidence available. | `UNKNOWN` |
| Storage config or mock mode | Repo requires `STORAGE_PROVIDER=mock` for first POC; live Abacus confirmation unavailable. | `CONFIRMED_MOCK_ONLY` for repo posture; `UNKNOWN` in Abacus. |
| AI/OpenRouter config or mock mode | Repo requires `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`, and no OpenRouter key for first POC; live Abacus confirmation unavailable. | `CONFIRMED_MOCK_ONLY` for repo posture; `UNKNOWN` in Abacus. |
| Runtime port/proxy behavior | Stage 0G verified local ports 4000, 3000 and 3001; Abacus port/proxy behavior unavailable. | `UNKNOWN` |
| Multiple services/ports | Split-app topology is documented; Abacus multi-service support unavailable. | `UNKNOWN` |
| Build/start options | Repo commands are documented in Stage 0H; Abacus entrypoint UI support unavailable. | `CONFIRMED_STAGING_ONLY` for repo handoff; `UNKNOWN` in Abacus. |
| Healthcheck options | Repo healthcheck paths are documented; Abacus healthcheck UI support unavailable. | `CONFIRMED_STAGING_ONLY` for repo handoff; `UNKNOWN` in Abacus. |

No row reached `CONFIRMED_ABACUS_MECHANISM` in Stage 0I.

## Readiness Matrix

| Area | Required for controlled Abacus POC | Stage 0I status | Evidence |
|---|---|---|---|
| Source branch/commit | Integration branch and handoff commit known. | `CONFIRMED_STAGING_ONLY` | `stage-0b-complete-handoff-ingestion` includes Stage 0H merge `64486c1`. |
| Build commands | Split-app build commands known. | `CONFIRMED_STAGING_ONLY` | Stage 0H handoff and app package scripts. |
| Start commands | Split-app start commands known. | `CONFIRMED_STAGING_ONLY` | Stage 0H handoff and app package scripts. |
| Healthcheck paths | Core `/health`, Console `/`, PITS `/`. | `CONFIRMED_STAGING_ONLY` | Stage 0G/0H evidence. |
| Project name | Live Abacus project name. | `CANDIDATE_VISIBLE_BUT_UNVERIFIED` | Prior notes mention `OIS NextGen Staging`; no Stage 0I live confirmation. |
| Project ID | Live Abacus project ID. | `UNKNOWN` | No Abacus access path. |
| SuperComputer/cloud ID | Live Abacus cloud ID. | `UNKNOWN` | No Abacus access path. |
| Public URL | Live staging public URL. | `UNKNOWN` | No Abacus access path. |
| Always On | Runtime persistence setting. | `UNKNOWN` | No Abacus access path. |
| GitHub connected | Abacus source integration status. | `UNKNOWN` | No Abacus access path. |
| OIS repo cloned | Abacus clone path, branch and commit. | `UNKNOWN` | No Abacus access path. |
| App/service/task IDs | Core, Console, PITS IDs. | `UNKNOWN` | No Abacus access path. |
| Env/secrets path | Abacus UI/agent/secret manager mechanism. | `BLOCKED` | No Abacus connector, CLI or authenticated UI. |
| Env names | Names only, values redacted. | `CONFIRMED_STAGING_ONLY` for expected names | Repo/runbooks define expected names; live Abacus names unknown. |
| `DATABASE_URL` | Staging-only secret/reference or excluded DB-backed scope. | `UNKNOWN` | No Abacus env/secrets evidence. |
| Storage | `STORAGE_PROVIDER=mock` in Abacus. | `CONFIRMED_MOCK_ONLY` for repo posture; `UNKNOWN` in Abacus | Repo mock posture confirmed, live value unknown. |
| AI/OpenRouter | `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`, no production key. | `CONFIRMED_MOCK_ONLY` for repo posture; `UNKNOWN` in Abacus | Repo mock posture confirmed, live value unknown. |
| Runtime port/proxy | Support for 4000, 3000, 3001 or route mapping. | `UNKNOWN` | No Abacus runtime config evidence. |
| Multi-service support | Split apps or supported proxy topology. | `UNKNOWN` | No Abacus runtime config evidence. |
| Owner approval fields | Approval for staging-only inputs and DB exclusions. | `BLOCKED` | R3 checklist remains unfilled. |
| Production separation | No production resource use in Stage 0I. | `CONFIRMED_STAGING_ONLY` for safety posture | No deploy, runtime start, migration, production access, secrets or `.env` commit. |

## Redacted Env Name Inventory

Expected names only; no values are recorded.

| Category | Names |
|---|---|
| Required non-secret posture | `APP_ENV`, `DEPLOY_TARGET`, `ABACUS_ENV`, `AI_PROVIDER`, `AI_PROVIDER_MODE`, `STORAGE_PROVIDER`, `NEXT_TELEMETRY_DISABLED`, `CORE_API_URL`, `OIS_CONSOLE_URL`, `PITS_SHELL_URL` |
| First POC unset or mock | `OPENROUTER_API_KEY` should be unset; `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`, `STORAGE_PROVIDER=mock` are required. |
| Possible secrets/references | `DATABASE_URL`, `JWT_SECRET`, `SESSION_SECRET`, `ABACUS_APP_ID`, `ABACUS_PUBLIC_APP_URL` |
| Deferred storage secrets | `ABACUS_STORAGE_BUCKET`, `ABACUS_STORAGE_ENDPOINT`, `ABACUS_STORAGE_ACCESS_KEY`, `ABACUS_STORAGE_SECRET_KEY` |

## Remaining Blockers

| Blocker | Required resolution |
|---|---|
| Abacus live discovery path | Provide safe authenticated UI access, screenshots/manual notes or an Abacus connector/CLI that can inspect staging without mutating resources. |
| Project identifiers | Confirm project name, project ID and SuperComputer/cloud ID. |
| GitHub/source state | Confirm whether GitHub is connected, whether the OIS repo is cloned, and the Abacus repo path/branch/commit. |
| Service/task identifiers | Confirm Core API, OIS Console and PITS app/service/task IDs. |
| Env/secrets mechanism | Confirm how Abacus configures env values and secrets; record names/references only. |
| Mock-safe runtime config | Confirm live Abacus `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`, `STORAGE_PROVIDER=mock`, and no production OpenRouter key. |
| Database scope | Confirm `DATABASE_URL` staging secret/reference or explicitly exclude DB-backed endpoints. |
| Ports/proxy | Confirm fixed ports 4000/3000/3001 or route/proxy mapping, and whether split apps are required. |
| Healthchecks | Confirm Abacus healthcheck path options for each service. |
| Owner approvals | Complete the redacted checklist with staging-only evidence and approvals. |

## Decision

Critical Abacus inputs remain unknown or blocked. Stage 0I is therefore `ABACUS_INPUTS_STILL_BLOCKED`.

Do not execute the Abacus staging POC until a future stage confirms the env/secrets path, GitHub/source path, public URL and port behavior, and mock-safe runtime configuration.

## Safety Statement

Stage 0I was discovery/config-only.

- No Abacus deployment was executed.
- No public runtime was started.
- No migrations were run.
- No `prisma db push` was used.
- No production database was connected to or mutated.
- No production storage was used.
- No production OpenRouter key was used.
- No secret values were printed.
- No real secrets or `.env` files were committed.
- No production Abacus app, project or task was mutated.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit` completed successfully. |
| `pnpm test` | PASS; 2 files and 16 tests passed. |
| `pnpm -r --if-present build` | PASS; Core API, OIS Console and PITS Shell builds completed. |
| `git status -sb` | PASS; docs/config-discovery-only changes present before commit. |
