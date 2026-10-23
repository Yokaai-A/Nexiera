# NEXIERA MVP workspace

This repository keeps the existing project at its root and adds two independent applications:

```text
.
├── docker-compose.yml
├── nexiera-backend/
│   ├── prisma/schema.prisma
│   ├── prisma.config.ts
│   └── src/
│       ├── ads/
│       ├── auth/
│       ├── classes/
│       ├── dashboard/
│       ├── presences/
│       ├── prisma/
│       ├── transactions/
│       └── users/
└── nexiera-frontend/
    ├── app/
    │   ├── (auth)/login/
    │   ├── (auth)/complete-profile/
    │   ├── dashboard/
    │   └── kelas/[id]/
    ├── components/
    └── lib/api.ts
```

## Run locally (PowerShell)

1. Install Node.js 22.22.3 or newer, Docker Desktop, and npm. This meets the Nest CLI 12 requirement and the Next.js runtime requirement.
2. In the repository root, create local environment files:

   ```powershell
   Copy-Item nexiera-backend/.env.example nexiera-backend/.env
   Copy-Item nexiera-frontend/.env.local.example nexiera-frontend/.env.local
   ```

   The example frontend URL is for local development. Production builds require an explicit `NEXT_PUBLIC_API_BASE_URL`; the app will fail fast if it is missing.

3. Start MySQL 8.0 from the repository root:

   ```powershell
   docker compose up -d mysql
   ```

4. Update `nexiera-backend/.env`: set a unique `JWT_SECRET` of at least 32 characters, and add your Google OAuth client ID and secret. Register this exact Google redirect URI:

   ```text
   http://localhost:4000/api/auth/google/callback
   ```

   Set `MIDTRANS_IS_PRODUCTION=false` while using sandbox credentials and `true` for Midtrans production credentials. The backend requires this flag explicitly and does not silently select a gateway environment. In the Midtrans dashboard, configure the notification URL as `http://localhost:4000/api/transactions/webhook/midtrans` (use a tunnel during local development).

5. Open a terminal in `nexiera-backend` and install, migrate, generate the Prisma client, then start NestJS:

   ```powershell
   npm install
   npx prisma migrate dev --name init
   npx prisma generate
   npm run start:dev
   ```

   There is no seed script; the migration creates empty tables and the API listens at `http://localhost:4000/api`.

6. Open another terminal in `nexiera-frontend`:

   ```powershell
   npm install
   npm run dev
   ```

   Open `http://localhost:3000`.

## MVP behavior

- The user schema requires `phoneNumber`. `POST /api/auth/register` creates a student account from email, password, full name, and WhatsApp number; passwords are hashed with bcryptjs. Google-created accounts keep `password` null and complete the WhatsApp field before creation.
- `POST /api/auth/login` and `POST /api/auth/register` set the existing `HttpOnly` JWT cookie and return the user profile. Public registration always creates a student role; tutor/admin access cannot be requested through the registration payload. Google Sign-In requires configured OAuth credentials.
- New accounts start as `STUDENT`. Tutor access is granted after an administrator approves a stored tutor application. Bootstrap the first administrator through your controlled operations process; no fake admin account is seeded.
- JWTs are stored in an `HttpOnly` cookie and sent by `lib/api.ts` using `credentials: "include"`.
- The API enables NestJS security headers and CSRF protection; the configured `FRONTEND_URL` is the trusted browser origin.
- Tutors can create draft classes with `POST /api/classes` and publish future classes with a meeting link using `PATCH /api/classes/:classId/publish`. Students start a Snap checkout with `POST /api/transactions`; the API creates the pending transaction and returns a validated Midtrans redirect URL.
- Meeting and Drive URLs are selected only after the API confirms the requesting user owns a `PAID` transaction for an active class. They are never returned by the public catalog endpoint.
- Tutor cancellation marks the class cancelled and immediately requests a full Midtrans refund for each paid transaction. A transaction is marked `REFUNDED` after Midtrans confirms the refund. Rejections that require an external bank/e-wallet transfer are recorded as `MANUAL_REQUIRED`; admins can review them at `GET /api/transactions/refunds/manual-required` and reconcile a completed transfer with `PATCH /api/transactions/:transactionId/refund/manual-complete` and its transfer reference. No wallet, voucher, or internal balance is created.
- Midtrans only supports refunds for selected payment methods and requires refund capability to be enabled for the merchant. Unsupported methods need an external bank/e-wallet transfer; the admin reconciliation endpoint records completion only after that transfer has actually been made.
- Public ad slots return active advertiser ads during their time window; otherwise the API returns the official NEXIERA banner.

## Configuration notes

- NestJS 12 runs as ESM; Prisma ORM 7 is used with its MySQL/MariaDB driver adapter, `prisma.config.ts`, and generated ESM client. Prisma 8 currently does not support MySQL, so the backend pins the supported Prisma 7 major.
- `DATABASE_URL` is the local Prisma migration connection and uses the local Docker root account so `migrate dev` can create its shadow database. NestJS runtime uses the separate restricted `DATABASE_USER`/`DATABASE_PASSWORD`. Replace all local credentials and use appropriately scoped migration credentials before deployment.
- Keep `nexiera-backend/.env` and `nexiera-frontend/.env.local` private; only the `.example` templates belong in version control.
