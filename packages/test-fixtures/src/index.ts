import type { CapabilityGrant, PermissionBinding } from "@ois/identity-access";
import type { TenantContext } from "@ois/tenant-context";

export const demoIds = {
  industry: "ind_building_management",
  organization: "org_pmc_demo",
  workspace: "ws_pmc_org_demo",
  otherWorkspace: "ws_other_demo",
  emeraldProject: "prj_emerald_precinct_demo",
  secondProject: "prj_second_project_demo",
  oisProduct: "prod_ois",
  pitsProduct: "prod_pits",
  emeraldPitsInstallation: "inst_pits_emerald",
  secondPitsInstallation: "inst_pits_second",
  actorSuperAdmin: "user_super_admin_demo",
  actorStaff: "user_staff_demo"
} as const;

export const demoKernelData = {
  industries: [
    { id: demoIds.industry, code: "BUILDING_MANAGEMENT", name: "Building Management" }
  ],
  organizations: [
    { id: demoIds.organization, code: "PMC_DEMO", name: "PMC Demo", industryId: demoIds.industry }
  ],
  workspaces: [
    { id: demoIds.workspace, code: "PMC_ORG_DEMO", name: "PMC Org Demo", organizationId: demoIds.organization },
    { id: demoIds.otherWorkspace, code: "OTHER_DEMO", name: "Other Demo", organizationId: demoIds.organization }
  ],
  projects: [
    { id: demoIds.emeraldProject, code: "EMERALD_PRECINCT_DEMO", name: "Emerald Precinct Demo", workspaceId: demoIds.workspace },
    { id: demoIds.secondProject, code: "SECOND_PROJECT_DEMO", name: "Second Project Demo", workspaceId: demoIds.workspace }
  ],
  productDefinitions: [
    { id: demoIds.oisProduct, code: "OIS", name: "OIS" },
    { id: demoIds.pitsProduct, code: "PITS", name: "PITS" },
    { id: "prod_cs_agent", code: "CS_AGENT", name: "csAgent" },
    { id: "prod_keihb", code: "KEIHB", name: "KEIHB" },
    { id: "prod_icr", code: "ICR", name: "ICR" }
  ],
  productInstallations: [
    {
      id: demoIds.emeraldPitsInstallation,
      productCode: "PITS",
      projectId: demoIds.emeraldProject,
      workspaceId: demoIds.workspace,
      lifecycle: "ACTIVE"
    },
    {
      id: demoIds.secondPitsInstallation,
      productCode: "PITS",
      projectId: demoIds.secondProject,
      workspaceId: demoIds.workspace,
      lifecycle: "ACTIVE"
    }
  ],
  permissionBindings: [
    { roleCode: "SUPER_ADMIN", permissionCode: "platform:overview:read" },
    { roleCode: "SUPER_ADMIN", permissionCode: "product:installation:manage" },
    { roleCode: "WORKSPACE_ADMIN", permissionCode: "workspace:read" },
    { roleCode: "STAFF", permissionCode: "project:read" },
    { roleCode: "STAFF", permissionCode: "pits:runtime:access" }
  ] satisfies PermissionBinding[],
  capabilityGrants: [
    {
      productInstallationId: demoIds.emeraldPitsInstallation,
      capabilityCode: "pits:runtime:access",
      enabled: true
    },
    {
      productInstallationId: demoIds.secondPitsInstallation,
      capabilityCode: "pits:runtime:access",
      enabled: true
    }
  ] satisfies CapabilityGrant[]
};

export const demoTenantContexts = {
  superAdmin: {
    actorId: demoIds.actorSuperAdmin,
    realm: "OIS_ORGANIZATION_USER",
    organizationId: demoIds.organization,
    workspaceId: demoIds.workspace,
    roleCodes: ["SUPER_ADMIN"]
  },
  emeraldStaff: {
    actorId: demoIds.actorStaff,
    realm: "PITS_PROJECT_USER",
    organizationId: demoIds.organization,
    workspaceId: demoIds.workspace,
    projectId: demoIds.emeraldProject,
    productInstallationId: demoIds.emeraldPitsInstallation,
    roleCodes: ["STAFF"]
  }
} satisfies Record<string, TenantContext>;
