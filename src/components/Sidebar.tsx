import React from 'react';
import { Map, Flame, Swords, Bot, BookMarked, Mic, Clock, Gamepad2, Code2, FileText, Tv, Trophy, Target, ShoppingBag, User } from 'lucide-react';
import { HariboAvatar } from './HariboAvatar';

export type NavTab = 'learn' | 'reels' | 'duel' | 'aicoach' | 'errors' | 'speech' | 'countdown' | 'games' | 'codelab' | 'exams' | 'study' | 'leaderboard' | 'quests' | 'shop' | 'profile';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const menuItems = [
    { id: 'learn', label: 'ÖĞREN', icon: Map, color: 'text-green-500' },
    { id: 'reels', label: 'SORU KAYDIR 🔥', icon: Flame, color: 'text-orange-500' },
    { id: 'duel', label: '1v1 DÜELLO', icon: Swords, color: 'text-red-500' },
    { id: 'aicoach', label: 'HARİBO AI KOÇ', icon: Bot, color: 'text-amber-500' },
    { id: 'errors', label: 'HATA DEFTERİ', icon: BookMarked, color: 'text-rose-500' },
    { id: 'speech', label: 'SESLİ PRATİK', icon: Mic, color: 'text-cyan-500' },
    { id: 'countdown', label: 'SINAV SAYACI', icon: Clock, color: 'text-violet-500' },
    { id: 'games', label: 'MİNİ OYUNLAR', icon: Gamepad2, color: 'text-pink-500' },
    { id: 'codelab', label: 'KOD LAB', icon: Code2, color: 'text-purple-500' },
    { id: 'exams', label: 'DENEMELER', icon: FileText, color: 'text-teal-500' },
    { id: 'study', label: 'ÇALIŞMA ODASI', icon: Tv, color: 'text-indigo-500' },
    { id: 'leaderboard', label: 'LİDERLİK', icon: Trophy, color: 'text-yellow-500' },
    { id: 'quests', label: 'GÖREVLER', icon: Target, color: 'text-blue-500' },
    { id: 'shop', label: 'MAĞAZA', icon: ShoppingBag, color: 'text-orange-500' },
    { id: 'profile', label: 'PROFİL', icon: User, color: 'text-slate-600' },
  ];

  return (
    <aside className="hidden md:flex md:w-64 bg-white dark:bg-[#1a2c35] border-r-2 border-gray-200 dark:border-[#2b3d45] min-h-[calc(100vh-61px)] p-3 flex-col justify-between select-none flex-shrink-0 transition-colors duration-300">
      <div className="space-y-1">
        
        {/* Brand Logo with Custom Yellow Haribo Mascot */}
        <div className="hidden md:flex items-center gap-3 px-3 py-2 mb-2">
          <HariboAvatar size="md" animate={true} />
          <div>
            <h1 className="text-2xl font-black tracking-tight text-[#58cc02] leading-none">
              Akademi<span className="text-[#1cb0f6]">GO</span>
            </h1>
            <span className="text-[10px] font-black uppercase text-amber-500 dark:text-amber-400 tracking-wider font-mono">
              Haribo Altın Maskot 🍯
            </span>
          </div>
        </div>

        {/* Navigation Items (Scrollable if needed on smaller height) */}
        <nav className="space-y-1 max-h-[calc(100vh-180px)] overflow-y-auto pr-1 scrollbar-none">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id as NavTab)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-2xl font-black text-xs tracking-wide transition-all ${
                  isActive
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-2 border-[#1cb0f6] text-[#1cb0f6] shadow-sm'
                    : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#20343f] border-2 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                }`}
                title={item.label}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-[#1cb0f6]' : item.color}`} />
                <span className="hidden md:inline font-black text-xs">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Mini Footer Mascot Info */}
      <div className="hidden md:block bg-gradient-to-br from-amber-50 to-orange-100 border-2 border-amber-200 rounded-2xl p-2.5 text-center mt-2">
        <div className="text-xs font-black text-amber-900">Chess ELO + Haribo AI 🚀</div>
        <div className="text-[10px] text-amber-800 font-semibold mt-0.5">
          Günde 15 dk ile hedefe ulaş!
        </div>
      </div>
    </aside>
  );
};
