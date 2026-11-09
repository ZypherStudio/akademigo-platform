export type CourseCategory = 'yks' | 'lgs' | 'kpss' | 'kodlama' | 'dil';

export type AppTheme = 'duo' | 'dark' | 'cyber' | 'gold' | 'ocean';

export type UserAvatar = 'owl' | 'fox' | 'robot' | 'astronaut' | 'wizard' | 'coder_cat';

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
  difficulty?: 'kolay' | 'orta' | 'zor';
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

export interface UserStats {
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
  sender: 'user' | 'bibo';
  text: string;
  timestamp: string;
  cardTip?: string;
}
