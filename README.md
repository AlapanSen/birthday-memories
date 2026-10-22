# Birthday Memories — Hero

React + TypeScript + Vite + Tailwind v4 + Motion (`motion/react`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173  (also on your LAN — open the "Network" URL on your phone)
npm run build      # type-checks, then builds to dist/
npm run preview    # serve the production build
```

Node 20+ recommended.

## Add your photo

1. Put your photo at **`public/images/hero-photo.jpg`** (replace the placeholder; same filename).
   - Portrait works best (4:5). Landscape is fine too — it's cropped with `object-fit: cover`.
   - ~1200×1500 px, JPG quality ~80 keeps it fast on phones.
2. In **`src/content.ts`**, update `photo.width` / `photo.height` to your image's real pixel size
   (prevents layout shift) and write a real `photo.alt` description.
3. If faces get cropped, tweak `object-position` on `.polaroid__img` in `src/styles/hero.css`
   (e.g. `center 30%` moves the crop up).

Optional — sharper on big screens, lighter on phones: export two sizes and set
`srcSet: '/images/hero-photo-800.jpg 800w, /images/hero-photo.jpg 1200w'` in `content.ts`.

If the file is ever missing, the Polaroid shows a soft "your favourite photo goes here" card instead of a broken image.

## Edit the words

Every line of text lives in **`src/content.ts`**. A `♡` in any string renders as a small hand-drawn heart.

## Where things are

```
src/
  content.ts                 ← all text + photo settings
  lib/motion.ts              ← easing curves + entrance timeline (retime everything here)
  components/
    HeroSection.tsx          ← layout, scroll drift, backdrop doodles
    PolaroidCard.tsx         ← reusable Polaroid (tape, develop-in reveal, float, hover, fallback)
    ScrollCue.tsx            ← the CTA (real #anchor + smooth scroll + focus hand-off)
    OurStorySection.tsx      ← next chapter placeholder (#our-story) with torn-paper edge
    Doodles.tsx              ← hand-drawn heart / sparkle / star SVGs
  styles/
    index.css                ← Tailwind import, colour + font tokens, paper texture, film grain
    hero.css                 ← hero, Polaroid, CTA, decorations
    story.css                ← next chapter
public/images/hero-photo.jpg ← your photo
```

## Notes

- Layout is two columns on desktop and landscape tablets; stacked (headline → Polaroid → text → button)
  on phones and portrait tablets.
- Fonts (Cormorant Garamond, Caveat, DM Sans) are self-hosted via Fontsource — no Google requests.
- `prefers-reduced-motion` is respected: no float, drift, parallax or reveal; content just fades in.
- Building the next chapter: add content inside `OurStorySection.tsx` where marked, and reuse
  `<PolaroidCard reduceMotion={...} {...photo} />` for each memory.
- Deploying to a sub-path (e.g. GitHub Pages): set `base` in `vite.config.ts`; image paths follow it
  automatically. Also update or remove the `<link rel="preload">` in `index.html`.
