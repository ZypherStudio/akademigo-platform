import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { COURSES } from '../data/coursesData';
import { CourseCategory, Lesson } from '../types';
import {
  Flame,
  Settings,
  Play,
  Sparkles,
  ChevronRight,
  Trophy,
  Swords,
  BookOpen,
  FileText,
  Clock,
  Bot,
  Code2,
  CheckCircle2,
  Layers,
  GraduationCap,
  X,
  Gem,
  Music,
  VolumeX,
  ShoppingBag,
  Compass,
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';
import { KnowzaTab } from './KnowzaBottomNav';
import { KnowzaAvatar } from './KnowzaAvatar';

interface KnowzaHomeProps {
  onStartQuiz: (subject: string) => void;
  onOpenLevelUp: () => void;
  onOpenSettings: () => void;
  onNavigateTab: (tab: KnowzaTab) => void;
  onOpenOnboarding?: () => void;
}

export const KnowzaHome: React.FC<KnowzaHomeProps> = ({
  onStartQuiz,
  onOpenLevelUp,
  onOpenSettings,
  onNavigateTab,
  onOpenOnboarding
}) => {
  const { stats, selectedCourseId, setSelectedCourseId, startLesson } = useGame();
  const [showAllCategoriesModal, setShowAllCategoriesModal] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => sound.getBgmEnabled());

  // Dynamic user level calculation (Starts at Level 1 with 0 XP)
  const userLevel = Math.max(1, Math.floor((stats.xp || 0) / 100) + 1);

  // Available categories with metadata
  const categories: { id: CourseCategory; name: string; icon: string; badge: string; color: string }[] = [
    { id: 'yks', name: 'YKS (TYT - AYT)', icon: '🎓', badge: 'ÖSYM', color: 'from-amber-500 to-orange-500' },
    { id: 'lgs', name: '8. Sınıf LGS', icon: '📚', badge: 'MEB', color: 'from-blue-500 to-indigo-500' },
    { id: 'kpss', name: 'KPSS 2026', icon: '🏛️', badge: 'Memurluk', color: 'from-emerald-500 to-teal-600' },
    { id: 'kodlama', name: 'Kodlama / Python', icon: '💻', badge: 'Yazılım', color: 'from-purple-500 to-pink-500' },
    { id: 'dil', name: 'İngilizce & Dil', icon: '🌐', badge: 'A1 - B2', color: 'from-cyan-500 to-blue-600' }
  ];

  // User's target category takes priority in ordering
  const userTargetGoal = stats.targetGoal || 'yks';
  const prioritizedCategories = [...categories].sort((a, b) => {
    if (a.id === userTargetGoal) return -1;
    if (b.id === userTargetGoal) return 1;
    return 0;
  });

  // Active course data from coursesData
  const currentCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];
  const allUnits = currentCourse?.units || [];
  
  // Real playable lessons with actual questions (Zero 0-question lessons!)
  const primaryUnit = allUnits[0];
  const playableLessons: Lesson[] = allUnits
    .flatMap((u) => u.lessons)
    .filter((l) => l.questions && l.questions.length > 0);
  
  const primaryLesson: Lesson | undefined = playableLessons[0];
  const otherLessons: Lesson[] = playableLessons.slice(1, 7);

  const handleLaunchLesson = (lesson: Lesson) => {
    sound.playClick();
    startLesson(lesson);
  };

  const currentStreak = stats.streak ?? 0;
  const currentGems = stats.gems ?? 0;

  return (
    <div className="flex-1 w-full px-4 py-4 space-y-4 pb-36 select-none animate-fade overflow-x-hidden">
      
      {/* ================= TOP HEADER BAR ================= */}
      <div className="flex items-center justify-between pt-1">
        {/* User Profile Pill */}
        <div
          onClick={() => onNavigateTab('profile')}
          className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-all"
        >
          <div className="flex-shrink-0">
            <KnowzaAvatar size="md" costume={stats.selectedCostume} />
          </div>
          <div className="min-w-0 max-w-[130px] sm:max-w-[180px]">
            <span className="text-[10px] font-bold text-[#8C7A5E] block leading-none truncate">
              {stats.email ? stats.email : 'Merhaba!'}
            </span>
            <h2 className="text-base sm:text-lg font-black text-[#2A1E00] flex items-center gap-1 leading-snug truncate mt-0.5">
              <span className="truncate">{stats.username || 'Öğrenci'}</span>
              <span className="text-xs">👑</span>
            </h2>
          </div>
        </div>

        {/* Right Action Icons: Gems, Streak, Music & Settings */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Gems & Direct Shop Pill */}
          <button
            onClick={() => {
              sound.playClick();
              onNavigateTab('shop');
            }}
            className="flex items-center gap-1 bg-[#EBF5FF] border border-[#BCE1FE] px-2.5 py-1.5 rounded-2xl text-[#1C8BD6] font-black text-xs shadow-xs hover:scale-105 active:scale-95 transition"
            title="Knowza Mağaza & Elmaslar"
          >
            <Gem className="w-3.5 h-3.5 fill-[#1CB0F6] text-[#1CB0F6]" />
            <span>{currentGems}</span>
          </button>

          {/* Daily Streak Pill */}
          <div className="flex items-center gap-1 bg-[#FFF2D6] border border-[#FFE2A3] px-2.5 py-1.5 rounded-2xl text-[#D96B00] font-black text-xs shadow-xs">
            <Flame className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00] animate-bounceSubtle" />
            <span>{currentStreak}g</span>
          </div>

          {/* Music Toggle */}
          <button
            onClick={() => {
              const bgmOn = sound.toggleBgm();
              setIsMusicPlaying(bgmOn);
            }}
            className={`w-9 h-9 rounded-2xl border flex items-center justify-center transition-all active:scale-90 shadow-xs ${
              isMusicPlaying
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm animate-pulse'
                : 'bg-white border-[#F2E8D5] text-[#A0988A] hover:text-[#70685A]'
            }`}
            title={isMusicPlaying ? 'Müziği Duraklat' : 'Çalışma Müziğini Başlat 🎵'}
          >
            {isMusicPlaying ? <Music className="w-4 h-4 text-amber-600" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-2xl bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] hover:text-[#2A1E00] hover:bg-[#FFF9EC] shadow-xs active:scale-90 transition-all"
            title="Ayarlar & Profil"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* ================= BESPOKE 3D MASCOT HERO CARD ================= */}
      <div className="bg-gradient-to-br from-[#FFFDF6] via-[#FFF5DE] to-[#FFEAB6] rounded-[28px] p-4 sm:p-5 border-2 border-[#FFDA85] shadow-[0_10px_26px_rgba(255,184,0,0.18)] relative overflow-hidden">
        
        {/* Soft Background Radial Light */}
        <div className="absolute -top-12 -right-12 w-44 h-44 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between gap-3 relative z-10">
          
          {/* Left Column: Companion Speech & Progress */}
          <div className="flex-1 space-y-2">
            
            {/* Top Companion Pill */}
            <div className="inline-flex items-center gap-1.5 bg-white/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full text-[10px] font-black text-amber-900 shadow-xs">
              <Sparkles className="w-3 h-3 text-amber-600 fill-amber-400" />
              <span>2026 Sınav Koçun Yanında</span>
            </div>

            {/* Mascot Speech Bubble */}
            <div className="bg-white/95 rounded-2xl p-2.5 border border-amber-200 shadow-xs text-left relative">
              <p className="text-xs font-black text-slate-800 leading-snug">
                {currentStreak === 0
                  ? `Selam ${stats.username || 'Öğrenci'}! 🎓 Bugün senin ilk günün. İlk testini çözüp serini 1 güne çıkaralım mı?`
                  : `Harikasın ${stats.username || 'Öğrenci'}! 🔥 ${currentStreak} gündür aralıksız çalışıyorsun. Bugünün hedefini tamamla!`
                }
              </p>
            </div>

            {/* Daily Real Progress & Action */}
            <div className="flex items-center gap-2 pt-0.5">
              {primaryLesson && (
                <button
                  onClick={() => handleLaunchLesson(primaryLesson)}
                  className="px-3 py-2 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] text-slate-950 font-black text-xs rounded-xl border-b-3 border-[#D99000] active:border-b-0 active:translate-y-0.5 shadow-sm transition flex items-center gap-1.5"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-950" />
                  <span>{currentStreak === 0 ? 'İlk Testi Çöz 🚀' : 'Dersine Başla ⚡'}</span>
                </button>
              )}

              <button
                onClick={() => onNavigateTab('aicoach')}
                className="px-2.5 py-2 bg-white/90 hover:bg-white text-slate-800 font-extrabold text-[11px] rounded-xl border border-amber-200 shadow-xs transition flex items-center gap-1"
              >
                <Bot className="w-3.5 h-3.5 text-indigo-600" />
                <span>AI Koç</span>
              </button>
            </div>

          </div>

          {/* Right Column: 3D Mascot with Illuminated Golden Pedestal */}
          <div className="relative w-28 sm:w-32 flex flex-col items-center justify-center flex-shrink-0">
            
            {/* 3D Illuminated Golden Stage Base */}
            <div className="absolute bottom-0 w-24 sm:w-28 h-8 bg-gradient-to-r from-amber-400/40 via-yellow-300/80 to-amber-400/40 rounded-[100%] blur-[1px] border border-amber-300/60 shadow-[0_6px_16px_rgba(245,158,11,0.3)]" />
            <div className="absolute bottom-1 w-20 h-4 bg-amber-500/20 rounded-[100%] blur-[2px]" />

            {/* Mascot Character with Clean Float & Shadow */}
            <div 
              onClick={() => onNavigateTab('aicoach')}
              className="relative z-10 w-24 sm:w-28 filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.25)] hover:scale-105 active:scale-95 transition-transform duration-200 cursor-pointer"
              title="3D Knowza Ayıcığı - Tıkla ve Koçuna Soru Sor!"
            >
              <img
                src="/assets/knowza_reading.png"
                alt="Knowza 3D Maskot"
                className="w-full h-auto object-contain animate-float"
              />
            </div>

            {/* Real Streak Badge Pill */}
            <div className="relative z-20 -mt-2 bg-slate-900 text-amber-400 font-black text-[9px] px-2 py-0.5 rounded-full border border-amber-400/50 shadow-xs flex items-center gap-1">
              <Flame className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
              <span>{currentStreak} Gün Seri</span>
            </div>

          </div>

        </div>

      </div>

      {/* ================= SINA VE KATEGORİ SEÇİCİ ================= */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs font-black uppercase text-[#8C7A5E] tracking-wider flex items-center gap-1.5 truncate">
              <GraduationCap className="w-4 h-4 text-[#FFB800] flex-shrink-0" />
              Hedef Sınavını Seç
            </span>
            {stats.targetGoal && (
              <span className="text-[9px] font-black bg-amber-100 text-amber-900 border border-amber-300 px-2 py-0.5 rounded-full whitespace-nowrap">
                {categories.find(c => c.id === stats.targetGoal)?.badge || 'Seçildi'}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {onOpenOnboarding && (
              <button
                onClick={onOpenOnboarding}
                className="text-xs font-black text-[#FFB800] hover:underline cursor-pointer flex items-center gap-1"
                title="Hedef Tercihlerini Değiştir"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Hedefi Değiştir</span>
              </button>
            )}
            <button
              onClick={() => setShowAllCategoriesModal(true)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800"
            >
              Tümü
            </button>
          </div>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 pr-4">
          {prioritizedCategories.map((cat) => {
            const isSelected = selectedCourseId === cat.id;
            const isTarget = stats.targetGoal === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCourseId(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl whitespace-nowrap text-xs font-black transition-all active:scale-95 border-2 relative ${
                  isSelected
                    ? 'bg-[#FFB800] border-[#D99000] text-[#2A1E00] shadow-sm'
                    : 'bg-white border-[#F2E8D5] text-[#70685A] hover:bg-[#FFFDF7]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
                {isTarget && (
                  <span className={`text-[8px] font-black px-1 rounded uppercase ${
                    isSelected ? 'bg-black/20 text-[#2A1E00]' : 'bg-amber-100 text-amber-900'
                  }`}>
                    Hedef
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= BUGÜNÜN DERSLERİ & GERÇEK TESTLER ================= */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-black text-[#2A1E00] truncate">
              {currentCourse?.name || 'Bugünün Dersleri'}
            </h3>
            <p className="text-[11px] font-bold text-[#8C7A5E] truncate">
              {currentCourse?.subTitle || 'Adım adım pratik yap ve seviye atla'}
            </p>
          </div>
          <button
            onClick={() => setShowAllCategoriesModal(true)}
            className="text-xs font-black text-[#FFB800] hover:underline whitespace-nowrap flex-shrink-0"
          >
            Tüm Testler ({allUnits.length})
          </button>
        </div>

        {/* Featured Primary Subject Card */}
        {primaryLesson ? (
          <div
            onClick={() => handleLaunchLesson(primaryLesson)}
            className="bg-white rounded-3xl p-4 border-2 border-[#FFE2A3] hover:border-[#FFB800] shadow-[0_8px_24px_rgba(255,184,0,0.1)] flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
          >
            <div className="flex items-center gap-3.5 min-w-0 flex-1 pr-2">
              <div className="w-12 h-12 rounded-2xl bg-[#FFF8E7] border border-[#FFE2A3] flex items-center justify-center text-2xl shadow-inner group-hover:scale-105 transition-transform flex-shrink-0">
                {currentCourse.icon}
              </div>
              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full text-[10px] font-black text-amber-900 mb-0.5">
                  <Sparkles className="w-3 h-3 text-[#FFB800]" />
                  <span>+{primaryLesson.xpReward} XP</span>
                </div>
                <h4 className="text-sm font-black text-[#2A1E00] line-clamp-2 leading-snug">
                  {primaryLesson.title}
                </h4>
                <p className="text-[10px] font-bold text-[#8C7A5E] truncate mt-0.5">
                  {primaryUnit?.title || 'Temel Seviye'}
                </p>
              </div>
            </div>

            {/* Golden Circle Play Button */}
            <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-[#FFB800] to-[#FFD54F] border-b-4 border-[#D99000] flex items-center justify-center text-[#2A1E00] shadow-md group-hover:scale-110 active:border-b-0 active:translate-y-1 transition-all flex-shrink-0">
              <Play className="w-4 h-4 fill-[#2A1E00] ml-0.5" />
            </div>
          </div>
        ) : null}

        {/* Secondary Real Lessons Grid */}
        <div className="grid grid-cols-2 gap-2">
          {otherLessons.slice(0, 4).map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => handleLaunchLesson(lesson)}
              className="bg-white p-3 rounded-2xl border border-[#F2E8D5] hover:border-[#FFB800] hover:bg-[#FFFDF7] shadow-xs flex flex-col justify-between text-left transition-all active:scale-95 h-22"
            >
              <div>
                <span className="text-[9px] font-black text-[#FFB800] uppercase tracking-wider block">
                  Bölüm {idx + 2} • +{lesson.xpReward} XP
                </span>
                <span className="font-black text-xs text-[#2A1E00] line-clamp-2 mt-0.5 leading-tight">
                  {lesson.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-[10px] font-bold text-amber-600 mt-1">
                <span>{lesson.questions.length} Soru</span>
                <span className="text-xs">Çöz ►</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* ================= CANLI YARIŞMA & PRATİK ODALARI ================= */}
      <div className="space-y-2.5 pt-1">
        <h3 className="text-sm font-black text-[#2A1E00] flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-[#FFB800]" />
          <span>Canlı Yarışma & Pratik Arenaları</span>
        </h3>

        <div className="grid grid-cols-2 gap-2.5">
          {/* Canlı Soru Arenası (Rebranded from KahootGO) */}
          <button
            onClick={() => onNavigateTab('kahoot')}
            className="bg-gradient-to-br from-purple-600 to-indigo-700 rounded-2xl p-3.5 text-white shadow-md text-left flex flex-col justify-between h-26 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Canlı Yarışma
              </span>
              <h5 className="font-black text-sm leading-tight">Soru Arenası 🏆</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">Çok Oyunculu Bilgi Ligi</p>
            </div>
            <span className="text-lg self-end">▲ ◆ ● ■</span>
          </button>

          {/* 1v1 Bilgi Düellosu */}
          <button
            onClick={() => onNavigateTab('duel')}
            className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-2xl p-3.5 text-white shadow-md text-left flex flex-col justify-between h-26 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Anlık Kapışma
              </span>
              <h5 className="font-black text-sm leading-tight">1v1 Düello ⚔️</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">ELO Puanı Kazan</p>
            </div>
            <span className="text-xs font-black self-end bg-black/20 px-2 py-0.5 rounded-md">
              👑 {stats.eloRating || 1000} ELO
            </span>
          </button>

          {/* Soru Kaydır (Reels) */}
          <button
            onClick={() => onNavigateTab('reels')}
            className="bg-gradient-to-br from-amber-500 to-yellow-600 rounded-2xl p-3.5 text-white shadow-md text-left flex flex-col justify-between h-26 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Hızlı Çözüm
              </span>
              <h5 className="font-black text-sm leading-tight">Soru Kaydır 🔥</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">Dikey Soru Akışı</p>
            </div>
            <span className="text-lg self-end">🎯</span>
          </button>

          {/* Deneme Sınavları (ÖSYM & MEB) */}
          <button
            onClick={() => onNavigateTab('exams')}
            className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-3.5 text-white shadow-md text-left flex flex-col justify-between h-26 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[9px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                2026 Formatı
              </span>
              <h5 className="font-black text-sm leading-tight">Denemeler 📝</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">TYT / KPSS / LGS</p>
            </div>
            <span className="text-lg self-end">⏱️</span>
          </button>
        </div>
      </div>

      {/* ================= EKSTRA ARAÇLAR ================= */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => onNavigateTab('aicoach')}
          className="bg-white p-2.5 rounded-2xl border border-amber-200/70 shadow-xs flex flex-col items-center text-center active:scale-95 transition"
        >
          <Bot className="w-5 h-5 text-amber-600 mb-1" />
          <span className="text-[10px] font-black text-slate-800">AI Koç</span>
        </button>

        <button
          onClick={() => onNavigateTab('countdown')}
          className="bg-white p-2.5 rounded-2xl border border-amber-200/70 shadow-xs flex flex-col items-center text-center active:scale-95 transition"
        >
          <Clock className="w-5 h-5 text-indigo-600 mb-1" />
          <span className="text-[10px] font-black text-slate-800">Sayaç</span>
        </button>

        <button
          onClick={() => onNavigateTab('errors')}
          className="bg-white p-2.5 rounded-2xl border border-amber-200/70 shadow-xs flex flex-col items-center text-center active:scale-95 transition"
        >
          <CheckCircle2 className="w-5 h-5 text-rose-500 mb-1" />
          <span className="text-[10px] font-black text-slate-800">Hatalarım</span>
        </button>

        <button
          onClick={() => onNavigateTab('codelab')}
          className="bg-white p-2.5 rounded-2xl border border-amber-200/70 shadow-xs flex flex-col items-center text-center active:scale-95 transition"
        >
          <Code2 className="w-5 h-5 text-purple-600 mb-1" />
          <span className="text-[10px] font-black text-slate-800">Kod Lab</span>
        </button>
      </div>

      {/* ================= KNOWZA MAĞAZA BANNER ================= */}
      <div
        onClick={() => {
          sound.playClick();
          onNavigateTab('shop');
        }}
        className="bg-gradient-to-r from-[#2B1B06] via-[#3D2608] to-[#1C1204] rounded-3xl p-4 text-white shadow-lg border border-amber-500/40 flex items-center justify-between cursor-pointer active:scale-98 transition group relative overflow-hidden"
      >
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-[9px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            <span>VIP MAĞAZA</span>
            <span>💎</span>
          </div>
          <h4 className="text-sm font-black text-amber-200 group-hover:text-amber-100 transition">
            Knowza Mağaza & PRO Pass
          </h4>
          <p className="text-[11px] text-amber-100/70 font-semibold">
            Sınırsız can, 2X XP desteği ve özel 3D kostümler!
          </p>
        </div>
        <div className="w-12 h-12 relative z-10 flex-shrink-0 group-hover:scale-110 transition filter drop-shadow-md">
          <img
            src="/assets/knowza_avatar_circle.png"
            alt="Knowza Mağaza"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* ================= TÜM DERSLER MODALI ================= */}
      {showAllCategoriesModal && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 animate-fade"
          onClick={() => setShowAllCategoriesModal(false)}
        >
          <div
            className="w-full max-w-md bg-white rounded-t-[36px] sm:rounded-3xl p-5 max-h-[90vh] overflow-y-auto space-y-4 shadow-2xl border border-amber-100"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-2xl bg-amber-100 flex items-center justify-center text-xl">
                  🎓
                </div>
                <div>
                  <h3 className="font-black text-slate-900 text-base">Tüm Sınavlar & Testler</h3>
                  <p className="text-xs text-slate-500 font-semibold">Hedefine göre dersini seç ve hemen çöz</p>
                </div>
              </div>
              <button
                onClick={() => setShowAllCategoriesModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 font-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Courses List */}
            <div className="space-y-3 pt-1">
              {COURSES.map((course) => {
                const isSelected = selectedCourseId === course.id;
                const totalQuestions = course.units.reduce(
                  (sum, u) => sum + u.lessons.reduce((lSum, l) => lSum + l.questions.length, 0),
                  0
                );

                return (
                  <div
                    key={course.id}
                    className={`p-3.5 rounded-3xl border-2 transition-all ${
                      isSelected
                        ? 'border-[#FFB800] bg-amber-50/70 shadow-sm'
                        : 'border-slate-100 hover:border-amber-200 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{course.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-black text-sm text-slate-900">{course.name}</h4>
                            {course.badge && (
                              <span className="text-[9px] font-black bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-md">
                                {course.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{course.subTitle}</p>
                        </div>
                      </div>
                    </div>

                    {/* Units & Quick Start */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-600">
                        {course.units.length} Bölüm • {totalQuestions} Soru
                      </span>

                      <button
                        onClick={() => {
                          setSelectedCourseId(course.id as CourseCategory);
                          const firstLesson = course.units[0]?.lessons[0];
                          setShowAllCategoriesModal(false);
                          if (firstLesson) {
                            handleLaunchLesson(firstLesson);
                          }
                        }}
                        className="px-3.5 py-1.5 bg-[#FFB800] hover:bg-[#FFA500] text-slate-900 font-black text-xs rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-slate-900" />
                        <span>Hemen Başla</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
