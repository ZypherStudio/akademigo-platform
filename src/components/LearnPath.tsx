import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { COURSES } from '../data/coursesData';
import { Check, Lock, Star, Gift, ShieldAlert, Sparkles, BookOpen, Play } from 'lucide-react';
import { Lesson, Unit } from '../types';
import { Mascot } from './Mascot';

export const LearnPath: React.FC = () => {
  const { stats, selectedCourseId, startLesson, openChest, leaderboard } = useGame();
  const [selectedGuideUnit, setSelectedGuideUnit] = useState<Unit | null>(null);

  const course = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  // Helper to determine lesson state
  const isLessonCompleted = (lessonId: string) => stats.completedLessons.includes(lessonId);
  const isChestOpened = (chestId: string) => stats.openedChests.includes(chestId);

  // An unlocked lesson is either the first lesson, completed, or follows a completed lesson
  const isLessonUnlocked = (unitIndex: number, lessonIndex: number, currentUnit: Unit) => {
    if (unitIndex === 0 && lessonIndex === 0) return true;
    
    // Check previous lesson in this unit
    if (lessonIndex > 0) {
      const prevLesson = currentUnit.lessons[lessonIndex - 1];
      return isLessonCompleted(prevLesson.id) || isChestOpened(prevLesson.id);
    }

    // First lesson of unit > 0 requires previous unit's last lesson completed
    const prevUnit = course.units[unitIndex - 1];
    if (prevUnit && prevUnit.lessons.length > 0) {
      const lastLesson = prevUnit.lessons[prevUnit.lessons.length - 1];
      return isLessonCompleted(lastLesson.id) || isChestOpened(lastLesson.id);
    }

    return false;
  };

  // Find the exact active lesson (the first unlocked but not completed lesson)
  let activeFound = false;

  // Zigzag offsets for the nodes: [0, -45, -60, -30, 0, 30, 60, 45]
  const getOffsetStyle = (index: number) => {
    const offsets = [0, -40, -60, -35, 0, 35, 60, 40];
    const px = offsets[index % offsets.length];
    return { transform: `translateX(${px}px)` };
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 pb-24">
      
      {/* Course Header Banner */}
      <div 
        className="rounded-3xl p-6 mb-8 text-white shadow-lg relative overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${course.color} 0%, ${course.accentColor} 100%)`
        }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {course.badge}
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">{course.name}</h2>
            <p className="text-white/90 text-sm font-semibold mt-1">{course.subTitle}</p>
          </div>
          <div className="text-5xl sm:text-6xl animate-bounceSubtle select-none">
            {course.icon}
          </div>
        </div>
        
        {/* Subtle background decoration */}
        <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Mobile Welcome Mascot (Visible on mobile/tablet) */}
      <div className="xl:hidden flex justify-center mb-8">
        <Mascot
          size="md"
          mood="idle"
          speech="Hazır mısın? Bugün hedefin için harika bir gün! 🦉🔥"
        />
      </div>

      {/* Units & Learning Path */}
      <div className="space-y-12">
        {course.units.map((unit, unitIndex) => {
          return (
            <div key={unit.id} className="relative">
              
              {/* Unit Header Card */}
              <div 
                className="rounded-2xl p-4 sm:p-5 text-white mb-8 shadow-md flex items-center justify-between"
                style={{ backgroundColor: unit.color }}
              >
                <div>
                  <div className="text-xs font-black uppercase tracking-wider opacity-80">
                    Bölüm {unit.number}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black">{unit.title}</h3>
                  <p className="text-xs sm:text-sm opacity-90 font-medium mt-0.5">{unit.description}</p>
                </div>
                
                {/* Guidebook Button */}
                <button
                  onClick={() => setSelectedGuideUnit(unit)}
                  className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs px-3 py-2 rounded-xl flex items-center gap-1.5 transition-all active:scale-95 border border-white/20"
                >
                  <BookOpen className="w-4 h-4" />
                  <span className="hidden sm:inline">Rehber</span>
                </button>
              </div>

              {/* Zigzag Lesson Path */}
              <div className="flex flex-col items-center space-y-6 sm:space-y-8 my-4 relative">
                {unit.lessons.map((lesson, lessonIndex) => {
                  const completed = isLessonCompleted(lesson.id);
                  const chestOpened = isChestOpened(lesson.id);
                  const unlocked = isLessonUnlocked(unitIndex, lessonIndex, unit);
                  const isCurrentActive = unlocked && !completed && !chestOpened && !activeFound;
                  
                  if (isCurrentActive) {
                    activeFound = true;
                  }

                  const isChest = lesson.type === 'chest';
                  const isBoss = lesson.type === 'boss';

                  return (
                    <div
                      key={lesson.id}
                      style={getOffsetStyle(lessonIndex)}
                      className="relative flex flex-col items-center group transition-transform duration-300"
                    >
                      {/* Active "BAŞLA" floating bubble */}
                      {isCurrentActive && (
                        <div className="absolute -top-11 z-20 animate-bounce bg-white text-gray-800 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg border-2 border-gray-200 flex items-center gap-1.5 whitespace-nowrap">
                          <Play className="w-3.5 h-3.5 fill-[#58cc02] text-[#58cc02]" />
                          BAŞLA!
                          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white" />
                        </div>
                      )}

                      {/* Chest Node */}
                      {isChest ? (
                        <button
                          disabled={!unlocked || chestOpened}
                          onClick={() => openChest(lesson.id, lesson.xpReward, lesson.gemReward)}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all ${
                            chestOpened
                              ? 'bg-amber-100 border-b-4 border-amber-300 opacity-70'
                              : unlocked
                              ? 'bg-amber-400 border-b-6 border-amber-600 hover:scale-105 active:border-b-0 active:translate-y-1.5 shadow-lg animate-wiggle'
                              : 'bg-gray-200 border-b-4 border-gray-300 cursor-not-allowed opacity-60'
                          }`}
                          title={lesson.title}
                        >
                          <Gift className={`w-8 h-8 sm:w-10 sm:h-10 ${chestOpened ? 'text-amber-600' : unlocked ? 'text-amber-900 fill-amber-300' : 'text-gray-400'}`} />
                        </button>
                      ) : isBoss ? (
                        /* Boss Checkpoint Node */
                        <button
                          disabled={!unlocked}
                          onClick={() => startLesson(lesson)}
                          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all ${
                            completed
                              ? 'bg-yellow-400 border-b-6 border-yellow-600 shadow-xl'
                              : unlocked
                              ? 'bg-red-500 border-b-6 border-red-700 hover:scale-105 active:border-b-0 active:translate-y-1.5 shadow-xl animate-pulse'
                              : 'bg-gray-200 border-b-4 border-gray-300 cursor-not-allowed opacity-60'
                          }`}
                          title={lesson.title}
                        >
                          <ShieldAlert className={`w-9 h-9 sm:w-10 sm:h-10 ${completed ? 'text-yellow-900' : unlocked ? 'text-white' : 'text-gray-400'}`} />
                        </button>
                      ) : (
                        /* Standard Lesson Node */
                        <button
                          disabled={!unlocked}
                          onClick={() => startLesson(lesson)}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all font-black text-white relative ${
                            completed
                              ? 'bg-amber-400 border-b-6 border-amber-500 hover:scale-105 shadow-md active:border-b-0 active:translate-y-1'
                              : isCurrentActive
                              ? 'bg-[#58cc02] border-b-6 border-[#46a302] hover:scale-105 shadow-xl ring-8 ring-[#58cc02]/20 active:border-b-0 active:translate-y-1.5'
                              : unlocked
                              ? 'bg-blue-400 border-b-6 border-blue-500 hover:scale-105 active:border-b-0 active:translate-y-1'
                              : 'bg-gray-200 border-b-4 border-gray-300 cursor-not-allowed opacity-60 text-gray-400'
                          }`}
                          title={lesson.title}
                        >
                          {completed ? (
                            <Check className="w-8 h-8 sm:w-9 sm:h-9 stroke-[3.5] text-amber-900" />
                          ) : unlocked ? (
                            <Star className={`w-7 h-7 sm:w-8 sm:h-8 ${isCurrentActive ? 'fill-white text-white' : 'text-white'}`} />
                          ) : (
                            <Lock className="w-6 h-6 sm:w-7 sm:h-7 text-gray-400" />
                          )}
                        </button>
                      )}

                      {/* Lesson title label */}
                      <span className="text-xs font-black text-gray-700 mt-2 max-w-[150px] text-center leading-tight">
                        {lesson.title}
                      </span>
                    </div>
                  );
                })}
              </div>

            </div>
          );
        })}
      </div>

      {/* Guidebook Modal */}
      {selectedGuideUnit && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm animate-pop">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-gray-200">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-black uppercase text-gray-400">Ünite Rehberi</span>
                <h3 className="text-xl font-black text-gray-800">{selectedGuideUnit.title}</h3>
              </div>
              <button
                onClick={() => setSelectedGuideUnit(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center font-black text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-sm text-gray-600 font-medium leading-relaxed">
                {selectedGuideUnit.description}
              </p>

              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4">
                <h4 className="font-black text-amber-900 text-sm mb-2 flex items-center gap-1.5">
                  💡 Bu Ünitedeki Önemli Taktikler
                </h4>
                <ul className="text-xs text-amber-800 font-semibold space-y-1.5 list-disc list-inside">
                  {selectedGuideUnit.lessons.flatMap(l => l.summaryNotes || []).map((note, i) => (
                    <li key={i}>{note}</li>
                  ))}
                  {(!selectedGuideUnit.lessons.some(l => l.summaryNotes?.length)) && (
                    <li>Tüm soruları dikkatlice oku ve soru kökündeki olumsuz ifadelere (değildir, olamaz) dikkat et.</li>
                  )}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setSelectedGuideUnit(null)}
              className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-3 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all"
            >
              ANLADIM, PRATİĞE BAŞLA!
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
