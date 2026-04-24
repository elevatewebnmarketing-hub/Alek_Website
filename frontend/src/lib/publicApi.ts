export function getPublicApiBase(): string {
  const u = import.meta.env.VITE_PUBLIC_API_URL;
  if (typeof u === "string" && u.length) return u.replace(/\/$/, "");
  return "";
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
