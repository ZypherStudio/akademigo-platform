import React from 'react';
import { useGame } from '../context/GameContext';
import { Target, CheckCircle2, Sparkles, Gem, Award } from 'lucide-react';

export const Quests: React.FC = () => {
  const { stats } = useGame();

  const quests = [
    {
      id: 'q1',
      title: 'Günün İlk Dersi',
      description: 'Bugün en az 1 ders veya pratik tamamla',
      current: stats.dailyQuestProgress.completedLessonsToday,
      total: 1,
      rewardGems: 10,
      rewardXp: 15,
      icon: '🎯'
    },
    {
      id: 'q2',
      title: 'XP Avcısı',
      description: 'Derslerden ve testlerden toplam 50 XP topla',
      current: Math.min(50, stats.dailyQuestProgress.xpGainedToday),
      total: 50,
      rewardGems: 15,
      rewardXp: 25,
      icon: '⚡'
    },
    {
      id: 'q3',
      title: 'Kusursuz Odaklanma',
      description: 'Hatasız (%100 doğrulukla) 1 ders bitir',
      current: stats.dailyQuestProgress.perfectLessonsToday,
      total: 1,
      rewardGems: 20,
      rewardXp: 30,
      icon: '🏆'
    }
  ];

  return (
    <div className="flex-1 max-w-2xl mx-auto py-6 px-4 space-y-6 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-3xl p-6 text-white text-center shadow-lg">
        <div className="text-5xl mb-2">🎯</div>
        <h2 className="text-2xl sm:text-3xl font-black">Günlük Görevler</h2>
        <p className="text-white/80 text-xs sm:text-sm font-semibold mt-1">
          Her gün yenilenen görevleri tamamla, ekstra XP ve elmas kazan!
        </p>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {quests.map(quest => {
          const isDone = quest.current >= quest.total;
          const pct = Math.min(100, Math.round((quest.current / quest.total) * 100));

          return (
            <div
              key={quest.id}
              className={`bg-white rounded-3xl p-5 border-2 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                isDone ? 'border-green-300 bg-green-50/30' : 'border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl select-none">{quest.icon}</div>
                <div>
                  <h4 className="font-extrabold text-base text-gray-800">{quest.title}</h4>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">{quest.description}</p>
                  
                  {/* Progress bar */}
                  <div className="flex items-center gap-3 mt-3">
                    <div className="w-36 sm:w-48 bg-gray-200 h-3 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isDone ? 'bg-[#58cc02]' : 'bg-[#1cb0f6]'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="text-xs font-black text-gray-600">
                      {quest.current}/{quest.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reward status */}
              <div className="flex items-center justify-end gap-2">
                {isDone ? (
                  <div className="flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1.5 rounded-xl font-black text-xs">
                    <CheckCircle2 className="w-4 h-4 stroke-[3]" />
                    TAMAMLANDI
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs font-black text-gray-500 bg-gray-100 px-3 py-1.5 rounded-xl">
                    <span>+{quest.rewardXp} XP</span>
                    <span className="text-blue-500">💎 +{quest.rewardGems}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
