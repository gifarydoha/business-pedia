<script setup lang="ts">
import { useForm } from "vee-validate";
// zodSchema auto-imported from utils/zodSchema.ts
import { RegisterSchema } from "~/schemas/auth.schemas";

definePageMeta({ middleware: "guest", path: "/register" });

const authStore = useAuthStore();
const { renderButton } = useGoogleAuth();
const { serverError, clearErrors } = useAuthForm();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(RegisterSchema),
});
const [name, nameAttrs] = defineField("name");
const [phone, phoneAttrs] = defineField("phone");
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");
const [passwordConfirmation, passwordConfirmationAttrs] = defineField(
  "passwordConfirmation",
);

const googleBtnRef = ref<HTMLElement | null>(null);

const onSubmit = handleSubmit(async (values) => {
  clearErrors();
  try {
    await authStore.register(values);
    // No tokens returned from register — go to OTP verification
    await navigateTo(
      `/verify-otp?purpose=register&email=${encodeURIComponent(values.email)}`,
    );
  }
  catch {
    serverError.value = authStore.error || "Registration failed";
  }
});

async function handleGoogleCredential(idToken: string) {
  clearErrors();
  try {
    await authStore.loginWithGoogle({ idToken });
    await navigateTo("/dashboard");
  }
  catch {
    // Backend returns an error if this email is already registered via password
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
    subtitle="New to Autofy Solutions? Create an account!"
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
        :error="errors.name"
      />

      <AuthFormField
        v-model="phone"
        v-bind="phoneAttrs"
        label="Phone number"
        type="tel"
        :error="errors.phone"
      />

      <AuthFormField
        v-model="email"
        v-bind="emailAttrs"
        label="Email"
        type="email"
        :error="errors.email"
      />

      <AuthPasswordField
        v-model="password"
        v-bind="passwordAttrs"
        label="Password"
        :error="errors.password"
      />

      <AuthPasswordField
        v-model="passwordConfirmation"
        v-bind="passwordConfirmationAttrs"
        label="Confirm password"
        :error="errors.passwordConfirmation"
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
