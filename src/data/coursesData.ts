import { Course } from '../types';

export const COURSES: Course[] = [
  {
    "id": "yks",
    "name": "YKS (TYT - AYT)",
    "subTitle": "2025 - 2026 Üniversite Sınavı Hazırlık",
    "icon": "🎓",
    "badge": "En Popüler",
    "color": "#58cc02",
    "accentColor": "#46a302",
    "units": [
      {
        "id": "yks-u1",
        "number": 1,
        "title": "TYT Matematik: Temel Sayılar & Mantık",
        "description": "Tek/Çift sayılar, asal sayılar, bölünebilme ve ardışık sayılar",
        "color": "#58cc02",
        "lessons": [
          {
            "id": "yks-u1-l1",
            "unitId": "yks-u1",
            "title": "Sayı Kümeleri & Tek/Çift Sayılar",
            "description": "Temel kavramlar ve tek-çift sayıların çarpım/toplam kuralları.",
            "xpReward": 20,
            "gemReward": 5,
            "type": "lesson",
            "summaryNotes": [
              "Tek ± Tek = Çift, Çift ± Çift = Çift, Tek ± Çift = Tek",
              "Tek × Tek = Tek, Çarpanlardan en az biri çiftse çarpım çifttir!",
              "İki çift sayının toplamı daima çifttir.",
              "Pozitif tam sayılarda tek sayının tüm pozitif kuvvetleri tektir."
            ],
            "questions": [
              {
                "id": "yks-q1",
                "type": "multiple_choice",
                "prompt": "a ve b pozitif tam sayılardır. (3a + 5b) ifadesinin sonucu TEK sayı olduğuna göre, aşağıdakilerden hangisi DAİMA DOĞRUDUR?",
                "difficulty": "orta",
                "hint": "İki sayının toplamı tek ise, biri tek diğeri çift olmalıdır.",
                "explanation": "3a ve 5b sayılarından biri tek, diğeri çifttir. Dolayısıyla a ve b sayılarından biri tek, biri çifttir. Bu durumda (a × b) çarpımı bir çift çarpan içerdiği için kesinlikle ÇİFT olur.",
                "options": [
                  {
                    "id": "opt1",
                    "text": "a × b çarpımı daima çifttir",
                    "isCorrect": true
                  },
                  {
                    "id": "opt2",
                    "text": "a daima tek sayıdır",
                    "isCorrect": false
                  },
                  {
                    "id": "opt3",
                    "text": "b daima çift sayıdır",
                    "isCorrect": false
                  },
                  {
                    "id": "opt4",
                    "text": "a + b toplamı tek sayıdır",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-q2",
                "type": "matching",
                "prompt": "Sayı kümeleri sembollerini anlamlarıyla doğru eşleştirin:",
                "difficulty": "kolay",
                "explanation": "N: Doğal Sayılar (0, 1, 2...), Z: Tam Sayılar (...-1, 0, 1...), Q: Rasyonel Sayılar, R: Gerçek Sayılar",
                "pairs": [
                  {
                    "id": "p1",
                    "left": "ℕ (N)",
                    "right": "Doğal Sayılar"
                  },
                  {
                    "id": "p2",
                    "left": "ℤ (Z)",
                    "right": "Tam Sayılar"
                  },
                  {
                    "id": "p3",
                    "left": "ℚ (Q)",
                    "right": "Rasyonel Sayılar"
                  },
                  {
                    "id": "p4",
                    "left": "ℝ (R)",
                    "right": "Reel (Gerçek) Sayılar"
                  }
                ]
              },
              {
                "id": "yks-q3",
                "type": "true_false",
                "prompt": "Asal sayılar hakkında verilen ifade doğru mu yanlış mı?",
                "statement": "2 sayısı hem en küçük asal sayıdır, hem de tek çift asal sayıdır.",
                "correctAnswer": true,
                "explanation": "Harika! 2 tek çift asal sayıdır. 2'den başka hiçbir çift sayı asal olamaz çünkü hepsi 2'ye bölünür."
              },
              {
                "id": "yks-q4",
                "type": "multiple_choice",
                "prompt": "x negatif bir tam sayı olduğuna göre, aşağıdakilerden hangisinin sonucu daima POZİTİF bir sayıdır?",
                "difficulty": "kolay",
                "explanation": "Negatif bir sayının çift kuvvetleri her zaman pozitiftir: (-2)² = +4. Tek kuvvetleri negatiftir: (-2)³ = -8.",
                "options": [
                  {
                    "id": "o1",
                    "text": "x³ (x üzeri 3)",
                    "isCorrect": false
                  },
                  {
                    "id": "o2",
                    "text": "x² (x kare)",
                    "isCorrect": true
                  },
                  {
                    "id": "o3",
                    "text": "2x",
                    "isCorrect": false
                  },
                  {
                    "id": "o4",
                    "text": "x - 5",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-q4b",
                "type": "multiple_choice",
                "prompt": "İki basamaklı en büyük asal sayı ile iki basamaklı en küçük asal sayının farkı kaçtır?",
                "difficulty": "orta",
                "explanation": "İki basamaklı en büyük asal sayı 97, en küçük asal sayı 11'dir. Fark: 97 - 11 = 86.",
                "options": [
                  {
                    "id": "b1",
                    "text": "86",
                    "isCorrect": true
                  },
                  {
                    "id": "b2",
                    "text": "88",
                    "isCorrect": false
                  },
                  {
                    "id": "b3",
                    "text": "84",
                    "isCorrect": false
                  },
                  {
                    "id": "b4",
                    "text": "90",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "yks-u1-l2",
            "unitId": "yks-u1",
            "title": "Asal Sayılar & Ardışık Sayılar",
            "description": "Ardışık sayıların toplam formülleri ve aralarında asallık kuralları.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Gauss Toplam Formülü: 1 + 2 + ... + n = [n × (n + 1)] / 2",
              "Ardışık iki tam sayı daima aralarında asaldır!",
              "Terim Sayısı = [(Son Terim - İlk Terim) / Artış Miktarı] + 1"
            ],
            "questions": [
              {
                "id": "yks-q5",
                "type": "multiple_choice",
                "prompt": "1'den 20'ye kadar olan ardışık doğal sayıların toplamı kaçtır? [1 + 2 + 3 + ... + 20]",
                "difficulty": "kolay",
                "hint": "Gauss Toplam Formülü: [n × (n + 1)] / 2",
                "explanation": "Gauss formülü ile: (20 × 21) / 2 = 10 × 21 = 210 bulunur.",
                "options": [
                  {
                    "id": "opt1",
                    "text": "210",
                    "isCorrect": true
                  },
                  {
                    "id": "opt2",
                    "text": "200",
                    "isCorrect": false
                  },
                  {
                    "id": "opt3",
                    "text": "220",
                    "isCorrect": false
                  },
                  {
                    "id": "opt4",
                    "text": "190",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-q6",
                "type": "matching",
                "prompt": "Aralarında asal sayı çiftlerini eşleştirin:",
                "difficulty": "orta",
                "explanation": "Aralarında asal iki sayının 1 dışında ortak pozitif böleni yoktur.",
                "pairs": [
                  {
                    "id": "p1",
                    "left": "8 ve 15",
                    "right": "Ortak bölenleri yalnızca 1'dir"
                  },
                  {
                    "id": "p2",
                    "left": "12 ve 18",
                    "right": "Ortak bölenleri 6'dır (Asal Değil)"
                  },
                  {
                    "id": "p3",
                    "left": "9 ve 10",
                    "right": "Ardışık sayılar daima aralarında asaldır"
                  }
                ]
              },
              {
                "id": "yks-q7",
                "type": "multiple_choice",
                "prompt": "Dört basamaklı 4A7B sayısı 10 ile bölündüğünde 3 kalanını veriyor. Bu sayı 9 ile tam bölünebildiğine göre A kaçtır?",
                "difficulty": "orta",
                "explanation": "10 ile bölümünden kalan 3 ise birler basamağı B = 3 olur. Sayı 4A73 oldu. 9 ile tam bölünmesi için rakamlar toplamı 9'un katı olmalıdır: 4 + A + 7 + 3 = 14 + A = 18 ➔ A = 4.",
                "options": [
                  {
                    "id": "a1",
                    "text": "4",
                    "isCorrect": true
                  },
                  {
                    "id": "a2",
                    "text": "5",
                    "isCorrect": false
                  },
                  {
                    "id": "a3",
                    "text": "2",
                    "isCorrect": false
                  },
                  {
                    "id": "a4",
                    "text": "6",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-q8",
                "type": "true_false",
                "prompt": "Ardışık üç tek sayının toplamı her zaman 3'e tam bölünür mü?",
                "statement": "Herhangi ardışık üç tek tam sayının toplamı daima 3 ile tam bölünür.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Sayılar (x - 2), x, (x + 2) şeklinde yazılırsa toplamları 3x olur ve 3'ün tam katıdır."
              }
            ]
          },
          {
            "id": "yks-u1-chest",
            "unitId": "yks-u1",
            "title": "Sayılar Sandığı 🎁",
            "description": "Matematik temellerini pekiştiren özel bonus ödül soruları!",
            "xpReward": 50,
            "gemReward": 25,
            "type": "lesson",
            "questions": [
              {
                "id": "yks-chest-q1",
                "type": "multiple_choice",
                "prompt": "Ardışık 5 tek sayının toplamı 85 olduğuna göre, bu sayıların en büyüğü kaçtır?",
                "difficulty": "orta",
                "explanation": "Ortanca sayı 85 / 5 = 17'dir. Sayılar: 13, 15, 17, 19, 21. En büyüğü 21'dir.",
                "options": [
                  {
                    "id": "co1",
                    "text": "21",
                    "isCorrect": true
                  },
                  {
                    "id": "co2",
                    "text": "19",
                    "isCorrect": false
                  },
                  {
                    "id": "co3",
                    "text": "23",
                    "isCorrect": false
                  },
                  {
                    "id": "co4",
                    "text": "25",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-chest-q2",
                "type": "true_false",
                "prompt": "İki basamaklı en küçük asal sayı ile en büyük asal sayının toplamı 108'dir.",
                "statement": "En küçük iki basamaklı asal (11) ile en büyüğünün (97) toplamı 108 eder.",
                "correctAnswer": true,
                "explanation": "Doğru! 11 + 97 = 108."
              },
              {
                "id": "yks-chest-q3",
                "type": "multiple_choice",
                "prompt": "x ve y birer tam sayıdır. (2x + 1) . y çarpımı tek sayı olduğuna göre, y için hangisi kesinlikle doğrudur?",
                "difficulty": "kolay",
                "explanation": "(2x + 1) daima tek sayıdır. Tek bir sayı ile y çarpımı tek ise, y de kesinlikle TEK sayıdır.",
                "options": [
                  {
                    "id": "cy1",
                    "text": "y daima tek sayıdır",
                    "isCorrect": true
                  },
                  {
                    "id": "cy2",
                    "text": "y daima çift sayıdır",
                    "isCorrect": false
                  },
                  {
                    "id": "cy3",
                    "text": "y pozitiftir",
                    "isCorrect": false
                  },
                  {
                    "id": "cy4",
                    "text": "x tektir",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "yks-u1-boss",
            "unitId": "yks-u1",
            "title": "Ünite Sonu Şampiyonluk Sınavı",
            "description": "Tüm ünite kazanımlarını ölçen zorlu TYT meydan okuması!",
            "xpReward": 40,
            "gemReward": 15,
            "type": "boss",
            "questions": [
              {
                "id": "yks-boss-1",
                "type": "multiple_choice",
                "prompt": "a, b ve c ardışık çift tam sayılardır (a < b < c). Buna göre [(c - a) × (c - b)] / (b - a) işleminin sonucu kaçtır?",
                "difficulty": "zor",
                "explanation": "Ardışık çift sayılar arasında 2 fark vardır. a = 2, b = 4, c = 6 seçebiliriz. c - a = 4, c - b = 2, b - a = 2. (4 × 2) / 2 = 4 bulunur!",
                "options": [
                  {
                    "id": "b1",
                    "text": "4",
                    "isCorrect": true
                  },
                  {
                    "id": "b2",
                    "text": "2",
                    "isCorrect": false
                  },
                  {
                    "id": "b3",
                    "text": "8",
                    "isCorrect": false
                  },
                  {
                    "id": "b4",
                    "text": "1",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-boss-2",
                "type": "true_false",
                "prompt": "Aralarında asal iki sayının EBOB'u daima 1'dir.",
                "statement": "Aralarında asal a ve b sayıları için EBOB(a, b) = 1'dir.",
                "correctAnswer": true,
                "explanation": "Doğru! Aralarında asal sayıların 1 dışında pozitif ortak böleni yoktur."
              },
              {
                "id": "yks-boss-3",
                "type": "multiple_choice",
                "prompt": "x, y, z pozitif tam sayılardır. x × y = 18 ve y × z = 24 olduğuna göre x + y + z toplamının alabileceği EN KÜÇÜK değer kaçtır?",
                "difficulty": "zor",
                "explanation": "Toplamın en küçük olması için ortak olan y sayısını mümkün olan en büyük seçmeliyiz. EBOB(18, 24) = 6. y = 6 için x = 3 ve z = 4 olur. x + y + z = 3 + 6 + 4 = 13.",
                "options": [
                  {
                    "id": "bs1",
                    "text": "13",
                    "isCorrect": true
                  },
                  {
                    "id": "bs2",
                    "text": "15",
                    "isCorrect": false
                  },
                  {
                    "id": "bs3",
                    "text": "17",
                    "isCorrect": false
                  },
                  {
                    "id": "bs4",
                    "text": "43",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "yks-u2",
        "number": 2,
        "title": "TYT Türkçe: Paragrafta Hız & Taktikler",
        "description": "ÖSYM yeni nesil paragraf analizi, ana düşünce ve akış bozma",
        "color": "#1cb0f6",
        "lessons": [
          {
            "id": "yks-u2-l1",
            "unitId": "yks-u2",
            "title": "Ana Düşünceyi Nokta Atışı Yakalama",
            "description": "Vurgulanan asıl düşünceyi anahtar kelimelerle 30 saniyede tespit etme.",
            "xpReward": 20,
            "gemReward": 5,
            "type": "lesson",
            "summaryNotes": [
              "Ana düşünce genellikle paragrafın ilk veya son cümlesinde özetlenir.",
              "'Kısacası, oysa, asıl önemli olan, bana göre' ifadeleri ana fikrin habercisidir.",
              "Önce soru kökünü oku, sonra seçenekleri gözden geçir, en son metne odaklan!"
            ],
            "questions": [
              {
                "id": "yks-t1",
                "type": "multiple_choice",
                "prompt": "'Yazmak, içimizdeki karmaşayı düzene sokmanın en zarif yoludur. Kağıda dökülmeyen her düşünce bir gün unutulmaya mahkumdur.' Bu parçada yazarın asıl anlatmak istediği nedir?",
                "difficulty": "orta",
                "explanation": "Yazar yazmanın hem zihinsel düzeni sağladığını hem de düşünceleri kalıcı kıldığını vurgulamaktadır.",
                "options": [
                  {
                    "id": "t1",
                    "text": "Yazı, düşünceleri somutlaştırarak kalıcı kılar ve zihni düzenler",
                    "isCorrect": true
                  },
                  {
                    "id": "t2",
                    "text": "Sadece yetenekli insanlar yazı yazabilir",
                    "isCorrect": false
                  },
                  {
                    "id": "t3",
                    "text": "Unutulan düşünceler önemsizdir",
                    "isCorrect": false
                  },
                  {
                    "id": "t4",
                    "text": "Konuşmak yazmaktan daha etkilidir",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-t2",
                "type": "matching",
                "prompt": "Anlatım tekniklerini tanımlarıyla eşleştirin:",
                "difficulty": "kolay",
                "explanation": "Öyküleme olay anlatır, betimleme kelimelerle resim çizer, tartışma okuyucunun fikrini değiştirmeye çalışır.",
                "pairs": [
                  {
                    "id": "p1",
                    "left": "Öyküleme",
                    "right": "Zaman ve olay akışı (film şeridi gibi)"
                  },
                  {
                    "id": "p2",
                    "left": "Betimleme",
                    "right": "Sıfatlarla niteleme (fotoğraf karesi gibi)"
                  },
                  {
                    "id": "p3",
                    "left": "Tartışmacı Anlatım",
                    "right": "Karşıt fikirleri çürütüp kendi görüşünü savunma"
                  }
                ]
              },
              {
                "id": "yks-t3",
                "type": "true_false",
                "prompt": "Paragraf çözerken önce soru kökünü okumak gerekir mi?",
                "statement": "Paragraf sorularında önce metni değil, soru kökünü okumak zamandan kazandırır ve hedefe odaklanmayı sağlar.",
                "correctAnswer": true,
                "explanation": "Kesinlikle doğru! Önce soru kökünü okuyarak paragrafta ne aradığınızı bilirsiniz."
              },
              {
                "id": "yks-t4",
                "type": "multiple_choice",
                "prompt": "'Sanatçı, çağına tanıklık eden değil; geleceğe ayna tutan bir öncüdür.' Bu cümleden çıkarılabilecek EN KAPSAMLI yargı hangisidir?",
                "difficulty": "orta",
                "explanation": "Cümle sanatçının sadece gününü kaydetmeyip topluma ve geleceğe yol göstermesi gerektiğini vurgular.",
                "options": [
                  {
                    "id": "s1",
                    "text": "Gerçek sanatçı, eserleriyle geleceğe yön veren ve ışık tutan kişidir",
                    "isCorrect": true
                  },
                  {
                    "id": "s2",
                    "text": "Sanat geçmişi unutturmalıdır",
                    "isCorrect": false
                  },
                  {
                    "id": "s3",
                    "text": "Sanatçı sadece kendi dönemini yansıtmalıdır",
                    "isCorrect": false
                  },
                  {
                    "id": "s4",
                    "text": "Toplumsal sorunlar sanatın konusu olamaz",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-t5",
                "type": "multiple_choice",
                "prompt": "Paragrafta akışı bozan cümleyi bulurken hangi kurala dikkat edilmelidir?",
                "difficulty": "zor",
                "explanation": "Akışı bozan cümle, konunun farklı bir yönüne değinen veya bir önceki cümlenin mantıksal devamı olmayan cümledir.",
                "options": [
                  {
                    "id": "ak1",
                    "text": "Konunun dışına çıkan veya farklı bir boyutuna aniden atlayan cümle akışı bozar",
                    "isCorrect": true
                  },
                  {
                    "id": "ak2",
                    "text": "En uzun cümle her zaman akışı bozar",
                    "isCorrect": false
                  },
                  {
                    "id": "ak3",
                    "text": "Soru cümlesi içeren her ifade akışı bozar",
                    "isCorrect": false
                  },
                  {
                    "id": "ak4",
                    "text": "Paragrafın son cümlesi her zaman akışı bozar",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "yks-u2-l2",
            "unitId": "yks-u2",
            "title": "Dil Bilgisi: Ses Olayları & Yazım Kuralları",
            "description": "Ünlü düşmesi, ünsüz benzeşmesi ve büyük harflerin doğru yazımı.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Fıstıkçı Şahap: Sert ünsüzlerden sonra c, d, g ➔ ç, t, k olur (Ünsüz Benzeşmesi)",
              "Büyük harflerin yazımı: Kurum, kuruluş ve kurul adlarının her kelimesi büyük harfle başlar ve gelen ekler kesme işaretiyle ayrılmaz!",
              "'Ki' bağlacı ayrı yazılır; '-ki' sıfat veya ilgi zamiri eki bitişik yazılır (ler takısı testi)."
            ],
            "questions": [
              {
                "id": "yks-db1",
                "type": "multiple_choice",
                "prompt": "Aşağıdaki cümlelerin hangisinde altı çizili sözcükte hem 'ünlü düşmesi' hem de 'ünsüz yumuşaması' vardır?",
                "difficulty": "zor",
                "hint": "Kayıp + etmek ➔ Kaybetmek",
                "explanation": "'Kaybetti' sözcüğünde kayıp + etti birleşirken ı harfi düşer (ünlü düşmesi) ve p harfi b'ye yumuşar (ünsüz değişimi).",
                "options": [
                  {
                    "id": "db1",
                    "text": "Cüzdanını dün akşam kaybetmiş",
                    "isCorrect": true
                  },
                  {
                    "id": "db2",
                    "text": "Sabahtan beri burnu kanıyordu",
                    "isCorrect": false
                  },
                  {
                    "id": "db3",
                    "text": "Çiçeği vazoya bıraktı",
                    "isCorrect": false
                  },
                  {
                    "id": "db4",
                    "text": "Yolculuk sabırla bitti",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-db2",
                "type": "matching",
                "prompt": "Yazım kurallarını doğru örnekleriyle eşleştirin:",
                "difficulty": "orta",
                "explanation": "TDK yazım kuralları kurumlara gelen eklerin kesmeyle ayrılmayacağını belirtir.",
                "pairs": [
                  {
                    "id": "yp1",
                    "left": "Türk Dil Kurumuna",
                    "right": "Kurum adlarına gelen ek ayrılmaz (Doğru)"
                  },
                  {
                    "id": "yp2",
                    "left": "TBMM'ye",
                    "right": "Kısaltmalara gelen ekler kesmeyle ayrılır"
                  },
                  {
                    "id": "yp3",
                    "left": "Birkaç / Birçok",
                    "right": "Belgisiz sözcükler bitişik yazılır"
                  }
                ]
              },
              {
                "id": "yks-db3",
                "type": "true_false",
                "prompt": "Şey sözcüğü her zaman ayrı mı yazılır?",
                "statement": "'Şey' sözcüğü her zaman kendinden önceki sözcükten ayrı yazılır (her şey, bir şey).",
                "correctAnswer": true,
                "explanation": "Kesinlikle doğru! 'Şey' daima ayrı yazılır: hiçbir şey, her şey, bir şey."
              },
              {
                "id": "yks-db4",
                "type": "multiple_choice",
                "prompt": "Aşağıdaki cümlelerin hangisinde bir yazım yanlışı vardır?",
                "difficulty": "orta",
                "explanation": "'Hiç bir' ayrı yazılmaz, 'hiçbir' bitişik yazılır.",
                "options": [
                  {
                    "id": "yz1",
                    "text": "Toplantıya hiç bir yetkili katılmadı.",
                    "isCorrect": true
                  },
                  {
                    "id": "yz2",
                    "text": "Her şey beklediğimizden daha güzel oldu.",
                    "isCorrect": false
                  },
                  {
                    "id": "yz3",
                    "text": "O da bizimle sinemaya gelecekmiş.",
                    "isCorrect": false
                  },
                  {
                    "id": "yz4",
                    "text": "23 Nisan 1920'de Meclis açıldı.",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "yks-u3",
        "number": 3,
        "title": "TYT Fen: Fizik & Biyoloji Banko Netler",
        "description": "Kuvvet-hareket, eylemsizlik ve hücre organelleri püf noktaları",
        "color": "#ff9600",
        "lessons": [
          {
            "id": "yks-u3-l1",
            "unitId": "yks-u3",
            "title": "Fizik: Newton Hareket Yasaları",
            "description": "Eylemsizlik prensibi, F = m.a ve etki-tepki kanunları.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "1. Yasa (Eylemsizlik): Net kuvvet sıfırsa duran durur, hareketli sabit hızla gider.",
              "2. Yasa (Temel Yasa): F_net = m × a (Kuvvet = Kütle × İvme)",
              "3. Yasa (Etki-Tepki): Etki ve tepki kuvvetleri eşit büyüklükte, zıt yönde ve FARKLI cisimler üzerindedir!"
            ],
            "questions": [
              {
                "id": "yks-f1",
                "type": "multiple_choice",
                "prompt": "Sürtünmesiz yatay düzlemde sabit 20 m/s hızla gitmekte olan bir cisme etki eden net kuvvet kaç Newton'dur?",
                "difficulty": "kolay",
                "explanation": "Hız sabit ise ivme sıfırdır (a = 0). F_net = m × a formülünden F_net = 0 N olur.",
                "options": [
                  {
                    "id": "f1",
                    "text": "0 N",
                    "isCorrect": true
                  },
                  {
                    "id": "f2",
                    "text": "20 N",
                    "isCorrect": false
                  },
                  {
                    "id": "f3",
                    "text": "10 N",
                    "isCorrect": false
                  },
                  {
                    "id": "f4",
                    "text": "9.8 N",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-f2",
                "type": "matching",
                "prompt": "Organelleri hücredeki temel görevleriyle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Mitokondri enerji, kloroplast fotosentez, ribozom protein sentezi yapar.",
                "pairs": [
                  {
                    "id": "b1",
                    "left": "Mitokondri",
                    "right": "Oksijenli Solunum & ATP Üretimi"
                  },
                  {
                    "id": "b2",
                    "left": "Ribozom",
                    "right": "Protein Sentezi (Tüm Canlılarda Ortak)"
                  },
                  {
                    "id": "b3",
                    "left": "Kloroplast",
                    "right": "Fotosentez ile Besin ve Oksijen Üretimi"
                  }
                ]
              },
              {
                "id": "yks-f3",
                "type": "multiple_choice",
                "prompt": "Kütlesi 4 kg olan bir cisme 20 N net yatay kuvvet uygulanırsa cismin ivmesi kaç m/s² olur?",
                "difficulty": "kolay",
                "explanation": "F = m × a formülünden 20 = 4 × a ➔ a = 5 m/s² bulunur.",
                "options": [
                  {
                    "id": "iv1",
                    "text": "5 m/s²",
                    "isCorrect": true
                  },
                  {
                    "id": "iv2",
                    "text": "80 m/s²",
                    "isCorrect": false
                  },
                  {
                    "id": "iv3",
                    "text": "4 m/s²",
                    "isCorrect": false
                  },
                  {
                    "id": "iv4",
                    "text": "16 m/s²",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-f4",
                "type": "true_false",
                "prompt": "Etki ve tepki kuvvetleri birbirini sıfırlar mı?",
                "statement": "Etki ve tepki kuvvetleri eşit büyüklükte ve zıt yönde oldukları için birbirini dengeler ve bileşkesi sıfırdır.",
                "correctAnswer": false,
                "explanation": "Yanlış! Etki ve tepki kuvvetleri FARKLI iki cisme etki eder; bu yüzden asla birbirini dengelemez veya sıfırlamaz!"
              }
            ]
          },
          {
            "id": "yks-u3-l2",
            "unitId": "yks-u3",
            "title": "Kimya: Periyodik Tablo & Asit-Bazlar",
            "description": "Periyot-grup bulma, elektronegatiflik ve pH kavramı.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Aynı grupta yukarıdan aşağıya inildikçe atom yarıçapı artar, iyonlaşma enerjisi azalır.",
              "pH < 7 ise asit, pH = 7 nötr, pH > 7 ise bazdır.",
              "Turnusol kağıdını asitler kırmızıya, bazlar maviye çevirir."
            ],
            "questions": [
              {
                "id": "yks-k1",
                "type": "multiple_choice",
                "prompt": "Atom numarası 17 olan Klor (Cl) elementinin periyodik tablodaki yeri nedir?",
                "difficulty": "orta",
                "explanation": "Katman dizilimi: 2 - 8 - 7 şeklindedir. 3 katman olduğu için 3. Periyot, son katmanda 7 elektron olduğu için 7A grubudur.",
                "options": [
                  {
                    "id": "k1",
                    "text": "3. Periyot, 7A Grubu (Halojen)",
                    "isCorrect": true
                  },
                  {
                    "id": "k2",
                    "text": "2. Periyot, 7A Grubu",
                    "isCorrect": false
                  },
                  {
                    "id": "k3",
                    "text": "3. Periyot, 8A Grubu",
                    "isCorrect": false
                  },
                  {
                    "id": "k4",
                    "text": "4. Periyot, 1A Grubu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-k2",
                "type": "matching",
                "prompt": "Kimyasal çözeltileri pH değerleriyle eşleştirin:",
                "difficulty": "kolay",
                "explanation": "Limon suyu asidik, saf su nötr, sabunlu su baziktir.",
                "pairs": [
                  {
                    "id": "kp1",
                    "left": "Limon Suyu / Mide Asidi",
                    "right": "pH < 7 (Kuvvetli Asit)"
                  },
                  {
                    "id": "kp2",
                    "left": "Saf Su",
                    "right": "pH = 7 (Nötr)"
                  },
                  {
                    "id": "kp3",
                    "left": "Çamaşır Suyu / Sabun",
                    "right": "pH > 7 (Kuvvetli Baz)"
                  }
                ]
              },
              {
                "id": "yks-k3",
                "type": "true_false",
                "prompt": "Soygazlar kararlı oldukları için bileşik oluşturmaya yatkın değil midir?",
                "statement": "8A grubu soygazlarının değerlik katmanları tam dolu olduğu için oda koşullarında kararlıdırlar.",
                "correctAnswer": true,
                "explanation": "Doğru! Helyum, Neon, Argon gibi soygazlar kararlı elektron dizilimine sahiptir."
              }
            ]
          }
        ]
      },
      {
        "id": "yks-u4",
        "number": 4,
        "title": "AYT Matematik: Trigonometri & Analitik Temeller",
        "description": "Birim çember, trigonometrik oranlar ve özdeşliklerin analitik incelemesi.",
        "color": "#af72ff",
        "lessons": [
          {
            "id": "yks-u4-l1",
            "unitId": "yks-u4",
            "title": "Fonksiyonlarda Değer Bulma & Bileşke",
            "description": "f(x) fonksiyonlarında işlem ve (fog)(x) bileşke fonksiyon kuralları.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "(f ∘ g)(x) = f(g(x)) demektir; önce içteki g(x) hesaplanır!",
              "f(x) = ax + b doğrusal fonksiyonun tersi f⁻¹(x) = (x - b) / a olur.",
              "Birebir ve örten fonksiyonların daima tersi vardır."
            ],
            "questions": [
              {
                "id": "yks-fnc-1",
                "type": "multiple_choice",
                "prompt": "f(x) = 3x - 5 olduğuna göre, f(4) değeri kaçtır?",
                "difficulty": "kolay",
                "explanation": "x yerine 4 yazılır: f(4) = 3(4) - 5 = 12 - 5 = 7 bulunur.",
                "options": [
                  {
                    "id": "fn1",
                    "text": "7",
                    "isCorrect": true
                  },
                  {
                    "id": "fn2",
                    "text": "9",
                    "isCorrect": false
                  },
                  {
                    "id": "fn3",
                    "text": "11",
                    "isCorrect": false
                  },
                  {
                    "id": "fn4",
                    "text": "5",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-fnc-2",
                "type": "multiple_choice",
                "prompt": "f(x) = 2x + 1 ve g(x) = x² - 3 olduğuna göre, (f ∘ g)(2) ifadesinin sonucu kaçtır?",
                "difficulty": "orta",
                "explanation": "(f ∘ g)(2) = f(g(2)). Önce g(2) = 2² - 3 = 4 - 3 = 1 bulunur. Sonra f(1) = 2(1) + 1 = 3 bulunur!",
                "options": [
                  {
                    "id": "fg1",
                    "text": "3",
                    "isCorrect": true
                  },
                  {
                    "id": "fg2",
                    "text": "5",
                    "isCorrect": false
                  },
                  {
                    "id": "fg3",
                    "text": "7",
                    "isCorrect": false
                  },
                  {
                    "id": "fg4",
                    "text": "1",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-fnc-3",
                "type": "multiple_choice",
                "prompt": "f(x) = x² - 6x + 14 parabolünün Tepe Noktasının ordinatı (k değeri) kaçtır?",
                "difficulty": "zor",
                "hint": "Tepe noktası T(r, k) formülü: r = -b / (2a) ve k = f(r).",
                "explanation": "r = -(-6) / (2 × 1) = 6 / 2 = 3. Şimdi fonksiyonda x = 3 yazalım: k = f(3) = 3² - 6(3) + 14 = 9 - 18 + 14 = 5 bulunur!",
                "options": [
                  {
                    "id": "tp1",
                    "text": "5",
                    "isCorrect": true
                  },
                  {
                    "id": "tp2",
                    "text": "3",
                    "isCorrect": false
                  },
                  {
                    "id": "tp3",
                    "text": "7",
                    "isCorrect": false
                  },
                  {
                    "id": "tp4",
                    "text": "14",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-fnc-4",
                "type": "true_false",
                "prompt": "f(x) = ax² + bx + c parabolünde a > 0 ise kollar yukarıya mı bakar?",
                "statement": "İkinci dereceden parabol fonksiyonlarında başkatsayı a > 0 olduğunda parabolün kolları yukarı doğrudur ve tepe noktası yerel minimumdur.",
                "correctAnswer": true,
                "explanation": "Doğrudur! a > 0 ise kollar yukarı, a < 0 ise kollar aşağı doğrudur."
              }
            ]
          },
          {
            "id": "yks-u4-l2",
            "unitId": "yks-u4",
            "title": "Trigonometri: Birim Çember & Özdeşlikler",
            "description": "sin²x + cos²x = 1 kuralı, tan-cot değerleri ve esas ölçü.",
            "xpReward": 30,
            "gemReward": 10,
            "type": "lesson",
            "summaryNotes": [
              "Temel Özdeşlik: sin²(x) + cos²(x) = 1",
              "tan(x) = sin(x) / cos(x) ve tan(x) × cot(x) = 1",
              "Birim çemberde yatay eksen cos, dikey eksen sin eksenidir."
            ],
            "questions": [
              {
                "id": "yks-trig-1",
                "type": "multiple_choice",
                "prompt": "sin(x) = 3/5 ve x dar açı (0 < x < 90°) olduğuna göre cos(x) değeri kaçtır?",
                "difficulty": "kolay",
                "explanation": "3-4-5 dik üçgeninden: karşı kenar 3, hipotenüs 5 ise komşu kenar 4 olur. cos(x) = komşu / hipotenüs = 4/5.",
                "options": [
                  {
                    "id": "tr1",
                    "text": "4/5",
                    "isCorrect": true
                  },
                  {
                    "id": "tr2",
                    "text": "3/4",
                    "isCorrect": false
                  },
                  {
                    "id": "tr3",
                    "text": "5/4",
                    "isCorrect": false
                  },
                  {
                    "id": "tr4",
                    "text": "1/2",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "yks-trig-2",
                "type": "matching",
                "prompt": "Özel açıların sinüs ve kosinüs değerlerini eşleştirin:",
                "difficulty": "orta",
                "explanation": "30, 45 ve 90 derece trigonometrik değerler.",
                "pairs": [
                  {
                    "id": "tp1",
                    "left": "sin(30°)",
                    "right": "1/2"
                  },
                  {
                    "id": "tp2",
                    "left": "sin(90°)",
                    "right": "1"
                  },
                  {
                    "id": "tp3",
                    "left": "cos(0°)",
                    "right": "1"
                  },
                  {
                    "id": "tp4",
                    "left": "tan(45°)",
                    "right": "1"
                  }
                ]
              },
              {
                "id": "yks-trig-3",
                "type": "true_false",
                "prompt": "Her reel x sayısı için sin(x) değeri -1 ile +1 aralığında mıdır?",
                "statement": "Sinüs fonksiyonu tüm reel sayılar kümesinde [-1, 1] aralığında değerler alır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Birim çember yarıçapı 1 olduğu için sin ve cos asla 1'i aşamaz ve -1'in altına inemez."
              }
            ]
          }
        ]
      },
      {
        "id": "yks-u5",
        "number": 5,
        "title": "TYT - AYT Geometri: Üçgenler & Açılar",
        "description": "Özel üçgenler (3-4-5, 30-60-90), Öklid bağıntıları ve Pisagor teoremi",
        "color": "#ffc800",
        "lessons": [
          {
            "id": "yks-u5-l1",
            "unitId": "yks-u5",
            "title": "Pisagor & Özel Dik Üçgenler",
            "description": "Hipotenüs bağıntısı ve kenarlarına göre özel dik üçgenler.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Pisagor Teoremi: a² + b² = c² (c: hipotenüs)",
              "Özel kenarlı dik üçgenler: (3-4-5), (5-12-13), (8-15-17), (7-24-25)",
              "30-60-90 üçgeninde: 30° nin karşısı a ise 90° nin karşısı 2a, 60° nin karşısı a√3 olur."
            ],
            "questions": [
              {
                "id": "geo-q1",
                "type": "multiple_choice",
                "prompt": "Dik kenar uzunlukları 6 cm ve 8 cm olan dik üçgenin hipotenüs uzunluğu kaç cm'dir?",
                "difficulty": "kolay",
                "explanation": "3-4-5 üçgeninin 2 katı: 6 - 8 - 10 üçgenidir! Dolayısıyla hipotenüs 10 cm bulunur.",
                "options": [
                  {
                    "id": "g1",
                    "text": "10 cm",
                    "isCorrect": true
                  },
                  {
                    "id": "g2",
                    "text": "12 cm",
                    "isCorrect": false
                  },
                  {
                    "id": "g3",
                    "text": "14 cm",
                    "isCorrect": false
                  },
                  {
                    "id": "g4",
                    "text": "9 cm",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "geo-q2",
                "type": "matching",
                "prompt": "Özel dik üçgen kenar oranlarını doğru eşleştirin:",
                "difficulty": "orta",
                "explanation": "3-4-5, 5-12-13 ve 8-15-17 ÖSYM'nin en sık sorduğu Pisagor üçgenleridir.",
                "pairs": [
                  {
                    "id": "gp1",
                    "left": "Dik kenarlar: 5 ve 12",
                    "right": "Hipotenüs: 13"
                  },
                  {
                    "id": "gp2",
                    "left": "Dik kenarlar: 8 ve 15",
                    "right": "Hipotenüs: 17"
                  },
                  {
                    "id": "gp3",
                    "left": "Dik kenarlar: 7 ve 24",
                    "right": "Hipotenüs: 25"
                  }
                ]
              },
              {
                "id": "geo-q3",
                "type": "multiple_choice",
                "prompt": "Bir dik üçgende hipotenüse ait yükseklik h, hipotenüste ayırdığı parçalar p ve k olsun. h = 6 cm ve p = 4 cm olduğuna göre k uzunluğu kaç cm'dir? (Öklid Bağıntısı)",
                "difficulty": "zor",
                "hint": "Öklid yüksekliğin karesi bağıntısı: h² = p × k.",
                "explanation": "Öklid teoremi: h² = p × k ➔ 6² = 4 × k ➔ 36 = 4k ➔ k = 9 cm bulunur!",
                "options": [
                  {
                    "id": "ok1",
                    "text": "9 cm",
                    "isCorrect": true
                  },
                  {
                    "id": "ok2",
                    "text": "6 cm",
                    "isCorrect": false
                  },
                  {
                    "id": "ok3",
                    "text": "8 cm",
                    "isCorrect": false
                  },
                  {
                    "id": "ok4",
                    "text": "12 cm",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "geo-q4",
                "type": "true_false",
                "prompt": "Bir üçgenin iç açıları toplamı 180 derece midir?",
                "statement": "Öklid geometrisinde tüm düzlemsel üçgenlerin iç açıları toplamı 180° dir.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Dış açılar toplamı ise her çokgende olduğu gibi 360° dir."
              }
            ]
          },
          {
            "id": "yks-u5-l2",
            "unitId": "yks-u5",
            "title": "Çemberde Açılar & Dairede Alan",
            "description": "Merkez açı, çevre açı özellikleri ve daire dilimi alanı formülleri.",
            "xpReward": 30,
            "gemReward": 10,
            "type": "lesson",
            "summaryNotes": [
              "Merkez açı gördüğü yayın ölçüsüne eşittir: α = gördüğü yay.",
              "Çevre açı gördüğü yayın YARISINA eşittir: β = yay / 2.",
              "Çapı gören çevre açı daima 90 derecedir!"
            ],
            "questions": [
              {
                "id": "geo-c1",
                "type": "multiple_choice",
                "prompt": "Bir çemberde aynı yayı gören çevre açının ölçüsü 40° olduğuna göre, merkez açının ölçüsü kaç derecedir?",
                "difficulty": "kolay",
                "explanation": "Çevre açı 40° ise gördüğü yay 80° dir. Merkez açı gördüğü yaya eşit olduğundan 80° olur.",
                "options": [
                  {
                    "id": "c1",
                    "text": "80°",
                    "isCorrect": true
                  },
                  {
                    "id": "c2",
                    "text": "40°",
                    "isCorrect": false
                  },
                  {
                    "id": "c3",
                    "text": "20°",
                    "isCorrect": false
                  },
                  {
                    "id": "c4",
                    "text": "160°",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "geo-c2",
                "type": "multiple_choice",
                "prompt": "Yarıçapı r = 6 cm olan bir dairenin alanı kaç cm² dir? (π = 3 alınız)",
                "difficulty": "kolay",
                "explanation": "Daire alanı = π × r² = 3 × 6² = 3 × 36 = 108 cm².",
                "options": [
                  {
                    "id": "da1",
                    "text": "108 cm²",
                    "isCorrect": true
                  },
                  {
                    "id": "da2",
                    "text": "36 cm²",
                    "isCorrect": false
                  },
                  {
                    "id": "da3",
                    "text": "72 cm²",
                    "isCorrect": false
                  },
                  {
                    "id": "da4",
                    "text": "216 cm²",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "geo-c3",
                "type": "true_false",
                "prompt": "Çapı gören çevre açı daima dik açı (90°) mıdır?",
                "statement": "Çemberde çapı gören çevre açının ölçüsü daima 90 derecedir.",
                "correctAnswer": true,
                "explanation": "Doğru! Çünkü çap çemberi 180° lik iki eşit yaya böler, çevre açı da yarısı olduğu için 180 / 2 = 90° olur."
              }
            ]
          }
        ]
      },
      {
        "id": "yks-u6",
        "number": 6,
        "title": "AYT Matematik: Fonksiyonlar & Parabol",
        "description": "Bileşke, ters fonksiyon, ikinci dereceden denklemler ve parabol tepe noktası.",
        "color": "#eab308",
        "lessons": [
          {
            "id": "yks-u6-l1",
            "unitId": "yks-u6",
            "title": "Fonksiyon Türleri, Bileşke & Ters Fonksiyon",
            "description": "Bileşke fonksiyon kuralları, görüntü kümesi ve ters fonksiyon bulma yöntemleri.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "(f o g)(x) = f(g(x)) olarak hesaplanır.",
              "f(x) = (ax + b) / (cx + d) ise f⁻¹(x) = (-dx + b) / (cx - a) olur.",
              "f(x) tek fonksiyon ise f(-x) = -f(x), çift fonksiyon ise f(-x) = f(x) olur."
            ],
            "questions": [
              {
                "id": "yks-q46",
                "type": "multiple_choice",
                "prompt": "f(x) = 3x - 5 ve (g o f)(x) = 6x - 7 olduğuna göre g(1) değeri kaçtır?",
                "difficulty": "orta",
                "hint": "f(x) = 1 yapan x değerini bulup (g o f) bileşkesinde yerine yaz.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "5",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "3",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "7",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "-1",
                    "isCorrect": false
                  }
                ],
                "explanation": "f(x) = 3x - 5 = 1 => 3x = 6 => x = 2. x = 2 için (g o f)(2) = g(f(2)) = g(1) = 6(2) - 7 = 5."
              },
              {
                "id": "yks-q47",
                "type": "multiple_choice",
                "prompt": "f(x) = (2x + 3) / (x - 4) fonksiyonunun tersi f⁻¹(x) aşağıdakilerden hangisidir?",
                "difficulty": "orta",
                "hint": "ax + b / cx + d formunda a ve d hem yer hem işaret değiştirir.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "(4x + 3) / (x - 2)",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "(4x - 3) / (x + 2)",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "(2x - 4) / (x + 3)",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "(-4x + 3) / (x - 2)",
                    "isCorrect": false
                  }
                ],
                "explanation": "f(x) = (ax+b)/(cx+d) tersi (-dx+b)/(cx-a) dır. a=2, d=-4 olduğundan tersi (4x+3)/(x-2) olur."
              },
              {
                "id": "yks-q48",
                "type": "multiple_choice",
                "prompt": "f(x) tek fonksiyon, g(x) çift fonksiyondur. Buna göre h(x) = f(x) · g(x) fonksiyonu için hangisi doğrudur?",
                "difficulty": "kolay",
                "hint": "h(-x) = f(-x) · g(-x) ifadesini incele.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Tek fonksiyondur",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Çift fonksiyondur",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Sabit fonksiyondur",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Birim fonksiyondur",
                    "isCorrect": false
                  }
                ],
                "explanation": "h(-x) = f(-x) · g(-x) = (-f(x)) · g(x) = -h(x) olduğundan h(x) tek fonksiyondur."
              },
              {
                "id": "yks-q49",
                "type": "multiple_choice",
                "prompt": "f(x) = |x - 2| + 3 fonksiyonunun görüntü kümesi aşağıdakilerden hangisidir?",
                "difficulty": "orta",
                "hint": "Mutlak değerli ifadenin en küçük değeri 0 dır.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "[3, ∞)",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "[2, ∞)",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "(-∞, 3]",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "R (Tüm Gerçel Sayılar)",
                    "isCorrect": false
                  }
                ],
                "explanation": "|x - 2| ≥ 0 olduğundan f(x) ≥ 0 + 3 => f(x) ≥ 3 olur. Görüntü kümesi [3, ∞) aralığıdır."
              }
            ]
          },
          {
            "id": "yks-u6-l2",
            "unitId": "yks-u6",
            "title": "İkinci Dereceden Denklemler & Parabol",
            "description": "Kök-katsayı bağıntıları, diskriminant analizi ve tepe noktası hesabı.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "ax² + bx + c = 0 için x₁ + x₂ = -b/a ve x₁ · x₂ = c/a dır.",
              "Çakışık iki kök için Δ = b² - 4ac = 0 olmalıdır.",
              "Parabolün tepe noktası T(r, k) için r = -b / (2a) ve k = f(r) dir."
            ],
            "questions": [
              {
                "id": "yks-q50",
                "type": "multiple_choice",
                "prompt": "x² - (m + 2)x + 16 = 0 denkleminin çakışık iki gerçel kökü olduğuna göre m pozitif değeri kaçtır?",
                "difficulty": "orta",
                "hint": "Çakışık iki kök için diskriminant (Δ) sıfır olmalıdır.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "6",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "4",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "8",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "10",
                    "isCorrect": false
                  }
                ],
                "explanation": "Δ = b² - 4ac = (m+2)² - 4(1)(16) = 0 => (m+2)² = 64 => m + 2 = 8 => m = 6."
              },
              {
                "id": "yks-q51",
                "type": "multiple_choice",
                "prompt": "x² - 5x + 3 = 0 denkleminin kökleri x₁ ve x₂ olduğuna göre (1/x₁) + (1/x₂) toplamı kaçtır?",
                "difficulty": "orta",
                "hint": "Paydaları eşitleyerek kökler toplamı ve çarpımını kullan.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "5/3",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "3/5",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "-5/3",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "5",
                    "isCorrect": false
                  }
                ],
                "explanation": "(1/x₁) + (1/x₂) = (x₁ + x₂) / (x₁ · x₂). x₁ + x₂ = 5 ve x₁ · x₂ = 3 olduğundan sonuç 5/3 tür."
              },
              {
                "id": "yks-q52",
                "type": "multiple_choice",
                "prompt": "f(x) = x² - 6x + 11 parabolünün tepe noktasının koordinatları T(r, k) aşağıdakilerden hangisidir?",
                "difficulty": "orta",
                "hint": "r = -b / (2a) formülünü uygulayıp k = f(r) değerini bul.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "(3, 2)",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "(-3, 2)",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "(3, -2)",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "(6, 11)",
                    "isCorrect": false
                  }
                ],
                "explanation": "r = -(-6) / (2·1) = 3. k = f(3) = 3² - 6(3) + 11 = 9 - 18 + 11 = 2. T(3, 2)."
              },
              {
                "id": "yks-q53",
                "type": "multiple_choice",
                "prompt": "f(x) = -2x² + 8x + 1 fonksiyonunun alabileceği EN BÜYÜK değer kaçtır?",
                "difficulty": "orta",
                "hint": "Kolları aşağı doğru olan parabolün en büyük değeri tepe noktasının ordinatıdır.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "9",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "7",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "11",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "5",
                    "isCorrect": false
                  }
                ],
                "explanation": "a = -2 < 0 olduğundan en büyük değer tepe noktasındadır. r = -8 / (2·(-2)) = 2. f(2) = -2(4) + 8(2) + 1 = -8 + 16 + 1 = 9."
              }
            ]
          }
        ]
      },
      {
        "id": "dil-u6",
        "number": 6,
        "title": "İleri Düzey Akademik & C1 Yetkinlik (PRO)",
        "description": "Inversion, Cleft Sentences ve Karmaşık Akademik Metinler",
        "color": "#1cb0f6",
        "isPremiumOnly": true,
        "lessons": [
          {
            "id": "dil-u6-l1",
            "unitId": "dil-u6",
            "title": "Inversion (Devrik Cümleler)",
            "description": "Hardly had I, Seldom do we, Under no circumstances kuralları.",
            "xpReward": 35,
            "gemReward": 10,
            "type": "lesson",
            "summaryNotes": [
              "'Seldom / Rarely' başa geldiğinde devrik yapı kurulur: Seldom have I seen such beauty.",
              "'Hardly ... when' ve 'No sooner ... than' geçmişte art arda olan iki eylemi bağlar.",
              "'Under no circumstances' güvenlik ve kesin yasak cümlelerinde kullanılır."
            ],
            "questions": [
              {
                "id": "dil-c1-q1",
                "type": "multiple_choice",
                "prompt": "Choose the grammatically correct inverted sentence:",
                "difficulty": "zor",
                "explanation": "Cümle 'Hardly' gibi olumsuz bir zarfla başladığında yardımcı fiil özneden önce gelir: 'Hardly had we arrived...'",
                "options": [
                  { "id": "c1o1", "text": "Hardly had we arrived at the station when the train pulled in.", "isCorrect": true },
                  { "id": "c1o2", "text": "Hardly we had arrived at the station when the train pulled in.", "isCorrect": false },
                  { "id": "c1o3", "text": "Hardly did we arrived at the station when the train pulled in.", "isCorrect": false },
                  { "id": "c1o4", "text": "Hardly we arrived at the station when the train pulled in.", "isCorrect": false }
                ]
              },
              {
                "id": "dil-c1-q2",
                "type": "multiple_choice",
                "prompt": "'Under no circumstances ______ the alarm code to anyone.' Boşluğa ne gelmelidir?",
                "difficulty": "zor",
                "explanation": "'Under no circumstances' başa geldiğinde devriklik gerektirir: 'should you reveal'.",
                "options": [
                  { "id": "c1o21", "text": "should you reveal", "isCorrect": true },
                  { "id": "c1o22", "text": "you should reveal", "isCorrect": false },
                  { "id": "c1o23", "text": "you reveal", "isCorrect": false },
                  { "id": "c1o24", "text": "have you to reveal", "isCorrect": false }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "dil-u7",
        "number": 7,
        "title": "C2 Usta & Edebi Dil Hakimiyeti (PRO)",
        "description": "Subjunctive Mood, İleri Düzey Deyimler ve Nüanslar",
        "color": "#1cb0f6",
        "isPremiumOnly": true,
        "lessons": [
          {
            "id": "dil-u7-l1",
            "unitId": "dil-u7",
            "title": "Subjunctive Mood & Formal Discourse",
            "description": "'It is imperative that he be present', 'Lest they forget' yapıları.",
            "xpReward": 40,
            "gemReward": 15,
            "type": "lesson",
            "summaryNotes": [
              "Subjunctive yapılarda özne ne olursa olsun fiilin yalın hali (be, do, go) kullanılır.",
              "'Lest' = ... olmasın diye / korkusuyla (Lest he fail the exam...)",
              "'Be that as it may' = Öyle olsa bile / Ne olursa olsun anlamına gelen edebi bir bağlaçtır."
            ],
            "questions": [
              {
                "id": "dil-c2-q1",
                "type": "multiple_choice",
                "prompt": "'The committee insisted that the CEO ______ immediately.' Boşluğa hangi seçenek uygundur?",
                "difficulty": "sampiyon",
                "explanation": "İngilizce subjunctive (dilek/şart) yapısında 'insist that' sonrasında fiil yalın (bare infinitive) 'resign' kullanılır.",
                "options": [
                  { "id": "c2o1", "text": "resign", "isCorrect": true },
                  { "id": "c2o2", "text": "resigns", "isCorrect": false },
                  { "id": "c2o3", "text": "resigned", "isCorrect": false },
                  { "id": "c2o4", "text": "was resigning", "isCorrect": false }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kodlama",
    "name": "Kodlama & Yazılım",
    "subTitle": "Python, JavaScript, Algoritmalar & Yapay Zeka",
    "icon": "💻",
    "badge": "Geleceğin Mesleği",
    "color": "#af72ff",
    "accentColor": "#9047ff",
    "units": [
      {
        "id": "kod-u1",
        "number": 1,
        "title": "Python Temelleri & Söz Dizimi",
        "description": "Değişkenler, dinamik tipleme, string metodları ve operatörler",
        "color": "#af72ff",
        "lessons": [
          {
            "id": "kod-u1-l1",
            "unitId": "kod-u1",
            "title": "Değişkenler ve Ekrana Yazdırma",
            "description": "Python syntax yapısı ve temel konsol çıktıları.",
            "xpReward": 20,
            "gemReward": 5,
            "type": "lesson",
            "summaryNotes": [
              "print('Metin'): Ekrana metin yazar.",
              "Değişken tanımlarken tip belirtmeye gerek yoktur (Dinamik tip).",
              "str: Metin, int: Tam sayı, float: Ondalıklı sayı, bool: True/False"
            ],
            "questions": [
              {
                "id": "code-q1",
                "type": "code_fill",
                "prompt": "Python'da ekrana 'Merhaba Knowza!' yazdırmak için eksik fonksiyonu tamamlayın:",
                "codeSnippet": "___('Merhaba Knowza!')",
                "blankId": "print",
                "options": [
                  "print",
                  "console.log",
                  "echo",
                  "display"
                ],
                "correctAnswer": "print",
                "explanation": "Python'da standart çıktı vermek için yerleşik print() fonksiyonu kullanılır."
              },
              {
                "id": "code-q2",
                "type": "multiple_choice",
                "prompt": "x = '15' ve y = 5 olduğunda type(x) ve type(y) sırasıyla nedir?",
                "difficulty": "kolay",
                "explanation": "Tırnak içerisindeki değerler string (str), tırnaksız tam sayılar integer (int) veri tipindedir.",
                "options": [
                  {
                    "id": "c1",
                    "text": "str ve int",
                    "isCorrect": true
                  },
                  {
                    "id": "c2",
                    "text": "int ve str",
                    "isCorrect": false
                  },
                  {
                    "id": "c3",
                    "text": "int ve float",
                    "isCorrect": false
                  },
                  {
                    "id": "c4",
                    "text": "str ve float",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "code-q3",
                "type": "matching",
                "prompt": "Python veri tiplerini örnekleriyle eşleştirin:",
                "difficulty": "kolay",
                "explanation": "int: tam sayı, float: ondalıklı, bool: mantıksal, list: sıralı koleksiyon.",
                "pairs": [
                  {
                    "id": "cp1",
                    "left": "42",
                    "right": "int (Tam sayı)"
                  },
                  {
                    "id": "cp2",
                    "left": "3.14",
                    "right": "float (Ondalıklı)"
                  },
                  {
                    "id": "cp3",
                    "left": "True",
                    "right": "bool (Mantıksal)"
                  },
                  {
                    "id": "cp4",
                    "left": "['elma', 'armut']",
                    "right": "list (Liste)"
                  }
                ]
              },
              {
                "id": "code-q4",
                "type": "true_false",
                "prompt": "Python'da değişken adları bir rakam ile başlayabilir mi?",
                "statement": "Python değişken adları (örneğin 1sayi = 10) rakamla başlayabilir.",
                "correctAnswer": false,
                "explanation": "Doğru! Değişken adları harf veya alt çizgi (_) ile başlamalıdır, rakamla başlayamaz!"
              }
            ]
          },
          {
            "id": "kod-u1-l2",
            "unitId": "kod-u1",
            "title": "Döngüler & Koşullar (if/else)",
            "description": "Karar yapıları ve for/while döngüleri ile program akışını yönetme.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "if koşul: ... elif koşul: ... else: yapısı kullanılır.",
              "range(başlangıç, bitiş, adım) sayı dizisi üretir (bitiş değeri dahil edilmez).",
              "break döngüyü sonlandırır, continue o anki adımı atlar."
            ],
            "questions": [
              {
                "id": "code-q5",
                "type": "code_fill",
                "prompt": "Bir sayının 10'dan büyük olup olmadığını kontrol etmek için eksik anahtar kelimeyi seçin:",
                "codeSnippet": "sayi = 15\n___ sayi > 10:\n    print('Büyük')",
                "blankId": "if",
                "options": [
                  "if",
                  "while",
                  "check",
                  "when"
                ],
                "correctAnswer": "if",
                "explanation": "Koşullu ifadeler için 'if' anahtar sözcüğü kullanılır."
              },
              {
                "id": "code-q6",
                "type": "multiple_choice",
                "prompt": "for i in range(3): print(i) kodunun çıktısı ne olur?",
                "difficulty": "orta",
                "explanation": "range(3), 0'dan başlayarak 3'e kadar (3 hariç) 0, 1, 2 değerlerini üretir.",
                "options": [
                  {
                    "id": "r1",
                    "text": "0 1 2",
                    "isCorrect": true
                  },
                  {
                    "id": "r2",
                    "text": "1 2 3",
                    "isCorrect": false
                  },
                  {
                    "id": "r3",
                    "text": "0 1 2 3",
                    "isCorrect": false
                  },
                  {
                    "id": "r4",
                    "text": "3",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "code-q6b",
                "type": "multiple_choice",
                "prompt": "Python'da 'x = 10' ve 'y = 3' iken x // y işleminin (tamsayı bölmesi) sonucu nedir?",
                "difficulty": "kolay",
                "explanation": "// operatörü taban (tamsayı) bölmesi yapar: 10 // 3 = 3.",
                "options": [
                  {
                    "id": "op1",
                    "text": "3",
                    "isCorrect": true
                  },
                  {
                    "id": "op2",
                    "text": "3.333",
                    "isCorrect": false
                  },
                  {
                    "id": "op3",
                    "text": "1",
                    "isCorrect": false
                  },
                  {
                    "id": "op4",
                    "text": "4",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "code-q6c",
                "type": "true_false",
                "prompt": "Python'da girintileme (indentation) zorunlu mudur?",
                "statement": "Python kod bloklarını süslü parantez {} yerine 4 boşluk girinti (indentation) ile belirler.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Girintileme sözdizimsel bir kuraldır ve hata almamak için şarttır."
              }
            ]
          },
          {
            "id": "kod-u1-chest",
            "unitId": "kod-u1",
            "title": "Geliştirici Sandığı 🎁",
            "description": "Python mantık ve kodlama pratik bonus soruları!",
            "xpReward": 50,
            "gemReward": 30,
            "type": "lesson",
            "questions": [
              {
                "id": "kod-chest-q1",
                "type": "multiple_choice",
                "prompt": "Python'da 7 // 2 işleminin sonucu nedir?",
                "difficulty": "kolay",
                "explanation": "// operatörü tam bölme yapar (taban bölme). 7 // 2 = 3 sonucunu verir.",
                "options": [
                  {
                    "id": "kc1",
                    "text": "3",
                    "isCorrect": true
                  },
                  {
                    "id": "kc2",
                    "text": "3.5",
                    "isCorrect": false
                  },
                  {
                    "id": "kc3",
                    "text": "4",
                    "isCorrect": false
                  },
                  {
                    "id": "kc4",
                    "text": "1",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-chest-q2",
                "type": "true_false",
                "prompt": "Python'da listeler (list) değiştirilebilir (mutable) veri tipleridir.",
                "statement": "Listeler oluşturulduktan sonra elemanları güncellenebilir veya silinebilir.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Listeler mutable (değiştirilebilir), tuple (demet) ise immutable (değiştirilemez) tiptir."
              },
              {
                "id": "kod-chest-q3",
                "type": "multiple_choice",
                "prompt": "len('Knowza') ifadesinin çıktısı nedir?",
                "difficulty": "kolay",
                "explanation": "'Knowza' kelimesi 6 karakterden oluşur, bu yüzden len fonksiyonu 6 döner.",
                "options": [
                  {
                    "id": "kl1",
                    "text": "6",
                    "isCorrect": true
                  },
                  {
                    "id": "kl2",
                    "text": "5",
                    "isCorrect": false
                  },
                  {
                    "id": "kl3",
                    "text": "7",
                    "isCorrect": false
                  },
                  {
                    "id": "kl4",
                    "text": "None",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "kod-u2",
        "number": 2,
        "title": "Veri Yapıları & Algoritmalar",
        "description": "Listeler, Sözlükler (Dictionary), Kümeler ve Big O Karmaşıklığı",
        "color": "#1cb0f6",
        "lessons": [
          {
            "id": "kod-u2-l1",
            "unitId": "kod-u2",
            "title": "Sözlükler (Key-Value) & List Metodları",
            "description": "Verileri anahtar-değer çiftleriyle saklama ve hızlı erişim.",
            "xpReward": 30,
            "gemReward": 10,
            "type": "lesson",
            "summaryNotes": [
              "list.append(x) sona ekler, list.pop() sondan siler.",
              "dict['anahtar'] = deger şeklinde veri eklenir veya güncellenir.",
              "set (küme) tekrarlayan elemanları otomatik olarak temizler."
            ],
            "questions": [
              {
                "id": "code-q7",
                "type": "multiple_choice",
                "prompt": "ogrenci = {'ad': 'Ali', 'puan': 95} sözlüğünde Ali'nin puanını ekrana yazdırmak için hangi kod kullanılır?",
                "difficulty": "kolay",
                "explanation": "Sözlüklerde bir değere erişmek için anahtar ismi köşeli parantez içinde verilir: ogrenci['puan'] ➔ 95.",
                "options": [
                  {
                    "id": "d1",
                    "text": "ogrenci['puan']",
                    "isCorrect": true
                  },
                  {
                    "id": "d2",
                    "text": "ogrenci[1]",
                    "isCorrect": false
                  },
                  {
                    "id": "d3",
                    "text": "ogrenci.puan()",
                    "isCorrect": false
                  },
                  {
                    "id": "d4",
                    "text": "ogrenci.get_index(95)",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "code-q8",
                "type": "matching",
                "prompt": "Zaman karmaşıklıklarını (Big-O) örnek operasyonlarla eşleştirin:",
                "difficulty": "orta",
                "explanation": "O(1) anında erişim, O(n) diziyi tek tur tarama, O(log n) ikili arama (Binary Search).",
                "pairs": [
                  {
                    "id": "b1",
                    "left": "O(1) - Sabit Zaman",
                    "right": "Dizi indeksine doğrudan erişim"
                  },
                  {
                    "id": "b2",
                    "left": "O(n) - Doğrusal Zaman",
                    "right": "Dizideki tüm elemanları for ile gezme"
                  },
                  {
                    "id": "b3",
                    "left": "O(log n) - Logaritmik Zaman",
                    "right": "Sıralı dizide İkili Arama (Binary Search)"
                  }
                ]
              },
              {
                "id": "code-q9",
                "type": "multiple_choice",
                "prompt": "Python'da sayilar = [1, 2, 2, 3, 4, 4] listesindeki tekrarları tek satırda silmek için ne yapılır?",
                "difficulty": "orta",
                "explanation": "set() fonksiyonu tüm yinelenen elemanları eler: list(set(sayilar)) benzersiz elemanları verir.",
                "options": [
                  {
                    "id": "st1",
                    "text": "list(set(sayilar))",
                    "isCorrect": true
                  },
                  {
                    "id": "st2",
                    "text": "sayilar.unique()",
                    "isCorrect": false
                  },
                  {
                    "id": "st3",
                    "text": "sayilar.filter()",
                    "isCorrect": false
                  },
                  {
                    "id": "st4",
                    "text": "clean(sayilar)",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "code-q10",
                "type": "true_false",
                "prompt": "Stack (Yığıt) veri yapısı LIFO (Last In First Out - Son Giren İlk Çıkar) prensibiyle mi çalışır?",
                "statement": "Stack veri yapısında en son eklenen eleman ilk olarak çıkarılır (LIFO).",
                "correctAnswer": true,
                "explanation": "Doğrudur! Tıpkı üst üste dizilmiş tabaklar gibi en son konan tabak en önce alınır."
              }
            ]
          },
          {
            "id": "kod-u2-l2",
            "unitId": "kod-u2",
            "title": "Sıralama Algoritmaları & Binary Search",
            "description": "İkili arama mantığı, Bubble Sort ve Merge Sort kıyaslaması.",
            "xpReward": 35,
            "gemReward": 12,
            "type": "lesson",
            "summaryNotes": [
              "Binary Search (İkili Arama) çalışabilmesi için dizinin mutlaka SIRALI olması şarttır!",
              "Binary Search karmaşıklığı O(log n)'dir.",
              "Merge Sort ve Quick Sort ortalama O(n log n) hızında çalışır."
            ],
            "questions": [
              {
                "id": "code-alg1",
                "type": "multiple_choice",
                "prompt": "İkili Arama (Binary Search) algoritmasının çalışabilmesi için arama yapılacak dizide hangi şart zorunludur?",
                "difficulty": "kolay",
                "explanation": "Binary Search her adımda diziyi ortadan ikiye bölerek arama yapar; bu nedenle dizinin kesinlikle küçükten büyüğe sıralı olması gerekir.",
                "options": [
                  {
                    "id": "al1",
                    "text": "Dizinin mutlaka sıralı olması gerekir",
                    "isCorrect": true
                  },
                  {
                    "id": "al2",
                    "text": "Tüm sayıların pozitif olması gerekir",
                    "isCorrect": false
                  },
                  {
                    "id": "al3",
                    "text": "Dizinin eleman sayısının çift olması gerekir",
                    "isCorrect": false
                  },
                  {
                    "id": "al4",
                    "text": "Dizide string bulunmaması gerekir",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "code-alg2",
                "type": "matching",
                "prompt": "Sıralama algoritmalarını en kötü durum (Worst Case) zaman karmaşıklıklarıyla eşleştirin:",
                "difficulty": "zor",
                "explanation": "Bubble Sort O(n²), Merge Sort garantili O(n log n).",
                "pairs": [
                  {
                    "id": "sp1",
                    "left": "Bubble Sort / Insertion Sort",
                    "right": "O(n²) - Karesel Karmaşıklık"
                  },
                  {
                    "id": "sp2",
                    "left": "Merge Sort",
                    "right": "O(n log n) - Parçala ve Fethet"
                  },
                  {
                    "id": "sp3",
                    "left": "Doğrusal Arama (Linear Search)",
                    "right": "O(n) - Tek tek kontrol"
                  }
                ]
              },
              {
                "id": "code-alg3",
                "type": "true_false",
                "prompt": "1024 elemanlı sıralı bir dizide Binary Search en fazla 10 adımda sonuca ulaşır mı?",
                "statement": "2¹⁰ = 1024 olduğu için 1024 elemanlı sıralı bir dizide Binary Search en çok 10 karşılaştırmada aranan elemanı bulur veya olmadığını kanıtlar.",
                "correctAnswer": true,
                "explanation": "Harika! log₂(1024) = 10 olduğu için tam olarak en fazla 10 adım sürer."
              }
            ]
          }
        ]
      },
      {
        "id": "kod-u3",
        "number": 3,
        "title": "Python Fonksiyonlar & Modüller (*args, **kwargs)",
        "description": "def, return, lambda fonksiyonları, varsayılan parametreler ve built-in modüller",
        "color": "#af72ff",
        "lessons": [
          {
            "id": "kod-u3-l1",
            "unitId": "kod-u3",
            "title": "Fonksiyonlar ve Parametre Yönetimi",
            "description": "Fonksiyon tanımlama, return, varsayılan argümanlar ve değişken uzunluklu parametreler.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "def anahtar kelimesiyle fonksiyon tanımlanır.",
              "*args: İstenilen sayıda konumsal argümanı bir TUPLE (demet) olarak toplar.",
              "**kwargs: İstenilen sayıda anahtar-değer (keyword) argümanını bir DICTIONARY (sözlük) olarak toplar.",
              "return ifadesi fonksiyonun çalışmasını anında durdurur ve çağrıldığı yere değer döner."
            ],
            "questions": [
              {
                "id": "kod-q-fn1",
                "type": "multiple_choice",
                "prompt": "Python'da 'def topla(*sayilar):' fonksiyonu tanımlandığında, fonksiyon içinde 'sayilar' değişkeninin veri tipi nedir?",
                "difficulty": "orta",
                "hint": "*args tek yıldızlı değişkenler demet (tuple) oluşturur.",
                "explanation": "*args yapısı gelen tüm argümanları bir 'tuple' (demet) veri tipinde toplar.",
                "options": [
                  {
                    "id": "fn1_a",
                    "text": "tuple (Demet)",
                    "isCorrect": true
                  },
                  {
                    "id": "fn1_b",
                    "text": "list (Liste)",
                    "isCorrect": false
                  },
                  {
                    "id": "fn1_c",
                    "text": "dict (Sözlük)",
                    "isCorrect": false
                  },
                  {
                    "id": "fn1_d",
                    "text": "set (Küme)",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-fn2",
                "type": "matching",
                "prompt": "Fonksiyon anahtar kelimelerini görevleriyle eşleştiriniz:",
                "difficulty": "kolay",
                "explanation": "def tanımlar, return döner, lambda tek satırlıktır, yield jeneratördür.",
                "pairs": [
                  {
                    "id": "fp1",
                    "left": "def",
                    "right": "Fonksiyon tanımlama"
                  },
                  {
                    "id": "fp2",
                    "left": "return",
                    "right": "Fonksiyondan değer döndürme ve sonlandırma"
                  },
                  {
                    "id": "fp3",
                    "left": "lambda",
                    "right": "İsimsiz, tek satırlık pratik fonksiyon"
                  }
                ]
              },
              {
                "id": "kod-q-fn3",
                "type": "multiple_choice",
                "prompt": "kare = lambda x: x ** 2\nprint(kare(6))\n\nYukarıdaki kod çalıştırıldığında ekrana ne yazdırılır?",
                "difficulty": "kolay",
                "explanation": "lambda fonksiyonu 6'nın karesini (6 ** 2 = 36) hesaplar ve ekrana yazdırır.",
                "options": [
                  {
                    "id": "lm1",
                    "text": "36",
                    "isCorrect": true
                  },
                  {
                    "id": "lm2",
                    "text": "12",
                    "isCorrect": false
                  },
                  {
                    "id": "lm3",
                    "text": "6",
                    "isCorrect": false
                  },
                  {
                    "id": "lm4",
                    "text": "SyntaxError",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-fn4",
                "type": "true_false",
                "prompt": "Fonksiyonda return sonrası kodlar çalışır mı?",
                "statement": "Bir fonksiyon içerisinde 'return' komutu çalıştırıldığı anda fonksiyon sona erer ve altındaki satırlar çalıştırılmaz.",
                "correctAnswer": true,
                "explanation": "Doğrudur! return fonksiyonu derhal sonlandırır ve kontrolü çağıran yere devreder."
              }
            ]
          },
          {
            "id": "kod-u3-l2",
            "unitId": "kod-u3",
            "title": "List Comprehension, map() ve filter()",
            "description": "Tek satırda liste üretimi, fonksiyonel programlama ve pip modül yönetimi.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "List Comprehension: [ifade for eleman in liste if kosul]",
              "map(fonksiyon, liste): Listenin her elemanına fonksiyonu uygular.",
              "filter(fonksiyon, liste): Yalnızca True dönen elemanları seçer.",
              "pip install <paket>: Harici kütüphaneleri (requests, pandas vb.) sisteme kurar."
            ],
            "questions": [
              {
                "id": "kod-q-lc1",
                "type": "multiple_choice",
                "prompt": "[x * 2 for x in [1, 2, 3, 4] if x % 2 == 0] ifadesinin çıktısı nedir?",
                "difficulty": "orta",
                "hint": "Önce çift olanlar filtrelenir (2 ve 4), sonra her biri 2 ile çarpılır.",
                "explanation": "Listede çift olan sayılar 2 ve 4'tür. 2*2=4 ve 4*2=8 olur. Sonuç [4, 8] listesidir.",
                "options": [
                  {
                    "id": "lc1_a",
                    "text": "[4, 8]",
                    "isCorrect": true
                  },
                  {
                    "id": "lc1_b",
                    "text": "[2, 4, 6, 8]",
                    "isCorrect": false
                  },
                  {
                    "id": "lc1_c",
                    "text": "[2, 4]",
                    "isCorrect": false
                  },
                  {
                    "id": "lc1_d",
                    "text": "[8]",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-lc2",
                "type": "matching",
                "prompt": "Fonksiyonel metodları amaçlarıyla eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "map dönüştürür, filter süzer, zip iki listeyi birleştirip eşler.",
                "pairs": [
                  {
                    "id": "lp1",
                    "left": "map()",
                    "right": "Her elemana fonksiyonu uygulayıp dönüştürür"
                  },
                  {
                    "id": "lp2",
                    "left": "filter()",
                    "right": "Şarta uyan elemanları süzer"
                  },
                  {
                    "id": "lp3",
                    "left": "zip()",
                    "right": "İki listeyi ikili demetler halinde eşler"
                  }
                ]
              },
              {
                "id": "kod-q-lc3",
                "type": "multiple_choice",
                "prompt": "Python'da harici bir kütüphaneyi terminalden yüklemek için kullanılan resmi paket yöneticisi komutu hangisidir?",
                "difficulty": "kolay",
                "explanation": "Python Package Index (PyPI) paketlerini kurmak için 'pip install <paket_adi>' kullanılır.",
                "options": [
                  {
                    "id": "pip1",
                    "text": "pip install <paket>",
                    "isCorrect": true
                  },
                  {
                    "id": "pip2",
                    "text": "npm install <paket>",
                    "isCorrect": false
                  },
                  {
                    "id": "pip3",
                    "text": "python get <paket>",
                    "isCorrect": false
                  },
                  {
                    "id": "pip4",
                    "text": "brew add <paket>",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-lc4",
                "type": "true_false",
                "prompt": "**kwargs parametresi sözlük (dictionary) olarak mı saklanır?",
                "statement": "Python fonksiyonlarında iki yıldızlı (**kwargs) parametresi, gönderilen tüm isimli argümanları anahtar-değer sözlüğü (dict) olarak tutar.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Örneğin fonk(ad='Ali', yas=20) çağrıldığında kwargs = {'ad': 'Ali', 'yas': 20} olur."
              }
            ]
          }
        ]
      },
      {
        "id": "kod-u4",
        "number": 4,
        "title": "Nesne Yönelimli Programlama (OOP): Class & Self",
        "description": "Sınıf tanımlama, kurucu fonksiyon (__init__), nesne örnekleme ve kalıtım",
        "color": "#af72ff",
        "lessons": [
          {
            "id": "kod-u4-l1",
            "unitId": "kod-u4",
            "title": "Sınıf Yapısı & __init__ Kurucusu",
            "description": "Class tanımı, constructor mantığı, self referansı ve nesne türetme.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "class anahtar kelimesi ile nesne şablonu (sınıf) tanımlanır.",
              "__init__(self, ...) metodu, nesne oluşturulduğu an otomatik çalışan yapıcı (constructor) fonksiyondur.",
              "self parametresi, oluşturulan o anki somut nesnenin kendisini temsil eder.",
              "Örnek: araba1 = Araba('Kırmızı', 'Sedan')"
            ],
            "questions": [
              {
                "id": "kod-q-op1",
                "type": "multiple_choice",
                "prompt": "Python sınıfı içindeki metodların ilk parametresi geleneksel olarak ne olarak adlandırılır?",
                "difficulty": "kolay",
                "explanation": "Python'da sınıf metodlarının ilk parametresi nesnenin kendisini işaret eden 'self' referansıdır.",
                "options": [
                  {
                    "id": "op1_a",
                    "text": "self",
                    "isCorrect": true
                  },
                  {
                    "id": "op1_b",
                    "text": "this",
                    "isCorrect": false
                  },
                  {
                    "id": "op1_c",
                    "text": "cls",
                    "isCorrect": false
                  },
                  {
                    "id": "op1_d",
                    "text": "object",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-op2",
                "type": "matching",
                "prompt": "OOP temel kavramlarını anlamlarıyla eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "Class şablondur, Object somut örnektir, Attribute özelliktir, Method işlevdir.",
                "pairs": [
                  {
                    "id": "oop1",
                    "left": "Class (Sınıf)",
                    "right": "Nesnelerin genel planı ve şablonu"
                  },
                  {
                    "id": "oop2",
                    "left": "Object (Nesne)",
                    "right": "Sınıftan türetilen somut varlık"
                  },
                  {
                    "id": "oop3",
                    "left": "Method (Metod)",
                    "right": "Sınıfa ait fonksiyonlar ve eylemler"
                  }
                ]
              },
              {
                "id": "kod-q-op3",
                "type": "multiple_choice",
                "prompt": "'class Ogrenci:' sınıfından 'ogrenci1' adında yeni bir nesne üretmek için doğru söz dizimi hangisidir?",
                "difficulty": "kolay",
                "explanation": "Sınıf adının yanına parantez açılarak çağrılır: ogrenci1 = Ogrenci()",
                "options": [
                  {
                    "id": "ins1",
                    "text": "ogrenci1 = Ogrenci()",
                    "isCorrect": true
                  },
                  {
                    "id": "ins2",
                    "text": "ogrenci1 = new Ogrenci()",
                    "isCorrect": false
                  },
                  {
                    "id": "ins3",
                    "text": "Ogrenci.create(ogrenci1)",
                    "isCorrect": false
                  },
                  {
                    "id": "ins4",
                    "text": "ogrenci1 -> Ogrenci()",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-op4",
                "type": "true_false",
                "prompt": "__init__ metodu nesne oluşturulduğunda otomatik çalışır mı?",
                "statement": "__init__ kurucu (constructor) fonksiyonu, sınıftan bir nesne oluşturulduğu anda Python tarafından otomatik olarak çağrılır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Nesnenin başlangıç özelliklerini (attributes) atamak için kullanılır."
              }
            ]
          },
          {
            "id": "kod-u4-l2",
            "unitId": "kod-u4",
            "title": "Kalıtım (Inheritance) & Polimorfizm",
            "description": "Üst sınıftan miras alma, super() kullanımı ve metod ezme (override).",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Kalıtım: class Kopek(Hayvan): şeklinde alt sınıf üst sınıfın tüm özelliklerini miras alır.",
              "super().__init__() ile üst sınıfın kurucu metodu çağrılır.",
              "Override: Alt sınıfın üst sınıftaki bir metodu kendi ihtiyacına göre yeniden yazmasıdır.",
              "Encapsulation: Çift alt çizgi (__gizli) değişkenleri private yapar."
            ],
            "questions": [
              {
                "id": "kod-q-inh1",
                "type": "multiple_choice",
                "prompt": "Alt sınıf içinden üst (ata) sınıfın metodunu çağırmak için hangi fonksiyon kullanılır?",
                "difficulty": "orta",
                "explanation": "super() fonksiyonu üst sınıfa erişmek ve ata sınıfın metodlarını çalıştırmak için kullanılır.",
                "options": [
                  {
                    "id": "inh1_a",
                    "text": "super()",
                    "isCorrect": true
                  },
                  {
                    "id": "inh1_b",
                    "text": "parent()",
                    "isCorrect": false
                  },
                  {
                    "id": "inh1_c",
                    "text": "base()",
                    "isCorrect": false
                  },
                  {
                    "id": "inh1_d",
                    "text": "root()",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-inh2",
                "type": "matching",
                "prompt": "OOP prensiplerini açıklamalarıyla eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "Kalıtım miras alır, Kapsülleme gizler, Polimorfizm çok biçimliliktir.",
                "pairs": [
                  {
                    "id": "ip1",
                    "left": "Kalıtım (Inheritance)",
                    "right": "Bir sınıfın başka bir sınıfın özelliklerini devralması"
                  },
                  {
                    "id": "ip2",
                    "left": "Kapsülleme (Encapsulation)",
                    "right": "Verilerin dışarıdan doğrudan değiştirilmesini kısıtlama"
                  },
                  {
                    "id": "ip3",
                    "left": "Polimorfizm (Polymorphism)",
                    "right": "Aynı isimli metodun farklı sınıflarda farklı davranması"
                  }
                ]
              },
              {
                "id": "kod-q-inh3",
                "type": "multiple_choice",
                "prompt": "Python'da bir sınıfın birden fazla sınıftan miras almasına ne ad verilir?",
                "difficulty": "orta",
                "explanation": "Python'da bir sınıf 'class C(A, B):' şeklinde birden fazla üst sınıftan türeyebilir; buna Multiple Inheritance denir.",
                "options": [
                  {
                    "id": "mi1",
                    "text": "Çoklu Kalıtım (Multiple Inheritance)",
                    "isCorrect": true
                  },
                  {
                    "id": "mi2",
                    "text": "Tekil Kalıtım (Single Inheritance)",
                    "isCorrect": false
                  },
                  {
                    "id": "mi3",
                    "text": "Aşırı Yükleme (Overloading)",
                    "isCorrect": false
                  },
                  {
                    "id": "mi4",
                    "text": "İnterface (Arayüz)",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-inh4",
                "type": "true_false",
                "prompt": "Değişkenin başına çift alt çizgi konulursa private mi olur?",
                "statement": "Python'da bir değişken adının başına iki alt çizgi (örn: self.__bakiye) konursa değişken private (özel) olur ve dışarıdan doğrudan erişilemez.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Bu mekanizmaya 'Name Mangling' denir ve kapsülleme (encapsulation) sağlar."
              }
            ]
          }
        ]
      },
      {
        "id": "kod-u5",
        "number": 5,
        "title": "Hata Yönetimi (Try/Except) & JSON/API İşlemleri",
        "description": "İstisna yakalama, raise, with open() dosya okuma ve REST API veri çekme",
        "color": "#af72ff",
        "lessons": [
          {
            "id": "kod-u5-l1",
            "unitId": "kod-u5",
            "title": "Try, Except, Finally Hata Yakalama",
            "description": "Hataları zararsızca yönetme, raise ile özel hata fırlatma.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "try: Hata çıkma olasılığı olan riskli kod buraya yazılır.",
              "except: Hata meydana geldiğinde çalışacak kurtarma kodudur.",
              "finally: Hata çıksa da çıkmasa da HER KOŞULDA çalıştırılır.",
              "with open('dosya.txt', 'r') as f: dosyayı işlem bitince otomatik kapatır."
            ],
            "questions": [
              {
                "id": "kod-q-tr1",
                "type": "multiple_choice",
                "prompt": "Python'da bir sayıyı sıfıra bölmeye çalıştığınızda hangi istisna (exception) fırlatılır?",
                "difficulty": "kolay",
                "explanation": "Sıfıra bölme hatası 'ZeroDivisionError' olarak fırlatılır.",
                "options": [
                  {
                    "id": "tr1_a",
                    "text": "ZeroDivisionError",
                    "isCorrect": true
                  },
                  {
                    "id": "tr1_b",
                    "text": "ValueError",
                    "isCorrect": false
                  },
                  {
                    "id": "tr1_c",
                    "text": "TypeError",
                    "isCorrect": false
                  },
                  {
                    "id": "tr1_d",
                    "text": "IndexError",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-tr2",
                "type": "matching",
                "prompt": "Hata yakalama bloklarını görevleriyle eşleştiriniz:",
                "difficulty": "kolay",
                "explanation": "try dener, except yakalar, finally mutlaka çalışır.",
                "pairs": [
                  {
                    "id": "tp1",
                    "left": "try",
                    "right": "Hata riski taşıyan kod bloğu"
                  },
                  {
                    "id": "tp2",
                    "left": "except",
                    "right": "Hata oluştuğunda çalışan blok"
                  },
                  {
                    "id": "tp3",
                    "left": "finally",
                    "right": "Hata olsun veya olmasın her zaman çalışan blok"
                  }
                ]
              },
              {
                "id": "kod-q-tr3",
                "type": "multiple_choice",
                "prompt": "Kod içinde bilinçli olarak özel bir hata fırlatmak (tetiklemek) için hangi anahtar kelime kullanılır?",
                "difficulty": "orta",
                "explanation": "Python'da manuel hata fırlatmak için 'raise ValueError(\\'Geçersiz yaş!\\')' yapısı kullanılır.",
                "options": [
                  {
                    "id": "rs1",
                    "text": "raise",
                    "isCorrect": true
                  },
                  {
                    "id": "rs2",
                    "text": "throw",
                    "isCorrect": false
                  },
                  {
                    "id": "rs3",
                    "text": "catch",
                    "isCorrect": false
                  },
                  {
                    "id": "rs4",
                    "text": "error",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-tr4",
                "type": "true_false",
                "prompt": "with open yapısı dosyayı otomatik kapatır mı?",
                "statement": "'with open(...) as f:' bağlam yöneticisi kullanıldığında, blok tamamlandığında f.close() komutuna gerek kalmadan dosya otomatik olarak kapatılır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Bu sayede bellek ve dosya sızıntıları tamamen engellenir."
              }
            ]
          },
          {
            "id": "kod-u5-l2",
            "unitId": "kod-u5",
            "title": "JSON Formatı & Web API Temelleri",
            "description": "json.loads(), json.dumps(), REST API HTTP istekleri (GET, POST).",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "JSON: Platformlar arası veri değişim standardıdır.",
              "json.loads(string): JSON metnini Python sözlüğüne (dict) çevirir.",
              "json.dumps(dict): Python sözlüğünü JSON metnine (string) çevirir.",
              "HTTP Durum Kodları: 200 (Başarılı), 404 (Bulunamadı), 500 (Sunucu Hatası)."
            ],
            "questions": [
              {
                "id": "kod-q-js1",
                "type": "multiple_choice",
                "prompt": "Bir JSON metnini Python sözlüğüne (dictionary) çevirmek için 'json' modülünün hangi metodu kullanılır?",
                "difficulty": "kolay",
                "explanation": "json.loads() (load string) metodu JSON metnini Python veri yapısına dönüştürür.",
                "options": [
                  {
                    "id": "js1_a",
                    "text": "json.loads()",
                    "isCorrect": true
                  },
                  {
                    "id": "js1_b",
                    "text": "json.dumps()",
                    "isCorrect": false
                  },
                  {
                    "id": "js1_c",
                    "text": "json.parse()",
                    "isCorrect": false
                  },
                  {
                    "id": "js1_d",
                    "text": "json.convert()",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-js2",
                "type": "matching",
                "prompt": "HTTP metodlarını görevleriyle eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "GET okur, POST ekler, PUT günceller, DELETE siler.",
                "pairs": [
                  {
                    "id": "hp1",
                    "left": "GET",
                    "right": "Sunucudan veri okuma ve listeleme"
                  },
                  {
                    "id": "hp2",
                    "left": "POST",
                    "right": "Sunucuya yeni veri gönderme/kaydetme"
                  },
                  {
                    "id": "hp3",
                    "left": "DELETE",
                    "right": "Sunucudaki mevcut veriyi silme"
                  }
                ]
              },
              {
                "id": "kod-q-js3",
                "type": "multiple_choice",
                "prompt": "Bir REST API isteğinin tamamen BAŞARILI olduğunu belirten standart HTTP durum kodu (Status Code) hangisidir?",
                "difficulty": "kolay",
                "explanation": "200 OK, isteğin başarıyla işlendiğini ve yanıtın döndüğünü ifade eder.",
                "options": [
                  {
                    "id": "st1",
                    "text": "200 OK",
                    "isCorrect": true
                  },
                  {
                    "id": "st2",
                    "text": "404 Not Found",
                    "isCorrect": false
                  },
                  {
                    "id": "st3",
                    "text": "500 Internal Server Error",
                    "isCorrect": false
                  },
                  {
                    "id": "st4",
                    "text": "301 Moved Permanently",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kod-q-js4",
                "type": "true_false",
                "prompt": "JSON formatı yalnızca JavaScript ile mi kullanılır?",
                "statement": "JSON ismi JavaScript'ten gelse de tamamen dilden bağımsızdır; Python, Java, C#, Go gibi tüm programlama dillerinde veri iletişimi için kullanılır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! JSON günümüzde web dünyasının evrensel veri taşıma formatıdır."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "kpss",
    "name": "KPSS (GY - GK)",
    "subTitle": "2025 - 2026 Kamu Personeli Seçme Sınavı",
    "icon": "🏛️",
    "badge": "Kariyer & Kamu",
    "color": "#ff9600",
    "accentColor": "#e08300",
    "units": [
      {
        "id": "kpss-u1",
        "number": 1,
        "title": "T.C. İnkılap Tarihi: Milli Mücadele",
        "description": "Kongreler, cepheler, Lozan Barış Antlaşması ve ilkeler",
        "color": "#ff9600",
        "lessons": [
          {
            "id": "kpss-u1-l1",
            "unitId": "kpss-u1",
            "title": "Milli Mücadele Hazırlık Dönemi",
            "description": "Amasya Genelgesi, Erzurum ve Sivas Kongreleri kararları.",
            "xpReward": 20,
            "gemReward": 5,
            "type": "lesson",
            "summaryNotes": [
              "Amasya Genelgesi: Kurtuluş Savaşı'nın gerekçe, amaç ve yöntemi ilk kez belirtildi.",
              "Erzurum Kongresi: Manda ve himaye ilk kez reddedildi (Toplanış bölgesel, kararlar ulusal).",
              "Sivas Kongresi: Tüm cemiyetler 'Anadolu ve Rumeli Müdafaa-i Hukuk' çatısında birleştirildi."
            ],
            "questions": [
              {
                "id": "kpss-q1",
                "type": "multiple_choice",
                "prompt": "'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.' ilkesi ilk kez nerede ilan edilmiştir?",
                "difficulty": "kolay",
                "explanation": "Amasya Genelgesi (22 Haziran 1919), Kurtuluş Savaşı'nın gerekçesini, amacını ve yöntemini belirten ihtilal beyannamesidir.",
                "options": [
                  {
                    "id": "kp1",
                    "text": "Amasya Genelgesi",
                    "isCorrect": true
                  },
                  {
                    "id": "kp2",
                    "text": "Erzurum Kongresi",
                    "isCorrect": false
                  },
                  {
                    "id": "kp3",
                    "text": "Sivas Kongresi",
                    "isCorrect": false
                  },
                  {
                    "id": "kp4",
                    "text": "Havza Genelgesi",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q2",
                "type": "matching",
                "prompt": "Kongre ve genelgeleri öne çıkan özellikleriyle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Havza ilk tepki mitingleri, Erzurum manda ve himayenin ilk reddi, Sivas tüm cemiyetlerin birleştiği yerdir.",
                "pairs": [
                  {
                    "id": "mp1",
                    "left": "Havza Genelgesi",
                    "right": "İşgallere karşı ilk kitlesel miting çağrısı"
                  },
                  {
                    "id": "mp2",
                    "left": "Erzurum Kongresi",
                    "right": "Manda ve himayenin ilk kez reddi"
                  },
                  {
                    "id": "mp3",
                    "left": "Sivas Kongresi",
                    "right": "Tüm milli cemiyetlerin tek çatı altında birleşmesi"
                  }
                ]
              },
              {
                "id": "kpss-q3",
                "type": "true_false",
                "prompt": "Erzurum Kongresi toplanış bakımından bölgesel, aldığı kararlar bakımından ulusaldır.",
                "statement": "Erzurum Kongresi toplanışı bölgesel, kararları ulusal niteliktedir.",
                "correctAnswer": true,
                "explanation": "Doğru! Doğu illerinin savunması için toplanmış ancak Misak-ı Milli sınırlarını çizerek tüm vatanı ilgilendiren kararlar almıştır."
              },
              {
                "id": "kpss-q3b",
                "type": "multiple_choice",
                "prompt": "Mustafa Kemal Paşa'nın 'Siz orada yalnız düşmanı değil, milletin makus talihini de yendiniz.' telgrafını hangi zaferden sonra çekmiştir?",
                "difficulty": "orta",
                "explanation": "İsmet İnönü komutasındaki düzenli ordunun kazandığı II. İnönü Zaferi sonrası çekilmiştir.",
                "options": [
                  {
                    "id": "in1",
                    "text": "II. İnönü Muharebesi",
                    "isCorrect": true
                  },
                  {
                    "id": "in2",
                    "text": "I. İnönü Muharebesi",
                    "isCorrect": false
                  },
                  {
                    "id": "in3",
                    "text": "Sakarya Meydan Muharebesi",
                    "isCorrect": false
                  },
                  {
                    "id": "in4",
                    "text": "Büyük Taarruz",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "kpss-u1-l2",
            "unitId": "kpss-u1",
            "title": "Cepheler & Mudanya - Lozan",
            "description": "Doğu, Güney, Batı cepheleri ve Türkiye'nin tapu senedi Lozan.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Doğu Cephesi: Gümrü Antlaşması ile kapandı (TBMM'yi tanıyan ilk devlet Ermenistan).",
              "Güney Cephesi: 1921 Ankara Antlaşması ile kapandı (Fransa çekildi).",
              "Batı Cephesi: Mudanya Ateşkesi ile silahlı mücadele sona erdi."
            ],
            "questions": [
              {
                "id": "kpss-cp1",
                "type": "multiple_choice",
                "prompt": "Kurtuluş Savaşı'nda Doğu Cephesi hangi antlaşma ile kapanmış ve TBMM uluslararası alanda ilk diplomatik zaferini kazanmıştır?",
                "difficulty": "kolay",
                "explanation": "Kazım Karabekir komutasındaki Doğu Cephesi, 3 Aralık 1920 Gümrü Antlaşması ile başarıyla kapanmıştır.",
                "options": [
                  {
                    "id": "gm1",
                    "text": "Gümrü Antlaşması",
                    "isCorrect": true
                  },
                  {
                    "id": "gm2",
                    "text": "Moskova Antlaşması",
                    "isCorrect": false
                  },
                  {
                    "id": "gm3",
                    "text": "Kars Antlaşması",
                    "isCorrect": false
                  },
                  {
                    "id": "gm4",
                    "text": "Bükreş Antlaşması",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-cp2",
                "type": "matching",
                "prompt": "Milli Mücadele kahramanlarını savaştıkları şehirlerle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Sütçü İmam Maraş, Şahin Bey Antep, Ali Saip Bey Urfa savunmasında semboldür.",
                "pairs": [
                  {
                    "id": "kp1",
                    "left": "Sütçü İmam",
                    "right": "Kahramanmaraş"
                  },
                  {
                    "id": "kp2",
                    "left": "Şahin Bey",
                    "right": "Gaziantep"
                  },
                  {
                    "id": "kp3",
                    "left": "Ali Saip Ursavaş",
                    "right": "Şanlıurfa"
                  }
                ]
              },
              {
                "id": "kpss-cp3",
                "type": "true_false",
                "prompt": "Lozan Barış Antlaşması'nda kapitülasyonlar tamamen kaldırılmış mıdır?",
                "statement": "Lozan Antlaşması ile adli, mali ve ekonomik kapitülasyonlar kayıtsız şartsız kaldırılmıştır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Kapitülasyonların kaldırılması genç Türkiye Cumhuriyeti'nin ekonomik bağımsızlığını sağlamıştır."
              }
            ]
          }
        ]
      },
      {
        "id": "kpss-u2",
        "number": 2,
        "title": "2025 - 2026 Güncel Bilgiler & Genel Kültür",
        "description": "Türkiye'nin uzay misyonu, uluslararası kuruluşlar ve kültür mirası",
        "color": "#ff4b4b",
        "lessons": [
          {
            "id": "kpss-u2-l1",
            "unitId": "kpss-u2",
            "title": "Uzay, Bilim & UNESCO Kültür Mirası",
            "description": "Sınavda çıkması en muhtemel güncel olaylar.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Alper Gezeravcı: Ax-3 misyonu ile ilk Türk astronot (13 deney gerçekleştirdi).",
              "Gordion Antik Kenti (Ankara): UNESCO Dünya Mirası 20. varlığımız.",
              "Anadolu Ahşap Direkli Camileri: UNESCO Dünya Mirası 21. varlığımız."
            ],
            "questions": [
              {
                "id": "kpss-g1",
                "type": "multiple_choice",
                "prompt": "Türkiye'nin ilk astronotu olarak Uluslararası Uzay İstasyonu'na (ISS) giderek Ax-3 misyonunda 13 farklı bilimsel deney gerçekleştiren isim kimdir?",
                "difficulty": "kolay",
                "explanation": "Alper Gezeravcı, Ocak 2024'te Ax-3 misyonu ile uzaya çıkan ilk Türk astronotumuz olmuştur.",
                "options": [
                  {
                    "id": "g1",
                    "text": "Alper Gezeravcı",
                    "isCorrect": true
                  },
                  {
                    "id": "g2",
                    "text": "Tuva Cihangir Atasever",
                    "isCorrect": false
                  },
                  {
                    "id": "g3",
                    "text": "Aziz Sancar",
                    "isCorrect": false
                  },
                  {
                    "id": "g4",
                    "text": "Selçuk Bayraktar",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-g2",
                "type": "matching",
                "prompt": "UNESCO Somut Olmayan Kültürel Miras unsurlarımızı eşleştirin:",
                "difficulty": "orta",
                "explanation": "İftar geleneği ve tezhip sanatı son dönemde UNESCO listesine dahil edilmiştir.",
                "pairs": [
                  {
                    "id": "u1",
                    "left": "Geleneksel Ahşap Çatı ve Direkli Camiler",
                    "right": "UNESCO Dünya Mirası Asıl Listesi (2023)"
                  },
                  {
                    "id": "u2",
                    "left": "İftar ve Sosyokültürel Gelenekleri",
                    "right": "UNESCO Somut Olmayan Kültür Mirası"
                  },
                  {
                    "id": "u3",
                    "left": "Gordion Antik Kenti (Ankara)",
                    "right": "UNESCO Dünya Miras Listesi (20. Mirasımız)"
                  }
                ]
              },
              {
                "id": "kpss-g3",
                "type": "multiple_choice",
                "prompt": "2024 Avrupa Futbol Şampiyonası (EURO 2024) hangi ülkede düzenlenmiştir?",
                "difficulty": "kolay",
                "explanation": "EURO 2024, Almanya'nın ev sahipliğinde gerçekleşmiş ve A Milli Takımımız çeyrek finale yükselmiştir.",
                "options": [
                  {
                    "id": "eu1",
                    "text": "Almanya",
                    "isCorrect": true
                  },
                  {
                    "id": "eu2",
                    "text": "Fransa",
                    "isCorrect": false
                  },
                  {
                    "id": "eu3",
                    "text": "İtalya",
                    "isCorrect": false
                  },
                  {
                    "id": "eu4",
                    "text": "İngiltere",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-g4",
                "type": "multiple_choice",
                "prompt": "UNESCO Dünya Mirası Komitesi kararıyla Türkiye nin UNESCO Dünya Miras Listesi ndeki 21. mirası olarak tescil edilen varlığımız hangisidir?",
                "explanation": "Gordion 20. mirasımızdır; hemen ardından tescil edilen Anadolu nun Ahşap Direkli Camileri Türkiye nin 21. UNESCO Dünya Mirasıdır.",
                "hint": "Gordion 20. sıradaydı; 21. miras ahşap mimarisiyle öne çıkar.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Anadolu nun Orta Çağ Ahşap Direkli ve Kirişli Camileri",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Gordion Antik Kenti (20. Miras)",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Arslantepe Höyüğü",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Göbeklitepe",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "kpss-u3",
        "number": 3,
        "title": "KPSS Vatandaşlık & 1982 Anayasası",
        "description": "Devlet organları, TBMM yapısı, Cumhurbaşkanlığı ve yargı denetimi",
        "color": "#ff9600",
        "lessons": [
          {
            "id": "kpss-u3-l1",
            "unitId": "kpss-u3",
            "title": "Yasama & TBMM Seçimleri",
            "description": "Milletvekili sayısı, seçim dönemleri ve kanun yapma süreci.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "TBMM üye sayısı: 600 milletvekilidir.",
              "Milletvekili seçilme yaşı: 18 yaştır.",
              "Genel seçimler 5 yılda bir Cumhurbaşkanı seçimi ile aynı gün yapılır.",
              "Anayasa Mahkemesi 15 üyeden oluşur."
            ],
            "questions": [
              {
                "id": "kpss-v1",
                "type": "multiple_choice",
                "prompt": "1982 Anayasası'na göre Türkiye Büyük Millet Meclisi (TBMM) kaç milletvekilinden oluşur?",
                "difficulty": "kolay",
                "explanation": "2017 anayasa değişikliği ile TBMM milletvekili sayısı 550'den 600'e çıkarılmıştır.",
                "options": [
                  {
                    "id": "v1",
                    "text": "600 Milletvekili",
                    "isCorrect": true
                  },
                  {
                    "id": "v2",
                    "text": "550 Milletvekili",
                    "isCorrect": false
                  },
                  {
                    "id": "v3",
                    "text": "450 Milletvekili",
                    "isCorrect": false
                  },
                  {
                    "id": "v4",
                    "text": "650 Milletvekili",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-v2",
                "type": "multiple_choice",
                "prompt": "1982 Anayasası'na göre Anayasa Mahkemesi (AYM) toplam kaç üyeden oluşur?",
                "difficulty": "orta",
                "explanation": "Anayasa Mahkemesi 15 üyeden oluşur (12 üye Cumhurbaşkanı, 3 üye TBMM tarafından seçilir).",
                "options": [
                  {
                    "id": "ay1",
                    "text": "15 üye",
                    "isCorrect": true
                  },
                  {
                    "id": "ay2",
                    "text": "12 üye",
                    "isCorrect": false
                  },
                  {
                    "id": "ay3",
                    "text": "17 üye",
                    "isCorrect": false
                  },
                  {
                    "id": "ay4",
                    "text": "11 üye",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-v3",
                "type": "true_false",
                "prompt": "Cumhurbaşkanı kararnamesi ile temel haklar sınırlandırılabilir mi?",
                "statement": "Anayasada münhasıran kanunla düzenlenmesi öngörülen konularda Cumhurbaşkanlığı kararnamesi çıkarılamaz.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Anayasa madde 104 gereği kanunla açıkça düzenlenen konularda CB kararnamesi çıkarılamaz."
              },
              {
                "id": "kpss-v4",
                "type": "multiple_choice",
                "prompt": "1982 Anayasası'na göre milletvekili seçilme yaşı kaçtır?",
                "difficulty": "kolay",
                "explanation": "2017 değişikliği ile milletvekili seçilme yaşı 25'ten 18'e indirilmiştir.",
                "options": [
                  {
                    "id": "ys1",
                    "text": "18 yaş",
                    "isCorrect": true
                  },
                  {
                    "id": "ys2",
                    "text": "21 yaş",
                    "isCorrect": false
                  },
                  {
                    "id": "ys3",
                    "text": "25 yaş",
                    "isCorrect": false
                  },
                  {
                    "id": "ys4",
                    "text": "30 yaş",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "kpss-u4",
        "number": 4,
        "title": "KPSS Coğrafya: Türkiye'nin Yerşekilleri & İklimi",
        "description": "Dağlar, platolar, karstik ve volkanik şekiller, akarsular ve iklim özellikleri",
        "color": "#ff9600",
        "lessons": [
          {
            "id": "kpss-u4-l1",
            "unitId": "kpss-u4",
            "title": "Türkiye'nin Dağları, Platoları & Gölleri",
            "description": "Kıvrım, kırık (horst-graben) ve volkanik dağlar ile karstik/lav platoları.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "Kırık Dağlar (Horst-Graben): Kaz, Madra, Yunt, Bozdağlar, Aydın, Menteşe Dağları.",
              "Volkanik Dağlar: Ağrı, Tendürek, Süphan, Nemrut (Doğu); Erciyes, Hasan, Karacadağ (İç).",
              "Karstik Platolar: Teke ve Taşeli Platoları (Kalker/kireçtaşı arazisi).",
              "Lav Platosu: Erzurum - Kars - Ardahan Platosu (Yaz yağışları ve çernezyom toprak)."
            ],
            "questions": [
              {
                "id": "kpss-q-cg1",
                "type": "multiple_choice",
                "prompt": "Aşağıdaki dağlardan hangisi oluşum türü bakımından kırılma (horst-graben) sonucu oluşmuş dağlar arasında YER ALMAZ?",
                "difficulty": "orta",
                "hint": "Ege kıyılarındaki dağlar kırıktır; İç ve Doğu Anadolu'daki bazı dağlar volkaniktir.",
                "explanation": "Erciyes Dağı volkanik patlamalar sonucu oluşmuş volkanik bir dağdır; Kaz, Madra ve Yunt ise kırık (horst) dağlarıdır.",
                "options": [
                  {
                    "id": "cg1_a",
                    "text": "Erciyes Dağı",
                    "isCorrect": true
                  },
                  {
                    "id": "cg1_b",
                    "text": "Kaz Dağları",
                    "isCorrect": false
                  },
                  {
                    "id": "cg1_c",
                    "text": "Madra Dağı",
                    "isCorrect": false
                  },
                  {
                    "id": "cg1_d",
                    "text": "Yunt Dağı",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-cg2",
                "type": "matching",
                "prompt": "Plato türlerini Türkiye'deki en belirgin örnekleriyle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Teke/Taşeli karstik kireçtaşıdır, Erzurum-Kars bazalt lavıdır, Çatalca-Kocaeli aşınım platosudur.",
                "pairs": [
                  {
                    "id": "cp1",
                    "left": "Karstik Plato",
                    "right": "Teke ve Taşeli Platoları"
                  },
                  {
                    "id": "cp2",
                    "left": "Lav (Volkanik) Platosu",
                    "right": "Erzurum - Kars Platosu"
                  },
                  {
                    "id": "cp3",
                    "left": "Aşınım (Peneple) Platosu",
                    "right": "Çatalca - Kocaeli Platosu"
                  }
                ]
              },
              {
                "id": "kpss-q-cg3",
                "type": "multiple_choice",
                "prompt": "Türkiye'nin yüzölçümü bakımından en büyük TATLI SU gölü hangisidir?",
                "difficulty": "kolay",
                "hint": "Van Gölü en büyük göldür fakat sodalıdır; tatlı su gölü değildir.",
                "explanation": "Beyşehir Gölü Türkiye'nin en büyük tatlı su gölüdür ve su ürünleri ile tarımsal sulamada kullanılır.",
                "options": [
                  {
                    "id": "gl1",
                    "text": "Beyşehir Gölü",
                    "isCorrect": true
                  },
                  {
                    "id": "gl2",
                    "text": "Van Gölü",
                    "isCorrect": false
                  },
                  {
                    "id": "gl3",
                    "text": "Tuz Gölü",
                    "isCorrect": false
                  },
                  {
                    "id": "gl4",
                    "text": "Eğirdir Gölü",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-cg4",
                "type": "true_false",
                "prompt": "Türkiye'de dağların doğu-batı uzanması iklimi etkiler mi?",
                "statement": "Türkiye'de dağların doğu-batı yönünde uzanması, Akdeniz ve Karadeniz kıyılarında denizel etkinin iç kesimlere sokulmasını engeller.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Bu nedenle iç kesimlerde karasal iklim egemen olurken kıyılarda ılıman iklim sıkışıp kalır."
              }
            ]
          },
          {
            "id": "kpss-u4-l2",
            "unitId": "kpss-u4",
            "title": "Türkiye'nin İklimi, Rüzgarları & Bitki Örtüsü",
            "description": "KAYIP SAKAL yerel rüzgarları, mikroklima alanları ve toprak çeşitleri.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "KAYIP SAKAL: Karayel (KB), Yıldız (K), Poyraz (KD) ➔ Soğuk;",
              "Samyeli/Keşişleme (GD), Kıble (G), Lodos (GB) ➔ Sıcak yerel rüzgarlar.",
              "Föhn Rüzgarı: Dağ yamacından inerken her 100 metrede sıcaklığı 1°C artırır (Rize'de turunçgil, Malatya'da kayısı).",
              "Çernezyom (Kara Toprak): Dünyanın en verimli yerli toprağıdır (Erzurum-Kars)."
            ],
            "questions": [
              {
                "id": "kpss-q-ik1",
                "type": "multiple_choice",
                "prompt": "Türkiye'de kış mevsiminde güneybatı yönünden esen, sıcak ve nemli karakterde olup soba zehirlenmelerine neden olabilen rüzgar hangisidir?",
                "difficulty": "kolay",
                "explanation": "Lodos güneybatıdan eser, kışın kar erimelerine ve baca gazı geri tepmesine neden olabilir.",
                "options": [
                  {
                    "id": "ik1_a",
                    "text": "Lodos",
                    "isCorrect": true
                  },
                  {
                    "id": "ik1_b",
                    "text": "Poyraz",
                    "isCorrect": false
                  },
                  {
                    "id": "ik1_c",
                    "text": "Karayel",
                    "isCorrect": false
                  },
                  {
                    "id": "ik1_d",
                    "text": "Samyeli",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-ik2",
                "type": "matching",
                "prompt": "Toprak türlerini görüldükleri temel bölgelerle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Terra Rossa Akdeniz kalkerinde, Kahverengi Orman Karadeniz'de, Çernezyom Erzurum-Kars'tadır.",
                "pairs": [
                  {
                    "id": "tp1",
                    "left": "Terra Rossa (Kırmızı Akdeniz Toprağı)",
                    "right": "Akdeniz Bölgesi (Kalker üzeri)"
                  },
                  {
                    "id": "tp2",
                    "left": "Çernezyom (Kara Toprak)",
                    "right": "Erzurum - Kars Platosu"
                  },
                  {
                    "id": "tp3",
                    "left": "Kahverengi Orman Toprağı",
                    "right": "Karadeniz Dağları"
                  }
                ]
              },
              {
                "id": "kpss-q-ik3",
                "type": "multiple_choice",
                "prompt": "Akdeniz iklim bölgesinde maki bitki örtüsünün tahrip edildiği alanlarda oluşan kısa boylu dikenli çalı topluluğuna ne ad verilir?",
                "difficulty": "orta",
                "explanation": "Maki tahribiyle Garig (Frigana), Karadeniz orman tahribiyle Psödomaki, İç Anadolu bozkır tahribiyle Antropojen Bozkır oluşur.",
                "options": [
                  {
                    "id": "gr1",
                    "text": "Garig",
                    "isCorrect": true
                  },
                  {
                    "id": "gr2",
                    "text": "Psödomaki",
                    "isCorrect": false
                  },
                  {
                    "id": "gr3",
                    "text": "Bozkır",
                    "isCorrect": false
                  },
                  {
                    "id": "gr4",
                    "text": "Tundra",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-ik4",
                "type": "true_false",
                "prompt": "Rize ve çevresinde turunçgil yetişmesi mikroklima örneği midir?",
                "statement": "Rize'de dağlardan inen Föhn rüzgarlarının kışın havayı ısıtması sayesinde turunçgil ve çay yetiştirilebilmesi bir mikroklima örneğidir.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Doğu Karadeniz Dağları'nın oluşturduğu Föhn etkisi kış aylarında ılıman bir mikroklima alanı meydana getirir."
              }
            ]
          }
        ]
      },
      {
        "id": "kpss-u5",
        "number": 5,
        "title": "KPSS Türkçe: Sözel Mantık & Yazım Kuralları",
        "description": "Sıralama ve grup tabloları kurma taktikleri, 2026 TDK güncel yazım kılavuzu",
        "color": "#ff9600",
        "lessons": [
          {
            "id": "kpss-u5-l1",
            "unitId": "kpss-u5",
            "title": "Sözel Mantık Tablo Kurma Stratejisi",
            "description": "Sabit parametreleri belirleme, bloklama ve olasılık dallandırma.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "Sözel mantık altın kuralı: Sabit olanları (günler, katlar, sıralar) tablo başlığı yap!",
              "Değişken kişi veya nesneleri tablo içine olasılıklarla yerleştir.",
              "'A, B'den hemen öncedir' ➔ [A][B] şeklinde bitişik bloktur.",
              "'Kesinlikle doğrudur / yanlıştır' sorularında ihtimalli durumlar değil, tek net sonuç aranır."
            ],
            "questions": [
              {
                "id": "kpss-q-sm1",
                "type": "multiple_choice",
                "prompt": "Sözel mantık sorularını çözerken tablo kurarken İLK adım olarak hangisi yapılmalıdır?",
                "difficulty": "kolay",
                "explanation": "Soru metnindeki en değişmez sabit parametre (örneğin haftanın günleri: Pazartesi-Cuma) belirlenip tablonun sütunları oluşturulur.",
                "options": [
                  {
                    "id": "sm1_a",
                    "text": "Sabit parametreyi (günler, sıra, katlar) tablonun iskeleti yapmak",
                    "isCorrect": true
                  },
                  {
                    "id": "sm1_b",
                    "text": "Kişileri rastgele kutulara yazmak",
                    "isCorrect": false
                  },
                  {
                    "id": "sm1_c",
                    "text": "Doğrudan şıklardan eleme yapmaya çalışmak",
                    "isCorrect": false
                  },
                  {
                    "id": "sm1_d",
                    "text": "Tüm olasılıkları tek tek ezberlemek",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-sm2",
                "type": "matching",
                "prompt": "Sözel mantık ifadelerini sembolik blok gösterimleriyle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Hemen önceki blok bitişik [K][L], aralarında 1 kişi olan [K][ _ ][L] olarak modellenir.",
                "pairs": [
                  {
                    "id": "smp1",
                    "left": "K, L'den hemen önceki sıradadır",
                    "right": "[K][L] bitişik blok"
                  },
                  {
                    "id": "smp2",
                    "left": "K ve L arasında yalnızca 1 kişi vardır",
                    "right": "[K] [ _ ] [L] aralı blok"
                  },
                  {
                    "id": "smp3",
                    "left": "K ve L aynı gün nöbet tutmaktadır",
                    "right": "Aynı sütun içine yazma"
                  }
                ]
              },
              {
                "id": "kpss-q-sm3",
                "type": "multiple_choice",
                "prompt": "Bir sözel mantık sorusunda 'X'in Cuma günü geldiği kesinlikle biliniyorsa' bu durum tabloya nasıl yansıtılır?",
                "difficulty": "kolay",
                "explanation": "Cuma sütununa X doğrudan kalıcı olarak yazılır ve diğer olasılıklarda X'in yeri değiştirilmez.",
                "options": [
                  {
                    "id": "fx1",
                    "text": "Cuma hücresine X doğrudan sabitlenir",
                    "isCorrect": true
                  },
                  {
                    "id": "fx2",
                    "text": "X tüm günlere soru işaretiyle konur",
                    "isCorrect": false
                  },
                  {
                    "id": "fx3",
                    "text": "X tablodan tamamen çıkarılır",
                    "isCorrect": false
                  },
                  {
                    "id": "fx4",
                    "text": "Soru iptal edilir",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-sm4",
                "type": "true_false",
                "prompt": "Sözel mantıkta 'kesinlikle yanlıştır' sorusu ihtimalli durumu mu hedefler?",
                "statement": "Sözel mantıkta 'kesinlikle yanlıştır' sorularının doğru yanıtı hiçbir ihtimalde gerçekleşmesi mümkün olmayan, kurallarla çelişen şıktır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Olabilir durumlar elenir; kurallara aykırı imkansız seçenek aranır."
              }
            ]
          },
          {
            "id": "kpss-u5-l2",
            "unitId": "kpss-u5",
            "title": "2026 TDK Güncel Yazım ve Noktalama Kuralları",
            "description": "Büyük harflerin kullanımı, birleşik sözcükler, de/da ve ki bağlaçları.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Kurum, kuruluş, kurul ve iş yeri adlarına gelen ekler KESME İŞARETİYLE AYRILMAZ!",
              "Doğru yazımlar: 'Unvan' (Ünvan yanlış), 'Dinozor' (Dinazor yanlış), 'Karnabahar' (Karnıbahar yanlış).",
              "Bağlaç olan 'de/da' ayrı yazılır ve asla 'te/ta' biçiminde sertleşmez.",
              "SOMBAHÇEMİ kalıbındaki 'ki'ler kalıplaşmış bitişik yazılır: Sanki, Oysaki, Mademki, Belki, Halbuki, Çünkü, Meğerki, İllaki."
            ],
            "questions": [
              {
                "id": "kpss-q-yz1",
                "type": "multiple_choice",
                "prompt": "Aşağıdaki kelimelerden hangisinin yazımı TDK'nin güncel kılavuzuna göre DOĞRUDUR?",
                "difficulty": "orta",
                "hint": "Unvan kelimesi 'u' harfi ile başlar.",
                "explanation": "TDK kılavuzuna göre 'Unvan' doğrudur ('Ünvan' yanlıştır).",
                "options": [
                  {
                    "id": "yz1_a",
                    "text": "Unvan",
                    "isCorrect": true
                  },
                  {
                    "id": "yz1_b",
                    "text": "Ünvan",
                    "isCorrect": false
                  },
                  {
                    "id": "yz1_c",
                    "text": "Dinazor",
                    "isCorrect": false
                  },
                  {
                    "id": "yz1_d",
                    "text": "Karnıbahar",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-yz2",
                "type": "matching",
                "prompt": "Kural ve doğru örnek eşleştirmesini yapınız:",
                "difficulty": "orta",
                "explanation": "Kurum ekleri ayrılmaz, SOMBAHÇEMİ bitişik ki, durum eki de/da bitişiktir.",
                "pairs": [
                  {
                    "id": "yp1",
                    "left": "Kurum adlarına gelen ekler",
                    "right": "Türk Dil Kurumuna (Ayrılmaz)"
                  },
                  {
                    "id": "yp2",
                    "left": "Kalıplaşmış 'ki' bağlacı",
                    "right": "Mademki / Oysaki (Bitişik)"
                  },
                  {
                    "id": "yp3",
                    "left": "Bulunma durum eki (-de/-da)",
                    "right": "Evde / Okulda (Bitişik)"
                  }
                ]
              },
              {
                "id": "kpss-q-yz3",
                "type": "multiple_choice",
                "prompt": "Aşağıdaki cümlelerin hangisinde kesme işaretinin ( ' ) kullanımıyla ilgili bir YANLIŞLIK yapılmıştır?",
                "difficulty": "orta",
                "explanation": "Kurum, kuruluş ve kurul adlarına gelen ekler kesmeyle ayrılmaz. 'Türkiye Büyük Millet Meclisi'ne' yazımı yanlıştır; 'Türkiye Büyük Millet Meclisine' olmalıdır.",
                "options": [
                  {
                    "id": "ks1",
                    "text": "Türkiye Büyük Millet Meclisi'ne yeni bir yasa teklifi sunuldu.",
                    "isCorrect": true
                  },
                  {
                    "id": "ks2",
                    "text": "Ahmet Bey'in konuşması herkesi duygulandırdı.",
                    "isCorrect": false
                  },
                  {
                    "id": "ks3",
                    "text": "1923'te Cumhuriyet ilan edildi.",
                    "isCorrect": false
                  },
                  {
                    "id": "ks4",
                    "text": "TDK'nin yeni sözlüğü yayımlandı.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-yz4",
                "type": "true_false",
                "prompt": "Özel ada dahil olmayan gazete, dergi ve tablo sözcükleri büyük harfle başlar mı?",
                "statement": "Özel ada dahil olmayan gazete, dergi ve tablo sözleri küçük harfle başlar (Milliyet gazetesi, Varlık dergisi, Kaplumbağa Terbiyecisi tablosu).",
                "correctAnswer": true,
                "explanation": "Doğrudur! Yalnızca 'Resmî Gazete' gazetenin kendi adına dahil olduğu için büyük harfle yazılır."
              }
            ]
          }
        ]
      },
      {
        "id": "kpss-u6",
        "number": 6,
        "title": "KPSS Vatandaşlık & 2026 Güncel Bilgiler",
        "description": "1982 Anayasası organları, TBMM, Cumhurbaşkanlığı, AİHM ve uluslararası örgütler",
        "color": "#ff9600",
        "lessons": [
          {
            "id": "kpss-u6-l1",
            "unitId": "kpss-u6",
            "title": "1982 Anayasası: Yasama & Yürütme",
            "description": "600 milletvekili, kanun yapım süreci, Cumhurbaşkanlığı Kararnameleri.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "TBMM 600 milletvekilinden oluşur. Milletvekili seçilme yaşı 18'dir.",
              "Milletvekili seçimleri 5 yılda bir Cumhurbaşkanı seçimiyle birlikte aynı gün yapılır.",
              "Anayasa Mahkemesi 15 üyeden oluşur; üyelerin görev süresi 12 yıldır.",
              "Cumhurbaşkanı en fazla 2 kez (5'er yıllık) seçilebilir (Meclisin erken seçim kararı hariç)."
            ],
            "questions": [
              {
                "id": "kpss-q-vt1",
                "type": "multiple_choice",
                "prompt": "1982 Anayasası'na göre Türkiye Büyük Millet Meclisi (TBMM) kaç milletvekilinden oluşur?",
                "difficulty": "kolay",
                "explanation": "2017 anayasa değişikliği ile TBMM milletvekili sayısı 550'den 600'e çıkarılmıştır.",
                "options": [
                  {
                    "id": "vt1_a",
                    "text": "600 milletvekili",
                    "isCorrect": true
                  },
                  {
                    "id": "vt1_b",
                    "text": "550 milletvekili",
                    "isCorrect": false
                  },
                  {
                    "id": "vt1_c",
                    "text": "450 milletvekili",
                    "isCorrect": false
                  },
                  {
                    "id": "vt1_d",
                    "text": "650 milletvekili",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-vt2",
                "type": "matching",
                "prompt": "Anayasal kurumları üye sayılarıyla doğru eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "TBMM 600 üye, AYM 15 üye, HSK 13 üyeden oluşur.",
                "pairs": [
                  {
                    "id": "vp1",
                    "left": "TBMM",
                    "right": "600 milletvekili"
                  },
                  {
                    "id": "vp2",
                    "left": "Anayasa Mahkemesi (AYM)",
                    "right": "15 üye (12 yıl görev)"
                  },
                  {
                    "id": "vp3",
                    "left": "Hakimler ve Savcılar Kurulu (HSK)",
                    "right": "13 üye"
                  }
                ]
              },
              {
                "id": "kpss-q-vt3",
                "type": "multiple_choice",
                "prompt": "Anayasa Mahkemesi üyeleri kaç yıl süreyle görev yapmak üzere seçilirler?",
                "difficulty": "orta",
                "explanation": "AYM üyeleri 12 yıl için seçilirler ve bir kimse iki defa Anayasa Mahkemesi üyesi seçilemez.",
                "options": [
                  {
                    "id": "aym1",
                    "text": "12 yıl",
                    "isCorrect": true
                  },
                  {
                    "id": "aym2",
                    "text": "5 yıl",
                    "isCorrect": false
                  },
                  {
                    "id": "aym3",
                    "text": "7 yıl",
                    "isCorrect": false
                  },
                  {
                    "id": "aym4",
                    "text": "Ömür boyu",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-vt4",
                "type": "true_false",
                "prompt": "Milletvekili seçilme yaşı 18 midir?",
                "statement": "2017 Anayasa değişikliği sonrasında Türkiye'de milletvekili seçilme yaşı 18 olarak uygulanmaktadır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! 18 yaşını dolduran her Türk vatandaşı gerekli şartları taşıması halinde milletvekili seçilebilir."
              }
            ]
          },
          {
            "id": "kpss-u6-l2",
            "unitId": "kpss-u6",
            "title": "Uluslararası Örgütler & 2026 Güncel Olaylar",
            "description": "BM, NATO, Türk Devletleri Teşkilatı, UNESCO mirasları ve Türkiye'nin ilk astronotu.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "BM Güvenlik Konseyi daimi veto hakkına sahip 5 ülke (FİRÇA): Fransa, İngiltere, Rusya, Çin, ABD.",
              "NATO Genel Merkezi: Brüksel (Belçika). Türkiye 1952 yılında katılmıştır.",
              "Türkiye'nin ilk astronotu: Alper Gezeravcı (Ocak 2024, Ax-3 Misyonu). İkinci astronot: Tuva Cihangir Atasever.",
              "UNESCO 20. Dünya Mirası: Ankara Gordion Antik Kenti (2023)."
            ],
            "questions": [
              {
                "id": "kpss-q-gn1",
                "type": "multiple_choice",
                "prompt": "Birleşmiş Milletler (BM) Güvenlik Konseyi'nde mutlak VETO hakkına sahip 5 daimi ülke arasında hangisi YER ALMAZ?",
                "difficulty": "kolay",
                "hint": "FİRÇA kısaltması: Fransa, İngiltere, Rusya, Çin, ABD.",
                "explanation": "Almanya BM Güvenlik Konseyi daimi veto üyesi değildir. Daimi üyeler: ABD, Rusya, Çin, İngiltere ve Fransa'dır.",
                "options": [
                  {
                    "id": "gn1_a",
                    "text": "Almanya",
                    "isCorrect": true
                  },
                  {
                    "id": "gn1_b",
                    "text": "Fransa",
                    "isCorrect": false
                  },
                  {
                    "id": "gn1_c",
                    "text": "Çin",
                    "isCorrect": false
                  },
                  {
                    "id": "gn1_d",
                    "text": "Rusya",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "kpss-q-gn2",
                "type": "matching",
                "prompt": "Uluslararası örgütleri genel merkez şehirleriyle eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "NATO Brüksel'de, UNESCO Paris'te, BM New York'ta, WHO Cenevre'dedir.",
                "pairs": [
                  {
                    "id": "org1",
                    "left": "NATO",
                    "right": "Brüksel (Belçika)"
                  },
                  {
                    "id": "org2",
                    "left": "UNESCO",
                    "right": "Paris (Fransa)"
                  },
                  {
                    "id": "org3",
                    "left": "Birleşmiş Milletler (BM)",
                    "right": "New York (ABD)"
                  }
                ]
              },
              {
                "id": "kpss-q-gn3",
                "type": "multiple_choice",
                "prompt": "Temmuz 2024 te SpaceX Falcon 9 roketiyle uzaya fırlatılan, Türkiye nin İLK yerli ve milli haberleşme uydusu hangisidir?",
                "difficulty": "kolay",
                "explanation": "TÜRKSAT 6A, 9 Temmuz 2024 te uzaya fırlatılan Türkiye nin ilk yerli ve milli haberleşme uydusudur.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "TÜRKSAT 6A",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "TÜRKSAT 5B",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "İMECE",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "GÖKTÜRK-2",
                    "isCorrect": false
                  }
                ],
                "hint": "TÜBİTAK UZAY ve ASELSAN ortaklığıyla üretilen milli uydumuz."
              },
              {
                "id": "kpss-q-gn4",
                "type": "multiple_choice",
                "prompt": "2024 Paris Olimpiyatları nda 10 metre havalı tabancada gümüş madalya kazanarak Türkiye ye atıcılık tarihindeki ilk olimpiyat madalyasını kazandıran sporcumuz kimdir?",
                "explanation": "Yusuf Dikeç ve Şevval İlayda Tarhan, 2024 Paris te 10m havalı tabanca karma takımda gümüş madalya kazanarak Türkiye atıcılık tarihindeki ilk olimpiyat madalyasını getirmiştir.",
                "hint": "Ekipmansız rahat atış stiliyle dünya çapında viral olan milli atıcımız.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Yusuf Dikeç - Şevval İlayda Tarhan",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Mete Gazoz",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Taha Akgül",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Rıza Kayaalp",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "kpss-u7",
        "number": 7,
        "title": "Milli Mücadele & Atatürk İnkılapları",
        "description": "Amasya, Erzurum, Sivas kongreleri, TBMM dönemi ve Cumhuriyet inkılapları.",
        "color": "#10b981",
        "lessons": [
          {
            "id": "kpss-u7-l1",
            "unitId": "kpss-u7",
            "title": "Milli Mücadele Hazırlık & Kongreler",
            "description": "Genelgeler, Temsil Heyeti, Misak-ı Milli kararları ve TBMM nin açılışı.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "Amasya Genelgesi Kurtuluş Savaşı nın amaç, gerekçe ve yöntemini belirten ihtilal beyannamesidir.",
              "Erzurum Kongresi toplanış bakımından bölgesel, aldığı kararlar bakımından ulusaldır.",
              "Sivas Kongresi nde tüm milli cemiyetler tek çatı altında birleştirilmiştir."
            ],
            "questions": [
              {
                "id": "kpss-q40",
                "type": "multiple_choice",
                "prompt": "Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır ilkesi İLK KEZ nerede ilan edilmiştir?",
                "difficulty": "kolay",
                "hint": "Kurtuluş Savaşı nın yöntemini ve milli egemenliği ilk kez vurgulayan belge.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Amasya Genelgesi",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Havza Genelgesi",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Erzurum Kongresi",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Amasya Görüşmeleri",
                    "isCorrect": false
                  }
                ],
                "explanation": "22 Haziran 1919 tarihli Amasya Genelgesi nde Kurtuluş Savaşı nın yöntemi ve milli egemenlik ilkesi ilk kez yer almıştır."
              },
              {
                "id": "kpss-q41",
                "type": "multiple_choice",
                "prompt": "Milli sınırlar içinde vatan bir bütündür, bölünemez kararı İLK KEZ hangi kongrede kabul edilmiştir?",
                "difficulty": "orta",
                "hint": "Doğu Anadolu daki Ermeni tehdidine karşı toplanan ancak ulusal kararlar alan kongre.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Erzurum Kongresi",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Sivas Kongresi",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Balıkesir Kongresi",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Alaşehir Kongresi",
                    "isCorrect": false
                  }
                ],
                "explanation": "Erzurum Kongresi nde ulusal sınırlar (Misak-ı Milli nin temeli) ilk kez belirlenmiştir."
              },
              {
                "id": "kpss-q42",
                "type": "multiple_choice",
                "prompt": "Anadolu daki tüm direniş cemiyetleri hangi kongrede Anadolu ve Rumeli Müdafaa-i Hukuk Cemiyeti adı altında birleştirilmiştir?",
                "difficulty": "kolay",
                "hint": "Milli Mücadele nin tek merkezden yönetilmesini sağlayan ulusal kongre.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Sivas Kongresi",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Erzurum Kongresi",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Amasya Tamimi",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Pozantı Kongresi",
                    "isCorrect": false
                  }
                ],
                "explanation": "4-11 Eylül 1919 da toplanan Sivas Kongresi nde bütün milli cemiyetler tek çatı altında toplanarak birlik sağlanmıştır."
              },
              {
                "id": "kpss-q43",
                "type": "multiple_choice",
                "prompt": "Son Osmanlı Mebusan Meclisi nde Misak-ı Milli kararlarının kabul edilmesini sağlayan grup hangisidir?",
                "difficulty": "zor",
                "hint": "Mustafa Kemal in kurulmasını istediği Müdafaa-i Hukuk yerine kurulan grup.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Felah-ı Vatan Grubu",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Müdafaa-i Hukuk Grubu",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "İstiklal Grubu",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Halk Zümresi",
                    "isCorrect": false
                  }
                ],
                "explanation": "Rauf Orbay liderliğindeki Felah-ı Vatan grubu 28 Ocak 1920 de Misak-ı Milli kararlarının mecliste kabulünü sağlamıştır."
              }
            ]
          },
          {
            "id": "kpss-u7-l2",
            "unitId": "kpss-u7",
            "title": "Atatürk İnkılapları & Çağdaşlaşma",
            "description": "Eğitim, hukuk ve toplumsal alanda yapılan temel inkılaplar ve sözleşmeler.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Tevhid-i Tedrisat Kanunu ile eğitim öğretim birleştirilmiş, medreseler kapatılmıştır.",
              "1926 Türk Medeni Kanunu ile tek eşlilik, miras ve mahkemede eşitlik sağlanmıştır.",
              "Montrö Boğazlar Sözleşmesi ile Boğazlar Komisyonu lağvedilmiş, egemenlik tam sağlanmıştır."
            ],
            "questions": [
              {
                "id": "kpss-q44",
                "type": "multiple_choice",
                "prompt": "3 Mart 1924 tarihinde çıkarılan hangi kanunla Türkiye deki tüm okullar ve medreseler Milli Eğitim Bakanlığı na bağlanmıştır?",
                "difficulty": "kolay",
                "hint": "Eğitimde birlik anlamına gelen kanun.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Tevhid-i Tedrisat Kanunu",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Maarif Teşkilatı Kanunu",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Tekalif-i Milliye Kanunu",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Hıyanet-i Vataniye Kanunu",
                    "isCorrect": false
                  }
                ],
                "explanation": "Tevhid-i Tedrisat (Öğretim Birliği) Kanunu ile eğitim tek merkezde toplanmış, laik ve modern eğitime geçilmiştir."
              },
              {
                "id": "kpss-q45",
                "type": "multiple_choice",
                "prompt": "1926 yılında İsviçre Medeni Kanunu örnek alınarak kabul edilen Türk Medeni Kanunu ile hangisi SAĞLANMAMIŞTIR?",
                "difficulty": "orta",
                "hint": "Siyasi haklar (seçme-seçilme) Medeni Kanun ile değil, 1930 ve 1934 anayasa değişiklikleriyle verilmiştir.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Kadınlara milletvekili seçme ve seçilme hakkı",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Mirasta kadın-erkek eşitliği",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Tek eşle evlilik ve resmi nikah zorunluluğu",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Mahkemelerde kadın şahitliğinin eşit sayılması",
                    "isCorrect": false
                  }
                ],
                "explanation": "Kadınlara milletvekili seçme ve seçilme hakkı 1934 te anayasa değişikliğiyle verilmiştir; 1926 Medeni Kanun da siyasi haklar yer almaz."
              },
              {
                "id": "kpss-q46",
                "type": "multiple_choice",
                "prompt": "Türkiye Cumhuriyeti nin İLK muhalefet partisi aşağıdakilerden hangisidir?",
                "difficulty": "kolay",
                "hint": "Kazım Karabekir, Rauf Orbay, Ali Fuat Cebesoy tarafından kurulan parti.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Terakkiperver Cumhuriyet Fırkası",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Serbest Cumhuriyet Fırkası",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Demokrat Parti",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Milli Kalkınma Partisi",
                    "isCorrect": false
                  }
                ],
                "explanation": "17 Kasım 1924 te kurulan Terakkiperver Cumhuriyet Fırkası Türkiye nin ilk muhalefet partisidir."
              },
              {
                "id": "kpss-q47",
                "type": "multiple_choice",
                "prompt": "Uluslararası Boğazlar Komisyonu nu kaldırarak Boğazların yönetim ve savunmasını tamamen Türkiye ye bırakan antlaşma hangisidir?",
                "difficulty": "orta",
                "hint": "1936 yılında İsviçre de imzalanan tarihi sözleşme.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Montrö Boğazlar Sözleşmesi",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Lozan Barış Antlaşması",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "Sadabat Paktı",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "Balkan Antantı",
                    "isCorrect": false
                  }
                ],
                "explanation": "20 Temmuz 1936 da imzalanan Montrö Boğazlar Sözleşmesi ile Boğazlar Komisyonu kaldırılmış ve asker çıkarma hakkı Türkiye ye verilmiştir."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "lgs",
    "name": "LGS (8. Sınıf)",
    "subTitle": "Yeni Nesil Beceri Temelli Sorular",
    "icon": "📚",
    "badge": "Yeni Nesil",
    "color": "#ff4b4b",
    "accentColor": "#d33131",
    "units": [
      {
        "id": "lgs-u1",
        "number": 1,
        "title": "LGS 2026 Maarif Modeli: Çarpanlar & Katlar (EBOB-EKOK)",
        "description": "EBOB-EKOK problemleri ve yeni nesil soru mantığı",
        "color": "#ff4b4b",
        "lessons": [
          {
            "id": "lgs-u1-l1",
            "unitId": "lgs-u1",
            "title": "EBOB & EKOK Mantığı",
            "description": "Parçadan bütüne (EKOK) ve bütünden parçaya (EBOB) modellemesi.",
            "xpReward": 20,
            "gemReward": 5,
            "type": "lesson",
            "summaryNotes": [
              "Büyük parçaları küçük eşit parçalara bölüyorsan ➔ EBOB",
              "Küçük parçaları birleştirip büyük bir bütün yapıyorsan ➔ EKOK",
              "Aralarında asal iki sayının EBOB'u 1, EKOK'u ise çarpımlarıdır!"
            ],
            "questions": [
              {
                "id": "lgs-q1",
                "type": "multiple_choice",
                "prompt": "Kenar uzunlukları 12 cm ve 18 cm olan dikdörtgen levhalar yan yana dizilerek en küçük boyutlu bir KARE yapılmak isteniyor. Bu karenin bir kenarı kaç cm olmalıdır?",
                "difficulty": "orta",
                "hint": "Küçük parçaları birleştirip büyük bir bütün oluştururken EKOK kullanılır.",
                "explanation": "12 ve 18 sayılarının EKOK'u: EKOK(12, 18) = 36 cm bulunur. Karenin bir kenarı 36 cm olmalıdır.",
                "options": [
                  {
                    "id": "l1",
                    "text": "36 cm",
                    "isCorrect": true
                  },
                  {
                    "id": "l2",
                    "text": "72 cm",
                    "isCorrect": false
                  },
                  {
                    "id": "l3",
                    "text": "24 cm",
                    "isCorrect": false
                  },
                  {
                    "id": "l4",
                    "text": "6 cm",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q2",
                "type": "matching",
                "prompt": "Problem türlerini çözüm yöntemleriyle eşleştirin:",
                "difficulty": "kolay",
                "explanation": "Büyük çuvalları poşetlere bölmek EBOB, nöbet günlerinin çakışması EKOK gerektirir.",
                "pairs": [
                  {
                    "id": "lp1",
                    "left": "Büyük çuvallardaki pirinçleri eşit poşetlere bölme",
                    "right": "EBOB (Bütünden parçaya)"
                  },
                  {
                    "id": "lp2",
                    "left": "Farklı aralıklarla çalan iki zilin tekrar birlikte çalması",
                    "right": "EKOK (Parçadan bütüne)"
                  },
                  {
                    "id": "lp3",
                    "left": "Tarlanın etrafına eşit aralıklarla fidan dikme",
                    "right": "EBOB (Bölme / Parçalama)"
                  }
                ]
              },
              {
                "id": "lgs-q3",
                "type": "multiple_choice",
                "prompt": "48 kg pirinç ve 60 kg bulgur birbirine karıştırılmadan ve hiç artmayacak şekilde eşit hacimli poşetlere konulacaktır. Bir poşet en fazla kaç kg olabilir?",
                "difficulty": "kolay",
                "explanation": "En fazla poşet ağırlığı için EBOB(48, 60) alınır. EBOB(48, 60) = 12 kg.",
                "options": [
                  {
                    "id": "eb1",
                    "text": "12 kg",
                    "isCorrect": true
                  },
                  {
                    "id": "eb2",
                    "text": "6 kg",
                    "isCorrect": false
                  },
                  {
                    "id": "eb3",
                    "text": "24 kg",
                    "isCorrect": false
                  },
                  {
                    "id": "eb4",
                    "text": "15 kg",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q4",
                "type": "true_false",
                "prompt": "1 sayısı tüm pozitif tam sayılarla aralarında asal mıdır?",
                "statement": "1 sayısı kendisi dışındaki tüm pozitif tam sayılarla aralarında asaldır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Ortak bölenleri yalnızca 1 olduğu için 1 her sayıyla aralarında asaldır."
              }
            ]
          },
          {
            "id": "lgs-u1-l2",
            "unitId": "lgs-u1",
            "title": "Üslü İfadeler & Bilimsel Gösterim",
            "description": "Üs kuralları, negatif kuvvet ve 1 ≤ |a| < 10 bilimsel gösterim kuralı.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Tabanlar aynıysa çarparken üsler toplanır: a^x × a^y = a^(x+y)",
              "Üssün üssü çarpılır: (a^x)^y = a^(x×y)",
              "Bilimsel gösterim: 1 ≤ |a| < 10 olmak üzere a × 10^n şeklinde yazılır."
            ],
            "questions": [
              {
                "id": "lgs-us1",
                "type": "multiple_choice",
                "prompt": "2¹⁰ sayısının yarısı kaçtır?",
                "difficulty": "orta",
                "hint": "Bir sayıyı ikiye bölmek, tabanı 2 olan üslü ifadeyi 2¹'e bölmektir.",
                "explanation": "2¹⁰ / 2¹ = 2^(10 - 1) = 2⁹ bulunur!",
                "options": [
                  {
                    "id": "us1",
                    "text": "2⁹",
                    "isCorrect": true
                  },
                  {
                    "id": "us2",
                    "text": "2⁵",
                    "isCorrect": false
                  },
                  {
                    "id": "us3",
                    "text": "1¹⁰",
                    "isCorrect": false
                  },
                  {
                    "id": "us4",
                    "text": "2⁸",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-us2",
                "type": "multiple_choice",
                "prompt": "0,000045 sayısının bilimsel gösterimi aşağıdakilerden hangisidir?",
                "difficulty": "orta",
                "explanation": "Bilimsel gösterimde katsayı 1 ile 10 arasında olmalıdır. Virgül 5 basamak sağa kaydırılır: 4,5 × 10⁻⁵.",
                "options": [
                  {
                    "id": "bg1",
                    "text": "4,5 × 10⁻⁵",
                    "isCorrect": true
                  },
                  {
                    "id": "bg2",
                    "text": "45 × 10⁻⁶",
                    "isCorrect": false
                  },
                  {
                    "id": "bg3",
                    "text": "0,45 × 10⁻⁴",
                    "isCorrect": false
                  },
                  {
                    "id": "bg4",
                    "text": "4,5 × 10⁵",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-us3",
                "type": "true_false",
                "prompt": "Herhangi bir sayının sıfırıncı kuvveti daima 1 midir (sıfır hariç)?",
                "statement": "Sıfır hariç tüm reel sayıların sıfırıncı kuvveti 1'e eşittir: a⁰ = 1 (a ≠ 0).",
                "correctAnswer": true,
                "explanation": "Doğru! 0⁰ belirsizdir, diğer tüm sayıların 0. kuvveti 1'dir."
              }
            ]
          }
        ]
      },
      {
        "id": "lgs-u2",
        "number": 2,
        "title": "LGS Fen Bilimleri: Mevsimler & DNA",
        "description": "Eksen eğikliği, güneş ışınlarının geliş açısı ve DNA replikasyonu",
        "color": "#58cc02",
        "lessons": [
          {
            "id": "lgs-u2-l1",
            "unitId": "lgs-u2",
            "title": "Mevsimlerin Oluşumu & Eksen Eğikliği",
            "description": "21 Haziran, 21 Aralık gün dönümleri ve gece-gündüz süreleri.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Mevsimlerin oluşmasının 2 temel sebebi vardır: Dünyanın Güneş etrafında dolanması ve 23° 27' eksen eğikliği.",
              "Güneş ışınları dik açıyla (90°) gelirse birim yüzeye düşen enerji fazla olur, sıcaklık artar (Yaz).",
              "21 Haziran'da Kuzey Yarım Küre'de en uzun gündüz yaşanır."
            ],
            "questions": [
              {
                "id": "lgs-fen-1",
                "type": "multiple_choice",
                "prompt": "Dünya'da mevsimlerin oluşmasının temel sebebi aşağıdakilerden hangisidir?",
                "difficulty": "kolay",
                "explanation": "Mevsimlerin oluşumu eksen eğikliği ve Dünya'nın Güneş etrafındaki dolanma hareketinden kaynaklanır.",
                "options": [
                  {
                    "id": "m1",
                    "text": "Dünya'nın eksen eğikliği ve Güneş etrafında dolanması",
                    "isCorrect": true
                  },
                  {
                    "id": "m2",
                    "text": "Dünya'nın Güneş'e olan mesafesinin değişmesi",
                    "isCorrect": false
                  },
                  {
                    "id": "m3",
                    "text": "Dünya'nın kendi ekseni etrafında dönmesi",
                    "isCorrect": false
                  },
                  {
                    "id": "m4",
                    "text": "Ay'ın evreleri",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-fen-2",
                "type": "multiple_choice",
                "prompt": "DNA molekülünde Adenin (A) nükleotidinin karşısına her zaman hangi nükleotid gelir?",
                "difficulty": "kolay",
                "explanation": "DNA çift sarmalında Adenin (A) daima Timin (T) ile, Guanin (G) ise daima Sitozin (C/S) ile eşleşir.",
                "options": [
                  {
                    "id": "dna1",
                    "text": "Timin (T)",
                    "isCorrect": true
                  },
                  {
                    "id": "dna2",
                    "text": "Guanin (G)",
                    "isCorrect": false
                  },
                  {
                    "id": "dna3",
                    "text": "Sitozin (S)",
                    "isCorrect": false
                  },
                  {
                    "id": "dna4",
                    "text": "Urasil (U)",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-fen-3",
                "type": "true_false",
                "prompt": "21 Mart ve 23 Eylül tarihlerinde tüm Dünya'da gece ve gündüz süreleri eşit (12 saat) midir?",
                "statement": "Ekinoks tarihlerinde (21 Mart - 23 Eylül) Güneş ışınları Ekvator'a dik gelir ve Dünya genelinde gece-gündüz süreleri eşittir.",
                "correctAnswer": true,
                "explanation": "Harika! Ekinoks dönemlerinde gece ve gündüz 12'şer saat olarak eşitlenir."
              },
              {
                "id": "lgs-fen-4",
                "type": "multiple_choice",
                "prompt": "Kalıtım birimlerinin basitten karmaşığa (küçükten büyüğe) doğru sıralanışı hangisidir?",
                "difficulty": "orta",
                "explanation": "KeDiGeNi kodlaması: Kromozom > DNA > Gen > Nükleotid. Küçükten büyüğe: Nükleotid < Gen < DNA < Kromozom.",
                "options": [
                  {
                    "id": "kd1",
                    "text": "Nükleotid < Gen < DNA < Kromozom",
                    "isCorrect": true
                  },
                  {
                    "id": "kd2",
                    "text": "Kromozom < DNA < Gen < Nükleotid",
                    "isCorrect": false
                  },
                  {
                    "id": "kd3",
                    "text": "Gen < Nükleotid < DNA < Kromozom",
                    "isCorrect": false
                  },
                  {
                    "id": "kd4",
                    "text": "Nükleotid < DNA < Gen < Kromozom",
                    "isCorrect": false
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "id": "lgs-u3",
        "number": 3,
        "title": "LGS Türkçe: Fiilimsiler & Cümlenin Ögeleri",
        "description": "İsim-fiil, sıfat-fiil, zarf-fiil ekleri ve cümlenin temel/yardımcı ögeleri",
        "color": "#ff4b4b",
        "lessons": [
          {
            "id": "lgs-u3-l1",
            "unitId": "lgs-u3",
            "title": "Fiilimsiler (Eylemsiler)",
            "description": "İsim-fiil (Ma-yış-mak), Sıfat-fiil (An-ası-mez-ar-dik-ecek-miş) ve Zarf-fiiller.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "İsim-fiil ekleri: -ma, -ış, -mak (Ma-yış-mak)",
              "Sıfat-fiil ekleri: -an, -ası, -mez, -ar, -dik, -ecek, -miş",
              "Zarf-fiil ekleri: -ken, -alı, -asya, -esiye, -dıkça, -ince, -ip, -erek, -meden...",
              "Kalıcı isimler (dondurma, ekmek, çakmak, dolma) fiilimsi özelliğini kaybeder!"
            ],
            "questions": [
              {
                "id": "lgs-q-f1",
                "type": "multiple_choice",
                "prompt": "Aşağıdaki cümlelerin hangisinde üç fiilimsi türü de (isim-fiil, sıfat-fiil, zarf-fiil) bir arada kullanılmıştır?",
                "difficulty": "zor",
                "hint": "Cümledeki kelimelerin eklerini tek tek inceleyin: -an (sıfat), -ip (zarf), -mak (isim).",
                "explanation": "'Güneş doğarken (zarf-fiil) yola çıkan (sıfat-fiil) yolcular, dinlenmek (isim-fiil) için mola verdi.' cümlesinde her üç tür de vardır.",
                "options": [
                  {
                    "id": "f1_a",
                    "text": "Güneş doğarken yola çıkan yolcular, dinlenmek için mola verdi.",
                    "isCorrect": true
                  },
                  {
                    "id": "f1_b",
                    "text": "Kitap okumak insanın ufkunu genişleten en güzel alışkanlıktır.",
                    "isCorrect": false
                  },
                  {
                    "id": "f1_c",
                    "text": "Koşarak gelen çocuk birdenbire yere düştü.",
                    "isCorrect": false
                  },
                  {
                    "id": "f1_d",
                    "text": "Biten işleri teslim edip hemen evine döndü.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-f2",
                "type": "matching",
                "prompt": "Altı çizili fiilimsileri türleriyle doğru eşleştirin:",
                "difficulty": "orta",
                "explanation": "-an sıfat-fiil, -erek zarf-fiil, -ma isim-fiil ekidir.",
                "pairs": [
                  {
                    "id": "fp1",
                    "left": "Gülümseyen çocuk",
                    "right": "Sıfat-Fiil (Ortaç)"
                  },
                  {
                    "id": "fp2",
                    "left": "Düşünerek konuşmak",
                    "right": "Zarf-Fiil (Ulaç)"
                  },
                  {
                    "id": "fp3",
                    "left": "Yazma etkinliği",
                    "right": "İsim-Fiil (Mastar)"
                  }
                ]
              },
              {
                "id": "lgs-q-f3",
                "type": "multiple_choice",
                "prompt": "Aşağıdaki altı çizili sözcüklerden hangisi fiilimsi ekini aldığı halde 'kalıcı isim' olmuştur?",
                "difficulty": "orta",
                "explanation": "'Dolma' bir yemek adı olarak kalıplaşmış, fiil hareket anlamını yitirmiştir.",
                "options": [
                  {
                    "id": "kl1",
                    "text": "Annemin yaptığı biber dolması çok lezzetliydi.",
                    "isCorrect": true
                  },
                  {
                    "id": "kl2",
                    "text": "Salondaki kovayı suyla doldurmak zaman aldı.",
                    "isCorrect": false
                  },
                  {
                    "id": "kl3",
                    "text": "Gelen misafirleri kapıda karşıladık.",
                    "isCorrect": false
                  },
                  {
                    "id": "kl4",
                    "text": "Soru çözerek konuyu pekiştirdi.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-f4",
                "type": "true_false",
                "prompt": "Fiilimsilerin özellikleri hakkında verilen kural doğru mu?",
                "statement": "Fiilimsiler fiillere gelen özel eklerle türetilir; olumsuzluk eki (-me/-ma) alabilir ancak kip ve şahıs eki alamazlar.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Fiilimsiler eylem özelliğini korur ve olumsuzu yapılabilir, fakat çekimli fiil gibi kip eki alamaz."
              }
            ]
          },
          {
            "id": "lgs-u3-l2",
            "unitId": "lgs-u3",
            "title": "Cümlenin Ögeleri & Vurgu",
            "description": "Özne, Yüklem, Nesne (Belirtili/Belirtisiz), Yer Tamlayıcısı ve Zarf Tümleci.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Öge bulma sırası: 1. Yüklem, 2. Özne (Kim? Ne?), 3. Nesne ve Tümleçler",
              "Belirtili Nesne: Neyi? Kimi? sorularına yanıt verir (-i hal eki alır).",
              "Yer Tamlayıcısı (Dolaylı Tümleç): -e, -de, -den hal eklerini taşır (Kime? Nerede? Nereden?).",
              "Fiil cümlelerinde vurgu YÜKLEMDEN HEMEN ÖNCEKİ ögededir."
            ],
            "questions": [
              {
                "id": "lgs-q-og1",
                "type": "multiple_choice",
                "prompt": "'Genç yazar, kütüphanede bulduğu eski el yazmasını dikkatle inceliyordu.' cümlesinin öge dizilişi hangisidir?",
                "difficulty": "orta",
                "hint": "İnceliyordu (Yüklem), Kim? Genç yazar (Özne), Neyi? Kütüphanede bulduğu eski el yazmasını (Belirtili nesne), Nasıl? Dikkatle (Zarf tümleci).",
                "explanation": "Özne - Belirtili Nesne - Zarf Tümleci - Yüklem dizilişi mevcuttur.",
                "options": [
                  {
                    "id": "og1_a",
                    "text": "Özne - Belirtili Nesne - Zarf Tümleci - Yüklem",
                    "isCorrect": true
                  },
                  {
                    "id": "og1_b",
                    "text": "Özne - Yer Tamlayıcısı - Nesne - Yüklem",
                    "isCorrect": false
                  },
                  {
                    "id": "og1_c",
                    "text": "Zarf Tümleci - Özne - Nesne - Yüklem",
                    "isCorrect": false
                  },
                  {
                    "id": "og1_d",
                    "text": "Özne - Zarf Tümleci - Belirtisiz Nesne - Yüklem",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-og2",
                "type": "matching",
                "prompt": "Ögeleri bulduran soruları doğru ögelerle eşleştirin:",
                "difficulty": "kolay",
                "explanation": "Kimi/Neyi belirtili nesneyi, Nerede/Nereden yer tamlayıcısını, Nasıl/Ne zaman zarf tümlecini buldurur.",
                "pairs": [
                  {
                    "id": "op1",
                    "left": "Kimi? / Neyi?",
                    "right": "Belirtili Nesne"
                  },
                  {
                    "id": "op2",
                    "left": "Nereye? / Nerede? / Nereden?",
                    "right": "Yer Tamlayıcısı (Dolaylı Tümleç)"
                  },
                  {
                    "id": "op3",
                    "left": "Nasıl? / Ne zaman? / Neden?",
                    "right": "Zarf Tümleci"
                  }
                ]
              },
              {
                "id": "lgs-q-og3",
                "type": "multiple_choice",
                "prompt": "'Ahmet bu akşam bize gelecek.' cümlesinde vurgulanan öge hangisidir?",
                "difficulty": "orta",
                "hint": "Fiil cümlelerinde vurgu yüklemden bir önceki ögededir.",
                "explanation": "Yüklem 'gelecek'. Ondan hemen önceki öge 'bize' (Yer tamlayıcısı) olduğu için vurgu Yer Tamlayıcısı üzerindedir.",
                "options": [
                  {
                    "id": "vr1",
                    "text": "Yer Tamlayıcısı (bize)",
                    "isCorrect": true
                  },
                  {
                    "id": "vr2",
                    "text": "Özne (Ahmet)",
                    "isCorrect": false
                  },
                  {
                    "id": "vr3",
                    "text": "Zarf Tümleci (bu akşam)",
                    "isCorrect": false
                  },
                  {
                    "id": "vr4",
                    "text": "Yüklem (gelecek)",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-og4",
                "type": "true_false",
                "prompt": "Cümlede yükleme sorulan ilk 'Ne?' sorusu nesneyi mi verir?",
                "statement": "Yükleme sorulan İLK 'Ne?' sorusu ÖZNEYİ buldurur; özne bulunduktan sonraki 'Ne?' sorusu Belirtisiz Nesneyi verir.",
                "correctAnswer": true,
                "explanation": "Kesinlikle doğru! Sıralama Ö-Y-N kuralıdır: Önce özne, sonra nesne bulunur."
              }
            ]
          }
        ]
      },
      {
        "id": "lgs-u4",
        "number": 4,
        "title": "LGS İnkılap Tarihi: Milli Mücadele & Cepheler",
        "description": "Mondros, Kongreler, TBMM'nin açılışı ve Kurtuluş Savaşı cepheleri",
        "color": "#ff4b4b",
        "lessons": [
          {
            "id": "lgs-u4-l1",
            "unitId": "lgs-u4",
            "title": "Milli Mücadele Hazırlık Dönemi",
            "description": "Amasya Genelgesi, Erzurum ve Sivas Kongreleri kararları.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "Amasya Genelgesi: Kurtuluş Savaşı'nın gerekçesi, amacı ve yöntemi ilk kez belirtildi.",
              "Erzurum Kongresi: Toplanış bölgesel, kararlar ulusal. 'Manda ve himaye kabul edilemez.'",
              "Sivas Kongresi: Tüm cemiyetler 'Anadolu ve Rumeli Müdafaa-i Hukuk' adı altında birleşti."
            ],
            "questions": [
              {
                "id": "lgs-q-in1",
                "type": "multiple_choice",
                "prompt": "'Milletin bağımsızlığını yine milletin azim ve kararı kurtaracaktır.' tarihi kararı ilk kez nerede alınmıştır?",
                "difficulty": "kolay",
                "hint": "Milli Mücadelenin yöntem ve amacının ilan edildiği genelgedir.",
                "explanation": "Amasya Genelgesi'nde bu madde ile ilk kez milli egemenlik ilkesine vurgu yapılmış ve yöntemi çizilmiştir.",
                "options": [
                  {
                    "id": "in1_a",
                    "text": "Amasya Genelgesi",
                    "isCorrect": true
                  },
                  {
                    "id": "in1_b",
                    "text": "Havza Genelgesi",
                    "isCorrect": false
                  },
                  {
                    "id": "in1_c",
                    "text": "Erzurum Kongresi",
                    "isCorrect": false
                  },
                  {
                    "id": "in1_d",
                    "text": "Amasya Görüşmeleri",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-in2",
                "type": "matching",
                "prompt": "Tarihi olayları en önemli özellikleriyle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Erzurum'da ilk kez manda reddedildi, Sivas'ta tüm cemiyetler birleşti, Amasya'da amaç/yöntem belirlendi.",
                "pairs": [
                  {
                    "id": "ip1",
                    "left": "Amasya Genelgesi",
                    "right": "Kurtuluş Savaşının amacı ve yöntemi ilan edildi"
                  },
                  {
                    "id": "ip2",
                    "left": "Erzurum Kongresi",
                    "right": "Manda ve himaye ilk kez açıkça reddedildi"
                  },
                  {
                    "id": "ip3",
                    "left": "Sivas Kongresi",
                    "right": "Milli cemiyetler tek çatı altında birleştirildi"
                  }
                ]
              },
              {
                "id": "lgs-q-in3",
                "type": "multiple_choice",
                "prompt": "İstanbul'un İtilaf donanmaları tarafından işgal edildiği gün Mustafa Kemal Paşa'nın söylediği tarihi söz nedir?",
                "difficulty": "kolay",
                "explanation": "Mustafa Kemal, 13 Kasım 1918'de İstanbul Boğazı'ndaki İtilaf donanmasını görünce yaveri Cevat Abbas'a 'Geldikleri gibi giderler!' demiştir.",
                "options": [
                  {
                    "id": "sz1",
                    "text": "Geldikleri gibi giderler!",
                    "isCorrect": true
                  },
                  {
                    "id": "sz2",
                    "text": "Ya istiklal ya ölüm!",
                    "isCorrect": false
                  },
                  {
                    "id": "sz3",
                    "text": "Ordular! İlk hedefiniz Akdeniz'dir, ileri!",
                    "isCorrect": false
                  },
                  {
                    "id": "sz4",
                    "text": "Hattı müdafaa yoktur, sathı müdafaa vardır.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-in4",
                "type": "true_false",
                "prompt": "Misak-ı Milli kararları son Osmanlı Mebusan Meclisi'nde kabul edilmiş midir?",
                "statement": "Misak-ı Milli (Milli Ant) kararları, 28 Ocak 1920'de Son Osmanlı Mebusan Meclisi tarafından oy birliği ile kabul edilmiştir.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Bu kararlar üzerine İtilaf Devletleri 16 Mart 1920'de İstanbul'u resmen işgal etmiştir."
              }
            ]
          },
          {
            "id": "lgs-u4-l2",
            "unitId": "lgs-u4",
            "title": "Kurtuluş Savaşı Cepheleri & Zaferler",
            "description": "Doğu, Güney ve Batı Cepheleri; Gümrü, Mudanya ve Lozan Barış Antlaşmaları.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Doğu Cephesi: Kazım Karabekir (15. Kolordu) ➔ Gümrü Antlaşması ile kapandı.",
              "Güney Cephesi: Kuva-yı Milliye halk direnişi (Maraş, Antep, Urfa) ➔ 1921 Ankara Antlaşması ile kapandı.",
              "Batı Cephesi: Düzenli Ordu (İsmet Paşa & Mustafa Kemal Paşa) ➔ Mudanya Ateşkesi."
            ],
            "questions": [
              {
                "id": "lgs-q-cp1",
                "type": "multiple_choice",
                "prompt": "TBMM Hükümeti'nin kurduğu düzenli ordunun Batı Cephesi'nde kazandığı İLK askeri zafer hangisidir?",
                "difficulty": "kolay",
                "explanation": "I. İnönü Muharebesi (Ocak 1921), düzenli ordunun Batı Cephesi'ndeki ilk askeri zaferidir.",
                "options": [
                  {
                    "id": "cp1_a",
                    "text": "I. İnönü Muharebesi",
                    "isCorrect": true
                  },
                  {
                    "id": "cp1_b",
                    "text": "II. İnönü Muharebesi",
                    "isCorrect": false
                  },
                  {
                    "id": "cp1_c",
                    "text": "Sakarya Meydan Muharebesi",
                    "isCorrect": false
                  },
                  {
                    "id": "cp1_d",
                    "text": "Büyük Taarruz",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-cp2",
                "type": "matching",
                "prompt": "Antlaşmaları kapattıkları cephelerle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Gümrü Doğu'yu, 1921 Ankara Güney'i, Mudanya ise Batı Cephesi'ndeki silahlı çatışmayı bitirdi.",
                "pairs": [
                  {
                    "id": "ap1",
                    "left": "Gümrü Antlaşması",
                    "right": "Doğu Cephesi kapandı"
                  },
                  {
                    "id": "ap2",
                    "left": "1921 Ankara Antlaşması",
                    "right": "Güney Cephesi kapandı (Fransa çekildi)"
                  },
                  {
                    "id": "ap3",
                    "left": "Mudanya Ateşkes Antlaşması",
                    "right": "Batı Cephesi silahlı çatışma bitti"
                  }
                ]
              },
              {
                "id": "lgs-q-cp3",
                "type": "multiple_choice",
                "prompt": "'Hattı müdafaa yoktur, sathı müdafaa vardır. O satıh bütün vatandır.' tarihi emri hangi muharebede verilmiştir?",
                "difficulty": "orta",
                "explanation": "Mustafa Kemal Paşa bu dünya savaş tarihine geçen taktiği Sakarya Meydan Muharebesi'nde (1921) vermiştir.",
                "options": [
                  {
                    "id": "sk1",
                    "text": "Sakarya Meydan Muharebesi",
                    "isCorrect": true
                  },
                  {
                    "id": "sk2",
                    "text": "Çanakkale Kara Savaşları",
                    "isCorrect": false
                  },
                  {
                    "id": "sk3",
                    "text": "Başkomutanlık Meydan Muharebesi",
                    "isCorrect": false
                  },
                  {
                    "id": "sk4",
                    "text": "Eskişehir - Kütahya Muharebeleri",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-cp4",
                "type": "true_false",
                "prompt": "Doğu Cephesi'nde TBMM'yi tanıyan ilk devlet Ermenistan mıdır?",
                "statement": "TBMM'yi ve Misak-ı Milli'yi tanıyan ilk yabancı devlet Gümrü Antlaşması ile Ermenistan olmuştur.",
                "correctAnswer": true,
                "explanation": "Doğrudur! 3 Aralık 1920 Gümrü Antlaşması ile TBMM'nin varlığını tanıyan ilk devlet olmuştur."
              }
            ]
          }
        ]
      },
      {
        "id": "lgs-u5",
        "number": 5,
        "title": "LGS Fen Bilimleri: Katı ve Sıvı Basıncı",
        "description": "Katı basıncı formülü, temas yüzeyi, sıvı basıncı (h.d.g) ve Pascal Prensibi",
        "color": "#ff4b4b",
        "lessons": [
          {
            "id": "lgs-u5-l1",
            "unitId": "lgs-u5",
            "title": "Katı Basıncı ve Günlük Hayat",
            "description": "P = F / S kuralı, basıncı artıran ve azaltan mühendislik uygulamaları.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "Katı basıncı: Basınç (P) = Ağırlık / Kuvvet (F) ÷ Temas Yüzey Alanı (S)",
              "Yüzey alanı küçüldükçe basınç ARTAR (Bıçağın bilenmesi, krampon çivileri).",
              "Yüzey alanı büyüdükçe basınç AZALIR (Kar ayakkabısı, tır ve tank paletleri).",
              "Katılar üzerlerine uygulanan kuvveti AYNEN iletirler."
            ],
            "questions": [
              {
                "id": "lgs-q-bs1",
                "type": "multiple_choice",
                "prompt": "Özdeş tuğlalardan oluşan cisimlerden hangisinin zemine uyguladığı katı basıncı en büyüktür?",
                "difficulty": "kolay",
                "hint": "Basıncın en büyük olması için yüzey alanının en küçük olması gerekir.",
                "explanation": "Ağırlık sabitken temas yüzey alanı en küçük olan tuğla zemine en büyük basıncı uygular.",
                "options": [
                  {
                    "id": "bs1_a",
                    "text": "Küçük yüzeyi üzerine dik konulan tuğla",
                    "isCorrect": true
                  },
                  {
                    "id": "bs1_b",
                    "text": "Geniş yüzeyi üzerine yatay konulan tuğla",
                    "isCorrect": false
                  },
                  {
                    "id": "bs1_c",
                    "text": "Yan yüzeyi üzerine konulan tuğla",
                    "isCorrect": false
                  },
                  {
                    "id": "bs1_d",
                    "text": "Hepsinde basınç eşittir",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-bs2",
                "type": "matching",
                "prompt": "Uygulamaları basınç üzerindeki etkileriyle eşleştirin:",
                "difficulty": "kolay",
                "explanation": "Yüzey küçüldükçe basınç artar, yüzey genişledikçe basınç azalır.",
                "pairs": [
                  {
                    "id": "bp1",
                    "left": "Bıçakların bilenerek inceltilmesi",
                    "right": "Basıncı artırmak için"
                  },
                  {
                    "id": "bp2",
                    "left": "Ağır iş makinelerine palet takılması",
                    "right": "Basıncı azaltmak için"
                  },
                  {
                    "id": "bp3",
                    "left": "Futbol kramponlarının altına diş konması",
                    "right": "Basıncı artırmak için"
                  }
                ]
              },
              {
                "id": "lgs-q-bs3",
                "type": "multiple_choice",
                "prompt": "Ağırlığı 40 N olan bir cismin taban alanı 2 m² ise zemine uyguladığı basınç kaç Pascal'dır (N/m²)?",
                "difficulty": "orta",
                "explanation": "P = F / S = 40 N ÷ 2 m² = 20 Pa (Pascal) bulunur.",
                "options": [
                  {
                    "id": "pa1",
                    "text": "20 Pa",
                    "isCorrect": true
                  },
                  {
                    "id": "pa2",
                    "text": "80 Pa",
                    "isCorrect": false
                  },
                  {
                    "id": "pa3",
                    "text": "40 Pa",
                    "isCorrect": false
                  },
                  {
                    "id": "pa4",
                    "text": "10 Pa",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-bs4",
                "type": "true_false",
                "prompt": "Katılar kuvveti ve basıncı aynı şekilde mi iletir?",
                "statement": "Katılar üzerlerine uygulanan kuvveti doğrultusunu değiştirmeden aynen iletir ancak basıncı aynen iletmezler.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Örneğin çiviye vurulduğunda çekiç kuvveti çivinin ucuna aynen iletir, ama uç çok ince olduğu için uçtaki basınç devasa boyuta ulaşır."
              }
            ]
          },
          {
            "id": "lgs-u5-l2",
            "unitId": "lgs-u5",
            "title": "Sıvı & Gaz Basıncı (Pascal & Torricelli)",
            "description": "Sıvı basıncı formülü (P = h.d.g), derinlik, yoğunluk ve hidrolik sistemler.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Sıvı basıncı: Derinlik (h) × Yoğunluk (d) × Yerçekimi ivmesi (g)",
              "Sıvı basıncı KABIN ŞEKLİNE ve SIVI MİKTARINA bağlı DEĞİLDİR!",
              "Pascal Prensibi: Sıvılar sıkıştırılamaz, uygulanan basıncı her yöne aynen iletir.",
              "Açık hava basıncı Torricelli tarafından cıva deneyiyle deniz seviyesinde 76 cmHg ölçülmüştür."
            ],
            "questions": [
              {
                "id": "lgs-q-sv1",
                "type": "multiple_choice",
                "prompt": "İçinde su bulunan bir kabın tabanındaki sıvı basıncı aşağıdakilerden hangisine BAĞLI DEĞİLDİR?",
                "difficulty": "orta",
                "hint": "Sıvı basıncı formülü: P = h . d . g'dir.",
                "explanation": "Sıvı basıncı sıvının derinliğine ve yoğunluğuna bağlıdır; kabın şekline veya içindeki toplam su hacmine bağlı değildir.",
                "options": [
                  {
                    "id": "sv1_a",
                    "text": "Kabın şekline ve genişliğine",
                    "isCorrect": true
                  },
                  {
                    "id": "sv1_b",
                    "text": "Sıvının derinliğine (h)",
                    "isCorrect": false
                  },
                  {
                    "id": "sv1_c",
                    "text": "Sıvının yoğunluğuna (d)",
                    "isCorrect": false
                  },
                  {
                    "id": "sv1_d",
                    "text": "Yer çekimi ivmesine (g)",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-sv2",
                "type": "matching",
                "prompt": "Basınç yasalarını mucitleri ve deneyleriyle eşleştirin:",
                "difficulty": "orta",
                "explanation": "Pascal prensibi hidrolik frenlerde, Torricelli açık hava basıncı ölçümünde kullanılır.",
                "pairs": [
                  {
                    "id": "sp1",
                    "left": "Pascal Prensibi",
                    "right": "Sıvıların basıncı aynen iletmesi (Hidrolik fren, berber koltuğu)"
                  },
                  {
                    "id": "sp2",
                    "left": "Torricelli Deneyi",
                    "right": "Deniz seviyesinde açık hava basıncı (76 cmHg)"
                  },
                  {
                    "id": "sp3",
                    "left": "U Borusu Manometresi",
                    "right": "Farklı yoğunluktaki sıvıların basınç dengesi"
                  }
                ]
              },
              {
                "id": "lgs-q-sv3",
                "type": "multiple_choice",
                "prompt": "Deniz seviyesinden yüksek dağların zirvesine doğru çıkıldıkça açık hava basıncı nasıl değişir?",
                "difficulty": "kolay",
                "explanation": "Yukarı çıkıldıkça üstümüzdeki hava tabakasının kalınlığı ve yoğunluğu azaldığı için açık hava basıncı azalır.",
                "options": [
                  {
                    "id": "ah1",
                    "text": "Açık hava basıncı azalır",
                    "isCorrect": true
                  },
                  {
                    "id": "ah2",
                    "text": "Açık hava basıncı artar",
                    "isCorrect": false
                  },
                  {
                    "id": "ah3",
                    "text": "Değişmez, 76 cmHg sabit kalır",
                    "isCorrect": false
                  },
                  {
                    "id": "ah4",
                    "text": "Önce artar sonra sıfır olur",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "lgs-q-sv4",
                "type": "true_false",
                "prompt": "Sıvılar sıkıştırılabilir mi?",
                "statement": "Sıvılar pratik olarak sıkıştırılamaz kabul edilir; bu nedenle üzerlerine uygulanan basıncı her doğrultuda eşit büyüklükte iletirler.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Sıvıların sıkıştırılamama özelliği ve basıncı iletmesi Pascal prensibinin temelini oluşturur."
              }
            ]
          }
        ]
      },
      {
        "id": "lgs-u6",
        "number": 6,
        "title": "Doğrusal Denklemler & Eğim",
        "description": "Koordinat sistemi, doğrusal denklemlerin grafikleri ve eğim hesaplama.",
        "color": "#3b82f6",
        "lessons": [
          {
            "id": "lgs-u6-l1",
            "unitId": "lgs-u6",
            "title": "Koordinat Sistemi & Doğru Grafikleri",
            "description": "Nokta analitiği, eksenleri kesen doğrular ve orijinden geçen doğrular.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "y ekseni üzerindeki noktaların apsisi (x) 0 dır.",
              "x ekseni üzerindeki noktaların ordinatı (y) 0 dır.",
              "y = mx formundaki doğrular daima orijinden geçer."
            ],
            "questions": [
              {
                "id": "lgs-q36",
                "type": "multiple_choice",
                "prompt": "A(m - 3, 2m + 4) noktası koordinat sisteminde y ekseni üzerinde olduğuna göre bu noktanın ordinatı kaçtır?",
                "difficulty": "kolay",
                "hint": "y ekseni üzerindeki noktaların apsis değeri 0 dır.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "10",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "6",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "8",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "12",
                    "isCorrect": false
                  }
                ],
                "explanation": "y ekseni üzerinde olduğundan apsis 0 olmalıdır: m - 3 = 0 => m = 3. Ordinat = 2(3) + 4 = 10."
              },
              {
                "id": "lgs-q37",
                "type": "multiple_choice",
                "prompt": "2x - 3y = 12 doğrusunun koordinat eksenlerini kestiği noktalar arasındaki uzaklık kaç birimdir?",
                "difficulty": "orta",
                "hint": "x=0 için y yi, y=0 için x i bulup Pisagor bağıntısı uygula.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "2√13",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "10",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "5√2",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "4√3",
                    "isCorrect": false
                  }
                ],
                "explanation": "x=0 => -3y=12 => y=-4 (0, -4). y=0 => 2x=12 => x=6 (6, 0). Uzaklık = √(6² + (-4)²) = √(36+16) = √52 = 2√13."
              },
              {
                "id": "lgs-q38",
                "type": "multiple_choice",
                "prompt": "Orijinden geçen ve eğimi -2 olan doğrunun denklemi hangisidir?",
                "difficulty": "kolay",
                "hint": "Orijinden geçen doğruların genel formülü y = mx dir.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "y = -2x",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "y = 2x - 2",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "2x + y = 2",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "y = x - 2",
                    "isCorrect": false
                  }
                ],
                "explanation": "Orijinden geçen doğrular y = mx formundadır. Eğim m = -2 olduğundan denklem y = -2x tir."
              },
              {
                "id": "lgs-q39",
                "type": "multiple_choice",
                "prompt": "y = 3x - 5 doğrusu ile ax - y + 7 = 0 doğrusu birbirine paralel olduğuna göre a kaçtır?",
                "difficulty": "orta",
                "hint": "Paralel doğruların eğimleri birbirine eşittir.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "3",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "-3",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "1/3",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "5",
                    "isCorrect": false
                  }
                ],
                "explanation": "Birinci doğrunun eğimi m₁ = 3 tür. İkinci doğruda y = ax + 7 olduğundan m₂ = a dır. Paralel oldukları için a = 3."
              }
            ]
          },
          {
            "id": "lgs-u6-l2",
            "unitId": "lgs-u6",
            "title": "Eğim & Doğrusal İlişki Problemleri",
            "description": "Dikey uzunluk / yatay uzunluk oranı ve günlük hayat doğrusal grafikleri.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Eğim = Dikey Uzunluk / Yatay Uzunluk formülüyle hesaplanır.",
              "Sağa yatık doğruların eğimi pozitif, sola yatık doğruların eğimi negatiftir.",
              "x eksenine paralel yatay doğruların eğimi 0, dikey doğruların eğimi tanımsızdır."
            ],
            "questions": [
              {
                "id": "lgs-q40",
                "type": "multiple_choice",
                "prompt": "Dikey uzunluğu 12 metre, yatay uzunluğu 16 metre olan bir engelli rampasının eğimi yüzde kaçtır?",
                "difficulty": "kolay",
                "hint": "Eğim = Dikey / Yatay oranını yüzdeye dönüştür.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "%75",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "%60",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "%80",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "%120",
                    "isCorrect": false
                  }
                ],
                "explanation": "Eğim = 12 / 16 = 3 / 4. 25 ile genişletilirse 75 / 100 yani %75 tir."
              },
              {
                "id": "lgs-q41",
                "type": "multiple_choice",
                "prompt": "A(-2, 3) ve B(4, -1) noktalarından geçen doğrunun eğimi kaçtır?",
                "difficulty": "orta",
                "hint": "m = (y₂ - y₁) / (x₂ - x₁) formülünü uygula.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "-2/3",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "-3/2",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "2/3",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "-1/3",
                    "isCorrect": false
                  }
                ],
                "explanation": "m = (-1 - 3) / (4 - (-2)) = -4 / 6 = -2/3 tür."
              },
              {
                "id": "lgs-q42",
                "type": "multiple_choice",
                "prompt": "İçinde 50 litre su bulunan bir deponun musluğu açıldığında saatte 4 litre su boşalmaktadır. x geçen saat ve y depoda kalan su miktarı olduğuna göre doğrusal denklem hangisidir?",
                "difficulty": "kolay",
                "hint": "Başlangıç değeri 50 dir ve saatte 4 azalmaktadır.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "y = 50 - 4x",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "y = 50 + 4x",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "y = 4x - 50",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "x = 50 - 4y",
                    "isCorrect": false
                  }
                ],
                "explanation": "Başlangıçta 50 litre var, her x saatte 4x litre eksildiği için kalan miktar y = 50 - 4x olur."
              },
              {
                "id": "lgs-q43",
                "type": "multiple_choice",
                "prompt": "x = -4 doğrusunun eğimi hakkında hangisi söylenebilir?",
                "difficulty": "orta",
                "hint": "y eksenine paralel dikey doğruların eğimini hatırla.",
                "options": [
                  {
                    "id": "opt-1",
                    "text": "Tanımsızdır",
                    "isCorrect": true
                  },
                  {
                    "id": "opt-2",
                    "text": "Sıfırdır",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-3",
                    "text": "-4 tür",
                    "isCorrect": false
                  },
                  {
                    "id": "opt-4",
                    "text": "1 dir",
                    "isCorrect": false
                  }
                ],
                "explanation": "x = k şeklindeki doğrular dikey doğrulardır. Yatay uzunluk 0 olduğu için paydaya 0 gelir ve eğim tanımsızdır."
              }
            ]
          }
        ]
      }
    ]
  },
  {
    "id": "dil",
    "name": "İngilizce (A1 - C2)",
    "subTitle": "Konuşma, Gramer & YDS/YÖKDİL Kelimeleri",
    "icon": "🌍",
    "badge": "Küresel Dil",
    "color": "#1cb0f6",
    "accentColor": "#1899d6",
    "units": [
      {
        "id": "dil-u1",
        "number": 1,
        "title": "Günlük Konuşma & Tanışma (A1)",
        "description": "Temel selamlaşmalar, kendini tanıtma ve yaygın kalıplar",
        "color": "#1cb0f6",
        "lessons": [
          {
            "id": "dil-u1-l1",
            "unitId": "dil-u1",
            "title": "Selamlaşma & İfadeler",
            "description": "Hello, How are you?, Nice to meet you kalıpları.",
            "xpReward": 20,
            "gemReward": 5,
            "type": "lesson",
            "summaryNotes": [
              "'How are you doing?' = Nasılsın? / Nasıl gidiyor?",
              "'Nice to meet you' = Tanıştığıma memnun oldum (Karşılığı: 'Nice to meet you too')",
              "'Where are you from?' = Nerelisin? (Cevap: 'I am from Turkey')"
            ],
            "questions": [
              {
                "id": "dil-q1",
                "type": "multiple_choice",
                "prompt": "'Nice to meet you' diyen birine en kibar ve doğal karşılık ne olur?",
                "difficulty": "kolay",
                "explanation": "'Nice to meet you' (Tanıştığıma memnun oldum) ifadesine 'Nice to meet you too' (Ben de memnun oldum) şeklinde yanıt verilir.",
                "options": [
                  {
                    "id": "d1",
                    "text": "Nice to meet you too!",
                    "isCorrect": true
                  },
                  {
                    "id": "d2",
                    "text": "I am 20 years old.",
                    "isCorrect": false
                  },
                  {
                    "id": "d3",
                    "text": "Yes, I do.",
                    "isCorrect": false
                  },
                  {
                    "id": "d4",
                    "text": "Goodbye tomorrow.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q2",
                "type": "matching",
                "prompt": "İngilizce kelimeleri Türkçe karşılıklarıyla eşleştirin:",
                "difficulty": "kolay",
                "explanation": "Günlük yaygın fiiller ve isimler.",
                "pairs": [
                  {
                    "id": "dp1",
                    "left": "Learn",
                    "right": "Öğrenmek"
                  },
                  {
                    "id": "dp2",
                    "left": "Knowledge",
                    "right": "Bilgi"
                  },
                  {
                    "id": "dp3",
                    "left": "Challenge",
                    "right": "Meydan Okuma"
                  },
                  {
                    "id": "dp4",
                    "left": "Goal",
                    "right": "Hedef"
                  }
                ]
              },
              {
                "id": "dil-q3",
                "type": "code_fill",
                "prompt": "Cümleyi uygun yardımcı fiil ile tamamlayın: 'She ___ studying for the exam right now.'",
                "codeSnippet": "She ___ studying for the exam right now.",
                "blankId": "is",
                "options": [
                  "is",
                  "are",
                  "am",
                  "be"
                ],
                "correctAnswer": "is",
                "explanation": "Present Continuous Tense yapısında 'he/she/it' özneleri 'is' yardımcı fiilini alır."
              },
              {
                "id": "dil-q4",
                "type": "multiple_choice",
                "prompt": "'What time is it?' sorusuna saat 09:30 iken nasıl cevap verilir?",
                "difficulty": "kolay",
                "explanation": "İngilizce'de buçuklar 'half past' kalıbıyla söylenir: 'It is half past nine.'",
                "options": [
                  {
                    "id": "tm1",
                    "text": "It is half past nine.",
                    "isCorrect": true
                  },
                  {
                    "id": "tm2",
                    "text": "It is quarter to nine.",
                    "isCorrect": false
                  },
                  {
                    "id": "tm3",
                    "text": "It is nine o'clock.",
                    "isCorrect": false
                  },
                  {
                    "id": "tm4",
                    "text": "It is ten past nine.",
                    "isCorrect": false
                  }
                ]
              }
            ]
          },
          {
            "id": "dil-u1-l2",
            "unitId": "dil-u1",
            "title": "Geniş Zaman & Şimdiki Zaman (Simple Present)",
            "description": "Günlük rutinler, sıklık zarfları (always, often, never) ve -s takısı.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "He / She / It öznelerinde olumlu cümlede fiile -s, -es, -ies gelir (He plays, she watches).",
              "Soru ve olumsuzda Does / Doesn't gelir ve fiil yalın kalır: 'He doesn't like coffee.'",
              "Always (%100), Usually (%80), Often (%60), Sometimes (%50), Never (%0)."
            ],
            "questions": [
              {
                "id": "dil-gr1",
                "type": "multiple_choice",
                "prompt": "'He ___ to the gym three times a week.' Boşluğa hangi fiil çekimi gelmelidir?",
                "difficulty": "kolay",
                "explanation": "'He' öznesi geniş zamanda -s takısı alır: 'He goes'.",
                "options": [
                  {
                    "id": "g1",
                    "text": "goes",
                    "isCorrect": true
                  },
                  {
                    "id": "g2",
                    "text": "go",
                    "isCorrect": false
                  },
                  {
                    "id": "g3",
                    "text": "going",
                    "isCorrect": false
                  },
                  {
                    "id": "g4",
                    "text": "is go",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-gr2",
                "type": "matching",
                "prompt": "Sıklık zarflarını Türkçe anlamlarıyla eşleştirin:",
                "difficulty": "kolay",
                "explanation": "İngilizce sıklık belirten zarflar.",
                "pairs": [
                  {
                    "id": "fp1",
                    "left": "Always",
                    "right": "Daima / Her zaman"
                  },
                  {
                    "id": "fp2",
                    "left": "Rarely / Seldom",
                    "right": "Nadiren"
                  },
                  {
                    "id": "fp3",
                    "left": "Never",
                    "right": "Asla / Hiçbir zaman"
                  }
                ]
              },
              {
                "id": "dil-gr3",
                "type": "true_false",
                "prompt": "'She doesn't likes apples' cümlesi gramer olarak doğru mudur?",
                "statement": "'She doesn't likes apples' cümlesinde 'doesn't' sonrası fiil -s takısı alır.",
                "correctAnswer": false,
                "explanation": "Yanlış! Olumsuz ve soru cümlelerinde 'does' kullanıldığında ana fiil daima yalın (base form) kullanılır: 'She doesn't like apples'."
              }
            ]
          }
        ]
      },
      {
        "id": "dil-u2",
        "number": 2,
        "title": "YDS & YÖKDİL Akademik Kelimeler & Phrasal Verbs",
        "description": "Sık çıkan bağlaçlar, akademik sıfatlar ve phrasal verb kalıpları",
        "color": "#1899d6",
        "lessons": [
          {
            "id": "dil-u2-l1",
            "unitId": "dil-u2",
            "title": "Akademik Sıfatlar & Fiiller",
            "description": "Significant, Essential, Considerably ve Carry out kalıpları.",
            "xpReward": 25,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Carry out = Perform / Do (Uygulamak, gerçekleştirmek)",
              "Significant = Important / Notable (Önemli, kayda değer)",
              "Although / Even though = Zıtlık bağlaçları (-e rağmen)"
            ],
            "questions": [
              {
                "id": "dil-yds-1",
                "type": "multiple_choice",
                "prompt": "The scientists decided to ___ a series of experiments to test the new medicine. (Boşluğa en uygun phrasal verb hangisidir?)",
                "difficulty": "orta",
                "explanation": "'Carry out' deneyi yürütmek / gerçekleştirmek anlamına gelir.",
                "options": [
                  {
                    "id": "y1",
                    "text": "carry out",
                    "isCorrect": true
                  },
                  {
                    "id": "y2",
                    "text": "give up",
                    "isCorrect": false
                  },
                  {
                    "id": "y3",
                    "text": "look down",
                    "isCorrect": false
                  },
                  {
                    "id": "y4",
                    "text": "run out",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-yds-2",
                "type": "matching",
                "prompt": "YDS akademik kelimeleri Türkçe anlamlarıyla eşleştirin:",
                "difficulty": "zor",
                "explanation": "Sınavda en yüksek frekansta çıkan akademik kelimeler.",
                "pairs": [
                  {
                    "id": "yp1",
                    "left": "Substantial",
                    "right": "Büyük, önemli ölçüde"
                  },
                  {
                    "id": "yp2",
                    "left": "Deteriorate",
                    "right": "Kötüleşmek, bozulmak"
                  },
                  {
                    "id": "yp3",
                    "left": "Compulsory",
                    "right": "Zorunlu, mecburi"
                  }
                ]
              },
              {
                "id": "dil-yds-3",
                "type": "multiple_choice",
                "prompt": "The economic report indicates a ___ increase in inflation over the past quarter.",
                "difficulty": "orta",
                "explanation": "'Significant' (önemli, belirgin) artış sıfat tamlaması olarak sınavda en çok sorulan kelimelerdendir.",
                "options": [
                  {
                    "id": "yd1",
                    "text": "significant",
                    "isCorrect": true
                  },
                  {
                    "id": "yd2",
                    "text": "useless",
                    "isCorrect": false
                  },
                  {
                    "id": "yd3",
                    "text": "shallow",
                    "isCorrect": false
                  },
                  {
                    "id": "yd4",
                    "text": "hostile",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-yds-4",
                "type": "true_false",
                "prompt": "'In spite of' bağlacından sonra tam cümle (özne + yüklem) mi gelir?",
                "statement": "'In spite of' ve 'Despite' bağlaçlarından sonra cümle değil, bir isim (noun) veya isim fiil (V-ing) gelir.",
                "correctAnswer": true,
                "explanation": "Doğrudur! 'Although / Even though' tam cümle alırken, 'In spite of / Despite' isim öbeği alır (Despite the rain)."
              }
            ]
          }
        ]
      },
      {
        "id": "dil-u3",
        "number": 3,
        "title": "Past Simple: Geçmiş Zaman & Düzensiz Fiiller",
        "description": "Did / Didn't soru ve olumsuz kalıpları, en sık kullanılan düzensiz fiiller (went, saw, took)",
        "color": "#1cb0f6",
        "lessons": [
          {
            "id": "dil-u3-l1",
            "unitId": "dil-u3",
            "title": "Geçmiş Zaman & Düzensiz Fiiller (Irregular Verbs)",
            "description": "Düzenli (-ed) ve düzensiz (go ➔ went, see ➔ saw) fiil ayrımları.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "Düzenli fiillerin sonuna -ed eklenir: play ➔ played, watch ➔ watched.",
              "Düzensiz fiiller kökten değişir: go ➔ went, buy ➔ bought, eat ➔ ate, see ➔ saw.",
              "Olumsuz cümlelerde: didn't + V1 (fiilin yalın hali) kullanılır: I didn't go.",
              "Soru cümlelerinde: Did + özne + V1: Did you see him?"
            ],
            "questions": [
              {
                "id": "dil-q-ps1",
                "type": "multiple_choice",
                "prompt": "'I _____ (see) an exciting movie yesterday and I _____ (go) to bed late.' boşluklarına sırasıyla hangileri gelmelidir?",
                "difficulty": "orta",
                "explanation": "See fiilinin 2. hali 'saw', go fiilinin 2. hali ise 'went' şeklindedir.",
                "options": [
                  {
                    "id": "ps1_a",
                    "text": "saw / went",
                    "isCorrect": true
                  },
                  {
                    "id": "ps1_b",
                    "text": "seed / goed",
                    "isCorrect": false
                  },
                  {
                    "id": "ps1_c",
                    "text": "see / went",
                    "isCorrect": false
                  },
                  {
                    "id": "ps1_d",
                    "text": "saw / gone",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-ps2",
                "type": "matching",
                "prompt": "Fiillerin 1. hallerini (V1) 2. halleriyle (V2) eşleştiriniz:",
                "difficulty": "kolay",
                "explanation": "buy-bought, write-wrote, take-took, eat-ate.",
                "pairs": [
                  {
                    "id": "vp1",
                    "left": "buy (satın almak)",
                    "right": "bought"
                  },
                  {
                    "id": "vp2",
                    "left": "write (yazmak)",
                    "right": "wrote"
                  },
                  {
                    "id": "vp3",
                    "left": "take (almak / götürmek)",
                    "right": "took"
                  }
                ]
              },
              {
                "id": "dil-q-ps3",
                "type": "multiple_choice",
                "prompt": "Aşağıdaki cümlelerin hangisinde Past Simple kuralına uygun DOĞRU bir kullanım vardır?",
                "difficulty": "orta",
                "hint": "didn't sonrasında fiil 1. haline (yalın) döner.",
                "explanation": "'She didn't go to school yesterday.' doğrudur. 'didn't went' kullanımı gramer hatasıdır.",
                "options": [
                  {
                    "id": "gr1",
                    "text": "She didn't go to school yesterday.",
                    "isCorrect": true
                  },
                  {
                    "id": "gr2",
                    "text": "She didn't went to school yesterday.",
                    "isCorrect": false
                  },
                  {
                    "id": "gr3",
                    "text": "She doesn't went to school yesterday.",
                    "isCorrect": false
                  },
                  {
                    "id": "gr4",
                    "text": "She did not goes to school yesterday.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-ps4",
                "type": "true_false",
                "prompt": "Geçmiş zaman olumsuz cümlede 'didn't' sonrası fiil yalın mı kalır?",
                "statement": "Past Simple olumsuz cümlelerde (didn't) ve sorularda (Did...?) asıl fiil 2. haline değil, 1. (yalın) haline döner.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Geçmiş zaman anlamını 'did' üstlendiği için fiil yalın halde kalır (Did you sleep well?)."
              }
            ]
          },
          {
            "id": "dil-u3-l2",
            "unitId": "dil-u3",
            "title": "Past Simple Sorular & Zaman Zarfları",
            "description": "Where did you go? kalıbı, yesterday, ago, last night zaman zarfları.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Soru kalıbı: Soru Kelimesi (Wh-) + did + özne + V1 (yalın)",
              "Yesterday (dün), last week (geçen hafta), three days ago (üç gün önce).",
              "'Ago' sürenin sonuna gelir: ten minutes ago (on dakika önce).",
              "Kısa yanıtlar: Yes, I did. / No, I didn't."
            ],
            "questions": [
              {
                "id": "dil-q-pq1",
                "type": "multiple_choice",
                "prompt": "'Where _____ you _____ on your summer vacation last year?' boşluklarına ne gelmelidir?",
                "difficulty": "kolay",
                "explanation": "Past Simple soru yapısı 'Where did you go' şeklindedir.",
                "options": [
                  {
                    "id": "pq1_a",
                    "text": "did / go",
                    "isCorrect": true
                  },
                  {
                    "id": "pq1_b",
                    "text": "did / went",
                    "isCorrect": false
                  },
                  {
                    "id": "pq1_c",
                    "text": "do / went",
                    "isCorrect": false
                  },
                  {
                    "id": "pq1_d",
                    "text": "were / go",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-pq2",
                "type": "matching",
                "prompt": "Zaman zarflarını Türkçe anlamlarıyla eşleştiriniz:",
                "difficulty": "kolay",
                "explanation": "yesterday dün, last year geçen yıl, two weeks ago iki hafta önce demektir.",
                "pairs": [
                  {
                    "id": "zp1",
                    "left": "yesterday",
                    "right": "dün"
                  },
                  {
                    "id": "zp2",
                    "left": "two weeks ago",
                    "right": "iki hafta önce"
                  },
                  {
                    "id": "zp3",
                    "left": "last night",
                    "right": "dün gece"
                  }
                ]
              },
              {
                "id": "dil-q-pq3",
                "type": "multiple_choice",
                "prompt": "'Did you finish your homework?' sorusuna verilecek DOĞRU kısa olumlu yanıt hangisidir?",
                "difficulty": "kolay",
                "explanation": "Did ile sorulan soruya 'Yes, I did.' şeklinde yanıt verilir.",
                "options": [
                  {
                    "id": "an1",
                    "text": "Yes, I did.",
                    "isCorrect": true
                  },
                  {
                    "id": "an2",
                    "text": "Yes, I do.",
                    "isCorrect": false
                  },
                  {
                    "id": "an3",
                    "text": "Yes, I finished.",
                    "isCorrect": false
                  },
                  {
                    "id": "an4",
                    "text": "Yes, I was.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-pq4",
                "type": "true_false",
                "prompt": "'Ago' kelimesi süreden önce mi sonra mı gelir?",
                "statement": "İngilizcede 'ago' (önce) zaman zarfı sürenin SONUNA gelir (örneğin: 'two years ago', 'five minutes ago').",
                "correctAnswer": true,
                "explanation": "Doğrudur! 'Ago two years' denmez, daima 'two years ago' denir."
              }
            ]
          }
        ]
      },
      {
        "id": "dil-u4",
        "number": 4,
        "title": "Seyahat & Günlük Pratik İngilizce (Airport & Restaurant)",
        "description": "Havalimanı check-in, otel rezervasyonu ve restoranda sipariş diyalogları",
        "color": "#1cb0f6",
        "lessons": [
          {
            "id": "dil-u4-l1",
            "unitId": "dil-u4",
            "title": "Airport & Flight Dialogues (Havalimanı)",
            "description": "Uçuş kartı, pasaport kontrolü, bagaj teslimi ve anonslar.",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "Boarding pass: Uçağa biniş kartı, Gate: Uçuş kapısı, Baggage claim: Bagaj alanı.",
              "Window seat: Pencere kenarı koltuk, Aisle seat: Koridor tarafı koltuk.",
              "One-way ticket: Tek yön bilet, Round-trip: Gidiş-dönüş bileti.",
              "Flight attendant: Kabin memuru / hostes."
            ],
            "questions": [
              {
                "id": "dil-q-ap1",
                "type": "multiple_choice",
                "prompt": "Havalimanında check-in görevlisi 'Would you prefer a window seat or an aisle seat?' diye sorduğunda neyi sormaktadır?",
                "difficulty": "kolay",
                "explanation": "Pencere kenarı (window) mı yoksa koridor tarafı (aisle) mı koltuk tercih ettiğinizi sorar.",
                "options": [
                  {
                    "id": "ap1_a",
                    "text": "Pencere kenarı mı koridor kenarı mı koltuk istediğinizi",
                    "isCorrect": true
                  },
                  {
                    "id": "ap1_b",
                    "text": "Uçakta yemek yemek isteyip istemediğinizi",
                    "isCorrect": false
                  },
                  {
                    "id": "ap1_c",
                    "text": "Fazla bagajınızın olup olmadığını",
                    "isCorrect": false
                  },
                  {
                    "id": "ap1_d",
                    "text": "Dönüş biletinizi ne zaman alacağınızı",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-ap2",
                "type": "matching",
                "prompt": "Havalimanı terimlerini Türkçe karşılıklarıyla eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "Boarding pass biniş kartıdır, Baggage claim bagaj teslimidir, Customs gümrüktür.",
                "pairs": [
                  {
                    "id": "air1",
                    "left": "Boarding pass",
                    "right": "Uçuş biniş kartı"
                  },
                  {
                    "id": "air2",
                    "left": "Baggage claim",
                    "right": "Bagaj teslim alanı"
                  },
                  {
                    "id": "air3",
                    "left": "Gate",
                    "right": "Uçağa biniş kapısı"
                  }
                ]
              },
              {
                "id": "dil-q-ap3",
                "type": "multiple_choice",
                "prompt": "Güvenlik kontrolündeki görevlinin 'Do you have any liquids or sharp objects?' sorusuna uygun yanıt hangisidir?",
                "difficulty": "orta",
                "explanation": "'No, I don't have any liquids in my backpack.' uygun ve doğru cevaptır.",
                "options": [
                  {
                    "id": "sec1",
                    "text": "No, I don't have any liquids in my backpack.",
                    "isCorrect": true
                  },
                  {
                    "id": "sec2",
                    "text": "Yes, I am going to London.",
                    "isCorrect": false
                  },
                  {
                    "id": "sec3",
                    "text": "Here is my passport.",
                    "isCorrect": false
                  },
                  {
                    "id": "sec4",
                    "text": "Flight number is TK1980.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-ap4",
                "type": "true_false",
                "prompt": "'Aisle' kelimesindeki 's' harfi okunur mu?",
                "statement": "İngilizcede 'aisle' (koridor) kelimesi 'ayl' şeklinde telaffuz edilir; 's' harfi sessizdir (okunmaz).",
                "correctAnswer": true,
                "explanation": "Doğrudur! 'Aisle' kelimesinde 's' harfi okunmaz, telaffuzu /aɪl/ şeklindedir."
              }
            ]
          },
          {
            "id": "dil-u4-l2",
            "unitId": "dil-u4",
            "title": "Restoranda Sipariş Verme (Dining Out)",
            "description": "Menü inceleme, sipariş verme kalıpları, hesap isteme ve bahşiş.",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "I'd like to have...: ... almak istiyorum (kibar sipariş kalıbı).",
              "Could we have the bill / check, please?: Hesabı alabilir miyiz?",
              "Keep the change: Üstü kalsın.",
              "Main course: Ana yemek, Dessert: Tatlı, Appetizer: Başlangıç."
            ],
            "questions": [
              {
                "id": "dil-q-rs1",
                "type": "multiple_choice",
                "prompt": "Restoranda garsona en kibar şekilde hesap istemek için hangi cümle kullanılır?",
                "difficulty": "kolay",
                "explanation": "'Could we have the bill, please?' (veya check) standart ve nazik hesap isteme kalıbıdır.",
                "options": [
                  {
                    "id": "rs1_a",
                    "text": "Could we have the bill, please?",
                    "isCorrect": true
                  },
                  {
                    "id": "rs1_b",
                    "text": "Give me the money now!",
                    "isCorrect": false
                  },
                  {
                    "id": "rs1_c",
                    "text": "Where is my wallet?",
                    "isCorrect": false
                  },
                  {
                    "id": "rs1_d",
                    "text": "We are leaving now.",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-rs2",
                "type": "matching",
                "prompt": "Restoran kalıplarını anlamlarıyla eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "Are you ready to order: siparişe hazır mısınız, Keep the change: üstü kalsın, Table for two: 2 kişilik masa.",
                "pairs": [
                  {
                    "id": "rest1",
                    "left": "Are you ready to order?",
                    "right": "Sipariş vermeye hazır mısınız?"
                  },
                  {
                    "id": "rest2",
                    "left": "Keep the change.",
                    "right": "Para üstü kalsın (bahşiş)."
                  },
                  {
                    "id": "rest3",
                    "left": "I would like to have the grilled chicken.",
                    "right": "Izgara tavuk almak istiyorum."
                  }
                ]
              },
              {
                "id": "dil-q-rs3",
                "type": "multiple_choice",
                "prompt": "'I am vegetarian. Does this soup contain any meat?' diyen bir müşteri ne demek istemektedir?",
                "difficulty": "kolay",
                "explanation": "Müşteri vejetaryen olduğunu ve çorbanın içinde et bulunup bulunmadığını sormaktadır.",
                "options": [
                  {
                    "id": "veg1",
                    "text": "Vejetaryen olduğunu ve çorbada et olup olmadığını sormaktadır",
                    "isCorrect": true
                  },
                  {
                    "id": "veg2",
                    "text": "Çorbanın çok sıcak olduğunu söylemektedir",
                    "isCorrect": false
                  },
                  {
                    "id": "veg3",
                    "text": "Daha fazla ekmek istemektedir",
                    "isCorrect": false
                  },
                  {
                    "id": "veg4",
                    "text": "Hesabı ödemek istemektedir",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-rs4",
                "type": "true_false",
                "prompt": "Amerikan İngilizcesinde 'check', İngiliz İngilizcesinde 'bill' mi denir?",
                "statement": "Restoranda hesap isterken İngiliz İngilizcesinde yaygın olarak 'bill', Amerikan İngilizcesinde ise 'check' kullanılır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! Her iki kullanım da uluslararası düzeyde anlaşılır ve doğrudur."
              }
            ]
          }
        ]
      },
      {
        "id": "dil-u5",
        "number": 5,
        "title": "Gelecek Zaman & Kipler (Will vs Be Going To)",
        "description": "Planlanmış gelecek (be going to), anlık kararlar (will) ve can/could/must kipleri",
        "color": "#1cb0f6",
        "lessons": [
          {
            "id": "dil-u5-l1",
            "unitId": "dil-u5",
            "title": "Will vs Be Going To Ayrımı",
            "description": "Konuşma anında verilen ani kararlar (will) ve önceden planlanmış hedefler (going to).",
            "xpReward": 25,
            "gemReward": 6,
            "type": "lesson",
            "summaryNotes": [
              "Will: Konuşma anında verilen ani kararlar, sözler ve teklifler: 'I will help you!'",
              "Be going to: Önceden planlanmış niyetler veya kanıta dayalı tahminler: 'It is going to rain.'",
              "Will olumsuzu: won't (will not).",
              "Her iki yapıda da ana fiil yalın halde (V1) kullanılır."
            ],
            "questions": [
              {
                "id": "dil-q-wl1",
                "type": "multiple_choice",
                "prompt": "Telefonun çaldığını duyup 'I _____ answer it!' dediğinizde konuşma anında verilen ani karar için hangisi uygundur?",
                "difficulty": "kolay",
                "explanation": "Konuşma anında verilen ani kararlarda 'will' kullanılır: 'I will answer it!'",
                "options": [
                  {
                    "id": "wl1_a",
                    "text": "will",
                    "isCorrect": true
                  },
                  {
                    "id": "wl1_b",
                    "text": "am going to",
                    "isCorrect": false
                  },
                  {
                    "id": "wl1_c",
                    "text": "did",
                    "isCorrect": false
                  },
                  {
                    "id": "wl1_d",
                    "text": "have",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-wl2",
                "type": "matching",
                "prompt": "Gelecek zaman kalıplarını doğru durumlarla eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "Going to önceden plan veya kanıt, Will ani karar veya söz vermedir.",
                "pairs": [
                  {
                    "id": "wp1",
                    "left": "Look at those dark clouds! It is going to rain.",
                    "right": "Gözle görülür kanıta dayalı güçlü tahmin"
                  },
                  {
                    "id": "wp2",
                    "left": "Don't worry, I will keep your secret.",
                    "right": "Söz verme (Promise)"
                  },
                  {
                    "id": "wp3",
                    "left": "We are going to visit Paris next month.",
                    "right": "Önceden planlanmış seyahat"
                  }
                ]
              },
              {
                "id": "dil-q-wl3",
                "type": "multiple_choice",
                "prompt": "'They _____ (not / come) to the party because they are sick.' cümlesinde 'will' olumsuzu hangisidir?",
                "difficulty": "kolay",
                "explanation": "Will not kısaltması 'won't' şeklindedir: 'They won't come to the party.'",
                "options": [
                  {
                    "id": "wnt1",
                    "text": "won't come",
                    "isCorrect": true
                  },
                  {
                    "id": "wnt2",
                    "text": "don't come",
                    "isCorrect": false
                  },
                  {
                    "id": "wnt3",
                    "text": "didn't came",
                    "isCorrect": false
                  },
                  {
                    "id": "wnt4",
                    "text": "aren't came",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-wl4",
                "type": "true_false",
                "prompt": "'Will' tüm öznelerde aynı mıdır?",
                "statement": "'Will' modal yardımcı fiili I, you, he, she, we, they gibi tüm öznelerde aynı şekilde kullanılır; -s takısı almaz.",
                "correctAnswer": true,
                "explanation": "Doğrudur! He will, she will, they will hepsi aynıdır."
              }
            ]
          },
          {
            "id": "dil-u5-l2",
            "unitId": "dil-u5",
            "title": "Modal Verbs (Can, Must, Should)",
            "description": "Yetenek (can), zorunluluk (must), yasak (mustn't) ve tavsiye (should).",
            "xpReward": 30,
            "gemReward": 8,
            "type": "lesson",
            "summaryNotes": [
              "Must: Güçlü zorunluluk / gereklilik: 'You must stop at red light.'",
              "Mustn't: Kesin yasak: 'You mustn't smoke here.'",
              "Should: Tavsiye / öneri: 'You should drink more water.'",
              "Modal fiillerden sonra gelen asıl fiil daima YALIN (V1) haldedir."
            ],
            "questions": [
              {
                "id": "dil-q-md1",
                "type": "multiple_choice",
                "prompt": "'You look very tired. You _____ take a rest and sleep early.' cümlesindeki tavsiye için hangisi gelmelidir?",
                "difficulty": "kolay",
                "explanation": "Tavsiye ve öğüt bildirmek için 'should' kullanılır: 'You should take a rest.'",
                "options": [
                  {
                    "id": "md1_a",
                    "text": "should",
                    "isCorrect": true
                  },
                  {
                    "id": "md1_b",
                    "text": "mustn't",
                    "isCorrect": false
                  },
                  {
                    "id": "md1_c",
                    "text": "can't",
                    "isCorrect": false
                  },
                  {
                    "id": "md1_d",
                    "text": "have to not",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-md2",
                "type": "matching",
                "prompt": "Modal fiilleri işlevleriyle eşleştiriniz:",
                "difficulty": "orta",
                "explanation": "Must zorunluluk, Mustn't yasak, Should tavsiye, Can yetenek bildirir.",
                "pairs": [
                  {
                    "id": "mp1",
                    "left": "must",
                    "right": "Zorunluluk ve kesin kural"
                  },
                  {
                    "id": "mp2",
                    "left": "mustn't",
                    "right": "Kesin yasaklama"
                  },
                  {
                    "id": "mp3",
                    "left": "should",
                    "right": "Tavsiye ve öğüt"
                  }
                ]
              },
              {
                "id": "dil-q-md3",
                "type": "multiple_choice",
                "prompt": "'You _____ use your phone during the takeoff and landing of the airplane! It is forbidden.' cümlesine hangisi gelmelidir?",
                "difficulty": "orta",
                "explanation": "Uçakta telefon kullanımı katı bir yasaktır; bu nedenle 'mustn't' (yasak) kullanılır.",
                "options": [
                  {
                    "id": "mst1",
                    "text": "mustn't",
                    "isCorrect": true
                  },
                  {
                    "id": "mst2",
                    "text": "should",
                    "isCorrect": false
                  },
                  {
                    "id": "mst3",
                    "text": "can",
                    "isCorrect": false
                  },
                  {
                    "id": "mst4",
                    "text": "don't have to",
                    "isCorrect": false
                  }
                ]
              },
              {
                "id": "dil-q-md4",
                "type": "true_false",
                "prompt": "Modal fiillerden sonra gelen fiile 'to' veya '-ing' gelir mi?",
                "statement": "Must, should, can gibi modal yardımcı fiillerinden sonra gelen ana fiil 'to' veya '-ing' almaz; doğrudan yalın halde (bare infinitive) kullanılır.",
                "correctAnswer": true,
                "explanation": "Doğrudur! 'You must to go' yanlıştır, 'You must go' doğrudur."
              }
            ]
          }
        ]
      }
    ]
  }
,
{
  "id": "dil_alm",
  "name": "Almanca (A1 - C2)",
  "subTitle": "Goethe & Telc Hazırlık, Gramer & Günlük Konuşma",
  "icon": "🇩🇪",
  "badge": "Avrupa Dili",
  "color": "#eab308",
  "accentColor": "#ca8a04",
  "units": [
    {
      "id": "alm-u1",
      "number": 1,
      "title": "A1: Begrüßung & Sich Vorstellen",
      "description": "Almanca selamlaşma, kendini tanıtma, sayılar ve artikeller (der, die, das)",
      "color": "#eab308",
      "lessons": [
        {
          "id": "alm-u1-l1",
          "unitId": "alm-u1",
          "title": "Hallo! Wie geht's?",
          "description": "Temel diyaloglar ve kişisel zamirler.",
          "xpReward": 20,
          "gemReward": 5,
          "type": "lesson",
          "summaryNotes": [
            "'Guten Tag' = İyi günler, 'Auf Wiedersehen' = Hoşça kalın (resmi).",
            "'Wie heißen Sie?' = İsminiz nedir? (Resmi), 'Ich heiße...' = Benim adım...",
            "Artikeller: der (eril), die (dişil), das (nötr)."
          ],
          "questions": [
            {
              "id": "alm-q1",
              "type": "multiple_choice",
              "prompt": "'Wie geht es Ihnen?' sorusuna resmi ve kibar bir karşılık hangisidir?",
              "difficulty": "kolay",
              "explanation": "'Danke, mir geht es gut. Und Ihnen?' = Teşekkürler, iyiyim. Ya siz?",
              "options": [
                {
                  "id": "ao1",
                  "text": "Danke, mir geht es gut. Und Ihnen?",
                  "isCorrect": true
                },
                {
                  "id": "ao2",
                  "text": "Ich bin zwanzig Jahre alt.",
                  "isCorrect": false
                },
                {
                  "id": "ao3",
                  "text": "Auf Wiedersehen!",
                  "isCorrect": false
                },
                {
                  "id": "ao4",
                  "text": "Nein, danke.",
                  "isCorrect": false
                }
              ]
            },
            {
              "id": "alm-q2",
              "type": "matching",
              "prompt": "Almanca artikelleri doğru cinsiyetle eşleştirin:",
              "difficulty": "kolay",
              "explanation": "der = eril (maskulin), die = dişil (feminin), das = nötr (neutral).",
              "pairs": [
                {
                  "id": "ap1",
                  "left": "der Tisch (Masa)",
                  "right": "Eril (Maskulin)"
                },
                {
                  "id": "ap2",
                  "left": "die Sonne (Güneş)",
                  "right": "Dişil (Feminin)"
                },
                {
                  "id": "ap3",
                  "left": "das Buch (Kitap)",
                  "right": "Nötr (Neutral)"
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "alm-u2",
      "number": 2,
      "title": "B1 - B2: Konjunktiv II & Berufsleben",
      "description": "Dilek kipi (wäre/hätte), Passiv cümleler ve iş hayatı",
      "color": "#ca8a04",
      "lessons": [
        {
          "id": "alm-u2-l1",
          "unitId": "alm-u2",
          "title": "Konjunktiv II: Wenn ich Zeit hätte...",
          "description": "Keşkeler, hayali durumlar ve nazik ricalar.",
          "xpReward": 30,
          "gemReward": 8,
          "type": "lesson",
          "summaryNotes": [
            "'Wenn ich mehr Zeit hätte, würde ich mehr reisen.' = Daha çok zamanım olsaydı, daha çok seyahat ederdim.",
            "'Könnten Sie mir bitte helfen?' = Bana yardımcı olabilir miydiniz lütfen?"
          ],
          "questions": [
            {
              "id": "alm-b1-q1",
              "type": "multiple_choice",
              "prompt": "'Wenn ich reich ______, ______ ich eine Weltreise machen.' Cümlesini tamamlayın:",
              "difficulty": "orta",
              "explanation": "sein fiilinin Konjunktiv II hali 'wäre', yapmak fiilinin yardımcı kalıbı 'würde' kullanılır.",
              "options": [
                {
                  "id": "bo1",
                  "text": "wäre / würde",
                  "isCorrect": true
                },
                {
                  "id": "bo2",
                  "text": "bin / werde",
                  "isCorrect": false
                },
                {
                  "id": "bo3",
                  "text": "hätte / würde",
                  "isCorrect": false
                },
                {
                  "id": "bo4",
                  "text": "war / hatte",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "alm-u3",
      "number": 3,
      "title": "C1 - C2: Nomen-Verb-Verbindungen & Usta Seviye (PRO)",
      "description": "Akademik metinler, üst düzey kalıp fiiller ve ileri dil bilgisi",
      "color": "#a16207",
      "isPremiumOnly": true,
      "lessons": [
        {
          "id": "alm-u3-l1",
          "unitId": "alm-u3",
          "title": "Feste Wendungen & Stilistik",
          "description": "'Zur Verfügung stehen', 'In Betracht ziehen' gibi C1/C2 kalıpları.",
          "xpReward": 40,
          "gemReward": 15,
          "type": "lesson",
          "summaryNotes": [
            "'In Betracht ziehen' = Göz önünde bulundurmak / Dikkate almak (berücksichtigen).",
            "'Zur Verfügung stehen' = Kullanıma hazır olmak."
          ],
          "questions": [
            {
              "id": "alm-c1-q1",
              "type": "multiple_choice",
              "prompt": "'Wir müssen alle Möglichkeiten in Betracht ______.' Boşluğa hangi fiil gelir?",
              "difficulty": "zor",
              "explanation": "'in Betracht ziehen' sabit bir kalıp fiildir (Nomen-Verb-Verbindung).",
              "options": [
                {
                  "id": "co1",
                  "text": "ziehen",
                  "isCorrect": true
                },
                {
                  "id": "co2",
                  "text": "nehmen",
                  "isCorrect": false
                },
                {
                  "id": "co3",
                  "text": "bringen",
                  "isCorrect": false
                },
                {
                  "id": "co4",
                  "text": "stellen",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    }
  ]
},
{
  "id": "dil_fra",
  "name": "Fransızca (A1 - C2)",
  "subTitle": "DELF & DALF Hazırlık, Akıcı Telaffuz & Kültür",
  "icon": "🇫🇷",
  "badge": "Diplomasi Dili",
  "color": "#6366f1",
  "accentColor": "#4f46e5",
  "units": [
    {
      "id": "fra-u1",
      "number": 1,
      "title": "A1: Bonjour & Premiers Pas",
      "description": "Fransızca tanışma, être/avoir fiilleri ve temel diyaloglar",
      "color": "#6366f1",
      "lessons": [
        {
          "id": "fra-u1-l1",
          "unitId": "fra-u1",
          "title": "Salutations & Présentation",
          "description": "Bonjour, Enchanté, Je m'appelle ve temel selamlaşmalar.",
          "xpReward": 20,
          "gemReward": 5,
          "type": "lesson",
          "summaryNotes": [
            "'Enchanté(e)' = Tanıştığıma memnun oldum.",
            "'Comment allez-vous ?' = Nasılsınız? (Resmi), 'Ça va ?' = Nasıl gidiyor? (Samimi).",
            "Être (olmak): Je suis, Tu es, Il/Elle est."
          ],
          "questions": [
            {
              "id": "fra-q1",
              "type": "multiple_choice",
              "prompt": "'Comment vous appelez-vous ?' sorusuna doğru yanıt hangisidir?",
              "difficulty": "kolay",
              "explanation": "'Je m'appelle...' = Benim adım...",
              "options": [
                {
                  "id": "fo1",
                  "text": "Je m'appelle Lucas.",
                  "isCorrect": true
                },
                {
                  "id": "fo2",
                  "text": "J'ai vingt ans.",
                  "isCorrect": false
                },
                {
                  "id": "fo3",
                  "text": "Je suis français.",
                  "isCorrect": false
                },
                {
                  "id": "fo4",
                  "text": "Très bien, merci.",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "fra-u2",
      "number": 2,
      "title": "B1 - B2: Le Subjonctif & L'Argumentation",
      "description": "Dilek kipi, tartışma teknikleri ve bağlaçlar",
      "color": "#4f46e5",
      "lessons": [
        {
          "id": "fra-u2-l1",
          "unitId": "fra-u2",
          "title": "Le Subjonctif Présent",
          "description": "İstek, şüphe ve zorunluluk bildiren kipler.",
          "xpReward": 30,
          "gemReward": 8,
          "type": "lesson",
          "summaryNotes": [
            "'Il faut que tu fasses tes devoirs.' = Ödevlerini yapman gerekir.",
            "'Bien que' bağlacı her zaman subjonctif gerektirir."
          ],
          "questions": [
            {
              "id": "fra-b1-q1",
              "type": "multiple_choice",
              "prompt": "'Il est important que vous ______ à l'heure.' (être fiili)",
              "difficulty": "orta",
              "explanation": "Subjonctif 'vous' çekimi: soyez.",
              "options": [
                {
                  "id": "fbo1",
                  "text": "soyez",
                  "isCorrect": true
                },
                {
                  "id": "fbo2",
                  "text": "êtes",
                  "isCorrect": false
                },
                {
                  "id": "fbo3",
                  "text": "serez",
                  "isCorrect": false
                },
                {
                  "id": "fbo4",
                  "text": "étiez",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "fra-u3",
      "number": 3,
      "title": "C1 - C2: DALF & Style Soutenu (PRO)",
      "description": "Edebi anlatım, ileri retorik ve atasözleri",
      "color": "#3730a3",
      "isPremiumOnly": true,
      "lessons": [
        {
          "id": "fra-u3-l1",
          "unitId": "fra-u3",
          "title": "Le Passé Simple & Subjonctif Imparfait",
          "description": "Edebi metinlerde kullanılan yüksek seviye zamanlar.",
          "xpReward": 40,
          "gemReward": 15,
          "type": "lesson",
          "summaryNotes": [
            "Fût-ce = öyle olsa bile (yüksek edebi stil).",
            "'Avoir le cœur sur la main' = Çok cömert olmak."
          ],
          "questions": [
            {
              "id": "fra-c1-q1",
              "type": "multiple_choice",
              "prompt": "'Avoir le cœur sur la main' deyimi ne anlama gelir?",
              "difficulty": "zor",
              "explanation": "Fransızcada 'kalbi avucunda olmak', son derece cömert ve yardımsever insanları tanımlar.",
              "options": [
                {
                  "id": "fco1",
                  "text": "Çok cömert ve iyiliksever olmak",
                  "isCorrect": true
                },
                {
                  "id": "fco2",
                  "text": "Çok korkak olmak",
                  "isCorrect": false
                },
                {
                  "id": "fco3",
                  "text": "Kalp hastası olmak",
                  "isCorrect": false
                },
                {
                  "id": "fco4",
                  "text": "Aceleci davranmak",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    }
  ]
},
{
  "id": "dil_isp",
  "name": "İspanyolca (A1 - C2)",
  "subTitle": "DELE Hazırlık, Latin Amerika & İspanya Kültürü",
  "icon": "🇪🇸",
  "badge": "Popüler Dil",
  "color": "#ea580c",
  "accentColor": "#c2410c",
  "units": [
    {
      "id": "isp-u1",
      "number": 1,
      "title": "A1: ¡Hola! & Primeros Pasos",
      "description": "İspanyolca selamlaşma, Ser ve Estar farkı, günlük kelimeler",
      "color": "#ea580c",
      "lessons": [
        {
          "id": "isp-u1-l1",
          "unitId": "isp-u1",
          "title": "Saludos & Presentaciones",
          "description": "¡Hola! ¿Cómo estás?, Mucho gusto kalıpları.",
          "xpReward": 20,
          "gemReward": 5,
          "type": "lesson",
          "summaryNotes": [
            "'Mucho gusto' = Tanıştığıma çok memnun oldum.",
            "'Ser' kalıcı özellikleri (kimlik, milliyet), 'Estar' geçici durumları (ruh hali, konum) ifade eder.",
            "¿De dónde eres? = Nerelisin? (Soy de Turquía)."
          ],
          "questions": [
            {
              "id": "isp-q1",
              "type": "multiple_choice",
              "prompt": "'¿Cómo estás?' sorusuna en doğal yanıt hangisidir?",
              "difficulty": "kolay",
              "explanation": "'Muy bien, gracias. ¿Y tú?' = Çok iyiyim teşekkürler. Ya sen?",
              "options": [
                {
                  "id": "io1",
                  "text": "Muy bien, gracias. ¿Y tú?",
                  "isCorrect": true
                },
                {
                  "id": "io2",
                  "text": "Me llamo Carlos.",
                  "isCorrect": false
                },
                {
                  "id": "io3",
                  "text": "Tengo veinte años.",
                  "isCorrect": false
                },
                {
                  "id": "io4",
                  "text": "Adiós.",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "isp-u2",
      "number": 2,
      "title": "B1 - B2: Subjuntivo & Cláusulas con Si",
      "description": "Dilek kipi, varsayımlar ve akıcı sohbet",
      "color": "#c2410c",
      "lessons": [
        {
          "id": "isp-u2-l1",
          "unitId": "isp-u2",
          "title": "Subjuntivo Presente",
          "description": "Duygular, istekler ve belirsizlikler (Ojalá, Quiero que...).",
          "xpReward": 30,
          "gemReward": 8,
          "type": "lesson",
          "summaryNotes": [
            "'Espero que tengas un buen día.' = Umarım güzel bir gün geçirirsin.",
            "'Ojalá' = İnşallah / Keşke (Subjuntivo ile kullanılır)."
          ],
          "questions": [
            {
              "id": "isp-b1-q1",
              "type": "multiple_choice",
              "prompt": "'Quiero que tú ______ a mi fiesta.' (venir fiili)",
              "difficulty": "orta",
              "explanation": "'querer que' yapısından sonra subjuntivo 'vengas' gelir.",
              "options": [
                {
                  "id": "ibo1",
                  "text": "vengas",
                  "isCorrect": true
                },
                {
                  "id": "ibo2",
                  "text": "vienes",
                  "isCorrect": false
                },
                {
                  "id": "ibo3",
                  "text": "vendrás",
                  "isCorrect": false
                },
                {
                  "id": "ibo4",
                  "text": "veniste",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "isp-u3",
      "number": 3,
      "title": "C1 - C2: Maestría & Refranes (PRO)",
      "description": "Deyimsel ustalık, edebiyat ve anadil seviyesi nüanslar",
      "color": "#9a3412",
      "isPremiumOnly": true,
      "lessons": [
        {
          "id": "isp-u3-l1",
          "unitId": "isp-u3",
          "title": "Refranes & Giros Lingüísticos",
          "description": "İleri İspanyolca atasözleri ve edebi ifadeler.",
          "xpReward": 40,
          "gemReward": 15,
          "type": "lesson",
          "summaryNotes": [
            "'Más vale pájaro en mano que ciento volando' = Eldeki bir kuş daldaki yüz kuştan iyidir.",
            "'Estar en las nubes' = Dalgın olmak / Hayal aleminde olmak."
          ],
          "questions": [
            {
              "id": "isp-c1-q1",
              "type": "multiple_choice",
              "prompt": "'Estar en las nubes' deyimi hangi anlamda kullanılır?",
              "difficulty": "zor",
              "explanation": "İspanyolcada bulutlarda olmak dalgın, aklı başka yerde olan kişileri tanımlar.",
              "options": [
                {
                  "id": "ico1",
                  "text": "Dalgın veya hayallere dalmış olmak",
                  "isCorrect": true
                },
                {
                  "id": "ico2",
                  "text": "Çok zengin olmak",
                  "isCorrect": false
                },
                {
                  "id": "ico3",
                  "text": "Uçak yolculuğu yapmak",
                  "isCorrect": false
                },
                {
                  "id": "ico4",
                  "text": "Çok sinirli olmak",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    }
  ]
},
{
  "id": "dil_bos",
  "name": "Boşnakça (A1 - C2)",
  "subTitle": "Balkan Dilleri, Günlük Konuşma & Gramer",
  "icon": "🇧🇦",
  "badge": "Balkan Dili",
  "color": "#2563eb",
  "accentColor": "#1d4ed8",
  "units": [
    {
      "id": "bos-u1",
      "number": 1,
      "title": "A1: Dobar Dan & Upoznavanje",
      "description": "Boşnakça selamlaşma, kendini tanıtma ve temel kalıplar",
      "color": "#2563eb",
      "lessons": [
        {
          "id": "bos-u1-l1",
          "unitId": "bos-u1",
          "title": "Pozdravi & Osnovne Rečenice",
          "description": "Dobar dan, Kako ste, Hvala lijepa kalıpları.",
          "xpReward": 20,
          "gemReward": 5,
          "type": "lesson",
          "summaryNotes": [
            "'Dobar dan' = İyi günler, 'Dobro jutro' = Günaydın.",
            "'Kako ste?' = Nasılsınız? (Resmi), 'Kako si?' = Nasılsın? (Samimi).",
            "'Drago mi je' = Memnun oldum."
          ],
          "questions": [
            {
              "id": "bos-q1",
              "type": "multiple_choice",
              "prompt": "'Kako ste?' sorusuna en yaygın ve nazik yanıt hangisidir?",
              "difficulty": "kolay",
              "explanation": "'Dobro sam, hvala. A vi?' = İyiyim, teşekkürler. Ya siz?",
              "options": [
                {
                  "id": "bo1",
                  "text": "Dobro sam, hvala. A vi?",
                  "isCorrect": true
                },
                {
                  "id": "bo2",
                  "text": "Zovem se Mirza.",
                  "isCorrect": false
                },
                {
                  "id": "bo3",
                  "text": "Doviđenja!",
                  "isCorrect": false
                },
                {
                  "id": "bo4",
                  "text": "Nema na čemu.",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "bos-u2",
      "number": 2,
      "title": "B1 - B2: Padeži & Složene Rečenice",
      "description": "Boşnakça 7 ismin hali (padeži) ve akıcı konuşma",
      "color": "#1d4ed8",
      "lessons": [
        {
          "id": "bos-u2-l1",
          "unitId": "bos-u2",
          "title": "7 Padeža (İsmin Halleri)",
          "description": "Nominativ, Genitiv, Dativ, Akuzativ, Vokativ, Instrumental, Lokativ.",
          "xpReward": 30,
          "gemReward": 8,
          "type": "lesson",
          "summaryNotes": [
            "Vokativ = Seslenme halidir: Prijatelj -> Prijatelju! (Ey dostum / Arkadaşım!).",
            "Lokativ yer bildirmede 'u' veya 'na' edatlarıyla kullanılır: u Sarajevu."
          ],
          "questions": [
            {
              "id": "bos-b1-q1",
              "type": "multiple_choice",
              "prompt": "'Sarajevo' kelimesi 'Sarajevo\\'da yaşıyorum' derken Lokativ halinde nasıl çekimlenir?",
              "difficulty": "orta",
              "explanation": "Boşnakçada Lokativ halinde 'Živim u Sarajevu' denir.",
              "options": [
                {
                  "id": "bbo1",
                  "text": "u Sarajevu",
                  "isCorrect": true
                },
                {
                  "id": "bbo2",
                  "text": "u Sarajevo",
                  "isCorrect": false
                },
                {
                  "id": "bbo3",
                  "text": "sa Sarajevom",
                  "isCorrect": false
                },
                {
                  "id": "bbo4",
                  "text": "od Sarajeva",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    },
    {
      "id": "bos-u3",
      "number": 3,
      "title": "C1 - C2: Majstorski Jezik & Idiomi (PRO)",
      "description": "İleri Balkan edebiyatı, atasözleri ve usta seviye",
      "color": "#1e40af",
      "isPremiumOnly": true,
      "lessons": [
        {
          "id": "bos-u3-l1",
          "unitId": "bos-u3",
          "title": "Idiomi & Mudrosti",
          "description": "Boşnakça zengin deyim ve felsefi deyişler.",
          "xpReward": 40,
          "gemReward": 15,
          "type": "lesson",
          "summaryNotes": [
            "'Gledati kroz prste' = Hoşgörmek / Kusurları görmezden gelmek.",
            "'Biti na konju' = İşi yoluna koymuş, başarılı olmak."
          ],
          "questions": [
            {
              "id": "bos-c1-q1",
              "type": "multiple_choice",
              "prompt": "'Gledati kroz prste' deyimi Boşnakçada ne anlama gelir?",
              "difficulty": "zor",
              "explanation": "Parmakların arasından bakmak, hataları görmezden gelip hoşgörmek anlamına gelir.",
              "options": [
                {
                  "id": "bco1",
                  "text": "Kusurları hoşgörmek / Görmezden gelmek",
                  "isCorrect": true
                },
                {
                  "id": "bco2",
                  "text": "Çok dikkatli incelemek",
                  "isCorrect": false
                },
                {
                  "id": "bco3",
                  "text": "Utanıp yüzünü kapatmak",
                  "isCorrect": false
                },
                {
                  "id": "bco4",
                  "text": "Korkarak bakmak",
                  "isCorrect": false
                }
              ]
            }
          ]
        }
      ]
    }
  ]
}
];