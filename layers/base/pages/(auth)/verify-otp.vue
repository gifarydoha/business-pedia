<script setup lang="ts">
import { OtpSchema } from "~/schemas/auth.schemas";

definePageMeta({ layout: false, middleware: "guest", path: "/verify-otp" });

const layoutName = useModuleLayout();

const authStore = useAuthStore();
const route = useRoute();
const { serverError, successMessage, clearErrors } = useAuthForm();

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
  clearErrors();
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
  clearErrors();
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
  <NuxtLayout :name="layoutName">
    <AuthCard
      :heading="headingText"
      centered
    >
      <p class="mb-6 font-lora text-sm text-slate-500">
        We sent a 6-digit code to
        <span class="font-medium text-fy-sage-900">{{ email }}</span>
      </p>

      <form
        class="space-y-4 text-left"
        @submit="onSubmit"
      >
        <AuthFormField
          v-model="otp"
          v-bind="otpAttrs"
          label="6-digit code"
          type="text"
          maxlength="6"
          autocomplete="one-time-code"
          :error="errors.otp"
          class="text-center tracking-widest"
        />

        <AuthFeedback
          :error="serverError"
          :success="successMessage"
        />

        <AuthSubmitButton
          :loading="authStore.loading"
          label="Verify code"
          loading-label="Verifying…"
        />
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
    </AuthCard>
  </NuxtLayout>
</template>
