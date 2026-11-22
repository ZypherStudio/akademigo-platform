import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Coins, Sparkles, Star } from 'lucide-react';
import { InventoryBooster } from '../types/game';
import { sfx } from '../utils/sound';

export interface WheelPrize {
  id: string;
  label: string;
  shortLabel: string;
  kind: 'coins' | 'stars' | 'booster';
  amount: number;
  booster?: InventoryBooster;
  fill: string;
  accent: string;
}

export const WHEEL_PRIZES: WheelPrize[] = [
  { id: 'c100', label: '+100 Altın', shortLabel: '100', kind: 'coins', amount: 100, fill: '#f59e0b', accent: '#fffbeb' },
  { id: 'bham', label: '+1 Çekiç', shortLabel: 'Çekiç', kind: 'booster', booster: 'hammer', amount: 1, fill: '#6366f1', accent: '#eef2ff' },
  { id: 's15', label: '+15 Yıldız', shortLabel: '15', kind: 'stars', amount: 15, fill: '#10b981', accent: '#ecfdf5' },
  { id: 'c220', label: '+220 Altın', shortLabel: '220', kind: 'coins', amount: 220, fill: '#ea580c', accent: '#fff7ed' },
  { id: 'broc', label: '+1 Roket', shortLabel: 'Roket', kind: 'booster', booster: 'rocket', amount: 1, fill: '#ec4899', accent: '#fdf2f8' },
  { id: 'bdis', label: '+1 Disko', shortLabel: 'Disko', kind: 'booster', booster: 'disco', amount: 1, fill: '#0284c7', accent: '#f0f9ff' }
];

const EXTRA_SPIN_COST = 120;

interface LuckyWheelProps {
  freeAvailable: boolean;
  coins: number;
  onAwardPrize: (prize: WheelPrize, isFreeSpin: boolean, spinCoinCost: number) => void;
}

function polarToCartesian(cx: number, cy: number, r: number, clockDeg: number) {
  const rad = ((clockDeg - 90) * Math.PI) / 180;
  return {
    x: cx + r * Math.cos(rad),
    y: cy + r * Math.sin(rad)
  };
}

function wedgePath(cx: number, cy: number, r: number, startDeg: number, endDeg: number): string {
  const start = polarToCartesian(cx, cy, r, startDeg);
  const end = polarToCartesian(cx, cy, r, endDeg);
  return `M ${cx} ${cy} L ${start.x.toFixed(2)} ${start.y.toFixed(2)} A ${r} ${r} 0 0 1 ${end.x.toFixed(2)} ${end.y.toFixed(2)} Z`;
}

/** Interactive 6-slice prize wheel with daily free spin and deterministic pointer landing. */
export const LuckyWheel: React.FC<LuckyWheelProps> = ({
  freeAvailable,
  coins,
  onAwardPrize
}) => {
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [lastWon, setLastWon] = useState<WheelPrize | null>(null);

  const canSpin = !spinning && (freeAvailable || coins >= EXTRA_SPIN_COST);

  const handleSpin = () => {
    if (!canSpin) return;
    const isFree = freeAvailable;
    const cost = isFree ? 0 : EXTRA_SPIN_COST;

    const pickedIdx = Math.floor(Math.random() * WHEEL_PRIZES.length);
    const prize = WHEEL_PRIZES[pickedIdx];
    const centerDeg = pickedIdx * 60 + 30;
    const currentMod = ((rotation % 360) + 360) % 360;
    const desiredMod = (360 - centerDeg) % 360;
    const deltaMod = (desiredMod - currentMod + 360) % 360;
    const nextRot = rotation + 5 * 360 + deltaMod;

    sfx.click();
    setLastWon(null);
    setSpinning(true);
    setRotation(nextRot);

    setTimeout(() => {
      setSpinning(false);
      setLastWon(prize);
      sfx.reward();
      confetti({ particleCount: 55, spread: 70, origin: { y: 0.55 } });
      onAwardPrize(prize, isFree, cost);
    }, 3250);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Wheel Stage + Fixed Top Pointer */}
      <div className="relative w-52 h-52 my-1 flex items-center justify-center">
        {/* Top Golden Indicator Triangle */}
        <div
          className="absolute -top-2.5 left-1/2 -translate-x-1/2 z-20 drop-shadow-md pointer-events-none"
          aria-hidden="true"
        >
          <svg width="26" height="24" viewBox="0 0 26 24">
            <polygon points="13,23 2,2 24,2" fill="#fde047" stroke="#78350f" strokeWidth="2.5" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Outer Rim Lights */}
        <div
          className="w-48 h-48 rounded-full border-[6px] border-[#6b340e] shadow-[0_8px_20px_rgba(0,0,0,0.45)] relative overflow-hidden bg-[#4a2206]"
        >
          <div
            className="w-full h-full"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 3.2s cubic-bezier(0.14, 0.88, 0.22, 1)' : 'none'
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full block">
              {WHEEL_PRIZES.map((p, idx) => {
                const start = idx * 60;
                const end = start + 60;
                const mid = start + 30;
                const labelPos = polarToCartesian(100, 100, 64, mid);
                const subPos = polarToCartesian(100, 100, 44, mid);
                return (
                  <g key={p.id}>
                    <path
                      d={wedgePath(100, 100, 98, start, end)}
                      fill={p.fill}
                      stroke="#fff7dc"
                      strokeWidth="2"
                    />
                    <text
                      x={labelPos.x}
                      y={labelPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={p.accent}
                      fontSize="12"
                      fontWeight="900"
                      transform={`rotate(${mid}, ${labelPos.x}, ${labelPos.y})`}
                    >
                      {p.shortLabel}
                    </text>
                    <text
                      x={subPos.x}
                      y={subPos.y}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="#fff"
                      fontSize="8.5"
                      fontWeight="800"
                      opacity="0.9"
                      transform={`rotate(${mid}, ${subPos.x}, ${subPos.y})`}
                    >
                      {p.kind === 'coins' ? 'Altın' : p.kind === 'stars' ? 'Yıldız' : 'Güç'}
                    </text>
                  </g>
                );
              })}
              {/* Hub Cap */}
              <circle cx="100" cy="100" r="18" fill="#fef08a" stroke="#78350f" strokeWidth="3.5" />
              <text x="100" y="105" textAnchor="middle" fill="#451a03" fontSize="14" fontWeight="900">
                K
              </text>
            </svg>
          </div>
        </div>
      </div>

      {/* Reward Callout */}
      <div className="min-h-[26px] flex items-center justify-center mb-2">
        {lastWon ? (
          <div className="inline-flex items-center gap-1.5 bg-emerald-100 border border-emerald-400 text-emerald-900 px-3 py-0.5 rounded-full text-xs font-black animate-pop-in">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Kazanıldı: {lastWon.label}!</span>
          </div>
        ) : (
          <p className="text-[11px] font-bold text-[#6e3a10]">
            {freeAvailable ? 'Günün ücretsiz çevirmesi hazır!' : `Ekstra çevirme: ${EXTRA_SPIN_COST} Altın`}
          </p>
        )}
      </div>

      {/* Spin Button */}
      <button
        type="button"
        disabled={!canSpin}
        onClick={handleSpin}
        className={`gold-btn w-full py-2.5 rounded-2xl font-display text-base font-black flex items-center justify-center gap-2 ${
          !canSpin ? 'opacity-55 grayscale cursor-not-allowed' : ''
        }`}
      >
        {freeAvailable ? (
          <>
            <Star className="w-4 h-4 fill-current" />
            <span>{spinning ? 'Dönüyor...' : 'Ücretsiz Çevir!'}</span>
          </>
        ) : (
          <>
            <Coins className="w-4 h-4" />
            <span>{spinning ? 'Dönüyor...' : `Tekrar Çevir (${EXTRA_SPIN_COST})`}</span>
          </>
        )}
      </button>
    </div>
  );
};
