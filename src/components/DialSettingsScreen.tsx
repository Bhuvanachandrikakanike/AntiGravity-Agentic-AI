import React from 'react';
import { DialSettings } from '../types';
import { playMechanicalClick, playAcousticChime } from '../utils/audio';

interface DialSettingsScreenProps {
  settings: DialSettings;
  onUpdateSettings: (newSettings: DialSettings) => void;
  onBackToLog: () => void;
  onResetDefaults: () => void;
}

export const DialSettingsScreen: React.FC<DialSettingsScreenProps> = ({
  settings,
  onUpdateSettings,
  onBackToLog,
  onResetDefaults,
}) => {
  const handleChange = <K extends keyof DialSettings>(key: K, value: DialSettings[K]) => {
    playMechanicalClick(settings.soundEnabled);
    onUpdateSettings({
      ...settings,
      [key]: value,
    });
  };

  const handleTestChime = () => {
    playAcousticChime(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between pb-3 border-b border-[#d8c3b4]/30">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => {
              playMechanicalClick(settings.soundEnabled);
              onBackToLog();
            }}
            className="p-2 rounded-lg bg-[#ffe9e2] text-[#894d0d] hover:bg-[#ffe2d8] border border-[#d8c3b4]/40 flex items-center justify-center cursor-pointer"
            title="Return to Daily Log"
          >
            <span className="material-symbols-outlined text-lg">arrow_back</span>
          </button>
          <div>
            <h2 className="font-['Newsreader',serif] text-2xl font-semibold text-[#2a170f] leading-tight">
              Horological Metrology &amp; Dial Calibration
            </h2>
            <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467]">
              Adjustment of Balances, Escapement Cadence, and Chamber Targets
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            playMechanicalClick(settings.soundEnabled);
            onResetDefaults();
          }}
          className="px-3 py-1.5 rounded-lg bg-[#ffe9e2] text-[#894d0d] font-['Fira_Sans',sans-serif] text-xs font-semibold hover:bg-[#ffe2d8] border border-[#d8c3b4]/40 cursor-pointer"
        >
          Reset to Cal. 1894
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Module 1: Caloric Chronometer Calibration */}
        <div className="bg-[#fff1ec] p-5 rounded-xl shadow-md border border-[#d8c3b4]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d8c3b4]/30">
              <span className="w-3 h-3 rounded-full bg-[#894d0d]" />
              <h3 className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">
                Caloric Chronometer Dial
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-['Fira_Sans',sans-serif] text-xs font-semibold text-[#2a170f]">
                    Daily Target Energy (Kilocalories)
                  </label>
                  <span className="font-['Newsreader',serif] text-base font-bold text-[#894d0d]">
                    {settings.targetCalories.toLocaleString()} kcal
                  </span>
                </div>
                <input
                  type="range"
                  min="1400"
                  max="3800"
                  step="50"
                  value={settings.targetCalories}
                  onChange={(e) => handleChange('targetCalories', Number(e.target.value))}
                  className="w-full accent-[#894d0d] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-['Fira_Sans',sans-serif] text-xs font-semibold text-[#2a170f]">
                    Mechanical Dial Tolerance Window
                  </label>
                  <span className="font-['Fira_Sans',sans-serif] text-xs font-bold text-[#857467]">
                    ±{settings.toleranceKcal} kcal
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[15, 25, 50].map((tol) => (
                    <button
                      key={tol}
                      type="button"
                      onClick={() => handleChange('toleranceKcal', tol)}
                      className={`py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        settings.toleranceKcal === tol
                          ? 'bg-[#a76526] text-white border-[#894d0d]'
                          : 'bg-[#ffe9e2] text-[#2a170f] border-[#d8c3b4]/30'
                      }`}
                    >
                      ±{tol} kcal
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#d8c3b4]/30 text-[11px] text-[#857467] italic">
            Calibrated for Basal Metabolic Dynamic balance computation with active escapement.
          </div>
        </div>

        {/* Module 2: ChronoHydra Chamber Configuration */}
        <div className="bg-[#fff1ec] p-5 rounded-xl shadow-md border border-[#d8c3b4]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d8c3b4]/30">
              <span className="material-symbols-outlined text-[#0062a1] text-lg">water_drop</span>
              <h3 className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">
                ChronoHydra Chamber
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-['Fira_Sans',sans-serif] text-xs font-semibold text-[#2a170f]">
                    Daily Fluid Chamber Capacity
                  </label>
                  <span className="font-['Newsreader',serif] text-base font-bold text-[#0062a1]">
                    {settings.targetWaterMl.toLocaleString()} mL
                  </span>
                </div>
                <input
                  type="range"
                  min="1500"
                  max="4500"
                  step="250"
                  value={settings.targetWaterMl}
                  onChange={(e) => handleChange('targetWaterMl', Number(e.target.value))}
                  className="w-full accent-[#0062a1] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="font-['Fira_Sans',sans-serif] text-xs font-semibold text-[#2a170f]">
                    Fasting Chronometer Window
                  </label>
                  <span className="font-['Fira_Sans',sans-serif] text-xs font-bold text-[#176a30]">
                    {settings.fastingTargetHours} Hours
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[12, 14, 16, 18].map((hours) => (
                    <button
                      key={hours}
                      type="button"
                      onClick={() => handleChange('fastingTargetHours', hours)}
                      className={`py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        settings.fastingTargetHours === hours
                          ? 'bg-[#176a30] text-white border-[#176a30]'
                          : 'bg-[#ffe9e2] text-[#2a170f] border-[#d8c3b4]/30'
                      }`}
                    >
                      {hours}H Fast
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-2 border-t border-[#d8c3b4]/30 text-[11px] text-[#857467] italic">
            Refraction indices mapped directly onto cylindrical optical glass graduated scale.
          </div>
        </div>

        {/* Module 3: Macronutrient Channels */}
        <div className="bg-[#fff1ec] p-5 rounded-xl shadow-md border border-[#d8c3b4]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d8c3b4]/30">
              <span className="material-symbols-outlined text-[#894d0d] text-lg">tune</span>
              <h3 className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">
                Macronutrient Channel Channels
              </h3>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#176a30] font-bold">Protein Target</span>
                  <span className="font-semibold text-[#2a170f]">{settings.targetProtein}g</span>
                </div>
                <input
                  type="range"
                  min="80"
                  max="220"
                  step="5"
                  value={settings.targetProtein}
                  onChange={(e) => handleChange('targetProtein', Number(e.target.value))}
                  className="w-full accent-[#358446] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#894d0d] font-bold">Carbohydrates Target</span>
                  <span className="font-semibold text-[#2a170f]">{settings.targetCarbs}g</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="350"
                  step="10"
                  value={settings.targetCarbs}
                  onChange={(e) => handleChange('targetCarbs', Number(e.target.value))}
                  className="w-full accent-[#a76526] cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-[#8c4f10] font-bold">Lipids • Fat Target</span>
                  <span className="font-semibold text-[#2a170f]">{settings.targetFat}g</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="120"
                  step="5"
                  value={settings.targetFat}
                  onChange={(e) => handleChange('targetFat', Number(e.target.value))}
                  className="w-full accent-[#8c4f10] cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Module 4: Acoustic Escapement & Sound Settings */}
        <div className="bg-[#fff1ec] p-5 rounded-xl shadow-md border border-[#d8c3b4]/40 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-[#d8c3b4]/30">
              <span className="material-symbols-outlined text-[#894d0d] text-lg">notifications</span>
              <h3 className="font-['Newsreader',serif] text-lg font-semibold text-[#2a170f]">
                Acoustic Chime &amp; Tactile Feedback
              </h3>
            </div>

            <div className="flex flex-col gap-4">
              <div>
                <label className="font-['Fira_Sans',sans-serif] text-xs font-semibold text-[#2a170f] block mb-1">
                  Chime Cadence Interval
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((cadence) => (
                    <button
                      key={cadence}
                      type="button"
                      onClick={() => handleChange('chimeCadenceMinutes', cadence)}
                      className={`py-1.5 rounded text-xs font-semibold border transition-all cursor-pointer ${
                        settings.chimeCadenceMinutes === cadence
                          ? 'bg-[#a76526] text-white border-[#894d0d]'
                          : 'bg-[#ffe9e2] text-[#2a170f] border-[#d8c3b4]/30'
                      }`}
                    >
                      {cadence}m
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between p-2.5 bg-[#ffe9e2] rounded-lg border border-[#d8c3b4]/30">
                <span className="font-['Fira_Sans',sans-serif] text-xs font-semibold text-[#2a170f]">
                  Mechanical Sound Synthesis
                </span>
                <input
                  type="checkbox"
                  checked={settings.soundEnabled}
                  onChange={(e) => handleChange('soundEnabled', e.target.checked)}
                  className="w-4 h-4 accent-[#894d0d] cursor-pointer"
                />
              </div>

              <button
                type="button"
                onClick={handleTestChime}
                className="w-full py-2 rounded-lg bg-[#ffe9e2] hover:bg-[#ffe2d8] text-[#894d0d] font-['Fira_Sans',sans-serif] text-xs font-bold uppercase tracking-wider border border-[#d8c3b4] flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span className="material-symbols-outlined text-base">music_note</span>
                <span>Strike Test Acoustic Chime</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
