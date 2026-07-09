import {
  getKnowledgeFabricSnapshot,
  getPlatformRegistrySnapshot,
  type ArchitectureMindmapPayload,
  type KeihbBundlesPayload,
  type KnowledgeEvidencePayload,
  type KnowledgeFabricSnapshot,
  type KnowledgeItemsPayload,
  type KnowledgeLayerMappingsPayload,
  type KnowledgeLayersPayload
} from "@ois/shared-ui";
import { OisConsoleShell, PageHeading, StatusBadge } from "../shell";

export const dynamic = "force-dynamic";

function LayerOverview({ payload }: { payload: KnowledgeLayersPayload }) {
  return (
    <section className="panel" data-knowledge-fabric="Knowledge Layers Overview">
      <div className="panel-heading">
        <div>
          <h3>Knowledge Layers Overview</h3>
          <p className="muted">KL-0 to KL-5 canonical taxonomy for governed OIS context reads.</p>
        </div>
        <StatusBadge ok label="No auto-promotion" />
      </div>
      <div className="owner-review-grid">
        {payload.layers.map((layer) => (
          <article className="owner-review-card" key={layer.key}>
            <span className="eyebrow">{layer.key.replace("KL_", "KL-").replace(/_/g, " ")}</span>
            <h4>{layer.displayName}</h4>
            <p>{layer.description}</p>
            <div className="badge-row">
              <span className="pill">{layer.evidenceRequirement}</span>
              <StatusBadge ok={!layer.autoPromotionAllowedInStage2G} label="Manual review" />
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function KnowledgeItemList({ payload }: { payload: KnowledgeItemsPayload }) {
  return (
    <section className="panel" data-knowledge-fabric="Canonical Knowledge Items">
      <div className="panel-heading">
        <div>
          <h3>Canonical Knowledge Items</h3>
          <p className="muted">Safe demo records with layer, scope, evidence and provenance fields.</p>
        </div>
        <span className="pill">{payload.summary.totalItems}</span>
      </div>
      <dl className="owner-fact-grid">
        {payload.summary.byLayer.map((entry) => (
          <div key={entry.layerKey}>
            <dt>{entry.displayName}</dt>
            <dd>{entry.count}</dd>
          </div>
        ))}
      </dl>
      <div className="owner-review-grid">
        {payload.items.slice(0, 8).map((item) => (
          <article className="owner-review-card" key={item.id}>
            <span className="eyebrow">{item.layerKey}</span>
            <h4>{item.title}</h4>
            <p>{item.summary}</p>
            <div className="badge-row">
              <StatusBadge ok={item.status === "ACTIVE"} label={item.status} />
              <span className="pill">{item.itemType}</span>
              <span className="pill">{item.sourceAuthority}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EvidenceSummary({ payload }: { payload: KnowledgeEvidencePayload }) {
  return (
    <section className="panel" data-knowledge-fabric="Evidence Links">
      <div className="panel-heading">
        <div>
          <h3>Evidence Links</h3>
          <p className="muted">Evidence and provenance links for canonical items and learning candidates.</p>
        </div>
        <span className="pill">{payload.summary.totalLinks}</span>
      </div>
      <div className="owner-review-grid">
        {payload.evidenceLinks.map((evidence) => (
          <article className="owner-review-card" key={evidence.id}>
            <span className="eyebrow">{evidence.sourceType}</span>
            <h4>{evidence.sourceTitle}</h4>
            <p>{evidence.excerpt}</p>
            <div className="badge-row">
              <span className="pill">{evidence.sourceAuthority}</span>
              <span className="pill">Weight {evidence.evidenceWeight}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function LayerMappings({ payload }: { payload: KnowledgeLayerMappingsPayload }) {
  return (
    <section className="panel" data-knowledge-fabric="Learning Candidate Layer Mappings">
      <div className="panel-heading">
        <div>
          <h3>Learning Candidate to Knowledge Layer Mappings</h3>
          <p className="muted">Review-ready mapping records; mapping does not promote canonical knowledge.</p>
        </div>
        <span className="pill">{payload.mappings.length}</span>
      </div>
      <div className="owner-review-grid">
        {payload.mappings.map((mapping) => (
          <article className="owner-review-card" key={mapping.id}>
            <span className="eyebrow">{mapping.targetLayerKey}</span>
            <h4>{mapping.proposedTitle}</h4>
            <p>{mapping.proposedSummary}</p>
            <div className="badge-row">
              <StatusBadge ok={mapping.status === "READY_FOR_REVIEW"} label={mapping.status} />
              <span className="pill">{mapping.proposedAction}</span>
              <span className="pill">{mapping.targetItemType}</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function KeihbBundles({ payload }: { payload: KeihbBundlesPayload }) {
  return (
    <section className="panel" data-knowledge-fabric="KEIHB Bundles">
      <div className="panel-heading">
        <div>
          <h3>KEIHB Bundles</h3>
          <p className="muted">Publishing projections over the OIS Knowledge Fabric source of truth.</p>
        </div>
        <StatusBadge ok label="Projection only" />
      </div>
      <div className="owner-review-grid">
        {payload.bundles.map((bundle) => (
          <article className="owner-review-card" key={bundle.id}>
            <span className="eyebrow">{bundle.bundleKey}</span>
            <h4>{bundle.displayName}</h4>
            <p>
              {bundle.targetAudience} / {bundle.role} / {bundle.locale}
            </p>
            <div className="badge-row">
              <StatusBadge ok={bundle.status === "DRAFT"} label={bundle.status} />
              <span className="pill">{bundle.includedLayerKeys.length} layers</span>
              <span className="pill">{bundle.includedItemIds.length} items</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductConsumptionMap({ payload }: { payload: KnowledgeLayersPayload }) {
  return (
    <section className="panel" data-knowledge-fabric="Product Consumption Map">
      <div className="panel-heading">
        <div>
          <h3>Product Consumption Map</h3>
          <p className="muted">Which Powered by OIS products read and contribute to each knowledge layer.</p>
        </div>
        <span className="pill">{payload.productConsumptionMap.length}</span>
      </div>
      <div className="owner-review-grid">
        {payload.productConsumptionMap.map((entry) => (
          <article className="owner-review-card" key={entry.productKey}>
            <span className="eyebrow">{entry.productKey}</span>
            <h4>{entry.role}</h4>
            <p>Consumes {entry.consumesLayers.join(", ")}</p>
            <p className="muted">Contributes {entry.contributesToLayers.join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ArchitectureMap({ payload }: { payload: ArchitectureMindmapPayload }) {
  return (
    <section className="panel" data-knowledge-fabric="Architecture Mindmap">
      <div className="panel-heading">
        <div>
          <h3>Architecture Map / Mindmap</h3>
          <p className="muted">{payload.mindmap.title}</p>
        </div>
        <StatusBadge ok label={payload.mindmap.stage} />
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Core layers</dt>
          <dd>{payload.mindmap.oisCoreLayers.length}</dd>
        </div>
        <div>
          <dt>Products</dt>
          <dd>{payload.mindmap.ecosystemProducts.length}</dd>
        </div>
        <div>
          <dt>Flows</dt>
          <dd>{payload.mindmap.flows.length}</dd>
        </div>
        <div>
          <dt>API contracts</dt>
          <dd>{payload.mindmap.apiContracts.length}</dd>
        </div>
      </dl>
      <div className="owner-review-marker-row" aria-label="Knowledge governance checkpoints">
        {payload.mindmap.governanceCheckpoints.map((checkpoint) => (
          <span key={checkpoint}>{checkpoint}</span>
        ))}
      </div>
    </section>
  );
}

function KnowledgeFallback({ snapshot }: { snapshot: KnowledgeFabricSnapshot }) {
  return (
    <section className="panel owner-empty-state">
      <span className="eyebrow">Knowledge Fabric</span>
      <h3>Knowledge Fabric unavailable</h3>
      <p className="muted">{snapshot.errorMessage ?? "Core API knowledge payload needs owner review."}</p>
    </section>
  );
}

export default async function KnowledgeFabricPage() {
  const [registrySnapshot, knowledgeSnapshot] = await Promise.all([getPlatformRegistrySnapshot(), getKnowledgeFabricSnapshot()]);

  return (
    <OisConsoleShell active="knowledge-fabric" snapshot={registrySnapshot}>
      <PageHeading eyebrow="Canonical Knowledge" title="OIS Knowledge Fabric">
        KL-0 to KL-5 taxonomy, canonical items, evidence links, candidate mappings, KEIHB projections and the universal knowledge read contract.
      </PageHeading>
      {knowledgeSnapshot.layersPayload &&
      knowledgeSnapshot.itemsPayload &&
      knowledgeSnapshot.evidencePayload &&
      knowledgeSnapshot.mappingsPayload &&
      knowledgeSnapshot.keihbBundlesPayload &&
      knowledgeSnapshot.mindmapPayload ? (
        <>
          <section className="panel" data-knowledge-fabric="Universal Knowledge Read Contract">
            <div className="panel-heading">
              <div>
                <h3>Universal Knowledge Read Contract</h3>
                <p className="muted">Deterministic read path for product context, agent context and future projection bundles.</p>
              </div>
              <StatusBadge ok={Boolean(knowledgeSnapshot.contextPayload?.noCanonicalWrite)} label="Read only" />
            </div>
            <dl className="owner-fact-grid">
              <div>
                <dt>Context items</dt>
                <dd>{knowledgeSnapshot.contextPayload?.items.length ?? 0}</dd>
              </div>
              <div>
                <dt>Evidence links</dt>
                <dd>{knowledgeSnapshot.contextPayload?.evidenceLinks.length ?? 0}</dd>
              </div>
              <div>
                <dt>No LLM call</dt>
                <dd>{knowledgeSnapshot.contextPayload?.noLlmCall ? "true" : "needs review"}</dd>
              </div>
              <div>
                <dt>No canonical write</dt>
                <dd>{knowledgeSnapshot.contextPayload?.noCanonicalWrite ? "true" : "needs review"}</dd>
              </div>
            </dl>
          </section>
          <LayerOverview payload={knowledgeSnapshot.layersPayload} />
          <KnowledgeItemList payload={knowledgeSnapshot.itemsPayload} />
          <EvidenceSummary payload={knowledgeSnapshot.evidencePayload} />
          <LayerMappings payload={knowledgeSnapshot.mappingsPayload} />
          <KeihbBundles payload={knowledgeSnapshot.keihbBundlesPayload} />
          <ProductConsumptionMap payload={knowledgeSnapshot.layersPayload} />
          <ArchitectureMap payload={knowledgeSnapshot.mindmapPayload} />
        </>
      ) : (
        <KnowledgeFallback snapshot={knowledgeSnapshot} />
      )}
    </OisConsoleShell>
  );
}
