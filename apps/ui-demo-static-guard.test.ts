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
  "ois-console/app/products/page.tsx",
  "ois-console/app/products/[id]/page.tsx",
  "ois-console/app/workspaces/page.tsx",
  "ois-console/app/workspaces/[id]/page.tsx",
  "ois-console/app/modules/[id]/page.tsx",
  "ois-console/app/installations/[id]/page.tsx",
  "ois-console/app/runtime/page.tsx",
  "pits-shell/app/page.tsx",
  "pits-shell/app/projects/page.tsx",
  "pits-shell/app/projects/[id]/page.tsx",
  "pits-shell/app/runtime/page.tsx"
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
});
