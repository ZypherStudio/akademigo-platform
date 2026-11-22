import { PlayerProgress, QuestProgress } from '../types/game';

const STORAGE_KEY = 'knowza_blast_progress_v1';
const HEART_REGEN_MS = 15 * 60 * 1000; // 15 minutes per heart

export function createDailyQuests(): QuestProgress[] {
  return [
    {
      id: 'q_cubes',
      title: '200 Küp Patlat',
      target: 200,
      progress: 0,
      rewardCoins: 150,
      rewardStars: 20,
      claimed: false,
      type: 'blast_cubes'
    },
    {
      id: 'q_lines',
      title: '8 Blok Satırı Temizle',
      target: 8,
      progress: 0,
      rewardCoins: 200,
      rewardStars: 30,
      claimed: false,
      type: 'clear_lines'
    },
    {
      id: 'q_streak',
      title: 'Üst Üste 2 Galibiyet (Seri)',
      target: 2,
      progress: 0,
      rewardCoins: 300,
      rewardStars: 45,
      claimed: false,
      type: 'win_streak'
    },
    {
      id: 'q_boosters',
      title: '2 Güçlendirici Kullan',
      target: 2,
      progress: 0,
      rewardCoins: 180,
      rewardStars: 25,
      claimed: false,
      type: 'use_boosters'
    }
  ];
}

export const DEFAULT_QUESTS: QuestProgress[] = createDailyQuests();

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
  highSprintScore: 0,
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
  lastWheelSpinDate: null,
  dailyClaimedDays: [],
  lastQuestRefreshDate: null,
  winStreak: 0,
  bestWinStreak: 0,
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
  unlockedBlockThemes: ['classic', 'crystal'],
  claimedReferralCode: null,
  dailyChallengeDate: null,
  dailyChallengeBest: 0,
  dailyChallengeLines: 0,
  eventProgressDate: null,
  eventLinesProgress: 0,
  eventClaimedTiers: []
};

function makeFallbackPlayerIdentity(): { playerId: string; inviteCode: string } {
  const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
  const suffix = rand.slice(0, 4).padEnd(4, 'K');
  return {
    playerId: `kb_${Date.now().toString(36)}_${rand}`,
    inviteCode: `KB-${suffix}`
  };
}

export function ensurePlayerIdentity(progress: PlayerProgress): PlayerProgress {
  if (progress.playerId && progress.inviteCode) return progress;
  const fallback = makeFallbackPlayerIdentity();
  return {
    ...progress,
    playerId: progress.playerId || fallback.playerId,
    inviteCode: progress.inviteCode || fallback.inviteCode
  };
}

export function syncDailyQuests(progress: PlayerProgress, todayStr = new Date().toISOString().slice(0, 10)): PlayerProgress {
  const base = ensurePlayerIdentity(progress);
  const resetDailyChallenge =
    base.dailyChallengeDate !== todayStr
      ? { dailyChallengeDate: todayStr, dailyChallengeBest: 0, dailyChallengeLines: 0 }
      : {};
  const resetEvent =
    base.eventProgressDate !== todayStr
      ? { eventProgressDate: todayStr, eventLinesProgress: 0, eventClaimedTiers: [] }
      : {};

  const hasStreakQuest = base.quests.some((q) => q.type === 'win_streak');
  if (base.lastQuestRefreshDate === todayStr && hasStreakQuest) {
    return {
      ...base,
      ...resetDailyChallenge,
      ...resetEvent
    };
  }
  const fresh = createDailyQuests();
  // Preserve current active winStreak progress onto fresh streak quest if carrying streak into new day
  const synced = fresh.map((q) =>
    q.type === 'win_streak' ? { ...q, progress: Math.min(q.target, base.winStreak || 0) } : q
  );
  return {
    ...base,
    ...resetDailyChallenge,
    ...resetEvent,
    quests: synced,
    lastQuestRefreshDate: todayStr
  };
}

export function loadProgress(): PlayerProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const today = new Date().toISOString().slice(0, 10);
    if (!raw) return syncDailyQuests(INITIAL_PROGRESS, today);
    const parsed = JSON.parse(raw) as Partial<PlayerProgress>;
    const merged: PlayerProgress = {
      ...INITIAL_PROGRESS,
      ...parsed,
      boosters: { ...INITIAL_PROGRESS.boosters, ...(parsed.boosters || {}) },
      castleStages: { ...INITIAL_PROGRESS.castleStages, ...(parsed.castleStages || {}) },
      winStreak: Math.max(0, parsed.winStreak ?? 0),
      bestWinStreak: Math.max(0, parsed.bestWinStreak ?? 0),
      unlockedOutfits: parsed.unlockedOutfits?.length ? parsed.unlockedOutfits : INITIAL_PROGRESS.unlockedOutfits,
      unlockedAccessories: parsed.unlockedAccessories?.length ? parsed.unlockedAccessories : INITIAL_PROGRESS.unlockedAccessories,
      unlockedBlockThemes: parsed.unlockedBlockThemes?.length ? parsed.unlockedBlockThemes : INITIAL_PROGRESS.unlockedBlockThemes,
      quests: parsed.quests && parsed.quests.length ? parsed.quests : createDailyQuests(),
      badges: parsed.badges && parsed.badges.length ? parsed.badges : INITIAL_PROGRESS.badges
    };
    return applyHeartRegen(syncDailyQuests(merged, today));
  } catch {
    return syncDailyQuests(INITIAL_PROGRESS);
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
