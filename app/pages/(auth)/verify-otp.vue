<script setup lang="ts">
import { OtpSchema } from "~/schemas/auth.schemas";

const authStore = useAuthStore();
const route = useRoute();

const purpose = computed(
  () => route.query.purpose as "register" | "reset_password",
);
const email = computed(
  () => route.query.email as string,
);

// Guard: purpose and email must be present
if (!purpose.value || !email.value) await navigateTo("/login");

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: zodSchema(OtpSchema),
});

const [otp, otpAttrs] = defineField("otp");

const serverError = ref("");
const successMessage = ref("");

// ── Resend cooldown — local state only, does not need to survive navigation ────
const resendCooldown = ref(0);
let cooldownTimer: ReturnType<typeof setInterval> | null = null;

function startCooldown() {
  resendCooldown.value = 60;
  cooldownTimer = setInterval(() => {
    resendCooldown.value--;
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer);
      cooldownTimer = null;
    }
  }, 1000);
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer);
});

// submit OTP
const onSubmit = handleSubmit(async (values) => {
  serverError.value = "";
  try {
    await authStore.verifyOtp({
      email: email.value,
      otp: values.otp,
      purpose: purpose.value,
    });
    if (purpose.value === "register") {
      successMessage.value = "Email verified! Redirecting to login...";
      setTimeout(() => navigateTo("/login"), 1200);
    }
    else {
      // reset_token is now stored in authStore.resetToken — go to reset-password
      await navigateTo(`/reset-password?email=${encodeURIComponent(email.value)}`);
    }
  }
  catch {
    serverError.value = authStore.error || "Invalid code!";
  }
});

// Resend OTP
async function resend() {
  if (resendCooldown.value > 0) return;
  serverError.value = "";
  try {
    await authStore.resendOtp({ email: email.value, purpose: purpose.value });
    successMessage.value = "New code sent!";
    startCooldown();
  }
  catch {
    serverError.value
      = authStore.error || "Could not resend. Try again shortly.";
  }
}

const headingText = computed(() =>
  purpose.value === "register" ? "Verify your email" : "Enter reset code",
);
</script>

<template>
  <div
    class="flex min-h-screen items-center justify-center bg-fy-teal-50 px-4 py-12"
  >
    <div
      class="w-full max-w-md rounded-2xl border border-fy-teal-50 bg-white p-6 text-center shadow-sm sm:p-8"
    >
      <h1
        class="mb-2 font-poppins text-xl font-semibold text-fy-sage-900 sm:text-2xl"
      >
        {{ headingText }}
      </h1>
      <p class="mb-6 font-lora text-sm text-slate-500">
        We sent a 6-digit code to
        <span class="font-medium text-fy-sage-900">{{ email }}</span>
      </p>

      <form
        class="space-y-4 text-left"
        @submit="onSubmit"
      >
        <div>
          <label
            class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900"
          >6-digit code</label>
          <input
            v-bind="otpAttrs"
            v-model="otp"
            type="text"
            maxlength="6"
            autocomplete="one-time-code"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-center font-lora text-sm tracking-widest focus:ring-2 focus:ring-fy-teal-300 focus:outline-none"
          >
          <p
            v-if="errors.otp"
            class="mt-1 font-lora text-xs text-red-500"
          >
            {{ errors.otp }}
          </p>
        </div>

        <p
          v-if="successMessage"
          class="text-center font-lora text-sm text-fy-teal-300"
        >
          {{ successMessage }}
        </p>
        <p
          v-if="serverError"
          class="text-center font-lora text-sm text-red-600"
        >
          {{ serverError }}
        </p>

        <button
          type="submit"
          :disabled="authStore.loading"
          class="w-full rounded-lg bg-fy-orange-300 px-6 py-2.5 font-poppins text-sm font-medium text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {{ authStore.loading ? "Verifying…" : "Verify code" }}
        </button>
      </form>

      <p class="mt-6 font-lora text-sm text-slate-500">
        Didn't receive it?
        <button
          :disabled="resendCooldown > 0"
          class="font-medium text-fy-sky-500 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
          @click="resend"
        >
          {{
            resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend code"
          }}
        </button>
      </p>
    </div>
  </div>
</template>
