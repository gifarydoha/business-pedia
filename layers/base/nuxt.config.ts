export default defineNuxtConfig({
  modules: ["@pinia/nuxt"],
  css: ["~~/layers/base/assets/css/main.css"],
  pinia: {
    storesDirs: ["./stores/**"],
  },
});
