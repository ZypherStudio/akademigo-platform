import { PlayerProgress, QuestProgress } from '../types/game';

const STORAGE_KEY = 'knowza_blast_progress_v1';
const HEART_REGEN_MS = 15 * 60 * 1000; // 15 minutes per heart

export const DEFAULT_QUESTS: QuestProgress[] = [
  {
    id: 'q_cubes',
    title: '120 Küp Patlat',
    target: 120,
    progress: 0,
    rewardCoins: 150,
    rewardStars: 20,
    claimed: false,
    type: 'blast_cubes'
  },
  {
    id: 'q_lines',
    title: '5 Blok Satırı Temizle',
    target: 5,
    progress: 0,
    rewardCoins: 200,
    rewardStars: 30,
    claimed: false,
    type: 'clear_lines'
  },
  {
    id: 'q_levels',
    title: '2 Seviye Tamamla',
    target: 2,
    progress: 0,
    rewardCoins: 250,
    rewardStars: 40,
    claimed: false,
    type: 'win_levels'
  }
];

export const INITIAL_PROGRESS: PlayerProgress = {
  name: 'Knowza',
  level: 1,
  xp: 0,
  coins: 1250,
  stars: 50,
  hearts: 5,
  maxHearts: 5,
  lastHeartUpdate: Date.now(),
  unlockedLevel: 1,
  levelStars: {},
  highBlockScore: 0,
  totalCubesBlasted: 0,
  totalLinesCleared: 0,
  boosters: {
    hammer: 3,
    rocket: 3,
    bomb: 3,
    disco: 3
  },
  dailyStreak: 1,
  lastDailyClaimDate: null,
  dailyClaimedDays: [],
  quests: DEFAULT_QUESTS,
  badges: ['welcome_bear'],
  soundEnabled: true,
  hapticsEnabled: true,
  castleStages: {
    fountain: 0,
    library: 0,
    tower: 0,
    garden: 0,
    throne: 0
  },
  equippedOutfit: 'classic',
  unlockedOutfits: ['classic', 'crimson', 'karate'],
  equippedAccessory: 'none',
  unlockedAccessories: ['none', 'bandana'],
  equippedBlockTheme: 'classic',
  unlockedBlockThemes: ['classic', 'crystal']
};

export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    const merged: PlayerProgress = {
      ...INITIAL_PROGRESS,
      ...parsed,
      boosters: { ...INITIAL_PROGRESS.boosters, ...(parsed.boosters || {}) },
      castleStages: { ...INITIAL_PROGRESS.castleStages, ...(parsed.castleStages || {}) },
      unlockedOutfits: parsed.unlockedOutfits?.length ? parsed.unlockedOutfits : INITIAL_PROGRESS.unlockedOutfits,
      unlockedAccessories: parsed.unlockedAccessories?.length ? parsed.unlockedAccessories : INITIAL_PROGRESS.unlockedAccessories,
      unlockedBlockThemes: parsed.unlockedBlockThemes?.length ? parsed.unlockedBlockThemes : INITIAL_PROGRESS.unlockedBlockThemes,
      quests: parsed.quests && parsed.quests.length ? parsed.quests : DEFAULT_QUESTS,
      badges: parsed.badges && parsed.badges.length ? parsed.badges : INITIAL_PROGRESS.badges
    };
    return applyHeartRegen(merged);
  } catch {
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: PlayerProgress) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch {
    // Ignore storage quota issues
  }
}

export function applyHeartRegen(p: PlayerProgress): PlayerProgress {
  if (p.hearts >= p.maxHearts) {
    return { ...p, hearts: p.maxHearts, lastHeartUpdate: Date.now() };
  }
  const now = Date.now();
  const elapsed = Math.max(0, now - p.lastHeartUpdate);
  const gained = Math.floor(elapsed / HEART_REGEN_MS);
  if (gained <= 0) return p;
  const nextHearts = Math.min(p.maxHearts, p.hearts + gained);
  return {
    ...p,
    hearts: nextHearts,
    lastHeartUpdate: nextHearts >= p.maxHearts ? now : p.lastHeartUpdate + gained * HEART_REGEN_MS
  };
}

export function getNextHeartSeconds(p: PlayerProgress): number {
  if (p.hearts >= p.maxHearts) return 0;
  const elapsed = Math.max(0, Date.now() - p.lastHeartUpdate);
  const rem = HEART_REGEN_MS - (elapsed % HEART_REGEN_MS);
  return Math.max(1, Math.ceil(rem / 1000));
}

export function xpForNextLevel(level: number): number {
  return 200 + (level - 1) * 80;
}

export function addXpToProgress(p: PlayerProgress, addedXp: number): PlayerProgress {
  let xp = p.xp + addedXp;
  let level = p.level;
  while (xp >= xpForNextLevel(level)) {
    xp -= xpForNextLevel(level);
    level += 1;
  }
  return { ...p, xp, level };
}
