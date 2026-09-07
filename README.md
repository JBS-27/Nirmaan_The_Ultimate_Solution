# Nirmaan — Construction OS

Digital twin of a residential site: materials, crew, bills, cash envelope, and a project-aware assistant. India-first (Bengaluru rates, INR).

This repo is a **TanStack Start** app (React 19, Tailwind v4, Better Auth, Postgres). Keep this stack — do not rewrite it as Next.js / NextAuth / Clerk. Sessions are this app’s own Better Auth cookies at `/api/auth/*`.

## Homeowner path

**Sign in → (first time) onboarding → Dashboard → Create project → Project twin (materials, crew, bills) → Ask the twin → Marketplace hire/quote.**

After a successful login you always land on `/dashboard` and you stay signed in. Protected pages wait for the session; they do not bounce you back to `/login` while it is still loading.

## Run locally

```bash
npm install
npm run dev
```

The app listens on `0.0.0.0:8080`. Email + password works with the embedded Postgres (PGLite) and no `.env` file.

```bash
npm run typecheck
npm run build
```

`npm run build` applies `migrations/*.sql` when `DATABASE_URL` is set.

## Environment variables (Vercel)

Do **not** commit a `.env` file. Add these in Vercel → Project → Settings → Environment Variables (Production). Then **Redeploy**.

### Required for a working login on Vercel

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | **Yes** | Neon / Postgres connection string. |
| `BETTER_AUTH_SECRET` | **Yes** (or `AUTH_SECRET`) | Signs sessions. Must be the **same** on every serverless instance. Generate with `openssl rand -base64 32`. |
| `BETTER_AUTH_URL` | **Yes** | Exact public origin: `https://nirmaan-the-ultimate-solution.vercel.app` (no trailing slash). |
| `GOOGLE_CLIENT_ID` | For Google | Google Cloud OAuth 2.0 client ID. |
| `GOOGLE_CLIENT_SECRET` | For Google | Google Cloud OAuth 2.0 client secret. |
| `TWITTER_CLIENT_ID` | For X | X (Twitter) OAuth 2.0 client ID. |
| `TWITTER_CLIENT_SECRET` | For X | X (Twitter) OAuth 2.0 client secret. |

`AUTH_SECRET` is accepted as an alias of `BETTER_AUTH_SECRET`. `X_CLIENT_ID` / `X_CLIENT_SECRET` are accepted as aliases of the Twitter pair.

### Optional

| Variable | Purpose |
|---|---|
| `GROK_AUTH_ISSUER` | Defaults to `https://auth.grok.me` (Grok sandbox broker only). |
| `GROK_AUTH_CLIENT_ID` | Per-app broker client (Grok sandbox). |
| `GROK_AUTH_CLIENT_SECRET` | Per-app broker secret (Grok sandbox). |
| `XAI_API_KEY` | Preferred LLM for Ask the twin (xAI Grok). |
| `OPENAI_API_KEY` | Fallback LLM (gpt-4o-mini). |
| `GEMINI_API_KEY` | Fallback LLM (Gemini). |

Without any AI key the twin still answers from the project ledger (cement left, budget, crew, next steps).
| `VITE_AUTH_ENABLED` | **Do not set to `false`** on Vercel or every visitor is rejected. |

### Google Cloud console

- Authorised JavaScript origins: `https://nirmaan-the-ultimate-solution.vercel.app`
- Authorised redirect URI: `https://nirmaan-the-ultimate-solution.vercel.app/api/auth/callback/google`

### X developer portal

- Callback URI: `https://nirmaan-the-ultimate-solution.vercel.app/api/auth/callback/twitter`
- App permissions must include email if you want it on the profile.

Email + password works without Google or X credentials.

## Database migrations

Schema lives in `migrations/` and is applied automatically on `npm run build` when `DATABASE_URL` is set (Vercel build runs this).

| File | What |
|---|---|
| `0001_auth.sql` | Better Auth users / sessions |
| `0002_schema.sql` | projects, phases, BOQ, crew, bills, marketplace |
| `0003_ops.sql` | change orders, daily logs |
| `0004_links.sql` | bill → phase/material, profile email/photo |
| `0005_market_requests.sql` | persisted Hire / Request quote rows |

To apply manually against Neon:

```bash
DATABASE_URL="postgresql://..." npm run db:migrate
```

No other migration command is required. Per-user rows are scoped by the verified session (`authMiddleware`).

## Routes

| Path | Who | What |
|---|---|---|
| `/` | Public | Marketing landing |
| `/login` | Public | Google, X, email |
| `/marketplace` | Public | Live directory; Hire / Request quote (signed-in) |
| `/twin` | Public | Digital twin; live numbers when signed in |
| `/dashboard` | Signed-in | Workspace dashboard (sites, envelope, progress) |
| `/projects` | Signed-in | Same site list |
| `/app` | Signed-in | Same workspace |
| `/app/new` | Signed-in | Plant a project |
| `/app/projects/:id` | Signed-in | Live twin — materials, crew, bills, money, Ask the twin |
| `/app/assistant` | Signed-in | Ask the twin |
| `/app/market` | Signed-in | Quote, hire, order |

## Deploy

Set the env table, then push or Redeploy on Vercel. The production origin **must** match `BETTER_AUTH_URL` or Google/X callbacks fail.

If you were bounced to `/login` after signing in, that was an unstable session secret (a new random secret on every serverless cold start). Setting `BETTER_AUTH_SECRET` (and this release’s stable fallback) fixes that loop.
