"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard,
  Package,
  CalendarClock,
  Inbox,
  Star,
  ImageIcon,
  FileText,
  Settings,
  Mountain,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/packages", label: "Packages", icon: Package },
  { href: "/admin/departures", label: "Departures", icon: CalendarClock },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/reviews", label: "Reviews", icon: Star },
  { href: "/admin/media", label: "Media", icon: ImageIcon },
  { href: "/admin/blog", label: "Blog", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const nav = (
    <nav className="flex flex-col gap-1">
      {links.map((l) => {
        const active = l.href === "/admin" ? pathname === l.href : pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={() => setOpen(false)}
            className={cn(
              "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              active
                ? "bg-[var(--color-teal-800)] text-[var(--color-cream)]"
                : "text-white/60 hover:bg-white/5 hover:text-white",
            )}
          >
            <l.icon className="size-4" strokeWidth={1.5} />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#0e1417] text-[var(--color-cream)]">
      {/* Sidebar (desktop) */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/10 bg-[var(--color-ink)] p-4 lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2 px-2 pt-2">
          <span className="inline-flex size-9 items-center justify-center rounded-full bg-[var(--color-teal-800)]">
            <Mountain className="size-5" strokeWidth={1.5} />
          </span>
          <div>
            <p className="font-display text-sm font-bold leading-none">RoamAndRoutes</p>
            <p className="mt-0.5 text-xs text-white/40">Admin</p>
          </div>
        </Link>
        {nav}
        <div className="mt-auto px-2">
          <Link href="/" className="text-xs text-white/40 hover:text-white/70">
            ← View live site
          </Link>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="flex items-center justify-between border-b border-white/10 bg-[var(--color-ink)] px-4 py-3 lg:hidden">
        <span className="font-display font-bold">RoamAndRoutes Admin</span>
        <button onClick={() => setOpen(true)} aria-label="Open menu">
          <Menu className="size-6" />
        </button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 bg-[var(--color-ink)] p-4 lg:hidden">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display font-bold">Menu</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu">
              <X className="size-6" />
            </button>
          </div>
          {nav}
        </div>
      )}

      {/* Content */}
      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

/** Shared admin page header. */
export function AdminHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-white/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Card container for admin surfaces. */
export function AdminCard({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-white/10 bg-white/[0.03] p-5", className)}>
      {children}
    </div>
  );
}
