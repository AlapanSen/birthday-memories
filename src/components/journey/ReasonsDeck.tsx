import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion, type PanInfo } from 'motion/react';
import { ChevronRight, RotateCcw } from 'lucide-react';
import { reasons } from '../../journey';
import { HeartDoodle, withHearts } from '../Doodles';

const TILTS = [-2.5, 2, -1.5, 3, -3, 1.5, -2, 2.5];

const cardVariants = {
  exit: (dir: number) => ({
    x: dir * 520,
    rotate: dir * 24,
    opacity: 0,
    transition: { duration: 0.45, ease: [0.4, 0, 0.9, 0.6] as [number, number, number, number] },
  }),
};

/** A stack of cards she can swipe through (or tap "next"). */
export function ReasonsDeck() {
  const reduce = useReducedMotion() ?? false;
  const total = reasons.items.length;
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState(1);

  const next = (d = 1) => {
    setDir(d);
    setIndex((i) => Math.min(i + 1, total));
  };
  const restart = () => {
    setDir(1);
    setIndex(0);
  };

  // Cards currently in the stack (top first). The last "card" is the end card.
  const stack = [index, index + 1, index + 2].filter((i) => i <= total);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 90 || Math.abs(info.velocity.x) > 500) next(info.offset.x > 0 ? 1 : -1);
  };

  return (
    <section className="reasons" aria-labelledby="reasons-title">
      <h3 id="reasons-title" className="reasons__title">
        {reasons.title}
      </h3>
      <p className="reasons__hint">{reasons.hint}</p>

      <div className="reasons__deck">
        <AnimatePresence custom={dir} initial={false}>
          {stack
            .slice()
            .reverse()
            .map((i) => {
              const depth = i - index;
              const isTop = depth === 0;
              const isEnd = i === total;
              return (
                <motion.div
                  key={i}
                  className={`reason-card ${isEnd ? 'reason-card--end' : ''}`}
                  custom={dir}
                  variants={cardVariants}
                  initial={{ scale: 0.9, y: 30, opacity: 0 }}
                  animate={{
                    scale: 1 - depth * 0.05,
                    y: depth * 16,
                    rotate: isTop ? 0 : TILTS[i % TILTS.length],
                    opacity: 1,
                  }}
                  exit="exit"
                  transition={{ type: 'spring', stiffness: 200, damping: 24 }}
                  style={{ zIndex: 10 - depth }}
                  drag={isTop && !isEnd && !reduce ? 'x' : false}
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={0.85}
                  onDragEnd={onDragEnd}
                  whileDrag={{ scale: 1.03 }}
                  aria-hidden={!isTop}
                >
                  {isEnd ? (
                    <>
                      <span className="reason-card__heart" aria-hidden="true">
                        <HeartDoodle size="100%" />
                      </span>
                      <p className="reason-card__text">{withHearts(reasons.endCard)}</p>
                    </>
                  ) : (
                    <>
                      <span className="reason-card__no">no. {String(i + 1).padStart(2, '0')}</span>
                      <p className="reason-card__text">{withHearts(reasons.items[i])}</p>
                      <span className="reason-card__heart reason-card__heart--small" aria-hidden="true">
                        <HeartDoodle size="100%" />
                      </span>
                    </>
                  )}
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      <div className="reasons__controls">
        <span className="reasons__count" aria-live="polite">
          {index < total ? `${index + 1} / ${total}` : `all ${total}`}
        </span>
        {index < total ? (
          <button type="button" className="pill-btn" onClick={() => next(1)}>
            next <ChevronRight size={16} aria-hidden="true" />
          </button>
        ) : (
          <button type="button" className="pill-btn" onClick={restart}>
            <RotateCcw size={14} aria-hidden="true" /> again
          </button>
        )}
      </div>
    </section>
  );
}
