<script setup lang="ts">
import { useForm } from "vee-validate";
import { SetPasswordSchema } from "~/schemas/auth.schemas";

definePageMeta({ layout: false, middleware: ["auth"] });

const layoutName = useModuleDashboardLayout();

const authStore = useAuthStore();
const { serverError, successMessage, clearErrors } = useAuthForm();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(SetPasswordSchema),
});

const [password, passwordAttrs] = defineField("password");
const [passwordConfirmation, passwordConfirmationAttrs] = defineField("password_confirmation");

const onSubmit = handleSubmit(async (values) => {
  clearErrors();
  try {
    await authStore.setPassword({
      password: values.password,
      password_confirmation: values.password_confirmation,
    });
    successMessage.value = "Password set successfully. Redirecting to Profile…";
    setTimeout(() => navigateTo("/profile"), 1500);
  }
  catch {
    serverError.value = authStore.error || "Could not set password";
  }
});
</script>

<template>
  <NuxtLayout :name="layoutName">
    <div>
      <!-- Page header -->
      <div class="mx-auto max-w-3xl px-6 py-10 md:py-12">
        <div class="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-5">
          <h1 class="mb-6 font-lora text-2xl font-bold text-brand-primary md:text-3xl">
            Set Password
          </h1>
        </div>

        <!-- Form matching ProfileEditForm -->
        <form
          novalidate
          @submit="onSubmit"
        >
          <div class="mx-auto max-w-4xl space-y-8 px-4 py-4 md:px-0 md:pt-0 md:pb-8">
            <div class="rounded-2xl border border-brand-primary/15 bg-white p-6 shadow-lg md:p-8">
              <h2 class="mb-6 border-b border-brand-primary/10 pb-3 font-lora text-lg font-bold text-brand-primary">
                Set New Password
              </h2>

              <div class="grid grid-cols-1 gap-6">
                <AuthPasswordField
                  v-model="password"
                  v-bind="passwordAttrs"
                  label="New Password"
                  :error="errors.password"
                />

                <AuthPasswordField
                  v-model="passwordConfirmation"
                  v-bind="passwordConfirmationAttrs"
                  label="Confirm New Password"
                  :error="errors.password_confirmation"
                />

                <AuthFeedback
                  :error="serverError"
                  :success="successMessage"
                />
              </div>
            </div>

            <!-- Bottom Actions mimicking ProfileEditForm -->
            <div class="sticky bottom-0 z-20 -mx-6 flex flex-wrap gap-3 border-t border-brand-primary/10 bg-section-bg-light/95 px-6 py-4 backdrop-blur-sm md:static md:mx-0 md:border-none md:bg-transparent md:p-0 md:backdrop-blur-none">
              <button
                type="submit"
                :disabled="authStore.loading"
                class="flex-1 rounded-full bg-brand-primary px-8 py-3 font-lora text-sm font-bold text-white transition-all md:flex-none"
                :class="[authStore.loading ? 'cursor-wait opacity-70' : 'hover:opacity-90']"
              >
                {{ authStore.loading ? 'Setting…' : 'Set Password' }}
              </button>
              <button
                type="button"
                class="flex-1 cursor-pointer rounded-full border-2 border-brand-primary px-8 py-3 text-center font-lora text-sm font-bold text-brand-primary transition-colors hover:bg-brand-primary/5 md:flex-none"
                @click="$router.back()"
              >
                Cancel
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </NuxtLayout>
</template>
