import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import {
  agentCapabilities,
  buildAgentChatStubResponse,
  ecosystemProductKeys,
  generateLearningCandidateDraft,
  isSensitiveLearningSignal,
  learningCandidateStatuses,
  learningCandidateTypes,
  learningConflictStatuses,
  learningPolicyDecisions,
  learningPolicyModes,
  learningScopes,
  learningSignalStatuses,
  learningSignalTypes,
  learningSourceTypes,
  normalizeLearningText,
  scoreLearningConfidence,
  sourceAuthorities,
  type EcosystemProductKey,
  type LearningCandidateType,
  type LearningConflictStatus,
  type LearningCandidateStatus,
  type LearningPolicyDecision,
  type LearningPolicyConfig,
  type LearningScope,
  type LearningSignalStatus,
  type LearningSignalType,
  type LearningSourceType,
  type SourceAuthority
} from "@ois/agent-runtime";

type RegistryMetadata = {
  source: string;
  mode: string;
  environment: string;
  generatedAt: string;
};

type RegistryMetadataFactory = () => RegistryMetadata;

type OisLearningSignalRow = {
  id: string;
  organizationId: string;
  workspaceId: string | null;
  productKey: string;
  sourceType: LearningSourceType;
  sourceAuthority: SourceAuthority;
  learningScope: LearningScope;
  signalType: LearningSignalType;
  rawText: string;
  normalizedText: string;
  contextJson: Record<string, unknown>;
  relatedEntityRefs: unknown[];
  submittedBy: string | null;
  userId: string | null;
  confidenceInitial: number;
  status: LearningSignalStatus;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type OisLearningPolicyRow = LearningPolicyConfig & {
  id: string;
  organizationId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type OisLearningCandidateRow = {
  id: string;
  signalId: string;
  organizationId: string;
  workspaceId: string | null;
  productKey: string;
  learningScope: LearningScope;
  candidateType: LearningCandidateType;
  title: string;
  summary: string;
  proposedKnowledgeJson: Record<string, unknown>;
  affectedProducts: string[];
  affectedEntities: unknown[];
  sourceAuthority: SourceAuthority;
  confidenceScore: number;
  confidenceBreakdownJson: Record<string, unknown>;
  conflictStatus: LearningConflictStatus;
  policyDecision: LearningPolicyDecision;
  status: LearningCandidateStatus;
  evidenceJson: Record<string, unknown>;
  reviewerId: string | null;
  reviewedAt: Date | string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type OisAgentLearningSubmissionRow = {
  id: string;
  organizationId: string;
  workspaceId: string | null;
  productKey: string;
  sessionId: string | null;
  signalId: string | null;
  sourceAuthority: SourceAuthority;
  learningScope: LearningScope;
  signalType: LearningSignalType;
  rawText: string;
  status: LearningSignalStatus;
  submittedBy: string | null;
  userId: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
};

type CreateArgs<T> = { data: T };
type UpdateArgs<T> = { where: { id: string }; data: Partial<T> };
type FindUniqueArgs = { where: { id: string } };

export type Stage2FPrisma = {
  auditRecord: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<unknown>;
  };
  oisEcosystemProduct: {
    findMany(args?: Record<string, unknown>): Promise<Array<Record<string, unknown>>>;
  };
  oisLearningPolicy: {
    findMany(args?: Record<string, unknown>): Promise<OisLearningPolicyRow[]>;
    update(args: UpdateArgs<OisLearningPolicyRow>): Promise<OisLearningPolicyRow>;
  };
  oisLearningSignal: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<OisLearningSignalRow>;
    findMany(args?: Record<string, unknown>): Promise<OisLearningSignalRow[]>;
    findUnique(args: FindUniqueArgs): Promise<OisLearningSignalRow | null>;
    update(args: UpdateArgs<OisLearningSignalRow>): Promise<OisLearningSignalRow>;
  };
  oisLearningCandidate: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<OisLearningCandidateRow>;
    findMany(args?: Record<string, unknown>): Promise<OisLearningCandidateRow[]>;
    findUnique(args: FindUniqueArgs): Promise<OisLearningCandidateRow | null>;
    update(args: UpdateArgs<OisLearningCandidateRow>): Promise<OisLearningCandidateRow>;
  };
  oisAgentLearningSubmission: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<OisAgentLearningSubmissionRow>;
  };
};

const productKeySchema = z.enum(ecosystemProductKeys);
const learningScopeSchema = z.enum(learningScopes);
const sourceAuthoritySchema = z.enum(sourceAuthorities);
const sourceTypeSchema = z.enum(learningSourceTypes);
const signalTypeSchema = z.enum(learningSignalTypes);
const adminRoleSchema = z.enum(["SUPERADMIN", "ADMIN"]);
const jsonRecordSchema = z.record(z.unknown());

const learningSignalInputSchema = z.object({
  organizationId: z.string().min(1),
  workspaceId: z.string().min(1).optional(),
  productKey: productKeySchema,
  sourceType: sourceTypeSchema.default("WIDGET"),
  sourceAuthority: sourceAuthoritySchema.default("UNKNOWN"),
  learningScope: learningScopeSchema.default("ORGANIZATION"),
  signalType: signalTypeSchema.default("OTHER"),
  rawText: z.string().min(1),
  contextJson: jsonRecordSchema.default({}),
  relatedEntityRefs: z.array(z.unknown()).default([]),
  submittedBy: z.string().min(1).optional(),
  userId: z.string().min(1).optional()
});

const candidateReviewSchema = z.object({
  action: z.enum(["APPROVE", "REJECT"]),
  reviewerId: z.string().min(1),
  reviewerRole: adminRoleSchema
});

const policyUpdateSchema = z
  .object({
    confidenceThreshold: z.number().min(0).max(1).optional(),
    enabled: z.boolean().optional(),
    actorId: z.string().min(1).optional(),
    actorRole: adminRoleSchema
  })
  .refine((value) => value.confidenceThreshold !== undefined || value.enabled !== undefined, {
    message: "confidenceThreshold or enabled is required"
  });

const agentChatSchema = z.object({
  organizationId: z.string().min(1),
  workspaceId: z.string().min(1).optional(),
  productKey: productKeySchema,
  currentRoute: z.string().optional(),
  screen: z.string().optional(),
  currentEntityRefs: z.array(z.unknown()).default([]),
  userRole: z.string().optional(),
  permissionContextJson: jsonRecordSchema.default({}),
  question: z.string().min(1),
  locale: z.string().optional()
});

const agentLearningSubmissionSchema = learningSignalInputSchema.extend({
  sessionId: z.string().min(1).optional()
});

function asProductKey(productKey: string): EcosystemProductKey {
  return ecosystemProductKeys.includes(productKey as EcosystemProductKey) ? (productKey as EcosystemProductKey) : "CUSTOM";
}

function replyNotFound(reply: FastifyReply, metadata: RegistryMetadata, entity: string, lookup: Record<string, string>) {
  return reply.code(404).send({
    metadata,
    error: {
      code: "NOT_FOUND",
      entity,
      lookup,
      message: `${entity} not found`
    }
  });
}

function evidenceCount(contextJson: Record<string, unknown>) {
  return Array.isArray(contextJson.evidence) ? contextJson.evidence.length : 0;
}

function hasConflict(contextJson: Record<string, unknown>) {
  return Boolean(contextJson.conflictFlag);
}

function isExecutiveCandidate(candidate: OisLearningCandidateRow) {
  return (
    ["CEO", "CHAIRMAN", "BOD", "C_LEVEL"].includes(candidate.sourceAuthority) ||
    ["EXECUTIVE_DIRECTIVE", "STRATEGIC_PRIORITY", "MANAGEMENT_PRINCIPLE", "EXECUTIVE_CONCERN", "MISALIGNMENT_SIGNAL"].includes(
      candidate.candidateType
    )
  );
}

function summarizeCenter(signals: OisLearningSignalRow[], candidates: OisLearningCandidateRow[], policies: OisLearningPolicyRow[]) {
  const countCandidates = (status: LearningCandidateStatus) => candidates.filter((candidate) => candidate.status === status).length;
  const ignoredSignals = signals.filter((signal) => signal.status === "IGNORED").length;
  const rejectedCandidates = countCandidates("REJECTED");
  const productContributionMap = ecosystemProductKeys.map((productKey) => ({
    productKey,
    signalCount: signals.filter((signal) => signal.productKey === productKey).length,
    candidateCount: candidates.filter((candidate) => candidate.productKey === productKey).length
  }));

  return {
    overview: {
      totalSignals: signals.length,
      pendingCandidates: countCandidates("PENDING_REVIEW"),
      autoLearnedLogs: countCandidates("AUTO_LEARNED"),
      rejectedOrIgnored: rejectedCandidates + ignoredSignals,
      policyCount: policies.length
    },
    learningStream: signals.slice(0, 20),
    pendingReview: candidates.filter((candidate) => candidate.status === "PENDING_REVIEW").slice(0, 20),
    learningPolicies: policies,
    executiveIntentQueue: candidates.filter(isExecutiveCandidate).slice(0, 20),
    productContributionMap,
    auditLogPlaceholder: {
      mode: "existing-audit-records",
      note: "Learning writes create AuditRecord entries; Stage 2F UI shows this placeholder until a dedicated audit stream filter is added."
    },
    accessGuard: {
      requiredRole: "SUPERADMIN_OR_ADMIN",
      currentStageMode: "READ_ONLY_PREVIEW_WITH_API_ROLE_CHECKS",
      limitation: "No session middleware exists yet, so SuperAdmin enforcement is documented and mutation endpoints require explicit admin role payloads."
    }
  };
}

async function auditLearningWrite(
  prisma: Stage2FPrisma,
  input: {
    organizationId: string;
    workspaceId?: string | null | undefined;
    actorId?: string | null | undefined;
    action: string;
    targetType: string;
    targetId: string;
    sensitive: boolean;
    metadata: Record<string, unknown>;
  }
) {
  await prisma.auditRecord.create({
    data: {
      id: `audit_stage_2f_${randomUUID()}`,
      organizationId: input.organizationId,
      ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}),
      ...(input.actorId ? { actorId: input.actorId } : {}),
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      sensitive: input.sensitive,
      metadata: {
        stage: "Stage 2F",
        ...input.metadata
      }
    }
  });
}

async function findPolicy(prisma: Stage2FPrisma, signal: OisLearningSignalRow): Promise<LearningPolicyConfig | null> {
  const policies = await prisma.oisLearningPolicy.findMany({
    where: {
      organizationId: signal.organizationId,
      productKey: signal.productKey,
      learningScope: signal.learningScope,
      signalType: signal.signalType,
      sourceAuthority: signal.sourceAuthority
    },
    take: 1
  });
  const policy = policies[0];

  return policy
    ? {
        productKey: asProductKey(policy.productKey),
        learningScope: policy.learningScope,
        signalType: policy.signalType,
        sourceAuthority: policy.sourceAuthority,
        policyMode: policy.policyMode,
        confidenceThreshold: policy.confidenceThreshold,
        enabled: policy.enabled
      }
    : null;
}

async function createLearningSignal(prisma: Stage2FPrisma, input: z.infer<typeof learningSignalInputSchema>) {
  const normalizedText = normalizeLearningText(input.rawText);
  const sensitive = isSensitiveLearningSignal({ signalType: input.signalType, rawText: input.rawText });
  const confidence = scoreLearningConfidence({
    sourceAuthority: input.sourceAuthority,
    signalType: input.signalType,
    evidenceCount: evidenceCount(input.contextJson),
    hasEntityMatch: input.relatedEntityRefs.length > 0,
    hasConflict: hasConflict(input.contextJson),
    isSensitive: sensitive
  });
  const signal = await prisma.oisLearningSignal.create({
    data: {
      id: `learning_signal_${randomUUID()}`,
      organizationId: input.organizationId,
      ...(input.workspaceId ? { workspaceId: input.workspaceId } : {}),
      productKey: input.productKey,
      sourceType: input.sourceType,
      sourceAuthority: input.sourceAuthority,
      learningScope: input.learningScope,
      signalType: input.signalType,
      rawText: input.rawText,
      normalizedText,
      contextJson: input.contextJson,
      relatedEntityRefs: input.relatedEntityRefs,
      ...(input.submittedBy ? { submittedBy: input.submittedBy } : {}),
      ...(input.userId ? { userId: input.userId } : {}),
      confidenceInitial: confidence.score,
      status: "RECEIVED"
    }
  });

  await auditLearningWrite(prisma, {
    organizationId: signal.organizationId,
    workspaceId: signal.workspaceId,
    actorId: signal.userId,
    action: "OIS_LEARNING_SIGNAL_CREATED",
    targetType: "OisLearningSignal",
    targetId: signal.id,
    sensitive,
    metadata: {
      productKey: signal.productKey,
      sourceAuthority: signal.sourceAuthority,
      signalType: signal.signalType,
      confidenceInitial: signal.confidenceInitial
    }
  });

  return signal;
}

async function createCandidateFromSignal(prisma: Stage2FPrisma, signal: OisLearningSignalRow) {
  const policy = await findPolicy(prisma, signal);
  const confidence = scoreLearningConfidence({
    sourceAuthority: signal.sourceAuthority,
    signalType: signal.signalType,
    evidenceCount: evidenceCount(signal.contextJson),
    hasEntityMatch: signal.relatedEntityRefs.length > 0,
    hasConflict: hasConflict(signal.contextJson),
    isSensitive: isSensitiveLearningSignal({ signalType: signal.signalType, rawText: signal.rawText })
  });
  const draft = generateLearningCandidateDraft(
    {
      id: signal.id,
      productKey: asProductKey(signal.productKey),
      learningScope: signal.learningScope,
      signalType: signal.signalType,
      sourceAuthority: signal.sourceAuthority,
      rawText: signal.rawText,
      normalizedText: signal.normalizedText,
      contextJson: signal.contextJson,
      relatedEntityRefs: signal.relatedEntityRefs
    },
    policy,
    confidence
  );
  const candidate = await prisma.oisLearningCandidate.create({
    data: {
      id: `learning_candidate_${randomUUID()}`,
      signalId: signal.id,
      organizationId: signal.organizationId,
      ...(signal.workspaceId ? { workspaceId: signal.workspaceId } : {}),
      productKey: signal.productKey,
      learningScope: signal.learningScope,
      candidateType: draft.candidateType,
      title: draft.title,
      summary: draft.summary,
      proposedKnowledgeJson: draft.proposedKnowledgeJson,
      affectedProducts: draft.affectedProducts,
      affectedEntities: draft.affectedEntities,
      sourceAuthority: draft.sourceAuthority,
      confidenceScore: draft.confidenceScore,
      confidenceBreakdownJson: draft.confidenceBreakdownJson,
      conflictStatus: draft.conflictStatus,
      policyDecision: draft.policyDecision,
      status: draft.status,
      evidenceJson: draft.evidenceJson
    }
  });

  await prisma.oisLearningSignal.update({
    where: { id: signal.id },
    data: { status: "CANDIDATE_CREATED" }
  });

  await auditLearningWrite(prisma, {
    organizationId: candidate.organizationId,
    workspaceId: candidate.workspaceId,
    action: "OIS_LEARNING_CANDIDATE_CREATED",
    targetType: "OisLearningCandidate",
    targetId: candidate.id,
    sensitive: isSensitiveLearningSignal({ signalType: signal.signalType, rawText: signal.rawText }),
    metadata: {
      productKey: candidate.productKey,
      policyDecision: candidate.policyDecision,
      status: candidate.status,
      canonicalKnowledgeWrite: false
    }
  });

  return candidate;
}

export function registerStage2FRoutes(app: FastifyInstance, prisma: Stage2FPrisma, registryMetadata: RegistryMetadataFactory) {
  app.get("/platform/ecosystem-products", async () => ({
    metadata: registryMetadata(),
    products: await prisma.oisEcosystemProduct.findMany({ orderBy: { productKey: "asc" } }),
    supportedAgentCapabilities: agentCapabilities
  }));

  app.get("/platform/learning/signals", async () => ({
    metadata: registryMetadata(),
    signals: await prisma.oisLearningSignal.findMany({ orderBy: { createdAt: "desc" }, take: 100 })
  }));

  app.post("/platform/learning/signals", async (request) => {
    const body = learningSignalInputSchema.parse(request.body);
    const signal = await createLearningSignal(prisma, body);

    return {
      metadata: registryMetadata(),
      signal,
      noCanonicalKnowledgeWrite: true
    };
  });

  app.post("/platform/learning/signals/:signalId/candidates", async (request, reply) => {
    const params = request.params as { signalId: string };
    const signal = await prisma.oisLearningSignal.findUnique({ where: { id: params.signalId } });

    if (!signal) {
      return replyNotFound(reply, registryMetadata(), "learningSignal", { id: params.signalId });
    }

    const candidate = await createCandidateFromSignal(prisma, signal);

    return {
      metadata: registryMetadata(),
      candidate,
      noCanonicalKnowledgeWrite: true
    };
  });

  app.get("/platform/learning/candidates", async () => ({
    metadata: registryMetadata(),
    candidates: await prisma.oisLearningCandidate.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
    candidateStatuses: learningCandidateStatuses,
    policyDecisions: learningPolicyDecisions,
    conflictStatuses: learningConflictStatuses,
    candidateTypes: learningCandidateTypes
  }));

  app.patch("/platform/learning/candidates/:id/review", async (request, reply) => {
    const params = request.params as { id: string };
    const body = candidateReviewSchema.parse(request.body);
    const existing = await prisma.oisLearningCandidate.findUnique({ where: { id: params.id } });

    if (!existing) {
      return replyNotFound(reply, registryMetadata(), "learningCandidate", { id: params.id });
    }

    const candidate = await prisma.oisLearningCandidate.update({
      where: { id: params.id },
      data: {
        status: body.action === "APPROVE" ? "APPROVED" : "REJECTED",
        reviewerId: body.reviewerId,
        reviewedAt: new Date()
      }
    });

    await auditLearningWrite(prisma, {
      organizationId: candidate.organizationId,
      workspaceId: candidate.workspaceId,
      actorId: body.reviewerId,
      action: body.action === "APPROVE" ? "OIS_LEARNING_CANDIDATE_APPROVED" : "OIS_LEARNING_CANDIDATE_REJECTED",
      targetType: "OisLearningCandidate",
      targetId: candidate.id,
      sensitive: true,
      metadata: {
        reviewerRole: body.reviewerRole,
        candidateStatus: candidate.status,
        canonicalKnowledgeWrite: false
      }
    });

    return {
      metadata: registryMetadata(),
      candidate,
      noCanonicalKnowledgeWrite: true
    };
  });

  app.get("/platform/learning/policies", async () => ({
    metadata: registryMetadata(),
    policyModes: learningPolicyModes,
    policies: await prisma.oisLearningPolicy.findMany({ orderBy: [{ productKey: "asc" }, { signalType: "asc" }] })
  }));

  app.patch("/platform/learning/policies/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const body = policyUpdateSchema.parse(request.body);
    const policy = await prisma.oisLearningPolicy.update({
      where: { id: params.id },
      data: {
        ...(body.confidenceThreshold !== undefined ? { confidenceThreshold: body.confidenceThreshold } : {}),
        ...(body.enabled !== undefined ? { enabled: body.enabled } : {})
      }
    });

    await auditLearningWrite(prisma, {
      organizationId: policy.organizationId,
      actorId: body.actorId,
      action: "OIS_LEARNING_POLICY_UPDATED",
      targetType: "OisLearningPolicy",
      targetId: policy.id,
      sensitive: true,
      metadata: {
        actorRole: body.actorRole,
        confidenceThreshold: policy.confidenceThreshold,
        enabled: policy.enabled
      }
    });

    return reply.send({
      metadata: registryMetadata(),
      policy
    });
  });

  app.get("/platform/learning/center", async () => {
    const [products, signals, candidates, policies] = await Promise.all([
      prisma.oisEcosystemProduct.findMany({ orderBy: { productKey: "asc" } }),
      prisma.oisLearningSignal.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.oisLearningCandidate.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
      prisma.oisLearningPolicy.findMany({ orderBy: [{ productKey: "asc" }, { signalType: "asc" }] })
    ]);

    return {
      metadata: registryMetadata(),
      products,
      ...summarizeCenter(signals, candidates, policies)
    };
  });

  app.post("/platform/agent/chat", async (request) => {
    const body = agentChatSchema.parse(request.body);

    return {
      metadata: registryMetadata(),
      runtime: {
        mode: "deterministic-agent-chat-stub",
        noLlmCall: true,
        productKey: body.productKey,
        organizationId: body.organizationId,
        workspaceId: body.workspaceId ?? null,
        locale: body.locale ?? null,
        currentEntityRefs: body.currentEntityRefs,
        permissionContextJson: body.permissionContextJson
      },
      response: buildAgentChatStubResponse({
        productKey: body.productKey,
        currentRoute: body.currentRoute,
        screen: body.screen,
        question: body.question
      })
    };
  });

  app.post("/platform/agent/learning-submissions", async (request) => {
    const body = agentLearningSubmissionSchema.parse(request.body);
    const signal = await createLearningSignal(prisma, body);
    const submission = await prisma.oisAgentLearningSubmission.create({
      data: {
        id: `agent_learning_submission_${randomUUID()}`,
        organizationId: body.organizationId,
        ...(body.workspaceId ? { workspaceId: body.workspaceId } : {}),
        productKey: body.productKey,
        ...(body.sessionId ? { sessionId: body.sessionId } : {}),
        signalId: signal.id,
        sourceAuthority: body.sourceAuthority,
        learningScope: body.learningScope,
        signalType: body.signalType,
        rawText: body.rawText,
        status: "RECEIVED",
        ...(body.submittedBy ? { submittedBy: body.submittedBy } : {}),
        ...(body.userId ? { userId: body.userId } : {})
      }
    });

    await auditLearningWrite(prisma, {
      organizationId: body.organizationId,
      workspaceId: body.workspaceId,
      actorId: body.userId,
      action: "OIS_AGENT_LEARNING_SUBMISSION_CREATED",
      targetType: "OisAgentLearningSubmission",
      targetId: submission.id,
      sensitive: isSensitiveLearningSignal({ signalType: body.signalType, rawText: body.rawText }),
      metadata: {
        productKey: body.productKey,
        signalId: signal.id,
        canonicalKnowledgeWrite: false
      }
    });

    return {
      metadata: registryMetadata(),
      submission,
      signal,
      noCanonicalKnowledgeWrite: true
    };
  });
}
