import Link from "next/link";
import { getOimaMeetingLibrarySnapshot, getPlatformRegistrySnapshot, type ApiResult, type OimaMeetingPayload } from "@ois/shared-ui";
import { DetailSourceMarker, OimaShell, PageHeading, StatusBadge } from "../shell";

export const dynamic = "force-dynamic";

function yesNo(value: boolean) {
  return value ? "Yes" : "No";
}

function ApiStatusCard({ result, label }: { result: ApiResult; label: string }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Core API</span>
          <h3>{label}</h3>
          <p className="muted">{result.ok ? "Core API returned meeting intake data." : result.error ?? "Core API request failed."}</p>
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

function MeetingRows({ meetings }: { meetings: OimaMeetingPayload[] }) {
  if (meetings.length === 0) {
    return (
      <tr>
        <td colSpan={8}>No OIMA meetings registered yet. Register a transcript-first meeting to start OIMA intake and transcript processing.</td>
      </tr>
    );
  }

  return (
    <>
      {meetings.map((meeting) => (
        <tr key={meeting.id}>
          <td>{meeting.title}</td>
          <td>{meeting.meetingDate}</td>
          <td>{meeting.sourceMode}</td>
          <td>{meeting.status}</td>
          <td>{yesNo(meeting.transcriptPresent)}</td>
          <td>{yesNo(meeting.audioPresent)}</td>
          <td>{meeting.createdAt.slice(0, 10)}</td>
          <td>
            <Link href={`/meetings/${meeting.id}`}>Open detail</Link>
          </td>
        </tr>
      ))}
    </>
  );
}

export default async function OimaMeetingLibraryPage() {
  const snapshot = await getPlatformRegistrySnapshot();
  const library = await getOimaMeetingLibrarySnapshot(snapshot.coreApiUrl);

  return (
    <OimaShell active="meetings" snapshot={snapshot}>
      <PageHeading eyebrow="OIMA Meeting Intake" title="Meeting Library">
        OIMA lists real meeting intake records from Core API. Transcript processing is available; analysis and Listener Mode remain planned/not-runtime.
      </PageHeading>

      <DetailSourceMarker label="OIMA Meeting Library Source" />

      <section className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Runtime Availability</span>
              <h3>Meeting Intake Foundation</h3>
              <p className="muted">Transcript-first. Audio-optional metadata. No fake meeting analysis.</p>
            </div>
            <StatusBadge ok label="OIMA-2 available" />
          </div>
          <div className="owner-review-marker-row" aria-label="OIMA meeting intake markers">
            <span>MEETING_INTAKE</span>
            <span>TRANSCRIPT_ONLY</span>
            <span>TRANSCRIPT_AND_AUDIO</span>
            <span>AUDIO_ONLY metadata</span>
            <span>LISTENER_CAPTURED planned/not-runtime</span>
            <span>No LLM/OpenRouter calls</span>
          </div>
          <Link className="button" href="/meetings/new">
            Register meeting
          </Link>
        </section>
        <ApiStatusCard result={library.library} label="OIMA Meetings API" />
      </section>

      <section className="panel" data-oima="Meeting Library Table">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">Meeting Library</span>
            <h3>Registered meetings</h3>
            <p className="muted">The table shows intake metadata only; issues, decisions, actions and risks are not created in OIMA-2.</p>
          </div>
          <StatusBadge ok={library.library.ok} label={library.library.ok ? "Library ready" : "Needs owner review"} />
        </div>
        <div className="oima-table-wrap">
          <table className="oima-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Meeting date</th>
                <th>Source mode</th>
                <th>Status</th>
                <th>Transcript present</th>
                <th>Audio present</th>
                <th>Created date</th>
                <th>Open detail</th>
              </tr>
            </thead>
            <tbody>
              <MeetingRows meetings={library.meetings} />
            </tbody>
          </table>
        </div>
      </section>
    </OimaShell>
  );
}
