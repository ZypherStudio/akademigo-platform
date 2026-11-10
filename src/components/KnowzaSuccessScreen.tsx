import React from 'react';
import { ChevronRight, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

interface KnowzaSuccessScreenProps {
  earnedXp: number;
  onNext: () => void;
  onHome: () => void;
}

export const KnowzaSuccessScreen: React.FC<KnowzaSuccessScreenProps> = ({
  earnedXp = 10,
  onNext,
  onHome
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-b from-[#1C160F] via-[#241A0E] to-[#140F09] flex flex-col justify-between items-center px-6 py-8 select-none animate-fade text-white">
      
      {/* Golden Star Sparks in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <span className="absolute top-12 left-10 text-2xl animate-pulse text-[#FFD700]">⭐</span>
        <span className="absolute top-28 right-12 text-xl animate-pulse text-[#FFD700] delay-100">✨</span>
        <span className="absolute top-48 left-16 text-3xl animate-bounce text-[#FFC700] delay-200">⭐</span>
        <span className="absolute top-64 right-14 text-2xl animate-pulse text-[#FFD700]">✨</span>
        <span className="absolute bottom-40 left-8 text-xl animate-pulse text-[#FFD700]">⭐</span>
        <span className="absolute bottom-52 right-10 text-2xl animate-pulse text-[#FFC700]">⭐</span>
      </div>

      <div className="w-full max-w-sm mx-auto my-auto flex flex-col items-center text-center relative z-10 pt-4">
        
        {/* Jumping Cheering Mascot */}
        <div className="w-56 sm:w-64 filter drop-shadow-[0_20px_35px_rgba(255,184,0,0.35)] animate-bounceSubtle mb-2">
          <img 
            src="/assets/knowza_cheering.png" 
            alt="Knowza Başarı Maskotu" 
            className="w-full h-auto object-contain"
          />
        </div>

        {/* Golden Ribbon Banner: "Harika! Doğru cevap!" */}
        <div className="relative my-4">
          <div className="bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] text-[#2A1E00] font-black text-2xl sm:text-3xl px-8 py-3 rounded-3xl shadow-[0_10px_30px_rgba(255,184,0,0.4)] border-b-4 border-[#C78200] transform -rotate-1">
            Harika!
          </div>
          <div className="text-white text-base sm:text-lg font-black mt-2 tracking-wide">
            Doğru cevap!
          </div>
        </div>

        {/* Big 3D Golden Star with +10 XP */}
        <div className="my-5 flex items-center justify-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2.5 rounded-full border border-white/20 shadow-inner">
          <span className="text-3xl animate-spin-slow">⭐</span>
          <span className="text-2xl sm:text-3xl font-black text-[#FFD54F] font-mono">
            +{earnedXp} XP
          </span>
        </div>

      </div>

      {/* Bottom Navigation Buttons */}
      <div className="w-full max-w-sm space-y-3 pb-4 relative z-10">
        <button
          onClick={() => {
            sound.playClick();
            onNext();
          }}
          className="w-full py-4 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 text-[#2A1E00] font-black text-base sm:text-lg rounded-3xl border-b-[5px] border-[#D99000] active:border-b-0 active:translate-y-1 transition-all shadow-[0_10px_25px_rgba(255,184,0,0.35)] flex items-center justify-center gap-2"
        >
          <span>Devam Et</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onHome();
          }}
          className="w-full py-2.5 text-[#B8A88E] hover:text-white font-extrabold text-sm transition-colors"
        >
          Ana Sayfaya Dön
        </button>
      </div>

    </div>
  );
};
