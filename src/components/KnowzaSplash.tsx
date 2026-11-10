import React from 'react';
import { ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface KnowzaSplashProps {
  onStart: () => void;
  onLogin: () => void;
}

export const KnowzaSplash: React.FC<KnowzaSplashProps> = ({ onStart, onLogin }) => {
  return (
    <div className="min-h-screen bg-[#FFFDF7] flex flex-col justify-between items-center px-6 py-8 relative overflow-hidden select-none">
      
      {/* Top Background Soft Glow & Curve */}
      <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] h-[360px] bg-gradient-to-b from-[#FFE8B3] via-[#FFF3D6] to-transparent rounded-[100%] opacity-70 pointer-events-none" />

      {/* Header Logo */}
      <div className="pt-6 sm:pt-10 flex flex-col items-center text-center relative z-10 animate-pop">
        <div className="w-48 sm:w-56 filter drop-shadow-sm">
          <img 
            src="/assets/knowza_logo.png" 
            alt="Knowza Logo" 
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="text-[#8C7A5E] font-extrabold text-sm sm:text-base mt-2 tracking-wide">
          Daha fazlasını öğren!
        </p>
      </div>

      {/* Center 3D Mascot Character */}
      <div className="my-auto relative z-10 flex flex-col items-center animate-bounceSubtle">
        <div className="w-64 sm:w-72 md:w-80 filter drop-shadow-[0_16px_32px_rgba(255,184,0,0.25)]">
          <img 
            src="/assets/knowza_main.png" 
            alt="Knowza Ayıcığı Maskotu" 
            className="w-full h-auto object-contain transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full max-w-sm space-y-3 pb-6 relative z-10">
        <button
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="w-full py-4 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 text-[#2A1E00] font-black text-base sm:text-lg rounded-3xl border-b-[5px] border-[#D99000] active:border-b-0 active:translate-y-1 transition-all shadow-[0_10px_25px_rgba(255,184,0,0.35)] flex items-center justify-center gap-2"
        >
          <span>Başla</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onLogin();
          }}
          className="w-full py-3 text-[#8C7A5E] hover:text-[#504028] font-black text-sm rounded-2xl transition-all"
        >
          Giriş Yap
        </button>
      </div>

    </div>
  );
};
