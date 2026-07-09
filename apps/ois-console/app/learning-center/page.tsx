import {
  getKnowledgeFabricSnapshot,
  getLearningCenterSnapshot,
  getPlatformRegistrySnapshot,
  type KnowledgeFabricSnapshot,
  type LearningCenterPayload
} from "@ois/shared-ui";
import { OisConsoleShell, PageHeading, StatusBadge } from "../shell";

export const dynamic = "force-dynamic";

function LearningOverview({ payload }: { payload: LearningCenterPayload }) {
  return (
    <section className="panel learning-center-panel" data-learning-center="Learning Overview">
      <div className="panel-heading">
        <div>
          <h3>Learning Overview</h3>
          <p className="muted">SuperAdmin governed learning intake summary.</p>
        </div>
        <StatusBadge ok label="SuperAdmin preview" />
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Total signals</dt>
          <dd>{payload.overview.totalSignals}</dd>
        </div>
        <div>
          <dt>Pending candidates</dt>
          <dd>{payload.overview.pendingCandidates}</dd>
        </div>
        <div>
          <dt>Auto-learned logs</dt>
          <dd>{payload.overview.autoLearnedLogs}</dd>
        </div>
        <div>
          <dt>Rejected / ignored</dt>
          <dd>{payload.overview.rejectedOrIgnored}</dd>
        </div>
      </dl>
    </section>
  );
}

function LearningStream({ payload }: { payload: LearningCenterPayload }) {
  return (
    <section className="panel" data-learning-center="Learning Stream">
      <div className="panel-heading">
        <div>
          <h3>Learning Stream</h3>
          <p className="muted">Recent Learning Signals.</p>
        </div>
        <span className="pill">{payload.learningStream.length}</span>
      </div>
      <div className="owner-review-grid">
        {payload.learningStream.length > 0 ? (
          payload.learningStream.slice(0, 6).map((signal) => (
            <article className="owner-review-card" key={signal.id}>
              <span className="eyebrow">{signal.productKey}</span>
              <h4>{signal.signalType}</h4>
              <p>{signal.normalizedText}</p>
              <div className="badge-row">
                <StatusBadge ok={signal.status === "RECEIVED" || signal.status === "CANDIDATE_CREATED"} label={signal.status} />
                <span className="pill">{signal.sourceAuthority}</span>
              </div>
            </article>
          ))
        ) : (
          <article className="owner-review-card owner-empty-state">
            <span className="eyebrow">Learning Signal</span>
            <h4>No signals received yet</h4>
            <p className="muted">The OIS Agent Widget writes future input here first.</p>
          </article>
        )}
      </div>
    </section>
  );
}

function CandidateList({ title, candidates }: { title: string; candidates: LearningCenterPayload["pendingReview"] }) {
  return (
    <section className="panel" data-learning-center={title}>
      <div className="panel-heading">
        <div>
          <h3>{title}</h3>
          <p className="muted">Learning Candidates awaiting governed decision or executive review.</p>
        </div>
        <span className="pill">{candidates.length}</span>
      </div>
      <div className="owner-review-grid">
        {candidates.length > 0 ? (
          candidates.slice(0, 6).map((candidate) => (
            <article className="owner-review-card" key={candidate.id}>
              <span className="eyebrow">{candidate.candidateType}</span>
              <h4>{candidate.title}</h4>
              <p>{candidate.summary}</p>
              <div className="badge-row">
                <StatusBadge ok={candidate.status === "AUTO_LEARNED"} label={candidate.status} />
                <span className="pill">{candidate.policyDecision}</span>
                <span className="pill">Confidence {candidate.confidenceScore}</span>
              </div>
            </article>
          ))
        ) : (
          <article className="owner-review-card owner-empty-state">
            <span className="eyebrow">Learning Candidate</span>
            <h4>No candidates in this queue</h4>
            <p className="muted">Candidates are created from signals before any future promotion path.</p>
          </article>
        )}
      </div>
    </section>
  );
}

function LearningPolicies({ payload }: { payload: LearningCenterPayload }) {
  return (
    <section className="panel" data-learning-center="Learning Policies">
      <div className="panel-heading">
        <div>
          <h3>Learning Policies</h3>
          <p className="muted">Policy mode and confidence threshold by product, scope, signal and source authority.</p>
        </div>
        <span className="pill">{payload.learningPolicies.length}</span>
      </div>
      <div className="list-grid">
        {payload.learningPolicies.map((policy) => (
          <article className="panel compact-panel" key={policy.id}>
            <span className="eyebrow">{policy.productKey}</span>
            <h3>{policy.policyMode}</h3>
            <p className="muted">
              {policy.learningScope} / {policy.signalType} / {policy.sourceAuthority}
            </p>
            <p>Threshold {policy.confidenceThreshold}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProductContributionMap({ payload }: { payload: LearningCenterPayload }) {
  return (
    <section className="panel" data-learning-center="Product Contribution Map">
      <div className="panel-heading">
        <div>
          <h3>Product Contribution Map</h3>
          <p className="muted">Signal and candidate counts by Powered by OIS product key.</p>
        </div>
        <span className="pill">{payload.productContributionMap.length}</span>
      </div>
      <dl className="owner-fact-grid">
        {payload.productContributionMap.map((entry) => (
          <div key={entry.productKey}>
            <dt>{entry.productKey}</dt>
            <dd>
              {entry.signalCount} / {entry.candidateCount}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

function KnowledgeFabricIntegration({ snapshot }: { snapshot: KnowledgeFabricSnapshot }) {
  const mappings = snapshot.mappingsPayload?.mappings ?? [];
  const bundles = snapshot.keihbBundlesPayload?.bundles ?? [];
  const firstMapping = mappings[0];

  return (
    <section className="panel" data-learning-center="Knowledge Fabric Integration">
      <div className="panel-heading">
        <div>
          <h3>Knowledge Fabric Integration</h3>
          <p className="muted">Stage 2G maps Learning Candidates toward knowledge layers while keeping promotion disabled.</p>
        </div>
        <StatusBadge ok={Boolean(snapshot.layersPayload)} label="Stage 2G read path" />
      </div>
      <dl className="owner-fact-grid">
        <div>
          <dt>Layer mappings</dt>
          <dd>{mappings.length}</dd>
        </div>
        <div>
          <dt>Target Knowledge Layer</dt>
          <dd>{firstMapping?.targetLayerKey ?? "Needs review"}</dd>
        </div>
        <div>
          <dt>KEIHB bundles</dt>
          <dd>{bundles.length}</dd>
        </div>
        <div>
          <dt>Promotion mode</dt>
          <dd>No auto-promotion</dd>
        </div>
      </dl>
      <p className="muted">KEIHB impact is projection-only: handbook, SOP, playbook and FAQ bundles read from OIS Knowledge Fabric.</p>
    </section>
  );
}

export default async function LearningCenterPage() {
  const [registrySnapshot, learningSnapshot, knowledgeSnapshot] = await Promise.all([
    getPlatformRegistrySnapshot(),
    getLearningCenterSnapshot(),
    getKnowledgeFabricSnapshot()
  ]);
  const payload = learningSnapshot.payload;

  return (
    <OisConsoleShell active="learning-center" snapshot={registrySnapshot}>
      <PageHeading eyebrow="SuperAdmin" title="OIS Learning Center">
        Governed OIS Self-Improvement Engine foundation for signals, candidates, policies and executive intent.
      </PageHeading>
      {payload ? (
        <>
          <section className="panel learning-access-guard" data-learning-center="SuperAdmin Guard">
            <div className="panel-heading">
              <div>
                <h3>SuperAdmin Access Guard</h3>
                <p className="muted">{payload.accessGuard.limitation}</p>
              </div>
              <StatusBadge ok label={payload.accessGuard.requiredRole} />
            </div>
          </section>
          <LearningOverview payload={payload} />
          <LearningStream payload={payload} />
          <CandidateList candidates={payload.pendingReview} title="Pending Review" />
          <LearningPolicies payload={payload} />
          <CandidateList candidates={payload.executiveIntentQueue} title="Executive Intent Queue" />
          <KnowledgeFabricIntegration snapshot={knowledgeSnapshot} />
          <ProductContributionMap payload={payload} />
          <section className="panel" data-learning-center="Audit Log placeholder">
            <div className="panel-heading">
              <div>
                <h3>Audit Log Placeholder</h3>
                <p className="muted">{payload.auditLogPlaceholder.note}</p>
              </div>
              <span className="pill">{payload.auditLogPlaceholder.mode}</span>
            </div>
          </section>
        </>
      ) : (
        <section className="panel owner-empty-state">
          <span className="eyebrow">Learning Center</span>
          <h3>Learning Center unavailable</h3>
          <p className="muted">{learningSnapshot.errorMessage ?? "Core API learning payload needs owner review."}</p>
        </section>
      )}
    </OisConsoleShell>
  );
}
