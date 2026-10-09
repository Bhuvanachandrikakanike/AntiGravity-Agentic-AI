import React from 'react';
import { MealCategory } from '../types';
import { playMechanicalClick } from '../utils/audio';

interface MealLedgerCardsProps {
  categories: MealCategory[];
  totalCalories: number;
  onAddItem: (categoryId: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => void;
  onViewItem?: (categoryId: string, itemId: string) => void;
  soundEnabled: boolean;
}

export const MealLedgerCards: React.FC<MealLedgerCardsProps> = ({
  categories,
  totalCalories,
  onAddItem,
  soundEnabled,
}) => {
  const handlePlusClick = (e: React.MouseEvent, categoryId: 'breakfast' | 'lunch' | 'dinner' | 'snacks') => {
    e.stopPropagation();
    playMechanicalClick(soundEnabled);
    onAddItem(categoryId);
  };

  const totalEntries = categories.reduce((sum, cat) => sum + cat.items.length, 0);

  return (
    <div className="flex flex-col gap-6">
      {/* Section Title with Horological Timestamp */}
      <div className="flex items-center justify-between pb-1 border-b border-[#d8c3b4]/30">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#894d0d]">book</span>
          <h2 className="font-['Newsreader',serif] text-2xl font-semibold text-[#2a170f] tracking-tight">
            Daily Caloric Folio • Journal Entries
          </h2>
        </div>
        <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467]">
          Total logged today: {totalEntries} Folios • {totalCalories.toLocaleString()} kcal
        </span>
      </div>

      {/* 4 Embossed Ledger Cards (Bento 2x2 Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((category) => {
          const mainItem = category.items[0];
          return (
            <div
              key={category.id}
              className="relative bg-[#fff1ec] rounded-xl p-6 shadow-md flex flex-col justify-between border border-[#d8c3b4]/40 hover:shadow-lg transition-shadow"
            >
              {/* Brass Clipboard Clamp Visual */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-24 h-5 rounded-sm bg-gradient-to-r from-[#894d0d] via-[#ffdcc2] to-[#894d0d] shadow-md flex items-center justify-center border border-[#6d3a00]/30 z-10">
                <div className="w-12 h-1 bg-[#422b22] rounded-full opacity-60" />
              </div>

              {/* Top Row: Meal Heading & Caloric Readout */}
              <div className="flex items-start justify-between mt-2 mb-4">
                <div className="flex flex-col">
                  <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase tracking-widest font-bold">
                    {category.entryNumber} • {category.timeSlot}
                  </span>
                  <h3 className="font-['Newsreader',serif] text-xl font-semibold text-[#2a170f]">
                    {category.title}
                  </h3>
                </div>
                <div className="px-3 py-1 rounded bg-[#ffe9e2] shadow-inner text-right border border-[#d8c3b4]/30">
                  <span className="font-['Newsreader',serif] text-2xl text-[#894d0d] font-semibold leading-none block">
                    {category.totalCalories}
                  </span>
                  <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase block font-bold">
                    kcal
                  </span>
                </div>
              </div>

              {/* Meal Details & Photo Thumbnail */}
              {mainItem && (
                <div className="flex gap-4 items-center my-1">
                  <div className="w-20 h-20 rounded-lg overflow-hidden shrink-0 shadow-inner bg-[#ffe9e2] border border-[#d8c3b4]/40">
                    <img
                      className="w-full h-full object-cover"
                      alt={mainItem.altText || mainItem.name}
                      src={mainItem.imageUrl}
                      onError={(e) => {
                        // Fallback image if hotlink is blocked
                        (e.target as HTMLImageElement).src =
                          'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80';
                      }}
                    />
                  </div>
                  <div className="flex flex-col flex-1 min-w-0">
                    <span className="font-['Fira_Sans',sans-serif] text-base text-[#2a170f] font-medium truncate">
                      {mainItem.name}
                    </span>
                    <span className="font-['Fira_Sans',sans-serif] text-xs text-[#857467] italic line-clamp-1">
                      {mainItem.subtitle}
                    </span>
                    {/* Tactile Macro Ink Badges */}
                    <div className="flex items-center gap-1.5 mt-2">
                      <span className="px-2 py-0.5 rounded bg-[#ffe9e2] text-[#176a30] font-['Fira_Sans',sans-serif] text-[10px] font-bold border border-[#d8c3b4]/20">
                        P: {mainItem.macros.protein}g
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#ffe9e2] text-[#894d0d] font-['Fira_Sans',sans-serif] text-[10px] font-bold border border-[#d8c3b4]/20">
                        C: {mainItem.macros.carbs}g
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#ffe9e2] text-[#8c4f10] font-['Fira_Sans',sans-serif] text-[10px] font-bold border border-[#d8c3b4]/20">
                        F: {mainItem.macros.fat}g
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* If there are additional items in this category */}
              {category.items.length > 1 && (
                <div className="mt-2 text-xs text-[#857467] italic">
                  + {category.items.length - 1} additional folio item(s) logged
                </div>
              )}

              {/* Stamp-Style Verification Badge & Quick Addition */}
              <div className="flex items-center justify-between mt-4 pt-2 border-t border-[#d8c3b4]/30">
                <div className="px-2.5 py-1 rounded bg-[#ffe2d8] text-[#894d0d] font-['Fira_Sans',sans-serif] text-[10px] uppercase font-bold tracking-wider border border-[#ffdbce]">
                  {category.stampedText}
                </div>
                <button
                  type="button"
                  onClick={(e) => handlePlusClick(e, category.id)}
                  className="w-8 h-8 rounded-full bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#2a170f] shadow-md active:translate-y-0.5 active:shadow-inner flex items-center justify-center hover:brightness-110 cursor-pointer border border-[#2e1500]/20"
                  title={`Add or Edit ${category.title}`}
                >
                  <span className="material-symbols-outlined text-lg leading-none">add</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
