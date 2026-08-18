// ─── Environment switcher ─────────────────────────────────────────────────────
// Change NUXT_CI_ENV in .env to switch ALL urls at once: "dev" | "prod"
const ENV_CONFIG = {
  dev: {
    apiBase: "http://localhost:9100",
  },
  prod: {
    apiBase: "https://sbacbackend.autofybusiness.com",
  },
} as const;

type CIEnv = keyof typeof ENV_CONFIG;
const ciEnv = (process.env.NUXT_CI_ENV ?? "prod") as CIEnv;
const env = ENV_CONFIG[ciEnv] ?? ENV_CONFIG.prod;

export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
  css: ["~~/layers/base/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiAccessKey: process.env.NUXT_PUBLIC_API_ACCESS_KEY,
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? env.apiBase,
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Autofy-Frontend",
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID,
    },
  },
  dir: {
    public: "../../public",
  },
  srcDir: ".",
  routeRules: {
    "/**": {
      headers: {
        "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      },
    },
  },
  compatibilityDate: "2026-08-08",
  pinia: {
    storesDirs: ["./stores/**"],
  },

});
