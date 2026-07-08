import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  InstallationRegistryPanel,
  PageHeading,
  PitsShell,
  PlatformCountsPanel,
  ProjectOverviewCards,
  ProjectSelector,
  RegistryHealthPanel,
  RuntimeStatusCard
} from "../shell";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PitsShell active="projects" snapshot={snapshot}>
      <PageHeading eyebrow="Projects" title="Project Selector">
        Select from seeded staging projects that read shared platform state through Core API.
      </PageHeading>
      <ProjectSelector snapshot={snapshot} />
      <InstallationRegistryPanel snapshot={snapshot} />
      <ProjectOverviewCards snapshot={snapshot} />
      <section className="content-grid">
        <RegistryHealthPanel snapshot={snapshot} />
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
      <PlatformCountsPanel snapshot={snapshot} />
    </PitsShell>
  );
}
