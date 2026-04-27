import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileUpload } from "@/components/FileUpload";
import { useAdminApi } from "@/hooks/useAdminApi";

type PortfolioItem = { id: string };

export function PortfolioCreatePage() {
  const { request } = useAdminApi();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const [slug, setSlug] = useState("");
  const [eyebrow, setEyebrow] = useState("");
  const [title, setTitle] = useState("");
  const [intro, setIntro] = useState("");
  const [body, setBody] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [sortOrder, setSortOrder] = useState(0);
  const [published, setPublished] = useState(true);
  const [contentJson, setContentJson] = useState('{"imageSlides":[],"videoSlides":[]}');

  const create = useMutation({
    mutationFn: async () => {
      let content = {};
      try {
        content = JSON.parse(contentJson);
      } catch {
        throw new Error("Content must be valid JSON");
      }
      return request("/api/admin/portfolio", {
        method: "POST",
        json: { slug, eyebrow, title, intro, body, heroImage: heroImage || null, sortOrder, published, content },
      }) as Promise<PortfolioItem>;
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ["admin-portfolio"] });
      navigate(`/portfolio/${data.id}`);
    },
  });

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/portfolio" className="text-sm text-violet-400 hover:underline">
        ← Back to portfolio
      </Link>
      <h2 className="text-xl font-semibold text-zinc-100">New project</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block text-sm">
          <span className="text-zinc-400">Slug</span>
          <input
            className="mt-1 w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="my-project-name"
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
          placeholder="Editorial · Vogue Africa"
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
      <div className="block text-sm">
        <span className="text-zinc-400">Hero image</span>
        <div className="mt-1">
          <FileUpload
            accept="image/*"
            label="Upload hero image"
            value={heroImage}
            onUploaded={setHeroImage}
            onClear={() => setHeroImage("")}
          />
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-zinc-300">
        <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} />
        Published
      </label>
      <label className="block text-sm">
        <span className="text-zinc-400">Content JSON (imageSlides / videoSlides)</span>
        <textarea
          className="mt-1 min-h-[140px] w-full rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 font-mono text-xs text-zinc-100"
          value={contentJson}
          onChange={(e) => setContentJson(e.target.value)}
        />
      </label>
      {create.isError ? <p className="text-sm text-red-400">{(create.error as Error).message}</p> : null}
      <button
        type="button"
        onClick={() => create.mutate()}
        disabled={create.isPending || !slug || !title || !intro || !body}
        className="rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-violet-500 disabled:opacity-50"
      >
        {create.isPending ? "Creating…" : "Create project"}
      </button>
    </div>
  );
}
