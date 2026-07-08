import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  InstallationRegistryPanel,
  PageHeading,
  PitsAdminBoundaryPanel,
  PitsProductUatPanel,
  PitsRegistryCockpit,
  PitsOwnerReviewQueuePanel,
  PitsWorkboardRuntimeStatusPanel,
  PitsShell,
  PlatformCountsPanel,
  ProjectOverviewCards,
  RegistryGovernancePanel,
  RegistryHealthPanel,
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
      <PitsRegistryCockpit snapshot={snapshot} />
      <PitsOwnerReviewQueuePanel snapshot={snapshot} title="Safe Action Boundary" />
      <PitsAdminBoundaryPanel snapshot={snapshot} title="Audit / Permission / Admin Boundary" />
      <PitsProductUatPanel snapshot={snapshot} title="Product Capability / UAT Status" />
      <PitsWorkboardRuntimeStatusPanel snapshot={snapshot} />
      <section className="content-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <RegistryGovernancePanel snapshot={snapshot} />
        <RegistryHealthPanel snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
      <ProjectOverviewCards snapshot={snapshot} />
      <InstallationRegistryPanel snapshot={snapshot} />
      <PlatformCountsPanel snapshot={snapshot} />
    </PitsShell>
  );
}
