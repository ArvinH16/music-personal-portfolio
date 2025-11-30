import React, { useState, useEffect, useRef } from 'react';
import { Background3D } from './components/Background3D';
import { AlbumStack } from './components/AlbumStack';
import { AlbumDetail } from './components/AlbumDetail';
import { ALBUMS } from './constants';
import { Album, Track } from './types';
import { Menu, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [selectedAlbum, setSelectedAlbum] = useState<Album | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  // Audio State
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingTrack, setPlayingTrack] = useState<Track | null>(null);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const [analyserNode, setAnalyserNode] = useState<AnalyserNode | null>(null);

  // Initialize Audio Logic
  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    // Handle end of track
    const handleEnded = () => setIsPlaying(false);
    audio.addEventListener('ended', handleEnded);
    
    // Cleanup
    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.pause();
      audioRef.current = null;
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  const initAudioContext = () => {
    if (!audioContextRef.current && audioRef.current) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;
      
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 64; // Small FFT size for bass detection
      analyserRef.current = analyser;
      setAnalyserNode(analyser);

      // Create source only once
      if (!sourceRef.current) {
        const source = ctx.createMediaElementSource(audioRef.current);
        sourceRef.current = source;
        source.connect(analyser);
        analyser.connect(ctx.destination);
      }
    }
    
    // Resume context if suspended (browser autoplay policy)
    if (audioContextRef.current?.state === 'suspended') {
      audioContextRef.current.resume();
    }
  };

  const handlePlayTrack = async (track: Track) => {
    if (!audioRef.current) return;

    // Initialize context on first user interaction
    initAudioContext();

    const isSameTrack = playingTrack?.title === track.title;

    if (isPlaying && isSameTrack) {
      // Pause current
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Play new or Resume
      if (track.audioUrl) {
        // If changing tracks, update src
        if (!isSameTrack) {
             audioRef.current.src = track.audioUrl;
        }

        try {
            const playPromise = audioRef.current.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        setIsPlaying(true);
                        setPlayingTrack(track);
                    })
                    .catch((error) => {
                        if (error.name === 'AbortError') {
                            // Ignore abort errors from rapid switching
                            console.log('Playback aborted by user');
                        } else {
                            console.error("Playback failed", error);
                            setIsPlaying(false);
                        }
                    });
            }
        } catch (e) {
            console.error("Synchronous playback error", e);
        }
      }
    }
  };

  const handleIndexChange = (index: number) => {
    setActiveIndex(index);
  };

  const handleSelectAlbum = (album: Album) => {
    setSelectedAlbum(album);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setTimeout(() => setSelectedAlbum(null), 300);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if (isDetailOpen) {
            if (e.key === 'Escape') handleCloseDetail();
            return;
        }

        if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            setActiveIndex(prev => Math.min(ALBUMS.length - 1, prev + 1));
        } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            setActiveIndex(prev => Math.max(0, prev - 1));
        } else if (e.key === 'Enter') {
            handleSelectAlbum(ALBUMS[activeIndex]);
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIndex, isDetailOpen]);

  const currentAlbum = ALBUMS[activeIndex];

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden">
      <Background3D 
        primaryColor={currentAlbum.primaryColor} 
        secondaryColor={currentAlbum.secondaryColor} 
        analyser={analyserNode}
      />

      <div className="relative z-10 w-full h-full pointer-events-none">
        <header className="absolute top-0 left-0 w-full p-8 flex justify-between items-center pointer-events-auto">
            <div className="flex items-center gap-2 group cursor-pointer">
                <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center">
                    <div className={`w-2 h-2 bg-white rounded-full ${isPlaying ? 'animate-ping' : 'animate-pulse'}`} />
                </div>
                <span className="font-display font-bold text-xl tracking-wider">SONIC VISIONS</span>
            </div>
            
            <div className="flex gap-6">
                <button className="p-2 hover:text-white/70 transition-colors">
                    <Search size={24} />
                </button>
                <button className="p-2 hover:text-white/70 transition-colors">
                    <Menu size={24} />
                </button>
            </div>
        </header>

        <div className="absolute bottom-12 left-12 hidden md:block">
             <div className="overflow-hidden">
                <h3 className="font-display text-sm font-bold tracking-[0.3em] opacity-60 mb-2">
                    {isPlaying ? 'NOW PLAYING' : 'SELECTED ALBUM'}
                </h3>
                <div className="text-2xl font-light">
                     {currentAlbum.artist} <span className="mx-2 opacity-50">—</span> {currentAlbum.title}
                </div>
             </div>
        </div>

        <div className="pointer-events-auto w-full h-full">
            <AlbumStack 
                albums={ALBUMS} 
                activeIndex={activeIndex} 
                onIndexChange={handleIndexChange}
                onSelect={handleSelectAlbum}
            />
        </div>

      </div>

      <AlbumDetail 
        album={selectedAlbum || currentAlbum} 
        isOpen={isDetailOpen} 
        onClose={handleCloseDetail} 
        onPlay={handlePlayTrack}
        isPlaying={isPlaying}
        currentTrack={playingTrack}
      />
    </div>
  );
};

export default App;