import { useRef, useState } from "react";
import { CheckCircle, Loader2, Upload, X } from "lucide-react";
import { useAdminApi } from "@/hooks/useAdminApi";

interface FileUploadProps {
  accept: string;
  label?: string;
  value?: string;
  onUploaded: (url: string) => void;
  onClear?: () => void;
}

type CloudinaryResponse = { secure_url: string };
type CloudinaryError = { error?: { message?: string } };

type SignaturePayload = {
  signature: string;
  timestamp: number;
  cloudName: string;
  apiKey: string;
  folder: string;
  uploadSegment?: "raw" | "auto";
};

export function FileUpload({ accept, label = "Upload file", value, onUploaded, onClear }: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const { request, isLoaded } = useAdminApi();

  async function handleFile(file: File) {
    setStatus("uploading");
    setError(null);
    try {
      if (!isLoaded) {
        throw new Error("Authentication not ready");
      }
      const isPdf =
        file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf");
      const segment = isPdf ? "raw" : "auto";

      const sig = (await request(
        `/api/admin/upload/signature?resource=${segment}`,
      )) as SignaturePayload;

      const uploadSegment = sig.uploadSegment ?? segment;

      const fd = new FormData();
      fd.append("file", file);
      fd.append("api_key", sig.apiKey);
      fd.append("timestamp", String(sig.timestamp));
      fd.append("signature", sig.signature);
      fd.append("folder", sig.folder);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/${uploadSegment}/upload`,
        { method: "POST", body: fd },
      );
      if (!res.ok) {
        const err = (await res.json().catch(() => ({}))) as CloudinaryError;
        throw new Error(err.error?.message ?? "Upload failed");
      }
      const data = (await res.json()) as CloudinaryResponse;
      onUploaded(data.secure_url);
      setStatus("idle");
    } catch (e) {
      setError((e as Error).message);
      setStatus("error");
    }
  }

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFile(f);
          e.target.value = "";
        }}
      />
      {value ? (
        <div className="flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2">
          <CheckCircle className="size-4 shrink-0 text-emerald-400" />
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-zinc-300">{value}</span>
          {onClear && (
            <button type="button" onClick={onClear} className="shrink-0 text-zinc-500 hover:text-red-400">
              <X className="size-4" />
            </button>
          )}
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={status === "uploading" || !isLoaded}
          className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
        >
          {status === "uploading" ? (
            <>
              <Loader2 className="size-4 animate-spin" /> Uploading…
            </>
          ) : (
            <>
              <Upload className="size-4" /> {label}
            </>
          )}
        </button>
      )}
      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
