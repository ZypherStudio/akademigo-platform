export interface StreakTier {
  id: string;
  minDays: number;
  nextMilestone: number | null;
  titleTr: string;
  titleEn: string;
  emoji: string;
  pillBg: string;
  pillBorder: string;
  pillText: string;
  flameFill: string;
  badgeGradient: string;
}

export const STREAK_TIERS: StreakTier[] = [
  {
    id: 'spark',
    minDays: 0,
    nextMilestone: 3,
    titleTr: 'Kıvılcım Alevi',
    titleEn: 'Spark Flame',
    emoji: '🔥',
    pillBg: 'bg-[#FFF2D6]',
    pillBorder: 'border-[#FFE2A3]',
    pillText: 'text-[#D96B00]',
    flameFill: 'fill-[#FF8A00] text-[#FF8A00]',
    badgeGradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'blaze',
    minDays: 3,
    nextMilestone: 10,
    titleTr: 'Ateş Savaşçısı',
    titleEn: 'Blaze Warrior',
    emoji: '🔥',
    pillBg: 'bg-orange-100',
    pillBorder: 'border-orange-300',
    pillText: 'text-orange-700',
    flameFill: 'fill-orange-500 text-orange-600',
    badgeGradient: 'from-orange-500 to-red-500',
  },
  {
    id: 'blue_plasma',
    minDays: 10,
    nextMilestone: 25,
    titleTr: 'Mavi Plazma Alevi (10+)',
    titleEn: 'Blue Plasma Flame (10+)',
    emoji: '💠',
    pillBg: 'bg-cyan-100',
    pillBorder: 'border-cyan-400',
    pillText: 'text-cyan-800',
    flameFill: 'fill-cyan-500 text-blue-600',
    badgeGradient: 'from-cyan-400 via-blue-500 to-indigo-600',
  },
  {
    id: 'violet_nova',
    minDays: 25,
    nextMilestone: 50,
    titleTr: 'Mor Süpernova Alevi (25+)',
    titleEn: 'Violet Supernova (25+)',
    emoji: '⚡',
    pillBg: 'bg-purple-100',
    pillBorder: 'border-purple-400',
    pillText: 'text-purple-800',
    flameFill: 'fill-purple-500 text-fuchsia-600',
    badgeGradient: 'from-purple-500 via-fuchsia-500 to-pink-500',
  },
  {
    id: 'emerald_dragon',
    minDays: 50,
    nextMilestone: 100,
    titleTr: 'Zümrüt Ejder Alevi (50+)',
    titleEn: 'Emerald Dragon Flame (50+)',
    emoji: '🐉',
    pillBg: 'bg-emerald-100',
    pillBorder: 'border-emerald-400',
    pillText: 'text-emerald-900',
    flameFill: 'fill-emerald-500 text-teal-600',
    badgeGradient: 'from-emerald-400 via-teal-500 to-green-600',
  },
  {
    id: 'golden_inferno',
    minDays: 100,
    nextMilestone: 365,
    titleTr: 'Altın Güneş Alevi (100+)',
    titleEn: 'Golden Inferno (100+)',
    emoji: '☀️',
    pillBg: 'bg-amber-100',
    pillBorder: 'border-yellow-500',
    pillText: 'text-amber-950',
    flameFill: 'fill-yellow-400 text-amber-600',
    badgeGradient: 'from-yellow-300 via-amber-400 to-orange-500',
  },
  {
    id: 'diamond_immortal',
    minDays: 365,
    nextMilestone: null,
    titleTr: 'Elmas Efsane Alevi (365+)',
    titleEn: 'Diamond Immortal (365+)',
    emoji: '💎',
    pillBg: 'bg-sky-100',
    pillBorder: 'border-sky-500',
    pillText: 'text-sky-950',
    flameFill: 'fill-sky-400 text-indigo-600',
    badgeGradient: 'from-sky-300 via-indigo-400 to-purple-500',
  },
];

export function getStreakTier(streak: number): StreakTier {
  let matched = STREAK_TIERS[0];
  for (const tier of STREAK_TIERS) {
    if (streak >= tier.minDays) matched = tier;
  }
  return matched;
}

export interface EloLeagueTier {
  id: string;
  minElo: number;
  nextElo: number | null;
  titleTr: string;
  titleEn: string;
  emoji: string;
  badgeClass: string;
}

export const ELO_LEAGUES: EloLeagueTier[] = [
  {
    id: 'bronze',
    minElo: 0,
    nextElo: 1000,
    titleTr: 'Bronz Arena',
    titleEn: 'Bronze Arena',
    emoji: '🥉',
    badgeClass: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    id: 'silver',
    minElo: 1000,
    nextElo: 1200,
    titleTr: 'Gümüş Arena',
    titleEn: 'Silver Arena',
    emoji: '🥈',
    badgeClass: 'bg-slate-200 text-slate-900 border-slate-400',
  },
  {
    id: 'gold',
    minElo: 1200,
    nextElo: 1400,
    titleTr: 'Altın Arena',
    titleEn: 'Gold Arena',
    emoji: '🥇',
    badgeClass: 'bg-amber-100 text-amber-900 border-amber-400',
  },
  {
    id: 'platinum',
    minElo: 1400,
    nextElo: 1600,
    titleTr: 'Platin Arena',
    titleEn: 'Platinum Arena',
    emoji: '💠',
    badgeClass: 'bg-cyan-100 text-cyan-900 border-cyan-400',
  },
  {
    id: 'diamond',
    minElo: 1600,
    nextElo: null,
    titleTr: 'Elmas Şampiyon Ligi',
    titleEn: 'Diamond Champion League',
    emoji: '👑',
    badgeClass: 'bg-purple-100 text-purple-900 border-purple-400',
  },
];

export function getEloLeague(elo: number): EloLeagueTier {
  let matched = ELO_LEAGUES[0];
  for (const tier of ELO_LEAGUES) {
    if (elo >= tier.minElo) matched = tier;
  }
  return matched;
}
