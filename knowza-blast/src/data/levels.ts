import { CubeColor, LevelConfig } from '../types/game';
import {
  BIOMES,
  LEVELS_PER_CHAPTER,
  TOTAL_LEVELS,
  getBiomeForLevel
} from './biomes';

const BASE_4: CubeColor[] = ['blue', 'yellow', 'red', 'green'];
const ALL_5: CubeColor[] = ['blue', 'yellow', 'red', 'green', 'purple'];

const CHAPTER_STAGE_NAMES: Record<string, string[]> = {
  forest: ['Orman Kapısı', 'Yosun Patikası', 'Zümrüt Geçit', 'Şelale Köprüsü', 'Kadim Meydan'],
  glacier: ['Kar Tepesi', 'Donmuş Göl', 'Buzul Mağarası', 'Kuzey Işığı', 'Kristal Taht'],
  volcano: ['Köz Patikası', 'Lav Nehri', 'Obsidyen Kapı', 'Ateş Çemberi', 'Volkan Zirvesi'],
  crystal_cave: ['Ametist Tüneli', 'Prizma Salonu', 'Cevher Havuzu', 'Yankı Galerisi', 'Elmas Kalp'],
  dojo_peak: ['Sakura Bahçesi', 'Bambu Yolu', 'Dojo Avlusu', 'Usta Salonu', 'Altın Kuşak'],
  desert: ['Kum Tepesi', 'Vaha Kapısı', 'Güneş Tapınağı', 'Sfenks Geçidi', 'Büyük Piramit'],
  cyber_city: ['Neon Bulvarı', 'Devre Köprüsü', 'Enerji Kulesi', 'Lazer Meydanı', 'Çekirdek Merkezi'],
  cosmos: ['Yörünge Kapısı', 'Nebula Yolu', 'Meteor Kuşağı', 'Yıldız Sarayı', 'Galaksi Finali']
};

export function generateLevelConfig(id: number): LevelConfig {
  const safeId = Math.max(1, Math.min(TOTAL_LEVELS, Math.floor(id)));
  const biome = getBiomeForLevel(safeId);
  const localIdx = (safeId - 1) % LEVELS_PER_CHAPTER; // 0..14 within biome chapter
  const tier = Math.floor((safeId - 1) / (LEVELS_PER_CHAPTER * BIOMES.length)) + 1; // 1..10 full world cycles

  const colors = safeId <= 8 ? BASE_4 : ALL_5;
  const stageList = CHAPTER_STAGE_NAMES[biome.id] || ['Bölüm'];
  const stageName = stageList[Math.floor(localIdx / 3) % stageList.length];
  const tierTag = tier > 1 ? ` • Aşama ${tier}` : '';

  // Smooth scaling across 1,200 levels so early levels feel snappy & later tiers offer deeper targets
  const c1 = colors[(safeId + 0) % colors.length];
  const c2 = colors[(safeId + 1) % colors.length];
  const c3 = colors[(safeId + 3) % colors.length];

  const baseQty =
    safeId === 1
      ? 6
      : safeId <= 5
      ? 8 + safeId
      : Math.min(28, 8 + Math.floor(localIdx * 0.65) + (tier - 1) * 2);

  const targets: LevelConfig['targets'] = {
    [c1]: baseQty,
    [c2]: baseQty,
    [c3]: Math.max(6, baseQty - 2)
  };

  let obstaclePreset: LevelConfig['obstaclePreset'] = 'none';
  if (safeId === 1 || safeId === 2) {
    obstaclePreset = 'none';
  } else if (biome.id === 'forest') {
    obstaclePreset = localIdx % 2 === 0 ? 'crates_side' : 'crates_mid';
    targets.crate = Math.min(8, 3 + Math.floor(localIdx / 4) + Math.floor((tier - 1) / 2));
  } else if (biome.id === 'glacier') {
    obstaclePreset = localIdx % 2 === 0 ? 'ice_center' : 'ice_checker';
    targets.ice = Math.min(8, 3 + Math.floor(localIdx / 4) + Math.floor((tier - 1) / 2));
  } else if (biome.id === 'volcano' || biome.id === 'dojo_peak') {
    obstaclePreset = localIdx % 3 === 0 ? 'crates_mid' : 'stone_guard';
    targets.stone = Math.min(6, 2 + Math.floor(localIdx / 5) + Math.floor((tier - 1) / 3));
  } else if (biome.id === 'crystal_cave') {
    obstaclePreset = localIdx % 2 === 0 ? 'ice_checker' : 'castle_fort';
    targets.ice = Math.min(7, 3 + Math.floor(localIdx / 5));
    if (localIdx >= 6) targets.crate = 3;
  } else if (biome.id === 'desert') {
    obstaclePreset = localIdx % 2 === 0 ? 'castle_fort' : 'stone_guard';
    targets.crate = Math.min(6, 3 + Math.floor(localIdx / 5));
    targets.stone = Math.min(4, 2 + Math.floor(localIdx / 7));
  } else if (biome.id === 'cyber_city') {
    obstaclePreset = 'spark_grid';
    targets.spark = Math.min(7, 3 + Math.floor(localIdx / 4) + Math.floor((tier - 1) / 2));
  } else {
    obstaclePreset = 'cosmos_mix';
    targets.stone = 2 + Math.floor(localIdx / 6);
    targets.spark = 3 + Math.floor(localIdx / 5);
  }

  return {
    id: safeId,
    name: safeId === 1 ? 'Blok Başlangıcı' : `${stageName}${tierTag}`,
    subtitle: `${biome.name}: ${biome.mechanicDesc}`,
    biomeId: biome.id,
    moves: Math.min(18, 3 + Math.floor(localIdx / 2) + tier),
    colors,
    targets,
    obstaclePreset,
    rewards: {
      stars: 25 + Math.min(150, Math.floor(safeId * 0.4) + localIdx * 2),
      coins: 100 + Math.min(800, safeId * 2 + localIdx * 10),
      xp: 80 + Math.min(450, safeId + localIdx * 6)
    }
  };
}

export const LEVELS: LevelConfig[] = Array.from({ length: TOTAL_LEVELS }, (_, idx) =>
  generateLevelConfig(idx + 1)
);

export function getLevelConfig(id: number): LevelConfig {
  const safeIdx = Math.max(0, Math.min(TOTAL_LEVELS - 1, Math.floor(id) - 1));
  return LEVELS[safeIdx];
}

export function getLevelsByChapter(chapterIdx: number): LevelConfig[] {
  const start = chapterIdx * LEVELS_PER_CHAPTER;
  return LEVELS.slice(start, start + LEVELS_PER_CHAPTER);
}
