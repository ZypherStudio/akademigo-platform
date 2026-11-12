import { QuickToolId } from '../types';

export interface QuickToolMeta {
  id: QuickToolId;
  title: string;
  shortTitle: string;
  subtitle: string;
  emoji: string;
  badge: string;
  gradient: string;
}

export const QUICK_TOOLS: QuickToolMeta[] = [
  {
    id: 'tests',
    title: 'Konu Testleri',
    shortTitle: 'Konu Testi',
    subtitle: 'Seçtiğin sınavın güncel üniteleri',
    emoji: '📝',
    badge: 'Sınav Odaklı',
    gradient: 'from-amber-400 to-orange-500',
  },
  {
    id: 'duel',
    title: '1v1 Düello',
    shortTitle: '1v1 Düello',
    subtitle: 'Canlı oda & ELO kapışması',
    emoji: '⚔️',
    badge: 'ELO Puanlı',
    gradient: 'from-rose-500 to-orange-500',
  },
  {
    id: 'exams',
    title: 'Deneme Sınavları',
    shortTitle: 'Denemeler',
    subtitle: 'Zamanlı ÖSYM & MEB denemeleri',
    emoji: '🎯',
    badge: 'Tam Format',
    gradient: 'from-emerald-500 to-teal-600',
  },
  {
    id: 'aicoach',
    title: 'Gemini AI Koç',
    shortTitle: 'AI Koç',
    subtitle: 'Takıldığın soruyu anında sor',
    emoji: '🤖',
    badge: '7/24 Koç',
    gradient: 'from-indigo-500 to-blue-600',
  },
  {
    id: 'kahoot',
    title: 'Soru Arenası',
    shortTitle: 'Soru Arenası',
    subtitle: 'Çok oyunculu hızlı yarışma',
    emoji: '🏆',
    badge: 'Canlı Lig',
    gradient: 'from-purple-600 to-indigo-700',
  },
  {
    id: 'reels',
    title: 'Soru Kaydır',
    shortTitle: 'Soru Kaydır',
    subtitle: 'Hızlı dikey soru çözümü',
    emoji: '🔥',
    badge: 'Seri Akış',
    gradient: 'from-amber-500 to-yellow-600',
  },
  {
    id: 'countdown',
    title: 'Sınav Sayacı',
    shortTitle: 'Sayaç',
    subtitle: '2027 sınav tarihi & günlük hedef',
    emoji: '⏳',
    badge: 'Canlı Takvim',
    gradient: 'from-violet-600 to-purple-700',
  },
  {
    id: 'errors',
    title: 'Hata Defterim',
    shortTitle: 'Hatalarım',
    subtitle: 'Yanlış yaptıklarını tekrar et',
    emoji: '📒',
    badge: 'Tekrar',
    gradient: 'from-pink-600 to-rose-600',
  },
  {
    id: 'codelab',
    title: 'Kodlama Lab',
    shortTitle: 'Kod Lab',
    subtitle: 'Python & algoritma pratiği',
    emoji: '💻',
    badge: 'Yazılım',
    gradient: 'from-slate-700 to-slate-900',
  },
  {
    id: 'widgets',
    title: "Ana Ekran Widget'ları",
    shortTitle: 'Widgetlar',
    subtitle: 'Canlı seri, ders ve seviye widgetları',
    emoji: '📱',
    badge: 'Yeni ✨',
    gradient: 'from-amber-500 via-orange-500 to-amber-600',
  },
];

export const QUICK_TOOL_MAP: Record<QuickToolId, QuickToolMeta> = Object.fromEntries(
  QUICK_TOOLS.map((t) => [t.id, t])
) as Record<QuickToolId, QuickToolMeta>;
