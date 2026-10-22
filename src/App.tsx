import { MotionConfig } from 'motion/react';
import { HeroSection } from './components/HeroSection';
import { OurStorySection } from './components/OurStorySection';

export default function App() {
  return (
    // reducedMotion="user" makes Motion honour the OS "reduce motion" setting globally.
    <MotionConfig reducedMotion="user">
      <main className="page">
        <HeroSection />
        <OurStorySection />
      </main>
      <div className="film-grain" aria-hidden="true" />
    </MotionConfig>
  );
}
