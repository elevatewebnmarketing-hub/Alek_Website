import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useMemo } from "react";
import { useAdminApi } from "@/hooks/useAdminApi";

type OneTimeOrder = {
  id: string;
  createdAt: string;
  status: "pending" | "succeeded" | "failed" | "refunded";
  amountCents: number;
  currency: string;
  customerEmail: string | null;
  packageSlug: string | null;
  selectedOneTimeOption: string | null;
  intakeDetails: string | null;
  mediaUploadPreference: string | null;
  stripeSessionId: string | null;
};

function formatMoney(cents: number, currency: string) {
  const code = currency?.length === 3 ? currency.toUpperCase() : "GBP";
  return (cents / 100).toLocaleString("en-GB", { style: "currency", currency: code });
}

function statusClass(status: OneTimeOrder["status"]) {
  if (status === "succeeded") return "bg-emerald-950/60 text-emerald-300";
  if (status === "pending") return "bg-zinc-800 text-zinc-300";
  if (status === "refunded") return "bg-amber-950/50 text-amber-200";
  return "bg-red-950/50 text-red-300";
}

export function OneTimeOrdersPage() {
  const { request, isLoaded } = useAdminApi();
  const ordersQ = useQuery({
    queryKey: ["admin-one-time-orders"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/one-time-orders") as Promise<{ items: OneTimeOrder[] }>,
  });

  const rows = useMemo(() => ordersQ.data?.items ?? [], [ordersQ.data]);

  if (!isLoaded || ordersQ.isLoading) return <p className="text-sm text-zinc-500">Loading one-time orders…</p>;
  if (ordersQ.isError) return <p className="text-sm text-red-400">{(ordersQ.error as Error).message}</p>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-zinc-100">One-time orders</h2>
        <p className="mt-1 text-sm text-zinc-500">
          Clean view of paid one-time selections, intake notes, and upload preferences.
        </p>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[1200px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Package</th>
              <th className="px-4 py-3">Selection</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Upload preference</th>
              <th className="px-4 py-3">Intake details</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {rows.map((order) => (
              <tr key={order.id} className="bg-zinc-950/40">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-400">{format(new Date(order.createdAt), "PP p")}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${statusClass(order.status)}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 font-mono text-zinc-200">{formatMoney(order.amountCents, order.currency)}</td>
                <td className="px-4 py-3 text-zinc-300">{order.packageSlug ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-200">{order.selectedOneTimeOption ?? "—"}</td>
                <td className="px-4 py-3 text-violet-300">{order.customerEmail ?? "—"}</td>
                <td className="px-4 py-3 text-zinc-300">{order.mediaUploadPreference ?? "—"}</td>
                <td className="max-w-md px-4 py-3 text-zinc-400">{order.intakeDetails ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {rows.length === 0 ? <p className="p-8 text-center text-sm text-zinc-500">No one-time orders yet.</p> : null}
      </div>
    </div>
  );
}
