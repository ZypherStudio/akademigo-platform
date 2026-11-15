import { CourseCategory } from '../types';

export type RegionCode = 'TR' | 'US' | 'GB' | 'DE' | 'FR' | 'ES' | 'GLOBAL';
export type AppLang = 'tr' | 'en' | 'de' | 'fr' | 'es';

export interface RegionInfo {
  code: RegionCode;
  flag: string;
  name: string;
  defaultLang: AppLang;
  examSystemName: string;
}

export const REGIONS: RegionInfo[] = [
  { code: 'TR', flag: '🇹🇷', name: 'Türkiye', defaultLang: 'tr', examSystemName: 'YKS / LGS / KPSS' },
  { code: 'US', flag: '🇺🇸', name: 'United States', defaultLang: 'en', examSystemName: 'SAT / ACT / AP' },
  { code: 'GB', flag: '🇬🇧', name: 'United Kingdom', defaultLang: 'en', examSystemName: 'GCSE / A-Level / IELTS' },
  { code: 'DE', flag: '🇩🇪', name: 'Deutschland', defaultLang: 'de', examSystemName: 'Abitur / TestDaF / Goethe' },
  { code: 'FR', flag: '🇫🇷', name: 'France', defaultLang: 'fr', examSystemName: 'Baccalauréat / Brevet / DELF' },
  { code: 'ES', flag: '🇪🇸', name: 'España', defaultLang: 'es', examSystemName: 'EvAU / Selectividad / DELE' },
  { code: 'GLOBAL', flag: '🌍', name: 'Global (International)', defaultLang: 'en', examSystemName: 'SAT / IB / IELTS / TOEFL' },
];

export const LANGUAGES: { code: AppLang; label: string; flag: string }[] = [
  { code: 'tr', label: 'Türkçe', flag: '🇹🇷' },
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
];

const REGION_STORAGE_KEY = 'knowza_region_v1';
const LANG_STORAGE_KEY = 'knowza_lang_v1';

export function detectInitialRegionAndLang(): { region: RegionCode; lang: AppLang } {
  try {
    const savedRegion = localStorage.getItem(REGION_STORAGE_KEY) as RegionCode | null;
    const savedLang = localStorage.getItem(LANG_STORAGE_KEY) as AppLang | null;
    if (savedRegion && REGIONS.some((r) => r.code === savedRegion)) {
      const fallbackLang = REGIONS.find((r) => r.code === savedRegion)!.defaultLang;
      return {
        region: savedRegion,
        lang: savedLang && LANGUAGES.some((l) => l.code === savedLang) ? savedLang : fallbackLang,
      };
    }

    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const navLang = (navigator.language || 'en').toLowerCase();

    if (tz.includes('Istanbul') || navLang.startsWith('tr')) {
      return { region: 'TR', lang: 'tr' };
    }
    if (navLang === 'en-gb' || tz.includes('London')) {
      return { region: 'GB', lang: 'en' };
    }
    if (navLang.startsWith('de') || tz.includes('Berlin') || tz.includes('Vienna') || tz.includes('Zurich')) {
      return { region: 'DE', lang: 'de' };
    }
    if (navLang.startsWith('fr') || tz.includes('Paris')) {
      return { region: 'FR', lang: 'fr' };
    }
    if (navLang.startsWith('es') || tz.includes('Madrid')) {
      return { region: 'ES', lang: 'es' };
    }
    if (navLang === 'en-us' || tz.includes('America/New_York') || tz.includes('America/Los_Angeles') || tz.includes('America/Chicago')) {
      return { region: 'US', lang: 'en' };
    }
    return { region: 'GLOBAL', lang: 'en' };
  } catch {
    return { region: 'GLOBAL', lang: 'en' };
  }
}

export function saveRegionAndLangStorage(region: RegionCode, lang: AppLang) {
  try {
    localStorage.setItem(REGION_STORAGE_KEY, region);
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  } catch {
    // ignore storage quota
  }
}

export interface GeoPricing {
  isTurkey: boolean;
  currency: 'TRY' | 'USD';
  symbol: '₺' | '$';
  proMonthlyValue: number;
  proMonthlyLabel: string;
  proPeriodLabel: string;
  packageValue: number;
  packageLabel: string;
  avatarValue: number;
  avatarLabel: string;
}

export function getGeoPricing(region: RegionCode, lang?: AppLang): GeoPricing {
  const isTurkey = region === 'TR';
  const effectiveLang = lang || (isTurkey ? 'tr' : 'en');
  if (isTurkey) {
    return {
      isTurkey: true,
      currency: 'TRY',
      symbol: '₺',
      proMonthlyValue: 150,
      proMonthlyLabel: '₺150',
      proPeriodLabel: effectiveLang === 'tr' ? '/ Ay' : '/ mo',
      packageValue: 100,
      packageLabel: '₺100',
      avatarValue: 40,
      avatarLabel: '₺40',
    };
  }
  return {
    isTurkey: false,
    currency: 'USD',
    symbol: '$',
    proMonthlyValue: 15,
    proMonthlyLabel: '$15',
    proPeriodLabel: '/ mo',
    packageValue: 10,
    packageLabel: '$10',
    avatarValue: 5,
    avatarLabel: '$5',
  };
}

export interface LocalizedTrackMeta {
  title: string;
  subtitle: string;
  badge: string;
}

const REGIONAL_TRACKS: Record<RegionCode, Record<CourseCategory, LocalizedTrackMeta>> = {
  TR: {
    yks: { title: 'YKS (TYT - AYT)', subtitle: 'Üniversite Hazırlık', badge: 'YKS' },
    lgs: { title: 'LGS Hazırlık', subtitle: '8. Sınıf Liselere Geçiş', badge: 'LGS' },
    kpss: { title: 'KPSS Hazırlık', subtitle: 'Genel Yetenek & Kültür', badge: 'KPSS' },
    dil: { title: 'İngilizce (YDT / IELTS)', subtitle: 'Kelime, Gramer & Okuma', badge: 'EN' },
    dil_alm: { title: 'Almanca (A1-B2)', subtitle: 'Goethe & Telc Pratik', badge: 'DE' },
    dil_fra: { title: 'Fransızca (A1-B2)', subtitle: 'DELF & Günlük Konuşma', badge: 'FR' },
    dil_isp: { title: 'İspanyolca (A1-B2)', subtitle: 'DELE & Pratik', badge: 'ES' },
    dil_bos: { title: 'Boşnakça', subtitle: 'Temel & Orta Seviye', badge: 'BS' },
    kodlama: { title: 'Kodlama & Python', subtitle: 'Algoritma & Yazılım', badge: 'CODE' },
  },
  US: {
    yks: { title: 'SAT & ACT Prep', subtitle: 'US College Admissions', badge: 'SAT' },
    lgs: { title: 'AP & High School', subtitle: 'Math, Science & Honors', badge: 'AP' },
    kpss: { title: 'GRE & Civil Service', subtitle: 'Graduate & Career Prep', badge: 'GRE' },
    dil: { title: 'Academic English & TOEFL', subtitle: 'Reading, Vocab & Writing', badge: 'TOEFL' },
    dil_alm: { title: 'German', subtitle: 'A1–B2 Fluency', badge: 'DE' },
    dil_fra: { title: 'French', subtitle: 'A1–B2 Fluency', badge: 'FR' },
    dil_isp: { title: 'Spanish', subtitle: 'AP & Everyday Fluency', badge: 'ES' },
    dil_bos: { title: 'Bosnian', subtitle: 'Balkan Language Track', badge: 'BS' },
    kodlama: { title: 'Coding & Python', subtitle: 'CS & Algorithms', badge: 'CODE' },
  },
  GB: {
    yks: { title: 'A-Level & Oxbridge', subtitle: 'UK University Entry', badge: 'A-LVL' },
    lgs: { title: 'GCSE Exam Prep', subtitle: 'Core UK Curriculum', badge: 'GCSE' },
    kpss: { title: 'IELTS & Civil Service', subtitle: 'Verbal & Numerical Tests', badge: 'IELTS' },
    dil: { title: 'English & IELTS', subtitle: 'Academic & Band 8+ Vocab', badge: 'EN' },
    dil_alm: { title: 'German (GCSE / A-Level)', subtitle: 'Grammar & Speaking', badge: 'DE' },
    dil_fra: { title: 'French (GCSE / A-Level)', subtitle: 'Grammar & Speaking', badge: 'FR' },
    dil_isp: { title: 'Spanish', subtitle: 'A1–B2 Practice', badge: 'ES' },
    dil_bos: { title: 'Bosnian', subtitle: 'Core Phrases & Grammar', badge: 'BS' },
    kodlama: { title: 'Computer Science', subtitle: 'Python & Logic', badge: 'CODE' },
  },
  DE: {
    yks: { title: 'Abitur Vorbereitung', subtitle: 'Hochschulreife & Mathe', badge: 'ABI' },
    lgs: { title: 'MSA & Realschule', subtitle: 'Sekundarstufe I Training', badge: 'MSA' },
    kpss: { title: 'TestDaF & Studium', subtitle: 'Akademische Eignung', badge: 'DAF' },
    dil: { title: 'Englisch (B2 / C1)', subtitle: 'Abitur & Business', badge: 'EN' },
    dil_alm: { title: 'Deutsch C1 / Goethe', subtitle: 'Grammatik & Wortschatz', badge: 'DE' },
    dil_fra: { title: 'Französisch', subtitle: 'DELF & Schule', badge: 'FR' },
    dil_isp: { title: 'Spanisch', subtitle: 'DELE & Praxis', badge: 'ES' },
    dil_bos: { title: 'Bosnisch', subtitle: 'Grundkurs', badge: 'BS' },
    kodlama: { title: 'Informatik & Python', subtitle: 'Algorithmen & Code', badge: 'CODE' },
  },
  FR: {
    yks: { title: 'Baccalauréat (BAC)', subtitle: 'Préparation Lycée & Maths', badge: 'BAC' },
    lgs: { title: 'Brevet des Collèges', subtitle: 'Révisions 3ème', badge: 'BREVET' },
    kpss: { title: 'Concours & Grandes Écoles', subtitle: 'Culture Générale & Logique', badge: 'CONCOURS' },
    dil: { title: 'Anglais (IELTS / TOEIC)', subtitle: 'Vocabulaire & Grammaire', badge: 'EN' },
    dil_alm: { title: 'Allemand', subtitle: 'LV1 / LV2 Pratique', badge: 'DE' },
    dil_fra: { title: 'Français / DELF', subtitle: 'Orthographe & Expression', badge: 'FR' },
    dil_isp: { title: 'Espagnol', subtitle: 'LV2 & Conversation', badge: 'ES' },
    dil_bos: { title: 'Bosniaque', subtitle: 'Bases & Vocabulaire', badge: 'BS' },
    kodlama: { title: 'NSI & Python', subtitle: 'Algorithmes & Code', badge: 'CODE' },
  },
  ES: {
    yks: { title: 'Selectividad (EvAU / EBAU)', subtitle: 'Acceso a la Universidad', badge: 'EvAU' },
    lgs: { title: 'ESO & Bachillerato', subtitle: 'Matemáticas y Ciencias', badge: 'ESO' },
    kpss: { title: 'Oposiciones & DELE', subtitle: 'Test Psicotécnicos', badge: 'OPO' },
    dil: { title: 'Inglés (Cambridge / IELTS)', subtitle: 'B1–C1 Vocabulario', badge: 'EN' },
    dil_alm: { title: 'Alemán', subtitle: 'A1–B2 Práctica', badge: 'DE' },
    dil_fra: { title: 'Francés', subtitle: 'DELF & Gramática', badge: 'FR' },
    dil_isp: { title: 'Español / DELE', subtitle: 'Lengua y Literatura', badge: 'ES' },
    dil_bos: { title: 'Bosnio', subtitle: 'Nivel Básico', badge: 'BS' },
    kodlama: { title: 'Programación & Python', subtitle: 'Lógica y Algoritmos', badge: 'CODE' },
  },
  GLOBAL: {
    yks: { title: 'University Prep (SAT / IB)', subtitle: 'Global Admissions Exam', badge: 'SAT/IB' },
    lgs: { title: 'High School / IGCSE', subtitle: 'Core Math & Science', badge: 'IGCSE' },
    kpss: { title: 'Career & IELTS / TOEFL', subtitle: 'Aptitude & Proficiency', badge: 'IELTS' },
    dil: { title: 'English (IELTS / TOEFL)', subtitle: 'Global Fluency & Vocab', badge: 'EN' },
    dil_alm: { title: 'German (Goethe)', subtitle: 'A1–B2 Fluency', badge: 'DE' },
    dil_fra: { title: 'French (DELF)', subtitle: 'A1–B2 Fluency', badge: 'FR' },
    dil_isp: { title: 'Spanish (DELE)', subtitle: 'A1–B2 Fluency', badge: 'ES' },
    dil_bos: { title: 'Bosnian', subtitle: 'Essential Fluency', badge: 'BS' },
    kodlama: { title: 'Coding & Python', subtitle: 'Algorithms & CS', badge: 'CODE' },
  },
};

export function getLocalizedTrack(courseId: CourseCategory, region: RegionCode): LocalizedTrackMeta {
  return REGIONAL_TRACKS[region]?.[courseId] || REGIONAL_TRACKS.GLOBAL[courseId];
}

export function getRegionInfo(region: RegionCode): RegionInfo {
  return REGIONS.find((r) => r.code === region) || REGIONS[REGIONS.length - 1];
}

type TranslationKey =
  | 'nav_home'
  | 'nav_exam'
  | 'nav_duel'
  | 'nav_coach'
  | 'nav_shop'
  | 'nav_profile'
  | 'shop_title'
  | 'shop_pro_title'
  | 'shop_pro_cta'
  | 'shop_pro_active'
  | 'shop_no_ads_feature'
  | 'shop_unlimited_hearts_feature'
  | 'shop_ai_feature'
  | 'shop_gems_bonus_feature'
  | 'shop_packages_title'
  | 'shop_avatars_title'
  | 'shop_buy_direct'
  | 'shop_owned'
  | 'hearts_out_title'
  | 'hearts_wait_label'
  | 'hearts_watch_ad'
  | 'hearts_refill_gems'
  | 'hearts_go_pro'
  | 'ad_badge'
  | 'ad_wait_sec'
  | 'ad_skip'
  | 'ad_remove_cta'
  | 'profile_region_title'
  | 'profile_pro_badge';

const TRANSLATIONS: Record<AppLang, Record<TranslationKey, string>> = {
  tr: {
    nav_home: 'Dersler',
    nav_exam: 'Deneme',
    nav_duel: 'Düello',
    nav_coach: 'AI Koç',
    nav_shop: 'Mağaza',
    nav_profile: 'Profil',
    shop_title: 'Knowza Mağazası',
    shop_pro_title: 'Knowza PRO Üyelik',
    shop_pro_cta: "PRO'YA GEÇ",
    shop_pro_active: 'PRO AKTİF 👑',
    shop_no_ads_feature: 'Reklamsız Deneyim (Test Sonrası Reklam Yok)',
    shop_unlimited_hearts_feature: 'Sınırsız Can (Can Bitince Bekleme Yok)',
    shop_ai_feature: 'Sınırsız Gemini AI Koç & Tüm Sınavlar',
    shop_gems_bonus_feature: 'Anında +1000 Elmas & Kral Ayı Kostümü',
    shop_packages_title: 'Özel Paketler',
    shop_avatars_title: 'Avatarlar, Kostümler & Çerçeveler',
    shop_buy_direct: 'Satın Al',
    shop_owned: 'Sahipsin ✓',
    hearts_out_title: 'Canların Tükendi!',
    hearts_wait_label: 'Yeni can için bekleme süresi:',
    hearts_watch_ad: 'Reklam İzle (+1 ❤️)',
    hearts_refill_gems: '50 💎 ile Doldur',
    hearts_go_pro: "PRO'ya Geç (Sınırsız Can, Bekleme Yok)",
    ad_badge: 'SPONSORLU REKLAM',
    ad_wait_sec: 'sn sonra geçilebilir',
    ad_skip: 'Reklamı Kapat & Devam Et',
    ad_remove_cta: "Reklamları Kaldırmak İçin PRO'ya Geç",
    profile_region_title: 'Ülke, Dil & Sınav Sistemi',
    profile_pro_badge: 'Knowza PRO 👑',
  },
  en: {
    nav_home: 'Learn',
    nav_exam: 'Exams',
    nav_duel: 'Duel',
    nav_coach: 'AI Coach',
    nav_shop: 'Shop',
    nav_profile: 'Profile',
    shop_title: 'Knowza Store',
    shop_pro_title: 'Knowza PRO Membership',
    shop_pro_cta: 'UPGRADE TO PRO',
    shop_pro_active: 'PRO ACTIVE 👑',
    shop_no_ads_feature: 'Ad-Free Experience (No Post-Test Ads)',
    shop_unlimited_hearts_feature: 'Unlimited Hearts (Zero Wait Time)',
    shop_ai_feature: 'Unlimited Gemini AI Coach & All Exams',
    shop_gems_bonus_feature: 'Instant +1000 Gems & King Bear Avatar',
    shop_packages_title: 'Special Bundles',
    shop_avatars_title: 'Avatars, Costumes & Frames',
    shop_buy_direct: 'Buy Now',
    shop_owned: 'Owned ✓',
    hearts_out_title: 'Out of Hearts!',
    hearts_wait_label: 'Next free heart in:',
    hearts_watch_ad: 'Watch Ad (+1 ❤️)',
    hearts_refill_gems: 'Refill for 50 💎',
    hearts_go_pro: 'Go PRO (Unlimited Hearts, No Wait)',
    ad_badge: 'SPONSORED AD',
    ad_wait_sec: 's remaining',
    ad_skip: 'Close Ad & Continue',
    ad_remove_cta: 'Upgrade to PRO to Remove All Ads',
    profile_region_title: 'Country, Language & Exam System',
    profile_pro_badge: 'Knowza PRO 👑',
  },
  de: {
    nav_home: 'Lernen',
    nav_exam: 'Prüfung',
    nav_duel: 'Duell',
    nav_coach: 'KI-Coach',
    nav_shop: 'Shop',
    nav_profile: 'Profil',
    shop_title: 'Knowza Shop',
    shop_pro_title: 'Knowza PRO Mitgliedschaft',
    shop_pro_cta: 'PRO HOLEN',
    shop_pro_active: 'PRO AKTIV 👑',
    shop_no_ads_feature: 'Werbefrei (Keine Werbung nach Tests)',
    shop_unlimited_hearts_feature: 'Unbegrenzte Herzen (Keine Wartezeit)',
    shop_ai_feature: 'Unbegrenzter Gemini KI-Coach & Prüfungen',
    shop_gems_bonus_feature: 'Sofort +1000 Edelsteine & König-Avatar',
    shop_packages_title: 'Spezialpakete',
    shop_avatars_title: 'Avatare, Kostüme & Rahmen',
    shop_buy_direct: 'Kaufen',
    shop_owned: 'Im Besitz ✓',
    hearts_out_title: 'Keine Herzen mehr!',
    hearts_wait_label: 'Nächstes Herz in:',
    hearts_watch_ad: 'Werbung ansehen (+1 ❤️)',
    hearts_refill_gems: 'Mit 50 💎 auffüllen',
    hearts_go_pro: 'PRO holen (Unbegrenzt, ohne Warten)',
    ad_badge: 'WERBUNG',
    ad_wait_sec: 'Sek. verbleibend',
    ad_skip: 'Schließen & Weiter',
    ad_remove_cta: 'Auf PRO upgraden für Werbefreiheit',
    profile_region_title: 'Land, Sprache & Prüfungssystem',
    profile_pro_badge: 'Knowza PRO 👑',
  },
  fr: {
    nav_home: 'Apprendre',
    nav_exam: 'Examens',
    nav_duel: 'Duel',
    nav_coach: 'Coach IA',
    nav_shop: 'Boutique',
    nav_profile: 'Profil',
    shop_title: 'Boutique Knowza',
    shop_pro_title: 'Abonnement Knowza PRO',
    shop_pro_cta: 'PASSER À PRO',
    shop_pro_active: 'PRO ACTIF 👑',
    shop_no_ads_feature: 'Sans publicité (Aucune pub après les tests)',
    shop_unlimited_hearts_feature: 'Vies illimitées (Aucune attente)',
    shop_ai_feature: 'Coach IA Gemini illimité & Examens',
    shop_gems_bonus_feature: '+1000 Gemmes & Avatar Roi immédiats',
    shop_packages_title: 'Packs Spéciaux',
    shop_avatars_title: 'Avatars, Costumes & Cadres',
    shop_buy_direct: 'Acheter',
    shop_owned: 'Possédé ✓',
    hearts_out_title: 'Plus de vies !',
    hearts_wait_label: 'Prochaine vie dans :',
    hearts_watch_ad: 'Voir une pub (+1 ❤️)',
    hearts_refill_gems: 'Recharger pour 50 💎',
    hearts_go_pro: 'Passer PRO (Vies illimitées)',
    ad_badge: 'PUBLICITÉ',
    ad_wait_sec: 's restantes',
    ad_skip: 'Fermer & Continuer',
    ad_remove_cta: 'Passer PRO pour supprimer les pubs',
    profile_region_title: 'Pays, Langue & Système d’examen',
    profile_pro_badge: 'Knowza PRO 👑',
  },
  es: {
    nav_home: 'Aprender',
    nav_exam: 'Exámenes',
    nav_duel: 'Duelo',
    nav_coach: 'Coach IA',
    nav_shop: 'Tienda',
    nav_profile: 'Perfil',
    shop_title: 'Tienda Knowza',
    shop_pro_title: 'Membresía Knowza PRO',
    shop_pro_cta: 'MEJORAR A PRO',
    shop_pro_active: 'PRO ACTIVO 👑',
    shop_no_ads_feature: 'Sin anuncios (Sin publicidad tras los test)',
    shop_unlimited_hearts_feature: 'Vidas ilimitadas (Sin esperas)',
    shop_ai_feature: 'Coach IA Gemini ilimitado y Exámenes',
    shop_gems_bonus_feature: '+1000 Gemas y Avatar Rey al instante',
    shop_packages_title: 'Paquetes Especiales',
    shop_avatars_title: 'Avatares, Disfraces y Marcos',
    shop_buy_direct: 'Comprar',
    shop_owned: 'Adquirido ✓',
    hearts_out_title: '¡Sin vidas!',
    hearts_wait_label: 'Próxima vida en:',
    hearts_watch_ad: 'Ver anuncio (+1 ❤️)',
    hearts_refill_gems: 'Recargar por 50 💎',
    hearts_go_pro: 'Hazte PRO (Vidas ilimitadas)',
    ad_badge: 'ANUNCIO PATROCINADO',
    ad_wait_sec: 's restantes',
    ad_skip: 'Cerrar y Continuar',
    ad_remove_cta: 'Pásate a PRO para quitar anuncios',
    profile_region_title: 'País, Idioma y Sistema de Exámenes',
    profile_pro_badge: 'Knowza PRO 👑',
  },
};

export function t(lang: AppLang, key: TranslationKey): string {
  return TRANSLATIONS[lang]?.[key] || TRANSLATIONS.en[key];
}
