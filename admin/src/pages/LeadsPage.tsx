import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";
import { useAdminApi } from "@/hooks/useAdminApi";

type Lead = {
  id: string;
  name: string;
  email: string;
  message: string | null;
  source: string;
  createdAt: string;
};

export function LeadsPage() {
  const { request, isLoaded } = useAdminApi();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin-leads"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/leads") as Promise<{ items: Lead[] }>,
  });

  const del = useMutation({
    mutationFn: (id: string) => request(`/api/admin/leads/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-leads"] }),
  });

  const exportCsv = () => {
    const items = q.data?.items ?? [];
    const header = ["createdAt", "name", "email", "source", "message"];
    const rows = items.map((l) =>
      [l.createdAt, l.name, l.email, l.source, (l.message ?? "").replace(/\n/g, " ")].map((c) =>
        JSON.stringify(c),
      ),
    );
    const csv = [header.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leads-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (q.isLoading) return <p className="text-sm text-zinc-500">Loading leads…</p>;
  if (q.isError) {
    return <p className="text-sm text-red-400">{(q.error as Error).message}</p>;
  }

  const items = q.data!.items;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-zinc-100">Leads</h2>
        <button
          type="button"
          onClick={exportCsv}
          className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm text-zinc-200 hover:bg-zinc-700"
        >
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Message</th>
              <th className="px-4 py-3 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {items.map((l) => (
              <tr key={l.id} className="bg-zinc-950/40">
                <td className="whitespace-nowrap px-4 py-3 text-zinc-400">
                  {format(new Date(l.createdAt), "PP p")}
                </td>
                <td className="px-4 py-3 text-zinc-200">{l.name}</td>
                <td className="px-4 py-3 text-violet-300">{l.email}</td>
                <td className="px-4 py-3 text-zinc-400">{l.source}</td>
                <td className="max-w-md truncate px-4 py-3 text-zinc-500">{l.message ?? "N/A"}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    title="Delete"
                    onClick={() => del.mutate(l.id)}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {items.length === 0 ? (
          <p className="p-8 text-center text-sm text-zinc-500">No leads yet.</p>
        ) : null}
      </div>
    </div>
  );
}
