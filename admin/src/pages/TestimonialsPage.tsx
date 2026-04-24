import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useAdminApi } from "@/hooks/useAdminApi";

type Row = {
  id: string;
  quote: string;
  name: string;
  role: string | null;
  imageUrl: string | null;
  sortOrder: number;
  published: boolean;
};

export function TestimonialsPage() {
  const { request, isLoaded } = useAdminApi();
  const qc = useQueryClient();
  const [quote, setQuote] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [sortOrder, setSortOrder] = useState(0);

  const q = useQuery({
    queryKey: ["admin-testimonials"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/testimonials") as Promise<{ items: Row[] }>,
  });

  const create = useMutation({
    mutationFn: () =>
      request("/api/admin/testimonials", {
        method: "POST",
        json: {
          quote,
          name,
          role: role || null,
          imageUrl: imageUrl || null,
          sortOrder,
          published: true,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-testimonials"] });
      setQuote("");
      setName("");
      setRole("");
      setImageUrl("");
    },
  });

  const del = useMutation({
    mutationFn: (id: string) => request(`/api/admin/testimonials/${id}`, { method: "DELETE" }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-testimonials"] }),
  });

  if (q.isLoading) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (q.isError) return <p className="text-sm text-red-400">{(q.error as Error).message}</p>;

  return (
    <div className="space-y-8">
      <h2 className="text-lg font-semibold text-zinc-100">Testimonials</h2>

      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h3 className="text-sm font-medium text-zinc-200">Add testimonial</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="text-sm">
            <span className="text-zinc-400">Name</span>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>
          <label className="text-sm">
            <span className="text-zinc-400">Role / location</span>
            <input
              className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            />
          </label>
        </div>
        <label className="mt-3 block text-sm">
          <span className="text-zinc-400">Quote</span>
          <textarea
            className="mt-1 min-h-[100px] w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            value={quote}
            onChange={(e) => setQuote(e.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-zinc-400">Image URL (optional)</span>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
          />
        </label>
        <label className="mt-3 block text-sm">
          <span className="text-zinc-400">Sort order</span>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-950 px-3 py-2 text-zinc-100"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </label>
        {create.isError ? (
          <p className="mt-2 text-sm text-red-400">{(create.error as Error).message}</p>
        ) : null}
        <button
          type="button"
          onClick={() => create.mutate()}
          disabled={create.isPending || !quote || !name}
          className="mt-4 rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
        >
          Create
        </button>
      </div>

      <div className="space-y-4">
        {(q.data!.items.length ? q.data!.items : []).map((r) => (
          <div
            key={r.id}
            className="flex gap-4 rounded-xl border border-zinc-800 bg-zinc-950/50 p-4"
          >
            <div className="flex-1">
              <p className="text-zinc-200">&ldquo;{r.quote}&rdquo;</p>
              <p className="mt-2 text-sm text-zinc-500">
                {r.name}
                {r.role ? ` · ${r.role}` : ""}
              </p>
            </div>
            <button
              type="button"
              onClick={() => del.mutate(r.id)}
              className="self-start rounded-lg p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
            >
              <Trash2 className="size-4" />
            </button>
          </div>
        ))}
        {q.data!.items.length === 0 ? (
          <p className="text-sm text-zinc-500">No testimonials yet. Add the first one above.</p>
        ) : null}
      </div>
    </div>
  );
}
