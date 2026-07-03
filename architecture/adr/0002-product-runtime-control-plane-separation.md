# ADR 0002: Product Runtime And Control Plane Separation

Status: Accepted

## Context

The legacy app mixes administrative and runtime surfaces.

## Decision

OIS Console owns Product Administration. PITS Shell owns PITS runtime navigation. PITS Shell must not import OIS Console routes, modules or platform governance code.

## Consequences

- Product shells can be branded and scoped separately.
- Runtime users do not receive administrative navigation.
- Dependency guard tests can enforce the boundary early.
