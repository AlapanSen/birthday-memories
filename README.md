# Birthday Memories

A scroll-driven birthday journey — from her childhood to today.
React + TypeScript + Vite + Tailwind v4 + Motion (`motion/react`).

## Run it

```bash
npm install
npm run dev        # http://localhost:5173 — also on your phone via the "Network" URL (same wifi)
npm run build      # type-checks, then builds to dist/
npm run preview    # serve the production build
```

## The journey

| # | Section | What happens | Music |
|---|---------|--------------|-------|
| 0 | **Hero** | Big Polaroid, "Happy Birthday, my favourite person." The button starts the music. | `01-intro` |
| 1 | **It all started somewhere…** | Childhood Polaroids drop onto the page like a tipped-out shoebox | `02-childhood` |
| — | **Growing up** | Page pins; a strip of film rolls sideways as she scrolls | `02-childhood` |
| 2 | **Then, one day, our paths crossed** | Two lines ("you" / "me") draw themselves and meet at a heart → the first photo of you two, your "day I met you" note, little firsts | `03-meeting` |
| 3 | **And then there was us** | Scrapbook: photos, camcorder videos, tickets, sticky notes. Then a swipeable "things I love about you" deck and a gold scratch-off secret | `04-us` |
| — | **Our film** | Dark cinema, one big video of every special moment. Music fades out while it plays | *(none)* |
| 4 | **And here we are** | Today's photos fan out, then the cake — tap the candles or **blow into the mic** → confetti | `05-birthday` |
| — | **The letter** | Wax-sealed envelope she taps open | `05-birthday` |
| — | **Finale** | One more Happy Birthday. Tap the heart 5× for a hidden message | `05-birthday` |

**Surprises:** six "out of the blue" Polaroids fly onto the screen at points along the way.
She can tap to flip them (there's a note on the back), drag them around, or toss them away.

## Adding your photos, videos & music

**Every word, file path and song is in [`src/journey.ts`](src/journey.ts).** Hero text is in `src/content.ts`.
Anything in `[ square brackets ]` is a placeholder for your words. Until a file exists,
the page shows a soft placeholder with the exact filename it's waiting for.

Drop files into `public/` with these names (or change the paths in `journey.ts`):

```
public/
├── images/hero-photo.jpg                  ← hero Polaroid (already there — replace it)
├── photos/
│   ├── childhood/01.jpg … 06.jpg          ← chapter one
│   ├── growing-up/01.jpg … 07.jpg         ← the film strip
│   ├── meeting/first-photo.jpg            ← the first photo of you two
│   ├── meeting/firsts-01.jpg … 04.jpg     ← little firsts
│   ├── us/01.jpg … 09.jpg                 ← the scrapbook
│   ├── secret/secret.jpg                  ← under the scratch-off gold
│   ├── today/01.jpg … 03.jpg              ← chapter four
│   └── surprise/01.jpg … 06.jpg           ← the out-of-the-blue Polaroids
├── videos/
│   ├── us/clip-01.mp4 … clip-03.mp4       ← scrapbook videos (+ optional clip-01.jpg … posters)
│   ├── our-film.mp4                       ← THE film — every special moment
│   └── our-film-poster.jpg                ← still shown before it plays
└── music/
    ├── 01-intro.mp3
    ├── 02-childhood.mp3
    ├── 03-meeting.mp3
    ├── 04-us.mp3
    └── 05-birthday.mp3
```

**Tips**
- **Photos:** JPG, ~1200px on the long side, quality ~80. Portrait or square works best in the Polaroids.
- **Videos:** MP4 (H.264 + AAC) plays everywhere, including iPhone. Keep scrapbook clips short (10–30s)
  and under ~10 MB each. For the big film, 1080p is plenty — compress it (HandBrake, "Fast 1080p30").
- **Music:** MP3, any length (it loops). Put the song name/artist in `tracks` in `journey.ts` so the dock shows it.
- **More or fewer items:** every list in `journey.ts` can be any length — add or delete entries freely.
- **Notes on the back of Polaroids:** add `back: '…'` to any photo item and it becomes flippable.
- **Date stamps:** add `date: "'19 6 14"` to any photo for an orange old-camera date in the corner.
- **Candles:** change `today.cake.candles`.

## How it's built

```
src/
  journey.ts                 ← ALL the content (text, file paths, songs)
  content.ts                 ← hero text
  music/MusicProvider.tsx    ← one audio element + Web Audio fades; chapters switch songs as they cross mid-screen
  music/MusicDock.tsx        ← the little record player in the corner
  lib/confetti.ts            ← tiny paper/heart confetti engine
  components/
    HeroSection.tsx, PolaroidCard.tsx, ScrollCue.tsx
    media/Photo.tsx, MiniPolaroid.tsx, VideoFrame.tsx
    journey/  ChildhoodChapter, FilmStrip, MeetingChapter, UsChapter, ReasonsDeck,
              ScratchCard, OurFilm, TodayChapter, Cake, LoveLetter, Finale,
              SurpriseLayer, ChapterHeader, TornEdge
  styles/  index.css (tokens) · hero.css · media.css · journey.css · widgets.css
```

## Notes

- Browsers don't allow music before a tap, so it starts on "Let's take a little trip" (or the record button).
- The mic for the candles only works on `https://` or `localhost` — tapping always works.
- `prefers-reduced-motion` is respected: no flying, pinning or parallax; the film strip becomes a swipeable row.
- Fonts are self-hosted (Fontsource) — no Google requests.
- Deploying to a sub-path (e.g. GitHub Pages): set `base` in `vite.config.ts`; media paths follow it.
  Also update or remove the hero `<link rel="preload">` in `index.html`.
- **Keep the repo private** once real photos are in.
