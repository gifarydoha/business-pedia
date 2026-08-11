<script setup lang="ts">
import { useForm } from "vee-validate";
// zodSchema auto-imported from utils/zodSchema.ts
import { QuickRegisterSchema } from "~~/layers/base/schemas/auth.schemas";

definePageMeta({ layout: "conference", middleware: "guest", path: "/quick-register" });

const authStore = useAuthStore();
const { serverError, clearErrors } = useAuthForm();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(QuickRegisterSchema),
});
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [contactNumber, contactNumberAttrs] = defineField("contact_number");
const [username, usernameAttrs] = defineField("username");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirm_password");

const onSubmit = handleSubmit(async (values) => {
  clearErrors();
  try {
    await authStore.quickRegister(values);
    await navigateTo("/profile");
  }
  catch {
    serverError.value = authStore.error || "Quick registration failed";
  }
});
</script>

<template>
  <AuthCard
    heading="Quick Account Setup"
    subtitle="Get started instantly — no verification required"
  >
    <form
      class="space-y-4"
      @submit="onSubmit"
    >
      <AuthFormField
        v-model="name"
        v-bind="nameAttrs"
        label="Full name"
        :error="errors.name"
      />

      <AuthFormField
        v-model="email"
        v-bind="emailAttrs"
        label="Email"
        type="email"
        :error="errors.email"
      />

      <AuthFormField
        v-model="contactNumber"
        v-bind="contactNumberAttrs"
        label="Contact number"
        type="tel"
        :error="errors.contact_number"
      />

      <AuthFormField
        v-model="username"
        v-bind="usernameAttrs"
        label="Username"
        :error="errors.username"
      />

      <AuthPasswordField
        v-model="password"
        v-bind="passwordAttrs"
        label="Password"
        :error="errors.password"
      />

      <AuthPasswordField
        v-model="confirmPassword"
        v-bind="confirmPasswordAttrs"
        label="Confirm password"
        :error="errors.confirm_password"
      />

      <AuthFeedback :error="serverError" />

      <AuthSubmitButton
        :loading="authStore.loading"
        label="Create account"
        loading-label="Creating account…"
      />
    </form>

    <p class="mt-6 text-center font-lora text-sm text-slate-500">
      Already have an account?
      <NuxtLink
        to="/login"
        class="font-medium text-fy-teal-300 hover:underline"
      >
        Login
      </NuxtLink>
    </p>
  </AuthCard>
</template>
