import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Flame, Check, Trophy, Share2, TrendingUp, Target, BookOpen, Star } from 'lucide-react';
import { sound } from '../utils/audio';
import { getDisplayIdentity } from '../utils/accountStorage';

interface KnowzaStatsProps {
  onBack: () => void;
}

export const KnowzaStats: React.FC<KnowzaStatsProps> = ({ onBack }) => {
  const { stats } = useGame();

  const userLevel = Math.max(1, Math.floor((stats.xp || 0) / 100) + 1);
  const currentLevelXp = (stats.xp || 0) % 100;
  const xpPercent = Math.min(100, Math.round((currentLevelXp / 100) * 100));

  const totalAnswered = stats.totalQuestionsAnswered || 0;
  const completedCount = stats.completedLessons?.length || 0;
  const currentStreak = stats.streak || 0;

  // Real unlocked badges based on actual progress
  const badgesEarned = (completedCount > 0 ? 1 : 0) + 
    (currentStreak >= 3 ? 1 : 0) + 
    (totalAnswered >= 10 ? 1 : 0) + 
    (userLevel >= 2 ? 1 : 0) +
    (stats.xp >= 100 ? 1 : 0);

  // Weekly activity indicator based on real streak
  const days = ['Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt', 'Paz'];
  const todayIndex = (new Date().getDay() + 6) % 7; // Monday = 0, Sunday = 6

  const goalSubjectMap: Record<string, { name: string; icon: string }> = {
    yks: { name: 'YKS (TYT - AYT)', icon: '🎓' },
    lgs: { name: '8. Sınıf LGS', icon: '📚' },
    kpss: { name: 'KPSS 2026', icon: '🏛️' },
    kodlama: { name: 'Python & Kodlama', icon: '💻' },
    dil: { name: 'İngilizce & Dil', icon: '🌐' }
  };

  const activeGoal = goalSubjectMap[stats.targetGoal || 'yks'] || goalSubjectMap.yks;

  return (
    <div className="flex-1 max-w-md mx-auto px-4 py-4 space-y-4 pb-28 select-none animate-fade">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="w-10 h-10 rounded-full bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] active:scale-90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-base font-black text-[#2A1E00] flex items-center gap-1.5">
          <span>Öğrenim İstatistiklerin</span>
        </h1>

        <button
          onClick={() => sound.playClick()}
          className="w-10 h-10 rounded-full bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] active:scale-90 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* User Progress Header Card */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#FFE2A3] shadow-[0_8px_24px_rgba(255,184,0,0.1)] flex items-center gap-4">
        <div className="w-14 h-14 rounded-full border-2 border-[#FFB800] p-1 bg-[#FFF8E7] overflow-hidden flex-shrink-0 flex items-center justify-center">
          <img 
            src="/assets/knowza_avatar_3d.png" 
            alt="Knowza Profil" 
            className="w-full h-full object-contain"
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-black text-[#2A1E00] truncate">{getDisplayIdentity(stats).primary}</h2>
          <div className="text-xs font-black text-[#D98200] mt-0.5">Seviye {userLevel}</div>

          {/* Level Progress Bar */}
          <div className="mt-1.5">
            <div className="bg-[#F5EEDD] h-2.5 rounded-full overflow-hidden p-0.5 border border-[#E8DFC8]">
              <div 
                className="bg-gradient-to-r from-[#FFC700] to-[#FFB800] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: `${Math.max(5, xpPercent)}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-[#8C7A5E] mt-1 font-mono">
              <span>Seviye İlerlemesi</span>
              <span>{currentLevelXp} / 100 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Stats */}
      <div className="grid grid-cols-3 gap-2">
        
        {/* Metric 1: Gün Serisi */}
        <div className="bg-white rounded-2xl p-3 border border-[#F2E8D5] shadow-xs flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-[#FFF2D6] flex items-center justify-center mb-1">
            <Flame className="w-4 h-4 fill-[#FF8A00] text-[#FF8A00]" />
          </div>
          <span className="text-lg font-black text-[#2A1E00]">{currentStreak}</span>
          <span className="text-[10px] font-bold text-[#8C7A5E]">Günlük Seri</span>
        </div>

        {/* Metric 2: Çözülen Soru */}
        <div className="bg-white rounded-2xl p-3 border border-[#F2E8D5] shadow-xs flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-[#EBFBE5] flex items-center justify-center mb-1">
            <Check className="w-4 h-4 stroke-[3] text-[#58CC02]" />
          </div>
          <span className="text-lg font-black text-[#2A1E00]">{totalAnswered}</span>
          <span className="text-[10px] font-bold text-[#8C7A5E]">Çözülen Soru</span>
        </div>

        {/* Metric 3: Kazanılan Rozet */}
        <div className="bg-white rounded-2xl p-3 border border-[#F2E8D5] shadow-xs flex flex-col items-center text-center">
          <div className="w-9 h-9 rounded-xl bg-[#FFF5D9] flex items-center justify-center mb-1">
            <Trophy className="w-4 h-4 fill-[#FFB800] text-[#FFB800]" />
          </div>
          <span className="text-lg font-black text-[#2A1E00]">{badgesEarned}</span>
          <span className="text-[10px] font-bold text-[#8C7A5E]">Kazanılan Rozet</span>
        </div>

      </div>

      {/* Başarı Grafiği (Weekly Bar Chart) */}
      <div className="bg-white rounded-3xl p-4 sm:p-5 border-2 border-[#FFE2A3] shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-black text-[#2A1E00] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#FFB800]" />
            <span>Haftalık Çalışma Aktivitesi</span>
          </h3>
          <span className="text-[9px] font-black uppercase text-[#8C7A5E] bg-[#FFF8E7] px-2 py-0.5 rounded-full">
            Bu Hafta
          </span>
        </div>

        {/* Column Bars */}
        <div className="flex items-end justify-between h-28 pt-2 px-1">
          {days.map((d, i) => {
            const isToday = i === todayIndex;
            const hasActivity = isToday ? (stats.dailyQuestProgress.completedLessonsToday > 0 || currentStreak > 0) : (i < todayIndex && currentStreak > (todayIndex - i));
            return (
              <div key={i} className="flex flex-col items-center gap-1.5 flex-1">
                <div
                  className={`w-6 rounded-xl transition-all duration-300 ${
                    hasActivity 
                      ? 'h-16 bg-gradient-to-t from-[#FFB800] to-[#FFD54F] shadow-xs ring-2 ring-[#FFB800]/40' 
                      : 'h-6 bg-slate-100'
                  }`}
                />
                <span className={`text-[10px] font-black ${isToday ? 'text-amber-600' : 'text-slate-400'}`}>
                  {d}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Aktif Sınav Hedefi Kartı */}
      <div className="bg-white rounded-3xl p-4 border border-[#F2E8D5] shadow-xs space-y-2">
        <h3 className="text-[11px] font-black uppercase text-[#8C7A5E]">
          Öncelikli Sınav Alanın
        </h3>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{activeGoal.icon}</span>
            <div>
              <div className="font-black text-sm text-[#2A1E00]">{activeGoal.name}</div>
              <div className="text-[11px] text-[#8C7A5E] font-bold">
                {completedCount} Ders Tamamlandı • {stats.xp || 0} XP
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="font-black text-xs text-[#2A1E00] bg-[#FFF8E7] border border-[#FFE2A3] px-2.5 py-1 rounded-full">
              {stats.dailyQuestProgress.completedLessonsToday} Bugün Çözüldü
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
