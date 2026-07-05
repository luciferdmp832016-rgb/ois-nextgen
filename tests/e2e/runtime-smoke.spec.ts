import { expect, test } from "@playwright/test";

const consoleUrl = process.env.OIS_CONSOLE_URL ?? "http://localhost:3000";
const pitsUrl = process.env.PITS_SHELL_URL ?? "http://localhost:3001";
const coreApiUrl = process.env.CORE_API_URL ?? "http://localhost:4000";

test("OIS Console renders the Stage A control plane shell", async ({ page }) => {
  await page.goto(consoleUrl, { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "OIS Console" })).toBeVisible();
  await expect(page.getByText("DEMO DATA - NOT PRODUCTION")).toBeVisible();
  await page.screenshot({ path: "test-results/stage-0d/ois-console-home.png", fullPage: true });
});

test("PITS Shell renders the Stage A product runtime shell", async ({ page }) => {
  await page.goto(pitsUrl, { waitUntil: "domcontentloaded" });

  await expect(page.getByRole("heading", { name: "PITS Shell" })).toBeVisible();
  await expect(page.getByText("DEMO DATA - NOT PRODUCTION")).toBeVisible();
  await page.screenshot({ path: "test-results/stage-0d/pits-shell-home.png", fullPage: true });
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
