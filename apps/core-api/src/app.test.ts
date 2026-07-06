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

function createWriteGuard(name: string, writeCalls: string[]) {
  return vi.fn(() => {
    writeCalls.push(name);
    throw new Error(`Unexpected Prisma write operation: ${name}`);
  });
}

function createCountDelegate(name: string, count: number, readCalls: string[], writeCalls: string[]) {
  return {
    count: vi.fn(async () => {
      readCalls.push(`${name}.count`);
      return count;
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
    organization: createCountDelegate("organization", counts.organizations, readCalls, writeCalls),
    workspace: createCountDelegate("workspace", counts.workspaces, readCalls, writeCalls),
    project: createCountDelegate("project", counts.projects, readCalls, writeCalls),
    productDefinition: createCountDelegate("productDefinition", counts.products, readCalls, writeCalls),
    productInstallation: {
      ...createCountDelegate("productInstallation", counts.installations, readCalls, writeCalls),
      findUnique: vi.fn(async () => null)
    },
    moduleDefinition: createCountDelegate("moduleDefinition", counts.modules, readCalls, writeCalls),
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
