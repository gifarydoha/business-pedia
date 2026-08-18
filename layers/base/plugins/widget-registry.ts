import { defineNuxtPlugin } from "#app";
import { defineAsyncComponent } from "vue";
import { useWidgetRegistry } from "../composables/useWidgetRegistry";

export default defineNuxtPlugin(() => {
  const { register } = useWidgetRegistry();
  register({
    courses: defineAsyncComponent(() => import("~~/layers/base/components/widgets/WidgetCourses.vue")),
    topics: defineAsyncComponent(() => import("~~/layers/base/components/widgets/WidgetTopics.vue")),
    questions: defineAsyncComponent(() => import("~~/layers/base/components/widgets/WidgetQuestions.vue")),
    call_actions: defineAsyncComponent(() => import("~~/layers/base/components/widgets/WidgetCallActions.vue")),
  });
});
