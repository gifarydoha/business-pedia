# POST /auth/register

> **Page:** `register.vue`
> **Purpose:** Creates a new unverified user account and sends a verification OTP to their email.

## Request

**Method:** `POST`
**Route:** `/auth/register`
**Auth Required:** No

### Body Payload (JSON)
| Field | Type | Required | Validation Rules |
|---|---|---|---|
| `name` | string | Yes | Min 3 characters |
| `phone` | string | Yes | Must be a valid Bangladeshi mobile number (regex: `/^(?:\+8801|8801|01)[0-9]{9}$/`) |
| `email` | string | Yes | Valid email format |
| `password` | string | Yes | Min 8 characters |
| `password_confirmation` | string | Yes | Must match `password` exactly |

## Response

> [!IMPORTANT]
> **No tokens are returned from this endpoint.** The frontend flow requires email verification before login.

### Success
**Status Code:** `200 OK` or `201 Created`
```json
{
  "status": true,
  "message": "Verification code sent to your email"
}
```

### Errors
| Status Code | Scenario | Example Envelope |
|---|---|---|
| **400** | General validation failure (e.g. invalid email format) | `{ "status": false, "message": "Validation failed" }` |
| **409** | Email is already registered | `{ "status": false, "message": "Email already exists" }` |
| **422** | `password` and `password_confirmation` do not match | `{ "status": false, "message": "Passwords do not match" }` |

## Frontend Behavior After Success
Upon receiving a `200` response, the frontend will clear any form errors and automatically navigate to:
`/verify-otp?purpose=register&email=<user_email>`
