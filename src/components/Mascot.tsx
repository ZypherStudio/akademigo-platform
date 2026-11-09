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

const WITTY_QUOTES = [
  "Her gün 5 soru çözmek, beynini şampiyon yapar! 🧠",
  "Hata yapmaktan korkma, en iyi öğrenme yanlışlardan doğar! ✨",
  "Bugün harika bir odaklanma günündesin! Hadi başlayalım! 🚀",
  "Tebrikler! Adım adım hedefe koşuyorsun! 🦉",
  "Mola vermeyi unutma, su içmeyi de ihmal etme! 💧",
  "Biraz Kodlama veya Deneme Sınavı çözmeye ne dersin? 💻"
];

export const Mascot: React.FC<MascotProps> = ({
  mood = 'idle',
  speech,
  size = 'md',
  interactive = true,
  onMascotClick,
  className = ''
}) => {
  const [currentSpeech, setCurrentSpeech] = useState<string>(speech || WITTY_QUOTES[0]);
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
      setTimeout(() => setIsBlinking(false), 200);
    }, 4000);
    return () => clearInterval(blinkInterval);
  }, []);

  const handleClick = () => {
    if (!interactive) return;
    sound.playClick();
    // Rotate to a random witty quote if no static speech provided
    const randomQuote = WITTY_QUOTES[Math.floor(Math.random() * WITTY_QUOTES.length)];
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
          className="mb-2 max-w-xs sm:max-w-sm bg-white border-2 border-gray-200 text-gray-800 font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-2xl shadow-md relative animate-pop cursor-pointer hover:border-[#58cc02] hover:bg-green-50/50 transition-all text-center leading-snug"
        >
          {currentSpeech}
          {/* Bubble tail pointing downwards */}
          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
          <div className="absolute left-1/2 -bottom-2.5 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-gray-200 -z-10" />
        </div>
      )}

      {/* SVG Custom Mascot: "BİBO" the Scholar Owl */}
      <div 
        onClick={handleClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`${sizeClasses[size]} relative cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95 ${
          activeMood === 'excited' || activeMood === 'happy' ? 'animate-bounce' : 'animate-bounceSubtle'
        }`}
        title="Bibo - Senin Eğitim Rehberin (Tıkla ve konuş!)"
      >
        <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-lg overflow-visible">
          <defs>
            {/* Feathers Gradient */}
            <linearGradient id="owlGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#68e005" />
              <stop offset="100%" stopColor="#48b002" />
            </linearGradient>
            
            {/* Belly Soft Gradient */}
            <linearGradient id="owlBellyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e8f8d6" />
            </linearGradient>

            {/* Mortarboard Graduation Cap Gradient */}
            <linearGradient id="capGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e293b" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>

          {/* Feet */}
          <ellipse cx="75" cy="182" rx="14" ry="7" fill="#f59e0b" />
          <ellipse cx="125" cy="182" rx="14" ry="7" fill="#f59e0b" />

          {/* Left & Right Wings */}
          {activeMood === 'happy' || activeMood === 'cheering' ? (
            /* Waving / Happy Wings UP */
            <>
              <path
                d="M 35 110 C 15 90, 10 65, 30 75 C 45 82, 55 105, 50 130 Z"
                fill="#46a302"
                className="transition-transform duration-300 transform -rotate-12 origin-bottom-right"
              />
              <path
                d="M 165 110 C 185 90, 190 65, 170 75 C 155 82, 145 105, 150 130 Z"
                fill="#46a302"
                className="transition-transform duration-300 transform rotate-12 origin-bottom-left"
              />
            </>
          ) : (
            /* Rest / Down Wings */
            <>
              <path
                d="M 40 100 C 20 120, 25 155, 45 160 C 55 162, 60 140, 55 115 Z"
                fill="#46a302"
              />
              <path
                d="M 160 100 C 180 120, 175 155, 155 160 C 145 162, 140 140, 145 115 Z"
                fill="#46a302"
              />
            </>
          )}

          {/* Main Body (Friendly Owl Shape) */}
          <path
            d="M 100 30 C 50 30, 35 70, 35 125 C 35 170, 65 185, 100 185 C 135 185, 165 170, 165 125 C 165 70, 150 30, 100 30 Z"
            fill="url(#owlGreenGrad)"
          />

          {/* Feather Ears / Tuft */}
          <path d="M 55 42 L 40 18 L 70 34 Z" fill="#3f9602" />
          <path d="M 145 42 L 160 18 L 130 34 Z" fill="#3f9602" />

          {/* White Belly */}
          <ellipse cx="100" cy="135" rx="42" ry="40" fill="url(#owlBellyGrad)" />

          {/* Belly Feather Chevrons (Duolingo style) */}
          <path d="M 90 125 Q 100 132 110 125" stroke="#89e219" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 85 142 Q 100 150 115 142" stroke="#89e219" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 92 158 Q 100 164 108 158" stroke="#89e219" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Big Expressive Eye Rings */}
          <circle cx="70" cy="85" r="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />
          <circle cx="130" cy="85" r="28" fill="#ffffff" stroke="#e2e8f0" strokeWidth="2" />

          {/* Eyes State depending on Mood */}
          {isBlinking ? (
            /* Blinking horizontal slit */
            <>
              <line x1="55" y1="85" x2="85" y2="85" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
              <line x1="115" y1="85" x2="145" y2="85" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" />
            </>
          ) : activeMood === 'happy' || activeMood === 'cheering' ? (
            /* Happy curved eyes (^_^) */
            <>
              <path d="M 56 88 Q 70 72 84 88" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round" />
              <path d="M 116 88 Q 130 72 144 88" stroke="#1e293b" strokeWidth="5" fill="none" strokeLinecap="round" />
              {/* Rosy Cheeks */}
              <circle cx="50" cy="105" r="7" fill="#ff7675" opacity="0.6" />
              <circle cx="150" cy="105" r="7" fill="#ff7675" opacity="0.6" />
            </>
          ) : activeMood === 'sad' ? (
            /* Sad Drooping Eyes + Tear */
            <>
              <circle cx="70" cy="88" r="14" fill="#1e293b" />
              <circle cx="66" cy="84" r="5" fill="#ffffff" />
              <circle cx="130" cy="88" r="14" fill="#1e293b" />
              <circle cx="126" cy="84" r="5" fill="#ffffff" />
              {/* Tear drop */}
              <ellipse cx="145" cy="105" rx="3" ry="5" fill="#60a5fa" />
            </>
          ) : activeMood === 'thinking' ? (
            /* Thinking / Looking Up */
            <>
              <circle cx="70" cy="78" r="14" fill="#1e293b" />
              <circle cx="66" cy="74" r="5" fill="#ffffff" />
              <circle cx="130" cy="78" r="14" fill="#1e293b" />
              <circle cx="126" cy="74" r="5" fill="#ffffff" />
              {/* Lightbulb Sparkle Above */}
              <circle cx="100" cy="15" r="6" fill="#fbbf24" />
            </>
          ) : (
            /* Normal Alert Pupils with reflection */
            <>
              <circle cx="73" cy="85" r="15" fill="#1e293b" />
              <circle cx="69" cy="80" r="5" fill="#ffffff" />
              <circle cx="127" cy="85" r="15" fill="#1e293b" />
              <circle cx="123" cy="80" r="5" fill="#ffffff" />
            </>
          )}

          {/* Beak */}
          <polygon points="90,95 110,95 100,118" fill="#f59e0b" />
          <polygon points="90,95 100,118 100,95" fill="#d97706" />

          {/* Graduation Cap (Scholar / AkademiGO Symbol) */}
          <g transform="translate(10, -5)">
            {/* Cap base diamond */}
            <polygon points="90,15 150,28 90,40 30,28" fill="url(#capGrad)" stroke="#334155" strokeWidth="2" />
            {/* Skullcap underneath */}
            <path d="M 65 32 Q 90 42 115 32 L 115 40 Q 90 48 65 40 Z" fill="#0f172a" />
            {/* Golden Tassel */}
            <circle cx="90" cy="27" r="3" fill="#f59e0b" />
            <path d="M 90 27 Q 120 32 135 50" stroke="#f59e0b" strokeWidth="2.5" fill="none" />
            <rect x="132" y="48" width="6" height="12" rx="2" fill="#f59e0b" />
          </g>

          {/* Sparkles if excited */}
          {(activeMood === 'excited' || activeMood === 'cheering') && (
            <>
              <text x="20" y="50" fontSize="18" fill="#fbbf24" className="animate-ping">✨</text>
              <text x="160" y="50" fontSize="18" fill="#fbbf24" className="animate-ping">⭐</text>
            </>
          )}
        </svg>
      </div>

    </div>
  );
};
