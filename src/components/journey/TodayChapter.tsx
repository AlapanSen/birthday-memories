import { useCallback, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { today } from '../../journey';
import { useJourneyMarker } from '../../music/MusicProvider';
import { MiniPolaroid } from '../media/MiniPolaroid';
import { Cake } from './Cake';
import { ChapterHeader } from './ChapterHeader';
import { SurpriseTrigger } from './SurpriseLayer';
import { TornEdge } from './TornEdge';

const FAN = [
  { from: '62%', rotate: -9 },
  { from: '0%', rotate: 2 },
  { from: '-62%', rotate: 8 },
];

/** Chapter four — today. Photos fan out of a stack, then the cake. */
export function TodayChapter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [celebrated, setCelebrated] = useState(false);
  useJourneyMarker(ref, 'birthday', 'chapter four · today');

  const onAllOut = useCallback(() => setCelebrated(true), []);

  const toLetter = () => {
    const el = document.getElementById('letter');
    el?.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
  };

  return (
    <section ref={ref} className="chapter ch-today" aria-labelledby="ch4-title">
      <TornEdge seed={64} fill="#fbf0de" fibre="#fffaf2" />
      <div className="ch-today__glow" aria-hidden="true" />
      <ChapterHeader id="ch4-title" number={today.number} title={today.title} kicker={today.kicker} intro={today.intro} />

      <ul className="fan">
        {today.photos.map((photo, i) => {
          const f = FAN[i % FAN.length];
          return (
            <motion.li
              key={photo.src}
              className={`fan__item fan__item--${i + 1}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, x: f.from, rotate: 0, y: 20 }}
              whileInView={{ opacity: 1, x: 0, rotate: f.rotate, y: i === 1 ? -14 : 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 70, damping: 15, delay: 0.15 + Math.abs(1 - i) * 0.12 }}
            >
              <MiniPolaroid item={photo} rotate={0} tape={i === 1} />
            </motion.li>
          );
        })}
      </ul>

      <SurpriseTrigger id="today" />

      <Cake onAllOut={onAllOut} />

      <AnimatePresence>
        {celebrated && (
          <motion.button
            type="button"
            className="cta ch-today__next"
            onClick={toLetter}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.6, duration: 0.8 }}
          >
            <span className="cta__label">{today.cake.afterDone}</span>
            <span className="cta__arrow" aria-hidden="true">
              <ArrowDown size={17} strokeWidth={1.75} />
            </span>
          </motion.button>
        )}
      </AnimatePresence>
    </section>
  );
}
