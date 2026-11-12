import React, { useState } from 'react';
import { Settings, Zap, Flame, Crown, FolderDown, Check } from 'lucide-react';

interface HeaderProps {
  channelName: string;
  onOpenSettings: () => void;
  onOpenAIModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  channelName,
  onOpenSettings,
  onOpenAIModal,
}) => {
  const [isDownloadingZip, setIsDownloadingZip] = useState(false);

  const handleDownloadZip = () => {
    setIsDownloadingZip(true);
    const link = document.createElement('a');
    link.href = '/api/download-project-zip';
    link.setAttribute('download', 'goalstar-gaming-studio-source.zip');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setIsDownloadingZip(false), 2500);
  };

  return (
    <header className="px-4 py-3 bg-[#080B1C]/80 backdrop-blur-md border-b border-cyan-500/15 sticky top-0 z-30 flex items-center justify-between">
      {/* Brand logo & tagline */}
      <div className="flex items-center gap-2.5">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-purple-600 p-[1.5px] shadow-[0_0_15px_rgba(0,240,255,0.35)]">
          <div className="w-full h-full bg-[#060814] rounded-[10px] flex items-center justify-center relative overflow-hidden">
            <span className="font-orbitron font-black text-cyan-400 text-lg leading-none">G</span>
            <div className="absolute -bottom-1 -right-1 text-[10px]">⚽</div>
          </div>
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-orbitron text-sm sm:text-base font-black tracking-wide text-white flex items-center gap-1">
              GOALSTAR
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">
                STUDIO
              </span>
            </h1>
            <Crown className="w-3.5 h-3.5 text-amber-400" />
          </div>
          <p className="text-[10px] font-mono text-cyan-300/80 tracking-wider uppercase">
            {channelName} • CREATOR PRO
          </p>
        </div>
      </div>

      {/* Right Action Cluster */}
      <div className="flex items-center gap-2">
        {/* Direct Download GSG Source Code ZIP */}
        <button
          onClick={handleDownloadZip}
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/50 text-xs font-bold transition-all active:scale-95 shadow-sm"
          title="Download Complete Website & Studio Files (ZIP)"
        >
          {isDownloadingZip ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline text-emerald-400">Downloading...</span>
            </>
          ) : (
            <>
              <FolderDown className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">Files ZIP</span>
            </>
          )}
        </button>

        {onOpenAIModal && (
          <button
            onClick={onOpenAIModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-purple-600 text-black font-extrabold text-xs shadow-md shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all"
            title="Generate AI Gaming Graphics"
          >
            <Zap className="w-3.5 h-3.5 fill-black" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>
        )}

        <div className="hidden xs:flex items-center gap-1 px-2 py-1 rounded-md bg-cyan-950/40 border border-cyan-500/30 text-[10px] font-mono text-cyan-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>GEMINI 3.8</span>
        </div>

        <button
          onClick={onOpenSettings}
          className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all active:scale-95"
          title="Studio Settings"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
