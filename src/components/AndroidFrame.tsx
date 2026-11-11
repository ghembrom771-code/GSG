import React from 'react';

interface AndroidFrameProps {
  isFrameMode: boolean;
  children: React.ReactNode;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  isFrameMode,
  children,
}) => {
  if (!isFrameMode) {
    return <div className="min-h-screen bg-[#060812] text-slate-100 flex flex-col">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-[#030408] flex items-center justify-center p-2 sm:p-6 lg:p-8">
      {/* Outer Phone Bezel */}
      <div className="relative w-full max-w-[440px] h-[92vh] max-h-[920px] bg-[#0c1020] rounded-[48px] p-3 shadow-[0_0_60px_rgba(0,240,255,0.25),0_25px_50px_-12px_rgba(0,0,0,0.9)] border-4 border-[#1e294b] flex flex-col overflow-hidden">
        {/* Hardware side buttons simulation */}
        <div className="absolute -left-[7px] top-28 w-[3px] h-12 bg-slate-700 rounded-l" />
        <div className="absolute -left-[7px] top-44 w-[3px] h-12 bg-slate-700 rounded-l" />
        <div className="absolute -right-[7px] top-32 w-[3px] h-16 bg-slate-700 rounded-r" />

        {/* Inner Phone Screen */}
        <div className="relative flex-1 bg-[#060812] rounded-[38px] overflow-hidden flex flex-col border border-cyan-500/20">
          {children}
        </div>
      </div>
    </div>
  );
};
