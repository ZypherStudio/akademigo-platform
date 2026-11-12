import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { KNOWZA_COSTUMES } from '../data/costumesData';
import { AVATAR_FRAMES, getFrame } from '../data/framesData';
import { KnowzaCostume, AvatarFrameId, CustomBearConfig, AvatarFrameInfo } from '../types';
import { KnowzaAvatar, getBearConfigFromCostume } from './KnowzaAvatar';
import {
  ShoppingBag,
  Sparkles,
  Check,
  Lock,
  Zap,
  Heart,
  Crown,
  Tv,
  Coins,
  ShieldCheck,
  Flame,
  ArrowRight,
  Frame,
  Bot,
  Package,
  X,
  Palette
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

type ShopTab = 'pro' | 'bear_studio' | 'frames' | 'costumes' | 'boosters' | 'ads';

export const Shop: React.FC = () => {
  const {
    stats,
    buyShopItem,
    buyCostume,
    selectCostume,
    addXpAndGems,
    upgradeToPro,
    equipFrame,
    buyFrameWithGems,
    updateCustomBear
  } = useGame();

  const [activeTab, setActiveTab] = useState<ShopTab>('pro');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [watchingAd, setWatchingAd] = useState<{ active: boolean; secondsLeft: number; rewardType: 'gems' | 'heart' } | null>(null);

  // Discord-style frame preview modal state
  const [previewFrame, setPreviewFrame] = useState<AvatarFrameInfo | null>(null);

  // Bear Studio state
  const defaultBear = getBearConfigFromCostume(stats.selectedCostume, stats.customBear);
  const [bearDraft, setBearDraft] = useState<CustomBearConfig>(defaultBear);
  const [bearStudioTab, setBearStudioTab] = useState<'fur' | 'headwear' | 'eyewear' | 'outfit' | 'heldItem'>('fur');

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  // Rewarded Ad Simulation
  const handleWatchAd = (rewardType: 'gems' | 'heart') => {
    sound.playClick();
    setWatchingAd({ active: true, secondsLeft: 5, rewardType });

    const interval = setInterval(() => {
      setWatchingAd((prev) => {
        if (!prev) return null;
        if (prev.secondsLeft <= 1) {
          clearInterval(interval);
          if (rewardType === 'gems') {
            addXpAndGems(0, 50);
            showToast('🎉 Tebrikler! Reklam izleyerek +50 Elmas kazandın!');
          } else {
            buyShopItem('refill');
            showToast('❤️ Canların reklam izlediğin için tamamen dolduruldu!');
          }
          sound.playVictory();
          confetti({ particleCount: 80, spread: 60 });
          return null;
        }
        return { ...prev, secondsLeft: prev.secondsLeft - 1 };
      });
    }, 1000);
  };

  const handleBuyBooster = (item: 'refill' | 'freeze' | 'double', cost: number) => {
    if (stats.gems < cost) {
      showToast('❌ Yeterli elmasın yok! Reklam izleyerek veya test çözerek elmas kazanabilirsin.');
      return;
    }
    const success = buyShopItem(item);
    if (success) {
      showToast('🎉 Güçlendirici başarıyla satın alındı!');
    } else {
      showToast('⚠️ Canların zaten dolu veya işlem gerçekleştirilemedi.');
    }
  };

  const handleCostumeAction = (costume: typeof KNOWZA_COSTUMES[0]) => {
    const isUnlocked = stats.isFounder || stats.unlockedCostumes.includes(costume.id);

    if (isUnlocked) {
      selectCostume(costume.id);
      showToast(`✨ "${costume.name}" kostümü kuşandı!`);
      return;
    }

    if (stats.currentLevel < Math.ceil(costume.requiredXp / 100)) {
      showToast(`🔒 Bu kostüm için Seviye ${Math.ceil(costume.requiredXp / 100)} gereklidir!`);
      return;
    }

    if (stats.gems < costume.priceGems) {
      showToast(`❌ Yetersiz elmas! Bu kostüm için ${costume.priceGems} Elmas gerekli.`);
      return;
    }

    const success = buyCostume(costume.id);
    if (success) {
      showToast(`👑 Tebrikler! "${costume.name}" başarıyla açıldı ve kuşandı!`);
    }
  };

  const handleSaveBearStudio = () => {
    updateCustomBear(bearDraft);
    sound.playVictory();
    confetti({ particleCount: 70, spread: 60 });
    showToast('✨ Özel Ayıcık Modelin başarıyla kaydedildi ve kuşandı!');
  };

  return (
    <div className="flex-1 w-full max-w-md mx-auto px-4 py-4 space-y-4 pb-36 select-none animate-fade">
      {/* Toast Notification */}
      {feedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#2A1E00] text-amber-300 font-black text-xs px-4 py-2.5 rounded-full shadow-2xl border border-amber-400/50 animate-bounceSubtle flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>{feedback}</span>
        </div>
      )}

      {/* ================= FOUNDER BANNER (If Founder Account) ================= */}
      {stats.isFounder && (
        <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-3xl p-4 text-slate-950 font-black shadow-lg border-2 border-amber-200 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase tracking-wider bg-slate-950 text-amber-300 px-2 py-0.5 rounded-full font-black">
              KURUCU STATÜSÜ
            </span>
            <h3 className="text-sm font-black">👑 Kurucu Mimar & VIP Hesabı</h3>
            <p className="text-[11px] font-bold text-slate-900 leading-snug">
              Tüm PRO avantajlar, Discord çerçeveleri ve ayıcık kostümleri hesabınıza ömür boyu sınırsız tanımlanmıştır!
            </p>
          </div>
          <span className="text-3xl">✨</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 rounded-3xl p-4 text-slate-950 shadow-md text-center relative overflow-hidden border-2 border-amber-300">
        <div className="flex items-center justify-center gap-2 mb-1">
          <ShoppingBag className="w-5 h-5 text-slate-950" />
          <h2 className="text-lg font-black tracking-tight">Knowza VIP Mağaza</h2>
        </div>
        <p className="text-xs font-bold text-slate-900">
          Özel Discord çerçeveleri, ayıcık modelleri ve VIP avantajlar!
        </p>

        {/* Current Balance Bar */}
        <div className="mt-3 flex items-center justify-center gap-4 bg-black/20 py-1.5 px-4 rounded-2xl backdrop-blur-xs">
          <div className="flex items-center gap-1 text-xs font-extrabold text-amber-200">
            <span>💎</span>
            <span>{stats.gems} Elmas</span>
          </div>
          <div className="w-1 h-3 bg-white/20 rounded-full" />
          <div className="flex items-center gap-1 text-xs font-extrabold text-rose-200">
            <span>❤️</span>
            <span>{stats.isPro ? 'Sınırsız Can' : `${stats.hearts}/${stats.maxHearts} Can`}</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="grid grid-cols-6 gap-1 bg-white p-1 rounded-2xl border border-amber-100 shadow-xs">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('pro');
          }}
          className={`py-2 rounded-xl text-[10px] font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'pro'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>Paketler</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('bear_studio');
          }}
          className={`py-2 rounded-xl text-[10px] font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'bear_studio'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-orange-600" />
          <span>Ayıcık</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('frames');
          }}
          className={`py-2 rounded-xl text-[10px] font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'frames'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Frame className="w-3.5 h-3.5 text-purple-600" />
          <span>Çerçeveler</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('costumes');
          }}
          className={`py-2 rounded-xl text-[10px] font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'costumes'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Kostüm</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('boosters');
          }}
          className={`py-2 rounded-xl text-[10px] font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'boosters'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Zap className="w-3.5 h-3.5 text-blue-600" />
          <span>İksirler</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('ads');
          }}
          className={`py-2 rounded-xl text-[10px] font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'ads'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Tv className="w-3.5 h-3.5 text-emerald-600" />
          <span>Reklam</span>
        </button>
      </div>

      {/* ================= TAB 1: VIP PRO & MONETIZATION PAKETLERİ ================= */}
      {activeTab === 'pro' && (
        <div className="space-y-4 animate-fade">
          {/* Main PRO VIP Pass Card */}
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-amber-400/40 relative overflow-hidden">
            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 bg-[#FFB800] text-slate-950 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
                <Crown className="w-4 h-4" />
                Knowza PRO Pass
              </div>
              {(stats.isPro || stats.isFounder) && (
                <span className="text-xs font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                  AKTİF VIP 🎉
                </span>
              )}
            </div>

            <h3 className="text-xl font-black mb-1">Sınavlara VIP Ayrıcalığıyla Hazırlan!</h3>
            <p className="text-xs text-white/70 mb-4">
              Can kısıtlaması olmadan sınırsız test çöz, reklamsız çalış ve AI koçun tüm gücünü aç.
            </p>

            <div className="space-y-2 mb-5">
              {[
                '❤️ Sınırsız Can (Hiçbir zaman bekleme yapma)',
                '🚫 %100 Reklamsız Kesintisiz Deneyim',
                '⚡ 2 Kat Sabit XP & Liderlik Çarpanı',
                '👑 Özel 3D Altın Taçlı Kral Maskot Kostümü',
                '🤖 Sesli AI Koç ile Sınırsız Soru-Cevap',
                '📊 C1/C2 Uzmanlık & ÖSYM Net Analiz Raporları'
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-amber-100">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {!stats.isPro && !stats.isFounder ? (
              <button
                onClick={() => {
                  upgradeToPro();
                  showToast('👑 Tebrikler! Knowza PRO başarıyla aktif edildi!');
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 active:scale-95 transition flex items-center justify-center gap-2 hover:scale-102"
              >
                <span>Knowza PRO'ya Yükselt (₺79.99 / Ay)</span>
                <ArrowRight className="w-4 h-4 stroke-[3]" />
              </button>
            ) : (
              <div className="w-full py-3 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 font-extrabold text-xs text-center">
                ✨ Tüm PRO ayrıcalıklarından sınırsız faydalanıyorsunuz!
              </div>
            )}
          </div>

          {/* Sub Packages List (Ad-Free Lite, AI Koç, Discord Bundles) */}
          <div className="space-y-3 pt-1">
            <h4 className="text-xs font-black uppercase text-slate-500 tracking-wider px-1">
              Diğer Özel Paketler
            </h4>

            {/* Package 1: Ad-Free Lite */}
            <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-2xl">
                  🚫
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">Sadece Reklam Kaldır</h4>
                  <p className="text-[11px] text-slate-500 font-bold">Tek seferlik ömür boyu reklamsız</p>
                  <span className="text-xs font-black text-amber-600">₺29.99 (Tek Seferlik)</span>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playVictory();
                  confetti({ particleCount: 50, spread: 60 });
                  showToast('🎉 Reklamlar kalıcı olarak kaldırıldı!');
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-black text-amber-300 font-black text-xs rounded-xl shadow-xs active:scale-95 transition whitespace-nowrap"
              >
                {stats.isFounder ? 'Sahipsin' : 'Satın Al'}
              </button>
            </div>

            {/* Package 2: Gemini AI Koç */}
            <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-2xl">
                  🤖
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">Gemini AI Koç Paketi</h4>
                  <p className="text-[11px] text-slate-500 font-bold">7/24 Sesli & Yazılı Soru Çözücü</p>
                  <span className="text-xs font-black text-indigo-600">₺49.99 / Ay</span>
                </div>
              </div>
              <button
                onClick={() => {
                  sound.playVictory();
                  showToast('🤖 AI Koç paketi hesabınıza bağlandı!');
                }}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs rounded-xl shadow-xs active:scale-95 transition whitespace-nowrap"
              >
                {stats.isFounder ? 'Sahipsin' : 'Satın Al'}
              </button>
            </div>

            {/* Package 3: Discord Ay Kurdu (Hilal Rüyaları) */}
            <div className="bg-gradient-to-r from-purple-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-4 border border-purple-500/40 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-400/40 flex items-center justify-center text-2xl">
                  🌙
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm text-white">Ay Kurdu Paketi</h4>
                    <span className="text-[9px] font-black bg-purple-400/20 text-purple-300 px-1.5 rounded">Discord</span>
                  </div>
                  <p className="text-[10px] text-purple-200/80 font-medium">
                    Hilal Rüyaları animasyonlu çerçeve + Gece kürkü + 1000 💎
                  </p>
                  <span className="text-xs font-black text-amber-300">₺59.99</span>
                </div>
              </div>
              <button
                onClick={() => {
                  equipFrame('moon_reverie');
                  sound.playVictory();
                  confetti({ particleCount: 70, spread: 70 });
                  showToast('🌙 Ay Kurdu Paketi açıldı ve Hilal Rüyaları kuşandı!');
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-black text-xs rounded-xl shadow-xs active:scale-95 transition whitespace-nowrap"
              >
                {stats.isFounder ? 'Kuşan' : 'Paketi Al'}
              </button>
            </div>

            {/* Package 4: Discord Deadpool Siber Savaşçı */}
            <div className="bg-gradient-to-r from-rose-950 via-slate-900 to-zinc-900 text-white rounded-3xl p-4 border border-red-500/40 shadow-sm flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-400/40 flex items-center justify-center text-2xl">
                  ❤️‍🔥
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h4 className="font-black text-sm text-white">Siber Savaşçı & Kalpler</h4>
                    <span className="text-[9px] font-black bg-red-400/20 text-red-300 px-1.5 rounded">Discord</span>
                  </div>
                  <p className="text-[10px] text-rose-200/80 font-medium">
                    Uçuşan Kalpler animasyonlu çerçeve + Siber kürk + 1000 💎
                  </p>
                  <span className="text-xs font-black text-amber-300">₺59.99</span>
                </div>
              </div>
              <button
                onClick={() => {
                  equipFrame('deadpool_hearts');
                  sound.playVictory();
                  confetti({ particleCount: 70, spread: 70 });
                  showToast('❤️‍🔥 Siber Savaşçı ve Uçuşan Kalpler kuşandı!');
                }}
                className="px-3.5 py-2 bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-xs rounded-xl shadow-xs active:scale-95 transition whitespace-nowrap"
              >
                {stats.isFounder ? 'Kuşan' : 'Paketi Al'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: ÖZEL AYICIK STÜDYOSU (GARDROP) ================= */}
      {activeTab === 'bear_studio' && (
        <div className="space-y-4 animate-fade">
          {/* Live 3D Bear Preview Stage */}
          <div className="bg-gradient-to-b from-[#FFFDF7] via-[#FFF8E7] to-[#FFEABF] rounded-3xl p-5 border-2 border-amber-300 shadow-md flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute top-2 left-3 inline-flex items-center gap-1 bg-[#2A1E00] text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full uppercase">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Canlı Ayıcık Modeli</span>
            </div>

            {/* Glowing Golden Pedestal */}
            <div className="w-32 h-32 relative flex items-center justify-center mt-2 filter drop-shadow-[0_8px_16px_rgba(245,158,11,0.35)] animate-bounceSubtle">
              <KnowzaAvatar
                size="2xl"
                customBear={bearDraft}
                frameId={stats.equippedAvatarFrame ?? 'none'}
                showFrameGlow={true}
              />
            </div>

            <div className="text-center mt-2">
              <h3 className="text-base font-black text-slate-900">
                {stats.username || 'Knowza Savaşçısı'}
              </h3>
              <p className="text-[11px] font-bold text-amber-800">
                Kürk, şapka, gözlük ve kıyafetleri dilediğin gibi eşleştir!
              </p>
            </div>

            {/* Save / Equip Button */}
            <button
              onClick={handleSaveBearStudio}
              className="mt-3 w-full py-3 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] text-slate-950 font-black text-xs rounded-2xl shadow-md border-b-3 border-[#D99000] active:border-b-0 active:translate-y-0.5 transition flex items-center justify-center gap-1.5 hover:scale-102"
            >
              <Check className="w-4 h-4 stroke-[3]" />
              <span>Ayıcık Modelini Kaydet & Kuşan</span>
            </button>
          </div>

          {/* Customization Sub-Tabs */}
          <div className="flex items-center gap-1 bg-white p-1 rounded-2xl border border-amber-200/80 shadow-xs overflow-x-auto scrollbar-none">
            {[
              { id: 'fur', label: '🎨 Kürk', icon: '🐻' },
              { id: 'headwear', label: '🎩 Şapka', icon: '🎓' },
              { id: 'eyewear', label: '👓 Gözlük', icon: '🕶️' },
              { id: 'outfit', label: '👔 Kıyafet', icon: '🧥' },
              { id: 'heldItem', label: '🪄 Aksesuar', icon: '📖' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  sound.playClick();
                  setBearStudioTab(tab.id as any);
                }}
                className={`flex-1 py-1.5 px-2.5 rounded-xl text-xs font-black whitespace-nowrap transition-all ${
                  bearStudioTab === tab.id
                    ? 'bg-[#2A1E00] text-amber-300 shadow-xs'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Items Grid for Current Tab */}
          <div className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs space-y-3">
            {/* Fur Color Options */}
            {bearStudioTab === 'fur' && (
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'bal_sarisi', name: 'Bal Sarısı (Klasik)', color: 'bg-amber-400' },
                  { id: 'kar_beyazi', name: 'Kutup Beyazı', color: 'bg-slate-100 border' },
                  { id: 'cikolata', name: 'Çikolata Kahve', color: 'bg-amber-900 text-white' },
                  { id: 'gece_siyahi', name: 'Gece Siyahı', color: 'bg-zinc-900 text-white' },
                  { id: 'pembe_seker', name: 'Pamuk Şeker', color: 'bg-pink-400 text-white' },
                  { id: 'siber_neon', name: 'Siber Camgöbeği', color: 'bg-cyan-500 text-white' },
                  { id: 'kraliyet_altini', name: 'Kraliyet Altını ✨', color: 'bg-yellow-400 font-black' },
                ].map((f) => {
                  const isSelected = bearDraft.furColor === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => {
                        sound.playClick();
                        setBearDraft((prev) => ({ ...prev, furColor: f.id as any }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]/40 shadow-xs'
                          : 'border-slate-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full shadow-inner ${f.color}`} />
                        <span className="text-xs font-black text-slate-900">{f.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[3]" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Headwear Options */}
            {bearStudioTab === 'headwear' && (
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'none', name: 'Şapkasız (Doğal)', icon: '🐻' },
                  { id: 'graduate_cap', name: 'Mezuniyet Kepi', icon: '🎓' },
                  { id: 'royal_crown', name: 'Kraliyet Tacı', icon: '👑' },
                  { id: 'cyber_visor', name: 'Siber Kask & Kulaklık', icon: '🤖' },
                  { id: 'party_hat', name: 'Dansçı Parti Şapkası', icon: '🎉' },
                  { id: 'astronaut_helmet', name: 'Kozmik Astronot', icon: '👨‍🚀' },
                  { id: 'wizard_hat', name: 'Sihirbaz Kukuletası', icon: '🧙' },
                  { id: 'beanie', name: 'Kışlık Ponpon Bere', icon: '❄️' },
                ].map((h) => {
                  const isSelected = bearDraft.headwear === h.id;
                  return (
                    <button
                      key={h.id}
                      onClick={() => {
                        sound.playClick();
                        setBearDraft((prev) => ({ ...prev, headwear: h.id as any }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]/40 shadow-xs'
                          : 'border-slate-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">{h.icon}</span>
                        <span className="text-xs font-black text-slate-900 truncate">{h.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[3] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Eyewear Options */}
            {bearStudioTab === 'eyewear' && (
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'none', name: 'Gözlüksüz', icon: '👀' },
                  { id: 'sunshades', name: 'VIP Güneş Gözlüğü', icon: '🕶️' },
                  { id: 'professor', name: 'Profesör Gözlüğü', icon: '🧐' },
                  { id: 'neon_visor', name: 'Siber LED Vizör', icon: '⚡' },
                  { id: 'star_glasses', name: 'Altın Yıldız Gözlük', icon: '⭐' },
                ].map((e) => {
                  const isSelected = bearDraft.eyewear === e.id;
                  return (
                    <button
                      key={e.id}
                      onClick={() => {
                        sound.playClick();
                        setBearDraft((prev) => ({ ...prev, eyewear: e.id as any }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]/40 shadow-xs'
                          : 'border-slate-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">{e.icon}</span>
                        <span className="text-xs font-black text-slate-900 truncate">{e.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[3] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Outfit Options */}
            {bearStudioTab === 'outfit' && (
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'hoodie', name: '"K" Kapüşonlu (Klasik)', icon: '🧥' },
                  { id: 'royal_cape', name: 'Kraliyet Kadife Pelerini', icon: '👑' },
                  { id: 'cyber_suit', name: 'Siber Zırh & LED', icon: '🤖' },
                  { id: 'graduate_robe', name: 'Mezuniyet Cübbesi', icon: '🎓' },
                  { id: 'space_suit', name: 'Kozmik Uzay Tulumu', icon: '🚀' },
                  { id: 'tuxedo', name: 'Papyonlu Smokin', icon: '🤵' },
                ].map((o) => {
                  const isSelected = bearDraft.outfit === o.id;
                  return (
                    <button
                      key={o.id}
                      onClick={() => {
                        sound.playClick();
                        setBearDraft((prev) => ({ ...prev, outfit: o.id as any }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]/40 shadow-xs'
                          : 'border-slate-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">{o.icon}</span>
                        <span className="text-xs font-black text-slate-900 truncate">{o.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[3] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Held Item Options */}
            {bearStudioTab === 'heldItem' && (
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: 'book', name: 'Mor "K" Bilgi Kitabı', icon: '📖' },
                  { id: 'trophy', name: 'Şampiyonluk Kupası', icon: '🏆' },
                  { id: 'diploma', name: 'Mezuniyet Diploması', icon: '📜' },
                  { id: 'torch', name: 'Şampiyon Meşalesi', icon: '🔥' },
                  { id: 'wand', name: 'Sihirli Yıldız Asa', icon: '🪄' },
                ].map((item) => {
                  const isSelected = bearDraft.heldItem === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sound.playClick();
                        setBearDraft((prev) => ({ ...prev, heldItem: item.id as any }));
                      }}
                      className={`p-3 rounded-2xl border-2 text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'border-[#FFB800] bg-amber-50 ring-2 ring-[#FFB800]/40 shadow-xs'
                          : 'border-slate-200 hover:border-amber-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-lg">{item.icon}</span>
                        <span className="text-xs font-black text-slate-900 truncate">{item.name}</span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-amber-600 stroke-[3] flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ================= TAB 3: DİSCORD TARZI ANİMASYONLU ÇERÇEVELER ================= */}
      {activeTab === 'frames' && (
        <div className="space-y-4 animate-fade">
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200/80 rounded-2xl p-3 text-xs font-bold text-purple-950 flex items-center justify-between">
            <span>✨ Tıklayarak Discord tarzı canlı animasyon önizlemesini açabilirsin!</span>
            <span className="text-base">🌙</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {AVATAR_FRAMES.map((frame) => {
              const unlockedFrames = stats.unlockedAvatarFrames ?? ['none', 'gold_flame'];
              const isOwned = stats.isFounder || unlockedFrames.includes(frame.id as AvatarFrameId);
              const isEquipped = (stats.equippedAvatarFrame ?? 'none') === frame.id;

              return (
                <div
                  key={frame.id}
                  onClick={() => {
                    sound.playClick();
                    setPreviewFrame(frame);
                  }}
                  className={`relative rounded-3xl border-2 bg-white p-3.5 flex flex-col items-center gap-2 cursor-pointer transition-all hover:scale-102 active:scale-98 ${
                    isEquipped ? 'border-[#FFB800] shadow-md ring-2 ring-[#FFB800]/30' : 'border-slate-200 hover:border-amber-300'
                  }`}
                >
                  {isEquipped && (
                    <div className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[9px] font-black rounded-full px-2 py-0.5 z-10 shadow-xs">
                      ✓ Aktif
                    </div>
                  )}

                  <div className="w-16 h-16 relative flex items-center justify-center my-1">
                    <KnowzaAvatar
                      size="lg"
                      frameId={frame.id as AvatarFrameId}
                      showFrameGlow={true}
                    />
                  </div>

                  <div className="text-center w-full">
                    <h5 className="text-xs font-black text-slate-900 truncate">
                      {frame.badge} {frame.name}
                    </h5>
                    <span className="text-[10px] font-bold text-amber-700 block">
                      {frame.rarityLabel}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isOwned) {
                        equipFrame(frame.id as AvatarFrameId);
                        showToast(`✨ "${frame.name}" çerçevesi kuşandı!`);
                      } else {
                        setPreviewFrame(frame);
                      }
                    }}
                    className={`w-full py-1.5 rounded-xl font-black text-xs transition ${
                      isEquipped
                        ? 'bg-emerald-100 text-emerald-800'
                        : isOwned
                        ? 'bg-[#FFB800] text-slate-950 hover:bg-amber-400'
                        : 'bg-slate-900 text-white hover:bg-black'
                    }`}
                  >
                    {isEquipped ? 'Kuşanıldı' : isOwned ? 'Kuşan' : `${frame.priceGems} 💎`}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= TAB 4: HAZIR KOSTÜMLER ================= */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-2 gap-3 animate-fade">
          {KNOWZA_COSTUMES.map((costume) => {
            const isUnlocked = stats.isFounder || stats.unlockedCostumes.includes(costume.id);
            const isSelected = stats.selectedCostume === costume.id;

            return (
              <div
                key={costume.id}
                className={`bg-white rounded-3xl p-3.5 border-2 flex flex-col items-center justify-between text-center gap-2 shadow-sm ${
                  isSelected ? 'border-[#FFB800] ring-2 ring-[#FFB800]/40' : 'border-slate-200'
                }`}
              >
                <div className="w-16 h-16 relative flex items-center justify-center">
                  <KnowzaAvatar size="lg" costume={costume.id} />
                </div>

                <div>
                  <h4 className="text-xs font-black text-slate-900">{costume.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium leading-tight mt-0.5 line-clamp-2">
                    {costume.description}
                  </p>
                </div>

                <button
                  onClick={() => handleCostumeAction(costume)}
                  className={`w-full py-2 rounded-xl text-xs font-black transition ${
                    isSelected
                      ? 'bg-amber-100 text-amber-900'
                      : isUnlocked
                      ? 'bg-[#FFB800] text-slate-950 hover:bg-amber-400'
                      : 'bg-slate-900 text-amber-300'
                  }`}
                >
                  {isSelected ? 'Kuşanıldı ✨' : isUnlocked ? 'Kuşan' : `${costume.priceGems} 💎`}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* ================= TAB 5: İKSİRLER & GÜÇLENDİRİCİLER ================= */}
      {activeTab === 'boosters' && (
        <div className="space-y-3 animate-fade">
          {[
            {
              id: 'refill' as const,
              title: 'Can Doldurucu (Tüm Canlar)',
              desc: 'Tüm canlarını anında doldurur.',
              cost: 150,
              icon: '❤️',
            },
            {
              id: 'freeze' as const,
              title: 'Seri Dondurucu (1 Günlük Koruma)',
              desc: 'Giremediğin bir günde serini korur.',
              cost: 200,
              icon: '❄️',
            },
            {
              id: 'double' as const,
              title: '2X XP İksiri (15 Dakika)',
              desc: 'Çözdüğün her sorudan iki kat XP kazandırır.',
              cost: 250,
              icon: '⚡',
            },
          ].map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 border border-amber-200/80 shadow-xs flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl">
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-bold">{item.desc}</p>
                </div>
              </div>
              <button
                onClick={() => handleBuyBooster(item.id, item.cost)}
                className="px-4 py-2 bg-[#FFB800] hover:bg-amber-400 text-slate-950 font-black text-xs rounded-xl shadow-xs active:scale-95 transition whitespace-nowrap"
              >
                {item.cost} 💎
              </button>
            </div>
          ))}
        </div>
      )}

      {/* ================= TAB 6: ÖDÜLLÜ REKLAMLAR ================= */}
      {activeTab === 'ads' && (
        <div className="space-y-3.5 animate-fade">
          <div className="bg-white rounded-3xl p-5 border border-amber-200/70 shadow-sm space-y-2">
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <Tv className="w-5 h-5 text-emerald-600" />
              <span>Ücretsiz Ödüllü Reklam İzle</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium">
              Kısa bir sponsorlu video izleyerek anında ücretsiz elmas veya can kazanabilirsin!
            </p>
          </div>

          <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 rounded-3xl p-4 border border-emerald-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-2xl">
                💎
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">+50 Elmas Paketi</h4>
                <p className="text-[11px] text-emerald-800 font-bold">5 saniyelik video izle</p>
              </div>
            </div>

            <button
              onClick={() => handleWatchAd('gems')}
              disabled={watchingAd?.active}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-sm active:scale-95 transition flex items-center gap-1.5"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>İzle & Kazan</span>
            </button>
          </div>

          <div className="bg-gradient-to-r from-rose-50 via-pink-50 to-rose-50 rounded-3xl p-4 border border-rose-200 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 flex items-center justify-center text-2xl">
                ❤️
              </div>
              <div>
                <h4 className="font-black text-sm text-slate-900">Tüm Canları Doldur</h4>
                <p className="text-[11px] text-rose-800 font-bold">Beklemeden test çözmeye dön</p>
              </div>
            </div>

            <button
              onClick={() => handleWatchAd('heart')}
              disabled={watchingAd?.active}
              className="px-4 py-2.5 rounded-xl bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-sm active:scale-95 transition flex items-center gap-1.5"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Canı Doldur</span>
            </button>
          </div>
        </div>
      )}

      {/* ================= DISCORD-STYLE LIVE FRAME PREVIEW MODAL ================= */}
      {previewFrame && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fade">
          <div className="bg-[#181614] text-white rounded-3xl p-5 max-w-sm w-full border border-amber-500/40 shadow-2xl relative space-y-4">
            <button
              onClick={() => setPreviewFrame(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-slate-300 transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="text-center pt-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full border border-amber-400/20">
                Discord Tarzı Canlı Önizleme
              </span>
              <h3 className="text-lg font-black text-white mt-1">
                {previewFrame.badge} {previewFrame.name}
              </h3>
              <p className="text-xs text-slate-400 font-medium">{previewFrame.description}</p>
            </div>

            {/* Discord Avatar Showcase Card */}
            <div className="bg-gradient-to-b from-slate-900 to-black p-5 rounded-2xl border border-white/10 flex flex-col items-center justify-center relative overflow-hidden">
              <div className="w-24 h-24 relative flex items-center justify-center filter drop-shadow-xl my-2">
                <KnowzaAvatar
                  size="2xl"
                  frameId={previewFrame.id}
                  showFrameGlow={true}
                  customBear={stats.customBear}
                />
              </div>

              {/* Discord Chat Bubble Preview */}
              <div className="mt-3 bg-[#2B2D31] text-white px-3 py-2 rounded-2xl border border-white/10 text-left w-full flex items-center gap-2.5 shadow-sm">
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0">
                  <KnowzaAvatar size="xs" frameId={previewFrame.id} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-black text-amber-300">
                      {stats.username || 'Kertenkele Alp'}
                    </span>
                    <span className="text-[9px] text-slate-400">Şimdi</span>
                  </div>
                  <p className="text-[11px] text-slate-200">Güzel dekorasyonuma bak ✨</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2">
              {stats.isFounder || (stats.unlockedAvatarFrames && stats.unlockedAvatarFrames.includes(previewFrame.id)) ? (
                <button
                  onClick={() => {
                    equipFrame(previewFrame.id);
                    setPreviewFrame(null);
                    showToast(`✨ "${previewFrame.name}" çerçevesi kuşandı!`);
                  }}
                  className="w-full py-3 bg-[#FFB800] hover:bg-amber-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg transition active:scale-95"
                >
                  Bu Çerçeveyi Kuşan ✨
                </button>
              ) : (
                <button
                  onClick={() => {
                    const success = buyFrameWithGems(previewFrame.id);
                    if (success) {
                      setPreviewFrame(null);
                      showToast(`👑 "${previewFrame.name}" başarıyla satın alındı ve kuşandı!`);
                    } else {
                      showToast(`❌ Yetersiz elmas! (${previewFrame.priceGems} Elmas gerekli)`);
                    }
                  }}
                  className="w-full py-3 bg-gradient-to-r from-amber-400 to-[#FFB800] text-slate-950 font-black text-sm rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{previewFrame.priceGems} 💎 Karşılığında Satın Al</span>
                </button>
              )}

              <button
                onClick={() => setPreviewFrame(null)}
                className="w-full py-2 text-xs font-bold text-slate-400 hover:text-white transition"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
