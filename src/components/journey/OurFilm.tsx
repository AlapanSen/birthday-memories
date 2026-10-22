import { useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { film } from '../../journey';
import { EASE_SETTLE } from '../../lib/motion';
import { useJourneyMarker } from '../../music/MusicProvider';
import { VideoFrame } from '../media/VideoFrame';
import { ChapterHeader } from './ChapterHeader';
import { TornEdge } from './TornEdge';

/** The lights go down: one big film of every special moment. Background music steps aside. */
export function OurFilm() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  // null = no background music while this section is on screen; the film has its own sound.
  useJourneyMarker(ref, null, 'our film');

  return (
    <section ref={ref} className="chapter ch-film" aria-labelledby="film-heading">
      <TornEdge seed={58} fill="var(--color-cocoa)" fibre="#4a3a33" />
      <div className="ch-film__beam" aria-hidden="true" />
      <ChapterHeader id="film-heading" number={film.number} title={film.title} kicker={film.kicker} tone="dark" />

      <motion.div
        className="ch-film__screen"
        initial={{ opacity: 0, scale: reduce ? 1 : 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.35 }}
        transition={{ duration: 1.4, ease: EASE_SETTLE }}
      >
        <VideoFrame variant="cinema" src={film.video.src} poster={film.video.poster} label="Our film — every special moment" />
      </motion.div>

      <p className="ch-film__credit">{film.credit}</p>
    </section>
  );
}
