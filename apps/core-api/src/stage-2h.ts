import type { FastifyInstance } from "fastify";
import {
  oimaAnalysisModes,
  oimaCapabilityCodes,
  oimaCoreReuseMap,
  oimaMeetingStatuses,
  oimaProductContract,
  oimaRoadmap,
  oimaSafetyBoundaries,
  oimaSourceModeContracts,
  oimaSourceModes
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
  implementationStatus: "PRODUCT_BOUNDARY_READY",
  mode: "deterministic-oima-product-boundary",
  productKey: "OIMA",
  poweredBy: "OIS",
  transcriptFirst: true,
  audioOptional: true,
  listenerModeStatus: "FUTURE_ONLY",
  realLlmCallsEnabled: false,
  uploadPipelineImplemented: false,
  meetingStorageImplemented: false,
  noLiveSpeakingAgent: true,
  noVoiceClone: true,
  noImpersonation: true,
  noAutonomousDecision: true,
  noSeparateKnowledgeSourceOfTruth: true
} as const;

const oimaOutOfScope = [
  "Real meeting upload",
  "Transcript storage/parser",
  "Audio ingestion or speaker identity",
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
    universalKnowledgeApi: "/platform/knowledge/context",
    agentKnowledgeContextApi: "/platform/agent/knowledge-context",
    oimaDoesNotOwnCanonicalKnowledge: true,
    noSeparateKnowledgeSourceOfTruth: true
  } as const;
}

function responseBase(metadata: RegistryMetadata) {
  return {
    metadata,
    boundary: stage2HBoundary,
    productKey: oimaProductContract.productKey,
    displayName: oimaProductContract.displayName,
    productType: oimaProductContract.productType,
    implementationStatus: oimaProductContract.implementationStatus,
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
    lifecycle: "ACTIVE",
    version: 1,
    productKey: oimaProductContract.productKey,
    productType: oimaProductContract.productType,
    implementationStatus: oimaProductContract.implementationStatus,
    poweredBy: oimaProductContract.poweredBy,
    adminPath: "/oima",
    runtimePath: null,
    capabilityCodes: oimaCapabilityCodes,
    sourceModes: oimaSourceModes,
    sourceModeRules: sourceModeRules(),
    safetyBoundaries: oimaSafetyBoundaries,
    coreReuseMap: oimaCoreReuseMap,
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
    outOfScope: oimaOutOfScope,
    nextStageCandidates: ["Meeting intake schema ADR", "Transcript artifact model", "Offline deterministic extraction contract"]
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
