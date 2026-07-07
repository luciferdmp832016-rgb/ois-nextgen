import { getPlatformSnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  PageHeading,
  PitsShell,
  PlatformCountsPanel,
  ProjectOverviewCards,
  ProjectSelector,
  RuntimeStatusCard
} from "../shell";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const snapshot = await getPlatformSnapshot();

  return (
    <PitsShell active="projects" snapshot={snapshot}>
      <PageHeading eyebrow="Projects" title="Project Selector">
        Select from seeded staging projects that read shared platform state through Core API.
      </PageHeading>
      <ProjectSelector snapshot={snapshot} />
      <ProjectOverviewCards snapshot={snapshot} />
      <section className="content-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
      <PlatformCountsPanel snapshot={snapshot} />
    </PitsShell>
  );
}
