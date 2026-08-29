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
    "~~/layers/chief-adviser-gob/assets/css/tokens.css",
    "~~/layers/chief-adviser-gob/assets/css/theme.css",
  ],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Chief Adviser of GOB",
      apiAccessKey: process.env.NUXT_PUBLIC_API_ACCESS_KEY,
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
  nitro: {
    prerender: {
      failOnError: false,
    },
  },
});
