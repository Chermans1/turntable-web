import '../styles/globals.css'
import type { Metadata } from 'next'
import React from 'react'

export const metadata: Metadata = {
  title: 'Turntable Web - Digital Music Showcase',
  description: 'En retro-futuristisk musikk-showcase som presenterer dine låter gjennom en interaktiv platespiller-UI.',
  keywords: ['musikk', 'synthwave', 'turntable', 'digital', 'retro-futuristic'],
  authors: [{ name: 'Digital Dreams' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#0b0d10',
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
      <body className="min-h-screen bg-bg text-ink antialiased">
        <div className="noise-overlay fixed inset-0 pointer-events-none" />
        {children}
      </body>
    </html>
  )
}