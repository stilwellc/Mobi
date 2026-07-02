import type { Metadata } from 'next';
import Horizon from '../components/Horizon';
import IndexSpread from '../components/IndexSpread';
import RevealLines from '../components/RevealLines';
import SectionMark from '../components/SectionMark';
import { sections } from '../components/sections';
import { ARTISTS } from './ray/constants';

export const metadata: Metadata = {
  title: 'Software — co.stil',
  description:
    'Design-first software from the studio of Collin Stilwell — Ray auction intelligence and Soirée event discovery.',
};

const software = sections.find((s) => s.id === 'software')!;
const [ray, soiree] = software.items;

export default function SoftwarePage() {
  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Ritual header — eyebrow, masked h1 over the route numeral, intro, ocean horizon */}
      <section
        className="rail"
        style={{
          position: 'relative',
          overflow: 'hidden',
          paddingTop: 'clamp(120px, 18vh, 200px)',
          paddingBottom: 'var(--space-4)',
        }}
      >
        <SectionMark
          n="01"
          align="right"
          style={{ fontSize: 'clamp(180px, 22vw, 320px)' }}
        />
        <span
          className="eyebrow"
          style={{ display: 'block', marginBottom: 'var(--space-2)', position: 'relative' }}
        >
          {software.tagline}
        </span>
        <RevealLines
          as="h1"
          trigger="mount"
          delay={250}
          lines={['Software']}
          style={{
            margin: '0 0 var(--space-3)',
            fontFamily: 'var(--font-serif), serif',
            fontWeight: 300,
            fontSize: 'var(--text-display)',
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            color: 'var(--color-fg)',
            position: 'relative',
          }}
        />
        <p
          style={{
            margin: '0 0 var(--space-4)',
            fontSize: 'var(--text-body)',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            position: 'relative',
          }}
        >
          I build software the way I build objects — considered, deliberate, nothing accidental.
        </p>
        <Horizon variant="ocean" />
      </section>

      {/* The two rooms — editorial spreads, ocean accent, alternating sides */}
      <section className="rail" style={{ paddingBottom: 'var(--space-6)' }}>
        <IndexSpread
          index="01"
          title={ray.name}
          titleStyle={ray.logoStyle as React.CSSProperties}
          description={`Auction intelligence for the art market — the flagship. Tracks ${ARTISTS.length} artists across 5 auction houses, automatically.`}
          meta={`${ray.meta!.year} · ${ray.meta!.stack} · ${ray.meta!.status}`}
          href={ray.href!}
          accent="ocean"
          image={{ src: ray.image!, alt: ray.imageAlt! }}
        />
        <IndexSpread
          index="02"
          title={soiree.name}
          titleStyle={soiree.logoStyle as React.CSSProperties}
          description={soiree.description}
          meta={`${soiree.meta!.year} · ${soiree.meta!.stack}`}
          href={soiree.url!}
          accent="ocean"
          reverse
          image={{ src: soiree.image!, alt: soiree.imageAlt! }}
        />
      </section>
    </div>
  );
}
