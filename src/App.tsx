import React, { useState, lazy, Suspense } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { KnowzaSplash } from './components/KnowzaSplash';
import { KnowzaHome } from './components/KnowzaHome';
import { KnowzaBottomNav, KnowzaTab } from './components/KnowzaBottomNav';
import { AuthModal } from './components/AuthModal';
import { KnowzaOnboarding } from './components/KnowzaOnboarding';
import { AchievementToast } from './components/AchievementToast';
import { StreakRecoveryModal } from './components/StreakRecoveryModal';
import { DailyCoachReminderHost } from './components/KnowzaBearNotice';
import { ArrowLeft } from 'lucide-react';
import { loadAccountRecord, SavedAccountSummary } from './utils/accountStorage';

const KnowzaStats = lazy(() => import('./components/KnowzaStats').then((m) => ({ default: m.KnowzaStats })));
const KnowzaBadges = lazy(() => import('./components/KnowzaBadges').then((m) => ({ default: m.KnowzaBadges })));
const KnowzaProfile = lazy(() => import('./components/KnowzaProfile').then((m) => ({ default: m.KnowzaProfile })));
const KnowzaQuizModal = lazy(() => import('./components/KnowzaQuizModal').then((m) => ({ default: m.KnowzaQuizModal })));
const KnowzaLevelUpModal = lazy(() => import('./components/KnowzaLevelUpModal').then((m) => ({ default: m.KnowzaLevelUpModal })));
const LessonModal = lazy(() => import('./components/LessonModal').then((m) => ({ default: m.LessonModal })));
const ExamSimulator = lazy(() => import('./components/ExamSimulator').then((m) => ({ default: m.ExamSimulator })));
const ExamCountdown = lazy(() => import('./components/ExamCountdown').then((m) => ({ default: m.ExamCountdown })));
const ErrorNotebook = lazy(() => import('./components/ErrorNotebook').then((m) => ({ default: m.ErrorNotebook })));
const CodeLab = lazy(() => import('./components/CodeLab').then((m) => ({ default: m.CodeLab })));
const LearnPath = lazy(() => import('./components/LearnPath').then((m) => ({ default: m.LearnPath })));
const KahootArena = lazy(() => import('./components/KahootArena').then((m) => ({ default: m.KahootArena })));
const QuizDuel = lazy(() => import('./components/QuizDuel').then((m) => ({ default: m.QuizDuel })));
const ReelsQuestions = lazy(() => import('./components/ReelsQuestions').then((m) => ({ default: m.ReelsQuestions })));
const AiCoach = lazy(() => import('./components/AiCoach').then((m) => ({ default: m.AiCoach })));
const Shop = lazy(() => import('./components/Shop').then((m) => ({ default: m.Shop })));
const KnowzaWidgetHub = lazy(() => import('./components/KnowzaWidgetHub').then((m) => ({ default: m.KnowzaWidgetHub })));

const TabLoaderFallback: React.FC = () => (
  <div className="flex-1 flex flex-col items-center justify-center py-20 gap-3 text-amber-900">
    <div className="w-10 h-10 rounded-full border-4 border-amber-200 border-t-[#FFB800] animate-spin" />
    <span className="text-xs font-black tracking-wide">Yükleniyor...</span>
  </div>
);

const KnowzaAppContent: React.FC = () => {
  const { stats, loginUser, activeLesson, closeLesson, activeAchievement, dismissAchievement } = useGame();
  const [currentTab, setCurrentTab] = useState<KnowzaTab>('home');
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return localStorage.getItem('knowza_has_started') === 'true';
  });

  const [activeQuizSubject, setActiveQuizSubject] = useState<string | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'google' | 'email'>('google');
  const [authInitialEmailSubTab, setAuthInitialEmailSubTab] = useState<'login' | 'register'>('login');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [reelsExitSignal, setReelsExitSignal] = useState(0);

  React.useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [currentTab]);

  const handleSelectSavedAccount = (acc: SavedAccountSummary) => {
    const cleanEmail = acc.email.toLowerCase().trim();
    const localRec = loadAccountRecord(cleanEmail);
    const existingStats = localRec?.stats || null;
    loginUser(acc.authProvider || 'google', cleanEmail, {
      username: acc.username || cleanEmail.split('@')[0],
      avatarUrl: acc.avatarUrl,
      existingStats: existingStats ? { ...existingStats, hasCompletedOnboarding: true } : null,
      existingNotes: localRec?.notes || [],
      isNewAccount: false,
    });
  };

  // User must authenticate / login first before entering main app
  const isUserAuthenticated = stats.isLoggedIn && !!stats.email;

  if (!isUserAuthenticated) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#FFFDF7] flex flex-col overflow-x-hidden">
        <div className="w-full min-h-[100dvh] bg-[#FFFDF7] flex flex-col justify-between relative">
          <KnowzaSplash
            onStartGoogle={() => {
              setAuthInitialMode('google');
              setShowAuthModal(true);
            }}
            onOpenEmailAuth={() => {
              setAuthInitialMode('email');
              setAuthInitialEmailSubTab('register');
              setShowAuthModal(true);
            }}
            onGuestStart={() => {
              setAuthInitialMode('email');
              setAuthInitialEmailSubTab('login');
              setShowAuthModal(true);
            }}
            onSelectSavedAccount={handleSelectSavedAccount}
          />
          {showAuthModal && (
            <AuthModal
              initialMode={authInitialMode}
              initialEmailSubTab={authInitialEmailSubTab}
              onClose={() => setShowAuthModal(false)}
            />
          )}
        </div>
      </div>
    );
  }

  // If user is authenticated but has not set up target goal & pace:
  if (!stats.hasCompletedOnboarding) {
    return (
      <div className="min-h-[100dvh] w-full bg-[#FFFDF7] flex justify-center items-center overflow-y-auto md:p-6">
        <div className="w-full max-w-md md:max-w-2xl min-h-[100dvh] md:min-h-0 md:rounded-[36px] md:shadow-xl md:border md:border-amber-200/60 bg-[#FFFDF7] overflow-hidden flex flex-col justify-between relative">
          <KnowzaOnboarding
            onComplete={() => {
              setShowOnboarding(false);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] w-full bg-[#FFFDF7] flex justify-center items-start text-slate-900 select-none antialiased relative">
      {/* Responsive Mobile & Tablet App Container */}
      <div className="w-full max-w-md md:max-w-3xl lg:max-w-5xl min-h-[100dvh] relative bg-[#FFFDF7] flex flex-col overflow-x-clip">
        {/* Main Tab Views */}
        <StreakRecoveryModal />
        <DailyCoachReminderHost onOpenCoach={() => setCurrentTab('aicoach')} />
        <main className="flex-1 w-full flex flex-col">
          <Suspense fallback={<TabLoaderFallback />}>
          {currentTab === 'home' && (
            <KnowzaHome
              onStartQuiz={(subject) => setActiveQuizSubject(subject)}
              onOpenLevelUp={() => setShowLevelUpModal(true)}
              onOpenSettings={() => setCurrentTab('profile')}
              onNavigateTab={(tab) => setCurrentTab(tab)}
              onOpenOnboarding={() => setShowOnboarding(true)}
            />
          )}

          {currentTab === 'stats' && (
            <KnowzaStats onBack={() => setCurrentTab('home')} />
          )}

          {currentTab === 'shop' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-[#FFFDF7] px-4 py-3 flex items-center justify-between border-b border-amber-100/50">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-amber-100/60 hover:bg-amber-200/60 text-slate-800 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-base font-extrabold text-slate-900">Knowza Mağaza 🛍️</span>
                <div className="w-16" />
              </div>
              <div className="flex-1 pb-24">
                <Shop />
              </div>
            </div>
          )}

          {currentTab === 'badges' && (
            <KnowzaBadges
              onBack={() => setCurrentTab('home')}
              onNavigateToQuiz={() => setActiveQuizSubject('İngilizce')}
            />
          )}

          {currentTab === 'profile' && (
            <KnowzaProfile
              onBack={() => setCurrentTab('home')}
              onOpenAuth={() => setShowAuthModal(true)}
              onOpenOnboarding={() => setShowOnboarding(true)}
            />
          )}

          {/* Sub-Views with Top Navigation Bar */}
          {currentTab === 'kahoot' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-purple-900 px-4 py-3 flex items-center justify-between text-white border-b border-purple-800">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">Soru Arenası 🏆</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <KahootArena />
              </div>
            </div>
          )}

          {currentTab === 'duel' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-rose-900 px-4 py-3 flex items-center justify-between text-white border-b border-rose-800">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">1v1 Düello ⚔️</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <QuizDuel />
              </div>
            </div>
          )}

          {currentTab === 'reels' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-orange-950 px-4 py-3 flex items-center justify-between text-white border-b border-orange-900">
                <button
                  onClick={() => setReelsExitSignal((s) => s + 1)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">Soru Kaydır 🔥</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <ReelsQuestions
                  exitSignal={reelsExitSignal}
                  onExitHome={() => setCurrentTab('home')}
                  onOpenStats={() => setCurrentTab('stats')}
                />
              </div>
            </div>
          )}

          {currentTab === 'aicoach' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-amber-900 px-4 py-3 flex items-center justify-between text-white border-b border-amber-800">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">Knowza AI Koç 🤖</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <AiCoach />
              </div>
            </div>
          )}

          {/* Deneme Sınavları Simülatörü */}
          {currentTab === 'exams' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-emerald-900 px-4 py-3 flex items-center justify-between text-white border-b border-emerald-800">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">ÖSYM Deneme Simülatörü 📝</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <ExamSimulator />
              </div>
            </div>
          )}

          {/* Sınav Sayacı */}
          {currentTab === 'countdown' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-indigo-900 px-4 py-3 flex items-center justify-between text-white border-b border-indigo-800">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">Sınav Sayacı ⏱️</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <ExamCountdown />
              </div>
            </div>
          )}

          {/* Hata Defteri */}
          {currentTab === 'errors' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-rose-950 px-4 py-3 flex items-center justify-between text-white border-b border-rose-900">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">Hata Defterim 📖</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <ErrorNotebook />
              </div>
            </div>
          )}

          {/* Kod Lab */}
          {currentTab === 'codelab' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-slate-900 px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">Python Kod Lab 💻</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <CodeLab />
              </div>
            </div>
          )}

          {/* Öğrenme Haritası (LearnPath) */}
          {currentTab === 'learn' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-[#FFFDF7] px-4 py-3 flex items-center justify-between border-b border-amber-100">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black text-slate-900">Öğrenme Haritası 🗺️</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <LearnPath />
              </div>
            </div>
          )}

          {/* Knowza Widget Stüdyosu & Galerisi */}
          {currentTab === 'widgets' && (
            <div className="flex-1 flex flex-col">
              <KnowzaWidgetHub
                onBack={() => setCurrentTab('home')}
                onNavigateTab={(tab) => setCurrentTab(tab)}
                onStartLesson={(subject) => setActiveQuizSubject(subject)}
              />
            </div>
          )}
          </Suspense>
        </main>

        {/* 4-Tab Bottom Navigation matching Screens 2, 5, 6, 8 */}
        <KnowzaBottomNav
          currentTab={currentTab}
          onSelectTab={(tab) => {
            setCurrentTab(tab);
          }}
        />

        {/* Real Interactive Lesson Solver (Runs when ANY lesson is tapped!) */}
        {activeLesson && (
          <Suspense fallback={<TabLoaderFallback />}>
            <LessonModal
              lesson={activeLesson}
              onClose={closeLesson}
            />
          </Suspense>
        )}

        {/* Interactive Lesson / Quiz Modal (Screen 3 & 4 sample test) */}
        {activeQuizSubject && (
          <Suspense fallback={<TabLoaderFallback />}>
            <KnowzaQuizModal
              subject={activeQuizSubject}
              onClose={() => setActiveQuizSubject(null)}
            />
          </Suspense>
        )}

        {/* Level Up Celebration Modal (Screen 7) */}
        {showLevelUpModal && (
          <Suspense fallback={<TabLoaderFallback />}>
            <KnowzaLevelUpModal
              level={Math.max(1, Math.floor((stats.xp || 0) / 100) + 1)}
              onClose={() => setShowLevelUpModal(false)}
            />
          </Suspense>
        )}

        {/* Top-Sliding Achievement Celebration Toast */}
        <AchievementToast
          achievement={activeAchievement}
          onDismiss={dismissAchievement}
        />

        {/* Account / Auth Modal */}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}

        {/* Change Goal & City Onboarding Modal */}
        {showOnboarding && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-0 md:p-4 animate-fade">
            <div className="w-full max-w-md md:max-w-2xl h-full md:h-auto md:max-h-[90vh] md:rounded-[36px] bg-[#FFFDF7] overflow-y-auto shadow-2xl border-2 border-amber-200">
              <KnowzaOnboarding
                onComplete={() => setShowOnboarding(false)}
                onSkip={() => setShowOnboarding(false)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <KnowzaAppContent />
    </GameProvider>
  );
};

export default App;
