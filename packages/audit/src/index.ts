import type { TenantContext } from "@ois/tenant-context";

export interface AuditEventInput {
  action: string;
  targetType: string;
  targetId: string;
  sensitive?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AuditEnvelope extends AuditEventInput {
  actorId: string;
  organizationId: string;
  workspaceId: string | null;
  projectId: string | null;
  occurredAt: Date;
}

export function createAuditEnvelope(context: TenantContext, event: AuditEventInput): AuditEnvelope {
  return {
    ...event,
    actorId: context.actorId,
    organizationId: context.organizationId,
    workspaceId: context.workspaceId ?? null,
    projectId: context.projectId ?? null,
    occurredAt: new Date()
  };
}
