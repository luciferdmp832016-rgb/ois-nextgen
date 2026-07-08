import Link from "next/link";
import {
  buildCrossProductLinkTargets,
  findRegistryHealthItem,
  findRegistryReadinessItem,
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
  OwnerEntityUatSummary,
  OwnerReviewQueuePanel,
  PageHeading,
  RegistryHealthItemPanel,
  RegistryReadinessItemPanel,
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
          <DetailFallbackPanel title="Workspace not linked yet" message={detail.errorMessage ?? "No workspace detail is available in the current registry view."} />
          <DataBoundaryPanel />
        </section>
      </OisConsoleShell>
    );
  }

  const products = workspace.relationships?.products ?? [];
  const projects = workspace.relationships?.projects ?? workspace.projects;
  const modules = workspace.relationships?.modules ?? [];
  const installations = workspace.relationships?.installations ?? workspace.installations;
  const workspaceHealth = findRegistryHealthItem(snapshot, "workspaces", workspace.id);
  const workspaceReadiness = findRegistryReadinessItem(snapshot, "workspaces", workspace.id);
  const ownerLinks = projects.slice(0, 3).map((project) => {
    const targets = buildCrossProductLinkTargets({ projectId: project.id });
    return {
      href: targets.pitsProject,
      label: `Linked to PITS ${project.name}`,
      detail: project.code,
      external: true
    };
  });

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

      <OwnerEntityUatSummary
        title="Owner-facing UAT summary"
        health={workspaceHealth}
        readiness={workspaceReadiness}
        linkedFacts={[
          `${projects.length} project link(s)`,
          `${products.length} product link(s)`,
          `${modules.length} module link(s)`,
          `${installations.length} installation link(s)`
        ]}
        links={ownerLinks}
      />

      <OwnerReviewQueuePanel snapshot={snapshot} entityType="workspace" entityId={workspace.id} />

      <RegistryReadinessItemPanel title="Workspace Governance / Readiness" item={workspaceReadiness} />

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
          <article className="panel compact-panel owner-empty-state" data-owner-empty-state="Owner-safe empty state">
            <span className="eyebrow">Missing link</span>
            <h3>No products returned</h3>
            <p className="muted">This workspace has no product relationship in the current registry payload.</p>
            <p className="muted owner-safe-note">Safe empty state: only registry-safe summary copy is shown.</p>
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
