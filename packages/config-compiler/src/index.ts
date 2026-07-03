import type { ScopeCode } from "@ois/architecture-contracts";

export interface ConfigurationCandidate<T> {
  scope: ScopeCode;
  value: T;
}

const precedence: ScopeCode[] = [
  "PRODUCT_INSTALLATION",
  "PROJECT",
  "WORKSPACE",
  "ORGANIZATION",
  "INDUSTRY",
  "PLATFORM"
];

export function resolveConfiguration<T>(candidates: ConfigurationCandidate<T>[]): T | undefined {
  for (const scope of precedence) {
    const match = candidates.find((candidate) => candidate.scope === scope);
    if (match) return match.value;
  }
  return undefined;
}
