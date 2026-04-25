import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Copy, Trash2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
  const [selected, setSelected] = useState<Lead | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [copyHint, setCopyHint] = useState<string | null>(null);

  const q = useQuery({
    queryKey: ["admin-leads"],
    enabled: isLoaded,
    queryFn: () => request("/api/admin/leads") as Promise<{ items: Lead[] }>,
  });

  const del = useMutation({
    mutationFn: (id: string) => request(`/api/admin/leads/${id}`, { method: "DELETE" }),
    onSuccess: (_data, id) => {
      qc.invalidateQueries({ queryKey: ["admin-leads"] });
      if (selected?.id === id) closeModal();
    },
  });

  const openLead = useCallback((lead: Lead) => {
    setSelected(lead);
    dialogRef.current?.showModal();
  }, []);

  const closeModal = useCallback(() => {
    dialogRef.current?.close();
    setSelected(null);
    setCopyHint(null);
  }, []);

  useEffect(() => {
    const dlg = dialogRef.current;
    if (!dlg) return;
    const onClose = () => {
      setSelected(null);
      setCopyHint(null);
    };
    dlg.addEventListener("close", onClose);
    return () => dlg.removeEventListener("close", onClose);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [closeModal]);

  const copyEmail = async () => {
    if (!selected?.email) return;
    try {
      await navigator.clipboard.writeText(selected.email);
      setCopyHint("Email copied");
      setTimeout(() => setCopyHint(null), 2000);
    } catch {
      setCopyHint("Could not copy");
    }
  };

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
      <p className="text-sm text-zinc-500">Click a row to read the full message and copy the email.</p>

      <div className="overflow-x-auto rounded-xl border border-zinc-800">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-zinc-800 bg-zinc-900/80 text-xs uppercase tracking-wide text-zinc-500">
            <tr>
              <th className="px-4 py-3">When</th>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Source</th>
              <th className="px-4 py-3">Message</th>
              <th className="w-16 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {items.map((l) => (
              <tr
                key={l.id}
                className="cursor-pointer bg-zinc-950/40 hover:bg-zinc-900/80"
                onClick={() => openLead(l)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    openLead(l);
                  }
                }}
                tabIndex={0}
                role="button"
              >
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
                    onClick={(e) => {
                      e.stopPropagation();
                      del.mutate(l.id);
                    }}
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

      <dialog
        ref={dialogRef}
        className="w-[min(100vw-2rem,560px)] rounded-2xl border border-zinc-700 bg-zinc-950 p-0 text-zinc-100 shadow-xl backdrop:bg-black/70"
        onClick={(e) => {
          if (e.target === dialogRef.current) closeModal();
        }}
      >
        {selected ? (
          <div className="max-h-[88vh] overflow-y-auto p-6">
            <div className="flex items-start justify-between gap-4">
              <h3 className="text-base font-semibold text-zinc-100">Lead detail</h3>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200"
              >
                Close
              </button>
            </div>

            <dl className="mt-6 space-y-4 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Lead ID</dt>
                <dd className="mt-1 font-mono text-xs break-all text-zinc-300">{selected.id}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Received</dt>
                <dd className="mt-1 text-zinc-200">{format(new Date(selected.createdAt), "PPpp")}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Name</dt>
                <dd className="mt-1 text-zinc-200">{selected.name}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Email</dt>
                <dd className="mt-1 flex flex-wrap items-center gap-2">
                  <a
                    href={`mailto:${encodeURIComponent(selected.email)}`}
                    className="break-all text-violet-300 hover:underline"
                  >
                    {selected.email}
                  </a>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-600 px-2 py-1 text-xs text-zinc-300 hover:bg-zinc-800"
                  >
                    <Copy className="size-3.5" /> Copy
                  </button>
                  {copyHint ? <span className="text-xs text-emerald-400">{copyHint}</span> : null}
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Source</dt>
                <dd className="mt-1 text-zinc-200">{selected.source}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wide text-zinc-500">Message</dt>
                <dd className="mt-2">
                  <pre className="max-h-[min(50vh,420px)] overflow-auto whitespace-pre-wrap rounded-lg border border-zinc-800 bg-zinc-900 p-4 text-sm leading-relaxed text-zinc-300">
                    {selected.message?.trim() ? selected.message : "No message provided."}
                  </pre>
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex justify-end border-t border-zinc-800 pt-4">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
              >
                Done
              </button>
            </div>
          </div>
        ) : null}
      </dialog>
    </div>
  );
}
