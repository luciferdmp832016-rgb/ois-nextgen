# Canonical Knowledge Fabric

Stage 2G defines the OIS Canonical Knowledge Fabric as the governed source of reusable product and agent context. It is a foundation only: it stores safe demo canonical items and evidence links, but promotion from learning into canonical truth remains disabled.

## Knowledge Layers

| Layer | Name | Stage 2G rule |
|---|---|---|
| KL-0 | Legal / Regulatory Core | Strong approval and evidence required. |
| KL-1 | Industry Core | Evidence required for generalized industry patterns. |
| KL-2 | Organization Core | Executive intent, policy and authority model require review. |
| KL-3 | Product Knowledge Pack | Product-specific pack for OIS, PITS, KEIHB, ICR, CSAgent and future products. |
| KL-4 | Workspace / Project Overlay | Local workspace, client, project and building overlays. |
| KL-5 | Live Operational Signals | Signal summaries; never canonical truth by themselves. |

## Contracts

- `OisCanonicalKnowledgeItem` stores layer, scope, item type, title, summary, content JSON, status, provenance and sensitivity.
- `OisKnowledgeEvidenceLink` links canonical items or Learning Candidates to evidence source metadata.
- `OisKnowledgeLayerMapping` maps a Learning Candidate to a target knowledge layer and item type for future owner review.
- `OisKnowledgeProjectionBundle` models product-facing bundles such as KEIHB handbook/SOP/FAQ/playbook views.

## Boundary

Stage 2G allows read-only knowledge APIs and audited mapping preparation only. There is no canonical knowledge mutation endpoint, no widget direct canonical write and no auto-promotion.
