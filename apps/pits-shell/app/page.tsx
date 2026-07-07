import { getPlatformSnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  PageHeading,
  PitsShell,
  PlatformCountsPanel,
  ProjectOverviewCards,
  ProjectSelector,
  RuntimeStatusCard
} from "./shell";

export const dynamic = "force-dynamic";

export default async function Page() {
  const snapshot = await getPlatformSnapshot();

  return (
    <PitsShell active="overview" snapshot={snapshot}>
      <PageHeading eyebrow="PITS_SHELL" title="Project Runtime Overview">
        Product runtime baseline for project selection, installation status and Core API health.
      </PageHeading>
      <ProjectOverviewCards snapshot={snapshot} />
      <section className="content-grid">
        <ProjectSelector snapshot={snapshot} />
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
      <PlatformCountsPanel snapshot={snapshot} />
    </PitsShell>
  );
}
