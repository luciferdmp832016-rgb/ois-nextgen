# Platform Kernel Seed Verification

Generated during Stage 0B on Windows-native PostgreSQL.

Runtime mode: `LOCAL_DATABASE_MODE=WINDOWS_NATIVE_POSTGRESQL`, PostgreSQL 16.14, database `ois_nextgen`, schema `public`.

## Command Results

| Step | Result |
|---|---|
| `pnpm db:migrate` | Passed; one migration found, no pending migrations. |
| Count snapshot before rerun | Captured successfully. |
| `pnpm db:seed` rerun 1 | Passed with `DEMO DATA - NOT PRODUCTION` banner. |
| Count snapshot after rerun 1 | Captured successfully. |
| `pnpm db:seed` rerun 2 | Passed with `DEMO DATA - NOT PRODUCTION` banner. |
| Count snapshot after rerun 2 | Captured successfully. |

## Entity Counts

| Entity | Before Rerun | After Rerun 1 | After Rerun 2 |
|---|---:|---:|---:|
| Industry | 1 | 1 | 1 |
| Organization | 1 | 1 | 1 |
| Workspace | 1 | 1 | 1 |
| Project | 2 | 2 | 2 |
| UserAccount | 6 | 6 | 6 |
| WorkspaceMembership | 6 | 6 | 6 |
| ProductDefinition | 5 | 5 | 5 |
| ProductInstallation | 2 | 2 | 2 |
| ProductCapabilityGrant | 2 | 2 | 2 |
| ModuleDefinition | 3 | 3 | 3 |
| IdentityRealm | 5 | 5 | 5 |
| RoleDefinition | 6 | 6 | 6 |
| PermissionDefinition | 12 | 12 | 12 |
| RolePermission | 10 | 10 | 10 |
| EffectiveConfigurationSnapshot | 1 | 1 | 1 |
| FeatureFlag | 1 | 1 | 1 |
| AuditRecord | 1 | 1 | 1 |
| LegacyIdentityMap | 1 | 1 | 1 |

## Duplicate And Negative Fixture Checks

| Check | Before Rerun | After Rerun 1 | After Rerun 2 |
|---|---:|---:|---:|
| Workspace natural-key duplicates | 0 | 0 | 0 |
| Project natural-key duplicates | 0 | 0 | 0 |
| ProductInstallation duplicates by project/product | 0 | 0 | 0 |
| ProductCapabilityGrant duplicates by installation/capability | 0 | 0 | 0 |
| RoleDefinition duplicates by organization/realm/code | 0 | 0 | 0 |
| RolePermission duplicates by role/permission | 0 | 0 | 0 |
| EffectiveConfigurationSnapshot natural-version duplicates | 0 | 0 | 0 |
| Runtime rows matching negative/invalid fixture markers | 0 | 0 | 0 |

## Migration Table

| Migration | Applied |
|---|---|
| `202607040001_platform_kernel` | yes |

Conclusion: seed reruns created zero logical duplicates; Product Installation duplicates stayed at 0; no negative-test fixture markers entered runtime data; `_prisma_migrations` remained valid.
