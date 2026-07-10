import Link from "next/link";
import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { OisConsoleShell, PageHeading, StatusBadge } from "../../../shell";
import { MeetingIntakeForm } from "./meeting-intake-form";

export const dynamic = "force-dynamic";

export default async function NewOimaMeetingPage() {
  const snapshot = await getPlatformRegistrySnapshot();
  const organizationId = snapshot.organizations[0]?.id ?? "org_pmc_demo";
  const workspaceId = snapshot.workspaces[0]?.id ?? "ws_pmc_org_demo";

  return (
    <OisConsoleShell active="oima" snapshot={snapshot}>
      <PageHeading eyebrow="OIMA Meeting Intake" title="Upload / Register Meeting">
        Create a meeting intake record with transcript-first source metadata. Audio metadata is optional; listener capture is planned/not-runtime.
      </PageHeading>

      <section className="dashboard-grid">
        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Source Mode Contract</span>
              <h3>Transcript-first registration</h3>
              <p className="muted">TRANSCRIPT_ONLY is the primary OIMA flow. TRANSCRIPT_AND_AUDIO can attach optional audio metadata.</p>
            </div>
            <StatusBadge ok label="Intake metadata only" />
          </div>
          <div className="owner-review-marker-row" aria-label="OIMA source mode markers">
            <span>TRANSCRIPT_ONLY supported</span>
            <span>TRANSCRIPT_AND_AUDIO optional audio</span>
            <span>AUDIO_ONLY needs review</span>
            <span>LISTENER_CAPTURED planned/not-runtime</span>
          </div>
        </section>

        <section className="panel">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">Safety Boundary</span>
              <h3>No analytics runtime</h3>
              <p className="muted">This form registers meeting and source file metadata. Transcript processing runs from the meeting detail page.</p>
            </div>
            <StatusBadge ok={false} label="Analysis not runtime" />
          </div>
          <div className="owner-review-marker-row" aria-label="OIMA non-runtime markers">
            <span>Transcript processing available after registration</span>
            <span>No audio processing</span>
            <span>No OIS Agent analysis</span>
            <span>No voice clone</span>
            <span>No LLM/OpenRouter calls</span>
          </div>
        </section>
      </section>

      <MeetingIntakeForm coreApiUrl={snapshot.coreApiUrl} organizationId={organizationId} workspaceId={workspaceId} />

      <section className="panel">
        <Link href="/oima/meetings">Back to Meeting Library</Link>
      </section>
    </OisConsoleShell>
  );
}
