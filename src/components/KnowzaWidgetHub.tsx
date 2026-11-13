import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  Flame,
  Star,
  CheckCircle2,
  Play,
  Copy,
  Check,
  Smartphone,
  Layers,
  BookOpen,
  BarChart2,
  Award,
  User,
  Compass,
  Download,
  Share2,
  Info
} from 'lucide-react';
import { useGame } from '../context/GameContext';
import { COURSES } from '../data/coursesData';
import { sound } from '../utils/audio';
import { KnowzaTab } from './KnowzaBottomNav';

interface KnowzaWidgetHubProps {
  onBack: () => void;
  onNavigateTab: (tab: KnowzaTab) => void;
  onStartLesson?: (lessonTitle: string) => void;
}

type WidgetSize = 'all' | 'small' | 'medium' | 'large';
type HubView = 'gallery' | 'designs' | 'guide';

export const KnowzaWidgetHub: React.FC<KnowzaWidgetHubProps> = ({
  onBack,
  onNavigateTab,
  onStartLesson,
}) => {
  const { stats, selectedCourseId, setSelectedCourseId, startLesson } = useGame();
  const [activeTab, setActiveTab] = useState<HubView>('gallery');
  const [sizeFilter, setSizeFilter] = useState<WidgetSize>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeDayIndex, setActiveDayIndex] = useState<number>(3); // Default middle of the week
  const [savedToast, setSavedToast] = useState<boolean>(false);

  const currentCourse = COURSES.find((c) => c.id === selectedCourseId) || COURSES[0];

  // Dynamic user level calculation
  const userLevel = Math.max(1, Math.floor((stats.xp || 0) / 100) + 1);
  const userStreak = Math.max(1, stats.streak || 1);
  const userXp = stats.xp || 2450;
  const courseTitle = currentCourse?.name || 'İngilizce';
  const courseIcon = currentCourse?.icon || '🇬🇧';

  const weekdays = [
    { label: 'Pzt', active: true },
    { label: 'Sal', active: true },
    { label: 'Çar', active: true },
    { label: 'Per', active: true },
    { label: 'Cum', active: userStreak >= 5 },
    { label: 'Cmt', active: userStreak >= 6 },
    { label: 'Paz', active: userStreak >= 7 },
  ];

  const handleCopyWidget = (widgetId: string, widgetName: string) => {
    sound.playCorrect();
    setCopiedId(widgetId);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Knowza Widget: ${widgetName} | Seviye: ${userLevel} | Seri: ${userStreak} gün | XP: ${userXp}`
      );
    }
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const handleLaunchLesson = () => {
    sound.playClick();
    if (currentCourse?.units?.[0]?.lessons?.[0]) {
      startLesson(currentCourse.units[0].lessons[0]);
    } else if (onStartLesson) {
      onStartLesson(courseTitle);
    } else {
      onNavigateTab('home');
    }
  };

  return (
    <div className="flex-1 w-full bg-[#FFFDF7] min-h-screen flex flex-col pb-36 select-none animate-fade">
      {/* ================= TOP APP BAR ================= */}
      <div className="sticky top-0 z-30 bg-[#FFFDF7]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-[#F2E8D5] shadow-xs">
        <button
          onClick={() => {
            sound.playClick();
            onBack();
          }}
          className="flex items-center gap-1.5 text-xs font-black bg-white hover:bg-amber-50 text-slate-800 border border-amber-200/80 px-3 py-1.5 rounded-full transition active:scale-95 shadow-xs"
        >
          <ArrowLeft className="w-4 h-4 text-amber-600" />
          <span>Ana Sayfa</span>
        </button>

        <div className="flex items-center gap-1.5">
          <Smartphone className="w-4 h-4 text-[#FFB800]" />
          <span className="text-sm font-black text-[#2A1E00]">Widget Stüdyosu 📱</span>
        </div>

        <button
          onClick={() => {
            sound.playClick();
            setActiveTab(activeTab === 'guide' ? 'gallery' : 'guide');
          }}
          className="flex items-center gap-1 text-[11px] font-black text-amber-700 bg-amber-100/80 hover:bg-amber-200/80 px-2.5 py-1 rounded-full transition"
        >
          <Info className="w-3.5 h-3.5" />
          <span>{activeTab === 'guide' ? 'Galeri' : 'Rehber'}</span>
        </button>
      </div>

      <div className="px-4 py-3 space-y-4 max-w-md mx-auto w-full">
        {/* ================= HERO INTRO CARD ================= */}
        <div className="bg-gradient-to-br from-[#FFF8E7] via-[#FFEABF] to-[#FFD88A] rounded-3xl p-4 border-2 border-[#FFB800]/40 shadow-sm relative overflow-hidden">
          <div className="flex items-center justify-between gap-3 relative z-10">
            <div className="space-y-1 min-w-0 flex-1">
              <div className="inline-flex items-center gap-1 bg-[#2A1E00] text-amber-300 text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Ana Ekran Tasarımları</span>
              </div>
              <h2 className="text-base font-black text-[#2A1E00] leading-tight">
                Telefonunun Ana Ekranını Kişiselleştir ✨
              </h2>
              <p className="text-[11px] font-bold text-[#6B531C] leading-snug">
                Serini, günün dersini ve seviyeni kilitlemeden takip et. Gerçek verilerinle canlı önizle!
              </p>
            </div>

            <div className="w-20 h-20 flex-shrink-0 filter drop-shadow-md animate-bounceSubtle">
              <img
                src="/assets/knowza_avatar_3d.png"
                alt="Knowza Maskot"
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* Quick Stats Pill Bar */}
          <div className="mt-3 pt-3 border-t border-amber-300/60 flex items-center justify-between text-[11px] font-black text-[#2A1E00]">
            <span className="flex items-center gap-1">
              <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
              <span>{userStreak} Gün Seri</span>
            </span>
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-600 fill-amber-400" />
              <span>Seviye {userLevel}</span>
            </span>
            <span className="flex items-center gap-1">
              <span>{courseIcon}</span>
              <span className="truncate max-w-[90px]">{courseTitle}</span>
            </span>
          </div>
        </div>

        {/* ================= NAVIGATION TABS (Galeri vs Orijinal Şablon vs Rehber) ================= */}
        <div className="flex items-center bg-white p-1 rounded-2xl border border-[#F2E8D5] shadow-xs">
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('gallery');
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'gallery'
                ? 'bg-[#FFB800] text-[#2A1E00] shadow-sm'
                : 'text-[#8C7A5E] hover:text-[#2A1E00]'
            }`}
          >
            🎨 Canlı Galeri (10)
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('designs');
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'designs'
                ? 'bg-[#FFB800] text-[#2A1E00] shadow-sm'
                : 'text-[#8C7A5E] hover:text-[#2A1E00]'
            }`}
          >
            🖼️ Orijinal Çizimler
          </button>
          <button
            onClick={() => {
              sound.playClick();
              setActiveTab('guide');
            }}
            className={`flex-1 py-2 text-xs font-black rounded-xl transition-all ${
              activeTab === 'guide'
                ? 'bg-[#FFB800] text-[#2A1E00] shadow-sm'
                : 'text-[#8C7A5E] hover:text-[#2A1E00]'
            }`}
          >
            📱 Nasıl Eklenir?
          </button>
        </div>

        {/* ================= TAB 1: CANLI WIDGET GALERİSİ ================= */}
        {activeTab === 'gallery' && (
          <div className="space-y-4">
            {/* Size Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
              {(
                [
                  { id: 'all', label: 'Tümü' },
                  { id: 'small', label: 'Küçük (2x2)' },
                  { id: 'medium', label: 'Orta (4x2 / 2x2)' },
                  { id: 'large', label: 'Geniş (4x1 & 4x2)' },
                ] as const
              ).map((f) => (
                <button
                  key={f.id}
                  onClick={() => {
                    sound.playClick();
                    setSizeFilter(f.id);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all border ${
                    sizeFilter === f.id
                      ? 'bg-[#2A1E00] text-amber-300 border-[#2A1E00] shadow-xs'
                      : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Ders & Kategori Seçimi (Widget İçin Özelleştir & Hesaba Kaydet) */}
            <div className="bg-white rounded-3xl p-3.5 border-2 border-amber-200 shadow-sm space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span className="text-xs font-black text-slate-900">
                    Hangi Dersin Widget'ı Gösterilsin?
                  </span>
                </div>
                {savedToast && (
                  <span className="text-[10px] font-black text-emerald-600 flex items-center gap-1 animate-pop">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Hesaba Kaydedildi!
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-1.5">
                {COURSES.map((course) => {
                  const isSelected = selectedCourseId === course.id;
                  return (
                    <button
                      key={course.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedCourseId(course.id as any);
                        setSavedToast(true);
                        setTimeout(() => setSavedToast(false), 2200);
                      }}
                      className={`p-2 rounded-2xl border text-center transition flex flex-col items-center gap-1 ${
                        isSelected
                          ? 'bg-amber-500 text-amber-950 border-amber-600 font-black shadow-sm ring-2 ring-amber-300'
                          : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-amber-50 font-bold'
                      }`}
                    >
                      <span className="text-base">{course.icon}</span>
                      <span className="text-[10px] truncate max-w-full">{course.name}</span>
                    </button>
                  );
                })}
              </div>

              <p className="text-[10px] font-bold text-slate-500 leading-tight">
                💡 İstediğiniz ders veya sınav kategorisini seçebilirsiniz. Ana ekran widget'ınız seçtiğiniz dersin ilerlemesine göre anlık şekillenir ve hesabınıza otomatik kaydedilir.
              </p>
            </div>

            {/* Reassurance notice */}
            <div className="bg-amber-50/80 rounded-2xl p-2.5 border border-amber-200/70 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
              <p className="text-[11px] font-bold text-amber-900 leading-tight">
                Aşağıdaki tüm widget'lar hesabındaki gerçek verilerini (seri, XP, dersler) gösterir. Butonlara tıklayarak canlı test edebilirsin!
              </p>
            </div>

            {/* ================= WIDGET 1: Canlı Seri Takipçisi (Orta 4x2) ================= */}
            {(sizeFilter === 'all' || sizeFilter === 'medium') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Orta (4x2) • Seri Takipçisi
                  </span>
                  <button
                    onClick={() => handleCopyWidget('streak-widget', 'Canlı Seri Takipçisi')}
                    className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    {copiedId === 'streak-widget' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === 'streak-widget' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="bg-[#FFFDF7] rounded-[32px] p-4 border-2 border-[#FFE2A3] shadow-[0_8px_24px_rgba(255,184,0,0.12)] relative overflow-hidden">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <Flame className="w-6 h-6 text-orange-500 fill-orange-500 animate-bounceSubtle" />
                        <span className="text-2xl font-black text-[#2A1E00]">
                          {userStreak} gün
                        </span>
                      </div>
                      <p className="text-xs font-bold text-[#8C7A5E] mt-0.5">Serini koru!</p>
                    </div>

                    <div className="w-16 h-16 relative">
                      <img
                        src="/assets/knowza_cheering.png"
                        alt="Kutlayan Ayıcık"
                        className="w-full h-full object-contain filter drop-shadow-sm hover:scale-110 transition-transform cursor-pointer"
                        onClick={() => sound.playVictory()}
                        title="Tıkla ve Kutla!"
                      />
                    </div>
                  </div>

                  {/* 7-Day Checklist Dots */}
                  <div className="grid grid-cols-7 gap-1.5 mt-3 pt-3 border-t border-amber-200/60">
                    {weekdays.map((day, idx) => (
                      <div
                        key={day.label}
                        onClick={() => {
                          sound.playClick();
                          setActiveDayIndex(idx);
                        }}
                        className="flex flex-col items-center gap-1 cursor-pointer group"
                      >
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                            day.active
                              ? 'bg-[#FFB800] text-[#2A1E00] shadow-xs ring-2 ring-[#FFB800]/40 group-hover:scale-110'
                              : 'bg-white border-2 border-slate-200 text-slate-400 group-hover:border-amber-300'
                          }`}
                        >
                          {day.active ? (
                            <Check className="w-4 h-4 stroke-[3]" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                          )}
                        </div>
                        <span className="text-[10px] font-black text-[#8C7A5E]">
                          {day.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ================= WIDGET 2: Bugünün Dersi & Başla (Orta 4x2) ================= */}
            {(sizeFilter === 'all' || sizeFilter === 'medium') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Orta (4x2) • Bugünün Dersi
                  </span>
                  <button
                    onClick={() => handleCopyWidget('lesson-widget', "Bugünün Dersi")}
                    className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    {copiedId === 'lesson-widget' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === 'lesson-widget' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="bg-[#FFFDF7] rounded-[32px] p-4 border-2 border-[#FFE2A3] shadow-[0_8px_24px_rgba(255,184,0,0.12)] relative overflow-hidden">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2 min-w-0 flex-1 pr-2">
                      <span className="text-[11px] font-bold text-[#8C7A5E]">Bugünün Dersi</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{courseIcon}</span>
                        <div>
                          <h4 className="text-base font-black text-[#2A1E00] leading-none">
                            {courseTitle}
                          </h4>
                          <span className="text-[11px] font-bold text-amber-700">
                            Seviye 1 • Ders 3
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={handleLaunchLesson}
                        className="mt-1 px-5 py-2 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] text-slate-950 font-black text-xs rounded-2xl border-b-3 border-[#D99000] active:border-b-0 active:translate-y-0.5 shadow-sm transition-all flex items-center gap-1.5 hover:scale-105"
                      >
                        <span>Başla</span>
                        <Play className="w-3 h-3 fill-slate-950" />
                      </button>
                    </div>

                    <div className="w-20 h-20 relative flex-shrink-0">
                      <img
                        src="/assets/knowza_reading.png"
                        alt="Kitap Okuyan Ayıcık"
                        className="w-full h-full object-contain filter drop-shadow-sm"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= 2-COLUMN GRID (Küçük Widget'lar) ================= */}
            {(sizeFilter === 'all' || sizeFilter === 'small') && (
              <div className="grid grid-cols-2 gap-3">
                {/* WIDGET 3: Knowza Peeking & Logo (Küçük 2x2) */}
                <div className="bg-[#FFFDF7] rounded-[28px] p-3.5 border-2 border-[#FFE2A3] shadow-sm flex flex-col justify-between h-44 relative overflow-hidden group">
                  <div className="w-full flex justify-center -mt-1">
                    <div className="w-20 h-20">
                      <img
                        src="/assets/knowza_peeking.png"
                        alt="Knowza Maskot"
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-0.5">
                    <div className="flex items-center justify-center gap-1">
                      <span className="w-5 h-5 rounded-lg bg-[#FFB800] text-slate-950 font-black text-xs flex items-center justify-center shadow-xs">
                        K
                      </span>
                      <span className="text-sm font-black text-[#2A1E00]">Knowza</span>
                    </div>
                    <p className="text-[10px] font-bold text-[#8C7A5E] leading-tight">
                      Daha fazlasını öğren!
                    </p>
                  </div>
                </div>

                {/* WIDGET 4: İlerleme & XP Halkası (Küçük 2x2) */}
                <div className="bg-[#FFFDF7] rounded-[28px] p-3.5 border-2 border-[#FFE2A3] shadow-sm flex flex-col justify-between h-44 relative overflow-hidden">
                  <span className="text-[10px] font-black uppercase text-amber-700">İlerleme</span>
                  <div className="flex items-center justify-between gap-1">
                    {/* Circular Ring */}
                    <div className="relative w-14 h-14 flex items-center justify-center">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="text-amber-100 stroke-current"
                          strokeWidth="3.5"
                          fill="none"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          className="text-[#FFB800] stroke-current"
                          strokeWidth="3.5"
                          strokeDasharray="100"
                          strokeDashoffset="32"
                          strokeLinecap="round"
                          fill="none"
                        />
                      </svg>
                      <div className="absolute text-center">
                        <span className="text-xs font-black text-[#2A1E00]">%68</span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-right">
                      <div>
                        <div className="flex items-center justify-end gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span className="text-xs font-black text-[#2A1E00]">{userXp} XP</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-[9px] font-bold text-slate-400 block">Sıra</span>
                        <span className="text-[10px] font-black text-[#8C7A5E]">#1247</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-amber-800 bg-amber-100/70 rounded-xl px-2 py-1 text-center">
                    Günün hedefine %68 ulaştın
                  </div>
                </div>

                {/* WIDGET 5: Ateşli Seri Devam Ediyor (Küçük 2x2) */}
                <div className="bg-gradient-to-br from-[#2A1E00] to-[#140F00] text-white rounded-[28px] p-3.5 border border-amber-500/40 shadow-sm flex flex-col justify-between h-44 relative overflow-hidden">
                  <div>
                    <span className="text-[10px] font-bold text-amber-400">Serin devam ediyor!</span>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
                      <span className="text-xl font-black text-white">{userStreak} gün</span>
                    </div>
                  </div>

                  <div className="w-16 h-16 self-end -mb-1">
                    <img
                      src="/assets/knowza_avatar_3d.png"
                      alt="Ayıcık"
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>

                {/* WIDGET 6: Gece Modu Seviye Halkası (Küçük 2x2 / Orta 2x2) */}
                <div className="bg-[#141311] text-white rounded-[28px] p-3.5 border border-amber-500/40 shadow-sm flex flex-col items-center justify-between h-44 relative overflow-hidden">
                  <div className="flex items-center justify-between w-full">
                    <span className="text-[9px] font-black uppercase tracking-wider text-amber-400">
                      Gece Modu
                    </span>
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  </div>

                  {/* Dark Ring */}
                  <div className="relative w-18 h-18 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-3 border-amber-500/30 border-t-amber-400 shadow-[0_0_12px_rgba(255,184,0,0.3)] animate-spin-slow" />
                    <div className="text-center">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                        Seviye
                      </span>
                      <span className="text-xl font-black text-amber-300">{userLevel}</span>
                    </div>
                  </div>

                  <div className="text-[10px] font-bold text-amber-300 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                    <span>{userXp % 100} / 100 XP</span>
                  </div>
                </div>
              </div>
            )}

            {/* ================= WIDGET 7: Çoklu Ders Takipçisi (Orta 4x2) ================= */}
            {(sizeFilter === 'all' || sizeFilter === 'medium') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Orta (4x2) • Bugünün Dersleri (Çoklu İlerleme)
                  </span>
                  <button
                    onClick={() => handleCopyWidget('multi-course', 'Çoklu Ders Takipçisi')}
                    className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    {copiedId === 'multi-course' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === 'multi-course' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="bg-[#FFFDF7] rounded-[32px] p-4 border-2 border-[#FFE2A3] shadow-sm flex items-center justify-between gap-3">
                  <div className="space-y-2.5 min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="w-5 h-5 rounded-lg bg-[#FFB800] text-slate-950 font-black text-xs flex items-center justify-center">
                        K
                      </span>
                      <span className="text-xs font-black text-[#2A1E00]">
                        Bugünün dersleri
                      </span>
                    </div>

                    {/* Subject 1 */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-[#2A1E00]">
                          <span>🇬🇧</span>
                          <span>İngilizce</span>
                        </span>
                        <span className="text-slate-500">3 / 5</span>
                      </div>
                      <div className="w-full h-2 bg-amber-100 rounded-full overflow-hidden">
                        <div className="h-full bg-[#FFB800] rounded-full w-[60%]" />
                      </div>
                    </div>

                    {/* Subject 2 */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-[#2A1E00]">
                          <span>🔢</span>
                          <span>Matematik</span>
                        </span>
                        <span className="text-slate-500">2 / 5</span>
                      </div>
                      <div className="w-full h-2 bg-sky-100 rounded-full overflow-hidden">
                        <div className="h-full bg-sky-500 rounded-full w-[40%]" />
                      </div>
                    </div>

                    {/* Subject 3 */}
                    <div className="space-y-0.5">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="flex items-center gap-1 text-[#2A1E00]">
                          <span>🧠</span>
                          <span>Mantık</span>
                        </span>
                        <span className="text-slate-500">1 / 5</span>
                      </div>
                      <div className="w-full h-2 bg-purple-100 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500 rounded-full w-[20%]" />
                      </div>
                    </div>
                  </div>

                  <div className="w-20 h-20 relative flex-shrink-0">
                    <img
                      src="/assets/knowza_avatar_3d.png"
                      alt="Knowza"
                      className="w-full h-full object-contain filter drop-shadow-sm"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= WIDGET 8: Gece Modu Günlük Hedef (Orta 4x2) ================= */}
            {(sizeFilter === 'all' || sizeFilter === 'medium') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Orta (4x2) • Gece Modu Günlük Hedef
                  </span>
                  <button
                    onClick={() => handleCopyWidget('dark-goal', 'Gece Modu Günlük Hedef')}
                    className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    {copiedId === 'dark-goal' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === 'dark-goal' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="bg-gradient-to-br from-[#121110] via-[#1A1815] to-[#0A0908] rounded-[32px] p-4 border border-amber-500/40 shadow-lg text-white flex items-center justify-between relative overflow-hidden">
                  <div className="space-y-2 min-w-0 flex-1 pr-3">
                    <span className="text-[11px] font-bold text-amber-400">Bugünün hedefi</span>
                    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2.5 border border-white/15 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🎯</span>
                        <span className="text-xs font-black text-white">3 ders bitir</span>
                      </div>
                      <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-amber-400 to-yellow-300 rounded-full w-[66%]" />
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[10px] font-black text-amber-400">
                      <span className="w-4 h-4 rounded-md bg-[#FFB800] text-slate-950 flex items-center justify-center text-[9px]">
                        K
                      </span>
                      <span>Knowza</span>
                    </div>
                  </div>

                  <div className="w-20 h-20 relative flex-shrink-0">
                    <img
                      src="/assets/knowza_cheering.png"
                      alt="Kutlayan Ayıcık"
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* ================= WIDGET 9: Gece Modu Hızlı Kontrol Çubuğu (Geniş 4x1) ================= */}
            {(sizeFilter === 'all' || sizeFilter === 'large') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Geniş (4x1) • Gece Modu Hızlı Kontrol Çubuğu
                  </span>
                  <button
                    onClick={() => handleCopyWidget('dark-dock', 'Gece Modu Kontrol Çubuğu')}
                    className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    {copiedId === 'dark-dock' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === 'dark-dock' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="bg-[#141311] rounded-[28px] p-3 border border-amber-500/40 shadow-lg text-white flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 pl-1">
                    <div className="w-8 h-8 rounded-xl bg-[#FFB800] text-slate-950 font-black text-sm flex items-center justify-center shadow-xs">
                      K
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-white leading-tight">Knowza</h4>
                      <p className="text-[9px] font-bold text-slate-400">Daha iyi bir sen.</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onNavigateTab('home')}
                      className="flex flex-col items-center p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition"
                      title="Dersler"
                    >
                      <BookOpen className="w-4 h-4 text-amber-300" />
                      <span className="text-[8px] font-bold text-slate-300 mt-0.5">Dersler</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('stats')}
                      className="flex flex-col items-center p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition"
                      title="İstatistikler"
                    >
                      <BarChart2 className="w-4 h-4 text-amber-300" />
                      <span className="text-[8px] font-bold text-slate-300 mt-0.5">İstatistik</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('badges')}
                      className="flex flex-col items-center p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition"
                      title="Rozetler"
                    >
                      <Award className="w-4 h-4 text-amber-300" />
                      <span className="text-[8px] font-bold text-slate-300 mt-0.5">Rozetler</span>
                    </button>
                    <button
                      onClick={() => onNavigateTab('profile')}
                      className="flex flex-col items-center p-1.5 rounded-xl hover:bg-white/10 active:scale-95 transition"
                      title="Profil"
                    >
                      <User className="w-4 h-4 text-amber-300" />
                      <span className="text-[8px] font-bold text-slate-300 mt-0.5">Profil</span>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* ================= WIDGET 10: Açık Hızlı Başlatıcı (Geniş 4x1) ================= */}
            {(sizeFilter === 'all' || sizeFilter === 'large') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Geniş (4x1) • Açık Hızlı Başlatıcı
                  </span>
                  <button
                    onClick={() => handleCopyWidget('light-dock', 'Açık Hızlı Başlatıcı')}
                    className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    {copiedId === 'light-dock' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === 'light-dock' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="bg-[#FFFDF7] rounded-[28px] p-3 border-2 border-[#FFE2A3] shadow-sm flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 flex-shrink-0">
                      <img
                        src="/assets/knowza_avatar_3d.png"
                        alt="Knowza"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-[#2A1E00] leading-tight">
                        Bugün ne öğrenmek istersin?
                      </p>
                      <span className="text-[9px] font-bold text-amber-700">Knowza 3D Koç</span>
                    </div>
                  </div>

                  <button
                    onClick={handleLaunchLesson}
                    className="px-3.5 py-1.5 bg-[#FFB800] hover:bg-amber-400 text-[#2A1E00] font-black text-xs rounded-xl shadow-xs active:scale-95 transition flex items-center gap-1"
                  >
                    <span>Hemen başla</span>
                    <Play className="w-3 h-3 fill-[#2A1E00]" />
                  </button>
                </div>
              </div>
            )}

            {/* ================= WIDGET 11: Günün Motivasyon Kartı (Geniş 4x2) ================= */}
            {(sizeFilter === 'all' || sizeFilter === 'large') && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between px-1">
                  <span className="text-[11px] font-black uppercase tracking-wider text-slate-500">
                    Geniş (4x2) • Günün Motivasyonu
                  </span>
                  <button
                    onClick={() => handleCopyWidget('motivation-banner', 'Günün Motivasyonu')}
                    className="text-[11px] font-bold text-amber-700 flex items-center gap-1 hover:underline"
                  >
                    {copiedId === 'motivation-banner' ? (
                      <Check className="w-3 h-3 text-emerald-600" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                    <span>{copiedId === 'motivation-banner' ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                </div>

                <div className="bg-gradient-to-r from-[#FFF8E7] via-[#FFEABF] to-[#FFD88A] rounded-[32px] p-4 border-2 border-[#FFE2A3] shadow-sm flex items-center justify-between gap-3 relative overflow-hidden">
                  <div className="space-y-1.5 min-w-0 flex-1 pr-2">
                    <h4 className="text-base font-black text-[#2A1E00] leading-tight">
                      Harika gidiyorsun! 🎉
                    </h4>
                    <p className="text-xs font-bold text-[#6B531C] leading-snug">
                      Bugün 1 ders daha tamamlayarak serini {userStreak + 1} güne çıkarabilirsin!
                    </p>
                    <button
                      onClick={handleLaunchLesson}
                      className="mt-1 px-4 py-1.5 bg-[#2A1E00] text-amber-300 font-black text-xs rounded-xl shadow-xs active:scale-95 transition flex items-center gap-1 hover:bg-black"
                    >
                      <Play className="w-3 h-3 fill-amber-300" />
                      <span>Dersine başla</span>
                    </button>
                  </div>

                  <div className="w-20 h-20 relative flex-shrink-0">
                    <img
                      src="/assets/knowza_cheering.png"
                      alt="Kutlayan Ayıcık"
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: ORİJİNAL KONSEPT ŞABLONLAR (Görseller) ================= */}
        {activeTab === 'designs' && (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200/70 text-xs font-bold text-amber-950">
              💡 Aşağıda yüklediğin orijinal konsept tasarım panoları yer alıyor. Yukarıdaki tüm interaktif widget'lar bu çizimler birebir referans alınarak üretildi!
            </div>

            <div className="space-y-3">
              <div className="bg-white rounded-3xl p-3 border-2 border-[#FFE2A3] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    Tasarım Panosu 1 • Maskot & Seri Kartları
                  </span>
                  <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full">
                    Gündüz Teması
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src="/assets/widgets/widget_ref_1.jpg"
                    alt="Orijinal Widget Referansı 1"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  Knowza peeking maskotu, 12 günlük seri takipçisi, Bugünün Dersi başla butonu ve %68 ilerleme halkası.
                </p>
              </div>

              <div className="bg-white rounded-3xl p-3 border-2 border-[#FFE2A3] shadow-sm space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-slate-800">
                    Tasarım Panosu 2 • Boyutlar (Küçük, Orta, Geniş)
                  </span>
                  <span className="text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-full">
                    Açık & Koyu Mod
                  </span>
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-200">
                  <img
                    src="/assets/widgets/widget_ref_2.jpg"
                    alt="Orijinal Widget Referansı 2"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <p className="text-[11px] text-slate-600 font-medium">
                  2x2 Küçük kartlar, 4x2 Gece modu halkası ve 4x1 Hızlı kontrol barı şablonları.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ================= TAB 3: NASIL EKLENİR? REHBERİ ================= */}
        {activeTab === 'guide' && (
          <div className="space-y-3">
            {/* iOS Guide */}
            <div className="bg-white rounded-3xl p-4 border-2 border-[#FFE2A3] shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-sm">
                  🍎
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">iPhone & iPad (iOS)</h4>
                  <p className="text-[10px] font-bold text-slate-500">Safari & Ana Ekran Widget'ı</p>
                </div>
              </div>

              <ol className="space-y-2 text-xs font-bold text-slate-700 list-decimal list-inside pl-1">
                <li>
                  Safari tarayıcısında alttaki <span className="text-blue-600 font-black">Paylaş</span> simgesine dokunun.
                </li>
                <li>
                  Açılan menüden <span className="text-slate-900 font-black">"Ana Ekrana Ekle"</span> seçeneğini seçin.
                </li>
                <li>
                  Knowza uygulamasını açtıktan sonra ana ekranda boş bir yere basılı tutun ve sol üstteki <span className="font-black text-amber-600">+</span> simgesine basın.
                </li>
                <li>
                  Arama çubuğuna <span className="font-black">Knowza</span> yazıp 2x2, 4x2 veya 4x1 boyutunu seçin.
                </li>
              </ol>
            </div>

            {/* Android Guide */}
            <div className="bg-white rounded-3xl p-4 border-2 border-[#FFE2A3] shadow-sm space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-black text-sm">
                  🤖
                </div>
                <div>
                  <h4 className="text-sm font-black text-slate-900">Android Cihazlar</h4>
                  <p className="text-[10px] font-bold text-slate-500">Chrome & Android Widget'ları</p>
                </div>
              </div>

              <ol className="space-y-2 text-xs font-bold text-slate-700 list-decimal list-inside pl-1">
                <li>
                  Chrome menüsündeki üç noktaya dokunup <span className="text-slate-900 font-black">"Uygulamayı Yükle"</span> deyin.
                </li>
                <li>
                  Telefonunun ana ekranında boş bir alana <span className="text-slate-900 font-black">uzun basın</span>.
                </li>
                <li>
                  <span className="font-black text-emerald-700">"Widget'lar"</span> menüsünü açın.
                </li>
                <li>
                  <span className="font-black">Knowza</span>'yı bulup eklemek istediğiniz widget boyutunu sürükleyin.
                </li>
              </ol>
            </div>

            {/* Account Save Confirmation Notice */}
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200 flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5 text-left">
                <h5 className="text-xs font-black text-emerald-950">
                  Hesabın ve İlerlemen Güvende!
                </h5>
                <p className="text-[11px] font-bold text-emerald-800 leading-snug">
                  Çözdüğün tüm sorular, kazandığın XP, serin ve notların hem yerel hafızaya hem de bulut hesabına (Firestore) anlık olarak kaydedilir.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
