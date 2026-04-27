import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { useAdminApi } from "@/hooks/useAdminApi";

type Journal = {
  id: string;
  slug: string;
  category: string;
  title: string;
  excerpt: string;
  body: string;
  coverImage: string | null;
  status: "draft" | "published";
  publishedAt: string | null;
};

export function JournalEditPage() {
  const { id } = useParams<{ id: string }>();
  const { request, isLoaded } = useAdminApi();
  const qc = useQueryClient();

  const q = useQuery({
    queryKey: ["admin-journal-one", id],
    enabled: isLoaded && !!id,
    queryFn: async () => {
      const res = (await request("/api/admin/journal")) as { items: Journal[] };
      const row = res.items.find((x) => x.id === id);
      if (!row) throw new Error("Not found");
      return row;
    },
  });

  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [publishedAt, setPublishedAt] = useState("");

  useEffect(() => {
    if (!q.data) return;
    const p = q.data;
    setSlug(p.slug);
    setCategory(p.category);
    setTitle(p.title);
    setExcerpt(p.excerpt);
    setBody(p.body);
    setCoverImage(p.coverImage ?? "");
    setStatus(p.status);
    setPublishedAt(p.publishedAt ? p.publishedAt.slice(0, 16) : "");
  }, [q.data]);

  const save = useMutation({
    mutationFn: () =>
      request(`/api/admin/journal/${id}`, {
        method: "PATCH",
        json: {
          slug,
          category,
          title,
          excerpt,
          body,
          coverImage: coverImage || null,
          status,
          publishedAt: publishedAt ? new Date(publishedAt).toISOString() : null,
        },
      }),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-journal"] });
      qc.invalidateQueries({ queryKey: ["admin-journal-one", id] });
    },
  });

  if (q.isLoading) return <p className="text-sm text-zinc-500">Loading…</p>;
  if (q.isError || !q.data) {
    return <p className="text-sm text-red-400">{(q.error as Error)?.message || "Not found"}</p>;
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/journal" className="text-sm text-violet-400 hover:underline">
        ← Back to journal
      </Link>
      <h2 className="text-xl font-semibold text-zinc-100">Edit post</h2>
      <p className="text-sm text-zinc-500">
        Draft posts are hidden on the public site until you set status to published.
      </p>
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
          <span className="text-zinc-400">Category</span>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          />
        </label>
      </div>
      <label className="block text-sm">
        <span className="text-zinc-400">Title</span>
        <input
          className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <label className="block text-sm">
        <span className="text-zinc-400">Excerpt</span>
        <textarea
          className="mt-1 min-h-[72px] w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </label>
      <div className="space-y-2">
        <p className="text-sm text-zinc-400">Cover image (optional)</p>
        <FileUpload
          accept="image/*"
          label="Upload cover image"
          value={coverImage}
          onUploaded={setCoverImage}
          onClear={() => setCoverImage("")}
        />
        {coverImage ? (
          <img
            src={coverImage}
            alt=""
            className="max-h-48 max-w-full rounded-lg border border-zinc-700 object-cover"
          />
        ) : null}
      </div>
      <label className="block text-sm">
        <span className="text-zinc-400">Body (HTML)</span>
        <textarea
          className="mt-1 min-h-[200px] w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-sm text-zinc-100"
          value={body}
          onChange={(e) => setBody(e.target.value)}
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-zinc-400">Status</span>
          <select
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={status}
            onChange={(e) => setStatus(e.target.value as "draft" | "published")}
          >
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Published at (local)</span>
          <input
            type="datetime-local"
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </label>
      </div>
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
