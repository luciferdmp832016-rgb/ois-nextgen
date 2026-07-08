# OIS Product UX Blueprint

Stage: Stage 2C - Product UX Blueprint and Screen Flow Draft Gate

Decision label: `PRODUCT_UX_BLUEPRINT_SCREEN_FLOW_DRAFT_READY`

## Purpose

OIS should become the organizational intelligence product for owners, executives and managers. The current OIS Console is useful for platform administration, registry readiness and runtime checks, but the product experience must become a daily intelligence workflow.

This blueprint defines the intended OIS product workflow before deeper implementation. It is a draft gate for owner review and approval. It does not enable writes, ingestion, LLM answers or production intelligence claims.

## Product Promise

OIS helps a manager answer:

- What changed today?
- What risks need attention?
- What decisions are waiting?
- What commitments are due?
- Which projects or people need follow-up?
- What evidence supports an answer?
- When is there not enough evidence to answer?

## Primary Users

- CEO/owner: reviews risks, decisions, commitments and strategic signals.
- Manager: reviews workspace intelligence, meetings, documents and follow-ups.
- Admin/operator: maintains registry/runtime readiness in separate control-plane surfaces.

## Current Stage Boundary

Stage 2C is read-only and draft-only.

- OIS product pages are blueprint previews only.
- No LLM, ingestion, vector search, write endpoint or knowledge mutation is added.
- No intelligence claim is made without future evidence/provenance support.
- Existing admin/control-plane pages remain available.

## Daily Product Workflow

1. User opens OIS Home / Executive Dashboard.
2. User sees changed items, key risks, decisions waiting and commitments due.
3. User selects a workspace.
4. User reviews Workspace Intelligence Dashboard.
5. User opens Meeting/Document Knowledge Feed.
6. User opens Knowledge Detail to inspect evidence.
7. User asks OIS/Copilot only when evidence-backed answers are available in future stages.
8. Admin/runtime diagnostics remain separate from the main product workflow.

## Screen Flow

`OIS Home -> Workspace List -> Workspace Intelligence Dashboard -> Meeting/Document Knowledge Feed -> Knowledge Detail -> Ask OIS/Copilot`

Admin path:

`Dashboard/Runtime -> Registry readiness -> Runtime health -> Admin boundary -> Owner review`

## Screen Drafts

### 1. OIS Home / Executive Dashboard

Purpose:

- Give CEO/manager an organizational intelligence overview.

Draft sections:

- What changed today.
- Key risks.
- Decisions waiting.
- Commitments due.
- Projects needing attention.
- Knowledge highlights.
- Suggested questions to ask.

Current Stage 2C behavior:

- Product-flow preview documents this screen.
- Existing OIS root/dashboard remains control-plane focused until owner approves product direction.

Future implementation notes:

- Add only evidence-backed summaries.
- Show "insufficient evidence" when sources are missing.

### 2. Workspace List

Purpose:

- Select an organization/workspace context.

Draft sections:

- Workspace cards.
- Data freshness.
- Knowledge coverage.
- Meeting/document counts.
- Risk, decision and commitment counts.

Current Stage 2C behavior:

- Existing workspace pages remain registry/admin views.
- Product-flow preview explains the intended product workspace selector.

Future implementation notes:

- Add data freshness only after ingestion telemetry exists.
- Add knowledge coverage only after source inventory is available.

### 3. Workspace Intelligence Dashboard

Purpose:

- Main OIS product page for one workspace.

Draft sections:

- Executive summary.
- Current risks.
- Decisions.
- Commitments.
- People, departments and projects involved.
- Recent meetings/documents.
- Knowledge coverage.
- Ask Copilot entry point.

Current Stage 2C behavior:

- Blueprint only.
- No generated intelligence is shown.

Future implementation notes:

- Require evidence/provenance model before rendering intelligence claims.
- Tie workspace scope to tenant and permission model.

### 4. Meeting/Document Knowledge Feed

Purpose:

- Show ingested knowledge sources and extracted insights.

Draft sections:

- Meeting/document list.
- Status.
- Extracted decisions.
- Commitments.
- Risks.
- Entity links.
- Evidence/source snippets concept.

Current Stage 2C behavior:

- Blueprint only.
- No ingestion or extraction is implemented.

Future implementation notes:

- Add source status after ingestion pipeline and tests.
- Keep snippets short and cite source provenance.

### 5. Knowledge Detail

Purpose:

- Inspect one knowledge item with evidence.

Draft sections:

- Summary.
- Evidence.
- Source transcript/document.
- Related entities.
- Related decisions/risks/commitments.
- Confidence/source quality concept.

Current Stage 2C behavior:

- Blueprint only.
- No source documents are loaded.

Future implementation notes:

- Add confidence/source quality only after scoring rules are approved.
- Require source access boundaries and redaction policy.

### 6. Copilot / Ask OIS

Purpose:

- Let a manager ask questions against organizational knowledge.

Draft sections:

- Suggested questions.
- Answer with citations/evidence.
- Related risks, decisions and commitments.
- Fallback when evidence is insufficient.
- No hallucinated answer rule.

Current Stage 2C behavior:

- Blueprint only.
- No LLM call is made.

Future implementation notes:

- Add an AI gateway ADR before any LLM runtime.
- Every answer must include evidence and provenance.
- Refuse or defer when evidence is insufficient.

### 7. OIS Admin/Runtime Area

Purpose:

- Keep registry, runtime and admin diagnostics separate from the main product usage path.

Draft sections:

- Platform overview.
- Products and modules.
- Workspaces registry.
- Runtime status.
- Owner review.
- Admin boundary.
- Product UAT/gap map.

Current Stage 2C behavior:

- Existing OIS Console pages remain available for administration.
- They are not the intended final daily product home.

## Product vs Admin Boundary

Product pages:

- OIS Home / Executive Dashboard.
- Workspace List.
- Workspace Intelligence Dashboard.
- Meeting/Document Knowledge Feed.
- Knowledge Detail.
- Copilot / Ask OIS.

Admin/control-plane pages:

- Current Dashboard.
- Products and modules registry.
- Workspaces registry.
- Runtime status.
- Owner review queue.
- Admin boundary.

Debug/diagnostic pages:

- Should live under runtime/admin/diagnostics.
- Must not dominate the product home experience.

## Owner Approval Checklist

- OIS product starts with business intelligence, not registry diagnostics.
- Executive Dashboard answers what changed, what is risky and what is waiting.
- Workspace pages separate business intelligence from platform administration.
- Knowledge Feed and Detail require evidence/provenance.
- Ask OIS/Copilot has a clear no-hallucination rule.
- Admin/runtime/control-plane pages remain accessible but secondary.
- Future implementation sequence is approved before coding deeper functionality.

## Proposed Next Stages After UX Approval

- Stage 2D-OIS: OIS executive dashboard read-only product shell.
- Stage 2E-OIS: Workspace intelligence dashboard read-only draft.
- Stage 2F-OIS: Knowledge feed/detail evidence model draft, read-only.
- Stage 2G-OIS: AI gateway and evidence/provenance ADR before Copilot implementation.
