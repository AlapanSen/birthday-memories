import { useMemo } from 'react';

/** Deterministic pseudo-random so the edge looks the same on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

function tornPath(seed: number, base: number, amp: number): string {
  const rand = seeded(seed);
  const pts: string[] = ['M0 48', `L0 ${base}`];
  let x = 0;
  while (x < 1440) {
    x += 6 + rand() * 22;
    const drift = Math.sin(x / 210 + seed) * amp * 0.6;
    const y = base + drift + (rand() - 0.5) * amp;
    pts.push(`L${Math.min(x, 1440).toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push('L1440 48', 'Z');
  return pts.join(' ');
}

export interface TornEdgeProps {
  seed?: number;
  /** Colour of the incoming sheet (the section below). */
  fill: string;
  /** The pale fibrous band you see along a real tear. */
  fibre?: string;
}

/** A torn-paper top edge. Place as the first child of a `position: relative` section. */
export function TornEdge({ seed = 7, fill, fibre = '#fffefa' }: TornEdgeProps) {
  const fibres = useMemo(() => tornPath(seed, 22, 14), [seed]);
  const sheet = useMemo(() => tornPath(seed + 12, 27, 11), [seed]);
  return (
    <svg className="torn-edge" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
      <path d={fibres} fill={fibre} />
      <path d={sheet} fill={fill} />
    </svg>
  );
}
