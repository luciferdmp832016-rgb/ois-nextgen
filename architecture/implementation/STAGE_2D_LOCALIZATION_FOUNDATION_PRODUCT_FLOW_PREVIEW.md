# Stage 2D - Localization Foundation and Visual Product Flow Preview

Decision label: `LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW_READY`

Stage 2D-R1 hotfix decision label: `LOCALIZATION_COVERAGE_FONT_RUNTIME_MARKER_HOTFIX_READY`

Expected runtime verified label after GitHub CI, Abacus runtime sync/checks and Owner Browser/UAT: `LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW_RUNTIME_VERIFIED`

## Summary

Stage 2D adds a shared English/Tiếng Việt localization foundation and upgrades the existing OIS/PITS `/product-flow` routes into visual product-flow previews for owner review.

The implementation is UI-only and keeps workflow/API behavior unchanged.

Stage 2D-R1 restores the stable `Core API source:` runtime marker, expands visible localization coverage, adds OIS/PITS `/localization` read-only catalog routes and standardizes Vietnamese-safe typography.

## Implemented

- Shared localization dictionary and fallback helpers.
- Shared localization context, hook and language selector.
- Language selector in the OIS/PITS shared shell header.
- Visual OIS Product Flow Preview.
- Visual PITS Product Flow Preview.
- Stable hidden/server-rendered markers for localized surfaces.
- Tests for dictionary fallback, selector markers, product-flow previews, Stage 2A/2B path preservation and safety boundaries.
- Abacus smoke markers for localization and visual product-flow previews.

## Product Flow Routes

OIS Console `/product-flow` shows `Product Flow Preview`, `OIS Product UX Preview`, `OIS Product UX Blueprint`, `Executive Dashboard`, `Workspace Intelligence Dashboard`, `Meeting/Document Knowledge Feed`, `Knowledge Detail`, `Ask OIS / Copilot` and `Runtime/Admin`.

PITS Shell `/product-flow` shows `Product Flow Preview`, `PITS Product UX Preview`, `PITS Product UX Blueprint`, `PITS Home`, `Projects List`, `Project Detail`, `Project Workboard`, `Work Item Detail`, `Dry-run Action Preview` and `Runtime/Admin`.

## Safety Boundary

Stage 2D does not implement Stage 2E, add Core API endpoints, add write endpoints, enable status/owner/note/priority/blocker mutations, add migrations, run seed, run `prisma db push`, change auth, change `/auth/demo-login`, touch DNS/Cloudflare, add credentials, add UI `DATABASE_URL`, import Prisma into UI shells or touch legacy resources.

## Owner Browser/UAT Checklist

1. Open `https://ois-ng.dmp247.com` and confirm OIS Console loads with a language selector.
2. Switch between English and Tiếng Việt and confirm common visible labels change without breaking layout.
3. Open `https://ois-ng.dmp247.com/product-flow` and confirm the OIS Product Flow Preview appears with visual screen-flow cards.
4. Confirm the OIS flow includes Executive Dashboard, Workspace List, Workspace Intelligence Dashboard, Meeting/Document Knowledge Feed, Knowledge Detail, Ask OIS / Copilot and Runtime/Admin.
5. Open `https://pits-ng.dmp247.com` and confirm PITS Shell loads with a language selector.
6. Switch between English and Tiếng Việt and confirm common visible labels change without breaking layout.
7. Open `https://pits-ng.dmp247.com/product-flow` and confirm the PITS Product Flow Preview appears with PITS Home, Projects List, Project Detail, Project Workboard, Work Item Detail, Dry-run Action Preview and Runtime/Admin.
8. Open `https://pits-ng.dmp247.com/projects` and confirm existing Stage 2A workboard and Stage 2B work item detail/dry-run paths still work.
9. Confirm no localhost links, legacy links, secret/env/internal error output or enabled mutation/write/admin action appears.
