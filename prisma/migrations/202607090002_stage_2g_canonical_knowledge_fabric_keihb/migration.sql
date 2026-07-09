DO $$ BEGIN
  CREATE TYPE "OisKnowledgeLayerKey" AS ENUM ('KL_0_LEGAL_REGULATORY_CORE', 'KL_1_INDUSTRY_CORE', 'KL_2_ORGANIZATION_CORE', 'KL_3_PRODUCT_KNOWLEDGE_PACK', 'KL_4_WORKSPACE_PROJECT_OVERLAY', 'KL_5_LIVE_OPERATIONAL_SIGNALS');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisKnowledgeItemType" AS ENUM ('FACT', 'POLICY', 'SOP', 'FAQ', 'PLAYBOOK', 'CHECKLIST', 'EXECUTIVE_INTENT', 'DECISION_RULE', 'RISK_PATTERN', 'INDUSTRY_PATTERN', 'PRODUCT_RULE', 'WORKSPACE_OVERLAY', 'LIVE_SIGNAL_SUMMARY', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisKnowledgeItemStatus" AS ENUM ('DRAFT', 'ACTIVE', 'DEPRECATED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisSensitivityLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'RESTRICTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisKnowledgePromotionAction" AS ENUM ('CREATE', 'UPDATE', 'DEPRECATE', 'MERGE', 'LINK_ONLY', 'LOG_ONLY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisKnowledgeLayerMappingStatus" AS ENUM ('DRAFT_MAPPING', 'READY_FOR_REVIEW', 'APPROVED_FOR_FUTURE_PROMOTION', 'REJECTED', 'BLOCKED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisKnowledgeProjectionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "OisCanonicalKnowledgeItem" (
  "id" TEXT NOT NULL,
  "layerKey" "OisKnowledgeLayerKey" NOT NULL,
  "scope" "OisLearningScope" NOT NULL,
  "itemType" "OisKnowledgeItemType" NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "contentJson" JSONB NOT NULL DEFAULT '{}',
  "status" "OisKnowledgeItemStatus" NOT NULL DEFAULT 'DRAFT',
  "version" INTEGER NOT NULL DEFAULT 1,
  "locale" TEXT NOT NULL DEFAULT 'en',
  "organizationId" TEXT,
  "workspaceId" TEXT,
  "industryCode" TEXT,
  "productKey" TEXT,
  "entityRefs" JSONB NOT NULL DEFAULT '[]',
  "relatedEntityIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "sensitivityLevel" "OisSensitivityLevel" NOT NULL DEFAULT 'LOW',
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "sourceAuthority" "OisSourceAuthority" NOT NULL,
  "createdFromCandidateId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisCanonicalKnowledgeItem_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisCanonicalKnowledgeItem_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisCanonicalKnowledgeItem_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisCanonicalKnowledgeItem_createdFromCandidateId_fkey" FOREIGN KEY ("createdFromCandidateId") REFERENCES "OisLearningCandidate"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisKnowledgeEvidenceLink" (
  "id" TEXT NOT NULL,
  "knowledgeItemId" TEXT,
  "learningCandidateId" TEXT,
  "sourceType" "OisLearningSourceType" NOT NULL,
  "sourceRef" TEXT NOT NULL,
  "sourceTitle" TEXT NOT NULL,
  "excerpt" TEXT NOT NULL,
  "excerptHash" TEXT NOT NULL,
  "evidenceWeight" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
  "sourceAuthority" "OisSourceAuthority" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisKnowledgeEvidenceLink_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisKnowledgeEvidenceLink_knowledgeItemId_fkey" FOREIGN KEY ("knowledgeItemId") REFERENCES "OisCanonicalKnowledgeItem"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "OisKnowledgeEvidenceLink_learningCandidateId_fkey" FOREIGN KEY ("learningCandidateId") REFERENCES "OisLearningCandidate"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisKnowledgeLayerMapping" (
  "id" TEXT NOT NULL,
  "learningCandidateId" TEXT NOT NULL,
  "targetLayerKey" "OisKnowledgeLayerKey" NOT NULL,
  "targetItemType" "OisKnowledgeItemType" NOT NULL,
  "proposedAction" "OisKnowledgePromotionAction" NOT NULL,
  "proposedTitle" TEXT NOT NULL,
  "proposedSummary" TEXT NOT NULL,
  "proposedContentJson" JSONB NOT NULL DEFAULT '{}',
  "affectedProducts" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "affectedEntities" JSONB NOT NULL DEFAULT '[]',
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "policyDecision" "OisLearningPolicyDecision" NOT NULL,
  "status" "OisKnowledgeLayerMappingStatus" NOT NULL DEFAULT 'DRAFT_MAPPING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisKnowledgeLayerMapping_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisKnowledgeLayerMapping_learningCandidateId_fkey" FOREIGN KEY ("learningCandidateId") REFERENCES "OisLearningCandidate"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisKnowledgeProjectionBundle" (
  "id" TEXT NOT NULL,
  "bundleKey" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "productKey" TEXT NOT NULL,
  "targetAudience" TEXT NOT NULL,
  "role" TEXT NOT NULL,
  "locale" TEXT NOT NULL DEFAULT 'en',
  "includedLayerKeys" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "includedItemIds" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "selectionRules" JSONB NOT NULL DEFAULT '{}',
  "snapshotVersion" INTEGER NOT NULL DEFAULT 1,
  "status" "OisKnowledgeProjectionStatus" NOT NULL DEFAULT 'DRAFT',
  "manifestJson" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisKnowledgeProjectionBundle_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "OisCanonicalKnowledgeItem_layer_scope_status_idx" ON "OisCanonicalKnowledgeItem"("layerKey", "scope", "status");
CREATE INDEX IF NOT EXISTS "OisCanonicalKnowledgeItem_org_workspace_product_idx" ON "OisCanonicalKnowledgeItem"("organizationId", "workspaceId", "productKey");
CREATE INDEX IF NOT EXISTS "OisCanonicalKnowledgeItem_industry_product_idx" ON "OisCanonicalKnowledgeItem"("industryCode", "productKey");
CREATE INDEX IF NOT EXISTS "OisCanonicalKnowledgeItem_candidate_idx" ON "OisCanonicalKnowledgeItem"("createdFromCandidateId");
CREATE INDEX IF NOT EXISTS "OisKnowledgeEvidenceLink_item_idx" ON "OisKnowledgeEvidenceLink"("knowledgeItemId");
CREATE INDEX IF NOT EXISTS "OisKnowledgeEvidenceLink_candidate_idx" ON "OisKnowledgeEvidenceLink"("learningCandidateId");
CREATE INDEX IF NOT EXISTS "OisKnowledgeEvidenceLink_source_idx" ON "OisKnowledgeEvidenceLink"("sourceType", "sourceAuthority");
CREATE UNIQUE INDEX IF NOT EXISTS "OisKnowledgeLayerMapping_candidate_target_key" ON "OisKnowledgeLayerMapping"("learningCandidateId", "targetLayerKey", "targetItemType", "proposedAction");
CREATE INDEX IF NOT EXISTS "OisKnowledgeLayerMapping_candidate_idx" ON "OisKnowledgeLayerMapping"("learningCandidateId");
CREATE INDEX IF NOT EXISTS "OisKnowledgeLayerMapping_target_status_idx" ON "OisKnowledgeLayerMapping"("targetLayerKey", "targetItemType", "status");
CREATE INDEX IF NOT EXISTS "OisKnowledgeLayerMapping_policy_status_idx" ON "OisKnowledgeLayerMapping"("policyDecision", "status");
CREATE UNIQUE INDEX IF NOT EXISTS "OisKnowledgeProjectionBundle_bundleKey_key" ON "OisKnowledgeProjectionBundle"("bundleKey");
CREATE INDEX IF NOT EXISTS "OisKnowledgeProjectionBundle_product_status_idx" ON "OisKnowledgeProjectionBundle"("productKey", "status");
CREATE INDEX IF NOT EXISTS "OisKnowledgeProjectionBundle_locale_role_idx" ON "OisKnowledgeProjectionBundle"("locale", "role");
