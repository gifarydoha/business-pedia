<script setup lang="ts">
import { ref, computed } from "vue";
import type { DropdownMenuItem, NavigationMenuItem } from "@nuxt/ui";
import { useAuthStore } from "~~/layers/base/stores/auth";

const authStore = useAuthStore();
const open = ref(true);

const colorMode = useColorMode();

const teams = ref([
  {
    label: "Nuxt",
    avatar: { src: "https://github.com/nuxt.png", alt: "Nuxt" },
  },
  {
    label: "Vue",
    avatar: { src: "https://github.com/vuejs.png", alt: "Vue" },
  },
  {
    label: "UnJS",
    avatar: { src: "https://github.com/unjs.png", alt: "UnJS" },
  },
]);
const selectedTeam = ref(teams.value[0]);

const teamsItems = computed<DropdownMenuItem[][]>(() => {
  return [
    teams.value.map((team, index) => ({
      ...team,
      kbds: ["meta", String(index + 1)],
      onSelect() {
        selectedTeam.value = team;
      },
    })),
    [
      {
        label: "Create team",
        icon: "i-lucide-circle-plus",
      },
    ],
  ];
});

function getItems(state: "collapsed" | "expanded") {
  return [
    {
      label: "Inbox",
      icon: "i-lucide-inbox",
      badge: "4",
    },
    {
      label: "My Papers",
      icon: "i-lucide-files",
      to: "/my-papers",
    },
    {
      label: "Submit Paper",
      icon: "i-lucide-file-plus",
      to: "/submit-paper",
    },
    {
      label: "Profile",
      icon: "i-lucide-user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "i-lucide-settings",
      defaultOpen: true,
      children:
        state === "expanded"
          ? [
              {
                label: "General",
                icon: "i-lucide-house",
              },
              {
                label: "Team",
                icon: "i-lucide-users",
              },
              {
                label: "Billing",
                icon: "i-lucide-credit-card",
              },
            ]
          : [],
    },
  ] satisfies NavigationMenuItem[];
}

const userItems = computed<DropdownMenuItem[][]>(() => [
  [
    {
      label: "Profile",
      icon: "i-lucide-user",
      to: "/profile",
    },
    {
      label: "Settings",
      icon: "i-lucide-settings",
    },
  ],
  [
    {
      label: "Appearance",
      icon: "i-lucide-sun-moon",
      children: [
        {
          label: "Light",
          icon: "i-lucide-sun",
          type: "checkbox",
          checked: colorMode.value === "light",
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = "light";
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
        {
          label: "Dark",
          icon: "i-lucide-moon",
          type: "checkbox",
          checked: colorMode.value === "dark",
          onUpdateChecked(checked: boolean) {
            if (checked) {
              colorMode.preference = "dark";
            }
          },
          onSelect(e: Event) {
            e.preventDefault();
          },
        },
      ],
    },
  ],
  [
    {
      label: "Log out",
      icon: "i-lucide-log-out",
      onSelect() {
        authStore.logout();
      },
    },
  ],
]);

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
        container: 'h-full static!',
        inner: 'bg-[var(--color-cfp-olive)] text-[var(--color-cfp-cream)] divide-transparent h-full!',
        body: 'py-0',
      }"
    >
      <template #header>
        <div class="flex w-full items-center gap-2">
          <UDropdownMenu
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
              class="w-full overflow-hidden text-[var(--color-cfp-cream)] hover:bg-[var(--color-cfp-olive-dark)] hover:text-[var(--color-cfp-yellow)] data-[state=open]:bg-[var(--color-cfp-olive-dark)] data-[state=open]:text-[var(--color-cfp-yellow)]"
              :ui="{
                trailingIcon: 'text-[var(--color-cfp-olive-pale)] ms-auto',
              }"
            />
          </UDropdownMenu>
          <UButton
            icon="i-lucide-x"
            color="neutral"
            variant="ghost"
            class="shrink-0 text-[var(--color-cfp-cream)] hover:bg-[var(--color-cfp-olive-dark)] hover:text-[var(--color-cfp-yellow)] md:hidden"
            aria-label="Close sidebar"
            @click="open = false"
          />
        </div>
      </template>

      <template #default="{ state }">
        <UNavigationMenu
          :key="state"
          :items="getItems(state)"
          orientation="vertical"
          class="cfp-nav-menu"
          :ui="{ link: 'p-1.5 overflow-hidden' }"
        />
      </template>

      <template #footer>
        <UDropdownMenu
          :items="userItems"
          :content="{ align: 'center', collisionPadding: 12 }"
          :ui="{ content: 'w-(--reka-dropdown-menu-trigger-width) min-w-48' }"
        >
          <UButton
            :label="authStore.user?.name || 'User'"
            :avatar="{ src: authStore.user?.avatar || '', alt: authStore.user?.name || 'User' }"
            trailing-icon="i-lucide-chevrons-up-down"
            color="neutral"
            variant="ghost"
            square
            class="w-full overflow-hidden text-[var(--color-cfp-cream)] hover:bg-[var(--color-cfp-olive-dark)] hover:text-[var(--color-cfp-yellow)] data-[state=open]:bg-[var(--color-cfp-olive-dark)] data-[state=open]:text-[var(--color-cfp-yellow)]"
            :ui="{
              trailingIcon: 'text-[var(--color-cfp-olive-pale)] ms-auto',
            }"
          />
        </UDropdownMenu>
      </template>
    </USidebar>

    <div class="flex min-w-0 flex-1 flex-col">
      <div class="flex h-(--ui-header-height) shrink-0 items-center border-b border-default bg-white px-4">
        <UButton
          icon="i-lucide-panel-left"
          color="neutral"
          variant="ghost"
          aria-label="Toggle sidebar"
          @click="open = !open"
        />
      </div>

      <div class="flex-1 overflow-auto bg-gray-50/50">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Theme colors for Navigation Menu */
:deep(.cfp-nav-menu a),
:deep(.cfp-nav-menu button) {
  color: var(--color-cfp-cream) !important;
}

:deep(.cfp-nav-menu a:hover),
:deep(.cfp-nav-menu button:hover) {
  background-color: var(--color-cfp-olive-dark) !important;
  color: var(--color-cfp-yellow) !important;
}

:deep(.cfp-nav-menu a:hover .icon),
:deep(.cfp-nav-menu button:hover .icon),
:deep(.cfp-nav-menu a:hover svg),
:deep(.cfp-nav-menu button:hover svg) {
  color: var(--color-cfp-yellow) !important;
}

/* Active links */
:deep(.cfp-nav-menu a[aria-current="page"]),
:deep(.cfp-nav-menu button[aria-expanded="true"]),
:deep(.cfp-nav-menu .active) {
  background-color: var(--color-cfp-olive-dark) !important;
  color: var(--color-cfp-yellow) !important;
}

:deep(.cfp-nav-menu a[aria-current="page"] .icon),
:deep(.cfp-nav-menu button[aria-expanded="true"] .icon),
:deep(.cfp-nav-menu .active .icon),
:deep(.cfp-nav-menu a[aria-current="page"] svg),
:deep(.cfp-nav-menu button[aria-expanded="true"] svg),
:deep(.cfp-nav-menu .active svg) {
  color: var(--color-cfp-yellow) !important;
}

/* Subtext or badges */
:deep(.cfp-nav-menu [class*="text-dimmed"]) {
  color: var(--color-cfp-olive-pale) !important;
}
</style>
