# Release And Rollback

## Release Inputs

- Release ref or tag.
- Git commit SHA.
- App version.
- Prisma migration list and hash.
- Stage 0D smoke evidence.
- Deployment manifest.

## Release Preflight

Run `.github/workflows/release-preflight.yml` for the release ref. It performs Prisma generate, migrations, seed idempotency, lint, typecheck, unit tests, e2e smoke tests and recursive builds.

## Rollback Plan

1. Stop the target deployment.
2. Restore the previously known-good release ref.
3. Confirm database compatibility. Do not run destructive down migrations without an approved rollback ADR.
4. Restore storage policy/config to the prior hash.
5. Run runtime smoke tests.
6. Record rollback outcome in the deployment manifest.

## Stop Conditions

- Migration is not backward-compatible.
- Rollback ref is not known good.
- Storage or AI config hash cannot be verified.
- Owner approval is missing.
