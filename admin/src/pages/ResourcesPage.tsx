import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminApi } from "@/hooks/useAdminApi";

type Row = {
  id: string;
  type: string;
  title: string;
  description: string;
  linkUrl: string | null;
  sortOrder: number;
  published: boolean;
};

export function ResourcesPage() {
  const { request, isLoaded } = useAdminApi();
  const qc = useQueryClient();
  const [type, setType] = useState("Guide");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const q = useQuery({
    queryKey: ["admin-resources"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/resources") as Promise<{ items: Row[] }>,
  });

  const create = useMutation({
    mutationFn: () =>
      request("/api/admin/resources", {
        method: "POST",
        json: {
          type,
          title,
          description,
          linkUrl: linkUrl || null,
          sortOrder,
          published: true,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-resources"] });
      setTitle("");
      setDescription("");
      setLinkUrl("");
    },
  });

  const del = useMutation({
    mutationFn: (id: string) => request(`/api/admin/resources/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-resources"] }),
  });

  if (q.isLoading) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (q.isError) return <p className="text-sm text-red-400">{(q.error as Error).message}</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-zinc-100">Resources</h2>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h3 className="text-sm font-medium text-zinc-200">Add resource</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-zinc-400">Type</span>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
              value={type}
              onChange={(e) => setType(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="text-zinc-400">Sort order</span>
            <input
              type="number"
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
              value={sortOrder}
              onChange={(e) => setSortOrder(Number(e.target.value))}
            />
          </label>
        </div>
        <label className="mt-3 block text-sm">
          <span className="text-zinc-400">Title</span>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-zinc-400">Description</span>
          <textarea
            className="mt-1 min-h-[72px] w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-zinc-400">Link URL (optional)</span>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
          />
        </label>
        {create.isError ? (
          <p className="mt-2 text-sm text-red-400">{(create.error as Error).message}</p>
        ) : null}
        <button
          type="button"
          onClick={() => create.mutate()}
          disabled={create.isPending || !title || !description}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          Create
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase text-zinc-500">
            <tr>
              <th className="px-4 py-3">#</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3 w-16" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {q.data!.items.map((r) => (
              <tr key={r.id} className="bg-zinc-950/40">
                <td className="px-4 py-3 text-zinc-500">{r.sortOrder}</td>
                <td className="px-4 py-3 text-zinc-400">{r.type}</td>
                <td className="px-4 py-3 text-zinc-200">{r.title}</td>
                <td className="max-w-md truncate px-4 py-3 text-zinc-500">{r.description}</td>
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => del.mutate(r.id)}
                    className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
