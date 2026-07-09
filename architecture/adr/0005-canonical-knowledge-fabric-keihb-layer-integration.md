# ADR 0005: Canonical Knowledge Fabric And KEIHB Layer Integration

Status: Accepted

## Context

Stage 2F introduced governed Learning Signals and Learning Candidates, but it intentionally did not create canonical Knowledge Layer records. Stage 2G needs the first canonical Knowledge Fabric foundation so OIS-powered products can read trusted context and so KEIHB can publish handbook/SOP/FAQ/playbook projections without becoming the source of truth.

## Decision

Add the KL-0 through KL-5 taxonomy, canonical knowledge item records, evidence links, Learning Candidate to Knowledge Layer mappings and KEIHB projection bundle contracts through a versioned Prisma migration.

The Stage 2G write boundary is limited to preparing `OisKnowledgeLayerMapping` records from Learning Candidates. Every mapping write is audited. Stage 2G does not add a canonical knowledge create/update endpoint, does not allow OIS Agent Widget direct canonical writes and does not enable auto-promotion.

KEIHB is modeled as a publishing/projection product over OIS Knowledge Fabric. Its bundle records include selected layer keys and item ids, but the source of truth remains OIS.

## Consequences

- OIS Core has a deterministic universal knowledge read contract for products and agent context.
- Learning Candidates can be mapped to future knowledge layers for owner review without changing canonical truth.
- KEIHB can preview handbook, SOP, FAQ and playbook bundles from OIS-controlled knowledge.
- Future promotion will require a separate ADR, rollback tests, approval gates and owner sign-off.
