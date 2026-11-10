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
  ShoppingBag
} from 'lucide-react';
import { sound } from '../utils/audio';
import { KnowzaTab } from './KnowzaBottomNav';
import { KnowzaAvatar } from './KnowzaAvatar';

interface KnowzaHomeProps {
  onStartQuiz: (subject: string) => void;
  onOpenLevelUp: () => void;
  onOpenSettings: () => void;
  onNavigateTab: (tab: KnowzaTab) => void;
}

export const KnowzaHome: React.FC<KnowzaHomeProps> = ({
  onStartQuiz,
  onOpenLevelUp,
  onOpenSettings,
  onNavigateTab
}) => {
  const { stats, selectedCourseId, setSelectedCourseId, startLesson } = useGame();
  const [showAllCategoriesModal, setShowAllCategoriesModal] = useState(false);
  const [isMusicPlaying, setIsMusicPlaying] = useState(() => sound.getBgmEnabled());

  // Available categories with metadata
  const categories: { id: CourseCategory; name: string; icon: string; badge: string; color: string }[] = [
    { id: 'yks', name: 'YKS (TYT - AYT)', icon: '🎓', badge: 'ÖSYM', color: 'from-amber-500 to-orange-500' },
    { id: 'lgs', name: '8. Sınıf LGS', icon: '📚', badge: 'MEB', color: 'from-blue-500 to-indigo-500' },
    { id: 'kpss', name: 'KPSS 2026', icon: '🏛️', badge: 'Memurluk', color: 'from-emerald-500 to-teal-600' },
    { id: 'kodlama', name: 'Kodlama / Python', icon: '💻', badge: 'Junior Mod', color: 'from-purple-500 to-pink-500' },
    { id: 'dil', name: 'İngilizce & YDS', icon: '🌐', badge: 'A1 - B2', color: 'from-cyan-500 to-blue-600' }
  ];

  // Active course data from coursesData
  const currentCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];
  const allUnits = currentCourse?.units || [];
  const primaryUnit = allUnits[0];
  const primaryLesson: Lesson | undefined = primaryUnit?.lessons[0];
  const otherLessons: Lesson[] = allUnits.flatMap((u) => u.lessons).slice(1, 5);

  const handleLaunchLesson = (lesson: Lesson) => {
    sound.playClick();
    startLesson(lesson);
  };

  return (
    <div className="flex-1 max-w-md mx-auto px-4 py-3 space-y-4 pb-36 select-none animate-fade">
      {/* Top Header Bar with Brand Logo */}
      <div className="space-y-2.5 pt-1">
        {/* Top Brand & Controls Row */}
        <div className="flex items-center justify-between">
          {/* Official 3D Knowza Brand Wordmark Logo */}
          <div className="flex items-center gap-1.5 cursor-pointer" onClick={() => onNavigateTab('home')}>
            <img
              src="/assets/knowza_wordmark_transparent.png"
              alt="Knowza"
              className="h-7 sm:h-8 w-auto object-contain filter drop-shadow-xs transform hover:scale-105 transition"
            />
            <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 shadow-xs tracking-wider">
              3D
            </span>
          </div>

          {/* Quick Sound & Settings */}
          <div className="flex items-center gap-1.5">
            {/* Music Toggle */}
            <button
              onClick={() => {
                const bgmOn = sound.toggleBgm();
                setIsMusicPlaying(bgmOn);
              }}
              className={`w-8 h-8 rounded-xl border flex items-center justify-center transition-all active:scale-90 shadow-xs ${
                isMusicPlaying
                  ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-sm animate-pulse'
                  : 'bg-white border-[#F2E8D5] text-[#A0988A] hover:text-[#70685A]'
              }`}
              title={isMusicPlaying ? 'Müziği Duraklat' : 'Çalışma Müziğini Başlat 🎵'}
            >
              {isMusicPlaying ? <Music className="w-3.5 h-3.5 text-amber-600" /> : <VolumeX className="w-3.5 h-3.5" />}
            </button>

            {/* Settings Button */}
            <button
              onClick={() => {
                sound.playClick();
                onOpenSettings();
              }}
              className="w-8 h-8 rounded-xl bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] hover:text-[#2A1E00] hover:bg-[#FFF9EC] shadow-xs active:scale-90 transition-all"
              title="Ayarlar & Profil"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* User Profile & Status Row */}
        <div className="flex items-center justify-between bg-white/90 border border-amber-100/80 px-3 py-2 rounded-2xl shadow-xs">
          {/* User Profile Pill */}
          <div
            onClick={() => onNavigateTab('profile')}
            className="flex items-center gap-2 cursor-pointer group active:scale-95 transition-all"
          >
            <div className="flex-shrink-0">
              <KnowzaAvatar size="sm" costume={stats.selectedCostume} />
            </div>
            <div className="min-w-0 max-w-[100px] sm:max-w-[140px]">
              <span className="text-[10px] font-bold text-[#8C7A5E] block leading-none truncate">Merhaba!</span>
              <h2 className="text-sm font-black text-[#2A1E00] flex items-center gap-1 leading-snug truncate">
                <span className="truncate">{stats.username || 'Alp'}</span>
                <span className="text-xs">👑</span>
              </h2>
            </div>
          </div>

          {/* Right Action Icons: Gems/Shop & Streak */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Gems & Direct Shop Pill */}
            <button
              onClick={() => {
                sound.playClick();
                onNavigateTab('shop');
              }}
              className="flex items-center gap-1 bg-[#EBF5FF] border border-[#BCE1FE] px-2.5 py-1 rounded-xl text-[#1C8BD6] font-black text-xs shadow-xs hover:scale-105 active:scale-95 transition"
              title="Knowza Mağaza & Elmaslar"
            >
              <Gem className="w-3.5 h-3.5 fill-[#1CB0F6] text-[#1CB0F6]" />
              <span>{stats.gems || 280}</span>
            </button>

            {/* Daily Streak Pill */}
            <div className="flex items-center gap-1 bg-[#FFF2D6] border border-[#FFE2A3] px-2.5 py-1 rounded-xl text-[#D96B00] font-black text-xs shadow-xs">
              <Flame className="w-3.5 h-3.5 fill-[#FF8A00] text-[#FF8A00] animate-bounceSubtle" />
              <span>{stats.streak || 6}g</span>
            </div>
          </div>
        </div>
      </div>

      {/* Card 1: Günlük Serin Kartı */}
      <div className="bg-gradient-to-r from-[#FFF8E7] via-[#FFF2D6] to-[#FFEABF] rounded-3xl p-5 border border-[#FFE2A3] shadow-[0_8px_20px_rgba(255,184,0,0.12)] flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="text-xs font-black uppercase text-[#8C7A5E] tracking-wider">
            Günlük Serin
          </span>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 fill-[#FF8A00] text-[#FF8A00]" />
            <h3 className="text-2xl font-black text-[#2A1E00]">
              {stats.streak || 6} gün
            </h3>
          </div>
          <p className="text-xs font-bold text-[#D98200]">
            Devam et! Yarın serin {(stats.streak || 6) + 1} gün olacak.
          </p>
        </div>

        {/* Mascot on Cloud (Clean isolated transparent PNG) */}
        <div className="w-24 sm:w-28 filter drop-shadow-md relative z-10 -mr-1">
          <img
            src="/assets/knowza_reading.png"
            alt="Knowza Maskot"
            className="w-full h-auto object-contain animate-float"
          />
        </div>
      </div>

      {/* Sınav & Kategori Seçici Haplar (YKS, LGS, KPSS, Kodlama, Dil) */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase text-[#8C7A5E] tracking-wider flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4 text-[#FFB800]" />
            Hedef Sınavını Seç
          </span>
          <button
            onClick={() => setShowAllCategoriesModal(true)}
            className="text-xs font-black text-[#FFB800] hover:underline cursor-pointer"
          >
            Tümünü Gör
          </button>
        </div>

        {/* Category Horizontal Scroll Pills */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => {
            const isSelected = selectedCourseId === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCourseId(cat.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl whitespace-nowrap text-xs font-black transition-all active:scale-95 border-2 ${
                  isSelected
                    ? 'bg-[#FFB800] border-[#D99000] text-[#2A1E00] shadow-sm'
                    : 'bg-white border-[#F2E8D5] text-[#70685A] hover:bg-[#FFFDF7]'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section: Bugünün Dersleri & Aktif Kategori Testleri */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-black text-[#2A1E00]">
              {currentCourse?.name || 'Bugünün Dersleri'}
            </h3>
            <p className="text-[11px] font-bold text-[#8C7A5E]">
              {currentCourse?.subTitle || 'Adım adım pratik yap ve seviye atla'}
            </p>
          </div>
          <button
            onClick={() => setShowAllCategoriesModal(true)}
            className="text-xs font-black text-[#FFB800] hover:underline"
          >
            Tüm Testler ({allUnits.length} Bölüm)
          </button>
        </div>

        {/* Featured Primary Subject Card */}
        {primaryLesson ? (
          <div
            onClick={() => handleLaunchLesson(primaryLesson)}
            className="bg-white rounded-3xl p-5 border-2 border-[#FFE2A3] hover:border-[#FFB800] shadow-[0_8px_24px_rgba(255,184,0,0.1)] flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
          >
            <div className="flex items-center gap-4 min-w-0 flex-1 pr-2">
              <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] border border-[#FFE2A3] flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform flex-shrink-0">
                {currentCourse.icon}
              </div>
              <div className="min-w-0">
                <div className="inline-flex items-center gap-1 bg-amber-100 px-2 py-0.5 rounded-full text-[10px] font-black text-amber-900 mb-0.5">
                  <Sparkles className="w-3 h-3 text-[#FFB800]" />
                  <span>+{primaryLesson.xpReward} XP</span>
                </div>
                <h4 className="text-base sm:text-lg font-black text-[#2A1E00] truncate">
                  {primaryLesson.title}
                </h4>
                <p className="text-xs font-bold text-[#8C7A5E] truncate">
                  {primaryUnit?.title || 'Temel Seviye'}
                </p>
              </div>
            </div>

            {/* Golden Circle Play Button */}
            <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFB800] to-[#FFD54F] border-b-4 border-[#D99000] flex items-center justify-center text-[#2A1E00] shadow-md group-hover:scale-110 active:border-b-0 active:translate-y-1 transition-all flex-shrink-0">
              <Play className="w-5 h-5 fill-[#2A1E00] ml-0.5" />
            </div>
          </div>
        ) : null}

        {/* Secondary Real Lessons Grid from current course */}
        <div className="grid grid-cols-2 gap-2.5">
          {otherLessons.slice(0, 4).map((lesson, idx) => (
            <button
              key={lesson.id}
              onClick={() => handleLaunchLesson(lesson)}
              className="bg-white p-3.5 rounded-2xl border border-[#F2E8D5] hover:border-[#FFB800] hover:bg-[#FFFDF7] shadow-sm flex flex-col justify-between text-left transition-all active:scale-95 h-24"
            >
              <div>
                <span className="text-[10px] font-black text-[#FFB800] uppercase tracking-wider block">
                  Bölüm {idx + 2} • +{lesson.xpReward} XP
                </span>
                <span className="font-black text-xs text-[#2A1E00] line-clamp-2 mt-0.5 leading-snug">
                  {lesson.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-[11px] font-bold text-amber-600 mt-1">
                <span>{lesson.questions.length} Soru</span>
                <span className="text-xs">Çöz ►</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Card 2: Seviye Atlama Zamanı! */}
      <div
        onClick={() => {
          sound.playVictory();
          onOpenLevelUp();
        }}
        className="bg-gradient-to-r from-[#FFF8E7] to-[#FFF0CC] rounded-3xl p-4 sm:p-5 border-2 border-[#FFE2A3] hover:border-[#FFB800] shadow-[0_8px_20px_rgba(255,184,0,0.12)] flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#FFB800]/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-[#D98200]">
            <Sparkles className="w-3 h-3 text-[#FFB800]" />
            Yeni Bölüm Açıldı
          </div>
          <h4 className="text-base sm:text-lg font-black text-[#2A1E00]">
            Seviye Atlama Zamanı!
          </h4>
          <p className="text-xs font-bold text-[#8C7A5E]">
            Seviye 13'e geçmek için tıkla ve kutla!
          </p>
        </div>

        {/* Clean isolated cheering bear */}
        <div className="w-20 sm:w-24 filter drop-shadow-md group-hover:scale-110 transition-transform flex-shrink-0">
          <img
            src="/assets/knowza_cheering.png"
            alt="Knowza Seviye Atlama"
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Popüler Yarışma & Eğitici Odalar Hub */}
      <div className="space-y-3 pt-1">
        <h3 className="text-base font-black text-[#2A1E00] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFB800]" />
          <span>Canlı Yarışma & Pratik Odaları</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* KahootGO Card */}
          <button
            onClick={() => onNavigateTab('kahoot')}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-4 text-white shadow-md text-left flex flex-col justify-between h-28 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Grup Oyunu
              </span>
              <h5 className="font-black text-sm sm:text-base leading-tight">KahootGO 🏆</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">PIN ile Çok Oyunculu</p>
            </div>
            <span className="text-xl self-end">▲ ◆ ● ■</span>
          </button>

          {/* 1v1 Bilgi Düellosu Card */}
          <button
            onClick={() => onNavigateTab('duel')}
            className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl p-4 text-white shadow-md text-left flex flex-col justify-between h-28 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Anlık Kapışma
              </span>
              <h5 className="font-black text-sm sm:text-base leading-tight">1v1 Düello ⚔️</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">ELO Puanı Kazan</p>
            </div>
            <span className="text-xs font-black self-end bg-black/20 px-2 py-1 rounded-lg">
              👑 {stats.eloRating || 1240} ELO
            </span>
          </button>

          {/* Soru Kaydır (Reels) */}
          <button
            onClick={() => onNavigateTab('reels')}
            className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-3xl p-4 text-white shadow-md text-left flex flex-col justify-between h-28 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Seri Çözüm
              </span>
              <h5 className="font-black text-sm sm:text-base leading-tight">Soru Kaydır 🔥</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">TikTok / Reels Modu</p>
            </div>
            <span className="text-xl self-end">🎯</span>
          </button>

          {/* Deneme Sınavları (ÖSYM) */}
          <button
            onClick={() => onNavigateTab('exams')}
            className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-3xl p-4 text-white shadow-md text-left flex flex-col justify-between h-28 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Gerçek Format
              </span>
              <h5 className="font-black text-sm sm:text-base leading-tight">Denemeler 📝</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">TYT / KPSS / LGS</p>
            </div>
            <span className="text-xl self-end">⏱️</span>
          </button>
        </div>
      </div>

      {/* Ekstra Odalar (AI Koç, Sınav Sayacı, Hata Defteri, Kod Lab) */}
      <div className="grid grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => onNavigateTab('aicoach')}
          className="bg-white p-2.5 rounded-2xl border border-amber-200/70 shadow-sm flex flex-col items-center text-center active:scale-95 transition"
        >
          <Bot className="w-5 h-5 text-amber-600 mb-1" />
          <span className="text-[11px] font-bold text-slate-800">AI Koç</span>
        </button>

        <button
          onClick={() => onNavigateTab('countdown')}
          className="bg-white p-2.5 rounded-2xl border border-amber-200/70 shadow-sm flex flex-col items-center text-center active:scale-95 transition"
        >
          <Clock className="w-5 h-5 text-indigo-600 mb-1" />
          <span className="text-[11px] font-bold text-slate-800">Sayaç</span>
        </button>

        <button
          onClick={() => onNavigateTab('errors')}
          className="bg-white p-2.5 rounded-2xl border border-amber-200/70 shadow-sm flex flex-col items-center text-center active:scale-95 transition"
        >
          <CheckCircle2 className="w-5 h-5 text-rose-500 mb-1" />
          <span className="text-[11px] font-bold text-slate-800">Hatalarım</span>
        </button>

        <button
          onClick={() => onNavigateTab('codelab')}
          className="bg-white p-2.5 rounded-2xl border border-amber-200/70 shadow-sm flex flex-col items-center text-center active:scale-95 transition"
        >
          <Code2 className="w-5 h-5 text-purple-600 mb-1" />
          <span className="text-[11px] font-bold text-slate-800">Kod Lab</span>
        </button>
      </div>

      {/* Knowza Mağaza & PRO VIP Pass Banner */}
      <div
        onClick={() => {
          sound.playClick();
          onNavigateTab('shop');
        }}
        className="bg-gradient-to-r from-[#2B1B06] via-[#3D2608] to-[#1C1204] rounded-3xl p-4 text-white shadow-lg border border-amber-500/40 flex items-center justify-between cursor-pointer active:scale-98 transition group relative overflow-hidden"
      >
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-amber-400 text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
            <span>VIP MAĞAZA</span>
            <span>💎</span>
          </div>
          <h4 className="text-base font-black text-amber-200 group-hover:text-amber-100 transition">
            Knowza Mağaza & PRO Pass
          </h4>
          <p className="text-xs text-amber-100/70 font-semibold">
            Sınırsız can, 2X XP, ödüllü reklam ve 3D kostümler!
          </p>
        </div>
        <div className="w-14 h-14 relative z-10 flex-shrink-0 group-hover:scale-110 transition filter drop-shadow-md">
          <img
            src="/assets/knowza_avatar_circle.png"
            alt="Knowza Mağaza"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      {/* Full Categories & All Tests Modal ("Tümünü Gör") */}
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
                  <h3 className="font-black text-slate-900 text-lg">Tüm Sınavlar & Testler</h3>
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
                    className={`p-4 rounded-3xl border-2 transition-all ${
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
                            <h4 className="font-black text-base text-slate-900">{course.name}</h4>
                            {course.badge && (
                              <span className="text-[10px] font-black bg-amber-200/70 text-amber-900 px-2 py-0.5 rounded-md">
                                {course.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 font-medium mt-0.5">{course.subTitle}</p>
                        </div>
                      </div>
                    </div>

                    {/* Units & Quick Start */}
                    <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
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
                        className="px-4 py-2 bg-[#FFB800] hover:bg-[#FFA500] text-slate-900 font-black text-xs rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
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
