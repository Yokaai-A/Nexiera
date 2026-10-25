# Staging deployment

The repository is a monorepo. Deploy the frontend and backend as separate services from the existing GitHub repository `Yokaai-A/Nexiera`, branch `main`.

## Frontend — Vercel

1. Import the GitHub repository in Vercel and set **Root Directory** to `nexiera-frontend`.
2. Leave the framework as Next.js and enable deployments from `main`.
3. Add `NEXT_PUBLIC_API_BASE_URL=https://<backend-host>/api` to the Vercel environment used for staging/production, then deploy again after the backend URL is known.

Vercel monorepo projects deploy from their configured root directory when the linked branch receives a push. See [Vercel monorepo setup](https://vercel.com/docs/monorepos) and [Git deployments](https://vercel.com/docs/git).

## Backend — Railway

1. Create a Railway project from the same GitHub repository and set the service **Root Directory** to `nexiera-backend`.
2. Enable deployment from `main`.
3. Build command: `npm ci --include=dev && npm run build`. The migration CLI is currently a dev dependency, so keep dev dependencies available in the deployment image.
4. Start command: `npm run start:prod`. This runs `npx prisma migrate deploy` before starting NestJS; a failed migration stops startup.
5. Add a Railway MySQL service or configure a reachable managed MySQL database. Do not use the local credentials from `.env.example`.
6. Attach persistent storage for both `uploads/` and `private-uploads/` relative to the backend process working directory, or replace local disk storage with private object storage before relying on uploaded documents.

Railway deploys from the connected Git branch and supports build/start command overrides. See [Railway monorepo deployment](https://docs.railway.com/deployments/monorepo) and [build/start commands](https://docs.railway.com/builds/build-and-start-commands).

## Backend environment variables

Set these in the Railway service environment; do not upload or commit `.env` files.

| Variable | Staging value |
| --- | --- |
| `DATABASE_URL` | Cloud MySQL connection URL used by Prisma migrations |
| `DATABASE_HOST` | Cloud MySQL host reachable from the backend service |
| `DATABASE_PORT` | Cloud MySQL port, normally `3306` |
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
| `RESEND_API_KEY` | Optional; only needed to send verification and notification emails |
| `MAIL_FROM` | Optional; only needed to send email from a Resend verified sender domain |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Optional; set only if Google login is enabled |
| `GOOGLE_CALLBACK_URL` | `https://<backend-host>/api/auth/google/callback` when Google login is enabled |

The frontend additionally needs `NEXT_PUBLIC_API_BASE_URL=https://<backend-host>/api` in Vercel. Do not expose backend secrets in Vercel variables prefixed with `NEXT_PUBLIC_`.

## Current readiness limits

- `nexiera-backend/.env.example` contains local database placeholders. Cloud database values must be supplied in Railway.
- `MIDTRANS_SERVER_KEY` is not configured locally. Checkout remains unavailable until the correct sandbox or production key is added.
- When Resend is not configured, email/password signup activates the account immediately so users can register and log in without email verification. With Resend configured, accounts must verify by email unless `EMAIL_VERIFICATION_DEV_LINKS=true`, which returns the verification link in the signup/resend response.
- Uploaded files currently use local disk paths. A persistent volume or private object storage is required so files survive redeploys.
- Rotate any Resend API key that has appeared in diagnostic output before configuring it in the cloud.

## Push behavior

The GitHub Actions workflow builds both apps on pushes to `main` and pull requests. Once the repository is connected in Vercel and Railway with the root directories above, those providers separately build and deploy their services from pushes to `main`. No deployment provider account has been connected from this workspace.
