# Turntable Web

En retro-futuristisk musikk-showcase som presenterer dine låter gjennom en interaktiv platespiller-UI.

## ✨ Funksjoner

- 🎵 **Interaktiv platespiller** med roterende vinyl og animert tonearm
- 🎧 **Lydavspilling** med native HTML5 audio
- 📱 **Responsiv design** som fungerer på alle enheter
- 🎨 **Retro-futuristisk estetikk** med cyan accenter og mørk bakgrunn
- 🔗 **Delbare spillersider** for hver låt
- ♿ **Tilgjengelig** med prefers-reduced-motion støtte

## 🚀 Kom i gang

### Installer dependencies

```bash
npm install
```

### Start utviklingsserver

```bash
npm run dev
```

Åpne [http://localhost:3000](http://localhost:3000) i nettleseren.

### Bygg for produksjon

```bash
npm run build
npm start
```

## 📁 Prosjektstruktur

```
app/
├── layout.tsx          # Global layout og metadata
└── page.tsx            # Hovedside med Bento Grid layout og platespiller

components/
├── IllustratorTurntable.tsx    # SVG-basert platespiller med Adobe Illustrator assets
├── TurntableControls.tsx       # SVG-basert kontrollpanel (volume, play/pause, etc)
└── AudioBar.tsx               # Lydkontroller og tidslinje

data/
└── tracks.ts           # Låtdata og metadata

public/
├── assets/
│   ├── svg/            # Adobe Illustrator SVG komponenter
│   │   ├── turntable-base.svg
│   │   ├── vinyl-record.svg
│   │   ├── tonearm.svg
│   │   └── ... (andre SVG-deler)
│   └── textures/
│       └── noise.png   # Tekstur for visuell effekt
└── audio/              # Lydfiler (.mp3, .ogg, .wav)

styles/
└── globals.css         # Global CSS med Tailwind imports
```

## 🎵 Legg til musikk

Rediger `data/tracks.ts` for å legge til dine låter:

```typescript
{
  slug: "min-nye-lat",
  title: "Min Nye Låt",
  artist: "Mitt Artistnavn",
  color: "#ff0080",
  audioUrl: "/audio/min-nye-lat.mp3",
  spotifyUrl: "https://open.spotify.com/track/...",
  description: "En fantastisk låt med synthwave vibes."
}
```

Plasser lydfiler i `public/audio/` mappen.

## 🎨 Tilpass design

Rediger farger i `tailwind.config.js`:

```javascript
colors: {
  bg: '#0b0d10',      // Hovedbakgrunn
  ink: '#ffffff',     // Tekst
  accent: '#00fff0',  // Accent farge
}
```

## 📱 Deploy

Prosjektet er optimalisert for [Vercel](https://vercel.com):

```bash
vercel
```

Eller deploy til andre plattformer som støtter Next.js.

## 🛠️ Teknisk stack

- **Next.js 14** med App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Framer Motion** for animasjoner
- **HTML5 Audio API** for lydavspilling

## ♿ Tilgjengelighet

- Keyboard navigation (Space = Play/Pause)
- Screen reader-vennlige labels
- `prefers-reduced-motion` støtte
- WCAG AA compliance

## 📄 Lisens

[MIT](LICENSE)

---

*Laget med ❤️ for musikkelskere*

## Rettigheter

Musikken (tekstene og innspillingene i `public/audio/` og covrene i `public/covers/`) er © Christian Hermansen. Alle rettigheter forbeholdt - den er ikke lisensiert for gjenbruk, remixing eller redistribusjon. Koden kan du gjerne la deg inspirere av.
