/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PUBLIC_API_URL: string;
  readonly VITE_CLERK_PUBLISHABLE_KEY: string;
  /** Comma-separated admin emails (lowercase); must match API ADMIN_ALLOWED_EMAILS */
  readonly VITE_ADMIN_ALLOWED_EMAILS?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
