export interface MacroNutrients {
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealItem {
  id: string;
  name: string;
  subtitle: string;
  calories: number;
  macros: MacroNutrients;
  imageUrl: string;
  altText: string;
  loggedTime: string;
  stampedTime: string;
  chronoverified: boolean;
}

export interface MealCategory {
  id: 'breakfast' | 'lunch' | 'dinner' | 'snacks';
  entryNumber: string;
  timeSlot: string;
  title: string;
  totalCalories: number;
  items: MealItem[];
  stampedText: string;
}

export interface DialSettings {
  targetCalories: number;
  toleranceKcal: number;
  targetWaterMl: number;
  targetProtein: number;
  targetCarbs: number;
  targetFat: number;
  fastingTargetHours: number;
  chimeCadenceMinutes: number;
  soundEnabled: boolean;
  chimeEnabled: boolean;
}

export interface DayLedgerRecord {
  date: string;
  dayName: string;
  shortDate: string;
  calories: number;
  targetCalories: number;
  waterMl: number;
  targetWaterMl: number;
  macros: MacroNutrients;
  entriesCount: number;
  status: 'optimal' | 'surplus' | 'deficit';
}
