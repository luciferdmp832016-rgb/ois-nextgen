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

1. Confirm release ref and commit SHA.
2. Apply Prisma migrations using deploy mode only.
3. Run the idempotent seed only if the staging owner approves demo bootstrap data.
4. Start Core API, OIS Console and PITS Shell.
5. Run smoke tests against Abacus staging URLs.
6. Attach manifest and smoke evidence to the release record.

## Smoke Checks

- Core API `/` returns service identity `ois-nextgen-core-api`.
- Core API `/health` returns `status=ok`.
- Core API `/docs` renders Swagger UI.
- OIS Console `/` renders `OIS Console`.
- PITS Shell `/` renders `PITS Shell`.

Stage 0J verified only the first two checks locally on `127.0.0.1:4000`; public `/health` still returned 404 until routing/deployment is configured.

## Stop Conditions

- Missing migration evidence.
- Abacus access is limited to project/chat/task editing and does not expose staging env/secrets/deploy configuration.
- Staging-only mock database mode, mock storage mode, staging subdomain/path or AI provider config is missing.
- Stage 0F-R3 owner checklist is incomplete or contains real secret values.
- Stage 0H go/no-go gate is incomplete.
- Abacus port behavior for services 4000, 3000 and 3001 is unknown.
- Public routing for Core API `/health` is not configured or returns 404.
- Any production credential appears in CI, Codex or staging logs.
- Any smoke test fails.
- Manual owner sign-off is missing.
