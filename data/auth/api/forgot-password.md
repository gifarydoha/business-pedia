# POST /auth/forgot-password

> **Page:** `forgot-password.vue`
> **Purpose:** Requests a password reset OTP for a user's email.

## Request

**Method:** `POST`
**Route:** `/auth/forgot-password`
**Auth Required:** No

### Body Payload (JSON)
| Field | Type | Required | Validation Rules |
|---|---|---|---|
| `email` | string | Yes | Valid email format |

## Response

> [!IMPORTANT]
> **Anti-Enumeration Note:** To prevent attackers from checking if an email is registered, the API **must return the exact same success response** regardless of whether the user exists or not. 

### Success
**Status Code:** `200 OK`
```json
{
  "status": true,
  "message": "If this email is registered, you will receive a code"
}
```

### Errors
| Status Code | Scenario |
|---|---|
| **400** | General validation failure (invalid email format) |

## Frontend Behavior After Success
Upon receiving a `200` response, the frontend navigates to:
`/verify-otp?purpose=reset_password&email=<user_email>`
