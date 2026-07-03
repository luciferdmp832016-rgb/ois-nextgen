# OIS NextGen Bootstrap Stage A

This repository is the clean NextGen foundation. The legacy OIS source lives outside this repository in `../handoff-phase1/source-reference` and is read-only reference material.

## Local Stack

```bash
docker compose up -d
pnpm install
pnpm db:migrate
pnpm db:seed
pnpm dev
pnpm lint
pnpm typecheck
pnpm test
pnpm e2e
```

## URLs

- OIS Console: http://localhost:3000
- PITS Shell: http://localhost:3001
- Core API: http://localhost:4000
- API Docs: http://localhost:4000/docs

Demo UI labels must include `DEMO DATA - NOT PRODUCTION`.
