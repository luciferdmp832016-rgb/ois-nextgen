# ADR 0003: Versioned Migrations Only

Status: Accepted

## Context

The current production legacy system remains live. Schema drift from ad hoc pushes would make certification unsafe.

## Decision

All schema changes use versioned Prisma migrations. `prisma db push` is forbidden.

## Consequences

- Local and CI databases can be recreated deterministically.
- Migration review is tied to ADR review.
- Seed data must be idempotent.
