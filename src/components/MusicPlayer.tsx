import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  { id: 1, title: 'Neon Nights (AI Gen)', artist: 'CyberSnake', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' },
  { id: 2, title: 'Synthwave Sector (AI Gen)', artist: 'Grid Runner', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3' },
  { id: 3, title: 'Digital Dreams (AI Gen)', artist: 'Byte Beat', url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch((e) => console.log('Audio play error', e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentTrackIndex]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => setIsPlaying(!isPlaying);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const current = audioRef.current.currentTime;
      const duration = audioRef.current.duration;
      setProgress(duration ? current / duration : 0);
    }
  };

  const handleAudioEnded = () => {
    handleNext();
  };

  return (
    <div className="flex flex-col bg-zinc-900/80 backdrop-blur-md rounded-xl p-5 neon-border-fuchsia max-w-sm w-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-shrink-0 relative h-12 w-12 rounded-md bg-fuchsia-950 neon-border-fuchsia flex items-center justify-center">
          <Music className={`text-fuchsia-400 h-6 w-6 ${isPlaying ? 'animate-pulse' : ''}`} />
          {isPlaying && (
            <span className="absolute flex h-full w-full inset-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-md bg-fuchsia-400 opacity-20"></span>
            </span>
          )}
        </div>
        <div className="flex-1 overflow-hidden">
          <h2 className="text-zinc-50 font-bold truncate neon-text-fuchsia font-sans">
            {currentTrack.title}
          </h2>
          <p className="text-zinc-400 text-sm truncate font-mono">{currentTrack.artist}</p>
        </div>
      </div>

      <div className="w-full bg-zinc-800 h-1.5 rounded-full mb-4 overflow-hidden shadow-[inset_0_1px_3px_rgba(0,0,0,0.5)]">
        <div 
          className="bg-fuchsia-500 h-full transition-all duration-100 shadow-[0_0_8px_#d946ef]" 
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="flex items-center justify-between">
        <button className="text-zinc-400 hover:text-fuchsia-400 hover:neon-text-fuchsia transition-all" onClick={() => setIsMuted(!isMuted)}>
          {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
        </button>

        <div className="flex items-center gap-3">
          <button 
            className="p-2 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-cyan-400 transition-all border border-zinc-700 hover:neon-border-cyan"
            onClick={handlePrev}
          >
            <SkipBack size={20} className="ml-[-2px]"/>
          </button>
          
          <button 
            className="p-3 rounded-full bg-fuchsia-600 text-white hover:bg-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.5)] transition-all"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
          </button>

          <button 
            className="p-2 rounded-full bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-cyan-400 transition-all border border-zinc-700 hover:neon-border-cyan"
            onClick={handleNext}
          >
            <SkipForward size={20} className="mr-[-2px]"/>
          </button>
        </div>

        <audio 
          ref={audioRef} 
          src={currentTrack.url}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleAudioEnded}
          // Intentionally allowing dummy tracks cross-origin correctly if needed, though default usually works.
        />
        
        {/* Empty div for layout balance against the volume icon */}
        <div className="w-5" /> 
      </div>
    </div>
  );
}
