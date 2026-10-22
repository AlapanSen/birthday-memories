import { useLayoutEffect, useRef, useState } from 'react';
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'motion/react';
import { growingUp } from '../../journey';
import { useJourneyMarker } from '../../music/MusicProvider';
import { Photo } from '../media/Photo';
import { SurpriseTrigger } from './SurpriseLayer';
import { TornEdge } from './TornEdge';

/**
 * Interlude — the page pins and a strip of film rolls sideways as she scrolls down.
 * Reduced-motion: becomes a normal swipeable row.
 */
export function FilmStrip() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [travel, setTravel] = useState(0);
  useJourneyMarker(sectionRef, 'childhood', 'interlude · growing up');

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const measure = () => setTravel(Math.max(0, track.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(track);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] });
  const smooth = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.4 });
  const x = useTransform(smooth, (v) => -v * travel);
  const progressWidth = useTransform(smooth, [0, 1], ['0%', '100%']);
  const pinned = !reduce;

  return (
    <section
      ref={sectionRef}
      className={`chapter filmstrip ${pinned ? 'filmstrip--pinned' : ''}`}
      style={pinned ? { height: `calc(100svh + ${travel}px)` } : undefined}
      aria-labelledby="film-title"
    >
      <TornEdge seed={21} fill="var(--color-cocoa)" fibre="#4a3a33" />
      <div className="filmstrip__stage">
        <div className="filmstrip__glow" aria-hidden="true" />
        <motion.div ref={trackRef} className="filmstrip__track" style={pinned ? { x } : undefined}>
          <div className="filmstrip__title-card">
            <p className="filmstrip__number">{growingUp.number}</p>
            <h2 id="film-title" className="filmstrip__title">
              {growingUp.title}
            </h2>
            <p className="filmstrip__kicker">
              {growingUp.kicker} <span aria-hidden="true">→</span>
            </p>
          </div>

          <ol className="filmstrip__reel">
            {growingUp.frames.map((frame, i) => (
              <li key={frame.src} className="filmstrip__frame">
                <span className="filmstrip__edge" aria-hidden="true">
                  {`FILM 400 ▸ ${String(i * 2 + 4).padStart(2, '0')}A`}
                </span>
                <div className="filmstrip__photo">
                  <Photo src={frame.src} alt={frame.alt} />
                </div>
                {frame.caption && <p className="filmstrip__caption">{frame.caption}</p>}
              </li>
            ))}
            <li className="filmstrip__frame filmstrip__frame--end">
              <p className="filmstrip__outro">{growingUp.outro}</p>
            </li>
          </ol>
          <SurpriseTrigger id="growing" />
        </motion.div>

        {pinned && (
          <div className="filmstrip__progress" aria-hidden="true">
            <motion.span style={{ width: progressWidth }} />
          </div>
        )}
      </div>
    </section>
  );
}
