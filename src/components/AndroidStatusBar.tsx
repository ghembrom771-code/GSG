import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Sparkles, Smartphone, Monitor } from 'lucide-react';

interface AndroidStatusBarProps {
  isFrameMode: boolean;
  onToggleFrameMode: () => void;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  isFrameMode,
  onToggleFrameMode,
}) => {
  const [timeStr, setTimeStr] = useState('10:24');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours().toString().padStart(2, '0');
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTimeStr(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#050711]/90 backdrop-blur-md border-b border-cyan-500/10 px-4 py-1.5 flex items-center justify-between text-xs text-slate-300 select-none z-40">
      {/* Left: Time and Studio Badge */}
      <div className="flex items-center gap-2 font-medium">
        <span className="font-mono text-cyan-400 font-bold tracking-tight">{timeStr}</span>
        <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-1.5 py-0.5 rounded border border-cyan-500/30 flex items-center gap-1 font-orbitron">
          <Sparkles className="w-2.5 h-2.5 text-cyan-300" />
          GOALSTAR OS
        </span>
      </div>

      {/* Middle: Android Camera Cutout Notch (aesthetic) */}
      <div className="hidden sm:flex items-center justify-center">
        <div className="w-3.5 h-3.5 rounded-full bg-black border border-slate-700/60 shadow-inner flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-[#00F0FF]/30"></div>
        </div>
      </div>

      {/* Right: Device toggle & Status Icons */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleFrameMode}
          title={isFrameMode ? 'Switch to Full View' : 'Switch to Android Phone Bezel'}
          className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-cyan-400 transition-colors px-1.5 py-0.5 rounded bg-slate-900/60 border border-slate-700/50"
        >
          {isFrameMode ? (
            <>
              <Monitor className="w-3 h-3 text-cyan-400" />
              <span className="hidden md:inline">Full View</span>
            </>
          ) : (
            <>
              <Smartphone className="w-3 h-3 text-purple-400" />
              <span className="hidden md:inline">Phone Frame</span>
            </>
          )}
        </button>

        <span className="text-[10px] font-bold text-slate-400 tracking-wider">5G</span>
        <Wifi className="w-3.5 h-3.5 text-slate-300" />
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono text-emerald-400">100%</span>
          <BatteryMedium className="w-3.5 h-3.5 text-emerald-400" />
        </div>
      </div>
    </div>
  );
};
