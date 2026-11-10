import { KahootQuestion, KahootCategory } from '../types';

export interface KahootQuizSet {
  id: KahootCategory;
  title: string;
  subtitle: string;
  icon: string;
  color: string;
  badge: string;
  questions: KahootQuestion[];
}

export const KAHOOT_QUIZ_SETS: KahootQuizSet[] = [
  {
    id: 'matematik',
    title: 'TYT & KPSS Matematik Hız Arenası',
    subtitle: '15 saniyede pratik zeka ve yeni nesil soru çözme',
    icon: '📐',
    color: 'from-emerald-500 to-green-600',
    badge: 'HIZ YARIŞI ⚡',
    questions: [
      {
        id: 'km-1',
        prompt: 'a ve b pozitif tam sayılardır. (3a + 5b) tek sayı ise a × b çarpımı kesinlikle nasıldır?',
        category: 'Matematik',
        options: ['Daima ÇİFT sayıdır', 'Daima TEK sayıdır', 'a daima çifttir', 'b daima tektir'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: '3a + 5b tek ise biri tek, diğeri çifttir. Biri çift olduğu için çarpım kesinlikle ÇİFT olur!',
        funFact: 'Knowza Ayıcık Taktik Notu: Çarpanlardan biri bile çiftse sonuç asla tek olamaz!'
      },
      {
        id: 'km-2',
        prompt: '2³ + 3² işleminin sonucu kaçtır?',
        category: 'Matematik',
        options: ['15', '17', '18', '21'],
        correctIndex: 1,
        timeLimit: 15,
        explanation: '2³ = 8 ve 3² = 9. Toplamları: 8 + 9 = 17!',
        funFact: 'Üslü sayılarda önce üsler hesaplanır, sonra toplama yapılır.'
      },
      {
        id: 'km-3',
        prompt: 'Bir sayının %20\'sinin %50\'si o sayının yüzde kaçına eşittir?',
        category: 'Matematik',
        options: ['%10', '%70', '%35', '%5'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: '(20/100) × (50/100) = 1000/10000 = %10 eder!',
        funFact: 'Yüzdeleri birbirine çarparken paydaları sadeleştirmek 5 saniye kazandırır.'
      },
      {
        id: 'km-4',
        prompt: 'En küçük iki basamaklı asal sayı kaçtır?',
        category: 'Matematik',
        options: ['11', '13', '10', '17'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: '10 çift asal değildir. 11 sadece 1 ve 11\'e bölünür, en küçük iki basamaklı asaldır.',
        funFact: '2 sayısı hem tek çift asal sayıdır hem de en küçük asaldır.'
      },
      {
        id: 'km-5',
        prompt: '5! (5 Faktöriyel) sayısının değeri kaçtır?',
        category: 'Matematik',
        options: ['120', '60', '100', '720'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: '5! = 5 × 4 × 3 × 2 × 1 = 120!',
        funFact: 'Faktöriyel sorularında 5! ve sonrasının birler basamağı daima 0\'dır.'
      }
    ]
  },
  {
    id: 'geometri',
    title: 'Geometri & Mantık Şampiyonası',
    subtitle: 'Özel üçgenler, alan ve açı sorularında ışık hızında cevapla',
    icon: '📏',
    color: 'from-amber-500 to-orange-600',
    badge: 'PİSAGOR 🏆',
    questions: [
      {
        id: 'kg-1',
        prompt: 'Dik kenar uzunlukları 9 cm ve 12 cm olan dik üçgenin hipotenüsü kaç cm\'dir?',
        category: 'Geometri',
        options: ['15 cm', '18 cm', '20 cm', '21 cm'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: '3-4-5 özel üçgeninin 3 katı: 9 - 12 - 15 üçgenidir!',
        funFact: 'Özel dik üçgenler (3-4-5, 5-12-13, 8-15-17, 7-24-25) YKS ve KPSS\'de zaman kurtarır.'
      },
      {
        id: 'kg-2',
        prompt: 'Bir üçgenin iç açıları toplamı her zaman kaç derecedir?',
        category: 'Geometri',
        options: ['180°', '360°', '90°', '270°'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'Öklid düzleminde tüm üçgenlerin iç açıları toplamı kesinlikle 180 derecedir.',
        funFact: 'Dış açılar toplamı ise tüm çokgenlerde 360 derecedir!'
      },
      {
        id: 'kg-3',
        prompt: 'Bir kenarı 6 cm olan karenin alanı kaç cm²\'dir?',
        category: 'Geometri',
        options: ['36 cm²', '24 cm²', '12 cm²', '48 cm²'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'Karenin alanı a² = 6² = 36 cm².',
        funFact: 'Çevresi ise 4 × 6 = 24 cm olurdu, karıştırmamak gerek!'
      },
      {
        id: 'kg-4',
        prompt: 'Eşkenar üçgenin her bir iç açısı kaç derecedir?',
        category: 'Geometri',
        options: ['60°', '45°', '90°', '120°'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: '180 / 3 = 60 derece!',
        funFact: 'Eşkenar üçgende yükseklik aynı zamanda hem açıortay hem kenarortaydır.'
      }
    ]
  },
  {
    id: 'kpss',
    title: 'KPSS Tarih & 2026 Güncel Bilgiler',
    subtitle: 'Devlet kurumları, UNESCO mirasları ve Türkiye uzay vizyonu',
    icon: '🏛️',
    color: 'from-blue-600 to-indigo-700',
    badge: 'GÜNCEL 2026 🚀',
    questions: [
      {
        id: 'kk-1',
        prompt: 'Uluslararası Uzay İstasyonu\'na (ISS) giderek 13 bilimsel deney yapan ilk Türk astronot kimdir?',
        category: 'Güncel Bilgi',
        options: ['Alper Gezeravcı', 'Tuva Cihangir Atasever', 'Aziz Sancar', 'Hulusi Akar'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'Ocak 2024\'te Axiom Mission 3 (Ax-3) ile uzaya giden ilk astronotumuz Alper Gezeravcı\'dır.',
        funFact: 'Tuva Cihangir Atasever ise Türkiye\'nin ikinci astronotu olarak yörünge altı uçuşunu tamamlamıştır.'
      },
      {
        id: 'kk-2',
        prompt: 'Türkiye\'nin UNESCO Dünya Mirası Listesi\'ne 20. sırada eklenen tarihi kenti neresidir?',
        category: 'KPSS',
        options: ['Gordion Antik Kenti (Ankara)', 'Göbeklitepe (Şanlıurfa)', 'Afrodisias (Aydın)', 'Ani Harabeleri (Kars)'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'Gordion (Ankara) 20. UNESCO mirası, 21. ise Anadolu\'nun Orta Çağ Ahşap Direkli Camileridir.',
        funFact: 'KPSS komisyonu son 3 yılın UNESCO miraslarını mutlaka sınavda sorar!'
      },
      {
        id: 'kk-3',
        prompt: 'Kurtuluş Savaşı\'nda "Hattı müdafaa yoktur, sathı müdafaa vardır" sözü hangi savaşta söylenmiştir?',
        category: 'Tarih',
        options: ['Sakarya Meydan Muharebesi', 'Büyük Taarruz', 'I. İnönü', 'II. İnönü'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'Mustafa Kemal Atatürk bu tarihi emri Sakarya Meydan Muharebesi\'nde (1921) vermiştir.',
        funFact: 'Sakarya Zaferi sonucunda Atatürk\'e Mareşal rütbesi ve Gazi unvanı verilmiştir.'
      }
    ]
  },
  {
    id: 'kodlama',
    title: 'Kodlama & Python Mülakat Soruları',
    subtitle: 'Yazılım şirketlerinin staj ve junior mülakatlarında sorduğu hız soruları',
    icon: '💻',
    color: 'from-purple-600 to-violet-700',
    badge: 'PYTHON & CODING ⌨️',
    questions: [
      {
        id: 'kc-1',
        prompt: 'Python\'da [1, 2, 2, 3, 4, 4] listesindeki tüm tekrarları tek satırda silmek için hangisi kullanılır?',
        category: 'Python',
        options: ['list(set(liste))', 'liste.unique()', 'liste.remove_duplicates()', 'set.filter(liste)'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'set veri yapısı küme mantığıyla çalıştığından benzersiz elemanları tutar.',
        funFact: 'set() dönüşümü O(N) zaman karmaşıklığı ile en verimli temizleme yöntemidir.'
      },
      {
        id: 'kc-2',
        prompt: 'Python\'da listeye sonuna eleman eklemek için hangi metod kullanılır?',
        category: 'Python',
        options: ['.append(x)', '.push(x)', '.add(x)', '.insert_last(x)'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'Python listelerinde sona ekleme .append(item) metoduyla yapılır (.push JavaScript\'tedir).',
        funFact: '.pop() ise son elemanı silip geri döndürür.'
      },
      {
        id: 'kc-3',
        prompt: 'Hangisi web sayfalarında dinamiklik sağlayan istemci taraflı (client-side) ana programlama dilidir?',
        category: 'Web Geliştirme',
        options: ['JavaScript', 'Python', 'C++', 'SQL'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'Tarayıcıların doğrudan çalıştırdığı evrensel dil JavaScript\'tir.',
        funFact: 'TypeScript ise JavaScript\'e tip güvenliği katarak büyük projelerin hatasız yazılmasını sağlar.'
      }
    ]
  },
  {
    id: 'karma',
    title: 'Karışık Süper Kahoot (Şampiyonlar Ligi)',
    subtitle: 'Tüm derslerden rastgele seçilen yüksek tempolu yarışma',
    icon: '⚡',
    color: 'from-rose-500 to-pink-600',
    badge: 'BÜYÜK KUPA 🏆',
    questions: [
      {
        id: 'kx-1',
        prompt: 'Türkiye\'nin ilk astronotu Alper Gezeravcı hangi uzay misyonu ile uçmuştur?',
        category: 'Güncel Bilgi',
        options: ['Ax-3 (Axiom-3)', 'Apollo 11', 'Artemis 2', 'Crew Dragon 1'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'Ocak 2024\'te Ax-3 misyonu ile uzaya fırlatılmıştır.',
        funFact: '14 gün boyunca uzayda 13 bilimsel deney yürütmüştür.'
      },
      {
        id: 'kx-2',
        prompt: 'Dik kenarları 9 ve 12 cm olan üçgenin hipotenüsü kaç cm\'dir?',
        category: 'Geometri',
        options: ['15 cm', '18 cm', '20 cm', '25 cm'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: '3-4-5 üçgeninin 3 katı = 9 - 12 - 15 üçgenidir!',
        funFact: 'Pisagor teoreminde a² + b² = c² formülü kullanılır.'
      },
      {
        id: 'kx-3',
        prompt: '"Carry out" İngilizce phrasal verb\'ünün en yakın Türkçe anlamı hangisidir?',
        category: 'İngilizce',
        options: ['Uygulamak / Yürütmek', 'Vazgeçmek', 'Ertelemek', 'İptal etmek'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: 'To carry out an experiment / reform = Bir deneyi veya reformu gerçekleştirmek/uygulamak.',
        funFact: 'Eşanlamlısı "conduct" ve "execute" kelimeleridir.'
      },
      {
        id: 'kx-4',
        prompt: 'Hangisi çift olan tek asal sayıdır?',
        category: 'Matematik',
        options: ['2', '0', '4', '6'],
        correctIndex: 0,
        timeLimit: 15,
        explanation: '2 hariç tüm çift sayılar 2\'ye bölünebildiği için asal olamaz. 2 tek çift asaldır!',
        funFact: 'Knowza Ayıcık Altın Kuralı: 2 en küçük ve tek çift asal sayıdır!'
      }
    ]
  }
];

export const MOCK_BOT_PLAYERS = [
  { name: 'Zeynep', costume: 'king' as const, baseScore: 2800 },
  { name: 'Barış_34', costume: 'cyber' as const, baseScore: 2450 },
  { name: 'Elif_Kaya', costume: 'party' as const, baseScore: 2200 },
  { name: 'Mert_Kodcu', costume: 'graduate' as const, baseScore: 1950 },
  { name: 'Can_Uzay', costume: 'astronaut' as const, baseScore: 1700 }
];
