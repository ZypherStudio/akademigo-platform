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

interface KnowzaSplashProps {
  onStartGoogle: () => void;
  onOpenEmailAuth: () => void;
  onGuestStart?: () => void;
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
  onGuestStart 
}) => {
  const [activeFeature, setActiveFeature] = useState(0);

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
    <div className="min-h-[100dvh] max-h-[100dvh] w-full bg-gradient-to-b from-[#FFFDF5] via-[#FFF9ED] to-[#FFF3DC] flex flex-col justify-between items-center px-4 py-4 select-none overflow-y-auto overflow-x-hidden relative">
      
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

      {/* ================= 2. 3D MASCOT STAGE ================= */}
      <div className="w-full max-w-sm flex flex-col items-center justify-center relative z-10 my-auto py-1">
        
        <div className="relative w-full flex items-center justify-center">
          
          {/* Floating Badge 1 - Left */}
          <div className="absolute left-2 sm:left-4 top-4 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-amber-200 shadow-md flex items-center gap-1.5 animate-bounceSubtle">
            <div className="w-5 h-5 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center font-black text-xs">
              ✓
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase text-emerald-600 block leading-tight">Müfredat</span>
              <span className="text-[11px] font-black text-slate-800 leading-tight">2026 Hazır</span>
            </div>
          </div>

          {/* Floating Badge 2 - Right */}
          <div className="absolute right-2 sm:right-4 top-8 z-20 bg-white/95 backdrop-blur-md px-2.5 py-1.5 rounded-2xl border border-indigo-200 shadow-md flex items-center gap-1.5 animate-bounceSubtle" style={{ animationDelay: '1s' }}>
            <div className="w-5 h-5 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Sparkles className="w-3 h-3" />
            </div>
            <div className="text-left">
              <span className="text-[9px] font-black uppercase text-indigo-600 block leading-tight">Yapay Zekâ</span>
              <span className="text-[11px] font-black text-slate-800 leading-tight">Gemini Koç</span>
            </div>
          </div>

          {/* 3D Glowing Radial Stage Pedestal Beneath Mascot */}
          <div className="absolute -bottom-2 w-48 sm:w-56 h-14 bg-gradient-to-r from-amber-300/40 via-yellow-300/80 to-amber-300/40 rounded-[100%] blur-[2px] border-2 border-amber-300/60 shadow-[0_12px_28px_rgba(245,158,11,0.35)]" />
          <div className="absolute bottom-1 w-36 h-7 bg-amber-500/25 rounded-[100%] blur-[3px]" />

          {/* Mascot Character - Properly Centered */}
          <div className="relative z-10 w-44 sm:w-52 max-h-[30vh] flex items-center justify-center filter drop-shadow-[0_14px_22px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform duration-300">
            <img 
              src="/assets/knowza_main.png" 
              alt="Knowza Ayıcığı Maskotu" 
              className="w-full h-auto max-h-[29vh] object-contain"
            />
          </div>

          {/* Floating Badge 3 - Bottom Center */}
          <div className="absolute -bottom-3 z-20 bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 font-black text-[11px] px-3.5 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-amber-200">
            <Flame className="w-3.5 h-3.5 fill-amber-950 text-amber-950" />
            <span>Duolingo Tarzı Günlük Seri & XP</span>
          </div>
        </div>

        {/* ================= 3. INTERACTIVE FEATURE CARD CAROUSEL ================= */}
        <div className="w-full mt-6 bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/80 p-3 shadow-md">
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
      <div className="w-full max-w-sm space-y-2 pb-1 relative z-10">
        
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
              Giriş yapmadan misafir olarak göz at →
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
