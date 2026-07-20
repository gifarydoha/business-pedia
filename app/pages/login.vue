<!-- app/pages/login.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

useSeoMeta({ title: "Login" });

const authStore = useAuthStore();
const uiStore = useUiStore();

const email = ref("");
const password = ref("");
const loading = ref(false);
const errorMsg = ref("");

async function handleLogin() {
  if (!email.value || !password.value) {
    errorMsg.value = "Please fill in all fields";
    return;
  }

  loading.value = true;
  errorMsg.value = "";

  try {
    await authStore.login(email.value, password.value);
    uiStore.showToast("success", "Successfully logged in!");
    navigateTo("/dashboard");
  }
  catch (e: unknown) {
    errorMsg.value = (e as Error).message || "Invalid credentials. Please try again.";
  }
  finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="p-8">
    <div class="mb-8 text-center">
      <h1 class="text-2xl font-bold text-gray-900">
        Welcome Back
      </h1>
      <p class="mt-2 text-gray-500">
        Sign in to your account to continue
      </p>
    </div>

    <UAlert
      v-if="errorMsg"
      color="error"
      variant="soft"
      icon="i-heroicons-exclamation-triangle"
      class="mb-6"
    >
      <template #description>
        {{ errorMsg }}
      </template>
    </UAlert>

    <form
      class="space-y-5"
      @submit.prevent="handleLogin"
    >
      <UFormGroup label="Email Address">
        <UInput
          v-model="email"
          type="email"
          placeholder="you@example.com"
          icon="i-heroicons-envelope"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Password">
        <template #hint>
          <NuxtLink
            to="/forgot-password"
            class="text-brand-primary text-sm hover:underline"
          >Forgot password?</NuxtLink>
        </template>
        <UInput
          v-model="password"
          type="password"
          placeholder="••••••••"
          icon="i-heroicons-lock-closed"
          size="lg"
        />
      </UFormGroup>

      <UButton
        type="submit"
        block
        size="lg"
        class="btn-brand-primary mt-2"
        :loading="loading"
      >
        Sign In
      </UButton>
    </form>

    <div class="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
      Don't have an account?
      <NuxtLink
        to="/register"
        class="text-brand-primary font-medium hover:underline"
      >Register here</NuxtLink>
    </div>
  </div>
</template>
