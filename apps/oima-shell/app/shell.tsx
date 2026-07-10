import Link from "next/link";
import type { ReactNode } from "react";
import {
  buildOimaAppUrl,
  kernelFields,
  LocalizedText,
  ModernProductShell,
  type KernelField,
  type OimaBoundaryPayload,
  type PlatformSnapshot
} from "@ois/shared-ui";

const navItems = [
  { id: "overview", href: "/", label: "Overview", shortLabel: "Ov" },
  { id: "meetings", href: "/meetings", label: "Meetings", shortLabel: "Mt" },
  { id: "new-meeting", href: "/meetings/new", label: "Upload", shortLabel: "Up" },
  { id: "analysis", href: "/analysis", label: "Analysis", shortLabel: "An" },
  { id: "clarification", href: "/clarification", label: "Clarification", shortLabel: "Cl" },
  { id: "dashboard", href: "/dashboard", label: "Dashboard", shortLabel: "Db" },
  { id: "self-improvement", href: "/self-improvement", label: "Improvement", shortLabel: "Si" },
  { id: "listener", href: "/listener", label: "Listener", shortLabel: "Li" }
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

function L({ text }: { text: string }) {
  return <LocalizedText text={text} />;
}

export function OimaShell({ active, snapshot, children }: { active: string; snapshot: PlatformSnapshot; children: ReactNode }) {
  const healthOk = snapshot.health.ok && snapshot.healthStatus === "ok";

  return (
    <ModernProductShell
      active={active}
      coreApiUrl={snapshot.coreApiUrl}
      demoBanner={snapshot.overviewBanner}
      healthLabel={healthOk ? "Core API healthy" : "Needs owner review"}
      healthOk={healthOk}
      navAriaLabel="OIMA navigation"
      navItems={navItems}
      productCode="OIMA_APP_SHELL"
      productContext="Product Runtime"
      productName="OIMA"
    >
      {children}
    </ModernProductShell>
  );
}

export function PageHeading({ title, eyebrow, children }: { title: string; eyebrow: string; children?: ReactNode }) {
  return (
    <section
      className="page-heading"
      data-oima-stage="STAGE_2L_STANDALONE_OIMA_APP_SHELL"
      data-owner-design-system="Owner-first Design System"
      data-visual-hierarchy="Visual Hierarchy Standard"
    >
      <span className="eyebrow">
        <L text={eyebrow} />
      </span>
      <h2>
        <L text={title} />
      </h2>
      {children ? <p>{typeof children === "string" ? <L text={children} /> : children}</p> : null}
      <div className="owner-page-cues" aria-label="OIMA runtime cues">
        <span>Standalone OIMA App Shell</span>
        <span>OIMA_STANDALONE_APP_SHELL</span>
        <span>Powered by OIS</span>
        <span>Transcript-first</span>
        <span>No LLM/OpenRouter calls</span>
      </div>
    </section>
  );
}

function ownerStatusTone(ok: boolean, label: string) {
  const normalized = label.toLowerCase();

  if (normalized.includes("blocked")) {
    return "status-critical";
  }

  if (normalized.includes("planned") || normalized.includes("not runtime")) {
    return "status-neutral";
  }

  if (ok || normalized.includes("ready") || normalized.includes("available") || normalized.includes("healthy")) {
    return "status-ok";
  }

  return "status-warn";
}

export function StatusBadge({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span className={`status ${ownerStatusTone(ok, label)}`} data-owner-status="Owner-friendly Status Badges">
      <L text={label} />
    </span>
  );
}

export function DetailSourceMarker({ label }: { label: string }) {
  return (
    <p className="muted detail-source-marker" data-detail-source={label}>
      {label}
    </p>
  );
}

export function PlatformCountsPanel({ snapshot }: { snapshot: PlatformSnapshot }) {
  return (
    <section className="panel" data-oima="Platform Overview Counts">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Core API</span>
          <h3>Platform Overview Counts</h3>
          <p className="muted">Seeded counts are read through Core API only. OIMA Shell does not import Prisma or own platform registry data.</p>
        </div>
        <StatusBadge ok={snapshot.overview.ok} label={snapshot.overview.ok ? "Overview ready" : "Needs owner review"} />
      </div>
      <div className="metrics-grid" aria-label="OIMA platform overview counts">
        {kernelFields.map((field) => (
          <section className="metric-tile" data-count-field={field} key={field}>
            <span>{field}</span>
            <strong>{snapshot.counts[field] ?? "-"}</strong>
            <p className="muted">{countLabels[field]}</p>
          </section>
        ))}
      </div>
    </section>
  );
}

export function OimaRuntimeBoundaryPanel({ snapshot }: { snapshot: PlatformSnapshot }) {
  const appUrl = buildOimaAppUrl("/");

  return (
    <section className="panel" data-oima="Standalone OIMA Runtime Boundary">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Stage 2L / OIMA-A0</span>
          <h3>Standalone OIMA App Shell</h3>
          <p className="muted">OIMA is a distinct product runtime powered by OIS. Core API remains the shared source for meeting intake and transcript processing.</p>
        </div>
        <StatusBadge ok label="OIMA_DOMAIN_READY" />
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Product code</dt>
          <dd>OIMA</dd>
        </div>
        <div>
          <dt>Service name</dt>
          <dd>ois-nextgen-oima-staging</dd>
        </div>
        <div>
          <dt>Local port</dt>
          <dd>3002</dd>
        </div>
        <div>
          <dt>Public domain</dt>
          <dd>{appUrl}</dd>
        </div>
        <div>
          <dt>Core API source</dt>
          <dd>{snapshot.coreApiUrl}</dd>
        </div>
        <div>
          <dt>Boundary</dt>
          <dd>No separate OIMA data silo</dd>
        </div>
      </dl>
      <div className="owner-review-marker-row" aria-label="OIMA standalone runtime markers">
        <span>OIMA_APP_SHELL</span>
        <span>OIMA_STANDALONE_APP_SHELL</span>
        <span>STAGE_2L_STANDALONE_OIMA_APP_SHELL</span>
        <span>oima.dmp247.com</span>
        <span>Core API source:</span>
      </div>
    </section>
  );
}

export function OimaContractPanel({ payload }: { payload: OimaBoundaryPayload | null }) {
  const currentCapabilities = payload?.currentRuntimeCapabilities ?? ["OVERVIEW", "PRODUCT_BOUNDARY", "KNOWLEDGE_API_LINKAGE"];
  const plannedCapabilities = payload?.plannedRuntimeCapabilities ?? ["OFFLINE_AGENT_ANALYSIS", "SUBJECT_CLARIFICATION", "LISTENER_MODE"];

  return (
    <section className="panel" data-oima="OIMA Product Boundary Contract">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Product Boundary</span>
          <h3>OIMA - Organizational Intelligence Meeting Agent</h3>
          <p className="muted">OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS.</p>
        </div>
        <StatusBadge ok label="Powered by OIS Product" />
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Product code</dt>
          <dd>{payload?.productCode ?? "OIMA"}</dd>
        </div>
        <div>
          <dt>Product name</dt>
          <dd>{payload?.productName ?? "Organizational Intelligence Meeting Agent"}</dd>
        </div>
        <div>
          <dt>Powered by</dt>
          <dd>{payload?.poweredBy ?? "OIS"}</dd>
        </div>
        <div>
          <dt>Primary input</dt>
          <dd>TRANSCRIPT_ONLY</dd>
        </div>
      </dl>
      <div className="owner-review-marker-row" aria-label="OIMA current capabilities">
        {currentCapabilities.map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>
      <div className="owner-review-marker-row" aria-label="OIMA planned capabilities">
        {plannedCapabilities.map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>
    </section>
  );
}

export function SurfaceStatusGrid({ payload }: { payload: OimaBoundaryPayload | null }) {
  const surfaces = payload?.emptyStateSurfaces ?? [
    {
      surfaceCode: "MEETING_LIBRARY",
      title: "Meeting Library",
      stage: "OIMA-1",
      statusLabel: "Available now",
      availableNow: true,
      runtimeEnabled: true,
      description: "Workspace-scoped meeting library."
    },
    {
      surfaceCode: "UPLOAD_MEETING",
      title: "Upload Meeting",
      stage: "OIMA-1",
      statusLabel: "Available now",
      availableNow: true,
      runtimeEnabled: true,
      description: "Transcript-first registration."
    },
    {
      surfaceCode: "TRANSCRIPT_PROCESSING",
      title: "Transcript Processing",
      stage: "OIMA-2",
      statusLabel: "Available now",
      availableNow: true,
      runtimeEnabled: true,
      description: "Deterministic transcript processing."
    },
    {
      surfaceCode: "AGENT_ANALYSIS",
      title: "Agent Analysis",
      stage: "OIMA-3",
      statusLabel: "Planned / not runtime",
      availableNow: false,
      runtimeEnabled: false,
      description: "Future offline analysis."
    },
    {
      surfaceCode: "CLARIFICATION_REVIEW",
      title: "Clarification Review",
      stage: "OIMA-4",
      statusLabel: "Planned / not runtime",
      availableNow: false,
      runtimeEnabled: false,
      description: "Future subject review."
    },
    {
      surfaceCode: "DASHBOARD",
      title: "Dashboard",
      stage: "OIMA-5",
      statusLabel: "Planned / not runtime",
      availableNow: false,
      runtimeEnabled: false,
      description: "Future dashboard."
    },
    {
      surfaceCode: "SELF_IMPROVEMENT_CENTER",
      title: "Self-Improvement Center",
      stage: "OIMA-6",
      statusLabel: "Planned / not runtime",
      availableNow: false,
      runtimeEnabled: false,
      description: "Future reviewed learning loop."
    },
    {
      surfaceCode: "LISTENER_MODE",
      title: "Listener Mode",
      stage: "OIMA-9",
      statusLabel: "Planned / not runtime",
      availableNow: false,
      runtimeEnabled: false,
      description: "Future permissioned recording only."
    }
  ];

  return (
    <section className="panel" data-oima="OIMA Product Surface Empty States">
      <div className="panel-heading">
        <div>
          <span className="eyebrow">Product Surfaces</span>
          <h3>OIMA Product Surface Empty States</h3>
          <p className="muted">Available runtime surfaces are real. Planned surfaces stay visible without fake meeting data.</p>
        </div>
        <StatusBadge ok label="No fake meeting data" />
      </div>
      <div className="oima-surface-grid">
        {surfaces.map((surface) => (
          <article className={`oima-surface-card ${surface.availableNow ? "" : "oima-planned"}`} key={surface.surfaceCode}>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">{surface.stage}</span>
                <h4>{surface.title}</h4>
              </div>
              <StatusBadge ok={surface.availableNow} label={surface.availableNow ? "Available now" : "Planned / not runtime"} />
            </div>
            <p className="muted">{surface.description}</p>
            <dl className="facts">
              <div>
                <dt>Availability</dt>
                <dd>{surface.statusLabel}</dd>
              </div>
              <div>
                <dt>Runtime enabled</dt>
                <dd>{String(surface.runtimeEnabled)}</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

export function PlannedSurfacePage({
  active,
  snapshot,
  title,
  stage,
  capability
}: {
  active: string;
  snapshot: PlatformSnapshot;
  title: string;
  stage: string;
  capability: string;
}) {
  return (
    <OimaShell active={active} snapshot={snapshot}>
      <PageHeading eyebrow="OIMA planned surface" title={title}>
        This OIMA surface is planned for a later stage. It is visible for navigation and boundary clarity only.
      </PageHeading>
      <section className="panel owner-empty-state" data-oima="Planned / not runtime">
        <div className="panel-heading">
          <div>
            <span className="eyebrow">{stage}</span>
            <h3>{capability}</h3>
            <p className="muted">No meeting analysis, fake analytics, listener runtime, voice clone or LLM/OpenRouter call is enabled here.</p>
          </div>
          <StatusBadge ok={false} label="Planned / not runtime" />
        </div>
        <div className="owner-review-marker-row" aria-label="OIMA planned surface markers">
          <span>No fake meeting data</span>
          <span>No LLM/OpenRouter calls</span>
          <span>No voice clone</span>
          <span>Listener Mode planned/not-runtime</span>
        </div>
        <Link className="oima-secondary-link" href="/meetings">
          Back to Meeting Library
        </Link>
      </section>
      <PlatformCountsPanel snapshot={snapshot} />
    </OimaShell>
  );
}
