import React, { useState, useEffect } from 'react';
import { useGame, AVATAR_MAP } from '../context/GameContext';
import { Swords, Trophy, Shield, Zap, Timer, Flame, CheckCircle2, XCircle, RotateCcw, Sparkles, Users, Share2, Copy, KeyRound, Play } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';
import { KnowzaAvatar } from './KnowzaAvatar';

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
  },
  {
    id: 6,
    prompt: 'En küçük ve tek çift asal sayı kaçtır?',
    options: ['1', '2', '3', '0'],
    correctAnswer: '2',
    category: 'Matematik'
  },
  {
    id: 7,
    prompt: 'Hücrenin enerji santrali olarak bilinen organel hangisidir?',
    options: ['Mitokondri', 'Ribozom', 'Golgi', 'Koful'],
    correctAnswer: 'Mitokondri',
    category: 'Biyoloji'
  },
  {
    id: 8,
    prompt: '2024 Paris Olimpiyatları\'nda dünya çapında viral olan efsanevi Türk atıcı kimdir?',
    options: ['Yusuf Dikeç', 'Mete Gazoz', 'Servet Tazegül', 'Rıza Kayaalp'],
    correctAnswer: 'Yusuf Dikeç',
    category: 'Güncel Bilgi'
  },
  {
    id: 9,
    prompt: 'Python\'da bir sözlüğün anahtarlarını listeleyen metod hangisidir?',
    options: ['.keys()', '.values()', '.items()', '.get()'],
    correctAnswer: '.keys()',
    category: 'Kodlama'
  },
  {
    id: 10,
    prompt: 'Türkiye Cumhuriyeti\'nin ilk Başbakanı kimdir?',
    options: ['İsmet İnönü', 'Fevzi Çakmak', 'Kazım Karabekir', 'Celal Bayar'],
    correctAnswer: 'İsmet İnönü',
    category: 'Tarih'
  },
  {
    id: 11,
    prompt: 'Bir dik üçgende dik kenarlar 6 ve 8 cm ise hipotenüs kaç cm\'dir?',
    options: ['10', '12', '14', '16'],
    correctAnswer: '10',
    category: 'Geometri'
  },
  {
    id: 12,
    prompt: '"Break a leg!" İngilizce deyimi ne anlama gelir?',
    options: ['Şansın bol olsun!', 'Bacağını kır!', 'Hemen dur!', 'Sakin ol!'],
    correctAnswer: 'Şansın bol olsun!',
    category: 'İngilizce'
  },
  {
    id: 13,
    prompt: 'UNESCO Dünya Mirası listesine 2023 yılında giren Gordion Antik Kenti hangi ilimizdedir?',
    options: ['Ankara', 'Konya', 'Eskişehir', 'Nevşehir'],
    correctAnswer: 'Ankara',
    category: 'KPSS Genel Kültür'
  },
  {
    id: 14,
    prompt: 'Maddenin 4. hali olarak kabul edilen plazmaya günlük hayattan örnek hangisidir?',
    options: ['Yıldırım & Şimşek', 'Buz küpü', 'Su buharı', 'Kaya parçası'],
    correctAnswer: 'Yıldırım & Şimşek',
    category: 'Fizik'
  },
  {
    id: 15,
    prompt: 'x² - 16 = 0 denkleminin pozitif kökü kaçtır?',
    options: ['4', '2', '8', '16'],
    correctAnswer: '4',
    category: 'Matematik'
  },
  {
    id: 16,
    prompt: 'Türkçe yazım kurallarına göre hangi sözcük daima ayrı yazılır?',
    options: ['Şey', 'Biraz', 'Birkaç', 'Birtakım'],
    correctAnswer: 'Şey',
    category: 'Türkçe'
  },
  {
    id: 17,
    prompt: '1 Megabayt (MB) kaç Kilobayttır (KB)?',
    options: ['1024 KB', '1000 KB', '512 KB', '2048 KB'],
    correctAnswer: '1024 KB',
    category: 'Bilgisayar'
  },
  {
    id: 18,
    prompt: 'Ünlü "Mona Lisa" ve "Son Akşam Yemeği" tablolarının ressamı kimdir?',
    options: ['Leonardo da Vinci', 'Pablo Picasso', 'Vincent van Gogh', 'Michelangelo'],
    correctAnswer: 'Leonardo da Vinci',
    category: 'Sanat & Kültür'
  },
  {
    id: 19,
    prompt: 'Dünyanın en derin noktası olan Mariana Çukuru hangi okyanustadır?',
    options: ['Büyük Okyanus (Pasifik)', 'Atlas Okyanusu', 'Hint Okyanusu', 'Arktik Okyanus'],
    correctAnswer: 'Büyük Okyanus (Pasifik)',
    category: 'Coğrafya'
  },
  {
    id: 20,
    prompt: 'DNA molekülünde Guanin bazının karşısına hangi baz eşleşir?',
    options: ['Sitozin', 'Adenin', 'Timin', 'Urasil'],
    correctAnswer: 'Sitozin',
    category: 'Biyoloji'
  },
  {
    id: 21,
    prompt: 'Lozan Barış Antlaşması hangi yılda imzalanmıştır?',
    options: ['1923', '1920', '1922', '1924'],
    correctAnswer: '1923',
    category: 'Tarih'
  },
  {
    id: 22,
    prompt: 'Periyodik tabloda sembolü "Au" olan değerli element hangisidir?',
    options: ['Altın', 'Gümüş', 'Bakır', 'Demir'],
    correctAnswer: 'Altın',
    category: 'Kimya'
  },
  {
    id: 23,
    prompt: 'x + y = 10 ve x - y = 4 ise x sayısı kaçtır?',
    options: ['7', '6', '8', '5'],
    correctAnswer: '7',
    category: 'Matematik'
  },
  {
    id: 24,
    prompt: 'JavaScript\'te değeri sonradan değiştirilemeyen sabit tanımlamak için ne kullanılır?',
    options: ['const', 'let', 'var', 'static'],
    correctAnswer: 'const',
    category: 'Kodlama'
  },
  {
    id: 25,
    prompt: '"Carry out" İngilizce phrasal verb\'ünün en yakın eş anlamlısı nedir?',
    options: ['Execute / Perform', 'Cancel', 'Delay', 'Forget'],
    correctAnswer: 'Execute / Perform',
    category: 'İngilizce'
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
  const [activeQuestions, setActiveQuestions] = useState<DuelQuestion[]>(() => DUEL_QUESTIONS.slice(0, 5));
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
  const q = activeQuestions[currentRound] || DUEL_QUESTIONS[0];

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
    const shuffled = [...DUEL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setActiveQuestions(shuffled);

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
    const shuffled = [...DUEL_QUESTIONS].sort(() => 0.5 - Math.random()).slice(0, 5);
    setActiveQuestions(shuffled);
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
    const text = `⚔️ Knowza'da seninle 1v1 Bilgi Düellosuna girmek istiyorum! 🍯✨\nOda Kodum: *${roomCode}*\nHemen gir ve kapışalım: ${window.location.origin}`;
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
      if (currentRound + 1 < activeQuestions.length) {
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
      if (currentRound + 1 < activeQuestions.length) {
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
      sound.playTestComplete();
      confetti({ particleCount: 120, spread: 80 });
    } else {
      sound.playWrong();
    }
  };

  return (
    <div className="flex-1 max-w-md mx-auto py-4 px-3 space-y-4 pb-24 select-none">
      
      {/* 1. Lobby Phase: Quick Play or Friend Room */}
      {phase === 'lobby' && (
        <div className="space-y-4 animate-pop">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-red-600 via-orange-600 to-amber-600 rounded-3xl p-5 text-white shadow-xl text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-1.5 bg-black/20 px-3.5 py-1 rounded-full text-[11px] font-black uppercase tracking-wider mb-2">
              <Swords className="w-3.5 h-3.5 text-amber-300" />
              Knowza Canlı Bilgi Arenası
            </div>
            <div className="text-5xl mb-2 animate-bounceSubtle">⚔️</div>
            <h2 className="text-2xl font-black">1v1 Bilgi Düellosu</h2>
            <p className="text-white/90 text-xs font-semibold max-w-xs mx-auto mt-1">
              Rakiplerinle veya arkadaşlarınla canlı yarış, soruları ışık hızında cevapla ve zirveye tırman!
            </p>
          </div>

          {/* Rating Profile Card */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-4 sm:p-5 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm flex flex-col gap-4 transition-colors duration-300">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-amber-50 border-2 border-amber-300 flex items-center justify-center shadow-inner overflow-hidden flex-shrink-0">
                <img
                  src="/assets/knowza_icon.png"
                  alt="Profil"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md border ${currentTier.color}`}>
                  {currentTier.title}
                </span>
                <h3 className="text-xl font-black text-gray-800 dark:text-gray-100 mt-0.5">{stats.eloRating} ELO</h3>
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mt-0.5">
                  Galibiyet: <span className="text-green-600 font-black">{stats.duelWins}</span> | Mağlubiyet: <span className="text-red-500 font-black">{stats.duelLosses}</span>
                </div>
              </div>
            </div>

            {/* Quick Matchmaking Button */}
            <button
              onClick={handleStartMatchmaking}
              className="w-full bg-[#ff9600] hover:bg-[#e08300] text-white font-black text-sm py-3.5 rounded-2xl border-b-4 border-[#e08300] active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 shadow-md"
            >
              <Swords className="w-4 h-4" />
              <span>HIZLI RAKİP BUL & KAPIŞ</span>
            </button>
          </div>

          {/* Viral Feature: Friend Room (Oda Kur & Odaya Katıl) - Vertical Stack on Mobile! */}
          <div className="grid grid-cols-1 gap-3.5">
            
            {/* Create Room Card */}
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-5 text-white shadow-md space-y-3 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-blue-200">
                  <Users className="w-3.5 h-3.5" />
                  Özel Oda Oluştur
                </div>
                <h3 className="text-lg font-black mt-1">Arkadaşına Meydan Oku</h3>
                <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                  Tek tıkla 4 haneli özel oda kodu oluştur. Kodu WhatsApp'tan arkadaşına gönder, anında kapışın!
                </p>
              </div>

              <button
                onClick={handleCreateRoom}
                className="w-full bg-white hover:bg-gray-100 text-blue-700 font-black py-2.5 rounded-2xl border-b-4 border-blue-200 active:border-b-0 active:translate-y-1 transition-all flex items-center justify-center gap-2 text-xs uppercase shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>ODA KUR & KOD AL</span>
              </button>
            </div>

            {/* Join Room Card */}
            <div className="bg-white dark:bg-[#1a2c35] border-2 border-gray-200 dark:border-[#2b3d45] rounded-3xl p-5 shadow-sm space-y-3 flex flex-col justify-between transition-colors duration-300">
              <div>
                <div className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-gray-400 dark:text-gray-400">
                  <KeyRound className="w-3.5 h-3.5 text-emerald-500" />
                  Mevcut Odaya Bağlan
                </div>
                <h3 className="text-lg font-black text-gray-800 dark:text-gray-100 mt-1">Oda Koduyla Katıl</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  Arkadaşının paylaştığı 4 haneli kodu girerek odasına anında bağlan.
                </p>
              </div>

              <div className="flex items-center gap-2 w-full">
                <input
                  type="text"
                  value={joinCodeInput}
                  onChange={(e) => setJoinCodeInput(e.target.value.toUpperCase())}
                  placeholder="Örn: GO-742"
                  maxLength={8}
                  className="min-w-0 flex-1 bg-gray-100 dark:bg-gray-800 border-2 border-gray-200 dark:border-[#2b3d45] rounded-2xl px-3 py-2 text-xs sm:text-sm font-black text-gray-800 dark:text-gray-100 uppercase tracking-widest text-center focus:outline-none focus:border-amber-500"
                />
                <button
                  onClick={handleJoinWithCode}
                  disabled={!joinCodeInput.trim()}
                  className="flex-shrink-0 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white font-black px-4 py-2.5 rounded-2xl border-b-4 border-emerald-700 active:border-b-0 active:translate-y-1 transition-all text-xs flex items-center gap-1 shadow-sm"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
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
                {(stats.avatar === 'haribo' || stats.avatar === 'owl' || !stats.avatar) ? <KnowzaAvatar size="sm" /> : (AVATAR_MAP[stats.avatar]?.emoji || '⚔️')}
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
                Raunt {currentRound + 1} / {activeQuestions.length} • {q.category}
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
