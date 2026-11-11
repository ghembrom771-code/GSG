import React, { useState, useRef, useEffect } from 'react';
import { ThumbnailState } from '../types';
import { renderThumbnailCanvas, triggerFileDownload } from '../utils/canvasRenderer';
import { PRESET_THUMBNAILS } from '../utils/assets';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Download, 
  Save, 
  Upload, 
  RefreshCw, 
  Palette, 
  Type, 
  Sliders, 
  Image as ImageIcon,
  Flame,
  CheckCircle2,
  Wand2
} from 'lucide-react';

interface ThumbnailMakerProps {
  channelName: string;
  initialState?: Partial<ThumbnailState>;
  onSaveProject: (item: { title: string; type: 'thumbnail'; data: any; previewUrl: string; dimensions: string }) => void;
  onOpenAIModal: () => void;
}

export const ThumbnailMaker: React.FC<ThumbnailMakerProps> = ({
  channelName,
  initialState,
  onSaveProject,
  onOpenAIModal,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isRendering, setIsRendering] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'text' | 'players' | 'theme' | 'badges'>('text');

  const [state, setState] = useState<ThumbnailState>({
    mainTitle: initialState?.mainTitle || 'RONALDO VS MBAPPE',
    subtitle: initialState?.subtitle || 'WHO IS FASTER IN FC 25?',
    highlightWord: initialState?.highlightWord || '99 SPEED',
    game: initialState?.game || 'EA Sports FC 25',
    preset: initialState?.preset || 'ronaldo_mbappe',
    player1: initialState?.player1 || 'CR7',
    player2: initialState?.player2 || 'MBAPPE',
    player1Image: initialState?.player1Image || undefined,
    player2Image: initialState?.player2Image || undefined,
    backgroundImage: initialState?.backgroundImage || undefined,
    backgroundTheme: initialState?.backgroundTheme || 'cyber_stadium',
    fontFamily: initialState?.fontFamily || 'Chakra Petch',
    textColor: initialState?.textColor || '#FFFFFF',
    glowColor: initialState?.glowColor || '#00F0FF',
    textAngle: initialState?.textAngle || -3,
    badge: initialState?.badge || '99_OVR',
    secondaryBadge: initialState?.secondaryBadge || 'FIRE',
    showVsBadge: initialState?.showVsBadge ?? true,
    contrastBoost: initialState?.contrastBoost || 1.1,
    vignette: initialState?.vignette ?? true,
    watermark: initialState?.watermark ?? true,
  });

  // Re-render thumbnail whenever state changes
  useEffect(() => {
    let isMounted = true;
    const render = async () => {
      if (!canvasRef.current) return;
      setIsRendering(true);
      try {
        await renderThumbnailCanvas(canvasRef.current, state, { channelName });
      } catch (err) {
        console.error('Render error:', err);
      } finally {
        if (isMounted) setIsRendering(false);
      }
    };
    render();
    return () => {
      isMounted = false;
    };
  }, [state, channelName]);

  // Handle Photo Upload (Background or Player)
  const handleFileUpload = (type: 'background' | 'player1' | 'player2') => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      if (type === 'background') {
        setState((prev) => ({ ...prev, backgroundImage: dataUrl }));
      } else if (type === 'player1') {
        setState((prev) => ({ ...prev, player1Image: dataUrl }));
      } else if (type === 'player2') {
        setState((prev) => ({ ...prev, player2Image: dataUrl }));
      }
    };
    reader.readAsDataURL(file);
  };

  // 1-Click Export 1280x720 PNG
  const handleDownload = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL('image/png');
    const safeTitle = (state.mainTitle || 'GOALSTAR_THUMBNAIL').replace(/[^a-zA-Z0-9]/g, '_');
    triggerFileDownload(dataUrl, `GOALSTAR_${safeTitle}_1280x720.png`);

    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.7 },
        colors: ['#00F0FF', '#B026FF', '#FFE600'],
      });
    } catch {}

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  // Save to My Projects
  const handleSave = () => {
    if (!canvasRef.current) return;
    const previewUrl = canvasRef.current.toDataURL('image/png');
    onSaveProject({
      title: `${state.mainTitle} - ${state.subtitle || 'Thumbnail'}`,
      type: 'thumbnail',
      data: state,
      previewUrl,
      dimensions: '1280 × 720 HD',
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  // Load a fast preset
  const applyPreset = (presetId: string) => {
    const found = PRESET_THUMBNAILS.find((p) => p.id === presetId);
    if (!found) return;
    setState((prev) => ({
      ...prev,
      mainTitle: found.mainTitle,
      subtitle: found.subtitle,
      highlightWord: found.highlightWord,
      game: found.game,
      player1: found.player1,
      player2: found.player2,
      badge: found.badge,
      secondaryBadge: found.secondaryBadge,
      backgroundTheme: found.backgroundTheme,
      textColor: found.textColor,
      glowColor: found.glowColor,
      player1Image: undefined,
      player2Image: undefined,
      backgroundImage: undefined,
    }));
  };

  return (
    <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-4 space-y-4 pb-24">
      {/* Top Title & Preset Selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h2 className="text-base sm:text-lg font-black font-orbitron text-white">
              AI THUMBNAIL MAKER
            </h2>
            <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/40">
              1280 × 720 HD
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Craft high-CTR football gaming thumbnails with Ronaldo, Mbappe, custom layers & 3D styling.
          </p>
        </div>

        {/* Action Buttons: Save & Download */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-900/60 border border-purple-500/40 text-purple-300 hover:text-white hover:bg-purple-800 text-xs font-bold transition-all"
            title="Generate AI Background / Assets"
          >
            <Wand2 className="w-3.5 h-3.5 text-purple-400" />
            <span>AI Gen</span>
          </button>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 hover:text-cyan-400 hover:border-cyan-500/40 text-xs font-bold transition-all active:scale-95"
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
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-black text-xs shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <Download className="w-3.5 h-3.5 fill-black" />
            <span>{downloadSuccess ? 'Downloaded!' : 'Export HD'}</span>
          </button>
        </div>
      </div>

      {/* Preset Chips */}
      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
        <span className="text-[11px] font-mono text-slate-400 uppercase whitespace-nowrap">Presets:</span>
        {PRESET_THUMBNAILS.map((p) => (
          <button
            key={p.id}
            onClick={() => applyPreset(p.id)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold whitespace-nowrap bg-[#0b1029] border border-cyan-500/20 text-slate-300 hover:border-cyan-400 hover:text-cyan-300 transition-all flex items-center gap-1"
          >
            <Flame className="w-3 h-3 text-amber-400" />
            {p.name}
          </button>
        ))}
      </div>

      {/* Main Interactive Canvas Display */}
      <div className="relative rounded-2xl overflow-hidden bg-black border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(0,240,255,0.2)] aspect-video flex items-center justify-center">
        {isRendering && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-10 text-cyan-400 text-xs font-mono gap-2">
            <RefreshCw className="w-4 h-4 animate-spin" />
            <span>RENDERING 1280×720 HD...</span>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="w-full h-full object-contain"
        />

        {/* Live Resolution Overlay Pill */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/80 border border-slate-700 text-[10px] font-mono text-slate-400">
          1280 × 720 (16:9)
        </div>
      </div>

      {/* Control Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('text')}
          className={`flex-1 py-2 text-xs font-orbitron font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'text'
              ? 'border-cyan-400 text-cyan-400 bg-cyan-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Type className="w-3.5 h-3.5" />
          Text & 3D Glow
        </button>
        <button
          onClick={() => setActiveTab('players')}
          className={`flex-1 py-2 text-xs font-orbitron font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'players'
              ? 'border-purple-400 text-purple-400 bg-purple-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ImageIcon className="w-3.5 h-3.5" />
          Players & Photo
        </button>
        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-2 text-xs font-orbitron font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'theme'
              ? 'border-amber-400 text-amber-400 bg-amber-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Stadium & BG
        </button>
        <button
          onClick={() => setActiveTab('badges')}
          className={`flex-1 py-2 text-xs font-orbitron font-bold border-b-2 transition-colors flex items-center justify-center gap-1.5 ${
            activeTab === 'badges'
              ? 'border-emerald-400 text-emerald-400 bg-emerald-950/20'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          Badges & FX
        </button>
      </div>

      {/* Tab 1: Text Controls */}
      {activeTab === 'text' && (
        <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Main Title (High Impact)
            </label>
            <input
              type="text"
              value={state.mainTitle}
              onChange={(e) => setState((p) => ({ ...p, mainTitle: e.target.value }))}
              placeholder="e.g. RONALDO VS MBAPPE"
              className="w-full bg-black/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-black tracking-wider focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Subtitle / Hook Line
            </label>
            <input
              type="text"
              value={state.subtitle}
              onChange={(e) => setState((p) => ({ ...p, subtitle: e.target.value }))}
              placeholder="e.g. WHO IS FASTER IN FC 25?"
              className="w-full bg-black/70 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Neon Glow Color
              </label>
              <div className="flex items-center gap-2">
                {['#00F0FF', '#B026FF', '#FFE600', '#FF0055', '#00FF66'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setState((p) => ({ ...p, glowColor: color }))}
                    style={{ backgroundColor: color }}
                    className={`w-6 h-6 rounded-full transition-transform ${
                      state.glowColor === color ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono text-slate-400 mb-1">
                Tilt Angle ({state.textAngle}°)
              </label>
              <input
                type="range"
                min="-12"
                max="12"
                value={state.textAngle}
                onChange={(e) => setState((p) => ({ ...p, textAngle: parseInt(e.target.value) }))}
                className="w-full accent-cyan-400"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Players & Photo Uploads */}
      {activeTab === 'players' && (
        <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {/* Player 1 (Left) */}
            <div className="p-3 rounded-xl bg-black/50 border border-cyan-500/30 space-y-2">
              <span className="text-xs font-bold text-cyan-400 font-orbitron flex items-center justify-between">
                <span>Player 1 (Left)</span>
                <span className="text-[10px] text-slate-400">CR7 Side</span>
              </span>

              <select
                value={state.player1}
                onChange={(e) => setState((p) => ({ ...p, player1: e.target.value, player1Image: undefined }))}
                className="w-full bg-[#0d1430] border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none"
              >
                <option value="CR7">Cristiano Ronaldo (CR7)</option>
                <option value="MESSI">Lionel Messi</option>
                <option value="HAALAND">Erling Haaland</option>
                <option value="BELLINGHAM">Jude Bellingham</option>
                <option value="VINICIUS">Vinicius Jr</option>
              </select>

              {/* Upload Custom Cutout */}
              <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-cyan-950/40 border border-dashed border-cyan-500/40 text-cyan-300 text-[11px] cursor-pointer hover:bg-cyan-900/40 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Player Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload('player1')}
                  className="hidden"
                />
              </label>
              {state.player1Image && (
                <div className="flex items-center justify-between text-[10px] text-emerald-400">
                  <span>Custom image active</span>
                  <button
                    onClick={() => setState((p) => ({ ...p, player1Image: undefined }))}
                    className="text-rose-400 hover:underline"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>

            {/* Player 2 (Right) */}
            <div className="p-3 rounded-xl bg-black/50 border border-purple-500/30 space-y-2">
              <span className="text-xs font-bold text-purple-400 font-orbitron flex items-center justify-between">
                <span>Player 2 (Right)</span>
                <span className="text-[10px] text-slate-400">Mbappe Side</span>
              </span>

              <select
                value={state.player2}
                onChange={(e) => setState((p) => ({ ...p, player2: e.target.value, player2Image: undefined }))}
                className="w-full bg-[#0d1430] border border-slate-700 rounded-lg p-1.5 text-xs text-white focus:outline-none"
              >
                <option value="MBAPPE">Kylian Mbappé</option>
                <option value="VINICIUS">Vinicius Jr</option>
                <option value="YAMAL">Lamine Yamal</option>
                <option value="CR7">Cristiano Ronaldo</option>
                <option value="SALAH">Mohamed Salah</option>
              </select>

              {/* Upload Custom Cutout */}
              <label className="flex items-center justify-center gap-1.5 p-2 rounded-lg bg-purple-950/40 border border-dashed border-purple-500/40 text-purple-300 text-[11px] cursor-pointer hover:bg-purple-900/40 transition-colors">
                <Upload className="w-3.5 h-3.5" />
                <span>Upload Player Photo</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload('player2')}
                  className="hidden"
                />
              </label>
              {state.player2Image && (
                <div className="flex items-center justify-between text-[10px] text-emerald-400">
                  <span>Custom image active</span>
                  <button
                    onClick={() => setState((p) => ({ ...p, player2Image: undefined }))}
                    className="text-rose-400 hover:underline"
                  >
                    Reset
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Stadium & Background Theme */}
      {activeTab === 'theme' && (
        <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-slate-300">
            Stadium Theme / Lighting Atmosphere
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'cyber_stadium', label: 'Cyber Stadium', color: 'from-blue-600 to-indigo-900' },
              { id: 'neon_arena', label: 'Neon Arena', color: 'from-purple-600 to-pink-900' },
              { id: 'red_inferno', label: 'Red Inferno', color: 'from-red-600 to-amber-900' },
              { id: 'gold_glory', label: 'Golden Glory', color: 'from-amber-500 to-yellow-900' },
            ].map((th) => (
              <button
                key={th.id}
                onClick={() => setState((p) => ({ ...p, backgroundTheme: th.id as any, backgroundImage: undefined }))}
                className={`p-3 rounded-xl border text-left bg-gradient-to-br ${th.color} transition-all ${
                  state.backgroundTheme === th.id && !state.backgroundImage
                    ? 'border-white ring-2 ring-cyan-400 shadow-md'
                    : 'border-slate-700 opacity-70 hover:opacity-100'
                }`}
              >
                <span className="text-xs font-bold text-white block">{th.label}</span>
                <span className="text-[10px] text-slate-200">Floodlights & Grid</span>
              </button>
            ))}
          </div>

          {/* Custom Background Upload */}
          <div className="pt-2">
            <label className="flex items-center justify-center gap-2 p-3 rounded-xl bg-black/60 border border-dashed border-slate-600 text-slate-300 text-xs cursor-pointer hover:border-cyan-400 hover:text-cyan-400 transition-colors">
              <Upload className="w-4 h-4" />
              <span>Upload Custom Gameplay / Stadium Screenshot</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload('background')}
                className="hidden"
              />
            </label>
            {state.backgroundImage && (
              <div className="flex items-center justify-between text-xs text-cyan-300 mt-2 px-1">
                <span>Custom background loaded</span>
                <button
                  onClick={() => setState((p) => ({ ...p, backgroundImage: undefined }))}
                  className="text-rose-400 hover:underline"
                >
                  Remove custom BG
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 4: Badges & Effects */}
      {activeTab === 'badges' && (
        <div className="bg-[#090d22] rounded-2xl p-4 border border-slate-800 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Top High-CTR Badge
              </label>
              <select
                value={state.badge}
                onChange={(e) => setState((p) => ({ ...p, badge: e.target.value as any }))}
                className="w-full bg-black/60 border border-slate-700 rounded-lg p-2 text-xs text-white focus:outline-none"
              >
                <option value="99_OVR">99 OVR Special Card</option>
                <option value="INSANE">🔥 INSANE PACK!</option>
                <option value="NEW_META">⚡ NEW FC 25 META</option>
                <option value="100K">🏆 100K PRIZE</option>
                <option value="FINAL">⚔️ GRAND FINAL</option>
                <option value="SECRET">🤫 SECRET GLITCH</option>
                <option value="NONE">No Badge</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Center VS Crest
              </label>
              <button
                onClick={() => setState((p) => ({ ...p, showVsBadge: !p.showVsBadge }))}
                className={`w-full p-2 rounded-lg border text-xs font-bold transition-all ${
                  state.showVsBadge
                    ? 'bg-cyan-950/60 border-cyan-400 text-cyan-300'
                    : 'bg-black/60 border-slate-700 text-slate-400'
                }`}
              >
                {state.showVsBadge ? '⚡ Center VS Badge Active' : 'Off'}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={state.watermark}
                onChange={(e) => setState((p) => ({ ...p, watermark: e.target.checked }))}
                className="accent-cyan-400 rounded"
              />
              <span>Goalstar Watermark</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-slate-300">
              <input
                type="checkbox"
                checked={state.vignette}
                onChange={(e) => setState((p) => ({ ...p, vignette: e.target.checked }))}
                className="accent-cyan-400 rounded"
              />
              <span>Cinematic Vignette & Borders</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
