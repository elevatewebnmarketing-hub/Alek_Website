import type { Context, Next } from "hono";
import { verifyToken } from "@clerk/backend";

export async function clerkAuth(c: Context, next: Next) {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    return c.json({ error: "Server missing CLERK_SECRET_KEY" }, 503);
  }

  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = header.slice(7);
  try {
    const payload = await verifyToken(token, { secretKey: secret });
    c.set("clerkUserId", payload.sub);
    await next();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
}
