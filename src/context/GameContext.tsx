import React, { createContext, useContext, useState, useEffect } from 'react';
import { CourseCategory, Lesson, UserStats, LeaderboardUser, StudyNote, AppTheme, UserAvatar, MistakeItem } from '../types';
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
  xp: 260,
  gems: 280,
  hearts: 5,
  maxHearts: 5,
  streak: 6,
  lastActiveDate: new Date().toISOString().split('T')[0],
  completedLessons: ['yks-u1-l1', 'kod-u1-l1'],
  openedChests: [],
  selectedCourseId: 'yks',
  theme: 'duo',
  avatar: 'owl',
  title: 'YKS Derece Adayı 🎓',
  bannerColor: 'from-emerald-500 to-green-600',
  totalQuestionsAnswered: 35,
  totalStudyMinutes: 65,
  eloRating: 1240,
  duelWins: 3,
  duelLosses: 1,
  errorList: DEFAULT_MISTAKES,
  inventory: {
    streakFreeze: 1,
    heartRefillCount: 0,
    doubleXpMinutes: 0
  },
  dailyQuestProgress: {
    completedLessonsToday: 2,
    xpGainedToday: 65,
    perfectLessonsToday: 1
  }
};

const DEFAULT_NOTES: StudyNote[] = [
  {
    id: 'note-1',
    category: 'yks',
    title: 'TYT Tek/Çift Sayı Taktikleri',
    content: 'T ± T = Ç, T × T = T. Çarpanlardan biri çiftse sonuç daima çift!',
    createdAt: 'Bugün, 14:30'
  },
  {
    id: 'note-2',
    category: 'kodlama',
    title: 'Python List Metodları',
    content: '.append(x) sona ekler, .pop() son elemanı silip döner, len(list) eleman sayısını verir.',
    createdAt: 'Dün, 19:15'
  },
  {
    id: 'note-3',
    category: 'kpss',
    title: '2026 Güncel Bilgiler',
    content: 'Alper Gezeravcı: İlk Türk Astronot (Ax-3 Misyonu). Gordion Antik Kenti (Ankara): UNESCO 20. Dünya Mirası.',
    createdAt: 'Bugün, 11:20'
  }
];

export const AVATAR_MAP: Record<UserAvatar, { emoji: string; name: string }> = {
  owl: { emoji: '🦉', name: 'Bilge Baykuş' },
  fox: { emoji: '🦊', name: 'Zeki Tilki' },
  robot: { emoji: '🤖', name: 'AI Robot' },
  astronaut: { emoji: '🚀', name: 'Kozmik Kaşif' },
  wizard: { emoji: '🧙‍♂️', name: 'Bilgi Büyücüsü' },
  coder_cat: { emoji: '🐱', name: 'Kodcu Kedi' }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stats, setStats] = useState<UserStats>(() => {
    try {
      const saved = localStorage.getItem('akademi_user_stats');
      if (saved) {
        const parsed = JSON.parse(saved);
        return { ...DEFAULT_STATS, ...parsed };
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

      return {
        ...prev,
        xp: prev.xp + earnedXp,
        gems: prev.gems + earnedGems,
        streak: prev.streak + (isAlreadyCompleted ? 0 : 1),
        completedLessons: newCompleted,
        totalQuestionsAnswered: prev.totalQuestionsAnswered + 4,
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

    setStats(prev => ({
      ...prev,
      xp: prev.xp + earnedXp,
      gems: prev.gems + earnedGems,
      openedChests: [...prev.openedChests, chestId]
    }));
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

  // User Level & XP calculation
  const userLevel = Math.floor(stats.xp / 100) + 1;
  const levelProgress = stats.xp % 100;

  // Dynamic Leaderboard
  const userEmoji = AVATAR_MAP[stats.avatar]?.emoji || '🦉';
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
        clearAllMistakes
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
