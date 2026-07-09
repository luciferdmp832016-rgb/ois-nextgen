# Stage 2G Canonical Knowledge Fabric And KEIHB Layer Integration

Verdict: `CANONICAL_KNOWLEDGE_FABRIC_KEIHB_LAYER_INTEGRATION_READY`

R1 hotfix verdict: `STAGE_2G_R1_KNOWLEDGE_FABRIC_ENDPOINT_MARKER_CONTRACT_HOTFIX_READY`

## Scope

Stage 2G adds the platform foundation for canonical knowledge reads, evidence links, Learning Candidate to Knowledge Layer mapping, KEIHB projection bundles and an architecture mindmap manifest.

## Added

- `@ois/knowledge-fabric` package with KL-0 through KL-5 taxonomy, contracts, deterministic context helpers and demo data.
- Prisma models and migration for canonical knowledge items, evidence links, layer mappings and projection bundles.
- Seeded safe demo knowledge items, evidence links, mappings and KEIHB projection bundles.
- Core API routes for knowledge layers, items, evidence, context, read-contract example, candidate mappings, KEIHB bundles, agent knowledge context and architecture mindmap.
- OIS Console `/knowledge-fabric` page and Learning Center integration.
- Ops route manifest and public staging checks for `/learning-center`, `/knowledge-fabric` and Stage 2G read APIs.
- ADR 0005 and architecture/product docs.

## Boundaries

- No `prisma db push`.
- No production database or production credential use.
- No Stage 2G-R1 schema change or migration.
- No Product UI Prisma import.
- No OIS Agent Widget direct canonical knowledge write.
- No auto-promotion from Learning Candidate to canonical knowledge.
- The only Stage 2G mutation is audited `OisKnowledgeLayerMapping` preparation.

## Stage 2G-R1 Hotfix

Root cause: Abacus local/public smoke checks expected the KL-0 taxonomy marker on knowledge context, Learning layer mapping and KEIHB bundle list responses, but those routes only returned scoped data. Context returned the requested layer subset, mappings returned mapped target layers and KEIHB returned bundle-specific layer membership.

Fix: those responses now include global `knowledgeLayerTaxonomy` and `availableLayers` metadata with KL-0 through KL-5. KEIHB bundles continue to expose truthful per-bundle `includedLayerKeys`; the global taxonomy does not imply every bundle includes every layer.

## Published Endpoint Delta

Added source-ready Core API routes:

- `/platform/knowledge/layers`
- `/platform/knowledge/items`
- `/platform/knowledge/items/:id`
- `/platform/knowledge/evidence`
- `/platform/knowledge/context`
- `/platform/knowledge/read-contract/example`
- `/platform/learning/candidates/:id/layer-mapping`
- `/platform/learning/layer-mappings`
- `/platform/knowledge/keihb/bundles`
- `/platform/knowledge/keihb/bundles/:id`
- `/platform/knowledge/keihb/preview`
- `/platform/agent/knowledge-context`
- `/platform/architecture/mindmap`

Added source-ready UI route:

- `/knowledge-fabric`

Unchanged:

- Existing OIS/PITS public staging base URLs.
- Stage 2F Learning Signal, Candidate and Agent submission boundaries.

Do not touch:

- OIS Phase 1 app shell and custom domain.
- Abacus production database.
- Production credentials.

## Validation Checklist

Required local validation:

- `pnpm db:generate`
- `pnpm db:migrate`
- `pnpm db:seed` twice
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm e2e`
- `pnpm -r --if-present build`

Runtime sync and public browser/UAT remain owner-controlled after merge.
