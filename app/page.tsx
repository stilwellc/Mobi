import HeroSection from './components/HeroSection';
import HomeAmbience from './components/HomeAmbience';
import Index from './components/Index';
import PhilosophySection from './components/PhilosophySection';

export default function HomePage() {
  return (
    <>
      <HomeAmbience />
      <HeroSection />
      <Index />
      <PhilosophySection />
    </>
  );
}
