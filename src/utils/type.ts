export enum UserRole {
  ADMIN = 'admin',
  USER = 'user'
}

export enum ArtistRole {
  SINGER = 'singer',
  COMPOSER = 'composer',
  SINGER_COMPOSER = 'singer_composer'
}

export interface SongArtist {
  id?: number;
  songId: number;
  artistId: number;
  role: ArtistRole;
}

export interface Artist {
  id: string;
  name: string;
  imageUrl: string;
  role: ArtistRole;
  bio: string;
}

export interface Song {
  id: string;
  title: string;
  singerId: string;
  composerId: string;
  lyrics: string;
  about: string; // AI generated meaning
  releaseYear: string;
  coverUrl: string;
}

export type ViewState = 
  | 'USER_HOME' 
  | 'USER_SEARCH' 
  | 'USER_SONG_DETAIL' 
  | 'USER_ARTIST_DETAIL'
  | 'ADMIN_DASHBOARD'
  | 'ADMIN_SONGS'
  | 'ADMIN_ARTISTS';

export interface AppState {
  view: ViewState;
  selectedId: string | null; // For details view
  artists: Artist[];
  songs: Song[];
}