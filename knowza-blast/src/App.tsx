import React, { useEffect, useState } from 'react';
import { LEVELS } from './data/levels';
import {
  AccessoryId,
  BlockThemeId,
  InventoryBooster,
  LevelConfig,
  OutfitId,
  PlayerProgress
} from './types/game';
import { sfx } from './utils/sound';
import {
  addXpToProgress,
  applyHeartRegen,
  loadProgress,
  saveProgress
} from './utils/storage';
import { TopHud } from './components/TopHud';
import { HomeMenuScreen } from './components/HomeMenuScreen';
import { WorldMapScreen } from './components/WorldMapScreen';
import { HybridGameScreen } from './components/HybridGameScreen';
import { EndlessBlockScreen } from './components/EndlessBlockScreen';
import { WardrobeModal } from './components/WardrobeModal';
import {
  BoosterDetailModal,
  CastleModal,
  DailyLoginModal,
  FailModal,
  LevelIntroModal,
  ProfileModal,
  QuestsModal,
  SettingsModal,
  ShopModal,
  VictoryModal
} from './components/GameModals';

type Screen = 'home' | 'map' | 'game' | 'endless';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<PlayerProgress>(() => loadProgress());
  const [screen, setScreen] = useState<Screen>('home');
  const [activeLevel, setActiveLevel] = useState<LevelConfig>(LEVELS[0]);
  const [selectedStartBoosters, setSelectedStartBoosters] = useState<('rocket' | 'bomb')[]>([]);
  const [externalArmBooster, setExternalArmBooster] = useState<InventoryBooster | null>(null);
  const [gameRunKey, setGameRunKey] = useState(1);
  const [bonusMovesCount, setBonusMovesCount] = useState(0);

  // Modals
  const [introLevel, setIntroLevel] = useState<LevelConfig | null>(null);
  const [victoryInfo, setVictoryInfo] = useState<{ stars: number; bonusCoins: number } | null>(null);
  const [showFailModal, setShowFailModal] = useState(false);
  const [shopModalTab, setShopModalTab] = useState<'boosters' | 'coins' | null>(null);
  const [boosterDetail, setBoosterDetail] = useState<InventoryBooster | null>(null);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCastleModal, setShowCastleModal] = useState(false);
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);

  useEffect(() => {
    sfx.enabled = progress.soundEnabled;
    sfx.hapticsEnabled = progress.hapticsEnabled;
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => applyHeartRegen(prev));
    }, 5000);
    return () => clearInterval(id);
  }, []);

  const updateProgress = (updater: (prev: PlayerProgress) => PlayerProgress) => {
    setProgress((prev) => {
      const next = updater(prev);
      const badges = new Set(next.badges);
      if (next.unlockedLevel > 1) badges.add('first_win');
      if (next.highBlockScore >= 500) badges.add('block_master');
      if (next.totalCubesBlasted >= 300) badges.add('pop_legend');
      if (next.totalLinesCleared >= 10) badges.add('line_king');
      if (next.unlockedLevel >= 10) badges.add('academy_hero');
      return { ...next, badges: Array.from(badges) };
    });
  };

  const startLevel = (lvl: LevelConfig, startBoosters: ('rocket' | 'bomb')[] = []) => {
    if (progress.hearts <= 0) {
      setIntroLevel(null);
      setShopModalTab('coins');
      return;
    }
    if (startBoosters.length > 0) {
      updateProgress((p) => {
        const nextBoosters = { ...p.boosters };
        startBoosters.forEach((sb) => {
          nextBoosters[sb] = Math.max(0, (nextBoosters[sb] || 0) - 1);
        });
        return { ...p, boosters: nextBoosters };
      });
    }
    setActiveLevel(lvl);
    setSelectedStartBoosters(startBoosters);
    setIntroLevel(null);
    setVictoryInfo(null);
    setShowFailModal(false);
    setBonusMovesCount(0);
    setGameRunKey((k) => k + 1);
    setScreen('game');
  };

  const handleUseBooster = (type: InventoryBooster) => {
    updateProgress((p) => ({
      ...p,
      boosters: { ...p.boosters, [type]: Math.max(0, (p.boosters[type] || 0) - 1) }
    }));
  };

  const handleProgressStats = (delta: {
    cubesBlasted?: number;
    linesCleared?: number;
    boostersUsed?: number;
  }) => {
    updateProgress((p) => {
      const nextQuests = p.quests.map((q) => {
        if (q.type === 'blast_cubes' && delta.cubesBlasted) {
          return { ...q, progress: q.progress + delta.cubesBlasted };
        }
        if (q.type === 'clear_lines' && delta.linesCleared) {
          return { ...q, progress: q.progress + delta.linesCleared };
        }
        return q;
      });
      return {
        ...p,
        totalCubesBlasted: p.totalCubesBlasted + (delta.cubesBlasted || 0),
        totalLinesCleared: p.totalLinesCleared + (delta.linesCleared || 0),
        quests: nextQuests
      };
    });
  };

  const handleWin = (starsEarned: number, remainingMoves: number) => {
    const bonusCoins = Math.max(0, remainingMoves * 10);
    setVictoryInfo({ stars: starsEarned, bonusCoins });
    updateProgress((p) => {
      const prevStars = p.levelStars[activeLevel.id] || 0;
      const withXp = addXpToProgress(p, activeLevel.rewards.xp);
      const nextQuests = withXp.quests.map((q) =>
        q.type === 'win_levels' ? { ...q, progress: q.progress + 1 } : q
      );
      return {
        ...withXp,
        stars: withXp.stars + activeLevel.rewards.stars,
        coins: withXp.coins + activeLevel.rewards.coins + bonusCoins,
        unlockedLevel: Math.min(LEVELS.length, Math.max(withXp.unlockedLevel, activeLevel.id + 1)),
        levelStars: {
          ...withXp.levelStars,
          [activeLevel.id]: Math.max(prevStars, starsEarned)
        },
        quests: nextQuests
      };
    });
  };

  const handleFail = () => {
    setShowFailModal(true);
    updateProgress((p) => ({
      ...p,
      hearts: Math.max(0, p.hearts - 1),
      lastHeartUpdate: p.hearts === p.maxHearts ? Date.now() : p.lastHeartUpdate
    }));
  };

  const handleBuyMoves = () => {
    if (progress.coins < 150) return;
    updateProgress((p) => ({
      ...p,
      coins: p.coins - 150,
      hearts: Math.min(p.maxHearts, p.hearts + 1)
    }));
    setShowFailModal(false);
    setBonusMovesCount((c) => c + 1);
  };

  const handleBuyBooster = (type: InventoryBooster, price: number) => {
    if (progress.coins < price) return;
    updateProgress((p) => ({
      ...p,
      coins: p.coins - price,
      boosters: { ...p.boosters, [type]: (p.boosters[type] || 0) + 1 }
    }));
  };

  const handleEndlessGameOver = (score: number, linesCleared: number) => {
    const coinsReward = Math.max(15, Math.floor(score / 25));
    const starsReward = Math.max(5, Math.floor(score / 80));
    updateProgress((p) => {
      const withXp = addXpToProgress(p, Math.min(120, Math.max(20, Math.floor(score / 15))));
      const nextQuests = withXp.quests.map((q) =>
        q.type === 'clear_lines' ? { ...q, progress: q.progress + linesCleared } : q
      );
      return {
        ...withXp,
        highBlockScore: Math.max(withXp.highBlockScore, score),
        totalLinesCleared: withXp.totalLinesCleared + linesCleared,
        coins: withXp.coins + coinsReward,
        stars: withXp.stars + starsReward,
        quests: nextQuests
      };
    });
  };

  const handleSelectOrBuyOutfit = (id: OutfitId, price: number) => {
    updateProgress((p) => {
      if (p.unlockedOutfits.includes(id)) {
        return { ...p, equippedOutfit: id };
      }
      if (p.coins < price) return p;
      return {
        ...p,
        coins: p.coins - price,
        unlockedOutfits: [...p.unlockedOutfits, id],
        equippedOutfit: id
      };
    });
  };

  const handleSelectOrBuyAccessory = (id: AccessoryId, price: number) => {
    updateProgress((p) => {
      if (p.unlockedAccessories.includes(id)) {
        return { ...p, equippedAccessory: id };
      }
      if (p.coins < price) return p;
      return {
        ...p,
        coins: p.coins - price,
        unlockedAccessories: [...p.unlockedAccessories, id],
        equippedAccessory: id
      };
    });
  };

  const handleSelectOrBuyBlockTheme = (id: BlockThemeId, price: number) => {
    updateProgress((p) => {
      if (p.unlockedBlockThemes.includes(id)) {
        return { ...p, equippedBlockTheme: id };
      }
      if (p.coins < price) return p;
      return {
        ...p,
        coins: p.coins - price,
        unlockedBlockThemes: [...p.unlockedBlockThemes, id],
        equippedBlockTheme: id
      };
    });
  };

  const nextLevelObj = LEVELS.find((l) => l.id === activeLevel.id + 1);

  return (
    <div className="w-full h-full bg-[#1e0e04] flex justify-center overflow-hidden">
      <div className="w-full max-w-[440px] h-full flex flex-col relative overflow-hidden bg-[#2b1405] shadow-[0_0_50px_rgba(0,0,0,0.75)] sm:border-x-2 sm:border-[#5a3010]">
        {/* Persistent Floating Top HUD */}
        {screen !== 'endless' && (
          <TopHud
            progress={progress}
            mode={screen === 'game' ? 'game' : screen === 'map' ? 'map' : 'home'}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenShop={(tab = 'boosters') => setShopModalTab(tab)}
            onOpenQuests={() => setShowQuestsModal(true)}
            onOpenSettings={() => setShowSettingsModal(true)}
          />
        )}

        {/* Active Screen */}
        {screen === 'home' && (
          <HomeMenuScreen
            progress={progress}
            onPlayCurrent={(lvl) => setIntroLevel(lvl)}
            onOpenMap={() => setScreen('map')}
            onOpenEndless={() => setScreen('endless')}
            onOpenWardrobe={() => setShowWardrobeModal(true)}
            onOpenQuests={() => setShowQuestsModal(true)}
            onOpenDaily={() => setShowDailyModal(true)}
            onOpenShop={() => setShopModalTab('boosters')}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenCastle={() => setShowCastleModal(true)}
          />
        )}

        {screen === 'map' && (
          <WorldMapScreen
            progress={progress}
            onBackHome={() => setScreen('home')}
            onSelectLevel={(lvl) => setIntroLevel(lvl)}
            onOpenEndless={() => setScreen('endless')}
            onOpenWardrobe={() => setShowWardrobeModal(true)}
            onOpenQuests={() => setShowQuestsModal(true)}
            onOpenDaily={() => setShowDailyModal(true)}
            onOpenShop={() => setShopModalTab('boosters')}
            onOpenProfile={() => setShowProfileModal(true)}
            onOpenCastle={() => setShowCastleModal(true)}
          />
        )}

        {screen === 'game' && (
          <HybridGameScreen
            key={`${activeLevel.id}_${gameRunKey}`}
            level={activeLevel}
            progress={progress}
            startBoosters={selectedStartBoosters}
            bonusMovesCount={bonusMovesCount}
            externalArmBooster={externalArmBooster}
            onClearExternalArm={() => setExternalArmBooster(null)}
            onPause={() => setShowSettingsModal(true)}
            onUseInventoryBooster={handleUseBooster}
            onOpenBoosterDetail={(type) => setBoosterDetail(type)}
            onProgressStats={handleProgressStats}
            onWin={handleWin}
            onFail={handleFail}
          />
        )}

        {screen === 'endless' && (
          <EndlessBlockScreen
            progress={progress}
            onExit={() => setScreen('home')}
            onGameOverScore={handleEndlessGameOver}
          />
        )}

        {/* Modals */}
        {introLevel && (
          <LevelIntroModal
            level={introLevel}
            hearts={progress.hearts}
            boosters={progress.boosters}
            onStart={(chosen) => startLevel(introLevel, chosen)}
            onOpenShop={() => {
              setIntroLevel(null);
              setShopModalTab('coins');
            }}
            onClose={() => setIntroLevel(null)}
          />
        )}

        {victoryInfo !== null && (
          <VictoryModal
            level={activeLevel}
            starsEarned={victoryInfo.stars}
            bonusCoins={victoryInfo.bonusCoins}
            hasNextLevel={Boolean(nextLevelObj)}
            onNextLevel={() => {
              if (nextLevelObj) startLevel(nextLevelObj);
            }}
            onMap={() => {
              setVictoryInfo(null);
              setScreen('map');
            }}
          />
        )}

        {showFailModal && (
          <FailModal
            coins={progress.coins}
            onBuyMoves={handleBuyMoves}
            onRetry={() => startLevel(activeLevel)}
            onMainMenu={() => {
              setShowFailModal(false);
              setScreen('home');
            }}
          />
        )}

        {shopModalTab && (
          <ShopModal
            progress={progress}
            initialTab={shopModalTab}
            onBuyBooster={handleBuyBooster}
            onExchangeStarsForCoins={(starsCost, coinsGain) => {
              if (progress.stars < starsCost) return;
              updateProgress((p) => ({
                ...p,
                stars: p.stars - starsCost,
                coins: p.coins + coinsGain
              }));
            }}
            onRefillHearts={() => {
              if (progress.coins < 120 || progress.hearts >= progress.maxHearts) return;
              updateProgress((p) => ({
                ...p,
                coins: p.coins - 120,
                hearts: p.maxHearts,
                lastHeartUpdate: Date.now()
              }));
            }}
            onClose={() => setShopModalTab(null)}
          />
        )}

        {boosterDetail && (
          <BoosterDetailModal
            type={boosterDetail}
            count={progress.boosters[boosterDetail] || 0}
            coins={progress.coins}
            onUseBooster={(t) => {
              setExternalArmBooster(t);
              setBoosterDetail(null);
            }}
            onBuyAndClose={(t, price) => {
              handleBuyBooster(t, price);
              setBoosterDetail(null);
            }}
            onClose={() => setBoosterDetail(null)}
          />
        )}

        {showDailyModal && (
          <DailyLoginModal
            progress={progress}
            onClaim={(day, stars, coins) => {
              const today = new Date().toISOString().slice(0, 10);
              updateProgress((p) => ({
                ...p,
                stars: p.stars + stars,
                coins: p.coins + coins,
                dailyStreak: p.dailyStreak + 1,
                lastDailyClaimDate: today,
                dailyClaimedDays: Array.from(new Set([...p.dailyClaimedDays, day]))
              }));
            }}
            onClose={() => setShowDailyModal(false)}
          />
        )}

        {showQuestsModal && (
          <QuestsModal
            progress={progress}
            onClaimQuest={(qid) => {
              updateProgress((p) => {
                const target = p.quests.find((q) => q.id === qid);
                if (!target || target.claimed || target.progress < target.target) return p;
                return {
                  ...p,
                  coins: p.coins + target.rewardCoins,
                  stars: p.stars + target.rewardStars,
                  quests: p.quests.map((q) => (q.id === qid ? { ...q, claimed: true } : q))
                };
              });
            }}
            onClose={() => setShowQuestsModal(false)}
          />
        )}

        {showProfileModal && (
          <ProfileModal
            progress={progress}
            onRename={(name) => updateProgress((p) => ({ ...p, name }))}
            onOpenWardrobe={() => {
              setShowProfileModal(false);
              setShowWardrobeModal(true);
            }}
            onClose={() => setShowProfileModal(false)}
          />
        )}

        {showWardrobeModal && (
          <WardrobeModal
            progress={progress}
            onSelectOrBuyOutfit={handleSelectOrBuyOutfit}
            onSelectOrBuyAccessory={handleSelectOrBuyAccessory}
            onSelectOrBuyBlockTheme={handleSelectOrBuyBlockTheme}
            onClose={() => setShowWardrobeModal(false)}
          />
        )}

        {showSettingsModal && (
          <SettingsModal
            progress={progress}
            isPauseMode={screen === 'game'}
            onToggleSound={() => updateProgress((p) => ({ ...p, soundEnabled: !p.soundEnabled }))}
            onToggleHaptics={() => updateProgress((p) => ({ ...p, hapticsEnabled: !p.hapticsEnabled }))}
            onRestartLevel={() => {
              setShowSettingsModal(false);
              startLevel(activeLevel);
            }}
            onExitToMap={() => {
              setShowSettingsModal(false);
              setScreen('home');
            }}
            onClose={() => setShowSettingsModal(false)}
          />
        )}

        {showCastleModal && (
          <CastleModal
            progress={progress}
            onBuildStage={(id, costStars, rewardCoins) => {
              if (progress.stars < costStars) return;
              updateProgress((p) => ({
                ...p,
                stars: p.stars - costStars,
                coins: p.coins + rewardCoins,
                castleStages: { ...(p.castleStages || {}), [id]: 1 }
              }));
            }}
            onClose={() => setShowCastleModal(false)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
