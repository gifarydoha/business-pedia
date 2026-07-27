# Free Hosting Options for NestJS Backend

### ⚠️ The Big Problem with "Free"
Most free tiers **spin down after 15 minutes of inactivity** — meaning the first request after idle takes **30–60 seconds** to respond. That's a dealbreaker for an auth system (login page would freeze on first visit).

---

## The Ones Worth Using

| Platform | Sleeps? | Free PostgreSQL | Notes |
|---|---|---|---|
| **Koyeb** | ❌ No sleep | ❌ (use Neon) | Best free option. 1 nano service, always on |
| **Fly.io** | ❌ No sleep | ❌ (use Neon) | 3 shared VMs free. Needs `flyctl` CLI |
| **Railway** | ❌ No sleep | ✅ Included | $5 credit/month free — lasts ~1–3 months small traffic |
| **Render** | ✅ Sleeps! | ✅ 90 days free only | Not suitable for auth |
| **Vercel** | Serverless | ❌ | NestJS doesn't fit well on serverless |

### Free PostgreSQL (pair with above)

| Platform | Free Tier | Notes |
|---|---|---|
| **Neon** | 0.5 GB, serverless | Best free PG. Never expires. Scales to 0 when idle |
| **Supabase** | 500 MB, 2 projects | Good, but pauses after 7 days inactivity |
| **Railway** | Included in plan | Easiest — one platform for everything |

---

## My Recommendation: Koyeb + Neon

### Why:
- **Koyeb** free tier never sleeps, has a real always-on server
- **Neon** free PostgreSQL never expires and works perfectly with Prisma
- Combined: **$0/month**, production-ready, no cold start problems

### How to deploy:
```bash
# On Koyeb:
# 1. Connect your GitHub repo
# 2. Set build command: npm run build
# 3. Set start command: node dist/main.js
# 4. Set env vars (DATABASE_URL from Neon, JWT secrets, etc.)

# Neon:
# 1. Sign up at neon.tech
# 2. Create a project → copy the connection string
# 3. Use it as DATABASE_URL in Koyeb
# 4. Run migrations: npx prisma migrate deploy
```

---

## If you want Zero Config: Railway
Railway gives you **$5 free credit/month** with PostgreSQL included on the same platform. For small traffic (early stage app), $5 credit can last **1–3 months** before you need to pay. Easiest setup of all — connect GitHub, done.

**Bottom line:** Use **Koyeb + Neon** for truly free with no expiry, or **Railway** if you want everything in one place and don't mind the credit eventually running out.