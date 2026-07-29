export type Track = {
  slug: string; // URL-slug (unik)
  title: string; // låttittel
  artist: string; // artistnavn
  color?: string; // label/accent pr spor
  audioUrl: string; // pek til din .mp3/.ogg/.wav (CDN eller /public/audio)
  spotifyUrl?: string;
  appleUrl?: string;
  downloadUrl?: string; // evt. direkte nedlasting
  description?: string; // valgfritt (SEO)
  coverUrl?: string; // valgfritt (OG-bilde)
  durationSec?: number; // valgfritt (for pre-render)
};

export const tracks: Track[] = [
  {
    slug: "hei-bergen",
    title: "Hei Bergen",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#d9923c",
    audioUrl: "/audio/hei-bergen.mp3",
    coverUrl: "/covers/hei-bergen.webp",
    description: "En hilsen til byen - regnvåt, sliten og elsket.",
  },
  {
    slug: "mellom-brostein",
    title: "Mellom Brostein",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#a8432a",
    audioUrl: "/audio/mellom-brostein.mp3",
    coverUrl: "/covers/mellom-brostein.webp",
    description:
      "Mellom brostein ligger det mer enn stein - blod, sår og minner du tråkker på.",
  },
  {
    slug: "knyttnever-i-lommene",
    title: "Knyttnever i lommene",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#24494e",
    audioUrl: "/audio/knyttnever-i-lommene.mp3",
    coverUrl: "/covers/knyttnever-i-lommene.webp",
    description:
      "Om å gå med knyttnever i lommene og hjertet fullt av usnakkete ting.",
  },
  {
    slug: "kompisar-i-regnet",
    title: "Kompisar i regnet",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#E17858",
    audioUrl: "/audio/kompisar-i-regnet.mp3",
    coverUrl: "/covers/kompisar-i-regnet.webp",
    description: "Til kompisane som forsvant. Regnet husker dem.",
  },
  {
    slug: "mens-dokker-har-det",
    title: "Mens dokker har det",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#d9923c",
    audioUrl: "/audio/mens-dokker-har-det.mp3",
    coverUrl: "/covers/mens-dokker-har-det.webp",
    description:
      "Ingen ser den siste gangen før den e forbi. Til gjengen som ennå har det.",
  },
  {
    slug: "alt-eg-har-e-pa-lan",
    title: "Alt Eg Har E På Lån",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#b0731f",
    audioUrl: "/audio/alt-eg-har-e-pa-lan.mp3",
    coverUrl: "/covers/alt-eg-har-e-pa-lan.webp",
    description:
      "En personlig og melankolsk låt som reflekterer over livets lånte øyeblikk.",
  },
  {
    slug: "eg-gar-kje-hem",
    title: "Eg Går'kje Hem",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#d9923c",
    audioUrl: "/audio/eg-gar-kje-hem.mp3",
    coverUrl: "/covers/eg-gar-kje-hem.webp",
    description:
      "Stolt utmattelse i regnet - når byen er det nærmeste hjem du har.",
  },
  {
    slug: "nar-morket-banker-pa",
    title: "Når mørket banker på",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#24494e",
    audioUrl: "/audio/nor-morket-banker-pa.mp3",
    coverUrl: "/covers/nar-morket-banker-pa.webp",
    description:
      "Om å le av troen hele livet, helt til mørket banker på døren.",
  },
  {
    slug: "nor-regnet-faller",
    title: "Når Regnet Faller",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#1d3c41",
    audioUrl: "/audio/nor-regnet-faller.mp3",
    coverUrl: "/covers/nor-regnet-faller.webp",
    description:
      "Savn i sølvgrått regn - byen ved din side, ett skritt, og så et te.",
  },
  {
    slug: "hold-fast",
    title: "Hold Fast",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#a8432a",
    audioUrl: "/audio/hold-fast.mp3",
    coverUrl: "/covers/hold-fast.webp",
    description:
      "En kraftfull oppfordring om å holde fast på det som betyr noe.",
  },
  {
    slug: "sandstorm",
    title: "Sandstorm",
    artist: "Tekst: Christian Hermansen · Produsert i Suno",
    color: "#E17858",
    audioUrl: "/audio/sandstorm.mp3",
    coverUrl: "/covers/sandstorm.webp",
    description: "En intensiv musikalsk reise gjennom ørkenens sanddyner.",
  },
];
