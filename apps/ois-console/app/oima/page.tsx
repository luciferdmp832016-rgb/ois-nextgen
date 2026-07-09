import Link from "next/link";
import { getOimaSnapshot, getPlatformRegistrySnapshot, type OimaBoundaryPayload } from "@ois/shared-ui";
import { OisConsoleShell, PageHeading, StatusBadge } from "../shell";

export const dynamic = "force-dynamic";

type OimaSurface = NonNullable<OimaBoundaryPayload["emptyStateSurfaces"]>[number];

function fallbackSurface(surface: string): OimaSurface {
  return {
    surfaceCode: surface.toUpperCase().replaceAll(" ", "_"),
    title: surface,
    availability: "PLANNED",
    availableNow: false,
    runtimeEnabled: false,
    stage: "Future",
    statusLabel: "Planned for later OIMA stages",
    description: "Boundary placeholder. No meeting data is created from this shell."
  };
}

function ProductOverview({ payload }: { payload: OimaBoundaryPayload }) {
  const currentCapabilities = payload.currentRuntimeCapabilities.length > 0 ? payload.currentRuntimeCapabilities : ["OVERVIEW", "PRODUCT_BOUNDARY"];
  const plannedCapabilities =
    payload.plannedRuntimeCapabilities.length > 0
      ? payload.plannedRuntimeCapabilities
      : ["TRANSCRIPT_PROCESSING", "AUDIO_PROCESSING", "LISTENER_MODE"];
  const nextStage = String(payload.productShell?.nextRecommendedStage ?? "OIMA-2 Transcript Processing");

  return (
    <section className="panel" data-oima="OIMA Product Overview">
      <div className="panel-heading">
        <div>
          <h3>OIMA Product Overview</h3>
          <p className="muted">OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS.</p>
          <p className="muted">{payload.displayName}</p>
          <p className="muted">{payload.tagline}</p>
          <p className="muted">{payload.vietnamesePositioning}</p>
        </div>
        <StatusBadge ok label="OIMA-1 intake ready" />
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Product code</dt>
          <dd>{payload.productCode}</dd>
        </div>
        <div>
          <dt>Product name</dt>
          <dd>{payload.productName}</dd>
        </div>
        <div>
          <dt>Powered by</dt>
          <dd>{payload.poweredBy}</dd>
        </div>
        <div>
          <dt>Primary input</dt>
          <dd>Transcript first</dd>
        </div>
        <div>
          <dt>Audio input</dt>
          <dd>Optional metadata registration</dd>
        </div>
        <div>
          <dt>Next stage</dt>
          <dd>{nextStage}</dd>
        </div>
      </dl>
      <div className="owner-review-marker-row" aria-label="OIMA current runtime capabilities">
        {currentCapabilities.map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>
      <div className="owner-review-marker-row" aria-label="OIMA planned runtime capabilities">
        {plannedCapabilities.map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>
      <Link className="button oima-inline-action" href="/oima/meetings">
        Open Meeting Library
      </Link>
    </section>
  );
}

function SourceModes({ payload }: { payload: OimaBoundaryPayload }) {
  return (
    <section className="panel" data-oima="Source Mode Contract">
      <div className="panel-heading">
        <div>
          <h3>Source Mode Contract</h3>
          <p className="muted">Transcript-first intake with optional audio metadata registration.</p>
        </div>
        <StatusBadge ok label="TRANSCRIPT_ONLY primary" />
      </div>
      <div className="owner-review-grid">
        {(payload.sourceModeContracts ?? []).map((mode) => (
          <article className="owner-review-card" key={String(mode.mode)}>
            <span className="eyebrow">{String(mode.status)}</span>
            <h4>{String(mode.mode)}</h4>
            <p>{String(mode.description)}</p>
            <div className="badge-row">
              <StatusBadge ok={Boolean(mode.primary) || mode.mode !== "LISTENER_CAPTURED"} label={Boolean(mode.primary) ? "Primary" : "Future"} />
              <span className="pill">audioRequired={String(mode.audioRequired)}</span>
              <span className="pill">listenerMode={String(mode.listenerMode)}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Boundary({ payload }: { payload: OimaBoundaryPayload }) {
  return (
    <section className="panel" data-oima="Product Boundary">
      <div className="panel-heading">
        <div>
          <h3>Product Boundary</h3>
          <p className="muted">OIMA owns meeting UX while OIS remains the organizational intelligence backbone.</p>
        </div>
        <StatusBadge ok label={payload.implementationStatus} />
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Product key</dt>
          <dd>{payload.productKey}</dd>
        </div>
        <div>
          <dt>Product code</dt>
          <dd>{payload.productCode}</dd>
        </div>
        <div>
          <dt>Product name</dt>
          <dd>{payload.productName}</dd>
        </div>
        <div>
          <dt>Product type</dt>
          <dd>{payload.productType}</dd>
        </div>
        <div>
          <dt>Powered by</dt>
          <dd>{payload.poweredBy}</dd>
        </div>
        <div>
          <dt>Knowledge source</dt>
          <dd>OIS Knowledge Fabric</dd>
        </div>
      </dl>
      <div className="owner-review-marker-row" aria-label="OIMA capability codes">
        {payload.capabilityCodes.map((capability) => (
          <span key={capability}>{capability}</span>
        ))}
      </div>
    </section>
  );
}

function SafetyBoundary({ payload }: { payload: OimaBoundaryPayload }) {
  return (
    <section className="panel" data-oima="Safety Boundary">
      <div className="panel-heading">
        <div>
          <h3>Safety Boundary</h3>
          <p className="muted">OIMA-1 enables meeting intake metadata only; no live agent behavior is enabled.</p>
        </div>
        <StatusBadge ok={payload.noCanonicalKnowledgeWrite !== false} label="No canonical write" />
      </div>
      <div className="owner-review-marker-row" aria-label="OIMA safety boundaries">
        {payload.safetyBoundaries.map((boundary) => (
          <span key={boundary}>{boundary}</span>
        ))}
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Auto-promotion</dt>
          <dd>{payload.autoPromotionEnabled ? "enabled" : "false"}</dd>
        </div>
        <div>
          <dt>Widget direct write</dt>
          <dd>{payload.oisAgentWidgetDirectCanonicalWriteAllowed ? "enabled" : "false"}</dd>
        </div>
        <div>
          <dt>Listener Mode</dt>
          <dd>Future permissioned recording only</dd>
        </div>
        <div>
          <dt>LLM calls</dt>
          <dd>Disabled</dd>
        </div>
        <div>
          <dt>Voice clone</dt>
          <dd>Out of scope</dd>
        </div>
        <div>
          <dt>Live speaking</dt>
          <dd>Out of scope</dd>
        </div>
      </dl>
    </section>
  );
}

function CoreReuse({ payload }: { payload: OimaBoundaryPayload }) {
  const entries = Object.entries(payload.coreReuseMap ?? {});

  return (
    <section className="panel" data-oima="OIS Core Reuse Map">
      <div className="panel-heading">
        <div>
          <h3>OIS Core Reuse Map</h3>
          <p className="muted">OIMA is a product on top of OIS, not a separate data silo.</p>
        </div>
        <StatusBadge ok label="Powered by OIS" />
      </div>
      <div className="owner-review-grid">
        {entries.map(([key, value]) => (
          <article className="owner-review-card" key={key}>
            <span className="eyebrow">{key}</span>
            <h4>{value}</h4>
          </article>
        ))}
      </div>
    </section>
  );
}

function Roadmap({ payload }: { payload: OimaBoundaryPayload }) {
  return (
    <section className="panel" data-oima="OIMA Roadmap">
      <div className="panel-heading">
        <div>
          <h3>OIMA Roadmap</h3>
          <p className="muted">Meeting intelligence delivery path after the intake foundation is accepted.</p>
        </div>
        <StatusBadge ok label="Boundary ready" />
      </div>
      <div className="owner-review-grid">
        {(payload.roadmap ?? []).map((item) => (
          <article className="owner-review-card" key={String(item.stage)}>
            <span className="eyebrow">{String(item.status)}</span>
            <h4>
              {String(item.stage)} - {String(item.title)}
            </h4>
            <p>{String(item.scope)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function EmptyStateCards({ payload }: { payload: OimaBoundaryPayload }) {
  const surfaces =
    payload.emptyStateSurfaces && payload.emptyStateSurfaces.length > 0
      ? payload.emptyStateSurfaces
      : (payload.ownedUxSurfaces ?? []).map(fallbackSurface);

  return (
    <section className="panel" data-oima="Placeholder Product Surfaces">
      <div className="panel-heading">
        <div>
          <h3>OIMA Product Surface Empty States</h3>
          <p className="muted">
            Meeting Library and Upload Meeting are available now. Transcript processing, audio processing, analysis and Listener Mode remain planned/not-runtime.
          </p>
        </div>
        <StatusBadge ok label="Placeholder Product Surfaces" />
      </div>
      <div className="owner-review-grid">
        {surfaces.map((surface) => (
          <article className="owner-review-card" key={surface.surfaceCode}>
            <div className="panel-heading">
              <div>
                <span className="eyebrow">{surface.stage}</span>
                <h4>{surface.title}</h4>
              </div>
              <StatusBadge ok={surface.availableNow} label={surface.availableNow ? "Available now" : "Planned / not runtime"} />
            </div>
            <p className="muted">{surface.description}</p>
            <dl className="facts action-boundary-facts">
              <div>
                <dt>Availability</dt>
                <dd>{surface.statusLabel}</dd>
              </div>
              <div>
                <dt>Runtime enabled</dt>
                <dd>{String(surface.runtimeEnabled)}</dd>
              </div>
              <div>
                <dt>Meeting data</dt>
                <dd>No fake meeting data</dd>
              </div>
            </dl>
          </article>
        ))}
      </div>
    </section>
  );
}

function OimaFallback({ message }: { message: string | null }) {
  return (
    <section className="panel owner-empty-state">
      <span className="eyebrow">OIMA</span>
      <h3>OIMA boundary unavailable</h3>
      <p className="muted">{message ?? "Core API OIMA boundary payload needs owner review."}</p>
    </section>
  );
}

export default async function OimaPage() {
  const [registrySnapshot, oimaSnapshot] = await Promise.all([getPlatformRegistrySnapshot(), getOimaSnapshot()]);
  const overview = oimaSnapshot.overviewPayload;
  const boundary = oimaSnapshot.boundaryPayload;

  return (
    <OisConsoleShell active="oima" snapshot={registrySnapshot}>
      <PageHeading eyebrow="Powered by OIS Product" title="OIMA - Organizational Intelligence Meeting Agent">
        OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS. Transcript is primary; audio is optional.
      </PageHeading>
      {overview && boundary ? (
        <>
          <ProductOverview payload={overview} />
          <Boundary payload={overview} />
          <SourceModes payload={overview} />
          <SafetyBoundary payload={boundary} />
          <CoreReuse payload={overview} />
          <Roadmap payload={overview} />
          <EmptyStateCards payload={overview} />
        </>
      ) : (
        <OimaFallback message={oimaSnapshot.errorMessage} />
      )}
    </OisConsoleShell>
  );
}
