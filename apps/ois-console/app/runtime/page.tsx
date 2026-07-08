import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  OisConsoleShell,
  PageHeading,
  PlatformOverviewCard,
  RegistryGovernancePanel,
  RegistryHealthPanel,
  RegistryStatusPanel,
  RuntimeStatusCard
} from "../shell";

export const dynamic = "force-dynamic";

export default async function RuntimePage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="runtime" snapshot={snapshot}>
      <PageHeading eyebrow="Runtime" title="Runtime Status">
        Public staging runtime baseline for OIS Console, Core API and Platform Kernel reads.
      </PageHeading>
      <section className="dashboard-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <RegistryGovernancePanel snapshot={snapshot} />
        <RegistryHealthPanel snapshot={snapshot} />
        <RegistryStatusPanel snapshot={snapshot} />
        <PlatformOverviewCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
