"use client";

import { useState, type FormEvent } from "react";
import type { OimaMeetingSourceFilePayload } from "@ois/shared-ui";

type TranscriptProcessingPanelProps = {
  coreApiUrl: string;
  meetingId: string;
  transcriptSourceFiles: OimaMeetingSourceFilePayload[];
  hasParseRun: boolean;
};

type SubmitState =
  | { status: "idle"; message: string }
  | { status: "submitting"; message: string }
  | { status: "success"; message: string }
  | { status: "error"; message: string };

function formValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

export function TranscriptProcessingPanel({ coreApiUrl, meetingId, transcriptSourceFiles, hasParseRun }: TranscriptProcessingPanelProps) {
  const [submitState, setSubmitState] = useState<SubmitState>({
    status: "idle",
    message: "Ready to process an immutable raw transcript."
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (transcriptSourceFiles.length === 0) {
      setSubmitState({ status: "error", message: "Register a transcript source file before processing." });
      return;
    }

    const formData = new FormData(event.currentTarget);
    const rawTranscriptText = formValue(formData, "rawTranscriptText");

    if (!rawTranscriptText.trim()) {
      setSubmitState({ status: "error", message: "Raw transcript text is required and will be stored immutably." });
      return;
    }

    setSubmitState({ status: "submitting", message: "Processing transcript deterministically." });

    try {
      const response = await fetch(`${coreApiUrl}/platform/oima/meetings/${encodeURIComponent(meetingId)}/transcript/process`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          sourceFileId: formValue(formData, "sourceFileId"),
          parserType: formValue(formData, "parserType"),
          rawTranscriptText
        })
      });
      const body = (await response.json().catch(() => null)) as
        | { parseRun?: { status?: string; segmentCount?: number; warningCount?: number }; error?: { message?: string } }
        | null;

      if (!response.ok || !body?.parseRun) {
        setSubmitState({ status: "error", message: body?.error?.message ?? `Core API returned HTTP ${response.status}.` });
        return;
      }

      setSubmitState({
        status: "success",
        message: `Transcript parse ${body.parseRun.status ?? "recorded"} with ${body.parseRun.segmentCount ?? 0} segments and ${
          body.parseRun.warningCount ?? 0
        } warnings. Refresh to inspect the persisted timeline.`
      });
    } catch (error) {
      setSubmitState({ status: "error", message: error instanceof Error ? error.message : "Core API request failed." });
    }
  }

  return (
    <section className="panel" data-oima="Process Transcript Action">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Processing Action</span>
          <h3>{hasParseRun ? "Reprocess Transcript" : "Process Transcript"}</h3>
          <p className="muted">Raw transcript text is stored as an immutable RAW version; normalized text is stored separately.</p>
        </div>
      </div>
      <form className="oima-intake-form" onSubmit={handleSubmit}>
        <div className="oima-form-grid">
          <label>
            Transcript source file
            <select name="sourceFileId" disabled={transcriptSourceFiles.length === 0}>
              {transcriptSourceFiles.length === 0 ? (
                <option value="">No transcript source registered</option>
              ) : (
                transcriptSourceFiles.map((file) => (
                  <option key={file.id} value={file.id}>
                    {file.originalFilename}
                  </option>
                ))
              )}
            </select>
          </label>
          <label>
            Parser type
            <select defaultValue="MICROSOFT_TEAMS" name="parserType">
              <option value="MICROSOFT_TEAMS">MICROSOFT_TEAMS</option>
              <option value="GENERIC_TEXT">GENERIC_TEXT</option>
            </select>
          </label>
        </div>
        <label>
          Raw transcript text
          <textarea
            name="rawTranscriptText"
            placeholder="Paste the raw transcript exactly as exported from Microsoft Teams or another source."
            rows={10}
          />
        </label>
        <div className="oima-form-actions">
          <button className="button oima-primary-button" disabled={submitState.status === "submitting" || transcriptSourceFiles.length === 0} type="submit">
            {hasParseRun ? "Reprocess Transcript" : "Process Transcript"}
          </button>
          <p className={`oima-submit-state ${submitState.status}`}>{submitState.message}</p>
        </div>
      </form>
    </section>
  );
}
