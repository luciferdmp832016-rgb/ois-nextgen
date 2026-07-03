import { describe, expect, it } from "vitest";
import { resolveConfiguration } from "@ois/config-compiler";
import { TenantScopeError } from "@ois/tenant-context";
import { demoIds, demoKernelData, demoTenantContexts } from "@ois/test-fixtures";
import {
  InMemoryKernelRepository,
  productRuntimeCanAccessControlPlaneRoute,
  validateHierarchy
} from "../src/index";

describe("platform kernel", () => {
  it("validates the organization/workspace/project hierarchy", () => {
    expect(validateHierarchy(demoKernelData)).toBe(true);
  });

  it("rejects cross-workspace access", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    expect(() => repo.getWorkspace(demoTenantContexts.emeraldStaff, demoIds.otherWorkspace)).toThrow(TenantScopeError);
  });

  it("rejects project scope mismatch", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    expect(() => repo.getProject(demoTenantContexts.emeraldStaff, demoIds.secondProject)).toThrow(TenantScopeError);
  });

  it("resolves product installation for a scoped project", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    const installation = repo.resolveProductInstallation(demoTenantContexts.emeraldStaff, "PITS", demoIds.emeraldProject);
    expect(installation.id).toBe(demoIds.emeraldPitsInstallation);
  });

  it("evaluates product capability grants", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    expect(repo.canUseCapability(demoTenantContexts.emeraldStaff, "pits:runtime:access")).toBe(true);
  });

  it("evaluates permissions", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    expect(repo.can(demoTenantContexts.superAdmin, "product:installation:manage")).toBe(true);
    expect(repo.can(demoTenantContexts.emeraldStaff, "product:installation:manage")).toBe(false);
  });

  it("resolves configuration precedence", () => {
    const value = resolveConfiguration([
      { scope: "PLATFORM", value: "platform-default" },
      { scope: "WORKSPACE", value: "workspace-default" },
      { scope: "PROJECT", value: "project-override" }
    ]);
    expect(value).toBe("project-override");
  });

  it("creates audit records with tenant scope", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    const record = repo.audit(demoTenantContexts.superAdmin, {
      action: "PRODUCT_INSTALLATION_CREATED",
      targetType: "ProductInstallation",
      targetId: demoIds.emeraldPitsInstallation,
      sensitive: true
    });
    expect(record.organizationId).toBe(demoIds.organization);
    expect(repo.audits()).toHaveLength(1);
  });

  it("keeps the kernel seed idempotent", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    const first = repo.seed(demoKernelData);
    const second = repo.seed(demoKernelData);
    expect(second).toBe(first);
  });

  it("prevents Product Runtime from accessing Control Plane routes", () => {
    expect(productRuntimeCanAccessControlPlaneRoute("PITS", "/admin/users")).toBe(false);
    expect(productRuntimeCanAccessControlPlaneRoute("PITS", "/home")).toBe(true);
  });
});
