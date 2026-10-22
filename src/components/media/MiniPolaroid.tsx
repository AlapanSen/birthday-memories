import { useState, type CSSProperties } from 'react';
import { motion } from 'motion/react';
import type { PhotoItem } from '../../journey';
import { withHearts } from '../Doodles';
import { Photo } from './Photo';

export interface MiniPolaroidProps {
  item: PhotoItem;
  /** Resting tilt in degrees. */
  rotate?: number;
  tape?: boolean;
  className?: string;
  style?: CSSProperties;
  /** Lift + straighten on hover (desktop only). */
  lift?: boolean;
}

/**
 * A small instant photo. If the item has a `back` note, tapping flips it over.
 * Everything inside scales with its width (container query units).
 */
export function MiniPolaroid({ item, rotate = 0, tape = false, className = '', style, lift = true }: MiniPolaroidProps) {
  const [flipped, setFlipped] = useState(false);
  const flippable = Boolean(item.back);

  const face = (
    <>
      <div className="mp__window">
        <Photo src={item.src} alt={item.alt} />
        {item.date && <span className="mp__date">{item.date}</span>}
        <span className="mp__sheen" aria-hidden="true" />
      </div>
      {item.caption && <span className="mp__caption">{withHearts(item.caption)}</span>}
    </>
  );

  return (
    <motion.figure
      className={`mp ${flippable ? 'mp--flippable' : ''} ${className}`}
      style={{ rotate, ...style }}
      whileHover={lift ? { rotate: rotate * 0.4, y: -6, transition: { type: 'spring', stiffness: 220, damping: 22 } } : undefined}
    >
      {tape && <span className="mp__tape" aria-hidden="true" />}
      {flippable ? (
        <button
          type="button"
          className="mp__flip"
          onClick={() => setFlipped((f) => !f)}
          aria-pressed={flipped}
          aria-label={flipped ? 'Flip the photo back' : 'Flip the photo over to read the back'}
        >
          <motion.span
            className="mp__card"
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          >
            <span className="mp__front">{face}</span>
            <span className="mp__back">
              <span className="mp__back-text">{withHearts(item.back ?? '')}</span>
            </span>
          </motion.span>
          {!flipped && <span className="mp__hint" aria-hidden="true">tap me</span>}
        </button>
      ) : (
        <span className="mp__card">
          <span className="mp__front">{face}</span>
        </span>
      )}
    </motion.figure>
  );
}
