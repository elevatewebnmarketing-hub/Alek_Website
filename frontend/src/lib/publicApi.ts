export function getPublicApiBase(): string {
  const u = import.meta.env.VITE_PUBLIC_API_URL;
  if (typeof u === "string" && u.length) return u.replace(/\/$/, "");
  return "";
}

const joinBase = (base: string, path: string) =>
  `${base}${path.startsWith("/") ? path : `/${path}`}`;

/**
 * Fetches JSON from the public API without throwing. Use in route loaders so
 * CORS or network errors surface as "offline" instead of the global error page.
 */
export async function safePublicFetch<T>(path: string): Promise<T | null> {
  const base = getPublicApiBase();
  if (!base) return null;
  try {
    const r = await fetch(joinBase(base, path));
    if (!r.ok) return null;
    return (await r.json()) as T;
  } catch {
    return null;
  }
}

/** Slug detail: 404 is distinct from network / CORS / other failures. */
export async function safePublicFetchDetail<T>(
  path: string
): Promise<{ kind: "ok"; data: T } | { kind: "notFound" } | { kind: "unavailable" }> {
  const base = getPublicApiBase();
  if (!base) return { kind: "unavailable" };
  try {
    const r = await fetch(joinBase(base, path));
    if (r.status === 404) return { kind: "notFound" };
    if (!r.ok) return { kind: "unavailable" };
    return { kind: "ok", data: (await r.json()) as T };
  } catch {
    return { kind: "unavailable" };
  }
}

export async function postLead(payload: {
  name: string;
  email: string;
  message?: string;
  source: "contact" | "resources" | "booking" | "other";
}): Promise<{ ok: boolean; error?: string }> {
  const base = getPublicApiBase();
  if (!base) return { ok: false, error: "API is not configured (VITE_PUBLIC_API_URL)." };
  try {
    const r = await fetch(`${base}/api/leads`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!r.ok) {
      const t = await r.text();
      return { ok: false, error: t || r.statusText };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "Network error" };
  }
}
