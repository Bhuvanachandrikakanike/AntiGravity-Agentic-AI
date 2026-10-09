import React from 'react';
import { playMechanicalClick, playAcousticChime } from '../utils/audio';

interface AnalogControlPadProps {
  fastingActive: boolean;
  onToggleFasting: () => void;
  fastingElapsedHours: number;
  fastingElapsedMinutes: number;
  fastingTargetHours: number;
  chimeArmed: boolean;
  onToggleChime: () => void;
  chimeCadenceMinutes: number;
  onLaunchScanner: () => void;
  soundEnabled: boolean;
}

export const AnalogControlPad: React.FC<AnalogControlPadProps> = ({
  fastingActive,
  onToggleFasting,
  fastingElapsedHours,
  fastingElapsedMinutes,
  fastingTargetHours,
  chimeArmed,
  onToggleChime,
  chimeCadenceMinutes,
  onLaunchScanner,
  soundEnabled,
}) => {
  const handleFastingToggle = () => {
    playMechanicalClick(soundEnabled);
    onToggleFasting();
  };

  const handleChimeToggle = () => {
    if (!chimeArmed) {
      playAcousticChime(soundEnabled);
    } else {
      playMechanicalClick(soundEnabled);
    }
    onToggleChime();
  };

  const handleLaunch = () => {
    playMechanicalClick(soundEnabled);
    onLaunchScanner();
  };

  return (
    <div className="w-full bg-[#ffe9e2] rounded-xl p-4 mb-9 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 border border-[#d8c3b4]/40">
      {/* Switches Group */}
      <div className="flex flex-wrap items-center gap-6">
        {/* Mechanical Rocker: Fasting Chronometer */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleFastingToggle}
            className={`w-12 h-6 rounded-full bg-[#422b22] shadow-inner p-0.5 flex items-center transition-colors cursor-pointer border border-[#857467]/30 ${
              fastingActive ? 'justify-end' : 'justify-start'
            }`}
            title="Toggle Fasting Chronometer"
          >
            <span
              className={`w-5 h-5 rounded-full shadow-md transition-transform ${
                fastingActive
                  ? 'bg-[#ffb77b] shadow-[0_0_8px_rgba(255,183,123,0.8)]'
                  : 'bg-[#857467]'
              }`}
            />
          </button>
          <div className="flex flex-col">
            <span className="font-['Newsreader',serif] text-lg text-[#2a170f] font-semibold leading-tight">
              Fasting Chronometer
            </span>
            <span
              className={`font-['Fira_Sans',sans-serif] text-[10px] uppercase font-bold tracking-wider ${
                fastingActive ? 'text-[#176a30]' : 'text-[#857467]'
              }`}
            >
              {fastingActive
                ? `ACTIVE • ${fastingElapsedHours}H ${fastingElapsedMinutes.toString().padStart(2, '0')}M (TARGET ${fastingTargetHours}H)`
                : 'PAUSED • FAST SUSPENDED'}
            </span>
          </div>
        </div>

        {/* Mechanical Rocker: Acoustic Chime */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleChimeToggle}
            className={`w-12 h-6 rounded-full bg-[#422b22] shadow-inner p-0.5 flex items-center transition-colors cursor-pointer border border-[#857467]/30 ${
              chimeArmed ? 'justify-end' : 'justify-start'
            }`}
            title="Toggle Hydration Acoustic Chime"
          >
            <span
              className={`w-5 h-5 rounded-full shadow-md transition-transform ${
                chimeArmed
                  ? 'bg-[#d0e4ff] shadow-[0_0_8px_rgba(208,228,255,0.8)]'
                  : 'bg-[#857467]'
              }`}
            />
          </button>
          <div className="flex flex-col">
            <span className="font-['Newsreader',serif] text-lg text-[#2a170f] font-semibold leading-tight">
              Acoustic Chime
            </span>
            <span
              className={`font-['Fira_Sans',sans-serif] text-[10px] uppercase font-bold tracking-wider ${
                chimeArmed ? 'text-[#0062a1]' : 'text-[#857467]'
              }`}
            >
              {chimeArmed ? `ARMED • ${chimeCadenceMinutes} MIN CADENCE` : 'MUTED • CHIME IDLE'}
            </span>
          </div>
        </div>
      </div>

      {/* Prominent Embossed Brass CTA: Launch AI Food Scanner */}
      <button
        type="button"
        onClick={handleLaunch}
        className="w-full md:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#6d3a00] shadow-lg hover:brightness-105 active:translate-y-0.5 active:shadow-inner flex items-center justify-center gap-2 font-['Fira_Sans',sans-serif] text-sm uppercase tracking-wider font-bold transition-all border border-[#ffdcc2]/40 cursor-pointer"
      >
        <span className="material-symbols-outlined text-lg leading-none">photo_camera</span>
        <span>Launch AI Camera Scanner</span>
      </button>
    </div>
  );
};
