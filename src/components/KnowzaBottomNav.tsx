import React from 'react';
import { Home, BarChart2, ShoppingBag, Award, User } from 'lucide-react';
import { sound } from '../utils/audio';

export type KnowzaTab =
  | 'home'
  | 'stats'
  | 'shop'
  | 'badges'
  | 'profile'
  | 'kahoot'
  | 'duel'
  | 'reels'
  | 'aicoach'
  | 'exams'
  | 'countdown'
  | 'errors'
  | 'codelab'
  | 'learn'
  | 'widgets';

interface KnowzaBottomNavProps {
  currentTab: KnowzaTab;
  onSelectTab: (tab: KnowzaTab) => void;
}

export const KnowzaBottomNav: React.FC<KnowzaBottomNavProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as const, label: 'Ana Sayfa', icon: Home },
    { id: 'stats' as const, label: 'İstatistik', icon: BarChart2 },
    { id: 'shop' as const, label: 'Mağaza', icon: ShoppingBag, hasBadge: true },
    { id: 'badges' as const, label: 'Rozetler', icon: Award },
    { id: 'profile' as const, label: 'Profil', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#F2E8D5] px-2 sm:px-4 py-2 pb-[max(0.6rem,env(safe-area-inset-bottom))] shadow-[0_-4px_20px_rgba(0,0,0,0.04)] select-none">
      <div className="max-w-md mx-auto flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                onSelectTab(tab.id);
              }}
              className={`flex-1 flex flex-col items-center py-1 transition-all active:scale-90 ${
                isActive ? 'text-[#FFB800]' : 'text-[#A0988A] hover:text-[#70685A]'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-6 h-6 transition-all ${
                    isActive ? 'stroke-[2.8] drop-shadow-sm text-[#FFB800]' : 'stroke-[2]'
                  }`}
                />
                {tab.hasBadge && (
                  <span className="absolute -top-1.5 -right-2 bg-gradient-to-r from-amber-500 to-yellow-400 text-white text-[8px] font-black px-1 rounded-full shadow-xs">
                    💎
                  </span>
                )}
                {isActive && (
                  <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#FFB800]" />
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight mt-1 ${
                  isActive ? 'font-black text-[#FFB800]' : 'font-bold text-[#A0988A]'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
