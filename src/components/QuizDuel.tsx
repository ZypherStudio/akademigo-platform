import React, { useState, useEffect } from 'react';
import { useGame, AVATAR_MAP } from '../context/GameContext';
import { Swords, Trophy, Shield, Zap, Timer, Flame, CheckCircle2, XCircle, RotateCcw, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';

interface DuelQuestion {
  id: number;
  prompt: string;
  options: string[];
  correctAnswer: string;
  category: string;
}

const DUEL_QUESTIONS: DuelQuestion[] = [
  {
    id: 1,
    prompt: '2³ + 3² işleminin sonucu kaçtır?',
    options: ['15', '17', '18', '19'],
    correctAnswer: '17',
    category: 'Matematik'
  },
  {
    id: 2,
    prompt: 'Türkiye\'nin ilk astronotu Alper Gezeravcı hangi uzay misyonu ile uçmuştur?',
    options: ['Ax-3', 'Apollo 11', 'Artemis 2', 'Crew Dragon 1'],
    correctAnswer: 'Ax-3',
    category: 'Güncel Bilgi'
  },
  {
    id: 3,
    prompt: 'Python\'da listeye sonradan eleman eklemek için hangi metod kullanılır?',
    options: ['.append()', '.push()', '.add()', '.insertEnd()'],
    correctAnswer: '.append()',
    category: 'Kodlama'
  },
  {
    id: 4,
    prompt: '"Nice to meet you" diyen birine en kibar karşılık nedir?',
    options: ['Nice to meet you too', 'Yes, I do', 'Goodbye now', 'I am student'],
    correctAnswer: 'Nice to meet you too',
    category: 'İngilizce'
  },
  {
    id: 5,
    prompt: 'Kurtuluş Savaşı\'nda Doğu Cephesi hangi antlaşma ile kapanmıştır?',
    options: ['Gümrü Antlaşması', 'Lozan Barış', 'Mudanya Mütarekesi', 'Ankara Antlaşması'],
    correctAnswer: 'Gümrü Antlaşması',
    category: 'Tarih'
  }
];

const BOT_OPPONENTS = [
  { name: 'Mert_YKS_2026', avatar: '👨‍💻', elo: 1250 },
  { name: 'Zeynep_Kpss_Derece', avatar: '👩‍🎓', elo: 1290 },
  { name: 'Berk_PythonMaster', avatar: '🚀', elo: 1220 },
  { name: 'Elif_Lgs_Sampiyon', avatar: '⚡', elo: 1270 }
];

export const QuizDuel: React.FC = () => {
  const { stats, updateElo } = useGame();
  const [phase, setPhase] = useState<'lobby' | 'matchmaking' | 'battle' | 'result'>('lobby');
  const [opponent, setOpponent] = useState(BOT_OPPONENTS[0]);
  const [currentRound, setCurrentRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [roundTimeLeft, setRoundTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roundStatus, setRoundStatus] = useState<'answering' | 'revealed'>('answering');
  const [eloDelta, setEloDelta] = useState(0);

  // ELO Tier Name
  const getEloTier = (elo: number) => {
    if (elo >= 2000) return { title: 'Büyükusta 👑', color: 'text-amber-400 bg-amber-500/20 border-amber-400' };
    if (elo >= 1600) return { title: 'Elmas ⭐', color: 'text-cyan-400 bg-cyan-500/20 border-cyan-400' };
    if (elo >= 1400) return { title: 'Altın 🏆', color: 'text-yellow-500 bg-yellow-500/20 border-yellow-500' };
    if (elo >= 1200) return { title: 'Gümüş 🥈', color: 'text-slate-300 bg-slate-500/20 border-slate-300' };
    return { title: 'Bronz 🥉', color: 'text-orange-400 bg-orange-500/20 border-orange-400' };
  };

  const currentTier = getEloTier(stats.eloRating);
  const q = DUEL_QUESTIONS[currentRound];

  // Round countdown timer
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (phase === 'battle' && roundStatus === 'answering' && roundTimeLeft > 0) {
      timer = setInterval(() => {
        setRoundTimeLeft(t => t - 1);
      }, 1000);
    } else if (phase === 'battle' && roundStatus === 'answering' && roundTimeLeft === 0) {
      handleTimeOut();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [phase, roundStatus, roundTimeLeft]);

  // Start Matchmaking
  const handleStartMatchmaking = () => {
    sound.playClick();
    setPhase('matchmaking');
    const randomBot = BOT_OPPONENTS[Math.floor(Math.random() * BOT_OPPONENTS.length)];
    setOpponent(randomBot);

    setTimeout(() => {
      sound.playVictory();
      setPhase('battle');
      setCurrentRound(0);
      setUserScore(0);
      setOpponentScore(0);
      setRoundTimeLeft(10);
      setSelectedOption(null);
      setRoundStatus('answering');
    }, 2000);
  };

  const handleSelectOption = (opt: string) => {
    if (roundStatus !== 'answering') return;
    sound.playClick();
    setSelectedOption(opt);
    setRoundStatus('revealed');

    const isCorrect = opt === q.correctAnswer;
    const timeBonus = roundTimeLeft * 10;
    const addedUserScore = isCorrect ? 100 + timeBonus : 0;

    // Simulate opponent answer
    const botCorrect = Math.random() > 0.3; // 70% chance bot answers correctly
    const addedBotScore = botCorrect ? 100 + Math.floor(Math.random() * 60) : 0;

    if (isCorrect) sound.playCorrect();
    else sound.playWrong();

    setUserScore(s => s + addedUserScore);
    setOpponentScore(s => s + addedBotScore);

    // Advance to next round or finish
    setTimeout(() => {
      if (currentRound + 1 < DUEL_QUESTIONS.length) {
        setCurrentRound(r => r + 1);
        setSelectedOption(null);
        setRoundTimeLeft(10);
        setRoundStatus('answering');
      } else {
        finishDuel(userScore + addedUserScore, opponentScore + addedBotScore);
      }
    }, 1800);
  };

  const handleTimeOut = () => {
    setRoundStatus('revealed');
    sound.playWrong();
    setTimeout(() => {
      if (currentRound + 1 < DUEL_QUESTIONS.length) {
        setCurrentRound(r => r + 1);
        setSelectedOption(null);
        setRoundTimeLeft(10);
        setRoundStatus('answering');
      } else {
        finishDuel(userScore, opponentScore);
      }
    }, 1500);
  };

  const finishDuel = (finalUser: number, finalBot: number) => {
    setPhase('result');
    const won = finalUser >= finalBot;
    const delta = won ? 32 : -18;
    setEloDelta(delta);
    updateElo(delta, won);

    if (won) {
      sound.playVictory();
      confetti({ particleCount: 100, spread: 80 });
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 space-y-6 pb-24 select-none">
      
      {/* 1. Lobby Phase: Chess.com-style Rating Card */}
      {phase === 'lobby' && (
        <div className="space-y-6 animate-pop">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-3xl p-6 text-white shadow-xl text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 bg-black/20 px-4 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Swords className="w-4 h-4 text-amber-300" />
              Chess.com Tarzı Canlı Bilgi Arenası
            </div>
            <div className="text-6xl mb-2 animate-bounceSubtle">⚔️</div>
            <h2 className="text-3xl font-black">1v1 Bilgi Düellosu</h2>
            <p className="text-white/90 text-sm font-semibold max-w-md mx-auto mt-1">
              Rakiplerinle anlık yarış, soruları ışık hızında cevapla ve ELO puanını zirveye taşı!
            </p>
          </div>

          {/* Rating Profile Card */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner">
                {AVATAR_MAP[stats.avatar]?.emoji || '🦉'}
              </div>
              <div>
                <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md border ${currentTier.color}`}>
                  {currentTier.title}
                </span>
                <h3 className="text-2xl font-black text-gray-800 mt-1">{stats.eloRating} ELO</h3>
                <div className="text-xs font-bold text-gray-500 mt-0.5">
                  Galibiyet: <span className="text-green-600 font-black">{stats.duelWins}</span> | Mağlubiyet: <span className="text-red-500 font-black">{stats.duelLosses}</span>
                </div>
              </div>
            </div>

            <button
              onClick={handleStartMatchmaking}
              className="w-full sm:w-auto bg-[#ff9600] hover:bg-[#e08300] text-white font-black text-sm px-8 py-4 rounded-2xl border-b-4 border-[#e08300] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Swords className="w-5 h-5" />
              <span>RAKİP BUL & DÜELLOYA GİR</span>
            </button>
          </div>
        </div>
      )}

      {/* 2. Matchmaking Phase */}
      {phase === 'matchmaking' && (
        <div className="bg-white rounded-3xl p-10 border-2 border-gray-200 shadow-sm text-center max-w-md mx-auto space-y-6 animate-pop">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            <span className="text-4xl animate-pulse">⚔️</span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-gray-800">Rakip Aranıyor...</h3>
            <p className="text-xs font-bold text-gray-500 mt-1">
              Senin ELO seviyene ({stats.eloRating} ± 50) uygun öğrenci eşleştiriliyor.
            </p>
          </div>

          <div className="bg-gray-50 border-2 border-gray-200 p-3 rounded-2xl text-xs font-bold text-gray-700 animate-pulse">
            Eşleşen: {opponent.name} ({opponent.elo} ELO)
          </div>
        </div>
      )}

      {/* 3. Battle Arena Phase */}
      {phase === 'battle' && (
        <div className="space-y-6 animate-pop">
          
          {/* Split Screen Score Bar: Player vs Opponent */}
          <div className="grid grid-cols-2 gap-3 bg-gray-900 text-white p-4 rounded-3xl border-2 border-gray-800 shadow-lg">
            {/* Player */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-2xl">
                {AVATAR_MAP[stats.avatar]?.emoji || '🦉'}
              </div>
              <div>
                <div className="text-xs font-black text-blue-400">SEN ({stats.eloRating})</div>
                <div className="text-2xl font-black">{userScore} Puan</div>
              </div>
            </div>

            {/* Opponent */}
            <div className="flex items-center justify-end gap-3 text-right">
              <div>
                <div className="text-xs font-black text-red-400">{opponent.name} ({opponent.elo})</div>
                <div className="text-2xl font-black">{opponentScore} Puan</div>
              </div>
              <div className="w-12 h-12 rounded-xl bg-red-600/30 border border-red-400 flex items-center justify-center text-2xl">
                {opponent.avatar}
              </div>
            </div>
          </div>

          {/* Question Card with Timer */}
          <div className="bg-white rounded-3xl p-6 border-2 border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <span className="text-xs font-black uppercase text-amber-600 bg-amber-50 px-3 py-1 rounded-lg">
                Raunt {currentRound + 1} / {DUEL_QUESTIONS.length} • {q.category}
              </span>

              {/* Countdown Clock */}
              <div className={`flex items-center gap-1.5 font-mono font-black text-sm px-3 py-1 rounded-xl border ${
                roundTimeLeft <= 3 ? 'bg-red-50 text-red-600 border-red-200 animate-bounce' : 'bg-gray-100 text-gray-700 border-gray-200'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{roundTimeLeft}s</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-800 leading-snug">
              {q.prompt}
            </h3>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {q.options.map((opt) => {
                const isSelected = selectedOption === opt;
                const isCorrect = opt === q.correctAnswer;
                const showFeedback = roundStatus === 'revealed';

                return (
                  <button
                    key={opt}
                    disabled={roundStatus !== 'answering'}
                    onClick={() => handleSelectOption(opt)}
                    className={`p-4 rounded-2xl font-extrabold text-sm border-2 text-left transition-all ${
                      showFeedback
                        ? isCorrect
                          ? 'border-green-500 bg-green-50 text-green-800'
                          : isSelected
                          ? 'border-red-500 bg-red-50 text-red-800'
                          : 'border-gray-200 opacity-50'
                        : isSelected
                        ? 'border-amber-500 bg-amber-50 text-amber-900'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>

        </div>
      )}

      {/* 4. Results Screen with Chess.com-style ELO Gain Animation */}
      {phase === 'result' && (
        <div className="bg-white rounded-3xl p-8 border-2 border-gray-200 shadow-xl text-center max-w-md mx-auto space-y-6 animate-pop">
          <div className="text-6xl animate-bounceSubtle">
            {userScore >= opponentScore ? '🏆' : '💀'}
          </div>

          <div>
            <h3 className="text-3xl font-black text-gray-800">
              {userScore >= opponentScore ? 'ZAFER! Kazandın!' : 'MAĞLUBİYET!'}
            </h3>
            <p className="text-xs font-bold text-gray-500 mt-1">
              Sen: <span className="font-black text-gray-800">{userScore} Puan</span> vs Rakip: <span className="font-black text-gray-800">{opponentScore} Puan</span>
            </p>
          </div>

          {/* ELO Rating Delta Box */}
          <div className={`p-4 rounded-2xl border-2 text-center ${
            eloDelta > 0 ? 'bg-green-50 border-green-300 text-green-800' : 'bg-red-50 border-red-300 text-red-800'
          }`}>
            <span className="text-xs font-black uppercase block">ELO PUANI DEĞİŞİMİ</span>
            <div className="text-3xl font-black mt-1">
              {eloDelta > 0 ? `+${eloDelta}` : eloDelta} ELO
            </div>
            <div className="text-xs font-bold mt-1">
              Yeni Reytingin: <span className="font-black">{stats.eloRating}</span>
            </div>
          </div>

          <button
            onClick={() => setPhase('lobby')}
            className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-4 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all text-xs uppercase tracking-wider"
          >
            ARENAYA DÖN
          </button>
        </div>
      )}

    </div>
  );
};
