import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { DataBoundaryPanel, PageHeading, PitsShell, RuntimeStatusCard, StatusBadge } from "../shell";

export const dynamic = "force-dynamic";

const pitsScreens = [
  {
    title: "Home",
    purpose: "Give project operators a clear starting point.",
    sections: ["My active projects", "Work needing attention", "Blocked work items", "Due soon", "Recent updates", "Quick actions marked preview-only"]
  },
  {
    title: "Projects",
    purpose: "Let users find and select a project.",
    sections: ["Search/filter/sort concept", "Project cards/table", "Project health/status", "Open/in-progress/blocked counts", "Next action", "Owner/person in charge", "Last updated"]
  },
  {
    title: "Project Detail",
    purpose: "Show project overview and operational status.",
    sections: ["Project summary", "Health/readiness", "Current blockers", "Milestones/sections", "Linked workspace/product/OIS context", "Workboard entry", "Activity summary"]
  },
  {
    title: "Workboard",
    purpose: "Main workflow page for project execution.",
    sections: ["Open / In progress / Blocked / Done", "Work item cards", "Priority / owner / due date / blocker", "Board/list view concept", "Filter/sort concept", "Read-only vs future edit boundary"]
  },
  {
    title: "Work Item Detail",
    purpose: "Let users inspect one task, issue, risk or follow-up.",
    sections: ["Item title", "Status", "Priority", "Owner", "Due date", "Description", "Blockers", "Next action", "Activity/timeline concept", "Related documents/comments concept"]
  },
  {
    title: "Dry-run Action Preview",
    purpose: "Preview future write actions without changing data.",
    sections: ["Proposed action", "Expected impact", "Audit requirement", "Confirmation requirement", "Rollback plan", "Permission requirement", "Not executable yet"]
  },
  {
    title: "Runtime and Admin",
    purpose: "Move diagnostics and admin views away from daily product workflow.",
    sections: ["Runtime status", "Registry readiness", "Admin boundary", "Owner review queue", "Product UAT status"]
  }
] as const;

const productPages = ["Home", "Projects", "Project Detail", "Workboard", "Work Item Detail", "Dry-run Action Preview"];
const adminPages = ["Runtime", "Registry readiness", "Registry health", "Owner Review Queue", "Admin Boundary", "Product UAT gap map"];
const approvalChecks = [
  "PITS starts with project attention and work items, not diagnostics.",
  "Workboard remains the main daily execution page.",
  "Work Item Detail is understandable to project users.",
  "Dry-run Action Preview clearly says no data will be changed.",
  "Owner approves the draft before Stage 2D implementation."
] as const;

function FlowScreenCard({ screen }: { screen: (typeof pitsScreens)[number] }) {
  return (
    <article className="project-card" data-product-flow-screen={screen.title}>
      <span className="eyebrow">Screen draft</span>
      <h3>{screen.title}</h3>
      <p className="muted">{screen.purpose}</p>
      <div className="functional-gap-list">
        {screen.sections.map((section) => (
          <span key={section}>{section}</span>
        ))}
      </div>
    </article>
  );
}

export default async function ProductFlowPage() {
  const snapshot = await getPlatformRegistrySnapshot();

  return (
    <PitsShell active="product-flow" snapshot={snapshot}>
      <PageHeading eyebrow="UX Draft / Product Flow Preview" title="PITS Product UX Blueprint">
        Product Flow Preview for owner review before deeper PITS implementation. This is read-only draft guidance; no status, owner, note, priority or blocker change is enabled.
      </PageHeading>
      <section className="panel product-uat-panel" data-product-flow-preview="Product Flow Preview">
        <div className="panel-heading">
          <div>
            <h3>Product Flow Preview</h3>
            <p className="muted">PITS should become a project execution product, while runtime and admin views remain secondary diagnostics.</p>
          </div>
          <StatusBadge ok={true} label="Read-only UX draft" />
        </div>
        <div className="owner-review-marker-row" aria-label="PITS UX blueprint markers">
          <span>PITS Product UX Blueprint</span>
          <span>Product page vs Admin console</span>
          <span>Owner approval required</span>
          <span>No write endpoints added</span>
          <span>No data will be changed</span>
        </div>
      </section>
      <section className="project-grid" aria-label="PITS product screen flow">
        {pitsScreens.map((screen) => (
          <FlowScreenCard screen={screen} key={screen.title} />
        ))}
      </section>
      <section className="content-grid" aria-label="Product page vs Admin console">
        <article className="panel">
          <h3>Product pages</h3>
          <p className="muted">Daily project workflow, written in project language and grounded in the existing Stage 2A/2B read-only slices.</p>
          <div className="functional-gap-list">
            {productPages.map((page) => (
              <span key={page}>{page}</span>
            ))}
          </div>
        </article>
        <article className="panel admin-boundary-panel">
          <h3>Admin and runtime pages</h3>
          <p className="muted">Owner/operator surfaces for runtime, readiness, permission and audit checks.</p>
          <div className="functional-gap-list">
            {adminPages.map((page) => (
              <span key={page}>{page}</span>
            ))}
          </div>
        </article>
      </section>
      <section className="panel owner-review-panel" aria-label="Owner approval checklist">
        <div className="panel-heading">
          <div>
            <h3>Owner approval checklist</h3>
            <p className="muted">Approve or comment on this flow before Stage 2D starts.</p>
          </div>
          <StatusBadge ok={true} label="Draft gate" />
        </div>
        <ul className="safety-gate-list">
          {approvalChecks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </section>
      <section className="content-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </PitsShell>
  );
}
