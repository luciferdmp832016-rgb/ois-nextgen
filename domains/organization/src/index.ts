import { createHash } from "node:crypto";
import { createAuditEnvelope, type AuditEnvelope, type AuditEventInput } from "@ois/audit";
import { hasCapability, hasPermission, type CapabilityGrant, type PermissionBinding } from "@ois/identity-access";
import { assertProjectScope, assertWorkspaceScope, type TenantContext } from "@ois/tenant-context";

export interface Industry {
  id: string;
  code: string;
  name: string;
}

export interface Organization {
  id: string;
  code: string;
  name: string;
  industryId: string;
}

export interface Workspace {
  id: string;
  code: string;
  name: string;
  organizationId: string;
}

export interface Project {
  id: string;
  code: string;
  name: string;
  workspaceId: string;
}

export interface ProductDefinition {
  id: string;
  code: string;
  name: string;
}

export interface ProductInstallation {
  id: string;
  productCode: string;
  projectId: string;
  workspaceId: string;
  lifecycle: string;
  version?: number;
  configuration?: Record<string, unknown>;
}

export interface KernelData {
  industries: Industry[];
  organizations: Organization[];
  workspaces: Workspace[];
  projects: Project[];
  productDefinitions: ProductDefinition[];
  productInstallations: ProductInstallation[];
  permissionBindings: PermissionBinding[];
  capabilityGrants: CapabilityGrant[];
}

export function validateHierarchy(data: Pick<KernelData, "industries" | "organizations" | "workspaces" | "projects">): boolean {
  const industryIds = new Set(data.industries.map((industry) => industry.id));
  const organizationIds = new Set(data.organizations.map((organization) => organization.id));
  const workspaceIds = new Set(data.workspaces.map((workspace) => workspace.id));

  return (
    data.organizations.every((organization) => industryIds.has(organization.industryId)) &&
    data.workspaces.every((workspace) => organizationIds.has(workspace.organizationId)) &&
    data.projects.every((project) => workspaceIds.has(project.workspaceId))
  );
}

function upsertById<T extends { id: string }>(current: T[], incoming: T[]): T[] {
  const map = new Map<string, T>();
  for (const item of current) map.set(item.id, item);
  for (const item of incoming) map.set(item.id, item);
  return Array.from(map.values());
}

export class IdempotencyPayloadMismatchError extends Error {
  constructor(key: string) {
    super(`Idempotency payload mismatch for key ${key}`);
    this.name = "IdempotencyPayloadMismatchError";
  }
}

export class OptimisticConcurrencyError extends Error {
  constructor(
    public readonly currentVersion: number,
    public readonly expectedVersion: number
  ) {
    super(`Version mismatch: expected ${expectedVersion}, current ${currentVersion}`);
    this.name = "OptimisticConcurrencyError";
  }
}

export interface IdempotentResult<T> {
  replayed: boolean;
  result: T;
}

function hashPayload(payload: unknown): string {
  return createHash("sha256").update(JSON.stringify(payload)).digest("hex");
}

export class InMemoryKernelRepository {
  private data: KernelData;
  private auditRecords: AuditEnvelope[] = [];
  private idempotencyRecords = new Map<string, { payloadHash: string; result: unknown }>();

  constructor(seed: KernelData) {
    this.data = {
      industries: [...seed.industries],
      organizations: [...seed.organizations],
      workspaces: [...seed.workspaces],
      projects: [...seed.projects],
      productDefinitions: [...seed.productDefinitions],
      productInstallations: [...seed.productInstallations],
      permissionBindings: [...seed.permissionBindings],
      capabilityGrants: [...seed.capabilityGrants]
    };
  }

  seed(seed: KernelData): number {
    this.data = {
      industries: upsertById(this.data.industries, seed.industries),
      organizations: upsertById(this.data.organizations, seed.organizations),
      workspaces: upsertById(this.data.workspaces, seed.workspaces),
      projects: upsertById(this.data.projects, seed.projects),
      productDefinitions: upsertById(this.data.productDefinitions, seed.productDefinitions),
      productInstallations: upsertById(this.data.productInstallations, seed.productInstallations),
      permissionBindings: [...seed.permissionBindings],
      capabilityGrants: [...seed.capabilityGrants]
    };
    return this.countKernelRows();
  }

  countKernelRows(): number {
    return (
      this.data.industries.length +
      this.data.organizations.length +
      this.data.workspaces.length +
      this.data.projects.length +
      this.data.productDefinitions.length +
      this.data.productInstallations.length
    );
  }

  getWorkspace(context: TenantContext, workspaceId: string): Workspace {
    assertWorkspaceScope(context, workspaceId);
    const workspace = this.data.workspaces.find((candidate) => candidate.id === workspaceId);
    if (!workspace) throw new Error(`Workspace not found: ${workspaceId}`);
    return workspace;
  }

  getProject(context: TenantContext, projectId: string): Project {
    const project = this.data.projects.find((candidate) => candidate.id === projectId);
    if (!project) throw new Error(`Project not found: ${projectId}`);
    assertProjectScope(context, project);
    return project;
  }

  resolveProductInstallation(context: TenantContext, productCode: string, projectId: string): ProductInstallation {
    const project = this.getProject(context, projectId);
    const installation = this.data.productInstallations.find(
      (candidate) => candidate.projectId === project.id && candidate.productCode === productCode && candidate.lifecycle === "ACTIVE"
    );
    if (!installation) throw new Error(`No active ${productCode} installation for project ${projectId}`);
    return installation;
  }

  can(context: TenantContext, permissionCode: string): boolean {
    return hasPermission({
      roleCodes: context.roleCodes,
      permissionCode,
      bindings: this.data.permissionBindings
    });
  }

  canUseCapability(context: TenantContext, capabilityCode: string): boolean {
    if (!context.productInstallationId) return false;
    return hasCapability({
      productInstallationId: context.productInstallationId,
      capabilityCode,
      grants: this.data.capabilityGrants
    });
  }

  audit(context: TenantContext, input: AuditEventInput): AuditEnvelope {
    const record = createAuditEnvelope(context, input);
    this.auditRecords.push(record);
    return record;
  }

  audits(): AuditEnvelope[] {
    return [...this.auditRecords];
  }

  executeIdempotent<T>(key: string, payload: unknown, command: () => T): IdempotentResult<T> {
    const payloadHash = hashPayload(payload);
    const existing = this.idempotencyRecords.get(key);
    if (existing) {
      if (existing.payloadHash !== payloadHash) throw new IdempotencyPayloadMismatchError(key);
      return { replayed: true, result: existing.result as T };
    }

    const result = command();
    this.idempotencyRecords.set(key, { payloadHash, result });
    return { replayed: false, result };
  }

  updateProductInstallationConfiguration(input: {
    productInstallationId: string;
    expectedVersion: number;
    configuration: Record<string, unknown>;
  }): ProductInstallation {
    const installation = this.data.productInstallations.find(
      (candidate) => candidate.id === input.productInstallationId
    );
    if (!installation) throw new Error(`Product installation not found: ${input.productInstallationId}`);

    const currentVersion = installation.version ?? 1;
    if (currentVersion !== input.expectedVersion) {
      throw new OptimisticConcurrencyError(currentVersion, input.expectedVersion);
    }

    const updated: ProductInstallation = {
      ...installation,
      configuration: input.configuration,
      version: currentVersion + 1
    };
    this.data.productInstallations = this.data.productInstallations.map((candidate) =>
      candidate.id === updated.id ? updated : candidate
    );
    return updated;
  }
}

export function productRuntimeCanAccessControlPlaneRoute(productCode: string, route: string): boolean {
  if (productCode === "PITS" && /^\/(admin|architecture|products|users|access-control)/.test(route)) {
    return false;
  }
  return true;
}
