# POST /auth/verify-otp & POST /auth/resend-otp

> **Page:** `verify-otp.vue`
> **Purpose:** Handles verifying 6-digit OTP codes for both new account registration and password resets, as well as resending codes.

---

## 1. POST /auth/verify-otp

**Auth Required:** No

### Request Body (JSON)
| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | Yes | The user's email address |
| `otp` | string | Yes | Exactly 6 digits (regex: `/^\d{6}$/`) |
| `purpose` | string | Yes | Enum: `"register"` or `"reset_password"` |

### Response 

The response structure depends entirely on the `purpose` provided in the request.

#### A. When `purpose: "register"`
**Status Code:** `200 OK`
```json
{
  "status": true,
  "message": "Email verified successfully"
}
```
*Frontend Behavior:* Shows success message, then redirects to `/login` after 1.2 seconds.

#### B. When `purpose: "reset_password"`
**Status Code:** `200 OK`
```json
{
  "status": true,
  "message": "OTP verified",
  "data": {
    "reset_token": "a-secure-one-time-token"
  }
}
```
> [!NOTE]
> The `reset_token` is crucial. The frontend saves it in memory (`authStore.resetToken`) and navigates to `/reset-password?email=...`. It will send this token in the next step to authorize the password change.

### Errors (Both Purposes)
| Status Code | Scenario |
|---|---|
| **400** | OTP is incorrect or expired |
| **404** | User not found for this email |
| **423** | Account locked due to too many failed OTP attempts |
| **429** | Too many OTP verification attempts (lockout threshold reached) |

---

## 2. POST /auth/resend-otp

**Auth Required:** No

### Request Body (JSON)
| Field | Type | Required | Notes |
|---|---|---|---|
| `email` | string | Yes | The user's email address |
| `purpose` | string | Yes | Enum: `"register"` or `"reset_password"` |

### Response

#### Success
**Status Code:** `200 OK`
```json
{
  "status": true,
  "message": "New verification code sent"
}
```

#### Errors
| Status Code | Scenario |
|---|---|
| **404** | User not found for this email |
| **423** | Account is currently locked |
| **429** | Rate limit hit (e.g. requesting ≥ 3 OTPs within 15 minutes) |

### Frontend Behavior
When successful, the frontend initiates a **60-second cooldown timer**. The resend button is disabled during this period to prevent spam. Backend should implement a corresponding rate limit (e.g., max 3 requests per 15 minutes).
