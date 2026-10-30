# Staging deployment

The repository is a monorepo. Deploy the frontend and backend as separate services from the existing GitHub repository `Yokaai-A/Nexiera`, branch `main`.

## Frontend â€” Vercel

1. Import the GitHub repository in Vercel and set **Root Directory** to `nexiera-frontend`.
2. Leave the framework as Next.js and enable deployments from `main`.
3. Add `NEXT_PUBLIC_API_BASE_URL=https://<backend-host>/api` to the Vercel environment used for staging/production. The frontend proxies API and private upload requests through its own origin so the authentication cookie remains first-party.

Vercel monorepo projects deploy from their configured root directory when the linked branch receives a push. See [Vercel monorepo setup](https://vercel.com/docs/monorepos) and [Git deployments](https://vercel.com/docs/git).

## Backend â€” Render

1. Create a Render Web Service from the same GitHub repository and set **Root Directory** to `nexiera-backend`.
2. Enable deployment from `main`.
3. Build command: `npm ci --include=dev && npm run build`. The migration CLI is currently a dev dependency, so keep dev dependencies available in the deployment image.
4. Start command: `npm run start:prod`. This runs `npx prisma migrate deploy` before starting NestJS; a failed migration stops startup.
5. Configure a reachable managed PostgreSQL database. Do not use the local credentials from `.env.example`.
6. Create a Supabase project and two Storage buckets: public `nexiera-public` for banners/profile images and private `nexiera-private` for proofs and documents.
7. In the Render backend service environment, set `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `SUPABASE_PUBLIC_BUCKET=nexiera-public`, and `SUPABASE_PRIVATE_BUCKET=nexiera-private`, then deploy. Keep the secret key only in Render; never use a `NEXT_PUBLIC_` variable for it.

The backend uploads files directly to Supabase Storage. The public bucket serves uploaded images; private documents remain in a private bucket and are downloaded only through the backend's existing authorization checks. Supabase Free currently includes 1 GB of file storage and 5 GB each of cached and uncached egress; free projects can pause after a week of inactivity. See [Supabase Storage uploads](https://supabase.com/docs/guides/storage/uploads/standard-uploads), [bucket access models](https://supabase.com/docs/guides/storage/buckets/fundamentals), and [Free Plan quotas](https://supabase.com/docs/guides/platform/billing-on-supabase).

## Backend environment variables

Set these in the Render backend service environment; do not upload or commit `.env` files.

| Variable | Staging value |
| --- | --- |
| `DATABASE_URL` | Managed PostgreSQL connection URL used by Prisma migrations |
| `DATABASE_HOST` | Cloud PostgreSQL host reachable by the backend service |
| `DATABASE_PORT` | Cloud PostgreSQL port, normally `5432` |
| `DATABASE_NAME` | Cloud database name |
| `DATABASE_USER` | Restricted application database user |
| `DATABASE_PASSWORD` | Application database password |
| `FRONTEND_URL` | Exact HTTPS Vercel origin, without a path |
| `BACKEND_URL` | Public HTTPS backend URL |
| `JWT_SECRET` | Random secret of at least 32 characters |
| `AUTH_COOKIE_NAME` | `nexiera_access_token` |
| `ADMIN_EMAILS` | Comma-separated admin account emails |
| `EMAIL_VERIFICATION_DEV_LINKS` | Optional; when `true` and Resend is configured, return verification links directly instead of emailing them |
| `MIDTRANS_SERVER_KEY` | Midtrans sandbox key for staging, production key for live payments |
| `MIDTRANS_IS_PRODUCTION` | `false` for sandbox, `true` only for live Midtrans |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Supabase server-only secret key; never expose to the frontend |
| `SUPABASE_PUBLIC_BUCKET` | `nexiera-public` |
| `SUPABASE_PRIVATE_BUCKET` | `nexiera-private` |
| `DEMO_MODE` | Set `true` only for the demo deployment to show all classes with 20–30 open seats, generated sample schedules/material links, and direct demo enrollment without Midtrans |
| `RESEND_API_KEY` | Optional; only needed to send verification and notification emails |
| `MAIL_FROM` | Optional; only needed to send email from a Resend verified sender domain |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional; set only if Google login is enabled |
| `GOOGLE_CALLBACK_URL` | `https://<frontend-host>/api/auth/google/callback` when Google login is enabled; add this exact URL to the Google OAuth client's authorized redirect URIs |

The frontend additionally needs `NEXT_PUBLIC_API_BASE_URL=https://<backend-host>/api` in Vercel. Do not expose backend secrets in Vercel variables prefixed with `NEXT_PUBLIC_`.

## Current readiness limits

- `nexiera-backend/.env.example` contains local database placeholders. Cloud database values must be supplied in Render.
- `MIDTRANS_SERVER_KEY` is not configured locally. Checkout remains unavailable until the correct sandbox or production key is added.
- When Resend is not configured, email/password signup activates the account immediately so users can register and log in without email verification. With Resend configured, accounts must verify by email unless `EMAIL_VERIFICATION_DEV_LINKS=true`, which returns the verification link in the signup/resend response.
- Local development falls back to filesystem storage. Render production uploads require Supabase configuration; existing local files are copied to Supabase on startup when still present, and missing files must be uploaded again.
- For the demo deployment, set `DEMO_MODE=true` on the Render backend service. This presents stable, class-specific 20–30 open seats, future sample dates, Jitsi demo rooms, and sample material links; it disables quota enforcement and marks paid-class demo enrollments active while preserving the listed class price in the demo transaction, without calling Midtrans. Leave it `false` for a real marketplace deployment.
- Rotate any Resend API key that has appeared in diagnostic output before configuring it in the cloud.

## Push behavior

The GitHub Actions workflow builds both apps on pushes to `main` and pull requests. Once the repository is connected in Vercel and Render with the root directories above, those providers separately build and deploy their services from pushes to `main`. No deployment provider account has been connected from this workspace.

