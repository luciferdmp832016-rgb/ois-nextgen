import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";
import ProjectsPage from "./projects/page";
import ProjectDetailPage from "./projects/[id]/page";
import RuntimePage from "./runtime/page";

const coreApiUrl = "https://ois-nextgen.abacusai.cloud";
const oisPublicBaseUrl = "https://ois-ng.dmp247.com";
const pitsPublicBaseUrl = "https://pits-ng.dmp247.com";
const dbEnvKey = ["DATABASE", "URL"].join("_");
const adminBoundaryPath = ["/platform", "admin-boundary"].join("/");

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

    if (url === `${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`) {
      return jsonResponse(projectDetailPayload);
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
    expect(html).not.toContain(dbEnvKey);
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`, { cache: "no-store" });
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
});
