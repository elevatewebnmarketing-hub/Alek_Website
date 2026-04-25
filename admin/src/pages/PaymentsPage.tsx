import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useAdminApi } from "@/hooks/useAdminApi";

type PaymentRow = {
  id: string;
  amountCents: number;
  currency: string;
  status: string;
  customerEmail: string | null;
  description: string | null;
  stripeSessionId: string | null;
  stripePaymentId: string | null;
  metadata: unknown;
  createdAt: string;
};

type PaymentsListResponse = {
  items: PaymentRow[];
  range: { from: string; to: string };
};

type PaymentsSummaryResponse = {
  range: { from: string; to: string };
  totals: {
    succeeded: number;
    failed: number;
    refunded: number;
    pending: number;
    succeededCents: number;
  };
  daily: {
    date: string;
    succeeded: number;
    unsuccessful: number;
    pending: number;
    succeededCents: number;
  }[];
};

function formatMoney(cents: number, currency: string) {
  const code = currency?.length === 3 ? currency.toUpperCase() : "GBP";
  return (cents / 100).toLocaleString("en-GB", { style: "currency", currency: code });
}

export function PaymentsPage() {
  const { request, isLoaded } = useAdminApi();
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [selected, setSelected] = useState<PaymentRow | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);

  const summaryQ = useQuery({
    queryKey: ["admin-payments-summary"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/payments/summary") as Promise<PaymentsSummaryResponse>,
  });

  const listQ = useQuery({
    queryKey: ["admin-payments", statusFilter],
    enabled: isLoaded,
    queryFn: () => {
      const q = statusFilter ? `?status=${encodeURIComponent(statusFilter)}` : "";
      return request(`/api/admin/payments${q}`) as Promise<PaymentsListResponse>;
    },
  });

  const openDetail = useCallback((row: PaymentRow) => {
    setSelected(row);
    dialogRef.current?.showModal();
  }, []);

  const closeDetail = useCallback(() => {
    dialogRef.current?.close();
    setSelected(null);
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => setSelected(null);
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDetail();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeDetail]);

  if (!isLoaded || summaryQ.isLoading || listQ.isLoading) {
    return <p className="text-sm text-zinc-500">Loading payments…</p>;
  }

  if (summaryQ.isError) {
    return <p className="text-sm text-red-400">{(summaryQ.error as Error).message}</p>;
  }
  if (listQ.isError) {
    return <p className="text-sm text-red-400">{(listQ.error as Error).message}</p>;
  }

  const summary = summaryQ.data!;
  const list = listQ.data!;
  const { totals } = summary;
  const succeededGbp = (totals.succeededCents / 100).toLocaleString("en-GB", {
    style: "currency",
    currency: "GBP",
  });

  const chartData = summary.daily.map((d) => ({
    ...d,
    label: format(new Date(d.date), "MMM d"),
  }));

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-100">Payments</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Last 30 days (UTC). Successful vs unsuccessful checkout attempts from{" "}
            <code className="rounded bg-zinc-800 px-1 text-xs">PaymentRecord</code>.
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Succeeded</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-emerald-300">{totals.succeeded}</div>
          <p className="mt-2 text-xs text-zinc-500">Total {succeededGbp} in window</p>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Failed</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-red-300">{totals.failed}</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Refunded</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-amber-300">{totals.refunded}</div>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-5">
          <div className="text-xs font-medium uppercase tracking-wider text-zinc-500">Pending</div>
          <div className="mt-2 text-3xl font-semibold tabular-nums text-zinc-300">{totals.pending}</div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h3 className="text-sm font-semibold text-zinc-200">Daily volume</h3>
        <p className="text-xs text-zinc-500">Stacked counts: succeeded, unsuccessful (failed + refunded), pending.</p>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
              <XAxis dataKey="label" tick={{ fill: "#71717a", fontSize: 11 }} />
              <YAxis tick={{ fill: "#71717a", fontSize: 11 }} allowDecimals={false} />
              <Tooltip
                contentStyle={{
                  background: "#18181b",
                  border: "1px solid #3f3f46",
                  borderRadius: 8,
                }}
              />
              <Legend />
              <Bar dataKey="succeeded" name="Succeeded" stackId="a" fill="#34d399" radius={[0, 0, 0, 0]} />
              <Bar dataKey="unsuccessful" name="Unsuccessful" stackId="a" fill="#f87171" radius={[0, 0, 0, 0]} />
              <Bar dataKey="pending" name="Pending" stackId="a" fill="#a1a1aa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="text-sm text-zinc-400">
          Filter:{" "}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="ml-2 rounded-lg border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-200"
          >
            <option value="">All statuses</option>
            <option value="succeeded">Succeeded</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
            <option value="pending">Pending</option>
          </select>
        </label>
        <span className="text-xs text-zinc-600">
          Range: {format(new Date(list.range.from), "PP")} – {format(new Date(list.range.to), "PP")}
        </span>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[960px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {list.items.map((p) => (
              <tr
                key={p.id}
                className="cursor-pointer bg-zinc-950/40 hover:bg-zinc-900/80"
                onClick={() => openDetail(p)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openDetail(p);
                  }
                }}
                tabIndex={0}
                role="button"
              >
                <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                  {format(new Date(p.createdAt), "PP p")}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      p.status === "succeeded"
                        ? "bg-emerald-950/60 text-emerald-300"
                        : p.status === "pending"
                          ? "bg-zinc-800 text-zinc-300"
                          : p.status === "refunded"
                            ? "bg-amber-950/50 text-amber-200"
                            : "bg-red-950/50 text-red-300"
                    }`}
                  >
                    {p.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-zinc-200">
                  {formatMoney(p.amountCents, p.currency)}
                </td>
                <td className="max-w-[200px] truncate px-4 py-3 text-violet-300">{p.customerEmail ?? "—"}</td>
                <td className="max-w-md truncate px-4 py-3 text-zinc-500">{p.description ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.items.length === 0 ? (
          <p className="p-8 text-center text-sm text-zinc-500">No payment records in this range.</p>
        ) : null}
      </div>

      <p className="text-xs text-zinc-600">Click a row for full details, Stripe IDs, and metadata.</p>

      <dialog
        ref={dialogRef}
        className="w-[min(100vw-2rem,520px)] rounded-2xl border border-zinc-700 bg-zinc-950 p-0 text-zinc-100 shadow-xl backdrop:bg-black/70"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeDetail();
        }}
      >
        {selected ? (
          <div className="max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold">Payment details</h3>
              <button
                type="button"
                onClick={closeDetail}
                className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                Close
              </button>
            </div>
            <dl className="mt-4 space-y-3 text-sm">
              <div>
                <dt className="text-xs uppercase text-zinc-500">ID</dt>
                <dd className="mt-0.5 font-mono text-xs break-all">{selected.id}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Status</dt>
                <dd className="mt-0.5">{selected.status}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Amount</dt>
                <dd className="mt-0.5 font-mono">{formatMoney(selected.amountCents, selected.currency)}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Customer email</dt>
                <dd className="mt-0.5 break-all">{selected.customerEmail ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Description</dt>
                <dd className="mt-0.5 text-zinc-300">{selected.description ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Stripe session</dt>
                <dd className="mt-0.5 font-mono text-xs break-all">{selected.stripeSessionId ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Stripe payment intent</dt>
                <dd className="mt-0.5 font-mono text-xs break-all">{selected.stripePaymentId ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Created</dt>
                <dd className="mt-0.5">{format(new Date(selected.createdAt), "PPpp")}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase text-zinc-500">Metadata</dt>
                <dd className="mt-2">
                  <pre className="max-h-48 overflow-auto rounded-lg border border-zinc-800 bg-zinc-900 p-3 text-xs text-zinc-400">
                    {selected.metadata == null
                      ? "—"
                      : JSON.stringify(selected.metadata as object, null, 2)}
                  </pre>
                </dd>
              </div>
            </dl>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
