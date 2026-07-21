import fs from "fs";
import path from "path";

const pluginPath = path.resolve(
  process.cwd(),
  "node_modules/nuxt/dist/pages/runtime/plugins/check-if-page-unused.js",
);

if (fs.existsSync(pluginPath)) {
  let content = fs.readFileSync(pluginPath, "utf8");

  // Fix the export statement so Nuxt's parser can properly detect the default export
  const badExport = "export { NESTED_PAGE_CONFIRMATION_DELAY, plugin as default, findUnrenderedNestedPage };";
  const goodExport = "export { NESTED_PAGE_CONFIRMATION_DELAY, findUnrenderedNestedPage };\nexport default plugin;";

  if (content.includes(badExport)) {
    content = content.replace(badExport, goodExport);
    fs.writeFileSync(pluginPath, content, "utf8");
    console.log("[Post-install] Patched Nuxt check-if-page-unused.js to fix NUXT_B2005 warning.");
  }
}
