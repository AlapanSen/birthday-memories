/**
 * ─────────────────────────────────────────────────────────────
 *  ALL THE WORDS ON THE PAGE LIVE HERE.
 *  Edit freely — components only read from this file.
 *  A "♡" anywhere in a string is automatically tinted terracotta.
 * ─────────────────────────────────────────────────────────────
 */

export interface PhotoContent {
  /** Path inside /public. Put your real photo at public/images/hero-photo.jpg */
  src: string;
  /** Optional responsive sources, e.g. "/images/hero-photo-800.jpg 800w, /images/hero-photo.jpg 1200w" */
  srcSet?: string;
  /** Intrinsic size of the photo — keeps the layout from jumping while it loads. */
  width: number;
  height: number;
  /** Describe the photo for screen readers (update this when you swap the image). */
  alt: string;
  caption: string;
  note: string;
}

export interface HeroContent {
  eyebrow: string;
  headline: { lead: string; accent: string };
  intro: string;
  cta: { label: string; targetId: string };
  signature: string;
  photo: PhotoContent;
}

export interface StoryContent {
  id: string;
  eyebrow: string;
  heading: string;
}

const base = import.meta.env.BASE_URL;

export const heroContent: HeroContent = {
  eyebrow: 'A little world made just for you',
  headline: {
    lead: 'Happy Birthday,',
    accent: 'my favourite person.',
  },
  intro:
    'A little trip down memory lane — through the moments, the laughter, and all the little things that make us, us.',
  cta: {
    label: "Let's take a little trip",
    targetId: 'our-story',
  },
  signature: 'made with love, from my little corner of the world ♡',
  photo: {
    src: `${base}images/hero-photo.jpg`,
    width: 1200,
    height: 1500,
    alt: 'A treasured photograph, framed like a Polaroid',
    caption: 'Happy Birthday ♡',
    note: 'a little something, just for you',
  },
};

export const storyContent: StoryContent = {
  id: 'our-story',
  eyebrow: 'chapter one',
  heading: 'It all started somewhere…',
};
