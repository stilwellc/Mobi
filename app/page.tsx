import HeroSection from './components/HeroSection';
import HomeAmbience from './components/HomeAmbience';
import Index from './components/Index';

export default function HomePage() {
  return (
    <>
      <HomeAmbience />
      <HeroSection />
      {/* The continuous thread — Index carries the work stations,
          the philosophy band, and the coral-sun terminus on one line. */}
      <Index />
    </>
  );
}
