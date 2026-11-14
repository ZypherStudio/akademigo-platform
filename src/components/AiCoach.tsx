import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  BookOpen,
  Check,
  CheckCircle2,
  Camera,
  X,
  Layers,
  CalendarCheck,
  Sliders,
  Brain,
  Zap,
  Clock,
  ChevronRight,
  KeyRound,
  Award,
} from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { AiChatMessage } from '../types';
import { KnowzaAvatar } from './KnowzaAvatar';
import {
  askGeminiCoach,
  generateFlashcardsAndQuizFromNotes,
  generateSmartStudyPlan,
  loadAiTrainingSettings,
  normalizeAiTrack,
  saveAiTrainingSettings,
  TRACK_AI_PROFILES,
  AiTeachingStyle,
  AiTrackId,
  AiTrainingSettings,
  FlashcardItem,
  GeneratedQuizQuestion,
  StudyPlanTask,
} from '../utils/geminiService';

type StudioSubTab = 'chat' | 'notes_quiz' | 'study_plan' | 'train_ai';

const TRACK_ORDER: AiTrackId[] = ['yks', 'lgs', 'kpss', 'dil', 'kodlama'];

export const AiCoach: React.FC = () => {
  const { stats, selectedCourseId, addXpAndGems } = useGame();
  const initialTrack = normalizeAiTrack(selectedCourseId);
  const [activeTrack, setActiveTrack] = useState<AiTrackId>(initialTrack);
  const [studioTab, setStudioTab] = useState<StudioSubTab>('chat');

  const profile = TRACK_AI_PROFILES[activeTrack] || TRACK_AI_PROFILES.yks;

  // ── 1. Chat & Homework Image Solver State ──
  const [messages, setMessages] = useState<AiChatMessage[]>(() => [
    {
      id: 'msg-init',
      sender: 'knowza',
      text: `Merhaba! Ben **${TRACK_AI_PROFILES[initialTrack].expertTitle}** modundaki 3D Knowza Maskot AI koçun 🐻🎓\n\nTakıldığın ödev sorusunun fotoğrafını 📷 yükleyebilir, sesli sorabilir veya konu hakkında yazabilirsin!`,
      timestamp: 'Şimdi',
      cardTip: `💡 Aktif Mod: ${TRACK_AI_PROFILES[initialTrack].badge}`,
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [pendingImage, setPendingImage] = useState<{
    previewUrl: string;
    base64: string;
    mimeType: string;
  } | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [voicePack, setVoicePack] = useState<'energetic' | 'calm' | 'fast'>(() => {
    const saved = localStorage.getItem('knowza_voice_pack');
    return saved === 'calm' || saved === 'fast' ? saved : 'energetic';
  });
  const [mascotMood, setMascotMood] = useState<'idle' | 'thinking' | 'speaking' | 'excited'>('idle');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // ── 2. Note -> Flashcards & Mini Quiz State ──
  const [noteInput, setNoteInput] = useState('');
  const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
  const [flashcards, setFlashcards] = useState<FlashcardItem[]>([]);
  const [flippedCardIds, setFlippedCardIds] = useState<Record<string, boolean>>({});
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuizQuestion[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});

  // ── 3. Smart Study Plan State ──
  const [dailyHours, setDailyHours] = useState<1 | 2 | 4>(2);
  const [focusSubject, setFocusSubject] = useState<string>(profile.subjects[0]);
  const [planTasks, setPlanTasks] = useState<StudyPlanTask[]>(() =>
    generateSmartStudyPlan(initialTrack, 2, TRACK_AI_PROFILES[initialTrack].subjects[0])
  );

  // ── 4. AI Training & Settings State ──
  const [trainingSettings, setTrainingSettings] = useState<AiTrainingSettings>(() =>
    loadAiTrainingSettings()
  );
  const [geminiApiKeyDraft, setGeminiApiKeyDraft] = useState<string>(
    () => localStorage.getItem('knowza_gemini_api_key') || ''
  );
  const [saveFeedback, setSaveFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (studioTab === 'chat') {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, studioTab]);

  // Switch Exam Track smoothly & update AI specialization
  const handleSelectTrack = (nextTrack: AiTrackId) => {
    if (nextTrack === activeTrack) return;
    sound.playClick();
    setActiveTrack(nextTrack);
    const nextProfile = TRACK_AI_PROFILES[nextTrack];
    setFocusSubject(nextProfile.subjects[0]);
    setPlanTasks(generateSmartStudyPlan(nextTrack, dailyHours, nextProfile.subjects[0]));
    setFlashcards([]);
    setGeneratedQuiz([]);
    setQuizAnswers({});

    setMessages((prev) => [
      ...prev,
      {
        id: 'sys-' + Date.now(),
        sender: 'knowza',
        text: `🔄 **${nextProfile.name}** uzmanlık moduna geçildi! Artık sadece **${nextProfile.expertTitle}** müfredatı ve soru teknikleriyle yardımcı oluyorum.`,
        timestamp: 'Şimdi',
        cardTip: nextProfile.badge,
      },
    ]);
  };

  const VOICE_PACKS = {
    energetic: { label: 'Enerjik Ayıcık', pitch: 1.16, rate: 1.04 },
    calm: { label: 'Sakin Öğretmen', pitch: 0.96, rate: 0.94 },
    fast: { label: 'Hızlı Özet', pitch: 1.04, rate: 1.24 },
  } as const;

  const cycleVoicePack = () => {
    sound.playClick();
    const order: Array<'energetic' | 'calm' | 'fast'> = ['energetic', 'calm', 'fast'];
    const next = order[(order.indexOf(voicePack) + 1) % order.length];
    setVoicePack(next);
    localStorage.setItem('knowza_voice_pack', next);
  };

  // Read message aloud using Web Speech Synthesis API with Voice Package
  const speakText = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`📸🎯📘🏛️🌍💻✨💡❓•]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLang = activeTrack === 'dil' ? 'en' : 'tr';
      utterance.lang = targetLang === 'en' ? 'en-US' : 'tr-TR';

      const voices = window.speechSynthesis.getVoices();
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLang) && /natural|google|yelda|cem|samantha/i.test(v.name)) ||
        voices.find((v) => v.lang.toLowerCase().startsWith(targetLang));
      if (matchedVoice) utterance.voice = matchedVoice;

      const pack = VOICE_PACKS[voicePack];
      utterance.pitch = pack.pitch;
      utterance.rate = pack.rate;

      utterance.onstart = () => {
        setIsSpeaking(true);
        setMascotMood('speaking');
      };
      utterance.onend = () => {
        setIsSpeaking(false);
        setMascotMood('idle');
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
        setMascotMood('idle');
      };

      window.speechSynthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setMascotMood('idle');
    }
  };

  // Voice Input
  const toggleSpeechRecognition = () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Tarayıcınız ses tanıma özelliğini desteklemiyor. Lütfen Chrome veya Safari kullanın.');
      return;
    }

    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
      setMascotMood('idle');
      return;
    }

    sound.playClick();
    const recognition = new SpeechRecognition();
    recognition.lang = 'tr-TR';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsListening(true);
      setMascotMood('thinking');
    };
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(transcript);
      handleSendMessage(transcript);
    };
    recognition.onerror = () => {
      setIsListening(false);
      setMascotMood('idle');
    };
    recognition.onend = () => {
      setIsListening(false);
      setMascotMood('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
  };

  // Homework Photo Upload Handler
  const handleImagePick = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result || '');
      const commaIdx = dataUrl.indexOf(',');
      const base64 = commaIdx >= 0 ? dataUrl.slice(commaIdx + 1) : dataUrl;
      setPendingImage({
        previewUrl: dataUrl,
        base64,
        mimeType: file.type || 'image/jpeg',
      });
      sound.playClick();
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Send Chat / Homework Message
  const handleSendMessage = async (textToSend?: string) => {
    const rawText = (textToSend ?? inputText).trim();
    if (!rawText && !pendingImage) return;
    sound.playClick();

    const displayUserText = pendingImage
      ? `${rawText || 'Bu ödev sorusunu adım adım çözüp anlatır mısın?'} [📷 Görsel Eklendi]`
      : rawText;

    const userMsg: AiChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: displayUserText,
      timestamp: 'Az önce',
    };

    const imageSnapshot = pendingImage;
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setPendingImage(null);
    setIsTyping(true);
    setMascotMood('thinking');

    const history = messages.slice(-5).map((m) => ({
      role: (m.sender === 'user' ? 'user' : 'model') as 'user' | 'model',
      parts: [{ text: m.text }],
    }));

    const result = await askGeminiCoach(rawText || 'Görseldeki ödev sorusunu çöz.', history, {
      track: activeTrack,
      imageBase64: imageSnapshot?.base64,
      imageMimeType: imageSnapshot?.mimeType,
    });

    const aiMsg: AiChatMessage = {
      id: 'ai-' + Date.now(),
      sender: 'knowza',
      text: result.text,
      timestamp: 'Şimdi',
      cardTip: `${profile.shortName} • Adım Adım Koçluk`,
    };

    setIsTyping(false);
    setMessages((prev) => [...prev, aiMsg]);
    setMascotMood('excited');
    if (voiceEnabled) speakText(result.text);
  };

  // Generate Flashcards & Mini Quiz from Notes
  const handleGenerateFromNotes = async () => {
    const sourceText = noteInput.trim() || profile.sampleNoteText;
    if (!noteInput.trim()) {
      setNoteInput(profile.sampleNoteText);
    }

    sound.playClick();
    setIsGeneratingNotes(true);
    setMascotMood('thinking');

    const res = await generateFlashcardsAndQuizFromNotes(sourceText, activeTrack);
    setFlashcards(res.flashcards);
    setGeneratedQuiz(res.quiz);
    setFlippedCardIds({});
    setQuizAnswers({});
    setIsGeneratingNotes(false);
    setMascotMood('excited');
    sound.playCorrect();
  };

  const handleAnswerGeneratedQuiz = (questionId: string, optionIdx: number, correctIdx: number) => {
    if (quizAnswers[questionId] !== undefined) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIdx }));
    if (optionIdx === correctIdx) {
      sound.playCorrect();
      addXpAndGems(15, 2);
    } else {
      sound.playWrong();
    }
  };

  // Study Plan Task Toggle
  const handleTogglePlanTask = (taskId: string) => {
    setPlanTasks((prev) => {
      const updated = prev.map((t) => {
        if (t.id !== taskId) return t;
        const nextDone = !t.completed;
        if (nextDone) {
          sound.playCorrect();
          addXpAndGems(t.xpReward, 3);
        } else {
          sound.playClick();
        }
        return { ...t, completed: nextDone };
      });
      if (updated.length > 0 && updated.every((t) => t.completed)) {
        sound.playVictory();
        confetti({ particleCount: 70, spread: 65 });
      }
      return updated;
    });
  };

  const handleRebuildPlan = (hours: 1 | 2 | 4, subject: string) => {
    sound.playClick();
    setDailyHours(hours);
    setFocusSubject(subject);
    setPlanTasks(generateSmartStudyPlan(activeTrack, hours, subject));
  };

  // Save AI Training Preferences
  const handleSaveTraining = () => {
    sound.playCorrect();
    saveAiTrainingSettings(trainingSettings);
    if (geminiApiKeyDraft.trim()) {
      localStorage.setItem('knowza_gemini_api_key', geminiApiKeyDraft.trim());
    } else {
      localStorage.removeItem('knowza_gemini_api_key');
    }
    setSaveFeedback('✅ AI Koç eğitimi ve ayarların kaydedildi!');
    setTimeout(() => setSaveFeedback(null), 2600);
  };

  const completedPlanCount = planTasks.filter((t) => t.completed).length;
  const planProgressPct = planTasks.length > 0 ? Math.round((completedPlanCount / planTasks.length) * 100) : 0;

  const mascotImage =
    mascotMood === 'thinking'
      ? '/assets/knowza_thinking.png'
      : mascotMood === 'excited'
      ? '/assets/knowza_cheering.png'
      : studioTab === 'notes_quiz'
      ? '/assets/knowza_reading.png'
      : '/assets/knowza_avatar_3d.png';

  return (
    <div className="w-full max-w-md mx-auto flex flex-col gap-3 px-3 pt-2 pb-6 select-none animate-fade">
      {/* ================= 1. MOBILE HERO MASCOT AI CARD ================= */}
      <div className={`bg-gradient-to-br ${profile.accentGradient} rounded-[28px] p-3.5 text-white shadow-lg relative overflow-hidden`}>
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none" />

        <div className="flex items-center justify-between gap-2.5 relative z-10">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex-shrink-0">
              <KnowzaAvatar
                size="lg"
                animate={
                  mascotMood === 'excited'
                    ? 'dance'
                    : mascotMood === 'thinking'
                    ? 'wiggle'
                    : 'bounce'
                }
                speaking={isSpeaking || mascotMood === 'speaking'}
                costume={stats.selectedCostume}
                frameId={stats.equippedAvatarFrame ?? 'none'}
                customBear={stats.customBear}
              />
            </div>

            <div className="min-w-0">
              <div className="inline-flex items-center gap-1 bg-black/25 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wide mb-0.5">
                <Sparkles className="w-2.5 h-2.5 text-yellow-300" />
                <span>{profile.badge}</span>
              </div>
              <h2 className="text-sm font-black leading-tight truncate">
                Knowza Ayıcık Koçun
              </h2>
              <p className="text-[10px] font-bold text-white/90 truncate">
                {mascotMood === 'thinking'
                  ? '🤔 Sorunu inceliyor...'
                  : mascotMood === 'speaking'
                  ? '🔊 Sesli anlatıyor...'
                  : profile.expertTitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={cycleVoicePack}
              className="px-2 py-1.5 rounded-xl bg-black/20 hover:bg-black/30 border border-white/20 text-[9px] font-black whitespace-nowrap transition active:scale-95"
              title="Ses Paketini Değiştir"
            >
              🎙️ {VOICE_PACKS[voicePack].label}
            </button>
            <button
              onClick={() => {
                sound.playClick();
                if (isSpeaking) stopSpeaking();
                setVoiceEnabled((v) => !v);
              }}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 border border-white/25 flex items-center justify-center flex-shrink-0 transition active:scale-95"
              title={voiceEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 opacity-70" />}
            </button>
          </div>
        </div>

        {/* Exam Track Specialization Switcher (TYT, LGS, KPSS, EN, KOD) */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
          {TRACK_ORDER.map((tId) => {
            const p = TRACK_AI_PROFILES[tId];
            const isSel = activeTrack === tId;
            return (
              <button
                key={tId}
                onClick={() => handleSelectTrack(tId)}
                className={`px-2.5 py-1 rounded-xl text-[10px] font-black whitespace-nowrap transition-all ${
                  isSel
                    ? 'bg-white text-slate-900 shadow-sm scale-[1.02]'
                    : 'bg-black/20 text-white/90 hover:bg-black/30'
                }`}
              >
                {p.shortName}
              </button>
            );
          })}
        </div>
      </div>

      {/* ================= 2. 4-TAB MOBILE STUDIO NAVIGATION ================= */}
      <div className="grid grid-cols-4 gap-1 bg-white p-1 rounded-2xl border border-[#F2E8D5] shadow-xs">
        {(
          [
            { id: 'chat', label: 'Soru & Foto', icon: Camera },
            { id: 'notes_quiz', label: 'Not → Quiz', icon: Layers },
            { id: 'study_plan', label: 'Planım', icon: CalendarCheck },
            { id: 'train_ai', label: 'Koç Ayarı', icon: Sliders },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const isActive = studioTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setStudioTab(tab.id);
              }}
              className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center gap-0.5 transition-all ${
                isActive
                  ? 'bg-[#FFB800] text-[#2A1E00] shadow-xs font-black'
                  : 'text-slate-500 hover:bg-amber-50 font-bold'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[10px] leading-tight truncate max-w-full">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ================= TAB 1: ÖDEV ÇÖZÜM & SOHBET ================= */}
      {studioTab === 'chat' && (
        <div className="flex flex-col gap-2.5">
          {/* Quick Track-Specific Prompts */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {profile.quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                className="flex-shrink-0 bg-white hover:bg-amber-50 border border-amber-200 text-slate-800 text-[10px] font-bold px-3 py-1.5 rounded-full shadow-2xs transition active:scale-95"
              >
                ✨ {q}
              </button>
            ))}
          </div>

          {/* Chat Container (Mobile Portrait Sized) */}
          <div className="bg-white rounded-3xl border border-[#F2E8D5] shadow-sm flex flex-col h-[52dvh] min-h-[340px] max-h-[460px] overflow-hidden">
            {/* Sub-header */}
            <div className="px-3.5 py-2 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between text-[10px] font-black text-amber-900">
              <span>{profile.name} • Adım Adım Ödev Asistanı</span>
              <button
                onClick={() => {
                  sound.playClick();
                  stopSpeaking();
                  setMessages([
                    {
                      id: 'msg-reset-' + Date.now(),
                      sender: 'knowza',
                      text: `Sohbet temizlendi! **${profile.name}** için yeni soru fotoğrafını veya metnini bekliyorum 🐻✨`,
                      timestamp: 'Şimdi',
                      cardTip: profile.badge,
                    },
                  ]);
                }}
                className="flex items-center gap-1 text-amber-700 hover:text-amber-950"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sıfırla</span>
              </button>
            </div>

            {/* Messages Scroll Area */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3 no-scrollbar">
              {messages.map((msg) => {
                const isAi = msg.sender === 'knowza';
                return (
                  <div key={msg.id} className={`flex flex-col ${isAi ? 'items-start' : 'items-end'}`}>
                    <div
                      className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                        isAi
                          ? 'bg-[#FFF9EB] text-slate-800 border border-amber-200/80 rounded-tl-sm'
                          : 'bg-gradient-to-r from-[#FFB800] to-[#FFA000] text-[#2A1E00] font-bold rounded-tr-sm shadow-xs'
                      }`}
                    >
                      {msg.text}
                      {isAi && (
                        <div className="mt-2 pt-1.5 border-t border-amber-200/60 flex items-center justify-between gap-2 text-[10px] font-black text-amber-800">
                          <span>{msg.cardTip || '🐻 Knowza Koç'}</span>
                          <button
                            onClick={() => (isSpeaking ? stopSpeaking() : speakText(msg.text))}
                            className="px-2 py-0.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 inline-flex items-center gap-1"
                            title={isSpeaking ? 'Durdur' : 'Sesli Dinle'}
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{isSpeaking ? 'Durdur' : 'Dinle'}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {isTyping && (
                <div className="flex items-center gap-2 text-[11px] font-bold text-amber-700 bg-amber-50 px-3 py-2 rounded-2xl w-fit">
                  <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-500" />
                  <span>{profile.shortName} uzmanı düşünüyor...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Pending Homework Photo Preview */}
            {pendingImage && (
              <div className="px-3 py-2 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <img
                    src={pendingImage.previewUrl}
                    alt="Ödev Fotoğrafı"
                    className="w-10 h-10 rounded-xl object-cover border border-amber-300"
                  />
                  <span className="text-[11px] font-black text-slate-700 truncate">
                    📷 Ödev fotoğrafı çözüme hazır
                  </span>
                </div>
                <button
                  onClick={() => setPendingImage(null)}
                  className="p-1 rounded-lg bg-rose-100 text-rose-700"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="p-2.5 bg-white border-t border-slate-100 flex items-center gap-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleImagePick}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-9 h-9 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 flex items-center justify-center flex-shrink-0 transition active:scale-95"
                title="Ödev Fotoğrafı Yükle / Çek"
              >
                <Camera className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={toggleSpeechRecognition}
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition active:scale-95 ${
                  isListening
                    ? 'bg-rose-500 text-white animate-pulse'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
                title="Sesli Sor"
              >
                {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendMessage();
                }}
                placeholder={`${profile.shortName} sorusu yaz veya 📷 çek...`}
                className="flex-1 min-w-0 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-[#FFB800]"
              />

              <button
                type="button"
                onClick={() => handleSendMessage()}
                disabled={isTyping || (!inputText.trim() && !pendingImage)}
                className="w-9 h-9 rounded-xl bg-[#FFB800] hover:brightness-105 disabled:opacity-40 text-[#2A1E00] flex items-center justify-center flex-shrink-0 transition active:scale-95"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= TAB 2: NOT / METİN -> OTOMATİK QUIZ & FLASHCARD ================= */}
      {studioTab === 'notes_quiz' && (
        <div className="space-y-3 animate-fade">
          <div className="bg-white rounded-3xl p-4 border border-[#F2E8D5] shadow-sm space-y-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <h3 className="text-xs font-black text-slate-900">
                  Ders Notunu Yapıştır → Kart & Quiz Üret
                </h3>
              </div>
              <button
                onClick={() => {
                  sound.playClick();
                  setNoteInput(profile.sampleNoteText);
                }}
                className="text-[10px] font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full hover:bg-amber-200 transition"
              >
                Örnek {profile.shortName} Notu
              </button>
            </div>

            <textarea
              rows={4}
              value={noteInput}
              onChange={(e) => setNoteInput(e.target.value)}
              placeholder={`${profile.sampleNoteTitle} veya kendi defter notunu buraya yapıştır...`}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-[#FFB800]"
            />

            <button
              onClick={handleGenerateFromNotes}
              disabled={isGeneratingNotes}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#FFC700] to-[#FFA000] text-[#2A1E00] font-black text-xs shadow-sm border-b-4 border-[#D99000] active:border-b-0 active:translate-y-0.5 transition flex items-center justify-center gap-2"
            >
              <Sparkles className={`w-4 h-4 ${isGeneratingNotes ? 'animate-spin' : ''}`} />
              <span>
                {isGeneratingNotes
                  ? 'Bilgi Kartları & Test Üretiliyor...'
                  : `${profile.shortName} Kartları & Mini Quiz Üret ✨`}
              </span>
            </button>
          </div>

          {/* Interactive Flip Flashcards */}
          {flashcards.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black text-slate-700 uppercase">
                  🃏 Akıllı Bilgi Kartları (Çevirmek için dokun)
                </span>
                <span className="text-[10px] font-bold text-amber-700">{flashcards.length} Kart</span>
              </div>

              <div className="space-y-2">
                {flashcards.map((card) => {
                  const isFlipped = Boolean(flippedCardIds[card.id]);
                  return (
                    <button
                      key={card.id}
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        setFlippedCardIds((prev) => ({ ...prev, [card.id]: !prev[card.id] }));
                      }}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all active:scale-[0.99] ${
                        isFlipped
                          ? 'bg-emerald-50 border-emerald-300 shadow-xs'
                          : 'bg-white border-amber-200 shadow-sm hover:border-amber-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isFlipped ? 'bg-emerald-200 text-emerald-900' : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {isFlipped ? '✅ Cevap & Kural' : '❓ Soru / Kavram'}
                        </span>
                        <span className="text-[10px] font-bold text-slate-400">{card.tip}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-900 leading-relaxed">
                        {isFlipped ? card.back : card.front}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Interactive Generated Quiz */}
          {generatedQuiz.length > 0 && (
            <div className="space-y-2.5 pt-1">
              <div className="flex items-center justify-between px-1">
                <span className="text-[11px] font-black text-slate-700 uppercase">
                  📝 Otomatik Mini Quiz (+15 XP / Doğru)
                </span>
              </div>

              {generatedQuiz.map((q, qIdx) => {
                const picked = quizAnswers[q.id];
                const isAnswered = picked !== undefined;
                return (
                  <div key={q.id} className="bg-white rounded-3xl p-4 border border-[#F2E8D5] shadow-sm space-y-2.5">
                    <p className="text-xs font-black text-slate-900 leading-snug">
                      {qIdx + 1}. {q.question}
                    </p>
                    <div className="space-y-1.5">
                      {q.options.map((opt, oIdx) => {
                        const isPicked = picked === oIdx;
                        const isCorrect = oIdx === q.correctIndex;
                        let btnStyle = 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-amber-50';
                        if (isAnswered) {
                          if (isCorrect) {
                            btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-black';
                          } else if (isPicked) {
                            btnStyle = 'bg-rose-100 border-rose-500 text-rose-950 font-black';
                          } else {
                            btnStyle = 'bg-slate-50 border-slate-200 text-slate-400';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleAnswerGeneratedQuiz(q.id, oIdx, q.correctIndex)}
                            className={`w-full text-left px-3 py-2 rounded-xl border text-xs font-bold transition flex items-center justify-between gap-2 ${btnStyle}`}
                          >
                            <span>{opt}</span>
                            {isAnswered && isCorrect && <Check className="w-4 h-4 text-emerald-700 flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                    {isAnswered && (
                      <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] font-bold text-amber-950">
                        💡 {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= TAB 3: GÜNLÜK AKILLI ÖDEV & ÇALIŞMA PLANI ================= */}
      {studioTab === 'study_plan' && (
        <div className="space-y-3 animate-fade">
          <div className="bg-white rounded-3xl p-4 border border-[#F2E8D5] shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-black text-slate-900">
                  {profile.name} • Günlük Akıllı Plan
                </h3>
                <p className="text-[10px] font-bold text-slate-500">
                  Süre ve odak dersini seç, görevleri tamamlayıp XP kazan!
                </p>
              </div>
              <span className="text-xs font-black text-amber-700 bg-amber-100 px-2.5 py-1 rounded-full">
                %{planProgressPct}
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#FFC700] to-emerald-500 rounded-full transition-all duration-300"
                style={{ width: `${planProgressPct}%` }}
              />
            </div>

            {/* Duration Selector */}
            <div className="flex items-center gap-1.5">
              {([1, 2, 4] as const).map((hrs) => (
                <button
                  key={hrs}
                  onClick={() => handleRebuildPlan(hrs, focusSubject)}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-black border transition ${
                    dailyHours === hrs
                      ? 'bg-[#2A1E00] text-amber-300 border-[#2A1E00]'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  ⏱️ {hrs} Saat
                </button>
              ))}
            </div>

            {/* Subject Selector */}
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
              {profile.subjects.map((subj) => (
                <button
                  key={subj}
                  onClick={() => handleRebuildPlan(dailyHours, subj)}
                  className={`px-2.5 py-1 rounded-xl text-[10px] font-black whitespace-nowrap border transition ${
                    focusSubject === subj
                      ? 'bg-amber-100 text-amber-900 border-amber-400'
                      : 'bg-white text-slate-600 border-slate-200'
                  }`}
                >
                  {subj}
                </button>
              ))}
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-2">
            {planTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => handleTogglePlanTask(task.id)}
                className={`w-full text-left p-3.5 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                  task.completed
                    ? 'bg-emerald-50/80 border-emerald-300 opacity-85'
                    : 'bg-white border-[#F2E8D5] hover:border-[#FFB800] shadow-xs'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition ${
                    task.completed
                      ? 'bg-emerald-500 border-emerald-500 text-white'
                      : 'border-amber-300 bg-amber-50'
                  }`}
                >
                  {task.completed && <Check className="w-4 h-4 stroke-[3]" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                      {task.tag}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-0.5">
                      <Clock className="w-2.5 h-2.5" /> {task.durationMin} dk
                    </span>
                  </div>
                  <p
                    className={`text-xs font-black leading-snug ${
                      task.completed ? 'line-through text-slate-500' : 'text-slate-900'
                    }`}
                  >
                    {task.title}
                  </p>
                </div>

                <span className="text-[10px] font-black text-amber-700 bg-amber-50 px-2 py-1 rounded-xl border border-amber-200 flex-shrink-0">
                  +{task.xpReward} XP
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================= TAB 4: AI KOÇU EĞİT & KİŞİSELLEŞTİR ================= */}
      {studioTab === 'train_ai' && (
        <div className="space-y-3 animate-fade">
          <div className="bg-white rounded-3xl p-4 border border-[#F2E8D5] shadow-sm space-y-3.5">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-amber-600" />
              <h3 className="text-xs font-black text-slate-900">
                Maskot AI Koçunu Kendi Tarzına Göre Eğit
              </h3>
            </div>

            {/* Teaching Style */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-black uppercase text-slate-500 block">
                Anlatım & Koçluk Tarzı
              </span>
              <div className="grid grid-cols-1 gap-1.5">
                {(
                  [
                    {
                      id: 'step_by_step' as AiTeachingStyle,
                      title: '🎓 Sabırlı Öğretmen (Adım Adım)',
                      desc: 'Konuyu hiç bilmeyen birine sıfırdan tane tane anlatır.',
                    },
                    {
                      id: 'fast_tactic' as AiTeachingStyle,
                      title: '⚡ Hızlı Sınav Taktiği & Hap Bilgi',
                      desc: 'Uzun metin yok; direkt net kazandıran kısa formül ve ipucu.',
                    },
                    {
                      id: 'strict_coach' as AiTeachingStyle,
                      title: '🔥 Disiplinli Sınav Koçu',
                      desc: 'Seni zorlar, kontrol soruları sorar ve yüksek tempo kurar.',
                    },
                  ]
                ).map((style) => {
                  const isSel = trainingSettings.teachingStyle === style.id;
                  return (
                    <button
                      key={style.id}
                      onClick={() => {
                        sound.playClick();
                        setTrainingSettings((prev) => ({ ...prev, teachingStyle: style.id }));
                      }}
                      className={`p-2.5 rounded-2xl border text-left transition ${
                        isSel
                          ? 'bg-amber-50 border-[#FFB800] ring-1 ring-[#FFB800]'
                          : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <span className="text-xs font-black text-slate-900 block">{style.title}</span>
                      <span className="text-[10px] font-bold text-slate-500 block mt-0.5">{style.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Toggles */}
            <div className="space-y-2 pt-1">
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <span className="text-xs font-bold text-slate-800">📐 Formül & Hafıza Kodlaması Ekle</span>
                <input
                  type="checkbox"
                  checked={trainingSettings.includeFormulas}
                  onChange={(e) =>
                    setTrainingSettings((prev) => ({ ...prev, includeFormulas: e.target.checked }))
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </label>
              <label className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer">
                <span className="text-xs font-bold text-slate-800">❓ Her Cevap Sonunda Kontrol Sorusu Sor</span>
                <input
                  type="checkbox"
                  checked={trainingSettings.askFollowUpQuestion}
                  onChange={(e) =>
                    setTrainingSettings((prev) => ({ ...prev, askFollowUpQuestion: e.target.checked }))
                  }
                  className="w-4 h-4 accent-amber-500"
                />
              </label>
            </div>

            {/* Custom Training Instructions */}
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500 block">
                Özel Eğitim Talimatı (İsteğe Bağlı)
              </span>
              <textarea
                rows={2}
                value={trainingSettings.customInstructions}
                onChange={(e) =>
                  setTrainingSettings((prev) => ({ ...prev, customInstructions: e.target.value }))
                }
                placeholder="Örn: Sayısal problemlerde bana önce ipucu ver, hemen cevabı söyleme."
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-[#FFB800]"
              />
            </div>

            {/* Optional Gemini API Key */}
            <div className="space-y-1 pt-1 border-t border-slate-100">
              <span className="text-[10px] font-black uppercase text-slate-500 flex items-center gap-1">
                <KeyRound className="w-3 h-3 text-amber-600" />
                Google Gemini API Anahtarı (Fotoğraflı OCR Çözüm İçin)
              </span>
              <input
                type="password"
                value={geminiApiKeyDraft}
                onChange={(e) => setGeminiApiKeyDraft(e.target.value)}
                placeholder="AIzaSy... (İsteğe bağlı, cihazında saklanır)"
                className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-mono text-slate-800 outline-none focus:border-[#FFB800]"
              />
            </div>

            <button
              onClick={handleSaveTraining}
              className="w-full py-3 rounded-2xl bg-[#2A1E00] hover:bg-slate-900 text-amber-300 font-black text-xs transition flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>AI Koç Eğitimini Kaydet</span>
            </button>

            {saveFeedback && (
              <p className="text-center text-xs font-black text-emerald-600 animate-pop">{saveFeedback}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
