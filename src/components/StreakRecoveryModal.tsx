import React, { useState } from 'react';
import { Flame, RotateCcw, Sparkles, X } from 'lucide-react';
import { useGame } from '../context/GameContext';

export const StreakRecoveryModal: React.FC = () => {
  const { stats, remainingStreakRestores, restoreBrokenStreak, dismissBrokenStreak, appLang } = useGame();
  const [restoredBanner, setRestoredBanner] = useState<{
    streak: number;
    remaining: number;
  } | null>(null);

  const brokenValue = stats.brokenStreakValue || 0;

  if (restoredBanner) {
    return (
      <div className="fixed inset-0 z-[130] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade">
        <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border-2 border-amber-300 space-y-4">
          <div className="w-24 h-24 mx-auto">
            <img src="/assets/knowza_cheering.png" alt="Knowza Ayı" className="w-full h-full object-contain" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-black">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{appLang === 'tr' ? 'Serin Kurtarıldı!' : 'Streak Restored!'}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            🔥 {restoredBanner.streak} {appLang === 'tr' ? 'Günlük Seri Devam Ediyor!' : 'Day Streak Saved!'}
          </h3>
          <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-sm font-black text-amber-950">
            🐻 {appLang === 'tr'
              ? `Bu yıl ${restoredBanner.remaining} seri geri yükleme hakkın kaldı!`
              : `You have ${restoredBanner.remaining} streak restore(s) left this year!`}
          </div>
          <button
            onClick={() => setRestoredBanner(null)}
            className="w-full py-3.5 rounded-2xl bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all"
          >
            {appLang === 'tr' ? 'Harika, Devam Et!' : 'Awesome, Continue!'}
          </button>
        </div>
      </div>
    );
  }

  if (brokenValue <= 0) return null;

  const canRestore = remainingStreakRestores > 0;

  const handleRestore = () => {
    const res = restoreBrokenStreak();
    if (res.success) {
      setRestoredBanner({ streak: brokenValue, remaining: res.remaining });
    }
  };

  return (
    <div className="fixed inset-0 z-[130] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade">
      <div className="w-full max-w-sm rounded-3xl bg-white p-6 text-center shadow-2xl border-2 border-orange-300 space-y-4 relative">
        <button
          onClick={dismissBrokenStreak}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-24 h-24 mx-auto">
          <img src="/assets/knowza_thinking.png" alt="Knowza Ayı" className="w-full h-full object-contain" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-orange-100 text-orange-800 text-xs font-black">
            <Flame className="w-3.5 h-3.5 fill-orange-500 text-orange-600" />
            <span>{appLang === 'tr' ? 'Seri Tehlikede!' : 'Streak Lost!'}</span>
          </div>
          <h3 className="text-xl font-black text-slate-900">
            {appLang === 'tr'
              ? `${brokenValue} Günlük Serin Bozuldu!`
              : `Your ${brokenValue}-Day Streak Broke!`}
          </h3>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">
            {canRestore
              ? appLang === 'tr'
                ? `Yılda 3 kez seri geri yükleme hakkın var. Şimdi kullanırsan bu yıl ${remainingStreakRestores - 1} hakkın kalacak.`
                : `You get 3 streak restores per year. Using one now leaves ${remainingStreakRestores - 1} remaining this year.`
              : appLang === 'tr'
              ? 'Bu yılki 3 seri geri yükleme hakkını da kullandın. Serin sıfırlandı, yeniden başlayabilirsin!'
              : 'You have used all 3 streak restores for this year. Your streak has reset to 0.'}
          </p>
        </div>

        <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs font-black text-amber-900">
          <span>🐻 {appLang === 'tr' ? 'Yıllık Kurtarma Hakkı:' : 'Annual Restore Rights:'}</span>
          <span className="px-2.5 py-0.5 rounded-full bg-amber-200 text-amber-950">
            {remainingStreakRestores} / 3
          </span>
        </div>

        <div className="space-y-2">
          {canRestore && (
            <button
              onClick={handleRestore}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-slate-950 font-black text-sm border-b-4 border-[#CC7000] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <RotateCcw className="w-4 h-4 stroke-[2.5]" />
              <span>
                {appLang === 'tr'
                  ? `Seriyi Geri Yükle (${remainingStreakRestores}/3 Hak)`
                  : `Restore Streak (${remainingStreakRestores}/3 Left)`}
              </span>
            </button>
          )}
          <button
            onClick={dismissBrokenStreak}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 font-black text-xs transition"
          >
            {canRestore
              ? appLang === 'tr'
                ? 'Hayır, Sıfırdan Başla'
                : 'No, Start Fresh'
              : appLang === 'tr'
              ? 'Tamam, Yeniden Başla'
              : 'Okay, Start Fresh'}
          </button>
        </div>
      </div>
    </div>
  );
};
