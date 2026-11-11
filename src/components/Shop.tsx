import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { KNOWZA_COSTUMES } from '../data/costumesData';
import { KnowzaCostume } from '../types';
import { KnowzaAvatar } from './KnowzaAvatar';
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
  ArrowRight
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';

export const Shop: React.FC = () => {
  const { stats, buyShopItem, buyCostume, selectCostume, addXpAndGems, upgradeToPro } = useGame();
  const [activeTab, setActiveTab] = useState<'pro' | 'ads' | 'costumes' | 'boosters'>('pro');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [watchingAd, setWatchingAd] = useState<{ active: boolean; secondsLeft: number; rewardType: 'gems' | 'heart' } | null>(null);

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
          // Award reward
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
    const isUnlocked = stats.unlockedCostumes.includes(costume.id);

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

  const boosterItems = [
    {
      id: 'refill',
      type: 'refill' as const,
      title: 'Can Doldurucu',
      description: 'Tüm canlarını anında 5/5 seviyesine çıkarır. Teste kesintisiz devam et!',
      cost: 50,
      icon: '❤️',
      iconBg: 'bg-red-50 text-red-500'
    },
    {
      id: 'freeze',
      type: 'freeze' as const,
      title: 'Seri Dondurucu (Kutup Kalkanı)',
      description: 'Bir gün ders çözmeyi unutsan bile günlük serin (streak) bozulmaz!',
      cost: 100,
      icon: '❄️',
      iconBg: 'bg-blue-50 text-blue-500',
      owned: stats.inventory.streakFreeze
    },
    {
      id: 'double',
      type: 'double' as const,
      title: 'Çifte XP Güçlendirici',
      description: 'Önümüzdeki 30 dakika boyunca tamamladığın her dersten 2 kat XP kazan.',
      cost: 75,
      icon: '⚡',
      iconBg: 'bg-amber-50 text-amber-500'
    }
  ];

  return (
    <div className="flex-1 max-w-md mx-auto py-4 px-3 space-y-4 pb-32 select-none animate-fade">
      {/* Toast Feedback */}
      {feedback && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white font-bold text-xs px-4 py-2.5 rounded-2xl shadow-2xl border border-amber-300 animate-pop">
          {feedback}
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-5 text-white text-center shadow-lg relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Knowza Mağaza & Gelir Merkezi
        </div>
        <h2 className="text-2xl font-black">Prestij & Güç Mağazası</h2>
        <p className="text-white/80 text-xs font-semibold max-w-xs mx-auto mt-0.5">
          Elmas kazan, VIP abonelikle sınırsız cana ulaş veya 3D kostümlerin kilidini aç!
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
      <div className="grid grid-cols-4 gap-1.5 bg-white p-1 rounded-2xl border border-amber-100 shadow-xs">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('pro');
          }}
          className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'pro'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Crown className="w-4 h-4" />
          <span>VIP Pro</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('ads');
          }}
          className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'ads'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Tv className="w-4 h-4 text-emerald-600" />
          <span>Ödüllü Reklam</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('costumes');
          }}
          className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'costumes'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-600" />
          <span>Kostümler</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('boosters');
          }}
          className={`py-2 rounded-xl text-xs font-black transition flex flex-col items-center gap-0.5 ${
            activeTab === 'boosters'
              ? 'bg-[#FFB800] text-slate-900 shadow-sm'
              : 'text-slate-600 hover:bg-amber-50'
          }`}
        >
          <Zap className="w-4 h-4 text-blue-600" />
          <span>İksirler</span>
        </button>
      </div>

      {/* TAB 1: VIP PRO ABONELİK (Monetization Core) */}
      {activeTab === 'pro' && (
        <div className="space-y-4 animate-fade">
          <div className="bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-5 shadow-xl border border-amber-400/40 relative overflow-hidden">
            {/* Ambient gold glow */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <div className="inline-flex items-center gap-1.5 bg-[#FFB800] text-slate-950 px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase">
                <Crown className="w-4 h-4" />
                Knowza PRO Pass
              </div>
              {stats.isPro && (
                <span className="text-xs font-black bg-emerald-500 text-white px-2.5 py-0.5 rounded-full">
                  AKTİF ÜYESİNİZ 🎉
                </span>
              )}
            </div>

            <h3 className="text-xl font-black mb-1">Sınavlara VIP Ayrıcalığıyla Hazırlan!</h3>
            <p className="text-xs text-white/70 mb-4">
              Can kısıtlaması olmadan sınırsız test çöz, reklamsız çalış ve AI koçun tüm gücünü aç.
            </p>

            {/* Pro Features Checklist */}
            <div className="space-y-2 mb-5">
              {[
                '❤️ Sınırsız Can (Hiçbir zaman bekleme yapma)',
                '🚫 %100 Reklamsız Kesintisiz Deneyim',
                '⚡ 2 Kat Sabit XP & Liderlik Çarpanı',
                '👑 Özel 3D Altın Taçlı Kral Maskot Kostümü',
                '🤖 Sesli AI Koç ile Sınırsız Soru-Cevap',
                '📊 Detaylı ÖSYM & Net Analiz Raporları'
              ].map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-xs font-bold text-amber-100">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            {/* Upgrade Button */}
            {!stats.isPro ? (
              <button
                onClick={() => {
                  upgradeToPro();
                  showToast('👑 Tebrikler! Knowza PRO başarıyla aktif edildi!');
                }}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] text-slate-950 font-black text-sm shadow-lg shadow-amber-500/30 active:scale-95 transition flex items-center justify-center gap-2"
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
        </div>
      )}

      {/* TAB 2: ÖDÜLLÜ REKLAMLAR (Watch Ads to Earn) */}
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

          {/* Ad Reward 1: +50 Elmas */}
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

          {/* Ad Reward 2: Can Doldurma */}
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
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-sm active:scale-95 transition flex items-center gap-1.5"
            >
              <Tv className="w-3.5 h-3.5" />
              <span>İzle & Doldur</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: 3D KOSTÜMLER */}
      {activeTab === 'costumes' && (
        <div className="grid grid-cols-2 gap-3 animate-fade">
          {KNOWZA_COSTUMES.map((costume) => {
            const isUnlocked = stats.unlockedCostumes.includes(costume.id);
            const isSelected = stats.selectedCostume === costume.id;
            const canAfford = stats.gems >= costume.priceGems && stats.xp >= costume.requiredXp;

            return (
              <div
                key={costume.id}
                className={`bg-white rounded-3xl p-3.5 border-2 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#FFB800] ring-2 ring-[#FFB800]/30 shadow-md'
                    : 'border-slate-100 hover:border-amber-200 shadow-xs'
                }`}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 p-1 flex items-center justify-center mb-2">
                    <KnowzaAvatar size="lg" costume={costume.id} animate={isSelected ? 'dance' : false} />
                  </div>
                  <h4 className="font-black text-xs text-slate-900">{costume.name}</h4>
                  <p className="text-[10px] text-slate-500 font-medium line-clamp-2 mt-0.5">
                    {costume.description}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100">
                  {isSelected ? (
                    <div className="w-full py-1.5 rounded-xl bg-amber-100 text-amber-900 text-[11px] font-black text-center">
                      Kuşanıldı ✨
                    </div>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => handleCostumeAction(costume)}
                      className="w-full py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-[11px] font-black active:scale-95 transition"
                    >
                      Kuşan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleCostumeAction(costume)}
                      disabled={!canAfford}
                      className="w-full py-1.5 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] disabled:opacity-40 text-slate-950 text-[11px] font-black shadow-xs active:scale-95 transition flex items-center justify-center gap-1"
                    >
                      <span>💎 {costume.priceGems}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 4: İKSİRLER & GÜÇLENDİRİCİLER */}
      {activeTab === 'boosters' && (
        <div className="space-y-3 animate-fade">
          {boosterItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl p-4 border border-amber-200/70 shadow-xs flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl ${item.iconBg} flex items-center justify-center text-2xl`}>
                  {item.icon}
                </div>
                <div>
                  <h4 className="font-black text-sm text-slate-900">{item.title}</h4>
                  <p className="text-[11px] text-slate-500 font-medium">{item.description}</p>
                </div>
              </div>

              <button
                onClick={() => handleBuyBooster(item.type, item.cost)}
                className="px-3.5 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 font-black text-xs shadow-xs active:scale-95 transition flex items-center gap-1"
              >
                <span>💎 {item.cost}</span>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Rewarded Video Modal Player */}
      {watchingAd && (
        <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center p-6 text-white text-center animate-fade">
          <div className="w-20 h-20 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-3xl mb-4 animate-pulse">
            📺
          </div>
          <h3 className="text-xl font-black mb-1">Sponsorlu Ödüllü Video Oynatılıyor</h3>
          <p className="text-xs text-white/70 mb-6">
            Ödülünüzü kazanmak için lütfen videonun bitmesini bekleyin...
          </p>

          <div className="text-4xl font-black text-[#FFB800] font-mono mb-4 animate-bounce">
            {watchingAd.secondsLeft}
          </div>

          <div className="w-48 bg-white/20 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#FFB800] h-full transition-all duration-1000"
              style={{ width: `${((5 - watchingAd.secondsLeft) / 5) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
