'use client';

// MC-kassetten - fase 2 av formatskiftet.
// Bygget av Christians lagvise Illustrator-eksporter i /assets/mc/.
// Lag (bunn → topp): tellervindu → tapemasse → nav (alt klippet til
// stadion-formen) → senterplate med hull. Spindlene fyller hullene;
// tapemassen er store skiver sentrert på spindlene, så det er KANTENE
// deres som synes gjennom midtvinduet - venstre trekker seg ut, høyre
// vokser inn i takt med fremdriften, som på en ekte kassett.
//
// Målt geometri (viewBox 836x321):
//   senterplate 511x144 plassert på (162,100)
//   hull venstre senter (243,174), høyre (594,174), dia 119
//   tellervindu 192x80 med senter (418,170)

const HULL_V = { x: 243, y: 174 };
const HULL_H = { x: 594, y: 174 };
const NAV_DIA = 118; // fyller hullet
const TAPE_FULL = 340; // kanten når nesten til midten av vinduet
const TAPE_TOM = 150; // kanten så vidt utenfor vinduet

type Props = {
  isPlaying: boolean;
  fremdrift: number; // 0-1 gjennom låten
  reduserBevegelse?: boolean | null;
  title?: string;
};

export default function CassetteDeck({ isPlaying, fremdrift, reduserBevegelse, title }: Props) {
  const p = Math.min(Math.max(fremdrift, 0), 1);
  // Venstre spole tømmes, høyre fylles
  const diaV = TAPE_FULL - (TAPE_FULL - TAPE_TOM) * p;
  const diaH = TAPE_TOM + (TAPE_FULL - TAPE_TOM) * p;
  const spinner = isPlaying && !reduserBevegelse;

  const tape = (senter: { x: number; y: number }, dia: number) => (
    <image
      href="/assets/mc/turntabel_MC_tape.png"
      x={senter.x - dia / 2}
      y={senter.y - dia / 2}
      width={dia}
      height={dia}
    />
  );

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 836 321"
        className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
        role="img"
        aria-label={title ? `Kassett: ${title}` : 'Kassett'}
      >
        <defs>
          {/* Stadion-formen i etiketten - alt bak platen klippes hit */}
          <clipPath id="mc-stadion">
            <rect x="162" y="100" width="511" height="144" rx="72" />
          </clipPath>
          {/* Prikkemønsteret fra låtpanelet */}
          <pattern id="mc-prikker" width="18" height="18" patternUnits="userSpaceOnUse">
            <circle cx="4" cy="4" r="1.2" fill="rgba(244,236,226,0.28)" />
            <circle cx="13" cy="13" r="1" fill="rgba(244,236,226,0.16)" />
          </pattern>
          {/* Innvendig skygge ovenfra, som låtpanelets inset-skygge */}
          <linearGradient id="mc-skygge" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="rgba(0,0,0,0.38)" />
            <stop offset="0.45" stopColor="rgba(0,0,0,0)" />
            <stop offset="0.9" stopColor="rgba(0,0,0,0)" />
            <stop offset="1" stopColor="rgba(0,0,0,0.18)" />
          </linearGradient>
        </defs>

        {/* Skallet med etikett */}
        <image href="/assets/mc/turntabel_MC.png" x="0" y="0" width="836" height="321" />

        <g clipPath="url(#mc-stadion)">
          {/* Midtvinduet: samme terracotta som bak låtkortene,
              med prikker og innvendig skygge */}
          <rect x="322" y="130" width="192" height="80" rx="10" fill="#E17858" />
          <rect x="322" y="130" width="192" height="80" rx="10" fill="url(#mc-prikker)" />

          {/* Tape + nav roterer sammen, mot klokken som ekte tape.
              Tapekantene synes gjennom midtvinduet. */}
          <g
            className={`mc-nav${spinner ? ' spinner' : ''}`}
            style={{ transformOrigin: `${HULL_V.x}px ${HULL_V.y}px` }}
          >
            {tape(HULL_V, diaV)}
            <image
              href="/assets/mc/turntabel_MC_spool.png"
              x={HULL_V.x - NAV_DIA / 2}
              y={HULL_V.y - NAV_DIA / 2}
              width={NAV_DIA}
              height={NAV_DIA}
            />
          </g>
          <g
            className={`mc-nav${spinner ? ' spinner' : ''}`}
            style={{ transformOrigin: `${HULL_H.x}px ${HULL_H.y}px` }}
          >
            {tape(HULL_H, diaH)}
            <image
              href="/assets/mc/turntabel_MC_spool.png"
              x={HULL_H.x - NAV_DIA / 2}
              y={HULL_H.y - NAV_DIA / 2}
              width={NAV_DIA}
              height={NAV_DIA}
            />
          </g>

          {/* Skyggen legges over tapen så vinduet får dybde */}
          <rect x="322" y="130" width="192" height="80" rx="10" fill="url(#mc-skygge)" />
        </g>

        {/* Senterplaten med hull og skala - øverst */}
        <image href="/assets/mc/turntabel_MC_center_part.png" x="162" y="100" width="511" height="144" />

        {/* Låttittel håndskrevet på etiketten */}
        {title && (
          <text
            x="418"
            y="86"
            textAnchor="middle"
            className="display-font"
            style={{ fontStyle: 'italic', fontSize: '26px', fill: '#263d42' }}
          >
            {title}
          </text>
        )}
      </svg>

      <style jsx>{`
        .mc-nav {
          transform-box: view-box;
          animation: mcSpin 1.8s linear infinite reverse;
          animation-play-state: paused;
        }
        .mc-nav.spinner {
          animation-play-state: running;
        }
        @keyframes mcSpin {
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
