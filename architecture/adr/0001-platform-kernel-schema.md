# ADR 0001: Platform Kernel Schema

Status: Accepted

## Context

The legacy Prisma schema contains 135 models. Stage A must not copy the legacy schema.

## Decision

Create a clean kernel around hierarchy, products, modules, identity realms, roles, permissions, configuration snapshots, feature flags, audit records and legacy identity mapping.

## Consequences

- The kernel can support OIS Console and PITS Shell without premature domain behavior.
- Future Phase 2 porting can attach bounded domains to a stable hierarchy.
- Legacy compatibility is represented through explicit mapping, not schema cloning.
