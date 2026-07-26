<script setup lang="ts">
import { useForm } from "vee-validate";
// zodSchema auto-imported from utils/zodSchema.ts
import { RegisterSchema } from "~/schemas/auth.schemas";

definePageMeta({ middleware: "guest" });

const authStore = useAuthStore();
const { renderButton } = useGoogleAuth();

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

const serverError = ref("");
const googleBtnRef = ref<HTMLElement | null>(null);
const showPassword = ref(false);
const confirmShowPassword = ref(false);

const onSubmit = handleSubmit(async (values) => {
  // console.log(values);

  serverError.value = "";
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
  serverError.value = "";
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
  <div
    class="flex min-h-screen items-center justify-center bg-fy-teal-50 px-4 py-12"
  >
    <div
      class="w-full max-w-md rounded-2xl border border-fy-teal-50 bg-white p-6 shadow-sm sm:p-8"
    >
      <h1
        class="mb-1 font-poppins text-xl font-semibold text-fy-sage-900 sm:text-2xl"
      >
        Create your account
      </h1>
      <p class="mb-6 font-lora text-sm text-slate-500">
        Mindset. Action. Happiness.
      </p>

      <div
        ref="googleBtnRef"
        class="mb-4 w-full"
      />

      <div class="my-6 flex items-center gap-3">
        <div class="h-px flex-1 bg-slate-200" />
        <span
          class="font-poppins text-xs tracking-wide text-slate-400 uppercase"
        >or</span>
        <div class="h-px flex-1 bg-slate-200" />
      </div>

      <form
        class="space-y-4"
        @submit="onSubmit"
      >
        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >Full name</label>
          <input
            v-bind="nameAttrs"
            v-model="name"
            type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-lora text-sm focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
          >
          <p
            v-if="errors.name"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.name }}
          </p>
        </div>

        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >Phone number</label>
          <input
            v-bind="phoneAttrs"
            v-model="phone"
            type="tel"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-lora text-sm focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
          >
          <p
            v-if="errors.phone"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.phone }}
          </p>
        </div>

        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >Email</label>
          <input
            v-bind="emailAttrs"
            v-model="email"
            type="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 font-lora text-sm focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
          >
          <p
            v-if="errors.email"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.email }}
          </p>
        </div>

        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >Password</label>
          <div class="relative">
            <input
              v-bind="passwordAttrs"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="w-full rounded-lg border border-slate-300 py-2.5 pr-10 pl-3 font-lora text-sm focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
            >
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              @click="showPassword = !showPassword"
            >
              <Icon
                :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
                class="size-5 text-fy-sage-950"
              />
            </button>
          </div>

          <p
            v-if="errors.password"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.password }}
          </p>
        </div>

        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >Confirm password</label>
          <div class="relative">
            <input
              v-bind="passwordConfirmationAttrs"
              v-model="passwordConfirmation"
              :type="confirmShowPassword ? 'text' : 'password'"
              class="w-full rounded-lg border border-slate-300 py-2.5 pr-10 pl-3 font-lora text-sm focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
            >
            <button
              type="button"
              class="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-slate-400 hover:text-slate-600 focus:outline-none"
              @click="confirmShowPassword = !confirmShowPassword"
            >
              <Icon
                :name="confirmShowPassword ? 'lucide:eye-off' : 'lucide:eye'"
                class="size-5 text-fy-sage-950"
              />
            </button>
          </div>
          <p
            v-if="errors.passwordConfirmation"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.passwordConfirmation }}
          </p>
        </div>

        <p
          v-if="serverError"
          class="font-lora text-sm text-red-600"
        >
          {{ serverError }}
        </p>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full rounded-lg bg-fy-orange-300 px-6 py-2.5 font-poppins text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {{ authStore.loading ? "Creating account…" : "Create account" }}
        </button>
      </form>

      <p class="mt-6 text-center font-lora text-sm text-slate-500">
        Already have an account?
        <NuxtLink
          to="/login"
          class="font-medium text-fy-teal-300 hover:underline"
        >Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>
