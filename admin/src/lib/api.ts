export function apiBase(): string {
  const b = import.meta.env.VITE_PUBLIC_API_URL;
  if (typeof b === "string" && b.length) return b.replace(/\/$/, "");
  return "";
}

export function apiUrl(path: string): string {
  const base = apiBase();
  if (!base) throw new Error("VITE_PUBLIC_API_URL is not configured");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export async function apiFetch(
  path: string,
  token: string | null,
  init: RequestInit & { json?: unknown } = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  let body = init.body;
  if (init.json !== undefined) {
    headers.set("Content-Type", "application/json");
    body = JSON.stringify(init.json);
  }
  return fetch(apiUrl(path), { ...init, headers, body });
}
