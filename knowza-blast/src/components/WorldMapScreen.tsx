import React, { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowUp,
  Award,
  Calendar,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Coins,
  Crown,
  Flame,
  Gift,
  Lock,
  Play,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Trophy,
  X
} from 'lucide-react';
import {
  BIOMES,
  LEVELS_PER_CHAPTER,
  TOTAL_CHAPTERS,
  TOTAL_LEVELS,
  getBiomeForLevel,
  getChapterIndexForLevel
} from '../data/biomes';
import { LEVELS, getLevelsByChapter } from '../data/levels';
import { LevelConfig, PlayerProgress } from '../types/game';
import { sfx } from '../utils/sound';
import { BiomeWorldBackground } from './BiomeWorldArt';
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

// Center-lane winding coordinates clear of left (72px) and right (94px) floating rails
const NODE_X_OFFSETS = [51, 46, 44, 48, 53, 56, 54, 49, 45, 48, 53, 56, 52, 46, 44];

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
  const activeBiomeChipRef = useRef<HTMLButtonElement | null>(null);
  const currentChapter = getChapterIndexForLevel(progress.unlockedLevel);
  const [viewChapter, setViewChapter] = useState<number>(currentChapter);
  const [showChapterPicker, setShowChapterPicker] = useState(false);

  const today = new Date().toISOString().slice(0, 10);
  const dailyAvailable =
    progress.lastDailyClaimDate !== today || progress.lastWheelSpinDate !== today;
  const questClaimable = progress.quests.some((q) => !q.claimed && q.progress >= q.target);

  useEffect(() => {
    setViewChapter(getChapterIndexForLevel(progress.unlockedLevel));
  }, [progress.unlockedLevel]);

  useEffect(() => {
    activeBiomeChipRef.current?.scrollIntoView({
      behavior: 'smooth',
      inline: 'center',
      block: 'nearest'
    });
    const t = setTimeout(() => {
      const chFirst = viewChapter * LEVELS_PER_CHAPTER + 1;
      const offsetInChapter = progress.unlockedLevel - chFirst;
      if (viewChapter === currentChapter && offsetInChapter <= 2 && scrollRef.current) {
        // Keep bottom pedestals (Level 1-3) fully above bottom CTA without slicing Level 1
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      } else if (currentNodeRef.current) {
        currentNodeRef.current.scrollIntoView({ behavior: 'auto', block: 'center' });
      } else if (scrollRef.current) {
        scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
    }, 60);
    return () => clearTimeout(t);
  }, [progress.unlockedLevel, viewChapter, currentChapter]);

  const chapterLevels = getLevelsByChapter(viewChapter);
  const orderedLevels = [...chapterLevels].reverse();
  const chapterFirstId = chapterLevels[0]?.id ?? viewChapter * LEVELS_PER_CHAPTER + 1;
  const chapterLastId = chapterLevels[chapterLevels.length - 1]?.id ?? chapterFirstId + LEVELS_PER_CHAPTER - 1;
  const chapterBiome = getBiomeForLevel(chapterFirstId);

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col">
      {/* Illustrated & Animated Biome World Background */}
      <BiomeWorldBackground biome={chapterBiome} variant="map" />

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

        {/* Biome-Themed Header Plaque */}
        <div className={`${chapterBiome.ribbonClass} rounded-2xl px-6 py-1.5 transition-all duration-300`}>
          <h1 className="font-display text-base sm:text-lg font-bold tracking-wide text-stroke-brown leading-none">
            {chapterBiome.name}
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

      {/* Chapter & 8-Biome Navigator Strip */}
      <div className="relative z-20 px-3 mt-1.5 flex flex-col gap-1.5 shrink-0">
        <div className={`${chapterBiome.hudCardClass} rounded-2xl px-2.5 py-1.5 flex items-center justify-between gap-1.5 transition-colors duration-300`}>
          <button
            type="button"
            disabled={viewChapter <= 0}
            onClick={() => {
              sfx.click();
              setViewChapter((c) => Math.max(0, c - 1));
            }}
            aria-label="Önceki Bölüm"
            className="brown-btn w-7 h-7 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 text-center min-w-0">
            <div className="flex items-center justify-center gap-1.5 flex-wrap">
              <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-black border ${chapterBiome.badgeClass}`}>
                {chapterBiome.name}
              </span>
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black border ${
                  (progress.winStreak || 0) > 0
                    ? 'bg-orange-500 text-white border-amber-200'
                    : 'bg-amber-950/15 text-[#6b3910] border-amber-400/50'
                }`}
              >
                <Flame className="w-2.5 h-2.5 fill-current" /> Seri {progress.winStreak || 0}
              </span>
              {viewChapter !== currentChapter && (
                <button
                  type="button"
                  onClick={() => {
                    sfx.click();
                    setViewChapter(currentChapter);
                  }}
                  className="px-2 py-0.5 rounded-full text-[9px] font-black bg-amber-500 text-white border border-amber-200 shadow-sm active:scale-95"
                >
                  Konumum ({progress.unlockedLevel})
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                sfx.click();
                setShowChapterPicker(true);
              }}
              aria-label="Tüm Bölümleri Aç"
              className={`mt-0.5 inline-flex items-center justify-center gap-1 px-2 py-0.5 rounded-lg hover:bg-black/10 active:scale-95 transition text-[10.5px] font-black ${chapterBiome.hudTitleTextClass} max-w-full`}
            >
              <span className="truncate">
                Bölüm {viewChapter + 1}/{TOTAL_CHAPTERS} • Seviye {chapterFirstId}–{chapterLastId}
              </span>
              <ChevronDown className="w-3 h-3 shrink-0 opacity-85" />
            </button>
          </div>

          <button
            type="button"
            disabled={viewChapter >= TOTAL_CHAPTERS - 1}
            onClick={() => {
              sfx.click();
              setViewChapter((c) => Math.min(TOTAL_CHAPTERS - 1, c + 1));
            }}
            aria-label="Sonraki Bölüm"
            className="brown-btn w-7 h-7 rounded-xl flex items-center justify-center shrink-0 disabled:opacity-40"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* 8-Biome Horizontal Quick Selector */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {BIOMES.map((b, bIdx) => {
            const isActiveBiome = chapterBiome.id === b.id;
            const cycleBase = Math.floor(viewChapter / BIOMES.length) * BIOMES.length;
            const targetChapter = Math.min(TOTAL_CHAPTERS - 1, cycleBase + bIdx);
            return (
              <button
                key={b.id}
                ref={isActiveBiome ? activeBiomeChipRef : undefined}
                type="button"
                onClick={() => {
                  sfx.click();
                  setViewChapter(targetChapter);
                }}
                className={`px-2.5 py-1 rounded-full text-[10px] font-black whitespace-nowrap border transition-transform active:scale-95 shrink-0 ${
                  isActiveBiome
                    ? `${b.badgeClass} ring-2 ring-white shadow-md scale-[1.03]`
                    : 'bg-[#1a1025]/75 text-white/90 border-white/25 hover:bg-black/65'
                }`}
              >
                {b.name}
              </button>
            );
          })}
        </div>

        {/* Pinned Active Biome Mechanic Banner */}
        <div className={`${chapterBiome.mechanicBarClass} backdrop-blur-sm border rounded-xl px-2.5 py-1 flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5 text-center shadow transition-colors duration-300`}>
          <Sparkles className="w-3 h-3 text-[#ffe066] shrink-0" />
          <span className="text-[10px] font-black shrink-0">
            {chapterBiome.mechanicTitle}:
          </span>
          <span className="text-[9.5px] font-bold leading-tight opacity-95">
            {chapterBiome.mechanicDesc}
          </span>
        </div>
      </div>

      {/* Main Map Stage below Biome Selector */}
      <div className="relative z-10 flex-1 overflow-hidden flex flex-col">
        {/* Left Floating Side Action Icons */}
        <div className="absolute left-2.5 top-2 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenQuests();
            }}
            className={`${chapterBiome.panelClass} rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 relative active:scale-95 transition-all duration-300`}
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
            className={`${chapterBiome.panelClass} rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 active:scale-95 transition-all duration-300`}
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
            className={`${chapterBiome.panelClass} rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 relative active:scale-95 transition-all duration-300`}
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
            className={`${chapterBiome.panelClass} rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 active:scale-95 transition-all duration-300`}
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#fbbf24] to-[#b45309] border border-[#78350f] flex items-center justify-center shadow">
              <Crown className="w-4 h-4 text-[#fff7d6]" />
            </div>
            <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-tight">Blok Modu</span>
          </button>
        </div>

        {/* Right Quick Mode Cards: Endless Block Blast & Castle Renovation */}
        <div className="absolute right-2.5 top-2 z-20 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenEndless();
            }}
            className={`${chapterBiome.hudCardClass} rounded-2xl px-2.5 py-2 flex flex-col items-center gap-1 max-w-[84px] active:scale-95 transition-all duration-300 shadow-xl`}
          >
            <div className="grid grid-cols-2 gap-0.5 p-1 rounded-lg bg-black/45 border border-white/25">
              <span className="w-3 h-3 rounded-[3px] bg-sky-400" />
              <span className="w-3 h-3 rounded-[3px] bg-amber-400" />
              <span className="w-3 h-3 rounded-[3px] bg-rose-500" />
              <span className="w-3 h-3 rounded-[3px] bg-emerald-400" />
            </div>
            <span className={`text-[10px] font-black ${chapterBiome.hudTitleTextClass} text-center leading-tight`}>
              Sonsuz Blok
            </span>
            <span className="text-[9px] font-extrabold text-amber-900 bg-amber-200/95 px-1.5 rounded-full">
              {progress.highBlockScore}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenCastle();
            }}
            className={`${chapterBiome.panelClass} rounded-2xl px-2 py-1.5 flex flex-col items-center gap-0.5 max-w-[84px] active:scale-95 transition-all duration-300 shadow-xl`}
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
          className="flex-1 overflow-y-auto no-scrollbar pt-5 pb-14"
        >
        <div className="relative max-w-md mx-auto flex flex-col items-center gap-7 px-4 pb-6">
          {/* Chapter Summit Header & Next Chapter Portal (fits safely between side rails) */}
          <div className="flex flex-col items-center gap-2 w-full max-w-[204px]">
            <button
              type="button"
              onClick={() => {
                sfx.click();
                setShowChapterPicker(true);
              }}
              className={`${chapterBiome.hudCardClass} rounded-2xl px-3 py-1.5 text-center w-full active:scale-95 transition`}
            >
              <div className={`text-[9.5px] font-black uppercase tracking-wider ${chapterBiome.hudSubTextClass} truncate`}>
                Bölüm {viewChapter + 1} Zirvesi • {chapterBiome.name}
              </div>
              <div className={`text-[10px] font-extrabold ${chapterBiome.hudTitleTextClass} mt-0.5 flex items-center justify-center gap-1`}>
                <span>{chapterFirstId}–{chapterLastId} / {TOTAL_LEVELS.toLocaleString('tr-TR')}</span>
                <ChevronDown className="w-3 h-3 opacity-80" />
              </div>
            </button>

            {viewChapter < TOTAL_CHAPTERS - 1 && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  setViewChapter((c) => Math.min(TOTAL_CHAPTERS - 1, c + 1));
                }}
                className="gold-btn rounded-xl px-3 py-1.5 text-[10.5px] font-black flex items-center justify-center gap-1 w-full shadow-lg active:scale-95 transition"
              >
                <ArrowUp className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">
                  Sonraki Bölüm ({chapterLastId + 1}–{Math.min(TOTAL_LEVELS, chapterLastId + LEVELS_PER_CHAPTER)})
                </span>
              </button>
            )}
          </div>

          {orderedLevels.map((lvl, rowIdx) => {
            const unlocked = lvl.id <= progress.unlockedLevel;
            const isCurrent = lvl.id === progress.unlockedLevel;
            const isMilestone = lvl.id % 5 === 0;
            const earnedStars = progress.levelStars[lvl.id] || 0;
            const xPct = NODE_X_OFFSETS[(lvl.id - 1) % NODE_X_OFFSETS.length];
            const knowzaOnRight = xPct < 50;
            const nextLvl = orderedLevels[rowIdx + 1];
            const nextXPct = nextLvl ? NODE_X_OFFSETS[(nextLvl.id - 1) % NODE_X_OFFSETS.length] : null;
            const midX = nextXPct !== null ? (xPct + nextXPct) / 2 : xPct;

            return (
              <div
                key={lvl.id}
                className="w-full relative flex items-center justify-center h-16"
              >
                {/* Animated Winding Biome Connector Path to Next Node */}
                {nextXPct !== null && (
                  <svg
                    viewBox="0 0 100 92"
                    preserveAspectRatio="none"
                    className="absolute left-0 right-0 top-8 h-[92px] w-full pointer-events-none z-0 overflow-visible"
                  >
                    <path
                      d={`M ${xPct} 0 Q ${midX} 46 ${nextXPct} 92`}
                      fill="none"
                      stroke={chapterBiome.roadGlowColor}
                      strokeWidth="9"
                      strokeLinecap="round"
                      vectorEffect="non-scaling-stroke"
                    />
                    <path
                      d={`M ${xPct} 0 Q ${midX} 46 ${nextXPct} 92`}
                      fill="none"
                      stroke={chapterBiome.roadStrokeColor}
                      strokeWidth="3.5"
                      strokeDasharray="6 6"
                      strokeLinecap="round"
                      className="animate-road-flow"
                      vectorEffect="non-scaling-stroke"
                    />
                  </svg>
                )}

                <div
                  className="absolute flex items-center z-10"
                  style={{ left: `${xPct}%`, transform: 'translateX(-50%)' }}
                >
                  {/* Full-Body K-Flag Knowza positioned inside the clear center corridor (never clipped off-edge) */}
                  {isCurrent && (
                    <div
                      className={`absolute ${
                        knowzaOnRight ? '-right-[74px]' : '-left-[74px]'
                      } -top-7 w-[78px] h-[78px] pointer-events-none animate-float-slow z-20`}
                    >
                      <KnowzaSprite
                        pose="flag"
                        outfit={progress.equippedOutfit}
                        accessory={progress.equippedAccessory}
                        className="w-full h-full object-contain drop-shadow-[0_6px_10px_rgba(0,0,0,0.45)]"
                      />
                    </div>
                  )}

                  {/* 3 Stars Arched Above Pedestal */}
                  <div className="flex flex-col items-center relative">
                    {isMilestone && (
                      <div className="absolute -top-3.5 -right-2.5 w-5 h-5 rounded-full bg-gradient-to-b from-amber-300 to-amber-500 border border-[#5e2a00] flex items-center justify-center shadow z-20">
                        <Crown className="w-3 h-3 text-[#4a2000]" />
                      </div>
                    )}
                    {unlocked && (
                      <div className="flex items-end gap-0.5 mb-0.5 drop-shadow">
                        {[1, 2, 3].map((s) => (
                          <Star
                            key={s}
                            className={`${s === 2 ? 'w-4 h-4 -translate-y-0.5' : 'w-3.5 h-3.5'} ${
                              s <= earnedStars
                                ? 'text-[#ffe047] fill-[#ffe047]'
                                : 'text-slate-600/80 fill-slate-800/80'
                            }`}
                          />
                        ))}
                      </div>
                    )}

                    {/* Biome-Themed 3D Perspective Pedestal Disc */}
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
                          ? `${chapterBiome.pedestalCurrentClass} scale-110 animate-pulse-soft`
                          : unlocked
                          ? `${chapterBiome.pedestalUnlockedClass} active:translate-y-1`
                          : `${chapterBiome.pedestalLockedClass} opacity-95`
                      }`}
                    >
                      {unlocked ? (
                        <span
                          className={`font-display text-lg font-black leading-none ${
                            isCurrent && !chapterBiome.isDarkTheme && chapterBiome.id !== 'glacier'
                              ? 'text-[#4e2200]'
                              : 'text-white drop-shadow-[0_2px_3px_rgba(0,0,0,0.85)]'
                          }`}
                        >
                          {lvl.id}
                        </span>
                      ) : (
                        <div className="flex items-center gap-0.5 text-white/95 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
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

          {viewChapter > 0 && (
            <button
              type="button"
              onClick={() => {
                sfx.click();
                setViewChapter((c) => Math.max(0, c - 1));
              }}
              className="brown-btn rounded-xl px-3.5 py-2 text-[11px] font-black flex items-center justify-center gap-1.5 shadow-lg active:scale-95 transition mt-2"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>
                Önceki Bölüm ({Math.max(1, chapterFirstId - LEVELS_PER_CHAPTER)}–{chapterFirstId - 1})
              </span>
            </button>
          )}
        </div>
        </div>
      </div>

      {/* Bottom Floating Play CTA + Mode Dock */}
      <div className={`relative z-30 px-3 pb-3 pt-1 bg-gradient-to-t ${chapterBiome.dockFadeClass} transition-colors duration-300`}>
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

          <nav className={`${chapterBiome.panelClass} rounded-2xl p-1.5 grid grid-cols-4 gap-1 transition-all duration-300`}>
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

      {/* 80-Chapter & 1.200-Level Scrollable World Atlas Picker */}
      {showChapterPicker && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3">
          <div className="parchment-card w-full max-w-md max-h-[82vh] rounded-3xl p-4 flex flex-col gap-3 shadow-2xl border-2 border-[#78350f]">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h2 className="font-display text-base font-black text-[#4d2407]">
                  Dünya Haritası • {TOTAL_CHAPTERS} Bölüm
                </h2>
                <p className="text-[11px] font-bold text-[#7c3d12]">
                  {TOTAL_LEVELS.toLocaleString('tr-TR')} Seviye • Aktif Konum: Seviye {progress.unlockedLevel}
                </p>
              </div>
              <button
                type="button"
                aria-label="Kapat"
                onClick={() => {
                  sfx.click();
                  setShowChapterPicker(false);
                }}
                className="brown-btn w-8 h-8 rounded-full flex items-center justify-center shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {viewChapter !== currentChapter && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  setViewChapter(currentChapter);
                  setShowChapterPicker(false);
                }}
                className="gold-btn w-full py-2 rounded-xl text-xs font-black flex items-center justify-center gap-1.5"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Konumuma Git (Bölüm {currentChapter + 1} • Seviye {progress.unlockedLevel})</span>
              </button>
            )}

            <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 gap-2">
              {Array.from({ length: TOTAL_CHAPTERS }, (_, chIdx) => {
                const firstId = chIdx * LEVELS_PER_CHAPTER + 1;
                const lastId = Math.min(TOTAL_LEVELS, firstId + LEVELS_PER_CHAPTER - 1);
                const chBiome = getBiomeForLevel(firstId);
                const isViewing = chIdx === viewChapter;
                const isCurrentCh = chIdx === currentChapter;
                const isUnlockedCh = firstId <= progress.unlockedLevel;
                let chStars = 0;
                for (let id = firstId; id <= lastId; id++) {
                  chStars += progress.levelStars[id] || 0;
                }

                return (
                  <button
                    key={chIdx}
                    type="button"
                    onClick={() => {
                      sfx.click();
                      setViewChapter(chIdx);
                      setShowChapterPicker(false);
                    }}
                    className={`rounded-2xl p-2.5 text-left border transition active:scale-95 flex flex-col gap-1 ${
                      isViewing
                        ? 'bg-amber-200/90 border-amber-700 ring-2 ring-amber-500'
                        : isCurrentCh
                        ? 'bg-amber-100 border-amber-600'
                        : isUnlockedCh
                        ? 'bg-white/95 border-[#d6b384]'
                        : 'bg-[#efe2ca]/90 border-[#c9ab7f] opacity-85'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`px-1.5 py-0.5 rounded-full text-[8.5px] font-black border truncate ${chBiome.badgeClass}`}>
                        {chBiome.name}
                      </span>
                      {!isUnlockedCh && <Lock className="w-3 h-3 text-[#7c3d12] shrink-0" />}
                      {isCurrentCh && (
                        <span className="text-[8.5px] font-black text-white bg-orange-600 px-1.5 py-0.5 rounded-full shrink-0">
                          Burada
                        </span>
                      )}
                    </div>
                    <div className="text-xs font-black text-[#451d05]">
                      Bölüm {chIdx + 1}
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-bold text-[#78350f]">
                      <span>Seviye {firstId}–{lastId}</span>
                      <span className="inline-flex items-center gap-0.5 font-black text-amber-700">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                        {chStars}/{LEVELS_PER_CHAPTER * 3}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
