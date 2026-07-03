import { readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "@playwright/test";

test("Product Runtime cannot access Control Plane route", async () => {
  const root = process.cwd();
  const pitsFiles = [
    "apps/pits-shell/app/page.tsx",
    "apps/pits-shell/app/login/page.tsx",
    "apps/pits-shell/app/projects/page.tsx",
    "apps/pits-shell/app/home/page.tsx"
  ];

  for (const file of pitsFiles) {
    const contents = readFileSync(join(root, file), "utf8");
    expect(contents).not.toContain("/admin");
    expect(contents).not.toContain("control-plane");
  }
});
