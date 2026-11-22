import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { LEVELS } from './data/levels';
import {
  AccessoryId,
  BlockThemeId,
  InventoryBooster,
  KnowzaMood,
  LevelConfig,
  OutfitId,
  PlayerProgress
} from './types/game';
import {
  PendingBlastGift,
  claimPendingBlastGifts,
  sendBlastGift,
  syncBlastPlayer
} from './utils/blastApi';
import { sfx } from './utils/sound';
import {
  addXpToProgress,
  applyHeartRegen,
  loadProgress,
  saveProgress
} from './utils/storage';
import {
  getWinStreakCoinMultiplier,
  getWinStreakStartBoosters
} from './utils/winStreak';
import { TopHud } from './components/TopHud';
import { EVENT_MARATHON_TIERS, HomeMenuScreen } from './components/HomeMenuScreen';
import { WorldMapScreen } from './components/WorldMapScreen';
import { HybridGameScreen } from './components/HybridGameScreen';
import { EndlessBlockScreen } from './components/EndlessBlockScreen';
import { WardrobeModal } from './components/WardrobeModal';
import { BeforeInstallPromptEvent, SocialHubModal, SocialTab } from './components/SocialHubModal';
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

type Screen = 'home' | 'map' | 'game' | 'endless' | 'sprint' | 'daily';

export const App: React.FC = () => {
  const [progress, setProgress] = useState<PlayerProgress>(() => loadProgress());
  const [screen, setScreen] = useState<Screen>('home');
  const [activeLevel, setActiveLevel] = useState<LevelConfig>(LEVELS[0]);
  const [selectedStartBoosters, setSelectedStartBoosters] = useState<('rocket' | 'bomb')[]>([]);
  const [externalArmBooster, setExternalArmBooster] = useState<InventoryBooster | null>(null);
  const [gameRunKey, setGameRunKey] = useState(1);
  const [bonusMovesCount, setBonusMovesCount] = useState(0);
  const [hudMood, setHudMood] = useState<KnowzaMood>('idle');

  // Modals
  const [introLevel, setIntroLevel] = useState<LevelConfig | null>(null);
  const [victoryInfo, setVictoryInfo] = useState<{
    stars: number;
    bonusCoins: number;
    winStreak: number;
    streakBonusCoins: number;
  } | null>(null);
  const [lostWinStreak, setLostWinStreak] = useState(0);
  const [showFailModal, setShowFailModal] = useState(false);
  const [shopModalTab, setShopModalTab] = useState<'boosters' | 'coins' | null>(null);
  const [boosterDetail, setBoosterDetail] = useState<InventoryBooster | null>(null);
  const [showDailyModal, setShowDailyModal] = useState(false);
  const [showQuestsModal, setShowQuestsModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCastleModal, setShowCastleModal] = useState(false);
  const [showWardrobeModal, setShowWardrobeModal] = useState(false);
  const [socialModalTab, setSocialModalTab] = useState<SocialTab | null>(null);
  const [incomingRefCode, setIncomingRefCode] = useState('');
  const [pendingGiftBanner, setPendingGiftBanner] = useState<string | null>(null);
  const [deferredInstallPrompt, setDeferredInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    sfx.enabled = progress.soundEnabled;
    sfx.hapticsEnabled = progress.hapticsEnabled;
    saveProgress(progress);
  }, [progress]);

  useEffect(() => {
    const onInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredInstallPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', onInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onInstallPrompt);
  }, []);

  useEffect(() => {
    let active = true;
    const bootSocial = async () => {
      const synced = await syncBlastPlayer(progress);
      if (active && synced?.inviteCode && synced.inviteCode !== progress.inviteCode) {
        setProgress((prev) => ({ ...prev, inviteCode: synced.inviteCode }));
      }
      const gifts = await claimPendingBlastGifts(progress.playerId);
      if (active && gifts.length > 0) {
        const totalCoins = gifts.reduce((s, g) => s + (g.coins || 0), 0);
        const totalHearts = gifts.reduce((s, g) => s + (g.hearts || 0), 0);
        setProgress((prev) => ({
          ...prev,
          coins: prev.coins + totalCoins,
          hearts: Math.min(prev.maxHearts, prev.hearts + totalHearts)
        }));
        setPendingGiftBanner(`Hediye Geldi: +${totalCoins} Altın${totalHearts > 0 ? `, +${totalHearts} Can` : ''}!`);
        setTimeout(() => setPendingGiftBanner(null), 5000);
      }

      const params = new URLSearchParams(window.location.search);
      const ref = (params.get('ref') || '').trim().toUpperCase();
      const giftReq = (params.get('gift_req') || '').trim();
      if (ref && !progress.claimedReferralCode && active) {
        setIncomingRefCode(ref);
        setSocialModalTab('invite');
      }
      if (giftReq && giftReq !== progress.playerId && active) {
        const res = await sendBlastGift(progress, { targetPlayerId: giftReq });
        if (res.ok && active) {
          setProgress((prev) => ({ ...prev, coins: prev.coins + (res.helperCoins || 50) }));
          setPendingGiftBanner(`${res.receiverName} için +1 Can gönderdin! (+${res.helperCoins || 50} Altın)`);
          setTimeout(() => setPendingGiftBanner(null), 5000);
        }
      }
      if ((ref || giftReq) && window.history?.replaceState) {
        window.history.replaceState({}, '', window.location.pathname);
      }
    };
    bootSocial();
    return () => {
      active = false;
    };
  }, []);

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
      if ((next.bestWinStreak || next.winStreak || 0) >= 3) badges.add('streak_3');
      if ((next.bestWinStreak || next.winStreak || 0) >= 5) badges.add('streak_5');
      if (Object.values(next.castleStages || {}).filter((v) => v > 0).length >= 5) {
        badges.add('castle_king');
      }
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
    const streakBoosters = getWinStreakStartBoosters(progress.winStreak);
    setActiveLevel(lvl);
    setSelectedStartBoosters([...streakBoosters, ...startBoosters]);
    setIntroLevel(null);
    setVictoryInfo(null);
    setShowFailModal(false);
    setLostWinStreak(0);
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
    bonusCoins?: number;
  }) => {
    updateProgress((p) => {
      const nextQuests = p.quests.map((q) => {
        if (q.type === 'blast_cubes' && delta.cubesBlasted) {
          return { ...q, progress: q.progress + delta.cubesBlasted };
        }
        if (q.type === 'clear_lines' && delta.linesCleared) {
          return { ...q, progress: q.progress + delta.linesCleared };
        }
        if (q.type === 'use_boosters' && delta.boostersUsed) {
          return { ...q, progress: q.progress + delta.boostersUsed };
        }
        return q;
      });
      return {
        ...p,
        coins: p.coins + (delta.bonusCoins || 0),
        totalCubesBlasted: p.totalCubesBlasted + (delta.cubesBlasted || 0),
        totalLinesCleared: p.totalLinesCleared + (delta.linesCleared || 0),
        eventLinesProgress: (p.eventLinesProgress || 0) + (delta.linesCleared || 0),
        quests: nextQuests
      };
    });
  };

  const handleWin = (starsEarned: number, remainingMoves: number) => {
    const bonusCoins = Math.max(0, remainingMoves * 10);
    const nextStreak = (progress.winStreak || 0) + 1;
    const mult = getWinStreakCoinMultiplier(nextStreak);
    const baseCoins = activeLevel.rewards.coins + bonusCoins;
    const streakBonusCoins = mult > 1 ? Math.round(baseCoins * (mult - 1)) : 0;

    setVictoryInfo({
      stars: starsEarned,
      bonusCoins,
      winStreak: nextStreak,
      streakBonusCoins
    });
    updateProgress((p) => {
      const prevStars = p.levelStars[activeLevel.id] || 0;
      const withXp = addXpToProgress(p, activeLevel.rewards.xp);
      const updatedStreak = (withXp.winStreak || 0) + 1;
      const nextQuests = withXp.quests.map((q) => {
        if (q.type === 'win_levels') return { ...q, progress: q.progress + 1 };
        if (q.type === 'win_streak') return { ...q, progress: Math.max(q.progress, updatedStreak) };
        return q;
      });
      const nextPlayerProgress: PlayerProgress = {
        ...withXp,
        stars: withXp.stars + activeLevel.rewards.stars,
        coins: withXp.coins + baseCoins + streakBonusCoins,
        winStreak: updatedStreak,
        bestWinStreak: Math.max(withXp.bestWinStreak || 0, updatedStreak),
        unlockedLevel: Math.min(LEVELS.length, Math.max(withXp.unlockedLevel, activeLevel.id + 1)),
        levelStars: {
          ...withXp.levelStars,
          [activeLevel.id]: Math.max(prevStars, starsEarned)
        },
        quests: nextQuests
      };
      syncBlastPlayer(nextPlayerProgress);
      return nextPlayerProgress;
    });
  };

  const handleFail = () => {
    setLostWinStreak(progress.winStreak || 0);
    setShowFailModal(true);
    updateProgress((p) => ({
      ...p,
      winStreak: 0,
      hearts: Math.max(0, p.hearts - 1),
      lastHeartUpdate: p.hearts === p.maxHearts ? Date.now() : p.lastHeartUpdate
    }));
  };

  const handleSpendCoins = (amount: number): boolean => {
    if (progress.coins < amount) return false;
    updateProgress((p) => ({ ...p, coins: Math.max(0, p.coins - amount) }));
    return true;
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

  const handleEventLineDelta = (lines: number) => {
    if (lines <= 0) return;
    updateProgress((p) => ({
      ...p,
      eventLinesProgress: (p.eventLinesProgress || 0) + lines
    }));
  };

  const handleClaimEventTier = (tierNum: number) => {
    const def = EVENT_MARATHON_TIERS.find((t) => t.tier === tierNum);
    if (!def) return;
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.65 } });
    updateProgress((p) => {
      const claimed = p.eventClaimedTiers || [];
      if (claimed.includes(tierNum) || (p.eventLinesProgress || 0) < def.lines) return p;
      return {
        ...p,
        coins: p.coins + def.rewardCoins,
        boosters: {
          ...p.boosters,
          rocket: (p.boosters.rocket || 0) + def.rewardRocket,
          disco: (p.boosters.disco || 0) + def.rewardDisco
        },
        eventClaimedTiers: [...claimed, tierNum]
      };
    });
  };

  const handleEndlessGameOver = (score: number, linesCleared: number, mode: 'endless' | 'sprint' | 'daily' = 'endless') => {
    const coinsReward = Math.max(15, Math.floor(score / 25));
    const starsReward = Math.max(5, Math.floor(score / 80));
    const today = new Date().toISOString().slice(0, 10);
    updateProgress((p) => {
      const withXp = addXpToProgress(p, Math.min(120, Math.max(20, Math.floor(score / 15))));
      const nextQuests = withXp.quests.map((q) =>
        q.type === 'clear_lines' ? { ...q, progress: q.progress + linesCleared } : q
      );
      const nextProgress: PlayerProgress = {
        ...withXp,
        highBlockScore: mode === 'endless' ? Math.max(withXp.highBlockScore, score) : withXp.highBlockScore,
        highSprintScore:
          mode === 'sprint'
            ? Math.max(withXp.highSprintScore || 0, score)
            : withXp.highSprintScore || 0,
        dailyChallengeDate: today,
        dailyChallengeBest:
          mode === 'daily'
            ? Math.max(withXp.dailyChallengeBest || 0, score)
            : withXp.dailyChallengeBest || 0,
        dailyChallengeLines:
          mode === 'daily'
            ? Math.max(withXp.dailyChallengeLines || 0, linesCleared)
            : withXp.dailyChallengeLines || 0,
        totalLinesCleared: withXp.totalLinesCleared + linesCleared,
        coins: withXp.coins + coinsReward,
        stars: withXp.stars + starsReward,
        quests: nextQuests
      };
      syncBlastPlayer(
        nextProgress,
        mode === 'daily' ? { date: today, score, lines: linesCleared } : undefined
      );
      return nextProgress;
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
        {screen !== 'endless' && screen !== 'sprint' && screen !== 'daily' && (
          <TopHud
            progress={progress}
            mood={screen === 'game' ? hudMood : 'idle'}
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
            pendingGiftBanner={pendingGiftBanner}
            onPlayCurrent={(lvl) => setIntroLevel(lvl)}
            onOpenMap={() => setScreen('map')}
            onOpenEndless={() => setScreen('endless')}
            onOpenSprint={() => setScreen('sprint')}
            onOpenDailyChallenge={() => setScreen('daily')}
            onOpenSocial={(tab = 'leaderboard') => setSocialModalTab(tab)}
            onClaimEventTier={handleClaimEventTier}
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
            onSpendCoins={handleSpendCoins}
            onMoodChange={setHudMood}
            onWin={handleWin}
            onFail={handleFail}
          />
        )}

        {(screen === 'endless' || screen === 'sprint' || screen === 'daily') && (
          <EndlessBlockScreen
            key={`eb_${screen}`}
            progress={progress}
            mode={screen}
            onExit={() => setScreen('home')}
            onLineClearedDelta={handleEventLineDelta}
            onGameOverScore={handleEndlessGameOver}
          />
        )}

        {/* Modals */}
        {introLevel && (
          <LevelIntroModal
            level={introLevel}
            hearts={progress.hearts}
            boosters={progress.boosters}
            winStreak={progress.winStreak}
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
            winStreak={victoryInfo.winStreak}
            streakBonusCoins={victoryInfo.streakBonusCoins}
            hasNextLevel={Boolean(nextLevelObj)}
            outfit={progress.equippedOutfit}
            accessory={progress.equippedAccessory}
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
            lostStreak={lostWinStreak}
            outfit={progress.equippedOutfit}
            accessory={progress.equippedAccessory}
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
            onSpinWheelReward={(prize, isFreeSpin, spinCoinCost) => {
              const today = new Date().toISOString().slice(0, 10);
              updateProgress((p) => {
                if (!isFreeSpin && p.coins < spinCoinCost) return p;
                let coins = p.coins - (isFreeSpin ? 0 : spinCoinCost);
                let stars = p.stars;
                const boosters = { ...p.boosters };
                if (prize.kind === 'coins') coins += prize.amount;
                if (prize.kind === 'stars') stars += prize.amount;
                if (prize.kind === 'booster' && prize.booster) {
                  boosters[prize.booster] = (boosters[prize.booster] || 0) + prize.amount;
                }
                return {
                  ...p,
                  coins,
                  stars,
                  boosters,
                  lastWheelSpinDate: isFreeSpin ? today : p.lastWheelSpinDate
                };
              });
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
              if (progress.winStreak > 0) {
                updateProgress((p) => ({ ...p, winStreak: 0 }));
              }
              startLevel(activeLevel);
            }}
            onExitToMap={() => {
              setShowSettingsModal(false);
              if (progress.winStreak > 0) {
                updateProgress((p) => ({ ...p, winStreak: 0 }));
              }
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

        {socialModalTab && (
          <SocialHubModal
            progress={progress}
            initialTab={socialModalTab}
            initialReferralCode={incomingRefCode}
            deferredInstallPrompt={deferredInstallPrompt}
            onConsumeInstallPrompt={() => setDeferredInstallPrompt(null)}
            onClaimReferralReward={(code, coins, rockets) => {
              updateProgress((p) => ({
                ...p,
                claimedReferralCode: code,
                coins: p.coins + coins,
                boosters: { ...p.boosters, rocket: (p.boosters.rocket || 0) + rockets }
              }));
            }}
            onClaimPendingGifts={(gifts: PendingBlastGift[]) => {
              const totalCoins = gifts.reduce((s, g) => s + (g.coins || 0), 0);
              const totalHearts = gifts.reduce((s, g) => s + (g.hearts || 0), 0);
              updateProgress((p) => ({
                ...p,
                coins: p.coins + totalCoins,
                hearts: Math.min(p.maxHearts, p.hearts + totalHearts)
              }));
            }}
            onHelperGiftCoinReward={(coins) => {
              updateProgress((p) => ({ ...p, coins: p.coins + coins }));
            }}
            onClose={() => setSocialModalTab(null)}
          />
        )}
      </div>
    </div>
  );
};

export default App;
