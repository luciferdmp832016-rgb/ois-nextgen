import type { FastifyInstance } from "fastify";
import {
  oimaAnalysisModes,
  oimaCapabilityCodes,
  oimaCoreReuseMap,
  oimaCurrentRuntimeCapabilities,
  oimaEmptyStateSurfaces,
  oimaMeetingStatuses,
  oimaPlannedRuntimeCapabilities,
  oimaProductBoundaryMetadata,
  oimaProductContract,
  oimaRoadmap,
  oimaSafetyBoundaries,
  oimaSourceModeContracts,
  oimaSourceModes,
  universalKnowledgeApiContract
} from "@ois/architecture-contracts";
import { knowledgeLayerTaxonomy } from "@ois/knowledge-fabric";

type RegistryMetadata = {
  source: string;
  mode: string;
  environment: string;
  generatedAt: string;
};

type RegistryMetadataFactory = () => RegistryMetadata;

const stage2HBoundary = {
  stage: "Stage 2H",
  hardeningStage: "Stage 2I / OIMA-0",
  runtimeStage: "Stage 2K / OIMA-2",
  implementationStatus: "PRODUCT_BOUNDARY_READY",
  productShellStatus: "TRANSCRIPT_PROCESSING_FOUNDATION_READY",
  mode: "deterministic-oima-product-boundary",
  productKey: "OIMA",
  productCode: "OIMA",
  poweredBy: "OIS",
  transcriptFirst: true,
  audioOptional: true,
  listenerModeStatus: "FUTURE_ONLY",
  realLlmCallsEnabled: false,
  uploadPipelineImplemented: false,
  meetingStorageImplemented: true,
  meetingIntakeImplemented: true,
  sourceFileMetadataRegistrationImplemented: true,
  transcriptProcessingImplemented: true,
  rawTranscriptImmutable: true,
  normalizedTranscriptSeparate: true,
  correctedTranscriptWorkflowImplemented: false,
  noLiveSpeakingAgent: true,
  noVoiceClone: true,
  noImpersonation: true,
  noAutonomousDecision: true,
  noSeparateKnowledgeSourceOfTruth: true
} as const;

const stage2JProductShell = {
  stage: "Stage 2K / OIMA-2",
  status: "TRANSCRIPT_PROCESSING_FOUNDATION_READY",
  availableNow: oimaCurrentRuntimeCapabilities,
  plannedLater: oimaPlannedRuntimeCapabilities,
  transcriptPrimaryInput: true,
  audioOptionalFutureInput: false,
  audioOptionalMetadataRegistration: true,
  listenerModePermissionedRecordingFutureOnly: true,
  meetingRuntimeDataIncluded: true,
  meetingLibraryRuntimeImplemented: true,
  meetingIntakeImplemented: true,
  sourceFileMetadataRegistrationImplemented: true,
  transcriptSourceRegistrationImplemented: true,
  optionalAudioMetadataRegistrationImplemented: true,
  rawTranscriptImmutable: true,
  normalizedTranscriptSeparate: true,
  deterministicTranscriptParserImplemented: true,
  standaloneAppShellImplemented: true,
  standaloneAppPath: "apps/oima-shell",
  standaloneAppServiceName: "ois-nextgen-oima-staging",
  standaloneAppPort: 3002,
  customDomainFoundation: "https://oima.dmp247.com",
  binaryUploadStorageImplemented: false,
  uploadRuntimeImplemented: false,
  transcriptProcessingImplemented: true,
  audioProcessingImplemented: false,
  meetingAnalyticsImplemented: false,
  issueDecisionActionRiskExtractionImplemented: false,
  correctedTranscriptWorkflowImplemented: false,
  listenerModeImplemented: false,
  liveSpeakingAgentImplemented: false,
  voiceCloneImplemented: false,
  realLlmCallsEnabled: false,
  nextRecommendedStage: "OIMA-3 OIS Agent Offline Analysis"
} as const;

const oimaOutOfScope = [
  "Binary meeting file storage",
  "Transcript semantic extraction",
  "Audio processing or speaker identity",
  "Meeting analytics",
  "Issue, decision, action or risk extraction",
  "Offline LLM/router execution",
  "Listener Mode runtime",
  "Live meeting speaking agent",
  "Voice clone or impersonation",
  "Autonomous decisions",
  "Production secrets or real OpenRouter calls"
] as const;

const oimaOwnedUxSurfaces = [
  "Meeting Library",
  "Upload Meeting",
  "Transcript processing",
  "Optional audio/voice recorder processing",
  "OIS Agent offline meeting analysis",
  "Subject clarification",
  "Decision/action/risk extraction",
  "Meeting dashboard",
  "Monthly operating report",
  "Self-improvement review",
  "Listener Mode future"
] as const;

function sourceModeRules() {
  return {
    primarySourceMode: "TRANSCRIPT_ONLY",
    transcriptFirst: true,
    audioOptional: true,
    transcriptOnlyWorksWithoutAudio: true,
    audioMayEnhanceLater: true,
    audioDoesNotBlockAnalysis: true,
    listenerModeFutureOnly: true,
    listenerModeInitialBoundary: "listen/record/analyze only"
  } as const;
}

function knowledgeIntegration() {
  return {
    sourceOfTruth: "OIS Canonical Knowledge Fabric",
    knowledgeLayerTaxonomy,
    availableLayers: knowledgeLayerTaxonomy.availableLayers,
    universalKnowledgeApi: universalKnowledgeApiContract.endpoint,
    universalKnowledgeApiDisplayName: universalKnowledgeApiContract.displayName,
    universalKnowledgeApiLabel: universalKnowledgeApiContract.label,
    universalKnowledgeApiContract,
    agentKnowledgeContextApi: "/platform/agent/knowledge-context",
    oimaDoesNotOwnCanonicalKnowledge: true,
    noSeparateKnowledgeSourceOfTruth: true
  } as const;
}

function responseBase(metadata: RegistryMetadata) {
  return {
    metadata,
    boundary: stage2HBoundary,
    productShell: stage2JProductShell,
    productBoundaryMetadata: oimaProductBoundaryMetadata,
    productCode: oimaProductContract.productCode,
    productKey: oimaProductContract.productKey,
    productName: oimaProductContract.productName,
    displayName: oimaProductContract.displayName,
    productType: oimaProductContract.productType,
    implementationStatus: oimaProductContract.implementationStatus,
    currentRuntimeCapabilities: oimaCurrentRuntimeCapabilities,
    plannedRuntimeCapabilities: oimaPlannedRuntimeCapabilities,
    poweredBy: oimaProductContract.poweredBy,
    tagline: oimaProductContract.tagline,
    vietnamesePositioning: oimaProductContract.vietnamesePositioning
  };
}

export function buildOimaProductRegistryProjection() {
  const modules = [
    {
      id: "module_oima_product_boundary_shell",
      code: "OIMA_PRODUCT_BOUNDARY_SHELL",
      productCode: "OIMA",
      layerCode: "L0_OPERATIONAL_DATA",
      scope: "ORGANIZATION",
      realmCode: "OIS_ORGANIZATION_USER",
      moduleType: "PRODUCT_RUNTIME_VIEW",
      lifecycle: "ACTIVE",
      version: 1
    }
  ];

  return {
    id: "powered_by_ois_oima",
    code: "OIMA",
    name: oimaProductContract.displayName,
    displayName: oimaProductContract.displayName,
    lifecycle: "ACTIVE",
    version: 1,
    productCode: oimaProductContract.productCode,
    productKey: oimaProductContract.productKey,
    productName: oimaProductContract.productName,
    productType: oimaProductContract.productType,
    implementationStatus: oimaProductContract.implementationStatus,
    productBoundaryMetadata: oimaProductBoundaryMetadata,
    currentRuntimeCapabilities: oimaCurrentRuntimeCapabilities,
    plannedRuntimeCapabilities: oimaPlannedRuntimeCapabilities,
    poweredBy: oimaProductContract.poweredBy,
    adminPath: "/oima",
    runtimePath: "https://oima.dmp247.com",
    capabilityCodes: oimaCapabilityCodes,
    sourceModes: oimaSourceModes,
    sourceModeRules: sourceModeRules(),
    safetyBoundaries: oimaSafetyBoundaries,
    coreReuseMap: oimaCoreReuseMap,
    productShell: stage2JProductShell,
    emptyStateSurfaces: oimaEmptyStateSurfaces,
    knowledgeIntegration: knowledgeIntegration(),
    boundary: stage2HBoundary,
    modules,
    installations: [],
    relationships: {
      modules,
      installations: [],
      projects: [],
      workspaces: []
    }
  };
}

function buildOverview(metadata: RegistryMetadata) {
  return {
    ...responseBase(metadata),
    capabilityCodes: oimaCapabilityCodes,
    sourceModes: oimaSourceModes,
    sourceModeContracts: oimaSourceModeContracts,
    sourceModeRules: sourceModeRules(),
    meetingStatuses: oimaMeetingStatuses,
    analysisModes: oimaAnalysisModes,
    safetyBoundaries: oimaSafetyBoundaries,
    coreReuseMap: oimaCoreReuseMap,
    emptyStateSurfaces: oimaEmptyStateSurfaces,
    ownedUxSurfaces: oimaOwnedUxSurfaces,
    knowledgeIntegration: knowledgeIntegration(),
    roadmap: oimaRoadmap,
    outOfScope: oimaOutOfScope
  };
}

function buildSourceModes(metadata: RegistryMetadata) {
  return {
    ...responseBase(metadata),
    capabilityCodes: oimaCapabilityCodes,
    sourceModes: oimaSourceModes,
    sourceModeContracts: oimaSourceModeContracts,
    sourceModeRules: sourceModeRules(),
    meetingStatuses: oimaMeetingStatuses,
    analysisModes: oimaAnalysisModes,
    safetyBoundaries: oimaSafetyBoundaries,
    coreReuseMap: oimaCoreReuseMap
  };
}

function buildRoadmap(metadata: RegistryMetadata) {
  return {
    ...responseBase(metadata),
    capabilityCodes: oimaCapabilityCodes,
    sourceModes: oimaSourceModes,
    sourceModeContracts: oimaSourceModeContracts,
    sourceModeRules: sourceModeRules(),
    safetyBoundaries: oimaSafetyBoundaries,
    coreReuseMap: oimaCoreReuseMap,
    roadmap: oimaRoadmap,
    ownedUxSurfaces: oimaOwnedUxSurfaces,
    emptyStateSurfaces: oimaEmptyStateSurfaces,
    outOfScope: oimaOutOfScope,
    nextStageCandidates: ["OIS Agent offline analysis contract", "Subject clarification review model", "Evidence-backed meeting insight review payloads"]
  };
}

function buildBoundary(metadata: RegistryMetadata) {
  return {
    ...responseBase(metadata),
    capabilityCodes: oimaCapabilityCodes,
    sourceModes: oimaSourceModes,
    sourceModeContracts: oimaSourceModeContracts,
    coreReuseMap: oimaCoreReuseMap,
    safetyBoundaries: oimaSafetyBoundaries,
    sourceModeRules: sourceModeRules(),
    roadmap: oimaRoadmap,
    ownedUxSurfaces: oimaOwnedUxSurfaces,
    emptyStateSurfaces: oimaEmptyStateSurfaces,
    outOfScope: oimaOutOfScope,
    knowledgeIntegration: knowledgeIntegration(),
    registryProjection: buildOimaProductRegistryProjection(),
    noCanonicalKnowledgeWrite: true,
    autoPromotionEnabled: false,
    oisAgentWidgetDirectCanonicalWriteAllowed: false
  };
}

export function registerStage2HRoutes(app: FastifyInstance, registryMetadata: RegistryMetadataFactory) {
  app.get("/platform/oima/overview", async () => buildOverview(registryMetadata()));
  app.get("/platform/oima/source-modes", async () => buildSourceModes(registryMetadata()));
  app.get("/platform/oima/roadmap", async () => buildRoadmap(registryMetadata()));
  app.get("/platform/oima/boundary", async () => buildBoundary(registryMetadata()));
}
