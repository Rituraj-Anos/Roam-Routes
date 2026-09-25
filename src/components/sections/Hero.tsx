"use client";

import { motion, useReducedMotion } from "framer-motion";
import { PillArrow } from "@/components/ui/PillArrow";
import { PhotoScatter, type ScatterPhoto } from "@/components/ui/PhotoScatter";
import { RevealWords } from "@/components/ui/Reveal";
import { EASE_OUT } from "@/lib/motion";

const img = (id: string, w = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=82`;

const photos: ScatterPhoto[] = [
  {
    src: img("1626621341517-bbf3d9990a23"),
    alt: "Kanchenjunga range above Sikkim",
    rotate: 3,
    depth: 0.4,
    className: "right-0 top-0 h-[17rem] w-[13rem] sm:h-[21rem] sm:w-[16rem] z-20",
  },
  {
    src: img("1544634076-a90160ddf44c"),
    alt: "Darjeeling tea gardens at first light",
    rotate: -5,
    depth: 1,
    className: "left-0 top-14 h-[14rem] w-[11rem] sm:h-[17rem] sm:w-[13rem] z-10",
  },
  {
    src: img("1544735716-392fe2489ffa"),
    alt: "Dooars forest and river",
    rotate: 6,
    depth: 1.6,
    className: "bottom-0 left-16 h-[12rem] w-[10rem] sm:h-[14rem] sm:w-[11.5rem] z-30",
  },
];

/**
 * Home hero.
 *
 * One job: the value proposition and the primary action, both inside the first
 * viewport. Proof and service detail live in their own sections below.
 *
 * Motion is sequenced so the eye lands in reading order: badge, headline words,
 * subtext, actions. The photo stack settles alongside it and then responds to
 * scroll and cursor.
 */
export function Hero() {
  const reduce = useReducedMotion();

  const fade = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, transform: "translate3d(0,14px,0)" },
    animate: reduce ? undefined : { opacity: 1, transform: "translate3d(0,0,0)" },
    transition: { duration: 0.5, delay, ease: EASE_OUT },
  });

  return (
    <section className="relative isolate overflow-hidden bg-[var(--color-ink)] text-[var(--color-cream)]">
      {/* Depth wash. Very slow, very low contrast: it should register as depth,
          never as an animated background. Period is long enough (28s) to stay
          well clear of the uncomfortable ~5s oscillation range. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-1/4 top-[-12rem] size-[38rem] rounded-full bg-[var(--color-teal-700)]/20 blur-[120px]"
        animate={
          reduce
            ? undefined
            : { transform: ["translate3d(0,0,0)", "translate3d(3rem,2rem,0)", "translate3d(0,0,0)"] }
        }
        transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-20 bottom-[-14rem] size-[30rem] rounded-full bg-[var(--color-accent-dim)]/12 blur-[120px]"
        animate={
          reduce
            ? undefined
            : { transform: ["translate3d(0,0,0)", "translate3d(-2.5rem,-1.5rem,0)", "translate3d(0,0,0)"] }
        }
        transition={{ duration: 34, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 pb-16 pt-32 sm:px-8 sm:pb-20 sm:pt-36 lg:grid-cols-[1.05fr_1fr] lg:gap-8">
        <div>
          <motion.p
            {...fade(0)}
            className="t-small mb-5 inline-flex items-center gap-2 rounded-[var(--radius-pill)] bg-white/[0.06] px-3.5 py-1.5 font-medium text-white/75 ring-1 ring-inset ring-white/12"
          >
            <motion.span
              className="size-1.5 rounded-full bg-[var(--color-accent-soft)]"
              aria-hidden
              animate={reduce ? undefined : { opacity: [1, 0.35, 1] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            />
            Darjeeling · Sikkim · Dooars · Kalimpong
          </motion.p>

          <h1 className="t-display text-balance">
            <RevealWords text="North Bengal, up close" delay={0.1} />
          </h1>

          <motion.p {...fade(0.5)} className="t-body-lg mt-5 max-w-[26rem] text-white/70">
            Curated Himalayan trips with local guides, stays we have slept in,
            and permits handled for you.
          </motion.p>

          <motion.div {...fade(0.6)} className="mt-9 flex flex-wrap items-center gap-3">
            <PillArrow label="Book a Trip" href="/contact" variant="onDark" />
            <PillArrow label="Browse tours" href="/tours" variant="outline" />
          </motion.div>
        </div>

        <PhotoScatter
          priority
          photos={photos}
          className="mx-auto h-[23rem] w-full max-w-[26rem] sm:h-[28rem] lg:h-[31rem]"
        />
      </div>
    </section>
  );
}
