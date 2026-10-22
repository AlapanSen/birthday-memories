import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from 'react';
import { tracks, type TrackId } from '../journey';

/**
 * One <audio> element, routed through a Web Audio gain node so fades work on iPhone too
 * (iOS ignores audio.volume). Chapters register a "marker" — when a chapter crosses the
 * middle of the screen, its song fades in and the previous one fades out.
 */

const VOLUME = 0.7;

interface MusicControls {
  /** Call from a tap/click — browsers only allow sound after a gesture. */
  start: () => void;
  toggle: () => void;
  /** null = silence (e.g. while the film section is on screen). */
  setMarker: (track: TrackId | null, label: string) => void;
  /** Temporarily fade music out (videos call this while playing). */
  duck: (on: boolean) => void;
}

interface MusicState {
  enabled: boolean;
  current: TrackId | null;
  missing: Partial<Record<TrackId, boolean>>;
  label: string;
  desired: TrackId | null;
}

const ControlsCtx = createContext<MusicControls | null>(null);
const StateCtx = createContext<MusicState | null>(null);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const loaded = useRef<TrackId | null>(null);
  const desired = useRef<TrackId | null>('intro');
  const enabledRef = useRef(false);
  const duckCount = useRef(0);
  const hidden = useRef(false);
  const gen = useRef(0);
  const volTimer = useRef<number | undefined>(undefined);

  const [enabled, setEnabled] = useState(false);
  const [current, setCurrent] = useState<TrackId | null>(null);
  const [missing, setMissing] = useState<Partial<Record<TrackId, boolean>>>({});
  const [label, setLabel] = useState('the beginning');
  const [desiredState, setDesiredState] = useState<TrackId | null>('intro');

  const setVolume = useCallback((target: number, ms: number) => {
    const el = audioRef.current;
    const gain = gainRef.current;
    const ac = ctxRef.current;
    if (gain && ac) {
      const now = ac.currentTime;
      gain.gain.cancelScheduledValues(now);
      gain.gain.setValueAtTime(gain.gain.value, now);
      gain.gain.linearRampToValueAtTime(target, now + ms / 1000);
      return;
    }
    if (!el) return;
    window.clearInterval(volTimer.current);
    if (ms <= 0) {
      el.volume = target;
      return;
    }
    const from = el.volume;
    const t0 = performance.now();
    volTimer.current = window.setInterval(() => {
      const k = Math.min(1, (performance.now() - t0) / ms);
      el.volume = from + (target - from) * k;
      if (k >= 1) window.clearInterval(volTimer.current);
    }, 30);
  }, []);

  const reconcile = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    const target = enabledRef.current && duckCount.current === 0 && !hidden.current ? desired.current : null;
    const g = ++gen.current;

    if (target === null) {
      setVolume(0, 700);
      window.setTimeout(() => {
        if (gen.current === g) el.pause();
      }, 720);
      setCurrent(null);
      return;
    }

    if (loaded.current === target) {
      if (el.paused) el.play().catch(() => undefined);
      setVolume(VOLUME, 1200);
      setCurrent(target);
      return;
    }

    const swap = () => {
      if (gen.current !== g) return;
      loaded.current = target;
      el.src = tracks[target].src;
      setVolume(0, 0);
      el.play()
        .then(() => {
          if (gen.current === g) setVolume(VOLUME, 1600);
        })
        .catch(() => undefined);
      setCurrent(target);
    };

    if (!el.paused && loaded.current) {
      setVolume(0, 850);
      window.setTimeout(swap, 870);
    } else {
      swap(); // synchronous — keeps us inside the user's tap on iOS
    }
  }, [setVolume]);

  const ensureAudio = useCallback(() => {
    if (audioRef.current) return;
    const el = new Audio();
    el.loop = true;
    el.preload = 'auto';
    el.addEventListener('error', () => {
      const t = loaded.current;
      if (t) setMissing((m) => ({ ...m, [t]: true }));
    });
    audioRef.current = el;

    const AC: typeof AudioContext | undefined =
      window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (AC) {
      try {
        const ac = new AC();
        const source = ac.createMediaElementSource(el);
        const gain = ac.createGain();
        gain.gain.value = 0;
        source.connect(gain).connect(ac.destination);
        ctxRef.current = ac;
        gainRef.current = gain;
      } catch {
        /* fall back to element volume */
      }
    }
  }, []);

  const start = useCallback(() => {
    ensureAudio();
    void ctxRef.current?.resume();
    enabledRef.current = true;
    setEnabled(true);
    reconcile();
  }, [ensureAudio, reconcile]);

  const toggle = useCallback(() => {
    if (enabledRef.current) {
      enabledRef.current = false;
      setEnabled(false);
      reconcile();
    } else {
      start();
    }
  }, [reconcile, start]);

  const setMarker = useCallback(
    (track: TrackId | null, nextLabel: string) => {
      setLabel(nextLabel);
      if (desired.current === track) return;
      desired.current = track;
      setDesiredState(track);
      reconcile();
    },
    [reconcile],
  );

  const duck = useCallback(
    (on: boolean) => {
      duckCount.current = Math.max(0, duckCount.current + (on ? 1 : -1));
      reconcile();
    },
    [reconcile],
  );

  // Pause when she switches apps / tabs, resume when she's back.
  useEffect(() => {
    const onVis = () => {
      hidden.current = document.visibilityState === 'hidden';
      reconcile();
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, [reconcile]);

  const controls = useMemo<MusicControls>(() => ({ start, toggle, setMarker, duck }), [start, toggle, setMarker, duck]);
  const state = useMemo<MusicState>(
    () => ({ enabled, current, missing, label, desired: desiredState }),
    [enabled, current, missing, label, desiredState],
  );

  return (
    <ControlsCtx.Provider value={controls}>
      <StateCtx.Provider value={state}>{children}</StateCtx.Provider>
    </ControlsCtx.Provider>
  );
}

export function useMusic(): MusicControls {
  const c = useContext(ControlsCtx);
  if (!c) throw new Error('useMusic must be used inside <MusicProvider>');
  return c;
}

export function useMusicState(): MusicState {
  const s = useContext(StateCtx);
  if (!s) throw new Error('useMusicState must be used inside <MusicProvider>');
  return s;
}

/**
 * Marks a section of the journey. When it crosses the middle of the screen,
 * the dock shows `label` and the music switches to `track`.
 */
export function useJourneyMarker(ref: RefObject<HTMLElement | null>, track: TrackId | null, label: string) {
  const { setMarker } = useMusic();
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setMarker(track, label);
      },
      { rootMargin: '-50% 0px -50% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, track, label, setMarker]);
}
