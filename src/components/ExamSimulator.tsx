import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Clock, CheckCircle2, XCircle, FileText, Award, AlertCircle, ChevronLeft, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Mascot } from './Mascot';

interface ExamQuestion {
  id: number;
  subject: string;
  topic: string;
  question: string;
  options: { id: string; text: string }[];
  correctOption: string;
  solution: string;
}

interface ExamTrial {
  id: string;
  title: string;
  badge: string;
  durationMinutes: number;
  category: string;
  questions: ExamQuestion[];
  difficulty?: 'kolay' | 'orta' | 'zor' | 'sampiyon';
  isProOnly?: boolean;
}

const EXAM_DATA: ExamTrial[] = [
  // 1. 2026 TYT Yeni Nesil Denemesi
  {
    id: 'tyt-2026-pro',
    title: '2026 TYT Matematik & Mantık Yeni Nesil Denemesi',
    badge: '2026 ÖSYM Formatı',
    durationMinutes: 18,
    category: 'YKS / TYT',
    questions: [
      {
        id: 1,
        subject: 'Matematik',
        topic: 'Tek-Çift Sayılar (Yeni Nesil)',
        question: 'Bir marangoz elindeki tahtaları 3a + 5b uzunluğunda iki parçaya ayırıyor. Bu ifadenin tek sayı olduğu bilindiğine göre, aşağıdakilerden hangisi daima çift sayıdır?',
        options: [
          { id: 'A', text: 'a × b çarpımı' },
          { id: 'B', text: 'a + b toplamı' },
          { id: 'C', text: 'a² + b' },
          { id: 'D', text: '3a - 5b' }
        ],
        correctOption: 'A',
        solution: '3a + 5b tek ise, terimlerden biri tek diğeri çifttir. Dolayısıyla a ve b sayılarından en az biri çifttir. Bir çift sayı ile çarpılan her tam sayı çift olacağından a × b kesinlikle çifttir.'
      },
      {
        id: 2,
        subject: 'Matematik',
        topic: 'Yeni Nesil Grafik & Problem',
        question: 'Bir dijital saat sadece saat başlarında 2 kez, yarım saatlerde ise 1 kez sinyal sesi vermektedir. Saat 09.15\'ten 13.45\'e kadar bu saat toplam kaç kez sinyal sesi çıkarır?',
        options: [
          { id: 'A', text: '10 kez' },
          { id: 'B', text: '12 kez' },
          { id: 'C', text: '13 kez' },
          { id: 'D', text: '15 kez' }
        ],
        correctOption: 'B',
        solution: 'Tam saatler: 10.00, 11.00, 12.00, 13.00 (4 tane × 2 = 8 sinyal). Buçuklar: 09.30, 10.30, 11.30, 12.30, 13.30 (5 tane × 1 = 5? 13.30 dahil, 09.30, 10.30, 11.30, 12.30 = 4 tane, toplam 8 + 4 = 12 sinyal sesi).'
      },
      {
        id: 3,
        subject: 'Türkçe',
        topic: 'Paragrafta Yapı & Akış Bozma',
        question: '(I) Sanatçı, içinde yaşadığı topluma ayna tutan bir gözlemcidir. (II) Ancak bu ayna hiçbir zaman salt mekanik bir yansıtıcı olamaz. (III) Tiyatrolarda son yıllarda bilet fiyatları hızla yükselmiştir. (IV) O, gerçeği kendi estetik süzgecinden geçirerek yeniden inşa eder. Numaralanmış cümlelerden hangisi düşüncenin akışını bozmaktadır?',
        options: [
          { id: 'A', text: 'I' },
          { id: 'B', text: 'II' },
          { id: 'C', text: 'III' },
          { id: 'D', text: 'IV' }
        ],
        correctOption: 'C',
        solution: 'Parça genelinde sanatçının toplumu yansıtma biçimi ve estetik süzgeci anlatılırken III. cümlede aniden tiyatro bilet fiyatlarından bahsedilerek akış bozulmuştur.'
      },
      {
        id: 4,
        subject: 'Matematik',
        topic: 'Ardışık Sayılar & Gauss',
        question: '1 + 3 + 5 + ... + (2n - 1) = 144 olduğuna göre n değeri kaçtır?',
        options: [
          { id: 'A', text: '11' },
          { id: 'B', text: '12' },
          { id: 'C', text: '14' },
          { id: 'D', text: '16' }
        ],
        correctOption: 'B',
        solution: '1\'den başlayan ardışık tek sayıların toplam formülü n² dir. n² = 144 olduğuna göre n = 12 bulunur.'
      },
      {
        id: 5,
        subject: 'Fizik',
        topic: 'Kuvvet & Eylemsizlik',
        question: 'Durgun halden harekete geçen 2 kg kütleli bir cisme 10 N büyüklüğünde net kuvvet uygulanıyor. Cismin 4 saniye sonraki hızı kaç m/s olur?',
        options: [
          { id: 'A', text: '15 m/s' },
          { id: 'B', text: '20 m/s' },
          { id: 'C', text: '25 m/s' },
          { id: 'D', text: '40 m/s' }
        ],
        correctOption: 'B',
        solution: 'F = m × a ➔ 10 = 2 × a ➔ a = 5 m/s². Hız: V = a × t = 5 × 4 = 20 m/s.'
      },
      {
        id: 6,
        subject: 'Biyoloji',
        topic: 'Hücre Organelleri & Enerji',
        question: 'Aşağıdaki organellerden hangisinin faaliyeti sırasında hücredeki serbest glikoz miktarı artarken oksijen üretilir?',
        options: [
          { id: 'A', text: 'Mitokondri' },
          { id: 'B', text: 'Kloroplast' },
          { id: 'C', text: 'Ribozom' },
          { id: 'D', text: 'Lizozom' }
        ],
        correctOption: 'B',
        solution: 'Kloroplast fotosentez yapar: CO2 ve H2O kullanarak glikoz ve O2 üretir.'
      }
    ]
  },

  // 2. 2026 KPSS Güncel Bilgiler & Genel Kültür
  {
    id: 'kpss-2026-guncel',
    title: '2025 - 2026 KPSS Güncel Olaylar & Genel Kültür Denemesi',
    badge: 'Son Gündem & UNESCO',
    durationMinutes: 12,
    category: 'KPSS',
    questions: [
      {
        id: 1,
        subject: 'Güncel Olaylar',
        topic: 'Türkiye Uzay Misyonu',
        question: 'Ocak 2024\'te Axiom Mission 3 (Ax-3) kapsamında Uluslararası Uzay İstasyonu\'na (ISS) giderek uzayda 13 bilimsel deney gerçekleştiren ilk Türk astronot kimdir?',
        options: [
          { id: 'A', text: 'Alper Gezeravcı' },
          { id: 'B', text: 'Tuva Cihangir Atasever' },
          { id: 'C', text: 'Prof. Dr. Aziz Sancar' },
          { id: 'D', text: 'Umut Yıldız' }
        ],
        correctOption: 'A',
        solution: 'Alper Gezeravcı, Türkiye\'nin ilk astronotu olarak tarihe geçmiştir.'
      },
      {
        id: 2,
        subject: 'Kültür & Turizm',
        topic: 'UNESCO Dünya Mirası',
        question: '2023 yılında UNESCO Dünya Mirası Listesi\'ne Türkiye\'den 20. varlık olarak dahil edilen Frigya Krallığı\'nın başkenti olan antik kent hangisidir?',
        options: [
          { id: 'A', text: 'Gordion (Ankara)' },
          { id: 'B', text: 'Çatalhöyük (Konya)' },
          { id: 'C', text: 'Ani Ören Yeri (Kars)' },
          { id: 'D', text: 'Hattuşa (Çorum)' }
        ],
        correctOption: 'A',
        solution: 'Ankara Polatlı\'da bulunan Gordion Antik Kenti, UNESCO Dünya Mirası Listesi\'ne 20. mirasımız olarak kaydedilmiştir.'
      },
      {
        id: 3,
        subject: 'Tarih',
        topic: 'Milli Mücadele Dönemi',
        question: 'Mustafa Kemal Paşa\'nın "Siz orada yalnız düşmanı değil, milletin makûs talihini de yendiniz!" telgrafını çektiği muharebe hangisidir?',
        options: [
          { id: 'A', text: 'I. İnönü Muharebesi' },
          { id: 'B', text: 'II. İnönü Muharebesi' },
          { id: 'C', text: 'Sakarya Meydan Muharebesi' },
          { id: 'D', text: 'Büyük Taarruz' }
        ],
        correctOption: 'B',
        solution: 'Mustafa Kemal Atatürk bu tarihi telgrafı II. İnönü Zaferi\'nin ardından Batı Cephesi Komutanı İsmet Paşa\'ya göndermiştir.'
      },
      {
        id: 4,
        subject: 'Anayasa Hukuku',
        topic: 'Temel Hak ve Ödevler',
        question: '1982 Anayasası\'na göre Anayasa Mahkemesi kaç üyeden oluşur?',
        options: [
          { id: 'A', text: '11' },
          { id: 'B', text: '12' },
          { id: 'C', text: '15' },
          { id: 'D', text: '17' }
        ],
        correctOption: 'C',
        solution: '2017 anayasa değişiklikleri ile Askeri Yargı kaldırılmış ve Anayasa Mahkemesi üye sayısı 15 olarak belirlenmiştir.'
      },
      {
        id: 5,
        subject: 'Güncel Bilgiler',
        topic: 'Teknoloji & Savunma',
        question: 'Türkiye\'nin ilk yerli ve milli haberleşme uydusu olan ve 2024 yılında uzaya fırlatılan uydumuz hangisidir?',
        options: [
          { id: 'A', text: 'Türksat 6A' },
          { id: 'B', text: 'Göktürk-1' },
          { id: 'C', text: 'Rasat' },
          { id: 'D', text: 'İmece' }
        ],
        correctOption: 'A',
        solution: 'Türksat 6A, Türkiye\'nin %80\'in üzerinde yerlilik oranıyla ürettiği ilk milli haberleşme uydusudur.'
      }
    ]
  },

  // 3. 2026 LGS Yeni Nesil Sayısal Denemesi
  {
    id: 'lgs-2026-pro',
    title: '2026 LGS Yeni Nesil Sayısal Mantık Denemesi',
    badge: 'MEB Beceri Temelli',
    durationMinutes: 15,
    category: 'LGS (8. Sınıf)',
    questions: [
      {
        id: 1,
        subject: 'Matematik',
        topic: 'EBOB - EKOK (Yeni Nesil)',
        question: 'Kenar uzunlukları 40 m ve 56 m olan dikdörtgen şeklindeki bir bahçenin köşelerine de gelmek şartıyla eşit aralıklarla en az kaç fidan dikilebilir?',
        options: [
          { id: 'A', text: '12' },
          { id: 'B', text: '24' },
          { id: 'C', text: '28' },
          { id: 'D', text: '32' }
        ],
        correctOption: 'B',
        solution: 'EBOB(40, 56) = 8 m (fidanlar arası mesafe). Çevre = 2 × (40 + 56) = 192 m. Fidan sayısı = 192 / 8 = 24 fidan.'
      },
      {
        id: 2,
        subject: 'Matematik',
        topic: 'Kareköklü İfadeler',
        question: 'Alanı 108 cm² olan bir karenin çevre uzunluğu hangi iki ardışık tam sayı arasındadır?',
        options: [
          { id: 'A', text: '38 ile 39' },
          { id: 'B', text: '41 ile 42' },
          { id: 'C', text: '43 ile 44' },
          { id: 'D', text: '45 ile 46' }
        ],
        correctOption: 'B',
        solution: 'Bir kenar = √108 cm. √108 yaklaşık 10.39 dur. Çevre = 4 × √108 = √1728. 41² = 1681 ve 42² = 1764 olduğuna göre 41 ile 42 arasındadır.'
      }
    ]
  },

  // 4. Yazılım & Kodlama Mülakat Denemesi
  {
    id: 'kod-interview',
    title: 'Yazılım & Algoritma Mülakat Denemesi',
    badge: 'Junior / Mid Seviye',
    durationMinutes: 10,
    category: 'Kodlama',
    questions: [
      {
        id: 1,
        subject: 'Algoritma',
        topic: 'Big-O Analizi',
        question: 'İki iç içe for döngüsü bulunan ve n elemanlı bir diziyi tarayan klasik Bubble Sort algoritmasının en kötü durum (Worst Case) zaman karmaşıklığı nedir?',
        options: [
          { id: 'A', text: 'O(1)' },
          { id: 'B', text: 'O(n)' },
          { id: 'C', text: 'O(n log n)' },
          { id: 'D', text: 'O(n²)' }
        ],
        correctOption: 'D',
        solution: 'İç içe iki for döngüsü n × n = n² karşılaştırma yaptığından Bubble Sort worst-case O(n²) karmaşıklığa sahiptir.'
      },
      {
        id: 2,
        subject: 'Veri Yapıları',
        topic: 'LIFO & FIFO',
        question: 'Son giren ilk çıkar (LIFO - Last In First Out) prensibiyle çalışan veri yapısı hangisidir?',
        options: [
          { id: 'A', text: 'Kuyruk (Queue)' },
          { id: 'B', text: 'Yığın (Stack)' },
          { id: 'C', text: 'Bağlı Liste (Linked List)' },
          { id: 'D', text: 'İkili Arama Ağacı (BST)' }
        ],
        correctOption: 'B',
        solution: 'Stack (Yığın) LIFO mantığıyla çalışır (örn. tarayıcı geri butonu veya tabak dizisi).'
      }
    ]
  },
  // 5. 2026 TYT Derece Seviyesi Çeldiricili Deneme (Zor - PRO)
  {
    id: 'tyt-zor-pro',
    title: '2026 TYT Matematik Derece Seviyesi (Zor - PRO)',
    badge: 'Derece Hedefleyenler 🔥',
    durationMinutes: 25,
    category: 'YKS / TYT',
    difficulty: 'zor',
    isProOnly: true,
    questions: [
      {
        id: 1,
        subject: 'Matematik',
        topic: 'Modüler Aritmetik & Fonksiyonlar',
        question: 'f(x) fonksiyonu her n pozitif tam sayısı için f(n+1) = f(n) + 2n bağıntısını sağlamaktadır. f(1) = 3 olduğuna göre f(10) değeri kaçtır?',
        options: [
          { id: 'A', text: '91' },
          { id: 'B', text: '93' },
          { id: 'C', text: '95' },
          { id: 'D', text: '101' }
        ],
        correctOption: 'B',
        solution: 'Taraf tarafa toplama yapıldığında: f(10) - f(1) = 2(1 + 2 + ... + 9) = 2 × 45 = 90. f(10) = 90 + 3 = 93 bulunur.'
      },
      {
        id: 2,
        subject: 'Matematik',
        topic: 'Olasılık & Kombinasyon',
        question: '5 farklı anahtar bir anahtarlığa dairesel olarak sıralanacaktır. Belirli iki anahtarın daima yan yana gelme olasılığı kaçtır?',
        options: [
          { id: 'A', text: '1/4' },
          { id: 'B', text: '1/2' },
          { id: 'C', text: '2/5' },
          { id: 'D', text: '3/4' }
        ],
        correctOption: 'B',
        solution: 'Tüm durum: (5-1)! = 4! = 24. İki anahtar bir kabul edilirse 4 nesne dairesel (4-1)! = 3! = 6 ve anahtarlar kendi arasında 2! = 12. Olasılık: 12/24 = 1/2.'
      }
    ]
  },
  // 6. YDS & İngilizce C2 Usta Seviye Denemesi (Şampiyon - VIP)
  {
    id: 'yds-c2-pro',
    title: 'YDS / YÖKDİL C2 Usta Seviye Sınavı (Şampiyon - VIP)',
    badge: 'C2 Master 👑',
    durationMinutes: 20,
    category: 'Yabancı Dil',
    difficulty: 'sampiyon',
    isProOnly: true,
    questions: [
      {
        id: 1,
        subject: 'İngilizce C2',
        topic: 'Advanced Inversion & Discourse',
        question: 'Seldom ______ such an overwhelming consensus among the international scientific community.',
        options: [
          { id: 'A', text: 'has there been' },
          { id: 'B', text: 'there has been' },
          { id: 'C', text: 'there was' },
          { id: 'D', text: 'was there being' }
        ],
        correctOption: 'A',
        solution: 'Cümle olumsuz bir sıklık zarfı olan "Seldom" ile başladığında inverted (devrik) yapı gerektirir: "has there been".'
      },
      {
        id: 2,
        subject: 'İngilizce C2',
        topic: 'Nuanced Idioms & Collocations',
        question: 'The young politician was criticized for being completely ______ from the same cloth as his corrupt predecessor.',
        options: [
          { id: 'A', text: 'stitched' },
          { id: 'B', text: 'cut' },
          { id: 'C', text: 'woven' },
          { id: 'D', text: 'tailored' }
        ],
        correctOption: 'B',
        solution: 'İngilizce sabit deyim "cut from the same cloth" (aynı kumaştan kesilmiş / birbirinin aynısı) şeklindedir.'
      }
    ]
  }
];

export const ExamSimulator: React.FC = () => {
  const { completeLesson, stats } = useGame();
  const [selectedExam, setSelectedExam] = useState<ExamTrial>(EXAM_DATA[0]);
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'kolay' | 'orta' | 'zor' | 'sampiyon'>('all');
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [examActive, setExamActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(18 * 60);
  const [isFinished, setIsFinished] = useState(false);

  // Timer Countdown
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | null = null;
    if (examActive && !isFinished && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(t => t - 1);
      }, 1000);
    } else if (examActive && !isFinished && timeLeft === 0) {
      handleFinishExam();
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [examActive, isFinished, timeLeft]);

  const handleStartExam = (exam: ExamTrial) => {
    sound.playClick();
    if (exam.isProOnly && !stats.isPro && !stats.isFounder) {
      alert("🔒 Bu ileri düzey zorluk seviyesi Knowza PRO & Kurucu üyelere özeldir! Ücretsiz denemeleri çözebilir veya Mağaza'dan PRO'ya geçebilirsiniz.");
      return;
    }
    setSelectedExam(exam);
    setCurrentQIndex(0);
    setUserAnswers({});
    setTimeLeft(exam.durationMinutes * 60);
    setIsFinished(false);
    setExamActive(true);
  };

  const handleSelectOption = (qId: number, optId: string) => {
    sound.playClick();
    setUserAnswers(prev => ({
      ...prev,
      [qId]: prev[qId] === optId ? '' : optId
    }));
  };

  const handleFinishExam = () => {
    sound.playVictory();
    setIsFinished(true);
    setExamActive(false);

    // Calculate score
    const total = selectedExam.questions.length;
    let correct = 0;
    let wrong = 0;
    selectedExam.questions.forEach(q => {
      const ans = userAnswers[q.id];
      if (ans === q.correctOption) correct++;
      else if (ans) wrong++;
    });

    const net = Math.max(0, correct - (wrong / 4));
    const accuracy = Math.round((correct / total) * 100);

    completeLesson(selectedExam.id, Math.round(net * 20), Math.round(correct * 4), accuracy);
    confetti({ particleCount: 90, spread: 75 });
  };

  const formatTimer = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const q = selectedExam.questions[currentQIndex];

  // Results calculation
  let correctCount = 0;
  let wrongCount = 0;
  let emptyCount = 0;
  selectedExam.questions.forEach(item => {
    const userChoice = userAnswers[item.id];
    if (!userChoice) emptyCount++;
    else if (userChoice === item.correctOption) correctCount++;
    else wrongCount++;
  });
  const netScore = (correctCount - (wrongCount / 4)).toFixed(2);

  return (
    <div className="flex-1 max-w-5xl mx-auto py-4 sm:py-6 px-2.5 sm:px-4 space-y-4 sm:space-y-6 pb-28 w-full overflow-x-hidden">
      
      {/* Exam Header */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-700 to-cyan-800 rounded-3xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-white/20 px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              2025 - 2026 Güncel Deneme Simülasyonu
            </div>
            <h2 className="text-2xl sm:text-3xl font-black">Deneme Sınavları & Optik Form</h2>
            <p className="text-white/80 text-xs sm:text-sm font-semibold mt-1">
              ÖSYM & MEB uyumlu güncel sorular, geri sayım sayacı, optik form ve anlık net analizi.
            </p>
          </div>
          <div className="text-5xl animate-bounceSubtle">📝</div>
        </div>

        {/* Difficulty Filter Tabs */}
        {!examActive && !isFinished && (
          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-white/20">
            {[
              { id: 'all', label: 'Tümü' },
              { id: 'orta', label: 'ÖSYM Standart' },
              { id: 'zor', label: 'Zor (PRO) 🔥' },
              { id: 'sampiyon', label: 'Şampiyon (VIP) 👑' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setDifficultyFilter(f.id as any)}
                className={`px-3 py-1 rounded-xl text-xs font-black transition ${
                  difficultyFilter === f.id
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-white/15 text-white hover:bg-white/25'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}

        {/* Exam Selectors if not actively in exam */}
        {!examActive && !isFinished && (
          <div className="flex flex-wrap gap-2 mt-3">
            {EXAM_DATA.filter(e => difficultyFilter === 'all' || e.difficulty === difficultyFilter || (!e.difficulty && difficultyFilter === 'orta')).map((exam) => (
              <button
                key={exam.id}
                onClick={() => setSelectedExam(exam)}
                className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  selectedExam.id === exam.id
                    ? 'bg-white text-emerald-800 shadow-md scale-105'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                <span>{exam.title.split(' ')[0]}</span>
                <span className="text-[10px] opacity-75">({exam.badge})</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 1. Exam Landing Start Screen */}
      {!examActive && !isFinished && (
        <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-8 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm text-center max-w-xl mx-auto space-y-6 animate-pop transition-colors duration-300">
          <div className="text-6xl animate-bounceSubtle">🎓</div>
          <div>
            <span className="text-xs font-black uppercase bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 px-3 py-1 rounded-full">
              {selectedExam.badge}
            </span>
            <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100 mt-2">{selectedExam.title}</h3>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 mt-1">
              {selectedExam.category} müfredatına tam uyumlu {selectedExam.questions.length} soruluk güncel deneme sınavı.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto text-left text-xs font-bold text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-[#202f36] p-4 rounded-2xl border border-gray-200 dark:border-[#2b3d45]">
            <div>⏱️ Süre: {selectedExam.durationMinutes} Dakika</div>
            <div>❓ Soru: {selectedExam.questions.length} Adet</div>
            <div>📊 Kural: 4 Yanlış 1 Doğru</div>
            <div>⚡ Format: Optik Cevap Kağıdı</div>
          </div>

          <button
            onClick={() => handleStartExam(selectedExam)}
            className="w-full bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-4 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all text-sm uppercase tracking-wider"
          >
            SINAVI BAŞLAT
          </button>
        </div>
      )}

      {/* 2. Active Exam Simulation */}
      {examActive && !isFinished && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Main Question Display (8 Cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-6 transition-colors duration-300">
            
            {/* Top Question Meta & Timer */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-[#2b3d45]">
              <div>
                <span className="text-xs font-black uppercase text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 px-2.5 py-1 rounded-lg">
                  {q.subject} • {q.topic}
                </span>
                <span className="text-xs font-black text-gray-400 dark:text-gray-500 ml-3">
                  Soru {currentQIndex + 1} / {selectedExam.questions.length}
                </span>
              </div>

              {/* Countdown Clock */}
              <div className="flex items-center gap-1.5 font-mono font-black text-sm text-red-500 bg-red-50 dark:bg-red-950/40 px-3 py-1.5 rounded-xl border border-red-200 dark:border-red-800">
                <Clock className="w-4 h-4" />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            </div>

            {/* Question Text */}
            <h4 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-gray-100 leading-relaxed">
              {q.question}
            </h4>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {q.options.map((opt) => {
                const isSelected = userAnswers[q.id] === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => handleSelectOption(q.id, opt.id)}
                    className={`w-full p-4 rounded-2xl font-bold text-sm border-2 text-left transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 shadow-sm'
                        : 'border-gray-200 dark:border-[#2b3d45] hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#20343f] bg-white dark:bg-[#202f36]'
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-xl text-xs font-black flex items-center justify-center ${
                      isSelected ? 'bg-emerald-500 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}>
                      {opt.id}
                    </span>
                    <span className="flex-1 mt-0.5 leading-snug">{opt.text}</span>
                  </button>
                );
              })}
            </div>

            {/* Question Navigation Prev / Next */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-[#2b3d45]">
              <button
                disabled={currentQIndex === 0}
                onClick={() => {
                  sound.playClick();
                  setCurrentQIndex(i => i - 1);
                }}
                className="px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-40 text-xs font-black text-gray-700 dark:text-gray-300 flex items-center gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" /> Önceki
              </button>

              <button
                onClick={() => handleSelectOption(q.id, '')}
                className="text-xs font-bold text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
              >
                İşareti Temizle
              </button>

              <button
                disabled={currentQIndex === selectedExam.questions.length - 1}
                onClick={() => {
                  sound.playClick();
                  setCurrentQIndex(i => i + 1);
                }}
                className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-40 text-xs font-black text-white flex items-center gap-1.5"
              >
                Sonraki <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          {/* Right Optical Navigation Form (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            
            <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-5 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4 transition-colors duration-300">
              <h4 className="font-black text-sm text-gray-800 dark:text-gray-100 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Optik Cevap Formu
              </h4>

              {/* Optical Grid */}
              <div className="grid grid-cols-5 gap-2">
                {selectedExam.questions.map((item, idx) => {
                  const marked = userAnswers[item.id];
                  const isCurrent = currentQIndex === idx;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        sound.playClick();
                        setCurrentQIndex(idx);
                      }}
                      className={`h-12 rounded-xl font-black text-xs flex flex-col items-center justify-center border-2 transition-all ${
                        isCurrent
                          ? 'border-emerald-600 ring-2 ring-emerald-400'
                          : marked
                          ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300'
                          : 'border-gray-200 dark:border-[#2b3d45] bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <span>S{idx + 1}</span>
                      <span className="text-[10px] text-emerald-600 dark:text-emerald-400">{marked || '-'}</span>
                    </button>
                  );
                })}
              </div>

              {/* Finish Exam Button */}
              <button
                onClick={handleFinishExam}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-2xl border-b-4 border-red-700 active:border-b-0 active:translate-y-1 transition-all text-xs tracking-wide"
              >
                SINAVI BİTİR VE PUANLA
              </button>
            </div>

            {/* Mascot Tip */}
            <Mascot
              size="sm"
              mood="thinking"
              speech="Geri sayımı unutma! Yapamadığın soruları optik formdan kontrol edip son 2 dakikada gözden geçirebilirsin. 🍯✨"
            />
          </div>

        </div>
      )}

      {/* 3. Detailed Results & Report Card (Karne) */}
      {isFinished && (
        <div className="space-y-6 animate-pop">
          
          {/* Karne Header Card */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm text-center max-w-xl mx-auto space-y-5 transition-colors duration-300">
            <div className="text-6xl animate-bounceSubtle">🏆</div>
            <h3 className="text-2xl font-black text-gray-800 dark:text-gray-100">Sınav Karnen & Net Analizi</h3>

            {/* Score Grid */}
            <div className="grid grid-cols-4 gap-2 text-center">
              <div className="bg-green-50 dark:bg-green-950/40 border border-green-200 dark:border-green-800 rounded-2xl p-3">
                <span className="text-[10px] font-black uppercase text-green-600 dark:text-green-400 block">DOĞRU</span>
                <span className="text-xl font-black text-green-700 dark:text-green-300">{correctCount}</span>
              </div>
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-2xl p-3">
                <span className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 block">YANLIŞ</span>
                <span className="text-xl font-black text-red-700 dark:text-red-300">{wrongCount}</span>
              </div>
              <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-3">
                <span className="text-[10px] font-black uppercase text-gray-500 dark:text-gray-400 block">BOŞ</span>
                <span className="text-xl font-black text-gray-700 dark:text-gray-300">{emptyCount}</span>
              </div>
              <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3">
                <span className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 block">NET</span>
                <span className="text-xl font-black text-emerald-700 dark:text-emerald-300">{netScore}</span>
              </div>
            </div>

            <button
              onClick={() => {
                setIsFinished(false);
                setExamActive(false);
              }}
              className="bg-[#58cc02] hover:bg-[#46a302] text-white font-black py-3 px-6 rounded-2xl border-b-4 border-[#46a302] active:border-b-0 active:translate-y-1 transition-all text-xs"
            >
              YENİ BİR DENEME ÇÖZ
            </button>
          </div>

          {/* Solutions & Explanations List */}
          <div className="bg-white dark:bg-[#1a2c35] rounded-3xl p-6 border-2 border-gray-200 dark:border-[#2b3d45] shadow-sm space-y-4 transition-colors duration-300">
            <h4 className="font-black text-lg text-gray-800 dark:text-gray-100">Soruların Detaylı Çözümleri</h4>
            <div className="space-y-4">
              {selectedExam.questions.map((item, idx) => {
                const userChoice = userAnswers[item.id];
                const isCorrect = userChoice === item.correctOption;

                return (
                  <div key={item.id} className="p-4 rounded-2xl border-2 border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-[#202f36] space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="font-black text-gray-700 dark:text-gray-200">Soru {idx + 1}: {item.topic}</span>
                      <span className={`px-2 py-0.5 rounded-md font-black ${
                        isCorrect ? 'bg-green-100 dark:bg-green-950/50 text-green-700 dark:text-green-300' : userChoice ? 'bg-red-100 dark:bg-red-950/50 text-red-700 dark:text-red-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}>
                        {isCorrect ? 'DOĞRU ✅' : userChoice ? 'YANLIŞ ❌' : 'BOŞ'}
                      </span>
                    </div>

                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-100">{item.question}</p>

                    <div className="text-xs text-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 p-3 rounded-xl border border-emerald-200 dark:border-emerald-800 font-medium">
                      <span className="font-black block text-emerald-900 dark:text-emerald-200 mb-1">
                        Doğru Şık: {item.correctOption} | Senin Cevabın: {userChoice || 'Boş'}
                      </span>
                      {item.solution}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
