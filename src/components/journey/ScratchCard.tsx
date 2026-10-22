import { useCallback, useEffect, useRef, useState, type PointerEvent } from 'react';
import { motion } from 'motion/react';
import { secret } from '../../journey';
import { burstFrom } from '../../lib/confetti';
import { withHearts } from '../Doodles';
import { MiniPolaroid } from '../media/MiniPolaroid';

const REVEAL_AT = 0.5; // fraction scratched before the foil falls away

/** Gold foil she scratches off with a finger (or mouse) to find a hidden photo + message. */
export function ScratchCard() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const strokes = useRef(0);
  const started = useRef(false);
  const [revealed, setRevealed] = useState(false);
  const [scratching, setScratching] = useState(false);

  const paintFoil = useCallback(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const { width, height } = wrap.getBoundingClientRect();
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const g = ctx.createLinearGradient(0, 0, width, height);
    g.addColorStop(0, '#c99a55');
    g.addColorStop(0.35, '#ecd29b');
    g.addColorStop(0.55, '#d4ad6c');
    g.addColorStop(0.8, '#f1dcae');
    g.addColorStop(1, '#bf8f4c');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, width, height);

    // Brushed-foil speckle
    for (let i = 0; i < (width * height) / 30; i++) {
      ctx.fillStyle = Math.random() < 0.5 ? 'rgba(255,248,230,0.35)' : 'rgba(120,80,30,0.12)';
      ctx.fillRect(Math.random() * width, Math.random() * height, 1.2, 1.2);
    }

    ctx.fillStyle = 'rgba(77,52,30,0.72)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `600 ${Math.max(26, width / 11)}px Caveat, cursive`;
    ctx.fillText('scratch me', width / 2, height / 2 - 10);
    ctx.font = `400 ${Math.max(15, width / 22)}px "DM Sans Variable", sans-serif`;
    ctx.fillText('there’s something underneath', width / 2, height / 2 + Math.max(24, width / 13));
  }, []);

  useEffect(() => {
    paintFoil();
    const onResize = () => {
      if (!started.current) paintFoil();
    };
    window.addEventListener('resize', onResize);
    // Repaint once fonts are ready so the handwriting renders.
    void document.fonts?.ready.then(() => {
      if (!started.current) paintFoil();
    });
    return () => window.removeEventListener('resize', onResize);
  }, [paintFoil]);

  const reveal = useCallback(() => {
    setRevealed(true);
    window.setTimeout(() => burstFrom(wrapRef.current, { count: 70, spread: 160, power: 0.8 }), 250);
  }, []);

  const checkProgress = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += 4 * 24) {
      total++;
      if (data[i] < 40) clear++;
    }
    if (clear / total > REVEAL_AT) reveal();
  }, [reveal]);

  const scratchTo = (e: PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = Math.max(34, rect.width / 9);
    ctx.beginPath();
    const from = last.current ?? { x, y };
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(x + 0.01, y);
    ctx.stroke();
    ctx.globalCompositeOperation = 'source-over';
    last.current = { x, y };
    if (++strokes.current % 14 === 0) checkProgress();
  };

  return (
    <section className="secret" aria-labelledby="secret-title">
      <h3 id="secret-title" className="secret__title">
        {secret.title}
      </h3>
      <p className="secret__hint">{secret.hint}</p>

      <div ref={wrapRef} className="secret__card">
        <div className="secret__inside">
          <MiniPolaroid item={secret.photo} rotate={-3} lift={false} className="secret__photo" />
          <p className="secret__message">{withHearts(secret.message)}</p>
        </div>

        <motion.canvas
          ref={canvasRef}
          className={`secret__foil ${scratching ? 'is-scratching' : ''}`}
          animate={revealed ? { opacity: 0, scale: 1.04 } : { opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          style={{ pointerEvents: revealed ? 'none' : 'auto' }}
          aria-hidden="true"
          onPointerDown={(e) => {
            drawing.current = true;
            started.current = true;
            setScratching(true);
            last.current = null;
            e.currentTarget.setPointerCapture(e.pointerId);
            scratchTo(e);
          }}
          onPointerMove={(e) => {
            if (drawing.current) scratchTo(e);
          }}
          onPointerUp={() => {
            drawing.current = false;
            setScratching(false);
            checkProgress();
          }}
          onPointerCancel={() => {
            drawing.current = false;
            setScratching(false);
          }}
        />
      </div>

      {!revealed && (
        <button type="button" className="text-btn secret__skip" onClick={reveal}>
          or just reveal it
        </button>
      )}
    </section>
  );
}
