import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Medal, Sparkles, TrendingUp } from 'lucide-react';
import { KnowzaAvatar } from './KnowzaAvatar';

export const Leaderboard: React.FC = () => {
  const { leaderboard, stats } = useGame();

  return (
    <div className="flex-1 max-w-2xl mx-auto py-6 px-4 space-y-6 pb-24">
      
      {/* League Header */}
      <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-6 text-white text-center shadow-lg relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          Haftalık Yarış
        </div>
        <div className="text-5xl mb-1">💎</div>
        <h2 className="text-2xl sm:text-3xl font-black">Elmas Ligi</h2>
        <p className="text-white/80 text-xs sm:text-sm font-semibold mt-1">
          Haftayı ilk 3 sırada tamamlayan öğrenciler efsanevi Elmas Rozeti kazanır!
        </p>
      </div>

      {/* Promotion Zone Alert */}
      <div className="bg-green-50 dark:bg-green-950/40 border-2 border-green-200 dark:border-green-800 rounded-2xl p-3.5 flex items-center gap-3 text-xs font-bold text-green-800 dark:text-green-300">
        <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
        <span>İlk 3 sıra bir üst Şampiyonlar Ligine terfi eder. Son 2 sıra küme düşer.</span>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm overflow-hidden divide-y-2 divide-gray-100 dark:divide-[#2b3d45] transition-colors duration-300">
        {leaderboard.map((user, index) => {
          const rank = index + 1;
          const isTop3 = rank <= 3;

          return (
            <div
              key={user.id}
              className={`flex items-center justify-between p-4 transition-colors ${
                user.isCurrentUser
                  ? 'bg-blue-50/80 dark:bg-blue-950/40 font-black'
                  : 'hover:bg-gray-50 dark:hover:bg-[#20343f]'
              }`}
            >
              {/* Rank & User Info */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Rank number or medal */}
                <div className="w-8 flex items-center justify-center">
                  {rank === 1 ? (
                    <span className="text-2xl">🥇</span>
                  ) : rank === 2 ? (
                    <span className="text-2xl">🥈</span>
                  ) : rank === 3 ? (
                    <span className="text-2xl">🥉</span>
                  ) : (
                    <span className="font-black text-gray-400 text-base">{rank}</span>
                  )}
                </div>

                {/* Avatar */}
                <div className="w-11 h-11 rounded-2xl bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 flex items-center justify-center text-2xl select-none p-1">
                  {user.isCurrentUser && (stats.avatar === 'haribo' || stats.avatar === 'owl' || !stats.avatar) ? (
                    <KnowzaAvatar size="sm" costume={stats.selectedCostume} />
                  ) : (
                    user.avatar
                  )}
                </div>

                {/* Name */}
                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-sm ${user.isCurrentUser ? 'text-blue-600 dark:text-blue-400 font-black' : 'text-gray-800 dark:text-gray-100 font-extrabold'}`}>
                      {user.name}
                    </span>
                    {user.isCurrentUser && (
                      <span className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-black px-1.5 py-0.5 rounded-md uppercase">
                        Sen
                      </span>
                    )}
                  </div>
                  {isTop3 && (
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wide">
                      ⭐ Terfi Bölgesi
                    </span>
                  )}
                </div>
              </div>

              {/* XP */}
              <div className="text-right">
                <span className="font-black text-sm text-gray-700 dark:text-gray-200">{user.xp}</span>
                <span className="text-xs font-bold text-gray-400 dark:text-gray-500 ml-1">XP</span>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
