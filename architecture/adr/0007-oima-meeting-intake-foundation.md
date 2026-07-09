# ADR 0007: OIMA Meeting Intake Foundation

## Status

Accepted for Stage 2J / OIMA-1.

## Context

Stage 2I hardened OIMA as a Powered by OIS product shell. The next product step is the first real meeting-intake workflow, but OIMA must remain transcript-first, audio-optional and truthful about runtime limits.

OIMA needs persisted meeting records and source file metadata so users can register meetings and attach transcript/audio references. It must not create fake analysis, parse transcripts, process audio, activate Listener Mode, implement voice clone or call LLM/OpenRouter.

## Decision

Add versioned Prisma migration `202607090004_stage_2j_oima_meeting_intake_foundation` with:

- `OimaMeetingRecord`
- `OimaMeetingSourceFile`
- `OimaMeetingSourceMode`
- `OimaMeetingStatus`
- `OimaMeetingSourceFileType`
- `OimaMeetingSourceUploadStatus`

Meeting records are scoped by `organizationId` and `workspaceId`. Source files are scoped through their parent meeting. Sensitive intake writes are audited through `AuditRecord`.

The API supports:

- Listing meetings.
- Creating/registering a meeting.
- Reading meeting detail.
- Registering meeting source files.
- Updating meeting status within the allowed intake status taxonomy.

## Boundaries

Stage 2J supports `TRANSCRIPT_ONLY` as the primary runtime flow. `TRANSCRIPT_AND_AUDIO` can register optional audio metadata. `AUDIO_ONLY` can be accepted as metadata and is marked for review. `LISTENER_CAPTURED` remains planned/not-runtime.

Stage 2J does not add:

- Transcript parsing or semantic extraction.
- Audio processing or transcription.
- Meeting issues, decisions, actions or risks.
- OIS Agent meeting analysis.
- Listener Mode runtime.
- Live speaking agent behavior.
- Voice clone or impersonation.
- LLM/OpenRouter calls.
- Production secrets or production database access.

## Consequences

OIMA becomes a real intake product workflow while preserving the Canonical Knowledge Fabric boundary. Later OIMA stages can build transcript processing and analysis on top of these records without backfilling fake data.

Next recommended stage: `OIMA-2 Transcript Processing`.
