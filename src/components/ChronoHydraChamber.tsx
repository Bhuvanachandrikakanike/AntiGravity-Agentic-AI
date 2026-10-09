import React from 'react';
import { playWaterPump } from '../utils/audio';

interface ChronoHydraChamberProps {
  currentWaterMl: number;
  targetWaterMl: number;
  onAddWater: (amountMl: number) => void;
  soundEnabled: boolean;
}

export const ChronoHydraChamber: React.FC<ChronoHydraChamberProps> = ({
  currentWaterMl,
  targetWaterMl,
  onAddWater,
  soundEnabled,
}) => {
  const percentage = Math.min(Math.round((currentWaterMl / (targetWaterMl || 3000)) * 100), 100);
  const fluidHeight = Math.min(Math.max(percentage, 5), 100);

  const handlePump = (amount: number) => {
    playWaterPump(soundEnabled);
    onAddWater(amount);
  };

  // Tone status determination
  let statusText = 'Optimal Tone';
  let statusIcon = 'verified';
  if (percentage < 40) {
    statusText = 'Needs Intake';
    statusIcon = 'warning';
  } else if (percentage < 70) {
    statusText = 'In Balance';
    statusIcon = 'check_circle';
  } else if (percentage >= 100) {
    statusText = 'Chamber Saturated';
    statusIcon = 'star';
  }

  return (
    <div className="bg-[#fff1ec] rounded-xl p-6 shadow-xl relative flex flex-col justify-between border border-[#d8c3b4]/40">
      {/* Chamber Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span
            className="material-symbols-outlined text-[#0062a1]"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            water_drop
          </span>
          <span className="font-['Newsreader',serif] text-xl font-semibold text-[#2a170f] tracking-tight">
            ChronoHydra Chamber
          </span>
        </div>
        <span className="px-2 py-1 rounded bg-[#d0e4ff] text-[#001d35] font-['Fira_Sans',sans-serif] text-[10px] uppercase font-bold tracking-wider">
          {currentWaterMl.toLocaleString()} / {targetWaterMl.toLocaleString()} mL
        </span>
      </div>

      {/* Cylindrical Glass Tube Assembly */}
      <div className="flex items-center justify-center gap-6 my-1">
        {/* Graduation Rulers on Brass Plate */}
        <div className="flex flex-col justify-between h-64 text-right py-2 pr-1 font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] select-none font-medium">
          <span className={currentWaterMl >= 3000 ? 'text-[#0062a1] font-bold' : ''}>3000 mL —</span>
          <span className={currentWaterMl >= 2500 ? 'text-[#0062a1] font-bold' : ''}>2500 mL —</span>
          <span className="text-[#0062a1] font-bold">2000 mL —</span>
          <span className={currentWaterMl >= 1500 ? 'text-[#0062a1] font-bold' : ''}>1500 mL —</span>
          <span className={currentWaterMl >= 1000 ? 'text-[#0062a1] font-bold' : ''}>1000 mL —</span>
          <span className={currentWaterMl >= 500 ? 'text-[#0062a1] font-bold' : ''}>500 mL —</span>
          <span>0 mL —</span>
        </div>

        {/* Glass Tube Container */}
        <div className="relative w-28 h-64 rounded-full bg-[#ffe9e2] p-1 shadow-[inset_0_4px_16px_rgba(0,30,55,0.4)] flex flex-col justify-end overflow-hidden border border-[#d8c3b4]/40">
          {/* Metallic Specular Optical Glass Highlighting */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-transparent to-white/40 pointer-events-none z-20 rounded-full" />

          {/* Water Fluid Column with smooth transition */}
          <div
            className="relative w-full bg-gradient-to-t from-[#0062a1] via-[#4eabff] to-[#9ccaff] rounded-b-full transition-all duration-700 ease-out shadow-inner"
            style={{ height: `${fluidHeight}%` }}
          >
            {/* Curved Fluid Meniscus Surface */}
            <div className="absolute -top-3 left-0 right-0 h-6 rounded-full bg-[#d0e4ff] shadow-[0_1px_4px_rgba(255,255,255,0.8)] z-10 opacity-90" />

            {/* Micro Liquid Bubbles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-60">
              <span className="absolute bottom-4 left-6 w-2 h-2 rounded-full bg-white bubble-1" />
              <span className="absolute bottom-12 right-5 w-1.5 h-1.5 rounded-full bg-white bubble-2" />
              <span className="absolute bottom-24 left-8 w-2.5 h-2.5 rounded-full bg-white opacity-75 bubble-3" />
            </div>
          </div>

          {/* Graduation Glass Etchings Across Cylinder */}
          <div className="absolute inset-0 flex flex-col justify-between py-5 px-3 pointer-events-none z-10 opacity-40">
            <div className="w-full h-px bg-[#2a170f]" />
            <div className="w-2/3 h-px bg-[#2a170f]" />
            <div className="w-full h-px bg-[#2a170f]" />
            <div className="w-2/3 h-px bg-[#2a170f]" />
            <div className="w-full h-px bg-[#2a170f]" />
            <div className="w-2/3 h-px bg-[#2a170f]" />
            <div className="w-full h-px bg-[#2a170f]" />
          </div>
        </div>

        {/* Big Stat & Status Inset */}
        <div className="flex flex-col gap-1 items-start">
          <span className="font-['Newsreader',serif] text-5xl font-semibold text-[#0062a1] leading-none tracking-tight">
            {percentage}%
          </span>
          <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase tracking-wider font-bold">
            Hydration Index
          </span>
          <div className="mt-2 px-2 py-1 rounded bg-[#ffe9e2] shadow-inner flex items-center gap-1 text-[#176a30] border border-[#d8c3b4]/30">
            <span className="material-symbols-outlined text-sm">{statusIcon}</span>
            <span className="font-['Fira_Sans',sans-serif] text-[10px] uppercase font-bold tracking-wider">
              {statusText}
            </span>
          </div>
        </div>
      </div>

      {/* Tactile Brass Actuator Pump Buttons */}
      <div className="grid grid-cols-3 gap-2 pt-2 border-t border-[#d8c3b4]/30">
        {/* Glass +250 */}
        <button
          type="button"
          onClick={() => handlePump(250)}
          className="py-2 px-1 rounded-lg bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#2a170f] font-['Fira_Sans',sans-serif] text-xs font-bold uppercase shadow-md active:translate-y-0.5 active:shadow-inner flex flex-col items-center justify-center transition-transform hover:brightness-105 cursor-pointer border border-[#2e1500]/20"
        >
          <span className="material-symbols-outlined text-base">local_cafe</span>
          <span>+250 mL</span>
        </button>

        {/* Bottle +500 */}
        <button
          type="button"
          onClick={() => handlePump(500)}
          className="py-2 px-1 rounded-lg bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#2a170f] font-['Fira_Sans',sans-serif] text-xs font-bold uppercase shadow-md active:translate-y-0.5 active:shadow-inner flex flex-col items-center justify-center transition-transform hover:brightness-105 cursor-pointer border border-[#2e1500]/20"
        >
          <span className="material-symbols-outlined text-base">water_bottle</span>
          <span>+500 mL</span>
        </button>

        {/* Revert -100 */}
        <button
          type="button"
          onClick={() => handlePump(-100)}
          disabled={currentWaterMl <= 0}
          className="py-2 px-1 rounded-lg bg-[#ffe9e2] text-[#857467] hover:text-[#2a170f] font-['Fira_Sans',sans-serif] text-xs uppercase shadow-md active:translate-y-0.5 active:shadow-inner flex flex-col items-center justify-center transition-transform hover:bg-[#ffe2d8] cursor-pointer border border-[#d8c3b4]/40 disabled:opacity-50"
        >
          <span className="material-symbols-outlined text-base">undo</span>
          <span>-100 mL</span>
        </button>
      </div>
    </div>
  );
};
