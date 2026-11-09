import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Gamepad2, Sparkles, Trophy, Flame, RotateCcw, Play, CheckCircle2, XCircle, Timer, Zap, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';

type ActiveGame = 'hub' | 'balloon' | 'memory' | 'chrono';

interface BalloonItem {
  id: number;
  value: number;
  isCorrect: boolean;
  color: string;
  x: number;
  y: number;
}

interface MemoryCard {
  id: number;
  pairId: number;
  content: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const BALLOON_QUESTIONS = [
  { q: "8 × 9 = ?", ans: 72, dist: [64, 81, 74, 68] },
  { q: "√144 = ?", ans: 12, dist: [14, 11, 16, 18] },
  { q: "2⁴ (2 üzeri 4) = ?", ans: 16, dist: [8, 12, 32, 64] },
  { q: "15 + 27 = ?", ans: 42, dist: [44, 38, 52, 41] },
  { q: "5! / 4! = ?", ans: 5, dist: [20, 1, 24, 120] },
  { q: "3³ - 7 = ?", ans: 20, dist: [23, 27, 19, 14] },
  { q: "√81 + √49 = ?", ans: 16, dist: [14, 18, 15, 20] },
  { q: "En küçük asal sayı = ?", ans: 2, dist: [1, 0, 3, 5] },
  { q: "6 × 7 = ?", ans: 42, dist: [48, 36, 49, 45] },
  { q: "100 ÷ 4 = ?", ans: 25, dist: [20, 24, 30, 15] }
];

const MEMORY_PAIRS = [
  { pairId: 1, a: "Amasya Genelgesi", b: "Milli Mücadelenin Amacı & Yolu" },
  { pairId: 2, a: "Erzurum Kongresi", b: "Manda & Himaye İlk Kez Reddi" },
  { pairId: 3, a: "Sivas Kongresi", b: "Tüm Cemiyetlerin Birleşmesi" },
  { pairId: 4, a: "Python len()", b: "Eleman Sayısını Verir" },
  { pairId: 5, a: "DNA", b: "Genetik Bilgi Bankası" },
  { pairId: 6, a: "EBOB", b: "Bütünden Parçaya Bölme" },
];

const CHRONO_QUESTIONS = [
  {
    topic: "Kurtuluş Savaşı Hazırlık Dönemi",
    correctOrder: [
      "Havza Genelgesi (İlk Miting)",
      "Amasya Genelgesi (Kurtuluş Beyanı)",
      "Erzurum Kongresi (Bölgesel Toplantı)",
      "TBMM'nin Açılışı (23 Nisan 1920)"
    ]
  },
  {
    topic: "Bir Yazılım Algoritmasının Yaşam Döngüsü",
    correctOrder: [
      "1. Problemi Anlama & Analiz",
      "2. Akış Şeması (Flowchart) Tasarımı",
      "3. Kodlama & Fonksiyon Geliştirme",
      "4. Test Etme & Hata Ayıklama (Debug)"
    ]
  }
];

export const ArcadeGames: React.FC = () => {
  const { stats, completeLesson } = useGame();
  const [activeGame, setActiveGame] = useState<ActiveGame>('hub');

  // Balloon Game State
  const [balloonScore, setBalloonScore] = useState(0);
  const [balloonCombo, setBalloonCombo] = useState(0);
  const [balloonTimeLeft, setBalloonTimeLeft] = useState(30);
  const [balloonPlaying, setBalloonPlaying] = useState(false);
  const [currentBalloonQIndex, setCurrentBalloonQIndex] = useState(0);
  const [balloons, setBalloons] = useState<BalloonItem[]>([]);

  // Memory Game State
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<number[]>([]);
  const [matchedCount, setMatchedCount] = useState(0);
  const [memoryMoves, setMemoryMoves] = useState(0);

  // Chrono Game State
  const [chronoIndex, setChronoIndex] = useState(0);
  const [userChronoList, setUserChronoList] = useState<string[]>([]);
  const [chronoStatus, setChronoStatus] = useState<'idle' | 'correct' | 'wrong'>('idle');

  // Balloon Timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (balloonPlaying && balloonTimeLeft > 0) {
      timer = setInterval(() => {
        setBalloonTimeLeft(t => t - 1);
      }, 1000);
    } else if (balloonPlaying && balloonTimeLeft === 0) {
      setBalloonPlaying(false);
      sound.playVictory();
      confetti({ particleCount: 70, spread: 60 });
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [balloonPlaying, balloonTimeLeft]);

  // Start Balloon Game
  const startBalloonGame = () => {
    sound.playClick();
    setBalloonScore(0);
    setBalloonCombo(0);
    setBalloonTimeLeft(30);
    setCurrentBalloonQIndex(0);
    setBalloonPlaying(true);
    generateBalloons(0);
  };

  const generateBalloons = (qIdx: number) => {
    const q = BALLOON_QUESTIONS[qIdx % BALLOON_QUESTIONS.length];
    const colors = ['#58cc02', '#1cb0f6', '#af72ff', '#ff9600', '#ff4b4b'];
    const candidates = [
      { val: q.ans, isCorrect: true },
      ...q.dist.slice(0, 3).map(d => ({ val: d, isCorrect: false }))
    ].sort(() => Math.random() - 0.5);

    const newBalloons: BalloonItem[] = candidates.map((c, i) => ({
      id: Date.now() + i,
      value: c.val,
      isCorrect: c.isCorrect,
      color: colors[i % colors.length],
      x: 15 + i * 20,
      y: 20 + (i % 2) * 25
    }));

    setBalloons(newBalloons);
  };

  const handlePopBalloon = (b: BalloonItem) => {
    if (!balloonPlaying) return;

    if (b.isCorrect) {
      sound.playCorrect();
      setBalloonScore(s => s + 10 + balloonCombo * 5);
      setBalloonCombo(c => c + 1);

      // Next question
      const nextIdx = (currentBalloonQIndex + 1) % BALLOON_QUESTIONS.length;
      setCurrentBalloonQIndex(nextIdx);
      generateBalloons(nextIdx);
    } else {
      sound.playWrong();
      setBalloonCombo(0);
      setBalloonScore(s => Math.max(0, s - 5));
    }
  };

  // Start Memory Game
  const startMemoryGame = () => {
    sound.playClick();
    const shuffled: MemoryCard[] = [];
    MEMORY_PAIRS.forEach((pair) => {
      shuffled.push({ id: Math.random(), pairId: pair.pairId, content: pair.a, isFlipped: false, isMatched: false });
      shuffled.push({ id: Math.random(), pairId: pair.pairId, content: pair.b, isFlipped: false, isMatched: false });
    });
    shuffled.sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setSelectedCards([]);
    setMatchedCount(0);
    setMemoryMoves(0);
  };

  const handleCardClick = (index: number) => {
    if (cards[index].isFlipped || cards[index].isMatched || selectedCards.length === 2) return;
    sound.playClick();

    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);

    const newSelected = [...selectedCards, index];
    setSelectedCards(newSelected);

    if (newSelected.length === 2) {
      setMemoryMoves(m => m + 1);
      const [firstIdx, secondIdx] = newSelected;
      if (newCards[firstIdx].pairId === newCards[secondIdx].pairId) {
        // Matched!
        sound.playCorrect();
        newCards[firstIdx].isMatched = true;
        newCards[secondIdx].isMatched = true;
        setCards(newCards);
        setSelectedCards([]);
        setMatchedCount(c => {
          const next = c + 1;
          if (next === MEMORY_PAIRS.length) {
            sound.playVictory();
            confetti({ particleCount: 80, spread: 70 });
          }
          return next;
        });
      } else {
        // Not matched, flip back
        sound.playWrong();
        setTimeout(() => {
          newCards[firstIdx].isFlipped = false;
          newCards[secondIdx].isFlipped = false;
          setCards(newCards);
          setSelectedCards([]);
        }, 900);
      }
    }
  };

  // Start Chrono Game
  const startChronoGame = () => {
    sound.playClick();
    setChronoIndex(0);
    setChronoStatus('idle');
    const q = CHRONO_QUESTIONS[0];
    setUserChronoList([...q.correctOrder].sort(() => Math.random() - 0.5));
  };

  const moveChronoItem = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= userChronoList.length) return;
    sound.playClick();
    const updated = [...userChronoList];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setUserChronoList(updated);
    setChronoStatus('idle');
  };

  const checkChrono = () => {
    const q = CHRONO_QUESTIONS[chronoIndex];
    const isCorrect = userChronoList.every((val, i) => val === q.correctOrder[i]);
    if (isCorrect) {
      sound.playVictory();
      setChronoStatus('correct');
      confetti({ particleCount: 60, spread: 60 });
    } else {
      sound.playWrong();
      setChronoStatus('wrong');
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 space-y-6 pb-24 select-none">
      
      {/* Arcade Header Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-pink-500 to-purple-600 rounded-3xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Morpa Kampüs & Oyunlaştırma Alanı
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Eğitici Mini Oyunlar</h2>
            <p className="text-white/90 text-sm font-semibold mt-1">
              Oyun oynarken reflekslerini geliştir, formülleri ve kavramları kalıcı öğren!
            </p>
          </div>
          <div className="text-5xl animate-bounceSubtle">🎮</div>
        </div>

        {/* Back button if in a game */}
        {activeGame !== 'hub' && (
          <button
            onClick={() => {
              sound.playClick();
              setActiveGame('hub');
              setBalloonPlaying(false);
            }}
            className="mt-4 bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs px-4 py-2 rounded-xl transition-all"
          >
            ← Oyun Menüsüne Dön
          </button>
        )}
      </div>

      {/* 1. Games Hub Navigation */}
      {activeGame === 'hub' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 animate-pop">
          
          {/* Game 1: Balloon Pop */}
          <div className="bg-white rounded-3xl p-5 border-2 border-gray-200 shadow-sm hover:border-green-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-green-100 text-green-600 flex items-center justify-center text-3xl mb-3">
                🎈
              </div>
              <h3 className="font-black text-lg text-gray-800">Sayı & Balon Avcısı</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                60 saniyede matematik sorularının doğru balonlarını yakala, kombo yap ve yüksek skor kır!
              </p>
            </div>
            <button
              onClick={() => {
                setActiveGame('balloon');
                startBalloonGame();
              }}
              className="mt-5 w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-xs py-3 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all"
            >
              OYNA
            </button>
          </div>

          {/* Game 2: Memory Cards */}
          <div className="bg-white rounded-3xl p-5 border-2 border-gray-200 shadow-sm hover:border-blue-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center text-3xl mb-3">
                🧠
              </div>
              <h3 className="font-black text-lg text-gray-800">Kavram Hafıza Kartları</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                Tarih, Biyoloji ve Kodlama kavramlarını eşleştir. Zihnini ve görsel hafızanı güçlendir!
              </p>
            </div>
            <button
              onClick={() => {
                setActiveGame('memory');
                startMemoryGame();
              }}
              className="mt-5 w-full bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-xs py-3 rounded-2xl border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 transition-all"
            >
              OYNA
            </button>
          </div>

          {/* Game 3: Chrono Rush */}
          <div className="bg-white rounded-3xl p-5 border-2 border-gray-200 shadow-sm hover:border-purple-400 hover:shadow-md transition-all flex flex-col justify-between">
            <div>
              <div className="w-14 h-14 rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center text-3xl mb-3">
                ⏳
              </div>
              <h3 className="font-black text-lg text-gray-800">Kronoloji & Mantık Koşusu</h3>
              <p className="text-xs text-gray-500 font-semibold mt-1 leading-relaxed">
                Tarihi olayları veya kodlama algoritmalarını doğru sıralamaya dizerek şampiyon ol!
              </p>
            </div>
            <button
              onClick={() => {
                setActiveGame('chrono');
                startChronoGame();
              }}
              className="mt-5 w-full bg-[#af72ff] hover:bg-[#9047ff] text-white font-black text-xs py-3 rounded-2xl border-b-4 border-[#9047ff] active:border-b-0 active:translate-y-1 transition-all"
            >
              OYNA
            </button>
          </div>

        </div>
      )}

      {/* 2. Balloon Pop Game View */}
      {activeGame === 'balloon' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-6 animate-pop">
          {/* Game Status Bar */}
          <div className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border-2 border-gray-200">
            <div className="flex items-center gap-2">
              <Timer className="w-5 h-5 text-red-500" />
              <span className="font-black text-lg text-gray-800">{balloonTimeLeft}s</span>
            </div>
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-black text-sm text-orange-600">Kombo: {balloonCombo}x</span>
            </div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span className="font-black text-lg text-amber-600">{balloonScore} Puan</span>
            </div>
          </div>

          {/* Balloon Question Display */}
          {balloonPlaying ? (
            <div className="text-center space-y-6">
              <div className="inline-block bg-indigo-50 border-2 border-indigo-200 px-6 py-3 rounded-2xl text-2xl font-black text-indigo-900">
                {BALLOON_QUESTIONS[currentBalloonQIndex].q}
              </div>

              {/* Floating Balloon Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto py-4">
                {balloons.map((b) => (
                  <button
                    key={b.id}
                    onClick={() => handlePopBalloon(b)}
                    className="w-24 h-32 rounded-full mx-auto flex flex-col items-center justify-center font-black text-xl text-white shadow-lg transition-transform transform hover:scale-110 active:scale-95 animate-bounceSubtle relative"
                    style={{ backgroundColor: b.color }}
                  >
                    <span>{b.value}</span>
                    {/* Balloon knot & string */}
                    <div className="absolute -bottom-2 w-2 h-2 rounded-full bg-black/30" />
                    <div className="absolute -bottom-5 w-0.5 h-4 bg-gray-400" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-8 space-y-4">
              <div className="text-6xl">🎉</div>
              <h3 className="text-2xl font-black text-gray-800">Süre Doldu!</h3>
              <p className="text-sm font-bold text-gray-600">
                Toplam Skorun: <span className="text-[#58cc02] font-black text-lg">{balloonScore}</span>
              </p>
              <button
                onClick={startBalloonGame}
                className="bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-3 px-6 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all"
              >
                TEKRAR OYNA
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. Memory Cards Game View */}
      {activeGame === 'memory' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-6 animate-pop">
          <div className="flex items-center justify-between">
            <h3 className="font-black text-lg text-gray-800">Eşleşen: {matchedCount} / {MEMORY_PAIRS.length}</h3>
            <span className="text-xs font-bold text-gray-500">Hamle: {memoryMoves}</span>
            <button
              onClick={startMemoryGame}
              className="text-xs font-bold text-gray-600 hover:text-gray-900 bg-gray-100 px-3 py-1.5 rounded-xl"
            >
              Yeniden Dağıt
            </button>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {cards.map((card, idx) => (
              <button
                key={idx}
                disabled={card.isMatched || card.isFlipped}
                onClick={() => handleCardClick(idx)}
                className={`h-24 sm:h-28 rounded-2xl p-2 font-black text-xs sm:text-sm flex items-center justify-center text-center transition-all border-2 ${
                  card.isMatched
                    ? 'bg-green-100 border-green-400 text-green-800 opacity-80'
                    : card.isFlipped
                    ? 'bg-blue-50 border-[#1cb0f6] text-[#1cb0f6] shadow-md'
                    : 'bg-gray-100 border-gray-300 text-gray-400 hover:bg-gray-200'
                }`}
              >
                {card.isFlipped || card.isMatched ? card.content : '❓'}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 4. Chrono Rush Game View */}
      {activeGame === 'chrono' && (
        <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-6 animate-pop">
          <div>
            <span className="text-xs font-black uppercase text-purple-600">Sıralama Görevi</span>
            <h3 className="text-xl font-black text-gray-800 mt-0.5">
              {CHRONO_QUESTIONS[chronoIndex].topic}
            </h3>
            <p className="text-xs text-gray-500 font-semibold mt-1">
              Maddeleri yukarı/aşağı oklarıyla doğru kronolojik veya mantıksal sıraya koy:
            </p>
          </div>

          <div className="space-y-2">
            {userChronoList.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-gray-50 border-2 border-gray-200 rounded-2xl font-bold text-sm text-gray-800"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-purple-100 text-purple-700 font-black text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span>{item}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveChronoItem(idx, idx - 1)}
                    className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-30 text-xs font-black"
                  >
                    ▲
                  </button>
                  <button
                    disabled={idx === userChronoList.length - 1}
                    onClick={() => moveChronoItem(idx, idx + 1)}
                    className="p-1.5 rounded-lg bg-gray-200 hover:bg-gray-300 disabled:opacity-30 text-xs font-black"
                  >
                    ▼
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          {chronoStatus === 'correct' && (
            <div className="p-3 bg-green-50 border-2 border-green-200 text-green-800 rounded-2xl text-xs font-black text-center animate-pop">
              🎉 Harika! Sıralama tamamen doğru!
            </div>
          )}
          {chronoStatus === 'wrong' && (
            <div className="p-3 bg-red-50 border-2 border-red-200 text-red-800 rounded-2xl text-xs font-black text-center animate-pop">
              ❌ Sıralamada bir hata var, adımları tekrar gözden geçir!
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={checkChrono}
              className="flex-1 bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-3 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all text-xs uppercase tracking-wider"
            >
              SIRALAMAYI KONTROL ET
            </button>
            <button
              onClick={() => {
                setChronoIndex(i => (i + 1) % CHRONO_QUESTIONS.length);
                const nextQ = CHRONO_QUESTIONS[(chronoIndex + 1) % CHRONO_QUESTIONS.length];
                setUserChronoList([...nextQ.correctOrder].sort(() => Math.random() - 0.5));
                setChronoStatus('idle');
              }}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-black px-4 py-3 rounded-2xl text-xs"
            >
              Sonraki Soru
            </button>
          </div>
        </div>
      )}

      {/* Floating Mascot Interaction */}
      <div className="flex items-center justify-center pt-4">
        <Mascot
          size="md"
          mood={activeGame === 'balloon' && balloonPlaying ? 'excited' : 'happy'}
          speech="Oyun oynarken reflekslerin ve kavram hafızan harika gelişiyor! 🎯"
        />
      </div>

    </div>
  );
};
