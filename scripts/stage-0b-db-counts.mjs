import { PrismaClient } from "@prisma/client";
import { createHash } from "node:crypto";

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

const publicTables = {
  industries: "Industry",
  organizations: "Organization",
  workspaces: "Workspace",
  projects: "Project",
  userAccounts: "UserAccount",
  workspaceMemberships: "WorkspaceMembership",
  productDefinitions: "ProductDefinition",
  productInstallations: "ProductInstallation",
  productCapabilityGrants: "ProductCapabilityGrant",
  moduleDefinitions: "ModuleDefinition",
  identityRealms: "IdentityRealm",
  roleDefinitions: "RoleDefinition",
  permissionDefinitions: "PermissionDefinition",
  rolePermissions: "RolePermission",
  effectiveConfigurationSnapshots: "EffectiveConfigurationSnapshot",
  featureFlags: "FeatureFlag",
  auditRecords: "AuditRecord",
  legacyIdentityMaps: "LegacyIdentityMap"
};

async function countModel(clientName) {
  return prisma[clientName].count();
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map((entry) => stableStringify(entry)).join(",")}]`;

  return `{${Object.keys(value)
    .sort()
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`;
}

function sha256(value) {
  return createHash("sha256").update(value).digest("hex");
}

async function tableFingerprint(tableName) {
  const rows = await prisma.$queryRawUnsafe(`SELECT to_jsonb(t) AS row FROM "${tableName}" t ORDER BY "id" ASC`);
  return sha256(stableStringify(rows.map((entry) => entry.row)));
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

  const tableFingerprints = {};
  for (const [label, tableName] of Object.entries(publicTables)) {
    tableFingerprints[label] = await tableFingerprint(tableName);
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
        tableFingerprints,
        overallTableFingerprint: sha256(stableStringify(tableFingerprints)),
        migrations: {
          count: migrations.length,
          allFinished: migrations.every((migration) => migration.finished),
          names: migrations.map((migration) => migration.migration_name)
        },
        logicalDuplicates,
        duplicateProductInstallations: logicalDuplicates.productInstallationsByProjectProduct,
        negativeFixtureRuntimeRows,
        seedSpecific: {
          productInstallationCount: counts.productInstallations,
          duplicateProductInstallationCount: logicalDuplicates.productInstallationsByProjectProduct,
          negativeFixtureMarkerCount: negativeFixtureRuntimeRows
        }
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
