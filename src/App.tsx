import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { KnowzaSplash } from './components/KnowzaSplash';
import { KnowzaHome } from './components/KnowzaHome';
import { KnowzaStats } from './components/KnowzaStats';
import { KnowzaBadges } from './components/KnowzaBadges';
import { KnowzaProfile } from './components/KnowzaProfile';
import { KnowzaBottomNav, KnowzaTab } from './components/KnowzaBottomNav';
import { KnowzaQuizModal } from './components/KnowzaQuizModal';
import { KnowzaLevelUpModal } from './components/KnowzaLevelUpModal';
import { LessonModal } from './components/LessonModal';
import { ExamSimulator } from './components/ExamSimulator';
import { ExamCountdown } from './components/ExamCountdown';
import { ErrorNotebook } from './components/ErrorNotebook';
import { CodeLab } from './components/CodeLab';
import { LearnPath } from './components/LearnPath';
import { KahootArena } from './components/KahootArena';
import { QuizDuel } from './components/QuizDuel';
import { ReelsQuestions } from './components/ReelsQuestions';
import { AiCoach } from './components/AiCoach';
import { AuthModal } from './components/AuthModal';
import { Shop } from './components/Shop';
import { KnowzaOnboarding } from './components/KnowzaOnboarding';
import { ArrowLeft, Smartphone, Monitor } from 'lucide-react';
import { soundSystem } from './utils/audio';

const KnowzaAppContent: React.FC = () => {
  const { stats, activeLesson, closeLesson } = useGame();
  const [currentTab, setCurrentTab] = useState<KnowzaTab>('home');
  const [hasStarted, setHasStarted] = useState<boolean>(() => {
    return localStorage.getItem('knowza_has_started') === 'true';
  });

  const [activeQuizSubject, setActiveQuizSubject] = useState<string | null>(null);
  const [showLevelUpModal, setShowLevelUpModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authInitialMode, setAuthInitialMode] = useState<'google' | 'email'>('google');
  const [showOnboarding, setShowOnboarding] = useState(false);

  // User must authenticate / login first before entering main app
  const isUserAuthenticated = stats.isLoggedIn && !!stats.email;

  if (!isUserAuthenticated) {
    return (
      <div className="h-[100dvh] w-full bg-[#FFFDF7] flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-md h-full md:h-auto md:max-h-[860px] md:my-6 md:rounded-[40px] md:shadow-2xl md:border md:border-amber-200/50 bg-[#FFFDF7] overflow-hidden flex flex-col justify-between relative">
          <KnowzaSplash
            onStartGoogle={() => {
              setAuthInitialMode('google');
              setShowAuthModal(true);
            }}
            onOpenEmailAuth={() => {
              setAuthInitialMode('email');
              setShowAuthModal(true);
            }}
            onGuestStart={() => {
              setAuthInitialMode('google');
              setShowAuthModal(true);
            }}
          />
          {showAuthModal && (
            <AuthModal
              initialMode={authInitialMode}
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
      <div className="h-[100dvh] w-full bg-[#FFFDF7] flex justify-center items-center overflow-hidden">
        <div className="w-full max-w-md h-full md:h-auto md:max-h-[860px] md:my-6 md:rounded-[40px] md:shadow-2xl md:border md:border-amber-200/50 bg-[#FFFDF7] overflow-hidden flex flex-col justify-between relative">
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
      {/* Play Store Mobile App Container */}
      <div className="w-full max-w-md min-h-[100dvh] relative bg-[#FFFDF7] md:my-3 md:rounded-[40px] md:shadow-2xl md:border md:border-amber-200/50 flex flex-col overflow-hidden">
        {/* Main Tab Views */}
        <main className="flex-1 w-full flex flex-col">
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
              <div className="sticky top-0 z-30 bg-[#FFFDF7]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-amber-100/50">
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
              <div className="sticky top-0 z-30 bg-purple-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between text-white border-b border-purple-800">
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
              <div className="sticky top-0 z-30 bg-rose-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between text-white border-b border-rose-800">
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
              <div className="sticky top-0 z-30 bg-orange-950/90 backdrop-blur-md px-4 py-3 flex items-center justify-between text-white border-b border-orange-900">
                <button
                  onClick={() => setCurrentTab('home')}
                  className="flex items-center gap-1.5 text-xs font-bold bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Ana Sayfa</span>
                </button>
                <span className="text-sm font-black tracking-wide">Soru Kaydır 🔥</span>
                <div className="w-12" />
              </div>
              <div className="flex-1 pb-24">
                <ReelsQuestions />
              </div>
            </div>
          )}

          {currentTab === 'aicoach' && (
            <div className="flex-1 flex flex-col">
              <div className="sticky top-0 z-30 bg-amber-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between text-white border-b border-amber-800">
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
              <div className="sticky top-0 z-30 bg-emerald-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between text-white border-b border-emerald-800">
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
              <div className="sticky top-0 z-30 bg-indigo-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between text-white border-b border-indigo-800">
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
              <div className="sticky top-0 z-30 bg-rose-950/90 backdrop-blur-md px-4 py-3 flex items-center justify-between text-white border-b border-rose-900">
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
              <div className="sticky top-0 z-30 bg-slate-900/90 backdrop-blur-md px-4 py-3 flex items-center justify-between text-white border-b border-slate-800">
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
              <div className="sticky top-0 z-30 bg-[#FFFDF7]/95 backdrop-blur-md px-4 py-3 flex items-center justify-between border-b border-amber-100">
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
          <LessonModal
            lesson={activeLesson}
            onClose={closeLesson}
          />
        )}

        {/* Interactive Lesson / Quiz Modal (Screen 3 & 4 sample test) */}
        {activeQuizSubject && (
          <KnowzaQuizModal
            subject={activeQuizSubject}
            onClose={() => setActiveQuizSubject(null)}
          />
        )}

        {/* Level Up Celebration Modal (Screen 7) */}
        {showLevelUpModal && (
          <KnowzaLevelUpModal
            level={Math.max(1, Math.floor((stats.xp || 0) / 100) + 1)}
            onClose={() => setShowLevelUpModal(false)}
          />
        )}

        {/* Account / Auth Modal */}
        {showAuthModal && (
          <AuthModal onClose={() => setShowAuthModal(false)} />
        )}

        {/* Change Goal & City Onboarding Modal */}
        {showOnboarding && (
          <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-0 md:p-4 backdrop-blur-sm animate-fade">
            <div className="w-full max-w-md h-full md:h-auto md:max-h-[860px] md:rounded-[40px] bg-[#FFFDF7] overflow-hidden shadow-2xl border-2 border-amber-200">
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
