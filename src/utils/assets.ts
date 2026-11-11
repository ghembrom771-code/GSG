/**
 * Built-in gaming graphics, presets, and vector rendering helpers
 * for GOALSTAR GAMING STUDIO
 */

export const PRESET_THUMBNAILS = [
  {
    id: 'preset-ronaldo-mbappe',
    name: 'Ronaldo vs Mbappe 99 Pace',
    mainTitle: 'RONALDO VS MBAPPE',
    subtitle: 'WHO IS FASTER IN FC 25?',
    highlightWord: '99 SPEED',
    game: 'EA Sports FC 25',
    player1: 'CR7',
    player2: 'MBAPPE',
    badge: '99_OVR' as const,
    secondaryBadge: 'FIRE' as const,
    backgroundTheme: 'cyber_stadium' as const,
    textColor: '#FFFFFF',
    glowColor: '#00F0FF',
  },
  {
    id: 'preset-weekend-league',
    name: '100-0 Unbeatable Weekend League',
    mainTitle: '100-0 UNBEATABLE SQUAD',
    subtitle: 'SECRET META FORMATION REVEALED',
    highlightWord: 'INSANE',
    game: 'EA Sports FC 25',
    player1: 'HAALAND',
    player2: 'VINICIUS',
    badge: 'INSANE' as const,
    secondaryBadge: 'ELECTRIC' as const,
    backgroundTheme: 'red_inferno' as const,
    textColor: '#FFE600',
    glowColor: '#FF0055',
  },
  {
    id: 'preset-secret-pack',
    name: 'Secret 105 OVR Pack Opening',
    mainTitle: 'SECRET 105 ICON PACK',
    subtitle: 'MY REACTION BROKE THE MIC!',
    highlightWord: 'OMG!',
    game: 'eFootball 2025',
    player1: 'MESSI',
    player2: 'CR7',
    badge: 'SECRET' as const,
    secondaryBadge: 'CR7_SIUU' as const,
    backgroundTheme: 'gold_glory' as const,
    textColor: '#FFFFFF',
    glowColor: '#FFD700',
  },
  {
    id: 'preset-90th-winner',
    name: '90th Min Impossible Free Kick',
    mainTitle: '90TH MIN IMPOSSIBLE GOAL',
    subtitle: 'WORST SCRIPTING EVER?!',
    highlightWord: 'HOW?!',
    game: 'FIFA World Cup',
    player1: 'BELLINGHAM',
    player2: 'YAMAL',
    badge: 'NEW_META' as const,
    secondaryBadge: 'YOUTUBE_PLAY' as const,
    backgroundTheme: 'neon_arena' as const,
    textColor: '#00F0FF',
    glowColor: '#A855F7',
  },
];

export const PRESET_POSTERS = [
  {
    id: 'poster-cl-final',
    name: 'Grand Champions Cup Final',
    matchTitle: 'GRAND CHAMPIONS ESPORTS CUP',
    tournamentName: 'GOALSTAR WORLD TOUR 2025',
    team1: 'REAL MADRID ESPORTS',
    team2: 'MANCHESTER CITY GAMING',
    date: 'SATURDAY 15 NOV',
    time: '20:00 UTC',
    venue: 'CYBER STADIUM ARENA',
    prizePool: '$25,000 USD',
    layout: 'match_day' as const,
    theme: 'neon_champions' as const,
  },
  {
    id: 'poster-super-clasico',
    name: 'El Clasico Gaming Showdown',
    matchTitle: 'EL CLASICO CYBER DERBY',
    tournamentName: 'ULTIMATE RIVALRY LEAGUE',
    team1: 'FC BARCELONA ESPORTS',
    team2: 'REAL MADRID ESPORTS',
    date: 'SUNDAY 16 NOV',
    time: '19:30 UTC',
    venue: 'CAMP NOU CYBER DOME',
    prizePool: '$10,000 PRIZE POOL',
    layout: 'tournament_cup' as const,
    theme: 'cyber_purple' as const,
  },
];

export const PRESET_SHORTS = [
  {
    id: 'short-ronaldo-curve',
    headline: 'RONALDO BROKE THE ENGINE! 🤯',
    subheadline: 'Can you score this 45m curve in FC 25?',
    game: 'EA FC 25',
    layout: 'split_vs' as const,
    player1: 'CR7',
    player2: 'GOALKEEPER',
    badgeText: '99 CURVE',
    accentColor: '#00F0FF',
    outroCTA: 'SUBSCRIBE FOR DAILY GOALS! 🔥',
  },
  {
    id: 'short-speed-test',
    headline: 'WHO IS TRULY FASTER? ⚡',
    subheadline: '99 Mbappe vs 99 Walker in a 100m sprint!',
    game: 'eFootball 2025',
    layout: 'hype_reaction' as const,
    player1: 'MBAPPE',
    player2: 'WALKER',
    badgeText: 'SPEED TEST',
    accentColor: '#FF007A',
    outroCTA: 'DROP YOUR GUESS IN COMMENTS! 👇',
  },
];

export const PRESET_LOGOS = [
  {
    id: 'logo-goalstar-main',
    brandName: 'GOALSTAR GAMING',
    slogan: 'UNLEASH THE GOAL',
    mascot: 'star_ball' as const,
    primaryColor: '#00F0FF',
    secondaryColor: '#B026FF',
    badgeStyle: 'shield' as const,
    format: 'logo_square' as const,
  },
  {
    id: 'logo-goalstar-esports',
    brandName: 'GOALSTAR ESPORTS',
    slogan: 'BORN TO WIN',
    mascot: 'shield_controller' as const,
    primaryColor: '#FFE600',
    secondaryColor: '#FF0055',
    badgeStyle: 'hexagon' as const,
    format: 'pfp_circle' as const,
  },
];

// Helper to generate procedural SVG player silhouettes with dramatic neon glows
export function generatePlayerSilhouette(player: string, color: string = '#00F0FF'): string {
  const isRonaldo = player.toUpperCase().includes('RONALDO') || player.toUpperCase().includes('CR7');
  const isMbappe = player.toUpperCase().includes('MBAPPE');
  
  if (isRonaldo) {
    // Iconic CR7 Jump / Siuuu / Striking pose vector
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
      <defs>
        <linearGradient id="gradR" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${encodeURIComponent(color)}" stop-opacity="1" />
          <stop offset="100%" stop-color="#7928CA" stop-opacity="0.8" />
        </linearGradient>
        <filter id="glowR">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <!-- Background aura -->
      <circle cx="200" cy="180" r="140" fill="${encodeURIComponent(color)}" opacity="0.15" filter="url(%23glowR)"/>
      <path d="M120 580 L180 380 L140 280 L170 180 L200 120 L230 180 L260 280 L220 380 L280 580 Z" fill="url(%23gradR)" opacity="0.25"/>
      <!-- Torso & Athletic Build -->
      <path d="M165 170 C165 140, 235 140, 235 170 L255 270 C240 330, 160 330, 145 270 Z" fill="url(%23gradR)" filter="url(%23glowR)"/>
      <!-- Head & Chin -->
      <circle cx="200" cy="120" r="32" fill="#FFFFFF"/>
      <path d="M185 105 Q200 90 215 105 Q220 95 200 90 Q180 95 185 105" fill="#111827"/>
      <!-- Arms in Iconic Spread Siu / Sprint pose -->
      <path d="M165 180 L90 240 L60 290 L75 300 L110 260 L160 210 Z" fill="url(%23gradR)"/>
      <path d="M235 180 L310 240 L340 290 L325 300 L290 260 L240 210 Z" fill="url(%23gradR)"/>
      <!-- Jersey Number 7 -->
      <text x="200" y="245" font-family="'Orbitron', sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" filter="url(%23glowR)">7</text>
      <!-- Legs & Stride -->
      <path d="M170 320 L150 440 L130 540 L160 550 L185 450 L195 330 Z" fill="url(%23gradR)"/>
      <path d="M230 320 L250 440 L280 530 L255 545 L225 440 L205 330 Z" fill="url(%23gradR)"/>
      <!-- Cyber Aura Accents -->
      <circle cx="200" cy="300" r="160" stroke="${encodeURIComponent(color)}" stroke-width="2" stroke-dasharray="10 15" fill="none" opacity="0.6"/>
      <text x="200" y="585" font-family="'Teko', sans-serif" font-weight="700" font-size="36" fill="${encodeURIComponent(color)}" text-anchor="middle" letter-spacing="4">CR7 • EL BICHO</text>
    </svg>`;
  }

  if (isMbappe) {
    // Dynamic Speed Sprint Mbappe silhouette
    return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
      <defs>
        <linearGradient id="gradM" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="${encodeURIComponent(color)}" stop-opacity="1" />
          <stop offset="100%" stop-color="#00F0FF" stop-opacity="0.8" />
        </linearGradient>
        <filter id="glowM">
          <feGaussianBlur stdDeviation="8" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <!-- Speed streaks -->
      <line x1="20" y1="200" x2="380" y2="180" stroke="${encodeURIComponent(color)}" stroke-width="3" opacity="0.4"/>
      <line x1="40" y1="260" x2="360" y2="240" stroke="#00F0FF" stroke-width="2" opacity="0.6"/>
      <line x1="10" y1="320" x2="390" y2="300" stroke="${encodeURIComponent(color)}" stroke-width="4" opacity="0.3"/>
      <!-- Leaning forward sprint pose -->
      <circle cx="230" cy="130" r="30" fill="#FFFFFF"/>
      <path d="M210 115 Q230 100 250 115 Z" fill="#111827"/>
      <!-- Torso in forward angle -->
      <path d="M190 170 C190 145, 260 145, 260 170 L280 280 C260 320, 180 320, 170 280 Z" fill="url(%23gradM)" filter="url(%23glowM)"/>
      <!-- Arms crossed folded iconic celebration or sprint -->
      <path d="M185 190 L120 220 L150 270 L210 240 Z" fill="url(%23gradM)"/>
      <path d="M260 190 L320 230 L290 280 L240 240 Z" fill="url(%23gradM)"/>
      <!-- Jersey 9 or 10 -->
      <text x="225" y="245" font-family="'Orbitron', sans-serif" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="middle" filter="url(%23glowM)">9</text>
      <!-- Sprinting Legs -->
      <path d="M190 310 L140 420 L80 500 L110 520 L170 430 L205 320 Z" fill="url(%23gradM)"/>
      <path d="M240 310 L290 380 L350 490 L320 510 L270 410 L225 320 Z" fill="url(%23gradM)"/>
      <!-- Cyber Ring -->
      <circle cx="230" cy="300" r="160" stroke="${encodeURIComponent(color)}" stroke-width="2" stroke-dasharray="8 12" fill="none" opacity="0.6"/>
      <text x="200" y="585" font-family="'Teko', sans-serif" font-weight="700" font-size="36" fill="${encodeURIComponent(color)}" text-anchor="middle" letter-spacing="4">MBAPPÉ • TURBO 99</text>
    </svg>`;
  }

  // Generic Star Player (Haaland / Bellingham / Messi / Pro Esports Gamer)
  return `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
    <defs>
      <linearGradient id="gradGen" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${encodeURIComponent(color)}" stop-opacity="1" />
        <stop offset="100%" stop-color="#3B82F6" stop-opacity="0.8" />
      </linearGradient>
    </defs>
    <circle cx="200" cy="130" r="32" fill="#FFFFFF"/>
    <path d="M160 170 C160 140, 240 140, 240 170 L255 280 C240 330, 160 330, 145 280 Z" fill="url(%23gradGen)"/>
    <path d="M160 180 L100 250 L120 280 L170 220 Z" fill="url(%23gradGen)"/>
    <path d="M240 180 L300 250 L280 280 L230 220 Z" fill="url(%23gradGen)"/>
    <text x="200" y="245" font-family="'Orbitron', sans-serif" font-weight="900" font-size="40" fill="#FFFFFF" text-anchor="middle">10</text>
    <path d="M170 320 L150 440 L130 530 L160 540 L195 330 Z" fill="url(%23gradGen)"/>
    <path d="M230 320 L250 440 L270 530 L240 540 L205 330 Z" fill="url(%23gradGen)"/>
    <text x="200" y="585" font-family="'Teko', sans-serif" font-weight="700" font-size="34" fill="${encodeURIComponent(color)}" text-anchor="middle" letter-spacing="4">${encodeURIComponent(player.toUpperCase())}</text>
  </svg>`;
}
