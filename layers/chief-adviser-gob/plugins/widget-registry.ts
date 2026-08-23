import { defineNuxtPlugin } from "#app";
import { defineAsyncComponent } from "vue";
import { useWidgetRegistry } from "~~/layers/base/composables/useWidgetRegistry";

export default defineNuxtPlugin(() => {
  const { register } = useWidgetRegistry();

  // Register the new widgets defined in the CMS to use the generic HTML block component
  register({
    header: defineAsyncComponent(() => import("../components/widgets/WidgetHtmlBlock.vue")),
  });
});
