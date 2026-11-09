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
  "Her gün 5 soru çözmek, beynini şampiyon yapar! 🧠✨",
  "Hata yapmaktan korkma, tatlı bir tekrarla hemen öğrenirsin! 🍬",
  "Bugün harika bir odaklanma günündesin! Hadi başlayalım! 🚀",
  "Mola vermeyi ve biraz su içmeyi unutma! 💧",
  "Zor seviye sorular seni dereceye taşır, pes etmek yok! 🏆"
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
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = () => {
    if (!interactive) return;
    sound.playClick();
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
    xl: 'w-52 h-52 sm:w-60 sm:h-60'
  };

  const activeMood = isHovered && mood === 'idle' ? 'happy' : mood;

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      
      {/* Dynamic Animated Speech Bubble */}
      {currentSpeech && (
        <div 
          onClick={handleClick}
          className="mb-2 max-w-[260px] sm:max-w-sm bg-white dark:bg-gray-800 border-2 border-amber-300 dark:border-amber-500 text-gray-800 dark:text-gray-100 font-extrabold text-xs sm:text-sm px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-lg relative animate-pop cursor-pointer hover:border-amber-400 hover:scale-105 transition-all text-center leading-snug"
        >
          {currentSpeech}
          {/* Bubble tail pointing downwards */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-gray-800" />
          <div className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-amber-300 dark:border-t-amber-500 -z-10" />
        </div>
      )}

      {/* SVG Custom Mascot: "HARİBO AYICIK" (Gummy Bear of Wisdom) */}
      <div 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${sizeClasses[size]} relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 ${
          activeMood === 'excited' || activeMood === 'happy' || activeMood === 'cheering'
            ? 'animate-bounce'
            : 'animate-bounceSubtle'
        }`}
        title="Haribo Ayıcık - Senin Sevimli Çalışma Koçun (Tıkla ve konuş!)"
      >
        <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-xl overflow-visible">
          <defs>
            {/* Gummy Gold Honey Gradient */}
            <linearGradient id="gummyBearGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fde047" />
              <stop offset="35%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>

            {/* Inner Ear & Snout Gradient */}
            <linearGradient id="gummyInnerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#fcd34d" />
            </linearGradient>

            {/* Belly Gloss Gradient */}
            <linearGradient id="gummyGlossGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
            </linearGradient>

            {/* Bowtie Red Gradient */}
            <linearGradient id="bowtieGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ff4b4b" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>

          {/* Bear Feet */}
          <ellipse cx="70" cy="195" rx="20" ry="14" fill="#d97706" />
          <ellipse cx="130" cy="195" rx="20" ry="14" fill="#d97706" />
          <ellipse cx="70" cy="194" rx="14" ry="9" fill="#fcd34d" />
          <ellipse cx="130" cy="194" rx="14" ry="9" fill="#fcd34d" />

          {/* Left & Right Round Bear Ears */}
          <circle cx="56" cy="48" r="22" fill="#d97706" />
          <circle cx="56" cy="48" r="18" fill="url(#gummyBearGrad)" />
          <circle cx="56" cy="48" r="11" fill="url(#gummyInnerGrad)" />

          <circle cx="144" cy="48" r="22" fill="#d97706" />
          <circle cx="144" cy="48" r="18" fill="url(#gummyBearGrad)" />
          <circle cx="144" cy="48" r="11" fill="url(#gummyInnerGrad)" />

          {/* Bear Body */}
          <ellipse cx="100" cy="140" rx="52" ry="58" fill="url(#gummyBearGrad)" />

          {/* Gummy Belly Highlight */}
          <ellipse cx="100" cy="142" rx="36" ry="40" fill="url(#gummyInnerGrad)" />
          <ellipse cx="94" cy="130" rx="22" ry="26" fill="url(#gummyGlossGrad)" />

          {/* Paws */}
          {activeMood === 'happy' || activeMood === 'cheering' || activeMood === 'excited' ? (
            /* Waving Happy Paws (Raised) */
            <>
              <ellipse cx="44" cy="95" rx="16" ry="22" fill="url(#gummyBearGrad)" transform="rotate(-30 44 95)" />
              <ellipse cx="156" cy="95" rx="16" ry="22" fill="url(#gummyBearGrad)" transform="rotate(30 156 95)" />
              {/* Paw pads */}
              <circle cx="42" cy="88" r="6" fill="#fcd34d" />
              <circle cx="158" cy="88" r="6" fill="#fcd34d" />
            </>
          ) : (
            /* Resting Paws on Belly */
            <>
              <ellipse cx="56" cy="130" rx="16" ry="18" fill="url(#gummyBearGrad)" />
              <ellipse cx="144" cy="130" rx="16" ry="18" fill="url(#gummyBearGrad)" />
              <circle cx="56" cy="130" r="7" fill="#fcd34d" />
              <circle cx="144" cy="130" r="7" fill="#fcd34d" />
            </>
          )}

          {/* Bear Head (Cute Round Shape) */}
          <circle cx="100" cy="78" r="48" fill="url(#gummyBearGrad)" />

          {/* Gummy Gloss Sheen on Forehead */}
          <ellipse cx="86" cy="54" rx="16" ry="8" fill="url(#gummyGlossGrad)" transform="rotate(-15 86 54)" />

          {/* Snout / Muzzle */}
          <ellipse cx="100" cy="88" rx="22" ry="17" fill="url(#gummyInnerGrad)" />

          {/* Cute Black Bear Nose */}
          <path d="M 94 81 Q 100 86 106 81 Q 100 90 94 81 Z" fill="#1c1917" />
          <circle cx="98" cy="82" r="1.5" fill="#ffffff" />

          {/* Mouth */}
          {activeMood === 'happy' || activeMood === 'cheering' || activeMood === 'excited' ? (
            /* Open Smiling Mouth */
            <path d="M 92 88 Q 100 98 108 88" stroke="#1c1917" strokeWidth="3" fill="#ef4444" strokeLinecap="round" />
          ) : activeMood === 'sad' ? (
            /* Sad Drooping Mouth */
            <path d="M 93 94 Q 100 88 107 94" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            /* Gentle Smile */
            <path d="M 94 88 Q 100 94 106 88" stroke="#1c1917" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          )}

          {/* Eyes */}
          {isBlinking ? (
            /* Blinking Eyes */
            <>
              <line x1="74" y1="68" x2="88" y2="68" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="112" y1="68" x2="126" y2="68" stroke="#1c1917" strokeWidth="3.5" strokeLinecap="round" />
            </>
          ) : activeMood === 'happy' || activeMood === 'cheering' ? (
            /* Joyful Curved Eyes (^_^) */
            <>
              <path d="M 74 72 Q 81 60 88 72" stroke="#1c1917" strokeWidth="4" fill="none" strokeLinecap="round" />
              <path d="M 112 72 Q 119 60 126 72" stroke="#1c1917" strokeWidth="4" fill="none" strokeLinecap="round" />
              {/* Rosy Cheeks */}
              <circle cx="68" cy="84" r="7" fill="#f87171" opacity="0.65" />
              <circle cx="132" cy="84" r="7" fill="#f87171" opacity="0.65" />
            </>
          ) : activeMood === 'sad' ? (
            /* Sad Eyes + Tear */
            <>
              <circle cx="81" cy="70" r="7" fill="#1c1917" />
              <circle cx="79" cy="67" r="2.5" fill="#ffffff" />
              <circle cx="119" cy="70" r="7" fill="#1c1917" />
              <circle cx="117" cy="67" r="2.5" fill="#ffffff" />
              <ellipse cx="128" cy="85" rx="3" ry="5" fill="#60a5fa" />
            </>
          ) : activeMood === 'thinking' ? (
            /* Looking Up Thinking */
            <>
              <circle cx="81" cy="64" r="7" fill="#1c1917" />
              <circle cx="79" cy="61" r="2.5" fill="#ffffff" />
              <circle cx="119" cy="64" r="7" fill="#1c1917" />
              <circle cx="117" cy="61" r="2.5" fill="#ffffff" />
              <circle cx="100" cy="18" r="6" fill="#facc15" />
            </>
          ) : (
            /* Sparkly Shiny Eyes */
            <>
              <circle cx="81" cy="68" r="7" fill="#1c1917" />
              <circle cx="79" cy="65" r="2.8" fill="#ffffff" />
              <circle cx="83" cy="71" r="1.2" fill="#ffffff" />

              <circle cx="119" cy="68" r="7" fill="#1c1917" />
              <circle cx="117" cy="65" r="2.8" fill="#ffffff" />
              <circle cx="121" cy="71" r="1.2" fill="#ffffff" />

              {/* Sweet Rosy Cheeks */}
              <circle cx="68" cy="82" r="6" fill="#f87171" opacity="0.45" />
              <circle cx="132" cy="82" r="6" fill="#f87171" opacity="0.45" />
            </>
          )}

          {/* Haribo Red Bowtie or Scholar Cap */}
          <g transform="translate(100, 114)">
            <polygon points="-16,-7 -16,7 0,0" fill="url(#bowtieGrad)" />
            <polygon points="16,-7 16,7 0,0" fill="url(#bowtieGrad)" />
            <circle cx="0" cy="0" r="4.5" fill="#b91c1c" />
          </g>

          {/* Sparkles if Excited */}
          {(activeMood === 'excited' || activeMood === 'cheering') && (
            <>
              <text x="20" y="45" fontSize="20" className="animate-ping">✨</text>
              <text x="165" y="45" fontSize="20" className="animate-ping">⭐</text>
              <text x="100" y="20" fontSize="16" className="animate-bounce">🍬</text>
            </>
          )}
        </svg>
      </div>

    </div>
  );
};
