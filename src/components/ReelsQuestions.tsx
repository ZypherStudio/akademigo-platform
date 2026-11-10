import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Flame, Share2, ArrowUp, Zap, Sparkles, CheckCircle2, XCircle, Trophy, RotateCcw, Volume2, Timer } from 'lucide-react';
import { sound } from '../utils/audio';
import { speakText, stopSpeech } from '../utils/speech';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';
import { KnowzaAvatar } from './KnowzaAvatar';

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

const REEL_QUESTIONS: ReelQuestion[] = [
  {
    id: 'rq-1',
    category: 'TYT Matematik',
    categoryColor: 'bg-emerald-500',
    badge: 'ÖSYM Banko ⚡',
    prompt: 'a ve b pozitif tam sayılardır. (3a + 5b) tek sayı ise a × b çarpımı hakkında hangisi KESİNLİKLE doğrudur?',
    options: [
      'Daima ÇİFT sayıdır',
      'Daima TEK sayıdır',
      'a daima çifttir',
      'b daima tektir'
    ],
    correctIndex: 0,
    explanation: '3a ve 5b sayılarından biri tek, biri çifttir. Dolayısıyla en az biri çift olduğu için çarpımları kesinlikle ÇİFT olur!',
    knowzaTip: 'Toplama tek ise biri Tek, diğeri Çift olmak zorundadır! Çarpımda bir çift varsa sonuç daima çifttir! 🍯✨'
  },
  {
    id: 'rq-2',
    category: 'KPSS Güncel Bilgi',
    categoryColor: 'bg-amber-500',
    badge: '2026 Sınav Sorusu 🚀',
    prompt: 'Türkiye\'nin ilk astronotu olarak Uluslararası Uzay İstasyonu\'nda (ISS) 13 deney yapan astronotumuz kimdir?',
    options: [
      'Alper Gezeravcı',
      'Tuva Cihangir Atasever',
      'Aziz Sancar',
      'Selçuk Bayraktar'
    ],
    correctIndex: 0,
    explanation: 'Alper Gezeravcı, Ocak 2024\'te Ax-3 misyonuyla uzaya çıkan ilk Türk astronottur.',
    knowzaTip: 'Ocak 2024 Ax-3 misyonunu asla unutma, KPSS\'de kesin çıkar! 🛰️'
  },
  {
    id: 'rq-3',
    category: 'Kodlama / Python',
    categoryColor: 'bg-purple-500',
    badge: 'Yazılım Mülakatı 💻',
    prompt: 'Python\'da [1, 2, 2, 3, 4, 4] listesindeki tüm tekrarları tek satırda silip benzersiz yapmak için hangisi kullanılır?',
    options: [
      'list(set(liste))',
      'liste.unique()',
      'liste.clean()',
      'set.filter(liste)'
    ],
    correctIndex: 0,
    explanation: 'set() veri yapısı küme mantığıyla tüm tekrarlayan elemanları anında eler.',
    knowzaTip: 'Python mülakatlarının 1 numaralı hilesi set() dönüşümüdür! 🐱'
  },
  {
    id: 'rq-4',
    category: 'TYT Geometri',
    categoryColor: 'bg-yellow-500',
    badge: '10 Saniyelik Pratik 📐',
    prompt: 'Dik kenar uzunlukları 9 cm ve 12 cm olan dik üçgenin hipotenüs uzunluğu kaç cm\'dir?',
    options: [
      '15 cm',
      '18 cm',
      '20 cm',
      '14 cm'
    ],
    correctIndex: 0,
    explanation: '3-4-5 üçgeninin 3 katı: 9 - 12 - 15 özel dik üçgenidir!',
    knowzaTip: 'Pisagor formülüyle vakit kaybetme! 3-4-5\'in 3 katını hemen gör ve 15\'i işaretle! ⚡📐'
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
      'İptal etmek (Call off)'
    ],
    correctIndex: 0,
    explanation: '"Carry out" bir planı, deneyi veya reformu yürütmek/uygulamak demektir.',
    knowzaTip: 'YDS ve YÖKDİL\'in en sevdiği phrasal verb: Carry out = Execute / Perform! 🎯'
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
      'Nükleotid < DNA < Gen < Kromozom'
    ],
    correctIndex: 0,
    explanation: 'Büyükten küçüğe KeDiGeNi kodlaması kullanılır. Küçükten büyüğe ise Nükleotid < Gen < DNA < Kromozom şeklindedir.',
    knowzaTip: 'Ke-Di-Ge-Ni taktiğini aklında tut: Kromozom > DNA > Gen > Nükleotid! 🧬✨'
  },
  {
    id: 'rq-7',
    category: 'TYT Türkçe',
    categoryColor: 'bg-blue-600',
    badge: 'Yazım Kuralı Tuzak 📝',
    prompt: 'Aşağıdaki sözcüklerden hangisinin yazımı TDK kurallarına göre DOĞRUDUR?',
    options: [
      'Her şey',
      'Herşey',
      'Hiç bir',
      'Pekaz'
    ],
    correctIndex: 0,
    explanation: '"Şey" sözcüğü her zaman kendinden önceki sözcükten ayrı yazılır: "Her şey", "Bir şey".',
    knowzaTip: 'Şey sözcüğü o kadar yalnızdır ki kimseyle birleşmez, hep ayrı yazılır! 🍯'
  }
];

export const ReelsQuestions: React.FC = () => {
  const { completeLesson, loseHeart } = useGame();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [combo, setCombo] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [totalXpEarned, setTotalXpEarned] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [copiedShare, setCopiedShare] = useState(false);

  const currentQ = REEL_QUESTIONS[currentIndex % REEL_QUESTIONS.length];

  // 15-second countdown timer for Reels adrenaline
  useEffect(() => {
    let timer: any = null;
    if (!isAnswered && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (!isAnswered && timeLeft === 0) {
      // Time out!
      handleSelectOption(-1);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isAnswered, timeLeft]);

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
    setIsAnswered(true);

    const isCorrect = index === currentQ.correctIndex;

    if (isCorrect) {
      sound.playCorrect();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 }
      });
      const newCombo = combo + 1;
      setCombo(newCombo);
      if (newCombo > bestCombo) setBestCombo(newCombo);
      const earned = 15 + newCombo * 5;
      setTotalXpEarned(x => x + earned);
    } else {
      sound.playWrong();
      setCombo(0);
      loseHeart();
    }
  };

  const handleNextQuestion = () => {
    sound.playClick();
    setSelectedOption(null);
    setIsAnswered(false);
    setTimeLeft(15);
    setCurrentIndex(i => i + 1);
  };

  const handleShare = () => {
    sound.playClick();
    const shareText = `🔥 Knowza Soru Kaydır'da ${combo > 0 ? combo : 5} soru üst üste doğru yaptım! 🍯✨\n"${currentQ.prompt.slice(0, 70)}..."\nSen bu soruyu 10 saniyede çözebilir misin? Meydan okuyorum!\n🚀 Hemen oyna: ${window.location.origin}`;
    
    if (navigator.share) {
      navigator.share({
        title: 'Knowza - Soru Meydan Okuması',
        text: shareText,
        url: window.location.origin
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(shareText);
      setCopiedShare(true);
      setTimeout(() => setCopiedShare(false), 2500);
    }
  };

  const isCorrectAnswer = selectedOption === currentQ.correctIndex;

  return (
    <div className="flex-1 max-w-xl mx-auto py-3 px-2 sm:px-4 flex flex-col justify-center min-h-[calc(100vh-120px)] w-full select-none">
      
      {/* Top Floating Reel Stats Bar */}
      <div className="flex items-center justify-between bg-white dark:bg-[#1a2c35] border-2 border-gray-200 dark:border-[#2b3d45] rounded-2xl p-3 mb-3 shadow-md">
        
        {/* Combo Fire Indicator */}
        <div className="flex items-center gap-1.5">
          <div className={`p-1.5 rounded-xl ${combo > 1 ? 'bg-orange-500 text-white animate-bounceSubtle' : 'bg-gray-100 dark:bg-gray-800 text-gray-500'}`}>
            <Flame className="w-5 h-5 fill-current" />
          </div>
          <div>
            <div className="text-xs font-black text-gray-800 dark:text-gray-100 flex items-center gap-1">
              <span>{combo}x KOMBO</span>
              {combo >= 3 && <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">ATEŞ!</span>}
            </div>
            <div className="text-[10px] text-gray-400 font-bold">En iyi: {bestCombo}</div>
          </div>
        </div>

        {/* Timer Bar & Countdown */}
        <div className="flex items-center gap-2">
          <div className={`flex items-center gap-1 font-black text-xs px-2.5 py-1 rounded-xl ${
            timeLeft <= 5 ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400'
          }`}>
            <Timer className="w-4 h-4" />
            <span>{timeLeft}s</span>
          </div>
        </div>

        {/* Total Earned XP */}
        <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 px-3 py-1 rounded-xl">
          <Zap className="w-4 h-4 fill-amber-400 text-amber-500" />
          <span className="text-xs font-black text-amber-600 dark:text-amber-400">+{totalXpEarned} XP</span>
        </div>

      </div>

      {/* Main TikTok-Style Question Card */}
      <div className="relative bg-white dark:bg-[#1a2c35] border-4 border-gray-200 dark:border-[#2b3d45] rounded-3xl p-5 sm:p-7 shadow-2xl flex flex-col justify-between overflow-hidden transition-all duration-300">
        
        {/* Category & Badge Header */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-4">
            <span className={`${currentQ.categoryColor} text-white font-black text-[11px] sm:text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-sm`}>
              {currentQ.category}
            </span>
            <span className="text-xs font-black text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2.5 py-1 rounded-xl border border-gray-200 dark:border-gray-700">
              {currentQ.badge}
            </span>
          </div>

          {/* Question Prompt with Audio Button */}
          <div className="flex items-start justify-between gap-2.5 mb-5 min-h-[60px]">
            <h2 className="text-base sm:text-lg font-black text-gray-800 dark:text-gray-100 leading-snug tracking-tight flex-1">
              {currentQ.prompt}
            </h2>
            <button
              onClick={() => {
                sound.playClick();
                speakText(currentQ.prompt, currentQ.category.includes('İngilizce') ? 'en-US' : 'tr-TR');
              }}
              className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 border border-blue-200 dark:border-blue-800 transition-all active:scale-90 flex-shrink-0"
              title="Soruyu Sesli Oku"
            >
              <Volume2 className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Options Grid */}
          <div className="space-y-2.5">
            {currentQ.options.map((optText, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrect = idx === currentQ.correctIndex;

              let btnStyle = 'border-gray-200 dark:border-[#2b3d45] hover:border-blue-400 bg-white dark:bg-[#202f36] text-gray-800 dark:text-gray-100';

              if (isAnswered) {
                if (isCorrect) {
                  btnStyle = 'border-green-500 bg-green-500 text-white shadow-lg ring-4 ring-green-300 animate-pop';
                } else if (isSelected && !isCorrect) {
                  btnStyle = 'border-red-500 bg-red-500 text-white shadow-lg';
                } else {
                  btnStyle = 'border-gray-200 dark:border-gray-800 opacity-40 bg-gray-50 dark:bg-gray-800';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full p-3.5 sm:p-4 rounded-2xl border-2 font-black text-xs sm:text-sm text-left flex items-center justify-between transition-all duration-200 active:scale-[0.98] ${btnStyle}`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-black flex-shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{optText}</span>
                  </div>

                  {isAnswered && isCorrect && <CheckCircle2 className="w-5 h-5 flex-shrink-0 animate-wiggle" />}
                  {isAnswered && isSelected && !isCorrect && <XCircle className="w-5 h-5 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Feedback & Knowza Bear Tactical Advice */}
        {isAnswered && (
          <div className="mt-5 space-y-3 animate-pop">
            
            {/* Mascot Tactical Tip Box */}
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-2xl p-3.5 flex items-start gap-3">
              <KnowzaAvatar size="md" animate={true} />
              <div className="flex-1">
                <div className="text-xs font-black text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <span>Knowza 3D Maskot Taktik Notu</span>
                  {isCorrectAnswer ? (
                    <span className="text-[10px] bg-green-500 text-white px-2 py-0.2 rounded-full font-black">HARİKASIN! +15 XP</span>
                  ) : (
                    <span className="text-[10px] bg-red-500 text-white px-2 py-0.2 rounded-full font-black">CAN GİTTİ! 💔</span>
                  )}
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-300 font-semibold mt-1 leading-snug">
                  {currentQ.knowzaTip}
                </p>
                <div className="text-[11px] text-gray-600 dark:text-gray-400 mt-1.5 pt-1.5 border-t border-amber-200 dark:border-amber-800">
                  <span className="font-bold">Açıklama:</span> {currentQ.explanation}
                </div>
              </div>
            </div>

            {/* Action Buttons: Next Question & Share Challenge */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleNextQuestion}
                className="flex-1 bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-3.5 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg text-sm"
              >
                <span>SONRAKİ SORU</span>
                <ArrowUp className="w-4 h-4 stroke-[3]" />
              </button>

              <button
                onClick={handleShare}
                className="bg-blue-500 hover:bg-blue-600 text-white font-black px-4 py-3.5 rounded-2xl border-b-4 border-blue-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-1.5 shadow-md"
                title="Arkadaşına WhatsApp veya Hikayede Meydan Oku"
              >
                <Share2 className="w-4 h-4" />
                <span className="text-xs hidden sm:inline">{copiedShare ? 'Kopyalandı! ✅' : 'Meydan Oku'}</span>
              </button>
            </div>

          </div>
        )}

      </div>

      {/* Bottom Swipe Up Helper Hint */}
      <div className="mt-3 text-center">
        <span className="text-[11px] font-black uppercase text-gray-400 dark:text-gray-500 tracking-wider flex items-center justify-center gap-1">
          <span>⚡ 15 Saniyede Hızlı Çöz, Kombonu Katla!</span>
        </span>
      </div>

    </div>
  );
};