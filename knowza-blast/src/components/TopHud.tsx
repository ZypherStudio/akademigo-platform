import React from 'react';
import { Settings, Plus, Star, Heart, Mail } from 'lucide-react';
import { PlayerProgress } from '../types/game';
import { getNextHeartSeconds, xpForNextLevel } from '../utils/storage';
import { sfx } from '../utils/sound';
import { KnowzaSprite } from './KnowzaSprite';

interface TopHudProps {
  progress: PlayerProgress;
  onOpenProfile: () => void;
  onOpenShop: (tab?: 'boosters' | 'coins') => void;
  onOpenQuests?: () => void;
  onOpenSettings: () => void;
  mode: 'home' | 'map' | 'game';
}

export const TopHud: React.FC<TopHudProps> = ({
  progress,
  onOpenProfile,
  onOpenShop,
  onOpenQuests,
  onOpenSettings,
  mode
}) => {
  const nextXp = xpForNextLevel(progress.level);
  const xpPct = Math.min(100, Math.round((progress.xp / nextXp) * 100));
  const heartSecs = getNextHeartSeconds(progress);
  const unclaimedQuests = progress.quests.filter((q) => !q.claimed && q.progress >= q.target).length;

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <header className="absolute top-0 left-0 right-0 z-30 px-2.5 pt-2 pb-1 flex items-center justify-between gap-1.5 pointer-events-none">
      {/* Close-up Knowza Portrait overlapping Glossy Wood Nameplate + XP Bar */}
      <button
        type="button"
        onClick={() => {
          sfx.click();
          onOpenProfile();
        }}
        className="pointer-events-auto relative flex items-center active:scale-95 transition-transform shrink-0"
      >
        <div className="w-11 h-11 rounded-xl bg-gradient-to-b from-[#ffe28a] to-[#c47119] border-2 border-[#4d2407] overflow-hidden shrink-0 shadow-lg z-10 p-0.5">
          <div className="w-full h-full rounded-[8px] overflow-hidden bg-gradient-to-b from-[#fff2bd] to-[#f4ae3b]">
            <KnowzaSprite
              pose="portrait"
              outfit={progress.equippedOutfit}
              accessory={progress.equippedAccessory}
              className="w-full h-full object-cover object-top scale-110"
            />
          </div>
        </div>
        <div className="wood-pill rounded-r-2xl -ml-2 pl-3 pr-2.5 py-1 text-left leading-tight">
          <div className="text-[12px] font-extrabold text-[#fff4d4] truncate max-w-[64px]">
            {progress.name}
          </div>
          <div className="text-[9.5px] font-bold text-[#ffd369]">Seviye {progress.level}</div>
          <div className="w-14 h-1.5 bg-[#2a1204] rounded-full overflow-hidden mt-0.5 border border-[#754014]">
            <div
              className="h-full bg-gradient-to-r from-[#ffe055] to-[#ff9f0a] rounded-full"
              style={{ width: `${xpPct}%` }}
            />
          </div>
        </div>
      </button>

      {/* Currencies */}
      <div className="pointer-events-auto flex items-center gap-1 min-w-0 shrink">
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenShop('boosters');
          }}
          className="wood-pill rounded-full px-1.5 py-0.5 flex items-center gap-1 active:scale-95 transition-transform shrink-0"
        >
          <span className="w-5 h-5 rounded-full bg-gradient-to-b from-[#ffe966] to-[#e08700] flex items-center justify-center shadow">
            <Star className="w-3 h-3 text-[#5e2a00] fill-[#5e2a00]" />
          </span>
          <span className="text-[12px] font-black text-white tabular-nums">{progress.stars}</span>
          <span className="w-4 h-4 rounded-full bg-gradient-to-b from-[#ffe359] to-[#e38a00] flex items-center justify-center border border-[#8f4c00]">
            <Plus className="w-2.5 h-2.5 text-[#4a2000] stroke-[3]" />
          </span>
        </button>

        {mode !== 'game' ? (
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenShop('coins');
            }}
            className="wood-pill rounded-full px-1.5 py-0.5 flex items-center gap-1 active:scale-95 transition-transform shrink-0"
          >
            <span className="w-5 h-5 rounded-full bg-gradient-to-b from-[#ff7a8a] to-[#d91a38] flex items-center justify-center shadow">
              <Heart className="w-3 h-3 text-white fill-white" />
            </span>
            <span className="text-[12px] font-black text-white tabular-nums">
              {progress.hearts < progress.maxHearts && heartSecs > 0 ? (
                <span className="flex items-center gap-1">
                  <span>{progress.hearts}</span>
                  <span className="text-[9px] text-[#ffd480] font-bold">{formatTimer(heartSecs)}</span>
                </span>
              ) : (
                progress.hearts
              )}
            </span>
            <span className="w-4 h-4 rounded-full bg-gradient-to-b from-[#ffe359] to-[#e38a00] flex items-center justify-center border border-[#8f4c00]">
              <Plus className="w-2.5 h-2.5 text-[#4a2000] stroke-[3]" />
            </span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenShop('coins');
            }}
            className="wood-pill rounded-full px-1.5 py-0.5 flex items-center gap-1 active:scale-95 transition-transform shrink-0"
          >
            <span className="w-5 h-5 rounded-full bg-gradient-to-b from-[#ffe966] to-[#d98400] border border-[#8f4c00] flex items-center justify-center text-[10px] font-black text-[#6b3400] shadow">
              K
            </span>
            <span className="text-[12px] font-black text-white tabular-nums">
              {progress.coins.toLocaleString('tr-TR')}
            </span>
            <span className="w-4 h-4 rounded-full bg-gradient-to-b from-[#ffe359] to-[#e38a00] flex items-center justify-center border border-[#8f4c00]">
              <Plus className="w-2.5 h-2.5 text-[#4a2000] stroke-[3]" />
            </span>
          </button>
        )}
      </div>

      {/* Right Icons */}
      <div className="pointer-events-auto flex items-center gap-1 shrink-0">
        {mode !== 'game' && onOpenQuests && (
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenQuests();
            }}
            aria-label="Görevler"
            className="w-8 h-8 rounded-xl wood-pill flex items-center justify-center text-[#ffe6a8] relative active:scale-95 transition-transform"
          >
            <Mail className="w-4 h-4" />
            {unclaimedQuests > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-white text-[9px] font-black text-white flex items-center justify-center">
                !
              </span>
            )}
          </button>
        )}
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenSettings();
          }}
          aria-label="Ayarlar"
          className="w-8 h-8 rounded-xl wood-pill flex items-center justify-center text-[#ffe6a8] active:scale-95 transition-transform"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
