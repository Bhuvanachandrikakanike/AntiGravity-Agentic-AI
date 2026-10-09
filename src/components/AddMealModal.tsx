import React, { useState } from 'react';
import { MealItem } from '../types';
import { playStampSound, playMechanicalClick } from '../utils/audio';

interface AddMealModalProps {
  categoryId: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  categoryTitle: string;
  onClose: () => void;
  onSave: (categoryId: 'breakfast' | 'lunch' | 'dinner' | 'snacks', item: MealItem) => void;
  soundEnabled: boolean;
}

const QUICK_PRESETS: Array<{
  name: string;
  subtitle: string;
  calories: number;
  macros: { protein: number; carbs: number; fat: number };
}> = [
  {
    name: 'Artisanal Sourdough & Grass Butter',
    subtitle: 'Slow-fermented rye slice, cultured A2 butter',
    calories: 190,
    macros: { protein: 4, carbs: 24, fat: 9 },
  },
  {
    name: 'Steamed Pastured Egg',
    subtitle: 'Soft-boiled farm egg with sea salt flakes',
    calories: 78,
    macros: { protein: 6, carbs: 1, fat: 5 },
  },
  {
    name: 'Simmered Bone Broth',
    subtitle: 'Grass-fed beef marrow broth, ginger, scallion',
    calories: 85,
    macros: { protein: 14, carbs: 2, fat: 3 },
  },
  {
    name: 'Sprouted Raw Almonds',
    subtitle: 'Activated organic almonds, fleur de sel',
    calories: 160,
    macros: { protein: 6, carbs: 6, fat: 14 },
  },
];

export const AddMealModal: React.FC<AddMealModalProps> = ({
  categoryId,
  categoryTitle,
  onClose,
  onSave,
  soundEnabled,
}) => {
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [calories, setCalories] = useState<number>(250);
  const [protein, setProtein] = useState<number>(15);
  const [carbs, setCarbs] = useState<number>(20);
  const [fat, setFat] = useState<number>(10);

  const handleApplyPreset = (p: typeof QUICK_PRESETS[0]) => {
    playMechanicalClick(soundEnabled);
    setName(p.name);
    setSubtitle(p.subtitle);
    setCalories(p.calories);
    setProtein(p.macros.protein);
    setCarbs(p.macros.carbs);
    setFat(p.macros.fat);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    playStampSound(soundEnabled);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newItem: MealItem = {
      id: `item-${Date.now()}`,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Handcrafted culinary intake',
      calories: Number(calories) || 0,
      macros: {
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fat: Number(fat) || 0,
      },
      imageUrl:
        'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=400&q=80',
      altText: name.trim(),
      loggedTime: timeStr,
      stampedTime: timeStr,
      chronoverified: true,
    };

    onSave(categoryId, newItem);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#2a170f]/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#fff8f6] rounded-xl shadow-2xl border border-[#d8c3b4] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 bg-[#ffe9e2] border-b border-[#d8c3b4]/40 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#894d0d]">edit_note</span>
            <h3 className="font-['Newsreader',serif] text-xl font-semibold text-[#2a170f]">
              Transcribe Item • {categoryTitle}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded text-[#857467] hover:text-[#2a170f] hover:bg-[#ffe2d8]"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleFormSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto">
          {/* Quick presets */}
          <div>
            <span className="font-['Fira_Sans',sans-serif] text-[10px] text-[#857467] uppercase font-bold tracking-wider block mb-1.5">
              Rapid Horological Transcriptions
            </span>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_PRESETS.map((p) => (
                <button
                  key={p.name}
                  type="button"
                  onClick={() => handleApplyPreset(p)}
                  className="p-2 rounded bg-[#ffe9e2] hover:bg-[#ffe2d8] border border-[#d8c3b4]/40 text-left text-xs font-semibold text-[#2a170f] transition-colors cursor-pointer truncate"
                >
                  <div className="truncate">{p.name}</div>
                  <div className="text-[10px] text-[#894d0d] font-bold">{p.calories} kcal</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="font-['Fira_Sans',sans-serif] text-xs font-semibold text-[#2a170f] block mb-1">
              Food or Preparation Title
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Poached Halibut & Fennel"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#fff1ec] px-3 py-2 rounded-lg border border-[#d8c3b4] font-['Newsreader',serif] text-base text-[#2a170f] focus:outline-[#894d0d]"
            />
          </div>

          <div>
            <label className="font-['Fira_Sans',sans-serif] text-xs font-semibold text-[#2a170f] block mb-1">
              Ingredients &amp; Tasting Inscription
            </label>
            <input
              type="text"
              placeholder="e.g. Olive oil braised, wild chives, saffron broth"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full bg-[#fff1ec] px-3 py-2 rounded-lg border border-[#d8c3b4] font-['Fira_Sans',sans-serif] text-xs text-[#2a170f] focus:outline-[#894d0d]"
            />
          </div>

          {/* Energy & Macros */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <label className="font-['Fira_Sans',sans-serif] text-[10px] text-[#894d0d] uppercase font-bold block mb-1">
                Calories
              </label>
              <input
                type="number"
                min="0"
                value={calories}
                onChange={(e) => setCalories(Number(e.target.value))}
                className="w-full bg-[#fff1ec] px-2 py-1.5 rounded border border-[#d8c3b4] font-['Newsreader',serif] text-lg font-bold text-[#894d0d] text-center"
              />
            </div>
            <div>
              <label className="font-['Fira_Sans',sans-serif] text-[10px] text-[#176a30] uppercase font-bold block mb-1">
                Protein (g)
              </label>
              <input
                type="number"
                min="0"
                value={protein}
                onChange={(e) => setProtein(Number(e.target.value))}
                className="w-full bg-[#fff1ec] px-2 py-1.5 rounded border border-[#d8c3b4] font-['Newsreader',serif] text-lg font-bold text-[#176a30] text-center"
              />
            </div>
            <div>
              <label className="font-['Fira_Sans',sans-serif] text-[10px] text-[#894d0d] uppercase font-bold block mb-1">
                Carbs (g)
              </label>
              <input
                type="number"
                min="0"
                value={carbs}
                onChange={(e) => setCarbs(Number(e.target.value))}
                className="w-full bg-[#fff1ec] px-2 py-1.5 rounded border border-[#d8c3b4] font-['Newsreader',serif] text-lg font-bold text-[#894d0d] text-center"
              />
            </div>
            <div>
              <label className="font-['Fira_Sans',sans-serif] text-[10px] text-[#8c4f10] uppercase font-bold block mb-1">
                Fat (g)
              </label>
              <input
                type="number"
                min="0"
                value={fat}
                onChange={(e) => setFat(Number(e.target.value))}
                className="w-full bg-[#fff1ec] px-2 py-1.5 rounded border border-[#d8c3b4] font-['Newsreader',serif] text-lg font-bold text-[#8c4f10] text-center"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d8c3b4]/30">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#ffe9e2] text-[#857467] font-['Fira_Sans',sans-serif] text-xs font-semibold hover:bg-[#ffe2d8] border border-[#d8c3b4]/40 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-gradient-to-b from-[#ffdcc2] to-[#894d0d] text-[#2e1500] font-['Fira_Sans',sans-serif] text-xs font-bold uppercase tracking-wider shadow hover:brightness-105 active:translate-y-0.5 border border-[#ffdcc2]/40 cursor-pointer"
            >
              Stamp Entry
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
