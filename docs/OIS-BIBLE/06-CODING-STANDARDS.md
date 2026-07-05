# OIS Bible 06: Coding Standards

## Scope Discipline

- Match existing package and app patterns.
- Keep frontend pages Prisma-free.
- Use Core API for database access.
- Do not add PITS, Knowledge, Learning, Wisdom or Intelligence behavior in Stage A.
- Keep docs and tests tied to observable evidence.

## Validation

Before completion, run:

- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed` twice
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm e2e`
- `pnpm -r --if-present build`

## Secrets

Use placeholders in committed files. Real secrets belong in local shell state, Codex Cloud secrets, GitHub secrets or Abacus secrets.
