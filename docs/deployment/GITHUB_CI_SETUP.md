# GitHub CI Setup

The Stage 0D workflows create a repeatable non-production gate for merges and release preflight.

## Workflows

- `.github/workflows/ci.yml`
- `.github/workflows/release-preflight.yml`

## Required Repository Settings

- Branch protection on `main`.
- Required status check: `validate` from the `ci` workflow.
- Pull requests required before merge.
- No production secrets available to pull request workflows.

## CI Database

The workflows run a disposable PostgreSQL 16 service with:

- Database: `ois_nextgen`
- User: `ois_nextgen`
- Password: CI-only placeholder

This database is not Abacus production or staging.

## Artifact Strategy

CI uploads Stage 0D evidence from:

- `test-results/stage-0d/**`
- `playwright-report/**`
- Playwright traces on retry

Expected artifacts include Console, PITS and Core API docs screenshots plus the platform-kernel count fingerprint.
