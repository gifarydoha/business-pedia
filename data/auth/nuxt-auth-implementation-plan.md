# Nuxt 3 Auth System — Implementation Plan
### Business-Pedia — CodeIgniter (now) → NestJS (6–8 months)

Stack: Nuxt 4 + TypeScript + Tailwind CSS v4 (@nuxt/ui v4) + Pinia + Valibot (via @vee-validate/nuxt)
Auth: Email/password + Google Sign-In, with access + refresh tokens + OTP verification
Backend: CodeIgniter (JWT in JSON response body), migrating to NestJS later

---

## 1. Why this architecture

**Backend abstraction layer.** CodeIgniter wraps responses like:

```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": { "id": 1, "name": "Doha", "email": "doha@example.com" },
    "access_token": "eyJhbGc...",
    "refresh_token": "eyJhbGc..."
  }
}
```

NestJS typically won't wrap responses this way — it'll likely just return `{ user, accessToken, refreshToken }` directly. If every page/component read `response.data.user.name` directly, migrating would mean hunting down every usage across the codebase.

Instead, all HTTP calls live in one file (`auth.service.ts`) with a single mapper function (`mapCIResponse`) that converts whatever the backend sends into one clean internal shape (`AuthResult`). Every other file — pages, Pinia store, middleware — only ever touches that clean shape. On migration day, you rewrite one function; everything else stays untouched.

**Refresh tokens.** Two tokens instead of one:
- **Access token** — short-lived (15–30 min), sent as `Authorization: Bearer ...` on every API call.
- **Refresh token** — long-lived (7–30 days), used only to silently get a new access token when the old one expires.

If an access token leaks, it's useless within minutes. The refresh token is used far less often, so it's a smaller attack surface. A 401 response triggers an automatic refresh + retry, transparent to the user.

**Token storage.** Both the access token and the refresh token are stored in regular (non-`httpOnly`) cookies via `useCookie()` — readable by JS, works correctly with your mixed SSR/SPA `routeRules`. On first load the user object is hydrated from a `user` cookie (already serialised there at login time) — avoiding a `GET /auth/me` round-trip on every page reload. `initAuth` only calls the network if the user cookie is absent but an access token exists. If you want this hardened later, the real fix is having the backend set an `httpOnly` cookie itself — worth revisiting when you build the NestJS auth endpoints.

**OTP verification flow instead of email links.** Email-link verification requires the user to click a link in a new tab, breaking SPA flow and forcing the backend to mint tokens for an unauthenticated link-click. OTP (one-time code) keeps the user on the same SPA page, works on mobile, and uses one shared `/auth/verify-otp` endpoint differentiated by `purpose`.

---

## 2. Backend endpoints needed (CodeIgniter now, same contract for NestJS later)

### Pre-login endpoints — plain `$fetch`, no Bearer token

| Endpoint | Body | Returns |
|---|---|---|
| `POST /auth/register` | `name, phone, email, password, password_confirmation` | success message only |
| `POST /auth/verify-otp` | `email, otp, purpose ("register" \| "reset_password")` | `register` → success message; `reset_password` → `reset_token` |
| `POST /auth/resend-otp` | `email, purpose` | success message |
| `POST /auth/login` | `email, password` | `user, access_token, refresh_token` |
| `POST /auth/google` | `id_token` | `user, access_token, refresh_token` (verify server-side; de-duplicate by email) |
| `POST /auth/forgot-password` | `email` | success message |
| `POST /auth/reset-password` | `email, reset_token, password, password_confirmation` | success message |

### Authenticated endpoints — `$api` (Bearer token auto-attached + auto-refreshed)

| Endpoint | Body | Returns |
|---|---|---|
| `POST /auth/refresh` | `refresh_token` | new `access_token, refresh_token` |
| `POST /auth/logout` | `refresh_token` | invalidates it server-side |
| `GET /auth/me` | Bearer token | current user |

---

## 3. User flows

### Flow 1 — Registration

```
/register → submit (name, phone, email, password) → backend creates unverified user + emails OTP
    ↓
/verify-otp?purpose=register&email=… → enter 6-digit code → backend verifies (no tokens returned)
    ↓
/login → user signs in manually
    ↓
/dashboard
```

### Flow 2 — Forgot Password

```
/forgot-password → enter email → backend emails OTP
    ↓
/verify-otp?purpose=reset_password&email=… → enter code → backend returns reset_token
    ↓
/reset-password → set new password using reset_token (stored temporarily in Pinia, cleared on submit)
    ↓
/login
```

### Flow 3 — Login (existing user)

```
/login → email + password (or Google) → backend returns user + access_token + refresh_token
    ↓
both tokens stored in cookies, user object stored in user cookie
    ↓
/dashboard
```

---

## 4. Setup

### Install only what's missing

```bash
# @pinia/nuxt and pinia are already in package.json — skip them
# @nuxt/fonts is already installed — do NOT install @nuxtjs/google-fonts
npm install @vee-validate/nuxt valibot --save
```

> **Do NOT run:** `npm install pinia @pinia/nuxt @nuxtjs/google-fonts`
> Pinia is already installed. `@nuxtjs/google-fonts` conflicts with `@nuxt/fonts` which you already use.

### nuxt.config.ts — additive changes only

**Do not replace your existing `nuxt.config.ts`.** Only add the items marked with a comment below:

```typescript
// nuxt.config.ts — ADD only the marked lines to your existing file

export default defineNuxtConfig({
  modules: [
    // ... keep all existing modules ...
    '@vee-validate/nuxt',  // ADD
  ],

  // ADD fonts config block for @nuxt/fonts (already installed)
  fonts: {
    families: [
      { name: 'Poppins', weights: [400, 500, 600, 700] },
      { name: 'Lora', weights: [400, 500, 600] },
    ],
  },

  runtimeConfig: {
    public: {
      // ... keep existing keys: apiBase, kbApiBase, imageBase, appName, apiAccessKey ...
      googleClientId: process.env.NUXT_PUBLIC_GOOGLE_CLIENT_ID || '',  // ADD
    },
  },

  routeRules: {
    // ... keep all existing rules ...
    // ADD the missing auth routes:
    '/forgot-password': { ssr: false },
    '/reset-password': { ssr: false },
    '/verify-otp': { ssr: false },
  },
})
```

### CSS tokens — Tailwind v4 syntax (no tailwind.config.ts)

Your project uses `@nuxt/ui` v4 + Tailwind v4. **There is no `tailwind.config.ts`** in Tailwind v4 — the old v3 config file does nothing. Add custom design tokens to your existing `app/assets/css/main.css` using the v4 `@theme {}` syntax:

```css
/* app/assets/css/main.css — ADD inside or alongside your existing @theme block */
@theme {
  --font-poppins: 'Poppins', sans-serif;
  --font-lora: 'Lora', serif;

  --color-fy-teal-50: #f0f7f5;
  --color-fy-teal-300: #12B793;
  --color-fy-sky-500: #236D86;
  --color-fy-orange-300: #F4701B;
  --color-fy-sage-900: #040706;
  --color-fy-sage-950: #080f0d;
}
```

---

## 5. Types

### `types/user.ts` — update existing file

```typescript
// types/user.ts — update in-place (do not delete this file)
// id is string — CI returns numeric ID; mapper converts it with String()

export type UserRole = 'admin' | 'editor' | 'author' | 'reviewer' | 'reader'

export interface User {
  id: string          // always string — CI returns number, mapper converts it
  name: string
  email: string
  phone?: string      // added for registration
  role: UserRole      // kept — required by middleware/role.ts
  avatar?: string     // kept as 'avatar', not 'avatarUrl'
  emailVerified: boolean
  createdAt: string
}

export interface AuthTokenPayload {
  token: string
  expires_at: string
  user: User
}
```

### `types/auth.ts` — new file

```typescript
// types/auth.ts — new file

import type { User, UserRole } from '~/types/user'

export type { User, UserRole }

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResult {
  user: User
  tokens: AuthTokens
}

export interface LoginPayload {
  email: string
  password: string
}

export interface RegisterPayload {
  name: string
  phone: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface VerifyOtpPayload {
  email: string
  otp: string
  purpose: 'register' | 'reset_password'
}

export interface ResendOtpPayload {
  email: string
  purpose: 'register' | 'reset_password'
}

export interface ForgotPasswordPayload {
  email: string
}

export interface ResetPasswordPayload {
  email: string
  resetToken: string
  password: string
  passwordConfirmation: string
}

export interface GoogleLoginPayload {
  idToken: string
}

// ─── Raw CodeIgniter response shapes ───────────────────────────────────────────
// These are the ONLY interfaces that change on NestJS migration.

export interface CIAuthResponse {
  status: boolean
  message: string
  data: {
    user: {
      id: number
      name: string
      email: string
      phone?: string
      role: UserRole
      avatar?: string
      email_verified: boolean
      created_at: string
    }
    access_token: string
    refresh_token: string
  }
}

export interface CIRefreshResponse {
  status: boolean
  data: {
    access_token: string
    refresh_token: string
  }
}

// Simple CI response — used for endpoints that only return a status + message
export interface CISimpleResponse {
  status: boolean
  message: string
}

// OTP verify for reset_password purpose returns a reset_token inside data
export interface CIVerifyOtpResponse {
  status: boolean
  message: string
  data?: {
    reset_token?: string
  }
}

export interface CIMeResponse {
  status: boolean
  data: {
    user: CIAuthResponse['data']['user']
  }
}
```

---

## 6. Token storage composable

```typescript
// composables/useAuthTokens.ts — new file

const ACCESS_COOKIE = 'auth_access_token'
const REFRESH_COOKIE = 'auth_refresh_token'
const USER_COOKIE = 'auth_user'

export function useAuthTokens() {
  const accessToken = useCookie<string | null>(ACCESS_COOKIE, {
    maxAge: 60 * 30,           // 30 min — matches access token lifetime
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    default: () => null,
  })

  const refreshToken = useCookie<string | null>(REFRESH_COOKIE, {
    maxAge: 60 * 60 * 24 * 30, // 30 days — matches refresh token lifetime
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    default: () => null,
  })

  // Stores the serialised User object — lets initAuth() hydrate without a network call on reload
  const userCookie = useCookie<string | null>(USER_COOKIE, {
    maxAge: 60 * 60 * 24 * 30,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    default: () => null,
  })

  function setTokens(tokens: { accessToken: string; refreshToken: string }) {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
  }

  function clearTokens() {
    accessToken.value = null
    refreshToken.value = null
    userCookie.value = null
  }

  return { accessToken, refreshToken, userCookie, setTokens, clearTokens }
}
```

---

## 7. API plugin with auto-refresh on 401 — `plugins/api.ts`

> **This replaces `composables/useApi.ts` entirely.** `useApi.ts` is deleted.
> All authenticated API calls use `$api` from this plugin.
> Pre-login calls (register, verify-otp, resend-otp, forgot-password, reset-password) use plain
> `$fetch` directly — no Bearer token needed, so they should not go through this plugin.

```typescript
// plugins/api.ts — new file
import type { CIRefreshResponse } from '~/types/auth'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  let refreshPromise: Promise<string | null> | null = null

  async function performRefresh(): Promise<string | null> {
    const { refreshToken, setTokens, clearTokens } = useAuthTokens()
    if (!refreshToken.value) return null

    try {
      const res = await $fetch<CIRefreshResponse>('/auth/refresh', {
        baseURL: config.public.apiBase,
        method: 'POST',
        body: { refresh_token: refreshToken.value },
      })
      setTokens({
        accessToken: res.data.access_token,
        refreshToken: res.data.refresh_token,
      })
      return res.data.access_token
    }
    catch {
      clearTokens()
      return null
    }
  }

  const api = $fetch.create({
    baseURL: config.public.apiBase,
    onRequest({ options }) {
      const { accessToken } = useAuthTokens()
      if (accessToken.value) {
        options.headers = {
          ...options.headers,
          Authorization: `Bearer ${accessToken.value}`,
        }
      }
    },
    async onResponseError({ response, request, options }) {
      if (response.status !== 401) return

      // De-dupe: if multiple requests 401 at once, only one refresh fires
      if (!refreshPromise) {
        refreshPromise = performRefresh().finally(() => {
          refreshPromise = null
        })
      }
      const newAccessToken = await refreshPromise

      if (newAccessToken) {
        // Retry the original request once with the fresh token
        return $fetch(request, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${newAccessToken}` },
        })
      }
      else {
        await navigateTo('/login')
      }
    },
  })

  return { provide: { api } }
})
```

---

## 8. Auth service (backend-agnostic layer)

> Pre-login endpoints use plain `$fetch` — no Bearer token attached, no auto-refresh logic.
> Authenticated endpoints use `$api` (injected by the plugin above).

```typescript
// services/auth.service.ts — new file
import type {
  AuthResult,
  CIAuthResponse,
  CISimpleResponse,
  CIVerifyOtpResponse,
  CIMeResponse,
  LoginPayload,
  RegisterPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  GoogleLoginPayload,
} from '~/types/auth'
import type { User } from '~/types/user'

function mapCIResponse(res: CIAuthResponse): AuthResult {
  return {
    user: {
      id: String(res.data.user.id),
      name: res.data.user.name,
      email: res.data.user.email,
      phone: res.data.user.phone,
      role: res.data.user.role,
      avatar: res.data.user.avatar,
      emailVerified: res.data.user.email_verified,
      createdAt: res.data.user.created_at,
    },
    tokens: {
      accessToken: res.data.access_token,
      refreshToken: res.data.refresh_token,
    },
  }
}

function mapCIUser(raw: CIAuthResponse['data']['user']): User {
  return {
    id: String(raw.id),
    name: raw.name,
    email: raw.email,
    phone: raw.phone,
    role: raw.role,
    avatar: raw.avatar,
    emailVerified: raw.email_verified,
    createdAt: raw.created_at,
  }
}

export function useAuthService() {
  const { $api } = useNuxtApp()
  const config = useRuntimeConfig()
  const base = config.public.apiBase

  // ── Pre-login — plain $fetch (no Bearer token) ──────────────────────────────

  async function register(payload: RegisterPayload): Promise<CISimpleResponse> {
    return $fetch<CISimpleResponse>('/auth/register', {
      baseURL: base,
      method: 'POST',
      body: {
        name: payload.name,
        phone: payload.phone,
        email: payload.email,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      },
    })
  }

  async function verifyOtp(payload: VerifyOtpPayload): Promise<CIVerifyOtpResponse> {
    // Plain $fetch — user is not logged in yet; no Bearer token should be attached.
    // This is a door that is meant to always be open — no lock installed.
    return $fetch<CIVerifyOtpResponse>('/auth/verify-otp', {
      baseURL: base,
      method: 'POST',
      body: {
        email: payload.email,
        otp: payload.otp,
        purpose: payload.purpose,
      },
    })
  }

  async function resendOtp(payload: ResendOtpPayload): Promise<CISimpleResponse> {
    return $fetch<CISimpleResponse>('/auth/resend-otp', {
      baseURL: base,
      method: 'POST',
      body: { email: payload.email, purpose: payload.purpose },
    })
  }

  async function forgotPassword(payload: ForgotPasswordPayload): Promise<CISimpleResponse> {
    return $fetch<CISimpleResponse>('/auth/forgot-password', {
      baseURL: base,
      method: 'POST',
      body: { email: payload.email },
    })
  }

  async function resetPassword(payload: ResetPasswordPayload): Promise<CISimpleResponse> {
    return $fetch<CISimpleResponse>('/auth/reset-password', {
      baseURL: base,
      method: 'POST',
      body: {
        email: payload.email,
        reset_token: payload.resetToken,
        password: payload.password,
        password_confirmation: payload.passwordConfirmation,
      },
    })
  }

  // ── Authenticated — $api (Bearer token auto-attached + auto-refreshed) ───────

  async function login(payload: LoginPayload): Promise<AuthResult> {
    // login itself doesn't need a token, but it's safe to use $fetch here too
    const res = await $fetch<CIAuthResponse>('/auth/login', {
      baseURL: base,
      method: 'POST',
      body: payload,
    })
    return mapCIResponse(res)
  }

  async function loginWithGoogle(payload: GoogleLoginPayload): Promise<AuthResult> {
    const res = await $fetch<CIAuthResponse>('/auth/google', {
      baseURL: base,
      method: 'POST',
      body: { id_token: payload.idToken },
    })
    return mapCIResponse(res)
  }

  async function fetchUser(): Promise<User> {
    const res = await ($api as typeof $fetch)<CIMeResponse>('/auth/me')
    return mapCIUser(res.data.user)
  }

  async function logout(refreshToken: string): Promise<void> {
    try {
      await ($api as typeof $fetch)('/auth/logout', {
        method: 'POST',
        body: { refresh_token: refreshToken },
      })
    }
    catch {
      // ignore — we clear local tokens regardless
    }
  }

  return {
    register,
    verifyOtp,
    resendOtp,
    forgotPassword,
    resetPassword,
    login,
    loginWithGoogle,
    fetchUser,
    logout,
  }
}
```

---

## 9. Pinia auth store — `stores/auth.ts`

> Fully replaces the current file content.

```typescript
// stores/auth.ts — replaces current content entirely
import { defineStore } from 'pinia'
import type { User } from '~/types/user'
import type {
  CISimpleResponse,
  LoginPayload,
  RegisterPayload,
  GoogleLoginPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from '~/types/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    // Temporary reset_token — held only while user is on /reset-password, cleared on submit
    resetToken: null as string | null,
    loading: false,
    error: null as string | null,
    initialized: false,
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    isEmailVerified: (state) => !!state.user?.emailVerified,
    // Role-based getters — required by middleware/role.ts
    userRole: (state) => state.user?.role ?? null,
    isAdmin: (state) => state.user?.role === 'admin',
    isEditor: (state) => ['admin', 'editor'].includes(state.user?.role ?? ''),
    isAuthor: (state) => ['admin', 'editor', 'author'].includes(state.user?.role ?? ''),
    // Alias kept so middleware/role.ts compiles without change (it checks isLoggedIn)
    isLoggedIn: (state) => !!state.user,
  },

  actions: {
    // ── Pre-login actions (no tokens involved) ─────────────────────────────────

    async register(payload: RegisterPayload) {
      const authService = useAuthService()
      this.loading = true
      this.error = null
      try {
        return await authService.register(payload)
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? 'Registration failed.'
        throw err
      }
      finally { this.loading = false }
    },

    async verifyOtp(payload: VerifyOtpPayload) {
      const authService = useAuthService()
      this.loading = true
      this.error = null
      try {
        const res = await authService.verifyOtp(payload)
        // If purpose === 'reset_password', backend returns a reset_token — store it temporarily
        if (payload.purpose === 'reset_password' && res.data?.reset_token) {
          this.resetToken = res.data.reset_token
        }
        return res
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? 'Invalid or expired code.'
        throw err
      }
      finally { this.loading = false }
    },

    async resendOtp(payload: ResendOtpPayload) {
      const authService = useAuthService()
      this.loading = true
      this.error = null
      try {
        return await authService.resendOtp(payload)
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? 'Could not resend code.'
        throw err
      }
      finally { this.loading = false }
    },

    async forgotPassword(payload: ForgotPasswordPayload) {
      const authService = useAuthService()
      this.loading = true
      this.error = null
      try {
        return await authService.forgotPassword(payload)
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? 'Could not send reset code.'
        throw err
      }
      finally { this.loading = false }
    },

    async resetPassword(payload: ResetPasswordPayload) {
      const authService = useAuthService()
      this.loading = true
      this.error = null
      try {
        const res = await authService.resetPassword(payload)
        this.resetToken = null // clear after use — one-time token
        return res
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? 'Could not reset password.'
        throw err
      }
      finally { this.loading = false }
    },

    // ── Authenticated actions ──────────────────────────────────────────────────

    async login(payload: LoginPayload) {
      const authService = useAuthService()
      const { setTokens, userCookie } = useAuthTokens()
      this.loading = true
      this.error = null
      try {
        const result = await authService.login(payload)
        setTokens(result.tokens)
        this.user = result.user
        // Persist user in cookie — initAuth() can hydrate from here without a network call
        userCookie.value = JSON.stringify(result.user)
        return result
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? 'Login failed. Please check your credentials.'
        throw err
      }
      finally { this.loading = false }
    },

    async loginWithGoogle(payload: GoogleLoginPayload) {
      const authService = useAuthService()
      const { setTokens, userCookie } = useAuthTokens()
      this.loading = true
      this.error = null
      try {
        const result = await authService.loginWithGoogle(payload)
        setTokens(result.tokens)
        this.user = result.user
        userCookie.value = JSON.stringify(result.user)
        return result
      }
      catch (err: unknown) {
        this.error = (err as { data?: CISimpleResponse })?.data?.message ?? 'Google sign-in failed.'
        throw err
      }
      finally { this.loading = false }
    },

    async initAuth() {
      if (this.initialized) return
      const { accessToken, userCookie } = useAuthTokens()

      // Fast path — hydrate from cookie (no network call)
      if (userCookie.value) {
        try {
          this.user = JSON.parse(userCookie.value) as User
        }
        catch { this.user = null }
      }
      // Slow path — cookie missing but access token present: fetch fresh user from server
      else if (accessToken.value) {
        const authService = useAuthService()
        try {
          this.user = await authService.fetchUser()
          userCookie.value = JSON.stringify(this.user)
        }
        catch { this.user = null }
      }

      this.initialized = true
    },

    async logout() {
      const authService = useAuthService()
      const { refreshToken, clearTokens } = useAuthTokens()
      if (refreshToken.value) await authService.logout(refreshToken.value)
      clearTokens()
      this.user = null
      this.initialized = false
      await navigateTo('/login')
    },
  },
})
```

---

## 10. Auth plugin — `plugins/auth.client.ts`

> **Keep the filename `.client.ts`** — tokens are non-`httpOnly` cookies set client-side.
> Running `initAuth()` in a server plugin would cause SSR hydration mismatches.
> This replaces the old `restoreFromStorage()` call.

```typescript
// plugins/auth.client.ts — replaces current content
export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  await authStore.initAuth()
})
```

---

## 11. Middleware

### `middleware/auth.ts` — replaces current content

```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = useAuthStore()
  if (!authStore.initialized) await authStore.initAuth()
  if (!authStore.isAuthenticated) {
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})
```

### `middleware/guest.ts` — replaces current content

```typescript
// middleware/guest.ts
export default defineNuxtRouteMiddleware(async () => {
  const authStore = useAuthStore()
  if (!authStore.initialized) await authStore.initAuth()
  if (authStore.isAuthenticated) return navigateTo('/dashboard')
})
```

### `middleware/role.ts` — one line change

```typescript
// middleware/role.ts — change line 10: isLoggedIn → isAuthenticated
// (isLoggedIn getter is kept as an alias in the store, so this change is optional but canonical)
if (!authStore.isAuthenticated) {
  return navigateTo('/login')
}
```

---

## 12. Form validation — Valibot + VeeValidate

### Why Valibot (not Zod)

Valibot is the recommended schema library for Nuxt — it is far smaller (< 1 KB per schema vs Zod's ~13 KB), tree-shakes unused validators, and `@vee-validate/nuxt` auto-imports everything. `@vee-validate/valibot` bridges the two with zero config.

### Schemas — `schemas/auth.schemas.ts`

```typescript
// schemas/auth.schemas.ts — new file
import * as v from 'valibot'

export const RegisterSchema = v.pipe(
  v.object({
    name: v.pipe(v.string(), v.minLength(2, 'Name must be at least 2 characters')),
    phone: v.pipe(v.string(), v.regex(/^\+?[0-9]{7,15}$/, 'Enter a valid phone number')),
    email: v.pipe(v.string(), v.email('Enter a valid email address')),
    password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters')),
    passwordConfirmation: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['passwordConfirmation']],
      input => input.password === input.passwordConfirmation,
      'Passwords do not match',
    ),
    ['passwordConfirmation'],
  ),
)

export const LoginSchema = v.object({
  email: v.pipe(v.string(), v.email('Enter a valid email address')),
  password: v.pipe(v.string(), v.minLength(1, 'Password is required')),
})

export const ForgotPasswordSchema = v.object({
  email: v.pipe(v.string(), v.email('Enter a valid email address')),
})

export const OtpSchema = v.object({
  otp: v.pipe(v.string(), v.length(6, 'Enter the 6-digit code'), v.regex(/^\d{6}$/, 'Code must be 6 digits')),
})

export const ResetPasswordSchema = v.pipe(
  v.object({
    password: v.pipe(v.string(), v.minLength(8, 'Password must be at least 8 characters')),
    passwordConfirmation: v.string(),
  }),
  v.forward(
    v.partialCheck(
      [['password'], ['passwordConfirmation']],
      input => input.password === input.passwordConfirmation,
      'Passwords do not match',
    ),
    ['passwordConfirmation'],
  ),
)
```

### Usage pattern in pages

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import { LoginSchema } from '~/schemas/auth.schemas'

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(LoginSchema),
})

const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const onSubmit = handleSubmit(async (values) => {
  // values is fully typed as { email: string; password: string }
  await authStore.login(values)
})
</script>

<template>
  <form @submit="onSubmit">
    <input v-bind="emailAttrs" v-model="email" type="email" />
    <p v-if="errors.email">{{ errors.email }}</p>
    <input v-bind="passwordAttrs" v-model="password" type="password" />
    <p v-if="errors.password">{{ errors.password }}</p>
    <button type="submit">Sign in</button>
  </form>
</template>
```

---

## 13. Google Identity Services composable

```typescript
// composables/useGoogleAuth.ts — new file
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: { client_id: string; callback: (r: { credential: string }) => void }) => void
          renderButton: (el: HTMLElement, config: Record<string, unknown>) => void
        }
      }
    }
  }
}

export function useGoogleAuth() {
  const config = useRuntimeConfig()
  const scriptLoaded = ref(false)

  function loadScript(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (window.google?.accounts?.id) {
        scriptLoaded.value = true
        return resolve()
      }
      const script = document.createElement('script')
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.onload = () => { scriptLoaded.value = true; resolve() }
      script.onerror = reject
      document.head.appendChild(script)
    })
  }

  async function renderButton(el: HTMLElement, onCredential: (idToken: string) => void) {
    await loadScript()
    window.google.accounts.id.initialize({
      client_id: config.public.googleClientId,
      callback: (response) => onCredential(response.credential),
    })
    window.google.accounts.id.renderButton(el, {
      theme: 'outline',
      size: 'large',
      width: el.clientWidth,
      text: 'continue_with',
    })
  }

  return { loadScript, renderButton, scriptLoaded }
}
```

---

## 14. Pages

### `pages/login.vue`

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import { LoginSchema } from '~/schemas/auth.schemas'

definePageMeta({ middleware: 'guest' })

const authStore = useAuthStore()
const { renderButton } = useGoogleAuth()
const route = useRoute()

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(LoginSchema),
})
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')

const serverError = ref('')
const googleBtnRef = ref<HTMLElement | null>(null)

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await authStore.login(values)
    await navigateTo((route.query.redirect as string) || '/dashboard')
  }
  catch { serverError.value = authStore.error || 'Login failed' }
})

async function handleGoogleCredential(idToken: string) {
  serverError.value = ''
  try {
    await authStore.loginWithGoogle({ idToken })
    await navigateTo('/dashboard')
  }
  catch { serverError.value = authStore.error || 'Google sign-in failed' }
}

onMounted(() => {
  if (googleBtnRef.value) renderButton(googleBtnRef.value, handleGoogleCredential)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fy-teal-50 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-fy-teal-50 p-6 sm:p-8">
      <h1 class="font-poppins text-xl sm:text-2xl font-semibold text-fy-sage-900 mb-1">Welcome back</h1>
      <p class="font-lora text-sm text-slate-500 mb-6">Sign in to continue your journey</p>

      <div ref="googleBtnRef" class="w-full mb-4" />

      <div class="flex items-center gap-3 my-6">
        <div class="h-px flex-1 bg-slate-200" />
        <span class="font-poppins text-xs text-slate-400 uppercase tracking-wide">or</span>
        <div class="h-px flex-1 bg-slate-200" />
      </div>

      <form class="space-y-4" @submit="onSubmit">
        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Email</label>
          <input v-bind="emailAttrs" v-model="email" type="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300 focus:border-fy-teal-300" />
          <p v-if="errors.email" class="font-lora text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Password</label>
          <input v-bind="passwordAttrs" v-model="password" type="password"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300 focus:border-fy-teal-300" />
          <p v-if="errors.password" class="font-lora text-xs text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <div class="flex justify-end">
          <NuxtLink to="/forgot-password" class="font-poppins text-sm text-fy-sky-500 hover:underline">
            Forgot password?
          </NuxtLink>
        </div>

        <p v-if="serverError" class="font-lora text-sm text-red-600">{{ serverError }}</p>

        <button type="submit" :disabled="authStore.loading"
          class="w-full bg-fy-orange-300 hover:opacity-90 disabled:opacity-60 text-white font-poppins font-medium rounded-lg py-2.5 px-6 text-sm transition">
          {{ authStore.loading ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="text-center font-lora text-sm text-slate-500 mt-6">
        Don't have an account?
        <NuxtLink to="/register" class="text-fy-teal-300 font-medium hover:underline">Sign up</NuxtLink>
      </p>
    </div>
  </div>
</template>
```

---

### `pages/register.vue`

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import { RegisterSchema } from '~/schemas/auth.schemas'

definePageMeta({ middleware: 'guest' })

const authStore = useAuthStore()
const { renderButton } = useGoogleAuth()

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(RegisterSchema),
})
const [name, nameAttrs] = defineField('name')
const [phone, phoneAttrs] = defineField('phone')
const [email, emailAttrs] = defineField('email')
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('passwordConfirmation')

const serverError = ref('')
const googleBtnRef = ref<HTMLElement | null>(null)

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await authStore.register(values)
    // No tokens returned from register — go to OTP verification
    await navigateTo(`/verify-otp?purpose=register&email=${encodeURIComponent(values.email)}`)
  }
  catch { serverError.value = authStore.error || 'Registration failed' }
})

async function handleGoogleCredential(idToken: string) {
  serverError.value = ''
  try {
    await authStore.loginWithGoogle({ idToken })
    await navigateTo('/dashboard')
  }
  catch {
    // Backend returns an error if this email is already registered via password
    serverError.value = authStore.error || 'Google sign-in failed'
  }
}

onMounted(() => {
  if (googleBtnRef.value) renderButton(googleBtnRef.value, handleGoogleCredential)
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fy-teal-50 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-fy-teal-50 p-6 sm:p-8">
      <h1 class="font-poppins text-xl sm:text-2xl font-semibold text-fy-sage-900 mb-1">Create your account</h1>
      <p class="font-lora text-sm text-slate-500 mb-6">Mindset. Action. Happiness.</p>

      <div ref="googleBtnRef" class="w-full mb-4" />

      <div class="flex items-center gap-3 my-6">
        <div class="h-px flex-1 bg-slate-200" />
        <span class="font-poppins text-xs text-slate-400 uppercase tracking-wide">or</span>
        <div class="h-px flex-1 bg-slate-200" />
      </div>

      <form class="space-y-4" @submit="onSubmit">
        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Full name</label>
          <input v-bind="nameAttrs" v-model="name" type="text"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.name" class="font-lora text-xs text-red-500 mt-1">{{ errors.name }}</p>
        </div>

        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Phone number</label>
          <input v-bind="phoneAttrs" v-model="phone" type="tel"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.phone" class="font-lora text-xs text-red-500 mt-1">{{ errors.phone }}</p>
        </div>

        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Email</label>
          <input v-bind="emailAttrs" v-model="email" type="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.email" class="font-lora text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Password</label>
          <input v-bind="passwordAttrs" v-model="password" type="password"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.password" class="font-lora text-xs text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Confirm password</label>
          <input v-bind="passwordConfirmationAttrs" v-model="passwordConfirmation" type="password"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.passwordConfirmation" class="font-lora text-xs text-red-500 mt-1">{{ errors.passwordConfirmation }}</p>
        </div>

        <p v-if="serverError" class="font-lora text-sm text-red-600">{{ serverError }}</p>

        <button type="submit" :disabled="authStore.loading"
          class="w-full bg-fy-orange-300 hover:opacity-90 disabled:opacity-60 text-white font-poppins font-medium rounded-lg py-2.5 px-6 text-sm transition">
          {{ authStore.loading ? 'Creating account…' : 'Create account' }}
        </button>
      </form>

      <p class="text-center font-lora text-sm text-slate-500 mt-6">
        Already have an account?
        <NuxtLink to="/login" class="text-fy-teal-300 font-medium hover:underline">Sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>
```

---

### `pages/verify-otp.vue` — shared page for both flows

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import { OtpSchema } from '~/schemas/auth.schemas'

// No auth middleware — user is not logged in yet
const authStore = useAuthStore()
const route = useRoute()

const purpose = computed(() => route.query.purpose as 'register' | 'reset_password')
const email = computed(() => route.query.email as string)

// Guard: purpose and email must be present
if (!purpose.value || !email.value) await navigateTo('/login')

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(OtpSchema),
})
const [otp, otpAttrs] = defineField('otp')

const serverError = ref('')
const successMessage = ref('')

// ── Resend cooldown — local state only, does not need to survive navigation ────
const resendCooldown = ref(0)
let cooldownTimer: ReturnType<typeof setInterval> | null = null

function startCooldown() {
  resendCooldown.value = 60
  cooldownTimer = setInterval(() => {
    resendCooldown.value--
    if (resendCooldown.value <= 0 && cooldownTimer) {
      clearInterval(cooldownTimer)
      cooldownTimer = null
    }
  }, 1000)
}

onUnmounted(() => {
  if (cooldownTimer) clearInterval(cooldownTimer)
})

// ── Submit OTP ─────────────────────────────────────────────────────────────────
const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await authStore.verifyOtp({ email: email.value, otp: values.otp, purpose: purpose.value })

    if (purpose.value === 'register') {
      successMessage.value = 'Email verified! Redirecting to sign in…'
      setTimeout(() => navigateTo('/login'), 1200)
    }
    else {
      // reset_token is now stored in authStore.resetToken — go to reset-password
      await navigateTo(`/reset-password?email=${encodeURIComponent(email.value)}`)
    }
  }
  catch { serverError.value = authStore.error || 'Invalid or expired code.' }
})

// ── Resend OTP ─────────────────────────────────────────────────────────────────
async function resend() {
  if (resendCooldown.value > 0) return
  serverError.value = ''
  try {
    await authStore.resendOtp({ email: email.value, purpose: purpose.value })
    successMessage.value = 'New code sent!'
    startCooldown()
  }
  catch { serverError.value = authStore.error || 'Could not resend. Try again shortly.' }
}

const headingText = computed(() =>
  purpose.value === 'register' ? 'Verify your email' : 'Enter reset code',
)
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fy-teal-50 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-fy-teal-50 p-6 sm:p-8 text-center">
      <h1 class="font-poppins text-xl sm:text-2xl font-semibold text-fy-sage-900 mb-2">{{ headingText }}</h1>
      <p class="font-lora text-sm text-slate-500 mb-6">
        We sent a 6-digit code to <span class="font-medium text-fy-sage-900">{{ email }}</span>
      </p>

      <form class="space-y-4 text-left" @submit="onSubmit">
        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">6-digit code</label>
          <input v-bind="otpAttrs" v-model="otp" type="text" maxlength="6" autocomplete="one-time-code"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.otp" class="font-lora text-xs text-red-500 mt-1">{{ errors.otp }}</p>
        </div>

        <p v-if="successMessage" class="font-lora text-sm text-fy-teal-300 text-center">{{ successMessage }}</p>
        <p v-if="serverError" class="font-lora text-sm text-red-600 text-center">{{ serverError }}</p>

        <button type="submit" :disabled="authStore.loading"
          class="w-full bg-fy-orange-300 hover:opacity-90 disabled:opacity-60 text-white font-poppins font-medium rounded-lg py-2.5 px-6 text-sm transition">
          {{ authStore.loading ? 'Verifying…' : 'Verify code' }}
        </button>
      </form>

      <p class="font-lora text-sm text-slate-500 mt-6">
        Didn't receive it?
        <button
          :disabled="resendCooldown > 0"
          class="text-fy-sky-500 font-medium hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
          @click="resend">
          {{ resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend code' }}
        </button>
      </p>
    </div>
  </div>
</template>
```

---

### `pages/forgot-password.vue`

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import { ForgotPasswordSchema } from '~/schemas/auth.schemas'

const authStore = useAuthStore()

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(ForgotPasswordSchema),
})
const [email, emailAttrs] = defineField('email')

const serverError = ref('')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await authStore.forgotPassword({ email: values.email })
    await navigateTo(`/verify-otp?purpose=reset_password&email=${encodeURIComponent(values.email)}`)
  }
  catch { serverError.value = authStore.error || 'Something went wrong' }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fy-teal-50 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-fy-teal-50 p-6 sm:p-8">
      <h1 class="font-poppins text-xl sm:text-2xl font-semibold text-fy-sage-900 mb-1">Reset your password</h1>
      <p class="font-lora text-sm text-slate-500 mb-6">We'll email you a reset code</p>

      <form class="space-y-4" @submit="onSubmit">
        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Email</label>
          <input v-bind="emailAttrs" v-model="email" type="email"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.email" class="font-lora text-xs text-red-500 mt-1">{{ errors.email }}</p>
        </div>

        <p v-if="serverError" class="font-lora text-sm text-red-600">{{ serverError }}</p>

        <button type="submit" :disabled="authStore.loading"
          class="w-full bg-fy-orange-300 hover:opacity-90 disabled:opacity-60 text-white font-poppins font-medium rounded-lg py-2.5 px-6 text-sm transition">
          {{ authStore.loading ? 'Sending…' : 'Send reset code' }}
        </button>
      </form>

      <p class="text-center font-lora text-sm text-slate-500 mt-6">
        <NuxtLink to="/login" class="text-fy-sky-500 font-medium hover:underline">Back to sign in</NuxtLink>
      </p>
    </div>
  </div>
</template>
```

---

### `pages/reset-password.vue` — flat route, uses reset_token from store

```vue
<script setup lang="ts">
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/valibot'
import { ResetPasswordSchema } from '~/schemas/auth.schemas'

const authStore = useAuthStore()
const route = useRoute()

// Guard — if reset_token is missing the user got here without verifying OTP
if (!authStore.resetToken) await navigateTo('/forgot-password')

const { handleSubmit, errors, defineField } = useForm({
  validationSchema: toTypedSchema(ResetPasswordSchema),
})
const [password, passwordAttrs] = defineField('password')
const [passwordConfirmation, passwordConfirmationAttrs] = defineField('passwordConfirmation')

const serverError = ref('')
const successMessage = ref('')

const onSubmit = handleSubmit(async (values) => {
  serverError.value = ''
  try {
    await authStore.resetPassword({
      email: route.query.email as string,  // passed through query from /forgot-password → /verify-otp → here
      resetToken: authStore.resetToken!,   // guaranteed non-null by the guard above
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    })
    successMessage.value = 'Password reset. Redirecting to sign in…'
    setTimeout(() => navigateTo('/login'), 1500)
  }
  catch { serverError.value = authStore.error || 'Reset token is invalid or expired' }
})
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-fy-teal-50 px-4 py-12">
    <div class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-fy-teal-50 p-6 sm:p-8">
      <h1 class="font-poppins text-xl sm:text-2xl font-semibold text-fy-sage-900 mb-6">Set a new password</h1>

      <form class="space-y-4" @submit="onSubmit">
        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">New password</label>
          <input v-bind="passwordAttrs" v-model="password" type="password"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.password" class="font-lora text-xs text-red-500 mt-1">{{ errors.password }}</p>
        </div>

        <div>
          <label class="block font-poppins text-sm font-medium text-fy-sage-900 mb-1">Confirm new password</label>
          <input v-bind="passwordConfirmationAttrs" v-model="passwordConfirmation" type="password"
            class="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm font-lora focus:outline-none focus:ring-2 focus:ring-fy-teal-300" />
          <p v-if="errors.passwordConfirmation" class="font-lora text-xs text-red-500 mt-1">{{ errors.passwordConfirmation }}</p>
        </div>

        <p v-if="successMessage" class="font-lora text-sm text-fy-teal-300">{{ successMessage }}</p>
        <p v-if="serverError" class="font-lora text-sm text-red-600">{{ serverError }}</p>

        <button type="submit" :disabled="authStore.loading"
          class="w-full bg-fy-orange-300 hover:opacity-90 disabled:opacity-60 text-white font-poppins font-medium rounded-lg py-2.5 px-6 text-sm transition">
          {{ authStore.loading ? 'Resetting…' : 'Reset password' }}
        </button>
      </form>
    </div>
  </div>
</template>
```

---

## 15. Files to delete

| File | Reason |
|------|--------|
| `composables/useApi.ts` | Replaced by `plugins/api.ts` (`$api`). No call-sites existed outside its own definition — safe to delete. |
| `pages/verify-email.vue` | Replaced by `pages/verify-otp.vue` |
| `pages/verify-email/[token].vue` | Replaced by `pages/verify-otp.vue` |

---

## 16. Duplicate account prevention

### Google → existing email/password account (backend responsibility)

When a user calls `POST /auth/google`, the backend must:
1. Decode the `id_token` and verify it with Google's public key server-side
2. Extract the email from the decoded token
3. Check if that email already exists in the DB registered via email/password
4. If yes — return a clear error: `"An account with this email already exists. Please sign in with your password."`
5. If no — create a new Google-linked user and return tokens

The frontend surfaces this as `serverError` in `register.vue` — no special handling needed.

### Duplicate email on registration (backend + frontend)

The backend returns 422/409 with `{ status: false, message: "Email already registered." }` on `POST /auth/register`. The store's `register` action catches this and sets `authStore.error`, which surfaces as `serverError` on the page. No frontend pre-check needed — backend is always the source of truth.

---

## 17. What changes when you migrate to NestJS

1. Update URLs/casing in `auth.service.ts` if Nest uses different paths.
2. Rewrite (or delete) `mapCIResponse` and `mapCIUser` if Nest's response shape already matches `AuthResult` and `User`.
3. Update `CIAuthResponse`, `CISimpleResponse`, `CIVerifyOtpResponse`, `CIMeResponse` in `types/auth.ts` to match Nest's actual DTO shapes.
4. Nothing in the store, middleware, composables, or pages needs to change — they only ever talk to `useAuthService()`, never to raw HTTP responses.
5. Worth revisiting at that point: having NestJS set tokens as `httpOnly` cookies directly instead of returning them in the JSON body, for stronger XSS protection.

---

## 18. Implementation order

Implement in this exact sequence to avoid import errors:

1. `types/user.ts` — update: add `phone`, `emailVerified`, `createdAt`; keep `role`, `avatar`; change `id` to `string`
2. `types/auth.ts` — new file: all CI response shapes + payload types
3. `schemas/auth.schemas.ts` — new file: all Valibot schemas
4. `composables/useAuthTokens.ts` — new file
5. `plugins/api.ts` — new file (the authenticated `$api` plugin)
6. `services/auth.service.ts` — new file
7. `stores/auth.ts` — full content replacement
8. `nuxt.config.ts` — **additive only**: `googleClientId` + missing route rules + `@vee-validate/nuxt` module + `fonts` config
9. `assets/css/main.css` — add `@theme {}` color/font tokens
10. `middleware/auth.ts` — replace body (async, uses `isAuthenticated`)
11. `middleware/guest.ts` — replace body (async, uses `isAuthenticated`)
12. `middleware/role.ts` — change `isLoggedIn` → `isAuthenticated` (one line)
13. `plugins/auth.client.ts` — replace body (call `authStore.initAuth()`)
14. `composables/useGoogleAuth.ts` — new file
15. **Pages** in order: `login.vue` → `register.vue` → `verify-otp.vue` → `forgot-password.vue` → `reset-password.vue`
16. **Delete**: `composables/useApi.ts`, `pages/verify-email.vue`, `pages/verify-email/[token].vue`

---

## 19. Testing checklist before calling this production-ready

- [ ] Register with name, phone, email, password → lands on `/verify-otp?purpose=register`
- [ ] OTP code entered correctly → success message + redirect to `/login`
- [ ] Wrong OTP → inline error shown, stays on page
- [ ] Resend OTP → 60s countdown starts, button disabled; after 60s button re-enables
- [ ] Sending a new code resets the 60s timer
- [ ] Login after OTP verification → lands on `/dashboard`
- [ ] Google sign-in for a **new** email → creates account, lands on `/dashboard`
- [ ] Google sign-in for an email **already registered via password** → clear error, no duplicate account
- [ ] Register with duplicate email → backend error surfaced on register page, no OTP sent
- [ ] Forgot password → `/verify-otp?purpose=reset_password` → enter code → `/reset-password`
- [ ] Reset password with correct OTP → success, redirect to `/login`; `resetToken` cleared from store
- [ ] Navigate directly to `/reset-password` without verifying OTP → redirected to `/forgot-password`
- [ ] Access token expires → next API call auto-refreshes transparently → user never notices
- [ ] Refresh token expires/invalid → user redirected to `/login` cleanly, no infinite redirect loop
- [ ] Page reload when logged in → user hydrated from `auth_user` cookie, no `GET /auth/me` network call
- [ ] Two tabs open, one logs out → other tab's next authenticated request fails gracefully
- [ ] Password reset → old refresh tokens invalidated server-side (confirm with backend dev)
- [ ] Mobile viewport (375px): buttons full-width, cards don't touch edges, OTP input readable
- [ ] Form validation fires before any network call: empty submit, invalid email, password < 8 chars, mismatch
