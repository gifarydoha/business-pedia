# Authentication System Overview

This is a simplified breakdown of the authentication system and how each file fits together.

## 🔐 The Big Picture

Think of it like a **security system for a building**:
- **Types** (`types/user.ts`, `types/auth.ts`) = the ID card templates
- **Tokens composable** (`composables/useAuthTokens.ts`) = the key storage box
- **Auth Service** (`services/auth.service.ts`) = the security desk (talks to the server)
- **Auth Store** (`stores/auth.ts`) = the security manager (orchestrates everything)
- **API Plugin** (`plugins/api.ts`) = the door that auto-unlocks with your key
- **Auth Client Plugin** (`plugins/auth.client.ts`) = the morning routine that restores your key from yesterday

---

## 📁 File-by-File Explanation

### 1. `types/user.ts` — *The ID Card Template*

Defines **what a user looks like** in your app.

```typescript
User = { id, name, email, phone, role, avatar, emailVerified, createdAt }
Role = "admin" | "editor" | "author" | "reviewer" | "reader"
```

It also defines `AuthTokenPayload` — the shape of a login success response from the server.

---

### 2. `types/auth.ts` — *All the Form & API Shapes*

This file has **two categories of types**:

| Category | What it contains |
|---|---|
| **Your app's shapes** | `LoginPayload`, `RegisterPayload`, `VerifyOtpPayload`, `ResetPasswordPayload`, etc. |
| **Backend's raw shapes** | `CIAuthResponse`, `CIRefreshResponse`, `CIMeResponse` — exactly what your CodeIgniter API returns |

> The comment says: *"These are the ONLY interfaces that change on NestJS migration"* — meaning when you switch backends, only `CI*` types need updating.

---

### 3. `composables/useAuthTokens.ts` — *The Key Storage Box*

Manages **3 browser cookies**:

| Cookie | What | Expires |
|---|---|---|
| `auth_access_token` | Short-lived JWT | 30 minutes |
| `auth_refresh_token` | Long-lived refresh JWT | 30 days |
| `auth_user` | Cached user data (JSON) | 30 days |

Exposes:
- `setTokens()` — save both tokens after login
- `clearTokens()` — wipe everything on logout

---

### 4. `plugins/api.ts` — *The Smart Door (Auto-Auth HTTP Client)*

Creates a global `$api` instance (a wrapper around `$fetch`) that does **two automatic things**:

```
Every request  →  attaches "Authorization: Bearer <token>" header automatically
     ↓
If server says 401 (Unauthorized)
     ↓
Auto-refreshes the access token (using refresh token)
     ↓
Retries the original request with the new token
     ↓
If refresh also fails → redirects to /login
```

> **Key detail**: If 5 requests all fail with 401 at the same time, it only fires **one** refresh call (de-duplication via `refreshPromise`), then retries all 5.

---

### 5. `services/auth.service.ts` — *The Security Desk (API Calls)*

Makes the actual **HTTP calls to your backend** and translates the raw backend format into your clean app format.

```
Backend returns:  { email_verified, created_at, access_token }
App receives:     { emailVerified, createdAt, accessToken }     ← camelCase, clean
```

| Function | What it calls |
|---|---|
| `register()` | `POST /auth/register` |
| `verifyOtp()` | `POST /auth/verify-otp` |
| `resendOtp()` | `POST /auth/resend-otp` |
| `forgotPassword()` | `POST /auth/forgot-password` |
| `resetPassword()` | `POST /auth/reset-password` |
| `login()` | `POST /auth/login` |
| `loginWithGoogle()` | `POST /auth/google` |
| `fetchUser()` | `GET /auth/me` *(uses `$api` — auto-token attached)* |
| `logout()` | `POST /auth/logout` *(uses `$api`)* |

---

### 6. `stores/auth.ts` — *The Security Manager (Global State)*

This is the **brain of auth** — it holds global reactive state and orchestrates everything:

**State it tracks:**
```typescript
user        // currently logged-in user (or null)
resetToken  // temporary token during password reset flow
loading     // true while any auth action is in progress
error       // last error message
initialized // whether the app has checked auth on startup
```

**Computed shortcuts (getters):**
```typescript
isAuthenticated  // is user logged in?
isEmailVerified  // has user verified their email?
isAdmin / isEditor / isAuthor  // role checks for middleware
```

**What it does on `login()`:**
1. Calls the service → gets tokens + user
2. Saves tokens to cookies via `useAuthTokens`
3. Saves user to `user` state
4. Also saves user to cookie (so next page load doesn't need a network call)

---

### 7. `plugins/auth.client.ts` — *The Morning Routine*

Runs **once, client-side only**, after the page loads. Calls `authStore.restoreFromStorage()` to re-hydrate the user from the cookie — so you **stay logged in** across page refreshes without hitting the server.

> ⚠️ Note: `restoreFromStorage()` is referenced here but **not yet defined** in `auth.ts` — it's likely part of the auth implementation plan you have open.

---

## 🔄 Complete Flow Summary

```text
Page Load
  └── auth.client.ts → restoreFromStorage() → reads user cookie → sets store.user

User clicks Login
  └── Store.login() → Service.login() → POST /auth/login
        └── Save tokens to cookies (useAuthTokens)
        └── Save user to store + cookie

Any API call (via $api)
  └── api.ts auto-attaches Bearer token
        └── If 401 → auto-refresh → retry → or redirect /login

Logout
  └── Service.logout() → clears server session
        └── useAuthTokens.clearTokens() → wipes all cookies
```
