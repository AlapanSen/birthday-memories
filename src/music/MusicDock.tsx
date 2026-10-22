import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { tracks } from '../journey';
import { useMusic, useMusicState } from './MusicProvider';

/** Little record player in the corner: shows the chapter you're in and what's playing. */
export function MusicDock() {
  const { toggle } = useMusic();
  const { enabled, current, missing, label, desired } = useMusicState();
  const [visible, setVisible] = useState(false);

  // Stay out of the way on the opening screen.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const shown = visible || enabled;
  const playing = enabled && current !== null && !(current && missing[current]);
  const track = desired ? tracks[desired] : null;
  const isMissing = desired ? missing[desired] : false;

  let status: string;
  if (!enabled) status = 'tap for music';
  else if (!desired) status = 'music paused for the film';
  else if (isMissing) status = `add ${track?.src.replace(import.meta.env.BASE_URL, '')}`;
  else status = `${track?.title}${track?.artist ? ` — ${track.artist}` : ''}`;

  return (
    <AnimatePresence>
      {shown && (
        <motion.div
          className="dock"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <button
            type="button"
            className="dock__btn"
            onClick={toggle}
            aria-pressed={enabled}
            aria-label={enabled ? 'Turn music off' : 'Turn music on'}
          >
            <span className={`dock__record ${playing ? 'is-spinning' : ''}`} aria-hidden="true">
              <span className="dock__label-dot" />
            </span>
          </button>
          <div className="dock__text" aria-live="polite">
            <span className="dock__chapter">{label}</span>
            <span className="dock__status">
              {enabled && desired && !isMissing && <span className="dock__note" aria-hidden="true">♪ </span>}
              {status}
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
