import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[var(--color-ink)] px-6 text-center text-[var(--color-cream)]">
      <p className="font-display text-7xl font-bold tracking-tight text-[var(--color-amber)]">404</p>
      <h1 className="font-display mt-4 text-2xl font-bold tracking-tight">This trail doesn&apos;t exist</h1>
      <p className="mt-2 max-w-sm text-sm text-white/60">
        The page you&apos;re looking for wandered off the map. Let&apos;s get you back on route.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center rounded-[var(--radius-pill)] bg-[var(--color-cream)] px-6 py-3 text-sm font-medium text-[var(--color-ink)]"
      >
        Back to home
      </Link>
    </main>
  );
}
