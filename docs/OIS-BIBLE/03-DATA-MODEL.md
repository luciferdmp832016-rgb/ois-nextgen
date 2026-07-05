# OIS Bible 03: Data Model

The current data model is a Stage A platform kernel. It is intentionally smaller than the legacy database.

## Active Kernel

- Hierarchy: Industry, Organization, Workspace and Project.
- Product catalog and installation metadata.
- Module definitions and capability grants.
- Identity realms, roles and permissions.
- Configuration snapshots and feature flags.
- Audit records and legacy identity maps.

## Migration Rule

All schema changes require:

1. An accepted ADR.
2. A versioned Prisma migration under `prisma/migrations/`.
3. Idempotent seed or data migration behavior.
4. Typecheck, lint, unit tests, e2e smoke tests and build validation.

`prisma db push` is forbidden.

## Tenant Scoping

Tenant records are scoped through organization, workspace, project and product installation fields where applicable. New tables must preserve this pattern.
