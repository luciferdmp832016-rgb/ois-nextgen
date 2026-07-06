import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

const pathFromRoot = (path: string) => fileURLToPath(new URL(path, import.meta.url));

export default defineConfig({
  esbuild: {
    jsx: "automatic",
    jsxImportSource: "react"
  },
  test: {
    include: ["apps/**/*.test.ts", "apps/**/*.test.tsx", "domains/**/*.test.ts", "packages/**/*.test.ts"],
    environment: "node"
  },
  resolve: {
    alias: {
      "@ois/architecture-contracts": pathFromRoot("./packages/architecture-contracts/src/index.ts"),
      "@ois/audit": pathFromRoot("./packages/audit/src/index.ts"),
      "@ois/config-compiler": pathFromRoot("./packages/config-compiler/src/index.ts"),
      "@ois/identity-access": pathFromRoot("./packages/identity-access/src/index.ts"),
      "@ois/tenant-context": pathFromRoot("./packages/tenant-context/src/index.ts"),
      "@ois/test-fixtures": pathFromRoot("./packages/test-fixtures/src/index.ts")
    }
  }
});
