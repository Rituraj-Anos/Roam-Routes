"use client";

import { usePathname } from "next/navigation";
import { AdminShell } from "./AdminShell";

/** Wraps admin pages in the shell, except the standalone login screen. */
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  if (pathname === "/admin/login") return <>{children}</>;
  return <AdminShell>{children}</AdminShell>;
}
