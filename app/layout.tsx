import React from 'react';
import type { Metadata } from 'next'
import './globals.css'

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
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,300;1,400;1,500&family=Syne:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#060606', color: '#F0EDE8' }}>
        {children}
      </body>
    </html>
  )
}
