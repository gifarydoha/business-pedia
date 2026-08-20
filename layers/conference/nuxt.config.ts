import { fileURLToPath } from "url";
import { dirname, join } from "path";

const currentDir = dirname(fileURLToPath(import.meta.url));
const rootDir = join(currentDir, "../..");

export default defineNuxtConfig({
  extends: ["../base"],
  modules: [
    "@nuxt/image",
    "@pinia/nuxt",
    "@nuxt/icon",
    "@nuxt/ui",
    "@vee-validate/nuxt",
  ],
  css: [
    "~~/layers/conference/assets/css/tokens.css",
    "~~/layers/conference/assets/css/theme.css",
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "https://sbacbackend.autofybusiness.com",
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "SBAC Conference",
    },
  },
  srcDir: ".",
  alias: {
    "~~": rootDir,
    "@@": rootDir,
    "~": rootDir,
    "@": rootDir,
    "#layers": join(rootDir, "layers"),
  },
  routeRules: {
    "/submit-paper": { redirect: "/submit-paper/draft" },
  },
  nitro: {
    prerender: {
      failOnError: false,
    },
  },
});
