import Link from "next/link";
import { getOimaSnapshot, getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { OimaContractPanel, OimaRuntimeBoundaryPanel, OimaShell, PageHeading, PlatformCountsPanel, StatusBadge, SurfaceStatusGrid } from "./shell";

export const dynamic = "force-dynamic";

export default async function OimaHomePage() {
  const [snapshot, oimaSnapshot] = await Promise.all([getPlatformRegistrySnapshot(), getOimaSnapshot()]);
  const overview = oimaSnapshot.overviewPayload;

  return (
    <OimaShell active="overview" snapshot={snapshot}>
      <PageHeading eyebrow="Powered by OIS Product" title="OIMA - Organizational Intelligence Meeting Agent">
        OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS. Transcript is primary; audio is optional.
      </PageHeading>

      <section className="dashboard-grid">
        <section className="panel" data-oima="OIMA Product Overview">
          <div className="panel-heading">
            <div>
              <span className="eyebrow">OIMA Product Overview</span>
              <h3>Meeting intelligence on top of OIS</h3>
              <p className="muted">Meeting Library, Upload Meeting and Transcript Processing are runtime now. Analysis and Listener Mode remain planned.</p>
            </div>
            <StatusBadge ok label="OIMA-2 transcript ready" />
          </div>
          <div className="owner-review-marker-row" aria-label="OIMA overview markers">
            <span>TRANSCRIPT_ONLY</span>
            <span>TRANSCRIPT_AND_AUDIO</span>
            <span>AUDIO_ONLY metadata</span>
            <span>LISTENER_CAPTURED planned/not-runtime</span>
            <span>MEETING_INTELLIGENCE_PRODUCT</span>
            <span>PRODUCT_BOUNDARY_READY</span>
          </div>
          <div className="oima-action-row">
            <Link className="button" href="/meetings">
              Open Meeting Library
            </Link>
            <Link className="oima-secondary-link" href="/meetings/new">
              Upload / Register Meeting
            </Link>
          </div>
        </section>
        <OimaRuntimeBoundaryPanel snapshot={snapshot} />
      </section>

      <OimaContractPanel payload={overview} />
      <SurfaceStatusGrid payload={overview} />
      <PlatformCountsPanel snapshot={snapshot} />
    </OimaShell>
  );
}
