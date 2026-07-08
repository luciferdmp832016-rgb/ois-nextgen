import Link from "next/link";
import type { ReactNode } from "react";
import {
  getOwnerForbiddenLinkIssueCount,
  getOwnerHealthLabel,
  getOwnerMissingLinkCount,
  getOwnerReviewItemsFor,
  getOwnerReviewPreviewItems,
  getOwnerReadinessLabel,
  getReadinessGaps,
  kernelFields,
  ModernProductShell,
  type KernelField,
  type OwnerActionPermission,
  type OwnerReviewItem,
  type OwnerReviewSeverity,
  type RegistryDetailSnapshot,
  type RegistryHealthItem,
  type RegistryHealthStatus,
  type RegistryReadinessItem,
  type RegistryReadinessStatus,
  type PlatformRegistrySnapshot,
  type PlatformSnapshot
} from "@ois/shared-ui";

const navItems = [
  { id: "overview", href: "/", label: "Overview", shortLabel: "Ov" },
  { id: "dashboard", href: "/dashboard", label: "Dashboard", shortLabel: "Db" },
  { id: "products", href: "/products", label: "Products", shortLabel: "Pr" },
  { id: "workspaces", href: "/workspaces", label: "Workspaces", shortLabel: "Ws" },
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

export function OisConsoleShell({
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
      navAriaLabel="OIS Console navigation"
      navItems={navItems}
      productCode="OIS_CONSOLE"
      productContext="Product Administration"
      productName="OIS Console"
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
  oisConsoleDetail: "OIS Console detail",
  pitsProjectDetail: "PITS Shell project",
  oisProduct: "OIS product",
  oisWorkspace: "OIS workspace",
  productRuntime: "Product runtime",
  pitsProject: "PITS project"
};

type OwnerLink = { href: string | null | undefined; label: string; detail?: string | undefined; external?: boolean | undefined };

function OwnerLinkList({ links }: { links: OwnerLink[] }) {
  const availableLinks = links.filter((link): link is OwnerLink & { href: string } => Boolean(link.href));

  if (availableLinks.length === 0) {
    return <p className="muted">No owner quick links are available for this registry view.</p>;
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

export function OwnerRegistryCockpit({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  const healthSummary = snapshot.registryHealthPayload?.summary;
  const readinessSummary = snapshot.registryReadinessPayload?.summary;
  const missingLinkCount = getOwnerMissingLinkCount(snapshot);
  const forbiddenIssueCount = getOwnerForbiddenLinkIssueCount(snapshot);
  const missingRuntimeUrlCount = healthSummary?.missingUrl ?? 0;
  const isReady =
    Boolean(snapshot.registryHealthPayload && snapshot.registryReadinessPayload) &&
    (readinessSummary?.blocked ?? 1) === 0 &&
    (readinessSummary?.incomplete ?? 1) === 0 &&
    (healthSummary?.degraded ?? 1) === 0 &&
    missingRuntimeUrlCount === 0 &&
    missingLinkCount === 0 &&
    forbiddenIssueCount === 0;

  const quickLinks: OwnerLink[] = [];
  const firstProduct = snapshot.products[0];
  const firstWorkspace = snapshot.workspaces[0];
  const firstModule = snapshot.modules[0];
  const firstInstallation = snapshot.installations[0];
  const firstProject = snapshot.projects[0];

  quickLinks.push(
    firstProduct
      ? { href: `/products/${firstProduct.id}`, label: "Open first product", detail: firstProduct.name }
      : { href: "/products", label: "Open products" }
  );
  quickLinks.push(
    firstWorkspace
      ? { href: `/workspaces/${firstWorkspace.id}`, label: "Open first workspace", detail: firstWorkspace.name }
      : { href: "/workspaces", label: "Open workspaces" }
  );

  if (firstModule) {
    quickLinks.push({ href: `/modules/${firstModule.id}`, label: "Open first module", detail: firstModule.code });
  }

  if (firstInstallation) {
    quickLinks.push({
      href: `/installations/${firstInstallation.id}`,
      label: "Open first installation",
      detail: firstInstallation.productCode
    });
  }

  if (firstProject) {
    quickLinks.push({
      href: snapshot.registryReadinessEntities.projects.find((project) => project.id === firstProject.id)?.links.pitsProjectDetail,
      label: "Open linked PITS project",
      detail: firstProject.name,
      external: true
    });
  }

  return (
    <section className="panel owner-cockpit" data-owner-cockpit="Owner Registry Cockpit / Registry Runtime Summary">
      <div className="panel-heading">
        <div>
          <h3>Owner Registry Cockpit / Registry Runtime Summary</h3>
          <p className="muted">Read-only browser cockpit showing what is ready, what needs owner review, what is missing and the next detail link to open.</p>
        </div>
        <StatusBadge ok={isReady} label={isReady ? "Ready to operate" : "Needs owner review"} />
      </div>
      <dl className="owner-fact-grid" aria-label="Owner registry counts">
        <div>
          <dt>Total products</dt>
          <dd>{snapshot.products.length}</dd>
        </div>
        <div>
          <dt>Total workspaces</dt>
          <dd>{snapshot.workspaces.length}</dd>
        </div>
        <div>
          <dt>Total projects</dt>
          <dd>{snapshot.projects.length}</dd>
        </div>
        <div>
          <dt>Total modules</dt>
          <dd>{snapshot.modules.length}</dd>
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
          <dt>Readiness summary</dt>
          <dd>{readinessSummary ? getOwnerReadinessLabel(readinessSummary.status) : "Incomplete"}</dd>
        </div>
        <div>
          <dt>Ready / incomplete / blocked</dt>
          <dd>{readinessSummary ? `${readinessSummary.ready} / ${readinessSummary.incomplete} / ${readinessSummary.blocked}` : "Incomplete"}</dd>
        </div>
      </dl>
      <div className="owner-guard-grid" aria-label="Owner readiness guards">
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
        <h4>Quick detail links</h4>
        <OwnerLinkList links={quickLinks} />
      </div>
    </section>
  );
}

export function RegistryCardUatSummary({
  health,
  readiness,
  linkedLabel
}: {
  health: RegistryHealthItem | null;
  readiness: RegistryReadinessItem | null;
  linkedLabel?: string | undefined;
}) {
  const pitsLink = readiness?.links.pitsProject ?? readiness?.links.pitsProjectDetail ?? health?.links.pitsProject ?? health?.links.pitsProjectDetail;

  return (
    <div className="owner-card-summary">
      <div className="badge-row">
        <StatusBadge ok={health?.status === "Healthy"} label={`Runtime health: ${getOwnerHealthLabel(health?.status)}`} />
        <StatusBadge ok={readiness?.status === "READY"} label={`Readiness: ${getOwnerReadinessLabel(readiness?.status)}`} />
      </div>
      {linkedLabel ? <p className="owner-relationship-line">{linkedLabel}</p> : null}
      <p className="muted">What is missing? {readinessGapText(readiness)}</p>
      {pitsLink ? <a className="owner-cross-link" href={pitsLink}>Linked to PITS</a> : null}
    </div>
  );
}

export function OwnerEntityUatSummary({
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
  links?: OwnerLink[] | undefined;
}) {
  return (
    <section className="panel owner-uat-summary" data-owner-uat={title}>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Owner-friendly readiness and health answer for browser UAT.</p>
        </div>
        <StatusBadge ok={ownerReadyStatus(readiness, health)} label={ownerReadyStatus(readiness, health) ? "Ready to operate" : "Needs owner review"} />
      </div>
      <dl className="facts">
        <div>
          <dt>Runtime health</dt>
          <dd>{getOwnerHealthLabel(health?.status)}</dd>
        </div>
        <div>
          <dt>Readiness</dt>
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
      {links ? (
        <div className="owner-quick-links">
          <h4>Owner UAT links</h4>
          <OwnerLinkList links={links} />
        </div>
      ) : null}
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

function OwnerReviewItemCard({ item }: { item: OwnerReviewItem }) {
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

export function OwnerReviewQueuePanel({
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
          <p className="muted">Safe Action Boundary for future owner-reviewed admin actions. Current stage is preview-only and read-only.</p>
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
      <dl className="owner-fact-grid" aria-label="Owner review summary">
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
            <OwnerReviewItemCard item={item} key={item.id} />
          ))}
        </div>
      ) : (
        <article className="owner-review-card owner-empty-state">
          <span className="eyebrow">No review needed</span>
          <h4>No review needed</h4>
          <p className="muted">No owner review item is currently derived for this registry entity.</p>
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
          <p className="muted">Owner-facing configured, linked and staging URL status from Core API /platform/registry/health.</p>
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
              <dt>OIS Console</dt>
              <dd>{payload.runtime.oisConsoleBaseUrl}</dd>
            </div>
            <div>
              <dt>PITS Shell</dt>
              <dd>{payload.runtime.pitsShellBaseUrl}</dd>
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
          <p className="muted">Configured, linked and runtime URL checks for this registry item.</p>
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
        <p className="muted">No health item is available for this registry entity. Review the registry sync before runtime closure.</p>
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
          <p className="muted">Owner-facing readiness from Core API /platform/registry/readiness.</p>
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
          <p className="muted">Readiness answers whether this registry item is ready to operate and what is missing.</p>
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
        <p className="muted">No readiness item is available for this registry entity. Review the registry sync before runtime closure.</p>
      )}
    </section>
  );
}

export function PlatformOverviewCard({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Platform Overview Counts</h3>
          <p className="muted">Seeded counts read from Core API /platform/overview.</p>
        </div>
        <StatusBadge ok={snapshot.overview.ok} label={snapshot.overview.ok ? "Overview ready" : "Needs owner review"} />
      </div>
      <CountGrid snapshot={snapshot} fields={["industries", "organizations", "workspaces", "projects"]} />
    </section>
  );
}

export function ProductModuleOverview({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Product & Module Overview</h3>
          <p className="muted">Current product catalog baseline from the shared Core API.</p>
        </div>
        <span className="pill">PLATFORM_KERNEL: {snapshot.platformKernelStatus}</span>
      </div>
      <CountGrid snapshot={snapshot} fields={["products", "installations", "modules", "auditRecords"]} />
    </section>
  );
}

export function RuntimeStatusCard({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Runtime Status</h3>
          <p className="muted">Public staging shell status through Core API only.</p>
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

export function RegistryStatusPanel({ snapshot }: { snapshot: PlatformRegistrySnapshot }) {
  return (
    <section className="panel">
      <div className="panel-heading">
        <div>
          <h3>Platform Registry Source</h3>
          <p className="muted">Read-only registry data from Core API /platform/registry.</p>
        </div>
        <StatusBadge ok={snapshot.registry.ok} label={snapshot.registry.ok ? "Registry ready" : "Needs owner review"} />
      </div>
      <dl className="facts">
        <div>
          <dt>Source</dt>
          <dd>{snapshot.registryMetadata?.source ?? "Needs owner review"}</dd>
        </div>
        <div>
          <dt>Mode</dt>
          <dd>{snapshot.registryMetadata?.mode ?? "read-only"}</dd>
        </div>
        <div>
          <dt>Environment</dt>
          <dd>{snapshot.registryMetadata?.environment ?? "staging"}</dd>
        </div>
        <div>
          <dt>HTTP</dt>
          <dd>{snapshot.registry.status ?? snapshot.registry.error ?? "Needs owner review"}</dd>
        </div>
      </dl>
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
      <div className="list-grid">
        {availableLinks.length > 0 ? (
          availableLinks.map((link) => (
            <article className="panel compact-panel" key={`${link.href}-${link.label}`}>
              <span className="eyebrow">{link.external ? "Cross-product" : "OIS Console"}</span>
              {link.external ? (
                <a href={link.href ?? "#"}>{link.label}</a>
              ) : (
                <Link href={link.href ?? "#"}>{link.label}</Link>
              )}
              {link.detail ? <p className="muted">{link.detail}</p> : null}
            </article>
          ))
        ) : (
          <article className="panel compact-panel">
            <span className="eyebrow">Missing link</span>
            <h3>No registry relationship link</h3>
            <p className="muted">This entity has no related registry link in the current read-only payload.</p>
          </article>
        )}
      </div>
    </section>
  );
}

export function CountGrid({ snapshot, fields }: { snapshot: PlatformSnapshot; fields: KernelField[] }) {
  return (
    <div className="count-grid">
      {fields.map((field) => (
        <div className="count-tile" data-count-field={field} key={field}>
          <span>{countLabels[field]}</span>
          <strong>{snapshot.counts[field] ?? "-"}</strong>
        </div>
      ))}
    </div>
  );
}
