import React from 'react';
import { DayLedgerRecord } from '../types';
import { playMechanicalClick } from '../utils/audio';

interface WeeklyLedgerScreenProps {
  ledgerRecords: DayLedgerRecord[];
  onBackToLog: () => void;
  onExport: () => void;
  soundEnabled: boolean;
}

export const WeeklyLedgerScreen: React.FC<WeeklyLedgerScreenProps> = ({
  ledgerRecords,
  onBackToLog,
  onExport,
  soundEnabled,
}) => {
  const totalWeeklyCalories = ledgerRecords.reduce((sum, r) => sum + r.calories, 0);
  const avgDailyCalories = Math.round(totalWeeklyCalories / ledgerRecords.length);
  const totalWater = ledgerRecords.reduce((sum, r) => sum + r.waterMl, 0);
  const avgDailyWater = Math.round(totalWater / ledgerRecords.length);
  const totalTargetCalories = ledgerRecords.reduce((sum, r) => sum + r.targetCalories, 0);
  const netWeeklyDelta = totalWeeklyCalories - totalTargetCalories;

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-3 border-b border-[#d8c3b4]/30 gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(soundEnabled);
              onBackToLog();
            }}
            className="p-2 rounded-lg bg-[#ffe9e2] text-[#894d0d] hover:bg-[#ffe2d8] border border-[#d8c3b4]/40 flex items-center justify-center cursor-pointer"
            title="Return to Daily Log"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <h2 className="font-['Newsreader',serif] text-2xl font-semibold text-[#2a170f] leading-tight">
              Archival Weekly Ledger • Folio Cycle
            </h2>
            <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467]">
              Hebdomadal Metrology of Caloric &amp; Fluid Balances
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playMechanicalClick(soundEnabled);
            onExport();
          }}
          className="px-4 py-2 rounded-lg bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#2a170f] font-['Fira_Sans',sans-serif] text-xs font-bold uppercase tracking-wider shadow hover:brightness-105 active:translate-y-0.5 border border-[#ffdcc2]/40 flex items-center gap-1.5 cursor-pointer"
        >
          <span className="material-symbols-outlined text-base">print</span>
          <span>Export Archival Ledger</span>
        </button>
      </div>

      {/* 3 Weekly Horological Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-[#fff1ec] p-4 rounded-xl shadow-md border border-[#d8c3b4]/40 flex flex-col justify-between">
          <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase font-bold tracking-wider">
            Average Daily Intake
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-['Newsreader',serif] text-3xl font-semibold text-[#894d0d]">
              {avgDailyCalories.toLocaleString()}
            </span>
            <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467]">kcal / day</span>
          </div>
          <span className="font-['Fira_Sans',sans-serif] text-[11px] text-[#176a30] font-semibold">
            {netWeeklyDelta <= 0
              ? `${Math.abs(netWeeklyDelta).toLocaleString()} kcal net deficit (Target: 2,500)`
              : `+${netWeeklyDelta.toLocaleString()} kcal net surplus`}
          </span>
        </div>

        <div className="bg-[#fff1ec] p-4 rounded-xl shadow-md border border-[#d8c3b4]/40 flex flex-col justify-between">
          <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase font-bold tracking-wider">
            Mean Hydration Volume
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-['Newsreader',serif] text-3xl font-semibold text-[#0062a1]">
              {avgDailyWater.toLocaleString()}
            </span>
            <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467]">mL / day</span>
          </div>
          <span className="font-['Fira_Sans',sans-serif] text-[11px] text-[#0062a1] font-semibold">
            Weekly Cumulative: {(totalWater / 1000).toFixed(1)} Liters
          </span>
        </div>

        <div className="bg-[#fff1ec] p-4 rounded-xl shadow-md border border-[#d8c3b4]/40 flex flex-col justify-between">
          <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase font-bold tracking-wider">
            Folio Chrono-Verification
          </span>
          <div className="flex items-baseline gap-2 my-1">
            <span className="font-['Newsreader',serif] text-3xl font-semibold text-[#176a30]">
              100%
            </span>
            <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467]">Audit Pass</span>
          </div>
          <span className="font-['Fira_Sans',sans-serif] text-[11px] text-[#857467]">
            7 of 7 Folios Synchronized at Midnight
          </span>
        </div>
      </div>

      {/* Weekly Visual Balance Chart */}
      <div className="bg-[#fff1ec] p-5 rounded-xl shadow-md border border-[#d8c3b4]/40">
        <div className="flex justify-between items-center mb-4">
          <span className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">
            Hebdomadal Caloric Dispersion
          </span>
          <div className="flex items-center gap-4 text-xs font-['Fira_Sans',sans-serif] text-[#857467]">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#a76526]" />
              <span>Logged Calories</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-4 h-0.5 bg-[#894d0d] border-t border-dashed" />
              <span>Target Equilibrium (2,500 kcal)</span>
            </div>
          </div>
        </div>

        {/* Bar Chart Visualization */}
        <div className="h-44 w-full flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-[#d8c3b4]/50 relative">
          {/* Target 2500 line (scaled around 75% height) */}
          <div className="absolute top-[30%] left-0 right-0 border-b border-dashed border-[#894d0d]/60 pointer-events-none z-10">
            <span className="absolute -top-3 right-2 text-[9px] font-['Fira_Sans',sans-serif] text-[#894d0d] font-bold">
              2,500 EQUILIBRIUM
            </span>
          </div>

          {ledgerRecords.map((record) => {
            const heightPercent = Math.min(Math.round((record.calories / 3200) * 100), 100);
            return (
              <div key={record.date} className="flex-1 flex flex-col items-center gap-2 z-20 group">
                {/* Tooltip on hover */}
                <span className="text-[10px] font-['Newsreader',serif] font-bold text-[#894d0d] opacity-0 group-hover:opacity-100 transition-opacity">
                  {record.calories}
                </span>
                <div className="w-full max-w-[42px] bg-[#ffe9e2] rounded-t-md h-36 flex items-end p-0.5 shadow-inner">
                  <div
                    className="w-full bg-gradient-to-t from-[#894d0d] to-[#ffb77b] rounded-t-sm shadow-md transition-all duration-500"
                    style={{ height: `${heightPercent}%` }}
                  />
                </div>
                <span className="font-['Fira_Sans',sans-serif] text-[10px] font-semibold text-[#2a170f]">
                  {record.shortDate}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Archival Ledger Table */}
      <div className="bg-[#fff1ec] rounded-xl shadow-md border border-[#d8c3b4]/40 overflow-hidden">
        <div className="p-4 bg-[#ffe9e2] border-b border-[#d8c3b4]/40 flex justify-between items-center">
          <span className="font-['Newsreader',serif] text-base font-semibold text-[#2a170f]">
            Ledger Register Details
          </span>
          <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] font-bold uppercase tracking-wider">
            SERIES 1894 • RECORD 7-DAY
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left font-['Fira_Sans',sans-serif] text-xs">
            <thead className="bg-[#ffe2d8] text-[#857467] uppercase font-bold text-[10px] tracking-wider border-b border-[#d8c3b4]/30">
              <tr>
                <th className="py-2.5 px-4">Date / Day</th>
                <th className="py-2.5 px-3">Intake (kcal)</th>
                <th className="py-2.5 px-3">Target</th>
                <th className="py-2.5 px-3">Variance</th>
                <th className="py-2.5 px-3">Water (mL)</th>
                <th className="py-2.5 px-3">Macros (P / C / F)</th>
                <th className="py-2.5 px-4 text-right">Status Seal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d8c3b4]/20">
              {ledgerRecords.map((rec) => {
                const diff = rec.calories - rec.targetCalories;
                return (
                  <tr key={rec.date} className="hover:bg-[#ffe9e2]/50 transition-colors">
                    <td className="py-3 px-4 font-semibold text-[#2a170f]">
                      <div>{rec.dayName}</div>
                      <div className="text-[10px] text-[#857467] font-normal">{rec.shortDate}</div>
                    </td>
                    <td className="py-3 px-3 font-['Newsreader',serif] text-base font-semibold text-[#894d0d]">
                      {rec.calories.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-[#857467]">
                      {rec.targetCalories.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 font-semibold">
                      <span className={diff > 0 ? 'text-[#ba1a1a]' : 'text-[#176a30]'}>
                        {diff > 0 ? `+${diff}` : diff}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[#0062a1] font-semibold">
                      {rec.waterMl.toLocaleString()} mL
                    </td>
                    <td className="py-3 px-3 text-[#524439]">
                      <span className="text-[#176a30] font-bold">{rec.macros.protein}g</span> /{' '}
                      <span className="text-[#894d0d] font-bold">{rec.macros.carbs}g</span> /{' '}
                      <span className="text-[#8c4f10] font-bold">{rec.macros.fat}g</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="px-2 py-0.5 rounded bg-[#ffe2d8] text-[#894d0d] font-['Fira_Sans',sans-serif] text-[9px] font-bold uppercase border border-[#ffdbce]">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
