import { KnowzaCostume, KnowzaCostumeInfo } from '../types';

export const KNOWZA_COSTUMES: KnowzaCostumeInfo[] = [
  {
    id: 'classic',
    name: 'Klasik Knowza',
    title: 'Orijinal 3D Maskot',
    description: 'Knowza\'nın simgesi, mezuniyet kepli ve "K" kapüşonlu 3D sarı ayıcık.',
    priceGems: 0,
    requiredXp: 0,
    badge: 'VARSAYILAN 💛',
    icon: '🎓',
    bgGradient: 'from-amber-400 to-yellow-500'
  },
  {
    id: 'king',
    name: 'Kral Knowza',
    title: 'Tahtın Sahibi',
    description: 'Kırmızı yakut işlemeli altın taç. YKS ve KPSS\'de zirveye oynayanlara layık!',
    priceGems: 300,
    requiredXp: 1500,
    badge: 'KRALİYET 👑',
    icon: '👑',
    bgGradient: 'from-amber-500 to-yellow-600'
  },
  {
    id: 'cyber',
    name: 'Siberpunk Knowza',
    title: 'Geleceğin Kodcusu',
    description: 'Neon camgöbeği vizör gözlük ve fütüristik kulaklık. Kodlama odasının hakimi!',
    priceGems: 450,
    requiredXp: 2500,
    badge: 'CYBER ⚡',
    icon: '🕶️',
    bgGradient: 'from-cyan-500 to-blue-600'
  },
  {
    id: 'party',
    name: 'Dansçı Parti Knowza',
    title: 'Disko Yıldızı',
    description: 'Yıldız gözlükler ve parti şapkası! Her soruda dans eden sınırsız enerji kaynağı.',
    priceGems: 600,
    requiredXp: 3500,
    badge: 'DANS MODU 🕺',
    icon: '⭐',
    bgGradient: 'from-pink-500 to-purple-600'
  },
  {
    id: 'graduate',
    name: 'Mezun Knowza',
    title: 'Akademi Birincisi',
    description: 'Altın püsküllü mezuniyet kepi ve cübbesi. Hedefindeki üniversiteyi kazananlara özel!',
    priceGems: 350,
    requiredXp: 1800,
    badge: 'DERECE 🎓',
    icon: '🎓',
    bgGradient: 'from-blue-600 to-indigo-700'
  },
  {
    id: 'astronaut',
    name: 'Kozmik Astronot Knowza',
    title: 'Uzay Kaşifi',
    description: 'Yüksek irtifa uzay kaskı ve telsiz sistemi. Bilginle sınırları aş!',
    priceGems: 800,
    requiredXp: 4500,
    badge: 'EFSANEVİ 🚀',
    icon: '🛰️',
    bgGradient: 'from-indigo-600 to-violet-800'
  },
  {
    id: 'shadow_raven',
    name: 'Gölge Kuzgun Knowza',
    title: 'Karanlık Kanatların Efendisi',
    description: 'Obsidiyen kuzgun moru kürk, büyülü kraliyet pelerini ve parlayan mistik asa. Nadir koleksiyon!',
    priceGems: 1450,
    requiredXp: 6000,
    badge: 'EFSANEVİ 🦅',
    icon: '🦅',
    bgGradient: 'from-violet-700 to-purple-950'
  },
  {
    id: 'moon_wolf',
    name: 'Ay Kurdu Knowza',
    title: 'Hilal Rüyalarının Muhafızı',
    description: 'Gümüş ay ışığı kürkü, yıldızlı büyücü şapkası ve gece yarısı peleriniyle parlayan efsane.',
    priceGems: 1750,
    requiredXp: 7500,
    badge: 'MİTİK 🌙',
    icon: '🌙',
    bgGradient: 'from-indigo-700 to-slate-900'
  },
  {
    id: 'crimson_samurai',
    name: 'Kızıl Savaşçı Knowza',
    title: 'Neon Arena Şampiyonu',
    description: 'Kızıl kahraman kürkü, neon siber vizör ve alevli meşalesiyle rakiplerine göz açtırmaz!',
    priceGems: 2100,
    requiredXp: 9000,
    badge: 'EFSANEVİ 🔥',
    icon: '🔥',
    bgGradient: 'from-rose-600 to-red-900'
  },
  {
    id: 'dragon_emperor',
    name: 'Ejderha İmparatoru Knowza',
    title: 'Mutlak Zirve Hükümdarı',
    description: 'Saf altın kürk, yakut işlemeli imparator tacı, profesör gözlüğü ve altın asasıyla en prestijli karakter.',
    priceGems: 2500,
    requiredXp: 12000,
    badge: 'ULTİMATE 🐉',
    icon: '🐉',
    bgGradient: 'from-amber-500 via-orange-600 to-red-800'
  }
];

export const HARIBO_COSTUMES = KNOWZA_COSTUMES;
