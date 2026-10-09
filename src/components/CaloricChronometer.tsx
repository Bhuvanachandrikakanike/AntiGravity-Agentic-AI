import React from 'react';
import { MacroNutrients } from '../types';

interface CaloricChronometerProps {
  currentCalories: number;
  targetCalories: number;
  toleranceKcal: number;
  macros: MacroNutrients;
  targetMacros: MacroNutrients;
  onUpdateCalories?: (delta: number) => void;
}

export const CaloricChronometer: React.FC<CaloricChronometerProps> = ({
  currentCalories,
  targetCalories,
  toleranceKcal,
  macros,
  targetMacros,
}) => {
  // Angular calculation: 0 kcal = -120 deg, targetCalories = +120 deg (240 deg range)
  const ratio = Math.min(Math.max(currentCalories / (targetCalories || 2500), 0), 1.2);
  const needleAngle = -120 + ratio * 240;

  const remainingKcal = targetCalories - currentCalories;
  const isOver = remainingKcal < 0;

  // Macro progress percentages
  const proteinPercent = Math.min(Math.round((macros.protein / (targetMacros.protein || 140)) * 100), 100);
  const carbsPercent = Math.min(Math.round((macros.carbs / (targetMacros.carbs || 220)) * 100), 100);
  const fatPercent = Math.min(Math.round((macros.fat / (targetMacros.fat || 65)) * 100), 100);

  return (
    <div className="bg-[#fff1ec] rounded-xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between border border-[#d8c3b4]/40">
      {/* Top Bezel Header & Tolerance Inscription */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#a76526] shadow-inner"></span>
          <span className="font-['Newsreader',serif] text-xl font-semibold text-[#2a170f] tracking-tight">
            Caloric Chronometer • Cal. 1894
          </span>
        </div>
        <div className="px-2 py-1 rounded bg-[#ffe9e2] shadow-inner flex items-center gap-1 border border-[#d8c3b4]/30">
          <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase font-bold tracking-wider">
            TOLERANCE ±{toleranceKcal} KCAL
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center my-1">
        {/* Main Analog Dial Gauge */}
        <div className="md:col-span-7 flex flex-col items-center justify-center relative">
          {/* Brass Outer Bezel Shadow & Housing */}
          <div className="relative w-64 h-64 sm:w-72 sm:h-72 rounded-full p-2 bg-gradient-to-br from-[#ffb77b] via-[#894d0d] to-[#422b22] shadow-2xl flex items-center justify-center">
            {/* Recessed Parchment Dial Face */}
            <div className="w-full h-full rounded-full bg-[#fff8f6] shadow-[inset_0_4px_12px_rgba(42,23,15,0.45)] relative flex items-center justify-center overflow-hidden">
              {/* Circular Dial Graduations (SVG) */}
              <svg className="w-full h-full absolute inset-0 select-none" viewBox="0 0 260 260">
                {/* Arc Track */}
                <circle
                  className="text-[#ffe9e2]"
                  cx="130"
                  cy="130"
                  fill="none"
                  r="110"
                  stroke="currentColor"
                  strokeDasharray="520 200"
                  strokeDashoffset="-70"
                  strokeLinecap="round"
                  strokeWidth="12"
                />

                {/* Dial Tick Graduations */}
                <g className="text-[#d8c3b4]" strokeWidth="1.5">
                  <line stroke="currentColor" transform="rotate(-120 130 130)" x1="130" x2="130" y1="24" y2="34" />
                  <line stroke="currentColor" transform="rotate(-96 130 130)" x1="130" x2="130" y1="24" y2="30" />
                  <line stroke="currentColor" transform="rotate(-72 130 130)" x1="130" x2="130" y1="24" y2="34" />
                  <line stroke="currentColor" transform="rotate(-48 130 130)" x1="130" x2="130" y1="24" y2="30" />
                  <line stroke="currentColor" transform="rotate(-24 130 130)" x1="130" x2="130" y1="24" y2="34" />
                  <line stroke="currentColor" transform="rotate(0 130 130)" x1="130" x2="130" y1="24" y2="30" />
                  <line stroke="currentColor" transform="rotate(24 130 130)" x1="130" x2="130" y1="24" y2="34" />
                  <line stroke="currentColor" transform="rotate(48 130 130)" x1="130" x2="130" y1="24" y2="30" />
                  <line stroke="currentColor" transform="rotate(72 130 130)" x1="130" x2="130" y1="24" y2="34" />
                  <line stroke="currentColor" transform="rotate(96 130 130)" x1="130" x2="130" y1="24" y2="30" />
                  <line stroke="currentColor" transform="rotate(120 130 130)" x1="130" x2="130" y1="24" y2="34" />
                </g>

                {/* Major Dial Numerals */}
                <text className="fill-[#857467] font-['Fira_Sans',sans-serif] text-[10px] font-bold" x="56" y="200">0</text>
                <text className="fill-[#857467] font-['Fira_Sans',sans-serif] text-[10px] font-bold" x="32" y="134">500</text>
                <text className="fill-[#857467] font-['Fira_Sans',sans-serif] text-[10px] font-bold" x="64" y="68">1000</text>
                <text className="fill-[#857467] font-['Fira_Sans',sans-serif] text-[10px] font-bold" x="122" y="48">1500</text>
                <text className="fill-[#894d0d] font-['Fira_Sans',sans-serif] text-[10px] font-bold" x="178" y="68">2000</text>
                <text className="fill-[#857467] font-['Fira_Sans',sans-serif] text-[10px] font-bold" x="195" y="170">2500</text>
                <text className="fill-[#d8c3b4] font-['Fira_Sans',sans-serif] text-[9px] uppercase tracking-widest font-bold" x="110" y="92">
                  KILOCALORIES
                </text>

                {/* Needle Shadow (Offset for Tactile Depth) */}
                <polygon
                  className="fill-[#2a170f] opacity-25 filter blur-[1px] transition-transform duration-700 ease-out"
                  points="127,130 133,130 131,34 129,34"
                  transform={`rotate(${needleAngle + 2} 130 130)`}
                />

                {/* Metallic Crimson Indicating Needle */}
                <polygon
                  className="fill-[#ba1a1a] transition-transform duration-700 ease-out"
                  points="128,130 132,130 130.5,35 129.5,35"
                  transform={`rotate(${needleAngle} 130 130)`}
                />
                <polygon
                  className="fill-[#a76526] transition-transform duration-700 ease-out"
                  points="127,130 130,130 130,35 129,35"
                  transform={`rotate(${needleAngle} 130 130)`}
                />

                {/* Central Counterweight and Brass Center Cap */}
                <circle className="fill-[#422b22] shadow-md" cx="130" cy="130" r="16" />
                <circle className="fill-[#ffb77b]" cx="130" cy="130" r="11" />
                <circle className="fill-[#a76526]" cx="130" cy="130" r="5" />
              </svg>

              {/* Center Debossed Mechanical Total Aperture */}
              <div className="z-10 mt-20 flex flex-col items-center bg-[#ffe9e2] rounded px-3 py-1 shadow-inner border border-[#d8c3b4]/30 min-w-[110px]">
                <span className="font-['Newsreader',serif] text-3xl text-[#2a170f] font-semibold tracking-tight">
                  {currentCalories.toLocaleString()}
                </span>
                <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#894d0d] uppercase font-bold tracking-wider">
                  {isOver ? `${Math.abs(remainingKcal).toLocaleString()} SURPLUS` : `${remainingKcal.toLocaleString()} REMAINING`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Meters: Tactile Linear Macronutrient Channels */}
        <div className="md:col-span-5 flex flex-col gap-4 pl-0 md:pl-2">
          <span className="font-['Fira_Sans',sans-serif] text-xs text-[#524439] uppercase tracking-wider font-semibold">
            Macronutrient Channels
          </span>

          {/* Protein Gauge */}
          <div className="bg-[#ffe9e2] p-2.5 rounded-lg shadow-inner border border-[#d8c3b4]/30">
            <div className="flex justify-between items-center mb-1">
              <span className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">Protein</span>
              <span className="font-['Fira_Sans',sans-serif] text-[11px] text-[#894d0d] font-bold">
                {macros.protein} / {targetMacros.protein}g
              </span>
            </div>
            {/* Channel Track */}
            <div className="h-4 w-full bg-[#f8d2c4] rounded-full shadow-inner relative flex items-center p-0.5">
              <div
                className="h-full bg-[#358446] rounded-full transition-all duration-500"
                style={{ width: `${proteinPercent}%` }}
              />
              {/* Mechanical Brass Slider Thumb */}
              <div
                className="absolute h-6 w-3 bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] rounded-sm shadow-md transition-all duration-500 border border-[#2e1500]/20"
                style={{ left: `calc(${proteinPercent}% - 6px)` }}
                title={`Protein: ${proteinPercent}%`}
              />
            </div>
          </div>

          {/* Carbohydrates Gauge */}
          <div className="bg-[#ffe9e2] p-2.5 rounded-lg shadow-inner border border-[#d8c3b4]/30">
            <div className="flex justify-between items-center mb-1">
              <span className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">Carbohydrates</span>
              <span className="font-['Fira_Sans',sans-serif] text-[11px] text-[#894d0d] font-bold">
                {macros.carbs} / {targetMacros.carbs}g
              </span>
            </div>
            {/* Channel Track */}
            <div className="h-4 w-full bg-[#f8d2c4] rounded-full shadow-inner relative flex items-center p-0.5">
              <div
                className="h-full bg-[#a76526] rounded-full transition-all duration-500"
                style={{ width: `${carbsPercent}%` }}
              />
              {/* Mechanical Brass Slider Thumb */}
              <div
                className="absolute h-6 w-3 bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] rounded-sm shadow-md transition-all duration-500 border border-[#2e1500]/20"
                style={{ left: `calc(${carbsPercent}% - 6px)` }}
                title={`Carbohydrates: ${carbsPercent}%`}
              />
            </div>
          </div>

          {/* Lipid / Fat Gauge */}
          <div className="bg-[#ffe9e2] p-2.5 rounded-lg shadow-inner border border-[#d8c3b4]/30">
            <div className="flex justify-between items-center mb-1">
              <span className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">Lipids • Fat</span>
              <span className="font-['Fira_Sans',sans-serif] text-[11px] text-[#894d0d] font-bold">
                {macros.fat} / {targetMacros.fat}g
              </span>
            </div>
            {/* Channel Track */}
            <div className="h-4 w-full bg-[#f8d2c4] rounded-full shadow-inner relative flex items-center p-0.5">
              <div
                className="h-full bg-[#8c4f10] rounded-full transition-all duration-500"
                style={{ width: `${fatPercent}%` }}
              />
              {/* Mechanical Brass Slider Thumb */}
              <div
                className="absolute h-6 w-3 bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] rounded-sm shadow-md transition-all duration-500 border border-[#2e1500]/20"
                style={{ left: `calc(${fatPercent}% - 6px)` }}
                title={`Lipids/Fat: ${fatPercent}%`}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Footnote / Metrology Inscription */}
      <div className="mt-3 pt-2 border-t border-[#d8c3b4]/30 flex items-center justify-between text-[#857467]">
        <span className="font-['Fira_Sans',sans-serif] text-xs italic">
          Basal Metabolic Dynamic Computation
        </span>
        <span className="font-['Fira_Sans',sans-serif] text-[10px] uppercase font-bold tracking-wider">
          INDEX NO. • 884-D
        </span>
      </div>
    </div>
  );
};
