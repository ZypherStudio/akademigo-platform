import React, { useState } from 'react';
import { ArrowLeft, SlidersHorizontal, Award, Lock, Sparkles, CheckCircle2, ChevronRight } from 'lucide-react';

interface KnowzaBadgesProps {
  onBack?: () => void;
  onNavigateToQuiz?: () => void;
}

interface BadgeItem {
  id: string;
  title: string;
  desc: string;
  image: string;
  unlocked: boolean;
  unlockedDate?: string;
  progress?: { current: number; total: number };
}

export const KnowzaBadges: React.FC<KnowzaBadgesProps> = ({ onBack, onNavigateToQuiz }) => {
  const [selectedBadge, setSelectedBadge] = useState<BadgeItem | null>(null);

  const badges: BadgeItem[] = [
    {
      id: 'first_lesson',
      title: 'İlk Ders Tamamlandı',
      desc: 'Knowza ile ilk dersini başarıyla bitirdin!',
      image: '/assets/badge_book.png',
      unlocked: true,
      unlockedDate: '3 gün önce'
    },
    {
      id: 'streak_master',
      title: 'Günlük Seri Ustası',
      desc: 'Üst üste 7 gün boyunca her gün en az 1 ders çözdün.',
      image: '/assets/badge_fire.png',
      unlocked: true,
      unlockedDate: 'Dün'
    },
    {
      id: 'level_5',
      title: '5 Seviye Atlama',
      desc: 'Bilgini katlayarak 5. seviyeye ulaştın.',
      image: '/assets/badge_star.png',
      unlocked: true,
      unlockedDate: 'Geçen hafta'
    },
    {
      id: 'lang_expert',
      title: 'Dil Uzmanı',
      desc: 'Farklı dillerde 100 kelimeyi hatasız tamamla.',
      image: '/assets/badge_globe.png',
      unlocked: true,
      unlockedDate: 'Bugün'
    },
    {
      id: 'knowledge_hunter',
      title: 'Bilgi Avcısı',
      desc: 'Zorlu sorularda 50 doğru cevap ver.',
      image: '/assets/badge_search.png',
      unlocked: true,
      unlockedDate: 'Bugün'
    },
    {
      id: 'knowza_legend',
      title: 'Knowza Efsanesi',
      desc: '10. seviyeyi geç ve liderlik tablosunda ilk 3 e gir!',
      image: '/assets/badge_crown.png',
      unlocked: true,
      unlockedDate: 'Yeni!'
    },
    {
      id: 'kahoot_champion',
      title: 'Kahoot Fatihi',
      desc: 'Canlı KahootGO yarışmasında 1. ol.',
      image: '/assets/badge_star.png',
      unlocked: false,
      progress: { current: 3, total: 5 }
    },
    {
      id: 'duel_master',
      title: 'Düello Yenilmezi',
      desc: '1v1 Düelloda arka arkaya 5 galibiyet al.',
      image: '/assets/badge_fire.png',
      unlocked: false,
      progress: { current: 4, total: 5 }
    },
    {
      id: 'grand_master',
      title: 'Büyük Üstat 13',
      desc: 'Seviye 13 e ulaş ve tüm temel dersleri tamamla.',
      image: '/assets/badge_crown.png',
      unlocked: false,
      progress: { current: 12, total: 13 }
    }
  ];

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
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Rozetler</h1>
        <button className="w-10 h-10 rounded-full flex items-center justify-center text-slate-700 hover:bg-amber-100/60 active:scale-95 transition">
          <SlidersHorizontal className="w-5 h-5" />
        </button>
      </div>

      <div className="max-w-md mx-auto px-5 pt-4 space-y-6">
        {/* Badges Grid (3 columns matching Screen 6) */}
        <div className="grid grid-cols-3 gap-3.5">
          {badges.map((badge) => (
            <button
              key={badge.id}
              onClick={() => setSelectedBadge(badge)}
              className={`group flex flex-col items-center text-center p-2.5 rounded-2xl transition duration-200 active:scale-95 ${
                badge.unlocked
                  ? 'hover:bg-amber-50/80'
                  : 'opacity-60 hover:opacity-80'
              }`}
            >
              <div className="relative w-16 h-16 mb-2 flex items-center justify-center">
                <img
                  src={badge.image}
                  alt={badge.title}
                  className={`w-full h-full object-contain filter drop-shadow-md transition-transform duration-300 group-hover:scale-110 ${
                    badge.unlocked ? '' : 'grayscale contrast-75'
                  }`}
                />
                {!badge.unlocked && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-xl backdrop-blur-[1px]">
                    <Lock className="w-4 h-4 text-white drop-shadow" />
                  </div>
                )}
              </div>
              <span className="text-[12px] font-semibold text-slate-800 leading-tight line-clamp-2">
                {badge.title}
              </span>
            </button>
          ))}
        </div>

        {/* Promo Bottom Card: Mascot with Trophy (Screen 6 design) */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#FFF4DB] via-[#FFEBB8] to-[#FFDE8A] p-4 shadow-sm border border-amber-200/60">
          <div className="flex items-center justify-between gap-2">
            <div className="w-24 h-24 flex-shrink-0 relative">
              <img
                src="/assets/knowza_trophy_mascot.png"
                alt="Knowza Trophy Bear"
                className="w-full h-full object-contain filter drop-shadow-md transform -scale-x-100"
                onError={(e) => {
                  // Fallback to knowza_cheering if trophy mascot has border issues
                  (e.target as HTMLImageElement).src = '/assets/knowza_cheering.png';
                }}
              />
            </div>
            <div className="flex-1 pl-2">
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                Daha fazla rozet kazan!
              </h3>
              <p className="text-xs text-amber-900/80 font-medium mt-1">
                Ders çöz, serilerini koru ve yeni 3D unvanların kilidini aç!
              </p>
              <button
                onClick={onNavigateToQuiz}
                className="mt-3 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#FFB800] hover:bg-[#FFA500] text-slate-900 text-xs font-bold shadow-sm transition active:scale-95"
              >
                <span>Hemen Soru Çöz</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Badge Detail Modal */}
      {selectedBadge && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in"
          onClick={() => setSelectedBadge(null)}
        >
          <div
            className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-amber-100 text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-24 h-24 mx-auto mb-3 flex items-center justify-center">
              <img
                src={selectedBadge.image}
                alt={selectedBadge.title}
                className={`w-full h-full object-contain filter drop-shadow-lg ${
                  selectedBadge.unlocked ? 'animate-bounce-subtle' : 'grayscale'
                }`}
              />
            </div>

            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold mb-2 bg-amber-100 text-amber-900">
              {selectedBadge.unlocked ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kazanıldı ({selectedBadge.unlockedDate})</span>
                </>
              ) : (
                <>
                  <Lock className="w-3.5 h-3.5 text-slate-500" />
                  <span>Kilitli</span>
                </>
              )}
            </div>

            <h3 className="text-xl font-extrabold text-slate-900 mb-1">{selectedBadge.title}</h3>
            <p className="text-sm text-slate-600 mb-4">{selectedBadge.desc}</p>

            {selectedBadge.progress && (
              <div className="mb-4 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>İlerleme</span>
                  <span>
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
              onClick={() => setSelectedBadge(null)}
              className="w-full py-3 rounded-2xl bg-[#FFB800] hover:bg-[#FFA500] text-slate-900 font-extrabold text-sm shadow-md active:scale-95 transition"
            >
              Tamam
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
