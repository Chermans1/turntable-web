"use client";
import { useEffect, useRef, useState } from "react";

export default function AudioBar({ audio, color }: { audio: HTMLAudioElement | null; color?: string }) {
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!audio) return;
    
    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoadedMetadata = () => {
      setDuration(audio.duration || 0);
      setIsLoaded(true);
    };
    const onLoadedData = () => {
      setDuration(audio.duration || 0);
      setIsLoaded(true);
    };
    
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onLoadedMetadata);
    audio.addEventListener('loadeddata', onLoadedData);
    
    // Force update duration if already loaded
    if (audio.duration && !isNaN(audio.duration)) {
      setDuration(audio.duration);
      setIsLoaded(true);
    }
    
    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onLoadedMetadata);
      audio.removeEventListener('loadeddata', onLoadedData);
    };
  }, [audio]);

  const percentage = duration && isLoaded ? (currentTime / duration) * 100 : 0;

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!audio || !duration || !isLoaded) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const seekPercentage = Math.max(0, Math.min(1, clickX / rect.width));
    const seekTime = seekPercentage * duration;
    
    try {
      audio.currentTime = seekTime;
    } catch (error) {
      console.warn('Failed to seek audio:', error);
    }
  };

  return (
    <div className="mt-4">
      <div
        className="relative h-2 w-full cursor-pointer rounded-full bg-white/10"
        onClick={handleSeek}
      >
        <div
          className={`absolute left-0 top-0 h-full rounded-full transition-all duration-150 ${!color ? "bg-accent" : ""}`}
          style={{ width: `${percentage}%`, background: color ? color : undefined }}
        />
      </div>
      <div className="mt-2 flex justify-between text-xs" style={{ color: '#2F2F2F' }}>
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  if (!isFinite(seconds)) return '0:00';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}