import { createHash } from "node:crypto";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ids = {
  industry: "ind_building_management",
  organization: "org_pmc_demo",
  workspace: "ws_pmc_org_demo",
  emeraldProject: "prj_emerald_precinct_demo",
  secondProject: "prj_second_project_demo",
  products: {
    OIS: "prod_ois",
    PITS: "prod_pits",
    CS_AGENT: "prod_cs_agent",
    KEIHB: "prod_keihb",
    ICR: "prod_icr"
  },
  installations: {
    emeraldPits: "inst_pits_emerald",
    secondPits: "inst_pits_second"
  }
} as const;

const roles = [
  { id: "role_super_admin", code: "SUPER_ADMIN", name: "Super Admin", realmCode: "OIS_ORGANIZATION_USER", scope: "ORGANIZATION", productId: ids.products.OIS },
  { id: "role_workspace_admin", code: "WORKSPACE_ADMIN", name: "Workspace Admin", realmCode: "OIS_ORGANIZATION_USER", scope: "WORKSPACE", productId: ids.products.OIS },
  { id: "role_bql", code: "BQL", name: "BQL", realmCode: "PITS_PROJECT_USER", scope: "PROJECT", productId: ids.products.PITS },
  { id: "role_leader", code: "LEADER", name: "Leader", realmCode: "PITS_PROJECT_USER", scope: "PROJECT", productId: ids.products.PITS },
  { id: "role_staff", code: "STAFF", name: "Staff", realmCode: "PITS_PROJECT_USER", scope: "PROJECT", productId: ids.products.PITS },
  { id: "role_auditor", code: "AUDITOR", name: "Auditor", realmCode: "OIS_ORGANIZATION_USER", scope: "WORKSPACE", productId: ids.products.OIS }
] as const;

const permissions = [
  { id: "perm_platform_overview_read", code: "platform:overview:read", name: "Read platform overview", productId: ids.products.OIS, scope: "PLATFORM" },
  { id: "perm_organization_read", code: "organization:read", name: "Read organizations", productId: ids.products.OIS, scope: "ORGANIZATION" },
  { id: "perm_workspace_read", code: "workspace:read", name: "Read workspaces", productId: ids.products.OIS, scope: "WORKSPACE" },
  { id: "perm_project_read", code: "project:read", name: "Read projects", productId: ids.products.OIS, scope: "PROJECT" },
  { id: "perm_product_catalog_read", code: "product:catalog:read", name: "Read product catalog", productId: ids.products.OIS, scope: "PLATFORM" },
  { id: "perm_product_installation_read", code: "product:installation:read", name: "Read product installations", productId: ids.products.OIS, scope: "PROJECT" },
  { id: "perm_product_installation_manage", code: "product:installation:manage", name: "Manage product installations", productId: ids.products.OIS, scope: "PROJECT" },
  { id: "perm_module_catalog_read", code: "module:catalog:read", name: "Read module catalog", productId: ids.products.OIS, scope: "PLATFORM" },
  { id: "perm_identity_read", code: "identity:read", name: "Read identity placeholders", productId: ids.products.OIS, scope: "ORGANIZATION" },
  { id: "perm_access_read", code: "access:read", name: "Read access placeholders", productId: ids.products.OIS, scope: "ORGANIZATION" },
  { id: "perm_audit_read", code: "audit:read", name: "Read audit records", productId: ids.products.OIS, scope: "ORGANIZATION" },
  { id: "perm_pits_runtime_access", code: "pits:runtime:access", name: "Access PITS runtime shell", productId: ids.products.PITS, scope: "PROJECT" }
] as const;

const users = [
  { id: "user_super_admin_demo", email: "super.admin.demo@ois.local", displayName: "Super Admin Demo", realmCode: "OIS_ORGANIZATION_USER", roleCode: "SUPER_ADMIN" },
  { id: "user_workspace_admin_demo", email: "workspace.admin.demo@ois.local", displayName: "Workspace Admin Demo", realmCode: "OIS_ORGANIZATION_USER", roleCode: "WORKSPACE_ADMIN" },
  { id: "user_bql_demo", email: "bql.demo@ois.local", displayName: "BQL Demo", realmCode: "PITS_PROJECT_USER", roleCode: "BQL" },
  { id: "user_leader_demo", email: "leader.demo@ois.local", displayName: "Leader Demo", realmCode: "PITS_PROJECT_USER", roleCode: "LEADER" },
  { id: "user_staff_demo", email: "staff.demo@ois.local", displayName: "Staff Demo", realmCode: "PITS_PROJECT_USER", roleCode: "STAFF" },
  { id: "user_auditor_demo", email: "auditor.demo@ois.local", displayName: "Auditor Demo", realmCode: "OIS_ORGANIZATION_USER", roleCode: "AUDITOR" }
] as const;

function hashJson(value: unknown): string {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function normalize(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (Array.isArray(value)) return value.map((entry) => normalize(entry));
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .sort(([left], [right]) => left.localeCompare(right))
        .map(([key, entry]) => [key, normalize(entry)])
    );
  }
  return value;
}

function valuesMatch(left: unknown, right: unknown): boolean {
  return JSON.stringify(normalize(left)) === JSON.stringify(normalize(right));
}

function requiresUpdate(existing: Record<string, unknown>, desired: Record<string, unknown>): boolean {
  return Object.entries(desired).some(([key, value]) => !valuesMatch(existing[key], value));
}

async function ensureRecord(
  delegate: any,
  where: Record<string, unknown>,
  create: Record<string, unknown>,
  update: Record<string, unknown> = create
): Promise<void> {
  const existing = await delegate.findUnique({ where });
  if (!existing) {
    await delegate.create({ data: create });
    return;
  }

  if (requiresUpdate(existing, update)) {
    await delegate.update({ where, data: update });
  }
}

async function main(): Promise<void> {
  console.log("DEMO DATA - NOT PRODUCTION");

  await ensureRecord(prisma.industry, { id: ids.industry }, {
    id: ids.industry,
    code: "BUILDING_MANAGEMENT",
    name: "Building Management"
  });

  await ensureRecord(prisma.organization, { id: ids.organization }, {
    id: ids.organization,
    code: "PMC_DEMO",
    name: "PMC Demo",
    industryId: ids.industry
  });

  await ensureRecord(prisma.workspace, { id: ids.workspace }, {
    id: ids.workspace,
    code: "PMC_ORG_DEMO",
    name: "PMC Org Demo",
    organizationId: ids.organization
  });

  for (const project of [
    { id: ids.emeraldProject, code: "EMERALD_PRECINCT_DEMO", name: "Emerald Precinct Demo" },
    { id: ids.secondProject, code: "SECOND_PROJECT_DEMO", name: "Second Project Demo" }
  ]) {
    await ensureRecord(prisma.project, { id: project.id }, { ...project, workspaceId: ids.workspace });
  }

  for (const product of [
    { id: ids.products.OIS, code: "OIS", name: "OIS" },
    { id: ids.products.PITS, code: "PITS", name: "PITS" },
    { id: ids.products.CS_AGENT, code: "CS_AGENT", name: "csAgent" },
    { id: ids.products.KEIHB, code: "KEIHB", name: "KEIHB" },
    { id: ids.products.ICR, code: "ICR", name: "ICR" }
  ] as const) {
    await ensureRecord(prisma.productDefinition, { id: product.id }, product);
  }

  for (const realm of [
    { id: "realm_ois_org_user", code: "OIS_ORGANIZATION_USER", name: "OIS Organization User" },
    { id: "realm_pits_project_user", code: "PITS_PROJECT_USER", name: "PITS Project User" },
    { id: "realm_csagent_resident", code: "CSAGENT_RESIDENT", name: "csAgent Resident" },
    { id: "realm_external_partner", code: "EXTERNAL_PARTNER", name: "External Partner" },
    { id: "realm_system_service", code: "SYSTEM_SERVICE", name: "System Service" }
  ] as const) {
    await ensureRecord(prisma.identityRealm, { id: realm.id }, realm);
  }

  for (const user of users) {
    await ensureRecord(prisma.userAccount, { id: user.id }, {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      realmCode: user.realmCode
    });

    await ensureRecord(
      prisma.workspaceMembership,
      {
        workspaceId_userId_roleCode: {
          workspaceId: ids.workspace,
          userId: user.id,
          roleCode: user.roleCode
        }
      },
      {
        id: `membership_${user.roleCode.toLowerCase()}`,
        organizationId: ids.organization,
        workspaceId: ids.workspace,
        userId: user.id,
        roleCode: user.roleCode
      },
      { lifecycle: "ACTIVE" }
    );
  }

  for (const role of roles) {
    await ensureRecord(
      prisma.roleDefinition,
      { id: role.id },
      { ...role, organizationId: ids.organization },
      {
        name: role.name,
        lifecycle: "ACTIVE"
      }
    );
  }

  for (const permission of permissions) {
    await ensureRecord(
      prisma.permissionDefinition,
      { id: permission.id },
      { ...permission, layerCode: "L0_OPERATIONAL_DATA" },
      { name: permission.name, lifecycle: "ACTIVE" }
    );
  }

  const rolePermissionPairs = [
    ["role_super_admin", "perm_platform_overview_read"],
    ["role_super_admin", "perm_product_installation_manage"],
    ["role_super_admin", "perm_audit_read"],
    ["role_workspace_admin", "perm_workspace_read"],
    ["role_workspace_admin", "perm_project_read"],
    ["role_auditor", "perm_audit_read"],
    ["role_bql", "perm_pits_runtime_access"],
    ["role_leader", "perm_pits_runtime_access"],
    ["role_staff", "perm_pits_runtime_access"],
    ["role_staff", "perm_project_read"]
  ] as const;

  for (const [roleId, permissionId] of rolePermissionPairs) {
    await ensureRecord(
      prisma.rolePermission,
      { roleId_permissionId: { roleId, permissionId } },
      {
        id: `rp_${roleId}_${permissionId}`,
        roleId,
        permissionId
      },
      { lifecycle: "ACTIVE" }
    );
  }

  for (const module of [
    {
      id: "module_platform_kernel_api",
      code: "PLATFORM_KERNEL_API",
      productId: ids.products.OIS,
      productCode: "OIS",
      layerCode: "L0_OPERATIONAL_DATA",
      scope: "PLATFORM",
      realmCode: "SYSTEM_SERVICE",
      moduleType: "PLATFORM_KERNEL"
    },
    {
      id: "module_ois_console_architecture_status",
      code: "OIS_CONSOLE_ARCHITECTURE_STATUS",
      productId: ids.products.OIS,
      productCode: "OIS",
      layerCode: "L0_OPERATIONAL_DATA",
      scope: "PLATFORM",
      realmCode: "OIS_ORGANIZATION_USER",
      moduleType: "CONTROL_PLANE_VIEW"
    },
    {
      id: "module_pits_runtime_shell",
      code: "PITS_RUNTIME_SHELL",
      productId: ids.products.PITS,
      productCode: "PITS",
      layerCode: "L0_OPERATIONAL_DATA",
      scope: "PROJECT",
      realmCode: "PITS_PROJECT_USER",
      moduleType: "PRODUCT_RUNTIME_VIEW"
    }
  ] as const) {
    await ensureRecord(prisma.moduleDefinition, { id: module.id }, module, { lifecycle: "ACTIVE" });
  }

  const productInstallationConfiguration = { demoOnly: true, label: "DEMO DATA - NOT PRODUCTION" };
  for (const installation of [
    { id: ids.installations.emeraldPits, projectId: ids.emeraldProject },
    { id: ids.installations.secondPits, projectId: ids.secondProject }
  ]) {
    await ensureRecord(
      prisma.productInstallation,
      { id: installation.id },
      {
        id: installation.id,
        productCode: "PITS",
        productId: ids.products.PITS,
        organizationId: ids.organization,
        workspaceId: ids.workspace,
        projectId: installation.projectId,
        configuration: productInstallationConfiguration
      },
      { lifecycle: "ACTIVE", configuration: productInstallationConfiguration }
    );

    await ensureRecord(
      prisma.productCapabilityGrant,
      {
        productInstallationId_capabilityCode: {
          productInstallationId: installation.id,
          capabilityCode: "pits:runtime:access"
        }
      },
      {
        id: `grant_${installation.id}_pits_runtime_access`,
        productInstallationId: installation.id,
        capabilityCode: "pits:runtime:access",
        enabled: true
      },
      { enabled: true, lifecycle: "ACTIVE" }
    );
  }

  const configValue = { source: "bootstrap-stage-a", demoOnly: true };
  await ensureRecord(
    prisma.effectiveConfigurationSnapshot,
    { id: "config_stage_a_demo_notice_v1" },
    {
      id: "config_stage_a_demo_notice_v1",
      key: "demo.notice",
      value: configValue,
      valueHash: hashJson(configValue),
      scope: "WORKSPACE",
      organizationId: ids.organization,
      workspaceId: ids.workspace
    },
    { value: configValue, valueHash: hashJson(configValue), isCurrent: true }
  );

  await ensureRecord(
    prisma.featureFlag,
    { id: "flag_stage_a_kernel_only" },
    {
      id: "flag_stage_a_kernel_only",
      code: "stage_a.kernel_only",
      enabled: true,
      scope: "WORKSPACE",
      organizationId: ids.organization,
      workspaceId: ids.workspace
    },
    { enabled: true }
  );

  await ensureRecord(
    prisma.auditRecord,
    { id: "audit_stage_a_seed" },
    {
      id: "audit_stage_a_seed",
      organizationId: ids.organization,
      workspaceId: ids.workspace,
      actorId: "user_super_admin_demo",
      action: "BOOTSTRAP_STAGE_A_SEED",
      targetType: "Workspace",
      targetId: ids.workspace,
      sensitive: true,
      metadata: { idempotent: true, demoOnly: true }
    },
    { metadata: { idempotent: true, demoOnly: true } }
  );

  await ensureRecord(
    prisma.legacyIdentityMap,
    {
      legacySystem_legacyEntityType_legacyEntityId: {
        legacySystem: "OIS_LEGACY_REFERENCE",
        legacyEntityType: "Workspace",
        legacyEntityId: "PMC_DEMO_PLACEHOLDER"
      }
    },
    {
      id: "legacy_map_workspace_demo_placeholder",
      legacySystem: "OIS_LEGACY_REFERENCE",
      legacyEntityType: "Workspace",
      legacyEntityId: "PMC_DEMO_PLACEHOLDER",
      nextgenEntityType: "Workspace",
      nextgenEntityId: ids.workspace,
      organizationId: ids.organization,
      workspaceId: ids.workspace
    },
    { nextgenEntityId: ids.workspace }
  );
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
