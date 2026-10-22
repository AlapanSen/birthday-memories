import { Fragment, useState, type ReactNode } from 'react';

export interface PhotoProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/** Strips the site base so placeholders show the path relative to /public. */
export function publicPath(src: string): string {
  const base = import.meta.env.BASE_URL;
  return src.startsWith(base) ? src.slice(base.length) : src.replace(/^\//, '');
}

/** Lets long file paths wrap after slashes and dashes instead of mid-word. */
export function breakablePath(path: string): ReactNode {
  return path.split(/(?<=[/-])/).map((part, i) => (
    <Fragment key={i}>
      {i > 0 && <wbr />}
      {part}
    </Fragment>
  ));
}

/**
 * Fills its (positioned) parent with an image. If the file isn't there yet,
 * shows a soft placeholder with the exact filename to add.
 */
export function Photo({ src, alt, className = '', sizes, priority = false }: PhotoProps) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className={`photo-ph ${className}`} role="img" aria-label={alt}>
        <svg className="photo-ph__icon" viewBox="0 0 32 32" fill="none" aria-hidden="true">
          <path
            d="M5.5 10.2c0-1.3 1-2.3 2.3-2.3h3.1l1.6-2.4h7l1.6 2.4h3.2c1.3 0 2.3 1 2.3 2.3v12.4c0 1.3-1 2.3-2.3 2.3H7.8c-1.3 0-2.3-1-2.3-2.3z"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinejoin="round"
          />
          <circle cx="16" cy="16.2" r="4.6" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <span className="photo-ph__path">{breakablePath(publicPath(src))}</span>
      </div>
    );
  }

  return (
    <img
      className={`photo ${className}`}
      src={src}
      alt={alt}
      sizes={sizes}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => setFailed(true)}
    />
  );
}
