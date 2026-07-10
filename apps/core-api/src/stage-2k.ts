import { createHash, randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import {
  oimaCurrentRuntimeCapabilities,
  oimaPlannedRuntimeCapabilities,
  oimaProductContract,
  oimaTranscriptParseRunStatuses,
  oimaTranscriptParseWarningSeverities,
  oimaTranscriptParserTypes,
  oimaTranscriptVersionTypes,
  type OimaMeetingStatus,
  type OimaTranscriptParseRunStatus,
  type OimaTranscriptParseWarningSeverity,
  type OimaTranscriptParserType,
  type OimaTranscriptVersionType
} from "@ois/architecture-contracts";

type RegistryMetadata = {
  source: string;
  mode: string;
  environment: string;
  generatedAt: string;
};

type RegistryMetadataFactory = () => RegistryMetadata;

type OimaMeetingSourceFileRow = {
  id: string;
  meetingId: string;
  fileType: string;
  originalFilename: string;
  storageKey: string | null;
  storageUrl: string | null;
  mimeType: string | null;
  sizeBytes: number;
  checksum: string | null;
  uploadStatus: string;
  createdAt: Date | string;
};

type OimaMeetingRecordRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  title: string;
  status: OimaMeetingStatus;
  confidenceScore: number;
  sourceFiles?: OimaMeetingSourceFileRow[];
};

type OimaTranscriptVersionRow = {
  id: string;
  meetingId: string;
  sourceFileId: string;
  versionType: OimaTranscriptVersionType;
  versionNumber: number;
  rawContentHash: string;
  contentStorageKey: string | null;
  contentText: string | null;
  isImmutable: boolean;
  createdBy: string | null;
  createdAt: Date | string;
};

type OimaTranscriptParseRunRow = {
  id: string;
  meetingId: string;
  sourceFileId: string;
  rawVersionId: string;
  normalizedVersionId: string;
  parserType: OimaTranscriptParserType;
  status: OimaTranscriptParseRunStatus;
  segmentCount: number;
  warningCount: number;
  confidenceScore: number;
  startedAt: Date | string;
  completedAt: Date | string | null;
  errorMessage: string | null;
};

type OimaTranscriptSegmentRow = {
  id: string;
  meetingId: string;
  transcriptVersionId: string;
  parseRunId: string;
  segmentIndex: number;
  sourceLineStart: number;
  sourceLineEnd: number;
  timestampStart: string | null;
  timestampEnd: string | null;
  speakerRaw: string | null;
  speakerNormalized: string | null;
  rawText: string;
  normalizedText: string;
  confidenceScore: number;
  needsReview: boolean;
  createdAt: Date | string;
};

type OimaTranscriptParseWarningRow = {
  id: string;
  parseRunId: string;
  segmentId: string | null;
  warningType: string;
  message: string;
  severity: OimaTranscriptParseWarningSeverity;
  createdAt: Date | string;
};

type CreateArgs<T> = { data: T; include?: Record<string, unknown> };
type CreateManyArgs<T> = { data: T[] };
type FindUniqueArgs = { where: { id: string }; include?: Record<string, unknown> };
type FindManyArgs = { where?: Record<string, unknown>; orderBy?: Record<string, string>; take?: number };
type UpdateArgs<T> = { where: { id: string }; data: Partial<T>; include?: Record<string, unknown> };

export type Stage2KPrisma = {
  auditRecord: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<unknown>;
  };
  oimaMeetingRecord: {
    findUnique(args: FindUniqueArgs): Promise<OimaMeetingRecordRow | null>;
    update(args: UpdateArgs<OimaMeetingRecordRow>): Promise<OimaMeetingRecordRow>;
  };
  oimaTranscriptVersion: {
    findMany(args?: FindManyArgs): Promise<OimaTranscriptVersionRow[]>;
    create(args: CreateArgs<Record<string, unknown>>): Promise<OimaTranscriptVersionRow>;
  };
  oimaTranscriptParseRun: {
    findMany(args?: FindManyArgs): Promise<OimaTranscriptParseRunRow[]>;
    create(args: CreateArgs<Record<string, unknown>>): Promise<OimaTranscriptParseRunRow>;
  };
  oimaTranscriptSegment: {
    findMany(args?: FindManyArgs): Promise<OimaTranscriptSegmentRow[]>;
    createMany(args: CreateManyArgs<Record<string, unknown>>): Promise<unknown>;
  };
  oimaTranscriptParseWarning: {
    findMany(args?: FindManyArgs): Promise<OimaTranscriptParseWarningRow[]>;
    createMany(args: CreateManyArgs<Record<string, unknown>>): Promise<unknown>;
  };
};

type ParsedTranscriptSegment = {
  segmentIndex: number;
  sourceLineStart: number;
  sourceLineEnd: number;
  timestampStart: string | null;
  timestampEnd: string | null;
  speakerRaw: string | null;
  speakerNormalized: string | null;
  rawText: string;
  normalizedText: string;
  confidenceScore: number;
  needsReview: boolean;
};

type ParsedTranscriptWarning = {
  segmentIndex: number;
  warningType: string;
  message: string;
  severity: OimaTranscriptParseWarningSeverity;
};

type WorkingSegment = {
  sourceLineStart: number;
  sourceLineEnd: number;
  timestampStart: string | null;
  timestampEnd: string | null;
  speakerRaw: string | null;
  rawTextLines: string[];
  baseConfidence: number;
};

const meetingInclude = {
  sourceFiles: {
    orderBy: { createdAt: "asc" }
  }
} as const;

const parserTypeSchema = z.enum(oimaTranscriptParserTypes);

const processTranscriptSchema = z.object({
  sourceFileId: z.string().trim().min(1).optional(),
  rawTranscriptText: z.string().min(1).max(1_000_000),
  parserType: parserTypeSchema.default("MICROSOFT_TEAMS"),
  createdBy: z.string().trim().min(1).optional()
});

function replyBadRequest(reply: FastifyReply, metadata: RegistryMetadata, code: string, message: string, details: unknown[] = []) {
  return reply.code(400).send({
    metadata,
    error: { code, message, details }
  });
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

function validationDetails(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));
}

function toIsoString(value: Date | string | null) {
  return value ? (value instanceof Date ? value.toISOString() : new Date(value).toISOString()) : null;
}

function normalizeText(value: string) {
  return value.replace(/\s+/g, " ").trim();
}

function normalizeSpeaker(value: string | null) {
  return value ? normalizeText(value) : null;
}

function sha256Content(value: string) {
  return `sha256:${createHash("sha256").update(value, "utf8").digest("hex")}`;
}

const timestampPattern = "\\d{1,2}:\\d{2}(?::\\d{2})?(?:\\.\\d{1,3})?";
const timestampOnlyRegex = new RegExp(`^(${timestampPattern})$`);
const timestampRangeRegex = new RegExp(`^(${timestampPattern})\\s*-->\\s*(${timestampPattern})(?:\\s+(.+))?$`);
const timestampSpeakerTextRegex = new RegExp(`^(${timestampPattern})\\s+([^:]{1,80}):\\s*(.*)$`);
const speakerTimestampTextRegex = new RegExp(`^([^\\d:][^\\n]{1,80}?)\\s+(${timestampPattern})\\s+(.+)$`);
const speakerTimestampRegex = new RegExp(`^([^\\d:][^\\n]{1,80}?)\\s+(${timestampPattern})$`);
const speakerTextRegex = /^([A-Za-z][^:]{0,80}):\s*(.*)$/;

function detectTranscriptHeader(line: string): Omit<WorkingSegment, "sourceLineStart" | "sourceLineEnd" | "rawTextLines"> & { initialText: string | null } | null {
  const trimmed = line.trim();
  if (!trimmed) {
    return null;
  }

  const rangeMatch = trimmed.match(timestampRangeRegex);
  if (rangeMatch) {
    return {
      timestampStart: rangeMatch[1] ?? null,
      timestampEnd: rangeMatch[2] ?? null,
      speakerRaw: null,
      initialText: rangeMatch[3] ?? null,
      baseConfidence: rangeMatch[3] ? 0.7 : 0.62
    };
  }

  const timestampSpeakerMatch = trimmed.match(timestampSpeakerTextRegex);
  if (timestampSpeakerMatch) {
    return {
      timestampStart: timestampSpeakerMatch[1] ?? null,
      timestampEnd: null,
      speakerRaw: normalizeText(timestampSpeakerMatch[2] ?? ""),
      initialText: timestampSpeakerMatch[3] ?? "",
      baseConfidence: 0.98
    };
  }

  const speakerTimestampTextMatch = trimmed.match(speakerTimestampTextRegex);
  if (speakerTimestampTextMatch) {
    return {
      timestampStart: speakerTimestampTextMatch[2] ?? null,
      timestampEnd: null,
      speakerRaw: normalizeText(speakerTimestampTextMatch[1] ?? ""),
      initialText: speakerTimestampTextMatch[3] ?? "",
      baseConfidence: 0.96
    };
  }

  const speakerTimestampMatch = trimmed.match(speakerTimestampRegex);
  if (speakerTimestampMatch) {
    return {
      timestampStart: speakerTimestampMatch[2] ?? null,
      timestampEnd: null,
      speakerRaw: normalizeText(speakerTimestampMatch[1] ?? ""),
      initialText: null,
      baseConfidence: 0.9
    };
  }

  const timestampOnlyMatch = trimmed.match(timestampOnlyRegex);
  if (timestampOnlyMatch) {
    return {
      timestampStart: timestampOnlyMatch[1] ?? null,
      timestampEnd: null,
      speakerRaw: null,
      initialText: null,
      baseConfidence: 0.68
    };
  }

  const speakerTextMatch = trimmed.match(speakerTextRegex);
  if (speakerTextMatch) {
    return {
      timestampStart: null,
      timestampEnd: null,
      speakerRaw: normalizeText(speakerTextMatch[1] ?? ""),
      initialText: speakerTextMatch[2] ?? "",
      baseConfidence: 0.78
    };
  }

  return null;
}

function finalConfidence(segment: WorkingSegment, normalizedText: string) {
  let confidence = segment.baseConfidence;

  if (!segment.speakerRaw) {
    confidence -= 0.2;
  }

  if (!segment.timestampStart) {
    confidence -= 0.15;
  }

  if (!normalizedText) {
    confidence -= 0.2;
  }

  return Math.max(0.1, Math.min(0.99, Number(confidence.toFixed(2))));
}

function normalizedTranscriptContent(segments: ParsedTranscriptSegment[]) {
  return segments
    .map((segment) => {
      const timestamp = segment.timestampStart ? `[${segment.timestampStart}${segment.timestampEnd ? `-${segment.timestampEnd}` : ""}] ` : "";
      const speaker = segment.speakerNormalized ? `${segment.speakerNormalized}: ` : "";
      return `${timestamp}${speaker}${segment.normalizedText}`.trim();
    })
    .join("\n");
}

export function parseOimaTranscript(rawTranscriptText: string, parserType: OimaTranscriptParserType = "MICROSOFT_TEAMS") {
  const lines = rawTranscriptText.split(/\r\n|\n|\r/);
  const segments: ParsedTranscriptSegment[] = [];
  const warnings: ParsedTranscriptWarning[] = [];
  let current: WorkingSegment | null = null;

  function flushCurrent() {
    if (!current) {
      return;
    }

    const rawText = current.rawTextLines.join("\n").trimEnd();
    const normalized = normalizeText(rawText);
    const confidenceScore = finalConfidence(current, normalized);
    const segmentIndex = segments.length;
    const segment: ParsedTranscriptSegment = {
      segmentIndex,
      sourceLineStart: current.sourceLineStart,
      sourceLineEnd: current.sourceLineEnd,
      timestampStart: current.timestampStart,
      timestampEnd: current.timestampEnd,
      speakerRaw: current.speakerRaw,
      speakerNormalized: normalizeSpeaker(current.speakerRaw),
      rawText,
      normalizedText: normalized,
      confidenceScore,
      needsReview: confidenceScore < 0.8
    };
    segments.push(segment);

    if (!segment.timestampStart) {
      warnings.push({
        segmentIndex,
        warningType: "MISSING_TIMESTAMP",
        message: "Timestamp could not be parsed confidently for this segment.",
        severity: "WARNING"
      });
    }

    if (!segment.speakerRaw) {
      warnings.push({
        segmentIndex,
        warningType: "MISSING_SPEAKER",
        message: "Speaker label could not be parsed confidently for this segment.",
        severity: "WARNING"
      });
    }

    if (!segment.normalizedText) {
      warnings.push({
        segmentIndex,
        warningType: "EMPTY_SEGMENT_TEXT",
        message: "Segment text is empty after deterministic normalization.",
        severity: "WARNING"
      });
    }

    if (segment.needsReview) {
      warnings.push({
        segmentIndex,
        warningType: "LOW_CONFIDENCE_SEGMENT",
        message: "Segment confidence is below the OIMA-2 deterministic parser threshold.",
        severity: "WARNING"
      });
    }

    current = null;
  }

  lines.forEach((line, index) => {
    const lineNumber = index + 1;
    const header = detectTranscriptHeader(line);

    if (header) {
      flushCurrent();
      current = {
        sourceLineStart: lineNumber,
        sourceLineEnd: lineNumber,
        timestampStart: header.timestampStart,
        timestampEnd: header.timestampEnd,
        speakerRaw: header.speakerRaw,
        rawTextLines: header.initialText === null ? [] : [header.initialText],
        baseConfidence: parserType === "GENERIC_TEXT" && !header.timestampStart ? Math.min(header.baseConfidence, 0.72) : header.baseConfidence
      };
      return;
    }

    if (!current) {
      if (!line.trim()) {
        return;
      }

      current = {
        sourceLineStart: lineNumber,
        sourceLineEnd: lineNumber,
        timestampStart: null,
        timestampEnd: null,
        speakerRaw: null,
        rawTextLines: [line],
        baseConfidence: 0.5
      };
      return;
    }

    current.sourceLineEnd = lineNumber;
    current.rawTextLines.push(line);
  });

  flushCurrent();

  const confidenceScore =
    segments.length > 0 ? Number((segments.reduce((total, segment) => total + segment.confidenceScore, 0) / segments.length).toFixed(2)) : 0;
  const status: OimaTranscriptParseRunStatus = segments.length === 0 || warnings.length > 0 || confidenceScore < 0.8 ? "NEEDS_REVIEW" : "COMPLETED";

  return {
    parserType,
    status,
    segmentCount: segments.length,
    warningCount: warnings.length,
    confidenceScore,
    segments,
    warnings,
    normalizedContent: normalizedTranscriptContent(segments)
  };
}

function transcriptProcessingContract() {
  return {
    productCode: oimaProductContract.productCode,
    productName: oimaProductContract.productName,
    poweredBy: oimaProductContract.poweredBy,
    stage: "Stage 2K / OIMA-2",
    currentRuntimeCapabilities: oimaCurrentRuntimeCapabilities,
    plannedRuntimeCapabilities: oimaPlannedRuntimeCapabilities,
    transcriptVersionTypes: oimaTranscriptVersionTypes,
    transcriptParserTypes: oimaTranscriptParserTypes,
    transcriptParseRunStatuses: oimaTranscriptParseRunStatuses,
    transcriptParseWarningSeverities: oimaTranscriptParseWarningSeverities,
    rawTranscriptImmutable: true,
    normalizedTranscriptSeparate: true,
    correctedTranscriptPlanned: true,
    parserDeterministic: true,
    supportedParserTypes: ["MICROSOFT_TEAMS", "GENERIC_TEXT"],
    runtimeBoundary: {
      meetingIntakeImplemented: true,
      transcriptProcessingImplemented: true,
      rawTranscriptOverwriteAllowed: false,
      audioProcessingImplemented: false,
      diarizationImplemented: false,
      issueDecisionActionRiskExtractionImplemented: false,
      meetingAnalyticsImplemented: false,
      listenerModeImplemented: false,
      liveSpeakingAgentImplemented: false,
      voiceCloneImplemented: false,
      realLlmCallsEnabled: false,
      fakeMeetingAnalysisCreated: false
    }
  };
}

function serializeVersion(version: OimaTranscriptVersionRow) {
  return {
    id: version.id,
    meetingId: version.meetingId,
    sourceFileId: version.sourceFileId,
    versionType: version.versionType,
    versionNumber: version.versionNumber,
    rawContentHash: version.rawContentHash,
    contentStorageKey: version.contentStorageKey,
    contentTextAvailable: Boolean(version.contentText),
    contentTextLength: version.contentText?.length ?? 0,
    isImmutable: version.isImmutable,
    createdBy: version.createdBy,
    createdAt: toIsoString(version.createdAt)
  };
}

function serializeParseRun(parseRun: OimaTranscriptParseRunRow | null) {
  return parseRun
    ? {
        id: parseRun.id,
        meetingId: parseRun.meetingId,
        sourceFileId: parseRun.sourceFileId,
        rawVersionId: parseRun.rawVersionId,
        normalizedVersionId: parseRun.normalizedVersionId,
        parserType: parseRun.parserType,
        status: parseRun.status,
        segmentCount: parseRun.segmentCount,
        warningCount: parseRun.warningCount,
        confidenceScore: parseRun.confidenceScore,
        startedAt: toIsoString(parseRun.startedAt),
        completedAt: toIsoString(parseRun.completedAt),
        errorMessage: parseRun.errorMessage
      }
    : null;
}

function serializeSegment(segment: OimaTranscriptSegmentRow) {
  return {
    id: segment.id,
    meetingId: segment.meetingId,
    transcriptVersionId: segment.transcriptVersionId,
    parseRunId: segment.parseRunId,
    segmentIndex: segment.segmentIndex,
    sourceLineStart: segment.sourceLineStart,
    sourceLineEnd: segment.sourceLineEnd,
    timestampStart: segment.timestampStart,
    timestampEnd: segment.timestampEnd,
    speakerRaw: segment.speakerRaw,
    speakerNormalized: segment.speakerNormalized,
    rawText: segment.rawText,
    normalizedText: segment.normalizedText,
    confidenceScore: segment.confidenceScore,
    needsReview: segment.needsReview,
    createdAt: toIsoString(segment.createdAt)
  };
}

function serializeWarning(warning: OimaTranscriptParseWarningRow) {
  return {
    id: warning.id,
    parseRunId: warning.parseRunId,
    segmentId: warning.segmentId,
    warningType: warning.warningType,
    message: warning.message,
    severity: warning.severity,
    createdAt: toIsoString(warning.createdAt)
  };
}

async function loadMeeting(prisma: Stage2KPrisma, id: string) {
  return prisma.oimaMeetingRecord.findUnique({
    where: { id },
    include: meetingInclude
  });
}

function selectTranscriptSourceFile(meeting: OimaMeetingRecordRow, sourceFileId?: string) {
  const sourceFiles = meeting.sourceFiles ?? [];
  return sourceFileId ? sourceFiles.find((file) => file.id === sourceFileId) ?? null : sourceFiles.find((file) => file.fileType === "TRANSCRIPT") ?? null;
}

function nextVersionNumber(versions: OimaTranscriptVersionRow[], versionType: OimaTranscriptVersionType) {
  return versions.filter((version) => version.versionType === versionType).reduce((max, version) => Math.max(max, version.versionNumber), 0) + 1;
}

async function auditTranscriptWrite(
  prisma: Stage2KPrisma,
  input: {
    organizationId: string;
    workspaceId: string;
    action: string;
    targetType: string;
    targetId: string;
    metadata: Record<string, unknown>;
  }
) {
  await prisma.auditRecord.create({
    data: {
      id: `audit_oima_transcript_${randomUUID()}`,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      sensitive: true,
      metadata: {
        productKey: "OIMA",
        canonicalKnowledgeWrite: false,
        rawTranscriptOverwriteAllowed: false,
        noLlmCalls: true,
        noFakeMeetingAnalysis: true,
        ...input.metadata
      }
    }
  });
}

async function latestParseRun(prisma: Stage2KPrisma, meetingId: string) {
  const runs = await prisma.oimaTranscriptParseRun.findMany({
    where: { meetingId },
    orderBy: { startedAt: "desc" },
    take: 1
  });
  return runs[0] ?? null;
}

async function latestWarnings(prisma: Stage2KPrisma, meetingId: string, parseRunId?: string) {
  const run = parseRunId
    ? (
        await prisma.oimaTranscriptParseRun.findMany({
          where: { id: parseRunId, meetingId },
          take: 1
        })
      )[0] ?? null
    : await latestParseRun(prisma, meetingId);

  if (!run) {
    return [];
  }

  return prisma.oimaTranscriptParseWarning.findMany({
    where: { parseRunId: run.id },
    orderBy: { createdAt: "asc" }
  });
}

export function registerStage2KRoutes(app: FastifyInstance, prisma: Stage2KPrisma, registryMetadata: RegistryMetadataFactory) {
  app.get("/platform/oima/transcripts/contract", async () => ({
    metadata: registryMetadata(),
    transcriptProcessingContract: transcriptProcessingContract(),
    noLlmCalls: true,
    noFakeMeetingAnalysis: true,
    noAudioProcessing: true
  }));

  app.post("/platform/oima/meetings/:id/transcript/process", async (request, reply) => {
    const metadata = registryMetadata();
    const params = request.params as { id: string };
    const parsedBody = processTranscriptSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return replyBadRequest(reply, metadata, "OIMA_TRANSCRIPT_VALIDATION_FAILED", "Transcript processing payload failed validation.", validationDetails(parsedBody.error));
    }

    const meeting = await loadMeeting(prisma, params.id);

    if (!meeting) {
      return replyNotFound(reply, metadata, "oimaMeeting", { id: params.id });
    }

    const sourceFile = selectTranscriptSourceFile(meeting, parsedBody.data.sourceFileId);

    if (!sourceFile) {
      return replyBadRequest(reply, metadata, "OIMA_TRANSCRIPT_SOURCE_FILE_REQUIRED", "A registered transcript source file is required before processing.");
    }

    if (sourceFile.fileType !== "TRANSCRIPT") {
      return replyBadRequest(reply, metadata, "OIMA_TRANSCRIPT_SOURCE_FILE_REQUIRED", "Selected source file is not a transcript source file.", [
        { sourceFileId: sourceFile.id, fileType: sourceFile.fileType }
      ]);
    }

    const rawContentHash = sha256Content(parsedBody.data.rawTranscriptText);
    const existingVersions = await prisma.oimaTranscriptVersion.findMany({
      where: { meetingId: meeting.id, sourceFileId: sourceFile.id },
      orderBy: { createdAt: "asc" }
    });
    const existingRawVersion = existingVersions.find((version) => version.versionType === "RAW" && version.rawContentHash === rawContentHash) ?? null;
    const parsedTranscript = parseOimaTranscript(parsedBody.data.rawTranscriptText, parsedBody.data.parserType);

    const rawVersion =
      existingRawVersion ??
      (await prisma.oimaTranscriptVersion.create({
        data: {
          id: `oima_transcript_version_${randomUUID()}`,
          meetingId: meeting.id,
          sourceFileId: sourceFile.id,
          versionType: "RAW",
          versionNumber: nextVersionNumber(existingVersions, "RAW"),
          rawContentHash,
          contentText: parsedBody.data.rawTranscriptText,
          isImmutable: true,
          createdBy: parsedBody.data.createdBy
        }
      }));

    const normalizedVersion = await prisma.oimaTranscriptVersion.create({
      data: {
        id: `oima_transcript_version_${randomUUID()}`,
        meetingId: meeting.id,
        sourceFileId: sourceFile.id,
        versionType: "NORMALIZED",
        versionNumber: nextVersionNumber(existingVersions, "NORMALIZED"),
        rawContentHash,
        contentText: parsedTranscript.normalizedContent,
        isImmutable: false,
        createdBy: parsedBody.data.createdBy
      }
    });

    const completedAt = new Date();
    const parseRun = await prisma.oimaTranscriptParseRun.create({
      data: {
        id: `oima_transcript_parse_run_${randomUUID()}`,
        meetingId: meeting.id,
        sourceFileId: sourceFile.id,
        rawVersionId: rawVersion.id,
        normalizedVersionId: normalizedVersion.id,
        parserType: parsedBody.data.parserType,
        status: parsedTranscript.status,
        segmentCount: parsedTranscript.segmentCount,
        warningCount: parsedTranscript.warningCount,
        confidenceScore: parsedTranscript.confidenceScore,
        startedAt: completedAt,
        completedAt,
        errorMessage: null
      }
    });

    const segmentRows: OimaTranscriptSegmentRow[] = parsedTranscript.segments.map((segment) => ({
      id: `oima_transcript_segment_${randomUUID()}`,
      meetingId: meeting.id,
      transcriptVersionId: normalizedVersion.id,
      parseRunId: parseRun.id,
      segmentIndex: segment.segmentIndex,
      sourceLineStart: segment.sourceLineStart,
      sourceLineEnd: segment.sourceLineEnd,
      timestampStart: segment.timestampStart,
      timestampEnd: segment.timestampEnd,
      speakerRaw: segment.speakerRaw,
      speakerNormalized: segment.speakerNormalized,
      rawText: segment.rawText,
      normalizedText: segment.normalizedText,
      confidenceScore: segment.confidenceScore,
      needsReview: segment.needsReview,
      createdAt: completedAt
    }));

    if (segmentRows.length > 0) {
      await prisma.oimaTranscriptSegment.createMany({ data: segmentRows });
    }

    const warningRows: OimaTranscriptParseWarningRow[] = parsedTranscript.warnings.map((warning) => {
      const segment = segmentRows.find((item) => item.segmentIndex === warning.segmentIndex) ?? null;
      return {
        id: `oima_transcript_warning_${randomUUID()}`,
        parseRunId: parseRun.id,
        segmentId: segment?.id ?? null,
        warningType: warning.warningType,
        message: warning.message,
        severity: warning.severity,
        createdAt: completedAt
      };
    });

    if (warningRows.length > 0) {
      await prisma.oimaTranscriptParseWarning.createMany({ data: warningRows });
    }

    await prisma.oimaMeetingRecord.update({
      where: { id: meeting.id },
      data: {
        confidenceScore: parsedTranscript.confidenceScore,
        ...(parsedTranscript.status === "NEEDS_REVIEW" ? { status: "NEEDS_REVIEW" } : {})
      }
    });

    await auditTranscriptWrite(prisma, {
      organizationId: meeting.organizationId,
      workspaceId: meeting.workspaceId,
      action: "OIMA_TRANSCRIPT_PROCESSED",
      targetType: "OimaTranscriptParseRun",
      targetId: parseRun.id,
      metadata: {
        meetingId: meeting.id,
        sourceFileId: sourceFile.id,
        rawVersionId: rawVersion.id,
        normalizedVersionId: normalizedVersion.id,
        rawContentHash,
        status: parseRun.status,
        segmentCount: parseRun.segmentCount,
        warningCount: parseRun.warningCount,
        confidenceScore: parseRun.confidenceScore,
        issueDecisionActionRiskExtractionImplemented: false,
        audioProcessingImplemented: false
      }
    });

    return reply.code(201).send({
      metadata,
      transcriptProcessingContract: transcriptProcessingContract(),
      parseRun: serializeParseRun(parseRun),
      rawVersion: serializeVersion(rawVersion),
      normalizedVersion: serializeVersion(normalizedVersion),
      segments: segmentRows.map(serializeSegment),
      warnings: warningRows.map(serializeWarning),
      noLlmCalls: true,
      noFakeMeetingAnalysis: true,
      noAudioProcessing: true,
      noIssueDecisionActionRiskExtraction: true
    });
  });

  app.get("/platform/oima/meetings/:id/transcript/status", async (request, reply) => {
    const metadata = registryMetadata();
    const params = request.params as { id: string };
    const meeting = await loadMeeting(prisma, params.id);

    if (!meeting) {
      return replyNotFound(reply, metadata, "oimaMeeting", { id: params.id });
    }

    const parseRun = await latestParseRun(prisma, meeting.id);

    return {
      metadata,
      transcriptProcessingContract: transcriptProcessingContract(),
      meetingId: meeting.id,
      latestParseRun: serializeParseRun(parseRun),
      noLlmCalls: true,
      noFakeMeetingAnalysis: true
    };
  });

  app.get("/platform/oima/meetings/:id/transcript/versions", async (request, reply) => {
    const metadata = registryMetadata();
    const params = request.params as { id: string };
    const meeting = await loadMeeting(prisma, params.id);

    if (!meeting) {
      return replyNotFound(reply, metadata, "oimaMeeting", { id: params.id });
    }

    const versions = await prisma.oimaTranscriptVersion.findMany({
      where: { meetingId: meeting.id },
      orderBy: { createdAt: "asc" }
    });

    return {
      metadata,
      transcriptProcessingContract: transcriptProcessingContract(),
      meetingId: meeting.id,
      versions: versions.map(serializeVersion),
      count: versions.length,
      rawTranscriptImmutable: true,
      normalizedTranscriptSeparate: true
    };
  });

  app.get("/platform/oima/meetings/:id/transcript/segments", async (request, reply) => {
    const metadata = registryMetadata();
    const params = request.params as { id: string };
    const query = request.query as { parseRunId?: string };
    const meeting = await loadMeeting(prisma, params.id);

    if (!meeting) {
      return replyNotFound(reply, metadata, "oimaMeeting", { id: params.id });
    }

    const segments = await prisma.oimaTranscriptSegment.findMany({
      where: {
        meetingId: meeting.id,
        ...(query.parseRunId ? { parseRunId: query.parseRunId } : {})
      },
      orderBy: { segmentIndex: "asc" }
    });

    return {
      metadata,
      transcriptProcessingContract: transcriptProcessingContract(),
      meetingId: meeting.id,
      segments: segments.map(serializeSegment),
      count: segments.length,
      noLlmCalls: true,
      noFakeMeetingAnalysis: true
    };
  });

  app.get("/platform/oima/meetings/:id/transcript/warnings", async (request, reply) => {
    const metadata = registryMetadata();
    const params = request.params as { id: string };
    const query = request.query as { parseRunId?: string };
    const meeting = await loadMeeting(prisma, params.id);

    if (!meeting) {
      return replyNotFound(reply, metadata, "oimaMeeting", { id: params.id });
    }

    const warnings = await latestWarnings(prisma, meeting.id, query.parseRunId);

    return {
      metadata,
      transcriptProcessingContract: transcriptProcessingContract(),
      meetingId: meeting.id,
      warnings: warnings.map(serializeWarning),
      count: warnings.length,
      noLlmCalls: true,
      noFakeMeetingAnalysis: true
    };
  });
}
