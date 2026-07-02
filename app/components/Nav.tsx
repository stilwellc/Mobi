'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import { useWindowSize } from './hooks';

const links = [
  { label: 'Software', href: '/software' },
  { label: 'Physical', href: '/physical' },
  { label: 'Professional', href: '/professional' },
  { label: 'About', href: '/about' },
];

export default function Nav() {
  const pathname = usePathname();
  const width = useWindowSize();

  // Gate the mobile branch behind a post-mount flag so the first client
  // render matches the server HTML (desktop links) — no hydration mismatch.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  const mobile = mounted && width < 768;

  // Condensed state with hysteresis — no scrollY re-renders
  const [condensed, setCondensed] = useState(false);
  const condensedRef = useRef(false);
  // The traveling horizon: scroll progress written straight to the DOM via rAF
  const progressRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const onScroll = () => {
      const y = window.scrollY;
      if (!condensedRef.current && y > 80) {
        condensedRef.current = true;
        setCondensed(true);
      } else if (condensedRef.current && y < 40) {
        condensedRef.current = false;
        setCondensed(false);
      }
      if (!raf) {
        raf = requestAnimationFrame(() => {
          raf = 0;
          const max = document.documentElement.scrollHeight - window.innerHeight;
          const p = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
          if (progressRef.current) progressRef.current.style.transform = `scaleX(${p})`;
        });
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // Mobile menu
  const [menuOpen, setMenuOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    triggerRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const dialog = dialogRef.current;
    // The trap includes the header trigger (the visible X close control),
    // which sits above the overlay, plus everything inside the dialog —
    // so the X stays reachable by keyboard while the menu is open.
    const getFocusables = () => {
      const inDialog = dialog
        ? Array.from(dialog.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'))
        : [];
      const trigger = triggerRef.current;
      return trigger ? [trigger, ...inDialog] : inDialog;
    };

    // Ensure focus starts inside the trap (on the trigger/X, where it
    // already sits after activating the menu button).
    const initial = getFocusables();
    const startActive = document.activeElement as HTMLElement | null;
    if (!startActive || !initial.includes(startActive)) {
      initial[0]?.focus();
    }

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
        return;
      }
      if (e.key === 'Tab') {
        const items = getFocusables();
        if (items.length === 0) return;
        const first = items[0];
        const last = items[items.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (!active || !items.includes(active)) {
          e.preventDefault();
          first.focus();
        } else if (e.shiftKey && active === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [menuOpen, closeMenu]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  return (
    <>
      <header
        className={condensed ? 'site-header is-condensed' : 'site-header'}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
        }}
      >
        {/* Condensed = a glass slab: the bottom edge of the header is the
            meniscus here, so no top highlight — just body, blur, and a
            soft drop into the page. */}
        <style>{`
          .site-header {
            background: transparent;
            border-bottom: 1px solid transparent;
            transition:
              background var(--duration-base) var(--ease-signature),
              border-color var(--duration-base) var(--ease-signature),
              box-shadow var(--duration-base) var(--ease-signature),
              padding var(--duration-base) var(--ease-signature);
          }
          .site-header.is-condensed {
            background: var(--glass-bg-hover, var(--color-nav-bg));
            backdrop-filter: blur(28px) saturate(135%);
            -webkit-backdrop-filter: blur(28px) saturate(135%);
            border-bottom-color: var(--glass-border, var(--color-border));
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
          }
          [data-theme=light] .site-header.is-condensed {
            box-shadow: 0 12px 32px rgba(93, 74, 48, 0.08);
          }
        `}</style>
        <nav
          aria-label="Primary"
          style={{
            maxWidth: 'var(--content-max)',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: mobile
              ? `${condensed ? 14 : 20}px 20px`
              : `${condensed ? 16 : 28}px 40px`,
            transition: 'padding var(--duration-base) var(--ease-signature)',
          }}
        >
          <Link
            href="/"
            aria-label="co.stil — home"
            style={{
              fontFamily: 'var(--font-sans), sans-serif',
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: '-0.04em',
              color: 'var(--color-fg)',
              textDecoration: 'none',
            }}
          >
            co<span style={{ color: 'var(--color-accent-gold)' }}>.</span>stil
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: mobile ? 16 : 32 }}>
            {!mobile && links.map(link => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    fontFamily: 'var(--font-sans), sans-serif',
                    fontSize: 'var(--text-label)',
                    fontWeight: 600,
                    letterSpacing: '0.18em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: active ? 'var(--color-fg)' : 'var(--color-text-muted)',
                    borderBottom: active
                      ? '1px solid var(--color-accent-gold)'
                      : '1px solid transparent',
                    paddingBottom: 2,
                    transition: 'color var(--duration-fast) var(--ease-signature), border-color var(--duration-fast) var(--ease-signature)',
                  }}
                >
                  {link.label}
                </Link>
              );
            })}

            <ThemeToggle />

            {mobile && (
              <button
                ref={triggerRef}
                onClick={() => setMenuOpen(open => !open)}
                aria-expanded={menuOpen}
                aria-controls="mobile-menu"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                className="glass glass-pill glass-quiet"
                style={{
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--color-text-muted)',
                  flexShrink: 0,
                  padding: 0,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  {menuOpen ? (
                    <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  ) : (
                    <path d="M1 4h12M1 10h12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                  )}
                </svg>
              </button>
            )}
          </div>
        </nav>
        <div
          ref={progressRef}
          aria-hidden="true"
          style={{
            position: 'absolute',
            bottom: -1,
            left: 0,
            right: 0,
            height: 1,
            background: 'var(--color-accent-gold)',
            opacity: 0.5,
            transform: 'scaleX(0)',
            transformOrigin: 'left center',
            pointerEvents: 'none',
          }}
        />
      </header>

      {mobile && menuOpen && (
        <div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 40,
            background: 'var(--color-nav-bg)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '0 var(--space-4)',
          }}
        >
          <nav
            aria-label="Mobile"
            className="glass"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--space-3)',
              padding: 'var(--space-4) var(--space-3)',
            }}
          >
            {links.map((link, i) => {
              const active = isActive(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={closeMenu}
                  aria-current={active ? 'page' : undefined}
                  style={{
                    fontFamily: 'var(--font-serif), serif',
                    fontWeight: 300,
                    fontSize: 38,
                    lineHeight: 1.2,
                    letterSpacing: '-0.02em',
                    textDecoration: 'none',
                    color: 'var(--color-fg)',
                    alignSelf: 'flex-start',
                    borderBottom: active
                      ? '1px solid var(--color-accent-gold)'
                      : '1px solid transparent',
                    paddingBottom: 2,
                    opacity: 0,
                    animation: `menuReveal var(--duration-base) var(--ease-signature) ${i * 0.08}s forwards`,
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </>
  );
}
