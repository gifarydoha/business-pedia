// Resolves the correct auth layout name at runtime based on which module
// this build belongs to. Each layer declares its identity via
// runtimeConfig.public.moduleName in its nuxt.config.ts.
// Falls back to 'auth' (base layouts/auth.vue) if moduleName is not set.
export const useModuleLayout = (): any => {
  const config = useRuntimeConfig();
  return config.public.moduleName || "auth";
};
