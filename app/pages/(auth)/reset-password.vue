<script setup lang="ts">
import { useForm } from "vee-validate";
// zodSchema auto-imported from utils/zodSchema.ts
import { ResetPasswordSchema } from "~/schemas/auth.schemas";

const authStore = useAuthStore();
const route = useRoute();

// Guard — if reset_token is missing the user got here without verifying OTP
// if (!authStore.resetToken) await navigateTo("/forgot-password");

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(ResetPasswordSchema),
});
const [password, passwordAttrs] = defineField("password");
const [passwordConfirmation, passwordConfirmationAttrs] = defineField(
  "passwordConfirmation",
);

const serverError = ref("");
const successMessage = ref("");
const showPassword = ref(false);
const confirmShowPassword = ref(false);

const onSubmit = handleSubmit(async (values) => {
  serverError.value = "";
  try {
    await authStore.resetPassword({
      email: route.query.email as string, // passed through query from /forgot-password → /verify-otp → here
      resetToken: authStore.resetToken!, // guaranteed non-null by the guard above
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    });
    successMessage.value = "Password reset. Redirecting to sign in…";
    setTimeout(() => navigateTo("/login"), 1500);
  }
  catch {
    serverError.value = authStore.error || "Reset token is invalid or expired";
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
        class="mb-6 font-poppins text-xl font-semibold text-fy-sage-900 sm:text-2xl"
      >
        Set a new password
      </h1>

      <form
        class="space-y-4"
        @submit="onSubmit"
      >
        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >New password</label>
          <div class="relative">
            <input
              v-bind="passwordAttrs"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full rounded-lg border border-slate-300 py-2.5 pr-10 pl-3 font-lora text-sm focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
            >
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              @click="showPassword = !showPassword"
            >
              <Icon
                :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                class="size-5 text-fy-sage-950"
              />
            </button>
          </div>
          <p
            v-if="errors.password"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >Confirm new password</label>
          <div class="relative">
            <input
              v-bind="passwordConfirmationAttrs"
              v-model="passwordConfirmation"
              :type="confirmShowPassword ? 'text' : 'password'"
              class="w-full rounded-lg border border-slate-300 py-2.5 pr-10 pl-3 font-lora text-sm focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
            >
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              @click="confirmShowPassword = !confirmShowPassword"
            >
              <Icon
                :name="confirmShowPassword ? 'lucide:eye-off' : 'lucide:eye'"
                class="size-5 text-fy-sage-950"
              />
            </button>
          </div>
          <p
            v-if="errors.passwordConfirmation"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.passwordConfirmation }}
          </p>
        </div>

        <p
          v-if="successMessage"
          class="font-lora text-sm text-fy-teal-300"
        >
          {{ successMessage }}
        </p>
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
          {{ authStore.loading ? "Resetting…" : "Reset password" }}
        </button>
      </form>
    </div>
  </div>
</template>
