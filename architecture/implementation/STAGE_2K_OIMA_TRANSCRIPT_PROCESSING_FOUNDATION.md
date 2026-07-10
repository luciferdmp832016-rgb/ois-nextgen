# Stage 2K / OIMA-2 Transcript Processing Foundation

Verdict: `STAGE_2K_OIMA_TRANSCRIPT_PROCESSING_FOUNDATION_READY`

## Summary

Stage 2K / OIMA-2 adds the first real transcript processing foundation for OIMA.

OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS. This stage keeps the product transcript-first and audio-optional while adding deterministic transcript evidence handling.

Stage 2K does not add audio processing, Listener Mode, voice clone, semantic meeting analysis, issue/decision/action/risk extraction, Learning Candidate creation from meetings, canonical knowledge writes or LLM/OpenRouter calls.

## Data Model

ADR: `architecture/adr/0008-oima-transcript-processing-foundation.md`

Versioned migration: `202607090005_stage_2k_oima_transcript_processing_foundation`

New persisted models:

- `OimaTranscriptVersion`
- `OimaTranscriptParseRun`
- `OimaTranscriptSegment`
- `OimaTranscriptParseWarning`

New enums:

- `OimaTranscriptVersionType`
- `OimaTranscriptParserType`
- `OimaTranscriptParseRunStatus`
- `OimaTranscriptParseWarningSeverity`

Raw transcript versions are immutable. Normalized transcript versions are separate records. Parse runs create ordered segments and warnings without overwriting raw evidence.

## API Contract

New OIMA transcript endpoints:

- `GET /platform/oima/transcripts/contract`
- `POST /platform/oima/meetings/:id/transcript/process`
- `GET /platform/oima/meetings/:id/transcript/status`
- `GET /platform/oima/meetings/:id/transcript/versions`
- `GET /platform/oima/meetings/:id/transcript/segments`
- `GET /platform/oima/meetings/:id/transcript/warnings`

The transcript contract exposes version types, parser types, parse-run statuses, warning severities and safety flags such as `rawTranscriptImmutable=true`, `normalizedTranscriptSeparate=true`, `audioProcessingImplemented=false`, `meetingAnalyticsImplemented=false`, `issueDecisionActionRiskExtractionImplemented=false` and `realLlmCallsEnabled=false`.

## UI

OIS Console meeting detail pages now include transcript processing panels:

- transcript parse status
- segment count
- warning count
- confidence score
- transcript version list
- processing/reprocessing action
- ordered transcript timeline
- warning list
- planned placeholders for OIS Agent Analysis, Subject Clarification, Dashboard and Listener Mode

OIMA overview and meeting pages mark Meeting Library, Upload Meeting and Transcript Processing as available now, while keeping analysis/listener/audio/voice runtime planned or blocked.

## Safety

Stage 2K preserves the OIMA product boundary:

- no fake meeting analysis
- no fake transcript analytics
- no issue/decision/action/risk extraction
- no automatic Learning Candidate promotion
- no canonical knowledge writes
- no direct OIS Agent/Widget canonical writes
- no audio processing
- no Listener Mode runtime
- no voice clone
- no LLM/OpenRouter calls
- no production secrets
- no `prisma db push`

## Published Endpoint Delta

Added:

- `/platform/oima/transcripts/contract`
- `/platform/oima/meetings/:id/transcript/process`
- `/platform/oima/meetings/:id/transcript/status`
- `/platform/oima/meetings/:id/transcript/versions`
- `/platform/oima/meetings/:id/transcript/segments`
- `/platform/oima/meetings/:id/transcript/warnings`

Changed:

- `/platform/products/code/OIMA`
- `/platform/oima/overview`
- `/platform/oima/roadmap`
- `/platform/oima/boundary`
- `/oima`
- `/oima/meetings`
- `/oima/meetings/new`
- `/oima/meetings/:id`

Unchanged:

- Knowledge Fabric and Learning Center canonical knowledge boundaries.
- OIMA Meeting Intake list/create/detail/source-file/status endpoints.

Do not touch:

- Legacy Phase 1 endpoints.
- Abacus production database or credentials.

## Validation

Required validation for handoff:

- `pnpm db:generate`
- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm e2e`
- `pnpm -r --if-present build`
- UI route manifest verification
- `bash -n` for updated Abacus scripts
- synthetic OIMA transcript marker check
- `git diff --check`

`pnpm db:migrate` should only be run against the approved non-production database during Abacus deploy because this stage adds a versioned migration.

Next recommended stage: `OIMA-3 OIS Agent Offline Analysis`.
