<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { ProfileFormState } from "~/layers/conference/types/profile";

const router = useRouter();
const authStore = useAuthStore();
const config = useRuntimeConfig();

const form = ref<ProfileFormState>({
  name: "",
  contact_number: "",
  designation: "",
});

const loading = ref(true);
const saving = ref(false);
const saved = ref(false);

const handleChange = () => {
  if (saved.value) saved.value = false;
};

onMounted(async () => {
  if (authStore.user?.id) {
    try {
      const res = await $fetch<{ user?: any }>(`/ciaur/secure_api/user/${authStore.user.id}`, {
        baseURL: config.public.apiBase as string,
        method: "GET",
      });
      if (res && res.user) {
        form.value.name = res.user.name || "";
        form.value.contact_number = res.user.contact_number || "";
        form.value.designation = res.user.designation || "";
      }
    }
    catch (e) {
      console.error("Failed to fetch user profile", e);
    }
  }
  loading.value = false;
});

const handleSave = async (e: Event) => {
  e.preventDefault();
  if (!authStore.user?.id) return;

  saving.value = true;
  try {
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("contact_number", form.value.contact_number);
    formData.append("designation", form.value.designation);

    await $fetch(`/ciaur/secure_api/user/${authStore.user.id}`, {
      baseURL: config.public.apiBase as string,
      method: "POST",
      body: formData,
    });

    // Also update the store if the name changed
    if (authStore.user.name !== form.value.name) {
      authStore.user.name = form.value.name;
    }

    saved.value = true;
    setTimeout(() => router.push("/profile"), 800);
  }
  catch (e) {
    console.error("Failed to update profile", e);
  }
  finally {
    saving.value = false;
  }
};

const inputClass = "w-full rounded-xl border border-brand-primary/25 bg-white px-4 py-3 font-poppins text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary";
</script>

<template>
  <form
    novalidate
    @submit="handleSave"
  >
    <div class="mx-auto max-w-4xl space-y-8 px-4 py-12 md:px-0 md:pt-0 md:pb-16">
      <div
        v-if="loading"
        class="flex justify-center p-8 font-poppins text-brand-primary"
      >
        Loading profile...
      </div>

      <div
        v-else
        class="rounded-2xl border border-brand-primary/15 bg-white p-6 shadow-lg md:p-8"
      >
        <h2 class="mb-6 border-b border-brand-primary/10 pb-3 font-lora text-lg font-bold text-brand-primary">
          Personal Information
        </h2>

        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div class="md:col-span-2">
            <label
              for="name"
              class="mb-1.5 block font-poppins text-sm font-medium text-brand-primary"
            >
              Full Name <span class="text-destructive">*</span>
            </label>
            <input
              id="name"
              v-model="form.name"
              name="name"
              type="text"
              required
              :class="inputClass"
              @input="handleChange"
            >
          </div>

          <div>
            <label
              for="contact_number"
              class="mb-1.5 block font-poppins text-sm font-medium text-brand-primary"
            >
              Contact Number
            </label>
            <input
              id="contact_number"
              v-model="form.contact_number"
              name="contact_number"
              type="tel"
              :class="inputClass"
              @input="handleChange"
            >
          </div>

          <div>
            <label
              for="designation"
              class="mb-1.5 block font-poppins text-sm font-medium text-brand-primary"
            >
              Designation
            </label>
            <input
              id="designation"
              v-model="form.designation"
              name="designation"
              type="text"
              placeholder="e.g. Software Engineer"
              :class="inputClass"
              @input="handleChange"
            >
          </div>
        </div>
      </div>

      <div class="sticky bottom-0 z-20 -mx-6 flex flex-wrap gap-3 border-t border-brand-primary/10 bg-section-bg-light/95 px-6 py-4 backdrop-blur-sm md:static md:mx-0 md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
        <button
          type="submit"
          :disabled="saving || saved"
          class="flex-1 rounded-full bg-brand-primary px-8 py-3 font-lora text-sm font-bold text-white transition-all md:flex-none"
          :class="[saved ? 'bg-brand-primary opacity-70' : saving ? 'cursor-wait opacity-70' : 'hover:opacity-90']"
        >
          {{ saved ? '✓ Saved!' : saving ? 'Saving…' : 'Save Changes' }}
        </button>
        <NuxtLink
          to="/profile"
          class="flex-1 rounded-full border-2 border-brand-primary px-8 py-3 text-center font-lora text-sm font-bold text-brand-primary transition-colors hover:bg-brand-primary/5 md:flex-none"
        >
          Cancel
        </NuxtLink>
      </div>
    </div>
  </form>
</template>
