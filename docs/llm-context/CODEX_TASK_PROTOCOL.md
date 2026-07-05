# Codex Task Protocol

## Start

1. Record branch, HEAD, recent log and status.
2. Read `AGENTS.md` and any nearest nested `AGENTS.md` files.
3. Identify whether the requested work is Stage A kernel work or deferred domain behavior.
4. Inspect existing tests and scripts before adding new ones.

## Implement

- Prefer small changes with clear evidence.
- Keep docs linked to canonical sources.
- Add tests around behavior you change or new readiness gates you introduce.
- Use placeholders for all secrets.
- Use `apply_patch` for manual edits.

## Validate

Run the strongest applicable set:

- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed` twice
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm e2e`
- `pnpm -r --if-present build`

## Finish

- Update implementation status and the Stage report.
- Commit only intentional repo files.
- Do not push unless explicitly requested.
