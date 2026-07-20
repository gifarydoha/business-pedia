<!-- app/pages/register.vue -->
<script setup lang="ts">
definePageMeta({
  layout: "auth",
  middleware: ["guest"],
});

useSeoMeta({ title: "Register" });

const authStore = useAuthStore();
const uiStore = useUiStore();

const name = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMsg = ref("");

async function handleRegister() {
  if (!name.value || !email.value || !password.value) {
    errorMsg.value = "Please fill in all fields";
    return;
  }

  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match";
    return;
  }

  loading.value = true;
  errorMsg.value = "";

  try {
    await authStore.register({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    uiStore.showToast("success", "Registration successful! Please log in.");
    navigateTo("/login");
  }
  catch (e: unknown) {
    errorMsg.value = (e as Error).message || "Registration failed. Please try again.";
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
        Create an Account
      </h1>
      <p class="mt-2 text-gray-500">
        Join our platform today
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
      class="space-y-4"
      @submit.prevent="handleRegister"
    >
      <UFormGroup label="Full Name">
        <UInput
          v-model="name"
          type="text"
          placeholder="John Doe"
          icon="i-heroicons-user"
          size="lg"
        />
      </UFormGroup>

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
        <UInput
          v-model="password"
          type="password"
          placeholder="••••••••"
          icon="i-heroicons-lock-closed"
          size="lg"
        />
      </UFormGroup>

      <UFormGroup label="Confirm Password">
        <UInput
          v-model="confirmPassword"
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
        class="btn-brand-primary mt-6"
        :loading="loading"
      >
        Create Account
      </UButton>
    </form>

    <div class="mt-8 border-t border-gray-100 pt-6 text-center text-sm text-gray-500">
      Already have an account?
      <NuxtLink
        to="/login"
        class="text-brand-primary font-medium hover:underline"
      >Sign in</NuxtLink>
    </div>
  </div>
</template>
