import { getPlatformSnapshot } from "@ois/shared-ui";
import { DataBoundaryPanel, PageHeading, PitsShell, PlatformCountsPanel, ProjectOverviewCards, RuntimeStatusCard } from "../shell";

export const dynamic = "force-dynamic";

export default async function RuntimePage() {
  const snapshot = await getPlatformSnapshot();

  return (
    <PitsShell active="runtime" snapshot={snapshot}>
      <PageHeading eyebrow="Runtime" title="Runtime Status">
        PITS Shell runtime baseline for public staging, Core API health and Platform Kernel counts.
      </PageHeading>
      <section className="content-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
      <ProjectOverviewCards snapshot={snapshot} />
      <PlatformCountsPanel snapshot={snapshot} />
    </PitsShell>
  );
}
