# ADR 0008: OIMA Transcript Processing Foundation

## Status

Accepted for Stage 2K / OIMA-2.

## Context

Stage 2J made OIMA a real meeting-intake workflow with workspace-scoped meeting records and source file metadata. The next product step is transcript processing, but the boundary must remain truthful:

- Transcript-first.
- Audio-optional metadata only.
- Raw transcript evidence is immutable.
- Normalized or corrected transcript versions are separate from raw evidence.
- No semantic meeting analysis, issue/decision/action/risk extraction, audio processing, Listener Mode, voice clone or LLM/OpenRouter calls.

Microsoft Teams-style transcripts may contain timestamps, speaker names and text that are imperfect but still evidence. OIMA needs to preserve the captured raw transcript while producing deterministic segments that can be reviewed later.

## Decision

Add versioned Prisma migration `202607090005_stage_2k_oima_transcript_processing_foundation` with:

- `OimaTranscriptVersion`
- `OimaTranscriptParseRun`
- `OimaTranscriptSegment`
- `OimaTranscriptParseWarning`
- transcript version, parser, parse-run status and warning severity enums

Raw transcript versions are immutable and stored separately from normalized transcript versions. Parse runs reference both evidence versions and create ordered transcript segments. Segment records preserve raw speaker, timestamp, raw text and source order while separately storing normalized speaker and normalized text. Parse warnings record missing speaker/timestamp structure, empty segments and other deterministic review reasons.

The API supports:

- Processing a registered meeting transcript.
- Reading transcript parse status.
- Listing transcript versions.
- Listing transcript segments.
- Listing transcript warnings.
- Reading the OIMA transcript processing contract.

## Boundaries

Stage 2K supports deterministic parsing of provided transcript text for `TRANSCRIPT_ONLY` and transcript-bearing `TRANSCRIPT_AND_AUDIO` meetings. `AUDIO_ONLY` remains metadata/review oriented. `LISTENER_CAPTURED` remains future-only.

Stage 2K does not add:

- Binary file storage.
- Audio transcription or diarization.
- OIS Agent meeting analysis.
- Issues, decisions, actions or risks.
- Subject clarification workflow.
- Learning Candidate creation from meetings.
- Canonical knowledge writes or auto-promotion.
- Listener Mode runtime.
- Live speaking agent behavior.
- Voice clone or impersonation.
- LLM/OpenRouter calls.
- Production secrets or production database access.

## Consequences

OIMA now has a real transcript evidence layer that later OIMA stages can safely build on. Future semantic analysis can reference immutable raw evidence, normalized transcript evidence, parse-run metadata, ordered segments and warnings without backfilling fake analysis or rewriting source transcript content.

Next recommended stage: `OIMA-3 OIS Agent Offline Analysis`.
