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
  "common.localization": {
    en: "Localization",
    vi: "Bản địa hóa"
  },
  "common.localizationCatalog": {
    en: "Localization Catalog",
    vi: "Danh mục bản địa hóa"
  },
  "common.availableLocales": {
    en: "Available locales",
    vi: "Ngôn ngữ có sẵn"
  },
  "common.currentLocale": {
    en: "Current locale",
    vi: "Ngôn ngữ hiện tại"
  },
  "common.translationNamespaces": {
    en: "Translation namespaces",
    vi: "Nhóm bản dịch"
  },
  "common.missingKeys": {
    en: "Missing keys",
    vi: "Khóa còn thiếu"
  },
  "common.fallbackKeys": {
    en: "Fallback keys",
    vi: "Khóa dùng fallback"
  },
  "common.sampleKeys": {
    en: "Sample keys",
    vi: "Khóa mẫu"
  },
  "common.manualEditLocation": {
    en: "Manual edit location",
    vi: "Vị trí chỉnh sửa thủ công"
  },
  "common.browserEditingDisabled": {
    en: "Browser editing is not enabled yet",
    vi: "Chưa bật chỉnh sửa trong trình duyệt"
  },
  "common.readOnlyCatalogIntro": {
    en: "Read-only catalog for reviewing language packs, namespace coverage and fallback counts before owner UAT.",
    vi: "Danh mục chỉ đọc để rà soát gói ngôn ngữ, phạm vi nhóm bản dịch và số lượng fallback trước UAT của chủ sở hữu."
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
  "common.actionRequestOnly": {
    en: "Action request only",
    vi: "Chi tao yeu cau hanh dong"
  },
  "common.noDirectMutation": {
    en: "No direct mutation",
    vi: "Khong thay doi truc tiep"
  },
  "common.workItemNotChangedYet": {
    en: "Work item is not changed yet",
    vi: "Hang muc cong viec chua bi thay doi"
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
  "common.noDataMutationEnabled": {
    en: "No mutation or browser editing is enabled from this catalog.",
    vi: "Danh mục này không bật mutation hoặc chỉnh sửa trong trình duyệt."
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
  "page.whatThisIs": {
    en: "What this is",
    vi: "Đây là gì"
  },
  "page.health": {
    en: "Health",
    vi: "Sức khỏe"
  },
  "page.readiness": {
    en: "Readiness",
    vi: "Mức sẵn sàng"
  },
  "page.missing": {
    en: "Missing",
    vi: "Còn thiếu"
  },
  "page.next": {
    en: "Next",
    vi: "Tiếp theo"
  },
  "page.ois.overview.title": {
    en: "Product Administration Overview",
    vi: "Tổng quan quản trị sản phẩm"
  },
  "page.ois.overview.description": {
    en: "Control-plane baseline for workspaces, products, modules and runtime health.",
    vi: "Đường cơ sở quản trị cho không gian làm việc, sản phẩm, module và sức khỏe runtime."
  },
  "page.ois.dashboard.title": {
    en: "Platform Overview",
    vi: "Tổng quan nền tảng"
  },
  "page.ois.dashboard.description": {
    en: "Administration dashboard for the current staging Platform Kernel baseline.",
    vi: "Bảng quản trị cho đường cơ sở Platform Kernel trên staging hiện tại."
  },
  "page.ois.runtime.description": {
    en: "Public staging runtime baseline for OIS Console, Core API and Platform Kernel reads.",
    vi: "Đường cơ sở runtime staging công khai cho OIS Console, Core API và lượt đọc Platform Kernel."
  },
  "page.ois.products.title": {
    en: "Products & Modules",
    vi: "Sản phẩm và module"
  },
  "page.ois.products.description": {
    en: "Product and module baseline for the current public staging runtime.",
    vi: "Đường cơ sở sản phẩm và module cho runtime staging công khai hiện tại."
  },
  "page.pits.overview.title": {
    en: "Project Runtime Overview",
    vi: "Tổng quan runtime dự án"
  },
  "page.pits.overview.description": {
    en: "Product runtime baseline for project selection, installation status and Core API health.",
    vi: "Đường cơ sở runtime sản phẩm cho chọn dự án, trạng thái cài đặt và sức khỏe Core API."
  },
  "page.pits.projects.description": {
    en: "Select from seeded staging projects that read shared platform state through Core API.",
    vi: "Chọn từ các dự án staging mẫu đọc trạng thái nền tảng dùng chung qua Core API."
  },
  "page.pits.runtime.description": {
    en: "PITS Shell runtime baseline for public staging, Core API health and Platform Kernel counts.",
    vi: "Đường cơ sở runtime PITS Shell cho staging công khai, sức khỏe Core API và số liệu Platform Kernel."
  },
  "page.pits.workboard.description": {
    en: "Read-only functional slice for project work items, priorities, owners, due dates and next actions.",
    vi: "Lát cắt chức năng chỉ đọc cho hạng mục công việc, ưu tiên, người phụ trách, hạn và hành động tiếp theo."
  },
  "page.pits.workItem.description": {
    en: "Read-only PITS work item detail with dry-run action preview. Preview only; no data will be changed.",
    vi: "Chi tiết hạng mục PITS chỉ đọc với xem trước hành động chạy thử. Chỉ xem trước; không dữ liệu nào bị thay đổi."
  },
  "panel.ownerRegistry.title": {
    en: "Owner Registry Cockpit / Registry Runtime Summary",
    vi: "Buồng lái registry của chủ sở hữu / tóm tắt runtime registry"
  },
  "panel.ownerRegistry.description": {
    en: "Read-only browser cockpit showing what is ready, what needs owner review, what is missing and the next detail link to open.",
    vi: "Buồng lái trình duyệt chỉ đọc cho biết mục đã sẵn sàng, mục cần chủ sở hữu rà soát, mục còn thiếu và liên kết chi tiết tiếp theo."
  },
  "panel.pitsRegistry.title": {
    en: "PITS Registry Cockpit / Project Runtime Summary",
    vi: "Buồng lái registry PITS / tóm tắt runtime dự án"
  },
  "panel.pitsRegistry.description": {
    en: "Read-only project cockpit showing what is ready, what needs owner review, what is missing and the next detail link to open.",
    vi: "Buồng lái dự án chỉ đọc cho biết mục đã sẵn sàng, mục cần chủ sở hữu rà soát, mục còn thiếu và liên kết chi tiết tiếp theo."
  },
  "panel.platformOverview.title": {
    en: "Platform Overview Counts",
    vi: "Số liệu tổng quan nền tảng"
  },
  "panel.platformOverview.description": {
    en: "Seeded counts read from Core API /platform/overview.",
    vi: "Số liệu mẫu đọc từ Core API /platform/overview."
  },
  "panel.platformOverview.pitsDescription": {
    en: "Seeded staging counts from Core API /platform/overview.",
    vi: "Số liệu staging mẫu từ Core API /platform/overview."
  },
  "panel.productModule.title": {
    en: "Product & Module Overview",
    vi: "Tổng quan sản phẩm và module"
  },
  "panel.productModule.description": {
    en: "Current product catalog baseline from the shared Core API.",
    vi: "Đường cơ sở danh mục sản phẩm hiện tại từ Core API dùng chung."
  },
  "panel.runtimeStatus.title": {
    en: "Runtime Status",
    vi: "Trạng thái runtime"
  },
  "panel.runtimeStatus.oisDescription": {
    en: "Public staging shell status through Core API only.",
    vi: "Trạng thái shell staging công khai chỉ qua Core API."
  },
  "panel.runtimeStatus.pitsDescription": {
    en: "PITS reads platform data through Core API only.",
    vi: "PITS chỉ đọc dữ liệu nền tảng qua Core API."
  },
  "panel.dataBoundary.title": {
    en: "Data Access Boundary",
    vi: "Ranh giới truy cập dữ liệu"
  },
  "panel.dataBoundary.description": {
    en: "UI shell reads product status through Core API only. DB-backed demo data is accessed only through the Core API.",
    vi: "UI shell chỉ đọc trạng thái sản phẩm qua Core API. Dữ liệu demo từ DB chỉ được truy cập qua Core API."
  },
  "panel.registryGovernance.title": {
    en: "Registry Governance / Readiness",
    vi: "Quản trị registry / mức sẵn sàng"
  },
  "panel.registryGovernance.oisDescription": {
    en: "Owner-facing readiness from Core API /platform/registry/readiness.",
    vi: "Mức sẵn sàng cho chủ sở hữu từ Core API /platform/registry/readiness."
  },
  "panel.registryGovernance.pitsDescription": {
    en: "Project readiness from Core API /platform/registry/readiness.",
    vi: "Mức sẵn sàng dự án từ Core API /platform/registry/readiness."
  },
  "panel.registryHealth.title": {
    en: "Registry Runtime Health",
    vi: "Sức khỏe runtime registry"
  },
  "panel.registryHealth.oisDescription": {
    en: "Owner-facing configured, linked and staging URL status from Core API /platform/registry/health.",
    vi: "Trạng thái URL đã cấu hình, đã liên kết và staging cho chủ sở hữu từ Core API /platform/registry/health."
  },
  "panel.registryHealth.pitsDescription": {
    en: "Project runtime availability from Core API /platform/registry/health.",
    vi: "Khả dụng runtime dự án từ Core API /platform/registry/health."
  },
  "panel.projectSelector.title": {
    en: "Project Selector",
    vi: "Bộ chọn dự án"
  },
  "panel.projectSelector.description": {
    en: "PITS is no longer only a registry/readiness shell; Stage 2A adds a read-only workboard and Stage 2B adds work item detail with dry-run preview.",
    vi: "PITS không còn chỉ là shell registry/mức sẵn sàng; Stage 2A thêm bảng công việc chỉ đọc và Stage 2B thêm chi tiết hạng mục với xem trước chạy thử."
  },
  "panel.installationRegistry.title": {
    en: "Project Installation Registry",
    vi: "Registry cài đặt dự án"
  },
  "panel.installationRegistry.description": {
    en: "PITS installation mapping read from Core API /platform/registry.",
    vi: "Ánh xạ cài đặt PITS đọc từ Core API /platform/registry."
  },
  "panel.workboard.title": {
    en: "PITS Project Workboard",
    vi: "Bảng công việc dự án PITS"
  },
  "panel.workboard.description": {
    en: "Project workboard data is unavailable from Core API.",
    vi: "Dữ liệu bảng công việc dự án không có từ Core API."
  },
  "panel.workboard.boundaryDescription": {
    en: "Work items can be inspected in Stage 2A. Editing, deletion and status changes remain disabled.",
    vi: "Có thể kiểm tra hạng mục công việc trong Stage 2A. Chỉnh sửa, xóa và đổi trạng thái vẫn bị tắt."
  },
  "panel.workItemDetail.title": {
    en: "Work Item Detail",
    vi: "Chi tiết hạng mục công việc"
  },
  "panel.workItemDetail.description": {
    en: "Work item detail data is unavailable from Core API.",
    vi: "Dữ liệu chi tiết hạng mục công việc không có từ Core API."
  },
  "panel.dryRun.title": {
    en: "Dry-run Action Preview",
    vi: "Xem trước hành động chạy thử"
  },
  "panel.dryRun.description": {
    en: "Preview only. No data will be changed. Future execution requires audit, confirmation and rollback gates.",
    vi: "Chỉ xem trước. Không dữ liệu nào bị thay đổi. Lần thực thi tương lai cần audit, xác nhận và cổng rollback."
  },
  "panel.actionRequest.title": {
    en: "PITS Action Request",
    vi: "Yeu cau hanh dong PITS"
  },
  "panel.actionRequest.description": {
    en: "Action request only. Work item is not changed yet. Requires owner or admin confirmation, audit trail and rollback plan.",
    vi: "Chi tao yeu cau hanh dong. Hang muc cong viec chua bi thay doi. Can chu so huu/quan tri xac nhan, nhat ky audit va ke hoach rollback."
  },
  "panel.actionRequest.boundaryDescription": {
    en: "No direct mutation. Requires audit trail, confirmation, permission check and rollback plan before any future execution.",
    vi: "Khong thay doi truc tiep. Can nhat ky audit, xac nhan, kiem tra quyen va ke hoach rollback truoc moi lan thuc thi trong tuong lai."
  },
  "status.readyToOperate": {
    en: "Ready to operate",
    vi: "Sẵn sàng vận hành"
  },
  "status.noIssueDetected": {
    en: "No issue detected",
    vi: "Không phát hiện vấn đề"
  },
  "status.incomplete": {
    en: "Incomplete",
    vi: "Chưa hoàn tất"
  },
  "status.healthReady": {
    en: "Health ready",
    vi: "Sức khỏe sẵn sàng"
  },
  "status.registryReady": {
    en: "Registry ready",
    vi: "Registry sẵn sàng"
  },
  "status.overviewReady": {
    en: "Overview ready",
    vi: "Tổng quan sẵn sàng"
  },
  "status.detailReady": {
    en: "Detail ready",
    vi: "Chi tiết sẵn sàng"
  },
  "status.missingLink": {
    en: "Missing link",
    vi: "Thiếu liên kết"
  },
  "status.previewUnavailable": {
    en: "Preview unavailable",
    vi: "Không có bản xem trước"
  },
  "status.notExecutableYet": {
    en: "Not executable yet",
    vi: "Chưa thể thực thi"
  },
  "status.readOnlyFunctionalSlice": {
    en: "Read-only functional slice",
    vi: "Lát cắt chức năng chỉ đọc"
  },
  "status.healthy": {
    en: "Healthy",
    vi: "Ổn định"
  },
  "status.configured": {
    en: "Configured",
    vi: "Đã cấu hình"
  },
  "status.linked": {
    en: "Linked",
    vi: "Đã liên kết"
  },
  "status.reachable": {
    en: "Reachable",
    vi: "Có thể truy cập"
  },
  "status.degraded": {
    en: "Degraded",
    vi: "Suy giảm"
  },
  "status.unavailable": {
    en: "Unavailable",
    vi: "Không khả dụng"
  },
  "status.notApplicable": {
    en: "Not applicable",
    vi: "Không áp dụng"
  },
  "status.missingUrl": {
    en: "Missing URL",
    vi: "Thiếu URL"
  },
  "status.readOnlyPreview": {
    en: "Read-only preview",
    vi: "Bản xem trước chỉ đọc"
  },
  "status.ownerReviewRequired": {
    en: "Owner review required",
    vi: "Cần chủ sở hữu rà soát"
  },
  "status.futureAdminAction": {
    en: "Future admin action",
    vi: "Hành động quản trị tương lai"
  },
  "status.blockedUntilAudit": {
    en: "Blocked until audit",
    vi: "Bị chặn đến khi audit"
  },
  "status.allowedReadOnly": {
    en: "Allowed read-only",
    vi: "Cho phép chỉ đọc"
  },
  "status.requiresOwnerApproval": {
    en: "Requires owner approval",
    vi: "Cần chủ sở hữu phê duyệt"
  },
  "status.requiresAdminPermission": {
    en: "Requires admin permission",
    vi: "Cần quyền quản trị"
  },
  "status.requiresAuditTrail": {
    en: "Requires audit trail",
    vi: "Cần nhật ký audit"
  },
  "status.requiresConfirmation": {
    en: "Requires confirmation",
    vi: "Can xac nhan"
  },
  "status.requiresRollbackPlan": {
    en: "Requires rollback plan",
    vi: "Cần kế hoạch rollback"
  },
  "status.draft": {
    en: "Draft",
    vi: "Ban nhap"
  },
  "status.pendingReview": {
    en: "Pending review",
    vi: "Dang cho ra soat"
  },
  "status.approvedPreview": {
    en: "Approved preview",
    vi: "Ban xem truoc da duyet"
  },
  "status.rejectedPreview": {
    en: "Rejected preview",
    vi: "Ban xem truoc bi tu choi"
  },
  "status.blockedBySafetyGate": {
    en: "Blocked by safety gate",
    vi: "Bi chan boi cong an toan"
  },
  "status.blockedCurrentStage": {
    en: "Blocked in current stage",
    vi: "Bị chặn trong giai đoạn hiện tại"
  },
  "label.totalProducts": {
    en: "Total products",
    vi: "Tổng số sản phẩm"
  },
  "label.totalWorkspaces": {
    en: "Total workspaces",
    vi: "Tổng số không gian làm việc"
  },
  "label.totalProjects": {
    en: "Total projects",
    vi: "Tổng số dự án"
  },
  "label.totalModules": {
    en: "Total modules",
    vi: "Tổng số module"
  },
  "label.totalInstallations": {
    en: "Total installations",
    vi: "Tổng số cài đặt"
  },
  "label.healthSummary": {
    en: "Health summary",
    vi: "Tóm tắt sức khỏe"
  },
  "label.readinessSummary": {
    en: "Readiness summary",
    vi: "Tóm tắt mức sẵn sàng"
  },
  "label.readyIncompleteBlocked": {
    en: "Ready / incomplete / blocked",
    vi: "Sẵn sàng / chưa hoàn tất / bị chặn"
  },
  "label.missingRuntimeUrl": {
    en: "Missing runtime URL",
    vi: "Thiếu URL runtime"
  },
  "label.forbiddenLinkGuard": {
    en: "Forbidden link guard",
    vi: "Kiểm tra liên kết bị cấm"
  },
  "label.quickDetailLinks": {
    en: "Quick detail links",
    vi: "Liên kết chi tiết nhanh"
  },
  "label.quickProjectLinks": {
    en: "Quick project links",
    vi: "Liên kết dự án nhanh"
  },
  "label.ownerUatLinks": {
    en: "Owner UAT links",
    vi: "Liên kết UAT của chủ sở hữu"
  },
  "label.service": {
    en: "Service",
    vi: "Dịch vụ"
  },
  "label.stage": {
    en: "Stage",
    vi: "Giai đoạn"
  },
  "label.source": {
    en: "Source",
    vi: "Nguồn"
  },
  "label.mode": {
    en: "Mode",
    vi: "Chế độ"
  },
  "label.environment": {
    en: "Environment",
    vi: "Môi trường"
  },
  "label.due": {
    en: "Due",
    vi: "Hạn"
  },
  "label.totalItems": {
    en: "Total items",
    vi: "Tổng hạng mục"
  },
  "label.highPriority": {
    en: "High priority",
    vi: "Ưu tiên cao"
  },
  "label.nextRecommendedAction": {
    en: "Next recommended action",
    vi: "Hành động khuyến nghị tiếp theo"
  },
  "label.currentValue": {
    en: "Current value",
    vi: "Giá trị hiện tại"
  },
  "label.proposedValue": {
    en: "Proposed value",
    vi: "Giá trị đề xuất"
  },
  "label.requiredRole": {
    en: "Required role",
    vi: "Vai trò yêu cầu"
  },
  "label.requestStatus": {
    en: "Request status",
    vi: "Trang thai yeu cau"
  },
  "label.permissionRequired": {
    en: "Permission required",
    vi: "Quyen yeu cau"
  },
  "label.requestedBy": {
    en: "Requested by",
    vi: "Nguoi yeu cau"
  },
  "label.requestedAt": {
    en: "Requested at",
    vi: "Thoi diem yeu cau"
  },
  "label.expectedImpact": {
    en: "Expected impact",
    vi: "Tac dong du kien"
  },
  "label.rollbackPlan": {
    en: "Rollback plan",
    vi: "Ke hoach rollback"
  },
  "label.createActionRequest": {
    en: "Create action request",
    vi: "Tao yeu cau hanh dong"
  },
  "label.previewRequest": {
    en: "Preview request",
    vi: "Xem truoc yeu cau"
  },
  "label.stageForReview": {
    en: "Stage for review",
    vi: "Dua vao hang cho ra soat"
  },
  "label.whatWouldHappen": {
    en: "What would happen?",
    vi: "Điều gì sẽ xảy ra?"
  },
  "label.whyBlockedNow": {
    en: "Why is it blocked now?",
    vi: "Vì sao hiện bị chặn?"
  },
  "label.availableDryRunActions": {
    en: "Available dry-run actions",
    vi: "Hành động chạy thử có sẵn"
  },
  "label.blockers": {
    en: "Blockers",
    vi: "Điểm chặn"
  },
  "label.readOnlyBoundary": {
    en: "Read-only boundary",
    vi: "Ranh giới chỉ đọc"
  },
  "label.relatedProject": {
    en: "Related project",
    vi: "Dự án liên quan"
  },
  "label.projectReadiness": {
    en: "Project readiness",
    vi: "Mức sẵn sàng dự án"
  },
  "message.noReadOnlyWorkItems": {
    en: "No read-only work items are mapped for this status.",
    vi: "Không có hạng mục công việc chỉ đọc nào được ánh xạ cho trạng thái này."
  },
  "message.noActionRequestReturned": {
    en: "No action request was returned",
    vi: "Khong co yeu cau hanh dong nao duoc tra ve"
  },
  "message.workboardGrouped": {
    en: "work items grouped by workflow status. This is the first real PITS user-level browser workflow.",
    vi: "hạng mục công việc được nhóm theo trạng thái luồng. Đây là luồng trình duyệt cấp người dùng PITS đầu tiên."
  },
  "count.industries": {
    en: "Industries",
    vi: "Ngành"
  },
  "count.organizations": {
    en: "Organizations",
    vi: "Tổ chức"
  },
  "count.workspaces": {
    en: "Workspaces",
    vi: "Không gian làm việc"
  },
  "count.projects": {
    en: "Projects",
    vi: "Dự án"
  },
  "count.products": {
    en: "Products",
    vi: "Sản phẩm"
  },
  "count.installations": {
    en: "Installations",
    vi: "Cài đặt"
  },
  "count.modules": {
    en: "Modules",
    vi: "Module"
  },
  "count.auditRecords": {
    en: "Audit Records",
    vi: "Bản ghi audit"
  },
  "priority.low": {
    en: "Low",
    vi: "Thấp"
  },
  "priority.medium": {
    en: "Medium",
    vi: "Trung bình"
  },
  "priority.high": {
    en: "High",
    vi: "Cao"
  },
  "priority.critical": {
    en: "Critical",
    vi: "Khẩn cấp"
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
  "product-flow": "common.productFlow",
  localization: "common.localization"
};

const statusTranslationKeys: Record<string, TranslationKey> = {
  OPEN: "common.open",
  IN_PROGRESS: "common.inProgress",
  BLOCKED: "common.blocked",
  DONE: "common.done"
};

export const localizationManualEditPath = "packages/shared-ui/src/localization.ts";

const translationEntries = Object.entries(translations) as Array<[TranslationKey, Record<Locale, string>]>;

const displayTextTranslationKeys = translationEntries.reduce<Record<string, TranslationKey>>((keys, [key, entry]) => {
  keys[entry.en] = key;

  return keys;
}, {});

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

export function localizeDisplayText(text: string, locale: Locale): string {
  const key = displayTextTranslationKeys[text];

  return key ? translate(key, locale) : text;
}

export type LocalizationNamespaceSummary = {
  namespace: string;
  totalKeys: number;
  missingKeys: number;
  fallbackKeys: number;
  sampleKeys: TranslationKey[];
};

export type LocalizationCatalog = {
  currentLocale: Locale;
  availableLocales: Locale[];
  totalKeys: number;
  missingKeyCount: number;
  fallbackKeyCount: number;
  manualEditLocation: string;
  namespaces: LocalizationNamespaceSummary[];
};

export function getLocalizationCatalog(locale: Locale = defaultLocale): LocalizationCatalog {
  const namespaceMap = new Map<string, Array<[TranslationKey, Record<Locale, string>]>>();

  for (const entry of translationEntries) {
    const namespace = entry[0].split(".")[0] ?? "common";
    const namespaceEntries = namespaceMap.get(namespace) ?? [];
    namespaceEntries.push(entry);
    namespaceMap.set(namespace, namespaceEntries);
  }

  const namespaces = Array.from(namespaceMap.entries())
    .map<LocalizationNamespaceSummary>(([namespace, entries]) => {
      const missingKeys = entries.filter(([, entry]) => !entry[locale]).length;
      const fallbackKeys =
        locale === defaultLocale ? 0 : entries.filter(([, entry]) => Boolean(entry[locale]) && entry[locale] === entry[defaultLocale]).length;

      return {
        namespace,
        totalKeys: entries.length,
        missingKeys,
        fallbackKeys,
        sampleKeys: entries.slice(0, 4).map(([key]) => key)
      };
    })
    .sort((left, right) => left.namespace.localeCompare(right.namespace));

  return {
    currentLocale: locale,
    availableLocales: [...supportedLocales],
    totalKeys: translationEntries.length,
    missingKeyCount: namespaces.reduce((total, namespace) => total + namespace.missingKeys, 0),
    fallbackKeyCount: namespaces.reduce((total, namespace) => total + namespace.fallbackKeys, 0),
    manualEditLocation: localizationManualEditPath,
    namespaces
  };
}
