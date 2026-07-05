# Platform Kernel Seed Verification

Generated during Stage 0B and reverified during Stage 0C on Windows-native PostgreSQL.

Runtime mode: `LOCAL_DATABASE_MODE=WINDOWS_NATIVE_POSTGRESQL`, PostgreSQL 16.14, database `ois_nextgen`, schema `public`.

## Stage 0C Command Results

| Step | Result |
|---|---|
| `pnpm db:generate` | Passed with `CI=true`; generated Prisma Client v6.19.3. |
| `pnpm db:migrate` | Passed; one migration found, no pending migrations. |
| Seed fingerprint helper | Updated to capture per-table deterministic fingerprints and an overall table fingerprint. |
| `pnpm db:seed` run 1 | Passed with `DEMO DATA - NOT PRODUCTION` banner. |
| Count and fingerprint snapshot after run 1 | Captured successfully. |
| `pnpm db:seed` run 2 | Passed with `DEMO DATA - NOT PRODUCTION` banner. |
| Count and fingerprint snapshot after run 2 | Captured successfully. |

## Entity Counts

| Entity | After Run 1 | After Run 2 |
|---|---:|---:|
| Industry | 1 | 1 |
| Organization | 1 | 1 |
| Workspace | 1 | 1 |
| Project | 2 | 2 |
| UserAccount | 6 | 6 |
| WorkspaceMembership | 6 | 6 |
| ProductDefinition | 5 | 5 |
| ProductInstallation | 2 | 2 |
| ProductCapabilityGrant | 2 | 2 |
| ModuleDefinition | 3 | 3 |
| IdentityRealm | 5 | 5 |
| RoleDefinition | 6 | 6 |
| PermissionDefinition | 12 | 12 |
| RolePermission | 10 | 10 |
| EffectiveConfigurationSnapshot | 1 | 1 |
| FeatureFlag | 1 | 1 |
| AuditRecord | 1 | 1 |
| LegacyIdentityMap | 1 | 1 |

## Fingerprint Evidence

| Check | After Run 1 | After Run 2 | Result |
|---|---|---|---|
| Overall table fingerprint | `4a83d1852d3eca5ea2970f7204825b1d4719a344fe27155ec272d404019054f7` | `4a83d1852d3eca5ea2970f7204825b1d4719a344fe27155ec272d404019054f7` | PASS |

The Stage 0C seed fix prevents no-op `upsert` updates from churning `updatedAt`. Product Installation create and update paths now use the same deterministic demo configuration.

## Duplicate And Negative Fixture Checks

| Check | After Run 1 | After Run 2 |
|---|---:|---:|
| Workspace natural-key duplicates | 0 | 0 |
| Project natural-key duplicates | 0 | 0 |
| ProductInstallation duplicates by project/product | 0 | 0 |
| ProductCapabilityGrant duplicates by installation/capability | 0 | 0 |
| RoleDefinition duplicates by organization/realm/code | 0 | 0 |
| RolePermission duplicates by role/permission | 0 | 0 |
| EffectiveConfigurationSnapshot natural-version duplicates | 0 | 0 |
| Runtime rows matching negative/invalid fixture markers | 0 | 0 |

## Migration Table

| Migration | Applied |
|---|---|
| `202607040001_platform_kernel` | yes |

Conclusion: seed reruns create zero logical duplicates, Product Installation duplicates stay at 0, no negative-test fixture markers enter runtime data, `_prisma_migrations` remains valid, and deterministic fingerprints remain stable across reruns.
