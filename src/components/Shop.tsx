import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { HARIBO_COSTUMES } from '../data/costumesData';
import { KnowzaCostume } from '../types';
import { KnowzaAvatar } from './KnowzaAvatar';
import { ShoppingBag, Sparkles, Check, Lock, Zap } from 'lucide-react';
import { sound } from '../utils/audio';

export const Shop: React.FC = () => {
  const { stats, buyShopItem, buyCostume, selectCostume } = useGame();
  const [activeTab, setActiveTab] = useState<'costumes' | 'boosters'>('costumes');
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleBuyBooster = (item: 'refill' | 'freeze' | 'double', cost: number) => {
    if (stats.gems < cost) {
      showToast('❌ Yeterli elmasın yok! Ders veya Kahoot çözerek elmas kazanabilirsin.');
      return;
    }
    const success = buyShopItem(item);
    if (success) {
      showToast('🎉 Güçlendirici başarıyla satın alındı!');
    } else {
      showToast('⚠️ Canların zaten dolu veya işlem gerçekleştirilemedi.');
    }
  };

  const handleCostumeAction = (costume: typeof HARIBO_COSTUMES[0]) => {
    const isUnlocked = stats.unlockedCostumes.includes(costume.id);

    if (isUnlocked) {
      selectCostume(costume.id);
      showToast(`✨ "${costume.name}" kostümü kuşandı!`);
      return;
    }

    if (stats.xp < costume.requiredXp) {
      showToast(`🔒 Bu kostüm için Seviye / ${costume.requiredXp} XP gereklidir!`);
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
      title: 'Can Doldurucu (Bal Küpü)',
      description: 'Tüm canlarını anında 5/5 seviyesine çıkarır. Asla ara verme!',
      cost: 50,
      icon: '❤️',
      iconBg: 'bg-red-50 text-red-500'
    },
    {
      id: 'freeze',
      type: 'freeze' as const,
      title: 'Seri Dondurucu (Kutup Buzu)',
      description: 'Bir gün ders yapmayı unutsan bile günlük serin (streak) bozulmaz!',
      cost: 100,
      icon: '❄️',
      iconBg: 'bg-blue-50 text-blue-500',
      owned: stats.inventory.streakFreeze
    },
    {
      id: 'double',
      type: 'double' as const,
      title: 'Çifte XP Jelibonu',
      description: 'Önümüzdeki 30 dakika boyunca tamamladığın her dersten 2 kat XP kazan.',
      cost: 75,
      icon: '⚡',
      iconBg: 'bg-amber-50 text-amber-500'
    }
  ];

  return (
    <div className="flex-1 max-w-3xl mx-auto py-6 px-4 space-y-6 pb-24 select-none">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white text-center shadow-xl relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          Knowza Prestij Mağazası
        </div>
        <h2 className="text-2xl sm:text-3xl font-black">Knowza Kostüm & Güç Merkezi</h2>
        <p className="text-white/80 text-xs sm:text-sm font-semibold max-w-md mx-auto mt-1">
          Yüksek puanlarla efsanevi ayıcık kostümlerini kuşan, Kahoot ve düellolarda farkını göster!
        </p>

        {/* Current Balance Pill */}
        <div className="inline-flex items-center gap-4 bg-white/20 backdrop-blur-md px-5 py-2 rounded-2xl font-black text-sm mt-4 shadow-sm border border-white/20">
          <div className="flex items-center gap-1.5 text-amber-200">
            <span>⚡ {stats.xp} XP</span>
          </div>
          <div className="h-4 w-0.5 bg-white/30" />
          <div className="flex items-center gap-1.5 text-blue-200">
            <span>💎 {stats.gems} Elmas</span>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3 bg-gray-900 text-white text-xs font-bold rounded-2xl text-center animate-pop shadow-lg">
          {feedback}
        </div>
      )}

      {/* Shop Category Tabs */}
      <div className="flex bg-gray-100 dark:bg-[#1a2c35] p-1.5 rounded-2xl border-2 border-gray-200 dark:border-[#2b3d45]">
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('costumes');
          }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'costumes'
              ? 'bg-white dark:bg-[#202f36] text-amber-500 shadow-md'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <span>👑 Knowza Kostüm Dolabı ({HARIBO_COSTUMES.length})</span>
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setActiveTab('boosters');
          }}
          className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
            activeTab === 'boosters'
              ? 'bg-white dark:bg-[#202f36] text-[#1cb0f6] shadow-md'
              : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
          }`}
        >
          <span>⚡ Güçlendiriciler & Canlar</span>
        </button>
      </div>

      {/* TAB 1: HARIBO COSTUMES WARDROBE */}
      {activeTab === 'costumes' && (
        <div className="space-y-4 animate-fade">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase text-gray-400 dark:text-gray-500">
              Kişiselleştirilebilir Ayıcık Kostümleri
            </span>
            <span className="text-xs font-bold text-amber-500">
              Seçili: {HARIBO_COSTUMES.find(c => c.id === stats.selectedCostume)?.name}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {HARIBO_COSTUMES.map((costume) => {
              const isUnlocked = stats.unlockedCostumes.includes(costume.id);
              const isSelected = stats.selectedCostume === costume.id;
              const canAfford = stats.gems >= costume.priceGems && stats.xp >= costume.requiredXp;

              return (
                <div
                  key={costume.id}
                  className={`bg-white dark:bg-[#1a2c35] rounded-3xl p-5 border-2 transition-all flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#58cc02] shadow-lg ring-2 ring-green-300 dark:ring-green-700'
                      : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300'
                  }`}
                >
                  <div>
                    {/* Top Costume Card Header */}
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 rounded-full text-gray-700 dark:text-gray-300">
                        {costume.badge}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] font-black bg-green-500 text-white px-2 py-0.5 rounded-full">
                          KUŞANILDI ✅
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[10px] font-bold text-blue-500">
                          Sahipsin
                        </span>
                      ) : (
                        <span className="text-[10px] font-bold text-gray-400">
                          Kilitli 🔒
                        </span>
                      )}
                    </div>

                    {/* Costume Animated Preview */}
                    <div className="flex items-center gap-4 mb-3">
                      <div className="p-2.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 flex items-center justify-center">
                        <KnowzaAvatar size="xl" costume={costume.id} animate="dance" />
                      </div>
                      <div>
                        <h4 className="font-black text-base text-gray-800 dark:text-gray-100">
                          {costume.name}
                        </h4>
                        <div className="text-xs text-amber-500 font-bold">{costume.title}</div>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium mt-1 leading-snug">
                          {costume.description}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Requirements & Action Button */}
                  <div className="pt-3 border-t border-gray-100 dark:border-[#2b3d45] flex items-center justify-between gap-3">
                    {!isUnlocked ? (
                      <div className="text-[11px] font-black text-gray-500">
                        <div>💎 {costume.priceGems} Elmas</div>
                        <div className="text-[10px] text-gray-400">⚡ {costume.requiredXp} XP Şartı</div>
                      </div>
                    ) : (
                      <span className="text-xs font-black text-green-600">
                        Dolabında Hazır
                      </span>
                    )}

                    <button
                      onClick={() => handleCostumeAction(costume)}
                      className={`px-4 py-2 rounded-xl text-xs font-black transition-all active:scale-95 ${
                        isSelected
                          ? 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-default'
                          : isUnlocked
                          ? 'bg-[#1cb0f6] text-white hover:bg-[#1899d6] shadow-md'
                          : canAfford
                          ? 'bg-amber-500 text-white hover:bg-amber-600 shadow-md'
                          : 'bg-gray-200 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {isSelected ? 'Seçili' : isUnlocked ? 'Kuşan' : 'Aç & Satın Al'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BOOSTERS & POWERUPS */}
      {activeTab === 'boosters' && (
        <div className="space-y-3 animate-fade">
          {boosterItems.map(item => (
            <div
              key={item.id}
              className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm flex items-center justify-between gap-4 transition-colors duration-300"
            >
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl select-none ${item.iconBg}`}>
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-base text-gray-800 dark:text-gray-100">{item.title}</h4>
                    {item.owned !== undefined && (
                      <span className="text-[10px] font-black bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-md">
                        Sahip: {item.owned} Adet
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 font-medium max-w-md mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleBuyBooster(item.type, item.cost)}
                disabled={stats.gems < item.cost}
                className={`flex-shrink-0 px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-1.5 transition-all border-b-4 ${
                  stats.gems >= item.cost
                    ? 'bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-[#1899d6] active:border-b-0 active:translate-y-1 shadow-md'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400 dark:text-gray-600 border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-70'
                }`}
              >
                <span>Satın Al</span>
                <span className="bg-white/20 px-1.5 py-0.5 rounded text-white font-mono text-xs">
                  💎 {item.cost}
                </span>
              </button>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
