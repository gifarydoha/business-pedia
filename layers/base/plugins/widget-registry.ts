import { defineNuxtPlugin } from "#app";
import { defineAsyncComponent } from "vue";
import { useWidgetRegistry } from "../composables/useWidgetRegistry";

export default defineNuxtPlugin(() => {
  const { register } = useWidgetRegistry();
  register({
    courses: defineAsyncComponent(() => import("~/components/widgets/WidgetCourses.vue")),
    topics: defineAsyncComponent(() => import("~/components/widgets/WidgetTopics.vue")),
    questions: defineAsyncComponent(() => import("~/components/widgets/WidgetQuestions.vue")),
    call_actions: defineAsyncComponent(() => import("~/components/widgets/WidgetCallActions.vue")),
  });
});
