import React, { useState } from 'react';
import { useGame, AVATAR_MAP } from '../context/GameContext';
import { COURSES } from '../data/coursesData';
import { Flame, Gem, Heart, Volume2, VolumeX, ChevronDown, Check, Sparkles } from 'lucide-react';
import { CourseCategory } from '../types';
import { LuckyWheelModal } from './LuckyWheelModal';
import { sound } from '../utils/audio';

export const Header: React.FC = () => {
  const { stats, selectedCourseId, setSelectedCourseId, soundMuted, toggleSound, refillHearts, userLevel } = useGame();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);
  const [showLuckyWheel, setShowLuckyWheel] = useState(false);

  const currentCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
  const userAvatarEmoji = AVATAR_MAP[stats.avatar]?.emoji || '🐻';

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-[#1a2c35] border-b-2 border-gray-200 dark:border-[#2b3d45] px-2.5 py-2 sm:px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-1">
        
        {/* Course Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1.5 sm:gap-2.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl border-2 border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-[#20343f] transition-all font-bold text-gray-700 dark:text-gray-200 active:scale-95"
          >
            <span className="text-xl sm:text-2xl">{currentCourse.icon}</span>
            <span className="hidden md:inline font-black text-sm tracking-wide">{currentCourse.name}</span>
            <ChevronDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-11 left-0 w-64 sm:w-72 max-w-[90vw] bg-white dark:bg-[#1a2c35] rounded-2xl shadow-xl border-2 border-gray-200 dark:border-[#2b3d45] p-2 z-50 animate-pop">
              <div className="text-xs font-black uppercase text-gray-400 dark:text-gray-400 px-3 py-1.5 tracking-wider">
                DERS & SINAV ALANI SEÇ
              </div>
              <div className="space-y-1">
                {COURSES.map((course) => {
                  const isSelected = course.id === selectedCourseId;
                  return (
                    <button
                      key={course.id}
                      onClick={() => {
                        setSelectedCourseId(course.id as CourseCategory);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-xl transition-all text-left ${
                        isSelected 
                          ? 'bg-green-50 dark:bg-green-950/40 border-2 border-[#58cc02]' 
                          : 'hover:bg-gray-100 dark:hover:bg-[#20343f]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl sm:text-2xl">{course.icon}</span>
                        <div>
                          <div className="font-extrabold text-xs sm:text-sm text-gray-800 dark:text-gray-100">{course.name}</div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">{course.subTitle}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#58cc02]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Gamification Stats: Level/Avatar, Streak, Gems, Hearts, Sound */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* User Level & Avatar Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 border-2 border-amber-200 dark:border-amber-700/60 px-2.5 py-1 rounded-xl text-amber-900 dark:text-amber-300 font-black text-xs shadow-sm">
            <span className="text-base">{userAvatarEmoji}</span>
            <span>Lvl {userLevel}</span>
          </div>

          {/* Streak (Ateş / Seri) */}
          <div className="flex items-center gap-1 font-black text-orange-500 group cursor-default text-xs sm:text-base">
            <Flame className="w-4 h-4 sm:w-6 sm:h-6 fill-orange-500 text-orange-500 animate-bounceSubtle" />
            <span>{stats.streak}</span>
          </div>

          {/* Gems (Elmaslar) */}
          <div className="flex items-center gap-1 font-black text-blue-500 group cursor-default text-xs sm:text-base">
            <Gem className="w-4 h-4 sm:w-6 sm:h-6 fill-blue-500 text-blue-500" />
            <span>{stats.gems}</span>
          </div>

          {/* Hearts (Canlar) */}
          <div className="relative">
            <button
              onClick={() => setShowHeartModal(!showHeartModal)}
              className="flex items-center gap-1 font-black text-red-500 hover:opacity-80 active:scale-95 transition-all text-xs sm:text-base"
            >
              <Heart className="w-4 h-4 sm:w-6 sm:h-6 fill-red-500 text-red-500" />
              <span>{stats.hearts}</span>
            </button>

            {showHeartModal && (
              <div className="absolute right-0 top-10 w-64 max-w-[90vw] bg-white dark:bg-[#1a2c35] rounded-2xl shadow-2xl border-2 border-gray-200 dark:border-[#2b3d45] p-4 z-50 text-center animate-pop">
                <Heart className="w-10 h-10 fill-red-500 text-red-500 mx-auto mb-2" />
                <h4 className="font-extrabold text-gray-800 dark:text-gray-100 text-sm sm:text-base">Can Sistemi</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 mb-3">
                  Yanlış cevaplar canını azaltır. Canların bitince derslere devam etmek için yenileyebilirsin!
                </p>
                <div className="bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 font-black text-xs sm:text-sm py-1.5 px-3 rounded-lg mb-3">
                  {stats.hearts} / {stats.maxHearts} Can Kaldı
                </div>
                {stats.hearts < stats.maxHearts ? (
                  <button
                    onClick={() => {
                      const ok = refillHearts();
                      if (ok) setShowHeartModal(false);
                    }}
                    className="w-full bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold py-2 px-3 rounded-xl border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 transition-all text-xs flex items-center justify-center gap-2"
                  >
                    <span>Canları Doldur</span>
                    <span className="bg-white/20 px-1.5 py-0.5 rounded text-white font-black">💎 50</span>
                  </button>
                ) : (
                  <div className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/40 py-2 rounded-xl">
                    Canların tamamen dolu! 🔥
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Daily Lucky Wheel Button */}
          <button
            onClick={() => {
              sound.playClick();
              setShowLuckyWheel(true);
            }}
            title="Günlük Şans Çarkı (Ödül Kazan!)"
            className="flex items-center gap-1 bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs px-2.5 py-1.5 rounded-xl border-b-2 border-amber-600 active:border-b-0 active:translate-y-0.5 transition-all shadow-sm animate-bounceSubtle"
          >
            <span className="text-sm">🎡</span>
            <span className="hidden sm:inline">Şans Çarkı</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Sesi Aç/Kapat"
            className="p-1.5 sm:p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#20343f] transition-all active:scale-95"
          >
            {soundMuted ? <VolumeX className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" /> : <Volume2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />}
          </button>

        </div>

      </div>

      {/* Lucky Wheel Modal */}
      {showLuckyWheel && (
        <LuckyWheelModal onClose={() => setShowLuckyWheel(false)} />
      )}
    </header>
  );
};
