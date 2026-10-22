import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import { useMusic } from '../../music/MusicProvider';
import { breakablePath, publicPath } from './Photo';

export interface VideoFrameProps {
  src: string;
  poster?: string;
  label: string;
  variant?: 'camcorder' | 'cinema';
  className?: string;
}

/**
 * A video that waits for a tap. Background music fades out while it plays.
 * Missing files show a placeholder with the filename to add.
 */
export function VideoFrame({ src, poster, label, variant = 'camcorder', className = '' }: VideoFrameProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const { duck } = useMusic();
  const [started, setStarted] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const [posterFailed, setPosterFailed] = useState(!poster);
  const ducked = useRef(false);

  const setDuck = (on: boolean) => {
    if (ducked.current === on) return;
    ducked.current = on;
    duck(on);
  };

  // Release the duck if the component unmounts mid-play.
  useEffect(() => () => {
    if (ducked.current) duck(false);
  }, [duck]);

  const play = () => {
    const v = ref.current;
    if (!v) return;
    setStarted(true);
    v.play().catch(() => setFailed(true));
  };

  return (
    <div className={`vframe vframe--${variant} ${className}`}>
      <div className="vframe__screen">
        {failed ? (
          <div className="photo-ph photo-ph--video" role="img" aria-label={label}>
            <Play className="photo-ph__icon" aria-hidden="true" />
            <span className="photo-ph__path">{breakablePath(publicPath(src))}</span>
          </div>
        ) : (
          <>
            <video
              ref={ref}
              className="vframe__video"
              src={src}
              poster={posterFailed ? undefined : poster}
              playsInline
              preload="metadata"
              controls={started}
              aria-label={label}
              onPlay={() => {
                setPlaying(true);
                setDuck(true);
              }}
              onPause={() => {
                setPlaying(false);
                setDuck(false);
              }}
              onEnded={() => {
                setPlaying(false);
                setDuck(false);
              }}
              onError={() => setFailed(true)}
            />
            {/* Probe the poster so a missing one doesn't show a broken frame. */}
            {poster && !posterFailed && (
              <img src={poster} alt="" hidden onError={() => setPosterFailed(true)} />
            )}
            {!started && (
              <button type="button" className="vframe__play" onClick={play} aria-label={`Play: ${label}`}>
                <span className="vframe__play-dot">
                  <Play size={22} strokeWidth={1.8} fill="currentColor" aria-hidden="true" />
                </span>
              </button>
            )}
          </>
        )}

        {variant === 'camcorder' && (
          <div className="vframe__hud" aria-hidden="true">
            <span className={`vframe__rec ${playing ? 'is-live' : ''}`}>● REC</span>
            <span className="vframe__bat" />
            <span className="vframe__corner vframe__corner--tl" />
            <span className="vframe__corner vframe__corner--tr" />
            <span className="vframe__corner vframe__corner--bl" />
            <span className="vframe__corner vframe__corner--br" />
          </div>
        )}
      </div>
    </div>
  );
}
