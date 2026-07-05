# No Localhost Required

Stage 0C proved the local exact-port runtime. Stage 0D adds the cloud path so a local PC is not required for the main gate.

## Canonical Gate

GitHub Actions runs:

- Disposable PostgreSQL service.
- Prisma generate and migrate.
- Idempotent seed twice.
- Architecture guard, typecheck, unit tests and e2e smoke tests.
- Recursive builds.
- Evidence artifact upload.

## Localhost Role

Localhost remains useful for interactive development and smoke reproduction, but it is not the release source of truth.

## Cloud URLs

When running outside localhost, set:

- `OIS_CONSOLE_URL`
- `PITS_SHELL_URL`
- `CORE_API_URL`

The smoke tests read these variables before falling back to local ports.
