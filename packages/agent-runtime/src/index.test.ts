import { describe, expect, it } from "vitest";
import {
  defaultLearningPolicies,
  ecosystemProductRegistry,
  evaluateLearningPolicy,
  generateLearningCandidateDraft,
  scoreLearningConfidence
} from "./index";

describe("Powered by OIS product registry", () => {
  it("declares the required Stage 2F product keys", () => {
    expect(ecosystemProductRegistry.map((product) => product.productKey)).toEqual([
      "OIS_PLATFORM",
      "PITS",
      "OIMA",
      "KEIHB",
      "ICR",
      "CSAGENT",
      "FUTURE_PRODUCT",
      "CUSTOM"
    ]);
  });
});

describe("learning confidence and policy evaluation", () => {
  it("boosts CEO/BOD/C-level authority without bypassing review", () => {
    const confidence = scoreLearningConfidence({
      sourceAuthority: "CEO",
      signalType: "STRATEGIC_INTENT",
      evidenceCount: 2,
      hasEntityMatch: true,
      hasConflict: false,
      isSensitive: true
    });
    const decision = evaluateLearningPolicy({
      policyMode: "FULL_AUTO_PILOT",
      confidenceScore: confidence.score,
      confidenceThreshold: 0.7,
      enabled: true,
      conflictStatus: "NO_CONFLICT",
      isSensitive: true
    });

    expect(confidence.score).toBeGreaterThan(0.7);
    expect(decision).toBe("ASK_REVIEW");
  });

  it("auto-learns only when threshold, conflict and sensitivity rules allow it", () => {
    expect(
      evaluateLearningPolicy({
        policyMode: "AUTO_IF_CONFIDENCE",
        confidenceScore: 0.84,
        confidenceThreshold: 0.8,
        enabled: true,
        conflictStatus: "NO_CONFLICT",
        isSensitive: false
      })
    ).toBe("AUTO_LEARN");
    expect(
      evaluateLearningPolicy({
        policyMode: "AUTO_IF_CONFIDENCE",
        confidenceScore: 0.9,
        confidenceThreshold: 0.8,
        enabled: true,
        conflictStatus: "POSSIBLE_CONFLICT",
        isSensitive: false
      })
    ).toBe("ASK_REVIEW");
  });
});

describe("deterministic learning candidate generation", () => {
  it("creates a candidate draft without canonical knowledge writes", () => {
    const policy = defaultLearningPolicies.find((entry) => entry.signalType === "ENTITY_CORRECTION" && entry.sourceAuthority === "SUPERADMIN") ?? null;
    const draft = generateLearningCandidateDraft(
      {
        id: "signal_1",
        productKey: "OIS_PLATFORM",
        learningScope: "ORGANIZATION",
        signalType: "ENTITY_CORRECTION",
        sourceAuthority: "SUPERADMIN",
        rawText: "Emerald Tower is also called Emerald Precinct.",
        relatedEntityRefs: [{ type: "Project", id: "prj_emerald_precinct_demo" }],
        contextJson: { evidence: ["registry", "entity-ref"] }
      },
      policy
    );

    expect(draft.candidateType).toBe("ENTITY_UPDATE");
    expect(draft.policyDecision).toBe("AUTO_LEARN");
    expect(draft.status).toBe("AUTO_LEARNED");
    expect(draft.proposedKnowledgeJson).toMatchObject({
      canonicalWriteAllowed: false,
      extractionMode: "deterministic_stub"
    });
    expect(JSON.stringify(draft.evidenceJson)).toContain("no canonical knowledge write");
  });
});
