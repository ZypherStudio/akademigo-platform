import React from 'react';
import { Archive, Check, Crown, Flame, Gem, Sparkles, X } from 'lucide-react';
import { Grid } from '../types/game';
import { sfx } from '../utils/sound';

export type CoachTipId =
  | 'boss_block'
  | 'ember_hazard'
  | 'prism_lock'
  | 'bonus_2x'
  | 'hold_pocket';

interface CoachTipSpec {
  id: CoachTipId;
  title: string;
  body: string;
  accentBg: string;
  ringClass: string;
  icon: 'boss' | 'ember' | 'prism' | 'bonus' | 'hold';
}

const COACH_TIPS: Record<CoachTipId, CoachTipSpec> = {
  boss_block: {
    id: 'boss_block',
    title: '2×2 Dev Boss Bloğu!',
    body: 'Zırhını kırmak için geçtiği satırı/sütunu temizle ya da Bomba kullan.',
    accentBg: 'from-rose-500 to-red-700 border-rose-900',
    ringClass: 'ring-rose-400',
    icon: 'boss'
  },
  ember_hazard: {
    id: 'ember_hazard',
    title: 'Yanan Köz Uyarısı',
    body: 'Sayacı sıfırlanmadan közün bulunduğu satırı/sütunu temizle!',
    accentBg: 'from-orange-500 to-red-600 border-orange-900',
    ringClass: 'ring-orange-400',
    icon: 'ember'
  },
  prism_lock: {
    id: 'prism_lock',
    title: 'Renk Prizması',
    body: 'Kendi rengindeki bloklarla temas ederek veya komboyla kırılır.',
    accentBg: 'from-fuchsia-500 to-purple-700 border-purple-900',
    ringClass: 'ring-fuchsia-400',
    icon: 'prism'
  },
  bonus_2x: {
    id: 'bonus_2x',
    title: '2× Altın Kareler',
    body: 'Parlayan 2× karelerinin üstüne blok yerleştir: +80 Puan & 2× satır bonusu!',
    accentBg: 'from-amber-400 to-orange-600 border-amber-900',
    ringClass: 'ring-amber-400',
    icon: 'bonus'
  },
  hold_pocket: {
    id: 'hold_pocket',
    title: 'Yedek Blok Yuvası',
    body: 'Sığmayan parçayı park etmek için sağ alttaki YEDEK kutusuna dokun!',
    accentBg: 'from-emerald-500 to-teal-700 border-emerald-900',
    ringClass: 'ring-emerald-400',
    icon: 'hold'
  }
};

export function detectActiveCoachTip(opts: {
  grid: Grid;
  bonusCount: number;
  seenTips: string[];
  allowHoldHint: boolean;
}): CoachTipId | null {
  const seen = new Set(opts.seenTips || []);
  let hasBoss = false;
  let hasEmber = false;
  let hasPrism = false;

  for (let r = 0; r < opts.grid.length; r++) {
    for (let c = 0; c < opts.grid[r].length; c++) {
      const obs = opts.grid[r][c]?.obstacle;
      if (obs === 'boss') hasBoss = true;
      else if (obs === 'ember') hasEmber = true;
      else if (obs === 'prism') hasPrism = true;
    }
  }

  if (hasBoss && !seen.has('boss_block')) return 'boss_block';
  if (hasEmber && !seen.has('ember_hazard')) return 'ember_hazard';
  if (hasPrism && !seen.has('prism_lock')) return 'prism_lock';
  if (opts.bonusCount > 0 && !seen.has('bonus_2x')) return 'bonus_2x';
  if (opts.allowHoldHint && !seen.has('hold_pocket')) return 'hold_pocket';
  return null;
}

interface CoachMarkTipProps {
  tipId: CoachTipId;
  onDismiss: (id: CoachTipId) => void;
}

export const CoachMarkTip: React.FC<CoachMarkTipProps> = ({ tipId, onDismiss }) => {
  const spec = COACH_TIPS[tipId];
  if (!spec) return null;

  const renderIcon = () => {
    if (spec.icon === 'boss') return <Crown className="w-4 h-4 text-white" />;
    if (spec.icon === 'ember') return <Flame className="w-4 h-4 text-white" />;
    if (spec.icon === 'prism') return <Gem className="w-4 h-4 text-white" />;
    if (spec.icon === 'hold') return <Archive className="w-4 h-4 text-white" />;
    return <Sparkles className="w-4 h-4 text-white" />;
  };

  return (
    <div
      className={`relative z-40 w-full max-w-[355px] mb-1.5 parchment-card rounded-2xl px-2.5 py-1.5 flex items-center gap-2 ring-2 ${spec.ringClass} shadow-lg animate-pop-in`}
      role="status"
      aria-live="polite"
    >
      <div
        className={`w-7 h-7 rounded-xl bg-gradient-to-b ${spec.accentBg} border flex items-center justify-center shrink-0 shadow`}
      >
        {renderIcon()}
      </div>
      <div className="min-w-0 flex-1 text-left">
        <div className="text-[10.5px] font-black text-[#471f04] leading-tight truncate">
          {spec.title}
        </div>
        <div className="text-[9.5px] font-bold text-[#754014] leading-snug">
          {spec.body}
        </div>
      </div>
      <button
        type="button"
        onClick={() => {
          sfx.click();
          onDismiss(tipId);
        }}
        className="green-btn px-2 py-1 rounded-xl text-[9.5px] font-black flex items-center gap-0.5 shrink-0"
      >
        <Check className="w-3 h-3 stroke-[3]" />
        <span>Tamam</span>
      </button>
      <button
        type="button"
        aria-label="İpucunu Kapat"
        onClick={() => {
          sfx.click();
          onDismiss(tipId);
        }}
        className="text-[#8a5220] p-0.5 shrink-0"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
