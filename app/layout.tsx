import '../styles/globals.css'
import type { Metadata, Viewport } from 'next'
import React from 'react'
import { Fraunces } from 'next/font/google'

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
  title: 'Turntable Web - Digital Music Showcase',
  description: 'En retro-futuristisk musikk-showcase som presenterer dine låter gjennom en interaktiv platespiller-UI.',
  keywords: ['musikk', 'synthwave', 'turntable', 'digital', 'retro-futuristic'],
  authors: [{ name: 'Christian Hermansen' }],
  openGraph: {
    type: 'website',
    title: 'Turntable Web - Digital Music Showcase',
    description: 'En retro-futuristisk musikk-showcase som presenterer dine låter gjennom en interaktiv platespiller-UI.',
    siteName: 'Turntable Web',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Turntable Web - Digital Music Showcase',
    description: 'En retro-futuristisk musikk-showcase som presenterer dine låter gjennom en interaktiv platespiller-UI.',
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
      </body>
    </html>
  )
}