export const demoBannerText = "DEMO DATA - NOT PRODUCTION";

export { ModernProductShell, type ProductShellNavItem, type ProductShellProps } from "./product-shell";
export { OisAgentWidgetShell, type OisAgentWidgetShellProps } from "./ois-agent-widget";
export {
  createTranslator,
  defaultLocale,
  getLocalizationCatalog,
  isSupportedLocale,
  localeDisplayNames,
  localizationManualEditPath,
  localizeDisplayText,
  localizeNavLabel,
  localizeStatusCode,
  normalizeLocale,
  supportedLocales,
  translate,
  translations,
  type LocalizationCatalog,
  type LocalizationNamespaceSummary,
  type Locale,
  type TranslationKey
} from "./localization";
export {
  LanguageSelector,
  LocalizationCatalogPanel,
  LocalizationProvider,
  LocalizedText,
  useLocalization
} from "./localization-context";

export const defaultCoreApiUrl = "https://ois-nextgen.abacusai.cloud";
export const defaultOisPublicBaseUrl = "https://ois-ng.dmp247.com";
export const defaultPitsPublicBaseUrl = "https://pits-ng.dmp247.com";
export const defaultOimaPublicBaseUrl = "https://oima.dmp247.com";

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
    oimaShellBaseUrl?: string;
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
    oimaShellBaseUrl?: string;
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
    oimaShellBaseUrl?: string;
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
    oimaShellBaseUrl?: string;
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
    oimaShellBaseUrl?: string;
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

export type PitsActionRequestStatus = "DRAFT" | "PENDING_REVIEW" | "APPROVED_PREVIEW" | "REJECTED_PREVIEW" | "BLOCKED_BY_SAFETY_GATE";

export type PitsWorkItemActionRequest = {
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
    oimaShellBaseUrl?: string;
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
    oimaShellBaseUrl?: string;
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
    oimaShellBaseUrl?: string;
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

export type PitsWorkItemActionRequestsPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    oimaShellBaseUrl?: string;
    actionRequestMode: string;
    stage: string;
    note: string;
  };
  actionRequestList: {
    projectId: string;
    projectCode: string;
    projectName: string;
    workItemId: string;
    supportedActions: PitsDryRunActionType[];
    actionRequestOnly: true;
    noDirectMutation: true;
    markers: string[];
  };
  requests: PitsWorkItemActionRequest[];
  request: PitsWorkItemActionRequest | null;
  readOnlyBoundary: {
    mutationEndpointsAdded: boolean;
    writePermission: string;
    notice: string;
    disabledActions: string[];
    futureWriteBoundary: string;
  };
  noDirectMutation: true;
};

export type PitsWorkItemActionRequestPreviewPayload = {
  metadata: RegistryMetadata;
  runtime: {
    coreApiBaseUrl: string;
    oisConsoleBaseUrl: string;
    pitsShellBaseUrl: string;
    oimaShellBaseUrl?: string;
    actionRequestPreviewMode: string;
    stage: string;
    note: string;
  };
  actionRequestPreview: {
    projectId: string;
    projectCode: string;
    projectName: string;
    workItemId: string;
    requestedActionType: PitsDryRunActionType | null;
    actionRequestOnly: true;
    noDirectMutation: true;
    markers: string[];
  };
  requests: PitsWorkItemActionRequest[];
  request: PitsWorkItemActionRequest | null;
  sourceItemUnchanged: {
    itemId: string;
    status: PitsWorkItemStatus;
    priority: PitsWorkItemPriority;
    owner: string;
    blockers: string[];
  };
  noDirectMutation: true;
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

export type PitsWorkItemActionRequestsSnapshot = {
  coreApiUrl: string;
  actionRequests: ApiResult;
  payload: PitsWorkItemActionRequestsPayload | null;
  notFound: boolean;
  errorMessage: string | null;
};

export type PitsWorkItemActionRequestPreviewSnapshot = {
  coreApiUrl: string;
  actionRequestPreview: ApiResult;
  payload: PitsWorkItemActionRequestPreviewPayload | null;
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
  oima: string;
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
    ),
    oima: normalizeBaseUrl(
      process.env.OIMA_PUBLIC_BASE_URL ?? process.env.NEXT_PUBLIC_OIMA_PUBLIC_BASE_URL ?? defaultOimaPublicBaseUrl
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

export function buildOimaAppUrl(path = "/", baseUrl = getPublicBaseUrls().oima) {
  return buildPublicUrl(baseUrl, path);
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

export function getPitsWorkItemActionRequestsPayload(source: unknown): PitsWorkItemActionRequestsPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.runtime) ||
    !isRecord(source.actionRequestList) ||
    !Array.isArray(source.requests) ||
    !isRecord(source.readOnlyBoundary) ||
    typeof source.noDirectMutation !== "boolean"
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    runtime: source.runtime as PitsWorkItemActionRequestsPayload["runtime"],
    actionRequestList: source.actionRequestList as PitsWorkItemActionRequestsPayload["actionRequestList"],
    requests: source.requests as PitsWorkItemActionRequest[],
    request: isRecord(source.request) ? (source.request as PitsWorkItemActionRequest) : null,
    readOnlyBoundary: source.readOnlyBoundary as PitsWorkItemActionRequestsPayload["readOnlyBoundary"],
    noDirectMutation: source.noDirectMutation as true
  };
}

export function getPitsWorkItemActionRequestPreviewPayload(source: unknown): PitsWorkItemActionRequestPreviewPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.runtime) ||
    !isRecord(source.actionRequestPreview) ||
    !Array.isArray(source.requests) ||
    !isRecord(source.sourceItemUnchanged) ||
    typeof source.noDirectMutation !== "boolean"
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    runtime: source.runtime as PitsWorkItemActionRequestPreviewPayload["runtime"],
    actionRequestPreview: source.actionRequestPreview as PitsWorkItemActionRequestPreviewPayload["actionRequestPreview"],
    requests: source.requests as PitsWorkItemActionRequest[],
    request: isRecord(source.request) ? (source.request as PitsWorkItemActionRequest) : null,
    sourceItemUnchanged: source.sourceItemUnchanged as PitsWorkItemActionRequestPreviewPayload["sourceItemUnchanged"],
    noDirectMutation: source.noDirectMutation as true
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

export async function getPitsWorkItemActionRequests(
  projectId: string,
  itemId: string,
  coreApiUrl = getCoreApiUrl()
): Promise<PitsWorkItemActionRequestsSnapshot> {
  const actionRequests = await fetchCoreApi(
    `/platform/pits/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/action-requests`,
    coreApiUrl
  );

  return {
    coreApiUrl,
    actionRequests,
    payload: getPitsWorkItemActionRequestsPayload(actionRequests.data),
    notFound: actionRequests.status === 404,
    errorMessage: getRegistryErrorMessage(actionRequests.data) ?? actionRequests.error
  };
}

export async function getPitsWorkItemActionRequestPreview(
  projectId: string,
  itemId: string,
  coreApiUrl = getCoreApiUrl()
): Promise<PitsWorkItemActionRequestPreviewSnapshot> {
  const actionRequestPreview = await fetchCoreApi(
    `/platform/pits/projects/${encodeURIComponent(projectId)}/work-items/${encodeURIComponent(itemId)}/action-request-preview`,
    coreApiUrl
  );

  return {
    coreApiUrl,
    actionRequestPreview,
    payload: getPitsWorkItemActionRequestPreviewPayload(actionRequestPreview.data),
    notFound: actionRequestPreview.status === 404,
    errorMessage: getRegistryErrorMessage(actionRequestPreview.data) ?? actionRequestPreview.error
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

export type LearningCenterProduct = {
  productKey: string;
  displayName: string;
  enabled: boolean;
  defaultLearningScope: string;
};

export type LearningCenterSignal = {
  id: string;
  productKey: string;
  sourceAuthority: string;
  learningScope: string;
  signalType: string;
  normalizedText: string;
  confidenceInitial: number;
  status: string;
  createdAt: string;
};

export type LearningCenterCandidate = {
  id: string;
  signalId: string;
  productKey: string;
  candidateType: string;
  title: string;
  summary: string;
  sourceAuthority: string;
  confidenceScore: number;
  conflictStatus: string;
  policyDecision: string;
  status: string;
  createdAt: string;
};

export type LearningCenterPolicy = {
  id: string;
  productKey: string;
  learningScope: string;
  signalType: string;
  sourceAuthority: string;
  policyMode: string;
  confidenceThreshold: number;
  enabled: boolean;
};

export type LearningCenterPayload = {
  metadata: RegistryMetadata;
  products: LearningCenterProduct[];
  overview: {
    totalSignals: number;
    pendingCandidates: number;
    autoLearnedLogs: number;
    rejectedOrIgnored: number;
    policyCount: number;
  };
  learningStream: LearningCenterSignal[];
  pendingReview: LearningCenterCandidate[];
  learningPolicies: LearningCenterPolicy[];
  executiveIntentQueue: LearningCenterCandidate[];
  productContributionMap: Array<{ productKey: string; signalCount: number; candidateCount: number }>;
  auditLogPlaceholder: { mode: string; note: string };
  accessGuard: { requiredRole: string; currentStageMode: string; limitation: string };
};

export type LearningCenterSnapshot = {
  coreApiUrl: string;
  learningCenter: ApiResult;
  payload: LearningCenterPayload | null;
  errorMessage: string | null;
};

export function getLearningCenterPayload(source: unknown): LearningCenterPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.overview) ||
    !Array.isArray(source.products) ||
    !Array.isArray(source.learningStream) ||
    !Array.isArray(source.pendingReview) ||
    !Array.isArray(source.learningPolicies) ||
    !Array.isArray(source.executiveIntentQueue) ||
    !Array.isArray(source.productContributionMap) ||
    !isRecord(source.auditLogPlaceholder) ||
    !isRecord(source.accessGuard)
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    products: source.products as LearningCenterProduct[],
    overview: source.overview as LearningCenterPayload["overview"],
    learningStream: source.learningStream as LearningCenterSignal[],
    pendingReview: source.pendingReview as LearningCenterCandidate[],
    learningPolicies: source.learningPolicies as LearningCenterPolicy[],
    executiveIntentQueue: source.executiveIntentQueue as LearningCenterCandidate[],
    productContributionMap: source.productContributionMap as LearningCenterPayload["productContributionMap"],
    auditLogPlaceholder: source.auditLogPlaceholder as LearningCenterPayload["auditLogPlaceholder"],
    accessGuard: source.accessGuard as LearningCenterPayload["accessGuard"]
  };
}

export async function getLearningCenterSnapshot(coreApiUrl = getCoreApiUrl()): Promise<LearningCenterSnapshot> {
  const learningCenter = await fetchCoreApi("/platform/learning/center", coreApiUrl);

  return {
    coreApiUrl,
    learningCenter,
    payload: getLearningCenterPayload(learningCenter.data),
    errorMessage: getRegistryErrorMessage(learningCenter.data) ?? learningCenter.error
  };
}

export type KnowledgeLayerDefinition = {
  key: string;
  order: number;
  displayName: string;
  description: string;
  examples: string[];
  evidenceRequirement: string;
  autoPromotionAllowedInStage2G: boolean;
};

export type KnowledgeLayerTaxonomy = {
  taxonomyVersion: string;
  layerKeys: string[];
  availableLayers: KnowledgeLayerDefinition[];
};

export type CanonicalKnowledgeItem = {
  id: string;
  layerKey: string;
  scope: string;
  itemType: string;
  title: string;
  summary: string;
  status: string;
  version: number;
  locale: string;
  organizationId: string | null;
  workspaceId: string | null;
  industryCode: string | null;
  productKey: string | null;
  sensitivityLevel: string;
  confidenceScore: number;
  sourceAuthority: string;
  createdFromCandidateId: string | null;
};

export type KnowledgeEvidenceLink = {
  id: string;
  knowledgeItemId: string | null;
  learningCandidateId: string | null;
  sourceType: string;
  sourceRef: string;
  sourceTitle: string;
  excerpt: string;
  excerptHash: string;
  evidenceWeight: number;
  sourceAuthority: string;
};

export type KnowledgeLayerMapping = {
  id: string;
  learningCandidateId: string;
  targetLayerKey: string;
  targetItemType: string;
  proposedAction: string;
  proposedTitle: string;
  proposedSummary: string;
  affectedProducts: string[];
  confidenceScore: number;
  policyDecision: string;
  status: string;
};

export type KnowledgeProjectionBundle = {
  id: string;
  bundleKey: string;
  displayName: string;
  productKey: string;
  targetAudience: string;
  role: string;
  locale: string;
  includedLayerKeys: string[];
  includedItemIds: string[];
  snapshotVersion: number;
  status: string;
};

export type KnowledgeLayersPayload = {
  metadata: RegistryMetadata;
  boundary: Record<string, unknown>;
  knowledgeLayerTaxonomy?: KnowledgeLayerTaxonomy | undefined;
  availableLayers?: KnowledgeLayerDefinition[] | undefined;
  layerKeys: string[];
  layers: KnowledgeLayerDefinition[];
  productConsumptionMap: Array<{ productKey: string; consumesLayers: string[]; contributesToLayers: string[]; role: string }>;
};

export type KnowledgeItemsPayload = {
  metadata: RegistryMetadata;
  boundary: Record<string, unknown>;
  summary: {
    totalItems: number;
    activeItems: number;
    draftItems: number;
    byLayer: Array<{ layerKey: string; displayName: string; count: number }>;
  };
  items: CanonicalKnowledgeItem[];
};

export type KnowledgeEvidencePayload = {
  metadata: RegistryMetadata;
  boundary: Record<string, unknown>;
  summary: {
    totalLinks: number;
    itemLinks: number;
    candidateLinks: number;
  };
  evidenceLinks: KnowledgeEvidenceLink[];
};

export type KnowledgeLayerMappingsPayload = {
  metadata: RegistryMetadata;
  boundary: Record<string, unknown>;
  knowledgeLayerTaxonomy?: KnowledgeLayerTaxonomy | undefined;
  availableLayers?: KnowledgeLayerDefinition[] | undefined;
  mappingStatusTaxonomy?: string[] | undefined;
  availableStatuses?: string[] | undefined;
  mappings: KnowledgeLayerMapping[];
};

export type KeihbBundlesPayload = {
  metadata: RegistryMetadata;
  boundary: Record<string, unknown>;
  knowledgeLayerTaxonomy?: KnowledgeLayerTaxonomy | undefined;
  availableLayers?: KnowledgeLayerDefinition[] | undefined;
  projectionBoundary: Record<string, unknown>;
  bundles: KnowledgeProjectionBundle[];
};

export type KnowledgeContextPayload = {
  metadata: RegistryMetadata;
  mode: string;
  noLlmCall: boolean;
  noCanonicalWrite: boolean;
  knowledgeLayerTaxonomy?: KnowledgeLayerTaxonomy | undefined;
  availableLayers?: KnowledgeLayerDefinition[] | undefined;
  readContract: Record<string, unknown>;
  layers: KnowledgeLayerDefinition[];
  items: CanonicalKnowledgeItem[];
  evidenceLinks: KnowledgeEvidenceLink[];
  boundary: Record<string, unknown>;
};

export type ArchitectureMindmapPayload = {
  metadata: RegistryMetadata;
  boundary: Record<string, unknown>;
  mindmap: {
    manifestVersion: string;
    stage: string;
    title: string;
    oisCoreLayers: string[];
    ecosystemProducts: string[];
    knowledgeLayers: Array<{ key: string; displayName: string; order: number; evidenceRequirement: string }>;
    flows: Array<{ key: string; label: string; nodes: string[] }>;
    apiContracts: string[];
    governanceCheckpoints: string[];
  };
  source: Record<string, unknown>;
};

export type KnowledgeFabricSnapshot = {
  coreApiUrl: string;
  layers: ApiResult;
  items: ApiResult;
  evidence: ApiResult;
  mappings: ApiResult;
  keihbBundles: ApiResult;
  context: ApiResult;
  mindmap: ApiResult;
  layersPayload: KnowledgeLayersPayload | null;
  itemsPayload: KnowledgeItemsPayload | null;
  evidencePayload: KnowledgeEvidencePayload | null;
  mappingsPayload: KnowledgeLayerMappingsPayload | null;
  keihbBundlesPayload: KeihbBundlesPayload | null;
  contextPayload: KnowledgeContextPayload | null;
  mindmapPayload: ArchitectureMindmapPayload | null;
  errorMessage: string | null;
};

export function getKnowledgeLayersPayload(source: unknown): KnowledgeLayersPayload | null {
  if (!isRecord(source) || !isRecord(source.boundary) || !Array.isArray(source.layerKeys) || !Array.isArray(source.layers)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    boundary: source.boundary,
    knowledgeLayerTaxonomy: isRecord(source.knowledgeLayerTaxonomy) ? (source.knowledgeLayerTaxonomy as KnowledgeLayerTaxonomy) : undefined,
    availableLayers: Array.isArray(source.availableLayers) ? (source.availableLayers as KnowledgeLayerDefinition[]) : undefined,
    layerKeys: source.layerKeys as string[],
    layers: source.layers as KnowledgeLayerDefinition[],
    productConsumptionMap: getArray<KnowledgeLayersPayload["productConsumptionMap"][number]>(source, "productConsumptionMap")
  };
}

export function getKnowledgeItemsPayload(source: unknown): KnowledgeItemsPayload | null {
  if (!isRecord(source) || !isRecord(source.boundary) || !isRecord(source.summary) || !Array.isArray(source.items)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    boundary: source.boundary,
    summary: source.summary as KnowledgeItemsPayload["summary"],
    items: source.items as CanonicalKnowledgeItem[]
  };
}

export function getKnowledgeEvidencePayload(source: unknown): KnowledgeEvidencePayload | null {
  if (!isRecord(source) || !isRecord(source.boundary) || !isRecord(source.summary) || !Array.isArray(source.evidenceLinks)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    boundary: source.boundary,
    summary: source.summary as KnowledgeEvidencePayload["summary"],
    evidenceLinks: source.evidenceLinks as KnowledgeEvidenceLink[]
  };
}

export function getKnowledgeLayerMappingsPayload(source: unknown): KnowledgeLayerMappingsPayload | null {
  if (!isRecord(source) || !isRecord(source.boundary) || !Array.isArray(source.mappings)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    boundary: source.boundary,
    knowledgeLayerTaxonomy: isRecord(source.knowledgeLayerTaxonomy) ? (source.knowledgeLayerTaxonomy as KnowledgeLayerTaxonomy) : undefined,
    availableLayers: Array.isArray(source.availableLayers) ? (source.availableLayers as KnowledgeLayerDefinition[]) : undefined,
    mappingStatusTaxonomy: Array.isArray(source.mappingStatusTaxonomy) ? (source.mappingStatusTaxonomy as string[]) : undefined,
    availableStatuses: Array.isArray(source.availableStatuses) ? (source.availableStatuses as string[]) : undefined,
    mappings: source.mappings as KnowledgeLayerMapping[]
  };
}

export function getKeihbBundlesPayload(source: unknown): KeihbBundlesPayload | null {
  if (!isRecord(source) || !isRecord(source.boundary) || !isRecord(source.projectionBoundary) || !Array.isArray(source.bundles)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    boundary: source.boundary,
    knowledgeLayerTaxonomy: isRecord(source.knowledgeLayerTaxonomy) ? (source.knowledgeLayerTaxonomy as KnowledgeLayerTaxonomy) : undefined,
    availableLayers: Array.isArray(source.availableLayers) ? (source.availableLayers as KnowledgeLayerDefinition[]) : undefined,
    projectionBoundary: source.projectionBoundary,
    bundles: source.bundles as KnowledgeProjectionBundle[]
  };
}

export function getKnowledgeContextPayload(source: unknown): KnowledgeContextPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.boundary) ||
    !isRecord(source.readContract) ||
    !Array.isArray(source.layers) ||
    !Array.isArray(source.items) ||
    !Array.isArray(source.evidenceLinks)
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    mode: getString(source, "mode") ?? "deterministic-knowledge-context",
    noLlmCall: Boolean(source.noLlmCall),
    noCanonicalWrite: Boolean(source.noCanonicalWrite),
    knowledgeLayerTaxonomy: isRecord(source.knowledgeLayerTaxonomy) ? (source.knowledgeLayerTaxonomy as KnowledgeLayerTaxonomy) : undefined,
    availableLayers: Array.isArray(source.availableLayers) ? (source.availableLayers as KnowledgeLayerDefinition[]) : undefined,
    readContract: source.readContract,
    layers: source.layers as KnowledgeLayerDefinition[],
    items: source.items as CanonicalKnowledgeItem[],
    evidenceLinks: source.evidenceLinks as KnowledgeEvidenceLink[],
    boundary: source.boundary
  };
}

export function getArchitectureMindmapPayload(source: unknown): ArchitectureMindmapPayload | null {
  if (!isRecord(source) || !isRecord(source.boundary) || !isRecord(source.mindmap) || !isRecord(source.source)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    boundary: source.boundary,
    mindmap: source.mindmap as ArchitectureMindmapPayload["mindmap"],
    source: source.source
  };
}

export async function getKnowledgeFabricSnapshot(coreApiUrl = getCoreApiUrl()): Promise<KnowledgeFabricSnapshot> {
  const [layers, items, evidence, mappings, keihbBundles, context, mindmap] = await Promise.all([
    fetchCoreApi("/platform/knowledge/layers", coreApiUrl),
    fetchCoreApi("/platform/knowledge/items", coreApiUrl),
    fetchCoreApi("/platform/knowledge/evidence", coreApiUrl),
    fetchCoreApi("/platform/learning/layer-mappings", coreApiUrl),
    fetchCoreApi("/platform/knowledge/keihb/bundles", coreApiUrl),
    fetchCoreApi("/platform/knowledge/context?productKey=OIS_PLATFORM&includeDrafts=true&includeEvidence=true", coreApiUrl),
    fetchCoreApi("/platform/architecture/mindmap", coreApiUrl)
  ]);
  const errorMessage =
    getRegistryErrorMessage(layers.data) ??
    getRegistryErrorMessage(items.data) ??
    getRegistryErrorMessage(evidence.data) ??
    getRegistryErrorMessage(mappings.data) ??
    getRegistryErrorMessage(keihbBundles.data) ??
    getRegistryErrorMessage(context.data) ??
    getRegistryErrorMessage(mindmap.data) ??
    layers.error ??
    items.error ??
    evidence.error ??
    mappings.error ??
    keihbBundles.error ??
    context.error ??
    mindmap.error;

  return {
    coreApiUrl,
    layers,
    items,
    evidence,
    mappings,
    keihbBundles,
    context,
    mindmap,
    layersPayload: getKnowledgeLayersPayload(layers.data),
    itemsPayload: getKnowledgeItemsPayload(items.data),
    evidencePayload: getKnowledgeEvidencePayload(evidence.data),
    mappingsPayload: getKnowledgeLayerMappingsPayload(mappings.data),
    keihbBundlesPayload: getKeihbBundlesPayload(keihbBundles.data),
    contextPayload: getKnowledgeContextPayload(context.data),
    mindmapPayload: getArchitectureMindmapPayload(mindmap.data),
    errorMessage
  };
}

export type OimaBoundaryPayload = {
  metadata: RegistryMetadata;
  boundary: Record<string, unknown>;
  productShell?: Record<string, unknown> | undefined;
  productBoundaryMetadata?: Record<string, unknown> | undefined;
  productCode: string;
  productKey: string;
  productName: string;
  displayName: string;
  productType: string;
  implementationStatus: string;
  poweredBy: string;
  tagline: string;
  vietnamesePositioning: string;
  capabilityCodes: string[];
  currentRuntimeCapabilities: string[];
  plannedRuntimeCapabilities: string[];
  sourceModes: string[];
  sourceModeContracts?: Array<Record<string, unknown>> | undefined;
  sourceModeRules: Record<string, unknown>;
  meetingStatuses?: string[] | undefined;
  analysisModes?: string[] | undefined;
  safetyBoundaries: string[];
  coreReuseMap?: Record<string, string> | undefined;
  ownedUxSurfaces?: string[] | undefined;
  emptyStateSurfaces?: Array<{
    surfaceCode: string;
    title: string;
    availability: string;
    availableNow: boolean;
    runtimeEnabled: boolean;
    stage: string;
    statusLabel: string;
    description: string;
  }> | undefined;
  knowledgeIntegration?: Record<string, unknown> | undefined;
  roadmap?: Array<Record<string, unknown>> | undefined;
  outOfScope?: string[] | undefined;
  noCanonicalKnowledgeWrite?: boolean | undefined;
  autoPromotionEnabled?: boolean | undefined;
  oisAgentWidgetDirectCanonicalWriteAllowed?: boolean | undefined;
};

export type OimaSnapshot = {
  coreApiUrl: string;
  overview: ApiResult;
  sourceModes: ApiResult;
  roadmap: ApiResult;
  boundary: ApiResult;
  overviewPayload: OimaBoundaryPayload | null;
  sourceModesPayload: OimaBoundaryPayload | null;
  roadmapPayload: OimaBoundaryPayload | null;
  boundaryPayload: OimaBoundaryPayload | null;
  errorMessage: string | null;
};

export type OimaMeetingSourceFilePayload = {
  id: string;
  meetingId: string;
  fileType: string;
  originalFilename: string;
  storageKey: string | null;
  storageUrl: string | null;
  mimeType: string | null;
  sizeBytes: number;
  checksum: string | null;
  uploadStatus: string;
  createdAt: string;
};

export type OimaMeetingPayload = {
  id: string;
  organizationId: string;
  workspaceId: string;
  title: string;
  meetingDate: string;
  startTime: string | null;
  endTime: string | null;
  sourceMode: string;
  participantCount: number;
  status: string;
  confidenceScore: number;
  transcriptPresent: boolean;
  audioPresent: boolean;
  sourceFileCount: number;
  sourceFiles: OimaMeetingSourceFilePayload[];
  createdAt: string;
  updatedAt: string;
};

export type OimaMeetingIntakePayload = {
  metadata: RegistryMetadata | null;
  intakeContract: Record<string, unknown> | null;
  meetings: OimaMeetingPayload[];
  meeting: OimaMeetingPayload | null;
  plannedNextSteps: string[];
  noFakeMeetingAnalysis: boolean;
  noLlmCalls: boolean;
};

export type OimaMeetingLibrarySnapshot = {
  coreApiUrl: string;
  library: ApiResult;
  payload: OimaMeetingIntakePayload | null;
  meetings: OimaMeetingPayload[];
  errorMessage: string | null;
};

export type OimaMeetingDetailSnapshot = {
  coreApiUrl: string;
  detail: ApiResult;
  payload: OimaMeetingIntakePayload | null;
  meeting: OimaMeetingPayload | null;
  errorMessage: string | null;
  notFound: boolean;
};

function getOimaMeetingSourceFilePayload(source: unknown): OimaMeetingSourceFilePayload | null {
  if (!isRecord(source)) {
    return null;
  }

  const id = getString(source, "id");
  const meetingId = getString(source, "meetingId");
  const fileType = getString(source, "fileType");
  const originalFilename = getString(source, "originalFilename");
  const uploadStatus = getString(source, "uploadStatus");
  const createdAt = getString(source, "createdAt");

  if (!id || !meetingId || !fileType || !originalFilename || !uploadStatus || !createdAt) {
    return null;
  }

  return {
    id,
    meetingId,
    fileType,
    originalFilename,
    storageKey: getString(source, "storageKey"),
    storageUrl: getString(source, "storageUrl"),
    mimeType: getString(source, "mimeType"),
    sizeBytes: typeof source.sizeBytes === "number" ? source.sizeBytes : 0,
    checksum: getString(source, "checksum"),
    uploadStatus,
    createdAt
  };
}

function getOimaMeetingPayload(source: unknown): OimaMeetingPayload | null {
  if (!isRecord(source)) {
    return null;
  }

  const id = getString(source, "id");
  const organizationId = getString(source, "organizationId");
  const workspaceId = getString(source, "workspaceId");
  const title = getString(source, "title");
  const meetingDate = getString(source, "meetingDate");
  const sourceMode = getString(source, "sourceMode");
  const status = getString(source, "status");
  const createdAt = getString(source, "createdAt");
  const updatedAt = getString(source, "updatedAt");

  if (!id || !organizationId || !workspaceId || !title || !meetingDate || !sourceMode || !status || !createdAt || !updatedAt) {
    return null;
  }

  const sourceFiles = Array.isArray(source.sourceFiles)
    ? source.sourceFiles.map(getOimaMeetingSourceFilePayload).filter((item): item is OimaMeetingSourceFilePayload => Boolean(item))
    : [];

  return {
    id,
    organizationId,
    workspaceId,
    title,
    meetingDate,
    startTime: getString(source, "startTime"),
    endTime: getString(source, "endTime"),
    sourceMode,
    participantCount: typeof source.participantCount === "number" ? source.participantCount : 0,
    status,
    confidenceScore: typeof source.confidenceScore === "number" ? source.confidenceScore : 0,
    transcriptPresent: typeof source.transcriptPresent === "boolean" ? source.transcriptPresent : sourceFiles.some((file) => file.fileType === "TRANSCRIPT"),
    audioPresent: typeof source.audioPresent === "boolean" ? source.audioPresent : sourceFiles.some((file) => file.fileType === "AUDIO"),
    sourceFileCount: typeof source.sourceFileCount === "number" ? source.sourceFileCount : sourceFiles.length,
    sourceFiles,
    createdAt,
    updatedAt
  };
}

export function getOimaMeetingIntakePayload(source: unknown): OimaMeetingIntakePayload | null {
  if (!isRecord(source)) {
    return null;
  }

  const metadata = getRegistryMetadata(source);
  const meetings = Array.isArray(source.meetings)
    ? source.meetings.map(getOimaMeetingPayload).filter((item): item is OimaMeetingPayload => Boolean(item))
    : [];
  const meeting = getOimaMeetingPayload(source.meeting);

  return {
    metadata,
    intakeContract: isRecord(source.intakeContract) ? source.intakeContract : null,
    meetings,
    meeting,
    plannedNextSteps: getArray<string>(source, "plannedNextSteps"),
    noFakeMeetingAnalysis: typeof source.noFakeMeetingAnalysis === "boolean" ? source.noFakeMeetingAnalysis : false,
    noLlmCalls: typeof source.noLlmCalls === "boolean" ? source.noLlmCalls : false
  };
}

export async function getOimaMeetingLibrarySnapshot(coreApiUrl = getCoreApiUrl()): Promise<OimaMeetingLibrarySnapshot> {
  const library = await fetchCoreApi("/platform/oima/meetings", coreApiUrl);
  const payload = getOimaMeetingIntakePayload(library.data);

  return {
    coreApiUrl,
    library,
    payload,
    meetings: payload?.meetings ?? [],
    errorMessage: getRegistryErrorMessage(library.data) ?? library.error
  };
}

export async function getOimaMeetingDetailSnapshot(id: string, coreApiUrl = getCoreApiUrl()): Promise<OimaMeetingDetailSnapshot> {
  const detail = await fetchCoreApi(`/platform/oima/meetings/${encodeURIComponent(id)}`, coreApiUrl);
  const payload = getOimaMeetingIntakePayload(detail.data);

  return {
    coreApiUrl,
    detail,
    payload,
    meeting: payload?.meeting ?? null,
    errorMessage: getRegistryErrorMessage(detail.data) ?? detail.error,
    notFound: detail.status === 404
  };
}

export type OimaTranscriptVersionPayload = {
  id: string;
  meetingId: string;
  sourceFileId: string;
  versionType: string;
  versionNumber: number;
  rawContentHash: string;
  contentStorageKey: string | null;
  contentTextAvailable: boolean;
  contentTextLength: number;
  isImmutable: boolean;
  createdBy: string | null;
  createdAt: string | null;
};

export type OimaTranscriptParseRunPayload = {
  id: string;
  meetingId: string;
  sourceFileId: string;
  rawVersionId: string;
  normalizedVersionId: string;
  parserType: string;
  status: string;
  segmentCount: number;
  warningCount: number;
  confidenceScore: number;
  startedAt: string | null;
  completedAt: string | null;
  errorMessage: string | null;
};

export type OimaTranscriptSegmentPayload = {
  id: string;
  meetingId: string;
  transcriptVersionId: string;
  parseRunId: string;
  segmentIndex: number;
  sourceLineStart: number;
  sourceLineEnd: number;
  timestampStart: string | null;
  timestampEnd: string | null;
  speakerRaw: string | null;
  speakerNormalized: string | null;
  rawText: string;
  normalizedText: string;
  confidenceScore: number;
  needsReview: boolean;
  createdAt: string | null;
};

export type OimaTranscriptWarningPayload = {
  id: string;
  parseRunId: string;
  segmentId: string | null;
  warningType: string;
  message: string;
  severity: string;
  createdAt: string | null;
};

export type OimaTranscriptProcessingPayload = {
  metadata: RegistryMetadata | null;
  transcriptProcessingContract: Record<string, unknown> | null;
  meetingId: string | null;
  latestParseRun: OimaTranscriptParseRunPayload | null;
  parseRun: OimaTranscriptParseRunPayload | null;
  rawVersion: OimaTranscriptVersionPayload | null;
  normalizedVersion: OimaTranscriptVersionPayload | null;
  versions: OimaTranscriptVersionPayload[];
  segments: OimaTranscriptSegmentPayload[];
  warnings: OimaTranscriptWarningPayload[];
  count: number;
  noLlmCalls: boolean;
  noFakeMeetingAnalysis: boolean;
};

export type OimaTranscriptSnapshot = {
  coreApiUrl: string;
  status: ApiResult;
  versionsResult: ApiResult;
  segmentsResult: ApiResult;
  warningsResult: ApiResult;
  statusPayload: OimaTranscriptProcessingPayload | null;
  versionsPayload: OimaTranscriptProcessingPayload | null;
  segmentsPayload: OimaTranscriptProcessingPayload | null;
  warningsPayload: OimaTranscriptProcessingPayload | null;
  latestParseRun: OimaTranscriptParseRunPayload | null;
  versions: OimaTranscriptVersionPayload[];
  segments: OimaTranscriptSegmentPayload[];
  warnings: OimaTranscriptWarningPayload[];
  errorMessage: string | null;
};

function getOimaTranscriptVersionPayload(source: unknown): OimaTranscriptVersionPayload | null {
  if (!isRecord(source)) {
    return null;
  }

  const id = getString(source, "id");
  const meetingId = getString(source, "meetingId");
  const sourceFileId = getString(source, "sourceFileId");
  const versionType = getString(source, "versionType");
  const rawContentHash = getString(source, "rawContentHash");

  if (!id || !meetingId || !sourceFileId || !versionType || !rawContentHash) {
    return null;
  }

  return {
    id,
    meetingId,
    sourceFileId,
    versionType,
    versionNumber: typeof source.versionNumber === "number" ? source.versionNumber : 0,
    rawContentHash,
    contentStorageKey: getString(source, "contentStorageKey"),
    contentTextAvailable: typeof source.contentTextAvailable === "boolean" ? source.contentTextAvailable : false,
    contentTextLength: typeof source.contentTextLength === "number" ? source.contentTextLength : 0,
    isImmutable: typeof source.isImmutable === "boolean" ? source.isImmutable : false,
    createdBy: getString(source, "createdBy"),
    createdAt: getString(source, "createdAt")
  };
}

function getOimaTranscriptParseRunPayload(source: unknown): OimaTranscriptParseRunPayload | null {
  if (!isRecord(source)) {
    return null;
  }

  const id = getString(source, "id");
  const meetingId = getString(source, "meetingId");
  const sourceFileId = getString(source, "sourceFileId");
  const rawVersionId = getString(source, "rawVersionId");
  const normalizedVersionId = getString(source, "normalizedVersionId");
  const parserType = getString(source, "parserType");
  const status = getString(source, "status");

  if (!id || !meetingId || !sourceFileId || !rawVersionId || !normalizedVersionId || !parserType || !status) {
    return null;
  }

  return {
    id,
    meetingId,
    sourceFileId,
    rawVersionId,
    normalizedVersionId,
    parserType,
    status,
    segmentCount: typeof source.segmentCount === "number" ? source.segmentCount : 0,
    warningCount: typeof source.warningCount === "number" ? source.warningCount : 0,
    confidenceScore: typeof source.confidenceScore === "number" ? source.confidenceScore : 0,
    startedAt: getString(source, "startedAt"),
    completedAt: getString(source, "completedAt"),
    errorMessage: getString(source, "errorMessage")
  };
}

function getOimaTranscriptSegmentPayload(source: unknown): OimaTranscriptSegmentPayload | null {
  if (!isRecord(source)) {
    return null;
  }

  const id = getString(source, "id");
  const meetingId = getString(source, "meetingId");
  const transcriptVersionId = getString(source, "transcriptVersionId");
  const parseRunId = getString(source, "parseRunId");
  const rawText = getString(source, "rawText");
  const normalizedText = getString(source, "normalizedText");

  if (!id || !meetingId || !transcriptVersionId || !parseRunId || rawText === null || normalizedText === null) {
    return null;
  }

  return {
    id,
    meetingId,
    transcriptVersionId,
    parseRunId,
    segmentIndex: typeof source.segmentIndex === "number" ? source.segmentIndex : 0,
    sourceLineStart: typeof source.sourceLineStart === "number" ? source.sourceLineStart : 0,
    sourceLineEnd: typeof source.sourceLineEnd === "number" ? source.sourceLineEnd : 0,
    timestampStart: getString(source, "timestampStart"),
    timestampEnd: getString(source, "timestampEnd"),
    speakerRaw: getString(source, "speakerRaw"),
    speakerNormalized: getString(source, "speakerNormalized"),
    rawText,
    normalizedText,
    confidenceScore: typeof source.confidenceScore === "number" ? source.confidenceScore : 0,
    needsReview: typeof source.needsReview === "boolean" ? source.needsReview : false,
    createdAt: getString(source, "createdAt")
  };
}

function getOimaTranscriptWarningPayload(source: unknown): OimaTranscriptWarningPayload | null {
  if (!isRecord(source)) {
    return null;
  }

  const id = getString(source, "id");
  const parseRunId = getString(source, "parseRunId");
  const warningType = getString(source, "warningType");
  const message = getString(source, "message");
  const severity = getString(source, "severity");

  if (!id || !parseRunId || !warningType || !message || !severity) {
    return null;
  }

  return {
    id,
    parseRunId,
    segmentId: getString(source, "segmentId"),
    warningType,
    message,
    severity,
    createdAt: getString(source, "createdAt")
  };
}

export function getOimaTranscriptProcessingPayload(source: unknown): OimaTranscriptProcessingPayload | null {
  if (!isRecord(source)) {
    return null;
  }

  const versions = Array.isArray(source.versions)
    ? source.versions.map(getOimaTranscriptVersionPayload).filter((item): item is OimaTranscriptVersionPayload => Boolean(item))
    : [];
  const segments = Array.isArray(source.segments)
    ? source.segments.map(getOimaTranscriptSegmentPayload).filter((item): item is OimaTranscriptSegmentPayload => Boolean(item))
    : [];
  const warnings = Array.isArray(source.warnings)
    ? source.warnings.map(getOimaTranscriptWarningPayload).filter((item): item is OimaTranscriptWarningPayload => Boolean(item))
    : [];

  return {
    metadata: getRegistryMetadata(source),
    transcriptProcessingContract: isRecord(source.transcriptProcessingContract) ? source.transcriptProcessingContract : null,
    meetingId: getString(source, "meetingId"),
    latestParseRun: getOimaTranscriptParseRunPayload(source.latestParseRun),
    parseRun: getOimaTranscriptParseRunPayload(source.parseRun),
    rawVersion: getOimaTranscriptVersionPayload(source.rawVersion),
    normalizedVersion: getOimaTranscriptVersionPayload(source.normalizedVersion),
    versions,
    segments,
    warnings,
    count: typeof source.count === "number" ? source.count : 0,
    noLlmCalls: typeof source.noLlmCalls === "boolean" ? source.noLlmCalls : false,
    noFakeMeetingAnalysis: typeof source.noFakeMeetingAnalysis === "boolean" ? source.noFakeMeetingAnalysis : false
  };
}

export async function getOimaTranscriptSnapshot(id: string, coreApiUrl = getCoreApiUrl()): Promise<OimaTranscriptSnapshot> {
  const encodedId = encodeURIComponent(id);
  const [status, versionsResult, segmentsResult, warningsResult] = await Promise.all([
    fetchCoreApi(`/platform/oima/meetings/${encodedId}/transcript/status`, coreApiUrl),
    fetchCoreApi(`/platform/oima/meetings/${encodedId}/transcript/versions`, coreApiUrl),
    fetchCoreApi(`/platform/oima/meetings/${encodedId}/transcript/segments`, coreApiUrl),
    fetchCoreApi(`/platform/oima/meetings/${encodedId}/transcript/warnings`, coreApiUrl)
  ]);
  const statusPayload = getOimaTranscriptProcessingPayload(status.data);
  const versionsPayload = getOimaTranscriptProcessingPayload(versionsResult.data);
  const segmentsPayload = getOimaTranscriptProcessingPayload(segmentsResult.data);
  const warningsPayload = getOimaTranscriptProcessingPayload(warningsResult.data);

  return {
    coreApiUrl,
    status,
    versionsResult,
    segmentsResult,
    warningsResult,
    statusPayload,
    versionsPayload,
    segmentsPayload,
    warningsPayload,
    latestParseRun: statusPayload?.latestParseRun ?? null,
    versions: versionsPayload?.versions ?? [],
    segments: segmentsPayload?.segments ?? [],
    warnings: warningsPayload?.warnings ?? [],
    errorMessage:
      getRegistryErrorMessage(status.data) ??
      status.error ??
      getRegistryErrorMessage(versionsResult.data) ??
      versionsResult.error ??
      getRegistryErrorMessage(segmentsResult.data) ??
      segmentsResult.error ??
      getRegistryErrorMessage(warningsResult.data) ??
      warningsResult.error
  };
}

export function getOimaBoundaryPayload(source: unknown): OimaBoundaryPayload | null {
  if (
    !isRecord(source) ||
    !isRecord(source.boundary) ||
    !Array.isArray(source.sourceModes) ||
    !isRecord(source.sourceModeRules) ||
    !Array.isArray(source.safetyBoundaries)
  ) {
    return null;
  }

  const metadata = getRegistryMetadata(source);

  if (!metadata) {
    return null;
  }

  return {
    metadata,
    boundary: source.boundary,
    productShell: isRecord(source.productShell) ? source.productShell : undefined,
    productBoundaryMetadata: isRecord(source.productBoundaryMetadata) ? source.productBoundaryMetadata : undefined,
    productCode: getString(source, "productCode") ?? "OIMA",
    productKey: getString(source, "productKey") ?? "OIMA",
    productName: getString(source, "productName") ?? "Organizational Intelligence Meeting Agent",
    displayName: getString(source, "displayName") ?? "OIMA",
    productType: getString(source, "productType") ?? "MEETING_INTELLIGENCE_PRODUCT",
    implementationStatus: getString(source, "implementationStatus") ?? "PRODUCT_BOUNDARY_READY",
    poweredBy: getString(source, "poweredBy") ?? "OIS",
    tagline: getString(source, "tagline") ?? "OIS understands the organization. OIMA understands the meeting.",
    vietnamesePositioning: getString(source, "vietnamesePositioning") ?? "OIS hiểu tổ chức. OIMA hiểu cuộc họp.",
    capabilityCodes: getArray<string>(source, "capabilityCodes"),
    currentRuntimeCapabilities: getArray<string>(source, "currentRuntimeCapabilities"),
    plannedRuntimeCapabilities: getArray<string>(source, "plannedRuntimeCapabilities"),
    sourceModes: source.sourceModes as string[],
    sourceModeContracts: Array.isArray(source.sourceModeContracts) ? (source.sourceModeContracts as Array<Record<string, unknown>>) : undefined,
    sourceModeRules: source.sourceModeRules,
    meetingStatuses: Array.isArray(source.meetingStatuses) ? (source.meetingStatuses as string[]) : undefined,
    analysisModes: Array.isArray(source.analysisModes) ? (source.analysisModes as string[]) : undefined,
    safetyBoundaries: source.safetyBoundaries as string[],
    coreReuseMap: isRecord(source.coreReuseMap) ? (source.coreReuseMap as Record<string, string>) : undefined,
    ownedUxSurfaces: getArray<string>(source, "ownedUxSurfaces"),
    emptyStateSurfaces: Array.isArray(source.emptyStateSurfaces)
      ? (source.emptyStateSurfaces as OimaBoundaryPayload["emptyStateSurfaces"])
      : undefined,
    knowledgeIntegration: isRecord(source.knowledgeIntegration) ? source.knowledgeIntegration : undefined,
    roadmap: Array.isArray(source.roadmap) ? (source.roadmap as Array<Record<string, unknown>>) : undefined,
    outOfScope: getArray<string>(source, "outOfScope"),
    noCanonicalKnowledgeWrite: typeof source.noCanonicalKnowledgeWrite === "boolean" ? source.noCanonicalKnowledgeWrite : undefined,
    autoPromotionEnabled: typeof source.autoPromotionEnabled === "boolean" ? source.autoPromotionEnabled : undefined,
    oisAgentWidgetDirectCanonicalWriteAllowed:
      typeof source.oisAgentWidgetDirectCanonicalWriteAllowed === "boolean" ? source.oisAgentWidgetDirectCanonicalWriteAllowed : undefined
  };
}

export async function getOimaSnapshot(coreApiUrl = getCoreApiUrl()): Promise<OimaSnapshot> {
  const [overview, sourceModes, roadmap, boundary] = await Promise.all([
    fetchCoreApi("/platform/oima/overview", coreApiUrl),
    fetchCoreApi("/platform/oima/source-modes", coreApiUrl),
    fetchCoreApi("/platform/oima/roadmap", coreApiUrl),
    fetchCoreApi("/platform/oima/boundary", coreApiUrl)
  ]);
  const errorMessage =
    getRegistryErrorMessage(overview.data) ??
    getRegistryErrorMessage(sourceModes.data) ??
    getRegistryErrorMessage(roadmap.data) ??
    getRegistryErrorMessage(boundary.data) ??
    overview.error ??
    sourceModes.error ??
    roadmap.error ??
    boundary.error;

  return {
    coreApiUrl,
    overview,
    sourceModes,
    roadmap,
    boundary,
    overviewPayload: getOimaBoundaryPayload(overview.data),
    sourceModesPayload: getOimaBoundaryPayload(sourceModes.data),
    roadmapPayload: getOimaBoundaryPayload(roadmap.data),
    boundaryPayload: getOimaBoundaryPayload(boundary.data),
    errorMessage
  };
}
