# Stage 2J / OIMA-1 Meeting Intake Foundation

Verdict: `STAGE_2J_OIMA_MEETING_INTAKE_FOUNDATION_READY`

## Summary

Stage 2J / OIMA-1 turns OIMA from a product shell into the first real meeting-intake workflow.

OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS.

The implementation remains transcript-first and audio-optional. It does not add Listener Mode, voice clone, transcript processing, audio processing, OIS Agent meeting analysis or LLM/OpenRouter calls.

## Data Model

Versioned migration: `202607090004_stage_2j_oima_meeting_intake_foundation`

ADR: `architecture/adr/0007-oima-meeting-intake-foundation.md`

New persisted models:

- `OimaMeetingRecord`
- `OimaMeetingSourceFile`

New enums:

- `OimaMeetingSourceMode`: `TRANSCRIPT_ONLY`, `AUDIO_ONLY`, `TRANSCRIPT_AND_AUDIO`, `LISTENER_CAPTURED`
- `OimaMeetingStatus`: `DRAFT`, `UPLOADED`, `READY_FOR_PROCESSING`, `NEEDS_REVIEW`, `FAILED`
- `OimaMeetingSourceFileType`: `TRANSCRIPT`, `AUDIO`, `PARTICIPANT_LIST`, `OTHER`
- `OimaMeetingSourceUploadStatus`: `REGISTERED`, `UPLOADED`, `FAILED`

Meeting records are scoped by `organizationId` and `workspaceId`. Source files are scoped through their parent meeting.

## API

New Core API routes:

- `GET /platform/oima/meetings`
- `POST /platform/oima/meetings`
- `GET /platform/oima/meetings/:id`
- `POST /platform/oima/meetings/:id/source-files`
- `PATCH /platform/oima/meetings/:id/status`

Every sensitive meeting-intake write creates an `AuditRecord`.

## UI

New OIS Console routes:

- `/oima/meetings`
- `/oima/meetings/new`
- `/oima/meetings/[id]`

The UI supports Meeting Library, Upload/Register Meeting and Meeting Detail. It shows source file metadata, transcript/audio availability and processing status placeholders.

## Runtime Boundary

Supported now:

- Meeting Library.
- Meeting record creation.
- Transcript source file metadata registration.
- Optional audio source file metadata registration.
- Audio-only metadata registration with review status.
- Meeting detail read.
- Intake status placeholders.

Not runtime:

- Transcript parsing.
- Audio processing.
- OIS Agent meeting analysis.
- Issues, decisions, actions or risks.
- Listener Mode.
- Live speaking agent behavior.
- Voice clone or impersonation.
- LLM/OpenRouter calls.
- Fake meeting analytics or seeded fake meeting data.

## Source Modes

- `TRANSCRIPT_ONLY`: primary supported flow.
- `TRANSCRIPT_AND_AUDIO`: supported with transcript required and optional audio metadata.
- `AUDIO_ONLY`: metadata may be registered and is marked for review.
- `LISTENER_CAPTURED`: planned/not-runtime.

## Next Recommended Stage

Next recommended stage: `OIMA-2 Transcript Processing`.
