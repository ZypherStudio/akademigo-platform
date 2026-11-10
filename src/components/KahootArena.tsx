import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { KAHOOT_QUIZ_SETS, MOCK_BOT_PLAYERS, KahootQuizSet } from '../data/kahootData';
import { KahootQuestion, KahootPlayer, KahootCategory } from '../types';
import { KnowzaAvatar } from './KnowzaAvatar';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Trophy, Users, Play, Copy, Check, RotateCcw, Sparkles, 
  Flame, Timer, Shield, Award, HelpCircle, ArrowRight, Share2 
} from 'lucide-react';

type ArenaPhase = 'lobby' | 'question' | 'round_result' | 'podium';

export const KahootArena: React.FC = () => {
  const { stats, updateUsername, addXpAndGems } = useGame();

  // Arena setup
  const [activeTab, setActiveTab] = useState<'join' | 'host'>('join');
  const [selectedSetId, setSelectedSetId] = useState<KahootCategory>('matematik');
  const [roomPin, setRoomPin] = useState('582 910');
  const [inputPin, setInputPin] = useState('582 910');
  const [nicknameInput, setNicknameInput] = useState(stats.username || 'Ali');
  const [pinCopied, setPinCopied] = useState(false);
  const [nameWarning, setNameWarning] = useState<string | null>(null);

  // Game state
  const [phase, setPhase] = useState<ArenaPhase>('lobby');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number | null>(null);
  const [isAnswerLocked, setIsAnswerLocked] = useState(false);
  const [comboStreak, setComboStreak] = useState(0);

  // Players
  const [players, setPlayers] = useState<KahootPlayer[]>([]);

  const timerRef = useRef<any>(null);

  const currentQuizSet: KahootQuizSet = 
    KAHOOT_QUIZ_SETS.find(s => s.id === selectedSetId) || KAHOOT_QUIZ_SETS[0];
  const currentQuestion: KahootQuestion = currentQuizSet.questions[currentQIndex] || currentQuizSet.questions[0];

  // Initialize Lobby Players
  useEffect(() => {
    const initialBots: KahootPlayer[] = MOCK_BOT_PLAYERS.map((b, idx) => ({
      id: `bot-${idx}`,
      name: b.name,
      costume: b.costume,
      score: 0,
      streak: 0
    }));

    const me: KahootPlayer = {
      id: 'me',
      name: stats.username || 'Ali',
      costume: stats.selectedCostume || 'classic',
      score: 0,
      streak: 0,
      isCurrentUser: true
    };

    setPlayers([me, ...initialBots]);
  }, [stats.username, stats.selectedCostume]);

  // Question Timer
  useEffect(() => {
    if (phase === 'question') {
      setTimeLeft(15);
      setSelectedOptionIndex(null);
      setIsAnswerLocked(false);

      if (timerRef.current) clearInterval(timerRef.current);

      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            handleTimeUp();
            return 0;
          }
          if (prev <= 5) {
            sound.playTick();
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase, currentQIndex]);

  const handleTimeUp = () => {
    setIsAnswerLocked(true);
    sound.playWrong();
    setComboStreak(0);
    simulateBotAnswers(-1, 0);
    setTimeout(() => {
      setPhase('round_result');
    }, 1200);
  };

  const handleSelectAnswer = (optionIdx: number) => {
    if (isAnswerLocked || phase !== 'question') return;
    setIsAnswerLocked(true);
    setSelectedOptionIndex(optionIdx);

    const isCorrect = optionIdx === currentQuestion.correctIndex;
    let earnedPoints = 0;

    if (isCorrect) {
      sound.playCorrect();
      // Fast answer formula: 500 base + remaining time bonus (up to 1000 pts)
      earnedPoints = Math.round(500 + (timeLeft / 15) * 500);
      setComboStreak(c => c + 1);
    } else {
      sound.playWrong();
      setComboStreak(0);
    }

    simulateBotAnswers(optionIdx, earnedPoints);

    setTimeout(() => {
      setPhase('round_result');
    }, 1000);
  };

  // Simulate real bot competitors answering
  const simulateBotAnswers = (mySelection: number, myEarnedPoints: number) => {
    setPlayers((prev) => {
      return prev.map((p) => {
        if (p.isCurrentUser) {
          const isCorrect = mySelection === currentQuestion.correctIndex;
          return {
            ...p,
            score: p.score + myEarnedPoints,
            streak: isCorrect ? p.streak + 1 : 0,
            lastAnswerCorrect: isCorrect,
            lastAnswerTime: 15 - timeLeft
          };
        }

        // Bot probability of correct answer (75% correct)
        const botCorrect = Math.random() < 0.75;
        const botSeconds = 2 + Math.floor(Math.random() * 8);
        const botPoints = botCorrect ? Math.round(500 + ((15 - botSeconds) / 15) * 500) : 0;

        return {
          ...p,
          score: p.score + botPoints,
          streak: botCorrect ? p.streak + 1 : 0,
          lastAnswerCorrect: botCorrect,
          lastAnswerTime: botSeconds
        };
      }).sort((a, b) => b.score - a.score);
    });
  };

  const handleNextQuestion = () => {
    sound.playClick();
    if (currentQIndex + 1 < currentQuizSet.questions.length) {
      setCurrentQIndex(i => i + 1);
      setPhase('question');
    } else {
      // Grand Finale: Podium!
      setPhase('podium');
      sound.playVictory();
      confetti({ particleCount: 120, spread: 100 });
      // Award XP & Gems based on final score
      addXpAndGems(80, 25);
    }
  };

  const handleStartGame = () => {
    sound.playClick();
    setCurrentQIndex(0);
    setPhase('question');
  };

  const handleResetGame = () => {
    sound.playClick();
    setCurrentQIndex(0);
    setPhase('lobby');
    setPlayers(prev => prev.map(p => ({ ...p, score: 0, streak: 0 })));
  };

  const handleCopyPin = () => {
    sound.playClick();
    navigator.clipboard.writeText(roomPin);
    setPinCopied(true);
    setTimeout(() => setPinCopied(false), 2000);
  };

  const handleJoinWithPin = () => {
    sound.playClick();
    const res = updateUsername(nicknameInput);
    if (!res.success) {
      setNameWarning(res.error || 'Geçersiz isim');
      return;
    }
    if (res.finalUsername !== nicknameInput) {
      setNameWarning(`"${nicknameInput}" ismi doluydu, senin adın "${res.finalUsername}" yapıldı! ✨`);
    } else {
      setNameWarning(null);
    }

    setPlayers(prev => prev.map(p => p.isCurrentUser ? { ...p, name: res.finalUsername } : p));
    setPhase('lobby');
  };

  // Kahoot Shape & Color Button mapping
  const KAHOOT_BUTTONS = [
    { shape: '▲', label: 'Üçgen', bg: 'bg-[#e21b3c] hover:bg-[#c91835] border-[#b0132c]', text: 'text-white' },
    { shape: '◆', label: 'Eşkenar', bg: 'bg-[#1368ce] hover:bg-[#105bb5] border-[#0c4488]', text: 'text-white' },
    { shape: '●', label: 'Daire', bg: 'bg-[#d89e00] hover:bg-[#b88600] border-[#996f00]', text: 'text-white' },
    { shape: '■', label: 'Kare', bg: 'bg-[#26890c] hover:bg-[#1f7309] border-[#165506]', text: 'text-white' }
  ];

  return (
    <div className="flex-1 max-w-4xl mx-auto py-4 sm:py-6 px-3 sm:px-4 space-y-6 pb-24 select-none">
      
      {/* ================= 1. LOBBY PHASE ================= */}
      {phase === 'lobby' && (
        <div className="space-y-6 animate-pop">
          
          {/* Main Hero Card */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-700 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-3">
              <Sparkles className="w-4 h-4 text-amber-300" />
              CANLI ÇOK OYUNCULU TEST ARENASI
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Kahoot<span className="text-amber-300">GO</span> Yarışması 🏆
            </h1>
            <p className="text-white/80 text-xs sm:text-sm font-semibold max-w-lg mx-auto mt-1">
              Herkes aynı anda yarışır, soruları 15 saniyede en hızlı cevaplayan podyumun 1. basamağına tırmanır!
            </p>

            {/* Giant Room PIN Badge */}
            <div className="mt-6 inline-flex flex-col sm:flex-row items-center gap-3 bg-black/30 backdrop-blur-md p-3 sm:px-6 rounded-2xl border border-white/20">
              <span className="text-xs font-black uppercase text-amber-300 tracking-wider">OYUN ODA PIN KODU:</span>
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-white drop-shadow">
                {roomPin}
              </span>
              <button
                onClick={handleCopyPin}
                className="bg-white/20 hover:bg-white/30 text-white font-extrabold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all active:scale-95"
              >
                {pinCopied ? <Check className="w-4 h-4 text-green-300" /> : <Copy className="w-4 h-4" />}
                <span>{pinCopied ? 'Kopyalandı!' : 'PIN Kopyala'}</span>
              </button>
            </div>
          </div>

          {/* Mode Switcher: Katıl vs Oda Kur */}
          <div className="flex bg-gray-100 dark:bg-[#1a2c35] p-1.5 rounded-2xl border-2 border-gray-200 dark:border-[#2b3d45]">
            <button
              onClick={() => setActiveTab('join')}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'join'
                  ? 'bg-white dark:bg-[#202f36] text-[#1cb0f6] shadow-md'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>PIN ile Katıl (Oyuncu)</span>
            </button>
            <button
              onClick={() => setActiveTab('host')}
              className={`flex-1 py-2.5 rounded-xl font-black text-xs sm:text-sm transition-all flex items-center justify-center gap-2 ${
                activeTab === 'host'
                  ? 'bg-white dark:bg-[#202f36] text-[#1cb0f6] shadow-md'
                  : 'text-gray-500 hover:text-gray-800 dark:hover:text-gray-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Konu Seç & Oda Kur (Sunucu)</span>
            </button>
          </div>

          {/* Join / Name Configuration Card */}
          {activeTab === 'join' ? (
            <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
              <h3 className="text-base font-black text-gray-800 dark:text-gray-100">
                Yarışmacı Bilgilerin
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black text-gray-600 dark:text-gray-300 block mb-1">
                    Takma Adın (Kullanıcı Adı)
                  </label>
                  <input
                    type="text"
                    value={nicknameInput}
                    onChange={(e) => setNicknameInput(e.target.value)}
                    placeholder="Örn: Ali"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#202f36] border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-[#1cb0f6]"
                  />
                  {nameWarning && (
                    <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 mt-1">
                      {nameWarning}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-black text-gray-600 dark:text-gray-300 block mb-1">
                    Oda PIN Kodu
                  </label>
                  <input
                    type="text"
                    value={inputPin}
                    onChange={(e) => setInputPin(e.target.value)}
                    placeholder="582 910"
                    className="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#202f36] border-2 border-gray-200 dark:border-gray-700 rounded-2xl text-sm font-mono font-bold text-gray-800 dark:text-gray-100 outline-none focus:border-[#1cb0f6]"
                  />
                </div>
              </div>

              <button
                onClick={handleJoinWithPin}
                className="w-full py-3 bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold text-sm rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Odaya Bağlan ve Lobiye Katıl</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            /* Host Quiz Set Selection */
            <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
              <h3 className="text-base font-black text-gray-800 dark:text-gray-100">
                Yarışma Konusunu Seç
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {KAHOOT_QUIZ_SETS.map((quiz) => {
                  const isSelected = selectedSetId === quiz.id;
                  return (
                    <button
                      key={quiz.id}
                      onClick={() => {
                        sound.playClick();
                        setSelectedSetId(quiz.id);
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? 'border-[#1cb0f6] bg-blue-50 dark:bg-blue-950/40 shadow-md ring-2 ring-blue-300 dark:ring-blue-700'
                          : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 bg-white dark:bg-[#202f36]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{quiz.icon}</span>
                        <div>
                          <div className="font-black text-xs sm:text-sm text-gray-800 dark:text-gray-100">
                            {quiz.title}
                          </div>
                          <div className="text-[11px] text-gray-500 dark:text-gray-400 font-semibold mt-0.5">
                            {quiz.questions.length} Soru • 15 Sn / Soru
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Live Lobby Grid: Players Dancing in Room */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-black text-gray-800 dark:text-gray-100 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-500" />
                  <span>Lobideki Oyuncular ({players.length} Kişi Hazır)</span>
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-semibold">
                  Oyuncular hazır olduğunda yarışmayı başlat!
                </p>
              </div>

              <button
                onClick={handleStartGame}
                className="px-6 py-3 bg-[#58cc02] hover:bg-[#46a302] text-white font-black text-sm rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all shadow-lg flex items-center gap-2 animate-bounceSubtle"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>YARIŞMAYI BAŞLAT!</span>
              </button>
            </div>

            {/* Players Roster */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-2">
              {players.map((p) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border-2 flex flex-col items-center text-center transition-all ${
                    p.isCurrentUser
                      ? 'border-[#58cc02] bg-green-50 dark:bg-green-950/40 shadow-md ring-2 ring-green-300 dark:ring-green-700'
                      : 'border-gray-200 dark:border-[#2b3d45] bg-gray-50 dark:bg-[#202f36]'
                  }`}
                >
                  <div className="p-1">
                    <KnowzaAvatar size="lg" costume={p.costume} animate="dance" />
                  </div>
                  <span className="font-black text-xs text-gray-800 dark:text-gray-100 mt-1 truncate max-w-[90px]">
                    {p.name}
                  </span>
                  {p.isCurrentUser ? (
                    <span className="text-[10px] font-black text-[#58cc02] mt-0.5">SEN ✅</span>
                  ) : (
                    <span className="text-[10px] font-bold text-gray-400 mt-0.5">Yarışmacı</span>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {/* ================= 2. LIVE QUESTION PHASE ================= */}
      {phase === 'question' && (
        <div className="space-y-6 animate-pop">
          
          {/* Header Bar: Question No, Category & Timer */}
          <div className="flex items-center justify-between gap-4 bg-white dark:bg-[#1a2c35] p-4 rounded-3xl border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-xs font-black px-3 py-1 rounded-full uppercase">
                Soru {currentQIndex + 1} / {currentQuizSet.questions.length}
              </span>
              <span className="text-xs font-black text-gray-500 dark:text-gray-400 hidden sm:inline">
                {currentQuestion.category}
              </span>
            </div>

            {/* Circular Timer Pill */}
            <div className={`flex items-center gap-2 px-4 py-1.5 rounded-2xl font-black text-base shadow-sm transition-all ${
              timeLeft <= 5 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-amber-100 dark:bg-amber-950/50 text-amber-900 dark:text-amber-200'
            }`}>
              <Timer className="w-5 h-5" />
              <span className="font-mono text-xl">{timeLeft}s</span>
            </div>

            {/* Streak Bonus */}
            {comboStreak > 1 && (
              <div className="flex items-center gap-1 text-orange-500 font-black text-xs sm:text-sm">
                <Flame className="w-4 h-4 fill-orange-500" />
                <span>{comboStreak}x Seri Ateşi!</span>
              </div>
            )}
          </div>

          {/* Big Kahoot Question Card */}
          <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border-4 border-indigo-900 shadow-2xl text-center min-h-[160px] flex items-center justify-center">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black leading-snug max-w-2xl mx-auto">
              {currentQuestion.prompt}
            </h2>
          </div>

          {/* 4 Iconic Kahoot Big Answer Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {currentQuestion.options.map((opt, idx) => {
              const btn = KAHOOT_BUTTONS[idx % KAHOOT_BUTTONS.length];
              const isSelected = selectedOptionIndex === idx;

              return (
                <button
                  key={idx}
                  disabled={isAnswerLocked}
                  onClick={() => handleSelectAnswer(idx)}
                  className={`p-5 sm:p-7 rounded-3xl border-b-6 transition-all text-left flex items-center gap-4 shadow-lg ${btn.bg} ${
                    isAnswerLocked && !isSelected ? 'opacity-60 cursor-not-allowed' : ''
                  } ${
                    isSelected ? 'ring-4 ring-white scale-102 border-b-2 translate-y-1' : 'active:border-b-0 active:translate-y-1.5'
                  }`}
                >
                  {/* Geometric Shape Icon */}
                  <div className="w-12 h-12 rounded-2xl bg-black/20 flex items-center justify-center text-3xl font-black text-white flex-shrink-0 drop-shadow">
                    {btn.shape}
                  </div>
                  <div className="flex-1">
                    <span className="text-lg sm:text-xl font-black text-white leading-tight block">
                      {opt}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {isAnswerLocked && (
            <div className="text-center text-xs font-black text-gray-500 dark:text-gray-400 animate-pulse">
              Cevap kilitlendi! Rakiplerin yanıtları bekleniyor...
            </div>
          )}

        </div>
      )}

      {/* ================= 3. ROUND RESULT & SCOREBOARD ================= */}
      {phase === 'round_result' && (
        <div className="space-y-6 animate-pop">
          
          {/* Result Banner */}
          {selectedOptionIndex === currentQuestion.correctIndex ? (
            <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white rounded-3xl p-6 text-center shadow-xl">
              <div className="text-4xl mb-1 animate-bounce">🎉</div>
              <h2 className="text-2xl sm:text-3xl font-black">DOĞRU CEVAP!</h2>
              <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1">
                Harika hız! Puanın skor tablosuna eklendi.
              </p>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-red-500 to-rose-600 text-white rounded-3xl p-6 text-center shadow-xl">
              <div className="text-4xl mb-1">💔</div>
              <h2 className="text-2xl sm:text-3xl font-black">
                {selectedOptionIndex === null ? 'SÜRE DOLDU!' : 'YANLIŞ CEVAP!'}
              </h2>
              <p className="text-xs sm:text-sm font-semibold opacity-90 mt-1">
                Doğru Seçenek: <span className="font-black underline">{currentQuestion.options[currentQuestion.correctIndex]}</span>
              </p>
            </div>
          )}

          {/* Knowza Ayıcık Explanation Card */}
          <div className="bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700/80 rounded-3xl p-5 flex items-start gap-4">
            <KnowzaAvatar size="lg" costume={stats.selectedCostume} animate="dance" />
            <div className="flex-1">
              <div className="text-xs font-black text-amber-900 dark:text-amber-200">
                Knowza 3D Maskot Çözüm Notu
              </div>
              <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-semibold mt-1 leading-relaxed">
                {currentQuestion.explanation}
              </p>
              {currentQuestion.funFact && (
                <div className="text-[11px] font-bold text-amber-700 dark:text-amber-400 mt-2 pt-2 border-t border-amber-200 dark:border-amber-800">
                  💡 {currentQuestion.funFact}
                </div>
              )}
            </div>
          </div>

          {/* Live Scoreboard (Puan Sıralaması) */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100 dark:border-[#2b3d45]">
              <h3 className="font-black text-base text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <span>Canlı Skor Tablosu</span>
              </h3>
              <span className="text-xs font-bold text-gray-400">Hız & Doğruluk Puanı</span>
            </div>

            <div className="space-y-2">
              {players.map((p, idx) => (
                <div
                  key={p.id}
                  className={`p-3 rounded-2xl border-2 flex items-center justify-between transition-all ${
                    p.isCurrentUser
                      ? 'border-[#58cc02] bg-green-50 dark:bg-green-950/40 shadow-sm'
                      : 'border-gray-100 dark:border-[#2b3d45] bg-gray-50 dark:bg-[#202f36]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-black text-sm w-6 text-center text-gray-500">
                      #{idx + 1}
                    </span>
                    <KnowzaAvatar size="sm" costume={p.costume} animate={idx === 0 ? 'dance' : false} />
                    <div>
                      <div className="font-black text-xs sm:text-sm text-gray-800 dark:text-gray-100 flex items-center gap-2">
                        <span>{p.name}</span>
                        {p.isCurrentUser && (
                          <span className="text-[10px] bg-green-500 text-white font-black px-1.5 py-0.2 rounded-md">SEN</span>
                        )}
                        {p.lastAnswerCorrect && (
                          <span className="text-[10px] text-green-600 font-bold">✓ Doğru</span>
                        )}
                      </div>
                      <div className="text-[10px] text-gray-400 font-semibold">
                        {p.streak > 1 ? `${p.streak} Soru Üst Üste!` : 'Yarışmacı'}
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-black text-sm text-[#1cb0f6]">{p.score}</span>
                    <span className="text-[10px] font-bold text-gray-400 ml-1">Puan</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleNextQuestion}
              className="w-full py-3.5 bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-black text-sm rounded-2xl border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2 mt-4"
            >
              <span>{currentQIndex + 1 < currentQuizSet.questions.length ? 'Sonraki Soruya Geç' : 'Büyük Podyumu Gör 🏆'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* ================= 4. GRAND PODIUM & CELEBRATION ================= */}
      {phase === 'podium' && (
        <div className="space-y-6 animate-pop text-center">
          
          {/* Champion Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-white rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            <div className="text-5xl mb-2 animate-bounce">👑</div>
            <h1 className="text-3xl sm:text-4xl font-black">ŞAMPİYONLAR PODYUMU!</h1>
            <p className="text-white/90 text-xs sm:text-sm font-semibold max-w-md mx-auto mt-1">
              KahootGO arenasında tüm sorular tamamlandı! İşte zirvedeki efsanevi ayıcıklar:
            </p>
          </div>

          {/* 3D Olympic Podium Steps */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 items-end pt-8 max-w-lg mx-auto">
            
            {/* 2nd Place (Silver) */}
            <div className="flex flex-col items-center">
              <KnowzaAvatar size="lg" costume={players[1]?.costume || 'classic'} animate="dance" />
              <span className="font-black text-xs text-gray-800 dark:text-gray-100 mt-2 truncate max-w-[80px]">
                {players[1]?.name || 'Zeynep'}
              </span>
              <span className="text-[10px] font-bold text-gray-500">{players[1]?.score} Puan</span>
              <div className="w-full bg-slate-300 dark:bg-slate-700 h-28 rounded-t-2xl flex flex-col items-center justify-center border-t-4 border-slate-400 mt-2 shadow-lg">
                <span className="text-3xl">🥈</span>
                <span className="font-black text-white text-base">2. SIRA</span>
              </div>
            </div>

            {/* 1st Place (Gold Champion) */}
            <div className="flex flex-col items-center -translate-y-4">
              <div className="relative">
                <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce">👑</span>
                <KnowzaAvatar size="xl" costume={players[0]?.costume || 'king'} animate="dance" />
              </div>
              <span className="font-black text-sm text-amber-600 dark:text-amber-400 mt-2 truncate max-w-[100px]">
                {players[0]?.name || 'Sen'}
              </span>
              <span className="text-xs font-black text-amber-500">{players[0]?.score} Puan</span>
              <div className="w-full bg-gradient-to-t from-amber-500 to-yellow-400 h-36 rounded-t-2xl flex flex-col items-center justify-center border-t-4 border-amber-300 mt-2 shadow-2xl">
                <span className="text-4xl">🥇</span>
                <span className="font-black text-white text-lg">ŞAMPİYON</span>
              </div>
            </div>

            {/* 3rd Place (Bronze) */}
            <div className="flex flex-col items-center">
              <KnowzaAvatar size="lg" costume={players[2]?.costume || 'classic'} animate="dance" />
              <span className="font-black text-xs text-gray-800 dark:text-gray-100 mt-2 truncate max-w-[80px]">
                {players[2]?.name || 'Barış'}
              </span>
              <span className="text-[10px] font-bold text-gray-500">{players[2]?.score} Puan</span>
              <div className="w-full bg-amber-700/60 dark:bg-amber-900/60 h-20 rounded-t-2xl flex flex-col items-center justify-center border-t-4 border-amber-600 mt-2 shadow-lg">
                <span className="text-2xl">🥉</span>
                <span className="font-black text-white text-sm">3. SIRA</span>
              </div>
            </div>

          </div>

          {/* Reward Box */}
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40 border-2 border-amber-300 dark:border-amber-700 rounded-3xl p-5 max-w-md mx-auto">
            <div className="text-xs font-black text-amber-900 dark:text-amber-200">
              🎁 KAZANDIĞIN ÖDÜLLER
            </div>
            <div className="flex items-center justify-center gap-6 mt-2">
              <div className="flex items-center gap-1.5 font-black text-base text-amber-600">
                <span>⚡ +80 XP</span>
              </div>
              <div className="flex items-center gap-1.5 font-black text-base text-blue-600">
                <span>💎 +25 Elmas</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetGame}
              className="w-full sm:w-auto px-8 py-3 bg-[#58cc02] hover:bg-[#46a302] text-white font-extrabold text-sm rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tekrar Yarış</span>
            </button>
            <button
              onClick={() => {
                sound.playClick();
                setPhase('lobby');
                setActiveTab('host');
              }}
              className="w-full sm:w-auto px-8 py-3 bg-[#1cb0f6] hover:bg-[#1899d6] text-white font-extrabold text-sm rounded-2xl border-b-4 border-[#1899d6] active:border-b-0 active:translate-y-1 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              <span>Farklı Konuda Oda Kur</span>
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
