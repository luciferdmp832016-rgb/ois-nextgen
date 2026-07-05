# Stage 0H Abacus Staging Runtime Handoff

Final verdict: `HANDOFF_READY_ABACUS_INPUTS_BLOCKED`.

## Baseline

| Item | Result |
|---|---|
| Branch | `stage-0h-abacus-staging-runtime-handoff` |
| Integration base | `stage-0b-complete-handoff-ingestion` |
| Integration base commit | `bdd733d` |
| Stage 0G PR merge | PR #6 merged `stage-0g-codex-cloud-github-test-bootstrap` into integration. |
| Stage 0G commit | `77e1976af6fc600503b6605428613a44735bfd99` |
| Stage 0G result | `CODEX_CLOUD_APP_BOOT_VERIFIED` |
| Stage 0H objective | Convert verified Codex Cloud boot evidence into a safe Abacus staging runtime handoff package. |
| Abacus deploy | Not executed. |
| Abacus runtime POC | Not executed. |
| Migrations | Not executed. |
| Production | Untouched. |

Opening checks:

| Command | Result |
|---|---|
| `git fetch origin --prune` | PASS; integration branch advanced to include Stage 0G merge. |
| `git log --oneline --decorate -8 origin/stage-0b-complete-handoff-ingestion` | Shows `bdd733d Merge pull request #6` followed by Stage 0G commit `77e1976`. |
| `git switch stage-0b-complete-handoff-ingestion` | PASS. |
| `git merge --ff-only origin/stage-0b-complete-handoff-ingestion` | PASS; local integration branch fast-forwarded to `bdd733d`. |
| `git switch -c stage-0h-abacus-staging-runtime-handoff` | PASS. |

## Source Of Truth Reviewed

| File | Use |
|---|---|
| `architecture/implementation/STAGE_0G_CODEX_CLOUD_GITHUB_TEST_BOOTSTRAP.md` | Verified build and mock-safe boot evidence. |
| `architecture/implementation/STAGE_0F_R4_DISCOVERY_VERIFICATION.md` | Abacus staging blockers and unknowns. |
| `docs/deployment/ABACUS_STAGING_DEPLOY.md` | Existing Abacus staging topology and stop conditions. |
| `docs/deployment/ABACUS_STAGING_INPUTS_CHECKLIST.md` | Owner input checklist and approval gates. |
| `package.json` | Root validation scripts. |
| `.env.example` | Env var names, mock-safe defaults and placeholder-only secrets. |
| `apps/core-api/package.json` | Core API build/start commands. |
| `apps/ois-console/package.json` | OIS Console build/start commands. |
| `apps/pits-shell/package.json` | PITS Shell build/start commands. |

## Abacus Runtime Source Ref

The expected source for the first Abacus staging runtime POC is the integration branch after Stage 0H is merged:

| Field | Value |
|---|---|
| Repository | `https://github.com/luciferdmp832016-rgb/ois-nextgen` |
| Runtime source branch | `stage-0b-complete-handoff-ingestion` |
| Minimum verified runtime commit | `bdd733d` plus Stage 0G code-equivalent commit `77e1976af6fc600503b6605428613a44735bfd99` |
| Stage 0H branch | `stage-0h-abacus-staging-runtime-handoff` |
| Stage 0H effect | Documentation/runbook only; no application behavior change. |

If Stage 0H is merged before Abacus execution, use the merged integration commit that contains this handoff package. The runtime code remains equivalent to the Stage 0G verified boot state unless a later code change is explicitly introduced and revalidated.

## Handoff Commands

Use split-app staging. Do not use one app to supervise all three services unless Abacus explicitly supports that topology.

| Service | Build command | Start command | Port | Healthcheck |
|---|---|---|---:|---|
| Core API | `pnpm install --frozen-lockfile && pnpm db:generate && pnpm --filter @ois/core-api build` | `pnpm --filter @ois/core-api start` | 4000 | `/health` |
| OIS Console | `pnpm install --frozen-lockfile && pnpm --filter @ois/ois-console build` | `pnpm --filter @ois/ois-console start` | 3000 | `/` |
| PITS Shell | `pnpm install --frozen-lockfile && pnpm --filter @ois/pits-shell build` | `pnpm --filter @ois/pits-shell start` | 3001 | `/` |

Validation command before handoff: `pnpm lint && pnpm typecheck && pnpm test && pnpm -r --if-present build`.

## Mock-Safe Environment Contract

Required non-secret names for the initial Abacus POC:

| Variable | Required posture |
|---|---|
| `APP_ENV` | `staging` |
| `DEPLOY_TARGET` | `abacus-staging` |
| `ABACUS_ENV` | `staging` |
| `AI_PROVIDER` | `mock` |
| `AI_PROVIDER_MODE` | `mock` |
| `OPENROUTER_API_KEY` | unset for first POC |
| `STORAGE_PROVIDER` | `mock` |
| `NEXT_TELEMETRY_DISABLED` | `1` |
| `CORE_API_URL` | Abacus Core API staging URL |
| `OIS_CONSOLE_URL` | Abacus Console staging URL |
| `PITS_SHELL_URL` | Abacus PITS Shell staging URL |

Required secret names only, no values in repo:

| Variable | Required for first POC | Handling |
|---|---|---|
| `DATABASE_URL` | Only if DB-backed routes or migrations are included. | Secret value must be staging-only and entered in Abacus/private secret manager. |
| `JWT_SECRET` | If Abacus runtime requires auth/session placeholders. | Secret value must be staging-only. |
| `SESSION_SECRET` | If Abacus runtime requires auth/session placeholders. | Secret value must be staging-only. |
| `ABACUS_APP_ID` | If Abacus service identification requires it. | Secret or non-secret ID as Abacus defines; do not use production IDs. |
| `ABACUS_PUBLIC_APP_URL` | If Abacus service URL mapping requires it. | Staging URL only. |

Storage secrets remain out of the first POC unless storage tests are approved.

## Initial POC Scope

The initial Abacus staging POC should reproduce Stage 0G's mock-safe probes:

| Surface | Path | Expected |
|---|---|---|
| Core API health | `/health` | HTTP 200 with `status=ok`. |
| Core API root | `/` | HTTP 200 with service identity `ois-nextgen-core-api`. |
| OIS Console | `/` | HTTP 200 and visible OIS Console shell. |
| PITS Shell | `/` | HTTP 200 and visible PITS Shell shell. |

Excluded from initial POC:

- DB-backed endpoints such as `/platform/overview`.
- Demo login or product-installation reads.
- `pnpm db:migrate`, unless a staging-only DB and owner migration approval are confirmed before execution.
- `pnpm db:seed`, unless explicitly approved for demo-only staging data.
- Storage runtime checks.
- OpenRouter or any paid/production AI provider calls.

## Abacus Deployment Readiness Matrix

| Area | Evidence | Status | Action |
|---|---|---|---|
| Build viability | Stage 0G `pnpm -r --if-present build` passed for Core API, OIS Console and PITS Shell. | Confirmed from 0G | Use the documented split-app build commands. |
| Test viability | Stage 0G lint, typecheck and tests passed. | Confirmed from 0G | Keep as pre-deploy gate. |
| Mock-safe boot | Stage 0G returned HTTP 200 for Core API `/health`, Core API `/`, Console `/` and PITS `/`. | Confirmed from 0G | Reproduce only these probes in Abacus first. |
| Service commands | App package scripts define build/start commands. | Confirmed from repo | Use split-app staging services. |
| Service ports | Stage 0G verified ports 4000, 3000 and 3001 locally. | Confirmed from 0G | Confirm Abacus fixed port or mapping support. |
| Env var names | `.env.example` and runbooks define names. | Confirmed from repo | Owner must configure values in Abacus. |
| AI mode | Repo defaults to mock. | Confirmed from repo | Owner must confirm Abacus has `AI_PROVIDER=mock` and `AI_PROVIDER_MODE=mock`. |
| Storage mode | Repo defaults to mock. | Confirmed from repo | Owner must confirm Abacus has `STORAGE_PROVIDER=mock`. |
| DB URL | Prisma uses `DATABASE_URL`; no staging value is present. | Requires Abacus owner input | Provide staging-only DB secret only if DB-backed scope/migrations are approved. |
| Abacus project/service IDs | R4 has project name candidate only; exact IDs are unknown. | Requires Abacus owner input | Complete R3 checklist with staging project/service/task IDs. |
| Env/secrets injection path | Unknown. | Blocked | Owner must verify Abacus UI/agent secret injection path. |
| Staging URLs | Unknown. | Requires Abacus owner input | Provide Core API, Console and PITS staging URLs. |
| Port behavior | Abacus fixed-port or dynamic `PORT` support unknown. | Blocked | Confirm before POC or create a future config-only port adaptation. |
| SuperComputer/cloud evidence | Unknown. | Requires Abacus owner input | Provide safe evidence if required by Abacus deployment setup. |
| Always On/GitHub connection | Unknown. | Requires Abacus owner input | Provide safe evidence if required for service operation. |
| Production separation | No production resources used through Stage 0H. | Confirmed from repo/stage evidence | Keep production credentials absent. |

## Rollback And Stop Procedure

For the first Abacus staging POC:

1. Stop the three Abacus staging services or disable the staging app/task that started them.
2. Confirm Core API, Console and PITS staging URLs no longer serve the new release.
3. Revert the Abacus service release ref to the prior known staging ref, or leave the staging services stopped if this is the first POC.
4. Remove or rotate any staging-only secret that was exposed in a log or screenshot.
5. Record stop time, release ref, owner and reason in the deployment manifest.
6. Do not run rollback database changes for the initial mock-only POC because no migrations or DB-backed checks should run.

If migrations are approved in a future stage, rollback must use a separately approved migration rollback plan. `prisma db push` remains forbidden.

## Expected Abacus POC Evidence

The owner or executor should attach evidence outside the repo or in an approved artifact store:

- Release ref and commit SHA used by each service.
- Abacus project, service/app/task IDs with staging-only proof.
- Env/secrets injection path proof with values hidden.
- Confirmation that `AI_PROVIDER=mock`, `AI_PROVIDER_MODE=mock`, `STORAGE_PROVIDER=mock` and `OPENROUTER_API_KEY` unset were applied.
- Build logs for each service.
- Start logs for each service.
- Listener/port evidence or Abacus route mapping evidence.
- HTTP 200 evidence for Core API `/health`, Core API `/`, Console `/` and PITS `/`.
- Confirmation that DB-backed endpoints were not called.
- Confirmation that no production DB, storage, OpenRouter key or Abacus production resource was used.
- Stop or rollback evidence after the POC, unless the owner explicitly approves leaving staging running.

## Go / No-Go Gate

Stage 0I or Stage 0J may proceed only when:

- R3 owner checklist is complete.
- Abacus project/service/task IDs are confirmed staging-only.
- Env/secrets injection path is confirmed.
- Staging URLs are known.
- Abacus port behavior is confirmed or a config-only port adaptation is merged and validated.
- Mock AI and mock storage are confirmed in Abacus.
- DB-backed scope is either excluded or a staging-only DB and migration approval are confirmed.
- Production credentials are absent.

No-go conditions:

- Any production resource appears.
- Any real secret appears in repo, logs, screenshots or chat.
- Abacus deployment config cannot be inspected safely.
- Staging URLs or service IDs are unknown.
- Abacus requires unsupported dynamic port behavior.
- Owner checklist remains incomplete.

## Decision

The Stage 0H handoff package is complete, but Abacus staging inputs remain missing. Stage 0H is therefore `HANDOFF_READY_ABACUS_INPUTS_BLOCKED`.

No Abacus deployment or runtime POC was executed in this stage.

## Safety Statement

Stage 0H was documentation-only.

- No Abacus deployment was executed.
- No Abacus runtime was started.
- No migrations were run.
- No `prisma db push` was used.
- No production database was used.
- No production storage was used.
- No production OpenRouter key was used.
- No real secrets or `.env` files were committed.
- No secret values were printed.
- No production Abacus app, project or task was mutated.

## Validation

| Command | Result |
|---|---|
| `pnpm lint` | PASS; architecture guard passed. |
| `pnpm typecheck` | PASS; `tsc -p tsconfig.check.json --noEmit` completed successfully. |
| `pnpm test` | PASS; 2 files and 16 tests passed. |
| `pnpm -r --if-present build` | PASS; Core API, OIS Console and PITS Shell builds completed. |
| `git status -sb` | PASS; docs/runbook-only changes present before commit. |
