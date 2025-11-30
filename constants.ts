import { Album } from './types';

// Using SoundHelix for reliable creative commons audio testing
// Images are generated via unique seeds to specific themes

export const ALBUMS: Album[] = [
  {
    id: '1',
    title: 'Neon Horizon',
    artist: 'Cyber Pulse',
    year: '2024',
    // Seed 'neon' ensures a cyberpunk/neon vibe
    coverUrl: 'https://picsum.photos/seed/neon-horizon-v2/800/800', 
    description: 'A pulsating journey through the digital ether. Deep saw waves and retro-futuristic arpeggios define this synthwave masterpiece.',
    primaryColor: '#d946ef', // Fuchsia
    secondaryColor: '#4f46e5', // Indigo
    tracks: [
      { 
        title: 'Cyber Chase (Preview)', 
        duration: '0:30',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3' 
      },
      { title: 'Digital Rain', duration: '4:12' },
      { title: 'Mainframe Access', duration: '3:30' },
    ],
  },
  {
    id: '2',
    title: 'Organic Drift',
    artist: 'Terra Nova',
    year: '2023',
    // Seed 'nature' or 'earth' for organic textures
    coverUrl: 'https://picsum.photos/seed/organic-drift-v2/800/800',
    description: 'Lo-fi beats meets field recordings. A textural experience designed for deep focus and relaxation.',
    primaryColor: '#10b981', // Emerald
    secondaryColor: '#fcd34d', // Amber
    tracks: [
      { 
        title: 'Forest Floor (Preview)', 
        duration: '0:30', 
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3'
      },
      { title: 'Canopy Light', duration: '2:58' },
      { title: 'River Stone', duration: '4:15' },
    ],
  },
  {
    id: '3',
    title: 'Abyssal Echoes',
    artist: 'Deep State',
    year: '2022',
    // Seed 'water' or 'abstract'
    coverUrl: 'https://picsum.photos/seed/abyssal-echoes-v3/800/800',
    description: 'Dark ambient soundscapes from the bottom of the ocean. Heavy reverb, slow attacks, and crushing sub-bass.',
    primaryColor: '#3b82f6', // Blue
    secondaryColor: '#1e3a8a', // Dark Blue
    tracks: [
      { 
        title: 'Submarine (Preview)', 
        duration: '0:30',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3'
      },
      { title: 'Pressure', duration: '5:45' },
      { title: 'Bioluminescence', duration: '4:30' },
    ],
  },
  {
    id: '4',
    title: 'Solar Flare',
    artist: 'Helios',
    year: '2021',
    // Seed 'fire' or 'red'
    coverUrl: 'https://picsum.photos/seed/solar-flare-v1/800/800',
    description: 'High energy experimental electronic. Glitchy percussion, distorted leads, and chaotic rhythms.',
    primaryColor: '#f97316', // Orange
    secondaryColor: '#991b1b', // Red
    tracks: [
      { 
        title: 'Ignition (Preview)', 
        duration: '0:30',
        audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'
      },
      { title: 'Corona', duration: '3:10' },
      { title: 'Magnetic Storm', duration: '4:00' },
    ],
  },
];