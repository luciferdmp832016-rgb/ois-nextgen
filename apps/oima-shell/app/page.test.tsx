import { renderToStaticMarkup } from "react-dom/server";
import type { ReactElement } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import Page from "./page";
import AnalysisPage from "./analysis/page";
import ClarificationPage from "./clarification/page";
import DashboardPage from "./dashboard/page";
import ListenerPage from "./listener/page";
import MeetingDetailPage from "./meetings/[id]/page";
import MeetingsPage from "./meetings/page";
import NewMeetingPage from "./meetings/new/page";
import SelfImprovementPage from "./self-improvement/page";

const coreApiUrl = "https://ois-nextgen.abacusai.cloud";
const oimaPublicBaseUrl = "https://oima.dmp247.com";
const dbEnvKey = ["DATABASE", "URL"].join("_");

const metadata = {
  source: "default-db",
  mode: "read-only",
  environment: "staging",
  generatedAt: "2026-07-10T00:00:00.000Z"
};

const healthPayload = {
  status: "ok",
  service: "core-api",
  stage: "bootstrap-stage-a"
};

const overviewPayload = {
  banner: "DEMO DATA - NOT PRODUCTION",
  kernel: {
    industries: 1,
    organizations: 1,
    workspaces: 1,
    projects: 2,
    products: 5,
    installations: 2,
    modules: 3,
    auditRecords: 1
  },
  phaseGates: {
    PLATFORM_KERNEL: "IN_PROGRESS"
  }
};

const registryPayload = {
  metadata,
  products: [{ id: "prod_oima", code: "OIMA", name: "OIMA", lifecycle: "ACTIVE", version: 1, modules: [], installations: [] }],
  organizations: [{ id: "org_pmc_demo", code: "PMC_DEMO", name: "PMC Demo", lifecycle: "ACTIVE", version: 1 }],
  workspaces: [
    {
      id: "ws_pmc_org_demo",
      code: "PMC_ORG_DEMO",
      name: "PMC Org Demo",
      organizationId: "org_pmc_demo",
      lifecycle: "ACTIVE",
      version: 1,
      organization: { code: "PMC_DEMO", name: "PMC Demo" },
      projects: [],
      installations: []
    }
  ],
  projects: [],
  modules: [],
  installations: []
};

const emptyRegistryStatus = {
  metadata,
  runtime: {
    coreApiBaseUrl: coreApiUrl,
    oisConsoleBaseUrl: "https://ois-ng.dmp247.com",
    pitsShellBaseUrl: "https://pits-ng.dmp247.com",
    oimaShellBaseUrl: oimaPublicBaseUrl,
    note: "Read-only test payload."
  },
  summary: { status: "Healthy", total: 0, healthy: 0, degraded: 0, unavailable: 0, missingUrl: 0 },
  entities: { products: [], workspaces: [], projects: [], modules: [], installations: [] }
};

const oimaBoundaryPayload = {
  metadata,
  productCode: "OIMA",
  productKey: "OIMA",
  productName: "Organizational Intelligence Meeting Agent",
  displayName: "OIMA - Organizational Intelligence Meeting Agent",
  productType: "MEETING_INTELLIGENCE_PRODUCT",
  implementationStatus: "PRODUCT_BOUNDARY_READY",
  poweredBy: "OIS",
  tagline: "OIS understands the organization. OIMA understands the meeting.",
  vietnamesePositioning: "OIS understands the organization. OIMA understands the meeting.",
  capabilityCodes: ["MEETING_LIBRARY", "TRANSCRIPT_PROCESSING"],
  currentRuntimeCapabilities: ["OVERVIEW", "PRODUCT_BOUNDARY", "KNOWLEDGE_API_LINKAGE", "MEETING_INTAKE", "TRANSCRIPT_PROCESSING"],
  plannedRuntimeCapabilities: ["AUDIO_PROCESSING", "OFFLINE_AGENT_ANALYSIS", "SUBJECT_CLARIFICATION", "SELF_IMPROVEMENT", "LISTENER_MODE"],
  sourceModes: ["TRANSCRIPT_ONLY", "AUDIO_ONLY", "TRANSCRIPT_AND_AUDIO", "LISTENER_CAPTURED"],
  sourceModeRules: { primarySourceMode: "TRANSCRIPT_ONLY", audioDoesNotBlockAnalysis: true },
  safetyBoundaries: ["NO_VOICE_CLONE", "NO_LLM_CALLS", "NO_FAKE_MEETING_ANALYSIS"],
  boundary: {
    noCanonicalKnowledgeWrite: true,
    meetingAnalyticsImplemented: false,
    listenerModeImplemented: false,
    realLlmCallsEnabled: false
  },
  productBoundaryMetadata: {
    standaloneAppShell: "READY",
    standaloneAppPath: "apps/oima-shell",
    standaloneServiceName: "ois-nextgen-oima-staging",
    standalonePort: 3002,
    customDomainFoundation: oimaPublicBaseUrl
  },
  emptyStateSurfaces: [
    {
      surfaceCode: "MEETING_LIBRARY",
      title: "Meeting Library",
      availability: "AVAILABLE_NOW",
      availableNow: true,
      runtimeEnabled: true,
      stage: "OIMA-1",
      statusLabel: "Available now",
      description: "Meeting library is runtime."
    },
    {
      surfaceCode: "UPLOAD_MEETING",
      title: "Upload Meeting",
      availability: "AVAILABLE_NOW",
      availableNow: true,
      runtimeEnabled: true,
      stage: "OIMA-1",
      statusLabel: "Available now",
      description: "Meeting registration is runtime."
    },
    {
      surfaceCode: "TRANSCRIPT_PROCESSING",
      title: "Transcript Processing",
      availability: "AVAILABLE_NOW",
      availableNow: true,
      runtimeEnabled: true,
      stage: "OIMA-2",
      statusLabel: "Available now",
      description: "Transcript processing is runtime."
    },
    {
      surfaceCode: "AGENT_ANALYSIS",
      title: "Agent Analysis",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-3",
      statusLabel: "Planned / not runtime",
      description: "Offline analysis is planned."
    },
    {
      surfaceCode: "LISTENER_MODE",
      title: "Listener Mode",
      availability: "PLANNED",
      availableNow: false,
      runtimeEnabled: false,
      stage: "OIMA-9",
      statusLabel: "Planned / not runtime",
      description: "Future permissioned recording only."
    }
  ],
  knowledgeIntegration: {
    sourceOfTruth: "OIS Canonical Knowledge Fabric",
    universalKnowledgeApiDisplayName: "Universal Knowledge API"
  },
  noCanonicalKnowledgeWrite: true,
  autoPromotionEnabled: false,
  oisAgentWidgetDirectCanonicalWriteAllowed: false
};

const meeting = {
  id: "oima_meeting_stage_2j_demo",
  organizationId: "org_pmc_demo",
  workspaceId: "ws_pmc_org_demo",
  title: "Stage 2J Transcript Intake",
  meetingDate: "2026-07-10",
  startTime: "09:00",
  endTime: "10:00",
  sourceMode: "TRANSCRIPT_AND_AUDIO",
  participantCount: 4,
  status: "READY_FOR_PROCESSING",
  confidenceScore: 0.88,
  transcriptPresent: true,
  audioPresent: true,
  sourceFileCount: 2,
  createdAt: "2026-07-10T00:00:00.000Z",
  updatedAt: "2026-07-10T00:00:00.000Z",
  sourceFiles: [
    {
      id: "oima_source_file_stage_2j_transcript",
      meetingId: "oima_meeting_stage_2j_demo",
      fileType: "TRANSCRIPT",
      originalFilename: "stage-2j-transcript.txt",
      storageKey: "oima/intake/stage-2j-transcript.txt",
      mimeType: "text/plain",
      sizeBytes: 2048,
      checksum: "sha256-transcript",
      uploadStatus: "REGISTERED",
      createdAt: "2026-07-10T00:00:00.000Z"
    },
    {
      id: "oima_source_file_stage_2j_audio",
      meetingId: "oima_meeting_stage_2j_demo",
      fileType: "AUDIO",
      originalFilename: "stage-2j-audio.mp3",
      storageKey: "oima/intake/stage-2j-audio.mp3",
      mimeType: "audio/mpeg",
      sizeBytes: 4096,
      checksum: "sha256-audio",
      uploadStatus: "REGISTERED",
      createdAt: "2026-07-10T00:00:00.000Z"
    }
  ]
};

const meetingLibraryPayload = {
  metadata,
  intakeContract: {
    meetingStatuses: ["DRAFT", "UPLOADED", "READY_FOR_PROCESSING", "NEEDS_REVIEW", "FAILED"],
    sourceFileTypes: ["TRANSCRIPT", "AUDIO", "PARTICIPANT_LIST", "OTHER"],
    uploadStatuses: ["REGISTERED", "UPLOADED", "FAILED"]
  },
  meetings: [meeting],
  count: 1,
  noFakeMeetingAnalysis: true,
  noLlmCalls: true
};

const transcriptProcessingContract = {
  stage: "Stage 2K / OIMA-2",
  transcriptProcessing: "TRANSCRIPT_PROCESSING",
  rawTranscriptImmutable: true,
  normalizedTranscriptSeparate: true,
  noLlmCalls: true,
  noFakeMeetingAnalysis: true
};

const latestParseRun = {
  id: "oima_transcript_parse_run_stage_2k",
  meetingId: meeting.id,
  sourceFileId: "oima_source_file_stage_2j_transcript",
  rawVersionId: "oima_transcript_version_stage_2k_raw",
  normalizedVersionId: "oima_transcript_version_stage_2k_normalized",
  parserType: "MICROSOFT_TEAMS",
  status: "COMPLETED",
  segmentCount: 1,
  warningCount: 0,
  confidenceScore: 0.91,
  startedAt: "2026-07-10T00:00:00.000Z",
  completedAt: "2026-07-10T00:01:00.000Z",
  errorMessage: null
};

const transcriptVersion = {
  id: "oima_transcript_version_stage_2k_raw",
  meetingId: meeting.id,
  sourceFileId: "oima_source_file_stage_2j_transcript",
  versionType: "RAW",
  versionNumber: 1,
  rawContentHash: "sha256-raw-transcript-hash",
  contentStorageKey: null,
  contentTextAvailable: true,
  contentTextLength: 120,
  isImmutable: true,
  createdBy: "system",
  createdAt: "2026-07-10T00:00:00.000Z"
};

const transcriptSegment = {
  id: "oima_transcript_segment_stage_2k_0",
  meetingId: meeting.id,
  transcriptVersionId: transcriptVersion.id,
  parseRunId: latestParseRun.id,
  segmentIndex: 0,
  sourceLineStart: 1,
  sourceLineEnd: 1,
  timestampStart: "00:00:01",
  timestampEnd: null,
  speakerRaw: "Alex",
  speakerNormalized: "Alex",
  rawText: "Raw kickoff   text",
  normalizedText: "Raw kickoff text",
  confidenceScore: 0.95,
  needsReview: false,
  createdAt: "2026-07-10T00:00:00.000Z"
};

const transcriptPayload = {
  metadata,
  transcriptProcessingContract,
  meetingId: meeting.id,
  latestParseRun,
  versions: [transcriptVersion],
  segments: [transcriptSegment],
  warnings: [],
  count: 1,
  noLlmCalls: true,
  noFakeMeetingAnalysis: true
};

type RouteComponent = () => Promise<ReactElement>;

function jsonResponse(body: unknown, status = 200) {
  const text = JSON.stringify(body);

  return {
    ok: status >= 200 && status < 300,
    status,
    text: async () => text,
    json: async () => body
  } as Response;
}

function mockCoreApiFetch() {
  const fetchMock = vi.fn(async (input: Parameters<typeof fetch>[0]) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;

    if (url === `${coreApiUrl}/health`) return jsonResponse(healthPayload);
    if (url === `${coreApiUrl}/platform/overview`) return jsonResponse(overviewPayload);
    if (url === `${coreApiUrl}/platform/registry`) return jsonResponse(registryPayload);
    if (url === `${coreApiUrl}/platform/registry/health`) return jsonResponse(emptyRegistryStatus);
    if (url === `${coreApiUrl}/platform/registry/readiness`) {
      return jsonResponse({ ...emptyRegistryStatus, summary: { status: "READY", total: 0, ready: 0, incomplete: 0, blocked: 0, notApplicable: 0, unknown: 0 } });
    }
    if (url === `${coreApiUrl}/platform/owner-review`) {
      return jsonResponse({ metadata, runtime: emptyRegistryStatus.runtime, actionBoundary: { markers: [] }, summary: {}, items: [] });
    }
    if (url === `${coreApiUrl}/platform/admin-boundary`) {
      return jsonResponse({ metadata, runtime: emptyRegistryStatus.runtime, adminBoundary: { markers: [] }, summary: {}, roles: [], permissions: [] });
    }
    if (url === `${coreApiUrl}/platform/product-uat`) {
      return jsonResponse({ metadata, runtime: emptyRegistryStatus.runtime, productUat: { markers: [] }, summary: {}, categories: [], products: [] });
    }
    if (
      url === `${coreApiUrl}/platform/oima/overview` ||
      url === `${coreApiUrl}/platform/oima/source-modes` ||
      url === `${coreApiUrl}/platform/oima/roadmap` ||
      url === `${coreApiUrl}/platform/oima/boundary`
    ) {
      return jsonResponse(oimaBoundaryPayload);
    }
    if (url === `${coreApiUrl}/platform/oima/meetings`) return jsonResponse(meetingLibraryPayload);
    if (url === `${coreApiUrl}/platform/oima/meetings/oima_meeting_stage_2j_demo`) {
      return jsonResponse({ ...meetingLibraryPayload, meeting });
    }
    if (
      url === `${coreApiUrl}/platform/oima/meetings/oima_meeting_stage_2j_demo/transcript/status` ||
      url === `${coreApiUrl}/platform/oima/meetings/oima_meeting_stage_2j_demo/transcript/versions` ||
      url === `${coreApiUrl}/platform/oima/meetings/oima_meeting_stage_2j_demo/transcript/segments` ||
      url === `${coreApiUrl}/platform/oima/meetings/oima_meeting_stage_2j_demo/transcript/warnings`
    ) {
      return jsonResponse(transcriptPayload);
    }

    return jsonResponse({ metadata, error: { code: "NOT_FOUND", message: `No mock for ${url}` } }, 404);
  });

  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

function renderRouteHtml(Component: RouteComponent) {
  return Component().then((element) => renderToStaticMarkup(element));
}

function restoreEnv(name: string, value: string | undefined) {
  if (value === undefined) {
    delete process.env[name];
    return;
  }

  process.env[name] = value;
}

describe("OIMA Shell product runtime", () => {
  const previousCoreApiUrl = process.env.CORE_API_URL;
  const previousNextPublicCoreApiUrl = process.env.NEXT_PUBLIC_CORE_API_URL;
  const previousOimaPublicBaseUrl = process.env.OIMA_PUBLIC_BASE_URL;
  const previousDbEnv = process.env[dbEnvKey];

  beforeEach(() => {
    process.env.CORE_API_URL = coreApiUrl;
    process.env.OIMA_PUBLIC_BASE_URL = oimaPublicBaseUrl;
    delete process.env.NEXT_PUBLIC_CORE_API_URL;
    delete process.env[dbEnvKey];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreEnv("CORE_API_URL", previousCoreApiUrl);
    restoreEnv("NEXT_PUBLIC_CORE_API_URL", previousNextPublicCoreApiUrl);
    restoreEnv("OIMA_PUBLIC_BASE_URL", previousOimaPublicBaseUrl);
    restoreEnv(dbEnvKey, previousDbEnv);
  });

  it("renders the standalone OIMA root contract", async () => {
    const fetchMock = mockCoreApiFetch();

    const html = await renderRouteHtml(Page);

    expect(html).toContain("OIMA");
    expect(html).toContain("OIMA_APP_SHELL");
    expect(html).toContain("Standalone OIMA App Shell");
    expect(html).toContain("OIMA_STANDALONE_APP_SHELL");
    expect(html).toContain("STAGE_2L_STANDALONE_OIMA_APP_SHELL");
    expect(html).toContain("OIMA_DOMAIN_READY");
    expect(html).toContain("oima.dmp247.com");
    expect(html).toContain("Platform Overview Counts");
    expect(html).toContain("OIMA Product Surface Empty States");
    expect(html).toContain("Agent Analysis");
    expect(html).toContain("Listener Mode");
    expect(html).toContain("No fake meeting data");
    expect(html).toContain(coreApiUrl);
    expect(html).not.toContain(dbEnvKey);
    expect(fetchMock).toHaveBeenCalledWith(`${coreApiUrl}/platform/oima/overview`, { cache: "no-store" });
  });

  it.each([
    [
      "meeting library",
      MeetingsPage,
      ["OIMA Meeting Intake", "Meeting Library", "Registered meetings", "Stage 2J Transcript Intake", "Transcript present", "Audio present", "Register meeting"]
    ],
    [
      "new meeting",
      NewMeetingPage,
      ["Upload / Register Meeting", "Create Meeting Form", "Transcript Source", "Optional Audio Source", "TRANSCRIPT_ONLY supported", "No voice clone"]
    ],
    [
      "analysis",
      AnalysisPage,
      ["Agent Analysis", "OFFLINE_AGENT_ANALYSIS", "Planned / not runtime", "No LLM/OpenRouter calls"]
    ],
    [
      "clarification",
      ClarificationPage,
      ["Clarification Review", "SUBJECT_CLARIFICATION", "Planned / not runtime", "No fake meeting data"]
    ],
    ["dashboard", DashboardPage, ["Dashboard", "MEETING_DASHBOARD", "Planned / not runtime"]],
    ["self improvement", SelfImprovementPage, ["Self-Improvement Center", "SELF_IMPROVEMENT", "Planned / not runtime"]],
    ["listener", ListenerPage, ["Listener Mode", "LISTENER_MODE", "Planned / not runtime", "No voice clone"]]
  ] satisfies Array<[string, RouteComponent, string[]]>)("renders the %s standalone route", async (_name, Component, markers) => {
    mockCoreApiFetch();

    const html = await renderRouteHtml(Component);

    expect(html).toContain("OIMA_APP_SHELL");
    expect(html).toContain("Core API healthy");
    expect(html).toContain("DEMO DATA - NOT PRODUCTION");
    expect(html).toContain("Core API source:");
    for (const marker of markers) {
      expect(html).toContain(marker);
    }
    expect(html).not.toContain(dbEnvKey);
  });

  it("renders meeting detail with source files and transcript processing evidence", async () => {
    mockCoreApiFetch();

    const html = renderToStaticMarkup(await MeetingDetailPage({ params: Promise.resolve({ id: meeting.id }) }));

    expect(html).toContain("OIMA Meeting Detail");
    expect(html).toContain("Stage 2J Transcript Intake");
    expect(html).toContain("Meeting Metadata");
    expect(html).toContain("TRANSCRIPT_AND_AUDIO");
    expect(html).toContain("READY_FOR_PROCESSING");
    expect(html).toContain("Transcript available");
    expect(html).toContain("Audio available");
    expect(html).toContain("Source Files");
    expect(html).toContain("stage-2j-transcript.txt");
    expect(html).toContain("stage-2j-audio.mp3");
    expect(html).toContain("TRANSCRIPT_PROCESSING");
    expect(html).toContain("Process Transcript");
    expect(html).toContain("Transcript Timeline");
    expect(html).toContain("Raw kickoff   text");
    expect(html).toContain("Raw kickoff text");
    expect(html).toContain("RAW transcript immutable");
    expect(html).toContain("OIS Agent Analysis planned later");
    expect(html).toContain("Listener Mode planned later");
    expect(html).not.toContain(dbEnvKey);
  });
});
