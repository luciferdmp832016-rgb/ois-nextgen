# OIS NextGen Agent Constitution

Non-negotiable rules for all agents and contributors:

- The legacy source in `../handoff-phase1/source-reference` is read-only reference.
- Never connect to the Abacus production database.
- Never use production credentials.
- Never run `prisma db push`.
- All schema changes use versioned Prisma migrations.
- No schema change without an ADR.
- Product Runtime is separate from Product Administration.
- Product UI cannot import Prisma.
- Every module declares Product, Layer, Scope, Realm and Lifecycle.
- Every tenant record is scoped.
- Every sensitive write is audited.
- Every migration is idempotent.
- Intelligence claims require evidence and provenance.
- Run typecheck, lint and tests before completion.
- Compute Once. Reuse Forever.

Stage A scope is the platform kernel only. Do not port complex PITS, Knowledge, Learning, Wisdom or Intelligence behavior before Phase 2 rules and Phase 3 tests arrive.
