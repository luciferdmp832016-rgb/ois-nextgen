import { expect, test } from "@playwright/test";

const consoleUrl = process.env.OIS_CONSOLE_URL ?? "http://localhost:3000";
const pitsUrl = process.env.PITS_SHELL_URL ?? "http://localhost:3001";
const oimaUrl = process.env.OIMA_SHELL_URL ?? "http://localhost:3002";
const coreApiUrl = process.env.CORE_API_URL ?? "http://localhost:4000";

test("OIS Console renders the Stage A control plane shell", async ({ page }) => {
  await page.goto(consoleUrl, { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "OIS Console", exact: true })).toBeVisible();
  await expect(page.getByText("DEMO DATA - NOT PRODUCTION")).toBeVisible();
  await page.screenshot({ path: "test-results/stage-0d/ois-console-home.png", fullPage: true });
});

test("PITS Shell renders the Stage A product runtime shell", async ({ page }) => {
  await page.goto(pitsUrl, { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "PITS Shell", exact: true })).toBeVisible();
  await expect(page.getByText("DEMO DATA - NOT PRODUCTION")).toBeVisible();
  await page.screenshot({ path: "test-results/stage-0d/pits-shell-home.png", fullPage: true });
});

test("OIMA Shell renders the standalone Stage 2L product runtime markers", async ({ page }) => {
  await page.goto(oimaUrl, { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { level: 1, name: "OIMA", exact: true })).toBeVisible();
  await expect(page.locator("body")).toContainText("OIMA_APP_SHELL");
  await expect(page.locator("body")).toContainText("STAGE_2L_STANDALONE_OIMA_APP_SHELL");
  await expect(page.locator("body")).toContainText("OIMA_DOMAIN_READY");
  await expect(page.locator("body")).toContainText("No fake meeting data");
  await page.screenshot({ path: "test-results/stage-2l/oima-shell-home.png", fullPage: true });
});

test("OIMA Shell exposes local meeting intake and planned placeholder routes", async ({ page }) => {
  await page.goto(`${oimaUrl}/meetings`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Meeting Library", exact: true })).toBeVisible();
  await expect(page.locator("body")).toContainText("Meeting Intake Foundation");
  await expect(page.locator("body")).toContainText("MEETING_INTAKE");

  await page.goto(`${oimaUrl}/meetings/new`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Upload / Register Meeting", exact: true })).toBeVisible();
  await expect(page.locator("body")).toContainText("TRANSCRIPT_ONLY supported");
  await expect(page.locator("body")).toContainText("No voice clone");

  await page.goto(`${oimaUrl}/analysis`, { waitUntil: "domcontentloaded" });
  await expect(page.getByRole("heading", { name: "Agent Analysis", exact: true })).toBeVisible();
  await expect(page.locator("body")).toContainText("Planned / not runtime");
  await expect(page.locator("body")).toContainText("No LLM/OpenRouter calls");
});

test("Core API root and health contracts respond", async ({ request }) => {
  const root = await request.get(coreApiUrl);
  expect(root.ok()).toBe(true);
  expect(root.headers()["content-type"]).toContain("application/json");
  expect(await root.json()).toEqual({
    service: "ois-nextgen-core-api",
    status: "ok",
    version: "0.1.0",
    health: "/health",
    docs: "/docs"
  });

  const health = await request.get(`${coreApiUrl}/health`);
  expect(health.ok()).toBe(true);
  expect(await health.json()).toEqual({
    status: "ok",
    service: "core-api",
    stage: "bootstrap-stage-a"
  });
});

test("Core API docs render from the generated OpenAPI surface", async ({ page }) => {
  await page.goto(`${coreApiUrl}/docs`, { waitUntil: "domcontentloaded" });

  await expect(page.locator("body")).toContainText(/Swagger UI|OIS NextGen Core API/);
  await page.screenshot({ path: "test-results/stage-0d/core-api-docs.png", fullPage: true });
});
