import { Fragment, useRef } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { us, type ScrapItem } from '../../journey';
import { useJourneyMarker } from '../../music/MusicProvider';
import { withHearts } from '../Doodles';
import { MiniPolaroid } from '../media/MiniPolaroid';
import { VideoFrame } from '../media/VideoFrame';
import { ChapterHeader } from './ChapterHeader';
import { ReasonsDeck } from './ReasonsDeck';
import { ScratchCard } from './ScratchCard';
import { SurpriseTrigger } from './SurpriseLayer';
import { TornEdge } from './TornEdge';

const TILTS = [-3, 2.5, -1.5, 3.5, -2.5, 1.5, -3.5, 2, -1, 3];
/** Indexes after which an out-of-the-blue Polaroid is tossed in. */
const SURPRISE_AFTER: Record<number, string> = { 4: 'us', 11: 'us2' };

function Scrap({ item, tilt }: { item: ScrapItem; tilt: number }) {
  switch (item.type) {
    case 'photo':
      return <MiniPolaroid item={item} rotate={tilt} tape={Math.abs(tilt) > 3} />;
    case 'video':
      return (
        <figure className="scrap-video" style={{ rotate: `${tilt * 0.6}deg` }}>
          <VideoFrame src={item.src} poster={item.poster} label={item.caption ?? 'A video of us'} />
          {item.caption && <figcaption className="scrap-video__caption">{withHearts(item.caption)}</figcaption>}
        </figure>
      );
    case 'note':
      return (
        <p className={`sticky-note sticky-note--${item.tone ?? 'butter'}`} style={{ rotate: `${tilt}deg` }}>
          {withHearts(item.text)}
        </p>
      );
    case 'ticket':
      return (
        <div className="ticket" style={{ rotate: `${tilt}deg` }}>
          <div className="ticket__main">
            <span className="ticket__kicker">{item.subtitle ?? 'admit two'}</span>
            <span className="ticket__title">{item.title}</span>
            {item.date && <span className="ticket__date">{item.date}</span>}
          </div>
          <div className="ticket__stub" aria-hidden="true">
            <span>No. 0001</span>
          </div>
        </div>
      );
  }
}

/** Chapter three — a scrapbook spread of photos, videos, tickets and notes. */
export function UsChapter() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion() ?? false;
  useJourneyMarker(ref, 'us', 'chapter three · us');

  return (
    <section ref={ref} className="chapter ch-us" aria-labelledby="ch3-title">
      <TornEdge seed={45} fill="#f3e8d8" fibre="#fbf5ec" />
      <ChapterHeader id="ch3-title" number={us.number} title={us.title} kicker={us.kicker} intro={us.intro} />

      <div className="scrapbook">
        {us.scrapbook.map((item, i) => {
          const tilt = TILTS[i % TILTS.length];
          return (
            <Fragment key={i}>
              <motion.div
                className={`scrapbook__item scrapbook__item--${item.type}`}
                initial={reduce ? { opacity: 0 } : { opacity: 0, y: 50, rotate: tilt * 3 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ type: 'spring', stiffness: 90, damping: 17, delay: (i % 3) * 0.08 }}
              >
                <Scrap item={item} tilt={tilt} />
              </motion.div>
              {SURPRISE_AFTER[i] && <SurpriseTrigger id={SURPRISE_AFTER[i]} />}
            </Fragment>
          );
        })}
      </div>

      <ReasonsDeck />
      <ScratchCard />
    </section>
  );
}
