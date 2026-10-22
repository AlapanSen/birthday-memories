import { Fragment, type ReactNode, type SVGProps } from 'react';

/**
 * Hand-drawn doodles. Paths are deliberately a little wobbly and
 * don't quite close — that's what makes them feel drawn, not icons.
 */

type DoodleProps = SVGProps<SVGSVGElement> & { size?: number | string };

export function HeartDoodle({ size = 24, strokeWidth = 1.6, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true" focusable="false" {...rest}>
      <path
        d="M12.1 20.3c-.4-.3-7.7-4.7-8.7-9.5C2.7 7.5 5 4.9 7.9 5.1c1.9.2 3.3 1.6 4.1 3.3.8-1.9 2.4-3.4 4.5-3.5 2.9 0 4.7 2.8 3.9 5.9-1.2 4.8-7.6 8.8-8.5 9.7"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function SparkleDoodle({ size = 24, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true" focusable="false" {...rest}>
      <path
        d="M12 2.8c.5 4.4 1.7 7 8.3 8.9-6.4 1.6-7.8 4.1-8.4 9.6-.8-5.3-2.4-8-8.3-9.5 5.9-1.3 7.6-4.2 8.4-9"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StarDoodle({ size = 24, ...rest }: DoodleProps) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden="true" focusable="false" {...rest}>
      <path
        d="M12.2 3.4 14.4 9l5.9.3-4.6 3.8 1.6 5.8-5-3.3-5 3.4 1.5-5.9L4.2 9.4l5.9-.4 2.3-5.8"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Swaps any "♡" in a string for a little hand-drawn heart.
 * (None of the web fonts include ♡, and system fallbacks vary wildly
 * between phones — the SVG looks the same everywhere.)
 */
export function withHearts(text: string): ReactNode {
  const parts = text.split('♡');
  if (parts.length === 1) return text;
  return parts.map((part, i) => (
    <Fragment key={i}>
      {part}
      {i < parts.length - 1 && (
        <span className="tint-heart" aria-hidden="true">
          <HeartDoodle size="100%" strokeWidth={2} />
        </span>
      )}
    </Fragment>
  ));
}
