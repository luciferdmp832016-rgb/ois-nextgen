import Link from "next/link";
import {
  buildCrossProductLinkTargets,
  findRegistryHealthItem,
  getPlatformRegistrySnapshot,
  getWorkspaceRegistryDetail
} from "@ois/shared-ui";
import {
  DataBoundaryPanel,
  DetailFacts,
  DetailFallbackPanel,
  DetailSourceMarker,
  DetailStatusPanel,
  OisConsoleShell,
  PageHeading,
  RegistryHealthItemPanel,
  RelatedLinksPanel
} from "../../shell";

export const dynamic = "force-dynamic";

type WorkspaceDetailPageProps = {
  params: Promise<{ id: string }>;
};

export default async function WorkspaceDetailPage({ params }: WorkspaceDetailPageProps) {
  const { id } = await params;
  const snapshot = await getPlatformRegistrySnapshot();
  const detail = await getWorkspaceRegistryDetail(id, snapshot.coreApiUrl);
  const workspace = detail.item;

  if (!workspace) {
    return (
      <OisConsoleShell active="workspaces" snapshot={snapshot}>
        <PageHeading title="Workspace Not Found" eyebrow="Workspace Registry Detail">
          The requested workspace was not returned by the read-only Core API registry.
        </PageHeading>
        <DetailSourceMarker label="Workspace Detail Source" />
        <section className="dashboard-grid">
          <DetailStatusPanel detail={detail} label="Workspace Detail" />
          <DetailFallbackPanel title="Workspace not linked yet" message={detail.errorMessage ?? "Core API returned no workspace detail."} />
          <DataBoundaryPanel />
        </section>
      </OisConsoleShell>
    );
  }

  const products = workspace.relationships?.products ?? [];
  const projects = workspace.relationships?.projects ?? workspace.projects;
  const workspaceHealth = findRegistryHealthItem(snapshot, "workspaces", workspace.id);

  return (
    <OisConsoleShell active="workspaces" snapshot={snapshot}>
      <PageHeading title={workspace.name} eyebrow={workspace.code}>
        Read-only workspace detail with related products, modules, installations and PITS project links.
      </PageHeading>
      <DetailSourceMarker label="Workspace Detail Source" />

      <section className="panel">
        <DetailFacts
          facts={[
            ["Workspace ID", workspace.id],
            ["Organization", workspace.organization.name],
            ["Lifecycle", workspace.lifecycle],
            ["Version", workspace.version],
            ["Projects", projects.length],
            ["Products", products.length]
          ]}
        />
      </section>

      <RegistryHealthItemPanel title="Workspace Runtime Health" item={workspaceHealth} />

      <section className="list-grid" aria-label="Workspace products">
        {products.length > 0 ? (
          products.map((product) => (
            <article className="panel compact-panel" key={product.id}>
              <span className="eyebrow">{product.code}</span>
              <h3>
                <Link href={`/products/${product.id}`}>{product.name}</Link>
              </h3>
              <p className="muted">{product.modules.length} module(s) available through this workspace relationship.</p>
              <strong>{product.lifecycle}</strong>
            </article>
          ))
        ) : (
          <article className="panel compact-panel">
            <span className="eyebrow">Not linked yet</span>
            <h3>No products returned</h3>
            <p className="muted">This workspace has no product relationship in the current registry payload.</p>
          </article>
        )}
      </section>

      <RelatedLinksPanel
        title="Related Project Links"
        description="Project relationships can open the PITS Shell when a project is available."
        links={projects.map((project) => {
          const targets = buildCrossProductLinkTargets({ projectId: project.id });
          return {
            href: targets.pitsProject,
            label: `Open PITS project ${project.name}`,
            detail: project.code,
            external: true
          };
        })}
      />

      <section className="dashboard-grid">
        <DetailStatusPanel detail={detail} label="Workspace Detail" />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
