import React, { useEffect, useState } from 'react';
import { AchievementToastData } from '../types';
import { Award, Sparkles, X, Trophy, CheckCircle2, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../utils/audio';

interface AchievementToastProps {
  achievement: AchievementToastData | null;
  onDismiss: () => void;
}

export const AchievementToast: React.FC<AchievementToastProps> = ({ achievement, onDismiss }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (achievement) {
      setIsVisible(true);
      
      // Play celebratory victory sound
      try {
        sound.playVictory();
      } catch (e) {
        console.warn('Audio play error:', e);
      }

      // Fire celebratory confetti burst
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.15 },
          colors: ['#F59E0B', '#FBBF24', '#10B981', '#3B82F6', '#EC4899'],
          zIndex: 10000
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }

      // Auto dismiss after 4.5 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(onDismiss, 350);
      }, 4500);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [achievement, onDismiss]);

  if (!achievement) return null;

  return (
    <div
      className={`fixed top-3 left-1/2 -translate-x-1/2 z-[9999] w-[94%] max-w-[410px] pointer-events-auto transition-all duration-400 ease-out ${
        isVisible ? 'translate-y-0 opacity-100 scale-100' : '-translate-y-16 opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {/* Outer 3D Golden Glow Border */}
      <div className="p-[2.5px] rounded-[26px] bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 shadow-[0_16px_45px_rgba(245,158,11,0.55)] border border-yellow-200/40 relative overflow-hidden">
        
        {/* Animated Light Sweep Effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />

        {/* Inner Card */}
        <div className="bg-gradient-to-b from-[#1C160C] via-[#161208] to-[#0F0C05] text-white p-3.5 sm:p-4 rounded-[23px] relative flex items-start gap-3 backdrop-blur-xl">
          
          {/* Left: 3D Trophy / Badge Icon with ambient gold glow */}
          <div className="relative flex-shrink-0 mt-0.5">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-yellow-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/40 flex items-center justify-center animate-bounceSubtle">
              <div className="w-full h-full bg-[#2A1F0D] rounded-[14px] flex items-center justify-center text-2xl sm:text-3xl">
                {achievement.icon || '🏆'}
              </div>
            </div>
            {/* Sparkle badge in corner */}
            <div className="absolute -bottom-1 -right-1 bg-yellow-400 text-amber-950 rounded-full p-1 shadow-sm">
              <Sparkles className="w-3 h-3 fill-amber-950" />
            </div>
          </div>

          {/* Center: Achievement Details */}
          <div className="flex-1 min-w-0 pr-6">
            <div className="flex items-center gap-1.5 mb-1">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500/25 to-yellow-500/20 border border-amber-400/40 text-[10px] sm:text-[11px] font-black text-yellow-300 uppercase tracking-wider">
                <Trophy className="w-3 h-3 text-yellow-400" />
                <span>BAŞARIM KAZANILDI!</span>
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-black text-white leading-tight truncate drop-shadow-sm">
              {achievement.title}
            </h3>

            <p className="text-[11px] sm:text-xs text-amber-200/80 leading-snug line-clamp-2 mt-0.5 font-medium">
              {achievement.description}
            </p>

            {/* Rewards Pill */}
            {(achievement.xpReward || achievement.gemReward) && (
              <div className="flex items-center gap-2 mt-2">
                {achievement.xpReward && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-amber-500/20 border border-amber-400/30 text-[11px] font-black text-amber-300">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    +{achievement.xpReward} XP
                  </span>
                )}
                {achievement.gemReward && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-cyan-500/20 border border-cyan-400/30 text-[11px] font-black text-cyan-300">
                    <Zap className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                    +{achievement.gemReward} 💎
                  </span>
                )}
                <span className="text-[10px] font-bold text-emerald-400 flex items-center gap-0.5 ml-auto">
                  <CheckCircle2 className="w-3 h-3" />
                  Kazanıldı
                </span>
              </div>
            )}
          </div>

          {/* Close / Dismiss Button */}
          <button
            onClick={() => {
              sound.playClick();
              setIsVisible(false);
              setTimeout(onDismiss, 300);
            }}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 transition flex items-center justify-center text-amber-200/80 hover:text-white"
            title="Kapat"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Bottom Countdown Auto-dismiss Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-amber-950/60 overflow-hidden rounded-b-[23px]">
            <div className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 transition-all duration-[4500ms] ease-linear w-0 animate-growWidth" />
          </div>

        </div>
      </div>
    </div>
  );
};
