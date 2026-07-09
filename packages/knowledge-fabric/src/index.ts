import type {
  EcosystemProductKey,
  LearningPolicyDecision,
  LearningScope,
  SourceAuthority
} from "@ois/agent-runtime";

export const knowledgeLayerKeys = [
  "KL_0_LEGAL_REGULATORY_CORE",
  "KL_1_INDUSTRY_CORE",
  "KL_2_ORGANIZATION_CORE",
  "KL_3_PRODUCT_KNOWLEDGE_PACK",
  "KL_4_WORKSPACE_PROJECT_OVERLAY",
  "KL_5_LIVE_OPERATIONAL_SIGNALS"
] as const;
export type KnowledgeLayerKey = (typeof knowledgeLayerKeys)[number];

export const knowledgeItemTypes = [
  "FACT",
  "POLICY",
  "SOP",
  "FAQ",
  "PLAYBOOK",
  "CHECKLIST",
  "EXECUTIVE_INTENT",
  "DECISION_RULE",
  "RISK_PATTERN",
  "INDUSTRY_PATTERN",
  "PRODUCT_RULE",
  "WORKSPACE_OVERLAY",
  "LIVE_SIGNAL_SUMMARY",
  "OTHER"
] as const;
export type KnowledgeItemType = (typeof knowledgeItemTypes)[number];

export const knowledgeItemStatuses = ["DRAFT", "ACTIVE", "DEPRECATED", "ARCHIVED"] as const;
export type KnowledgeItemStatus = (typeof knowledgeItemStatuses)[number];

export const knowledgeSensitivityLevels = ["LOW", "MEDIUM", "HIGH", "RESTRICTED"] as const;
export type KnowledgeSensitivityLevel = (typeof knowledgeSensitivityLevels)[number];

export const knowledgePromotionActions = ["CREATE", "UPDATE", "DEPRECATE", "MERGE", "LINK_ONLY", "LOG_ONLY"] as const;
export type KnowledgePromotionAction = (typeof knowledgePromotionActions)[number];

export const knowledgeLayerMappingStatuses = [
  "DRAFT_MAPPING",
  "READY_FOR_REVIEW",
  "APPROVED_FOR_FUTURE_PROMOTION",
  "REJECTED",
  "BLOCKED"
] as const;
export type KnowledgeLayerMappingStatus = (typeof knowledgeLayerMappingStatuses)[number];

export const knowledgeLayerMappingStatusTaxonomy: KnowledgeLayerMappingStatus[] = [...knowledgeLayerMappingStatuses];

export const knowledgeProjectionStatuses = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export type KnowledgeProjectionStatus = (typeof knowledgeProjectionStatuses)[number];

export interface KnowledgeLayerDefinition {
  key: KnowledgeLayerKey;
  order: number;
  displayName: string;
  scopeAlignment: LearningScope[];
  description: string;
  examples: string[];
  evidenceRequirement: "STRONG_APPROVAL_REQUIRED" | "EVIDENCE_REQUIRED" | "SIGNAL_ONLY";
  autoPromotionAllowedInStage2G: false;
}

export interface KnowledgeLayerTaxonomyContract {
  taxonomyVersion: "stage-2g.v1";
  layerKeys: KnowledgeLayerKey[];
  availableLayers: KnowledgeLayerDefinition[];
}

export const knowledgeLayerDefinitions: KnowledgeLayerDefinition[] = [
  {
    key: "KL_0_LEGAL_REGULATORY_CORE",
    order: 0,
    displayName: "Legal / Regulatory Core",
    scopeAlignment: ["INDUSTRY", "ORGANIZATION", "PLATFORM"],
    description: "Laws, regulations, standards and compliance references requiring strong evidence and approval.",
    examples: ["legal regulation", "PCCC standard", "building management compliance reference"],
    evidenceRequirement: "STRONG_APPROVAL_REQUIRED",
    autoPromotionAllowedInStage2G: false
  },
  {
    key: "KL_1_INDUSTRY_CORE",
    order: 1,
    displayName: "Industry Core",
    scopeAlignment: ["INDUSTRY", "PLATFORM"],
    description: "Industry knowledge, best practices, benchmark patterns and anonymized playbooks.",
    examples: ["handover best practice", "benchmark pattern", "industry playbook"],
    evidenceRequirement: "EVIDENCE_REQUIRED",
    autoPromotionAllowedInStage2G: false
  },
  {
    key: "KL_2_ORGANIZATION_CORE",
    order: 2,
    displayName: "Organization Core",
    scopeAlignment: ["ORGANIZATION"],
    description: "Organization policies, internal SOPs, CEO/BOD intent, authority model and operating rules.",
    examples: ["CEO directive", "internal SOP", "authority model"],
    evidenceRequirement: "STRONG_APPROVAL_REQUIRED",
    autoPromotionAllowedInStage2G: false
  },
  {
    key: "KL_3_PRODUCT_KNOWLEDGE_PACK",
    order: 3,
    displayName: "Product Knowledge Pack",
    scopeAlignment: ["PLATFORM", "ORGANIZATION"],
    description: "Product-specific knowledge packs for OIS Platform, PITS, KEIHB, ICR, CSAgent and future products.",
    examples: ["PITS product rule", "KEIHB handbook pack", "CSAgent FAQ pack"],
    evidenceRequirement: "EVIDENCE_REQUIRED",
    autoPromotionAllowedInStage2G: false
  },
  {
    key: "KL_4_WORKSPACE_PROJECT_OVERLAY",
    order: 4,
    displayName: "Workspace / Project Overlay",
    scopeAlignment: ["ORGANIZATION"],
    description: "Workspace, client, project, building, branch and local exception overlays.",
    examples: ["project-specific SOP", "building local setting", "client exception"],
    evidenceRequirement: "EVIDENCE_REQUIRED",
    autoPromotionAllowedInStage2G: false
  },
  {
    key: "KL_5_LIVE_OPERATIONAL_SIGNALS",
    order: 5,
    displayName: "Live Operational Signals",
    scopeAlignment: ["ORGANIZATION", "INDUSTRY", "PLATFORM"],
    description: "Meeting, ticket, chat, agent, call, email, import and live operational signals. This is not automatically canonical truth.",
    examples: ["meeting signal", "ticket pattern", "agent correction", "call/email import"],
    evidenceRequirement: "SIGNAL_ONLY",
    autoPromotionAllowedInStage2G: false
  }
];

export const knowledgeLayerTaxonomy: KnowledgeLayerTaxonomyContract = {
  taxonomyVersion: "stage-2g.v1",
  layerKeys: [...knowledgeLayerKeys],
  availableLayers: knowledgeLayerDefinitions
};

export interface CanonicalKnowledgeItemContract {
  id: string;
  layerKey: KnowledgeLayerKey;
  scope: LearningScope;
  itemType: KnowledgeItemType;
  title: string;
  summary: string;
  contentJson: Record<string, unknown>;
  status: KnowledgeItemStatus;
  version: number;
  locale: string;
  organizationId: string | null;
  workspaceId: string | null;
  industryCode: string | null;
  productKey: EcosystemProductKey | null;
  entityRefs: unknown[];
  relatedEntityIds: string[];
  sensitivityLevel: KnowledgeSensitivityLevel;
  confidenceScore: number;
  sourceAuthority: SourceAuthority;
  createdFromCandidateId: string | null;
}

export interface KnowledgeEvidenceLinkContract {
  id: string;
  knowledgeItemId: string | null;
  learningCandidateId: string | null;
  sourceType: string;
  sourceRef: string;
  sourceTitle: string;
  excerpt: string;
  excerptHash: string;
  evidenceWeight: number;
  sourceAuthority: SourceAuthority;
}

export interface KnowledgeLayerMappingContract {
  id: string;
  learningCandidateId: string;
  targetLayerKey: KnowledgeLayerKey;
  targetItemType: KnowledgeItemType;
  proposedAction: KnowledgePromotionAction;
  proposedTitle: string;
  proposedSummary: string;
  proposedContentJson: Record<string, unknown>;
  affectedProducts: EcosystemProductKey[];
  affectedEntities: unknown[];
  confidenceScore: number;
  policyDecision: LearningPolicyDecision;
  status: KnowledgeLayerMappingStatus;
}

export interface KnowledgeProjectionBundleContract {
  id: string;
  bundleKey: string;
  displayName: string;
  productKey: EcosystemProductKey;
  targetAudience: string;
  role: string;
  locale: string;
  includedLayerKeys: KnowledgeLayerKey[];
  includedItemIds: string[];
  selectionRules: Record<string, unknown>;
  snapshotVersion: number;
  status: KnowledgeProjectionStatus;
  manifestJson: Record<string, unknown>;
}

export interface KnowledgeReadContract {
  productKey: EcosystemProductKey;
  workspaceId?: string | undefined;
  organizationId?: string | undefined;
  projectId?: string | undefined;
  role?: string | undefined;
  audience?: string | undefined;
  locale?: string | undefined;
  query?: string | undefined;
  requestedLayers?: KnowledgeLayerKey[] | undefined;
  entityRefs?: unknown[] | undefined;
  includeEvidence?: boolean | undefined;
  includeDrafts?: boolean | undefined;
  maxItems?: number | undefined;
}

export const defaultKnowledgeReadContractExample: KnowledgeReadContract = {
  productKey: "OIS_PLATFORM",
  organizationId: "org_pmc_demo",
  workspaceId: "ws_pmc_org_demo",
  projectId: "prj_emerald_precinct_demo",
  role: "SUPERADMIN",
  audience: "SuperAdmin",
  locale: "en",
  query: "building management SOP context",
  requestedLayers: ["KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_4_WORKSPACE_PROJECT_OVERLAY"],
  entityRefs: [{ type: "Project", id: "prj_emerald_precinct_demo" }],
  includeEvidence: true,
  includeDrafts: true,
  maxItems: 10
};

export const productKnowledgeConsumptionMap = [
  {
    productKey: "OIS_PLATFORM",
    consumesLayers: [...knowledgeLayerKeys],
    contributesToLayers: ["KL_2_ORGANIZATION_CORE", "KL_5_LIVE_OPERATIONAL_SIGNALS"],
    role: "Canonical owner and control-plane reader"
  },
  {
    productKey: "KEIHB",
    consumesLayers: ["KL_0_LEGAL_REGULATORY_CORE", "KL_1_INDUSTRY_CORE", "KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK"],
    contributesToLayers: ["KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_5_LIVE_OPERATIONAL_SIGNALS"],
    role: "Knowledge publishing product / handbook projection"
  },
  {
    productKey: "PITS",
    consumesLayers: ["KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_4_WORKSPACE_PROJECT_OVERLAY"],
    contributesToLayers: ["KL_4_WORKSPACE_PROJECT_OVERLAY", "KL_5_LIVE_OPERATIONAL_SIGNALS"],
    role: "Project runtime consumer and operational signal contributor"
  },
  {
    productKey: "OIMA",
    consumesLayers: [
      "KL_0_LEGAL_REGULATORY_CORE",
      "KL_1_INDUSTRY_CORE",
      "KL_2_ORGANIZATION_CORE",
      "KL_3_PRODUCT_KNOWLEDGE_PACK",
      "KL_4_WORKSPACE_PROJECT_OVERLAY",
      "KL_5_LIVE_OPERATIONAL_SIGNALS"
    ],
    contributesToLayers: ["KL_5_LIVE_OPERATIONAL_SIGNALS"],
    role: "Meeting intelligence product; reads OIS context and contributes reviewed meeting signals only"
  },
  {
    productKey: "CSAGENT",
    consumesLayers: ["KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_5_LIVE_OPERATIONAL_SIGNALS"],
    contributesToLayers: ["KL_5_LIVE_OPERATIONAL_SIGNALS"],
    role: "Future customer support consumer/contributor"
  },
  {
    productKey: "ICR",
    consumesLayers: ["KL_1_INDUSTRY_CORE", "KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK"],
    contributesToLayers: ["KL_5_LIVE_OPERATIONAL_SIGNALS"],
    role: "Future inspection/compliance reader"
  }
] as const;

export const defaultCanonicalKnowledgeItems: CanonicalKnowledgeItemContract[] = [
  {
    id: "knowledge_item_kl0_pccc_reference_demo",
    layerKey: "KL_0_LEGAL_REGULATORY_CORE",
    scope: "INDUSTRY",
    itemType: "POLICY",
    title: "Demo regulatory reference intake rule",
    summary: "Legal and regulatory claims must retain evidence and approval provenance before use.",
    contentJson: { demoOnly: true, requirement: "Strong evidence and owner approval required before publication." },
    status: "ACTIVE",
    version: 1,
    locale: "en",
    organizationId: "org_pmc_demo",
    workspaceId: null,
    industryCode: "BUILDING_MANAGEMENT",
    productKey: null,
    entityRefs: [],
    relatedEntityIds: [],
    sensitivityLevel: "RESTRICTED",
    confidenceScore: 0.82,
    sourceAuthority: "SUPERADMIN",
    createdFromCandidateId: null
  },
  {
    id: "knowledge_item_kl1_handover_pattern_demo",
    layerKey: "KL_1_INDUSTRY_CORE",
    scope: "INDUSTRY",
    itemType: "INDUSTRY_PATTERN",
    title: "Demo handover checklist pattern",
    summary: "Building handover playbooks should include document pack, owner sign-off and issue follow-up tracks.",
    contentJson: { demoOnly: true, generalized: true, checkpoints: ["document pack", "owner sign-off", "issue follow-up"] },
    status: "ACTIVE",
    version: 1,
    locale: "en",
    organizationId: "org_pmc_demo",
    workspaceId: null,
    industryCode: "BUILDING_MANAGEMENT",
    productKey: null,
    entityRefs: [],
    relatedEntityIds: [],
    sensitivityLevel: "MEDIUM",
    confidenceScore: 0.76,
    sourceAuthority: "SYSTEM",
    createdFromCandidateId: null
  },
  {
    id: "knowledge_item_kl2_ceo_principle_demo",
    layerKey: "KL_2_ORGANIZATION_CORE",
    scope: "ORGANIZATION",
    itemType: "EXECUTIVE_INTENT",
    title: "Demo executive intent review principle",
    summary: "Executive intent must be visible to SuperAdmin review before changing operating policy.",
    contentJson: { demoOnly: true, approvalPath: ["CEO/BOD evidence", "SuperAdmin review", "future promotion gate"] },
    status: "ACTIVE",
    version: 1,
    locale: "en",
    organizationId: "org_pmc_demo",
    workspaceId: null,
    industryCode: null,
    productKey: "OIS_PLATFORM",
    entityRefs: [{ type: "Organization", id: "org_pmc_demo" }],
    relatedEntityIds: ["org_pmc_demo"],
    sensitivityLevel: "HIGH",
    confidenceScore: 0.88,
    sourceAuthority: "CEO",
    createdFromCandidateId: null
  },
  {
    id: "knowledge_item_kl3_keihb_sop_pack_demo",
    layerKey: "KL_3_PRODUCT_KNOWLEDGE_PACK",
    scope: "ORGANIZATION",
    itemType: "SOP",
    title: "Demo KEIHB SOP publishing pack",
    summary: "KEIHB publishes approved OIS Knowledge Fabric items as handbook, SOP, playbook and FAQ bundles.",
    contentJson: { demoOnly: true, publisher: "KEIHB", sourceOfTruth: "OIS Knowledge Fabric" },
    status: "DRAFT",
    version: 1,
    locale: "en",
    organizationId: "org_pmc_demo",
    workspaceId: "ws_pmc_org_demo",
    industryCode: "BUILDING_MANAGEMENT",
    productKey: "KEIHB",
    entityRefs: [{ type: "Workspace", id: "ws_pmc_org_demo" }],
    relatedEntityIds: ["ws_pmc_org_demo"],
    sensitivityLevel: "MEDIUM",
    confidenceScore: 0.7,
    sourceAuthority: "SUPERADMIN",
    createdFromCandidateId: null
  },
  {
    id: "knowledge_item_kl4_emerald_overlay_demo",
    layerKey: "KL_4_WORKSPACE_PROJECT_OVERLAY",
    scope: "ORGANIZATION",
    itemType: "WORKSPACE_OVERLAY",
    title: "Demo Emerald Precinct local overlay",
    summary: "Project-specific operating notes remain overlays and do not become industry truth.",
    contentJson: { demoOnly: true, overlayScope: "project", projectId: "prj_emerald_precinct_demo" },
    status: "ACTIVE",
    version: 1,
    locale: "en",
    organizationId: "org_pmc_demo",
    workspaceId: "ws_pmc_org_demo",
    industryCode: null,
    productKey: "PITS",
    entityRefs: [{ type: "Project", id: "prj_emerald_precinct_demo" }],
    relatedEntityIds: ["prj_emerald_precinct_demo"],
    sensitivityLevel: "LOW",
    confidenceScore: 0.74,
    sourceAuthority: "ADMIN",
    createdFromCandidateId: null
  },
  {
    id: "knowledge_item_kl5_signal_summary_demo",
    layerKey: "KL_5_LIVE_OPERATIONAL_SIGNALS",
    scope: "ORGANIZATION",
    itemType: "LIVE_SIGNAL_SUMMARY",
    title: "Demo operational signal summary",
    summary: "Live signals are evidence inputs for Self-Improvement and are not canonical truth by themselves.",
    contentJson: { demoOnly: true, canonicalTruth: false, feeds: ["widget", "ticket", "meeting"] },
    status: "DRAFT",
    version: 1,
    locale: "en",
    organizationId: "org_pmc_demo",
    workspaceId: "ws_pmc_org_demo",
    industryCode: null,
    productKey: "OIS_PLATFORM",
    entityRefs: [{ type: "LearningSignal", id: "learning_signal_stage_2g_keihb_sop_demo" }],
    relatedEntityIds: ["learning_signal_stage_2g_keihb_sop_demo"],
    sensitivityLevel: "LOW",
    confidenceScore: 0.58,
    sourceAuthority: "SYSTEM",
    createdFromCandidateId: null
  }
];

export const defaultKnowledgeEvidenceLinks: KnowledgeEvidenceLinkContract[] = [
  {
    id: "knowledge_evidence_stage_2g_regulatory_demo",
    knowledgeItemId: "knowledge_item_kl0_pccc_reference_demo",
    learningCandidateId: null,
    sourceType: "DOCUMENT",
    sourceRef: "demo://stage-2g/regulatory-reference",
    sourceTitle: "Demo regulatory reference",
    excerpt: "Regulatory knowledge requires strong evidence and approval before publication.",
    excerptHash: "stage2g-regulatory-demo",
    evidenceWeight: 0.9,
    sourceAuthority: "SUPERADMIN"
  },
  {
    id: "knowledge_evidence_stage_2g_keihb_candidate_demo",
    knowledgeItemId: null,
    learningCandidateId: "learning_candidate_stage_2g_keihb_sop_demo",
    sourceType: "WIDGET",
    sourceRef: "learning_signal_stage_2g_keihb_sop_demo",
    sourceTitle: "Demo KEIHB SOP learning signal",
    excerpt: "Publish approved building operations SOPs through KEIHB bundles after review.",
    excerptHash: "stage2g-keihb-candidate-demo",
    evidenceWeight: 0.72,
    sourceAuthority: "SUPERADMIN"
  }
];

export const defaultKnowledgeLayerMappings: KnowledgeLayerMappingContract[] = [
  {
    id: "knowledge_mapping_stage_2g_keihb_sop_demo",
    learningCandidateId: "learning_candidate_stage_2g_keihb_sop_demo",
    targetLayerKey: "KL_3_PRODUCT_KNOWLEDGE_PACK",
    targetItemType: "SOP",
    proposedAction: "CREATE",
    proposedTitle: "Demo KEIHB SOP bundle candidate",
    proposedSummary: "Map the KEIHB SOP learning candidate to a future product knowledge pack review.",
    proposedContentJson: {
      demoOnly: true,
      noAutoPromotion: true,
      futurePromotionRequired: ["owner review", "evidence check", "rollback plan"]
    },
    affectedProducts: ["OIS_PLATFORM", "KEIHB", "PITS"],
    affectedEntities: [{ type: "Workspace", id: "ws_pmc_org_demo" }],
    confidenceScore: 0.72,
    policyDecision: "ASK_REVIEW",
    status: "READY_FOR_REVIEW"
  }
];

export const defaultKeihbProjectionBundles: KnowledgeProjectionBundleContract[] = [
  {
    id: "knowledge_bundle_keihb_building_management_handbook_demo",
    bundleKey: "KEIHB_BUILDING_MANAGEMENT_HANDBOOK_DEMO",
    displayName: "KEIHB Building Management Handbook Demo",
    productKey: "KEIHB",
    targetAudience: "Building management team",
    role: "BQL",
    locale: "en",
    includedLayerKeys: ["KL_0_LEGAL_REGULATORY_CORE", "KL_1_INDUSTRY_CORE", "KL_2_ORGANIZATION_CORE"],
    includedItemIds: ["knowledge_item_kl0_pccc_reference_demo", "knowledge_item_kl1_handover_pattern_demo", "knowledge_item_kl2_ceo_principle_demo"],
    selectionRules: { demoOnly: true, includeApprovedOnlyInFuture: true },
    snapshotVersion: 1,
    status: "DRAFT",
    manifestJson: { publisher: "KEIHB", sourceOfTruth: "OIS Knowledge Fabric", format: "handbook" }
  },
  {
    id: "knowledge_bundle_keihb_bql_sop_demo",
    bundleKey: "KEIHB_BQL_SOP_DEMO",
    displayName: "KEIHB BQL SOP Demo",
    productKey: "KEIHB",
    targetAudience: "BQL",
    role: "BQL",
    locale: "en",
    includedLayerKeys: ["KL_2_ORGANIZATION_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_4_WORKSPACE_PROJECT_OVERLAY"],
    includedItemIds: ["knowledge_item_kl3_keihb_sop_pack_demo", "knowledge_item_kl4_emerald_overlay_demo"],
    selectionRules: { demoOnly: true, bundleType: "SOP" },
    snapshotVersion: 1,
    status: "DRAFT",
    manifestJson: { publisher: "KEIHB", sourceOfTruth: "OIS Knowledge Fabric", format: "sop" }
  },
  {
    id: "knowledge_bundle_keihb_resident_faq_demo",
    bundleKey: "KEIHB_RESIDENT_FAQ_DEMO",
    displayName: "KEIHB Resident FAQ Demo",
    productKey: "KEIHB",
    targetAudience: "Resident support",
    role: "Resident",
    locale: "en",
    includedLayerKeys: ["KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_5_LIVE_OPERATIONAL_SIGNALS"],
    includedItemIds: ["knowledge_item_kl3_keihb_sop_pack_demo", "knowledge_item_kl5_signal_summary_demo"],
    selectionRules: { demoOnly: true, bundleType: "FAQ" },
    snapshotVersion: 1,
    status: "DRAFT",
    manifestJson: { publisher: "KEIHB", sourceOfTruth: "OIS Knowledge Fabric", format: "faq" }
  },
  {
    id: "knowledge_bundle_keihb_technical_team_playbook_demo",
    bundleKey: "KEIHB_TECHNICAL_TEAM_PLAYBOOK_DEMO",
    displayName: "KEIHB Technical Team Playbook Demo",
    productKey: "KEIHB",
    targetAudience: "Technical team",
    role: "Technical",
    locale: "en",
    includedLayerKeys: ["KL_1_INDUSTRY_CORE", "KL_3_PRODUCT_KNOWLEDGE_PACK", "KL_4_WORKSPACE_PROJECT_OVERLAY"],
    includedItemIds: ["knowledge_item_kl1_handover_pattern_demo", "knowledge_item_kl3_keihb_sop_pack_demo", "knowledge_item_kl4_emerald_overlay_demo"],
    selectionRules: { demoOnly: true, bundleType: "PLAYBOOK" },
    snapshotVersion: 1,
    status: "DRAFT",
    manifestJson: { publisher: "KEIHB", sourceOfTruth: "OIS Knowledge Fabric", format: "playbook" }
  }
];

export interface LearningCandidateForLayerMapping {
  id: string;
  productKey: string;
  learningScope: LearningScope;
  candidateType: string;
  title: string;
  summary: string;
  proposedKnowledgeJson: Record<string, unknown>;
  affectedProducts: string[];
  affectedEntities: unknown[];
  confidenceScore: number;
  policyDecision: LearningPolicyDecision;
  sourceAuthority: SourceAuthority;
}

const itemTypeByCandidateType: Record<string, KnowledgeItemType> = {
  EXECUTIVE_DIRECTIVE: "EXECUTIVE_INTENT",
  STRATEGIC_PRIORITY: "EXECUTIVE_INTENT",
  MANAGEMENT_PRINCIPLE: "POLICY",
  EXECUTIVE_CONCERN: "RISK_PATTERN",
  MISALIGNMENT_SIGNAL: "RISK_PATTERN",
  ENTITY_UPDATE: "WORKSPACE_OVERLAY",
  SOP_UPDATE: "SOP",
  FAQ_UPDATE: "FAQ",
  RISK_PATTERN: "RISK_PATTERN",
  TICKET_PATTERN: "LIVE_SIGNAL_SUMMARY",
  PRODUCT_IMPROVEMENT: "PRODUCT_RULE",
  INDUSTRY_PATTERN: "INDUSTRY_PATTERN",
  PLATFORM_PATTERN: "FACT",
  OTHER: "OTHER"
};

export function inferKnowledgeLayerForCandidate(candidate: LearningCandidateForLayerMapping): KnowledgeLayerKey {
  if (candidate.candidateType === "INDUSTRY_PATTERN") {
    return "KL_1_INDUSTRY_CORE";
  }

  if (["EXECUTIVE_DIRECTIVE", "STRATEGIC_PRIORITY", "MANAGEMENT_PRINCIPLE", "EXECUTIVE_CONCERN"].includes(candidate.candidateType)) {
    return "KL_2_ORGANIZATION_CORE";
  }

  if (["SOP_UPDATE", "FAQ_UPDATE", "PRODUCT_IMPROVEMENT", "PLATFORM_PATTERN"].includes(candidate.candidateType)) {
    return "KL_3_PRODUCT_KNOWLEDGE_PACK";
  }

  if (candidate.candidateType === "ENTITY_UPDATE") {
    return "KL_4_WORKSPACE_PROJECT_OVERLAY";
  }

  if (candidate.candidateType === "RISK_PATTERN" && /\b(legal|regulatory|compliance|pccc|standard)\b/i.test(candidate.summary)) {
    return "KL_0_LEGAL_REGULATORY_CORE";
  }

  return "KL_5_LIVE_OPERATIONAL_SIGNALS";
}

export function itemTypeForCandidate(candidate: LearningCandidateForLayerMapping): KnowledgeItemType {
  return itemTypeByCandidateType[candidate.candidateType] ?? "OTHER";
}

export function proposedActionForCandidate(candidate: LearningCandidateForLayerMapping): KnowledgePromotionAction {
  if (candidate.policyDecision === "LOG_ONLY") {
    return "LOG_ONLY";
  }

  if (candidate.policyDecision === "BLOCKED") {
    return "LINK_ONLY";
  }

  return "CREATE";
}

export function buildKnowledgeLayerMappingDraft(candidate: LearningCandidateForLayerMapping): Omit<KnowledgeLayerMappingContract, "id"> {
  const targetLayerKey = inferKnowledgeLayerForCandidate(candidate);
  const targetItemType = itemTypeForCandidate(candidate);
  const proposedAction = proposedActionForCandidate(candidate);

  return {
    learningCandidateId: candidate.id,
    targetLayerKey,
    targetItemType,
    proposedAction,
    proposedTitle: candidate.title,
    proposedSummary: candidate.summary,
    proposedContentJson: {
      ...candidate.proposedKnowledgeJson,
      stage: "Stage 2G",
      noAutoPromotion: true,
      targetLayerKey,
      targetItemType
    },
    affectedProducts: candidate.affectedProducts.filter((product): product is EcosystemProductKey =>
      ["OIS_PLATFORM", "PITS", "KEIHB", "ICR", "CSAGENT", "FUTURE_PRODUCT", "CUSTOM"].includes(product)
    ),
    affectedEntities: candidate.affectedEntities,
    confidenceScore: candidate.confidenceScore,
    policyDecision: candidate.policyDecision,
    status: proposedAction === "LOG_ONLY" ? "DRAFT_MAPPING" : "READY_FOR_REVIEW"
  };
}

export function buildKnowledgeReadContract(input: Partial<KnowledgeReadContract> = {}): KnowledgeReadContract {
  return {
    ...defaultKnowledgeReadContractExample,
    ...input,
    requestedLayers: input.requestedLayers ?? defaultKnowledgeReadContractExample.requestedLayers,
    entityRefs: input.entityRefs ?? defaultKnowledgeReadContractExample.entityRefs,
    includeEvidence: input.includeEvidence ?? defaultKnowledgeReadContractExample.includeEvidence,
    includeDrafts: input.includeDrafts ?? false,
    maxItems: input.maxItems ?? defaultKnowledgeReadContractExample.maxItems
  };
}

export function buildDeterministicKnowledgeContext(input: {
  readContract: KnowledgeReadContract;
  items: CanonicalKnowledgeItemContract[];
  evidenceLinks: KnowledgeEvidenceLinkContract[];
}) {
  const requested = new Set(input.readContract.requestedLayers ?? knowledgeLayerKeys);
  const maxItems = input.readContract.maxItems ?? 10;
  const includeDrafts = Boolean(input.readContract.includeDrafts);
  const filteredItems = input.items
    .filter((item) => requested.has(item.layerKey))
    .filter((item) => includeDrafts || item.status === "ACTIVE")
    .filter((item) => !input.readContract.productKey || !item.productKey || item.productKey === input.readContract.productKey || input.readContract.productKey === "OIS_PLATFORM")
    .slice(0, maxItems);
  const filteredItemIds = new Set(filteredItems.map((item) => item.id));
  const evidenceLinks = input.readContract.includeEvidence
    ? input.evidenceLinks.filter((evidence) => evidence.knowledgeItemId === null || filteredItemIds.has(evidence.knowledgeItemId)).slice(0, maxItems)
    : [];

  return {
    mode: "deterministic-knowledge-context",
    noLlmCall: true,
    noCanonicalWrite: true,
    knowledgeLayerTaxonomy,
    availableLayers: knowledgeLayerTaxonomy.availableLayers,
    readContract: input.readContract,
    layers: knowledgeLayerDefinitions.filter((layer) => requested.has(layer.key)),
    items: filteredItems,
    evidenceLinks,
    boundary: {
      agentReadPath: true,
      agentLearningPath: "Teach OIS still creates Learning Signal only.",
      autoPromotionEnabled: false
    }
  };
}

export const architectureMindmapManifest = {
  manifestVersion: "1.0",
  stage: "Stage 2H",
  title: "OIS Ecosystem Architecture Map",
  oisCoreLayers: [
    "Platform Kernel",
    "Product Registry",
    "OIS Agent Runtime",
    "Self-Improvement Engine",
    "Canonical Knowledge Fabric",
    "Universal Knowledge API"
  ],
  ecosystemProducts: ["OIS_PLATFORM", "PITS", "OIMA", "KEIHB", "ICR", "CSAGENT", "FUTURE_PRODUCT", "CUSTOM"],
  knowledgeLayers: knowledgeLayerDefinitions.map((layer) => ({
    key: layer.key,
    displayName: layer.displayName,
    order: layer.order,
    evidenceRequirement: layer.evidenceRequirement
  })),
  flows: [
    {
      key: "stage_2f_learning_flow",
      label: "Stage 2F Learning Intake",
      nodes: ["OIS Agent Widget", "Learning Signal", "Learning Candidate", "Policy Decision", "Review / Auto-log"]
    },
    {
      key: "stage_2g_knowledge_fabric_flow",
      label: "Stage 2G Knowledge Fabric",
      nodes: ["Knowledge Layer Mapping", "Canonical Knowledge Item", "Evidence Link", "Universal Knowledge API", "KEIHB Projection Bundle"]
    },
    {
      key: "stage_2h_oima_boundary_flow",
      label: "Stage 2H OIMA Product Boundary",
      nodes: ["OIMA Meeting Shell", "Transcript-first Intake", "Universal Knowledge API", "OIS Agent Offline Analysis", "Learning Governance Review"]
    }
  ],
  apiContracts: [
    "/platform/knowledge/layers",
    "/platform/knowledge/items",
    "/platform/knowledge/context",
    "/platform/learning/layer-mappings",
    "/platform/knowledge/keihb/bundles",
    "/platform/agent/knowledge-context",
    "/platform/products/code/OIMA",
    "/platform/oima/overview",
    "/platform/oima/source-modes",
    "/platform/oima/roadmap",
    "/platform/oima/boundary",
    "/platform/architecture/mindmap"
  ],
  governanceCheckpoints: [
    "No widget direct canonical write",
    "No auto-promotion in Stage 2G",
    "OIMA transcript-first and audio-optional",
    "OIMA is not a separate knowledge silo",
    "No live speaking agent, voice clone or impersonation",
    "Evidence required for canonical claims",
    "KEIHB is projection/publishing product only",
    "Future promotion requires review and rollback gates"
  ]
} as const;
