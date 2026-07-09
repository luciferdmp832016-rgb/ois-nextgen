import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import { ecosystemProductKeys, type EcosystemProductKey } from "@ois/agent-runtime";
import {
  architectureMindmapManifest,
  buildDeterministicKnowledgeContext,
  buildKnowledgeLayerMappingDraft,
  buildKnowledgeReadContract,
  defaultKnowledgeReadContractExample,
  knowledgeItemStatuses,
  knowledgeItemTypes,
  knowledgeLayerDefinitions,
  knowledgeLayerKeys,
  knowledgeLayerTaxonomy,
  knowledgeLayerMappingStatusTaxonomy,
  knowledgeLayerMappingStatuses,
  knowledgePromotionActions,
  productKnowledgeConsumptionMap,
  type CanonicalKnowledgeItemContract,
  type KnowledgeEvidenceLinkContract,
  type KnowledgeLayerMappingContract,
  type KnowledgeProjectionBundleContract,
  type KnowledgeReadContract,
  type LearningCandidateForLayerMapping
} from "@ois/knowledge-fabric";

type RegistryMetadata = {
  source: string;
  mode: string;
  environment: string;
  generatedAt: string;
};

type RegistryMetadataFactory = () => RegistryMetadata;

type Dateish = Date | string;
type FindManyArgs = Record<string, unknown>;
type FindUniqueArgs = { where: { id: string } };
type CreateArgs<T> = { data: T };
type UpdateArgs<T> = { where: { id: string }; data: Partial<T> };

type CanonicalKnowledgeItemRow = CanonicalKnowledgeItemContract & {
  createdAt?: Dateish;
  updatedAt?: Dateish;
};

type KnowledgeEvidenceLinkRow = KnowledgeEvidenceLinkContract & {
  createdAt?: Dateish;
};

type KnowledgeLayerMappingRow = KnowledgeLayerMappingContract & {
  createdAt?: Dateish;
  updatedAt?: Dateish;
};

type KnowledgeProjectionBundleRow = KnowledgeProjectionBundleContract & {
  createdAt?: Dateish;
  updatedAt?: Dateish;
};

type LearningCandidateRow = LearningCandidateForLayerMapping & {
  organizationId: string;
  workspaceId: string | null;
  createdAt?: Dateish;
  updatedAt?: Dateish;
};

export type Stage2GPrisma = {
  auditRecord: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<unknown>;
  };
  oisCanonicalKnowledgeItem: {
    findMany(args?: FindManyArgs): Promise<CanonicalKnowledgeItemRow[]>;
    findUnique(args: FindUniqueArgs): Promise<CanonicalKnowledgeItemRow | null>;
  };
  oisKnowledgeEvidenceLink: {
    findMany(args?: FindManyArgs): Promise<KnowledgeEvidenceLinkRow[]>;
  };
  oisKnowledgeLayerMapping: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<KnowledgeLayerMappingRow>;
    findMany(args?: FindManyArgs): Promise<KnowledgeLayerMappingRow[]>;
    findUnique(args: FindUniqueArgs): Promise<KnowledgeLayerMappingRow | null>;
    update(args: UpdateArgs<KnowledgeLayerMappingRow>): Promise<KnowledgeLayerMappingRow>;
  };
  oisKnowledgeProjectionBundle: {
    findMany(args?: FindManyArgs): Promise<KnowledgeProjectionBundleRow[]>;
    findUnique(args: FindUniqueArgs): Promise<KnowledgeProjectionBundleRow | null>;
  };
  oisLearningCandidate: {
    findUnique(args: FindUniqueArgs): Promise<LearningCandidateRow | null>;
  };
};

const productKeySchema = z.enum(ecosystemProductKeys);
const knowledgeLayerSchema = z.enum(knowledgeLayerKeys);
const knowledgeItemTypeSchema = z.enum(knowledgeItemTypes);
const knowledgeItemStatusSchema = z.enum(knowledgeItemStatuses);
const promotionActionSchema = z.enum(knowledgePromotionActions);
const mappingStatusSchema = z.enum(knowledgeLayerMappingStatuses);
const adminRoleSchema = z.enum(["SUPERADMIN", "ADMIN"]);

const knowledgeItemQuerySchema = z.object({
  layerKey: knowledgeLayerSchema.optional(),
  status: knowledgeItemStatusSchema.optional(),
  productKey: productKeySchema.optional(),
  organizationId: z.string().min(1).optional(),
  workspaceId: z.string().min(1).optional(),
  take: z.coerce.number().int().min(1).max(100).default(100)
});

const evidenceQuerySchema = z.object({
  knowledgeItemId: z.string().min(1).optional(),
  learningCandidateId: z.string().min(1).optional(),
  sourceType: z.string().min(1).optional(),
  take: z.coerce.number().int().min(1).max(100).default(100)
});

const layerMappingRequestSchema = z.object({
  targetLayerKey: knowledgeLayerSchema.optional(),
  targetItemType: knowledgeItemTypeSchema.optional(),
  proposedAction: promotionActionSchema.optional(),
  status: mappingStatusSchema.optional(),
  actorId: z.string().min(1).optional(),
  actorRole: adminRoleSchema.default("SUPERADMIN")
});

const readContractSchema = z.object({
  productKey: productKeySchema.default("OIS_PLATFORM"),
  organizationId: z.string().min(1).optional(),
  workspaceId: z.string().min(1).optional(),
  projectId: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  audience: z.string().min(1).optional(),
  locale: z.string().min(1).optional(),
  query: z.string().min(1).optional(),
  requestedLayers: z.array(knowledgeLayerSchema).optional(),
  entityRefs: z.array(z.unknown()).optional(),
  includeEvidence: z.boolean().default(true),
  includeDrafts: z.boolean().default(false),
  maxItems: z.number().int().min(1).max(50).default(10)
});

const readContractQuerySchema = z.object({
  productKey: productKeySchema.default("OIS_PLATFORM"),
  organizationId: z.string().min(1).optional(),
  workspaceId: z.string().min(1).optional(),
  projectId: z.string().min(1).optional(),
  role: z.string().min(1).optional(),
  audience: z.string().min(1).optional(),
  locale: z.string().min(1).optional(),
  query: z.string().min(1).optional(),
  requestedLayers: z
    .preprocess(
      (value) => (typeof value === "string" ? value.split(",").filter(Boolean) : value),
      z.array(knowledgeLayerSchema).optional()
    )
    .optional(),
  includeEvidence: z.coerce.boolean().default(true),
  includeDrafts: z.coerce.boolean().default(false),
  maxItems: z.coerce.number().int().min(1).max(50).default(10)
});

const stage2GBoundary = {
  stage: "Stage 2G",
  mode: "deterministic-knowledge-fabric-foundation",
  canonicalWriteEndpointsAdded: false,
  autoPromotionEnabled: false,
  widgetDirectCanonicalWriteAllowed: false,
  mutationBoundary: "Learning Candidate to Knowledge Layer Mapping only; every mapping write is audited."
} as const;

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

function maybeProductKey(productKey: string | null): EcosystemProductKey | null {
  return ecosystemProductKeys.includes(productKey as EcosystemProductKey) ? (productKey as EcosystemProductKey) : null;
}

function toCanonicalKnowledgeItem(row: CanonicalKnowledgeItemRow): CanonicalKnowledgeItemContract {
  return {
    id: row.id,
    layerKey: row.layerKey,
    scope: row.scope,
    itemType: row.itemType,
    title: row.title,
    summary: row.summary,
    contentJson: row.contentJson,
    status: row.status,
    version: row.version,
    locale: row.locale,
    organizationId: row.organizationId,
    workspaceId: row.workspaceId,
    industryCode: row.industryCode,
    productKey: maybeProductKey(row.productKey),
    entityRefs: row.entityRefs,
    relatedEntityIds: row.relatedEntityIds,
    sensitivityLevel: row.sensitivityLevel,
    confidenceScore: row.confidenceScore,
    sourceAuthority: row.sourceAuthority,
    createdFromCandidateId: row.createdFromCandidateId
  };
}

function toEvidenceLink(row: KnowledgeEvidenceLinkRow): KnowledgeEvidenceLinkContract {
  return {
    id: row.id,
    knowledgeItemId: row.knowledgeItemId,
    learningCandidateId: row.learningCandidateId,
    sourceType: row.sourceType,
    sourceRef: row.sourceRef,
    sourceTitle: row.sourceTitle,
    excerpt: row.excerpt,
    excerptHash: row.excerptHash,
    evidenceWeight: row.evidenceWeight,
    sourceAuthority: row.sourceAuthority
  };
}

function toKnowledgeLayerMapping(row: KnowledgeLayerMappingRow): KnowledgeLayerMappingContract {
  return {
    id: row.id,
    learningCandidateId: row.learningCandidateId,
    targetLayerKey: row.targetLayerKey,
    targetItemType: row.targetItemType,
    proposedAction: row.proposedAction,
    proposedTitle: row.proposedTitle,
    proposedSummary: row.proposedSummary,
    proposedContentJson: row.proposedContentJson,
    affectedProducts: row.affectedProducts,
    affectedEntities: row.affectedEntities,
    confidenceScore: row.confidenceScore,
    policyDecision: row.policyDecision,
    status: row.status
  };
}

function toProjectionBundle(row: KnowledgeProjectionBundleRow): KnowledgeProjectionBundleContract {
  return {
    id: row.id,
    bundleKey: row.bundleKey,
    displayName: row.displayName,
    productKey: row.productKey,
    targetAudience: row.targetAudience,
    role: row.role,
    locale: row.locale,
    includedLayerKeys: row.includedLayerKeys,
    includedItemIds: row.includedItemIds,
    selectionRules: row.selectionRules,
    snapshotVersion: row.snapshotVersion,
    status: row.status,
    manifestJson: row.manifestJson
  };
}

function buildWhere(entries: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(entries).filter(([, value]) => value !== undefined));
}

function summarizeKnowledgeItems(items: CanonicalKnowledgeItemContract[]) {
  return {
    totalItems: items.length,
    activeItems: items.filter((item) => item.status === "ACTIVE").length,
    draftItems: items.filter((item) => item.status === "DRAFT").length,
    byLayer: knowledgeLayerDefinitions.map((layer) => ({
      layerKey: layer.key,
      displayName: layer.displayName,
      count: items.filter((item) => item.layerKey === layer.key).length
    }))
  };
}

function buildReadContract(input: z.infer<typeof readContractSchema> | z.infer<typeof readContractQuerySchema>): KnowledgeReadContract {
  const readContract: Partial<KnowledgeReadContract> = {
    productKey: input.productKey,
    includeEvidence: input.includeEvidence,
    includeDrafts: input.includeDrafts,
    maxItems: input.maxItems
  };

  if (input.organizationId) readContract.organizationId = input.organizationId;
  if (input.workspaceId) readContract.workspaceId = input.workspaceId;
  if (input.projectId) readContract.projectId = input.projectId;
  if (input.role) readContract.role = input.role;
  if (input.audience) readContract.audience = input.audience;
  if (input.locale) readContract.locale = input.locale;
  if (input.query) readContract.query = input.query;
  if (input.requestedLayers) readContract.requestedLayers = input.requestedLayers;
  if ("entityRefs" in input && input.entityRefs) readContract.entityRefs = input.entityRefs;

  return buildKnowledgeReadContract(readContract);
}

async function readKnowledgeItems(prisma: Stage2GPrisma, query: z.infer<typeof knowledgeItemQuerySchema>) {
  const rows = await prisma.oisCanonicalKnowledgeItem.findMany({
    where: buildWhere({
      layerKey: query.layerKey,
      status: query.status,
      productKey: query.productKey,
      organizationId: query.organizationId,
      workspaceId: query.workspaceId
    }),
    orderBy: [{ layerKey: "asc" }, { title: "asc" }],
    take: query.take
  });

  return rows.map(toCanonicalKnowledgeItem);
}

async function readEvidenceLinks(prisma: Stage2GPrisma, query: z.infer<typeof evidenceQuerySchema>) {
  const rows = await prisma.oisKnowledgeEvidenceLink.findMany({
    where: buildWhere({
      knowledgeItemId: query.knowledgeItemId,
      learningCandidateId: query.learningCandidateId,
      sourceType: query.sourceType
    }),
    orderBy: { createdAt: "desc" },
    take: query.take
  });

  return rows.map(toEvidenceLink);
}

async function readKnowledgeContext(prisma: Stage2GPrisma, readContract: KnowledgeReadContract) {
  const [itemRows, evidenceRows] = await Promise.all([
    prisma.oisCanonicalKnowledgeItem.findMany({
      where: buildWhere({
        organizationId: readContract.organizationId,
        workspaceId: readContract.workspaceId,
        status: readContract.includeDrafts ? undefined : "ACTIVE"
      }),
      orderBy: [{ layerKey: "asc" }, { title: "asc" }],
      take: readContract.maxItems ?? 10
    }),
    readContract.includeEvidence
      ? prisma.oisKnowledgeEvidenceLink.findMany({ orderBy: { createdAt: "desc" }, take: readContract.maxItems ?? 10 })
      : Promise.resolve([])
  ]);

  return buildDeterministicKnowledgeContext({
    readContract,
    items: itemRows.map(toCanonicalKnowledgeItem),
    evidenceLinks: evidenceRows.map(toEvidenceLink)
  });
}

async function auditKnowledgeMapping(
  prisma: Stage2GPrisma,
  input: {
    candidate: LearningCandidateRow;
    mapping: KnowledgeLayerMappingContract;
    actorId?: string | undefined;
    actorRole: string;
    action: string;
  }
) {
  await prisma.auditRecord.create({
    data: {
      id: `audit_stage_2g_${randomUUID()}`,
      organizationId: input.candidate.organizationId,
      ...(input.candidate.workspaceId ? { workspaceId: input.candidate.workspaceId } : {}),
      ...(input.actorId ? { actorId: input.actorId } : {}),
      action: input.action,
      targetType: "OisKnowledgeLayerMapping",
      targetId: input.mapping.id,
      sensitive: true,
      metadata: {
        stage: "Stage 2G",
        actorRole: input.actorRole,
        learningCandidateId: input.candidate.id,
        targetLayerKey: input.mapping.targetLayerKey,
        targetItemType: input.mapping.targetItemType,
        proposedAction: input.mapping.proposedAction,
        mappingStatus: input.mapping.status,
        canonicalKnowledgeWrite: false,
        autoPromotionEnabled: false,
        noWidgetDirectCanonicalWrite: true
      }
    }
  });
}

function applyLayerMappingOverrides(
  draft: Omit<KnowledgeLayerMappingContract, "id">,
  body: z.infer<typeof layerMappingRequestSchema>
): Omit<KnowledgeLayerMappingContract, "id"> {
  const targetLayerKey = body.targetLayerKey ?? draft.targetLayerKey;
  const targetItemType = body.targetItemType ?? draft.targetItemType;
  const proposedAction = body.proposedAction ?? draft.proposedAction;
  const status = body.status ?? (proposedAction === "LOG_ONLY" ? "DRAFT_MAPPING" : draft.status);

  return {
    ...draft,
    targetLayerKey,
    targetItemType,
    proposedAction,
    status,
    proposedContentJson: {
      ...draft.proposedContentJson,
      stage: "Stage 2G",
      noAutoPromotion: true,
      targetLayerKey,
      targetItemType
    }
  };
}

export function registerStage2GRoutes(app: FastifyInstance, prisma: Stage2GPrisma, registryMetadata: RegistryMetadataFactory) {
  app.get("/platform/knowledge/layers", async () => ({
    metadata: registryMetadata(),
    boundary: stage2GBoundary,
    knowledgeLayerTaxonomy,
    availableLayers: knowledgeLayerTaxonomy.availableLayers,
    layerKeys: knowledgeLayerKeys,
    layers: knowledgeLayerDefinitions,
    productConsumptionMap: productKnowledgeConsumptionMap
  }));

  app.get("/platform/knowledge/items", async (request) => {
    const query = knowledgeItemQuerySchema.parse(request.query);
    const items = await readKnowledgeItems(prisma, query);

    return {
      metadata: registryMetadata(),
      boundary: stage2GBoundary,
      summary: summarizeKnowledgeItems(items),
      items
    };
  });

  app.get("/platform/knowledge/items/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const item = await prisma.oisCanonicalKnowledgeItem.findUnique({ where: { id: params.id } });

    if (!item) {
      return replyNotFound(reply, registryMetadata(), "canonicalKnowledgeItem", { id: params.id });
    }

    const evidenceLinks = await prisma.oisKnowledgeEvidenceLink.findMany({
      where: { knowledgeItemId: item.id },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return {
      metadata: registryMetadata(),
      boundary: stage2GBoundary,
      item: toCanonicalKnowledgeItem(item),
      evidenceLinks: evidenceLinks.map(toEvidenceLink)
    };
  });

  app.get("/platform/knowledge/evidence", async (request) => {
    const query = evidenceQuerySchema.parse(request.query);
    const evidenceLinks = await readEvidenceLinks(prisma, query);

    return {
      metadata: registryMetadata(),
      boundary: stage2GBoundary,
      summary: {
        totalLinks: evidenceLinks.length,
        itemLinks: evidenceLinks.filter((link) => link.knowledgeItemId).length,
        candidateLinks: evidenceLinks.filter((link) => link.learningCandidateId).length
      },
      evidenceLinks
    };
  });

  app.get("/platform/knowledge/context", async (request) => {
    const query = readContractQuerySchema.parse(request.query);
    const readContract = buildReadContract(query);
    const context = await readKnowledgeContext(prisma, readContract);

    return {
      metadata: registryMetadata(),
      ...context,
      boundary: {
        ...stage2GBoundary,
        ...context.boundary
      }
    };
  });

  app.get("/platform/knowledge/read-contract/example", async () => ({
    metadata: registryMetadata(),
    boundary: stage2GBoundary,
    readContract: defaultKnowledgeReadContractExample
  }));

  app.post("/platform/learning/candidates/:id/layer-mapping", async (request, reply) => {
    const params = request.params as { id: string };
    const body = layerMappingRequestSchema.parse(request.body ?? {});
    const candidate = await prisma.oisLearningCandidate.findUnique({ where: { id: params.id } });

    if (!candidate) {
      return replyNotFound(reply, registryMetadata(), "learningCandidate", { id: params.id });
    }

    const draft = buildKnowledgeLayerMappingDraft(candidate);
    const prepared = applyLayerMappingOverrides(draft, body);
    const existingMappings = await prisma.oisKnowledgeLayerMapping.findMany({
      where: {
        learningCandidateId: candidate.id,
        targetLayerKey: prepared.targetLayerKey,
        targetItemType: prepared.targetItemType,
        proposedAction: prepared.proposedAction
      },
      take: 1
    });
    const existing = existingMappings[0];
    const mapping = existing
      ? await prisma.oisKnowledgeLayerMapping.update({
          where: { id: existing.id },
          data: prepared
        })
      : await prisma.oisKnowledgeLayerMapping.create({
          data: {
            id: `knowledge_mapping_${randomUUID()}`,
            ...prepared
          }
        });

    const mappingContract = toKnowledgeLayerMapping(mapping);

    await auditKnowledgeMapping(prisma, {
      candidate,
      mapping: mappingContract,
      actorId: body.actorId,
      actorRole: body.actorRole,
      action: existing ? "OIS_KNOWLEDGE_LAYER_MAPPING_UPDATED" : "OIS_KNOWLEDGE_LAYER_MAPPING_CREATED"
    });

    return {
      metadata: registryMetadata(),
      boundary: stage2GBoundary,
      candidateId: candidate.id,
      knowledgeLayerTaxonomy,
      availableLayers: knowledgeLayerTaxonomy.availableLayers,
      mappingStatusTaxonomy: knowledgeLayerMappingStatusTaxonomy,
      availableStatuses: knowledgeLayerMappingStatusTaxonomy,
      mapping: mappingContract,
      noCanonicalKnowledgeWrite: true,
      autoPromotionEnabled: false
    };
  });

  app.get("/platform/learning/candidates/:id/layer-mapping", async (request, reply) => {
    const params = request.params as { id: string };
    const candidate = await prisma.oisLearningCandidate.findUnique({ where: { id: params.id } });

    if (!candidate) {
      return replyNotFound(reply, registryMetadata(), "learningCandidate", { id: params.id });
    }

    const mappings = await prisma.oisKnowledgeLayerMapping.findMany({
      where: { learningCandidateId: candidate.id },
      orderBy: { createdAt: "desc" },
      take: 20
    });

    return {
      metadata: registryMetadata(),
      boundary: stage2GBoundary,
      candidate,
      knowledgeLayerTaxonomy,
      availableLayers: knowledgeLayerTaxonomy.availableLayers,
      mappingStatusTaxonomy: knowledgeLayerMappingStatusTaxonomy,
      availableStatuses: knowledgeLayerMappingStatusTaxonomy,
      mappings: mappings.map(toKnowledgeLayerMapping)
    };
  });

  app.get("/platform/learning/layer-mappings", async () => ({
    metadata: registryMetadata(),
    boundary: stage2GBoundary,
    knowledgeLayerTaxonomy,
    availableLayers: knowledgeLayerTaxonomy.availableLayers,
    mappingStatusTaxonomy: knowledgeLayerMappingStatusTaxonomy,
    availableStatuses: knowledgeLayerMappingStatusTaxonomy,
    mappings: (await prisma.oisKnowledgeLayerMapping.findMany({ orderBy: { createdAt: "desc" }, take: 100 })).map(toKnowledgeLayerMapping)
  }));

  app.get("/platform/knowledge/keihb/bundles", async () => {
    const bundles = await prisma.oisKnowledgeProjectionBundle.findMany({
      where: { productKey: "KEIHB" },
      orderBy: [{ locale: "asc" }, { bundleKey: "asc" }],
      take: 50
    });

    return {
      metadata: registryMetadata(),
      boundary: stage2GBoundary,
      knowledgeLayerTaxonomy,
      availableLayers: knowledgeLayerTaxonomy.availableLayers,
      bundles: bundles.map(toProjectionBundle),
      projectionBoundary: {
        sourceOfTruth: "OIS Knowledge Fabric",
        productKey: "KEIHB",
        publishingOnly: true,
        canonicalWriteAllowed: false
      }
    };
  });

  app.get("/platform/knowledge/keihb/bundles/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const bundle = await prisma.oisKnowledgeProjectionBundle.findUnique({ where: { id: params.id } });

    if (!bundle) {
      return replyNotFound(reply, registryMetadata(), "knowledgeProjectionBundle", { id: params.id });
    }

    return {
      metadata: registryMetadata(),
      boundary: stage2GBoundary,
      knowledgeLayerTaxonomy,
      availableLayers: knowledgeLayerTaxonomy.availableLayers,
      bundle: toProjectionBundle(bundle)
    };
  });

  app.get("/platform/knowledge/keihb/preview", async () => {
    const [bundleRows, itemRows] = await Promise.all([
      prisma.oisKnowledgeProjectionBundle.findMany({
        where: { productKey: "KEIHB" },
        orderBy: [{ locale: "asc" }, { bundleKey: "asc" }],
        take: 50
      }),
      prisma.oisCanonicalKnowledgeItem.findMany({
        orderBy: [{ layerKey: "asc" }, { title: "asc" }],
        take: 100
      })
    ]);
    const items = itemRows.map(toCanonicalKnowledgeItem);
    const bundles = bundleRows.map(toProjectionBundle);

    return {
      metadata: registryMetadata(),
      boundary: stage2GBoundary,
      knowledgeLayerTaxonomy,
      availableLayers: knowledgeLayerTaxonomy.availableLayers,
      projectionBoundary: {
        sourceOfTruth: "OIS Knowledge Fabric",
        productKey: "KEIHB",
        publishingOnly: true,
        canonicalWriteAllowed: false
      },
      bundles: bundles.map((bundle) => ({
        ...bundle,
        items: items.filter((item) => bundle.includedItemIds.includes(item.id))
      }))
    };
  });

  app.post("/platform/agent/knowledge-context", async (request) => {
    const body = readContractSchema.parse(request.body ?? {});
    const readContract = buildReadContract(body);
    const context = await readKnowledgeContext(prisma, readContract);

    return {
      metadata: registryMetadata(),
      runtime: {
        mode: "deterministic-agent-knowledge-context",
        noLlmCall: true,
        noCanonicalWrite: true,
        autoPromotionEnabled: false
      },
      ...context,
      boundary: {
        ...stage2GBoundary,
        ...context.boundary
      }
    };
  });

  app.get("/platform/architecture/mindmap", async () => ({
    metadata: registryMetadata(),
    boundary: stage2GBoundary,
    mindmap: architectureMindmapManifest,
    source: {
      file: "architecture/mindmap/ois-ecosystem-map.v1.json",
      mode: "machine-readable-manifest"
    }
  }));
}
