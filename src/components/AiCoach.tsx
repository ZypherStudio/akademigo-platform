import React, { useState, useRef, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Bot, Send, Sparkles, Volume2, VolumeX, Lightbulb, RotateCcw, BookOpen, Check } from 'lucide-react';
import { sound } from '../utils/audio';
import { Mascot } from './Mascot';
import { HariboAvatar } from './HariboAvatar';
import { AiChatMessage } from '../types';

const INITIAL_MESSAGES: AiChatMessage[] = [
  {
    id: 'msg-1',
    sender: 'bibo',
    text: 'Merhaba! Ben senin sevimli çalışma koçun Haribo Altın Ayıcık 🍯✨! TYT, KPSS, LGS veya Kodlama ile ilgili aklına takılan her soruyu, formülü veya sınav stratejisini bana sorabilirsin!',
    timestamp: 'Şimdi',
    cardTip: '💡 İpucu: Aşağıdaki hızlı soru butonlarına basarak hemen pratik başlatabilirsin!'
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
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Read message aloud using Web Speech Synthesis API
  const speakText = (text: string) => {
    if ('speechSynthesis' in window && voiceEnabled) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'tr-TR';
      utterance.rate = 1.05;
      window.speechSynthesis.speak(utterance);
    }
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

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsTyping(true);

    // AI intelligent tutor response simulation (Powered by educational knowledge base)
    setTimeout(() => {
      setIsTyping(false);
      sound.playVictory();

      let replyText = '';
      let tip = '';

      const lower = text.toLowerCase();
      if (lower.includes('matematik') || lower.includes('temel')) {
        replyText = 'Harika bir soru! Matematik temeli atarken ilk kural formül ezberlemek değil, "sayıların mantığını" kavramaktır. Öncelikle Tek-Çift sayılar ve Temel İşlem Önceliğini pekiştir, ardından her gün 15 adet yeni nesil problem çöz. Günde 15 soru 1 ayda 450 soru demektir!';
        tip = '💡 Taktik: Gauss Toplam Formülü: [n × (n + 1)] / 2 hayat kurtarır!';
      } else if (lower.includes('soru sor') || lower.includes('test et')) {
        replyText = 'Hemen bir soru soruyorum: "a ve b pozitif tam sayılardır. 4a + 7b toplamı TEK sayı olduğuna göre, b sayısı hakkında ne söyleyebilirsin?" (İpucu: 4a terimi çift midir?)';
        tip = '🎯 Cevabını bekliyorum!';
      } else if (lower.includes('program') || lower.includes('çalışma')) {
        replyText = 'İşte senin için 2 saatlik Pomodoro Şampiyonluk Planı:\n1. 25 Dk: TYT Matematik / Yeni Nesil Soru Çözümü (15 Soru)\n2. 5 Dk Mola (Su iç & nefes al)\n3. 25 Dk: Paragraf Taktikleri & Hızlı Okuma (12 Soru)\n4. 5 Dk Mola\n5. 50 Dk Derin Odak: Kodlama veya KPSS Güncel Bilgiler + Deneme';
        tip = '⚡ Pomodoro sayacını "Çalışma Odası" sekmesinden anında başlatabilirsin!';
      } else if (lower.includes('paragraf') || lower.includes('hız')) {
        replyText = 'Paragrafı hızlandırmanın 1 numaralı kuralı "Önce Soru Kökünü Okumak"tır! Soru kökündeki "değildir, çıkarılamaz" kelimelerini mutlaka çiz. Ardından ilk ve son 2 cümleye odaklanarak ana fikri yakala.';
        tip = '📖 Günde 20 paragraf çözmeyi alışkanlık haline getir.';
      } else if (lower.includes('python') || lower.includes('kod')) {
        replyText = 'Python\'da fonksiyonlar "def fonksiyon_adi(parametre):" şeklinde tanımlanır ve geriye "return" ile değer döndürür. Döngüler ise "for i in range(sayi):" kalıbıyla belirli sayıda işlemi otomatik tekrar eder. "KodLab" sekmemizde bunu hemen canlı deneyebilirsin!';
        tip = '💻 KodLab sekmesinde canlı Python editörümüz seni bekliyor.';
      } else {
        replyText = `Bu konuda harika bir noktaya değindin! Sınav hazırlığında en önemli şey istikrar ve doğru stratejidir. Günlük serini (streak) bozmadan her gün en az 1 ders çözmek seni hedefine ulaştıracaktır. Başka merak ettiğin bir konu var mı?`;
        tip = '🍯 Haribo Altın Ayıcık her zaman yanında!';
      }

      const biboMsg: AiChatMessage = {
        id: 'bibo-' + Date.now(),
        sender: 'bibo',
        text: replyText,
        timestamp: 'Şimdi',
        cardTip: tip
      };

      setMessages(prev => [...prev, biboMsg]);
      speakText(replyText);
    }, 1200);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto py-6 px-4 space-y-4 pb-24 select-none">
      
      {/* Header Card */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-600 to-amber-700 rounded-3xl p-5 text-white shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/20 border-2 border-white/40 flex items-center justify-center select-none animate-bounceSubtle p-2">
            <HariboAvatar size="lg" animate={true} />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 bg-black/20 px-3 py-0.5 rounded-full text-xs font-black uppercase tracking-wider mb-1">
              <Sparkles className="w-3 h-3 text-amber-300" />
              Özel Maskot & Yapay Zeka Koç
            </div>
            <h2 className="text-xl sm:text-2xl font-black">Haribo Altın Ayıcık AI</h2>
            <p className="text-white/80 text-xs font-semibold">
              Kişisel tatlı koçun, sınav rehberin ve soru çözücün.
            </p>
          </div>
        </div>

        {/* Voice Toggle */}
        <button
          onClick={() => {
            sound.playClick();
            setVoiceEnabled(!voiceEnabled);
          }}
          className={`p-3 rounded-2xl border-2 transition-all flex items-center gap-1.5 text-xs font-black ${
            voiceEnabled
              ? 'bg-amber-400 text-amber-950 border-amber-500 shadow-md'
              : 'bg-white/20 text-white border-white/30'
          }`}
          title="Sesli Yanıtı Aç/Kapat"
        >
          {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          <span className="hidden sm:inline">{voiceEnabled ? 'Ses Açık' : 'Ses Kapalı'}</span>
        </button>
      </div>

      {/* Quick Prompts Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {QUICK_PROMPTS.map((p, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(p)}
            className="whitespace-nowrap px-3.5 py-2 rounded-xl bg-white dark:bg-[#1a2c35] border-2 border-gray-200 dark:border-[#2b3d45] hover:border-amber-500 hover:bg-amber-50 dark:hover:bg-[#20343f] text-xs font-bold text-gray-700 dark:text-gray-200 transition-all active:scale-95 shadow-sm"
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="bg-white dark:bg-[#1a2c35] rounded-3xl border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm p-3 sm:p-6 min-h-[260px] max-h-[calc(100vh-270px)] sm:max-h-[480px] overflow-y-auto space-y-3 sm:space-y-4 transition-colors duration-300">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''} animate-pop`}
          >
            {/* Avatar */}
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg flex-shrink-0 select-none p-1 ${
              msg.sender === 'user' ? 'bg-blue-100 border border-blue-300' : 'bg-amber-100 border border-amber-300'
            }`}>
              {msg.sender === 'user' ? '👤' : <HariboAvatar size="sm" />}
            </div>

            {/* Bubble */}
            <div className={`max-w-[80%] rounded-2xl p-4 text-xs sm:text-sm font-semibold leading-relaxed shadow-sm ${
              msg.sender === 'user'
                ? 'bg-blue-600 text-white rounded-tr-none'
                : 'bg-gray-50 dark:bg-[#202f36] border-2 border-gray-200 dark:border-[#2b3d45] text-gray-800 dark:text-gray-100 rounded-tl-none space-y-2'
            }`}>
              <div className="whitespace-pre-wrap">{msg.text}</div>

              {msg.cardTip && (
                <div className="mt-2 p-2.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-700/60 rounded-xl text-xs font-bold text-amber-900 dark:text-amber-200 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-amber-500 flex-shrink-0" />
                  <span>{msg.cardTip}</span>
                </div>
              )}

              <div className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-blue-200' : 'text-gray-400 dark:text-gray-500'}`}>
                {msg.timestamp}
              </div>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 border border-amber-300 flex items-center justify-center p-1">
              <HariboAvatar size="sm" animate={true} />
            </div>
            <div className="bg-gray-100 dark:bg-[#202f36] px-4 py-3 rounded-2xl rounded-tl-none text-xs font-black text-gray-500 dark:text-gray-400 flex items-center gap-1.5 animate-pulse">
              <span>Haribo Sarı Ayıcık düşünüyor</span>
              <span className="animate-bounce">.</span>
              <span className="animate-bounce delay-100">.</span>
              <span className="animate-bounce delay-200">.</span>
            </div>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Input Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSendMessage();
        }}
        className="flex items-center gap-2 bg-white dark:bg-[#1a2c35] p-2 rounded-2xl border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm transition-colors duration-300"
      >
        <input
          type="text"
          placeholder="Haribo Ayıcık'a soru sor, formül iste veya çalışma taktiği danış..."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          className="flex-1 px-3 py-2 text-xs sm:text-sm font-bold text-gray-800 dark:text-gray-100 bg-transparent focus:outline-none placeholder-gray-400 dark:placeholder-gray-500"
        />
        <button
          type="submit"
          disabled={!inputText.trim()}
          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-black px-4 py-2.5 rounded-xl border-b-4 border-amber-700 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-1 text-xs"
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">GÖNDER</span>
        </button>
      </form>

    </div>
  );
};
