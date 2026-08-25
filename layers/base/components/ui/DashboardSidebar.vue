<script setup lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";
import { useAuthStore } from "~~/layers/base/stores/auth";
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

const authStore = useAuthStore();
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

interface NavigationGroup {
  title: string;
  roles: string[];
  items: NavigationMenuItem[];
}

const navGroups = computed<NavigationGroup[]>(() => {
  return [
    {
      title: "For Reviewers",
      roles: ["admin"],
      items: [
        { label: "Review Request", icon: "i-lucide-file-text", to: "/review-requests" },
        { label: "Instruction For Reviewer", icon: "i-lucide-info", to: "/reviewer-instructions" },
      ],
    },
    {
      title: "Email & Notification",
      roles: [],
      items: [
        { label: "Committee: Email to Author", icon: "i-lucide-mail", to: "/email/committee-to-author" },
        { label: "Committee: Email to all chair", icon: "i-lucide-mail", to: "/email/committee-to-chairs" },
        { label: "Reviewer: Email to Chair", icon: "i-lucide-mail", to: "/email/reviewer-to-chair" },
        { label: "Author: Email to Chair", icon: "i-lucide-mail", to: "/email/author-to-chair" },
        { label: "Recent Notifications", icon: "i-lucide-bell", to: "/notifications/recent" },
        { label: "All Notifications", icon: "i-lucide-bell-ring", to: "/notifications/all" },
      ],
    },
    {
      title: "Status (Only View)",
      roles: ["admin"],
      items: [
        { label: "Submission Summary", icon: "i-lucide-bar-chart-2", to: "/status/submission-summary" },
        { label: "Paper Submission Status", icon: "i-lucide-check-circle", to: "/status/paper-submission-status" },
      ],
    },
    {
      title: "Conference Papers",
      roles: ["admin", "editor", "reviewer", "client"],
      items: [
        { label: "All Papers", icon: "i-lucide-files", to: "/all-papers" },
      ],
    },
    {
      title: "For Authors",
      roles: ["admin", "editor", "author", "client"],
      items: [
        // { label: "My Current Paper", icon: "i-lucide-file", to: "/my-papers/current" },
        { label: "My All Papers", icon: "i-lucide-files", to: "/my-papers" },
        // { label: "Previous Papers", icon: "i-lucide-archive", to: "/my-papers/previous" },
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
      ],
    },
  ];
});
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
        body: 'py-4 flex flex-col gap-6 overflow-y-auto',
      }"
    >
      <template #default="{ state }">
        <template
          v-for="group in navGroups"
          :key="group.title"
        >
          <div v-if="group.roles.includes(authStore.userRole || 'reader')">
            <div
              v-if="state === 'expanded'"
              class="mb-2 rounded-md border border-teal-100/50 bg-teal-50/80 px-3 py-1.5 text-sm font-semibold text-teal-700"
            >
              {{ group.title }}
            </div>
            <UNavigationMenu
              :items="group.items"
              orientation="vertical"
              :ui="{
                link: 'p-2 overflow-hidden transition-colors rounded-md text-slate-800 hover:text-slate-900 data-[active]:bg-slate-100 data-[active]:text-slate-900 data-[active]:hover:text-slate-900',
              }"
            />
          </div>
        </template>
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
