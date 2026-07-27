<script setup lang="ts">
import { useForm } from "vee-validate";
// zodSchema auto-imported from utils/zodSchema.ts
import { ForgotPasswordSchema } from "~/schemas/auth.schemas";

const authStore = useAuthStore();
const { serverError, clearErrors } = useAuthForm();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(ForgotPasswordSchema),
});
const [email, emailAttrs] = defineField("email");

const onSubmit = handleSubmit(async (values) => {
  clearErrors();
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
  <AuthCard
    heading="Reset your password"
    subtitle="We'll email you a reset code"
  >
    <form
      class="space-y-4"
      @submit="onSubmit"
    >
      <AuthFormField
        v-model="email"
        v-bind="emailAttrs"
        label="Email"
        type="email"
        :error="errors.email"
      />

      <AuthFeedback :error="serverError" />

      <AuthSubmitButton
        :loading="authStore.loading"
        label="Send reset code"
        loading-label="Sending…"
      />
    </form>

    <p class="mt-6 text-center font-lora text-sm text-slate-500">
      <NuxtLink
        to="/login"
        class="font-medium text-fy-sky-500 hover:underline"
      >
        Back to Login
      </NuxtLink>
    </p>
  </AuthCard>
</template>
