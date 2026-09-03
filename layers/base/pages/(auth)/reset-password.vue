<script setup lang="ts">
import { useForm } from "vee-validate";
// zodSchema auto-imported from utils/zodSchema.ts
import { ResetPasswordSchema } from "#layers/base/schemas/auth.schemas";

definePageMeta({ layout: false, middleware: "guest", path: "/reset-password" });

const layoutName = useModuleLayout();

const authStore = useAuthStore();
const route = useRoute();
const { serverError, successMessage, clearErrors } = useAuthForm();

// Guard — if reset_token is missing the user got here without verifying OTP
// if (!authStore.resetToken) await navigateTo("/forgot-password");

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(ResetPasswordSchema),
});
const [password, passwordAttrs] = defineField("password");
const [passwordConfirmation, passwordConfirmationAttrs] = defineField(
  "passwordConfirmation",
);

const onSubmit = handleSubmit(async (values) => {
  clearErrors();
  try {
    await authStore.resetPassword({
      email: route.query.email as string, // passed through query from /forgot-password → /verify-otp → here
      resetToken: authStore.resetToken!, // guaranteed non-null by the guard above
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    });
    successMessage.value = "Password reset. Redirecting to Login…";
    setTimeout(() => navigateTo("/login"), 1500);
  }
  catch {
    serverError.value = authStore.error || "Reset token is invalid or expired";
  }
});
</script>

<template>
  <NuxtLayout :name="layoutName">
    <AuthCard heading="Set a new password">
      <form
        class="space-y-4"
        @submit="onSubmit"
      >
        <AuthPasswordField
          v-model="password"
          v-bind="passwordAttrs"
          label="New password"
          :error="errors.password"
        />

        <AuthPasswordField
          v-model="passwordConfirmation"
          v-bind="passwordConfirmationAttrs"
          label="Confirm new password"
          :error="errors.passwordConfirmation"
        />

        <AuthFeedback
          :error="serverError"
          :success="successMessage"
        />

        <AuthSubmitButton
          :loading="authStore.loading"
          label="Reset password"
          loading-label="Resetting…"
        />
      </form>
    </AuthCard>
  </NuxtLayout>
</template>
