import { getOimaSnapshot, getPlatformRegistrySnapshot, type OimaBoundaryPayload } from "@ois/shared-ui";
import { OisConsoleShell, PageHeading, StatusBadge } from "../shell";

export const dynamic = "force-dynamic";

function SourceModes({ payload }: { payload: OimaBoundaryPayload }) {
  return (
    <section className="panel" data-oima="Source Mode Contract">
      <div className="panel-heading">
        <div>
          <h3>Source Mode Contract</h3>
          <p className="muted">Transcript-first intake with optional future audio enrichment.</p>
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
          <p className="muted">Stage 2H is architecture and contract only; no live agent behavior is enabled.</p>
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
          <dd>Future only</dd>
        </div>
        <div>
          <dt>LLM calls</dt>
          <dd>Disabled</dd>
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
          <p className="muted">Meeting intelligence delivery path after the product boundary is accepted.</p>
        </div>
        <StatusBadge ok label="Boundary ready" />
      </div>
      <div className="owner-review-grid">
        {(payload.roadmap ?? []).map((item) => (
          <article className="owner-review-card" key={String(item.stage)}>
            <span className="eyebrow">{String(item.status)}</span>
            <h4>{String(item.stage)} - {String(item.title)}</h4>
            <p>{String(item.scope)}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function PlaceholderCards({ payload }: { payload: OimaBoundaryPayload }) {
  return (
    <section className="panel" data-oima="Placeholder Product Surfaces">
      <div className="panel-heading">
        <div>
          <h3>Placeholder Product Surfaces</h3>
          <p className="muted">Visible roadmap placeholders only; upload and analysis workflows are not implemented in Stage 2H.</p>
        </div>
        <StatusBadge ok label="Preview only" />
      </div>
      <div className="owner-review-grid">
        {(payload.ownedUxSurfaces ?? []).map((surface) => (
          <article className="owner-review-card" key={surface}>
            <span className="eyebrow">OIMA UX</span>
            <h4>{surface}</h4>
            <p className="muted">Boundary placeholder. No meeting data is created from this shell.</p>
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
      <PageHeading eyebrow="Powered by OIS Product" title="OIMA — Organizational Intelligence Meeting Agent">
        OIS understands the organization. OIMA understands the meeting. OIS hiểu tổ chức. OIMA hiểu cuộc họp.
      </PageHeading>
      {overview && boundary ? (
        <>
          <Boundary payload={overview} />
          <SourceModes payload={overview} />
          <SafetyBoundary payload={boundary} />
          <CoreReuse payload={overview} />
          <Roadmap payload={overview} />
          <PlaceholderCards payload={overview} />
        </>
      ) : (
        <OimaFallback message={oimaSnapshot.errorMessage} />
      )}
    </OisConsoleShell>
  );
}
