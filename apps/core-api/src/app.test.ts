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
