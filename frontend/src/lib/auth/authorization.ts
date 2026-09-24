import { getPermissionsForRole } from './rolePermissions';
import type { Permission } from './permissions';
import type { AuthUser } from './authUser';

export function hasPermission(user: AuthUser | null, permission: Permission): boolean {
  if (!user) return false;
  return getPermissionsForRole(user.role).includes(permission);
}
