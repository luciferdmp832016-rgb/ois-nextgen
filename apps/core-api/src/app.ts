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
  type RegistryReadinessStatus = "READY" | "INCOMPLETE" | "BLOCKED" | "NOT_APPLICABLE" | "UNKNOWN";
  type RegistryReadinessCheck = {
    dimension: string;
    label: string;
    status: RegistryReadinessStatus;
    ok: boolean;
    required: boolean;
    reason: string;
    ownerAction: string | null;
    evidenceUrl: string | null;
  };
  type OwnerReviewSeverity = "INFO" | "REVIEW" | "WARNING" | "BLOCKED";
  type OwnerActionPermission =
    | "READ_ONLY_PREVIEW"
    | "OWNER_REVIEW_REQUIRED"
    | "FUTURE_ADMIN_ACTION"
    | "BLOCKED_UNTIL_AUDIT"
    | "NOT_ALLOWED_IN_STAGE_1I";
  type OwnerReviewItem = {
    id: string;
    title: string;
    entityType: RegistryHealthEntityKind;
    entityId: string;
    entityName: string;
    severity: OwnerReviewSeverity;
    currentStatus: RegistryReadinessStatus | RegistryHealthStatus;
    reason: string;
    suggestedOwnerAction: string;
    actionPermission: OwnerActionPermission;
    actionCurrentlyAllowed: boolean;
    requiredSafetyGates: string[];
    auditRequirement: string;
    rollbackRequirement: string;
    confirmationRequirement: string;
    source: "registry-readiness" | "registry-health";
    evidenceUrl: string | null;
  };
  type AdminBoundaryRole = "OWNER" | "ADMIN" | "OPERATOR" | "VIEWER" | "SYSTEM";
  type AdminActionCategory =
    | "REGISTRY_LINK_FIX"
    | "RUNTIME_URL_UPDATE"
    | "INSTALLATION_STATUS_UPDATE"
    | "MODULE_BINDING_UPDATE"
    | "CROSS_PRODUCT_LINK_UPDATE"
    | "DEPLOYMENT_RUNTIME_SYNC"
    | "OWNER_REVIEW_RESOLVE";
  type AdminPermissionState =
    | "ALLOWED_READ_ONLY"
    | "PREVIEW_ONLY"
    | "REQUIRES_OWNER_CONFIRMATION"
    | "REQUIRES_ADMIN_PERMISSION"
    | "REQUIRES_AUDIT_TRAIL"
    | "REQUIRES_ROLLBACK_PLAN"
    | "BLOCKED_IN_CURRENT_STAGE";
  type AdminBoundaryAction = {
    id: string;
    actionName: string;
    category: AdminActionCategory;
    requiredRole: AdminBoundaryRole;
    permissionState: AdminPermissionState;
    auditRequired: boolean;
    confirmationRequired: boolean;
    rollbackRequired: boolean;
    currentAvailability: "PREVIEW_ONLY" | "BLOCKED_IN_CURRENT_STAGE";
    unavailableReason: string;
    safetyGatesNeeded: string[];
    linkedReviewItemId: string | null;
    entityType: RegistryHealthEntityKind | "platform";
    entityId: string | null;
    entityName: string | null;
  };

  const forbiddenRuntimeUrlFragments = ["localhost", "127.0.0.1", ["ois", "dmp247", "com"].join("."), ["oisys", "abacusai", "app"].join(".")];
  const approvedRuntimeBaseUrls = [
    publicRuntimeConfig.coreApiBaseUrl,
    publicRuntimeConfig.oisConsoleBaseUrl,
    publicRuntimeConfig.pitsShellBaseUrl
  ];

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

  function readinessCheck({
    dimension,
    label,
    status,
    ok,
    required,
    reason,
    ownerAction = null,
    evidenceUrl = null
  }: {
    dimension: string;
    label: string;
    status: RegistryReadinessStatus;
    ok: boolean;
    required: boolean;
    reason: string;
    ownerAction?: string | null;
    evidenceUrl?: string | null;
  }): RegistryReadinessCheck {
    return {
      dimension,
      label,
      status,
      ok,
      required,
      reason,
      ownerAction,
      evidenceUrl
    };
  }

  function hasForbiddenRuntimeUrl(urls: Array<string | null | undefined>) {
    return urls
      .filter((url): url is string => Boolean(url))
      .some((url) => forbiddenRuntimeUrlFragments.some((fragment) => url.includes(fragment)));
  }

  function allUrlsAreStagingSafe(urls: Array<string | null | undefined>) {
    return urls
      .filter((url): url is string => Boolean(url))
      .every((url) => approvedRuntimeBaseUrls.some((baseUrl) => url === baseUrl || url.startsWith(`${baseUrl}/`)));
  }

  function deriveReadinessStatus(checks: RegistryReadinessCheck[]): RegistryReadinessStatus {
    const requiredChecks = checks.filter((check) => check.required);

    if (requiredChecks.some((check) => check.status === "BLOCKED")) {
      return "BLOCKED";
    }

    if (requiredChecks.some((check) => check.status === "UNKNOWN")) {
      return "UNKNOWN";
    }

    if (requiredChecks.some((check) => !check.ok || check.status === "INCOMPLETE")) {
      return "INCOMPLETE";
    }

    if (requiredChecks.length === 0) {
      return "NOT_APPLICABLE";
    }

    return "READY";
  }

  function buildReadinessEntity({
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
    checks: RegistryReadinessCheck[];
    links: Record<string, string | null>;
  }) {
    const status = deriveReadinessStatus(checks);
    const missing = checks.filter((check) => check.required && !check.ok).map((check) => check.reason);
    const blockedReasons = checks.filter((check) => check.status === "BLOCKED").map((check) => check.reason);
    const ownerActions = Array.from(
      new Set(checks.map((check) => check.ownerAction).filter((ownerAction): ownerAction is string => Boolean(ownerAction)))
    );

    return {
      kind,
      id,
      code,
      name,
      lifecycle,
      status,
      badges: Array.from(new Set<RegistryReadinessStatus>([status, ...checks.map((check) => check.status)])),
      checks,
      missing,
      blockedReasons,
      ownerActions,
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

  function buildRegistryReadiness(registry: RegistrySnapshot) {
    const health = buildRegistryHealth(registry);
    const findHealthLinks = (collection: keyof typeof health.entities, id: string) =>
      health.entities[collection].find((item) => item.id === id)?.links ?? {};
    const linkBoundaryChecks = (links: Record<string, string | null>) => {
      const urls = Object.values(links);
      const forbiddenDetected = hasForbiddenRuntimeUrl(urls);
      const stagingSafe = allUrlsAreStagingSafe(urls);

      return [
        readinessCheck({
          dimension: "forbidden_legacy_or_local_links_absent",
          label: "Forbidden links absent",
          status: forbiddenDetected ? "BLOCKED" : "READY",
          ok: !forbiddenDetected,
          required: true,
          reason: forbiddenDetected ? "Forbidden legacy or local-development URL detected." : "No forbidden legacy or local-development URLs were detected.",
          ownerAction: forbiddenDetected ? "Remove forbidden legacy or local-development links before runtime verification." : null
        }),
        readinessCheck({
          dimension: "staging_url_safe",
          label: "Staging URLs safe",
          status: stagingSafe ? "READY" : "BLOCKED",
          ok: stagingSafe,
          required: true,
          reason: stagingSafe ? "All configured URLs use approved staging hosts." : "A configured URL does not use an approved staging host.",
          ownerAction: stagingSafe ? null : "Replace non-staging links with approved OIS, PITS or Core API staging URLs."
        })
      ];
    };
    const ownerUatCheck = () =>
      readinessCheck({
        dimension: "owner_uat_required",
        label: "Owner UAT",
        status: "INCOMPLETE",
        ok: true,
        required: false,
        reason: "Owner Browser/UAT is required before closing the runtime verified label.",
        ownerAction: "Run the Stage 1E Owner Browser/UAT checklist after Abacus runtime sync."
      });

    const productReadiness = registry.products.map((product) => {
      const links = findHealthLinks("products", product.id);
      const productRuntimeUrl = links.productRuntime ?? null;
      const pitsProjectUrl = links.pitsProject ?? null;
      const runtimeRequired = product.code === "OIS" || product.code === "PITS";
      const runtimeReady = runtimeRequired ? Boolean(productRuntimeUrl || pitsProjectUrl) : true;

      return buildReadinessEntity({
        kind: "product",
        id: product.id,
        code: product.code,
        name: product.name,
        lifecycle: product.lifecycle,
        links,
        checks: [
          readinessCheck({
            dimension: "product_configured",
            label: "Product configured",
            status: product.id && product.code ? "READY" : "UNKNOWN",
            ok: Boolean(product.id && product.code),
            required: true,
            reason: product.id && product.code ? "Product registry row is configured." : "Product registry row is missing an id or code.",
            ownerAction: product.id && product.code ? null : "Confirm product registry seed/configuration."
          }),
          readinessCheck({
            dimension: "lifecycle_active",
            label: "Lifecycle active",
            status: product.lifecycle === "ACTIVE" ? "READY" : "INCOMPLETE",
            ok: product.lifecycle === "ACTIVE",
            required: true,
            reason: `Product lifecycle is ${product.lifecycle}.`,
            ownerAction: product.lifecycle === "ACTIVE" ? null : "Confirm whether this product should be active before operation."
          }),
          readinessCheck({
            dimension: "module_linked",
            label: "Module linked",
            status: product.modules.length > 0 ? "READY" : "INCOMPLETE",
            ok: product.modules.length > 0,
            required: true,
            reason: product.modules.length > 0 ? `${product.modules.length} module link(s) are present.` : "No module bound to product.",
            ownerAction: product.modules.length > 0 ? null : "Add/verify product module binding in a later approved admin stage."
          }),
          readinessCheck({
            dimension: "installation_linked",
            label: "Installation linked",
            status: product.installations.length > 0 ? "READY" : "INCOMPLETE",
            ok: product.installations.length > 0,
            required: true,
            reason:
              product.installations.length > 0
                ? `${product.installations.length} installation link(s) are present.`
                : "Missing installation link.",
            ownerAction: product.installations.length > 0 ? null : "Verify installation coverage before claiming operational readiness."
          }),
          readinessCheck({
            dimension: "runtime_url_present",
            label: "Runtime URL present",
            status: runtimeRequired ? (runtimeReady ? "READY" : "INCOMPLETE") : "NOT_APPLICABLE",
            ok: runtimeReady,
            required: runtimeRequired,
            reason: runtimeReady
              ? runtimeRequired
                ? "Runtime URL or project runtime link is present."
                : "No dedicated runtime URL is required for this product in Stage 1E."
              : "Missing runtime URL.",
            ownerAction: runtimeReady ? null : "Confirm product runtime publication or installation/project link."
          }),
          readinessCheck({
            dimension: "cross_product_links_present",
            label: "Cross-product links present",
            status: product.code === "PITS" ? (pitsProjectUrl ? "READY" : "INCOMPLETE") : "NOT_APPLICABLE",
            ok: product.code !== "PITS" || Boolean(pitsProjectUrl),
            required: product.code === "PITS",
            reason:
              product.code === "PITS"
                ? pitsProjectUrl
                  ? "PITS project cross-link is present."
                  : "Cross-product link unavailable."
                : "Cross-product PITS project link is not required for this product.",
            ownerAction: product.code === "PITS" && !pitsProjectUrl ? "Verify PITS project installation link." : null
          }),
          ...linkBoundaryChecks(links),
          ownerUatCheck()
        ]
      });
    });

    const workspaceReadiness = registry.workspaces.map((workspace) => {
      const links = findHealthLinks("workspaces", workspace.id);

      return buildReadinessEntity({
        kind: "workspace",
        id: workspace.id,
        code: workspace.code,
        name: workspace.name,
        lifecycle: workspace.lifecycle,
        links,
        checks: [
          readinessCheck({
            dimension: "workspace_linked",
            label: "Workspace configured",
            status: workspace.id && workspace.organization?.code ? "READY" : "INCOMPLETE",
            ok: Boolean(workspace.id && workspace.organization?.code),
            required: true,
            reason: workspace.organization?.code ? "Workspace is linked to an organization." : "Workspace organization link is missing.",
            ownerAction: workspace.organization?.code ? null : "Verify workspace organization relationship."
          }),
          readinessCheck({
            dimension: "project_linked",
            label: "Project linked",
            status: workspace.projects.length > 0 ? "READY" : "INCOMPLETE",
            ok: workspace.projects.length > 0,
            required: true,
            reason: workspace.projects.length > 0 ? `${workspace.projects.length} project link(s) are present.` : "Missing project link.",
            ownerAction: workspace.projects.length > 0 ? null : "Verify at least one project is linked to this workspace."
          }),
          readinessCheck({
            dimension: "installation_linked",
            label: "Installation linked",
            status: workspace.installations.length > 0 ? "READY" : "INCOMPLETE",
            ok: workspace.installations.length > 0,
            required: true,
            reason:
              workspace.installations.length > 0
                ? `${workspace.installations.length} installation link(s) are present.`
                : "Missing installation link.",
            ownerAction: workspace.installations.length > 0 ? null : "Verify workspace installation coverage."
          }),
          readinessCheck({
            dimension: "runtime_url_present",
            label: "Project runtime URL present",
            status: links.pitsProject ? "READY" : "INCOMPLETE",
            ok: Boolean(links.pitsProject),
            required: true,
            reason: links.pitsProject ? "At least one PITS project runtime link is present." : "Missing runtime URL.",
            ownerAction: links.pitsProject ? null : "Verify project link before owner runtime verification."
          }),
          ...linkBoundaryChecks(links),
          ownerUatCheck()
        ]
      });
    });

    const projectReadiness = registry.projects.map((project) => {
      const links = findHealthLinks("projects", project.id);
      const hasProductLink = project.installations.some((installation) => installation.productId);

      return buildReadinessEntity({
        kind: "project",
        id: project.id,
        code: project.code,
        name: project.name,
        lifecycle: project.lifecycle,
        links,
        checks: [
          readinessCheck({
            dimension: "project_linked",
            label: "Project configured",
            status: project.id && project.workspaceId ? "READY" : "INCOMPLETE",
            ok: Boolean(project.id && project.workspaceId),
            required: true,
            reason: project.workspaceId ? "Project is linked to a workspace." : "Missing workspace link.",
            ownerAction: project.workspaceId ? null : "Verify project workspace relationship."
          }),
          readinessCheck({
            dimension: "workspace_linked",
            label: "Workspace link",
            status: project.workspace?.code ? "READY" : "INCOMPLETE",
            ok: Boolean(project.workspace?.code),
            required: true,
            reason: project.workspace?.code ? "Workspace link is present." : "Missing workspace link.",
            ownerAction: project.workspace?.code ? null : "Verify workspace relationship for this project."
          }),
          readinessCheck({
            dimension: "installation_linked",
            label: "Installation link",
            status: project.installations.length > 0 ? "READY" : "INCOMPLETE",
            ok: project.installations.length > 0,
            required: true,
            reason:
              project.installations.length > 0
                ? `${project.installations.length} installation link(s) are present.`
                : "Missing installation link.",
            ownerAction: project.installations.length > 0 ? null : "Verify product installation for this project."
          }),
          readinessCheck({
            dimension: "product_linked",
            label: "Product link",
            status: hasProductLink ? "READY" : "INCOMPLETE",
            ok: hasProductLink,
            required: true,
            reason: hasProductLink ? "At least one installed product link is present." : "Missing product link.",
            ownerAction: hasProductLink ? null : "Verify installation product relationship."
          }),
          readinessCheck({
            dimension: "cross_product_links_present",
            label: "OIS cross-links",
            status: links.oisProduct && links.oisWorkspace ? "READY" : "INCOMPLETE",
            ok: Boolean(links.oisProduct && links.oisWorkspace),
            required: true,
            reason: links.oisProduct && links.oisWorkspace ? "OIS product and workspace cross-links are present." : "Cross-product link unavailable.",
            ownerAction: links.oisProduct && links.oisWorkspace ? null : "Verify OIS Console product/workspace link targets."
          }),
          readinessCheck({
            dimension: "runtime_url_present",
            label: "PITS runtime URL",
            status: links.pitsProjectDetail ? "READY" : "INCOMPLETE",
            ok: Boolean(links.pitsProjectDetail),
            required: true,
            reason: links.pitsProjectDetail ? "PITS project runtime detail URL is present." : "Missing runtime URL.",
            ownerAction: links.pitsProjectDetail ? null : "Verify PITS project runtime route."
          }),
          ...linkBoundaryChecks(links),
          ownerUatCheck()
        ]
      });
    });

    const moduleReadiness = registry.modules.map((module) => {
      const links = findHealthLinks("modules", module.id);
      const product = registry.products.find((item) => item.code === module.productCode) ?? null;
      const productInstallations = product?.installations ?? [];

      return buildReadinessEntity({
        kind: "module",
        id: module.id,
        code: module.code,
        name: module.code,
        lifecycle: module.lifecycle,
        links,
        checks: [
          readinessCheck({
            dimension: "module_linked",
            label: "Module configured",
            status: module.id && module.productCode ? "READY" : "INCOMPLETE",
            ok: Boolean(module.id && module.productCode),
            required: true,
            reason: module.productCode ? "Module is bound to a product code." : "Module product binding is missing.",
            ownerAction: module.productCode ? null : "Verify module product binding."
          }),
          readinessCheck({
            dimension: "product_linked",
            label: "Product link",
            status: product ? "READY" : "INCOMPLETE",
            ok: Boolean(product),
            required: true,
            reason: product ? "Owning product is present." : "Missing product link.",
            ownerAction: product ? null : "Verify owning product exists in registry."
          }),
          readinessCheck({
            dimension: "installation_linked",
            label: "Product installation coverage",
            status: productInstallations.length > 0 ? "READY" : "INCOMPLETE",
            ok: productInstallations.length > 0,
            required: true,
            reason:
              productInstallations.length > 0
                ? `${productInstallations.length} installation link(s) exist for this module's product.`
                : "Missing installation link.",
            ownerAction: productInstallations.length > 0 ? null : "Verify installation coverage for the owning product."
          }),
          readinessCheck({
            dimension: "runtime_url_present",
            label: "Standalone runtime URL",
            status: "NOT_APPLICABLE",
            ok: true,
            required: false,
            reason: "Modules do not expose standalone runtime URLs in Stage 1E.",
            ownerAction: null
          }),
          ...linkBoundaryChecks(links),
          ownerUatCheck()
        ]
      });
    });

    const installationReadiness = registry.installations.map((installation) => {
      const links = findHealthLinks("installations", installation.id);
      const modules = registry.modules.filter((module) => module.productCode === installation.productCode);

      return buildReadinessEntity({
        kind: "installation",
        id: installation.id,
        code: installation.productCode,
        name: `${installation.productCode} installation`,
        lifecycle: installation.lifecycle,
        links,
        checks: [
          readinessCheck({
            dimension: "installation_linked",
            label: "Installation configured",
            status: installation.id && installation.productCode ? "READY" : "INCOMPLETE",
            ok: Boolean(installation.id && installation.productCode),
            required: true,
            reason: installation.productCode ? "Installation row is configured." : "Installation product code is missing.",
            ownerAction: installation.productCode ? null : "Verify product installation registry row."
          }),
          readinessCheck({
            dimension: "product_linked",
            label: "Product link",
            status: installation.product ? "READY" : "INCOMPLETE",
            ok: Boolean(installation.product),
            required: true,
            reason: installation.product ? "Product link is present." : "Missing product link.",
            ownerAction: installation.product ? null : "Verify product relationship for this installation."
          }),
          readinessCheck({
            dimension: "workspace_linked",
            label: "Workspace link",
            status: installation.workspace ? "READY" : "INCOMPLETE",
            ok: Boolean(installation.workspace),
            required: true,
            reason: installation.workspace ? "Workspace link is present." : "Missing workspace link.",
            ownerAction: installation.workspace ? null : "Verify workspace relationship for this installation."
          }),
          readinessCheck({
            dimension: "project_linked",
            label: "Project link",
            status: installation.project ? "READY" : "INCOMPLETE",
            ok: Boolean(installation.project),
            required: true,
            reason: installation.project ? "Project link is present." : "Missing project link.",
            ownerAction: installation.project ? null : "Verify project relationship for this installation."
          }),
          readinessCheck({
            dimension: "module_linked",
            label: "Module coverage",
            status: modules.length > 0 ? "READY" : "INCOMPLETE",
            ok: modules.length > 0,
            required: true,
            reason: modules.length > 0 ? `${modules.length} module link(s) are bound to this product.` : "No module bound to product.",
            ownerAction: modules.length > 0 ? null : "Verify modules for this product before operation."
          }),
          readinessCheck({
            dimension: "runtime_url_present",
            label: "Runtime URL",
            status: installation.productCode === "PITS" ? (links.pitsProject ? "READY" : "INCOMPLETE") : "NOT_APPLICABLE",
            ok: installation.productCode !== "PITS" || Boolean(links.pitsProject),
            required: installation.productCode === "PITS",
            reason:
              installation.productCode === "PITS"
                ? links.pitsProject
                  ? "PITS project runtime URL is present."
                  : "Missing runtime URL."
                : "Only PITS installations require a PITS project runtime URL in Stage 1E.",
            ownerAction: installation.productCode === "PITS" && !links.pitsProject ? "Verify PITS project runtime link." : null
          }),
          readinessCheck({
            dimension: "cross_product_links_present",
            label: "Cross-product links",
            status: links.oisProduct && links.oisWorkspace && (installation.productCode !== "PITS" || links.pitsProject) ? "READY" : "INCOMPLETE",
            ok: Boolean(links.oisProduct && links.oisWorkspace && (installation.productCode !== "PITS" || links.pitsProject)),
            required: true,
            reason:
              links.oisProduct && links.oisWorkspace && (installation.productCode !== "PITS" || links.pitsProject)
                ? "Expected cross-product links are present."
                : "Cross-product link unavailable.",
            ownerAction:
              links.oisProduct && links.oisWorkspace && (installation.productCode !== "PITS" || links.pitsProject)
                ? null
                : "Verify OIS/PITS cross-link targets before owner UAT."
          }),
          ...linkBoundaryChecks(links),
          ownerUatCheck()
        ]
      });
    });

    const allEntities = [...productReadiness, ...workspaceReadiness, ...projectReadiness, ...moduleReadiness, ...installationReadiness];
    const countByStatus = (status: RegistryReadinessStatus) => allEntities.filter((item) => item.status === status).length;
    const summaryStatus =
      countByStatus("BLOCKED") > 0
        ? "BLOCKED"
        : countByStatus("UNKNOWN") > 0
          ? "UNKNOWN"
          : countByStatus("INCOMPLETE") > 0
            ? "INCOMPLETE"
            : "READY";

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        readinessMode: "deterministic-registry",
        note:
          "Readiness is derived from existing registry rows and staging-safe link configuration. Owner UAT remains required before runtime verification."
      },
      summary: {
        status: summaryStatus,
        total: allEntities.length,
        ready: countByStatus("READY"),
        incomplete: countByStatus("INCOMPLETE"),
        blocked: countByStatus("BLOCKED"),
        notApplicable: countByStatus("NOT_APPLICABLE"),
        unknown: countByStatus("UNKNOWN")
      },
      entities: {
        products: productReadiness,
        workspaces: workspaceReadiness,
        projects: projectReadiness,
        modules: moduleReadiness,
        installations: installationReadiness
      }
    };
  }

  function buildOwnerReview(registry: RegistrySnapshot) {
    const readiness = buildRegistryReadiness(registry);
    const health = buildRegistryHealth(registry);
    const safetyGates = [
      "ADR or stage approval for write behavior",
      "Versioned Prisma migration if schema changes are required",
      "Sensitive write audit trail",
      "Owner confirmation before execution",
      "Rollback plan before enabling action"
    ];
    const auditRequirement = "Future admin action requires audit before execution.";
    const rollbackRequirement = "Future admin action requires rollback plan before execution.";
    const confirmationRequirement = "Future admin action requires owner confirmation before execution.";
    const slug = (value: string) =>
      value
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
    const shouldReviewReadinessCheck = (check: RegistryReadinessCheck) =>
      Boolean(check.ownerAction) || check.status === "BLOCKED" || check.status === "UNKNOWN" || check.status === "INCOMPLETE" || !check.ok;
    const shouldReviewHealthCheck = (check: RegistryHealthCheck) =>
      !check.ok || check.status === "Unavailable" || check.status === "Missing URL";
    const readinessSeverity = (check: RegistryReadinessCheck): OwnerReviewSeverity => {
      if (check.status === "BLOCKED") {
        return "BLOCKED";
      }

      if (check.required && !check.ok) {
        return "WARNING";
      }

      if (check.ownerAction || check.status === "INCOMPLETE" || check.status === "UNKNOWN") {
        return "REVIEW";
      }

      return "INFO";
    };
    const healthSeverity = (check: RegistryHealthCheck): OwnerReviewSeverity => {
      if (check.status === "Unavailable") {
        return check.required ? "BLOCKED" : "WARNING";
      }

      if (check.status === "Missing URL" || !check.ok) {
        return check.required ? "WARNING" : "REVIEW";
      }

      return "INFO";
    };
    const permissionForReadiness = (check: RegistryReadinessCheck): OwnerActionPermission => {
      const text = `${check.reason} ${check.ownerAction ?? ""}`.toLowerCase();

      if (check.status === "BLOCKED") {
        return "BLOCKED_UNTIL_AUDIT";
      }

      if (text.includes("later approved admin stage") || text.includes("add/verify")) {
        return "FUTURE_ADMIN_ACTION";
      }

      if (check.required && !check.ok) {
        return "OWNER_REVIEW_REQUIRED";
      }

      if (check.ownerAction || check.status === "INCOMPLETE") {
        return "READ_ONLY_PREVIEW";
      }

      return "NOT_ALLOWED_IN_STAGE_1I";
    };
    const permissionForHealth = (check: RegistryHealthCheck): OwnerActionPermission => {
      if (check.status === "Unavailable") {
        return "BLOCKED_UNTIL_AUDIT";
      }

      if (check.status === "Missing URL" || !check.ok) {
        return check.required ? "OWNER_REVIEW_REQUIRED" : "FUTURE_ADMIN_ACTION";
      }

      return "NOT_ALLOWED_IN_STAGE_1I";
    };
    const suggestedReadinessAction = (check: RegistryReadinessCheck) => {
      if (check.dimension === "owner_uat_required") {
        return "Run the Stage 1I Owner Browser/UAT checklist after Abacus runtime sync.";
      }

      return check.ownerAction ?? "Review this item with the owner before any future admin action is designed.";
    };

    const readinessItems = Object.values(readiness.entities)
      .flat()
      .flatMap((entity) =>
        entity.checks.filter(shouldReviewReadinessCheck).map<OwnerReviewItem>((check) => ({
          id: `${entity.kind}:${entity.id}:readiness:${slug(check.dimension)}`,
          title: `${entity.name} - ${check.label}`,
          entityType: entity.kind,
          entityId: entity.id,
          entityName: entity.name,
          severity: readinessSeverity(check),
          currentStatus: check.status,
          reason: check.reason,
          suggestedOwnerAction: suggestedReadinessAction(check),
          actionPermission: permissionForReadiness(check),
          actionCurrentlyAllowed: false,
          requiredSafetyGates: safetyGates,
          auditRequirement,
          rollbackRequirement,
          confirmationRequirement,
          source: "registry-readiness",
          evidenceUrl: check.evidenceUrl
        }))
      );
    const readinessItemIds = new Set(readinessItems.map((item) => `${item.entityType}:${item.entityId}:${item.reason}`));
    const healthItems = Object.values(health.entities)
      .flat()
      .flatMap((entity) =>
        entity.checks
          .filter(shouldReviewHealthCheck)
          .filter((check) => !readinessItemIds.has(`${entity.kind}:${entity.id}:${check.detail}`))
          .map<OwnerReviewItem>((check) => ({
            id: `${entity.kind}:${entity.id}:health:${slug(check.label)}`,
            title: `${entity.name} - ${check.label}`,
            entityType: entity.kind,
            entityId: entity.id,
            entityName: entity.name,
            severity: healthSeverity(check),
            currentStatus: check.status,
            reason: check.detail,
            suggestedOwnerAction: "Review runtime health evidence before any future admin action is designed.",
            actionPermission: permissionForHealth(check),
            actionCurrentlyAllowed: false,
            requiredSafetyGates: safetyGates,
            auditRequirement,
            rollbackRequirement,
            confirmationRequirement,
            source: "registry-health",
            evidenceUrl: check.url
          }))
      );
    const severityOrder: Record<OwnerReviewSeverity, number> = {
      BLOCKED: 0,
      WARNING: 1,
      REVIEW: 2,
      INFO: 3
    };
    const items = [...readinessItems, ...healthItems].sort((left, right) => {
      const severityDelta = severityOrder[left.severity] - severityOrder[right.severity];

      if (severityDelta !== 0) {
        return severityDelta;
      }

      return `${left.entityType}:${left.entityId}:${left.id}`.localeCompare(`${right.entityType}:${right.entityId}:${right.id}`);
    });
    const countSeverity = (severity: OwnerReviewSeverity) => items.filter((item) => item.severity === severity).length;
    const countPermission = (permission: OwnerActionPermission) => items.filter((item) => item.actionPermission === permission).length;

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        reviewMode: "read-only-owner-review",
        stage: "Stage 1I",
        note: "Owner review derives from registry readiness/health. No admin action is executable in Stage 1I."
      },
      actionBoundary: {
        stage: "Stage 1I",
        enabledAdminActions: 0,
        mutationEndpointsAdded: false,
        writePermission: "NOT_ALLOWED_IN_STAGE_1I" as const,
        markers: ["Owner Review Queue", "Safe Action Boundary", "Read-only preview", "Future admin action requires audit"]
      },
      summary: {
        total: items.length,
        info: countSeverity("INFO"),
        review: countSeverity("REVIEW"),
        warning: countSeverity("WARNING"),
        blocked: countSeverity("BLOCKED"),
        readOnlyPreview: countPermission("READ_ONLY_PREVIEW"),
        ownerReviewRequired: countPermission("OWNER_REVIEW_REQUIRED"),
        futureAdminAction: countPermission("FUTURE_ADMIN_ACTION"),
        blockedUntilAudit: countPermission("BLOCKED_UNTIL_AUDIT"),
        notAllowedInStage1I: countPermission("NOT_ALLOWED_IN_STAGE_1I")
      },
      items
    };
  }

  function buildAdminBoundary(registry: RegistrySnapshot) {
    const ownerReview = buildOwnerReview(registry);
    const safetyGatesNeeded = [
      "Permission model approved for the action category",
      "Audit trail event schema and storage verified",
      "Owner confirmation workflow verified",
      "Rollback plan documented and rehearsed",
      "Stage approval explicitly enables the write action"
    ];
    const roles: Array<{ code: AdminBoundaryRole; label: string; description: string; currentStageCapabilities: string[] }> = [
      {
        code: "OWNER",
        label: "Owner",
        description: "Business owner who can review and confirm future administrative changes.",
        currentStageCapabilities: ["Read admin boundary model", "Review preview-only actions"]
      },
      {
        code: "ADMIN",
        label: "Admin",
        description: "Future platform administrator role for approved admin actions after audit and rollback gates exist.",
        currentStageCapabilities: ["Read admin boundary model"]
      },
      {
        code: "OPERATOR",
        label: "Operator",
        description: "Future runtime operator role for approved operational sync and runtime checks.",
        currentStageCapabilities: ["Read admin boundary model"]
      },
      {
        code: "VIEWER",
        label: "Viewer",
        description: "Read-only observer role for registry, health, readiness and boundary surfaces.",
        currentStageCapabilities: ["Read-only visibility"]
      },
      {
        code: "SYSTEM",
        label: "System",
        description: "Internal service identity for future audited automated actions after approval.",
        currentStageCapabilities: ["No write automation enabled in Stage 1J"]
      }
    ];
    const permissions: Array<{ state: AdminPermissionState; label: string; description: string }> = [
      { state: "ALLOWED_READ_ONLY", label: "Allowed read-only", description: "Read-only visibility is allowed in Stage 1J." },
      { state: "PREVIEW_ONLY", label: "Preview only", description: "The UI may show the action plan, but cannot execute it." },
      {
        state: "REQUIRES_OWNER_CONFIRMATION",
        label: "Requires owner confirmation",
        description: "Future execution must collect explicit owner approval."
      },
      {
        state: "REQUIRES_ADMIN_PERMISSION",
        label: "Requires admin permission",
        description: "Future execution must be limited to an approved admin/operator role."
      },
      {
        state: "REQUIRES_AUDIT_TRAIL",
        label: "Requires audit trail",
        description: "Future execution must produce a durable audit event."
      },
      {
        state: "REQUIRES_ROLLBACK_PLAN",
        label: "Requires rollback plan",
        description: "Future execution must have a rollback plan before enabling."
      },
      {
        state: "BLOCKED_IN_CURRENT_STAGE",
        label: "Blocked in current stage",
        description: "No write/admin action can run in Stage 1J."
      }
    ];
    const actionCategories: Array<{ code: AdminActionCategory; label: string; description: string; requiredRole: AdminBoundaryRole }> = [
      {
        code: "REGISTRY_LINK_FIX",
        label: "Registry link fix",
        description: "Future repair of missing product/workspace/project/installation relationships.",
        requiredRole: "ADMIN"
      },
      {
        code: "RUNTIME_URL_UPDATE",
        label: "Runtime URL update",
        description: "Future update of public staging runtime URLs or route links.",
        requiredRole: "ADMIN"
      },
      {
        code: "INSTALLATION_STATUS_UPDATE",
        label: "Installation status update",
        description: "Future lifecycle/status change for a product installation.",
        requiredRole: "ADMIN"
      },
      {
        code: "MODULE_BINDING_UPDATE",
        label: "Module binding update",
        description: "Future product/module binding change.",
        requiredRole: "ADMIN"
      },
      {
        code: "CROSS_PRODUCT_LINK_UPDATE",
        label: "Cross-product link update",
        description: "Future OIS/PITS link target repair.",
        requiredRole: "ADMIN"
      },
      {
        code: "DEPLOYMENT_RUNTIME_SYNC",
        label: "Deployment runtime sync",
        description: "Future owner-approved runtime sync action.",
        requiredRole: "OPERATOR"
      },
      {
        code: "OWNER_REVIEW_RESOLVE",
        label: "Owner review resolve",
        description: "Future closure of owner review items after evidence is accepted.",
        requiredRole: "OWNER"
      }
    ];
    const safetyGates = [
      {
        code: "permission_model",
        label: "Permission Model",
        required: true,
        description: "Role and permission checks must be implemented before any write action is enabled."
      },
      {
        code: "audit_required",
        label: "Audit Required",
        required: true,
        description: "Every future sensitive write must create an audit trail event."
      },
      {
        code: "confirmation_required",
        label: "Confirmation Required",
        required: true,
        description: "Owner confirmation must be captured before future admin execution."
      },
      {
        code: "rollback_required",
        label: "Rollback Required",
        required: true,
        description: "Rollback steps must exist before future admin execution."
      }
    ];
    const actionCategoryForReview = (item: OwnerReviewItem): AdminActionCategory => {
      const text = `${item.title} ${item.reason} ${item.suggestedOwnerAction}`.toLowerCase();

      if (text.includes("runtime") || text.includes("url")) {
        return "RUNTIME_URL_UPDATE";
      }

      if (item.entityType === "installation" || text.includes("installation status") || text.includes("lifecycle")) {
        return "INSTALLATION_STATUS_UPDATE";
      }

      if (item.entityType === "module" || text.includes("module")) {
        return "MODULE_BINDING_UPDATE";
      }

      if (text.includes("cross-product") || text.includes("ois") || text.includes("pits")) {
        return "CROSS_PRODUCT_LINK_UPDATE";
      }

      if (text.includes("link")) {
        return "REGISTRY_LINK_FIX";
      }

      if (text.includes("sync") || text.includes("uat")) {
        return "DEPLOYMENT_RUNTIME_SYNC";
      }

      return "OWNER_REVIEW_RESOLVE";
    };
    const categoryRequiredRole = (category: AdminActionCategory) =>
      actionCategories.find((item) => item.code === category)?.requiredRole ?? "ADMIN";
    const blockedActions: AdminBoundaryAction[] = actionCategories.map((category) => ({
      id: `future:${category.code.toLowerCase()}`,
      actionName: category.label,
      category: category.code,
      requiredRole: category.requiredRole,
      permissionState: "BLOCKED_IN_CURRENT_STAGE",
      auditRequired: true,
      confirmationRequired: true,
      rollbackRequired: true,
      currentAvailability: "BLOCKED_IN_CURRENT_STAGE",
      unavailableReason: "Blocked in current stage until permission, audit, confirmation and rollback gates are implemented.",
      safetyGatesNeeded,
      linkedReviewItemId: null,
      entityType: "platform",
      entityId: null,
      entityName: null
    }));
    const previewOnlyActions: AdminBoundaryAction[] = ownerReview.items.map((item) => {
      const category = actionCategoryForReview(item);

      return {
        id: `preview:${item.id}`,
        actionName: item.title,
        category,
        requiredRole: categoryRequiredRole(category),
        permissionState: "PREVIEW_ONLY",
        auditRequired: true,
        confirmationRequired: true,
        rollbackRequired: true,
        currentAvailability: "PREVIEW_ONLY",
        unavailableReason: "Preview only in Stage 1J; no write/admin action is executable.",
        safetyGatesNeeded,
        linkedReviewItemId: item.id,
        entityType: item.entityType,
        entityId: item.entityId,
        entityName: item.entityName
      };
    });
    const futureAdminActions = [...blockedActions, ...previewOnlyActions].sort((left, right) => left.id.localeCompare(right.id));

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        boundaryMode: "read-only-admin-permission-model",
        stage: "Stage 1J",
        note: "Admin Boundary is a read-only permission and audit model. No admin action is executable in Stage 1J."
      },
      adminBoundary: {
        stage: "Stage 1J",
        enabledAdminActions: 0,
        mutationEndpointsAdded: false,
        writePermission: "BLOCKED_IN_CURRENT_STAGE" as const,
        markers: ["Admin Boundary", "Audit Required", "Permission Model", "Preview only", "Blocked in current stage"]
      },
      summary: {
        roles: roles.length,
        permissionStates: permissions.length,
        actionCategories: actionCategories.length,
        safetyGates: safetyGates.length,
        futureAdminActions: futureAdminActions.length,
        previewOnlyActions: previewOnlyActions.length,
        blockedActions: blockedActions.length,
        auditRequired: futureAdminActions.filter((item) => item.auditRequired).length,
        confirmationRequired: futureAdminActions.filter((item) => item.confirmationRequired).length,
        rollbackRequired: futureAdminActions.filter((item) => item.rollbackRequired).length
      },
      roles,
      permissions,
      actionCategories,
      safetyGates,
      auditRequirements: [
        {
          code: "audit_record_required",
          label: "Audit Required",
          required: true,
          detail: "Future sensitive writes must produce a durable audit record before execution can be enabled."
        }
      ],
      confirmationRequirements: [
        {
          code: "owner_confirmation_required",
          label: "Confirmation Required",
          required: true,
          detail: "Future admin execution must collect explicit owner approval."
        }
      ],
      rollbackRequirements: [
        {
          code: "rollback_plan_required",
          label: "Rollback Required",
          required: true,
          detail: "Future admin execution must include documented rollback steps."
        }
      ],
      blockedActions,
      previewOnlyActions,
      futureAdminActions
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
        },
        "/platform/owner-review": {
          get: {
            tags: ["platform"],
            responses: {
              "200": {
                description: "Read-only owner review and safe action-boundary projection",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "actionBoundary", "summary", "items"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        actionBoundary: { type: "object" },
                        summary: { type: "object" },
                        items: { type: "array", items: { type: "object" } }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/platform/admin-boundary": {
          get: {
            tags: ["platform"],
            responses: {
              "200": {
                description: "Read-only audit trail and admin permission model",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "adminBoundary", "summary", "roles", "permissions", "futureAdminActions"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        adminBoundary: { type: "object" },
                        summary: { type: "object" },
                        roles: { type: "array", items: { type: "object" } },
                        permissions: { type: "array", items: { type: "object" } },
                        futureAdminActions: { type: "array", items: { type: "object" } }
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

  app.get("/platform/registry/readiness", async () => buildRegistryReadiness(await readRegistry()));

  app.get("/platform/owner-review", async () => buildOwnerReview(await readRegistry()));

  app.get("/platform/admin-boundary", async () => buildAdminBoundary(await readRegistry()));

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
