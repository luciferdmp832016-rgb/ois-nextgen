import { getPlatformRegistrySnapshot, getPitsProjectWorkboard } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  DetailFallbackPanel,
  DetailStatusPanel,
  PageHeading,
  PitsProjectWorkboardPanel,
  PitsShell,
  RuntimeStatusCard
} from "../../../shell";

export const dynamic = "force-dynamic";

type ProjectWorkboardPageProps = {
  params: Promise<{ id: string }>;
};

export default async function ProjectWorkboardPage({ params }: ProjectWorkboardPageProps) {
  const { id } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const workboard = await getPitsProjectWorkboard(id, snapshot.coreApiUrl);
  const payload = workboard.payload;

  if (!payload) {
    return (
      <PitsShell active="projects" snapshot={snapshot}>
        <PageHeading title="Project Workboard Unavailable" eyebrow="PITS Project Workboard">
          The requested read-only PITS workboard was not returned by Core API.
        </PageHeading>
        <section className="dashboard-grid">
          <DetailStatusPanel detail={{ coreApiUrl: workboard.coreApiUrl, detail: workboard.workboard, metadata: null, item: null, notFound: workboard.notFound, errorMessage: workboard.errorMessage }} label="PITS Project Workboard" />
          <DetailFallbackPanel title="Workboard not linked yet" message={workboard.errorMessage ?? "No workboard is available in the current runtime view."} />
          <DataBoundaryPanel />
        </section>
      </PitsShell>
    );
  }

  return (
    <PitsShell active="projects" snapshot={snapshot}>
      <PageHeading title={payload.workboard.projectName} eyebrow="PITS Project Workboard">
        Read-only functional slice for project work items, priorities, owners, due dates and next actions.
      </PageHeading>
      <PitsProjectWorkboardPanel payload={payload} />
      <section className="dashboard-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </PitsShell>
  );
}
