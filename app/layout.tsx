import React from 'react';
import type { Metadata } from 'next'
import { Inter, MuseoModerno } from 'next/font/google'
import localFont from 'next/font/local'
import './globals.css'
import Navigation from './components/Navigation'

const museoModerno = MuseoModerno({ 
  subsets: ['latin'],
  variable: '--font-museo-moderno',
  display: 'swap',
})

const geist = localFont({
  src: [
    {
      path: '../public/fonts/GeistSans-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistSans-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistSans-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/GeistSans-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-geist',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Mobi - Design Studio',
  description: 'A design studio creating physical, digital, and social experiences',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${museoModerno.variable} ${geist.variable}`}>
      <body className="bg-mobi-cream text-mobi-black antialiased font-geist">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
} 