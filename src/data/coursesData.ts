import { Course } from '../types';

export const COURSES: Course[] = [
  // ==========================================
  // 1. YKS (TYT - AYT)
  // ==========================================
  {
    id: 'yks',
    name: 'YKS (TYT - AYT)',
    subTitle: '2025 - 2026 Üniversite Sınavı Hazırlık',
    icon: '🎓',
    badge: 'En Popüler',
    color: '#58cc02',
    accentColor: '#46a302',
    units: [
      {
        id: 'yks-u1',
        number: 1,
        title: 'TYT Matematik: Temel Sayılar & Mantık',
        description: 'Tek/Çift sayılar, asal sayılar, bölünebilme ve ardışık sayılar',
        color: '#58cc02',
        lessons: [
          {
            id: 'yks-u1-l1',
            unitId: 'yks-u1',
            title: 'Sayı Kümeleri & Tek/Çift Sayılar',
            description: 'Temel kavramlar ve tek-çift sayıların çarpım/toplam kuralları.',
            xpReward: 20,
            gemReward: 5,
            type: 'lesson',
            summaryNotes: [
              'Tek ± Tek = Çift',
              'Tek × Tek = Tek',
              'Çarpımın tek olması için tüm çarpanların tek olması şarttır!',
              'İki çift sayının toplamı daima çifttir.'
            ],
            questions: [
              {
                id: 'yks-q1',
                type: 'multiple_choice',
                prompt: 'a ve b pozitif tam sayılardır. (3a + 5b) ifadesinin sonucu TEK sayı olduğuna göre, aşağıdakilerden hangisi DAİMA DOĞRUDUR?',
                difficulty: 'orta',
                hint: 'İki sayının toplamı tek ise, biri tek diğeri çift olmalıdır.',
                explanation: '3a ve 5b sayılarından biri tek, diğeri çifttir. Dolayısıyla a ve b sayılarından biri tek, biri çifttir (biri T, diğeri Ç). Bu durumda (a × b) çarpımı bir çift çarpan içerdiği için kesinlikle ÇİFT olur.',
                options: [
                  { id: 'opt1', text: 'a × b çarpımı daima çifttir', isCorrect: true },
                  { id: 'opt2', text: 'a daima tek sayıdır', isCorrect: false },
                  { id: 'opt3', text: 'b daima çift sayıdır', isCorrect: false },
                  { id: 'opt4', text: 'a + b toplamı tek sayıdır', isCorrect: false }
                ]
              },
              {
                id: 'yks-q2',
                type: 'matching',
                prompt: 'Sayı kümeleri sembollerini anlamlarıyla doğru eşleştirin:',
                difficulty: 'kolay',
                explanation: 'N: Doğal Sayılar (0, 1, 2...), Z: Tam Sayılar (...-1, 0, 1...), Q: Rasyonel Sayılar, R: Gerçek Sayılar',
                pairs: [
                  { id: 'p1', left: 'ℕ (N)', right: 'Doğal Sayılar' },
                  { id: 'p2', left: 'ℤ (Z)', right: 'Tam Sayılar' },
                  { id: 'p3', left: 'ℚ (Q)', right: 'Rasyonel Sayılar' },
                  { id: 'p4', left: 'ℝ (R)', right: 'Reel (Gerçek) Sayılar' }
                ]
              },
              {
                id: 'yks-q3',
                type: 'true_false',
                prompt: 'Asal sayılar hakkında verilen ifade doğru mu yanlış mı?',
                statement: '2 sayısı hem en küçük asal sayıdır, hem de tek çift asal sayıdır.',
                correctAnswer: true,
                explanation: 'Harika! 2 tek çift asal sayıdır. 2\'den başka hiçbir çift sayı asal olamaz çünkü hepsi 2\'ye bölünür.'
              },
              {
                id: 'yks-q4',
                type: 'multiple_choice',
                prompt: 'x negatif bir tam sayı olduğuna göre, aşağıdakilerden hangisinin sonucu daima POZİTİF bir sayıdır?',
                difficulty: 'kolay',
                explanation: 'Negatif bir sayının çift kuvvetleri her zaman pozitiftir: (-2)² = +4. Tek kuvvetleri negatiftir: (-2)³ = -8.',
                options: [
                  { id: 'o1', text: 'x³ (x üzeri 3)', isCorrect: false },
                  { id: 'o2', text: 'x² (x kare)', isCorrect: true },
                  { id: 'o3', text: '2x', isCorrect: false },
                  { id: 'o4', text: 'x - 5', isCorrect: false }
                ]
              }
            ]
          },
          {
            id: 'yks-u1-l2',
            unitId: 'yks-u1',
            title: 'Asal Sayılar & Ardışık Sayılar',
            description: 'Ardışık sayıların toplam formülleri ve aralarında asallık kuralları.',
            xpReward: 25,
            gemReward: 8,
            type: 'lesson',
            questions: [
              {
                id: 'yks-q5',
                type: 'multiple_choice',
                prompt: '1\'den 20\'ye kadar olan ardışık doğal sayıların toplamı kaçtır? [1 + 2 + 3 + ... + 20]',
                difficulty: 'kolay',
                hint: 'Gauss Toplam Formülü: [n × (n + 1)] / 2',
                explanation: 'Gauss formülü ile: (20 × 21) / 2 = 10 × 21 = 210 bulunur.',
                options: [
                  { id: 'opt1', text: '210', isCorrect: true },
                  { id: 'opt2', text: '200', isCorrect: false },
                  { id: 'opt3', text: '220', isCorrect: false },
                  { id: 'opt4', text: '190', isCorrect: false }
                ]
              },
              {
                id: 'yks-q6',
                type: 'matching',
                prompt: 'Aralarında asal sayı çiftlerini eşleştirin:',
                difficulty: 'orta',
                explanation: 'Aralarında asal iki sayının 1 dışında ortak pozitif böleni yoktur.',
                pairs: [
                  { id: 'p1', left: '8 ve 15', right: 'Ortak bölenleri yalnızca 1\'dir' },
                  { id: 'p2', left: '12 ve 18', right: 'Ortak bölenleri 6\'dır (Asal Değil)' },
                  { id: 'p3', left: '9 ve 10', right: 'Ardışık sayılar daima aralarında asaldır' }
                ]
              },
              {
                id: 'yks-q7',
                type: 'multiple_choice',
                prompt: 'Dört basamaklı 4A7B sayısı 10 ile bölündüğünde 3 kalanını veriyor. Bu sayı 9 ile tam bölünebildiğine göre A kaçtır?',
                difficulty: 'orta',
                explanation: '10 ile bölümünden kalan 3 ise birler basamağı B = 3 olur. Sayı 4A73 oldu. 9 ile tam bölünmesi için rakamlar toplamı 9\'un katı olmalıdır: 4 + A + 7 + 3 = 14 + A = 18 ➔ A = 4.',
                options: [
                  { id: 'a1', text: '4', isCorrect: true },
                  { id: 'a2', text: '5', isCorrect: false },
                  { id: 'a3', text: '2', isCorrect: false },
                  { id: 'a4', text: '6', isCorrect: false }
                ]
              }
            ]
          },
          {
            id: 'yks-u1-chest',
            unitId: 'yks-u1',
            title: 'Sayılar Sandığı 🎁',
            description: 'Matematik temellerini sağlamlaştırdığın için ödül sandığı!',
            xpReward: 50,
            gemReward: 25,
            type: 'chest',
            questions: []
          },
          {
            id: 'yks-u1-boss',
            unitId: 'yks-u1',
            title: 'Ünite Sonu Şampiyonluk Sınavı',
            description: 'Tüm ünite kazanımlarını ölçen zorlu TYT meydan okuması!',
            xpReward: 40,
            gemReward: 15,
            type: 'boss',
            questions: [
              {
                id: 'yks-boss-1',
                type: 'multiple_choice',
                prompt: 'a, b ve c ardışık çift tam sayılardır (a < b < c). Buna göre [(c - a) × (c - b)] / (b - a) işleminin sonucu kaçtır?',
                difficulty: 'zor',
                explanation: 'Ardışık çift sayılar arasında 2 fark vardır. a = 2, b = 4, c = 6 seçebiliriz. c - a = 4, c - b = 2, b - a = 2. (4 × 2) / 2 = 4 bulunur!',
                options: [
                  { id: 'b1', text: '4', isCorrect: true },
                  { id: 'b2', text: '2', isCorrect: false },
                  { id: 'b3', text: '8', isCorrect: false },
                  { id: 'b4', text: '1', isCorrect: false }
                ]
              },
              {
                id: 'yks-boss-2',
                type: 'true_false',
                prompt: 'Aralarında asal iki sayının EBOB\'u daima 1\'dir.',
                statement: 'Aralarında asal a ve b sayıları için EBOB(a, b) = 1\'dir.',
                correctAnswer: true,
                explanation: 'Doğru! Aralarında asal sayıların 1 dışında pozitif ortak böleni yoktur.'
              }
            ]
          }
        ]
      },
      {
        id: 'yks-u2',
        number: 2,
        title: 'TYT Türkçe: Paragrafta Hız & Taktikler',
        description: 'ÖSYM yeni nesil paragraf analizi, ana düşünce ve akış bozma',
        color: '#1cb0f6',
        lessons: [
          {
            id: 'yks-u2-l1',
            unitId: 'yks-u2',
            title: 'Ana Düşünceyi Nokta Atışı Yakalama',
            description: 'Vurgulanan asıl düşünceyi anahtar kelimelerle 30 saniyede tespit etme.',
            xpReward: 20,
            gemReward: 5,
            type: 'lesson',
            questions: [
              {
                id: 'yks-t1',
                type: 'multiple_choice',
                prompt: '"Yazmak, içimizdeki karmaşayı düzene sokmanın en zarif yoludur. Kağıda dökülmeyen her düşünce bir gün unutulmaya mahkumdur." Bu parçada yazarın asıl anlatmak istediği nedir?',
                difficulty: 'orta',
                explanation: 'Yazar yazmanın hem zihinsel düzeni sağladığını hem de düşünceleri kalıcı kıldığını vurgulamaktadır.',
                options: [
                  { id: 't1', text: 'Yazı, düşünceleri somutlaştırarak kalıcı kılar ve zihni düzenler', isCorrect: true },
                  { id: 't2', text: 'Sadece yetenekli insanlar yazı yazabilir', isCorrect: false },
                  { id: 't3', text: 'Unutulan düşünceler önemsizdir', isCorrect: false },
                  { id: 't4', text: 'Konuşmak yazmaktan daha etkilidir', isCorrect: false }
                ]
              },
              {
                id: 'yks-t2',
                type: 'matching',
                prompt: 'Anlatım tekniklerini tanımlarıyla eşleştirin:',
                difficulty: 'kolay',
                explanation: 'Öyküleme olay anlatır, betimleme kelimelerle resim çizer, tartışma okuyucunun fikrini değiştirmeye çalışır.',
                pairs: [
                  { id: 'p1', left: 'Öyküleme', right: 'Zaman ve olay akışı (film şeridi gibi)' },
                  { id: 'p2', left: 'Betimleme', right: 'Sıfatlarla niteleme (fotoğraf karesi gibi)' },
                  { id: 'p3', left: 'Tartışmacı Anlatım', right: 'Karşıt fikirleri çürütüp kendi görüşünü savunma' }
                ]
              },
              {
                id: 'yks-t3',
                type: 'true_false',
                prompt: 'Paragraf çözerken önce soru kökünü okumak gerekir mi?',
                statement: 'Paragraf sorularında önce metni değil, soru kökünü okumak zamandan kazandırır ve hedefe odaklanmayı sağlar.',
                correctAnswer: true,
                explanation: 'Kesinlikle doğru! Önce soru kökünü okuyarak paragrafta ne aradığınızı bilirsiniz.'
              }
            ]
          }
        ]
      },
      {
        id: 'yks-u3',
        number: 3,
        title: 'TYT Fen: Fizik & Biyoloji Banko Netler',
        description: 'Kuvvet-hareket, eylemsizlik ve hücre organelleri püf noktaları',
        color: '#ff9600',
        lessons: [
          {
            id: 'yks-u3-l1',
            unitId: 'yks-u3',
            title: 'Fizik: Newton Hareket Yasaları',
            description: 'Eylemsizlik prensibi, F = m.a ve etki-tepki kanunları.',
            xpReward: 25,
            gemReward: 8,
            type: 'lesson',
            questions: [
              {
                id: 'yks-f1',
                type: 'multiple_choice',
                prompt: 'Sürtünmesiz yatay düzlemde sabit 20 m/s hızla gitmekte olan bir cisme etki eden net kuvvet kaç Newton\'dur?',
                difficulty: 'kolay',
                explanation: 'Hız sabit ise ivme sıfırdır (a = 0). F_net = m × a formülünden F_net = 0 N olur.',
                options: [
                  { id: 'f1', text: '0 N', isCorrect: true },
                  { id: 'f2', text: '20 N', isCorrect: false },
                  { id: 'f3', text: '10 N', isCorrect: false },
                  { id: 'f4', text: '9.8 N', isCorrect: false }
                ]
              },
              {
                id: 'yks-f2',
                type: 'matching',
                prompt: 'Organelleri hücredeki temel görevleriyle eşleştirin:',
                difficulty: 'orta',
                explanation: 'Mitokondri enerji, kloroplast fotosentez, ribozom protein sentezi yapar.',
                pairs: [
                  { id: 'b1', left: 'Mitokondri', right: 'Oksijenli Solunum & ATP Üretimi' },
                  { id: 'b2', left: 'Ribozom', right: 'Protein Sentezi (Tüm Canlılarda Ortak)' },
                  { id: 'b3', left: 'Kloroplast', right: 'Fotosentez ile Besin ve Oksijen Üretimi' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 2. KODLAMA & YAZILIM
  // ==========================================
  {
    id: 'kodlama',
    name: 'Kodlama & Yazılım',
    subTitle: 'Python, JavaScript, Algoritmalar & Yapay Zeka',
    icon: '💻',
    badge: 'Geleceğin Mesleği',
    color: '#af72ff',
    accentColor: '#9047ff',
    units: [
      {
        id: 'kod-u1',
        number: 1,
        title: 'Python Temelleri & Söz Dizimi',
        description: 'Değişkenler, dinamik tipleme, string metodları ve operatörler',
        color: '#af72ff',
        lessons: [
          {
            id: 'kod-u1-l1',
            unitId: 'kod-u1',
            title: 'Değişkenler ve Ekrana Yazdırma',
            description: 'Python syntax yapısı ve temel konsol çıktıları.',
            xpReward: 20,
            gemReward: 5,
            type: 'lesson',
            summaryNotes: [
              'print("Metin"): Ekrana metin yazar.',
              'Değişken tanımlarken tip belirtmeye gerek yoktur (Dinamik tip).',
              'str: Metin, int: Tam sayı, float: Ondalıklı sayı, bool: True/False'
            ],
            questions: [
              {
                id: 'code-q1',
                type: 'code_fill',
                prompt: 'Python\'da ekrana "Merhaba AkademiGO!" yazdırmak için eksik fonksiyonu tamamlayın:',
                codeSnippet: '___("Merhaba AkademiGO!")',
                blankId: 'print',
                options: ['print', 'console.log', 'echo', 'display'],
                correctAnswer: 'print',
                explanation: 'Python\'da standart çıktı vermek için yerleşik print() fonksiyonu kullanılır.'
              },
              {
                id: 'code-q2',
                type: 'multiple_choice',
                prompt: 'x = "15" ve y = 5 olduğunda type(x) ve type(y) sırasıyla nedir?',
                difficulty: 'kolay',
                explanation: 'Tırnak içerisindeki değerler string (str), tırnaksız tam sayılar integer (int) veri tipindedir.',
                options: [
                  { id: 'c1', text: 'str ve int', isCorrect: true },
                  { id: 'c2', text: 'int ve str', isCorrect: false },
                  { id: 'c3', text: 'int ve float', isCorrect: false },
                  { id: 'c4', text: 'str ve float', isCorrect: false }
                ]
              },
              {
                id: 'code-q3',
                type: 'matching',
                prompt: 'Python veri tiplerini örnekleriyle eşleştirin:',
                difficulty: 'kolay',
                explanation: 'int: tam sayı, float: ondalıklı, bool: mantıksal, list: sıralı koleksiyon.',
                pairs: [
                  { id: 'cp1', left: '42', right: 'int (Tam sayı)' },
                  { id: 'cp2', left: '3.14', right: 'float (Ondalıklı)' },
                  { id: 'cp3', left: 'True', right: 'bool (Mantıksal)' },
                  { id: 'cp4', left: '["elma", "armut"]', right: 'list (Liste)' }
                ]
              },
              {
                id: 'code-q4',
                type: 'true_false',
                prompt: 'Python\'da değişken adları bir rakam ile başlayabilir mi?',
                statement: 'Python değişken adları (örneğin 1sayi = 10) rakamla başlayabilir.',
                correctAnswer: false,
                explanation: 'Doğru! Değişken adları harf veya alt çizgi (_) ile başlamalıdır, rakamla başlayamaz!'
              }
            ]
          },
          {
            id: 'kod-u1-l2',
            unitId: 'kod-u1',
            title: 'Döngüler & Koşullar (if/else)',
            description: 'Karar yapıları ve for/while döngüleri ile program akışını yönetme.',
            xpReward: 25,
            gemReward: 8,
            type: 'lesson',
            questions: [
              {
                id: 'code-q5',
                type: 'code_fill',
                prompt: 'Bir sayının 10\'dan büyük olup olmadığını kontrol etmek için eksik anahtar kelimeyi seçin:',
                codeSnippet: 'sayi = 15\n___ sayi > 10:\n    print("Büyük")',
                blankId: 'if',
                options: ['if', 'while', 'check', 'when'],
                correctAnswer: 'if',
                explanation: 'Koşullu ifadeler için "if" anahtar sözcüğü kullanılır.'
              },
              {
                id: 'code-q6',
                type: 'multiple_choice',
                prompt: 'for i in range(3): print(i) kodunun çıktısı ne olur?',
                difficulty: 'orta',
                explanation: 'range(3), 0\'dan başlayarak 3\'e kadar (3 hariç) 0, 1, 2 değerlerini üretir.',
                options: [
                  { id: 'r1', text: '0 1 2', isCorrect: true },
                  { id: 'r2', text: '1 2 3', isCorrect: false },
                  { id: 'r3', text: '0 1 2 3', isCorrect: false },
                  { id: 'r4', text: '3', isCorrect: false }
                ]
              }
            ]
          },
          {
            id: 'kod-u1-chest',
            unitId: 'kod-u1',
            title: 'Geliştirici Sandığı 🎁',
            description: 'İlk kodlama adımlarını başarıyla tamamladın!',
            xpReward: 50,
            gemReward: 30,
            type: 'chest',
            questions: []
          }
        ]
      },
      {
        id: 'kod-u2',
        number: 2,
        title: 'Veri Yapıları & Algoritmalar',
        description: 'Listeler, Sözlükler (Dictionary), Kümeler ve Big O Karmaşıklığı',
        color: '#1cb0f6',
        lessons: [
          {
            id: 'kod-u2-l1',
            unitId: 'kod-u2',
            title: 'Sözlükler (Key-Value) & List Metodları',
            description: 'Verileri anahtar-değer çiftleriyle saklama ve hızlı erişim.',
            xpReward: 30,
            gemReward: 10,
            type: 'lesson',
            questions: [
              {
                id: 'code-q7',
                type: 'multiple_choice',
                prompt: 'ogrenci = {"ad": "Ali", "puan": 95} sözlüğünde Ali\'nin puanını ekrana yazdırmak için hangi kod kullanılır?',
                difficulty: 'kolay',
                explanation: 'Sözlüklerde bir değere erişmek için anahtar ismi köşeli parantez içinde verilir: ogrenci["puan"] ➔ 95.',
                options: [
                  { id: 'd1', text: 'ogrenci["puan"]', isCorrect: true },
                  { id: 'd2', text: 'ogrenci[1]', isCorrect: false },
                  { id: 'd3', text: 'ogrenci.puan()', isCorrect: false },
                  { id: 'd4', text: 'ogrenci.get_index(95)', isCorrect: false }
                ]
              },
              {
                id: 'code-q8',
                type: 'matching',
                prompt: 'Zaman karmaşıklıklarını (Big-O) örnek operasyonlarla eşleştirin:',
                difficulty: 'orta',
                explanation: 'O(1) anında erişim, O(n) diziyi tek tur tarama, O(log n) ikili arama (Binary Search).',
                pairs: [
                  { id: 'b1', left: 'O(1) - Sabit Zaman', right: 'Dizi indeksine doğrudan erişim' },
                  { id: 'b2', left: 'O(n) - Doğrusal Zaman', right: 'Dizideki tüm elemanları for ile gezme' },
                  { id: 'b3', left: 'O(log n) - Logaritmik Zaman', right: 'Sıralı dizide İkili Arama (Binary Search)' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 3. KPSS (GY - GK)
  // ==========================================
  {
    id: 'kpss',
    name: 'KPSS (GY - GK)',
    subTitle: '2025 - 2026 Kamu Personeli Seçme Sınavı',
    icon: '🏛️',
    badge: 'Kariyer & Kamu',
    color: '#ff9600',
    accentColor: '#e08300',
    units: [
      {
        id: 'kpss-u1',
        number: 1,
        title: 'T.C. İnkılap Tarihi: Milli Mücadele',
        description: 'Kongreler, cepheler, Lozan Barış Antlaşması ve ilkeler',
        color: '#ff9600',
        lessons: [
          {
            id: 'kpss-u1-l1',
            unitId: 'kpss-u1',
            title: 'Milli Mücadele Hazırlık Dönemi',
            description: 'Amasya Genelgesi, Erzurum ve Sivas Kongreleri kararları.',
            xpReward: 20,
            gemReward: 5,
            type: 'lesson',
            questions: [
              {
                id: 'kpss-q1',
                type: 'multiple_choice',
                prompt: '"Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır." ilkesi ilk kez nerede ilan edilmiştir?',
                difficulty: 'kolay',
                explanation: 'Amasya Genelgesi (22 Haziran 1919), Kurtuluş Savaşı\'nın gerekçesini, amacını ve yöntemini belirten ihtilal beyannamesidir.',
                options: [
                  { id: 'kp1', text: 'Amasya Genelgesi', isCorrect: true },
                  { id: 'kp2', text: 'Erzurum Kongresi', isCorrect: false },
                  { id: 'kp3', text: 'Sivas Kongresi', isCorrect: false },
                  { id: 'kp4', text: 'Havza Genelgesi', isCorrect: false }
                ]
              },
              {
                id: 'kpss-q2',
                type: 'matching',
                prompt: 'Kongre ve genelgeleri öne çıkan özellikleriyle eşleştirin:',
                difficulty: 'orta',
                explanation: 'Havza ilk tepki mitingleri, Erzurum manda ve himayenin ilk reddi, Sivas tüm cemiyetlerin birleştiği yerdir.',
                pairs: [
                  { id: 'mp1', left: 'Havza Genelgesi', right: 'İşgallere karşı ilk kitlesel miting çağrısı' },
                  { id: 'mp2', left: 'Erzurum Kongresi', right: 'Manda ve himayenin ilk kez reddi' },
                  { id: 'mp3', left: 'Sivas Kongresi', right: 'Tüm milli cemiyetlerin tek çatı altında birleşmesi' }
                ]
              },
              {
                id: 'kpss-q3',
                type: 'true_false',
                prompt: 'Erzurum Kongresi toplanış bakımından bölgesel, aldığı kararlar bakımından ulusaldır.',
                statement: 'Erzurum Kongresi toplanışı bölgesel, kararları ulusal niteliktedir.',
                correctAnswer: true,
                explanation: 'Doğru! Doğu illerinin savunması için toplanmış ancak Misak-ı Milli sınırlarını çizerek tüm vatanı ilgilendiren kararlar almıştır.'
              }
            ]
          }
        ]
      },
      {
        id: 'kpss-u2',
        number: 2,
        title: '2025 - 2026 Güncel Bilgiler & Genel Kültür',
        description: 'Türkiye\'nin uzay misyonu, uluslararası kuruluşlar ve kültür mirası',
        color: '#ff4b4b',
        lessons: [
          {
            id: 'kpss-u2-l1',
            unitId: 'kpss-u2',
            title: 'Uzay, Bilim & UNESCO Kültür Mirası',
            description: 'Sınavda çıkması en muhtemel güncel olaylar.',
            xpReward: 25,
            gemReward: 8,
            type: 'lesson',
            questions: [
              {
                id: 'kpss-g1',
                type: 'multiple_choice',
                prompt: 'Türkiye\'nin ilk astronotu olarak Uluslararası Uzay İstasyonu\'na (ISS) giderek Ax-3 misyonunda 13 farklı bilimsel deney gerçekleştiren isim kimdir?',
                difficulty: 'kolay',
                explanation: 'Alper Gezeravcı, Ocak 2024\'te Ax-3 misyonu ile uzaya çıkan ilk Türk astronotumuz olmuştur.',
                options: [
                  { id: 'g1', text: 'Alper Gezeravcı', isCorrect: true },
                  { id: 'g2', text: 'Tuva Cihangir Atasever', isCorrect: false },
                  { id: 'g3', text: 'Aziz Sancar', isCorrect: false },
                  { id: 'g4', text: 'Selçuk Bayraktar', isCorrect: false }
                ]
              },
              {
                id: 'kpss-g2',
                type: 'matching',
                prompt: 'UNESCO Somut Olmayan Kültürel Miras unsurlarımızı eşleştirin:',
                difficulty: 'orta',
                explanation: 'İftar geleneği ve tezhip sanatı son dönemde UNESCO listesine dahil edilmiştir.',
                pairs: [
                  { id: 'u1', left: 'Geleneksel Ahşap Çatı ve Direkli Camiler', right: 'UNESCO Dünya Mirası Asıl Listesi (2023)' },
                  { id: 'u2', left: 'İftar ve Sosyokültürel Gelenekleri', right: 'UNESCO Somut Olmayan Kültür Mirası' },
                  { id: 'u3', left: 'Gordion Antik Kenti (Ankara)', right: 'UNESCO Dünya Miras Listesi (20. Mirasımız)' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 4. LGS (8. SINIF)
  // ==========================================
  {
    id: 'lgs',
    name: 'LGS (8. Sınıf)',
    subTitle: 'Yeni Nesil Beceri Temelli Sorular',
    icon: '📚',
    badge: 'Yeni Nesil',
    color: '#ff4b4b',
    accentColor: '#d33131',
    units: [
      {
        id: 'lgs-u1',
        number: 1,
        title: 'Matematik: Çarpanlar ve Katlar',
        description: 'EBOB-EKOK problemleri ve yeni nesil soru mantığı',
        color: '#ff4b4b',
        lessons: [
          {
            id: 'lgs-u1-l1',
            unitId: 'lgs-u1',
            title: 'EBOB & EKOK Mantığı',
            description: 'Parçadan bütüne (EKOK) ve bütünden parçaya (EBOB) modellemesi.',
            xpReward: 20,
            gemReward: 5,
            type: 'lesson',
            questions: [
              {
                id: 'lgs-q1',
                type: 'multiple_choice',
                prompt: 'Kenar uzunlukları 12 cm ve 18 cm olan dikdörtgen levhalar yan yana dizilerek en küçük boyutlu bir KARE yapılmak isteniyor. Bu karenin bir kenarı kaç cm olmalıdır?',
                difficulty: 'orta',
                hint: 'Küçük parçaları birleştirip büyük bir bütün oluştururken EKOK kullanılır.',
                explanation: '12 ve 18 sayılarının EKOK\'u: EKOK(12, 18) = 36 cm bulunur. Karenin bir kenarı 36 cm olmalıdır.',
                options: [
                  { id: 'l1', text: '36 cm', isCorrect: true },
                  { id: 'l2', text: '72 cm', isCorrect: false },
                  { id: 'l3', text: '24 cm', isCorrect: false },
                  { id: 'l4', text: '6 cm', isCorrect: false }
                ]
              },
              {
                id: 'lgs-q2',
                type: 'matching',
                prompt: 'Problem türlerini çözüm yöntemleriyle eşleştirin:',
                difficulty: 'kolay',
                explanation: 'Büyük çuvalları poşetlere bölmek EBOB, nöbet günlerinin çakışması EKOK gerektirir.',
                pairs: [
                  { id: 'lp1', left: 'Büyük çuvallardaki pirinçleri eşit poşetlere bölme', right: 'EBOB (Bütünden parçaya)' },
                  { id: 'lp2', left: 'Farklı aralıklarla çalan iki zilin tekrar birlikte çalması', right: 'EKOK (Parçadan bütüne)' },
                  { id: 'lp3', left: 'Tarlanın etrafına eşit aralıklarla fidan dikme', right: 'EBOB (Bölme / Parçalama)' }
                ]
              }
            ]
          }
        ]
      }
    ]
  },

  // ==========================================
  // 5. YABANCI DİL (İNGİLİZCE)
  // ==========================================
  {
    id: 'dil',
    name: 'İngilizce (A1 - B2)',
    subTitle: 'Konuşma, Gramer & YDS/YÖKDİL Kelimeleri',
    icon: '🌍',
    badge: 'Küresel Dil',
    color: '#1cb0f6',
    accentColor: '#1899d6',
    units: [
      {
        id: 'dil-u1',
        number: 1,
        title: 'Günlük Konuşma & Tanışma (A1)',
        description: 'Temel selamlaşmalar, kendini tanıtma ve yaygın kalıplar',
        color: '#1cb0f6',
        lessons: [
          {
            id: 'dil-u1-l1',
            unitId: 'dil-u1',
            title: 'Selamlaşma & İfadeler',
            description: 'Hello, How are you?, Nice to meet you kalıpları.',
            xpReward: 20,
            gemReward: 5,
            type: 'lesson',
            questions: [
              {
                id: 'dil-q1',
                type: 'multiple_choice',
                prompt: '"Nice to meet you" diyen birine en kibar ve doğal karşılık ne olur?',
                difficulty: 'kolay',
                explanation: '"Nice to meet you" (Tanıştığıma memnun oldum) ifadesine "Nice to meet you too" (Ben de memnun oldum) şeklinde yanıt verilir.',
                options: [
                  { id: 'd1', text: 'Nice to meet you too!', isCorrect: true },
                  { id: 'd2', text: 'I am 20 years old.', isCorrect: false },
                  { id: 'd3', text: 'Yes, I do.', isCorrect: false },
                  { id: 'd4', text: 'Goodbye tomorrow.', isCorrect: false }
                ]
              },
              {
                id: 'dil-q2',
                type: 'matching',
                prompt: 'İngilizce kelimeleri Türkçe karşılıklarıyla eşleştirin:',
                difficulty: 'kolay',
                explanation: 'Günlük yaygın fiiller ve isimler.',
                pairs: [
                  { id: 'dp1', left: 'Learn', right: 'Öğrenmek' },
                  { id: 'dp2', left: 'Knowledge', right: 'Bilgi' },
                  { id: 'dp3', left: 'Challenge', right: 'Meydan Okuma' },
                  { id: 'dp4', left: 'Goal', right: 'Hedef' }
                ]
              },
              {
                id: 'dil-q3',
                type: 'code_fill',
                prompt: 'Cümleyi uygun yardımcı fiil ile tamamlayın: "She ___ studying for the exam right now."',
                codeSnippet: 'She ___ studying for the exam right now.',
                blankId: 'is',
                options: ['is', 'are', 'am', 'be'],
                correctAnswer: 'is',
                explanation: 'Present Continuous Tense yapısında "he/she/it" özneleri "is" yardımcı fiilini alır.'
              }
            ]
          }
        ]
      }
    ]
  }
];
