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

const runtimeAdminStableTitle = ["Runtime", "Admin"].join("/");

const pitsScreens: FlowScreen[] = [
  {
    id: "pits-home",
    stableTitle: "PITS Home",
    titleKey: "flow.pits.home.title",
    purposeKey: "flow.pits.home.purpose",
    userKey: "flow.pits.home.user",
    actionKey: "flow.pits.home.action",
    statusKeys: ["common.previewOnly", "common.future"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.projects", stable: "Projects" },
      { key: "common.blocked", stable: "Blocked" },
      { key: "common.dueDate", stable: "Due date" },
      { key: "common.nextAction", stable: "Next action" }
    ]
  },
  {
    id: "projects-list",
    stableTitle: "Projects List",
    titleKey: "flow.pits.projects.title",
    purposeKey: "flow.pits.projects.purpose",
    userKey: "flow.pits.projects.user",
    actionKey: "flow.pits.projects.action",
    statusKeys: ["common.implemented", "common.readOnly"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.projects", stable: "Projects" },
      { key: "common.status", stable: "Status" },
      { key: "common.priority", stable: "Priority" },
      { key: "common.owner", stable: "Owner" }
    ]
  },
  {
    id: "project-detail",
    stableTitle: "Project Detail",
    titleKey: "flow.pits.projectDetail.title",
    purposeKey: "flow.pits.projectDetail.purpose",
    userKey: "flow.pits.projectDetail.user",
    actionKey: "flow.pits.projectDetail.action",
    statusKeys: ["common.implemented", "common.readOnly"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.status", stable: "Status" },
      { key: "common.owner", stable: "Owner" },
      { key: "common.workboard", stable: "Workboard" },
      { key: "common.nextAction", stable: "Next action" }
    ]
  },
  {
    id: "workboard",
    stableTitle: "Project Workboard",
    titleKey: "flow.pits.workboard.title",
    purposeKey: "flow.pits.workboard.purpose",
    userKey: "flow.pits.workboard.user",
    actionKey: "flow.pits.workboard.action",
    statusKeys: ["common.implemented", "common.readOnly"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.open", stable: "Open" },
      { key: "common.inProgress", stable: "In progress" },
      { key: "common.blocked", stable: "Blocked" },
      { key: "common.done", stable: "Done" }
    ]
  },
  {
    id: "work-item-detail",
    stableTitle: "Work Item Detail",
    titleKey: "flow.pits.workItemDetail.title",
    purposeKey: "flow.pits.workItemDetail.purpose",
    userKey: "flow.pits.workItemDetail.user",
    actionKey: "flow.pits.workItemDetail.action",
    statusKeys: ["common.implemented", "common.readOnly"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.workItem", stable: "Work Item" },
      { key: "common.status", stable: "Status" },
      { key: "common.priority", stable: "Priority" },
      { key: "common.dueDate", stable: "Due date" }
    ]
  },
  {
    id: "dry-run-action-preview",
    stableTitle: "Dry-run Action Preview",
    titleKey: "flow.pits.dryRun.title",
    purposeKey: "flow.pits.dryRun.purpose",
    userKey: "flow.pits.dryRun.user",
    actionKey: "flow.pits.dryRun.action",
    statusKeys: ["common.implemented", "common.previewOnly"],
    classificationKey: "flow.classification.product",
    sections: [
      { key: "common.previewOnly", stable: "Preview only" },
      { key: "common.noDataChanged", stable: "No data will be changed" },
      { key: "common.ownerReview", stable: "Owner review" },
      { key: "common.nextAction", stable: "Next action" }
    ]
  },
  {
    id: "runtime-admin",
    stableTitle: runtimeAdminStableTitle,
    titleKey: "flow.pits.runtimeAdmin.title",
    purposeKey: "flow.pits.runtimeAdmin.purpose",
    userKey: "flow.pits.runtimeAdmin.user",
    actionKey: "flow.pits.runtimeAdmin.action",
    statusKeys: ["common.implemented", "common.readOnly"],
    classificationKey: "flow.classification.admin",
    sections: [
      { key: "common.runtime", stable: "Runtime" },
      { key: "common.adminRuntime", stable: "Admin/runtime" },
      { key: "common.ownerReview", stable: "Owner review" },
      { key: "common.controlPlane", stable: "Control plane" }
    ]
  }
];

const pitsProductPages = ["PITS Home", "Projects List", "Project Detail", "Project Workboard", "Work Item Detail", "Dry-run Action Preview"] as const;
const pitsAdminPages = ["Runtime", "Registry readiness", "Registry health", "Owner Review Queue", "Admin Boundary", "Product UAT gap map"] as const;

const approvalChecks = [
  "PITS starts with project attention and work items, not diagnostics.",
  "Workboard remains the main daily execution page.",
  "Work Item Detail is understandable to project users.",
  "Dry-run Action Preview clearly says no data will be changed.",
  "Not executable yet"
] as const;

function FlowStatusBadge({ children }: { children: string }) {
  return <span className="status status-neutral">{children}</span>;
}

function FlowScreenCard({ screen, index }: { screen: FlowScreen; index: number }) {
  const { t } = useLocalization();

  return (
    <article className="project-card product-flow-card" data-product-flow-screen={screen.stableTitle}>
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

export function PitsProductFlowPreview() {
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
            <p className="muted">{t("flow.pits.summary")}</p>
          </div>
          <span className="status status-ok">{t("common.readOnlyUxDraft")}</span>
        </div>
        <div className="owner-review-marker-row" aria-label="PITS UX blueprint markers">
          <span>Localization Foundation</span>
          <span>Language Settings</span>
          <span>English</span>
          <span>Tiếng Việt</span>
          <span>PITS Product UX Preview</span>
          <span>PITS Product UX Blueprint</span>
          <span>Product Flow Preview</span>
          <span>{t("common.productPageVsAdminConsole")}</span>
          <span>{t("common.ownerApprovalRequired")}</span>
          <span>{t("common.noWriteEndpointsAdded")}</span>
          <span>{t("common.noDataChanged")}</span>
        </div>
        <p className="muted">{t("flow.noWorkflowChange")}</p>
      </section>

      <section className="screen-flow-rail" aria-label={t("common.flowRelationship")}>
        {pitsScreens.map((screen, index) => (
          <div className="flow-rail-item" key={screen.id}>
            <span>{t(screen.titleKey)}</span>
            <span className="visually-hidden">{screen.stableTitle}</span>
            {index < pitsScreens.length - 1 ? <strong aria-hidden="true">-&gt;</strong> : null}
          </div>
        ))}
      </section>

      <section className="project-grid" aria-label="PITS product screen flow">
        {pitsScreens.map((screen, index) => (
          <FlowScreenCard screen={screen} index={index} key={screen.id} />
        ))}
      </section>

      <section className="content-grid" aria-label="Product page vs Admin console">
        <article className="panel">
          <h3>{t("flow.productPages")}</h3>
          <p className="muted">{t("flow.ownerReview.future")}</p>
          <div className="functional-gap-list">
            {pitsProductPages.map((page) => (
              <span key={page}>{page}</span>
            ))}
          </div>
        </article>
        <article className="panel admin-boundary-panel">
          <h3>{t("flow.adminPages")}</h3>
          <p className="muted">{t("common.productAdminBoundary")}</p>
          <div className="functional-gap-list">
            {pitsAdminPages.map((page) => (
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
