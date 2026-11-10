import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Target, ArrowRight, Gamepad2, Code2, Sparkles } from 'lucide-react';
import { NavTab } from './Sidebar';
import { Mascot } from './Mascot';
import { KnowzaAvatar } from './KnowzaAvatar';

interface RightSidebarProps {
  onNavigate: (tab: NavTab) => void;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ onNavigate }) => {
  const { stats, leaderboard } = useGame();

  const userRank = leaderboard.findIndex(u => u.isCurrentUser) + 1;

  return (
    <aside className="hidden xl:block w-80 space-y-5 p-4 select-none">
      
      {/* Custom Animated Mascot "Knowza Ayıcık" Card */}
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm flex flex-col items-center text-center transition-colors duration-300">
        <Mascot
          size="md"
          mood="idle"
          costume={stats.selectedCostume}
          speech="Günde 5 soru çöz, şampiyonlar ligine tırman! 🍯✨"
        />
        <span className="text-[10px] font-black uppercase text-amber-500 dark:text-amber-400 mt-2">
          Knowza 3D Maskot'a tıkla, taktik al!
        </span>
      </div>

      {/* Mini Games & Coddy Quick Access Promo Card */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-4 text-white shadow-md space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <h4 className="font-black text-xs uppercase tracking-wider">Hızlı Eğitici Odalar</h4>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onNavigate('games')}
            className="bg-white/20 hover:bg-white/30 p-2.5 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 border border-white/10"
          >
            <Gamepad2 className="w-5 h-5 text-amber-300 mb-1" />
            <span className="font-black text-xs">Mini Oyunlar</span>
            <span className="text-[9px] text-white/80">Morpa Stili</span>
          </button>

          <button
            onClick={() => onNavigate('codelab')}
            className="bg-white/20 hover:bg-white/30 p-2.5 rounded-2xl flex flex-col items-center text-center transition-all active:scale-95 border border-white/10"
          >
            <Code2 className="w-5 h-5 text-cyan-300 mb-1" />
            <span className="font-black text-xs">KodLab</span>
            <span className="text-[9px] text-white/80">Coddy Stili</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Preview Card */}
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-3 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h4 className="font-black text-sm text-gray-800 dark:text-gray-100">Elmas Ligi</h4>
          </div>
          <button
            onClick={() => onNavigate('leaderboard')}
            className="text-xs font-black text-[#1cb0f6] hover:underline flex items-center gap-0.5"
          >
            LİSTE <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="bg-blue-50/60 dark:bg-blue-950/40 rounded-2xl p-3 border border-blue-100 dark:border-blue-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="font-black text-blue-600 dark:text-blue-300 text-sm">#{userRank}</span>
            <KnowzaAvatar size="xs" costume={stats.selectedCostume} />
            <div>
              <div className="text-xs font-black text-gray-800 dark:text-gray-100">Sen</div>
              <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400">Terfi Hattındasın</div>
            </div>
          </div>
          <span className="font-black text-xs text-gray-700 dark:text-gray-300">{stats.xp} XP</span>
        </div>
      </div>

      {/* Daily Quests Mini Preview */}
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-3 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-blue-500" />
            <h4 className="font-black text-sm text-gray-800 dark:text-gray-100">Günün Görevleri</h4>
          </div>
          <button
            onClick={() => onNavigate('quests')}
            className="text-xs font-black text-[#1cb0f6] hover:underline flex items-center gap-0.5"
          >
            TÜMÜ <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2">
          <div className="text-xs">
            <div className="flex justify-between font-bold text-gray-600 dark:text-gray-300 mb-1">
              <span>Günün Dersi</span>
              <span className="font-black">{stats.dailyQuestProgress.completedLessonsToday}/1</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#58cc02] h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, stats.dailyQuestProgress.completedLessonsToday * 100)}%` }}
              />
            </div>
          </div>

          <div className="text-xs">
            <div className="flex justify-between font-bold text-gray-600 dark:text-gray-300 mb-1">
              <span>50 XP Topla</span>
              <span className="font-black">{stats.dailyQuestProgress.xpGainedToday}/50</span>
            </div>
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-[#1cb0f6] h-full rounded-full transition-all"
                style={{ width: `${Math.min(100, (stats.dailyQuestProgress.xpGainedToday / 50) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Streak Freeze Card */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/40 dark:to-indigo-950/40 border-2 border-blue-200 dark:border-blue-800 rounded-3xl p-4 flex items-center gap-3">
        <div className="text-3xl select-none">❄️</div>
        <div>
          <div className="text-xs font-black text-blue-900 dark:text-blue-200">Seri Koruması Aktif</div>
          <div className="text-[11px] text-blue-700 dark:text-blue-300 font-semibold">
            {stats.inventory.streakFreeze} adet seri dondurucun bulunuyor.
          </div>
        </div>
      </div>

    </aside>
  );
};
