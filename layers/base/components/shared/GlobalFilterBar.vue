<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { Search, Settings2 } from "@lucide/vue";
import type { PageContent } from "../../types/api";

// 1. Imports
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "../ui/dialog";

// 2. Props & Emits
const props = defineProps<{
  contents: PageContent[];
  search?: string;
}>();

const emit = defineEmits<{
  (e: "update:search", value: string): void;
  (e: "filter", filters: unknown): void;
}>();

const isFocused = ref(false);

const handleBlur = () => {
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

// Use local state for typing so we don't spam API requests
const localSearch = ref(props.search || "");

const triggerSearch = (text?: string) => {
  if (text !== undefined) {
    localSearch.value = text;
  }
  emit("update:search", localSearch.value);
};

// Automatically reset search if the user clears the input completely
watch(localSearch, (newVal) => {
  if (newVal === "") {
    emit("update:search", "");
  }
});

// 3. Search Suggestions Logic (Filter by alias and title)
const searchSuggestions = computed(() => {
  if (!localSearch.value) return [];
  const query = localSearch.value.toLowerCase();

  return props.contents.filter((item) =>
    item.title?.toLowerCase().includes(query)
    || item.alias?.toLowerCase().includes(query),
  ).slice(0, 8); // Limit to top 8 suggestions
});

// 4. Dynamic Filter Options (Extracted from API data)
const availableKeywords = computed(() => {
  const keywords = new Set<string>();
  props.contents.forEach((item) => {
    if (item.meta_keywords) {
      item.meta_keywords.split(",").forEach((k) => keywords.add(k.trim()));
    }
  });
  return Array.from(keywords).filter(Boolean);
});

// Store selected filters
const selectedFilters = ref({
  keyword: "",
  featured: false,
  minViews: 0,
});

const applyFilters = () => {
  emit("filter", selectedFilters.value);
};
</script>

<template>
  <div class="sticky top-20 z-40 mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-border/40 bg-background/70 p-1.5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md">
    <!-- Left Side: Search Input with Suggestions Dropdown -->
    <div class="group relative flex-1">
      <div class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground transition-colors group-focus-within:text-primary">
        <Search class="size-5" />
      </div>

      <Input
        v-model="localSearch"
        type="text"
        placeholder="Search anything..."
        class="h-11 w-full rounded-full border-none bg-transparent pr-4 pl-12 text-base shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
        @focus="isFocused = true"
        @blur="handleBlur"
        @keydown.enter="triggerSearch()"
      />

      <!-- Search Suggestions Dropdown (YouTube style) -->
      <div
        v-if="isFocused && searchSuggestions.length > 0"
        class="absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-border bg-background py-2 shadow-lg"
      >
        <button
          v-for="item in searchSuggestions"
          :key="item.id"
          class="flex w-full cursor-pointer items-center gap-3 px-4 py-2 text-left transition-colors hover:bg-muted"
          @click="triggerSearch(item.title)"
        >
          <Search class="size-4 text-muted-foreground" />
          <div class="flex flex-col">
            <span class="text-sm font-medium">{{ item.title }}</span>
            <span class="text-xs text-muted-foreground">{{ item.category_title }}</span>
          </div>
        </button>
      </div>
    </div>

    <!-- Right Side: Filter Dialog (YouTube style Modal) -->
    <Dialog>
      <DialogTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="size-11 shrink-0 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings2 class="size-5" />
          <span class="sr-only">Open filters</span>
        </Button>
      </DialogTrigger>

      <DialogContent class="overflow-hidden border-border bg-background p-0 sm:max-w-175">
        <!-- Header -->
        <DialogHeader class="flex flex-row items-center justify-between border-b border-border px-6 py-4">
          <DialogTitle class="text-xl font-normal">
            Search filters
          </DialogTitle>
          <!-- <DialogClose as-child>
            <Button
              variant="ghost"
              size="icon"
              class="bg-red-500 size-8 rounded-full"
            >
              <X class="size-4" />
            </Button>
          </DialogClose> -->
        </DialogHeader>

        <!-- YouTube Style Filter Columns -->
        <div class="grid max-h-[60vh] grid-cols-1 gap-8 overflow-y-auto p-6 sm:grid-cols-3">
          <!-- Column 1: Keywords -->
          <div class="space-y-4">
            <h4 class="border-b border-border/50 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Keywords
            </h4>
            <div class="flex flex-col space-y-3">
              <button
                v-for="kw in availableKeywords"
                :key="kw"
                class="text-left text-sm text-foreground/80 transition-colors hover:text-foreground"
                :class="{ 'font-semibold text-primary': selectedFilters.keyword === kw }"
                @click="selectedFilters.keyword = selectedFilters.keyword === kw ? '' : kw"
              >
                {{ kw }}
              </button>
            </div>
          </div>

          <!-- Column 2: Status / Featured -->
          <div class="space-y-4">
            <h4 class="border-b border-border/50 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Features
            </h4>
            <div class="flex flex-col space-y-3">
              <button
                class="text-left text-sm text-foreground/80 transition-colors hover:text-foreground"
                :class="{ 'font-semibold text-primary': selectedFilters.featured }"
                @click="selectedFilters.featured = !selectedFilters.featured"
              >
                Featured Image Only
              </button>
            </div>
          </div>

          <!-- Column 3: Views (Prioritize) -->
          <div class="space-y-4">
            <h4 class="border-b border-border/50 pb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
              Prioritize
            </h4>
            <div class="flex flex-col space-y-3">
              <button
                class="text-left text-sm text-foreground/80 transition-colors hover:text-foreground"
                :class="{ 'font-semibold text-primary': selectedFilters.minViews === 100 }"
                @click="selectedFilters.minViews = 100"
              >
                Popular (100+ views)
              </button>
              <button
                class="text-left text-sm text-foreground/80 transition-colors hover:text-foreground"
                :class="{ 'font-semibold text-primary': selectedFilters.minViews === 0 }"
                @click="selectedFilters.minViews = 0"
              >
                Any Views
              </button>
            </div>
          </div>
        </div>

        <!-- Apply Button Footer -->
        <div class="flex justify-end border-t border-border bg-muted/30 p-4">
          <DialogClose as-child>
            <Button
              class="rounded-full px-6"
              @click="applyFilters"
            >
              Apply Filters
            </Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  </div>
</template>
