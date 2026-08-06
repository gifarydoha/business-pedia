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
