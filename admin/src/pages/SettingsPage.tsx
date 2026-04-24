import { useQuery } from "@tanstack/react-query";
import { apiBase, apiUrl } from "@/lib/api";

export function SettingsPage() {
  const base = apiBase();

  const health = useQuery({
    queryKey: ["health", base],
    enabled: !!base,
    queryFn: async () => {
      const r = await fetch(apiUrl("/health"));
      if (!r.ok) throw new Error("Health check failed");
      return r.json() as Promise<{ ok: boolean }>;
    },
  });

  return (
    <div className="max-w-xl space-y-6">
      <h2 className="text-lg font-semibold text-zinc-100">Settings</h2>
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm">
        <div className="text-xs font-semibold uppercase tracking-wider text-zinc-500">API base</div>
        <p className="mt-2 break-all font-mono text-xs text-violet-300">
          {base || "VITE_PUBLIC_API_URL is not set"}
        </p>
        <div className="mt-4 text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Health
        </div>
        {!base ? (
          <p className="mt-2 text-zinc-500">Configure VITE_PUBLIC_API_URL in <code>.env</code>.</p>
        ) : health.isLoading ? (
          <p className="mt-2 text-zinc-500">Checking…</p>
        ) : health.isError ? (
          <p className="mt-2 text-red-400">{(health.error as Error).message}</p>
        ) : (
          <p className="mt-2 text-emerald-400">API reachable ({JSON.stringify(health.data)})</p>
        )}
      </div>
      <div className="rounded-xl border border-dashed border-zinc-700 p-5 text-sm text-zinc-500">
        <p className="font-medium text-zinc-300">Integrations (next)</p>
        <ul className="mt-3 list-inside list-disc space-y-1">
          <li>Stripe: webhook POST /webhooks/stripe on the API service</li>
          <li>Calendly: booking link on the marketing site (already planned on /booking)</li>
          <li>Resend: server-side transactional email from the API</li>
        </ul>
      </div>
    </div>
  );
}
