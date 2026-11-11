import { ThumbnailState, PosterState, ShortsState, LogoState } from '../types';
import { generatePlayerSilhouette } from './assets';

// Helper to load an image from url/dataUrl as HTMLImageElement
export function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(e);
    img.src = src;
  });
}

// Draw the 1280x720 YouTube Thumbnail
export async function renderThumbnailCanvas(
  canvas: HTMLCanvasElement,
  state: ThumbnailState,
  options?: { channelName?: string }
): Promise<string> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const width = 1280;
  const height = 720;
  canvas.width = width;
  canvas.height = height;

  // 1. Draw Background
  if (state.backgroundImage) {
    try {
      const bgImg = await loadImage(state.backgroundImage);
      ctx.drawImage(bgImg, 0, 0, width, height);
      // Dark gradient overlay for text readability
      const grad = ctx.createLinearGradient(0, 0, 0, height);
      grad.addColorStop(0, 'rgba(6, 8, 18, 0.4)');
      grad.addColorStop(1, 'rgba(6, 8, 18, 0.85)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);
    } catch {
      drawProceduralBackground(ctx, state.backgroundTheme, width, height);
    }
  } else {
    drawProceduralBackground(ctx, state.backgroundTheme, width, height);
  }

  // 2. Draw Left Player (e.g. Ronaldo or Player 1)
  try {
    let p1Img: HTMLImageElement;
    if (state.player1Image) {
      p1Img = await loadImage(state.player1Image);
    } else {
      const svgUrl = generatePlayerSilhouette(state.player1 || 'CR7', '#00F0FF');
      p1Img = await loadImage(svgUrl);
    }
    // Draw player with cyan rim glow
    ctx.save();
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 25;
    ctx.drawImage(p1Img, 40, 100, 420, 580);
    ctx.restore();
  } catch (err) {
    console.warn('Failed to load player 1 image', err);
  }

  // 3. Draw Right Player (e.g. Mbappe or Player 2)
  try {
    let p2Img: HTMLImageElement;
    if (state.player2Image) {
      p2Img = await loadImage(state.player2Image);
    } else {
      const svgUrl = generatePlayerSilhouette(state.player2 || 'MBAPPE', '#B026FF');
      p2Img = await loadImage(svgUrl);
    }
    // Draw player with purple/magenta rim glow
    ctx.save();
    ctx.shadowColor = '#B026FF';
    ctx.shadowBlur = 25;
    ctx.drawImage(p2Img, 820, 100, 420, 580);
    ctx.restore();
  } catch (err) {
    console.warn('Failed to load player 2 image', err);
  }

  // 4. Center VS Badge
  if (state.showVsBadge) {
    drawVsBadge(ctx, width / 2, height / 2 - 20);
  }

  // 5. Draw 99 OVR or Main Badge
  if (state.badge && state.badge !== 'NONE') {
    drawTopBadge(ctx, state.badge, width / 2, 70);
  }

  // 6. Draw Main Title with 3D Gaming Stroke & Neon Glow
  ctx.save();
  ctx.translate(width / 2, height - 120);
  if (state.textAngle !== 0) {
    ctx.rotate((state.textAngle * Math.PI) / 180);
  }

  // Title background pill/plate for ultra-high contrast
  const titleText = (state.mainTitle || 'RONALDO VS MBAPPE').toUpperCase();
  ctx.font = `900 68px '${state.fontFamily || 'Chakra Petch'}', sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const textMetrics = ctx.measureText(titleText);
  const textWidth = textMetrics.width;

  // Dark plate behind text
  ctx.fillStyle = 'rgba(6, 8, 18, 0.85)';
  ctx.strokeStyle = state.glowColor || '#00F0FF';
  ctx.lineWidth = 4;
  ctx.beginPath();
  const px = -textWidth / 2 - 30;
  const py = -45;
  const pw = textWidth + 60;
  const ph = 90;
  ctx.roundRect(px, py, pw, ph, 16);
  ctx.fill();
  ctx.stroke();

  // Outer glow and thick black stroke for 3D depth
  ctx.shadowColor = state.glowColor || '#00F0FF';
  ctx.shadowBlur = 25;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 14;
  ctx.strokeText(titleText, 0, 0);

  // Gradient fill for text
  const textGrad = ctx.createLinearGradient(0, -30, 0, 30);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(1, state.textColor || '#00F0FF');
  ctx.fillStyle = textGrad;
  ctx.fillText(titleText, 0, 0);

  // Subtitle / Highlight below
  if (state.subtitle) {
    const subText = state.subtitle.toUpperCase();
    ctx.font = `800 32px 'Teko', sans-serif`;
    ctx.fillStyle = '#FFE600';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 6;
    ctx.strokeText(subText, 0, 64);
    ctx.fillText(subText, 0, 64);
  }
  ctx.restore();

  // 7. Watermark / Brand Header
  if (state.watermark) {
    const channel = options?.channelName || 'GOALSTAR GAMING';
    ctx.save();
    ctx.font = `900 22px 'Orbitron', sans-serif`;
    ctx.fillStyle = '#00F0FF';
    ctx.shadowColor = '#00F0FF';
    ctx.shadowBlur = 10;
    ctx.fillText(`⚡ ${channel.toUpperCase()}`, 36, 46);
    ctx.restore();
  }

  // 8. Cyberpunk Vignette & Corner Borders
  if (state.vignette) {
    drawVignette(ctx, width, height);
  }
  drawCyberCorners(ctx, width, height, state.glowColor || '#00F0FF');

  return canvas.toDataURL('image/png');
}

// Procedural Background generator with high-octane football gaming aesthetics
function drawProceduralBackground(
  ctx: CanvasRenderingContext2D,
  theme: ThumbnailState['backgroundTheme'],
  width: number,
  height: number
) {
  // Base dark gradient
  const bg = ctx.createLinearGradient(0, 0, width, height);
  if (theme === 'red_inferno') {
    bg.addColorStop(0, '#2d040f');
    bg.addColorStop(0.5, '#0d0208');
    bg.addColorStop(1, '#1f0010');
  } else if (theme === 'gold_glory') {
    bg.addColorStop(0, '#261b02');
    bg.addColorStop(0.5, '#0a0802');
    bg.addColorStop(1, '#1a1200');
  } else if (theme === 'electric_blue') {
    bg.addColorStop(0, '#001a33');
    bg.addColorStop(0.5, '#050a17');
    bg.addColorStop(1, '#001026');
  } else {
    // cyber_stadium & neon_arena
    bg.addColorStop(0, '#060d2e');
    bg.addColorStop(0.5, '#060812');
    bg.addColorStop(1, '#1a082b');
  }
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Stadium Floodlight Cones
  drawStadiumLights(ctx, width, height, theme);

  // Cyber Grid Floor
  drawPerspectiveGrid(ctx, width, height);

  // Floating Cyber Particles / Embers
  drawEmbers(ctx, width, height, theme);
}

function drawStadiumLights(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: string
) {
  ctx.save();
  const lightColor1 = theme === 'red_inferno' ? 'rgba(255, 30, 80, 0.35)' : 'rgba(0, 240, 255, 0.35)';
  const lightColor2 = theme === 'gold_glory' ? 'rgba(255, 215, 0, 0.35)' : 'rgba(176, 38, 255, 0.35)';

  // Left floodlight beam
  const grad1 = ctx.createRadialGradient(80, 0, 10, 240, 400, 500);
  grad1.addColorStop(0, lightColor1);
  grad1.addColorStop(1, 'transparent');
  ctx.fillStyle = grad1;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(260, 0);
  ctx.lineTo(600, height);
  ctx.lineTo(0, height);
  ctx.closePath();
  ctx.fill();

  // Right floodlight beam
  const grad2 = ctx.createRadialGradient(width - 80, 0, 10, width - 240, 400, 500);
  grad2.addColorStop(0, lightColor2);
  grad2.addColorStop(1, 'transparent');
  ctx.fillStyle = grad2;
  ctx.beginPath();
  ctx.moveTo(width, 0);
  ctx.lineTo(width - 260, 0);
  ctx.lineTo(width - 600, height);
  ctx.lineTo(width, height);
  ctx.closePath();
  ctx.fill();

  ctx.restore();
}

function drawPerspectiveGrid(ctx: CanvasRenderingContext2D, width: number, height: number) {
  ctx.save();
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.12)';
  ctx.lineWidth = 1.5;

  const horizon = height * 0.55;
  const vanishingX = width / 2;

  // Perspective radiating lines
  for (let x = -200; x <= width + 200; x += 100) {
    ctx.beginPath();
    ctx.moveTo(vanishingX, horizon);
    ctx.lineTo(x, height);
    ctx.stroke();
  }

  // Horizontal floor lines
  for (let y = horizon; y <= height; y += (y - horizon) * 0.4 + 15) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }
  ctx.restore();
}

function drawEmbers(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  theme: string
) {
  ctx.save();
  const count = 35;
  const particleColor = theme === 'red_inferno' ? '#FF2244' : theme === 'gold_glory' ? '#FFD700' : '#00F0FF';

  for (let i = 0; i < count; i++) {
    const px = Math.sin(i * 99) * width * 0.5 + width * 0.5;
    const py = Math.cos(i * 77) * height * 0.5 + height * 0.5;
    const size = (i % 4) + 1.5;

    ctx.fillStyle = particleColor;
    ctx.shadowColor = particleColor;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Center "VS" Emblem with electric lightning & glowing shield
function drawVsBadge(ctx: CanvasRenderingContext2D, cx: number, cy: number) {
  ctx.save();
  ctx.translate(cx, cy);

  // Outer lightning aura
  ctx.shadowColor = '#FFE600';
  ctx.shadowBlur = 30;

  // Shield plate
  ctx.beginPath();
  ctx.moveTo(0, -60);
  ctx.lineTo(55, -25);
  ctx.lineTo(45, 45);
  ctx.lineTo(0, 75);
  ctx.lineTo(-45, 45);
  ctx.lineTo(-55, -25);
  ctx.closePath();

  const shieldGrad = ctx.createLinearGradient(0, -60, 0, 75);
  shieldGrad.addColorStop(0, '#111827');
  shieldGrad.addColorStop(1, '#060812');
  ctx.fillStyle = shieldGrad;
  ctx.fill();

  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 4;
  ctx.stroke();

  // Inner border
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  ctx.stroke();

  // VS text
  ctx.font = "900 54px 'Orbitron', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.strokeText('VS', 0, 5);

  const vsGrad = ctx.createLinearGradient(0, -25, 0, 25);
  vsGrad.addColorStop(0, '#FFF275');
  vsGrad.addColorStop(0.5, '#FF8A00');
  vsGrad.addColorStop(1, '#E52E71');
  ctx.fillStyle = vsGrad;
  ctx.fillText('VS', 0, 5);

  ctx.restore();
}

// Draw Top Badge (99 OVR / INSANE / NEW META / etc)
function drawTopBadge(
  ctx: CanvasRenderingContext2D,
  badge: ThumbnailState['badge'],
  cx: number,
  cy: number
) {
  ctx.save();
  ctx.translate(cx, cy);

  let label = '99 OVR';
  let badgeColor = '#FFE600';

  if (badge === 'INSANE') {
    label = '🔥 INSANE PACK!';
    badgeColor = '#FF0055';
  } else if (badge === 'NEW_META') {
    label = '⚡ NEW FC 25 META';
    badgeColor = '#00F0FF';
  } else if (badge === '100K') {
    label = '🏆 100K PRIZE';
    badgeColor = '#00FF66';
  } else if (badge === 'FINAL') {
    label = '⚔️ GRAND FINAL';
    badgeColor = '#B026FF';
  } else if (badge === 'SECRET') {
    label = '🤫 SECRET GLITCH';
    badgeColor = '#FF8A00';
  }

  ctx.font = "900 28px 'Chakra Petch', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const w = ctx.measureText(label).width + 48;
  const h = 50;

  // Badge background
  ctx.fillStyle = 'rgba(6, 8, 18, 0.9)';
  ctx.strokeStyle = badgeColor;
  ctx.lineWidth = 3;
  ctx.shadowColor = badgeColor;
  ctx.shadowBlur = 15;

  ctx.beginPath();
  ctx.roundRect(-w / 2, -h / 2, w, h, 25);
  ctx.fill();
  ctx.stroke();

  // Badge Text
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(label, 0, 1);

  ctx.restore();
}

function drawVignette(ctx: CanvasRenderingContext2D, width: number, height: number) {
  const rad = ctx.createRadialGradient(
    width / 2,
    height / 2,
    width * 0.3,
    width / 2,
    height / 2,
    width * 0.75
  );
  rad.addColorStop(0, 'rgba(0, 0, 0, 0)');
  rad.addColorStop(1, 'rgba(0, 0, 0, 0.7)');
  ctx.fillStyle = rad;
  ctx.fillRect(0, 0, width, height);
}

function drawCyberCorners(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  color: string
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.shadowColor = color;
  ctx.shadowBlur = 10;

  const len = 30;
  const offset = 18;

  // Top Left
  ctx.beginPath();
  ctx.moveTo(offset, offset + len);
  ctx.lineTo(offset, offset);
  ctx.lineTo(offset + len, offset);
  ctx.stroke();

  // Top Right
  ctx.beginPath();
  ctx.moveTo(width - offset - len, offset);
  ctx.lineTo(width - offset, offset);
  ctx.lineTo(width - offset, offset + len);
  ctx.stroke();

  // Bottom Left
  ctx.beginPath();
  ctx.moveTo(offset, height - offset - len);
  ctx.lineTo(offset, height - offset);
  ctx.lineTo(offset + len, height - offset);
  ctx.stroke();

  // Bottom Right
  ctx.beginPath();
  ctx.moveTo(width - offset - len, height - offset);
  ctx.lineTo(width - offset, height - offset);
  ctx.lineTo(width - offset, height - offset - len);
  ctx.stroke();

  ctx.restore();
}

// -------------------------------------------------------------
// POSTER RENDERER (1080 x 1350 / 4:5 Instagram & Community Tab)
// -------------------------------------------------------------
export async function renderPosterCanvas(
  canvas: HTMLCanvasElement,
  state: PosterState,
  options?: { channelName?: string }
): Promise<string> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const width = 1080;
  const height = 1350;
  canvas.width = width;
  canvas.height = height;

  // Background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, height);
  if (state.theme === 'cyber_purple') {
    bgGrad.addColorStop(0, '#1d0538');
    bgGrad.addColorStop(0.5, '#090314');
    bgGrad.addColorStop(1, '#110324');
  } else if (state.theme === 'golden_trophy') {
    bgGrad.addColorStop(0, '#2b1e02');
    bgGrad.addColorStop(0.5, '#0a0802');
    bgGrad.addColorStop(1, '#1f1600');
  } else {
    // neon_champions & dark_esports
    bgGrad.addColorStop(0, '#001a33');
    bgGrad.addColorStop(0.4, '#060812');
    bgGrad.addColorStop(1, '#110022');
  }
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, width, height);

  // Background image if provided
  if (state.backgroundImage) {
    try {
      const bgImg = await loadImage(state.backgroundImage);
      ctx.globalAlpha = 0.45;
      ctx.drawImage(bgImg, 0, 0, width, height);
      ctx.globalAlpha = 1.0;
    } catch {}
  }

  // Perspective stadium glow
  drawStadiumLights(ctx, width, height, state.theme);
  drawPerspectiveGrid(ctx, width, height);

  // Tournament Banner (Top)
  ctx.save();
  ctx.font = "900 28px 'Orbitron', sans-serif";
  ctx.fillStyle = '#00F0FF';
  ctx.textAlign = 'center';
  ctx.shadowColor = '#00F0FF';
  ctx.shadowBlur = 15;
  ctx.fillText(`🏆 ${state.tournamentName.toUpperCase()}`, width / 2, 80);

  ctx.font = "800 20px 'Chakra Petch', sans-serif";
  ctx.fillStyle = '#94A3B8';
  ctx.fillText(options?.channelName?.toUpperCase() || 'GOALSTAR GAMING ESPORTS', width / 2, 115);
  ctx.restore();

  // Match Title
  ctx.save();
  ctx.font = "900 52px 'Teko', sans-serif";
  ctx.textAlign = 'center';
  ctx.fillStyle = '#FFFFFF';
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 8;
  ctx.strokeText(state.matchTitle.toUpperCase(), width / 2, 185);
  ctx.fillText(state.matchTitle.toUpperCase(), width / 2, 185);
  ctx.restore();

  // Team 1 Card (Left)
  drawTeamCard(ctx, 220, 480, state.team1, '#00F0FF', state.team1Score);

  // VS Center Crest
  drawVsBadge(ctx, width / 2, 480);

  // Team 2 Card (Right)
  drawTeamCard(ctx, width - 220, 480, state.team2, '#B026FF', state.team2Score);

  // Prize Pool Badge
  ctx.save();
  ctx.translate(width / 2, 750);
  ctx.fillStyle = 'rgba(17, 24, 39, 0.9)';
  ctx.strokeStyle = '#FFE600';
  ctx.lineWidth = 3;
  ctx.shadowColor = '#FFE600';
  ctx.shadowBlur = 18;
  ctx.beginPath();
  ctx.roundRect(-220, -35, 440, 70, 35);
  ctx.fill();
  ctx.stroke();

  ctx.font = "900 32px 'Orbitron', sans-serif";
  ctx.fillStyle = '#FFE600';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`PRIZE POOL: ${state.prizePool}`, 0, 0);
  ctx.restore();

  // Schedule & Venue Bar (Bottom)
  ctx.save();
  ctx.translate(width / 2, 1000);
  ctx.fillStyle = 'rgba(10, 15, 35, 0.85)';
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-420, -110, 840, 220, 24);
  ctx.fill();
  ctx.stroke();

  ctx.font = "800 24px 'Chakra Petch', sans-serif";
  ctx.fillStyle = '#38BDF8';
  ctx.textAlign = 'center';
  ctx.fillText('📅 MATCH SCHEDULE & VENUE', 0, -65);

  ctx.font = "900 48px 'Teko', sans-serif";
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(`${state.date.toUpperCase()} • ${state.time.toUpperCase()}`, 0, -10);

  ctx.font = "700 26px 'Plus Jakarta Sans', sans-serif";
  ctx.fillStyle = '#E2E8F0';
  ctx.fillText(`📍 ${state.venue.toUpperCase()}`, 0, 45);

  ctx.font = "800 20px 'Chakra Petch', sans-serif";
  ctx.fillStyle = '#A855F7';
  ctx.fillText('LIVE STREAM ON YOUTUBE @GOALSTAR GAMING', 0, 85);
  ctx.restore();

  drawCyberCorners(ctx, width, height, '#00F0FF');
  return canvas.toDataURL('image/png');
}

function drawTeamCard(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  teamName: string,
  color: string,
  score?: string
) {
  ctx.save();
  ctx.translate(cx, cy);

  // Shield Crest
  ctx.beginPath();
  ctx.moveTo(0, -140);
  ctx.lineTo(110, -70);
  ctx.lineTo(90, 80);
  ctx.lineTo(0, 140);
  ctx.lineTo(-90, 80);
  ctx.lineTo(-110, -70);
  ctx.closePath();

  ctx.fillStyle = 'rgba(6, 12, 30, 0.95)';
  ctx.fill();

  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  ctx.shadowColor = color;
  ctx.shadowBlur = 20;
  ctx.stroke();

  // Football icon inside crest
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(0, -30, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.font = "900 36px 'Orbitron', sans-serif";
  ctx.fillStyle = '#060812';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚽', 0, -30);

  // Team Name
  ctx.font = "800 22px 'Chakra Petch', sans-serif";
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(teamName.toUpperCase(), 0, 50);

  if (score) {
    ctx.font = "900 48px 'Teko', sans-serif";
    ctx.fillStyle = color;
    ctx.fillText(score, 0, 95);
  }

  ctx.restore();
}

// -------------------------------------------------------------
// YOUTUBE SHORTS CREATOR (1080 x 1920 - 9:16 Vertical)
// -------------------------------------------------------------
export async function renderShortsCanvas(
  canvas: HTMLCanvasElement,
  state: ShortsState,
  options?: { channelName?: string }
): Promise<string> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const width = 1080;
  const height = 1920;
  canvas.width = width;
  canvas.height = height;

  // Background
  const grad = ctx.createLinearGradient(0, 0, 0, height);
  grad.addColorStop(0, '#060a1d');
  grad.addColorStop(0.5, '#04050d');
  grad.addColorStop(1, '#110424');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, width, height);

  // Background lights
  drawStadiumLights(ctx, width, height, 'neon');

  // Top Creator Channel Badge
  ctx.save();
  ctx.font = "900 28px 'Orbitron', sans-serif";
  ctx.fillStyle = state.accentColor || '#00F0FF';
  ctx.textAlign = 'center';
  ctx.shadowColor = state.accentColor || '#00F0FF';
  ctx.shadowBlur = 12;
  ctx.fillText(`⚡ ${options?.channelName?.toUpperCase() || 'GOALSTAR GAMING'} SHORTS`, width / 2, 110);
  ctx.restore();

  // Top Headline Plate
  ctx.save();
  ctx.translate(width / 2, 230);

  ctx.font = "900 58px 'Teko', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const titleW = Math.min(width - 80, ctx.measureText(state.headline.toUpperCase()).width + 60);
  ctx.fillStyle = 'rgba(6, 8, 18, 0.9)';
  ctx.strokeStyle = state.accentColor || '#00F0FF';
  ctx.lineWidth = 4;
  ctx.shadowColor = state.accentColor || '#00F0FF';
  ctx.shadowBlur = 20;
  ctx.beginPath();
  ctx.roundRect(-titleW / 2, -60, titleW, 120, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(state.headline.toUpperCase(), 0, -10);

  if (state.subheadline) {
    ctx.font = "700 28px 'Chakra Petch', sans-serif";
    ctx.fillStyle = '#FFE600';
    ctx.fillText(state.subheadline.toUpperCase(), 0, 32);
  }
  ctx.restore();

  // Center Stage: Split Screen or Gameplay Area
  if (state.layout === 'split_vs') {
    // Top Player Section
    ctx.save();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.1)';
    ctx.fillRect(60, 400, width - 120, 480);
    ctx.strokeStyle = '#00F0FF';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 400, width - 120, 480);

    const p1Url = generatePlayerSilhouette(state.player1 || 'CR7', '#00F0FF');
    try {
      const p1 = await loadImage(p1Url);
      ctx.drawImage(p1, width / 2 - 160, 420, 320, 440);
    } catch {}
    ctx.restore();

    // Center VS
    drawVsBadge(ctx, width / 2, 920);

    // Bottom Player Section
    ctx.save();
    ctx.fillStyle = 'rgba(176, 38, 255, 0.1)';
    ctx.fillRect(60, 960, width - 120, 480);
    ctx.strokeStyle = '#B026FF';
    ctx.lineWidth = 3;
    ctx.strokeRect(60, 960, width - 120, 480);

    const p2Url = generatePlayerSilhouette(state.player2 || 'MBAPPE', '#B026FF');
    try {
      const p2 = await loadImage(p2Url);
      ctx.drawImage(p2, width / 2 - 160, 980, 320, 440);
    } catch {}
    ctx.restore();
  } else {
    // Facecam / Gameplay Preview
    ctx.save();
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(60, 420, width - 120, 980);
    ctx.strokeStyle = state.accentColor || '#00F0FF';
    ctx.lineWidth = 4;
    ctx.strokeRect(60, 420, width - 120, 980);

    ctx.font = "900 48px 'Chakra Petch', sans-serif";
    ctx.fillStyle = '#38BDF8';
    ctx.textAlign = 'center';
    ctx.fillText('🎮 9:16 GAMEPLAY ACTION CAM', width / 2, 850);

    ctx.font = "700 32px 'Plus Jakarta Sans', sans-serif";
    ctx.fillStyle = '#94A3B8';
    ctx.fillText(`Player: ${state.player1 || 'CR7'} vs ${state.player2 || 'MBAPPE'}`, width / 2, 920);
    ctx.restore();
  }

  // Bottom Outro / Call To Action
  ctx.save();
  ctx.translate(width / 2, 1680);

  ctx.fillStyle = 'rgba(255, 0, 122, 0.2)';
  ctx.strokeStyle = '#FF007A';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(-420, -60, 840, 120, 30);
  ctx.fill();
  ctx.stroke();

  ctx.font = "900 38px 'Chakra Petch', sans-serif";
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(`🔔 ${state.outroCTA || 'SUBSCRIBE FOR DAILY CRAZY GOALS!'}`, 0, 0);

  ctx.restore();

  drawCyberCorners(ctx, width, height, state.accentColor || '#00F0FF');
  return canvas.toDataURL('image/png');
}

// -------------------------------------------------------------
// LOGO & CHANNEL BRANDING RENDERER (800 x 800)
// -------------------------------------------------------------
export async function renderLogoCanvas(
  canvas: HTMLCanvasElement,
  state: LogoState
): Promise<string> {
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const size = 800;
  canvas.width = size;
  canvas.height = size;

  // Background
  const grad = ctx.createRadialGradient(size / 2, size / 2, 50, size / 2, size / 2, size * 0.7);
  grad.addColorStop(0, '#0d1538');
  grad.addColorStop(1, '#050711');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size / 2;

  // Mascot Outer Shield / Emblem
  ctx.save();
  ctx.translate(cx, cy - 30);

  ctx.shadowColor = state.primaryColor || '#00F0FF';
  ctx.shadowBlur = 35;

  ctx.beginPath();
  ctx.moveTo(0, -220);
  ctx.lineTo(190, -110);
  ctx.lineTo(150, 130);
  ctx.lineTo(0, 240);
  ctx.lineTo(-150, 130);
  ctx.lineTo(-190, -110);
  ctx.closePath();

  const shieldGrad = ctx.createLinearGradient(0, -220, 0, 240);
  shieldGrad.addColorStop(0, '#0f172a');
  shieldGrad.addColorStop(1, '#020617');
  ctx.fillStyle = shieldGrad;
  ctx.fill();

  ctx.strokeStyle = state.primaryColor || '#00F0FF';
  ctx.lineWidth = 8;
  ctx.stroke();

  // Inner contour
  ctx.strokeStyle = state.secondaryColor || '#B026FF';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Mascot Center Graphics
  if (state.mascot === 'shield_controller') {
    // Gamepad controller emblem
    ctx.font = "120px sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('🎮', 0, 0);
  } else if (state.mascot === 'lightning_boot') {
    ctx.font = "120px sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚡', 0, 0);
  } else if (state.mascot === 'crown_fire') {
    ctx.font = "120px sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('👑', 0, 0);
  } else {
    // star_ball: Football surrounded by neon star
    ctx.font = "120px sans-serif";
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('⚽', 0, -10);

    // Glowing Star behind
    ctx.font = "900 80px 'Orbitron', sans-serif";
    ctx.fillStyle = state.primaryColor || '#00F0FF';
    ctx.fillText('★', 0, 85);
  }
  ctx.restore();

  // Brand Name Plate
  ctx.save();
  ctx.translate(cx, size - 110);

  ctx.font = "900 48px 'Orbitron', sans-serif";
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 10;
  ctx.strokeText(state.brandName.toUpperCase(), 0, 0);

  const textGrad = ctx.createLinearGradient(0, -20, 0, 20);
  textGrad.addColorStop(0, '#FFFFFF');
  textGrad.addColorStop(1, state.primaryColor || '#00F0FF');
  ctx.fillStyle = textGrad;
  ctx.fillText(state.brandName.toUpperCase(), 0, 0);

  // Slogan
  if (state.slogan) {
    ctx.font = "800 22px 'Chakra Petch', sans-serif";
    ctx.fillStyle = state.secondaryColor || '#B026FF';
    ctx.fillText(state.slogan.toUpperCase(), 0, 42);
  }
  ctx.restore();

  // Circular guide if PFP mode
  if (state.format === 'pfp_circle') {
    ctx.save();
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  return canvas.toDataURL('image/png');
}

// Download helper that works reliably on Android mobile and desktop browsers
export function triggerFileDownload(dataUrl: string, fileName: string) {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
