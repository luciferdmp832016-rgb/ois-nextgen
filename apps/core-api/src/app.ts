import Fastify, { type FastifyReply } from "fastify";
import swagger from "@fastify/swagger";
import swaggerUi from "@fastify/swagger-ui";
import { PrismaClient } from "@prisma/client";
import { z } from "zod";
import { registerStage2FRoutes, type Stage2FPrisma } from "./stage-2f";
import { registerStage2GRoutes, type Stage2GPrisma } from "./stage-2g";
import { buildOimaProductRegistryProjection, registerStage2HRoutes } from "./stage-2h";
import { registerStage2JRoutes, type Stage2JPrisma } from "./stage-2j";
import { registerStage2KRoutes, type Stage2KPrisma } from "./stage-2k";

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
  pitsShellBaseUrl: "https://pits-ng.dmp247.com",
  oimaShellBaseUrl: "https://oima.dmp247.com"
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
  | "oisAgentFeedback"
  | "oisAgentLearningSubmission"
  | "oisAgentMessage"
  | "oisAgentSession"
  | "oisCanonicalKnowledgeItem"
  | "oisEcosystemProduct"
  | "oisKnowledgeEvidenceLink"
  | "oisKnowledgeLayerMapping"
  | "oisKnowledgeProjectionBundle"
  | "oisLearningCandidate"
  | "oisLearningPolicy"
  | "oisLearningSignal"
  | "oimaMeetingRecord"
  | "oimaMeetingSourceFile"
  | "oimaTranscriptParseRun"
  | "oimaTranscriptParseWarning"
  | "oimaTranscriptSegment"
  | "oimaTranscriptVersion"
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
  type ProductUatCategory =
    | "AVAILABLE_FOR_BROWSER_UAT"
    | "PLATFORM_CONTROL_PLANE_ONLY"
    | "PLACEHOLDER_OR_SHELL_ONLY"
    | "FUTURE_PRODUCT_FUNCTION"
    | "BLOCKED_BY_MISSING_DATA_MODEL"
    | "BLOCKED_BY_WRITE_BOUNDARY"
    | "BLOCKED_BY_AUTH_OR_PERMISSION"
    | "NEEDS_OWNER_DECISION";
  type PitsWorkItemType = "TASK" | "ISSUE" | "RISK" | "DECISION" | "FOLLOW_UP";
  type PitsWorkItemStatus = "OPEN" | "IN_PROGRESS" | "BLOCKED" | "DONE";
  type PitsWorkItemPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  type PitsWorkItem = {
    id: string;
    title: string;
    type: PitsWorkItemType;
    status: PitsWorkItemStatus;
    priority: PitsWorkItemPriority;
    owner: string;
    dueDate: string;
    source: string;
    summary: string;
    nextAction: string;
    blockers: string[];
    relatedProjectId: string;
    updatedAt: string;
  };
  type PitsDryRunActionType = "CHANGE_STATUS" | "ASSIGN_OWNER" | "ADD_NOTE" | "SET_PRIORITY" | "RESOLVE_BLOCKER";
  type PitsDryRunActionPreview = {
    actionType: PitsDryRunActionType;
    label: string;
    allowedInCurrentStage: false;
    mode: "DRY_RUN_ONLY";
    currentValue: string;
    proposedValue: string;
    expectedImpact: string;
    requiredRole: string;
    auditRequired: true;
    confirmationRequired: true;
    rollbackRequired: true;
    blockedReason: string;
    safetyGates: string[];
    noDataChanged: true;
  };
  type PitsActionRequestStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED_PREVIEW" | "REJECTED_PREVIEW" | "BLOCKED_BY_SAFETY_GATE";
  type PitsWorkItemActionRequest = {
    requestId: string;
    projectId: string;
    workItemId: string;
    actionType: PitsDryRunActionType;
    requestedBy: string;
    requestedAt: string;
    currentValue: string;
    proposedValue: string;
    status: PitsActionRequestStatus;
    auditRequired: true;
    confirmationRequired: true;
    rollbackRequired: true;
    permissionRequired: string;
    safetyGates: string[];
    expectedImpact: string;
    rollbackPlan: string;
    noDirectMutation: true;
  };
  type ProjectRegistryEntity = RegistrySnapshot["projects"][number];
  type ProductUatSurface = {
    id: string;
    productCode: string;
    productName: string;
    surfaceName: string;
    route: string | null;
    entityType: RegistryHealthEntityKind | "platform";
    entityId: string | null;
    category: ProductUatCategory;
    statusLabel: string;
    testableNow: boolean;
    realProductFunction: boolean;
    ownerUatStatus: "READY_FOR_BROWSER_UAT" | "MAPPED_AS_CONTROL_PLANE" | "NOT_IMPLEMENTED_YET";
    currentUserTest: string;
    currentReality: string;
    functionalGap: string | null;
    blockers: ProductUatCategory[];
    recommendedNextStep: string;
    nextUserLevelTestPath: string | null;
    evidence: string[];
  };
  type ProductUatProduct = {
    productCode: string;
    productName: string;
    productId: string | null;
    currentState: string;
    ownerUatStatus: "READY_FOR_BROWSER_UAT" | "MAPPED_AS_CONTROL_PLANE" | "NOT_IMPLEMENTED_YET";
    testableNow: string[];
    controlPlaneOnly: string[];
    missingProductFunctions: string[];
    recommendedNextJourneys: string[];
    surfaces: ProductUatSurface[];
  };

  const forbiddenRuntimeUrlFragments = ["localhost", "127.0.0.1", ["ois", "dmp247", "com"].join("."), ["oisys", "abacusai", "app"].join(".")];
  const approvedRuntimeBaseUrls = [
    publicRuntimeConfig.coreApiBaseUrl,
    publicRuntimeConfig.oisConsoleBaseUrl,
    publicRuntimeConfig.pitsShellBaseUrl,
    publicRuntimeConfig.oimaShellBaseUrl
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

  function oimaShellUrl(path: string) {
    return publicRuntimeUrl(publicRuntimeConfig.oimaShellBaseUrl, path);
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
            : product.code === "OIMA"
              ? publicRuntimeConfig.oimaShellBaseUrl
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
          pitsProject: projectRuntimeUrl,
          oimaApp: product.code === "OIMA" ? oimaShellUrl("/") : null
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
            "Product runtime base URL is configured for this staging product.",
                productRuntimeUrl
              )
            : healthCheck(
                "Product runtime URL",
                "Not applicable",
                true,
                false,
                "No dedicated public runtime URL is active for this product in this stage."
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
          ownerAction: stagingSafe ? null : "Replace non-staging links with approved OIS, PITS, OIMA or Core API staging URLs."
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
      const runtimeRequired = product.code === "OIS" || product.code === "PITS" || product.code === "OIMA";
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

  function buildProductUat(registry: RegistrySnapshot) {
    const productByCode = (code: string) => registry.products.find((product) => product.code === code) ?? null;
    const productName = (code: string, fallback: string) => productByCode(code)?.name ?? fallback;
    const productId = (code: string) => productByCode(code)?.id ?? null;
    const firstProject = registry.projects[0] ?? null;
    const firstWorkspace = registry.workspaces[0] ?? null;
    const firstPitsInstallation = registry.installations.find((installation) => installation.productCode === "PITS") ?? registry.installations[0] ?? null;
    const firstWorkItemId = firstProject ? createPitsWorkItems(firstProject)[0]?.id ?? null : null;
    const firstWorkItemDetailPath =
      firstProject && firstWorkItemId
        ? pitsShellUrl(`/projects/${encodeURIComponent(firstProject.id)}/work-items/${encodeURIComponent(firstWorkItemId)}`)
        : null;
    const categoryDefinitions: Array<{ category: ProductUatCategory; label: string; description: string }> = [
      {
        category: "AVAILABLE_FOR_BROWSER_UAT",
        label: "Testable now",
        description: "A browser user can verify this surface today without writes."
      },
      {
        category: "PLATFORM_CONTROL_PLANE_ONLY",
        label: "Control-plane only",
        description: "The surface is useful for administration, registry or runtime validation, not end-user product workflow."
      },
      {
        category: "PLACEHOLDER_OR_SHELL_ONLY",
        label: "Placeholder or shell only",
        description: "The shell or navigation exists, but user-level product behavior is not implemented."
      },
      {
        category: "FUTURE_PRODUCT_FUNCTION",
        label: "Not implemented yet",
        description: "The expected product function is planned for a later product stage."
      },
      {
        category: "BLOCKED_BY_MISSING_DATA_MODEL",
        label: "Needs data model",
        description: "The journey needs domain entities, relationships or starter data before implementation."
      },
      {
        category: "BLOCKED_BY_WRITE_BOUNDARY",
        label: "Needs write boundary",
        description: "The journey needs approved write, audit, confirmation and rollback rules before it can execute."
      },
      {
        category: "BLOCKED_BY_AUTH_OR_PERMISSION",
        label: "Needs auth or permission",
        description: "The journey needs user roles, permissions or product session rules before it can be enabled."
      },
      {
        category: "NEEDS_OWNER_DECISION",
        label: "Needs owner decision",
        description: "The next product behavior needs owner prioritization or acceptance criteria."
      }
    ];
    const statusLabelFor = (category: ProductUatCategory) =>
      categoryDefinitions.find((item) => item.category === category)?.label ?? "Not implemented yet";
    const surface = (input: Omit<ProductUatSurface, "statusLabel">): ProductUatSurface => ({
      ...input,
      statusLabel: statusLabelFor(input.category)
    });
    const oisProductName = productName("OIS", "OIS Console");
    const pitsProductName = productName("PITS", "PITS");
    const oisSurfaces: ProductUatSurface[] = [
      surface({
        id: "ois:root-shell",
        productCode: "OIS",
        productName: oisProductName,
        surfaceName: "OIS Console root and shell",
        route: oisConsoleUrl("/"),
        entityType: "platform",
        entityId: null,
        category: "AVAILABLE_FOR_BROWSER_UAT",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "READY_FOR_BROWSER_UAT",
        currentUserTest: "Open the OIS Console root and verify shell layout, cockpit, status badges and safe staging links.",
        currentReality: "This is a platform/product administration shell, not an end-user OIS business workflow.",
        functionalGap: "True OIS workspace, document, meeting or knowledge user journeys are not implemented yet.",
        blockers: ["NEEDS_OWNER_DECISION"],
        recommendedNextStep: "Choose the first OIS end-user product journey and define its data model plus acceptance checks.",
        nextUserLevelTestPath: oisConsoleUrl("/dashboard"),
        evidence: ["Modern Shell Layout", "Owner Registry Cockpit / Registry Runtime Summary", "Ready to operate"]
      }),
      surface({
        id: "ois:dashboard",
        productCode: "OIS",
        productName: oisProductName,
        surfaceName: "OIS dashboard and platform overview",
        route: oisConsoleUrl("/dashboard"),
        entityType: "platform",
        entityId: null,
        category: "PLATFORM_CONTROL_PLANE_ONLY",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "MAPPED_AS_CONTROL_PLANE",
        currentUserTest: "Verify registry health, readiness, owner review and admin boundary summaries.",
        currentReality: "The dashboard proves control-plane readiness and runtime status.",
        functionalGap: "It does not yet execute OIS user work such as meetings, documents, knowledge capture or copilot tasks.",
        blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "NEEDS_OWNER_DECISION"],
        recommendedNextStep: "Pick one user-level OIS workflow to replace the control-plane-only validation as the next product test.",
        nextUserLevelTestPath: oisConsoleUrl("/dashboard"),
        evidence: ["Registry Governance / Readiness", "Owner Review Queue", "Admin Boundary"]
      }),
      surface({
        id: "ois:product-registry",
        productCode: "OIS",
        productName: oisProductName,
        surfaceName: "Product registry and product details",
        route: oisConsoleUrl("/products"),
        entityType: "product",
        entityId: productId("PITS"),
        category: "PLATFORM_CONTROL_PLANE_ONLY",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "MAPPED_AS_CONTROL_PLANE",
        currentUserTest: "Open Products and a product detail to verify registry data, module links, readiness and runtime health.",
        currentReality: "This is product administration and registry inspection.",
        functionalGap: "It is not a product user's working screen for OIS or PITS behavior.",
        blockers: ["BLOCKED_BY_WRITE_BOUNDARY"],
        recommendedNextStep: "Define the first editable product lifecycle only after audit/write gates are approved.",
        nextUserLevelTestPath: productId("PITS") ? oisConsoleUrl(`/products/${encodeURIComponent(productId("PITS") ?? "")}`) : oisConsoleUrl("/products"),
        evidence: ["Products & Modules", "Product Governance / Readiness", "Product Runtime Health"]
      }),
      surface({
        id: "ois:workspace-registry",
        productCode: "OIS",
        productName: oisProductName,
        surfaceName: "Workspace registry and workspace details",
        route: oisConsoleUrl("/workspaces"),
        entityType: "workspace",
        entityId: firstWorkspace?.id ?? null,
        category: "PLATFORM_CONTROL_PLANE_ONLY",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "MAPPED_AS_CONTROL_PLANE",
        currentUserTest: "Open Workspaces and a workspace detail to verify tenant/workspace/project relationships.",
        currentReality: "This is workspace administration and relationship visibility.",
        functionalGap: "It does not yet provide an end-user workspace home, task stream or collaboration workflow.",
        blockers: ["BLOCKED_BY_AUTH_OR_PERMISSION", "BLOCKED_BY_MISSING_DATA_MODEL"],
        recommendedNextStep: "Define the workspace user's landing journey and required permission model.",
        nextUserLevelTestPath: firstWorkspace ? oisConsoleUrl(`/workspaces/${encodeURIComponent(firstWorkspace.id)}`) : oisConsoleUrl("/workspaces"),
        evidence: ["Workspace Overview", "Workspace Governance / Readiness", "Workspace Runtime Health"]
      }),
      surface({
        id: "ois:runtime-boundaries",
        productCode: "OIS",
        productName: oisProductName,
        surfaceName: "Runtime, review and audit boundaries",
        route: oisConsoleUrl("/runtime"),
        entityType: "platform",
        entityId: null,
        category: "PLATFORM_CONTROL_PLANE_ONLY",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "MAPPED_AS_CONTROL_PLANE",
        currentUserTest: "Verify runtime health, readiness, safe action boundary and audit/admin permission model.",
        currentReality: "This is runtime governance and owner safety visibility.",
        functionalGap: "It does not yet create or update user work.",
        blockers: ["BLOCKED_BY_WRITE_BOUNDARY"],
        recommendedNextStep: "Keep this as the safety baseline before enabling any user-level write workflow.",
        nextUserLevelTestPath: oisConsoleUrl("/runtime"),
        evidence: ["Runtime Status", "Safe Action Boundary", "Audit / Permission / Admin Boundary"]
      }),
      surface({
        id: "ois:future-workspace-home",
        productCode: "OIS",
        productName: oisProductName,
        surfaceName: "Future OIS workspace/product user home",
        route: null,
        entityType: "workspace",
        entityId: firstWorkspace?.id ?? null,
        category: "PLACEHOLDER_OR_SHELL_ONLY",
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
      }),
      surface({
        id: "ois:future-knowledge-docs-copilot",
        productCode: "OIS",
        productName: oisProductName,
        surfaceName: "Future meeting, document, knowledge and copilot functions",
        route: null,
        entityType: "platform",
        entityId: null,
        category: "NEEDS_OWNER_DECISION",
        testableNow: false,
        realProductFunction: true,
        ownerUatStatus: "NOT_IMPLEMENTED_YET",
        currentUserTest: "No browser UAT path exists yet for OIS meeting, document, knowledge or copilot functions.",
        currentReality: "These are future product capabilities, not Stage 1K behavior.",
        functionalGap: "Needs owner priority, domain model, evidence rules and non-LLM baseline tests before implementation.",
        blockers: ["NEEDS_OWNER_DECISION", "BLOCKED_BY_MISSING_DATA_MODEL", "BLOCKED_BY_AUTH_OR_PERMISSION"],
        recommendedNextStep: "Choose whether OIS workspace, document or knowledge should be the first true user journey.",
        nextUserLevelTestPath: null,
        evidence: ["Not implemented yet", "Next product journey"]
      })
    ];
    const pitsSurfaces: ProductUatSurface[] = [
      surface({
        id: "pits:root-shell",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "PITS runtime shell",
        route: pitsShellUrl("/"),
        entityType: "platform",
        entityId: null,
        category: "AVAILABLE_FOR_BROWSER_UAT",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "READY_FOR_BROWSER_UAT",
        currentUserTest: "Open PITS Shell and verify the product runtime frame, project summary and safe staging links.",
        currentReality: "PITS is currently a project registry/readiness shell, not a true project workflow app.",
        functionalGap: "Issue, task, incident, status and work-tracking journeys are not implemented yet.",
        blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "NEEDS_OWNER_DECISION"],
        recommendedNextStep: "Select the first PITS workflow journey, likely project issue/task triage, before adding writes.",
        nextUserLevelTestPath: pitsShellUrl("/projects"),
        evidence: ["PITS Registry Cockpit / Project Runtime Summary", "Project readiness"]
      }),
      surface({
        id: "pits:project-list",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "PITS project list",
        route: pitsShellUrl("/projects"),
        entityType: "project",
        entityId: firstProject?.id ?? null,
        category: "AVAILABLE_FOR_BROWSER_UAT",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "READY_FOR_BROWSER_UAT",
        currentUserTest: "Open Projects and confirm project cards, installation context, readiness and runtime health.",
        currentReality: "This is testable as a project registry shell and readiness shell.",
        functionalGap: "It does not yet support issue/task creation, assignment, status updates or project workflow execution.",
        blockers: ["BLOCKED_BY_WRITE_BOUNDARY", "BLOCKED_BY_MISSING_DATA_MODEL"],
        recommendedNextStep: "Define a read-only issue/task list or status board as the first true PITS workflow baseline.",
        nextUserLevelTestPath: firstProject ? pitsShellUrl(`/projects/${encodeURIComponent(firstProject.id)}`) : pitsShellUrl("/projects"),
        evidence: ["Project Selector", "Project Installation Registry", "Registry Governance / Readiness"]
      }),
      surface({
        id: "pits:project-detail",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "PITS project detail",
        route: firstProject ? pitsShellUrl(`/projects/${encodeURIComponent(firstProject.id)}`) : pitsShellUrl("/projects"),
        entityType: "project",
        entityId: firstProject?.id ?? null,
        category: "AVAILABLE_FOR_BROWSER_UAT",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "READY_FOR_BROWSER_UAT",
        currentUserTest: "Open one project detail and verify OIS cross-links, project readiness, runtime health and owner boundaries.",
        currentReality: "This is a project detail/readiness shell.",
        functionalGap: "It does not yet provide field reports, cases, tasks, incidents or work status transitions.",
        blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "BLOCKED_BY_WRITE_BOUNDARY"],
        recommendedNextStep: "Add a read-only project workflow baseline before enabling task or incident writes.",
        nextUserLevelTestPath: firstProject ? pitsShellUrl(`/projects/${encodeURIComponent(firstProject.id)}`) : null,
        evidence: ["Project Detail Source", "Project Runtime Health", "Owner-facing project UAT summary"]
      }),
      surface({
        id: "pits:project-workboard",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "PITS Project Workboard",
        route: firstProject ? pitsShellUrl(`/projects/${encodeURIComponent(firstProject.id)}/workboard`) : pitsShellUrl("/projects"),
        entityType: "project",
        entityId: firstProject?.id ?? null,
        category: "AVAILABLE_FOR_BROWSER_UAT",
        testableNow: true,
        realProductFunction: true,
        ownerUatStatus: "READY_FOR_BROWSER_UAT",
        currentUserTest: "Open the project workboard and inspect work items grouped by Open, In progress, Blocked and Done.",
        currentReality: "Stage 2A provides a read-only PITS workboard functional slice for owner/browser UAT.",
        functionalGap: "Create, edit, delete and status-change actions are not implemented; work items are deterministic demo/runtime data.",
        blockers: ["BLOCKED_BY_WRITE_BOUNDARY"],
        recommendedNextStep: "Define Stage 2B/2C write-boundary acceptance criteria before enabling work item changes.",
        nextUserLevelTestPath: firstProject ? pitsShellUrl(`/projects/${encodeURIComponent(firstProject.id)}/workboard`) : null,
        evidence: ["PITS Project Workboard", "Read-only functional slice", "Work items"]
      }),
      surface({
        id: "pits:work-item-detail-dry-run",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "PITS Work Item Detail and Dry-run Action Preview",
        route: firstWorkItemDetailPath,
        entityType: "project",
        entityId: firstProject?.id ?? null,
        category: "AVAILABLE_FOR_BROWSER_UAT",
        testableNow: Boolean(firstWorkItemDetailPath),
        realProductFunction: true,
        ownerUatStatus: firstWorkItemDetailPath ? "READY_FOR_BROWSER_UAT" : "NOT_IMPLEMENTED_YET",
        currentUserTest: "Open a work item detail and inspect dry-run action previews without changing data.",
        currentReality: "Stage 2B provides read-only work item detail and deterministic dry-run action preview.",
        functionalGap: "No real status, owner, note, priority or blocker mutation is implemented.",
        blockers: ["BLOCKED_BY_WRITE_BOUNDARY"],
        recommendedNextStep: "Owner-test dry-run previews, then define the future write-boundary acceptance criteria.",
        nextUserLevelTestPath: firstWorkItemDetailPath,
        evidence: ["Work Item Detail", "Dry-run Action Preview", "No data will be changed"]
      }),
      surface({
        id: "pits:runtime-readiness-boundaries",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "PITS runtime, readiness and boundary summary",
        route: pitsShellUrl("/runtime"),
        entityType: "platform",
        entityId: null,
        category: "PLATFORM_CONTROL_PLANE_ONLY",
        testableNow: true,
        realProductFunction: false,
        ownerUatStatus: "MAPPED_AS_CONTROL_PLANE",
        currentUserTest: "Verify project runtime health, readiness, owner review and audit/admin boundary status.",
        currentReality: "This is runtime readiness and governance visibility for PITS.",
        functionalGap: "It is not a project user's daily work execution screen.",
        blockers: ["BLOCKED_BY_WRITE_BOUNDARY"],
        recommendedNextStep: "Use this as the safety baseline for the first project workflow read model.",
        nextUserLevelTestPath: pitsShellUrl("/runtime"),
        evidence: ["Runtime Status", "Safe Action Boundary", "Audit / Permission / Admin Boundary"]
      }),
      surface({
        id: "pits:future-issue-task-workflow",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "Future issue and task workflow",
        route: null,
        entityType: "project",
        entityId: firstProject?.id ?? null,
        category: "BLOCKED_BY_MISSING_DATA_MODEL",
        testableNow: false,
        realProductFunction: true,
        ownerUatStatus: "NOT_IMPLEMENTED_YET",
        currentUserTest: "Browser UAT can inspect Stage 2A workboard items, but persisted issue/task workflow is not available yet.",
        currentReality: "Stage 2A adds a read-only workboard; persisted issue/task creation and updates are still future work.",
        functionalGap: "Needs project workflow entities, relationships, starter data, write boundaries and acceptance tests.",
        blockers: ["BLOCKED_BY_MISSING_DATA_MODEL", "NEEDS_OWNER_DECISION"],
        recommendedNextStep: "Use the read-only workboard as the acceptance baseline before adding writes.",
        nextUserLevelTestPath: firstProject ? pitsShellUrl(`/projects/${encodeURIComponent(firstProject.id)}/workboard`) : null,
        evidence: ["PITS Project Workboard", "Functional gap map"]
      }),
      surface({
        id: "pits:future-status-work-tracking",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "Future incident, status and work-tracking capabilities",
        route: null,
        entityType: "project",
        entityId: firstProject?.id ?? null,
        category: "FUTURE_PRODUCT_FUNCTION",
        testableNow: false,
        realProductFunction: true,
        ownerUatStatus: "NOT_IMPLEMENTED_YET",
        currentUserTest: "No browser UAT path exists yet for incident, status or work-tracking functions.",
        currentReality: "These are planned future product capabilities.",
        functionalGap: "Needs owner sequencing, data model, permission model and write boundary approval.",
        blockers: ["BLOCKED_BY_WRITE_BOUNDARY", "BLOCKED_BY_AUTH_OR_PERMISSION", "NEEDS_OWNER_DECISION"],
        recommendedNextStep: "Choose whether issue/task triage or project status tracking is the next PITS user journey.",
        nextUserLevelTestPath: null,
        evidence: ["Not implemented yet", "Next product journey"]
      }),
      surface({
        id: "pits:future-project-status-write",
        productCode: "PITS",
        productName: pitsProductName,
        surfaceName: "Future project status update",
        route: firstPitsInstallation?.projectId ? pitsShellUrl(`/projects/${encodeURIComponent(firstPitsInstallation.projectId)}`) : null,
        entityType: "installation",
        entityId: firstPitsInstallation?.id ?? null,
        category: "BLOCKED_BY_WRITE_BOUNDARY",
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
      })
    ];
    const buildProduct = (
      productCode: "OIS" | "PITS",
      productNameValue: string,
      surfaces: ProductUatSurface[],
      currentState: string,
      recommendedNextJourneys: string[]
    ): ProductUatProduct => ({
      productCode,
      productName: productNameValue,
      productId: productId(productCode),
      currentState,
      ownerUatStatus: "READY_FOR_BROWSER_UAT",
      testableNow: surfaces.filter((item) => item.testableNow).map((item) => item.surfaceName),
      controlPlaneOnly: surfaces.filter((item) => item.category === "PLATFORM_CONTROL_PLANE_ONLY").map((item) => item.surfaceName),
      missingProductFunctions: surfaces.filter((item) => !item.testableNow).map((item) => item.surfaceName),
      recommendedNextJourneys,
      surfaces
    });
    const products = [
      buildProduct("OIS", oisProductName, oisSurfaces, "Strong platform/control-plane foundation; true OIS end-user functions are mapped but not implemented yet.", [
        "Define the first OIS workspace user home",
        "Choose document, meeting or knowledge as the first OIS product workflow",
        "Keep admin/write actions disabled until a later approved stage"
      ]),
      buildProduct("PITS", pitsProductName, pitsSurfaces, "Project registry shell, Stage 2A read-only workboard and Stage 2B work item detail/dry-run preview; writes remain blocked.", [
        "Owner-test the PITS Project Workboard read-only functional slice",
        "Owner-test PITS Work Item Detail and Dry-run Action Preview",
        "Keep project status writes disabled until audit/write boundaries are approved"
      ])
    ];
    const allSurfaces = products.flatMap((product) => product.surfaces);
    const countCategory = (category: ProductUatCategory) => allSurfaces.filter((surfaceItem) => surfaceItem.category === category).length;

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        uatMode: "read-only-product-user-journey-map",
        stage: "Stage 1K",
        note: "Product User Journey UAT is a read-only functional gap map. It does not enable product writes or admin actions."
      },
      productUat: {
        stage: "Stage 1K",
        mutationEndpointsAdded: false,
        writePermission: "NOT_ALLOWED_IN_STAGE_1K" as const,
        markers: ["Product User Journey UAT", "Testable now", "Control-plane only", "Functional gap map", "Next product journey"]
      },
      summary: {
        products: products.length,
        surfaces: allSurfaces.length,
        visiblePages: allSurfaces.filter((surfaceItem) => surfaceItem.route).length,
        testableNow: allSurfaces.filter((surfaceItem) => surfaceItem.testableNow).length,
        realProductFunctionsAvailable: allSurfaces.filter((surfaceItem) => surfaceItem.testableNow && surfaceItem.realProductFunction).length,
        controlPlaneOnly: countCategory("PLATFORM_CONTROL_PLANE_ONLY"),
        placeholderOrShellOnly: countCategory("PLACEHOLDER_OR_SHELL_ONLY"),
        futureProductFunctions: countCategory("FUTURE_PRODUCT_FUNCTION"),
        blockedByMissingDataModel: countCategory("BLOCKED_BY_MISSING_DATA_MODEL"),
        blockedByWriteBoundary: countCategory("BLOCKED_BY_WRITE_BOUNDARY"),
        blockedByAuthOrPermission: countCategory("BLOCKED_BY_AUTH_OR_PERMISSION"),
        needsOwnerDecision: countCategory("NEEDS_OWNER_DECISION")
      },
      categories: categoryDefinitions,
      products,
      recommendedNextProductJourneys: [
        "Confirm whether OIS workspace home or PITS issue/task workflow is the first true product journey.",
        "Start with read-only product workflow screens before any write/admin action.",
        "Add data-model and acceptance-test evidence before Phase 2/3 behavior is ported."
      ]
    };
  }

  function createPitsWorkItems(project: ProjectRegistryEntity): PitsWorkItem[] {
    const baseId = project.id.replace(/^prj_/, "");

    return [
      {
        id: `pits-${baseId}-open-site-access`,
        title: "Confirm site access package",
        type: "TASK",
        status: "OPEN",
        priority: "HIGH",
        owner: "Project operator",
        dueDate: "2026-07-12",
        source: "Stage 2A deterministic demo data",
        summary: "Validate the owner can see the first actionable project work item without creating or editing data.",
        nextAction: "Review access package checklist with the site lead.",
        blockers: [],
        relatedProjectId: project.id,
        updatedAt: "2026-07-08T09:00:00.000Z"
      },
      {
        id: `pits-${baseId}-progress-inspection-plan`,
        title: "Prepare inspection walk plan",
        type: "TASK",
        status: "IN_PROGRESS",
        priority: "MEDIUM",
        owner: "Field coordinator",
        dueDate: "2026-07-15",
        source: "Stage 2A deterministic demo data",
        summary: "Draft the read-only sequence of project checks the owner can inspect in the browser.",
        nextAction: "Compare planned checkpoints with the project readiness summary.",
        blockers: [],
        relatedProjectId: project.id,
        updatedAt: "2026-07-08T10:00:00.000Z"
      },
      {
        id: `pits-${baseId}-blocked-fire-door-risk`,
        title: "Resolve fire door access risk",
        type: "RISK",
        status: "BLOCKED",
        priority: "CRITICAL",
        owner: "Safety lead",
        dueDate: "2026-07-07",
        source: "Stage 2A deterministic demo data",
        summary: "A high-priority project risk is visible, but resolution remains disabled until write boundaries exist.",
        nextAction: "Owner reviews blocker context; status changes require Stage 2B/2C write boundary.",
        blockers: ["Awaiting owner decision", "Requires Stage 2B/2C write boundary"],
        relatedProjectId: project.id,
        updatedAt: "2026-07-08T11:00:00.000Z"
      },
      {
        id: `pits-${baseId}-open-tenant-notice`,
        title: "Decide tenant notice wording",
        type: "DECISION",
        status: "OPEN",
        priority: "MEDIUM",
        owner: "Owner representative",
        dueDate: "2026-07-18",
        source: "Stage 2A deterministic demo data",
        summary: "Decision item demonstrates that the workboard can show non-task workflow work in read-only mode.",
        nextAction: "Review notice copy outside the system; no approval action is enabled here.",
        blockers: [],
        relatedProjectId: project.id,
        updatedAt: "2026-07-08T12:00:00.000Z"
      },
      {
        id: `pits-${baseId}-done-registry-check`,
        title: "Verify project registry links",
        type: "FOLLOW_UP",
        status: "DONE",
        priority: "LOW",
        owner: "Runtime steward",
        dueDate: "2026-07-05",
        source: "Stage 2A deterministic demo data",
        summary: "Completed item proves the board can distinguish done work from active work.",
        nextAction: "No action required; keep evidence visible for owner UAT.",
        blockers: [],
        relatedProjectId: project.id,
        updatedAt: "2026-07-08T13:00:00.000Z"
      }
    ];
  }

  const pitsDryRunActionLabels: Record<PitsDryRunActionType, string> = {
    CHANGE_STATUS: "Change status preview",
    ASSIGN_OWNER: "Assign owner preview",
    ADD_NOTE: "Add note preview",
    SET_PRIORITY: "Set priority preview",
    RESOLVE_BLOCKER: "Resolve blocker preview"
  };
  const pitsDryRunActionTypes = Object.keys(pitsDryRunActionLabels) as PitsDryRunActionType[];
  const pitsDryRunSafetyGates = [
    "Requires future write boundary",
    "Requires audit trail",
    "Requires confirmation",
    "Requires rollback plan",
    "No data will be changed in Stage 2B"
  ];

  function isPitsDryRunActionType(value: string | undefined): value is PitsDryRunActionType {
    return Boolean(value && pitsDryRunActionTypes.includes(value as PitsDryRunActionType));
  }

  function getPitsDryRunCurrentValue(item: PitsWorkItem, actionType: PitsDryRunActionType) {
    if (actionType === "CHANGE_STATUS") {
      return item.status;
    }

    if (actionType === "ASSIGN_OWNER") {
      return item.owner;
    }

    if (actionType === "ADD_NOTE") {
      return "No persisted note field is available in Stage 2B.";
    }

    if (actionType === "SET_PRIORITY") {
      return item.priority;
    }

    return item.blockers.length > 0 ? item.blockers.join("; ") : "No blocker is currently recorded.";
  }

  function getPitsDryRunProposedValue(item: PitsWorkItem, actionType: PitsDryRunActionType, requestedValue?: string) {
    if (requestedValue) {
      return requestedValue;
    }

    if (actionType === "CHANGE_STATUS") {
      return item.status === "DONE" ? "OPEN" : "DONE";
    }

    if (actionType === "ASSIGN_OWNER") {
      return "Owner delegate";
    }

    if (actionType === "ADD_NOTE") {
      return "Dry-run note: owner reviewed this item.";
    }

    if (actionType === "SET_PRIORITY") {
      return item.priority === "CRITICAL" ? "HIGH" : "CRITICAL";
    }

    return item.blockers.length > 0 ? "Preview blocker resolution request for owner review." : "No blocker resolution available for this item.";
  }

  function getPitsDryRunExpectedImpact(actionType: PitsDryRunActionType) {
    if (actionType === "CHANGE_STATUS") {
      return "Would move the work item to another status column after a future audited write boundary exists.";
    }

    if (actionType === "ASSIGN_OWNER") {
      return "Would reassign responsibility after future permission checks and audit logging are approved.";
    }

    if (actionType === "ADD_NOTE") {
      return "Would append an auditable project note after note storage and write rules exist.";
    }

    if (actionType === "SET_PRIORITY") {
      return "Would change escalation priority after confirmation and rollback requirements are met.";
    }

    return "Would record blocker resolution evidence after future workflow writes are enabled.";
  }

  function getPitsDryRunRequiredRole(actionType: PitsDryRunActionType) {
    if (actionType === "ASSIGN_OWNER" || actionType === "SET_PRIORITY") {
      return "PROJECT_MANAGER";
    }

    if (actionType === "RESOLVE_BLOCKER") {
      return "SAFETY_LEAD";
    }

    return "PROJECT_OPERATOR";
  }

  function createPitsDryRunActionPreviews(item: PitsWorkItem, requestedActionType?: PitsDryRunActionType, requestedValue?: string): PitsDryRunActionPreview[] {
    const actionTypes = requestedActionType ? [requestedActionType] : pitsDryRunActionTypes;

    return actionTypes.map((actionType) => ({
      actionType,
      label: pitsDryRunActionLabels[actionType],
      allowedInCurrentStage: false,
      mode: "DRY_RUN_ONLY",
      currentValue: getPitsDryRunCurrentValue(item, actionType),
      proposedValue: getPitsDryRunProposedValue(item, actionType, requestedActionType === actionType ? requestedValue : undefined),
      expectedImpact: getPitsDryRunExpectedImpact(actionType),
      requiredRole: getPitsDryRunRequiredRole(actionType),
      auditRequired: true,
      confirmationRequired: true,
      rollbackRequired: true,
      blockedReason: "Stage 2B is dry-run only. Requires future write boundary before any status, owner, note, priority or blocker change can execute.",
      safetyGates: pitsDryRunSafetyGates,
      noDataChanged: true
    }));
  }

  const pitsActionRequestMarkers = [
    "PITS Action Request",
    "Action request only",
    "No direct mutation",
    "Pending review",
    "Requires audit trail",
    "Requires confirmation",
    "Requires rollback plan"
  ];

  function getPitsActionRequestStatus(item: PitsWorkItem, actionType: PitsDryRunActionType): PitsActionRequestStatus {
    if (actionType === "SET_PRIORITY") {
      return "BLOCKED_BY_SAFETY_GATE";
    }

    if (actionType === "RESOLVE_BLOCKER" && item.blockers.length === 0) {
      return "BLOCKED_BY_SAFETY_GATE";
    }

    if (actionType === "ASSIGN_OWNER") {
      return "DRAFT";
    }

    return "PENDING_REVIEW";
  }

  function createPitsActionRequest(project: ProjectRegistryEntity, item: PitsWorkItem, preview: PitsDryRunActionPreview): PitsWorkItemActionRequest {
    const actionSlug = preview.actionType.toLowerCase().replace(/_/g, "-");

    return {
      requestId: `par-${project.id}-${item.id}-${actionSlug}`,
      projectId: project.id,
      workItemId: item.id,
      actionType: preview.actionType,
      requestedBy: "owner-review-runtime",
      requestedAt: "2026-07-09T00:00:00.000Z",
      currentValue: preview.currentValue,
      proposedValue: preview.proposedValue,
      status: getPitsActionRequestStatus(item, preview.actionType),
      auditRequired: true,
      confirmationRequired: true,
      rollbackRequired: true,
      permissionRequired: preview.requiredRole,
      safetyGates: [
        "Action request only",
        "Work item is not changed yet",
        "No direct mutation",
        "Requires audit trail",
        "Requires confirmation",
        "Requires rollback plan",
        "Requires owner or admin confirmation",
        ...preview.safetyGates
      ],
      expectedImpact: preview.expectedImpact,
      rollbackPlan: "No source work item is changed in Stage 2E. The staged request can be rejected or discarded without rollback.",
      noDirectMutation: true
    };
  }

  function createPitsActionRequests(project: ProjectRegistryEntity, item: PitsWorkItem, requestedActionType?: PitsDryRunActionType, requestedValue?: string) {
    return createPitsDryRunActionPreviews(item, requestedActionType, requestedValue).map((preview) => createPitsActionRequest(project, item, preview));
  }

  function buildPitsWorkItemActionRequests(registry: RegistrySnapshot, project: ProjectRegistryEntity, item: PitsWorkItem) {
    const requests = createPitsActionRequests(project, item);

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        actionRequestMode: "read-only-action-request-boundary",
        stage: "Stage 2E",
        note: "PITS Action Request is staged only. No direct mutation is enabled."
      },
      actionRequestList: {
        projectId: project.id,
        projectCode: project.code,
        projectName: project.name,
        workItemId: item.id,
        supportedActions: pitsDryRunActionTypes,
        actionRequestOnly: true,
        noDirectMutation: true,
        markers: pitsActionRequestMarkers
      },
      requests,
      readOnlyBoundary: {
        mutationEndpointsAdded: false,
        writePermission: "NOT_ALLOWED_IN_STAGE_2E",
        notice: "Action request only. Work item is not changed yet.",
        disabledActions: [
          "Create action request - Read-only deterministic preview",
          "Stage for review - Read-only deterministic preview",
          "Approve action request - Requires future audited write boundary",
          "Apply work item change - Not available in Stage 2E"
        ],
        futureWriteBoundary: "Requires audit trail, confirmation, permission check and rollback plan before any mutation."
      },
      noDirectMutation: true
    };
  }

  function buildPitsWorkItemActionRequestPreview(
    registry: RegistrySnapshot,
    project: ProjectRegistryEntity,
    item: PitsWorkItem,
    requestedActionType?: PitsDryRunActionType,
    requestedValue?: string
  ) {
    const requests = createPitsActionRequests(project, item, requestedActionType, requestedValue);
    const request = requestedActionType ? requests[0] : null;

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        actionRequestPreviewMode: "read-only-action-request-preview",
        stage: "Stage 2E",
        note: "Action request preview is non-mutating and requires owner or admin confirmation before any future execution."
      },
      actionRequestPreview: {
        projectId: project.id,
        projectCode: project.code,
        projectName: project.name,
        workItemId: item.id,
        requestedActionType: requestedActionType ?? null,
        actionRequestOnly: true,
        noDirectMutation: true,
        markers: pitsActionRequestMarkers
      },
      requests,
      request,
      sourceItemUnchanged: {
        itemId: item.id,
        status: item.status,
        priority: item.priority,
        owner: item.owner,
        blockers: item.blockers
      },
      noDirectMutation: true
    };
  }

  function createPitsWorkItemDescription(project: ProjectRegistryEntity, item: PitsWorkItem) {
    return `${item.title} belongs to ${project.name}. Stage 2B lets the owner inspect this work item and preview future actions without mutating project data.`;
  }

  function buildPitsWorkItemDetail(registry: RegistrySnapshot, project: ProjectRegistryEntity, item: PitsWorkItem) {
    const dryRunPreviews = createPitsDryRunActionPreviews(item);

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        workItemDetailMode: "read-only-dry-run-preview",
        stage: "Stage 2B",
        note: "Work Item Detail and Dry-run Action Preview are preview only. No data will be changed."
      },
      workItemDetail: {
        projectId: project.id,
        projectCode: project.code,
        projectName: project.name,
        itemId: item.id,
        readOnly: true,
        dryRunOnly: true,
        markers: [
          "Work Item Detail",
          "Dry-run Action Preview",
          "Preview only",
          "No data will be changed",
          "Requires audit trail",
          "Requires confirmation",
          "Requires rollback plan"
        ]
      },
      item: {
        ...item,
        description: createPitsWorkItemDescription(project, item),
        readOnlyNotice: "Preview only. No data will be changed.",
        relatedEntities: [
          { type: "project", id: project.id, name: project.name },
          { type: "workboard", id: `${project.id}:workboard`, name: "PITS Project Workboard" },
          { type: "product", id: "PITS", name: "PITS" }
        ],
        availableDryRunActions: dryRunPreviews.map((preview) => ({
          actionType: preview.actionType,
          label: preview.label,
          currentValue: preview.currentValue,
          proposedValue: preview.proposedValue,
          previewRoute: `/platform/pits/projects/${encodeURIComponent(project.id)}/work-items/${encodeURIComponent(item.id)}/action-preview?actionType=${encodeURIComponent(preview.actionType)}`
        }))
      },
      dryRunPreviews,
      readOnlyBoundary: {
        mutationEndpointsAdded: false,
        writePermission: "NOT_ALLOWED_IN_STAGE_2B",
        notice: "Preview only. No data will be changed.",
        disabledActions: [
          "Change status - Preview only",
          "Assign owner - Preview only",
          "Add note - Preview only",
          "Set priority - Preview only",
          "Resolve blocker - Preview only"
        ],
        futureWriteBoundary: "Requires future write boundary"
      }
    };
  }

  function buildPitsDryRunActionPreview(
    registry: RegistrySnapshot,
    project: ProjectRegistryEntity,
    item: PitsWorkItem,
    requestedActionType?: PitsDryRunActionType,
    requestedValue?: string
  ) {
    const previews = createPitsDryRunActionPreviews(item, requestedActionType, requestedValue);

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        dryRunMode: "DRY_RUN_ONLY",
        stage: "Stage 2B",
        note: "Dry-run Action Preview is non-mutating. No data will be changed."
      },
      actionPreview: {
        projectId: project.id,
        projectCode: project.code,
        projectName: project.name,
        itemId: item.id,
        requestedActionType: requestedActionType ?? null,
        allowedInCurrentStage: false,
        noDataChanged: true,
        markers: [
          "Dry-run Action Preview",
          "Preview only",
          "No data will be changed",
          "Requires audit trail",
          "Requires confirmation",
          "Requires rollback plan"
        ]
      },
      previews,
      preview: requestedActionType ? previews[0] : null,
      noDataChanged: true
    };
  }

  function buildPitsProjectWorkboard(registry: RegistrySnapshot, project: ProjectRegistryEntity) {
    const items = createPitsWorkItems(project);
    const statusDefinitions: Array<{ status: PitsWorkItemStatus; label: string }> = [
      { status: "OPEN", label: "Open" },
      { status: "IN_PROGRESS", label: "In progress" },
      { status: "BLOCKED", label: "Blocked" },
      { status: "DONE", label: "Done" }
    ];
    const countStatus = (status: PitsWorkItemStatus) => items.filter((item) => item.status === status).length;
    const highPriorityCount = items.filter((item) => item.priority === "HIGH" || item.priority === "CRITICAL").length;

    return {
      metadata: registry.metadata,
      runtime: {
        ...publicRuntimeConfig,
        workboardMode: "read-only-functional-slice",
        stage: "Stage 2A",
        note: "Read-only functional slice — editing is not enabled yet"
      },
      workboard: {
        projectId: project.id,
        projectCode: project.code,
        projectName: project.name,
        source: "deterministic-demo-data",
        stage: "Stage 2A",
        readOnly: true,
        markers: ["PITS Project Workboard", "Read-only functional slice", "Work items", "Open", "In progress", "Blocked", "Done"]
      },
      summary: {
        totalItems: items.length,
        openCount: countStatus("OPEN"),
        inProgressCount: countStatus("IN_PROGRESS"),
        blockedCount: countStatus("BLOCKED"),
        doneCount: countStatus("DONE"),
        highPriorityCount,
        overdueCount: 1,
        nextRecommendedAction: "Inspect blocked and high-priority items, then define Stage 2B/2C write-boundary acceptance criteria.",
        currentLimitations: [
          "Read-only functional slice — editing is not enabled yet",
          "No create, edit, delete or status-change mutation endpoint is available in Stage 2A.",
          "Work items are deterministic demo/runtime data, not persisted task records."
        ]
      },
      statusGroups: statusDefinitions.map((definition) => ({
        ...definition,
        items: items.filter((item) => item.status === definition.status)
      })),
      items,
      readOnlyBoundary: {
        editingEnabled: false,
        mutationEndpointsAdded: false,
        writePermission: "NOT_ALLOWED_IN_STAGE_2A",
        notice: "Read-only functional slice — editing is not enabled yet",
        disabledActions: [
          "Create work item - Preview only",
          "Edit work item - Not executable yet",
          "Change status - Requires Stage 2B/2C write boundary"
        ],
        futureWriteBoundary: "Requires Stage 2B/2C write boundary"
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
    if (code.toUpperCase() === "OIMA") {
      return {
        registry,
        product: buildOimaProductRegistryProjection()
      };
    }

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
        },
        "/platform/product-uat": {
          get: {
            tags: ["platform"],
            responses: {
              "200": {
                description: "Read-only product user journey UAT baseline and functional gap map",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "productUat", "summary", "categories", "products", "recommendedNextProductJourneys"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        productUat: { type: "object" },
                        summary: { type: "object" },
                        categories: { type: "array", items: { type: "object" } },
                        products: { type: "array", items: { type: "object" } },
                        recommendedNextProductJourneys: { type: "array", items: { type: "string" } }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/platform/pits/projects/{id}/workboard": {
          get: {
            tags: ["pits"],
            responses: {
              "200": {
                description: "Read-only PITS project workboard functional slice",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "workboard", "summary", "statusGroups", "items", "readOnlyBoundary"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        workboard: { type: "object" },
                        summary: { type: "object" },
                        statusGroups: { type: "array", items: { type: "object" } },
                        items: { type: "array", items: { type: "object" } },
                        readOnlyBoundary: { type: "object" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/platform/pits/projects/{projectId}/work-items/{itemId}": {
          get: {
            tags: ["pits"],
            responses: {
              "200": {
                description: "Read-only PITS work item detail with dry-run preview metadata",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "workItemDetail", "item", "dryRunPreviews", "readOnlyBoundary"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        workItemDetail: { type: "object" },
                        item: { type: "object" },
                        dryRunPreviews: { type: "array", items: { type: "object" } },
                        readOnlyBoundary: { type: "object" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/platform/pits/projects/{projectId}/work-items/{itemId}/action-preview": {
          get: {
            tags: ["pits"],
            responses: {
              "200": {
                description: "Non-mutating PITS dry-run action preview",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "actionPreview", "previews", "noDataChanged"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        actionPreview: { type: "object" },
                        previews: { type: "array", items: { type: "object" } },
                        preview: { type: "object", nullable: true },
                        noDataChanged: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/platform/pits/projects/{projectId}/work-items/{itemId}/action-requests": {
          get: {
            tags: ["pits"],
            responses: {
              "200": {
                description: "Read-only PITS work item action requests staged for owner review",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "actionRequestList", "requests", "readOnlyBoundary", "noDirectMutation"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        actionRequestList: { type: "object" },
                        requests: { type: "array", items: { type: "object" } },
                        readOnlyBoundary: { type: "object" },
                        noDirectMutation: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/platform/pits/projects/{projectId}/work-items/{itemId}/action-requests/{requestId}": {
          get: {
            tags: ["pits"],
            responses: {
              "200": {
                description: "Read-only PITS work item action request detail",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "actionRequestList", "request", "readOnlyBoundary", "noDirectMutation"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        actionRequestList: { type: "object" },
                        request: { type: "object" },
                        readOnlyBoundary: { type: "object" },
                        noDirectMutation: { type: "boolean" }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "/platform/pits/projects/{projectId}/work-items/{itemId}/action-request-preview": {
          get: {
            tags: ["pits"],
            responses: {
              "200": {
                description: "Non-mutating PITS action request preview",
                content: {
                  "application/json": {
                    schema: {
                      type: "object",
                      required: ["metadata", "runtime", "actionRequestPreview", "requests", "sourceItemUnchanged", "noDirectMutation"],
                      properties: {
                        metadata: { type: "object" },
                        runtime: { type: "object" },
                        actionRequestPreview: { type: "object" },
                        requests: { type: "array", items: { type: "object" } },
                        request: { type: "object", nullable: true },
                        sourceItemUnchanged: { type: "object" },
                        noDirectMutation: { type: "boolean" }
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

  app.get("/platform/product-uat", async () => buildProductUat(await readRegistry()));

  app.get("/platform/pits/projects/:id/workboard", async (request, reply) => {
    const params = request.params as { id: string };
    const { registry, project } = await readProjectDetailById(params.id);

    if (!project) {
      return registryNotFound(reply, "project", { id: params.id });
    }

    return buildPitsProjectWorkboard(registry, project);
  });

  app.get("/platform/pits/projects/:projectId/work-items/:itemId", async (request, reply) => {
    const params = request.params as { projectId: string; itemId: string };
    const { registry, project } = await readProjectDetailById(params.projectId);

    if (!project) {
      return registryNotFound(reply, "project", { id: params.projectId });
    }

    const item = createPitsWorkItems(project).find((workItem) => workItem.id === params.itemId);

    if (!item) {
      return registryNotFound(reply, "workItem", { projectId: params.projectId, itemId: params.itemId });
    }

    return buildPitsWorkItemDetail(registry, project, item);
  });

  app.get("/platform/pits/projects/:projectId/work-items/:itemId/action-preview", async (request, reply) => {
    const params = request.params as { projectId: string; itemId: string };
    const query = request.query as { actionType?: string; proposedValue?: string };
    const { registry, project } = await readProjectDetailById(params.projectId);

    if (!project) {
      return registryNotFound(reply, "project", { id: params.projectId });
    }

    const item = createPitsWorkItems(project).find((workItem) => workItem.id === params.itemId);

    if (!item) {
      return registryNotFound(reply, "workItem", { projectId: params.projectId, itemId: params.itemId });
    }

    if (query.actionType && !isPitsDryRunActionType(query.actionType)) {
      return reply.code(400).send({
        metadata: registry.metadata,
        error: {
          code: "INVALID_DRY_RUN_ACTION",
          message: "Unknown dry-run action type",
          allowedActionTypes: pitsDryRunActionTypes
        }
      });
    }

    const requestedActionType = isPitsDryRunActionType(query.actionType) ? query.actionType : undefined;

    return buildPitsDryRunActionPreview(registry, project, item, requestedActionType, query.proposedValue);
  });

  app.get("/platform/pits/projects/:projectId/work-items/:itemId/action-requests", async (request, reply) => {
    const params = request.params as { projectId: string; itemId: string };
    const { registry, project } = await readProjectDetailById(params.projectId);

    if (!project) {
      return registryNotFound(reply, "project", { id: params.projectId });
    }

    const item = createPitsWorkItems(project).find((workItem) => workItem.id === params.itemId);

    if (!item) {
      return registryNotFound(reply, "workItem", { projectId: params.projectId, itemId: params.itemId });
    }

    return buildPitsWorkItemActionRequests(registry, project, item);
  });

  app.get("/platform/pits/projects/:projectId/work-items/:itemId/action-requests/:requestId", async (request, reply) => {
    const params = request.params as { projectId: string; itemId: string; requestId: string };
    const { registry, project } = await readProjectDetailById(params.projectId);

    if (!project) {
      return registryNotFound(reply, "project", { id: params.projectId });
    }

    const item = createPitsWorkItems(project).find((workItem) => workItem.id === params.itemId);

    if (!item) {
      return registryNotFound(reply, "workItem", { projectId: params.projectId, itemId: params.itemId });
    }

    const actionRequests = buildPitsWorkItemActionRequests(registry, project, item);
    const requestRecord = actionRequests.requests.find((actionRequest) => actionRequest.requestId === params.requestId);

    if (!requestRecord) {
      return registryNotFound(reply, "actionRequest", { projectId: params.projectId, itemId: params.itemId, requestId: params.requestId });
    }

    return {
      ...actionRequests,
      request: requestRecord
    };
  });

  app.get("/platform/pits/projects/:projectId/work-items/:itemId/action-request-preview", async (request, reply) => {
    const params = request.params as { projectId: string; itemId: string };
    const query = request.query as { actionType?: string; proposedValue?: string };
    const { registry, project } = await readProjectDetailById(params.projectId);

    if (!project) {
      return registryNotFound(reply, "project", { id: params.projectId });
    }

    const item = createPitsWorkItems(project).find((workItem) => workItem.id === params.itemId);

    if (!item) {
      return registryNotFound(reply, "workItem", { projectId: params.projectId, itemId: params.itemId });
    }

    if (query.actionType && !isPitsDryRunActionType(query.actionType)) {
      return reply.code(400).send({
        metadata: registry.metadata,
        error: {
          code: "INVALID_ACTION_REQUEST_ACTION",
          message: "Unknown action request action type",
          allowedActionTypes: pitsDryRunActionTypes
        }
      });
    }

    const requestedActionType = isPitsDryRunActionType(query.actionType) ? query.actionType : undefined;

    return buildPitsWorkItemActionRequestPreview(registry, project, item, requestedActionType, query.proposedValue);
  });

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

  registerStage2FRoutes(app, prisma as unknown as Stage2FPrisma, registryMetadata);
  registerStage2GRoutes(app, prisma as unknown as Stage2GPrisma, registryMetadata);
  registerStage2HRoutes(app, registryMetadata);
  registerStage2JRoutes(app, prisma as unknown as Stage2JPrisma, registryMetadata);
  registerStage2KRoutes(app, prisma as unknown as Stage2KPrisma, registryMetadata);

  app.addHook("onClose", async () => {
    await prisma.$disconnect();
  });

  app.register(swaggerUi, { routePrefix: "/docs" });

  return app;
}
