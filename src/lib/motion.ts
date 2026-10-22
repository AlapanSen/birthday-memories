import { useCallback, useSyncExternalStore } from 'react';

export type Bezier = [number, number, number, number];

/** Long, soft deceleration — like paper settling onto a table. */
export const EASE_SETTLE: Bezier = [0.22, 1, 0.36, 1];
/** Slightly quicker ease for text. */
export const EASE_TEXT: Bezier = [0.25, 0.8, 0.3, 1];

/**
 * Entrance choreography, in seconds from first paint.
 * Tweak here to retime the whole hero.
 */
export const timeline = {
  backdrop: 0,
  polaroid: 0.2,
  photo: 0.75,
  headline: 0.85,
  eyebrow: 1.35,
  paragraph: 1.5,
  divider: 1.65,
  cta: 1.85,
  decor: 2.15,
  signature: 2.35,
} as const;

/** Tiny, SSR-safe media-query hook. */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    [query],
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** Matches the stacked (single-column) layout in hero.css — phones and portrait tablets. */
export const MOBILE_QUERY = '(max-width: 47.99rem), (max-width: 63.99rem) and (orientation: portrait)';
