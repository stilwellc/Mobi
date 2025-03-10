import React from 'react';
import type { Metadata } from 'next'
import { Inter, MuseoModerno } from 'next/font/google'
import './globals.css'
import Navigation from './components/Navigation'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const museoModerno = MuseoModerno({ 
  subsets: ['latin'],
  variable: '--font-museo-moderno',
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
    <html lang="en" className={`${museoModerno.variable} ${inter.variable}`}>
      <body className="bg-mobi-cream text-mobi-black antialiased font-sans">
        <Navigation />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  )
} 