'use client';

type TurntableControlsProps = {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  volume: number;
  onVolumeChange: (volume: number) => void;
};

export default function TurntableControls({
  isPlaying,
  onTogglePlay,
  onPrev,
  onNext,
  volume,
  onVolumeChange,
}: TurntableControlsProps) {
  const handleVolumeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newVolume = Math.max(0, Math.min(1, clickX / rect.width));
    onVolumeChange(newVolume);
  };

  return (
    <div className="space-y-6">
      {/* Transport Controls */}
      <div className="flex items-center justify-center gap-4">
        {/* Previous Button */}
        <button onClick={onPrev} className="hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
            <img 
              src="/assets/svg/previous-button.svg" 
              alt="Previous"
              className="w-full h-full"
              onError={(e) => {
                console.log('Previous button SVG not found');
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-xs">⏮</span>
          </div>
        </button>

        {/* Play/Stop Button */}
        <button onClick={onTogglePlay} className="hover:scale-105 transition-transform">
          <div className="w-16 h-16 bg-accent rounded-lg flex items-center justify-center">
            <img 
              src={isPlaying ? "/assets/svg/stop-button.svg" : "/assets/svg/play-button.svg"} 
              alt={isPlaying ? "Stop" : "Play"}
              className="w-full h-full"
              onError={(e) => {
                console.log('Play/Stop button SVG not found');
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-lg text-black">{isPlaying ? '⏹' : '▶'}</span>
          </div>
        </button>

        {/* Next Button */}
        <button onClick={onNext} className="hover:scale-105 transition-transform">
          <div className="w-12 h-12 bg-gray-300 rounded-lg flex items-center justify-center">
            <img 
              src="/assets/svg/next-button.svg" 
              alt="Next"
              className="w-full h-full"
              onError={(e) => {
                console.log('Next button SVG not found');
                e.currentTarget.style.display = 'none';
              }}
            />
            <span className="text-xs">⏭</span>
          </div>
        </button>
      </div>

      {/* Volume Control */}
      <div className="flex items-center justify-center">
        <div className="relative cursor-pointer w-48 h-8 bg-gray-300 rounded" onClick={handleVolumeClick}>
          {/* Volume Track */}
          <img 
            src="/assets/svg/volume-track.svg" 
            alt="Volume Track"
            className="w-full h-full"
            onError={(e) => {
              console.log('Volume track SVG not found');
              e.currentTarget.style.display = 'none';
            }}
          />
          
          {/* Volume Control Slider */}
          <div 
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 transition-all duration-150"
            style={{ left: `${volume * 100}%` }}
          >
            <div className="w-6 h-6 bg-accent rounded-full">
              <img 
                src="/assets/svg/volume-control.svg" 
                alt="Volume Control"
                className="w-full h-full"
                onError={(e) => {
                  console.log('Volume control SVG not found');
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          
          {/* Volume fill */}
          <div 
            className="absolute left-0 top-0 h-full bg-accent rounded opacity-50"
            style={{ width: `${volume * 100}%` }}
          />
        </div>
      </div>
      
      <p className="text-center text-sm text-gray-400">
        Missing SVG files? Check console for details.
      </p>
    </div>
  );
}