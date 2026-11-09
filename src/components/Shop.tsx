import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { ShoppingBag, Heart, Shield, Zap, Sparkles, Check } from 'lucide-react';

export const Shop: React.FC = () => {
  const { stats, buyShopItem } = useGame();
  const [feedback, setFeedback] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleBuy = (item: 'refill' | 'freeze' | 'double', cost: number) => {
    if (stats.gems < cost) {
      showToast('❌ Yeterli elmasın yok! Ders çözerek elmas kazanabilirsin.');
      return;
    }
    const success = buyShopItem(item);
    if (success) {
      showToast('🎉 Başarıyla satın alındı!');
    } else {
      showToast('⚠️ Canların zaten dolu veya işlem gerçekleştirilemedi.');
    }
  };

  const items = [
    {
      id: 'refill',
      type: 'refill' as const,
      title: 'Can Doldurucu',
      description: 'Tüm canlarını anında 5/5 seviyesine çıkarır. Asla ara verme!',
      cost: 50,
      icon: '❤️',
      iconBg: 'bg-red-50 text-red-500'
    },
    {
      id: 'freeze',
      type: 'freeze' as const,
      title: 'Seri Dondurucu',
      description: 'Bir gün ders yapmayı unutsan bile günlük serin (streak) bozulmaz!',
      cost: 100,
      icon: '❄️',
      iconBg: 'bg-blue-50 text-blue-500',
      owned: stats.inventory.streakFreeze
    },
    {
      id: 'double',
      type: 'double' as const,
      title: 'Çifte XP İksiri',
      description: 'Önümüzdeki 30 dakika boyunca tamamladığın her dersten 2 kat XP kazan.',
      cost: 75,
      icon: '⚡',
      iconBg: 'bg-amber-50 text-amber-500'
    }
  ];

  return (
    <div className="flex-1 max-w-2xl mx-auto py-6 px-4 space-y-6 pb-24">
      
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl p-6 text-white text-center shadow-lg relative">
        <div className="text-5xl mb-2">🛒</div>
        <h2 className="text-2xl sm:text-3xl font-black">AkademiGO Mağazası</h2>
        <p className="text-white/80 text-xs sm:text-sm font-semibold mt-1">
          Kazandığın elmaslarla serini koru, canlarını yenile ve güçlendiriciler edin!
        </p>

        {/* Current Balance */}
        <div className="inline-flex items-center gap-2 bg-white/20 px-4 py-1.5 rounded-full font-black text-sm mt-3">
          <span>Mevcut Bakiyen:</span>
          <span>💎 {stats.gems} Elmas</span>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div className="p-3 bg-gray-900 text-white text-xs font-bold rounded-2xl text-center animate-pop">
          {feedback}
        </div>
      )}

      {/* Items List */}
      <div className="space-y-3">
        {items.map(item => (
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
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold mt-0.5 max-w-sm">
                  {item.description}
                </p>
              </div>
            </div>

            <button
              onClick={() => handleBuy(item.type, item.cost)}
              disabled={stats.gems < item.cost}
              className={`px-4 py-2.5 rounded-2xl font-black text-xs uppercase tracking-wider transition-all border-b-4 flex items-center gap-1.5 whitespace-nowrap active:border-b-0 active:translate-y-1 ${
                stats.gems >= item.cost
                  ? 'bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-[#1899d6]'
                  : 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              }`}
            >
              <span>AL</span>
              <span className="bg-white/20 px-1.5 py-0.5 rounded text-[11px]">💎 {item.cost}</span>
            </button>
          </div>
        ))}
      </div>

    </div>
  );
};
