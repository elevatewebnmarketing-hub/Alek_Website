/** Comma-separated list of emails allowed to call /api/admin (lowercase comparison). */
export function parseAdminAllowedEmails(): string[] {
  const raw = process.env.ADMIN_ALLOWED_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function isEmailAllowedForAdmin(email: string | undefined | null): boolean {
  if (!email) return false;
  const allowed = parseAdminAllowedEmails();
  if (allowed.length === 0) return false;
  return allowed.includes(email.trim().toLowerCase());
}
