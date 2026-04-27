import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { useAdminApi } from "@/hooks/useAdminApi";

type JournalItem = { id: string };

function defaultDatetimeLocal(): string {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
}

export function JournalCreatePage() {
  const { request } = useAdminApi();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [slug, setSlug] = useState("");
  const [category, setCategory] = useState("");
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [body, setBody] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("published");
  const [publishedAt, setPublishedAt] = useState(() => defaultDatetimeLocal());

  const create = useMutation({
    mutationFn: () =>
      request("/api/admin/journal", {
        method: "POST",
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
      }) as Promise<JournalItem>,
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-journal"] });
      navigate(`/journal/${data.id}`);
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/journal" className="text-sm text-violet-400 hover:underline">
        ← Back to journal
      </Link>
      <h2 className="text-xl font-semibold text-zinc-100">New post</h2>
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
            placeholder="my-post-title"
          />
        </label>
        <label className="block text-sm">
          <span className="text-zinc-400">Category</span>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Coaching"
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
      {create.isError ? <p className="text-sm text-red-400">{(create.error as Error).message}</p> : null}
      <button
        type="button"
        onClick={() => create.mutate()}
        disabled={create.isPending || !slug || !title || !excerpt || !body}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {create.isPending ? "Creating…" : "Create post"}
      </button>
    </div>
  );
}
