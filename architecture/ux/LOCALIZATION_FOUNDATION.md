# Localization Foundation

Stage: Stage 2D - Localization Foundation and Visual Product Flow Preview

Decision label: `LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW_READY`

Stage 2D-R1 hotfix decision label: `LOCALIZATION_COVERAGE_FONT_RUNTIME_MARKER_HOTFIX_READY`

Stage 2D introduces shared English and Tiếng Việt presentation copy for OIS Console and PITS Shell so Owner review can validate language and layout before deeper implementation. The scope is UI presentation only: API routes, internal IDs, internal status codes, workflow behavior and ops markers remain stable.

## Locale Contract

| Locale | Display label | Role |
|---|---|---|
| `en` | English | Deterministic default |
| `vi` | Tiếng Việt | Initial second locale |

Missing locale values fall back to English. Missing translation keys fall back to the stable key string.

## Shared Implementation

- `packages/shared-ui/src/localization.ts` defines dictionaries, helpers, navigation labels and status-code presentation labels.
- `packages/shared-ui/src/localization-context.tsx` defines the client localization provider, hook and language selector.
- `packages/shared-ui/src/product-shell.tsx` renders the selector in the shared shell header for OIS and PITS.
- OIS and PITS `/localization` routes render a read-only catalog showing available locales, namespaces, missing/fallback counts, sample keys and the manual edit location.

Language choice is local browser presentation state only. It is not stored in the database and does not change the Core API contract.

## Covered Concepts

Initial copy covers navigation, dashboard, projects, workboard, work item, status, priority, owner, due date, next action, open, in progress, blocked, done, read-only, preview only, no data will be changed, product flow, admin/runtime, control-plane, executive dashboard, workspace intelligence, knowledge feed, Ask OIS / Copilot, language, English and Tiếng Việt.

Stage 2D-R1 expands visible UI coverage across page headings, runtime cards, dashboard/overview counts, owner registry cockpit labels, PITS project selector, workboard, work item detail and dry-run preview labels. Stable internal IDs, product IDs, workspace IDs, route names, status codes and API response codes remain language-neutral.

Stage 2E extends the shared catalog with PITS action-request labels for `PITS Action Request`, `Action request only`, `No direct mutation`, `Pending review`, confirmation/audit/rollback gates and request detail fields. Stable action types, route paths, request IDs and API status codes remain language-neutral.

## Stable Marker Rule

Localized visible copy is paired with stable language-neutral markers for runtime smoke checks and owner UAT. Stage 2D preserves:

- `Localization Foundation`
- `Language Settings`
- `English`
- `Tiếng Việt`
- `Product Flow Preview`
- `PITS Product UX Preview`
- `OIS Product UX Preview`
- `Core API source:`

The visible runtime label may localize, but the product shell also renders a stable `data-ops-marker="core-api-source"` marker containing `Core API source:` for runtime smoke checks.

## Typography

Stage 2D-R1 standardizes both app shells on a Vietnamese-safe system font stack: `system-ui`, `-apple-system`, `BlinkMacSystemFont`, `"Segoe UI"`, `"Roboto"`, `"Noto Sans"`, `"Helvetica Neue"`, `Arial`, `sans-serif`. App CSS uses accent-safe line-height and overflow behavior and avoids automatic uppercase transformation for localized eyebrow labels.

## Safety Boundary

Stage 2D and Stage 2D-R1 add no Core API endpoint, mutation endpoint, product write, LLM call, schema change, migration, seed, `prisma db push`, auth change, credential, UI `DATABASE_URL`, Prisma UI import, `/auth/demo-login` change or legacy-resource touch.
