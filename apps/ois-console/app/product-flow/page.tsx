import { getPlatformRegistrySnapshot } from "@ois/shared-ui";
import { DataBoundaryPanel, OisConsoleShell, PageHeading, RuntimeStatusCard, StatusBadge } from "../shell";

export const dynamic = "force-dynamic";

const oisScreens = [
  {
    title: "Executive Dashboard",
    purpose: "Give CEO and manager users an organizational intelligence overview.",
    sections: ["What changed today", "Key risks", "Decisions waiting", "Commitments due", "Projects needing attention", "Knowledge highlights", "Suggested questions to ask"]
  },
  {
    title: "Workspace List",
    purpose: "Select an organization or workspace context.",
    sections: ["Workspace cards", "Data freshness", "Knowledge coverage", "Meeting/document counts", "Risk/decision/commitment counts"]
  },
  {
    title: "Workspace Intelligence Dashboard",
    purpose: "Main OIS product page for one workspace.",
    sections: ["Executive summary", "Current risks", "Decisions", "Commitments", "People/departments/projects involved", "Recent meetings/documents", "Ask Copilot entry point"]
  },
  {
    title: "Meeting/Document Knowledge Feed",
    purpose: "Show ingested knowledge sources and extracted insights.",
    sections: ["Meeting/document list", "Status", "Extracted decisions", "Commitments", "Risks", "Entity links", "Evidence/source snippets concept"]
  },
  {
    title: "Knowledge Detail",
    purpose: "Inspect one knowledge item with evidence.",
    sections: ["Summary", "Evidence", "Source transcript/document", "Related entities", "Related decisions/risks/commitments", "Confidence/source quality concept"]
  },
  {
    title: "Ask OIS / Copilot",
    purpose: "Let managers ask questions against organizational knowledge.",
    sections: ["Suggested questions", "Answer with citations/evidence", "Related risks/decisions/commitments", "Insufficient evidence fallback", "No hallucinated answer rule"]
  },
  {
    title: "Runtime/Admin",
    purpose: "Keep registry, runtime and admin diagnostics separate from product usage.",
    sections: ["Registry readiness", "Runtime health", "Owner review", "Admin boundary", "Product UAT gap map"]
  }
] as const;

const productPages = ["Executive Dashboard", "Workspace List", "Workspace Intelligence Dashboard", "Knowledge Feed", "Knowledge Detail", "Ask OIS / Copilot"];
const adminPages = ["Dashboard", "Products", "Workspaces registry", "Runtime", "Owner Review Queue", "Admin Boundary"];
const approvalChecks = [
  "OIS starts with organizational intelligence, not registry diagnostics.",
  "Every intelligence claim requires evidence and provenance in future stages.",
  "Ask OIS returns evidence-backed answers or an insufficient-evidence fallback.",
  "Admin and runtime pages stay available but secondary.",
  "Owner approves the draft before Stage 2D implementation."
] as const;

function FlowScreenCard({ screen }: { screen: (typeof oisScreens)[number] }) {
  return (
    <article className="panel compact-panel" data-product-flow-screen={screen.title}>
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
    <OisConsoleShell active="product-flow" snapshot={snapshot}>
      <PageHeading eyebrow="UX Draft / Product Flow Preview" title="OIS Product UX Blueprint">
        Product Flow Preview for owner review before deeper OIS implementation. This is read-only draft guidance; no intelligence, write action or LLM answer is executed.
      </PageHeading>
      <section className="panel product-uat-panel" data-product-flow-preview="Product Flow Preview">
        <div className="panel-heading">
          <div>
            <h3>Product Flow Preview</h3>
            <p className="muted">OIS should become an organizational intelligence product, while the current console remains the admin/control-plane surface.</p>
          </div>
          <StatusBadge ok={true} label="Read-only UX draft" />
        </div>
        <div className="owner-review-marker-row" aria-label="OIS UX blueprint markers">
          <span>OIS Product UX Blueprint</span>
          <span>Product page vs Admin console</span>
          <span>Owner approval required</span>
          <span>No write endpoints added</span>
          <span>No LLM call</span>
        </div>
      </section>
      <section className="dashboard-grid" aria-label="OIS product screen flow">
        {oisScreens.map((screen) => (
          <FlowScreenCard screen={screen} key={screen.title} />
        ))}
      </section>
      <section className="dashboard-grid" aria-label="Product page vs Admin console">
        <article className="panel">
          <h3>Product pages</h3>
          <p className="muted">Daily manager workflow, written in business language and backed by future evidence/provenance rules.</p>
          <div className="functional-gap-list">
            {productPages.map((page) => (
              <span key={page}>{page}</span>
            ))}
          </div>
        </article>
        <article className="panel admin-boundary-panel">
          <h3>Admin/control-plane pages</h3>
          <p className="muted">Owner/operator surfaces for registry, runtime, permission and audit readiness.</p>
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
      <section className="dashboard-grid">
        <RuntimeStatusCard snapshot={snapshot} />
        <DataBoundaryPanel />
      </section>
    </OisConsoleShell>
  );
}
