DO $$ BEGIN
  CREATE TYPE "LifecycleStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUSPENDED', 'DEPRECATED', 'ARCHIVED', 'PLANNED', 'BLOCKED_BY_PHASE2', 'BLOCKED_BY_PHASE3');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ScopeKind" AS ENUM ('PLATFORM', 'INDUSTRY', 'ORGANIZATION', 'WORKSPACE', 'PROJECT', 'PRODUCT_INSTALLATION');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ProductCode" AS ENUM ('OIS', 'PITS', 'CS_AGENT', 'KEIHB', 'ICR');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "IdentityRealmCode" AS ENUM ('OIS_ORGANIZATION_USER', 'PITS_PROJECT_USER', 'CSAGENT_RESIDENT', 'EXTERNAL_PARTNER', 'SYSTEM_SERVICE');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ModuleType" AS ENUM ('PLATFORM_KERNEL', 'CONTROL_PLANE_VIEW', 'PRODUCT_RUNTIME_VIEW', 'DOMAIN_SERVICE', 'REPOSITORY', 'WORKER');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "Industry" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Industry_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "Organization" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "industryId" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Organization_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Organization_industryId_fkey" FOREIGN KEY ("industryId") REFERENCES "Industry"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Workspace" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Workspace_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Workspace_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "Project" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "Project_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Project_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "UserAccount" (
  "id" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "displayName" TEXT NOT NULL,
  "realmCode" "IdentityRealmCode" NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "demoOnly" BOOLEAN NOT NULL DEFAULT true,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "UserAccount_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "WorkspaceMembership" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "roleCode" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "WorkspaceMembership_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "WorkspaceMembership_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "WorkspaceMembership_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "WorkspaceMembership_userId_fkey" FOREIGN KEY ("userId") REFERENCES "UserAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ProductDefinition" (
  "id" TEXT NOT NULL,
  "code" "ProductCode" NOT NULL,
  "name" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductDefinition_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "ProductInstallation" (
  "id" TEXT NOT NULL,
  "productCode" "ProductCode" NOT NULL,
  "productId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT NOT NULL,
  "projectId" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "configuration" JSONB NOT NULL DEFAULT '{}',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductInstallation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProductInstallation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ProductInstallation_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ProductInstallation_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "ProductInstallation_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ProductCapabilityGrant" (
  "id" TEXT NOT NULL,
  "productInstallationId" TEXT NOT NULL,
  "capabilityCode" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT true,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ProductCapabilityGrant_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ProductCapabilityGrant_productInstallationId_fkey" FOREIGN KEY ("productInstallationId") REFERENCES "ProductInstallation"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "ModuleDefinition" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "productId" TEXT NOT NULL,
  "productCode" "ProductCode" NOT NULL,
  "layerCode" TEXT NOT NULL,
  "scope" "ScopeKind" NOT NULL,
  "realmCode" "IdentityRealmCode" NOT NULL,
  "moduleType" "ModuleType" NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ModuleDefinition_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ModuleDefinition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "IdentityRealm" (
  "id" TEXT NOT NULL,
  "code" "IdentityRealmCode" NOT NULL,
  "name" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "IdentityRealm_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS "RoleDefinition" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "realmCode" "IdentityRealmCode" NOT NULL,
  "scope" "ScopeKind" NOT NULL,
  "productId" TEXT,
  "organizationId" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RoleDefinition_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RoleDefinition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "RoleDefinition_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "PermissionDefinition" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "productId" TEXT,
  "layerCode" TEXT NOT NULL,
  "scope" "ScopeKind" NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "PermissionDefinition_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "PermissionDefinition_productId_fkey" FOREIGN KEY ("productId") REFERENCES "ProductDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "RolePermission" (
  "id" TEXT NOT NULL,
  "roleId" TEXT NOT NULL,
  "permissionId" TEXT NOT NULL,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "RoleDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "PermissionDefinition"("id") ON DELETE CASCADE ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "EffectiveConfigurationSnapshot" (
  "id" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "value" JSONB NOT NULL,
  "valueHash" TEXT NOT NULL,
  "scope" "ScopeKind" NOT NULL,
  "isCurrent" BOOLEAN NOT NULL DEFAULT true,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "productInstallationId" TEXT,
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EffectiveConfigurationSnapshot_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "EffectiveConfigurationSnapshot_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "EffectiveConfigurationSnapshot_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "EffectiveConfigurationSnapshot_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "EffectiveConfigurationSnapshot_productInstallationId_fkey" FOREIGN KEY ("productInstallationId") REFERENCES "ProductInstallation"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "FeatureFlag" (
  "id" TEXT NOT NULL,
  "code" TEXT NOT NULL,
  "enabled" BOOLEAN NOT NULL DEFAULT false,
  "scope" "ScopeKind" NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "productInstallationId" TEXT,
  "lifecycle" "LifecycleStatus" NOT NULL DEFAULT 'ACTIVE',
  "version" INTEGER NOT NULL DEFAULT 1,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FeatureFlag_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "FeatureFlag_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "FeatureFlag_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "FeatureFlag_productInstallationId_fkey" FOREIGN KEY ("productInstallationId") REFERENCES "ProductInstallation"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "AuditRecord" (
  "id" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "productInstallationId" TEXT,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "targetType" TEXT NOT NULL,
  "targetId" TEXT NOT NULL,
  "sensitive" BOOLEAN NOT NULL DEFAULT false,
  "metadata" JSONB NOT NULL DEFAULT '{}',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "AuditRecord_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "AuditRecord_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AuditRecord_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AuditRecord_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AuditRecord_productInstallationId_fkey" FOREIGN KEY ("productInstallationId") REFERENCES "ProductInstallation"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "AuditRecord_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "UserAccount"("id") ON DELETE SET NULL ON UPDATE CASCADE
);

CREATE TABLE IF NOT EXISTS "LegacyIdentityMap" (
  "id" TEXT NOT NULL,
  "legacySystem" TEXT NOT NULL,
  "legacyEntityType" TEXT NOT NULL,
  "legacyEntityId" TEXT NOT NULL,
  "nextgenEntityType" TEXT NOT NULL,
  "nextgenEntityId" TEXT NOT NULL,
  "organizationId" TEXT NOT NULL,
  "workspaceId" TEXT,
  "projectId" TEXT,
  "mappedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "LegacyIdentityMap_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "LegacyIdentityMap_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LegacyIdentityMap_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "Workspace"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT "LegacyIdentityMap_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

CREATE UNIQUE INDEX IF NOT EXISTS "Industry_code_key" ON "Industry"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "Organization_code_key" ON "Organization"("code");
CREATE INDEX IF NOT EXISTS "Organization_industryId_idx" ON "Organization"("industryId");
CREATE UNIQUE INDEX IF NOT EXISTS "Workspace_organizationId_code_key" ON "Workspace"("organizationId", "code");
CREATE INDEX IF NOT EXISTS "Workspace_organizationId_idx" ON "Workspace"("organizationId");
CREATE UNIQUE INDEX IF NOT EXISTS "Project_workspaceId_code_key" ON "Project"("workspaceId", "code");
CREATE INDEX IF NOT EXISTS "Project_workspaceId_idx" ON "Project"("workspaceId");
CREATE UNIQUE INDEX IF NOT EXISTS "UserAccount_email_key" ON "UserAccount"("email");
CREATE UNIQUE INDEX IF NOT EXISTS "WorkspaceMembership_workspaceId_userId_roleCode_key" ON "WorkspaceMembership"("workspaceId", "userId", "roleCode");
CREATE INDEX IF NOT EXISTS "WorkspaceMembership_organizationId_workspaceId_idx" ON "WorkspaceMembership"("organizationId", "workspaceId");
CREATE INDEX IF NOT EXISTS "WorkspaceMembership_userId_idx" ON "WorkspaceMembership"("userId");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductDefinition_code_key" ON "ProductDefinition"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductInstallation_projectId_productCode_key" ON "ProductInstallation"("projectId", "productCode");
CREATE INDEX IF NOT EXISTS "ProductInstallation_organizationId_workspaceId_projectId_idx" ON "ProductInstallation"("organizationId", "workspaceId", "projectId");
CREATE INDEX IF NOT EXISTS "ProductInstallation_productId_idx" ON "ProductInstallation"("productId");
CREATE UNIQUE INDEX IF NOT EXISTS "ProductCapabilityGrant_productInstallationId_capabilityCode_key" ON "ProductCapabilityGrant"("productInstallationId", "capabilityCode");
CREATE INDEX IF NOT EXISTS "ProductCapabilityGrant_capabilityCode_idx" ON "ProductCapabilityGrant"("capabilityCode");
CREATE UNIQUE INDEX IF NOT EXISTS "ModuleDefinition_code_key" ON "ModuleDefinition"("code");
CREATE INDEX IF NOT EXISTS "ModuleDefinition_productCode_layerCode_scope_idx" ON "ModuleDefinition"("productCode", "layerCode", "scope");
CREATE UNIQUE INDEX IF NOT EXISTS "IdentityRealm_code_key" ON "IdentityRealm"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "RoleDefinition_organizationId_realmCode_code_key" ON "RoleDefinition"("organizationId", "realmCode", "code");
CREATE INDEX IF NOT EXISTS "RoleDefinition_productId_idx" ON "RoleDefinition"("productId");
CREATE UNIQUE INDEX IF NOT EXISTS "PermissionDefinition_code_key" ON "PermissionDefinition"("code");
CREATE INDEX IF NOT EXISTS "PermissionDefinition_productId_scope_idx" ON "PermissionDefinition"("productId", "scope");
CREATE UNIQUE INDEX IF NOT EXISTS "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");
CREATE INDEX IF NOT EXISTS "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");
CREATE UNIQUE INDEX IF NOT EXISTS "EffectiveConfigurationSnapshot_key_scope_version_key" ON "EffectiveConfigurationSnapshot"("key", "organizationId", "workspaceId", "projectId", "productInstallationId", "version");
CREATE INDEX IF NOT EXISTS "EffectiveConfigurationSnapshot_scope_current_idx" ON "EffectiveConfigurationSnapshot"("organizationId", "workspaceId", "projectId", "productInstallationId", "isCurrent");
CREATE UNIQUE INDEX IF NOT EXISTS "FeatureFlag_code_scope_key" ON "FeatureFlag"("code", "organizationId", "workspaceId", "projectId", "productInstallationId");
CREATE INDEX IF NOT EXISTS "FeatureFlag_scope_idx" ON "FeatureFlag"("organizationId", "workspaceId", "projectId");
CREATE INDEX IF NOT EXISTS "AuditRecord_organizationId_createdAt_idx" ON "AuditRecord"("organizationId", "createdAt");
CREATE INDEX IF NOT EXISTS "AuditRecord_workspaceId_projectId_idx" ON "AuditRecord"("workspaceId", "projectId");
CREATE INDEX IF NOT EXISTS "AuditRecord_action_targetType_idx" ON "AuditRecord"("action", "targetType");
CREATE UNIQUE INDEX IF NOT EXISTS "LegacyIdentityMap_legacy_key" ON "LegacyIdentityMap"("legacySystem", "legacyEntityType", "legacyEntityId");
CREATE INDEX IF NOT EXISTS "LegacyIdentityMap_nextgen_idx" ON "LegacyIdentityMap"("nextgenEntityType", "nextgenEntityId");
CREATE INDEX IF NOT EXISTS "LegacyIdentityMap_scope_idx" ON "LegacyIdentityMap"("organizationId", "workspaceId", "projectId");
