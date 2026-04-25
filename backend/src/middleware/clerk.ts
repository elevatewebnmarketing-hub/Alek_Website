import type { Context, Next } from "hono";
import { createClerkClient, verifyToken } from "@clerk/backend";
import { isEmailAllowedForAdmin, parseAdminAllowedEmails } from "./adminAllowlist.js";

export async function clerkAuth(c: Context, next: Next) {
  const secret = process.env.CLERK_SECRET_KEY;
  if (!secret) {
    return c.json({ error: "Server missing CLERK_SECRET_KEY" }, 503);
  }

  const allowed = parseAdminAllowedEmails();
  if (allowed.length === 0) {
    return c.json(
      {
        error: "misconfigured",
        message: "Set ADMIN_ALLOWED_EMAILS to a comma-separated list of admin emails.",
      },
      503,
    );
  }

  const header = c.req.header("Authorization");
  if (!header?.startsWith("Bearer ")) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const token = header.slice(7);
  try {
    const payload = await verifyToken(token, { secretKey: secret });
    const userId = payload.sub;
    c.set("clerkUserId", userId);

    const clerk = createClerkClient({ secretKey: secret });
    const user = await clerk.users.getUser(userId);
    const primary =
      user.primaryEmailAddress?.emailAddress ??
      user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
      null;

    if (!isEmailAllowedForAdmin(primary)) {
      return c.json(
        {
          error: "forbidden",
          message: "This account is not authorised to use the admin API.",
        },
        403,
      );
    }

    await next();
  } catch {
    return c.json({ error: "Unauthorized" }, 401);
  }
}
