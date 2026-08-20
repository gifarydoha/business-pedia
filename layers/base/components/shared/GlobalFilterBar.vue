<script setup lang="ts">
import { ref } from "vue";
import { Search, Settings2 } from "@lucide/vue";

// 1. Import Input
import { Input } from "../ui/input";
// 2. Import Button
import { Button } from "../ui/button";
// 3. Import all Sheet related components
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
  SheetClose,
} from "../ui/sheet";

// The state for your search preview
const searchQuery = ref("");
</script>

<template>
  <!-- Main Glassmorphic Wrapper -->
  <div
    class="sticky top-4 z-40 mx-auto flex w-full max-w-3xl items-center gap-2 rounded-full border border-border/40 bg-background/70 p-1.5 shadow-sm backdrop-blur-xl transition-all duration-300 hover:shadow-md"
  >
    <!-- 1. Left Side: Search Input with Icon Preview -->
    <div class="group relative flex-1">
      <div class="pointer-events-none absolute inset-y-0 left-4 flex items-center text-muted-foreground transition-colors group-focus-within:text-primary">
        <Search class="size-5" />
      </div>

      <Input
        v-model="searchQuery"
        type="text"
        placeholder="Search anything..."
        class="h-11 w-full rounded-full border-none bg-transparent pr-4 pl-12 text-base shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-0"
      />
    </div>

    <!-- 2. Right Side: Settings Icon & Filter Drawer -->
    <Sheet>
      <SheetTrigger as-child>
        <Button
          variant="ghost"
          size="icon"
          class="size-11 shrink-0 rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <Settings2 class="size-5" />
          <span class="sr-only">Open filters</span>
        </Button>
      </SheetTrigger>

      <SheetContent class="w-full border-l-border/50 bg-background/95 backdrop-blur-xl sm:max-w-md">
        <SheetHeader class="space-y-1">
          <SheetTitle class="text-2xl font-semibold tracking-tight">
            Filters
          </SheetTitle>
          <SheetDescription>
            Refine your view and discover exactly what you need.
          </SheetDescription>
        </SheetHeader>

        <!-- Filter Contents Wrapper -->
        <div class="mt-8 flex flex-col gap-8 pb-20">
          <!-- Example Filter Group -->
          <div class="space-y-4">
            <h4 class="text-sm leading-none font-medium text-foreground">
              Sort By
            </h4>
            <div class="flex flex-wrap gap-2">
              <Button
                variant="secondary"
                size="sm"
                class="rounded-full"
              >
                Latest
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="rounded-full"
              >
                Popular
              </Button>
              <Button
                variant="outline"
                size="sm"
                class="rounded-full"
              >
                Trending
              </Button>
            </div>
          </div>

          <!-- Add more filter options (Checkboxes, Selects, Sliders) here later! -->
        </div>

        <!-- Sticky Footer for Apply Button -->
        <SheetFooter class="absolute inset-x-0 bottom-0 border-t border-border/50 bg-background/80 p-6 backdrop-blur-sm">
          <SheetClose as-child>
            <Button class="active:scale-0.95 h-12 w-full rounded-full text-base font-medium shadow-lg transition-transform">
              Show Results
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
