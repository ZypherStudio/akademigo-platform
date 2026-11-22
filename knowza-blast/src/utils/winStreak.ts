export const WIN_STREAK_MAX_TIER = 3;

export interface WinStreakTierInfo {
  tier: 0 | 1 | 2 | 3;
  streak: number;
  title: string;
  perkDesc: string;
  startBoosters: ('rocket' | 'bomb')[];
  coinMultiplier: number;
}

/** Clamps raw consecutive win count into reward tiers 0..3. */
export function getWinStreakTier(streak: number): 0 | 1 | 2 | 3 {
  if (!Number.isFinite(streak) || streak <= 0) return 0;
  if (streak >= WIN_STREAK_MAX_TIER) return 3;
  return Math.floor(streak) as 1 | 2;
}

/** Computes free automatic board-start boosters granted by the player's active win streak. */
export function getWinStreakStartBoosters(streak: number): ('rocket' | 'bomb')[] {
  const tier = getWinStreakTier(streak);
  if (tier === 0) return [];
  if (tier === 1) return ['rocket'];
  return ['rocket', 'bomb'];
}

/** Returns gold reward multiplier unlocked by consecutive wins (Seri 2: +10%, Seri 3+: +25%). */
export function getWinStreakCoinMultiplier(streak: number): number {
  const tier = getWinStreakTier(streak);
  if (tier >= 3) return 1.25;
  if (tier === 2) return 1.1;
  return 1;
}

/** Returns human-readable Turkish metadata describing the current Win Streak perk tier. */
export function getWinStreakInfo(streak: number): WinStreakTierInfo {
  const safeStreak = Math.max(0, Math.floor(streak || 0));
  const tier = getWinStreakTier(safeStreak);
  const startBoosters = getWinStreakStartBoosters(safeStreak);
  const coinMultiplier = getWinStreakCoinMultiplier(safeStreak);

  if (tier === 0) {
    return {
      tier,
      streak: safeStreak,
      title: 'Seri Başlat',
      perkDesc: 'Üst üste seviye kazan, ücretsiz Roket & Bomba ve %25 Altın bonusu kap!',
      startBoosters,
      coinMultiplier
    };
  }
  if (tier === 1) {
    return {
      tier,
      streak: safeStreak,
      title: 'Kıvılcım Serisi',
      perkDesc: 'Her seviyeye ücretsiz +1 Roket ile başlarsın. Kaybedince sıfırlanır!',
      startBoosters,
      coinMultiplier
    };
  }
  if (tier === 2) {
    return {
      tier,
      streak: safeStreak,
      title: 'Ateş Serisi',
      perkDesc: 'Ücretsiz +1 Roket & +1 Bomba ve +%10 Altın! Kaybedince sıfırlanır!',
      startBoosters,
      coinMultiplier
    };
  }
  return {
    tier,
    streak: safeStreak,
    title: 'Efsanevi Seri',
    perkDesc: 'Maksimum Güç! +1 Roket, +1 Bomba ve +%25 Altın! Kaybedince sıfırlanır!',
    startBoosters,
    coinMultiplier
  };
}
