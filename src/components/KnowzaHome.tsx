import React from 'react';
import { useGame } from '../context/GameContext';
import { Flame, Settings, Play, Plus, Sparkles, ChevronRight, Trophy, Swords, Zap, Bot } from 'lucide-react';
import { sound } from '../utils/audio';
import { KnowzaTab } from './KnowzaBottomNav';

interface KnowzaHomeProps {
  onStartQuiz: (subject: string) => void;
  onOpenLevelUp: () => void;
  onOpenSettings: () => void;
  onNavigateTab: (tab: KnowzaTab) => void;
}

export const KnowzaHome: React.FC<KnowzaHomeProps> = ({
  onStartQuiz,
  onOpenLevelUp,
  onOpenSettings,
  onNavigateTab
}) => {
  const { stats } = useGame();

  const subjects = [
    { id: 'ingilizce', name: 'İngilizce', flag: '🇬🇧', level: 'Seviye 1 • Ders 3', active: true },
    { id: 'almanca', name: 'Almanca', flag: '🇩🇪', level: 'Seviye 1' },
    { id: 'fransizca', name: 'Fransızca', flag: '🇫🇷', level: 'Seviye 1' },
    { id: 'matematik', name: 'TYT Matematik', flag: '📐', level: 'Bölüm 1' },
    { id: 'kodlama', name: 'Kodlama / Python', flag: '💻', level: 'Junior Mod' },
    { id: 'kpss', name: 'KPSS 2026', flag: '🏛️', level: 'Genel Kültür' }
  ];

  return (
    <div className="flex-1 max-w-md mx-auto px-4 py-4 space-y-5 pb-36 select-none">
      
      {/* Top Header Bar */}
      <div className="flex items-center justify-between pt-1">
        
        {/* User Profile Pill */}
        <div 
          onClick={() => onNavigateTab('profile')}
          className="flex items-center gap-3 cursor-pointer group active:scale-95 transition-all"
        >
          <div className="w-12 h-12 rounded-full border-2 border-[#FFB800] p-0.5 shadow-sm bg-white overflow-hidden">
            <img 
              src="/assets/knowza_icon.png" 
              alt="Knowza Profil" 
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div>
            <span className="text-[11px] font-bold text-[#8C7A5E] block leading-none">Merhaba!</span>
            <h2 className="text-lg font-black text-[#2A1E00] flex items-center gap-1.5 leading-snug">
              <span>{stats.username || 'Alp'}</span>
              <span className="text-sm">👑</span>
            </h2>
          </div>
        </div>

        {/* Right Action Icons: Streak & Settings */}
        <div className="flex items-center gap-2">
          {/* Daily Streak Pill */}
          <div className="flex items-center gap-1.5 bg-[#FFF2D6] border border-[#FFE2A3] px-3 py-1.5 rounded-2xl text-[#D96B00] font-black text-xs shadow-sm">
            <Flame className="w-4 h-4 fill-[#FF8A00] text-[#FF8A00] animate-bounceSubtle" />
            <span>{stats.streak || 12}</span>
          </div>

          {/* Settings Button */}
          <button
            onClick={() => {
              sound.playClick();
              onOpenSettings();
            }}
            className="w-9 h-9 rounded-2xl bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] hover:text-[#2A1E00] hover:bg-[#FFF9EC] shadow-sm active:scale-90 transition-all"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>

      </div>

      {/* Card 1: Günlük Serin Kartı (Matching Image 2 Screen 2) */}
      <div className="bg-gradient-to-r from-[#FFF8E7] via-[#FFF2D6] to-[#FFEABF] rounded-3xl p-5 border border-[#FFE2A3] shadow-[0_8px_20px_rgba(255,184,0,0.12)] flex items-center justify-between relative overflow-hidden">
        <div className="space-y-1 relative z-10">
          <span className="text-xs font-black uppercase text-[#8C7A5E] tracking-wider">
            Günlük Serin
          </span>
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 fill-[#FF8A00] text-[#FF8A00]" />
            <h3 className="text-2xl font-black text-[#2A1E00]">
              {stats.streak || 12} gün
            </h3>
          </div>
          <p className="text-xs font-bold text-[#D98200]">
            Devam et! Yarın serin {(stats.streak || 1) + 1} gün olacak.
          </p>
        </div>

        {/* Mascot on Cloud */}
        <div className="w-24 sm:w-28 filter drop-shadow-md relative z-10 -mr-2">
          <img 
            src="/assets/knowza_reading.png" 
            alt="Knowza Bulut Maskot" 
            className="w-full h-auto object-contain animate-float"
          />
        </div>
      </div>

      {/* Section: Bugünün Dersleri */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-black text-[#2A1E00]">
            Bugünün Dersleri
          </h3>
          <span className="text-xs font-black text-[#FFB800] hover:underline cursor-pointer">
            Tümünü Gör
          </span>
        </div>

        {/* Featured Primary Subject: İngilizce */}
        <div 
          onClick={() => {
            sound.playClick();
            onStartQuiz('İngilizce');
          }}
          className="bg-white rounded-3xl p-5 border-2 border-[#FFE2A3] hover:border-[#FFB800] shadow-[0_8px_24px_rgba(255,184,0,0.1)] flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF8E7] border border-[#FFE2A3] flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
              🇬🇧
            </div>
            <div>
              <h4 className="text-lg font-black text-[#2A1E00]">
                İngilizce
              </h4>
              <p className="text-xs font-bold text-[#8C7A5E] mt-0.5">
                Seviye 1 • Ders 3
              </p>
            </div>
          </div>

          {/* Golden Circle Play Button */}
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#FFB800] to-[#FFD54F] border-b-4 border-[#D99000] flex items-center justify-center text-[#2A1E00] shadow-md group-hover:scale-110 active:border-b-0 active:translate-y-1 transition-all">
            <Play className="w-5 h-5 fill-[#2A1E00] ml-0.5" />
          </div>
        </div>

        {/* Secondary Subjects Grid (Almanca, Fransızca, Kodlama, vb.) */}
        <div className="grid grid-cols-3 gap-2.5">
          {subjects.slice(1, 4).map((sub) => (
            <button
              key={sub.id}
              onClick={() => {
                sound.playClick();
                onStartQuiz(sub.name);
              }}
              className="bg-white p-3 rounded-2xl border border-[#F2E8D5] hover:border-[#FFB800] hover:bg-[#FFFDF7] shadow-sm flex flex-col items-center text-center transition-all active:scale-95"
            >
              <span className="text-2xl mb-1">{sub.flag}</span>
              <span className="font-black text-xs text-[#2A1E00] truncate max-w-full">
                {sub.name}
              </span>
              <span className="text-[10px] font-bold text-[#8C7A5E] mt-0.5">
                {sub.level}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Card 2: Seviye Atlama Zamanı! (Matching Image 2 Screen 2) */}
      <div 
        onClick={() => {
          sound.playVictory();
          onOpenLevelUp();
        }}
        className="bg-gradient-to-r from-[#FFF8E7] to-[#FFF0CC] rounded-3xl p-4 sm:p-5 border-2 border-[#FFE2A3] hover:border-[#FFB800] shadow-[0_8px_20px_rgba(255,184,0,0.12)] flex items-center justify-between cursor-pointer active:scale-98 transition-all group"
      >
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 bg-[#FFB800]/20 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase text-[#D98200]">
            <Sparkles className="w-3 h-3 text-[#FFB800]" />
            Yeni Bölüm Açıldı
          </div>
          <h4 className="text-base sm:text-lg font-black text-[#2A1E00]">
            Seviye Atlama Zamanı!
          </h4>
          <p className="text-xs font-bold text-[#8C7A5E]">
            Seviye 13'e geçmek için tıkla ve kutla!
          </p>
        </div>

        {/* Mascot Cheering */}
        <div className="w-16 sm:w-20 filter drop-shadow-md group-hover:scale-110 transition-transform">
          <img 
            src="/assets/knowza_cheering.png" 
            alt="Knowza Seviye Atlama" 
            className="w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* Viral Game Rooms Grid: KahootGO, 1v1 Düello, Soru Kaydır */}
      <div className="space-y-3 pt-1">
        <h3 className="text-base font-black text-[#2A1E00] flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#FFB800]" />
          <span>Canlı Yarışma Odaları</span>
        </h3>

        <div className="grid grid-cols-2 gap-3">
          {/* KahootGO Card */}
          <button
            onClick={() => onNavigateTab('kahoot')}
            className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl p-4 text-white shadow-md text-left flex flex-col justify-between h-28 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Grup Oyunu
              </span>
              <h5 className="font-black text-sm sm:text-base leading-tight">KahootGO 🏆</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">PIN ile Çok Oyunculu</p>
            </div>
            <span className="text-xl self-end">▲ ◆ ● ■</span>
          </button>

          {/* 1v1 Bilgi Düellosu Card */}
          <button
            onClick={() => onNavigateTab('duel')}
            className="bg-gradient-to-br from-rose-500 to-orange-500 rounded-3xl p-4 text-white shadow-md text-left flex flex-col justify-between h-28 relative overflow-hidden group active:scale-95 transition-all"
          >
            <div>
              <span className="text-[10px] font-black uppercase bg-white/20 px-2 py-0.5 rounded-md inline-block mb-1">
                Anlık Kapışma
              </span>
              <h5 className="font-black text-sm sm:text-base leading-tight">1v1 Düello ⚔️</h5>
              <p className="text-[10px] text-white/80 font-bold mt-0.5">ELO Puanı Kazan</p>
            </div>
            <span className="text-xs font-black self-end bg-black/20 px-2 py-1 rounded-lg">
              👑 {stats.eloRating || 1240} ELO
            </span>
          </button>
        </div>
      </div>

    </div>
  );
};
