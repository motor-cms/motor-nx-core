import { Role } from "./role";
import { ComputedRef } from "vue";

export interface Permission {
  id: number;
  name: string;
  permission_group_id: string;
  translated_name: string;
}

export default function usePermission(
  userPermissions: ComputedRef<Permission[]>,
  userRoles: ComputedRef<Role[]>,
) {
  const isAdmin = () =>
    userRoles.value.map((role) => role.name).includes("SuperAdmin");
  // Permissions
  const hasPermissionTo = (permission: string) => {
    return (
      userPermissions.value.map((p) => p.name).includes(permission) || isAdmin()
    );
  };

  const can = (permission: string) => {
    return hasPermissionTo(permission);
  };

  const hasAnyPermission = (permissions: string[]) => {
    if (permissions.length === 0) {
      return true;
    }

    return (
      permissions.some((permissionName) =>
        userPermissions.value.map((p) => p.name).includes(permissionName),
      ) || isAdmin()
    );
  };

  const hasAllPermissions = (permissions: string[]) => {
    return (
      permissions.every((permissionName) =>
        userPermissions.value.map((p) => p.name).includes(permissionName),
      ) || isAdmin()
    );
  };

  // Aktuell noch irrelevant, da permissions aus backend = permissions der rollen sind
  // const getDirectPermissions = () => {
  //     return userPermissions.value;
  // };
  //
  // const getPermissionsViaRoles = () => {
  //     return userRoles.value.map(role => role.permissions).flat();
  // };
  //
  // const getAllPermissions = () => {
  //     return getDirectPermissions().concat(getPermissionsViaRoles());
  // };

  return {
    hasPermissionTo,
    can,
    hasAnyPermission,
    hasAllPermissions,
    // getDirectPermissions,
    // getPermissionsViaRoles,
    // getAllPermissions
  };
}
