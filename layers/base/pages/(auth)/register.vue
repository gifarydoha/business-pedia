<script setup lang="ts">
import { useForm } from "vee-validate";
// zodSchema auto-imported from utils/zodSchema.ts
import { QuickRegisterSchema } from "~~/layers/base/schemas/auth.schemas";
import { useUserPaper } from "~~/layers/conference/composables/useUserPaper";

definePageMeta({ layout: "conference", middleware: "guest", path: "/register" });

const authStore = useAuthStore();
const { renderButton } = useGoogleAuth();
const route = useRoute();
const { serverError, clearErrors } = useAuthForm();
const { hasSubmittedPaper, refresh: refreshUserPaper } = useUserPaper();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(QuickRegisterSchema),
});
const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [contactNumber, contactNumberAttrs] = defineField("contact_number");
const [password, passwordAttrs] = defineField("password");
const [confirmPassword, confirmPasswordAttrs] = defineField("confirm_password");

const googleBtnRef = ref<HTMLElement | null>(null);

const onSubmit = handleSubmit(async (values) => {
  clearErrors();
  try {
    await authStore.quickRegister(values);
    await navigateTo("/submit-paper/draft");
  }
  catch {
    serverError.value = authStore.error || "Registration failed";
  }
});

async function handleGoogleCredential(idToken: string) {
  clearErrors();
  try {
    await authStore.loginWithGoogle({ idToken });
    await refreshUserPaper();
    const redirectTo = (route.query.redirect as string) || (hasSubmittedPaper.value ? "/profile" : "/submit-paper/draft");
    await navigateTo(redirectTo);
  }
  catch {
    serverError.value = authStore.error || "Google sign-in failed";
  }
}

onMounted(() => {
  if (googleBtnRef.value)
    renderButton(googleBtnRef.value, handleGoogleCredential);
});
</script>

<template>
  <AuthCard
    heading="Create your account"
    subtitle="Create an account, to start your journey!"
  >
    <div
      ref="googleBtnRef"
      class="mb-4 w-full"
    />

    <AuthDivider />
    <form
      class="space-y-4"
      @submit="onSubmit"
    >
      <AuthFormField
        v-model="name"
        v-bind="nameAttrs"
        label="Full name"
        required
        :error="errors.name"
      />

      <AuthFormField
        v-model="email"
        v-bind="emailAttrs"
        label="Email"
        type="email"
        required
        :error="errors.email"
      />

      <AuthFormField
        v-model="contactNumber"
        v-bind="contactNumberAttrs"
        label="Contact number"
        type="tel"
        :error="errors.contact_number"
      />

      <AuthPasswordField
        v-model="password"
        v-bind="passwordAttrs"
        label="Password"
        required
        :error="errors.password"
      />

      <AuthPasswordField
        v-model="confirmPassword"
        v-bind="confirmPasswordAttrs"
        label="Confirm password"
        required
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
