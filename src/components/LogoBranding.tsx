import React, { useState, useRef, useEffect } from 'react';
import { LogoState } from '../types';
import { renderLogoCanvas, triggerFileDownload } from '../utils/canvasRenderer';
import { PRESET_LOGOS } from '../utils/assets';
import confetti from 'canvas-confetti';
import { 
  ShieldCheck, 
  Download, 
  Save, 
  RefreshCw, 
  Wand2, 
  CheckCircle2, 
  Sparkles, 
  Palette, 
  Disc, 
  Tv 
} from 'lucide-react';

interface LogoBrandingProps {
  channelName: string;
  onSaveProject: (item: { title: string; type: 'logo' | 'banner'; data: any; previewUrl: string; dimensions: string }) => void;
  onOpenAIModal: () => void;
}

export const LogoBranding: React.FC<LogoBrandingProps> = ({
  channelName,
  onSaveProject,
  onOpenAIModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const [state, setState] = useState<LogoState>({
    brandName: channelName || 'GOALSTAR GAMING',
    slogan: 'UNLEASH THE GOAL',
    mascot: 'star_ball',
    primaryColor: '#00F0FF',
    secondaryColor: '#B026FF',
    badgeStyle: 'shield',
    format: 'logo_square',
  });

  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderLogoCanvas(canvasRef.current, state);
      } catch (err) {
        console.error('Logo render error:', err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };
    render();
    return () => {
      isMounted = false;
    };
  }, [state]);

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const safeName = state.brandName.replace(/[^a-zA-Z0-9]/g, '_');
    triggerFileDownload(dataUrl, `GOALSTAR_${safeName}_LOGO_800x800.png`);

    try {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#00F0FF', '#B026FF'],
      });
    } catch {}

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const previewUrl = canvasRef.current.toDataURL('image/png');
    onSaveProject({
      title: `${state.brandName} - Channel Branding`,
      type: state.format === 'yt_banner' ? 'banner' : 'logo',
      data: state,
      previewUrl,
      dimensions: state.format === 'pfp_circle' ? '800 × 800 (PFP)' : '800 × 800 HD',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const applyPreset = (presetId: string) => {
    const found = PRESET_LOGOS.find((l) => l.id === presetId);
    if (!found) return;
    setState((p) => ({
      ...p,
      brandName: found.brandName,
      slogan: found.slogan,
      mascot: found.mascot,
      primaryColor: found.primaryColor,
      secondaryColor: found.secondaryColor,
      badgeStyle: found.badgeStyle,
      format: found.format,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black font-orbitron text-white">
              LOGO & CHANNEL BRANDING
            </h2>
            <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/40">
              800 × 800 HD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Create YouTube profile pictures, mascot emblems, and branding shields for GOALSTAR GAMING.
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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-emerald-400 text-xs font-bold transition-all"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-black font-black text-xs shadow-lg shadow-emerald-500/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5 fill-black" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Export Logo'}</span>
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-mono text-slate-400 uppercase whitespace-nowrap">Presets:</span>
        {PRESET_LOGOS.map((preset) => (
          <button
            key={preset.id}
            onClick={() => applyPreset(preset.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap bg-[#0b1029] border border-emerald-500/20 text-slate-300 hover:border-emerald-400 hover:text-emerald-300 transition-all flex items-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            {preset.brandName}
          </button>
        ))}
      </div>

      {/* Format Selector: Square Logo vs PFP Circle Guide vs Banner */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setState((p) => ({ ...p, format: 'logo_square' }))}
          className={`flex-1 py-2 text-xs font-orbitron font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            state.format === 'logo_square'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          Mascot Logo (1:1)
        </button>

        <button
          onClick={() => setState((p) => ({ ...p, format: 'pfp_circle' }))}
          className={`flex-1 py-2 text-xs font-orbitron font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            state.format === 'pfp_circle'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Disc className="w-3.5 h-3.5" />
          YouTube PFP Circle
        </button>
      </div>

      {/* Canvas Logo Display */}
      <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.2)] max-w-xs mx-auto flex items-center justify-center aspect-square">
        {isRendering && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10 text-emerald-400 text-xs font-mono gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>RENDERING LOGO...</span>
          </div>
        )}
        <canvas ref={canvasRef} className="w-full h-full object-contain" />

        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-mono text-slate-400">
          800 × 800 HD
        </div>
      </div>

      {/* Logo Controls */}
      <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Brand / Channel Name
            </label>
            <input
              type="text"
              value={state.brandName}
              onChange={(e) => setState((p) => ({ ...p, brandName: e.target.value }))}
              placeholder="e.g. GOALSTAR GAMING"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-black tracking-wider focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Channel Slogan / Tagline
            </label>
            <input
              type="text"
              value={state.slogan}
              onChange={(e) => setState((p) => ({ ...p, slogan: e.target.value }))}
              placeholder="e.g. UNLEASH THE GOAL"
              className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-400"
            />
          </div>
        </div>

        {/* Mascot Center Emblem */}
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1">
            Mascot Emblem
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'star_ball', label: 'Star Football', emoji: '⚽★' },
              { id: 'shield_controller', label: 'Cyber Gamepad', emoji: '🎮' },
              { id: 'lightning_boot', label: 'Electric Boot', emoji: '⚡' },
              { id: 'crown_fire', label: 'Crown Champion', emoji: '👑' },
            ].map((m) => (
              <button
                key={m.id}
                onClick={() => setState((p) => ({ ...p, mascot: m.id as any }))}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  state.mascot === m.id
                    ? 'bg-emerald-950/70 border-emerald-400 text-emerald-300 shadow-md'
                    : 'bg-black/60 border-slate-700 text-slate-400 hover:text-white'
                }`}
              >
                <span className="text-xl block mb-1">{m.emoji}</span>
                <span className="text-[11px] font-bold block">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Colors */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Primary Neon Color
            </label>
            <div className="flex items-center gap-2">
              {['#00F0FF', '#FFE600', '#00FF66', '#FF0055'].map((color) => (
                <button
                  key={color}
                  onClick={() => setState((p) => ({ ...p, primaryColor: color }))}
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    state.primaryColor === color ? 'scale-125 ring-2 ring-white' : 'opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-mono text-slate-400 mb-1">
              Secondary Accent Color
            </label>
            <div className="flex items-center gap-2">
              {['#B026FF', '#00F0FF', '#FF007A', '#3B82F6'].map((color) => (
                <button
                  key={color}
                  onClick={() => setState((p) => ({ ...p, secondaryColor: color }))}
                  style={{ backgroundColor: color }}
                  className={`w-6 h-6 rounded-full transition-transform ${
                    state.secondaryColor === color ? 'scale-125 ring-2 ring-white' : 'opacity-70'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
