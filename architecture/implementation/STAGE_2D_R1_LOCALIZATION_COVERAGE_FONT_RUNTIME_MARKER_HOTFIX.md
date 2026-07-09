# Stage 2D-R1 - Localization Coverage, Vietnamese Font and Runtime Marker Hotfix

Decision label: `LOCALIZATION_COVERAGE_FONT_RUNTIME_MARKER_HOTFIX_READY`

Base Stage 2D decision label: `LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW_READY`

Expected runtime verified label after GitHub CI, Abacus runtime sync/checks and Owner Browser/UAT: `LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW_RUNTIME_VERIFIED`

## Summary

Stage 2D-R1 fixes the Stage 2D Localization Foundation and Product Flow Preview runtime marker contract and improves owner-visible localization quality without starting Stage 2E.

The hotfix is UI-only. It adds no Core API endpoint, write endpoint, database persistence, schema change, migration or seed.

## Implemented

- Restored a deterministic language-neutral `Core API source:` ops marker in the shared product shell using `data-ops-marker="core-api-source"`.
- Kept the visible Core API source label localized while preserving the stable hidden marker for local and public runtime checks.
- Expanded shared English/Tiếng Việt dictionary coverage for page headings, runtime/status cards, dashboard counts, owner cockpit labels, PITS project list, workboard, work item detail and dry-run preview labels.
- Added exact-display localization helpers so stable API codes and unknown IDs remain unchanged.
- Added read-only OIS/PITS `/localization` catalog routes showing current locale, available locales, namespaces, missing/fallback counts, sample keys and manual edit location.
- Standardized OIS/PITS font stacks on Vietnamese-safe system fonts and added line-height/overflow safeguards for accented text.
- Updated tests, route manifest verification and Abacus public/local runtime checks for `/localization` and the stable runtime marker.

## Localization Catalog

The manual language-pack source remains `packages/shared-ui/src/localization.ts`.

The OIS and PITS `/localization` pages are read-only review surfaces. They do not enable browser editing, writes, persistence, admin actions or database access.

## Safety Boundary

Stage 2D-R1 does not implement Stage 2E, add product functionality, add Core API endpoints, add write endpoints, enable status/owner/note/priority/blocker mutations, add migrations, run seed, run `prisma db push`, change auth, change `/auth/demo-login`, touch DNS/Cloudflare, add credentials, add UI `DATABASE_URL`, import Prisma into UI shells or touch legacy resources.

## Owner Browser/UAT Checklist

1. Open `https://ois-ng.dmp247.com` and confirm OIS loads, language selector appears and switching English / Tiếng Việt updates sidebar, header, labels, cards, badges and helper text.
2. Open `https://pits-ng.dmp247.com` and confirm PITS loads, language selector appears and switching English / Tiếng Việt updates sidebar, header, project list, cards, badges and helper text.
3. Open `https://ois-ng.dmp247.com/runtime` and confirm the page loads, Core API source information is present and the stable `Core API source:` marker remains language-neutral.
4. Open `https://pits-ng.dmp247.com/runtime` and confirm the page loads, Core API source information is present and the stable `Core API source:` marker remains language-neutral.
5. Open OIS/PITS `/product-flow` and confirm existing visual preview routes still render.
6. Open PITS `/projects`, a project workboard and a work item detail page, and confirm Stage 2A/2B read-only workflows still render.
7. Open OIS/PITS `/localization` and confirm available locales, namespace counts, missing/fallback counts, sample keys and manual edit location are visible.
8. Confirm no localhost, legacy, secret/env/internal error output or enabled mutation/write/admin action appears.
