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

async function main(): Promise<void> {
  console.log("DEMO DATA - NOT PRODUCTION");

  await prisma.industry.upsert({
    where: { id: ids.industry },
    update: { name: "Building Management" },
    create: { id: ids.industry, code: "BUILDING_MANAGEMENT", name: "Building Management" }
  });

  await prisma.organization.upsert({
    where: { id: ids.organization },
    update: { name: "PMC Demo" },
    create: { id: ids.organization, code: "PMC_DEMO", name: "PMC Demo", industryId: ids.industry }
  });

  await prisma.workspace.upsert({
    where: { id: ids.workspace },
    update: { name: "PMC Org Demo" },
    create: { id: ids.workspace, code: "PMC_ORG_DEMO", name: "PMC Org Demo", organizationId: ids.organization }
  });

  for (const project of [
    { id: ids.emeraldProject, code: "EMERALD_PRECINCT_DEMO", name: "Emerald Precinct Demo" },
    { id: ids.secondProject, code: "SECOND_PROJECT_DEMO", name: "Second Project Demo" }
  ]) {
    await prisma.project.upsert({
      where: { id: project.id },
      update: { name: project.name },
      create: { ...project, workspaceId: ids.workspace }
    });
  }

  for (const product of [
    { id: ids.products.OIS, code: "OIS", name: "OIS" },
    { id: ids.products.PITS, code: "PITS", name: "PITS" },
    { id: ids.products.CS_AGENT, code: "CS_AGENT", name: "csAgent" },
    { id: ids.products.KEIHB, code: "KEIHB", name: "KEIHB" },
    { id: ids.products.ICR, code: "ICR", name: "ICR" }
  ] as const) {
    await prisma.productDefinition.upsert({
      where: { id: product.id },
      update: { name: product.name },
      create: product
    });
  }

  for (const realm of [
    { id: "realm_ois_org_user", code: "OIS_ORGANIZATION_USER", name: "OIS Organization User" },
    { id: "realm_pits_project_user", code: "PITS_PROJECT_USER", name: "PITS Project User" },
    { id: "realm_csagent_resident", code: "CSAGENT_RESIDENT", name: "csAgent Resident" },
    { id: "realm_external_partner", code: "EXTERNAL_PARTNER", name: "External Partner" },
    { id: "realm_system_service", code: "SYSTEM_SERVICE", name: "System Service" }
  ] as const) {
    await prisma.identityRealm.upsert({
      where: { id: realm.id },
      update: { name: realm.name },
      create: realm
    });
  }

  for (const user of users) {
    await prisma.userAccount.upsert({
      where: { id: user.id },
      update: { displayName: user.displayName, realmCode: user.realmCode },
      create: {
        id: user.id,
        email: user.email,
        displayName: user.displayName,
        realmCode: user.realmCode
      }
    });

    await prisma.workspaceMembership.upsert({
      where: {
        workspaceId_userId_roleCode: {
          workspaceId: ids.workspace,
          userId: user.id,
          roleCode: user.roleCode
        }
      },
      update: { lifecycle: "ACTIVE" },
      create: {
        id: `membership_${user.roleCode.toLowerCase()}`,
        organizationId: ids.organization,
        workspaceId: ids.workspace,
        userId: user.id,
        roleCode: user.roleCode
      }
    });
  }

  for (const role of roles) {
    await prisma.roleDefinition.upsert({
      where: { id: role.id },
      update: { name: role.name, lifecycle: "ACTIVE" },
      create: { ...role, organizationId: ids.organization }
    });
  }

  for (const permission of permissions) {
    await prisma.permissionDefinition.upsert({
      where: { id: permission.id },
      update: { name: permission.name, lifecycle: "ACTIVE" },
      create: { ...permission, layerCode: "L0_OPERATIONAL_DATA" }
    });
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
    await prisma.rolePermission.upsert({
      where: { roleId_permissionId: { roleId, permissionId } },
      update: { lifecycle: "ACTIVE" },
      create: {
        id: `rp_${roleId}_${permissionId}`,
        roleId,
        permissionId
      }
    });
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
    await prisma.moduleDefinition.upsert({
      where: { id: module.id },
      update: { lifecycle: "ACTIVE" },
      create: module
    });
  }

  for (const installation of [
    { id: ids.installations.emeraldPits, projectId: ids.emeraldProject },
    { id: ids.installations.secondPits, projectId: ids.secondProject }
  ]) {
    await prisma.productInstallation.upsert({
      where: { id: installation.id },
      update: { lifecycle: "ACTIVE", configuration: { demoOnly: true } },
      create: {
        id: installation.id,
        productCode: "PITS",
        productId: ids.products.PITS,
        organizationId: ids.organization,
        workspaceId: ids.workspace,
        projectId: installation.projectId,
        configuration: { demoOnly: true, label: "DEMO DATA - NOT PRODUCTION" }
      }
    });

    await prisma.productCapabilityGrant.upsert({
      where: {
        productInstallationId_capabilityCode: {
          productInstallationId: installation.id,
          capabilityCode: "pits:runtime:access"
        }
      },
      update: { enabled: true, lifecycle: "ACTIVE" },
      create: {
        id: `grant_${installation.id}_pits_runtime_access`,
        productInstallationId: installation.id,
        capabilityCode: "pits:runtime:access",
        enabled: true
      }
    });
  }

  const configValue = { source: "bootstrap-stage-a", demoOnly: true };
  await prisma.effectiveConfigurationSnapshot.upsert({
    where: { id: "config_stage_a_demo_notice_v1" },
    update: { value: configValue, valueHash: hashJson(configValue), isCurrent: true },
    create: {
      id: "config_stage_a_demo_notice_v1",
      key: "demo.notice",
      value: configValue,
      valueHash: hashJson(configValue),
      scope: "WORKSPACE",
      organizationId: ids.organization,
      workspaceId: ids.workspace
    }
  });

  await prisma.featureFlag.upsert({
    where: { id: "flag_stage_a_kernel_only" },
    update: { enabled: true },
    create: {
      id: "flag_stage_a_kernel_only",
      code: "stage_a.kernel_only",
      enabled: true,
      scope: "WORKSPACE",
      organizationId: ids.organization,
      workspaceId: ids.workspace
    }
  });

  await prisma.auditRecord.upsert({
    where: { id: "audit_stage_a_seed" },
    update: { metadata: { idempotent: true, demoOnly: true } },
    create: {
      id: "audit_stage_a_seed",
      organizationId: ids.organization,
      workspaceId: ids.workspace,
      actorId: "user_super_admin_demo",
      action: "BOOTSTRAP_STAGE_A_SEED",
      targetType: "Workspace",
      targetId: ids.workspace,
      sensitive: true,
      metadata: { idempotent: true, demoOnly: true }
    }
  });

  await prisma.legacyIdentityMap.upsert({
    where: {
      legacySystem_legacyEntityType_legacyEntityId: {
        legacySystem: "OIS_LEGACY_REFERENCE",
        legacyEntityType: "Workspace",
        legacyEntityId: "PMC_DEMO_PLACEHOLDER"
      }
    },
    update: { nextgenEntityId: ids.workspace },
    create: {
      id: "legacy_map_workspace_demo_placeholder",
      legacySystem: "OIS_LEGACY_REFERENCE",
      legacyEntityType: "Workspace",
      legacyEntityId: "PMC_DEMO_PLACEHOLDER",
      nextgenEntityType: "Workspace",
      nextgenEntityId: ids.workspace,
      organizationId: ids.organization,
      workspaceId: ids.workspace
    }
  });
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
