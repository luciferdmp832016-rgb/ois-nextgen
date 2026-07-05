# Migration Runbook

## Rules

- Never run `prisma db push`.
- Use `pnpm db:migrate`, which maps to `prisma migrate deploy`.
- Every schema change needs an ADR and a versioned migration.
- Every seed must be idempotent.

## Local And CI

```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
pnpm db:seed
node scripts/stage-0b-db-counts.mjs
```

The second seed run must not create duplicate logical records.

## Abacus Staging

Apply migrations only after release preflight is green and the staging owner approves the target release ref.

## Production

Production migrations require owner sign-off, rollback notes and a deployment manifest. Stage 0D does not run production migrations.
