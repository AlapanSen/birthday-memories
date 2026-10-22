import { useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { meeting } from '../../journey';
import { EASE_SETTLE } from '../../lib/motion';
import { useJourneyMarker } from '../../music/MusicProvider';
import { HeartDoodle, SparkleDoodle } from '../Doodles';
import { MiniPolaroid } from '../media/MiniPolaroid';
import { ChapterHeader } from './ChapterHeader';
import { SurpriseTrigger } from './SurpriseLayer';
import { TornEdge } from './TornEdge';

// Two wandering lines in a 400×600 box that meet at the bottom centre.
const PATH_YOU = 'M40 18C128 92-12 168 92 240s132 64 56 150c-58 66 10 112 52 170';
const PATH_ME = 'M360 18C276 96 418 174 306 246c-96 62-134 68-52 146 62 60-12 110-54 168';

/** Chapter two — your two paths draw themselves down the page and meet at the first photo of you two. */
export function MeetingChapter() {
  const sectionRef = useRef<HTMLElement>(null);
  const pathsRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [met, setMet] = useState(false);
  useJourneyMarker(sectionRef, 'meeting', 'chapter two · our paths cross');

  const { scrollYProgress } = useScroll({ target: pathsRef, offset: ['start 0.8', 'end 0.55'] });
  const draw = useTransform(scrollYProgress, [0, 1], [reduce ? 1 : 0, 1]);
  useMotionValueEvent(draw, 'change', (v) => {
    if (v > 0.985 && !met) setMet(true);
  });

  return (
    <section ref={sectionRef} className="chapter ch-meeting" aria-labelledby="ch2-title">
      <TornEdge seed={33} fill="var(--color-ivory)" fibre="#fbf6ee" />
      <div className="ch-meeting__sun" aria-hidden="true" />
      <ChapterHeader id="ch2-title" number={meeting.number} title={meeting.title} kicker={meeting.kicker} />

      <div ref={pathsRef} className="paths" aria-hidden="true">
        <span className="paths__label paths__label--you">{meeting.youLabel}</span>
        <span className="paths__label paths__label--me">{meeting.meLabel}</span>
        <svg className="paths__svg" viewBox="0 0 400 600" preserveAspectRatio="none" fill="none">
          <path d={PATH_YOU} className="paths__ghost" vectorEffect="non-scaling-stroke" />
          <path d={PATH_ME} className="paths__ghost" vectorEffect="non-scaling-stroke" />
          <motion.path d={PATH_YOU} className="paths__line paths__line--you" style={{ pathLength: draw }} vectorEffect="non-scaling-stroke" />
          <motion.path d={PATH_ME} className="paths__line paths__line--me" style={{ pathLength: draw }} vectorEffect="non-scaling-stroke" />
        </svg>
        <motion.span
          className="paths__heart"
          initial={false}
          animate={met ? { scale: [0, 1.35, 1], opacity: 1 } : { scale: 0, opacity: 0 }}
          transition={{ duration: 0.8, ease: EASE_SETTLE }}
        >
          <HeartDoodle size="100%" strokeWidth={2} />
        </motion.span>
        <motion.span
          className="paths__spark paths__spark--a"
          animate={met ? { opacity: [0, 1, 0.7], scale: [0.4, 1.1, 1] } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.15 }}
        >
          <SparkleDoodle size="100%" />
        </motion.span>
        <motion.span
          className="paths__spark paths__spark--b"
          animate={met ? { opacity: [0, 1, 0.7], scale: [0.4, 1.1, 1] } : { opacity: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
        >
          <SparkleDoodle size="100%" />
        </motion.span>
      </div>

      <div className="meeting-story">
        <motion.div
          className="meeting-story__photo"
          initial={reduce ? { opacity: 0 } : { opacity: 0, y: 60, rotate: -14, scale: 0.92 }}
          whileInView={{ opacity: 1, y: 0, rotate: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.2, ease: EASE_SETTLE }}
        >
          <MiniPolaroid item={meeting.firstPhoto} rotate={-3} tape />
        </motion.div>

        <motion.article
          className="lined-note meeting-story__note"
          initial={{ opacity: 0, y: reduce ? 0 : 40, rotate: 4 }}
          whileInView={{ opacity: 1, y: 0, rotate: 1.5 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: EASE_SETTLE, delay: 0.15 }}
        >
          <span className="lined-note__tape" aria-hidden="true" />
          <h3 className="lined-note__heading">{meeting.note.heading}</h3>
          <p className="lined-note__date">{meeting.note.date}</p>
          {meeting.note.body.map((para) => (
            <p key={para} className="lined-note__body">
              {para}
            </p>
          ))}
          <p className="lined-note__sign">{meeting.note.signoff}</p>
        </motion.article>
      </div>

      <SurpriseTrigger id="meeting" />

      <div className="firsts">
        <h3 className="firsts__title">{meeting.firstsTitle}</h3>
        <ul className="firsts__row">
          {meeting.firsts.map((item, i) => (
            <motion.li
              key={item.src}
              className="firsts__item"
              initial={{ opacity: 0, y: reduce ? 0 : 30, scale: reduce ? 1 : 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ type: 'spring', stiffness: 120, damping: 16, delay: i * 0.1 }}
            >
              <MiniPolaroid item={item} rotate={[-4, 3, -2, 4][i % 4]} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
