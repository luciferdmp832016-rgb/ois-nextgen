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
