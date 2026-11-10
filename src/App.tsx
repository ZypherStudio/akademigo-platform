import React, { useState } from 'react';
import { GameProvider, useGame } from './context/GameContext';
import { Header } from './components/Header';
import { Sidebar, NavTab } from './components/Sidebar';
import { LearnPath } from './components/LearnPath';
import { LessonModal } from './components/LessonModal';
import { Leaderboard } from './components/Leaderboard';
import { Quests } from './components/Quests';
import { StudyRoom } from './components/StudyRoom';
import { Shop } from './components/Shop';
import { Profile } from './components/Profile';
import { ArcadeGames } from './components/ArcadeGames';
import { CodeLab } from './components/CodeLab';
import { ExamSimulator } from './components/ExamSimulator';
import { QuizDuel } from './components/QuizDuel';
import { AiCoach } from './components/AiCoach';
import { ErrorNotebook } from './components/ErrorNotebook';
import { SpeechPractice } from './components/SpeechPractice';
import { ExamCountdown } from './components/ExamCountdown';
import { ReelsQuestions } from './components/ReelsQuestions';
import { RightSidebar } from './components/RightSidebar';
import { Map, Flame, Swords, Bot, FileText, Menu, X, BookMarked, Mic, Clock, Gamepad2, Code2, Tv, Trophy, Target, ShoppingBag, User } from 'lucide-react';
import { sound } from './utils/audio';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('learn');
  const [showMobileDrawer, setShowMobileDrawer] = useState(false);
  const { activeLesson, closeLesson, stats } = useGame();

  const themeClasses: Record<string, string> = {
    duo: 'bg-[#f7f7f7] text-[#4b4b4b]',
    dark: 'bg-[#131f24] text-gray-100',
    cyber: 'bg-[#181126] text-purple-100',
    gold: 'bg-[#fffdf0] text-amber-950',
    ocean: 'bg-[#f0f9ff] text-sky-950'
  };

  const currentThemeClass = themeClasses[stats.theme] || themeClasses.duo;

  const mobilePrimaryTabs = [
    { id: 'learn', label: 'Öğren', icon: Map },
    { id: 'reels', label: 'Kaydır 🔥', icon: Flame },
    { id: 'duel', label: 'Düello', icon: Swords },
    { id: 'aicoach', label: 'Bibo AI', icon: Bot },
    { id: 'exams', label: 'Deneme', icon: FileText },
  ];

  const allDrawerItems = [
    { id: 'learn', label: 'Öğren / Harita', icon: Map, color: 'text-green-500 bg-green-50' },
    { id: 'reels', label: 'Soru Kaydır (Reels 🔥)', icon: Flame, color: 'text-orange-500 bg-orange-50' },
    { id: 'duel', label: '1v1 Düello', icon: Swords, color: 'text-red-500 bg-red-50' },
    { id: 'aicoach', label: 'Bibo AI Koç', icon: Bot, color: 'text-emerald-500 bg-emerald-50' },
    { id: 'exams', label: 'Deneme Sınavları', icon: FileText, color: 'text-teal-500 bg-teal-50' },
    { id: 'errors', label: 'Hata Defteri', icon: BookMarked, color: 'text-rose-500 bg-rose-50' },
    { id: 'games', label: 'Mini Oyunlar', icon: Gamepad2, color: 'text-pink-500 bg-pink-50' },
    { id: 'codelab', label: 'Kod Laboratuvarı', icon: Code2, color: 'text-purple-500 bg-purple-50' },
    { id: 'speech', label: 'Sesli Pratik', icon: Mic, color: 'text-cyan-500 bg-cyan-50' },
    { id: 'countdown', label: 'Sınav Sayacı', icon: Clock, color: 'text-violet-500 bg-violet-50' },
    { id: 'study', label: 'Çalışma Odası', icon: Tv, color: 'text-indigo-500 bg-indigo-50' },
    { id: 'leaderboard', label: 'Liderlik Tablosu', icon: Trophy, color: 'text-yellow-500 bg-yellow-50' },
    { id: 'quests', label: 'Görevler', icon: Target, color: 'text-blue-500 bg-blue-50' },
    { id: 'shop', label: 'Mağaza', icon: ShoppingBag, color: 'text-orange-500 bg-orange-50' },
    { id: 'profile', label: 'Profil & Temalar', icon: User, color: 'text-slate-600 bg-gray-100' },
  ];

  const handleSelectTab = (tab: NavTab) => {
    sound.playClick();
    setCurrentTab(tab);
    setShowMobileDrawer(false);
  };

  return (
    <div className={`min-h-screen ${currentThemeClass} flex flex-col font-sans select-none transition-colors duration-300 overflow-x-hidden w-full`}>
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Desktop Sidebar (Hidden on Mobile!) */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Central Content Area (100% full width on mobile) */}
        <main className="flex-1 flex justify-center min-w-0 px-2 sm:px-4 pb-28 md:pb-8 w-full overflow-x-hidden">
          {currentTab === 'learn' && <LearnPath />}
          {currentTab === 'reels' && <ReelsQuestions />}
          {currentTab === 'duel' && <QuizDuel />}
          {currentTab === 'aicoach' && <AiCoach />}
          {currentTab === 'errors' && <ErrorNotebook />}
          {currentTab === 'speech' && <SpeechPractice />}
          {currentTab === 'countdown' && <ExamCountdown />}
          {currentTab === 'games' && <ArcadeGames />}
          {currentTab === 'codelab' && <CodeLab />}
          {currentTab === 'exams' && <ExamSimulator />}
          {currentTab === 'study' && <StudyRoom />}
          {currentTab === 'leaderboard' && <Leaderboard />}
          {currentTab === 'quests' && <Quests />}
          {currentTab === 'shop' && <Shop />}
          {currentTab === 'profile' && <Profile />}
        </main>

        {/* Right Floating Sidebar (Desktop only for Learn & Quests) */}
        {(currentTab === 'learn' || currentTab === 'quests') && (
          <RightSidebar onNavigate={setCurrentTab} />
        )}

      </div>

      {/* Mobile Bottom Navigation Bar (No sidebars squeezing, clean full-width experience) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-[#1a2c35]/95 backdrop-blur-md border-t-2 border-gray-200 dark:border-[#2b3d45] px-2 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around z-40 shadow-2xl transition-colors duration-300">
        {mobilePrimaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelectTab(tab.id as NavTab)}
              className={`flex-1 flex flex-col items-center py-1 rounded-xl transition-all active:scale-90 ${
                isActive ? 'text-[#1cb0f6]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[10px] font-black mt-0.5 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More / Menu Drawer Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            setShowMobileDrawer(true);
          }}
          className={`flex-1 flex flex-col items-center py-1 rounded-xl transition-all active:scale-90 ${
            showMobileDrawer ? 'text-[#1cb0f6]' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-200'
          }`}
        >
          <Menu className="w-5 h-5 stroke-[2.5]" />
          <span className="text-[10px] font-black mt-0.5 tracking-tight">
            Menü
          </span>
        </button>
      </nav>

      {/* Mobile Bottom Drawer Overlay */}
      {showMobileDrawer && (
        <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex flex-col justify-end animate-fade">
          <div className="bg-white dark:bg-[#1a2c35] rounded-t-3xl p-5 max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl animate-pop border-t-2 border-gray-200 dark:border-[#2b3d45]">
            
            {/* Drawer Header */}
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2b3d45]">
              <div className="flex items-center gap-2">
                <span className="text-2xl animate-bounceSubtle">🐻</span>
                <div>
                  <h3 className="font-black text-gray-800 dark:text-gray-100 text-base">AkademiGO Menüsü</h3>
                  <span className="text-[10px] font-bold text-gray-400 dark:text-gray-400">Tüm Eğitici Odalar & Özellikler</span>
                </div>
              </div>
              <button
                onClick={() => setShowMobileDrawer(false)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-black"
              >
                ✕
              </button>
            </div>

            {/* Grid of all features */}
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              {allDrawerItems.map((item) => {
                const Icon = item.icon;
                const isCurrent = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id as NavTab)}
                    className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 text-left transition-all active:scale-95 ${
                      isCurrent
                        ? 'border-[#1cb0f6] bg-blue-50 dark:bg-blue-950/40 text-[#1cb0f6] shadow-sm font-black'
                        : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 text-gray-700 dark:text-gray-200 bg-white dark:bg-[#202f36] font-bold'
                    }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${item.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs leading-tight">{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-center text-[11px] font-bold text-gray-400 dark:text-gray-500">
              Kapatmak için yukarıdaki ✕ butonuna basabilirsiniz.
            </div>

          </div>
        </div>
      )}

      {/* Active Interactive Lesson Modal */}
      {activeLesson && (
        <LessonModal lesson={activeLesson} onClose={closeLesson} />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GameProvider>
      <MainLayout />
    </GameProvider>
  );
};

export default App;
