<script setup lang="ts">
// import { ref, computed } from "vue";
// import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import type { NavigationMenuItem } from "@nuxt/ui";
// import { useAuthStore } from "~~/layers/base/stores/auth";
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

// const authStore = useAuthStore();
const { hasSubmittedPaper, submittedPaperId } = useUserPaper();
const open = ref(true);

defineProps<{
  hideDefaultToggler?: boolean;
}>();

provide("toggleSidebar", () => {
  open.value = !open.value;
});

// const colorMode = useColorMode();

// const teams = ref([
//   {
//     label: "Nuxt",
//     avatar: { src: "https://github.com/nuxt.png", alt: "Nuxt" },
//   },
//   {
//     label: "Vue",
//     avatar: { src: "https://github.com/vuejs.png", alt: "Vue" },
//   },
//   {
//     label: "UnJS",
//     avatar: { src: "https://github.com/unjs.png", alt: "UnJS" },
//   },
// ]);
// const selectedTeam = ref(teams.value[0]);

// const teamsItems = computed<DropdownMenuItem[][]>(() => {
//   return [
//     teams.value.map((team, index) => ({
//       ...team,
//       kbds: ["meta", String(index + 1)],
//       onSelect() {
//         selectedTeam.value = team;
//       },
//     })),
//     [
//       {
//         label: "Create team",
//         icon: "i-lucide-circle-plus",
//       },
//     ],
//   ];
// });

function getItems(state: "collapsed" | "expanded") {
  return [
    // {
    //   label: "Inbox",
    //   icon: "i-lucide-inbox",
    //   badge: "4",
    // },
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
    {
      // label: "Settings",
      // icon: "i-lucide-settings",
      defaultOpen: true,
      children:
        state === "expanded"
          ? [
              // {
              //   label: "General",
              //   icon: "i-lucide-house",
              // },
              // {
              //   label: "Team",
              //   icon: "i-lucide-users",
              // },
              // {
              //   label: "Billing",
              //   icon: "i-lucide-credit-card",
              // },
            ]
          : [],
    },
  ] satisfies NavigationMenuItem[];
}

// const userItems = computed<DropdownMenuItem[][]>(() => [
//   [
//     {
//       label: "Profile",
//       icon: "i-lucide-user",
//       to: "/profile",
//     },
//     {
//       label: "Settings",
//       icon: "i-lucide-settings",
//     },
//   ],
//   [
//     {
//       label: "Appearance",
//       icon: "i-lucide-sun-moon",
//       children: [
//         {
//           label: "Light",
//           icon: "i-lucide-sun",
//           type: "checkbox",
//           checked: colorMode.value === "light",
//           onUpdateChecked(checked: boolean) {
//             if (checked) {
//               colorMode.preference = "light";
//             }
//           },
//           onSelect(e: Event) {
//             e.preventDefault();
//           },
//         },
//         {
//           label: "Dark",
//           icon: "i-lucide-moon",
//           type: "checkbox",
//           checked: colorMode.value === "dark",
//           onUpdateChecked(checked: boolean) {
//             if (checked) {
//               colorMode.preference = "dark";
//             }
//           },
//           onSelect(e: Event) {
//             e.preventDefault();
//           },
//         },
//       ],
//     },
//   ],
//   [
//     {
//       label: "Log out",
//       icon: "i-lucide-log-out",
//       onSelect() {
//         authStore.logout();
//       },
//     },
//   ],
// ]);

// defineShortcuts(extractShortcuts(teamsItems.value))
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
      <template #header>
        <div class="flex w-full items-center gap-2">
          <!-- <UDropdownMenu
              :items="teamsItems"
              :content="{ align: 'start', collisionPadding: 12 }"
              :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
              class="min-w-0 flex-1"
            >
              <UButton
                v-bind="selectedTeam"
                trailing-icon="i-lucide-chevrons-up-down"
                color="neutral"
                variant="ghost"
                square
                class="w-full overflow-hidden"
              />
            </UDropdownMenu> -->
          <!-- <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="shrink-0 md:hidden"
            aria-label="Close sidebar"
            @click="open = false"
          /> -->
        </div>
      </template>

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

      <!-- <template #footer>
        <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) text-slate-900 bg-white min-w-48' }"
        >
          <UButton
            :label="authStore.user?.name || 'User'"
            :avatar="{ src: authStore.user?.avatar || '', alt: authStore.user?.name || 'User' }"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            square
            class="w-full overflow-hidden text-slate-900 hover:bg-slate-100"
          />
        </UDropdownMenu>
      </template> -->
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

      <div class="flex-1 overflow-auto bg-white">
        <slot />
      </div>
    </div>
  </div>
</template>
