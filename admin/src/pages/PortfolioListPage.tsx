import { useQuery } from "@tanstack/react-query";
import { Pencil } from "lucide-react";
import { Link } from "react-router-dom";
import { useAdminApi } from "@/hooks/useAdminApi";

type Row = {
  id: string;
  slug: string;
  title: string;
  eyebrow: string;
  published: boolean;
  sortOrder: number;
};

export function PortfolioListPage() {
  const { request, isLoaded } = useAdminApi();
  const q = useQuery({
    queryKey: ["admin-portfolio"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/portfolio") as Promise<{ items: Row[] }>,
  });

  if (q.isLoading) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (q.isError) return <p className="text-sm text-red-400">{(q.error as Error).message}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-zinc-100">Portfolio</h2>
      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Slug</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Published</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {q.data!.items.map((r) => (
              <tr key={r.id} className="bg-zinc-950/40">
                <td className="px-4 py-3 text-zinc-400">{r.sortOrder}</td>
                <td className="px-4 py-3 font-mono text-xs text-violet-300">{r.slug}</td>
                <td className="px-4 py-3 text-zinc-200">{r.title}</td>
                <td className="px-4 py-3 text-zinc-400">{r.published ? "Yes" : "No"}</td>
                <td className="px-4 py-3 text-right">
                  <Link
                    to={`/portfolio/${r.id}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-700 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                  >
                    <Pencil className="size-3.5" /> Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
