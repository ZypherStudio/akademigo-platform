import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Calendar, Check, Coins, Crown, Flame, Gift, Map, Play, Shirt, ShoppingBag, Smartphone, Sparkles, Star, Swords, Timer, Trophy, UserPlus, X } from 'lucide-react';
import { TOTAL_LEVELS, getBiomeForLevel } from '../data/biomes';
import { LEVELS } from '../data/levels';
import { KnowzaMood, LevelConfig, PlayerProgress } from '../types/game';
import { sfx } from '../utils/sound';
import { STAR_CHEST_GOAL } from '../utils/storage';
import { WIN_STREAK_MAX_TIER, getWinStreakInfo, getWinStreakTier } from '../utils/winStreak';
import { BiomeWorldBackground } from './BiomeWorldArt';
import { CubeTile } from './CubeTile';
import { KnowzaSprite } from './KnowzaSprite';
import { SocialTab } from './SocialHubModal';

export const EVENT_MARATHON_TIERS = [
  { tier: 1, lines: 5, label: '+120 Altın', rewardCoins: 120, rewardRocket: 0, rewardDisco: 0 },
  { tier: 2, lines: 15, label: '+1 Roket', rewardCoins: 0, rewardRocket: 1, rewardDisco: 0 },
  { tier: 3, lines: 30, label: '+300 Altın & Disko', rewardCoins: 300, rewardRocket: 0, rewardDisco: 1 }
];

interface HomeMenuScreenProps {
  progress: PlayerProgress;
  pendingGiftBanner?: string | null;
  onPlayCurrent: (level: LevelConfig) => void;
  onOpenMap: () => void;
  onOpenEndless: () => void;
  onOpenSprint: () => void;
  onOpenDailyChallenge: () => void;
  onOpenDuel: () => void;
  onOpenSocial: (tab?: SocialTab) => void;
  onClaimEventTier: (tier: number) => void;
  onClaimStarChest?: () => { coins: number; booster: 'rocket' | 'bomb' | 'hammer' } | null;
  onOpenWardrobe: () => void;
  onOpenQuests: () => void;
  onOpenDaily: () => void;
  onOpenShop: () => void;
  onOpenProfile: () => void;
  onOpenCastle: () => void;
}

export const HomeMenuScreen: React.FC<HomeMenuScreenProps> = ({
  progress,
  pendingGiftBanner = null,
  onPlayCurrent,
  onOpenMap,
  onOpenEndless,
  onOpenSprint,
  onOpenDailyChallenge,
  onOpenDuel,
  onOpenSocial,
  onClaimEventTier,
  onClaimStarChest,
  onOpenWardrobe,
  onOpenQuests,
  onOpenDaily,
  onOpenShop,
  onOpenProfile,
  onOpenCastle
}) => {
  const [homeMood, setHomeMood] = useState<KnowzaMood>('idle');
  const [heroNote, setHeroNote] = useState<string | null>(null);
  const [showStreakInfo, setShowStreakInfo] = useState(false);
  const winStreak = progress.winStreak || 0;
  const streakInfo = getWinStreakInfo(winStreak);

  const handleTapHeroMascot = () => {
    sfx.pop(4, 2);
    const lines =
      progress.equippedOutfit === 'karate'
        ? ['Dojo modu hazır!', 'Sert bloklar kıralım!', 'Odaklan ve patlat!']
        : ['Haydi başlayalım!', 'Bomba kombolar kur!', 'Yeni rekor seni bekler!'];
    setHomeMood((m) => (m === 'combo' ? 'happy' : 'combo'));
    setHeroNote(lines[Math.floor(Math.random() * lines.length)]);
    setTimeout(() => {
      setHomeMood('idle');
      setHeroNote(null);
    }, 1500);
  };

  const currentLvl = LEVELS.find((l) => l.id === progress.unlockedLevel) || LEVELS[0];
  const activeBiome = getBiomeForLevel(currentLvl.id);
  const today = new Date().toISOString().slice(0, 10);
  const dailyAvailable =
    progress.lastDailyClaimDate !== today || progress.lastWheelSpinDate !== today;
  const questClaimable = progress.quests.some((q) => !q.claimed && q.progress >= q.target);

  const previewSteps = [
    Math.max(1, progress.unlockedLevel - 1),
    progress.unlockedLevel,
    Math.min(LEVELS.length, progress.unlockedLevel + 1),
    Math.min(LEVELS.length, progress.unlockedLevel + 2)
  ].filter((v, idx, arr) => arr.indexOf(v) === idx);

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-between bg-[#2b1304]">
      {/* Subtle Biome World Backdrop + Warm Wood Ambient Overlay */}
      <div className="absolute inset-0 opacity-35 blur-[2px] scale-105 pointer-events-none">
        <BiomeWorldBackground biome={activeBiome} variant="map" />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-[#3d1e07]/80 via-[#2d1404]/70 to-[#1f0c02]/95 pointer-events-none" />

      {/* Main Content below Floating TopHud */}
      <div className="relative z-20 flex-1 flex flex-col gap-2.5 px-3 pt-14 pb-2 overflow-y-auto no-scrollbar">
        {/* Coin Balance + Win Streak + Castle Bar */}
        <div className="flex items-center justify-between gap-1.5 relative">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenShop();
            }}
            className="wood-pill rounded-full px-2.5 py-1 flex items-center gap-1 shadow active:scale-95 transition-transform"
          >
            <Coins className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[11px] font-black text-white tabular-nums">
              {progress.coins.toLocaleString('tr-TR')} Altın
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              setShowStreakInfo((v) => !v);
            }}
            className={`wood-pill rounded-full px-2.5 py-1 flex items-center gap-1 shadow active:scale-95 transition-transform ${
              winStreak > 0 ? 'ring-1 ring-orange-400' : ''
            }`}
          >
            <Flame className={`w-3.5 h-3.5 ${winStreak > 0 ? 'text-orange-400 fill-orange-400 animate-pulse' : 'text-amber-200'}`} />
            <span className="text-[11px] font-black text-[#fff3d1] tabular-nums">
              Seri {winStreak}
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenCastle();
            }}
            className="wood-pill rounded-full px-2.5 py-1 flex items-center gap-1 shadow active:scale-95 transition-transform"
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span className="text-[11px] font-black text-[#fff3d1]">
              Kale {Object.values(progress.castleStages || {}).filter((v) => v > 0).length}/5
            </span>
          </button>

          {showStreakInfo && (
            <div className="absolute top-full inset-x-0 mt-1.5 flex justify-center z-50 px-1">
              <div className="w-full max-w-[300px] parchment-card rounded-2xl p-3 text-left shadow-2xl animate-pop-in">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="inline-flex items-center gap-1 font-display text-xs font-black text-[#471f04]">
                    <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                    Kazanma Serisi ({streakInfo.tier}/{WIN_STREAK_MAX_TIER})
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowStreakInfo(false)}
                    aria-label="Kapat"
                    className="w-5 h-5 rounded-full bg-[#6b3910]/15 text-[#471f04] flex items-center justify-center"
                  >
                    <X className="w-3 h-3 stroke-[3]" />
                  </button>
                </div>
                <p className="text-[10.5px] font-bold text-[#6e3a10] leading-snug mb-2">
                  {streakInfo.perkDesc} (Rekor: {Math.max(progress.bestWinStreak || 0, winStreak)})
                </p>
                <div className="grid grid-cols-3 gap-1">
                  {[
                    { tier: 1, label: '+Roket' },
                    { tier: 2, label: '+Bomba' },
                    { tier: 3, label: '+%25 Altın' }
                  ].map((s) => (
                    <div
                      key={s.tier}
                      className={`rounded-lg py-1 text-center text-[9.5px] font-black border ${
                        getWinStreakTier(winStreak) >= s.tier
                          ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white border-amber-200'
                          : 'bg-amber-950/10 text-[#7d4918] border-[#c49253]/40'
                      }`}
                    >
                      {s.tier}. {s.label}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Hero Row: Left Vertical Menu + Center "Bilgi Akademisi" Scenic Card (Reference Image 3!) */}
        <div className="flex gap-2 items-stretch">
          {/* Left Side Vertical Action Buttons (Reference Image 3) */}
          <div className="flex flex-col justify-between gap-1.5 shrink-0">
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
              <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-none">Görevler</span>
              {questClaimable && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-white text-[9px] font-black text-white flex items-center justify-center animate-bounce">
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
              <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-none">Başarımlar</span>
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
              <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-none">Günlük</span>
              {dailyAvailable && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-600 border border-white text-[9px] font-black text-white flex items-center justify-center animate-bounce">
                  !
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.click();
                onOpenWardrobe();
              }}
              className="wood-panel rounded-2xl w-[62px] py-1.5 px-1 flex flex-col items-center gap-0.5 active:scale-95 transition-transform ring-1 ring-amber-300/45"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-b from-[#fb7185] to-[#be123c] border border-[#881337] flex items-center justify-center shadow">
                <Shirt className="w-4 h-4 text-white" />
              </div>
              <span className="text-[9.5px] font-extrabold text-[#fff4d8] leading-none">Tarzın</span>
            </button>
          </div>

          {/* Center Hero Card: Active Biome World Showcase */}
          <div className="flex-1 relative rounded-3xl overflow-hidden border-[3px] border-[#b87635] shadow-2xl min-h-[252px] flex flex-col justify-between">
            <BiomeWorldBackground biome={activeBiome} variant="map" />

            {/* Top Hero Title + Reward Chest */}
            <div className="relative z-10 p-2.5 flex items-start justify-between gap-1">
              <div className="bg-[#3d1e07]/90 backdrop-blur-sm border border-[#e3a857]/60 rounded-2xl px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <h1 className="font-display text-base font-black text-[#fff3d1] leading-tight">
                    Knowza Blast
                  </h1>
                  <span className={`px-1.5 py-[1px] rounded-full text-[8.5px] font-black border ${activeBiome.badgeClass}`}>
                    {activeBiome.name}
                  </span>
                </div>
                <p className="text-[10px] font-bold text-[#ffdf94] leading-tight mt-0.5">
                  Seviye {currentLvl.id}/{TOTAL_LEVELS.toLocaleString('tr-TR')} • Blokları patlat!
                </p>
              </div>

              <div className="flex flex-col items-end gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    sfx.click();
                    onOpenDaily();
                  }}
                  className="parchment-card rounded-xl px-2 py-1 flex items-center gap-1 relative shrink-0 active:scale-95 transition-transform"
                >
                  <Gift className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-[9px] font-black text-[#4d2407]">Ödül</span>
                  {dailyAvailable && (
                    <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                  )}
                </button>

                {(() => {
                  const chestProg = progress.starChestProgress || 0;
                  const chestReady = chestProg >= STAR_CHEST_GOAL;
                  return (
                    <button
                      type="button"
                      onClick={() => {
                        if (chestReady && onClaimStarChest) {
                          const res = onClaimStarChest();
                          if (res) {
                            sfx.reward();
                            confetti({ particleCount: 55, spread: 70, origin: { y: 0.4 } });
                            setHeroNote(`+${res.coins} Altın!` );
                            setTimeout(() => setHeroNote(null), 2200);
                            return;
                          }
                        }
                        sfx.click();
                        setHomeMood('happy');
                        setHeroNote(`${Math.min(STAR_CHEST_GOAL, chestProg)}/${STAR_CHEST_GOAL} Yıldız Sandığı`);
                        setTimeout(() => {
                          setHomeMood('idle');
                          setHeroNote(null);
                        }, 1800);
                      }}
                      className={`rounded-xl px-2 py-0.5 flex items-center gap-1 shadow active:scale-95 transition-transform ${
                        chestReady
                          ? 'green-btn border border-emerald-200 animate-pulse'
                          : 'bg-[#3d1e07]/90 border border-[#ffd466]/60 text-[#ffe699]'
                      }`}
                    >
                      <Star className={`w-3 h-3 ${chestReady ? 'text-yellow-200 fill-yellow-200' : 'text-amber-400 fill-amber-400'}`} />
                      <span className="text-[9px] font-black tabular-nums">
                        {chestReady ? 'Sandık Aç!' : `${chestProg}/${STAR_CHEST_GOAL}`}
                      </span>
                    </button>
                  );
                })()}
              </div>
            </div>

            {/* Knowza Mascot + Stepping Pedestal Preview */}
            <div className="relative z-10 px-2 pb-2.5 flex items-end justify-between">
              <button
                type="button"
                onClick={handleTapHeroMascot}
                className="w-28 h-28 shrink-0 -ml-1 -mb-1 relative active:scale-95 transition-transform focus:outline-none"
                title="Knowza ile etkileş"
              >
                {heroNote && (
                  <span className="absolute -top-6 left-2 whitespace-nowrap bg-[#fff7dc] border-2 border-[#a86f34] text-[#471f04] text-[10px] font-black px-2 py-0.5 rounded-full shadow-md animate-pop-in z-20">
                    {heroNote}
                  </span>
                )}
                <KnowzaSprite
                  pose="flag"
                  outfit={progress.equippedOutfit}
                  accessory={progress.equippedAccessory}
                  mood={homeMood}
                  className="w-full h-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
                />
              </button>

              <div className="flex items-center gap-1.5 mb-1">
                {previewSteps.map((num) => {
                  const isCurr = num === progress.unlockedLevel;
                  const unlocked = num <= progress.unlockedLevel;
                  const stars = progress.levelStars[num] || 0;
                  return (
                    <button
                      key={num}
                      type="button"
                      onClick={() => {
                        sfx.click();
                        if (unlocked) {
                          const target = LEVELS.find((l) => l.id === num) || currentLvl;
                          onPlayCurrent(target);
                        } else {
                          onOpenMap();
                        }
                      }}
                      className={`w-10 h-9 rounded-full flex flex-col items-center justify-center relative ${
                        isCurr
                          ? `${activeBiome.pedestalCurrentClass} scale-110`
                          : unlocked
                          ? activeBiome.pedestalUnlockedClass
                          : `${activeBiome.pedestalLockedClass} opacity-90`
                      }`}
                    >
                      {stars > 0 && (
                        <div className="absolute -top-2.5 flex gap-0.5">
                          {[1, 2, 3].map((s) => (
                            <Star
                              key={s}
                              className={`w-2.5 h-2.5 ${
                                s <= stars ? 'text-yellow-300 fill-yellow-300' : 'text-stone-600 fill-stone-700'
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      <span
                        className={`font-display text-xs font-black ${
                          isCurr && !activeBiome.isDarkTheme && activeBiome.id !== 'glacier'
                            ? 'text-[#4e2200]'
                            : 'text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]'
                        }`}
                      >
                        {num}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Big Primary Play CTA */}
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onPlayCurrent(currentLvl);
          }}
          className="gold-btn w-full py-3 rounded-2xl font-display text-xl font-black flex items-center justify-center gap-2 shadow-xl"
        >
          <Play className="w-6 h-6 fill-current" />
          <span>Blok Patlat — Seviye {currentLvl.id}</span>
        </button>

        {/* Secondary Trio Cards: "Sonsuz Hibrit" + "90sn Sprint" + "Karakter & Blok" */}
        <div className="grid grid-cols-3 gap-2">
          {/* Classic + Hybrid Endless Block Blast Card */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenEndless();
            }}
            className="parchment-card rounded-2xl p-2 text-left flex flex-col justify-between gap-1.5 active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between gap-1">
              <div className="grid grid-cols-2 gap-0.5 p-0.5 rounded-md bg-[#6b3915]">
                <span className="w-2.5 h-2.5 rounded-[2px] bg-sky-400" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-400" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-400" />
              </div>
              <span className="text-[9px] font-black bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded-full truncate">
                {progress.highBlockScore}
              </span>
            </div>
            <div>
              <div className="font-display text-xs font-black text-[#471f04] leading-tight">
                Sonsuz Blok
              </div>
              <div className="text-[9.5px] font-bold text-[#7c4819] leading-tight mt-0.5">
                Klasik Blok • Zorlu
              </div>
            </div>
          </button>

          {/* 90-Second Lightning Sprint Mode */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenSprint();
            }}
            className="parchment-card rounded-2xl p-2 text-left flex flex-col justify-between gap-1.5 active:scale-95 transition-transform ring-1 ring-orange-400/70"
          >
            <div className="flex items-center justify-between gap-1">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-[#fb923c] to-[#ea580c] flex items-center justify-center shadow">
                <Timer className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[9px] font-black bg-orange-100 text-orange-900 px-1.5 py-0.5 rounded-full truncate inline-flex items-center gap-0.5">
                <Flame className="w-2.5 h-2.5 text-orange-600" />
                {progress.highSprintScore || 0}
              </span>
            </div>
            <div>
              <div className="font-display text-xs font-black text-[#471f04] leading-tight">
                90 Sn Yarış
              </div>
              <div className="text-[9.5px] font-bold text-[#7c4819] leading-tight mt-0.5">
                Süre & 2× Ateş
              </div>
            </div>
          </button>

          {/* Character Style & Cube Theme Card */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenWardrobe();
            }}
            className="parchment-card rounded-2xl p-2 text-left flex flex-col justify-between gap-1.5 active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <div className="w-5 h-5">
                  <CubeTile
                    cell={{ uid: 'demo_b', color: 'blue' }}
                    theme={progress.equippedBlockTheme}
                  />
                </div>
                <div className="w-5 h-5">
                  <CubeTile
                    cell={{ uid: 'demo_y', color: 'yellow' }}
                    theme={progress.equippedBlockTheme}
                  />
                </div>
              </div>
              <Shirt className="w-4 h-4 text-rose-600" />
            </div>
            <div>
              <div className="font-display text-xs font-black text-[#471f04] leading-tight">
                Tarz & Blok
              </div>
              <div className="text-[9.5px] font-bold text-[#7c4819] leading-tight mt-0.5">
                Karate & Tema
              </div>
            </div>
          </button>
        </div>

        {/* Social, Daily Seeded Challenge & Growth Cards */}
        {pendingGiftBanner && (
          <div className="bg-emerald-600/95 border border-emerald-200 text-white rounded-2xl px-3 py-1.5 text-[11px] font-black flex items-center justify-between gap-2 shadow animate-pop-in">
            <span>{pendingGiftBanner}</span>
          </div>
        )}

        <div className="grid grid-cols-3 gap-1.5">
          {/* Global Seeded Daily Challenge */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenDailyChallenge();
            }}
            className="parchment-card rounded-2xl p-2 text-left flex flex-col justify-between active:scale-95 transition-transform ring-1 ring-indigo-400/70 min-w-0"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-indigo-400 to-indigo-700 border border-indigo-900 flex items-center justify-center shrink-0 shadow-sm">
                <Calendar className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[9px] font-black text-indigo-900 bg-indigo-100 rounded-full px-1.5 py-0.5 leading-none">
                Ortak
              </span>
            </div>
            <div className="font-display text-[11px] font-black text-[#471f04] leading-tight">
              Günün Oyunu
            </div>
            <div className="text-[9px] font-bold text-[#7c4819] leading-tight mt-0.5">
              Rekor: {progress.dailyChallengeBest || 0}
            </div>
          </button>

          {/* 1v1 Duel Arena */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenDuel();
            }}
            className="parchment-card rounded-2xl p-2 text-left flex flex-col justify-between active:scale-95 transition-transform ring-1 ring-rose-500/80 min-w-0"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-rose-400 to-rose-700 border border-rose-900 flex items-center justify-center shrink-0 shadow-sm">
                <Swords className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[9px] font-black text-rose-900 bg-rose-100 rounded-full px-1.5 py-0.5 leading-none">
                60 Sn
              </span>
            </div>
            <div className="font-display text-[11px] font-black text-[#471f04] leading-tight">
              1v1 Düello
            </div>
            <div className="text-[9px] font-bold text-[#9a2815] leading-tight mt-0.5">
              Ödül: +250 Altın
            </div>
          </button>

          {/* Global Leaderboard + Referral + Hearts */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenSocial('leaderboard');
            }}
            className="parchment-card rounded-2xl p-2 text-left flex flex-col justify-between active:scale-95 transition-transform ring-1 ring-emerald-400/70 min-w-0"
          >
            <div className="flex items-center justify-between gap-1 mb-1">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-b from-emerald-400 to-emerald-700 border border-emerald-900 flex items-center justify-center shrink-0 shadow-sm">
                <UserPlus className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[9px] font-black text-emerald-900 bg-emerald-100 rounded-full px-1.5 py-0.5 leading-none">
                Lig
              </span>
            </div>
            <div className="font-display text-[11px] font-black text-[#471f04] leading-tight">
              Sıralama
            </div>
            <div className="text-[9px] font-bold text-[#7c4819] leading-tight mt-0.5">
              Can & +300 Altın
            </div>
          </button>
        </div>

        {/* Limited-Time Daily Treasure Marathon Event + PWA Install Trigger */}
        <div className="parchment-card rounded-2xl p-2.5 flex flex-col gap-1.5">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-b from-amber-300 to-orange-500 flex items-center justify-center shadow">
                <Trophy className="w-3 h-3 text-[#471f04]" />
              </div>
              <span className="font-display text-xs font-black text-[#471f04]">
                Hazine Maratonu
              </span>
              <span className="text-[9.5px] font-black text-amber-800 bg-amber-100 border border-amber-300 px-1.5 py-0.5 rounded-full tabular-nums">
                {Math.min(30, progress.eventLinesProgress || 0)}/30 Satır
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                sfx.click();
                onOpenSocial('install');
              }}
              className="brown-btn px-2 py-1 rounded-xl text-[9.5px] font-black flex items-center gap-1 shrink-0"
            >
              <Smartphone className="w-3 h-3 text-[#7c3d12]" />
              <span>Uygulamayı Kur</span>
            </button>
          </div>

          <div className="w-full h-2.5 bg-[#e2c693] rounded-full overflow-hidden border border-[#a87035]">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round(((progress.eventLinesProgress || 0) / 30) * 100))}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-1.5">
            {EVENT_MARATHON_TIERS.map((ev) => {
              const linesDone = progress.eventLinesProgress || 0;
              const claimed = (progress.eventClaimedTiers || []).includes(ev.tier);
              const ready = !claimed && linesDone >= ev.lines;
              return (
                <button
                  key={ev.tier}
                  type="button"
                  disabled={!ready}
                  onClick={() => {
                    if (!ready) return;
                    sfx.reward();
                    onClaimEventTier(ev.tier);
                  }}
                  className={`rounded-xl py-1 px-1.5 text-center border text-[9px] font-black transition ${
                    claimed
                      ? 'bg-emerald-100 border-emerald-400 text-emerald-800'
                      : ready
                      ? 'gold-btn border-amber-600 animate-pulse'
                      : 'bg-white/70 border-[#d6b384] text-[#7c4819]'
                  }`}
                >
                  <div className="flex items-center justify-center gap-0.5">
                    {claimed && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    <span>{ev.lines} Satır</span>
                  </div>
                  <div className="truncate">{ready ? 'Ödülü Al!' : ev.label}</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Mode Navigation Bar */}
      <div className="relative z-30 px-3 pb-3 pt-1">
        <nav className="wood-panel rounded-2xl p-1.5 grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() => sfx.click()}
            className="gold-btn rounded-xl py-1.5 flex flex-col items-center gap-0.5 text-[11px] font-extrabold"
          >
            <Sparkles className="w-4 h-4" />
            <span>Ana Menü</span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenMap();
            }}
            className="rounded-xl py-1.5 flex flex-col items-center gap-0.5 text-[11px] font-extrabold text-[#ffe9be] hover:bg-white/10 active:scale-95 transition"
          >
            <Map className="w-4 h-4 text-emerald-300" />
            <span>Harita</span>
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
        </nav>
      </div>
    </div>
  );
};
