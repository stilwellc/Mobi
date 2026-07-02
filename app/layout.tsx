import React from 'react';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Syne, Space_Mono } from 'next/font/google';
import './globals.css';
import ThemeProvider from './components/ThemeProvider';
import Nav from './components/Nav';
import Footer from './components/Footer';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-serif',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-sans',
  display: 'swap',
});

const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'co.stil — Software & Physical Design',
  description:
    "I'm Collin Stilwell. co.stil is my studio — design-first software and physical objects, one continuous practice.",
  openGraph: {
    title: 'co.stil — Software & Physical Design',
    description:
      "I'm Collin Stilwell. co.stil is my studio — design-first software and physical objects, one continuous practice.",
    siteName: 'co.stil',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary',
    title: 'co.stil — Software & Physical Design',
    description:
      "I'm Collin Stilwell. co.stil is my studio — design-first software and physical objects, one continuous practice.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${cormorant.variable} ${syne.variable} ${spaceMono.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('costil-theme');if(!t){var m=localStorage.getItem('mobi-theme');if(m){t=m;localStorage.setItem('costil-theme',m);localStorage.removeItem('mobi-theme');}}if(!t)t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){}})();`,
          }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <a href="#main" className="skip-link">Skip to content</a>
        <ThemeProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </ThemeProvider>
        <div className="grain-overlay" aria-hidden="true" />
      </body>
    </html>
  )
}
