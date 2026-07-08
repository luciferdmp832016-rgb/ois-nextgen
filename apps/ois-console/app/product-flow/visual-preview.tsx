"use client";

import { useLocalization, type TranslationKey } from "@ois/shared-ui";

type FlowScreen = {
  id: string;
  stableTitle: string;
  titleKey: TranslationKey;
  purposeKey: TranslationKey;
  userKey: TranslationKey;
  actionKey: TranslationKey;
  statusKeys: TranslationKey[];
  classificationKey: TranslationKey;
  sections: Array<{ key: TranslationKey; stable: string }>;
};

const oisScreens: FlowScreen[] = [
  {
    id: "executive-dashboard",
    stableTitle: "Executive Dashboard",
    titleKey: "flow.ois.executiveDashboard.title",
    purposeKey: "flow.ois.executiveDashboard.purpose",
    userKey: "flow.ois.executiveDashboard.user",
    actionKey: "flow.ois.executiveDashboard.action",
    statusKeys: ["common.previewOnly", "common.future"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.dashboard", stable: "Dashboard" },
      { key: "common.status", stable: "Status" },
      { key: "common.nextAction", stable: "Next action" },
      { key: "flow.ois.askCopilot.title", stable: "Ask OIS / Copilot" }
    ]
  },
  {
    id: "workspace-list",
    stableTitle: "Workspace List",
    titleKey: "flow.ois.workspaceList.title",
    purposeKey: "flow.ois.workspaceList.purpose",
    userKey: "flow.ois.workspaceList.user",
    actionKey: "flow.ois.workspaceList.action",
    statusKeys: ["common.previewOnly", "common.future"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.workspaces", stable: "Workspaces" },
      { key: "common.status", stable: "Status" },
      { key: "common.owner", stable: "Owner" },
      { key: "common.nextAction", stable: "Next action" }
    ]
  },
  {
    id: "workspace-intelligence",
    stableTitle: "Workspace Intelligence Dashboard",
    titleKey: "flow.ois.workspaceIntelligence.title",
    purposeKey: "flow.ois.workspaceIntelligence.purpose",
    userKey: "flow.ois.workspaceIntelligence.user",
    actionKey: "flow.ois.workspaceIntelligence.action",
    statusKeys: ["common.previewOnly", "common.future"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.dashboard", stable: "Dashboard" },
      { key: "common.priority", stable: "Priority" },
      { key: "common.owner", stable: "Owner" },
      { key: "common.dueDate", stable: "Due date" }
    ]
  },
  {
    id: "knowledge-feed",
    stableTitle: "Meeting/Document Knowledge Feed",
    titleKey: "flow.ois.knowledgeFeed.title",
    purposeKey: "flow.ois.knowledgeFeed.purpose",
    userKey: "flow.ois.knowledgeFeed.user",
    actionKey: "flow.ois.knowledgeFeed.action",
    statusKeys: ["common.previewOnly", "common.future"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "flow.ois.knowledgeFeed.title", stable: "Meeting/Document Knowledge Feed" },
      { key: "common.status", stable: "Status" },
      { key: "common.owner", stable: "Owner" },
      { key: "common.nextAction", stable: "Next action" }
    ]
  },
  {
    id: "knowledge-detail",
    stableTitle: "Knowledge Detail",
    titleKey: "flow.ois.knowledgeDetail.title",
    purposeKey: "flow.ois.knowledgeDetail.purpose",
    userKey: "flow.ois.knowledgeDetail.user",
    actionKey: "flow.ois.knowledgeDetail.action",
    statusKeys: ["common.previewOnly", "common.future"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "flow.ois.knowledgeDetail.title", stable: "Knowledge Detail" },
      { key: "common.status", stable: "Status" },
      { key: "common.priority", stable: "Priority" },
      { key: "common.ownerReview", stable: "Owner review" }
    ]
  },
  {
    id: "ask-ois-copilot",
    stableTitle: "Ask OIS / Copilot",
    titleKey: "flow.ois.askCopilot.title",
    purposeKey: "flow.ois.askCopilot.purpose",
    userKey: "flow.ois.askCopilot.user",
    actionKey: "flow.ois.askCopilot.action",
    statusKeys: ["common.previewOnly", "common.future"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "flow.ois.askCopilot.title", stable: "Ask OIS / Copilot" },
      { key: "common.nextAction", stable: "Next action" },
      { key: "common.status", stable: "Status" },
      { key: "common.readOnly", stable: "Read-only" }
    ]
  },
  {
    id: "runtime-admin",
    stableTitle: "Runtime/Admin",
    titleKey: "flow.ois.runtimeAdmin.title",
    purposeKey: "flow.ois.runtimeAdmin.purpose",
    userKey: "flow.ois.runtimeAdmin.user",
    actionKey: "flow.ois.runtimeAdmin.action",
    statusKeys: ["common.implemented", "common.readOnly"],
    classificationKey: "flow.classification.admin",
    sections: [
      { key: "common.runtime", stable: "Runtime" },
      { key: "common.adminRuntime", stable: "Admin/runtime" },
      { key: "common.ownerReview", stable: "Owner review" },
      { key: "common.controlPlane", stable: "Control-plane" }
    ]
  }
];

const oisProductPages = [
  "Executive Dashboard",
  "Workspace List",
  "Workspace Intelligence Dashboard",
  "Knowledge Feed",
  "Knowledge Detail",
  "Ask OIS / Copilot"
] as const;

const oisAdminPages = ["Dashboard", "Products", "Workspaces registry", "Runtime", "Owner Review Queue", "Admin Boundary"] as const;

const approvalChecks = [
  "OIS starts with organizational intelligence, not registry diagnostics.",
  "Every intelligence claim requires evidence and provenance in future stages.",
  "Ask OIS returns evidence-backed answers or an insufficient-evidence fallback.",
  "No hallucinated answer rule",
  "Admin and runtime pages stay available but secondary."
] as const;

function FlowStatusBadge({ children }: { children: string }) {
  return <span className="status status-neutral">{children}</span>;
}

function FlowScreenCard({ screen, index }: { screen: FlowScreen; index: number }) {
  const { t } = useLocalization();

  return (
    <article className="panel compact-panel product-flow-card" data-product-flow-screen={screen.stableTitle}>
      <div className="flow-card-topline">
        <span className="eyebrow">{t("common.screenDraft")}</span>
        <span className="flow-step">{index + 1}</span>
      </div>
      <h3>
        {t(screen.titleKey)}
        <span className="visually-hidden">{screen.stableTitle}</span>
      </h3>
      <p className="muted">{t(screen.purposeKey)}</p>
      <dl className="flow-card-facts">
        <div>
          <dt>{t("common.primaryUser")}</dt>
          <dd>{t(screen.userKey)}</dd>
        </div>
        <div>
          <dt>{t("common.mainAction")}</dt>
          <dd>{t(screen.actionKey)}</dd>
        </div>
        <div>
          <dt>{t("common.currentStageStatus")}</dt>
          <dd className="badge-row">
            {screen.statusKeys.map((key) => (
              <FlowStatusBadge key={key}>{t(key)}</FlowStatusBadge>
            ))}
          </dd>
        </div>
        <div>
          <dt>{t("common.classification")}</dt>
          <dd>{t(screen.classificationKey)}</dd>
        </div>
      </dl>
      <div className="functional-gap-list" aria-label={t("common.keySections")}>
        {screen.sections.map((section) => (
          <span key={`${screen.id}-${section.stable}`}>
            {t(section.key)}
            <span className="visually-hidden">{section.stable}</span>
          </span>
        ))}
      </div>
      <div className="wireframe-preview" aria-label={t("common.screenMock")}>
        <div className="wireframe-header" />
        <div className="wireframe-row" />
        <div className="wireframe-row short" />
        <div className="wireframe-columns">
          <span />
          <span />
          <span />
        </div>
      </div>
      <p className="muted flow-owner-review">{t("flow.ownerReview.visual")}</p>
    </article>
  );
}

export function OisProductFlowPreview() {
  const { t } = useLocalization();

  return (
    <>
      <section
        className="panel product-uat-panel product-flow-visual-panel"
        data-localization-foundation="Localization Foundation"
        data-product-flow-preview="Product Flow Preview"
      >
        <div className="panel-heading">
          <div>
            <span className="eyebrow">{t("flow.uxDraftEyebrow")}</span>
            <h3>{t("common.productFlowPreview")}</h3>
            <p className="muted">{t("flow.ois.summary")}</p>
          </div>
          <span className="status status-ok">{t("common.readOnlyUxDraft")}</span>
        </div>
        <div className="owner-review-marker-row" aria-label="OIS UX blueprint markers">
          <span>Localization Foundation</span>
          <span>Language Settings</span>
          <span>English</span>
          <span>Tiếng Việt</span>
          <span>OIS Product UX Preview</span>
          <span>OIS Product UX Blueprint</span>
          <span>Product Flow Preview</span>
          <span>{t("common.productPageVsAdminConsole")}</span>
          <span>{t("common.ownerApprovalRequired")}</span>
          <span>{t("common.noWriteEndpointsAdded")}</span>
          <span>No LLM call</span>
        </div>
        <p className="muted">{t("flow.noWorkflowChange")}</p>
      </section>

      <section className="screen-flow-rail" aria-label={t("common.flowRelationship")}>
        {oisScreens.map((screen, index) => (
          <div className="flow-rail-item" key={screen.id}>
            <span>{t(screen.titleKey)}</span>
            <span className="visually-hidden">{screen.stableTitle}</span>
            {index < oisScreens.length - 1 ? <strong aria-hidden="true">-&gt;</strong> : null}
          </div>
        ))}
      </section>

      <section className="dashboard-grid" aria-label="OIS product screen flow">
        {oisScreens.map((screen, index) => (
          <FlowScreenCard screen={screen} index={index} key={screen.id} />
        ))}
      </section>

      <section className="dashboard-grid" aria-label="Product page vs Admin console">
        <article className="panel">
          <h3>{t("flow.productPages")}</h3>
          <p className="muted">{t("flow.ownerReview.future")}</p>
          <div className="functional-gap-list">
            {oisProductPages.map((page) => (
              <span key={page}>{page}</span>
            ))}
          </div>
        </article>
        <article className="panel admin-boundary-panel">
          <h3>{t("flow.adminPages")}</h3>
          <p className="muted">{t("common.productAdminBoundary")}</p>
          <div className="functional-gap-list">
            {oisAdminPages.map((page) => (
              <span key={page}>{page}</span>
            ))}
          </div>
        </article>
      </section>

      <section className="panel owner-review-panel" aria-label="Owner approval checklist">
        <div className="panel-heading">
          <div>
            <h3>{t("flow.ownerReviewChecklist")}</h3>
            <p className="muted">{t("flow.reviewBeforeNextStage")}</p>
          </div>
          <span className="status status-ok">{t("common.draftGate")}</span>
        </div>
        <ul className="safety-gate-list">
          {approvalChecks.map((check) => (
            <li key={check}>{check}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
