import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";
import DashboardPage from "./dashboard/page";
import InstallationDetailPage from "./installations/[id]/page";
import KnowledgeFabricPage from "./knowledge-fabric/page";
import LearningCenterPage from "./learning-center/page";
import LocalizationPage from "./localization/page";
import ModuleDetailPage from "./modules/[id]/page";
import OimaPage from "./oima/page";
import ProductFlowPage from "./product-flow/page";
import ProductsPage from "./products/page";
import ProductDetailPage from "./products/[id]/page";
import RuntimePage from "./runtime/page";
import WorkspacesPage from "./workspaces/page";
import WorkspaceDetailPage from "./workspaces/[id]/page";

const coreApiUrl = "https://ois-nextgen.abacusai.cloud";
const pitsPublicBaseUrl = "https://pits-ng.dmp247.com";
const dbEnvKey = ["DATABASE", "URL"].join("_");

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
      installations: [
        {
          id: "inst_pits_emerald",
          productCode: "PITS",
          productId: "prod_pits",
          organizationId: "org_pmc_demo",
          workspaceId: "ws_pmc_org_demo",
          projectId: "prj_emerald_precinct_demo",
          project: { code: "EMERALD_PRECINCT_DEMO", name: "Emerald Precinct Demo" },
          lifecycle: "ACTIVE",
          version: 1
        }
      ]
    }
  ],
  organizations: [
    {
      id: "org_pmc_demo",
      code: "PMC_DEMO",
      name: "PMC Demo",
      lifecycle: "ACTIVE",
      version: 1,
      industry: { code: "BUILDING_MANAGEMENT", name: "Building Management" }
    }
  ],
  workspaces: [
    {
      id: "ws_pmc_org_demo",
      code: "PMC_ORG_DEMO",
      name: "PMC Org Demo",
      organizationId: "org_pmc_demo",
      lifecycle: "ACTIVE",
      version: 1,
      organization: { code: "PMC_DEMO", name: "PMC Demo" },
      projects: [
        {
          id: "prj_emerald_precinct_demo",
          code: "EMERALD_PRECINCT_DEMO",
          name: "Emerald Precinct Demo",
          workspaceId: "ws_pmc_org_demo",
          lifecycle: "ACTIVE",
          version: 1,
          installations: []
        }
      ],
      installations: [{ id: "inst_pits_emerald", productCode: "PITS", projectId: "prj_emerald_precinct_demo", lifecycle: "ACTIVE" }]
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
    }
  ],
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

const productRegistryItem = registryPayload.products[0]!;
const workspaceRegistryItem = registryPayload.workspaces[0]!;
const projectRegistryItem = registryPayload.projects[0]!;
const moduleRegistryItem = registryPayload.modules[0]!;
const installationRegistryItem = registryPayload.installations[0]!;

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
    oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
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
        oisConsoleDetail: "https://ois-ng.dmp247.com/products/prod_pits",
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ],
    workspaces: [
      healthItem("workspace", "ws_pmc_org_demo", "PMC_ORG_DEMO", "PMC Org Demo", {
        coreApiDetail: `${coreApiUrl}/platform/workspaces/ws_pmc_org_demo`,
        oisConsoleDetail: "https://ois-ng.dmp247.com/workspaces/ws_pmc_org_demo",
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ],
    projects: [
      healthItem("project", "prj_emerald_precinct_demo", "EMERALD_PRECINCT_DEMO", "Emerald Precinct Demo", {
        coreApiDetail: `${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`,
        pitsProjectDetail: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
        oisProduct: "https://ois-ng.dmp247.com/products/prod_pits",
        oisWorkspace: "https://ois-ng.dmp247.com/workspaces/ws_pmc_org_demo"
      })
    ],
    modules: [
      healthItem("module", "module_pits_runtime_shell", "PITS_RUNTIME_SHELL", "PITS_RUNTIME_SHELL", {
        coreApiDetail: `${coreApiUrl}/platform/modules/module_pits_runtime_shell`,
        oisConsoleDetail: "https://ois-ng.dmp247.com/modules/module_pits_runtime_shell",
        oisProduct: "https://ois-ng.dmp247.com/products/prod_pits"
      })
    ],
    installations: [
      healthItem("installation", "inst_pits_emerald", "PITS", "PITS installation", {
        coreApiDetail: `${coreApiUrl}/platform/installations/inst_pits_emerald`,
        oisConsoleDetail: "https://ois-ng.dmp247.com/installations/inst_pits_emerald",
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
    oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
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
        oisConsoleDetail: "https://ois-ng.dmp247.com/products/prod_pits",
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ],
    workspaces: [
      readinessItem("workspace", "ws_pmc_org_demo", "PMC_ORG_DEMO", "PMC Org Demo", {
        coreApiDetail: `${coreApiUrl}/platform/workspaces/ws_pmc_org_demo`,
        oisConsoleDetail: "https://ois-ng.dmp247.com/workspaces/ws_pmc_org_demo",
        pitsProject: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`
      })
    ],
    projects: [
      readinessItem("project", "prj_emerald_precinct_demo", "EMERALD_PRECINCT_DEMO", "Emerald Precinct Demo", {
        coreApiDetail: `${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`,
        pitsProjectDetail: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
        oisProduct: "https://ois-ng.dmp247.com/products/prod_pits",
        oisWorkspace: "https://ois-ng.dmp247.com/workspaces/ws_pmc_org_demo"
      })
    ],
    modules: [
      readinessItem("module", "module_pits_runtime_shell", "PITS_RUNTIME_SHELL", "PITS_RUNTIME_SHELL", {
        coreApiDetail: `${coreApiUrl}/platform/modules/module_pits_runtime_shell`,
        oisConsoleDetail: "https://ois-ng.dmp247.com/modules/module_pits_runtime_shell",
        oisProduct: "https://ois-ng.dmp247.com/products/prod_pits"
      })
    ],
    installations: [
      readinessItem("installation", "inst_pits_emerald", "PITS", "PITS installation", {
        coreApiDetail: `${coreApiUrl}/platform/installations/inst_pits_emerald`,
        oisConsoleDetail: "https://ois-ng.dmp247.com/installations/inst_pits_emerald",
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
    oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
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
    total: 4,
    info: 0,
    review: 4,
    warning: 0,
    blocked: 0,
    readOnlyPreview: 4,
    ownerReviewRequired: 0,
    futureAdminAction: 0,
    blockedUntilAudit: 0,
    notAllowedInStage1I: 0
  },
  items: [
    ownerReviewItem("product", "prod_pits", "PITS"),
    ownerReviewItem("workspace", "ws_pmc_org_demo", "PMC Org Demo"),
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
    oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
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
    futureAdminActions: 4,
    previewOnlyActions: 4,
    blockedActions: 7,
    auditRequired: 4,
    confirmationRequired: 4,
    rollbackRequired: 4
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
    adminBoundaryAction("product", "prod_pits", "PITS"),
    adminBoundaryAction("workspace", "ws_pmc_org_demo", "PMC Org Demo"),
    adminBoundaryAction("project", "prj_emerald_precinct_demo", "Emerald Precinct Demo"),
    adminBoundaryAction("installation", "inst_pits_emerald", "PITS installation")
  ],
  futureAdminActions: [
    adminBoundaryAction("product", "prod_pits", "PITS"),
    adminBoundaryAction("workspace", "ws_pmc_org_demo", "PMC Org Demo"),
    adminBoundaryAction("project", "prj_emerald_precinct_demo", "Emerald Precinct Demo"),
    adminBoundaryAction("installation", "inst_pits_emerald", "PITS installation")
  ]
};

const productUatPayload = {
  metadata: registryPayload.metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
    pitsShellBaseUrl: pitsPublicBaseUrl,
    uatMode: "read-only-product-user-journey-map",
    stage: "Stage 1K",
    note: "Product User Journey UAT is a read-only functional gap map. It does not enable product writes or admin actions."
  },
  productUat: {
    stage: "Stage 1K",
    mutationEndpointsAdded: false,
    writePermission: "NOT_ALLOWED_IN_STAGE_1K",
    markers: ["Product User Journey UAT", "Testable now", "Control-plane only", "Functional gap map", "Next product journey"]
  },
  summary: {
    products: 2,
    surfaces: 6,
    visiblePages: 5,
    testableNow: 4,
    realProductFunctionsAvailable: 0,
    controlPlaneOnly: 2,
    placeholderOrShellOnly: 1,
    futureProductFunctions: 1,
    blockedByMissingDataModel: 1,
    blockedByWriteBoundary: 1,
    blockedByAuthOrPermission: 0,
    needsOwnerDecision: 1
  },
  categories: [
    { category: "AVAILABLE_FOR_BROWSER_UAT", label: "Testable now", description: "Browser UAT is possible without writes." },
    { category: "PLATFORM_CONTROL_PLANE_ONLY", label: "Control-plane only", description: "Registry, runtime or administration view." },
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
      currentState: "Strong platform/control-plane foundation; true OIS end-user functions are mapped but not implemented yet.",
      ownerUatStatus: "READY_FOR_BROWSER_UAT",
      testableNow: ["OIS Console root and shell", "OIS dashboard and platform overview", "Workspace registry and workspace details"],
      controlPlaneOnly: ["OIS dashboard and platform overview", "Workspace registry and workspace details"],
      missingProductFunctions: ["Future OIS workspace/product user home"],
      recommendedNextJourneys: [
        "Define the first OIS workspace user home",
        "Choose document, meeting or knowledge as the first OIS product workflow"
      ],
      surfaces: [
        {
          id: "ois:root-shell",
          productCode: "OIS",
          productName: "OIS Console",
          surfaceName: "OIS Console root and shell",
          route: "https://ois-ng.dmp247.com/",
          entityType: "platform",
          entityId: null,
          category: "AVAILABLE_FOR_BROWSER_UAT",
          statusLabel: "Testable now",
          testableNow: true,
          realProductFunction: false,
          ownerUatStatus: "READY_FOR_BROWSER_UAT",
          currentUserTest: "Open the OIS Console root and verify shell layout, cockpit, status badges and safe staging links.",
          currentReality: "This is a platform/product administration shell, not an end-user OIS business workflow.",
          functionalGap: "True OIS workspace, document, meeting or knowledge user journeys are not implemented yet.",
          blockers: ["NEEDS_OWNER_DECISION"],
          recommendedNextStep: "Choose the first OIS end-user product journey and define acceptance checks.",
          nextUserLevelTestPath: "https://ois-ng.dmp247.com/dashboard",
          evidence: ["Modern Shell Layout", "Owner Registry Cockpit / Registry Runtime Summary"]
        },
        {
          id: "ois:dashboard",
          productCode: "OIS",
          productName: "OIS Console",
          surfaceName: "OIS dashboard and platform overview",
          route: "https://ois-ng.dmp247.com/dashboard",
          entityType: "platform",
          entityId: null,
          category: "PLATFORM_CONTROL_PLANE_ONLY",
          statusLabel: "Control-plane only",
          testableNow: true,
          realProductFunction: false,
          ownerUatStatus: "MAPPED_AS_CONTROL_PLANE",
          currentUserTest: "Verify registry health, readiness, owner review and admin boundary summaries.",
          currentReality: "The dashboard proves control-plane readiness and runtime status.",
          functionalGap: "It does not yet execute OIS user work such as meetings, documents, knowledge capture or copilot tasks.",
          blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "NEEDS_OWNER_DECISION"],
          recommendedNextStep: "Pick one user-level OIS workflow as the next product test.",
          nextUserLevelTestPath: "https://ois-ng.dmp247.com/dashboard",
          evidence: ["Registry Governance / Readiness", "Owner Review Queue", "Admin Boundary"]
        },
        {
          id: "ois:workspace-registry",
          productCode: "OIS",
          productName: "OIS Console",
          surfaceName: "Workspace registry and workspace details",
          route: "https://ois-ng.dmp247.com/workspaces/ws_pmc_org_demo",
          entityType: "workspace",
          entityId: "ws_pmc_org_demo",
          category: "PLATFORM_CONTROL_PLANE_ONLY",
          statusLabel: "Control-plane only",
          testableNow: true,
          realProductFunction: false,
          ownerUatStatus: "MAPPED_AS_CONTROL_PLANE",
          currentUserTest: "Open a workspace detail to verify tenant, workspace and project relationships.",
          currentReality: "This is workspace administration and relationship visibility.",
          functionalGap: "It does not yet provide an end-user workspace home, task stream or collaboration workflow.",
          blockers: ["BLOCKED_BY_AUTH_OR_PERMISSION", "BLOCKED_BY_MISSING_DATA_MODEL"],
          recommendedNextStep: "Define the workspace user's landing journey and required permission model.",
          nextUserLevelTestPath: "https://ois-ng.dmp247.com/workspaces/ws_pmc_org_demo",
          evidence: ["Workspace Governance / Readiness", "Workspace Runtime Health"]
        },
        {
          id: "ois:future-workspace-home",
          productCode: "OIS",
          productName: "OIS Console",
          surfaceName: "Future OIS workspace/product user home",
          route: null,
          entityType: "workspace",
          entityId: "ws_pmc_org_demo",
          category: "PLACEHOLDER_OR_SHELL_ONLY",
          statusLabel: "Placeholder or shell only",
          testableNow: false,
          realProductFunction: true,
          ownerUatStatus: "NOT_IMPLEMENTED_YET",
          currentUserTest: "No browser UAT path exists yet for a true OIS workspace user home.",
          currentReality: "Navigation and registry context exist, but the end-user workspace function does not.",
          functionalGap: "Needs concrete user stories, data model and page contract.",
          blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "NEEDS_OWNER_DECISION"],
          recommendedNextStep: "Define the first OIS workspace user journey and owner acceptance path.",
          nextUserLevelTestPath: null,
          evidence: ["Not implemented yet", "Functional gap map"]
        }
      ]
    },
    {
      productCode: "PITS",
      productName: "PITS",
      productId: "prod_pits",
      currentState: "Project registry shell and readiness shell; true project workflow app behavior is mapped but not implemented yet.",
      ownerUatStatus: "READY_FOR_BROWSER_UAT",
      testableNow: ["PITS project list", "PITS project detail"],
      controlPlaneOnly: ["PITS runtime, readiness and boundary summary"],
      missingProductFunctions: ["Future issue and task workflow"],
      recommendedNextJourneys: [
        "Define a read-only PITS issue/task list",
        "Keep project status writes disabled until audit/write boundaries are approved"
      ],
      surfaces: [
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
          currentReality: "This is testable as a project registry shell and readiness shell, not a true workflow app.",
          functionalGap: "It does not yet support issue/task creation, assignment, status updates or project workflow execution.",
          blockers: ["BLOCKED_BY_WRITE_BOUNDARY", "BLOCKED_BY_MISSING_DATA_MODEL"],
          recommendedNextStep: "Define a read-only issue/task list as the first true PITS workflow baseline.",
          nextUserLevelTestPath: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
          evidence: ["Project Selector", "Project Installation Registry"]
        },
        {
          id: "pits:future-project-status-write",
          productCode: "PITS",
          productName: "PITS",
          surfaceName: "Future project status update",
          route: `${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`,
          entityType: "installation",
          entityId: "inst_pits_emerald",
          category: "BLOCKED_BY_WRITE_BOUNDARY",
          statusLabel: "Needs write boundary",
          testableNow: false,
          realProductFunction: true,
          ownerUatStatus: "NOT_IMPLEMENTED_YET",
          currentUserTest: "No status write can be tested in Stage 1K.",
          currentReality: "Write actions remain intentionally blocked.",
          functionalGap: "Needs audit trail, confirmation, rollback and permissions before project status changes.",
          blockers: ["BLOCKED_BY_WRITE_BOUNDARY"],
          recommendedNextStep: "Keep status updates read-only until the owner approves a write-boundary stage.",
          nextUserLevelTestPath: null,
          evidence: ["Blocked in current stage", "Preview only"]
        }
      ]
    }
  ],
  recommendedNextProductJourneys: [
    "Confirm whether OIS workspace home or PITS issue/task workflow is the first true product journey.",
    "Start with read-only product workflow screens before any write/admin action."
  ]
};

const learningCenterPayload = {
  metadata: registryPayload.metadata,
  products: [
    {
      productKey: "OIS_PLATFORM",
      displayName: "OIS Platform",
      enabled: true,
      defaultLearningScope: "PLATFORM"
    },
    {
      productKey: "PITS",
      displayName: "PITS",
      enabled: true,
      defaultLearningScope: "ORGANIZATION"
    }
  ],
  overview: {
    totalSignals: 2,
    pendingCandidates: 1,
    autoLearnedLogs: 1,
    rejectedOrIgnored: 0,
    policyCount: 2
  },
  learningStream: [
    {
      id: "learning_signal_widget",
      productKey: "OIS_PLATFORM",
      sourceAuthority: "END_USER",
      learningScope: "ORGANIZATION",
      signalType: "USER_CORRECTION",
      normalizedText: "The project nickname should be Emerald Precinct.",
      confidenceInitial: 0.35,
      status: "RECEIVED",
      createdAt: "2026-07-09T00:00:00.000Z"
    }
  ],
  pendingReview: [
    {
      id: "learning_candidate_exec",
      signalId: "learning_signal_exec",
      productKey: "OIS_PLATFORM",
      candidateType: "STRATEGIC_PRIORITY",
      title: "STRATEGIC PRIORITY candidate",
      summary: "CEO directive: prioritize legal risk review.",
      sourceAuthority: "CEO",
      confidenceScore: 0.8,
      conflictStatus: "NO_CONFLICT",
      policyDecision: "ASK_REVIEW",
      status: "PENDING_REVIEW",
      createdAt: "2026-07-09T00:00:00.000Z"
    }
  ],
  learningPolicies: [
    {
      id: "learning_policy_ois_platform_ceo",
      productKey: "OIS_PLATFORM",
      learningScope: "PLATFORM",
      signalType: "STRATEGIC_INTENT",
      sourceAuthority: "CEO",
      policyMode: "ALWAYS_ASK",
      confidenceThreshold: 0.9,
      enabled: true
    }
  ],
  executiveIntentQueue: [
    {
      id: "learning_candidate_exec",
      signalId: "learning_signal_exec",
      productKey: "OIS_PLATFORM",
      candidateType: "STRATEGIC_PRIORITY",
      title: "STRATEGIC PRIORITY candidate",
      summary: "CEO directive: prioritize legal risk review.",
      sourceAuthority: "CEO",
      confidenceScore: 0.8,
      conflictStatus: "NO_CONFLICT",
      policyDecision: "ASK_REVIEW",
      status: "PENDING_REVIEW",
      createdAt: "2026-07-09T00:00:00.000Z"
    }
  ],
  productContributionMap: [
    { productKey: "OIS_PLATFORM", signalCount: 1, candidateCount: 1 },
    { productKey: "PITS", signalCount: 1, candidateCount: 0 }
  ],
  auditLogPlaceholder: {
    mode: "existing-audit-records",
    note: "Learning writes create AuditRecord entries; Stage 2F UI shows this placeholder until a dedicated audit stream filter is added."
  },
  accessGuard: {
    requiredRole: "SUPERADMIN_OR_ADMIN",
    currentStageMode: "READ_ONLY_PREVIEW_WITH_API_ROLE_CHECKS",
    limitation: "No session middleware exists yet, so SuperAdmin enforcement is documented and mutation endpoints require explicit admin role payloads."
  }
};

const knowledgeBoundary = {
  stage: "Stage 2G",
  mode: "deterministic-knowledge-fabric-foundation",
  canonicalWriteEndpointsAdded: false,
  autoPromotionEnabled: false,
  widgetDirectCanonicalWriteAllowed: false
};

const knowledgeLayerKeys = [
  "KL_0_LEGAL_REGULATORY_CORE",
  "KL_1_INDUSTRY_CORE",
  "KL_2_ORGANIZATION_CORE",
  "KL_3_PRODUCT_KNOWLEDGE_PACK",
  "KL_4_WORKSPACE_PROJECT_OVERLAY",
  "KL_5_LIVE_OPERATIONAL_SIGNALS"
];

const knowledgeLayersPayload = {
  metadata: registryPayload.metadata,
  boundary: knowledgeBoundary,
  layerKeys: knowledgeLayerKeys,
  layers: [
    {
      key: "KL_0_LEGAL_REGULATORY_CORE",
      order: 0,
      displayName: "Legal / Regulatory Core",
      description: "Laws, regulations and compliance references requiring strong approval.",
      examples: ["legal regulation"],
      evidenceRequirement: "STRONG_APPROVAL_REQUIRED",
      autoPromotionAllowedInStage2G: false
    },
    {
      key: "KL_1_INDUSTRY_CORE",
      order: 1,
      displayName: "Industry Core",
      description: "Industry practices, benchmarks and anonymized playbooks.",
      examples: ["handover best practice"],
      evidenceRequirement: "EVIDENCE_REQUIRED",
      autoPromotionAllowedInStage2G: false
    },
    {
      key: "KL_2_ORGANIZATION_CORE",
      order: 2,
      displayName: "Organization Core",
      description: "Organization policies, executive intent and authority model.",
      examples: ["CEO directive"],
      evidenceRequirement: "STRONG_APPROVAL_REQUIRED",
      autoPromotionAllowedInStage2G: false
    },
    {
      key: "KL_3_PRODUCT_KNOWLEDGE_PACK",
      order: 3,
      displayName: "Product Knowledge Pack",
      description: "Product-specific knowledge packs for Powered by OIS products.",
      examples: ["KEIHB handbook pack"],
      evidenceRequirement: "EVIDENCE_REQUIRED",
      autoPromotionAllowedInStage2G: false
    },
    {
      key: "KL_4_WORKSPACE_PROJECT_OVERLAY",
      order: 4,
      displayName: "Workspace / Project Overlay",
      description: "Workspace, project and local exception overlays.",
      examples: ["project SOP"],
      evidenceRequirement: "EVIDENCE_REQUIRED",
      autoPromotionAllowedInStage2G: false
    },
    {
      key: "KL_5_LIVE_OPERATIONAL_SIGNALS",
      order: 5,
      displayName: "Live Operational Signals",
      description: "Live operational signals that are not canonical truth by themselves.",
      examples: ["agent correction"],
      evidenceRequirement: "SIGNAL_ONLY",
      autoPromotionAllowedInStage2G: false
    }
  ],
  productConsumptionMap: [
    {
      productKey: "OIS_PLATFORM",
      consumesLayers: knowledgeLayerKeys,
      contributesToLayers: ["KL_2_ORGANIZATION_CORE", "KL_5_LIVE_OPERATIONAL_SIGNALS"],
      role: "Canonical owner and control-plane reader"
    },
    {
      productKey: "KEIHB",
      consumesLayers: ["KL_0_LEGAL_REGULATORY_CORE", "KL_1_INDUSTRY_CORE", "KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK"],
      contributesToLayers: ["KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_5_LIVE_OPERATIONAL_SIGNALS"],
      role: "Knowledge publishing product / handbook projection"
    },
    {
      productKey: "PITS",
      consumesLayers: ["KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_4_WORKSPACE_PROJECT_OVERLAY"],
      contributesToLayers: ["KL_4_WORKSPACE_PROJECT_OVERLAY", "KL_5_LIVE_OPERATIONAL_SIGNALS"],
      role: "Project runtime consumer and operational signal contributor"
    }
  ]
};

const knowledgeItemsPayload = {
  metadata: registryPayload.metadata,
  boundary: knowledgeBoundary,
  summary: {
    totalItems: 2,
    activeItems: 1,
    draftItems: 1,
    byLayer: knowledgeLayersPayload.layers.map((layer) => ({
      layerKey: layer.key,
      displayName: layer.displayName,
      count: layer.key === "KL_3_PRODUCT_KNOWLEDGE_PACK" || layer.key === "KL_4_WORKSPACE_PROJECT_OVERLAY" ? 1 : 0
    }))
  },
  items: [
    {
      id: "knowledge_item_kl3_keihb_sop_pack_demo",
      layerKey: "KL_3_PRODUCT_KNOWLEDGE_PACK",
      scope: "ORGANIZATION",
      itemType: "SOP",
      title: "Demo KEIHB SOP publishing pack",
      summary: "KEIHB publishes approved OIS Knowledge Fabric items as handbook, SOP, playbook and FAQ bundles.",
      status: "DRAFT",
      version: 1,
      locale: "en",
      organizationId: "org_pmc_demo",
      workspaceId: "ws_pmc_org_demo",
      industryCode: "BUILDING_MANAGEMENT",
      productKey: "KEIHB",
      sensitivityLevel: "MEDIUM",
      confidenceScore: 0.7,
      sourceAuthority: "SUPERADMIN",
      createdFromCandidateId: null
    },
    {
      id: "knowledge_item_kl4_emerald_overlay_demo",
      layerKey: "KL_4_WORKSPACE_PROJECT_OVERLAY",
      scope: "ORGANIZATION",
      itemType: "WORKSPACE_OVERLAY",
      title: "Demo Emerald Precinct local overlay",
      summary: "Project-specific operating notes remain overlays and do not become industry truth.",
      status: "ACTIVE",
      version: 1,
      locale: "en",
      organizationId: "org_pmc_demo",
      workspaceId: "ws_pmc_org_demo",
      industryCode: null,
      productKey: "PITS",
      sensitivityLevel: "LOW",
      confidenceScore: 0.74,
      sourceAuthority: "ADMIN",
      createdFromCandidateId: null
    }
  ]
};

const knowledgeEvidencePayload = {
  metadata: registryPayload.metadata,
  boundary: knowledgeBoundary,
  summary: {
    totalLinks: 2,
    itemLinks: 1,
    candidateLinks: 1
  },
  evidenceLinks: [
    {
      id: "knowledge_evidence_stage_2g_regulatory_demo",
      knowledgeItemId: "knowledge_item_kl3_keihb_sop_pack_demo",
      learningCandidateId: null,
      sourceType: "DOCUMENT",
      sourceRef: "demo://stage-2g/regulatory-reference",
      sourceTitle: "Demo regulatory reference",
      excerpt: "Regulatory knowledge requires strong evidence and approval before publication.",
      excerptHash: "stage2g-regulatory-demo",
      evidenceWeight: 0.9,
      sourceAuthority: "SUPERADMIN"
    },
    {
      id: "knowledge_evidence_stage_2g_keihb_candidate_demo",
      knowledgeItemId: null,
      learningCandidateId: "learning_candidate_stage_2g_keihb_sop_demo",
      sourceType: "WIDGET",
      sourceRef: "learning_signal_stage_2g_keihb_sop_demo",
      sourceTitle: "Demo KEIHB SOP learning signal",
      excerpt: "Publish approved building operations SOPs through KEIHB bundles after review.",
      excerptHash: "stage2g-keihb-candidate-demo",
      evidenceWeight: 0.72,
      sourceAuthority: "SUPERADMIN"
    }
  ]
};

const knowledgeMappingsPayload = {
  metadata: registryPayload.metadata,
  boundary: knowledgeBoundary,
  mappings: [
    {
      id: "knowledge_mapping_stage_2g_keihb_sop_demo",
      learningCandidateId: "learning_candidate_stage_2g_keihb_sop_demo",
      targetLayerKey: "KL_3_PRODUCT_KNOWLEDGE_PACK",
      targetItemType: "SOP",
      proposedAction: "CREATE",
      proposedTitle: "Demo KEIHB SOP bundle candidate",
      proposedSummary: "Map the KEIHB SOP learning candidate to a future product knowledge pack review.",
      affectedProducts: ["OIS_PLATFORM", "KEIHB", "PITS"],
      confidenceScore: 0.72,
      policyDecision: "ASK_REVIEW",
      status: "READY_FOR_REVIEW"
    }
  ]
};

const keihbBundlesPayload = {
  metadata: registryPayload.metadata,
  boundary: knowledgeBoundary,
  projectionBoundary: {
    sourceOfTruth: "OIS Knowledge Fabric",
    productKey: "KEIHB",
    publishingOnly: true,
    canonicalWriteAllowed: false
  },
  bundles: [
    {
      id: "knowledge_bundle_keihb_building_management_handbook_demo",
      bundleKey: "KEIHB_BUILDING_MANAGEMENT_HANDBOOK_DEMO",
      displayName: "KEIHB Building Management Handbook Demo",
      productKey: "KEIHB",
      targetAudience: "Building management team",
      role: "BQL",
      locale: "en",
      includedLayerKeys: ["KL_0_LEGAL_REGULATORY_CORE", "KL_1_INDUSTRY_CORE", "KL_2_ORGANIZATION_CORE"],
      includedItemIds: ["knowledge_item_kl3_keihb_sop_pack_demo"],
      snapshotVersion: 1,
      status: "DRAFT"
    },
    {
      id: "knowledge_bundle_keihb_bql_sop_demo",
      bundleKey: "KEIHB_BQL_SOP_DEMO",
      displayName: "KEIHB BQL SOP Demo",
      productKey: "KEIHB",
      targetAudience: "BQL",
      role: "BQL",
      locale: "en",
      includedLayerKeys: ["KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_4_WORKSPACE_PROJECT_OVERLAY"],
      includedItemIds: ["knowledge_item_kl3_keihb_sop_pack_demo", "knowledge_item_kl4_emerald_overlay_demo"],
      snapshotVersion: 1,
      status: "DRAFT"
    }
  ]
};

const knowledgeContextPayload = {
  metadata: registryPayload.metadata,
  mode: "deterministic-knowledge-context",
  noLlmCall: true,
  noCanonicalWrite: true,
  readContract: {
    productKey: "OIS_PLATFORM",
    organizationId: "org_pmc_demo",
    workspaceId: "ws_pmc_org_demo",
    includeEvidence: true,
    includeDrafts: true
  },
  layers: knowledgeLayersPayload.layers.slice(2, 4),
  items: knowledgeItemsPayload.items,
  evidenceLinks: knowledgeEvidencePayload.evidenceLinks,
  boundary: {
    agentReadPath: true,
    agentLearningPath: "Teach OIS still creates Learning Signal only.",
    autoPromotionEnabled: false
  }
};

const architectureMindmapPayload = {
  metadata: registryPayload.metadata,
  boundary: knowledgeBoundary,
  mindmap: {
    manifestVersion: "1.0",
    stage: "Stage 2H",
    title: "OIS Ecosystem Architecture Map",
    oisCoreLayers: ["Platform Kernel", "Product Registry", "OIS Agent Runtime", "Canonical Knowledge Fabric"],
    ecosystemProducts: ["OIS_PLATFORM", "PITS", "OIMA", "KEIHB", "ICR", "CSAGENT"],
    knowledgeLayers: knowledgeLayersPayload.layers.map((layer) => ({
      key: layer.key,
      displayName: layer.displayName,
      order: layer.order,
      evidenceRequirement: layer.evidenceRequirement
    })),
    flows: [
      {
        key: "stage_2f_learning_flow",
        label: "Stage 2F Learning Intake",
        nodes: ["OIS Agent Widget", "Learning Signal", "Learning Candidate", "Policy Decision", "Review / Auto-log"]
      },
      {
        key: "stage_2g_knowledge_fabric_flow",
        label: "Stage 2G Knowledge Fabric",
        nodes: ["Knowledge Layer Mapping", "Canonical Knowledge Item", "Evidence Link", "Universal Knowledge API", "KEIHB Projection Bundle"]
      },
      {
        key: "stage_2h_oima_boundary_flow",
        label: "Stage 2H OIMA Product Boundary",
        nodes: ["OIMA Meeting Shell", "Transcript-first Intake", "Universal Knowledge API", "OIS Agent Offline Analysis", "Learning Governance Review"]
      }
    ],
    apiContracts: [
      "/platform/knowledge/layers",
      "/platform/knowledge/items",
      "/platform/knowledge/context",
      "/platform/learning/layer-mappings",
      "/platform/knowledge/keihb/bundles",
      "/platform/agent/knowledge-context",
      "/platform/oima/overview",
      "/platform/architecture/mindmap"
    ],
    governanceCheckpoints: [
      "No widget direct canonical write",
      "No auto-promotion in Stage 2G",
      "OIMA is not a separate knowledge silo",
      "Evidence required for canonical claims",
      "KEIHB is projection/publishing product only"
    ]
  },
  source: {
    file: "architecture/mindmap/ois-ecosystem-map.v1.json",
    mode: "machine-readable-manifest"
  }
};

const oimaSourceModeContracts = [
  {
    mode: "TRANSCRIPT_ONLY",
    primary: true,
    transcriptRequired: true,
    audioRequired: false,
    listenerMode: false,
    status: "PRIMARY_STAGE_2H_FOUNDATION",
    description: "Primary OIMA foundation. Meeting analysis must work from a transcript without audio."
  },
  {
    mode: "AUDIO_ONLY",
    primary: false,
    transcriptRequired: false,
    audioRequired: true,
    listenerMode: false,
    status: "FUTURE_ENRICHMENT",
    description: "Future audio intake may derive or enrich transcript evidence."
  },
  {
    mode: "TRANSCRIPT_AND_AUDIO",
    primary: false,
    transcriptRequired: true,
    audioRequired: false,
    listenerMode: false,
    status: "FUTURE_ENRICHMENT",
    description: "Future combined mode may improve speaker confidence."
  },
  {
    mode: "LISTENER_CAPTURED",
    primary: false,
    transcriptRequired: false,
    audioRequired: true,
    listenerMode: true,
    status: "FUTURE_ONLY",
    description: "Future Listener Mode is limited to listen, record and analyze."
  }
];

const oimaPayload = {
  metadata: registryPayload.metadata,
  boundary: {
    stage: "Stage 2H",
    hardeningStage: "Stage 2I / OIMA-0",
    implementationStatus: "PRODUCT_BOUNDARY_READY",
    productShellStatus: "PRODUCT_SHELL_HARDENED",
    mode: "deterministic-oima-product-boundary",
    transcriptFirst: true,
    audioOptional: true,
    listenerModeStatus: "FUTURE_ONLY",
    realLlmCallsEnabled: false,
    uploadPipelineImplemented: false,
    meetingStorageImplemented: false,
    noLiveSpeakingAgent: true,
    noVoiceClone: true,
    noImpersonation: true,
    noAutonomousDecision: true,
    noSeparateKnowledgeSourceOfTruth: true
  },
  productShell: {
    stage: "Stage 2I / OIMA-0",
    status: "PRODUCT_SHELL_HARDENED",
    nextRecommendedStage: "OIMA-1 Meeting Intake",
    meetingRuntimeDataIncluded: false,
    uploadRuntimeImplemented: false,
    transcriptProcessingImplemented: false,
    audioProcessingImplemented: false,
    listenerModeImplemented: false,
    liveSpeakingAgentImplemented: false,
    voiceCloneImplemented: false,
    realLlmCallsEnabled: false
  },
  productBoundaryMetadata: {
    stage: "Stage 2I / OIMA-0",
    sourceReadyStage: "Stage 2H",
    productCode: "OIMA",
    productName: "Organizational Intelligence Meeting Agent",
    poweredBy: "OIS",
    sourceModes: ["TRANSCRIPT_ONLY", "AUDIO_ONLY", "TRANSCRIPT_AND_AUDIO", "LISTENER_CAPTURED"],
    currentRuntimeCapabilities: ["OVERVIEW", "PRODUCT_BOUNDARY", "KNOWLEDGE_API_LINKAGE"],
    plannedRuntimeCapabilities: [
      "MEETING_INTAKE",
      "TRANSCRIPT_PROCESSING",
      "AUDIO_PROCESSING",
      "OFFLINE_AGENT_ANALYSIS",
      "SUBJECT_CLARIFICATION",
      "SELF_IMPROVEMENT",
      "LISTENER_MODE"
    ]
  },
  productCode: "OIMA",
  productKey: "OIMA",
  productName: "Organizational Intelligence Meeting Agent",
  displayName: "OIMA — Organizational Intelligence Meeting Agent",
  productType: "MEETING_INTELLIGENCE_PRODUCT",
  implementationStatus: "PRODUCT_BOUNDARY_READY",
  poweredBy: "OIS",
  tagline: "OIS understands the organization. OIMA understands the meeting.",
  vietnamesePositioning: "OIS hiểu tổ chức. OIMA hiểu cuộc họp.",
  capabilityCodes: [
    "MEETING_LIBRARY",
    "MEETING_INTAKE",
    "TRANSCRIPT_FIRST_PIPELINE",
    "AUDIO_OPTIONAL_ENRICHMENT",
    "MEETING_TRANSCRIPT_PROCESSING",
    "OFFLINE_MEETING_ANALYSIS",
    "SUBJECT_CLARIFICATION",
    "DECISION_ACTION_RISK_EXTRACTION",
    "MEETING_DASHBOARD",
    "MONTHLY_OPERATING_REPORT",
    "MEETING_SELF_IMPROVEMENT_REVIEW",
    "LISTENER_MODE_FUTURE"
  ],
  currentRuntimeCapabilities: ["OVERVIEW", "PRODUCT_BOUNDARY", "KNOWLEDGE_API_LINKAGE"],
  plannedRuntimeCapabilities: [
    "MEETING_INTAKE",
    "TRANSCRIPT_PROCESSING",
    "AUDIO_PROCESSING",
    "OFFLINE_AGENT_ANALYSIS",
    "SUBJECT_CLARIFICATION",
    "SELF_IMPROVEMENT",
    "LISTENER_MODE"
  ],
  sourceModes: ["TRANSCRIPT_ONLY", "AUDIO_ONLY", "TRANSCRIPT_AND_AUDIO", "LISTENER_CAPTURED"],
  sourceModeContracts: oimaSourceModeContracts,
  sourceModeRules: {
    primarySourceMode: "TRANSCRIPT_ONLY",
    transcriptFirst: true,
    audioOptional: true,
    transcriptOnlyWorksWithoutAudio: true,
    audioDoesNotBlockAnalysis: true,
    listenerModeFutureOnly: true
  },
  meetingStatuses: ["DRAFT", "INTAKE_READY", "TRANSCRIPT_UPLOADED", "PROCESSING_READY", "ANALYSIS_READY"],
  analysisModes: ["OFFLINE_ANALYSIS", "LISTENER_CAPTURED_ANALYSIS_FUTURE"],
  safetyBoundaries: [
    "NO_LIVE_SPEAKING_AGENT",
    "NO_VOICE_CLONE",
    "NO_IMPERSONATION",
    "NO_AUTONOMOUS_DECISION",
    "TRANSCRIPT_FIRST_AUDIO_OPTIONAL"
  ],
  coreReuseMap: {
    workspace: "OIS Core Workspace",
    rbac: "OIS Core RBAC / future permission model",
    canonicalEntities: "OIS Core Canonical Entity Registry",
    knowledgeFabric: "OIS Canonical Knowledge Fabric KL-0 to KL-5",
    universalKnowledgeApi: "OIS Universal Knowledge API",
    agentRuntime: "OIS Agent Runtime deterministic/offline analysis boundary",
    learningGovernance: "OIS Learning Signal / Candidate / Policy / Audit",
    audit: "OIS audit trail for sensitive future writes",
    meetingProductUx: "OIMA-owned meeting product experience"
  },
  ownedUxSurfaces: [
    "Meeting Library",
    "Upload Meeting",
    "Transcript processing",
    "Optional audio/voice recorder processing",
    "OIS Agent offline meeting analysis",
    "Subject clarification",
    "Decision/action/risk extraction",
    "Meeting dashboard",
    "Monthly operating report",
    "Self-improvement review",
    "Listener Mode future"
  ],
  emptyStateSurfaces: [
    {
      surfaceCode: "MEETING_LIBRARY",
      title: "Meeting Library",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-1",
      statusLabel: "Planned for OIMA-1 Meeting Intake",
      description: "Future meeting library shell. No meeting records are created or listed in OIMA-0."
    },
    {
      surfaceCode: "UPLOAD_MEETING",
      title: "Upload Meeting",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-1",
      statusLabel: "Planned for OIMA-1 Meeting Intake",
      description: "Future transcript-first intake surface. Upload storage and parsing are not enabled in OIMA-0."
    },
    {
      surfaceCode: "AGENT_ANALYSIS",
      title: "Agent Analysis",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-3",
      statusLabel: "Planned for offline analysis",
      description: "Future evidence-backed OIS Agent analysis. No LLM or OpenRouter calls are enabled in OIMA-0."
    },
    {
      surfaceCode: "CLARIFICATION_REVIEW",
      title: "Clarification Review",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-4",
      statusLabel: "Planned for subject clarification",
      description: "Future review queue for ambiguous subjects, owners and meeting context."
    },
    {
      surfaceCode: "DASHBOARD",
      title: "Dashboard",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-5",
      statusLabel: "Planned for meeting dashboards",
      description: "Future meeting dashboard and monthly operating report surface."
    },
    {
      surfaceCode: "SELF_IMPROVEMENT_CENTER",
      title: "Self-Improvement Center",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-6",
      statusLabel: "Planned for reviewed learning",
      description: "Future reviewed learning loop. It will not auto-promote meeting signals to canonical knowledge."
    },
    {
      surfaceCode: "LISTENER_MODE",
      title: "Listener Mode",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-9",
      statusLabel: "Future permissioned recording only",
      description: "Future listener may record meetings with permission. Live speaking and voice clone remain out of scope."
    }
  ],
  knowledgeIntegration: {
    sourceOfTruth: "OIS Canonical Knowledge Fabric",
    knowledgeLayerTaxonomy: knowledgeLayersPayload,
    universalKnowledgeApi: "/platform/knowledge/context",
    noSeparateKnowledgeSourceOfTruth: true
  },
  roadmap: [
    { stage: "OIMA-0", phase: "Stage 2I", status: "PRODUCT_SHELL_HARDENED", title: "Product Shell & Boundary Hardening", scope: "Stable OIMA product shell." },
    { stage: "OIMA-1", phase: "Next", status: "PLANNED", title: "Meeting Intake", scope: "Versioned schema and transcript artifacts." },
    { stage: "OIMA-2", phase: "Stage 2J", status: "PLANNED", title: "Transcript Processing", scope: "Transcript-first deterministic contracts." },
    { stage: "OIMA-3", phase: "Future", status: "PLANNED", title: "OIS Agent Offline Analysis", scope: "Evidence-backed offline analysis." },
    { stage: "OIMA-4", phase: "Future", status: "PLANNED", title: "Subject Clarification", scope: "Clarification workflow." },
    { stage: "OIMA-5", phase: "Future", status: "PLANNED", title: "Dashboard & Monthly Report", scope: "Meeting dashboard and monthly operating report." },
    { stage: "OIMA-6", phase: "Future", status: "PLANNED", title: "Self-Improvement Review", scope: "Reviewed learning candidates only." },
    { stage: "OIMA-7", phase: "Future", status: "PLANNED", title: "Optional Audio Intelligence", scope: "Optional audio enrichment." },
    { stage: "OIMA-8", phase: "Future", status: "PLANNED", title: "Voice Sample Speaker Identity", scope: "Future governed speaker identity." },
    { stage: "OIMA-9", phase: "Future", status: "PLANNED", title: "Listener Mode", scope: "Future listen/record/analyze only." }
  ],
  outOfScope: ["Real meeting upload", "Transcript storage/parser", "Audio ingestion or speaker identity"],
  noCanonicalKnowledgeWrite: true,
  autoPromotionEnabled: false,
  oisAgentWidgetDirectCanonicalWriteAllowed: false
};

const productDetailPayload = {
  metadata: registryPayload.metadata,
  product: {
    ...productRegistryItem,
    relationships: {
      modules: registryPayload.modules,
      installations: registryPayload.installations,
      projects: registryPayload.projects,
      workspaces: registryPayload.workspaces
    }
  }
};

const workspaceDetailPayload = {
  metadata: registryPayload.metadata,
  workspace: {
    ...workspaceRegistryItem,
    relationships: {
      organization: workspaceRegistryItem.organization,
      projects: registryPayload.projects,
      products: registryPayload.products,
      modules: registryPayload.modules,
      installations: workspaceRegistryItem.installations
    }
  }
};

const moduleDetailPayload = {
  metadata: registryPayload.metadata,
  module: {
    ...moduleRegistryItem,
    relationships: {
      product: productRegistryItem,
      installations: registryPayload.installations
    }
  }
};

const installationDetailPayload = {
  metadata: registryPayload.metadata,
  installation: {
    ...installationRegistryItem,
    relationships: {
      product: productRegistryItem,
      project: projectRegistryItem,
      workspace: workspaceRegistryItem,
      modules: registryPayload.modules
    }
  }
};

type RouteComponent = () => Promise<ReactElement>;

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json" }
  });
}

function mockCoreApiFetch(overrides?: {
  registryHealth?: unknown;
  registryReadiness?: unknown;
  ownerReview?: unknown;
  adminBoundary?: unknown;
  productUat?: unknown;
  learningCenter?: unknown;
  knowledgeLayers?: unknown;
  knowledgeItems?: unknown;
  knowledgeEvidence?: unknown;
  knowledgeMappings?: unknown;
  keihbBundles?: unknown;
  knowledgeContext?: unknown;
  architectureMindmap?: unknown;
  oimaOverview?: unknown;
  oimaSourceModes?: unknown;
  oimaRoadmap?: unknown;
  oimaBoundary?: unknown;
}) {
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
      return jsonResponse(overrides?.registryHealth ?? registryHealthPayload);
    }

    if (url === `${coreApiUrl}/platform/registry/readiness`) {
      return jsonResponse(overrides?.registryReadiness ?? registryReadinessPayload);
    }

    if (url === `${coreApiUrl}/platform/owner-review`) {
      return jsonResponse(overrides?.ownerReview ?? ownerReviewPayload);
    }

    if (url === `${coreApiUrl}/platform/admin-boundary`) {
      return jsonResponse(overrides?.adminBoundary ?? adminBoundaryPayload);
    }

    if (url === `${coreApiUrl}/platform/product-uat`) {
      return jsonResponse(overrides?.productUat ?? productUatPayload);
    }

    if (url === `${coreApiUrl}/platform/learning/center`) {
      return jsonResponse(overrides?.learningCenter ?? learningCenterPayload);
    }

    if (url === `${coreApiUrl}/platform/knowledge/layers`) {
      return jsonResponse(overrides?.knowledgeLayers ?? knowledgeLayersPayload);
    }

    if (url === `${coreApiUrl}/platform/knowledge/items`) {
      return jsonResponse(overrides?.knowledgeItems ?? knowledgeItemsPayload);
    }

    if (url === `${coreApiUrl}/platform/knowledge/evidence`) {
      return jsonResponse(overrides?.knowledgeEvidence ?? knowledgeEvidencePayload);
    }

    if (url === `${coreApiUrl}/platform/learning/layer-mappings`) {
      return jsonResponse(overrides?.knowledgeMappings ?? knowledgeMappingsPayload);
    }

    if (url === `${coreApiUrl}/platform/knowledge/keihb/bundles`) {
      return jsonResponse(overrides?.keihbBundles ?? keihbBundlesPayload);
    }

    if (url === `${coreApiUrl}/platform/knowledge/context?productKey=OIS_PLATFORM&includeDrafts=true&includeEvidence=true`) {
      return jsonResponse(overrides?.knowledgeContext ?? knowledgeContextPayload);
    }

    if (url === `${coreApiUrl}/platform/architecture/mindmap`) {
      return jsonResponse(overrides?.architectureMindmap ?? architectureMindmapPayload);
    }

    if (url === `${coreApiUrl}/platform/oima/overview`) {
      return jsonResponse(overrides?.oimaOverview ?? oimaPayload);
    }

    if (url === `${coreApiUrl}/platform/oima/source-modes`) {
      return jsonResponse(overrides?.oimaSourceModes ?? oimaPayload);
    }

    if (url === `${coreApiUrl}/platform/oima/roadmap`) {
      return jsonResponse(overrides?.oimaRoadmap ?? oimaPayload);
    }

    if (url === `${coreApiUrl}/platform/oima/boundary`) {
      return jsonResponse(overrides?.oimaBoundary ?? oimaPayload);
    }

    if (url === `${coreApiUrl}/platform/products/prod_pits`) {
      return jsonResponse(productDetailPayload);
    }

    if (url === `${coreApiUrl}/platform/products/missing`) {
      return jsonResponse({ metadata: registryPayload.metadata, error: { code: "NOT_FOUND", message: "product not found" } }, 404);
    }

    if (url === `${coreApiUrl}/platform/workspaces/ws_pmc_org_demo`) {
      return jsonResponse(workspaceDetailPayload);
    }

    if (url === `${coreApiUrl}/platform/modules/module_pits_runtime_shell`) {
      return jsonResponse(moduleDetailPayload);
    }

    if (url === `${coreApiUrl}/platform/installations/inst_pits_emerald`) {
      return jsonResponse(installationDetailPayload);
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

describe("OIS Console product shell", () => {
  const previousCoreApiUrl = process.env.CORE_API_URL;
  const previousNextPublicCoreApiUrl = process.env.NEXT_PUBLIC_CORE_API_URL;
  const previousPitsPublicBaseUrl = process.env.PITS_PUBLIC_BASE_URL;
  const previousDbEnv = process.env[dbEnvKey];

  beforeEach(() => {
    process.env.CORE_API_URL = coreApiUrl;
    process.env.PITS_PUBLIC_BASE_URL = pitsPublicBaseUrl;
    delete process.env.NEXT_PUBLIC_CORE_API_URL;
    delete process.env[dbEnvKey];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreEnv("CORE_API_URL", previousCoreApiUrl);
    restoreEnv("NEXT_PUBLIC_CORE_API_URL", previousNextPublicCoreApiUrl);
    restoreEnv("PITS_PUBLIC_BASE_URL", previousPitsPublicBaseUrl);
    restoreEnv(dbEnvKey, previousDbEnv);
  });

  it("renders the root navigation baseline with Core API health and seeded counts", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = await renderRouteHtml(Page);

    expect(html).toContain("OIS Console");
    expect(html).toContain("OIS_CONSOLE");
    expect(html).toContain("Product Administration Overview");
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
    expect(html).toContain("Localization Foundation");
    expect(html).toContain("Language Settings");
    expect(html).toContain("English");
    expect(html).toContain("Tiếng Việt");
    expect(html).toContain("What this is");
    expect(html).toContain("Hide nav");
    expect(html).toContain("Menu");
    expect(html).toContain('aria-label="OIS Console navigation"');
    expect(html).toContain("Owner Registry Cockpit / Registry Runtime Summary");
    expect(html).toContain("Missing runtime URL");
    expect(html).toContain("Forbidden link guard");
    expect(html).toContain("Ready to operate");
    expect(html).toContain("Product User Journey UAT Baseline");
    expect(html).toContain("Product User Journey UAT");
    expect(html).toContain("Testable now");
    expect(html).toContain("Control-plane only");
    expect(html).toContain("Functional gap map");
    expect(html).toContain("Next product journey");
    expect(html).toContain("What can be tested now?");
    expect(html).toContain("What is platform/control-plane only?");
    expect(html).toContain("What is not implemented yet?");
    expect(html).toContain("Recommended next product functions");
    expect(html).toContain("Owner UAT status");
    expect(html).toContain("Next user-level test path");
    expect(html).toContain("Dashboard");
    expect(html).toContain("Product Flow");
    expect(html).toContain("Products");
    expect(html).toContain("Workspaces");
    expect(html).toContain("Learning");
    expect(html).toContain("Knowledge");
    expect(html).toContain("Runtime");
    expect(html).toContain(coreApiUrl);
    expect(html).toContain("Core API healthy");
    expect(html).toContain("bootstrap-stage-a");
    expect(html).toContain("DEMO DATA - NOT PRODUCTION");
    expect(html).toContain("DB-backed demo data is accessed only through the Core API.");
    expect(html).not.toContain(dbEnvKey);

    expect(html).toMatch(/Industries<\/span><strong>1<\/strong>/);
    expect(html).toMatch(/Organizations<\/span><strong>1<\/strong>/);
    expect(html).toMatch(/Workspaces<\/span><strong>1<\/strong>/);
    expect(html).toMatch(/Projects<\/span><strong>2<\/strong>/);
    expect(html).toMatch(/Products<\/span><strong>5<\/strong>/);
    expect(html).toMatch(/Installations<\/span><strong>2<\/strong>/);
    expect(html).toMatch(/Modules<\/span><strong>3<\/strong>/);
    expect(html).toMatch(/Audit Records<\/span><strong>1<\/strong>/);

    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/health`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/overview`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/registry`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/registry/health`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/registry/readiness`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/owner-review`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/admin-boundary`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/product-uat`, { cache: "no-store" });
  });

  it("keeps the root Ready to operate marker when the cockpit needs owner review", async () => {
    mockCoreApiFetch({
      registryHealth: {
        ...registryHealthPayload,
        summary: {
          ...registryHealthPayload.summary,
          status: "Degraded",
          healthy: 4,
          degraded: 1,
          missingUrl: 1
        }
      },
      registryReadiness: {
        ...registryReadinessPayload,
        summary: {
          ...registryReadinessPayload.summary,
          status: "INCOMPLETE",
          ready: 4,
          incomplete: 1
        }
      }
    });

    const html = await renderRouteHtml(Page);

    expect(html).toContain('data-root-cockpit-marker="Ready to operate"');
    expect(html).toContain("Owner root check");
    expect(html).toContain("Ready to operate");
    expect(html).toContain("Needs owner review");
  });

  it.each([
    [
      "product flow",
      ProductFlowPage,
      [
        "OIS Product UX Blueprint",
        "Product Flow Preview",
        "UX Draft / Product Flow Preview",
        "Localization Foundation",
        "Language Settings",
        "English",
        "Tiếng Việt",
        "OIS Product UX Preview",
        "Product page vs Admin console",
        "Executive Dashboard",
        "Workspace List",
        "Workspace Intelligence Dashboard",
        "Meeting/Document Knowledge Feed",
        "Knowledge Detail",
        "Ask OIS / Copilot",
        "Runtime/Admin",
        "Primary user",
        "Main action",
        "Current stage status",
        "Screen mock",
        "Owner approval checklist",
        "No write endpoints added",
        "No LLM call",
        "No hallucinated answer rule"
      ]
    ],
    [
      "localization",
      LocalizationPage,
      [
        "Localization Catalog",
        "Read-only Localization Catalog",
        "Available locales",
        "Translation namespaces",
        "Missing keys",
        "Fallback keys",
        "packages/shared-ui/src/localization.ts",
        "Browser editing is not enabled yet",
        "No mutation or browser editing is enabled from this catalog."
      ]
    ],
    [
      "dashboard",
      DashboardPage,
      [
        "Platform Overview",
        "Owner Registry Cockpit / Registry Runtime Summary",
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
        "Control-plane only",
        "Functional gap map",
        "Next product journey",
        "What can be tested now?",
        "What is platform/control-plane only?",
        "What is not implemented yet?",
        "Recommended next product functions",
        "Suggested next actions",
        "Missing runtime URL",
        "Forbidden link guard",
        "Control plane areas",
        "Registry Governance / Readiness",
        "Registry Runtime Health",
        "Registry ready",
        "/products/prod_pits"
      ]
    ],
    [
      "products",
      ProductsPage,
      [
        "Products &amp; Modules",
        "Owner Registry Cockpit / Registry Runtime Summary",
        "Product &amp; Module Overview",
        "Registry Governance / Readiness",
        "Registry Runtime Health",
        "Runtime health:",
        "Readiness:",
        "Linked to PITS",
        "PITS_RUNTIME_SHELL",
        "/products/prod_pits"
      ]
    ],
    [
      "workspaces",
      WorkspacesPage,
      [
        "Organizations, Workspaces &amp; Projects",
        "Owner Registry Cockpit / Registry Runtime Summary",
        "Workspace Overview",
        "Registry Governance / Readiness",
        "Registry Runtime Health",
        "Runtime health:",
        "Readiness:",
        "No issue detected",
        "PMC Org Demo",
        "Emerald Precinct Demo",
        "/workspaces/ws_pmc_org_demo"
      ]
    ],
    [
      "learning center",
      LearningCenterPage,
      [
        "OIS Learning Center",
        "SuperAdmin Access Guard",
        "Learning Overview",
        "Learning Stream",
        "Pending Review",
        "Learning Policies",
        "Executive Intent Queue",
        "Knowledge Fabric Integration",
        "Stage 2G maps Learning Candidates",
        "Target Knowledge Layer",
        "KL_3_PRODUCT_KNOWLEDGE_PACK",
        "Product Contribution Map",
        "Audit Log Placeholder",
        "SUPERADMIN_OR_ADMIN",
        "OIS_PLATFORM",
        "Learning writes create AuditRecord entries"
      ]
    ],
    [
      "knowledge fabric",
      KnowledgeFabricPage,
      [
        "OIS Knowledge Fabric",
        "Universal Knowledge Read Contract",
        "Knowledge Layers Overview",
        "KL-0 LEGAL REGULATORY CORE",
        "Canonical Knowledge Items",
        "Demo KEIHB SOP publishing pack",
        "Evidence Links",
        "Demo KEIHB SOP learning signal",
        "Learning Candidate to Knowledge Layer Mappings",
        "KEIHB Bundles",
        "KEIHB Building Management Handbook Demo",
        "Product Consumption Map",
        "Knowledge publishing product / handbook projection",
        "Architecture Map / Mindmap",
        "OIS Ecosystem Architecture Map",
        "No auto-promotion in Stage 2G",
        "Read only"
      ]
    ],
    [
      "oima",
      OimaPage,
      [
        "OIMA — Organizational Intelligence Meeting Agent",
        "Powered by OIS Product",
        "OIS understands the organization. OIMA understands the meeting.",
        "OIS hiểu tổ chức. OIMA hiểu cuộc họp.",
        "Product Boundary",
        "MEETING_INTELLIGENCE_PRODUCT",
        "PRODUCT_BOUNDARY_READY",
        "MEETING_LIBRARY",
        "TRANSCRIPT_FIRST_PIPELINE",
        "Source Mode Contract",
        "TRANSCRIPT_ONLY",
        "AUDIO_ONLY",
        "TRANSCRIPT_AND_AUDIO",
        "LISTENER_CAPTURED",
        "TRANSCRIPT_ONLY primary",
        "Safety Boundary",
        "NO_LIVE_SPEAKING_AGENT",
        "NO_VOICE_CLONE",
        "NO_IMPERSONATION",
        "NO_AUTONOMOUS_DECISION",
        "OIS Core Reuse Map",
        "OIS Universal Knowledge API",
        "OIMA Roadmap",
        "OIMA-0 - Product Shell &amp; Boundary",
        "OIMA-5 - Dashboard &amp; Monthly Report",
        "OIMA-9 - Listener Mode",
        "Placeholder Product Surfaces",
        "Meeting Library",
        "Upload Meeting",
        "Preview only",
        "OIMA Product Overview",
        "OIMA-0 shell ready",
        "OIS is the organizational intelligence backbone. OIMA is the meeting intelligence product powered by OIS.",
        "Transcript is primary; audio is optional.",
        "Product code",
        "Product name",
        "Organizational Intelligence Meeting Agent",
        "OVERVIEW",
        "PRODUCT_BOUNDARY",
        "KNOWLEDGE_API_LINKAGE",
        "MEETING_INTAKE",
        "TRANSCRIPT_PROCESSING",
        "AUDIO_PROCESSING",
        "OFFLINE_AGENT_ANALYSIS",
        "SUBJECT_CLARIFICATION",
        "SELF_IMPROVEMENT",
        "Future permissioned recording only",
        "Voice clone",
        "Live speaking",
        "Out of scope",
        "OIMA Product Surface Empty States",
        "Agent Analysis",
        "Clarification Review",
        "Dashboard",
        "Self-Improvement Center",
        "Planned / not runtime",
        "Runtime enabled",
        "No fake meeting data"
      ]
    ],
    [
      "runtime",
      RuntimePage,
      [
        "Runtime Status",
        "Owner Registry Cockpit / Registry Runtime Summary",
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
        "Product User Journey UAT",
        "Testable now",
        "Control-plane only",
        "Functional gap map",
        "Next product journey",
        "Owner UAT status",
        "Health ready",
        "Registry Governance / Readiness",
        "Registry Runtime Health",
        "Registry ready"
      ]
    ]
  ] satisfies Array<[string, RouteComponent, string[]]>)("renders the %s route shell", async (_name, Component, markers) => {
    mockCoreApiFetch();

    const html = await renderRouteHtml(Component);

    expect(html).toContain("OIS_CONSOLE");
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
    expect(html).toContain("Localization Foundation");
    expect(html).toContain("Language Settings");
    expect(html).toContain("English");
    expect(html).toContain("Tiếng Việt");
    expect(html).toContain('data-ops-marker="core-api-source"');
    expect(html).toContain("Core API source:");
    for (const marker of markers) {
      expect(html).toContain(marker);
    }
    expect(html).not.toContain("Execute admin action");
    expect(html).not.toContain("Run admin action");
    expect(html).not.toContain("Apply registry fix");
    expect(html).not.toContain(dbEnvKey);
  });

  it("renders without a direct database environment value", async () => {
    mockCoreApiFetch();

    await expect(renderRouteHtml(Page)).resolves.toContain("OIS Console");
    expect(process.env[dbEnvKey]).toBeUndefined();
  });

  it("renders product detail with cross-product PITS links", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProductDetailPage({ params: Promise.resolve({ id: "prod_pits" }) }));

    expect(html).toContain("Product Detail Source");
    expect(html).toContain("Modern Shell Layout");
    expect(html).toContain("Shell Navigation Toggle");
    expect(html).toContain("Owner-facing UAT summary");
    expect(html).toContain("Owner Review Queue");
    expect(html).toContain("Safe Action Boundary");
    expect(html).toContain("Action is read-only preview only");
    expect(html).toContain("Future admin action requires audit");
    expect(html).toContain("Admin Boundary");
    expect(html).toContain("Audit Required");
    expect(html).toContain("Permission Model");
    expect(html).toContain("Preview only - not executable yet");
    expect(html).toContain("Blocked in current stage");
    expect(html).toContain("Product User Journey UAT");
    expect(html).toContain("Testable now");
    expect(html).toContain("Functional gap map");
    expect(html).toContain("Next product journey");
    expect(html).toContain("What can be tested now?");
    expect(html).toContain("What is platform/control-plane only?");
    expect(html).toContain("What is not implemented yet?");
    expect(html).toContain("Recommended next product functions");
    expect(html).toContain("project registry shell and readiness shell");
    expect(html).toContain("not a true workflow app");
    expect(html).toContain("Runtime health");
    expect(html).toContain("Readiness");
    expect(html).toContain("No issue detected");
    expect(html).toContain("Product Governance / Readiness");
    expect(html).toContain("What is missing?");
    expect(html).toContain("Product Runtime Health");
    expect(html).toContain('data-detail-source="Product Detail Source"');
    expect(html).toContain("PITS_RUNTIME_SHELL");
    expect(html).toContain("/modules/module_pits_runtime_shell");
    expect(html).toContain(`${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`);
    expect(html).toContain("Cross-product staging link");
    expect(html).not.toContain("Execute admin action");
    expect(html).not.toContain("Run admin action");
    expect(html).not.toContain("Apply registry fix");
    expect(html).not.toContain(dbEnvKey);
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/products/prod_pits`, { cache: "no-store" });
  });

  it("renders product detail fallback for a controlled Core API 404", async () => {
    mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProductDetailPage({ params: Promise.resolve({ id: "missing" }) }));

    expect(html).toContain("Product Not Found");
    expect(html).toContain("Product not linked yet");
    expect(html).toContain("Missing link");
    expect(html).toContain("Safe owner fallback");
    expect(html).toContain("Next step: return to the registry list");
    expect(html).not.toContain(dbEnvKey);
  });

  it.each([
    [
      "workspace",
      WorkspaceDetailPage,
      "ws_pmc_org_demo",
      [
        "Workspace Detail Source",
        "Owner-facing UAT summary",
        "Owner Review Queue",
        "Safe Action Boundary",
        "Action is read-only preview only",
        "Admin Boundary",
        "Audit Required",
        "Permission Model",
        "Preview only - not executable yet",
        "Blocked in current stage",
        "Product User Journey UAT",
        "Control-plane only",
        "Functional gap map",
        "Next product journey",
        "end-user workspace home",
        "Workspace Governance / Readiness",
        "Workspace Runtime Health",
        "https://pits-ng.dmp247.com/projects/prj_emerald_precinct_demo"
      ]
    ],
    [
      "module",
      ModuleDetailPage,
      "module_pits_runtime_shell",
      [
        "Module Detail Source",
        "Owner-facing UAT summary",
        "Module Governance / Readiness",
        "Module Runtime Health",
        "/products/prod_pits",
        "inst_pits_emerald"
      ]
    ],
    [
      "installation",
      InstallationDetailPage,
      "inst_pits_emerald",
      [
        "Installation Detail Source",
        "Owner-facing UAT summary",
        "Owner Review Queue",
        "Safe Action Boundary",
        "Action is read-only preview only",
        "Admin Boundary",
        "Audit Required",
        "Permission Model",
        "Preview only - not executable yet",
        "Blocked in current stage",
        "Product User Journey UAT",
        "Functional gap map",
        "Next product journey",
        "Future project status update",
        "No status write can be tested in Stage 1K",
        "Installation Governance / Readiness",
        "Installation Runtime Health",
        "/products/prod_pits",
        "/modules/module_pits_runtime_shell"
      ]
    ]
  ] satisfies Array<[string, (props: { params: Promise<{ id: string }> }) => Promise<ReactElement>, string, string[]]>)(
    "renders %s detail route",
    async (_name, Component, id, markers) => {
      mockCoreApiFetch();

      const html = renderToStaticMarkup(await Component({ params: Promise.resolve({ id }) }));

      for (const marker of markers) {
        expect(html).toContain(marker);
      }
      expect(html).toContain("Modern Shell Layout");
      expect(html).toContain("Shell Navigation Toggle");
      expect(html).toContain(`data-detail-source="${markers[0]}"`);
      expect(html).toContain("Detail ready");
      expect(html).not.toContain("Execute admin action");
      expect(html).not.toContain("Run admin action");
      expect(html).not.toContain("Apply registry fix");
      expect(html).not.toContain(dbEnvKey);
    }
  );
});
