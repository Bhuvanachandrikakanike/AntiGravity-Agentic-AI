import React, { useState } from 'react';
import { BRASS_EMBLEM_URL, USER_AVATAR_URL } from '../data/initialData';
import { playMechanicalClick } from '../utils/audio';

interface HeaderProps {
  activeScreen: 'daily-log' | 'ai-food-scanner' | 'weekly-ledger' | 'chrono-advisor' | 'dial-settings';
  onSelectScreen: (screen: 'daily-log' | 'ai-food-scanner' | 'weekly-ledger' | 'chrono-advisor' | 'dial-settings') => void;
  currentDateText: string;
  onSync: () => void;
  isSyncing: boolean;
  soundEnabled: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  activeScreen,
  onSelectScreen,
  currentDateText,
  onSync,
  isSyncing,
  soundEnabled,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Parse day and month from text like "18 OCT"
  const parts = currentDateText.split(' ');
  const dayStr = parts[0] || '18';
  const monthStr = parts[1] || 'OCT';
  const dayDigit1 = dayStr[0] || '1';
  const dayDigit2 = dayStr[1] || '8';

  const handleNav = (screen: 'daily-log' | 'ai-food-scanner' | 'weekly-ledger' | 'chrono-advisor' | 'dial-settings') => {
    playMechanicalClick(soundEnabled);
    onSelectScreen(screen);
    setMobileMenuOpen(false);
  };

  const handleSyncClick = () => {
    playMechanicalClick(soundEnabled);
    onSync();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-[#422b22] shadow-[0_12px_32px_rgba(20,10,5,0.45),inset_0_-1px_0_rgba(216,195,180,0.2)]">
      <div className="h-20 max-w-[1240px] mx-auto px-4 md:px-10 flex items-center justify-between gap-4">
        {/* Brand Emblem & Logotype */}
        <div 
          onClick={() => handleNav('daily-log')}
          className="flex items-center gap-3 shrink-0 cursor-pointer select-none"
        >
          <div className="p-1 rounded-lg bg-[#ffe9e2] shadow-[inset_0_2px_4px_rgba(42,23,15,0.5),0_1px_0_rgba(255,220,194,0.3)] flex items-center justify-center">
            <img
              alt="AuraNutrient Chrono-Nutrient Brass Emblem"
              className="h-8 w-auto object-contain"
              src={BRASS_EMBLEM_URL}
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="font-['Newsreader',serif] text-xl font-semibold text-[#ffdcc2] tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                AuraNutrient
              </span>
              <span className="font-['Newsreader',serif] text-lg text-[#d8c3b4] font-light">
                &amp;
              </span>
              <span className="font-['Newsreader',serif] text-xl font-semibold text-[#ffb77b] tracking-tight drop-shadow-[0_1px_1px_rgba(0,0,0,0.8)]">
                ChronoHydra
              </span>
            </div>
            <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#d8c3b4] uppercase tracking-widest font-bold">
              Chronometer Log • Mk. IV
            </span>
          </div>
        </div>

        {/* Desktop Mechanical Segmented Navigation */}
        <div className="hidden md:flex items-center p-1 rounded-xl bg-[#2a170f] shadow-[inset_0_3px_8px_rgba(0,0,0,0.8),inset_0_-1px_1px_rgba(255,255,255,0.1)]">
          <nav className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleNav('daily-log')}
              className={`px-4 py-1.5 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold transition-all duration-150 ${
                activeScreen === 'daily-log'
                  ? 'bg-[#a76526] text-[#fffbff] shadow-[0_2px_6px_rgba(10,5,3,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                  : 'text-[#d8c3b4] hover:text-[#fff8f6] hover:bg-[#422b22]'
              }`}
            >
              Daily Log
            </button>
            <button
              type="button"
              onClick={() => handleNav('ai-food-scanner')}
              className={`px-4 py-1.5 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold transition-all duration-150 ${
                activeScreen === 'ai-food-scanner'
                  ? 'bg-[#a76526] text-[#fffbff] shadow-[0_2px_6px_rgba(10,5,3,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                  : 'text-[#d8c3b4] hover:text-[#fff8f6] hover:bg-[#422b22]'
              }`}
            >
              AI Food Scanner
            </button>
            <button
              type="button"
              onClick={() => handleNav('weekly-ledger')}
              className={`px-4 py-1.5 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold transition-all duration-150 ${
                activeScreen === 'weekly-ledger'
                  ? 'bg-[#a76526] text-[#fffbff] shadow-[0_2px_6px_rgba(10,5,3,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                  : 'text-[#d8c3b4] hover:text-[#fff8f6] hover:bg-[#422b22]'
              }`}
            >
              Weekly Ledger
            </button>
            <button
              type="button"
              onClick={() => handleNav('chrono-advisor')}
              className={`px-4 py-1.5 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold transition-all duration-150 flex items-center gap-1 ${
                activeScreen === 'chrono-advisor'
                  ? 'bg-[#a76526] text-[#fffbff] shadow-[0_2px_6px_rgba(10,5,3,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                  : 'text-[#d8c3b4] hover:text-[#fff8f6] hover:bg-[#422b22]'
              }`}
            >
              <span className="material-symbols-outlined text-sm leading-none">smart_toy</span>
              <span>Chrono Advisor</span>
            </button>
            <button
              type="button"
              onClick={() => handleNav('dial-settings')}
              className={`px-4 py-1.5 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold transition-all duration-150 ${
                activeScreen === 'dial-settings'
                  ? 'bg-[#a76526] text-[#fffbff] shadow-[0_2px_6px_rgba(10,5,3,0.6),inset_0_1px_1px_rgba(255,255,255,0.35)]'
                  : 'text-[#d8c3b4] hover:text-[#fff8f6] hover:bg-[#422b22]'
              }`}
            >
              Dial Settings
            </button>
          </nav>
        </div>

        {/* Right Section: Calendar Indicator, Sync Actuator, Profile */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Horological Calendar Display */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowDatePicker(!showDatePicker)}
              className="hidden lg:flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#ffe9e2] shadow-[inset_0_2px_4px_rgba(42,23,15,0.6),0_1px_0_rgba(255,220,194,0.2)] hover:brightness-105 transition-all cursor-pointer"
              title="Horological Calendar Register"
            >
              <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] font-bold uppercase">
                CAL
              </span>
              <div className="flex items-center gap-0.5 font-['Newsreader',serif] text-sm text-[#2a170f] font-semibold">
                <span className="px-1.5 py-0.5 rounded bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                  {dayDigit1}
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white shadow-[0_1px_2px_rgba(0,0,0,0.2)]">
                  {dayDigit2}
                </span>
                <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] px-1 font-bold">
                  {monthStr}
                </span>
              </div>
            </button>

            {/* Mini Calendar Popup */}
            {showDatePicker && (
              <div className="absolute right-0 top-12 z-50 w-64 bg-[#fff8f6] border border-[#d8c3b4] rounded-xl shadow-2xl p-4 text-[#2a170f]">
                <div className="flex justify-between items-center mb-2 pb-2 border-b border-[#ffe9e2]">
                  <span className="font-['Newsreader',serif] font-semibold text-sm">October 2026</span>
                  <span className="text-[10px] text-[#857467] font-bold uppercase">MK. IV CHRONO</span>
                </div>
                <div className="grid grid-cols-7 gap-1 text-center text-xs">
                  {['M','T','W','T','F','S','S'].map((d, i) => (
                    <span key={i} className="text-[10px] text-[#857467] font-bold">{d}</span>
                  ))}
                  {[12,13,14,15,16,17,18].map((dayNum) => (
                    <button
                      key={dayNum}
                      type="button"
                      onClick={() => {
                        setShowDatePicker(false);
                        playMechanicalClick(soundEnabled);
                      }}
                      className={`py-1 rounded text-xs transition-colors ${
                        dayNum === 18
                          ? 'bg-[#a76526] text-white font-bold'
                          : 'hover:bg-[#ffe9e2] text-[#2a170f]'
                      }`}
                    >
                      {dayNum}
                    </button>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-[#ffe9e2] text-[11px] text-[#857467] text-center">
                  Today is Day 18 • Folios Synchronized
                </div>
              </div>
            )}
          </div>

          {/* Sync Button */}
          <button
            type="button"
            onClick={handleSyncClick}
            disabled={isSyncing}
            className={`p-2 rounded-lg bg-[#a76526] text-[#fffbff] shadow-[0_3px_8px_rgba(10,5,3,0.5),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:brightness-110 active:translate-y-0.5 active:shadow-[inset_0_3px_5px_rgba(0,0,0,0.6)] flex items-center justify-center transition-all cursor-pointer ${
              isSyncing ? 'opacity-80' : ''
            }`}
            title="Trigger Chrono Sync & Balance Re-Computation"
          >
            <span
              className={`material-symbols-outlined text-lg leading-none transition-transform ${
                isSyncing ? 'animate-spin' : ''
              }`}
            >
              sync
            </span>
          </button>

          {/* User Profile Avatar with Brass Bezel */}
          <div className="p-0.5 rounded-full bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] shadow-[0_3px_8px_rgba(10,5,3,0.6)] flex items-center justify-center">
            <div className="p-0.5 rounded-full bg-[#2a170f]">
              <img
                alt="ChronoTrack Officer Profile"
                className="w-8 h-8 rounded-full object-cover"
                src={USER_AVATAR_URL}
              />
            </div>
          </div>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#2a170f] text-[#ffdcc2] flex items-center justify-center"
            title="Toggle Menu"
          >
            <span className="material-symbols-outlined text-xl">
              {mobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#2a170f] border-t border-[#857467]/30 px-4 py-3 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => handleNav('daily-log')}
            className={`px-4 py-2 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold text-left ${
              activeScreen === 'daily-log' ? 'bg-[#a76526] text-[#fffbff]' : 'text-[#d8c3b4]'
            }`}
          >
            Daily Log
          </button>
          <button
            type="button"
            onClick={() => handleNav('ai-food-scanner')}
            className={`px-4 py-2 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold text-left ${
              activeScreen === 'ai-food-scanner' ? 'bg-[#a76526] text-[#fffbff]' : 'text-[#d8c3b4]'
            }`}
          >
            AI Food Scanner
          </button>
          <button
            type="button"
            onClick={() => handleNav('weekly-ledger')}
            className={`px-4 py-2 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold text-left ${
              activeScreen === 'weekly-ledger' ? 'bg-[#a76526] text-[#fffbff]' : 'text-[#d8c3b4]'
            }`}
          >
            Weekly Ledger
          </button>
          <button
            type="button"
            onClick={() => handleNav('chrono-advisor')}
            className={`px-4 py-2 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold text-left flex items-center gap-2 ${
              activeScreen === 'chrono-advisor' ? 'bg-[#a76526] text-[#fffbff]' : 'text-[#d8c3b4]'
            }`}
          >
            <span className="material-symbols-outlined text-base">smart_toy</span>
            <span>Chrono Advisor</span>
          </button>
          <button
            type="button"
            onClick={() => handleNav('dial-settings')}
            className={`px-4 py-2 rounded-lg font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-semibold text-left ${
              activeScreen === 'dial-settings' ? 'bg-[#a76526] text-[#fffbff]' : 'text-[#d8c3b4]'
            }`}
          >
            Dial Settings
          </button>
        </div>
      )}
    </header>
  );
};
