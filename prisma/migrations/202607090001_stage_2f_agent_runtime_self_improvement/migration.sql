DO $$ BEGIN
  CREATE TYPE "OisEcosystemProductType" AS ENUM ('CORE_PLATFORM', 'ECOSYSTEM_PRODUCT', 'FUTURE_PRODUCT', 'CUSTOM_PRODUCT');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningScope" AS ENUM ('ORGANIZATION', 'INDUSTRY', 'PLATFORM');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisSourceAuthority" AS ENUM ('CEO', 'CHAIRMAN', 'BOD', 'C_LEVEL', 'DIRECTOR', 'MANAGER', 'SUPERADMIN', 'ADMIN', 'STAFF', 'END_USER', 'SYSTEM', 'UNKNOWN');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningPolicyMode" AS ENUM ('ALWAYS_ASK', 'AUTO_IF_CONFIDENCE', 'FULL_AUTO_PILOT', 'LOG_ONLY');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningSourceType" AS ENUM ('WIDGET', 'MEETING', 'DOCUMENT', 'TICKET', 'CHAT', 'EMAIL', 'CALL', 'SYSTEM', 'IMPORT', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningSignalType" AS ENUM ('USER_CORRECTION', 'NEW_KNOWLEDGE', 'EXECUTIVE_STATEMENT', 'CEO_DIRECTIVE', 'STRATEGIC_INTENT', 'SOP_CORRECTION', 'FAQ_CORRECTION', 'ENTITY_CORRECTION', 'RISK_PATTERN', 'TICKET_PATTERN', 'CANDIDATE_MARKET_SIGNAL', 'CUSTOMER_COMPLAINT_PATTERN', 'PRODUCT_FEEDBACK', 'KNOWLEDGE_GAP', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningSignalStatus" AS ENUM ('RECEIVED', 'TRIAGED', 'CANDIDATE_CREATED', 'IGNORED', 'ERROR');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningCandidateType" AS ENUM ('EXECUTIVE_DIRECTIVE', 'STRATEGIC_PRIORITY', 'MANAGEMENT_PRINCIPLE', 'EXECUTIVE_CONCERN', 'MISALIGNMENT_SIGNAL', 'ENTITY_UPDATE', 'SOP_UPDATE', 'FAQ_UPDATE', 'RISK_PATTERN', 'TICKET_PATTERN', 'PRODUCT_IMPROVEMENT', 'INDUSTRY_PATTERN', 'PLATFORM_PATTERN', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningConflictStatus" AS ENUM ('NO_CONFLICT', 'POSSIBLE_CONFLICT', 'CONFLICT', 'INSUFFICIENT_EVIDENCE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningPolicyDecision" AS ENUM ('ASK_REVIEW', 'AUTO_LEARN', 'LOG_ONLY', 'BLOCKED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisLearningCandidateStatus" AS ENUM ('PENDING_REVIEW', 'AUTO_LEARNED', 'APPROVED', 'REJECTED', 'PROMOTED', 'ROLLED_BACK');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisAgentSessionStatus" AS ENUM ('OPEN', 'CLOSED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisAgentMessageRole" AS ENUM ('USER', 'ASSISTANT', 'SYSTEM');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OisAgentFeedbackType" AS ENUM ('HELPFUL', 'NOT_HELPFUL', 'WRONG_ANSWER', 'CORRECTION', 'CONFIRMED_TRUE', 'ESCALATED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "OisEcosystemProduct" (
  "id" TEXT NOT NULL,
  "productKey" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "productType" "OisEcosystemProductType" NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "supportedAgentCapabilities" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "supportedLearningSignalTypes" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "defaultLearningScope" "OisLearningScope" NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisEcosystemProduct_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "OisLearningPolicy" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "productKey" TEXT NOT NULL,
  "learningScope" "OisLearningScope" NOT NULL,
  "signalType" "OisLearningSignalType" NOT NULL,
  "sourceAuthority" "OisSourceAuthority" NOT NULL,
  "policyMode" "OisLearningPolicyMode" NOT NULL,
  "confidenceThreshold" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisLearningPolicy_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisLearningPolicy_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisLearningSignal" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "productKey" TEXT NOT NULL,
  "sourceType" "OisLearningSourceType" NOT NULL,
  "sourceAuthority" "OisSourceAuthority" NOT NULL,
  "learningScope" "OisLearningScope" NOT NULL,
  "signalType" "OisLearningSignalType" NOT NULL,
  "rawText" TEXT NOT NULL,
  "normalizedText" TEXT NOT NULL,
  "contextJson" JSONB NOT NULL DEFAULT '{}',
  "relatedEntityRefs" JSONB NOT NULL DEFAULT '[]',
  "submittedBy" TEXT,
  "userId" TEXT,
  "confidenceInitial" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "status" "OisLearningSignalStatus" NOT NULL DEFAULT 'RECEIVED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisLearningSignal_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisLearningSignal_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisLearningSignal_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisLearningCandidate" (
  "id" TEXT NOT NULL,
  "signalId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "productKey" TEXT NOT NULL,
  "learningScope" "OisLearningScope" NOT NULL,
  "candidateType" "OisLearningCandidateType" NOT NULL,
  "title" TEXT NOT NULL,
  "summary" TEXT NOT NULL,
  "proposedKnowledgeJson" JSONB NOT NULL DEFAULT '{}',
  "affectedProducts" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  "affectedEntities" JSONB NOT NULL DEFAULT '[]',
  "sourceAuthority" "OisSourceAuthority" NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "confidenceBreakdownJson" JSONB NOT NULL DEFAULT '{}',
  "conflictStatus" "OisLearningConflictStatus" NOT NULL DEFAULT 'NO_CONFLICT',
  "policyDecision" "OisLearningPolicyDecision" NOT NULL DEFAULT 'ASK_REVIEW',
  "status" "OisLearningCandidateStatus" NOT NULL DEFAULT 'PENDING_REVIEW',
  "evidenceJson" JSONB NOT NULL DEFAULT '{}',
  "reviewerId" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisLearningCandidate_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisLearningCandidate_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "OisLearningSignal"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OisLearningCandidate_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisLearningCandidate_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisAgentSession" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "productKey" TEXT NOT NULL,
  "currentRoute" TEXT,
  "screen" TEXT,
  "currentEntityRefs" JSONB NOT NULL DEFAULT '[]',
  "userRole" TEXT,
  "permissionContextJson" JSONB NOT NULL DEFAULT '{}',
  "locale" TEXT,
  "status" "OisAgentSessionStatus" NOT NULL DEFAULT 'OPEN',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisAgentSession_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisAgentSession_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisAgentSession_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisAgentMessage" (
  "id" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "role" "OisAgentMessageRole" NOT NULL,
  "content" TEXT NOT NULL,
  "evidenceJson" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisAgentMessage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisAgentMessage_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OisAgentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisAgentFeedback" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "productKey" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "messageId" TEXT,
  "feedbackType" "OisAgentFeedbackType" NOT NULL,
  "comment" TEXT,
  "submittedBy" TEXT,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisAgentFeedback_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisAgentFeedback_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisAgentFeedback_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisAgentFeedback_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OisAgentSession"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OisAgentFeedback_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "OisAgentMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OisAgentLearningSubmission" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "productKey" TEXT NOT NULL,
  "sessionId" TEXT,
  "signalId" TEXT,
  "sourceAuthority" "OisSourceAuthority" NOT NULL,
  "learningScope" "OisLearningScope" NOT NULL,
  "signalType" "OisLearningSignalType" NOT NULL,
  "rawText" TEXT NOT NULL,
  "status" "OisLearningSignalStatus" NOT NULL DEFAULT 'RECEIVED',
  "submittedBy" TEXT,
  "userId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OisAgentLearningSubmission_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OisAgentLearningSubmission_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisAgentLearningSubmission_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OisAgentLearningSubmission_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "OisAgentSession"("id") ON DELETE SET NULL ON UPDATE CASCADE,
  CONSTRAINT "OisAgentLearningSubmission_signalId_fkey" FOREIGN KEY ("signalId") REFERENCES "OisLearningSignal"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "OisEcosystemProduct_productKey_key" ON "OisEcosystemProduct"("productKey");
CREATE UNIQUE INDEX IF NOT EXISTS "OisLearningPolicy_scope_key" ON "OisLearningPolicy"("organizationId", "productKey", "learningScope", "signalType", "sourceAuthority");
CREATE INDEX IF NOT EXISTS "OisLearningPolicy_org_product_scope_idx" ON "OisLearningPolicy"("organizationId", "productKey", "learningScope");
CREATE INDEX IF NOT EXISTS "OisLearningSignal_scope_created_idx" ON "OisLearningSignal"("organizationId", "workspaceId", "createdAt");
CREATE INDEX IF NOT EXISTS "OisLearningSignal_product_type_authority_idx" ON "OisLearningSignal"("productKey", "signalType", "sourceAuthority");
CREATE INDEX IF NOT EXISTS "OisLearningSignal_status_created_idx" ON "OisLearningSignal"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "OisLearningCandidate_signal_idx" ON "OisLearningCandidate"("signalId");
CREATE INDEX IF NOT EXISTS "OisLearningCandidate_scope_created_idx" ON "OisLearningCandidate"("organizationId", "workspaceId", "createdAt");
CREATE INDEX IF NOT EXISTS "OisLearningCandidate_product_type_status_idx" ON "OisLearningCandidate"("productKey", "candidateType", "status");
CREATE INDEX IF NOT EXISTS "OisLearningCandidate_authority_policy_idx" ON "OisLearningCandidate"("sourceAuthority", "policyDecision");
CREATE INDEX IF NOT EXISTS "OisAgentSession_scope_product_idx" ON "OisAgentSession"("organizationId", "workspaceId", "productKey");
CREATE INDEX IF NOT EXISTS "OisAgentSession_status_created_idx" ON "OisAgentSession"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "OisAgentMessage_session_created_idx" ON "OisAgentMessage"("sessionId", "createdAt");
CREATE INDEX IF NOT EXISTS "OisAgentFeedback_scope_product_idx" ON "OisAgentFeedback"("organizationId", "workspaceId", "productKey");
CREATE INDEX IF NOT EXISTS "OisAgentFeedback_session_message_idx" ON "OisAgentFeedback"("sessionId", "messageId");
CREATE INDEX IF NOT EXISTS "OisAgentLearningSubmission_scope_product_idx" ON "OisAgentLearningSubmission"("organizationId", "workspaceId", "productKey");
CREATE INDEX IF NOT EXISTS "OisAgentLearningSubmission_signal_idx" ON "OisAgentLearningSubmission"("signalId");
CREATE INDEX IF NOT EXISTS "OisAgentLearningSubmission_session_idx" ON "OisAgentLearningSubmission"("sessionId");
