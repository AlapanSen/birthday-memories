import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { letter } from '../../journey';
import { EASE_SETTLE } from '../../lib/motion';
import { useJourneyMarker } from '../../music/MusicProvider';
import { HeartDoodle, withHearts } from '../Doodles';

type Stage = 'sealed' | 'opening' | 'open';

/** A sealed envelope. Tap the wax seal: the flap lifts, the letter slides out and unfolds. */
export function LoveLetter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  const [stage, setStage] = useState<Stage>('sealed');
  useJourneyMarker(ref, 'birthday', 'a letter for you');

  const open = () => {
    if (stage !== 'sealed') return;
    setStage('opening');
    window.setTimeout(() => setStage('open'), reduce ? 50 : 1350);
  };

  return (
    <section ref={ref} id="letter" className="chapter ch-letter" aria-labelledby="letter-title">
      <h2 id="letter-title" className="sr-only">
        A letter for you
      </h2>

      <AnimatePresence mode="wait">
        {stage !== 'open' ? (
          <motion.div
            key="envelope"
            className={`envelope ${stage === 'opening' ? 'is-opening' : ''}`}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            exit={{ opacity: 0, y: 60, scale: 0.92, transition: { duration: 0.5 } }}
            transition={{ duration: 1, ease: EASE_SETTLE }}
          >
            <p className="envelope__label">{letter.envelopeLabel}</p>
            <div className="envelope__body">
              <div className="envelope__back" />
              <motion.div
                className="envelope__paper"
                animate={stage === 'opening' ? { y: '-46%' } : { y: '0%' }}
                transition={{ delay: 0.55, duration: 0.8, ease: EASE_SETTLE }}
              >
                <span className="envelope__paper-lines" />
              </motion.div>
              <div className="envelope__pocket" />
              <motion.div
                className="envelope__flap"
                animate={stage === 'opening' ? { rotateX: 180 } : { rotateX: 0 }}
                transition={{ duration: 0.6, ease: [0.5, 0, 0.3, 1] }}
              />
              <motion.button
                type="button"
                className="envelope__seal"
                onClick={open}
                aria-label={letter.openLabel}
                animate={stage === 'opening' ? { scale: 0, opacity: 0 } : reduce ? {} : { scale: [1, 1.06, 1] }}
                transition={stage === 'opening' ? { duration: 0.3 } : { duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <HeartDoodle size="52%" strokeWidth={2.2} />
              </motion.button>
            </div>
            <p className="envelope__hint">tap the seal</p>
          </motion.div>
        ) : (
          <motion.article
            key="letter"
            className="letter"
            initial={{ opacity: 0, y: 80, scaleY: 0.6, rotate: -2 }}
            animate={{ opacity: 1, y: 0, scaleY: 1, rotate: -0.6 }}
            transition={{ duration: 1.1, ease: EASE_SETTLE }}
          >
            <span className="letter__fold" aria-hidden="true" />
            <motion.div
              initial="hidden"
              animate="shown"
              variants={{ shown: { transition: { staggerChildren: 0.35, delayChildren: 0.7 } } }}
            >
              {[letter.greeting, ...letter.paragraphs].map((text, i) => (
                <motion.p
                  key={text + i}
                  className={i === 0 ? 'letter__greeting' : 'letter__para'}
                  variants={{ hidden: { opacity: 0, y: 10 }, shown: { opacity: 1, y: 0, transition: { duration: 0.9 } } }}
                >
                  {withHearts(text)}
                </motion.p>
              ))}
              <motion.p className="letter__signoff" variants={{ hidden: { opacity: 0 }, shown: { opacity: 1, transition: { duration: 0.9 } } }}>
                {letter.signoff}
              </motion.p>
              <motion.p className="letter__signature" variants={{ hidden: { opacity: 0, x: -10 }, shown: { opacity: 1, x: 0, transition: { duration: 1.2 } } }}>
                {withHearts(letter.signature)}
              </motion.p>
            </motion.div>
          </motion.article>
        )}
      </AnimatePresence>
    </section>
  );
}
