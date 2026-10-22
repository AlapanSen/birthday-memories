/**
 * Tiny paper-confetti engine: one shared canvas, created on demand and removed when idle.
 * Paper pieces flutter (they flip as they fall); hearts drift.
 */

type Shape = 'paper' | 'heart' | 'dot';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
  vr: number;
  tilt: number;
  vt: number;
  size: number;
  color: string;
  shape: Shape;
  life: number;
  maxLife: number;
}

export interface BurstOptions {
  /** Origin in viewport px. Defaults to centre. */
  x?: number;
  y?: number;
  count?: number;
  shapes?: Shape[];
  /** Initial speed multiplier. */
  power?: number;
  /** Spread angle in degrees around "up". 360 = all directions. */
  spread?: number;
  colors?: string[];
}

const PALETTE = ['#C87560', '#DCA59A', '#D8AF72', '#FFF9F0', '#A95A47', '#E9C9A5'];

let canvas: HTMLCanvasElement | null = null;
let ctx: CanvasRenderingContext2D | null = null;
let particles: Particle[] = [];
let raf = 0;
let dpr = 1;

const heart = (() => {
  if (typeof Path2D === 'undefined') return null;
  return new Path2D('M0 3.2C-.9 1.6-3.2-.2-3.2-2.1-3.2-3.5-2.1-4.4-1-4.4-.3-4.4.3-4 0-3.2 .4-4 1-4.4 1.8-4.4 2.9-4.4 3.9-3.4 3.4-2 2.8-.2 .8 1.6 0 3.2Z');
})();

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function ensureCanvas() {
  if (canvas) return;
  canvas = document.createElement('canvas');
  canvas.setAttribute('aria-hidden', 'true');
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '80',
  });
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');
  resize();
  window.addEventListener('resize', resize);
}

function resize() {
  if (!canvas) return;
  dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.round(window.innerWidth * dpr);
  canvas.height = Math.round(window.innerHeight * dpr);
}

function teardown() {
  cancelAnimationFrame(raf);
  raf = 0;
  window.removeEventListener('resize', resize);
  canvas?.remove();
  canvas = null;
  ctx = null;
}

function tick() {
  if (!ctx || !canvas) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const h = window.innerHeight;
  particles = particles.filter((pt) => pt.life < pt.maxLife && pt.y < h + 40);

  for (const pt of particles) {
    pt.life += 1;
    pt.vy += pt.shape === 'heart' ? 0.04 : 0.12; // gravity
    pt.vx *= 0.985; // air drag
    pt.vy *= pt.shape === 'heart' ? 0.97 : 0.985;
    pt.x += pt.vx + Math.sin(pt.life / 14) * 0.35;
    pt.y += pt.vy;
    pt.rot += pt.vr;
    pt.tilt += pt.vt;

    const fade = Math.min(1, (pt.maxLife - pt.life) / 40);
    ctx.save();
    ctx.globalAlpha = fade;
    ctx.translate(pt.x, pt.y);
    ctx.rotate(pt.rot);
    ctx.fillStyle = pt.color;

    if (pt.shape === 'paper') {
      ctx.scale(1, Math.cos(pt.tilt)); // flutter
      ctx.fillRect(-pt.size / 2, -pt.size / 3, pt.size, pt.size * 0.62);
    } else if (pt.shape === 'heart' && heart) {
      const s = pt.size / 7;
      ctx.scale(s, s);
      ctx.fill(heart);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, pt.size / 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  if (particles.length) raf = requestAnimationFrame(tick);
  else teardown();
}

export function burst({
  x = window.innerWidth / 2,
  y = window.innerHeight / 2,
  count = 90,
  shapes = ['paper', 'paper', 'dot', 'heart'],
  power = 1,
  spread = 110,
  colors = PALETTE,
}: BurstOptions = {}) {
  if (typeof window === 'undefined') return;
  const reduce = prefersReducedMotion();
  const n = reduce ? Math.round(count * 0.25) : count;

  ensureCanvas();
  for (let i = 0; i < n; i++) {
    const angle = ((-90 + (Math.random() - 0.5) * spread) * Math.PI) / 180;
    const speed = (4 + Math.random() * 7) * power * (reduce ? 0.4 : 1);
    const shape = shapes[Math.floor(Math.random() * shapes.length)];
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      rot: Math.random() * Math.PI * 2,
      vr: (Math.random() - 0.5) * 0.2,
      tilt: Math.random() * Math.PI,
      vt: 0.05 + Math.random() * 0.12,
      size: shape === 'heart' ? 9 + Math.random() * 8 : 6 + Math.random() * 7,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape,
      life: 0,
      maxLife: 160 + Math.random() * 100,
    });
  }
  if (!raf) raf = requestAnimationFrame(tick);
}

/** Burst from the centre of an element. */
export function burstFrom(el: Element | null, opts: BurstOptions = {}) {
  if (!el) return burst(opts);
  const r = el.getBoundingClientRect();
  burst({ x: r.left + r.width / 2, y: r.top + r.height / 2, ...opts });
}
