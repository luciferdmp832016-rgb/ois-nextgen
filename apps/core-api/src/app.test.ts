import { readFileSync } from "node:fs";
import { describe, expect, it, vi } from "vitest";
import {
  architectureMindmapManifest,
  defaultCanonicalKnowledgeItems,
  defaultKeihbProjectionBundles,
  defaultKnowledgeEvidenceLinks,
  defaultKnowledgeLayerMappings,
  knowledgeLayerMappingStatusTaxonomy,
  knowledgeLayerKeys
} from "@ois/knowledge-fabric";
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

const stage2FRows = {
  product: {
    id: "ecosystem_product_ois_platform",
    productKey: "OIS_PLATFORM",
    displayName: "OIS Platform",
    description: "The OIS Core control plane and shared platform brain.",
    productType: "CORE_PLATFORM",
    enabled: true,
    supportedAgentCapabilities: ["ASK", "TEACH_OIS", "VIEW_LEARNING_STATUS"],
    supportedLearningSignalTypes: ["USER_CORRECTION", "ENTITY_CORRECTION", "STRATEGIC_INTENT"],
    defaultLearningScope: "PLATFORM",
    createdAt: "2026-07-09T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z"
  },
  policy: {
    id: "learning_policy_ois_platform_organization_entity_correction_superadmin",
    organizationId: "org_pmc_demo",
    productKey: "OIS_PLATFORM",
    learningScope: "ORGANIZATION",
    signalType: "ENTITY_CORRECTION",
    sourceAuthority: "SUPERADMIN",
    policyMode: "AUTO_IF_CONFIDENCE",
    confidenceThreshold: 0.8,
    enabled: true,
    createdAt: "2026-07-09T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z"
  },
  signal: {
    id: "learning_signal_test",
    organizationId: "org_pmc_demo",
    workspaceId: "ws_pmc_org_demo",
    productKey: "OIS_PLATFORM",
    sourceType: "WIDGET",
    sourceAuthority: "SUPERADMIN",
    learningScope: "ORGANIZATION",
    signalType: "ENTITY_CORRECTION",
    rawText: "Emerald Tower is also Emerald Precinct.",
    normalizedText: "Emerald Tower is also Emerald Precinct.",
    contextJson: { evidence: ["registry", "entity-ref"] },
    relatedEntityRefs: [{ type: "Project", id: "prj_emerald_precinct_demo" }],
    submittedBy: "Super Admin Demo",
    userId: "user_super_admin_demo",
    confidenceInitial: 0.8,
    status: "RECEIVED",
    createdAt: "2026-07-09T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z"
  },
  candidate: {
    id: "learning_candidate_test",
    signalId: "learning_signal_test",
    organizationId: "org_pmc_demo",
    workspaceId: "ws_pmc_org_demo",
    productKey: "OIS_PLATFORM",
    learningScope: "ORGANIZATION",
    candidateType: "ENTITY_UPDATE",
    title: "ENTITY UPDATE candidate",
    summary: "Emerald Tower is also Emerald Precinct.",
    proposedKnowledgeJson: { canonicalWriteAllowed: false },
    affectedProducts: ["OIS_PLATFORM"],
    affectedEntities: [{ type: "Project", id: "prj_emerald_precinct_demo" }],
    sourceAuthority: "SUPERADMIN",
    confidenceScore: 0.85,
    confidenceBreakdownJson: {},
    conflictStatus: "NO_CONFLICT",
    policyDecision: "AUTO_LEARN",
    status: "AUTO_LEARNED",
    evidenceJson: { notes: ["no canonical knowledge write"] },
    reviewerId: null,
    reviewedAt: null,
    createdAt: "2026-07-09T00:00:00.000Z",
    updatedAt: "2026-07-09T00:00:00.000Z"
  }
} as const;

const stage2GRows = {
  candidate: {
    ...stage2FRows.candidate,
    id: "learning_candidate_stage_2g_keihb_sop_demo",
    productKey: "KEIHB",
    candidateType: "SOP_UPDATE",
    title: "Demo KEIHB SOP bundle candidate",
    summary: "Map the KEIHB SOP learning candidate to a future product knowledge pack review.",
    proposedKnowledgeJson: {
      canonicalWriteAllowed: false,
      stage: "Stage 2G",
      noAutoPromotion: true
    },
    affectedProducts: ["OIS_PLATFORM", "KEIHB", "PITS"],
    affectedEntities: [{ type: "Workspace", id: "ws_pmc_org_demo" }],
    confidenceScore: 0.72,
    policyDecision: "ASK_REVIEW",
    status: "PENDING_REVIEW"
  },
  item: defaultCanonicalKnowledgeItems[3]!,
  evidence: defaultKnowledgeEvidenceLinks[1]!,
  mapping: defaultKnowledgeLayerMappings[0]!,
  bundle: defaultKeihbProjectionBundles[0]!
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
    auditRecord: createCountDelegate("auditRecord", counts.auditRecords, readCalls, writeCalls),
    oisEcosystemProduct: createCountDelegate("oisEcosystemProduct", 0, readCalls, writeCalls, [stage2FRows.product]),
    oisLearningPolicy: createCountDelegate("oisLearningPolicy", 0, readCalls, writeCalls, [stage2FRows.policy]),
    oisLearningSignal: {
      ...createCountDelegate("oisLearningSignal", 0, readCalls, writeCalls, [stage2FRows.signal]),
      findUnique: vi.fn(async () => stage2FRows.signal)
    },
    oisLearningCandidate: {
      ...createCountDelegate("oisLearningCandidate", 0, readCalls, writeCalls, [stage2FRows.candidate]),
      findUnique: vi.fn(async () => stage2FRows.candidate)
    },
    oisCanonicalKnowledgeItem: {
      ...createCountDelegate("oisCanonicalKnowledgeItem", 0, readCalls, writeCalls, defaultCanonicalKnowledgeItems),
      findUnique: vi.fn(async (args: { where: { id: string } }) => defaultCanonicalKnowledgeItems.find((item) => item.id === args.where.id) ?? null)
    },
    oisKnowledgeEvidenceLink: createCountDelegate("oisKnowledgeEvidenceLink", 0, readCalls, writeCalls, defaultKnowledgeEvidenceLinks),
    oisKnowledgeLayerMapping: {
      ...createCountDelegate("oisKnowledgeLayerMapping", 0, readCalls, writeCalls, defaultKnowledgeLayerMappings),
      findUnique: vi.fn(async (args: { where: { id: string } }) => defaultKnowledgeLayerMappings.find((mapping) => mapping.id === args.where.id) ?? null)
    },
    oisKnowledgeProjectionBundle: {
      ...createCountDelegate("oisKnowledgeProjectionBundle", 0, readCalls, writeCalls, defaultKeihbProjectionBundles),
      findUnique: vi.fn(async (args: { where: { id: string } }) => defaultKeihbProjectionBundles.find((bundle) => bundle.id === args.where.id) ?? null)
    },
    oisAgentSession: createCountDelegate("oisAgentSession", 0, readCalls, writeCalls),
    oisAgentMessage: createCountDelegate("oisAgentMessage", 0, readCalls, writeCalls),
    oisAgentFeedback: createCountDelegate("oisAgentFeedback", 0, readCalls, writeCalls),
    oisAgentLearningSubmission: createCountDelegate("oisAgentLearningSubmission", 0, readCalls, writeCalls)
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
  }, 10000);
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
          surfaces: 16,
          visiblePages: 12,
          testableNow: 11,
          realProductFunctionsAvailable: 2,
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
        currentState: expect.stringContaining("Stage 2B work item detail"),
        recommendedNextJourneys: expect.arrayContaining([
          "Owner-test the PITS Project Workboard read-only functional slice",
          "Owner-test PITS Work Item Detail and Dry-run Action Preview"
        ])
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
            id: "pits:work-item-detail-dry-run",
            category: "AVAILABLE_FOR_BROWSER_UAT",
            testableNow: true,
            realProductFunction: true,
            nextUserLevelTestPath:
              "https://pits-ng.dmp247.com/projects/prj_emerald_precinct_demo/work-items/pits-emerald_precinct_demo-open-site-access",
            currentReality: expect.stringContaining("dry-run action preview")
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

  it("returns deterministic read-only PITS work item detail data", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({
        method: "GET",
        url: "/platform/pits/projects/prj_emerald_precinct_demo/work-items/pits-emerald_precinct_demo-open-site-access"
      });
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
          pitsShellBaseUrl: "https://pits-ng.dmp247.com",
          workItemDetailMode: "read-only-dry-run-preview",
          stage: "Stage 2B",
          note: "Work Item Detail and Dry-run Action Preview are preview only. No data will be changed."
        },
        workItemDetail: {
          projectId: "prj_emerald_precinct_demo",
          projectCode: "EMERALD_PRECINCT_DEMO",
          projectName: "Emerald Precinct Demo",
          itemId: "pits-emerald_precinct_demo-open-site-access",
          readOnly: true,
          dryRunOnly: true,
          markers: expect.arrayContaining([
            "Work Item Detail",
            "Dry-run Action Preview",
            "Preview only",
            "No data will be changed",
            "Requires audit trail",
            "Requires confirmation",
            "Requires rollback plan"
          ])
        },
        item: {
          id: "pits-emerald_precinct_demo-open-site-access",
          title: "Confirm site access package",
          status: "OPEN",
          priority: "HIGH",
          owner: "Project operator",
          dueDate: "2026-07-12",
          readOnlyNotice: "Preview only. No data will be changed.",
          availableDryRunActions: expect.arrayContaining([
            expect.objectContaining({ actionType: "CHANGE_STATUS", label: "Change status preview" }),
            expect.objectContaining({ actionType: "ASSIGN_OWNER", label: "Assign owner preview" }),
            expect.objectContaining({ actionType: "ADD_NOTE", label: "Add note preview" }),
            expect.objectContaining({ actionType: "SET_PRIORITY", label: "Set priority preview" }),
            expect.objectContaining({ actionType: "RESOLVE_BLOCKER", label: "Resolve blocker preview" })
          ])
        },
        dryRunPreviews: expect.arrayContaining([
          expect.objectContaining({
            actionType: "CHANGE_STATUS",
            allowedInCurrentStage: false,
            mode: "DRY_RUN_ONLY",
            noDataChanged: true,
            auditRequired: true,
            confirmationRequired: true,
            rollbackRequired: true
          })
        ]),
        readOnlyBoundary: {
          mutationEndpointsAdded: false,
          writePermission: "NOT_ALLOWED_IN_STAGE_2B",
          notice: "Preview only. No data will be changed."
        }
      });
      expect(serialized).toContain("Requires future write boundary");
      expect(serialized).toContain("No data will be changed");
      expect(serialized).not.toContain("localhost");
      expect(serialized).not.toContain("127.0.0.1");
      expect(serialized).not.toContain("ois.dmp247.com");
      expect(serialized).not.toContain("oisys.abacusai.app");
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns deterministic non-mutating PITS dry-run action preview data", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({
        method: "GET",
        url: "/platform/pits/projects/prj_emerald_precinct_demo/work-items/pits-emerald_precinct_demo-open-site-access/action-preview?actionType=CHANGE_STATUS&proposedValue=IN_PROGRESS"
      });
      const body = response.json();
      const serialized = JSON.stringify(body);

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only"
        },
        runtime: {
          dryRunMode: "DRY_RUN_ONLY",
          stage: "Stage 2B",
          note: "Dry-run Action Preview is non-mutating. No data will be changed."
        },
        actionPreview: {
          projectId: "prj_emerald_precinct_demo",
          itemId: "pits-emerald_precinct_demo-open-site-access",
          requestedActionType: "CHANGE_STATUS",
          allowedInCurrentStage: false,
          noDataChanged: true,
          markers: expect.arrayContaining([
            "Dry-run Action Preview",
            "Preview only",
            "No data will be changed",
            "Requires audit trail",
            "Requires confirmation",
            "Requires rollback plan"
          ])
        },
        preview: {
          actionType: "CHANGE_STATUS",
          allowedInCurrentStage: false,
          mode: "DRY_RUN_ONLY",
          currentValue: "OPEN",
          proposedValue: "IN_PROGRESS",
          requiredRole: "PROJECT_OPERATOR",
          auditRequired: true,
          confirmationRequired: true,
          rollbackRequired: true,
          noDataChanged: true
        },
        noDataChanged: true
      });
      expect(body.previews).toHaveLength(1);
      expect(serialized).toContain("Requires future write boundary");
      expect(serialized).not.toContain("localhost");
      expect(serialized).not.toContain("127.0.0.1");
      expect(serialized).not.toContain("ois.dmp247.com");
      expect(serialized).not.toContain("oisys.abacusai.app");
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns deterministic audit-safe PITS work item action requests without mutating source data", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });
    const workItemId = "pits-emerald_precinct_demo-open-site-access";
    const requestId = `par-prj_emerald_precinct_demo-${workItemId}-change-status`;

    try {
      const listResponse = await app.inject({
        method: "GET",
        url: `/platform/pits/projects/prj_emerald_precinct_demo/work-items/${workItemId}/action-requests`
      });
      const listBody = listResponse.json();
      const serializedList = JSON.stringify(listBody);

      expect(listResponse.statusCode).toBe(200);
      expect(listBody).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only"
        },
        runtime: {
          actionRequestMode: "read-only-action-request-boundary",
          stage: "Stage 2E",
          note: "PITS Action Request is staged only. No direct mutation is enabled."
        },
        actionRequestList: {
          projectId: "prj_emerald_precinct_demo",
          workItemId,
          actionRequestOnly: true,
          noDirectMutation: true,
          supportedActions: ["CHANGE_STATUS", "ASSIGN_OWNER", "ADD_NOTE", "SET_PRIORITY", "RESOLVE_BLOCKER"],
          markers: expect.arrayContaining([
            "PITS Action Request",
            "Action request only",
            "No direct mutation",
            "Pending review",
            "Requires audit trail",
            "Requires confirmation",
            "Requires rollback plan"
          ])
        },
        requests: expect.arrayContaining([
          expect.objectContaining({
            requestId,
            projectId: "prj_emerald_precinct_demo",
            workItemId,
            actionType: "CHANGE_STATUS",
            currentValue: "OPEN",
            proposedValue: "DONE",
            status: "PENDING_REVIEW",
            auditRequired: true,
            confirmationRequired: true,
            rollbackRequired: true,
            permissionRequired: "PROJECT_OPERATOR",
            noDirectMutation: true
          }),
          expect.objectContaining({
            actionType: "SET_PRIORITY",
            status: "BLOCKED_BY_SAFETY_GATE",
            noDirectMutation: true
          })
        ]),
        readOnlyBoundary: {
          mutationEndpointsAdded: false,
          writePermission: "NOT_ALLOWED_IN_STAGE_2E",
          notice: "Action request only. Work item is not changed yet."
        },
        noDirectMutation: true
      });
      expect(serializedList).toContain("Requires owner or admin confirmation");
      expect(serializedList).toContain("No source work item is changed in Stage 2E");
      expect(serializedList).not.toContain("localhost");
      expect(serializedList).not.toContain("127.0.0.1");
      expect(serializedList).not.toContain("ois.dmp247.com");
      expect(serializedList).not.toContain("oisys.abacusai.app");

      const detailResponse = await app.inject({
        method: "GET",
        url: `/platform/pits/projects/prj_emerald_precinct_demo/work-items/${workItemId}/action-requests/${requestId}`
      });
      const detailBody = detailResponse.json();

      expect(detailResponse.statusCode).toBe(200);
      expect(detailBody.request).toMatchObject({
        requestId,
        actionType: "CHANGE_STATUS",
        currentValue: "OPEN",
        proposedValue: "DONE",
        status: "PENDING_REVIEW",
        noDirectMutation: true
      });
      expect(detailBody.noDirectMutation).toBe(true);
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns deterministic non-mutating PITS action request preview data", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });
    const workItemId = "pits-emerald_precinct_demo-open-site-access";

    try {
      const response = await app.inject({
        method: "GET",
        url: `/platform/pits/projects/prj_emerald_precinct_demo/work-items/${workItemId}/action-request-preview?actionType=CHANGE_STATUS&proposedValue=IN_PROGRESS`
      });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body).toMatchObject({
        metadata: {
          source: "default-db",
          mode: "read-only"
        },
        runtime: {
          actionRequestPreviewMode: "read-only-action-request-preview",
          stage: "Stage 2E"
        },
        actionRequestPreview: {
          projectId: "prj_emerald_precinct_demo",
          workItemId,
          requestedActionType: "CHANGE_STATUS",
          actionRequestOnly: true,
          noDirectMutation: true,
          markers: expect.arrayContaining([
            "PITS Action Request",
            "Action request only",
            "No direct mutation",
            "Pending review",
            "Requires audit trail",
            "Requires confirmation",
            "Requires rollback plan"
          ])
        },
        request: {
          actionType: "CHANGE_STATUS",
          currentValue: "OPEN",
          proposedValue: "IN_PROGRESS",
          status: "PENDING_REVIEW",
          noDirectMutation: true
        },
        sourceItemUnchanged: {
          itemId: workItemId,
          status: "OPEN",
          priority: "HIGH",
          owner: "Project operator",
          blockers: []
        },
        noDirectMutation: true
      });
      expect(mock.writeCalls).toEqual([]);
      expect(mock.userAccount.findUnique).not.toHaveBeenCalled();
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
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/knowledge\/items/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/knowledge\/evidence/);
    expect(source).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/knowledge\/keihb/);
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
    ["/platform/pits/projects/prj_emerald_precinct_demo/work-items/missing", "workItem", "itemId"],
    ["/platform/pits/projects/prj_emerald_precinct_demo/work-items/missing/action-preview", "workItem", "itemId"],
    ["/platform/pits/projects/prj_emerald_precinct_demo/work-items/missing/action-requests", "workItem", "itemId"],
    ["/platform/pits/projects/prj_emerald_precinct_demo/work-items/missing/action-request-preview", "workItem", "itemId"],
    [
      "/platform/pits/projects/prj_emerald_precinct_demo/work-items/pits-emerald_precinct_demo-open-site-access/action-requests/missing",
      "actionRequest",
      "requestId"
    ],
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

describe("Stage 2F OIS Agent Runtime and Self-Improvement endpoints", () => {
  function enableStage2FWrites(mock: ReturnType<typeof createMockPrisma>, writeOps: string[]) {
    (mock.delegates.auditRecord.create as any).mockImplementation(async (args: { data: Record<string, unknown> }) => {
      writeOps.push("auditRecord.create");
      return args.data;
    });
    (mock.delegates.oisLearningSignal.create as any).mockImplementation(async (args: { data: Record<string, unknown> }) => {
      writeOps.push("oisLearningSignal.create");
      return {
        ...stage2FRows.signal,
        ...args.data,
        workspaceId: args.data.workspaceId ?? null,
        submittedBy: args.data.submittedBy ?? null,
        userId: args.data.userId ?? null,
        createdAt: stage2FRows.signal.createdAt,
        updatedAt: stage2FRows.signal.updatedAt
      };
    });
    (mock.delegates.oisLearningSignal.update as any).mockImplementation(async (args: { data: Record<string, unknown> }) => {
      writeOps.push("oisLearningSignal.update");
      return { ...stage2FRows.signal, ...args.data };
    });
    (mock.delegates.oisLearningCandidate.create as any).mockImplementation(async (args: { data: Record<string, unknown> }) => {
      writeOps.push("oisLearningCandidate.create");
      return {
        ...stage2FRows.candidate,
        ...args.data,
        workspaceId: args.data.workspaceId ?? null,
        reviewerId: null,
        reviewedAt: null,
        createdAt: stage2FRows.candidate.createdAt,
        updatedAt: stage2FRows.candidate.updatedAt
      };
    });
    (mock.delegates.oisAgentLearningSubmission.create as any).mockImplementation(async (args: { data: Record<string, unknown> }) => {
      writeOps.push("oisAgentLearningSubmission.create");
      return {
        ...args.data,
        workspaceId: args.data.workspaceId ?? null,
        sessionId: args.data.sessionId ?? null,
        signalId: args.data.signalId ?? null,
        submittedBy: args.data.submittedBy ?? null,
        userId: args.data.userId ?? null,
        createdAt: "2026-07-09T00:00:00.000Z",
        updatedAt: "2026-07-09T00:00:00.000Z"
      };
    });
  }

  it("lists the Powered by OIS product registry foundation", async () => {
    const mock = createMockPrisma();
    mock.delegates.oisEcosystemProduct.findMany.mockResolvedValue([
      { ...stage2FRows.product, productKey: "OIS_PLATFORM" },
      { ...stage2FRows.product, id: "ecosystem_product_pits", productKey: "PITS", displayName: "PITS" },
      { ...stage2FRows.product, id: "ecosystem_product_keihb", productKey: "KEIHB", displayName: "KEIHB" },
      { ...stage2FRows.product, id: "ecosystem_product_icr", productKey: "ICR", displayName: "ICR" },
      { ...stage2FRows.product, id: "ecosystem_product_csagent", productKey: "CSAGENT", displayName: "CSAgent" },
      { ...stage2FRows.product, id: "ecosystem_product_future_product", productKey: "FUTURE_PRODUCT", displayName: "Future Product" },
      { ...stage2FRows.product, id: "ecosystem_product_custom", productKey: "CUSTOM", displayName: "Custom" }
    ]);
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/ecosystem-products" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.products.map((product: { productKey: string }) => product.productKey)).toEqual([
        "OIS_PLATFORM",
        "PITS",
        "KEIHB",
        "ICR",
        "CSAGENT",
        "FUTURE_PRODUCT",
        "CUSTOM"
      ]);
      expect(body.supportedAgentCapabilities).toContain("TEACH_OIS");
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("lets the agent widget submit governed learning without canonical knowledge writes", async () => {
    const mock = createMockPrisma();
    const writeOps: string[] = [];
    enableStage2FWrites(mock, writeOps);
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/platform/agent/learning-submissions",
        payload: {
          organizationId: "org_pmc_demo",
          workspaceId: "ws_pmc_org_demo",
          productKey: "OIS_PLATFORM",
          sourceType: "WIDGET",
          sourceAuthority: "END_USER",
          learningScope: "ORGANIZATION",
          signalType: "USER_CORRECTION",
          rawText: "The project nickname should be Emerald Precinct.",
          contextJson: { route: "/" },
          relatedEntityRefs: []
        }
      });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.noCanonicalKnowledgeWrite).toBe(true);
      expect(body.signal).toMatchObject({
        productKey: "OIS_PLATFORM",
        sourceType: "WIDGET",
        status: "RECEIVED"
      });
      expect(writeOps).toEqual(["oisLearningSignal.create", "auditRecord.create", "oisAgentLearningSubmission.create", "auditRecord.create"]);
      expect(writeOps.join(" ")).not.toMatch(/MasterKnowledge|EntityRegistry|Decision|Commitment|Risk/i);
    } finally {
      await app.close();
    }
  });

  it("creates deterministic learning candidates from signals and only auto-logs Stage 2F learning", async () => {
    const mock = createMockPrisma();
    const writeOps: string[] = [];
    enableStage2FWrites(mock, writeOps);
    mock.delegates.oisLearningSignal.findUnique.mockResolvedValue(stage2FRows.signal);
    mock.delegates.oisLearningPolicy.findMany.mockResolvedValue([stage2FRows.policy]);
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/platform/learning/signals/learning_signal_test/candidates"
      });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.noCanonicalKnowledgeWrite).toBe(true);
      expect(body.candidate).toMatchObject({
        candidateType: "ENTITY_UPDATE",
        policyDecision: "AUTO_LEARN",
        status: "AUTO_LEARNED",
        proposedKnowledgeJson: expect.objectContaining({ canonicalWriteAllowed: false })
      });
      expect(writeOps).toEqual(["oisLearningCandidate.create", "oisLearningSignal.update", "auditRecord.create"]);
    } finally {
      await app.close();
    }
  });

  it("forces executive and sensitive learning candidates into review even with auto policy", async () => {
    const mock = createMockPrisma();
    const writeOps: string[] = [];
    enableStage2FWrites(mock, writeOps);
    mock.delegates.oisLearningSignal.findUnique.mockResolvedValue({
      ...stage2FRows.signal,
      id: "learning_signal_ceo",
      sourceAuthority: "CEO",
      signalType: "STRATEGIC_INTENT",
      rawText: "CEO directive: prioritize legal risk review for all product launches.",
      normalizedText: "CEO directive: prioritize legal risk review for all product launches.",
      relatedEntityRefs: []
    } as any);
    mock.delegates.oisLearningPolicy.findMany.mockResolvedValue([
      {
        ...stage2FRows.policy,
        signalType: "STRATEGIC_INTENT",
        sourceAuthority: "CEO",
        policyMode: "FULL_AUTO_PILOT",
        confidenceThreshold: 0.5
      }
    ]);
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/platform/learning/signals/learning_signal_ceo/candidates"
      });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.candidate).toMatchObject({
        candidateType: "STRATEGIC_PRIORITY",
        policyDecision: "ASK_REVIEW",
        status: "PENDING_REVIEW",
        sourceAuthority: "CEO"
      });
    } finally {
      await app.close();
    }
  });

  it("returns a SuperAdmin Learning Center v0 payload with guard limitation", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/learning/center" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.overview).toMatchObject({
        totalSignals: 1,
        pendingCandidates: 0,
        autoLearnedLogs: 1,
        rejectedOrIgnored: 0
      });
      expect(body.executiveIntentQueue).toEqual([]);
      expect(body.productContributionMap).toEqual(expect.arrayContaining([expect.objectContaining({ productKey: "OIS_PLATFORM" })]));
      expect(body.accessGuard).toMatchObject({
        requiredRole: "SUPERADMIN_OR_ADMIN",
        currentStageMode: "READ_ONLY_PREVIEW_WITH_API_ROLE_CHECKS"
      });
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });
});

describe("Stage 2G Canonical Knowledge Fabric and KEIHB endpoints", () => {
  function enableStage2GMappingWrites(mock: ReturnType<typeof createMockPrisma>, writeOps: string[]) {
    (mock.delegates.auditRecord.create as any).mockImplementation(async (args: { data: Record<string, unknown> }) => {
      writeOps.push("auditRecord.create");
      return args.data;
    });
    (mock.delegates.oisKnowledgeLayerMapping.create as any).mockImplementation(async (args: { data: Record<string, unknown> }) => {
      writeOps.push("oisKnowledgeLayerMapping.create");
      return {
        ...stage2GRows.mapping,
        ...args.data,
        createdAt: "2026-07-09T00:00:00.000Z",
        updatedAt: "2026-07-09T00:00:00.000Z"
      };
    });
    (mock.delegates.oisKnowledgeLayerMapping.update as any).mockImplementation(async (args: { data: Record<string, unknown> }) => {
      writeOps.push("oisKnowledgeLayerMapping.update");
      return {
        ...stage2GRows.mapping,
        ...args.data,
        updatedAt: "2026-07-09T00:00:00.000Z"
      };
    });
  }

  it("lists KL-0 through KL-5 knowledge layers with product consumption mapping", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/knowledge/layers" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.knowledgeLayerTaxonomy.layerKeys).toEqual(knowledgeLayerKeys);
      expect(body.availableLayers.map((layer: { key: string }) => layer.key)).toEqual(knowledgeLayerKeys);
      expect(body.layerKeys).toEqual(knowledgeLayerKeys);
      expect(body.layers).toHaveLength(6);
      expect(body.productConsumptionMap).toEqual(expect.arrayContaining([expect.objectContaining({ productKey: "KEIHB" })]));
      expect(body.boundary).toMatchObject({
        stage: "Stage 2G",
        autoPromotionEnabled: false,
        widgetDirectCanonicalWriteAllowed: false
      });
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("returns canonical knowledge items, detail evidence and evidence links read-only", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const listResponse = await app.inject({ method: "GET", url: "/platform/knowledge/items" });
      const listBody = listResponse.json();

      expect(listResponse.statusCode).toBe(200);
      expect(listBody.summary.byLayer.map((entry: { layerKey: string }) => entry.layerKey)).toEqual(knowledgeLayerKeys);
      expect(listBody.items).toEqual(expect.arrayContaining([expect.objectContaining({ id: stage2GRows.item.id })]));

      const detailResponse = await app.inject({ method: "GET", url: `/platform/knowledge/items/${stage2GRows.item.id}` });
      const detailBody = detailResponse.json();

      expect(detailResponse.statusCode).toBe(200);
      expect(detailBody.item).toMatchObject({ id: stage2GRows.item.id, layerKey: "KL_3_PRODUCT_KNOWLEDGE_PACK" });
      expect(detailBody.evidenceLinks).toEqual(expect.arrayContaining([expect.objectContaining({ id: stage2GRows.evidence.id })]));

      const evidenceResponse = await app.inject({ method: "GET", url: "/platform/knowledge/evidence" });
      const evidenceBody = evidenceResponse.json();

      expect(evidenceResponse.statusCode).toBe(200);
      expect(evidenceBody.summary.totalLinks).toBe(defaultKnowledgeEvidenceLinks.length);
      expect(evidenceBody.evidenceLinks).toEqual(expect.arrayContaining([expect.objectContaining({ id: stage2GRows.evidence.id })]));
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("prepares a learning candidate layer mapping with audit and without canonical promotion", async () => {
    const mock = createMockPrisma();
    const writeOps: string[] = [];
    enableStage2GMappingWrites(mock, writeOps);
    mock.delegates.oisLearningCandidate.findUnique.mockResolvedValue(stage2GRows.candidate as any);
    mock.delegates.oisKnowledgeLayerMapping.findMany.mockResolvedValueOnce([]);
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({
        method: "POST",
        url: `/platform/learning/candidates/${stage2GRows.candidate.id}/layer-mapping`,
        payload: {
          actorId: "user_super_admin_demo",
          actorRole: "SUPERADMIN"
        }
      });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.noCanonicalKnowledgeWrite).toBe(true);
      expect(body.autoPromotionEnabled).toBe(false);
      expect(body.knowledgeLayerTaxonomy.layerKeys).toContain("KL_0_LEGAL_REGULATORY_CORE");
      expect(body.mappingStatusTaxonomy).toEqual(knowledgeLayerMappingStatusTaxonomy);
      expect(body.availableStatuses).toContain("READY_FOR_REVIEW");
      expect(body.mapping).toMatchObject({
        learningCandidateId: stage2GRows.candidate.id,
        targetLayerKey: "KL_3_PRODUCT_KNOWLEDGE_PACK",
        targetItemType: "SOP",
        proposedAction: "CREATE",
        status: "READY_FOR_REVIEW"
      });
      expect(writeOps).toEqual(["oisKnowledgeLayerMapping.create", "auditRecord.create"]);
      expect(mock.delegates.oisCanonicalKnowledgeItem.create).not.toHaveBeenCalled();
      expect(mock.delegates.oisCanonicalKnowledgeItem.update).not.toHaveBeenCalled();
      expect(mock.delegates.oisCanonicalKnowledgeItem.upsert).not.toHaveBeenCalled();
      expect(mock.delegates.oisKnowledgeEvidenceLink.create).not.toHaveBeenCalled();
    } finally {
      await app.close();
    }
  });

  it("returns candidate mapping lists without writes", async () => {
    const mock = createMockPrisma();
    mock.delegates.oisLearningCandidate.findUnique.mockResolvedValue(stage2GRows.candidate as any);
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const candidateResponse = await app.inject({
        method: "GET",
        url: `/platform/learning/candidates/${stage2GRows.candidate.id}/layer-mapping`
      });
      const candidateBody = candidateResponse.json();

      expect(candidateResponse.statusCode).toBe(200);
      expect(candidateBody.knowledgeLayerTaxonomy.layerKeys).toContain("KL_0_LEGAL_REGULATORY_CORE");
      expect(candidateBody.mappingStatusTaxonomy).toEqual(knowledgeLayerMappingStatusTaxonomy);
      expect(candidateBody.availableStatuses).toContain("READY_FOR_REVIEW");
      expect(candidateBody.mappings).toEqual(expect.arrayContaining([expect.objectContaining({ id: stage2GRows.mapping.id })]));

      const listResponse = await app.inject({ method: "GET", url: "/platform/learning/layer-mappings" });
      const listBody = listResponse.json();

      expect(listResponse.statusCode).toBe(200);
      expect(listBody.knowledgeLayerTaxonomy.layerKeys).toEqual(knowledgeLayerKeys);
      expect(listBody.availableLayers.map((layer: { key: string }) => layer.key)).toEqual(knowledgeLayerKeys);
      expect(listBody.mappingStatusTaxonomy).toEqual(knowledgeLayerMappingStatusTaxonomy);
      expect(listBody.availableStatuses).toContain("READY_FOR_REVIEW");
      expect(listBody.mappings).toEqual(expect.arrayContaining([expect.objectContaining({ targetLayerKey: "KL_3_PRODUCT_KNOWLEDGE_PACK" })]));
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("returns mapping status taxonomy even when no mapping rows are present", async () => {
    const mock = createMockPrisma();
    mock.delegates.oisKnowledgeLayerMapping.findMany.mockResolvedValueOnce([]);
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/learning/layer-mappings" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.mappings).toEqual([]);
      expect(body.mappingStatusTaxonomy).toEqual(knowledgeLayerMappingStatusTaxonomy);
      expect(body.availableStatuses).toContain("READY_FOR_REVIEW");
      expect(JSON.stringify(body.mappings)).not.toContain("READY_FOR_REVIEW");
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("returns KEIHB projection bundles and preview as publishing projections only", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const bundlesResponse = await app.inject({ method: "GET", url: "/platform/knowledge/keihb/bundles" });
      const bundlesBody = bundlesResponse.json();

      expect(bundlesResponse.statusCode).toBe(200);
      expect(bundlesBody.knowledgeLayerTaxonomy.layerKeys).toEqual(knowledgeLayerKeys);
      expect(bundlesBody.availableLayers.map((layer: { key: string }) => layer.key)).toEqual(knowledgeLayerKeys);
      expect(bundlesBody.bundles.map((bundle: { bundleKey: string }) => bundle.bundleKey)).toEqual([
        "KEIHB_BUILDING_MANAGEMENT_HANDBOOK_DEMO",
        "KEIHB_BQL_SOP_DEMO",
        "KEIHB_RESIDENT_FAQ_DEMO",
        "KEIHB_TECHNICAL_TEAM_PLAYBOOK_DEMO"
      ]);
      expect(
        bundlesBody.bundles.find((bundle: { bundleKey: string }) => bundle.bundleKey === "KEIHB_BQL_SOP_DEMO").includedLayerKeys
      ).toEqual(["KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_4_WORKSPACE_PROJECT_OVERLAY"]);
      expect(
        bundlesBody.bundles.find((bundle: { bundleKey: string }) => bundle.bundleKey === "KEIHB_BQL_SOP_DEMO").includedLayerKeys
      ).not.toContain("KL_0_LEGAL_REGULATORY_CORE");
      expect(bundlesBody.projectionBoundary).toMatchObject({
        sourceOfTruth: "OIS Knowledge Fabric",
        canonicalWriteAllowed: false
      });

      const previewResponse = await app.inject({ method: "GET", url: "/platform/knowledge/keihb/preview" });
      const previewBody = previewResponse.json();

      expect(previewResponse.statusCode).toBe(200);
      expect(previewBody.knowledgeLayerTaxonomy.layerKeys).toContain("KL_0_LEGAL_REGULATORY_CORE");
      expect(previewBody.bundles[0].items.length).toBeGreaterThan(0);
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("returns knowledge context with global taxonomy metadata and scoped result layers", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/knowledge/context" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.knowledgeLayerTaxonomy.layerKeys).toEqual(knowledgeLayerKeys);
      expect(body.availableLayers.map((layer: { key: string }) => layer.key)).toEqual(knowledgeLayerKeys);
      expect(body.layers.map((layer: { key: string }) => layer.key)).toEqual([
        "KL_2_ORGANIZATION_CORE",
        "KL_3_PRODUCT_KNOWLEDGE_PACK",
        "KL_4_WORKSPACE_PROJECT_OVERLAY"
      ]);
      expect(body.layers.map((layer: { key: string }) => layer.key)).not.toContain("KL_0_LEGAL_REGULATORY_CORE");
      expect(body.noCanonicalWrite).toBe(true);
      expect(body.boundary.autoPromotionEnabled).toBe(false);
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("returns deterministic agent knowledge context without LLM calls or canonical writes", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({
        method: "POST",
        url: "/platform/agent/knowledge-context",
        payload: {
          productKey: "OIS_PLATFORM",
          organizationId: "org_pmc_demo",
          workspaceId: "ws_pmc_org_demo",
          requestedLayers: ["KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK"],
          includeEvidence: true,
          includeDrafts: true
        }
      });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.runtime).toMatchObject({
        mode: "deterministic-agent-knowledge-context",
        noLlmCall: true,
        noCanonicalWrite: true,
        autoPromotionEnabled: false
      });
      expect(body.noLlmCall).toBe(true);
      expect(body.noCanonicalWrite).toBe(true);
      expect(body.knowledgeLayerTaxonomy.layerKeys).toContain("KL_0_LEGAL_REGULATORY_CORE");
      expect(body.boundary.agentLearningPath).toBe("Teach OIS still creates Learning Signal only.");
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("returns the architecture mindmap manifest for future agent navigation", async () => {
    const mock = createMockPrisma();
    const app = buildCoreApi({ prisma: mock.prisma });

    try {
      const response = await app.inject({ method: "GET", url: "/platform/architecture/mindmap" });
      const body = response.json();

      expect(response.statusCode).toBe(200);
      expect(body.mindmap).toMatchObject({
        stage: "Stage 2G",
        title: architectureMindmapManifest.title
      });
      expect(body.mindmap.apiContracts).toContain("/platform/agent/knowledge-context");
      expect(body.source.file).toBe("architecture/mindmap/ois-ecosystem-map.v1.json");
      expect(mock.writeCalls).toEqual([]);
    } finally {
      await app.close();
    }
  });

  it("keeps widgets and Stage 2G APIs away from canonical item mutation and auto-promotion", () => {
    const stage2FSource = readFileSync(new URL("./stage-2f.ts", import.meta.url), "utf8");
    const stage2GSource = readFileSync(new URL("./stage-2g.ts", import.meta.url), "utf8");

    expect(stage2FSource).not.toMatch(/oisCanonicalKnowledgeItem\.(create|update|upsert|delete)/);
    expect(stage2GSource).not.toMatch(/oisCanonicalKnowledgeItem\.(create|update|upsert|delete)/);
    expect(stage2GSource).not.toMatch(/oisLearningCandidate\.(update|upsert)/);
    expect(stage2GSource).not.toMatch(/app\.(post|put|patch|delete)\(\s*["'`]\/platform\/knowledge\/items/);
    expect(stage2GSource).toContain("autoPromotionEnabled: false");
    expect(stage2GSource).toContain("canonicalKnowledgeWrite: false");
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
