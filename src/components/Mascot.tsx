import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';
import { HariboCostume } from '../types';

export type MascotMood = 'idle' | 'happy' | 'thinking' | 'sad' | 'excited' | 'cheering';

interface MascotProps {
  mood?: MascotMood;
  speech?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onMascotClick?: () => void;
  className?: string;
  costume?: HariboCostume;
  dance?: boolean;
}

const KNOWZA_QUOTES = [
  "Knowza yanında! Her gün yeni bir bilgi keşfet! 🎓✨",
  "Günde 5 soru çöz, liglerde şampiyonluğa tırman! 🏆",
  "Hata yapmaktan korkma, Knowza ile pratik yaparak öğrenirsin! 🚀",
  "Bugün harika bir odaklanma günündesin! Hadi dersini tamamla! 🧠",
  "Kepini takmaya hazır mısın? Bilgini katla ve rozetleri topla! 👑",
  "1v1 Düelloda ve KahootGO'da arkadaşlarına meydan oku! ⚔️"
];

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  speech,
  size = 'md',
  interactive = true,
  onMascotClick,
  className = '',
  costume = 'classic',
  dance = false
}) => {
  const [currentSpeech, setCurrentSpeech] = useState<string>(speech || KNOWZA_QUOTES[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  useEffect(() => {
    if (speech) {
      setCurrentSpeech(speech);
    }
  }, [speech]);

  const handleClick = () => {
    if (!interactive) return;
    sound.playClick();
    setWiggle(true);
    setTimeout(() => setWiggle(false), 600);

    const randomQuote = KNOWZA_QUOTES[Math.floor(Math.random() * KNOWZA_QUOTES.length)];
    setCurrentSpeech(randomQuote);
    if (onMascotClick) {
      onMascotClick();
    }
  };

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24 sm:w-28 sm:h-28',
    lg: 'w-36 h-36 sm:w-44 sm:h-44',
    xl: 'w-48 h-48 sm:w-56 sm:h-56'
  };

  const activeMood = isHovered && mood === 'idle' ? 'happy' : mood;

  const animationClass =
    dance || costume === 'party' || activeMood === 'cheering'
      ? 'animate-dance'
      : wiggle
      ? 'animate-wiggle'
      : activeMood === 'excited' || activeMood === 'happy'
      ? 'animate-bounceSubtle'
      : 'animate-float';

  // Map mood to the 3D transparent Knowza mascot asset
  const getMascotSrc = () => {
    if (activeMood === 'thinking') {
      return '/assets/knowza_thinking.png';
    }
    if (activeMood === 'cheering' || activeMood === 'excited') {
      return '/assets/knowza_cheering.png';
    }
    if (activeMood === 'sad') {
      return '/assets/knowza_thinking.png';
    }
    return '/assets/knowza_main.png';
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Dynamic Animated Speech Bubble */}
      {currentSpeech && (
        <div
          onClick={handleClick}
          className="mb-2 max-w-[260px] sm:max-w-sm bg-white dark:bg-[#1a2c35] border-2 border-amber-400 dark:border-amber-500 text-gray-800 dark:text-gray-100 font-black text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-xl relative animate-pop cursor-pointer hover:border-amber-500 hover:scale-105 transition-all text-center leading-snug"
        >
          {currentSpeech}
          {/* Bubble tail pointing downwards */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-[#1a2c35]" />
          <div className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-400 dark:border-t-amber-500 -z-10" />
        </div>
      )}

      {/* 3D KNOWZA MASCOT (TRANSPARENT PNG) */}
      <div
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${sizeClasses[size]} relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 ${animationClass} flex items-center justify-center`}
        title="Knowza Maskotun - Tıkla ve konuş!"
      >
        <img
          src={getMascotSrc()}
          alt="Knowza Maskot"
          className="w-full h-full object-contain filter drop-shadow-lg"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/assets/knowza_main.png';
          }}
        />
      </div>

      {interactive && (
        <span className="text-[10px] font-bold text-amber-700/70 dark:text-amber-300/70 mt-1 uppercase tracking-wider">
          Knowza'ya Tıkla! 🐾
        </span>
      )}
    </div>
  );
};
