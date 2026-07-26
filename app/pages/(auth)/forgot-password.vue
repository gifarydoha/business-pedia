<script setup lang="ts">
import { useForm } from "vee-validate";
// zodSchema auto-imported from utils/zodSchema.ts
import { ForgotPasswordSchema } from "~/schemas/auth.schemas";

const authStore = useAuthStore();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(ForgotPasswordSchema),
});
const [email, emailAttrs] = defineField("email");

const serverError = ref("");

const onSubmit = handleSubmit(async (values) => {
  serverError.value = "";
  try {
    await authStore.forgotPassword({ email: values.email });
    await navigateTo(
      `/verify-otp?purpose=reset_password&email=${encodeURIComponent(values.email)}`,
    );
  }
  catch {
    serverError.value = authStore.error || "Something went wrong";
  }
});
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-fy-teal-50 px-4 py-12"
  >
    <div
      class="w-full max-w-md rounded-2xl border border-fy-teal-50 bg-white p-6 shadow-sm sm:p-8"
    >
      <h1
        class="mb-1 font-poppins text-xl font-semibold text-fy-sage-900 sm:text-2xl"
      >
        Reset your password
      </h1>
      <p class="mb-6 font-lora text-sm text-slate-500">
        We'll email you a reset code
      </p>

      <form
        class="space-y-4"
        @submit="onSubmit"
      >
        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >Email</label>
          <input
            v-bind="emailAttrs"
            v-model="email"
            type="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-lora text-sm focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
          >
          <p
            v-if="errors.email"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.email }}
          </p>
        </div>

        <p
          v-if="serverError"
          class="font-lora text-sm text-red-600"
        >
          {{ serverError }}
        </p>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full rounded-lg bg-fy-orange-300 px-6 py-2.5 font-poppins text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {{ authStore.loading ? "Sending…" : "Send reset code" }}
        </button>
      </form>

      <p class="mt-6 text-center font-lora text-sm text-slate-500">
        <NuxtLink
          to="/login"
          class="font-medium text-fy-sky-500 hover:underline"
        >Back to sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>
