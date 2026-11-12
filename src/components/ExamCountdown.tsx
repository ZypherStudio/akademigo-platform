import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Clock, Calendar, Target, CheckCircle2, Flame, Award, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import { Mascot } from './Mascot';

interface CountdownTarget {
  id: string;
  name: string;
  badge: string;
  targetDate: string; // ISO string
  icon: string;
}

const EXAMS: CountdownTarget[] = [
  {
    id: 'yks-2027',
    name: '2027 YKS (TYT - AYT)',
    badge: 'Üniversite Sınavı',
    targetDate: '2027-06-19T10:15:00',
    icon: '🎓'
  },
  {
    id: 'lgs-2027',
    name: '2027 LGS (8. Sınıf)',
    badge: 'Liselere Geçiş',
    targetDate: '2027-06-06T09:30:00',
    icon: '📚'
  },
  {
    id: 'kpss-2027',
    name: '2027 KPSS (Lisans GY-GK)',
    badge: 'Kamu Sınavı',
    targetDate: '2027-07-11T10:15:00',
    icon: '🏛️'
  }
];

export const ExamCountdown: React.FC = () => {
  const { stats } = useGame();
  const [selectedExamId, setSelectedExamId] = useState<string>('yks-2027');
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  const [dailyQuestionGoal, setDailyQuestionGoal] = useState<number>(30);
  const [isExpired, setIsExpired] = useState<boolean>(false);

  const activeExam = EXAMS.find(e => e.id === selectedExamId) || EXAMS[0];

  useEffect(() => {
    const calculateTime = () => {
      const target = new Date(activeExam.targetDate).getTime();
      const now = new Date().getTime();
      const difference = target - now;

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((difference / 1000 / 60) % 60);
        const seconds = Math.floor((difference / 1000) % 60);
        setTimeLeft({ days, hours, minutes, seconds });
        setIsExpired(false);
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        setIsExpired(true);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [activeExam]);

  const questionsProgress = Math.min(100, Math.round((stats.dailyQuestProgress.completedLessonsToday * 10 / dailyQuestionGoal) * 100));

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 space-y-6 pb-24 select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-violet-600 via-purple-700 to-indigo-800 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            2026 Sınav Takvimi & Hedef Takibi
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Sınav Geri Sayımı</h2>
          <p className="text-white/90 text-xs sm:text-sm font-semibold mt-1">
            Hedefindeki sınava kalan zamanı anlık takip et, günlük soru hedeflerini tamamla!
          </p>
        </div>
        <div className="text-5xl animate-bounceSubtle">⏳</div>
      </div>

      {/* Exam Switcher Tabs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {EXAMS.map(exam => {
          const isSelected = selectedExamId === exam.id;
          return (
            <button
              key={exam.id}
              onClick={() => {
                sound.playClick();
                setSelectedExamId(exam.id);
              }}
              className={`p-4 rounded-3xl border-2 flex items-center gap-3 transition-all text-left ${
                isSelected
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 shadow-md ring-2 ring-purple-300 dark:ring-purple-700'
                  : 'border-gray-200 dark:border-[#2b3d45] bg-white dark:bg-[#1a2c35] hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <span className="text-3xl select-none">{exam.icon}</span>
              <div>
                <span className="text-[10px] font-black uppercase text-purple-600 dark:text-purple-400 block">{exam.badge}</span>
                <span className="font-black text-sm text-gray-800 dark:text-gray-100">{exam.name}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Big Animated Countdown Clock */}
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 sm:p-8 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm text-center space-y-6 transition-colors duration-300">
        <div>
          <span className="text-xs font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider">
            {activeExam.name} BAŞLAMASINA KALAN ZAMAN
          </span>
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto mt-4 font-mono">
            {/* Days */}
            <div className="bg-purple-50 dark:bg-purple-950/40 border-2 border-purple-200 dark:border-purple-800 p-3 sm:p-4 rounded-2xl">
              <div className="text-3xl sm:text-5xl font-black text-purple-700 dark:text-purple-300">{String(timeLeft.days).padStart(3,"0")}</div>
              <span className="text-[10px] sm:text-xs font-black text-purple-900 dark:text-purple-200 uppercase">GÜN</span>
            </div>
            {/* Hours */}
            <div className="bg-indigo-50 dark:bg-indigo-950/40 border-2 border-indigo-200 dark:border-indigo-800 p-3 sm:p-4 rounded-2xl">
              <div className="text-3xl sm:text-5xl font-black text-indigo-700 dark:text-indigo-300">{String(timeLeft.hours).padStart(2,"0")}</div>
              <span className="text-[10px] sm:text-xs font-black text-indigo-900 dark:text-indigo-200 uppercase">SAAT</span>
            </div>
            {/* Minutes */}
            <div className="bg-blue-50 dark:bg-blue-950/40 border-2 border-blue-200 dark:border-blue-800 p-3 sm:p-4 rounded-2xl">
              <div className="text-3xl sm:text-5xl font-black text-blue-700 dark:text-blue-300">{String(timeLeft.minutes).padStart(2,"0")}</div>
              <span className="text-[10px] sm:text-xs font-black text-blue-900 dark:text-blue-200 uppercase">DAKİKA</span>
            </div>
            {/* Seconds */}
            <div className="bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-200 dark:border-emerald-800 p-3 sm:p-4 rounded-2xl animate-pulse">
              <div className="text-3xl sm:text-5xl font-black text-emerald-700 dark:text-emerald-300">{String(timeLeft.seconds).padStart(2,'0')}</div>
              <span className="text-[10px] sm:text-xs font-black text-emerald-900 dark:text-emerald-200 uppercase">SANİYE</span>
            </div>
          </div>

          {/* Expired warning */}
          {isExpired && (
            <div className="mt-4 bg-amber-50 border-2 border-amber-300 rounded-2xl p-4 text-center">
              <p className="text-amber-800 font-black text-sm">⚠️ Bu sınav tarihi geçti! 2027 takvimi için diğer sınavları seç veya güncel tarihi bekle.</p>
            </div>
          )}
        </div>
      </div>

      {/* Daily Target Goal Manager */}
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-5 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="font-black text-base text-gray-800 dark:text-gray-100">Günlük Soru Hedefin</h3>
          </div>
          <span className="text-xs font-black bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-300 px-3 py-1 rounded-xl">
            Hedef: {dailyQuestionGoal} Soru / Gün
          </span>
        </div>

        {/* Slider */}
        <div>
          <input
            type="range"
            min={15}
            max={100}
            step={5}
            value={dailyQuestionGoal}
            onChange={(e) => {
              sound.playClick();
              setDailyQuestionGoal(Number(e.target.value));
            }}
            className="w-full accent-purple-600 cursor-pointer"
          />
          <div className="flex justify-between text-[11px] font-bold text-gray-400 mt-1">
            <span>15 Soru (Hafif)</span>
            <span>40 Soru (İdeal)</span>
            <span>100 Soru (Şampiyon)</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2">
          <div className="flex justify-between text-xs font-black text-gray-700">
            <span>Bugünkü İlerlemen</span>
            <span>%{questionsProgress} Tamamlandı</span>
          </div>
          <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
            <div
              className="bg-purple-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${questionsProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Mascot Motivation */}
      <div className="flex justify-center">
        <Mascot
          size="md"
          mood="thinking"
          speech="Geri sayan saat seni korkutmasın! Her gün çözdüğün 30 soru sınav günü sana yüz binlerce sıralama kazandıracak! 🍯⏳"
        />
      </div>

    </div>
  );
};
