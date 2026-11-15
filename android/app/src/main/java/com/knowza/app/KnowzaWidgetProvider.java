package com.knowza.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

/**
 * Native Android home screen widget showing real synced Knowza user stats:
 * daily streak, active course title, XP/level, and lesson completion percentage.
 */
public class KnowzaWidgetProvider extends AppWidgetProvider {

    public static final String PREFS_NAME = "KnowzaWidgetPrefs";
    public static final String KEY_STREAK = "streak";
    public static final String KEY_XP = "xp";
    public static final String KEY_LEVEL = "level";
    public static final String KEY_COURSE_TITLE = "courseTitle";
    public static final String KEY_PROGRESS_PCT = "progressPct";
    public static final String KEY_COMPLETED_COUNT = "completedCount";
    public static final String KEY_TOTAL_COUNT = "totalCount";

    @Override
    public void onUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds) {
        for (int appWidgetId : appWidgetIds) {
            updateWidgetView(context, appWidgetManager, appWidgetId);
        }
    }

    public static void updateAllWidgets(Context context) {
        AppWidgetManager manager = AppWidgetManager.getInstance(context);
        ComponentName componentName = new ComponentName(context, KnowzaWidgetProvider.class);
        int[] widgetIds = manager.getAppWidgetIds(componentName);
        if (widgetIds != null && widgetIds.length > 0) {
            for (int appWidgetId : widgetIds) {
                updateWidgetView(context, manager, appWidgetId);
            }
        }
    }

    private static void updateWidgetView(
        Context context,
        AppWidgetManager appWidgetManager,
        int appWidgetId
    ) {
        SharedPreferences prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE);
        int streak = prefs.getInt(KEY_STREAK, 0);
        int xp = prefs.getInt(KEY_XP, 0);
        int level = prefs.getInt(KEY_LEVEL, 1);
        String courseTitle = prefs.getString(KEY_COURSE_TITLE, "Knowza");
        int progressPct = Math.max(0, Math.min(100, prefs.getInt(KEY_PROGRESS_PCT, 0)));
        int completedCount = Math.max(0, prefs.getInt(KEY_COMPLETED_COUNT, 0));
        int totalCount = Math.max(0, prefs.getInt(KEY_TOTAL_COUNT, 0));

        RemoteViews views = new RemoteViews(context.getPackageName(), R.layout.knowza_widget);
        views.setTextViewText(R.id.widget_streak, "\uD83D\uDD25 " + streak + " G\u00fcn");
        views.setTextViewText(R.id.widget_course_title, courseTitle != null ? courseTitle : "Knowza");
        views.setTextViewText(R.id.widget_xp_level, "Sv. " + level + " \u2022 " + xp + " XP");
        views.setProgressBar(R.id.widget_progress_bar, 100, progressPct, false);
        views.setTextViewText(
            R.id.widget_progress_text,
            "\u0130lerleme: %" + progressPct + " (" + completedCount + "/" + totalCount + " ders)"
        );

        Intent intent = new Intent(context, MainActivity.class);
        intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        PendingIntent pendingIntent = PendingIntent.getActivity(
            context,
            0,
            intent,
            PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE
        );
        views.setOnClickPendingIntent(R.id.widget_root, pendingIntent);

        appWidgetManager.updateAppWidget(appWidgetId, views);
    }
}
