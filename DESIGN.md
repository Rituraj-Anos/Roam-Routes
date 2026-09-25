# RoamAndRoutes — Design System

The single reference for how this product looks and moves. Every surface follows
it so the whole thing reads as one considered piece, not a set of screens built
on different days.

Distilled from Apple's fluid-interface principles, Emil Kowalski's design
engineering, and anti-slop discipline. When in doubt, the rule here wins.

---

## 1. Voice of the interface

Calm, confident, grounded. This is a real travel agency run by real people, not
a SaaS funnel. The UI should feel like a well-made printed brochure that happens
to move: generous whitespace, honest photography, quiet colour, type that
carries the hierarchy.

Emotion we want at each turn: **trust, then desire, then ease of action.**

---

## 2. Colour

Tokens live in `globals.css` under `@theme`. Never hardcode hex in components.

| Role | Token | Use |
| --- | --- | --- |
| Deep teal (brand) | `--color-teal-950 … -500` | Dark sections, filled CTAs, headings on light |
| Ink surfaces | `--color-ink`, `-soft`, `-800` | Hero, footer, admin, photo-led sections |
| Warm paper | `--color-cream`, `-200`, `--color-paper` | Informational sections, cards |
| Rhododendron accent | `--color-accent`, `-soft`, `-dim` | One accent, used sparingly: scarcity, active state, a single highlight per view |
| Body text | `--color-body`, `-soft` | Paragraph copy, meta |
| Hairlines | `--color-line`, `-dark` | Borders, dividers |

Rules:
- **Sections alternate dark → light → dark.** Dark = emotional/photo-led. Light
  = informational. Never flatten to one background.
- **One accent per view.** The rhododendron red is a spice, not a base. If two
  things are red, one of them is wrong.
- **No gradients as decoration.** Gradients are only ever scrims over photos, or
  a single low-contrast depth wash behind a dark hero. No purple-to-blue meshes.
- Contrast is non-negotiable: body text ≥ 4.5:1, large text ≥ 3:1. Check CTAs on
  photographic backgrounds — always a scrim or solid behind the label.

---

## 3. Type

Display: **Outfit** (rounded geometric). Body: **Inter**. Both via `next/font`,
never a runtime CDN link.

Tracking and leading are **size-specific** — a single letter-spacing value is
wrong somewhere. Use the semantic classes, don't reinvent:

| Class | Role | Tracking / leading |
| --- | --- | --- |
| `.t-display` | Page titles | tight leading 1.02, `-0.03em` |
| `.t-h2` | Section headings | 1.08, `-0.022em` |
| `.t-h3` | Card / block titles | 1.22, `-0.014em` |
| `.t-body-lg` | Lead paragraphs | 1.6, `-0.005em` |
| `.t-body` | Body copy | 1.65, `0` |
| `.t-small` | Meta, labels | 1.5, `+0.01em` (positive tracking aids small text) |

- Large text gets **negative** tracking; small text gets slightly **positive**.
- Hierarchy is built from weight + size + leading together, never size alone.
- Headings use `text-balance`; lead paragraphs use `text-pretty`.
- Eyebrows (small-caps labels above headings) are **rationed**: at most one per
  ~3 sections. They are not a default.

---

## 4. Spacing & layout

- Section rhythm via the `Section` `size` prop: `full` (py-20→28), `band`
  (py-10→12, for single-row strips), `flush` (py-0).
- Content measure capped for reading: prose ≤ 44rem, section intros ≤ 34rem.
- **Grid over flex-math.** Never `w-[calc(33%-1rem)]`; use `grid` + `gap`.
- **Break the zigzag.** No more than two image+text split sections in a row.
  Interrupt with a bento grid, a full-width band, a marquee, or a stat row.
- Radii: cards `--radius-card` (1.25rem) / `--radius-xl2` (1.75rem), pills
  `--radius-pill`. Consistent per element type.
- Full-height heroes use `min-h-[100svh]`, never `h-screen` (mobile jump).

---

## 5. Motion

The through-line: **an interface feels alive when motion is fast, purposeful,
interruptible, and respects how often you see it.**

### Should it animate?

| Frequency seen | Decision |
| --- | --- |
| Constantly (nav, list rows) | None or barely-there |
| Occasional (modals, drawers, toasts) | Standard |
| Rare / first view (hero, scroll reveal) | Can have craft/delight |

If the only reason is "looks cool" and it's seen often, cut it.

### Easing (tokens in `globals.css` / `lib/motion.ts`)

- Enter / exit → **ease-out** `cubic-bezier(0.23, 1, 0.32, 1)`
- On-screen move / morph → **ease-in-out** `cubic-bezier(0.77, 0, 0.175, 1)`
- Hover / colour → `ease`
- Constant (marquee) → `linear`
- **Never `ease-in` on UI.**

### Duration

- Press feedback 100–160ms · tooltips 125–200ms · dropdowns 150–250ms · modals
  200–300ms · **UI stays under 300ms** · editorial reveals may run to ~460ms.
- Enter and exit are **asymmetric**: exit faster than enter.

### Springs

- Default UI: critically damped, `{ duration: 0.4, bounce: 0 }`.
- Add `bounce: 0.1–0.3` **only** after real momentum (a flick, a drag release).
- Mouse-tracking / magnetic effects go through `useSpring` and motion values,
  **never `useState`** (re-renders every frame, collapses on mobile).

### Non-negotiables

- Animate **only `transform` and `opacity`.** No width/height/top/left.
- Use the full transform string in Motion (`transform: "translate3d(...)"`), not
  the `x`/`y` shorthands — the shorthands drop frames under load.
- Never `scale(0)`. Enter from `scale(0.95)` + `opacity: 0`.
- Popovers are **origin-aware** (`transform-origin` = trigger). Modals stay
  centered.
- Prefer CSS transitions over keyframes for anything triggered rapidly.
- Stagger 30–80ms between items; never block interaction while it plays.
- `window.addEventListener("scroll")` is **banned** — use `useScroll`.

### Accessibility

- `prefers-reduced-motion`: keep opacity/colour that aids comprehension, drop
  movement. Render final state immediately.
- Gate hover motion behind `@media (hover: hover) and (pointer: fine)`.
- `prefers-reduced-transparency` and `prefers-contrast`: solidify materials.

### Named effects we use

Scroll reveal · staggered entrance · origin-aware popover · press feedback ·
magnetic hover · parallax (decorative layers only) · clip-path image reveal ·
number ticker (tabular-nums) · marquee · float · pulse.

---

## 6. Materials & depth

- Floating chrome (nav) is a **translucent material**: `backdrop-filter` blur +
  semi-transparent background, content scrolling under, a bright top edge, and a
  soft scroll-edge fade instead of a hard 1px divider.
- Bigger surfaces read thicker: more blur, deeper shadow.
- Never stack a light translucent surface on another.
- Dark photo-led sections carry film grain + a topographic contour motif to kill
  banding and add material. Both drop under `prefers-contrast: more`.

---

## 7. Components

| Component | Pattern |
| --- | --- |
| Pill-Arrow CTA | Pill label + circular arrow, colour-flipped by section, magnetic hover, press scale |
| Button | `.pressable` (scale 0.97 on `:active`), specified transitions, visible focus ring |
| Card | Rounded, hairline ring, `hover-lift` (gated to fine pointers), photo scrims only where text sits |
| Input | Cream/paper fill, teal focus border, inline validation, labels ≥ 4.5:1 |
| Badge / pill | Duration, region, scarcity — scarcity only when real |
| Accordion | `grid-template-rows: 0fr → 1fr`, no height animation |
| Toast | sonner, bottom-right, dark theme |
| Confirm dialog | Destructive actions only, focus trap, Escape, scale-from-0.96 |

Thin outline icons only (Lucide, brand glyphs from react-icons). **Never emoji.**

---

## 8. Anti-slop checklist (fail = fix before shipping)

- [ ] No `transition: all`; properties named.
- [ ] No `ease-in` on UI; custom curves used.
- [ ] No `scale(0)` entrances.
- [ ] No emoji as icons.
- [ ] No purple/blue AI-gradient decoration.
- [ ] No eyebrow label above every heading (≤ sectionCount/3).
- [ ] No 3rd consecutive image+text split.
- [ ] No duplicate CTA intent (one label per intent, e.g. only "Book a Trip").
- [ ] Hero fits first viewport; subtext ≤ 20 words.
- [ ] Every CTA passes contrast on its background.
- [ ] Fonts via `next/font`, not `<link>`.
- [ ] Real photography, not div-based fake previews.
- [ ] `prefers-reduced-motion` honoured everywhere motion exists.
