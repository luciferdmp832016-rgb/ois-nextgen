import Link from "next/link";
import type { ReactNode } from "react";
import {
  getAdminBoundaryActionsFor,
  getAdminBoundaryPreviewActions,
  getOwnerForbiddenLinkIssueCount,
  getOwnerHealthLabel,
  getOwnerMissingLinkCount,
  getOwnerReviewItemsFor,
  getOwnerReviewPreviewItems,
  getOwnerReadinessLabel,
  getProductUatPreviewSurfaces,
  getProductUatProduct,
  getProductUatSurfacesFor,
  getReadinessGaps,
  kernelFields,
  ModernProductShell,
  type AdminBoundaryAction,
  type AdminPermissionState,
  type KernelField,
  type OwnerActionPermission,
  type OwnerReviewItem,
  type OwnerReviewSeverity,
  type PlatformRegistrySnapshot,
  type PlatformSnapshot,
  type ProductUatSurface,
  type RegistryDetailSnapshot,
  type RegistryHealthItem,
  type RegistryHealthStatus,
  type RegistryReadinessItem,
  type RegistryReadinessStatus
} from "@ois/shared-ui";

const navItems = [
  { id: "overview", href: "/", label: "Overview", shortLabel: "Ov" },
  { id: "projects", href: "/projects", label: "Projects", shortLabel: "Pr" },
  { id: "runtime", href: "/runtime", label: "Runtime", shortLabel: "Rt" }
];

const countLabels: Record<KernelField, string> = {
  industries: "Industries",
  organizations: "Organizations",
  workspaces: "Workspaces",
  projects: "Projects",
  products: "Products",
  installations: "Installations",
  modules: "Modules",
  auditRecords: "Audit Records"
};
const controlPlaneOnlyText = ["Control", "plane only"].join("-");

export function PitsShell({
  active,
  snapshot,
  children
}: {
  active: string;
  snapshot: PlatformSnapshot;
  children: ReactNode;
}) {
  const healthOk = snapshot.health.ok && snapshot.healthStatus === "ok";

  return (
    <ModernProductShell
      active={active}
      coreApiUrl={snapshot.coreApiUrl}
      demoBanner={snapshot.overviewBanner}
      healthLabel={healthOk ? "Core API healthy" : "Needs owner review"}
      healthOk={healthOk}
      navAriaLabel="PITS Shell navigation"
      navItems={navItems}
      productCode="PITS_SHELL"
      productContext="Product Runtime"
      productName="PITS Shell"
    >
      {children}
    </ModernProductShell>
  );
}

export function PageHeading({ title, eyebrow, children }: { title: string; eyebrow: string; children?: ReactNode }) {
  return (
    <section
      className="page-heading"
      data-owner-design-system="Owner-first Design System"
      data-visual-hierarchy="Visual Hierarchy Standard"
    >
      <span className="eyebrow">{eyebrow}</span>
      <h2>{title}</h2>
      {children ? <p>{children}</p> : null}
      <div className="owner-page-cues" aria-label="Owner page cues">
        <span>What this is</span>
        <span>Health</span>
        <span>Readiness</span>
        <span>Missing</span>
        <span>Next</span>
      </div>
    </section>
  );
}

function ownerStatusTone(ok: boolean, label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("blocked")) {
    return "status-critical";
  }

  if (normalized.includes("not applicable")) {
    return "status-neutral";
  }

  if (
    ok ||
    normalized.includes("ready") ||
    normalized.includes("healthy") ||
    normalized.includes("no issue detected") ||
    normalized.includes("detail ready") ||
    normalized.includes("overview ready") ||
    normalized.includes("registry ready")
  ) {
    return "status-ok";
  }

  return "status-warn";
}

export function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`status ${ownerStatusTone(ok, label)}`} data-owner-status="Owner-friendly Status Badges">
      {label}
    </span>
  );
}

function HealthBadge({ status }: { status: RegistryHealthStatus }) {
  const className =
    status === "Healthy" || status === "Configured" || status === "Linked" || status === "Reachable"
      ? "status status-ok"
      : status === "Not applicable"
        ? "status status-neutral"
        : "status status-warn";

  return (
    <span className={className} data-owner-status="Owner-friendly Status Badges">
      {status}
    </span>
  );
}

function HealthBadgeRow({ badges }: { badges: RegistryHealthStatus[] }) {
  return (
    <div className="badge-row">
      {badges.map((badge) => (
        <HealthBadge status={badge} key={badge} />
      ))}
    </div>
  );
}

const healthLinkLabels: Record<string, string> = {
  coreApiDetail: "Core API detail",
  pitsProjectDetail: "PITS project detail",
  oisProduct: "OIS product",
  oisWorkspace: "OIS workspace",
  oisConsoleDetail: "OIS Console detail",
  pitsProject: "PITS project",
  productRuntime: "Product runtime"
};

type OwnerLink = { href: string | null | undefined; label: string; detail?: string | undefined; external?: boolean | undefined };

function OwnerLinkList({ links }: { links: OwnerLink[] }) {
  const availableLinks = links.filter((link): link is OwnerLink & { href: string } => Boolean(link.href));

  if (availableLinks.length === 0) {
    return <p className="muted">No owner quick links are available for this project view.</p>;
  }

  return (
    <div className="owner-link-list">
      {availableLinks.map((link) =>
        link.external ? (
          <a href={link.href} key={`${link.href}-${link.label}`}>
            {link.label}
            {link.detail ? <span>{link.detail}</span> : null}
          </a>
        ) : (
          <Link href={link.href} key={`${link.href}-${link.label}`}>
            {link.label}
            {link.detail ? <span>{link.detail}</span> : null}
          </Link>
        )
      )}
    </div>
  );
}

function ownerReadyStatus(readiness: RegistryReadinessItem | null | undefined, health: RegistryHealthItem | null | undefined) {
  return Boolean(readiness?.status === "READY" && health?.status === "Healthy");
}

function readinessGapText(readiness: RegistryReadinessItem | null | undefined) {
  const gaps = getReadinessGaps(readiness);
  return gaps.length > 0 ? gaps.join(" ") : "No issue detected";
}

export function PitsRegistryCockpit({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  const healthSummary = snapshot.registryHealthPayload?.summary;
  const readinessSummary = snapshot.registryReadinessPayload?.summary;
  const missingLinkCount = getOwnerMissingLinkCount(snapshot);
  const forbiddenIssueCount = getOwnerForbiddenLinkIssueCount(snapshot);
  const missingRuntimeUrlCount = healthSummary?.missingUrl ?? 0;
  const firstProjectReadiness = snapshot.projects[0]
    ? snapshot.registryReadinessEntities.projects.find((project) => project.id === snapshot.projects[0]?.id)
    : null;
  const isReady =
    Boolean(snapshot.registryHealthPayload && snapshot.registryReadinessPayload) &&
    (readinessSummary?.blocked ?? 1) === 0 &&
    (readinessSummary?.incomplete ?? 1) === 0 &&
    (healthSummary?.degraded ?? 1) === 0 &&
    missingRuntimeUrlCount === 0 &&
    missingLinkCount === 0 &&
    forbiddenIssueCount === 0;

  const quickLinks: OwnerLink[] = [];
  const firstProject = snapshot.projects[0];

  if (firstProject) {
    quickLinks.push({ href: `/projects/${firstProject.id}`, label: "Open first PITS project", detail: firstProject.name });
    quickLinks.push({
      href: firstProjectReadiness?.links.oisProduct,
      label: "Open linked OIS product",
      detail: firstProject.name,
      external: true
    });
    quickLinks.push({
      href: firstProjectReadiness?.links.oisWorkspace,
      label: "Open linked OIS workspace",
      detail: firstProject.workspace?.name ?? firstProject.workspaceId,
      external: true
    });
  }

  return (
    <section className="panel owner-cockpit" data-owner-cockpit="PITS Registry Cockpit / Project Runtime Summary">
      <div className="panel-heading">
        <div>
          <h3>PITS Registry Cockpit / Project Runtime Summary</h3>
          <p className="muted">Read-only project cockpit showing what is ready, what needs owner review, what is missing and the next detail link to open.</p>
        </div>
        <StatusBadge ok={isReady} label={isReady ? "Ready to operate" : "Needs owner review"} />
      </div>
      <dl className="owner-fact-grid" aria-label="PITS registry counts">
        <div>
          <dt>Total projects</dt>
          <dd>{snapshot.projects.length}</dd>
        </div>
        <div>
          <dt>Total products</dt>
          <dd>{snapshot.products.length}</dd>
        </div>
        <div>
          <dt>Total workspaces</dt>
          <dd>{snapshot.workspaces.length}</dd>
        </div>
        <div>
          <dt>Total installations</dt>
          <dd>{snapshot.installations.length}</dd>
        </div>
        <div>
          <dt>Health summary</dt>
          <dd>{healthSummary ? `${healthSummary.healthy} healthy / ${healthSummary.degraded} needs review` : "Needs owner review"}</dd>
        </div>
        <div>
          <dt>Project readiness</dt>
          <dd>{readinessSummary ? getOwnerReadinessLabel(readinessSummary.status) : "Incomplete"}</dd>
        </div>
        <div>
          <dt>Ready / incomplete / blocked</dt>
          <dd>{readinessSummary ? `${readinessSummary.ready} / ${readinessSummary.incomplete} / ${readinessSummary.blocked}` : "Incomplete"}</dd>
        </div>
      </dl>
      <div className="owner-guard-grid" aria-label="PITS readiness guards">
        <div>
          <span>Missing link</span>
          <strong>{missingLinkCount}</strong>
          <StatusBadge ok={missingLinkCount === 0} label={missingLinkCount === 0 ? "No issue detected" : "Needs owner review"} />
        </div>
        <div>
          <span>Missing runtime URL</span>
          <strong>{missingRuntimeUrlCount}</strong>
          <StatusBadge ok={missingRuntimeUrlCount === 0} label={missingRuntimeUrlCount === 0 ? "No issue detected" : "Needs owner review"} />
        </div>
        <div>
          <span>Forbidden link guard</span>
          <strong>{forbiddenIssueCount}</strong>
          <StatusBadge ok={forbiddenIssueCount === 0} label={forbiddenIssueCount === 0 ? "No issue detected" : "Blocked"} />
        </div>
      </div>
      <div className="owner-quick-links">
        <h4>Quick project links</h4>
        <OwnerLinkList links={quickLinks} />
      </div>
    </section>
  );
}

export function ProjectCardUatSummary({
  health,
  readiness,
  linkedLabel
}: {
  health: RegistryHealthItem | null;
  readiness: RegistryReadinessItem | null;
  linkedLabel: string;
}) {
  const oisProductLink = readiness?.links.oisProduct ?? health?.links.oisProduct;
  const oisWorkspaceLink = readiness?.links.oisWorkspace ?? health?.links.oisWorkspace;

  return (
    <div className="owner-card-summary">
      <div className="badge-row">
        <StatusBadge ok={health?.status === "Healthy"} label={`Runtime health: ${getOwnerHealthLabel(health?.status)}`} />
        <StatusBadge ok={readiness?.status === "READY"} label={`Project readiness: ${getOwnerReadinessLabel(readiness?.status)}`} />
      </div>
      <p className="owner-relationship-line">{linkedLabel}</p>
      <p className="muted">What is missing? {readinessGapText(readiness)}</p>
      <div className="owner-inline-links">
        {oisProductLink ? <a href={oisProductLink}>OIS product link</a> : null}
        {oisWorkspaceLink ? <a href={oisWorkspaceLink}>OIS workspace link</a> : null}
      </div>
    </div>
  );
}

export function PitsOwnerEntityUatSummary({
  title,
  health,
  readiness,
  linkedFacts,
  links
}: {
  title: string;
  health: RegistryHealthItem | null;
  readiness: RegistryReadinessItem | null;
  linkedFacts: string[];
  links: OwnerLink[];
}) {
  return (
    <section className="panel owner-uat-summary" data-owner-uat={title}>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Owner-friendly project readiness and health answer for browser UAT.</p>
        </div>
        <StatusBadge ok={ownerReadyStatus(readiness, health)} label={ownerReadyStatus(readiness, health) ? "Ready to operate" : "Needs owner review"} />
      </div>
      <dl className="facts">
        <div>
          <dt>Runtime health</dt>
          <dd>{getOwnerHealthLabel(health?.status)}</dd>
        </div>
        <div>
          <dt>Project readiness</dt>
          <dd>{getOwnerReadinessLabel(readiness?.status)}</dd>
        </div>
        <div>
          <dt>What is missing?</dt>
          <dd>{readinessGapText(readiness)}</dd>
        </div>
        <div>
          <dt>Linked registry</dt>
          <dd>{linkedFacts.length > 0 ? linkedFacts.join("; ") : "Missing link"}</dd>
        </div>
      </dl>
      <div className="owner-quick-links">
        <h4>Owner UAT links</h4>
        <OwnerLinkList links={links} />
      </div>
    </section>
  );
}

function ownerReviewSeverityLabel(severity: OwnerReviewSeverity) {
  const labels: Record<OwnerReviewSeverity, string> = {
    INFO: "Read-only preview",
    REVIEW: "Owner review required",
    WARNING: "Future admin action",
    BLOCKED: "Blocked"
  };

  return labels[severity];
}

function ownerActionPermissionLabel(permission: OwnerActionPermission) {
  const labels: Record<OwnerActionPermission, string> = {
    READ_ONLY_PREVIEW: "Read-only preview",
    OWNER_REVIEW_REQUIRED: "Owner review required",
    FUTURE_ADMIN_ACTION: "Future admin action",
    BLOCKED_UNTIL_AUDIT: "Blocked until audit",
    NOT_ALLOWED_IN_STAGE_1I: "Not allowed in Stage 1I"
  };

  return labels[permission];
}

function ownerReviewOk(severity: OwnerReviewSeverity) {
  return severity === "INFO" || severity === "REVIEW";
}

function ActionBoundaryBadge({ permission }: { permission: OwnerActionPermission }) {
  return <StatusBadge ok={permission === "READ_ONLY_PREVIEW"} label={ownerActionPermissionLabel(permission)} />;
}

function DisabledActionPreview() {
  return (
    <span className="disabled-action-preview" aria-disabled="true" data-action-preview="Read-only preview">
      Action is read-only preview only
    </span>
  );
}

function SafetyGateList({ gates }: { gates: string[] }) {
  return (
    <ul className="safety-gate-list" aria-label="Future admin action safety gates">
      {gates.map((gate) => (
        <li key={gate}>{gate}</li>
      ))}
    </ul>
  );
}

function PitsOwnerReviewItemCard({ item }: { item: OwnerReviewItem }) {
  return (
    <article className="owner-review-card" data-owner-review-item={item.id}>
      <div className="panel-heading">
        <div>
          <span className="eyebrow">{item.entityType}</span>
          <h4>{item.title}</h4>
        </div>
        <StatusBadge ok={ownerReviewOk(item.severity)} label={ownerReviewSeverityLabel(item.severity)} />
      </div>
      <p className="muted">{item.reason}</p>
      <div className="owner-action-boundary-row">
        <ActionBoundaryBadge permission={item.actionPermission} />
        <DisabledActionPreview />
      </div>
      <section className="suggested-actions" aria-label="Suggested next actions">
        <h5>Suggested next actions</h5>
        <p>{item.suggestedOwnerAction}</p>
        <p className="muted">Future admin action requires audit / confirmation / rollback.</p>
      </section>
      <SafetyGateList gates={item.requiredSafetyGates} />
      <dl className="facts action-boundary-facts">
        <div>
          <dt>Audit</dt>
          <dd>{item.auditRequirement}</dd>
        </div>
        <div>
          <dt>Confirmation</dt>
          <dd>{item.confirmationRequirement}</dd>
        </div>
        <div>
          <dt>Rollback</dt>
          <dd>{item.rollbackRequirement}</dd>
        </div>
      </dl>
    </article>
  );
}

function adminPermissionLabel(state: AdminPermissionState) {
  const labels: Record<AdminPermissionState, string> = {
    ALLOWED_READ_ONLY: "Allowed read-only",
    PREVIEW_ONLY: "Preview only",
    REQUIRES_OWNER_CONFIRMATION: "Requires owner approval",
    REQUIRES_ADMIN_PERMISSION: "Requires admin permission",
    REQUIRES_AUDIT_TRAIL: "Requires audit trail",
    REQUIRES_ROLLBACK_PLAN: "Requires rollback plan",
    BLOCKED_IN_CURRENT_STAGE: "Blocked in current stage"
  };

  return labels[state];
}

function PermissionStateBadge({ state }: { state: AdminPermissionState }) {
  return <StatusBadge ok={state === "ALLOWED_READ_ONLY" || state === "PREVIEW_ONLY"} label={adminPermissionLabel(state)} />;
}

function PreviewOnlyNotice() {
  return (
    <span className="disabled-action-preview" aria-disabled="true" data-admin-preview="Preview only">
      Preview only - not executable yet
    </span>
  );
}

function PitsFutureActionCard({ action }: { action: AdminBoundaryAction }) {
  return (
    <article className="owner-review-card future-action-card" data-admin-boundary-action={action.id}>
      <div className="panel-heading">
        <div>
          <span className="eyebrow">{action.category}</span>
          <h4>{action.actionName}</h4>
        </div>
        <PermissionStateBadge state={action.permissionState} />
      </div>
      <div className="owner-action-boundary-row">
        <span className="admin-requirement-badge">Audit Required</span>
        <span className="admin-requirement-badge">Confirmation Required</span>
        <span className="admin-requirement-badge">Rollback Required</span>
        <PreviewOnlyNotice />
      </div>
      <p className="muted">{action.unavailableReason}</p>
      <dl className="facts action-boundary-facts">
        <div>
          <dt>Required role</dt>
          <dd>{action.requiredRole}</dd>
        </div>
        <div>
          <dt>Current availability</dt>
          <dd>{action.currentAvailability}</dd>
        </div>
        <div>
          <dt>Entity</dt>
          <dd>{action.entityName ?? action.entityType}</dd>
        </div>
      </dl>
      <SafetyGateList gates={action.safetyGatesNeeded} />
    </article>
  );
}

export function PitsAdminBoundaryPanel({
  snapshot,
  entityType,
  entityId,
  title = "Admin Boundary"
}: {
  snapshot: PlatformRegistrySnapshot;
  entityType?: AdminBoundaryAction["entityType"] | undefined;
  entityId?: string | undefined;
  title?: string | undefined;
}) {
  const payload = snapshot.adminBoundaryPayload;
  const actions = entityType && entityId ? getAdminBoundaryActionsFor(snapshot, entityType, entityId) : getAdminBoundaryPreviewActions(snapshot);
  const markers = payload?.adminBoundary.markers ?? ["Admin Boundary", "Audit Required", "Permission Model", "Preview only", "Blocked in current stage"];

  return (
    <section className="panel admin-boundary-panel" data-admin-boundary="Admin Boundary" data-permission-model="Permission Model">
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Project-level Permission Model and audit-readiness layer. No project admin action is enabled.</p>
        </div>
        <StatusBadge ok={Boolean(payload)} label="Preview only" />
      </div>
      <div className="owner-review-marker-row" aria-label="Admin boundary markers">
        {markers.map((marker) => (
          <span key={marker}>{marker}</span>
        ))}
        <span>Future admin action</span>
        <span>Requires owner approval</span>
        <span>Requires audit trail</span>
      </div>
      <dl className="owner-fact-grid" aria-label="Project admin boundary summary">
        <div>
          <dt>Roles</dt>
          <dd>{payload?.summary.roles ?? 0}</dd>
        </div>
        <div>
          <dt>Permission states</dt>
          <dd>{payload?.summary.permissionStates ?? 0}</dd>
        </div>
        <div>
          <dt>Audit Required</dt>
          <dd>{payload?.summary.auditRequired ?? 0}</dd>
        </div>
        <div>
          <dt>Blocked in current stage</dt>
          <dd>{payload?.summary.blockedActions ?? 0}</dd>
        </div>
      </dl>
      {actions.length > 0 ? (
        <div className="owner-review-grid">
          {actions.map((action) => (
            <PitsFutureActionCard action={action} key={action.id} />
          ))}
        </div>
      ) : (
        <article className="owner-review-card owner-empty-state">
          <span className="eyebrow">Permission Model</span>
          <h4>No future action mapped</h4>
          <p className="muted">No project admin boundary action is currently mapped for this registry entity.</p>
          <PreviewOnlyNotice />
        </article>
      )}
      <p className="muted health-note">{payload?.runtime.note ?? "Admin boundary payload unavailable. No action is executable from this UI."}</p>
    </section>
  );
}

function CapabilityStatusBadge({ surface }: { surface: ProductUatSurface }) {
  return <StatusBadge ok={surface.category === "AVAILABLE_FOR_BROWSER_UAT"} label={surface.statusLabel} />;
}

function FunctionalGapList({ surface }: { surface: ProductUatSurface }) {
  return (
    <div className="functional-gap-list">
      <span>Owner UAT status: {surface.ownerUatStatus}</span>
      <span>Next user-level test path: {surface.nextUserLevelTestPath ?? "Not implemented yet"}</span>
      {surface.blockers.map((blocker) => (
        <span key={blocker}>{blocker}</span>
      ))}
    </div>
  );
}

function PitsUserJourneyCard({ surface }: { surface: ProductUatSurface }) {
  return (
    <article className="owner-review-card user-journey-card" data-product-uat-surface={surface.id}>
      <div className="panel-heading">
        <div>
          <span className="eyebrow">{surface.productCode}</span>
          <h4>{surface.surfaceName}</h4>
        </div>
        <CapabilityStatusBadge surface={surface} />
      </div>
      <section className="suggested-actions" aria-label="What can be tested now?">
        <h5>What can be tested now?</h5>
        <p>{surface.currentUserTest}</p>
      </section>
      <section className="suggested-actions" aria-label="Registry/runtime scope">
        <h5>{controlPlaneOnlyText}</h5>
        <p>{surface.currentReality}</p>
      </section>
      <section className="suggested-actions" aria-label="What is not implemented yet?">
        <h5>What is not implemented yet?</h5>
        <p>{surface.functionalGap ?? "No functional gap is mapped for this surface."}</p>
      </section>
      <section className="suggested-actions" aria-label="Recommended next product functions">
        <h5>Recommended next product functions</h5>
        <p>{surface.recommendedNextStep}</p>
      </section>
      <FunctionalGapList surface={surface} />
      {surface.route ? (
        <div className="link-list">
          <a href={surface.route}>Open test path</a>
        </div>
      ) : null}
    </article>
  );
}

export function PitsProductUatPanel({
  snapshot,
  entityType,
  entityId,
  title = "Product User Journey UAT"
}: {
  snapshot: PlatformRegistrySnapshot;
  entityType?: ProductUatSurface["entityType"] | undefined;
  entityId?: string | undefined;
  title?: string | undefined;
}) {
  const payload = snapshot.productUatPayload;
  const product = getProductUatProduct(snapshot, "PITS");
  const surfaces = getProductUatSurfacesFor(snapshot, "PITS", entityType, entityId).slice(0, 6);
  const markers = payload?.productUat.markers ?? ["Product User Journey UAT", "Testable now", controlPlaneOnlyText, "Functional gap map", "Next product journey"];
  const previewSurfaces = surfaces.length > 0 ? surfaces : getProductUatPreviewSurfaces(snapshot, 4);
  const nextJourneys = product?.recommendedNextJourneys ?? payload?.recommendedNextProductJourneys ?? [];

  return (
    <section className="panel product-uat-panel" data-product-uat="Product User Journey UAT">
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Project-level UAT baseline and functional gap map. This is read-only and does not enable project writes.</p>
        </div>
        <StatusBadge ok={Boolean(payload)} label="Testable now" />
      </div>
      <div className="owner-review-marker-row" aria-label="Product UAT markers">
        {markers.map((marker) => (
          <span key={marker}>{marker}</span>
        ))}
        <span>Owner UAT status</span>
        <span>Next user-level test path</span>
      </div>
      <dl className="owner-fact-grid" aria-label="Project UAT summary">
        <div>
          <dt>Products</dt>
          <dd>{payload?.summary.products ?? 0}</dd>
        </div>
        <div>
          <dt>Testable now</dt>
          <dd>{payload?.summary.testableNow ?? 0}</dd>
        </div>
        <div>
          <dt>{controlPlaneOnlyText}</dt>
          <dd>{payload?.summary.controlPlaneOnly ?? 0}</dd>
        </div>
        <div>
          <dt>Real product functions</dt>
          <dd>{payload?.summary.realProductFunctionsAvailable ?? 0}</dd>
        </div>
      </dl>
      {product ? (
        <section className="suggested-actions" aria-label="Owner UAT status">
          <h5>Owner UAT status</h5>
          <p>{product.currentState}</p>
        </section>
      ) : null}
      {nextJourneys.length > 0 ? (
        <section className="suggested-actions" aria-label="Next product journey">
          <h5>Next product journey</h5>
          <div className="functional-gap-list">
            {nextJourneys.map((journey) => (
              <span key={journey}>{journey}</span>
            ))}
          </div>
        </section>
      ) : null}
      {previewSurfaces.length > 0 ? (
        <div className="owner-review-grid">
          {previewSurfaces.map((surface) => (
            <PitsUserJourneyCard surface={surface} key={surface.id} />
          ))}
        </div>
      ) : (
        <article className="owner-review-card owner-empty-state">
          <span className="eyebrow">Functional gap map</span>
          <h4>No product UAT map available</h4>
          <p className="muted">Product user journey data is unavailable. No project action is executable.</p>
        </article>
      )}
      <p className="muted health-note">{payload?.runtime.note ?? "Product UAT payload unavailable. No product action is executable."}</p>
    </section>
  );
}

export function PitsOwnerReviewQueuePanel({
  snapshot,
  entityType,
  entityId,
  title = "Owner Review Queue"
}: {
  snapshot: PlatformRegistrySnapshot;
  entityType?: OwnerReviewItem["entityType"] | undefined;
  entityId?: string | undefined;
  title?: string | undefined;
}) {
  const payload = snapshot.ownerReviewPayload;
  const items = entityType && entityId ? getOwnerReviewItemsFor(snapshot, entityType, entityId) : getOwnerReviewPreviewItems(snapshot);
  const markers = payload?.actionBoundary.markers ?? ["Owner Review Queue", "Safe Action Boundary", "Read-only preview", "Future admin action requires audit"];

  return (
    <section className="panel owner-review-panel" data-owner-review="Owner Review Queue" data-action-boundary="Safe Action Boundary">
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Safe Action Boundary for project review. Current PITS stage is preview-only and read-only.</p>
        </div>
        <StatusBadge ok={Boolean(payload)} label="Read-only preview" />
      </div>
      <div className="owner-review-marker-row" aria-label="Safe action boundary markers">
        {markers.map((marker) => (
          <span key={marker}>{marker}</span>
        ))}
        <span>Action is read-only preview only</span>
        <span>Future admin action requires audit / confirmation / rollback</span>
      </div>
      <dl className="owner-fact-grid" aria-label="Project owner review summary">
        <div>
          <dt>Review items</dt>
          <dd>{payload?.summary.total ?? 0}</dd>
        </div>
        <div>
          <dt>Owner review</dt>
          <dd>{payload?.summary.review ?? 0}</dd>
        </div>
        <div>
          <dt>Future admin action</dt>
          <dd>{payload?.summary.futureAdminAction ?? 0}</dd>
        </div>
        <div>
          <dt>Blocked until audit</dt>
          <dd>{payload?.summary.blockedUntilAudit ?? 0}</dd>
        </div>
      </dl>
      {items.length > 0 ? (
        <div className="owner-review-grid">
          {items.map((item) => (
            <PitsOwnerReviewItemCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <article className="owner-review-card owner-empty-state">
          <span className="eyebrow">No review needed</span>
          <h4>No review needed</h4>
          <p className="muted">No owner review item is currently derived for this project.</p>
          <DisabledActionPreview />
        </article>
      )}
      <p className="muted health-note">{payload?.runtime.note ?? "Owner review payload unavailable. No action is executable from this UI."}</p>
    </section>
  );
}

function HealthCheckList({ item }: { item: RegistryHealthItem }) {
  return (
    <div className="health-check-list">
      {item.checks.map((check) => (
        <div className="health-check" key={check.label}>
          <div>
            <strong>{check.label}</strong>
            <p className="muted">{check.detail}</p>
          </div>
          {check.url ? <a href={check.url}>Open</a> : <HealthBadge status={check.status} />}
        </div>
      ))}
    </div>
  );
}

function HealthLinks({ item }: { item: RegistryHealthItem }) {
  const links = Object.entries(item.links).filter((entry): entry is [string, string] => Boolean(entry[1]));

  if (links.length === 0) {
    return <p className="muted">No staging-safe links are configured for this health item.</p>;
  }

  return (
    <div className="link-list">
      {links.map(([key, href]) => (
        <a href={href} key={key}>
          {healthLinkLabels[key] ?? key}
        </a>
      ))}
    </div>
  );
}

export function RegistryHealthPanel({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  const payload = snapshot.registryHealthPayload;
  const summary = payload?.summary;

  return (
    <section className="panel registry-health-panel" data-registry-health="Registry Runtime Health">
      <div className="panel-heading">
        <div>
          <h3>Registry Runtime Health</h3>
          <p className="muted">Project runtime availability from Core API /platform/registry/health.</p>
        </div>
        <StatusBadge
          ok={Boolean(payload && summary?.status === "Healthy")}
          label={payload ? `Registry health ${summary?.status}` : "Needs owner review"}
        />
      </div>
      {payload ? (
        <>
          <dl className="facts">
            <div>
              <dt>Total</dt>
              <dd>{summary?.total ?? 0}</dd>
            </div>
            <div>
              <dt>Healthy</dt>
              <dd>{summary?.healthy ?? 0}</dd>
            </div>
            <div>
              <dt>Degraded</dt>
              <dd>{summary?.degraded ?? 0}</dd>
            </div>
            <div>
              <dt>Missing URL</dt>
              <dd>{summary?.missingUrl ?? 0}</dd>
            </div>
            <div>
              <dt>PITS Shell</dt>
              <dd>{payload.runtime.pitsShellBaseUrl}</dd>
            </div>
            <div>
              <dt>OIS Console</dt>
              <dd>{payload.runtime.oisConsoleBaseUrl}</dd>
            </div>
            <div>
              <dt>Core API</dt>
              <dd>{payload.runtime.coreApiBaseUrl}</dd>
            </div>
          </dl>
          <p className="muted health-note">{payload.runtime.note}</p>
        </>
      ) : (
        <p className="muted">Health needs owner review. Registry-safe summary copy is shown.</p>
      )}
    </section>
  );
}

export function RegistryHealthItemPanel({ title, item }: { title: string; item: RegistryHealthItem | null }) {
  return (
    <section className="panel registry-health-panel" data-registry-health={title}>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Workspace, product, installation, OIS link and Core API source checks for this project.</p>
        </div>
        {item ? <HealthBadge status={item.status} /> : <StatusBadge ok={false} label="Needs owner review" />}
      </div>
      {item ? (
        <>
          <HealthBadgeRow badges={item.badges} />
          <HealthCheckList item={item} />
          <HealthLinks item={item} />
        </>
      ) : (
        <p className="muted">No health item is available for this project. Review the registry sync before runtime closure.</p>
      )}
    </section>
  );
}

function readinessLabel(status: RegistryReadinessStatus) {
  const labels: Record<RegistryReadinessStatus, string> = {
    READY: "Ready",
    INCOMPLETE: "Incomplete",
    BLOCKED: "Blocked",
    NOT_APPLICABLE: "Not applicable",
    UNKNOWN: "Unknown"
  };

  return labels[status];
}

function ReadinessBadge({ status }: { status: RegistryReadinessStatus }) {
  const className = status === "READY" ? "status status-ok" : status === "NOT_APPLICABLE" ? "status status-neutral" : "status status-warn";

  return (
    <span className={className} data-owner-status="Owner-friendly Status Badges">
      {readinessLabel(status)}
    </span>
  );
}

function ReadinessBadgeRow({ badges }: { badges: RegistryReadinessStatus[] }) {
  return (
    <div className="badge-row">
      {badges.map((badge) => (
        <ReadinessBadge status={badge} key={badge} />
      ))}
    </div>
  );
}

function ReadinessCheckList({ item }: { item: RegistryReadinessItem }) {
  return (
    <div className="health-check-list">
      {item.checks.map((check) => (
        <div className="health-check" key={`${check.dimension}-${check.label}`}>
          <div>
            <strong>{check.label}</strong>
            <p className="muted">{check.reason}</p>
          </div>
          {check.evidenceUrl ? <a href={check.evidenceUrl}>Open</a> : <ReadinessBadge status={check.status} />}
        </div>
      ))}
    </div>
  );
}

function MissingReadinessPanel({ item }: { item: RegistryReadinessItem }) {
  const gaps = [...item.blockedReasons, ...item.missing];

  return (
    <section className="missing-list" aria-label="What is missing">
      <h4>What is missing?</h4>
      {gaps.length > 0 ? (
        <ul>
          {gaps.map((gap) => (
            <li key={gap}>{gap}</li>
          ))}
        </ul>
      ) : (
        <p className="muted">No required registry readiness gaps were detected. Owner UAT is still required before runtime closure.</p>
      )}
      {item.ownerActions.length > 0 ? (
        <>
          <h4>Owner actions</h4>
          <ul>
            {item.ownerActions.map((action) => (
              <li key={action}>{action}</li>
            ))}
          </ul>
        </>
      ) : null}
    </section>
  );
}

export function RegistryGovernancePanel({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  const payload = snapshot.registryReadinessPayload;
  const summary = payload?.summary;

  return (
    <section className="panel registry-readiness-panel" data-registry-readiness="Registry Governance / Readiness">
      <div className="panel-heading">
        <div>
          <h3>Registry Governance / Readiness</h3>
          <p className="muted">Project readiness from Core API /platform/registry/readiness.</p>
        </div>
        {summary ? <ReadinessBadge status={summary.status} /> : <StatusBadge ok={false} label="Needs owner review" />}
      </div>
      {payload ? (
        <>
          <dl className="facts">
            <div>
              <dt>Total</dt>
              <dd>{summary?.total ?? 0}</dd>
            </div>
            <div>
              <dt>Ready</dt>
              <dd>{summary?.ready ?? 0}</dd>
            </div>
            <div>
              <dt>Incomplete</dt>
              <dd>{summary?.incomplete ?? 0}</dd>
            </div>
            <div>
              <dt>Blocked</dt>
              <dd>{summary?.blocked ?? 0}</dd>
            </div>
            <div>
              <dt>Unknown</dt>
              <dd>{summary?.unknown ?? 0}</dd>
            </div>
            <div>
              <dt>Core API</dt>
              <dd>{payload.runtime.coreApiBaseUrl}</dd>
            </div>
          </dl>
          <p className="muted health-note">{payload.runtime.note}</p>
        </>
      ) : (
        <p className="muted">Readiness is incomplete. Registry-safe summary copy is shown.</p>
      )}
    </section>
  );
}

export function RegistryReadinessItemPanel({ title, item }: { title: string; item: RegistryReadinessItem | null }) {
  return (
    <section className="panel registry-readiness-panel" data-registry-readiness={title}>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Readiness shows whether this project can operate from the registry perspective.</p>
        </div>
        {item ? <ReadinessBadge status={item.status} /> : <StatusBadge ok={false} label="Incomplete" />}
      </div>
      {item ? (
        <>
          <ReadinessBadgeRow badges={item.badges} />
          <MissingReadinessPanel item={item} />
          <ReadinessCheckList item={item} />
        </>
      ) : (
        <p className="muted">No readiness item is available for this project. Review the registry sync before runtime closure.</p>
      )}
    </section>
  );
}

export function ProjectSelector({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Project Selector</h3>
          <p className="muted">Project count from Core API /platform/overview: {snapshot.counts.projects ?? "-"}.</p>
        </div>
        <span className="pill">Installations: {snapshot.counts.installations ?? "-"}</span>
      </div>
      <div className="project-grid">
        {snapshot.projects.length > 0 ? (
          snapshot.projects.map((project) => (
            <article className="project-card" key={project.id}>
              <span className="eyebrow">{project.code}</span>
              <h3>
                <Link href={`/projects/${project.id}`}>{project.name}</Link>
              </h3>
              <p className="muted">
                {project.organization?.name ?? "Unknown organization"} / {project.workspace?.name ?? "Unknown workspace"}
              </p>
              <ProjectCardUatSummary
                health={snapshot.registryHealthEntities.projects.find((item) => item.id === project.id) ?? null}
                readiness={snapshot.registryReadinessEntities.projects.find((item) => item.id === project.id) ?? null}
                linkedLabel={`Linked product(s): ${project.installations.length}; linked workspace: ${
                  project.workspace?.name ?? project.workspaceId
                }`}
              />
              <strong>{project.installations.length} installation(s)</strong>
            </article>
          ))
        ) : (
          <article className="project-card owner-empty-state" data-owner-empty-state="Owner-safe empty state">
            <span className="eyebrow">Needs owner review</span>
            <h3>No projects returned</h3>
            <p className="muted">No projects are available in this registry view. Confirm registry data after owner runtime sync.</p>
            <p className="muted owner-safe-note">Safe empty state: only registry-safe summary copy is shown.</p>
            <strong>Read-only</strong>
          </article>
        )}
      </div>
    </section>
  );
}

export function RuntimeStatusCard({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Runtime Status</h3>
          <p className="muted">PITS reads platform data through Core API only.</p>
        </div>
        <StatusBadge
          ok={snapshot.health.ok && snapshot.healthStatus === "ok"}
          label={snapshot.health.ok ? "Health ready" : "Needs owner review"}
        />
      </div>
      <dl className="facts">
        <div>
          <dt>Status</dt>
          <dd>{snapshot.healthStatus}</dd>
        </div>
        <div>
          <dt>Service</dt>
          <dd>{snapshot.healthService}</dd>
        </div>
        <div>
          <dt>Stage</dt>
          <dd>{snapshot.healthStage}</dd>
        </div>
        <div>
          <dt>HTTP</dt>
          <dd>{snapshot.health.status ?? snapshot.health.error ?? "Needs owner review"}</dd>
        </div>
        <div>
          <dt>Core API</dt>
          <dd>{snapshot.coreApiUrl}</dd>
        </div>
      </dl>
    </section>
  );
}

export function ProjectOverviewCards({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="metrics-grid" aria-label="PITS project overview">
      <Metric label="Projects" value={snapshot.counts.projects} />
      <Metric label="Products" value={snapshot.counts.products} />
      <Metric label="Installations" value={snapshot.counts.installations} />
      <Metric label="Modules" value={snapshot.counts.modules} />
    </section>
  );
}

export function InstallationRegistryPanel({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Project Installation Registry</h3>
          <p className="muted">PITS installation mapping read from Core API /platform/registry.</p>
        </div>
        <span className="pill">Installations: {snapshot.installations.length}</span>
      </div>
      <div className="project-grid">
        {snapshot.installations.length > 0 ? (
          snapshot.installations.map((installation) => (
            <article className="project-card" key={installation.id}>
              <span className="eyebrow">{installation.productCode}</span>
              <h3>{installation.project?.name ?? installation.projectId}</h3>
              <p className="muted">
                {installation.workspace?.name ?? "Unknown workspace"} / {installation.organization?.name ?? "Unknown organization"}
              </p>
              <strong>{installation.lifecycle}</strong>
            </article>
          ))
        ) : (
          <article className="project-card owner-empty-state" data-owner-empty-state="Owner-safe empty state">
            <span className="eyebrow">Needs owner review</span>
            <h3>No installations returned</h3>
            <p className="muted">No installations are available in this registry view. Confirm registry data after owner runtime sync.</p>
            <p className="muted owner-safe-note">Safe empty state: only registry-safe summary copy is shown.</p>
            <strong>Read-only</strong>
          </article>
        )}
      </div>
    </section>
  );
}

export function DetailStatusPanel<T>({ detail, label }: { detail: RegistryDetailSnapshot<T>; label: string }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>{label} Source</h3>
          <p className="muted">Read-only detail data from Core API.</p>
        </div>
        <StatusBadge ok={detail.detail.ok} label={detail.detail.ok ? "Detail ready" : detail.notFound ? "Missing link" : "Needs owner review"} />
      </div>
      <dl className="facts">
        <div>
          <dt>Source</dt>
          <dd>{detail.metadata?.source ?? "Needs owner review"}</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>{detail.metadata?.mode ?? "read-only"}</dd>
        </div>
        <div>
          <dt>HTTP</dt>
          <dd>{detail.detail.status ?? detail.errorMessage ?? "Needs owner review"}</dd>
        </div>
        <div>
          <dt>Core API</dt>
          <dd>{detail.coreApiUrl}</dd>
        </div>
      </dl>
    </section>
  );
}

export function DetailSourceMarker({ label }: { label: string }) {
  return (
    <p className="muted detail-source-marker" data-detail-source={label}>
      {label}
    </p>
  );
}

export function DetailFallbackPanel({ title, message }: { title: string; message: string }) {
  return (
    <section className="panel owner-empty-state" data-owner-empty-state="Owner-safe fallback">
      <span className="eyebrow">Needs owner review</span>
      <h3>{title}</h3>
      <p className="muted">{message}</p>
      <p className="muted owner-safe-note">Safe owner fallback: only registry-safe summary copy is shown.</p>
      <p className="muted">Next step: return to the registry list and choose an available item.</p>
    </section>
  );
}

export function DetailFacts({ facts }: { facts: Array<[string, string | number | null | undefined]> }) {
  return (
    <dl className="facts">
      {facts.map(([label, value]) => (
        <div key={label}>
          <dt>{label}</dt>
          <dd>{value ?? "Needs owner review"}</dd>
        </div>
      ))}
    </dl>
  );
}

export function RelatedLinksPanel({
  title,
  description,
  links
}: {
  title: string;
  description: string;
  links: Array<{ href: string | null; label: string; detail?: string | undefined; external?: boolean }>;
}) {
  const availableLinks = links.filter((link) => link.href);

  return (
    <section>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">{description}</p>
        </div>
        <span className="pill">{availableLinks.length} link(s)</span>
      </div>
      <div className="project-grid">
        {availableLinks.length > 0 ? (
          availableLinks.map((link) => (
            <article className="project-card" key={`${link.href}-${link.label}`}>
              <span className="eyebrow">{link.external ? "Cross-product" : "PITS Shell"}</span>
              {link.external ? (
                <a href={link.href ?? "#"}>{link.label}</a>
              ) : (
                <Link href={link.href ?? "#"}>{link.label}</Link>
              )}
              {link.detail ? <p className="muted">{link.detail}</p> : null}
            </article>
          ))
        ) : (
          <article className="project-card">
            <span className="eyebrow">Missing link</span>
            <h3>No registry relationship link</h3>
            <p className="muted">This project has no related registry link in the current read-only payload.</p>
          </article>
        )}
      </div>
    </section>
  );
}

export function PlatformCountsPanel({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Platform Overview Counts</h3>
          <p className="muted">Seeded staging counts from Core API /platform/overview.</p>
        </div>
        <span className="pill">PLATFORM_KERNEL: {snapshot.platformKernelStatus}</span>
      </div>
      <div className="metrics-grid">
        {kernelFields.map((field) => (
          <Metric field={field} label={countLabels[field]} value={snapshot.counts[field]} key={field} />
        ))}
      </div>
    </section>
  );
}

export function DataBoundaryPanel() {
  return (
    <section className="panel">
      <h3>Data Access Boundary</h3>
      <p className="muted">
        UI shell reads product status through Core API only. DB-backed demo data is accessed only through the Core API.
      </p>
    </section>
  );
}

function Metric({ label, value, field }: { label: string; value: number | null; field?: KernelField }) {
  return (
    <section className="metric-tile" data-count-field={field}>
      <span>{label}</span>
      <strong>{value ?? "-"}</strong>
    </section>
  );
}
