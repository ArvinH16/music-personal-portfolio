export interface Track {
  title: string;
  duration: string;
  audioUrl?: string; // Optional for now, but used for the preview
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  year: string;
  coverUrl: string;
  description: string;
  primaryColor: string; // Used for 3D light/mesh
  secondaryColor: string; // Used for accents
  tracks: Track[];
}

export interface ThemeColors {
  primary: string;
  secondary: string;
}