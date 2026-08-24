// app/middleware/role.ts
import type { UserRole } from "~~/layers/base/types/user";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const requiredRole = to.meta.requiredRole as UserRole | undefined;

  if (!requiredRole) return;

  if (!authStore.isAuthenticated) {
    return navigateTo("/login");
  }

  const roleHierarchy: Record<UserRole, number> = {
    admin: 4,
    editor: 3,
    reviewer: 2,
    author: 0,
    reader: 0,
    client: 0,
  };

  const userLevel = roleHierarchy[authStore.userRole ?? "reader"];
  const requiredLevel = roleHierarchy[requiredRole];

  if (userLevel < requiredLevel) {
    throw createError({ status: 403, message: "Forbidden: insufficient permissions" });
  }
});
