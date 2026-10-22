import { useMemo } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { storyContent } from '../content';
import { EASE_TEXT } from '../lib/motion';
import { HeartDoodle } from './Doodles';

/** Deterministic pseudo-random so the torn edge is identical on every visit. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/** Builds an irregular torn-paper top edge across a 1440×48 box. */
function tornPath(seed: number, base: number, amp: number): string {
  const rand = seeded(seed);
  const pts: string[] = [`M0 48`, `L0 ${base}`];
  let x = 0;
  while (x < 1440) {
    x += 6 + rand() * 22;
    const drift = Math.sin(x / 210) * amp * 0.6;
    const y = base + drift + (rand() - 0.5) * amp;
    pts.push(`L${Math.min(x, 1440).toFixed(1)} ${y.toFixed(1)}`);
  }
  pts.push('L1440 48', 'Z');
  return pts.join(' ');
}

export function OurStorySection() {
  const reduce = useReducedMotion() ?? false;
  const { id, eyebrow, heading } = storyContent;
  const fibres = useMemo(() => tornPath(7, 22, 14), []);
  const sheet = useMemo(() => tornPath(19, 27, 11), []);

  const reveal = (delay: number) => ({
    initial: { opacity: 0, y: reduce ? 0 : 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
    transition: { delay, duration: 1, ease: EASE_TEXT },
  });

  return (
    // tabIndex -1 lets the CTA move keyboard focus here after scrolling.
    <section id={id} tabIndex={-1} className="story" aria-labelledby="story-heading">
      <svg className="story__edge" viewBox="0 0 1440 48" preserveAspectRatio="none" aria-hidden="true">
        <path d={fibres} className="story__edge-fibres" />
        <path d={sheet} className="story__edge-sheet" />
      </svg>

      <div className="story__inner">
        <motion.p className="story__eyebrow" {...reveal(0)}>
          {eyebrow}
        </motion.p>
        <motion.h2 id="story-heading" className="story__heading" {...reveal(0.12)}>
          {heading}
        </motion.h2>
        <motion.div className="story__divider" aria-hidden="true" {...reveal(0.3)}>
          <HeartDoodle size={16} />
        </motion.div>

        {/*
          ─── NEXT CHAPTER GOES HERE ───
          Photos, notes and videos for "It all started somewhere…".
          Reuse <PolaroidCard /> for each memory.
        */}
      </div>
    </section>
  );
}
