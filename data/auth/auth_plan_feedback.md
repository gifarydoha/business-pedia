# Auth Plan Feedback — business-pedia

## Overall Assessment

The plan is **well-architected and production-quality**. The layered abstraction (backend → service → store → UI) is the right call for a team migrating from CodeIgniter to NestJS. The token de-duplication during refresh and the `mapCIResponse` adapter pattern are particularly good ideas.

That said, there are **several conflicts and gaps** between the plan and your actual project that you need to resolve before writing a single line of code.

---

## 🔴 Critical Issues — Fix Before Starting

### 1. Your project uses `@nuxt/ui` v4 — Tailwind v4, not the plan's Tailwind v3 config

**Your `package.json`:**
```json
"@nuxt/ui": "^4.10.0",
"tailwindcss": "^4.3.3"
```

**The plan writes a `tailwind.config.ts`** using the old v3 `theme.extend.colors` and `theme.extend.fontFamily` syntax.  
In Tailwind v4 (used by `@nuxt/ui` v4), all configuration happens in CSS via `@theme` — there is no `tailwind.config.ts`. Writing one will either be ignored or break things.

**What to do instead:**  
- Keep your existing `app/assets/css/main.css` and add the custom tokens there using the v4 `@theme { }` syntax.
- Skip Section 3 (the `tailwind.config.ts` block) entirely.

---

### 2. Your project already has `@nuxt/fonts` — the plan installs `@nuxtjs/google-fonts`

**Your `nuxt.config.ts`** already uses `@nuxt/fonts` (the official modern alternative). The plan's install command `npm install @nuxtjs/google-fonts` would add a duplicate, potentially conflicting package.

**What to do:**  
- Skip `@nuxtjs/google-fonts` from the install command.  
- Use `@nuxt/fonts` to load Poppins + Lora — it's already wired up.

---

### 3. The plan's `nuxt.config.ts` block will **overwrite** your existing config

Section 3 shows a minimal `nuxt.config.ts`. Your actual file has `@nuxt/ui`, `@nuxtjs/i18n`, `@nuxtjs/sitemap`, `@nuxt/fonts`, `@nuxtjs/color-mode`, `compatibilityDate`, ESLint config, etc. Copying the plan's block wholesale would destroy those.

**What to do:**  
- Only **add** to your existing `nuxt.config.ts`:
  - `googleClientId` to your `runtimeConfig.public` block
  - The missing route rules for `/forgot-password`, `/reset-password/**`, `/verify-email`, `/verify-email/**`

---

### 4. `User` type conflict

**The plan defines** `types/auth.ts` with `User.id` as `string`, no `role`, `emailVerified: boolean`.  
**Your existing** `types/user.ts` has `User.id` as `number`, includes `role: UserRole`, and uses `avatar` (not `avatarUrl`).

Your [`middleware/role.ts`](file:///home/doha/Desktop/Work/Projects/business-pedia/app/middleware/role.ts) and [`stores/auth.ts`](file:///home/doha/Desktop/Work/Projects/business-pedia/app/stores/auth.ts) currently depend on `User.role`.

**What to do:**  
- Merge the plan's `User` type into your existing `types/user.ts`. Add `emailVerified`, `avatarUrl`, and keep `role: UserRole`.
- Or create `types/auth.ts` separately but re-export `User` from `types/user.ts` so nothing breaks.

---

### 5. The plan's auth plugin filename is wrong for your use case

**The plan says** `plugins/auth.server.ts` with `defineNuxtPlugin(async () => {...})` and the comment "hydrates auth state on both SSR and client".

**But:** Your auth pages use `ssr: false` (SPA), and tokens are stored in cookies readable by JS — not by the server (they're not `httpOnly`). Running `initAuth()` in a server plugin would call `fetchUser()` on the server, but cookies set client-side may not be available during SSR. Plus, `useAuthTokens()` calls `useCookie()` which works differently on server vs. client.

**What to do:**  
- Rename it `plugins/auth.client.ts` (you already have this file — just update its content).
- This is consistent with your existing client-only auth pattern and avoids SSR hydration mismatches.

---

## 🟡 Important Issues — Address Before Going Live

### 6. Your existing `useApi.ts` is not replaced — the plan introduces `$api` instead

You have [`composables/useApi.ts`](file:///home/doha/Desktop/Work/Projects/business-pedia/app/composables/useApi.ts) that uses `authStore.token` to inject headers. The plan's `plugins/api.ts` provides `$api` via `useNuxtApp().$api`.

These two will co-exist awkwardly. Your existing code that uses `useApi()` won't benefit from the new auto-refresh logic.

**Decision needed:**  
- After implementing the new `plugins/api.ts`, **migrate** `useApi.ts` to use `$api` internally (or deprecate it).
- Don't leave both patterns — it'll confuse future devs.

---

### 7. The existing auth store uses `localStorage` + a single token — full replacement needed

Your current [`stores/auth.ts`](file:///home/doha/Desktop/Work/Projects/business-pedia/app/stores/auth.ts):
- Uses `localStorage` (broken during SSR)
- Has only one `token` (no refresh token)
- Has `restoreFromStorage()` called manually in middleware
- Uses `isLoggedIn` (the plan uses `isAuthenticated`)

The new store fully replaces this. Make sure to:
- Update all call sites that reference `authStore.isLoggedIn` → `authStore.isAuthenticated`
- Update `authStore.token` → handled internally by `useAuthTokens()`
- Remove `restoreFromStorage()` references from both middleware files
- Keep `isAdmin`, `isEditor`, `isAuthor`, `userRole` getters — the plan drops them, but your [`middleware/role.ts`](file:///home/doha/Desktop/Work/Projects/business-pedia/app/middleware/role.ts) needs them

---

### 8. `forgotPassword` response type assumption

In `auth.service.ts`, `forgotPassword` and `resetPassword` call `$api<{ message: string }>` — but your CodeIgniter backend wraps everything in `{ status, message, data }`. The plain `{ message: string }` type is wrong.

**Fix:** Either add a `CISimpleResponse` interface or handle the full wrapper shape.

---

### 9. `verify-email/[token].vue` calls `authStore.verifyEmail()` without `auth` middleware

The `/verify-email/[token]` page (the link-click handler) has no `definePageMeta({ middleware: 'auth' })`. But `verifyEmail()` in the store calls the auth service, which calls `$api` with a Bearer token — meaning a logged-out user clicking the link in their email will get a 401.

This is likely a design decision to make: should verification work without being logged in? If yes, call `$api` without auth for this endpoint, or better, use a raw `$fetch` call in the service.

---

### 10. `initAuth` runs `fetchUser()` on every page load

```ts
// stores/auth.store.ts
async initAuth() {
  if (this.initialized) return   // ← guards against repeat calls
  const { accessToken } = useAuthTokens()
  if (accessToken.value) {
    this.user = await authService.fetchUser()
  }
  this.initialized = true
}
```

`initialized` is in-memory Pinia state. On a **full page reload**, it resets to `false`, so `fetchUser()` fires on every refresh. For a mostly static/ISR site this means every navigation to an authenticated route burns a `GET /auth/me` call.

**Consider:** Storing the user in a cookie or hydrating from the cookie instead of always re-fetching. Or accept this as acceptable given your dashboard is SSR.

---

## 🟢 What the Plan Gets Right (Don't Change These)

| ✅ | Why it's correct |
|----|-----------------|
| `mapCIResponse` adapter pattern | Perfect migration strategy — one function to rewrite when moving to NestJS |
| Refresh token de-duplication with `refreshPromise` | Prevents multiple simultaneous 401s each triggering a refresh race condition |
| `useCookie()` instead of `localStorage` | Works with SSR/ISR unlike `localStorage`, and survives page reloads |
| `guest` middleware redirecting logged-in users | Prevents authenticated users from re-visiting login/register |
| `initialized` flag on the store | Prevents `initAuth()` running multiple times within a navigation session |
| Separate `useAuthTokens` composable | Clean separation — tokens are an infrastructure concern, not business logic |
| `$api` plugin as a Nuxt plugin (not a composable) | Correct — `$fetch.create()` needs to live at plugin level, not inside `setup()` |
| Testing checklist in Section 13 | The unverified email + Google duplicate account items are easily missed — keep this |

---

## 📋 Adjusted Implementation Order

Given the conflicts above, here's a safer sequence for implementing it yourself:

1. **`types/auth.ts`** — Create it, but merge `role: UserRole` into the `User` interface from your existing `types/user.ts`. Don't delete `types/user.ts` yet — update it to re-export from `types/auth.ts`.

2. **`composables/useAuthTokens.ts`** — New file, copy from plan as-is.

3. **`plugins/api.ts`** — New file, copy from plan. This replaces the header-injection role of `useApi.ts`.

4. **`services/auth.service.ts`** — New file. Fix the `forgotPassword`/`resetPassword` response types for your CI wrapper.

5. **`stores/auth.ts`** — Replace the body with the plan's `auth.store.ts` content. **Add back** `userRole`, `isAdmin`, `isEditor`, `isAuthor` getters (needed by `middleware/role.ts`).

6. **`nuxt.config.ts`** — **Only add** `googleClientId` to `runtimeConfig.public` and the missing route rules. Do not replace the whole file.

7. **`middleware/auth.ts`** — Replace with the plan's async version.

8. **`middleware/guest.ts`** — Replace with the plan's async version.

9. **`plugins/auth.client.ts`** — Update existing file to call `authStore.initAuth()` instead of `restoreFromStorage()`. Keep it `.client.ts`, not `.server.ts`.

10. **`composables/useGoogleAuth.ts`** — New file, copy as-is.

11. **Pages** — Create `login.vue`, `register.vue`, `forgot-password.vue`, `reset-password/[token].vue`, `verify-email.vue`, `verify-email/[token].vue`. Use `@nuxt/ui` components where possible instead of raw Tailwind, since you're using `@nuxt/ui` v4.

12. **CSS tokens** — Add custom color/font tokens to `assets/css/main.css` using Tailwind v4 `@theme {}` syntax, not `tailwind.config.ts`.

---

## Open Questions to Resolve With Your Team/Backend

1. **Should `/verify-email/[token]` work for logged-out users?** (Currently broken if they're not logged in)
2. **Does the CI backend invalidate refresh tokens on `POST /auth/logout`?** (Multi-tab logout depends on this)
3. **Does the CI backend invalidate all refresh tokens on password reset?** (Security best practice — needed for Section 13 checklist item)
4. **What does `POST /auth/forgot-password` actually return?** Verify the full CI response shape matches your type.
5. **Will Google sign-in de-duplicate against existing email/password accounts?** The plan notes this risk in the testing checklist.
