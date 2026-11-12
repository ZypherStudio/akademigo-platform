import React, { useState } from 'react';
import { CourseCategory, QuickToolId } from '../types';
import { useGame } from '../context/GameContext';
import { QUICK_TOOLS, QUICK_TOOL_MAP } from '../data/quickToolsData';
import { getDisplayIdentity } from '../utils/accountStorage';
import { sound } from '../utils/audio';
import {
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Flame,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface KnowzaOnboardingProps {
  onComplete: () => void;
  onSkip?: () => void;
}

interface GoalOption {
  id: CourseCategory;
  title: string;
  subtitle: string;
  details: string;
  icon: string;
  badge: string;
  tagColor: string;
  recommendedTools: QuickToolId[];
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    id: 'yks',
    title: 'YKS (TYT - AYT)',
    subtitle: 'Üniversite Sınavı',
    details: 'Matematik, Türkçe, Fizik, Kimya, Biyoloji ve Geometri',
    icon: '🎓',
    badge: 'ÖSYM',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
    recommendedTools: ['tests', 'exams', 'duel', 'countdown'],
  },
  {
    id: 'lgs',
    title: '8. Sınıf LGS',
    subtitle: 'Liselere Geçiş Sistemi',
    details: 'Yeni nesil MEB mantık soruları, EBOB-EKOK, Fen ve Türkçe',
    icon: '📚',
    badge: 'MEB',
    tagColor: 'bg-blue-100 text-blue-900 border-blue-300',
    recommendedTools: ['tests', 'exams', 'duel', 'aicoach'],
  },
  {
    id: 'kpss',
    title: 'KPSS (GY - GK)',
    subtitle: 'Kamu Personeli Memurluk',
    details: 'İnkılap Tarihi, Anayasa, Vatandaşlık ve Güncel Bilgiler',
    icon: '🏛️',
    badge: 'Memurluk',
    tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
    recommendedTools: ['tests', 'exams', 'countdown', 'errors'],
  },
  {
    id: 'kodlama',
    title: 'Kodlama & Yazılım',
    subtitle: 'Python & Algoritma',
    details: 'Değişkenler, döngüler, veri yapıları ve kodlama laboratuvarı',
    icon: '💻',
    badge: 'Yazılım',
    tagColor: 'bg-purple-100 text-purple-900 border-purple-300',
    recommendedTools: ['tests', 'codelab', 'duel', 'aicoach'],
  },
  {
    id: 'dil',
    title: 'İngilizce & Dil',
    subtitle: 'A1 - B2 Pratik & YDS',
    details: 'Günlük diyaloglar, gramer ve akademik kelimeler',
    icon: '🌐',
    badge: 'Dil Okulu',
    tagColor: 'bg-cyan-100 text-cyan-900 border-cyan-300',
    recommendedTools: ['tests', 'reels', 'aicoach', 'duel'],
  },
];

export const KnowzaOnboarding: React.FC<KnowzaOnboardingProps> = ({ onComplete, onSkip }) => {
  const { stats, completeOnboarding } = useGame();
  const [step, setStep] = useState<number>(1);

  const initialGoal: CourseCategory = stats.targetGoal || 'yks';
  const [targetGoal, setTargetGoal] = useState<CourseCategory>(initialGoal);
  const [preferredQuickTools, setPreferredQuickTools] = useState<QuickToolId[]>(
    stats.preferredQuickTools && stats.preferredQuickTools.length > 0
      ? stats.preferredQuickTools
      : GOAL_OPTIONS.find((g) => g.id === initialGoal)?.recommendedTools || ['tests', 'duel', 'exams', 'aicoach']
  );
  const [dailyGoalQuestions, setDailyGoalQuestions] = useState<number>(stats.dailyGoalQuestions || 25);

  const identity = getDisplayIdentity(stats);

  const handleSelectGoal = (goal: GoalOption) => {
    sound.playClick();
    setTargetGoal(goal.id);
    if (!stats.hasCompletedOnboarding) {
      setPreferredQuickTools(goal.recommendedTools);
    }
  };

  const toggleQuickTool = (toolId: QuickToolId) => {
    sound.playClick();
    setPreferredQuickTools((prev) => {
      if (prev.includes(toolId)) {
        // Keep at least 1 tool selected
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== toolId);
      }
      if (prev.length >= 4) {
        // Replace oldest selection to stay at 4 max
        return [...prev.slice(1), toolId];
      }
      return [...prev, toolId];
    });
  };

  const handleNext = () => {
    sound.playClick();
    if (step < 4) {
      setStep((prev) => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handleBack = () => {
    sound.playClick();
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
  };

  const handleFinish = () => {
    completeOnboarding({
      targetGoal,
      preferredQuickTools,
      dailyGoalQuestions,
    });
    onComplete();
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#FFFDF7] flex flex-col justify-between items-center px-4 py-4 select-none overflow-hidden relative">
      {/* Top Background Glow */}
      <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-full max-w-[420px] h-[220px] bg-gradient-to-b from-[#FFE8B3] via-[#FFF3D6] to-transparent rounded-full opacity-60 pointer-events-none" />

      {/* Top Header & Progress (4 Steps) */}
      <div className="w-full max-w-md pt-1 relative z-10">
        <div className="flex items-center justify-between mb-2">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="w-8 h-8 rounded-full bg-white border border-amber-200 flex items-center justify-center text-slate-700 active:scale-90 transition shadow-xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          ) : (
            <div className="w-8 h-8" />
          )}

          <div className="flex items-center gap-1.5">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step
                    ? 'w-7 bg-[#FFB800]'
                    : s < step
                    ? 'w-2 bg-[#FFD54F]'
                    : 'w-2 bg-amber-100'
                }`}
              />
            ))}
          </div>

          {onSkip ? (
            <button
              onClick={onSkip}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 px-2 py-1"
            >
              Kapat
            </button>
          ) : (
            <div className="w-8 h-8" />
          )}
        </div>
      </div>

      {/* Dynamic Content Container */}
      <div className="flex-1 w-full max-w-md flex flex-col justify-center items-center py-2 relative z-10 overflow-y-auto scrollbar-none">
        {/* ================= STEP 1: HEDEF SINAV / ALAN ================= */}
        {step === 1 && (
          <div className="w-full flex flex-col items-center text-center animate-fade space-y-3">
            <div className="w-24 sm:w-28 filter drop-shadow-lg animate-bounceSubtle">
              <img
                src="/assets/knowza_main.png"
                alt="Knowza Ayıcık"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="bg-white rounded-3xl p-3.5 border-2 border-[#FFE2A3] shadow-md relative max-w-xs">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-[#FFE2A3] rotate-45" />
              <p className="text-sm font-black text-[#2A1E00] leading-snug">
                Hoş geldin! Ana hedefin hangisi? 🎯
              </p>
              <span className="text-[10px] font-bold text-amber-800 block mt-0.5">
                {stats.email ? `${stats.email} hesabı için ` : ''}ana ekranını bu hedefe göre hazırlayacağım.
              </span>
            </div>

            <div className="w-full max-w-sm space-y-2 max-h-64 overflow-y-auto scrollbar-none px-1">
              {GOAL_OPTIONS.map((goal) => {
                const isSelected = targetGoal === goal.id;
                return (
                  <button
                    key={goal.id}
                    onClick={() => handleSelectGoal(goal)}
                    className={`w-full p-3 rounded-2xl border-2 text-left transition-all active:scale-98 flex items-center justify-between ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#FFF8E7] to-[#FFEABF] border-[#FFB800] shadow-md ring-2 ring-[#FFB800]/40'
                        : 'bg-white border-[#F2E8D5] hover:border-amber-200 hover:bg-[#FFFDF7]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-2xl flex-shrink-0 shadow-xs">
                        {goal.icon}
                      </div>
                      <div className="min-w-0 flex-1 pr-2">
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-xs sm:text-sm font-black text-slate-900 truncate">
                            {goal.title}
                          </h4>
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full border ${goal.tagColor}`}>
                            {goal.badge}
                          </span>
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">
                          {goal.details}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                        isSelected ? 'bg-[#FFB800] border-[#D99000]' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-900 fill-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 2: EN ÇOK NE KULLANACAKSIN (HIZLI GİRİŞ) ================= */}
        {step === 2 && (
          <div className="w-full flex flex-col items-center text-center animate-fade space-y-3">
            <div className="w-20 sm:w-24 filter drop-shadow-lg">
              <img
                src="/assets/knowza_reading.png"
                alt="Knowza Ayıcık"
                className="w-full h-auto object-contain animate-float"
              />
            </div>

            <div className="bg-white rounded-3xl p-3.5 border-2 border-[#FFE2A3] shadow-md relative max-w-xs">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-[#FFE2A3] rotate-45" />
              <p className="text-sm font-black text-[#2A1E00] leading-snug">
                En çok neleri kullanacaksın? ⚡
              </p>
              <span className="text-[10px] font-bold text-amber-800 block mt-0.5">
                En fazla 4 özellik seç — ana ekranında <span className="underline">Hızlı Giriş</span> olarak öne çıksın!
              </span>
            </div>

            <div className="text-[10px] font-black text-amber-900 bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
              {preferredQuickTools.length} / 4 Hızlı Giriş Seçildi
            </div>

            <div className="w-full max-w-sm grid grid-cols-2 gap-2 max-h-64 overflow-y-auto scrollbar-none px-1 pb-1">
              {QUICK_TOOLS.map((tool) => {
                const isSelected = preferredQuickTools.includes(tool.id);
                return (
                  <button
                    key={tool.id}
                    type="button"
                    onClick={() => toggleQuickTool(tool.id)}
                    className={`p-2.5 rounded-2xl border-2 text-left transition-all active:scale-96 flex flex-col justify-between relative ${
                      isSelected
                        ? 'bg-gradient-to-br from-[#FFF8E7] to-[#FFEABF] border-[#FFB800] shadow-md ring-2 ring-[#FFB800]/30'
                        : 'bg-white border-[#F2E8D5] hover:border-amber-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className="text-xl">{tool.emoji}</span>
                      {isSelected && (
                        <span className="w-4 h-4 rounded-full bg-[#FFB800] flex items-center justify-center">
                          <CheckCircle2 className="w-3.5 h-3.5 text-slate-900 fill-white" />
                        </span>
                      )}
                    </div>
                    <div>
                      <div className="text-xs font-black text-slate-900 leading-tight">{tool.title}</div>
                      <div className="text-[9px] font-bold text-slate-500 leading-tight mt-0.5 line-clamp-2">
                        {tool.subtitle}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 3: GÜNLÜK HEDEF ================= */}
        {step === 3 && (
          <div className="w-full flex flex-col items-center text-center animate-fade space-y-4">
            <div className="w-28 sm:w-32 filter drop-shadow-lg animate-bounceSubtle">
              <img
                src="/assets/knowza_dogru.png"
                alt="Knowza Ayıcık Başparmak"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="bg-white rounded-3xl p-4 border-2 border-[#FFE2A3] shadow-md relative max-w-xs">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-[#FFE2A3] rotate-45" />
              <p className="text-sm font-black text-[#2A1E00] leading-snug">
                Günde kaç soru çözmek istersin? 🔥
              </p>
              <span className="text-[10px] font-bold text-amber-700/80 block mt-1">
                Serin ve ELO gelişimin hesabına otomatik kaydedilir.
              </span>
            </div>

            <div className="w-full max-w-xs space-y-2.5">
              {[
                { count: 10, label: 'Rahat Tempo', desc: '~5 dakika / gün', xp: '+100 XP', icon: '⚡' },
                { count: 25, label: 'Düzenli (Önerilen)', desc: '~15 dakika / gün', xp: '+250 XP', icon: '🎯', isBest: true },
                { count: 50, label: 'Yoğun / Derece', desc: '~30 dakika / gün', xp: '+500 XP', icon: '🚀' },
              ].map((pace) => {
                const isSelected = dailyGoalQuestions === pace.count;
                return (
                  <button
                    key={pace.count}
                    onClick={() => {
                      setDailyGoalQuestions(pace.count);
                      sound.playClick();
                    }}
                    className={`w-full p-3.5 rounded-2xl border-2 text-left transition-all active:scale-98 flex items-center justify-between relative ${
                      isSelected
                        ? 'bg-[#FFF8E7] border-[#FFB800] shadow-md ring-2 ring-[#FFB800]/40'
                        : 'bg-white border-[#F2E8D5] hover:bg-amber-50/50'
                    }`}
                  >
                    {pace.isBest && (
                      <span className="absolute -top-2 right-4 bg-[#FFB800] text-slate-900 text-[9px] font-black px-2 py-0.5 rounded-full shadow-xs">
                        ÖNERİLEN
                      </span>
                    )}
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{pace.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-black text-slate-900">
                            Günde {pace.count} Soru
                          </span>
                          <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-1.5 py-0.2 rounded">
                            {pace.xp}
                          </span>
                        </div>
                        <span className="text-[11px] font-bold text-slate-500 block">
                          {pace.label} • {pace.desc}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isSelected ? 'bg-[#FFB800] border-[#D99000]' : 'border-slate-300'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-slate-900 fill-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ================= STEP 4: ÖZET & HIZLI GİRİŞ ÖNİZLEME ================= */}
        {step === 4 && (
          <div className="w-full flex flex-col items-center text-center animate-fade space-y-4">
            <div className="w-28 sm:w-32 filter drop-shadow-xl animate-bounceSubtle">
              <img
                src="/assets/knowza_cheering.png"
                alt="Knowza Ayıcık Kutluyor"
                className="w-full h-auto object-contain"
              />
            </div>

            <div className="bg-white rounded-3xl p-4 border-2 border-[#FFE2A3] shadow-md relative max-w-xs">
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white border-t-2 border-l-2 border-[#FFE2A3] rotate-45" />
              <p className="text-base font-black text-[#2A1E00] leading-snug">
                Her şey hazır! 🐻🎉
              </p>
              <p className="text-xs font-bold text-slate-600 mt-1">
                Ana ekranındaki <span className="text-amber-800 font-extrabold">Hızlı Giriş</span> bölümünü seçtiklerine göre düzenledim.
              </p>
            </div>

            <div className="w-full max-w-xs bg-gradient-to-br from-[#FFF8E7] via-white to-[#FFEABF] rounded-2xl p-3.5 border-2 border-[#FFE2A3] shadow-sm text-left space-y-2.5">
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-amber-200/60">
                <span className="font-bold text-slate-500">Hesap:</span>
                <span className="font-black text-slate-900 truncate max-w-[180px]">
                  {stats.email || identity.primary}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-amber-200/60">
                <span className="font-bold text-slate-500">Öncelikli Alan:</span>
                <span className="font-black text-amber-900">
                  {GOAL_OPTIONS.find((g) => g.id === targetGoal)?.title}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs pb-1.5 border-b border-amber-200/60">
                <span className="font-bold text-slate-500">Günlük Hedef:</span>
                <span className="font-black text-amber-800 flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-amber-500" />
                  {dailyGoalQuestions} Soru / gün
                </span>
              </div>
              <div className="pt-0.5">
                <span className="text-[10px] font-black text-slate-500 flex items-center gap-1 mb-1.5">
                  <Zap className="w-3 h-3 text-amber-600" />
                  Ana Ekran Hızlı Girişlerin:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {preferredQuickTools.map((id) => {
                    const meta = QUICK_TOOL_MAP[id];
                    if (!meta) return null;
                    return (
                      <span
                        key={id}
                        className="inline-flex items-center gap-1 bg-white border border-amber-300 text-amber-950 px-2 py-1 rounded-xl text-[10px] font-black shadow-2xs"
                      >
                        <span>{meta.emoji}</span>
                        <span>{meta.shortTitle}</span>
                      </span>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Action Button */}
      <div className="w-full max-w-sm pb-2 pt-1 relative z-10">
        <button
          onClick={handleNext}
          className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 text-[#2A1E00] font-black text-base sm:text-lg rounded-2xl border-b-[5px] border-[#D99000] active:border-b-0 active:translate-y-1 transition-all shadow-[0_8px_20px_rgba(255,184,0,0.3)] flex items-center justify-center gap-2"
        >
          {step === 4 ? (
            <>
              <Sparkles className="w-5 h-5 text-[#2A1E00]" />
              <span>Ana Ekrana Geç! 🚀</span>
            </>
          ) : (
            <>
              <span>Devam Et</span>
              <ChevronRight className="w-5 h-5 stroke-[3]" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
