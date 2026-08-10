export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
  css: ["~~/layers/base/assets/css/main.css"],
  runtimeConfig: {
    public: {
      apiAccessKey: process.env.NUXT_PUBLIC_API_ACCESS_KEY ?? "",
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "http://localhost:9100",
      kbApiBase: process.env.NUXT_PUBLIC_KB_API_BASE ?? "https://autofymind.com/skb/kb_api",
      confApiBase: "http://localhost:9100",
      // confApiBase: process.env.NUXT_PUBLIC_CONF_API_BASE ?? "http://localhost:9100",
      imageBase: process.env.NUXT_PUBLIC_IMAGE_BASE ?? "https://autofymind.com",
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Autofy-Frontend",
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
    },
  },
  dir: {
    public: "../../public",
  },
  srcDir: ".",
  compatibilityDate: "2026-08-08",
  pinia: {
    storesDirs: ["./stores/**"],
  },
});
