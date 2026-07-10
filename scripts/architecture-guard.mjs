import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const violations = [];

function walk(dir) {
  const entries = readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (["node_modules", ".next", "coverage"].includes(entry.name)) return [];
      return walk(path);
    }
    if (!/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) return [];
    return [path];
  });
}

function scanFile(path) {
  const text = readFileSync(path, "utf8");
  const rel = relative(root, path);
  const isOisConsole = rel.startsWith("apps\\ois-console") || rel.startsWith("apps/ois-console");
  const isPitsRuntime = rel.startsWith("apps\\pits-shell") || rel.startsWith("apps/pits-shell");
  const isOimaRuntime = rel.startsWith("apps\\oima-shell") || rel.startsWith("apps/oima-shell");
  const isFrontend = isOisConsole || isPitsRuntime || isOimaRuntime;
  const isTestFile = /\.(test|spec)\.(ts|tsx|js|jsx|mjs)$/.test(rel);

  if (isFrontend && /from\s+["']@prisma\/client["']|from\s+["'].*prisma["']/.test(text)) {
    violations.push(`${rel}: frontend code must not import Prisma`);
  }
  if (isPitsRuntime && !isTestFile && /apps\/ois-console|apps\\ois-console|\/admin|control-plane/i.test(text)) {
    violations.push(`${rel}: PITS runtime must not import or link to Control Plane surfaces`);
  }
  if (isOimaRuntime && !isTestFile && /apps\/ois-console|apps\\ois-console|\/admin|control-plane/i.test(text)) {
    violations.push(`${rel}: OIMA runtime must not import or link to Control Plane surfaces`);
  }
  if (/page:intelligence/.test(text)) {
    violations.push(`${rel}: broad legacy permission page:intelligence is forbidden in NextGen`);
  }
}

for (const area of ["apps", "packages", "domains"]) {
  const dir = join(root, area);
  if (statSync(dir, { throwIfNoEntry: false })?.isDirectory()) {
    walk(dir).forEach(scanFile);
  }
}

if (violations.length > 0) {
  console.error("Architecture guard failed:");
  for (const violation of violations) console.error(`- ${violation}`);
  process.exit(1);
}

console.log("Architecture guard passed");
