import React, { useState } from 'react';
import { ChevronRight, ShieldCheck, Mail, ArrowRight } from 'lucide-react';
import { sound } from '../utils/audio';

interface KnowzaSplashProps {
  onStartGoogle: () => void;
  onOpenEmailAuth: () => void;
}

export const KnowzaSplash: React.FC<KnowzaSplashProps> = ({ onStartGoogle, onOpenEmailAuth }) => {
  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#FFFDF7] flex flex-col justify-between items-center px-5 py-5 select-none overflow-hidden relative">
      
      {/* Top Background Soft Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-[420px] h-[260px] bg-gradient-to-b from-[#FFE8B3] via-[#FFF3D6] to-transparent rounded-full opacity-60 pointer-events-none" />

      {/* Header Logo */}
      <div className="pt-2 sm:pt-4 flex flex-col items-center text-center relative z-10 animate-pop">
        <div className="w-44 sm:w-52 filter drop-shadow-md">
          <img 
            src="/assets/knowza_logo_hd.png" 
            alt="Knowza 3D Logo" 
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="text-[#8C7A5E] font-extrabold text-xs sm:text-sm mt-1 tracking-wide">
          Daha fazlasını öğren! 🎓✨
        </p>
      </div>

      {/* Center 3D Mascot Character */}
      <div className="flex-1 w-full flex items-center justify-center relative z-10 py-1">
        <div className="max-h-[36vh] max-w-[240px] sm:max-w-[280px] flex items-center justify-center animate-bounceSubtle filter drop-shadow-[0_12px_28px_rgba(255,184,0,0.25)]">
          <img 
            src="/assets/knowza_main.png" 
            alt="Knowza Ayıcığı Maskotu" 
            className="w-full h-auto max-h-[34vh] object-contain transform hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Account Login / Sign-up Actions */}
      <div className="w-full max-w-sm space-y-2.5 pb-2 relative z-10">
        
        {/* Google Sign In Button */}
        <button
          onClick={() => {
            sound.playClick();
            onStartGoogle();
          }}
          className="w-full py-3.5 sm:py-4 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm sm:text-base rounded-2xl border-2 border-slate-200 active:border-slate-300 active:translate-y-0.5 transition shadow-sm flex items-center justify-center gap-3 group"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google ile Giriş Yap</span>
        </button>

        {/* E-posta ile Hesap Aç / Giriş Yap */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenEmailAuth();
          }}
          className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 text-[#2A1E00] font-black text-sm sm:text-base rounded-2xl border-b-[5px] border-[#D99000] active:border-b-0 active:translate-y-1 transition shadow-[0_8px_20px_rgba(255,184,0,0.3)] flex items-center justify-center gap-2"
        >
          <Mail className="w-5 h-5 stroke-[2.5]" />
          <span>E-posta ile Hesap Aç / Giriş Yap</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>

        {/* Info Badge */}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-slate-400 text-[11px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
          <span>Play Store & Web Uyumlu Güvenli Giriş</span>
        </div>
      </div>

    </div>
  );
};
