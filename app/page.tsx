'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { tracks } from '@/data/tracks';
import '../styles/track-cards.css';
import '../styles/spiller-na-panel.css';
import IllustratorTurntable from '@/components/IllustratorTurntable';
import TurntableControls from '@/components/TurntableControls';
import CassetteDeck from '@/components/CassetteDeck';
import AudioBar from '@/components/AudioBar';
import AudioVisualizer from '@/components/AudioVisualizer';

// Kalibrering: hvor mange grader tonearmen vandrer fra ytterspor til
// innerspor gjennom en hel låt. Testes live med ?utslag=14 i URL-en,
// og ?test=1 låser armen i sluttposisjon for statisk kalibrering.
const STANDARD_SPOR_UTSLAG = 15; // kalibrert visuelt 20. juli 2026

export default function HomePage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [fremdrift, setFremdrift] = useState(0); // 0-1 gjennom låten
  const audioRef = useRef<HTMLAudioElement>(null);
  const reduserBevegelse = useReducedMotion();

  // Kalibreringsoverstyringer fra URL (kun for utvikling)
  const [sporUtslag] = useState(() => {
    if (typeof window === 'undefined') return STANDARD_SPOR_UTSLAG;
    const p = new URLSearchParams(window.location.search).get('utslag');
    return p ? parseFloat(p) : STANDARD_SPOR_UTSLAG;
  });
  const [testSlutt] = useState(() => {
    if (typeof window === 'undefined') return false;
    return new URLSearchParams(window.location.search).get('test') === '1';
  });

  const currentTrack = tracks[currentTrackIndex];

  // Tonearmen følger avspillingen: nettleseren vet både lengde (duration)
  // og posisjon (currentTime), så fremdriften er alltid riktig per låt.
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const oppdater = () => {
      if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
        setFremdrift(audio.currentTime / audio.duration);
      }
    };
    audio.addEventListener('timeupdate', oppdater);
    return () => audio.removeEventListener('timeupdate', oppdater);
  }, []);

  // Ny låt: armen skal ut til startsporet igjen
  useEffect(() => {
    setFremdrift(0);
  }, [currentTrackIndex]);

  // Armens vandring innover: 0 grader ved ytterspor, sporUtslag ved innerspor.
  // Reduced motion: armen lander, men sporer ikke.
  const vandring = testSlutt
    ? sporUtslag
    : reduserBevegelse
      ? 0
      : Math.min(fremdrift, 1) * sporUtslag;
  const baseVinkel = testSlutt ? 30 + vandring : isPlaying ? 30 + vandring : 0;
  const armVinkel = testSlutt ? 21 + vandring : isPlaying ? 21 + vandring : 0;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      // Desktop: vent på at tonearmen "lander" på platen.
      // Mobil: ingen arm, så lyden starter nesten umiddelbart.
      const harTonearm =
        typeof window !== 'undefined' &&
        window.matchMedia('(min-width: 1024px)').matches;
      const playTimeout = setTimeout(() => {
        audio.play().catch((error) => {
          console.error('Audio playback error:', error);
          console.log('Attempted to play:', currentTrack.audioUrl);
          setIsPlaying(false);
        });
      }, harTonearm ? 1500 : 150);
      
      return () => clearTimeout(playTimeout);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex, currentTrack.audioUrl]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleTrackSelect = (index: number) => {
    console.log('Track selected:', index, tracks[index].title);
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  // Ekte stopp (mobil): pause + spole tilbake til start
  const handleStop = () => {
    const audio = audioRef.current;
    if (audio) audio.currentTime = 0;
    setFremdrift(0);
    setIsPlaying(false);
  };

  const handleNext = () => {
    console.log('Next button clicked');
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrev = () => {
    console.log('Previous button clicked');
    const prevIndex = currentTrackIndex === 0 ? tracks.length - 1 : currentTrackIndex - 1;
    setCurrentTrackIndex(prevIndex);
  };

  const turntableData = [{
    id: currentTrack.slug,
    title: currentTrack.title,
    artist: currentTrack.artist,
    coverColor: currentTrack.color,
    src: currentTrack.audioUrl
  }];

  return (
    <main 
      className="min-h-screen p-4 md:p-8 relative flex items-center justify-center overflow-x-hidden"
      style={{
        // Papir-krem fra christianhermansen.no, med varm gull-glød
        background: `
          radial-gradient(ellipse 70% 55% at 50% -10%, rgba(217, 146, 60, 0.14), transparent 70%),
          radial-gradient(circle at 75% 85%, rgba(168, 67, 42, 0.05) 0%, transparent 55%),
          linear-gradient(135deg, #f1e7d3 0%, #ece0c9 50%, #f1e7d3 100%)
        `
      }}
    >      
      <div className="w-full max-w-[1280px] mx-auto relative z-10">
        <div className="skrivebord">
        {/* Header */}
        <header className="mb-6 hidden md:block text-center">
          <h1
            className="text-4xl font-bold tracking-tight drop-shadow-sm display-font"
            style={{ color: '#24494e' }}
          >
            Digital Music Showcase
          </h1>
        </header>

        {/* Responsive Turntable Wrapper */}
        <div className="w-full">
          <div 
            className="relative mx-auto"
            style={{
              width: '1280px',
              height: '817px',
            border: '3px solid rgba(255, 255, 255, 0.3)',
            borderRadius: '24px',
            overflow: 'hidden',
            backgroundImage: 'url(/assets/svg/turntable-base.svg)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            boxShadow: `
              0 25px 50px -12px rgba(0, 0, 0, 0.8),
              0 10px 25px -5px rgba(0, 0, 0, 0.6),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -1px 0 rgba(0, 0, 0, 0.3)
            `
          }}
        >
          
          {/* Vinyl Panel - 685x685px, top-left */}
          <div 
            className="absolute p-8"
            style={{
              top: '0',
              left: '0',
              width: '685px',
              height: '685px',
              backgroundImage: 'url(/assets/svg/turntable-base.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <IllustratorTurntable
              isPlaying={isPlaying}
              currentTrack={currentTrack}
              onTogglePlay={() => setIsPlaying(!isPlaying)}
            />
          </div>

          {/* Tonearm Panel - 180x685px, top-middle */}
          <div 
            className="absolute p-6"
            style={{
              top: '0',
              left: '685px',
              width: '180px',
              height: '685px',
              backgroundImage: 'url(/assets/svg/turntable-base.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            {/* Tonearm-base.svg plassert mot toppen av panelet */}
            <div className="w-full flex justify-center pt-4 relative">
              <motion.img 
                src="/assets/svg/tonearm-base.svg" 
                alt="Tonearm Base"
                className="w-32 h-auto object-contain"
                animate={{
                  rotate: baseVinkel
                }}
                transition={{
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                style={{
                  transformOrigin: "53% 63%"
                }}
                onError={(e) => {
                  console.log('Tonearm Base SVG not found');
                  e.currentTarget.style.display = 'none';
                }}
              />
              
              {/* Tonearm.svg - roterer fra samme pivotpunkt som basen */}
              <motion.img 
                src="/assets/svg/tonearm.svg" 
                alt="Tonearm"
                className="absolute object-contain"
                style={{
                  width: '300px', // Lang nok til å nå vinyl-platen
                  height: 'auto',
                  top: '210%',
                  left: '10%',
                  transformOrigin: "97% -2%", // Pivotpunkt nær bunnen av tonearm
                  zIndex: 10
                }}
                initial={{ 
                  rotate: 0,
                  x: '-50%',
                  y: '-50%'
                }}
                animate={{
                  rotate: armVinkel,
                  x: '-50%',
                  y: '-50%'
                }}
                transition={{ 
                  duration: 0.8,
                  ease: "easeInOut"
                }}
                onError={(e) => {
                  console.log('Tonearm SVG not found');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>


        {/* LÅTER label outside panel */}
        <div
          className="absolute z-20"
          style={{
            top: '0px',
            left: '865px',
            width: '367px',
            height: '48px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'right',
          }}
        >
          <h3
            className="text-2xl font-bold emboss display-font"
            style={{
              color: '#24494e',
              textShadow: '0 2px 6px #9F9C91, 0 1px 0 #a4a39aff'
            }}
          >
            LÅTER  <span style={{ color: '#a8432a' }}>{tracks.length}</span>
          </h3>
        </div>

        {/* Låter Panel - 415x520px, øverst til høyre */}
        <div
          className="absolute z-10"
          style={{
            top: '48px',
            left: '889px',
            width: '365px',
            height: '450px',
            background: '#E17858',
            borderRadius: '1.5rem',
            border: '2px solid #9ed9f0',
            boxShadow: 'inset 0 18px 40px -10px rgba(0,0,0,.35),0 6px 24px rgba(0,0,0,.15)',
            overflow: 'hidden',
          }}
        >
          {/* header gradient overlay */}
          <div className="absolute inset-x-0 top-0 h-10 pointer-events-none bg-gradient-to-b from-black/10 to-transparent" />
          {/* scroll area */}
          <div className="absolute inset-0">
            <div className="track-list h-full w-full overflow-y-auto px-3 py-4 space-y-3 bg-follow no-scrollbar">
              {tracks.map((track, index) => (
                <button
                  key={track.slug}
                  type="button"
                  onClick={() => handleTrackSelect(index)}
                  className="group w-full text-left relative rounded-2xl px-4 py-4 bg-[#f6f0df] border border-teal-700/30 shadow-[0_6px_0_rgba(20,100,110,.25)] flex gap-4 items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500 hover:shadow-[0_8px_0_rgba(20,100,110,.30)]"
                >
                  <div className={`grid place-items-center w-10 h-10 shrink-0 rounded-full font-bold ${index === currentTrackIndex ? 'active-num' : 'bg-teal-800 text-white'}`}>
                    {index + 1}
                  </div>
                  <div className="leading-tight min-w-0">
                    <div className="text-teal-800 text-lg font-semibold tracking-tight truncate">
                      {track.title}
                    </div>
                    <div className="text-teal-900/70 text-xs leading-snug">{track.artist}</div>
                  </div>
                </button>
              ))}
              <div className="h-2" />
            </div>
          </div>
          {/* bezel / glass overlays */}
          <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.25)' }} />
          <div className="absolute inset-0 rounded-3xl pointer-events-none bg-[linear-gradient(180deg,rgba(255,255,255,.18),rgba(255,255,255,0)_35%)]" />
        </div>
        {/* Spiller Nå Info Panel - midten til høyre */}
        <div
          className="absolute z-10"
          style={{
            top: '520px',
            left: '889px',
            width: '367px',
            height: '120px',
          }}
        >
          <div className="display-panel">
            <div className="glass"></div>
            <div className="display-content">
              <div className="display-header">Spiller Nå</div>
              <div className="display-track">{currentTrack.title}</div>
              <div className="display-artist">{currentTrack.artist}</div>
            </div>
          </div>
        </div>

        {/* Spiller Nå Visualizer Panel - nederst til høyre */}
        <div
          className="absolute z-10"
          style={{
            top: '660px',
            left: '889px',
            width: '367px',
            height: '125px',
          }}
        >
          <div className="display-panel flex items-end justify-center">
            <div className="glass"></div>
            <div className="w-full h-full flex items-end justify-center" style={{ position: 'absolute', bottom: '32px', left: 0, right: 0 }}>
              <AudioVisualizer audio={audioRef.current} bars={12} color="#FFD166" />
            </div>
          </div>
        </div>


          {/* Transport Controls Panel - 350x132px, bottom left */}
          <div 
            className="absolute p-6"
            style={{
              top: '685px',
              left: '0',
              width: '350px',
              height: '132px',
              backgroundImage: 'url(/assets/svg/turntable-base.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                {/* Previous Button */}
                <button onClick={handlePrev} className="hover:scale-105 transition-transform">
                  <div style={{ width: '39.97px', height: '45px' }} className="bg-gray-700 rounded-lg flex items-center justify-center">
                    <img 
                      src="/assets/svg/previous-button.svg" 
                      alt="Previous"
                      className="w-full h-full"
                      onError={(e) => {
                        console.log('Previous button SVG not found');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </button>

                {/* Play/Stop Button */}
                <button 
                  onClick={() => {
                    console.log('Play/Stop clicked. Current state:', isPlaying);
                    setIsPlaying(!isPlaying);
                  }} 
                  className="hover:scale-105 transition-transform"
                >
                  <div style={{ width: '39.97px', height: '45px' }} className="bg-accent rounded-lg flex items-center justify-center">
                    <img 
                      src={isPlaying ? "/assets/svg/stop-button.svg" : "/assets/svg/play-button.svg"}
                      alt={isPlaying ? "Stop" : "Play"}
                      className="w-full h-full"
                      onError={(e) => {
                        console.log('Play/Stop button SVG not found');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="text-xs text-bg font-semibold">
                      {isPlaying ? "" : ""}
                    </span>
                  </div>
                </button>

                {/* Next Button */}
                <button onClick={handleNext} className="hover:scale-105 transition-transform">
                  <div style={{ width: '39.97px', height: '45px' }} className="bg-gray-700 rounded-lg flex items-center justify-center">
                    <img 
                      src="/assets/svg/next-button.svg" 
                      alt="Next"
                      className="w-full h-full"
                      onError={(e) => {
                        console.log('Next button SVG not found');
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Volume Controls Panel - 335x132px, bottom right */}
          <div 
            className="absolute p-6"
            style={{
              top: '685px',
              left: '350px',
              width: '335px',
              height: '132px',
              backgroundImage: 'url(/assets/svg/turntable-base.svg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat'
            }}
          >
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Volume Track Image */}
                <div className="relative">
                  <div className="relative w-full" style={{ height: '45px' }}>
                    <img 
                      src="/assets/svg/volume-track.svg" 
                      alt="Volume Track"
                      className="absolute left-0 top-0 w-full h-full object-contain pointer-events-none" 
                    />
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={e => setVolume(parseFloat(e.target.value))}
                      aria-label="Volume control"
                      className="absolute left-0 top-0 w-full h-full opacity-0 cursor-pointer z-20"
                      style={{ appearance: 'none' }}
                    />
                    <img 
                      src="/assets/svg/volume-control.svg" 
                      alt="Volume Control"
                      className="absolute top-1/2 z-30 pointer-events-none"
                      style={{ left: `calc(20% + ${volume * 60}% - 22.5px)`, transform: 'translateY(-50%)', width: '45px', height: '45px' }}
                    />
                  </div>
                </div>
                
                {/* Volume Control Slider */}
                <div className="flex items-center gap-3">
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
        </div>

        {/* Mobil: buevindu + stablede paneler.
            Fase 1 av formatskiftet - kassettdekk kommer på mellombredde. */}
        <div className="mobil-spiller w-full max-w-[480px] mx-auto flex flex-col gap-4">

          {/* Mellombredde (768-1024): MC-kassetten */}
          <div className="mc-visning">
            <CassetteDeck
              isPlaying={isPlaying}
              fremdrift={fremdrift}
              reduserBevegelse={reduserBevegelse}
              title={currentTrack.title}
            />
          </div>

          {/* Buevindu: CD-en bak tonet glass */}
          <div className="w-full bue-visning">
            <svg
              viewBox="0 0 786.31 352.83"
              className="w-full h-auto drop-shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
              role="img"
              aria-label={`Cover: ${currentTrack.title}`}
            >
              <defs>
                <clipPath id="bue-vindu">
                  <path d="M44.24,326.42c-8.53,0-14.86-7.95-12.89-16.24,2.43-10.25,5.94-22.42,10.9-36.16,11.33-31.33,32.87-78.15,71.17-123.25,31.56-37.18,68.98-66.52,111.2-87.21,50.3-24.64,107.87-37.14,171.12-37.14,114.32,0,206.36,38.73,273.55,115.12,40.27,45.77,62.65,95.35,74.34,128.87,5.29,15.18,8.98,28.64,11.48,39.89,1.84,8.27-4.44,16.12-12.92,16.12H44.24Z" />
                </clipPath>
                {/* Selve CD-trykket: coveret klippet til skiven, med
                    mørk ytterkant fra turntabel_CD.svg synlig som rand */}
                <clipPath id="cd-trykk">
                  <circle cx="393.15" cy="391.5" r="322" />
                </clipPath>
              </defs>
              {/* Vinduet er et innblikk til CD-en: bare toppen av skiven
                  synes, resten forsvinner bak dekket */}
              <g clipPath="url(#bue-vindu)">
                {/* Mørkt kammer bak skiven */}
                <rect x="31" y="26" width="725" height="301" fill="#1E1E1E" />
                {/* CD-en roterer når musikken spiller */}
                <g className={`cd-rotor${isPlaying && !reduserBevegelse ? ' spinner' : ''}`}>
                  {/* Skiven (turntabel_CD.svg: r 340.75, #39352f) */}
                  <circle cx="393.15" cy="391.5" r="340.75" fill="#39352f" />
                  <image
                    href={currentTrack.coverUrl}
                    x="52.4"
                    y="50.75"
                    width="681.5"
                    height="681.5"
                    preserveAspectRatio="xMidYMid slice"
                    clipPath="url(#cd-trykk)"
                  />
                  {/* Nav og hull i midten */}
                  <circle cx="393.15" cy="391.5" r="78" fill="rgba(30,30,30,0.55)" stroke="rgba(255,255,255,0.18)" strokeWidth="2" />
                  <circle cx="393.15" cy="391.5" r="40" fill="#1E1E1E" stroke="rgba(255,255,255,0.25)" strokeWidth="2" />
                </g>
              </g>
              {/* Rammen (fra turntabel_glass.svg) */}
              <path
                d="M395.74,1.42C70.24,1.42-7.76,312.42,2.24,351.42h782C792.24,319.42,730.24,1.42,395.74,1.42ZM44.24,326.42c-8.53,0-14.86-7.95-12.89-16.24,2.43-10.25,5.94-22.42,10.9-36.16,11.33-31.33,32.87-78.15,71.17-123.25,31.56-37.18,68.98-66.52,111.2-87.21,50.3-24.64,107.87-37.14,171.12-37.14,114.32,0,206.36,38.73,273.55,115.12,40.27,45.77,62.65,95.35,74.34,128.87,5.29,15.18,8.98,28.64,11.48,39.89,1.84,8.27-4.44,16.12-12.92,16.12H44.24Z"
                fill="#463c3b"
                stroke="#000"
                strokeMiterlimit={10}
                strokeWidth={2.83}
              />
              {/* Glasstonen over coveret - lettere enn originalens 50 %
                  så nattescenene fortsatt synes */}
              <path
                d="M44.24,326.42c-8.53,0-14.86-7.95-12.89-16.24,2.43-10.25,5.94-22.42,10.9-36.16,11.33-31.33,32.87-78.15,71.17-123.25,31.56-37.18,68.98-66.52,111.2-87.21,50.3-24.64,107.87-37.14,171.12-37.14,114.32,0,206.36,38.73,273.55,115.12,40.27,45.77,62.65,95.35,74.34,128.87,5.29,15.18,8.98,28.64,11.48,39.89,1.84,8.27-4.44,16.12-12.92,16.12H44.24Z"
                fill="#463c3b"
                opacity={0.28}
                stroke="#000"
                strokeMiterlimit={10}
                strokeWidth={2.83}
              />
            </svg>
          </div>

          {/* LÅTER-etikett */}
          <div className="flex justify-end px-1">
            <h2
              className="text-xl font-bold display-font"
              style={{
                color: '#24494e',
                textShadow: '0 2px 6px #9F9C91, 0 1px 0 #a4a39aff',
              }}
            >
              LÅTER <span style={{ color: '#a8432a' }}>{tracks.length}</span>
            </h2>
          </div>

          {/* Låtliste - samme terracotta-panel som skrivebordet */}
          <div
            className="relative w-full"
            style={{
              height: '340px',
              background: '#E17858',
              borderRadius: '1.5rem',
              border: '2px solid #9ed9f0',
              boxShadow:
                'inset 0 18px 40px -10px rgba(0,0,0,.35),0 6px 24px rgba(0,0,0,.15)',
              overflow: 'hidden',
            }}
          >
            <div className="absolute inset-x-0 top-0 h-10 pointer-events-none bg-gradient-to-b from-black/10 to-transparent z-10" />
            <div className="track-list h-full w-full overflow-y-auto px-3 py-4 space-y-3 bg-follow no-scrollbar">
              {tracks.map((track, index) => (
                <button
                  key={track.slug}
                  type="button"
                  onClick={() => handleTrackSelect(index)}
                  className="group w-full text-left relative rounded-2xl px-4 py-4 bg-[#f6f0df] border border-teal-700/30 shadow-[0_6px_0_rgba(20,100,110,.25)] flex gap-4 items-center cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-500"
                >
                  <div className={`grid place-items-center w-10 h-10 shrink-0 rounded-full font-bold ${index === currentTrackIndex ? 'active-num' : 'bg-teal-800 text-white'}`}>
                    {index + 1}
                  </div>
                  <div className="leading-tight min-w-0">
                    <div className="text-teal-800 text-base font-semibold tracking-tight truncate">
                      {track.title}
                    </div>
                    <div className="text-teal-900/70 text-xs leading-snug">{track.artist}</div>
                  </div>
                </button>
              ))}
              <div className="h-2" />
            </div>
            <div className="absolute inset-0 rounded-3xl pointer-events-none" style={{ boxShadow: 'inset 0 0 0 1px rgba(255,255,255,.25)' }} />
          </div>

          {/* Spiller Nå */}
          <div className="display-panel">
            <div className="glass"></div>
            <div className="display-content">
              <div className="display-header">Spiller Nå</div>
              <div className="display-track">{currentTrack.title}</div>
              <div className="display-artist">{currentTrack.artist}</div>
            </div>
          </div>

          {/* Visualizer */}
          <div className="display-panel" style={{ height: '96px' }}>
            <div className="glass"></div>
            <div className="absolute inset-0 flex items-end justify-center pb-5">
              <AudioVisualizer audio={audioRef.current} bars={12} color="#FFD166" />
            </div>
          </div>

          {/* Transport: forrige, stopp, spill, neste */}
          <div className="flex items-center justify-center gap-5 py-2">
            <button onClick={handlePrev} aria-label="Forrige låt" className="active:scale-95 transition-transform">
              <div style={{ width: '52px', height: '58px' }} className="bg-gray-700 rounded-lg flex items-center justify-center">
                <img src="/assets/svg/previous-button.svg" alt="" className="w-full h-full" />
              </div>
            </button>
            <button onClick={handleStop} aria-label="Stopp" className="active:scale-95 transition-transform">
              <div style={{ width: '52px', height: '58px', opacity: isPlaying ? 1 : 0.55 }} className="bg-gray-700 rounded-lg flex items-center justify-center">
                <img src="/assets/svg/stop-button.svg" alt="" className="w-full h-full" />
              </div>
            </button>
            <button
              onClick={() => setIsPlaying(true)}
              aria-label="Spill av"
              className="active:scale-95 transition-transform"
            >
              <div style={{ width: '52px', height: '58px', opacity: isPlaying ? 0.55 : 1 }} className="bg-accent rounded-lg flex items-center justify-center">
                <img src="/assets/svg/play-button.svg" alt="" className="w-full h-full" />
              </div>
            </button>
            <button onClick={handleNext} aria-label="Neste låt" className="active:scale-95 transition-transform">
              <div style={{ width: '52px', height: '58px' }} className="bg-gray-700 rounded-lg flex items-center justify-center">
                <img src="/assets/svg/next-button.svg" alt="" className="w-full h-full" />
              </div>
            </button>
          </div>
        </div>

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          src={currentTrack.audioUrl} 
          preload="metadata"
          onError={(e) => {
            console.error('Audio loading error:', e);
            console.log('Failed to load:', currentTrack.audioUrl);
          }}
          onLoadedMetadata={() => {
            console.log('Audio loaded:', currentTrack.audioUrl);
          }}
          onEnded={() => {
            // Auto-play next track
            const nextIndex = (currentTrackIndex + 1) % tracks.length;
            setCurrentTrackIndex(nextIndex);
            setIsPlaying(true);
          }}
        />
      </div>

      <style jsx>{`
        .bg-follow {
          /* Gjennomsiktig så terracotta-panelet bak kortene synes -
             originaldesignet. Prikkene ligger som subtil tekstur oppå. */
          background-color: transparent;
          background-image:
            radial-gradient(rgba(244,236,226,.28) 1px, transparent 1.5px),
            radial-gradient(rgba(244,236,226,.16) 1px, transparent 1.5px),
            linear-gradient(180deg, rgba(255,255,255,.05), rgba(0,0,0,.05)),
            radial-gradient(60% 20% at 50% 0%, rgba(255,255,255,.1), transparent);
          background-size: 18px 18px, 36px 36px, 100% 100%, 100% 40%;
          background-attachment: local, local, local, local;
        }

        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* CD-en i buevinduet: roterer rundt eget sentrum når det spilles,
           fryser der den er ved pause */
        .cd-rotor {
          transform-box: view-box;
          transform-origin: 393.15px 391.5px;
          animation: cdSpin 2.2s linear infinite;
          animation-play-state: paused;
        }
        .cd-rotor.spinner { animation-play-state: running; }
        @keyframes cdSpin { to { transform: rotate(360deg); } }

        /* Formatskifte: platespiller på stor skjerm, MC-kassett på
           mellombredde, CD i buevindu på mobil. */
        .skrivebord { display: none; }
        .mobil-spiller { display: flex; }
        .mobil-spiller :global(.display-panel) { width: 100%; }
        .mc-visning { display: none; }
        @media (min-width: 768px) {
          .bue-visning { display: none; }
          .mc-visning { display: block; }
          .mobil-spiller { max-width: 40rem; }
        }
        @media (min-width: 1024px) {
          .skrivebord { display: block; }
          .mobil-spiller { display: none; }
        }

        .turntable-responsive-wrapper {
          width: 100%;
          max-width: 1280px;
          aspect-ratio: 1280 / 817;
        }

        .turntable-container {
          transform-origin: top left;
        }

        @media (max-width: 1320px) {
          .turntable-container {
            transform: scale(calc((100vw - 64px) / 1280));
          }
        }

        @media (max-width: 768px) {
          .turntable-container {
            transform: scale(calc((100vw - 32px) / 1280));
          }
        }

        @media (max-width: 480px) {
          .turntable-container {
            transform: scale(calc((100vw - 16px) / 1280));
          }
        }
      `}</style>
    </main>
  )
}