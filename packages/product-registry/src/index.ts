import type { ProductCode } from "@ois/architecture-contracts";

export interface ProductRegistryEntry {
  code: ProductCode;
  name: string;
  runtimePath: string | null;
  adminPath: string;
}

export const productRegistry: ProductRegistryEntry[] = [
  { code: "OIS", name: "OIS", runtimePath: null, adminPath: "/products/ois" },
  { code: "PITS", name: "PITS", runtimePath: "http://localhost:3001", adminPath: "/products/pits" },
  { code: "CS_AGENT", name: "csAgent", runtimePath: null, adminPath: "/products/cs-agent" },
  { code: "KEIHB", name: "KEIHB", runtimePath: null, adminPath: "/products/keihb" },
  { code: "ICR", name: "ICR", runtimePath: null, adminPath: "/products/icr" }
];

export function getProduct(code: ProductCode): ProductRegistryEntry {
  const product = productRegistry.find((entry) => entry.code === code);
  if (!product) throw new Error(`Unknown product ${code}`);
  return product;
}
