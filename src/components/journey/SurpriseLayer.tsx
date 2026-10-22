import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'motion/react';
import { X } from 'lucide-react';
import { surprises } from '../../journey';
import { withHearts } from '../Doodles';
import { Photo } from '../media/Photo';

/**
 * "Out of the blue" Polaroids. A <SurpriseTrigger id="…" /> placed anywhere in the page
 * tosses that photo onto the screen the first time it scrolls into view.
 * She can tap to flip it, drag it around, or toss it away.
 */

interface SurpriseApi {
  trigger: (id: string) => void;
}

const Ctx = createContext<SurpriseApi | null>(null);

interface Toss {
  id: string;
  fromX: number;
  fromY: number;
  fromRot: number;
  rest: number;
  top: string;
}

function makeToss(id: string): Toss {
  const fromLeft = Math.random() < 0.5;
  return {
    id,
    fromX: (fromLeft ? -1 : 1) * (window.innerWidth * 0.8 + 200),
    fromY: (Math.random() - 0.3) * 300,
    fromRot: (fromLeft ? -1 : 1) * (120 + Math.random() * 160),
    rest: (Math.random() - 0.5) * 16,
    // Phones: land in the lower half, clear of headings. Larger screens: anywhere down the right side.
    top: window.innerWidth < 768 ? `${46 + Math.random() * 12}%` : `${16 + Math.random() * 34}%`,
  };
}

export function SurpriseProvider({ children }: { children: ReactNode }) {
  const [active, setActive] = useState<Toss | null>(null);
  const queue = useRef<string[]>([]);
  const seen = useRef(new Set<string>());
  const activeRef = useRef<Toss | null>(null);

  const show = useCallback((id: string) => {
    const t = makeToss(id);
    activeRef.current = t;
    setActive(t);
  }, []);

  const trigger = useCallback(
    (id: string) => {
      if (!surprises[id] || seen.current.has(id)) return;
      seen.current.add(id);
      if (activeRef.current) queue.current.push(id);
      else show(id);
    },
    [show],
  );

  const dismiss = useCallback(() => {
    activeRef.current = null;
    setActive(null);
    const next = queue.current.shift();
    if (next) window.setTimeout(() => show(next), 900);
  }, [show]);

  return (
    <Ctx.Provider value={{ trigger }}>
      {children}
      <div className="surprise-layer">
        <AnimatePresence>{active && <SurpriseCard key={active.id} toss={active} onDone={dismiss} />}</AnimatePresence>
      </div>
    </Ctx.Provider>
  );
}

function SurpriseCard({ toss, onDone }: { toss: Toss; onDone: () => void }) {
  const item = surprises[toss.id];
  const reduce = useReducedMotion() ?? false;
  const [flipped, setFlipped] = useState(false);
  const [touched, setTouched] = useState(false);

  // Wander off by itself if she ignores it.
  useEffect(() => {
    if (touched || flipped) return;
    const t = window.setTimeout(onDone, 8000);
    return () => window.clearTimeout(t);
  }, [touched, flipped, onDone]);

  if (!item) return null;

  return (
    <motion.div
      className="surprise"
      style={{ top: toss.top }}
      initial={reduce ? { opacity: 0 } : { x: toss.fromX, y: toss.fromY, rotate: toss.fromRot, opacity: 1 }}
      animate={{ x: 0, y: 0, rotate: toss.rest, opacity: 1 }}
      exit={
        reduce
          ? { opacity: 0 }
          : { y: '-120vh', rotate: toss.rest + (Math.random() < 0.5 ? -50 : 50), transition: { duration: 0.8, ease: [0.5, 0, 0.75, 0] } }
      }
      transition={reduce ? { duration: 0.4 } : { type: 'spring', stiffness: 65, damping: 13, mass: 1 }}
      drag
      dragMomentum
      dragElastic={0.2}
      whileDrag={{ scale: 1.06, cursor: 'grabbing' }}
      onDragStart={() => setTouched(true)}
      role="group"
      aria-label="A surprise photo landed"
    >
      <motion.div
        className="surprise__card"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
        onTap={() => {
          setTouched(true);
          setFlipped((f) => !f);
        }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setFlipped((f) => !f);
          }
        }}
        tabIndex={0}
        role="button"
        aria-pressed={flipped}
        aria-label={flipped ? 'Flip back' : 'Flip the photo over'}
      >
        <span className="surprise__front">
          <span className="surprise__window">
            <Photo src={item.src} alt={item.alt} />
          </span>
          <span className="surprise__caption">{withHearts(item.caption ?? '')}</span>
        </span>
        <span className="surprise__back">
          <span className="surprise__back-text">{withHearts(item.back ?? '♡')}</span>
        </span>
      </motion.div>

      <button
        type="button"
        className="surprise__close"
        onClick={onDone}
        onPointerDownCapture={(e) => e.stopPropagation()}
        aria-label="Toss it away"
      >
        <X size={14} strokeWidth={2} aria-hidden="true" />
      </button>
      {!touched && <span className="surprise__hint" aria-hidden="true">tap to flip · drag me</span>}
    </motion.div>
  );
}

/** Invisible tripwire. When it scrolls into view, the matching surprise flies in. */
export function SurpriseTrigger({ id }: { id: string }) {
  const ctx = useContext(Ctx);
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -35% 0px' });

  useEffect(() => {
    if (inView) ctx?.trigger(id);
  }, [inView, id, ctx]);

  return <span ref={ref} className="surprise-trigger" aria-hidden="true" />;
}
