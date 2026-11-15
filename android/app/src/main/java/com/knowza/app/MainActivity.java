package com.knowza.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getBridge() != null) {
            WebView webView = getBridge().getWebView();
            if (webView != null) {
                webView.addJavascriptInterface(
                    new KnowzaWidgetBridge(getApplicationContext()),
                    "KnowzaNativeWidget"
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
}
