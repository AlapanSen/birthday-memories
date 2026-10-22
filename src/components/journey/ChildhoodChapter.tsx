import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { childhood } from '../../journey';
import { useJourneyMarker } from '../../music/MusicProvider';
import { withHearts } from '../Doodles';
import { MiniPolaroid } from '../media/MiniPolaroid';
import { ChapterHeader } from './ChapterHeader';
import { SurpriseTrigger } from './SurpriseLayer';
import { TornEdge } from './TornEdge';

const TILTS = [-6, 4.5, -3, 5.5, -4.5, 3, -5, 4];

/** Chapter one — childhood photos drop onto the page like someone's tipping out a shoebox. */
export function ChildhoodChapter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  useJourneyMarker(ref, 'childhood', 'chapter one · little you');

  return (
    // tabIndex -1 lets the hero button move keyboard focus here after scrolling.
    <section ref={ref} id={childhood.id} tabIndex={-1} className="chapter ch-childhood" aria-labelledby="ch1-title">
      <TornEdge seed={7} fill="var(--color-paper)" />
      <ChapterHeader id="ch1-title" number={childhood.number} title={childhood.title} kicker={childhood.kicker} intro={childhood.intro} />

      <div className="shoebox">
        {childhood.photos.map((photo, i) => {
          const tilt = TILTS[i % TILTS.length];
          return (
            <motion.div
              key={photo.src}
              className={`shoebox__item shoebox__item--${i + 1}`}
              initial={reduce ? { opacity: 0 } : { opacity: 0, y: -140, rotate: i % 2 ? 28 : -28, scale: 1.12 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={
                reduce
                  ? { duration: 0.5 }
                  : { type: 'spring', stiffness: 80, damping: 14, mass: 0.9, delay: (i % 3) * 0.14, opacity: { duration: 0.3, delay: (i % 3) * 0.14 } }
              }
            >
              <MiniPolaroid item={photo} rotate={tilt} tape={i === 0 || i === 4} />
            </motion.div>
          );
        })}

        <motion.p
          className="sticky-note sticky-note--butter shoebox__note"
          initial={{ opacity: 0, scale: reduce ? 1 : 0.6, rotate: -12 }}
          whileInView={{ opacity: 1, scale: 1, rotate: -4 }}
          viewport={{ once: true, amount: 0.8 }}
          transition={{ type: 'spring', stiffness: 140, damping: 14, delay: 0.5 }}
        >
          {withHearts(childhood.stickyNote)}
        </motion.p>
      </div>

      <SurpriseTrigger id="childhood" />
    </section>
  );
}
