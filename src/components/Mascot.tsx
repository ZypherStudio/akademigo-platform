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

const HARIBO_QUOTES = [
  "Haribo Sarı Altın Ayıcık yanındaysa sınavlar jelibon gibi tatlı! 🍯✨",
  "Günde 5 soru çöz, şampiyonlar ligine tırman! 🏆✨",
  "Hata yapmaktan korkma, sarı ayıcığınla hemen öğrenirsin! 🍬",
  "Bugün harika bir odaklanma günündesin! Hadi başlayalım! 🚀",
  "Zor seviye sorular seni dereceye taşır, pes etmek yok! 🧠💪",
  "Kırmızı papyonumu taktım, seninle derece yapmaya hazırım! 🎀",
  "YKS ve sınavları jelibon gibi ezip geçeceğiz! 🐾"
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

  const animationClass = 
    dance || costume === 'party' || activeMood === 'cheering'
      ? 'animate-dance'
      : wiggle
      ? 'animate-wiggle'
      : activeMood === 'excited' || activeMood === 'happy'
      ? 'animate-bounceSubtle'
      : 'animate-float';

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

      {/* ICONIC GOLDEN YELLOW HARIBO GUMMY BEAR WITH RED BOWTIE */}
      <div 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${sizeClasses[size]} relative cursor-pointer transition-transform duration-300 hover:scale-110 active:scale-95 ${animationClass}`}
        title="Haribo Sarı Ayıcık - Senin Özel Maskotun (Tıkla ve konuş!)"
      >
        <svg viewBox="0 0 200 220" className="w-full h-full filter drop-shadow-xl overflow-visible">
          {/* Bear Feet with cute pads */}
          <ellipse cx="68" cy="196" rx="22" ry="15" fill="#d97706" />
          <ellipse cx="68" cy="194" rx="20" ry="13" fill="#facc15" />
          <circle cx="68" cy="194" r="8" fill="#fef08a" />
          <circle cx="58" cy="189" r="3" fill="#fef08a" />
          <circle cx="68" cy="186" r="3.2" fill="#fef08a" />
          <circle cx="78" cy="189" r="3" fill="#fef08a" />

          <ellipse cx="132" cy="196" rx="22" ry="15" fill="#d97706" />
          <ellipse cx="132" cy="194" rx="20" ry="13" fill="#facc15" />
          <circle cx="132" cy="194" r="8" fill="#fef08a" />
          <circle cx="122" cy="189" r="3" fill="#fef08a" />
          <circle cx="132" cy="186" r="3.2" fill="#fef08a" />
          <circle cx="142" cy="189" r="3" fill="#fef08a" />

          {/* Left Round Bear Ear (Golden Yellow) */}
          <circle cx="52" cy="48" r="24" fill="#d97706" />
          <circle cx="52" cy="48" r="22" fill="#facc15" />
          <circle cx="52" cy="48" r="13" fill="#fef08a" />

          {/* Right Round Bear Ear (Golden Yellow) */}
          <circle cx="148" cy="48" r="24" fill="#d97706" />
          <circle cx="148" cy="48" r="22" fill="#facc15" />
          <circle cx="148" cy="48" r="13" fill="#fef08a" />

          {/* Bear Body (Bright Golden Yellow) */}
          <ellipse cx="100" cy="142" rx="54" ry="58" fill="#d97706" />
          <ellipse cx="100" cy="140" rx="52" ry="56" fill="#facc15" />

          {/* Belly Patch (Soft Creamy Yellow with Gloss) */}
          <ellipse cx="100" cy="142" rx="34" ry="38" fill="#fef08a" />
          <ellipse cx="94" cy="132" rx="18" ry="22" fill="#ffffff" opacity="0.35" />

          {/* Arms / Paws */}
          {activeMood === 'happy' || activeMood === 'cheering' || activeMood === 'excited' ? (
            /* Waving Arms Up in Joy */
            <>
              <ellipse cx="40" cy="98" rx="16" ry="24" fill="#d97706" transform="rotate(-32 40 98)" />
              <ellipse cx="40" cy="98" rx="14" ry="22" fill="#facc15" transform="rotate(-32 40 98)" />
              <circle cx="36" cy="88" r="7" fill="#fef08a" />

              <ellipse cx="160" cy="98" rx="16" ry="24" fill="#d97706" transform="rotate(32 160 98)" />
              <ellipse cx="160" cy="98" rx="14" ry="22" fill="#facc15" transform="rotate(32 160 98)" />
              <circle cx="164" cy="88" r="7" fill="#fef08a" />
            </>
          ) : (
            /* Cute Paws Resting or Hugging */
            <>
              <ellipse cx="54" cy="132" rx="16" ry="20" fill="#d97706" transform="rotate(15 54 132)" />
              <ellipse cx="54" cy="132" rx="14" ry="18" fill="#facc15" transform="rotate(15 54 132)" />
              <circle cx="56" cy="134" r="7" fill="#fef08a" />

              <ellipse cx="146" cy="132" rx="16" ry="20" fill="#d97706" transform="rotate(-15 146 132)" />
              <ellipse cx="146" cy="132" rx="14" ry="18" fill="#facc15" transform="rotate(-15 146 132)" />
              <circle cx="144" cy="134" r="7" fill="#fef08a" />
            </>
          )}

          {/* Bear Head (Golden Yellow) */}
          <circle cx="100" cy="80" r="50" fill="#d97706" />
          <circle cx="100" cy="78" r="48" fill="#facc15" />

          {/* Forehead Gloss Reflection */}
          <ellipse cx="85" cy="52" rx="16" ry="8" fill="#ffffff" opacity="0.45" transform="rotate(-15 85 52)" />

          {/* Snout / Muzzle */}
          <ellipse cx="100" cy="92" rx="25" ry="19" fill="#fef08a" />

          {/* Glossy Black Bear Nose */}
          <path d="M 93 84 Q 100 89 107 84 Q 100 95 93 84 Z" fill="#18181b" />
          <ellipse cx="98" cy="85" rx="2.5" ry="1.5" fill="#ffffff" />

          {/* Mouth & Cute Smile */}
          {activeMood === 'happy' || activeMood === 'cheering' || activeMood === 'excited' ? (
            /* Big Joyful Open Smile with Pink Tongue */
            <g>
              <path d="M 91 93 Q 100 105 109 93" fill="#881337" stroke="#18181b" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M 94 98 Q 100 105 106 98" fill="#fb7185" />
            </g>
          ) : activeMood === 'sad' ? (
            /* Sad Mouth */
            <path d="M 93 98 Q 100 92 107 98" stroke="#18181b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          ) : (
            /* Sweet Bear Smile */
            <g>
              <path d="M 100 90 L 100 94" stroke="#18181b" strokeWidth="2" strokeLinecap="round" />
              <path d="M 93 94 Q 100 99 107 94" stroke="#18181b" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </g>
          )}

          {/* Rosy Glowing Cheeks */}
          <ellipse cx="64" cy="86" rx="8" ry="5.5" fill="#fb7185" opacity="0.75" />
          <ellipse cx="136" cy="86" rx="8" ry="5.5" fill="#fb7185" opacity="0.75" />

          {/* Cartoon Sparkly Bear Eyes */}
          {isBlinking ? (
            /* Blinking Curved Lines */
            <>
              <path d="M 72 70 Q 79 75 86 70" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              <path d="M 114 70 Q 121 75 128 70" stroke="#18181b" strokeWidth="3.5" strokeLinecap="round" fill="none" />
            </>
          ) : activeMood === 'happy' || activeMood === 'cheering' ? (
            /* Joyful (^_^) Eyes */
            <>
              <path d="M 72 72 Q 79 62 86 72" stroke="#18181b" strokeWidth="4" strokeLinecap="round" fill="none" />
              <path d="M 114 72 Q 121 62 128 72" stroke="#18181b" strokeWidth="4" strokeLinecap="round" fill="none" />
            </>
          ) : activeMood === 'thinking' ? (
            /* Looking Up Curiously */
            <>
              <circle cx="79" cy="66" r="8" fill="#18181b" />
              <circle cx="76" cy="63" r="3.2" fill="#ffffff" />
              <circle cx="81" cy="68" r="1.5" fill="#ffffff" />

              <circle cx="121" cy="66" r="8" fill="#18181b" />
              <circle cx="118" cy="63" r="3.2" fill="#ffffff" />
              <circle cx="123" cy="68" r="1.5" fill="#ffffff" />
            </>
          ) : (
            /* Big Adorable Disney-Style Sparkly Eyes */
            <>
              <circle cx="79" cy="70" r="8.5" fill="#18181b" />
              <circle cx="76" cy="67" r="3.5" fill="#ffffff" />
              <circle cx="82" cy="73" r="1.6" fill="#ffffff" />

              <circle cx="121" cy="70" r="8.5" fill="#18181b" />
              <circle cx="118" cy="67" r="3.5" fill="#ffffff" />
              <circle cx="124" cy="73" r="1.6" fill="#ffffff" />
            </>
          )}

          {/* ================= SPECIAL COSTUME ACCESSORIES ================= */}
          {costume === 'king' && (
            <g transform="translate(100, 32)">
              <polygon points="-24,6 -26,-15 -14,-4 0,-18 14,-4 26,-15 24,6" fill="#f59e0b" stroke="#b45309" strokeWidth="1.8" />
              <circle cx="0" cy="-4" r="3.5" fill="#ef4444" />
              <circle cx="-14" cy="0" r="2.8" fill="#3b82f6" />
              <circle cx="14" cy="0" r="2.8" fill="#3b82f6" />
              <circle cx="-26" cy="-15" r="2.2" fill="#fef08a" />
              <circle cx="0" cy="-18" r="2.8" fill="#fef08a" />
              <circle cx="26" cy="-15" r="2.2" fill="#fef08a" />
            </g>
          )}

          {costume === 'cyber' && (
            <g transform="translate(100, 70)">
              <path d="M -44 -10 L 44 -10 Q 48 8 40 16 L -40 16 Q -48 8 -44 -10 Z" fill="#06b6d4" stroke="#0891b2" strokeWidth="2" opacity="0.95" />
              <line x1="-36" y1="3" x2="36" y2="3" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
              <circle cx="-42" cy="3" r="4.5" fill="#6366f1" />
              <circle cx="42" cy="3" r="4.5" fill="#6366f1" />
              <line x1="42" y1="3" x2="56" y2="-18" stroke="#6366f1" strokeWidth="3.5" strokeLinecap="round" />
              <circle cx="56" cy="-18" r="3.5" fill="#ec4899" />
            </g>
          )}

          {costume === 'party' && (
            <g transform="translate(100, 70)">
              <polygon points="-20,-12 -15,-2 -4,-2 -12,6 -9,16 -20,10 -31,16 -28,6 -36,-2 -25,-2" fill="#ec4899" stroke="#be185d" strokeWidth="1.5" />
              <polygon points="20,-12 25,-2 36,-2 28,6 31,16 20,10 9,16 12,6 4,-2 15,-2" fill="#8b5cf6" stroke="#6d28d9" strokeWidth="1.5" />
              <line x1="-8" y1="2" x2="8" y2="2" stroke="#f43f5e" strokeWidth="3" />
              <g transform="translate(-32, -42) rotate(-15)">
                <polygon points="0,0 -12,28 12,28" fill="#f43f5e" stroke="#e11d48" strokeWidth="1" />
                <circle cx="0" cy="0" r="4" fill="#fef08a" />
                <line x1="-8" y1="16" x2="8" y2="16" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
              </g>
            </g>
          )}

          {costume === 'graduate' && (
            <g transform="translate(100, 32)">
              <polygon points="0,-18 -36,-4 0,10 36,-4" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
              <polygon points="-16,0 16,0 12,10 -12,10" fill="#27272a" />
              <circle cx="0" cy="-4" r="3" fill="#f59e0b" />
              <path d="M 0 -4 Q 20 4 25 18" fill="none" stroke="#f59e0b" strokeWidth="2.5" />
              <rect x="22" y="18" width="6" height="9" fill="#f59e0b" rx="1.5" />
            </g>
          )}

          {costume === 'astronaut' && (
            <g transform="translate(100, 78)">
              <circle cx="0" cy="0" r="62" fill="none" stroke="#0284c7" strokeWidth="3.5" opacity="0.9" />
              <ellipse cx="-22" cy="-24" rx="16" ry="7" fill="#ffffff" opacity="0.55" transform="rotate(-30 -22 -24)" />
              <path d="M -42 18 Q -34 36 -14 36" fill="none" stroke="#0ea5e9" strokeWidth="3" strokeLinecap="round" />
              <circle cx="-14" cy="36" r="4" fill="#0284c7" />
            </g>
          )}

          {/* SIGNATURE HARIBO RED BOWTIE ON CHIN */}
          <g transform="translate(100, 114)">
            {/* Left Bow Wing */}
            <polygon points="-3,0 -20,-11 -18,11" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
            {/* Right Bow Wing */}
            <polygon points="3,0 20,-11 18,11" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
            {/* Center Knot */}
            <circle cx="0" cy="0" r="5.5" fill="#dc2626" stroke="#991b1b" strokeWidth="1" />
            <circle cx="-1.5" cy="-1.5" r="1.8" fill="#fca5a5" />
          </g>

          {/* Honey Jar Badge in Corner */}
          <g transform="translate(136, 126) scale(0.65)">
            <ellipse cx="20" cy="30" rx="18" ry="16" fill="#f59e0b" stroke="#b45309" strokeWidth="2" />
            <ellipse cx="20" cy="18" rx="16" ry="6" fill="#fef08a" />
            <path d="M 10 20 Q 20 26 30 20 L 32 32 Q 20 40 8 32 Z" fill="#d97706" />
            <text x="20" y="32" fontSize="13" textAnchor="middle" fill="#fff" fontWeight="bold">🍯</text>
          </g>

        </svg>
      </div>

      {/* Mascot Hint Subtitle */}
      <span className="text-[10px] font-black uppercase text-amber-500 dark:text-amber-400 mt-1 tracking-wider">
        Haribo Altın Ayıcık'a Tıkla, Taktik Al! 🍯✨
      </span>

    </div>
  );
};
