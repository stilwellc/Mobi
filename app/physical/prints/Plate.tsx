import React from 'react';
import Link from 'next/link';

export type PlateProps = {
  /** Folio numeral — 'I', 'II', … */
  no: string;
  /** Role label — 'Describe', 'The Library', … */
  role: string;
  /** Anchor id — targeted by the plate index. */
  id?: string;
  /** Bottom caption, left side (mono, uppercase). */
  caption?: React.ReactNode;
  /** Bottom caption, right side — cross-reference or arrow. */
  xref?: React.ReactNode;
  /** When set, the whole plate is the link. */
  href?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * THE PLATE — the folio's single unit. Every exhibit on the page
 * (sentence, code, object, repo, library print) shares this exact
 * anatomy: mono plate numeral + role label on top, body, caption
 * hairline at the foot. Glass-quiet material; the plate is the frame,
 * so nothing inside gets a second box.
 */
export default function Plate({
  no,
  role,
  id,
  caption,
  xref,
  href,
  children,
  className,
}: PlateProps) {
  const inner = (
    <>
      <header className="plate-head">
        <span className="plate-no">Plate {no}</span>
        <span className="plate-role">{role}</span>
      </header>
      <div className="plate-body">{children}</div>
      {(caption || xref) && (
        <footer className="plate-cap">
          <span className="plate-cap-text">{caption}</span>
          {xref && (
            <span className="plate-xref" aria-hidden={xref === '→' ? 'true' : undefined}>
              {xref}
            </span>
          )}
        </footer>
      )}
    </>
  );

  const cls = ['glass', 'glass-quiet', 'plate', className].filter(Boolean).join(' ');

  if (href) {
    return (
      <Link href={href} id={id} className={cls}>
        {inner}
      </Link>
    );
  }

  return (
    <article id={id} className={cls}>
      {inner}
    </article>
  );
}
