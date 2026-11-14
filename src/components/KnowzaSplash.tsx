import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  ShieldCheck, 
  Mail, 
  Sparkles, 
  Flame, 
  Target, 
  Award, 
  BookOpen, 
  Bot, 
  Zap, 
  Trophy,
  Star,
  CheckCircle2
} from 'lucide-react';
import { sound } from '../utils/audio';
import { listSavedAccounts, SavedAccountSummary } from '../utils/accountStorage';

interface KnowzaSplashProps {
  onStartGoogle: () => void;
  onOpenEmailAuth: () => void;
  onGuestStart?: () => void;
  onSelectSavedAccount?: (acc: SavedAccountSummary) => void;
}

interface FeatureItem {
  id: string;
  icon: any;
  iconBg: string;
  iconColor: string;
  title: string;
  badge: string;
  description: string;
}

const FEATURES: FeatureItem[] = [
  {
    id: 'f1',
    icon: GraduationCapIcon,
    iconBg: 'bg-emerald-100',
    iconColor: 'text-emerald-700',
    title: '2026 Yeni Nesil Sınavlar',
    badge: 'ÖSYM & MEB Uyumlu',
    description: 'YKS (TYT-AYT), LGS ve KPSS için 200+ güncel soru ve sınav denemeleri.'
  },
  {
    id: 'f2',
    icon: Bot,
    iconBg: 'bg-indigo-100',
    iconColor: 'text-indigo-700',
    title: 'Gemini AI Akıllı Koç',
    badge: '7/24 Özel Ders',
    description: 'Takıldığın her soruyu 3D maskotuna sor, adım adım ipucuyla kolayca öğren.'
  },
  {
    id: 'f3',
    icon: Zap,
    iconBg: 'bg-amber-100',
    iconColor: 'text-amber-800',
    title: 'Canlı Kapışma & Düello',
    badge: 'Anlık Yarış',
    description: 'Arkadaşlarınla ve Türkiye çapındaki öğrencilerle anlık soru düellosuna gir.'
  },
  {
    id: 'f4',
    icon: Trophy,
    iconBg: 'bg-rose-100',
    iconColor: 'text-rose-700',
    title: 'Oyunlaştırılmış Başarı',
    badge: 'Ödüller & Kostümler',
    description: 'Günlük seriler yap, sandıkları aç, XP topla ve 3D maskotunu özelleştir.'
  }
];

function GraduationCapIcon(props: any) {
  return <BookOpen {...props} />;
}

export const KnowzaSplash: React.FC<KnowzaSplashProps> = ({ 
  onStartGoogle, 
  onOpenEmailAuth,
  onGuestStart,
  onSelectSavedAccount,
}) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [savedAccounts] = useState<SavedAccountSummary[]>(() => listSavedAccounts());
  const primaryAccount = savedAccounts[0] || null;

  // Auto rotate feature showcase every 4 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % FEATURES.length);
    }, 4200);
    return () => clearInterval(timer);
  }, []);

  const feat = FEATURES[activeFeature];
  const IconComp = feat.icon;

  return (
    <div className="min-h-[100dvh] max-h-[100dvh] w-full box-border bg-gradient-to-b from-[#FFFDF5] via-[#FFF9ED] to-[#FFF3DC] flex flex-col justify-between items-center px-3.5 py-3.5 select-none overflow-y-auto overflow-x-hidden relative">
      
      {/* Background Ambient Glows */}
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-80 h-72 bg-gradient-to-b from-amber-300/40 via-yellow-200/20 to-transparent rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-1/3 -right-20 w-60 h-60 bg-amber-400/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-60 h-60 bg-yellow-400/15 rounded-full blur-3xl pointer-events-none" />

      {/* ================= 1. HEADER & BRAND ================= */}
      <div className="w-full flex flex-col items-center text-center relative z-10 pt-1">
        {/* Rating Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/90 border border-amber-200 shadow-sm text-[11px] font-black text-amber-900 mb-2 animate-fade">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          </div>
          <span className="font-extrabold">4.9 Puan</span>
          <span className="text-amber-400">•</span>
          <span className="text-slate-600 font-bold">100.000+ Öğrenci</span>
        </div>

        {/* 3D HD Logo */}
        <div className="w-44 sm:w-52 filter drop-shadow-[0_4px_12px_rgba(255,184,0,0.3)]">
          <img 
            src="/assets/knowza_logo_hd.png" 
            alt="Knowza 3D Logo" 
            className="w-full h-auto object-contain"
          />
        </div>
        <p className="text-[#8C7A5E] font-black text-xs mt-0.5 tracking-wide">
          Sınavlara Hazırlığın Yeni Nesil Akıllı Yolu 🎓✨
        </p>
      </div>

      {/* ================= 2. 3D FULL-BODY MASCOT STAGE ================= */}
      <div className="w-full max-w-[350px] mx-auto flex flex-col items-center justify-center relative z-10 my-auto py-1">
        <div className="relative w-full flex flex-col items-center justify-center">
          {/* Soft Ambient Floor Glow (No harsh box or cheap oval border) */}
          <div className="absolute bottom-3 w-44 h-7 bg-amber-500/20 rounded-full blur-md pointer-events-none" />

          {/* Full-Body 3D Mascot - Seamlessly Blended */}
          <div className="relative z-10 w-48 sm:w-52 max-h-[28vh] flex items-center justify-center animate-float">
            <img
              src="/assets/knowza_main.png"
              alt="Knowza 3D Ayıcık Maskotu"
              className="w-full h-auto max-h-[27vh] object-contain mx-auto mix-blend-multiply drop-shadow-[0_14px_24px_rgba(180,83,9,0.18)]"
            />
          </div>

          {/* Balanced Symmetrical Pills Directly Below */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mt-2.5 z-20">
            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-amber-200/80 shadow-xs text-[10px] font-black text-slate-800">
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-[9px] font-black">✓</span>
              <span>2026 Maarif Müfredatı</span>
            </div>

            <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-md border border-indigo-200/80 shadow-xs text-[10px] font-black text-slate-800">
              <Sparkles className="w-3 h-3 text-indigo-500 fill-indigo-400" />
              <span>Gemini AI Koç</span>
            </div>
          </div>
        </div>

        {/* ================= 3. INTERACTIVE FEATURE CARD CAROUSEL ================= */}
        <div className="w-full mt-4 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/80 p-3 shadow-md">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${feat.iconBg} ${feat.iconColor} flex items-center justify-center flex-shrink-0 shadow-inner`}>
              <IconComp className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-black text-slate-900 truncate">{feat.title}</h4>
                <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-800">
                  {feat.badge}
                </span>
              </div>
              <p className="text-[11px] font-bold text-slate-500 leading-tight mt-0.5 line-clamp-2">
                {feat.description}
              </p>
            </div>
          </div>

          {/* Dot Indicators */}
          <div className="flex items-center justify-center gap-1.5 pt-2.5 mt-2 border-t border-amber-100/80">
            {FEATURES.map((f, idx) => (
              <button
                key={f.id}
                onClick={() => {
                  sound.playClick();
                  setActiveFeature(idx);
                }}
                aria-label={f.title}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  activeFeature === idx 
                    ? 'w-6 bg-[#FFB800]' 
                    : 'w-1.5 bg-amber-200 hover:bg-amber-300'
                }`}
              />
            ))}
          </div>
        </div>

      </div>

      {/* ================= 4. AUTHENTIC ACTION BUTTONS ================= */}
      <div className="w-full max-w-[350px] mx-auto space-y-2 pb-1 relative z-10">
        
        {/* Instant 1-Click Continue for Saved Account */}
        {primaryAccount && (
          <button
            onClick={() => {
              sound.playClick();
              if (onSelectSavedAccount) {
                onSelectSavedAccount(primaryAccount);
              } else {
                onStartGoogle();
              }
            }}
            className="w-full p-3 bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:brightness-105 text-white font-black text-xs rounded-2xl border-b-[4px] border-amber-900 shadow-md flex items-center justify-between gap-2.5 transition active:scale-98 group"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              {primaryAccount.avatarUrl ? (
                <img
                  src={primaryAccount.avatarUrl}
                  alt={primaryAccount.email}
                  className="w-8 h-8 rounded-full border border-white/60 object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-xs font-black flex-shrink-0">
                  {primaryAccount.email.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="text-left min-w-0">
                <span className="text-xs font-black block truncate leading-tight">
                  {primaryAccount.username || primaryAccount.email.split('@')[0]} olarak Devam Et ⚡
                </span>
                <span className="text-[10px] font-bold text-amber-100 block truncate">
                  {primaryAccount.email} • {primaryAccount.xp} XP • {primaryAccount.streak}g seri
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-white/90 group-hover:translate-x-1 transition flex-shrink-0" />
          </button>
        )}

        {/* Google 1-Click Sign-in Button */}
        <button
          onClick={() => {
            sound.playClick();
            onStartGoogle();
          }}
          className="w-full py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-black text-sm rounded-2xl border-2 border-slate-200 hover:border-slate-300 active:border-slate-300 active:translate-y-0.5 transition shadow-[0_4px_12px_rgba(0,0,0,0.06)] flex items-center justify-center gap-3 group"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          <span>Google ile Tek Tıkla Giriş Yap</span>
        </button>

        {/* E-posta ile Kaydol / Giriş Yap */}
        <button
          onClick={() => {
            sound.playClick();
            onOpenEmailAuth();
          }}
          className="w-full py-3.5 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 text-[#2A1E00] font-black text-sm rounded-2xl border-b-[5px] border-[#D99000] active:border-b-0 active:translate-y-1 transition shadow-[0_8px_20px_rgba(255,184,0,0.3)] flex items-center justify-center gap-2"
        >
          <Mail className="w-4 h-4 stroke-[2.5]" />
          <span>E-posta ile Ücretsiz Katıl</span>
          <ChevronRight className="w-4 h-4 stroke-[3]" />
        </button>

        {/* Optional Guest Mode Link */}
        {onGuestStart && (
          <div className="pt-0.5 text-center">
            <button
              onClick={() => {
                sound.playClick();
                onGuestStart();
              }}
              className="text-[11px] font-black text-amber-800 hover:text-amber-950 underline underline-offset-2 transition"
            >
              Mevcut hesabınla hızlı giriş yap →
            </button>
          </div>
        )}

        {/* Security & MEB Compliance Badge */}
        <div className="flex items-center justify-center gap-1.5 pt-1 text-slate-500 text-[10px] font-bold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
          <span>Google Play & MEB 2026 Standartlarında Güvenli Giriş</span>
        </div>
      </div>

    </div>
  );
};
