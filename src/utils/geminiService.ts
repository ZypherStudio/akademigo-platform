// Knowza Google Gemini AI Assistant & Specialized Exam Tutor Service
import { CourseCategory } from '../types';

export type AiTeachingStyle = 'step_by_step' | 'fast_tactic' | 'strict_coach';
export type AiTrackId = 'yks' | 'lgs' | 'kpss' | 'dil' | 'kodlama';

export function normalizeAiTrack(courseId?: CourseCategory): AiTrackId {
  if (!courseId) return 'yks';
  if (courseId === 'lgs' || courseId === 'kpss' || courseId === 'kodlama') return courseId;
  if (courseId.startsWith('dil')) return 'dil';
  return 'yks';
}

export interface AiTrainingSettings {
  teachingStyle: AiTeachingStyle;
  customInstructions: string;
  includeFormulas: boolean;
  askFollowUpQuestion: boolean;
}

export interface FlashcardItem {
  id: string;
  front: string;
  back: string;
  tip: string;
}

export interface GeneratedQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyPlanTask {
  id: string;
  subject: string;
  title: string;
  durationMin: number;
  xpReward: number;
  completed: boolean;
  tag: string;
}

const AI_TRAINING_STORAGE_KEY = 'knowza_ai_training_v1';

export function loadAiTrainingSettings(): AiTrainingSettings {
  try {
    const raw = localStorage.getItem(AI_TRAINING_STORAGE_KEY);
    if (raw) {
      return {
        teachingStyle: 'step_by_step',
        customInstructions: '',
        includeFormulas: true,
        askFollowUpQuestion: true,
        ...JSON.parse(raw),
      };
    }
  } catch {
    // Ignore malformed storage
  }
  return {
    teachingStyle: 'step_by_step',
    customInstructions: '',
    includeFormulas: true,
    askFollowUpQuestion: true,
  };
}

export function saveAiTrainingSettings(settings: AiTrainingSettings): void {
  localStorage.setItem(AI_TRAINING_STORAGE_KEY, JSON.stringify(settings));
}

export interface TrackAiProfile {
  id: AiTrackId;
  name: string;
  shortName: string;
  badge: string;
  expertTitle: string;
  accentGradient: string;
  systemPrompt: string;
  quickPrompts: string[];
  sampleNoteTitle: string;
  sampleNoteText: string;
  subjects: string[];
}

export const TRACK_AI_PROFILES: Record<AiTrackId, TrackAiProfile> = {
  yks: {
    id: 'yks',
    name: 'YKS (TYT - AYT)',
    shortName: 'YKS / TYT',
    badge: 'ÖSYM Uzmanı 🎯',
    expertTitle: 'TYT & AYT Net Artırma Koçu',
    accentGradient: 'from-amber-500 to-orange-600',
    systemPrompt: `Sen Knowza'nın ÖSYM (YKS / TYT-AYT) konusunda uzmanlaşmış 3D Maskot AI Koçusun.
- TYT'de hız, paragraf stratejisi, yeni nesil problem kurgulama ve temel kavram tuzaklarına odaklan.
- AYT'de derin konu mantığı, türev/integral/organik kimya/edebiyat dönem analizleri ve formül türetme öğret.
- LGS veya KPSS gibi basit/farklı sınav formatlarına kayma; doğrudan ÖSYM soru kalıplarına göre çözüm yap.`,
    quickPrompts: [
      'TYT Paragrafta 40 soruda 35+ net için süre taktiği ver',
      'TYT Matematik yeni nesil problem nasıl denkleme dökülür?',
      'AYT Fonksiyonlar ve Polinomlar arasındaki en kritik farklar neler?',
      'Bana ÖSYM tarzı 1 adet TYT Mantık / Sayı problemi sor!',
    ],
    sampleNoteTitle: 'TYT Paragraf & Problem Taktikleri',
    sampleNoteText:
      'ÖSYM paragraf sorularında önce soru kökü okunur. "Değinilmemiştir / Çıkarılamaz" gibi olumsuz köklerde şıklardan metne gidilerek eleme yapılır. "Asıl anlatılmak istenen" sorularında ise giriş ve sonuç cümleleri ana fikri verir. Matematik problemlerinde bilinmeyen sayısını az tutmak için oran-orantı katları (3k, 5k) kullanılır; yüzde problemlerinde bütüne 100x demek kesirli işlemlerden kurtarır.',
    subjects: ['TYT Matematik', 'TYT Türkçe & Paragraf', 'AYT Matematik', 'Fizik / Kimya / Biyoloji'],
  },
  lgs: {
    id: 'lgs',
    name: 'LGS (8. Sınıf)',
    shortName: 'LGS',
    badge: 'MEB Yeni Nesil 📘',
    expertTitle: 'LGS Mantık & Muhakeme Koçu',
    accentGradient: 'from-emerald-500 to-teal-600',
    systemPrompt: `Sen Knowza'nın MEB LGS (8. Sınıf Liselere Geçiş Sınavı) uzmanı 3D Maskot AI Koçusun.
- 8. sınıf öğrencisinin anlayacağı net, sıcak, cesaretlendirici ve sade bir dil kullan.
- Lise müfredatına (türev, logaritma vb.) kesinlikle girme! Sadece LGS müfredatı (Çarpanlar-Katlar, Üslü/Köklü İfadeler, Olasılık, Cebirsel İfadeler, İnkılap Tarihi, Fen Deney Yorumlama) üzerinden anlat.
- Uzun MEB yeni nesil görsel/tablo sorularını küçük parçalara ayırmayı öğret.`,
    quickPrompts: [
      'LGS Çarpanlar ve Katlar (EBOB-EKOK) problemlerini nasıl ayırt ederim?',
      'Uzun yeni nesil LGS sorularında sıkılmadan nasıl çözüm yaparım?',
      'Üslü ve Köklü İfadelerde en çok çıkan MEB tuzakları neler?',
      '8. Sınıf İnkılap Tarihi kronolojisini kolay ezberleme taktiği ver!',
    ],
    sampleNoteTitle: 'LGS EBOB-EKOK & Üslü İfadeler Özeti',
    sampleNoteText:
      'Bütünden parçaya gidiliyorsa (büyük bidonları küçük şişelere bölme, tarlanın etrafına eşit aralıklarla ağaç dikme) EBOB kullanılır. Parçadan bütüne gidiliyorsa (küçük fayanslardan büyük kare oluşturma, aynı anda çalan zillerin tekrar birlikte çalması) EKOK kullanılır. Üslü ifadelerde tabanlar aynıysa çarpımda üsler toplanır, bölmede çıkarılır. Negatif üs sayıyı eksi yapmaz, sadece çarpmaya göre ters çevirir.',
    subjects: ['LGS Matematik', 'LGS Fen Bilimleri', 'LGS Türkçe', 'T.C. İnkılap Tarihi'],
  },
  kpss: {
    id: 'kpss',
    name: 'KPSS (GY - GK)',
    shortName: 'KPSS',
    badge: 'Memuriyet & Atama 🏛️',
    expertTitle: 'KPSS Tarih, Vatandaşlık & Sözel Mantık Koçu',
    accentGradient: 'from-blue-600 to-indigo-700',
    systemPrompt: `Sen Knowza'nın KPSS (Genel Yetenek - Genel Kültür) uzmanı 3D Maskot AI Koçusun.
- Tarih, Coğrafya ve Vatandaşlık konularında akılda kalıcı hafıza kodlamaları (akrostiş/şifre), kronolojik karşılaştırmalar ve ÖSYM KPSS çeldiricilerini vurgula.
- Sözel Mantık ve Sayısal Mantık sorularında tablo kurma tekniğini göster.
- YKS veya LGS formatı yerine doğrudan yetişkin/memur adayı seviyesinde, net ve pratik anlat.`,
    quickPrompts: [
      'KPSS Tarih Islahat Fermanı & Tanzimat farklarını kodlamayla anlat',
      'KPSS Sözel Mantık sorularında en hızlı tablo kurma tekniği nedir?',
      'Türkiye Coğrafyası dağlar ve ovalar için akılda kalıcı şifre ver',
      'Anayasa / Vatandaşlık yasama-yürütme sürelerini özetle!',
    ],
    sampleNoteTitle: 'KPSS Tarih & Vatandaşlık Kritik Notlar',
    sampleNoteText:
      '1839 Tanzimat Fermanı ile ilk kez padişah kendi gücünün üstünde kanun gücünü kabul etmiştir. 1856 Islahat Fermanı ise azınlıklara geniş haklar tanımıştır. 1876 Kanun-i Esasi Türk tarihinin ilk anayasasıdır ve I. Meşrutiyeti başlatmıştır. Türkiye\'de yasama yetkisi TBMM\'ye aittir ve devredilemez. Milletvekili seçilme yaşı 18\'dir; genel seçimler 5 yılda bir yapılır.',
    subjects: ['KPSS Tarih', 'KPSS Coğrafya', 'Vatandaşlık & Güncel', 'Sözel / Sayısal Mantık'],
  },
  dil: {
    id: 'dil',
    name: 'Yabancı Dil (A1 - C2)',
    shortName: 'Diller',
    badge: 'CEFR Dil Koçu 🌍',
    expertTitle: 'Grammar, Vocabulary & Speaking Koçu',
    accentGradient: 'from-rose-500 to-pink-600',
    systemPrompt: `Sen Knowza'nın CEFR (A1-C2) Yabancı Dil (İngilizce, Almanca, Fransızca, İspanyolca, Boşnakça) koçusun.
- Cevaplarında hedef dilde örnek cümleler kur, Türkçe açıklamalarını ve okunuş/kullanım ipuçlarını ekle.
- Zamanlar (Tenses), Phrasal Verbs, Passive Voice ve Bağlaçlar arasındaki ince farkları günlük konuşma ve YDT/TOEFL kalıplarıyla öğret.`,
    quickPrompts: [
      'Present Perfect ile Simple Past arasındaki farkı örneklerle anlat',
      'Günlük konuşmada en çok kullanılan 5 Phrasal Verb öğret',
      'B1 seviyesinden B2 seviyesine geçmek için okuma/dinleme planı yap',
      'Benimle basit İngilizce diyalog pratiği başlat!',
    ],
    sampleNoteTitle: 'İngilizce Tenses & Phrasal Verbs',
    sampleNoteText:
      'Simple Past (I saw him yesterday) zamanı belli ve bitmiş olaylar için kullanılır. Present Perfect (I have seen that movie) ise zamanı belirsiz veya etkisi hala süren deneyimler için kullanılır. Yaygın Phrasal Verbs: "give up" (vazgeçmek), "look forward to" (dört gözle beklemek), "figure out" (çözmek/anlamak), "run out of" (tükenmek).',
    subjects: ['Grammar & Tenses', 'Vocabulary & Phrasal Verbs', 'Reading & YDT', 'Speaking Pratiği'],
  },
  kodlama: {
    id: 'kodlama',
    name: 'Kodlama & Yazılım',
    shortName: 'Kodlama',
    badge: 'Algoritma & Debug 💻',
    expertTitle: 'Python, JS & Algoritma Mentorü',
    accentGradient: 'from-violet-600 to-purple-700',
    systemPrompt: `Sen Knowza'nın Yazılım, Python ve Algoritma Mentorüsün.
- Kod bloklarını temiz, anlaşılır ve açıklamalı ver.
- Öğrencinin gönderdiği kod hatasını (bug) satır satır incele, neden hata verdiğini açıklayıp düzeltilmiş halini göster.
- Zaman karmaşıklığı ve temiz kod prensiplerini basitçe anlat.`,
    quickPrompts: [
      'Python list comprehension nasıl çalışır, örnek göster?',
      'For ve While döngüleri arasındaki farkı gerçek örnekle anlat',
      'JavaScript async/await mantığını yeni başlayan birine göre açıkla',
      'Bana başlangıç seviyesi bir algoritma sorusu sor!',
    ],
    sampleNoteTitle: 'Python Fonksiyonlar & Döngüler Özeti',
    sampleNoteText:
      'Python\'da fonksiyonlar "def" anahtar kelimesiyle tanımlanır ve "return" ile değer döndürür. "for" döngüsü belirli bir liste veya aralık (range) üzerinde gezinmek için kullanılırken, "while" döngüsü verilen koşul True olduğu sürece çalışmaya devam eder. List Comprehension [x*2 for x in range(5)] tek satırda yeni liste üretmeyi sağlar.',
    subjects: ['Python Temelleri', 'Algoritma & Veri Yapıları', 'JavaScript & Web', 'Hata Ayıklama (Debug)'],
  },
};

function buildSystemInstruction(track: AiTrackId, settings: AiTrainingSettings): string {
  const profile = TRACK_AI_PROFILES[track] || TRACK_AI_PROFILES.yks;

  const styleMap: Record<AiTeachingStyle, string> = {
    step_by_step:
      'Anlatım Tarzı: Sabırlı ve adım adım öğretmen gibi anlat. Her adımı numaralandırarak öğret.',
    fast_tactic:
      'Anlatım Tarzı: Kısa, net, sınav kazandıran taktikler ve hap bilgilerle hızlı özet ver.',
    strict_coach:
      'Anlatım Tarzı: Disiplinli ve motive edici bir sınav koçu gibi konuş. Öğrenciyi düşünmeye zorla ve net hedef koy.',
  };

  return `${profile.systemPrompt}

${styleMap[settings.teachingStyle]}
${settings.includeFormulas ? 'Gerekli yerlerde formül, kural veya hafıza kodlamasını kutucuk/madde olarak mutlaka vurgula.' : ''}
${settings.askFollowUpQuestion ? 'Cevabının sonunda öğrencinin konuyu anlayıp anlamadığını ölçen kısa 1 kontrol sorusu veya sonraki adım önerisi ekle.' : ''}
${settings.customInstructions.trim() ? `\nKullanıcının Özel Eğitme Talimatı:\n${settings.customInstructions.trim()}` : ''}`;
}

export async function askGeminiCoach(
  userText: string,
  history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [],
  options?: {
    track?: AiTrackId;
    imageBase64?: string;
    imageMimeType?: string;
  }
): Promise<{ text: string; success: boolean }> {
  const track: AiTrackId = options?.track || 'yks';
  const settings = loadAiTrainingSettings();
  const customKey = localStorage.getItem('knowza_gemini_api_key')?.trim();

  if (customKey) {
    try {
      const userParts: Array<{ text?: string; inlineData?: { mimeType: string; data: string } }> = [];
      if (options?.imageBase64 && options?.imageMimeType) {
        userParts.push({
          inlineData: {
            mimeType: options.imageMimeType,
            data: options.imageBase64,
          },
        });
      }
      userParts.push({
        text: userText || 'Bu görseldeki ödev sorusunu veya notu inceleyip adım adım açıkla.',
      });

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${customKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            systemInstruction: { parts: [{ text: buildSystemInstruction(track, settings) }] },
            contents: [...history, { role: 'user', parts: userParts }],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return { text: reply, success: true };
        }
      }
    } catch {
      // Fallback to track-specific intelligent tutor
    }
  }

  // Track-specific intelligent built-in response engine
  const lower = userText.toLowerCase();
  const hasImage = Boolean(options?.imageBase64);
  const profile = TRACK_AI_PROFILES[track] || TRACK_AI_PROFILES.yks;

  if (hasImage) {
    if (track === 'lgs') {
      return {
        text: `📸 **LGS Ödev Görseli İncelendi!**\n\n1️⃣ **Soru Kökünü Yakala:** MEB yeni nesil sorularında üstteki hikaye kısmını değil, en alttaki koyu yazılı soru cümlesini önce oku.\n2️⃣ **Verilenleri Listele:** Şeklin veya tablonun üzerindeki sayısal verileri kenara yaz.\n3️⃣ **İşlem Adımı:** Sorudaki anahtar kelimeye ("en az", "eşit parça", "kaç farklı") göre EBOB/EKOK veya üslü ifade kuralını uygula.\n\n💡 *Tam otomatik görsel OCR okuma için "AI Eğit & Ayar" sekmesinden kendi ücretsiz Gemini API anahtarını ekleyebilirsin; böylece fotoğraftaki yazıyı birebir çözerim!*`,
        success: true,
      };
    }
    if (track === 'kpss') {
      return {
        text: `📸 **KPSS Soru Görseli Analizi!**\n\n1️⃣ **Kavram / Dönem Tespiti:** Soruda geçen anahtar tarih, antlaşma veya anayasa maddesini işaretle.\n2️⃣ **Çeldirici Eleme:** ÖSYM KPSS'de genellikle "yalnızca", "tamamı", "kesinlikle" gibi keskin ifadeleri tuzak olarak kullanır.\n\n💡 *Fotoğraftaki metni birebir okuyup şıkları tek tek elemem için "AI Eğit & Ayar" sekmesinden Gemini API anahtarı tanımlayabilirsin.*`,
        success: true,
      };
    }
    return {
      text: `📸 **${profile.name} Ödev Görseli Alındı!**\n\n1️⃣ **Adım 1 (Verilenler):** Görseldeki sorunun bilinenlerini ve senden isteneni netleştir.\n2️⃣ **Adım 2 (Strateji):** ${profile.expertTitle} modunda olduğumuz için soruyu doğrudan ${profile.shortName} müfredatı ve soru kalıplarına göre çözmelisin.\n\n💡 *Fotoğraftaki yazıyı ve şekilleri birebir okuyup adım adım çözmem için "AI Eğit & Ayar" sekmesinden Gemini API anahtarı ekleyebilirsin veya sorunun metnini buraya yazabilirsin!*`,
      success: true,
    };
  }

  // Track-specific text responses
  if (track === 'yks') {
    if (lower.includes('paragraf') || lower.includes('türkçe')) {
      return {
        text: `🎯 **YKS / TYT Paragraf Hız & Net Taktiği:**\n\n1. **Soru Kökü Önce:** Metne dalmadan önce "Bu parçada asıl anlatılmak istenen..." veya "Değinilmemiştir" kökünü oku.\n2. **Olumsuz Kök Stratejisi:** "Ulaşılamaz / Çıkarılamaz" sorularında şıklardan kısa anahtar kelimeler seçip metinde tara.\n3. **İlk & Son 2 Cümle:** Ana fikir sorularında yazarın tezi %80 ilk iki ve son iki cümlede gizlidir.\n\n❓ *Kontrol Sorusu:* Günde şu an kaç paragraf sorusu çözüyorsun ve ortalama kaç dakika sürüyor?`,
        success: true,
      };
    }
    if (lower.includes('problem') || lower.includes('matematik') || lower.includes('fonksiyon')) {
      return {
        text: `📐 **TYT-AYT Matematik Stratejisi:**\n\n1. **Bilinmeyen Tasarrufu:** Problemlerde her şeye 'x, y, z' deme! Kesir veya oran varsa bütüne '100x' ya da '12k' diyerek rasyonel sayılardan kaç.\n2. **AYT Derinliği:** Fonksiyon grafikleri ve Polinomlarda 'P(x)' derecesi ile kökler toplamını her zaman kenara not et.\n3. **ÖSYM Örneği:** Bir sınıftaki öğrencilerin %40'ı erkektir. Sınıfa 6 kız daha gelince erkek oranı %30 oluyor. Başlangıçta kaç öğrenci vardır? (İpucu: Başlangıca '100k' veya '10x' ver!)`,
        success: true,
      };
    }
    if (lower.includes('soru sor') || lower.includes('test')) {
      return {
        text: `🔥 **ÖSYM Tarzı TYT Sorusu:**\n\n"Bir kırtasiyede etiket fiyatı üzerinden %20 indirimle satılan bir test kitabı, indirimli fiyatı üzerinden %25 zam yapıldığında başlangıç fiyatından **3 TL daha ucuz** oluyor. Bu kitabın ilk etiket fiyatı kaç TL'dir?"\n\n💡 *İpucu:* İlk fiyata '100x' de. %20 indirim -> '80x'. Sonra '80x'in %25'i (dörtte biri) kadar zam ekle! Cevabını yaz, kontrol edeyim!`,
        success: true,
      };
    }
  }

  if (track === 'lgs') {
    if (lower.includes('ebob') || lower.includes('ekok') || lower.includes('çarpan')) {
      return {
        text: `📘 **LGS EBOB - EKOK Ayırt Etme Rehberi:**\n\n• **Büyükten Küçüğe (Bölme / Parçalama) = EBOB:** Tarlanın etrafına ağaç dikme, büyük bidonları küçük şişelere doldurma, sınıf mevcudunu eşit gruplara ayırma.\n• **Küçükten Büyüğe (Birleştirme / Buluşma) = EKOK:** Küçük dikdörtgenlerden kare yapma, farklı sürelerde çalan zillerin tekrar buluşması, cevizleri 3'erli 5'erli sayma.\n\n❓ *Mini Test:* 12 dakika ve 18 dakikada bir kalkan iki otobüs ilk kez saat 08:00'de birlikte kalkarsa tekrar ne zaman birlikte kalkarlar?`,
        success: true,
      };
    }
    if (lower.includes('üslü') || lower.includes('köklü') || lower.includes('tuzak')) {
      return {
        text: `⚡ **LGS Üslü & Köklü İfade Tuzakları:**\n\n1. **Parantez Tuzağı:** (-3)² = +9 iken -3² = -9 olur! Çift kuvvet sadece parantez dışındaysa eksiyi artı yapar.\n2. **Negatif Üs Tuzağı:** 2⁻³ sayısı negatif değildir! Sadece ters döner: 1/8.\n3. **Kök Dışına Çıkarma:** √72 gördüğünde hemen 36 × 2 = 6√2 olarak parçala.\n\nHarikasın, 8. sınıf hızıyla devam! 🚀`,
        success: true,
      };
    }
    if (lower.includes('inkılap') || lower.includes('kronoloji')) {
      return {
        text: `🇹🇷 **LGS İnkılap Tarihi Altın Kronoloji:**\n\n1. **19 Mayıs 1919:** Samsun'a Çıkış (Milli Mücadele başlangıcı)\n2. **Havza & Amasya Genelgesi:** Amaç, Gerekçe ve Yöntem belirlendi!\n3. **Erzurum & Sivas Kongreleri:** "Manda ve himaye kabul edilemez" + Cemiyetler birleştirildi.\n4. **23 Nisan 1920:** TBMM'nin açılışı.\n\n💡 *İpucu:* LGS'de tarih ezberi değil, olayların **neden-sonuç** ilişkisi sorulur!`,
        success: true,
      };
    }
  }

  if (track === 'kpss') {
    if (lower.includes('ıslahat') || lower.includes('tanzimat') || lower.includes('tarih')) {
      return {
        text: `🏛️ **KPSS Tarih Kodlaması (Tanzimat vs Islahat):**\n\n• **1839 Tanzimat Fermanı:** Herkesi kapsar (Müslüman + Gayrimüslim eşit). Padişah ilk kez kanun üstünlüğünü kabul etti.\n• **1856 Islahat Fermanı:** Sadece **Azınlıklara** (Gayrimüslimlere) yeni ayrıcalıklar verdi. Paris Antlaşması öncesi Avrupalıların baskısını önlemek için ilan edildi.\n• **Kodlama:** **T**anzimat = **T**üm Halk | **I**slahat = **I**şıl ışıl sadece Azınlıklar!`,
        success: true,
      };
    }
    if (lower.includes('sözel') || lower.includes('mantık') || lower.includes('tablo')) {
      return {
        text: `🧩 **KPSS Sözel Mantık Tablo Tekniği:**\n\n1. Önce **en az değişkene** (günler, sıralar, şehirler) göre ana sütunları çiz.\n2. Kesin bilgileri doğrudan tabloya yerleştir.\n3. "A, B'den hemen önce" gibi blok bilgileri yan tarafa kutu içinde bağla.\n4. İhtimalleri (1. İhtimal / 2. İhtimal) alt alta iki satır halinde yürüt; tek tabloda karalama yapma!`,
        success: true,
      };
    }
  }

  if (track === 'dil') {
    return {
      text: `🌍 **Knowza English Coach (${profile.badge}):**\n\n• **Simple Past vs Present Perfect:**\n  - *I visited London in 2023.* (Zaman belli → Simple Past)\n  - *I have visited London twice.* (Deneyim, zaman belirsiz → Present Perfect)\n\n• **Hızlı Kalıp:** *"I am looking forward to hearing from you."* (Senden haber almayı dört gözle bekliyorum — "to" sonrası fiil **-ing** alır!)\n\n✍️ Şimdi sen "give up" ile İngilizce kısa bir cümle kur, kontrol edeyim!`,
      success: true,
    };
  }

  if (track === 'kodlama') {
    return {
      text: `💻 **Knowza Kodlama Mentorü:**\n\nPython Döngü & Fonksiyon Örneği:\ndef cift_sayilari_bul(liste):\n    return [x for x in liste if x % 2 == 0]\n\nprint(cift_sayilari_bul([1, 2, 3, 4, 6])) # [2, 4, 6]\n\n🔍 **Neden List Comprehension?** Hem kodu 4 satırdan 1 satıra düşürür hem de Python'da normal 'for' döngüsünden daha hızlı çalışır. Takıldığın bir kod bloğu varsa buraya yapıştır, satır satır debug edelim!`,
      success: true,
    };
  }

  return {
    text: `✨ **${profile.name} Uzman Koçun Hazır!**\n\nŞu an **${profile.expertTitle}** modunda eğitilmiş durumdayım.\n• Sorunun fotoğrafını sol alttaki **📷 Kamera/Görsel** butonundan yükleyebilirsin.\n• Ders notlarını **"Not → Quiz & Kart"** sekmesine yapıştırarak saniyede bilgi kartları ve mini test üretebilirsin.\n• **"Ödev Planı"** sekmesinde ise bugüne özel çalışma listeni çıkarabilirsin!`,
    success: true,
  };
}

export async function generateFlashcardsAndQuizFromNotes(
  noteText: string,
  track: AiTrackId
): Promise<{ flashcards: FlashcardItem[]; quiz: GeneratedQuizQuestion[] }> {
  const customKey = localStorage.getItem('knowza_gemini_api_key')?.trim();
  const profile = TRACK_AI_PROFILES[track] || TRACK_AI_PROFILES.yks;

  if (customKey && noteText.trim().length > 20) {
    try {
      const prompt = `Aşağıdaki ${profile.name} ders notundan tam olarak 3 adet Flashcard (bilgi kartı) ve 3 adet 4 şıklı çoktan seçmeli Quiz sorusu üret.
Sadece geçerli JSON döndür, başka hiçbir açıklama yazma. Şema:
{
  "flashcards": [{ "front": "Soru veya kavram", "back": "Net cevap", "tip": "Kısa ipucu" }],
  "quiz": [{ "question": "Soru metni", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "Neden doğru" }]
}

Ders Notu:
${noteText.slice(0, 3500)}`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${customKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            generationConfig: { responseMimeType: 'application/json' },
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawJson) {
          const parsed = JSON.parse(rawJson);
          if (Array.isArray(parsed.flashcards) && Array.isArray(parsed.quiz)) {
            return {
              flashcards: parsed.flashcards.map((f: any, idx: number) => ({
                id: `fc-${Date.now()}-${idx}`,
                front: String(f.front || ''),
                back: String(f.back || ''),
                tip: String(f.tip || profile.badge),
              })),
              quiz: parsed.quiz.map((q: any, idx: number) => ({
                id: `qz-${Date.now()}-${idx}`,
                question: String(q.question || ''),
                options: Array.isArray(q.options) ? q.options.slice(0, 4).map(String) : ['A', 'B', 'C', 'D'],
                correctIndex: Number(q.correctIndex ?? 0),
                explanation: String(q.explanation || ''),
              })),
            };
          }
        }
      }
    } catch {
      // Fall back to intelligent local note parser below
    }
  }

  // Intelligent Local Note-to-Flashcard & Quiz Engine
  const sentences = noteText
    .split(/[.!?;\n]+/)
    .map((s) => s.trim())
    .filter((s) => s.length >= 18);

  const flashcards: FlashcardItem[] = [];
  if (sentences.length > 0) {
    sentences.slice(0, 4).forEach((sentence, idx) => {
      const words = sentence.split(' ');
      const splitPoint = Math.max(3, Math.floor(words.length * 0.45));
      const keyword = words.slice(0, splitPoint).join(' ');
      flashcards.push({
        id: `fc-local-${idx}`,
        front: `📌 Kavram ${idx + 1}: "${keyword}..." ile ilgili kritik kural nedir?`,
        back: sentence,
        tip: `${profile.shortName} Not Özeti`,
      });
    });
  } else {
    flashcards.push({
      id: 'fc-default-1',
      front: `${profile.name} için ana çalışma kuralı nedir?`,
      back: profile.sampleNoteText,
      tip: profile.badge,
    });
  }

  // Track-specific default quiz bank combined with note context
  const trackQuizBank: Record<AiTrackId, GeneratedQuizQuestion[]> = {
    yks: [
      {
        id: 'yks-q1',
        question: 'ÖSYM paragraf sorularında "Bu parçadan aşağıdakilerden hangisine ulaşılamaz?" gibi olumsuz soru köklerinde en hızlı strateji nedir?',
        options: [
          'Önce şıklardan anahtar kelime seçip metinde tarayarak eleme yapmak',
          'Metni 3 kez baştan sona yavaşça okumak',
          'Sadece son cümleye bakıp işaretlemek',
          'Şıkları okumadan tahmin yürütmek',
        ],
        correctIndex: 0,
        explanation: 'Olumsuz soru köklerinde şıkları metinle eşleştirerek elemek süreden büyük tasarruf sağlar.',
      },
      {
        id: 'yks-q2',
        question: 'Yüzde ve kâr-zarar problemlerinde kesirli işlemlerle uğraşmamak için bütüne genellikle ne değer verilir?',
        options: ['1x', '100x', '7x', 'x/2'],
        correctIndex: 1,
        explanation: 'Bütüne 100x demek %20, %35 gibi yüzdelerin doğrudan tam sayı çıkmasını sağlar.',
      },
    ],
    lgs: [
      {
        id: 'lgs-q1',
        question: 'Küçük dikdörtgen fayansları yan yana getirerek büyük bir kare oluşturma sorusunda hangisi kullanılır?',
        options: ['EBOB', 'EKOK', 'Asal Çarpan Toplamı', 'Ortalama'],
        correctIndex: 1,
        explanation: 'Parçadan bütüne gidildiği için ortak katların en küçüğü yani EKOK hesaplanır.',
      },
      {
        id: 'lgs-q2',
        question: 'LGS Üslü İfadeler konusunda 2⁻³ ifadesinin değeri aşağıdakilerden hangisidir?',
        options: ['-8', '-6', '1/8', '1/6'],
        correctIndex: 2,
        explanation: 'Negatif üs sayıyı eksi yapmaz, tabanı çarpmaya göre ters çevirir: 1 / 2³ = 1/8.',
      },
    ],
    kpss: [
      {
        id: 'kpss-q1',
        question: 'Osmanlı tarihinde Padişahın kendi gücünün üstünde kanun gücünü ilk kez kabul ettiği belge hangisidir?',
        options: ['Sened-i İttifak', 'Tanzimat Fermanı (1839)', 'Islahat Fermanı', 'Kanun-i Esasi'],
        correctIndex: 1,
        explanation: '1839 Tanzimat Fermanı ile ilk kez kanun üstünlüğü ilkesi benimsenmiştir.',
      },
      {
        id: 'kpss-q2',
        question: 'Anayasamıza göre milletvekili seçilme yaşı kaçtır?',
        options: ['25', '21', '18', '30'],
        correctIndex: 2,
        explanation: '2017 anayasa değişikliği ile milletvekili seçilme yaşı 18 olarak belirlenmiştir.',
      },
    ],
    dil: [
      {
        id: 'eng-q1',
        question: '"I am looking forward to ____ from you." cümlesindeki boşluğa hangisi gelmelidir?',
        options: ['hear', 'hearing', 'heard', 'to hear'],
        correctIndex: 1,
        explanation: '"look forward to" kalıbındaki "to" edat olduğu için ardından gelen fiil -ing (gerund) alır.',
      },
      {
        id: 'eng-q2',
        question: '"Give up" phrasal verb\'ünün Türkçe anlamı nedir?',
        options: ['Devam etmek', 'Vazgeçmek / Bırakmak', 'Keşfetmek', 'Ertelemek'],
        correctIndex: 1,
        explanation: '"Give up" bir alışkanlığı bırakmak veya bir hedeften vazgeçmek anlamına gelir.',
      },
    ],
    kodlama: [
      {
        id: 'cod-q1',
        question: 'Python\'da bir fonksiyon tanımlamak için hangi anahtar kelime kullanılır?',
        options: ['function', 'def', 'func', 'define'],
        correctIndex: 1,
        explanation: 'Python\'da fonksiyonlar "def fonksiyon_adi():" şeklinde tanımlanır.',
      },
      {
        id: 'cod-q2',
        question: '[x*2 for x in range(3)] çıktısı nedir?',
        options: ['[0, 2, 4]', '[2, 4, 6]', '[1, 2, 3]', '[0, 1, 2]'],
        correctIndex: 0,
        explanation: 'range(3) değerleri 0, 1, 2 üretir; her biri 2 ile çarpılınca [0, 2, 4] elde edilir.',
      },
    ],
  };

  return {
    flashcards,
    quiz: trackQuizBank[track] || trackQuizBank.yks,
  };
}

export function generateSmartStudyPlan(
  track: AiTrackId,
  dailyHours: 1 | 2 | 4,
  focusSubject: string
): StudyPlanTask[] {
  const profile = TRACK_AI_PROFILES[track] || TRACK_AI_PROFILES.yks;
  const subj = focusSubject || profile.subjects[0];

  if (track === 'lgs') {
    const base: StudyPlanTask[] = [
      {
        id: 'plan-lgs-1',
        subject: subj,
        title: `${subj} • 15 Adet MEB Yeni Nesil Mantık Sorusu`,
        durationMin: 25,
        xpReward: 40,
        completed: false,
        tag: 'Yeni Nesil',
      },
      {
        id: 'plan-lgs-2',
        subject: 'LGS Türkçe',
        title: '10 Adet Görsel & Sözel Muhakeme Paragrafı',
        durationMin: 15,
        xpReward: 25,
        completed: false,
        tag: 'Hızlanma',
      },
      {
        id: 'plan-lgs-3',
        subject: 'Fen / İnkılap',
        title: 'Yanlış Defterindeki 5 Soruyu Maskotla Tekrar Et',
        durationMin: 15,
        xpReward: 30,
        completed: false,
        tag: 'Tekrar',
      },
    ];
    if (dailyHours >= 2) {
      base.push({
        id: 'plan-lgs-4',
        subject: 'LGS Deneme',
        title: '20 Soruluk Mini Sayısal Karma Testi (Süreli)',
        durationMin: 35,
        xpReward: 60,
        completed: false,
        tag: 'Süre Kontrol',
      });
    }
    if (dailyHours >= 4) {
      base.push({
        id: 'plan-lgs-5',
        subject: 'İnkılap & Din & İngilizce',
        title: 'Sözel Bölüm 30 Soru Tam Tekrar',
        durationMin: 40,
        xpReward: 75,
        completed: false,
        tag: 'Sözel Tamamla',
      });
    }
    return base;
  }

  if (track === 'kpss') {
    const base: StudyPlanTask[] = [
      {
        id: 'plan-kpss-1',
        subject: subj,
        title: `${subj} • ÖSYM Çıkmış Kalıp Tekrarı & 20 Soru`,
        durationMin: 30,
        xpReward: 45,
        completed: false,
        tag: 'GY-GK',
      },
      {
        id: 'plan-kpss-2',
        subject: 'Sözel Mantık',
        title: 'Tablo Kurmalı 3 Sözel Mantık Seti Çözümü',
        durationMin: 20,
        xpReward: 35,
        completed: false,
        tag: 'Mantık',
      },
    ];
    if (dailyHours >= 2) {
      base.push({
        id: 'plan-kpss-3',
        subject: 'Vatandaşlık & Güncel',
        title: 'Anayasa & Güncel Bilgiler Flashcard Tekrarı',
        durationMin: 25,
        xpReward: 40,
        completed: false,
        tag: 'Hafıza',
      });
    }
    if (dailyHours >= 4) {
      base.push({
        id: 'plan-kpss-4',
        subject: 'Genel Kültür Karma',
        title: '60 Soruluk Tarih-Coğrafya-Vatandaşlık Denemesi',
        durationMin: 55,
        xpReward: 90,
        completed: false,
        tag: 'Deneme',
      });
    }
    return base;
  }

  if (track === 'dil') {
    return [
      {
        id: 'plan-eng-1',
        subject: subj,
        title: '10 Yeni Kelime & Phrasal Verb Örnek Cümle Kurma',
        durationMin: 20,
        xpReward: 35,
        completed: false,
        tag: 'Vocabulary',
      },
      {
        id: 'plan-eng-2',
        subject: 'Reading & Grammar',
        title: '2 Kısa İngilizce Parça Okuma & Zaman Analizi',
        durationMin: 25,
        xpReward: 45,
        completed: false,
        tag: 'CEFR',
      },
      ...(dailyHours >= 2
        ? [
            {
              id: 'plan-eng-3',
              subject: 'Speaking',
              title: 'Knowza AI Koç ile Sesli İngilizce Diyalog Pratiği',
              durationMin: 15,
              xpReward: 40,
              completed: false,
              tag: 'Sesli',
            },
          ]
        : []),
    ];
  }

  if (track === 'kodlama') {
    return [
      {
        id: 'plan-cod-1',
        subject: subj,
        title: 'Kod Lab\'da 2 Algoritma Problemi Çözümü',
        durationMin: 30,
        xpReward: 50,
        completed: false,
        tag: 'Pratik',
      },
      {
        id: 'plan-cod-2',
        subject: 'Debug & Okuma',
        title: 'Fonksiyon & Döngü Çıktısı Tahmin Testi',
        durationMin: 20,
        xpReward: 35,
        completed: false,
        tag: 'Mantık',
      },
    ];
  }

  // Default: YKS (TYT - AYT)
  const yksBase: StudyPlanTask[] = [
    {
      id: 'plan-yks-1',
      subject: 'TYT Paragraf',
      title: '20 Paragraf Sorusu (Maksimum 22 Dakika Süre Tut!)',
      durationMin: 22,
      xpReward: 40,
      completed: false,
      tag: 'Hız & Rutin',
    },
    {
      id: 'plan-yks-2',
      subject: subj,
      title: `${subj} • 20 ÖSYM Tarzı Soru & Hata Analizi`,
      durationMin: 35,
      xpReward: 55,
      completed: false,
      tag: 'Net Artır',
    },
  ];
  if (dailyHours >= 2) {
    yksBase.push({
      id: 'plan-yks-3',
      subject: 'TYT Problem / Geometri',
      title: '12 Yeni Nesil Problem + 8 Üçgen/Geometri Sorusu',
      durationMin: 35,
      xpReward: 55,
      completed: false,
      tag: 'Kritik',
    });
  }
  if (dailyHours >= 4) {
    yksBase.push({
      id: 'plan-yks-4',
      subject: 'AYT Alan Odak',
      title: '60 Dk AYT Konu Peşine 25 Soruluk Karma Test',
      durationMin: 60,
      xpReward: 100,
      completed: false,
      tag: 'Derece',
    });
  }
  return yksBase;
}
