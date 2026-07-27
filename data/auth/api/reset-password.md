# POST /auth/reset-password

> **Page:** `reset-password.vue`
> **Purpose:** Changes the user's password using the token granted from the OTP verification step.

## Request

**Method:** `POST`
**Route:** `/auth/reset-password`
**Auth Required:** No

### Body Payload (JSON)
| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | Yes | Passed via URL query from the previous steps |
| `reset_token` | string | Yes | Sourced from `authStore.resetToken` (granted by `/auth/verify-otp`) |
| `password` | string | Yes | Min 8 characters |
| `password_confirmation` | string | Yes | Must match `password` exactly |

## Response

### Success
**Status Code:** `200 OK`
```json
{
  "status": true,
  "message": "Password reset successfully"
}
```

### Errors
| Status Code | Scenario |
|---|---|
| **400** | Invalid or expired `reset_token` |
| **404** | User not found by email |
| **422** | `password` and `password_confirmation` do not match |

## Frontend Behavior After Success
Shows a success message ("Password reset. Redirecting to Login…") and automatically navigates to `/login` after 1.5 seconds.
