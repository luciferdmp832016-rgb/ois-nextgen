import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  InstallationRegistryPanel,
  PageHeading,
  PitsProductUatPanel,
  PitsRegistryCockpit,
  PitsShell,
  PlatformCountsPanel,
  ProjectOverviewCards,
  ProjectSelector,
  RegistryGovernancePanel,
  RegistryHealthPanel,
  RuntimeStatusCard
} from "./shell";

export const dynamic = "force-dynamic";

export default async function Page() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PitsShell active="overview" snapshot={snapshot}>
      <PageHeading eyebrow="PITS_SHELL" title="Project Runtime Overview">
        Product runtime baseline for project selection, installation status and Core API health.
      </PageHeading>
      <PitsRegistryCockpit snapshot={snapshot} />
      <PitsProductUatPanel snapshot={snapshot} title="Product User Journey UAT Baseline" />
      <ProjectOverviewCards snapshot={snapshot} />
      <section className="content-grid">
        <ProjectSelector snapshot={snapshot} />
        <RegistryGovernancePanel snapshot={snapshot} />
        <RegistryHealthPanel snapshot={snapshot} />
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
      <InstallationRegistryPanel snapshot={snapshot} />
      <PlatformCountsPanel snapshot={snapshot} />
    </PitsShell>
  );
}
