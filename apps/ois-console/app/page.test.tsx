import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";
import DashboardPage from "./dashboard/page";
import InstallationDetailPage from "./installations/[id]/page";
import ModuleDetailPage from "./modules/[id]/page";
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
    expect(html).toContain("Dashboard");
    expect(html).toContain("Products");
    expect(html).toContain("Workspaces");
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
  });

  it.each([
    ["dashboard", DashboardPage, ["Platform Overview", "Control plane areas", "Registry ready", "/products/prod_pits"]],
    ["products", ProductsPage, ["Products &amp; Modules", "Product &amp; Module Overview", "PITS_RUNTIME_SHELL", "/products/prod_pits"]],
    [
      "workspaces",
      WorkspacesPage,
      ["Organizations, Workspaces &amp; Projects", "Workspace Overview", "PMC Org Demo", "Emerald Precinct Demo", "/workspaces/ws_pmc_org_demo"]
    ],
    ["runtime", RuntimePage, ["Runtime Status", "Health ready", "Registry ready"]]
  ] satisfies Array<[string, RouteComponent, string[]]>)("renders the %s route shell", async (_name, Component, markers) => {
    mockCoreApiFetch();

    const html = await renderRouteHtml(Component);

    expect(html).toContain("OIS_CONSOLE");
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

    await expect(renderRouteHtml(Page)).resolves.toContain("OIS Console");
    expect(process.env[dbEnvKey]).toBeUndefined();
  });

  it("renders product detail with cross-product PITS links", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProductDetailPage({ params: Promise.resolve({ id: "prod_pits" }) }));

    expect(html).toContain("Product Detail Source");
    expect(html).toContain('data-detail-source="Product Detail Source"');
    expect(html).toContain("PITS_RUNTIME_SHELL");
    expect(html).toContain("/modules/module_pits_runtime_shell");
    expect(html).toContain(`${pitsPublicBaseUrl}/projects/prj_emerald_precinct_demo`);
    expect(html).toContain("Cross-product staging link");
    expect(html).not.toContain(dbEnvKey);
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/products/prod_pits`, { cache: "no-store" });
  });

  it("renders product detail fallback for a controlled Core API 404", async () => {
    mockCoreApiFetch();

    const html = renderToStaticMarkup(await ProductDetailPage({ params: Promise.resolve({ id: "missing" }) }));

    expect(html).toContain("Product Not Found");
    expect(html).toContain("Product not linked yet");
    expect(html).toContain("Not found");
    expect(html).not.toContain(dbEnvKey);
  });

  it.each([
    ["workspace", WorkspaceDetailPage, "ws_pmc_org_demo", ["Workspace Detail Source", "https://pits-ng.dmp247.com/projects/prj_emerald_precinct_demo"]],
    ["module", ModuleDetailPage, "module_pits_runtime_shell", ["Module Detail Source", "/products/prod_pits", "inst_pits_emerald"]],
    ["installation", InstallationDetailPage, "inst_pits_emerald", ["Installation Detail Source", "/products/prod_pits", "/modules/module_pits_runtime_shell"]]
  ] satisfies Array<[string, (props: { params: Promise<{ id: string }> }) => Promise<ReactElement>, string, string[]]>)(
    "renders %s detail route",
    async (_name, Component, id, markers) => {
      mockCoreApiFetch();

      const html = renderToStaticMarkup(await Component({ params: Promise.resolve({ id }) }));

      for (const marker of markers) {
        expect(html).toContain(marker);
      }
      expect(html).toContain(`data-detail-source="${markers[0]}"`);
      expect(html).toContain("Detail ready");
      expect(html).not.toContain(dbEnvKey);
    }
  );
});
