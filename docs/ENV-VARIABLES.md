# ENV-VARIABLES.md — Environment Variables Reference

> Every environment variable used in this project, with purpose, source, and security level.

## How to use this file

1. Copy this file's variables into `.env.example` (committed to git, no real values)
2. Copy values into `.env.local` (NEVER commit — already in `.gitignore`)
3. For production, set each in your hosting provider (Vercel) dashboard
4. Variables prefixed with `NEXT_PUBLIC_` are **client-visible** — never put secrets there

## Security levels

- 🔒 **Secret** — never expose, never commit, rotate if leaked
- 👁️ **Public** — safe to expose to browser (`NEXT_PUBLIC_*`)
- ⚙️ **Config** — not secret but not needed by client

---

## Core application

| Variable                 | Level | Purpose                                       | Where to get      |
| ------------------------ | ----- | --------------------------------------------- | ----------------- |
| `NODE_ENV`               | ⚙️    | `development` / `production` / `test`         | Set by build tool |
| `NEXT_PUBLIC_SERVER_URL` | 👁️    | Full site URL (e.g., `https://yourstore.com`) | Your domain       |
| `PORT`                   | ⚙️    | Local dev port, default `3000`                | N/A               |

---

## Payload CMS

| Variable                    | Level | Purpose                                          | Where to get                        |
| --------------------------- | ----- | ------------------------------------------------ | ----------------------------------- |
| `PAYLOAD_SECRET`            | 🔒    | Encrypts JWTs, cookies. Min 32 random chars      | Generate: `openssl rand -base64 32` |
| `DATABASE_URI`              | 🔒    | Postgres connection string                       | Neon dashboard → Connection Details |
| `PAYLOAD_PUBLIC_SERVER_URL` | 👁️    | Same as NEXT_PUBLIC_SERVER_URL, Payload-specific | Your domain                         |

---

## Cloudflare R2 (file storage)

| Variable               | Level | Purpose                                    | Where to get                               |
| ---------------------- | ----- | ------------------------------------------ | ------------------------------------------ |
| `R2_ENDPOINT`          | ⚙️    | Account-specific S3 endpoint URL           | Cloudflare R2 → Settings → S3 API          |
| `R2_ACCESS_KEY_ID`     | 🔒    | R2 token ID                                | R2 → Manage API tokens                     |
| `R2_SECRET_ACCESS_KEY` | 🔒    | R2 token secret                            | R2 → Manage API tokens (shown once)        |
| `R2_BUCKET`            | ⚙️    | Bucket name                                | The bucket you created                     |
| `R2_PUBLIC_URL`        | 👁️    | Custom domain or pub URL for serving files | Bucket → Settings → Public Development URL |

---

## Stripe

| Variable                             | Level | Purpose                                                      | Where to get                                                                    |
| ------------------------------------ | ----- | ------------------------------------------------------------ | ------------------------------------------------------------------------------- |
| `STRIPE_SECRET_KEY`                  | 🔒    | Server-side Stripe API key (starts `sk_test_` or `sk_live_`) | Stripe Dashboard → Developers → API keys                                        |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | 👁️    | Client-side Stripe key (starts `pk_`)                        | Same place                                                                      |
| `STRIPE_WEBHOOK_SECRET`              | 🔒    | Verifies webhook signatures (starts `whsec_`)                | Dashboard → Webhooks → Endpoint → Signing secret. Local: `stripe listen` output |
| `PAYZENTRIC_ASYNC_URL`               | 👁️    | Payzentric 3D Secure/ASYNC endpoint (test vs prod URL)        | Payzentric rep — swap for the prod URL when going live                          |
| `PAYZENTRIC_PROVIDER_PIN`            | 🔒    | Payzentric-issued provider PIN                                | Payzentric rep                                                                  |
| `PAYZENTRIC_PROCESSOR_USER`          | 🔒    | Payzentric processor username                                 | Payzentric rep                                                                  |
| `PAYZENTRIC_PROCESSOR_PASS`          | 🔒    | Payzentric processor password                                 | Payzentric rep                                                                  |
| `PAYZENTRIC_MERCHANT_USER`           | 🔒    | Payzentric merchant username                                  | Payzentric rep                                                                  |
| `PAYZENTRIC_MERCHANT_PASSWORD`       | 🔒    | Payzentric merchant password                                  | Payzentric rep                                                                  |

---

## Resend (email)

| Variable                | Level | Purpose                                      | Where to get                      |
| ----------------------- | ----- | -------------------------------------------- | --------------------------------- |
| `RESEND_API_KEY`        | 🔒    | API key (starts `re_`)                       | resend.com → API Keys             |
| `RESEND_FROM_EMAIL`     | ⚙️    | Sender address, e.g., `orders@yourstore.com` | Must be verified domain in Resend |
| `RESEND_REPLY_TO`       | ⚙️    | Reply-to address                             | Your support email                |
| `RESEND_WEBHOOK_SECRET` | 🔒    | Verifies Resend delivery webhooks            | Resend → Webhooks (Phase 14)      |

---

## Shippo (shipping)

| Variable                | Level | Purpose                           | Where to get                                                |
| ----------------------- | ----- | --------------------------------- | ----------------------------------------------------------- |
| `SHIPPO_API_TOKEN`      | 🔒    | Test or live token                | goshippo.com → API Tokens. Use test mode token until launch |
| `SHIPPO_WEBHOOK_SECRET` | 🔒    | For tracking webhook verification | Shippo dashboard → Webhooks                                 |

---

## Meilisearch (search, Phase 16)

| Variable                             | Level | Purpose                                                                                  | Where to get                             |
| ------------------------------------ | ----- | ---------------------------------------------------------------------------------------- | ---------------------------------------- |
| `MEILISEARCH_HOST`                   | ⚙️    | URL of your instance (e.g., `https://yourstore-search.fly.dev` or Meilisearch Cloud URL) | Self-host setup or Meilisearch Cloud     |
| `MEILISEARCH_MASTER_KEY`             | 🔒    | Admin key for indexing (server-side only)                                                | Set when launching or in cloud dashboard |
| `MEILISEARCH_SEARCH_KEY`             | 🔒    | Read-only key — pass to client when search runs from browser                             | Generated via API or dashboard           |
| `NEXT_PUBLIC_MEILISEARCH_HOST`       | 👁️    | Same as MEILISEARCH_HOST, client-exposed for InstantSearch                               | Same value                               |
| `NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY` | 👁️    | Search-only key for client                                                               | Same as MEILISEARCH_SEARCH_KEY           |

> Note: only the search key (read-only, scoped) goes to client. Master key never leaves server.

---

## Upstash Redis (rate limiting, Phase 19)

| Variable                   | Level | Purpose       | Where to get                      |
| -------------------------- | ----- | ------------- | --------------------------------- |
| `UPSTASH_REDIS_REST_URL`   | ⚙️    | REST endpoint | upstash.com → Database → REST API |
| `UPSTASH_REDIS_REST_TOKEN` | 🔒    | Auth token    | Same place                        |

---

## Sentry (error tracking, Phase 18)

| Variable                 | Level            | Purpose                             | Where to get                       |
| ------------------------ | ---------------- | ----------------------------------- | ---------------------------------- |
| `SENTRY_DSN`             | 👁️ (technically) | Project DSN — client uses this      | sentry.io → Settings → Client Keys |
| `NEXT_PUBLIC_SENTRY_DSN` | 👁️               | Same, explicit public name          | Same                               |
| `SENTRY_AUTH_TOKEN`      | 🔒               | For uploading source maps on deploy | sentry.io → Account → Auth Tokens  |
| `SENTRY_ORG`             | ⚙️               | Your Sentry org slug                | URL slug                           |
| `SENTRY_PROJECT`         | ⚙️               | Project slug                        | URL slug                           |

---

## Analytics

| Variable                         | Level | Purpose                                        | Where to get                               |
| -------------------------------- | ----- | ---------------------------------------------- | ------------------------------------------ |
| `NEXT_PUBLIC_POSTHOG_KEY`        | 👁️    | PostHog project API key                        | posthog.com → Project Settings             |
| `NEXT_PUBLIC_POSTHOG_HOST`       | 👁️    | Usually `https://us.i.posthog.com`             | PostHog docs                               |
| `NEXT_PUBLIC_GA_MEASUREMENT_ID`  | 👁️    | GA4 measurement ID (`G-XXXXXX`)                | analytics.google.com → Admin → Data Stream |
| `NEXT_PUBLIC_GTM_ID`             | 👁️    | Google Tag Manager container ID (`GTM-XXXXXX`) | tagmanager.google.com                      |
| `NEXT_PUBLIC_CLARITY_PROJECT_ID` | 👁️    | Microsoft Clarity ID                           | clarity.microsoft.com → Settings           |

---

## Cloudflare Turnstile (bot protection, Phase 19)

| Variable                         | Level | Purpose                  | Where to get                    |
| -------------------------------- | ----- | ------------------------ | ------------------------------- |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | 👁️    | Public site key          | dash.cloudflare.com → Turnstile |
| `TURNSTILE_SECRET_KEY`           | 🔒    | Server-side verification | Same place                      |

---

## Stripe Tax (Phase 9)

No additional env vars — uses `STRIPE_SECRET_KEY`. Enable Stripe Tax in dashboard manually.

---

## Vercel (set in dashboard, not .env)

| Variable      | Level | Purpose                                            |
| ------------- | ----- | -------------------------------------------------- |
| `VERCEL_URL`  | ⚙️    | Auto-injected per deployment                       |
| `VERCEL_ENV`  | ⚙️    | `production` / `preview` / `development`           |
| `CRON_SECRET` | 🔒    | Verify Vercel Cron requests in your route handlers |

---

## Example `.env.local` skeleton

```bash
# Core
NODE_ENV=development
NEXT_PUBLIC_SERVER_URL=http://localhost:3000

# Payload
PAYLOAD_SECRET=<generate with: openssl rand -base64 32>
DATABASE_URI=postgresql://user:pass@host/db?sslmode=require
PAYLOAD_PUBLIC_SERVER_URL=http://localhost:3000

# Cloudflare R2
R2_ENDPOINT=https://<account>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=peptides-store-dev
R2_PUBLIC_URL=https://pub-<id>.r2.dev

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_
STRIPE_WEBHOOK_SECRET=whsec_

# Resend
RESEND_API_KEY=re_
RESEND_FROM_EMAIL=orders@yourdomain.com
RESEND_REPLY_TO=support@yourdomain.com

# Shippo (test mode token)
SHIPPO_API_TOKEN=shippo_test_

# Sentry
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
SENTRY_ORG=
SENTRY_PROJECT=

# Analytics
NEXT_PUBLIC_POSTHOG_KEY=
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com
NEXT_PUBLIC_GA_MEASUREMENT_ID=
NEXT_PUBLIC_CLARITY_PROJECT_ID=

# Upstash (Phase 19)
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Meilisearch (Phase 16)
MEILISEARCH_HOST=
MEILISEARCH_MASTER_KEY=
NEXT_PUBLIC_MEILISEARCH_HOST=
NEXT_PUBLIC_MEILISEARCH_SEARCH_KEY=

# Turnstile (Phase 19)
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=

# Cron
CRON_SECRET=<generate with: openssl rand -base64 32>
```

---

## Security checklist

- [ ] `.env.local` is in `.gitignore` (Payload's installer sets this)
- [ ] Never log env vars (even in dev)
- [ ] Never paste real keys into AI prompts — use placeholders like `<STRIPE_KEY>`
- [ ] Rotate keys quarterly minimum
- [ ] Use Stripe restricted keys in production where possible
- [ ] R2 keys scoped to specific bucket, not account-wide
- [ ] Resend API keys scoped to single domain
- [ ] If a key is committed by mistake: rotate immediately, then `git filter-repo` to scrub history, then force push. Assume the leaked key is compromised even if private repo.

## Rotation log template

Keep this in a private note (not in repo):

```
Service          | Key ID/Label       | Last Rotated | Next Due
-----------------|--------------------|--------------| --------
Stripe           | sk_live_xxxx       | 2026-05-23   | 2026-08-23
Resend           | re_xxxx            | 2026-05-23   | 2026-08-23
R2               | xxxxxx             | 2026-05-23   | 2026-08-23
...
```
