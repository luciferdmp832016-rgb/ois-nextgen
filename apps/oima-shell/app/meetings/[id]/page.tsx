import Link from "next/link";
import {
  getOimaMeetingDetailSnapshot,
  getOimaTranscriptSnapshot,
  getPlatformRegistrySnapshot,
  type ApiResult,
  type OimaMeetingPayload,
  type OimaTranscriptParseRunPayload,
  type OimaTranscriptSegmentPayload,
  type OimaTranscriptVersionPayload,
  type OimaTranscriptWarningPayload
} from "@ois/shared-ui";
import { DetailSourceMarker, OimaShell, PageHeading, StatusBadge } from "../../shell";
import { TranscriptProcessingPanel } from "./transcript-processing-panel";

export const dynamic = "force-dynamic";

type OimaMeetingDetailPageProps = {
  params: Promise<{ id: string }>;
};

function ApiStatusCard({ result, label }: { result: ApiResult; label: string }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Core API</span>
          <h3>{label}</h3>
          <p className="muted">{result.ok ? "Core API returned meeting detail data." : result.error ?? "Core API request failed."}</p>
        </div>
        <StatusBadge ok={result.ok} label={result.ok ? "Ready" : "Needs owner review"} />
      </div>
      <dl className="facts">
        <div>
          <dt>Status</dt>
          <dd>{result.status ?? "Unavailable"}</dd>
        </div>
      </dl>
    </section>
  );
}

function Availability({ meeting }: { meeting: OimaMeetingPayload }) {
  return (
    <section className="dashboard-grid">
      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Current Status</span>
            <h3>{meeting.status}</h3>
            <p className="muted">OIMA-2 supports deterministic transcript processing. Meeting analytics remain planned.</p>
          </div>
          <StatusBadge ok={meeting.status === "READY_FOR_PROCESSING"} label={meeting.status} />
        </div>
        <dl className="facts">
          <div>
            <dt>Transcript available</dt>
            <dd>{meeting.transcriptPresent ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Audio available</dt>
            <dd>{meeting.audioPresent ? "Yes" : "No"}</dd>
          </div>
          <div>
            <dt>Source files</dt>
            <dd>{meeting.sourceFileCount}</dd>
          </div>
        </dl>
      </section>

      <section className="panel">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Planned Next Steps</span>
            <h3>Not runtime in OIMA-2</h3>
            <p className="muted">Analysis surfaces are visible placeholders and do not create fake analytics.</p>
          </div>
          <StatusBadge ok={false} label="Planned" />
        </div>
        <div className="owner-review-marker-row" aria-label="OIMA planned next-step placeholders">
          <span>OIS Agent Analysis</span>
          <span>Subject Clarification</span>
          <span>Dashboard</span>
          <span>Listener Mode</span>
          <span>No fake meeting analysis</span>
        </div>
      </section>
    </section>
  );
}

function TranscriptStatus({
  parseRun,
  versions,
  warnings
}: {
  parseRun: OimaTranscriptParseRunPayload | null;
  versions: OimaTranscriptVersionPayload[];
  warnings: OimaTranscriptWarningPayload[];
}) {
  return (
    <section className="panel" data-oima="Transcript Parse Status">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Transcript Tab</span>
          <h3>{parseRun?.status ?? "Not processed"}</h3>
          <p className="muted">Raw transcript evidence is immutable. Normalized/corrected versions are separate from RAW.</p>
        </div>
        <StatusBadge ok={parseRun?.status === "COMPLETED"} label={parseRun?.status ?? "Not processed"} />
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Segment count</dt>
          <dd>{parseRun?.segmentCount ?? 0}</dd>
        </div>
        <div>
          <dt>Warning count</dt>
          <dd>{parseRun?.warningCount ?? warnings.length}</dd>
        </div>
        <div>
          <dt>Parse confidence</dt>
          <dd>{parseRun?.confidenceScore ?? 0}</dd>
        </div>
        <div>
          <dt>Transcript versions</dt>
          <dd>{versions.length}</dd>
        </div>
      </dl>
      <div className="owner-review-marker-row" aria-label="OIMA transcript processing markers">
        <span>TRANSCRIPT_PROCESSING</span>
        <span>RAW transcript immutable</span>
        <span>NORMALIZED transcript separate</span>
        <span>MICROSOFT_TEAMS parser</span>
        <span>No LLM/OpenRouter calls</span>
      </div>
    </section>
  );
}

function TranscriptVersions({ versions }: { versions: OimaTranscriptVersionPayload[] }) {
  return (
    <section className="panel" data-oima="Transcript Version Selector">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Transcript Version Selector</span>
          <h3>Raw vs normalized evidence</h3>
          <p className="muted">RAW versions are immutable; NORMALIZED versions preserve deterministic corrections separately.</p>
        </div>
        <StatusBadge ok={versions.some((version) => version.versionType === "RAW" && version.isImmutable)} label="Evidence versions" />
      </div>
      <div className="oima-table-wrap">
        <table className="oima-table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Version</th>
              <th>Immutable</th>
              <th>Content</th>
              <th>Hash</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {versions.length === 0 ? (
              <tr>
                <td colSpan={6}>No transcript versions yet. Process a transcript to create RAW and NORMALIZED versions.</td>
              </tr>
            ) : (
              versions.map((version) => (
                <tr key={version.id}>
                  <td>{version.versionType}</td>
                  <td>{version.versionNumber}</td>
                  <td>{version.isImmutable ? "Yes" : "No"}</td>
                  <td>{version.contentTextAvailable ? `${version.contentTextLength} chars` : "External storage reference"}</td>
                  <td>{version.rawContentHash.slice(0, 24)}...</td>
                  <td>{version.createdAt?.slice(0, 10) ?? "Not set"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function TranscriptTimeline({ segments }: { segments: OimaTranscriptSegmentPayload[] }) {
  return (
    <section className="panel" data-oima="Transcript Timeline">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Transcript Timeline</span>
          <h3>Ordered transcript segments</h3>
          <p className="muted">Timeline preserves raw speaker labels, raw text, normalized text and review markers for future evidence-backed analysis.</p>
        </div>
        <StatusBadge ok={segments.length > 0} label={segments.length > 0 ? "Timeline ready" : "No segments"} />
      </div>
      <div className="oima-transcript-timeline">
        {segments.length === 0 ? (
          <article className="oima-timeline-item">
            <h4>No transcript segments yet</h4>
            <p className="muted">Process a registered transcript source to populate the timeline.</p>
          </article>
        ) : (
          segments.map((segment) => (
            <article className="oima-timeline-item" key={segment.id}>
              <div className="panel-heading">
                <div>
                  <span className="eyebrow">
                    Segment {segment.segmentIndex + 1} / lines {segment.sourceLineStart}-{segment.sourceLineEnd}
                  </span>
                  <h4>{segment.timestampStart ?? "Timestamp needs review"}</h4>
                </div>
                <StatusBadge ok={!segment.needsReview} label={segment.needsReview ? "Needs review" : "Parsed"} />
              </div>
              <dl className="facts">
                <div>
                  <dt>Raw speaker</dt>
                  <dd>{segment.speakerRaw ?? "Needs review"}</dd>
                </div>
                <div>
                  <dt>Normalized speaker</dt>
                  <dd>{segment.speakerNormalized ?? "Not available"}</dd>
                </div>
                <div>
                  <dt>Confidence</dt>
                  <dd>{segment.confidenceScore}</dd>
                </div>
              </dl>
              <div className="oima-transcript-grid">
                <div>
                  <span className="eyebrow">Raw text</span>
                  <p>{segment.rawText || "No raw segment text"}</p>
                </div>
                <div>
                  <span className="eyebrow">Normalized text</span>
                  <p>{segment.normalizedText || "No normalized segment text"}</p>
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function TranscriptWarnings({ warnings }: { warnings: OimaTranscriptWarningPayload[] }) {
  return (
    <section className="panel" data-oima="Transcript Parse Warnings">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Parse Warnings</span>
          <h3>{warnings.length} warnings</h3>
          <p className="muted">Low-confidence parsing is surfaced as NEEDS_REVIEW instead of failing silently.</p>
        </div>
        <StatusBadge ok={warnings.length === 0} label={warnings.length === 0 ? "No warnings" : "Needs review"} />
      </div>
      <div className="oima-surface-grid">
        {warnings.length === 0 ? (
          <article className="oima-surface-card">
            <h4>No parse warnings</h4>
            <p className="muted">The latest parse run has no recorded review warnings.</p>
          </article>
        ) : (
          warnings.map((warning) => (
            <article className="oima-surface-card" key={warning.id}>
              <span className="eyebrow">{warning.severity}</span>
              <h4>{warning.warningType}</h4>
              <p>{warning.message}</p>
            </article>
          ))
        )}
      </div>
    </section>
  );
}

function PlannedLater() {
  return (
    <section className="panel" data-oima="OIMA Planned Later">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Planned Later</span>
          <h3>Not runtime in OIMA-2</h3>
          <p className="muted">Transcript evidence is ready, but analysis surfaces remain disabled until later stages.</p>
        </div>
        <StatusBadge ok={false} label="Planned" />
      </div>
      <div className="owner-review-marker-row" aria-label="OIMA planned later placeholders">
        <span>OIS Agent Analysis planned later</span>
        <span>Subject Clarification planned later</span>
        <span>Dashboard planned later</span>
        <span>Listener Mode planned later</span>
        <span>No issue/decision/action/risk extraction</span>
        <span>No fake meeting analysis</span>
      </div>
    </section>
  );
}

export default async function OimaMeetingDetailPage({ params }: OimaMeetingDetailPageProps) {
  const { id } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const [detail, transcript] = await Promise.all([getOimaMeetingDetailSnapshot(id, snapshot.coreApiUrl), getOimaTranscriptSnapshot(id, snapshot.coreApiUrl)]);
  const meeting = detail.meeting;

  if (!meeting) {
    return (
      <OimaShell active="meetings" snapshot={snapshot}>
        <PageHeading eyebrow="OIMA Meeting Detail" title="Meeting Not Found">
          The requested OIMA meeting was not returned by Core API.
        </PageHeading>
        <DetailSourceMarker label="OIMA Meeting Detail Source" />
        <section className="dashboard-grid">
          <ApiStatusCard result={detail.detail} label="OIMA Meeting Detail API" />
          <section className="panel owner-empty-state">
            <h3>Meeting intake record unavailable</h3>
            <p className="muted">{detail.errorMessage ?? "No meeting detail is available for this identifier."}</p>
            <Link className="oima-secondary-link" href="/meetings">
              Back to Meeting Library
            </Link>
          </section>
        </section>
      </OimaShell>
    );
  }

  return (
    <OimaShell active="meetings" snapshot={snapshot}>
      <PageHeading eyebrow="OIMA Meeting Detail" title={meeting.title}>
        Meeting metadata, source files and deterministic transcript processing evidence. Audio processing and analysis remain planned/not-runtime.
      </PageHeading>

      <DetailSourceMarker label="OIMA Meeting Detail Source" />

      <section className="dashboard-grid">
        <section className="panel" data-oima="Meeting Detail Metadata">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Meeting Metadata</span>
              <h3>{meeting.sourceMode}</h3>
              <p className="muted">Workspace-scoped intake record powered by OIS.</p>
            </div>
            <StatusBadge ok label="Metadata registered" />
          </div>
          <dl className="facts">
            <div>
              <dt>Meeting date</dt>
              <dd>{meeting.meetingDate}</dd>
            </div>
            <div>
              <dt>Start time</dt>
              <dd>{meeting.startTime ?? "Not set"}</dd>
            </div>
            <div>
              <dt>End time</dt>
              <dd>{meeting.endTime ?? "Not set"}</dd>
            </div>
            <div>
              <dt>Participant count</dt>
              <dd>{meeting.participantCount}</dd>
            </div>
            <div>
              <dt>Confidence score</dt>
              <dd>{meeting.confidenceScore}</dd>
            </div>
          </dl>
        </section>
        <ApiStatusCard result={detail.detail} label="OIMA Meeting Detail API" />
      </section>

      <Availability meeting={meeting} />

      <section className="panel" data-oima="Meeting Source Files">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Source Files</span>
            <h3>Registered source file metadata</h3>
            <p className="muted">Transcript source metadata can be processed into immutable RAW and separate NORMALIZED transcript versions.</p>
          </div>
          <StatusBadge ok={meeting.sourceFileCount > 0} label={meeting.sourceFileCount > 0 ? "Sources registered" : "No sources yet"} />
        </div>
        <div className="oima-table-wrap">
          <table className="oima-table">
            <thead>
              <tr>
                <th>File type</th>
                <th>Original filename</th>
                <th>Storage key / URL</th>
                <th>MIME type</th>
                <th>Size bytes</th>
                <th>Upload status</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {meeting.sourceFiles.length === 0 ? (
                <tr>
                  <td colSpan={7}>No source file metadata registered.</td>
                </tr>
              ) : (
                meeting.sourceFiles.map((file) => (
                  <tr key={file.id}>
                    <td>{file.fileType}</td>
                    <td>{file.originalFilename}</td>
                    <td>{file.storageKey ?? file.storageUrl ?? "Not set"}</td>
                    <td>{file.mimeType ?? "Not set"}</td>
                    <td>{file.sizeBytes}</td>
                    <td>{file.uploadStatus}</td>
                    <td>{file.createdAt.slice(0, 10)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="dashboard-grid">
        <ApiStatusCard result={transcript.status} label="OIMA Transcript Status API" />
        <TranscriptStatus parseRun={transcript.latestParseRun} versions={transcript.versions} warnings={transcript.warnings} />
      </section>

      <TranscriptProcessingPanel
        coreApiUrl={snapshot.coreApiUrl}
        hasParseRun={Boolean(transcript.latestParseRun)}
        meetingId={meeting.id}
        transcriptSourceFiles={meeting.sourceFiles.filter((file) => file.fileType === "TRANSCRIPT")}
      />

      <TranscriptVersions versions={transcript.versions} />
      <TranscriptTimeline segments={transcript.segments} />
      <TranscriptWarnings warnings={transcript.warnings} />
      <PlannedLater />

      <section className="panel">
        <Link className="oima-secondary-link" href="/meetings">
          Back to Meeting Library
        </Link>
      </section>
    </OimaShell>
  );
}
