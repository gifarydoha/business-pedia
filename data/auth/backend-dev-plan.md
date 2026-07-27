# Backend Development Plan — Auth System (NestJS + TypeScript + PostgreSQL + Prisma)

> **For:** A junior developer with zero prior experience in NestJS, TypeScript, PostgreSQL, or Prisma.
> **Target:** A production-level, bulletproof auth backend that exactly matches the existing Nuxt.js frontend contract.
> **Stack:** NestJS · TypeScript · PostgreSQL · Prisma ORM · Nodemailer (SMTP) · JWT (RS256 or HS256) · Docker
> **Swagger:** Dev only, disabled in production.
> **Google OAuth:** Server-side ID token verification using Google's public keys (no Passport.js).

---

## Realistic Time Estimate

| Level | Context | Days |
|---|---|---|
| Honest junior (self-learning as he goes) | 4–8 hrs/day of focused work | **30–45 days** |
| Junior with a senior reviewing PRs daily | 4–8 hrs/day | **20–28 days** |
| Junior with this plan used as the spec | 6+ hrs/day strict execution | **18–25 days** |

> ⚠️ **The largest time sink is NOT writing code — it is setting up the environment, understanding how NestJS modules work, debugging Prisma migrations, and making JWT & cookie logic correct.** Do not rush Phase 1 & 2.

---

## The 10 API Endpoints the Frontend Already Expects

These are derived directly from `app/services/auth.service.ts`. **The backend MUST produce these exact routes and response shapes or the frontend breaks.**

| #   | Method | Route                   | Purpose                           | Auth Required                   |
| -----| --------| -------------------------| -----------------------------------| ---------------------------------|
| 1   | POST   | `/auth/register`        | Create unverified account         | No                              |
| 2   | POST   | `/auth/verify-otp`      | Verify email / get reset_token    | No                              |
| 3   | POST   | `/auth/resend-otp`      | Resend OTP                        | No                              |
| 4   | POST   | `/auth/forgot-password` | Request password reset OTP        | No                              |
| 5   | POST   | `/auth/reset-password`  | Change password with reset_token  | No                              |
| 6   | POST   | `/auth/login`           | Email+password login → JWT tokens | No                              |
| 7   | POST   | `/auth/google`          | Google ID token login / register  | No                              |
| 8   | GET    | `/auth/me`              | Fetch authenticated user profile  | Yes (Bearer JWT)                |
| 9   | POST   | `/auth/refresh`         | Rotate access + refresh tokens    | No (uses refresh token in body) |
| 10  | POST   | `/auth/logout`          | Invalidate refresh token          | Yes (Bearer JWT)                |

---

## Frontend API Contract (exact request/response shapes)

### Shared Response Envelope
All endpoints return JSON in this shape (matching `CISimpleResponse`, `CIAuthResponse`, etc.):

```ts
// Simple success/error
{ status: boolean, message: string }

// Auth success (login, google)
{
  status: boolean,
  message: string,
  data: {
    user: { id: number, name: string, email: string, phone?: string, role: string, avatar?: string, email_verified: boolean, created_at: string },
    access_token: string,
    refresh_token: string
  }
}

// OTP verify for reset_password purpose
{
  status: boolean,
  message: string,
  data?: { reset_token?: string }
}

// Token refresh
{ status: boolean, data: { access_token: string, refresh_token: string } }

// /auth/me
{ status: boolean, data: { user: { ...same user shape above } } }
```

### User Roles (from `app/types/user.ts`)
```ts
type UserRole = "admin" | "editor" | "author" | "reviewer" | "reader";
```
Default role on registration: `"reader"`.

### Token Lifetimes (from `app/composables/useAuthTokens.ts`)
- **Access token:** 30 minutes (`maxAge: 60 * 30`)
- **Refresh token:** 30 days (`maxAge: 60 * 60 * 24 * 30`)

### Validation Rules (from `app/schemas/auth.schemas.ts`)
- **name:** min 3 characters
- **phone:** Bangladeshi mobile — regex `/^(?:\+8801|8801|01)[0-9]{9}$/`
- **email:** valid email format
- **password:** min 8 characters
- **otp:** exactly 6 digits `/^\d{6}$/`
- **password_confirmation:** must match password

---

## Phase 0: Environment Setup (Days 1–3)

### Day 1 — Learn TypeScript Basics
**Goal:** Be able to read and write typed TypeScript.

Topics to study (in order):
1. Primitive types: `string`, `number`, `boolean`, `null`, `undefined`
2. Interfaces and type aliases: `interface User { ... }`, `type Role = 'admin' | 'editor'`
3. Generics: `Promise<string>`, `Array<User>`
4. Type assertion: `res as AuthResult`
5. Optional chaining: `user?.email`

Resources:
- https://www.typescriptlang.org/docs/handbook/2/basic-types.html
- TypeScript Playground: https://www.typescriptlang.org/play

**Exercise:** Recreate all the types in `app/types/auth.ts` and `app/types/user.ts` from scratch in a `.ts` file without looking at the original.

---

### Day 2 — Learn PostgreSQL Basics
**Goal:** Be able to design a table and write CRUD queries.

Topics to study:
1. `CREATE TABLE`, `ALTER TABLE`, `DROP TABLE`
2. Data types: `TEXT`, `VARCHAR`, `INTEGER`, `BOOLEAN`, `TIMESTAMP`, `UUID`
3. `INSERT INTO`, `SELECT`, `UPDATE`, `DELETE`
4. `WHERE`, `AND`, `OR`, `LIKE`, `LIMIT`
5. Indexes: `CREATE INDEX`
6. Foreign keys: `REFERENCES`, `ON DELETE CASCADE`

**Install:** PostgreSQL 16 locally via Docker:
```bash
docker run --name pg-dev -e POSTGRES_PASSWORD=secret -e POSTGRES_DB=business_pedia -p 5432:5432 -d postgres:16-alpine
```

**Exercise:** Create a `users` table manually with `id`, `email`, `name`, `password_hash`, `role`, `email_verified`, `created_at` columns.

---

### Day 3 — Learn NestJS + Prisma Project Setup
**Goal:** Create the boilerplate project and connect it to PostgreSQL.

Steps:
```bash
# 1. Install NestJS CLI globally
npm install -g @nestjs/cli

# 2. Create the project
nest new business-pedia-api --package-manager npm

# 3. Install core dependencies
npm install @nestjs/jwt @nestjs/config @nestjs/swagger
npm install bcryptjs nodemailer
npm install @prisma/client
npm install -D prisma @types/bcryptjs @types/nodemailer

# 4. Initialize Prisma
npx prisma init --datasource-provider postgresql
```

Set `.env`:
```env
DATABASE_URL="postgresql://postgres:secret@localhost:5432/business_pedia"
JWT_ACCESS_SECRET="your-very-long-random-access-secret-min-32-chars"
JWT_REFRESH_SECRET="your-very-long-random-refresh-secret-min-32-chars"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="youremail@gmail.com"
SMTP_PASS="your-app-password"
SMTP_FROM="Business Pedia <youremail@gmail.com>"
APP_NAME="Business Pedia"
```

---

## Phase 1: Database Schema (Days 4–6)

### Day 4 — Design the Prisma Schema

Create `prisma/schema.prisma`:

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  admin
  editor
  author
  reviewer
  reader
}

model User {
  id            Int       @id @default(autoincrement())
  name          String
  email         String    @unique
  phone         String?
  passwordHash  String?   // null for Google-only accounts
  role          UserRole  @default(reader)
  avatar        String?
  emailVerified Boolean   @default(false)
  googleId      String?   @unique // Google sub claim
  isLocked      Boolean   @default(false) // for OTP lockout
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  otpCodes     OtpCode[]
  refreshTokens RefreshToken[]

  @@map("users")
}

model OtpCode {
  id          Int       @id @default(autoincrement())
  userId      Int
  code        String    // 6-digit code (hashed with bcrypt)
  purpose     String    // "register" | "reset_password"
  expiresAt   DateTime
  usedAt      DateTime?
  attempts    Int       @default(0)
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("otp_codes")
}

model RefreshToken {
  id          Int       @id @default(autoincrement())
  userId      Int
  tokenHash   String    @unique // store hash, not raw token
  expiresAt   DateTime
  revokedAt   DateTime?
  createdAt   DateTime  @default(now())

  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("refresh_tokens")
}

model ResetToken {
  id          Int       @id @default(autoincrement())
  userId      Int       @unique
  tokenHash   String    @unique
  expiresAt   DateTime
  usedAt      DateTime?
  createdAt   DateTime  @default(now())

  @@map("reset_tokens")
}
```

### Day 5 — Run Migration & Seed
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Study: `prisma.$transaction()`, `prisma.user.findUnique()`, `prisma.user.create()`

**Exercise:** Write a small test script `prisma/seed.ts` that creates an admin user.

### Day 6 — Understand Prisma Client
Study:
- `create`, `findUnique`, `findFirst`, `update`, `delete`, `upsert`
- `where`, `select`, `include` (relations)
- Transactions: `prisma.$transaction([...])`

**Exercise:** Write Prisma queries that implement the core user lookups: find by email, find by id, update emailVerified.

---

## Phase 2: NestJS Architecture (Days 7–9)

### Day 7 — Understand NestJS Modules, Controllers, Services
Topics:
1. `@Module({})` — how NestJS glues things together
2. `@Controller('auth')` — route prefix
3. `@Injectable()` — service class that holds business logic
4. `@Post()`, `@Get()` — HTTP method decorators
5. `@Body()`, `@Param()`, `@Headers()` — request data access
6. Dependency injection: services injected via constructor

**Exercise:** Create a simple `HelloModule` with a `HelloController` and a `HelloService` that returns `{ message: "Hello World" }`.

### Day 8 — Pipes, Guards, Interceptors (the holy trinity)
Topics:
1. **Pipes** — transform & validate input before it hits the controller (`ValidationPipe`, `class-validator`, `class-transformer`)
2. **Guards** — decide whether a request is allowed (`JwtAuthGuard`)
3. **Interceptors** — transform response shape before it goes out (use for standardizing the response envelope)
4. **Exception Filters** — catch errors and return proper HTTP status codes

**Exercise:** Add `ValidationPipe` globally in `main.ts`:
```ts
app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
```

### Day 9 — Project Module Structure
Create these modules:
```
src/
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
    dto/
      register.dto.ts
      login.dto.ts
      verify-otp.dto.ts
      resend-otp.dto.ts
      forgot-password.dto.ts
      reset-password.dto.ts
      google-login.dto.ts
      refresh-token.dto.ts
  users/
    users.module.ts
    users.service.ts
  email/
    email.module.ts
    email.service.ts
  prisma/
    prisma.module.ts
    prisma.service.ts
  common/
    decorators/
      current-user.decorator.ts
    guards/
      jwt-auth.guard.ts
    interceptors/
      response.interceptor.ts (normalizes all responses)
    filters/
      http-exception.filter.ts
```

---

## Phase 3: Core Infrastructure (Days 10–13)

### Day 10 — PrismaService
```ts
// src/prisma/prisma.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}
```

Make `PrismaModule` global with `@Global()`.

### Day 11 — EmailService (Nodemailer)
```ts
// src/email/email.service.ts
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private transporter: nodemailer.Transporter;

  constructor(private config: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: config.get('SMTP_HOST'),
      port: config.get<number>('SMTP_PORT'),
      secure: false,
      auth: {
        user: config.get('SMTP_USER'),
        pass: config.get('SMTP_PASS'),
      },
    });
  }

  async sendOtp(email: string, name: string, otp: string, purpose: 'register' | 'reset_password') {
    const subject = purpose === 'register' ? 'Verify your email' : 'Reset your password';
    await this.transporter.sendMail({
      from: this.config.get('SMTP_FROM'),
      to: email,
      subject,
      html: `
        <h2>Hello ${name},</h2>
        <p>Your verification code is:</p>
        <h1 style="letter-spacing: 8px;">${otp}</h1>
        <p>This code expires in 15 minutes.</p>
        <p>If you did not request this, ignore this email.</p>
      `,
    });
  }
}
```

### Day 12 — JWT Service
```ts
// src/auth/auth.service.ts (JWT helpers)
import { JwtService } from '@nestjs/jwt';

// Access token payload: { sub: userId, email, role }
// Access token expires: '30m'
// Refresh token payload: { sub: userId, jti: uuid } 
// Refresh token expires: '30d'

async generateTokens(userId: number, email: string, role: string) {
  const [accessToken, refreshToken] = await Promise.all([
    this.jwtService.signAsync(
      { sub: userId, email, role },
      { secret: this.config.get('JWT_ACCESS_SECRET'), expiresIn: '30m' }
    ),
    this.jwtService.signAsync(
      { sub: userId, jti: randomUUID() },
      { secret: this.config.get('JWT_REFRESH_SECRET'), expiresIn: '30d' }
    ),
  ]);

  // Hash the refresh token before storing
  const tokenHash = await bcrypt.hash(refreshToken, 10);
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  
  await this.prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt }
  });

  return { accessToken, refreshToken };
}
```

### Day 13 — JwtAuthGuard + CurrentUser Decorator
```ts
// src/common/guards/jwt-auth.guard.ts
@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private config: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw new UnauthorizedException();

    const token = authHeader.split(' ')[1];
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.config.get('JWT_ACCESS_SECRET'),
      });
      req.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
}

// src/common/decorators/current-user.decorator.ts
export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  }
);
```

---

## Phase 4: Auth Endpoints — Implementation (Days 14–26)

### Day 14 — DTOs with class-validator

Install: `npm install class-validator class-transformer`

```ts
// src/auth/dto/register.dto.ts
import { IsString, MinLength, IsEmail, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'Name must be at least 3 characters' })
  name: string;

  @IsString()
  @Matches(/^(?:\+8801|8801|01)[0-9]{9}$/, { message: 'Enter a valid Bangladeshi mobile number' })
  phone: string;

  @IsEmail({}, { message: 'Enter a valid email address' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password: string;

  @IsString()
  password_confirmation: string;
}
```

Create DTOs for ALL 10 endpoints. Apply `@ApiProperty()` from `@nestjs/swagger` to each field.

---

### Day 15 — `POST /auth/register`
**Logic:**
1. Check if email already exists → 409 Conflict if yes
2. Check `password !== password_confirmation` → 422
3. Hash password with `bcrypt.hash(password, 12)`
4. Create user in DB with `emailVerified: false`, role: `reader`
5. Generate 6-digit OTP code: `Math.floor(100000 + Math.random() * 900000).toString()`
6. Hash the OTP with `bcrypt.hash(otp, 10)`, store in `OtpCode` table with `purpose: 'register'`, `expiresAt: now + 15min`
7. Send OTP email via `EmailService.sendOtp()`
8. Return `{ status: true, message: 'Verification code sent to your email' }`

**Response shape:**
```json
{ "status": true, "message": "Verification code sent to your email" }
```

---

### Day 16 — `POST /auth/verify-otp`
**Logic:**
1. Find user by email → 404 if not found
2. Check if account is locked (`isLocked: true`) → 423 Locked
3. Find latest active OTP for this user+purpose that hasn't been used and hasn't expired
4. Increment `attempts` counter
5. If `attempts >= 3` → lock account (`isLocked: true`), return 429 Too Many Requests
6. `bcrypt.compare(inputOtp, storedHash)` → if false, save incremented attempts, return 400
7. If valid: mark OTP as used (`usedAt: now`), reset `attempts`
8. If `purpose === 'register'`: update `emailVerified: true` on the user
9. If `purpose === 'reset_password'`: generate a one-time `reset_token` (UUID or JWT), hash it, store in `ResetToken` table with 15-min expiry, return it in response
10. Return:
```json
// register:
{ "status": true, "message": "Email verified successfully" }
// reset_password:
{ "status": true, "message": "OTP verified", "data": { "reset_token": "..." } }
```

---

### Day 17 — `POST /auth/resend-otp`
**Logic:**
1. Find user by email → 404 if not found
2. Check if `isLocked` → 423
3. Check rate limit: how many OTPs created in the last 15 minutes? If ≥ 3 → 429
4. Invalidate (soft-delete or mark expired) all previous unused OTPs for same user+purpose
5. Generate new OTP, hash it, store it, send email
6. Return `{ status: true, message: "New verification code sent" }`

---

### Day 18 — `POST /auth/forgot-password`
**Logic:**
1. Find user by email — do NOT reveal whether user exists (return same message whether found or not — prevents email enumeration)
2. If found: check `emailVerified: true`, if not → return generic message
3. Generate and send OTP with `purpose: 'reset_password'`
4. Always return: `{ status: true, message: "If this email is registered, you will receive a code" }`

---

### Day 19 — `POST /auth/reset-password`
**Request body:**
```json
{ "email": "...", "reset_token": "...", "password": "...", "password_confirmation": "..." }
```

**Logic:**
1. Validate `password === password_confirmation`
2. Find user by email
3. Find the ResetToken record for this user that has not expired and has not been used
4. `bcrypt.compare(inputToken, storedHash)` → 400 if invalid
5. `bcrypt.hash(newPassword, 12)` — update user's `passwordHash`
6. Mark `ResetToken.usedAt = now`
7. Revoke ALL existing refresh tokens for this user (force re-login everywhere)
8. Unlock account if it was locked: `isLocked: false`
9. Return `{ status: true, message: "Password reset successfully" }`

---

### Day 20 — `POST /auth/login`
**Logic:**
1. Find user by email → 401 if not found (do not distinguish between "not found" and "wrong password")
2. If `passwordHash === null` (Google-only account) → 401 with message "Use Google sign-in"
3. `bcrypt.compare(password, passwordHash)` → 401 if fail
4. Check `emailVerified: true` → 403 with message "Please verify your email first"
5. Check `isLocked: false` → 423 if locked
6. Call `generateTokens(userId, email, role)` → store refresh token hash in DB
7. Return full auth response (see schema above)

---

### Day 21 — `POST /auth/google`
**Request body:** `{ "id_token": "..." }`

**Google ID token verification (no Passport.js):**
```ts
import { OAuth2Client } from 'google-auth-library';
// npm install google-auth-library

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async verifyGoogleToken(idToken: string) {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  return {
    googleId: payload.sub,
    email: payload.email,
    name: payload.name,
    avatar: payload.picture,
    emailVerified: payload.email_verified,
  };
}
```

**Logic:**
1. Verify the Google ID token using Google's public keys via `google-auth-library`
2. Find user by `googleId` OR `email`
3. **If user found:** Link `googleId` if it was null, mark `emailVerified: true`, generate tokens
4. **If user NOT found:** Auto-create account with `emailVerified: true`, `phone: null`, `passwordHash: null`, role: `reader` — then generate tokens
5. **Phone number required flag:** If user has no phone, the frontend should be informed so it can prompt. Add `requiresPhone: true` to the response data if `phone === null`.
6. Return full auth response

> **Note:** Add `GOOGLE_CLIENT_ID` to `.env`.

---

### Day 22 — `GET /auth/me` (Protected)
```ts
@UseGuards(JwtAuthGuard)
@Get('me')
async getMe(@CurrentUser() user: JwtPayload) {
  const dbUser = await this.usersService.findById(user.sub);
  if (!dbUser) throw new UnauthorizedException();
  return {
    status: true,
    data: { user: this.mapUser(dbUser) }
  };
}
```

---

### Day 23 — `POST /auth/refresh`
**Request body:** `{ "refresh_token": "..." }`

**Logic:**
1. Verify the refresh token JWT signature using `JWT_REFRESH_SECRET`
2. Extract `sub` (userId) from the payload
3. Find all valid (non-revoked, non-expired) RefreshTokens for this user
4. Loop through and `bcrypt.compare(inputToken, storedHash)` to find the matching record
5. If not found or expired → 401
6. Revoke the old refresh token (`revokedAt: now`)
7. Generate new access token + new refresh token (token rotation)
8. Return: `{ status: true, data: { access_token: "...", refresh_token: "..." } }`

---

### Day 24 — `POST /auth/logout` (Protected)
**Request body:** `{ "refresh_token": "..." }`

**Logic:**
1. Extract userId from JWT (via `JwtAuthGuard`)
2. Find and revoke the matching refresh token
3. Return `{ status: true, message: "Logged out successfully" }`

---

### Day 25 — Global Response Interceptor
All responses must be wrapped in the `{ status, message, data }` envelope:

```ts
// src/common/interceptors/response.interceptor.ts
@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        if (data && 'status' in data) return data; // already formatted
        return { status: true, message: 'Success', data };
      })
    );
  }
}
```

Register globally in `main.ts`:
```ts
app.useGlobalInterceptors(new ResponseInterceptor());
```

### Day 26 — Global Exception Filter

```ts
// src/common/filters/http-exception.filter.ts
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    
    const status = exception instanceof HttpException
      ? exception.getStatus()
      : 500;
    
    const message = exception instanceof HttpException
      ? (exception.getResponse() as any).message ?? exception.message
      : 'Internal server error';

    res.status(status).json({
      status: false,
      message: Array.isArray(message) ? message[0] : message,
    });
  }
}
```

---

## Phase 5: Security Hardening (Days 27–29)

### Day 27 — Rate Limiting & Helmet
```bash
npm install @nestjs/throttler helmet
```

In `AppModule`:
```ts
ThrottlerModule.forRoot([{ ttl: 60000, limit: 20 }]) // 20 req/min global
```

On sensitive endpoints (login, forgot-password, resend-otp):
```ts
@UseGuards(ThrottlerGuard)
@Throttle({ default: { ttl: 60000, limit: 5 } }) // 5 req/min
```

In `main.ts`:
```ts
import helmet from 'helmet';
app.use(helmet());
```

### Day 28 — CORS & Environment Validation
```ts
// main.ts
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
});
```

Validate all env vars at startup using `Joi`:
```bash
npm install joi
```
```ts
ConfigModule.forRoot({
  validationSchema: Joi.object({
    DATABASE_URL: Joi.string().required(),
    JWT_ACCESS_SECRET: Joi.string().min(32).required(),
    JWT_REFRESH_SECRET: Joi.string().min(32).required(),
    SMTP_HOST: Joi.string().required(),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USER: Joi.string().required(),
    SMTP_PASS: Joi.string().required(),
    SMTP_FROM: Joi.string().required(),
    GOOGLE_CLIENT_ID: Joi.string().required(),
    FRONTEND_URL: Joi.string().uri().required(),
  })
})
```

### Day 29 — Swagger (Dev Only)
```ts
// main.ts
if (process.env.NODE_ENV !== 'production') {
  const config = new DocumentBuilder()
    .setTitle('Business Pedia API')
    .setDescription('Auth endpoints')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
}
```

---

## Phase 6: Testing (Days 30–32)

### Day 30 — Unit Tests
Write Jest unit tests for `AuthService` business logic:
- `register()` — duplicate email, password mismatch
- `verifyOtp()` — expired OTP, wrong OTP, account lockout at attempt 3
- `login()` — wrong password, unverified email, locked account
- `refresh()` — expired refresh token, revoked refresh token

```bash
npm run test
```

### Day 31 — E2E Tests
Use `@nestjs/testing` + `supertest`:
```ts
// test/auth.e2e-spec.ts
it('POST /auth/register → 201', () => {
  return request(app.getHttpServer())
    .post('/auth/register')
    .send({ name: 'Test User', phone: '01712345678', email: 'test@example.com', password: 'password123', password_confirmation: 'password123' })
    .expect(201)
    .expect(res => expect(res.body.status).toBe(true));
});
```

Cover the happy-path for all 10 endpoints.

### Day 32 — Fix Failures & Code Review
- Run all tests, fix failures
- Review all response shapes against the frontend contract table above
- Check: are all error messages consistent with what `authStore.error` expects?

---

## Phase 7: Deployment (Days 33–35)

### Day 33 — Dockerize
Create `Dockerfile`:
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

Create `docker-compose.yml`:
```yaml
version: '3.8'
services:
  api:
    build: .
    ports:
      - "3001:3001"
    env_file: .env.production
    depends_on:
      - postgres
  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: business_pedia
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - pgdata:/var/lib/postgresql/data
volumes:
  pgdata:
```

### Day 34 — VPS Setup (Hetzner CX22 — ~$5/month)
```bash
# On the VPS:
apt update && apt install -y docker.io docker-compose-v2
git clone <your-repo>
cd <repo>
cp .env.example .env.production  # fill in real values
docker compose up -d
npx prisma migrate deploy  # run migrations on the production DB
```

Set up Nginx as reverse proxy:
```nginx
server {
  listen 80;
  server_name api.yourdomain.com;
  location / {
    proxy_pass http://localhost:3001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
  }
}
```

Add SSL with Let's Encrypt:
```bash
apt install certbot python3-certbot-nginx
certbot --nginx -d api.yourdomain.com
```

### Day 35 — Production Checklist & Smoke Test
- [ ] All 10 endpoints return correct status codes
- [ ] CORS only allows the Nuxt frontend's domain
- [ ] Swagger is not accessible at `/api/docs` in production
- [ ] OTP emails are received within 30 seconds
- [ ] Refresh token rotation works correctly
- [ ] Google sign-in works end-to-end with the Nuxt frontend
- [ ] Account lockout triggers after 3 failed OTP attempts
- [ ] Reset token is single-use and expires in 15 minutes
- [ ] All refresh tokens are revoked after password reset
- [ ] bcrypt rounds ≥ 12 everywhere

---

## Security Checklist (Non-Negotiable)

| Rule | Implementation |
|---|---|
| Never store raw tokens | Always store `bcrypt.hash(token, 10)` |
| Never reveal if email exists | Forgot-password always returns same message |
| Password hashing | bcrypt with cost factor 12 |
| OTP hashing | bcrypt (so even DB admins can't read it) |
| Refresh token rotation | Issue new refresh token on every refresh |
| Token family detection | Revoke all tokens on reuse detection (future improvement) |
| HTTPS enforced | Nginx + Let's Encrypt on VPS |
| Helmet | HTTP security headers |
| Rate limiting | 5 req/min on login/forgot-password/resend-otp |
| CORS lockdown | Only your frontend's origin allowed |
| Env validation | Joi validation at startup rejects missing vars |

---

## Learning Resources (in order)

| Week | Resource |
|---|---|
| Week 1 | TypeScript Handbook (official) + NestJS docs "First Steps" |
| Week 2 | Prisma "Getting Started" + PostgreSQL Tutorial (PostgreSQL.org) |
| Week 3 | NestJS docs: Guards, Pipes, Interceptors, Exception Filters |
| Week 4 | NestJS docs: JWT authentication + Testing |
| Week 5 | Docker "Get Started" guide + Nginx basics |

**YouTube (supplement):** "NestJS Crash Course" by Traversy Media, "Prisma with NestJS" by Fireship.

---

## Summary Timeline

| Phase | Days | Deliverable |
|---|---|---|
| 0 — Environment Setup | 1–3 | TypeScript, PG, NestJS boilerplate running |
| 1 — Database | 4–6 | Prisma schema migrated and queryable |
| 2 — Architecture | 7–9 | All modules, folders, pipes, guards scaffolded |
| 3 — Infrastructure | 10–13 | Prisma, Email, JWT services all working |
| 4 — Endpoints | 14–26 | All 10 auth endpoints implemented |
| 5 — Security | 27–29 | Rate limiting, CORS, Helmet, Swagger setup |
| 6 — Testing | 30–32 | Unit + E2E tests passing |
| 7 — Deployment | 33–35 | Live on VPS with SSL |
| **Total** | **35 days** | **Production-ready auth backend** |

