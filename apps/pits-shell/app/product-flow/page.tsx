import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { DataBoundaryPanel, PageHeading, PitsShell, RuntimeStatusCard } from "../shell";
import { PitsProductFlowPreview } from "./visual-preview";

export const dynamic = "force-dynamic";

export default async function ProductFlowPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PitsShell active="product-flow" snapshot={snapshot}>
      <PageHeading eyebrow="UX Draft / Product Flow Preview" title="PITS Product UX Blueprint">
        Product Flow Preview for owner review before deeper PITS implementation. This is read-only draft guidance; no status, owner, note, priority or blocker change is enabled.
      </PageHeading>
      <PitsProductFlowPreview />
      <section className="content-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </PitsShell>
  );
}
