import { describe, expect, it } from "vitest";
import { buildCoreApi } from "./app";

describe("core api root contract", () => {
  it("returns deterministic service identity", async () => {
    const app = buildCoreApi();

    try {
      const response = await app.inject({ method: "GET", url: "/" });

      expect(response.statusCode).toBe(200);
      expect(response.headers["content-type"]).toContain("application/json");
      expect(response.json()).toEqual({
        service: "ois-nextgen-core-api",
        status: "ok",
        version: "0.1.0",
        health: "/health",
        docs: "/docs"
      });
    } finally {
      await app.close();
    }
  });
});
