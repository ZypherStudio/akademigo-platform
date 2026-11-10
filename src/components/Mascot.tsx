import React, { useState, useEffect } from 'react';
import { sound } from '../utils/audio';

export type MascotMood = 'idle' | 'happy' | 'thinking' | 'sad' | 'excited' | 'cheering';

interface MascotProps {
  mood?: MascotMood;
  speech?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  interactive?: boolean;
  onMascotClick?: () => void;
  className?: string;
}

const HARIBO_QUOTES = [
  "Haribo Ayıcığıyla dersler artık jelibon gibi tatlı! 🐻🍯",
  "Günde 5 soru çöz, şampiyonlar ligine tırman! 🏆✨",
  "Hata yapmaktan korkma, tatlı bir tekrarla hemen öğrenirsin! 🍬",
  "Bugün harika bir odaklanma günündesin! Hadi başlayalım! 🚀",
  "Zor seviye sorular seni dereceye taşır, pes etmek yok! 🧠💪",
  "Bal küpü canların biterse merak etme, mola verip tazeleyebilirsin! 🍯",
  "YKS ve sınavları jelibon gibi ezip geçeceğiz! 🐾"
];

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  speech,
  size = 'md',
  interactive = true,
  onMascotClick,
  className = ''
}) => {
  const [currentSpeech, setCurrentSpeech] = useState<string>(speech || HARIBO_QUOTES[0]);
  const [isBlinking, setIsBlinking] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [wiggle, setWiggle] = useState(false);

  useEffect(() => {
    if (speech) {
      setCurrentSpeech(speech);
    }
  }, [speech]);

  // Periodic blinking effect
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 180);
    }, 3800);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = () => {
    if (!interactive) return;
    sound.playClick();
    setWiggle(true);
    setTimeout(() => setWiggle(false), 600);

    const randomQuote = HARIBO_QUOTES[Math.floor(Math.random() * HARIBO_QUOTES.length)];
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

      {/* CUTE 3D HARIBO TEDDY BEAR MASCOT */}
      <div 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${sizeClasses[size]} relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 ${
          wiggle ? 'animate-wiggle' : ''
        } ${
          activeMood === 'excited' || activeMood === 'happy' || activeMood === 'cheering'
            ? 'animate-bounceSubtle'
            : 'animate-float'
        }`}
        title="Haribo Ayıcık - Senin Sevimli Çalışma Koçun (Tıkla ve konuş!)"
      >
        <svg viewBox="0 0 200 220" className="w-full h-full filter drop-shadow-xl overflow-visible">
          <defs>
            {/* Bear Fur Gradients with solid fallbacks */}
            <radialGradient id="bearFurGrad" cx="40%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#d9824c" />
              <stop offset="50%" stopColor="#b46332" />
              <stop offset="100%" stopColor="#87411c" />
            </radialGradient>

            <linearGradient id="bearEarInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="100%" stopColor="#fba66c" />
            </linearGradient>

            <linearGradient id="bearSnoutGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef3c7" />
              <stop offset="100%" stopColor="#fde047" />
            </linearGradient>

            <radialGradient id="bearBellyGrad" cx="50%" cy="40%" r="60%">
              <stop offset="0%" stopColor="#fde68a" />
              <stop offset="100%" stopColor="#f59e0b" />
            </radialGradient>

            <linearGradient id="honeyPotGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Bear Feet with cute pads */}
          <ellipse cx="68" cy="196" rx="22" ry="15" fill="#87411c" />
          <ellipse cx="68" cy="194" rx="20" ry="13" fill="#b46332" />
          <circle cx="68" cy="194" r="8" fill="#fed7aa" />
          <circle cx="58" cy="189" r="3" fill="#fed7aa" />
          <circle cx="68" cy="186" r="3.2" fill="#fed7aa" />
          <circle cx="78" cy="189" r="3" fill="#fed7aa" />

          <ellipse cx="132" cy="196" rx="22" ry="15" fill="#87411c" />
          <ellipse cx="132" cy="194" rx="20" ry="13" fill="#b46332" />
          <circle cx="132" cy="194" r="8" fill="#fed7aa" />
          <circle cx="122" cy="189" r="3" fill="#fed7aa" />
          <circle cx="132" cy="186" r="3.2" fill="#fed7aa" />
          <circle cx="142" cy="189" r="3" fill="#fed7aa" />

          {/* Left Round Bear Ear */}
          <circle cx="52" cy="48" r="24" fill="#87411c" />
          <circle cx="52" cy="48" r="22" fill="url(#bearFurGrad)" />
          <circle cx="52" cy="48" r="13" fill="url(#bearEarInner)" />

          {/* Right Round Bear Ear */}
          <circle cx="148" cy="48" r="24" fill="#87411c" />
          <circle cx="148" cy="48" r="22" fill="url(#bearFurGrad)" />
          <circle cx="148" cy="48" r="13" fill="url(#bearEarInner)" />

          {/* Bear Body */}
          <ellipse cx="100" cy="142" rx="54" ry="58" fill="#87411c" />
          <ellipse cx="100" cy="140" rx="52" ry="56" fill="url(#bearFurGrad)" />

          {/* Belly Patch */}
          <ellipse cx="100" cy="142" rx="34" ry="38" fill="url(#bearBellyGrad)" />

          {/* Arms / Paws */}
          {activeMood === 'happy' || activeMood === 'cheering' || activeMood === 'excited' ? (
            /* Waving Arms Up in Joy */
            <>
              <ellipse cx="40" cy="98" rx="16" ry="24" fill="#87411c" transform="rotate(-32 40 98)" />
              <ellipse cx="40" cy="98" rx="14" ry="22" fill="url(#bearFurGrad)" transform="rotate(-32 40 98)" />
              <circle cx="36" cy="88" r="7" fill="#fed7aa" />

              <ellipse cx="160" cy="98" rx="16" ry="24" fill="#87411c" transform="rotate(32 160 98)" />
              <ellipse cx="160" cy="98" rx="14" ry="22" fill="url(#bearFurGrad)" transform="rotate(32 160 98)" />
              <circle cx="164" cy="88" r="7" fill="#fed7aa" />
            </>
          ) : (
            /* Cute Paws Holding Honey Pot or Resting */
            <>
              <ellipse cx="54" cy="132" rx="16" ry="20" fill="#87411c" transform="rotate(15 54 132)" />
              <ellipse cx="54" cy="132" rx="14" ry="18" fill="url(#bearFurGrad)" transform="rotate(15 54 132)" />
              <circle cx="56" cy="134" r="7" fill="#fed7aa" />

              <ellipse cx="146" cy="132" rx="16" ry="20" fill="#87411c" transform="rotate(-15 146 132)" />
              <ellipse cx="146" cy="132" rx="14" ry="18" fill="url(#bearFurGrad)" transform="rotate(-15 146 132)" />
              <circle cx="144" cy="134" r="7" fill="#fed7aa" />
            </>
          )}

          {/* Bear Head (Cute Round Shape) */}
          <circle cx="100" cy="80" r="50" fill="#87411c" />
          <circle cx="100" cy="78" r="48" fill="url(#bearFurGrad)" />

          {/* Forehead Light Shimmer */}
          <ellipse cx="85" cy="52" rx="16" ry="8" fill="#ffffff" opacity="0.22" transform="rotate(-15 85 52)" />

          {/* Snout / Muzzle */}
          <ellipse cx="100" cy="92" rx="25" ry="19" fill="#fde68a" />
          <ellipse cx="100" cy="91" rx="24" ry="18" fill="url(#bearSnoutGrad)" />

          {/* Glossy Black Bear Nose */}
          <path d="M 93 84 Q 100 89 107 84 Q 100 95 93 84 Z" fill="#1c1917" />
          <ellipse cx="98" cy="85" rx="2.5" ry="1.5" fill="#ffffff" />

          {/* Mouth & Cute Smile */}
          {activeMood === 'happy' || activeMood === 'cheering' || activeMood === 'excited' ? (
            /* Big Joyful Open Smile with Tongue */
            <g>
              <path d="M 91 93 Q 100 105 109 93" fill="#881337" stroke="#1c1917" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 94 98 Q 100 105 106 98" fill="#fb7185" />
            </g>
          ) : activeMood === 'sad' ? (
            /* Sad Mouth */
            <path d="M 93 98 Q 100 92 107 98" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            /* Sweet Bear Smile */
            <g>
              <path d="M 100 90 L 100 94" stroke="#1c1917" strokeWidth="2" strokeLinecap="round" />
              <path d="M 93 94 Q 100 99 107 94" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Rosy Glowing Cheeks */}
          <ellipse cx="64" cy="86" rx="8" ry="5.5" fill="#f87171" opacity="0.65" />
          <ellipse cx="136" cy="86" rx="8" ry="5.5" fill="#f87171" opacity="0.65" />

          {/* Cartoon Sparkly Bear Eyes */}
          {isBlinking ? (
            /* Blinking Curved Lines */
            <>
              <path d="M 72 70 Q 79 75 86 70" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 114 70 Q 121 75 128 70" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : activeMood === 'happy' || activeMood === 'cheering' ? (
            /* Joyful (^_^) Eyes */
            <>
              <path d="M 72 72 Q 79 62 86 72" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 114 72 Q 121 62 128 72" stroke="#1c1917" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : activeMood === 'thinking' ? (
            /* Looking Up Curiously */
            <>
              <circle cx="79" cy="66" r="8" fill="#1c1917" />
              <circle cx="76" cy="63" r="3.2" fill="#ffffff" />
              <circle cx="81" cy="68" r="1.5" fill="#ffffff" />

              <circle cx="121" cy="66" r="8" fill="#1c1917" />
              <circle cx="118" cy="63" r="3.2" fill="#ffffff" />
              <circle cx="123" cy="68" r="1.5" fill="#ffffff" />
            </>
          ) : (
            /* Big Adorable Disney-Style Sparkly Eyes */
            <>
              <circle cx="79" cy="70" r="8.5" fill="#1c1917" />
              <circle cx="76" cy="67" r="3.5" fill="#ffffff" />
              <circle cx="82" cy="73" r="1.6" fill="#ffffff" />

              <circle cx="121" cy="70" r="8.5" fill="#1c1917" />
              <circle cx="118" cy="67" r="3.5" fill="#ffffff" />
              <circle cx="124" cy="73" r="1.6" fill="#ffffff" />
            </>
          )}

          {/* Graduation Cap or Honey Pot Badge */}
          <g transform="translate(132, 122) scale(0.7)">
            <ellipse cx="20" cy="30" rx="18" ry="16" fill="url(#honeyPotGrad)" />
            <ellipse cx="20" cy="18" rx="16" ry="6" fill="#fef08a" />
            <path d="M 10 20 Q 20 26 30 20 L 32 32 Q 20 40 8 32 Z" fill="#d97706" />
            <text x="20" y="32" fontSize="13" textAnchor="middle" fill="#fff" fontWeight="bold">🍯</text>
          </g>

        </svg>
      </div>

      {/* Mascot Hint Subtitle */}
      <span className="text-[10px] font-black uppercase text-amber-600 dark:text-amber-400 mt-1 tracking-wider">
        Haribo Ayıcık'a Tıkla, Taktik Al! 🐻
      </span>

    </div>
  );
};