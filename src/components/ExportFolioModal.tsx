import React, { useState } from 'react';
import { MealCategory, MacroNutrients } from '../types';
import { BRASS_EMBLEM_URL } from '../data/initialData';
import { playMechanicalClick } from '../utils/audio';

interface ExportFolioModalProps {
  dateText: string;
  categories: MealCategory[];
  totalCalories: number;
  targetCalories: number;
  waterMl: number;
  targetWaterMl: number;
  macros: MacroNutrients;
  onClose: () => void;
  soundEnabled: boolean;
}

export const ExportFolioModal: React.FC<ExportFolioModalProps> = ({
  dateText,
  categories,
  totalCalories,
  targetCalories,
  waterMl,
  targetWaterMl,
  macros,
  onClose,
  soundEnabled,
}) => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    playMechanicalClick(soundEnabled);
    window.print();
  };

  const handleCopyText = () => {
    playMechanicalClick(soundEnabled);
    const lines = [
      `AURANUTRIENT & CHRONOHYDRA — ARCHIVAL FOLIO REGISTER`,
      `Date: ${dateText} 2026 | Cal. 1894 • INDEX NO. 884-D`,
      `--------------------------------------------------`,
      `TOTAL INTAKE: ${totalCalories} kcal / Target: ${targetCalories} kcal (Remaining: ${targetCalories - totalCalories} kcal)`,
      `HYDRATION: ${waterMl} mL / Target: ${targetWaterMl} mL (${Math.round((waterMl / targetWaterMl) * 100)}%)`,
      `MACRONUTRIENTS: P: ${macros.protein}g | C: ${macros.carbs}g | F: ${macros.fat}g`,
      `--------------------------------------------------`,
      `ENTRIES:`,
      ...categories.map((cat) => {
        const item = cat.items[0];
        return `- [${cat.entryNumber} • ${cat.timeSlot}] ${cat.title}: ${item?.name || 'Empty'} (${cat.totalCalories} kcal)`;
      }),
      `--------------------------------------------------`,
      `STATUS: ChronoVerified at Midnight MMXXIV`,
    ];

    navigator.clipboard?.writeText(lines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2a170f]/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-[#fff8f6] rounded-xl shadow-2xl border-2 border-[#894d0d] overflow-hidden flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="p-3 bg-[#422b22] text-[#ffdcc2] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-base">history_edu</span>
            <span className="font-['Newsreader',serif] font-semibold text-sm">
              Archival Parchment Folio Preview
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyText}
              className="px-3 py-1 rounded bg-[#a76526] hover:bg-[#894d0d] text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">content_copy</span>
              <span>{copied ? 'Transcribed!' : 'Copy Text'}</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="px-3 py-1 rounded bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#2a170f] text-xs font-bold flex items-center gap-1 cursor-pointer"
            >
              <span className="material-symbols-outlined text-sm">print</span>
              <span>Print Folio</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1 rounded text-[#ffdcc2] hover:bg-[#2a170f]"
            >
              <span className="material-symbols-outlined text-base">close</span>
            </button>
          </div>
        </div>

        {/* Printable Parchment Sheet */}
        <div className="p-8 bg-[#fff8f6] overflow-y-auto flex flex-col gap-6 font-['Fira_Sans',sans-serif] text-[#2a170f] select-text">
          {/* Letterpress Header */}
          <div className="text-center border-b-2 border-double border-[#894d0d]/40 pb-6 flex flex-col items-center">
            <img
              src={BRASS_EMBLEM_URL}
              alt="Emblem"
              className="h-10 w-auto object-contain mb-2"
            />
            <h1 className="font-['Newsreader',serif] text-2xl font-bold tracking-tight text-[#894d0d]">
              AuraNutrient &amp; ChronoHydra
            </h1>
            <span className="font-['Newsreader',serif] text-xs uppercase tracking-widest text-[#857467] font-semibold">
              Official Chronometer Log • Cal. 1894 • Index No. 884-D
            </span>
            <span className="font-['Newsreader',serif] text-sm text-[#2a170f] font-semibold mt-2">
              Folio of Record: {dateText} 2026
            </span>
          </div>

          {/* Caloric & Hydration Horological Summary */}
          <div className="grid grid-cols-2 gap-4 bg-[#ffe9e2] p-4 rounded-lg border border-[#d8c3b4]/40">
            <div>
              <span className="text-[10px] text-[#857467] uppercase font-bold tracking-wider block">
                Total Kilocalories Registered
              </span>
              <div className="font-['Newsreader',serif] text-2xl font-bold text-[#894d0d]">
                {totalCalories.toLocaleString()} <span className="text-xs font-normal text-[#857467]">/ {targetCalories.toLocaleString()} kcal</span>
              </div>
              <span className="text-xs text-[#176a30] font-semibold">
                {targetCalories - totalCalories} kcal remaining allowance
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#857467] uppercase font-bold tracking-wider block">
                ChronoHydra Chamber Volume
              </span>
              <div className="font-['Newsreader',serif] text-2xl font-bold text-[#0062a1]">
                {waterMl.toLocaleString()} <span className="text-xs font-normal text-[#857467]">/ {targetWaterMl.toLocaleString()} mL</span>
              </div>
              <span className="text-xs text-[#0062a1] font-semibold">
                {Math.round((waterMl / targetWaterMl) * 100)}% Chamber Saturation (Optimal Tone)
              </span>
            </div>
          </div>

          {/* Macro Distribution */}
          <div className="flex justify-around py-2 border-y border-[#d8c3b4]/40 text-center">
            <div>
              <span className="text-[10px] text-[#857467] uppercase font-bold block">Protein Balance</span>
              <span className="font-['Newsreader',serif] text-lg font-bold text-[#176a30]">{macros.protein}g</span>
            </div>
            <div>
              <span className="text-[10px] text-[#857467] uppercase font-bold block">Carbohydrates Balance</span>
              <span className="font-['Newsreader',serif] text-lg font-bold text-[#894d0d]">{macros.carbs}g</span>
            </div>
            <div>
              <span className="text-[10px] text-[#857467] uppercase font-bold block">Lipids / Fat Balance</span>
              <span className="font-['Newsreader',serif] text-lg font-bold text-[#8c4f10]">{macros.fat}g</span>
            </div>
          </div>

          {/* Meal Details Table */}
          <div>
            <h3 className="font-['Newsreader',serif] text-base font-semibold text-[#2a170f] mb-2">
              Itemized Transcriptions
            </h3>
            <div className="flex flex-col gap-2">
              {categories.map((cat) => {
                const item = cat.items[0];
                return (
                  <div
                    key={cat.id}
                    className="p-3 bg-[#fff1ec] rounded border border-[#d8c3b4]/30 flex justify-between items-start"
                  >
                    <div>
                      <div className="text-[10px] text-[#857467] uppercase font-bold">
                        {cat.entryNumber} • {cat.timeSlot} • {cat.title}
                      </div>
                      <div className="font-['Newsreader',serif] text-sm font-bold text-[#2a170f]">
                        {item ? item.name : 'No Items Logged'}
                      </div>
                      {item && (
                        <div className="text-xs text-[#857467] italic">{item.subtitle}</div>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-['Newsreader',serif] text-base font-bold text-[#894d0d]">
                        {cat.totalCalories} kcal
                      </div>
                      <div className="text-[9px] text-[#176a30] uppercase font-bold">
                        CHRONOVERIFIED
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Archival Wax Seal Visual */}
          <div className="pt-4 border-t border-[#d8c3b4]/40 flex items-center justify-between text-xs text-[#857467]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-[#894d0d] flex items-center justify-center font-['Newsreader',serif] text-[9px] font-bold text-[#894d0d] text-center uppercase tracking-tighter shadow-inner">
                SEAL OF MK. IV
              </div>
              <div>
                <div className="font-semibold text-[#2a170f]">Certified Chronometric Ledger</div>
                <div>Synchronized to ChronoTrack MMXXIV Mechanical Ledger at midnight.</div>
              </div>
            </div>
            <div className="text-right font-mono text-[10px]">
              REG #884D-OCT18
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
