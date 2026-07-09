# KEIHB Knowledge Publishing Product

KEIHB is modeled as an OIS-powered knowledge publishing product. In Stage 2G it reads OIS Knowledge Fabric bundle projections and does not write canonical knowledge.

## Stage 2G Scope

- Preview KEIHB handbook, SOP, FAQ and playbook bundles.
- Bind bundles to KL layer keys and canonical item ids.
- Keep OIS Knowledge Fabric as the source of truth.
- Keep all KEIHB bundle routes read-only.

## Out Of Scope

- KEIHB authoring workflows.
- Publishing approval workflow.
- Canonical knowledge promotion.
- Public resident/customer runtime.
- Production data import.

Future KEIHB authoring or publishing writes require a separate ADR, audited write boundary, rollback plan and owner approval.
