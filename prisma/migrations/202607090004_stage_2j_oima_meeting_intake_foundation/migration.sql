DO $$ BEGIN
  CREATE TYPE "OimaMeetingSourceMode" AS ENUM ('TRANSCRIPT_ONLY', 'AUDIO_ONLY', 'TRANSCRIPT_AND_AUDIO', 'LISTENER_CAPTURED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OimaMeetingStatus" AS ENUM ('DRAFT', 'UPLOADED', 'READY_FOR_PROCESSING', 'NEEDS_REVIEW', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OimaMeetingSourceFileType" AS ENUM ('TRANSCRIPT', 'AUDIO', 'PARTICIPANT_LIST', 'OTHER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OimaMeetingSourceUploadStatus" AS ENUM ('REGISTERED', 'UPLOADED', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "OimaMeetingRecord" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "title" TEXT NOT NULL,
  "meetingDate" TIMESTAMP(3) NOT NULL,
  "startTime" TEXT,
  "endTime" TEXT,
  "sourceMode" "OimaMeetingSourceMode" NOT NULL,
  "participantCount" INTEGER NOT NULL DEFAULT 0,
  "status" "OimaMeetingStatus" NOT NULL DEFAULT 'DRAFT',
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OimaMeetingRecord_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OimaMeetingRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OimaMeetingRecord_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OimaMeetingSourceFile" (
  "id" TEXT NOT NULL,
  "meetingId" TEXT NOT NULL,
  "fileType" "OimaMeetingSourceFileType" NOT NULL,
  "originalFilename" TEXT NOT NULL,
  "storageKey" TEXT,
  "storageUrl" TEXT,
  "mimeType" TEXT,
  "sizeBytes" INTEGER NOT NULL DEFAULT 0,
  "checksum" TEXT,
  "uploadStatus" "OimaMeetingSourceUploadStatus" NOT NULL DEFAULT 'REGISTERED',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OimaMeetingSourceFile_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OimaMeetingSourceFile_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "OimaMeetingRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE INDEX IF NOT EXISTS "OimaMeetingRecord_scope_meetingDate_idx" ON "OimaMeetingRecord"("organizationId", "workspaceId", "meetingDate");
CREATE INDEX IF NOT EXISTS "OimaMeetingRecord_workspace_status_created_idx" ON "OimaMeetingRecord"("workspaceId", "status", "createdAt");
CREATE INDEX IF NOT EXISTS "OimaMeetingRecord_sourceMode_status_idx" ON "OimaMeetingRecord"("sourceMode", "status");
CREATE INDEX IF NOT EXISTS "OimaMeetingSourceFile_meeting_fileType_idx" ON "OimaMeetingSourceFile"("meetingId", "fileType");
CREATE INDEX IF NOT EXISTS "OimaMeetingSourceFile_uploadStatus_created_idx" ON "OimaMeetingSourceFile"("uploadStatus", "createdAt");
