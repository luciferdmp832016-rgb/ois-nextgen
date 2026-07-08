import { describe, expect, it } from "vitest";

import {
  defaultLocale,
  isSupportedLocale,
  localizeNavLabel,
  localizeStatusCode,
  normalizeLocale,
  translate
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
});
