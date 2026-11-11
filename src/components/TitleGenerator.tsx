import React, { useState } from 'react';
import { Type, Sparkles, Copy, Check, Flame, ArrowRight, Save, Send } from 'lucide-react';
import confetti from 'canvas-confetti';

interface TitleItem {
  title: string;
  category: string;
  viralityScore: number;
  ctrTier: string;
  tags?: string[];
}

interface TitleGeneratorProps {
  onUseTitleInThumbnail: (title: string) => void;
  onSaveProject: (item: { title: string; type: 'title'; data: any }) => void;
}

export const TitleGenerator: React.FC<TitleGeneratorProps> = ({
  onUseTitleInThumbnail,
  onSaveProject,
}) => {
  const [topic, setTopic] = useState('Ronaldo vs Mbappe 99 Pace Showdown');
  const [game, setGame] = useState('EA Sports FC 25');
  const [style, setStyle] = useState('High Energy Viral');
  const [players, setPlayers] = useState('Ronaldo, Mbappe');
  const [keywords, setKeywords] = useState('99 speed, impossible goal, reaction');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [titles, setTitles] = useState<TitleItem[]>([
    {
      title: '🔥 RONALDO VS MBAPPE 99 SPEED SHOWDOWN! (eFootball 2025)',
      category: 'Viral VS Faceoff',
      viralityScore: 98,
      ctrTier: 'S-Tier (Extreme CTR)',
      tags: ['#fifa25', '#ronaldovsmbappe', '#99pace'],
    },
    {
      title: 'I UNLOCKED THE SECRET 105 RATED CR7! INSANE PACK OPENING!',
      category: 'Pack Opening / Shock',
      viralityScore: 96,
      ctrTier: 'S-Tier (High Curiosity)',
      tags: ['#packopening', '#cr7', '#secretcard'],
    },
    {
      title: 'THEY SAID HE WAS FINISHED... THEN THIS HAPPENED 😱 (EA FC 25)',
      category: 'Clickbait Mystery',
      viralityScore: 95,
      ctrTier: 'S-Tier',
      tags: ['#highlights', '#comeback', '#unreal'],
    },
    {
      title: 'CAN ANYONE STOP THIS SQUAD? 100-0 IN WEEKEND LEAGUE!',
      category: 'Competitive Pro',
      viralityScore: 92,
      ctrTier: 'A-Tier',
      tags: ['#weekendleague', '#esports', '#meta'],
    },
    {
      title: 'NEW UPDATE BROKE THE ENGINE! 100M CURVE FREE KICK TUTORIAL',
      category: 'Glitch / Skill Guide',
      viralityScore: 94,
      ctrTier: 'A-Tier',
      tags: ['#freetutorial', '#curveglitch', '#metasqueeze'],
    },
    {
      title: 'MY 90TH MINUTE COMEBACK MADE MY OPPONENT RAGE QUIT! 🤬',
      category: 'High Drama Reaction',
      viralityScore: 97,
      ctrTier: 'S-Tier',
      tags: ['#ragequit', '#90thmin', '#drama'],
    },
  ]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const playerList = players.split(',').map((p) => p.trim()).filter(Boolean);
      const res = await fetch('/api/generate-titles', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          game,
          style,
          players: playerList,
          keywords,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate titles');
      const data = await res.json();
      if (data.titles && Array.isArray(data.titles)) {
        setTitles(data.titles);
        try {
          confetti({
            particleCount: 40,
            spread: 60,
            origin: { y: 0.6 },
            colors: ['#A855F7', '#00F0FF'],
          });
        } catch {}
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSaveAll = () => {
    onSaveProject({
      title: `Title Pack: ${topic || 'Viral Gaming Titles'}`,
      type: 'title',
      data: { titles, game, topic },
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-purple-500/20 text-purple-400">
              <Type className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black font-orbitron text-white">
              AI YOUTUBE TITLE GENERATOR
            </h2>
            <span className="text-[10px] font-mono text-purple-300 bg-purple-950 px-2 py-0.5 rounded border border-purple-500/40">
              VIRAL CTR
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Craft high-CTR gaming titles with virality scores, brackets, and intrigue designed for YouTube algorithms.
          </p>
        </div>

        <button
          onClick={handleSaveAll}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-purple-400 text-xs font-bold transition-all"
        >
          {saveSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{saveSuccess ? 'Saved!' : 'Save Pack'}</span>
        </button>
      </div>

      {/* Input Configuration Form */}
      <form onSubmit={handleGenerate} className="bg-[#090d22] rounded-2xl p-4 border border-purple-500/25 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Video Concept / Match Highlight
            </label>
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Ronaldo vs Mbappe speed duel"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-purple-400"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Game
            </label>
            <select
              value={game}
              onChange={(e) => setGame(e.target.value)}
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
            >
              <option value="EA Sports FC 25">EA Sports FC 25</option>
              <option value="eFootball 2025">eFootball 2025</option>
              <option value="FIFA World Cup">FIFA World Cup</option>
              <option value="Ultimate Team">Ultimate Team (FUT)</option>
              <option value="Career Mode">Manager / Player Career Mode</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Title Style
            </label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value)}
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
            >
              <option value="High Energy Viral">High Energy Viral (🔥 Emojis)</option>
              <option value="Curiosity Clickbait">High Curiosity / Mystery</option>
              <option value="Faceoff VS Match">Epic VS Showdown</option>
              <option value="Pack Opening">Pack Opening Shock</option>
              <option value="Pro Esports">Pro Esports Competitive</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Featured Players
            </label>
            <input
              type="text"
              value={players}
              onChange={(e) => setPlayers(e.target.value)}
              placeholder="e.g. Ronaldo, Mbappe"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Extra Keywords
            </label>
            <input
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g. 99 Pace, Insane Free Kick"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-400"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-purple-600/30 hover:brightness-110 active:scale-98 transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
              <span>Analyzing YouTube Gaming Algorithm...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Generate 6 Viral Titles (Gemini AI)</span>
            </>
          )}
        </button>
      </form>

      {/* Generated Titles List */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>AI RECOMMENDATIONS ({titles.length})</span>
          <span>CLICK TITLE TO COPY</span>
        </div>

        {titles.map((item, idx) => (
          <div
            key={idx}
            className="p-3.5 rounded-2xl bg-[#0a0e24] border border-slate-800 hover:border-purple-500/40 hover:bg-[#0c1230] transition-all group flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono font-bold text-purple-300 bg-purple-950/70 px-2 py-0.5 rounded border border-purple-500/30">
                  {item.category}
                </span>

                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30 flex items-center gap-1">
                  <Flame className="w-3 h-3 fill-emerald-400" />
                  {item.viralityScore}% VIRAL
                </span>

                <span className="text-[10px] font-mono text-cyan-400">
                  {item.ctrTier}
                </span>
              </div>

              <h4 className="text-xs sm:text-sm font-bold text-white leading-snug group-hover:text-purple-300 transition-colors">
                {item.title}
              </h4>

              {item.tags && (
                <div className="flex gap-1.5 text-[10px] font-mono text-slate-400">
                  {item.tags.map((t, i) => (
                    <span key={i}>{t}</span>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions for Title */}
            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => handleCopy(item.title, idx)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-black/60 border border-slate-700 hover:border-purple-400 text-slate-300 hover:text-white text-xs font-bold transition-all"
                title="Copy Title"
              >
                {copiedIndex === idx ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Copied</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onUseTitleInThumbnail(item.title)}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 hover:bg-cyan-500/30 text-xs font-bold transition-all"
                title="Send directly to Thumbnail Maker"
              >
                <Send className="w-3.5 h-3.5" />
                <span>To Thumbnail</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
