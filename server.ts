import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';
import JSZip from 'jszip';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json({ limit: '30mb' }));

// Server-side GoogleGenAI initialization per AI Studio skill guidelines
const apiKey = process.env.GEMINI_API_KEY || '';
let ai: GoogleGenAI | null = null;

if (apiKey) {
  ai = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    studio: 'GOALSTAR GAMING STUDIO',
    engine: 'Gemini 3.8 Flash & Gemini Image Gen',
    timestamp: new Date().toISOString(),
  });
});

// Download Complete Project Source Code as a ZIP
app.get('/api/download-project-zip', async (_req: Request, res: Response) => {
  try {
    const zip = new JSZip();
    const rootDir = __dirname;

    function addDirectoryToZip(currentDir: string, zipFolder: JSZip) {
      const items = fs.readdirSync(currentDir, { withFileTypes: true });
      for (const item of items) {
        // Skip ignored directories
        if (
          item.name === 'node_modules' ||
          item.name === 'dist' ||
          item.name === '.git' ||
          item.name === '.cache' ||
          item.name === '.aistudio'
        ) {
          continue;
        }

        const fullPath = path.join(currentDir, item.name);
        if (item.isDirectory()) {
          const subFolder = zipFolder.folder(item.name);
          if (subFolder) {
            addDirectoryToZip(fullPath, subFolder);
          }
        } else {
          // Read file content
          const content = fs.readFileSync(fullPath);
          zipFolder.file(item.name, content);
        }
      }
    }

    addDirectoryToZip(rootDir, zip);

    // Provide helpful README.md for local setup
    const readmeContent = `# GOALSTAR GAMING STUDIO
Professional YouTube Gaming Creator Studio for football gaming thumbnails, viral titles, match posters, shorts templates, and channel branding.

## 🚀 Quick Local Setup

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. (Optional) Set your Gemini API Key in .env:
\`\`\`bash
GEMINI_API_KEY="your_gemini_api_key"
\`\`\`

3. Start dev server:
\`\`\`bash
npm run dev
\`\`\`

4. Open in browser:
\`http://localhost:3000\`

Built with React 19, TypeScript, Tailwind CSS, Express, and Google Gemini API.
`;
    zip.file('README.md', readmeContent);

    const zipBuffer = await zip.generateAsync({
      type: 'nodebuffer',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader(
      'Content-Disposition',
      'attachment; filename="goalstar-gaming-studio-source.zip"'
    );
    res.setHeader('Content-Length', zipBuffer.length);
    res.send(zipBuffer);
  } catch (err: any) {
    console.error('Error creating project zip:', err);
    res.status(500).json({ error: 'Failed to create project ZIP: ' + err.message });
  }
});

// Title Generator API
app.post('/api/generate-titles', async (req: Request, res: Response) => {
  try {
    const { topic, game, style, players, keywords } = req.body;
    
    if (!ai) {
      // Fallback generator when key is not yet set
      const defaultTitles = [
        {
          title: `🔥 ${players?.[0] || 'RONALDO'} VS ${players?.[1] || 'MBAPPE'} 99 SPEED SHOWDOWN! (eFootball 2025)`,
          category: 'Viral VS',
          viralityScore: 98,
          ctrTier: 'S-Tier (Extreme CTR)',
          tags: ['#viral', '#fifa25', '#ronaldo', '#mbappe'],
        },
        {
          title: `I UNLOCKED THE SECRET 105 RATED ${players?.[0] || 'CR7'}! INSANE PACK OPENING!`,
          category: 'Pack Opening',
          viralityScore: 95,
          ctrTier: 'S-Tier',
          tags: ['#packopening', '#goalstar', '#secretcard'],
        },
        {
          title: `CAN ANYONE STOP THIS SQUAD? 100-0 IN WEEKEND LEAGUE!`,
          category: 'Competitive',
          viralityScore: 92,
          ctrTier: 'A-Tier',
          tags: ['#weekendleague', '#esports', '#unbeatable'],
        },
        {
          title: `THEY SAID HE WAS WASHED... THEN THIS HAPPENED 😱 (EA FC 25)`,
          category: 'Clickbait Mystery',
          viralityScore: 97,
          ctrTier: 'S-Tier (High Curiosity)',
          tags: ['#insanegoals', '#gaminghighlights'],
        },
        {
          title: `NEW UPDATE BROKE THE PHYSICS! 100M CURVE GOAL TUTORIAL`,
          category: 'Pro Glitch / Meta',
          viralityScore: 94,
          ctrTier: 'A-Tier',
          tags: ['#gameplayupdate', '#metasqueeze'],
        },
      ];
      return res.json({ titles: defaultTitles, source: 'fallback' });
    }

    const prompt = `You are the lead YouTube gaming strategist for "GOALSTAR GAMING", a premier football gaming channel (eFootball, EA Sports FC 25, FIFA, Career Mode, Ultimate Team).
Generate 6 ultra-high CTR, viral YouTube video titles based on:
- Main Topic / Concept: ${topic || 'Epic Football Gaming Match'}
- Game: ${game || 'EA Sports FC 25 / eFootball'}
- Style: ${style || 'High Energy Viral'}
- Key Players: ${players?.length ? players.join(', ') : 'Ronaldo, Mbappe'}
- Extra Keywords: ${keywords || 'Insane skills, 99 OVR, dramatic comeback'}

Guidelines:
- Incorporate bold words, emojis, dramatic brackets [99 OVR], and intrigue.
- Ensure diversity: 1 Faceoff/VS Title, 1 Shock/Mystery Title, 1 Squad/Pack Challenge, 1 Pro Esports Title, 1 High Curiosity Glitch/Secret Title, 1 Career Masterclass.
- For each title provide:
  - title (string)
  - category (string)
  - viralityScore (number between 88 and 99)
  - ctrTier ("S-Tier (Extreme CTR)" or "A-Tier (High Engagement)")
  - tags (array of 3-4 hashtags)

Output strictly valid JSON with this format:
{
  "titles": [
    {
      "title": "...",
      "category": "...",
      "viralityScore": 98,
      "ctrTier": "S-Tier (Extreme CTR)",
      "tags": ["#tag1", "#tag2"]
    }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{"titles": []}');
    res.json({ titles: parsed.titles || [], source: 'gemini' });
  } catch (error: any) {
    console.error('Error generating titles:', error);
    res.status(500).json({ error: error.message || 'Failed to generate titles' });
  }
});

// Description & SEO Tags Generator API
app.post('/api/generate-description', async (req: Request, res: Response) => {
  try {
    const { title, game, topic, channelName = 'GOALSTAR GAMING' } = req.body;

    if (!ai) {
      return res.json({
        description: `⚽ WELCOME BACK TO ${channelName}! Today we are taking football gaming to the absolute limit!\n\nCan Ronaldo conquer Mbappe in the most intense match in football gaming history? Drop a LIKE and SUBSCRIBE if you love football!\n\nTIMESTAMPS:\n0:00 - The Impossible Challenge\n01:30 - Ronaldo 99 Pace Breakthrough\n03:45 - Mbappe Unreal Skill Run\n06:20 - 90th Minute Penalty Drama\n08:15 - Final Match Stats & Pack Reward\n\n🎮 GAME: ${game || 'EA FC 25'}\n🔔 SUBSCRIBE to ${channelName} for daily elite football gaming content!\n💬 Drop your score prediction in the comments!`,
        tags: 'football gaming, goalstar gaming, ronaldo vs mbappe, ea sports fc 25, efootball 2025, gaming highlights, ultimate team, 99 pace, fifa mobile, skills tutorial',
        hashtags: ['#GoalstarGaming', '#EAFC25', '#eFootball', '#Ronaldo', '#Mbappe', '#GamingCommunity', '#FootballGaming', '#ViralGaming', '#UltimateTeam', '#ProGamer'],
        source: 'fallback',
      });
    }

    const prompt = `You are the lead YouTube SEO manager for "${channelName}".
Generate an optimized YouTube video description, search tags, and trending hashtags for:
- Video Title: ${title || 'Ronaldo VS Mbappe Ultimate Gaming Showdown'}
- Game: ${game || 'EA FC 25'}
- Highlights: ${topic || 'Crazy goals, skills and last minute drama'}

Include:
1. High-retention intro hook with subscribe call to action.
2. Narrative game summary.
3. Realistic 5-6 item gaming timestamps.
4. Channel social placeholder links (Discord, Instagram, TikTok @GoalstarGaming).
5. Comma-separated search tags (15-20 high volume search queries).
6. 10-15 trending hashtags starting with #.

Output strictly valid JSON:
{
  "description": "Full formatted description string with linebreaks",
  "tags": "tag1, tag2, tag3, ...",
  "hashtags": ["#tag1", "#tag2", ...]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text || '{}');
    res.json({
      description: parsed.description || '',
      tags: parsed.tags || '',
      hashtags: parsed.hashtags || [],
      source: 'gemini',
    });
  } catch (error: any) {
    console.error('Error generating description:', error);
    res.status(500).json({ error: error.message || 'Failed to generate description' });
  }
});

// AI Image Generation Endpoint (using gemini-3.1-flash-lite-image)
app.post('/api/generate-image', async (req: Request, res: Response) => {
  try {
    const { prompt, aspectRatio = '16:9', type = 'thumbnail', customStyle = 'esports' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    if (!ai) {
      return res.status(400).json({
        error: 'Gemini API key is not configured on the server. Please check Settings > Secrets.',
        requiresKey: true,
      });
    }

    // Enhance prompt for YouTube gaming aesthetics
    const styledPrompt = `High quality professional YouTube gaming graphic for ${type}: ${prompt}. Style: ${customStyle}, ultra detailed, neon blue and deep purple esports stadium lighting, volumetric smoke, cinematic 8k resolution, crisp contrast, dramatic dynamic angles, FIFA / eFootball gaming vibe, clean composition.`;

    // Map aspect ratios to supported gemini image values: "1:1", "3:4", "4:3", "9:16", "16:9"
    let targetRatio: '1:1' | '3:4' | '4:3' | '9:16' | '16:9' = '16:9';
    if (aspectRatio === '9:16' || type === 'shorts') {
      targetRatio = '9:16';
    } else if (aspectRatio === '1:1' || type === 'logo' || type === 'pfp') {
      targetRatio = '1:1';
    } else if (aspectRatio === '4:3') {
      targetRatio = '4:3';
    } else if (aspectRatio === '3:4' || type === 'poster') {
      targetRatio = '3:4';
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-lite-image',
      contents: {
        parts: [{ text: styledPrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: targetRatio,
        },
      },
    });

    let imageUrl: string | null = null;
    let descriptionText = '';

    for (const part of response.candidates?.[0]?.content?.parts ?? []) {
      if (part.inlineData?.data) {
        const mime = part.inlineData.mimeType || 'image/png';
        imageUrl = `data:${mime};base64,${part.inlineData.data}`;
        break;
      } else if (part.text) {
        descriptionText += part.text;
      }
    }

    if (imageUrl) {
      return res.json({ imageUrl, description: descriptionText, success: true });
    } else {
      return res.status(500).json({
        error: 'No image data returned from model. It might be due to safety filters.',
        textOutput: descriptionText,
      });
    }
  } catch (error: any) {
    console.error('Error generating image:', error);
    return res.status(500).json({
      error: error.message || 'Failed to generate image',
      details: error.toString(),
    });
  }
});

// Prompt Enhancer API
app.post('/api/enhance-prompt', async (req: Request, res: Response) => {
  try {
    const { idea, mode = 'thumbnail' } = req.body;
    if (!ai) {
      return res.json({
        enhancedPrompt: `${idea || 'Ronaldo vs Mbappe showdown'}, cinematic neon stadium with lightning bolts, electric blue and purple rim lighting, hyper-expressive player facial expressions, floating golden 99 OVR cards, depth of field, 8k esports tournament background`,
      });
    }

    const prompt = `You are a world-class prompt engineer for YouTube gaming graphics (focusing on football gaming like EA FC 25, eFootball, Ronaldo, Mbappe, tournaments).
Transform this simple idea into a visually spectacular prompt for generating a ${mode}:
"${idea}"

Make it vivid, specifying lighting (neon cyan & electric magenta), particle embers, motion blur, dramatic angles, character pose, and stadium atmosphere. Return only the enhanced prompt string.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    res.json({ enhancedPrompt: response.text?.trim() || idea });
  } catch (error: any) {
    console.error('Error enhancing prompt:', error);
    res.status(500).json({ error: error.message });
  }
});

// Vite or Static file serving
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[GOALSTAR GAMING STUDIO] Server listening on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
