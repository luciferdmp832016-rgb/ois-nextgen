export const demoBannerText = "DEMO DATA - NOT PRODUCTION";

export { ModernProductShell, type ProductShellNavItem, type ProductShellProps } from "./product-shell";

export const defaultCoreApiUrl = "https://ois-nextgen.abacusai.cloud";
export const defaultOisPublicBaseUrl = "https://ois-ng.dmp247.com";
export const defaultPitsPublicBaseUrl = "https://pits-ng.dmp247.com";

export const kernelFields = [
  "industries",
  "organizations",
  "workspaces",
  "projects",
  "products",
  "installations",
  "modules",
  "auditRecords"
] as const;

export type KernelField = (typeof kernelFields)[number];

export type ApiResult = {
  ok: boolean;
  status: number | null;
  data: unknown;
  error: string | null;
};

export type PlatformSnapshot = {
  coreApiUrl: string;
  health: ApiResult;
  overview: ApiResult;
  healthStatus: string;
  healthService: string;
  healthStage: string;
  overviewBanner: string;
  counts: Record<KernelField, number | null>;
  platformKernelStatus: string;
};

export type RegistryMetadata = {
  source: string;
  mode: string;
  environment: string;
  generatedAt: string;
};

export type RegistryRelationship = {
  id?: string;
  code: string;
  name: string;
};

export type RegistryLifecycle = {
  id: string;
  lifecycle: string;
  version: number;
};

export type ProductRegistryItem = RegistryLifecycle & {
  code: string;
  name: string;
  modules: ModuleRegistryItem[];
  installations: ProductInstallationRegistryItem[];
};

export type ProductRegistryDetail = ProductRegistryItem & {
  relationships?: {
    modules: ModuleRegistryItem[];
    installations: ProductInstallationRegistryItem[];
    projects: ProjectRegistryItem[];
    workspaces: WorkspaceRegistryItem[];
  };
};

export type OrganizationRegistryItem = RegistryLifecycle & {
  code: string;
  name: string;
  industry: RegistryRelationship;
};

export type WorkspaceRegistryItem = RegistryLifecycle & {
  code: string;
  name: string;
  organizationId: string;
  organization: RegistryRelationship;
  projects: ProjectRegistryItem[];
  installations: Array<{
    id: string;
    productCode: string;
    projectId: string;
    lifecycle: string;
  }>;
};

export type WorkspaceRegistryDetail = WorkspaceRegistryItem & {
  relationships?: {
    organization: RegistryRelationship;
    projects: ProjectRegistryItem[];
    products: ProductRegistryItem[];
    modules: ModuleRegistryItem[];
    installations: WorkspaceRegistryItem["installations"];
  };
};

export type ProjectRegistryItem = RegistryLifecycle & {
  code: string;
  name: string;
  workspaceId: string;
  workspace?: RegistryRelationship;
  organization?: RegistryRelationship;
  installations: Array<{
    id: string;
    productId?: string;
    productCode: string;
    productName: string;
    lifecycle: string;
    version: number;
  }>;
};

export type ProjectRegistryDetail = ProjectRegistryItem & {
  relationships?: {
    workspace?: RegistryRelationship;
    organization?: RegistryRelationship;
    products: ProductRegistryItem[];
    modules: ModuleRegistryItem[];
    installations: ProjectRegistryItem["installations"];
  };
};

export type ModuleRegistryItem = RegistryLifecycle & {
  code: string;
  productCode: string;
  layerCode: string;
  scope: string;
  realmCode: string;
  moduleType: string;
  product?: RegistryRelationship;
};

export type ModuleRegistryDetail = ModuleRegistryItem & {
  relationships?: {
    product: ProductRegistryItem | null;
    installations: ProductInstallationRegistryItem[];
  };
};

export type ProductInstallationRegistryItem = RegistryLifecycle & {
  productCode: string;
  productId: string;
  organizationId: string;
  workspaceId: string;
  projectId: string;
  product: Omit<RegistryRelationship, "id"> | null;
  organization: Omit<RegistryRelationship, "id"> | null;
  workspace: Omit<RegistryRelationship, "id"> | null;
  project: Omit<RegistryRelationship, "id"> | null;
};

export type ProductInstallationRegistryDetail = ProductInstallationRegistryItem & {
  relationships?: {
    product: ProductRegistryItem | null;
    project: ProjectRegistryItem | null;
    workspace: WorkspaceRegistryItem | null;
    modules: ModuleRegistryItem[];
  };
};

export type RegistryHealthStatus =
  | "Healthy"
  | "Configured"
  | "Linked"
  | "Reachable"
  | "Missing URL"
  | "Not applicable"
  | "Degraded"
  | "Unavailable";

export type RegistryHealthCheck = {
  label: string;
  status: RegistryHealthStatus;
  ok: boolean;
  required: boolean;
  detail: string;
  url: string | null;
};

export type RegistryHealthItem = {
  kind: "product" | "workspace" | "project" | "module" | "installation";
  id: string;
  code: string;
  name: string;
  lifecycle: string;
  status: "Healthy" | "Degraded" | "Unavailable";
  badges: RegistryHealthStatus[];
  checks: RegistryHealthCheck[];
  links: Record<string, string | null>;
};

export type RegistryHealthPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    reachabilityMode: string;
    note: string;
  };
  summary: {
    status: "Healthy" | "Degraded";
    total: number;
    healthy: number;
    degraded: number;
    unavailable: number;
    missingUrl: number;
  };
  entities: {
    products: RegistryHealthItem[];
    workspaces: RegistryHealthItem[];
    projects: RegistryHealthItem[];
    modules: RegistryHealthItem[];
    installations: RegistryHealthItem[];
  };
};

export type RegistryReadinessStatus = "READY" | "INCOMPLETE" | "BLOCKED" | "NOT_APPLICABLE" | "UNKNOWN";

export type RegistryReadinessCheck = {
  dimension: string;
  label: string;
  status: RegistryReadinessStatus;
  ok: boolean;
  required: boolean;
  reason: string;
  ownerAction: string | null;
  evidenceUrl: string | null;
};

export type RegistryReadinessItem = {
  kind: "product" | "workspace" | "project" | "module" | "installation";
  id: string;
  code: string;
  name: string;
  lifecycle: string;
  status: RegistryReadinessStatus;
  badges: RegistryReadinessStatus[];
  checks: RegistryReadinessCheck[];
  missing: string[];
  blockedReasons: string[];
  ownerActions: string[];
  links: Record<string, string | null>;
};

export type RegistryReadinessPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    readinessMode: string;
    note: string;
  };
  summary: {
    status: RegistryReadinessStatus;
    total: number;
    ready: number;
    incomplete: number;
    blocked: number;
    notApplicable: number;
    unknown: number;
  };
  entities: {
    products: RegistryReadinessItem[];
    workspaces: RegistryReadinessItem[];
    projects: RegistryReadinessItem[];
    modules: RegistryReadinessItem[];
    installations: RegistryReadinessItem[];
  };
};

export type OwnerReviewSeverity = "INFO" | "REVIEW" | "WARNING" | "BLOCKED";

export type OwnerActionPermission =
  | "READ_ONLY_PREVIEW"
  | "OWNER_REVIEW_REQUIRED"
  | "FUTURE_ADMIN_ACTION"
  | "BLOCKED_UNTIL_AUDIT"
  | "NOT_ALLOWED_IN_STAGE_1I";

export type OwnerReviewItem = {
  id: string;
  title: string;
  entityType: RegistryHealthItem["kind"];
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

export type OwnerReviewPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    reviewMode: string;
    stage: string;
    note: string;
  };
  actionBoundary: {
    stage: string;
    enabledAdminActions: number;
    mutationEndpointsAdded: boolean;
    writePermission: OwnerActionPermission;
    markers: string[];
  };
  summary: {
    total: number;
    info: number;
    review: number;
    warning: number;
    blocked: number;
    readOnlyPreview: number;
    ownerReviewRequired: number;
    futureAdminAction: number;
    blockedUntilAudit: number;
    notAllowedInStage1I: number;
  };
  items: OwnerReviewItem[];
};

export type AdminBoundaryRole = "OWNER" | "ADMIN" | "OPERATOR" | "VIEWER" | "SYSTEM";

export type AdminActionCategory =
  | "REGISTRY_LINK_FIX"
  | "RUNTIME_URL_UPDATE"
  | "INSTALLATION_STATUS_UPDATE"
  | "MODULE_BINDING_UPDATE"
  | "CROSS_PRODUCT_LINK_UPDATE"
  | "DEPLOYMENT_RUNTIME_SYNC"
  | "OWNER_REVIEW_RESOLVE";

export type AdminPermissionState =
  | "ALLOWED_READ_ONLY"
  | "PREVIEW_ONLY"
  | "REQUIRES_OWNER_CONFIRMATION"
  | "REQUIRES_ADMIN_PERMISSION"
  | "REQUIRES_AUDIT_TRAIL"
  | "REQUIRES_ROLLBACK_PLAN"
  | "BLOCKED_IN_CURRENT_STAGE";

export type AdminBoundaryAction = {
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
  entityType: OwnerReviewItem["entityType"] | "platform";
  entityId: string | null;
  entityName: string | null;
};

export type AdminBoundaryPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    boundaryMode: string;
    stage: string;
    note: string;
  };
  adminBoundary: {
    stage: string;
    enabledAdminActions: number;
    mutationEndpointsAdded: boolean;
    writePermission: AdminPermissionState;
    markers: string[];
  };
  summary: {
    roles: number;
    permissionStates: number;
    actionCategories: number;
    safetyGates: number;
    futureAdminActions: number;
    previewOnlyActions: number;
    blockedActions: number;
    auditRequired: number;
    confirmationRequired: number;
    rollbackRequired: number;
  };
  roles: Array<{ code: AdminBoundaryRole; label: string; description: string; currentStageCapabilities: string[] }>;
  permissions: Array<{ state: AdminPermissionState; label: string; description: string }>;
  actionCategories: Array<{ code: AdminActionCategory; label: string; description: string; requiredRole: AdminBoundaryRole }>;
  safetyGates: Array<{ code: string; label: string; required: boolean; description: string }>;
  auditRequirements: Array<{ code: string; label: string; required: boolean; detail: string }>;
  confirmationRequirements: Array<{ code: string; label: string; required: boolean; detail: string }>;
  rollbackRequirements: Array<{ code: string; label: string; required: boolean; detail: string }>;
  blockedActions: AdminBoundaryAction[];
  previewOnlyActions: AdminBoundaryAction[];
  futureAdminActions: AdminBoundaryAction[];
};

export type ProductUatCategory =
  | "AVAILABLE_FOR_BROWSER_UAT"
  | "PLATFORM_CONTROL_PLANE_ONLY"
  | "PLACEHOLDER_OR_SHELL_ONLY"
  | "FUTURE_PRODUCT_FUNCTION"
  | "BLOCKED_BY_MISSING_DATA_MODEL"
  | "BLOCKED_BY_WRITE_BOUNDARY"
  | "BLOCKED_BY_AUTH_OR_PERMISSION"
  | "NEEDS_OWNER_DECISION";

export type ProductUatSurface = {
  id: string;
  productCode: string;
  productName: string;
  surfaceName: string;
  route: string | null;
  entityType: OwnerReviewItem["entityType"] | "platform";
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

export type ProductUatProduct = {
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

export type ProductUatPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    uatMode: string;
    stage: string;
    note: string;
  };
  productUat: {
    stage: string;
    mutationEndpointsAdded: boolean;
    writePermission: string;
    markers: string[];
  };
  summary: {
    products: number;
    surfaces: number;
    visiblePages: number;
    testableNow: number;
    realProductFunctionsAvailable: number;
    controlPlaneOnly: number;
    placeholderOrShellOnly: number;
    futureProductFunctions: number;
    blockedByMissingDataModel: number;
    blockedByWriteBoundary: number;
    blockedByAuthOrPermission: number;
    needsOwnerDecision: number;
  };
  categories: Array<{ category: ProductUatCategory; label: string; description: string }>;
  products: ProductUatProduct[];
  recommendedNextProductJourneys: string[];
};

export type PitsWorkItemStatus = "OPEN" | "IN_PROGRESS" | "BLOCKED" | "DONE";
export type PitsWorkItemPriority = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type PitsWorkItemType = "TASK" | "ISSUE" | "RISK" | "DECISION" | "FOLLOW_UP";

export type PitsWorkItem = {
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

export type PitsDryRunActionType = "CHANGE_STATUS" | "ASSIGN_OWNER" | "ADD_NOTE" | "SET_PRIORITY" | "RESOLVE_BLOCKER";

export type PitsDryRunActionPreview = {
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

export type PitsWorkItemDetail = PitsWorkItem & {
  description: string;
  readOnlyNotice: string;
  relatedEntities: Array<{ type: string; id: string; name: string }>;
  availableDryRunActions: Array<{
    actionType: PitsDryRunActionType;
    label: string;
    currentValue: string;
    proposedValue: string;
    previewRoute: string;
  }>;
};

export type PitsWorkboardPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    workboardMode: string;
    stage: string;
    note: string;
  };
  workboard: {
    projectId: string;
    projectCode: string;
    projectName: string;
    source: string;
    stage: string;
    readOnly: boolean;
    markers: string[];
  };
  summary: {
    totalItems: number;
    openCount: number;
    inProgressCount: number;
    blockedCount: number;
    doneCount: number;
    highPriorityCount: number;
    overdueCount: number;
    nextRecommendedAction: string;
    currentLimitations: string[];
  };
  statusGroups: Array<{ status: PitsWorkItemStatus; label: string; items: PitsWorkItem[] }>;
  items: PitsWorkItem[];
  readOnlyBoundary: {
    editingEnabled: boolean;
    mutationEndpointsAdded: boolean;
    writePermission: string;
    notice: string;
    disabledActions: string[];
    futureWriteBoundary: string;
  };
};

export type PitsProjectWorkboardSnapshot = {
  coreApiUrl: string;
  workboard: ApiResult;
  payload: PitsWorkboardPayload | null;
  notFound: boolean;
  errorMessage: string | null;
};

export type PitsWorkItemDetailPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    workItemDetailMode: string;
    stage: string;
    note: string;
  };
  workItemDetail: {
    projectId: string;
    projectCode: string;
    projectName: string;
    itemId: string;
    readOnly: boolean;
    dryRunOnly: boolean;
    markers: string[];
  };
  item: PitsWorkItemDetail;
  dryRunPreviews: PitsDryRunActionPreview[];
  readOnlyBoundary: {
    mutationEndpointsAdded: boolean;
    writePermission: string;
    notice: string;
    disabledActions: string[];
    futureWriteBoundary: string;
  };
};

export type PitsWorkItemActionPreviewPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    dryRunMode: "DRY_RUN_ONLY";
    stage: string;
    note: string;
  };
  actionPreview: {
    projectId: string;
    projectCode: string;
    projectName: string;
    itemId: string;
    requestedActionType: PitsDryRunActionType | null;
    allowedInCurrentStage: false;
    noDataChanged: true;
    markers: string[];
  };
  previews: PitsDryRunActionPreview[];
  preview: PitsDryRunActionPreview | null;
  noDataChanged: true;
};

export type PitsWorkItemDetailSnapshot = {
  coreApiUrl: string;
  detail: ApiResult;
  payload: PitsWorkItemDetailPayload | null;
  notFound: boolean;
  errorMessage: string | null;
};

export type PitsWorkItemActionPreviewSnapshot = {
  coreApiUrl: string;
  actionPreview: ApiResult;
  payload: PitsWorkItemActionPreviewPayload | null;
  notFound: boolean;
  errorMessage: string | null;
};

export type PlatformRegistrySnapshot = PlatformSnapshot & {
  registry: ApiResult;
  registryHealth: ApiResult;
  registryReadiness: ApiResult;
  ownerReview: ApiResult;
  adminBoundary: ApiResult;
  productUat: ApiResult;
  registryMetadata: RegistryMetadata | null;
  registryHealthPayload: RegistryHealthPayload | null;
  registryReadinessPayload: RegistryReadinessPayload | null;
  ownerReviewPayload: OwnerReviewPayload | null;
  adminBoundaryPayload: AdminBoundaryPayload | null;
  productUatPayload: ProductUatPayload | null;
  registryHealthEntities: RegistryHealthPayload["entities"];
  registryReadinessEntities: RegistryReadinessPayload["entities"];
  products: ProductRegistryItem[];
  organizations: OrganizationRegistryItem[];
  workspaces: WorkspaceRegistryItem[];
  projects: ProjectRegistryItem[];
  modules: ModuleRegistryItem[];
  installations: ProductInstallationRegistryItem[];
};

export type RegistryDetailSnapshot<T> = {
  coreApiUrl: string;
  detail: ApiResult;
  metadata: RegistryMetadata | null;
  item: T | null;
  notFound: boolean;
  errorMessage: string | null;
};

export type PublicBaseUrls = {
  ois: string;
  pits: string;
};

export type CrossProductLinkTargets = {
  oisProduct: string | null;
  oisWorkspace: string | null;
  oisModule: string | null;
  oisInstallation: string | null;
  pitsProject: string | null;
};

export function getCoreApiUrl() {
  const configured = process.env.CORE_API_URL ?? process.env.NEXT_PUBLIC_CORE_API_URL ?? defaultCoreApiUrl;
  return configured.replace(/\/+$/, "");
}

function normalizeBaseUrl(value: string) {
  return value.replace(/\/+$/, "");
}

export function getPublicBaseUrls(): PublicBaseUrls {
  return {
    ois: normalizeBaseUrl(process.env.OIS_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_OIS_PUBLIC_BASE_URL ?? defaultOisPublicBaseUrl),
    pits: normalizeBaseUrl(
      process.env.PITS_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_PITS_PUBLIC_BASE_URL ?? defaultPitsPublicBaseUrl
    )
  };
}

export function buildPublicUrl(baseUrl: string, path: string) {
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;
  return `${normalizedBase}${normalizedPath}`;
}

export function buildOisDetailUrl(kind: "products" | "workspaces" | "modules" | "installations", id: string, baseUrl = getPublicBaseUrls().ois) {
  return buildPublicUrl(baseUrl, `/${kind}/${encodeURIComponent(id)}`);
}

export function buildPitsProjectUrl(id: string, baseUrl = getPublicBaseUrls().pits) {
  return buildPublicUrl(baseUrl, `/projects/${encodeURIComponent(id)}`);
}

export function buildCrossProductLinkTargets(
  ids: {
    productId?: string | null | undefined;
    workspaceId?: string | null | undefined;
    moduleId?: string | null | undefined;
    installationId?: string | null | undefined;
    projectId?: string | null | undefined;
  },
  baseUrls = getPublicBaseUrls()
): CrossProductLinkTargets {
  return {
    oisProduct: ids.productId ? buildOisDetailUrl("products", ids.productId, baseUrls.ois) : null,
    oisWorkspace: ids.workspaceId ? buildOisDetailUrl("workspaces", ids.workspaceId, baseUrls.ois) : null,
    oisModule: ids.moduleId ? buildOisDetailUrl("modules", ids.moduleId, baseUrls.ois) : null,
    oisInstallation: ids.installationId ? buildOisDetailUrl("installations", ids.installationId, baseUrls.ois) : null,
    pitsProject: ids.projectId ? buildPitsProjectUrl(ids.projectId, baseUrls.pits) : null
  };
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

export function getString(source: unknown, key: string) {
  if (!isRecord(source)) {
    return null;
  }

  const value = source[key];
  return typeof value === "string" ? value : null;
}

export function getKernelCount(source: unknown, key: KernelField) {
  if (!isRecord(source)) {
    return null;
  }

  const kernel = source.kernel;
  if (!isRecord(kernel)) {
    return null;
  }

  const value = kernel[key];
  return typeof value === "number" ? value : null;
}

export function getPhaseGate(source: unknown, key: string) {
  if (!isRecord(source)) {
    return null;
  }

  const phaseGates = source.phaseGates;
  if (!isRecord(phaseGates)) {
    return null;
  }

  const value = phaseGates[key];
  return typeof value === "string" ? value : null;
}

function getArray<T>(source: unknown, key: string): T[] {
  if (!isRecord(source)) {
    return [];
  }

  const value = source[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

function emptyRegistryHealthEntities(): RegistryHealthPayload["entities"] {
  return {
    products: [],
    workspaces: [],
    projects: [],
    modules: [],
    installations: []
  };
}

function emptyRegistryReadinessEntities(): RegistryReadinessPayload["entities"] {
  return {
    products: [],
    workspaces: [],
    projects: [],
    modules: [],
    installations: []
  };
}

export function getRegistryMetadata(source: unknown): RegistryMetadata | null {
  if (!isRecord(source) || !isRecord(source.metadata)) {
    return null;
  }

  const metadata = source.metadata;
  const sourceName = getString(metadata, "source");
  const mode = getString(metadata, "mode");
  const environment = getString(metadata, "environment");
  const generatedAt = getString(metadata, "generatedAt");

  if (!sourceName || !mode || !environment || !generatedAt) {
    return null;
  }

  return {
    source: sourceName,
    mode,
    environment,
    generatedAt
  };
}

export function getRegistryHealthPayload(source: unknown): RegistryHealthPayload | null {
  if (!isRecord(source) || !isRecord(source.summary) || !isRecord(source.entities)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);
  const runtime = isRecord(source.runtime) ? source.runtime : null;

  if (!metadata || !runtime) {
    return null;
  }

  return {
    metadata,
    runtime: runtime as RegistryHealthPayload["runtime"],
    summary: source.summary as RegistryHealthPayload["summary"],
    entities: {
      products: getArray<RegistryHealthItem>(source.entities, "products"),
      workspaces: getArray<RegistryHealthItem>(source.entities, "workspaces"),
      projects: getArray<RegistryHealthItem>(source.entities, "projects"),
      modules: getArray<RegistryHealthItem>(source.entities, "modules"),
      installations: getArray<RegistryHealthItem>(source.entities, "installations")
    }
  };
}

export function getRegistryReadinessPayload(source: unknown): RegistryReadinessPayload | null {
  if (!isRecord(source) || !isRecord(source.summary) || !isRecord(source.entities)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);
  const runtime = isRecord(source.runtime) ? source.runtime : null;

  if (!metadata || !runtime) {
    return null;
  }

  return {
    metadata,
    runtime: runtime as RegistryReadinessPayload["runtime"],
    summary: source.summary as RegistryReadinessPayload["summary"],
    entities: {
      products: getArray<RegistryReadinessItem>(source.entities, "products"),
      workspaces: getArray<RegistryReadinessItem>(source.entities, "workspaces"),
      projects: getArray<RegistryReadinessItem>(source.entities, "projects"),
      modules: getArray<RegistryReadinessItem>(source.entities, "modules"),
      installations: getArray<RegistryReadinessItem>(source.entities, "installations")
    }
  };
}

export function getOwnerReviewPayload(source: unknown): OwnerReviewPayload | null {
  if (!isRecord(source) || !isRecord(source.summary) || !Array.isArray(source.items) || !isRecord(source.actionBoundary)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);
  const runtime = isRecord(source.runtime) ? source.runtime : null;

  if (!metadata || !runtime) {
    return null;
  }

  return {
    metadata,
    runtime: runtime as OwnerReviewPayload["runtime"],
    actionBoundary: source.actionBoundary as OwnerReviewPayload["actionBoundary"],
    summary: source.summary as OwnerReviewPayload["summary"],
    items: source.items as OwnerReviewItem[]
  };
}

export function getAdminBoundaryPayload(source: unknown): AdminBoundaryPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.summary) ||
    !isRecord(source.adminBoundary) ||
    !Array.isArray(source.roles) ||
    !Array.isArray(source.permissions) ||
    !Array.isArray(source.futureAdminActions)
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);
  const runtime = isRecord(source.runtime) ? source.runtime : null;

  if (!metadata || !runtime) {
    return null;
  }

  return {
    metadata,
    runtime: runtime as AdminBoundaryPayload["runtime"],
    adminBoundary: source.adminBoundary as AdminBoundaryPayload["adminBoundary"],
    summary: source.summary as AdminBoundaryPayload["summary"],
    roles: source.roles as AdminBoundaryPayload["roles"],
    permissions: source.permissions as AdminBoundaryPayload["permissions"],
    actionCategories: getArray<AdminBoundaryPayload["actionCategories"][number]>(source, "actionCategories"),
    safetyGates: getArray<AdminBoundaryPayload["safetyGates"][number]>(source, "safetyGates"),
    auditRequirements: getArray<AdminBoundaryPayload["auditRequirements"][number]>(source, "auditRequirements"),
    confirmationRequirements: getArray<AdminBoundaryPayload["confirmationRequirements"][number]>(source, "confirmationRequirements"),
    rollbackRequirements: getArray<AdminBoundaryPayload["rollbackRequirements"][number]>(source, "rollbackRequirements"),
    blockedActions: getArray<AdminBoundaryAction>(source, "blockedActions"),
    previewOnlyActions: getArray<AdminBoundaryAction>(source, "previewOnlyActions"),
    futureAdminActions: source.futureAdminActions as AdminBoundaryAction[]
  };
}

export function getProductUatPayload(source: unknown): ProductUatPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.summary) ||
    !isRecord(source.productUat) ||
    !Array.isArray(source.categories) ||
    !Array.isArray(source.products) ||
    !Array.isArray(source.recommendedNextProductJourneys)
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);
  const runtime = isRecord(source.runtime) ? source.runtime : null;

  if (!metadata || !runtime) {
    return null;
  }

  return {
    metadata,
    runtime: runtime as ProductUatPayload["runtime"],
    productUat: source.productUat as ProductUatPayload["productUat"],
    summary: source.summary as ProductUatPayload["summary"],
    categories: source.categories as ProductUatPayload["categories"],
    products: source.products as ProductUatProduct[],
    recommendedNextProductJourneys: source.recommendedNextProductJourneys as string[]
  };
}

export function getPitsWorkboardPayload(source: unknown): PitsWorkboardPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.runtime) ||
    !isRecord(source.workboard) ||
    !isRecord(source.summary) ||
    !Array.isArray(source.statusGroups) ||
    !Array.isArray(source.items) ||
    !isRecord(source.readOnlyBoundary)
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    runtime: source.runtime as PitsWorkboardPayload["runtime"],
    workboard: source.workboard as PitsWorkboardPayload["workboard"],
    summary: source.summary as PitsWorkboardPayload["summary"],
    statusGroups: source.statusGroups as PitsWorkboardPayload["statusGroups"],
    items: source.items as PitsWorkItem[],
    readOnlyBoundary: source.readOnlyBoundary as PitsWorkboardPayload["readOnlyBoundary"]
  };
}

export function getPitsWorkItemDetailPayload(source: unknown): PitsWorkItemDetailPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.runtime) ||
    !isRecord(source.workItemDetail) ||
    !isRecord(source.item) ||
    !Array.isArray(source.dryRunPreviews) ||
    !isRecord(source.readOnlyBoundary)
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    runtime: source.runtime as PitsWorkItemDetailPayload["runtime"],
    workItemDetail: source.workItemDetail as PitsWorkItemDetailPayload["workItemDetail"],
    item: source.item as PitsWorkItemDetail,
    dryRunPreviews: source.dryRunPreviews as PitsDryRunActionPreview[],
    readOnlyBoundary: source.readOnlyBoundary as PitsWorkItemDetailPayload["readOnlyBoundary"]
  };
}

export function getPitsWorkItemActionPreviewPayload(source: unknown): PitsWorkItemActionPreviewPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.runtime) ||
    !isRecord(source.actionPreview) ||
    !Array.isArray(source.previews) ||
    typeof source.noDataChanged !== "boolean"
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    runtime: source.runtime as PitsWorkItemActionPreviewPayload["runtime"],
    actionPreview: source.actionPreview as PitsWorkItemActionPreviewPayload["actionPreview"],
    previews: source.previews as PitsDryRunActionPreview[],
    preview: isRecord(source.preview) ? (source.preview as PitsDryRunActionPreview) : null,
    noDataChanged: source.noDataChanged as true
  };
}

function getRegistryErrorMessage(source: unknown) {
  if (!isRecord(source) || !isRecord(source.error)) {
    return null;
  }

  return getString(source.error, "message");
}

function getObject<T>(source: unknown, key: string): T | null {
  if (!isRecord(source)) {
    return null;
  }

  const value = source[key];
  return isRecord(value) ? (value as T) : null;
}

export async function fetchCoreApi(path: string, coreApiUrl: string): Promise<ApiResult> {
  try {
    const response = await fetch(`${coreApiUrl}${path}`, { cache: "no-store" });
    const body = await response.text();
    let data: unknown = null;

    if (body.trim().length > 0) {
      try {
        data = JSON.parse(body) as unknown;
      } catch {
        data = null;
      }
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      error: response.ok ? null : `HTTP ${response.status}`
    };
  } catch (error) {
    return {
      ok: false,
      status: null,
      data: null,
      error: error instanceof Error ? error.message : "Core API request failed"
    };
  }
}

function createPlatformSnapshot(coreApiUrl: string, health: ApiResult, overview: ApiResult): PlatformSnapshot {
  const counts = Object.fromEntries(kernelFields.map((field) => [field, getKernelCount(overview.data, field)])) as Record<
    KernelField,
    number | null
  >;

  return {
    coreApiUrl,
    health,
    overview,
    healthStatus: getString(health.data, "status") ?? "unavailable",
    healthService: getString(health.data, "service") ?? "unknown",
    healthStage: getString(health.data, "stage") ?? "unknown",
    overviewBanner: getString(overview.data, "banner") ?? demoBannerText,
    counts,
    platformKernelStatus: getPhaseGate(overview.data, "PLATFORM_KERNEL") ?? "UNKNOWN"
  };
}

export async function getPlatformSnapshot(): Promise<PlatformSnapshot> {
  const coreApiUrl = getCoreApiUrl();
  const [health, overview] = await Promise.all([
    fetchCoreApi("/health", coreApiUrl),
    fetchCoreApi("/platform/overview", coreApiUrl)
  ]);

  return createPlatformSnapshot(coreApiUrl, health, overview);
}

export async function getPlatformRegistrySnapshot(): Promise<PlatformRegistrySnapshot> {
  const coreApiUrl = getCoreApiUrl();
  const [health, overview, registry, registryHealth, registryReadiness, ownerReview, adminBoundary, productUat] = await Promise.all([
    fetchCoreApi("/health", coreApiUrl),
    fetchCoreApi("/platform/overview", coreApiUrl),
    fetchCoreApi("/platform/registry", coreApiUrl),
    fetchCoreApi("/platform/registry/health", coreApiUrl),
    fetchCoreApi("/platform/registry/readiness", coreApiUrl),
    fetchCoreApi("/platform/owner-review", coreApiUrl),
    fetchCoreApi("/platform/admin-boundary", coreApiUrl),
    fetchCoreApi("/platform/product-uat", coreApiUrl)
  ]);
  const platform = createPlatformSnapshot(coreApiUrl, health, overview);
  const registryHealthPayload = getRegistryHealthPayload(registryHealth.data);
  const registryReadinessPayload = getRegistryReadinessPayload(registryReadiness.data);
  const ownerReviewPayload = getOwnerReviewPayload(ownerReview.data);
  const adminBoundaryPayload = getAdminBoundaryPayload(adminBoundary.data);
  const productUatPayload = getProductUatPayload(productUat.data);

  return {
    ...platform,
    registry,
    registryHealth,
    registryReadiness,
    ownerReview,
    adminBoundary,
    productUat,
    registryMetadata: getRegistryMetadata(registry.data),
    registryHealthPayload,
    registryReadinessPayload,
    ownerReviewPayload,
    adminBoundaryPayload,
    productUatPayload,
    registryHealthEntities: registryHealthPayload?.entities ?? emptyRegistryHealthEntities(),
    registryReadinessEntities: registryReadinessPayload?.entities ?? emptyRegistryReadinessEntities(),
    products: getArray<ProductRegistryItem>(registry.data, "products"),
    organizations: getArray<OrganizationRegistryItem>(registry.data, "organizations"),
    workspaces: getArray<WorkspaceRegistryItem>(registry.data, "workspaces"),
    projects: getArray<ProjectRegistryItem>(registry.data, "projects"),
    modules: getArray<ModuleRegistryItem>(registry.data, "modules"),
    installations: getArray<ProductInstallationRegistryItem>(registry.data, "installations")
  };
}

function createRegistryDetailSnapshot<T>(coreApiUrl: string, detail: ApiResult, key: string): RegistryDetailSnapshot<T> {
  return {
    coreApiUrl,
    detail,
    metadata: getRegistryMetadata(detail.data),
    item: getObject<T>(detail.data, key),
    notFound: detail.status === 404,
    errorMessage: getRegistryErrorMessage(detail.data) ?? detail.error
  };
}

export async function getProductRegistryDetail(
  id: string,
  coreApiUrl = getCoreApiUrl()
): Promise<RegistryDetailSnapshot<ProductRegistryDetail>> {
  const detail = await fetchCoreApi(`/platform/products/${encodeURIComponent(id)}`, coreApiUrl);
  return createRegistryDetailSnapshot<ProductRegistryDetail>(coreApiUrl, detail, "product");
}

export async function getProductRegistryDetailByCode(
  code: string,
  coreApiUrl = getCoreApiUrl()
): Promise<RegistryDetailSnapshot<ProductRegistryDetail>> {
  const detail = await fetchCoreApi(`/platform/products/code/${encodeURIComponent(code)}`, coreApiUrl);
  return createRegistryDetailSnapshot<ProductRegistryDetail>(coreApiUrl, detail, "product");
}

export async function getWorkspaceRegistryDetail(
  id: string,
  coreApiUrl = getCoreApiUrl()
): Promise<RegistryDetailSnapshot<WorkspaceRegistryDetail>> {
  const detail = await fetchCoreApi(`/platform/workspaces/${encodeURIComponent(id)}`, coreApiUrl);
  return createRegistryDetailSnapshot<WorkspaceRegistryDetail>(coreApiUrl, detail, "workspace");
}

export async function getProjectRegistryDetail(
  id: string,
  coreApiUrl = getCoreApiUrl()
): Promise<RegistryDetailSnapshot<ProjectRegistryDetail>> {
  const detail = await fetchCoreApi(`/platform/projects/${encodeURIComponent(id)}`, coreApiUrl);
  return createRegistryDetailSnapshot<ProjectRegistryDetail>(coreApiUrl, detail, "project");
}

export async function getPitsProjectWorkboard(id: string, coreApiUrl = getCoreApiUrl()): Promise<PitsProjectWorkboardSnapshot> {
  const workboard = await fetchCoreApi(`/platform/pits/projects/${encodeURIComponent(id)}/workboard`, coreApiUrl);

  return {
    coreApiUrl,
    workboard,
    payload: getPitsWorkboardPayload(workboard.data),
    notFound: workboard.status === 404,
    errorMessage: getRegistryErrorMessage(workboard.data) ?? workboard.error
  };
}

export async function getPitsWorkItemDetail(
  projectId: string,
  itemId: string,
  coreApiUrl = getCoreApiUrl()
): Promise<PitsWorkItemDetailSnapshot> {
  const detail = await fetchCoreApi(
    `/platform/pits/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}`,
    coreApiUrl
  );

  return {
    coreApiUrl,
    detail,
    payload: getPitsWorkItemDetailPayload(detail.data),
    notFound: detail.status === 404,
    errorMessage: getRegistryErrorMessage(detail.data) ?? detail.error
  };
}

export async function getPitsWorkItemActionPreview(
  projectId: string,
  itemId: string,
  coreApiUrl = getCoreApiUrl()
): Promise<PitsWorkItemActionPreviewSnapshot> {
  const actionPreview = await fetchCoreApi(
    `/platform/pits/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/action-preview`,
    coreApiUrl
  );

  return {
    coreApiUrl,
    actionPreview,
    payload: getPitsWorkItemActionPreviewPayload(actionPreview.data),
    notFound: actionPreview.status === 404,
    errorMessage: getRegistryErrorMessage(actionPreview.data) ?? actionPreview.error
  };
}

export async function getModuleRegistryDetail(
  id: string,
  coreApiUrl = getCoreApiUrl()
): Promise<RegistryDetailSnapshot<ModuleRegistryDetail>> {
  const detail = await fetchCoreApi(`/platform/modules/${encodeURIComponent(id)}`, coreApiUrl);
  return createRegistryDetailSnapshot<ModuleRegistryDetail>(coreApiUrl, detail, "module");
}

export async function getInstallationRegistryDetail(
  id: string,
  coreApiUrl = getCoreApiUrl()
): Promise<RegistryDetailSnapshot<ProductInstallationRegistryDetail>> {
  const detail = await fetchCoreApi(`/platform/installations/${encodeURIComponent(id)}`, coreApiUrl);
  return createRegistryDetailSnapshot<ProductInstallationRegistryDetail>(coreApiUrl, detail, "installation");
}

export function findRegistryHealthItem(
  snapshot: PlatformRegistrySnapshot,
  collection: keyof RegistryHealthPayload["entities"],
  id: string
) {
  return snapshot.registryHealthEntities[collection].find((item) => item.id === id) ?? null;
}

export function findRegistryReadinessItem(
  snapshot: PlatformRegistrySnapshot,
  collection: keyof RegistryReadinessPayload["entities"],
  id: string
) {
  return snapshot.registryReadinessEntities[collection].find((item) => item.id === id) ?? null;
}

export const registryEntityCollections = ["products", "workspaces", "projects", "modules", "installations"] as const;

export function getOwnerReadinessLabel(status: RegistryReadinessStatus | null | undefined) {
  const labels: Record<RegistryReadinessStatus, string> = {
    READY: "Ready to operate",
    INCOMPLETE: "Needs owner review",
    BLOCKED: "Blocked",
    NOT_APPLICABLE: "Not applicable",
    UNKNOWN: "Needs owner review"
  };

  return status ? labels[status] : "Needs owner review";
}

export function getOwnerHealthLabel(status: RegistryHealthItem["status"] | RegistryHealthStatus | null | undefined) {
  if (!status) {
    return "Needs owner review";
  }

  if (status === "Healthy" || status === "Configured" || status === "Linked" || status === "Reachable") {
    return "No issue detected";
  }

  if (status === "Not applicable") {
    return "Not applicable";
  }

  if (status === "Missing URL") {
    return "Missing runtime URL";
  }

  return "Needs owner review";
}

export function getReadinessGaps(item: RegistryReadinessItem | null | undefined) {
  return item ? [...item.blockedReasons, ...item.missing] : [];
}

export function getAllRegistryReadinessItems(snapshot: PlatformRegistrySnapshot) {
  return registryEntityCollections.flatMap((collection) => snapshot.registryReadinessEntities[collection]);
}

function readinessCheckText(check: RegistryReadinessCheck) {
  return [check.dimension, check.label, check.reason, check.ownerAction ?? ""].join(" ").toLowerCase();
}

export function getOwnerMissingLinkCount(snapshot: PlatformRegistrySnapshot) {
  const items = getAllRegistryReadinessItems(snapshot);
  const failedLinkChecks = items
    .flatMap((item) => item.checks)
    .filter((check) => !check.ok && readinessCheckText(check).includes("link")).length;
  const missingLinkGaps = items
    .flatMap((item) => [...item.missing, ...item.blockedReasons])
    .filter((gap) => {
      const text = gap.toLowerCase();
      return text.includes("link") || text.includes("linked");
    }).length;

  return failedLinkChecks + missingLinkGaps;
}

export function getOwnerForbiddenLinkIssueCount(snapshot: PlatformRegistrySnapshot) {
  return getAllRegistryReadinessItems(snapshot)
    .flatMap((item) => item.checks)
    .filter((check) => {
      const text = readinessCheckText(check);
      return !check.ok && (text.includes("forbidden") || text.includes("legacy") || text.includes("localhost"));
    }).length;
}

export function getOwnerReviewItemsFor(
  snapshot: PlatformRegistrySnapshot,
  entityType: OwnerReviewItem["entityType"],
  entityId: string
) {
  return snapshot.ownerReviewPayload?.items.filter((item) => item.entityType === entityType && item.entityId === entityId) ?? [];
}

export function getOwnerReviewPreviewItems(snapshot: PlatformRegistrySnapshot, limit = 6) {
  return snapshot.ownerReviewPayload?.items.slice(0, limit) ?? [];
}

export function getAdminBoundaryActionsFor(
  snapshot: PlatformRegistrySnapshot,
  entityType: AdminBoundaryAction["entityType"],
  entityId: string
) {
  return snapshot.adminBoundaryPayload?.futureAdminActions.filter((item) => item.entityType === entityType && item.entityId === entityId) ?? [];
}

export function getAdminBoundaryPreviewActions(snapshot: PlatformRegistrySnapshot, limit = 6) {
  return snapshot.adminBoundaryPayload?.futureAdminActions.slice(0, limit) ?? [];
}

export function getProductUatProduct(snapshot: PlatformRegistrySnapshot, productCode: string) {
  return snapshot.productUatPayload?.products.find((product) => product.productCode === productCode) ?? null;
}

export function getProductUatSurfacesFor(
  snapshot: PlatformRegistrySnapshot,
  productCode: string,
  entityType?: ProductUatSurface["entityType"],
  entityId?: string
) {
  const product = getProductUatProduct(snapshot, productCode);

  if (!product) {
    return [];
  }

  if (!entityType || !entityId) {
    return product.surfaces;
  }

  const entitySurfaces = product.surfaces.filter((surface) => surface.entityType === entityType && surface.entityId === entityId);
  return entitySurfaces.length > 0 ? entitySurfaces : product.surfaces.slice(0, 4);
}

export function getProductUatPreviewSurfaces(snapshot: PlatformRegistrySnapshot, limit = 6) {
  return snapshot.productUatPayload?.products.flatMap((product) => product.surfaces).slice(0, limit) ?? [];
}
