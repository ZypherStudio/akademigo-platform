import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import {
  ArrowLeft,
  Award,
  Lock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  BookOpen,
  Flame,
  Star,
  Globe,
  Search,
  Crown,
  Trophy,
  Swords,
  Moon,
  Cpu,
  Zap,
  Target,
  Rocket,
  Heart
} from 'lucide-react';
import { sound } from '../utils/audio';

interface KnowzaBadgesProps {
  onBack?: () => void;
  onNavigateToQuiz?: () => void;
}

interface BadgeItem {
  id: string;
  title: string;
  desc: string;
  category: 'Başlangıç' | 'Seri' | 'Sınav' | 'Düello' | 'Uzmanlık';
  icon: React.ComponentType<{ className?: string }>;
  gradient: string;
  borderGlow: string;
  accentColor: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: { current: number; total: number };
  tier: 1 | 2 | 3;
}

export const KnowzaBadges: React.FC<KnowzaBadgesProps> = ({ onBack, onNavigateToQuiz }) => {
  const { stats } = useGame();
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const completedCount = stats.completedLessons?.length || 0;
  const currentStreak = stats.streak || 0;
  const currentLevel = Math.max(1, Math.floor((stats.xp || 0) / 100) + 1);
  const totalQuestions = stats.totalQuestionsAnswered || 0;

  const badges: BadgeItem[] = [
    {
      id: 'first_lesson',
      title: 'İlk Ders Tamamlandı',
      desc: 'Knowza ile ilk dersini başarıyla bitirdin ve eğitime başladın!',
      category: 'Başlangıç',
      icon: BookOpen,
      gradient: 'from-emerald-400 via-teal-500 to-emerald-600',
      borderGlow: 'border-emerald-300 shadow-emerald-500/20',
      accentColor: '#10B981',
      unlocked: completedCount >= 1,
      unlockedDate: completedCount >= 1 ? 'Tamamlandı' : undefined,
      progress: { current: Math.min(1, completedCount), total: 1 },
      tier: 1
    },
    {
      id: 'streak_master',
      title: 'Günlük Seri Ustası',
      desc: 'Üst üste 7 gün boyunca her gün en az 1 ders çözerek serini koru.',
      category: 'Seri',
      icon: Flame,
      gradient: 'from-amber-400 via-orange-500 to-amber-600',
      borderGlow: 'border-orange-300 shadow-orange-500/20',
      accentColor: '#F59E0B',
      unlocked: currentStreak >= 7,
      unlockedDate: currentStreak >= 7 ? 'Kazanıldı' : undefined,
      progress: { current: Math.min(7, currentStreak), total: 7 },
      tier: 2
    },
    {
      id: 'level_5',
      title: '5 Seviye Atlama',
      desc: 'Bilgini katlayarak Knowza evreninde 5. seviyeye ulaş.',
      category: 'Başlangıç',
      icon: Star,
      gradient: 'from-yellow-300 via-amber-400 to-yellow-500',
      borderGlow: 'border-yellow-200 shadow-yellow-500/30',
      accentColor: '#EAB308',
      unlocked: currentLevel >= 5,
      unlockedDate: currentLevel >= 5 ? 'Kazanıldı' : undefined,
      progress: { current: Math.min(5, currentLevel), total: 5 },
      tier: 1
    },
    {
      id: 'lang_expert',
      title: 'Dil Uzmanı',
      desc: 'İngilizce ve Dil testlerinde pratik yaparak dersleri tamamla.',
      category: 'Uzmanlık',
      icon: Globe,
      gradient: 'from-sky-400 via-blue-500 to-indigo-600',
      borderGlow: 'border-sky-300 shadow-blue-500/20',
      accentColor: '#0EA5E9',
      unlocked: (stats.completedLessons || []).some(id => id.startsWith('dil')),
      progress: { current: (stats.completedLessons || []).filter(id => id.startsWith('dil')).length, total: 3 },
      tier: 2
    },
    {
      id: 'knowledge_hunter',
      title: 'Bilgi Avcısı',
      desc: 'Zorlu test ve deneme sorularında 50 doğru cevaba ulaş.',
      category: 'Sınav',
      icon: Search,
      gradient: 'from-cyan-400 via-teal-500 to-cyan-600',
      borderGlow: 'border-cyan-300 shadow-cyan-500/20',
      accentColor: '#06B6D4',
      unlocked: totalQuestions >= 50,
      progress: { current: Math.min(50, totalQuestions), total: 50 },
      tier: 2
    },
    {
      id: 'knowza_legend',
      title: 'Knowza Efsanesi',
      desc: '1.000 XP barajını aşarak lig tablosunda zirveye yerleş!',
      category: 'Uzmanlık',
      icon: Crown,
      gradient: 'from-amber-300 via-yellow-500 to-amber-700',
      borderGlow: 'border-amber-300 shadow-amber-500/40',
      accentColor: '#D97706',
      unlocked: (stats.xp || 0) >= 1000,
      progress: { current: Math.min(1000, stats.xp || 0), total: 1000 },
      tier: 3
    },
    {
      id: 'arena_champion',
      title: 'Canlı Arena Şampiyonu',
      desc: 'Canlı Soru Arenası yarışmasında rakiplerini geride bırakıp 1. ol.',
      category: 'Düello',
      icon: Trophy,
      gradient: 'from-purple-500 via-indigo-600 to-purple-800',
      borderGlow: 'border-purple-300 shadow-purple-500/20',
      accentColor: '#8B5CF6',
      unlocked: (stats.duelWins || 0) >= 1,
      progress: { current: Math.min(3, stats.duelWins || 0), total: 3 },
      tier: 2
    },
    {
      id: 'duel_master',
      title: 'Düello Yenilmezi',
      desc: '1v1 Bilgi Düellosunda arka arkaya 5 galibiyet alarak ELO kazan.',
      category: 'Düello',
      icon: Swords,
      gradient: 'from-rose-500 via-red-600 to-rose-700',
      borderGlow: 'border-rose-300 shadow-rose-500/20',
      accentColor: '#EF4444',
      unlocked: false,
      progress: { current: 4, total: 5 },
      tier: 2
    },
    {
      id: 'grand_master',
      title: 'Büyük Üstat 13',
      desc: 'Seviye 13 e ulaş ve tüm temel YKS & LGS derslerini tamamla.',
      category: 'Uzmanlık',
      icon: Award,
      gradient: 'from-fuchsia-500 via-purple-600 to-indigo-700',
      borderGlow: 'border-fuchsia-300 shadow-fuchsia-500/30',
      accentColor: '#A855F7',
      unlocked: false,
      progress: { current: 12, total: 13 },
      tier: 3
    },
    {
      id: 'speed_demon',
      title: 'Işık Hızı',
      desc: '3 saniyenin altında cevaplayarak 10 soruda maksimum hız bonusu al.',
      category: 'Sınav',
      icon: Zap,
      gradient: 'from-yellow-400 via-orange-500 to-red-500',
      borderGlow: 'border-yellow-300 shadow-yellow-500/30',
      accentColor: '#F59E0B',
      unlocked: false,
      progress: { current: 7, total: 10 },
      tier: 2
    },
    {
      id: 'night_owl',
      title: 'Gece Kaşifi',
      desc: 'Gece 22:00 ile 04:00 saatleri arasında odaklanıp 3 test tamamla.',
      category: 'Seri',
      icon: Moon,
      gradient: 'from-indigo-600 via-slate-800 to-slate-950',
      borderGlow: 'border-indigo-400 shadow-indigo-500/30',
      accentColor: '#6366F1',
      unlocked: true,
      unlockedDate: '2 gün önce',
      tier: 1
    },
    {
      id: 'code_virtuoso',
      title: 'Kodlama Virtüözü',
      desc: 'Python Kod Lab ortamında tüm fonksiyon ve liste görevlerini çöz.',
      category: 'Uzmanlık',
      icon: Cpu,
      gradient: 'from-cyan-500 via-blue-600 to-slate-900',
      borderGlow: 'border-cyan-400 shadow-cyan-500/20',
      accentColor: '#06B6D4',
      unlocked: false,
      progress: { current: 2, total: 4 },
      tier: 2
    },
    {
      id: 'target_master',
      title: 'Hata Avcısı',
      desc: 'Hata Defterindeki 5 yanlışı tekrar çözerek öğrenimini pekiştir.',
      category: 'Sınav',
      icon: Target,
      gradient: 'from-emerald-500 via-green-600 to-teal-700',
      borderGlow: 'border-emerald-300 shadow-emerald-500/20',
      accentColor: '#10B981',
      unlocked: false,
      progress: { current: 3, total: 5 },
      tier: 1
    },
    {
      id: 'rocket_rank',
      title: 'Sınav Derecesi',
      desc: 'ÖSYM Deneme Simülatöründe %90 ve üzeri başarı yüzdesine ulaş.',
      category: 'Sınav',
      icon: Rocket,
      gradient: 'from-violet-600 via-purple-700 to-fuchsia-800',
      borderGlow: 'border-violet-300 shadow-violet-500/30',
      accentColor: '#7C3AED',
      unlocked: false,
      progress: { current: 1, total: 3 },
      tier: 3
    },
    {
      id: 'pure_heart',
      title: 'Altın Kalp',
      desc: 'Hiç can kaybetmeden arka arkaya 3 ünite testini hatasız bitir.',
      category: 'Başlangıç',
      icon: Heart,
      gradient: 'from-rose-400 via-pink-500 to-rose-600',
      borderGlow: 'border-pink-300 shadow-pink-500/20',
      accentColor: '#F43F5E',
      unlocked: true,
      unlockedDate: 'Dün',
      tier: 1
    }
  ];

  const categories = ['all', 'Başlangıç', 'Seri', 'Sınav', 'Düello', 'Uzmanlık'];
  const filteredBadges =
    filterCategory === 'all'
      ? badges
      : badges.filter((b) => b.category === filterCategory);

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="min-h-screen bg-[#FFFDF7] text-slate-800 pb-28 select-none">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-[#FFFDF7]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-amber-100/50">
        <button
          onClick={onBack}
          className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-amber-100/60 active:scale-95 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="text-center">
          <span className="text-base font-black text-slate-900 block leading-tight">Rozet Koleksiyonu</span>
          <span className="text-[10px] font-bold text-amber-600">
            {unlockedCount} / {badges.length} Kazanıldı
          </span>
        </div>
        <div className="w-10" />
      </div>

      <div className="max-w-md mx-auto px-4 pt-3 space-y-4">
        {/* Category Pills */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                sound.playClick();
                setFilterCategory(cat);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition active:scale-95 ${
                filterCategory === cat
                  ? 'bg-[#FFB800] text-slate-950 shadow-xs'
                  : 'bg-white border border-[#F2E8D5] text-slate-600 hover:bg-[#FFF9EC]'
              }`}
            >
              {cat === 'all' ? 'Tümü (15)' : cat}
            </button>
          ))}
        </div>

        {/* 3D Vector Badges Grid (3 Columns) */}
        <div className="grid grid-cols-3 gap-3">
          {filteredBadges.map((badge) => {
            const IconComponent = badge.icon;

            return (
              <button
                key={badge.id}
                onClick={() => {
                  sound.playClick();
                  setSelectedBadge(badge);
                }}
                className={`relative flex flex-col items-center p-3 rounded-3xl border transition-all active:scale-95 text-center ${
                  badge.unlocked
                    ? 'bg-white border-amber-200/80 shadow-[0_4px_16px_rgba(255,184,0,0.12)] hover:border-amber-400'
                    : 'bg-slate-50/80 border-slate-200/70 opacity-70 hover:opacity-90'
                }`}
              >
                {/* 3D Shield / Coin Container */}
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 mb-2 flex items-center justify-center">
                  {badge.unlocked ? (
                    <div
                      className={`w-full h-full rounded-2xl bg-gradient-to-br ${badge.gradient} p-0.5 shadow-md flex items-center justify-center transform hover:rotate-3 transition`}
                    >
                      <div className="w-full h-full rounded-[14px] bg-black/10 flex items-center justify-center relative overflow-hidden">
                        {/* Shimmer glint highlight */}
                        <div className="absolute -top-6 -left-6 w-12 h-12 bg-white/30 rounded-full blur-xs pointer-events-none" />
                        <IconComponent className="w-7 h-7 sm:w-8 sm:h-8 text-white filter drop-shadow-md" />
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 p-0.5 shadow-xs flex items-center justify-center">
                      <div className="w-full h-full rounded-[14px] bg-slate-100 flex items-center justify-center relative">
                        <IconComponent className="w-6 h-6 text-slate-400" />
                        <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[1px] rounded-[14px] flex items-center justify-center">
                          <Lock className="w-4 h-4 text-white" />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tier Stars on Unlocked */}
                  {badge.unlocked && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex items-center gap-0.5 bg-black/40 backdrop-blur-xs px-1.5 py-0.2 rounded-full shadow-xs">
                      {Array.from({ length: badge.tier }).map((_, i) => (
                        <span key={i} className="text-[8px] text-amber-300">★</span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Badge Title */}
                <span className="text-[11px] font-black text-slate-900 leading-snug line-clamp-2">
                  {badge.title}
                </span>

                {/* Subtext: Unlocked date or Progress */}
                <span className="text-[9px] font-bold text-slate-400 mt-1 truncate max-w-full">
                  {badge.unlocked ? (
                    <span className="text-emerald-600 font-extrabold">✓ Açıldı</span>
                  ) : badge.progress ? (
                    <span>{badge.progress.current}/{badge.progress.total}</span>
                  ) : (
                    <span>Kilitli</span>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        {/* Promo Bottom Card with Clean Transparent Mascot (Zero Cut-Offs) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FFF4DB] via-[#FFEBB8] to-[#FFDE8A] p-4 shadow-sm border border-amber-200/60 mt-4">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 relative">
              <img
                src="/assets/knowza_cheering.png"
                alt="Knowza Kutlama Maskotu"
                className="w-full h-full object-contain filter drop-shadow-md animate-bounceSubtle"
              />
            </div>
            <div className="flex-1">
              <span className="inline-block text-[10px] font-black uppercase text-[#8C6000] bg-white/50 px-2 py-0.5 rounded-full mb-1">
                Koleksiyonunu Tamamla
              </span>
              <h3 className="text-base font-black text-slate-900 leading-snug">
                Daha fazla rozet kazan!
              </h3>
              <p className="text-[11px] text-amber-950/80 font-bold mt-0.5">
                Test çöz, 1v1 kapış ve tüm 3D unvanların kilidini aç!
              </p>
              <button
                onClick={() => {
                  sound.playClick();
                  if (onNavigateToQuiz) onNavigateToQuiz();
                }}
                className="mt-2.5 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#FFB800] hover:bg-[#FFA500] text-slate-900 text-xs font-black shadow-sm active:scale-95 transition"
              >
                <span>Hemen Soru Çöz</span>
                <ChevronRight className="w-3.5 h-3.5 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-amber-100 text-center relative animate-pop"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Icon Display */}
            <div className="w-20 h-20 mx-auto mb-3 flex items-center justify-center">
              {selectedBadge.unlocked ? (
                <div
                  className={`w-full h-full rounded-2xl bg-gradient-to-br ${selectedBadge.gradient} p-1 shadow-lg flex items-center justify-center animate-bounceSubtle`}
                >
                  {React.createElement(selectedBadge.icon, {
                    className: 'w-10 h-10 text-white filter drop-shadow-md'
                  })}
                </div>
              ) : (
                <div className="w-full h-full rounded-2xl bg-slate-200 flex items-center justify-center">
                  <Lock className="w-8 h-8 text-slate-400" />
                </div>
              )}
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black mb-2 bg-amber-100 text-amber-900">
              {selectedBadge.unlocked ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kazanıldı ({selectedBadge.unlockedDate})</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kilitli • Seviye {selectedBadge.tier}</span>
                </>
              )}
            </div>

            <h3 className="text-xl font-black text-slate-900 mb-1">{selectedBadge.title}</h3>
            <p className="text-xs text-slate-600 mb-4 font-semibold">{selectedBadge.desc}</p>

            {selectedBadge.progress && (
              <div className="mb-4 bg-slate-50 rounded-2xl p-3 border border-slate-100">
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-1.5">
                  <span>İlerleme Durumu</span>
                  <span className="font-mono">
                    {selectedBadge.progress.current} / {selectedBadge.progress.total}
                  </span>
                </div>
                <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-400 to-[#FFB800] rounded-full transition-all"
                    style={{
                      width: `${(selectedBadge.progress.current / selectedBadge.progress.total) * 100}%`
                    }}
                  />
                </div>
              </div>
            )}

            <button
              onClick={() => {
                sound.playClick();
                setSelectedBadge(null);
              }}
              className="w-full py-3 rounded-2xl bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black text-sm shadow-md active:scale-95 transition"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default KnowzaBadges;
