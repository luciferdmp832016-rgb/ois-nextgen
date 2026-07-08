import Fastify, { type FastifyReply } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";

const demoLoginSchema = z.object({
  email: z.string().email(),
  product: z.enum(["OIS", "PITS"]).default("OIS")
});

const serviceIdentity = {
  service: "ois-nextgen-core-api",
  status: "ok",
  version: "0.1.0",
  health: "/health",
  docs: "/docs"
} as const;

const publicRuntimeConfig = {
  coreApiBaseUrl: "https://ois-nextgen.abacusai.cloud",
  oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
  pitsShellBaseUrl: "https://pits-ng.dmp247.com"
} as const;

function registryMetadata() {
  return {
    source: "default-db",
    mode: "read-only",
    environment: "staging",
    generatedAt: new Date().toISOString()
  };
}

export type CoreApiPrismaClient = Pick<
  PrismaClient,
  | "$disconnect"
  | "auditRecord"
  | "industry"
  | "moduleDefinition"
  | "organization"
  | "productDefinition"
  | "productInstallation"
  | "project"
  | "userAccount"
  | "workspace"
>;

export interface BuildCoreApiOptions {
  prisma?: CoreApiPrismaClient;
}

export function buildCoreApi(options: BuildCoreApiOptions = {}) {
  const app = Fastify({ logger: { name: "ois-nextgen-core-api" } });
  const prisma = options.prisma ?? new PrismaClient();

  const productSummary = (product: { id: string; code: string; name: string; lifecycle: string; version: number }) => ({
    id: product.id,
    code: product.code,
    name: product.name,
    lifecycle: product.lifecycle,
    version: product.version
  });

  const organizationSummary = (organization: { id: string; code: string; name: string; lifecycle: string; version: number }) => ({
    id: organization.id,
    code: organization.code,
    name: organization.name,
    lifecycle: organization.lifecycle,
    version: organization.version
  });

  const workspaceSummary = (workspace: {
    id: string;
    code: string;
    name: string;
    organizationId: string;
    lifecycle: string;
    version: number;
  }) => ({
    id: workspace.id,
    code: workspace.code,
    name: workspace.name,
    organizationId: workspace.organizationId,
    lifecycle: workspace.lifecycle,
    version: workspace.version
  });

  const projectSummary = (project: {
    id: string;
    code: string;
    name: string;
    workspaceId: string;
    lifecycle: string;
    version: number;
  }) => ({
    id: project.id,
    code: project.code,
    name: project.name,
    workspaceId: project.workspaceId,
    lifecycle: project.lifecycle,
    version: project.version
  });

  const moduleSummary = (module: {
    id: string;
    code: string;
    productCode: string;
    layerCode: string;
    scope: string;
    realmCode: string;
    moduleType: string;
    lifecycle: string;
    version: number;
  }) => ({
    id: module.id,
    code: module.code,
    productCode: module.productCode,
    layerCode: module.layerCode,
    scope: module.scope,
    realmCode: module.realmCode,
    moduleType: module.moduleType,
    lifecycle: module.lifecycle,
    version: module.version
  });

  const installationSummary = (installation: {
    id: string;
    productCode: string;
    productId: string;
    organizationId: string;
    workspaceId: string;
    projectId: string;
    lifecycle: string;
    version: number;
    product?: { code: string; name: string } | null;
    organization?: { code: string; name: string } | null;
    workspace?: { code: string; name: string } | null;
    project?: { code: string; name: string } | null;
  }) => ({
    id: installation.id,
    productCode: installation.productCode,
    productId: installation.productId,
    organizationId: installation.organizationId,
    workspaceId: installation.workspaceId,
    projectId: installation.projectId,
    lifecycle: installation.lifecycle,
    version: installation.version,
    product: installation.product
      ? {
          code: installation.product.code,
          name: installation.product.name
        }
      : null,
    organization: installation.organization
      ? {
          code: installation.organization.code,
          name: installation.organization.name
        }
      : null,
    workspace: installation.workspace
      ? {
          code: installation.workspace.code,
          name: installation.workspace.name
        }
      : null,
    project: installation.project
      ? {
          code: installation.project.code,
          name: installation.project.name
        }
      : null
  });

  const byCode = <T extends { code: string }>(left: T, right: T) => left.code.localeCompare(right.code);
  const uniqueById = <T extends { id?: string }>(items: T[]) => {
    const seen = new Set<string>();
    return items.filter((item) => {
      if (!item.id || seen.has(item.id)) {
        return false;
      }

      seen.add(item.id);
      return true;
    });
  };

  function registryNotFound(reply: FastifyReply, entity: string, lookup: Record<string, string>) {
    return reply.code(404).send({
      metadata: registryMetadata(),
      error: {
        code: "NOT_FOUND",
        entity,
        lookup,
        message: `${entity} not found`
      }
    });
  }

  async function readProducts() {
    const products = await prisma.productDefinition.findMany({
      include: {
        modules: true,
        installations: {
          include: {
            organization: true,
            workspace: true,
            project: true
          }
        }
      },
      orderBy: { code: "asc" }
    });

    return products.map((product) => ({
      ...productSummary(product),
      modules: product.modules.slice().sort(byCode).map(moduleSummary),
      installations: product.installations
        .slice()
        .sort((left, right) => `${left.projectId}:${left.productCode}`.localeCompare(`${right.projectId}:${right.productCode}`))
        .map(installationSummary)
    }));
  }

  async function readWorkspaces() {
    const [organizations, workspaces] = await Promise.all([
      prisma.organization.findMany({
        include: { industry: true },
        orderBy: { code: "asc" }
      }),
      prisma.workspace.findMany({
        include: {
          organization: true,
          projects: true,
          installations: true
        },
        orderBy: { code: "asc" }
      })
    ]);

    return {
      organizations: organizations.map((organization) => ({
        ...organizationSummary(organization),
        industry: {
          id: organization.industry.id,
          code: organization.industry.code,
          name: organization.industry.name
        }
      })),
      workspaces: workspaces.map((workspace) => ({
        ...workspaceSummary(workspace),
        organization: {
          id: workspace.organization.id,
          code: workspace.organization.code,
          name: workspace.organization.name
        },
        projects: workspace.projects.slice().sort(byCode).map(projectSummary),
        installations: workspace.installations
          .slice()
          .sort((left, right) => `${left.projectId}:${left.productCode}`.localeCompare(`${right.projectId}:${right.productCode}`))
          .map((installation) => ({
            id: installation.id,
            productCode: installation.productCode,
            projectId: installation.projectId,
            lifecycle: installation.lifecycle
          }))
      }))
    };
  }

  async function readProjects() {
    const projects = await prisma.project.findMany({
      include: {
        workspace: { include: { organization: true } },
        installations: { include: { product: true } }
      },
      orderBy: { code: "asc" }
    });

    return projects.map((project) => ({
      ...projectSummary(project),
      workspace: {
        id: project.workspace.id,
        code: project.workspace.code,
        name: project.workspace.name
      },
      organization: {
        id: project.workspace.organization.id,
        code: project.workspace.organization.code,
        name: project.workspace.organization.name
      },
      installations: project.installations
        .slice()
        .sort((left, right) => `${left.productCode}:${left.id}`.localeCompare(`${right.productCode}:${right.id}`))
        .map((installation) => ({
          id: installation.id,
          productId: installation.productId,
          productCode: installation.productCode,
          productName: installation.product.name,
          lifecycle: installation.lifecycle,
          version: installation.version
        }))
    }));
  }

  async function readModules() {
    const modules = await prisma.moduleDefinition.findMany({
      include: { product: true },
      orderBy: { code: "asc" }
    });

    return modules.map((module) => ({
      ...moduleSummary(module),
      product: {
        id: module.product.id,
        code: module.product.code,
        name: module.product.name
      }
    }));
  }

  async function readInstallations() {
    const installations = await prisma.productInstallation.findMany({
      include: {
        product: true,
        organization: true,
        workspace: true,
        project: true
      },
      orderBy: { id: "asc" }
    });

    return installations.map(installationSummary);
  }

  async function readRegistry() {
    const [products, workspaceRegistry, projects, modules, installations] = await Promise.all([
      readProducts(),
      readWorkspaces(),
      readProjects(),
      readModules(),
      readInstallations()
    ]);

    return {
      metadata: registryMetadata(),
      products,
      organizations: workspaceRegistry.organizations,
      workspaces: workspaceRegistry.workspaces,
      projects,
      modules,
      installations
    };
  }

  type RegistrySnapshot = Awaited<ReturnType<typeof readRegistry>>;
  type ProductRegistryEntity = RegistrySnapshot["products"][number];
  type RegistryHealthStatus =
    | "Healthy"
    | "Configured"
    | "Linked"
    | "Reachable"
    | "Missing URL"
    | "Not applicable"
    | "Degraded"
    | "Unavailable";
  type RegistryHealthEntityKind = "product" | "workspace" | "project" | "module" | "installation";
  type RegistryHealthCheck = {
    label: string;
    status: RegistryHealthStatus;
    ok: boolean;
    required: boolean;
    detail: string;
    url: string | null;
  };

  function publicRuntimeUrl(baseUrl: string, path: string) {
    const normalizedBase = baseUrl.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;
    return `${normalizedBase}${normalizedPath}`;
  }

  function coreApiUrl(path: string) {
    return publicRuntimeUrl(publicRuntimeConfig.coreApiBaseUrl, path);
  }

  function oisConsoleUrl(path: string) {
    return publicRuntimeUrl(publicRuntimeConfig.oisConsoleBaseUrl, path);
  }

  function pitsShellUrl(path: string) {
    return publicRuntimeUrl(publicRuntimeConfig.pitsShellBaseUrl, path);
  }

  function healthCheck(
    label: string,
    status: RegistryHealthStatus,
    ok: boolean,
    required: boolean,
    detail: string,
    url: string | null = null
  ): RegistryHealthCheck {
    return {
      label,
      status,
      ok,
      required,
      detail,
      url
    };
  }

  function deriveHealthStatus(checks: RegistryHealthCheck[]): "Healthy" | "Degraded" | "Unavailable" {
    const requiredChecks = checks.filter((check) => check.required);

    if (requiredChecks.some((check) => check.status === "Unavailable")) {
      return "Unavailable";
    }

    if (requiredChecks.some((check) => !check.ok || check.status === "Missing URL")) {
      return "Degraded";
    }

    return "Healthy";
  }

  function healthBadges(status: "Healthy" | "Degraded" | "Unavailable", checks: RegistryHealthCheck[]) {
    return Array.from(new Set<RegistryHealthStatus>([status, ...checks.map((check) => check.status)]));
  }

  function buildHealthEntity({
    kind,
    id,
    code,
    name,
    lifecycle,
    checks,
    links
  }: {
    kind: RegistryHealthEntityKind;
    id: string;
    code: string;
    name: string;
    lifecycle: string;
    checks: RegistryHealthCheck[];
    links: Record<string, string | null>;
  }) {
    const status = deriveHealthStatus(checks);

    return {
      kind,
      id,
      code,
      name,
      lifecycle,
      status,
      badges: healthBadges(status, checks),
      checks,
      links
    };
  }

  function buildRegistryHealth(registry: RegistrySnapshot) {
    const productHealth = registry.products.map((product) => {
      const productPath = `/platform/products/${encodeURIComponent(product.id)}`;
      const oisProductPath = `/products/${encodeURIComponent(product.id)}`;
      const firstProjectId = product.installations[0]?.projectId;
      const productRuntimeUrl =
        product.code === "OIS"
          ? publicRuntimeConfig.oisConsoleBaseUrl
          : product.code === "PITS"
            ? publicRuntimeConfig.pitsShellBaseUrl
            : null;
      const projectRuntimeUrl = firstProjectId ? pitsShellUrl(`/projects/${encodeURIComponent(firstProjectId)}`) : null;

      return buildHealthEntity({
        kind: "product",
        id: product.id,
        code: product.code,
        name: product.name,
        lifecycle: product.lifecycle,
        links: {
          coreApiDetail: coreApiUrl(productPath),
          oisConsoleDetail: oisConsoleUrl(oisProductPath),
          productRuntime: productRuntimeUrl,
          pitsProject: projectRuntimeUrl
        },
        checks: [
          healthCheck("Registry row", "Configured", Boolean(product.id && product.code), true, "Product registry row is present."),
          healthCheck(
            "Lifecycle",
            product.lifecycle === "ACTIVE" ? "Configured" : "Unavailable",
            product.lifecycle === "ACTIVE",
            true,
            `Lifecycle is ${product.lifecycle}.`
          ),
          healthCheck(
            "Module links",
            product.modules.length > 0 ? "Linked" : "Unavailable",
            product.modules.length > 0,
            true,
            `${product.modules.length} module link(s) returned.`
          ),
          healthCheck(
            "Installation links",
            product.installations.length > 0 ? "Linked" : "Unavailable",
            product.installations.length > 0,
            true,
            `${product.installations.length} installation link(s) returned.`
          ),
          healthCheck(
            "Core API detail source",
            "Reachable",
            true,
            true,
            "Read-only Core API detail URL is configured for staging.",
            coreApiUrl(productPath)
          ),
          healthCheck(
            "OIS Console detail link",
            "Reachable",
            true,
            true,
            "OIS Console product detail URL is staging-safe.",
            oisConsoleUrl(oisProductPath)
          ),
          productRuntimeUrl
            ? healthCheck(
                "Product runtime URL",
                "Reachable",
                true,
                false,
                "Product runtime base URL is configured for this Stage 1D product.",
                productRuntimeUrl
              )
            : healthCheck(
                "Product runtime URL",
                "Not applicable",
                true,
                false,
                "No dedicated public runtime URL is active for this product in Stage 1D."
              ),
          projectRuntimeUrl
            ? healthCheck(
                "PITS project runtime link",
                "Reachable",
                true,
                false,
                "At least one related PITS project URL is configured.",
                projectRuntimeUrl
              )
            : healthCheck(
                "PITS project runtime link",
                product.code === "PITS" ? "Missing URL" : "Not applicable",
                product.code !== "PITS",
                product.code === "PITS",
                product.code === "PITS"
                  ? "PITS products require at least one project installation to build a runtime link."
                  : "Only PITS product installations expose project runtime links in Stage 1D."
              )
        ]
      });
    });

    const workspaceHealth = registry.workspaces.map((workspace) => {
      const workspacePath = `/platform/workspaces/${encodeURIComponent(workspace.id)}`;
      const oisWorkspacePath = `/workspaces/${encodeURIComponent(workspace.id)}`;
      const firstProjectId = workspace.projects[0]?.id;
      const firstPitsProjectUrl = firstProjectId ? pitsShellUrl(`/projects/${encodeURIComponent(firstProjectId)}`) : null;

      return buildHealthEntity({
        kind: "workspace",
        id: workspace.id,
        code: workspace.code,
        name: workspace.name,
        lifecycle: workspace.lifecycle,
        links: {
          coreApiDetail: coreApiUrl(workspacePath),
          oisConsoleDetail: oisConsoleUrl(oisWorkspacePath),
          pitsProject: firstPitsProjectUrl
        },
        checks: [
          healthCheck("Registry row", "Configured", Boolean(workspace.id && workspace.code), true, "Workspace registry row is present."),
          healthCheck(
            "Lifecycle",
            workspace.lifecycle === "ACTIVE" ? "Configured" : "Unavailable",
            workspace.lifecycle === "ACTIVE",
            true,
            `Lifecycle is ${workspace.lifecycle}.`
          ),
          healthCheck("Organization link", "Linked", Boolean(workspace.organization?.code), true, "Workspace has an organization link."),
          healthCheck(
            "Project links",
            workspace.projects.length > 0 ? "Linked" : "Unavailable",
            workspace.projects.length > 0,
            true,
            `${workspace.projects.length} project link(s) returned.`
          ),
          healthCheck(
            "Installation links",
            workspace.installations.length > 0 ? "Linked" : "Unavailable",
            workspace.installations.length > 0,
            false,
            `${workspace.installations.length} installation link(s) returned.`
          ),
          healthCheck(
            "Core API detail source",
            "Reachable",
            true,
            true,
            "Read-only Core API workspace detail URL is configured for staging.",
            coreApiUrl(workspacePath)
          ),
          healthCheck(
            "OIS Console detail link",
            "Reachable",
            true,
            true,
            "OIS Console workspace detail URL is staging-safe.",
            oisConsoleUrl(oisWorkspacePath)
          ),
          firstPitsProjectUrl
            ? healthCheck(
                "PITS project runtime link",
                "Reachable",
                true,
                false,
                "At least one workspace project URL is configured for PITS Shell.",
                firstPitsProjectUrl
              )
            : healthCheck(
                "PITS project runtime link",
                "Missing URL",
                false,
                false,
                "No project link is available to build a PITS Shell URL."
              )
        ]
      });
    });

    const projectHealth = registry.projects.map((project) => {
      const projectPath = `/platform/projects/${encodeURIComponent(project.id)}`;
      const pitsProjectPath = `/projects/${encodeURIComponent(project.id)}`;
      const firstInstallation = project.installations[0];
      const productId = firstInstallation?.productId;
      const oisProductUrl = productId ? oisConsoleUrl(`/products/${encodeURIComponent(productId)}`) : null;
      const oisWorkspaceUrl = project.workspaceId ? oisConsoleUrl(`/workspaces/${encodeURIComponent(project.workspaceId)}`) : null;

      return buildHealthEntity({
        kind: "project",
        id: project.id,
        code: project.code,
        name: project.name,
        lifecycle: project.lifecycle,
        links: {
          coreApiDetail: coreApiUrl(projectPath),
          pitsProjectDetail: pitsShellUrl(pitsProjectPath),
          oisProduct: oisProductUrl,
          oisWorkspace: oisWorkspaceUrl
        },
        checks: [
          healthCheck("Registry row", "Configured", Boolean(project.id && project.code), true, "Project registry row is present."),
          healthCheck(
            "Lifecycle",
            project.lifecycle === "ACTIVE" ? "Configured" : "Unavailable",
            project.lifecycle === "ACTIVE",
            true,
            `Lifecycle is ${project.lifecycle}.`
          ),
          healthCheck("Workspace link", project.workspace?.code ? "Linked" : "Unavailable", Boolean(project.workspace?.code), true, "Project has a workspace link."),
          healthCheck(
            "Installation links",
            project.installations.length > 0 ? "Linked" : "Unavailable",
            project.installations.length > 0,
            true,
            `${project.installations.length} installation link(s) returned.`
          ),
          healthCheck(
            "Core API detail source",
            "Reachable",
            true,
            true,
            "Read-only Core API project detail URL is configured for staging.",
            coreApiUrl(projectPath)
          ),
          healthCheck(
            "PITS Shell project detail",
            "Reachable",
            true,
            true,
            "PITS Shell project detail URL is staging-safe.",
            pitsShellUrl(pitsProjectPath)
          ),
          oisWorkspaceUrl
            ? healthCheck(
                "OIS workspace link",
                "Reachable",
                true,
                false,
                "Related OIS Console workspace URL is configured.",
                oisWorkspaceUrl
              )
            : healthCheck("OIS workspace link", "Missing URL", false, false, "Project has no workspace ID for an OIS Console link."),
          oisProductUrl
            ? healthCheck("OIS product link", "Reachable", true, false, "Related OIS Console product URL is configured.", oisProductUrl)
            : healthCheck("OIS product link", "Missing URL", false, false, "Project has no product installation for an OIS Console link.")
        ]
      });
    });

    const moduleHealth = registry.modules.map((module) => {
      const modulePath = `/platform/modules/${encodeURIComponent(module.id)}`;
      const oisModulePath = `/modules/${encodeURIComponent(module.id)}`;
      const product = registry.products.find((item) => item.code === module.productCode) ?? null;

      return buildHealthEntity({
        kind: "module",
        id: module.id,
        code: module.code,
        name: module.code,
        lifecycle: module.lifecycle,
        links: {
          coreApiDetail: coreApiUrl(modulePath),
          oisConsoleDetail: oisConsoleUrl(oisModulePath),
          oisProduct: product ? oisConsoleUrl(`/products/${encodeURIComponent(product.id)}`) : null
        },
        checks: [
          healthCheck("Registry row", "Configured", Boolean(module.id && module.code), true, "Module registry row is present."),
          healthCheck(
            "Lifecycle",
            module.lifecycle === "ACTIVE" ? "Configured" : "Unavailable",
            module.lifecycle === "ACTIVE",
            true,
            `Lifecycle is ${module.lifecycle}.`
          ),
          healthCheck("Product link", product ? "Linked" : "Unavailable", Boolean(product), true, "Module has an owning product link."),
          healthCheck(
            "Core API detail source",
            "Reachable",
            true,
            true,
            "Read-only Core API module detail URL is configured for staging.",
            coreApiUrl(modulePath)
          ),
          healthCheck(
            "OIS Console detail link",
            "Reachable",
            true,
            true,
            "OIS Console module detail URL is staging-safe.",
            oisConsoleUrl(oisModulePath)
          ),
          healthCheck(
            "Product runtime URL",
            "Not applicable",
            true,
            false,
            "Modules do not expose standalone product runtime URLs in Stage 1D."
          )
        ]
      });
    });

    const installationHealth = registry.installations.map((installation) => {
      const installationPath = `/platform/installations/${encodeURIComponent(installation.id)}`;
      const oisInstallationPath = `/installations/${encodeURIComponent(installation.id)}`;
      const pitsProjectUrl = installation.projectId ? pitsShellUrl(`/projects/${encodeURIComponent(installation.projectId)}`) : null;

      return buildHealthEntity({
        kind: "installation",
        id: installation.id,
        code: installation.productCode,
        name: `${installation.productCode} installation`,
        lifecycle: installation.lifecycle,
        links: {
          coreApiDetail: coreApiUrl(installationPath),
          oisConsoleDetail: oisConsoleUrl(oisInstallationPath),
          oisProduct: installation.productId ? oisConsoleUrl(`/products/${encodeURIComponent(installation.productId)}`) : null,
          oisWorkspace: installation.workspaceId ? oisConsoleUrl(`/workspaces/${encodeURIComponent(installation.workspaceId)}`) : null,
          pitsProject: pitsProjectUrl
        },
        checks: [
          healthCheck("Registry row", "Configured", Boolean(installation.id && installation.productCode), true, "Installation registry row is present."),
          healthCheck(
            "Lifecycle",
            installation.lifecycle === "ACTIVE" ? "Configured" : "Unavailable",
            installation.lifecycle === "ACTIVE",
            true,
            `Lifecycle is ${installation.lifecycle}.`
          ),
          healthCheck("Product link", installation.product ? "Linked" : "Unavailable", Boolean(installation.product), true, "Installation has a product link."),
          healthCheck("Workspace link", installation.workspace ? "Linked" : "Unavailable", Boolean(installation.workspace), true, "Installation has a workspace link."),
          healthCheck("Project link", installation.project ? "Linked" : "Unavailable", Boolean(installation.project), true, "Installation has a project link."),
          healthCheck(
            "Core API detail source",
            "Reachable",
            true,
            true,
            "Read-only Core API installation detail URL is configured for staging.",
            coreApiUrl(installationPath)
          ),
          healthCheck(
            "OIS Console detail link",
            "Reachable",
            true,
            true,
            "OIS Console installation detail URL is staging-safe.",
            oisConsoleUrl(oisInstallationPath)
          ),
          installation.productCode === "PITS" && pitsProjectUrl
            ? healthCheck("PITS project runtime link", "Reachable", true, true, "PITS project runtime URL is configured.", pitsProjectUrl)
            : healthCheck(
                "PITS project runtime link",
                installation.productCode === "PITS" ? "Missing URL" : "Not applicable",
                installation.productCode !== "PITS",
                installation.productCode === "PITS",
                installation.productCode === "PITS"
                  ? "PITS installation has no project ID for a runtime URL."
                  : "Only PITS installations expose a PITS Shell project runtime URL in Stage 1D."
              )
        ]
      });
    });

    const allEntities = [...productHealth, ...workspaceHealth, ...projectHealth, ...moduleHealth, ...installationHealth];
    const countByStatus = (status: "Healthy" | "Degraded" | "Unavailable") => allEntities.filter((item) => item.status === status).length;
    const missingUrlCount = allEntities.filter((item) => item.checks.some((check) => check.status === "Missing URL")).length;
    const summaryStatus = countByStatus("Unavailable") > 0 || countByStatus("Degraded") > 0 ? "Degraded" : "Healthy";

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        reachabilityMode: "configured-url",
        note: "Reachable means a staging-safe public URL is configured; this read-only API does not probe external UI routes."
      },
      summary: {
        status: summaryStatus,
        total: allEntities.length,
        healthy: countByStatus("Healthy"),
        degraded: countByStatus("Degraded"),
        unavailable: countByStatus("Unavailable"),
        missingUrl: missingUrlCount
      },
      entities: {
        products: productHealth,
        workspaces: workspaceHealth,
        projects: projectHealth,
        modules: moduleHealth,
        installations: installationHealth
      }
    };
  }

  function buildProductDetail(registry: RegistrySnapshot, product: ProductRegistryEntity) {
    const projects = uniqueById(
      product.installations
        .map((installation) => registry.projects.find((project) => project.id === installation.projectId))
        .filter((project): project is NonNullable<typeof project> => Boolean(project))
    );
    const workspaces = uniqueById(
      product.installations
        .map((installation) => registry.workspaces.find((workspace) => workspace.id === installation.workspaceId))
        .filter((workspace): workspace is NonNullable<typeof workspace> => Boolean(workspace))
    );

    return {
      ...product,
      relationships: {
        modules: product.modules,
        installations: product.installations,
        projects,
        workspaces
      }
    };
  }

  async function readProductDetailById(id: string) {
    const registry = await readRegistry();
    const product = registry.products.find((item) => item.id === id);

    if (!product) {
      return { registry, product: null };
    }

    return {
      registry,
      product: buildProductDetail(registry, product)
    };
  }

  async function readProductDetailByCode(code: string) {
    const registry = await readRegistry();
    const product = registry.products.find((item) => item.code === code);

    if (!product) {
      return { registry, product: null };
    }

    return {
      registry,
      product: buildProductDetail(registry, product)
    };
  }

  async function readWorkspaceDetailById(id: string) {
    const registry = await readRegistry();
    const workspace = registry.workspaces.find((item) => item.id === id);

    if (!workspace) {
      return { registry, workspace: null };
    }

    const products = uniqueById(
      workspace.installations
        .map((installation) => registry.products.find((product) => product.code === installation.productCode))
        .filter((product): product is NonNullable<typeof product> => Boolean(product))
    );
    const productCodes = new Set(products.map((product) => product.code));
    const modules = registry.modules.filter((module) => productCodes.has(module.productCode));

    return {
      registry,
      workspace: {
        ...workspace,
        relationships: {
          organization: workspace.organization,
          projects: workspace.projects,
          products,
          modules,
          installations: workspace.installations
        }
      }
    };
  }

  async function readProjectDetailById(id: string) {
    const registry = await readRegistry();
    const project = registry.projects.find((item) => item.id === id);

    if (!project) {
      return { registry, project: null };
    }

    const products = uniqueById(
      project.installations
        .map((installation) => registry.products.find((product) => product.code === installation.productCode))
        .filter((product): product is NonNullable<typeof product> => Boolean(product))
    );
    const productCodes = new Set(products.map((product) => product.code));
    const modules = registry.modules.filter((module) => productCodes.has(module.productCode));

    return {
      registry,
      project: {
        ...project,
        relationships: {
          workspace: project.workspace,
          organization: project.organization,
          products,
          modules,
          installations: project.installations
        }
      }
    };
  }

  async function readModuleDetailById(id: string) {
    const registry = await readRegistry();
    const module = registry.modules.find((item) => item.id === id);

    if (!module) {
      return { registry, module: null };
    }

    const product = registry.products.find((item) => item.code === module.productCode) ?? null;
    const installations = registry.installations.filter((installation) => installation.productCode === module.productCode);

    return {
      registry,
      module: {
        ...module,
        relationships: {
          product,
          installations
        }
      }
    };
  }

  async function readInstallationDetailById(id: string) {
    const registry = await readRegistry();
    const installation = registry.installations.find((item) => item.id === id);

    if (!installation) {
      return { registry, installation: null };
    }

    const product = registry.products.find((item) => item.id === installation.productId || item.code === installation.productCode) ?? null;
    const project = registry.projects.find((item) => item.id === installation.projectId) ?? null;
    const workspace = registry.workspaces.find((item) => item.id === installation.workspaceId) ?? null;
    const modules = registry.modules.filter((module) => module.productCode === installation.productCode);

    return {
      registry,
      installation: {
        ...installation,
        relationships: {
          product,
          project,
          workspace,
          modules
        }
      }
    };
  }

  app.register(swagger, {
    openapi: {
      info: {
        title: "OIS NextGen Core API",
        version: "0.1.0"
      },
      paths: {
        "/": {
          get: {
            tags: ["runtime"],
            responses: {
              "200": {
                description: "Core API service identity response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["service", "status", "version", "health", "docs"],
                      properties: {
                        service: { type: "string" },
                        status: { type: "string" },
                        version: { type: "string" },
                        health: { type: "string" },
                        docs: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/health": {
          get: {
            tags: ["runtime"],
            responses: {
              "200": {
                description: "Core API health response",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["status", "service", "stage"],
                      properties: {
                        status: { type: "string" },
                        service: { type: "string" },
                        stage: { type: "string" }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  });

  app.get(
    "/",
    {
      schema: {
        tags: ["runtime"],
        response: {
          200: {
            type: "object",
            required: ["service", "status", "version", "health", "docs"],
            properties: {
              service: { type: "string" },
              status: { type: "string" },
              version: { type: "string" },
              health: { type: "string" },
              docs: { type: "string" }
            }
          }
        }
      }
    },
    async () => serviceIdentity
  );

  app.get(
    "/health",
    {
      schema: {
        tags: ["runtime"],
        response: {
          200: {
            type: "object",
            required: ["status", "service", "stage"],
            properties: {
              status: { type: "string" },
              service: { type: "string" },
              stage: { type: "string" }
            }
          }
        }
      }
    },
    async () => ({
      status: "ok",
      service: "core-api",
      stage: "bootstrap-stage-a"
    })
  );

  app.post("/auth/demo-login", async (request, reply) => {
    const parsed = demoLoginSchema.safeParse(request.body);
    if (!parsed.success) {
      return reply.code(400).send({ error: "Invalid demo login payload" });
    }

    const user = await prisma.userAccount.findUnique({
      where: { email: parsed.data.email },
      include: { memberships: true }
    });

    if (!user || !user.demoOnly) {
      return reply.code(401).send({ error: "Demo user not found" });
    }

    return {
      demo: true,
      message: "DEMO DATA - NOT PRODUCTION",
      user: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        realmCode: user.realmCode,
        memberships: user.memberships.map((membership) => ({
          workspaceId: membership.workspaceId,
          roleCode: membership.roleCode
        }))
      },
      product: parsed.data.product
    };
  });

  app.get("/platform/overview", async () => {
    const [
      industries,
      organizations,
      workspaces,
      projects,
      products,
      installations,
      modules,
      auditRecords
    ] = await Promise.all([
      prisma.industry.count(),
      prisma.organization.count(),
      prisma.workspace.count(),
      prisma.project.count(),
      prisma.productDefinition.count(),
      prisma.productInstallation.count(),
      prisma.moduleDefinition.count(),
      prisma.auditRecord.count()
    ]);

    return {
      banner: "DEMO DATA - NOT PRODUCTION",
      kernel: {
        industries,
        organizations,
        workspaces,
        projects,
        products,
        installations,
        modules,
        auditRecords
      },
      phaseGates: {
        PLATFORM_KERNEL: "IN_PROGRESS",
        PITS_BUSINESS_LOGIC: "BLOCKED_BY_PHASE2",
        KNOWLEDGE_PORTING: "BLOCKED_BY_PHASE2",
        FULL_STARTER_DATA: "BLOCKED_BY_PHASE3",
        REGRESSION_CERTIFICATION: "BLOCKED_BY_PHASE3"
      }
    };
  });

  app.get("/platform/products", async () => ({
    metadata: registryMetadata(),
    products: await readProducts()
  }));

  app.get("/platform/workspaces", async () => ({
    metadata: registryMetadata(),
    ...(await readWorkspaces())
  }));

  app.get("/platform/projects", async () => ({
    metadata: registryMetadata(),
    projects: await readProjects()
  }));

  app.get("/platform/modules", async () => ({
    metadata: registryMetadata(),
    modules: await readModules()
  }));

  app.get("/platform/installations", async () => ({
    metadata: registryMetadata(),
    installations: await readInstallations()
  }));

  app.get("/platform/registry", async () => readRegistry());

  app.get("/platform/registry/health", async () => buildRegistryHealth(await readRegistry()));

  app.get("/platform/products/code/:code", async (request, reply) => {
    const params = request.params as { code: string };
    const { registry, product } = await readProductDetailByCode(params.code);

    if (!product) {
      return registryNotFound(reply, "product", { code: params.code });
    }

    return {
      metadata: registry.metadata,
      product
    };
  });

  app.get("/platform/products/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const { registry, product } = await readProductDetailById(params.id);

    if (!product) {
      return registryNotFound(reply, "product", { id: params.id });
    }

    return {
      metadata: registry.metadata,
      product
    };
  });

  app.get("/platform/workspaces/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const { registry, workspace } = await readWorkspaceDetailById(params.id);

    if (!workspace) {
      return registryNotFound(reply, "workspace", { id: params.id });
    }

    return {
      metadata: registry.metadata,
      workspace
    };
  });

  app.get("/platform/projects/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const { registry, project } = await readProjectDetailById(params.id);

    if (!project) {
      return registryNotFound(reply, "project", { id: params.id });
    }

    return {
      metadata: registry.metadata,
      project
    };
  });

  app.get("/platform/modules/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const { registry, module } = await readModuleDetailById(params.id);

    if (!module) {
      return registryNotFound(reply, "module", { id: params.id });
    }

    return {
      metadata: registry.metadata,
      module
    };
  });

  app.get("/platform/installations/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const { registry, installation } = await readInstallationDetailById(params.id);

    if (!installation) {
      return registryNotFound(reply, "installation", { id: params.id });
    }

    return {
      metadata: registry.metadata,
      installation
    };
  });

  app.get("/projects/:projectId/product-installations/:productCode", async (request, reply) => {
    const params = request.params as { projectId: string; productCode: string };
    const installation = await prisma.productInstallation.findUnique({
      where: {
        projectId_productCode: {
          projectId: params.projectId,
          productCode: params.productCode as "OIS" | "PITS" | "CS_AGENT" | "KEIHB" | "ICR"
        }
      },
      include: { grants: true, product: true }
    });

    if (!installation) return reply.code(404).send({ error: "Product installation not found" });
    return installation;
  });

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  app.register(swaggerUi, { routePrefix: "/docs" });

  return app;
}
