import { describe, expect, it } from 'vitest';
import { ACCESSORY_CATALOG, BLOCK_THEME_CATALOG, OUTFIT_CATALOG } from '../../data/customization';
import { LEVELS } from '../../data/levels';
import { INITIAL_PROGRESS, addXpToProgress, applyHeartRegen, xpForNextLevel } from '../storage';

describe('Knowza Blast Levels & Progression', () => {
  it('defines 30 progressive levels with valid moves, colors, targets, and rewards', () => {
    expect(LEVELS).toHaveLength(30);
    LEVELS.forEach((lvl, idx) => {
      expect(lvl.id).toBe(idx + 1);
      expect(lvl.moves).toBeGreaterThanOrEqual(1);
      expect(lvl.colors.length).toBeGreaterThanOrEqual(4);
      expect(Object.keys(lvl.targets).length).toBeGreaterThanOrEqual(2);
      expect(lvl.rewards.coins).toBeGreaterThan(0);
      expect(lvl.rewards.stars).toBeGreaterThan(0);
      expect(lvl.rewards.xp).toBeGreaterThan(0);
    });
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
});
