import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Wand2, 
  Download, 
  Check, 
  AlertCircle, 
  RefreshCw, 
  Flame, 
  Layers 
} from 'lucide-react';
import { triggerFileDownload } from '../utils/canvasRenderer';
import confetti from 'canvas-confetti';

interface AIImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyImageToCanvas?: (imageUrl: string, type: string) => void;
  defaultType?: 'thumbnail' | 'poster' | 'shorts' | 'logo';
}

export const AIImageModal: React.FC<AIImageModalProps> = ({
  isOpen,
  onClose,
  onApplyImageToCanvas,
  defaultType = 'thumbnail',
}) => {
  const [prompt, setPrompt] = useState(
    'Cristiano Ronaldo and Kylian Mbappe facing each other in a futuristic football esports stadium with neon blue and purple lightning sparks, cinematic 8k resolution'
  );
  const [aspectRatio, setAspectRatio] = useState<'16:9' | '3:4' | '9:16' | '1:1'>('16:9');
  const [style, setStyle] = useState('esports');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [appliedSuccess, setAppliedSuccess] = useState(false);

  if (!isOpen) return null;

  // Prompt Enhancer via Gemini AI
  const handleEnhance = async () => {
    if (!prompt) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea: prompt, mode: defaultType }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsEnhancing(false);
    }
  };

  // Generate Image via Gemini
  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          aspectRatio,
          type: defaultType,
          customStyle: style,
        }),
      });

      const data = await res.json();
      if (res.ok && data.imageUrl) {
        setGeneratedImage(data.imageUrl);
        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#00F0FF', '#B026FF'],
          });
        } catch {}
      } else {
        setErrorMsg(
          data.error || 'Image generation requires a Gemini API Key. You can configure it in the Secrets panel.'
        );
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Network error while generating image.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApply = () => {
    if (!generatedImage || !onApplyImageToCanvas) return;
    onApplyImageToCanvas(generatedImage, defaultType);
    setAppliedSuccess(true);
    setTimeout(() => {
      setAppliedSuccess(false);
      onClose();
    }, 1200);
  };

  const handleDownloadOnly = () => {
    if (!generatedImage) return;
    triggerFileDownload(generatedImage, `GOALSTAR_AI_IMAGE_${Date.now()}.png`);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-lg w-full bg-[#0a0e24] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 text-black">
              <Sparkles className="w-4 h-4 fill-black" />
            </span>
            <div>
              <h3 className="font-orbitron font-bold text-sm text-white">
                AI GAMING IMAGE GENERATOR
              </h3>
              <span className="text-[10px] font-mono text-cyan-300">
                GEMINI 3.1 FLASH LITE IMAGE
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form & Controls */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          <form onSubmit={handleGenerate} className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-300">
                  Visual Prompt (Football / Esports)
                </label>
                <button
                  type="button"
                  onClick={handleEnhance}
                  disabled={isEnhancing || !prompt}
                  className="text-[11px] text-cyan-400 hover:text-cyan-300 font-mono flex items-center gap-1 disabled:opacity-50"
                >
                  <Wand2 className="w-3 h-3" />
                  <span>{isEnhancing ? 'Enhancing...' : 'Enhance with Gemini'}</span>
                </button>
              </div>

              <textarea
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe your football gaming graphic..."
                className="w-full bg-black/60 border border-slate-700 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-cyan-400 resize-none font-sans leading-relaxed"
                required
              />
            </div>

            {/* Fast Prompt Ideas */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 uppercase">Quick Ideas:</span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  'Ronaldo 99 Pace free kick in cyber stadium',
                  'Mbappe sprint vs Walker with lightning trail',
                  'Secret 105 Icon card with gold explosion',
                  'Champions League esports tournament arena',
                ].map((idea, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setPrompt(idea)}
                    className="px-2 py-1 rounded-lg bg-black/50 border border-slate-800 text-[10px] text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 whitespace-nowrap"
                  >
                    {idea}
                  </button>
                ))}
              </div>
            </div>

            {/* Aspect Ratio and Style */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Aspect Ratio
                </label>
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full bg-black/60 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                >
                  <option value="16:9">16:9 (YouTube Thumbnail)</option>
                  <option value="3:4">3:4 (Match Day Poster)</option>
                  <option value="9:16">9:16 (YouTube Shorts)</option>
                  <option value="1:1">1:1 (Logo / Profile Picture)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Art Style Preset
                </label>
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-black/60 border border-slate-700 rounded-xl p-2 text-xs text-white focus:outline-none"
                >
                  <option value="esports">Esports Cyberpunk</option>
                  <option value="photorealistic stadium">Photorealistic Arena</option>
                  <option value="dark anime football">Dark Anime Action</option>
                  <option value="golden luxury">Golden Trophy Glory</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={isGenerating}
              className="w-full py-2.5 bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 text-black font-black text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 hover:brightness-110 active:scale-98 transition-all disabled:opacity-60"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Synthesizing Gaming Art with Gemini...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 fill-black" />
                  <span>Generate AI Image</span>
                </>
              )}
            </button>
          </form>

          {/* Error notice */}
          {errorMsg && (
            <div className="p-3 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-bold">Generation Notice</p>
                <p className="text-[11px] text-rose-300/90 leading-relaxed">
                  {errorMsg}
                </p>
              </div>
            </div>
          )}

          {/* Generated Image Preview Area */}
          {generatedImage && (
            <div className="p-3 rounded-2xl bg-black/80 border border-cyan-500/40 space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-400">
                <span>AI GENERATION RESULT</span>
                <span>{aspectRatio}</span>
              </div>

              <div className="rounded-xl overflow-hidden bg-black max-h-64 flex items-center justify-center">
                <img
                  src={generatedImage}
                  alt="AI Generated Gaming Graphic"
                  className="max-h-64 max-w-full object-contain rounded-xl"
                />
              </div>

              <div className="flex items-center justify-between gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleDownloadOnly}
                  className="flex-1 py-2 px-3 rounded-xl bg-slate-800 text-slate-200 hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Image</span>
                </button>

                {onApplyImageToCanvas && (
                  <button
                    type="button"
                    onClick={handleApply}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-black text-xs flex items-center justify-center gap-1.5 shadow-md shadow-cyan-500/30 transition-all hover:brightness-110"
                  >
                    {appliedSuccess ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Applied!</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-3.5 h-3.5" />
                        <span>Apply to Canvas</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
