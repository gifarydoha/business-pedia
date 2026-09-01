<script setup lang="ts">
import { useForm } from "vee-validate";
import { LoginSchema } from "~~/layers/base/schemas/auth.schemas";
// useUserPaper is auto-imported: conference layer uses the real implementation,
// other layers fall back to the base stub (layers/base/composables/useUserPaper.ts).
// zodSchema auto-imported from utils/zodSchema.ts

definePageMeta({ layout: false, middleware: "guest", path: "/login" });

const layoutName = useModuleLayout();

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
const { renderButton } = useGoogleAuth();
const route = useRoute();
const { serverError, clearErrors } = useAuthForm();
const { refresh: refreshUserPaper } = useUserPaper();

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(LoginSchema),
});
const [email, emailAttrs] = defineField("email");
const [password, passwordAttrs] = defineField("password");

const googleBtnRef = ref<HTMLElement | null>(null);

const onSubmit = handleSubmit(async (values) => {
  // console.log(values);
  clearErrors();
  try {
    await authStore.login(values);
    await refreshUserPaper();
    const redirectTo = (route.query.redirect as string) || "/my-papers";
    await navigateTo(redirectTo);
  }
  catch {
    serverError.value = authStore.error || "Login failed";
  }
});

async function handleGoogleCredential(idToken: string) {
  clearErrors();
  try {
    await authStore.loginWithGoogle({ idToken });
    await refreshUserPaper();

    let redirectTo = route.query.redirect as string;
    if (!redirectTo) {
      if (!authStore.user?.phone) {
        redirectTo = "/profile/edit";
      }
      else {
        redirectTo = "/my-papers";
      }
    }
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
  <NuxtLayout :name="layoutName">
    <AuthCard
      heading="Welcome back"
      subtitle="Login to continue your journey"
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

        <div class="flex justify-end">
          <NuxtLink
            to="/forgot-password"
            class="font-poppins text-sm text-fy-sky-500 hover:underline"
          >
            Forgot password?
          </NuxtLink>
        </div>

        <AuthFeedback :error="serverError" />

        <AuthSubmitButton
          :loading="authStore.loading"
          label="Log in"
          loading-label="Logging in…"
        />
      </form>

      <p class="mt-6 text-center font-lora text-sm text-slate-500">
        Don't have an account?
        <NuxtLink
          to="/register"
          class="font-medium text-fy-teal-300 hover:underline"
        >
          Sign up
        </NuxtLink>
      </p>
    </AuthCard>
  </NuxtLayout>
</template>
