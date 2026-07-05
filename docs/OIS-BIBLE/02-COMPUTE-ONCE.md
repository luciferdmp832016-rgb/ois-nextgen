# OIS Bible 02: Compute Once

The OIS operating rule is Compute Once. Reuse Forever.

## Meaning

- Preserve evidence in committed reports or CI artifacts.
- Prefer deterministic seeds and stable fingerprints over manual inspection.
- Cache or reuse expensive outputs only after the source inputs and provenance are recorded.
- Recompute only when input hashes, migration versions or configuration versions change.

## Current Stage 0D Evidence

- Prisma migration history is the schema source of truth.
- `scripts/stage-0b-db-counts.mjs` captures counts, fingerprints and duplicate checks.
- Playwright screenshots are stored under `test-results/stage-0d/` during CI and local smoke runs.
- Deployment manifests record commit, migration, storage and AI configuration hashes before release.

## Future Runtime Rule

AI and storage outputs must include provenance and replay metadata before they are used for claims, automation or customer-visible decisions.
