// export default defineNuxtRouteMiddleware((to) => {
// })
// Create Middleware for roles and permissions
import useRolesAndPermissions from "@zrm/motor-nx-core/composables/auth/rolesAndPermissions";
import { ROLES } from "@zrm/motor-nx-core/types/roles_and_permissions";

export default defineNuxtRouteMiddleware((to) => {
  // skip middleware on server
  const rolesAndPermissions = useRolesAndPermissions();
  const navigationStore = useNavigationStore();
  const navigationItems = navigationStore.navigationItems;
  const { user } = storeToRefs(useUserStore());

  // Guard statement to check if user is logged in and has super admin role
  if (user.value && rolesAndPermissions.hasRole(ROLES.SUPER_ADMIN)) {
    return;
  }

  console.log("roles-and-permissions-middleware");

  const toPath = to.path.toLowerCase();
  // Exception for login page
  if (!user.value && toPath !== "/admin/login") {
    return navigateTo("/admin/login");
  } else if (!user.value && toPath === "/admin/login") {
    return;
  } else if (user.value && toPath === "/admin/login") {
    return navigateTo("/admin/dashboard");
  }

  // Guard statement to check if user is logged in and has permission to access the route
  if (
    user.value &&
    navigationItems &&
    Object.keys(navigationItems).length > 0
  ) {
    const navigationItemsObjectAsArray = Object.values(navigationItems);
    const data = JSON.parse(JSON.stringify(navigationItemsObjectAsArray));

    // Flatten the navigation items
    const flatArray = flattenItems(data);

    //replace all '/' with '.' and remove the first '.' , so we extract the permission name from the route
    const toRoute = toPath.replace(/\//g, ".").substring(1);

    if (checkEditOrCreatePermission(toRoute)) return;
    if (checkViewPermission(toRoute, flatArray)) return;
  }

  // If user does not have permission to access the route, return error
  const error = createError({
    statusCode: 403,
    message: "Keine Berechtigung diese Seite zu besuchen: " + to.path,
  });
  return abortNavigation(error);
});

const flattenItems = (data) => {
  const flatArray = [];

  const addItemsToFlatArray = (item, parent = null) => {
    if (item.items && Object.keys(item.items).length > 0) {
      Object.values(item.items).forEach((subItem) =>
        addItemsToFlatArray(subItem, subItem),
      );
    } else {
      flatArray.push(parent || item);
    }
  };

  data.forEach((item) => addItemsToFlatArray(item, item));

  return flatArray;
};

const checkEditOrCreatePermission = (toRoute: string) => {
  let canAccess = false;
  const rolesAndPermissions = useRolesAndPermissions();
  if (toRoute.includes(".edit") || toRoute.includes(".create")) {
    // remove everything after the first '.edit' or '.create' to get the permission name
    let editOrCreateRoute = toRoute.split(".edit")[0].split(".create")[0];
    // extract everything after the last '.' to get the permission name
    editOrCreateRoute = editOrCreateRoute.substring(
      editOrCreateRoute.lastIndexOf(".") + 1,
    );

    // add '.write' to the route to get the permission name
    editOrCreateRoute = editOrCreateRoute + ".write";

    // Replace '-' with '_' in the permission name to match the permission name in the backend
    editOrCreateRoute = editOrCreateRoute.replace(/-/g, "_");

    // check if user has permission to access the route
    if (rolesAndPermissions.hasPermissionTo(editOrCreateRoute)) {
      canAccess = true;
    }
  }
  return canAccess;
};

const checkViewPermission = (toRoute: string, flattenedNavigationItems: []) => {
  let canAccess = false;
  const rolesAndPermissions = useRolesAndPermissions();

  //Find navigation item which belongs to toRoute from flatArray
  const findItem = flattenedNavigationItems.find(
    (item) => item.route === toRoute,
  );

  if (findItem) {
    const itemPermissions = findItem.permissions;
    if (rolesAndPermissions.hasAnyPermission(itemPermissions)) {
      // If user has permission to access the route, return
      canAccess = true;
    }
  }
  return canAccess;
};
