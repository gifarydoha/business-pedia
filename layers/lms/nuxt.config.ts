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
  css: ["~~/layers/lms/assets/css/tokens.css"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE ?? "https://autofymind.com",
      appName: process.env.NUXT_PUBLIC_APP_NAME ?? "Autofy Mind",
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
});
