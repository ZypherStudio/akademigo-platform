package com.knowza.app;

import android.app.Activity;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;
import com.unity3d.ads.IUnityAdsInitializationListener;
import com.unity3d.ads.IUnityAdsLoadListener;
import com.unity3d.ads.IUnityAdsShowListener;
import com.unity3d.ads.UnityAds;
import com.unity3d.ads.UnityAdsShowOptions;

public class MainActivity extends BridgeActivity {

    private static final String INTERSTITIAL_PLACEMENT = "Interstitial_Android";
    private static final String REWARDED_PLACEMENT = "Rewarded_Android";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        String unityGameId = getString(R.string.unity_game_id);
        boolean testMode = getResources().getBoolean(R.bool.unity_test_mode);
        UnityAds.initialize(getApplicationContext(), unityGameId, testMode, new IUnityAdsInitializationListener() {
            @Override
            public void onInitializationComplete() {
                UnityAds.load(INTERSTITIAL_PLACEMENT, new IUnityAdsLoadListener() {
                    @Override public void onUnityAdsAdLoaded(String placementId) {}
                    @Override public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {}
                });
                UnityAds.load(REWARDED_PLACEMENT, new IUnityAdsLoadListener() {
                    @Override public void onUnityAdsAdLoaded(String placementId) {}
                    @Override public void onUnityAdsFailedToLoad(String placementId, UnityAds.UnityAdsLoadError error, String message) {}
                });
            }

            @Override
            public void onInitializationFailed(UnityAds.UnityAdsInitializationError error, String message) {}
        });

        if (getBridge() != null) {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.addJavascriptInterface(
                    new KnowzaWidgetBridge(getApplicationContext()),
                    "KnowzaNativeWidget"
                );
                webView.addJavascriptInterface(
                    new KnowzaAdsBridge(this, webView),
                    "KnowzaNativeAds"
                );
            }
        }
    }

    /**
     * JavaScript bridge invoked by GameContext when user stats change,
     * keeping the Android home screen widget synced with real user data.
     */
    public static class KnowzaWidgetBridge {
        private final Context appContext;

        public KnowzaWidgetBridge(Context appContext) {
            this.appContext = appContext;
        }

        @JavascriptInterface
        public void updateWidget(
            int streak,
            int xp,
            int level,
            String courseTitle,
            int progressPct,
            int completedCount,
            int totalCount
        ) {
            SharedPreferences prefs = appContext.getSharedPreferences(
                KnowzaWidgetProvider.PREFS_NAME,
                Context.MODE_PRIVATE
            );
            prefs
                .edit()
                .putInt(KnowzaWidgetProvider.KEY_STREAK, Math.max(0, streak))
                .putInt(KnowzaWidgetProvider.KEY_XP, Math.max(0, xp))
                .putInt(KnowzaWidgetProvider.KEY_LEVEL, Math.max(1, level))
                .putString(
                    KnowzaWidgetProvider.KEY_COURSE_TITLE,
                    courseTitle != null ? courseTitle : "Knowza"
                )
                .putInt(KnowzaWidgetProvider.KEY_PROGRESS_PCT, Math.max(0, Math.min(100, progressPct)))
                .putInt(KnowzaWidgetProvider.KEY_COMPLETED_COUNT, Math.max(0, completedCount))
                .putInt(KnowzaWidgetProvider.KEY_TOTAL_COUNT, Math.max(0, totalCount))
                .apply();

            KnowzaWidgetProvider.updateAllWidgets(appContext);
        }
    }

    /**
     * Native Unity Ads JavaScript bridge for Interstitial and Rewarded mobile app ads.
     */
    public static class KnowzaAdsBridge {
        private final Activity activity;
        private final WebView webView;

        public KnowzaAdsBridge(Activity activity, WebView webView) {
            this.activity = activity;
            this.webView = webView;
        }

        private void notifyJs(String callbackId, boolean shown, boolean rewarded) {
            activity.runOnUiThread(() -> {
                String safeId = callbackId.replace("'", "");
                String js = "if (window.__knowzaUnityAdResult) window.__knowzaUnityAdResult('"
                    + safeId + "', " + shown + ", " + rewarded + ");";
                webView.evaluateJavascript(js, null);
            });
        }

        @JavascriptInterface
        public boolean isAvailable() {
            return UnityAds.isInitialized();
        }

        @JavascriptInterface
        public void showInterstitial(String callbackId) {
            showPlacement(INTERSTITIAL_PLACEMENT, callbackId);
        }

        @JavascriptInterface
        public void showRewarded(String callbackId) {
            showPlacement(REWARDED_PLACEMENT, callbackId);
        }

        private void showPlacement(String placementId, String callbackId) {
            activity.runOnUiThread(() -> {
                if (!UnityAds.isInitialized()) {
                    notifyJs(callbackId, false, false);
                    return;
                }
                UnityAds.load(placementId, new IUnityAdsLoadListener() {
                    @Override
                    public void onUnityAdsAdLoaded(String pid) {
                        UnityAds.show(activity, pid, new UnityAdsShowOptions(), new IUnityAdsShowListener() {
                            @Override
                            public void onUnityAdsShowFailure(String p, UnityAds.UnityAdsShowError err, String msg) {
                                notifyJs(callbackId, false, false);
                            }

                            @Override
                            public void onUnityAdsShowStart(String p) {}

                            @Override
                            public void onUnityAdsShowClick(String p) {}

                            @Override
                            public void onUnityAdsShowComplete(String p, UnityAds.UnityAdsShowCompletionState state) {
                                boolean completed = state == UnityAds.UnityAdsShowCompletionState.COMPLETED;
                                notifyJs(callbackId, true, completed || state == UnityAds.UnityAdsShowCompletionState.SKIPPED);
                                // Preload next ad
                                UnityAds.load(placementId, new IUnityAdsLoadListener() {
                                    @Override public void onUnityAdsAdLoaded(String nextPid) {}
                                    @Override public void onUnityAdsFailedToLoad(String nextPid, UnityAds.UnityAdsLoadError e, String m) {}
                                });
                            }
                        });
                    }

                    @Override
                    public void onUnityAdsFailedToLoad(String pid, UnityAds.UnityAdsLoadError err, String msg) {
                        notifyJs(callbackId, false, false);
                    }
                });
            });
        }
    }
}
