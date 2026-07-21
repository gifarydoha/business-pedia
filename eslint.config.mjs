// @ts-check
import withNuxt from "./.nuxt/eslint.config.mjs";
import tailwind from "eslint-plugin-tailwindcss";

export default withNuxt(
  // Tailwind: register plugin + rules in one object
  {
    plugins: tailwind.configs.recommended.plugins,
    settings: {
      tailwindcss: {
        cssConfigPath: "app/assets/css/main.css",
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
