import { describe, expect, it } from 'vitest';
import { BIOMES, LEVELS_PER_CHAPTER, TOTAL_CHAPTERS, TOTAL_LEVELS, getBiomeForLevel } from '../../data/biomes';
import { ACCESSORY_CATALOG, BLOCK_THEME_CATALOG, OUTFIT_CATALOG } from '../../data/customization';
import { LEVELS, getLevelConfig, getLevelsByChapter } from '../../data/levels';
import {
  INITIAL_PROGRESS,
  addXpToProgress,
  applyHeartRegen,
  ensurePlayerIdentity,
  syncDailyQuests,
  xpForNextLevel
} from '../storage';
import {
  getWinStreakCoinMultiplier,
  getWinStreakInfo,
  getWinStreakStartBoosters,
  getWinStreakTier
} from '../winStreak';

describe('Knowza Blast Levels & Progression', () => {
  it('defines 1200 progressive levels across 8 biomes and 80 chapters with valid targets & rewards', () => {
    expect(TOTAL_LEVELS).toBe(1200);
    expect(BIOMES).toHaveLength(8);
    expect(LEVELS).toHaveLength(1200);

    const seenBiomes = new Set<string>();
    LEVELS.forEach((lvl, idx) => {
      expect(lvl.id).toBe(idx + 1);
      expect(lvl.biomeId).toBe(getBiomeForLevel(lvl.id).id);
      seenBiomes.add(lvl.biomeId);
      expect(lvl.moves).toBeGreaterThanOrEqual(1);
      expect(lvl.colors.length).toBeGreaterThanOrEqual(4);
      expect(Object.keys(lvl.targets).length).toBeGreaterThanOrEqual(2);
      expect(lvl.rewards.coins).toBeGreaterThan(0);
      expect(lvl.rewards.stars).toBeGreaterThan(0);
      expect(lvl.rewards.xp).toBeGreaterThan(0);
    });
    expect(seenBiomes.size).toBe(8);

    for (const ch of [0, 1, 7, 39, TOTAL_CHAPTERS - 1]) {
      const slice = getLevelsByChapter(ch);
      expect(slice).toHaveLength(LEVELS_PER_CHAPTER);
    }
    expect(getLevelConfig(1200).rewards.coins).toBeGreaterThan(getLevelConfig(1).rewards.coins);

    // Every biome has unique theme tokens, pedestals, and either photo or bespoke vector world art
    const pedestalSets = new Set(BIOMES.map((b) => b.pedestalLockedClass));
    expect(pedestalSets.size).toBe(8);
    expect(BIOMES[1].mapBgImage).toBe('assets/bg_biome_glacier.jpg');
    expect(BIOMES[2].mapBgImage).toBe('assets/bg_biome_volcano.jpg');
    expect(BIOMES[3].mapBgImage).toBe('assets/bg_biome_crystal.jpg');
    expect(BIOMES[4].mapBgImage).toBe('assets/bg_biome_dojo.jpg');
    expect(BIOMES[5].mapBgImage).toBe('assets/bg_biome_desert.jpg');
    expect(getLevelConfig(5).targets.boss).toBe(1);
    expect(getLevelConfig(76).targets.ember).toBeGreaterThanOrEqual(1);
    expect(getLevelConfig(46).targets.prism).toBeGreaterThanOrEqual(1);
  });

  it('addXpToProgress levels up cleanly and carries overflow XP', () => {
    const needed = xpForNextLevel(1);
    const updated = addXpToProgress(INITIAL_PROGRESS, needed + 45);
    expect(updated.level).toBe(2);
    expect(updated.xp).toBe(45);
  });

  it('applyHeartRegen regenerates hearts up to maxHearts over time', () => {
    const depleted = {
      ...INITIAL_PROGRESS,
      hearts: 2,
      lastHeartUpdate: Date.now() - 32 * 60 * 1000 // 32 mins ago -> +2 hearts
    };
    const regen = applyHeartRegen(depleted);
    expect(regen.hearts).toBe(4);

    const longAgo = {
      ...INITIAL_PROGRESS,
      hearts: 1,
      lastHeartUpdate: Date.now() - 5 * 60 * 60 * 1000
    };
    expect(applyHeartRegen(longAgo).hearts).toBe(INITIAL_PROGRESS.maxHearts);
  });

  it('provides valid outfit, accessory, and block theme catalogs including Karate style', () => {
    expect(OUTFIT_CATALOG.some((o) => o.id === 'karate')).toBe(true);
    expect(ACCESSORY_CATALOG.some((a) => a.id === 'bandana')).toBe(true);
    expect(BLOCK_THEME_CATALOG.length).toBeGreaterThanOrEqual(4);
    expect(INITIAL_PROGRESS.unlockedOutfits).toContain('karate');
    expect(INITIAL_PROGRESS.unlockedBlockThemes).toContain('crystal');
  });

  it('computes Win Streak tiers, free start boosters, and coin multipliers accurately', () => {
    expect(INITIAL_PROGRESS.winStreak).toBe(0);
    expect(getWinStreakTier(0)).toBe(0);
    expect(getWinStreakStartBoosters(0)).toEqual([]);
    expect(getWinStreakCoinMultiplier(0)).toBe(1);

    expect(getWinStreakTier(1)).toBe(1);
    expect(getWinStreakStartBoosters(1)).toEqual(['rocket']);

    expect(getWinStreakTier(2)).toBe(2);
    expect(getWinStreakStartBoosters(2)).toEqual(['rocket', 'bomb']);
    expect(getWinStreakCoinMultiplier(2)).toBe(1.1);

    expect(getWinStreakTier(5)).toBe(3);
    expect(getWinStreakStartBoosters(5)).toEqual(['rocket', 'bomb']);
    expect(getWinStreakCoinMultiplier(5)).toBe(1.25);
    expect(getWinStreakInfo(3).title).toBe('Efsanevi Seri');
  });

  it('syncDailyQuests refreshes daily quests on a new calendar date and preserves active winStreak', () => {
    const yesterday = {
      ...INITIAL_PROGRESS,
      winStreak: 2,
      lastQuestRefreshDate: '2026-11-20',
      quests: INITIAL_PROGRESS.quests.map((q) => ({ ...q, progress: q.target, claimed: true }))
    };
    const refreshed = syncDailyQuests(yesterday, '2026-11-21');
    expect(refreshed.lastQuestRefreshDate).toBe('2026-11-21');
    expect(refreshed.quests.some((q) => q.type === 'win_streak')).toBe(true);
    const streakQuest = refreshed.quests.find((q) => q.type === 'win_streak')!;
    expect(streakQuest.progress).toBe(2);
    expect(streakQuest.claimed).toBe(false);

    // Also verifies playerId/inviteCode generation and daily event/daily-challenge rollover
    const withId = ensurePlayerIdentity(refreshed);
    expect(withId.playerId).toBeTruthy();
    expect(withId.inviteCode).toMatch(/^KB-/);

    const rolled = syncDailyQuests(
      {
        ...withId,
        dailyChallengeDate: '2026-11-21',
        dailyChallengeBest: 850,
        eventProgressDate: '2026-11-21',
        eventLinesProgress: 18,
        eventClaimedTiers: [1, 2]
      },
      '2026-11-22'
    );
    expect(rolled.dailyChallengeBest).toBe(0);
    expect(rolled.eventLinesProgress).toBe(0);
    expect(rolled.eventClaimedTiers).toEqual([]);
  });
});
