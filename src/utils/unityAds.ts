// Native Unity Ads Bridge for Android Play Store App
// Falls back cleanly to false on web browsers so AdInterstitialModal handles web preview.

type UnityCallback = (shown: boolean, rewarded: boolean) => void;

const pendingCallbacks = new Map<string, UnityCallback>();

declare global {
  interface Window {
    KnowzaNativeAds?: {
      isAvailable: () => boolean;
      showInterstitial: (callbackId: string) => void;
      showRewarded: (callbackId: string) => void;
    };
    __knowzaUnityAdResult?: (callbackId: string, shown: boolean, rewarded: boolean) => void;
  }
}

if (typeof window !== 'undefined') {
  window.__knowzaUnityAdResult = (callbackId: string, shown: boolean, rewarded: boolean) => {
    const cb = pendingCallbacks.get(callbackId);
    if (cb) {
      pendingCallbacks.delete(callbackId);
      cb(shown, rewarded);
    }
  };
}

export function isNativeUnityAdsAvailable(): boolean {
  return typeof window !== 'undefined' && Boolean(window.KnowzaNativeAds?.isAvailable?.());
}

export function showUnityInterstitial(): Promise<boolean> {
  if (!isNativeUnityAdsAvailable()) return Promise.resolve(false);
  return new Promise<boolean>((resolve) => {
    const id = 'int_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const timeout = window.setTimeout(() => {
      pendingCallbacks.delete(id);
      resolve(false);
    }, 10000);

    pendingCallbacks.set(id, (shown) => {
      window.clearTimeout(timeout);
      resolve(shown);
    });

    try {
      window.KnowzaNativeAds?.showInterstitial(id);
    } catch {
      window.clearTimeout(timeout);
      pendingCallbacks.delete(id);
      resolve(false);
    }
  });
}

export function showUnityRewarded(): Promise<boolean> {
  if (!isNativeUnityAdsAvailable()) return Promise.resolve(false);
  return new Promise<boolean>((resolve) => {
    const id = 'rew_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7);
    const timeout = window.setTimeout(() => {
      pendingCallbacks.delete(id);
      resolve(false);
    }, 15000);

    pendingCallbacks.set(id, (shown, rewarded) => {
      window.clearTimeout(timeout);
      resolve(shown && rewarded);
    });

    try {
      window.KnowzaNativeAds?.showRewarded(id);
    } catch {
      window.clearTimeout(timeout);
      pendingCallbacks.delete(id);
      resolve(false);
    }
  });
}
