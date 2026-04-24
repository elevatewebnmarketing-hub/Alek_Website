import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useAdminApi } from "@/hooks/useAdminApi";

type Portfolio = {
  id: string;
  slug: string;
  eyebrow: string;
  title: string;
  intro: string;
  body: string;
  heroImage: string | null;
  content: unknown;
  sortOrder: number;
  published: boolean;
};

export function PortfolioEditPage() {
  const { id } = useParams<{ id: string }>();
  const { request, isLoaded } = useAdminApi();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin-portfolio-one", id],
    enabled: isLoaded && !!id,
    queryFn: async () => {
      const res = (await request("/api/admin/portfolio")) as { items: Portfolio[] };
      const row = res.items.find((x) => x.id === id);
      if (!row) throw new Error("Not found");
      return row;
    },
  });

  const [slug, setSlug] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [body, setBody] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [contentJson, setContentJson] = useState("{}");

  useEffect(() => {
    if (!q.data) return;
    const p = q.data;
    setSlug(p.slug);
    setEyebrow(p.eyebrow);
    setTitle(p.title);
    setIntro(p.intro);
    setBody(p.body);
    setHeroImage(p.heroImage ?? "");
    setSortOrder(p.sortOrder);
    setPublished(p.published);
    setContentJson(JSON.stringify(p.content ?? {}, null, 2));
  }, [q.data]);

  const save = useMutation({
    mutationFn: async () => {
      let content: unknown = {};
      try {
        content = JSON.parse(contentJson);
      } catch {
        throw new Error("Content must be valid JSON");
      }
      return request(`/api/admin/portfolio/${id}`, {
        method: "PATCH",
        json: {
          slug,
          eyebrow,
          title,
          intro,
          body,
          heroImage: heroImage || null,
          sortOrder,
          published,
          content,
        },
      });
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-portfolio"] });
      qc.invalidateQueries({ queryKey: ["admin-portfolio-one", id] });
    },
  });

  if (q.isLoading) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (q.isError || !q.data) {
    return <p className="text-sm text-red-400">{(q.error as Error)?.message || "Not found"}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/portfolio" className="text-sm text-violet-400 hover:underline">
        ← Back to portfolio
      </Link>
      <h2 className="text-xl font-semibold text-zinc-100">Edit project</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-zinc-400">Slug</span>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Sort order</span>
          <input
            type="number"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-zinc-400">Eyebrow</span>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          value={eyebrow}
          onChange={(e) => setEyebrow(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-zinc-400">Title</span>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-zinc-400">Intro (hero)</span>
        <textarea
          className="mt-1 min-h-[80px] w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          value={intro}
          onChange={(e) => setIntro(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-zinc-400">Body (HTML)</span>
        <textarea
          className="mt-1 min-h-[160px] w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-zinc-400">Hero image URL</span>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          value={heroImage}
          onChange={(e) => setHeroImage(e.target.value)}
        />
      </label>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <label className="block text-sm">
        <span className="text-zinc-400">Content JSON (imageSlides / videoSlides)</span>
        <textarea
          className="mt-1 min-h-[220px] w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-100"
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
        />
      </label>
      {save.isError ? (
        <p className="text-sm text-red-400">{(save.error as Error).message}</p>
      ) : null}
      {save.isSuccess ? <p className="text-sm text-emerald-400">Saved.</p> : null}
      <button
        type="button"
        onClick={() => save.mutate()}
        disabled={save.isPending}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {save.isPending ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
