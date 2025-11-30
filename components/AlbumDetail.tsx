import React from 'react';
import { motion } from 'framer-motion';
import { X, Play, Pause, Heart, Share2, Volume2 } from 'lucide-react';
import { Album, Track } from '../types';

interface AlbumDetailProps {
  album: Album | null;
  isOpen: boolean;
  onClose: () => void;
  onPlay: (track: Track) => void;
  isPlaying: boolean;
  currentTrack: Track | null;
}

export const AlbumDetail: React.FC<AlbumDetailProps> = ({ 
  album, 
  isOpen, 
  onClose,
  onPlay,
  isPlaying,
  currentTrack
}) => {
  if (!album) return null;

  // For the "Play Album" button, we just play the first track
  const handleMainPlay = () => {
    if (album.tracks.length > 0) {
      onPlay(album.tracks[0]);
    }
  };

  const isAlbumPlaying = currentTrack && album.tracks.some(t => t.title === currentTrack.title) && isPlaying;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        />
      )}

      {/* Modal Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: isOpen ? '0%' : '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-[600px] z-50 bg-[#0a0a0a] border-l border-white/10 shadow-2xl overflow-y-auto"
      >
        <div className="relative p-8 md:p-12">
          {/* Close Button */}
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full bg-white/5 hover:bg-white/10 text-white transition-colors"
          >
            <X size={24} />
          </button>

          {/* Header */}
          <div className="mt-8 mb-12">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isOpen ? 1 : 0, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-sm font-bold tracking-[0.2em] text-white/50 uppercase"
            >
              Selected Work / {album.year}
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isOpen ? 1 : 0, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-display font-bold mt-4 leading-[0.9]"
              style={{ color: album.primaryColor }}
            >
              {album.title}
            </motion.h2>
            
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ delay: 0.4 }}
                className="mt-6 flex gap-4"
            >
                <button 
                  onClick={handleMainPlay}
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                >
                    {isAlbumPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
                    {isAlbumPlaying ? 'Pause' : 'Play Preview'}
                </button>
                <button className="p-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
                    <Heart size={18} />
                </button>
                <button className="p-3 rounded-full border border-white/20 hover:bg-white/10 transition-colors">
                    <Share2 size={18} />
                </button>
            </motion.div>
          </div>

          {/* Cover & Description */}
          <motion.div
             initial={{ opacity: 0, scale: 0.95 }}
             animate={{ opacity: isOpen ? 1 : 0, scale: 1 }}
             transition={{ delay: 0.4 }}
             className="flex flex-col md:flex-row gap-8 items-start mb-12"
          >
              <div className="relative group">
                <img 
                    src={album.coverUrl} 
                    alt={album.title} 
                    className="w-32 h-32 md:w-48 md:h-48 rounded-lg shadow-lg object-cover"
                />
                {/* Visualizer indication if playing */}
                {isAlbumPlaying && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                        <div className="flex gap-1 items-end h-8">
                            <motion.div animate={{ height: [10, 24, 10] }} transition={{ repeat: Infinity, duration: 0.5 }} className="w-1 bg-white" />
                            <motion.div animate={{ height: [14, 32, 14] }} transition={{ repeat: Infinity, duration: 0.4 }} className="w-1 bg-white" />
                            <motion.div animate={{ height: [8, 20, 8] }} transition={{ repeat: Infinity, duration: 0.6 }} className="w-1 bg-white" />
                        </div>
                    </div>
                )}
              </div>
              <p className="text-lg text-white/70 leading-relaxed font-light">
                  {album.description}
              </p>
          </motion.div>

          {/* Tracklist */}
          <div className="space-y-2">
            <h3 className="text-xl font-bold mb-6 border-b border-white/10 pb-4">Tracklist</h3>
            {album.tracks.map((track, i) => {
              const isTrackPlaying = isPlaying && currentTrack?.title === track.title;
              const hasAudio = !!track.audioUrl;

              return (
                <motion.div
                    key={i}
                    onClick={() => hasAudio && onPlay(track)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: isOpen ? 1 : 0, x: 0 }}
                    transition={{ delay: 0.5 + i * 0.1 }}
                    className={`group flex items-center justify-between p-4 rounded-lg transition-colors ${
                        isTrackPlaying ? 'bg-white/10' : 'hover:bg-white/5'
                    } ${hasAudio ? 'cursor-pointer' : 'cursor-default opacity-50'}`}
                >
                    <div className="flex items-center gap-4">
                    <span className="text-white/30 font-mono text-sm w-6">
                        {isTrackPlaying ? <Volume2 size={14} className="animate-pulse text-white" /> : (i + 1).toString().padStart(2, '0')}
                    </span>
                    <span className={`text-lg font-medium transition-colors ${isTrackPlaying ? 'text-white' : 'text-white/80 group-hover:text-white'}`}>
                        {track.title}
                    </span>
                    </div>
                    <span className="text-white/30 font-mono text-sm">{track.duration}</span>
                </motion.div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="mt-16 pt-8 border-t border-white/10 flex gap-6 text-white/40">
              <a href="#" className="hover:text-white transition-colors">Spotify</a>
              <a href="#" className="hover:text-white transition-colors">Apple Music</a>
              <a href="#" className="hover:text-white transition-colors">Bandcamp</a>
              <a href="#" className="hover:text-white transition-colors">SoundCloud</a>
          </div>
        </div>
      </motion.div>
    </>
  );
};