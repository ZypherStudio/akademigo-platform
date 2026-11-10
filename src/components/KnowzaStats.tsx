import React from 'react';
import { useGame } from '../context/GameContext';
import { ArrowLeft, Flame, Check, Trophy, Share2, TrendingUp } from 'lucide-react';
import { sound } from '../utils/audio';

interface KnowzaStatsProps {
  onBack: () => void;
}

export const KnowzaStats: React.FC<KnowzaStatsProps> = ({ onBack }) => {
  const { stats } = useGame();

  const weeklyData = [
    { day: 'Pzt', height: 'h-16', active: false },
    { day: 'Sal', height: 'h-24', active: false },
    { day: 'Çar', height: 'h-20', active: false },
    { day: 'Per', height: 'h-28', active: false },
    { day: 'Cum', height: 'h-22', active: false },
    { day: 'Cmt', height: 'h-32', active: true },
    { day: 'Paz', height: 'h-26', active: false }
  ];

  return (
    <div className="flex-1 max-w-md mx-auto px-4 py-4 space-y-5 pb-28 select-none animate-fade">
      
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="w-10 h-10 rounded-full bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] active:scale-90 transition-all shadow-sm"
        >
          <ArrowLeft className="w-5 h-5 stroke-[2.5]" />
        </button>

        <h1 className="text-lg font-black text-[#2A1E00] flex items-center gap-1.5">
          <span>İstatistikler</span>
        </h1>

        <button
          onClick={() => sound.playClick()}
          className="w-10 h-10 rounded-full bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] active:scale-90 transition-all shadow-sm"
        >
          <Share2 className="w-4 h-4" />
        </button>
      </div>

      {/* User Progress Header Card */}
      <div className="bg-white rounded-3xl p-5 border-2 border-[#FFE2A3] shadow-[0_8px_24px_rgba(255,184,0,0.1)] flex items-center gap-4">
        <div className="w-16 h-16 rounded-full border-2 border-[#FFB800] p-1 bg-[#FFF8E7] overflow-hidden flex-shrink-0">
          <img 
            src="/assets/knowza_icon.png" 
            alt="Alp Profil" 
            className="w-full h-full object-cover rounded-full"
          />
        </div>

        <div className="flex-1">
          <h2 className="text-xl font-black text-[#2A1E00]">{stats.username || 'Alp'}</h2>
          <div className="text-xs font-black text-[#D98200] mt-0.5">Seviye 12</div>

          {/* Level Progress Bar */}
          <div className="mt-2">
            <div className="bg-[#F5EEDD] h-3 rounded-full overflow-hidden p-0.5 border border-[#E8DFC8]">
              <div 
                className="bg-gradient-to-r from-[#FFC700] to-[#FFB800] h-full rounded-full transition-all duration-500 shadow-sm"
                style={{ width: '68%' }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-black text-[#8C7A5E] mt-1 font-mono">
              <span>İlerleme</span>
              <span>680 / 1.000 XP</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Metric Stats (Matching Image 2 Screen 5) */}
      <div className="grid grid-cols-3 gap-2.5">
        
        {/* Metric 1: Gün Serisi */}
        <div className="bg-white rounded-3xl p-4 border border-[#F2E8D5] shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF2D6] flex items-center justify-center mb-1">
            <Flame className="w-5 h-5 fill-[#FF8A00] text-[#FF8A00]" />
          </div>
          <span className="text-xl font-black text-[#2A1E00]">{stats.streak || 12}</span>
          <span className="text-[10px] font-bold text-[#8C7A5E]">Gün Serisi</span>
        </div>

        {/* Metric 2: Doğru Cevap */}
        <div className="bg-white rounded-3xl p-4 border border-[#F2E8D5] shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-[#EBFBE5] flex items-center justify-center mb-1">
            <Check className="w-5 h-5 stroke-[3] text-[#58CC02]" />
          </div>
          <span className="text-xl font-black text-[#2A1E00]">{stats.totalQuestionsAnswered || 856}</span>
          <span className="text-[10px] font-bold text-[#8C7A5E]">Doğru Cevap</span>
        </div>

        {/* Metric 3: Rozet */}
        <div className="bg-white rounded-3xl p-4 border border-[#F2E8D5] shadow-sm flex flex-col items-center text-center">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF5D9] flex items-center justify-center mb-1">
            <Trophy className="w-5 h-5 fill-[#FFB800] text-[#FFB800]" />
          </div>
          <span className="text-xl font-black text-[#2A1E00]">28</span>
          <span className="text-[10px] font-bold text-[#8C7A5E]">Rozet</span>
        </div>

      </div>

      {/* Başarı Grafiği (Weekly Bar Chart) */}
      <div className="bg-white rounded-3xl p-5 border-2 border-[#FFE2A3] shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#2A1E00] flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-[#FFB800]" />
            <span>Başarı Grafiği</span>
          </h3>
          <span className="text-[10px] font-black uppercase text-[#8C7A5E] bg-[#FFF8E7] px-2 py-0.5 rounded-full">
            Bu Hafta
          </span>
        </div>

        {/* Golden Column Bars */}
        <div className="flex items-end justify-between h-36 pt-4 px-2">
          {weeklyData.map((d, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <div
                className={`w-8 rounded-2xl transition-all duration-300 ${d.height} ${
                  d.active
                    ? 'bg-gradient-to-t from-[#FFB800] to-[#FFD54F] shadow-md ring-2 ring-[#FFB800]/40'
                    : 'bg-gradient-to-t from-[#FFE8B3] to-[#FFF0CC]'
                }`}
              />
              <span className="text-[11px] font-black text-[#8C7A5E]">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* En Çok Öğrendiğin Dil / Konu */}
      <div className="bg-white rounded-3xl p-5 border border-[#F2E8D5] shadow-sm space-y-2">
        <h3 className="text-xs font-black uppercase text-[#8C7A5E]">
          En Çok Öğrendiğin Dil
        </h3>
        
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🇬🇧</span>
            <div>
              <div className="font-black text-sm text-[#2A1E00]">İngilizce</div>
              <div className="text-[11px] text-[#8C7A5E] font-bold">14 Bölüm Tamamlandı</div>
            </div>
          </div>

          <div className="text-right">
            <span className="font-black text-sm text-[#58CC02] bg-[#EBFBE5] px-2.5 py-1 rounded-full">
              %92 Doğru
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
