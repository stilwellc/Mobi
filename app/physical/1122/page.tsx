import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';

export const metadata: Metadata = {
  title: 'Project 1122 — co.stil',
  description:
    'A residence taken back to the studs — documented honestly, from as-found condition to design intent.',
};

const serif = 'var(--font-serif), serif';
const mono = 'var(--font-mono), monospace';

const facts: [string, string][] = [
  ['Status', 'In progress'],
  ['Scope', 'Full residence'],
  ['Rooms', 'Master bedroom, bedroom/office, living, dining, kitchen, bath'],
  ['Year', '2024 —'],
];

interface Room {
  name: string;
  caption: string;
  images: { src: string; alt: string }[];
}

const rooms: Room[] = [
  {
    name: 'Kitchen',
    caption:
      'Galley kitchen mid-plan. Flat-panel cabinets, granite counters, gas range, and a pass-through cut into the partition wall — the only opening between kitchen and dining room.',
    images: [
      { src: '/images/1122/before/kitchen1.webp', alt: 'Kitchen as found: white cabinets, granite counters, gas range and pass-through to the dining room' },
      { src: '/images/1122/before/kitchen2.webp', alt: 'Kitchen as found: galley run toward the pass-through, dishwasher and sink under the opening' },
      { src: '/images/1122/before/kitchen3.webp', alt: 'Kitchen as found: counter and range from the sink corner' },
    ],
  },
  {
    name: 'Living room',
    caption:
      'The long room on the entry side. Maple strip flooring, crown molding, a cast-iron radiator on the party wall, and a through-wall AC unit carrying the cooling load.',
    images: [
      { src: '/images/1122/before/Livingroom1.webp', alt: 'Living room as found: entry door and coat closet, kitchen pass-through beyond' },
      { src: '/images/1122/before/livingroom3.webp', alt: 'Living room as found: long run of maple flooring toward the kitchen pass-through' },
      { src: '/images/1122/before/livingroom4.webp', alt: 'Living room as found: cast-iron radiator and exposed steam riser at the far wall' },
    ],
  },
  {
    name: 'Dining room',
    caption:
      'Between kitchen and living space, lit by a single three-arm fixture. Gray walls throughout — the same coat as every other room in the unit.',
    images: [
      { src: '/images/1122/before/diningroom1.webp', alt: 'Dining room as found: long view toward the window and through-wall AC' },
      { src: '/images/1122/before/diningroom3.webp', alt: 'Dining room as found: three-arm ceiling fixture, entry and closet doors' },
    ],
  },
  {
    name: 'Master bedroom',
    caption:
      'The master bedroom from four angles. Tall window casings with panel bases, the double run of sliding-door closets, a ceiling fan, and a mix of radiator and through-wall AC carrying the room.',
    images: [
      { src: '/images/1122/before/bedroom1.webp', alt: 'Master bedroom as found: two tall windows, cast-iron radiator and exposed riser' },
      { src: '/images/1122/before/bedroom2.webp', alt: 'Master bedroom as found: two sliding-door closets and ceiling fan' },
      { src: '/images/1122/before/bedroom3.webp', alt: 'Master bedroom as found: paired windows with panel bases and through-wall AC' },
      { src: '/images/1122/before/bedroom4.webp', alt: 'Master bedroom as found: closet wall and hallway running the length of the plan' },
    ],
  },
  {
    name: 'Bedroom / office',
    caption:
      'The second bedroom, doing double duty as the office at the rear of the plan. Pressed-tin ceiling, exposed steam riser, one tall window with a security grille — the oldest surfaces left in the unit.',
    images: [
      { src: '/images/1122/before/office1.webp', alt: 'Bedroom-office as found: tall window with radiator below, pressed-tin ceiling' },
      { src: '/images/1122/before/office2.webp', alt: 'Bedroom-office as found: sliding closet and AC unit mounted above the window' },
      { src: '/images/1122/before/office3.webp', alt: 'Bedroom-office as found: window, radiator and exposed riser in the corner' },
    ],
  },
  {
    name: 'Bath',
    caption:
      'The single bath. Compact footprint: narrow vanity, glass-door shower, frosted double-hung window over the toilet.',
    images: [
      { src: '/images/1122/before/bathroom1.webp', alt: 'Bathroom as found: narrow vanity, toilet and glass shower door' },
    ],
  },
];

const label: React.CSSProperties = {
  fontFamily: mono,
  fontSize: 12,
  letterSpacing: '0.18em',
  textTransform: 'uppercase',
  color: 'var(--color-text-muted)',
};

const chapterHeading: React.CSSProperties = {
  fontFamily: serif,
  fontSize: 'var(--text-title)',
  fontWeight: 300,
  letterSpacing: '-0.02em',
  lineHeight: 1.1,
  color: 'var(--color-fg)',
  margin: 0,
};

const imgStyle: React.CSSProperties = {
  width: '100%',
  aspectRatio: '3 / 2',
  objectFit: 'cover',
  display: 'block',
  border: '1px solid var(--color-border)',
};

export default function Project1122() {
  return (
    <article
      style={{
        maxWidth: 'var(--content-max)',
        margin: '0 auto',
        padding: 'var(--space-6) var(--space-3) var(--space-6)',
      }}
    >
      {/* Header */}
      <header style={{ marginBottom: 'var(--space-5)' }}>
        <p style={{ ...label, color: 'var(--color-accent-gold)', marginBottom: 'var(--space-3)' }}>
          Physical — Residence
        </p>
        <h1
          style={{
            fontFamily: serif,
            fontSize: 'var(--text-display)',
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-3)',
          }}
        >
          Project 1122
        </h1>
        <p
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            margin: '0 0 var(--space-4)',
          }}
        >
          A residence taken back to the studs — documented honestly, from as-found condition to
          design intent.
        </p>

        <dl
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 'var(--space-2) var(--space-3)',
            margin: 0,
            paddingTop: 'var(--space-3)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {facts.map(([k, v]) => (
            <div key={k}>
              <dt style={{ ...label, marginBottom: 4 }}>{k}</dt>
              <dd style={{ fontFamily: mono, fontSize: 13, color: 'var(--color-text-secondary)', margin: 0 }}>
                {v}
              </dd>
            </div>
          ))}
        </dl>
      </header>

      <Horizon variant="gold" />

      {/* Chapter I — As found */}
      <section style={{ padding: 'var(--space-5) 0' }}>
        <p style={{ ...label, marginBottom: 'var(--space-1)' }}>Chapter I</p>
        <h2 style={{ ...chapterHeading, marginBottom: 'var(--space-2)' }}>As found</h2>
        <p
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            margin: '0 0 var(--space-5)',
          }}
        >
          A pre-war railroad plan: one long line of rooms, gray paint over every wall, maple strip
          floors throughout, steam heat and window units doing the climate work. This is the unit
          exactly as it was handed over — nothing staged, nothing retouched.
        </p>

        {rooms.map((room) => (
          <div key={room.name} style={{ marginBottom: 'var(--space-5)' }}>
            <h3
              style={{
                fontFamily: serif,
                fontSize: '1.375rem',
                fontWeight: 400,
                letterSpacing: '-0.01em',
                margin: '0 0 var(--space-1)',
                color: 'var(--color-fg)',
              }}
            >
              {room.name}
            </h3>
            <p
              style={{
                fontSize: '0.9375rem',
                lineHeight: 1.65,
                color: 'var(--color-text-muted)',
                maxWidth: 'var(--prose-max)',
                margin: '0 0 var(--space-3)',
              }}
            >
              {room.caption}
            </p>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: 'var(--space-2)',
              }}
            >
              {room.images.map((img) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={img.src} src={img.src} alt={img.alt} loading="lazy" style={imgStyle} />
              ))}
            </div>
          </div>
        ))}
      </section>

      <Horizon variant="gold" />

      {/* Chapter II — The plan */}
      <section style={{ padding: 'var(--space-5) 0' }}>
        <p style={{ ...label, marginBottom: 'var(--space-1)' }}>Chapter II</p>
        <h2 style={{ ...chapterHeading, marginBottom: 'var(--space-2)' }}>The plan</h2>
        <p
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            margin: '0 0 var(--space-4)',
          }}
        >
          There are no after photographs yet — the work is in progress. What exists is the intent,
          drawn. The moves are few and deliberate: the double-closet wall boxing in the master
          bedroom consolidates to a single closet so the opening into the living room widens; the
          kitchen counter extends and squares off toward the dining room instead of dead-ending
          mid-plan; and a built-in lands at the bedroom-office end to replace a freestanding
          closet. The point of all three is the same — keep the long line of the railroad plan
          continuous, and let light travel the full length of it.
        </p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'var(--space-3)',
          }}
        >
          <figure style={{ margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/1122/1122beforeBP.png"
              alt="Floor plan as found: railroad layout with master bedroom, living room, dining room, bathroom and bedroom-office"
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid var(--color-border)' }}
            />
            <figcaption style={{ ...label, marginTop: 'var(--space-1)' }}>Plan — as found</figcaption>
          </figure>
          <figure style={{ margin: 0 }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/1122/1122afterBP.png"
              alt="Floor plan as intended: consolidated master closet, widened living room opening, extended kitchen counter and new built-in at the bedroom-office"
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block', border: '1px solid var(--color-border)' }}
            />
            <figcaption style={{ ...label, marginTop: 'var(--space-1)' }}>Plan — intent</figcaption>
          </figure>
        </div>
      </section>

      <Horizon variant="gold" />

      {/* Close */}
      <footer style={{ paddingTop: 'var(--space-4)' }}>
        <p
          style={{
            fontSize: 'var(--text-body)',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            margin: '0 0 var(--space-3)',
          }}
        >
          The story continues here as the work completes — photographed the same way it started.
        </p>
        <Link
          href="/physical"
          style={{
            fontFamily: mono,
            fontSize: 12,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'var(--color-accent-gold)',
            textDecoration: 'none',
          }}
        >
          ← Physical
        </Link>
      </footer>
    </article>
  );
}
