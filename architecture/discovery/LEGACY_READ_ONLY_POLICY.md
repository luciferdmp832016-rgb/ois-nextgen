# Legacy Read-Only Policy

The legacy OIS source at `../handoff-phase1/source-reference` is reference-only.

## Allowed

- Read files for discovery.
- Quote inventory counts in architecture documents.
- Use schemas and service names to understand domain boundaries.
- Map future migration identities through `LegacyIdentityMap`.

## Forbidden

- Modify legacy files.
- Copy the legacy directory structure.
- Copy the legacy navigation model.
- Import the full legacy database.
- Connect to production systems.
- Use production credentials.
- Run `prisma db push`.
- Port complex domain behavior before Phase 2 and Phase 3 gates.

## Enforcement

- New code lives in `ois-nextgen/`.
- The architecture guard rejects frontend Prisma imports and broad legacy permissions.
- Stage A migrations define only the platform kernel, not the 135-model legacy schema.
