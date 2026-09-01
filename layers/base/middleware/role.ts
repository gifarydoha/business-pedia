// app/middleware/role.ts
import type { RoleAlias } from "#layers/base/types/user";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const requiredRole = to.meta.requiredRole as RoleAlias | undefined;

  if (!requiredRole) return;

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }

  const roleHierarchy: Record<RoleAlias, number> = {
    "super-admin": 5,
    "admin": 4,
    "committee-member": 3,
    "reviewer": 2,
    "author": 0,
    "default-user": 0,
    "reader": 0,
  };

  const userRoles = authStore.userRoles.length > 0 ? authStore.userRoles : ["reader"];
  const userLevel = Math.max(...userRoles.map(r => roleHierarchy[r as RoleAlias] ?? 0));
  const requiredLevel = roleHierarchy[requiredRole] ?? 0;

  if (userLevel < requiredLevel) {
    throw createError({ status: 403, message: "Forbidden: insufficient permissions" });
  }
});
