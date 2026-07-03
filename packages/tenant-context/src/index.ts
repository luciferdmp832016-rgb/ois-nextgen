import type { IdentityRealmCode } from "@ois/architecture-contracts";

export interface TenantContext {
  actorId: string;
  realm: IdentityRealmCode;
  organizationId: string;
  workspaceId?: string;
  projectId?: string;
  productInstallationId?: string;
  roleCodes: string[];
}

export class TenantScopeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TenantScopeError";
  }
}

export function assertWorkspaceScope(context: TenantContext, workspaceId: string): void {
  if (context.workspaceId && context.workspaceId !== workspaceId) {
    throw new TenantScopeError(`Workspace scope rejected for ${workspaceId}`);
  }
}

export function assertProjectScope(context: TenantContext, project: { id: string; workspaceId: string }): void {
  assertWorkspaceScope(context, project.workspaceId);
  if (context.projectId && context.projectId !== project.id) {
    throw new TenantScopeError(`Project scope rejected for ${project.id}`);
  }
}
