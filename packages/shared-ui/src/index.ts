export const demoBannerText = "DEMO DATA - NOT PRODUCTION";

export const defaultCoreApiUrl = "https://ois-nextgen.abacusai.cloud";

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

export type ProjectRegistryItem = RegistryLifecycle & {
  code: string;
  name: string;
  workspaceId: string;
  workspace?: RegistryRelationship;
  organization?: RegistryRelationship;
  installations: Array<{
    id: string;
    productCode: string;
    productName: string;
    lifecycle: string;
    version: number;
  }>;
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

export type PlatformRegistrySnapshot = PlatformSnapshot & {
  registry: ApiResult;
  registryMetadata: RegistryMetadata | null;
  products: ProductRegistryItem[];
  organizations: OrganizationRegistryItem[];
  workspaces: WorkspaceRegistryItem[];
  projects: ProjectRegistryItem[];
  modules: ModuleRegistryItem[];
  installations: ProductInstallationRegistryItem[];
};

export function getCoreApiUrl() {
  const configured = process.env.CORE_API_URL ?? process.env.NEXT_PUBLIC_CORE_API_URL ?? defaultCoreApiUrl;
  return configured.replace(/\/+$/, "");
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

function getRegistryMetadata(source: unknown): RegistryMetadata | null {
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
  const [health, overview, registry] = await Promise.all([
    fetchCoreApi("/health", coreApiUrl),
    fetchCoreApi("/platform/overview", coreApiUrl),
    fetchCoreApi("/platform/registry", coreApiUrl)
  ]);
  const platform = createPlatformSnapshot(coreApiUrl, health, overview);

  return {
    ...platform,
    registry,
    registryMetadata: getRegistryMetadata(registry.data),
    products: getArray<ProductRegistryItem>(registry.data, "products"),
    organizations: getArray<OrganizationRegistryItem>(registry.data, "organizations"),
    workspaces: getArray<WorkspaceRegistryItem>(registry.data, "workspaces"),
    projects: getArray<ProjectRegistryItem>(registry.data, "projects"),
    modules: getArray<ModuleRegistryItem>(registry.data, "modules"),
    installations: getArray<ProductInstallationRegistryItem>(registry.data, "installations")
  };
}
