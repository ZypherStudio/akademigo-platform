import React, { useState } from 'react';
import { X, Check, ChevronRight } from 'lucide-react';
import { sound } from '../utils/audio';
import { useGame } from '../context/GameContext';
import { KnowzaSuccessScreen } from './KnowzaSuccessScreen';

interface KnowzaQuizModalProps {
  subject: string;
  onClose: () => void;
}

export const KnowzaQuizModal: React.FC<KnowzaQuizModalProps> = ({ subject, onClose }) => {
  const { addXpAndGems } = useGame();
  
  const [currentStep, setCurrentStep] = useState(3);
  const totalSteps = 10;
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [showSuccessScreen, setShowSuccessScreen] = useState(false);

  const sampleQuestion = {
    prompt: 'Bu kelimenin Türkçe karşılığı nedir?',
    englishWord: 'Apple',
    visualIcon: '🍎',
    options: ['Elma', 'Armut', 'Muz', 'Portakal'],
    correctIndex: 0
  };

  const handleSelect = (index: number) => {
    if (isAnswered) return;
    sound.playClick();
    setSelectedOption(index);
  };

  const handleConfirm = () => {
    if (selectedOption === null) return;

    setIsAnswered(true);
    const isCorrect = selectedOption === sampleQuestion.correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      addXpAndGems(10, 2);
      setTimeout(() => {
        setShowSuccessScreen(true);
      }, 700);
    } else {
      sound.playWrong();
    }
  };

  if (showSuccessScreen) {
    return (
      <KnowzaSuccessScreen
        earnedXp={10}
        onNext={() => {
          setShowSuccessScreen(false);
          if (currentStep < totalSteps) {
            setCurrentStep(s => s + 1);
            setSelectedOption(null);
            setIsAnswered(false);
          } else {
            onClose();
          }
        }}
        onHome={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#FFFDF7] flex flex-col justify-between p-4 sm:p-6 select-none animate-fade">
      
      {/* Top Header Bar: Close & Horizontal Progress Bar */}
      <div className="max-w-md w-full mx-auto flex items-center gap-4 pt-2">
        <button
          onClick={() => {
            sound.playClick();
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white border border-[#F2E8D5] flex items-center justify-center text-[#70685A] hover:bg-[#FFF8E7] active:scale-90 transition-all shadow-sm"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Rounded Yellow Progress Bar */}
        <div className="flex-1 bg-[#F5EEDD] h-4 rounded-full overflow-hidden p-0.5 border border-[#E8DFC8]">
          <div
            className="bg-gradient-to-r from-[#FFC700] to-[#FFB800] h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        <span className="font-black text-xs text-[#8C7A5E] font-mono whitespace-nowrap">
          {currentStep} / {totalSteps}
        </span>
      </div>

      {/* Main Question Card with Peeking Knowza Bear */}
      <div className="max-w-md w-full mx-auto my-auto flex flex-col items-center">
        
        {/* Peeking Knowza Bear */}
        <div className="w-24 sm:w-28 filter drop-shadow-md -mb-3 z-10 animate-bounceSubtle">
          <img 
            src="/assets/knowza_peeking.png" 
            alt="Knowza Maskot" 
            className="w-full h-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/assets/knowza_thinking.png';
            }}
          />
        </div>

        {/* Question Prompt Box */}
        <div className="bg-white rounded-3xl p-6 border-2 border-[#FFE2A3] shadow-[0_10px_30px_rgba(255,184,0,0.12)] w-full text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-black text-[#2A1E00] leading-snug">
            {sampleQuestion.prompt}
          </h2>

          {/* Visual Apple Icon */}
          <div className="w-28 h-28 mx-auto bg-[#FFF8E7] rounded-3xl border border-[#FFE2A3] flex items-center justify-center text-6xl shadow-inner animate-pop">
            {sampleQuestion.visualIcon}
          </div>
          <div className="text-sm font-black text-[#8C7A5E] uppercase tracking-wider font-mono">
            {sampleQuestion.englishWord}
          </div>
        </div>

        {/* 4 Clean Options (Matching Image 2 Screen 3) */}
        <div className="w-full space-y-2.5 mt-5">
          {sampleQuestion.options.map((opt, idx) => {
            const isSelected = selectedOption === idx;
            const isCorrect = isAnswered && idx === sampleQuestion.correctIndex;
            const isWrong = isAnswered && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelect(idx)}
                className={`w-full py-4 px-5 rounded-2xl font-black text-base sm:text-lg flex items-center justify-between transition-all border-2 ${
                  isCorrect
                    ? 'bg-[#EBFBE5] border-[#58CC02] text-[#227200] shadow-md ring-2 ring-[#58CC02]/30'
                    : isWrong
                    ? 'bg-[#FEECEB] border-[#FF4B4B] text-[#D33131]'
                    : isSelected
                    ? 'bg-[#FFF2D6] border-[#FFB800] text-[#2A1E00] shadow-md scale-101'
                    : 'bg-white border-[#F2E8D5] text-[#2A1E00] hover:border-[#FFE2A3] shadow-sm'
                }`}
              >
                <span>{opt}</span>
                {isSelected && (
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    isCorrect ? 'bg-[#58CC02] text-white' : 'bg-[#FFB800] text-[#2A1E00]'
                  }`}>
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>

      </div>

      {/* Bottom Button: Büyük Sarı Onayla Butonu */}
      <div className="max-w-md w-full mx-auto pb-4">
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
