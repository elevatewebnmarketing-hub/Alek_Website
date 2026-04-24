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

### Render (Web Service)

- **Root directory:** `backend`
- **Build command:** `bun install && bunx prisma migrate deploy && bun run build`  
  (`build` runs `prisma generate`; migrate needs `DATABASE_URL` in the service env.)
- **Start command:** `bun run start`  
  (`start` runs `tsx src/index.ts` so the service does not rely on a pre-built `dist/`—avoids `Cannot find module .../dist/index.js` when the compile step is skipped or misconfigured.)
- **Optional:** run `bun run build:compile` locally to emit `dist/` and use `node dist/index.js` only if you add a custom start that points at the compiled file.

Deploy to Railway, Render, Fly.io, or any Node host. Health check: `GET /health`.

Public routes:

- `GET /api/public/portfolio`, `GET /api/public/portfolio/:slug`
- `GET /api/public/journal`, `GET /api/public/journal/:slug`
- `GET /api/public/resources`, `GET /api/public/testimonials`
- `POST /api/leads`

Admin routes (Bearer Clerk session token):

- `GET /api/admin/dashboard/summary`
- CRUD under `/api/admin/leads`, `.../portfolio`, `.../journal`, `.../resources`, `.../testimonials`

### Stripe (follow-up)

`POST /webhooks/stripe` currently returns **501 Not Implemented**. Next step: verify `Stripe-Signature`, upsert `PaymentRecord`, then flip dashboard “payments connected” logic when rows exist.

### Resend & Calendly

- **Resend**: send mail from the API after `POST /api/leads` or booking events (env `RESEND_API_KEY`).
- **Calendly**: keep using the marketing `/booking` flow; optional Calendly webhooks can post into the API later for analytics.

## 3. Marketing site (`frontend/`)

- **Vercel**: set the project **root directory** to `frontend`.
- Env:
  - `VITE_SITE_URL` — canonical site URL (OG URLs).
  - `VITE_PUBLIC_API_URL` — public base URL of the deployed API (no trailing slash).

Build: `npm run build` (from `frontend/` or `npm run build -w frontend` from root).

## 4. Admin dashboard (`admin/`)

- **Vercel** (recommended): new project, root directory `admin`, domain **`admin.runwayrefinedbyalek.com`**.
- Env:
  - `VITE_CLERK_PUBLISHABLE_KEY` — Clerk **publishable** key (matches the same Clerk instance as the backend secret).
  - `VITE_PUBLIC_API_URL` — same API base as the marketing site.

In the [Clerk Dashboard](https://dashboard.clerk.com), restrict sign-ups or allowlist emails for your team.

Build: `npm run build -w admin`.

## 5. DNS

- Main site: existing apex/domain → marketing Vercel project.
- `admin.runwayrefinedbyalek.com` → admin Vercel project (CNAME to `cname.vercel-dns.com` or as Vercel instructs).

## Local development

```bash
# Terminal 1 — API (needs DATABASE_URL + CLERK_SECRET_KEY)
npm run dev -w backend

# Terminal 2 — marketing (optional: .env with VITE_PUBLIC_API_URL=http://localhost:3001)
npm run dev -w frontend

# Terminal 3 — admin (VITE_PUBLIC_API_URL + VITE_CLERK_PUBLISHABLE_KEY)
npm run dev -w admin
```

Copy `backend/.env.example`, `frontend/.env.example`, and `admin/.env.example` into `.env` files and fill in values.
