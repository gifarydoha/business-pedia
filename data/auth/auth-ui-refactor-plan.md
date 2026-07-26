# Auth UI Refactor Plan

Reduce repetitive UI code across the 5 auth pages (`login`, `register`, `forgot-password`, `verify-otp`, `reset-password`) by extracting shared shell, field atoms, and a server-feedback composable — without changing any business logic.

---

## What is Repeated (and Where)

| Repeated Pattern | Files |
|---|---|
| Full-page centering shell (`flex min-h-screen items-center justify-center bg-fy-teal-50 px-4 py-12`) | All 5 pages |
| Card wrapper (`w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm sm:p-8`) | All 5 pages |
| Heading + subtitle block | All 5 pages |
| Google button + "or" divider | `login`, `register` |
| `<label>` + `<input>` + `<p v-if="errors.field">` field group | All 5 pages (every field) |
| Password input with eye-toggle button (show/hide) | `login`, `register`, `reset-password` (×2) |
| `serverError` ref + `<p v-if="serverError">` | All 5 pages |
| `successMessage` ref + `<p v-if="successMessage">` | `verify-otp`, `reset-password` |
| Submit button with `authStore.loading` disabled state | All 5 pages |

---

## Proposed File Structure

```
app/
  components/
    auth/
      AuthCard.vue           ← page shell + card wrapper
      AuthFormField.vue      ← label + input + error message
      AuthPasswordField.vue  ← label + password input + eye toggle + error message
      AuthSubmitButton.vue   ← submit button with loading/label prop
      AuthFeedback.vue       ← serverError + successMessage display
      AuthDivider.vue        ← the "or" horizontal rule with text

  composables/
    useAuthForm.ts           ← shared serverError / successMessage state + reset helper
```

Pages continue to live at `app/pages/(auth)/`. The auth layout (`app/layouts/auth.vue`) already exists but is **not being used** by any of these pages — they each inline the full shell. Using the layout is part of this plan.

---

## Proposed Changes

### 1. `AuthCard.vue` — Page shell + card wrapper

**[NEW]** `app/components/auth/AuthCard.vue`

Wraps the content in the full-page centering div and the white card.
Accepts props for `heading` and optional `subtitle`.

Replaces this in every page:
```vue
<div class="flex min-h-screen items-center justify-center bg-fy-teal-50 px-4 py-12">
  <div class="w-full max-w-md rounded-2xl border border-fy-teal-50 bg-white p-6 shadow-sm sm:p-8">
    <h1 class="mb-1 font-poppins text-xl font-semibold text-fy-sage-900 sm:text-2xl">...</h1>
    <p class="mb-6 font-lora text-sm text-slate-500">...</p>
    ...
  </div>
</div>
```

Props:
```ts
defineProps<{
  heading: string
  subtitle?: string
  centered?: boolean  // for verify-otp which uses text-center on the card
}>()
```

---

### 2. `AuthFormField.vue` — Generic text/email/tel field

**[NEW]** `app/components/auth/AuthFormField.vue`

Wraps the repeating label → input → error pattern for non-password fields.

Replaces ~10 lines per field across all pages:
```vue
<div>
  <label class="mb-1 block font-poppins text-sm font-medium text-fy-sage-900">Email</label>
  <input v-bind="emailAttrs" v-model="email" type="email" class="w-full rounded-lg ..." >
  <p v-if="errors.email" class="mt-1 font-lora text-xs text-red-500">{{ errors.email }}</p>
</div>
```

Props:
```ts
defineProps<{
  label: string
  type?: string        // 'text' | 'email' | 'tel' — default 'text'
  error?: string
  // extra attrs (v-bind from vee-validate) passed via $attrs
}>()
// Value via defineModel()
```

---

### 3. `AuthPasswordField.vue` — Password field with eye toggle

**[NEW]** `app/components/auth/AuthPasswordField.vue`

The eye-toggle password block is duplicated in `login.vue`, `register.vue` (×2), and `reset-password.vue` (×2) — **5 instances** of the same ~15-line block.

Replaces in every page:
```vue
<div class="relative">
  <input :type="show ? 'text' : 'password'" ... >
  <button type="button" @click="show = !show">
    <Icon :name="show ? 'lucide:eye-off' : 'lucide:eye'" class="size-5 text-fy-sage-950" />
  </button>
</div>
```

Props:
```ts
defineProps<{
  label: string
  error?: string
}>()
// Internal `show` state managed inside the component
// Value via defineModel(), attrs forwarded via v-bind="$attrs"
```

---

### 4. `AuthSubmitButton.vue` — Loading-aware submit button

**[NEW]** `app/components/auth/AuthSubmitButton.vue`

All 5 pages share the same button style with a loading label swap.

Props:
```ts
defineProps<{
  loading: boolean
  label: string         // e.g. "Log in"
  loadingLabel: string  // e.g. "Logging in…"
}>()
```

---

### 5. `AuthFeedback.vue` — Server error / success message

**[NEW]** `app/components/auth/AuthFeedback.vue`

Renders the `serverError` and `successMessage` paragraphs.

Props:
```ts
defineProps<{
  error?: string
  success?: string
}>()
```

---

### 6. `AuthDivider.vue` — "or" divider

**[NEW]** `app/components/auth/AuthDivider.vue`

Used in `login.vue` and `register.vue` between the Google button and the form.

```vue
<div class="my-6 flex items-center gap-3">
  <div class="h-px flex-1 bg-slate-200" />
  <span class="font-poppins text-xs tracking-wide text-slate-400 uppercase">or</span>
  <div class="h-px flex-1 bg-slate-200" />
</div>
```

No props needed.

---

### 7. `useAuthForm.ts` — Shared serverError / successMessage composable

**[NEW]** `app/composables/useAuthForm.ts`

All pages declare these refs identically. Extract into a composable:

```ts
export function useAuthForm() {
  const serverError = ref('')
  const successMessage = ref('')
  function clearErrors() { serverError.value = ''; successMessage.value = '' }
  return { serverError, successMessage, clearErrors }
}
```

---

### 8. Update auth pages — use the new components

**[MODIFY]** All 5 pages in `app/pages/(auth)/`

After the refactor, each page's template becomes a thin composition:

```vue
<!-- login.vue (template) — after refactor -->
<template>
  <AuthCard heading="Welcome back" subtitle="Sign in to continue your journey">
    <div ref="googleBtnRef" class="mb-4 w-full" />
    <AuthDivider />
    <form class="space-y-4" @submit="onSubmit">
      <AuthFormField label="Email" type="email" v-model="email" v-bind="emailAttrs" :error="errors.email" />
      <AuthPasswordField label="Password" v-model="password" v-bind="passwordAttrs" :error="errors.password" />
      <AuthFeedback :error="serverError" />
      <AuthSubmitButton :loading="authStore.loading" label="Log in" loading-label="Logging in…" />
    </form>
    <p class="mt-6 text-center font-lora text-sm text-slate-500">
      Don't have an account?
      <NuxtLink to="/register" class="font-medium text-fy-teal-300 hover:underline">Sign up</NuxtLink>
    </p>
  </AuthCard>
</template>
```

---

## Line Count Reduction Estimate

| Page | Before | After |
|---|---|---|
| `login.vue` | ~155 lines | ~60 lines |
| `register.vue` | ~235 lines | ~80 lines |
| `forgot-password.vue` | ~92 lines | ~45 lines |
| `verify-otp.vue` | ~166 lines | ~65 lines |
| `reset-password.vue` | ~144 lines | ~55 lines |
| **Total** | **~792 lines** | **~305 lines** |

---

## What Does NOT Change

- All business logic stays in the pages (`handleSubmit`, guards, `navigateTo`, store calls).
- All schemas stay in `~/schemas/auth.schemas.ts`.
- The `auth.ts` store and service layer are untouched.
- Routing and middleware are untouched.

---

## Execution Order

1. `useAuthForm.ts` composable (no dependencies)
2. `AuthDivider.vue` (no dependencies)
3. `AuthFeedback.vue` (no dependencies)
4. `AuthSubmitButton.vue` (no dependencies)
5. `AuthFormField.vue` (needs `defineModel`, test with one page)
6. `AuthPasswordField.vue` (needs `defineModel` + internal `show` ref)
7. `AuthCard.vue` (composes with other atoms if desired)
8. Update all 5 pages
