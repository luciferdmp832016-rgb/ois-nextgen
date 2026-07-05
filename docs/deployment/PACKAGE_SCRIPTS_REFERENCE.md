# Package Scripts Reference

## Root Scripts

| Script | Command | Purpose |
|---|---|---|
| `dev` | `pnpm -r --parallel --filter @ois/core-api --filter @ois/ois-console --filter @ois/pits-shell dev` | Run Core API, Console and PITS shell. |
| `dev:api` | `pnpm --filter @ois/core-api dev` | Run Core API only. |
| `dev:console` | `pnpm --filter @ois/ois-console dev` | Run Console only. |
| `dev:pits` | `pnpm --filter @ois/pits-shell dev` | Run PITS Shell only. |
| `db:generate` | `prisma generate` | Generate Prisma client. |
| `db:migrate` | `prisma migrate deploy` | Apply versioned migrations. |
| `db:seed` | `prisma db seed` | Run idempotent bootstrap seed. |
| `lint` | `node scripts/architecture-guard.mjs` | Enforce Stage A architecture boundaries. |
| `typecheck` | `tsc -p tsconfig.check.json --noEmit` | Typecheck all TS/TSX sources. |
| `test` | `vitest run` | Unit tests. |
| `e2e` | `playwright test` | Boundary and runtime smoke tests. |

## Build

Use `pnpm -r --if-present build` to build all packages and apps that define a build script.
