import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";

const coreApiUrl = "https://ois-nextgen.abacusai.cloud";
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

    return jsonResponse({ error: "unexpected URL", url }, 404);
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

async function renderPageHtml() {
  return renderToStaticMarkup(await Page());
}

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

describe("PITS Shell demo page", () => {
  const previousCoreApiUrl = process.env.CORE_API_URL;
  const previousNextPublicCoreApiUrl = process.env.NEXT_PUBLIC_CORE_API_URL;
  const previousDbEnv = process.env[dbEnvKey];

  beforeEach(() => {
    process.env.CORE_API_URL = coreApiUrl;
    delete process.env.NEXT_PUBLIC_CORE_API_URL;
    delete process.env[dbEnvKey];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreEnv("CORE_API_URL", previousCoreApiUrl);
    restoreEnv("NEXT_PUBLIC_CORE_API_URL", previousNextPublicCoreApiUrl);
    restoreEnv(dbEnvKey, previousDbEnv);
  });

  it("renders the mocked Core API health, seeded counts and demo boundary", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = await renderPageHtml();

    expect(html).toContain("PITS Shell");
    expect(html).toContain("PITS_SHELL");
    expect(html).toContain(coreApiUrl);
    expect(html).toContain("Core API healthy");
    expect(html).toContain("ok");
    expect(html).toContain("core-api");
    expect(html).toContain("bootstrap-stage-a");
    expect(html).toContain("DEMO DATA - NOT PRODUCTION");
    expect(html).toContain("This UI shell does not import Prisma or read database connection settings.");
    expect(html).toContain("DB-backed demo data is accessed only through the Core API.");
    expect(html).not.toContain(dbEnvKey);

    expect(html).toMatch(/industries<\/span><strong>1<\/strong>/);
    expect(html).toMatch(/organizations<\/span><strong>1<\/strong>/);
    expect(html).toMatch(/workspaces<\/span><strong>1<\/strong>/);
    expect(html).toMatch(/projects<\/span><strong>2<\/strong>/);
    expect(html).toMatch(/products<\/span><strong>5<\/strong>/);
    expect(html).toMatch(/installations<\/span><strong>2<\/strong>/);
    expect(html).toMatch(/modules<\/span><strong>3<\/strong>/);
    expect(html).toMatch(/auditRecords<\/span><strong>1<\/strong>/);

    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/health`, { cache: "no-store" });
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/overview`, { cache: "no-store" });
  });

  it("renders without a direct database environment value", async () => {
    mockCoreApiFetch();

    await expect(renderPageHtml()).resolves.toContain("PITS Shell");
    expect(process.env[dbEnvKey]).toBeUndefined();
  });
});
