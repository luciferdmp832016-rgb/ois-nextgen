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

export async function getPlatformSnapshot(): Promise<PlatformSnapshot> {
  const coreApiUrl = getCoreApiUrl();
  const [health, overview] = await Promise.all([
    fetchCoreApi("/health", coreApiUrl),
    fetchCoreApi("/platform/overview", coreApiUrl)
  ]);
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
