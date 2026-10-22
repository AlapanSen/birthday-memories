import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from 'motion/react';
import { heroContent } from '../content';
import { EASE_SETTLE, EASE_TEXT, MOBILE_QUERY, timeline, useMediaQuery } from '../lib/motion';
import { HeartDoodle, SparkleDoodle, StarDoodle, withHearts } from './Doodles';
import { PolaroidCard } from './PolaroidCard';
import { ScrollCue } from './ScrollCue';
import { useJourneyMarker, useMusic } from '../music/MusicProvider';

const rise = (delay: number, reduce: boolean, distance = 22) => ({
  initial: { opacity: 0, y: reduce ? 0 : distance },
  animate: { opacity: 1, y: 0 },
  transition: { delay, duration: reduce ? 0.5 : 1, ease: EASE_TEXT },
});

export function HeroSection() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const isMobile = useMediaQuery(MOBILE_QUERY);
  const { eyebrow, headline, intro, cta, signature, photo } = heroContent;
  const music = useMusic();
  useJourneyMarker(ref, 'intro', 'the beginning');

  // Scroll-linked drift as the hero leaves. Motion drives these off a single
  // shared scroll observer (no per-frame React renders, no layout reads).
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -60]);
  const textFade = useTransform(scrollYProgress, [0, 0.8], [1, reduce ? 1 : 0.3]);
  const photoY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 40]);
  const decorY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : -110]);

  return (
    <section ref={ref} className="hero" aria-labelledby="hero-heading">
      <HeroBackdrop reduce={reduce} y={decorY} />

      <div className="hero__grid">
        {/* Eyebrow + headline (comes first on mobile) */}
        <motion.header className="hero__intro" style={{ y: textY, opacity: textFade }}>
          <motion.p className="hero__eyebrow" {...rise(timeline.eyebrow, reduce, 10)}>
            {withHearts(eyebrow)}
          </motion.p>

          <h1 id="hero-heading" className="hero__headline">
            <motion.span className="hero__line" {...rise(timeline.headline, reduce, 28)}>
              {headline.lead}
            </motion.span>{' '}
            <motion.span className="hero__line hero__line--accent" {...rise(timeline.headline + 0.18, reduce, 28)}>
              {headline.accent}
              <svg className="hero__underline" viewBox="0 0 300 18" preserveAspectRatio="none" aria-hidden="true">
                <motion.path
                  d="M3 12.5C48 6.8 104 5.2 160 7.1c46 1.5 92 4.4 136 1.9"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ delay: timeline.cta + 0.25, duration: reduce ? 0 : 1.1, ease: 'easeInOut' }}
                />
              </svg>
            </motion.span>
          </h1>
        </motion.header>

        {/* The Polaroid */}
        <motion.div className="hero__photo" style={{ y: photoY }}>
          <div className="hero__photo-frame">
          <motion.div
            className="paper-note"
            aria-hidden="true"
            initial={{ opacity: 0, rotate: 14, y: reduce ? 0 : 10 }}
            animate={{ opacity: 1, rotate: 9, y: 0 }}
            transition={{ delay: timeline.polaroid + 0.35, duration: 1.4, ease: EASE_SETTLE }}
          >
            <motion.span
              className="paper-note__sheet"
              animate={reduce ? undefined : { rotate: [0, 1.2, 0], x: [0, 3, 0] }}
              transition={{ delay: 3, duration: 11, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="paper-note__mark">
                <HeartDoodle size="100%" />
              </span>
            </motion.span>
          </motion.div>

          <PolaroidCard
            {...photo}
            sizes="(min-width: 48rem) 44vw, 80vw"
            rotate={isMobile ? -2.5 : -4}
            enterRotate={isMobile ? -6 : -8}
            delay={timeline.polaroid}
            revealDelay={timeline.photo}
            doodleDelay={timeline.decor}
            priority
            reduceMotion={reduce}
          />
          </div>
        </motion.div>

        {/* Paragraph, divider, CTA */}
        <motion.div className="hero__body" style={{ y: textY, opacity: textFade }}>
          <motion.p className="hero__intro-text" {...rise(timeline.paragraph, reduce, 14)}>
            {intro}
          </motion.p>

          <motion.div className="hero__divider" aria-hidden="true" {...rise(timeline.divider, reduce, 8)}>
            <span className="hero__divider-line" />
            <HeartDoodle size={18} />
            <span className="hero__divider-line hero__divider-line--short" />
          </motion.div>

          <ScrollCue
            label={cta.label}
            targetId={cta.targetId}
            delay={timeline.cta}
            reduceMotion={reduce}
            onActivate={music.start}
          />
        </motion.div>
      </div>

      <motion.p
        className="hero__signature"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: timeline.signature, duration: 1.2, ease: 'easeOut' }}
      >
        {withHearts(signature)}
      </motion.p>
    </section>
  );
}

/* ──────────────────────────────────────────────────────────── */

interface HeroBackdropProps {
  reduce: boolean;
  y: MotionValue<number>;
}

/** Light, texture and doodles. Everything here is aria-hidden and ignores the pointer. */
function HeroBackdrop({ reduce, y }: HeroBackdropProps) {
  const drift = (dx: number, dy: number, duration: number) =>
    reduce
      ? {}
      : {
          animate: { x: [0, dx, 0], y: [0, dy, 0], rotate: [0, 6, 0] },
          transition: { delay: timeline.decor + 1, duration, repeat: Infinity, ease: 'easeInOut' as const },
        };

  return (
    <motion.div
      className="hero__backdrop"
      aria-hidden="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: timeline.backdrop, duration: 0.7, ease: 'easeOut' }}
    >
      <div className="hero__light" />

      <motion.div className="hero__doodles" style={{ y }}>
        {/* Faint thread: loops under the Polaroid, rises through the gutter, trails off above the headline. */}
        <svg className="hero__curve" viewBox="0 0 1200 600" preserveAspectRatio="none" fill="none">
          <motion.path
            d="M-20 548C90 590 250 606 410 584 520 569 556 498 566 400 578 280 560 150 625 82c50-52 150-50 230-34"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: timeline.decor - 0.4, duration: reduce ? 0 : 2.6, ease: 'easeInOut' }}
          />
        </svg>

        <motion.span
          className="hero__speck hero__speck--a"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: timeline.decor + 0.3, duration: 1.2 }}
        >
          <motion.span className="hero__speck-inner" {...drift(4, -6, 13)}>
            <SparkleDoodle size="100%" />
          </motion.span>
        </motion.span>

        <motion.span
          className="hero__speck hero__speck--b"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: timeline.decor + 0.5, duration: 1.2 }}
        >
          <StarDoodle size="100%" />
        </motion.span>

        <motion.span
          className="hero__speck hero__speck--c"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: timeline.decor + 0.7, duration: 1.2 }}
        >
          <motion.span className="hero__speck-inner" {...drift(-3, 5, 16)}>
            <HeartDoodle size="100%" />
          </motion.span>
        </motion.span>
      </motion.div>
    </motion.div>
  );
}
