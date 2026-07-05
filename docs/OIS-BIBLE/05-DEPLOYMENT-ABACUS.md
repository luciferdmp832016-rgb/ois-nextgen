# OIS Bible 05: Deployment And Abacus

Stage 0D prepares for Abacus staging and production, but it does not deploy.

## Source Of Truth

- GitHub repository: code, docs, migrations and release refs.
- GitHub Actions: canonical merge and release preflight gate.
- Codex Cloud: development and test workspace once configured.
- Abacus: future staging and production runtime.

## Abacus Rule

Abacus production database and storage are never used in Codex, CI, PR checks or local tests. Production deploys require owner-controlled secrets and a completed deployment manifest.

## Required Release Evidence

- Commit SHA.
- App version.
- Migration version and schema hash.
- Seed fingerprint for staging test database.
- Storage configuration hash.
- AI configuration hash.
- Runtime smoke result.
- Rollback decision and owner sign-off.

See `docs/deployment/ABACUS_STAGING_DEPLOY.md` and `docs/deployment/ABACUS_PRODUCTION_READINESS.md`.
