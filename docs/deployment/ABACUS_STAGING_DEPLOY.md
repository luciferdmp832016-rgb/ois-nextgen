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
- Abacus staging database and storage are provisioned.
- Production credentials are absent.
- Deployment manifest draft is complete.

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

## Stop Conditions

- Missing migration evidence.
- Any production credential appears in CI, Codex or staging logs.
- Any smoke test fails.
- Manual owner sign-off is missing.
