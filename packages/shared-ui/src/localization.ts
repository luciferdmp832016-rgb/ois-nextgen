export const supportedLocales = ["en", "vi"] as const;

export type Locale = (typeof supportedLocales)[number];

export const defaultLocale: Locale = "en";

export const localeDisplayNames: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt"
};

export const translations = {
  "language.settings": {
    en: "Language Settings",
    vi: "Cài đặt ngôn ngữ"
  },
  "language.label": {
    en: "Language",
    vi: "Ngôn ngữ"
  },
  "language.english": {
    en: "English",
    vi: "Tiếng Anh"
  },
  "language.vietnamese": {
    en: "Tiếng Việt",
    vi: "Tiếng Việt"
  },
  "common.navigation": {
    en: "Navigation",
    vi: "Điều hướng"
  },
  "common.overview": {
    en: "Overview",
    vi: "Tổng quan"
  },
  "common.dashboard": {
    en: "Dashboard",
    vi: "Bảng điều khiển"
  },
  "common.products": {
    en: "Products",
    vi: "Sản phẩm"
  },
  "common.projects": {
    en: "Projects",
    vi: "Dự án"
  },
  "common.workspaces": {
    en: "Workspaces",
    vi: "Không gian làm việc"
  },
  "common.runtime": {
    en: "Runtime",
    vi: "Môi trường chạy"
  },
  "common.productFlow": {
    en: "Product Flow",
    vi: "Luồng sản phẩm"
  },
  "common.productFlowPreview": {
    en: "Product Flow Preview",
    vi: "Xem trước luồng sản phẩm"
  },
  "common.workboard": {
    en: "Workboard",
    vi: "Bảng công việc"
  },
  "common.workItem": {
    en: "Work Item",
    vi: "Hạng mục công việc"
  },
  "common.status": {
    en: "Status",
    vi: "Trạng thái"
  },
  "common.priority": {
    en: "Priority",
    vi: "Ưu tiên"
  },
  "common.owner": {
    en: "Owner",
    vi: "Người phụ trách"
  },
  "common.dueDate": {
    en: "Due date",
    vi: "Ngày đến hạn"
  },
  "common.nextAction": {
    en: "Next action",
    vi: "Hành động tiếp theo"
  },
  "common.open": {
    en: "Open",
    vi: "Mở"
  },
  "common.inProgress": {
    en: "In progress",
    vi: "Đang xử lý"
  },
  "common.blocked": {
    en: "Blocked",
    vi: "Bị chặn"
  },
  "common.done": {
    en: "Done",
    vi: "Hoàn tất"
  },
  "common.readOnly": {
    en: "Read-only",
    vi: "Chỉ đọc"
  },
  "common.previewOnly": {
    en: "Preview only",
    vi: "Chỉ xem trước"
  },
  "common.noDataChanged": {
    en: "No data will be changed",
    vi: "Không có dữ liệu nào bị thay đổi"
  },
  "common.adminRuntime": {
    en: "Admin/runtime",
    vi: "Quản trị/môi trường chạy"
  },
  "common.controlPlane": {
    en: "Control-plane",
    vi: "Lớp điều khiển"
  },
  "common.productPage": {
    en: "Product page",
    vi: "Trang sản phẩm"
  },
  "common.ownerReview": {
    en: "Owner review",
    vi: "Chủ sở hữu rà soát"
  },
  "common.primaryUser": {
    en: "Primary user",
    vi: "Người dùng chính"
  },
  "common.keySections": {
    en: "Key sections",
    vi: "Khu vực chính"
  },
  "common.mainAction": {
    en: "Main action",
    vi: "Hành động chính"
  },
  "common.currentStageStatus": {
    en: "Current stage status",
    vi: "Trạng thái giai đoạn hiện tại"
  },
  "common.pagePurpose": {
    en: "Page purpose",
    vi: "Mục đích trang"
  },
  "common.classification": {
    en: "Classification",
    vi: "Phân loại"
  },
  "common.screenMock": {
    en: "Screen mock",
    vi: "Bản phác màn hình"
  },
  "common.productAdminBoundary": {
    en: "Product/Admin boundary",
    vi: "Ranh giới sản phẩm/quản trị"
  },
  "common.readOnlyUxDraft": {
    en: "Read-only UX draft",
    vi: "Bản nháp UX chỉ đọc"
  },
  "common.draftGate": {
    en: "Draft gate",
    vi: "Cổng duyệt bản nháp"
  },
  "common.implemented": {
    en: "Implemented",
    vi: "Đã triển khai"
  },
  "common.future": {
    en: "Future",
    vi: "Tương lai"
  },
  "common.noWriteEndpointsAdded": {
    en: "No write endpoints added",
    vi: "Không thêm endpoint ghi dữ liệu"
  },
  "common.ownerApprovalRequired": {
    en: "Owner approval required",
    vi: "Cần chủ sở hữu phê duyệt"
  },
  "common.productPageVsAdminConsole": {
    en: "Product page vs Admin console",
    vi: "Trang sản phẩm và bảng quản trị"
  },
  "common.screenDraft": {
    en: "Screen draft",
    vi: "Bản nháp màn hình"
  },
  "common.flowRelationship": {
    en: "Flow relationship",
    vi: "Quan hệ trong luồng"
  },
  "shell.showNav": {
    en: "Show nav",
    vi: "Hiện điều hướng"
  },
  "shell.hideNav": {
    en: "Hide nav",
    vi: "Ẩn điều hướng"
  },
  "shell.menu": {
    en: "Menu",
    vi: "Menu"
  },
  "shell.coreApiSource": {
    en: "Core API source",
    vi: "Nguồn Core API"
  },
  "shell.productAdministration": {
    en: "Product Administration",
    vi: "Quản trị sản phẩm"
  },
  "shell.productRuntime": {
    en: "Product Runtime",
    vi: "Môi trường sản phẩm"
  },
  "shell.coreApiHealthy": {
    en: "Core API healthy",
    vi: "Core API ổn định"
  },
  "shell.needsOwnerReview": {
    en: "Needs owner review",
    vi: "Cần chủ sở hữu rà soát"
  },
  "flow.uxDraftEyebrow": {
    en: "UX Draft / Product Flow Preview",
    vi: "Bản nháp UX / Xem trước luồng sản phẩm"
  },
  "flow.previewIntro": {
    en: "Visual owner-review preview. This surface is read-only and no data will be changed.",
    vi: "Bản xem trước trực quan để chủ sở hữu rà soát. Bề mặt này chỉ đọc và không thay đổi dữ liệu."
  },
  "flow.ownerReviewChecklist": {
    en: "Owner approval checklist",
    vi: "Danh sách chủ sở hữu phê duyệt"
  },
  "flow.reviewBeforeNextStage": {
    en: "Approve or comment on this visual flow before the next implementation stage starts.",
    vi: "Phê duyệt hoặc góp ý luồng trực quan này trước khi giai đoạn triển khai tiếp theo bắt đầu."
  },
  "flow.productPages": {
    en: "Product pages",
    vi: "Trang sản phẩm"
  },
  "flow.adminPages": {
    en: "Admin/runtime pages",
    vi: "Trang quản trị/môi trường chạy"
  },
  "flow.noWorkflowChange": {
    en: "Localization changes presentation only; internal IDs, status codes, routes and API contracts stay stable.",
    vi: "Bản địa hóa chỉ thay đổi phần hiển thị; ID nội bộ, mã trạng thái, tuyến và hợp đồng API vẫn ổn định."
  },
  "flow.classification.product": {
    en: "Product page",
    vi: "Trang sản phẩm"
  },
  "flow.classification.admin": {
    en: "Admin/runtime",
    vi: "Quản trị/môi trường chạy"
  },
  "flow.ownerReview.visual": {
    en: "Owner reviews layout, language and workflow clarity.",
    vi: "Chủ sở hữu rà soát bố cục, ngôn ngữ và độ rõ của luồng."
  },
  "flow.ownerReview.future": {
    en: "Owner confirms the concept before deeper product behavior is coded.",
    vi: "Chủ sở hữu xác nhận khái niệm trước khi mã hóa hành vi sản phẩm sâu hơn."
  },
  "flow.ois.title": {
    en: "OIS Product UX Preview",
    vi: "Xem trước UX sản phẩm OIS"
  },
  "flow.ois.heading": {
    en: "OIS Product UX Blueprint",
    vi: "Bản thiết kế UX sản phẩm OIS"
  },
  "flow.ois.summary": {
    en: "OIS becomes an organizational intelligence product while the console keeps registry, runtime and admin diagnostics separate.",
    vi: "OIS trở thành sản phẩm trí tuệ tổ chức, còn console giữ riêng phần registry, runtime và chẩn đoán quản trị."
  },
  "flow.ois.executiveDashboard.title": {
    en: "Executive Dashboard",
    vi: "Bảng điều hành lãnh đạo"
  },
  "flow.ois.executiveDashboard.purpose": {
    en: "Give CEO and manager users an organizational intelligence overview.",
    vi: "Cung cấp cho CEO và quản lý cái nhìn tổng quan về trí tuệ tổ chức."
  },
  "flow.ois.executiveDashboard.user": {
    en: "CEO / manager",
    vi: "CEO / quản lý"
  },
  "flow.ois.executiveDashboard.action": {
    en: "Scan what changed, what is risky and what needs a decision.",
    vi: "Quét thay đổi, rủi ro và quyết định đang chờ."
  },
  "flow.ois.workspaceList.title": {
    en: "Workspace List",
    vi: "Danh sách không gian làm việc"
  },
  "flow.ois.workspaceList.purpose": {
    en: "Select an organization or workspace context.",
    vi: "Chọn bối cảnh tổ chức hoặc không gian làm việc."
  },
  "flow.ois.workspaceList.user": {
    en: "Manager",
    vi: "Quản lý"
  },
  "flow.ois.workspaceList.action": {
    en: "Open a workspace with current data freshness and coverage cues.",
    vi: "Mở không gian làm việc với tín hiệu độ mới và phạm vi dữ liệu."
  },
  "flow.ois.workspaceIntelligence.title": {
    en: "Workspace Intelligence Dashboard",
    vi: "Bảng trí tuệ không gian làm việc"
  },
  "flow.ois.workspaceIntelligence.purpose": {
    en: "Show the main intelligence view for one workspace.",
    vi: "Hiển thị chế độ trí tuệ chính cho một không gian làm việc."
  },
  "flow.ois.workspaceIntelligence.user": {
    en: "Workspace lead",
    vi: "Trưởng không gian làm việc"
  },
  "flow.ois.workspaceIntelligence.action": {
    en: "Review risks, decisions, commitments and people involved.",
    vi: "Rà soát rủi ro, quyết định, cam kết và người liên quan."
  },
  "flow.ois.knowledgeFeed.title": {
    en: "Meeting/Document Knowledge Feed",
    vi: "Bảng tri thức cuộc họp/tài liệu"
  },
  "flow.ois.knowledgeFeed.purpose": {
    en: "Show ingested knowledge sources and extracted insights.",
    vi: "Hiển thị nguồn tri thức đã tiếp nhận và insight được trích xuất."
  },
  "flow.ois.knowledgeFeed.user": {
    en: "Manager / analyst",
    vi: "Quản lý / phân tích viên"
  },
  "flow.ois.knowledgeFeed.action": {
    en: "Find recent sources, decisions, commitments, risks and evidence snippets.",
    vi: "Tìm nguồn gần đây, quyết định, cam kết, rủi ro và đoạn bằng chứng."
  },
  "flow.ois.knowledgeDetail.title": {
    en: "Knowledge Detail",
    vi: "Chi tiết tri thức"
  },
  "flow.ois.knowledgeDetail.purpose": {
    en: "Inspect one knowledge item with evidence and provenance.",
    vi: "Kiểm tra một mục tri thức cùng bằng chứng và nguồn gốc."
  },
  "flow.ois.knowledgeDetail.user": {
    en: "Manager / analyst",
    vi: "Quản lý / phân tích viên"
  },
  "flow.ois.knowledgeDetail.action": {
    en: "Open the source, evidence, related entities and confidence context.",
    vi: "Mở nguồn, bằng chứng, thực thể liên quan và bối cảnh độ tin cậy."
  },
  "flow.ois.askCopilot.title": {
    en: "Ask OIS / Copilot",
    vi: "Hỏi OIS / Copilot"
  },
  "flow.ois.askCopilot.purpose": {
    en: "Let managers ask questions against organizational knowledge.",
    vi: "Cho phép quản lý đặt câu hỏi dựa trên tri thức tổ chức."
  },
  "flow.ois.askCopilot.user": {
    en: "CEO / manager",
    vi: "CEO / quản lý"
  },
  "flow.ois.askCopilot.action": {
    en: "Ask for an evidence-backed answer or receive an insufficient-evidence fallback.",
    vi: "Hỏi để nhận câu trả lời có bằng chứng hoặc phản hồi thiếu bằng chứng."
  },
  "flow.ois.runtimeAdmin.title": {
    en: "Runtime/Admin",
    vi: "Runtime/Quản trị"
  },
  "flow.ois.runtimeAdmin.purpose": {
    en: "Keep registry, runtime and admin diagnostics separate from product usage.",
    vi: "Giữ registry, runtime và chẩn đoán quản trị tách khỏi sử dụng sản phẩm."
  },
  "flow.ois.runtimeAdmin.user": {
    en: "Owner / operator",
    vi: "Chủ sở hữu / vận hành"
  },
  "flow.ois.runtimeAdmin.action": {
    en: "Check readiness, runtime health, owner review and the admin boundary.",
    vi: "Kiểm tra readiness, sức khỏe runtime, rà soát chủ sở hữu và ranh giới quản trị."
  },
  "flow.pits.title": {
    en: "PITS Product UX Preview",
    vi: "Xem trước UX sản phẩm PITS"
  },
  "flow.pits.heading": {
    en: "PITS Product UX Blueprint",
    vi: "Bản thiết kế UX sản phẩm PITS"
  },
  "flow.pits.summary": {
    en: "PITS becomes a project execution product while runtime and admin views remain secondary diagnostics.",
    vi: "PITS trở thành sản phẩm thực thi dự án, còn runtime và quản trị là phần chẩn đoán phụ."
  },
  "flow.pits.home.title": {
    en: "PITS Home",
    vi: "Trang chính PITS"
  },
  "flow.pits.home.purpose": {
    en: "Give project operators a clear starting point.",
    vi: "Cung cấp điểm bắt đầu rõ ràng cho người vận hành dự án."
  },
  "flow.pits.home.user": {
    en: "Project operator",
    vi: "Người vận hành dự án"
  },
  "flow.pits.home.action": {
    en: "Open active projects, blocked work and due-soon attention areas.",
    vi: "Mở dự án đang hoạt động, công việc bị chặn và mục sắp đến hạn."
  },
  "flow.pits.projects.title": {
    en: "Projects List",
    vi: "Danh sách dự án"
  },
  "flow.pits.projects.purpose": {
    en: "Let users find and select a project.",
    vi: "Cho phép người dùng tìm và chọn dự án."
  },
  "flow.pits.projects.user": {
    en: "Project operator",
    vi: "Người vận hành dự án"
  },
  "flow.pits.projects.action": {
    en: "Filter by status, priority, owner, due date and next action.",
    vi: "Lọc theo trạng thái, ưu tiên, người phụ trách, hạn và hành động tiếp theo."
  },
  "flow.pits.projectDetail.title": {
    en: "Project Detail",
    vi: "Chi tiết dự án"
  },
  "flow.pits.projectDetail.purpose": {
    en: "Show project overview and operational status.",
    vi: "Hiển thị tổng quan dự án và trạng thái vận hành."
  },
  "flow.pits.projectDetail.user": {
    en: "Project lead",
    vi: "Trưởng dự án"
  },
  "flow.pits.projectDetail.action": {
    en: "Review blockers, milestones, linked context and workboard entry.",
    vi: "Rà soát điểm chặn, mốc, ngữ cảnh liên kết và lối vào bảng công việc."
  },
  "flow.pits.workboard.title": {
    en: "Project Workboard",
    vi: "Bảng công việc dự án"
  },
  "flow.pits.workboard.purpose": {
    en: "Provide the main workflow page for project execution.",
    vi: "Cung cấp trang luồng công việc chính để thực thi dự án."
  },
  "flow.pits.workboard.user": {
    en: "Project operator",
    vi: "Người vận hành dự án"
  },
  "flow.pits.workboard.action": {
    en: "Scan open, in-progress, blocked and done work items.",
    vi: "Quét hạng mục mở, đang xử lý, bị chặn và hoàn tất."
  },
  "flow.pits.workItemDetail.title": {
    en: "Work Item Detail",
    vi: "Chi tiết hạng mục công việc"
  },
  "flow.pits.workItemDetail.purpose": {
    en: "Let users inspect one task, issue, risk or follow-up.",
    vi: "Cho người dùng kiểm tra một việc, vấn đề, rủi ro hoặc theo dõi."
  },
  "flow.pits.workItemDetail.user": {
    en: "Project operator",
    vi: "Người vận hành dự án"
  },
  "flow.pits.workItemDetail.action": {
    en: "Read status, priority, owner, due date, blockers and next action.",
    vi: "Đọc trạng thái, ưu tiên, người phụ trách, hạn, điểm chặn và hành động tiếp theo."
  },
  "flow.pits.dryRun.title": {
    en: "Dry-run Action Preview",
    vi: "Xem trước hành động chạy thử"
  },
  "flow.pits.dryRun.purpose": {
    en: "Preview future write actions without changing data.",
    vi: "Xem trước hành động ghi trong tương lai mà không thay đổi dữ liệu."
  },
  "flow.pits.dryRun.user": {
    en: "Project lead / owner",
    vi: "Trưởng dự án / chủ sở hữu"
  },
  "flow.pits.dryRun.action": {
    en: "Review proposed action, expected impact, audit and confirmation requirements.",
    vi: "Rà soát hành động đề xuất, tác động dự kiến, yêu cầu audit và xác nhận."
  },
  "flow.pits.runtimeAdmin.title": {
    en: "Runtime/Admin",
    vi: "Runtime/Quản trị"
  },
  "flow.pits.runtimeAdmin.purpose": {
    en: "Move diagnostics and admin views away from daily product workflow.",
    vi: "Tách chẩn đoán và quản trị khỏi luồng công việc sản phẩm hằng ngày."
  },
  "flow.pits.runtimeAdmin.user": {
    en: "Owner / operator",
    vi: "Chủ sở hữu / vận hành"
  },
  "flow.pits.runtimeAdmin.action": {
    en: "Check runtime status, registry readiness, owner review and product UAT state.",
    vi: "Kiểm tra trạng thái runtime, readiness registry, rà soát chủ sở hữu và trạng thái UAT sản phẩm."
  }
} as const;

export type TranslationKey = keyof typeof translations;

const navTranslationKeys: Record<string, TranslationKey> = {
  overview: "common.overview",
  dashboard: "common.dashboard",
  products: "common.products",
  projects: "common.projects",
  workspaces: "common.workspaces",
  runtime: "common.runtime",
  "product-flow": "common.productFlow"
};

const statusTranslationKeys: Record<string, TranslationKey> = {
  OPEN: "common.open",
  IN_PROGRESS: "common.inProgress",
  BLOCKED: "common.blocked",
  DONE: "common.done"
};

export function isSupportedLocale(value: string | null | undefined): value is Locale {
  return supportedLocales.includes(value as Locale);
}

export function normalizeLocale(value: string | null | undefined): Locale {
  return isSupportedLocale(value) ? value : defaultLocale;
}

export function translate(key: TranslationKey | string, locale: Locale = defaultLocale): string {
  const entry = translations[key as TranslationKey];

  if (!entry) {
    return key;
  }

  return entry[locale] ?? entry[defaultLocale] ?? key;
}

export function createTranslator(locale: Locale) {
  return (key: TranslationKey | string) => translate(key, locale);
}

export function localizeNavLabel(id: string, fallback: string, locale: Locale): string {
  const key = navTranslationKeys[id];

  return key ? translate(key, locale) : fallback;
}

export function localizeStatusCode(code: string, locale: Locale): string {
  const key = statusTranslationKeys[code];

  return key ? translate(key, locale) : code;
}
