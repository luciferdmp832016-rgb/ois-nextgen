import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  OisConsoleShell,
  OwnerRegistryCockpit,
  PageHeading,
  PlatformOverviewCard,
  ProductModuleOverview,
  RuntimeStatusCard
} from "./shell";

export const dynamic = "force-dynamic";

export default async function Page() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="overview" snapshot={snapshot}>
      <PageHeading eyebrow="OIS_CONSOLE" title="Product Administration Overview">
        Control-plane baseline for workspaces, products, modules and runtime health.
      </PageHeading>
      <OwnerRegistryCockpit snapshot={snapshot} />
      <section className="dashboard-grid" aria-label="OIS Console overview">
        <PlatformOverviewCard snapshot={snapshot} />
        <ProductModuleOverview snapshot={snapshot} />
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
