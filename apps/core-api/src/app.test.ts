import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import { buildCoreApi, type BuildCoreApiOptions } from "./app";

type MockPrisma = NonNullable<BuildCoreApiOptions["prisma"]>;

const overviewCounts = {
  industries: 11,
  organizations: 12,
  workspaces: 13,
  projects: 14,
  products: 15,
  installations: 16,
  modules: 17,
  auditRecords: 18
} as const;

const registryRows = {
  industry: {
    id: "ind_building_management",
    code: "BUILDING_MANAGEMENT",
    name: "Building Management"
  },
  organization: {
    id: "org_pmc_demo",
    code: "PMC_DEMO",
    name: "PMC Demo",
    lifecycle: "ACTIVE",
    version: 1,
    industry: {
      id: "ind_building_management",
      code: "BUILDING_MANAGEMENT",
      name: "Building Management"
    }
  },
  workspace: {
    id: "ws_pmc_org_demo",
    code: "PMC_ORG_DEMO",
    name: "PMC Org Demo",
    organizationId: "org_pmc_demo",
    lifecycle: "ACTIVE",
    version: 1,
    organization: {
      id: "org_pmc_demo",
      code: "PMC_DEMO",
      name: "PMC Demo"
    },
    projects: [
      {
        id: "prj_emerald_precinct_demo",
        code: "EMERALD_PRECINCT_DEMO",
        name: "Emerald Precinct Demo",
        workspaceId: "ws_pmc_org_demo",
        lifecycle: "ACTIVE",
        version: 1
      }
    ],
    installations: [
      {
        id: "inst_pits_emerald",
        productCode: "PITS",
        projectId: "prj_emerald_precinct_demo",
        lifecycle: "ACTIVE"
      }
    ]
  },
  project: {
    id: "prj_emerald_precinct_demo",
    code: "EMERALD_PRECINCT_DEMO",
    name: "Emerald Precinct Demo",
    workspaceId: "ws_pmc_org_demo",
    lifecycle: "ACTIVE",
    version: 1,
    workspace: {
      id: "ws_pmc_org_demo",
      code: "PMC_ORG_DEMO",
      name: "PMC Org Demo",
      organization: {
        id: "org_pmc_demo",
        code: "PMC_DEMO",
        name: "PMC Demo"
      }
    },
    installations: [
      {
        id: "inst_pits_emerald",
        productId: "prod_pits",
        productCode: "PITS",
        product: { name: "PITS" },
        lifecycle: "ACTIVE",
        version: 1
      }
    ]
  },
  product: {
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
        lifecycle: "ACTIVE",
        version: 1,
        organization: { code: "PMC_DEMO", name: "PMC Demo" },
        workspace: { code: "PMC_ORG_DEMO", name: "PMC Org Demo" },
        project: { code: "EMERALD_PRECINCT_DEMO", name: "Emerald Precinct Demo" }
      }
    ]
  },
  module: {
    id: "module_pits_runtime_shell",
    code: "PITS_RUNTIME_SHELL",
    productCode: "PITS",
    layerCode: "L0_OPERATIONAL_DATA",
    scope: "PROJECT",
    realmCode: "PITS_PROJECT_USER",
    moduleType: "PRODUCT_RUNTIME_VIEW",
    lifecycle: "ACTIVE",
    version: 1,
    product: {
      id: "prod_pits",
      code: "PITS",
      name: "PITS"
    }
  },
  installation: {
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
} as const;

function createWriteGuard(name: string, writeCalls: string[]) {
  return vi.fn(() => {
    writeCalls.push(name);
    throw new Error(`Unexpected Prisma write operation: ${name}`);
  });
}

function createCountDelegate(name: string, count: number, readCalls: string[], writeCalls: string[], findManyRows: unknown[] = []) {
  return {
    count: vi.fn(async () => {
      readCalls.push(`${name}.count`);
      return count;
    }),
    findMany: vi.fn(async () => {
      readCalls.push(`${name}.findMany`);
      return findManyRows;
    }),
    create: createWriteGuard(`${name}.create`, writeCalls),
    createMany: createWriteGuard(`${name}.createMany`, writeCalls),
    delete: createWriteGuard(`${name}.delete`, writeCalls),
    deleteMany: createWriteGuard(`${name}.deleteMany`, writeCalls),
    update: createWriteGuard(`${name}.update`, writeCalls),
    updateMany: createWriteGuard(`${name}.updateMany`, writeCalls),
    upsert: createWriteGuard(`${name}.upsert`, writeCalls)
  };
}

function createMockPrisma(counts = overviewCounts) {
  const readCalls: string[] = [];
  const writeCalls: string[] = [];

  const delegates = {
    industry: createCountDelegate("industry", counts.industries, readCalls, writeCalls),
    organization: createCountDelegate("organization", counts.organizations, readCalls, writeCalls, [registryRows.organization]),
    workspace: createCountDelegate("workspace", counts.workspaces, readCalls, writeCalls, [registryRows.workspace]),
    project: createCountDelegate("project", counts.projects, readCalls, writeCalls, [registryRows.project]),
    productDefinition: createCountDelegate("productDefinition", counts.products, readCalls, writeCalls, [registryRows.product]),
    productInstallation: {
      ...createCountDelegate("productInstallation", counts.installations, readCalls, writeCalls, [registryRows.installation]),
      findUnique: vi.fn(async () => null)
    },
    moduleDefinition: createCountDelegate("moduleDefinition", counts.modules, readCalls, writeCalls, [registryRows.module]),
    auditRecord: createCountDelegate("auditRecord", counts.auditRecords, readCalls, writeCalls)
  };

  const userAccount = {
    findUnique: vi.fn(async () => null)
  };

  const disconnect = vi.fn(async () => undefined);

  return {
    prisma: {
      ...delegates,
      userAccount,
      $disconnect: disconnect
    } as unknown as MockPrisma,
    delegates,
    disconnect,
    readCalls,
    writeCalls,
    userAccount
  };
}

describe("core api root contract", () => {
  it("returns deterministic service identity", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/" });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.json()).toEqual({
        service: "ois-nextgen-core-api",
        status: "ok",
        version: "0.1.0",
        health: "/health",
        docs: "/docs"
      });
      expect(mock.readCalls).toEqual([]);
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });
});

describe("core api health contract", () => {
  it("returns static no-db health without DATABASE_URL or Prisma calls", async () => {
    const previousDatabaseUrl = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;

    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/health" });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.json()).toEqual({
        status: "ok",
        service: "core-api",
        stage: "bootstrap-stage-a"
      });
      expect(mock.readCalls).toEqual([]);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
      expect(mock.delegates.productInstallation.findUnique).not.toHaveBeenCalled();
      expect(mock.disconnect).not.toHaveBeenCalled();
    } finally {
      await app.close();
      if (previousDatabaseUrl === undefined) {
        delete process.env.DATABASE_URL;
      } else {
        process.env.DATABASE_URL = previousDatabaseUrl;
      }
    }
  });
});

describe("platform overview contract", () => {
  it("returns read-only kernel counts and current phase gate statuses", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/overview" });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.json()).toEqual({
        banner: "DEMO DATA - NOT PRODUCTION",
        kernel: {
          industries: overviewCounts.industries,
          organizations: overviewCounts.organizations,
          workspaces: overviewCounts.workspaces,
          projects: overviewCounts.projects,
          products: overviewCounts.products,
          installations: overviewCounts.installations,
          modules: overviewCounts.modules,
          auditRecords: overviewCounts.auditRecords
        },
        phaseGates: {
          PLATFORM_KERNEL: "IN_PROGRESS",
          PITS_BUSINESS_LOGIC: "BLOCKED_BY_PHASE2",
          KNOWLEDGE_PORTING: "BLOCKED_BY_PHASE2",
          FULL_STARTER_DATA: "BLOCKED_BY_PHASE3",
          REGRESSION_CERTIFICATION: "BLOCKED_BY_PHASE3"
        }
      });
      expect(mock.readCalls).toEqual([
        "industry.count",
        "organization.count",
        "workspace.count",
        "project.count",
        "productDefinition.count",
        "productInstallation.count",
        "moduleDefinition.count",
        "auditRecord.count"
      ]);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
      expect(mock.delegates.productInstallation.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns the current server error behavior when Prisma counts are unavailable", async () => {
    const mock = createMockPrisma();
    mock.delegates.industry.count.mockRejectedValueOnce(new Error("database unavailable"));
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/overview" });

      expect(response.statusCode).toBe(500);
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });
});

describe("platform registry read-only endpoints", () => {
  it.each([
    ["/platform/products", "productDefinition.findMany", "products", "PITS"],
    ["/platform/workspaces", "workspace.findMany", "workspaces", "PMC_ORG_DEMO"],
    ["/platform/projects", "project.findMany", "projects", "EMERALD_PRECINCT_DEMO"],
    ["/platform/modules", "moduleDefinition.findMany", "modules", "PITS_RUNTIME_SHELL"],
    ["/platform/installations", "productInstallation.findMany", "installations", "inst_pits_emerald"]
  ] satisfies Array<[string, string, string, string]>)(
    "returns %s as read-only registry data",
    async (url, expectedReadCall, collectionKey, expectedMarker) => {
      const mock = createMockPrisma();
      const app = buildCoreApi({ prisma: mock.prisma });

      try {
        const response = await app.inject({ method: "GET", url });
        const body = response.json() as Record<string, unknown>;

        expect(response.statusCode).toBe(200);
        expect(body.metadata).toMatchObject({
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        });
        expect(typeof (body.metadata as Record<string, unknown>).generatedAt).toBe("string");
        expect(JSON.stringify(body[collectionKey])).toContain(expectedMarker);
        expect(mock.readCalls).toContain(expectedReadCall);
        expect(mock.writeCalls).toEqual([]);
      } finally {
        await app.close();
      }
    }
  );

  it("returns aggregate platform registry data with stable relationship fields", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/registry" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        },
        products: [
          {
            id: "prod_pits",
            code: "PITS",
            name: "PITS",
            lifecycle: "ACTIVE",
            modules: [{ code: "PITS_RUNTIME_SHELL" }],
            installations: [{ project: { code: "EMERALD_PRECINCT_DEMO" } }]
          }
        ],
        organizations: [{ code: "PMC_DEMO", industry: { code: "BUILDING_MANAGEMENT" } }],
        workspaces: [{ code: "PMC_ORG_DEMO", projects: [{ code: "EMERALD_PRECINCT_DEMO" }] }],
        projects: [{ code: "EMERALD_PRECINCT_DEMO", installations: [{ productCode: "PITS" }] }],
        modules: [{ code: "PITS_RUNTIME_SHELL", product: { code: "PITS" } }],
        installations: [{ id: "inst_pits_emerald", productCode: "PITS", project: { code: "EMERALD_PRECINCT_DEMO" } }]
      });
      expect(typeof body.metadata.generatedAt).toBe("string");
      expect(mock.readCalls).toEqual([
        "productDefinition.findMany",
        "organization.findMany",
        "workspace.findMany",
        "project.findMany",
        "moduleDefinition.findMany",
        "productInstallation.findMany"
      ]);
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("returns empty arrays when registry tables are empty", async () => {
    const mock = createMockPrisma();
    mock.delegates.organization.findMany.mockResolvedValue([]);
    mock.delegates.workspace.findMany.mockResolvedValue([]);
    mock.delegates.project.findMany.mockResolvedValue([]);
    mock.delegates.productDefinition.findMany.mockResolvedValue([]);
    mock.delegates.moduleDefinition.findMany.mockResolvedValue([]);
    mock.delegates.productInstallation.findMany.mockResolvedValue([]);
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/registry" });

      expect(response.statusCode).toBe(200);
      expect(response.json()).toMatchObject({
        products: [],
        organizations: [],
        workspaces: [],
        projects: [],
        modules: [],
        installations: []
      });
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("returns deterministic read-only registry runtime health", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/registry/health" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        },
        runtime: {
          coreApiBaseUrl: "https://ois-nextgen.abacusai.cloud",
          oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
          pitsShellBaseUrl: "https://pits-ng.dmp247.com",
          reachabilityMode: "configured-url"
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
            {
              kind: "product",
              id: "prod_pits",
              status: "Healthy",
              badges: expect.arrayContaining(["Healthy", "Configured", "Linked", "Reachable"])
            }
          ],
          projects: [
            {
              kind: "project",
              id: "prj_emerald_precinct_demo",
              status: "Healthy",
              links: {
                coreApiDetail: "https://ois-nextgen.abacusai.cloud/platform/projects/prj_emerald_precinct_demo",
                pitsProjectDetail: "https://pits-ng.dmp247.com/projects/prj_emerald_precinct_demo",
                oisProduct: "https://ois-ng.dmp247.com/products/prod_pits",
                oisWorkspace: "https://ois-ng.dmp247.com/workspaces/ws_pmc_org_demo"
              }
            }
          ]
        }
      });
      expect(JSON.stringify(body)).toContain("Core API detail source");
      expect(JSON.stringify(body)).toContain("PITS project runtime link");
      expect(JSON.stringify(body)).not.toContain("localhost");
      expect(JSON.stringify(body)).not.toContain("127.0.0.1");
      expect(JSON.stringify(body)).not.toContain("ois.dmp247.com");
      expect(JSON.stringify(body)).not.toContain("oisys.abacusai.app");
      expect(mock.readCalls).toEqual([
        "productDefinition.findMany",
        "organization.findMany",
        "workspace.findMany",
        "project.findMany",
        "moduleDefinition.findMany",
        "productInstallation.findMany"
      ]);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
      expect(mock.delegates.productInstallation.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns deterministic read-only registry governance readiness", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/registry/readiness" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        },
        runtime: {
          coreApiBaseUrl: "https://ois-nextgen.abacusai.cloud",
          oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
          pitsShellBaseUrl: "https://pits-ng.dmp247.com",
          readinessMode: "deterministic-registry"
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
            {
              kind: "product",
              id: "prod_pits",
              status: "READY",
              missing: [],
              blockedReasons: [],
              checks: expect.arrayContaining([
                expect.objectContaining({ dimension: "product_configured", status: "READY" }),
                expect.objectContaining({ dimension: "module_linked", status: "READY" }),
                expect.objectContaining({ dimension: "owner_uat_required", status: "INCOMPLETE", required: false })
              ])
            }
          ],
          installations: [
            {
              kind: "installation",
              id: "inst_pits_emerald",
              status: "READY",
              links: {
                oisProduct: "https://ois-ng.dmp247.com/products/prod_pits",
                oisWorkspace: "https://ois-ng.dmp247.com/workspaces/ws_pmc_org_demo",
                pitsProject: "https://pits-ng.dmp247.com/projects/prj_emerald_precinct_demo"
              }
            }
          ]
        }
      });
      expect(JSON.stringify(body)).toContain("Owner Browser/UAT");
      expect(JSON.stringify(body)).toContain("Forbidden links absent");
      expect(JSON.stringify(body)).not.toContain("localhost");
      expect(JSON.stringify(body)).not.toContain("127.0.0.1");
      expect(JSON.stringify(body)).not.toContain("ois.dmp247.com");
      expect(JSON.stringify(body)).not.toContain("oisys.abacusai.app");
      expect(mock.readCalls).toEqual([
        "productDefinition.findMany",
        "organization.findMany",
        "workspace.findMany",
        "project.findMany",
        "moduleDefinition.findMany",
        "productInstallation.findMany"
      ]);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
      expect(mock.delegates.productInstallation.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns deterministic read-only owner review safe action boundary", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/owner-review" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        },
        runtime: {
          coreApiBaseUrl: "https://ois-nextgen.abacusai.cloud",
          oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
          pitsShellBaseUrl: "https://pits-ng.dmp247.com",
          reviewMode: "read-only-owner-review",
          stage: "Stage 1I"
        },
        actionBoundary: {
          stage: "Stage 1I",
          enabledAdminActions: 0,
          mutationEndpointsAdded: false,
          writePermission: "NOT_ALLOWED_IN_STAGE_1I",
          markers: expect.arrayContaining(["Owner Review Queue", "Safe Action Boundary", "Read-only preview", "Future admin action requires audit"])
        },
        summary: {
          total: 5,
          review: 5,
          readOnlyPreview: 5
        },
        items: expect.arrayContaining([
          expect.objectContaining({
            id: "product:prod_pits:readiness:owner-uat-required",
            title: "PITS - Owner UAT",
            entityType: "product",
            entityId: "prod_pits",
            entityName: "PITS",
            severity: "REVIEW",
            currentStatus: "INCOMPLETE",
            actionPermission: "READ_ONLY_PREVIEW",
            actionCurrentlyAllowed: false,
            source: "registry-readiness",
            requiredSafetyGates: expect.arrayContaining([
              "Sensitive write audit trail",
              "Owner confirmation before execution",
              "Rollback plan before enabling action"
            ])
          }),
          expect.objectContaining({
            entityType: "project",
            entityId: "prj_emerald_precinct_demo",
            actionCurrentlyAllowed: false
          }),
          expect.objectContaining({
            entityType: "installation",
            entityId: "inst_pits_emerald",
            actionCurrentlyAllowed: false
          })
        ])
      });
      expect(body.items.every((item: { actionCurrentlyAllowed: boolean }) => item.actionCurrentlyAllowed === false)).toBe(true);
      expect(JSON.stringify(body)).toContain("suggestedOwnerAction");
      expect(JSON.stringify(body)).toContain("Future admin action requires audit");
      expect(JSON.stringify(body)).toContain("rollback");
      expect(JSON.stringify(body)).toContain("Stage 1I Owner Browser/UAT checklist");
      expect(JSON.stringify(body)).not.toContain("Stage 1E Owner Browser/UAT checklist");
      expect(JSON.stringify(body)).not.toContain("localhost");
      expect(JSON.stringify(body)).not.toContain("127.0.0.1");
      expect(JSON.stringify(body)).not.toContain("ois.dmp247.com");
      expect(JSON.stringify(body)).not.toContain("oisys.abacusai.app");
      expect(mock.readCalls).toEqual([
        "productDefinition.findMany",
        "organization.findMany",
        "workspace.findMany",
        "project.findMany",
        "moduleDefinition.findMany",
        "productInstallation.findMany"
      ]);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
      expect(mock.delegates.productInstallation.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns deterministic read-only audit trail admin permission model", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/admin-boundary" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        },
        runtime: {
          coreApiBaseUrl: "https://ois-nextgen.abacusai.cloud",
          oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
          pitsShellBaseUrl: "https://pits-ng.dmp247.com",
          boundaryMode: "read-only-admin-permission-model",
          stage: "Stage 1J"
        },
        adminBoundary: {
          stage: "Stage 1J",
          enabledAdminActions: 0,
          mutationEndpointsAdded: false,
          writePermission: "BLOCKED_IN_CURRENT_STAGE",
          markers: expect.arrayContaining(["Admin Boundary", "Audit Required", "Permission Model", "Preview only", "Blocked in current stage"])
        },
        summary: {
          roles: 5,
          permissionStates: 7,
          actionCategories: 7,
          safetyGates: 4,
          futureAdminActions: 12,
          previewOnlyActions: 5,
          blockedActions: 7,
          auditRequired: 12,
          confirmationRequired: 12,
          rollbackRequired: 12
        },
        roles: expect.arrayContaining([
          expect.objectContaining({ code: "OWNER" }),
          expect.objectContaining({ code: "ADMIN" }),
          expect.objectContaining({ code: "OPERATOR" }),
          expect.objectContaining({ code: "VIEWER" }),
          expect.objectContaining({ code: "SYSTEM" })
        ]),
        permissions: expect.arrayContaining([
          expect.objectContaining({ state: "ALLOWED_READ_ONLY" }),
          expect.objectContaining({ state: "PREVIEW_ONLY" }),
          expect.objectContaining({ state: "REQUIRES_OWNER_CONFIRMATION" }),
          expect.objectContaining({ state: "REQUIRES_ADMIN_PERMISSION" }),
          expect.objectContaining({ state: "REQUIRES_AUDIT_TRAIL" }),
          expect.objectContaining({ state: "REQUIRES_ROLLBACK_PLAN" }),
          expect.objectContaining({ state: "BLOCKED_IN_CURRENT_STAGE" })
        ]),
        blockedActions: expect.arrayContaining([
          expect.objectContaining({
            actionName: "Registry link fix",
            category: "REGISTRY_LINK_FIX",
            permissionState: "BLOCKED_IN_CURRENT_STAGE",
            auditRequired: true,
            confirmationRequired: true,
            rollbackRequired: true,
            currentAvailability: "BLOCKED_IN_CURRENT_STAGE"
          })
        ]),
        previewOnlyActions: expect.arrayContaining([
          expect.objectContaining({
            actionName: "PITS - Owner UAT",
            permissionState: "PREVIEW_ONLY",
            currentAvailability: "PREVIEW_ONLY",
            linkedReviewItemId: "product:prod_pits:readiness:owner-uat-required"
          })
        ])
      });
      expect(JSON.stringify(body)).toContain("Audit Required");
      expect(JSON.stringify(body)).toContain("Permission Model");
      expect(JSON.stringify(body)).toContain("Blocked in current stage");
      expect(JSON.stringify(body)).toContain("Preview only");
      expect(JSON.stringify(body)).not.toContain("localhost");
      expect(JSON.stringify(body)).not.toContain("127.0.0.1");
      expect(JSON.stringify(body)).not.toContain("ois.dmp247.com");
      expect(JSON.stringify(body)).not.toContain("oisys.abacusai.app");
      expect(mock.readCalls).toEqual([
        "productDefinition.findMany",
        "organization.findMany",
        "workspace.findMany",
        "project.findMany",
        "moduleDefinition.findMany",
        "productInstallation.findMany"
      ]);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
      expect(mock.delegates.productInstallation.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns deterministic read-only product user journey UAT baseline", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/product-uat" });
      const body = response.json();
      const serialized = JSON.stringify(body);

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        },
        runtime: {
          coreApiBaseUrl: "https://ois-nextgen.abacusai.cloud",
          oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
          pitsShellBaseUrl: "https://pits-ng.dmp247.com",
          uatMode: "read-only-product-user-journey-map",
          stage: "Stage 1K"
        },
        productUat: {
          stage: "Stage 1K",
          mutationEndpointsAdded: false,
          writePermission: "NOT_ALLOWED_IN_STAGE_1K",
          markers: expect.arrayContaining(["Product User Journey UAT", "Testable now", "Control-plane only", "Functional gap map", "Next product journey"])
        },
        summary: {
          products: 2,
          surfaces: 15,
          visiblePages: 11,
          testableNow: 10,
          realProductFunctionsAvailable: 1,
          controlPlaneOnly: 5
        }
      });
      const products = body.products as Array<{
        productCode: string;
        currentState: string;
        recommendedNextJourneys: string[];
        surfaces: Array<{
          id: string;
          category: string;
          currentReality: string;
          functionalGap: string | null;
          statusLabel: string;
          testableNow: boolean;
          realProductFunction: boolean;
          nextUserLevelTestPath: string | null;
        }>;
      }>;
      const oisProduct = products.find((item) => item.productCode === "OIS");
      const pitsProduct = products.find((item) => item.productCode === "PITS");

      expect(oisProduct).toMatchObject({
        currentState: expect.stringContaining("platform/control-plane foundation"),
        recommendedNextJourneys: expect.arrayContaining(["Define the first OIS workspace user home"])
      });
      expect(oisProduct?.surfaces).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "ois:dashboard",
            category: "PLATFORM_CONTROL_PLANE_ONLY",
            statusLabel: "Control-plane only",
            realProductFunction: false
          }),
          expect.objectContaining({
            id: "ois:future-knowledge-docs-copilot",
            category: "NEEDS_OWNER_DECISION",
            testableNow: false,
            realProductFunction: true
          })
        ])
      );
      expect(pitsProduct).toMatchObject({
        currentState: expect.stringContaining("Project registry shell and readiness shell"),
        recommendedNextJourneys: expect.arrayContaining(["Owner-test the PITS Project Workboard read-only functional slice"])
      });
      expect(pitsProduct?.surfaces).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            id: "pits:project-list",
            category: "AVAILABLE_FOR_BROWSER_UAT",
            currentReality: expect.stringContaining("project registry shell and readiness shell"),
            functionalGap: expect.stringContaining("project workflow execution")
          }),
          expect.objectContaining({
            id: "pits:project-workboard",
            category: "AVAILABLE_FOR_BROWSER_UAT",
            testableNow: true,
            realProductFunction: true,
            currentReality: expect.stringContaining("read-only PITS workboard functional slice")
          }),
          expect.objectContaining({
            id: "pits:future-issue-task-workflow",
            category: "BLOCKED_BY_MISSING_DATA_MODEL",
            testableNow: false,
            realProductFunction: true,
            nextUserLevelTestPath: "https://pits-ng.dmp247.com/projects/prj_emerald_precinct_demo/workboard"
          }),
          expect.objectContaining({
            id: "pits:future-project-status-write",
            category: "BLOCKED_BY_WRITE_BOUNDARY",
            testableNow: false,
            nextUserLevelTestPath: null
          })
        ])
      );
      expect(body.categories.map((item: { category: string }) => item.category)).toEqual([
        "AVAILABLE_FOR_BROWSER_UAT",
        "PLATFORM_CONTROL_PLANE_ONLY",
        "PLACEHOLDER_OR_SHELL_ONLY",
        "FUTURE_PRODUCT_FUNCTION",
        "BLOCKED_BY_MISSING_DATA_MODEL",
        "BLOCKED_BY_WRITE_BOUNDARY",
        "BLOCKED_BY_AUTH_OR_PERMISSION",
        "NEEDS_OWNER_DECISION"
      ]);
      expect(serialized).toContain("A browser user can verify this surface today without writes");
      expect(serialized).toContain("Product User Journey UAT is a read-only functional gap map");
      expect(serialized).toContain("not a true project workflow app");
      expect(serialized).toContain("Next product journey");
      expect(serialized).not.toContain("localhost");
      expect(serialized).not.toContain("127.0.0.1");
      expect(serialized).not.toContain("ois.dmp247.com");
      expect(serialized).not.toContain("oisys.abacusai.app");
      expect(mock.readCalls).toEqual([
        "productDefinition.findMany",
        "organization.findMany",
        "workspace.findMany",
        "project.findMany",
        "moduleDefinition.findMany",
        "productInstallation.findMany"
      ]);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
      expect(mock.delegates.productInstallation.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns deterministic read-only PITS project workboard data", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/pits/projects/prj_emerald_precinct_demo/workboard" });
      const body = response.json();
      const serialized = JSON.stringify(body);

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        },
        runtime: {
          coreApiBaseUrl: "https://ois-nextgen.abacusai.cloud",
          oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
          pitsShellBaseUrl: "https://pits-ng.dmp247.com",
          workboardMode: "read-only-functional-slice",
          stage: "Stage 2A",
          note: "Read-only functional slice — editing is not enabled yet"
        },
        workboard: {
          projectId: "prj_emerald_precinct_demo",
          projectCode: "EMERALD_PRECINCT_DEMO",
          projectName: "Emerald Precinct Demo",
          readOnly: true,
          markers: expect.arrayContaining(["PITS Project Workboard", "Read-only functional slice", "Work items", "Open", "In progress", "Blocked", "Done"])
        },
        summary: {
          totalItems: 5,
          openCount: 2,
          inProgressCount: 1,
          blockedCount: 1,
          doneCount: 1,
          highPriorityCount: 2,
          overdueCount: 1
        },
        readOnlyBoundary: {
          editingEnabled: false,
          mutationEndpointsAdded: false,
          writePermission: "NOT_ALLOWED_IN_STAGE_2A",
          notice: "Read-only functional slice — editing is not enabled yet"
        }
      });
      expect(body.statusGroups.map((group: { label: string }) => group.label)).toEqual(["Open", "In progress", "Blocked", "Done"]);
      expect(serialized).toContain("Confirm site access package");
      expect(serialized).toContain("Resolve fire door access risk");
      expect(serialized).toContain("Requires Stage 2B/2C write boundary");
      expect(serialized).not.toContain("localhost");
      expect(serialized).not.toContain("127.0.0.1");
      expect(serialized).not.toContain("ois.dmp247.com");
      expect(serialized).not.toContain("oisys.abacusai.app");
      expect(mock.readCalls).toEqual([
        "productDefinition.findMany",
        "organization.findMany",
        "workspace.findMany",
        "project.findMany",
        "moduleDefinition.findMany",
        "productInstallation.findMany"
      ]);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
      expect(mock.delegates.productInstallation.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("does not add owner review, admin boundary or product UAT mutation endpoints", () => {
    const source = readFileSync(new URL("./app.ts", import.meta.url), "utf8");

    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/owner-review/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/admin-boundary/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/audit-model/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/permissions\/model/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/registry\/action-boundary/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/product-uat/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/user-journeys/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/product-capabilities/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/pits\/projects/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/pits\/projects/);
  });

  it.each([
    ["/platform/products/prod_pits", "product", "PITS_RUNTIME_SHELL", "productDefinition.findMany"],
    ["/platform/products/code/PITS", "product", "EMERALD_PRECINCT_DEMO", "productDefinition.findMany"],
    ["/platform/workspaces/ws_pmc_org_demo", "workspace", "PITS_RUNTIME_SHELL", "workspace.findMany"],
    ["/platform/projects/prj_emerald_precinct_demo", "project", "prod_pits", "project.findMany"],
    ["/platform/modules/module_pits_runtime_shell", "module", "inst_pits_emerald", "moduleDefinition.findMany"],
    ["/platform/installations/inst_pits_emerald", "installation", "PITS_RUNTIME_SHELL", "productInstallation.findMany"]
  ] satisfies Array<[string, string, string, string]>)(
    "returns %s detail with relationship context",
    async (url, detailKey, expectedMarker, expectedReadCall) => {
      const mock = createMockPrisma();
      const app = buildCoreApi({ prisma: mock.prisma });

      try {
        const response = await app.inject({ method: "GET", url });
        const body = response.json() as Record<string, unknown>;

        expect(response.statusCode).toBe(200);
        expect(body.metadata).toMatchObject({
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        });
        expect(typeof (body.metadata as Record<string, unknown>).generatedAt).toBe("string");
        expect(JSON.stringify(body[detailKey])).toContain(expectedMarker);
        expect(JSON.stringify(body[detailKey])).toContain("relationships");
        expect(mock.readCalls).toContain(expectedReadCall);
        expect(mock.writeCalls).toEqual([]);
      } finally {
        await app.close();
      }
    }
  );

  it.each([
    ["/platform/products/missing", "product", "id"],
    ["/platform/products/code/MISSING", "product", "code"],
    ["/platform/workspaces/missing", "workspace", "id"],
    ["/platform/projects/missing", "project", "id"],
    ["/platform/pits/projects/missing/workboard", "project", "id"],
    ["/platform/modules/missing", "module", "id"],
    ["/platform/installations/missing", "installation", "id"]
  ] satisfies Array<[string, string, string]>)("returns controlled 404 for %s", async (url, entity, lookupKey) => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url });
      const body = response.json();

      expect(response.statusCode).toBe(404);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only",
          environment: "staging"
        },
        error: {
          code: "NOT_FOUND",
          entity
        }
      });
      expect(body.error.lookup[lookupKey]).toBeDefined();
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });
});

describe("legacy resource reference guard", () => {
  const forbiddenReferences = [
    "ois_phase1_dev",
    "emerald_bql_web_dev",
    "ois.dmp247.com",
    "oisys.abacusai.app",
    "49816/",
    "52067/"
  ];

  const runtimeFiles = [
    ["Core API app", new URL("./app.ts", import.meta.url)],
    ["Core API server", new URL("./server.ts", import.meta.url)],
    ["Core API package", new URL("../package.json", import.meta.url)],
    ["environment example", new URL("../../../.env.example", import.meta.url)],
    ["root package", new URL("../../../package.json", import.meta.url)],
    ["runtime smoke tests", new URL("../../../tests/e2e/runtime-smoke.spec.ts", import.meta.url)]
  ] as const;

  it("keeps Core API runtime and test config free of legacy production resources", () => {
    for (const [label, fileUrl] of runtimeFiles) {
      const source = readFileSync(fileUrl, "utf8");

      for (const forbiddenReference of forbiddenReferences) {
        expect(source, `${label} must not reference ${forbiddenReference}`).not.toContain(forbiddenReference);
      }
    }
  });
});
