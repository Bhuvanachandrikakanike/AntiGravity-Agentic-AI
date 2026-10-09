import { MealCategory, DialSettings, DayLedgerRecord } from '../types';

export const BRASS_EMBLEM_URL =
  'https://lh3.googleusercontent.com/aida/AEtjO1VIViSRk4mC01Hx5gS-C7ZkNCXFl7wnI7e5buo-5bMGFnUCDE6BEDPUhwbfS4epSFH8-d62bQ2RZoszYNzo955h_v4XlOyrwiKMJBCen84CQU0SgC2f8mTAXB0Uvm-MKJuhTyRdx_5scDIoHvgj029Bu7dUjVzORV9JYYCFv9nvOBc0ozqeo4mTX4-RflZ1wD5_1yLS-C7ksvQHGSjpRnJut-jUerp1ZpwFaTn7TIa83x7PH7ez8h3IgEw2';

export const USER_AVATAR_URL =
  'https://lh3.googleusercontent.com/aida-public/AB6AXuBeMYIGk2Ac_AHuHhuUSqVRYCET3hnWT6fUO85NwIRhqpA46h5Wpktneufco7ypamIvO3gv3lY4VZZWlCyl7UFFcj_RjFV2B1Uy-MExvkdx3guHIUNyGeJDYXugn-8kP9oCS5zHQxImQ5jRcGKPno7TBzgazdKMPnTPgRNi81FY3ng8fvnNO8QuZ4VzMewWlR5J0NHxwSnrGYQ8wZqt-MvgdtZqOaGlYGqI7ZUdfHcHvY7G0rPJgJfGkw';

export const INITIAL_DIAL_SETTINGS: DialSettings = {
  targetCalories: 2500,
  toleranceKcal: 25,
  targetWaterMl: 3000,
  targetProtein: 140,
  targetCarbs: 220,
  targetFat: 65,
  fastingTargetHours: 16,
  chimeCadenceMinutes: 45,
  soundEnabled: true,
  chimeEnabled: true,
};

export const INITIAL_MEAL_CATEGORIES: MealCategory[] = [
  {
    id: 'breakfast',
    entryNumber: 'Entry I',
    timeSlot: '08:15 AM',
    title: 'Breakfast',
    totalCalories: 420,
    stampedText: 'Stamped 08:32 AM • ChronoVerified',
    items: [
      {
        id: 'b-1',
        name: 'Avocado Toast & Poached Egg',
        subtitle: 'Sourdough, olive oil drizzle, microgreens',
        calories: 420,
        macros: { protein: 16, carbs: 38, fat: 22 },
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuDw1U9HBa4Eq8gDkwYZyWBdhk0yPuXpRxRjl979vyU7vIfZOjB-63qAQUl2m2XT6XDFdWixFn9Xw906GmE-sNwITKfH_bs4C0IiaEPHZ4vqfI1VnjC0EXeykpFnf6Ehd_Tjt5VXFV1nK81cMql3rS9ZG4JICcMpgA4DEzOXHj80nqN8h_duXIOfxLMI-oh8Q2PyvxTSuvlIHJNryYD01A0taxFItIBBWJ7b_ND3QgzOofbmPpb1Ju-7VQ',
        altText: 'Golden toasted artisanal sourdough topped with crushed emerald avocado and a delicately poached organic farm egg',
        loggedTime: '08:15 AM',
        stampedTime: '08:32 AM',
        chronoverified: true,
      },
    ],
  },
  {
    id: 'lunch',
    entryNumber: 'Entry II',
    timeSlot: '12:45 PM',
    title: 'Midday Repast • Lunch',
    totalCalories: 680,
    stampedText: 'Stamped 12:50 PM • ChronoVerified',
    items: [
      {
        id: 'l-1',
        name: 'Grilled Salmon Quinoa Bowl',
        subtitle: 'Wild Alaskan coho, edamame, ginger sesame',
        calories: 680,
        macros: { protein: 48, carbs: 56, fat: 24 },
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuAX7tFDbxuLzf3Dh1sk0Y1d6ur8ul_uk5SwNWuhezhmva-ESqza95WJ87xJXb120zd9S6kK6qc8dSB7ON5fIcyQ943fHn53eBgiGZNSzLVaMxLONSoou6Ahy7np5-hXjMtULmL-4LJCAwm2VnRuYk7iEUObDwskZHvjqxBoVfGl0-3u9vjd6QakxooEde5YF1qWr-iU6niQNfrwyG0vcMyw0XA1cHaRDXOQgcKt8BYdbXtpV8XYQuC2lA',
        altText: 'Seared wild salmon fillet resting on tri-color organic quinoa with edamame, sliced cucumber, and sesame ginger dressing',
        loggedTime: '12:45 PM',
        stampedTime: '12:50 PM',
        chronoverified: true,
      },
    ],
  },
  {
    id: 'dinner',
    entryNumber: 'Entry III',
    timeSlot: '07:15 PM',
    title: 'Evening Supper • Dinner',
    totalCalories: 640,
    stampedText: 'Stamped 07:30 PM • ChronoVerified',
    items: [
      {
        id: 'd-1',
        name: 'Grass-Fed Ribeye & Asparagus',
        subtitle: 'Charred garlic spears, rosemary tallow',
        calories: 640,
        macros: { protein: 42, carbs: 12, fat: 46 },
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuA-M3iQuW87TMRqYHiH1ge--7M9S0M3Bo9eVEKGJUG9ZreNbCTLom0ZmgpPPGb3uhpANCyW54B5HKJef1EnHZHkQ41LOoH-Yt27wzfnwA5jH-mDaHMyKUOnfNQ3yEFx2NZ8cQwdUMXTcB30v1tO-1mVvFxZ35-hlZKrMkqTSW2v5725UVA6Y3newHslVmWyfzm7wlRhVswhmwBQrzmxB4YQ358kf_wuOjgfltaAiwKD0EefFe6a6-c4qg',
        altText: 'Carved medium-rare grass-fed ribeye steak beside charred green asparagus spears and roasted garlic herb butter',
        loggedTime: '07:15 PM',
        stampedTime: '07:30 PM',
        chronoverified: true,
      },
    ],
  },
  {
    id: 'snacks',
    entryNumber: 'Entry IV',
    timeSlot: '04:30 PM',
    title: 'Provisions • Snacks',
    totalCalories: 200,
    stampedText: 'Stamped 04:45 PM • ChronoVerified',
    items: [
      {
        id: 's-1',
        name: 'Greek Yogurt & Wild Honey',
        subtitle: 'Raw wildflower honey, crushed walnut crumb',
        calories: 200,
        macros: { protein: 18, carbs: 22, fat: 5 },
        imageUrl:
          'https://lh3.googleusercontent.com/aida-public/AB6AXuCwE7sbdsxOURvPGSSNZbgRUp4DWwrzVRAZzd7Lmb5rSwu7ZZ7hMGVV4AmgwT3EWbXttOEFSAzedP-mP8PYJlWfVWjD857GWHUyeC5Kyk-gaF7AqO1cVlzHnBBHgYzqib_EmSxFDy1Ebqf6C7g2wGuU5_yuEDVUuV3vfBg3ce3kwYWjHKKHEaZgqZ3NqsytLtcUoEboDLi2-w5-NPojeXYt-7oFU-V91xEZChCY8NK4Ovi746NIkuSuXg',
        altText: 'Dense traditional Greek yogurt inside a glazed terracotta vessel with golden amber honeycomb drizzle and raw crushed walnuts',
        loggedTime: '04:30 PM',
        stampedTime: '04:45 PM',
        chronoverified: true,
      },
    ],
  },
];

export const SAMPLE_PRESET_SCANS = [
  {
    name: 'Shakshuka with Heritage Eggs & Feta',
    subtitle: 'Cast-iron simmered tomatoes, bell pepper, cumin, fresh parsley',
    calories: 380,
    macros: { protein: 22, carbs: 26, fat: 20 },
    imageUrl:
      'https://images.unsplash.com/photo-1590301157890-4810ed352733?auto=format&fit=crop&w=600&q=80',
    altText: 'Shakshuka in skillet with poached eggs',
  },
  {
    name: 'Japanese Matcha Oat Latte & Artisanal Granola',
    subtitle: 'Ceremonial grade Uji matcha, sprouted rolled oats, raw pepitas',
    calories: 290,
    macros: { protein: 12, carbs: 36, fat: 9 },
    imageUrl:
      'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=600&q=80',
    altText: 'Matcha latte with breakfast bowl',
  },
  {
    name: 'Pan-Roasted Sea Bass & Fennel Confit',
    subtitle: 'Crispy skin Chilean sea bass, braised saffron fennel, caper emulsion',
    calories: 520,
    macros: { protein: 44, carbs: 14, fat: 32 },
    imageUrl:
      'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=600&q=80',
    altText: 'Pan-roasted fish with herbs',
  },
  {
    name: 'Organic Roast Chicken Breast & Sweet Potato',
    subtitle: 'Thyme roasted free-range breast, baked jewel yam, steamed broccolini',
    calories: 560,
    macros: { protein: 52, carbs: 42, fat: 16 },
    imageUrl:
      'https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=600&q=80',
    altText: 'Roast chicken and sweet potato',
  },
];

export const INITIAL_WEEKLY_LEDGER: DayLedgerRecord[] = [
  {
    date: '2026-10-12',
    dayName: 'Monday',
    shortDate: '12 OCT',
    calories: 2380,
    targetCalories: 2500,
    waterMl: 2850,
    targetWaterMl: 3000,
    macros: { protein: 138, carbs: 215, fat: 62 },
    entriesCount: 4,
    status: 'optimal',
  },
  {
    date: '2026-10-13',
    dayName: 'Tuesday',
    shortDate: '13 OCT',
    calories: 2450,
    targetCalories: 2500,
    waterMl: 3100,
    targetWaterMl: 3000,
    macros: { protein: 144, carbs: 228, fat: 64 },
    entriesCount: 5,
    status: 'optimal',
  },
  {
    date: '2026-10-14',
    dayName: 'Wednesday',
    shortDate: '14 OCT',
    calories: 2190,
    targetCalories: 2500,
    waterMl: 2600,
    targetWaterMl: 3000,
    macros: { protein: 128, carbs: 195, fat: 58 },
    entriesCount: 3,
    status: 'deficit',
  },
  {
    date: '2026-10-15',
    dayName: 'Thursday',
    shortDate: '15 OCT',
    calories: 2520,
    targetCalories: 2500,
    waterMl: 2950,
    targetWaterMl: 3000,
    macros: { protein: 142, carbs: 224, fat: 66 },
    entriesCount: 4,
    status: 'optimal',
  },
  {
    date: '2026-10-16',
    dayName: 'Friday',
    shortDate: '16 OCT',
    calories: 2680,
    targetCalories: 2500,
    waterMl: 3200,
    targetWaterMl: 3000,
    macros: { protein: 152, carbs: 240, fat: 72 },
    entriesCount: 5,
    status: 'surplus',
  },
  {
    date: '2026-10-17',
    dayName: 'Saturday',
    shortDate: '17 OCT',
    calories: 2310,
    targetCalories: 2500,
    waterMl: 2800,
    targetWaterMl: 3000,
    macros: { protein: 132, carbs: 210, fat: 60 },
    entriesCount: 4,
    status: 'optimal',
  },
  {
    date: '2026-10-18',
    dayName: 'Sunday (Today)',
    shortDate: '18 OCT',
    calories: 1740,
    targetCalories: 2500,
    waterMl: 2150,
    targetWaterMl: 3000,
    macros: { protein: 112, carbs: 185, fat: 54 },
    entriesCount: 4,
    status: 'optimal',
  },
];
