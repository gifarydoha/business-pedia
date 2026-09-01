// Resolves the correct dashboard layout for auth-guarded pages
// (change-password, set-password) based on which module this build belongs to.
// Conference uses its dedicated conference-dashboard layout;
// other layers fall back to their own module layout.
export const useModuleDashboardLayout = (): any => {
  const config = useRuntimeConfig();
  const moduleName = config.public.moduleName || "default";

  const dashboardLayoutMap: Record<string, string> = {
    "conference": "conference-dashboard",
    "lms": "lms",
    "chief-adviser-gob": "chief-adviser-gob",
  };

  return dashboardLayoutMap[moduleName] ?? "default";
};
