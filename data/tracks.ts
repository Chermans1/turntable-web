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
    slug: "alt-eg-har-e-pa-lan",
    title: "Alt Eg Har E På Lån",
    artist: "Samuel Høysæter",
    color: "#00fff0",
    audioUrl: "/audio/Alt Eg Har E På Lån.wav",
    description: "En personlig og melankolsk låt som reflekterer over livets lånte øyeblikk.",
    durationSec: 245
  },
  {
    slug: "hei-bergen",
    title: "Hei Bergen",
    artist: "Samuel Høysæter",
    color: "#ff0080",
    audioUrl: "/audio/Hei Bergen.wav",
    description: "En hjertevarm hilsen til den vakre vestlandsbyen og dens unike sjarm.",
    durationSec: 198
  },
  {
    slug: "hold-fast",
    title: "Hold Fast",
    artist: "Samuel Høysæter",
    color: "#8000ff",
    audioUrl: "/audio/Hold Fast.wav",
    description: "En kraftfull oppfordring om å holde fast på det som betyr noe.",
    durationSec: 312
  },
  {
    slug: "sandstorm",
    title: "Sandstorm",
    artist: "Samuel Høysæter",
    color: "#ffff00",
    audioUrl: "/audio/Sandstorm.wav",
    description: "En intensiv musikalsk reise gjennom ørkenens sanddyner.",
    durationSec: 187
  },
  {
    slug: "nye-horisonter",
    title: "Nye Horisonter",
    artist: "Samuel Høysæter",
    color: "#ffff00",
    audioUrl: "/audio/Nye Horisonter.wav",
    description: "En inspirerende låt som oppfordrer til å se mot nye mål.",
    durationSec: 187
  },
  {
    slug: "under-brostein",
    title: "Under Brostein",
    artist: "Samuel Høysæter",
    color: "#ffff00",
    audioUrl: "/audio/Under Brostein.wav",
    description: "En dyp og reflekterende låt som utforsker livets skjulte lag.",
    durationSec: 187
  }
];