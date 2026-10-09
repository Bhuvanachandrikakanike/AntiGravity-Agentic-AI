/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { CaloricChronometer } from './components/CaloricChronometer';
import { ChronoHydraChamber } from './components/ChronoHydraChamber';
import { AnalogControlPad } from './components/AnalogControlPad';
import { MealLedgerCards } from './components/MealLedgerCards';
import { FoodScannerScreen } from './components/FoodScannerScreen';
import { WeeklyLedgerScreen } from './components/WeeklyLedgerScreen';
import { DialSettingsScreen } from './components/DialSettingsScreen';
import { AddMealModal } from './components/AddMealModal';
import { ExportFolioModal } from './components/ExportFolioModal';
import { ChronoChatbot } from './components/ChronoChatbot';
import {
  INITIAL_MEAL_CATEGORIES,
  INITIAL_DIAL_SETTINGS,
  INITIAL_WEEKLY_LEDGER,
  BRASS_EMBLEM_URL,
} from './data/initialData';
import { MealCategory, DialSettings, MealItem, DayLedgerRecord } from './types';
import { playMechanicalClick, playStampSound } from './utils/audio';

export default function App() {
  // Navigation State
  const [activeScreen, setActiveScreen] = useState<
    'daily-log' | 'ai-food-scanner' | 'weekly-ledger' | 'chrono-advisor' | 'dial-settings'
  >('daily-log');

  // Core Data States
  const [categories, setCategories] = useState<MealCategory[]>(INITIAL_MEAL_CATEGORIES);
  const [dialSettings, setDialSettings] = useState<DialSettings>(INITIAL_DIAL_SETTINGS);
  const [weeklyLedger, setWeeklyLedger] = useState<DayLedgerRecord[]>(INITIAL_WEEKLY_LEDGER);
  const [waterMl, setWaterMl] = useState<number>(2150);

  // Fasting and Chime States
  const [fastingActive, setFastingActive] = useState<boolean>(true);
  const [fastingMinutes, setFastingMinutes] = useState<number>(14 * 60 + 22); // 14h 22m
  const [chimeArmed, setChimeArmed] = useState<boolean>(true);

  // Sync and Modal States
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncToast, setSyncToast] = useState<string | null>(null);
  const [activeAddCategory, setActiveAddCategory] = useState<
    'breakfast' | 'lunch' | 'dinner' | 'snacks' | null
  >(null);
  const [showExportModal, setShowExportModal] = useState<boolean>(false);
  const [isChatbotDrawerOpen, setIsChatbotDrawerOpen] = useState<boolean>(false);

  // Fasting Timer simulation (ticks every minute, or faster for preview responsiveness)
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    if (fastingActive) {
      timer = setInterval(() => {
        setFastingMinutes((prev) => prev + 1);
      }, 60000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [fastingActive]);

  // Derived Totals
  const totalCalories = categories.reduce((sum, cat) => sum + cat.totalCalories, 0);

  const totalMacros = categories.reduce(
    (acc, cat) => {
      cat.items.forEach((item) => {
        acc.protein += item.macros.protein;
        acc.carbs += item.macros.carbs;
        acc.fat += item.macros.fat;
      });
      return acc;
    },
    { protein: 0, carbs: 0, fat: 0 }
  );

  // Normalize macros if default entries
  const currentMacros = {
    protein: totalMacros.protein || 112,
    carbs: totalMacros.carbs || 185,
    fat: totalMacros.fat || 54,
  };

  // Water Actuator Pump Handler
  const handleAddWater = (delta: number) => {
    setWaterMl((prev) => Math.max(0, prev + delta));
  };

  // Chrono Sync Handler
  const handleSync = () => {
    setIsSyncing(true);
    setSyncToast('Calibrating escapement balances...');
    setTimeout(() => {
      setIsSyncing(false);
      setSyncToast('Chronometer Folios Synchronized to Ledger MMXXIV');
      setTimeout(() => setSyncToast(null), 3000);
    }, 1000);
  };

  // Add Item to Meal Category Handler
  const handleAddItemToCategory = (
    catId: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
    newItem: MealItem
  ) => {
    setCategories((prev) =>
      prev.map((cat) => {
        if (cat.id === catId) {
          const updatedItems = [newItem, ...cat.items];
          const newTotalCal = updatedItems.reduce((s, it) => s + it.calories, 0);
          return {
            ...cat,
            items: updatedItems,
            totalCalories: newTotalCal,
            stampedText: `Stamped ${newItem.stampedTime} • ChronoVerified`,
          };
        }
        return cat;
      })
    );
  };

  const fastingHours = Math.floor(fastingMinutes / 60);
  const fastingMinsRemaining = fastingMinutes % 60;

  return (
    <div className="min-h-screen bg-[#21120a] flex flex-col font-['Fira_Sans',sans-serif] selection:bg-[#ffdcc2] selection:text-[#2e1500]">
      {/* Horological Fixed Masthead */}
      <Header
        activeScreen={activeScreen}
        onSelectScreen={setActiveScreen}
        currentDateText="18 OCT"
        onSync={handleSync}
        isSyncing={isSyncing}
        soundEnabled={dialSettings.soundEnabled}
      />

      {/* Main Leather Desktop Canvas */}
      <main className="w-full pt-20 bg-[#21120a] min-h-[calc(100vh-5rem)] flex-1">
        <div className="max-w-[1240px] mx-auto px-4 md:px-10 py-6">
          {/* Synchronizing Status Toast */}
          {syncToast && (
            <div className="mb-4 px-4 py-2 rounded-lg bg-[#a76526] text-[#fffbff] shadow-lg flex items-center justify-between font-['Newsreader',serif] text-sm animate-fade-in border border-[#ffdcc2]/40">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-base">sync</span>
                <span>{syncToast}</span>
              </div>
              <span className="text-[10px] uppercase font-['Fira_Sans',sans-serif] font-bold text-[#ffdcc2]">
                ±0.00s TOLERANCE
              </span>
            </div>
          )}

          {/* Recessed Parchment Desk Container */}
          <div className="w-full rounded-xl bg-white shadow-[0_10px_28px_rgba(20,10,5,0.25),0_2px_6px_rgba(20,10,5,0.15),inset_0_0_0_1px_rgba(216,195,180,0.45)] p-6 md:p-8 relative overflow-hidden">
            {/* SCREEN 1: DAILY LOG (DEFAULT DASHBOARD VIEW) */}
            {activeScreen === 'daily-log' && (
              <div className="flex flex-col w-full pb-8">
                {/* Top Instrumentation Deck (Two-Wing Horological Chassis) */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-8">
                  {/* Left Wing: Caloric Chronometer (7 Cols) */}
                  <div className="lg:col-span-7">
                    <CaloricChronometer
                      currentCalories={totalCalories}
                      targetCalories={dialSettings.targetCalories}
                      toleranceKcal={dialSettings.toleranceKcal}
                      macros={currentMacros}
                      targetMacros={{
                        protein: dialSettings.targetProtein,
                        carbs: dialSettings.targetCarbs,
                        fat: dialSettings.targetFat,
                      }}
                    />
                  </div>

                  {/* Right Wing: ChronoHydra Chamber (5 Cols) */}
                  <div className="lg:col-span-5">
                    <ChronoHydraChamber
                      currentWaterMl={waterMl}
                      targetWaterMl={dialSettings.targetWaterMl}
                      onAddWater={handleAddWater}
                      soundEnabled={dialSettings.soundEnabled}
                    />
                  </div>
                </div>

                {/* Quick-Action Analog Control Pad */}
                <AnalogControlPad
                  fastingActive={fastingActive}
                  onToggleFasting={() => setFastingActive(!fastingActive)}
                  fastingElapsedHours={fastingHours}
                  fastingElapsedMinutes={fastingMinsRemaining}
                  fastingTargetHours={dialSettings.fastingTargetHours}
                  chimeArmed={chimeArmed}
                  onToggleChime={() => setChimeArmed(!chimeArmed)}
                  chimeCadenceMinutes={dialSettings.chimeCadenceMinutes}
                  onLaunchScanner={() => setActiveScreen('ai-food-scanner')}
                  soundEnabled={dialSettings.soundEnabled}
                />

                {/* Tactile Meal Timeline & Archival Ledger (4 Bento Cards) */}
                <MealLedgerCards
                  categories={categories}
                  totalCalories={totalCalories}
                  onAddItem={(catId) => setActiveAddCategory(catId)}
                  soundEnabled={dialSettings.soundEnabled}
                />

                {/* Tactile Footnote Register */}
                <div className="mt-8 p-4 rounded-lg bg-[#ffe9e2] flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#d8c3b4]/40">
                  <div className="flex items-center gap-2 text-[#524439]">
                    <span className="material-symbols-outlined text-[#857467]">
                      history_edu
                    </span>
                    <span className="font-['Fira_Sans',sans-serif] text-xs">
                      Archived entries are synchronized with the mechanical ChronoHydra Ledger at
                      midnight.
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      playMechanicalClick(dialSettings.soundEnabled);
                      setShowExportModal(true);
                    }}
                    className="px-4 py-2 rounded bg-white text-[#894d0d] font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider font-bold shadow hover:bg-[#fff8f6] transition-colors border border-[#d8c3b4]/40 cursor-pointer"
                  >
                    Export Daily Folio
                  </button>
                </div>
              </div>
            )}

            {/* SCREEN 2: AI FOOD SCANNER */}
            {activeScreen === 'ai-food-scanner' && (
              <FoodScannerScreen
                onCommitMeal={(catId, item) => handleAddItemToCategory(catId, item)}
                onBackToLog={() => setActiveScreen('daily-log')}
                soundEnabled={dialSettings.soundEnabled}
              />
            )}

            {/* SCREEN 3: WEEKLY LEDGER */}
            {activeScreen === 'weekly-ledger' && (
              <WeeklyLedgerScreen
                ledgerRecords={weeklyLedger}
                onBackToLog={() => setActiveScreen('daily-log')}
                onExport={() => setShowExportModal(true)}
                soundEnabled={dialSettings.soundEnabled}
              />
            )}

            {/* SCREEN 4: CHRONO-ADVISOR GEMINI CHATBOT */}
            {activeScreen === 'chrono-advisor' && (
              <div className="h-[680px]">
                <ChronoChatbot
                  currentCalories={totalCalories}
                  targetCalories={dialSettings.targetCalories}
                  waterMl={waterMl}
                  targetWaterMl={dialSettings.targetWaterMl}
                  fastingActive={fastingActive}
                  fastingElapsedText={`${fastingHours}h ${fastingMinsRemaining}m`}
                  soundEnabled={dialSettings.soundEnabled}
                />
              </div>
            )}

            {/* SCREEN 5: DIAL SETTINGS */}
            {activeScreen === 'dial-settings' && (
              <DialSettingsScreen
                settings={dialSettings}
                onUpdateSettings={(newS) => setDialSettings(newS)}
                onBackToLog={() => setActiveScreen('daily-log')}
                onResetDefaults={() => setDialSettings(INITIAL_DIAL_SETTINGS)}
              />
            )}
          </div>
        </div>
      </main>

      {/* Floating Brass Pocket-Watch Chatbot Summoner Button */}
      <aside aria-label="Floating Gemini Oracle Summoner" className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => {
            playMechanicalClick(dialSettings.soundEnabled);
            setIsChatbotDrawerOpen(!isChatbotDrawerOpen);
          }}
          className="relative group p-3.5 rounded-full bg-gradient-to-br from-[#ffdcc2] via-[#a76526] to-[#6d3a00] shadow-[0_6px_20px_rgba(20,10,5,0.6),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-[#ffdcc2]/50 flex items-center justify-center"
          title="Consult the Chrono-Nutritional Gemini Oracle"
        >
          {/* Outer Watch Bezel Ticks */}
          <div className="w-8 h-8 rounded-full bg-[#2a170f] flex items-center justify-center shadow-inner">
            <span className="material-symbols-outlined text-[#ffb77b] text-xl group-hover:rotate-12 transition-transform">
              {isChatbotDrawerOpen ? 'close' : 'smart_toy'}
            </span>
          </div>

          {/* Active Ping Badge */}
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ffb77b] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#176a30] border-2 border-[#2a170f]"></span>
          </span>

          {/* Tooltip Tag */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded bg-[#2a170f] text-[#ffdcc2] font-['Newsreader',serif] text-xs font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-md border border-[#894d0d]">
            Consult Gemini Oracle
          </span>
        </button>
      </aside>

      {/* Floating Chatbot Modal / Drawer */}
      {isChatbotDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-[#2a170f]/75 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-fade-in">
          <div className="w-full max-w-2xl h-[700px] max-h-[92vh] flex flex-col">
            <ChronoChatbot
              currentCalories={totalCalories}
              targetCalories={dialSettings.targetCalories}
              waterMl={waterMl}
              targetWaterMl={dialSettings.targetWaterMl}
              fastingActive={fastingActive}
              fastingElapsedText={`${fastingHours}h ${fastingMinsRemaining}m`}
              soundEnabled={dialSettings.soundEnabled}
              isOpenAsModal={true}
              onCloseModal={() => setIsChatbotDrawerOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Tactile Horological Colophon Footer */}
      <footer className="w-full bg-[#fff1ec] shadow-[inset_0_1px_0_rgba(216,195,180,0.35)] py-6 border-t border-[#d8c3b4]/30">
        <div className="max-w-[1240px] mx-auto px-4 md:px-10 flex flex-col md:flex-row items-center justify-between gap-4 text-[#524439]">
          <div className="flex items-center gap-2">
            <span className="font-['Fira_Sans',sans-serif] text-xs uppercase tracking-wider text-[#894d0d] font-bold">
              ChronoHydra &amp; AuraNutrient Mechanical Instrumentation
            </span>
            <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467]">
              • Precision Caloric Balances
            </span>
          </div>
          <div className="flex items-center gap-4 font-['Fira_Sans',sans-serif] text-xs">
            <span className="text-[#857467]">
              Crafted with Milled Brass, Optical Glass &amp; Archival Parchment
            </span>
            <span className="text-[#d8c3b4]">•</span>
            <span className="text-[#2a170f] font-semibold">© ChronoTrack MMXXIV</span>
          </div>
        </div>
      </footer>

      {/* Add Item Modal */}
      {activeAddCategory && (
        <AddMealModal
          categoryId={activeAddCategory}
          categoryTitle={
            categories.find((c) => c.id === activeAddCategory)?.title || 'Meal'
          }
          onClose={() => setActiveAddCategory(null)}
          onSave={handleAddItemToCategory}
          soundEnabled={dialSettings.soundEnabled}
        />
      )}

      {/* Export Daily Folio Modal */}
      {showExportModal && (
        <ExportFolioModal
          dateText="18 OCT"
          categories={categories}
          totalCalories={totalCalories}
          targetCalories={dialSettings.targetCalories}
          waterMl={waterMl}
          targetWaterMl={dialSettings.targetWaterMl}
          macros={currentMacros}
          onClose={() => setShowExportModal(false)}
          soundEnabled={dialSettings.soundEnabled}
        />
      )}
    </div>
  );
}
