export type TabType = 
  | 'home'
  | 'thumbnails'
  | 'titles'
  | 'descriptions'
  | 'posters'
  | 'shorts'
  | 'branding'
  | 'projects'
  | 'settings';

export interface ProjectItem {
  id: string;
  title: string;
  type: 'thumbnail' | 'title' | 'description' | 'poster' | 'shorts' | 'logo' | 'banner';
  createdAt: number;
  previewUrl?: string;
  data: any;
  tags?: string[];
  dimensions?: string;
}

export interface ThumbnailState {
  mainTitle: string;
  subtitle: string;
  highlightWord: string;
  game: string;
  preset: string;
  player1: string;
  player2: string;
  player1Image?: string;
  player2Image?: string;
  backgroundImage?: string;
  backgroundTheme: 'cyber_stadium' | 'neon_arena' | 'gold_glory' | 'red_inferno' | 'electric_blue' | 'custom';
  fontFamily: 'Chakra Petch' | 'Orbitron' | 'Teko' | 'Impact';
  textColor: string;
  glowColor: string;
  textAngle: number;
  badge: 'NONE' | '99_OVR' | 'VS' | 'INSANE' | 'NEW_META' | '100K' | 'FINAL' | 'SECRET';
  secondaryBadge: 'NONE' | 'FIRE' | 'CONTROLLER' | 'YOUTUBE_PLAY' | 'ELECTRIC' | 'CR7_SIUU';
  showVsBadge: boolean;
  contrastBoost: number;
  vignette: boolean;
  watermark: boolean;
}

export interface PosterState {
  matchTitle: string;
  tournamentName: string;
  team1: string;
  team2: string;
  team1Score?: string;
  team2Score?: string;
  date: string;
  time: string;
  venue: string;
  prizePool: string;
  layout: 'match_day' | 'tournament_cup' | 'player_spotlight';
  theme: 'neon_champions' | 'dark_esports' | 'golden_trophy' | 'cyber_purple';
  backgroundImage?: string;
}

export interface ShortsState {
  headline: string;
  subheadline: string;
  game: string;
  layout: 'split_vs' | 'facecam_gameplay' | 'hype_reaction' | 'quote_stat';
  player1: string;
  player2: string;
  badgeText: string;
  accentColor: string;
  facecamImage?: string;
  gameplayImage?: string;
  outroCTA: string;
}

export interface LogoState {
  brandName: string;
  slogan: string;
  mascot: 'star_ball' | 'shield_controller' | 'lightning_boot' | 'crown_fire' | 'cyber_wolf';
  primaryColor: string;
  secondaryColor: string;
  badgeStyle: 'shield' | 'hexagon' | 'circle_ring' | 'diamond';
  format: 'logo_square' | 'pfp_circle' | 'yt_banner';
  backgroundImage?: string;
}

export interface StudioSettings {
  channelName: string;
  channelTagline: string;
  defaultGame: string;
  creatorWatermark: boolean;
  androidFrameMode: boolean; // toggle between device bezel and full viewport
  textModel: string;
  imageModel: string;
  stylePreset: string;
}
