// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import tailwind from "eslint-plugin-tailwindcss";

import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const cssPath = path.resolve(__dirname, "layers/base/assets/css/main.css");

export default withNuxt(
  // Tailwind: register plugin + rules in one object
  {
    plugins: tailwind.configs.recommended.plugins,
    settings: {
      tailwindcss: {
        cssConfigPath: cssPath,
      },
    },
    rules: {
      // Tailwind recommended rules
      ...tailwind.configs.recommended.rules,

      // Prettier: "arrowParens": "always"
      "@stylistic/arrow-parens": ["error", "always"],

      // Prettier: "printWidth": 100
      "@stylistic/max-len": "off",

      // Disable v-html warning if it's intentional for CMS content
      "vue/no-v-html": "off",

      // Tweak Tailwind plugin settings if needed
      "tailwindcss/classnames-order": "warn",
      "tailwindcss/no-custom-classname": ["warn", {
        whitelist: [
          ".*brand-primary.*",
          "prose.*",
          "nav-link",
          "hero-.*",
          "page-.*",
          "rich-.*",
        ],
      }],
    },
  },
);
