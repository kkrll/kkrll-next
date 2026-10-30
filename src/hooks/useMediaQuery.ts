import { useSyncExternalStore } from "react";

/**
 * Live `matchMedia` result. False on the server and during hydration, then the
 * real value — so anything gated on it renders the narrow layout first.
 *
 * For layout breakpoints that decide whether something MOUNTS (e.g. media that
 * would download while hidden). Pure styling belongs in CSS, and touch
 * capability belongs in `(hover)` / `(pointer)` queries, not widths.
 */
export function useMediaQuery(query: string) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}
