<script setup lang="ts">
import { ref } from "vue";
// import { ref, useTemplateRef } from "vue";
// import type { ProfileFormState, CustomField } from "~/layers/conference/types/profile";
import type { ProfileFormState } from "~/layers/conference/types/profile";
import { defaultProfileFormState, countries } from "~/layers/conference/data/profile.mock";

const router = useRouter();

const form = ref<ProfileFormState>({ ...defaultProfileFormState });

// let customFieldCounter = 1;

// const avatarInitials = ref("AO");
// const avatarHover = ref(false);
const saving = ref(false);
const saved = ref(false);
// const fileRef = useTemplateRef<HTMLInputElement>("fileInput");

const handleChange = () => {
  if (saved.value) saved.value = false;
};

// const addCustomField = () => {
//   form.value.customFields.push({ id: customFieldCounter++, label: "", value: "" });
// };

// const removeCustomField = (id: number) => {
//   form.value.customFields = form.value.customFields.filter((f) => f.id !== id);
// };

const handleSave = async (e: Event) => {
  e.preventDefault();
  saving.value = true;
  // Mock API call
  await new Promise((resolve) => setTimeout(resolve, 900));
  saving.value = false;
  saved.value = true;
  setTimeout(() => router.push("/profile"), 800);
};

const inputClass = "w-full rounded-xl border border-brand-primary/25 bg-white px-4 py-3 font-poppins text-sm text-gray-800 outline-none transition-colors focus:border-brand-primary focus:ring-1 focus:ring-brand-primary";
const disabledClass = "w-full cursor-not-allowed rounded-xl border border-brand-primary/10 bg-section-bg-light px-4 py-3 font-poppins text-sm text-gray-400 outline-none";
</script>

<template>
  <form
    novalidate
    @submit="handleSave"
  >
    <div class="mx-auto max-w-4xl space-y-8 px-4 py-12 md:px-0 md:pt-0 md:pb-16">
      <!-- Avatar card -->
      <!-- <div class="rounded-2xl border border-brand-primary/15 bg-white p-6 shadow-lg md:p-8">
        <h2 class="mb-6 border-b border-brand-primary/10 pb-3 font-lora text-lg font-bold text-brand-primary">
          Profile Photo
        </h2>
        <div class="flex items-center gap-6">

          <button
            type="button"
            class="relative size-20 shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-primary"
            aria-label="Change profile photo"
            @mouseenter="avatarHover = true"
            @mouseleave="avatarHover = false"
            @click="fileRef?.click()"
          >
            <div
              class="flex size-20 items-center justify-center rounded-full border-4 border-brand-primary-light bg-brand-secondary"
            >
              <span class="font-lora text-2xl font-bold text-brand-primary">
                {{ avatarInitials }}
              </span>
            </div>

            <div
              class="absolute inset-0 flex flex-col items-center justify-center gap-1 rounded-full bg-brand-primary/70 transition-opacity"
              :class="avatarHover ? 'opacity-100' : 'opacity-0'"
            >
              <svg
                class="size-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              <span class="font-poppins text-xs font-medium text-white">Change</span>
            </div>
          </button>

          <input
            ref="fileInput"
            type="file"
            accept="image/*"
            class="sr-only"
            aria-label="Upload profile photo"
          >

          <div>
            <p class="mb-1 font-poppins text-sm font-medium text-gray-700">
              Upload a new photo
            </p>
            <p class="font-poppins text-xs leading-relaxed text-gray-400">
              JPG, PNG or GIF. Hover over the avatar and click to change. Max 2 MB.
            </p>
            <button
              type="button"
              class="mt-3 rounded-full border border-brand-primary/30 px-4 py-1.5 font-poppins text-xs font-semibold text-brand-primary transition-colors hover:bg-brand-primary-light"
              @click="fileRef?.click()"
            >
              Browse files
            </button>
          </div>
        </div>
      </div> -->

      <!-- Core fields card -->
      <div class="rounded-2xl border border-brand-primary/15 bg-white p-6 shadow-lg md:p-8">
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
              for="email"
              class="mb-1.5 block font-poppins text-sm font-medium text-brand-primary"
            >
              Email Address <span class="text-destructive">*</span>
            </label>
            <input
              id="email"
              v-model="form.email"
              name="email"
              type="email"
              required
              :class="inputClass"
              @input="handleChange"
            >
          </div>

          <div>
            <label
              for="userId"
              class="mb-1.5 block font-poppins text-sm font-medium text-gray-400"
            >
              User ID
              <span class="ml-2 rounded-full bg-brand-primary-light px-2 py-0.5 text-xs font-normal text-brand-primary/60">
                read-only
              </span>
            </label>
            <input
              id="userId"
              v-model="form.userId"
              name="userId"
              type="text"
              readonly
              :class="disabledClass"
            >
          </div>

          <div>
            <label
              for="affiliation"
              class="mb-1.5 block font-poppins text-sm font-medium text-brand-primary"
            >
              Institutional Affiliation
            </label>
            <input
              id="affiliation"
              v-model="form.affiliation"
              name="affiliation"
              type="text"
              placeholder="e.g. North South University"
              :class="inputClass"
              @input="handleChange"
            >
          </div>

          <div>
            <label
              for="country"
              class="mb-1.5 block font-poppins text-sm font-medium text-brand-primary"
            >
              Country
            </label>
            <div class="relative">
              <select
                id="country"
                v-model="form.country"
                name="country"
                :class="[inputClass, 'appearance-none pr-10']"
                @change="handleChange"
              >
                <option value="">
                  Select country…
                </option>
                <option
                  v-for="c in countries"
                  :key="c"
                  :value="c"
                >
                  {{ c }}
                </option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-3 flex items-center">
                <svg
                  class="size-4 text-brand-primary/40"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>
          </div>

          <div class="md:col-span-2">
            <label
              for="bio"
              class="mb-1.5 block font-poppins text-sm font-medium text-brand-primary"
            >
              Bio
            </label>
            <textarea
              id="bio"
              v-model="form.bio"
              name="bio"
              rows="5"
              placeholder="A short academic biography…"
              :class="[inputClass, 'resize-y']"
              @input="handleChange"
            />
            <p class="mt-1 font-poppins text-xs text-gray-400">
              {{ form.bio.trim() ? form.bio.trim().split(/\s+/).length : 0 }} words
            </p>
          </div>
        </div>
      </div>

      <!-- Custom fields card -->
      <!-- <div class="rounded-2xl border border-brand-primary/15 bg-white p-6 shadow-lg md:p-8">
        <div class="mb-6 flex items-center justify-between border-b border-brand-primary/10 pb-3">
          <h2 class="font-lora text-lg font-bold text-brand-primary">
            Additional Fields
          </h2>
          <span class="font-poppins text-xs text-gray-400">
            {{ form.customFields.length }} field{{ form.customFields.length !== 1 ? 's' : '' }}
          </span>
        </div>

        <p
          v-if="form.customFields.length === 0"
          class="mb-6 font-poppins text-sm text-gray-400 italic"
        >
          No additional fields yet. Click below to add custom information to your profile.
        </p>

        <div class="mb-5 space-y-4">
          <div
            v-for="f in form.customFields"
            :key="f.id"
            class="flex items-start gap-3"
          >
            <div class="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                v-model="f.label"
                type="text"
                placeholder="Field label (e.g. ORCID)"
                :class="inputClass"
                @input="handleChange"
              >
              <input
                v-model="f.value"
                type="text"
                placeholder="Value"
                :class="inputClass"
                @input="handleChange"
              >
            </div>
            <button
              type="button"
              class="mt-3 flex size-8 shrink-0 items-center justify-center rounded-full border border-destructive/30 text-destructive/60 transition-colors hover:border-destructive hover:bg-destructive/5 hover:text-destructive"
              aria-label="Remove field"
              @click="removeCustomField(f.id)"
            >
              <svg
                class="size-3.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <button
          type="button"
          class="flex w-full justify-center gap-2 rounded-xl border-2 border-dashed border-brand-primary/25 px-5 py-3 font-poppins text-sm font-medium text-brand-primary/60 transition-colors hover:border-brand-primary/50 hover:text-brand-primary"
          @click="addCustomField"
        >
          <svg
            class="size-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Add Field
        </button>
      </div> -->

      <!-- Action buttons — sticky on mobile -->
      <div
        class="sticky bottom-0 z-20 -mx-6 flex flex-wrap gap-3 border-t border-brand-primary/10 bg-section-bg-light/95 px-6 py-4 backdrop-blur-sm md:static md:mx-0 md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none"
      >
        <button
          type="submit"
          :disabled="saving || saved"
          class="flex-1 rounded-full bg-brand-primary px-8 py-3 font-lora text-sm font-bold text-white transition-all md:flex-none"
          :class="[
            saved
              ? 'bg-brand-primary opacity-70'
              : saving
                ? 'cursor-wait opacity-70'
                : 'hover:opacity-90',
          ]"
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
