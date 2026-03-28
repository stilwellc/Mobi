import React from 'react';
import type { Metadata } from 'next'
import './globals.css'
import ThemeProvider from './components/ThemeProvider'

export const metadata: Metadata = {
  title: 'Mobi — Design Studio',
  description: 'Where design transcends boundaries — physical spaces, digital products, cultural connections.',
  openGraph: {
    title: 'Mobi — Design Studio',
    description: 'Where design transcends boundaries — physical spaces, digital products, cultural connections.',
    siteName: 'Mobi',
    type: 'website',
    locale: 'en_US',
    images: [{ url: '/images/mobi-logo.png', width: 512, height: 512, alt: 'Mobi Design Studio' }],
  },
  twitter: {
    card: 'summary',
    title: 'Mobi — Design Studio',
    description: 'Where design transcends boundaries — physical spaces, digital products, cultural connections.',
    images: ['/images/mobi-logo.png'],
  },
  icons: {
    icon: '/images/mobi-logo.png',
    apple: '/images/mobi-logo.png',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{var t=localStorage.getItem('mobi-theme');if(!t)t=window.matchMedia('(prefers-color-scheme: light)').matches?'light':'dark';document.documentElement.setAttribute('data-theme',t)}catch(e){}})();` }} />
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Syne:wght@400;500;600;700&family=Space+Mono:wght@400;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Space+Grotesk:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
