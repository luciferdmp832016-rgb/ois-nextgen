export const productCodes = ["OIS", "PITS", "CS_AGENT", "KEIHB", "ICR"] as const;
export type ProductCode = (typeof productCodes)[number];

export const layerCodes = [
  "L0_OPERATIONAL_DATA",
  "L1_KNOWLEDGE",
  "L2_AI_INFRASTRUCTURE",
  "L3_AI_QUALITY",
  "L4_OPERATIONAL_LEARNING",
  "L5_OPERATIONAL_WISDOM",
  "L5_5_ORGANIZATIONAL_INTELLIGENCE",
  "L6_EXECUTIVE_INTELLIGENCE",
  "L7_AI_GOVERNANCE",
  "L8_ENTERPRISE_KNOWLEDGE_FABRIC",
  "L9_UNIVERSAL_INTELLIGENCE_QUERY",
  "L10_AI_COUNCIL"
] as const;
export type LayerCode = (typeof layerCodes)[number];

export const scopeCodes = [
  "PLATFORM",
  "INDUSTRY",
  "ORGANIZATION",
  "WORKSPACE",
  "PROJECT",
  "PRODUCT_INSTALLATION"
] as const;
export type ScopeCode = (typeof scopeCodes)[number];

export const identityRealmCodes = [
  "OIS_ORGANIZATION_USER",
  "PITS_PROJECT_USER",
  "CSAGENT_RESIDENT",
  "EXTERNAL_PARTNER",
  "SYSTEM_SERVICE"
] as const;
export type IdentityRealmCode = (typeof identityRealmCodes)[number];

export const lifecycleStatuses = [
  "DRAFT",
  "ACTIVE",
  "SUSPENDED",
  "DEPRECATED",
  "ARCHIVED",
  "PLANNED",
  "BLOCKED_BY_PHASE2",
  "BLOCKED_BY_PHASE3"
] as const;
export type LifecycleStatus = (typeof lifecycleStatuses)[number];

export const moduleTypes = [
  "PLATFORM_KERNEL",
  "CONTROL_PLANE_VIEW",
  "PRODUCT_RUNTIME_VIEW",
  "DOMAIN_SERVICE",
  "REPOSITORY",
  "WORKER"
] as const;
export type ModuleType = (typeof moduleTypes)[number];

export const capabilityCodes = [
  "platform:overview:read",
  "organization:read",
  "workspace:read",
  "project:read",
  "product:catalog:read",
  "product:installation:read",
  "product:installation:manage",
  "module:catalog:read",
  "identity:read",
  "access:read",
  "audit:read",
  "pits:runtime:access",
  "learning:signal:create",
  "learning:candidate:review",
  "learning:policy:manage",
  "agent:runtime:access"
] as const;
export type CapabilityCode = (typeof capabilityCodes)[number];

export interface ModuleContract {
  code: string;
  product: ProductCode;
  layer: LayerCode;
  scope: ScopeCode;
  realm: IdentityRealmCode;
  lifecycle: LifecycleStatus;
  type: ModuleType;
}

export const stageAModules: ModuleContract[] = [
  {
    code: "OIS_CONSOLE_ARCHITECTURE_STATUS",
    product: "OIS",
    layer: "L0_OPERATIONAL_DATA",
    scope: "PLATFORM",
    realm: "OIS_ORGANIZATION_USER",
    lifecycle: "ACTIVE",
    type: "CONTROL_PLANE_VIEW"
  },
  {
    code: "PITS_RUNTIME_SHELL",
    product: "PITS",
    layer: "L0_OPERATIONAL_DATA",
    scope: "PROJECT",
    realm: "PITS_PROJECT_USER",
    lifecycle: "ACTIVE",
    type: "PRODUCT_RUNTIME_VIEW"
  },
  {
    code: "PLATFORM_KERNEL_API",
    product: "OIS",
    layer: "L0_OPERATIONAL_DATA",
    scope: "PLATFORM",
    realm: "SYSTEM_SERVICE",
    lifecycle: "ACTIVE",
    type: "PLATFORM_KERNEL"
  },
  {
    code: "OIS_SELF_IMPROVEMENT_ENGINE",
    product: "OIS",
    layer: "L4_OPERATIONAL_LEARNING",
    scope: "PLATFORM",
    realm: "SYSTEM_SERVICE",
    lifecycle: "ACTIVE",
    type: "DOMAIN_SERVICE"
  },
  {
    code: "OIS_AGENT_RUNTIME",
    product: "OIS",
    layer: "L9_UNIVERSAL_INTELLIGENCE_QUERY",
    scope: "PLATFORM",
    realm: "SYSTEM_SERVICE",
    lifecycle: "ACTIVE",
    type: "PLATFORM_KERNEL"
  },
  {
    code: "OIS_LEARNING_CENTER",
    product: "OIS",
    layer: "L7_AI_GOVERNANCE",
    scope: "ORGANIZATION",
    realm: "OIS_ORGANIZATION_USER",
    lifecycle: "ACTIVE",
    type: "CONTROL_PLANE_VIEW"
  },
  {
    code: "UNIVERSAL_KNOWLEDGE_API",
    product: "OIS",
    layer: "L9_UNIVERSAL_INTELLIGENCE_QUERY",
    scope: "PLATFORM",
    realm: "SYSTEM_SERVICE",
    lifecycle: "ACTIVE",
    type: "PLATFORM_KERNEL"
  }
];
