import React from 'react';
import { Calendar, Coins, Crown, Gift, Map, Play, Shirt, ShoppingBag, Sparkles, Star, Trophy } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { LevelConfig, PlayerProgress } from '../types/game';
import { assetUrl } from '../utils/assets';
import { sfx } from '../utils/sound';
import { CubeTile } from './CubeTile';
import { KnowzaSprite } from './KnowzaSprite';

interface HomeMenuScreenProps {
  progress: PlayerProgress;
  onPlayCurrent: (level: LevelConfig) => void;
  onOpenMap: () => void;
  onOpenEndless: () => void;
  onOpenWardrobe: () => void;
  onOpenQuests: () => void;
  onOpenDaily: () => void;
  onOpenShop: () => void;
  onOpenProfile: () => void;
  onOpenCastle: () => void;
}

export const HomeMenuScreen: React.FC<HomeMenuScreenProps> = ({
  progress,
  onPlayCurrent,
  onOpenMap,
  onOpenEndless,
  onOpenWardrobe,
  onOpenQuests,
  onOpenDaily,
  onOpenShop,
  onOpenProfile,
  onOpenCastle
}) => {
  const currentLvl = LEVELS.find((l) => l.id === progress.unlockedLevel) || LEVELS[0];
  const today = new Date().toISOString().slice(0, 10);
  const dailyAvailable = progress.lastDailyClaimDate !== today;
  const questClaimable = progress.quests.some((q) => !q.claimed && q.progress >= q.target);

  const previewSteps = [
    Math.max(1, progress.unlockedLevel - 1),
    progress.unlockedLevel,
    Math.min(LEVELS.length, progress.unlockedLevel + 1),
    Math.min(LEVELS.length, progress.unlockedLevel + 2)
  ].filter((v, idx, arr) => arr.indexOf(v) === idx);

  return (
    <div className="relative flex-1 w-full h-full overflow-hidden flex flex-col justify-between bg-gradient-to-b from-[#4a260b] via-[#341805] to-[#230e02]">
      {/* Warm wood backdrop texture */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,198,92,0.16),transparent_55%)] pointer-events-none" />

      {/* Main Content below Floating TopHud */}
      <div className="relative z-20 flex-1 flex flex-col gap-2.5 px-3 pt-14 pb-2 overflow-y-auto no-scrollbar">
        {/* Coin Balance + Castle Bar */}
        <div className="flex items-center justify-between gap-2">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenShop();
            }}
            className="wood-pill rounded-full px-3 py-1 flex items-center gap-1.5 shadow active:scale-95 transition-transform"
          >
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-xs font-black text-white tabular-nums">
              {progress.coins.toLocaleString('tr-TR')} Altın
            </span>
          </button>

          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenCastle();
            }}
            className="wood-pill rounded-full px-3 py-1 flex items-center gap-1.5 shadow active:scale-95 transition-transform"
          >
            <Crown className="w-4 h-4 text-amber-300" />
            <span className="text-xs font-black text-[#fff3d1]">
              Kale {Object.values(progress.castleStages || {}).filter((v) => v > 0).length}/5
            </span>
          </button>
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

          {/* Center Hero Card: "Knowza Blast" Castle World Preview */}
          <div className="flex-1 relative rounded-3xl overflow-hidden border-[3px] border-[#b87635] shadow-2xl min-h-[252px] flex flex-col justify-between">
            <img
              src={assetUrl('assets/bg_world_map.jpg')}
              alt="Knowza Blast"
              className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#2f1605]/45 via-transparent to-[#241003]/75 pointer-events-none" />

            {/* Top Hero Title + Reward Chest */}
            <div className="relative z-10 p-2.5 flex items-start justify-between gap-1">
              <div className="bg-[#3d1e07]/78 backdrop-blur-sm border border-[#e3a857]/60 rounded-2xl px-2.5 py-1.5">
                <h1 className="font-display text-base font-black text-[#fff3d1] leading-tight">
                  Knowza Blast
                </h1>
                <p className="text-[10px] font-bold text-[#ffdf94] leading-tight mt-0.5">
                  Blokları yerleştir, satırları patlat!
                </p>
              </div>

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
            </div>

            {/* Knowza Mascot + Stepping Pedestal Preview */}
            <div className="relative z-10 px-2 pb-2.5 flex items-end justify-between">
              <div className="w-24 h-24 shrink-0 animate-float-slow -ml-1">
                <KnowzaSprite
                  pose="flag"
                  outfit={progress.equippedOutfit}
                  accessory={progress.equippedAccessory}
                  className="w-full h-full object-contain drop-shadow-[0_6px_12px_rgba(0,0,0,0.5)]"
                />
              </div>

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
                          ? 'pedestal-gold scale-110'
                          : unlocked
                          ? 'pedestal-done'
                          : 'pedestal-stone opacity-85'
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
                          isCurr ? 'text-[#4e2200]' : 'text-white'
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

        {/* Secondary Dual Cards: "Sonsuz Blok Blast" + "Karakter & Blok Tasarımı" */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Classic Endless Block Blast Card */}
          <button
            type="button"
            onClick={() => {
              sfx.click();
              onOpenEndless();
            }}
            className="parchment-card rounded-2xl p-2.5 text-left flex flex-col justify-between gap-2 active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="grid grid-cols-2 gap-0.5 p-1 rounded-lg bg-[#6b3915]">
                <span className="w-3 h-3 rounded-[3px] bg-sky-400" />
                <span className="w-3 h-3 rounded-[3px] bg-amber-400" />
                <span className="w-3 h-3 rounded-[3px] bg-rose-500" />
                <span className="w-3 h-3 rounded-[3px] bg-emerald-400" />
              </div>
              <span className="text-[10px] font-black bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                Rekor: {progress.highBlockScore}
              </span>
            </div>
            <div>
              <div className="font-display text-sm font-black text-[#471f04]">Sonsuz Blok</div>
              <div className="text-[10px] font-bold text-[#7c4819] leading-tight">
                Klasik Block Blast yüksek skor yarışı!
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
            className="parchment-card rounded-2xl p-2.5 text-left flex flex-col justify-between gap-2 active:scale-95 transition-transform"
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-1">
                <div className="w-6 h-6">
                  <CubeTile
                    cell={{ uid: 'demo_b', color: 'blue' }}
                    theme={progress.equippedBlockTheme}
                  />
                </div>
                <div className="w-6 h-6">
                  <CubeTile
                    cell={{ uid: 'demo_y', color: 'yellow' }}
                    theme={progress.equippedBlockTheme}
                  />
                </div>
              </div>
              <Shirt className="w-5 h-5 text-rose-600" />
            </div>
            <div>
              <div className="font-display text-sm font-black text-[#471f04]">Karakter & Blok</div>
              <div className="text-[10px] font-bold text-[#7c4819] leading-tight">
                Tişört, Karate & Küp tasarımı seç!
              </div>
            </div>
          </button>
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
