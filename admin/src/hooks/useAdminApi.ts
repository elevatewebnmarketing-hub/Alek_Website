import { useAuth } from "@clerk/clerk-react";
import { useCallback } from "react";
import { apiFetch } from "@/lib/api";

export function useAdminApi() {
  const { getToken, isLoaded } = useAuth();

  const request = useCallback(
    async (path: string, init: Parameters<typeof apiFetch>[2] = {}) => {
      const token = await getToken();
      const res = await apiFetch(path, token, init);
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || res.statusText);
      }
      const ct = res.headers.get("content-type");
      if (ct?.includes("application/json")) {
        const text = await res.text();
        return text ? JSON.parse(text) : null;
      }
      return res.text();
    },
    [getToken],
  );

  return { request, isLoaded };
}
