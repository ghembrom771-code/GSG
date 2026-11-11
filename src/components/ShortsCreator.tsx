import React, { useState, useRef, useEffect } from 'react';
import { ShortsState } from '../types';
import { renderShortsCanvas, triggerFileDownload } from '../utils/canvasRenderer';
import { PRESET_SHORTS } from '../utils/assets';
import confetti from 'canvas-confetti';
import { 
  Smartphone, 
  Download, 
  Save, 
  RefreshCw, 
  Wand2, 
  CheckCircle2, 
  Flame, 
  Layers, 
  BellRing 
} from 'lucide-react';

interface ShortsCreatorProps {
  channelName: string;
  onSaveProject: (item: { title: string; type: 'shorts'; data: any; previewUrl: string; dimensions: string }) => void;
  onOpenAIModal: () => void;
}

export const ShortsCreator: React.FC<ShortsCreatorProps> = ({
  channelName,
  onSaveProject,
  onOpenAIModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [state, setState] = useState<ShortsState>({
    headline: 'RONALDO BROKE THE ENGINE! 😱',
    subheadline: 'Can you score this 45m curve in FC 25?',
    game: 'EA Sports FC 25',
    layout: 'split_vs',
    player1: 'CR7',
    player2: 'MBAPPE',
    badgeText: '99 CURVE',
    accentColor: '#00F0FF',
    outroCTA: 'SUBSCRIBE FOR DAILY GOALS! 🔥',
  });

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderShortsCanvas(canvasRef.current, state, { channelName });
      } catch (err) {
        console.error('Shorts render error:', err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };
    render();
    return () => {
      isMounted = false;
    };
  }, [state, channelName]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const safeTitle = state.headline.replace(/[^a-zA-Z0-9]/g, '_');
    triggerFileDownload(dataUrl, `GOALSTAR_${safeTitle}_SHORTS_9x16.png`);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF007A', '#00F0FF'],
      });
    } catch {}

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const previewUrl = canvasRef.current.toDataURL('image/png');
    onSaveProject({
      title: `Shorts: ${state.headline}`,
      type: 'shorts',
      data: state,
      previewUrl,
      dimensions: '1080 × 1920 (9:16)',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const applyPreset = (presetId: string) => {
    const found = PRESET_SHORTS.find((p) => p.id === presetId);
    if (!found) return;
    setState((p) => ({
      ...p,
      headline: found.headline,
      subheadline: found.subheadline,
      game: found.game,
      layout: found.layout,
      player1: found.player1,
      player2: found.player2,
      badgeText: found.badgeText,
      accentColor: found.accentColor,
      outroCTA: found.outroCTA,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-rose-500/20 text-rose-400">
              <Smartphone className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black font-orbitron text-white">
              YOUTUBE SHORTS CREATOR
            </h2>
            <span className="text-[10px] font-mono text-rose-300 bg-rose-950 px-2 py-0.5 rounded border border-rose-500/40">
              9:16 VERTICAL
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Create high-retention 9:16 YouTube Shorts intro, outro, and split VS layouts.
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-rose-400 text-xs font-bold transition-all"
          >
            {saveSuccess ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Save className="w-3.5 h-3.5" />
            )}
            <span>{saveSuccess ? 'Saved!' : 'Save'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-black text-xs shadow-lg shadow-rose-500/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Export 9:16'}</span>
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-mono text-slate-400 uppercase whitespace-nowrap">Presets:</span>
        {PRESET_SHORTS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap bg-[#0b1029] border border-rose-500/20 text-slate-300 hover:border-rose-400 hover:text-rose-300 transition-all flex items-center gap-1"
          >
            <Flame className="w-3 h-3 text-rose-400" />
            {preset.headline.slice(0, 24)}...
          </button>
        ))}
      </div>

      {/* Canvas 9:16 Preview */}
      <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-rose-500/40 shadow-[0_0_25px_rgba(244,63,94,0.2)] max-w-xs mx-auto flex items-center justify-center aspect-[9/16]">
        {isRendering && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10 text-rose-400 text-xs font-mono gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>RENDERING 9:16 SHORTS...</span>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full object-contain" />

        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-mono text-slate-400">
          1080 × 1920 (9:16)
        </div>
      </div>

      {/* Controls */}
      <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-3">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Top Hook Headline (Sticky in first 3 seconds)
          </label>
          <input
            type="text"
            value={state.headline}
            onChange={(e) => setState((p) => ({ ...p, headline: e.target.value }))}
            placeholder="e.g. RONALDO BROKE THE ENGINE!"
            className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-rose-400"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Subheadline / Question
          </label>
          <input
            type="text"
            value={state.subheadline}
            onChange={(e) => setState((p) => ({ ...p, subheadline: e.target.value }))}
            placeholder="e.g. Can you score this 45m curve in FC 25?"
            className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-rose-400"
          />
        </div>

        {/* Layout Style */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Shorts Layout Mode
            </label>
            <select
              value={state.layout}
              onChange={(e) => setState((p) => ({ ...p, layout: e.target.value as any }))}
              className="w-full bg-black/60 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
            >
              <option value="split_vs">Split Screen VS (Top / Bottom)</option>
              <option value="facecam_gameplay">Gameplay + Reaction Cam</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Accent Neon Color
            </label>
            <div className="flex items-center gap-2 pt-1">
              {['#00F0FF', '#FF007A', '#FFE600', '#B026FF'].map((c) => (
                <button
                  key={c}
                  onClick={() => setState((p) => ({ ...p, accentColor: c }))}
                  style={{ backgroundColor: c }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    state.accentColor === c ? 'scale-125 ring-2 ring-white' : 'opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Outro CTA */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center gap-1.5">
            <BellRing className="w-3.5 h-3.5 text-rose-400" />
            <span>Outro Call to Action Banner</span>
          </label>
          <input
            type="text"
            value={state.outroCTA}
            onChange={(e) => setState((p) => ({ ...p, outroCTA: e.target.value }))}
            placeholder="e.g. SUBSCRIBE FOR DAILY GOALS! 🔥"
            className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-rose-300 font-bold focus:outline-none"
          />
        </div>
      </div>
    </div>
  );
};
