# KEIHB Layer Integration

Stage 2G integrates KEIHB as a publishing projection over OIS Knowledge Fabric.

KEIHB does not own canonical truth. The source of truth remains OIS Canonical Knowledge Fabric, and KEIHB bundles reference selected knowledge layers and item ids.

## Projection Bundles

The seed includes safe demo bundles for:

- Building Management Handbook
- BQL SOP
- Resident FAQ
- Technical Team Playbook

Each bundle records:

- `bundleKey`
- `productKey = KEIHB`
- target audience and role
- locale
- included KL layer keys
- included item ids
- selection rules
- snapshot version
- projection status
- manifest JSON with `sourceOfTruth = OIS Knowledge Fabric`

## API Surface

- `GET /platform/knowledge/keihb/bundles`
- `GET /platform/knowledge/keihb/bundles/:id`
- `GET /platform/knowledge/keihb/preview`

These routes are deterministic and read-only.

## Stage 2G-R1 Marker Contract

KEIHB bundle responses expose global `knowledgeLayerTaxonomy` and `availableLayers` metadata so staging smoke checks can verify the full Canonical Knowledge Fabric taxonomy.

Each bundle still exposes its own `includedLayerKeys`. A bundle only claims the layers it actually projects; the global taxonomy does not mean every KEIHB bundle includes KL-0.
