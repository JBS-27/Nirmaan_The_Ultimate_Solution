# Nirmaan — Construction OS

Digital twin of a residential site: materials, crew, bills, cash envelope, and a project-aware assistant. India-first (Bengaluru rates, INR).

This repo is a **TanStack Start** app (React 19, Tailwind v4, Better Auth, Postgres). Keep this stack — do not rewrite it as Next.js.

## What works

1. **Sign in** — Google, X, and email + password. After login you land on `/app` (or `/onboarding` the first time).
2. **Create a project** — plot, city, floors, budget, dates. Nirmaan drafts 8 phases and a live BOQ.
3. **Project dashboard** — progress, envelope, cement/steel leftovers, materials, crew attendance/payouts, bills, money, photos, daily log.
4. **Marketplace** — `/marketplace` is public (Bengaluru-first directory). Quote/hire after sign-in at `/app/market`.
5. **Digital twin** — `/twin` explains the 8-phase ledger; signed-in visitors can open their live site book.
6. **Ask the twin** — `/app/assistant` answers from that project’s BOQ, bills, crew and schedule (xAI when `XAI_API_KEY` is set; otherwise a ledger-based fallback).

Homeowner path: **Sign in → Create project → Dashboard → Materials & crew → Attendance & bills → Ask the twin.**

## Run locally

```bash
npm install
npm run dev
```

The app listens on `0.0.0.0:8080`. Auth and data work without a `.env` file: email/password uses the local embedded Postgres (PGLite). Google/X use the baked preview broker in this workspace.

```bash
npm run typecheck
npm run build
```

`npm run build` also applies `migrations/*.sql` when `DATABASE_URL` is set.

## Environment variables

Do **not** commit a `.env` file. Set these on Vercel (or your host).

| Variable | Required | Where | Purpose |
|---|---|---|---|
| `DATABASE_URL` | Yes on deploy | server | Neon / Postgres connection string. Local preview falls back to PGLite. |
| `BETTER_AUTH_SECRET` | Yes on deploy | server | Signs sessions. Generate a long random string. |
| `BETTER_AUTH_URL` | Yes on deploy | server | Public origin, e.g. `https://nirmaan-the-ultimate-solution.vercel.app` |
| `GOOGLE_CLIENT_ID` | Yes for Google on Vercel | server | OAuth 2.0 client ID from Google Cloud. |
| `GOOGLE_CLIENT_SECRET` | Yes for Google on Vercel | server | OAuth 2.0 client secret from Google Cloud. |
| `GROK_AUTH_ISSUER` | Optional | server | Defaults to `https://auth.grok.me` (sandbox Google + X broker). |
| `GROK_AUTH_CLIENT_ID` | Optional | server | Per-app broker client (Grok sandbox only). |
| `GROK_AUTH_CLIENT_SECRET` | Optional | server | Per-app broker secret (Grok sandbox only). |
| `XAI_API_KEY` | Optional | server | Grok API for assistant, bill OCR, plan read, schedule notes. Without it, the assistant still answers from the project ledger. |
| `VITE_AUTH_ENABLED` | Do not set to `false` | client | Omit this key (or anything other than `"false"`) so sign-in stays on. |

On Vercel, Google is this app’s own Better Auth provider (`GOOGLE_CLIENT_*`). In Google Cloud, set:

- Authorised JavaScript origins: `https://nirmaan-the-ultimate-solution.vercel.app`
- Authorised redirect URIs: `https://nirmaan-the-ultimate-solution.vercel.app/api/auth/callback/google`

Then add `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` on Vercel (Production) and Redeploy. Email + password still works without those.

On [Grok App Builder](https://grok.com) deploy, `DATABASE_URL`, auth broker credentials, and `XAI_API_KEY` are injected for you. On a standalone Vercel project you must set them yourself.

## Routes

| Path | Who | What |
|---|---|---|
| `/` | Public | Marketing landing (unchanged brand) |
| `/login` | Public | Google, X, email |
| `/marketplace` | Public | Directory + request/hire CTAs |
| `/twin` | Public | Digital twin explainer |
| `/dashboard`, `/projects` | Signed-in | Aliases → `/app` |
| `/app` | Signed-in | Site list |
| `/app/new` | Signed-in | Plant a project |
| `/app/projects/:id` | Signed-in | Live twin (materials, crew, bills, money) |
| `/app/assistant` | Signed-in | Ask the twin |
| `/app/market` | Signed-in | Quote, hire, order |

## Database

Schema lives in `migrations/`:

- `0001_auth.sql` — Better Auth users/sessions (copied from `migrations/auth/`)
- `0002_schema.sql` — projects, phases, BOQ, crew, bills, marketplace
- `0003_ops.sql` — change orders, daily logs
- `0004_links.sql` — bill → phase/material, profile email/photo

Per-user rows are scoped by the verified session (`authMiddleware`). Never send a client-side user id.

## Deploy

Same Vercel project is fine. Set the env table above, then:

```bash
npm run build
```

Vercel should use the repo’s build command (`vite build` via `npm run build`). Ensure the production origin matches `BETTER_AUTH_URL` or Google/X callbacks will fail.
