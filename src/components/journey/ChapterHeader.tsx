import { motion, useReducedMotion } from 'motion/react';
import { EASE_TEXT } from '../../lib/motion';
import { HeartDoodle, withHearts } from '../Doodles';

export interface ChapterHeaderProps {
  id: string;
  number: string;
  title: string;
  kicker?: string;
  intro?: string;
  tone?: 'light' | 'dark';
  as?: 'h2' | 'h3';
  className?: string;
}

/** Shared chapter opener: little handwritten number, big italic title, a line of intro. */
export function ChapterHeader({ id, number, title, kicker, intro, tone = 'light', as = 'h2', className = '' }: ChapterHeaderProps) {
  const reduce = useReducedMotion() ?? false;
  const reveal = (delay: number, y = 22) => ({
    initial: { opacity: 0, y: reduce ? 0 : y },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.5 },
    transition: { delay, duration: 1, ease: EASE_TEXT },
  });
  const Heading = as === 'h2' ? motion.h2 : motion.h3;

  return (
    <header className={`chapter-head chapter-head--${tone} ${className}`}>
      <motion.p className="chapter-head__number" {...reveal(0, 10)}>
        {number}
      </motion.p>
      <Heading id={id} className="chapter-head__title" {...reveal(0.1)}>
        {withHearts(title)}
      </Heading>
      {kicker && (
        <motion.p className="chapter-head__kicker" {...reveal(0.25, 10)}>
          <span className="chapter-head__rule" aria-hidden="true" />
          {kicker}
          <span className="chapter-head__rule" aria-hidden="true" />
        </motion.p>
      )}
      {intro && (
        <motion.p className="chapter-head__intro" {...reveal(0.35, 14)}>
          {withHearts(intro)}
        </motion.p>
      )}
      {!kicker && !intro && (
        <motion.span className="chapter-head__heart" aria-hidden="true" {...reveal(0.3, 6)}>
          <HeartDoodle size={16} />
        </motion.span>
      )}
    </header>
  );
}
