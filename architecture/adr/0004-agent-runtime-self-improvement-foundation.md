# ADR 0004: Agent Runtime And Self-Improvement Foundation

Status: Accepted

## Context

Stage 2F needs a shared OIS Agent Runtime and governed Self-Improvement Engine foundation. Ecosystem products must contribute operational learning signals to OIS Core without writing directly to Master Knowledge, the Entity Registry, Decisions, Commitments or Risks.

## Decision

Add platform-level product registry records, tenant-scoped learning signals, learning candidates, learning policies and agent runtime contract tables through a versioned Prisma migration. The canonical learning flow is:

`Input -> OIS Agent Widget -> Learning Signal -> Learning Candidate -> Confidence -> Policy -> Review/Auto-log -> Future Knowledge Promotion`.

The Stage 2F implementation may create signals, candidates, policies, agent sessions/messages/feedback/submissions and audit records. It must not promote candidate content into canonical knowledge-layer tables.

## Consequences

- OIS Core becomes the shared learning brain for OIS-powered products.
- Products can attach the OIS Agent Widget through product context adapters.
- CEO/BOD/C-level intent is high authority but still governed by confidence, policy, review and audit.
- AUTO_LEARN means candidate status/log only in Stage 2F; canonical promotion remains future work.
