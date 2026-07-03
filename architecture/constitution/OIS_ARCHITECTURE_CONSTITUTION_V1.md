# OIS Architecture Constitution V1

Status: FROZEN FOR STAGE A

OIS NextGen is organized as a platform kernel plus separately governed product experiences. The legacy OIS implementation is evidence and reference, not the target architecture.

## Non-Negotiables

- Product Runtime is separate from Product Administration.
- Product UI cannot import Prisma.
- Every tenant record is scoped.
- Every sensitive write is audited.
- Schema changes require ADRs and versioned migrations.
- Intelligence claims require evidence and provenance.
- Compute Once. Reuse Forever.

## Official Planes

1. OIS Platform Core
2. OIS Control Plane
3. Product Experience Plane
