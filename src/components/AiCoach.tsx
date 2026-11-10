import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import {
  Bot,
  Send,
  Sparkles,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  BookOpen,
  Check,
  Brain,
  Zap,
  Lightbulb
} from 'lucide-react';
import { sound } from '../utils/audio';
import { AiChatMessage } from '../types';

const INITIAL_MESSAGES: AiChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'knowza',
    text: 'Merhaba! Ben senin yapay zeka çalışma koçun Knowza 3D Ayıcık 🎓✨! TYT, KPSS, LGS, YDS veya Python kodlama ile ilgili aklına takılan her soruyu bana sorabilir veya sesli konuşabilirsin!',
    timestamp: 'Şimdi',
    cardTip: '💡 İpucu: Mikrofon butonuna basarak sesli soru sorabilir ya da hızlı butonları deneyebilirsin!'
  }
];

const QUICK_PROMPTS = [
  'Matematik temelim zayıf, nereden başlamalıyım?',
  'Bana TYT yeni nesil tek-çift sayı sorusu sor ve test et!',
  'Bugün için bana 2 saatlik verimli ders çalışma programı hazırla.',
  'Paragraf sorularında hızımı nasıl artırırım?',
  'Python\'da fonksiyonlar ve döngüler nasıl çalışır?'
];

export const AiCoach: React.FC = () => {
  const { stats } = useGame();
  const [messages, setMessages] = useState<AiChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [mascotMood, setMascotMood] = useState<'idle' | 'thinking' | 'speaking' | 'excited'>('idle');

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Read message aloud using Web Speech Synthesis API
  const speakText = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      const cleanText = text.replace(/[*_#`]/g, '');
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.05;

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

  // Voice Input (Speech to Text)
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

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputText).trim();
    if (!text) return;
    sound.playClick();

    const userMsg: AiChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      text: text,
      timestamp: 'Az önce'
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);
    setMascotMood('thinking');

    // AI intelligent tutor response simulation
    setTimeout(() => {
      setIsTyping(false);
      sound.playVictory();

      let replyText = '';
      let tip = '';

      const lower = text.toLowerCase();
      if (lower.includes('matematik') || lower.includes('temel')) {
        replyText =
          'Harika bir soru! Matematik temeli atarken ilk kural formül ezberlemek değil, "sayıların mantığını" kavramaktır. Öncelikle Tek-Çift sayılar ve Temel İşlem Önceliğini pekiştir, ardından her gün 15 adet yeni nesil problem çöz. Günde 15 soru 1 ayda 450 soru demektir!';
        tip = '💡 Taktik: Gauss Toplam Formülü: [n × (n + 1)] / 2 hayat kurtarır!';
      } else if (lower.includes('soru sor') || lower.includes('test et')) {
        replyText =
          'Hemen bir soru soruyorum: "a ve b pozitif tam sayılardır. 4a + 7b toplamı TEK sayı olduğuna göre, b sayısı hakkında kesinlikle ne söylenebilir?" (İpucu: 4a terimi daima çift midir?)';
        tip = '🎯 Cevabını bekliyorum!';
      } else if (lower.includes('program') || lower.includes('çalışma')) {
        replyText =
          'İşte senin için 2 saatlik Şampiyonluk Çalışma Planı:\n1. 25 Dk: TYT Matematik Soru Çözümü (15 Soru)\n2. 5 Dk Mola (Su iç & nefes al)\n3. 25 Dk: Paragraf Taktikleri & Hızlı Okuma (12 Soru)\n4. 5 Dk Mola\n5. 50 Dk Derin Odak: Kodlama veya KPSS Güncel Bilgiler';
        tip = '⚡ İstikrarlı çalışmak zekadan daha üstündür!';
      } else if (lower.includes('paragraf') || lower.includes('hız')) {
        replyText =
          'Paragrafı hızlandırmanın 1 numaralı kuralı "Önce Soru Kökünü Okumak"tır! Soru kökündeki olumsuz ifadelerin altını mutlaka çiz. Ardından ilk ve son 2 cümleye odaklanarak ana fikri yakala.';
        tip = '📖 Günde 20 paragraf çözmeyi günlük serin haline getir.';
      } else if (lower.includes('python') || lower.includes('kod')) {
        replyText =
          'Python\'da fonksiyonlar "def fonksiyon_adi(parametre):" şeklinde tanımlanır. Döngüler ise "for i in range(sayi):" kalıbıyla belirli sayıda işlemi otomatik tekrar eder. Kod Lab sekmemizde bunu hemen canlı deneyebilirsin!';
        tip = '💻 Kod Lab sekmesinde interaktif Python konsolun seni bekliyor.';
      } else {
        replyText = `Bu harika bir konu! Sınav hazırlığında ve yeni beceriler öğrenirken en önemli şey sürekliliktir. Knowza ile her gün en az 1 ders tamamlamak seni rakiplerinin çok önüne taşır. Başka aklına takılan bir konu var mı?`;
        tip = '🎓 Knowza 3D Ayıcık her zaman yanında!';
      }

      const aiMsg: AiChatMessage = {
        id: 'knowza-' + Date.now(),
        sender: 'knowza',
        text: replyText,
        timestamp: 'Şimdi',
        cardTip: tip
      };

      setMessages((prev) => [...prev, aiMsg]);
      speakText(replyText);
    }, 1200);
  };

  // Determine which 3D mascot asset to render based on active mood
  const getMascotAsset = () => {
    if (mascotMood === 'thinking') return '/assets/knowza_thinking.png';
    if (mascotMood === 'speaking' || mascotMood === 'excited') return '/assets/knowza_cheering.png';
    return '/assets/knowza_main.png';
  };

  return (
    <div className="flex-1 max-w-md mx-auto py-3 px-3 space-y-4 pb-28 select-none flex flex-col h-[calc(100vh-80px)]">
      {/* Interactive Mascot Stage Header */}
      <div className="bg-gradient-to-r from-[#FFF4DB] via-[#FFEAB8] to-[#FFDE8A] rounded-3xl p-4 border-2 border-amber-300 shadow-sm relative overflow-hidden flex items-center justify-between">
        {/* Left Side: Title & Status */}
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-1.5 bg-[#FFB800] text-slate-900 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Canlı Sesli AI Koç
          </div>
          <h2 className="text-lg font-black text-slate-900">Knowza 3D Koç</h2>
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            {isTyping ? (
              <span className="flex items-center gap-1 text-amber-800 animate-pulse">
                <Brain className="w-3.5 h-3.5" />
                Düşünüyor...
              </span>
            ) : isSpeaking ? (
              <span className="flex items-center gap-1 text-emerald-800 font-extrabold animate-bounce">
                <Volume2 className="w-3.5 h-3.5" />
                Sesli Anlatıyor...
              </span>
            ) : isListening ? (
              <span className="flex items-center gap-1 text-rose-700 font-extrabold animate-pulse">
                <Mic className="w-3.5 h-3.5" />
                Seni Dinliyor...
              </span>
            ) : (
              <span>Her sorunu yanıtlamaya hazır! 🐾</span>
            )}
          </div>
        </div>

        {/* Right Side: Animated 3D Mascot Character */}
        <div
          onClick={() => {
            sound.playVictory();
            setMascotMood('excited');
            speakText('Harikasın! Hadi bana aklına takılan herhangi bir konuyu sor!');
          }}
          className="relative w-20 h-20 cursor-pointer active:scale-95 transition-transform duration-200 group flex items-center justify-center"
          title="Ayıcığa tıkla ve konuşsun!"
        >
          {/* Animated Glow Halo */}
          {(isSpeaking || isTyping) && (
            <div className="absolute inset-0 bg-amber-400/40 rounded-full blur-md animate-ping" />
          )}

          <img
            src={getMascotAsset()}
            alt="Knowza AI Koç"
            className={`w-full h-full object-contain filter drop-shadow-md transition-all duration-300 ${
              isSpeaking
                ? 'animate-dance scale-110'
                : isTyping
                ? 'animate-bounceSubtle'
                : 'animate-float'
            }`}
          />
        </div>

        {/* Audio Mute/Unmute Pill */}
        <button
          onClick={() => {
            if (isSpeaking) stopSpeaking();
            setVoiceEnabled(!voiceEnabled);
            sound.playClick();
          }}
          className={`absolute top-3 right-3 p-1.5 rounded-full transition shadow-sm ${
            voiceEnabled
              ? 'bg-[#FFB800] text-slate-900'
              : 'bg-white/80 text-slate-400 hover:text-slate-700'
          }`}
          title={voiceEnabled ? 'Sesli Okuma Açık' : 'Sesi Kapat'}
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>
      </div>

      {/* Chat Messages Area */}
      <div className="flex-1 bg-white rounded-3xl p-4 border border-amber-100 shadow-sm overflow-y-auto space-y-3.5">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} animate-fade`}
            >
              <div className="flex items-end gap-2 max-w-[88%]">
                {!isUser && (
                  <div className="w-8 h-8 rounded-full border border-amber-300 bg-amber-50 p-0.5 overflow-hidden flex-shrink-0">
                    <img
                      src="/assets/knowza_icon.png"
                      alt="Knowza"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                )}

                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm font-semibold leading-relaxed shadow-sm ${
                    isUser
                      ? 'bg-gradient-to-r from-amber-500 to-[#FFB800] text-slate-950 font-bold rounded-br-none'
                      : 'bg-[#FFFDF7] border border-amber-200/80 text-slate-800 rounded-bl-none whitespace-pre-line'
                  }`}
                >
                  {msg.text}

                  {/* Speech Button for AI Replies */}
                  {!isUser && (
                    <div className="mt-2 pt-2 border-t border-amber-200/60 flex items-center justify-between">
                      <button
                        onClick={() => speakText(msg.text)}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 hover:text-amber-950 transition"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Sesli Dinle</span>
                      </button>
                      <span className="text-[10px] text-slate-400 font-mono">{msg.timestamp}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Extra Educational Card Tip */}
              {msg.cardTip && (
                <div className="mt-1.5 ml-10 max-w-[80%] bg-amber-50/90 border border-amber-200 text-amber-950 text-[11px] font-bold p-2.5 rounded-xl shadow-xs">
                  {msg.cardTip}
                </div>
              )}
            </div>
          );
        })}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold animate-pulse pl-10">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
            <span>Knowza Ayıcık formül ve taktiği hazırlıyor...</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Quick Prompts Carousel */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(prompt)}
            className="px-3 py-1.5 bg-white hover:bg-amber-50 border border-amber-200 rounded-xl text-xs font-bold text-slate-700 whitespace-nowrap shadow-xs active:scale-95 transition"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Voice & Text Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2"
      >
        {/* Microphone Button */}
        <button
          type="button"
          onClick={toggleSpeechRecognition}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition shadow-md active:scale-95 ${
            isListening
              ? 'bg-rose-500 text-white animate-pulse ring-4 ring-rose-200'
              : 'bg-white hover:bg-amber-50 text-amber-700 border border-amber-200'
          }`}
          title={isListening ? 'Dinlemeyi Durdur' : 'Sesli Soru Sor'}
        >
          {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder={isListening ? 'Seni dinliyorum...' : 'Knowza\'ya bir soru sor veya taktik iste...'}
          className="flex-1 bg-white border-2 border-amber-200 focus:border-[#FFB800] rounded-2xl px-4 py-3 text-xs sm:text-sm font-semibold outline-none shadow-sm text-slate-800"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="w-12 h-12 rounded-2xl bg-[#FFB800] hover:bg-[#FFA500] disabled:opacity-40 text-slate-900 flex items-center justify-center shadow-md active:scale-95 transition"
        >
          <Send className="w-5 h-5 fill-slate-900" />
        </button>
      </form>
    </div>
  );
};
