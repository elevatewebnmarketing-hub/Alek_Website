import "hono";

declare module "hono" {
  interface ContextVariableMap {
    clerkUserId: string;
  }
}
