# Product Flow Visual Preview

Stage: Stage 2D - Localization Foundation and Visual Product Flow Preview

Decision label: `LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW_READY`

Stage 2D upgrades the existing OIS and PITS `/product-flow` routes from text-heavy draft guidance into visual owner-review screen-flow previews.

The previews are read-only and preview-only. They do not change data, execute product actions, call LLMs or add Core API endpoints.

## Screen Card Contract

Each preview card shows:

- Page purpose
- Primary user
- Key sections
- Main action
- Current stage status
- Owner review note
- Product/admin-runtime classification

Current stage status is visible copy only, such as `Implemented`, `Read-only`, `Preview only` and `Future`. These labels do not change internal workflow codes.

## OIS Preview Flow

The OIS preview covers:

- Executive Dashboard
- Workspace List
- Workspace Intelligence Dashboard
- Meeting/Document Knowledge Feed
- Knowledge Detail
- Ask OIS / Copilot
- Runtime/Admin

OIS product pages are framed as future organizational intelligence surfaces. Registry, runtime and admin views stay separated from daily product usage.

## PITS Preview Flow

The PITS preview covers:

- PITS Home
- Projects List
- Project Detail
- Project Workboard
- Work Item Detail
- Dry-run Action Preview
- Runtime/Admin

The PITS preview preserves the existing Stage 2A workboard and Stage 2B work item detail/dry-run slices as read-only functional surfaces. It does not enable status, owner, note, priority or blocker mutations.

## Localization Behavior

The preview cards consume the shared product-shell localization context. Switching language changes available visible copy while stable hidden/server-rendered markers keep smoke checks deterministic.

## Safety Boundary

No product workflow writes are enabled. No admin action is executable. No endpoint, schema, seed, auth, DNS, credential or UI database boundary change is introduced.
