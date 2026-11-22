import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Check,
  Coins,
  Flame,
  Gem,
  GraduationCap,
  Heart,
  HelpCircle,
  Pencil,
  Play,
  RotateCcw,
  Star,
  Volume2,
  VolumeX,
  Vibrate,
  X,
  Zap
} from 'lucide-react';
import { getBiomeForLevel, TOTAL_LEVELS } from '../data/biomes';
import { AccessoryId, InventoryBooster, LevelConfig, OutfitId, PlayerProgress, TargetKey } from '../types/game';
import { assetUrl } from '../utils/assets';
import { sfx } from '../utils/sound';
import { getNextHeartSeconds, xpForNextLevel } from '../utils/storage';
import { WIN_STREAK_MAX_TIER, getWinStreakInfo, getWinStreakTier } from '../utils/winStreak';
import { BoosterIcon } from './BoosterIcon';
import { CastleDiorama } from './CastleDiorama';
import { KnowzaSprite } from './KnowzaSprite';
import { LuckyWheel, WheelPrize } from './LuckyWheel';
import { TargetChip } from './TargetChip';

/* ============================================================================
 * 1. Level Start Intro Card (Reference Image 2 - "Seviye 4" + Pre-Boosters)
 * ========================================================================== */
export const LevelIntroModal: React.FC<{
  level: LevelConfig;
  hearts: number;
  boosters: Record<InventoryBooster, number>;
  winStreak?: number;
  onStart: (selectedStartBoosters: ('rocket' | 'bomb')[]) => void;
  onOpenShop: () => void;
  onClose: () => void;
}> = ({ level, hearts, boosters, winStreak = 0, onStart, onOpenShop, onClose }) => {
  const biome = getBiomeForLevel(level.id);
  const streakInfo = getWinStreakInfo(winStreak);
  const targetEntries = Object.entries(level.targets) as [TargetKey, number][];
  const [preRocket, setPreRocket] = useState(false);
  const [preBomb, setPreBomb] = useState(false);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card rounded-3xl p-5 max-w-xs w-full text-center relative animate-pop-in">
        {/* Decorative graduation cap & corner leaves like Reference Image 2 */}
        <div className="absolute -top-4 -left-3 w-11 h-11 rounded-2xl bg-[#3c2419] border-2 border-[#ffd466] flex items-center justify-center -rotate-12 shadow-lg pointer-events-none">
          <GraduationCap className="w-6 h-6 text-[#ffd466]" />
        </div>
        <span className="absolute -bottom-2 -left-2 w-4 h-4 rounded-tl-full rounded-br-full bg-emerald-500 border border-emerald-800 -rotate-12 pointer-events-none" />
        <span className="absolute -bottom-2 -right-2 w-4 h-4 rounded-tr-full rounded-bl-full bg-emerald-500 border border-emerald-800 rotate-12 pointer-events-none" />

        <button
          type="button"
          onClick={() => {
            sfx.click();
            onClose();
          }}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow-lg"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="flex items-center justify-center gap-1.5 mt-1">
          <h2 className="font-display text-2xl font-black text-[#4a2206]">
            Seviye {level.id}
          </h2>
          <span className={`px-2 py-0.5 rounded-full text-[9.5px] font-black border ${biome.badgeClass}`}>
            {biome.name}
          </span>
        </div>
        <div className="text-xs font-extrabold text-[#754014] mt-0.5">
          {level.name} • {TOTAL_LEVELS.toLocaleString('tr-TR')} Seviye
        </div>
        <p className="text-[11px] font-bold text-[#8a5220] mt-1 leading-snug">{level.subtitle}</p>
        <div className="mt-1 text-[10px] font-extrabold text-[#5c2c09] bg-amber-100/80 border border-amber-300/80 rounded-xl px-2.5 py-1">
          {biome.mechanicTitle}: {biome.mechanicDesc}
        </div>

        <div className="parchment-subcard rounded-2xl p-2.5 my-2.5">
          <div className="text-[11px] font-black text-amber-900 uppercase mb-1.5">
            Toplanacak Bloklar • 8×8 Block Blast
          </div>
          <div className="flex items-center justify-center gap-4">
            {targetEntries.map(([k, qty]) => (
              <TargetChip key={k} targetKey={k} remaining={qty} biome={biome.id} />
            ))}
          </div>
        </div>

        {/* 3-Tier Kazanma Serisi Progress Card */}
        <div className="parchment-subcard rounded-2xl px-2.5 py-2 mb-2.5 text-left">
          <div className="flex items-center justify-between gap-1.5 mb-1">
            <span className="inline-flex items-center gap-1 text-[10.5px] font-black text-[#471f04]">
              <Flame className={`w-3.5 h-3.5 ${winStreak > 0 ? 'text-orange-500 fill-orange-500' : 'text-amber-700'}`} />
              Kazanma Serisi ({streakInfo.tier}/{WIN_STREAK_MAX_TIER})
            </span>
            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-orange-500/15 text-orange-800 border border-orange-300">
              {winStreak > 0 ? `${winStreak} Galibiyet` : 'Kaybedince sıfırlanır'}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1">
            {[
              { tier: 1, label: '+Roket' },
              { tier: 2, label: '+Bomba' },
              { tier: 3, label: '+%25 Altın' }
            ].map((step) => {
              const active = getWinStreakTier(winStreak) >= step.tier;
              return (
                <div
                  key={step.tier}
                  className={`rounded-lg py-1 px-1 text-center text-[9.5px] font-black border ${
                    active
                      ? 'bg-gradient-to-b from-amber-400 to-orange-500 text-white border-amber-200 shadow-sm'
                      : 'bg-amber-950/10 text-[#7d4918] border-[#c49253]/40'
                  }`}
                >
                  {step.tier}. {step.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Toon Blast / Royal Match Pre-Level Booster Selection */}
        <div className="mb-3">
          <div className="text-[10px] font-black text-[#6e3a10] uppercase mb-1">
            Başlangıç Güçlendiricisi Seç
          </div>
          <div className="flex items-center justify-center gap-2.5">
            {(['rocket', 'bomb'] as const).map((bType) => {
              const count = boosters[bType] || 0;
              const selected = bType === 'rocket' ? preRocket : preBomb;
              return (
                <button
                  key={bType}
                  type="button"
                  disabled={count <= 0}
                  onClick={() => {
                    sfx.click();
                    if (bType === 'rocket') setPreRocket((v) => !v);
                    else setPreBomb((v) => !v);
                  }}
                  className={`relative w-14 h-12 rounded-2xl parchment-subcard flex items-center justify-center transition ${
                    selected ? 'ring-3 ring-emerald-500 bg-emerald-50 scale-105' : ''
                  } ${count <= 0 ? 'opacity-45 grayscale cursor-not-allowed' : ''}`}
                >
                  <BoosterIcon type={bType} className="w-8 h-8" />
                  <span className="absolute -bottom-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full text-[9px] font-black bg-[#5c300f] text-white border border-white flex items-center justify-center">
                    {selected ? <Check className="w-3 h-3 stroke-[3]" /> : count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex items-center justify-center gap-2 text-[11px] font-black text-[#5c2c09] mb-3">
          <span className="flex items-center gap-1 bg-amber-200/80 px-2 py-0.5 rounded-full">
            <Star className="w-3 h-3 text-amber-500 fill-amber-500" /> +{level.rewards.stars}
          </span>
          <span className="flex items-center gap-1 bg-amber-200/80 px-2 py-0.5 rounded-full">
            <Coins className="w-3 h-3 text-amber-600" /> +{level.rewards.coins}
          </span>
          <span className="bg-purple-200/85 text-purple-900 px-2 py-0.5 rounded-full">
            +{level.rewards.xp} XP
          </span>
        </div>

        {hearts > 0 ? (
          <button
            type="button"
            onClick={() => {
              sfx.click();
              const chosen: ('rocket' | 'bomb')[] = [];
              if (preRocket) chosen.push('rocket');
              if (preBomb) chosen.push('bomb');
              onStart(chosen);
            }}
            className="gold-btn w-full py-2.5 rounded-2xl font-display text-xl font-bold flex items-center justify-center gap-2"
          >
            <span>Oyna</span>
            <Play className="w-5 h-5 fill-current" />
          </button>
        ) : (
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenShop();
            }}
            className="green-btn w-full py-2.5 rounded-2xl font-display text-base font-bold flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5 fill-white" />
            <span>Can Bitti — Hemen Doldur!</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
 * 2. Victory Modal (Reference Image 1 & 2 - "Harika! / Seviye Tamamlandı!")
 * ========================================================================== */
export const VictoryModal: React.FC<{
  level: LevelConfig;
  starsEarned: number;
  bonusCoins: number;
  winStreak?: number;
  streakBonusCoins?: number;
  hasNextLevel: boolean;
  outfit?: OutfitId;
  accessory?: AccessoryId;
  onNextLevel: () => void;
  onMap: () => void;
}> = ({
  level,
  starsEarned,
  bonusCoins,
  winStreak = 1,
  streakBonusCoins = 0,
  hasNextLevel,
  outfit = 'classic',
  accessory = 'none',
  onNextLevel,
  onMap
}) => {
  useEffect(() => {
    sfx.win();
    confetti({ particleCount: 70, spread: 70, origin: { y: 0.55 } });
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-xs w-full text-center animate-pop-in mt-14">
        {/* Sunburst Glow & Cheering Knowza rising behind card */}
        <div className="absolute -top-28 left-1/2 -translate-x-1/2 w-56 h-56 rounded-full sunburst-rays opacity-75 pointer-events-none" />
        <div className="relative z-10 -mb-6 pointer-events-none">
          <div className="font-display text-3xl font-black text-white text-stroke-brown mb-1">
            Harika!
          </div>
          <div className="flex items-end justify-center gap-2 -mb-2">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`${s === 2 ? 'w-12 h-12 -translate-y-2' : 'w-9 h-9'} ${
                  s <= starsEarned
                    ? 'text-[#ffcf1a] fill-[#ffcf1a] drop-shadow-[0_4px_6px_rgba(120,60,0,0.65)]'
                    : 'text-[#8c6b43] fill-[#5c4327]'
                }`}
              />
            ))}
          </div>
          <div className="w-36 h-28 mx-auto -mb-1">
            <KnowzaSprite
              pose="peek"
              outfit={outfit}
              accessory={accessory}
              mood="celebrate"
              className="w-full h-full drop-shadow-xl"
            />
          </div>
        </div>

        {/* Parchment Card */}
        <div className="parchment-card rounded-3xl pt-7 pb-5 px-5 relative z-20">
          <div className="bg-gradient-to-r from-[#ffcf33] via-[#ffe875] to-[#ffcf33] border-2 border-[#a85900] rounded-xl py-1 px-3 font-display text-base font-black text-[#471f04] shadow -mt-10 mb-3">
            Seviye {level.id} Tamamlandı!
          </div>

          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-black text-orange-800 bg-orange-100 border border-orange-300 rounded-full px-2.5 py-0.5">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              Seri: {winStreak} Galibiyet!
            </span>
            {streakBonusCoins > 0 && (
              <span className="text-[11px] font-black text-amber-800 bg-amber-100 border border-amber-300 rounded-full px-2.5 py-0.5">
                +{streakBonusCoins} Seri Altını
              </span>
            )}
            {bonusCoins > 0 && (
              <span className="text-[11px] font-black text-emerald-700 bg-emerald-100 border border-emerald-300 rounded-full px-2.5 py-0.5">
                +{bonusCoins} Alan Bonusu
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-2 mb-4 text-xs font-black">
            <div className="parchment-subcard rounded-xl px-2.5 py-1.5 flex items-center gap-1 text-[#5c2c09]">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> +{level.rewards.stars}
            </div>
            <div className="parchment-subcard rounded-xl px-2.5 py-1.5 flex items-center gap-1 text-[#5c2c09]">
              <Coins className="w-4 h-4 text-amber-600" /> +{level.rewards.coins + bonusCoins + streakBonusCoins}
            </div>
            <div className="parchment-subcard rounded-xl px-2.5 py-1.5 text-purple-800">
              +{level.rewards.xp} XP
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {hasNextLevel && (
              <button
                type="button"
                onClick={() => {
                  sfx.click();
                  onNextLevel();
                }}
                className="gold-btn w-full py-2.5 rounded-2xl font-display text-lg font-bold"
              >
                Devam Et
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                sfx.click();
                onMap();
              }}
              className="brown-btn w-full py-2 rounded-2xl font-bold text-sm"
            >
              Bilgi Dünyası
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 3. Fail Modal (Reference Image 1 - "Üzgünüm! Tekrar denemek ister misin?")
 * ========================================================================== */
export const FailModal: React.FC<{
  coins: number;
  lostStreak?: number;
  outfit?: OutfitId;
  accessory?: AccessoryId;
  onBuyMoves: () => void;
  onRetry: () => void;
  onMainMenu: () => void;
}> = ({ coins, lostStreak = 0, outfit = 'classic', accessory = 'none', onBuyMoves, onRetry, onMainMenu }) => {
  useEffect(() => {
    sfx.fail();
  }, []);

  const canAffordMoves = coins >= 150;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative max-w-xs w-full text-center animate-pop-in mt-14">
        <div className="font-display text-3xl font-black text-white text-stroke-brown mb-1">
          Üzgünüm!
        </div>

        {/* Animated sad Knowza peeking cleanly behind top rim of card */}
        <div className="w-32 h-24 mx-auto -mb-3 relative z-10">
          <KnowzaSprite
            pose="peek"
            outfit={outfit}
            accessory={accessory}
            mood="sad"
            className="w-full h-full drop-shadow-lg"
          />
        </div>

        <div className="parchment-card rounded-3xl pt-8 pb-5 px-5 relative z-20">
          {lostStreak > 0 && (
            <div className="mb-2 bg-rose-100 border border-rose-300 text-rose-800 rounded-xl px-3 py-1.5 text-[11px] font-black flex items-center justify-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-600 shrink-0" />
              <span>Eyvah! {lostStreak} galibiyetlik serin sıfırlandı!</span>
            </div>
          )}
          <p className="font-display text-base font-bold text-[#4a2306] mb-4 leading-snug">
            Yer kalmadı! Tekrar denemek ister misin?
          </p>

          <div className="flex flex-col gap-2.5">
            <button
              type="button"
              disabled={!canAffordMoves}
              onClick={() => {
                sfx.reward();
                onBuyMoves();
              }}
              className={`green-btn w-full py-2.5 rounded-2xl font-display text-base font-bold flex items-center justify-center gap-2 ${
                !canAffordMoves ? 'opacity-50 grayscale cursor-not-allowed' : ''
              }`}
            >
              <span>Alan Aç (Bomba)</span>
              <span className="bg-black/20 px-2 py-0.5 rounded-full text-xs flex items-center gap-1">
                <Coins className="w-3.5 h-3.5 text-yellow-300" /> 150
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.click();
                onRetry();
              }}
              className="gold-btn w-full py-2.5 rounded-2xl font-display text-lg font-bold flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Dene</span>
            </button>

            <button
              type="button"
              onClick={() => {
                sfx.click();
                onMainMenu();
              }}
              className="brown-btn w-full py-2 rounded-2xl font-bold text-sm"
            >
              Ana Menü
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 4. Shop Modal (Reference Image 1 Bottom-Left - Awning + 3 Tabs + 4 Columns)
 * ========================================================================== */
const BOOSTER_CATALOG: { type: InventoryBooster; name: string; desc: string; price: number }[] = [
  { type: 'hammer', name: 'Çekiç', desc: 'Tek bir küpü veya kutuyu kırar!', price: 100 },
  { type: 'rocket', name: 'Roket', desc: 'Satır veya sütun temizler!', price: 150 },
  { type: 'bomb', name: 'Bomba', desc: '3x3 alanı patlatır!', price: 200 },
  { type: 'disco', name: 'Gökkuşağı', desc: 'Seçilen renkteki tüm küpleri temizler!', price: 250 }
];

export const ShopModal: React.FC<{
  progress: PlayerProgress;
  initialTab?: 'boosters' | 'coins';
  onBuyBooster: (type: InventoryBooster, price: number) => void;
  onExchangeStarsForCoins: (starsCost: number, coinsGain: number) => void;
  onRefillHearts: () => void;
  onClose: () => void;
}> = ({
  progress,
  initialTab = 'boosters',
  onBuyBooster,
  onExchangeStarsForCoins,
  onRefillHearts,
  onClose
}) => {
  const [tab, setTab] = useState<'boosters' | 'coins' | 'gems'>(initialTab);
  const heartSecs = getNextHeartSeconds(progress);
  const fmt = (sec: number) => `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="parchment-card rounded-3xl overflow-hidden max-w-sm w-full relative animate-pop-in">
        {/* Red-and-Cream Awning Header matching Image 1 & 2 */}
        <div className="shop-awning pt-3 pb-2.5 px-4 flex items-center justify-between relative">
          <div className="w-7" />
          <div className="wood-ribbon px-6 py-1 rounded-full font-display text-lg font-bold text-[#fff3d1]">
            Mağaza
          </div>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-rose-600 border-2 border-white text-white flex items-center justify-center shadow"
          >
            <X className="w-4 h-4 stroke-[3]" />
          </button>
        </div>

        <div className="p-3.5">
          {/* Recessed 3-Tab Switch matching Image 1: Güçlendiriciler | Altın | Elmas */}
          <div className="bg-[#e8cb99] border border-[#c69554] rounded-2xl p-1 grid grid-cols-3 gap-1 mb-3">
            <button
              type="button"
              onClick={() => {
                sfx.click();
                setTab('boosters');
              }}
              className={`py-1.5 rounded-xl font-extrabold text-[11px] transition ${
                tab === 'boosters'
                  ? 'bg-[#fffaf0] text-[#4a2206] shadow'
                  : 'text-[#6e3d12]'
              }`}
            >
              Güçlendiriciler
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.click();
                setTab('coins');
              }}
              className={`py-1.5 rounded-xl font-extrabold text-[11px] transition ${
                tab === 'coins'
                  ? 'bg-[#fffaf0] text-[#4a2206] shadow'
                  : 'text-[#6e3d12]'
              }`}
            >
              Altın
            </button>
            <button
              type="button"
              onClick={() => {
                sfx.click();
                setTab('gems');
              }}
              className={`py-1.5 rounded-xl font-extrabold text-[11px] transition ${
                tab === 'gems'
                  ? 'bg-[#fffaf0] text-[#4a2206] shadow'
                  : 'text-[#6e3d12]'
              }`}
            >
              Elmas & Can
            </button>
          </div>

          {tab === 'boosters' && (
            /* 4-Column Horizontal Showcase matching Reference Image 1 */
            <div className="grid grid-cols-4 gap-1.5">
              {BOOSTER_CATALOG.map((item) => {
                const canAfford = progress.coins >= item.price;
                return (
                  <div
                    key={item.type}
                    className="parchment-subcard rounded-2xl py-2 px-1 flex flex-col items-center text-center"
                  >
                    <BoosterIcon type={item.type} className="w-11 h-11 drop-shadow" />
                    <div className="font-display text-xs font-black text-[#471f04] mt-1">
                      x1
                    </div>
                    <div className="text-[9px] font-bold text-[#7c4819] mb-1.5 truncate w-full">
                      {item.name}
                    </div>
                    <button
                      type="button"
                      disabled={!canAfford}
                      onClick={() => {
                        sfx.reward();
                        onBuyBooster(item.type, item.price);
                      }}
                      className={`gold-btn w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center gap-0.5 ${
                        !canAfford ? 'opacity-50 grayscale cursor-not-allowed' : ''
                      }`}
                    >
                      <Coins className="w-3 h-3" />
                      <span>{item.price}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'coins' && (
            <div className="flex flex-col gap-2">
              <div className="parchment-subcard rounded-2xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center">
                    <Coins className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-black text-[#471f04]">+250 Altın</div>
                    <div className="text-[10px] font-bold text-[#7c4819]">25 Yıldız ile takas et</div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={progress.stars < 25}
                  onClick={() => {
                    sfx.reward();
                    onExchangeStarsForCoins(25, 250);
                  }}
                  className={`gold-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 ${
                    progress.stars < 25 ? 'opacity-50 grayscale' : ''
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" /> 25
                </button>
              </div>

              <div className="parchment-subcard rounded-2xl p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-xl bg-yellow-100 border border-yellow-400 flex items-center justify-center">
                    <Coins className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <div className="font-display text-sm font-black text-[#471f04]">+800 Kraliyet Altını</div>
                    <div className="text-[10px] font-bold text-[#7c4819]">70 Yıldız ile takas et</div>
                  </div>
                </div>
                <button
                  type="button"
                  disabled={progress.stars < 70}
                  onClick={() => {
                    sfx.reward();
                    onExchangeStarsForCoins(70, 800);
                  }}
                  className={`gold-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 ${
                    progress.stars < 70 ? 'opacity-50 grayscale' : ''
                  }`}
                >
                  <Star className="w-3.5 h-3.5 fill-current" /> 70
                </button>
              </div>
            </div>
          )}

          {tab === 'gems' && (
            /* Enerjin Doluyor Card matching Reference Image 2 */
            <div className="parchment-subcard rounded-2xl p-3 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Zap className="w-7 h-7 text-amber-500 fill-amber-400" />
                <span className="font-display text-base font-black text-[#471f04]">
                  {progress.hearts >= progress.maxHearts ? 'Enerjin Tam!' : 'Enerjin Doluyor!'}
                </span>
              </div>
              <div className="text-xs font-extrabold text-[#7c4819] mb-3">
                Canlar: {progress.hearts}/{progress.maxHearts}{' '}
                {progress.hearts < progress.maxHearts && heartSecs > 0 ? `• ${fmt(heartSecs)}` : ''}
              </div>
              <button
                type="button"
                disabled={progress.hearts >= progress.maxHearts || progress.coins < 120}
                onClick={() => {
                  sfx.reward();
                  onRefillHearts();
                }}
                className={`gold-btn w-full py-2 rounded-2xl font-display text-sm font-bold flex items-center justify-center gap-1.5 ${
                  progress.hearts >= progress.maxHearts || progress.coins < 120
                    ? 'opacity-50 grayscale cursor-not-allowed'
                    : ''
                }`}
              >
                <Zap className="w-4 h-4 fill-current" />
                <span>Hemen Doldur</span>
                <span className="bg-black/10 px-2 py-0.5 rounded-full text-xs flex items-center gap-0.5">
                  <Coins className="w-3 h-3" /> 120
                </span>
              </button>
            </div>
          )}

          {/* Bottom Balances Footer */}
          <div className="flex items-center justify-center gap-4 mt-3 text-xs font-black text-[#5c2c09]">
            <span className="flex items-center gap-1">
              <Coins className="w-4 h-4 text-amber-600" /> {progress.coins.toLocaleString('tr-TR')}
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {progress.stars}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 5. Booster Detail Quick Popup (Reference Image 2 - "Güçlendiriciler")
 * ========================================================================== */
export const BoosterDetailModal: React.FC<{
  type: InventoryBooster;
  count: number;
  coins: number;
  onUseBooster: (type: InventoryBooster) => void;
  onBuyAndClose: (type: InventoryBooster, price: number) => void;
  onClose: () => void;
}> = ({ type, count, coins, onUseBooster, onBuyAndClose, onClose }) => {
  const item = BOOSTER_CATALOG.find((b) => b.type === type)!;
  const canAfford = coins >= item.price;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card rounded-3xl p-5 max-w-[270px] w-full text-center relative animate-pop-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="wood-ribbon inline-block px-5 py-1 rounded-full font-display text-base font-bold text-[#fff3d1] -mt-9 mb-2">
          Güçlendiriciler
        </div>

        <p className="text-xs font-extrabold text-[#5c2c09]">{item.desc}</p>

        <div className="my-4 flex justify-center relative">
          <BoosterIcon type={type} className="w-20 h-20 drop-shadow-lg" />
          <span className="absolute bottom-0 right-14 bg-[#4a2206] text-white text-xs font-black px-2 py-0.5 rounded-full border border-[#ffd466]">
            x{count}
          </span>
        </div>

        {count > 0 ? (
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onUseBooster(type);
            }}
            className="gold-btn w-full py-2.5 rounded-2xl font-display text-lg font-bold"
          >
            Kullan
          </button>
        ) : (
          <button
            type="button"
            disabled={!canAfford}
            onClick={() => {
              sfx.reward();
              onBuyAndClose(type, item.price);
            }}
            className={`gold-btn w-full py-2.5 rounded-2xl font-display text-base font-bold flex items-center justify-center gap-1.5 ${
              !canAfford ? 'opacity-50 grayscale' : ''
            }`}
          >
            <span>Satın Al</span>
            <Coins className="w-4 h-4" />
            <span>{item.price}</span>
          </button>
        )}
      </div>
    </div>
  );
};

/* ============================================================================
 * 6. Daily Login Modal (Reference Image 1 - "Günlük Giriş")
 * ========================================================================== */
const DAILY_REWARDS = [
  { day: 1, label: '50 Yıldız', stars: 50, coins: 0 },
  { day: 2, label: '100 Altın', stars: 0, coins: 100 },
  { day: 3, label: '50 Yıldız + 150 Altın', stars: 50, coins: 150 }
];

export const DailyLoginModal: React.FC<{
  progress: PlayerProgress;
  onClaim: (day: number, stars: number, coins: number) => void;
  onSpinWheelReward: (prize: WheelPrize, isFreeSpin: boolean, spinCoinCost: number) => void;
  onClose: () => void;
}> = ({ progress, onClaim, onSpinWheelReward, onClose }) => {
  const today = new Date().toISOString().slice(0, 10);
  const alreadyClaimedToday = progress.lastDailyClaimDate === today;
  const freeSpinReady = progress.lastWheelSpinDate !== today;
  const [tab, setTab] = useState<'login' | 'wheel'>(alreadyClaimedToday && freeSpinReady ? 'wheel' : 'login');
  const nextDayIndex = (progress.dailyClaimedDays.length % 3) + 1;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card rounded-3xl p-5 max-w-xs w-full text-center relative animate-pop-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="wood-ribbon inline-block px-5 py-1 rounded-full font-display text-base font-bold text-[#fff3d1] -mt-9 mb-2">
          {tab === 'login' ? 'Günlük Giriş' : 'Bilgi Çarkı'}
        </div>

        {/* Daily Check-In vs Interactive Lucky Wheel Switch */}
        <div className="bg-[#e8cb99] border border-[#c69554] rounded-2xl p-1 grid grid-cols-2 gap-1 mb-3">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setTab('login');
            }}
            className={`py-1 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 relative transition ${
              tab === 'login' ? 'bg-[#fffaf0] text-[#4a2206] shadow' : 'text-[#6e3d12]'
            }`}
          >
            <span>Günlük Ödül</span>
            {!alreadyClaimedToday && <span className="w-2 h-2 rounded-full bg-red-600" />}
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setTab('wheel');
            }}
            className={`py-1 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 relative transition ${
              tab === 'wheel' ? 'bg-[#fffaf0] text-[#4a2206] shadow' : 'text-[#6e3d12]'
            }`}
          >
            <span>Şans Çarkı</span>
            {freeSpinReady && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />}
          </button>
        </div>

        {tab === 'login' ? (
          <>
            <p className="text-xs font-extrabold text-[#6e3a10] mb-3">
              Her gün gel, ödüller kazan! (Seri: {progress.dailyStreak} gün)
            </p>

            <div className="grid grid-cols-3 gap-2 mb-4">
              {DAILY_REWARDS.map((r) => {
                const isTodayTarget = !alreadyClaimedToday && r.day === nextDayIndex;
                const claimed =
                  progress.dailyClaimedDays.includes(r.day) && (alreadyClaimedToday || r.day < nextDayIndex);
                return (
                  <div
                    key={r.day}
                    className={`parchment-subcard rounded-2xl py-2.5 px-1.5 flex flex-col items-center ${
                      isTodayTarget ? 'ring-2 ring-amber-400 bg-amber-50' : ''
                    }`}
                  >
                    <span className="text-[11px] font-black text-[#69370f]">{r.day}. Gün</span>
                    <div className="my-2">
                      {r.day === 1 ? (
                        <Star className="w-8 h-8 text-amber-500 fill-amber-400" />
                      ) : r.day === 2 ? (
                        <Coins className="w-8 h-8 text-amber-600" />
                      ) : (
                        <Gem className="w-8 h-8 text-purple-500 fill-purple-400" />
                      )}
                    </div>
                    <span className="text-xs font-black text-[#471f04]">{r.label}</span>
                    {claimed && <Check className="w-4 h-4 text-emerald-600 mt-1 stroke-[3]" />}
                  </div>
                );
              })}
            </div>

            {alreadyClaimedToday ? (
              <div className="flex flex-col gap-2">
                <div className="green-btn w-full py-2.5 rounded-2xl font-display text-base font-bold flex items-center justify-center gap-1.5">
                  <Check className="w-5 h-5 stroke-[3]" />
                  <span>Bugün Toplandı!</span>
                </div>
                {freeSpinReady && (
                  <button
                    type="button"
                    onClick={() => {
                      sfx.click();
                      setTab('wheel');
                    }}
                    className="gold-btn w-full py-2 rounded-2xl text-xs font-black"
                  >
                    Ücretsiz Şans Çarkını Çevir!
                  </button>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => {
                  const target = DAILY_REWARDS[nextDayIndex - 1];
                  sfx.reward();
                  confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
                  onClaim(target.day, target.stars, target.coins);
                }}
                className="gold-btn w-full py-2.5 rounded-2xl font-display text-lg font-bold"
              >
                Topla!
              </button>
            )}
          </>
        ) : (
          <LuckyWheel
            freeAvailable={freeSpinReady}
            coins={progress.coins}
            onAwardPrize={onSpinWheelReward}
          />
        )}
      </div>
    </div>
  );
};

/* ============================================================================
 * 7. Daily Quests Modal (Reference Image 2 - "Günlük Görevler")
 * ========================================================================== */
export const QuestsModal: React.FC<{
  progress: PlayerProgress;
  onClaimQuest: (questId: string) => void;
  onClose: () => void;
}> = ({ progress, onClaimQuest, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card rounded-3xl p-5 max-w-sm w-full relative animate-pop-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="text-center mb-3">
          <div className="wood-ribbon inline-block px-5 py-1 rounded-full font-display text-base font-bold text-[#fff3d1] -mt-9">
            Günlük Görevler
          </div>
          <div className="mt-1.5 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-orange-100 border border-orange-300 text-[10.5px] font-black text-orange-800">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            <span>Kazanma Serin: {progress.winStreak || 0} (Her gün yenilenir!)</span>
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {progress.quests.map((q) => {
            const pct = Math.min(100, Math.round((q.progress / q.target) * 100));
            const ready = !q.claimed && q.progress >= q.target;
            return (
              <div key={q.id} className="parchment-subcard rounded-2xl p-3">
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="font-extrabold text-sm text-[#471f04]">{q.title}</div>
                  <div className="text-[11px] font-black text-amber-800 inline-flex items-center gap-1">
                    +{q.rewardCoins} Altın • +{q.rewardStars}
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-3 bg-[#e2c693] rounded-full overflow-hidden border border-[#a87035]">
                    <div
                      className="h-full bg-gradient-to-r from-[#ffcf33] to-[#f97316] rounded-full transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-black text-[#5c2c09] tabular-nums">
                    {Math.min(q.progress, q.target)}/{q.target}
                  </span>
                  {ready && (
                    <button
                      type="button"
                      onClick={() => {
                        sfx.reward();
                        onClaimQuest(q.id);
                      }}
                      className="green-btn px-2.5 py-1 rounded-xl text-[11px] font-black"
                    >
                      Topla
                    </button>
                  )}
                  {q.claimed && <Check className="w-5 h-5 text-emerald-600 stroke-[3]" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 8. Profile & Koleksiyon Modal (Reference Image 1 & 2 - "Profil")
 * ========================================================================== */
const BADGE_CATALOG = [
  { id: 'welcome_bear', title: 'Bilgili Ayı', desc: 'Knowza Blast macerasına katıldın!' },
  { id: 'first_win', title: 'Başarı Rozeti', desc: 'İlk seviyeni tamamladın!' },
  { id: 'streak_3', title: 'Seri Avcısı', desc: 'Üst üste 3 galibiyet serisi yaptın!' },
  { id: 'streak_5', title: 'Durdurulamaz', desc: 'Üst üste 5 galibiyet serisi yakaladın!' },
  { id: 'block_master', title: 'Blok Ustası', desc: 'Sonsuz Blok Modunda 500+ skor yaptın!' },
  { id: 'pop_legend', title: 'Bilgi Avcısı', desc: 'Toplam 300+ küp patlattın!' },
  { id: 'line_king', title: 'Satır Kralı', desc: '10+ blok satırı temizledin!' },
  { id: 'academy_hero', title: 'Zirve Öğrenci', desc: 'Seviye 10 kilidini açtın!' },
  { id: 'castle_king', title: 'Kale Mimarı', desc: 'Bilgi Kalesi’nin 5 bölümünü de inşa ettin!' }
];

export const ProfileModal: React.FC<{
  progress: PlayerProgress;
  onRename: (name: string) => void;
  onOpenWardrobe?: () => void;
  onClose: () => void;
}> = ({ progress, onRename, onOpenWardrobe, onClose }) => {
  const [nameInput, setNameInput] = useState(progress.name);
  const nextXp = xpForNextLevel(progress.level);
  const xpPct = Math.min(100, Math.round((progress.xp / nextXp) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card rounded-3xl p-5 max-w-sm w-full relative animate-pop-in max-h-[88vh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="text-center mb-2">
          <div className="wood-ribbon inline-block px-6 py-1 rounded-full font-display text-base font-bold text-[#fff3d1]">
            Profil
          </div>
        </div>

        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto">
            <div className="w-24 h-24 rounded-full bg-gradient-to-b from-[#ffd468] to-[#b86714] p-1 border-4 border-[#6c3910] shadow-lg overflow-hidden">
              <div className="w-full h-full rounded-full overflow-hidden bg-gradient-to-b from-[#fff2bd] to-[#f4ae3b]">
                <KnowzaSprite
                  pose="portrait"
                  outfit={progress.equippedOutfit}
                  accessory={progress.equippedAccessory}
                  className="w-full h-full object-cover object-top scale-110"
                />
              </div>
            </div>
            <span className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#fff5db] border-2 border-[#7a4518] flex items-center justify-center shadow">
              <Pencil className="w-3.5 h-3.5 text-[#5c2c09]" />
            </span>
          </div>

          {onOpenWardrobe && (
            <button
              type="button"
              onClick={() => {
                sfx.click();
                onOpenWardrobe();
              }}
              className="gold-btn px-4 py-1 rounded-full text-xs font-black mt-2 inline-flex items-center gap-1"
            >
              <span>Kıyafet & Blok Tasarımı</span>
            </button>
          )}

          <div className="flex items-center justify-center gap-1.5 mt-2">
            <input
              value={nameInput}
              maxLength={14}
              onChange={(e) => setNameInput(e.target.value)}
              onBlur={() => {
                if (nameInput.trim()) onRename(nameInput.trim());
              }}
              className="font-display text-xl font-black text-[#471f04] bg-transparent border-b-2 border-amber-400 text-center w-36 focus:outline-none"
            />
          </div>
          <div className="text-xs font-extrabold text-[#6e3a10] mt-0.5">
            Seviye {progress.level}
          </div>

          <div className="w-52 h-3 bg-[#e2c693] rounded-full overflow-hidden border border-[#a87035] mx-auto mt-1.5">
            <div className="h-full bg-gradient-to-r from-[#ffcf33] to-[#f97316]" style={{ width: `${xpPct}%` }} />
          </div>
          <div className="text-[11px] font-black text-[#7a4518] mt-0.5">
            {progress.xp} / {nextXp} XP
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 my-3 text-center">
          <div className="parchment-subcard rounded-2xl p-2">
            <div className="font-display text-lg font-black text-[#471f04] flex items-center justify-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {progress.stars}
            </div>
            <div className="text-[10px] font-extrabold text-amber-800">Toplam Yıldız</div>
          </div>
          <div className="parchment-subcard rounded-2xl p-2">
            <div className="font-display text-lg font-black text-orange-600 flex items-center justify-center gap-1">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" /> {progress.winStreak || 0}
              <span className="text-[11px] font-black text-[#7a4518]">(Rekor {progress.bestWinStreak || 0})</span>
            </div>
            <div className="text-[10px] font-extrabold text-amber-800">Kazanma Serisi</div>
          </div>
          <div className="parchment-subcard rounded-2xl p-2">
            <div className="font-display text-lg font-black text-[#471f04]">{progress.dailyStreak}</div>
            <div className="text-[10px] font-extrabold text-amber-800">Günlük Seri</div>
          </div>
          <div className="parchment-subcard rounded-2xl p-2">
            <div className="font-display text-lg font-black text-[#471f04]">{progress.highBlockScore}</div>
            <div className="text-[10px] font-extrabold text-amber-800">Blok Rekor</div>
          </div>
        </div>

        <div className="font-display text-sm font-black text-[#471f04] mb-2">
          Koleksiyon ({progress.badges.length}/{BADGE_CATALOG.length})
        </div>
        <div className="grid grid-cols-3 gap-2">
          {BADGE_CATALOG.map((b) => {
            const owned = progress.badges.includes(b.id);
            return (
              <div
                key={b.id}
                title={b.desc}
                className={`parchment-subcard rounded-2xl p-2 text-center flex flex-col items-center gap-1 ${
                  owned ? '' : 'opacity-45 grayscale'
                }`}
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-b from-[#ffe259] to-[#d97706] flex items-center justify-center shadow">
                  <Award className="w-5 h-5 text-[#471f04]" />
                </div>
                <div className="text-[10px] font-black text-[#471f04] leading-tight">{b.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 9. Settings & Pause Modals
 * ========================================================================== */
export const SettingsModal: React.FC<{
  progress: PlayerProgress;
  isPauseMode?: boolean;
  onToggleSound: () => void;
  onToggleHaptics: () => void;
  onRestartLevel?: () => void;
  onExitToMap?: () => void;
  onClose: () => void;
}> = ({
  progress,
  isPauseMode = false,
  onToggleSound,
  onToggleHaptics,
  onRestartLevel,
  onExitToMap,
  onClose
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card rounded-3xl p-5 max-w-xs w-full text-center relative animate-pop-in">
        <button
          type="button"
          onClick={onClose}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="wood-ribbon inline-block px-5 py-1 rounded-full font-display text-base font-bold text-[#fff3d1] -mt-9 mb-3">
          {isPauseMode ? 'Duraklatıldı' : 'Ayarlar'}
        </div>

        <div className="flex flex-col gap-2.5 mb-4">
          <button
            type="button"
            onClick={onToggleSound}
            className="parchment-subcard rounded-2xl px-4 py-2.5 flex items-center justify-between font-extrabold text-sm text-[#471f04]"
          >
            <span className="flex items-center gap-2">
              {progress.soundEnabled ? <Volume2 className="w-5 h-5 text-emerald-600" /> : <VolumeX className="w-5 h-5 text-rose-500" />}
              Ses Efektleri
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs ${progress.soundEnabled ? 'bg-emerald-500 text-white' : 'bg-stone-300 text-stone-700'}`}>
              {progress.soundEnabled ? 'Açık' : 'Kapalı'}
            </span>
          </button>

          <button
            type="button"
            onClick={onToggleHaptics}
            className="parchment-subcard rounded-2xl px-4 py-2.5 flex items-center justify-between font-extrabold text-sm text-[#471f04]"
          >
            <span className="flex items-center gap-2">
              <Vibrate className="w-5 h-5 text-amber-600" />
              Titreşim (Haptik)
            </span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs ${progress.hapticsEnabled ? 'bg-emerald-500 text-white' : 'bg-stone-300 text-stone-700'}`}>
              {progress.hapticsEnabled ? 'Açık' : 'Kapalı'}
            </span>
          </button>

          <div className="parchment-subcard rounded-2xl p-3 text-left text-[11px] font-bold text-[#66360f]">
            <div className="flex items-center gap-1 font-black text-[#471f04] mb-1">
              <HelpCircle className="w-3.5 h-3.5" /> Nasıl Oynanır?
            </div>
            • <b>Block Blast Macera:</b> 3 parçayı 8×8 tahtaya sürükle. Tam satır/sütun doldurunca hedefler toplanır!
            <br />• <b>Knowza Ateşi & Özel Parçalar:</b> Seri yapınca <b>Ateş 2×</b> dolar; Roket/Bomba küplü parçalar zincir patlama açar!
            <br />• <b>Taktik & Güçlendiriciler:</b> Döndür, Yenile ve Çekiç/Bomba güçlerini kullan!
          </div>
        </div>

        <div className="flex flex-col gap-2">
          {isPauseMode && (progress.winStreak || 0) > 0 && (
            <div className="bg-amber-100 border border-amber-400 text-amber-900 rounded-xl px-2.5 py-1.5 text-[10.5px] font-black flex items-center justify-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-orange-500 shrink-0" />
              <span>Çıkarsan {progress.winStreak} galibiyetlik serin sıfırlanır!</span>
            </div>
          )}
          <button type="button" onClick={onClose} className="gold-btn w-full py-2.5 rounded-2xl font-display text-lg font-bold">
            Devam Et
          </button>
          {isPauseMode && onRestartLevel && (
            <button type="button" onClick={onRestartLevel} className="brown-btn w-full py-2 rounded-2xl font-bold text-sm">
              Seviyeyi Yeniden Başlat
            </button>
          )}
          {isPauseMode && onExitToMap && (
            <button type="button" onClick={onExitToMap} className="brown-btn w-full py-2 rounded-2xl font-bold text-sm opacity-90">
              Bilgi Dünyası'na Çık
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

/* ============================================================================
 * 10. Royal Match Style "Bilgi Kalesi İnşası" (Spend Stars to Upgrade Castle!)
 * ========================================================================== */
const CASTLE_LANDMARKS = [
  { id: 'fountain', name: 'Altın Bilgi Çeşmesi', cost: 20, rewardCoins: 150, desc: 'Meydanın parlayan kalbi' },
  { id: 'library', name: 'Büyük Kütüphane', cost: 35, rewardCoins: 220, desc: 'Knowza’nın bilgelik arşivi' },
  { id: 'tower', name: 'Roket Gözlem Kulesi', cost: 50, rewardCoins: 300, desc: 'Göklerden kombo izler' },
  { id: 'garden', name: 'Yıldız Çiçek Bahçesi', cost: 70, rewardCoins: 400, desc: 'Adanın huzur köşesi' },
  { id: 'throne', name: 'Büyük Taht Salonu', cost: 100, rewardCoins: 600, desc: 'Knowza Dünyası’nın zirvesi!' }
];

export const CastleModal: React.FC<{
  progress: PlayerProgress;
  onBuildStage: (id: string, costStars: number, rewardCoins: number) => void;
  onClose: () => void;
}> = ({ progress, onBuildStage, onClose }) => {
  const [selectedStageId, setSelectedStageId] = useState<string | null>(null);
  const builtCount = Object.values(progress.castleStages || {}).filter((v) => v > 0).length;

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="parchment-card rounded-3xl p-4 sm:p-5 max-w-sm w-full relative animate-pop-in max-h-[88vh] overflow-y-auto no-scrollbar">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow z-10"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="text-center mb-2.5">
          <div className="wood-ribbon inline-block px-5 py-1 rounded-full font-display text-base font-bold text-[#fff3d1]">
            Bilgi Kalesi ({builtCount}/5)
          </div>
          <p className="text-[11px] font-bold text-[#6e3a10] mt-1">
            Yıldızlarınla yapıları dik, canlı kalede yükselip altın kazan!
          </p>
          <div className="inline-flex items-center gap-1.5 wood-pill text-white text-xs font-black px-3 py-1 rounded-full mt-1.5">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span>Mevcut Yıldız: {progress.stars}</span>
          </div>
        </div>

        {/* Live Animated Castle Diorama Preview */}
        <div className="mb-3">
          <CastleDiorama
            stages={progress.castleStages || {}}
            outfit={progress.equippedOutfit}
            accessory={progress.equippedAccessory}
            highlightedId={selectedStageId}
            onSelectLandmark={(id) => {
              sfx.click();
              setSelectedStageId((cur) => (cur === id ? null : id));
            }}
          />
        </div>

        <div className="flex flex-col gap-2">
          {CASTLE_LANDMARKS.map((lm) => {
            const built = (progress.castleStages?.[lm.id] || 0) > 0;
            const canAfford = progress.stars >= lm.cost;
            const isHighlighted = selectedStageId === lm.id;
            return (
              <div
                key={lm.id}
                onMouseEnter={() => setSelectedStageId(lm.id)}
                className={`parchment-subcard rounded-2xl p-2.5 flex items-center justify-between gap-2 transition ${
                  isHighlighted ? 'ring-2 ring-amber-500 bg-amber-50/90' : ''
                }`}
              >
                <div>
                  <div className="font-display text-sm font-black text-[#471f04]">{lm.name}</div>
                  <div className="text-[10px] font-bold text-[#7c4819]">{lm.desc}</div>
                  <div className="text-[10px] font-black text-emerald-700 mt-0.5">
                    Ödül: +{lm.rewardCoins} Altın
                  </div>
                </div>
                {built ? (
                  <span className="green-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" /> Tamam
                  </span>
                ) : (
                  <button
                    type="button"
                    disabled={!canAfford}
                    onClick={() => {
                      sfx.win();
                      confetti({ particleCount: 45, spread: 60, origin: { y: 0.55 } });
                      setSelectedStageId(lm.id);
                      onBuildStage(lm.id, lm.cost, lm.rewardCoins);
                    }}
                    className={`gold-btn px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 shrink-0 ${
                      !canAfford ? 'opacity-50 grayscale cursor-not-allowed' : ''
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 fill-current" /> {lm.cost}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

