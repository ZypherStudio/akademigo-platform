import React, { useMemo, useState } from 'react';
import { X, Check, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { useGame } from '../context/GameContext';
import { getCourseForRegion } from '../data/regionalCoursesData';
import { CourseCategory } from '../types';
import { KnowzaSuccessScreen } from './KnowzaSuccessScreen';
import { AdInterstitialModal } from './AdInterstitialModal';

interface KnowzaQuizModalProps {
  subject: string;
  onClose: () => void;
}

interface DynamicQuizItem {
  id: string;
  prompt: string;
  subLabel: string;
  visualIcon: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

function mapSubjectToCourseId(subject: string, fallback: CourseCategory): CourseCategory {
  const s = subject.toLowerCase();
  if (s.includes('ehliyet') || s.includes('trafik') || s.includes('motor')) return 'ehliyet';
  if (s.includes('ingilizce') || s.includes('english') || s.includes('dil')) return 'dil';
  if (s.includes('almanca')) return 'dil_alm';
  if (s.includes('frans')) return 'dil_fra';
  if (s.includes('ispanyol')) return 'dil_isp';
  if (s.includes('lgs')) return 'lgs';
  if (s.includes('kpss')) return 'kpss';
  if (s.includes('kod') || s.includes('python')) return 'kodlama';
  if (s.includes('yks') || s.includes('tyt') || s.includes('ayt') || s.includes('mat')) return 'yks';
  return fallback;
}

export const KnowzaQuizModal: React.FC<KnowzaQuizModalProps> = ({ subject, onClose }) => {
  const { completeLesson, stats, regionCode, selectedCourseId } = useGame();

  const quizQuestions = useMemo<DynamicQuizItem[]>(() => {
    const courseId = mapSubjectToCourseId(subject, selectedCourseId);
    const course = getCourseForRegion(courseId, regionCode);
    const collected: DynamicQuizItem[] = [];
    for (const unit of course.units) {
      for (const lesson of unit.lessons) {
        for (const q of lesson.questions) {
          if (q.type === 'multiple_choice' && q.options.length >= 2) {
            const correctIndex = Math.max(0, q.options.findIndex((o) => o.isCorrect));
            collected.push({
              id: `${course.id}-${q.id}`,
              prompt: q.prompt,
              subLabel: `${course.name} • ${lesson.title}`,
              visualIcon: course.icon || '🎓',
              options: q.options.map((o) => o.text),
              correctIndex,
              explanation: q.explanation,
            });
          }
        }
      }
    }
    if (collected.length > 0) {
      return collected.slice(0, 6);
    }
    return [
      {
        id: 'fallback-1',
        prompt: '"Look forward to" kalıbından sonra gelen fiil hangi hali alır?',
        subLabel: `${subject} • Hızlı Alıştırma`,
        visualIcon: '📘',
        options: ['Verb + -ing (Gerund)', 'to + Verb', 'Past Participle (V3)', 'Yalın fiil'],
        correctIndex: 0,
        explanation: '"look forward to" ifadesindeki "to" edat olduğu için arkasından fiile -ing gelir.',
      },
    ];
  }, [subject, regionCode, selectedCourseId]);

  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = quizQuestions.length;
  const activeQuestion = quizQuestions[Math.min(currentStep, totalSteps - 1)];

  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);
  const [showPostTestAd, setShowPostTestAd] = useState(false);

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;
    setIsAnswered(true);
    const isCorrect = selectedOption === activeQuestion.correctIndex;
    const nextCorrect = isCorrect ? correctCount + 1 : correctCount;
    if (isCorrect) {
      sound.playCorrect();
      setCorrectCount(nextCorrect);
    } else {
      sound.playWrong();
    }

    const isLastQuestion = currentStep + 1 >= totalSteps;
    if (isLastQuestion) {
      const accuracy = Math.round((nextCorrect / Math.max(1, totalSteps)) * 100);
      completeLesson(`quick-${subject}-${Date.now()}`, Math.max(15, nextCorrect * 10), Math.max(2, nextCorrect * 2), accuracy);
    }

    window.setTimeout(() => {
      setShowSuccessScreen(true);
    }, 650);
  };

  if (showPostTestAd) {
    return (
      <AdInterstitialModal
        open={true}
        mode="interstitial"
        onClose={() => {
          setShowPostTestAd(false);
          onClose();
        }}
      />
    );
  }

  if (showSuccessScreen) {
    return (
      <KnowzaSuccessScreen
        earnedXp={Math.max(10, correctCount * 10)}
        onNext={() => {
          setShowSuccessScreen(false);
          if (currentStep + 1 < totalSteps) {
            setCurrentStep((s) => s + 1);
            setSelectedOption(null);
            setIsAnswered(false);
          } else if (!stats.isPro && !stats.isFounder && !stats.hasAdFree) {
            setShowPostTestAd(true);
          } else {
            onClose();
          }
        }}
        onHome={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FFFDF7] flex flex-col justify-between p-4 sm:p-6 select-none animate-fade overflow-y-auto">
      <div className="max-w-md md:max-w-2xl w-full mx-auto flex items-center gap-4 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] hover:bg-[#FFF8E7] active:scale-90 transition-all shadow-sm"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        <div className="flex-1 bg-[#F5EEDD] h-4 rounded-full overflow-hidden p-0.5 border border-[#E8DFC8]">
          <div
            className="bg-gradient-to-r from-[#FFC700] to-[#FFB800] h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
          />
        </div>

        <span className="font-black text-xs text-[#8C7A5E] font-mono whitespace-nowrap">
          {currentStep + 1} / {totalSteps}
        </span>
      </div>

      <div className="max-w-md md:max-w-2xl w-full mx-auto my-auto flex flex-col items-center py-4">
        <div className="w-20 sm:w-24 filter drop-shadow-md -mb-3 z-10 animate-bounceSubtle">
          <img
            src="/assets/knowza_peeking.png"
            alt="Knowza Maskot"
            className="w-full h-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/knowza_thinking.png';
            }}
          />
        </div>

        <div className="bg-white rounded-3xl p-5 sm:p-6 border-2 border-[#FFE2A3] shadow-[0_10px_30px_rgba(255,184,0,0.12)] w-full text-center space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF8E7] border border-[#FFE2A3] text-[11px] font-black text-[#8C7A5E]">
            <span>{activeQuestion.visualIcon}</span>
            <span>{activeQuestion.subLabel}</span>
          </div>
          <h2 className="text-lg sm:text-xl font-black text-[#2A1E00] leading-snug">
            {activeQuestion.prompt}
          </h2>
        </div>

        <div className="w-full space-y-2.5 mt-4">
          {activeQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = isAnswered && idx === activeQuestion.correctIndex;
            const isWrong = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full py-3.5 px-5 rounded-2xl font-black text-sm sm:text-base flex items-center justify-between text-left transition-all border-2 ${
                  isCorrect
                    ? 'bg-[#EBFBE5] border-[#58CC02] text-[#227200] shadow-md ring-2 ring-[#58CC02]/30'
                    : isWrong
                    ? 'bg-[#FEECEB] border-[#FF4B4B] text-[#D33131]'
                    : isSelected
                    ? 'bg-[#FFF2D6] border-[#FFB800] text-[#2A1E00] shadow-md scale-[1.01]'
                    : 'bg-white border-[#F2E8D5] text-[#2A1E00] hover:border-[#FFE2A3] shadow-sm'
                }`}
              >
                <span className="pr-3">{opt}</span>
                {isSelected && (
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center ${
                      isCorrect ? 'bg-[#58CC02] text-white' : 'bg-[#FFB800] text-[#2A1E00]'
                    }`}
                  >
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="max-w-md md:max-w-2xl w-full mx-auto pb-4">
        <button
          onClick={handleConfirm}
          disabled={selectedOption === null || isAnswered}
          className={`w-full py-4 rounded-3xl font-black text-base sm:text-lg border-b-[5px] transition-all flex items-center justify-center gap-2 ${
            selectedOption !== null && !isAnswered
              ? 'bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] text-[#2A1E00] border-[#D99000] active:border-b-0 active:translate-y-1 shadow-[0_10px_25px_rgba(255,184,0,0.35)] cursor-pointer'
              : 'bg-[#EADECE] text-[#A69B8D] border-[#D1C3B2] cursor-not-allowed opacity-70'
          }`}
        >
          <span>Onayla</span>
          <ChevronRight className="w-5 h-5 stroke-[3]" />
        </button>
      </div>
    </div>
  );
};
