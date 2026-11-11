import React from 'react';
import { TabType } from '../types';
import { 
  LayoutDashboard, 
  Sparkles, 
  Type, 
  FileText, 
  Trophy, 
  Smartphone, 
  ShieldCheck, 
  FolderKanban 
} from 'lucide-react';

interface BottomNavProps {
  currentTab: TabType;
  onChangeTab: (tab: TabType) => void;
  projectCount: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentTab,
  onChangeTab,
  projectCount,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    { id: 'home', label: 'Studio', icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: 'thumbnails', label: 'Thumbnails', icon: <Sparkles className="w-5 h-5 text-cyan-400" /> },
    { id: 'titles', label: 'Titles', icon: <Type className="w-5 h-5" /> },
    { id: 'descriptions', label: 'SEO & Tags', icon: <FileText className="w-5 h-5" /> },
    { id: 'posters', label: 'Posters', icon: <Trophy className="w-5 h-5" /> },
    { id: 'shorts', label: 'Shorts 9:16', icon: <Smartphone className="w-5 h-5" /> },
    { id: 'branding', label: 'Branding', icon: <ShieldCheck className="w-5 h-5" /> },
    { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-5 h-5" />, badge: projectCount },
  ];

  return (
    <div className="sticky bottom-0 left-0 right-0 z-40 bg-[#070915]/95 backdrop-blur-xl border-t border-cyan-500/20 pb-safe">
      {/* Horizontal scrolling navigation for mobile phone comfort */}
      <div className="flex items-center justify-between px-2 py-2 overflow-x-auto no-scrollbar gap-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if ('vibrate' in navigator) {
                  try { navigator.vibrate(12); } catch {}
                }
                onChangeTab(item.id);
              }}
              className={`flex flex-col items-center justify-center min-w-[54px] py-1 px-2 rounded-xl transition-all relative group ${
                isActive
                  ? 'text-cyan-400 bg-cyan-950/40 shadow-sm shadow-cyan-500/20'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
              }`}
            >
              {/* Active glow indicator pill */}
              {isActive && (
                <div className="absolute -top-2 w-6 h-1 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F0FF]" />
              )}

              <div className="relative">
                {item.icon}
                {item.badge !== undefined && Number(item.badge) > 0 && (
                  <span className="absolute -top-1.5 -right-2 bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full border border-purple-400">
                    {item.badge}
                  </span>
                )}
              </div>

              <span className={`text-[10px] font-medium tracking-tight mt-1 whitespace-nowrap ${isActive ? 'font-bold text-cyan-300' : 'text-slate-400'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Android System Gesture Navigation Pill */}
      <div className="w-full flex justify-center py-1">
        <div className="w-28 h-1 rounded-full bg-slate-600/50" />
      </div>
    </div>
  );
};
