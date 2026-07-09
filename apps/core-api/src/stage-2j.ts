import { randomUUID } from "node:crypto";
import type { FastifyInstance, FastifyReply } from "fastify";
import { z } from "zod";
import {
  oimaCurrentRuntimeCapabilities,
  oimaMeetingSourceFileTypes,
  oimaMeetingSourceUploadStatuses,
  oimaMeetingStatuses,
  oimaPlannedRuntimeCapabilities,
  oimaProductContract,
  oimaSourceModes,
  type OimaMeetingSourceFileType,
  type OimaMeetingSourceUploadStatus,
  type OimaMeetingStatus,
  type OimaSourceMode
} from "@ois/architecture-contracts";

type RegistryMetadata = {
  source: string;
  mode: string;
  environment: string;
  generatedAt: string;
};

type RegistryMetadataFactory = () => RegistryMetadata;

type WorkspaceRow = {
  id: string;
  organizationId: string;
};

type OimaMeetingSourceFileRow = {
  id: string;
  meetingId: string;
  fileType: OimaMeetingSourceFileType;
  originalFilename: string;
  storageKey: string | null;
  storageUrl: string | null;
  mimeType: string | null;
  sizeBytes: number;
  checksum: string | null;
  uploadStatus: OimaMeetingSourceUploadStatus;
  createdAt: Date | string;
};

type OimaMeetingRecordRow = {
  id: string;
  organizationId: string;
  workspaceId: string;
  title: string;
  meetingDate: Date | string;
  startTime: string | null;
  endTime: string | null;
  sourceMode: OimaSourceMode;
  participantCount: number;
  status: OimaMeetingStatus;
  confidenceScore: number;
  createdAt: Date | string;
  updatedAt: Date | string;
  sourceFiles?: OimaMeetingSourceFileRow[];
};

type CreateArgs<T> = { data: T; include?: Record<string, unknown> };
type FindUniqueArgs = { where: { id: string }; include?: Record<string, unknown> };
type FindManyArgs = { where?: Record<string, unknown>; include?: Record<string, unknown>; orderBy?: Record<string, string>; take?: number };
type UpdateArgs<T> = { where: { id: string }; data: Partial<T>; include?: Record<string, unknown> };

export type Stage2JPrisma = {
  auditRecord: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<unknown>;
  };
  workspace: {
    findUnique(args: FindUniqueArgs): Promise<WorkspaceRow | null>;
  };
  oimaMeetingRecord: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<OimaMeetingRecordRow>;
    findMany(args?: FindManyArgs): Promise<OimaMeetingRecordRow[]>;
    findUnique(args: FindUniqueArgs): Promise<OimaMeetingRecordRow | null>;
    update(args: UpdateArgs<OimaMeetingRecordRow>): Promise<OimaMeetingRecordRow>;
  };
  oimaMeetingSourceFile: {
    create(args: CreateArgs<Record<string, unknown>>): Promise<OimaMeetingSourceFileRow>;
  };
};

const meetingInclude = {
  sourceFiles: {
    orderBy: { createdAt: "asc" }
  }
} as const;

const sourceModeSchema = z.enum(oimaSourceModes);
const meetingStatusSchema = z.enum(oimaMeetingStatuses);
const sourceFileTypeSchema = z.enum(oimaMeetingSourceFileTypes);
const uploadStatusSchema = z.enum(oimaMeetingSourceUploadStatuses);
const optionalTrimmedString = z
  .string()
  .trim()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

const sourceFileInputSchema = z
  .object({
    fileType: sourceFileTypeSchema,
    originalFilename: z.string().trim().min(1),
    storageKey: optionalTrimmedString,
    storageUrl: optionalTrimmedString,
    mimeType: optionalTrimmedString,
    sizeBytes: z.number().int().nonnegative().default(0),
    checksum: optionalTrimmedString,
    uploadStatus: uploadStatusSchema.default("REGISTERED")
  })
  .refine((value) => Boolean(value.storageKey || value.storageUrl), {
    message: "storageKey or storageUrl is required",
    path: ["storageKey"]
  });

const meetingDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "meetingDate must use YYYY-MM-DD");
const timeSchema = z.string().regex(/^\d{2}:\d{2}$/, "time must use HH:mm");

const createMeetingSchema = z.object({
  organizationId: optionalTrimmedString,
  workspaceId: z.string().trim().min(1),
  title: z.string().trim().min(1),
  meetingDate: meetingDateSchema,
  startTime: timeSchema.optional(),
  endTime: timeSchema.optional(),
  sourceMode: sourceModeSchema,
  participantCount: z.number().int().nonnegative().default(0),
  sourceFiles: z.array(sourceFileInputSchema).default([])
});

const statusUpdateSchema = z.object({
  status: meetingStatusSchema,
  actorId: optionalTrimmedString,
  reason: optionalTrimmedString
});

function replyBadRequest(reply: FastifyReply, metadata: RegistryMetadata, code: string, message: string, details: unknown[] = []) {
  return reply.code(400).send({
    metadata,
    error: {
      code,
      message,
      details
    }
  });
}

function validationDetails(error: z.ZodError) {
  return error.issues.map((issue) => ({
    path: issue.path.join("."),
    message: issue.message
  }));
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

function toIsoString(value: Date | string) {
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

function toMeetingDate(value: string) {
  return new Date(`${value}T00:00:00.000Z`);
}

function sourcePresence(files: Array<{ fileType: OimaMeetingSourceFileType }>) {
  return {
    transcriptPresent: files.some((file) => file.fileType === "TRANSCRIPT"),
    audioPresent: files.some((file) => file.fileType === "AUDIO")
  };
}

function validateFilesForSourceMode(sourceMode: OimaSourceMode, files: Array<{ fileType: OimaMeetingSourceFileType }>) {
  const issues: string[] = [];
  const presence = sourcePresence(files);

  if (sourceMode === "LISTENER_CAPTURED") {
    issues.push("LISTENER_CAPTURED remains planned/not-runtime in OIMA-1.");
  }

  if (files.length === 0) {
    return issues;
  }

  if (sourceMode === "TRANSCRIPT_ONLY") {
    if (!presence.transcriptPresent) {
      issues.push("TRANSCRIPT_ONLY requires a transcript source file when source files are registered.");
    }
    if (presence.audioPresent) {
      issues.push("TRANSCRIPT_ONLY cannot register audio metadata; use TRANSCRIPT_AND_AUDIO.");
    }
  }

  if (sourceMode === "TRANSCRIPT_AND_AUDIO" && !presence.transcriptPresent) {
    issues.push("TRANSCRIPT_AND_AUDIO requires transcript metadata before optional audio metadata.");
  }

  if (sourceMode === "AUDIO_ONLY") {
    if (!presence.audioPresent) {
      issues.push("AUDIO_ONLY requires audio metadata when source files are registered.");
    }
    if (presence.transcriptPresent) {
      issues.push("AUDIO_ONLY cannot register transcript metadata; use TRANSCRIPT_ONLY or TRANSCRIPT_AND_AUDIO.");
    }
  }

  return issues;
}

function deriveMeetingStatus(sourceMode: OimaSourceMode, files: Array<{ fileType: OimaMeetingSourceFileType }>): OimaMeetingStatus {
  if (files.length === 0) {
    return "DRAFT";
  }

  const presence = sourcePresence(files);

  if (presence.transcriptPresent) {
    return "READY_FOR_PROCESSING";
  }

  if (sourceMode === "AUDIO_ONLY" && presence.audioPresent) {
    return "NEEDS_REVIEW";
  }

  return "UPLOADED";
}

function serializeSourceFile(file: OimaMeetingSourceFileRow) {
  return {
    id: file.id,
    meetingId: file.meetingId,
    fileType: file.fileType,
    originalFilename: file.originalFilename,
    storageKey: file.storageKey,
    storageUrl: file.storageUrl,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    checksum: file.checksum,
    uploadStatus: file.uploadStatus,
    createdAt: toIsoString(file.createdAt)
  };
}

function serializeMeeting(meeting: OimaMeetingRecordRow) {
  const sourceFiles = (meeting.sourceFiles ?? []).map(serializeSourceFile);
  const presence = sourcePresence(sourceFiles);

  return {
    id: meeting.id,
    organizationId: meeting.organizationId,
    workspaceId: meeting.workspaceId,
    title: meeting.title,
    meetingDate: toIsoString(meeting.meetingDate).slice(0, 10),
    startTime: meeting.startTime,
    endTime: meeting.endTime,
    sourceMode: meeting.sourceMode,
    participantCount: meeting.participantCount,
    status: meeting.status,
    confidenceScore: meeting.confidenceScore,
    transcriptPresent: presence.transcriptPresent,
    audioPresent: presence.audioPresent,
    sourceFileCount: sourceFiles.length,
    sourceFiles,
    createdAt: toIsoString(meeting.createdAt),
    updatedAt: toIsoString(meeting.updatedAt)
  };
}

function intakeContract() {
  return {
    productCode: oimaProductContract.productCode,
    productName: oimaProductContract.productName,
    poweredBy: oimaProductContract.poweredBy,
    stage: "Stage 2J / OIMA-1",
    sourceModes: oimaSourceModes,
    meetingStatuses: oimaMeetingStatuses,
    sourceFileTypes: oimaMeetingSourceFileTypes,
    uploadStatuses: oimaMeetingSourceUploadStatuses,
    currentRuntimeCapabilities: oimaCurrentRuntimeCapabilities,
    plannedRuntimeCapabilities: oimaPlannedRuntimeCapabilities,
    transcriptFirst: true,
    audioOptional: true,
    runtimeBoundary: {
      meetingIntakeImplemented: true,
      transcriptProcessingImplemented: false,
      audioProcessingImplemented: false,
      listenerModeImplemented: false,
      liveSpeakingAgentImplemented: false,
      voiceCloneImplemented: false,
      realLlmCallsEnabled: false,
      fakeMeetingAnalysisCreated: false
    },
    nextStepPlaceholders: ["Transcript Processing", "OIS Agent Analysis", "Clarification Review", "Dashboard"]
  };
}

async function auditOimaWrite(
  prisma: Stage2JPrisma,
  input: {
    organizationId: string;
    workspaceId: string;
    actorId?: string | null;
    action: string;
    targetType: string;
    targetId: string;
    metadata: Record<string, unknown>;
  }
) {
  await prisma.auditRecord.create({
    data: {
      id: `audit_oima_${randomUUID()}`,
      organizationId: input.organizationId,
      workspaceId: input.workspaceId,
      actorId: input.actorId ?? undefined,
      action: input.action,
      targetType: input.targetType,
      targetId: input.targetId,
      sensitive: true,
      metadata: {
        productKey: "OIMA",
        canonicalKnowledgeWrite: false,
        ...input.metadata
      }
    }
  });
}

async function loadMeeting(prisma: Stage2JPrisma, id: string) {
  return prisma.oimaMeetingRecord.findUnique({
    where: { id },
    include: meetingInclude
  });
}

function sourceFileCreateData(file: z.infer<typeof sourceFileInputSchema>, meetingId?: string) {
  return {
    id: `oima_source_file_${randomUUID()}`,
    ...(meetingId ? { meetingId } : {}),
    fileType: file.fileType,
    originalFilename: file.originalFilename,
    storageKey: file.storageKey,
    storageUrl: file.storageUrl,
    mimeType: file.mimeType,
    sizeBytes: file.sizeBytes,
    checksum: file.checksum,
    uploadStatus: file.uploadStatus
  };
}

export function registerStage2JRoutes(app: FastifyInstance, prisma: Stage2JPrisma, registryMetadata: RegistryMetadataFactory) {
  app.get("/platform/oima/meetings", async (request) => {
    const query = request.query as { workspaceId?: string; organizationId?: string };
    const meetings = await prisma.oimaMeetingRecord.findMany({
      where: {
        ...(query.workspaceId ? { workspaceId: query.workspaceId } : {}),
        ...(query.organizationId ? { organizationId: query.organizationId } : {})
      },
      include: meetingInclude,
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return {
      metadata: registryMetadata(),
      intakeContract: intakeContract(),
      meetings: meetings.map(serializeMeeting),
      count: meetings.length,
      noFakeMeetingAnalysis: true,
      noLlmCalls: true
    };
  });

  app.post("/platform/oima/meetings", async (request, reply) => {
    const metadata = registryMetadata();
    const parsedBody = createMeetingSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return replyBadRequest(reply, metadata, "OIMA_MEETING_VALIDATION_FAILED", "Meeting intake payload failed validation.", validationDetails(parsedBody.error));
    }

    const body = parsedBody.data;
    const workspace = await prisma.workspace.findUnique({ where: { id: body.workspaceId } });

    if (!workspace) {
      return replyNotFound(reply, metadata, "workspace", { id: body.workspaceId });
    }

    if (body.organizationId && body.organizationId !== workspace.organizationId) {
      return replyBadRequest(reply, metadata, "WORKSPACE_ORGANIZATION_MISMATCH", "workspaceId does not belong to organizationId.");
    }

    const validationIssues = validateFilesForSourceMode(body.sourceMode, body.sourceFiles);

    if (validationIssues.length > 0) {
      return replyBadRequest(reply, metadata, "OIMA_SOURCE_MODE_NOT_SUPPORTED", "Meeting source metadata does not match the OIMA-1 source-mode contract.", validationIssues);
    }

    const meeting = await prisma.oimaMeetingRecord.create({
      data: {
        id: `oima_meeting_${randomUUID()}`,
        organizationId: workspace.organizationId,
        workspaceId: body.workspaceId,
        title: body.title,
        meetingDate: toMeetingDate(body.meetingDate),
        startTime: body.startTime,
        endTime: body.endTime,
        sourceMode: body.sourceMode,
        participantCount: body.participantCount,
        status: deriveMeetingStatus(body.sourceMode, body.sourceFiles),
        confidenceScore: 0,
        ...(body.sourceFiles.length > 0
          ? {
              sourceFiles: {
                create: body.sourceFiles.map((file) => sourceFileCreateData(file))
              }
            }
          : {})
      },
      include: meetingInclude
    });

    await auditOimaWrite(prisma, {
      organizationId: meeting.organizationId,
      workspaceId: meeting.workspaceId,
      action: "OIMA_MEETING_CREATED",
      targetType: "OimaMeetingRecord",
      targetId: meeting.id,
      metadata: {
        sourceMode: meeting.sourceMode,
        status: meeting.status,
        sourceFileCount: meeting.sourceFiles?.length ?? 0,
        transcriptProcessingImplemented: false,
        audioProcessingImplemented: false,
        listenerModeImplemented: false
      }
    });

    return reply.code(201).send({
      metadata,
      intakeContract: intakeContract(),
      meeting: serializeMeeting(meeting),
      processingStatusPlaceholders: intakeContract().nextStepPlaceholders,
      noFakeMeetingAnalysis: true,
      noLlmCalls: true
    });
  });

  app.get("/platform/oima/meetings/:id", async (request, reply) => {
    const params = request.params as { id: string };
    const meeting = await loadMeeting(prisma, params.id);

    if (!meeting) {
      return replyNotFound(reply, registryMetadata(), "oimaMeeting", { id: params.id });
    }

    return {
      metadata: registryMetadata(),
      intakeContract: intakeContract(),
      meeting: serializeMeeting(meeting),
      plannedNextSteps: intakeContract().nextStepPlaceholders,
      noFakeMeetingAnalysis: true,
      noLlmCalls: true
    };
  });

  app.post("/platform/oima/meetings/:id/source-files", async (request, reply) => {
    const metadata = registryMetadata();
    const params = request.params as { id: string };
    const parsedBody = sourceFileInputSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return replyBadRequest(reply, metadata, "OIMA_SOURCE_FILE_VALIDATION_FAILED", "Source file metadata failed validation.", validationDetails(parsedBody.error));
    }

    const body = parsedBody.data;
    const existing = await loadMeeting(prisma, params.id);

    if (!existing) {
      return replyNotFound(reply, metadata, "oimaMeeting", { id: params.id });
    }

    const validationIssues = validateFilesForSourceMode(existing.sourceMode, [...(existing.sourceFiles ?? []), body]);

    if (validationIssues.length > 0) {
      return replyBadRequest(reply, metadata, "OIMA_SOURCE_FILE_CONTRACT_MISMATCH", "Source file metadata does not match the meeting source-mode contract.", validationIssues);
    }

    const sourceFile = await prisma.oimaMeetingSourceFile.create({
      data: sourceFileCreateData(body, existing.id)
    });
    const nextStatus = deriveMeetingStatus(existing.sourceMode, [...(existing.sourceFiles ?? []), sourceFile]);
    const meeting =
      nextStatus !== existing.status
        ? await prisma.oimaMeetingRecord.update({
            where: { id: existing.id },
            data: { status: nextStatus },
            include: meetingInclude
          })
        : await loadMeeting(prisma, existing.id);

    await auditOimaWrite(prisma, {
      organizationId: existing.organizationId,
      workspaceId: existing.workspaceId,
      action: "OIMA_MEETING_SOURCE_FILE_REGISTERED",
      targetType: "OimaMeetingSourceFile",
      targetId: sourceFile.id,
      metadata: {
        meetingId: existing.id,
        fileType: sourceFile.fileType,
        uploadStatus: sourceFile.uploadStatus,
        meetingStatus: nextStatus,
        transcriptProcessingImplemented: false,
        audioProcessingImplemented: false
      }
    });

    return reply.code(201).send({
      metadata,
      intakeContract: intakeContract(),
      meeting: meeting ? serializeMeeting(meeting) : null,
      sourceFile: serializeSourceFile(sourceFile),
      noFakeMeetingAnalysis: true,
      noLlmCalls: true
    });
  });

  app.patch("/platform/oima/meetings/:id/status", async (request, reply) => {
    const metadata = registryMetadata();
    const params = request.params as { id: string };
    const parsedBody = statusUpdateSchema.safeParse(request.body);

    if (!parsedBody.success) {
      return replyBadRequest(reply, metadata, "OIMA_STATUS_VALIDATION_FAILED", "Meeting status payload failed validation.", validationDetails(parsedBody.error));
    }

    const body = parsedBody.data;
    const existing = await loadMeeting(prisma, params.id);

    if (!existing) {
      return replyNotFound(reply, metadata, "oimaMeeting", { id: params.id });
    }

    const meeting = await prisma.oimaMeetingRecord.update({
      where: { id: existing.id },
      data: { status: body.status },
      include: meetingInclude
    });

    await auditOimaWrite(prisma, {
      organizationId: meeting.organizationId,
      workspaceId: meeting.workspaceId,
      ...(body.actorId ? { actorId: body.actorId } : {}),
      action: "OIMA_MEETING_STATUS_UPDATED",
      targetType: "OimaMeetingRecord",
      targetId: meeting.id,
      metadata: {
        previousStatus: existing.status,
        nextStatus: meeting.status,
        reason: body.reason,
        fakeMeetingAnalysisCreated: false
      }
    });

    return {
      metadata,
      intakeContract: intakeContract(),
      meeting: serializeMeeting(meeting),
      noFakeMeetingAnalysis: true,
      noLlmCalls: true
    };
  });
}
