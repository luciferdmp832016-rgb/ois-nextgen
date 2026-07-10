export const productCodes = ["OIS", "PITS", "CS_AGENT", "KEIHB", "ICR", "OIMA"] as const;
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
  "agent:runtime:access",
  "knowledge:layers:read",
  "knowledge:items:read",
  "knowledge:evidence:read",
  "knowledge:context:read",
  "knowledge:mapping:prepare",
  "knowledge:keihb:bundle:read",
  "architecture:mindmap:read"
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
  },
  {
    code: "CANONICAL_KNOWLEDGE_FABRIC",
    product: "OIS",
    layer: "L8_ENTERPRISE_KNOWLEDGE_FABRIC",
    scope: "PLATFORM",
    realm: "SYSTEM_SERVICE",
    lifecycle: "ACTIVE",
    type: "DOMAIN_SERVICE"
  },
  {
    code: "KEIHB_KNOWLEDGE_PROJECTION",
    product: "KEIHB",
    layer: "L8_ENTERPRISE_KNOWLEDGE_FABRIC",
    scope: "ORGANIZATION",
    realm: "OIS_ORGANIZATION_USER",
    lifecycle: "ACTIVE",
    type: "DOMAIN_SERVICE"
  },
  {
    code: "OIS_KNOWLEDGE_FABRIC_PAGE",
    product: "OIS",
    layer: "L8_ENTERPRISE_KNOWLEDGE_FABRIC",
    scope: "ORGANIZATION",
    realm: "OIS_ORGANIZATION_USER",
    lifecycle: "ACTIVE",
    type: "CONTROL_PLANE_VIEW"
  }
];

export const oimaSourceModes = ["TRANSCRIPT_ONLY", "AUDIO_ONLY", "TRANSCRIPT_AND_AUDIO", "LISTENER_CAPTURED"] as const;
export type OimaSourceMode = (typeof oimaSourceModes)[number];

export const oimaMeetingStatuses = [
  "DRAFT",
  "UPLOADED",
  "READY_FOR_PROCESSING",
  "NEEDS_REVIEW",
  "FAILED"
] as const;
export type OimaMeetingStatus = (typeof oimaMeetingStatuses)[number];

export const oimaMeetingSourceFileTypes = ["TRANSCRIPT", "AUDIO", "PARTICIPANT_LIST", "OTHER"] as const;
export type OimaMeetingSourceFileType = (typeof oimaMeetingSourceFileTypes)[number];

export const oimaMeetingSourceUploadStatuses = ["REGISTERED", "UPLOADED", "FAILED"] as const;
export type OimaMeetingSourceUploadStatus = (typeof oimaMeetingSourceUploadStatuses)[number];

export const oimaTranscriptVersionTypes = ["RAW", "NORMALIZED", "CORRECTED"] as const;
export type OimaTranscriptVersionType = (typeof oimaTranscriptVersionTypes)[number];

export const oimaTranscriptParserTypes = ["MICROSOFT_TEAMS", "GENERIC_TEXT", "MANUAL"] as const;
export type OimaTranscriptParserType = (typeof oimaTranscriptParserTypes)[number];

export const oimaTranscriptParseRunStatuses = ["PENDING", "PROCESSING", "COMPLETED", "NEEDS_REVIEW", "FAILED"] as const;
export type OimaTranscriptParseRunStatus = (typeof oimaTranscriptParseRunStatuses)[number];

export const oimaTranscriptParseWarningSeverities = ["INFO", "WARNING", "ERROR"] as const;
export type OimaTranscriptParseWarningSeverity = (typeof oimaTranscriptParseWarningSeverities)[number];

export const oimaAnalysisModes = ["OFFLINE_ANALYSIS", "LISTENER_CAPTURED_ANALYSIS_FUTURE"] as const;
export type OimaAnalysisMode = (typeof oimaAnalysisModes)[number];

export const oimaSafetyBoundaries = [
  "NO_LIVE_SPEAKING_AGENT",
  "NO_VOICE_CLONE",
  "NO_IMPERSONATION",
  "NO_AUTONOMOUS_DECISION",
  "TRANSCRIPT_FIRST_AUDIO_OPTIONAL"
] as const;
export type OimaSafetyBoundary = (typeof oimaSafetyBoundaries)[number];

export const oimaCapabilityCodes = [
  "MEETING_LIBRARY",
  "MEETING_INTAKE",
  "TRANSCRIPT_FIRST_PIPELINE",
  "AUDIO_OPTIONAL_ENRICHMENT",
  "MEETING_TRANSCRIPT_PROCESSING",
  "OFFLINE_MEETING_ANALYSIS",
  "SUBJECT_CLARIFICATION",
  "DECISION_ACTION_RISK_EXTRACTION",
  "MEETING_DASHBOARD",
  "MONTHLY_OPERATING_REPORT",
  "MEETING_SELF_IMPROVEMENT_REVIEW",
  "LISTENER_MODE_FUTURE"
] as const;
export type OimaCapabilityCode = (typeof oimaCapabilityCodes)[number];

export const oimaCurrentRuntimeCapabilities = ["OVERVIEW", "PRODUCT_BOUNDARY", "KNOWLEDGE_API_LINKAGE", "MEETING_INTAKE", "TRANSCRIPT_PROCESSING"] as const;
export type OimaCurrentRuntimeCapability = (typeof oimaCurrentRuntimeCapabilities)[number];

export const oimaPlannedRuntimeCapabilities = [
  "AUDIO_PROCESSING",
  "OFFLINE_AGENT_ANALYSIS",
  "SUBJECT_CLARIFICATION",
  "SELF_IMPROVEMENT",
  "LISTENER_MODE"
] as const;
export type OimaPlannedRuntimeCapability = (typeof oimaPlannedRuntimeCapabilities)[number];

export const oimaEmptyStateSurfaces = [
  {
    surfaceCode: "MEETING_LIBRARY",
    title: "Meeting Library",
    availability: "AVAILABLE_NOW",
    availableNow: true,
    runtimeEnabled: true,
    stage: "OIMA-1",
    statusLabel: "Available now in OIMA-1",
    description: "Workspace-scoped meeting library for registered intake records. It does not create analysis artifacts."
  },
  {
    surfaceCode: "UPLOAD_MEETING",
    title: "Upload Meeting",
    availability: "AVAILABLE_NOW",
    availableNow: true,
    runtimeEnabled: true,
    stage: "OIMA-1",
    statusLabel: "Available now in OIMA-1",
    description: "Transcript-first meeting registration with optional audio metadata."
  },
  {
    surfaceCode: "TRANSCRIPT_PROCESSING",
    title: "Transcript Processing",
    availability: "AVAILABLE_NOW",
    availableNow: true,
    runtimeEnabled: true,
    stage: "OIMA-2",
    statusLabel: "Available now in OIMA-2",
    description: "Deterministic parser preserves immutable raw transcripts and creates separate normalized transcript evidence."
  },
  {
    surfaceCode: "AGENT_ANALYSIS",
    title: "Agent Analysis",
    availability: "PLANNED",
    availableNow: false,
    runtimeEnabled: false,
    stage: "OIMA-3",
    statusLabel: "Planned for offline analysis",
    description: "Future evidence-backed OIS Agent analysis. No LLM or OpenRouter calls are enabled in OIMA-2."
  },
  {
    surfaceCode: "CLARIFICATION_REVIEW",
    title: "Clarification Review",
    availability: "PLANNED",
    availableNow: false,
    runtimeEnabled: false,
    stage: "OIMA-4",
    statusLabel: "Planned for subject clarification",
    description: "Future review queue for ambiguous subjects, owners and meeting context."
  },
  {
    surfaceCode: "DASHBOARD",
    title: "Dashboard",
    availability: "PLANNED",
    availableNow: false,
    runtimeEnabled: false,
    stage: "OIMA-5",
    statusLabel: "Planned for meeting dashboards",
    description: "Future meeting dashboard and monthly operating report surface."
  },
  {
    surfaceCode: "SELF_IMPROVEMENT_CENTER",
    title: "Self-Improvement Center",
    availability: "PLANNED",
    availableNow: false,
    runtimeEnabled: false,
    stage: "OIMA-6",
    statusLabel: "Planned for reviewed learning",
    description: "Future reviewed learning loop. It will not auto-promote meeting signals to canonical knowledge."
  },
  {
    surfaceCode: "LISTENER_MODE",
    title: "Listener Mode",
    availability: "PLANNED",
    availableNow: false,
    runtimeEnabled: false,
    stage: "OIMA-9",
    statusLabel: "Future permissioned recording only",
    description: "Future listener may record meetings with permission. Live speaking and voice clone remain out of scope."
  }
] as const satisfies ReadonlyArray<{
  surfaceCode: string;
  title: string;
  availability: "AVAILABLE_NOW" | "PLANNED";
  availableNow: boolean;
  runtimeEnabled: boolean;
  stage: string;
  statusLabel: string;
  description: string;
}>;
export type OimaEmptyStateSurface = (typeof oimaEmptyStateSurfaces)[number];

export const oimaCoreReuseMap = {
  workspace: "OIS Core Workspace",
  rbac: "OIS Core RBAC / future permission model",
  canonicalEntities: "OIS Core Canonical Entity Registry",
  knowledgeFabric: "OIS Canonical Knowledge Fabric KL-0 to KL-5",
  universalKnowledgeApi: "OIS Universal Knowledge API",
  agentRuntime: "OIS Agent Runtime deterministic/offline analysis boundary",
  learningGovernance: "OIS Learning Signal / Candidate / Policy / Audit",
  audit: "OIS audit trail for sensitive future writes",
  meetingProductUx: "OIMA-owned meeting product experience"
} as const;
export type OimaCoreReuseMap = typeof oimaCoreReuseMap;

export const universalKnowledgeApiContract = {
  code: "UNIVERSAL_KNOWLEDGE_API",
  displayName: "Universal Knowledge API",
  label: "OIS Universal Knowledge API",
  endpoint: "/platform/knowledge/context",
  sourceOfTruth: "OIS Canonical Knowledge Fabric"
} as const;
export type UniversalKnowledgeApiContract = typeof universalKnowledgeApiContract;

export const oimaSourceModeContracts = [
  {
    mode: "TRANSCRIPT_ONLY",
    primary: true,
    transcriptRequired: true,
    audioRequired: false,
    listenerMode: false,
    status: "SUPPORTED_STAGE_2K_PRIMARY",
    description: "Primary OIMA-2 flow. A transcript source file can be registered and deterministically parsed without audio."
  },
  {
    mode: "AUDIO_ONLY",
    primary: false,
    transcriptRequired: false,
    audioRequired: true,
    listenerMode: false,
    status: "METADATA_ACCEPTED_NO_ANALYSIS",
    description: "Audio metadata may be registered, but audio-only meetings require review and do not produce transcript processing or analysis in OIMA-2."
  },
  {
    mode: "TRANSCRIPT_AND_AUDIO",
    primary: false,
    transcriptRequired: true,
    audioRequired: false,
    listenerMode: false,
    status: "SUPPORTED_STAGE_2K_OPTIONAL_AUDIO",
    description: "Transcript remains primary while optional audio metadata may be attached for later stages."
  },
  {
    mode: "LISTENER_CAPTURED",
    primary: false,
    transcriptRequired: false,
    audioRequired: true,
    listenerMode: true,
    status: "FUTURE_ONLY",
    description: "Future Listener Mode is limited to listen, record and analyze; it is not a live speaking participant."
  }
] as const satisfies ReadonlyArray<{
  mode: OimaSourceMode;
  primary: boolean;
  transcriptRequired: boolean;
  audioRequired: boolean;
  listenerMode: boolean;
  status: string;
  description: string;
}>;

export const oimaRoadmap = [
  {
    stage: "OIMA-0",
    phase: "Stage 2I",
    status: "PRODUCT_SHELL_HARDENED",
    title: "Product Shell & Boundary Hardening",
    scope: "Stable OIMA product shell, overview, source-mode clarity, empty states and OIS knowledge linkage."
  },
  {
    stage: "OIMA-1",
    phase: "Stage 2J",
    status: "RUNTIME_FOUNDATION_READY",
    title: "Meeting Intake Foundation",
    scope: "Versioned schema and API/UI workflow for meeting records, transcript-first source files, optional audio metadata, status placeholders, audit and tenant scoping."
  },
  {
    stage: "OIMA-2",
    phase: "Stage 2K",
    status: "TRANSCRIPT_PROCESSING_READY",
    title: "Transcript Processing Foundation",
    scope: "Immutable raw transcript versions, separate normalized transcript versions, deterministic Microsoft Teams/plain-text parsing, parse runs, ordered segments, warnings and review markers."
  },
  {
    stage: "OIMA-3",
    phase: "Next",
    status: "PLANNED",
    title: "OIS Agent Offline Analysis",
    scope: "Evidence-backed offline analysis contracts; no real LLM/OpenRouter call in OIMA-2."
  },
  {
    stage: "OIMA-4",
    phase: "Future",
    status: "PLANNED",
    title: "Subject Clarification",
    scope: "Clarification workflow for ambiguous subjects, owners and meeting context."
  },
  {
    stage: "OIMA-5",
    phase: "Future",
    status: "PLANNED",
    title: "Dashboard & Monthly Report",
    scope: "Meeting dashboard and monthly operating report surfaces."
  },
  {
    stage: "OIMA-6",
    phase: "Future",
    status: "PLANNED",
    title: "Self-Improvement Review",
    scope: "Reviewed learning candidates only; no automatic canonical knowledge promotion."
  },
  {
    stage: "OIMA-7",
    phase: "Future",
    status: "PLANNED",
    title: "Optional Audio Intelligence",
    scope: "Optional audio enrichment may improve confidence but must not block transcript-first analysis."
  },
  {
    stage: "OIMA-8",
    phase: "Future",
    status: "PLANNED",
    title: "Voice Sample Speaker Identity",
    scope: "Future speaker identity support only with explicit governance; no voice clone or impersonation."
  },
  {
    stage: "OIMA-9",
    phase: "Future",
    status: "PLANNED",
    title: "Listener Mode",
    scope: "Future listen/record/analyze only; no live speaking agent or autonomous meeting participant."
  }
] as const;

export const oimaProductContract = {
  productCode: "OIMA",
  productKey: "OIMA",
  productName: "Organizational Intelligence Meeting Agent",
  displayName: "OIMA — Organizational Intelligence Meeting Agent",
  productType: "MEETING_INTELLIGENCE_PRODUCT",
  poweredBy: "OIS",
  implementationStatus: "PRODUCT_BOUNDARY_READY",
  tagline: "OIS understands the organization. OIMA understands the meeting.",
  vietnamesePositioning: "OIS hiểu tổ chức. OIMA hiểu cuộc họp.",
  capabilityCodes: oimaCapabilityCodes,
  sourceModes: oimaSourceModes,
  sourceModeContracts: oimaSourceModeContracts,
  meetingStatuses: oimaMeetingStatuses,
  transcriptVersionTypes: oimaTranscriptVersionTypes,
  transcriptParserTypes: oimaTranscriptParserTypes,
  transcriptParseRunStatuses: oimaTranscriptParseRunStatuses,
  transcriptParseWarningSeverities: oimaTranscriptParseWarningSeverities,
  analysisModes: oimaAnalysisModes,
  safetyBoundaries: oimaSafetyBoundaries,
  coreReuseMap: oimaCoreReuseMap,
  currentRuntimeCapabilities: oimaCurrentRuntimeCapabilities,
  plannedRuntimeCapabilities: oimaPlannedRuntimeCapabilities,
  emptyStateSurfaces: oimaEmptyStateSurfaces,
  roadmap: oimaRoadmap
} as const;

export const oimaProductBoundaryMetadata = {
  stage: "Stage 2K / OIMA-2",
  sourceReadyStage: "Stage 2K",
  productCode: oimaProductContract.productCode,
  productName: oimaProductContract.productName,
  displayName: oimaProductContract.displayName,
  poweredBy: oimaProductContract.poweredBy,
  sourceModes: oimaSourceModes,
  currentRuntimeCapabilities: oimaCurrentRuntimeCapabilities,
  plannedRuntimeCapabilities: oimaPlannedRuntimeCapabilities,
  primaryInput: "TRANSCRIPT",
  audioInput: "OPTIONAL_METADATA_REGISTRATION",
  meetingIntake: "RUNTIME_FOUNDATION_READY",
  transcriptProcessing: "TRANSCRIPT_PROCESSING_READY",
  rawTranscriptImmutability: "MANDATORY",
  normalizedTranscriptVersioning: "SEPARATE_FROM_RAW",
  audioProcessing: "PLANNED_NOT_RUNTIME",
  listenerMode: "FUTURE_PERMISSIONED_RECORDING_ONLY",
  liveSpeakingAgent: "OUT_OF_SCOPE",
  voiceClone: "OUT_OF_SCOPE"
} as const;
