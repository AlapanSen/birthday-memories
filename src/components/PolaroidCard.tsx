import { useState } from 'react';
import { motion } from 'motion/react';
import { EASE_SETTLE } from '../lib/motion';
import { HeartDoodle, SparkleDoodle, withHearts } from './Doodles';

export interface PolaroidCardProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
  note?: string;
  srcSet?: string;
  sizes?: string;
  /** Resting tilt in degrees. */
  rotate?: number;
  /** Tilt it settles from on entrance. */
  enterRotate?: number;
  /** Entrance delay (s). */
  delay?: number;
  /** When the photo "develops" (s). */
  revealDelay?: number;
  /** When the doodles around the frame appear (s). */
  doodleDelay?: number;
  /** Eagerly load (use for the hero). */
  priority?: boolean;
  showTape?: boolean;
  showDoodles?: boolean;
  reduceMotion: boolean;
  className?: string;
}

export function PolaroidCard({
  src,
  alt,
  width,
  height,
  caption,
  note,
  srcSet,
  sizes = '(min-width: 48rem) 44vw, 80vw',
  rotate = -4,
  enterRotate = -8,
  delay = 0,
  revealDelay = delay + 0.5,
  doodleDelay = delay + 1.8,
  priority = false,
  showTape = true,
  showDoodles = true,
  reduceMotion,
  className = '',
}: PolaroidCardProps) {
  const [failed, setFailed] = useState(false);
  const [settled, setSettled] = useState(false);

  return (
    <motion.div
      className={`polaroid-stage ${className}`}
      initial={reduceMotion ? { opacity: 0, rotate } : { opacity: 0, y: 35, rotate: enterRotate }}
      animate={{ opacity: 1, y: 0, rotate }}
      transition={{
        delay,
        duration: reduceMotion ? 0.5 : 1.35,
        ease: EASE_SETTLE,
        opacity: { delay, duration: reduceMotion ? 0.5 : 0.9, ease: 'easeOut' },
      }}
      onAnimationComplete={() => setSettled(true)}
    >
      {/* Idle float — kicks in only once the entrance has settled. */}
      <motion.div
        className="polaroid-float"
        animate={settled && !reduceMotion ? { y: [0, -5, 0] } : { y: 0 }}
        transition={settled && !reduceMotion ? { duration: 7, repeat: Infinity, ease: 'easeInOut' } : { duration: 0 }}
      >
        <motion.figure
          className="polaroid"
          whileHover={reduceMotion ? undefined : { rotate: Math.abs(rotate) * 0.65, y: -6 }}
          transition={{ type: 'spring', stiffness: 160, damping: 24, mass: 0.9 }}
        >
          {showTape && <span className="polaroid__tape" aria-hidden="true" />}

          <div className="polaroid__window" style={{ aspectRatio: '4 / 5' }}>
            <motion.div
              className="polaroid__develop"
              initial={
                reduceMotion
                  ? { opacity: 0 }
                  : { clipPath: 'inset(100% 0% 0% 0%)', filter: 'sepia(0.7) brightness(1.3) contrast(0.75) saturate(0.6)' }
              }
              animate={
                reduceMotion
                  ? { opacity: 1 }
                  : { clipPath: 'inset(0% 0% 0% 0%)', filter: 'sepia(0) brightness(1) contrast(1) saturate(1)' }
              }
              transition={{
                delay: revealDelay,
                duration: reduceMotion ? 0.4 : 1.2,
                ease: EASE_SETTLE,
                filter: { delay: revealDelay + 0.3, duration: 2.4, ease: 'easeOut' },
              }}
            >
              {failed ? (
                <div className="polaroid__fallback" role="img" aria-label={alt}>
                  <HeartDoodle size={30} />
                  <span>your favourite photo goes here</span>
                </div>
              ) : (
                <img
                  className="polaroid__img"
                  src={src}
                  srcSet={srcSet}
                  sizes={srcSet ? sizes : undefined}
                  width={width}
                  height={height}
                  alt={alt}
                  loading={priority ? 'eager' : 'lazy'}
                  fetchPriority={priority ? 'high' : 'auto'}
                  decoding="async"
                  draggable={false}
                  onError={() => setFailed(true)}
                />
              )}
            </motion.div>
            <span className="polaroid__sheen" aria-hidden="true" />
          </div>

          <figcaption className="polaroid__caption">
            <span className="polaroid__caption-main">{withHearts(caption)}</span>
            {note && <span className="polaroid__note">{note}</span>}
          </figcaption>
        </motion.figure>

        {showDoodles && (
          <>
            <motion.span
              className="polaroid__doodle polaroid__doodle--sparkle"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ delay: doodleDelay, duration: 0.9, ease: EASE_SETTLE }}
            >
              <SparkleDoodle size="100%" />
            </motion.span>
            <motion.span
              className="polaroid__doodle polaroid__doodle--heart"
              aria-hidden="true"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: doodleDelay + 0.2, duration: 0.9, ease: EASE_SETTLE }}
            >
              <HeartDoodle size="100%" />
            </motion.span>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
