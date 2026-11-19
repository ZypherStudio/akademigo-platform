import { AccessoryId, BlockThemeId, OutfitId } from '../types/game';

export interface OutfitItem {
  id: OutfitId;
  name: string;
  desc: string;
  priceCoins: number;
  swatch: string;
}

export interface AccessoryItem {
  id: AccessoryId;
  name: string;
  desc: string;
  priceCoins: number;
  iconLabel: string;
}

export interface BlockThemeItem {
  id: BlockThemeId;
  name: string;
  desc: string;
  priceCoins: number;
}

export const OUTFIT_CATALOG: OutfitItem[] = [
  {
    id: 'classic',
    name: 'Klasik Siyah K',
    desc: 'Knowza’nın ikonik siyah kapüşonlusu ve altın K arması.',
    priceCoins: 0,
    swatch: 'from-[#332724] to-[#1a1210]'
  },
  {
    id: 'crimson',
    name: 'Ateş Kırmızısı',
    desc: 'Dinamik yakut kırmızısı tişört ve kapüşonlu tasarım.',
    priceCoins: 0,
    swatch: 'from-[#ef4444] to-[#991b1b]'
  },
  {
    id: 'karate',
    name: 'Karate Dojo Ustası',
    desc: 'Kar beyazı karate kimonosu ve kırmızı dojo kuşağı!',
    priceCoins: 0,
    swatch: 'from-[#ffffff] via-[#e2e8f0] to-[#dc2626]'
  },
  {
    id: 'royal',
    name: 'Kraliyet Moru',
    desc: 'Bilgi Kalesi’nin asil mor kapüşonlu kıyafeti.',
    priceCoins: 250,
    swatch: 'from-[#a855f7] to-[#581c87]'
  },
  {
    id: 'emerald',
    name: 'Zümrüt Usta',
    desc: 'Orman adalarının canlı zümrüt yeşili takımı.',
    priceCoins: 300,
    swatch: 'from-[#22c55e] to-[#14532d]'
  },
  {
    id: 'cyber',
    name: 'Siber Neon Mavi',
    desc: 'Gelecekten gelen parlak elektrik mavisi tarz.',
    priceCoins: 350,
    swatch: 'from-[#38bdf8] to-[#0369a1]'
  }
];

export const ACCESSORY_CATALOG: AccessoryItem[] = [
  {
    id: 'none',
    name: 'Klasik Kep',
    desc: 'Sade mezuniyet kepi görünümü.',
    priceCoins: 0,
    iconLabel: '🎓'
  },
  {
    id: 'bandana',
    name: 'Dojo Bandanası',
    desc: 'Karate ustası kırmızı savaşçı alın bandı.',
    priceCoins: 0,
    iconLabel: '🥋'
  },
  {
    id: 'crown',
    name: 'Altın Taç',
    desc: 'Yakut taşlı parlayan krallık tacı.',
    priceCoins: 400,
    iconLabel: '👑'
  },
  {
    id: 'visor',
    name: 'Siber Vizör',
    desc: 'Parlayan neon camgöbeği gözlük.',
    priceCoins: 350,
    iconLabel: '🕶️'
  }
];

export const BLOCK_THEME_CATALOG: BlockThemeItem[] = [
  {
    id: 'classic',
    name: 'Klasik 3D Küp',
    desc: 'Parlak oyuncak blok dokusu ve kabartmalı simgeler.',
    priceCoins: 0
  },
  {
    id: 'crystal',
    name: 'Elmas Kristal',
    desc: 'Prizma kesimli ışıltılı mücevher küpler.',
    priceCoins: 0
  },
  {
    id: 'candy',
    name: 'Şeker Jöle',
    desc: 'Ekstra parlak jelibon dokusu ve tatlı yansıma.',
    priceCoins: 300
  },
  {
    id: 'dojo',
    name: 'Dojo Altın Çerçeve',
    desc: 'Koyu ahşap kenarlı altın varaklı usta bloklar.',
    priceCoins: 400
  }
];
