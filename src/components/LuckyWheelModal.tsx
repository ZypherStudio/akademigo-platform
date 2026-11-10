import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { X, Sparkles, Gem, Zap, Heart, Shield, Trophy, ArrowDown } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { HariboAvatar } from './HariboAvatar';

interface LuckyWheelModalProps {
  onClose: () => void;
}

interface WheelSegment {
  id: string;
  label: string;
  sub: string;
  icon: string;
  color: string;
  rewardType: 'xp' | 'gems' | 'refill' | 'freeze';
  value: number;
}

const SEGMENTS: WheelSegment[] = [
  { id: '1', label: '+100 XP', sub: 'Deneyim Puanı', icon: '⚡', color: '#f59e0b', rewardType: 'xp', value: 100 },
  { id: '2', label: '+50 Elmas', sub: 'Değerli Taş', icon: '💎', color: '#3b82f6', rewardType: 'gems', value: 50 },
  { id: '3', label: 'Bal Küpü', sub: 'Canları Doldur', icon: '🍯', color: '#ef4444', rewardType: 'refill', value: 5 },
  { id: '4', label: '+250 XP', sub: 'Büyük Ödül!', icon: '👑', color: '#8b5cf6', rewardType: 'xp', value: 250 },
  { id: '5', label: '+25 Elmas', sub: 'Bonus Elmas', icon: '💎', color: '#06b6d4', rewardType: 'gems', value: 25 },
  { id: '6', label: 'Can Simidi', sub: 'Seri Koruma', icon: '🛡️', color: '#10b981', rewardType: 'freeze', value: 1 },
];

export const LuckyWheelModal: React.FC<LuckyWheelModalProps> = ({ onClose }) => {
  const { stats, completeLesson, refillHearts } = useGame();
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [wonSegment, setWonSegment] = useState<WheelSegment | null>(null);

  const handleSpin = () => {
    if (spinning) return;
    sound.playClick();
    setSpinning(true);
    setWonSegment(null);

    // Pick random segment
    const selectedIndex = Math.floor(Math.random() * SEGMENTS.length);
    const segmentAngle = 360 / SEGMENTS.length;
    // Calculate final rotation (min 5 full spins + target angle)
    const extraSpins = 5 * 360;
    const targetAngle = extraSpins + (360 - (selectedIndex * segmentAngle + segmentAngle / 2));
    
    setRotation(targetAngle);

    setTimeout(() => {
      setSpinning(false);
      const chosen = SEGMENTS[selectedIndex];
      setWonSegment(chosen);
      sound.playVictory();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });

      // Apply rewards
      if (chosen.rewardType === 'xp') {
        completeLesson('spin-reward', chosen.value, 0, 100);
      } else if (chosen.rewardType === 'gems') {
        completeLesson('spin-reward', 0, chosen.value, 100);
      } else if (chosen.rewardType === 'refill') {
        refillHearts();
      }
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 select-none animate-fade">
      <div className="bg-white dark:bg-[#1a2c35] border-4 border-amber-400 dark:border-amber-500 rounded-3xl max-w-md w-full p-6 shadow-2xl text-center relative overflow-hidden animate-pop">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center font-black text-gray-500 hover:text-gray-800 dark:text-gray-300"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-4">
          <div className="inline-flex items-center gap-1.5 bg-amber-100 dark:bg-amber-950/50 border border-amber-300 dark:border-amber-700 px-3 py-1 rounded-full text-xs font-black text-amber-900 dark:text-amber-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            GÜNLÜK ŞANS ÇARKI 🎡
          </div>
          <h2 className="text-2xl font-black text-gray-800 dark:text-gray-100">Çarkıfelek Arenası</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
            Çarkı çevir, Haribo Altın Ayıcık'ın hazinesinden sürpriz ödülleri topla! 🍯✨
          </p>
        </div>

        {/* Wheel Container */}
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 mx-auto my-4 flex items-center justify-center">
          
          {/* Top Pointer Indicator */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 filter drop-shadow-md">
            <div className="w-0 h-0 border-x-10 border-x-transparent border-t-[22px] border-t-red-600 animate-bounceSubtle" />
          </div>

          {/* Rotating Wheel Circle */}
          <div
            className="w-full h-full rounded-full border-8 border-amber-400 shadow-2xl overflow-hidden relative"
            style={{
              transform: `rotate(${rotation}deg)`,
              transition: spinning ? 'transform 4s cubic-bezier(0.15, 0.9, 0.25, 1)' : 'none'
            }}
          >
            {/* 6 Conic Segments using SVG */}
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {SEGMENTS.map((seg, i) => {
                const angle = 360 / SEGMENTS.length;
                const startAngle = (i * angle - 90) * (Math.PI / 180);
                const endAngle = ((i + 1) * angle - 90) * (Math.PI / 180);

                const x1 = 50 + 50 * Math.cos(startAngle);
                const y1 = 50 + 50 * Math.sin(startAngle);
                const x2 = 50 + 50 * Math.cos(endAngle);
                const y2 = 50 + 50 * Math.sin(endAngle);

                const d = `M 50 50 L ${x1} ${y1} A 50 50 0 0 1 ${x2} ${y2} Z`;

                // Mid angle for text label placement
                const midAngle = (i * angle + angle / 2 - 90) * (Math.PI / 180);
                const textX = 50 + 32 * Math.cos(midAngle);
                const textY = 50 + 32 * Math.sin(midAngle);

                return (
                  <g key={seg.id}>
                    <path d={d} fill={seg.color} stroke="#ffffff" strokeWidth="1.5" />
                    <text
                      x={textX}
                      y={textY}
                      fill="#ffffff"
                      fontSize="6.5"
                      fontWeight="900"
                      textAnchor="middle"
                      dominantBaseline="central"
                      transform={`rotate(${i * angle + angle / 2}, ${textX}, ${textY})`}
                    >
                      {seg.icon} {seg.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Center Hub with Golden Haribo Bear */}
          <div className="absolute w-14 h-14 rounded-full bg-white dark:bg-[#1a2c35] border-4 border-amber-400 shadow-lg flex items-center justify-center select-none z-20 p-1">
            <HariboAvatar size="sm" animate={true} />
          </div>

        </div>

        {/* Won Prize Celebration Box */}
        {wonSegment && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-400 dark:border-amber-600 rounded-2xl p-3.5 my-3 animate-pop">
            <div className="text-xs font-black text-amber-800 dark:text-amber-300">
              🎉 TEBRİKLER! KAZANDIĞIN ÖDÜL:
            </div>
            <div className="text-xl font-black text-amber-600 dark:text-amber-400 mt-1 flex items-center justify-center gap-1.5">
              <span>{wonSegment.icon}</span>
              <span>{wonSegment.label}</span>
              <span className="text-xs text-gray-500 font-bold">({wonSegment.sub})</span>
            </div>
          </div>
        )}

        {/* Action Button: Spin */}
        <div className="mt-4">
          <button
            disabled={spinning}
            onClick={handleSpin}
            className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
              spinning
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                : 'bg-[#58cc02] hover:bg-[#46a302] text-white border-b-6 border-[#46a302] active:border-b-0 active:translate-y-1.5 shadow-xl animate-wiggle'
            }`}
          >
            <Sparkles className="w-5 h-5 fill-white" />
            <span>{spinning ? 'ÇARK DÖNÜYOR...' : 'ÇARKI ÇEVİR! 🎡'}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
