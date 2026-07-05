import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: "playwright-report" }]
  ],
  use: {
    trace: "on-first-retry"
  },
  webServer: {
    command: "pnpm dev",
    url: process.env.CORE_API_URL ? `${process.env.CORE_API_URL}/health` : "http://localhost:4000/health",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      ...process.env,
      CI: process.env.CI ?? "true",
      CORE_API_HOST: process.env.CORE_API_HOST ?? "::",
      CORE_API_PORT: process.env.CORE_API_PORT ?? "4000",
      OIS_CONSOLE_PORT: process.env.OIS_CONSOLE_PORT ?? "3000",
      PITS_SHELL_PORT: process.env.PITS_SHELL_PORT ?? "3001"
    }
  }
});
