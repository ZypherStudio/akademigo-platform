// Strict Chat Moderation & Instant Auto-Ban Filter for Knowza Social Chat

const BANNED_ROOTS = [
  'amk',
  'aq',
  'oç',
  'orospu',
  'pic',
  'piç',
  'sik',
  'siktir',
  'yavsak',
  'yavşak',
  'göt',
  'gotveren',
  'kahpe',
  'pezevenk',
  'ibne',
  'puşt',
  'pust',
  'gerizekalı',
  'gerizekali',
  'salak',
  'aptal',
  'fuck',
  'shit',
  'bitch',
  'asshole',
  'dick',
  'pussy',
  'nigger',
  'faggot',
];

const URL_REGEX = /(https?:\/\/|www\.|\.com\b|\.net\b|\.org\b|t\.me\/|discord\.gg)/i;
const PHONE_REGEX = /(\+?\d[\d\s-]{8,}\d)/;

export interface ModerationResult {
  allowed: boolean;
  shouldBanImmediately: boolean;
  reason?: string;
}

export function moderateChatMessage(raw: string): ModerationResult {
  const trimmed = raw.trim();
  if (!trimmed) {
    return { allowed: false, shouldBanImmediately: false, reason: 'Boş mesaj gönderilemez.' };
  }
  if (trimmed.length > 160) {
    return {
      allowed: false,
      shouldBanImmediately: false,
      reason: 'Mesaj sınırı en fazla 160 karakterdir.',
    };
  }

  const lower = trimmed.toLowerCase();
  const tokens = lower
    .replace(/[.,!?;:()"'-]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

  for (const bad of BANNED_ROOTS) {
    if (
      tokens.includes(bad) ||
      (bad.length >= 4 && lower.includes(bad))
    ) {
      return {
        allowed: false,
        shouldBanImmediately: true,
        reason: 'Küfür / hakaret / argo kullanımı tespit edildi. Hesabınız sohbetten kalıcı olarak yasaklandı.',
      };
    }
  }

  if (URL_REGEX.test(trimmed)) {
    return {
      allowed: false,
      shouldBanImmediately: true,
      reason: 'Harici link / reklam paylaşımı yasaktır. Hesabınız sohbetten yasaklandı.',
    };
  }

  if (PHONE_REGEX.test(trimmed)) {
    return {
      allowed: false,
      shouldBanImmediately: false,
      reason: 'Güvenlik kuralı gereği telefon numarası paylaşılamaz.',
    };
  }

  return { allowed: true, shouldBanImmediately: false };
}
