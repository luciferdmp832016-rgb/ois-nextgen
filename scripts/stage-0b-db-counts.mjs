import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const models = {
  industries: "industry",
  organizations: "organization",
  workspaces: "workspace",
  projects: "project",
  userAccounts: "userAccount",
  workspaceMemberships: "workspaceMembership",
  productDefinitions: "productDefinition",
  productInstallations: "productInstallation",
  productCapabilityGrants: "productCapabilityGrant",
  moduleDefinitions: "moduleDefinition",
  identityRealms: "identityRealm",
  roleDefinitions: "roleDefinition",
  permissionDefinitions: "permissionDefinition",
  rolePermissions: "rolePermission",
  effectiveConfigurationSnapshots: "effectiveConfigurationSnapshot",
  featureFlags: "featureFlag",
  auditRecords: "auditRecord",
  legacyIdentityMaps: "legacyIdentityMap"
};

async function countModel(clientName) {
  return prisma[clientName].count();
}

async function intQuery(sql) {
  const rows = await prisma.$queryRawUnsafe(sql);
  const value = rows[0]?.count ?? 0;
  return Number(value);
}

async function main() {
  const counts = {};
  for (const [label, clientName] of Object.entries(models)) {
    counts[label] = await countModel(clientName);
  }

  const migrations = await prisma.$queryRaw`
    SELECT migration_name, finished_at IS NOT NULL AS finished
    FROM "_prisma_migrations"
    ORDER BY started_at ASC
  `;

  const logicalDuplicates = {
    workspacesByOrganizationCode: await intQuery(`
      SELECT COALESCE(SUM(extra), 0)::int AS count
      FROM (
        SELECT COUNT(*) - 1 AS extra
        FROM "Workspace"
        GROUP BY "organizationId", "code"
        HAVING COUNT(*) > 1
      ) duplicates
    `),
    projectsByWorkspaceCode: await intQuery(`
      SELECT COALESCE(SUM(extra), 0)::int AS count
      FROM (
        SELECT COUNT(*) - 1 AS extra
        FROM "Project"
        GROUP BY "workspaceId", "code"
        HAVING COUNT(*) > 1
      ) duplicates
    `),
    productInstallationsByProjectProduct: await intQuery(`
      SELECT COALESCE(SUM(extra), 0)::int AS count
      FROM (
        SELECT COUNT(*) - 1 AS extra
        FROM "ProductInstallation"
        GROUP BY "projectId", "productCode"
        HAVING COUNT(*) > 1
      ) duplicates
    `),
    productCapabilityGrantsByInstallationCapability: await intQuery(`
      SELECT COALESCE(SUM(extra), 0)::int AS count
      FROM (
        SELECT COUNT(*) - 1 AS extra
        FROM "ProductCapabilityGrant"
        GROUP BY "productInstallationId", "capabilityCode"
        HAVING COUNT(*) > 1
      ) duplicates
    `),
    roleDefinitionsByOrganizationRealmCode: await intQuery(`
      SELECT COALESCE(SUM(extra), 0)::int AS count
      FROM (
        SELECT COUNT(*) - 1 AS extra
        FROM "RoleDefinition"
        GROUP BY "organizationId", "realmCode", "code"
        HAVING COUNT(*) > 1
      ) duplicates
    `),
    rolePermissionsByRolePermission: await intQuery(`
      SELECT COALESCE(SUM(extra), 0)::int AS count
      FROM (
        SELECT COUNT(*) - 1 AS extra
        FROM "RolePermission"
        GROUP BY "roleId", "permissionId"
        HAVING COUNT(*) > 1
      ) duplicates
    `),
    effectiveConfigurationSnapshotsByNaturalVersion: await intQuery(`
      SELECT COALESCE(SUM(extra), 0)::int AS count
      FROM (
        SELECT COUNT(*) - 1 AS extra
        FROM "EffectiveConfigurationSnapshot"
        GROUP BY "key", "organizationId", "workspaceId", "projectId", "productInstallationId", "version"
        HAVING COUNT(*) > 1
      ) duplicates
    `)
  };

  const negativeFixtureRuntimeRows = await intQuery(`
    SELECT COUNT(*)::int AS count
    FROM (
      SELECT id FROM "Industry" WHERE id ILIKE '%negative%' OR code ILIKE '%negative%' OR code ILIKE '%invalid%'
      UNION ALL
      SELECT id FROM "Organization" WHERE id ILIKE '%negative%' OR code ILIKE '%negative%' OR code ILIKE '%invalid%'
      UNION ALL
      SELECT id FROM "Workspace" WHERE id ILIKE '%negative%' OR code ILIKE '%negative%' OR code ILIKE '%invalid%'
      UNION ALL
      SELECT id FROM "Project" WHERE id ILIKE '%negative%' OR code ILIKE '%negative%' OR code ILIKE '%invalid%'
      UNION ALL
      SELECT id FROM "ProductInstallation" WHERE id ILIKE '%negative%' OR id ILIKE '%invalid%'
      UNION ALL
      SELECT id FROM "UserAccount" WHERE id ILIKE '%negative%' OR email ILIKE '%negative%' OR email ILIKE '%invalid%'
    ) marker_scan
  `);

  console.log(
    JSON.stringify(
      {
        capturedAt: new Date().toISOString(),
        counts,
        migrations: {
          count: migrations.length,
          allFinished: migrations.every((migration) => migration.finished),
          names: migrations.map((migration) => migration.migration_name)
        },
        logicalDuplicates,
        duplicateProductInstallations: logicalDuplicates.productInstallationsByProjectProduct,
        negativeFixtureRuntimeRows
      },
      null,
      2
    )
  );
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    process.exit(1);
  });
