"use client";

import { useState, type FormEvent } from "react";

type MeetingIntakeFormProps = {
  coreApiUrl: string;
  organizationId: string;
  workspaceId: string;
};

type SubmitState =
  | { status: "idle"; message: string }
  | { status: "submitting"; message: string }
  | { status: "success"; message: string; meetingId: string }
  | { status: "error"; message: string };

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function optionalFilePayload(formData: FormData, prefix: "transcript" | "audio", fileType: "TRANSCRIPT" | "AUDIO") {
  const originalFilename = formValue(formData, `${prefix}Filename`);
  const storageKey = formValue(formData, `${prefix}StorageKey`);
  const mimeType = formValue(formData, `${prefix}MimeType`);
  const sizeBytes = Number(formValue(formData, `${prefix}SizeBytes`) || "0");
  const checksum = formValue(formData, `${prefix}Checksum`);

  if (!originalFilename && !storageKey) {
    return null;
  }

  return {
    fileType,
    originalFilename,
    storageKey,
    mimeType: mimeType || undefined,
    sizeBytes: Number.isFinite(sizeBytes) && sizeBytes > 0 ? Math.floor(sizeBytes) : 0,
    checksum: checksum || undefined,
    uploadStatus: "REGISTERED"
  };
}

export function MeetingIntakeForm({ coreApiUrl, organizationId, workspaceId }: MeetingIntakeFormProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({ status: "idle", message: "Ready for transcript-first meeting registration." });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const sourceMode = formValue(formData, "sourceMode");
    const transcript = optionalFilePayload(formData, "transcript", "TRANSCRIPT");
    const audio = optionalFilePayload(formData, "audio", "AUDIO");
    const sourceFiles = [transcript, audio].filter(Boolean);

    if (sourceMode === "LISTENER_CAPTURED") {
      setSubmitState({ status: "error", message: "Listener Mode remains planned/not-runtime in OIMA-2." });
      return;
    }

    if (transcript && (!transcript.originalFilename || !transcript.storageKey)) {
      setSubmitState({ status: "error", message: "Transcript metadata requires both a filename and storage key or URL." });
      return;
    }

    if (audio && (!audio.originalFilename || !audio.storageKey)) {
      setSubmitState({ status: "error", message: "Audio metadata requires both a filename and storage key or URL." });
      return;
    }

    if ((sourceMode === "TRANSCRIPT_ONLY" || sourceMode === "TRANSCRIPT_AND_AUDIO") && !transcript) {
      setSubmitState({ status: "error", message: "Transcript metadata is required for transcript-first intake." });
      return;
    }

    if (sourceMode === "TRANSCRIPT_ONLY" && audio) {
      setSubmitState({ status: "error", message: "Use TRANSCRIPT_AND_AUDIO when optional audio metadata is included." });
      return;
    }

    if (sourceMode === "AUDIO_ONLY" && !audio) {
      setSubmitState({ status: "error", message: "AUDIO_ONLY requires audio metadata and will be marked for review." });
      return;
    }

    setSubmitState({ status: "submitting", message: "Registering meeting intake metadata." });

    try {
      const response = await fetch(`${coreApiUrl}/platform/oima/meetings`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          organizationId,
          workspaceId,
          title: formValue(formData, "title"),
          meetingDate: formValue(formData, "meetingDate"),
          startTime: formValue(formData, "startTime") || undefined,
          endTime: formValue(formData, "endTime") || undefined,
          sourceMode,
          participantCount: Number(formValue(formData, "participantCount") || "0"),
          sourceFiles
        })
      });
      const body = (await response.json().catch(() => null)) as { meeting?: { id?: string }; error?: { message?: string } } | null;

      if (!response.ok || !body?.meeting?.id) {
        setSubmitState({ status: "error", message: body?.error?.message ?? `Core API returned HTTP ${response.status}.` });
        return;
      }

      setSubmitState({
        status: "success",
        message: "Meeting registered. Open the detail page to process the transcript in OIMA-2.",
        meetingId: body.meeting.id
      });
    } catch (error) {
      setSubmitState({ status: "error", message: error instanceof Error ? error.message : "Core API request failed." });
    }
  }

  return (
    <form className="oima-intake-form" data-oima="Create Meeting Form" onSubmit={handleSubmit}>
      <input name="organizationId" type="hidden" value={organizationId} />
      <input name="workspaceId" type="hidden" value={workspaceId} />

      <div className="oima-form-grid">
        <label>
          Title
          <input name="title" placeholder="Weekly operating review" required />
        </label>
        <label>
          Meeting date
          <input name="meetingDate" required type="date" />
        </label>
        <label>
          Start time
          <input name="startTime" type="time" />
        </label>
        <label>
          End time
          <input name="endTime" type="time" />
        </label>
        <label>
          Source mode
          <select defaultValue="TRANSCRIPT_ONLY" name="sourceMode">
            <option value="TRANSCRIPT_ONLY">TRANSCRIPT_ONLY</option>
            <option value="TRANSCRIPT_AND_AUDIO">TRANSCRIPT_AND_AUDIO</option>
            <option value="AUDIO_ONLY">AUDIO_ONLY</option>
            <option value="LISTENER_CAPTURED">LISTENER_CAPTURED planned/not-runtime</option>
          </select>
        </label>
        <label>
          Participant count
          <input min="0" name="participantCount" type="number" defaultValue="0" />
        </label>
      </div>

      <section className="panel oima-form-section">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Transcript Source</span>
            <h3>Transcript upload/register input</h3>
            <p className="muted">Register metadata only. Process the immutable raw transcript from the meeting detail page.</p>
          </div>
        </div>
        <div className="oima-form-grid">
          <label>
            Transcript filename
            <input name="transcriptFilename" placeholder="operating-review-transcript.txt" />
          </label>
          <label>
            Transcript storage key or URL
            <input name="transcriptStorageKey" placeholder="oima/intake/transcripts/..." />
          </label>
          <label>
            MIME type
            <input name="transcriptMimeType" placeholder="text/plain" />
          </label>
          <label>
            Size bytes
            <input min="0" name="transcriptSizeBytes" type="number" />
          </label>
          <label>
            Checksum
            <input name="transcriptChecksum" placeholder="optional checksum" />
          </label>
        </div>
      </section>

      <section className="panel oima-form-section">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Optional Audio Source</span>
            <h3>Optional audio upload/register input</h3>
            <p className="muted">Audio metadata can be registered; audio processing is not runtime in OIMA-2.</p>
          </div>
        </div>
        <div className="oima-form-grid">
          <label>
            Audio filename
            <input name="audioFilename" placeholder="operating-review-audio.mp3" />
          </label>
          <label>
            Audio storage key or URL
            <input name="audioStorageKey" placeholder="oima/intake/audio/..." />
          </label>
          <label>
            MIME type
            <input name="audioMimeType" placeholder="audio/mpeg" />
          </label>
          <label>
            Size bytes
            <input min="0" name="audioSizeBytes" type="number" />
          </label>
          <label>
            Checksum
            <input name="audioChecksum" placeholder="optional checksum" />
          </label>
        </div>
      </section>

      <div className="oima-form-actions">
        <button className="button oima-primary-button" disabled={submitState.status === "submitting"} type="submit">
          Register meeting
        </button>
        <p className={`oima-submit-state ${submitState.status}`}>{submitState.message}</p>
        {submitState.status === "success" ? <a href={`/oima/meetings/${submitState.meetingId}`}>Open meeting detail</a> : null}
      </div>
    </form>
  );
}
