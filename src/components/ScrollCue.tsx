import type { MouseEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowDown } from 'lucide-react';
import { EASE_TEXT } from '../lib/motion';

export interface ScrollCueProps {
  label: string;
  /** id of the section to scroll to (without #). */
  targetId: string;
  delay?: number;
  reduceMotion: boolean;
  /** Runs on click, inside the tap — e.g. to start the music. */
  onActivate?: () => void;
}

/**
 * A real anchor (works with JS disabled, keyboard, and screen readers),
 * upgraded with a smooth scroll + focus hand-off.
 */
export function ScrollCue({ label, targetId, delay = 0, reduceMotion, onActivate }: ScrollCueProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    onActivate?.();
    const target = document.getElementById(targetId);
    if (!target) return; // fall back to the native anchor jump
    event.preventDefault();
    target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    target.focus({ preventScroll: true });
    window.history.replaceState(null, '', `#${targetId}`);
  };

  return (
    <motion.a
      href={`#${targetId}`}
      onClick={handleClick}
      className="cta"
      initial={{ opacity: 0, y: reduceMotion ? 0 : 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.8, ease: EASE_TEXT }}
    >
      <span className="cta__label">{label}</span>
      <span className="cta__arrow" aria-hidden="true">
        <ArrowDown size={17} strokeWidth={1.75} />
      </span>
    </motion.a>
  );
}
