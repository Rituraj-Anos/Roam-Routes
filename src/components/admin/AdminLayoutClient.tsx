"use client";

import { usePathname } from "next/navigation";
import { Toaster } from "sonner";
import { AdminShell } from "./AdminShell";

/**
 * Wraps admin pages in the shell, except the standalone login screen.
 *
 * The toaster lives here so every admin action can report status, completion or
 * error without each page wiring its own notification surface.
 */
export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/admin/login";

  return (
    <>
      {isLogin ? children : <AdminShell>{children}</AdminShell>}
      <Toaster
        theme="dark"
        position="bottom-right"
        closeButton
        toastOptions={{
          style: {
            background: "#0e1417",
            border: "1px solid rgb(255 255 255 / 0.1)",
            color: "#f7f4ec",
          },
        }}
      />
    </>
  );
}
