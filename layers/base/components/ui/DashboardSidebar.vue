<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const { hasSubmittedPaper, submittedPaperId } = useUserPaper();
const open = ref(true);

withDefaults(defineProps<{
  hideDefaultToggler?: boolean;
  contentBgClass?: string;
}>(), {
  hideDefaultToggler: false,
  contentBgClass: "bg-white",
});

provide("toggleSidebar", () => {
  open.value = !open.value;
});

function getItems(_state: "collapsed" | "expanded") {
  return [
    {
      label: "My Papers",
      icon: "i-lucide-files",
      to: "/my-papers",
    },
    {
      label: hasSubmittedPaper.value ? "Edit Your Paper" : "Submit Paper",
      icon: "i-lucide-file-plus",
      to: hasSubmittedPaper.value ? `/submit-paper/${submittedPaperId.value}` : "/submit-paper/draft",
    },
    {
      label: "Profile",
      icon: "i-lucide-user",
      to: "/profile",
    },
  ] satisfies NavigationMenuItem[];
}
</script>

<template>
  <div class="flex size-full">
    <USidebar
      v-model:open="open"
      collapsible="icon"
      rail
      class="static! z-10 h-full!"
      style="position: static !important; height: 100% !important; z-index: 10 !important;"
      :ui="{
        root: 'static! h-full! z-10!',
        container: 'h-full static! border-none',
        inner: 'bg-brand-primary-light divide-transparent h-full!',
        body: 'py-0',
      }"
    >
      <template #default="{ state }">
        <UNavigationMenu
          :key="state"
          :items="getItems(state)"
          orientation="vertical"
          :ui="{
            link: 'p-2 overflow-hidden transition-colors rounded-md text-slate-800 hover:text-slate-900 data-[active]:bg-slate-100 data-[active]:text-slate-900 data-[active]:hover:text-slate-900',
          }"
        />
      </template>
    </USidebar>

    <div class="flex min-w-0 flex-1 flex-col">
      <div
        v-if="!hideDefaultToggler"
        class="flex h-(--ui-header-height) shrink-0 items-center px-4 text-slate-900 hover:bg-slate-100"
      >
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </div>

      <div :class="['flex flex-1 flex-col overflow-auto', contentBgClass]">
        <slot />
      </div>
    </div>
  </div>
</template>
