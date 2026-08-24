import '../styles/globals.css'
import type { Metadata, Viewport } from 'next'
import React from 'react'
import { Fraunces } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'

// Selv-hostet via next/font - samme display-font som christianhermansen.no
const fraunces = Fraunces({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-fraunces',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f1e7d3',
}

export const metadata: Metadata = {
  title: 'Turntable - interaktiv platespiller',
  description: 'En illustrert platespiller som bytter format med skjermen: vinyl, kassett og CD. Låtene er demoinnhold, tekster av Christian Hermansen, produsert i Suno.',
  keywords: ['musikk', 'platespiller', 'turntable', 'interaktiv', 'retro'],
  authors: [{ name: 'Christian Hermansen' }],
  openGraph: {
    type: 'website',
    title: 'Turntable - interaktiv platespiller',
    description: 'En illustrert platespiller som bytter format med skjermen: vinyl, kassett og CD. Låtene er demoinnhold, tekster av Christian Hermansen, produsert i Suno.',
    siteName: 'Turntable',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turntable - interaktiv platespiller',
    description: 'En illustrert platespiller som bytter format med skjermen: vinyl, kassett og CD. Låtene er demoinnhold, tekster av Christian Hermansen, produsert i Suno.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="no">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`min-h-screen bg-bg text-ink antialiased ${fraunces.variable}`}>
        <div className="noise-overlay fixed inset-0 pointer-events-none" />
        {children}
        <Analytics />
      </body>
    </html>
  )
}