import React, { useState } from 'react';
import { useGame, AVATAR_MAP } from '../context/GameContext';
import { COURSES } from '../data/coursesData';
import { Flame, Gem, Heart, Volume2, VolumeX, ChevronDown, Check, Sparkles } from 'lucide-react';
import { CourseCategory } from '../types';

export const Header: React.FC = () => {
  const { stats, selectedCourseId, setSelectedCourseId, soundMuted, toggleSound, refillHearts, userLevel } = useGame();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showHeartModal, setShowHeartModal] = useState(false);

  const currentCourse = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];
  const userAvatarEmoji = AVATAR_MAP[stats.avatar]?.emoji || '🦉';

  return (
    <header className="sticky top-0 z-30 bg-white border-b-2 border-gray-200 px-4 py-2.5 sm:px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        
        {/* Course Selector Dropdown */}
        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all font-bold text-gray-700 active:scale-95"
          >
            <span className="text-2xl">{currentCourse.icon}</span>
            <span className="hidden md:inline font-black text-sm tracking-wide">{currentCourse.name}</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {isDropdownOpen && (
            <div className="absolute top-12 left-0 w-72 bg-white rounded-2xl shadow-xl border-2 border-gray-200 p-2 z-50 animate-pop">
              <div className="text-xs font-black uppercase text-gray-400 px-3 py-1.5 tracking-wider">
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
                      className={`w-full flex items-center justify-between p-2.5 rounded-xl transition-all text-left ${
                        isSelected ? 'bg-green-50 border-2 border-[#58cc02]' : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{course.icon}</span>
                        <div>
                          <div className="font-extrabold text-sm text-gray-800">{course.name}</div>
                          <div className="text-xs text-gray-500 font-medium">{course.subTitle}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#58cc02]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Gamification Stats: Level/Avatar, Streak, Gems, Hearts, Sound */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          
          {/* User Level & Avatar Pill */}
          <div className="hidden sm:flex items-center gap-1.5 bg-amber-50 border-2 border-amber-200 px-2.5 py-1 rounded-xl text-amber-900 font-black text-xs shadow-sm">
            <span className="text-base">{userAvatarEmoji}</span>
            <span>Lvl {userLevel}</span>
          </div>

          {/* Streak (Ateş / Seri) */}
          <div className="flex items-center gap-1.5 font-black text-orange-500 group cursor-default">
            <Flame className="w-6 h-6 fill-orange-500 text-orange-500 animate-bounceSubtle" />
            <span className="text-base">{stats.streak}</span>
          </div>

          {/* Gems (Elmaslar) */}
          <div className="flex items-center gap-1.5 font-black text-blue-500 group cursor-default">
            <Gem className="w-6 h-6 fill-blue-500 text-blue-500" />
            <span className="text-base">{stats.gems}</span>
          </div>

          {/* Hearts (Canlar) */}
          <div className="relative">
            <button
              onClick={() => setShowHeartModal(!showHeartModal)}
              className="flex items-center gap-1.5 font-black text-red-500 hover:opacity-80 active:scale-95 transition-all"
            >
              <Heart className="w-6 h-6 fill-red-500 text-red-500" />
              <span className="text-base">{stats.hearts}</span>
            </button>

            {showHeartModal && (
              <div className="absolute right-0 top-11 w-64 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 p-4 z-50 text-center animate-pop">
                <Heart className="w-12 h-12 fill-red-500 text-red-500 mx-auto mb-2" />
                <h4 className="font-extrabold text-gray-800 text-base">Can Sistemi</h4>
                <p className="text-xs text-gray-500 mt-1 mb-3">
                  Yanlış cevaplar canını azaltır. Canların bitince derslere devam etmek için yenileyebilirsin!
                </p>
                <div className="bg-red-50 text-red-600 font-black text-sm py-1.5 px-3 rounded-lg mb-3">
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
                  <div className="text-xs font-bold text-green-600 bg-green-50 py-2 rounded-xl">
                    Canların tamamen dolu! 🔥
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sound Mute Toggle */}
          <button
            onClick={toggleSound}
            aria-label="Sesi Aç/Kapat"
            className="p-2 rounded-xl text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-all active:scale-95"
          >
            {soundMuted ? <VolumeX className="w-5 h-5 text-gray-400" /> : <Volume2 className="w-5 h-5 text-green-600" />}
          </button>

        </div>

      </div>
    </header>
  );
};
