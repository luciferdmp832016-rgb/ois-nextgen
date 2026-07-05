# Environment Matrix

| Environment | Purpose | Database | Storage | AI provider | Secrets source | Localhost required |
|---|---|---|---|---|---|---|
| local | Developer bootstrap | Local PostgreSQL | Mock/local placeholder | Mock | `.env` or shell | No |
| codex-cloud | Cloud development/test | Non-production PostgreSQL | Mock | Mock | Codex secrets | No |
| github-actions | Merge and preflight gate | Disposable PostgreSQL service | Mock | Mock | Workflow env/secrets | No |
| abacus-staging | Future staging runtime | Abacus staging DB | Abacus staging storage | Mock or approved gateway | Abacus staging secrets | No |
| abacus-production | Future production runtime | Abacus production DB | Abacus production storage | Approved gateway only | Abacus production secrets | No |

## Production Separation

Production database and storage values are never copied into local, Codex Cloud or GitHub Actions.

## Stage 0F Staging Notes

Stage 0F recommends split app staging:

- Core API owns database connectivity.
- OIS Console and PITS Shell run as separate Next.js staging services.
- Storage remains `mock` until a storage ADR and staging storage tests exist.
- AI remains `mock`; no production OpenRouter key is used.
