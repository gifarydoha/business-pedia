// app/middleware/role.ts
import type { UserRole } from "~/types/user";

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore();
  const requiredRole = to.meta.requiredRole as UserRole | undefined;

  if (!requiredRole) return;

  if (!authStore.isLoggedIn) {
    return navigateTo("/login");
  }

  const roleHierarchy: Record<UserRole, number> = {
    admin: 4,
    editor: 3,
    author: 2,
    reviewer: 1,
    reader: 0,
  };

  const userLevel = roleHierarchy[authStore.userRole ?? "reader"];
  const requiredLevel = roleHierarchy[requiredRole];

  if (userLevel < requiredLevel) {
    throw createError({ statusCode: 403, message: "Forbidden: insufficient permissions" });
  }
});
