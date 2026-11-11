import React, { useState } from 'react';
import { FileText, Sparkles, Copy, Check, Hash, Tag, Save } from 'lucide-react';
import confetti from 'canvas-confetti';

interface DescriptionGeneratorProps {
  channelName: string;
  onSaveProject: (item: { title: string; type: 'description'; data: any }) => void;
}

export const DescriptionGenerator: React.FC<DescriptionGeneratorProps> = ({
  channelName,
  onSaveProject,
}) => {
  const [title, setTitle] = useState('RONALDO VS MBAPPE 99 SPEED SHOWDOWN! (eFootball 2025)');
  const [game, setGame] = useState('EA Sports FC 25');
  const [topic, setTopic] = useState('Insane skills, last minute penalty, 99 pace test');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedType, setCopiedType] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [description, setDescription] = useState(
    `⚽ WELCOME BACK TO ${channelName}! Today we are pushing football gaming to the absolute limit!\n\nCan Ronaldo conquer Mbappe in the most intense match in football gaming history? We tested 99 pace, insane free kicks, and a heart-stopping 90th minute comeback!\n\nDrop a LIKE and SUBSCRIBE if you want more insane football gaming battles! 🔥\n\n⏱️ TIMESTAMPS:\n0:00 - The Ultimate Faceoff Begins\n01:30 - Ronaldo 99 Pace Breakthrough\n03:45 - Mbappe Unreal Skill Solo\n06:20 - 90th Minute Penalty Drama\n08:15 - Final Match Stats & Secret Pack Reward\n\n🎮 GAME: EA Sports FC 25\n🔔 SUBSCRIBE to ${channelName} for daily elite football gaming!\n💬 Drop your score prediction in the comments below!`
  );

  const [tags, setTags] = useState(
    'football gaming, goalstar gaming, ronaldo vs mbappe, ea sports fc 25, efootball 2025, gaming highlights, ultimate team, 99 pace, cr7 skills, mbappe turbo, fifa mobile, career mode, weekend league'
  );

  const [hashtags, setHashtags] = useState<string[]>([
    '#GoalstarGaming',
    '#EAFC25',
    '#eFootball',
    '#Ronaldo',
    '#Mbappe',
    '#GamingHighlights',
    '#FootballGaming',
    '#ViralGaming',
    '#UltimateTeam',
    '#CR7Siu',
    '#FIFA25',
    '#ProGamer',
  ]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch('/api/generate-description', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          game,
          topic,
          channelName,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate description');
      const data = await res.json();
      if (data.description) setDescription(data.description);
      if (data.tags) setTags(data.tags);
      if (data.hashtags && Array.isArray(data.hashtags)) setHashtags(data.hashtags);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 },
          colors: ['#00F0FF', '#3B82F6'],
        });
      } catch {}
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (content: string, type: string) => {
    navigator.clipboard.writeText(content);
    setCopiedType(type);
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSave = () => {
    onSaveProject({
      title: `Description: ${title.slice(0, 40)}...`,
      type: 'description',
      data: { description, tags, hashtags, game, title },
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
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black font-orbitron text-white">
              AI DESCRIPTION & SEO TAGS
            </h2>
            <span className="text-[10px] font-mono text-blue-300 bg-blue-950 px-2 py-0.5 rounded border border-blue-500/40">
              YOUTUBE SEO
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Rank higher in YouTube search with complete video descriptions, timestamps, and search tags.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-blue-400 text-xs font-bold transition-all"
        >
          {saveSuccess ? (
            <Check className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span>{saveSuccess ? 'Saved!' : 'Save SEO'}</span>
        </button>
      </div>

      {/* Generator Input Form */}
      <form onSubmit={handleGenerate} className="bg-[#090d22] rounded-2xl p-4 border border-blue-500/25 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Video Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. RONALDO VS MBAPPE 99 SPEED SHOWDOWN"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
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
              <option value="Career Mode">Career Mode</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Match Highlights & Key Moments
          </label>
          <input
            type="text"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Crazy free kick, 90th min winner, rage quit, pack opening"
            className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-400"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 hover:brightness-110 active:scale-98 transition-all disabled:opacity-60"
        >
          {isLoading ? (
            <>
              <Sparkles className="w-4 h-4 animate-spin text-cyan-300" />
              <span>Generating YouTube Description & Tags...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-cyan-300" />
              <span>Generate Description & Tags (Gemini AI)</span>
            </>
          )}
        </button>
      </form>

      {/* Output 1: Description */}
      <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-orbitron text-white flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            FULL YOUTUBE DESCRIPTION
          </span>
          <button
            onClick={() => handleCopy(description, 'desc')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            {copiedType === 'desc' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Description</span>
              </>
            )}
          </button>
        </div>

        <textarea
          rows={7}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-black/60 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 font-mono leading-relaxed focus:outline-none focus:border-blue-400 resize-none"
        />
      </div>

      {/* Output 2: YouTube Search Tags */}
      <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-orbitron text-white flex items-center gap-1.5">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            STUDIO SEARCH TAGS (COMMA SEPARATED)
          </span>
          <button
            onClick={() => handleCopy(tags, 'tags')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            {copiedType === 'tags' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Tags</span>
              </>
            )}
          </button>
        </div>

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="w-full bg-black/60 border border-slate-800 rounded-xl px-3 py-2 text-xs text-cyan-300 font-mono focus:outline-none focus:border-cyan-400"
        />
      </div>

      {/* Output 3: Trending Hashtags */}
      <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold font-orbitron text-white flex items-center gap-1.5">
            <Hash className="w-3.5 h-3.5 text-purple-400" />
            TRENDING HASHTAGS ({hashtags.length})
          </span>
          <button
            onClick={() => handleCopy(hashtags.join(' '), 'hash')}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-black/60 border border-slate-700 text-slate-300 hover:text-white text-xs font-bold transition-all"
          >
            {copiedType === 'hash' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy All Hashtags</span>
              </>
            )}
          </button>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {hashtags.map((tag, idx) => (
            <span
              key={idx}
              className="text-xs font-mono font-bold text-purple-300 bg-purple-950/60 border border-purple-500/30 px-2.5 py-1 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
