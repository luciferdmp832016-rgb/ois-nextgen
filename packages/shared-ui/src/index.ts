export const demoBannerText = "DEMO DATA - NOT PRODUCTION";

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

export type PlatformRegistrySnapshot = PlatformSnapshot & {
  registry: ApiResult;
  registryHealth: ApiResult;
  registryReadiness: ApiResult;
  registryMetadata: RegistryMetadata | null;
  registryHealthPayload: RegistryHealthPayload | null;
  registryReadinessPayload: RegistryReadinessPayload | null;
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
  const [health, overview, registry, registryHealth, registryReadiness] = await Promise.all([
    fetchCoreApi("/health", coreApiUrl),
    fetchCoreApi("/platform/overview", coreApiUrl),
    fetchCoreApi("/platform/registry", coreApiUrl),
    fetchCoreApi("/platform/registry/health", coreApiUrl),
    fetchCoreApi("/platform/registry/readiness", coreApiUrl)
  ]);
  const platform = createPlatformSnapshot(coreApiUrl, health, overview);
  const registryHealthPayload = getRegistryHealthPayload(registryHealth.data);
  const registryReadinessPayload = getRegistryReadinessPayload(registryReadiness.data);

  return {
    ...platform,
    registry,
    registryHealth,
    registryReadiness,
    registryMetadata: getRegistryMetadata(registry.data),
    registryHealthPayload,
    registryReadinessPayload,
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
