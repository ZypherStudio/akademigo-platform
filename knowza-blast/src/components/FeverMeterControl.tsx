import React, { useState } from 'react';
import { Coins, Flame, HelpCircle, X, Zap } from 'lucide-react';
import { sfx } from '../utils/sound';

export const INSTANT_FEVER_COIN_COST = 100;

interface FeverMeterControlProps {
  feverPct: number;
  feverTurns: number;
  panelClass?: string;
  coins?: number;
  onInstantIgnite?: () => void;
}

/**
 * Interactive Fever Meter pill explaining the Knowza Ateşi mechanic on tap and
 * optionally letting the player ignite 2x Fever + 3 Lightning strikes on demand.
 */
export const FeverMeterControl: React.FC<FeverMeterControlProps> = ({
  feverPct,
  feverTurns,
  panelClass = 'wood-pill',
  coins = 0,
  onInstantIgnite
}) => {
  const [open, setOpen] = useState(false);
  const pct = Math.min(100, Math.max(0, Math.round(feverPct)));
  const canAfford = coins >= INSTANT_FEVER_COIN_COST;

  return (
    <div className="relative flex-1 min-w-0">
      <button
        type="button"
        onClick={() => {
          sfx.click();
          setOpen((v) => !v);
        }}
        title="Knowza Ateşi Nedir?"
        className={`w-full ${panelClass} rounded-full px-2.5 py-1 flex items-center gap-1.5 transition-transform active:scale-95 ${
          feverTurns > 0 ? 'ring-2 ring-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.75)]' : ''
        }`}
      >
        <Flame
          className={`w-3.5 h-3.5 shrink-0 ${
            feverTurns > 0
              ? 'text-orange-400 fill-orange-400 animate-bounce'
              : 'text-amber-300 fill-amber-400/40'
          }`}
        />
        {feverTurns > 0 ? (
          <span className="text-[10.5px] font-black text-amber-200 tracking-wide whitespace-nowrap truncate">
            ATEŞ 2× • {feverTurns} Hamle
          </span>
        ) : (
          <div className="flex-1 flex items-center gap-1.5 min-w-0">
            <span className="text-[9.5px] font-black text-[#ffe7a8] shrink-0">Ateş</span>
            <div className="flex-1 h-2 bg-black/50 rounded-full overflow-hidden border border-white/20">
              <div
                className="h-full bg-gradient-to-r from-[#ff9f0a] via-[#ff5e1a] to-[#ffe055] rounded-full transition-all duration-300"
                style={{ width: `${pct}%` }}
              />
            </div>
            <span className="text-[9.5px] font-black text-[#ffd875] tabular-nums shrink-0">
              %{pct}
            </span>
            <HelpCircle className="w-3 h-3 text-amber-200/80 shrink-0" />
          </div>
        )}
      </button>

      {open && (
        <div className="absolute bottom-full left-0 mb-2 w-64 sm:w-72 parchment-card rounded-2xl p-3 text-left shadow-2xl z-50 animate-pop-in">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-6 rounded-full bg-gradient-to-b from-amber-400 to-orange-600 flex items-center justify-center shadow">
                <Flame className="w-3.5 h-3.5 text-white fill-white" />
              </span>
              <span className="font-display text-xs font-black text-[#471f04]">
                {feverTurns > 0 ? `Ateş 2× Aktif (${feverTurns} Hamle)` : `Knowza Ateşi • %${pct}`}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                sfx.click();
                setOpen(false);
              }}
              aria-label="Kapat"
              className="w-5 h-5 rounded-full bg-[#6b3910]/15 text-[#471f04] flex items-center justify-center hover:bg-[#6b3910]/25"
            >
              <X className="w-3 h-3 stroke-[3]" />
            </button>
          </div>

          <p className="text-[11px] font-bold text-[#6e3a10] leading-snug">
            {feverTurns > 0
              ? 'Kalan hamlelerde tüm hedefler, skorlar ve bonus küpler 2× güçle patlar!'
              : 'Blok dizip satır temizledikçe Ateş dolar. %100 olunca tahtaya 3 Yıldırım düşer ve 3 hamle 2× Hedef açılır!'}
          </p>

          {feverTurns === 0 && onInstantIgnite && (
            <button
              type="button"
              disabled={!canAfford}
              onClick={() => {
                sfx.fever();
                onInstantIgnite();
                setOpen(false);
              }}
              className={`mt-2 w-full py-1.5 px-2.5 rounded-xl text-[11px] font-black flex items-center justify-center gap-1.5 ${
                canAfford
                  ? 'orange-btn'
                  : 'bg-stone-300 text-stone-600 border border-stone-400 cursor-not-allowed'
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Hemen Ateşle</span>
              <span className="inline-flex items-center gap-0.5 bg-black/20 px-1.5 py-0.5 rounded-full text-[10px]">
                <Coins className="w-3 h-3 text-yellow-300" /> {INSTANT_FEVER_COIN_COST}
              </span>
            </button>
          )}
        </div>
      )}
    </div>
  );
};
