/**
 * Shared motion constants.
 *
 * Rules encoded here:
 *  - Strong custom curves; built-in CSS easings are too weak.
 *  - Interactive UI stays under 300ms. Editorial reveals may run longer.
 *  - `ease-out` for enter/exit; never `ease-in` on UI.
 *  - Springs default to no overshoot; bounce only follows real momentum.
 */

export const EASE_OUT = [0.23, 1, 0.32, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;

export const DUR = {
  press: 0.14,
  fast: 0.18,
  base: 0.24,
  slow: 0.3,
  reveal: 0.46,
} as const;

/** Critically damped — the default for UI that did not follow a gesture. */
export const SPRING_UI = { type: "spring", duration: 0.4, bounce: 0 } as const;

/** Slight overshoot — only for momentum-driven or physical interactions. */
export const SPRING_MOMENTUM = {
  type: "spring",
  duration: 0.45,
  bounce: 0.2,
} as const;

/** Stagger between list items. Beyond ~80ms a group starts to feel slow. */
export const STAGGER = 0.055;
