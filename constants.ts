import { Album } from './types';

// Albums reference local audio kept in /public/songs; cover images use seeded picsum URLs for consistency.

export const ALBUMS: Album[] = [
  {
    id: 'pendulum',
    title: 'Pendulum of Thoughts',
    artist: 'Arvin Hakakian',
    year: '2024',
    // Seeded cover keeps things consistent across refreshes
    coverUrl: 'https://picsum.photos/seed/pendulum-of-thoughts/800/800', 
    description: 'An introspective electronic piece that balances delicate melodies with a pulsing low end.',
    primaryColor: '#38bdf8', // Sky
    secondaryColor: '#0ea5e9', // Cyan
    tracks: [
      { 
        title: 'Pendulum of Thoughts', 
        duration: '2:40',
        audioUrl: '/songs/pendulum-of-thoughts.mp3' 
      },
      { title: 'Threaded Logic', duration: '3:05' },
      { title: 'Late Night Draft', duration: '2:12' },
    ],
  },
  {
    id: 'project108',
    title: 'Project 108',
    artist: 'Arvin Hakakian',
    year: '2023',
    coverUrl: 'https://picsum.photos/seed/project-108/800/800',
    description: 'A driving, rhythmic exploration that layers synth plucks over a steady groove.',
    primaryColor: '#f97316', // Orange
    secondaryColor: '#fb923c', // Light Orange
    tracks: [
      { 
        title: 'Project 108 (v3)', 
        duration: '4:17', 
        audioUrl: '/songs/project-108-v3.mp3'
      },
      { title: 'Harmonic Steps', duration: '3:42' },
      { title: 'Sunset Loop', duration: '2:54' },
    ],
  },
  {
    id: 'project119',
    title: 'Project 119',
    artist: 'Arvin Hakakian',
    year: '2023',
    coverUrl: 'https://picsum.photos/seed/project-119/800/800',
    description: 'Glassy keys and emotive pads float above a patient, evolving rhythm.',
    primaryColor: '#22d3ee', // Cyan
    secondaryColor: '#0ea5e9', // Sky
    tracks: [
      { 
        title: 'Project 119', 
        duration: '2:54',
        audioUrl: '/songs/project-119.m4a'
      },
      { title: 'Sway Lines', duration: '3:11' },
      { title: 'Quiet Flash', duration: '2:22' },
    ],
  },
  {
    id: 'projectRoot',
    title: 'Project Root',
    artist: 'Arvin Hakakian',
    year: '2022',
    coverUrl: 'https://picsum.photos/seed/project-root/800/800',
    description: 'Cinematic pulses and swelling synth brass that build toward a widescreen payoff.',
    primaryColor: '#a855f7', // Violet
    secondaryColor: '#6366f1', // Indigo
    tracks: [
      { 
        title: 'Project Root v2', 
        duration: '4:36',
        audioUrl: '/songs/project-root-v2.mp3'
      },
      { title: 'Wide Awake', duration: '3:58' },
      { title: 'Overland', duration: '3:26' },
    ],
  },
];
