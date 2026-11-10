import React, { useState } from 'react';
import { useGame, AVATAR_MAP } from '../context/GameContext';
import { AppTheme, UserAvatar, HariboCostume } from '../types';
import { HARIBO_COSTUMES } from '../data/costumesData';
import { 
  Flame, Gem, Trophy, Award, Palette, User, Shield, Check, Sparkles, 
  BookOpen, Clock, Heart, Edit3, Save, LogIn, Mail, ShieldCheck 
} from 'lucide-react';
import { HariboAvatar } from './HariboAvatar';
import { AuthModal } from './AuthModal';
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
  'Efsanevi Kaşif 🚀',
  'Kahoot Şampiyonu 🏆'
];

const BANNERS = [
  { id: 'from-emerald-500 to-green-600', name: 'Zümrüt Yeşili' },
  { id: 'from-blue-600 to-indigo-700', name: 'Gece Mavisi' },
  { id: 'from-purple-600 to-pink-600', name: 'Neon Galaksi' },
  { id: 'from-amber-500 to-orange-600', name: 'Güneş Patlaması' },
  { id: 'from-gray-800 to-slate-950', name: 'Mat Siyah' }
];

export const Profile: React.FC = () => {
  const { 
    stats, setTheme, setAvatar, setTitle, setBannerColor, 
    userLevel, levelProgress, updateUsername, selectCostume 
  } = useGame();
  
  const [activeTab, setActiveTab] = useState<'stats' | 'themes' | 'avatar' | 'account'>('stats');
  const [isEditingName, setIsEditingName] = useState(false);
  const [tempName, setTempName] = useState(stats.username || 'Ali');
  const [nameNotice, setNameNotice] = useState<string | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const currentAvatarInfo = AVATAR_MAP[stats.avatar] || AVATAR_MAP['haribo'];

  const handleSaveName = () => {
    const res = updateUsername(tempName);
    if (res.success) {
      setIsEditingName(false);
      setNameNotice(res.finalUsername !== tempName ? `"${tempName}" adı doluydu, yeni adın "${res.finalUsername}" yapıldı! ✨` : 'Adın kaydedildi!');
      setTimeout(() => setNameNotice(null), 3500);
    } else {
      setNameNotice(res.error || 'Hata oluştu');
    }
  };

  const badges = [
    {
      id: 'streak-3',
      name: 'Ateş Başlatan',
      desc: '3 gün üst üste ders tamamla',
      icon: '🔥',
      unlocked: stats.streak >= 3
    },
    {
      id: 'streak-7',
      name: 'Haftalık Seri',
      desc: '7 gün kesintisiz çalışma',
      icon: '⚡',
      unlocked: stats.streak >= 7
    },
    {
      id: 'xp-100',
      name: 'İlk Yüzlük',
      desc: '100 XP barajını aş',
      icon: '🎯',
      unlocked: stats.xp >= 100
    },
    {
      id: 'xp-500',
      name: 'Altın Öğrenci',
      desc: '500 XP topla ve ligde yüksel',
      icon: '🏆',
      unlocked: stats.xp >= 500
    },
    {
      id: 'duel-master',
      name: 'Düello Fatihi',
      desc: '1v1 Bilgi Düellosunda 3 zafer kazan',
      icon: '⚔️',
      unlocked: stats.duelWins >= 3
    },
    {
      id: 'speed-runner',
      name: 'Hız Canavarı',
      desc: '5 dersi hatasız tamamla',
      icon: '🚀',
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
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-white/20 backdrop-blur-md border-4 border-white/40 flex items-center justify-center text-6xl shadow-inner select-none p-2 animate-bounceSubtle">
              {stats.avatar === 'haribo' ? (
                <HariboAvatar size="xl" costume={stats.selectedCostume} animate="dance" />
              ) : (
                currentAvatarInfo.emoji
              )}
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
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Elmas Ligi Öğrencisi</span>
              {stats.isLoggedIn && (
                <span className="bg-green-500 text-white text-[10px] px-1.5 py-0.2 rounded font-mono">
                  {stats.authProvider === 'google' ? 'Google Doğrulandı' : 'Giriş Yapıldı'}
                </span>
              )}
            </div>

            {/* Editable Name Bar */}
            {isEditingName ? (
              <div className="flex items-center gap-2 max-w-xs mt-1">
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  className="bg-white/20 border-2 border-white/50 text-white font-black text-lg px-3 py-1 rounded-xl outline-none focus:border-white w-full"
                />
                <button
                  onClick={handleSaveName}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-xl font-black text-xs transition-all"
                >
                  <Save className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-black">{stats.username || 'Sen'}</h2>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-md font-mono opacity-80">
                  {stats.uniqueTag}
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setIsEditingName(true);
                  }}
                  className="p-1 hover:bg-white/20 rounded-lg transition-all"
                  title="Kullanıcı Adını Değiştir"
                >
                  <Edit3 className="w-4 h-4 opacity-75 hover:opacity-100" />
                </button>
              </div>
            )}

            {nameNotice && (
              <p className="text-xs font-black text-amber-200 mt-1 animate-pop">
                {nameNotice}
              </p>
            )}

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

          {/* Quick Account Auth Button on Banner */}
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                setShowAuthModal(true);
              }}
              className="bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/30 px-3.5 py-2 rounded-2xl text-xs font-black text-white flex items-center gap-1.5 transition-all active:scale-95 shadow-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{stats.isLoggedIn ? 'Hesap Detayları' : 'Google / E-posta Bağla'}</span>
            </button>
          </div>

        </div>

        {/* Subtle Background Circles */}
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Sub Tabs: İstatistikler, Temalar & Renkler, Avatar & Kostüm, Hesap & Google */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-[#1a2c35] border-2 border-gray-200 dark:border-[#2b3d45] rounded-2xl shadow-sm transition-colors duration-300">
        {[
          { id: 'stats', label: '📊 İstatistik', fullLabel: '📊 İstatistikler & Rozetler' },
          { id: 'avatar', label: '🐻 Kostüm & Avatar', fullLabel: '🐻 Kostüm & Avatar' },
          { id: 'themes', label: '🎨 Temalar', fullLabel: '🎨 Tema & Arka Plan' },
          { id: 'account', label: '🔐 Hesap', fullLabel: '🔐 Hesap & Google' }
        ].map(t => (
          <button
            key={t.id}
            onClick={() => {
              sound.playClick();
              setActiveTab(t.id as any);
            }}
            className={`flex-1 py-2 sm:py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all text-center ${
              activeTab === t.id
                ? 'bg-blue-50 dark:bg-blue-950/40 text-[#1cb0f6] shadow-sm border-2 border-[#1cb0f6]'
                : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200 border-2 border-transparent'
            }`}
          >
            <span className="hidden sm:inline">{t.fullLabel}</span>
            <span className="sm:hidden">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ================= TAB 1: İSTATİSTİKLER & ROZETLER ================= */}
      {activeTab === 'stats' && (
        <div className="space-y-6 animate-fade">
          {/* Quick Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-[#1a2c35] p-4 rounded-3xl border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200 flex items-center justify-center text-2xl">
                🔥
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100">{stats.streak} Gün</div>
                <div className="text-[10px] font-black uppercase text-gray-400">Çalışma Serisi</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2c35] p-4 rounded-3xl border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 flex items-center justify-center text-2xl">
                ⚡
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100">{stats.xp}</div>
                <div className="text-[10px] font-black uppercase text-gray-400">Toplam XP</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2c35] p-4 rounded-3xl border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100">{stats.gems}</div>
                <div className="text-[10px] font-black uppercase text-gray-400">Elmas Bakiyesi</div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1a2c35] p-4 rounded-3xl border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 flex items-center justify-center text-2xl">
                ⚔️
              </div>
              <div>
                <div className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100">{stats.eloRating}</div>
                <div className="text-[10px] font-black uppercase text-gray-400">Düello ELO</div>
              </div>
            </div>
          </div>

          {/* Badges Collection */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
            <h3 className="font-black text-lg text-gray-800 dark:text-gray-100">Başarı Rozetleri</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {badges.map(b => (
                <div
                  key={b.id}
                  className={`p-4 rounded-2xl border-2 flex items-center gap-3.5 transition-all ${
                    b.unlocked
                      ? 'border-amber-300 dark:border-amber-700 bg-amber-50/50 dark:bg-amber-950/20 shadow-sm'
                      : 'border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-[#202f36] opacity-60'
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${
                    b.unlocked ? 'bg-amber-100 dark:bg-amber-900/40' : 'bg-gray-200 dark:bg-gray-700'
                  }`}>
                    {b.icon}
                  </div>
                  <div>
                    <div className="font-black text-xs sm:text-sm text-gray-800 dark:text-gray-100 flex items-center gap-1.5">
                      <span>{b.name}</span>
                      {b.unlocked && <span className="text-[10px] text-amber-600 font-bold">✓</span>}
                    </div>
                    <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium leading-snug">
                      {b.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: HARİBO KOSTÜM & AVATAR ================= */}
      {activeTab === 'avatar' && (
        <div className="space-y-6 animate-fade">
          
          {/* Haribo Costume Wardrobe Section */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-800 dark:text-gray-100">
                Haribo Ayıcık Kostüm Dolabın
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Sahip olduğun özel kostümlerden birini seç, Kahoot ve düellolarda bu kostümle dans et!
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {HARIBO_COSTUMES.map(costume => {
                const isUnlocked = stats.unlockedCostumes.includes(costume.id);
                const isSelected = stats.selectedCostume === costume.id;

                return (
                  <button
                    key={costume.id}
                    disabled={!isUnlocked}
                    onClick={() => {
                      if (isUnlocked) selectCostume(costume.id);
                    }}
                    className={`p-4 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                      isSelected
                        ? 'border-[#58cc02] bg-green-50 dark:bg-green-950/40 shadow-md ring-2 ring-green-300 dark:ring-green-700'
                        : isUnlocked
                        ? 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 bg-white dark:bg-[#202f36]'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-gray-800/40 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className="p-1 mb-1">
                      <HariboAvatar size="lg" costume={costume.id} animate={isSelected ? 'dance' : false} />
                    </div>
                    <span className="font-black text-xs text-gray-800 dark:text-gray-100">{costume.name}</span>
                    <span className="text-[10px] text-gray-400 mt-0.5">{costume.title}</span>

                    {isSelected ? (
                      <span className="text-[10px] font-black text-[#58cc02] mt-1.5">KUŞANILDI ✅</span>
                    ) : isUnlocked ? (
                      <span className="text-[10px] font-black text-[#1cb0f6] mt-1.5">SEÇMEK İÇİN TIKLA</span>
                    ) : (
                      <span className="text-[10px] font-bold text-gray-400 mt-1.5">🔒 Mağazadan Aç</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Student Title Selector */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-800 dark:text-gray-100">Öğrenci Ünvanını Seç</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Hedefine uygun havalı bir unvan belirle.</p>
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
                        ? 'border-[#1cb0f6] bg-blue-50 dark:bg-blue-950/40 text-[#1cb0f6]'
                        : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#202f36]'
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

      {/* ================= TAB 3: TEMALAR & ARKA PLAN ================= */}
      {activeTab === 'themes' && (
        <div className="space-y-6 animate-fade">
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-800 dark:text-gray-100">Uygulama Teması Seçimi</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Platformun genel renk tonunu ve atmosferini değiştirebilirsin.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {THEMES.map(theme => {
                const isSelected = stats.theme === theme.id;
                return (
                  <button
                    key={theme.id}
                    onClick={() => {
                      sound.playClick();
                      setTheme(theme.id);
                    }}
                    className={`p-4 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#1cb0f6] bg-blue-50 dark:bg-blue-950/40 shadow-md'
                        : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 bg-white dark:bg-[#202f36]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full ${theme.bg} border-2 border-white/50 shadow-sm`} />
                      <span className="font-black text-xs sm:text-sm text-gray-800 dark:text-gray-100">{theme.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#1cb0f6]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Banner Selector */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
            <div>
              <h3 className="font-black text-lg text-gray-800 dark:text-gray-100">Profil Başlığı (Banner) Rengi</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Profil kartının tepe gradyanını özelleştir.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {BANNERS.map(b => {
                const isSelected = stats.bannerColor === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => {
                      sound.playClick();
                      setBannerColor(b.id);
                    }}
                    className={`p-3.5 rounded-2xl border-2 text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-[#1cb0f6] bg-blue-50 dark:bg-blue-950/40 shadow-sm'
                        : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 bg-white dark:bg-[#202f36]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-5 h-5 rounded-lg bg-gradient-to-r ${b.id} shadow-sm`} />
                      <span className="font-bold text-xs text-gray-700 dark:text-gray-200">{b.name}</span>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-[#1cb0f6]" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 4: HESAP & GOOGLE ================= */}
      {activeTab === 'account' && (
        <div className="space-y-6 animate-fade">
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-5">
            <div>
              <h3 className="font-black text-lg text-gray-800 dark:text-gray-100">
                Hesap & Bulut Senkronizasyonu
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Puanlarını, lig dereceni ve kazandığın Haribo kostümlerini kalıcı olarak koru.
              </p>
            </div>

            {stats.isLoggedIn ? (
              <div className="bg-green-50 dark:bg-green-950/40 border-2 border-green-200 dark:border-green-800 rounded-2xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-green-500 text-white flex items-center justify-center font-black text-xl">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-black text-base text-green-900 dark:text-green-100">{stats.username}</h4>
                    <p className="text-xs text-green-700 dark:text-green-300 font-mono">{stats.email}</p>
                    <span className="text-[10px] bg-green-600 text-white font-black px-2 py-0.5 rounded-full mt-1 inline-block">
                      {stats.authProvider === 'google' ? 'Google Doğrulanmış Hesap' : 'E-posta Onaylı Hesap'}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-green-800 dark:text-green-300 font-medium pt-2 border-t border-green-200 dark:border-green-800">
                  Tüm cihazlarından aynı e-posta ile giriş yaparak kaldığın yerden devam edebilirsin.
                </p>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👤</span>
                  <div>
                    <h4 className="font-black text-sm text-amber-900 dark:text-amber-100">Misafir Modundasın</h4>
                    <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold">
                      Ders ve Kahoot çözebilirsin fakat tarayıcı çerezleri silinirse puanların kaybolabilir.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAuthModal(true)}
                  className="w-full py-3 bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-sm rounded-xl border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Google veya E-posta ile Hesabı Bağla</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal Trigger */}
      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} />
      )}

    </div>
  );
};
