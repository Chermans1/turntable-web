import { useEffect, useRef, useState } from "react";

export default function AudioVisualizer({ audio, bars = 5, color = "#FFD166" }: { audio: HTMLAudioElement | null; bars?: number; color?: string }) {
  const [levels, setLevels] = useState<number[]>(Array(bars).fill(0));
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationRef = useRef<number | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  useEffect(() => {
    if (!audio) return;
    let ctx: AudioContext | null = null;
    let analyser: AnalyserNode | null = null;
    let source: MediaElementAudioSourceNode | null = null;
    let running = true;

    ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    analyser = ctx.createAnalyser();
    analyser.fftSize = 128; // More detailed
    source = ctx.createMediaElementSource(audio);
    source.connect(analyser);
    analyser.connect(ctx.destination);
    analyserRef.current = analyser;
    sourceRef.current = source;

    const dataArray = new Uint8Array(analyser.frequencyBinCount);

    function animate() {
      if (!running) return;
      analyser!.getByteFrequencyData(dataArray);
      // Split into N bars
      const step = Math.floor(dataArray.length / bars);
      const newLevels = Array(bars)
        .fill(0)
        .map((_, i) => {
          const start = i * step;
          const end = start + step;
          const avg =
            dataArray.slice(start, end).reduce((a, b) => a + b, 0) / step;
          return avg;
        });
      setLevels(newLevels);
      animationRef.current = requestAnimationFrame(animate);
    }
    animate();

    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      if (analyser) analyser.disconnect();
      if (source) source.disconnect();
      if (ctx) ctx.close();
    };
  }, [audio, bars]);

  // Bar heights: scale 0-255 to 5px-32px
  return (
    <div className="flex items-end justify-center gap-2 w-full h-full" style={{ height: '100%' }}>
      {levels.map((level, i) => (
        <div
          key={i}
          style={{
            width: '8px',
            height: `${4 + (level / 255) * 48}px`, // Større variasjon
            borderRadius: '6px',
            background: color,
            boxShadow: `0 0 8px ${color}`,
            transition: 'height 0.08s cubic-bezier(.4,1.6,.4,1)', // Raskere
            opacity: 0.85
          }}
        />
      ))}
    </div>
  );
}
