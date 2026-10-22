/**
 * ─────────────────────────────────────────────────────────────
 *  THE WHOLE JOURNEY LIVES HERE — every word, photo, video and song.
 *
 *  • Photos  → public/photos/...   Videos → public/videos/...   Music → public/music/...
 *  • Missing files show a soft placeholder with the exact filename to add.
 *  • Anything in [ square brackets ] is a placeholder for YOUR words.
 *  • A "♡" in any text becomes a little hand-drawn heart.
 *  • Delete or add items freely — every list can be any length.
 * ─────────────────────────────────────────────────────────────
 */

const p = (path: string) => `${import.meta.env.BASE_URL}${path}`;

/* ── Types ─────────────────────────────────────────────────── */

export interface PhotoItem {
  type: 'photo';
  src: string;
  alt: string;
  caption?: string;
  /** Shown as an old-camera orange date stamp, e.g. "'03 6 14". Leave out to hide. */
  date?: string;
  /** Written on the back — tap the Polaroid to flip it. */
  back?: string;
}

export interface VideoItem {
  type: 'video';
  src: string;
  /** Still image shown before it plays. */
  poster?: string;
  caption?: string;
  date?: string;
}

export interface NoteItem {
  type: 'note';
  text: string;
  tone?: 'butter' | 'rose' | 'sage';
}

export interface TicketItem {
  type: 'ticket';
  title: string;
  subtitle?: string;
  date?: string;
}

export type ScrapItem = PhotoItem | VideoItem | NoteItem | TicketItem;

export type TrackId = 'intro' | 'childhood' | 'meeting' | 'us' | 'birthday';

export interface Track {
  src: string;
  title: string;
  artist?: string;
}

/* ── Music — one song per part of the journey ──────────────── */
/* It starts when she taps "Let's take a little trip" (browsers block autoplay),
   then crossfades as she scrolls from chapter to chapter. */

export const tracks: Record<TrackId, Track> = {
  intro: { src: p('music/01-intro.mp3'), title: '[ song for the opening ]', artist: '[ artist ]' },
  childhood: { src: p('music/02-childhood.mp3'), title: '[ song for her childhood ]', artist: '[ artist ]' },
  meeting: { src: p('music/03-meeting.mp3'), title: '[ song for when you met ]', artist: '[ artist ]' },
  us: { src: p('music/04-us.mp3'), title: '[ "our song" ]', artist: '[ artist ]' },
  birthday: { src: p('music/05-birthday.mp3'), title: '[ song for today ]', artist: '[ artist ]' },
};

/* ── Chapter one: childhood ────────────────────────────────── */

export const childhood = {
  id: 'our-story', // the hero button scrolls here — keep this id
  number: 'chapter one',
  title: 'It all started somewhere…',
  kicker: 'long before I knew you',
  intro:
    'Before there was an “us”, there was you — tiny, curious, and already a little bit magic. Let’s start right at the beginning.',
  photos: [
    { type: 'photo', src: p('photos/childhood/01.jpg'), alt: 'Her as a baby', caption: 'tiny you ♡', back: '[ a note about this photo ]' },
    { type: 'photo', src: p('photos/childhood/02.jpg'), alt: 'Her as a toddler', caption: 'that smile, even then' },
    { type: 'photo', src: p('photos/childhood/03.jpg'), alt: 'Her as a little girl', caption: 'little explorer' },
    { type: 'photo', src: p('photos/childhood/04.jpg'), alt: 'Childhood photo', caption: 'look at those cheeks', back: '[ something sweet ]' },
    { type: 'photo', src: p('photos/childhood/05.jpg'), alt: 'Childhood photo', caption: 'already the main character' },
    { type: 'photo', src: p('photos/childhood/06.jpg'), alt: 'Childhood photo', caption: 'school-day you' },
  ] satisfies PhotoItem[],
  stickyNote: 'the world had no idea what was coming ♡',
};

/* ── Interlude: growing up (sideways film strip) ───────────── */

export const growingUp = {
  number: 'interlude',
  title: 'Growing up',
  kicker: 'keep scrolling — the film rolls',
  frames: [
    { type: 'photo', src: p('photos/growing-up/01.jpg'), alt: 'Growing up', caption: 'school days' },
    { type: 'photo', src: p('photos/growing-up/02.jpg'), alt: 'Growing up', caption: 'growing up' },
    { type: 'photo', src: p('photos/growing-up/03.jpg'), alt: 'Growing up', caption: 'the in-between years' },
    { type: 'photo', src: p('photos/growing-up/04.jpg'), alt: 'Growing up', caption: 'little adventures' },
    { type: 'photo', src: p('photos/growing-up/05.jpg'), alt: 'Growing up', caption: 'friends who stayed' },
    { type: 'photo', src: p('photos/growing-up/06.jpg'), alt: 'Growing up', caption: 'becoming you' },
    { type: 'photo', src: p('photos/growing-up/07.jpg'), alt: 'Growing up', caption: 'almost there…' },
  ] satisfies PhotoItem[],
  outro: 'and then…',
};

/* ── Chapter two: the day your paths crossed ───────────────── */

export const meeting = {
  number: 'chapter two',
  title: 'Then, one day, our paths crossed',
  kicker: 'two little lines, one big turn',
  youLabel: 'you',
  meLabel: 'me',
  firstPhoto: {
    type: 'photo',
    src: p('photos/meeting/first-photo.jpg'),
    alt: 'The first photo of us together',
    caption: 'the first photo of us',
    back: '[ what you remember about this day ]',
  } satisfies PhotoItem,
  note: {
    heading: 'The day I met you',
    date: '[ date ]',
    body: [
      '[ Where were you? What was the very first thing you noticed about her? ]',
      '[ What did you think on the way home that day? ]',
    ],
    signoff: '— [ you ]',
  },
  firstsTitle: 'little firsts',
  firsts: [
    { type: 'photo', src: p('photos/meeting/firsts-01.jpg'), alt: 'Our first conversation', caption: 'first conversation', date: '' },
    { type: 'photo', src: p('photos/meeting/firsts-02.jpg'), alt: 'Our first date', caption: 'first date' },
    { type: 'photo', src: p('photos/meeting/firsts-03.jpg'), alt: 'Our first trip', caption: 'first trip' },
    { type: 'photo', src: p('photos/meeting/firsts-04.jpg'), alt: 'A first together', caption: '[ another first ]' },
  ] satisfies PhotoItem[],
};

/* ── Chapter three: us (the scrapbook) ─────────────────────── */

export const us = {
  number: 'chapter three',
  title: 'And then there was us',
  kicker: 'all the little moments in between',
  intro: 'The silly ones, the soft ones, and the ones only the two of us will ever understand.',
  scrapbook: [
    { type: 'photo', src: p('photos/us/01.jpg'), alt: 'Us together', caption: '[ caption ]', back: '[ a little note ]' },
    { type: 'note', text: '[ an inside joke goes here ]', tone: 'butter' },
    { type: 'video', src: p('videos/us/clip-01.mp4'), poster: p('videos/us/clip-01.jpg'), caption: '[ a little video ]' },
    { type: 'photo', src: p('photos/us/02.jpg'), alt: 'Us together', caption: '[ caption ]' },
    { type: 'ticket', title: '[ a movie / concert / trip ]', subtitle: 'admit two', date: '[ date ]' },
    { type: 'photo', src: p('photos/us/03.jpg'), alt: 'Us together', caption: '[ caption ]' },
    { type: 'photo', src: p('photos/us/04.jpg'), alt: 'Us together', caption: '[ caption ]', back: '[ a little note ]' },
    { type: 'video', src: p('videos/us/clip-02.mp4'), poster: p('videos/us/clip-02.jpg'), caption: '[ a little video ]' },
    { type: 'note', text: '[ something she always says ]', tone: 'rose' },
    { type: 'photo', src: p('photos/us/05.jpg'), alt: 'Us together', caption: '[ caption ]' },
    { type: 'photo', src: p('photos/us/06.jpg'), alt: 'Us together', caption: '[ caption ]' },
    { type: 'ticket', title: '[ a place you went ]', subtitle: 'one of my favourite days', date: '[ date ]' },
    { type: 'photo', src: p('photos/us/07.jpg'), alt: 'Us together', caption: '[ caption ]' },
    { type: 'video', src: p('videos/us/clip-03.mp4'), poster: p('videos/us/clip-03.jpg'), caption: '[ a little video ]' },
    { type: 'photo', src: p('photos/us/08.jpg'), alt: 'Us together', caption: '[ caption ]' },
    { type: 'note', text: '[ a place we want to go next ]', tone: 'sage' },
    { type: 'photo', src: p('photos/us/09.jpg'), alt: 'Us together', caption: '[ caption ]', back: '[ a little note ]' },
  ] satisfies ScrapItem[],
};

/* ── Swipeable deck: things I love about you ───────────────── */

export const reasons = {
  title: 'A few things I love about you',
  hint: 'swipe the cards',
  items: [
    '[ the way you … ]',
    '[ how you always … ]',
    '[ that thing you do when … ]',
    '[ your laugh when … ]',
    '[ how you make … feel like home ]',
    '[ the way you look at … ]',
    '[ how you never … ]',
    '[ one more reason ]',
  ],
  endCard: 'and a thousand more I’m still finding ♡',
};

/* ── Scratch card: a little secret ─────────────────────────── */

export const secret = {
  title: 'A little secret',
  hint: 'scratch the gold to reveal it',
  photo: { type: 'photo', src: p('photos/secret/secret.jpg'), alt: 'A secret photo', caption: '[ caption ]' } satisfies PhotoItem,
  message: '[ a secret message, just for her ]',
};

/* ── The film: every special moment of us ──────────────────── */

export const film = {
  number: 'our film',
  title: 'Every moment, in one place',
  kicker: 'grab some popcorn',
  credit: 'a film by me · starring you',
  video: { type: 'video', src: p('videos/our-film.mp4'), poster: p('videos/our-film-poster.jpg') } satisfies VideoItem,
};

/* ── Chapter four: today ───────────────────────────────────── */

export const today = {
  number: 'chapter four',
  title: 'And here we are',
  kicker: 'today',
  intro: 'From a little girl in old photographs to the person I get to love today.',
  photos: [
    { type: 'photo', src: p('photos/today/01.jpg'), alt: 'Her today', caption: '[ caption ]' },
    { type: 'photo', src: p('photos/today/02.jpg'), alt: 'Us today', caption: '[ caption ]' },
    { type: 'photo', src: p('photos/today/03.jpg'), alt: 'Her today', caption: '[ caption ]' },
  ] satisfies PhotoItem[],
  cake: {
    candles: 5,
    prompt: 'Make a wish, then blow out the candles',
    tapHint: 'tap each candle',
    micLabel: 'or blow into the mic',
    done: 'Happy Birthday, my love ♡',
    afterDone: 'one more thing…',
  },
};

/* ── The letter ────────────────────────────────────────────── */

export const letter = {
  envelopeLabel: 'open when you’re ready',
  openLabel: 'Open the letter',
  greeting: '[ My dearest …, ]',
  paragraphs: [
    '[ Write the first part of your letter here. ]',
    '[ This is where you tell her the things you don’t always say out loud. ]',
    '[ And here, everything you hope for the year ahead — and the ones after it. ]',
  ],
  signoff: 'Forever yours,',
  signature: '[ your name ]',
};

/* ── Finale ────────────────────────────────────────────────── */

export const finale = {
  headline: 'Happy Birthday',
  accent: 'to my favourite person.',
  toBeContinued: 'to be continued…',
  replay: 'Take the trip again',
  heartHint: 'psst — tap the heart',
  /** Revealed after she taps the heart five times. */
  easterEgg: '[ a hidden little message ]',
  signature: 'made with all my love, just for you ♡',
};

/* ── Out-of-the-blue Polaroids ─────────────────────────────── */
/* These fly onto the screen at points along the journey. She can tap to flip, drag them around, or toss them away. */

export const surprises: Record<string, PhotoItem> = {
  childhood: { type: 'photo', src: p('photos/surprise/01.jpg'), alt: 'A surprise photo', caption: 'surprise!', back: '[ a little note ]' },
  growing: { type: 'photo', src: p('photos/surprise/02.jpg'), alt: 'A surprise photo', caption: 'remember this?', back: '[ a little note ]' },
  meeting: { type: 'photo', src: p('photos/surprise/03.jpg'), alt: 'A surprise photo', caption: 'oops, dropped one', back: '[ a little note ]' },
  us: { type: 'photo', src: p('photos/surprise/04.jpg'), alt: 'A surprise photo', caption: 'this one’s my favourite', back: '[ a little note ]' },
  us2: { type: 'photo', src: p('photos/surprise/05.jpg'), alt: 'A surprise photo', caption: 'look at us', back: '[ a little note ]' },
  today: { type: 'photo', src: p('photos/surprise/06.jpg'), alt: 'A surprise photo', caption: 'one more ♡', back: '[ a little note ]' },
};
