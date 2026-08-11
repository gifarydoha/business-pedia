import { defineStore } from "pinia";
import type { CfpContent } from "../types/cfp";
import { useCfpService } from "../services/cfp.service";
import { parseCfpContent } from "../utils/cfpParser";
import { ref } from "vue";

export const useCfpStore = defineStore("cfp", () => {
  const cfpData = ref<CfpContent | null>(null);
  const isLoaded = ref(false);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const cfpService = useCfpService();

  async function fetchCfpData(force = false) {
    if (!force && (isLoaded.value || isLoading.value)) return;
    isLoading.value = true;
    error.value = null;

    try {
      const response = await cfpService.fetchRawCfpContent();
      cfpData.value = parseCfpContent(response.content ?? "");
      isLoaded.value = true;
    }
    catch (e: unknown) {
      const err = e as { data?: { statusMessage?: string }; message?: string };
      error.value
        = err.data?.statusMessage ?? err.message ?? "Failed to load Call for Papers content.";
      console.error("[cfp store] Failed to load cfp content:", error.value);
    }
    finally {
      isLoading.value = false;
    }
  }

  function reset() {
    cfpData.value = null;
    isLoaded.value = false;
    isLoading.value = false;
    error.value = null;
  }

  return {
    cfpData,
    isLoaded,
    isLoading,
    error,
    fetchCfpData,
    reset,
  };
});
