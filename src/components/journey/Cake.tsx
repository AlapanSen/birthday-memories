import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Mic } from 'lucide-react';
import { today } from '../../journey';
import { burstFrom } from '../../lib/confetti';
import { withHearts } from '../Doodles';

const { cake } = today;

interface CakeProps {
  onAllOut: () => void;
}

/** A hand-drawn cake. Tap a candle to blow it out — or blow into the mic for real. */
export function Cake({ onAllOut }: CakeProps) {
  const reduce = useReducedMotion() ?? false;
  const [lit, setLit] = useState<boolean[]>(() => Array.from({ length: cake.candles }, () => true));
  const [micState, setMicState] = useState<'idle' | 'listening' | 'error'>('idle');
  const cakeRef = useRef<HTMLDivElement>(null);
  const done = useRef(false);
  const stopMic = useRef<(() => void) | null>(null);

  const blow = useCallback((i: number) => {
    setLit((prev) => (prev[i] ? prev.map((v, k) => (k === i ? false : v)) : prev));
  }, []);

  // Celebrate once every candle is out.
  useEffect(() => {
    if (done.current || lit.some(Boolean)) return;
    done.current = true;
    stopMic.current?.();
    window.setTimeout(() => {
      burstFrom(cakeRef.current, { count: 140, spread: 150, power: 1.15 });
      window.setTimeout(() => burstFrom(cakeRef.current, { count: 60, shapes: ['heart'], spread: 220, power: 0.7 }), 450);
      onAllOut();
    }, 350);
  }, [lit, onAllOut]);

  useEffect(() => () => stopMic.current?.(), []);

  const listen = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AC: typeof AudioContext =
        window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ac = new AC();
      const src = ac.createMediaStreamSource(stream);
      const analyser = ac.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      let raf = 0;
      let loud = 0;
      let lastBlow = 0;

      const loop = (t: number) => {
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (const v of buf) sum += ((v - 128) / 128) ** 2;
        const rms = Math.sqrt(sum / buf.length);
        loud = rms > 0.11 ? loud + 1 : 0;
        if (loud > 4 && t - lastBlow > 170) {
          lastBlow = t;
          setLit((prev) => {
            const i = prev.indexOf(true);
            return i === -1 ? prev : prev.map((v, k) => (k === i ? false : v));
          });
        }
        raf = requestAnimationFrame(loop);
      };
      raf = requestAnimationFrame(loop);
      setMicState('listening');

      stopMic.current = () => {
        cancelAnimationFrame(raf);
        stream.getTracks().forEach((tr) => tr.stop());
        void ac.close();
        stopMic.current = null;
        setMicState('idle');
      };
    } catch {
      setMicState('error');
    }
  };

  const allOut = !lit.some(Boolean);

  return (
    <div className="cake-wrap">
      <p className="cake-wrap__prompt">{cake.prompt}</p>

      <div ref={cakeRef} className="cake">
        <div className="cake__candles">
          {lit.map((on, i) => (
            <button
              key={i}
              type="button"
              className="candle"
              style={{ '--h': `${[86, 100, 92, 100, 88, 96, 90][i % 7]}%` } as CSSProperties}
              onClick={() => blow(i)}
              disabled={!on}
              aria-label={on ? `Blow out candle ${i + 1}` : `Candle ${i + 1} is out`}
            >
              <AnimatePresence>
                {on && (
                  <motion.span
                    className="candle__flame"
                    exit={reduce ? { opacity: 0 } : { scaleY: 0.1, scaleX: 0.4, opacity: 0, y: -4 }}
                    transition={{ duration: 0.25 }}
                  >
                    <span className="candle__glow" />
                    <span className="candle__fire" />
                  </motion.span>
                )}
              </AnimatePresence>
              {!on && !reduce && (
                <motion.span
                  className="candle__smoke"
                  initial={{ opacity: 0.7, y: 0, scale: 0.6 }}
                  animate={{ opacity: 0, y: -46, scale: 1.6, x: [0, 4, -3, 2] }}
                  transition={{ duration: 1.8, ease: 'easeOut' }}
                />
              )}
              <span className="candle__wax" />
            </button>
          ))}
        </div>

        <svg className="cake__art" viewBox="0 0 320 250" aria-hidden="true">
          {/* plate */}
          <ellipse cx="160" cy="232" rx="152" ry="15" fill="#fffaf1" stroke="#d8c3a6" strokeWidth="1.5" />
          <ellipse cx="160" cy="229" rx="128" ry="8" fill="#f3e6d2" />
          {/* bottom tier */}
          <path d="M44 150h232v72c0 5-4 8-9 8H53c-5 0-9-3-9-8z" fill="#f6e1c6" stroke="#38251f" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M44 156c10 14 22 14 26 0 6 20 24 20 28 0 6 14 20 16 26 0 6 22 26 20 30 0 6 16 22 16 28 0 6 20 24 18 28 0 6 14 18 14 26 0 6 16 20 16 26 0v-12H44z" fill="#dca59a" stroke="#38251f" strokeWidth="1.6" strokeLinejoin="round" />
          {/* bottom tier dots */}
          {[70, 110, 150, 190, 230, 260].map((x, i) => (
            <circle key={x} cx={x} cy={i % 2 ? 196 : 206} r="3" fill={i % 2 ? '#c87560' : '#d8af72'} />
          ))}
          {/* top tier */}
          <path d="M82 92h156v58H82z" fill="#fbecd9" stroke="#38251f" strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M82 98c8 12 18 12 22 0 5 16 20 16 24 0 5 12 16 12 22 0 5 18 22 16 25 0 5 12 16 12 22 0 5 14 18 14 22 0 5 10 14 10 17 0v-10H82z" fill="#fffaf1" stroke="#38251f" strokeWidth="1.6" strokeLinejoin="round" />
          {/* sprinkles */}
          {[
            [98, 128, 30],
            [122, 138, -20],
            [150, 124, 60],
            [176, 136, 10],
            [202, 126, -40],
            [224, 138, 25],
          ].map(([x, y, r], i) => (
            <rect key={i} x={x} y={y} width="8" height="2.6" rx="1.3" transform={`rotate(${r} ${x + 4} ${y + 1.3})`} fill={['#c87560', '#d8af72', '#dca59a'][i % 3]} />
          ))}
          {/* tiny heart on the front */}
          <path d="M160 214c-.3-.2-6-3.6-6.8-7.4-.5-2.6 1.3-4.6 3.6-4.4 1.5.1 2.6 1.3 3.2 2.6.6-1.5 1.9-2.7 3.5-2.7 2.3 0 3.7 2.2 3.1 4.6-.9 3.8-6 6.9-6.7 7.6" fill="none" stroke="#a95a47" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {!allOut ? (
          <motion.div key="actions" className="cake-wrap__actions" exit={{ opacity: 0 }}>
            <span className="cake-wrap__tap">{cake.tapHint}</span>
            {micState !== 'error' && 'mediaDevices' in navigator && (
              <button
                type="button"
                className={`pill-btn pill-btn--ghost ${micState === 'listening' ? 'is-listening' : ''}`}
                onClick={micState === 'listening' ? () => stopMic.current?.() : listen}
              >
                <Mic size={15} aria-hidden="true" />
                {micState === 'listening' ? 'listening… blow!' : cake.micLabel}
              </button>
            )}
            {micState === 'error' && <span className="cake-wrap__tap">no mic? tapping works too ♡</span>}
          </motion.div>
        ) : (
          <motion.p
            key="done"
            className="cake-wrap__done"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.4, duration: 1, ease: [0.22, 1, 0.36, 1] }}
          >
            {withHearts(cake.done)}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
