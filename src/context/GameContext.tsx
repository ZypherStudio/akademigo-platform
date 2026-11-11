import React, { createContext, useContext, useState, useEffect } from 'react';
import { CourseCategory, Lesson, UserStats, LeaderboardUser, StudyNote, AppTheme, UserAvatar, MistakeItem, KnowzaCostume, AchievementToastData, AvatarFrameId } from '../types';
import { KNOWZA_COSTUMES } from '../data/costumesData';
import { AVATAR_FRAMES, getFrame } from '../data/framesData';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

interface GameContextType {
  stats: UserStats;
  selectedCourseId: CourseCategory;
  setSelectedCourseId: (id: CourseCategory) => void;
  activeLesson: Lesson | null;
  startLesson: (lesson: Lesson) => void;
  closeLesson: () => void;
  completeLesson: (lessonId: string, earnedXp: number, earnedGems: number, accuracy: number) => void;
  openChest: (chestId: string, earnedXp: number, earnedGems: number) => void;
  loseHeart: (mistake?: Partial<MistakeItem>) => void;
  refillHearts: () => boolean;
  buyShopItem: (item: 'freeze' | 'refill' | 'double') => boolean;
  notes: StudyNote[];
  addNote: (title: string, content: string, category: CourseCategory) => void;
  deleteNote: (id: string) => void;
  soundMuted: boolean;
  toggleSound: () => void;
  leaderboard: LeaderboardUser[];
  setTheme: (theme: AppTheme) => void;
  setAvatar: (avatar: UserAvatar) => void;
  setTitle: (title: string) => void;
  setBannerColor: (color: string) => void;
  userLevel: number;
  levelProgress: number;
  updateElo: (delta: number, won: boolean) => void;
  addMistake: (mistake: MistakeItem) => void;
  removeMistake: (id: string) => void;
  clearAllMistakes: () => void;
  updateUsername: (newUsername: string) => { success: boolean; finalUsername: string; error?: string };
  loginUser: (provider: 'google' | 'email', email?: string, username?: string) => void;
  logoutUser: () => void;
  buyCostume: (costumeId: KnowzaCostume) => boolean;
  selectCostume: (costumeId: KnowzaCostume) => void;
  equipFrame: (frameId: AvatarFrameId) => void;
  buyFrameWithGems: (frameId: AvatarFrameId) => boolean;
  addXpAndGems: (xp: number, gems: number) => void;
  upgradeToPro: () => void;
  completeOnboarding: (data: {
    username: string;
    targetGoal: CourseCategory;
    dailyGoalQuestions?: number;
    email?: string;
  }) => void;
  updateUserPreferences: (data: {
    username?: string;
    targetGoal?: CourseCategory;
    dailyGoalQuestions?: number;
  }) => void;
  activeAchievement: AchievementToastData | null;
  dismissAchievement: () => void;
  triggerAchievement: (achievement: AchievementToastData) => void;
}

const DEFAULT_MISTAKES: MistakeItem[] = [
  {
    id: 'mis-1',
    subject: 'TYT Matematik',
    prompt: 'a ve b pozitif tam sayılardır. (3a + 5b) tek sayı ise a × b nedir?',
    correctAnswer: 'a × b çarpımı daima çifttir',
    userAnswer: 'a daima tektir',
    explanation: '3a ve 5b sayılarından biri tek, biri çifttir. Dolayısıyla en az biri çift olduğundan çarpımları kesinlikle çifttir.',
    addedAt: 'Bugün'
  },
  {
    id: 'mis-2',
    subject: 'KPSS Genel Kültür',
    prompt: 'Uluslararası Uzay İstasyonu\'na giden ilk Türk astronot kimdir?',
    correctAnswer: 'Alper Gezeravcı',
    userAnswer: 'Tuva Cihangir Atasever',
    explanation: 'Ocak 2024 Ax-3 misyonu ile ilk Türk astronot Alper Gezeravcı olmuştur.',
    addedAt: 'Dün'
  }
];

const DEFAULT_STATS: UserStats = {
  username: 'Öğrenci',
  uniqueTag: '#2026',
  email: undefined,
  isLoggedIn: false,
  authProvider: 'guest',
  selectedCostume: 'classic',
  unlockedCostumes: ['classic'],
  xp: 0,
  gems: 0,
  hearts: 5,
  maxHearts: 5,
  streak: 0,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: [],
  openedChests: [],
  selectedCourseId: 'yks',
  theme: 'gold',
  avatar: 'haribo',
  title: '2026 Sınav Adayı 🎓',
  bannerColor: 'from-amber-500 to-yellow-600',
  totalQuestionsAnswered: 0,
  totalStudyMinutes: 0,
  eloRating: 1000,
  duelWins: 0,
  duelLosses: 0,
  errorList: [],
  inventory: {
    streakFreeze: 0,
    heartRefillCount: 0,
    doubleXpMinutes: 0
  },
  dailyQuestProgress: {
    completedLessonsToday: 0,
    xpGainedToday: 0,
    perfectLessonsToday: 0
  },
  targetGoal: 'yks',
  dailyGoalQuestions: 20,
  hasCompletedOnboarding: false,
  currentLevel: 1,
  levelProgress: 0,
  streakBonusMultiplier: 1,
  achievementBadges: [],
  equippedAvatarFrame: 'none' as AvatarFrameId,
  unlockedAvatarFrames: ['none', 'gold_flame'] as AvatarFrameId[],
};

const DEFAULT_NOTES: StudyNote[] = [];

export const AVATAR_MAP: Record<UserAvatar, { emoji: string; name: string }> = {
  haribo: { emoji: '🍯', name: 'Knowza 3D Maskot (Özel Maskot)' },
  owl: { emoji: '🦉', name: 'Bilge Baykuş' },
  fox: { emoji: '🦊', name: 'Zeki Tilki' },
  robot: { emoji: '🤖', name: 'AI Robot' },
  astronaut: { emoji: '🚀', name: 'Kozmik Kaşif' },
  wizard: { emoji: '🧙‍♂️', name: 'Bilgi Büyücüsü' },
  coder_cat: { emoji: '🐱', name: 'Kodcu Kedi' }
};

const KNOWZA_STORAGE_VERSION = 'knowza_v2026_real_v3';

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeAchievement, setActiveAchievement] = useState<AchievementToastData | null>(null);

  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const version = localStorage.getItem('knowza_storage_version');
      if (version !== KNOWZA_STORAGE_VERSION) {
        localStorage.removeItem('akademi_user_stats');
        localStorage.removeItem('knowza_has_started');
        localStorage.setItem('knowza_storage_version', KNOWZA_STORAGE_VERSION);
        return DEFAULT_STATS;
      }

      const saved = localStorage.getItem('akademi_user_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Wipe out any stale 'Ali' or demo streak/gems values
        if (
          parsed.username === 'Ali' ||
          parsed.email === 'ali@gmail.com' ||
          parsed.email === 'demo@knowza.app' ||
          !parsed.email ||
          parsed.streak === 6 ||
          parsed.gems === 280
        ) {
          localStorage.removeItem('akademi_user_stats');
          return DEFAULT_STATS;
        }

        const avatar = (parsed.avatar === 'owl' || !parsed.avatar) ? 'haribo' : parsed.avatar;
        return {
          ...DEFAULT_STATS,
          ...parsed,
          avatar,
          equippedAvatarFrame: parsed.equippedAvatarFrame ?? 'none',
          unlockedAvatarFrames: parsed.unlockedAvatarFrames ?? ['none', 'gold_flame'],
        };
      }
      return DEFAULT_STATS;
    } catch {
      return DEFAULT_STATS;
    }
  });

  const [notes, setNotes] = useState<StudyNote[]>(() => {
    try {
      const saved = localStorage.getItem('akademi_notes');
      return saved ? JSON.parse(saved) : DEFAULT_NOTES;
    } catch {
      return DEFAULT_NOTES;
    }
  });

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [soundMuted, setSoundMuted] = useState<boolean>(() => sound.getMuted());

  useEffect(() => {
    localStorage.setItem('akademi_user_stats', JSON.stringify(stats));
    if (stats.theme === 'dark' || stats.theme === 'cyber') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    document.documentElement.setAttribute('data-theme', stats.theme);
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('akademi_notes', JSON.stringify(notes));
  }, [notes]);

  const toggleSound = () => {
    const isMuted = sound.toggleMute();
    setSoundMuted(isMuted);
  };

  const setSelectedCourseId = (id: CourseCategory) => {
    sound.playClick();
    setStats(prev => ({ ...prev, selectedCourseId: id }));
  };

  const setTheme = (theme: AppTheme) => {
    sound.playClick();
    setStats(prev => ({ ...prev, theme }));
  };

  const setAvatar = (avatar: UserAvatar) => {
    sound.playClick();
    setStats(prev => ({ ...prev, avatar }));
  };

  const setTitle = (title: string) => {
    sound.playClick();
    setStats(prev => ({ ...prev, title }));
  };

  const setBannerColor = (bannerColor: string) => {
    sound.playClick();
    setStats(prev => ({ ...prev, bannerColor }));
  };

  const startLesson = (lesson: Lesson) => {
    sound.playClick();
    setActiveLesson(lesson);
  };

  const closeLesson = () => {
    sound.playClick();
    setActiveLesson(null);
  };

  const loseHeart = (mistake?: Partial<MistakeItem>) => {
    sound.playWrong();
    setStats(prev => {
      let updatedErrors = prev.errorList;
      if (mistake && mistake.prompt) {
        const newError: MistakeItem = {
          id: 'err-' + Date.now(),
          prompt: mistake.prompt,
          correctAnswer: mistake.correctAnswer || 'Doğru Seçenek',
          userAnswer: mistake.userAnswer || 'Hatalı Seçim',
          explanation: mistake.explanation || 'Konu tekrarı yapmalısın.',
          subject: mistake.subject || 'Genel',
          addedAt: 'Az önce'
        };
        // Avoid duplicate
        if (!updatedErrors.some(e => e.prompt === mistake.prompt)) {
          updatedErrors = [newError, ...updatedErrors];
        }
      }

      return {
        ...prev,
        hearts: Math.max(0, prev.hearts - 1),
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 1,
        errorList: updatedErrors
      };
    });
  };

  const refillHearts = (): boolean => {
    if (stats.gems < 50 && stats.hearts === stats.maxHearts) return false;
    if (stats.gems >= 50) {
      sound.playVictory();
      setStats(prev => ({
        ...prev,
        gems: prev.gems - 50,
        hearts: prev.maxHearts
      }));
      return true;
    }
    return false;
  };

  const dismissAchievement = () => {
    setActiveAchievement(null);
  };

  const triggerAchievement = (achievement: AchievementToastData) => {
    setStats(prev => {
      const alreadyEarned = (prev.achievementBadges || []).includes(achievement.id);
      if (alreadyEarned) return prev;

      const updatedBadges = [...(prev.achievementBadges || []), achievement.id];
      setActiveAchievement(achievement);

      return {
        ...prev,
        achievementBadges: updatedBadges,
        xp: prev.xp + (achievement.xpReward || 0),
        gems: prev.gems + (achievement.gemReward || 0)
      };
    });
  };

  const completeLesson = (lessonId: string, earnedXp: number, earnedGems: number, accuracy: number) => {
    sound.playVictory();

    confetti({
      particleCount: 95,
      spread: 75,
      origin: { y: 0.6 }
    });

    setStats(prev => {
      const isAlreadyCompleted = prev.completedLessons.includes(lessonId);
      const newCompleted = isAlreadyCompleted ? prev.completedLessons : [...prev.completedLessons, lessonId];
      const newXp = prev.xp + earnedXp;
      const newGems = prev.gems + earnedGems;
      const newStreak = prev.streak + (isAlreadyCompleted ? 0 : 1);
      const newTotalQuestions = prev.totalQuestionsAnswered + 4;
      const prevLevel = Math.max(1, Math.floor((prev.xp || 0) / 100) + 1);
      const newLevel = Math.max(1, Math.floor(newXp / 100) + 1);

      const badges = [...(prev.achievementBadges || [])];
      let pendingAchievement: AchievementToastData | null = null;

      // 1. First Lesson Badge
      if (newCompleted.length === 1 && !badges.includes('first_lesson')) {
        badges.push('first_lesson');
        pendingAchievement = {
          id: 'first_lesson',
          title: 'İlk Ders Tamamlandı! 🎓',
          description: 'Knowza ile ilk dersini başarıyla bitirdin ve eğitime başladın!',
          icon: '🎓',
          xpReward: 25,
          gemReward: 10
        };
      }
      // 2. Perfect Lesson Badge (%100 Accuracy)
      else if (accuracy === 100 && !badges.includes('perfect_lesson')) {
        badges.push('perfect_lesson');
        pendingAchievement = {
          id: 'perfect_lesson',
          title: 'Kusursuz Çözüm! 🎯',
          description: 'Tüm soruları tek bir hata bile yapmadan %100 doğrulukla çözdün!',
          icon: '🎯',
          xpReward: 30,
          gemReward: 15
        };
      }
      // 3. Level Up Badge
      else if (newLevel > prevLevel && !badges.includes(`level_${newLevel}`)) {
        badges.push(`level_${newLevel}`);
        pendingAchievement = {
          id: `level_${newLevel}`,
          title: `${newLevel}. Seviyeye Ulaştın! 🌟`,
          description: `Tebrikler! ${newLevel}. seviye rütbesine yükseldin!`,
          icon: '🌟',
          xpReward: 50,
          gemReward: 20
        };
      }
      // 4. Streak Badges
      else if (newStreak >= 7 && !badges.includes('streak_7')) {
        badges.push('streak_7');
        pendingAchievement = {
          id: 'streak_7',
          title: '7 Günlük Seri Efsanesi! 🔥',
          description: 'Üst üste 7 gün boyunca her gün en az 1 ders çözerek serini korudun!',
          icon: '🔥',
          xpReward: 40,
          gemReward: 20
        };
      } else if (newStreak >= 3 && !badges.includes('streak_3')) {
        badges.push('streak_3');
        pendingAchievement = {
          id: 'streak_3',
          title: '3 Günlük Seri Ustası! 🔥',
          description: '3 gün boyunca aralıksız soru çözerek disiplinini kanıtladın!',
          icon: '🔥',
          xpReward: 25,
          gemReward: 10
        };
      } else if (newStreak === 1 && !badges.includes('streak_1')) {
        badges.push('streak_1');
        pendingAchievement = {
          id: 'streak_1',
          title: 'Seri Ateşi Yandı! 🔥',
          description: 'İlk gün serin başladı! Yarın tekrar gelip serini koru!',
          icon: '🔥',
          xpReward: 20,
          gemReward: 5
        };
      }
      // 5. Questions Count Milestone
      else if (newTotalQuestions >= 10 && !badges.includes('questions_10')) {
        badges.push('questions_10');
        pendingAchievement = {
          id: 'questions_10',
          title: '10 Soru Avcısı! 📚',
          description: '10 soruyu başarıyla geride bıraktın, hızını koru!',
          icon: '📚',
          xpReward: 20,
          gemReward: 5
        };
      }

      if (pendingAchievement) {
        setTimeout(() => {
          setActiveAchievement(pendingAchievement);
        }, 300);
      }

      return {
        ...prev,
        xp: newXp + (pendingAchievement?.xpReward || 0),
        gems: newGems + (pendingAchievement?.gemReward || 0),
        streak: newStreak,
        completedLessons: newCompleted,
        achievementBadges: badges,
        totalQuestionsAnswered: newTotalQuestions,
        totalStudyMinutes: prev.totalStudyMinutes + 10,
        dailyQuestProgress: {
          completedLessonsToday: prev.dailyQuestProgress.completedLessonsToday + 1,
          xpGainedToday: prev.dailyQuestProgress.xpGainedToday + earnedXp,
          perfectLessonsToday: prev.dailyQuestProgress.perfectLessonsToday + (accuracy === 100 ? 1 : 0)
        }
      };
    });
  };

  const openChest = (chestId: string, earnedXp: number, earnedGems: number) => {
    if (stats.openedChests.includes(chestId)) return;
    sound.playChest();
    confetti({
      particleCount: 65,
      spread: 60,
      origin: { y: 0.7 }
    });

    setStats(prev => {
      const badges = [...(prev.achievementBadges || [])];
      let pendingAchievement: AchievementToastData | null = null;
      if (prev.openedChests.length === 0 && !badges.includes('first_chest')) {
        badges.push('first_chest');
        pendingAchievement = {
          id: 'first_chest',
          title: 'Hazine Avcısı! 🎁',
          description: 'İlk ödül sandığını açarak gizemli hazineyi topladın!',
          icon: '🎁',
          xpReward: 30,
          gemReward: 15
        };
        setTimeout(() => {
          setActiveAchievement(pendingAchievement);
        }, 300);
      }

      return {
        ...prev,
        xp: prev.xp + earnedXp + (pendingAchievement?.xpReward || 0),
        gems: prev.gems + earnedGems + (pendingAchievement?.gemReward || 0),
        openedChests: [...prev.openedChests, chestId],
        achievementBadges: badges
      };
    });
  };

  const buyShopItem = (item: 'freeze' | 'refill' | 'double'): boolean => {
    sound.playClick();
    if (item === 'refill') {
      if (stats.gems >= 50 && stats.hearts < stats.maxHearts) {
        setStats(prev => ({
          ...prev,
          gems: prev.gems - 50,
          hearts: prev.maxHearts
        }));
        sound.playVictory();
        return true;
      }
    } else if (item === 'freeze') {
      if (stats.gems >= 100) {
        setStats(prev => ({
          ...prev,
          gems: prev.gems - 100,
          inventory: {
            ...prev.inventory,
            streakFreeze: prev.inventory.streakFreeze + 1
          }
        }));
        sound.playVictory();
        return true;
      }
    } else if (item === 'double') {
      if (stats.gems >= 75) {
        setStats(prev => ({
          ...prev,
          gems: prev.gems - 75,
          inventory: {
            ...prev.inventory,
            doubleXpMinutes: prev.inventory.doubleXpMinutes + 30
          }
        }));
        sound.playVictory();
        return true;
      }
    }
    return false;
  };

  const addNote = (title: string, content: string, category: CourseCategory) => {
    sound.playClick();
    const newNote: StudyNote = {
      id: 'note-' + Date.now(),
      title,
      content,
      category,
      createdAt: 'Az önce'
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const deleteNote = (id: string) => {
    sound.playClick();
    setNotes(prev => prev.filter(n => n.id !== id));
  };

  // ELO updates for Chess.com-style Quiz Duel
  const updateElo = (delta: number, won: boolean) => {
    setStats(prev => ({
      ...prev,
      eloRating: Math.max(800, prev.eloRating + delta),
      duelWins: prev.duelWins + (won ? 1 : 0),
      duelLosses: prev.duelLosses + (won ? 0 : 1),
      xp: prev.xp + (won ? 25 : 10)
    }));
  };

  // Error Notebook actions
  const addMistake = (mistake: MistakeItem) => {
    setStats(prev => ({
      ...prev,
      errorList: [mistake, ...prev.errorList]
    }));
  };

  const removeMistake = (id: string) => {
    sound.playCorrect();
    setStats(prev => ({
      ...prev,
      errorList: prev.errorList.filter(e => e.id !== id),
      gems: prev.gems + 2, // reward for clearing an error!
      xp: prev.xp + 5
    }));
  };

  const clearAllMistakes = () => {
    sound.playVictory();
    setStats(prev => ({
      ...prev,
      errorList: []
    }));
  };

  // Unique Username & Profile Nickname Management
  const updateUsername = (rawName: string) => {
    const trimmed = rawName.trim();
    if (!trimmed || trimmed.length < 2) {
      return { success: false, finalUsername: stats.username, error: 'Kullanıcı adı en az 2 karakter olmalıdır.' };
    }
    
    // Check if name is taken in mock database / leaderboard
    const takenNames = ['admin', 'zeynep', 'barış', 'mert', 'selin', 'kaan', 'elif', 'öğretmen', 'kurucu'];
    const lower = trimmed.toLowerCase();
    let finalName = trimmed;
    let tag = stats.uniqueTag;

    if (takenNames.includes(lower)) {
      // Generate a unique derivative as requested by the user
      const suffixes = ['_34', '_Knowza', '_Altın', '_Pro', '_Derece', '_2026'];
      const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
      finalName = `${trimmed}${randomSuffix}`;
      tag = '#' + Math.floor(1000 + Math.random() * 9000);
    } else {
      tag = '#' + Math.floor(1000 + Math.random() * 9000);
    }

    sound.playClick();
    setStats(prev => ({
      ...prev,
      username: finalName,
      uniqueTag: tag
    }));

    return { success: true, finalUsername: finalName };
  };

  // Google / Email Authentication
  const loginUser = (provider: 'google' | 'email', email?: string, username?: string) => {
    sound.playVictory();
    confetti({ particleCount: 50, spread: 70 });
    const userEmail = email?.trim() || '';
    const name = username?.trim() || (userEmail ? userEmail.split('@')[0] : 'Öğrenci');

    setStats(prev => ({
      ...prev,
      isLoggedIn: true,
      authProvider: provider,
      username: name,
      email: userEmail || undefined,
      uniqueTag: '#DOĞRULANDI',
      hasCompletedOnboarding: true
    }));
    localStorage.setItem('knowza_has_started', 'true');
  };

  const logoutUser = () => {
    sound.playClick();
    setStats(prev => ({
      ...prev,
      isLoggedIn: false,
      authProvider: 'guest',
      email: undefined,
      username: 'Öğrenci',
      hasCompletedOnboarding: false
    }));
    localStorage.removeItem('knowza_has_started');
  };

  // Knowza Costume Purchase & Equip
  const buyCostume = (costumeId: KnowzaCostume) => {
    const costume = KNOWZA_COSTUMES.find(c => c.id === costumeId);
    if (!costume) return false;

    if (stats.unlockedCostumes.includes(costumeId)) {
      selectCostume(costumeId);
      return true;
    }

    if (stats.gems < costume.priceGems || stats.xp < costume.requiredXp) {
      sound.playWrong();
      return false;
    }

    sound.playVictory();
    confetti({ particleCount: 70, spread: 80 });
    setStats(prev => ({
      ...prev,
      gems: prev.gems - costume.priceGems,
      unlockedCostumes: [...prev.unlockedCostumes, costumeId],
      selectedCostume: costumeId
    }));
    return true;
  };

  const selectCostume = (costumeId: KnowzaCostume) => {
    if (!stats.unlockedCostumes.includes(costumeId)) return;
    sound.playClick();
    setStats(prev => ({
      ...prev,
      selectedCostume: costumeId
    }));
  };

  /** Equip an already-unlocked avatar frame */
  const equipFrame = (frameId: AvatarFrameId) => {
    const unlocked = (stats.unlockedAvatarFrames ?? ['none', 'gold_flame']);
    if (!unlocked.includes(frameId)) return;
    sound.playClick();
    setStats(prev => ({ ...prev, equippedAvatarFrame: frameId }));
  };

  /** Buy a frame with gems and immediately equip it */
  const buyFrameWithGems = (frameId: AvatarFrameId): boolean => {
    const frame = getFrame(frameId);
    if (!frame || frame.isPremium) return false;
    const unlocked = (stats.unlockedAvatarFrames ?? ['none', 'gold_flame']);
    if (unlocked.includes(frameId)) {
      equipFrame(frameId);
      return true;
    }
    if (stats.gems < frame.priceGems) {
      sound.playWrong();
      return false;
    }
    sound.playVictory();
    confetti({ particleCount: 60, spread: 70, colors: [frame.glowColor, '#fbbf24'] });
    setStats(prev => ({
      ...prev,
      gems: prev.gems - frame.priceGems,
      unlockedAvatarFrames: [...(prev.unlockedAvatarFrames ?? ['none', 'gold_flame']), frameId],
      equippedAvatarFrame: frameId,
    }));
    return true;
  };

  const addXpAndGems = (xp: number, gems: number) => {
    setStats(prev => ({
      ...prev,
      xp: prev.xp + xp,
      gems: prev.gems + gems
    }));
  };

  const upgradeToPro = () => {
    sound.playVictory();
    confetti({ particleCount: 120, spread: 80 });
    setStats(prev => ({
      ...prev,
      isPro: true,
      hearts: 5,
      maxHearts: 5,
      gems: prev.gems + 500
    }));
  };

  const completeOnboarding = (data: {
    username: string;
    targetGoal: CourseCategory;
    dailyGoalQuestions?: number;
    email?: string;
  }) => {
    sound.playVictory();
    confetti({ particleCount: 90, spread: 80 });

    const goalTitles: Record<CourseCategory, string> = {
      yks: 'YKS Derece Adayı 🎓',
      lgs: 'LGS Şampiyonu 📚',
      kpss: 'KPSS Memur Adayı 🏛️',
      kodlama: 'Geleceğin Yazılımcısı 💻',
      dil: 'Global Dil Kaşifi 🌐'
    };

    setStats(prev => ({
      ...prev,
      username: data.username.trim() || 'Öğrenci',
      email: data.email || prev.email,
      isLoggedIn: true,
      targetGoal: data.targetGoal,
      selectedCourseId: data.targetGoal,
      dailyGoalQuestions: data.dailyGoalQuestions || 25,
      title: goalTitles[data.targetGoal] || prev.title,
      hasCompletedOnboarding: true
    }));
    localStorage.setItem('knowza_has_started', 'true');
  };

  const updateUserPreferences = (data: {
    username?: string;
    targetGoal?: CourseCategory;
    dailyGoalQuestions?: number;
  }) => {
    setStats(prev => {
      const updated = { ...prev };
      if (data.username) updated.username = data.username.trim();
      if (data.targetGoal) {
        updated.targetGoal = data.targetGoal;
        updated.selectedCourseId = data.targetGoal;
      }
      if (data.dailyGoalQuestions) updated.dailyGoalQuestions = data.dailyGoalQuestions;
      return updated;
    });
  };

  // User Level & XP calculation
  const userLevel = Math.floor(stats.xp / 100) + 1;
  const levelProgress = stats.xp % 100;

  // Dynamic Leaderboard
  const userEmoji = stats.avatar === 'haribo' ? '🍯' : (AVATAR_MAP[stats.avatar]?.emoji || '🎓');
  const leaderboard: LeaderboardUser[] = ([
    { id: 'lb-1', name: 'Zeynep Yılmaz', avatar: '👩‍🎓', xp: Math.max(480, stats.xp + 40), tier: 'diamond' as const },
    { id: 'lb-user', name: `Sen (${stats.title})`, avatar: userEmoji, xp: stats.xp, tier: 'diamond' as const, isCurrentUser: true },
    { id: 'lb-2', name: 'Barış Demir', avatar: '👨‍💻', xp: Math.max(310, stats.xp - 30), tier: 'diamond' as const },
    { id: 'lb-3', name: 'Elif Kaya', avatar: '👩‍🏫', xp: Math.max(260, stats.xp - 60), tier: 'gold' as const },
    { id: 'lb-4', name: 'Mert Aksoy', avatar: '🧑‍🔬', xp: 215, tier: 'gold' as const },
    { id: 'lb-5', name: 'Selin Yıldız', avatar: '👩‍🎨', xp: 180, tier: 'silver' as const },
    { id: 'lb-6', name: 'Kaan Çelik', avatar: '🚀', xp: 150, tier: 'silver' as const },
    { id: 'lb-7', name: 'Ayşe Öztürk', avatar: '👩‍⚕️', xp: 110, tier: 'bronze' as const }
  ] as LeaderboardUser[]).sort((a, b) => b.xp - a.xp);

  return (
    <GameContext.Provider
      value={{
        stats,
        selectedCourseId: stats.selectedCourseId,
        setSelectedCourseId,
        activeLesson,
        startLesson,
        closeLesson,
        completeLesson,
        openChest,
        loseHeart,
        refillHearts,
        buyShopItem,
        notes,
        addNote,
        deleteNote,
        soundMuted,
        toggleSound,
        leaderboard,
        setTheme,
        setAvatar,
        setTitle,
        setBannerColor,
        userLevel,
        levelProgress,
        updateElo,
        addMistake,
        removeMistake,
        clearAllMistakes,
        updateUsername,
        loginUser,
        logoutUser,
        buyCostume,
        selectCostume,
        equipFrame,
        buyFrameWithGems,
        addXpAndGems,
        upgradeToPro,
        completeOnboarding,
        updateUserPreferences,
        activeAchievement,
        dismissAchievement,
        triggerAchievement
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};
