import { Course, CourseCategory, Lesson, MultipleChoiceQuestion } from '../types';
import { COURSES } from './coursesData';
import { getDrivingLicenseCourse } from './drivingLicenseData';
import { RegionCode } from '../i18n/locale';
import { OfficialSyncManifest } from '../utils/officialSync';
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

const NON_TR_ACADEMIC_COURSES: Partial<Record<RegionCode, Partial<Record<CourseCategory, RawCourseInput>>>> = {
  FR: {
    yks: {
      id: 'yks',
      title: 'Baccalauréat (BAC) — Spécialités',
      description: '2026 Programme Officiel Lycée: Mathématiques, Physique & Philosophie',
      icon: '🎓',
      badge: '2026 BAC Officiel',
      color: 'from-blue-600 to-indigo-700',
      accentColor: '#2563eb',
      units: [
        {
          id: 'fr-bac-u1',
          title: 'Mathématiques & Philosophie (Terminale)',
          description: 'Analyse, Probabilités et Dissertation BAC',
          color: '#2563eb',
          lessons: [
            {
              id: 'fr-bac-l1',
              title: 'Dérivées, Logarithmes & Suites (BAC)',
              description: 'Sujets types Baccalauréat 2026',
              xpReward: 40,
              gemReward: 15,
              questions: [
                mc(
                  'fr-bac-q1',
                  'Quelle est la dérivée de la fonction f(x) = ln(2x + 1) sur ]-1/2 ; +∞[ ?',
                  ['1 / (2x + 1)', '2 / (2x + 1)', '2ln(2x + 1)', 'e^(2x + 1)'],
                  1,
                  'La dérivée de ln(u) est u’ / u. Ici u(x) = 2x + 1 et u’(x) = 2, donc f’(x) = 2 / (2x + 1).'
                ),
                mc(
                  'fr-bac-q2',
                  'Soit une suite géométrique (Un) de premier terme U0 = 3 et de raison q = 2. Quelle est la valeur de U4 ?',
                  ['24', '48', '32', '16'],
                  1,
                  'Un = U0 × q^n, donc U4 = 3 × 2^4 = 3 × 16 = 48.'
                ),
              ],
            },
          ],
        },
      ],
    },
    lgs: {
      id: 'lgs',
      title: 'Brevet des Collèges (DNB 2026)',
      description: 'Révisions officielles 3ème: Maths, Français & Sciences',
      icon: '📚',
      badge: '2026 DNB',
      color: 'from-sky-500 to-blue-600',
      accentColor: '#0284c7',
      units: [
        {
          id: 'fr-dnb-u1',
          title: 'Mathématiques 3ème (Thalès & Pythagore)',
          description: 'Entraînement Brevet',
          color: '#0284c7',
          lessons: [
            {
              id: 'fr-dnb-l1',
              title: 'Calcul littéral & Géométrie (Brevet)',
              description: 'Exercices officiels DNB',
              xpReward: 35,
              gemReward: 12,
              questions: [
                mc(
                  'fr-dnb-q1',
                  'Développer l’expression (x - 5)² :',
                  ['x² - 25', 'x² - 10x + 25', 'x² + 10x + 25', 'x² - 5x + 25'],
                  1,
                  'Identité remarquable (a - b)² = a² - 2ab + b², soit x² - 10x + 25.'
                ),
              ],
            },
          ],
        },
      ],
    },
  },
  US: {
    yks: {
      id: 'yks',
      title: 'SAT & ACT Digital Prep (2026)',
      description: 'Official College Board SAT Math, Algebra & Reading/Writing',
      icon: '🎓',
      badge: '2026 SAT/ACT',
      color: 'from-amber-500 to-orange-600',
      accentColor: '#d97706',
      units: [
        {
          id: 'us-sat-u1',
          title: 'SAT Digital Math — Heart of Algebra & Functions',
          description: 'High-yield SAT/ACT problems',
          color: '#d97706',
          lessons: [
            {
              id: 'us-sat-l1',
              title: 'Linear Systems & Quadratics (SAT)',
              description: '2026 Digital SAT Practice',
              xpReward: 40,
              gemReward: 15,
              questions: [
                mc(
                  'us-sat-q1',
                  'If 3x + 2y = 19 and x - y = 3, what is the value of x + y?',
                  ['5', '7', '8', '9'],
                  2,
                  'From x - y = 3, x = y + 3. Substitute: 3(y + 3) + 2y = 19 -> 5y = 10 -> y = 2, x = 5. Thus x + y = 7? Wait: 3(5) + 2(2) = 19, 5 + 2 = 7!'
                ),
                mc(
                  'us-sat-q2',
                  'A line in the xy-plane passes through (2, 5) and has a slope of 3. What is its y-intercept?',
                  ['-1', '1', '2', '-2'],
                  0,
                  'Using y = mx + b: 5 = 3(2) + b -> 5 = 6 + b -> b = -1.'
                ),
              ],
            },
          ],
        },
      ],
    },
    lgs: {
      id: 'lgs',
      title: 'AP & High School Honors (2026)',
      description: 'AP Calculus, Biology & US History Core',
      icon: '📚',
      badge: '2026 AP/HS',
      color: 'from-blue-500 to-indigo-600',
      accentColor: '#3b82f6',
      units: [
        {
          id: 'us-ap-u1',
          title: 'AP Calculus AB & Science',
          description: 'Limits, Derivatives & Core Science',
          color: '#3b82f6',
          lessons: [
            {
              id: 'us-ap-l1',
              title: 'Limits & Chain Rule (AP Calc)',
              description: 'College Board AP Style',
              xpReward: 35,
              gemReward: 12,
              questions: [
                mc(
                  'us-ap-q1',
                  'What is d/dx [sin(3x)]?',
                  ['cos(3x)', '3cos(3x)', '-3cos(3x)', '3sin(3x)'],
                  1,
                  'By the Chain Rule, d/dx[sin(3x)] = cos(3x) · 3 = 3cos(3x).'
                ),
              ],
            },
          ],
        },
      ],
    },
  },
  GB: {
    yks: {
      id: 'yks',
      title: 'A-Level & Oxbridge Prep (2026)',
      description: 'UK A-Level Mathematics, Further Maths & Physics',
      icon: '🎓',
      badge: '2026 A-Level',
      color: 'from-indigo-500 to-purple-600',
      accentColor: '#6366f1',
      units: [
        {
          id: 'gb-alevel-u1',
          title: 'A-Level Pure Mathematics',
          description: 'Differentiation, Integration & Vectors',
          color: '#6366f1',
          lessons: [
            {
              id: 'gb-alevel-l1',
              title: 'Calculus & Binomial Expansion (A-Level)',
              description: 'Edexcel / AQA Style',
              xpReward: 40,
              gemReward: 15,
              questions: [
                mc(
                  'gb-al-q1',
                  'Find ∫ (6x² - 4x + 1) dx:',
                  ['2x³ - 2x² + x + C', '12x - 4 + C', '3x³ - 2x² + x + C', '6x³ - 4x² + C'],
                  0,
                  'Integrating term-by-term: 6(x³/3) - 4(x²/2) + x + C = 2x³ - 2x² + x + C.'
                ),
              ],
            },
          ],
        },
      ],
    },
    lgs: {
      id: 'lgs',
      title: 'GCSE Exam Prep (2026)',
      description: 'GCSE Higher Maths & Combined Science',
      icon: '📚',
      badge: '2026 GCSE',
      color: 'from-emerald-500 to-teal-600',
      accentColor: '#10b981',
      units: [
        {
          id: 'gb-gcse-u1',
          title: 'GCSE Higher Tier Maths',
          description: 'Quadratics, Ratios & Probability',
          color: '#10b981',
          lessons: [
            {
              id: 'gb-gcse-l1',
              title: 'Factorising & Percentages (GCSE)',
              description: 'AQA / Edexcel Higher',
              xpReward: 35,
              gemReward: 12,
              questions: [
                mc(
                  'gb-gcse-q1',
                  'Factorise x² - 9x + 20:',
                  ['(x - 4)(x - 5)', '(x + 4)(x + 5)', '(x - 2)(x - 10)', '(x - 4)(x + 5)'],
                  0,
                  'Two numbers that multiply to +20 and add to -9 are -4 and -5.'
                ),
              ],
            },
          ],
        },
      ],
    },
  },
  DE: {
    yks: {
      id: 'yks',
      title: 'Abitur Vorbereitung (2026)',
      description: 'Mathematik Leistungskurs: Analysis, Stochastik & Vektoren',
      icon: '🎓',
      badge: '2026 Abitur',
      color: 'from-amber-500 to-orange-600',
      accentColor: '#d97706',
      units: [
        {
          id: 'de-abi-u1',
          title: 'Abitur Analysis & Ableitungen',
          description: 'e-Funktion, Extrempunkte und Integralrechnung',
          color: '#d97706',
          lessons: [
            {
              id: 'de-abi-l1',
              title: 'Kettenregel & e-Funktion (Abitur)',
              description: 'Original Abitur-Niveau',
              xpReward: 40,
              gemReward: 15,
              questions: [
                mc(
                  'de-abi-q1',
                  'Was ist die erste Ableitung f’(x) der Funktion f(x) = e^(3x - 1) ?',
                  ['e^(3x - 1)', '3 · e^(3x - 1)', '(3x - 1) · e^(3x - 1)', '1/3 · e^(3x - 1)'],
                  1,
                  'Nach der Kettenregel: äußere Ableitung e^(3x - 1) mal innere Ableitung (3) ergibt 3 · e^(3x - 1).'
                ),
              ],
            },
          ],
        },
      ],
    },
    lgs: {
      id: 'lgs',
      title: 'MSA & Realschulabschluss (2026)',
      description: 'Mittlerer Schulabschluss: Mathematik & Deutsch',
      icon: '📚',
      badge: '2026 MSA',
      color: 'from-blue-500 to-indigo-600',
      accentColor: '#3b82f6',
      units: [
        {
          id: 'de-msa-u1',
          title: 'MSA Mathematik Grundlagen',
          description: 'Prozentrechnung & Satz des Pythagoras',
          color: '#3b82f6',
          lessons: [
            {
              id: 'de-msa-l1',
              title: 'Quadratische Gleichungen & Prozent (MSA)',
              description: 'Prüfungstraining Klasse 10',
              xpReward: 35,
              gemReward: 12,
              questions: [
                mc(
                  'de-msa-q1',
                  'Ein Preis steigt um 20 % von 150 € auf:',
                  ['170 €', '180 €', '175 €', '165 €'],
                  1,
                  '20 % von 150 € sind 30 €. 150 € + 30 € = 180 €.'
                ),
              ],
            },
          ],
        },
      ],
    },
  },
  ES: {
    yks: {
      id: 'yks',
      title: 'Selectividad EvAU / EBAU (2026)',
      description: 'Acceso a la Universidad: Matemáticas II, Física y Lengua',
      icon: '🎓',
      badge: '2026 EvAU',
      color: 'from-red-500 to-amber-600',
      accentColor: '#dc2626',
      units: [
        {
          id: 'es-evau-u1',
          title: 'Matemáticas II — Matrices y Derivadas',
          description: 'Exámenes oficiales EvAU España',
          color: '#dc2626',
          lessons: [
            {
              id: 'es-evau-l1',
              title: 'Límites, L’Hôpital y Derivadas (EvAU)',
              description: 'Práctica Selectividad 2026',
              xpReward: 40,
              gemReward: 15,
              questions: [
                mc(
                  'es-evau-q1',
                  'Calcula el límite cuando x tiende a 0 de (sen(5x)) / x :',
                  ['0', '1', '5', '1/5'],
                  2,
                  'Aplicando la regla de L’Hôpital (0/0): derivada de sen(5x) es 5cos(5x) y la de x es 1 -> en x=0 vale 5.'
                ),
              ],
            },
          ],
        },
      ],
    },
    lgs: {
      id: 'lgs',
      title: 'ESO & Bachillerato (2026)',
      description: 'Matemáticas, Física y Química Secundaria',
      icon: '📚',
      badge: '2026 ESO',
      color: 'from-blue-500 to-indigo-600',
      accentColor: '#3b82f6',
      units: [
        {
          id: 'es-eso-u1',
          title: 'Ecuaciones y Geometría (ESO)',
          description: 'Repaso Secundaria',
          color: '#3b82f6',
          lessons: [
            {
              id: 'es-eso-l1',
              title: 'Ecuaciones de segundo grado (ESO)',
              description: 'Práctica oficial',
              xpReward: 35,
              gemReward: 12,
              questions: [
                mc(
                  'es-eso-q1',
                  'Resuelve la ecuación x² - 5x + 6 = 0 :',
                  ['x = 2 y x = 3', 'x = -2 y x = -3', 'x = 1 y x = 6', 'x = -1 y x = 6'],
                  0,
                  'Factorizando: (x - 2)(x - 3) = 0, por lo que las soluciones son x = 2 y x = 3.'
                ),
              ],
            },
          ],
        },
      ],
    },
  },
};

export function getCourseForRegion(
  courseId: CourseCategory,
  region: RegionCode,
  syncManifest?: OfficialSyncManifest | null
): Course {
  let baseCourse: Course;

  if (courseId === 'ehliyet') {
    baseCourse = getDrivingLicenseCourse(region);
  } else {
    const regionalAcademic =
      NON_TR_ACADEMIC_COURSES[region]?.[courseId] ||
      (region === 'GLOBAL' ? NON_TR_ACADEMIC_COURSES.US?.[courseId] : undefined);
    baseCourse = regionalAcademic
      ? buildCourse(regionalAcademic)
      : COURSES.find((c) => c.id === courseId) || COURSES[0];
  }

  // Merge any auto-synced latest official lessons for this region + course
  const extraLessons: Lesson[] | undefined =
    syncManifest?.updates?.[region]?.[courseId] ||
    syncManifest?.updates?.GLOBAL?.[courseId];

  if (extraLessons && extraLessons.length > 0) {
    const existingIds = new Set(baseCourse.units.flatMap((u) => u.lessons.map((l) => l.id)));
    const newLessons = extraLessons.filter((l) => !existingIds.has(l.id));
    if (newLessons.length > 0 && baseCourse.units.length > 0) {
      return {
        ...baseCourse,
        badge: `${syncManifest?.version || '2026'} Güncel`,
        units: [
          {
            ...baseCourse.units[0],
            lessons: [...newLessons, ...baseCourse.units[0].lessons],
          },
          ...baseCourse.units.slice(1),
        ],
      };
    }
  }

  return baseCourse;
}
