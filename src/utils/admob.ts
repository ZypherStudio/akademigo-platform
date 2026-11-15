import { Capacitor } from '@capacitor/core';
import {
  AdMob,
  AdOptions,
  RewardAdOptions,
  InterstitialAdPluginEvents,
  RewardAdPluginEvents,
} from '@capacitor-community/admob';

// Replace with your production AdMob Unit IDs from https://admob.google.com before Production rollout
const TEST_INTERSTITIAL_ANDROID = 'ca-app-pub-3940256099942544/1033173712';
const TEST_REWARDED_ANDROID = 'ca-app-pub-3940256099942544/5224354917';

const env = ((import.meta as any).env || {}) as Record<string, string | undefined>;

const INTERSTITIAL_ID =
  env.VITE_ADMOB_INTERSTITIAL_ID || TEST_INTERSTITIAL_ANDROID;
const REWARDED_ID =
  env.VITE_ADMOB_REWARDED_ID || TEST_REWARDED_ANDROID;

const IS_TEST_MODE = !env.VITE_ADMOB_INTERSTITIAL_ID;

let initialized = false;

export async function ensureAdMobInitialized(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  if (initialized) return true;
  try {
    await AdMob.initialize({
      initializeForTesting: IS_TEST_MODE,
    });
    initialized = true;
    return true;
  } catch (err) {
    console.warn('[AdMob] init failed:', err);
    return false;
  }
}

export async function showNativeInterstitialAd(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const ok = await ensureAdMobInitialized();
    if (!ok) return false;

    const options: AdOptions = {
      adId: INTERSTITIAL_ID,
      isTesting: IS_TEST_MODE,
    };

    return await new Promise<boolean>((resolve) => {
      let settled = false;
      const finish = (result: boolean) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      const timeout = window.setTimeout(() => finish(false), 8000);

      AdMob.addListener(InterstitialAdPluginEvents.Dismissed, () => {
        window.clearTimeout(timeout);
        finish(true);
      });

      AdMob.addListener(InterstitialAdPluginEvents.FailedToLoad, () => {
        window.clearTimeout(timeout);
        finish(false);
      });

      AdMob.prepareInterstitial(options)
        .then(() => AdMob.showInterstitial())
        .catch(() => {
          window.clearTimeout(timeout);
          finish(false);
        });
    });
  } catch {
    return false;
  }
}

export async function showNativeRewardedAd(): Promise<boolean> {
  if (!Capacitor.isNativePlatform()) return false;
  try {
    const ok = await ensureAdMobInitialized();
    if (!ok) return false;

    const options: RewardAdOptions = {
      adId: REWARDED_ID,
      isTesting: IS_TEST_MODE,
    };

    return await new Promise<boolean>((resolve) => {
      let rewarded = false;
      let settled = false;
      const finish = (result: boolean) => {
        if (settled) return;
        settled = true;
        resolve(result);
      };

      const timeout = window.setTimeout(() => finish(false), 12000);

      AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
        rewarded = true;
      });

      AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
        window.clearTimeout(timeout);
        finish(rewarded);
      });

      AdMob.addListener(RewardAdPluginEvents.FailedToLoad, () => {
        window.clearTimeout(timeout);
        finish(false);
      });

      AdMob.prepareRewardVideoAd(options)
        .then(() => AdMob.showRewardVideoAd())
        .catch(() => {
          window.clearTimeout(timeout);
          finish(false);
        });
    });
  } catch {
    return false;
  }
}
