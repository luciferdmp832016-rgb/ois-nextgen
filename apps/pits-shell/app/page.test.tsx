import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";
import ProjectsPage from "./projects/page";
import ProjectDetailPage from "./projects/[id]/page";
import ProjectWorkboardPage from "./projects/[id]/workboard/page";
import WorkItemDetailPage from "./projects/[id]/work-items/[itemId]/page";
import RuntimePage from "./runtime/page";

const coreApiUrl = "https://ois-nextgen.abacusai.cloud";
const oisPublicBaseUrl = "https://ois-ng.dmp247.com";
const pitsPublicBaseUrl = "https://pits-ng.dmp247.com";
const dbEnvKey = ["DATABASE", "URL"].join("_");
const adminBoundaryPath = ["/platform", "admin-boundary"].join("/");
const productUatPath = ["/platform", "product-uat"].join("/");
const controlPlaneOnlyText = ["Control", "plane only"].join("-");

const healthPayload = {
  status: "ok",
  service: "core-api",
  stage: "bootstrap-stage-a"
};

const overviewPayload = {
  banner: "DEMO DATA - NOT PRODUCTION",
  kernel: {
    industries: 1,
    organizations: 1,
    workspaces: 1,
    projects: 2,
    products: 5,
    installations: 2,
    modules: 3,
    auditRecords: 1
  },
  phaseGates: {
    PLATFORM_KERNEL: "IN_PROGRESS"
  }
};

const registryPayload = {
  metadata: {
    source: "default-db",
    mode: "read-only",
    environment: "staging",
    generatedAt: "2026-07-08T00:00:00.000Z"
  },
  products: [
    {
      id: "prod_pits",
      code: "PITS",
      name: "PITS",
      lifecycle: "ACTIVE",
      version: 1,
      modules: [
        {
          id: "module_pits_runtime_shell",
          code: "PITS_RUNTIME_SHELL",
          productCode: "PITS",
          layerCode: "L0_OPERATIONAL_DATA",
          scope: "PROJECT",
          realmCode: "PITS_PROJECT_USER",
          moduleType: "PRODUCT_RUNTIME_VIEW",
          lifecycle: "ACTIVE",
          version: 1
        }
      ],
      installations: []
    }
  ],
  organizations: [],
  workspaces: [],
  modules: [
    {
      id: "module_pits_runtime_shell",
      code: "PITS_RUNTIME_SHELL",
      productCode: "PITS",
      layerCode: "L0_OPERATIONAL_DATA",
      scope: "PROJECT",
      realmCode: "PITS_PROJECT_USER",
      moduleType: "PRODUCT_RUNTIME_VIEW",
      lifecycle: "ACTIVE",
      version: 1,
      product: { code: "PITS", name: "PITS" }
    }
  ],
  projects: [
    {
      id: "prj_emerald_precinct_demo",
      code: "EMERALD_PRECINCT_DEMO",
      name: "Emerald Precinct Demo",
      workspaceId: "ws_pmc_org_demo",
      lifecycle: "ACTIVE",
      version: 1,
      workspace: { code: "PMC_ORG_DEMO", name: "PMC Org Demo" },
      organization: { code: "PMC_DEMO", name: "PMC Demo" },
      installations: [
        {
          id: "inst_pits_emerald",
          productId: "prod_pits",
          productCode: "PITS",
          productName: "PITS",
          lifecycle: "ACTIVE",
          version: 1
        }
      ]
    },
    {
      id: "prj_second_project_demo",
      code: "SECOND_PROJECT_DEMO",
      name: "Second Project Demo",
      workspaceId: "ws_pmc_org_demo",
      lifecycle: "ACTIVE",
      version: 1,
      workspace: { code: "PMC_ORG_DEMO", name: "PMC Org Demo" },
      organization: { code: "PMC_DEMO", name: "PMC Demo" },
      installations: [{ id: "inst_pits_second", productCode: "PITS", productName: "PITS", lifecycle: "ACTIVE", version: 1 }]
    }
  ],
  installations: [
    {
      id: "inst_pits_emerald",
      productCode: "PITS",
      productId: "prod_pits",
      organizationId: "org_pmc_demo",
      workspaceId: "ws_pmc_org_demo",
      projectId: "prj_emerald_precinct_demo",
      lifecycle: "ACTIVE",
      version: 1,
      product: { code: "PITS", name: "PITS" },
      organization: { code: "PMC_DEMO", name: "PMC Demo" },
      workspace: { code: "PMC_ORG_DEMO", name: "PMC Org Demo" },
      project: { code: "EMERALD_PRECINCT_DEMO", name: "Emerald Precinct Demo" }
    }
  ]
};

const projectRegistryItem = registryPayload.projects[0]!;

function healthItem(kind: string, id: string, code: string, name: string, links: Record<string, string>) {
  return {
    kind,
    id,
    code,
    name,
    lifecycle: "ACTIVE",
    status: "Healthy",
    badges: ["Healthy", "Configured", "Linked", "Reachable"],
    checks: [
      {
        label: "Registry row",
        status: "Configured",
        ok: true,
        required: true,
        detail: "Registry row is present.",
        url: null
      },
      {
        label: "Core API detail source",
        status: "Reachable",
        ok: true,
        required: true,
        detail: "Read-only Core API detail URL is configured for staging.",
        url: links.coreApiDetail
      }
    ],
    links
  };
}

const registryHealthPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: oisPublicBaseUrl,
    pitsShellBaseUrl: pitsPublicBaseUrl,
    reachabilityMode: "configured-url",
    note: "Reachable means a staging-safe public URL is configured; this read-only API does not probe external UI routes."
  },
  summary: {
    status: "Healthy",
    total: 5,
    healthy: 5,
    degraded: 0,
    unavailable: 0,
    missingUrl: 0
  },
  entities: {
    products: [
      healthItem("product", "prod_pits", "PITS", "PITS", {
        coreApiDetail: `${coreApiUrl}/platform/products/prod_pits`,
        oisConsoleDetail: `${oisPublicBaseUrl}/products/prod_pits`,
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ],
    workspaces: [
      healthItem("workspace", "ws_pmc_org_demo", "PMC_ORG_DEMO", "PMC Org Demo", {
        coreApiDetail: `${coreApiUrl}/platform/workspaces/ws_pmc_org_demo`,
        oisConsoleDetail: `${oisPublicBaseUrl}/workspaces/ws_pmc_org_demo`,
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ],
    projects: [
      healthItem("project", "prj_emerald_precinct_demo", "EMERALD_PRECINCT_DEMO", "Emerald Precinct Demo", {
        coreApiDetail: `${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`,
        pitsProjectDetail: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
        oisProduct: `${oisPublicBaseUrl}/products/prod_pits`,
        oisWorkspace: `${oisPublicBaseUrl}/workspaces/ws_pmc_org_demo`
      })
    ],
    modules: [
      healthItem("module", "module_pits_runtime_shell", "PITS_RUNTIME_SHELL", "PITS_RUNTIME_SHELL", {
        coreApiDetail: `${coreApiUrl}/platform/modules/module_pits_runtime_shell`,
        oisConsoleDetail: `${oisPublicBaseUrl}/modules/module_pits_runtime_shell`,
        oisProduct: `${oisPublicBaseUrl}/products/prod_pits`
      })
    ],
    installations: [
      healthItem("installation", "inst_pits_emerald", "PITS", "PITS installation", {
        coreApiDetail: `${coreApiUrl}/platform/installations/inst_pits_emerald`,
        oisConsoleDetail: `${oisPublicBaseUrl}/installations/inst_pits_emerald`,
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ]
  }
};

function readinessItem(kind: string, id: string, code: string, name: string, links: Record<string, string>) {
  return {
    kind,
    id,
    code,
    name,
    lifecycle: "ACTIVE",
    status: "READY",
    badges: ["READY", "INCOMPLETE"],
    checks: [
      {
        dimension: `${kind}_configured`,
        label: `${name} configured`,
        status: "READY",
        ok: true,
        required: true,
        reason: `${name} registry configuration is present.`,
        ownerAction: null,
        evidenceUrl: null
      },
      {
        dimension: "owner_uat_required",
        label: "Owner UAT",
        status: "INCOMPLETE",
        ok: true,
        required: false,
        reason: "Owner Browser/UAT is required before closing the runtime verified label.",
        ownerAction: "Run the Stage 1E Owner Browser/UAT checklist after Abacus runtime sync.",
        evidenceUrl: null
      }
    ],
    missing: [],
    blockedReasons: [],
    ownerActions: ["Run the Stage 1E Owner Browser/UAT checklist after Abacus runtime sync."],
    links
  };
}

const registryReadinessPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: oisPublicBaseUrl,
    pitsShellBaseUrl: pitsPublicBaseUrl,
    readinessMode: "deterministic-registry",
    note: "Readiness is derived from existing registry rows and staging-safe link configuration. Owner UAT remains required before runtime verification."
  },
  summary: {
    status: "READY",
    total: 5,
    ready: 5,
    incomplete: 0,
    blocked: 0,
    notApplicable: 0,
    unknown: 0
  },
  entities: {
    products: [
      readinessItem("product", "prod_pits", "PITS", "PITS", {
        coreApiDetail: `${coreApiUrl}/platform/products/prod_pits`,
        oisConsoleDetail: `${oisPublicBaseUrl}/products/prod_pits`,
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ],
    workspaces: [
      readinessItem("workspace", "ws_pmc_org_demo", "PMC_ORG_DEMO", "PMC Org Demo", {
        coreApiDetail: `${coreApiUrl}/platform/workspaces/ws_pmc_org_demo`,
        oisConsoleDetail: `${oisPublicBaseUrl}/workspaces/ws_pmc_org_demo`,
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ],
    projects: [
      readinessItem("project", "prj_emerald_precinct_demo", "EMERALD_PRECINCT_DEMO", "Emerald Precinct Demo", {
        coreApiDetail: `${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`,
        pitsProjectDetail: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
        oisProduct: `${oisPublicBaseUrl}/products/prod_pits`,
        oisWorkspace: `${oisPublicBaseUrl}/workspaces/ws_pmc_org_demo`
      })
    ],
    modules: [
      readinessItem("module", "module_pits_runtime_shell", "PITS_RUNTIME_SHELL", "PITS_RUNTIME_SHELL", {
        coreApiDetail: `${coreApiUrl}/platform/modules/module_pits_runtime_shell`,
        oisConsoleDetail: `${oisPublicBaseUrl}/modules/module_pits_runtime_shell`,
        oisProduct: `${oisPublicBaseUrl}/products/prod_pits`
      })
    ],
    installations: [
      readinessItem("installation", "inst_pits_emerald", "PITS", "PITS installation", {
        coreApiDetail: `${coreApiUrl}/platform/installations/inst_pits_emerald`,
        oisConsoleDetail: `${oisPublicBaseUrl}/installations/inst_pits_emerald`,
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ]
  }
};

const ownerReviewGates = [
  "ADR or stage approval for write behavior",
  "Versioned Prisma migration if schema changes are required",
  "Sensitive write audit trail",
  "Owner confirmation before execution",
  "Rollback plan before enabling action"
];

function ownerReviewItem(entityType: string, entityId: string, entityName: string) {
  return {
    id: `${entityType}:${entityId}:readiness:owner-uat-required`,
    title: `${entityName} - Owner UAT`,
    entityType,
    entityId,
    entityName,
    severity: "REVIEW",
    currentStatus: "INCOMPLETE",
    reason: "Owner Browser/UAT is required before closing the runtime verified label.",
    suggestedOwnerAction: "Run the owner Browser/UAT checklist after Abacus runtime sync.",
    actionPermission: "READ_ONLY_PREVIEW",
    actionCurrentlyAllowed: false,
    requiredSafetyGates: ownerReviewGates,
    auditRequirement: "Future admin action requires audit before execution.",
    rollbackRequirement: "Future admin action requires rollback plan before execution.",
    confirmationRequirement: "Future admin action requires owner confirmation before execution.",
    source: "registry-readiness",
    evidenceUrl: null
  };
}

const ownerReviewPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: oisPublicBaseUrl,
    pitsShellBaseUrl: pitsPublicBaseUrl,
    reviewMode: "read-only-owner-review",
    stage: "Stage 1I",
    note: "Owner review derives from registry readiness/health. No admin action is executable in Stage 1I."
  },
  actionBoundary: {
    stage: "Stage 1I",
    enabledAdminActions: 0,
    mutationEndpointsAdded: false,
    writePermission: "NOT_ALLOWED_IN_STAGE_1I",
    markers: ["Owner Review Queue", "Safe Action Boundary", "Read-only preview", "Future admin action requires audit"]
  },
  summary: {
    total: 2,
    info: 0,
    review: 2,
    warning: 0,
    blocked: 0,
    readOnlyPreview: 2,
    ownerReviewRequired: 0,
    futureAdminAction: 0,
    blockedUntilAudit: 0,
    notAllowedInStage1I: 0
  },
  items: [
    ownerReviewItem("project", "prj_emerald_precinct_demo", "Emerald Precinct Demo"),
    ownerReviewItem("installation", "inst_pits_emerald", "PITS installation")
  ]
};

const adminBoundaryGates = [
  "Permission model approved for action category",
  "Audit trail event schema and storage verified",
  "Owner confirmation workflow verified",
  "Rollback plan documented and rehearsed"
];

function adminBoundaryAction(entityType: string, entityId: string, entityName: string) {
  return {
    id: `${entityType}:${entityId}:admin-boundary:owner-uat`,
    actionName: `${entityName} - Future admin action`,
    category: "OWNER_REVIEW_RESOLVE",
    requiredRole: "OWNER",
    permissionState: "PREVIEW_ONLY",
    auditRequired: true,
    confirmationRequired: true,
    rollbackRequired: true,
    currentAvailability: "PREVIEW_ONLY",
    unavailableReason: "Blocked in current stage until audit, confirmation and rollback gates are implemented.",
    safetyGatesNeeded: adminBoundaryGates,
    linkedReviewItemId: `${entityType}:${entityId}:readiness:owner-uat-required`,
    entityType,
    entityId,
    entityName
  };
}

const adminBoundaryPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: oisPublicBaseUrl,
    pitsShellBaseUrl: pitsPublicBaseUrl,
    boundaryMode: "read-only-admin-permission-model",
    stage: "Stage 1J",
    note: "Admin Boundary is a read-only permission and audit model. No admin action is executable in Stage 1J."
  },
  adminBoundary: {
    stage: "Stage 1J",
    enabledAdminActions: 0,
    mutationEndpointsAdded: false,
    writePermission: "BLOCKED_IN_CURRENT_STAGE",
    markers: ["Admin Boundary", "Audit Required", "Permission Model", "Preview only", "Blocked in current stage"]
  },
  summary: {
    roles: 5,
    permissionStates: 7,
    actionCategories: 7,
    safetyGates: 4,
    futureAdminActions: 2,
    previewOnlyActions: 2,
    blockedActions: 7,
    auditRequired: 2,
    confirmationRequired: 2,
    rollbackRequired: 2
  },
  roles: [
    { code: "OWNER", label: "Owner", description: "Owner controlled approval role.", currentStageCapabilities: ["Read model"] },
    { code: "ADMIN", label: "Admin", description: "Future delegated admin role.", currentStageCapabilities: ["Read model"] },
    { code: "OPERATOR", label: "Operator", description: "Future operational support role.", currentStageCapabilities: ["Read model"] },
    { code: "VIEWER", label: "Viewer", description: "Read-only observer role.", currentStageCapabilities: ["Read model"] },
    { code: "SYSTEM", label: "System", description: "System provenance role.", currentStageCapabilities: ["Read model"] }
  ],
  permissions: [
    { state: "ALLOWED_READ_ONLY", label: "Allowed read-only", description: "Read-only visibility is enabled." },
    { state: "PREVIEW_ONLY", label: "Preview only", description: "Visible but not executable." },
    { state: "REQUIRES_OWNER_CONFIRMATION", label: "Requires owner approval", description: "Owner confirmation is required." },
    { state: "REQUIRES_ADMIN_PERMISSION", label: "Requires admin permission", description: "Admin permission is required." },
    { state: "REQUIRES_AUDIT_TRAIL", label: "Requires audit trail", description: "Audit trail is required." },
    { state: "REQUIRES_ROLLBACK_PLAN", label: "Requires rollback plan", description: "Rollback plan is required." },
    { state: "BLOCKED_IN_CURRENT_STAGE", label: "Blocked in current stage", description: "Action is unavailable in Stage 1J." }
  ],
  actionCategories: [],
  safetyGates: adminBoundaryGates.map((gate) => ({ code: gate, label: gate, required: true, description: gate })),
  auditRequirements: [],
  confirmationRequirements: [],
  rollbackRequirements: [],
  blockedActions: [],
  previewOnlyActions: [
    adminBoundaryAction("project", "prj_emerald_precinct_demo", "Emerald Precinct Demo"),
    adminBoundaryAction("installation", "inst_pits_emerald", "PITS installation")
  ],
  futureAdminActions: [
    adminBoundaryAction("project", "prj_emerald_precinct_demo", "Emerald Precinct Demo"),
    adminBoundaryAction("installation", "inst_pits_emerald", "PITS installation")
  ]
};

const workItemId = "pits-emerald_precinct_demo-open-site-access";

const productUatPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: oisPublicBaseUrl,
    pitsShellBaseUrl: pitsPublicBaseUrl,
    uatMode: "read-only-product-user-journey-map",
    stage: "Stage 1K",
    note: "Product User Journey UAT is a read-only functional gap map. It does not enable project writes or admin actions."
  },
  productUat: {
    stage: "Stage 1K",
    mutationEndpointsAdded: false,
    writePermission: "NOT_ALLOWED_IN_STAGE_1K",
    markers: ["Product User Journey UAT", "Testable now", controlPlaneOnlyText, "Functional gap map", "Next product journey"]
  },
  summary: {
    products: 2,
    surfaces: 6,
    visiblePages: 5,
    testableNow: 5,
    realProductFunctionsAvailable: 1,
    controlPlaneOnly: 1,
    placeholderOrShellOnly: 0,
    futureProductFunctions: 1,
    blockedByMissingDataModel: 1,
    blockedByWriteBoundary: 1,
    blockedByAuthOrPermission: 0,
    needsOwnerDecision: 1
  },
  categories: [
    { category: "AVAILABLE_FOR_BROWSER_UAT", label: "Testable now", description: "Browser UAT is possible without writes." },
    { category: "PLATFORM_CONTROL_PLANE_ONLY", label: controlPlaneOnlyText, description: "Registry, runtime or administration view." },
    { category: "PLACEHOLDER_OR_SHELL_ONLY", label: "Placeholder or shell only", description: "Shell exists before product workflow." },
    { category: "FUTURE_PRODUCT_FUNCTION", label: "Not implemented yet", description: "Planned future product behavior." },
    { category: "BLOCKED_BY_MISSING_DATA_MODEL", label: "Needs data model", description: "Domain model is required first." },
    { category: "BLOCKED_BY_WRITE_BOUNDARY", label: "Needs write boundary", description: "Write/audit boundary is required first." },
    { category: "BLOCKED_BY_AUTH_OR_PERMISSION", label: "Needs auth or permission", description: "Permission model is required first." },
    { category: "NEEDS_OWNER_DECISION", label: "Needs owner decision", description: "Owner priority is required first." }
  ],
  products: [
    {
      productCode: "OIS",
      productName: "OIS Console",
      productId: null,
      currentState: "OIS platform foundation is mapped for comparison.",
      ownerUatStatus: "READY_FOR_BROWSER_UAT",
      testableNow: ["OIS dashboard"],
      controlPlaneOnly: ["OIS dashboard"],
      missingProductFunctions: ["Future OIS workspace home"],
      recommendedNextJourneys: ["Define the first OIS workspace user home"],
      surfaces: []
    },
    {
      productCode: "PITS",
      productName: "PITS",
      productId: "prod_pits",
      currentState: "Project registry shell, Stage 2A read-only workboard and Stage 2B work item detail/dry-run preview; writes remain blocked.",
      ownerUatStatus: "READY_FOR_BROWSER_UAT",
      testableNow: [
        "PITS runtime shell",
        "PITS project list",
        "PITS project detail",
        "PITS Work Item Detail and Dry-run Action Preview",
        "PITS runtime, readiness and boundary summary"
      ],
      controlPlaneOnly: ["PITS runtime, readiness and boundary summary"],
      missingProductFunctions: ["Future issue and task workflow", "Future project status update"],
      recommendedNextJourneys: [
        "Owner-test the PITS Project Workboard read-only functional slice",
        "Owner-test PITS Work Item Detail and Dry-run Action Preview",
        "Keep project status writes disabled until audit/write boundaries are approved"
      ],
      surfaces: [
        {
          id: "pits:root-shell",
          productCode: "PITS",
          productName: "PITS",
          surfaceName: "PITS runtime shell",
          route: `${pitsPublicBaseUrl}/`,
          entityType: "platform",
          entityId: null,
          category: "AVAILABLE_FOR_BROWSER_UAT",
          statusLabel: "Testable now",
          testableNow: true,
          realProductFunction: false,
          ownerUatStatus: "READY_FOR_BROWSER_UAT",
          currentUserTest: "Open PITS Shell and verify the product runtime frame, project summary and safe staging links.",
          currentReality: "PITS is currently a project registry/readiness shell, not a true project workflow app.",
          functionalGap: "Issue, task, incident, status and work-tracking journeys are not implemented yet.",
          blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "NEEDS_OWNER_DECISION"],
          recommendedNextStep: "Select the first PITS workflow journey before adding writes.",
          nextUserLevelTestPath: `${pitsPublicBaseUrl}/projects`,
          evidence: ["PITS Registry Cockpit / Project Runtime Summary", "Project readiness"]
        },
        {
          id: "pits:project-list",
          productCode: "PITS",
          productName: "PITS",
          surfaceName: "PITS project list",
          route: `${pitsPublicBaseUrl}/projects`,
          entityType: "project",
          entityId: "prj_emerald_precinct_demo",
          category: "AVAILABLE_FOR_BROWSER_UAT",
          statusLabel: "Testable now",
          testableNow: true,
          realProductFunction: false,
          ownerUatStatus: "READY_FOR_BROWSER_UAT",
          currentUserTest: "Open Projects and confirm project cards, installation context, readiness and runtime health.",
          currentReality: "This is testable as a project registry shell and readiness shell.",
          functionalGap: "It does not yet support issue/task creation, assignment, status updates or project workflow execution.",
          blockers: ["BLOCKED_BY_WRITE_BOUNDARY", "BLOCKED_BY_MISSING_DATA_MODEL"],
          recommendedNextStep: "Define a read-only issue/task list as the first true PITS workflow baseline.",
          nextUserLevelTestPath: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
          evidence: ["Project Selector", "Project Installation Registry"]
        },
        {
          id: "pits:project-detail",
          productCode: "PITS",
          productName: "PITS",
          surfaceName: "PITS project detail",
          route: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
          entityType: "project",
          entityId: "prj_emerald_precinct_demo",
          category: "AVAILABLE_FOR_BROWSER_UAT",
          statusLabel: "Testable now",
          testableNow: true,
          realProductFunction: false,
          ownerUatStatus: "READY_FOR_BROWSER_UAT",
          currentUserTest: "Open one project detail and verify OIS cross-links, project readiness and runtime health.",
          currentReality: "This is a project detail/readiness shell.",
          functionalGap: "It does not yet provide field reports, cases, tasks, incidents or work status transitions.",
          blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "BLOCKED_BY_WRITE_BOUNDARY"],
          recommendedNextStep: "Add a read-only project workflow baseline before enabling task or incident writes.",
          nextUserLevelTestPath: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
          evidence: ["Project Detail Source", "Project Runtime Health"]
        },
        {
          id: "pits:work-item-detail-dry-run",
          productCode: "PITS",
          productName: "PITS",
          surfaceName: "PITS Work Item Detail and Dry-run Action Preview",
          route: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo/work-items/${workItemId}`,
          entityType: "project",
          entityId: "prj_emerald_precinct_demo",
          category: "AVAILABLE_FOR_BROWSER_UAT",
          statusLabel: "Testable now",
          testableNow: true,
          realProductFunction: true,
          ownerUatStatus: "READY_FOR_BROWSER_UAT",
          currentUserTest: "Open a work item detail and inspect dry-run action previews without changing data.",
          currentReality: "Stage 2B provides read-only work item detail and deterministic dry-run action preview.",
          functionalGap: "No real status, owner, note, priority or blocker mutation is implemented.",
          blockers: ["BLOCKED_BY_WRITE_BOUNDARY"],
          recommendedNextStep: "Owner-test dry-run previews, then define the future write-boundary acceptance criteria.",
          nextUserLevelTestPath: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo/work-items/${workItemId}`,
          evidence: ["Work Item Detail", "Dry-run Action Preview", "No data will be changed"]
        },
        {
          id: "pits:runtime-readiness-boundaries",
          productCode: "PITS",
          productName: "PITS",
          surfaceName: "PITS runtime, readiness and boundary summary",
          route: `${pitsPublicBaseUrl}/runtime`,
          entityType: "platform",
          entityId: null,
          category: "PLATFORM_CONTROL_PLANE_ONLY",
          statusLabel: controlPlaneOnlyText,
          testableNow: true,
          realProductFunction: false,
          ownerUatStatus: "MAPPED_AS_CONTROL_PLANE",
          currentUserTest: "Verify project runtime health, readiness, owner review and audit and admin boundary status.",
          currentReality: "This is runtime readiness and governance visibility for PITS.",
          functionalGap: "It is not a project user's daily work execution screen.",
          blockers: ["BLOCKED_BY_WRITE_BOUNDARY"],
          recommendedNextStep: "Use this as the safety baseline for the first project workflow read model.",
          nextUserLevelTestPath: `${pitsPublicBaseUrl}/runtime`,
          evidence: ["Runtime Status", "Safe Action Boundary"]
        },
        {
          id: "pits:future-issue-task-workflow",
          productCode: "PITS",
          productName: "PITS",
          surfaceName: "Future issue and task workflow",
          route: null,
          entityType: "project",
          entityId: "prj_emerald_precinct_demo",
          category: "BLOCKED_BY_MISSING_DATA_MODEL",
          statusLabel: "Needs data model",
          testableNow: false,
          realProductFunction: true,
          ownerUatStatus: "NOT_IMPLEMENTED_YET",
          currentUserTest: "No browser UAT path exists yet for project issue or task workflow.",
          currentReality: "Stage 1K only maps the gap.",
          functionalGap: "Needs project workflow entities, relationships, starter data and acceptance tests.",
          blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "NEEDS_OWNER_DECISION"],
          recommendedNextStep: "Define read-only PITS issue/task list and detail acceptance criteria before writes.",
          nextUserLevelTestPath: null,
          evidence: ["Not implemented yet", "Functional gap map"]
        }
      ]
    }
  ],
  recommendedNextProductJourneys: [
    "Confirm whether OIS workspace home or PITS issue/task workflow is the first true product journey.",
    "Start with read-only product workflow screens before any write or admin action."
  ]
};

const projectDetailPayload = {
  metadata: registryPayload.metadata,
  project: {
    ...projectRegistryItem,
    relationships: {
      workspace: projectRegistryItem.workspace,
      organization: projectRegistryItem.organization,
      products: registryPayload.products,
      modules: registryPayload.modules,
      installations: projectRegistryItem.installations
    }
  }
};

const projectWorkboardPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: oisPublicBaseUrl,
    pitsShellBaseUrl: pitsPublicBaseUrl,
    workboardMode: "read-only-functional-slice",
    stage: "Stage 2A",
    note: "Read-only functional slice — editing is not enabled yet"
  },
  workboard: {
    projectId: "prj_emerald_precinct_demo",
    projectCode: "EMERALD_PRECINCT_DEMO",
    projectName: "Emerald Precinct Demo",
    source: "deterministic-demo-data",
    stage: "Stage 2A",
    readOnly: true,
    markers: ["PITS Project Workboard", "Read-only functional slice", "Work items", "Open", "In progress", "Blocked", "Done"]
  },
  summary: {
    totalItems: 5,
    openCount: 2,
    inProgressCount: 1,
    blockedCount: 1,
    doneCount: 1,
    highPriorityCount: 2,
    overdueCount: 1,
    nextRecommendedAction: "Inspect blocked and high-priority items, then define Stage 2B/2C write-boundary acceptance criteria.",
    currentLimitations: [
      "Read-only functional slice — editing is not enabled yet",
      "No create, edit, delete or status-change mutation endpoint is available in Stage 2A.",
      "Work items are deterministic demo/runtime data, not persisted task records."
    ]
  },
  statusGroups: [
    {
      status: "OPEN",
      label: "Open",
      items: [
        {
          id: "pits-emerald_precinct_demo-open-site-access",
          title: "Confirm site access package",
          type: "TASK",
          status: "OPEN",
          priority: "HIGH",
          owner: "Project operator",
          dueDate: "2026-07-12",
          source: "Stage 2A deterministic demo data",
          summary: "Validate the owner can see the first actionable project work item without creating or editing data.",
          nextAction: "Review access package checklist with the site lead.",
          blockers: [],
          relatedProjectId: "prj_emerald_precinct_demo",
          updatedAt: "2026-07-08T09:00:00.000Z"
        }
      ]
    },
    {
      status: "IN_PROGRESS",
      label: "In progress",
      items: [
        {
          id: "pits-emerald_precinct_demo-progress-inspection-plan",
          title: "Prepare inspection walk plan",
          type: "TASK",
          status: "IN_PROGRESS",
          priority: "MEDIUM",
          owner: "Field coordinator",
          dueDate: "2026-07-15",
          source: "Stage 2A deterministic demo data",
          summary: "Draft the read-only sequence of project checks the owner can inspect in the browser.",
          nextAction: "Compare planned checkpoints with the project readiness summary.",
          blockers: [],
          relatedProjectId: "prj_emerald_precinct_demo",
          updatedAt: "2026-07-08T10:00:00.000Z"
        }
      ]
    },
    {
      status: "BLOCKED",
      label: "Blocked",
      items: [
        {
          id: "pits-emerald_precinct_demo-blocked-fire-door-risk",
          title: "Resolve fire door access risk",
          type: "RISK",
          status: "BLOCKED",
          priority: "CRITICAL",
          owner: "Safety lead",
          dueDate: "2026-07-07",
          source: "Stage 2A deterministic demo data",
          summary: "A high-priority project risk is visible, but resolution remains disabled until write boundaries exist.",
          nextAction: "Owner reviews blocker context; status changes require Stage 2B/2C write boundary.",
          blockers: ["Awaiting owner decision", "Requires Stage 2B/2C write boundary"],
          relatedProjectId: "prj_emerald_precinct_demo",
          updatedAt: "2026-07-08T11:00:00.000Z"
        }
      ]
    },
    {
      status: "DONE",
      label: "Done",
      items: [
        {
          id: "pits-emerald_precinct_demo-done-registry-check",
          title: "Verify project registry links",
          type: "FOLLOW_UP",
          status: "DONE",
          priority: "LOW",
          owner: "Runtime steward",
          dueDate: "2026-07-05",
          source: "Stage 2A deterministic demo data",
          summary: "Completed item proves the board can distinguish done work from active work.",
          nextAction: "No action required; keep evidence visible for owner UAT.",
          blockers: [],
          relatedProjectId: "prj_emerald_precinct_demo",
          updatedAt: "2026-07-08T13:00:00.000Z"
        }
      ]
    }
  ],
  items: [],
  readOnlyBoundary: {
    editingEnabled: false,
    mutationEndpointsAdded: false,
    writePermission: "NOT_ALLOWED_IN_STAGE_2A",
    notice: "Read-only functional slice — editing is not enabled yet",
    disabledActions: [
      "Create work item - Preview only",
      "Edit work item - Not executable yet",
      "Change status - Requires Stage 2B/2C write boundary"
    ],
    futureWriteBoundary: "Requires Stage 2B/2C write boundary"
  }
};

const dryRunPreviews = [
  {
    actionType: "CHANGE_STATUS",
    label: "Change status preview",
    allowedInCurrentStage: false,
    mode: "DRY_RUN_ONLY",
    currentValue: "OPEN",
    proposedValue: "DONE",
    expectedImpact: "Would move the work item to another status column after a future audited write boundary exists.",
    requiredRole: "PROJECT_OPERATOR",
    auditRequired: true,
    confirmationRequired: true,
    rollbackRequired: true,
    blockedReason: "Stage 2B is dry-run only. Requires future write boundary before any status, owner, note, priority or blocker change can execute.",
    safetyGates: [
      "Requires future write boundary",
      "Requires audit trail",
      "Requires confirmation",
      "Requires rollback plan",
      "No data will be changed in Stage 2B"
    ],
    noDataChanged: true
  },
  {
    actionType: "ASSIGN_OWNER",
    label: "Assign owner preview",
    allowedInCurrentStage: false,
    mode: "DRY_RUN_ONLY",
    currentValue: "Project operator",
    proposedValue: "Owner delegate",
    expectedImpact: "Would reassign responsibility after future permission checks and audit logging are approved.",
    requiredRole: "PROJECT_MANAGER",
    auditRequired: true,
    confirmationRequired: true,
    rollbackRequired: true,
    blockedReason: "Stage 2B is dry-run only. Requires future write boundary before any status, owner, note, priority or blocker change can execute.",
    safetyGates: [
      "Requires future write boundary",
      "Requires audit trail",
      "Requires confirmation",
      "Requires rollback plan",
      "No data will be changed in Stage 2B"
    ],
    noDataChanged: true
  },
  {
    actionType: "ADD_NOTE",
    label: "Add note preview",
    allowedInCurrentStage: false,
    mode: "DRY_RUN_ONLY",
    currentValue: "No persisted note field is available in Stage 2B.",
    proposedValue: "Dry-run note: owner reviewed this item.",
    expectedImpact: "Would append an auditable project note after note storage and write rules exist.",
    requiredRole: "PROJECT_OPERATOR",
    auditRequired: true,
    confirmationRequired: true,
    rollbackRequired: true,
    blockedReason: "Stage 2B is dry-run only. Requires future write boundary before any status, owner, note, priority or blocker change can execute.",
    safetyGates: [
      "Requires future write boundary",
      "Requires audit trail",
      "Requires confirmation",
      "Requires rollback plan",
      "No data will be changed in Stage 2B"
    ],
    noDataChanged: true
  },
  {
    actionType: "SET_PRIORITY",
    label: "Set priority preview",
    allowedInCurrentStage: false,
    mode: "DRY_RUN_ONLY",
    currentValue: "HIGH",
    proposedValue: "CRITICAL",
    expectedImpact: "Would change escalation priority after confirmation and rollback requirements are met.",
    requiredRole: "PROJECT_MANAGER",
    auditRequired: true,
    confirmationRequired: true,
    rollbackRequired: true,
    blockedReason: "Stage 2B is dry-run only. Requires future write boundary before any status, owner, note, priority or blocker change can execute.",
    safetyGates: [
      "Requires future write boundary",
      "Requires audit trail",
      "Requires confirmation",
      "Requires rollback plan",
      "No data will be changed in Stage 2B"
    ],
    noDataChanged: true
  },
  {
    actionType: "RESOLVE_BLOCKER",
    label: "Resolve blocker preview",
    allowedInCurrentStage: false,
    mode: "DRY_RUN_ONLY",
    currentValue: "No blocker is currently recorded.",
    proposedValue: "No blocker resolution available for this item.",
    expectedImpact: "Would record blocker resolution evidence after future workflow writes are enabled.",
    requiredRole: "SAFETY_LEAD",
    auditRequired: true,
    confirmationRequired: true,
    rollbackRequired: true,
    blockedReason: "Stage 2B is dry-run only. Requires future write boundary before any status, owner, note, priority or blocker change can execute.",
    safetyGates: [
      "Requires future write boundary",
      "Requires audit trail",
      "Requires confirmation",
      "Requires rollback plan",
      "No data will be changed in Stage 2B"
    ],
    noDataChanged: true
  }
];

const workItemDetailPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: oisPublicBaseUrl,
    pitsShellBaseUrl: pitsPublicBaseUrl,
    workItemDetailMode: "read-only-dry-run-preview",
    stage: "Stage 2B",
    note: "Work Item Detail and Dry-run Action Preview are preview only. No data will be changed."
  },
  workItemDetail: {
    projectId: "prj_emerald_precinct_demo",
    projectCode: "EMERALD_PRECINCT_DEMO",
    projectName: "Emerald Precinct Demo",
    itemId: workItemId,
    readOnly: true,
    dryRunOnly: true,
    markers: [
      "Work Item Detail",
      "Dry-run Action Preview",
      "Preview only",
      "No data will be changed",
      "Requires audit trail",
      "Requires confirmation",
      "Requires rollback plan"
    ]
  },
  item: {
    id: workItemId,
    title: "Confirm site access package",
    type: "TASK",
    status: "OPEN",
    priority: "HIGH",
    owner: "Project operator",
    dueDate: "2026-07-12",
    source: "Stage 2A deterministic demo data",
    summary: "Validate the owner can see the first actionable project work item without creating or editing data.",
    description:
      "Confirm site access package belongs to Emerald Precinct Demo. Stage 2B lets the owner inspect this work item and preview future actions without mutating project data.",
    nextAction: "Review access package checklist with the site lead.",
    blockers: [],
    relatedProjectId: "prj_emerald_precinct_demo",
    updatedAt: "2026-07-08T09:00:00.000Z",
    readOnlyNotice: "Preview only. No data will be changed.",
    relatedEntities: [
      { type: "project", id: "prj_emerald_precinct_demo", name: "Emerald Precinct Demo" },
      { type: "workboard", id: "prj_emerald_precinct_demo:workboard", name: "PITS Project Workboard" },
      { type: "product", id: "PITS", name: "PITS" }
    ],
    availableDryRunActions: dryRunPreviews.map((preview) => ({
      actionType: preview.actionType,
      label: preview.label,
      currentValue: preview.currentValue,
      proposedValue: preview.proposedValue,
      previewRoute: `/platform/pits/projects/prj_emerald_precinct_demo/work-items/${workItemId}/action-preview?actionType=${preview.actionType}`
    }))
  },
  dryRunPreviews,
  readOnlyBoundary: {
    mutationEndpointsAdded: false,
    writePermission: "NOT_ALLOWED_IN_STAGE_2B",
    notice: "Preview only. No data will be changed.",
    disabledActions: [
      "Change status - Preview only",
      "Assign owner - Preview only",
      "Add note - Preview only",
      "Set priority - Preview only",
      "Resolve blocker - Preview only"
    ],
    futureWriteBoundary: "Requires future write boundary"
  }
};

const workItemActionPreviewPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: oisPublicBaseUrl,
    pitsShellBaseUrl: pitsPublicBaseUrl,
    dryRunMode: "DRY_RUN_ONLY",
    stage: "Stage 2B",
    note: "Dry-run Action Preview is non-mutating. No data will be changed."
  },
  actionPreview: {
    projectId: "prj_emerald_precinct_demo",
    projectCode: "EMERALD_PRECINCT_DEMO",
    projectName: "Emerald Precinct Demo",
    itemId: workItemId,
    requestedActionType: null,
    allowedInCurrentStage: false,
    noDataChanged: true,
    markers: [
      "Dry-run Action Preview",
      "Preview only",
      "No data will be changed",
      "Requires audit trail",
      "Requires confirmation",
      "Requires rollback plan"
    ]
  },
  previews: dryRunPreviews,
  preview: null,
  noDataChanged: true
};

type RouteComponent = () => Promise<ReactElement>;

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function mockCoreApiFetch() {
  const fetchMock = vi.fn(async (input: Parameters<typeof fetch>[0]) => {
    const url = input instanceof Request ? input.url : String(input);

    if (url === `${coreApiUrl}/health`) {
      return jsonResponse(healthPayload);
    }

    if (url === `${coreApiUrl}/platform/overview`) {
      return jsonResponse(overviewPayload);
    }

    if (url === `${coreApiUrl}/platform/registry`) {
      return jsonResponse(registryPayload);
    }

    if (url === `${coreApiUrl}/platform/registry/health`) {
      return jsonResponse(registryHealthPayload);
    }

    if (url === `${coreApiUrl}/platform/registry/readiness`) {
      return jsonResponse(registryReadinessPayload);
    }

    if (url === `${coreApiUrl}/platform/owner-review`) {
      return jsonResponse(ownerReviewPayload);
    }

    if (url === `${coreApiUrl}${adminBoundaryPath}`) {
      return jsonResponse(adminBoundaryPayload);
    }

    if (url === `${coreApiUrl}${productUatPath}`) {
      return jsonResponse(productUatPayload);
    }

    if (url === `${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`) {
      return jsonResponse(projectDetailPayload);
    }

    if (url === `${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/workboard`) {
      return jsonResponse(projectWorkboardPayload);
    }

    if (url === `${coreApiUrl}/platform/pits/projects/missing/workboard`) {
      return jsonResponse({ metadata: registryPayload.metadata, error: { code: "NOT_FOUND", message: "project not found" } }, 404);
    }

    if (url === `${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/work-items/${workItemId}`) {
      return jsonResponse(workItemDetailPayload);
    }

    if (url === `${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/work-items/${workItemId}/action-preview`) {
      return jsonResponse(workItemActionPreviewPayload);
    }

    if (url === `${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/work-items/missing`) {
      return jsonResponse({ metadata: registryPayload.metadata, error: { code: "NOT_FOUND", message: "workItem not found" } }, 404);
    }

    if (url === `${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/work-items/missing/action-preview`) {
      return jsonResponse({ metadata: registryPayload.metadata, error: { code: "NOT_FOUND", message: "workItem not found" } }, 404);
    }

    if (url === `${coreApiUrl}/platform/projects/missing`) {
      return jsonResponse({ metadata: registryPayload.metadata, error: { code: "NOT_FOUND", message: "project not found" } }, 404);
    }

    return jsonResponse({ error: "unexpected URL", url }, 404);
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function renderRouteHtml(Component: RouteComponent) {
  return renderToStaticMarkup(await Component());
}

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

describe("PITS Shell product shell", () => {
  const previousCoreApiUrl = process.env.CORE_API_URL;
  const previousNextPublicCoreApiUrl = process.env.NEXT_PUBLIC_CORE_API_URL;
  const previousOisPublicBaseUrl = process.env.OIS_PUBLIC_BASE_URL;
  const previousDbEnv = process.env[dbEnvKey];

  beforeEach(() => {
    process.env.CORE_API_URL = coreApiUrl;
    process.env.OIS_PUBLIC_BASE_URL = oisPublicBaseUrl;
    delete process.env.NEXT_PUBLIC_CORE_API_URL;
    delete process.env[dbEnvKey];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreEnv("CORE_API_URL", previousCoreApiUrl);
    restoreEnv("NEXT_PUBLIC_CORE_API_URL", previousNextPublicCoreApiUrl);
    restoreEnv("OIS_PUBLIC_BASE_URL", previousOisPublicBaseUrl);
    restoreEnv(dbEnvKey, previousDbEnv);
  });

  it("renders the root navigation baseline with Core API health and seeded counts", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = await renderRouteHtml(Page);

    expect(html).toContain("PITS Shell");
    expect(html).toContain("PITS_SHELL");
    expect(html).toContain('data-shell-standard="Modern Shell Layout"');
    expect(html).toContain('data-shell-navigation="Fixed Navigation Shell"');
    expect(html).toContain('data-shell-responsive="Responsive Product Shell"');
    expect(html).toContain('data-shell-toggle="Shell Navigation Toggle"');
    expect(html).toContain("Shell Navigation Toggle");
    expect(html).toContain("Fixed Navigation Shell");
    expect(html).toContain("Responsive Product Shell");
    expect(html).toContain("Owner-first Design System");
    expect(html).toContain("Visual Hierarchy Standard");
    expect(html).toContain("Owner-friendly Status Badges");
    expect(html).toContain('data-owner-status="Owner-friendly Status Badges"');
    expect(html).toContain("What this is");
    expect(html).toContain("Hide nav");
    expect(html).toContain("Menu");
    expect(html).toContain('aria-label="PITS Shell navigation"');
    expect(html).toContain("Project Runtime Overview");
    expect(html).toContain("PITS Registry Cockpit / Project Runtime Summary");
    expect(html).toContain("Project readiness");
    expect(html).toContain("Forbidden link guard");
    expect(html).toContain("No issue detected");
    expect(html).toContain("Product User Journey UAT Baseline");
    expect(html).toContain("Product User Journey UAT");
    expect(html).toContain("Testable now");
    expect(html).toContain(controlPlaneOnlyText);
    expect(html).toContain("Functional gap map");
    expect(html).toContain("Next product journey");
    expect(html).toContain("What can be tested now?");
    expect(html).toContain("What is not implemented yet?");
    expect(html).toContain("Recommended next product functions");
    expect(html).toContain("Owner UAT status");
    expect(html).toContain("Next user-level test path");
    expect(html).toContain("project registry/readiness shell");
    expect(html).toContain("not a true project workflow app");
    expect(html).toContain("Project Selector");
    expect(html).toContain("Registry Governance / Readiness");
    expect(html).toContain("Registry Runtime Health");
    expect(html).toContain("Runtime");
    expect(html).toContain("Emerald Precinct Demo");
    expect(html).toContain("/projects/prj_emerald_precinct_demo");
    expect(html).toContain("Second Project Demo");
    expect(html).toContain(coreApiUrl);
    expect(html).toContain("Core API healthy");
    expect(html).toContain("bootstrap-stage-a");
    expect(html).toContain("DEMO DATA - NOT PRODUCTION");
    expect(html).toContain("DB-backed demo data is accessed only through the Core API.");
    expect(html).not.toContain(dbEnvKey);

    expect(html).toMatch(/Projects<\/span><strong>2<\/strong>/);
    expect(html).toMatch(/Products<\/span><strong>5<\/strong>/);
    expect(html).toMatch(/Installations<\/span><strong>2<\/strong>/);
    expect(html).toMatch(/Modules<\/span><strong>3<\/strong>/);

    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/health`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/overview`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/registry`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/registry/health`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/registry/readiness`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/owner-review`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}${adminBoundaryPath}`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}${productUatPath}`, { cache: "no-store" });
  });

  it.each([
    [
      "projects",
      ProjectsPage,
      [
        "Project Selector",
        "PITS Registry Cockpit / Project Runtime Summary",
        "Owner Review Queue",
        "Safe Action Boundary",
        "Read-only preview",
        "Future admin action requires audit",
        "Action is read-only preview only",
        "Admin Boundary",
        "Audit Required",
        "Permission Model",
        "Preview only",
        "Blocked in current stage",
        "Future admin action",
        "Preview only - not executable yet",
        "Product User Journey / UAT Baseline",
        "Product User Journey UAT",
        "Testable now",
        controlPlaneOnlyText,
        "Functional gap map",
        "Next product journey",
        "What can be tested now?",
        "What is not implemented yet?",
        "Recommended next product functions",
        "project registry shell and readiness shell",
        "PITS is no longer only a registry/readiness shell",
        "Open PITS Project Workboard",
        "Open Work Item Detail",
        "Suggested next actions",
        "Project readiness",
        "Runtime health:",
        "Registry Governance / Readiness",
        "Registry Runtime Health",
        "EMERALD_PRECINCT_DEMO",
        "/projects/prj_emerald_precinct_demo",
        "Project Installation Registry"
      ]
    ],
    [
      "runtime",
      RuntimePage,
      [
        "Runtime Status",
        "PITS Registry Cockpit / Project Runtime Summary",
        "Owner Review Queue",
        "Safe Action Boundary",
        "Read-only preview",
        "Future admin action requires audit",
        "Audit / Permission / Admin Boundary",
        "Audit Required",
        "Permission Model",
        "Preview only",
        "Blocked in current stage",
        "Future admin action",
        "Product Capability / UAT Status",
        "PITS Project Workboard",
        "Read-only functional slice",
        "Work items",
        "Work Item Detail",
        "Dry-run Action Preview",
        "No data will be changed",
        "Requires Stage 2B/2C write boundary",
        "Product User Journey UAT",
        "Testable now",
        controlPlaneOnlyText,
        "Functional gap map",
        "Next product journey",
        "runtime readiness and governance visibility for PITS",
        "Project readiness",
        "Health ready",
        "Registry Governance / Readiness",
        "Registry Runtime Health",
        "Project Installation Registry"
      ]
    ]
  ] satisfies Array<[string, RouteComponent, string[]]>)("renders the %s route shell", async (_name, Component, markers) => {
    mockCoreApiFetch();

    const html = await renderRouteHtml(Component);

    expect(html).toContain("PITS_SHELL");
    expect(html).toContain(coreApiUrl);
    expect(html).toContain("Core API healthy");
    expect(html).toContain("DEMO DATA - NOT PRODUCTION");
    expect(html).toContain("Modern Shell Layout");
    expect(html).toContain("Shell Navigation Toggle");
    expect(html).toContain("Fixed Navigation Shell");
    expect(html).toContain("Responsive Product Shell");
    expect(html).toContain("Owner-first Design System");
    expect(html).toContain("Visual Hierarchy Standard");
    expect(html).toContain("Owner-friendly Status Badges");
    expect(html).toContain('data-owner-status="Owner-friendly Status Badges"');
    for (const marker of markers) {
      expect(html).toContain(marker);
    }
    expect(html).not.toContain("Execute admin action");
    expect(html).not.toContain("Run admin action");
    expect(html).not.toContain("Apply registry fix");
    expect(html).not.toContain(dbEnvKey);
  });

  it("renders the projects route Product UAT marker contract honestly", async () => {
    mockCoreApiFetch();

    const html = await renderRouteHtml(ProjectsPage);

    expect(html).toContain("Product User Journey / UAT Baseline");
    expect(html).toContain("PITS Work Item Detail and Dry-run Action Preview");
    expect(html).toContain("writes remain blocked");
    expect(html).toContain("project registry shell");
    expect(html).toContain("project readiness shell");
  });

  it("renders without a direct database environment value", async () => {
    mockCoreApiFetch();

    await expect(renderRouteHtml(Page)).resolves.toContain("PITS Shell");
    expect(process.env[dbEnvKey]).toBeUndefined();
  });

  it("renders project detail with OIS Console cross-links", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProjectDetailPage({ params: Promise.resolve({ id: "prj_emerald_precinct_demo" }) }));

    expect(html).toContain("Project Detail Source");
    expect(html).toContain("Modern Shell Layout");
    expect(html).toContain("Shell Navigation Toggle");
    expect(html).toContain("Owner-facing project UAT summary");
    expect(html).toContain("Owner Review Queue");
    expect(html).toContain("Safe Action Boundary");
    expect(html).toContain("Action is read-only preview only");
    expect(html).toContain("Future admin action requires audit");
    expect(html).toContain("Admin Boundary");
    expect(html).toContain("Audit Required");
    expect(html).toContain("Permission Model");
    expect(html).toContain("Preview only - not executable yet");
    expect(html).toContain("Blocked in current stage");
    expect(html).toContain("Project Product UAT Baseline");
    expect(html).toContain("Product User Journey UAT");
    expect(html).toContain("Testable now");
    expect(html).toContain(controlPlaneOnlyText);
    expect(html).toContain("Functional gap map");
    expect(html).toContain("Next product journey");
    expect(html).toContain("What can be tested now?");
    expect(html).toContain("What is not implemented yet?");
    expect(html).toContain("Recommended next product functions");
    expect(html).toContain("project detail/readiness shell");
    expect(html).toContain("Future issue and task workflow");
    expect(html).toContain("PITS Project Workboard");
    expect(html).toContain("Read-only functional slice");
    expect(html).toContain("Work items");
    expect(html).toContain("Open Work Item Detail");
    expect(html).toContain("Open");
    expect(html).toContain("In progress");
    expect(html).toContain("Blocked");
    expect(html).toContain("Done");
    expect(html).toContain("Confirm site access package");
    expect(html).toContain("Resolve fire door access risk");
    expect(html).toContain("Project operator");
    expect(html).toContain("Requires Stage 2B/2C write boundary");
    expect(html).toContain("Project readiness");
    expect(html).toContain("No issue detected");
    expect(html).toContain("Project Governance / Readiness");
    expect(html).toContain("What is missing?");
    expect(html).toContain("Project Runtime Health");
    expect(html).toContain('data-detail-source="Project Detail Source"');
    expect(html).toContain("PITS_RUNTIME_SHELL");
    expect(html).toContain(`${oisPublicBaseUrl}/products/prod_pits`);
    expect(html).toContain(`${oisPublicBaseUrl}/workspaces/ws_pmc_org_demo`);
    expect(html).toContain("Cross-product staging link");
    expect(html).not.toContain("Execute admin action");
    expect(html).not.toContain("Run admin action");
    expect(html).not.toContain("Apply registry fix");
    expect(html).not.toContain("<button>Create work item");
    expect(html).not.toContain("<button>Edit work item");
    expect(html).not.toContain("<button>Change status");
    expect(html).not.toContain(dbEnvKey);
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/workboard`, { cache: "no-store" });
  });

  it("renders the project workboard read-only functional slice", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProjectWorkboardPage({ params: Promise.resolve({ id: "prj_emerald_precinct_demo" }) }));

    expect(html).toContain("PITS Project Workboard");
    expect(html).toContain("Read-only functional slice");
    expect(html).toContain("Read-only functional slice — editing is not enabled yet");
    expect(html).toContain("Work items");
    expect(html).toContain("Open Work Item Detail");
    expect(html).toContain("Open");
    expect(html).toContain("In progress");
    expect(html).toContain("Blocked");
    expect(html).toContain("Done");
    expect(html).toContain("Confirm site access package");
    expect(html).toContain("Prepare inspection walk plan");
    expect(html).toContain("Resolve fire door access risk");
    expect(html).toContain("Verify project registry links");
    expect(html).toContain("Project operator");
    expect(html).toContain("Safety lead");
    expect(html).toContain("2026-07-12");
    expect(html).toContain("Next action");
    expect(html).toContain("Critical");
    expect(html).toContain("Requires Stage 2B/2C write boundary");
    expect(html).toContain("Preview only");
    expect(html).toContain("Not executable yet");
    expect(html).not.toContain("<button>Create work item");
    expect(html).not.toContain("<button>Edit work item");
    expect(html).not.toContain("<button>Change status");
    expect(html).not.toContain(dbEnvKey);
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/workboard`, { cache: "no-store" });
  });

  it("renders the work item detail and dry-run action preview", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = renderToStaticMarkup(await WorkItemDetailPage({ params: Promise.resolve({ id: "prj_emerald_precinct_demo", itemId: workItemId }) }));

    expect(html).toContain("Work Item Detail");
    expect(html).toContain("Confirm site access package");
    expect(html).toContain("Project operator");
    expect(html).toContain("2026-07-12");
    expect(html).toContain("Validate the owner can see the first actionable project work item");
    expect(html).toContain("Dry-run Action Preview");
    expect(html).toContain("Change status preview");
    expect(html).toContain("Assign owner preview");
    expect(html).toContain("Add note preview");
    expect(html).toContain("Set priority preview");
    expect(html).toContain("Resolve blocker preview");
    expect(html).toContain("Preview only");
    expect(html).toContain("No data will be changed");
    expect(html).toContain("Requires audit trail");
    expect(html).toContain("Requires confirmation");
    expect(html).toContain("Requires rollback plan");
    expect(html).toContain("Requires future write boundary");
    expect(html).toContain("Available dry-run actions");
    expect(html).not.toContain("<button>Create work item");
    expect(html).not.toContain("<button>Edit work item");
    expect(html).not.toContain("<button>Delete work item");
    expect(html).not.toContain("<button>Change status");
    expect(html).not.toContain("<button>Assign owner");
    expect(html).not.toContain("<button>Add note");
    expect(html).not.toContain(dbEnvKey);
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/work-items/${workItemId}`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/pits/projects/prj_emerald_precinct_demo/work-items/${workItemId}/action-preview`, { cache: "no-store" });
  });

  it("renders project detail fallback for a controlled Core API 404", async () => {
    mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProjectDetailPage({ params: Promise.resolve({ id: "missing" }) }));

    expect(html).toContain("Project Not Found");
    expect(html).toContain("Project not linked yet");
    expect(html).toContain("Missing link");
    expect(html).toContain("Safe owner fallback");
    expect(html).toContain("Next step: return to the registry list");
    expect(html).not.toContain(dbEnvKey);
  });

  it("renders project workboard fallback for a controlled Core API 404", async () => {
    mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProjectWorkboardPage({ params: Promise.resolve({ id: "missing" }) }));

    expect(html).toContain("Project Workboard Unavailable");
    expect(html).toContain("Workboard not linked yet");
    expect(html).toContain("Safe owner fallback");
    expect(html).not.toContain(dbEnvKey);
  });

  it("renders work item detail fallback for a controlled Core API 404", async () => {
    mockCoreApiFetch();

    const html = renderToStaticMarkup(await WorkItemDetailPage({ params: Promise.resolve({ id: "prj_emerald_precinct_demo", itemId: "missing" }) }));

    expect(html).toContain("Work Item Detail Unavailable");
    expect(html).toContain("Work item not linked yet");
    expect(html).toContain("Safe owner fallback");
    expect(html).not.toContain(dbEnvKey);
  });
});
