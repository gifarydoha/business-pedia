<script setup lang="ts">
import { useForm } from "vee-validate";
import { ChangePasswordSchema } from "~~/layers/base/schemas/auth.schemas";

definePageMeta({ layout: "conference-dashboard", middleware: ["auth"] });

// const config = useRuntimeConfig();

// if (import.meta.client) {
//   if (config.public.appName === "SBAC Conference") {
//     setPageLayout("conference");
//   }
//   else {
//     setPageLayout("default");
//   }
// }

const authStore = useAuthStore();
const { serverError, successMessage, clearErrors } = useAuthForm();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(ChangePasswordSchema),
});

const [previousPassword, previousPasswordAttrs] = defineField("previous_password");
const [password, passwordAttrs] = defineField("password");
const [passwordConfirmation, passwordConfirmationAttrs] = defineField("password_confirmation");

const onSubmit = handleSubmit(async (values) => {
  clearErrors();
  try {
    await authStore.changePassword({
      previous_password: values.previous_password,
      password: values.password,
      password_confirmation: values.password_confirmation,
    });
    successMessage.value = "Password changed successfully. Redirecting to Profile…";
    setTimeout(() => navigateTo("/profile"), 1500);
  }
  catch {
    serverError.value = authStore.error || "Could not change password";
  }
});
</script>

<template>
  <AuthCard heading="Change Password">
    <form
      class="space-y-4"
      @submit="onSubmit"
    >
      <AuthPasswordField
        v-model="previousPassword"
        v-bind="previousPasswordAttrs"
        label="Previous Password"
        :error="errors.previous_password"
      />

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

      <AuthSubmitButton
        :loading="authStore.loading"
        label="Change password"
        loading-label="Updating…"
      />
    </form>
  </AuthCard>
</template>
