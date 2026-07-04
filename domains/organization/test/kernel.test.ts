import { describe, expect, it } from "vitest";
import { resolveConfiguration } from "@ois/config-compiler";
import { assertIdentityRealm, IdentityRealmError, TenantScopeError } from "@ois/tenant-context";
import { demoIds, demoKernelData, demoTenantContexts } from "@ois/test-fixtures";
import {
  IdempotencyPayloadMismatchError,
  InMemoryKernelRepository,
  OptimisticConcurrencyError,
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

  it("enforces identity realms", () => {
    expect(() => assertIdentityRealm(demoTenantContexts.emeraldStaff, "OIS_ORGANIZATION_USER")).toThrow(
      IdentityRealmError
    );
    expect(() => assertIdentityRealm(demoTenantContexts.emeraldStaff, "PITS_PROJECT_USER")).not.toThrow();
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

  it("replays idempotent commands with the same payload", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    const first = repo.executeIdempotent("idem-install-001", { action: "install", projectId: demoIds.emeraldProject }, () => ({
      installationId: demoIds.emeraldPitsInstallation
    }));
    const second = repo.executeIdempotent("idem-install-001", { action: "install", projectId: demoIds.emeraldProject }, () => ({
      installationId: "should_not_run"
    }));

    expect(first.replayed).toBe(false);
    expect(second.replayed).toBe(true);
    expect(second.result.installationId).toBe(demoIds.emeraldPitsInstallation);
  });

  it("rejects idempotency payload mismatch", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    repo.executeIdempotent("idem-install-002", { projectId: demoIds.emeraldProject }, () => ({ ok: true }));

    expect(() =>
      repo.executeIdempotent("idem-install-002", { projectId: demoIds.secondProject }, () => ({ ok: false }))
    ).toThrow(IdempotencyPayloadMismatchError);
  });

  it("updates versioned aggregates with the expected version", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    const updated = repo.updateProductInstallationConfiguration({
      productInstallationId: demoIds.emeraldPitsInstallation,
      expectedVersion: 1,
      configuration: { demoOnly: true, source: "stage-0b-test" }
    });

    expect(updated.version).toBe(2);
    expect(updated.configuration).toMatchObject({ source: "stage-0b-test" });
  });

  it("rejects stale aggregate versions", () => {
    const repo = new InMemoryKernelRepository(demoKernelData);
    repo.updateProductInstallationConfiguration({
      productInstallationId: demoIds.emeraldPitsInstallation,
      expectedVersion: 1,
      configuration: { firstWrite: true }
    });

    expect(() =>
      repo.updateProductInstallationConfiguration({
        productInstallationId: demoIds.emeraldPitsInstallation,
        expectedVersion: 1,
        configuration: { staleWrite: true }
      })
    ).toThrow(OptimisticConcurrencyError);
  });

  it("prevents Product Runtime from accessing Control Plane routes", () => {
    expect(productRuntimeCanAccessControlPlaneRoute("PITS", "/admin/users")).toBe(false);
    expect(productRuntimeCanAccessControlPlaneRoute("PITS", "/home")).toBe(true);
  });
});
