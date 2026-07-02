'use client';

import { useEffect, useLayoutEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import ThemeToggle from './ThemeToggle';
import Logo from './Logo';
import { horizonGradients } from './Horizon';

const links = [
  { label: 'Software', href: '/software' },
  { label: 'Physical', href: '/physical' },
  { label: 'Professional', href: '/professional' },
  { label: 'About', href: '/about' },
];

const BAR_BASE = 100; // px — the underline scales from this reference width

type MenuState = 'closed' | 'open' | 'closing';

export default function Nav() {
  const pathname = usePathname();
  const activeIndex = links.findIndex(
    link => pathname === link.href || pathname.startsWith(link.href + '/')
  );
  const activeIndexRef = useRef(activeIndex);
  activeIndexRef.current = activeIndex;

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

  // The traveling underline — one gold bar gliding between links.
  // Offsets are measured into refs (mount, resize, fonts.ready) and the
  // bar is positioned via translateX + scaleX only; zero React state.
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const barRef = useRef<HTMLDivElement>(null);
  const metricsRef = useRef<{ x: number; w: number }[]>([]);
  const lastXRef = useRef(0);

  const measure = useCallback(() => {
    metricsRef.current = linkRefs.current.map(el =>
      el ? { x: el.offsetLeft, w: el.offsetWidth } : { x: 0, w: 0 }
    );
  }, []);

  const placeBar = useCallback((idx: number | null) => {
    const bar = barRef.current;
    if (!bar) return;
    const m = idx != null && idx >= 0 ? metricsRef.current[idx] : undefined;
    if (!m || m.w === 0) {
      // No resting link (home) — collapse in place at the last position
      bar.style.transform = `translateX(${lastXRef.current}px) scaleX(0)`;
      return;
    }
    lastXRef.current = m.x;
    bar.style.transform = `translateX(${m.x}px) scaleX(${m.w / BAR_BASE})`;
  }, []);

  // First placement happens before paint, without a slide-in from x=0
  useLayoutEffect(() => {
    const bar = barRef.current;
    measure();
    if (!bar) return;
    const prev = bar.style.transition;
    bar.style.transition = 'none';
    placeBar(activeIndexRef.current);
    void bar.offsetWidth;
    bar.style.transition = prev;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Glide to the new active link on route change
  useEffect(() => {
    placeBar(activeIndex);
  }, [activeIndex, placeBar]);

  // Re-measure when layout can shift under the links
  useEffect(() => {
    let cancelled = false;
    const remeasure = () => {
      measure();
      placeBar(activeIndexRef.current);
    };
    window.addEventListener('resize', remeasure);
    document.fonts?.ready.then(() => {
      if (!cancelled) remeasure();
    });
    return () => {
      cancelled = true;
      window.removeEventListener('resize', remeasure);
    };
  }, [measure, placeBar]);

  // Mobile menu — open / closing (exit choreography) / closed
  const [menuState, setMenuState] = useState<MenuState>('closed');
  const menuOpen = menuState === 'open';
  const triggerRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const closeMenu = useCallback(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setMenuState('closing');
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => {
      setMenuState('closed');
      triggerRef.current?.focus();
    }, reduced ? 0 : 250);
  }, []);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

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
    return () => document.removeEventListener('keydown', onKey);
  }, [menuOpen, closeMenu]);

  // Scroll stays locked through the exit so the page doesn't jump mid-fade
  useEffect(() => {
    if (menuState === 'closed') return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuState]);

  useEffect(() => {
    window.clearTimeout(closeTimer.current);
    setMenuState('closed');
  }, [pathname]);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

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
            soft drop into the page. Desktop/mobile chrome is toggled in
            CSS (no window-size branching in markup). */}
        <style>{`
          .site-header {
            background: transparent;
            border-bottom: 1px solid transparent;
            transition:
              background var(--duration-base) var(--ease-signature),
              border-color var(--duration-base) var(--ease-signature),
              box-shadow var(--duration-base) var(--ease-signature);
          }
          .site-header.is-condensed {
            background: linear-gradient(
              180deg,
              var(--color-bg) 0%,
              var(--color-bg) 68%,
              color-mix(in srgb, var(--color-bg) 72%, transparent) 100%
            );
            backdrop-filter: blur(28px) saturate(135%);
            -webkit-backdrop-filter: blur(28px) saturate(135%);
            border-bottom-color: var(--glass-border, var(--color-border));
            box-shadow: 0 12px 32px rgba(0, 0, 0, 0.18);
          }
          [data-theme=light] .site-header.is-condensed {
            box-shadow: 0 12px 32px rgba(93, 74, 48, 0.08);
          }
          .nav-inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding-block: 28px;
            transition: padding var(--duration-base) var(--ease-signature);
          }
          .site-header.is-condensed .nav-inner { padding-block: 16px; }
          .nav-right { display: flex; align-items: center; gap: 32px; }
          .nav-links-desktop {
            position: relative;
            display: flex;
            align-items: center;
            gap: 32px;
          }
          .nav-menu-trigger { display: none; }
          @media (max-width: 767px) {
            .nav-inner { padding-block: 20px; }
            .site-header.is-condensed .nav-inner { padding-block: 14px; }
            .nav-right { gap: 16px; }
            .nav-links-desktop { display: none; }
            .nav-menu-trigger { display: flex; }
          }
          @media (min-width: 768px) {
            .nav-veil { display: none; }
          }
          @keyframes navVeilIn { from { opacity: 0; } to { opacity: 1; } }
          @keyframes navVeilOut { from { opacity: 1; } to { opacity: 0; } }
          @keyframes navMenuLineUp {
            from { transform: translateY(110%); }
            to { transform: translateY(0); }
          }
          @keyframes navMenuLineOut {
            from { opacity: 1; transform: translateY(0); }
            to { opacity: 0; transform: translateY(18%); }
          }
          @keyframes navMenuDraw { from { transform: scaleX(0); } to { transform: scaleX(1); } }
          @keyframes navMenuFade { from { opacity: 0; } to { opacity: 1; } }
          .nav-veil { animation: navVeilIn 300ms var(--ease-signature) both; }
          .nav-veil[data-closing=true] { animation: navVeilOut 250ms var(--ease-signature) both; }
          .nav-menu-mask { overflow: hidden; }
          .nav-menu-line {
            animation: navMenuLineUp 600ms var(--ease-signature) both;
            animation-delay: calc(90ms + var(--i) * 90ms);
          }
          .nav-veil[data-closing=true] .nav-menu-line {
            animation: navMenuLineOut 250ms var(--ease-signature) both;
            animation-delay: 0ms;
          }
          .nav-menu-horizon {
            transform-origin: left;
            animation: navMenuDraw 600ms var(--ease-signature) 480ms both;
          }
          .nav-menu-email { animation: navMenuFade 400ms var(--ease-signature) 620ms both; }
        `}</style>
        <nav aria-label="Primary" className="rail nav-inner">
          <Link
            href="/"
            aria-label="co.stil — home"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontFamily: 'var(--font-sans), sans-serif',
              fontWeight: 700,
              fontSize: 20,
              letterSpacing: '-0.04em',
              color: 'var(--color-fg)',
              textDecoration: 'none',
            }}
          >
            <Logo size={24} />
            <span>co<span style={{ color: 'var(--color-accent-gold)' }}>.</span>stil</span>
          </Link>

          <div className="nav-right">
            <div
              className="nav-links-desktop"
              onPointerLeave={() => placeBar(activeIndex)}
            >
              {links.map((link, i) => {
                const active = i === activeIndex;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    ref={el => {
                      linkRefs.current[i] = el;
                    }}
                    aria-current={active ? 'page' : undefined}
                    onPointerEnter={() => placeBar(i)}
                    onFocus={() => placeBar(i)}
                    onBlur={() => placeBar(activeIndex)}
                    style={{
                      fontFamily: 'var(--font-sans), sans-serif',
                      fontSize: 'var(--text-label)',
                      fontWeight: 600,
                      letterSpacing: '0.18em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: active ? 'var(--color-fg)' : 'var(--color-text-muted)',
                      paddingBottom: 3,
                      transition: 'color var(--duration-fast) var(--ease-signature)',
                    }}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {/* The one underline — rests under aria-current, glides to hover */}
              <div
                ref={barRef}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: BAR_BASE,
                  height: 1,
                  background: 'var(--color-accent-gold)',
                  transform: 'translateX(0) scaleX(0)',
                  transformOrigin: 'left center',
                  transition: 'transform var(--duration-base) var(--ease-signature)',
                  pointerEvents: 'none',
                }}
              />
            </div>

            <ThemeToggle />

            <button
              ref={triggerRef}
              onClick={() => (menuOpen ? closeMenu() : setMenuState('open'))}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="glass glass-pill glass-quiet nav-menu-trigger"
              style={{
                width: 32,
                height: 32,
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

      {menuState !== 'closed' && (
        <div
          ref={dialogRef}
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className="nav-veil"
          data-closing={menuState === 'closing' ? 'true' : undefined}
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
          }}
        >
          <div className="rail">
            <nav
              aria-label="Mobile"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              {links.map((link, i) => {
                const active = isActive(link.href);
                return (
                  <div key={link.href} className="nav-menu-mask">
                    <Link
                      href={link.href}
                      onClick={closeMenu}
                      aria-current={active ? 'page' : undefined}
                      className="nav-menu-line"
                      style={
                        {
                          '--i': i,
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 16,
                          width: '100%',
                          padding: '10px 0',
                          textDecoration: 'none',
                        } as React.CSSProperties
                      }
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          fontFamily: 'var(--font-mono), monospace',
                          fontSize: 12,
                          letterSpacing: '0.08em',
                          color: 'var(--color-text-faint)',
                          width: '2.5ch',
                          flexShrink: 0,
                        }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-serif), serif',
                          fontWeight: 300,
                          fontSize: 'clamp(2.25rem, 10vw, 2.75rem)',
                          lineHeight: 1.15,
                          letterSpacing: '-0.02em',
                          color: active
                            ? 'var(--color-accent-gold-text)'
                            : 'var(--color-fg)',
                        }}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </div>
                );
              })}
            </nav>

            <div
              className="nav-menu-horizon"
              aria-hidden="true"
              style={{
                height: 1,
                marginTop: 'var(--space-3)',
                background: horizonGradients.gold,
                opacity: 0.35,
              }}
            />

            <a
              href="mailto:cstilwell117@gmail.com"
              className="nav-menu-email link-draw"
              style={{
                display: 'inline-block',
                marginTop: 'var(--space-3)',
                fontFamily: 'var(--font-mono), monospace',
                fontSize: 12,
                letterSpacing: '0.08em',
                color: 'var(--color-text-muted)',
              }}
            >
              cstilwell117@gmail.com
            </a>
          </div>
        </div>
      )}
    </>
  );
}
