DO $$ BEGIN
  CREATE TYPE "OimaTranscriptVersionType" AS ENUM ('RAW', 'NORMALIZED', 'CORRECTED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OimaTranscriptParserType" AS ENUM ('MICROSOFT_TEAMS', 'GENERIC_TEXT', 'MANUAL');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OimaTranscriptParseRunStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'NEEDS_REVIEW', 'FAILED');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "OimaTranscriptParseWarningSeverity" AS ENUM ('INFO', 'WARNING', 'ERROR');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "OimaTranscriptVersion" (
  "id" TEXT NOT NULL,
  "meetingId" TEXT NOT NULL,
  "sourceFileId" TEXT NOT NULL,
  "versionType" "OimaTranscriptVersionType" NOT NULL,
  "versionNumber" INTEGER NOT NULL,
  "rawContentHash" TEXT NOT NULL,
  "contentStorageKey" TEXT,
  "contentText" TEXT,
  "isImmutable" BOOLEAN NOT NULL DEFAULT false,
  "createdBy" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OimaTranscriptVersion_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OimaTranscriptVersion_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "OimaMeetingRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OimaTranscriptVersion_sourceFileId_fkey" FOREIGN KEY ("sourceFileId") REFERENCES "OimaMeetingSourceFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OimaTranscriptParseRun" (
  "id" TEXT NOT NULL,
  "meetingId" TEXT NOT NULL,
  "sourceFileId" TEXT NOT NULL,
  "rawVersionId" TEXT NOT NULL,
  "normalizedVersionId" TEXT NOT NULL,
  "parserType" "OimaTranscriptParserType" NOT NULL,
  "status" "OimaTranscriptParseRunStatus" NOT NULL DEFAULT 'PENDING',
  "segmentCount" INTEGER NOT NULL DEFAULT 0,
  "warningCount" INTEGER NOT NULL DEFAULT 0,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "completedAt" TIMESTAMP(3),
  "errorMessage" TEXT,
  CONSTRAINT "OimaTranscriptParseRun_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OimaTranscriptParseRun_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "OimaMeetingRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OimaTranscriptParseRun_sourceFileId_fkey" FOREIGN KEY ("sourceFileId") REFERENCES "OimaMeetingSourceFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OimaTranscriptParseRun_rawVersionId_fkey" FOREIGN KEY ("rawVersionId") REFERENCES "OimaTranscriptVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OimaTranscriptParseRun_normalizedVersionId_fkey" FOREIGN KEY ("normalizedVersionId") REFERENCES "OimaTranscriptVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OimaTranscriptSegment" (
  "id" TEXT NOT NULL,
  "meetingId" TEXT NOT NULL,
  "transcriptVersionId" TEXT NOT NULL,
  "parseRunId" TEXT NOT NULL,
  "segmentIndex" INTEGER NOT NULL,
  "sourceLineStart" INTEGER NOT NULL,
  "sourceLineEnd" INTEGER NOT NULL,
  "timestampStart" TEXT,
  "timestampEnd" TEXT,
  "speakerRaw" TEXT,
  "speakerNormalized" TEXT,
  "rawText" TEXT NOT NULL,
  "normalizedText" TEXT NOT NULL,
  "confidenceScore" DOUBLE PRECISION NOT NULL DEFAULT 0,
  "needsReview" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OimaTranscriptSegment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OimaTranscriptSegment_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "OimaMeetingRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OimaTranscriptSegment_transcriptVersionId_fkey" FOREIGN KEY ("transcriptVersionId") REFERENCES "OimaTranscriptVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "OimaTranscriptSegment_parseRunId_fkey" FOREIGN KEY ("parseRunId") REFERENCES "OimaTranscriptParseRun"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "OimaTranscriptParseWarning" (
  "id" TEXT NOT NULL,
  "parseRunId" TEXT NOT NULL,
  "segmentId" TEXT,
  "warningType" TEXT NOT NULL,
  "message" TEXT NOT NULL,
  "severity" "OimaTranscriptParseWarningSeverity" NOT NULL DEFAULT 'WARNING',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "OimaTranscriptParseWarning_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "OimaTranscriptParseWarning_parseRunId_fkey" FOREIGN KEY ("parseRunId") REFERENCES "OimaTranscriptParseRun"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "OimaTranscriptParseWarning_segmentId_fkey" FOREIGN KEY ("segmentId") REFERENCES "OimaTranscriptSegment"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "OimaTranscriptVersion_meeting_type_version_key" ON "OimaTranscriptVersion"("meetingId", "versionType", "versionNumber");
CREATE INDEX IF NOT EXISTS "OimaTranscriptVersion_meeting_source_type_idx" ON "OimaTranscriptVersion"("meetingId", "sourceFileId", "versionType");
CREATE INDEX IF NOT EXISTS "OimaTranscriptVersion_rawContentHash_idx" ON "OimaTranscriptVersion"("rawContentHash");

CREATE INDEX IF NOT EXISTS "OimaTranscriptParseRun_meeting_status_started_idx" ON "OimaTranscriptParseRun"("meetingId", "status", "startedAt");
CREATE INDEX IF NOT EXISTS "OimaTranscriptParseRun_source_parser_idx" ON "OimaTranscriptParseRun"("sourceFileId", "parserType");
CREATE INDEX IF NOT EXISTS "OimaTranscriptParseRun_rawVersion_idx" ON "OimaTranscriptParseRun"("rawVersionId");
CREATE INDEX IF NOT EXISTS "OimaTranscriptParseRun_normalizedVersion_idx" ON "OimaTranscriptParseRun"("normalizedVersionId");

CREATE UNIQUE INDEX IF NOT EXISTS "OimaTranscriptSegment_parseRun_segmentIndex_key" ON "OimaTranscriptSegment"("parseRunId", "segmentIndex");
CREATE INDEX IF NOT EXISTS "OimaTranscriptSegment_meeting_segmentIndex_idx" ON "OimaTranscriptSegment"("meetingId", "segmentIndex");
CREATE INDEX IF NOT EXISTS "OimaTranscriptSegment_version_segmentIndex_idx" ON "OimaTranscriptSegment"("transcriptVersionId", "segmentIndex");
CREATE INDEX IF NOT EXISTS "OimaTranscriptSegment_needsReview_idx" ON "OimaTranscriptSegment"("needsReview");

CREATE INDEX IF NOT EXISTS "OimaTranscriptParseWarning_parseRun_severity_idx" ON "OimaTranscriptParseWarning"("parseRunId", "severity");
CREATE INDEX IF NOT EXISTS "OimaTranscriptParseWarning_segment_idx" ON "OimaTranscriptParseWarning"("segmentId");
