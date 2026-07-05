# GitHub CI Setup

The Stage 0D workflows create a repeatable non-production gate for merges and release preflight.

## Workflows

- `.github/workflows/ci.yml`
- `.github/workflows/release-preflight.yml`

## Required Repository Settings

- Branch protection on `main`.
- Branch protection on the current integration branch, `stage-0b-complete-handoff-ingestion`.
- Required status check after the first successful workflow run: `validate` from the `ci` workflow.
- Pull requests required before merge.
- No production secrets available to pull request workflows.

Stage 0E note: the repository default branch is `stage-0b-complete-handoff-ingestion`, so PR-triggered CI must include that branch in `.github/workflows/ci.yml`.

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

## Manual Activation Checklist

- Confirm Actions are enabled for the repository.
- Create GitHub environments: `ci-test`, `abacus-staging`, `abacus-production`.
- Keep pull request workflows free of production secrets.
- Add staging-only secrets only to `abacus-staging`.
- Add production secrets only to `abacus-production` and require manual approvals.
- After the first successful CI run, require `validate` in branch protection for `stage-0b-complete-handoff-ingestion`.
- Require pull request review before merge.
- Use release tags such as `stage-0e-YYYYMMDD` or `abacus-staging-poc-v0.1.0` for staged deployments.
