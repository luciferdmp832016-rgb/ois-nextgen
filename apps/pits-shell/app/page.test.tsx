import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";
import ProjectsPage from "./projects/page";
import ProjectDetailPage from "./projects/[id]/page";
import RuntimePage from "./runtime/page";

const coreApiUrl = "https://ois-nextgen.abacusai.cloud";
const oisPublicBaseUrl = "https://ois-ng.dmp247.com";
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
    expect(html).toContain("Project Runtime Overview");
    expect(html).toContain("Project Selector");
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
  });

  it.each([
    ["projects", ProjectsPage, ["Project Selector", "EMERALD_PRECINCT_DEMO", "/projects/prj_emerald_precinct_demo", "Project Installation Registry"]],
    ["runtime", RuntimePage, ["Runtime Status", "Health ready", "Project Installation Registry"]]
  ] satisfies Array<[string, RouteComponent, string[]]>)("renders the %s route shell", async (_name, Component, markers) => {
    mockCoreApiFetch();

    const html = await renderRouteHtml(Component);

    expect(html).toContain("PITS_SHELL");
    expect(html).toContain(coreApiUrl);
    expect(html).toContain("Core API healthy");
    expect(html).toContain("DEMO DATA - NOT PRODUCTION");
    for (const marker of markers) {
      expect(html).toContain(marker);
    }
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
    expect(html).toContain("PITS_RUNTIME_SHELL");
    expect(html).toContain(`${oisPublicBaseUrl}/products/prod_pits`);
    expect(html).toContain(`${oisPublicBaseUrl}/workspaces/ws_pmc_org_demo`);
    expect(html).toContain("Cross-product staging link");
    expect(html).not.toContain(dbEnvKey);
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/projects/prj_emerald_precinct_demo`, { cache: "no-store" });
  });

  it("renders project detail fallback for a controlled Core API 404", async () => {
    mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProjectDetailPage({ params: Promise.resolve({ id: "missing" }) }));

    expect(html).toContain("Project Not Found");
    expect(html).toContain("Project not linked yet");
    expect(html).toContain("Not found");
    expect(html).not.toContain(dbEnvKey);
  });
});
