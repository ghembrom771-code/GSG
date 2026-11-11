import { ProjectItem, StudioSettings } from '../types';

const STORAGE_KEY_PROJECTS = 'goalstar_studio_projects_v1';
const STORAGE_KEY_SETTINGS = 'goalstar_studio_settings_v1';

export const DEFAULT_SETTINGS: StudioSettings = {
  channelName: 'GOALSTAR GAMING',
  channelTagline: 'UNLEASH THE GOAL',
  defaultGame: 'EA Sports FC 25',
  creatorWatermark: true,
  androidFrameMode: false, // Default to clean responsive edge-to-edge mobile view with frame toggle available
  textModel: 'gemini-3.8-flash',
  imageModel: 'gemini-3.1-flash-lite-image',
  stylePreset: 'esports',
};

export const INITIAL_PROJECTS: ProjectItem[] = [
  {
    id: 'proj-cr7-mbappe-epic',
    title: 'CR7 VS MBAPPE 99 SPEED SHOWDOWN',
    type: 'thumbnail',
    createdAt: Date.now() - 3600000 * 24 * 2,
    dimensions: '1280 × 720 HD',
    tags: ['#Ronaldo', '#Mbappe', '#EAFC25', '#ViralThumbnail'],
    data: {
      mainTitle: 'RONALDO VS MBAPPE',
      subtitle: 'WHO IS FASTER IN FC 25?',
      player1: 'CR7',
      player2: 'MBAPPE',
      badge: '99_OVR',
      backgroundTheme: 'cyber_stadium',
    },
  },
  {
    id: 'proj-titles-fifa',
    title: 'Viral Title Pack: 100-0 Weekend League',
    type: 'title',
    createdAt: Date.now() - 3600000 * 12,
    tags: ['#Titles', '#HighCTR', '#SecretGlitch'],
    data: {
      titles: [
        '🔥 RONALDO VS MBAPPE 99 SPEED SHOWDOWN! (eFootball 2025)',
        'I UNLOCKED THE SECRET 105 RATED CR7! INSANE PACK OPENING!',
        'THEY SAID HE WAS WASHED... THEN THIS HAPPENED 😱',
        'CAN ANYONE STOP THIS SQUAD? 100-0 IN WEEKEND LEAGUE!',
      ],
    },
  },
  {
    id: 'proj-poster-grand-final',
    title: 'Grand Champions Esports Cup Poster',
    type: 'poster',
    createdAt: Date.now() - 3600000 * 48,
    dimensions: '1080 × 1350',
    tags: ['#EsportsPoster', '#MadridVsCity', '#LiveTournament'],
    data: {
      tournamentName: 'GOALSTAR WORLD TOUR 2025',
      matchTitle: 'GRAND CHAMPIONS ESPORTS CUP',
      team1: 'REAL MADRID ESPORTS',
      team2: 'MANCHESTER CITY GAMING',
      prizePool: '$25,000 USD',
    },
  },
  {
    id: 'proj-logo-branding',
    title: 'GOALSTAR GAMING Official Logo & PFP',
    type: 'logo',
    createdAt: Date.now() - 3600000 * 72,
    dimensions: '800 × 800',
    tags: ['#ChannelLogo', '#Branding', '#CyberShield'],
    data: {
      brandName: 'GOALSTAR GAMING',
      slogan: 'UNLEASH THE GOAL',
      mascot: 'star_ball',
      primaryColor: '#00F0FF',
    },
  },
];

export function getStoredProjects(): ProjectItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      saveProjects(INITIAL_PROJECTS);
      return INITIAL_PROJECTS;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load projects from storage', err);
    return INITIAL_PROJECTS;
  }
}

export function saveProjects(projects: ProjectItem[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Failed to save projects to storage', err);
  }
}

export function addProject(project: Omit<ProjectItem, 'id' | 'createdAt'>): ProjectItem {
  const all = getStoredProjects();
  const newItem: ProjectItem = {
    ...project,
    id: `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    createdAt: Date.now(),
  };
  const updated = [newItem, ...all];
  saveProjects(updated);
  return newItem;
}

export function deleteProject(id: string): ProjectItem[] {
  const all = getStoredProjects();
  const updated = all.filter((p) => p.id !== id);
  saveProjects(updated);
  return updated;
}

export function getStoredSettings(): StudioSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: StudioSettings): void {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (err) {
    console.error('Failed to save settings', err);
  }
}
