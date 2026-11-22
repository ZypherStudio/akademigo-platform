export type CubeColor = 'blue' | 'yellow' | 'red' | 'green' | 'purple';

export type SpecialType = 'rocket_h' | 'rocket_v' | 'bomb' | 'disco';

export type ObstacleType = 'crate' | 'ice' | 'stone' | 'spark' | 'ember' | 'prism' | 'boss';

export type InventoryBooster = 'hammer' | 'rocket' | 'bomb' | 'disco';

export type BiomeId =
  | 'forest'
  | 'glacier'
  | 'volcano'
  | 'crystal_cave'
  | 'dojo_peak'
  | 'desert'
  | 'cyber_city'
  | 'cosmos';

export type OutfitId = 'classic' | 'crimson' | 'royal' | 'emerald' | 'cyber' | 'karate';

export type AccessoryId = 'none' | 'bandana' | 'crown' | 'visor';

export type BlockThemeId = 'classic' | 'crystal' | 'candy' | 'dojo';

export type KnowzaMood =
  | 'idle'
  | 'drag'
  | 'happy'
  | 'combo'
  | 'fever'
  | 'worried'
  | 'sad'
  | 'celebrate';

export interface CellData {
  uid: string;
  color: CubeColor | null;
  special?: SpecialType | null;
  obstacle?: ObstacleType | null;
  obstacleHp?: number;
  emberMovesLeft?: number;
  bossId?: string;
  bossCorner?: 'tl' | 'tr' | 'bl' | 'br';
  bossMaxHp?: number;
  isNew?: boolean;
  dropFrom?: number;
  isBlasting?: boolean;
}

export type Grid = (CellData | null)[][];

export interface PolyominoShape {
  id: string;
  name: string;
  cells: [number, number][]; // [rowOffset, colOffset]
  color: CubeColor;
  specialCell?: { index: number; special: SpecialType };
  isGoldBonus?: boolean;
}

export type TargetKey =
  | CubeColor
  | 'crate'
  | 'ice'
  | 'stone'
  | 'spark'
  | 'ember'
  | 'prism'
  | 'boss';

export interface LevelConfig {
  id: number;
  name: string;
  subtitle: string;
  biomeId: BiomeId;
  moves: number;
  colors: CubeColor[];
  targets: Partial<Record<TargetKey, number>>;
  obstaclePreset?:
    | 'none'
    | 'crates_side'
    | 'crates_mid'
    | 'ice_center'
    | 'ice_checker'
    | 'castle_fort'
    | 'stone_guard'
    | 'spark_grid'
    | 'ember_forge'
    | 'prism_vault'
    | 'boss_arena'
    | 'cosmos_mix';
  rewards: {
    stars: number;
    coins: number;
    xp: number;
  };
}

export interface QuestProgress {
  id: string;
  title: string;
  target: number;
  progress: number;
  rewardCoins: number;
  rewardStars: number;
  claimed: boolean;
  type: 'blast_cubes' | 'clear_lines' | 'win_levels' | 'use_boosters' | 'win_streak';
}

export interface PlayerProgress {
  name: string;
  level: number;
  xp: number;
  coins: number;
  stars: number;
  hearts: number;
  maxHearts: number;
  lastHeartUpdate: number;
  unlockedLevel: number;
  levelStars: Record<number, number>;
  highBlockScore: number;
  highSprintScore?: number;
  totalCubesBlasted: number;
  totalLinesCleared: number;
  boosters: Record<InventoryBooster, number>;
  dailyStreak: number;
  lastDailyClaimDate: string | null;
  lastWheelSpinDate?: string | null;
  dailyClaimedDays: number[];
  lastQuestRefreshDate?: string | null;
  winStreak: number;
  bestWinStreak: number;
  quests: QuestProgress[];
  badges: string[];
  soundEnabled: boolean;
  hapticsEnabled: boolean;
  castleStages: Record<string, number>; // Royal Match style meta renovation progress
  equippedOutfit: OutfitId;
  unlockedOutfits: OutfitId[];
  equippedAccessory: AccessoryId;
  unlockedAccessories: AccessoryId[];
  equippedBlockTheme: BlockThemeId;
  unlockedBlockThemes: BlockThemeId[];
  playerId?: string;
  inviteCode?: string;
  claimedReferralCode?: string | null;
  dailyChallengeDate?: string | null;
  dailyChallengeBest?: number;
  dailyChallengeLines?: number;
  eventProgressDate?: string | null;
  eventLinesProgress?: number;
  eventClaimedTiers?: number[];
}

export interface FloatingCallout {
  id: string;
  text: string;
  subtext?: string;
  colorClass: string;
  variant?: 'clear' | 'combo' | 'cross' | 'chain' | 'fever';
}

export interface BlastParticle {
  id: string;
  r: number;
  c: number;
  color: string;
}
