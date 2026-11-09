import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Mic, MicOff, Volume2, Sparkles, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';

interface SpeechExercise {
  id: string;
  category: string;
  targetSentence: string;
  translation: string;
  level: string;
}

const SPEECH_EXERCISES: SpeechExercise[] = [
  {
    id: 'sp-1',
    category: 'Günlük İngilizce',
    targetSentence: 'Nice to meet you, I am ready to learn.',
    translation: 'Tanıştığıma memnun oldum, öğrenmeye hazırım.',
    level: 'A1 - Başlangıç'
  },
  {
    id: 'sp-2',
    category: 'Akademik İngilizce',
    targetSentence: 'Knowledge is power and consistency is the key to success.',
    translation: 'Bilgi güçtür ve istikrar başarının anahtarıdır.',
    level: 'B1 - Orta'
  },
  {
    id: 'sp-3',
    category: 'Yazılım Terimleri',
    targetSentence: 'I write clean code and debug my functions every day.',
    translation: 'Her gün temiz kod yazar ve fonksiyonlarımı test ederim.',
    level: 'B2 - İleri'
  }
];

export const SpeechPractice: React.FC = () => {
  const { stats, completeLesson } = useGame();
  const [exerciseIndex, setExerciseIndex] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [accuracyScore, setAccuracyScore] = useState<number | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const currentExercise = SPEECH_EXERCISES[exerciseIndex];

  // Hear the target pronunciation
  const playNativeAudio = (text: string) => {
    sound.playClick();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Start Web Speech Recognition
  const handleToggleListening = () => {
    sound.playClick();

    // Check browser speech recognition
    const SpeechRecognition = (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).SpeechRecognition ||
                              (window as unknown as { SpeechRecognition: any; webkitSpeechRecognition: any }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tarayıcınız Web Speech API ses tanıma özelliğini desteklemiyor. Chrome veya Edge kullanabilirsiniz.');
      return;
    }

    if (isListening) {
      setIsListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setSpokenText('');
      setAccuracyScore(null);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSpokenText(transcript);
      evaluateSpeech(transcript, currentExercise.targetSentence);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      setFeedbackMsg('Ses net anlaşılamadı, lütfen tekrar mikrofona konuşun.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Evaluate accuracy score
  const evaluateSpeech = (spoken: string, target: string) => {
    const cleanSpoken = spoken.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
    const cleanTarget = target.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

    const spokenWords = cleanSpoken.split(/\s+/);
    const targetWords = cleanTarget.split(/\s+/);

    let matchCount = 0;
    targetWords.forEach(w => {
      if (spokenWords.includes(w)) matchCount++;
    });

    const score = Math.round((matchCount / targetWords.length) * 100);
    setAccuracyScore(score);

    if (score >= 70) {
      sound.playVictory();
      setFeedbackMsg(`Harika telaffuz! %${score} Başarı sağladın.`);
      confetti({ particleCount: 70, spread: 60 });
      completeLesson(currentExercise.id, 25, 5, score);
    } else {
      sound.playWrong();
      setFeedbackMsg(`Biraz daha pratik yapabilirsin (%${score}). "Dinle" butonuna basıp tekrar dene!`);
    }
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 space-y-6 pb-24 select-none">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 rounded-3xl p-6 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Web Speech API ile Canlı Ses Tanıma
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">Sesli Telaffuz & Konuşma Pratiği</h2>
          <p className="text-white/90 text-xs sm:text-sm font-semibold mt-1">
            Mikrofona konuşarak telaffuzunu anlık test et, Duolingo tarzı doğruluk puanı kazan!
          </p>
        </div>
        <div className="text-5xl animate-bounceSubtle">🎙️</div>
      </div>

      {/* Exercise Card */}
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 sm:p-8 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-6 text-center max-w-xl mx-auto animate-pop transition-colors duration-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-300 px-3 py-1 rounded-xl">
            {currentExercise.level}
          </span>
          <span className="text-xs font-bold text-gray-400 dark:text-gray-500">
            Cümle {exerciseIndex + 1} / {SPEECH_EXERCISES.length}
          </span>
        </div>

        {/* Target Sentence Display */}
        <div className="space-y-2">
          <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 leading-snug">
            "{currentExercise.targetSentence}"
          </h3>
          <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
            {currentExercise.translation}
          </p>
        </div>

        {/* Listen Button */}
        <div>
          <button
            onClick={() => playNativeAudio(currentExercise.targetSentence)}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-300 font-black text-xs px-4 py-2 rounded-xl transition-all border border-blue-200 dark:border-blue-800 active:scale-95"
          >
            <Volume2 className="w-4 h-4" />
            <span>Doğru Telaffuzu Dinle</span>
          </button>
        </div>

        {/* Microphone Big Action Button */}
        <div className="py-4">
          <button
            onClick={handleToggleListening}
            className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all shadow-xl active:scale-95 ${
              isListening
                ? 'bg-red-500 text-white animate-pulse ring-8 ring-red-200 dark:ring-red-900'
                : 'bg-[#1cb0f6] hover:bg-[#1899d6] text-white border-b-6 border-[#1899d6]'
            }`}
            title="Mikrofon ile Konuş"
          >
            {isListening ? <Mic className="w-10 h-10 animate-bounce" /> : <Mic className="w-10 h-10" />}
          </button>

          <span className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500 block mt-3">
            {isListening ? '🎙️ Seni Dinliyorum... Konuşun!' : 'Mikrofona Tıkla ve Cümleyi Oku'}
          </span>
        </div>

        {/* Spoken Result */}
        {spokenText && (
          <div className="p-4 bg-gray-50 dark:bg-[#202f36] rounded-2xl border-2 border-gray-200 dark:border-[#2b3d45] text-xs space-y-1">
            <span className="font-black text-gray-400 dark:text-gray-500 uppercase text-[10px]">Senin Söylediğin:</span>
            <div className="font-bold text-gray-800 dark:text-gray-100 text-sm">"{spokenText}"</div>
          </div>
        )}

        {/* Score & Feedback */}
        {accuracyScore !== null && (
          <div className={`p-4 rounded-2xl border-2 text-center animate-pop ${
            accuracyScore >= 70 ? 'bg-green-50 border-green-300 text-green-900' : 'bg-amber-50 border-amber-300 text-amber-900'
          }`}>
            <span className="text-xs font-black uppercase block">TELAFFUZ SKORU</span>
            <div className="text-3xl font-black mt-1">%{accuracyScore}</div>
            <p className="text-xs font-bold mt-1">{feedbackMsg}</p>
          </div>
        )}

        {/* Next Exercise Button */}
        <div className="pt-2">
          <button
            onClick={() => {
              sound.playClick();
              setExerciseIndex(i => (i + 1) % SPEECH_EXERCISES.length);
              setSpokenText('');
              setAccuracyScore(null);
              setFeedbackMsg('');
            }}
            className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-3 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all text-xs"
          >
            SONRAKİ CÜMLEYE GEÇ
          </button>
        </div>
      </div>

    </div>
  );
};
