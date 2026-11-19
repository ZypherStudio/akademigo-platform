import React, { useEffect, useRef } from 'react';
import { ArrowLeft, Award, Calendar, Coins, Crown, Gift, Lock, Play, Shirt, ShoppingBag, Star, Trophy } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { LevelConfig, PlayerProgress } from '../types/game';
import { assetUrl } from '../utils/assets';
import { sfx } from '../utils/sound';
import { KnowzaSprite } from './KnowzaSprite';

interface WorldMapScreenProps {
  progress: PlayerProgress;
  onBackHome: () => void;
  onSelectLevel: (level: LevelConfig) => void;
  onOpenEndless: () => void;
  onOpenWardrobe: () => void;
  onOpenQuests: () => void;
  onOpenDaily: () => void;
  onOpenShop: () => void;
  onOpenProfile: () => void;
  onOpenCastle: () => void;
}

// Center-lane winding coordinates clear of side buttons
const NODE_X_OFFSETS = [50, 42, 39, 47, 57, 61, 56, 46, 40, 46, 56, 61, 54, 44, 39, 48, 59, 60, 50, 41, 40, 49, 59, 58, 48, 40, 44, 56, 57, 50];

export const WorldMapScreen: React.FC<WorldMapScreenProps> = ({
  progress,
  onBackHome,
  onSelectLevel,
  onOpenEndless,
  onOpenWardrobe,
  onOpenQuests,
  onOpenDaily,
  onOpenShop,
  onOpenProfile,
  onOpenCastle
}) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const currentNodeRef = useRef<HTMLButtonElement | null>(null);

  const today = new Date().toISOString().slice(0, 10);
  const dailyAvailable = progress.lastDailyClaimDate !== today;
  const questClaimable = progress.quests.some((q) => !q.claimed && q.progress >= q.target);

  useEffect(() => {
    const t = setTimeout(() => {
      if (currentNodeRef.current) {
        currentNodeRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
      } else if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 60);
    return () => clearTimeout(t);
  }, [progress.unlockedLevel]);

  const orderedLevels = [...LEVELS].reverse();

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
      {/* Scenic World Map Background */}
      <img
        src={assetUrl('assets/bg_world_map.jpg')}
        alt="Bilgi Dünyası"
        className="absolute inset-0 w-full h-full object-cover object-top pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-sky-500/10 via-transparent to-[#2c1303]/55 pointer-events-none" />

      {/* Top Row below Floating HUD: Golden Back Button + Wooden "Bilgi Dünyası" Plaque + "Ödül" Chest */}
      <div className="relative z-20 pt-14 px-3 flex items-center justify-between gap-2 pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onBackHome();
            }}
            aria-label="Ana Menü"
            className="gold-btn w-9 h-9 rounded-full flex items-center justify-center shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenShop();
            }}
            className="wood-pill rounded-full px-2 py-1 flex items-center gap-1 shadow-lg active:scale-95 transition-transform"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[11px] font-black text-white tabular-nums">
              {progress.coins.toLocaleString('tr-TR')}
            </span>
          </button>
        </div>

        {/* Curved Wooden Plaque */}
        <div className="wood-ribbon rounded-2xl px-6 py-1.5 shadow-xl">
          <h1 className="font-display text-base sm:text-lg font-bold text-[#fff3d1] tracking-wide text-stroke-brown leading-none">
            Bilgi Dünyası
          </h1>
        </div>

        {/* "Ödül Hazır!" Chest Bubble (Reference Image 2) */}
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenDaily();
          }}
          className="pointer-events-auto parchment-card rounded-2xl px-2 py-1 flex items-center gap-1 relative active:scale-95 transition-transform shadow-lg"
        >
          <Gift className="w-4 h-4 text-amber-600" />
          <span className="text-[10px] font-black text-[#4d2407] leading-tight">
            Ödül
          </span>
          {dailyAvailable && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 border border-white text-[9px] font-black text-white flex items-center justify-center animate-bounce">
              !
            </span>
          )}
        </button>
      </div>

      {/* Left Floating Side Action Icons (Reference Image 2: Görevler, Başarımlar, Günlük Giriş, Blok Modu) */}
      <div className="absolute left-2.5 top-28 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenQuests();
          }}
          className="wood-panel rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 relative active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#c084fc] to-[#7e22ce] border border-[#4c1d95] flex items-center justify-center shadow">
            <Gift className="w-4 h-4 text-[#fde047]" />
          </div>
          <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-tight">Görevler</span>
          {questClaimable && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 border border-white text-[9px] font-black text-white flex items-center justify-center animate-bounce">
              !
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenProfile();
          }}
          className="wood-panel rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#ffe066] to-[#d97706] border border-[#78350f] flex items-center justify-center shadow">
            <Trophy className="w-4 h-4 text-[#5e2a00]" />
          </div>
          <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-tight">Başarımlar</span>
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenDaily();
          }}
          className="wood-panel rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 relative active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#60a5fa] to-[#1d4ed8] border border-[#1e3a8a] flex items-center justify-center shadow">
            <Calendar className="w-4 h-4 text-white" />
          </div>
          <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-tight">Günlük</span>
          {dailyAvailable && (
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-red-600 border border-white text-[9px] font-black text-white flex items-center justify-center animate-bounce">
              !
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenEndless();
          }}
          className="wood-panel rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 active:scale-95 transition-transform"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#fbbf24] to-[#b45309] border border-[#78350f] flex items-center justify-center shadow">
            <Crown className="w-4 h-4 text-[#fff7d6]" />
          </div>
          <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-tight">Blok Modu</span>
        </button>
      </div>

      {/* Right Quick Mode Cards: Endless Block Blast & Castle Renovation */}
      <div className="absolute right-2.5 top-28 z-20 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenEndless();
          }}
          className="parchment-card rounded-2xl px-2.5 py-2 flex flex-col items-center gap-1 max-w-[84px] active:scale-95 transition-transform shadow-xl"
        >
          <div className="grid grid-cols-2 gap-0.5 p-1 rounded-lg bg-[#6b3915] border border-[#3a1a04]">
            <span className="w-3 h-3 rounded-[3px] bg-sky-400" />
            <span className="w-3 h-3 rounded-[3px] bg-amber-400" />
            <span className="w-3 h-3 rounded-[3px] bg-rose-500" />
            <span className="w-3 h-3 rounded-[3px] bg-emerald-400" />
          </div>
          <span className="text-[10px] font-black text-[#4d2607] text-center leading-tight">
            Sonsuz Blok
          </span>
          <span className="text-[9px] font-extrabold text-amber-800 bg-amber-200/85 px-1.5 rounded-full">
            {progress.highBlockScore}
          </span>
        </button>

        <button
          type="button"
          onClick={() => {
            sfx.click();
            onOpenCastle();
          }}
          className="wood-panel rounded-2xl px-2 py-1.5 flex flex-col items-center gap-0.5 max-w-[84px] active:scale-95 transition-transform shadow-xl"
        >
          <Crown className="w-5 h-5 text-[#ffe066]" />
          <span className="text-[9.5px] font-extrabold text-[#fff4d8] text-center leading-tight">
            Kale İnşası
          </span>
          <span className="text-[9px] font-black text-[#ffd369]">
            {Object.values(progress.castleStages || {}).filter((v) => v > 0).length}/5
          </span>
        </button>
      </div>

      {/* Scrollable 3D Pedestal Path */}
      <div
        ref={scrollRef}
        className="relative z-10 flex-1 overflow-y-auto no-scrollbar pt-4 pb-8 mt-1"
      >
        <div className="relative max-w-md mx-auto flex flex-col items-center gap-7 px-4 pb-10">
          {/* Castle Finale Header */}
          <div className="parchment-card rounded-2xl px-4 py-1.5 text-center shadow-lg">
            <div className="text-[10px] font-black uppercase tracking-wider text-amber-800">
              Büyük Hedef
            </div>
            <div className="font-display text-sm font-bold text-[#4a2206]">
              Knowza Kalesi (Seviye 30)
            </div>
          </div>

          {orderedLevels.map((lvl) => {
            const unlocked = lvl.id <= progress.unlockedLevel;
            const isCurrent = lvl.id === progress.unlockedLevel;
            const earnedStars = progress.levelStars[lvl.id] || 0;
            const xPct = NODE_X_OFFSETS[(lvl.id - 1) % NODE_X_OFFSETS.length];

            return (
              <div
                key={lvl.id}
                className="w-full relative flex items-center justify-center h-16"
              >
                <div
                  className="absolute flex items-center"
                  style={{ left: `${xPct}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Exact K-Flag Knowza Mascot wearing active outfit beside current pedestal */}
                  {isCurrent && (
                    <div className="absolute -left-24 -top-8 w-24 h-20 pointer-events-none animate-float-slow z-20">
                      <KnowzaSprite
                        pose="flag"
                        outfit={progress.equippedOutfit}
                        accessory={progress.equippedAccessory}
                        className="w-full h-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
                      />
                    </div>
                  )}

                  {/* 3 Stars Arched Above Pedestal */}
                  <div className="flex flex-col items-center">
                    {unlocked && (
                      <div className="flex items-end gap-0.5 mb-0.5 drop-shadow">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`${s === 2 ? 'w-4 h-4 -translate-y-0.5' : 'w-3.5 h-3.5'} ${
                              s <= earnedStars
                                ? 'text-[#ffe047] fill-[#ffe047]'
                                : 'text-[#876240] fill-[#593d24]'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* 3D Perspective Pedestal Disc */}
                    <button
                      ref={isCurrent ? currentNodeRef : undefined}
                      type="button"
                      disabled={!unlocked}
                      onClick={() => {
                        if (!unlocked) return;
                        sfx.click();
                        onSelectLevel(lvl);
                      }}
                      className={`relative w-16 h-12 rounded-[999px] flex items-center justify-center transition-transform ${
                        isCurrent
                          ? 'pedestal-gold scale-110 animate-pulse-soft'
                          : unlocked
                          ? 'pedestal-done active:translate-y-1'
                          : 'pedestal-stone opacity-95'
                      }`}
                    >
                      {unlocked ? (
                        <span
                          className={`font-display text-lg font-black leading-none ${
                            isCurrent ? 'text-[#4e2200]' : 'text-[#fff7de] text-stroke-brown'
                          }`}
                        >
                          {lvl.id}
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5 text-[#f2e2cf]">
                          <Lock className="w-3 h-3" />
                          <span className="font-display text-sm font-black">{lvl.id}</span>
                        </div>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Floating Play CTA + Mode Dock */}
      <div className="relative z-30 px-3 pb-3 pt-1 bg-gradient-to-t from-[#2a1304] via-[#3e1d08]/90 to-transparent">
        <div className="max-w-md mx-auto flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              const lvl = LEVELS.find((l) => l.id === progress.unlockedLevel) || LEVELS[0];
              onSelectLevel(lvl);
            }}
            className="gold-btn w-full py-2.5 rounded-2xl font-display text-lg font-bold flex items-center justify-center gap-2 shadow-xl"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>Seviye {progress.unlockedLevel} Oyna</span>
          </button>

          <nav className="wood-panel rounded-2xl p-1.5 grid grid-cols-4 gap-1">
            <button
              type="button"
              onClick={() => sfx.click()}
              className="gold-btn rounded-xl py-1.5 flex flex-col items-center gap-0.5 text-[11px] font-extrabold"
            >
              <Crown className="w-4 h-4" />
              <span>Macera</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.click();
                onOpenEndless();
              }}
              className="rounded-xl py-1.5 flex flex-col items-center gap-0.5 text-[11px] font-extrabold text-[#ffe9be] hover:bg-white/10 active:scale-95 transition"
            >
              <Award className="w-4 h-4 text-sky-300" />
              <span>Blok Modu</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.click();
                onOpenShop();
              }}
              className="rounded-xl py-1.5 flex flex-col items-center gap-0.5 text-[11px] font-extrabold text-[#ffe9be] hover:bg-white/10 active:scale-95 transition"
            >
              <ShoppingBag className="w-4 h-4 text-rose-300" />
              <span>Mağaza</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.click();
                onOpenWardrobe();
              }}
              className="rounded-xl py-1.5 flex flex-col items-center gap-0.5 text-[11px] font-extrabold text-[#ffe9be] hover:bg-white/10 active:scale-95 transition"
            >
              <Shirt className="w-4 h-4 text-amber-300" />
              <span>Tarzın</span>
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
