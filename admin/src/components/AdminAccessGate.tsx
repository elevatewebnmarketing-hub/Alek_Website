import { SignOutButton, useUser } from "@clerk/clerk-react";
import type { ReactNode } from "react";

function parseAllowedEmails(): string[] {
  const raw = import.meta.env.VITE_ADMIN_ALLOWED_EMAILS ?? "";
  return raw
    .split(",")
    .map((s) => s.trim().toLowerCase())
    .filter(Boolean);
}

export function AdminAccessGate({ children }: { children: ReactNode }) {
  const { user, isLoaded } = useUser();
  const allowed = parseAllowedEmails();

  if (!isLoaded) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">Loading…</div>;
  }

  if (allowed.length === 0) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-lg font-semibold text-zinc-100">Admin not configured</h1>
        <p className="mt-3 text-sm text-zinc-400">
          Set <code className="rounded bg-zinc-800 px-1 text-xs">VITE_ADMIN_ALLOWED_EMAILS</code> to a comma-separated
          list of authorised emails (must match the API <code className="rounded bg-zinc-800 px-1 text-xs">ADMIN_ALLOWED_EMAILS</code>
          ).
        </p>
        <div className="mt-8 flex justify-center">
          <SignOutButton>
            <button
              type="button"
              className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  const email = user?.primaryEmailAddress?.emailAddress?.trim().toLowerCase() ?? "";
  if (!user || !email || !allowed.includes(email)) {
    return (
      <div className="mx-auto max-w-md px-6 py-20 text-center">
        <h1 className="text-lg font-semibold text-zinc-100">Access denied</h1>
        <p className="mt-3 text-sm text-zinc-400">
          This account is not authorised to use the admin dashboard. If you believe this is a mistake, contact the site
          owner.
        </p>
        {email ? (
          <p className="mt-2 text-xs text-zinc-600">
            Signed in as <span className="text-zinc-400">{email}</span>
          </p>
        ) : null}
        <div className="mt-8 flex justify-center">
          <SignOutButton>
            <button
              type="button"
              className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
            >
              Sign out
            </button>
          </SignOutButton>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
