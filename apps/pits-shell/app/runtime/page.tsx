import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  InstallationRegistryPanel,
  PageHeading,
  PitsShell,
  PlatformCountsPanel,
  ProjectOverviewCards,
  RuntimeStatusCard
} from "../shell";

export const dynamic = "force-dynamic";

export default async function RuntimePage() {
  const snapshot = await getPlatformRegistrySnapshot();

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
      <InstallationRegistryPanel snapshot={snapshot} />
      <PlatformCountsPanel snapshot={snapshot} />
    </PitsShell>
  );
}
