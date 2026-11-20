import type { AiTrackId } from './geminiService';

interface HistoryMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

// ── 1. Safe Step-by-Step Math & Linear Equation Solver ───────────────────────
function trySolveMath(raw: string): string | null {
  const cleaned = raw
    .replace(/,/g, '.')
    .replace(/×|x(?=\s*\d)/gi, '*')
    .replace(/÷/g, '/')
    .trim();

  // Percentage query: "200'ün %15'i" or "200 %20"
  const pctMatch = raw.match(/(\d+(?:[.,]\d+)?)\s*(?:'?[uü]n|'?(?:i|ı|nın|nin|nun|nün))?\s*%\s*(\d+(?:[.,]\d+)?)/i)
    || raw.match(/%\s*(\d+(?:[.,]\d+)?)\s*(?:of|'\s*si)?\s*(\d+(?:[.,]\d+)?)/i);
  if (pctMatch) {
    const a = Number(pctMatch[1].replace(',', '.'));
    const b = Number(pctMatch[2].replace(',', '.'));
    if (!Number.isNaN(a) && !Number.isNaN(b)) {
      const val = (a * b) / 100;
      const formatted = Number.isInteger(val) ? String(val) : val.toFixed(2);
      return `🧮 **Adım Adım Yüzde Çözümü:**\n\n1. Formül: \`(Sayı × Yüzde) / 100\`\n2. İşlem: \`(${a} × ${b}) / 100 = ${formatted}\`\n\n✅ **Sonuç:** **${formatted}**`;
    }
  }

  // Linear equation: "3x + 5 = 20" or "2x - 4 = 10" or "5x = 35"
  const eqMatch = raw.replace(/\s+/g, '').match(/^(-?\d+)?x([+-]\d+)?=(-?\d+)$/i);
  if (eqMatch) {
    const a = eqMatch[1] === undefined ? 1 : eqMatch[1] === '-' ? -1 : Number(eqMatch[1]);
    const b = eqMatch[2] ? Number(eqMatch[2]) : 0;
    const c = Number(eqMatch[3]);
    if (a !== 0 && !Number.isNaN(a) && !Number.isNaN(b) && !Number.isNaN(c)) {
      const rhs = c - b;
      const x = rhs / a;
      const xStr = Number.isInteger(x) ? String(x) : x.toFixed(3);
      return `📐 **Adım Adım Denklem Çözümü:**\n\nVerilen: \`${a}x ${b >= 0 ? `+ ${b}` : `- ${Math.abs(b)}`} = ${c}\`\n1. Sabit sayıyı karşıya at: \`${a}x = ${c} ${b >= 0 ? `- ${b}` : `+ ${Math.abs(b)}`} = ${rhs}\`\n2. Her iki tarafı \`${a}\` ile böl: \`x = ${rhs} / ${a}\`\n\n✅ **Sonuç:** \`x = ${xStr}\``;
    }
  }

  // Square root: "√144" or "kök 72"
  const sqrtMatch = raw.match(/(?:√|kök\s*)(\d+)/i);
  if (sqrtMatch) {
    const n = Number(sqrtMatch[1]);
    if (n >= 0 && n <= 1000000) {
      const val = Math.sqrt(n);
      if (Number.isInteger(val)) {
        return `√ **Karekök Çözümü:**\n\n\`${n} = ${val} × ${val}\` olduğundan:\n✅ **√${n} = ${val}**`;
      }
      // Simplify a√b
      let outside = 1;
      let inside = n;
      for (let k = Math.floor(Math.sqrt(n)); k >= 2; k--) {
        if (n % (k * k) === 0) {
          outside = k;
          inside = n / (k * k);
          break;
        }
      }
      return `√ **Karekök Sadeleştirme:**\n\n${
        outside > 1
          ? `\`${n} = ${outside * outside} × ${inside}\` → **√${n} = ${outside}√${inside}** (yaklaşık \`${val.toFixed(2)}\`)`
          : `\`√${n}\` tam kare çarpan içermez, yaklaşık değeri **${val.toFixed(2)}** olur.`
      }`;
    }
  }

  // Pure arithmetic expression (safe whitelist: digits, + - * / ( ) . ^ spaces)
  const mathExprMatch = cleaned.match(/([0-9]+(?:\.[0-9]+)?(?:\s*[\+\-\*\/\^]\s*[0-9\(\)\.]+)+)/);
  if (mathExprMatch) {
    const expr = mathExprMatch[1].replace(/\^/g, '**').trim();
    if (/^[0-9\+\-\*\/\.\(\)\s\*]+$/.test(expr) && expr.length <= 60) {
      try {
        const fn = new Function(`"use strict"; return (${expr});`);
        const res = fn();
        if (typeof res === 'number' && Number.isFinite(res)) {
          const out = Number.isInteger(res) ? String(res) : res.toFixed(3);
          return `🧮 **Hesaplama & İşlem Önceliği:**\n\nİşlem: \`${mathExprMatch[1]}\`\n1. Önce varsa üslü ifadeler ve parantez içi, ardından çarpma/bölme, en son toplama/çıkarma yapılır.\n\n✅ **Sonuç:** **${out}**`;
        }
      } catch {
        // ignore invalid math
      }
    }
  }

  return null;
}

// ── 2. Knowledge Topics Bank ─────────────────────────────────────────────────
interface TopicRule {
  keywords: string[];
  reply: string;
}

const TOPIC_RULES: TopicRule[] = [
  // Greetings
  {
    keywords: ['merhaba', 'selam', 'naber', 'nasılsın', 'hey', 'hi', 'hello', 'bonjour', 'günaydın', 'iyi akşamlar'],
    reply: '', // Handled dynamically with varied greeting bank!
  },
  // Ehliyet / Traffic / Moto
  {
    keywords: ['hız', 'limit', 'otoyol', 'otoban', 'km/s', 'mph'],
    reply: `🚗 **Güncel Hız Limitleri Özeti (2026):**\n• **Türkiye (Otomobil B):** Şehir içi \`50\`, Şehirlerarası çift yön \`90\`, Bölünmüş yol \`110\`, Devlet otoyolu \`130\`, YİD otoyolu \`140 km/sa\`.\n• **Fransa (Code):** Şehir içi \`50\`, Tek gidiş-geliş \`80\`, Yağmurlu otoyol \`110\`, Normal otoyol \`130 km/h\`.\n• **Almanya (StVO):** Şehir içi \`50\`, Autobahn önerilen \`130 km/h\`.\n\n❓ Hangi ülke veya araç sınıfı (Araba B / Motor A) için hız kuralı sormak istersin?`,
  },
  {
    keywords: ['kavşak', 'geçiş hakkı', 'üstünlük', 'ambulans', 'itfaiye', 'polis', 'priorité'],
    reply: `🚦 **Kavşak & Geçiş Üstünlüğü Kuralı:**\n1. Görev halindeki araç sırası: **Can kurtaran (Ambulans) → İtfaiye → Polis → Sivil Savunma**.\n2. Kontrolsüz kavşakta işaretsiz kesişimde **sağdan gelen araca** (İngiltere'de sağa) yol verilir.\n3. Dönüş yapan sürücüler **karşıdan karşıya geçen yayalara** daima öncelik tanır!`,
  },
  {
    keywords: ['motor', 'motosiklet', 'fren', 'kask', 'buji', 'akü', 'radyatör', 'lastik', 'yağ'],
    reply: `🏍️ **Motor Tekniği & Motosiklet Güvenliği:**\n• **Frenleme:** Motosiklette durma gücünün ~**%70'i ön fren**, **%30'u arka fren** ile dengeli yapılır.\n• **Ateşleme:** Benzinli motorlarda karışımı **buji**, dizelde ise yüksek basınçla ısınan hava ateşler.\n• **Soğutma & Yağlama:** Hararet göstergesi yükselirse radyatör suyu/termostat; yağ lambası yanarsa motor hemen stop edilir!`,
  },
  {
    keywords: ['ilk yardım', 'kalp masajı', 'turnike', 'koma', 'şok', 'heimlich', 'abc'],
    reply: `🚑 **Ehliyet İlk Yardım Altın Rakamları:**\n• **Kalp Masajı (Yetişkin):** **30 bası / 2 suni solunum**, göğüs **5 cm** çökmeli, hız dakikada **100-120 bası**.\n• **112 Acil** aramasında önce adres ve yaralı sayısı net verilir.\n• **Bilinci kapalı ama solunumu varsa:** **Koma (yarı yüzükoyun yan yatış)** pozisyonu verilir!`,
  },
  // Math & Science & Humanities
  {
    keywords: ['türev', 'integral', 'limit', 'ekstremum'],
    reply: `📈 **AYT Türev & İntegral Hızlı Özet:**\n• **Türev:** \`f(x) = xⁿ\` ise \`f'(x) = n·xⁿ⁻¹\`. Zincir kuralında dışın türevi × içinin türevi alınır!\n• **Ekstremum:** \`f'(x) = 0\` noktalarında işaret \`+\` → \`-\` değişirse **yerel maksimum**, \`-\` → \`+\` değişirse **yerel minimum** vardır.\n• **İntegral:** Türevin tersidir (` + '`∫ xⁿ dx = xⁿ⁺¹/(n+1) + C`' + `). Çözmek istediğin belirli bir fonksiyon varsa yaz!`,
  },
  {
    keywords: ['logaritma', 'ln', 'üstel'],
    reply: `🔢 **Logaritma Altın Kuralları:**\n• \`log_a(b·c) = log_a(b) + log_a(c)\`\n• \`log_a(b/c) = log_a(b) - log_a(c)\`\n• \`log_a(bⁿ) = n·log_a(b)\`\n• **Tanım Şartı (ÖSYM Tuzağı!):** Taban \`a > 0\` ve \`a ≠ 1\`, iç kısım \`b > 0\` olmak zorundadır!`,
  },
  {
    keywords: ['üçgen', 'pisagor', 'geometri', 'açı', 'trigonometri', 'sin', 'cos', 'tan'],
    reply: `📐 **Geometri & Trigonometri Hap Bilgileri:**\n• **Özel Dik Üçgenler:** \`3-4-5\`, \`5-12-13\`, \`8-15-17\`, \`7-24-25\` (katlarını görür görmez işaretle!).\n• **30-60-90:** 30° karşısı \`a\`, 60° karşısı \`a√3\`, 90° karşısı \`2a\`.\n• **Trigonometri Temeli:** \`sin²x + cos²x = 1\` ve \`tanx = sinx / cosx\`.`,
  },
  {
    keywords: ['fizik', 'newton', 'kuvvet', 'ivme', 'enerji', 'elektrik', 'ohm', 'optik', 'basınç'],
    reply: `⚛️ **Fizik Temel Formül Kutusu:**\n• **Dinamik:** \`F_net = m · a\`\n• **Mekanik Enerji:** \`E_k = ½ m v²\` ve \`E_p = m g h\` (sürtünmesiz ortamda toplam enerji korunur!).\n• **Elektrik (Ohm):** \`V = I · R\`, elektriksel güç \`P = V · I\`. Hangi konudan soru çözelim?`,
  },
  {
    keywords: ['kimya', 'mol', 'atom', 'periyodik', 'asit', 'baz', 'ph', 'tepkime'],
    reply: `🧪 **Kimya Kritik Notlar:**\n• **Mol:** \`n = m / M_A\` ve normal koşullarda (NŞA) \`1 mol gaz = 22,4 L\`.\n• **pH Ölçeği:** \`pH < 7\` → **Asit** (turnusolu kırmızıya), \`pH = 7\` → **Nötr**, \`pH > 7\` → **Baz** (turnusolu maviye çevirir).\n• **Periyodik Tablo:** Soldan sağa atom yarıçapı genelde küçülür, iyonlaşma enerjisi artar.`,
  },
  {
    keywords: ['biyoloji', 'hücre', 'mitokondri', 'dna', 'rna', 'mitoz', 'mayoz', 'fotosentez', 'solunum'],
    reply: `🧬 **Biyoloji Sınav Özeti:**\n• **Mitokondri:** Oksijenli solunumla ATP üretir, kendi DNA/RNA'sı vardır.\n• **Ribozom:** Tüm canlılarda (prokaryot + ökaryot) bulunan zarsız protein sentezi organelidir.\n• **Mitoz vs Mayoz:** Mitozda kromozom sayısı sabit kalır (\`2n → 2n\`, 2 hücre), Mayozda yarıya iner (\`2n → n\`, 4 hücre ve krossing-over ile çeşitlilik!).`,
  },
  {
    keywords: ['program', 'plan', 'net', 'nasıl çalış', 'motivasyon', 'odak', 'kaç saat', 'sınav'],
    reply: `📅 **Yüksek Verimli Çalışma Taktiği:**\n1. **Pomodoro + Karma Blok:** 45 dk ders + 10 dk mola. Her gün mutlaka **Paragraf/Okuma + Problem** çöz.\n2. **Hata Defteri Kuralı:** Yanlış yaptığın soruyu o akşam ve 3 gün sonra tekrar çözmeden geçme — netler burada artar!\n3. **Deneme Analizi:** Hangi derste yanlış değil **boş/zaman kaybı** varsa haftalık odağını oraya çevir.`,
  },
  {
    keywords: ['tense', 'grammar', 'ingilizce', 'phrasal', 'passive', 'if clause', 'kelime'],
    reply: `🇬🇧 **İngilizce Dilbilgisi İpuçları:**\n• **If Clause Type 1 (Gerçek olasılık):** \`If + Present Simple, will + V1\` (*If you study, you will succeed.*)\n• **If Clause Type 2 (Hayali şu an):** \`If + Past Simple (were), would + V1\`\n• **If Clause Type 3 (Geçmiş pişmanlık):** \`If + had V3, would have V3\`\n✍️ Örnek bir İngilizce cümle yaz, hemen düzeltip analiz edeyim!`,
  },
  {
    keywords: ['python', 'javascript', 'react', 'html', 'css', 'sql', 'kod', 'döngü', 'for', 'while', 'bug', 'hata'],
    reply: `💻 **Yazılım & Debug Rehberi:**\n• **Python Döngü:** Liste elemanları için \`for item in items:\`, şart sağlanana kadar \`while kosul:\` kullan.\n• **JavaScript:** Sabitler için \`const\`, değişenler için \`let\` kullan; asenkron API çağrılarında \`async / await + try / catch\` yaz.\n🛠️ Hata aldığın kod parçasını buraya yapıştır, satır satır inceleyelim!`,
  },
];

const GREETINGS_TR = [
  'Selam! 🐻🎓 Bugün hangi konuya odaklanıyoruz? İstersen bir matematik sorusu yaz, istersen Ehliyet/YKS/LGS/KPSS sorusu sor!',
  'Merhaba şampiyon! 🍯 Hangi konuda takıldın? Tarih, kimya, matematik denklemi ya da araba/motor ehliyet kurallarından hemen başlayabiliriz.',
  'Hoş geldin! ✨ Hazırım — bana çözmem için bir soru sor, terim anlamı iste veya "bana bir soru sor" de!',
];

const ROTATING_PRACTICE_BY_TRACK: Record<AiTrackId, string[]> = {
  yks: [
    '🔥 **Hızlı YKS Mini Sorusu:**\nBir sayının %20 fazlası ile %10 eksiğinin toplamı 210 olduğuna göre bu sayı kaçtır?\n*(İpucu: Sayıya 100x de -> 120x + 90x = 210x!)*',
    '📘 **TYT Türkçe Kritik Kural:**\nÖSYM cümlede anlatım bozukluğu veya yazım kurallarında **"şey"** kelimesinin her zaman **ayrı** yazıldığını (*her şey, bir şey*), **"pek çok"** ve **"birkaç"** kalıplarının farkını çok sık sorar!',
    '📐 **AYT Matematik İpucu:**\nİkinci dereceden \`ax² + bx + c = 0\` denkleminde kökler toplamı \`x₁ + x₂ = -b/a\`, kökler çarpımı \`x₁ · x₂ = c/a\` formülüyle kök bulmadan soruyu 10 saniyede çözdürür.',
  ],
  lgs: [
    '📘 **LGS Hızlı Mini Sorusu:**\nAralarında asal iki sayının EKOK\'u 72 ve bu sayılardan biri 8 ise diğeri kaçtır?\n*(İpucu: Aralarında asal iki sayının çarpımı = EKOK\'larıdır!)*',
    '⚡ **LGS Fen İpucu:**\n21 Haziran\'da Kuzey Yarım Küre\'de en uzun gündüz, 21 Aralık\'ta en uzun gece yaşanır. Eksen eğikliği olmasaydı mevsimler oluşmazdı!',
    '🎯 **LGS Paragraf Kuralı:**\n"Bu metinden aşağıdakilerden hangisine ulaşılabilir?" sorularında kendi yorumunu asla katma; sadece metinde yazanı ara!',
  ],
  kpss: [
    '🏛️ **KPSS Hızlı Mini Sorusu:**\nTBMM\'de yapılan seçimlerin ardından kanunları onaylayıp Resmî Gazete\'de yayımlama görevini yerine getiren makam hangisidir? (*Cumhurbaşkanı • 15 gün inceleme süresi!*)',
    '🗺️ **KPSS Coğrafya Şifresi:**\nTürkiye\'deki **Kırık Dağlar (Horst-Graben)** kodlaması: **K**az - **M**adra - **Y**unt - **B**oz - **A**ydın - **M**enteşe (**K**a**M**i**Y**on **B**ak **A**l **M**otor)!',
    '📜 **KPSS Tarih Notu:**\nMisak-ı Millî kararları **Son Osmanlı Mebusan Meclisi**\'nde kabul edilmiş, bunun üzerine İtilaf Devletleri 16 Mart 1920\'de İstanbul\'u resmen işgal etmiştir.',
  ],
  ehliyet: [
    '🚗 **2026 Ehliyet Mini Sorusu:**\nİki yönlü dar yolda aksine bir işaret yoksa hangi araç diğerine geçiş kolaylığı sağlamak zorundadır?\n*(Cevap: Otomobiller kamyona/otobüse, motorsuz araçlar motorlu araçlara, inen sürücü çıkan sürücüye yol verir!)*',
    '🏍️ **Motosiklet Sınav İpucu:**\nViraja girmeden önce hız mutlaka düşürülür ve vites küçültülür; viraj içinde ani ön fren yapmak tekerleğin kaymasına yol açar!',
    '🚑 **İlk Yardım Sorusu:**\nKırık veya çıkık tespitinde eklem bölgesi düzeltilmeye çalışılmadan bulunduğu pozisyonda atellenerek sabitlenir; turnike yalnızca uzuv kopması veya durdurulamayan atardamar kanamasında uygulanır.',
  ],
  dil: [
    '🇬🇧 **Mini Grammar Challenge:**\nWhich one is correct?\nA) *I have been knowing him for 5 years.*\nB) *I have known him for 5 years.*\n✅ Doğru cevap **B**! ("know" gibi stative fiiller *-ing* almaz.)',
    '💬 **Konuşma Kalıbı:**\nTürkçedeki "Boş ver / Sorun değil" yerine doğal İngilizcede **"Never mind"** veya **"No worries, it happens!"** kullanabilirsin.',
    '🌍 **Kelime Hafıza Kutu:**\n• *Compulsory* = Zorunlu (= Mandatory)\n• *Obstacles* = Engeller\n• *Crucial* = Çok kritik / hayati\nBunlardan biriyle kısa bir cümle yaz, kontrol edeyim!',
  ],
  kodlama: [
    '💻 **Python Mini Soru:**\n`nums = [10, 20, 30, 40]` listesinde `nums[-2:]` çıktısı ne olur?\n✅ Cevap: `[30, 40]` (Negatif indeks sondan sayar!)',
    '⚡ **JavaScript İpucu:**\n`===` hem değeri hem veri tipini karşılaştırır (`5 === "5"` → `false`), `==` ise tip dönüşümü yaptığı için bug çıkarabilir — her zaman `===` kullan!',
    '🧠 **Algoritma Sorusu:**\nSıralı bir dizide eleman ararken **Linear Search** `O(n)` sürede çalışırken **Binary Search** `O(log n)` sürede 1 milyon elemanlı diziyi en fazla ~20 adımda tarar!',
  ],
};

// ── 3. Live Wikipedia Lookup (Turkish / English) ─────────────────────────────
async function lookupWikipediaSummary(userText: string): Promise<string | null> {
  const cleanQuery = userText
    .replace(/\b(nedir|kimdir|ne demek|ne zaman|nerededir|hakkında bilgi ver|anlat|açıkla|özetle|what is|who is)\b/gi, '')
    .replace(/[?!.]/g, ' ')
    .trim();

  if (cleanQuery.length < 3 || cleanQuery.split(/\s+/).length > 7) {
    return null;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 3500);

  try {
    const searchUrl = `https://tr.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
      cleanQuery
    )}&utf8=&format=json&srlimit=1&origin=*`;
    const searchRes = await fetch(searchUrl, { signal: controller.signal });
    if (!searchRes.ok) return null;
    const searchData = await searchRes.json();
    const topTitle: string | undefined = searchData?.query?.search?.[0]?.title;
    if (!topTitle) return null;

    const summaryUrl = `https://tr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topTitle)}`;
    const sumRes = await fetch(summaryUrl, { signal: controller.signal });
    if (!sumRes.ok) return null;
    const sumData = await sumRes.json();
    const extract: string | undefined = sumData?.extract;
    if (!extract || extract.length < 25) return null;

    const trimmedExtract = extract.length > 420 ? extract.slice(0, 417) + '...' : extract;
    return `📚 **${sumData.title || topTitle} Hakkında Net Özet:**\n\n${trimmedExtract}\n\n💡 *Bu konuyla ilgili bana örnek test sorusu hazırlamamı da isteyebilirsin!*`;
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
  }
}

// ── 4. Main Intelligent Fallback Coach with Anti-Repeat Protection ───────────
export async function generateSmartCoachReply(
  userText: string,
  track: AiTrackId,
  history: HistoryMessage[],
  options?: { hasImage?: boolean; trackTitle?: string; expertTitle?: string; trackBadge?: string }
): Promise<string> {
  const recentReplies = new Set(
    history
      .filter((m) => m.role === 'model')
      .slice(-4)
      .map((m) => m.parts?.[0]?.text || '')
  );

  const pickNonRepeating = (candidates: string[]): string => {
    for (const c of candidates) {
      if (!recentReplies.has(c)) return c;
    }
    return candidates[Math.floor(Math.random() * candidates.length)];
  };

  if (options?.hasImage) {
    return `📸 **${options.trackTitle || track.toUpperCase()} Görseli Alındı!**\n\n1️⃣ **Soru Kökü & Verilenler:** Fotoğraftaki soru cümlesini veya sayısal değerleri buraya metin olarak da yazarsan (ör. \`3x + 5 = 20\`) **anında hesaplayıp adım adım çözebilirim**.\n2️⃣ **Canlı Gemini Görsel OCR:** Gerçek fotoğraf okuma için ayarlardan ücretsiz Gemini API anahtarı veya sunucu \`GEMINI_API_KEY\` bağlantısı aktif edilirse fotoğrafı tek tıkla okurum.`;
  }

  const lower = userText.toLowerCase().trim();

  // 1. Check greetings first
  const greetingWords = ['merhaba', 'selam', 'naber', 'nasılsın', 'sa', 'slm', 'hey', 'hi', 'hello', 'günaydın'];
  const tokens = lower.replace(/[!?.,]/g, ' ').split(/\s+/).filter(Boolean);
  if (tokens.some((t) => greetingWords.includes(t)) && tokens.length <= 5) {
    return pickNonRepeating(GREETINGS_TR);
  }

  if (lower.includes('teşekkür') || lower.includes('sağol') || lower.includes('eyvallah') || lower.includes('thanks')) {
    return pickNonRepeating([
      'Rica ederim şampiyon! 🐻💛 Takıldığın başka bir konu veya soru olursa hemen sor!',
      'Her zaman buradayım! 🍯 İstersen sıradaki soruya veya konu özetine geçelim.',
    ]);
  }

  // 2. Built-in Math & Equation Solver
  const mathSolved = trySolveMath(userText);
  if (mathSolved && !recentReplies.has(mathSolved)) {
    return mathSolved;
  }

  // 3. Topic Keyword Matching
  for (const rule of TOPIC_RULES) {
    if (!rule.reply) continue;
    if (rule.keywords.some((kw) => lower.includes(kw))) {
      if (!recentReplies.has(rule.reply)) {
        return rule.reply;
      }
    }
  }

  // 4. Live Wikipedia Lookup for any factual question ("tanzimat", "mitokondri", "newton", etc.)
  const wikiAnswer = await lookupWikipediaSummary(userText);
  if (wikiAnswer && !recentReplies.has(wikiAnswer)) {
    return wikiAnswer;
  }

  // 5. Practice Question / Interactive Prompt Pool (never repeats!)
  const trackPool = ROTATING_PRACTICE_BY_TRACK[track] || ROTATING_PRACTICE_BY_TRACK.yks;
  const tailoredEcho = `🐻 **"${userText.slice(0, 60)}${userText.length > 60 ? '...' : ''}" için ${options?.trackTitle || track.toUpperCase()} Koçu Önerisi:**\n\n` +
    pickNonRepeating(trackPool);

  if (!recentReplies.has(tailoredEcho)) {
    return tailoredEcho;
  }

  return pickNonRepeating(trackPool);
}
