import { MotionConfig, motion, useScroll, useSpring } from 'motion/react';
import { HeroSection } from './components/HeroSection';
import { ChildhoodChapter } from './components/journey/ChildhoodChapter';
import { FilmStrip } from './components/journey/FilmStrip';
import { Finale } from './components/journey/Finale';
import { LoveLetter } from './components/journey/LoveLetter';
import { MeetingChapter } from './components/journey/MeetingChapter';
import { OurFilm } from './components/journey/OurFilm';
import { SurpriseProvider } from './components/journey/SurpriseLayer';
import { TodayChapter } from './components/journey/TodayChapter';
import { UsChapter } from './components/journey/UsChapter';
import { MusicDock } from './music/MusicDock';
import { MusicProvider } from './music/MusicProvider';

/** A thin thread across the top that fills as she travels through the story. */
function JourneyThread() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return <motion.div className="journey-thread" style={{ scaleX }} aria-hidden="true" />;
}

export default function App() {
  return (
    // reducedMotion="user" makes Motion honour the OS "reduce motion" setting globally.
    <MotionConfig reducedMotion="user">
      <MusicProvider>
        <SurpriseProvider>
          <JourneyThread />
          <main className="page">
            <HeroSection />
            <ChildhoodChapter />
            <FilmStrip />
            <MeetingChapter />
            <UsChapter />
            <OurFilm />
            <TodayChapter />
            <LoveLetter />
            <Finale />
          </main>
          <MusicDock />
        </SurpriseProvider>
      </MusicProvider>
      <div className="film-grain" aria-hidden="true" />
    </MotionConfig>
  );
}
