import { UserButton } from "@clerk/clerk-react";
import {
  BookOpen,
  FolderKanban,
  LayoutDashboard,
  MessageSquareQuote,
  Newspaper,
  Settings,
  Users,
} from "lucide-react";
import { NavLink, Outlet } from "react-router-dom";
import { cn } from "@/lib/cn";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/leads", label: "Leads", icon: Users },
  { to: "/portfolio", label: "Portfolio", icon: FolderKanban },
  { to: "/journal", label: "Journal", icon: BookOpen },
  { to: "/resources", label: "Resources", icon: Newspaper },
  { to: "/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { to: "/settings", label: "Settings", icon: Settings },
];

export function Layout() {
  return (
    <div className="flex min-h-screen">
      <aside className="flex w-60 flex-col border-r border-zinc-800 bg-zinc-900/80 backdrop-blur">
        <div className="border-b border-zinc-800 px-5 py-6">
          <div className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Runway Refined
          </div>
          <div className="mt-1 font-semibold text-zinc-100">Admin</div>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 p-3">
          {nav.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-violet-600/20 text-violet-200"
                    : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-200",
                )
              }
            >
              <Icon className="size-4 opacity-80" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-zinc-800 p-4">
          <div className="flex items-center justify-between gap-2">
            <span className="truncate text-xs text-zinc-500">Account</span>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </aside>
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/90 px-8 py-4 backdrop-blur">
          <h1 className="text-lg font-semibold tracking-tight text-zinc-100">Command centre</h1>
          <p className="text-sm text-zinc-500">Leads, content, and revenue signals in one place.</p>
        </header>
        <main className="flex-1 px-8 py-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
