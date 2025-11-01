'use client';
import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { tracks } from '@/data/tracks';
import '../styles/track-cards.css';
import '../styles/spiller-na-panel.css';
import IllustratorTurntable from '@/components/IllustratorTurntable';
import TurntableControls from '@/components/TurntableControls';
import AudioBar from '@/components/AudioBar';
import AudioVisualizer from '@/components/AudioVisualizer';

export default function HomePage() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    
    if (isPlaying) {
      // Delay audio start to let tonearm "land" on record
      const playTimeout = setTimeout(() => {
        audio.play().catch(() => {});
      }, 1500); // 1.5 second delay
      
      return () => clearTimeout(playTimeout);
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.volume = volume;
    }
  }, [volume]);

  const handleTrackSelect = (index: number) => {
    setCurrentTrackIndex(index);
    setIsPlaying(true);
  };

  const handleNext = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    setCurrentTrackIndex(nextIndex);
  };

  const handlePrev = () => {
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
        background: `
          linear-gradient(135deg, #f4f1e8 0%, #e8e5dc 25%, #f1ede4 50%, #e5e2d9 75%, #f4f1e8 100%),
          radial-gradient(circle at 25% 25%, rgba(139, 121, 94, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 75% 75%, rgba(139, 121, 94, 0.05) 0%, transparent 50%)
        `,
        backgroundSize: '200px 200px, 300px 300px, 250px 250px'
      }}
    >      
      <div className="w-full max-w-[1280px] mx-auto relative z-10">
        {/* Header */}
        <header className="mb-6 hidden md:block text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-800 drop-shadow-sm">
            Digital Music Showcase
          </h1>
        </header>

        {/* Responsive Turntable Wrapper */}
        <div className="turntable-responsive-wrapper w-full">
          <div 
            className="turntable-container relative mx-auto"
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
                  rotate: isPlaying ? 30 : 0 
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
                  rotate: isPlaying ? 21 : 0,
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
            className="text-2xl font-bold emboss"
            style={{
              color: '#5a7587ff',
              textShadow: '0 2px 6px #9F9C91, 0 1px 0 #a4a39aff'
            }}
          >
            LÅTER  <span className="text-teal-800">{tracks.length}</span>
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
                    <div className="text-teal-900/70 text-sm truncate">{track.artist}</div>
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
                <button onClick={() => setIsPlaying(!isPlaying)} className="hover:scale-105 transition-transform">
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

        {/* Hidden Audio Element */}
        <audio 
          ref={audioRef} 
          src={currentTrack.audioUrl} 
          preload="metadata"
          onEnded={() => {
            // Auto-play next track
            const nextIndex = (currentTrackIndex + 1) % tracks.length;
            setCurrentTrackIndex(nextIndex);
            setIsPlaying(true);
          }}
        />
      </div>

      <style jsx>{`
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

function TrackItem({ 
  track, 
  index, 
  isActive, 
  isPlaying, 
  onClick 
}: { 
  track: typeof tracks[0];
  index: number;
  isActive: boolean;
  isPlaying: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl transition-all duration-200 ${
        isActive 
          ? 'bg-accent/20 border border-accent/40' 
          : 'bg-white/5 hover:bg-white/10 border border-transparent'
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Track Number or Playing Indicator */}
        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-sm">
          {isPlaying ? (
            <div className="flex gap-1">
              <div className="w-1 h-3 bg-accent animate-pulse"></div>
              <div className="w-1 h-3 bg-accent animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-1 h-3 bg-accent animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          ) : (
            <span className="text-white/60">{index + 1}</span>
          )}
        </div>

        {/* Track Info */}
        <div className="flex-1 min-w-0">
          <h4 className={`font-medium truncate ${isActive ? 'text-accent' : ''}`}>
            {track.title}
          </h4>
          <p className="text-sm text-white/60 truncate">{track.artist}</p>
        </div>

        {/* Duration */}
        {track.durationSec && (
          <div className="text-xs text-white/40">
            {formatDuration(track.durationSec)}
          </div>
        )}

        {/* Color indicator */}
        {track.color && (
          <div 
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: track.color }}
          />
        )}
      </div>
    </button>
  );
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}