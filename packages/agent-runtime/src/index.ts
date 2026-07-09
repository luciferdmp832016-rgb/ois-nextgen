export const ecosystemProductKeys = ["OIS_PLATFORM", "PITS", "OIMA", "KEIHB", "ICR", "CSAGENT", "FUTURE_PRODUCT", "CUSTOM"] as const;
export type EcosystemProductKey = (typeof ecosystemProductKeys)[number];

export const ecosystemProductTypes = [
  "CORE_PLATFORM",
  "ECOSYSTEM_PRODUCT",
  "MEETING_INTELLIGENCE_PRODUCT",
  "FUTURE_PRODUCT",
  "CUSTOM_PRODUCT"
] as const;
export type EcosystemProductType = (typeof ecosystemProductTypes)[number];

export const learningScopes = ["ORGANIZATION", "INDUSTRY", "PLATFORM"] as const;
export type LearningScope = (typeof learningScopes)[number];

export const sourceAuthorities = [
  "CEO",
  "CHAIRMAN",
  "BOD",
  "C_LEVEL",
  "DIRECTOR",
  "MANAGER",
  "SUPERADMIN",
  "ADMIN",
  "STAFF",
  "END_USER",
  "SYSTEM",
  "UNKNOWN"
] as const;
export type SourceAuthority = (typeof sourceAuthorities)[number];

export const learningPolicyModes = ["ALWAYS_ASK", "AUTO_IF_CONFIDENCE", "FULL_AUTO_PILOT", "LOG_ONLY"] as const;
export type LearningPolicyMode = (typeof learningPolicyModes)[number];

export const learningSourceTypes = ["WIDGET", "MEETING", "DOCUMENT", "TICKET", "CHAT", "EMAIL", "CALL", "SYSTEM", "IMPORT", "OTHER"] as const;
export type LearningSourceType = (typeof learningSourceTypes)[number];

export const learningSignalTypes = [
  "USER_CORRECTION",
  "NEW_KNOWLEDGE",
  "EXECUTIVE_STATEMENT",
  "CEO_DIRECTIVE",
  "STRATEGIC_INTENT",
  "SOP_CORRECTION",
  "FAQ_CORRECTION",
  "ENTITY_CORRECTION",
  "RISK_PATTERN",
  "TICKET_PATTERN",
  "CANDIDATE_MARKET_SIGNAL",
  "CUSTOMER_COMPLAINT_PATTERN",
  "PRODUCT_FEEDBACK",
  "KNOWLEDGE_GAP",
  "OTHER"
] as const;
export type LearningSignalType = (typeof learningSignalTypes)[number];

export const learningSignalStatuses = ["RECEIVED", "TRIAGED", "CANDIDATE_CREATED", "IGNORED", "ERROR"] as const;
export type LearningSignalStatus = (typeof learningSignalStatuses)[number];

export const learningCandidateTypes = [
  "EXECUTIVE_DIRECTIVE",
  "STRATEGIC_PRIORITY",
  "MANAGEMENT_PRINCIPLE",
  "EXECUTIVE_CONCERN",
  "MISALIGNMENT_SIGNAL",
  "ENTITY_UPDATE",
  "SOP_UPDATE",
  "FAQ_UPDATE",
  "RISK_PATTERN",
  "TICKET_PATTERN",
  "PRODUCT_IMPROVEMENT",
  "INDUSTRY_PATTERN",
  "PLATFORM_PATTERN",
  "OTHER"
] as const;
export type LearningCandidateType = (typeof learningCandidateTypes)[number];

export const learningConflictStatuses = ["NO_CONFLICT", "POSSIBLE_CONFLICT", "CONFLICT", "INSUFFICIENT_EVIDENCE"] as const;
export type LearningConflictStatus = (typeof learningConflictStatuses)[number];

export const learningPolicyDecisions = ["ASK_REVIEW", "AUTO_LEARN", "LOG_ONLY", "BLOCKED"] as const;
export type LearningPolicyDecision = (typeof learningPolicyDecisions)[number];

export const learningCandidateStatuses = ["PENDING_REVIEW", "AUTO_LEARNED", "APPROVED", "REJECTED", "PROMOTED", "ROLLED_BACK"] as const;
export type LearningCandidateStatus = (typeof learningCandidateStatuses)[number];

export const agentCapabilities = [
  "ASK",
  "EXPLAIN_SCREEN",
  "SHOW_EVIDENCE",
  "SUGGEST_NEXT_ACTION",
  "TEACH_OIS",
  "SUBMIT_CORRECTION",
  "REPORT_WRONG_ANSWER",
  "CONFIRM_AS_TRUE",
  "ESCALATE_TO_SUPERADMIN",
  "VIEW_LEARNING_STATUS"
] as const;
export type AgentCapability = (typeof agentCapabilities)[number];

export const agentMessageRoles = ["USER", "ASSISTANT", "SYSTEM"] as const;
export type AgentMessageRole = (typeof agentMessageRoles)[number];

export interface EcosystemProductRegistryEntry {
  productKey: EcosystemProductKey;
  displayName: string;
  description: string;
  productType: EcosystemProductType;
  enabled: boolean;
  supportedAgentCapabilities: AgentCapability[];
  supportedLearningSignalTypes: LearningSignalType[];
  defaultLearningScope: LearningScope;
}

export const ecosystemProductRegistry: EcosystemProductRegistryEntry[] = [
  {
    productKey: "OIS_PLATFORM",
    displayName: "OIS Platform",
    description: "The OIS Core control plane and shared platform brain.",
    productType: "CORE_PLATFORM",
    enabled: true,
    supportedAgentCapabilities: [...agentCapabilities],
    supportedLearningSignalTypes: [...learningSignalTypes],
    defaultLearningScope: "PLATFORM"
  },
  {
    productKey: "PITS",
    displayName: "PITS",
    description: "Project issue tracking and work coordination product shell.",
    productType: "ECOSYSTEM_PRODUCT",
    enabled: true,
    supportedAgentCapabilities: ["ASK", "EXPLAIN_SCREEN", "SHOW_EVIDENCE", "TEACH_OIS", "SUBMIT_CORRECTION", "VIEW_LEARNING_STATUS"],
    supportedLearningSignalTypes: ["USER_CORRECTION", "ENTITY_CORRECTION", "RISK_PATTERN", "TICKET_PATTERN", "PRODUCT_FEEDBACK", "KNOWLEDGE_GAP", "OTHER"],
    defaultLearningScope: "ORGANIZATION"
  },
  {
    productKey: "OIMA",
    displayName: "OIMA — Organizational Intelligence Meeting Agent",
    description: "Meeting intelligence product powered by OIS; transcript-first and audio-optional boundary only in Stage 2H.",
    productType: "MEETING_INTELLIGENCE_PRODUCT",
    enabled: true,
    supportedAgentCapabilities: ["ASK", "EXPLAIN_SCREEN", "SHOW_EVIDENCE", "SUGGEST_NEXT_ACTION", "TEACH_OIS", "SUBMIT_CORRECTION", "VIEW_LEARNING_STATUS"],
    supportedLearningSignalTypes: ["USER_CORRECTION", "NEW_KNOWLEDGE", "PRODUCT_FEEDBACK", "KNOWLEDGE_GAP", "OTHER"],
    defaultLearningScope: "ORGANIZATION"
  },
  {
    productKey: "KEIHB",
    displayName: "KEIHB",
    description: "Future OIS-powered product placeholder; registry and adapter only.",
    productType: "FUTURE_PRODUCT",
    enabled: false,
    supportedAgentCapabilities: ["ASK", "SHOW_EVIDENCE", "TEACH_OIS", "VIEW_LEARNING_STATUS"],
    supportedLearningSignalTypes: ["USER_CORRECTION", "NEW_KNOWLEDGE", "PRODUCT_FEEDBACK", "KNOWLEDGE_GAP", "OTHER"],
    defaultLearningScope: "ORGANIZATION"
  },
  {
    productKey: "ICR",
    displayName: "ICR",
    description: "Future OIS-powered product placeholder; registry and adapter only.",
    productType: "FUTURE_PRODUCT",
    enabled: false,
    supportedAgentCapabilities: ["ASK", "SHOW_EVIDENCE", "TEACH_OIS", "VIEW_LEARNING_STATUS"],
    supportedLearningSignalTypes: ["USER_CORRECTION", "NEW_KNOWLEDGE", "PRODUCT_FEEDBACK", "KNOWLEDGE_GAP", "OTHER"],
    defaultLearningScope: "ORGANIZATION"
  },
  {
    productKey: "CSAGENT",
    displayName: "CSAgent",
    description: "Future customer service agent product placeholder; registry and adapter only.",
    productType: "FUTURE_PRODUCT",
    enabled: false,
    supportedAgentCapabilities: ["ASK", "SHOW_EVIDENCE", "TEACH_OIS", "REPORT_WRONG_ANSWER", "VIEW_LEARNING_STATUS"],
    supportedLearningSignalTypes: ["CUSTOMER_COMPLAINT_PATTERN", "FAQ_CORRECTION", "PRODUCT_FEEDBACK", "KNOWLEDGE_GAP", "OTHER"],
    defaultLearningScope: "ORGANIZATION"
  },
  {
    productKey: "FUTURE_PRODUCT",
    displayName: "Future Product",
    description: "Extension slot for future OIS-powered products.",
    productType: "FUTURE_PRODUCT",
    enabled: false,
    supportedAgentCapabilities: ["ASK", "TEACH_OIS", "VIEW_LEARNING_STATUS"],
    supportedLearningSignalTypes: ["USER_CORRECTION", "NEW_KNOWLEDGE", "PRODUCT_FEEDBACK", "OTHER"],
    defaultLearningScope: "ORGANIZATION"
  },
  {
    productKey: "CUSTOM",
    displayName: "Custom",
    description: "Custom OIS-powered integration adapter.",
    productType: "CUSTOM_PRODUCT",
    enabled: false,
    supportedAgentCapabilities: ["ASK", "TEACH_OIS", "SUBMIT_CORRECTION", "VIEW_LEARNING_STATUS"],
    supportedLearningSignalTypes: ["USER_CORRECTION", "NEW_KNOWLEDGE", "PRODUCT_FEEDBACK", "OTHER"],
    defaultLearningScope: "ORGANIZATION"
  }
];

export interface LearningPolicyConfig {
  productKey: EcosystemProductKey;
  learningScope: LearningScope;
  signalType: LearningSignalType;
  sourceAuthority: SourceAuthority;
  policyMode: LearningPolicyMode;
  confidenceThreshold: number;
  enabled: boolean;
}

export const defaultLearningPolicies: LearningPolicyConfig[] = [
  {
    productKey: "OIS_PLATFORM",
    learningScope: "PLATFORM",
    signalType: "STRATEGIC_INTENT",
    sourceAuthority: "CEO",
    policyMode: "ALWAYS_ASK",
    confidenceThreshold: 0.9,
    enabled: true
  },
  {
    productKey: "OIS_PLATFORM",
    learningScope: "PLATFORM",
    signalType: "CEO_DIRECTIVE",
    sourceAuthority: "BOD",
    policyMode: "ALWAYS_ASK",
    confidenceThreshold: 0.9,
    enabled: true
  },
  {
    productKey: "OIS_PLATFORM",
    learningScope: "ORGANIZATION",
    signalType: "ENTITY_CORRECTION",
    sourceAuthority: "SUPERADMIN",
    policyMode: "AUTO_IF_CONFIDENCE",
    confidenceThreshold: 0.8,
    enabled: true
  },
  {
    productKey: "PITS",
    learningScope: "ORGANIZATION",
    signalType: "PRODUCT_FEEDBACK",
    sourceAuthority: "END_USER",
    policyMode: "LOG_ONLY",
    confidenceThreshold: 0.95,
    enabled: true
  },
  {
    productKey: "CSAGENT",
    learningScope: "ORGANIZATION",
    signalType: "CUSTOMER_COMPLAINT_PATTERN",
    sourceAuthority: "END_USER",
    policyMode: "LOG_ONLY",
    confidenceThreshold: 0.95,
    enabled: true
  },
  {
    productKey: "CUSTOM",
    learningScope: "ORGANIZATION",
    signalType: "OTHER",
    sourceAuthority: "UNKNOWN",
    policyMode: "ALWAYS_ASK",
    confidenceThreshold: 0.95,
    enabled: true
  }
];

export interface ConfidenceInput {
  sourceAuthority: SourceAuthority;
  signalType: LearningSignalType;
  evidenceCount?: number | undefined;
  hasEntityMatch?: boolean | undefined;
  hasConflict?: boolean | undefined;
  isSensitive?: boolean | undefined;
}

export interface ConfidenceResult {
  score: number;
  breakdown: {
    base: number;
    sourceAuthorityBoost: number;
    evidenceBoost: number;
    entityMatchBoost: number;
    conflictPenalty: number;
    sensitivityNote: string;
  };
}

const highAuthority = new Set<SourceAuthority>(["CEO", "CHAIRMAN", "BOD", "C_LEVEL"]);
const sensitiveSignalTypes = new Set<LearningSignalType>(["EXECUTIVE_STATEMENT", "CEO_DIRECTIVE", "STRATEGIC_INTENT", "RISK_PATTERN"]);
const sensitiveTextPatterns = /\b(executive|board|bod|ceo|chairman|legal|finance|financial|hr|personnel|salary|termination|risk)\b/i;

function clampScore(value: number) {
  return Math.max(0, Math.min(0.99, Number(value.toFixed(2))));
}

export function isHighAuthoritySource(sourceAuthority: SourceAuthority) {
  return highAuthority.has(sourceAuthority);
}

export function isSensitiveLearningSignal(input: { signalType: LearningSignalType; rawText?: string | undefined }) {
  return sensitiveSignalTypes.has(input.signalType) || sensitiveTextPatterns.test(input.rawText ?? "");
}

export function normalizeLearningText(rawText: string) {
  return rawText.trim().replace(/\s+/g, " ");
}

export function scoreLearningConfidence(input: ConfidenceInput): ConfidenceResult {
  const base = 0.35;
  const sourceAuthorityBoost = highAuthority.has(input.sourceAuthority)
    ? 0.25
    : input.sourceAuthority === "SUPERADMIN"
      ? 0.2
      : input.sourceAuthority === "DIRECTOR" || input.sourceAuthority === "MANAGER"
        ? 0.1
        : input.sourceAuthority === "SYSTEM"
          ? 0.06
          : 0;
  const evidenceBoost = Math.min((input.evidenceCount ?? 0) * 0.05, 0.15);
  const entityMatchBoost = input.hasEntityMatch ? 0.15 : 0;
  const conflictPenalty = input.hasConflict ? -0.3 : 0;
  const score = clampScore(base + sourceAuthorityBoost + evidenceBoost + entityMatchBoost + conflictPenalty);

  return {
    score,
    breakdown: {
      base,
      sourceAuthorityBoost,
      evidenceBoost,
      entityMatchBoost,
      conflictPenalty,
      sensitivityNote: input.isSensitive ? "Sensitive learning is forced to review by policy." : "No sensitivity override applied."
    }
  };
}

export interface PolicyEvaluationInput {
  policyMode: LearningPolicyMode;
  confidenceScore: number;
  confidenceThreshold: number;
  enabled: boolean;
  conflictStatus: LearningConflictStatus;
  isSensitive: boolean;
  sensitiveAutoAllowed?: boolean | undefined;
}

export function evaluateLearningPolicy(input: PolicyEvaluationInput): LearningPolicyDecision {
  if (!input.enabled) {
    return "BLOCKED";
  }

  if (input.isSensitive && !input.sensitiveAutoAllowed) {
    return "ASK_REVIEW";
  }

  if (input.conflictStatus !== "NO_CONFLICT") {
    return input.policyMode === "LOG_ONLY" ? "LOG_ONLY" : "ASK_REVIEW";
  }

  if (input.policyMode === "ALWAYS_ASK") {
    return "ASK_REVIEW";
  }

  if (input.policyMode === "LOG_ONLY") {
    return "LOG_ONLY";
  }

  if (input.policyMode === "FULL_AUTO_PILOT") {
    return "AUTO_LEARN";
  }

  return input.confidenceScore >= input.confidenceThreshold ? "AUTO_LEARN" : "ASK_REVIEW";
}

export interface LearningSignalForCandidate {
  id: string;
  productKey: EcosystemProductKey;
  learningScope: LearningScope;
  signalType: LearningSignalType;
  sourceAuthority: SourceAuthority;
  rawText: string;
  normalizedText?: string | undefined;
  relatedEntityRefs?: unknown[] | undefined;
  contextJson?: Record<string, unknown> | undefined;
}

export interface DeterministicCandidateDraft {
  candidateType: LearningCandidateType;
  title: string;
  summary: string;
  proposedKnowledgeJson: Record<string, unknown>;
  affectedProducts: EcosystemProductKey[];
  affectedEntities: unknown[];
  sourceAuthority: SourceAuthority;
  confidenceScore: number;
  confidenceBreakdownJson: ConfidenceResult["breakdown"];
  conflictStatus: LearningConflictStatus;
  policyDecision: LearningPolicyDecision;
  status: LearningCandidateStatus;
  evidenceJson: Record<string, unknown>;
}

function candidateTypeFor(signalType: LearningSignalType): LearningCandidateType {
  const map: Record<LearningSignalType, LearningCandidateType> = {
    USER_CORRECTION: "OTHER",
    NEW_KNOWLEDGE: "OTHER",
    EXECUTIVE_STATEMENT: "MANAGEMENT_PRINCIPLE",
    CEO_DIRECTIVE: "EXECUTIVE_DIRECTIVE",
    STRATEGIC_INTENT: "STRATEGIC_PRIORITY",
    SOP_CORRECTION: "SOP_UPDATE",
    FAQ_CORRECTION: "FAQ_UPDATE",
    ENTITY_CORRECTION: "ENTITY_UPDATE",
    RISK_PATTERN: "RISK_PATTERN",
    TICKET_PATTERN: "TICKET_PATTERN",
    CANDIDATE_MARKET_SIGNAL: "INDUSTRY_PATTERN",
    CUSTOMER_COMPLAINT_PATTERN: "TICKET_PATTERN",
    PRODUCT_FEEDBACK: "PRODUCT_IMPROVEMENT",
    KNOWLEDGE_GAP: "OTHER",
    OTHER: "OTHER"
  };

  return map[signalType];
}

function statusForPolicyDecision(policyDecision: LearningPolicyDecision): LearningCandidateStatus {
  if (policyDecision === "AUTO_LEARN") {
    return "AUTO_LEARNED";
  }

  if (policyDecision === "BLOCKED") {
    return "REJECTED";
  }

  return "PENDING_REVIEW";
}

export function generateLearningCandidateDraft(
  signal: LearningSignalForCandidate,
  policy: LearningPolicyConfig | null,
  confidenceOverride?: ConfidenceResult | undefined
): DeterministicCandidateDraft {
  const normalizedText = signal.normalizedText ?? normalizeLearningText(signal.rawText);
  const context = signal.contextJson ?? {};
  const relatedEntityRefs = signal.relatedEntityRefs ?? [];
  const hasConflict = Boolean(context.conflictFlag);
  const conflictStatus: LearningConflictStatus = hasConflict
    ? "POSSIBLE_CONFLICT"
    : relatedEntityRefs.length === 0 && signal.signalType === "ENTITY_CORRECTION"
      ? "INSUFFICIENT_EVIDENCE"
      : "NO_CONFLICT";
  const isSensitive = isSensitiveLearningSignal({ signalType: signal.signalType, rawText: signal.rawText });
  const confidence =
    confidenceOverride ??
    scoreLearningConfidence({
      sourceAuthority: signal.sourceAuthority,
      signalType: signal.signalType,
      evidenceCount: Array.isArray(context.evidence) ? context.evidence.length : 0,
      hasEntityMatch: relatedEntityRefs.length > 0,
      hasConflict,
      isSensitive
    });
  const effectivePolicy =
    policy ??
    ({
      productKey: signal.productKey,
      learningScope: signal.learningScope,
      signalType: signal.signalType,
      sourceAuthority: signal.sourceAuthority,
      policyMode: isHighAuthoritySource(signal.sourceAuthority) ? "ALWAYS_ASK" : "LOG_ONLY",
      confidenceThreshold: 0.95,
      enabled: true
    } satisfies LearningPolicyConfig);
  const policyDecision = evaluateLearningPolicy({
    policyMode: effectivePolicy.policyMode,
    confidenceScore: confidence.score,
    confidenceThreshold: effectivePolicy.confidenceThreshold,
    enabled: effectivePolicy.enabled,
    conflictStatus,
    isSensitive
  });
  const candidateType = candidateTypeFor(signal.signalType);
  const summary = normalizedText.length > 220 ? `${normalizedText.slice(0, 217)}...` : normalizedText;

  return {
    candidateType,
    title: `${candidateType.replace(/_/g, " ")} candidate`,
    summary,
    proposedKnowledgeJson: {
      extractionMode: "deterministic_stub",
      canonicalWriteAllowed: false,
      normalizedText,
      learningFlow: "Signal -> Candidate -> Confidence -> Policy -> Review/Auto-log -> Future Promotion"
    },
    affectedProducts: [signal.productKey],
    affectedEntities: relatedEntityRefs,
    sourceAuthority: signal.sourceAuthority,
    confidenceScore: confidence.score,
    confidenceBreakdownJson: confidence.breakdown,
    conflictStatus,
    policyDecision,
    status: statusForPolicyDecision(policyDecision),
    evidenceJson: {
      provenance: [
        {
          signalId: signal.id,
          sourceAuthority: signal.sourceAuthority,
          signalType: signal.signalType
        }
      ],
      notes: ["Stage 2F deterministic extraction stub; no LLM call; no canonical knowledge write."]
    }
  };
}

export interface AgentChatStubInput {
  productKey: EcosystemProductKey;
  currentRoute?: string | undefined;
  screen?: string | undefined;
  question: string;
}

export function buildAgentChatStubResponse(input: AgentChatStubInput) {
  return {
    answer:
      "OIS Agent Runtime is available in deterministic Stage 2F stub mode. I can explain the current screen, show evidence placeholders and accept governed teaching input.",
    evidence: [
      {
        label: "Stage 2F runtime contract",
        source: "deterministic_stub",
        productKey: input.productKey,
        route: input.currentRoute ?? null,
        screen: input.screen ?? null
      }
    ],
    suggestedActions: ["Ask about this screen", "Submit a correction", "View learning status"],
    canTeachOis: true,
    noLlmCall: true
  };
}
