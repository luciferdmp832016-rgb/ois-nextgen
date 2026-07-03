import type { CapabilityCode } from "@ois/architecture-contracts";

export interface PermissionBinding {
  roleCode: string;
  permissionCode: string;
}

export interface CapabilityGrant {
  productInstallationId: string;
  capabilityCode: CapabilityCode | string;
  enabled: boolean;
}

export function hasPermission(input: {
  roleCodes: string[];
  permissionCode: string;
  bindings: PermissionBinding[];
}): boolean {
  return input.bindings.some(
    (binding) => input.roleCodes.includes(binding.roleCode) && binding.permissionCode === input.permissionCode
  );
}

export function hasCapability(input: {
  productInstallationId: string;
  capabilityCode: CapabilityCode | string;
  grants: CapabilityGrant[];
}): boolean {
  return input.grants.some(
    (grant) =>
      grant.productInstallationId === input.productInstallationId &&
      grant.capabilityCode === input.capabilityCode &&
      grant.enabled
  );
}
