import { describe, expect, it } from "vitest";
import {
  architectureMindmapManifest,
  buildDeterministicKnowledgeContext,
  buildKnowledgeLayerMappingDraft,
  buildKnowledgeReadContract,
  defaultCanonicalKnowledgeItems,
  defaultKeihbProjectionBundles,
  defaultKnowledgeEvidenceLinks,
  inferKnowledgeLayerForCandidate,
  knowledgeLayerDefinitions,
  knowledgeLayerKeys,
  knowledgeLayerTaxonomy
} from "./index";

describe("Stage 2G knowledge layer taxonomy", () => {
  it("declares KL-0 through KL-5 in order", () => {
    expect(knowledgeLayerDefinitions.map((layer) => layer.key)).toEqual(knowledgeLayerKeys);
    expect(knowledgeLayerDefinitions.map((layer) => layer.order)).toEqual([0, 1, 2, 3, 4, 5]);
    expect(knowledgeLayerDefinitions.every((layer) => layer.autoPromotionAllowedInStage2G === false)).toBe(true);
    expect(knowledgeLayerTaxonomy).toMatchObject({
      taxonomyVersion: "stage-2g.v1",
      layerKeys: knowledgeLayerKeys
    });
    expect(knowledgeLayerTaxonomy.availableLayers.map((layer) => layer.key)).toEqual(knowledgeLayerKeys);
  });
});

describe("canonical knowledge seed contracts", () => {
  it("includes sample items for every layer with evidence-ready provenance fields", () => {
    expect(new Set(defaultCanonicalKnowledgeItems.map((item) => item.layerKey))).toEqual(new Set(knowledgeLayerKeys));
    expect(defaultCanonicalKnowledgeItems.every((item) => item.organizationId)).toBe(true);
    expect(defaultCanonicalKnowledgeItems.some((item) => item.status === "DRAFT")).toBe(true);
  });

  it("links evidence to canonical items and learning candidates", () => {
    expect(defaultKnowledgeEvidenceLinks).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ knowledgeItemId: "knowledge_item_kl0_pccc_reference_demo" }),
        expect.objectContaining({ learningCandidateId: "learning_candidate_stage_2g_keihb_sop_demo" })
      ])
    );
  });
});

describe("learning candidate to knowledge layer mapping", () => {
  it("maps SOP candidates into product knowledge packs without promotion", () => {
    const candidate = {
      id: "candidate_1",
      productKey: "KEIHB",
      learningScope: "ORGANIZATION" as const,
      candidateType: "SOP_UPDATE",
      title: "SOP candidate",
      summary: "Publish this SOP through KEIHB after review.",
      proposedKnowledgeJson: { canonicalWriteAllowed: false },
      affectedProducts: ["KEIHB", "PITS"],
      affectedEntities: [{ type: "Workspace", id: "ws_pmc_org_demo" }],
      confidenceScore: 0.77,
      policyDecision: "ASK_REVIEW" as const,
      sourceAuthority: "SUPERADMIN" as const
    };

    expect(inferKnowledgeLayerForCandidate(candidate)).toBe("KL_3_PRODUCT_KNOWLEDGE_PACK");
    expect(buildKnowledgeLayerMappingDraft(candidate)).toMatchObject({
      targetLayerKey: "KL_3_PRODUCT_KNOWLEDGE_PACK",
      targetItemType: "SOP",
      proposedAction: "CREATE",
      status: "READY_FOR_REVIEW",
      proposedContentJson: expect.objectContaining({
        noAutoPromotion: true
      })
    });
  });
});

describe("KEIHB projection bundle contracts", () => {
  it("treats KEIHB as a publishing projection over OIS Knowledge Fabric", () => {
    expect(defaultKeihbProjectionBundles.map((bundle) => bundle.bundleKey)).toEqual([
      "KEIHB_BUILDING_MANAGEMENT_HANDBOOK_DEMO",
      "KEIHB_BQL_SOP_DEMO",
      "KEIHB_RESIDENT_FAQ_DEMO",
      "KEIHB_TECHNICAL_TEAM_PLAYBOOK_DEMO"
    ]);
    expect(defaultKeihbProjectionBundles.every((bundle) => bundle.productKey === "KEIHB")).toBe(true);
    expect(defaultKeihbProjectionBundles.every((bundle) => bundle.manifestJson.sourceOfTruth === "OIS Knowledge Fabric")).toBe(true);
    expect(defaultKeihbProjectionBundles.find((bundle) => bundle.bundleKey === "KEIHB_BQL_SOP_DEMO")?.includedLayerKeys).not.toContain(
      "KL_0_LEGAL_REGULATORY_CORE"
    );
  });
});

describe("deterministic agent knowledge context", () => {
  it("returns read context without LLM calls or canonical writes", () => {
    const context = buildDeterministicKnowledgeContext({
      readContract: buildKnowledgeReadContract({ productKey: "OIS_PLATFORM", includeDrafts: true, includeEvidence: true }),
      items: defaultCanonicalKnowledgeItems,
      evidenceLinks: defaultKnowledgeEvidenceLinks
    });

    expect(context.noLlmCall).toBe(true);
    expect(context.noCanonicalWrite).toBe(true);
    expect(context.items.length).toBeGreaterThan(0);
    expect(context.evidenceLinks.length).toBeGreaterThan(0);
    expect(context.knowledgeLayerTaxonomy.layerKeys).toContain("KL_0_LEGAL_REGULATORY_CORE");
    expect(context.availableLayers.map((layer) => layer.key)).toEqual(knowledgeLayerKeys);
    expect(context.boundary.autoPromotionEnabled).toBe(false);
  });
});

describe("architecture mindmap manifest", () => {
  it("contains Stage 2F and Stage 2G flows for future mindmap agents", () => {
    expect(architectureMindmapManifest.flows.map((flow) => flow.key)).toEqual([
      "stage_2f_learning_flow",
      "stage_2g_knowledge_fabric_flow"
    ]);
    expect(architectureMindmapManifest.governanceCheckpoints).toContain("No auto-promotion in Stage 2G");
  });
});
