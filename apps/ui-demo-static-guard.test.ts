import { Dirent, existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const uiPackageRoots = [
  fileURLToPath(new URL("./ois-console", import.meta.url)),
  fileURLToPath(new URL("./pits-shell", import.meta.url))
];

const excludedDirectories = new Set([".next", "node_modules", "coverage", "dist"]);
const scannedExtensions = new Set([".css", ".js", ".jsx", ".json", ".md", ".mjs", ".ts", ".tsx"]);
const forbiddenReferences = [
  ["DATABASE", "URL"].join("_"),
  "ois_phase1_dev",
  "emerald_bql_web_dev",
  "ois.dmp247.com",
  "oisys.abacusai.app"
];
const expectedRouteFiles = [
  "ois-console/app/page.tsx",
  "ois-console/app/dashboard/page.tsx",
  "ois-console/app/product-flow/page.tsx",
  "ois-console/app/products/page.tsx",
  "ois-console/app/products/[id]/page.tsx",
  "ois-console/app/workspaces/page.tsx",
  "ois-console/app/workspaces/[id]/page.tsx",
  "ois-console/app/modules/[id]/page.tsx",
  "ois-console/app/installations/[id]/page.tsx",
  "ois-console/app/localization/page.tsx",
  "ois-console/app/runtime/page.tsx",
  "pits-shell/app/page.tsx",
  "pits-shell/app/product-flow/page.tsx",
  "pits-shell/app/projects/page.tsx",
  "pits-shell/app/projects/[id]/page.tsx",
  "pits-shell/app/projects/[id]/workboard/page.tsx",
  "pits-shell/app/projects/[id]/work-items/[itemId]/page.tsx",
  "pits-shell/app/localization/page.tsx",
  "pits-shell/app/runtime/page.tsx"
];
const expectedStage2CUxBlueprintDocs = [
  "architecture/ux/PITS_PRODUCT_UX_BLUEPRINT.md",
  "architecture/ux/OIS_PRODUCT_UX_BLUEPRINT.md",
  "architecture/ux/PRODUCT_PAGE_VS_ADMIN_CONSOLE_MAP.md",
  "architecture/implementation/STAGE_2C_PRODUCT_UX_BLUEPRINT_SCREEN_FLOW_DRAFT_GATE.md"
];
const expectedStage2DLocalizationDocs = [
  "architecture/ux/LOCALIZATION_FOUNDATION.md",
  "architecture/ux/PRODUCT_FLOW_VISUAL_PREVIEW.md",
  "architecture/implementation/STAGE_2D_LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW.md",
  "architecture/implementation/STAGE_2D_R1_LOCALIZATION_COVERAGE_FONT_RUNTIME_MARKER_HOTFIX.md"
];

function collectScannedFiles(root: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(root, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = join(root, entry.name);

    if (entry.isDirectory()) {
      if (!excludedDirectories.has(entry.name)) {
        files.push(...collectScannedFiles(entryPath));
      }
      continue;
    }

    if (isScannableFile(entry)) {
      files.push(entryPath);
    }
  }

  return files;
}

function isScannableFile(entry: Dirent) {
  return entry.isFile() && scannedExtensions.has(extname(entry.name));
}

describe("UI demo package static guard", () => {
  it("keeps OIS Console and PITS Shell free of direct DB and legacy production references", () => {
    const violations: string[] = [];

    for (const root of uiPackageRoots) {
      for (const file of collectScannedFiles(root)) {
        const content = readFileSync(file, "utf8");

        for (const forbiddenReference of forbiddenReferences) {
          if (content.includes(forbiddenReference)) {
            violations.push(`${relative(process.cwd(), file)} contains ${forbiddenReference}`);
          }
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it("keeps every Stage 1A public route backed by an App Router page file", () => {
    const appsRoot = fileURLToPath(new URL(".", import.meta.url));
    const missingRoutes = expectedRouteFiles.filter((routeFile) => !existsSync(join(appsRoot, routeFile)));

    expect(missingRoutes).toEqual([]);
  });

  it("keeps Stage 2C UX blueprint docs present with owner approval markers", () => {
    const repoRoot = fileURLToPath(new URL("..", import.meta.url));
    const missingDocs = expectedStage2CUxBlueprintDocs.filter((doc) => !existsSync(join(repoRoot, doc)));

    expect(missingDocs).toEqual([]);

    for (const doc of expectedStage2CUxBlueprintDocs) {
      const content = readFileSync(join(repoRoot, doc), "utf8");

      expect(content).toContain("Stage 2C");
      expect(content).toContain("PRODUCT_UX_BLUEPRINT_SCREEN_FLOW_DRAFT_READY");
      expect(content).toContain("Owner");
    }
  });

  it("keeps Stage 2D localization and visual preview docs present", () => {
    const repoRoot = fileURLToPath(new URL("..", import.meta.url));

    for (const doc of expectedStage2DLocalizationDocs) {
      const content = readFileSync(join(repoRoot, doc), "utf8");

      expect(content).toContain("Stage 2D");
      expect(content).toContain("LOCALIZATION_FOUNDATION_PRODUCT_FLOW_PREVIEW_READY");
      expect(content).toContain("Localization Foundation");
      expect(content).toContain("Product Flow Preview");
      expect(content).toContain("Owner");
    }
  });
});
