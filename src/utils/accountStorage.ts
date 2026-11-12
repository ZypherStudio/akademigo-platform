import { CourseCategory, QuickToolId, StudyNote, UserStats } from '../types';

const ACCOUNT_VAULT_KEY = 'knowza_account_vault_v1';
const REGISTERED_USERS_KEY = 'knowza_registered_users';

const BLOCKED_FAKE_EMAILS = new Set([
  'ali@gmail.com',
  'ogrenci@gmail.com',
  'demo@knowza.app',
]);

const BLOCKED_FAKE_NAMES = new Set([
  'ali',
  'öğrenci',
  'ogrenci',
]);

export interface StoredAccountRecord {
  stats: UserStats;
  notes: StudyNote[];
  updatedAt: string;
}

export interface SavedAccountSummary {
  email: string;
  username: string;
  authProvider: 'google' | 'email';
  xp: number;
  streak: number;
  eloRating: number;
  duelWins: number;
  duelLosses: number;
  targetGoal?: CourseCategory;
  preferredQuickTools?: QuickToolId[];
  avatarUrl?: string;
  updatedAt: string;
}

export interface RegisteredEmailUser {
  email: string;
  passwordHash: string;
  password?: string; // Legacy migration fallback
  createdAt: string;
}

export const normalizeEmail = (email: string): string =>
  email.trim().toLowerCase();

export const isValidEmail = (email: string): boolean => {
  const clean = normalizeEmail(email);
  if (!clean || BLOCKED_FAKE_EMAILS.has(clean)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean);
};

export const isBlockedFakeAccount = (email?: string, username?: string): boolean => {
  if (email && BLOCKED_FAKE_EMAILS.has(normalizeEmail(email))) return true;
  if (username && BLOCKED_FAKE_NAMES.has(username.trim().toLowerCase())) return true;
  return false;
};

/** Synchronous deterministic password hash for local account credentials */
export const hashPassword = (password: string, email: string): string => {
  const input = `knowza_v1:${normalizeEmail(email)}:${password}`;
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  h1 = Math.imul(h1 ^ (h1 >>> 16), 2246822507) ^ Math.imul(h2 ^ (h2 >>> 13), 3266489909);
  h2 = Math.imul(h2 ^ (h2 >>> 16), 2246822507) ^ Math.imul(h1 ^ (h1 >>> 13), 3266489909);
  return (4294967296 * (2097151 & h2) + (h1 >>> 0)).toString(36);
};

function readVault(): Record<string, StoredAccountRecord> {
  try {
    const raw = localStorage.getItem(ACCOUNT_VAULT_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, StoredAccountRecord>;
    const cleaned: Record<string, StoredAccountRecord> = {};
    for (const [key, val] of Object.entries(parsed)) {
      if (!BLOCKED_FAKE_EMAILS.has(normalizeEmail(key)) && val?.stats) {
        cleaned[normalizeEmail(key)] = val;
      }
    }
    return cleaned;
  } catch {
    return {};
  }
}

function writeVault(vault: Record<string, StoredAccountRecord>): void {
  try {
    localStorage.setItem(ACCOUNT_VAULT_KEY, JSON.stringify(vault));
  } catch {
    // Ignore storage quota errors cleanly
  }
}

/** Persist the active user's full stats and notes under their normalized email */
export const saveAccountRecord = (stats: UserStats, notes: StudyNote[]): void => {
  if (!stats.isLoggedIn || !stats.email) return;
  const key = normalizeEmail(stats.email);
  if (!key || BLOCKED_FAKE_EMAILS.has(key)) return;

  const vault = readVault();
  const nowIso = new Date().toISOString();
  vault[key] = {
    stats: {
      ...stats,
      email: key,
      lastSavedAt: nowIso,
    },
    notes,
    updatedAt: nowIso,
  };
  writeVault(vault);
};

/** Load a user's saved account record by email, or null if brand new */
export const loadAccountRecord = (email: string): StoredAccountRecord | null => {
  const key = normalizeEmail(email);
  if (!key || BLOCKED_FAKE_EMAILS.has(key)) return null;
  const vault = readVault();
  return vault[key] ?? null;
};

/** List all real saved accounts on this device, most recently updated first */
export const listSavedAccounts = (): SavedAccountSummary[] => {
  const vault = readVault();
  return Object.entries(vault)
    .map(([email, record]) => ({
      email,
      username:
        record.stats.username && !BLOCKED_FAKE_NAMES.has(record.stats.username.toLowerCase())
          ? record.stats.username
          : '',
      authProvider: (record.stats.authProvider === 'email' ? 'email' : 'google') as 'google' | 'email',
      xp: record.stats.xp ?? 0,
      streak: record.stats.streak ?? 0,
      eloRating: record.stats.eloRating ?? 1000,
      duelWins: record.stats.duelWins ?? 0,
      duelLosses: record.stats.duelLosses ?? 0,
      targetGoal: record.stats.targetGoal,
      preferredQuickTools: record.stats.preferredQuickTools,
      avatarUrl: record.stats.avatarUrl,
      updatedAt: record.updatedAt,
    }))
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
};

/** Remove an account from the local saved accounts list */
export const removeSavedAccount = (email: string): void => {
  const key = normalizeEmail(email);
  const vault = readVault();
  delete vault[key];
  writeVault(vault);
};

/** Email & password registry helpers */
export const getRegisteredEmailUsers = (): RegisteredEmailUser[] => {
  try {
    const raw = localStorage.getItem(REGISTERED_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const registerEmailAccount = (email: string, password: string): { ok: boolean; error?: string } => {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail)) {
    return { ok: false, error: 'Lütfen geçerli bir e-posta adresi giriniz.' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'Şifreniz en az 6 karakter olmalıdır.' };
  }

  const users = getRegisteredEmailUsers();
  if (users.some(u => normalizeEmail(u.email) === cleanEmail)) {
    return { ok: false, error: 'Bu e-posta ile kayıtlı bir hesap zaten var. Giriş Yap sekmesini kullanabilirsin.' };
  }

  const record: RegisteredEmailUser = {
    email: cleanEmail,
    passwordHash: hashPassword(password, cleanEmail),
    createdAt: new Date().toISOString(),
  };

  localStorage.setItem(REGISTERED_USERS_KEY, JSON.stringify([...users, record]));
  return { ok: true };
};

export const verifyEmailAccount = (email: string, password: string): { ok: boolean; error?: string } => {
  const cleanEmail = normalizeEmail(email);
  if (!isValidEmail(cleanEmail) || !password) {
    return { ok: false, error: 'Lütfen geçerli e-posta ve şifrenizi giriniz.' };
  }

  const users = getRegisteredEmailUsers();
  const found = users.find(u => normalizeEmail(u.email) === cleanEmail);
  if (!found) {
    return { ok: false, error: 'Bu e-posta ile kayıtlı hesap bulunamadı. Yeni Hesap Aç sekmesinden kayıt olabilirsin.' };
  }

  const matchesHash = found.passwordHash && found.passwordHash === hashPassword(password, cleanEmail);
  const matchesLegacy = found.password && found.password === password;
  if (!matchesHash && !matchesLegacy) {
    return { ok: false, error: 'Girdiğin şifre hatalı. Lütfen tekrar dene.' };
  }

  return { ok: true };
};

/** Clean display identity that NEVER invents fake names like 'Öğrenci' or 'Ali' */
export const getDisplayIdentity = (
  stats: Pick<UserStats, 'username' | 'email'>
): { primary: string; secondary?: string; handle: string } => {
  const rawName = (stats.username || '').trim();
  const hasRealName = !!rawName && !BLOCKED_FAKE_NAMES.has(rawName.toLowerCase());
  const email = (stats.email || '').trim();
  const emailHandle = email ? email.split('@')[0] : '';

  if (hasRealName) {
    return {
      primary: rawName,
      secondary: email || undefined,
      handle: rawName,
    };
  }

  if (email) {
    return {
      primary: emailHandle,
      secondary: email,
      handle: emailHandle,
    };
  }

  return {
    primary: 'Knowza',
    handle: 'Knowza',
  };
};
