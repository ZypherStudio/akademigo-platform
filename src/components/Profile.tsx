import React, { useState } from 'react';
import { useGame, AVATAR_MAP } from '../context/GameContext';
import { AppTheme, UserAvatar } from '../types';
import { Flame, Gem, Trophy, Award, Palette, User, Shield, Check, Sparkles, BookOpen, Clock, Heart } from 'lucide-react';
import { sound } from '../utils/audio';

const THEMES: { id: AppTheme; name: string; bg: string; border: string; accent: string }[] = [
  { id: 'duo', name: 'Duolingo Yeşili', bg: 'bg-[#58cc02]', border: 'border-[#46a302]', accent: '#58cc02' },
  { id: 'dark', name: 'Gece Modu (Dark)', bg: 'bg-gray-900', border: 'border-gray-800', accent: '#1f2937' },
  { id: 'cyber', name: 'Siberpunk Mor', bg: 'bg-[#af72ff]', border: 'border-[#9047ff]', accent: '#af72ff' },
  { id: 'gold', name: 'Altın Şampiyon', bg: 'bg-[#ffc800]', border: 'border-[#e5b300]', accent: '#ffc800' },
  { id: 'ocean', name: 'Okyanus Mavisi', bg: 'bg-[#1cb0f6]', border: 'border-[#1899d6]', accent: '#1cb0f6' }
];

const AVAILABLE_TITLES = [
  'YKS Derece Adayı 🎓',
  'Kodlama Virtüözü 💻',
  'KPSS Rekortmeni 🏛️',
  'Hafıza Şampiyonu 🧠',
  'Soru Canavarı ⚡',
  'Efsanevi Kaşif 🚀'
];

const BANNERS = [
  { id: 'from-emerald-500 to-green-600', name: 'Zümrüt Yeşili' },
  { id: 'from-blue-600 to-indigo-700', name: 'Gece Mavisi' },
  { id: 'from-purple-600 to-pink-600', name: 'Neon Galaksi' },
  { id: 'from-amber-500 to-orange-600', name: 'Güneş Patlaması' },
  { id: 'from-gray-800 to-slate-950', name: 'Mat Siyah' }
];

export const Profile: React.FC = () => {
  const { stats, setTheme, setAvatar, setTitle, setBannerColor, userLevel, levelProgress } = useGame();
  const [activeTab, setActiveTab] = useState<'stats' | 'themes' | 'avatar'>('stats');

  const currentAvatarInfo = AVATAR_MAP[stats.avatar] || AVATAR_MAP['owl'];

  const badges = [
    {
      id: 'b1',
      title: 'İlk Adım',
      description: 'İlk dersini başarıyla tamamladın',
      icon: '🌱',
      unlocked: stats.completedLessons.length >= 1
    },
    {
      id: 'b2',
      title: 'Ateşli Seri',
      description: '5 gün üst üste ders çözdün',
      icon: '🔥',
      unlocked: stats.streak >= 5
    },
    {
      id: 'b3',
      title: 'Hazine Avcısı',
      description: 'En az bir ödül sandığı açtın',
      icon: '🎁',
      unlocked: stats.openedChests.length >= 1
    },
    {
      id: 'b4',
      title: 'Bilgi Ustası',
      description: '100\'den fazla XP biriktirdin',
      icon: '👑',
      unlocked: stats.xp >= 100
    },
    {
      id: 'b5',
      title: 'Elmas Koleksiyoneri',
      description: '200\'den fazla elmas biriktirdin',
      icon: '💎',
      unlocked: stats.gems >= 200
    },
    {
      id: 'b6',
      title: 'Şampiyon Zihin',
      description: '5 dersi başarıyla bitir',
      icon: '🏆',
      unlocked: stats.completedLessons.length >= 5
    }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 space-y-6 pb-24 select-none">
      
      {/* Profile Header Card with Custom Banner */}
      <div className={`rounded-3xl p-6 text-white shadow-xl bg-gradient-to-r ${stats.bannerColor} relative overflow-hidden transition-all duration-500`}>
        <div className="flex flex-col sm:flex-row items-center gap-6 relative z-10">
          
          {/* Avatar with Level Badge */}
          <div className="relative">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center text-6xl shadow-inner select-none animate-bounceSubtle">
              {currentAvatarInfo.emoji}
            </div>
            {/* Level Badge */}
            <div className="absolute -bottom-2 -right-2 bg-amber-400 text-amber-950 font-black text-xs px-2.5 py-1 rounded-xl shadow-md border-2 border-white flex items-center gap-1">
              <span>LVL</span>
              <span className="text-sm">{userLevel}</span>
            </div>
          </div>

          {/* User Info & Title */}
          <div className="text-center sm:text-left flex-1">
            <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Elmas Ligi Öğrencisi
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Sen</h2>
            <p className="text-white/90 text-sm font-bold mt-0.5">{stats.title}</p>

            {/* Level Progression Bar */}
            <div className="mt-4 max-w-sm">
              <div className="flex justify-between text-xs font-black mb-1">
                <span>Seviye {userLevel} Kaşif</span>
                <span>{levelProgress} / 100 XP (Seviye {userLevel + 1})</span>
              </div>
              <div className="w-full bg-black/30 h-3 rounded-full overflow-hidden border border-white/20">
                <div
                  className="bg-amber-300 h-full rounded-full transition-all duration-500 shadow-sm"
                  style={{ width: `${levelProgress}%` }}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Subtle Background Circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Sub Tabs: İstatistikler, Temalar & Renkler, Avatar & Ünvan */}
      <div className="flex items-center gap-1.5 p-1 bg-white border-2 border-gray-200 rounded-2xl shadow-sm">
        {[
          { id: 'stats', label: '📊 İstatistik', fullLabel: '📊 İstatistikler & Rozetler' },
          { id: 'themes', label: '🎨 Temalar', fullLabel: '🎨 Tema & Arka Plan' },
          { id: 'avatar', label: '👤 Avatar', fullLabel: '👤 Avatar & Ünvan' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(t.id as 'stats' | 'themes' | 'avatar');
            }}
            className={`flex-1 py-2 sm:py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all truncate text-center ${
              activeTab === t.id
                ? 'bg-blue-50 text-blue-600 border-2 border-blue-200 shadow-sm'
                : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            <span className="sm:hidden">{t.label}</span>
            <span className="hidden sm:inline">{t.fullLabel}</span>
          </button>
        ))}
      </div>

      {/* 1. Tab: İstatistikler & Rozetler */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-pop">
          {/* Key Stat Counters */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white rounded-3xl p-4 border-2 border-gray-200 text-center shadow-sm">
              <span className="text-2xl">⚡</span>
              <span className="text-[10px] font-black uppercase text-gray-400 block mt-1">TOPLAM PUAN</span>
              <span className="text-xl font-black text-amber-500">{stats.xp} XP</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border-2 border-gray-200 text-center shadow-sm">
              <span className="text-2xl">🔥</span>
              <span className="text-[10px] font-black uppercase text-gray-400 block mt-1">GÜNLÜK SERİ</span>
              <span className="text-xl font-black text-orange-500">{stats.streak} Gün</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border-2 border-gray-200 text-center shadow-sm">
              <span className="text-2xl">🎯</span>
              <span className="text-[10px] font-black uppercase text-gray-400 block mt-1">ÇÖZÜLEN SORU</span>
              <span className="text-xl font-black text-blue-500">{stats.totalQuestionsAnswered} Soru</span>
            </div>

            <div className="bg-white rounded-3xl p-4 border-2 border-gray-200 text-center shadow-sm">
              <span className="text-2xl">⏱️</span>
              <span className="text-[10px] font-black uppercase text-gray-400 block mt-1">ÇALIŞMA SÜRESİ</span>
              <span className="text-xl font-black text-emerald-500">{stats.totalStudyMinutes} Dk</span>
            </div>
          </div>

          {/* Badges / Rozetler */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-4">
            <h3 className="font-black text-lg text-gray-800 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-500" />
              Kazanılan Başarılar & Rozetler
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {badges.map(badge => (
                <div
                  key={badge.id}
                  className={`p-4 rounded-2xl border-2 text-center transition-all ${
                    badge.unlocked
                      ? 'border-amber-300 bg-amber-50/40 text-gray-800'
                      : 'border-gray-200 bg-gray-50/50 opacity-40 grayscale'
                  }`}
                >
                  <div className="text-4xl mb-2 select-none">{badge.icon}</div>
                  <h5 className="font-black text-xs sm:text-sm">{badge.title}</h5>
                  <p className="text-[11px] text-gray-500 font-semibold mt-1 leading-snug">
                    {badge.description}
                  </p>
                  <div className="mt-2 text-[10px] font-black uppercase">
                    {badge.unlocked ? (
                      <span className="text-green-600">AÇILDI ✅</span>
                    ) : (
                      <span className="text-gray-400">KİLİTLİ 🔒</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. Tab: Temalar & Renkler */}
      {activeTab === 'themes' && (
        <div className="space-y-6 animate-pop">
          {/* App Themes */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-800">Uygulama Teması Seçimi</h3>
              <p className="text-xs text-gray-500 font-medium">
                Platformun genel renk tonunu ve atmosferini değiştirebilirsin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEMES.map(th => {
                const isSelected = stats.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => setTheme(th.id)}
                    className={`p-4 rounded-2xl border-2 flex items-center justify-between text-left transition-all ${
                      isSelected
                        ? 'border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-300'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-xl ${th.bg} border ${th.border}`} />
                      <span className="font-black text-xs sm:text-sm text-gray-800">{th.name}</span>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-blue-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner Colors */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-800">Profil Başlığı (Banner) Rengi</h3>
              <p className="text-xs text-gray-500 font-medium">Profil kartının tepe gradyanını özelleştir.</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {BANNERS.map(b => {
                const isSelected = stats.bannerColor === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      sound.playClick();
                      setBannerColor(b.id);
                    }}
                    className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                      isSelected ? 'border-gray-900 ring-2 ring-gray-400' : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg bg-gradient-to-r ${b.id}`} />
                      <span className="font-bold text-xs text-gray-700">{b.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-gray-900" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 3. Tab: Avatar & Ünvan */}
      {activeTab === 'avatar' && (
        <div className="space-y-6 animate-pop">
          {/* Avatar Selector */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-800">Karakterini / Avatarını Seç</h3>
              <p className="text-xs text-gray-500 font-medium">
                Liderlik tablosunda ve derslerde seni temsil edecek avatar.
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {(Object.keys(AVATAR_MAP) as UserAvatar[]).map(key => {
                const item = AVATAR_MAP[key];
                const isSelected = stats.avatar === key;

                return (
                  <button
                    key={key}
                    onClick={() => setAvatar(key)}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'border-[#58cc02] bg-green-50 shadow-md ring-2 ring-green-300'
                        : 'border-gray-200 hover:border-gray-300 bg-white'
                    }`}
                  >
                    <span className="text-4xl mb-1">{item.emoji}</span>
                    <span className="font-black text-xs text-gray-800">{item.name}</span>
                    {isSelected && (
                      <span className="text-[10px] font-black text-[#58cc02] mt-1">SEÇİLİ ✅</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Title Selector */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-800">Öğrenci Ünvanını Seç</h3>
              <p className="text-xs text-gray-500 font-medium">Hedefine uygun havalı bir lakap edin.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {AVAILABLE_TITLES.map(title => {
                const isSelected = stats.title === title;
                return (
                  <button
                    key={title}
                    onClick={() => {
                      sound.playClick();
                      setTitle(title);
                    }}
                    className={`p-3 rounded-2xl border-2 text-left font-black text-xs sm:text-sm flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#1cb0f6] bg-blue-50 text-[#1cb0f6]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    <span>{title}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#1cb0f6]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
