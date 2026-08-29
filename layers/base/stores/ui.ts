// app/stores/ui.ts
// Global UI state: loading indicators, toast notifications, sidebar, modals.

export interface Toast {
  id: string;
  type: "success" | "error" | "info" | "warning";
  message: string;
}

export const useUiStore = defineStore("ui", () => {
  // ─── State ───────────────────────────────────────────────────────────────
  const isLoading = ref(false);
  const globalError = ref<string | null>(null);
  const toasts = ref<Toast[]>([]);
  const isMobileMenuOpen = ref(false);

  // ─── Actions ─────────────────────────────────────────────────────────────
  function showToast(type: Toast["type"], message: string, duration = 4000) {
    const id = crypto.randomUUID();
    toasts.value.push({ id, type, message });
    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id);
    }, duration);
  }

  function dismissToast(id: string) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function setLoading(value: boolean) {
    isLoading.value = value;
  }

  function setError(msg: string | null) {
    globalError.value = msg;
  }

  function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
  }

  function closeMobileMenu() {
    isMobileMenuOpen.value = false;
  }

  return {
    isLoading,
    globalError,
    toasts,
    isMobileMenuOpen,
    showToast,
    dismissToast,
    setLoading,
    setError,
    toggleMobileMenu,
    closeMobileMenu,
  };
});
