import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  getLocalizationCatalog,
  isSupportedLocale,
  localizeDisplayText,
  localizeNavLabel,
  localizeStatusCode,
  normalizeLocale,
  translate,
  translations
} from "./localization";

describe("shared localization foundation", () => {
  it("defaults deterministically to English and supports Vietnamese", () => {
    expect(defaultLocale).toBe("en");
    expect(isSupportedLocale("en")).toBe(true);
    expect(isSupportedLocale("vi")).toBe(true);
    expect(normalizeLocale("missing")).toBe("en");
    expect(translate("language.settings", "en")).toBe("Language Settings");
    expect(translate("language.settings", "vi")).toBe("Cài đặt ngôn ngữ");
    expect(translate("language.vietnamese", "en")).toBe("Tiếng Việt");
  });

  it("falls back to stable keys when a translation key is missing", () => {
    expect(translate("missing.translation.key", "vi")).toBe("missing.translation.key");
  });

  it("localizes product shell navigation without changing stable IDs", () => {
    expect(localizeNavLabel("projects", "Projects", "en")).toBe("Projects");
    expect(localizeNavLabel("projects", "Projects", "vi")).toBe("Dự án");
    expect(localizeNavLabel("unknown", "Stable Label", "vi")).toBe("Stable Label");
  });

  it("localizes status presentation while preserving internal codes", () => {
    expect(localizeStatusCode("OPEN", "en")).toBe("Open");
    expect(localizeStatusCode("IN_PROGRESS", "vi")).toBe("Đang xử lý");
    expect(localizeStatusCode("BLOCKED", "vi")).toBe("Bị chặn");
    expect(localizeStatusCode("DONE", "vi")).toBe("Hoàn tất");
    expect(localizeStatusCode("CUSTOM_INTERNAL_CODE", "vi")).toBe("CUSTOM_INTERNAL_CODE");
  });

  it("localizes exact visible UI labels without changing unknown stable values", () => {
    expect(localizeDisplayText("Runtime Status", "vi")).toBe("Trạng thái runtime");
    expect(localizeDisplayText("PITS Action Request", "vi")).toBe("Yeu cau hanh dong PITS");
    expect(localizeDisplayText("Action request only", "vi")).toBe("Chi tao yeu cau hanh dong");
    expect(localizeDisplayText("No direct mutation", "vi")).toBe("Khong thay doi truc tiep");
    expect(localizeDisplayText("Pending review", "vi")).toBe("Dang cho ra soat");
    expect(localizeDisplayText("Requires confirmation", "vi")).toBe("Can xac nhan");
    expect(localizeDisplayText("Core API source:", "vi")).toBe("Core API source:");
    expect(localizeDisplayText("OIS_CONSOLE", "vi")).toBe("OIS_CONSOLE");
  });

  it("reports read-only catalog coverage for manual language-pack review", () => {
    const catalog = getLocalizationCatalog("vi");

    expect(catalog.availableLocales).toEqual(["en", "vi"]);
    expect(catalog.totalKeys).toBe(Object.keys(translations).length);
    expect(catalog.missingKeyCount).toBe(0);
    expect(catalog.manualEditLocation).toBe("packages/shared-ui/src/localization.ts");
    expect(catalog.namespaces.map((namespace) => namespace.namespace)).toContain("panel");
    expect(catalog.namespaces.map((namespace) => namespace.namespace)).toContain("status");
    expect(catalog.namespaces.map((namespace) => namespace.namespace)).toContain("message");
    expect(translations["panel.actionRequest.title"]).toMatchObject({
      en: "PITS Action Request",
      vi: "Yeu cau hanh dong PITS"
    });
  });
});
