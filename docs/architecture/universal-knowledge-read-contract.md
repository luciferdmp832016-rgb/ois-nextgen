# Universal Knowledge Read Contract

The universal knowledge read contract lets OIS-powered products and the OIS Agent request deterministic knowledge context from OIS Core.

## Fields

| Field | Purpose |
|---|---|
| `productKey` | Product requesting context, such as `OIS_PLATFORM`, `PITS` or `KEIHB`. |
| `organizationId` | Tenant organization scope. |
| `workspaceId` | Optional workspace scope. |
| `projectId` | Optional project scope. |
| `role` | Requesting role or persona. |
| `audience` | Output audience label. |
| `locale` | Locale for future localization-aware projection. |
| `query` | Optional query text. |
| `requestedLayers` | KL layer keys to include. |
| `entityRefs` | Related entities for future filtering. |
| `includeEvidence` | Whether evidence links should be returned. |
| `includeDrafts` | Whether draft knowledge items may be returned. |
| `maxItems` | Deterministic item limit. |

## Routes

- `GET /platform/knowledge/context`
- `GET /platform/knowledge/read-contract/example`
- `POST /platform/agent/knowledge-context`

The agent route is a read path. It returns `noLlmCall=true`, `noCanonicalWrite=true` and `autoPromotionEnabled=false`.
