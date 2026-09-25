"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  CalendarClock,
  Inbox,
  Star,
  ImageIcon,
  FileText,
  Settings,
  Menu,
  X,
  ArrowUpRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { site } from "@/lib/site";
import { EASE_OUT, DUR } from "@/lib/motion";

/**
 * Admin chrome.
 *
 * Deliberately shares the product's type scale, radii and motion vocabulary, so
 * the back office feels like the same piece of software as the public site
 * rather than a generic dashboard skin.
 *
 * The active nav item uses a shared `layoutId` pill, so moving between sections
 * animates the indicator instead of snapping it.
 */
const groups: { label: string; links: { href: string; label: string; icon: typeof Package }[] }[] = [
  {
    label: "Overview",
    links: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Selling",
    links: [
      { href: "/admin/packages", label: "Packages", icon: Package },
      { href: "/admin/departures", label: "Departures", icon: CalendarClock },
      { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
    ],
  },
  {
    label: "Content",
    links: [
      { href: "/admin/reviews", label: "Reviews", icon: Star },
      { href: "/admin/media", label: "Media", icon: ImageIcon },
      { href: "/admin/blog", label: "Blog", icon: FileText },
    ],
  },
  {
    label: "Configuration",
    links: [{ href: "/admin/settings", label: "Settings", icon: Settings }],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/admin" ? pathname === href : pathname.startsWith(href);

  const nav = (
    <nav aria-label="Admin sections" className="flex flex-col gap-6">
      {groups.map((group) => (
        <div key={group.label}>
          <p className="mb-1.5 px-3 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-white/30">
            {group.label}
          </p>
          <ul className="flex flex-col gap-0.5">
            {group.links.map((l) => {
              const active = isActive(l.href);
              return (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors duration-[180ms]",
                      active ? "text-[var(--color-cream)]" : "text-white/55 hover:text-white",
                    )}
                  >
                    {active && (
                      <motion.span
                        layoutId="admin-active"
                        className="absolute inset-0 -z-10 rounded-xl bg-[var(--color-teal-800)]"
                        transition={{ duration: DUR.base, ease: EASE_OUT }}
                      />
                    )}
                    <l.icon className="size-4 shrink-0" strokeWidth={1.75} aria-hidden />
                    {l.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );

  return (
    <div className="min-h-screen bg-[#0b1013] text-[var(--color-cream)]">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 hidden w-64 flex-col border-r border-white/8 bg-[var(--color-ink)] px-3 py-5 lg:flex">
        <Link href="/admin" className="mb-8 flex items-center gap-2.5 px-2">
          <span className="grid size-9 place-items-center rounded-[0.7rem] bg-[var(--color-teal-800)] ring-1 ring-inset ring-white/12">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" aria-hidden>
              <path
                d="M2.5 17.5 8 9l3.5 5 2.5-3.5 7.5 7"
                stroke="var(--color-cream)"
                strokeWidth="1.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="8" cy="9" r="1.9" fill="var(--color-accent-soft)" />
            </svg>
          </span>
          <span>
            <span className="font-display block text-[0.9375rem] font-semibold leading-none tracking-[-0.02em]">
              {site.name}
            </span>
            <span className="mt-1 block text-[0.6875rem] text-white/35">Admin</span>
          </span>
        </Link>

        <div className="flex-1 overflow-y-auto">{nav}</div>

        <Link
          href="/"
          target="_blank"
          className="mt-4 inline-flex items-center gap-1.5 px-3 text-xs text-white/35 transition-colors hover:text-white/70"
        >
          View live site
          <ArrowUpRight className="size-3" aria-hidden />
        </Link>
      </aside>

      {/* Mobile bar */}
      <div className="sticky top-0 z-30 flex items-center justify-between border-b border-white/8 bg-[var(--color-ink)]/85 px-4 py-3 backdrop-blur-lg lg:hidden">
        <span className="font-display text-sm font-semibold">{site.name} Admin</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open admin menu"
          className="pressable grid size-9 place-items-center rounded-lg text-white/70 hover:bg-white/5"
        >
          <Menu className="size-5" strokeWidth={1.75} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-[var(--color-ink)] px-3 py-5 lg:hidden">
          <div className="mb-7 flex items-center justify-between px-2">
            <span className="font-display text-sm font-semibold">Sections</span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close admin menu"
              className="pressable grid size-9 place-items-center rounded-lg text-white/70 hover:bg-white/5"
            >
              <X className="size-5" strokeWidth={1.75} />
            </button>
          </div>
          {nav}
        </div>
      )}

      <div className="lg:pl-64">
        <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8">{children}</div>
      </div>
    </div>
  );
}

/** Page header for admin screens. */
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
        <h1 className="font-display text-[1.625rem] font-semibold leading-tight tracking-[-0.028em]">
          {title}
        </h1>
        {subtitle && <p className="mt-1.5 text-sm text-white/50">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/** Surface container for admin content. */
export function AdminCard({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        "elev-dark rounded-2xl border border-white/8 bg-white/[0.025] p-5",
        className,
      )}
    >
      {children}
    </div>
  );
}
