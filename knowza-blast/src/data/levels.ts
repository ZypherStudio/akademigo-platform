import { CubeColor, LevelConfig } from '../types/game';

const BASE_4: CubeColor[] = ['blue', 'yellow', 'red', 'green'];
const ALL_5: CubeColor[] = ['blue', 'yellow', 'red', 'green', 'purple'];

export const LEVELS: LevelConfig[] = [
  {
    id: 1,
    name: 'Blok Başlangıcı',
    subtitle: 'Blokları 8×8 tahtaya sürükle, tam satır veya sütun doldurup patlat!',
    moves: 3, // Used as starting combo goal / display metadata
    colors: BASE_4,
    targets: { blue: 6, yellow: 6, red: 6 },
    obstaclePreset: 'none',
    rewards: { stars: 25, coins: 100, xp: 80 }
  },
  {
    id: 2,
    name: 'Çifte Sıra',
    subtitle: 'Aynı anda 2 sıra birden temizleyerek ekstra seri puanı kap!',
    moves: 4,
    colors: BASE_4,
    targets: { green: 8, yellow: 8, blue: 8 },
    obstaclePreset: 'none',
    rewards: { stars: 30, coins: 120, xp: 90 }
  },
  {
    id: 3,
    name: 'Kutu Avı',
    subtitle: 'Ahşap kutuların bulunduğu satır veya sütunu tamamlayıp kutuları kır!',
    moves: 5,
    colors: BASE_4,
    targets: { red: 8, blue: 8, crate: 3 },
    obstaclePreset: 'crates_side',
    rewards: { stars: 35, coins: 140, xp: 100 }
  },
  {
    id: 4,
    name: 'Orta Kale',
    subtitle: 'Ortadaki kutuları açmak için yatay ve dikey hatlar kur!',
    moves: 6,
    colors: BASE_4,
    targets: { blue: 10, yellow: 10, crate: 4 },
    obstaclePreset: 'crates_mid',
    rewards: { stars: 40, coins: 160, xp: 115 }
  },
  {
    id: 5,
    name: 'Buzul Çizgisi',
    subtitle: 'Buzlu blokların geçtiği satırları doldur ve buzları çöz!',
    moves: 6,
    colors: BASE_4,
    targets: { red: 10, green: 10, ice: 4 },
    obstaclePreset: 'ice_center',
    rewards: { stars: 45, coins: 180, xp: 130 }
  },
  {
    id: 6,
    name: 'Seri Ustası',
    subtitle: 'Art arda satır temizleyerek kombo çarpanını büyüt!',
    moves: 7,
    colors: BASE_4,
    targets: { yellow: 12, red: 12, blue: 10 },
    obstaclePreset: 'none',
    rewards: { stars: 50, coins: 200, xp: 140 }
  },
  {
    id: 7,
    name: 'Köşe Stratejisi',
    subtitle: 'Büyük L ve kare parçalar için köşeleri düzenli tut!',
    moves: 7,
    colors: BASE_4,
    targets: { green: 12, red: 12, crate: 4 },
    obstaclePreset: 'crates_side',
    rewards: { stars: 50, coins: 210, xp: 150 }
  },
  {
    id: 8,
    name: 'Kristal Izgara',
    subtitle: 'Buzlu kareleri temizlemek için sütunları hedefle!',
    moves: 8,
    colors: BASE_4,
    targets: { blue: 12, yellow: 12, ice: 5 },
    obstaclePreset: 'ice_checker',
    rewards: { stars: 55, coins: 220, xp: 160 }
  },
  {
    id: 9,
    name: 'Büyük Meydan',
    subtitle: 'Sıkıştığında alttaki Çekiç veya Bomba güçlendiricini kullan!',
    moves: 8,
    colors: BASE_4,
    targets: { red: 14, yellow: 14, green: 12 },
    obstaclePreset: 'crates_mid',
    rewards: { stars: 60, coins: 240, xp: 170 }
  },
  {
    id: 10,
    name: 'Mor Elmas Kapısı',
    subtitle: '5. renk Mor Elmas bloklar oyuna katıldı!',
    moves: 9,
    colors: ALL_5,
    targets: { purple: 10, yellow: 12, red: 12 },
    obstaclePreset: 'none',
    rewards: { stars: 65, coins: 260, xp: 185 }
  }
];

const LEVEL_NAMES_11_30 = [
  'Yıldız Avlusu',
  'Yıldız Köprüsü',
  'Zümrüt Teras',
  'Şelale Geçidi',
  'Bilge Kule',
  'Altın Avlu',
  'Buzul Kütüphanesi',
  'Sihirli Merdiven',
  'Kraliyet Bahçesi',
  'Yüzen Ada',
  'Kalkan Duvarı',
  'Prizma Salonu',
  'Ateş Böceği Vadisi',
  'Bilgi Dünyası Kapısı',
  'Elmas Sütunlar',
  'Gökkuşağı Köşkü',
  'Büyük Kule Meydanı',
  'Efsanevi Avlu',
  'Usta Şövalye Sınavı',
  'Knowza Kalesi Finali'
];

for (let i = 11; i <= 30; i++) {
  const idx = i - 11;
  const presets: LevelConfig['obstaclePreset'][] = [
    'crates_mid',
    'ice_center',
    'castle_fort',
    'ice_checker',
    'crates_side'
  ];
  const preset = presets[idx % presets.length];
  const baseQty = 10 + Math.floor(idx / 3) * 2;
  const c1 = ALL_5[idx % 5];
  const c2 = ALL_5[(idx + 2) % 5];
  const c3 = ALL_5[(idx + 4) % 5];

  const targets: LevelConfig['targets'] = {
    [c1]: baseQty,
    [c2]: baseQty,
    [c3]: Math.max(8, baseQty - 2)
  };
  if (preset === 'crates_mid' || preset === 'crates_side' || preset === 'castle_fort') {
    targets.crate = 4 + (idx % 3);
  }
  if (preset === 'ice_center' || preset === 'ice_checker' || preset === 'castle_fort') {
    targets.ice = 4 + (idx % 3);
  }

  LEVELS.push({
    id: i,
    name: LEVEL_NAMES_11_30[idx],
    subtitle:
      i === 24
        ? 'Bilgi Dünyası kalesine bir adım kaldı!'
        : i === 30
        ? 'Büyük K-Kale finali! Tüm blokları temizle!'
        : 'Tam satır ve sütunlar kurarak hedefleri topla!',
    moves: 8 + (idx % 5),
    colors: ALL_5,
    targets,
    obstaclePreset: preset,
    rewards: {
      stars: 50 + idx * 5,
      coins: 200 + idx * 15,
      xp: 160 + idx * 12
    }
  });
}
