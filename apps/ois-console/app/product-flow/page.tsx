import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { DataBoundaryPanel, OisConsoleShell, PageHeading, RuntimeStatusCard } from "../shell";
import { OisProductFlowPreview } from "./visual-preview";

export const dynamic = "force-dynamic";

export default async function ProductFlowPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <OisConsoleShell active="product-flow" snapshot={snapshot}>
      <PageHeading eyebrow="UX Draft / Product Flow Preview" title="OIS Product UX Blueprint">
        Product Flow Preview for owner review before deeper OIS implementation. This is read-only draft guidance; no intelligence, write action or LLM answer is executed.
      </PageHeading>
      <OisProductFlowPreview />
      <section className="dashboard-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
