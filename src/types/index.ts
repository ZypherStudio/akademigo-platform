export type CourseCategory =
  | 'yks'
  | 'lgs'
  | 'kpss'
  | 'kodlama'
  | 'dil'
  | 'dil_alm'
  | 'dil_fra'
  | 'dil_isp'
  | 'dil_bos';

// ─── Avatar Çerçeve/Dekorasyon Sistemi (Discord-style) ───────────────────────
export type AvatarFrameId =
  | 'none'
  | 'gold_flame'
  | 'cyber_neon'
  | 'cosmic_stars'
  | 'royal_crown'
  | 'dark_wings'
  | 'lightning_bolt'
  | 'cherry_blossom'
  | 'nature_leaf'
  | 'blood_web'
  | 'dragon_fire'
  | 'moon_reverie'
  | 'deadpool_hearts'
  | 'eous_astronaut';

export type FrameRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type FrameAnimationType = 'static' | 'pulse' | 'spin' | 'sparkle' | 'shake' | 'float';

export interface CustomBearConfig {
  furColor: 'bal_sarisi' | 'kar_beyazi' | 'cikolata' | 'gece_siyahi' | 'pembe_seker' | 'siber_neon' | 'kraliyet_altini';
  headwear: 'none' | 'graduate_cap' | 'royal_crown' | 'cyber_visor' | 'party_hat' | 'astronaut_helmet' | 'wizard_hat' | 'beanie';
  eyewear: 'none' | 'sunshades' | 'professor' | 'neon_visor' | 'star_glasses';
  outfit: 'hoodie' | 'royal_cape' | 'cyber_suit' | 'graduate_robe' | 'space_suit' | 'tuxedo';
  heldItem: 'book' | 'wand' | 'trophy' | 'diploma' | 'torch';
}

export interface AvatarFrameInfo {
  id: AvatarFrameId;
  name: string;
  description: string;
  rarity: FrameRarity;
  priceGems: number;        // 0 = ücretsiz
  realPriceTL?: number;     // Gerçek para ile satış (₺)
  isPremium: boolean;
  glowColor: string;        // CSS color (hex/rgba)
  glowColor2?: string;      // İkinci renk (gradient için)
  badge: string;            // Emoji rozet
  animationType: FrameAnimationType;
  rarityLabel: string;
  unlockCondition?: string; // Açıklama: nasıl kazanılır
}
// ─────────────────────────────────────────────────────────────────────────────

export type AppTheme = 'duo' | 'dark' | 'cyber' | 'gold' | 'ocean';

export type UserAvatar = 'haribo' | 'owl' | 'fox' | 'robot' | 'astronaut' | 'wizard' | 'coder_cat';

export type HariboCostume = 'classic' | 'king' | 'cyber' | 'party' | 'graduate' | 'astronaut';
export type KnowzaCostume = HariboCostume;

export interface HariboCostumeInfo {
  id: HariboCostume;
  name: string;
  title: string;
  description: string;
  priceGems: number;
  requiredXp: number;
  badge: string;
  icon: string;
  bgGradient: string;
}
export type KnowzaCostumeInfo = HariboCostumeInfo;

export type KahootCategory = 'matematik' | 'geometri' | 'kpss' | 'kodlama' | 'yds' | 'lgs' | 'karma';

export interface KahootOption {
  text: string;
  isCorrect: boolean;
  shape: 'triangle' | 'diamond' | 'circle' | 'square';
  color: string;
}

export interface KahootQuestion {
  id: string;
  prompt: string;
  category: string;
  options: string[]; // 4 options
  correctIndex: number;
  timeLimit: number; // in seconds, default 15
  explanation: string;
  funFact?: string;
}

export interface KahootPlayer {
  id: string;
  name: string;
  costume: HariboCostume;
  score: number;
  streak: number;
  lastAnswerTime?: number;
  lastAnswerCorrect?: boolean;
  isCurrentUser?: boolean;
  isHost?: boolean;
}

export interface Course {
  id: CourseCategory;
  name: string;
  subTitle: string;
  icon: string;
  badge: string;
  color: string;
  accentColor: string;
  units: Unit[];
}

export type QuestionType = 'multiple_choice' | 'matching' | 'code_fill' | 'true_false';

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  prompt: string;
  explanation: string;
  difficulty?: 'kolay' | 'orta' | 'zor' | 'sampiyon';
  hint?: string;
  tags?: string[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: { id: string; text: string; isCorrect: boolean }[];
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
}

export interface CodeFillQuestion extends BaseQuestion {
  type: 'code_fill';
  codeSnippet: string;
  blankId: string;
  options: string[];
  correctAnswer: string;
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  statement: string;
  correctAnswer: boolean;
}

export type Question = MultipleChoiceQuestion | MatchingQuestion | CodeFillQuestion | TrueFalseQuestion;

export interface Lesson {
  id: string;
  unitId: string;
  title: string;
  description: string;
  xpReward: number;
  gemReward: number;
  type: 'lesson' | 'practice' | 'boss' | 'chest';
  questions: Question[];
  summaryNotes?: string[];
}

export interface Unit {
  id: string;
  number: number;
  title: string;
  description: string;
  color: string;
  lessons: Lesson[];
  isPremiumOnly?: boolean;
}

export interface MistakeItem {
  id: string;
  prompt: string;
  correctAnswer: string;
  userAnswer?: string;
  explanation: string;
  subject: string;
  addedAt: string;
}

export type QuickToolId =
  | 'tests'
  | 'duel'
  | 'exams'
  | 'aicoach'
  | 'kahoot'
  | 'reels'
  | 'countdown'
  | 'errors'
  | 'codelab'
  | 'widgets';

export interface DuelMatchRecord {
  id: string;
  opponentName: string;
  opponentElo: number;
  userScore: number;
  opponentScore: number;
  eloDelta: number;
  won: boolean;
  mode: 'solo' | 'room';
  roomCode?: string;
  playedAt: string;
}

export interface UserStats {
  username: string;
  uniqueTag: string;
  email?: string;
  firebaseUid?: string;
  googleSub?: string;
  avatarUrl?: string;
  isLoggedIn: boolean;
  authProvider?: 'google' | 'email' | 'guest';
  isPro?: boolean;
  selectedCostume: HariboCostume;
  unlockedCostumes: HariboCostume[];
  xp: number;
  gems: number;
  hearts: number;
  maxHearts: number;
  streak: number;
  lastActiveDate: string;
  completedLessons: string[];
  openedChests: string[];
  selectedCourseId: CourseCategory;
  theme: AppTheme;
  avatar: UserAvatar;
  title: string;
  bannerColor: string;
  totalQuestionsAnswered: number;
  totalStudyMinutes: number;
  eloRating: number;
  duelWins: number;
  duelLosses: number;
  errorList: MistakeItem[];
  inventory: {
    streakFreeze: number;
    heartRefillCount: number;
    doubleXpMinutes: number;
  };
  dailyQuestProgress: {
    completedLessonsToday: number;
    xpGainedToday: number;
    perfectLessonsToday: number;
  };
  targetGoal?: CourseCategory;
  gradeOrTarget?: string;
  dailyGoalQuestions?: number;
  preferredQuickTools?: QuickToolId[];
  duelHistory?: DuelMatchRecord[];
  hasCompletedOnboarding?: boolean;
  lastSavedAt?: string;
  currentLevel: number;
  levelProgress: number;
  streakBonusMultiplier: number;
  achievementBadges: string[];
  equippedAvatarFrame: AvatarFrameId;
  unlockedAvatarFrames: AvatarFrameId[];
  isFounder?: boolean;
  founderBadge?: string;
  hasAdFree?: boolean;
  hasAiPackage?: boolean;
  customBear?: CustomBearConfig;
}

export interface AchievementToastData {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  icon: string;
  xpReward?: number;
  gemReward?: number;
}

export interface LeaderboardUser {
  id: string;
  name: string;
  avatar: string;
  xp: number;
  tier: 'diamond' | 'gold' | 'silver' | 'bronze';
  isCurrentUser?: boolean;
}

export interface EducationalVideo {
  id: string;
  title: string;
  channel: string;
  category: CourseCategory;
  duration: string;
  youtubeId: string;
  description: string;
  tags: string[];
}

export interface StudyNote {
  id: string;
  title: string;
  category: CourseCategory;
  content: string;
  createdAt: string;
}

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'knowza' | 'bibo';
  text: string;
  timestamp: string;
  cardTip?: string;
}
