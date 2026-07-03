# Source Inventory Summary

Authoritative source: `../handoff-phase1/inventory/inventory_reconciliation.json`

## Counts

| Metric | Count | Source |
|---|---:|---|
| Pages | 90 | source tree |
| API route files | 273 | source tree |
| Prisma models | 135 | source tree |
| Prisma enums | 63 | source tree |
| Service files | 100 | source tree |
| Component files | 94 | source tree |
| PITS API routes | 94 | source tree |
| PITS pages | 19 | source tree |

## Schema Inventory

- Legacy DDL contains 135 `CREATE TABLE` statements.
- `DATABASE_ENUMS.json` contains 63 enum definitions.
- `DATABASE_CONSTRAINTS.json` reports 46 unique constraints, 306 indexes, 156 foreign keys and 135 table maps.
- `DATABASE_MODEL_DOMAIN_MAP.json` maps 135 models across 18 domains.

## Stage A Interpretation

The legacy schema is not the target architecture. Stage A creates only the clean platform kernel tables required for hierarchy, product installation, identity, permissions, configuration, audit and legacy identity mapping.
