import { Course, MultipleChoiceQuestion } from '../types';
import { RegionCode } from '../i18n/locale';
import { buildCourse, RawCourseInput } from '../utils/courseBuilder';

function mc(
  id: string,
  prompt: string,
  options: string[],
  correctIndex: number,
  explanation: string
): MultipleChoiceQuestion {
  return {
    id,
    type: 'multiple_choice',
    prompt,
    explanation,
    options: options.map((text, idx) => ({
      id: `${id}_opt_${idx}`,
      text,
      isCorrect: idx === correctIndex,
    })),
  };
}

export function getDrivingLicenseCourse(region: RegionCode): Course {
  return buildCourse(getRawDrivingCourse(region));
}

function getRawDrivingCourse(region: RegionCode): RawCourseInput {
  switch (region) {
    case 'TR':
      return {
        id: 'ehliyet',
        title: 'Ehliyet Sınavı (Araba B & Motor A)',
        description: '2026 MEB e-Sınav Güncel Trafik, Motor ve İlk Yardım Testleri',
        icon: '🚗',
        badge: '2026 MEB Resmi',
        color: 'from-rose-500 to-red-600',
        accentColor: '#e11d48',
        units: [
          {
            id: 'ehliyet-tr-car',
            title: 'B Sınıfı Otomobil & Trafik Kuralları',
            description: 'Trafik İşaretleri, Hız Limitleri, Geçiş Üstünlüğü ve İlk Yardım',
            color: '#e11d48',
            lessons: [
              {
                id: 'ehliyet-tr-b1',
                title: 'Trafik & Hız Kuralları (Otomobil B)',
                description: 'Güncel 2026 MEB e-Sınav soruları',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'tr-car-1',
                    'Otomobillerin (B sınıfı) otoyollardaki azami hız sınırı Türkiye genelinde kaç km/saattir (aksine işaret yoksa)?',
                    ['110 km/sa', '120 km/sa', '130 km/sa', '140 km/sa'],
                    2,
                    'Karayolları Genel Müdürlüğü ve KGM otoyollarında otomobiller için azami hız limiti 130 km/sa (KGM devlet otoyolları) ve Yap-İşlet-Devret otoyollarında 140 km/sa olarak güncellenmiştir; standart MEB e-sınav sorusunda devlet otoyolu 130 km/sa kabul edilir.'
                  ),
                  mc(
                    'tr-car-2',
                    'Kavşaklarda geçiş hakkı sırasına göre aşağıdakilerden hangisi diğerlerine göre İLK geçiş hakkına sahiptir?',
                    ['İtfaiye aracı', 'Ambulans / Can kurtaran', 'Polis aracı', 'Sivil savunma aracı'],
                    1,
                    'Geçiş üstünlüğüne sahip araçların karşılaşmasında sıralama: 1) Can kurtaran (Ambulans), 2) İtfaiye, 3) Polis / Zabıta, 4) Sivil Savunma şeklindedir.'
                  ),
                  mc(
                    'tr-car-3',
                    'Yetişkinlerde temel yaşam desteği (kalp masajı) uygulanırken göğüs kemiği kaç cm aşağı inecek şekilde bası yapılır?',
                    ['2 cm', '3 cm', '5 cm', '8 cm'],
                    2,
                    'Güncel ilk yardım protokolüne göre yetişkinlerde 30 kalp basısı / 2 suni solunum oranıyla göğüs kafesi 5 cm (göğüs yüksekliğinin 1/3’ü) çöktürülür.'
                  ),
                  mc(
                    'tr-car-4',
                    'Hususi otomobillerde ilk muayene kaç yıl sonra ve sonrasında kaç yılda bir yapılır?',
                    ['İlk 2 yıl, sonra yılda 1', 'İlk 3 yıl, sonra 2 yılda 1', 'Her yıl', 'İlk 5 yıl, sonra 2 yılda 1'],
                    1,
                    'B sınıfı hususi otomobiller ilk 3 yaş sonunda ve devamında her 2 yılda bir TÜVTÜRK periyodik muayenesine girer.'
                  ),
                ],
              },
            ],
          },
          {
            id: 'ehliyet-tr-moto',
            title: 'A / A2 Sınıfı Motosiklet & Araç Tekniği',
            description: 'Motosiklet Sürüş Güvenliği, Koruyucu Ekipman ve Motor Bilgisi',
            color: '#f97316',
            lessons: [
              {
                id: 'ehliyet-tr-a1',
                title: 'Motosiklet Güvenliği & Motor Tekniği (A1/A2/A)',
                description: 'Motosiklet ehliyeti özel soruları',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'tr-moto-1',
                    'Motosikletlerde viraj dönerken ve ani duruşlarda frenleme nasıl uygulanmalıdır?',
                    [
                      'Sadece arka fren sonuna kadar sıkılmalıdır',
                      'Ön ve arka fren dengeli şekilde (%70 ön, %30 arka) uygulanmalıdır',
                      'Viraj içinde ani ön fren yapılmalıdır',
                      'Sadece motor kompresyonu kullanılmalıdır',
                    ],
                    1,
                    'Motosiklette ağırlık transferi öne doğru olduğu için durma gücünün yaklaşık %70’i ön frenden, %30’u arka frenden dengeli şekilde alınır.'
                  ),
                  mc(
                    'tr-moto-2',
                    '4 zamanlı benzinli bir motosiklet veya otomobil motorunda yakıt-hava karışımını ateşleyen parça hangisidir?',
                    ['Enjektör', 'Buji', 'Alternatör', 'Radyatör'],
                    1,
                    'Benzinli motorlarda sıkıştırma zamanı sonunda yakıt-hava karışımını buji ateşler.'
                  ),
                  mc(
                    'tr-moto-3',
                    'Motosiklet sürücülerinin trafikte görünürlüğünü ve güvenliğini en çok artıran zorunlu ekipman aşağıdakilerden hangisidir?',
                    ['Sadece güneş gözlüğü', 'ECE R22.05 / 22.06 onaylı kask ve reflektörlü koruyucu mont', 'Açık parmaklı eldiven', 'Kulaklık'],
                    1,
                    'Kask yasal olarak zorunludur; ECE onaylı tam/çene açılır kask, korumalı mont, eldiven ve bot ölümcül yaralanma riskini ciddi oranda düşürür.'
                  ),
                ],
              },
            ],
          },
        ],
      };

    case 'FR':
      return {
        id: 'ehliyet',
        title: 'Code de la route (Permis B & Moto ETM)',
        description: '2026 Entraînement Officiel Sécurité Routière (Voiture B & Moto A)',
        icon: '🚗',
        badge: '2026 Code Officiel',
        color: 'from-blue-600 to-indigo-700',
        accentColor: '#2563eb',
        units: [
          {
            id: 'ehliyet-fr-car',
            title: 'Permis B (Voiture) — Code de la route',
            description: 'Priorités, vitesses, alcoolémie et signalisation en France',
            color: '#2563eb',
            lessons: [
              {
                id: 'ehliyet-fr-b1',
                title: 'Règles de circulation & Vitesses (Permis B)',
                description: 'Questions officielles ETG 2026',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'fr-car-1',
                    'En France, quelle est la vitesse maximale autorisée sur autoroute par temps de pluie pour un conducteur confirmé ?',
                    ['130 km/h', '110 km/h', '100 km/h', '90 km/h'],
                    1,
                    'Par temps de pluie ou de précipitations, la vitesse sur autoroute est abaissée de 130 km/h à 110 km/h (et 100 km/h pour les jeunes conducteurs).'
                  ),
                  mc(
                    'fr-car-2',
                    'Quel est le taux maximal d’alcoolémie autorisé pour un jeune conducteur en période probatoire ?',
                    ['0,5 g/L de sang', '0,2 g/L de sang', '0,8 g/L de sang', '0,4 g/L de sang'],
                    1,
                    'Pour les titulaires d’un permis probatoire, la limite légale est de 0,2 g/L dans le sang (soit 0 verre d’alcool).'
                  ),
                  mc(
                    'fr-car-3',
                    'À une intersection sans panneau ni marquage au sol en agglomération, quelle règle s’applique ?',
                    ['Priorité à gauche', 'Priorité à droite', 'Le véhicule le plus rapide passe', 'Stop obligatoire'],
                    1,
                    'En l’absence de signalisation, la règle générale en France est la priorité à droite.'
                  ),
                ],
              },
            ],
          },
          {
            id: 'ehliyet-fr-moto',
            title: 'Permis Moto A1 / A2 / A (ETM)',
            description: 'Équipement obligatoire, trajectoire de sécurité et freinage moto',
            color: '#7c3aed',
            lessons: [
              {
                id: 'ehliyet-fr-a1',
                title: 'Épreuve Théorique Moto (ETM 2026)',
                description: 'Réglementation moto en France',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'fr-moto-1',
                    'En France, quels équipements sont légalement obligatoires pour conduire une moto (conducteur et passager) ?',
                    [
                      'Casque homologué et gants certifiés CE',
                      'Uniquement le casque',
                      'Casque et bottes uniquement',
                      'Gilet jaune porté en permanence',
                    ],
                    0,
                    'Le port d’un casque homologué (avec dispositifs réfléchissants) et de gants certifiés CE est strictement obligatoire en France.'
                  ),
                  mc(
                    'fr-moto-2',
                    'Quelle est la trajectoire de sécurité recommandée en virage à moto pour optimiser la visibilité ?',
                    [
                      'Rester tout près du bord droit en permanence',
                      'Entrer à l’extérieur, rester à l’extérieur jusqu’au point de déclenchement puis viser le point de corde',
                      'Couper sur la voie opposée',
                      'Freiner fort dans l’angle maximal',
                    ],
                    1,
                    'La trajectoire de sécurité (EDSR) consiste à rester à l’extérieur du virage avant de plonger vers le point de corde dès que la sortie est visible.'
                  ),
                ],
              },
            ],
          },
        ],
      };

    case 'DE':
      return {
        id: 'ehliyet',
        title: 'Führerschein Theorie (Klasse B & A)',
        description: '2026 StVO / TÜV & DEKRA Prüfungstraining für Auto & Motorrad',
        icon: '🚗',
        badge: '2026 StVO',
        color: 'from-amber-500 to-red-600',
        accentColor: '#d97706',
        units: [
          {
            id: 'ehliyet-de-car',
            title: 'Klasse B (PKW) — StVO & Vorfahrt',
            description: 'Vorfahrtsregeln, Geschwindigkeiten und Sicherheit in Deutschland',
            color: '#d97706',
            lessons: [
              {
                id: 'ehliyet-de-b1',
                title: 'StVO Grundlagen & Vorfahrt (Klasse B)',
                description: 'Aktuelle Prüfungsfragen 2026',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'de-car-1',
                    'Welche Richtgeschwindigkeit gilt auf deutschen Autobahnen für PKW ohne Tempolimit-Schild?',
                    ['100 km/h', '120 km/h', '130 km/h', '150 km/h'],
                    2,
                    'Auf Autobahnen ohne Geschwindigkeitsbegrenzung gilt für PKW eine empfohlene Richtgeschwindigkeit von 130 km/h.'
                  ),
                  mc(
                    'de-car-2',
                    'Welche Promillegrenze gilt in Deutschland für Fahranfänger in der Probezeit (und unter 21 Jahren)?',
                    ['0,5 Promille', '0,3 Promille', '0,0 Promille (absolutes Alkoholverbot)', '0,2 Promille'],
                    2,
                    'Für Fahranfänger in der Probezeit sowie Fahrer unter 21 Jahren gilt in Deutschland strikt die 0,0-Promille-Grenze.'
                  ),
                  mc(
                    'de-car-3',
                    'An einer Kreuzung ohne Verkehrszeichen gilt in Deutschland grundsätzlich:',
                    ['Links vor Rechts', 'Rechts vor Links', 'Schnellere Fahrzeuge zuerst', 'Immer anhalten'],
                    1,
                    'Ohne vorfahrtregelnde Zeichen gilt nach § 8 StVO „Rechts vor Links“.'
                  ),
                ],
              },
            ],
          },
          {
            id: 'ehliyet-de-moto',
            title: 'Klasse A / A2 (Motorrad) — Sicherheit',
            description: 'Schräglage, Bremsweg und Schutzkleidung',
            color: '#dc2626',
            lessons: [
              {
                id: 'ehliyet-de-a1',
                title: 'Motorrad Theorie (Klasse A/A2)',
                description: 'Spezifische Motorradfragen',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'de-moto-1',
                    'Was ist beim Bremsen mit dem Motorrad auf gerader, trockener Straße zu beachten?',
                    [
                      'Nur die Hinterradbremse benutzen',
                      'Vorderrad- und Hinterradbremse gleichzeitig und dosiert einsetzen (Hauptbremskraft vorne)',
                      'Kupplung nie ziehen',
                      'Erst in der Kurve voll bremsen',
                    ],
                    1,
                    'Durch die dynamische Achslastverlagerung übernimmt das Vorderrad beim Bremsen den größten Teil der Verzögerung.'
                  ),
                ],
              },
            ],
          },
        ],
      };

    case 'GB':
      return {
        id: 'ehliyet',
        title: 'UK Driving Theory (DVSA Car & Moto)',
        description: '2026 Official Highway Code, Road Signs & Motorcycle Theory',
        icon: '🚗',
        badge: '2026 DVSA',
        color: 'from-sky-600 to-blue-700',
        accentColor: '#0284c7',
        units: [
          {
            id: 'ehliyet-gb-car',
            title: 'Car Theory Test (Highway Code)',
            description: 'UK Speed Limits, Roundabouts and Stopping Distances',
            color: '#0284c7',
            lessons: [
              {
                id: 'ehliyet-gb-b1',
                title: 'Highway Code Essentials (Car)',
                description: 'DVSA 2026 Practice',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'gb-car-1',
                    'What is the national speed limit on a UK motorway for cars and motorcycles?',
                    ['60 mph', '70 mph', '80 mph', '50 mph'],
                    1,
                    'The national speed limit on UK motorways and dual carriageways for cars and motorcycles is 70 mph unless signed otherwise.'
                  ),
                  mc(
                    'gb-car-2',
                    'When approaching a roundabout in the UK, to whom must you normally give way?',
                    ['Traffic approaching from your left', 'Traffic approaching from your right', 'Only buses', 'Pedestrians on the motorway'],
                    1,
                    'In the UK (left-hand traffic), you must give way to traffic approaching from your right at roundabouts.'
                  ),
                ],
              },
            ],
          },
          {
            id: 'ehliyet-gb-moto',
            title: 'Motorcycle Theory Test (Module 1 & 2)',
            description: 'Lifesaver Checks, Gear & Weather Riding',
            color: '#4f46e5',
            lessons: [
              {
                id: 'ehliyet-gb-a1',
                title: 'Motorcycle Safety & Lifesaver Glance',
                description: 'DVSA Motorcycle Practice',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'gb-moto-1',
                    'Why should you perform a "lifesaver" shoulder glance before changing lanes or turning on a motorcycle?',
                    [
                      'To check for traffic in your blind spot',
                      'To balance the handlebars',
                      'To cool down your helmet',
                      'To signal other drivers',
                    ],
                    0,
                    'Mirrors leave blind spots alongside your motorcycle; a quick over-the-shoulder lifesaver glance ensures the space is clear.'
                  ),
                ],
              },
            ],
          },
        ],
      };

    case 'ES':
      return {
        id: 'ehliyet',
        title: 'Carnet de Conducir DGT (Permiso B & A)',
        description: '2026 Test Oficial DGT para Coche y Motocicleta en España',
        icon: '🚗',
        badge: '2026 DGT',
        color: 'from-red-500 to-amber-600',
        accentColor: '#dc2626',
        units: [
          {
            id: 'ehliyet-es-car',
            title: 'Permiso B (Coche) — Normativa DGT',
            description: 'Límites de velocidad, alcohol y señales en España',
            color: '#dc2626',
            lessons: [
              {
                id: 'ehliyet-es-b1',
                title: 'Test DGT Permiso B 2026',
                description: 'Preguntas oficiales de tráfico',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'es-car-1',
                    'En España, ¿cuál es la velocidad máxima genérica para turismos y motocicletas en autopistas y autovías?',
                    ['100 km/h', '110 km/h', '120 km/h', '130 km/h'],
                    2,
                    'En España, la velocidad máxima genérica para turismos y motocicletas en autopistas y autovías es de 120 km/h.'
                  ),
                  mc(
                    'es-car-2',
                    'En vías urbanas de un único carril por sentido, ¿cuál es el límite general de velocidad en España?',
                    ['20 km/h', '30 km/h', '50 km/h', '40 km/h'],
                    1,
                    'Según la normativa de la DGT, en vías urbanas de un solo carril por sentido el límite general es de 30 km/h.'
                  ),
                ],
              },
            ],
          },
          {
            id: 'ehliyet-es-moto',
            title: 'Permiso A1 / A2 / A (Motocicletas)',
            description: 'Seguridad y normativa específica DGT moto',
            color: '#ea580c',
            lessons: [
              {
                id: 'ehliyet-es-a1',
                title: 'Test Específico Moto DGT',
                description: 'Equipamiento y conducción segura',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'es-moto-1',
                    '¿Qué elemento de seguridad es obligatorio tanto para el conductor como para el pasajero de una motocicleta?',
                    ['Casco de protección homologado', 'Chaqueta de cuero', 'Botas altas', 'Rodilleras'],
                    0,
                    'El uso del casco homologado y correctamente abrochado es obligatorio para conductor y pasajero en todas las vías.'
                  ),
                ],
              },
            ],
          },
        ],
      };

    case 'US':
    case 'GLOBAL':
    default:
      return {
        id: 'ehliyet',
        title: region === 'US' ? "DMV Driver's License (Car & Moto)" : 'Driving License Theory (Car & Moto)',
        description:
          region === 'US'
            ? '2026 Official DMV Class C (Car) & Class M (Motorcycle) Practice Tests'
            : '2026 International Road Rules, Car & Motorcycle Theory Tests',
        icon: '🚗',
        badge: region === 'US' ? '2026 DMV' : '2026 Official',
        color: 'from-rose-500 to-red-600',
        accentColor: '#e11d48',
        units: [
          {
            id: 'ehliyet-us-car',
            title: region === 'US' ? 'DMV Class C — Car Written Test' : 'Car Theory & Road Signs',
            description: 'Right-of-Way, School Buses, Speed Limits & Safe Driving',
            color: '#e11d48',
            lessons: [
              {
                id: 'ehliyet-us-b1',
                title: 'Road Rules & Right-of-Way (Car)',
                description: '2026 Official DMV Practice',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'us-car-1',
                    'At a 4-way STOP intersection, two vehicles arrive at the exact same time. Who has the right-of-way?',
                    [
                      'The vehicle on the left',
                      'The vehicle on the right',
                      'The larger vehicle',
                      'Whoever flashes their headlights first',
                    ],
                    1,
                    'At an all-way stop, if two vehicles arrive simultaneously, the driver on the left must yield the right-of-way to the vehicle on the right.'
                  ),
                  mc(
                    'us-car-2',
                    'When a school bus stops with flashing red lights and an extended stop arm on an undivided road, you must:',
                    [
                      'Slow down to 15 mph and pass carefully',
                      'Come to a complete stop until the red lights stop flashing',
                      'Honk before passing',
                      'Only stop if children are visible',
                    ],
                    1,
                    'On an undivided highway, traffic in both directions must come to a complete stop when a school bus displays flashing red lights.'
                  ),
                  mc(
                    'us-car-3',
                    'For drivers aged 21 and older in the US, the legal Blood Alcohol Concentration (BAC) limit is:',
                    ['0.05%', '0.08%', '0.10%', '0.12%'],
                    1,
                    'In nearly all US states (0.05% in Utah), 0.08% BAC is the legal threshold for DUI/DWI for drivers 21+.'
                  ),
                ],
              },
            ],
          },
          {
            id: 'ehliyet-us-moto',
            title: region === 'US' ? 'DMV Class M — Motorcycle Test' : 'Motorcycle License Theory',
            description: 'SEE Strategy, Countersteering, Braking & Protective Gear',
            color: '#f97316',
            lessons: [
              {
                id: 'ehliyet-us-a1',
                title: 'Motorcycle Safety & Control (Class M)',
                description: 'MSF / DMV Motorcycle Handbook',
                xpReward: 40,
                gemReward: 15,
                questions: [
                  mc(
                    'us-moto-1',
                    'What percentage of a motorcycle’s total stopping power comes from the front brake?',
                    ['About 30%', 'About 50%', 'About 70% or more', '10%'],
                    2,
                    'Because weight shifts forward during braking, the front brake provides roughly 70% or more of a motorcycle’s stopping power.'
                  ),
                  mc(
                    'us-moto-2',
                    'In the MSF "SEE" strategy for motorcycle riding, what does SEE stand for?',
                    [
                      'Speed, Evade, Exit',
                      'Search, Evaluate, Execute',
                      'Stop, Examine, Enter',
                      'Signal, Eye-contact, Escape',
                    ],
                    1,
                    'SEE stands for Search (for hazards), Evaluate (risks), and Execute (the safest action).'
                  ),
                ],
              },
            ],
          },
        ],
      };
  }
}
