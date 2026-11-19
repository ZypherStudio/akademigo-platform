import React, { useState } from 'react';
import { Check, Coins, Crown, Palette, Shirt, X } from 'lucide-react';
import { ACCESSORY_CATALOG, BLOCK_THEME_CATALOG, OUTFIT_CATALOG } from '../data/customization';
import { AccessoryId, BlockThemeId, OutfitId, PlayerProgress } from '../types/game';
import { sfx } from '../utils/sound';
import { CubeTile } from './CubeTile';
import { KnowzaSprite } from './KnowzaSprite';

interface WardrobeModalProps {
  progress: PlayerProgress;
  onSelectOrBuyOutfit: (id: OutfitId, price: number) => void;
  onSelectOrBuyAccessory: (id: AccessoryId, price: number) => void;
  onSelectOrBuyBlockTheme: (id: BlockThemeId, price: number) => void;
  onClose: () => void;
}

export const WardrobeModal: React.FC<WardrobeModalProps> = ({
  progress,
  onSelectOrBuyOutfit,
  onSelectOrBuyAccessory,
  onSelectOrBuyBlockTheme,
  onClose
}) => {
  const [tab, setTab] = useState<'outfits' | 'accessories' | 'blocks'>('outfits');

  return (
    <div className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-3">
      <div className="parchment-card rounded-3xl p-4 max-w-sm w-full relative animate-pop-in max-h-[90vh] flex flex-col">
        <button
          type="button"
          onClick={() => {
            sfx.click();
            onClose();
          }}
          className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-rose-500 border-2 border-white text-white flex items-center justify-center shadow"
        >
          <X className="w-4 h-4 stroke-[3]" />
        </button>

        <div className="text-center mb-2">
          <div className="wood-ribbon inline-block px-5 py-1 rounded-full font-display text-base font-bold text-[#fff3d1] -mt-8">
            Karakter & Blok Tasarımı
          </div>
        </div>

        {/* Live Interactive Preview Stage */}
        <div className="parchment-subcard rounded-2xl p-3 mb-3 flex items-center justify-between gap-3 bg-gradient-to-r from-[#fff8e2] to-[#f8dfac]">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-b from-[#6fd1ff] to-[#a7e6ff] border-2 border-[#a86f34] p-1 flex items-center justify-center shrink-0 shadow-inner">
            <KnowzaSprite
              pose="flag"
              outfit={progress.equippedOutfit}
              accessory={progress.equippedAccessory}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex-1">
            <div className="text-[10px] font-black uppercase text-amber-800">Aktif Görünüm</div>
            <div className="font-display text-sm font-black text-[#471f04]">
              {OUTFIT_CATALOG.find((o) => o.id === progress.equippedOutfit)?.name}
            </div>
            <div className="text-[11px] font-bold text-[#754014] mb-1.5">
              Blok: {BLOCK_THEME_CATALOG.find((b) => b.id === progress.equippedBlockTheme)?.name}
            </div>
            <div className="grid grid-cols-4 gap-1 w-32">
              {(['blue', 'yellow', 'red', 'green'] as const).map((c) => (
                <div key={c} className="w-7 h-7">
                  <CubeTile cell={{ uid: `prev_${c}`, color: c }} theme={progress.equippedBlockTheme} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 3 Category Tabs */}
        <div className="bg-[#e8cb99] border border-[#c69554] rounded-2xl p-1 grid grid-cols-3 gap-1 mb-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setTab('outfits');
            }}
            className={`py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 ${
              tab === 'outfits' ? 'bg-[#fffaf0] text-[#4a2206] shadow' : 'text-[#6e3d12]'
            }`}
          >
            <Shirt className="w-3.5 h-3.5" /> Kıyafet
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setTab('accessories');
            }}
            className={`py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 ${
              tab === 'accessories' ? 'bg-[#fffaf0] text-[#4a2206] shadow' : 'text-[#6e3d12]'
            }`}
          >
            <Crown className="w-3.5 h-3.5" /> Aksesuar
          </button>
          <button
            type="button"
            onClick={() => {
              sfx.click();
              setTab('blocks');
            }}
            className={`py-1.5 rounded-xl font-extrabold text-[11px] flex items-center justify-center gap-1 ${
              tab === 'blocks' ? 'bg-[#fffaf0] text-[#4a2206] shadow' : 'text-[#6e3d12]'
            }`}
          >
            <Palette className="w-3.5 h-3.5" /> Bloklar
          </button>
        </div>

        {/* Scrollable Grid */}
        <div className="overflow-y-auto no-scrollbar flex-1 pr-0.5">
          {tab === 'outfits' && (
            <div className="grid grid-cols-2 gap-2">
              {OUTFIT_CATALOG.map((item) => {
                const owned = progress.unlockedOutfits.includes(item.id);
                const equipped = progress.equippedOutfit === item.id;
                const canAfford = progress.coins >= item.priceCoins;
                return (
                  <div
                    key={item.id}
                    className={`parchment-subcard rounded-2xl p-2 flex flex-col items-center text-center ${
                      equipped ? 'ring-2 ring-emerald-500 bg-emerald-50/60' : ''
                    }`}
                  >
                    <div className="w-16 h-14 flex items-center justify-center mb-1">
                      <KnowzaSprite
                        pose="peek"
                        outfit={item.id}
                        accessory={progress.equippedAccessory}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="font-display text-xs font-black text-[#471f04]">{item.name}</div>
                    <div className="text-[9.5px] font-bold text-[#7c4819] leading-tight my-1 min-h-[24px]">
                      {item.desc}
                    </div>
                    {equipped ? (
                      <span className="green-btn w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Giyili
                      </span>
                    ) : owned ? (
                      <button
                        type="button"
                        onClick={() => {
                          sfx.click();
                          onSelectOrBuyOutfit(item.id, 0);
                        }}
                        className="gold-btn w-full py-1 rounded-xl text-[10px] font-black"
                      >
                        Giy
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          sfx.reward();
                          onSelectOrBuyOutfit(item.id, item.priceCoins);
                        }}
                        className={`gold-btn w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 ${
                          !canAfford ? 'opacity-50 grayscale cursor-not-allowed' : ''
                        }`}
                      >
                        <Coins className="w-3 h-3" /> {item.priceCoins}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'accessories' && (
            <div className="grid grid-cols-2 gap-2">
              {ACCESSORY_CATALOG.map((item) => {
                const owned = progress.unlockedAccessories.includes(item.id);
                const equipped = progress.equippedAccessory === item.id;
                const canAfford = progress.coins >= item.priceCoins;
                return (
                  <div
                    key={item.id}
                    className={`parchment-subcard rounded-2xl p-2 flex flex-col items-center text-center ${
                      equipped ? 'ring-2 ring-emerald-500 bg-emerald-50/60' : ''
                    }`}
                  >
                    <div className="w-14 h-14 mb-1">
                      <KnowzaSprite
                        pose="portrait"
                        outfit={progress.equippedOutfit}
                        accessory={item.id}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="font-display text-xs font-black text-[#471f04]">
                      {item.iconLabel} {item.name}
                    </div>
                    <div className="text-[9.5px] font-bold text-[#7c4819] leading-tight my-1 min-h-[24px]">
                      {item.desc}
                    </div>
                    {equipped ? (
                      <span className="green-btn w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Takılı
                      </span>
                    ) : owned ? (
                      <button
                        type="button"
                        onClick={() => {
                          sfx.click();
                          onSelectOrBuyAccessory(item.id, 0);
                        }}
                        className="gold-btn w-full py-1 rounded-xl text-[10px] font-black"
                      >
                        Tak
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          sfx.reward();
                          onSelectOrBuyAccessory(item.id, item.priceCoins);
                        }}
                        className={`gold-btn w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 ${
                          !canAfford ? 'opacity-50 grayscale cursor-not-allowed' : ''
                        }`}
                      >
                        <Coins className="w-3 h-3" /> {item.priceCoins}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {tab === 'blocks' && (
            <div className="grid grid-cols-2 gap-2">
              {BLOCK_THEME_CATALOG.map((item) => {
                const owned = progress.unlockedBlockThemes.includes(item.id);
                const equipped = progress.equippedBlockTheme === item.id;
                const canAfford = progress.coins >= item.priceCoins;
                return (
                  <div
                    key={item.id}
                    className={`parchment-subcard rounded-2xl p-2 flex flex-col items-center text-center ${
                      equipped ? 'ring-2 ring-emerald-500 bg-emerald-50/60' : ''
                    }`}
                  >
                    <div className="grid grid-cols-2 gap-1 w-14 h-14 mb-1">
                      {(['blue', 'yellow', 'red', 'green'] as const).map((c) => (
                        <CubeTile key={c} cell={{ uid: `${item.id}_${c}`, color: c }} theme={item.id} />
                      ))}
                    </div>
                    <div className="font-display text-xs font-black text-[#471f04]">{item.name}</div>
                    <div className="text-[9.5px] font-bold text-[#7c4819] leading-tight my-1 min-h-[24px]">
                      {item.desc}
                    </div>
                    {equipped ? (
                      <span className="green-btn w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> Seçili
                      </span>
                    ) : owned ? (
                      <button
                        type="button"
                        onClick={() => {
                          sfx.click();
                          onSelectOrBuyBlockTheme(item.id, 0);
                        }}
                        className="gold-btn w-full py-1 rounded-xl text-[10px] font-black"
                      >
                        Seç
                      </button>
                    ) : (
                      <button
                        type="button"
                        disabled={!canAfford}
                        onClick={() => {
                          sfx.reward();
                          onSelectOrBuyBlockTheme(item.id, item.priceCoins);
                        }}
                        className={`gold-btn w-full py-1 rounded-xl text-[10px] font-black flex items-center justify-center gap-1 ${
                          !canAfford ? 'opacity-50 grayscale cursor-not-allowed' : ''
                        }`}
                      >
                        <Coins className="w-3 h-3" /> {item.priceCoins}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="mt-2.5 flex items-center justify-center gap-1.5 text-xs font-black text-[#5c2c09]">
          <Coins className="w-4 h-4 text-amber-600" />
          <span>Altının: {progress.coins.toLocaleString('tr-TR')}</span>
        </div>
      </div>
    </div>
  );
};
