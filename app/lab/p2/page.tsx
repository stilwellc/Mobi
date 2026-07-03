import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import Horizon from '../../components/Horizon';
import RevealLines from '../../components/RevealLines';
import Bench from './Bench';

export const metadata: Metadata = {
  title: 'Prints — co.stil',
  description:
    'An AI text-to-print pipeline and the library it produces — lighting, furniture parts, and design studies, each with an inspectable model.',
};

export default function PrintsBenchPage() {
  return (
    <div className="rail" style={{ paddingBlock: 'var(--space-5) var(--space-6)' }}>
      {/* Ritual header */}
      <header style={{ marginBottom: 'var(--space-4)' }}>
        <p className="eyebrow" style={{ margin: '0 0 var(--space-2)' }}>
          <Link href="/physical" className="link-draw" style={{ color: 'inherit' }}>
            Physical
          </Link>
          {' — Additive'}
        </p>
        <RevealLines
          as="h1"
          trigger="mount"
          lines={['Prints']}
          style={{
            fontFamily: 'var(--font-serif), serif',
            fontSize: 'var(--text-display)',
            fontWeight: 300,
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
            margin: '0 0 var(--space-3)',
          }}
        />
        <p
          style={{
            fontSize: '1.0625rem',
            lineHeight: 1.65,
            color: 'var(--color-text-secondary)',
            maxWidth: 'var(--prose-max)',
            margin: 0,
          }}
        >
          Describe an object in plain language; an AI pipeline turns it into a
          parametric, print-ready model. Four stations on one bench &mdash; and
          below them, the library the bench is building.
        </p>
      </header>

      <Horizon variant="gold" />

      <Bench />
    </div>
  );
}
