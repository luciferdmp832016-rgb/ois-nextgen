import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  AdminBoundaryPanel,
  DataBoundaryPanel,
  OisConsoleShell,
  OwnerRegistryCockpit,
  OwnerReviewQueuePanel,
  PageHeading,
  PlatformOverviewCard,
  ProductUatPanel,
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
      <OwnerRegistryCockpit snapshot={snapshot} />
      <OwnerReviewQueuePanel snapshot={snapshot} title="Safe Action Boundary" />
      <AdminBoundaryPanel snapshot={snapshot} title="Audit / Permission / Admin Boundary" />
      <ProductUatPanel snapshot={snapshot} title="Product Capability / UAT Status" />
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
