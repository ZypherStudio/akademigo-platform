import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Lesson, Question, MatchingPair } from '../types';
import { X, Heart, CheckCircle2, XCircle, Lightbulb, Sparkles, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import { Mascot } from './Mascot';

interface LessonModalProps {
  lesson: Lesson;
  onClose: () => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ lesson, onClose }) => {
  const { stats, loseHeart, completeLesson, refillHearts } = useGame();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');
  const [showHint, setShowHint] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  // Matching specific state
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [matchedPairs, setMatchedPairs] = useState<string[]>([]);

  // Code Fill specific state
  const [selectedFillOption, setSelectedFillOption] = useState<string | null>(null);

  const currentQ: Question | undefined = lesson.questions[currentIndex];
  const progressPercent = Math.round(((currentIndex) / lesson.questions.length) * 100);

  useEffect(() => {
    setSelectedAnswer(null);
    setStatus('idle');
    setShowHint(false);
    setSelectedLeft(null);
    setSelectedRight(null);
    setMatchedPairs([]);
    setSelectedFillOption(null);
  }, [currentIndex]);

  // Handle Matching logic
  const handleSelectMatchingLeft = (item: string) => {
    sound.playClick();
    setSelectedLeft(item);
    if (selectedRight && currentQ?.type === 'matching') {
      verifyMatch(item, selectedRight, currentQ.pairs);
    }
  };

  const handleSelectMatchingRight = (item: string) => {
    sound.playClick();
    setSelectedRight(item);
    if (selectedLeft && currentQ?.type === 'matching') {
      verifyMatch(selectedLeft, item, currentQ.pairs);
    }
  };

  const verifyMatch = (left: string, right: string, pairs: MatchingPair[]) => {
    const isPair = pairs.some(p => p.left === left && p.right === right);
    if (isPair) {
      sound.playCorrect();
      const updated = [...matchedPairs, left];
      setMatchedPairs(updated);
      setSelectedLeft(null);
      setSelectedRight(null);

      // If all matched
      if (updated.length === pairs.length) {
        setStatus('correct');
      }
    } else {
      sound.playWrong();
      loseHeart();
      setMistakesCount(m => m + 1);
      setSelectedLeft(null);
      setSelectedRight(null);
    }
  };

  // Handle Question Check
  const handleCheck = () => {
    if (!currentQ) return;

    let isCorrect = false;

    if (currentQ.type === 'multiple_choice') {
      const option = currentQ.options.find(o => o.id === selectedAnswer);
      isCorrect = !!option?.isCorrect;
    } else if (currentQ.type === 'true_false') {
      const boolAnswer = selectedAnswer === 'true';
      isCorrect = boolAnswer === currentQ.correctAnswer;
    } else if (currentQ.type === 'code_fill') {
      isCorrect = selectedFillOption === currentQ.correctAnswer;
    }

    if (isCorrect) {
      sound.playCorrect();
      setStatus('correct');
    } else {
      loseHeart();
      setMistakesCount(m => m + 1);
      setStatus('wrong');
    }
  };

  const handleContinue = () => {
    sound.playClick();
    if (currentIndex + 1 < lesson.questions.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Finished all questions!
      const total = lesson.questions.length;
      const accuracy = Math.round(Math.max(0, (total - mistakesCount) / total) * 100);
      completeLesson(lesson.id, lesson.xpReward, lesson.gemReward, accuracy);
      setIsCompleted(true);
    }
  };

  // If Out of Hearts
  if (stats.hearts <= 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 text-center shadow-2xl animate-pop border-2 border-red-200">
          <div className="text-6xl mb-3">💔</div>
          <h2 className="text-2xl font-black text-gray-800">Canların Tükendi!</h2>
          <p className="text-sm text-gray-600 font-semibold mt-2 mb-6">
            Derslere devam etmek için canlarını elmas ile doldurabilir veya çalışma odasında pratik yapabilirsin.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => refillHearts()}
              className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-3.5 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2"
            >
              <span>Canları Doldur</span>
              <span className="bg-white/20 px-2 py-0.5 rounded-lg text-sm">💎 50</span>
            </button>
            <button
              onClick={onClose}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-3 rounded-2xl transition-all"
            >
              ŞİMDİLİK ÇIK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Victory / Completed View
  if (isCompleted) {
    const accuracy = Math.round(Math.max(0, (lesson.questions.length - mistakesCount) / lesson.questions.length) * 100);
    return (
      <div className="fixed inset-0 z-50 bg-[#131f24] text-white flex flex-col items-center justify-center p-6 select-none animate-pop">
        <div className="max-w-md w-full text-center space-y-6">
          <Mascot size="lg" mood="cheering" speech="Harikasın! Bu dersi ustalıkla bitirdin! 🦉🎉" />
          <div>
            <h2 className="text-3xl font-black text-[#58cc02]">Ders Tamamlandı!</h2>
            <p className="text-gray-400 font-semibold mt-1">
              Harika bir azim gösterdin, hedefine bir adım daha yaklaştın.
            </p>
          </div>

          {/* Result Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#202f36] border-2 border-[#2b3d45] rounded-2xl p-4 text-center">
              <span className="text-xs font-black uppercase text-amber-400">KAZANILAN XP</span>
              <div className="text-2xl font-black text-amber-400 mt-1">+{lesson.xpReward}</div>
            </div>
            <div className="bg-[#202f36] border-2 border-[#2b3d45] rounded-2xl p-4 text-center">
              <span className="text-xs font-black uppercase text-blue-400">ELMASLAR</span>
              <div className="text-2xl font-black text-blue-400 mt-1">+{lesson.gemReward}</div>
            </div>
            <div className="bg-[#202f36] border-2 border-[#2b3d45] rounded-2xl p-4 text-center">
              <span className="text-xs font-black uppercase text-green-400">DOĞRULUK</span>
              <div className="text-2xl font-black text-green-400 mt-1">%{accuracy}</div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-4 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all text-base tracking-wider"
          >
            DEVAM ET
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col justify-between select-none overflow-y-auto">
      
      {/* Top Header with Progress and Hearts */}
      <div className="max-w-4xl w-full mx-auto px-4 py-4 sm:py-6 flex items-center justify-between gap-4">
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 p-2 rounded-xl transition-colors"
          title="Dersi Kapat"
        >
          <X className="w-6 h-6 stroke-[3]" />
        </button>

        {/* Dynamic Progress Bar */}
        <div className="flex-1 bg-gray-200 h-4 rounded-full overflow-hidden relative">
          <div
            className="bg-[#58cc02] h-full transition-all duration-500 rounded-full"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Hearts */}
        <div className="flex items-center gap-1.5 font-black text-red-500">
          <Heart className="w-6 h-6 fill-red-500 text-red-500" />
          <span className="text-lg">{stats.hearts}</span>
        </div>
      </div>

      {/* Main Question Body */}
      <div className="max-w-2xl w-full mx-auto px-4 py-4 flex-1 flex flex-col justify-center">
        {currentQ && (
          <div className="space-y-6 animate-pop">
            
            {/* Header info / Hint */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-gray-400">
                Soru {currentIndex + 1} / {lesson.questions.length}
              </span>

              {currentQ.hint && (
                <button
                  onClick={() => setShowHint(!showHint)}
                  className="flex items-center gap-1 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  {showHint ? 'İpucunu Gizle' : 'İpucu Gör'}
                </button>
              )}
            </div>

            {showHint && currentQ.hint && (
              <div className="p-3 bg-amber-50 border-2 border-amber-200 text-amber-900 rounded-2xl text-xs font-bold animate-pop">
                💡 İpucu: {currentQ.hint}
              </div>
            )}

            {/* Question Prompt */}
            <h3 className="text-xl sm:text-2xl font-black text-gray-800 leading-snug">
              {currentQ.prompt}
            </h3>

            {/* 1. Multiple Choice Options */}
            {currentQ.type === 'multiple_choice' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {currentQ.options.map((opt, i) => {
                  const letters = ['A', 'B', 'C', 'D'];
                  const isSelected = selectedAnswer === opt.id;
                  return (
                    <button
                      key={opt.id}
                      disabled={status !== 'idle'}
                      onClick={() => {
                        sound.playClick();
                        setSelectedAnswer(opt.id);
                      }}
                      className={`p-4 rounded-2xl font-extrabold text-sm sm:text-base border-2 text-left transition-all flex items-start gap-3 ${
                        isSelected
                          ? 'border-[#1cb0f6] bg-blue-50 text-[#1cb0f6] shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className={`w-6 h-6 rounded-lg text-xs flex items-center justify-center font-black ${
                        isSelected ? 'bg-[#1cb0f6] text-white' : 'bg-gray-100 text-gray-500'
                      }`}>
                        {letters[i]}
                      </span>
                      <span className="flex-1 leading-snug">{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* 2. True / False */}
            {currentQ.type === 'true_false' && (
              <div className="space-y-4 pt-2">
                <div className="bg-gray-50 p-4 rounded-2xl border-2 border-gray-200 font-bold text-gray-800 text-base">
                  "{currentQ.statement}"
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    disabled={status !== 'idle'}
                    onClick={() => {
                      sound.playClick();
                      setSelectedAnswer('true');
                    }}
                    className={`py-4 rounded-2xl font-black text-base border-2 transition-all ${
                      selectedAnswer === 'true'
                        ? 'border-[#58cc02] bg-green-50 text-[#58cc02]'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    DOĞRU ✅
                  </button>
                  <button
                    disabled={status !== 'idle'}
                    onClick={() => {
                      sound.playClick();
                      setSelectedAnswer('false');
                    }}
                    className={`py-4 rounded-2xl font-black text-base border-2 transition-all ${
                      selectedAnswer === 'false'
                        ? 'border-red-500 bg-red-50 text-red-500'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                    }`}
                  >
                    YANLIŞ ❌
                  </button>
                </div>
              </div>
            )}

            {/* 3. Code Fill */}
            {currentQ.type === 'code_fill' && (
              <div className="space-y-4 pt-2">
                <div className="bg-gray-900 text-green-400 p-5 rounded-2xl font-mono text-base border-2 border-gray-800 shadow-inner overflow-x-auto whitespace-pre">
                  {currentQ.codeSnippet.replace('___', selectedFillOption ? `[ ${selectedFillOption} ]` : '[ ? ]')}
                </div>

                <div className="text-xs font-black uppercase text-gray-400">Aşağıdaki kelimelerden birini seç:</div>
                <div className="flex flex-wrap gap-2">
                  {currentQ.options.map((opt) => (
                    <button
                      key={opt}
                      disabled={status !== 'idle'}
                      onClick={() => {
                        sound.playClick();
                        setSelectedFillOption(opt);
                      }}
                      className={`px-4 py-2.5 rounded-xl font-mono text-sm font-bold border-2 transition-all ${
                        selectedFillOption === opt
                          ? 'border-[#af72ff] bg-purple-50 text-[#af72ff]'
                          : 'border-gray-200 hover:border-gray-300 text-gray-700 bg-white'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Matching */}
            {currentQ.type === 'matching' && (
              <div className="grid grid-cols-2 gap-4 pt-2">
                {/* Left Column */}
                <div className="space-y-2">
                  {currentQ.pairs.map((pair) => {
                    const isMatched = matchedPairs.includes(pair.left);
                    const isSelected = selectedLeft === pair.left;
                    return (
                      <button
                        key={pair.id + '-left'}
                        disabled={isMatched || status !== 'idle'}
                        onClick={() => handleSelectMatchingLeft(pair.left)}
                        className={`w-full p-3.5 rounded-2xl font-bold text-xs sm:text-sm border-2 text-left transition-all ${
                          isMatched
                            ? 'border-green-300 bg-green-50 text-green-700 opacity-60'
                            : isSelected
                            ? 'border-[#1cb0f6] bg-blue-50 text-[#1cb0f6]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {pair.left}
                      </button>
                    );
                  })}
                </div>

                {/* Right Column (shuffled order or same) */}
                <div className="space-y-2">
                  {[...currentQ.pairs].reverse().map((pair) => {
                    const isMatched = matchedPairs.includes(pair.left);
                    const isSelected = selectedRight === pair.right;
                    return (
                      <button
                        key={pair.id + '-right'}
                        disabled={isMatched || status !== 'idle'}
                        onClick={() => handleSelectMatchingRight(pair.right)}
                        className={`w-full p-3.5 rounded-2xl font-bold text-xs sm:text-sm border-2 text-left transition-all ${
                          isMatched
                            ? 'border-green-300 bg-green-50 text-green-700 opacity-60'
                            : isSelected
                            ? 'border-[#1cb0f6] bg-blue-50 text-[#1cb0f6]'
                            : 'border-gray-200 hover:border-gray-300 text-gray-700'
                        }`}
                      >
                        {pair.right}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}
      </div>

      {/* Bottom Feedback Drawer */}
      <div className={`p-4 sm:p-6 border-t-2 transition-all ${
        status === 'correct'
          ? 'bg-[#d7ffb8] border-[#a2f263]'
          : status === 'wrong'
          ? 'bg-[#ffdfe0] border-[#f8a8a8]'
          : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Status Message */}
          <div className="w-full sm:w-auto">
            {status === 'correct' && (
              <div className="flex items-center gap-3 text-[#58a700] animate-pop">
                <div className="hidden sm:block">
                  <Mascot size="sm" mood="happy" interactive={false} />
                </div>
                <CheckCircle2 className="w-9 h-9 stroke-[3] sm:hidden" />
                <div>
                  <h4 className="text-xl font-black">Harika! Doğru Cevap!</h4>
                  <p className="text-xs font-bold text-green-800 mt-0.5">{currentQ?.explanation}</p>
                </div>
              </div>
            )}

            {status === 'wrong' && (
              <div className="flex items-center gap-3 text-[#ea2b2b] animate-pop">
                <div className="hidden sm:block">
                  <Mascot size="sm" mood="sad" interactive={false} />
                </div>
                <XCircle className="w-9 h-9 stroke-[3] sm:hidden" />
                <div>
                  <h4 className="text-xl font-black">Hatalı Yanıt</h4>
                  <p className="text-xs font-bold text-red-800 mt-0.5">{currentQ?.explanation}</p>
                </div>
              </div>
            )}

            {status === 'idle' && (
              <div className="hidden sm:block text-xs font-bold text-gray-400">
                Cevabını seç ve "Kontrol Et" butonuna tıkla.
              </div>
            )}
          </div>

          {/* Action Button */}
          {status === 'idle' ? (
            <button
              disabled={
                currentQ?.type === 'matching'
                  ? matchedPairs.length < currentQ.pairs.length
                  : currentQ?.type === 'code_fill'
                  ? !selectedFillOption
                  : !selectedAnswer
              }
              onClick={currentQ?.type === 'matching' ? handleContinue : handleCheck}
              className={`w-full sm:w-44 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-b-4 ${
                (currentQ?.type === 'matching' ? matchedPairs.length === currentQ.pairs.length : selectedAnswer || selectedFillOption)
                  ? 'bg-[#58cc02] hover:bg-[#46a302] text-white border-[#46a302] active:border-b-0 active:translate-y-1'
                  : 'bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
            >
              KONTROL ET
            </button>
          ) : (
            <button
              onClick={handleContinue}
              className={`w-full sm:w-44 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all border-b-4 active:border-b-0 active:translate-y-1 ${
                status === 'correct'
                  ? 'bg-[#58cc02] hover:bg-[#46a302] text-white border-[#46a302]'
                  : 'bg-red-500 hover:bg-red-600 text-white border-red-700'
              }`}
            >
              DEVAM ET
            </button>
          )}

        </div>
      </div>

    </div>
  );
};
