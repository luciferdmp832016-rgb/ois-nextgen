import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

function walkRuntimeFiles(root: string, dir: string): string[] {
  return readdirSync(join(root, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      return walkRuntimeFiles(root, path);
    }
    if (!/\.(ts|tsx)$/.test(entry.name) || /\.(test|spec)\.(ts|tsx)$/.test(entry.name)) {
      return [];
    }
    return [path];
  });
}

test("Product Runtime cannot access Control Plane route", async () => {
  const root = process.cwd();
  const runtimeFiles = [
    "apps/pits-shell/app/page.tsx",
    "apps/pits-shell/app/login/page.tsx",
    "apps/pits-shell/app/projects/page.tsx",
    "apps/pits-shell/app/home/page.tsx",
    ...walkRuntimeFiles(root, "apps/oima-shell/app")
  ];

  for (const file of runtimeFiles) {
    expect(statSync(join(root, file)).isFile()).toBe(true);
    const contents = readFileSync(join(root, file), "utf8");
    expect(contents).not.toContain("/admin");
    expect(contents).not.toContain("control-plane");
    expect(contents).not.toContain("apps/ois-console");
    expect(contents).not.toContain("apps\\ois-console");
  }
});
