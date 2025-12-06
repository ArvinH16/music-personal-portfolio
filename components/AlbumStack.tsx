import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Album } from '../types';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface AlbumStackProps {
  albums: Album[];
  activeIndex: number;
  onIndexChange: (index: number) => void;
  onSelect: (album: Album) => void;
}

export const AlbumStack: React.FC<AlbumStackProps> = ({
  albums,
  activeIndex,
  onIndexChange,
  onSelect,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollMomentumRef = useRef(0);
  const rafRef = useRef<number | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const scrollThreshold = 80;

  useEffect(() => {
    activeIndexRef.current = activeIndex;
  }, [activeIndex]);
  
  // Handle Wheel scroll for the stack
  useEffect(() => {
    const animateScroll = () => {
      if (scrollMomentumRef.current > scrollThreshold && activeIndexRef.current < albums.length - 1) {
        onIndexChange(activeIndexRef.current + 1);
        scrollMomentumRef.current = 0;
      } else if (scrollMomentumRef.current < -scrollThreshold && activeIndexRef.current > 0) {
        onIndexChange(activeIndexRef.current - 1);
        scrollMomentumRef.current = 0;
      }

      scrollMomentumRef.current *= 0.6;

      if (Math.abs(scrollMomentumRef.current) > 1) {
        rafRef.current = requestAnimationFrame(animateScroll);
      } else {
        scrollMomentumRef.current = 0;
        rafRef.current = null;
      }
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      scrollMomentumRef.current += e.deltaY;

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(animateScroll);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener('wheel', handleWheel, { passive: false });
    }
    return () => {
      if (container) {
        container.removeEventListener('wheel', handleWheel);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      scrollMomentumRef.current = 0;
    };
  }, [albums.length, onIndexChange, scrollThreshold]);

  return (
    <div 
      ref={containerRef}
      className="absolute right-0 top-0 h-full w-full md:w-1/2 flex flex-col justify-center items-end pr-8 md:pr-16 z-10 select-none"
    >
        {/* Navigation Indicators */}
        <div className="absolute right-8 top-1/2 -translate-y-1/2 translate-x-12 hidden md:flex flex-col gap-4 text-white/30">
            <button onClick={() => onIndexChange(Math.max(0, activeIndex - 1))} className="hover:text-white transition-colors">
                <ChevronUp />
            </button>
            <div className="w-px h-12 bg-white/20 mx-auto" />
            <button onClick={() => onIndexChange(Math.min(albums.length - 1, activeIndex + 1))} className="hover:text-white transition-colors">
                <ChevronDown />
            </button>
        </div>

      <div className="relative h-[600px] w-full flex flex-col items-end justify-center perspective-1000">
        {albums.map((album, index) => {
          const distance = index - activeIndex;
          const isActive = index === activeIndex;
          const featuredTrack = album.tracks[0];

          // Only render albums within a certain range to save resources
          if (Math.abs(distance) > 3) return null;

          return (
            <motion.div
              key={album.id}
              layout
              initial={false}
              animate={{
                y: distance * 120, // Vertical spacing
                x: isActive ? -40 : distance * 20, // Horizontal offset
                scale: isActive ? 1.1 : 1 - Math.abs(distance) * 0.15,
                opacity: isActive ? 1 : 1 - Math.abs(distance) * 0.4,
                zIndex: 10 - Math.abs(distance),
                rotateX: distance * -10, // 3D tilt
                rotateY: isActive ? -5 : -15,
                filter: isActive ? 'brightness(1.1)' : 'brightness(0.5) blur(2px)',
              }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 20,
              }}
              onClick={() => isActive ? onSelect(album) : onIndexChange(index)}
              className="absolute origin-right cursor-pointer group"
              style={{
                width: '300px',
                height: '300px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Vinyl Record Visual (peeking out) */}
              <div className={`absolute top-2 bottom-2 right-2 w-full rounded-full bg-black shadow-2xl transition-transform duration-700 ease-out ${isActive ? 'translate-x-12 rotate-12' : 'translate-x-2'}`}>
                  <div className="absolute inset-0 rounded-full border-4 border-gray-800 opacity-50" />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 rounded-full" style={{ backgroundColor: album.secondaryColor }} />
              </div>

              {/* Album Cover */}
              <div className="relative w-full h-full shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-gray-900 overflow-hidden rounded-md border-t border-white/10">
                <img 
                  src={album.coverUrl} 
                  alt={album.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                
                {/* Active Overlay Glow */}
                {isActive && (
                  <motion.div 
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none mix-blend-overlay"
                  />
                )}
              </div>

              {/* Label (Visible on hover or active) */}
              <motion.div 
                className="absolute -left-full top-1/2 -translate-y-1/2 text-right pr-8 min-w-[300px]"
                animate={{
                    opacity: isActive ? 1 : 0,
                    x: isActive ? 0 : 50
                }}
              >
                  <h2 className="text-4xl md:text-6xl font-display font-bold text-white tracking-tighter drop-shadow-lg">
                    {album.title}
                  </h2>
                  <p className="text-lg md:text-xl text-white/70 font-light mt-2 tracking-widest uppercase">
                    {album.artist}
                  </p>
                  {isActive && featuredTrack && (
                    <div className="mt-4 inline-flex items-center gap-2 px-3 py-2 rounded-full bg-black/60 border border-white/10 backdrop-blur-sm text-white/80 text-sm">
                      <span className="uppercase tracking-[0.25em] text-[10px] text-white/50">Track</span>
                      <span className="font-semibold text-white">{featuredTrack.title}</span>
                      <span className="text-white/50 font-mono text-xs">{featuredTrack.duration}</span>
                    </div>
                  )}
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};
