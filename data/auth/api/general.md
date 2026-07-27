# General Auth API Conventions

> **Purpose:** This document outlines the shared conventions, data shapes, and global rules for all authentication endpoints. 

## Base URL & Setup
- Ensure the API is served with a standard base URL (e.g., `/api/v1` or similar, depending on your setup).
- **CORS:** Must be configured to allow requests from the frontend origin, with `credentials: true`.
- **How to read these docs:** Each endpoint specifies the exact *wire format* (what is actually sent over HTTP in snake_case), the expected HTTP status codes, and the resulting frontend behavior.

## Endpoint Overview
| # | Method | Route | Purpose | Auth Required |
|---|---|---|---|---|
| 1 | POST | `/auth/register` | Create unverified account | No |
| 2 | POST | `/auth/verify-otp` | Verify email / get reset_token | No |
| 3 | POST | `/auth/resend-otp` | Resend OTP | No |
| 4 | POST | `/auth/forgot-password` | Request password reset OTP | No |
| 5 | POST | `/auth/reset-password` | Change password with reset_token | No |
| 6 | POST | `/auth/login` | Email+password login → JWT tokens | No |
| 7 | POST | `/auth/google` | Google ID token login / register | No |
| 8 | GET | `/auth/me` | Fetch authenticated user profile | Yes (Bearer JWT) |
| 9 | POST | `/auth/refresh` | Rotate access + refresh tokens | No (uses refresh_token in body) |
| 10 | POST | `/auth/logout` | Invalidate refresh token | Yes (Bearer JWT) |

## Global Response Envelopes
The frontend expects responses wrapped in these specific envelopes. 

> [!NOTE]
> **Error Responses:** You have freedom in how you format validation error arrays (e.g., adding an `errors` array for field-level details), but **every error response must maintain the base `{ status: false, message: string }` envelope.**

| Interface             | Shape                                                                                                     | Used For                                                                               |
| -----------------------| -----------------------------------------------------------------------------------------------------------| ----------------------------------------------------------------------------------------|
| **SimpleResponse**    | `{ status: boolean, message: string }`                                                                    | General success/failure, register, forgot-password, reset-password, logout, resend-otp |
| **AuthResponse**      | `{ status: boolean, message: string, data: { user: User, access_token: string, refresh_token: string } }` | Login, Google Auth                                                                     |
| **VerifyOtpResponse** | `{ status: boolean, message: string, data?: { reset_token?: string } }`                                   | OTP Verification (`reset_token` only when purpose is `reset_password`)                 |
| **RefreshResponse**   | `{ status: boolean, data: { access_token: string, refresh_token: string } }`                              | Token refresh                                                                          |
| **MeResponse**        | `{ status: boolean, data: { user: User } }`                                                               | Fetching current user                                                                  |

## Data Models

### User Object Shape
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "phone": "string (nullable, empty string if missing)",
  "role": "UserRole",
  "avatar": "string (optional/nullable)",
  "email_verified": "boolean",
  "created_at": "string (ISO Date)"
}
```
*(Note: IDs from the backend can be numbers, the frontend maps them to strings locally)*

### UserRole Enum
`"admin" | "editor" | "author" | "reviewer" | "reader"`
*Default role on registration is `"reader"`.*

## Security & Authentication

### Token Lifetimes
| Token | Lifetime | Storage Location (Frontend) |
|---|---|---|
| **Access Token** | 30 minutes | `auth_access_token` cookie |
| **Refresh Token**| 30 days | `auth_refresh_token` cookie |

### Auth Header Format
For protected endpoints (e.g., `/auth/me`, `/auth/logout`), the frontend will send the access token in the Authorization header:
`Authorization: Bearer <access_token>`

## Common HTTP Status Codes
| Code | Meaning | Typical Usage |
|---|---|---|
| **200** / **201** | Success | Request succeeded. |
| **400** | Bad Request | Validation errors, invalid OTP, invalid reset_token. |
| **401** | Unauthorized | Missing/invalid token, wrong password, Google-only account trying password login. |
| **403** | Forbidden | Email not verified before login. |
| **404** | Not Found | User not found (during verify/resend/reset). |
| **409** | Conflict | Email already registered. |
| **422** | Unprocessable Entity | Password mismatch. |
| **423** | Locked | Account locked due to too many OTP attempts. |
| **429** | Too Many Requests | Rate limit hit (e.g., requesting too many OTPs). |
