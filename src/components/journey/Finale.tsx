import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { RotateCcw } from 'lucide-react';
import { finale } from '../../journey';
import { burstFrom } from '../../lib/confetti';
import { EASE_TEXT } from '../../lib/motion';
import { useJourneyMarker } from '../../music/MusicProvider';
import { HeartDoodle, SparkleDoodle, withHearts } from '../Doodles';
import { TornEdge } from './TornEdge';

const TAPS_FOR_SECRET = 5;

/** The last page: one more Happy Birthday, a secret behind the heart, and a way back to the start. */
export function Finale() {
  const ref = useRef<HTMLElement>(null);
  const heartRef = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [taps, setTaps] = useState(0);
  useJourneyMarker(ref, 'birthday', 'to be continued');

  const reveal = (delay: number, y = 24) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.6 },
    transition: { delay, duration: 1.1, ease: EASE_TEXT },
  });

  const tapHeart = () => {
    setTaps((t) => t + 1);
    burstFrom(heartRef.current, { count: 18 + taps * 6, shapes: ['heart'], spread: 200, power: 0.6 + taps * 0.08 });
  };

  const replay = () => {
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  };

  return (
    <section ref={ref} className="chapter ch-finale" aria-labelledby="finale-title">
      <TornEdge seed={77} fill="var(--color-ivory)" fibre="#fffdf8" />

      <motion.span className="ch-finale__spark ch-finale__spark--a" aria-hidden="true" {...reveal(0.8, 0)}>
        <SparkleDoodle size="100%" />
      </motion.span>
      <motion.span className="ch-finale__spark ch-finale__spark--b" aria-hidden="true" {...reveal(1, 0)}>
        <SparkleDoodle size="100%" />
      </motion.span>

      <h2 id="finale-title" className="ch-finale__title">
        <motion.span className="ch-finale__line" {...reveal(0)}>
          {finale.headline}
        </motion.span>
        <motion.span className="ch-finale__line ch-finale__line--accent" {...reveal(0.2)}>
          {finale.accent}
        </motion.span>
      </h2>

      <motion.p className="ch-finale__tbc" {...reveal(0.5, 10)}>
        {finale.toBeContinued}
      </motion.p>

      <motion.div className="ch-finale__heart-wrap" {...reveal(0.7, 10)}>
        <button
          ref={heartRef}
          type="button"
          className="ch-finale__heart"
          onClick={tapHeart}
          aria-label="Tap the heart"
        >
          <motion.span
            className="ch-finale__heart-icon"
            key={taps}
            initial={{ scale: taps ? 0.75 : 1 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 400, damping: 12 }}
          >
            <HeartDoodle size="100%" strokeWidth={1.8} />
          </motion.span>
        </button>
        <AnimatePresence mode="wait">
          {taps >= TAPS_FOR_SECRET ? (
            <motion.p
              key="egg"
              className="ch-finale__egg"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              {withHearts(finale.easterEgg)}
            </motion.p>
          ) : (
            <motion.p key="hint" className="ch-finale__hint" exit={{ opacity: 0 }}>
              {taps === 0 ? finale.heartHint : `${TAPS_FOR_SECRET - taps} more…`}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.button type="button" className="pill-btn pill-btn--ghost ch-finale__replay" onClick={replay} {...reveal(0.9, 10)}>
        <RotateCcw size={14} aria-hidden="true" /> {finale.replay}
      </motion.button>

      <p className="ch-finale__sig">{withHearts(finale.signature)}</p>
    </section>
  );
}
