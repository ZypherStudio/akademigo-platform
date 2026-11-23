import React, { useEffect, useRef, useState } from 'react';
import { Crown, ExternalLink, Heart, Sparkles, Volume2, X } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { getGeoPricing, t } from '../i18n/locale';
import {
  ADSTERRA_DIRECT_URL,
  ADSTERRA_SCRIPT_URL,
  hasAdsterraConfigured,
  injectAdsterraScript,
} from '../utils/adsterra';
import {
  isNativeUnityAdsAvailable,
  showUnityInterstitial,
  showUnityRewarded,
} from '../utils/unityAds';

interface AdInterstitialModalProps {
  open: boolean;
  mode?: 'interstitial' | 'rewarded_heart';
  onClose: () => void;
  onRewardClaimed?: () => void;
  onUpgradeClick?: () => void;
}

export const AdInterstitialModal: React.FC<AdInterstitialModalProps> = ({
  open,
  mode = 'interstitial',
  onClose,
  onRewardClaimed,
  onUpgradeClick,
}) => {
  const { stats, appLang, regionCode, grantRewardedHeart, upgradeToPro } = useGame();
  const [secondsLeft, setSecondsLeft] = useState(5);
  const adSlotRef = useRef<HTMLDivElement | null>(null);
  const pricing = getGeoPricing(regionCode, appLang);

  useEffect(() => {
    if (!open) return;
    if (mode === 'interstitial' && (stats.isPro || stats.isFounder || stats.hasAdFree)) {
      onClose();
      return;
    }

    let cancelled = false;
    setSecondsLeft(5);

    if (isNativeUnityAdsAvailable()) {
      const runUnity = async () => {
        const shown =
          mode === 'rewarded_heart'
            ? await showUnityRewarded()
            : await showUnityInterstitial();
        if (cancelled) return;
        if (shown) {
          if (mode === 'rewarded_heart') {
            grantRewardedHeart();
            onRewardClaimed?.();
          }
          onClose();
        }
      };
      runUnity();
    }

    let cleanupScript: (() => void) | undefined;
    if (ADSTERRA_SCRIPT_URL && adSlotRef.current) {
      cleanupScript = injectAdsterraScript(adSlotRef.current);
    }

    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => {
      cancelled = true;
      window.clearInterval(timer);
      cleanupScript?.();
    };
  }, [open, mode]);

  if (!open) return null;

  if (mode === 'interstitial' && (stats.isPro || stats.isFounder || stats.hasAdFree)) {
    return null;
  }

  const handleFinish = () => {
    if (secondsLeft > 0) return;
    if (mode === 'rewarded_heart') {
      grantRewardedHeart();
      onRewardClaimed?.();
    }
    onClose();
  };

  const handleGoPro = () => {
    if (onUpgradeClick) {
      onUpgradeClick();
    } else {
      upgradeToPro();
    }
    onClose();
  };

  const handleOpenAdsterraDirect = () => {
    if (!ADSTERRA_DIRECT_URL) return;
    window.open(ADSTERRA_DIRECT_URL, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/85 flex items-center justify-center p-4 animate-fade-in">
      <div className="w-full max-w-md rounded-3xl bg-[#131f24] border-2 border-[#2a3f4a] shadow-2xl overflow-hidden text-white">
        {/* Top Ad Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#0e171b] border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 text-[10px] font-black tracking-wider uppercase border border-amber-400/30">
              {t(appLang, 'ad_badge')}
            </span>
            <Volume2 className="w-4 h-4 text-gray-400" />
          </div>

          <button
            onClick={handleFinish}
            disabled={secondsLeft > 0}
            className={`px-3 py-1 rounded-full text-xs font-black flex items-center gap-1.5 transition-all ${
              secondsLeft > 0
                ? 'bg-white/10 text-gray-300 cursor-not-allowed'
                : 'bg-[#58cc02] hover:bg-[#46a302] text-white cursor-pointer shadow-md'
            }`}
          >
            {secondsLeft > 0 ? (
              <span>{secondsLeft} {t(appLang, 'ad_wait_sec')}</span>
            ) : (
              <>
                <X className="w-3.5 h-3.5" />
                <span>{mode === 'rewarded_heart' ? '+1 ❤️' : t(appLang, 'ad_skip')}</span>
              </>
            )}
          </button>
        </div>

        {/* Adsterra Native/Script Slot + Sponsor Body */}
        <div className="p-6 space-y-4 text-center">
          {ADSTERRA_SCRIPT_URL ? (
            <div
              ref={adSlotRef}
              className="w-full min-h-[140px] rounded-2xl bg-[#0e171b] border border-white/10 flex items-center justify-center overflow-hidden p-2"
            />
          ) : (
            <div
              onClick={handleOpenAdsterraDirect}
              className={`p-5 rounded-2xl bg-gradient-to-br from-indigo-950/90 via-slate-900 to-purple-950/90 border border-white/15 space-y-3 ${
                ADSTERRA_DIRECT_URL ? 'cursor-pointer hover:border-amber-400/60 transition' : ''
              }`}
            >
              <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-600 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                {mode === 'rewarded_heart' ? (
                  <Heart className="w-8 h-8 text-white fill-white animate-pulse" />
                ) : (
                  <Sparkles className="w-8 h-8 text-white" />
                )}
              </div>

              <h3 className="text-lg font-black tracking-tight">
                {mode === 'rewarded_heart'
                  ? appLang === 'tr'
                    ? 'Ücretsiz +1 Can Kazanılıyor...'
                    : 'Earning +1 Free Heart...'
                  : appLang === 'tr'
                  ? 'Knowza ile Sınavlara 10x Hızlı Hazırlan!'
                  : 'Master Your Exams 10x Faster with Knowza!'}
              </h3>

              <p className="text-xs text-gray-300 leading-relaxed">
                {mode === 'rewarded_heart'
                  ? appLang === 'tr'
                    ? 'Sayaç bittiğinde hesabına anında +1 ❤️ can eklenecek.'
                    : 'Once the timer finishes, +1 ❤️ heart will be added to your account.'
                  : appLang === 'tr'
                  ? 'Reklamsız deneyim, sınırsız can (bekleme yok) ve sınırsız Gemini AI Koç için PRO üyeliğe geç.'
                  : 'Upgrade to Knowza PRO for zero post-test ads, unlimited hearts with no wait, and unlimited Gemini AI Coach.'}
              </p>

              {hasAdsterraConfigured() && ADSTERRA_DIRECT_URL && (
                <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-300">
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>{appLang === 'tr' ? 'Sponsor Bağlantısını Aç' : 'Open Sponsor Offer'}</span>
                </div>
              )}
            </div>
          )}

          {/* PRO Upsell CTA inside Ad */}
          <button
            onClick={handleGoPro}
            className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FF9500] text-[#2A1E00] font-black text-sm border-b-4 border-[#CC7700] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg"
          >
            <Crown className="w-4 h-4 fill-[#2A1E00]" />
            <span>
              {t(appLang, 'ad_remove_cta')} ({pricing.proMonthlyLabel}{pricing.proPeriodLabel})
            </span>
          </button>

          {secondsLeft === 0 && (
            <button
              onClick={handleFinish}
              className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-black text-white/90 transition-colors"
            >
              {mode === 'rewarded_heart'
                ? appLang === 'tr'
                  ? 'Ödülü Al (+1 ❤️) & Devam Et'
                  : 'Claim +1 ❤️ & Continue'
                : t(appLang, 'ad_skip')}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
