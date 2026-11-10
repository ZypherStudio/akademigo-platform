import React, { useEffect } from 'react';
import { ArrowLeft, Sparkles, Star } from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundSystem } from '../utils/audio';

interface KnowzaLevelUpModalProps {
  level?: number;
  onClose: () => void;
}

export const KnowzaLevelUpModal: React.FC<KnowzaLevelUpModalProps> = ({
  level = 13,
  onClose
}) => {
  useEffect(() => {
    // Sound & Confetti celebration
    soundSystem.playVictory();

    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#FFB800', '#FFA500', '#FFD700', '#FFFFFF', '#9333EA']
      });
    } catch (e) {
      // Ignore if confetti fails
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#15110B]/90 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm h-full max-h-[840px] flex flex-col justify-between overflow-hidden bg-gradient-to-b from-[#1C160F] via-[#2A1D11] to-[#17120B] rounded-none sm:rounded-[40px] shadow-2xl border-0 sm:border border-amber-900/30">
        {/* Ambient golden glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Floating Stars Decoration */}
        <div className="absolute top-12 left-10 text-amber-300 animate-pulse pointer-events-none">
          <Sparkles className="w-6 h-6 opacity-80" />
        </div>
        <div className="absolute top-28 right-8 text-amber-200 animate-bounce pointer-events-none">
          <Star className="w-5 h-5 fill-amber-300 opacity-70" />
        </div>
        <div className="absolute top-52 left-6 text-amber-400 pointer-events-none">
          <Star className="w-4 h-4 fill-amber-400 opacity-60" />
        </div>

        {/* Top Bar with back button */}
        <div className="relative z-10 px-6 pt-8 flex items-center">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 active:scale-95 transition"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
        </div>

        {/* Center Content: Title, Big Level 13 Badge & Mascot */}
        <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 -mt-4 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight drop-shadow-md mb-6">
            Seviye Atladın!
          </h2>

          {/* 3D Level Badge + Mascot Composition */}
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Try using the cropped composition first */}
            <img
              src="/assets/knowza_levelup_badge.png"
              alt={`Knowza Seviye ${level}`}
              className="w-full h-full object-contain filter drop-shadow-2xl animate-dance"
              onError={(e) => {
                // Fallback to mascot + overlay number
                (e.target as HTMLImageElement).src = '/assets/knowza_seviye.png';
              }}
            />
          </div>
        </div>

        {/* Bottom Curved White Container matching Screen 7 */}
        <div className="relative z-10 bg-white rounded-t-[36px] px-6 pt-7 pb-8 text-center shadow-2xl">
          <h3 className="text-xl font-extrabold text-slate-900 tracking-tight flex items-center justify-center gap-2">
            <span>Tebrikler!</span>
            <span>🎉</span>
          </h3>
          <p className="text-sm text-slate-600 font-medium mt-1 mb-6">
            Artık daha fazlasını öğrenebilirsin.
          </p>

          <button
            onClick={onClose}
            className="w-full py-4 rounded-2xl bg-[#FFB800] hover:bg-[#FFA500] text-slate-900 font-black text-base shadow-lg shadow-amber-500/25 active:scale-98 transition transform duration-150"
          >
            Harika!
          </button>
        </div>
      </div>
    </div>
  );
};
