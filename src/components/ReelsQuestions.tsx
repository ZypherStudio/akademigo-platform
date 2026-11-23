import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import {
  Flame,
  Share2,
  ArrowUp,
  ArrowDown,
  Zap,
  CheckCircle2,
  XCircle,
  Trophy,
  RotateCcw,
  Volume2,
  Timer,
  Flag,
  BarChart2,
  Home,
} from 'lucide-react';
import { sound } from '../utils/audio';
import { speakText } from '../utils/speech';
import confetti from 'canvas-confetti';
import { KnowzaAvatar } from './KnowzaAvatar';
import { getCourseForRegion } from '../data/regionalCoursesData';

function shuffleArray<T>(items: T[]): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

interface ReelQuestion {
  id: string;
  category: string;
  categoryColor: string;
  badge: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  knowzaTip: string;
}

interface SessionAttempt {
  question: ReelQuestion;
  selectedIndex: number;
  isCorrect: boolean;
  xpEarned: number;
}

interface ReelsQuestionsProps {
  onExitHome?: () => void;
  onOpenStats?: () => void;
  exitSignal?: number;
}

const REEL_QUESTIONS: ReelQuestion[] = [
  {
    id: 'rq-1',
    category: 'TYT Matematik',
    categoryColor: 'bg-emerald-500',
    badge: 'ÖSYM Banko ⚡',
    prompt: 'a ve b pozitif tam sayılardır. (3a + 5b) tek sayı ise a × b çarpımı hakkında hangisi KESİNLİKLE doğrudur?',
    options: ['Daima ÇİFT sayıdır', 'Daima TEK sayıdır', 'a daima çifttir', 'b daima tektir'],
    correctIndex: 0,
    explanation: '3a ve 5b sayılarından biri tek, biri çifttir. Dolayısıyla en az biri çift olduğu için çarpımları kesinlikle ÇİFT olur!',
    knowzaTip: 'Toplama tek ise biri Tek, diğeri Çift olmak zorundadır! Çarpımda bir çift varsa sonuç daima çifttir! 🍯✨',
  },
  {
    id: 'rq-2',
    category: 'KPSS Güncel Bilgi',
    categoryColor: 'bg-amber-500',
    badge: '2026 Sınav Sorusu 🚀',
    prompt: 'Türkiye\'nin ilk astronotu olarak Uluslararası Uzay İstasyonu\'nda (ISS) 13 deney yapan astronotumuz kimdir?',
    options: ['Alper Gezeravcı', 'Tuva Cihangir Atasever', 'Aziz Sancar', 'Selçuk Bayraktar'],
    correctIndex: 0,
    explanation: 'Alper Gezeravcı, Ocak 2024\'te Ax-3 misyonuyla uzaya çıkan ilk Türk astronottur.',
    knowzaTip: 'Ocak 2024 Ax-3 misyonunu asla unutma, KPSS\'de kesin çıkar! 🛰️',
  },
  {
    id: 'rq-3',
    category: 'Kodlama / Python',
    categoryColor: 'bg-purple-500',
    badge: 'Yazılım Mülakatı 💻',
    prompt: 'Python\'da [1, 2, 2, 3, 4, 4] listesindeki tüm tekrarları tek satırda silip benzersiz yapmak için hangisi kullanılır?',
    options: ['list(set(liste))', 'liste.unique()', 'liste.clean()', 'set.filter(liste)'],
    correctIndex: 0,
    explanation: 'set() veri yapısı küme mantığıyla tüm tekrarlayan elemanları anında eler.',
    knowzaTip: 'Python mülakatlarının 1 numaralı hilesi set() dönüşümüdür! 🐱',
  },
  {
    id: 'rq-4',
    category: 'TYT Geometri',
    categoryColor: 'bg-yellow-500',
    badge: '10 Saniyelik Pratik 📐',
    prompt: 'Dik kenar uzunlukları 9 cm ve 12 cm olan dik üçgenin hipotenüs uzunluğu kaç cm\'dir?',
    options: ['15 cm', '18 cm', '20 cm', '14 cm'],
    correctIndex: 0,
    explanation: '3-4-5 üçgeninin 3 katı: 9 - 12 - 15 özel dik üçgenidir!',
    knowzaTip: 'Pisagor formülüyle vakit kaybetme! 3-4-5\'in 3 katını hemen gör ve 15\'i işaretle! ⚡📐',
  },
  {
    id: 'rq-5',
    category: 'YDS İngilizce',
    categoryColor: 'bg-sky-500',
    badge: 'Kelime Avcısı 🌍',
    prompt: '"The government plans to CARRY OUT new reforms." cümlesinde CARRY OUT ne anlama gelir?',
    options: [
      'Uygulamak / Gerçekleştirmek (Perform)',
      'Vazgeçmek (Give up)',
      'Ertelenmek (Postpone)',
      'İptal etmek (Call off)',
    ],
    correctIndex: 0,
    explanation: '"Carry out" bir planı, deneyi veya reformu yürütmek/uygulamak demektir.',
    knowzaTip: 'YDS ve YÖKDİL\'in en sevdiği phrasal verb: Carry out = Execute / Perform! 🎯',
  },
  {
    id: 'rq-6',
    category: 'LGS Fen Bilimleri',
    categoryColor: 'bg-rose-500',
    badge: 'LGS Derece Sorusudur 🧬',
    prompt: 'Kalıtım birimlerinin basitten karmaşığa (küçükten büyüğe) doğru doğru sıralanışı hangisidir?',
    options: [
      'Nükleotid < Gen < DNA < Kromozom',
      'Kromozom < DNA < Gen < Nükleotid',
      'Gen < Nükleotid < DNA < Kromozom',
      'Nükleotid < DNA < Gen < Kromozom',
    ],
    correctIndex: 0,
    explanation: 'Büyükten küçüğe KeDiGeNi kodlaması kullanılır. Küçükten büyüğe ise Nükleotid < Gen < DNA < Kromozom şeklindedir.',
    knowzaTip: 'Ke-Di-Ge-Ni taktiğini aklında tut: Kromozom > DNA > Gen > Nükleotid! 🧬✨',
  },
  {
    id: 'rq-7',
    category: 'TYT Türkçe',
    categoryColor: 'bg-blue-600',
    badge: 'Yazım Kuralı Tuzak 📝',
    prompt: 'Aşağıdaki sözcüklerden hangisinin yazımı TDK kurallarına göre DOĞRUDUR?',
    options: ['Her şey', 'Herşey', 'Hiç bir', 'Pekaz'],
    correctIndex: 0,
    explanation: '"Şey" sözcüğü her zaman kendinden önceki sözcükten ayrı yazılır: "Her şey", "Bir şey".',
    knowzaTip: 'Şey sözcüğü o kadar yalnızdır ki kimseyle birleşmez, hep ayrı yazılır! 🍯',
  },
];

export const ReelsQuestions: React.FC<ReelsQuestionsProps> = ({
  onExitHome,
  onOpenStats,
  exitSignal = 0,
}) => {
  const { recordReelsAnswer, loseHeart, regionCode, selectedCourseId } = useGame();
  const [feedQuestions, setFeedQuestions] = useState<ReelQuestion[]>(() => {
    const extraCourses = [
      getCourseForRegion(selectedCourseId, regionCode),
      getCourseForRegion('ehliyet', regionCode),
    ];
    const seenIds = new Set<string>();
    const dynamicItems: ReelQuestion[] = [];
    extraCourses.forEach((course) => {
      course.units.forEach((unit) => {
        unit.lessons.forEach((lesson) => {
          lesson.questions.forEach((q) => {
            if (q.type === 'multiple_choice' && q.options.length >= 2) {
              const uid = `dyn-${course.id}-${q.id}`;
              if (seenIds.has(uid)) return;
              seenIds.add(uid);
              const correctIdx = Math.max(0, q.options.findIndex((o) => o.isCorrect));
              dynamicItems.push({
                id: uid,
                category: course.name,
                categoryColor: course.id === 'ehliyet' ? 'bg-rose-500' : 'bg-indigo-500',
                badge: course.badge || 'Güncel 2026',
                prompt: q.prompt,
                options: q.options.map((o) => o.text),
                correctIndex: correctIdx,
                explanation: q.explanation,
                knowzaTip: q.explanation,
              });
            }
          });
        });
      });
    });
    return shuffleArray([...REEL_QUESTIONS, ...dynamicItems]);
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [attemptsByQuestionId, setAttemptsByQuestionId] = useState<Record<string, SessionAttempt>>({});
  const [timeLeft, setTimeLeft] = useState(15);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [copiedShare, setCopiedShare] = useState(false);
  const [showSummary, setShowSummary] = useState(false);

  const touchStartYRef = useRef<number | null>(null);
  const touchStartXRef = useRef<number | null>(null);
  const lastExitSignalRef = useRef(exitSignal);

  const currentQ = feedQuestions[currentIndex % feedQuestions.length];
  const currentAttempt = attemptsByQuestionId[currentQ.id];
  const selectedOption = currentAttempt ? currentAttempt.selectedIndex : null;
  const isAnswered = Boolean(currentAttempt);
  const sessionList = Object.values(attemptsByQuestionId);
  const sessionSolved = sessionList.length;
  const sessionCorrect = sessionList.filter((a) => a.isCorrect).length;
  const wrongAttempts = sessionList.filter((a) => !a.isCorrect);

  // When user clicks "Ana Sayfa" in top bar after solving at least 1 question, show result summary first!
  useEffect(() => {
    if (exitSignal !== lastExitSignalRef.current) {
      lastExitSignalRef.current = exitSignal;
      if (sessionSolved > 0 && !showSummary) {
        setShowSummary(true);
      } else if (onExitHome) {
        onExitHome();
      }
    }
  }, [exitSignal, sessionSolved, showSummary, onExitHome]);

  // 15-second countdown timer when question is unanswered & summary is closed
  useEffect(() => {
    if (isAnswered || showSummary) return;
    const timer = window.setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          window.clearInterval(timer);
          handleSelectOption(-1);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isAnswered, showSummary, currentIndex]);

  const handleSelectOption = (index: number) => {
    if (attemptsByQuestionId[currentQ.id]) return;

    const isCorrect = index === currentQ.correctIndex;
    const nextCombo = isCorrect ? combo + 1 : 0;
    const earned = isCorrect ? 15 + nextCombo * 5 : 0;

    if (isCorrect) {
      sound.playCorrect();
      confetti({
        particleCount: 24,
        spread: 55,
        origin: { y: 0.72 },
      });
      setCombo(nextCombo);
      if (nextCombo > bestCombo) setBestCombo(nextCombo);
      setTotalXpEarned((x) => x + earned);
    } else {
      sound.playWrong();
      setCombo(0);
      loseHeart({
        prompt: currentQ.prompt,
        correctAnswer: currentQ.options[currentQ.correctIndex] || '',
        explanation: currentQ.explanation,
      }, true);
    }

    // Persist immediately into global stats & Reels stats so nothing is lost on exit!
    recordReelsAnswer(isCorrect, earned, nextCombo);

    setAttemptsByQuestionId((prev) => ({
      ...prev,
      [currentQ.id]: {
        question: currentQ,
        selectedIndex: index,
        isCorrect,
        xpEarned: earned,
      },
    }));
  };

  const handleNextQuestion = () => {
    sound.playClick();
    setTimeLeft(15);
    setCurrentIndex((i) => i + 1);
  };

  const handlePrevQuestion = () => {
    if (currentIndex <= 0) return;
    sound.playClick();
    setTimeLeft(15);
    setCurrentIndex((i) => Math.max(0, i - 1));
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartYRef.current = e.touches[0]?.clientY ?? null;
    touchStartXRef.current = e.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartYRef.current === null || touchStartXRef.current === null) return;
    const endY = e.changedTouches[0]?.clientY ?? touchStartYRef.current;
    const endX = e.changedTouches[0]?.clientX ?? touchStartXRef.current;
    const deltaY = touchStartYRef.current - endY;
    const deltaX = Math.abs(touchStartXRef.current - endX);
    touchStartYRef.current = null;
    touchStartXRef.current = null;

    if (Math.abs(deltaY) < 55 || Math.abs(deltaY) < deltaX) return;
    if (deltaY > 55) {
      handleNextQuestion();
    } else if (deltaY < -55 && currentIndex > 0) {
      handlePrevQuestion();
    }
  };

  const handleFinishSession = () => {
    sound.playVictory();
    setShowSummary(true);
  };

  const handleRestartFeed = () => {
    sound.playClick();
    setFeedQuestions((prev) => shuffleArray(prev));
    setAttemptsByQuestionId({});
    setCurrentIndex(0);
    setCombo(0);
    setBestCombo(0);
    setTotalXpEarned(0);
    setTimeLeft(15);
    setShowSummary(false);
  };

  const handleShare = () => {
    sound.playClick();
    const shareText = `🔥 Knowza Soru Kaydır'da ${sessionCorrect}/${Math.max(1, sessionSolved)} doğru yaptım (${bestCombo}x kombo)! 🍯✨`;
    if (navigator.share) {
      navigator.share({ title: 'Knowza Soru Kaydır', text: shareText }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2000);
    }
  };

  if (showSummary) {
    const accuracy = sessionSolved > 0 ? Math.round((sessionCorrect / sessionSolved) * 100) : 0;
    return (
      <div className="flex-1 max-w-md md:max-w-2xl mx-auto py-4 px-3 sm:px-5 space-y-4 pb-28 select-none">
        <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-lg text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 flex items-center justify-center">
            <Trophy className="w-10 h-10 text-amber-600" />
          </div>

          <div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Soru Kaydır Sonuç Özeti 🔥
            </h2>
            <p className="text-xs font-bold text-slate-500 mt-1">
              Tüm çözdüğün sorular istatistiklerine ve serinle birlikte profiline kaydedildi!
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200">
              <div className="text-lg font-black text-slate-900">{sessionSolved}</div>
              <div className="text-[10px] font-bold text-slate-500">Çözülen Soru</div>
            </div>
            <div className="bg-emerald-50 rounded-2xl p-3 border border-emerald-200">
              <div className="text-lg font-black text-emerald-700">
                {sessionCorrect} (%{accuracy})
              </div>
              <div className="text-[10px] font-bold text-slate-500">Doğru Oranı</div>
            </div>
            <div className="bg-orange-50 rounded-2xl p-3 border border-orange-200">
              <div className="text-lg font-black text-orange-600">{bestCombo}x</div>
              <div className="text-[10px] font-bold text-slate-500">En İyi Kombo</div>
            </div>
            <div className="bg-indigo-50 rounded-2xl p-3 border border-indigo-200">
              <div className="text-lg font-black text-indigo-700">+{totalXpEarned} XP</div>
              <div className="text-[10px] font-bold text-slate-500">Kazanılan XP</div>
            </div>
          </div>

          {wrongAttempts.length > 0 && (
            <div className="text-left space-y-2 pt-2 border-t border-slate-100">
              <h3 className="text-xs font-black text-rose-700 uppercase tracking-wider">
                Yanlış / Süresi Dolmuş Sorular ({wrongAttempts.length})
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {wrongAttempts.map((item) => (
                  <div
                    key={item.question.id}
                    className="p-3 rounded-2xl bg-rose-50/70 border border-rose-200 space-y-1"
                  >
                    <div className="text-xs font-black text-slate-900">{item.question.prompt}</div>
                    <div className="text-[11px] font-bold text-emerald-700">
                      ✅ Doğru Cevap: {item.question.options[item.question.correctIndex]}
                    </div>
                    <div className="text-[11px] text-slate-600">{item.question.explanation}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2">
            <button
              onClick={handleRestartFeed}
              className="py-3 px-4 rounded-2xl bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black text-xs border-b-4 border-amber-700 active:border-b-0 active:translate-y-0.5 flex items-center justify-center gap-1.5"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Yeni Akış</span>
            </button>
            {onOpenStats && (
              <button
                onClick={() => {
                  sound.playClick();
                  onOpenStats();
                }}
                className="py-3 px-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs border-b-4 border-indigo-800 active:border-b-0 active:translate-y-0.5 flex items-center justify-center gap-1.5"
              >
                <BarChart2 className="w-4 h-4" />
                <span>İstatistikler</span>
              </button>
            )}
            {onExitHome && (
              <button
                onClick={() => {
                  sound.playClick();
                  onExitHome();
                }}
                className="py-3 px-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-black text-xs flex items-center justify-center gap-1.5"
              >
                <Home className="w-4 h-4" />
                <span>Ana Sayfa</span>
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  const isCorrectAnswer = selectedOption === currentQ.correctIndex;

  return (
    <div
      className="flex-1 max-w-md md:max-w-2xl mx-auto py-3 px-2 sm:px-4 flex flex-col justify-center w-full select-none"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Top Floating Reel Stats Bar */}
      <div className="flex items-center justify-between gap-2 bg-white dark:bg-[#1a2c35] border-2 border-gray-200 dark:border-[#2b3d45] rounded-2xl p-2.5 sm:p-3 mb-3 shadow-sm">
        <div className="flex items-center gap-1.5">
          <div className={`p-1.5 rounded-xl ${combo > 1 ? 'bg-orange-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
            <Flame className="w-4 h-4 fill-current" />
          </div>
          <div>
            <div className="text-xs font-black text-gray-800 dark:text-gray-100 flex items-center gap-1">
              <span>{combo}x KOMBO</span>
            </div>
            <div className="text-[10px] text-gray-400 font-bold">
              {sessionCorrect}/{sessionSolved} doğru
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center gap-1 font-black text-xs px-2.5 py-1 rounded-xl ${
              timeLeft <= 5
                ? 'bg-red-500 text-white'
                : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
            }`}
          >
            <Timer className="w-3.5 h-3.5" />
            <span>{timeLeft}s</span>
          </div>

          <button
            onClick={handleFinishSession}
            className="px-2.5 py-1 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] flex items-center gap-1 shadow-xs active:scale-95 transition"
            title="Testi Bitir ve Sonuçları Gör"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Bitir</span>
          </button>
        </div>

        <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-2.5 py-1 rounded-xl">
          <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
          <span className="text-xs font-black text-amber-600 dark:text-amber-400">+{totalXpEarned} XP</span>
        </div>
      </div>

      {/* Main Swipeable Question Card */}
      <div className="relative bg-white dark:bg-[#1a2c35] border-2 border-gray-200 dark:border-[#2b3d45] rounded-3xl p-4 sm:p-6 shadow-md flex flex-col justify-between overflow-hidden">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className={`${currentQ.categoryColor} text-white font-black text-[11px] px-3 py-1 rounded-full uppercase tracking-wider`}>
              {currentQ.category}
            </span>
            <span className="text-[11px] font-black text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-xl">
              Soru #{currentIndex + 1} • {currentQ.badge}
            </span>
          </div>

          <div className="flex items-start justify-between gap-2.5 mb-4 min-h-[52px]">
            <h2 className="text-base sm:text-lg font-black text-gray-800 dark:text-gray-100 leading-snug tracking-tight flex-1">
              {currentQ.prompt}
            </h2>
            <button
              onClick={() => {
                sound.playClick();
                speakText(currentQ.prompt, currentQ.category.includes('İngilizce') ? 'en-US' : 'tr-TR');
              }}
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-200 flex-shrink-0"
              title="Soruyu Sesli Oku"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          <div className="space-y-2.5">
            {currentQ.options.map((optText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle =
                'border-gray-200 dark:border-[#2b3d45] hover:border-blue-400 bg-white dark:bg-[#202f36] text-gray-800 dark:text-gray-100';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-green-500 bg-green-500 text-white shadow-sm';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-red-500 bg-red-500 text-white shadow-sm';
                } else {
                  btnStyle = 'border-gray-200 dark:border-gray-800 opacity-50 bg-gray-50 dark:bg-gray-800';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 rounded-2xl border-2 font-black text-xs sm:text-sm text-left flex items-center justify-between transition-colors ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{optText}</span>
                  </div>

                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 flex-shrink-0" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation / Swipe Controls Always Accessible (Even Before Answering) */}
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <button
            onClick={handlePrevQuestion}
            disabled={currentIndex === 0}
            className="px-3 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 disabled:opacity-40 text-slate-700 font-black text-xs flex items-center gap-1"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Önceki</span>
          </button>

          <button
            onClick={handleNextQuestion}
            className="flex-1 py-2.5 px-4 rounded-xl bg-[#FFB800] hover:bg-[#FFA500] text-slate-950 font-black text-xs border-b-3 border-amber-700 active:border-b-0 active:translate-y-0.5 flex items-center justify-center gap-1.5"
          >
            <span>{isAnswered ? 'SONRAKİ SORU' : 'KAYDIR / SONRAKİ'}</span>
            <ArrowUp className="w-4 h-4 stroke-[3]" />
          </button>

          <button
            onClick={handleShare}
            className="px-3 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-black text-xs flex items-center gap-1"
            title="Skorunu Paylaş"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{copiedShare ? 'Kopyalandı' : 'Paylaş'}</span>
          </button>
        </div>

        {isAnswered && (
          <div className="mt-3 bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700 rounded-2xl p-3 flex items-start gap-2.5">
            <KnowzaAvatar size="md" animate={false} />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5 flex-wrap">
                <span>Knowza Maskot Notu</span>
                {isCorrectAnswer ? (
                  <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full font-black">
                    DOĞRU! +{currentAttempt?.xpEarned || 15} XP
                  </span>
                ) : (
                  <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 rounded-full font-black">
                    {selectedOption === -1 ? 'SÜRE DOLDU!' : 'YANLIŞ! 💔'}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-900 dark:text-amber-200 font-semibold mt-1 leading-snug">
                {currentQ.explanation}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-2.5 text-center">
        <span className="text-[11px] font-black uppercase text-gray-400 tracking-wider">
          ☝️ Yukarı kaydır: Sonraki Soru • &quot;Bitir&quot; ile Sonuç Ekranı
        </span>
      </div>
    </div>
  );
};
