import Link from "next/link";
import { getOimaMeetingDetailSnapshot, getPlatformRegistrySnapshot, type ApiResult, type OimaMeetingPayload } from "@ois/shared-ui";
import { DetailSourceMarker, OisConsoleShell, PageHeading, StatusBadge } from "../../../shell";

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
            <p className="muted">Processing status placeholder only; transcript processing starts in OIMA-2.</p>
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
            <h3>Not runtime in OIMA-1</h3>
            <p className="muted">These surfaces are visible placeholders and do not create fake analytics.</p>
          </div>
          <StatusBadge ok={false} label="Planned" />
        </div>
        <div className="owner-review-marker-row" aria-label="OIMA planned next-step placeholders">
          <span>Transcript Processing</span>
          <span>OIS Agent Analysis</span>
          <span>Clarification Review</span>
          <span>Dashboard</span>
          <span>No fake meeting analysis</span>
        </div>
      </section>
    </section>
  );
}

export default async function OimaMeetingDetailPage({ params }: OimaMeetingDetailPageProps) {
  const { id } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const detail = await getOimaMeetingDetailSnapshot(id, snapshot.coreApiUrl);
  const meeting = detail.meeting;

  if (!meeting) {
    return (
      <OisConsoleShell active="oima" snapshot={snapshot}>
        <PageHeading eyebrow="OIMA Meeting Detail" title="Meeting Not Found">
          The requested OIMA meeting was not returned by Core API.
        </PageHeading>
        <DetailSourceMarker label="OIMA Meeting Detail Source" />
        <section className="dashboard-grid">
          <ApiStatusCard result={detail.detail} label="OIMA Meeting Detail API" />
          <section className="panel owner-empty-state">
            <h3>Meeting intake record unavailable</h3>
            <p className="muted">{detail.errorMessage ?? "No meeting detail is available for this identifier."}</p>
            <Link href="/oima/meetings">Back to Meeting Library</Link>
          </section>
        </section>
      </OisConsoleShell>
    );
  }

  return (
    <OisConsoleShell active="oima" snapshot={snapshot}>
      <PageHeading eyebrow="OIMA Meeting Detail" title={meeting.title}>
        Meeting metadata and source file registration. Transcript/audio processing and analysis remain planned/not-runtime.
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
            <p className="muted">Metadata references only. File parsing, audio processing and transcript analysis are not enabled.</p>
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

      <section className="panel">
        <Link href="/oima/meetings">Back to Meeting Library</Link>
      </section>
    </OisConsoleShell>
  );
}
