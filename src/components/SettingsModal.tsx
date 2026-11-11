import React from 'react';
import { StudioSettings } from '../types';
import { 
  X, 
  Settings, 
  Sparkles, 
  Smartphone, 
  ShieldCheck, 
  Server, 
  Trash2, 
  RotateCcw,
  CheckCircle2,
  Cpu
} from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: StudioSettings;
  onUpdateSettings: (newSettings: StudioSettings) => void;
  onResetProjects: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onUpdateSettings,
  onResetProjects,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="max-w-md w-full bg-[#0a0e24] border border-cyan-500/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400">
              <Settings className="w-4 h-4" />
            </span>
            <h3 className="font-orbitron font-bold text-sm text-white">
              STUDIO & AI ENGINE SETTINGS
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-4 overflow-y-auto flex-1">
          {/* Creator Profile */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
              1. Creator Channel Profile
            </span>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Channel Name
              </label>
              <input
                type="text"
                value={settings.channelName}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, channelName: e.target.value })
                }
                className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400 font-bold"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Channel Slogan / Watermark
              </label>
              <input
                type="text"
                value={settings.channelTagline}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, channelTagline: e.target.value })
                }
                className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Default Football Game
              </label>
              <select
                value={settings.defaultGame}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, defaultGame: e.target.value })
                }
                className="w-full bg-black/60 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none"
              >
                <option value="EA Sports FC 25">EA Sports FC 25</option>
                <option value="eFootball 2025">eFootball 2025</option>
                <option value="FIFA World Cup">FIFA World Cup</option>
                <option value="Ultimate Team">Ultimate Team</option>
              </select>
            </div>
          </div>

          {/* AI Services & Cloud Engine */}
          <div className="space-y-2.5 pt-3 border-t border-slate-800">
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider block">
              2. AI Engine Services
            </span>

            <div className="p-3 rounded-2xl bg-black/60 border border-purple-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-orbitron">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  Text & SEO Intelligence
                </span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                  CONNECTED
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Model: <span className="font-mono text-cyan-300">gemini-3.8-flash</span>
              </p>
            </div>

            <div className="p-3 rounded-2xl bg-black/60 border border-cyan-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-orbitron">
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  Visual AI Generator
                </span>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-500/30">
                  IMAGE ENGINE
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Model: <span className="font-mono text-cyan-300">gemini-3.1-flash-lite-image</span>
              </p>
            </div>

            {/* AI Security Information Card */}
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-700/60 flex items-start gap-2.5">
              <Server className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-xs font-bold text-white">Cloud Secrets Protected</p>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  Your Gemini API keys run securely on the server-side proxy. You can configure attached API keys via the <strong>Settings &gt; Secrets</strong> panel.
                </p>
              </div>
            </div>
          </div>

          {/* Android Mobile Frame Simulation */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider block">
              3. Android Mobile Device Display
            </span>

            <div className="flex items-center justify-between p-3 rounded-xl bg-black/50 border border-slate-800">
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-amber-400" />
                <div>
                  <p className="text-xs font-bold text-white">Android Flagship Mockup Frame</p>
                  <p className="text-[11px] text-slate-400">Renders smartphone bezel & buttons</p>
                </div>
              </div>
              <input
                type="checkbox"
                checked={settings.androidFrameMode}
                onChange={(e) =>
                  onUpdateSettings({ ...settings, androidFrameMode: e.target.checked })
                }
                className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
              />
            </div>
          </div>

          {/* Project Storage Controls */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              4. Studio Cache & Storage
            </span>

            <button
              onClick={() => {
                if (confirm('Reset default sample projects?')) {
                  onResetProjects();
                }
              }}
              className="w-full py-2 px-3 rounded-xl bg-slate-800/80 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white text-xs font-bold flex items-center justify-center gap-2 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Reset Sample Projects</span>
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-black font-extrabold text-xs rounded-xl shadow-md"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
