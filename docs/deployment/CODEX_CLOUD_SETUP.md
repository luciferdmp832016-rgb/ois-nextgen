# Codex Cloud Setup

Codex Cloud should be able to run OIS NextGen without relying on a developer PC.

## Required Environment

- Node.js 22 or compatible with the repo package manager.
- pnpm 9.15.4 through Corepack.
- PostgreSQL 16 non-production database.
- No production credentials.

## Secrets

Set only non-production values:

- `DATABASE_URL`
- `JWT_SECRET`
- `SESSION_SECRET`
- `AI_PROVIDER=mock`
- `AI_PROVIDER_MODE=mock`
- `STORAGE_PROVIDER=mock`

Do not set Abacus production database or storage values in Codex Cloud.

## Bootstrap Commands

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install --frozen-lockfile
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:seed
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
pnpm -r --if-present build
```

## Expected Services

- OIS Console: `http://localhost:3000` when a local tunnel is available.
- PITS Shell: `http://localhost:3001` when a local tunnel is available.
- Core API: `http://localhost:4000`.

Localhost is not a source-of-truth requirement; GitHub Actions is the canonical merge gate.
