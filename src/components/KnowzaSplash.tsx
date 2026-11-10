import React from 'react';
import { ChevronRight, Download } from 'lucide-react';
import { sound } from '../utils/audio';

interface KnowzaSplashProps {
  onStart: () => void;
  onLogin: () => void;
}

export const KnowzaSplash: React.FC<KnowzaSplashProps> = ({ onStart, onLogin }) => {
  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#FFFDF7] flex flex-col justify-between items-center px-5 py-5 select-none overflow-hidden relative">
      
      {/* Top Background Soft Glow - Clamped to 100% width so zero mobile overflow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-[420px] h-[260px] bg-gradient-to-b from-[#FFE8B3] via-[#FFF3D6] to-transparent rounded-full opacity-60 pointer-events-none" />

      {/* Header Logo */}
      <div className="pt-2 sm:pt-6 flex flex-col items-center text-center relative z-10 animate-pop">
        <div className="w-40 sm:w-52 filter drop-shadow-sm">
          <img 
            src="/assets/knowza_logo.png" 
            alt="Knowza Logo" 
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="text-[#8C7A5E] font-extrabold text-xs sm:text-sm mt-1 tracking-wide">
          Daha fazlasını öğren!
        </p>
      </div>

      {/* Center 3D Mascot Character (Auto-scaled for any mobile height) */}
      <div className="flex-1 w-full flex items-center justify-center relative z-10 py-1">
        <div className="max-h-[38vh] max-w-[240px] sm:max-w-[280px] flex items-center justify-center animate-bounceSubtle filter drop-shadow-[0_12px_28px_rgba(255,184,0,0.25)]">
          <img 
            src="/assets/knowza_main.png" 
            alt="Knowza Ayıcığı Maskotu" 
            className="w-full h-auto max-h-[36vh] object-contain transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="w-full max-w-sm space-y-2.5 pb-2 relative z-10">
        <button
          onClick={() => {
            sound.playClick();
            onStart();
          }}
          className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 text-[#2A1E00] font-black text-base sm:text-lg rounded-2xl border-b-[5px] border-[#D99000] active:border-b-0 active:translate-y-1 transition-all shadow-[0_8px_20px_rgba(255,184,0,0.3)] flex items-center justify-center gap-2"
        >
          <span>Başla</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>

        <div className="flex items-center justify-between px-2 pt-0.5">
          <button
            onClick={() => {
              sound.playClick();
              onLogin();
            }}
            className="py-1.5 text-[#8C7A5E] hover:text-[#504028] font-black text-xs transition-all"
          >
            Zaten Hesabım Var (Giriş)
          </button>

          <a
            href="/assets/knowza_logo_hd.png"
            download="Knowza_Logo_3D_Official.png"
            className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-700/80 hover:text-amber-900 transition bg-amber-100/60 hover:bg-amber-100 px-2.5 py-1 rounded-full"
            title="Orijinal 3D Logoyu İndir"
          >
            <Download className="w-3 h-3" />
            <span>Logo İndir</span>
          </a>
        </div>
      </div>

    </div>
  );
};
