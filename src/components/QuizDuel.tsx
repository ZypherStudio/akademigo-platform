import React, { useState, useEffect } from 'react';
import { useGame, AVATAR_MAP } from '../context/GameContext';
import { Swords, Trophy, Shield, Zap, Timer, Flame, CheckCircle2, XCircle, RotateCcw, Sparkles, Users, Share2, Copy, KeyRound, Play } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';
import { HariboAvatar } from './HariboAvatar';

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
  const [phase, setPhase] = useState<'lobby' | 'matchmaking' | 'room_lobby' | 'battle' | 'result'>('lobby');
  const [opponent, setOpponent] = useState(BOT_OPPONENTS[0]);
  const [currentRound, setCurrentRound] = useState(0);
  const [userScore, setUserScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [roundTimeLeft, setRoundTimeLeft] = useState(10);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roundStatus, setRoundStatus] = useState<'answering' | 'revealed'>('answering');
  const [eloDelta, setEloDelta] = useState(0);

  // Private Room State
  const [roomCode, setRoomCode] = useState('GO-742');
  const [joinCodeInput, setJoinCodeInput] = useState('');
  const [roomCopied, setRoomCopied] = useState(false);
  const [roomFriendJoined, setRoomFriendJoined] = useState(false);

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
    }, 1800);
  };

  // Create Private Room
  const handleCreateRoom = () => {
    sound.playClick();
    const randomCode = 'GO-' + Math.floor(100 + Math.random() * 900);
    setRoomCode(randomCode);
    setRoomFriendJoined(false);
    setPhase('room_lobby');

    // Simulate friend joining after 4 seconds
    setTimeout(() => {
      setRoomFriendJoined(true);
      sound.playCorrect();
    }, 3500);
  };

  const handleStartRoomBattle = (opponentName?: string) => {
    sound.playVictory();
    setOpponent({
      name: opponentName || 'Arkadaşın (Oda: ' + roomCode + ')',
      avatar: '🧑‍🎓',
      elo: stats.eloRating + 10
    });
    setPhase('battle');
    setCurrentRound(0);
    setUserScore(0);
    setOpponentScore(0);
    setRoundTimeLeft(10);
    setSelectedOption(null);
    setRoundStatus('answering');
  };

  const handleJoinWithCode = () => {
    if (!joinCodeInput.trim()) return;
    sound.playClick();
    handleStartRoomBattle('Oda Sahibi (' + joinCodeInput.toUpperCase() + ')');
  };

  const handleCopyRoomLink = () => {
    sound.playClick();
    const text = `⚔️ AkademiGO'da seninle 1v1 Bilgi Düellosuna girmek istiyorum! 🍯✨\nOda Kodum: *${roomCode}*\nHemen gir ve kapışalım: ${window.location.origin}`;
    navigator.clipboard.writeText(text);
    setRoomCopied(true);
    setTimeout(() => setRoomCopied(false), 2500);
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
    const botCorrect = Math.random() > 0.3;
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
      
      {/* 1. Lobby Phase: Quick Play or Friend Room */}
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
              Rakiplerinle veya arkadaşlarınla oda kurarak anlık yarış, soruları ışık hızında cevapla ve ELO zirvesine tırman!
            </p>
          </div>

          {/* Rating Profile Card */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors duration-300">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="w-20 h-20 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border-2 border-amber-300 dark:border-amber-700 flex items-center justify-center text-4xl shadow-inner p-2">
                {stats.avatar === 'haribo' ? <HariboAvatar size="lg" /> : (AVATAR_MAP[stats.avatar]?.emoji || '⚔️')}
              </div>
              <div>
                <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-md border ${currentTier.color}`}>
                  {currentTier.title}
                </span>
                <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 mt-1">{stats.eloRating} ELO</h3>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                  Galibiyet: <span className="text-green-600 dark:text-green-400 font-black">{stats.duelWins}</span> | Mağlubiyet: <span className="text-red-500 dark:text-red-400 font-black">{stats.duelLosses}</span>
                </div>
              </div>
            </div>

            {/* Quick Matchmaking Button */}
            <button
              onClick={handleStartMatchmaking}
              className="w-full sm:w-auto bg-[#ff9600] hover:bg-[#e08300] text-white font-black text-sm px-8 py-4 rounded-2xl border-b-4 border-[#e08300] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg"
            >
              <Swords className="w-5 h-5" />
              <span>HIZLI RAKİP BUL & KAPIS</span>
            </button>
          </div>

          {/* Viral Feature: Friend Room (Oda Kur & Odaya Katıl) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Create Room Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-blue-200">
                  <Users className="w-4 h-4" />
                  Özel Oda Oluştur
                </div>
                <h3 className="text-xl font-black mt-1">Arkadaşına Meydan Oku</h3>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  Tek tıkla 4 haneli özel oda kodu oluştur. Kodu WhatsApp'tan arkadaşına gönder, canlı düelloda kapışın!
                </p>
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full bg-white hover:bg-gray-100 text-blue-700 font-black py-3 rounded-2xl border-b-4 border-blue-200 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-xs uppercase"
              >
                <KeyRound className="w-4 h-4" />
                <span>ODA KUR & KOD AL</span>
              </button>
            </div>

            {/* Join Room Card */}
            <div className="bg-white dark:bg-[#1a2c35] border-2 border-gray-200 dark:border-[#2b3d45] rounded-3xl p-6 shadow-sm space-y-4 flex flex-col justify-between transition-colors duration-300">
              <div>
                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">
                  <KeyRound className="w-4 h-4 text-emerald-500" />
                  Mevcut Odaya Bağlan
                </div>
                <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mt-1">Oda Koduyla Katıl</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Arkadaşının paylaştığı 4 haneli kodu girerek onun odasına anında bağlan.
                </p>
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="Örn: GO-742"
                  maxLength={8}
                  className="flex-1 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-[#2b3d45] rounded-2xl px-3 py-2 text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest text-center focus:outline-none focus:border-blue-500"
                />
                <button
                  onClick={handleJoinWithCode}
                  disabled={!joinCodeInput.trim()}
                  className="bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black px-4 py-2 rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all text-xs flex items-center gap-1.5"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>GİR</span>
                </button>
              </div>
            </div>

          </div>

        </div>
      )}

      {/* 2. Room Lobby Phase */}
      {phase === 'room_lobby' && (
        <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-8 border-2 border-gray-200 dark:border-[#2b3d45] shadow-xl text-center max-w-md mx-auto space-y-6 animate-pop transition-colors duration-300">
          <div className="text-4xl animate-bounceSubtle">👥</div>
          <div>
            <span className="text-xs font-black uppercase text-blue-500 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full">
              Canlı Arkadaş Odası
            </span>
            <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 mt-2">Oda Hazır!</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Bu kodu arkadaşına gönder. Odaya girdiğinde maç başlayacak.
            </p>
          </div>

          {/* Big Room Code Box */}
          <div className="bg-gray-100 dark:bg-gray-800 border-4 border-dashed border-blue-400 rounded-3xl p-4 flex items-center justify-center gap-3">
            <span className="text-3xl sm:text-4xl font-black font-mono tracking-widest text-blue-600 dark:text-blue-400">
              {roomCode}
            </span>
            <button
              onClick={handleCopyRoomLink}
              className="bg-blue-500 hover:bg-blue-600 text-white p-2.5 rounded-xl shadow active:scale-95 transition-all"
              title="Kodu Kopyala"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>

          {roomCopied && (
            <div className="text-xs font-black text-green-600 dark:text-green-400 animate-pop">
              Davet mesajı ve link panoya kopyalandı! ✅
            </div>
          )}

          {/* Friend Connection Status */}
          <div className="p-3 rounded-2xl border-2 text-xs font-bold transition-all flex items-center justify-center gap-2">
            {roomFriendJoined ? (
              <span className="text-green-600 dark:text-green-400 flex items-center gap-1.5 font-black">
                <CheckCircle2 className="w-4 h-4" />
                Arkadaşın Odaya Katıldı!
              </span>
            ) : (
              <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1.5 animate-pulse">
                <Timer className="w-4 h-4" />
                Arkadaşın bekleniyor... (Kod: {roomCode})
              </span>
            )}
          </div>

          {/* Start Battle or WhatsApp Share Button */}
          <div className="space-y-2">
            {roomFriendJoined ? (
              <button
                onClick={() => handleStartRoomBattle()}
                className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-4 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg text-sm animate-wiggle"
              >
                <Swords className="w-5 h-5" />
                <span>ARKADAŞINLA DÜELLOYU BAŞLAT!</span>
              </button>
            ) : (
              <button
                onClick={handleCopyRoomLink}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3.5 rounded-2xl border-b-4 border-green-700 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-xs uppercase"
              >
                <Share2 className="w-4 h-4" />
                <span>WHATSAPP'TA ARKADAŞINA GÖNDER</span>
              </button>
            )}

            <button
              onClick={() => setPhase('lobby')}
              className="text-xs font-bold text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 pt-2 block mx-auto"
            >
              İptal Et ve Geri Dön
            </button>
          </div>
        </div>
      )}

      {/* 3. Matchmaking Phase */}
      {phase === 'matchmaking' && (
        <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-10 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm text-center max-w-md mx-auto space-y-6 animate-pop transition-colors duration-300">
          <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-amber-500 border-t-transparent animate-spin" />
            <span className="text-4xl animate-pulse">⚔️</span>
          </div>

          <div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">Rakip Aranıyor...</h3>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
              Senin ELO seviyene ({stats.eloRating} ± 50) uygun öğrenci eşleştiriliyor.
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-[#202f36] border-2 border-gray-200 dark:border-[#2b3d45] p-3 rounded-2xl text-xs font-bold text-gray-700 dark:text-gray-200 animate-pulse">
            Eşleşen: {opponent.name} ({opponent.elo} ELO)
          </div>
        </div>
      )}

      {/* 4. Battle Arena Phase */}
      {phase === 'battle' && (
        <div className="space-y-6 animate-pop">
          
          {/* Split Screen Score Bar: Player vs Opponent */}
          <div className="grid grid-cols-2 gap-2 sm:gap-3 bg-gray-900 text-white p-3 sm:p-4 rounded-3xl border-2 border-gray-800 shadow-lg">
            {/* Player */}
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-blue-600/30 border border-blue-400 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0 p-1">
                {stats.avatar === 'haribo' ? <HariboAvatar size="sm" /> : (AVATAR_MAP[stats.avatar]?.emoji || '⚔️')}
              </div>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-black text-blue-400 truncate">SEN ({stats.eloRating})</div>
                <div className="text-lg sm:text-2xl font-black">{userScore} Puan</div>
              </div>
            </div>

            {/* Opponent */}
            <div className="flex items-center justify-end gap-2 sm:gap-3 text-right min-w-0">
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-black text-red-400 truncate">{opponent.name} ({opponent.elo})</div>
                <div className="text-lg sm:text-2xl font-black">{opponentScore} Puan</div>
              </div>
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-600/30 border border-red-400 flex items-center justify-center text-xl sm:text-2xl flex-shrink-0">
                {opponent.avatar}
              </div>
            </div>
          </div>

          {/* Question Card with Timer */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-6 transition-colors duration-300">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 dark:border-[#2b3d45]">
              <span className="text-xs font-black uppercase text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-3 py-1 rounded-lg">
                Raunt {currentRound + 1} / {DUEL_QUESTIONS.length} • {q.category}
              </span>

              {/* Countdown Clock */}
              <div className={`flex items-center gap-1.5 font-mono font-black text-sm px-3 py-1 rounded-xl border ${
                roundTimeLeft <= 3 ? 'bg-red-50 text-red-600 border-red-200 animate-bounce' : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700'
              }`}>
                <Timer className="w-4 h-4" />
                <span>{roundTimeLeft}s</span>
              </div>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-gray-800 dark:text-gray-100 leading-snug">
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
                          ? 'border-green-500 bg-green-50 dark:bg-green-950/50 text-green-800 dark:text-green-300'
                          : isSelected
                          ? 'border-red-500 bg-red-50 dark:bg-red-950/50 text-red-800 dark:text-red-300'
                          : 'border-gray-200 dark:border-[#2b3d45] opacity-50'
                        : isSelected
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200'
                        : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-[#20343f] text-gray-700 dark:text-gray-200 bg-white dark:bg-[#202f36]'
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

      {/* 5. Results Screen with Chess.com-style ELO Gain Animation */}
      {phase === 'result' && (
        <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-8 border-2 border-gray-200 dark:border-[#2b3d45] shadow-xl text-center max-w-md mx-auto space-y-6 animate-pop transition-colors duration-300">
          <div className="text-6xl animate-bounceSubtle">
            {userScore >= opponentScore ? '🏆' : '💀'}
          </div>

          <div>
            <h3 className="text-3xl font-black text-gray-800 dark:text-gray-100">
              {userScore >= opponentScore ? 'ZAFER! Kazandın!' : 'MAĞLUBİYET!'}
            </h3>
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-1">
              Sen: <span className="font-black text-gray-800 dark:text-gray-100">{userScore} Puan</span> vs Rakip: <span className="font-black text-gray-800 dark:text-gray-100">{opponentScore} Puan</span>
            </p>
          </div>

          {/* ELO Rating Delta Box */}
          <div className={`p-4 rounded-2xl border-2 text-center ${
            eloDelta > 0 ? 'bg-green-50 dark:bg-green-950/40 border-green-300 dark:border-green-800 text-green-800 dark:text-green-300' : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
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
