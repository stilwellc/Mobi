'use client';

export default function AboutPage({ mobile, tablet, navigate }: {
  mobile: boolean;
  tablet: boolean;
  navigate: (t: string) => void;
}) {
  const px = mobile ? 20 : tablet ? 36 : 56;

  return (
    <div style={{ minHeight: '100vh', paddingTop: mobile ? 100 : 140 }}>
      <section style={{ padding: `0 ${px}px 80px`, maxWidth: 900, margin: '0 auto' }}>
        <div style={{ marginBottom: 20 }}>
          <span className="back-link" onClick={() => navigate('home')} style={{
            fontSize: 12, color: 'var(--color-text-subtle)', cursor: 'pointer', fontWeight: 500,
            letterSpacing: '0.1em', textTransform: 'uppercase',
          }}>&#8592; Back</span>
        </div>

        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: mobile ? 48 : tablet ? 64 : 90,
          fontWeight: 300, letterSpacing: '-0.03em', lineHeight: 0.95,
          marginBottom: mobile ? 32 : 48,
        }}>
          About <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>mobi</span>
        </h1>

        <div style={{
          fontSize: mobile ? 15 : 18, lineHeight: 2, color: 'var(--color-text-muted)',
          fontWeight: 400, marginBottom: 48,
        }}>
          <p style={{ marginBottom: 28 }}>
            Mobi draws inspiration from the Möbius strip — a symbol of infinity and seamless continuity. Just as the Möbius strip weaves unexpected elements into a continuous flow, Mobi integrates diverse design principles into a harmonious, fluid experience that augments life, not just living spaces.
          </p>
          <p style={{ marginBottom: 28 }}>
            We believe design goes beyond the home. It is about enhancing the way we live, work, and interact with the world around us. Our goal is to create design that flows effortlessly through all aspects of life.
          </p>
        </div>

        <div style={{
          width: '100%', height: 1, marginBottom: 48,
          background: 'linear-gradient(90deg, var(--color-border-mid), transparent 80%)',
        }} />

        {[
          { title: 'Modern Design', text: 'Cutting-edge design with timeless elegance — spaces and experiences that are both contemporary and enduring.' },
          { title: 'Optimized Experiences', text: 'Designs that maximize functionality, comfort, and aesthetics. Advanced technology creating spaces that enhance the human experience.' },
          { title: 'Balanced Innovation', text: 'Smart technology, sustainable practices, and timeless aesthetics integrated into a harmonious whole.' },
        ].map((block, i) => (
          <div key={i} style={{
            marginBottom: 48,
            display: 'grid',
            gridTemplateColumns: mobile ? '1fr' : '200px 1fr',
            gap: mobile ? 8 : 40,
          }}>
            <h3 style={{
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: mobile ? 22 : 24, fontWeight: 400, fontStyle: 'italic',
              color: 'var(--color-accent-gold)', lineHeight: 1.3,
            }}>{block.title}</h3>
            <p style={{ fontSize: mobile ? 14 : 16, lineHeight: 1.85, color: 'var(--color-text-subtle)', fontWeight: 400 }}>
              {block.text}
            </p>
          </div>
        ))}

        <div style={{
          width: '100%', height: 1, marginBottom: 48,
          background: 'linear-gradient(90deg, var(--color-border-mid), transparent 80%)',
        }} />

        <div style={{ marginBottom: 48 }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: mobile ? 32 : 42, fontWeight: 300, letterSpacing: '-0.02em',
            marginBottom: 24,
          }}>
            How We <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>Help</span>
          </h2>
          {[
            { title: 'Augmenting Everyday Life', text: 'Mobi creates designs that amplify human potential. From smart homes to collaborative workspaces, our design solutions support and enhance the way you live, work, and connect with others.' },
            { title: 'Sustainable Innovation', text: 'Our sustainable design solutions seamlessly incorporate eco-friendly materials and energy-efficient technologies into all spaces, reducing your environmental footprint without compromising style or comfort.' },
            { title: 'Smart Integration', text: 'We integrate technology in a way that enhances your lifestyle without disrupting it. From automated systems that enhance comfort to innovative tools that make life easier, our design flows with you.' },
            { title: 'Community & Connectivity', text: 'Mobi believes design should foster connection. We design spaces that bring people together, whether at home, in the office, or in public spaces, fostering collaboration, creativity, and community.' },
          ].map((block, i) => (
            <div key={i} style={{
              marginBottom: 32,
              display: 'grid',
              gridTemplateColumns: mobile ? '1fr' : '220px 1fr',
              gap: mobile ? 8 : 40,
            }}>
              <h3 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: mobile ? 18 : 20, fontWeight: 400, fontStyle: 'italic',
                color: 'var(--color-accent-gold)', lineHeight: 1.3,
              }}>{block.title}</h3>
              <p style={{ fontSize: mobile ? 14 : 15, lineHeight: 1.85, color: 'var(--color-text-subtle)', fontWeight: 400 }}>
                {block.text}
              </p>
            </div>
          ))}
        </div>

        <div style={{
          padding: mobile ? 28 : 48,
          borderRadius: 20, background: 'var(--color-bg-card)',
          border: '1px solid var(--color-border)',
        }}>
          <h3 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: mobile ? 24 : 30, fontWeight: 300, marginBottom: 16,
          }}>Our <span style={{ fontStyle: 'italic', color: 'var(--color-accent-gold)' }}>Vision</span></h3>
          <p style={{ fontSize: mobile ? 14 : 16, lineHeight: 1.85, color: 'var(--color-text-subtle)', fontWeight: 400 }}>
            To redefine the way we experience design by weaving together sustainability, modern aesthetics, and cutting-edge technology in a way that enhances life at every level. Like the Möbius strip, our designs aim to create a seamless, continuous flow, augmenting the spaces where we live, work, and play.
          </p>
        </div>
      </section>
    </div>
  );
}
