import { useAuth } from "@clerk/clerk-react";
import type React from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Activity, CreditCard, Sparkles } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminApi } from "@/hooks/useAdminApi";

type Summary = {
  leads: {
    last7Days: number;
    last30Days: number;
    bySource: { source: string; count: number }[];
    daily: { date: string; count: number }[];
  };
  content: {
    portfolio: number;
    journalPublished: number;
    resources: number;
    testimonials: number;
  };
  payments: {
    connected: boolean;
    note: string;
    mtdCents: number;
    mtdCount: number;
    recent: { amountCents: number; currency: string; status: string; createdAt: string }[];
  };
};

function Kpi({
  label,
  value,
  hint,
  icon: Icon,
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">{label}</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-zinc-50">{value}</div>
          {hint ? <p className="mt-2 text-xs text-zinc-500">{hint}</p> : null}
        </div>
        <div className="rounded-xl bg-violet-500/10 p-2.5 text-violet-300">
          <Icon className="size-5" />
        </div>
      </div>
    </div>
  );
}

export function DashboardPage() {
  const { request, isLoaded } = useAdminApi();
  const { user } = useAuth();

  const q = useQuery({
    queryKey: ["admin-summary"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/dashboard/summary") as Promise<Summary>,
  });

  if (q.isLoading) {
    return <div className="text-sm text-zinc-500">Loading dashboard…</div>;
  }

  if (q.isError) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-4 text-sm text-red-200">
        {(q.error as Error).message || "Failed to load dashboard. Check API URL and Clerk secret."}
      </div>
    );
  }

  const data = q.data!;
  const mtd = (data.payments.mtdCents / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-zinc-500">
            Signed in as <span className="text-zinc-300">{user?.primaryEmailAddress?.emailAddress}</span>
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi
          label="Leads (7 days)"
          value={String(data.leads.last7Days)}
          hint="Inbound from contact, resources, and booking."
          icon={Activity}
        />
        <Kpi
          label="Leads (30 days)"
          value={String(data.leads.last30Days)}
          icon={Sparkles}
        />
        <Kpi
          label="Published journal"
          value={String(data.content.journalPublished)}
          hint={`${data.content.portfolio} portfolio · ${data.content.resources} resources`}
          icon={Sparkles}
        />
        <Kpi
          label="Revenue (MTD)"
          value={data.payments.mtdCount ? mtd : "N/A"}
          hint={data.payments.note}
          icon={CreditCard}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-semibold text-zinc-200">Lead volume (14 days)</h2>
          <p className="text-xs text-zinc-500">Daily new leads captured by the API.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.leads.daily}>
                <defs>
                  <linearGradient id="leadFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: "#71717a", fontSize: 11 }}
                  tickFormatter={(v) => format(new Date(v), "MMM d")}
                />
                <YAxis tick={{ fill: "#71717a", fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 8,
                  }}
                  labelFormatter={(v) => format(new Date(v as string), "PP")}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#a78bfa"
                  fill="url(#leadFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <h2 className="text-sm font-semibold text-zinc-200">Leads by source (30 days)</h2>
          <p className="text-xs text-zinc-500">Where conversations start.</p>
          <div className="mt-4 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.leads.bySource}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="source" tick={{ fill: "#71717a", fontSize: 11 }} />
                <YAxis tick={{ fill: "#71717a", fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    background: "#18181b",
                    border: "1px solid #3f3f46",
                    borderRadius: 8,
                  }}
                />
                <Bar dataKey="count" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/30 p-6">
        <h2 className="text-sm font-semibold text-zinc-200">Payments & Stripe</h2>
        <p className="mt-2 max-w-2xl text-sm text-zinc-500">
          {data.payments.connected
            ? "Stripe is connected."
            : "Next step: add a Stripe webhook to POST /webhooks/stripe on this API. Successful charges will populate PaymentRecord and unlock revenue charts here."}
        </p>
        {data.payments.recent.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            {data.payments.recent.map((p, i) => (
              <li key={i}>
                {(p.amountCents / 100).toFixed(2)} {p.currency.toUpperCase()} · {p.status} ·{" "}
                {format(new Date(p.createdAt), "PP p")}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-4 text-sm text-zinc-600">No payment rows yet.</p>
        )}
      </div>
    </div>
  );
}
