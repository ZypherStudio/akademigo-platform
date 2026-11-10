import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { COURSES } from '../data/coursesData';
import { Check, Lock, Star, Gift, ShieldAlert, Sparkles, BookOpen, Play, Filter, Unlock, LockKeyhole } from 'lucide-react';
import { Lesson, Unit } from '../types';
import { Mascot } from './Mascot';
import { sound } from '../utils/audio';

export const LearnPath: React.FC = () => {
  const { stats, selectedCourseId, startLesson, openChest, leaderboard } = useGame();
  const [selectedGuideUnit, setSelectedGuideUnit] = useState<Unit | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<'all' | 'kolay' | 'orta' | 'zor'>('all');
  const [freeMode, setFreeMode] = useState<boolean>(true); // Tüm dersler serbest pratik açık

  const course = COURSES.find(c => c.id === selectedCourseId) || COURSES[0];

  // Helper to determine lesson state
  const isLessonCompleted = (lessonId: string) => stats.completedLessons.includes(lessonId);
  const isChestOpened = (chestId: string) => stats.openedChests.includes(chestId);

  // An unlocked lesson is either in freeMode, the first lesson, completed, or follows an opened node
  const isLessonUnlocked = (unitIndex: number, lessonIndex: number, currentUnit: Unit) => {
    if (freeMode) return true;
    if (lessonIndex === 0) return true; // Her ünitenin ilk dersi daima açık
    
    // Check previous lesson in this unit
    if (lessonIndex > 0) {
      const prevLesson = currentUnit.lessons[lessonIndex - 1];
      if (prevLesson.type === 'chest') return true; // Sandıklar ilerlemeyi engellemez
      return isLessonCompleted(prevLesson.id) || isChestOpened(prevLesson.id);
    }

    return true;
  };

  const handleLaunchLesson = (rawLesson: Lesson) => {
    let filteredQuestions = rawLesson.questions;
    if (selectedDifficulty !== 'all') {
      const matched = rawLesson.questions.filter(q => q.difficulty === selectedDifficulty);
      if (matched.length > 0) {
        filteredQuestions = matched;
      }
    }
    startLesson({ ...rawLesson, questions: filteredQuestions });
  };

  // Find the exact active lesson (the first unlocked but not completed lesson)
  let activeFound = false;

  // Responsive Zigzag offsets using Tailwind classes
  const getOffsetClass = (index: number) => {
    const patterns = [
      'translate-x-0',
      '-translate-x-3 sm:-translate-x-10',
      '-translate-x-5 sm:-translate-x-14',
      '-translate-x-3 sm:-translate-x-8',
      'translate-x-0',
      'translate-x-3 sm:translate-x-8',
      'translate-x-5 sm:translate-x-14',
      'translate-x-3 sm:translate-x-10',
    ];
    return patterns[index % patterns.length];
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-4 sm:py-6 px-2.5 sm:px-4 pb-28 overflow-x-hidden w-full">
      
      {/* Course Header Banner */}
      <div 
        className="rounded-3xl p-6 mb-6 text-white shadow-lg relative overflow-hidden"
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

      {/* Control Bar: Difficulty Filter & Free Mode Toggle */}
      <div className="bg-white dark:bg-[#1a2c35] border-2 border-gray-200 dark:border-[#2b3d45] rounded-2xl p-2.5 sm:p-3 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm transition-colors duration-300">
        
        {/* Difficulty buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 text-xs font-black text-gray-700 dark:text-gray-200 pr-1">
            <Filter className="w-4 h-4 text-blue-500" />
            <span>Zorluk:</span>
          </div>
          {[
            { id: 'all', label: '🌟 Tümü' },
            { id: 'kolay', label: '🟢 Basit' },
            { id: 'orta', label: '🟡 Orta' },
            { id: 'zor', label: '🔴 İleri' }
          ].map(lvl => (
            <button
              key={lvl.id}
              onClick={() => {
                sound.playClick();
                setSelectedDifficulty(lvl.id as any);
              }}
              className={`px-2.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                selectedDifficulty === lvl.id
                  ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-300'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {lvl.label}
            </button>
          ))}
        </div>

        {/* Free Mode / Serbest Çalışma Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            setFreeMode(!freeMode);
          }}
          className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all border-2 ${
            freeMode
              ? 'bg-green-500 text-white border-green-600 shadow-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-300 dark:border-gray-700'
          }`}
          title="Tüm ünite ve dersleri kilit olmadan serbestçe çöz"
        >
          {freeMode ? <Unlock className="w-3.5 h-3.5" /> : <LockKeyhole className="w-3.5 h-3.5" />}
          <span>{freeMode ? '🔓 Serbest Mod: Tüm Sorular Açık' : '🔒 Sıralı İlerleme Modu'}</span>
        </button>
      </div>

      {/* Mobile Welcome Mascot (Visible on mobile/tablet) */}
      <div className="xl:hidden flex justify-center mb-8">
        <Mascot
          size="md"
          mood="idle"
          speech="Hazır mısın? Haribo Ayıcık ile hedefine adım adım koşuyoruz! İstediğin konudan başla 🐻🍯"
        />
      </div>

      {/* Units & Learning Path */}
      <div className="space-y-16">
        {course.units.map((unit, unitIndex) => {
          return (
            <div key={unit.id} className="relative">
              
              {/* Unit Header Card */}
              <div 
                className="rounded-2xl p-4 sm:p-5 text-white mb-10 shadow-md flex items-center justify-between"
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

              {/* Zigzag Lesson Path with proper vertical spacing */}
              <div className="flex flex-col items-center space-y-12 sm:space-y-16 my-6 relative">
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
                      className={`relative flex flex-col items-center group transition-transform duration-300 ${getOffsetClass(lessonIndex)}`}
                    >
                      {/* Active "BAŞLA" floating bubble - comfortably positioned above */}
                      {isCurrentActive && (
                        <div className="absolute -top-11 z-20 animate-bounce bg-white dark:bg-[#1a2c35] text-gray-800 dark:text-gray-100 font-black text-xs px-3 py-1.5 rounded-xl shadow-lg border-2 border-gray-200 dark:border-[#2b3d45] flex items-center gap-1.5 whitespace-nowrap pointer-events-none">
                          <Play className="w-3.5 h-3.5 fill-[#58cc02] text-[#58cc02]" />
                          BAŞLA!
                          <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-white dark:border-t-[#1a2c35]" />
                        </div>
                      )}

                      {/* Chest Node */}
                      {isChest ? (
                        <button
                          disabled={!unlocked || chestOpened}
                          onClick={() => openChest(lesson.id, lesson.xpReward, lesson.gemReward)}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center transition-all ${
                            chestOpened
                              ? 'bg-amber-100 dark:bg-amber-950/40 border-b-4 border-amber-300 dark:border-amber-700 opacity-70'
                              : unlocked
                              ? 'bg-amber-400 border-b-6 border-amber-600 hover:scale-105 active:border-b-0 active:translate-y-1.5 shadow-lg animate-wiggle'
                              : 'bg-gray-200 dark:bg-gray-800 border-b-4 border-gray-300 dark:border-gray-700 cursor-not-allowed opacity-60'
                          }`}
                          title={lesson.title}
                        >
                          <Gift className={`w-8 h-8 sm:w-10 sm:h-10 ${chestOpened ? 'text-amber-600' : unlocked ? 'text-amber-900 fill-amber-300' : 'text-gray-400'}`} />
                        </button>
                      ) : isBoss ? (
                        /* Boss Checkpoint Node */
                        <button
                          onClick={() => handleLaunchLesson(lesson)}
                          className={`w-20 h-20 sm:w-24 sm:h-24 rounded-full flex flex-col items-center justify-center transition-all ${
                            completed
                              ? 'bg-yellow-400 border-b-6 border-yellow-600 shadow-xl'
                              : unlocked
                              ? 'bg-red-500 border-b-6 border-red-700 hover:scale-105 active:border-b-0 active:translate-y-1.5 shadow-xl animate-pulse'
                              : 'bg-gray-200 dark:bg-gray-800 border-b-4 border-gray-300 dark:border-gray-700 opacity-60'
                          }`}
                          title={lesson.title}
                        >
                          <ShieldAlert className={`w-9 h-9 sm:w-10 sm:h-10 ${completed ? 'text-yellow-900' : unlocked ? 'text-white' : 'text-gray-400'}`} />
                        </button>
                      ) : (
                        /* Standard Lesson Node */
                        <button
                          onClick={() => handleLaunchLesson(lesson)}
                          className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all font-black text-white relative ${
                            completed
                              ? 'bg-amber-400 border-b-6 border-amber-500 hover:scale-105 shadow-md active:border-b-0 active:translate-y-1'
                              : isCurrentActive
                              ? 'bg-[#58cc02] border-b-6 border-[#46a302] hover:scale-105 shadow-xl ring-8 ring-[#58cc02]/20 active:border-b-0 active:translate-y-1.5'
                              : unlocked
                              ? 'bg-blue-400 border-b-6 border-blue-500 hover:scale-105 active:border-b-0 active:translate-y-1'
                              : 'bg-gray-200 dark:bg-gray-800 border-b-4 border-gray-300 dark:border-gray-700 opacity-60 text-gray-400'
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
                      <span className="text-xs font-black text-gray-700 dark:text-gray-200 mt-2.5 max-w-[150px] text-center leading-tight">
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
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl max-w-lg w-full p-6 shadow-2xl border-2 border-gray-200 dark:border-[#2b3d45] transition-colors duration-300">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2b3d45]">
              <div>
                <span className="text-xs font-black uppercase text-gray-400 dark:text-gray-500">Ünite Rehberi</span>
                <h3 className="text-xl font-black text-gray-800 dark:text-gray-100">{selectedGuideUnit.title}</h3>
              </div>
              <button
                onClick={() => setSelectedGuideUnit(null)}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center font-black text-gray-600 dark:text-gray-300"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4">
              <p className="text-sm text-gray-600 dark:text-gray-300 font-medium leading-relaxed">
                {selectedGuideUnit.description}
              </p>

              <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-200 dark:border-amber-800 rounded-2xl p-4">
                <h4 className="font-black text-amber-900 dark:text-amber-200 text-sm mb-2 flex items-center gap-1.5">
                  💡 Bu Ünitedeki Önemli Taktikler
                </h4>
                <ul className="text-xs text-amber-800 dark:text-amber-300 font-semibold space-y-1.5 list-disc list-inside">
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
