# Login & Session Management API

> **Page:** `login.vue` (and general session management)
> **Purpose:** Handles user authentication, Google SSO, fetching the current user, token rotation, and logging out.

---

## 1. POST /auth/login

**Auth Required:** No

### Request Body (JSON)
| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | Yes | Valid email address format |
| `password` | string | Yes | Min 8 characters |

### Response
**Status Code:** `200 OK`
```json
{
  "status": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "reader",
      "avatar": "string",
      "email_verified": true,
      "created_at": "string"
    },
    "access_token": "jwt...",
    "refresh_token": "jwt..."
  }
}
```

### Errors
| Status Code | Scenario |
|---|---|
| **401** | Wrong password, user not found, or Google-only account |
| **403** | Email not verified |
| **423** | Account locked due to failed attempts |

*Frontend Behavior:* On success, navigates to `route.query.redirect` or `/dashboard`.

---

## 2. POST /auth/google

**Auth Required:** No

### Request Body (JSON)
> [!IMPORTANT]
> The frontend component uses camelCase (`idToken`), but the API service sends it as `id_token` in snake_case.

| Field | Type | Required | Notes |
|---|---|---|---|
| `id_token` | string | Yes | The ID token returned from Google's client SDK |

### Response
**Status Code:** `200 OK`
*(Returns the same AuthResponse shape as `/auth/login`)*

> [!NOTE]
> **Auto-Register Behavior:** If no user exists for the Google ID, the backend should automatically create a verified account and return the tokens.

### Errors
| Status Code | Scenario |
|---|---|
| **401** | Invalid or expired Google ID token |

---

## 3. GET /auth/me

**Auth Required:** Yes (`Authorization: Bearer <access_token>`)
**Request Body:** None

### Response
**Status Code:** `200 OK`
```json
{
  "status": true,
  "data": {
    "user": {
      "id": "string",
      "name": "string",
      "email": "string",
      "phone": "string",
      "role": "reader",
      "avatar": "string",
      "email_verified": true,
      "created_at": "string"
    }
  }
}
```

### Errors
| Status Code | Scenario |
|---|---|
| **401** | Missing, invalid, or expired access token |

---

## 4. POST /auth/refresh

**Auth Required:** No (Uses refresh token in body, not in Bearer header)

### Request Body (JSON)
| Field | Type | Required | Notes |
|---|---|---|---|
| `refresh_token` | string | Yes | Sourced from `auth_refresh_token` cookie |

### Response
**Status Code:** `200 OK`
```json
{
  "status": true,
  "data": {
    "access_token": "new-jwt...",
    "refresh_token": "new-jwt..."
  }
}
```
> [!NOTE]
> **Token Rotation:** The old refresh token should be invalidated, and a fresh pair returned.

### Errors
| Status Code | Scenario |
|---|---|
| **401** | Expired, revoked, or invalid refresh token |

---

## 5. POST /auth/logout

**Auth Required:** Yes (`Authorization: Bearer <access_token>`)

### Request Body (JSON)
| Field | Type | Required | Notes |
|---|---|---|---|
| `refresh_token` | string | Yes | The refresh token to invalidate on the server |

### Response
**Status Code:** `200 OK`
```json
{
  "status": true,
  "message": "Logged out successfully"
}
```

### Errors
| Status Code | Scenario |
|---|---|
| **401** | Invalid access token |

> [!NOTE]
> **Frontend Behavior:** The frontend treats logout as "fire-and-forget". It will clear the local `auth_access_token`, `auth_refresh_token`, and `auth_user` cookies regardless of whether the API returns a success or error.
