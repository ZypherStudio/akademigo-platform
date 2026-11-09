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
import { RightSidebar } from './components/RightSidebar';
import { Map, Swords, Bot, BookMarked, Mic, Clock, Gamepad2, Code2, FileText, User } from 'lucide-react';

const MainLayout: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<NavTab>('learn');
  const { activeLesson, closeLesson, stats } = useGame();

  const themeClasses: Record<string, string> = {
    duo: 'bg-[#f7f7f7] text-[#4b4b4b]',
    dark: 'bg-[#131f24] text-gray-100',
    cyber: 'bg-[#181126] text-purple-100',
    gold: 'bg-[#fffdf0] text-amber-950',
    ocean: 'bg-[#f0f9ff] text-sky-950'
  };

  const currentThemeClass = themeClasses[stats.theme] || themeClasses.duo;

  const mobileTabs = [
    { id: 'learn', label: 'Öğren', icon: Map },
    { id: 'duel', label: 'Düello', icon: Swords },
    { id: 'aicoach', label: 'Bibo AI', icon: Bot },
    { id: 'errors', label: 'Hata', icon: BookMarked },
    { id: 'exams', label: 'Deneme', icon: FileText },
    { id: 'profile', label: 'Profil', icon: User },
  ];

  return (
    <div className={`min-h-screen ${currentThemeClass} flex flex-col font-sans select-none transition-colors duration-300`}>
      {/* Top Header */}
      <Header />

      {/* Main Container */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        
        {/* Left Desktop Sidebar */}
        <Sidebar currentTab={currentTab} onSelectTab={setCurrentTab} />

        {/* Central Content Area */}
        <main className="flex-1 flex justify-center min-w-0 px-2 sm:px-4 pb-28 md:pb-8 w-full overflow-x-hidden">
          {currentTab === 'learn' && <LearnPath />}
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

      {/* Mobile Bottom Navigation Bar (Ultra-responsive touch bar with safe area padding) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t-2 border-gray-200 px-1 py-1.5 pb-[max(0.6rem,env(safe-area-inset-bottom))] flex items-center justify-around z-40 shadow-2xl">
        {mobileTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id as NavTab)}
              className={`flex-1 max-w-[62px] flex flex-col items-center py-1 px-0.5 rounded-xl transition-all active:scale-90 ${
                isActive ? 'text-[#1cb0f6]' : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Icon className="w-5 h-5 stroke-[2.5]" />
              <span className="text-[9px] font-black mt-0.5 tracking-tighter truncate w-full text-center">
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>

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
