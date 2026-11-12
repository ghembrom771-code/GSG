import React, { useState, useRef, useEffect } from 'react';
import { PosterState } from '../types';
import { renderPosterCanvas, triggerFileDownload, exportHighResPoster } from '../utils/canvasRenderer';
import { PRESET_POSTERS } from '../utils/assets';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Download, 
  Save, 
  RefreshCw, 
  Palette, 
  Calendar, 
  DollarSign, 
  MapPin, 
  CheckCircle2, 
  Wand2,
  Sparkles
} from 'lucide-react';

interface PosterMakerProps {
  channelName: string;
  onSaveProject: (item: { title: string; type: 'poster'; data: any; previewUrl: string; dimensions: string }) => void;
  onOpenAIModal: () => void;
}

export const PosterMaker: React.FC<PosterMakerProps> = ({
  channelName,
  onSaveProject,
  onOpenAIModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [state, setState] = useState<PosterState>({
    matchTitle: 'GRAND CHAMPIONS ESPORTS CUP',
    tournamentName: 'GOALSTAR WORLD TOUR 2025',
    team1: 'REAL MADRID ESPORTS',
    team2: 'MANCHESTER CITY GAMING',
    team1Score: '3',
    team2Score: '2',
    date: 'SATURDAY 15 NOV',
    time: '20:00 UTC',
    venue: 'CYBER STADIUM ARENA',
    prizePool: '$25,000 USD',
    layout: 'match_day',
    theme: 'neon_champions',
  });

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderPosterCanvas(canvasRef.current, state, { channelName });
      } catch (err) {
        console.error('Poster render error:', err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };
    render();
    return () => {
      isMounted = false;
    };
  }, [state, channelName]);

  const handleDownload = async (resolution: '1080p' | '4k' = '4k') => {
    setIsExporting(true);
    try {
      const result = await exportHighResPoster(state, resolution, { channelName });
      triggerFileDownload(result.dataUrl, result.filename);

      try {
        confetti({
          particleCount: 55,
          spread: 65,
          origin: { y: 0.7 },
          colors: ['#00F0FF', '#FFE600'],
        });
      } catch {}

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 2500);
    } catch {
      if (canvasRef.current) {
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const safeTitle = state.matchTitle.replace(/[^a-zA-Z0-9]/g, '_');
        triggerFileDownload(dataUrl, `GOALSTAR_${safeTitle}_POSTER_1080x1350.png`);
      }
    } finally {
      setIsExporting(false);
    }
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const previewUrl = canvasRef.current.toDataURL('image/png');
    onSaveProject({
      title: `Poster: ${state.matchTitle}`,
      type: 'poster',
      data: state,
      previewUrl,
      dimensions: '1080 × 1350 HD',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const applyPreset = (presetId: string) => {
    const found = PRESET_POSTERS.find((p) => p.id === presetId);
    if (!found) return;
    setState((p) => ({
      ...p,
      matchTitle: found.matchTitle,
      tournamentName: found.tournamentName,
      team1: found.team1,
      team2: found.team2,
      date: found.date,
      time: found.time,
      venue: found.venue,
      prizePool: found.prizePool,
      layout: found.layout,
      theme: found.theme,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400">
              <Trophy className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black font-orbitron text-white">
              AI GAMING POSTER MAKER
            </h2>
            <span className="text-[10px] font-mono text-amber-300 bg-amber-950 px-2 py-0.5 rounded border border-amber-500/40">
              1080 × 1350 HD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Design match posters, tournament finals, and Team-versus-Team esports graphics.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-300 hover:text-white text-xs font-bold transition-all"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>AI Gen</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-amber-400 text-xs font-bold transition-all"
          >
            {saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={() => handleDownload('4k')}
            disabled={isExporting}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs shadow-lg shadow-amber-500/25 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
            title="Download 4K Ultra High-Resolution Poster PNG (2160 × 2700)"
          >
            {isExporting ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 fill-black" />
            )}
            <span>
              {isExporting
                ? 'Exporting 4K...'
                : downloadSuccess
                ? 'Downloaded!'
                : 'Export 4K Poster'}
            </span>
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-mono text-slate-400 uppercase whitespace-nowrap">Presets:</span>
        {PRESET_POSTERS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap bg-[#0b1029] border border-amber-500/20 text-slate-300 hover:border-amber-400 hover:text-amber-300 transition-all"
          >
            🏆 {preset.name}
          </button>
        ))}
      </div>

      {/* Canvas Poster Preview */}
      <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-amber-500/40 shadow-[0_0_25px_rgba(245,158,11,0.2)] max-w-sm mx-auto flex items-center justify-center aspect-[4/5]">
        {isRendering && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10 text-amber-400 text-xs font-mono gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>RENDERING POSTER...</span>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full object-contain" />

        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-mono text-slate-400">
          1080 × 1350 (4:5)
        </div>
      </div>

      {/* Poster Configuration Controls */}
      <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Tournament Name
            </label>
            <input
              type="text"
              value={state.tournamentName}
              onChange={(e) => setState((p) => ({ ...p, tournamentName: e.target.value }))}
              placeholder="e.g. GOALSTAR WORLD TOUR 2025"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Match Title
            </label>
            <input
              type="text"
              value={state.matchTitle}
              onChange={(e) => setState((p) => ({ ...p, matchTitle: e.target.value }))}
              placeholder="e.g. GRAND CHAMPIONS ESPORTS CUP"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        {/* Teams and Scores */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/30 space-y-2">
            <label className="block text-xs font-bold text-cyan-400 font-orbitron">
              Team 1 (Left)
            </label>
            <input
              type="text"
              value={state.team1}
              onChange={(e) => setState((p) => ({ ...p, team1: e.target.value }))}
              className="w-full bg-[#0d1430] border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none"
            />
            <input
              type="text"
              value={state.team1Score || ''}
              onChange={(e) => setState((p) => ({ ...p, team1Score: e.target.value }))}
              placeholder="Score (e.g. 3)"
              className="w-full bg-[#0d1430] border border-slate-700 rounded-lg p-1.5 text-xs text-cyan-300 font-bold focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30 space-y-2">
            <label className="block text-xs font-bold text-purple-400 font-orbitron">
              Team 2 (Right)
            </label>
            <input
              type="text"
              value={state.team2}
              onChange={(e) => setState((p) => ({ ...p, team2: e.target.value }))}
              className="w-full bg-[#0d1430] border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none"
            />
            <input
              type="text"
              value={state.team2Score || ''}
              onChange={(e) => setState((p) => ({ ...p, team2Score: e.target.value }))}
              placeholder="Score (e.g. 2)"
              className="w-full bg-[#0d1430] border border-slate-700 rounded-lg p-1.5 text-xs text-purple-300 font-bold focus:outline-none"
            />
          </div>
        </div>

        {/* Schedule & Prize Pool */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>Date & Time</span>
            </label>
            <input
              type="text"
              value={`${state.date} • ${state.time}`}
              onChange={(e) => {
                const parts = e.target.value.split('•');
                setState((p) => ({ ...p, date: parts[0]?.trim() || '', time: parts[1]?.trim() || '' }));
              }}
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-400" />
              <span>Prize Pool</span>
            </label>
            <input
              type="text"
              value={state.prizePool}
              onChange={(e) => setState((p) => ({ ...p, prizePool: e.target.value }))}
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-amber-300 font-bold focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              <span>Venue / Arena</span>
            </label>
            <input
              type="text"
              value={state.venue}
              onChange={(e) => setState((p) => ({ ...p, venue: e.target.value }))}
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Theme select */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Poster Visual Theme
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'neon_champions', label: 'Neon Champions' },
              { id: 'dark_esports', label: 'Dark Esports Pro' },
              { id: 'cyber_purple', label: 'Cyber Derby' },
              { id: 'golden_trophy', label: 'Golden Trophy' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setState((p) => ({ ...p, theme: th.id as any }))}
                className={`p-2 rounded-xl border text-xs font-bold transition-all ${
                  state.theme === th.id
                    ? 'bg-amber-950/60 border-amber-400 text-amber-300'
                    : 'bg-black/60 border-slate-700 text-slate-400'
                }`}
              >
                {th.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
