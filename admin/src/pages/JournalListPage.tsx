import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminApi } from "@/hooks/useAdminApi";

type Row = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  publishedAt: string | null;
};

export function JournalListPage() {
  const { request, isLoaded } = useAdminApi();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin-journal"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/journal") as Promise<{ items: Row[] }>,
  });

  const del = useMutation({
    mutationFn: (id: string) => request(`/api/admin/journal/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-journal"] }),
  });

  if (q.isLoading) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (q.isError) return <p className="text-sm text-red-400">{(q.error as Error).message}</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-zinc-100">Journal</h2>
        <Link
          to="/journal/new"
          className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-violet-500"
        >
          <Plus className="size-4" /> New post
        </Link>
      </div>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {q.data!.items.map((r) => (
              <tr key={r.id} className="bg-zinc-950/40">
                <td className="px-4 py-3 font-mono text-xs text-violet-300">{r.slug}</td>
                <td className="px-4 py-3 text-zinc-200">{r.title}</td>
                <td className="px-4 py-3 text-zinc-400">{r.category}</td>
                <td className="px-4 py-3 text-zinc-400">{r.status}</td>
                <td className="px-4 py-3 text-right">
                  <div className="inline-flex items-center gap-2">
                    <Link
                      to={`/journal/${r.id}`}
                      className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                    >
                      <Pencil className="size-3.5" /> Edit
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        if (confirm(`Delete "${r.title}"?`)) del.mutate(r.id);
                      }}
                      className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                    >
                      <Trash2 className="size-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
