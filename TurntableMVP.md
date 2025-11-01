# Mål & avgrensning (MVP)

**Mål**

* Presentere katalogen din (singler/EP/album) med delbar **spillerside** per låt.
* Interaktiv **turntable-UI** (rotasjon, tonearm, “flip-over” ved neste spor).
* Lett å oppdatere innhold via én kilde (`data/tracks.ts`).

**Ikke med (enda)**

* Ingen brukeropplasting.
* Ingen konto/innlogging.
* Ingen administrasjonspanel (kan komme via headless CMS senere).

---

# Funksjoner (MVP)

1. **Hjemmeside (Katalog)**
   Grid over spor med “Lytt nå”.
2. **Spillerside pr. spor**
   Turntable, play/pause, tidslinje (basic), CTA-knapper (Spotify/Apple/Download).
3. **Deling**
   Delbar URL `/track/[slug]` (+ riktig `<title>`/`<meta>`).
4. **Design**
   Retro-futuristisk, kullsort bakgrunn, cyan accent, hvit typografi.
5. **Ytelse & tilgjengelighet**
   AA, `prefers-reduced-motion`, Lighthouse 90+.

---

# Tekniske valg

* **Next.js 14 (App Router)** + **TypeScript**
* **Tailwind CSS** (tokens)
* **Framer Motion** (anim)
* **HTMLAudioElement** (nativt, senere: WaveSurfer/Web Audio)
* Deploy: **Vercel**
* Lyd: dine filer hostet i `public/audio` eller på CDN (S3/Supabase) med CORS.

---

# Informasjonsarkitektur & ruter

```
/                 # katalog over spor
/track/[slug]     # spillerside for et spor (delbar)
```

---

# Filstruktur (MVP)

```
app/
  layout.tsx
  page.tsx                    # katalog
  track/[slug]/page.tsx       # spiller
components/
  Turntable.tsx               # UI + animasjoner
  AudioBar.tsx                # (enkel tidslinje/seekbar)  ← nytt i MVP
  CTAButtons.tsx              # Spotify/Apple/Download
data/
  tracks.ts                   # ← rediger spor her
public/
  assets/svg/*                # Illustrator-vennlige SVG-er
  assets/textures/noise.png
  audio/*                     # dine filer eller demo
styles/
  globals.css
```

---

# Data (kilde for alt innhold)

`data/tracks.ts`

```ts
export type Track = {
  slug: string;                  // URL-slug (unik)
  title: string;                 // låttittel
  artist: string;                // artistnavn
  color?: string;                // label/accent pr spor
  audioUrl: string;              // pek til din .mp3/.ogg/.wav (CDN eller /public/audio)
  spotifyUrl?: string;
  appleUrl?: string;
  downloadUrl?: string;          // evt. direkte nedlasting
  description?: string;          // valgfritt (SEO)
  coverUrl?: string;             // valgfritt (OG-bilde)
  durationSec?: number;          // valgfritt (for pre-render)
};

export const tracks: Track[] = [
  {
    slug: "neon-skyline",
    title: "Neon Skyline",
    artist: "You",
    color: "#00fff0",
    audioUrl: "/audio/neon-skyline.mp3",
    spotifyUrl: "https://open.spotify.com/track/xxx",
    appleUrl: "https://music.apple.com/track/yyy",
    description: "Synthwave med retro-futuristisk nerve."
  },
  // legg til flere spor...
];
```

---

# Viktige komponenter

### 1) Turntable (UI + anim)

* Props: `tracks, currentIndex, isPlaying, onTogglePlay, onNext, onPrev`
* Animasjoner:

  * Plate: `rotate: 360` (loop) når playing = true
  * Tonearm: spring-rotasjon (–12° → 18°)
  * Flip-over: `rotateY: [0, 90, 180]` ved “Next”
* Reflection/highlight som eget SVG-lag (mix-blend)

**Du har allerede en fungerende versjon** (fra zip). Bruk den som er.

### 2) AudioBar (ny) – enkel tidslinje/seekbar

`components/AudioBar.tsx`

```tsx
'use client';
import { useEffect, useRef, useState } from 'react';

export default function AudioBar({ audio }: { audio: HTMLAudioElement | null }) {
  const [t, setT] = useState(0);
  const [d, setD] = useState(0);

  useEffect(() => {
    if (!audio) return;
    const onTime = () => setT(audio.currentTime);
    const onMeta = () => setD(audio.duration || 0);
    audio.addEventListener('timeupdate', onTime);
    audio.addEventListener('loadedmetadata', onMeta);
    return () => { audio.removeEventListener('timeupdate', onTime); audio.removeEventListener('loadedmetadata', onMeta); };
  }, [audio]);

  const pct = d ? (t / d) * 100 : 0;

  return (
    <div className="mt-2">
      <div className="relative h-2 w-full rounded-full bg-white/10">
        <div className="absolute left-0 top-0 h-full rounded-full bg-accent" style={{ width: `${pct}%` }} />
      </div>
      <div className="mt-1 flex justify-between text-xs text-white/60">
        <span>{fmt(t)}</span><span>{fmt(d)}</span>
      </div>
    </div>
  );
}

function fmt(sec: number) {
  if (!isFinite(sec)) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}
```

Bruk i spillersiden sammen med referanse til `<audio>`.

### 3) CTA-knapper (Spotify/Apple/Download)

`components/CTAButtons.tsx`

```tsx
export default function CTAButtons({
  spotifyUrl, appleUrl, downloadUrl
}: { spotifyUrl?: string; appleUrl?: string; downloadUrl?: string }) {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {spotifyUrl && <a className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 hover:border-accent/40" href={spotifyUrl} target="_blank" rel="noreferrer">🎧 Lytt på Spotify</a>}
      {appleUrl && <a className="rounded-xl border border-white/10 bg-black/40 px-4 py-2 hover:border-accent/40" href={appleUrl} target="_blank" rel="noreferrer"> Music</a>}
      {downloadUrl && <a className="rounded-xl bg-accent px-4 py-2 font-semibold text-[#0b0d10] hover:opacity-90" href={downloadUrl}>⬇︎ Last ned</a>}
    </div>
  );
}
```

---

# Spillerside (helhet)

`app/track/[slug]/page.tsx` (skisse – kobler sammen alt)

```tsx
'use client';
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Turntable from "@/components/Turntable";
import AudioBar from "@/components/AudioBar";
import CTAButtons from "@/components/CTAButtons";
import { tracks } from "@/data/tracks";
import { useParams, useRouter } from "next/navigation";

export default function TrackPage(){
  const { slug } = useParams<{slug:string}>();
  const router = useRouter();
  const track = useMemo(()=> tracks.find(t => t.slug === slug), [slug]);

  const [isPlaying, setPlaying] = useState(false);
  const [index, setIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(()=>{ if(!track) router.replace("/"); }, [track, router]);
  useEffect(()=>{ const a=audioRef.current; if(!a) return; if(isPlaying) a.play().catch(()=>{}); else a.pause(); }, [isPlaying, track]);

  if (!track) return null;
  const data = [{ id: track.slug, title: track.title, artist: track.artist, coverColor: track.color, src: track.audioUrl }];

  return (
    <main className="mx-auto max-w-6xl p-6">
      <nav className="mb-4"><Link className="text-white/70 hover:text-white" href="/">← Tilbake</Link></nav>

      <Turntable
        tracks={data as any}
        currentIndex={index}
        isPlaying={isPlaying}
        onTogglePlay={()=> setPlaying(p=>!p)}
        onNext={()=> setIndex(0)}  // kan kobles til neste faktisk spor senere
        onPrev={()=> setIndex(0)}
      />

      <section className="mt-6 rounded-3xl border border-white/10 bg-[#0d0f12] p-6">
        <h1 className="text-xl font-semibold">{track.title}</h1>
        <p className="text-white/70">{track.artist}</p>
        {track.description && <p className="mt-2 text-white/80">{track.description}</p>}

        <AudioBar audio={audioRef.current} />
        <div className="mt-4">
          <CTAButtons spotifyUrl={track.spotifyUrl} appleUrl={track.appleUrl} downloadUrl={track.downloadUrl} />
        </div>
      </section>

      <audio ref={audioRef} src={track.audioUrl} preload="metadata" />
    </main>
  );
}
```

---

# SEO & deling (MVP-vennlig)

**Global:** `app/layout.tsx` – sett språk, font, base-metadata.
**Per spor:** (enkel MVP) sett `document.title` i klient, eller gjør server-metadata hvis du flytter track-lookup til server (kan gjøres senere).

**JSON-LD (frivillig, MVP+)** i spillersiden:

```tsx
{/* legg i <main> eller Head (server-side senere) */}
<script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify({
  "@context":"https://schema.org",
  "@type":"MusicRecording",
  "name": track.title,
  "byArtist": { "@type":"MusicGroup", "name": track.artist },
  "url": typeof window !== "undefined" ? window.location.href : "",
  "inAlbum": track.album ? { "@type":"MusicAlbum", "name": track.album } : undefined
})}} />
```

---

# Tilgjengelighet

* **Knapper**: legg `aria-label` (Play/Pause/Next/Prev).
* **Keyboard**: `Space` → Play/Pause, `ArrowLeft/Right` → 5s seek (MVP+: liten handler).
* **`prefers-reduced-motion`**: begrens intens animasjon (du har CSS-guard i `globals.css`).

---

# Ytelse (Lighthouse ≥ 90)

* Lyd: bruk **MP3/OGG** for mindre filer (WAV kun for demobruk).
* Sett `preload="metadata"` (allerede gjort).
* Komprimer SVG (svgo) når du er fornøyd.
* Vercel: automatisk cache & edge.

---

# Analytics & events (enkel)

* GA4 eller Plausible. Track f.eks.:

  * `audio_play`, `audio_pause`, `audio_seek`, `cta_click_spotify` osv.
    (MVP: kan vente til etter lansering, men ha event-hooks klare i knapper.)

---

# QA-sjekkliste (MVP “done”)

* [ ] Hjem → åpne spor → spilles ✅
* [ ] Play/Pause/Next/Prev fungerer (flip-over ved “Next”) ✅
* [ ] Lyd stopper ved navigasjon ✅
* [ ] Lighthouse: Perf/Acc/Best/SEO ≥ 90 ✅
* [ ] Mobil: 320–480 px, ingen horisontal scroll ✅
* [ ] `prefers-reduced-motion`: animasjoner er dempet ✅
* [ ] Lenker til Spotify/Apple virker ✅

---

# Roadmap etter MVP

1. **Waveform** (WaveSurfer/Web Audio FFT).
2. **OG-bilder pr. spor** via `@vercel/og`.
3. **CMS** (Sanity/Supabase) for enkel innholdsredigering.
4. **Playlist/kø** + automatisk neste spor.
5. **Delingsknapper** (Twitter/X, Facebook, kopier-lenke).

---
