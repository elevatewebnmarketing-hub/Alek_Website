# Deploying the monorepo

Three deploy targets: **marketing** (`frontend/`), **admin** (`admin/`), and **API** (`backend/`).

## 1. Database (Neon)

1. Create a Neon PostgreSQL database.
2. Copy the connection string into `backend/.env` as `DATABASE_URL`.
3. From the repo root:

```bash
cd backend
npx prisma migrate deploy
npm run db:seed
```

`db:seed` wipes and re-seeds CMS tables (and adds a sample lead). Omit seed in production if you already have live data.

## 2. API (`backend/`)

Environment variables:

| Variable | Purpose |
|----------|---------|
| `DATABASE_URL` | Neon Postgres (required) |
| `CLERK_SECRET_KEY` | Clerk **secret** key for verifying admin JWTs (required for `/api/admin/*`) |
| `CORS_ORIGINS` | Comma-separated browser origins, e.g. `https://runwayrefinedbyalek.com,https://admin.runwayrefinedbyalek.com` |
| `PORT` | Local port (default `3001`) |
| `RESEND_API_KEY` | Resend API key for lead notification emails (optional) |
| `RESEND_FROM_EMAIL` | Verified sender identity in Resend, e.g. `Runway Refined <hello@runwayrefinedbyalek.com>` |
| `RESEND_TO_EMAIL` | Inbox that should receive contact/resource/booking lead notifications |
| `ADMIN_ALLOWED_EMAILS` | Comma-separated emails allowed to use `/api/admin/*` (required; Clerk user primary email must match) |
| `STRIPE_SECRET_KEY` | Stripe secret key (test or live) for checkout + webhooks |
| `STRIPE_WEBHOOK_SECRET` | Signing secret for `POST /webhooks/stripe` |
| `SITE_URL` | Public marketing site origin (no trailing slash), used for Stripe Checkout return URLs |

### Render (Web Service)

- **Root directory:** `backend`
- **Build command:** `bun install && bunx prisma migrate deploy && bun run build`  
  (`build` runs `prisma generate`; migrate needs `DATABASE_URL` in the service env.)
- **Start command:** `bun run start`  
  (`start` runs `tsx src/index.ts` so the service does not rely on a pre-built `dist/`. This avoids `Cannot find module .../dist/index.js` when the compile step is skipped or misconfigured.)
- **Optional:** run `bun run build:compile` locally to emit `dist/` and use `node dist/index.js` only if you add a custom start that points at the compiled file.

Deploy to Railway, Render, Fly.io, or any Node host. Health check: `GET /health`.

Public routes:

- `GET /api/public/portfolio`, `GET /api/public/portfolio/:slug`
- `GET /api/public/journal`, `GET /api/public/journal/:slug`
- `GET /api/public/resources`, `GET /api/public/testimonials`
- `POST /api/public/checkout-session` (Stripe Checkout from package selection)
- `POST /api/leads`

Admin routes (Bearer Clerk session token):

- `GET /api/admin/dashboard/summary`
- CRUD under `/api/admin/leads`, `.../portfolio`, `.../journal`, `.../resources`, `.../testimonials`

### Stripe webhooks

`POST /webhooks/stripe` verifies `Stripe-Signature`, upserts `PaymentRecord`, and reconciles against Stripe so payment statuses and completion emails stay in sync.

### Resend & Calendly

- **Resend**: enabled for `POST /api/leads`. When `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, and `RESEND_TO_EMAIL` are set, each lead sends a notification email from the API.
- **Calendly**: linked from package pages and `/checkout/success` after payment.

## 3. Marketing site (`frontend/`)

- **Vercel (npm workspaces):** use the **repository root** as the Vercel project **Root Directory** (not `frontend/`), so `npm install` at the monorepo root can hoist dependencies correctly. Set **Build Command** to `npm run build -w frontend` (or `cd frontend && npm run build` after a root `npm install`). The repo includes `vercel.json` with `installCommand: npm install --include=optional` to avoid Rollup’s missing `@rollup/rollup-linux-x64-gnu` on Linux builders.
- If you insist on Root Directory = `frontend` only, you must run install from the parent (workspaces) or you will get broken / incomplete `node_modules` and Rollup errors.
- Env:
  - `VITE_SITE_URL`: canonical site URL (OG URLs).
  - `VITE_PUBLIC_API_URL`: public base URL of the deployed API (no trailing slash).

## 4. Admin dashboard (`admin/`)

- **Vercel** (recommended): new project, same monorepo repo; **Root Directory = repository root** and build command `npm run build -w admin`, or mirror the marketing setup above. Custom domain **`admin.runwayrefinedbyalek.com`**.
- Env:
  - `VITE_CLERK_PUBLISHABLE_KEY`: Clerk **publishable** key (matches the same Clerk instance as the backend secret).
  - `VITE_PUBLIC_API_URL`: same API base as the marketing site.
  - `VITE_ADMIN_ALLOWED_EMAILS`: comma-separated list of authorised admin emails (must match `ADMIN_ALLOWED_EMAILS` on the API).

In the [Clerk Dashboard](https://dashboard.clerk.com): **disable public sign-ups** for this application, turn off unused **social/OAuth** providers so only your chosen sign-in method remains, and keep your production admin user as an invited or existing account only. The app and API still enforce the email allowlist.

## 5. DNS

- Main site: existing apex/domain → marketing Vercel project.
- `admin.runwayrefinedbyalek.com` → admin Vercel project (CNAME to `cname.vercel-dns.com` or as Vercel instructs).

## Local development

```bash
# Terminal 1: API (needs DATABASE_URL + CLERK_SECRET_KEY)
npm run dev -w backend

# Terminal 2: marketing (optional: .env with VITE_PUBLIC_API_URL=http://localhost:3001)
npm run dev -w frontend

# Terminal 3: admin (VITE_PUBLIC_API_URL + VITE_CLERK_PUBLISHABLE_KEY + VITE_ADMIN_ALLOWED_EMAILS)
npm run dev -w admin
```

Copy `backend/.env.example`, `frontend/.env.example`, and `admin/.env.example` into `.env` files and fill in values.
