import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { clerkAuth } from "./middleware/clerk.js";
import { adminApiRoute } from "./routes/adminApi.js";
import { leadsRoute } from "./routes/leads.js";
import { publicApiRoute } from "./routes/publicApi.js";

const app = new Hono();

const origins = (process.env.CORS_ORIGINS ?? "http://localhost:3000,http://localhost:5173,http://localhost:5174")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

app.use(
  "*",
  cors({
    origin: origins,
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
  }),
);

app.get("/health", (c) => c.json({ ok: true }));

app.route("/api/leads", leadsRoute);
app.route("/api/public", publicApiRoute);

const admin = new Hono();
admin.use("*", clerkAuth);
admin.route("/", adminApiRoute);
app.route("/api/admin", admin);

app.post("/webhooks/stripe", (c) =>
  c.json(
    {
      error: "not_implemented",
      message:
        "Stripe webhooks will verify signatures and upsert PaymentRecord. Configure STRIPE_WEBHOOK_SECRET and implement handler in a follow-up deploy.",
    },
    501,
  ),
);

const port = Number(process.env.PORT) || 3001;
serve({ fetch: app.fetch, port }, (info) => {
  console.log(`API listening on http://localhost:${info.port}`);
});
