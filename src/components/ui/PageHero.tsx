import Image from "next/image";

/**
 * Interior page hero. Answers "where am I" immediately and keeps the eyebrow
 * optional so the pattern isn't repeated on every page.
 */
export function PageHero({
  eyebrow,
  title,
  intro,
  image,
  children,
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  image?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-ink)] text-[var(--color-cream)]">
      {image && (
        <>
          <Image
            src={image}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            priority
            className="object-cover opacity-25"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[var(--color-ink)] via-[var(--color-ink)]/80 to-[var(--color-ink)]/55"
          />
        </>
      )}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-0 size-[26rem] rounded-full bg-[var(--color-teal-700)]/18 blur-[110px]"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-32 sm:px-8 sm:pt-36 lg:pb-20">
        {eyebrow && (
          <span className="mb-3 block text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent-soft)]">
            {eyebrow}
          </span>
        )}
        <h1 className="t-display max-w-[42rem] text-balance">{title}</h1>
        {intro && (
          <p className="t-body-lg mt-5 max-w-[34rem] text-pretty text-white/70">{intro}</p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
