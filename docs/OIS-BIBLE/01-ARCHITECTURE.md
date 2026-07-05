# OIS Bible 01: Architecture

OIS NextGen separates platform governance from product runtime.

## Planes

| Plane | Current app or package | Stage 0D status |
|---|---|---|
| Platform kernel | `apps/core-api`, Prisma schema, platform packages | Active Stage A scope |
| Product administration | `apps/ois-console` | Control Plane shell only |
| Product runtime | `apps/pits-shell` | Runtime shell only |
| Background work | `apps/worker` | Placeholder only |

## Boundaries

- OIS Console may show platform and product administration.
- PITS Shell may show PITS runtime navigation, but not lifecycle behavior yet.
- Frontend apps must not import Prisma.
- Core API is the server boundary for database access.
- Domains can expose pure services and tests; database adapters belong behind server/runtime boundaries.

## Module Metadata

The Stage A module contract is in `packages/architecture-contracts/src/index.ts`. Every module needs Product, Layer, Scope, Realm and Lifecycle metadata before it becomes active.

## Deferred Areas

PITS case/task workflows, Knowledge, Learning, Wisdom and Intelligence remain deferred to later phases.
