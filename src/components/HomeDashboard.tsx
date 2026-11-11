import React, { useState } from 'react';
import { TabType, ProjectItem } from '../types';
import { PRESET_THUMBNAILS } from '../utils/assets';
import { 
  Sparkles, 
  Type, 
  FileText, 
  Trophy, 
  Smartphone, 
  ShieldCheck, 
  FolderKanban, 
  TrendingUp, 
  Flame, 
  Zap, 
  Download, 
  ArrowRight,
  Play,
  Lightbulb
} from 'lucide-react';

interface HomeDashboardProps {
  channelName: string;
  onNavigate: (tab: TabType) => void;
  onLoadPresetThumbnail: (presetId: string) => void;
  projects: ProjectItem[];
  onOpenAIModal: () => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  channelName,
  onNavigate,
  onLoadPresetThumbnail,
  projects,
  onOpenAIModal,
}) => {
  const [quickPrompt, setQuickPrompt] = useState('');

  const handleQuickCreate = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('thumbnails');
  };

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6 pb-24">
      {/* Hero Studio Banner */}
      <div className="relative rounded-3xl p-5 overflow-hidden bg-gradient-to-br from-[#0c1433] via-[#090b1c] to-[#140826] border border-cyan-500/30 shadow-[0_0_30px_rgba(0,240,255,0.15)]">
        {/* Background glow flares */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-cyan-500/15 border border-cyan-400/40 text-[11px] font-mono text-cyan-300 font-bold">
              <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              YOUTUBE GAMING CREATOR STUDIO
            </span>
            <span className="text-xs font-mono text-slate-400">v2.5 PRO</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black font-orbitron tracking-wide text-white">
            READY TO DOMINATE <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              YOUTUBE GAMING?
            </span>
          </h2>

          <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
            Generate 1280×720 HD thumbnails, viral titles, match posters, and channel branding powered by real Gemini AI.
          </p>

          {/* Quick Concept Launcher */}
          <form onSubmit={handleQuickCreate} className="pt-1 flex gap-2">
            <input
              type="text"
              value={quickPrompt}
              onChange={(e) => setQuickPrompt(e.target.value)}
              placeholder="e.g. Ronaldo vs Mbappe 99 Pace Showdown..."
              className="flex-1 bg-black/60 border border-cyan-500/30 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              type="submit"
              className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-extrabold text-xs rounded-xl flex items-center gap-1 shadow-md shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Create</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>
      </div>

      {/* Creator Performance Metrics Bar */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="bg-[#0b0f24] border border-cyan-500/20 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-cyan-400 text-xs font-mono mb-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>AVG CTR</span>
          </div>
          <p className="text-lg font-black font-orbitron text-white">+48.5%</p>
          <span className="text-[10px] text-slate-400">Algorithm Optimized</span>
        </div>

        <div className="bg-[#0b0f24] border border-purple-500/20 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-purple-400 text-xs font-mono mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>RESOLUTION</span>
          </div>
          <p className="text-lg font-black font-orbitron text-white">720p HD</p>
          <span className="text-[10px] text-slate-400">1280 × 720 px</span>
        </div>

        <div className="bg-[#0b0f24] border border-amber-500/20 rounded-2xl p-3 text-center">
          <div className="flex items-center justify-center gap-1 text-amber-400 text-xs font-mono mb-1">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>PROJECTS</span>
          </div>
          <p className="text-lg font-black font-orbitron text-white">{projects.length}</p>
          <span className="text-[10px] text-slate-400">Saved in Studio</span>
        </div>
      </div>

      {/* Main Feature Cards Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron font-bold text-sm tracking-wide text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
            STUDIO CREATION SUITE
          </h3>
          <span className="text-[11px] text-slate-400">All tools unlocked</span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* 1. Thumbnail Maker */}
          <button
            onClick={() => onNavigate('thumbnails')}
            className="group text-left p-3.5 rounded-2xl bg-[#090d22] border border-cyan-500/25 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)] transition-all flex flex-col justify-between h-36 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-cyan-500/20 transition-colors" />
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-400/40 flex items-center justify-center text-cyan-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/60 px-1.5 py-0.5 rounded">
                1280x720
              </span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                Thumbnail Maker
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                Ronaldo vs Mbappe, 99 OVR cards & custom photo layers.
              </p>
            </div>
          </button>

          {/* 2. Title Generator */}
          <button
            onClick={() => onNavigate('titles')}
            className="group text-left p-3.5 rounded-2xl bg-[#090d22] border border-purple-500/25 hover:border-purple-400 hover:shadow-[0_0_20px_rgba(176,38,255,0.2)] transition-all flex flex-col justify-between h-36 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full blur-xl pointer-events-none group-hover:bg-purple-500/20 transition-colors" />
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-purple-500/15 border border-purple-400/40 flex items-center justify-center text-purple-400">
                <Type className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/60 px-1.5 py-0.5 rounded">
                VIRAL
              </span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-purple-300 transition-colors">
                Viral Title AI
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                High-CTR gaming titles, virality scores & bracket tags.
              </p>
            </div>
          </button>

          {/* 3. SEO Description */}
          <button
            onClick={() => onNavigate('descriptions')}
            className="group text-left p-3.5 rounded-2xl bg-[#090d22] border border-blue-500/25 hover:border-blue-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.2)] transition-all flex flex-col justify-between h-36 relative overflow-hidden"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-blue-500/15 border border-blue-400/40 flex items-center justify-center text-blue-400">
                <FileText className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-blue-400 bg-blue-950/60 px-1.5 py-0.5 rounded">
                SEO
              </span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-blue-300 transition-colors">
                SEO & Tags
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                Full YouTube descriptions, timestamps & 20+ ranking tags.
              </p>
            </div>
          </button>

          {/* 4. Match Posters */}
          <button
            onClick={() => onNavigate('posters')}
            className="group text-left p-3.5 rounded-2xl bg-[#090d22] border border-amber-500/25 hover:border-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)] transition-all flex flex-col justify-between h-36 relative overflow-hidden"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-400/40 flex items-center justify-center text-amber-400">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded">
                ESPORTS
              </span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-amber-300 transition-colors">
                Match Posters
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                Tournament brackets, Team vs Team & prize pool posters.
              </p>
            </div>
          </button>

          {/* 5. Shorts Creator */}
          <button
            onClick={() => onNavigate('shorts')}
            className="group text-left p-3.5 rounded-2xl bg-[#090d22] border border-rose-500/25 hover:border-rose-400 hover:shadow-[0_0_20px_rgba(244,63,94,0.2)] transition-all flex flex-col justify-between h-36 relative overflow-hidden"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-rose-500/15 border border-rose-400/40 flex items-center justify-center text-rose-400">
                <Smartphone className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-950/60 px-1.5 py-0.5 rounded">
                9:16
              </span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-rose-300 transition-colors">
                Shorts Creator
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                Vertical 9:16 templates, intros, outros & split VS layout.
              </p>
            </div>
          </button>

          {/* 6. Channel Branding */}
          <button
            onClick={() => onNavigate('branding')}
            className="group text-left p-3.5 rounded-2xl bg-[#090d22] border border-emerald-500/25 hover:border-emerald-400 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)] transition-all flex flex-col justify-between h-36 relative overflow-hidden"
          >
            <div className="flex items-center justify-between w-full">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/15 border border-emerald-400/40 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/60 px-1.5 py-0.5 rounded">
                LOGO
              </span>
            </div>
            <div>
              <h4 className="font-orbitron font-bold text-sm text-white group-hover:text-emerald-300 transition-colors">
                Logo & Branding
              </h4>
              <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                Mascot logos, YouTube PFP ring & 2560x1440 banners.
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Quick Football Presets */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-orbitron font-bold text-sm tracking-wide text-white flex items-center gap-2">
            <Zap className="w-4 h-4 text-cyan-400" />
            POPULAR FOOTBALL PRESETS
          </h3>
          <button
            onClick={() => onNavigate('thumbnails')}
            className="text-xs text-cyan-400 hover:underline flex items-center gap-1 font-mono"
          >
            View all <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2">
          {PRESET_THUMBNAILS.map((preset) => (
            <div
              key={preset.id}
              onClick={() => {
                onLoadPresetThumbnail(preset.id);
                onNavigate('thumbnails');
              }}
              className="p-3 rounded-xl bg-[#0a0d20] border border-slate-800 hover:border-cyan-500/50 hover:bg-[#0c112b] transition-all cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-600/30 to-purple-600/30 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-300 font-orbitron text-xs">
                  VS
                </div>
                <div>
                  <h5 className="font-bold text-xs sm:text-sm text-white group-hover:text-cyan-300 transition-colors">
                    {preset.name}
                  </h5>
                  <p className="text-[11px] font-mono text-slate-400">
                    {preset.game} • {preset.player1} vs {preset.player2}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-amber-400 bg-amber-950/50 px-2 py-0.5 rounded border border-amber-500/30">
                  {preset.highlightWord}
                </span>
                <Play className="w-4 h-4 text-slate-400 group-hover:text-cyan-400 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Creator Tips Card */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-cyan-950/30 via-slate-900/50 to-purple-950/30 border border-cyan-500/20 flex gap-3 items-start">
        <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
          <Lightbulb className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-white font-orbitron">
            GOALSTAR CREATOR PRO-TIP
          </h4>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Thumbnails with high-contrast player faceoffs (like Ronaldo vs Mbappe) and yellow/cyan neon text have a 3.2x higher Click-Through Rate on YouTube gaming feeds!
          </p>
        </div>
      </div>
    </div>
  );
};
