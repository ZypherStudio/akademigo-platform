import { BiomeId, BlockThemeId, ObstacleType } from '../types/game';

export interface BiomeConfig {
  id: BiomeId;
  name: string;
  subtitle: string;
  mechanicTitle: string;
  mechanicDesc: string;
  primaryObstacle: ObstacleType;
  blockTheme: BlockThemeId;
  mapBgImage?: string;
  playBgImage?: string;
  skyGradient: string;
  mapOverlayGradient: string;
  boardFrameClass: string;
  boardInnerColor: string;
  accentColor: string;
  badgeClass: string;
  pedestalLockedClass: string;
  pedestalUnlockedClass: string;
  pedestalCurrentClass: string;
  roadStrokeColor: string;
  roadGlowColor: string;
  ribbonClass: string;
  hudCardClass: string;
  hudTitleTextClass: string;
  hudSubTextClass: string;
  mechanicBarClass: string;
  panelClass: string;
  dockFadeClass: string;
  traySlotBgClass: string;
  isDarkTheme?: boolean;
}

export const BIOMES: BiomeConfig[] = [
  {
    id: 'forest',
    name: 'Yeşil Vadi',
    subtitle: 'Kadim orman yolları ve ahşap kutular',
    mechanicTitle: 'Ahşap Kutular',
    mechanicDesc: 'Kutuların geçtiği satırları tamamla ve yolu aç!',
    primaryObstacle: 'crate',
    blockTheme: 'classic',
    mapBgImage: 'assets/bg_world_map.jpg',
    playBgImage: 'assets/bg_gameplay.jpg',
    skyGradient: 'from-sky-400/10 via-transparent to-[#2e1606]/35',
    mapOverlayGradient: 'from-sky-400/5 via-transparent to-[#231003]/45',
    boardFrameClass: 'border-[#4d2506] bg-gradient-to-b from-[#c78641] via-[#9b5d22] to-[#6f3d10]',
    boardInnerColor: 'bg-[#552d0d]/95',
    accentColor: '#34d399',
    badgeClass: 'bg-emerald-600/95 text-white border-emerald-200',
    pedestalLockedClass: 'pedestal-stone',
    pedestalUnlockedClass: 'pedestal-done',
    pedestalCurrentClass: 'pedestal-gold',
    roadStrokeColor: '#fde68a',
    roadGlowColor: 'rgba(251,191,36,0.45)',
    ribbonClass: 'wood-ribbon text-[#fff3d1]',
    hudCardClass: 'parchment-card',
    hudTitleTextClass: 'text-[#3d1c04]',
    hudSubTextClass: 'text-[#6b3910]',
    mechanicBarClass: 'bg-[#2c1505]/85 border-[#d6984b]/55 text-[#fff4d8]',
    panelClass: 'biome-panel-forest',
    dockFadeClass: 'from-[#2a1304] via-[#3e1d08]/90 to-transparent',
    traySlotBgClass: 'bg-[#f4dab0]/80 border-[#cca065]'
  },
  {
    id: 'glacier',
    name: 'Buzul Krallığı',
    subtitle: 'Dondurucu kar fırtınası ve buz kristalleri',
    mechanicTitle: 'Buz Kristali',
    mechanicDesc: 'Buz kaplı küpleri eritince altındaki rengi de toplarsın!',
    primaryObstacle: 'ice',
    blockTheme: 'crystal',
    mapBgImage: 'assets/bg_biome_glacier.jpg',
    playBgImage: 'assets/bg_biome_glacier.jpg',
    skyGradient: 'from-cyan-300/15 via-transparent to-[#071f3b]/45',
    mapOverlayGradient: 'from-sky-400/10 via-transparent to-[#061833]/45',
    boardFrameClass: 'border-[#0c4a6e] bg-gradient-to-b from-[#e0f2fe] via-[#38bdf8] to-[#0369a1]',
    boardInnerColor: 'bg-[#0a2540]/95',
    accentColor: '#38bdf8',
    badgeClass: 'bg-sky-600/95 text-white border-cyan-200',
    pedestalLockedClass: 'pedestal-glacier-locked',
    pedestalUnlockedClass: 'pedestal-glacier-done',
    pedestalCurrentClass: 'pedestal-glacier-current',
    roadStrokeColor: '#e0f2fe',
    roadGlowColor: 'rgba(56,189,248,0.65)',
    ribbonClass: 'bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#0c4a6e] border-2 border-[#bae6fd] text-[#f0f9ff] shadow-xl',
    hudCardClass: 'bg-gradient-to-b from-[#f0f9ff] via-[#e0f2fe] to-[#bae6fd] border-[2.5px] border-[#0284c7] shadow-xl',
    hudTitleTextClass: 'text-[#0c4a6e]',
    hudSubTextClass: 'text-[#0369a1]',
    mechanicBarClass: 'bg-[#082f49]/90 border-[#7dd3fc]/70 text-[#f0f9ff]',
    panelClass: 'biome-panel-glacier',
    dockFadeClass: 'from-[#061833] via-[#0c2d54]/90 to-transparent',
    traySlotBgClass: 'bg-[#e0f2fe]/85 border-[#38bdf8]'
  },
  {
    id: 'volcano',
    name: 'Volkan Tapınağı',
    subtitle: 'Kızgın lav taşları ve ateşli kombolar',
    mechanicTitle: '2-Kat Zırhlı Kaya',
    mechanicDesc: 'Sert lav taşları ilk temizlikte çatlar, ikincide patlar!',
    primaryObstacle: 'stone',
    blockTheme: 'dojo',
    mapBgImage: 'assets/bg_biome_volcano.jpg',
    playBgImage: 'assets/bg_biome_volcano.jpg',
    skyGradient: 'from-orange-500/15 via-transparent to-[#240502]/55',
    mapOverlayGradient: 'from-orange-950/15 via-transparent to-[#210502]/55',
    boardFrameClass: 'border-[#450a0a] bg-gradient-to-b from-[#f97316] via-[#991b1b] to-[#290906]',
    boardInnerColor: 'bg-[#2a0905]/95',
    accentColor: '#fb923c',
    badgeClass: 'bg-orange-600/95 text-white border-amber-300',
    pedestalLockedClass: 'pedestal-volcano-locked',
    pedestalUnlockedClass: 'pedestal-volcano-done',
    pedestalCurrentClass: 'pedestal-volcano-current',
    roadStrokeColor: '#fb923c',
    roadGlowColor: 'rgba(249,115,22,0.75)',
    ribbonClass: 'bg-gradient-to-b from-[#b91c1c] via-[#7f1d1d] to-[#450a0a] border-2 border-[#fdba74] text-[#fff7ed] shadow-xl',
    hudCardClass: 'bg-gradient-to-b from-[#3b150e] via-[#260b07] to-[#1a0503] border-[2.5px] border-[#fb923c] shadow-xl',
    hudTitleTextClass: 'text-[#fff7ed]',
    hudSubTextClass: 'text-[#fdba74]',
    mechanicBarClass: 'bg-[#2b0904]/90 border-[#fb923c]/65 text-[#ffedd5]',
    panelClass: 'biome-panel-volcano',
    dockFadeClass: 'from-[#1a0503] via-[#2b0905]/90 to-transparent',
    traySlotBgClass: 'bg-[#45130d]/85 border-[#ea580c]',
    isDarkTheme: true
  },
  {
    id: 'crystal_cave',
    name: 'Kristal Mağara',
    subtitle: 'Prizma kesimli cevherler ve enerji odakları',
    mechanicTitle: 'Prizma Lazeri',
    mechanicDesc: 'Prizma küpü kırılınca tahtadaki 2 engeli lazerle vurur!',
    primaryObstacle: 'prism',
    blockTheme: 'crystal',
    mapBgImage: 'assets/bg_biome_crystal.jpg',
    playBgImage: 'assets/bg_biome_crystal.jpg',
    skyGradient: 'from-purple-500/15 via-transparent to-[#130524]/55',
    mapOverlayGradient: 'from-purple-950/15 via-transparent to-[#140529]/55',
    boardFrameClass: 'border-[#4c1d95] bg-gradient-to-b from-[#d946ef] via-[#7e22ce] to-[#2e1065]',
    boardInnerColor: 'bg-[#1d0836]/95',
    accentColor: '#e879f9',
    badgeClass: 'bg-purple-600/95 text-white border-fuchsia-200',
    pedestalLockedClass: 'pedestal-crystal-locked',
    pedestalUnlockedClass: 'pedestal-crystal-done',
    pedestalCurrentClass: 'pedestal-crystal-current',
    roadStrokeColor: '#f0abfc',
    roadGlowColor: 'rgba(232,121,249,0.75)',
    ribbonClass: 'bg-gradient-to-b from-[#7e22ce] via-[#581c87] to-[#2e1065] border-2 border-[#f0abfc] text-[#fdf4ff] shadow-xl',
    hudCardClass: 'bg-gradient-to-b from-[#2e1065] via-[#1e0845] to-[#12042b] border-[2.5px] border-[#e879f9] shadow-xl',
    hudTitleTextClass: 'text-[#fdf4ff]',
    hudSubTextClass: 'text-[#f0abfc]',
    mechanicBarClass: 'bg-[#240747]/90 border-[#e879f9]/65 text-[#fae8ff]',
    panelClass: 'biome-panel-crystal_cave',
    dockFadeClass: 'from-[#12042b] via-[#1f0845]/90 to-transparent',
    traySlotBgClass: 'bg-[#3b0764]/85 border-[#c084fc]',
    isDarkTheme: true
  },
  {
    id: 'dojo_peak',
    name: 'Sakura Dojo Zirvesi',
    subtitle: 'Ustaların altın varaklı ahşap arenası',
    mechanicTitle: 'Dojo Kalkanı',
    mechanicDesc: 'Altın çerçeveli dojo küpleri ve çift katmanlı kalkan taşları!',
    primaryObstacle: 'stone',
    blockTheme: 'dojo',
    mapBgImage: 'assets/bg_biome_dojo.jpg',
    playBgImage: 'assets/bg_biome_dojo.jpg',
    skyGradient: 'from-rose-300/15 via-transparent to-[#2e0b16]/45',
    mapOverlayGradient: 'from-rose-950/10 via-transparent to-[#2b0913]/45',
    boardFrameClass: 'border-[#881337] bg-gradient-to-b from-[#fb7185] via-[#9f1239] to-[#4c0519]',
    boardInnerColor: 'bg-[#2e0b15]/95',
    accentColor: '#fb7185',
    badgeClass: 'bg-rose-600/95 text-white border-rose-200',
    pedestalLockedClass: 'pedestal-dojo-locked',
    pedestalUnlockedClass: 'pedestal-dojo-done',
    pedestalCurrentClass: 'pedestal-dojo-current',
    roadStrokeColor: '#fbcfe8',
    roadGlowColor: 'rgba(251,113,133,0.65)',
    ribbonClass: 'bg-gradient-to-b from-[#be123c] via-[#9f1239] to-[#4c0519] border-2 border-[#fde047] text-[#fff1f2] shadow-xl',
    hudCardClass: 'bg-gradient-to-b from-[#fff5f7] via-[#ffe4ea] to-[#fecdd3] border-[2.5px] border-[#be123c] shadow-xl',
    hudTitleTextClass: 'text-[#680923]',
    hudSubTextClass: 'text-[#9f1239]',
    mechanicBarClass: 'bg-[#4c0519]/90 border-[#fda4af]/70 text-[#ffe4e6]',
    panelClass: 'biome-panel-dojo_peak',
    dockFadeClass: 'from-[#2e0512] via-[#4c0519]/90 to-transparent',
    traySlotBgClass: 'bg-[#ffe4ea]/85 border-[#fb7185]'
  },
  {
    id: 'desert',
    name: 'Altın Çöl Piramidi',
    subtitle: 'Güneş tapınağı blokları ve sönmeyen köz',
    mechanicTitle: 'Sönmeyen Köz',
    mechanicDesc: 'Sayacı bitmeden temizle! Patlayınca 3×3 alan açar.',
    primaryObstacle: 'ember',
    blockTheme: 'candy',
    mapBgImage: 'assets/bg_biome_desert.jpg',
    playBgImage: 'assets/bg_biome_desert.jpg',
    skyGradient: 'from-amber-300/15 via-transparent to-[#361e04]/45',
    mapOverlayGradient: 'from-amber-950/10 via-transparent to-[#2e1a03]/45',
    boardFrameClass: 'border-[#78350f] bg-gradient-to-b from-[#fde047] via-[#d97706] to-[#78350f]',
    boardInnerColor: 'bg-[#452305]/95',
    accentColor: '#facc15',
    badgeClass: 'bg-amber-600/95 text-white border-yellow-200',
    pedestalLockedClass: 'pedestal-desert-locked',
    pedestalUnlockedClass: 'pedestal-desert-done',
    pedestalCurrentClass: 'pedestal-desert-current',
    roadStrokeColor: '#fef08a',
    roadGlowColor: 'rgba(250,204,21,0.65)',
    ribbonClass: 'bg-gradient-to-b from-[#d97706] via-[#b45309] to-[#78350f] border-2 border-[#fef08a] text-[#fffbeb] shadow-xl',
    hudCardClass: 'bg-gradient-to-b from-[#fefce8] via-[#fef08a] to-[#fde047] border-[2.5px] border-[#b45309] shadow-xl',
    hudTitleTextClass: 'text-[#522402]',
    hudSubTextClass: 'text-[#92400e]',
    mechanicBarClass: 'bg-[#451a03]/90 border-[#fcd34d]/70 text-[#fef3c7]',
    panelClass: 'biome-panel-desert',
    dockFadeClass: 'from-[#2e1402] via-[#451a03]/90 to-transparent',
    traySlotBgClass: 'bg-[#fef3c7]/85 border-[#f59e0b]'
  },
  {
    id: 'cyber_city',
    name: 'Siber Neon Şehir',
    subtitle: 'Elektrikli devre küpleri ve çekirdek arkları',
    mechanicTitle: 'Enerji Çekirdeği',
    mechanicDesc: 'Enerji küpünü patlatınca yakındaki bloklara yıldırım sıçrar!',
    primaryObstacle: 'spark',
    blockTheme: 'crystal',
    skyGradient: 'from-cyan-400/15 via-transparent to-[#020f1c]/60',
    mapOverlayGradient: 'from-cyan-950/20 via-transparent to-[#020a17]/60',
    boardFrameClass: 'border-[#0e7490] bg-gradient-to-b from-[#22d3ee] via-[#0284c7] to-[#0f172a]',
    boardInnerColor: 'bg-[#061829]/95',
    accentColor: '#22d3ee',
    badgeClass: 'bg-cyan-600/95 text-white border-cyan-200',
    pedestalLockedClass: 'pedestal-cyber-locked',
    pedestalUnlockedClass: 'pedestal-cyber-done',
    pedestalCurrentClass: 'pedestal-cyber-current',
    roadStrokeColor: '#67e8f9',
    roadGlowColor: 'rgba(34,211,238,0.85)',
    ribbonClass: 'bg-gradient-to-b from-[#0891b2] via-[#0e7490] to-[#0f172a] border-2 border-[#67e8f9] text-[#ecfeff] shadow-xl',
    hudCardClass: 'bg-gradient-to-b from-[#0f172a] via-[#082f49] to-[#020617] border-[2.5px] border-[#22d3ee] shadow-xl',
    hudTitleTextClass: 'text-[#ecfeff]',
    hudSubTextClass: 'text-[#67e8f9]',
    mechanicBarClass: 'bg-[#041826]/90 border-[#22d3ee]/70 text-[#cffafe]',
    panelClass: 'biome-panel-cyber_city',
    dockFadeClass: 'from-[#020617] via-[#041826]/90 to-transparent',
    traySlotBgClass: 'bg-[#082f49]/85 border-[#22d3ee]',
    isDarkTheme: true
  },
  {
    id: 'cosmos',
    name: 'Yıldız Kozmosu',
    subtitle: 'Galaksi blokları ve kozmik güç çekirdekleri',
    mechanicTitle: 'Kozmik Karma',
    mechanicDesc: 'Prizma, Köz Bombası, Zırhlı Kaya ve Enerji bir arada!',
    primaryObstacle: 'spark',
    blockTheme: 'candy',
    skyGradient: 'from-indigo-500/20 via-transparent to-[#050314]/65',
    mapOverlayGradient: 'from-indigo-950/20 via-transparent to-[#050314]/65',
    boardFrameClass: 'border-[#312e81] bg-gradient-to-b from-[#818cf8] via-[#4338ca] to-[#1e1b4b]',
    boardInnerColor: 'bg-[#0e0b2b]/95',
    accentColor: '#818cf8',
    badgeClass: 'bg-indigo-600/95 text-white border-indigo-200',
    pedestalLockedClass: 'pedestal-cosmos-locked',
    pedestalUnlockedClass: 'pedestal-cosmos-done',
    pedestalCurrentClass: 'pedestal-cosmos-current',
    roadStrokeColor: '#fde047',
    roadGlowColor: 'rgba(167,139,250,0.8)',
    ribbonClass: 'bg-gradient-to-b from-[#4f46e5] via-[#312e81] to-[#1e1b4b] border-2 border-[#c4b5fd] text-[#eef2ff] shadow-xl',
    hudCardClass: 'bg-gradient-to-b from-[#1e1b4b] via-[#131036] to-[#08061d] border-[2.5px] border-[#a5b4fc] shadow-xl',
    hudTitleTextClass: 'text-[#eef2ff]',
    hudSubTextClass: 'text-[#c7d2fe]',
    mechanicBarClass: 'bg-[#0e0a29]/90 border-[#818cf8]/70 text-[#e0e7ff]',
    panelClass: 'biome-panel-cosmos',
    dockFadeClass: 'from-[#050314] via-[#0e0a29]/90 to-transparent',
    traySlotBgClass: 'bg-[#1e1b4b]/85 border-[#818cf8]',
    isDarkTheme: true
  }
];

export const BIOME_MAP: Record<BiomeId, BiomeConfig> = BIOMES.reduce(
  (acc, b) => {
    acc[b.id] = b;
    return acc;
  },
  {} as Record<BiomeId, BiomeConfig>
);

export const LEVELS_PER_CHAPTER = 15;
export const TOTAL_CHAPTERS = 80; // 80 chapters * 15 levels = 1,200 levels!
export const TOTAL_LEVELS = LEVELS_PER_CHAPTER * TOTAL_CHAPTERS;

export function getBiomeForLevel(levelId: number): BiomeConfig {
  const safeId = Math.max(1, Math.min(TOTAL_LEVELS, levelId));
  const chapterIndex = Math.floor((safeId - 1) / LEVELS_PER_CHAPTER);
  return BIOMES[chapterIndex % BIOMES.length];
}

export function getChapterIndexForLevel(levelId: number): number {
  const safeId = Math.max(1, Math.min(TOTAL_LEVELS, levelId));
  return Math.floor((safeId - 1) / LEVELS_PER_CHAPTER);
}
