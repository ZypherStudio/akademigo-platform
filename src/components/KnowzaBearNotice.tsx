import React, { useEffect, useState } from 'react';
import { Sparkles, X, ArrowRight, Heart, Gem, Crown, Bot } from 'lucide-react';
import { useGame } from '../context/GameContext';

export type BearNoticeKind = 'coach_24h' | 'purchased' | 'no_gems' | 'no_hearts' | 'miss_you';

export interface BearNoticeData {
  kind: BearNoticeKind;
  title: string;
  message: string;
  ctaLabel?: string;
  onCta?: () => void;
}

const DAILY_COACH_MESSAGES_TR = [
  {
    title: 'Seni Çok Özledim Şampiyon! 🐻💛',
    message: '24 saat geçti, bal kavanozun seni bekliyor! Bugün 1 kısa test çözerek serini ve hızını koruyalım.',
  },
  {
    title: 'Knowza Koçun Hazır! 🎓',
    message: 'Günün yeni soruları ve ülke müfredatın güncellendi. 5 dakikalık bir pratikle rakiplerinin önüne geç!',
  },
  {
    title: 'Alevin Sönmesin! 🔥',
    message: 'Düzenli çalışanlar hedeflerine 3 kat daha hızlı ulaşıyor. Bugünkü dersini şimdi başlat!',
  },
  {
    title: 'AI Koçundan Özel Not 🤖',
    message: 'Takıldığın bir konu veya ehliyet/sınav sorusu varsa fotoğrafını çekip bana sorabilirsin, 7/24 buradayım!',
  },
];

const DAILY_COACH_MESSAGES_EN = [
  {
    title: 'I Missed You, Champ! 🐻💛',
    message: 'It has been 24 hours! Solve 1 quick lesson today to keep your streak and momentum alive.',
  },
  {
    title: 'Your Knowza Coach is Ready! 🎓',
    message: 'Fresh official questions are synced. Spend 5 minutes today and stay ahead on the leaderboard!',
  },
  {
    title: 'Keep Your Flame Burning! 🔥',
    message: 'Daily consistency beats cramming every time. Let’s complete today’s mini quiz together!',
  },
];

const LAST_24H_KEY = 'knowza_last_24h_bear_notice_v1';
const DAY_MS = 24 * 60 * 60 * 1000;

export const KnowzaBearNotice: React.FC<{
  notice: BearNoticeData | null;
  onClose: () => void;
}> = ({ notice, onClose }) => {
  if (!notice) return null;

  const palette =
    notice.kind === 'purchased'
      ? {
          border: 'border-emerald-300',
          badgeBg: 'bg-emerald-100 text-emerald-800',
          badgeText: 'ALINDI & AKTİF ✓',
          img: '/assets/knowza_cheering.png',
          icon: <Crown className="w-3.5 h-3.5" />,
        }
      : notice.kind === 'no_gems'
      ? {
          border: 'border-sky-300',
          badgeBg: 'bg-sky-100 text-sky-800',
          badgeText: 'ELMAS YETERSİZ',
          img: '/assets/knowza_thinking.png',
          icon: <Gem className="w-3.5 h-3.5" />,
        }
      : notice.kind === 'no_hearts'
      ? {
          border: 'border-rose-300',
          badgeBg: 'bg-rose-100 text-rose-800',
          badgeText: 'CAN TÜKENDİ',
          img: '/assets/knowza_thinking.png',
          icon: <Heart className="w-3.5 h-3.5" />,
        }
      : {
          border: 'border-amber-300',
          badgeBg: 'bg-amber-100 text-amber-900',
          badgeText: '24 SAAT KOÇ UYARISI',
          img: '/assets/knowza_main.png',
          icon: <Bot className="w-3.5 h-3.5" />,
        };

  return (
    <div className="fixed inset-0 z-[135] bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-4 animate-fade">
      <div
        className={`w-full max-w-sm rounded-[32px] bg-[#FFFDF7] p-6 text-center shadow-2xl border-2 ${palette.border} space-y-4 relative`}
      >
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-amber-50 hover:bg-amber-100 flex items-center justify-center text-slate-500 transition"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="w-24 h-24 mx-auto drop-shadow-md">
          <img src={palette.img} alt="Knowza Ayı" className="w-full h-full object-contain" />
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black ${palette.badgeBg}`}>
          {palette.icon}
          <span>{palette.badgeText}</span>
        </div>

        <div className="space-y-1.5">
          <h3 className="text-lg font-black text-slate-900 leading-snug">{notice.title}</h3>
          <p className="text-xs font-semibold text-slate-600 leading-relaxed">{notice.message}</p>
        </div>

        <div className="space-y-2 pt-1">
          {notice.ctaLabel && notice.onCta && (
            <button
              onClick={() => {
                notice.onCta?.();
                onClose();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#FFC700] to-[#FFB800] text-slate-950 font-black text-sm border-b-4 border-[#CC8800] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <span>{notice.ctaLabel}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-xs transition flex items-center justify-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tamam</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export const DailyCoachReminderHost: React.FC<{
  onOpenCoach: () => void;
}> = ({ onOpenCoach }) => {
  const { appLang, stats } = useGame();
  const [notice, setNotice] = useState<BearNoticeData | null>(null);

  useEffect(() => {
    if (!stats.hasCompletedOnboarding) return;
    try {
      const lastStr = localStorage.getItem(LAST_24H_KEY);
      const lastTs = lastStr ? Number(lastStr) : 0;
      const now = Date.now();
      if (!lastTs || now - lastTs >= DAY_MS) {
        localStorage.setItem(LAST_24H_KEY, String(now));
        const pool = appLang === 'tr' ? DAILY_COACH_MESSAGES_TR : DAILY_COACH_MESSAGES_EN;
        const pick = pool[Math.floor(Math.random() * pool.length)];
        setNotice({
          kind: 'coach_24h',
          title: pick.title,
          message: pick.message,
          ctaLabel: appLang === 'tr' ? 'AI Koç ile Başla' : 'Open AI Coach',
          onCta: onOpenCoach,
        });
      }
    } catch {
      // ignore storage errors
    }
  }, [stats.hasCompletedOnboarding, appLang]);

  return <KnowzaBearNotice notice={notice} onClose={() => setNotice(null)} />;
};
