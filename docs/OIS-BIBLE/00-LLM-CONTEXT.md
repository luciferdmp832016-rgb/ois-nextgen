# OIS Bible 00: LLM Context

This document is the first read for agents working on OIS NextGen. It points to canonical architecture documents instead of replacing them.

## Current Stage

- Current checkpoint: Stage 0D platform, cloud test and Abacus readiness foundation.
- Prior checkpoint: Stage 0C exact-port local runtime gate passed.
- Active implementation scope: Stage A platform kernel only.
- Current runtime apps: Core API, OIS Console and PITS Shell.

## Non-Negotiables

- Do not connect to Abacus production database or storage.
- Do not use production credentials.
- Do not run `prisma db push`.
- Use versioned Prisma migrations for every schema change.
- Do not change schema without an ADR.
- Product Runtime is separate from Product Administration.
- Product UI cannot import Prisma.
- Every module declares Product, Layer, Scope, Realm and Lifecycle.
- Every tenant record is scoped.
- Every sensitive write is audited.
- Intelligence claims require evidence and provenance.

## Canonical Sources

- Agent constitution: `AGENTS.md`
- Architecture constitution: `architecture/constitution/OIS_ARCHITECTURE_CONSTITUTION_V1.md`
- Runtime separation ADR: `architecture/adr/0002-product-runtime-control-plane-separation.md`
- Migration ADR: `architecture/adr/0003-versioned-migrations-only.md`
- Current status: `architecture/implementation/IMPLEMENTATION_STATUS.md`
- Stage 0C evidence: `architecture/implementation/STAGE_0C_CLOSURE_REPORT.md`
- Stage 0D report: `architecture/implementation/STAGE_0D_PLATFORM_CLOUD_ABACUS_READINESS.md`

## Agent Rule

When a requested change would add PITS, Knowledge, Learning, Wisdom or Intelligence behavior, stop and record that it is outside Stage A unless the task includes Phase 2 rules and Phase 3 regression inputs.
