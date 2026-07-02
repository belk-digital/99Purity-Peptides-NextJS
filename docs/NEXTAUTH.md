# NEXTAUTH.md — NextAuth Authentication Integration

> Replaces the old Clerk-based setup (see git history for `CLERK-AUTH.md`). Payload's `users` collection is the single source of truth for customer accounts; NextAuth is only the session/identity layer on top of it. Payload's admin panel keeps its own separate auth (Payload email/password) for admin users only — unaffected by this.

---

## Architecture

```
CUSTOMER AUTH (NextAuth v4)            ADMIN AUTH (Payload built-in)
────────────────────────────           ─────────────────────────────
NextAuth handles:                      Payload handles:
  - Session cookie (JWT strategy)        - /admin login only
  - Google OAuth                         - Admin role check
  - Credentials (email/password)         - Admin session cookie
         │
         ▼ (signIn / jwt callbacks)
Payload `users` collection
  - googleId (nullable, unique) — set for Google-linked accounts
  - authProvider: 'credentials' | 'google'
  - password — Payload's own hash, used by CredentialsProvider.authorize()
  - pendingEmail / pendingEmailCodeHash / pendingEmailCodeExpiresAt — email-change flow
```

**Session strategy: JWT**, not database-backed. There is no NextAuth Adapter — Payload's `users` collection plays that role. `session.user.id` is always the Payload user's numeric id (as a string), never an external provider id.

---

## Files

- `src/lib/auth/authOptions.ts` — providers, callbacks. Node runtime only (calls Payload's local API directly) — never imported by `src/proxy.ts` (middleware runs on the edge runtime).
- `src/app/api/auth/[...nextauth]/route.ts` — the NextAuth route handler.
- `src/lib/auth/getPayloadUser.ts` — server helper: `getServerSession(authOptions)` → `payload.findByID(session.user.id)`. Use this in server components/actions instead of re-deriving the session by hand.
- `src/lib/auth/next-auth.d.ts` — module augmentation for `Session.user.{id,role,firstName,lastName}` and `JWT.{payloadUserId,role,firstName,lastName}`.
- `src/proxy.ts` — middleware. Uses `next-auth/jwt`'s `getToken()` (edge-safe, cookie-only) to gate `/account(.*)` and `/affiliates/dashboard(.*)`.
- `src/components/providers/AuthSessionProvider.tsx` — client wrapper around `next-auth/react`'s `<SessionProvider>`, used in the root `[locale]/layout.tsx` so the layout itself stays a server component.

## Providers

- **CredentialsProvider**: `authorize()` calls `payload.login({ collection: 'users', data: { email, password } })`. Payload does the password hash comparison; returns `null` on any failure (NextAuth surfaces a generic error).
- **GoogleProvider**: on `signIn`, looks up a Payload user by `googleId`, then by `email` (linking `googleId` onto an existing credentials account if found), then creates a new user (`authProvider: 'google'`, `emailVerified: true`, a random unusable password) if neither exists.

## Password reset

Uses Payload's built-in `forgotPassword`/`resetPassword` local API operations — no custom token/email logic needed. `Users.ts`'s `auth.forgotPassword.generateEmailHTML` points the emailed link at our own `/reset-password/[token]` page (instead of Payload's default admin-facing one). Email delivery goes through the already-configured `resendAdapter` in `payload.config.ts`.

Pages: `src/app/[locale]/(auth)/forgot-password/page.tsx`, `src/app/[locale]/(auth)/reset-password/[token]/page.tsx`.

## Account security self-service (settings page)

`src/components/account/SecurityDialogs.tsx` + server actions in `src/app/[locale]/(frontend)/(shop)/account/settings/actions.ts`:

- **Change password** (`updatePasswordAction`): re-verifies the current password via `payload.login()` (skipped for `authProvider === 'google'` accounts, which have no usable password), then `payload.update`s the new one.
- **Change email** (`requestEmailChangeAction` / `verifyEmailChangeAction`): generates a 6-digit code, HMAC-hashes it with `PAYLOAD_SECRET` as the pepper, stores it + a 10-minute expiry on the user doc (`pendingEmail*` fields), emails it via `payload.sendEmail`, then verifies and swaps `email` on success. No new infrastructure (no Redis) — codes live on the Payload user doc itself.

## Known trade-offs

- **JWT staleness**: `role` (and other embedded claims) reflect what was true at sign-in time; an admin-side role change won't take effect for an already-logged-in user until their session token is re-issued. Same trade-off the old `tokenExpiration: 7200` setup had.
- **Google OAuth setup**: requires a Google Cloud Console OAuth client with authorized redirect URI `{NEXTAUTH_URL}/api/auth/callback/google` — external dashboard config, not code.

## Env vars

```bash
NEXTAUTH_SECRET=
NEXTAUTH_URL=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```
