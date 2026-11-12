import { AvatarFrameId, KnowzaCostume, StudyNote, UserStats } from '../types';
import {
  isValidEmail,
  loadAccountRecord,
  normalizeEmail,
  registerEmailAccount,
  saveAccountRecord,
  verifyEmailAccount,
} from './accountStorage';
import {
  createFirestoreDuelRoom,
  fetchFirestoreLeaderboard,
  isFirebaseConfigured,
  joinFirestoreDuelRoom,
  loginWithFirebaseEmail,
  registerWithFirebaseEmail,
  saveAccountToFirestore,
  signInWithFirebaseGoogle,
  submitFirestoreDuelScore,
} from './firebaseClient';

const SESSION_TOKEN_KEY = 'knowza_session_token';

export interface AuthResponse {
  ok: boolean;
  error?: string;
  isNewAccount?: boolean;
  email?: string;
  firebaseUid?: string;
  googleName?: string;
  googleSub?: string;
  avatarUrl?: string;
  stats?: UserStats | null;
  notes?: StudyNote[];
}

export interface ServerLeaderboardPlayer {
  id: string;
  name: string;
  xp: number;
  eloRating: number;
  duelWins: number;
  duelLosses: number;
  streak: number;
  costume: KnowzaCostume;
  frameId: AvatarFrameId;
  tier: 'diamond' | 'gold' | 'silver' | 'bronze';
}

export interface LiveDuelRoom {
  code: string;
  status: 'waiting' | 'active' | 'finished';
  questionIndices: number[];
  host: {
    id: string;
    name: string;
    elo: number;
    frameId: string;
    score: number;
    finished: boolean;
  };
  guest: {
    id: string;
    name: string;
    elo: number;
    frameId: string;
    score: number;
    finished: boolean;
  } | null;
}

export function getSessionToken(): string {
  return (localStorage.getItem(SESSION_TOKEN_KEY) || '').trim();
}

export function setSessionToken(token: string): void {
  if (token) {
    localStorage.setItem(SESSION_TOKEN_KEY, token);
  } else {
    localStorage.removeItem(SESSION_TOKEN_KEY);
  }
}

async function postJson(url: string, body: unknown, token?: string): Promise<{ status: number; data: any } | null> {
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;
    const res = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });
    if (res.status === 404) return null;
    const contentType = res.headers.get('content-type') || '';
    if (!contentType.includes('application/json')) return null;
    const data = await res.json().catch(() => null);
    if (!data) return null;
    return { status: res.status, data };
  } catch {
    return null;
  }
}

export async function authenticateWithFirebaseGoogle(): Promise<AuthResponse> {
  const res = await signInWithFirebaseGoogle();
  if (!res.ok || !res.email) {
    return { ok: false, error: res.error || 'Google ile giriş yapılamadı.' };
  }
  return {
    ok: true,
    isNewAccount: res.isNewAccount,
    email: res.email,
    firebaseUid: res.uid,
    googleSub: res.uid,
    googleName: res.displayName || '',
    avatarUrl: res.photoURL,
    stats: res.stats ?? null,
    notes: res.notes ?? [],
  };
}

export async function authenticateWithGoogleToken(
  accessToken: string,
  fallbackProfile: { email: string; name: string; picture?: string; sub: string }
): Promise<AuthResponse> {
  const apiRes = await postJson('/api/auth/google', { accessToken });
  if (apiRes && apiRes.data) {
    if (!apiRes.data.ok) {
      return { ok: false, error: apiRes.data.error || 'Google oturumu doğrulanamadı.' };
    }
    if (apiRes.data.sessionToken) setSessionToken(apiRes.data.sessionToken);
    const acc = apiRes.data.account;
    const localRec = loadAccountRecord(acc.email);
    const mergedStats = acc.stats || localRec?.stats || null;
    return {
      ok: true,
      isNewAccount: apiRes.data.isNewAccount && !localRec,
      email: acc.email,
      googleName: apiRes.data.googleName || fallbackProfile.name,
      googleSub: acc.googleSub || fallbackProfile.sub,
      avatarUrl: acc.avatarUrl || fallbackProfile.picture,
      stats: mergedStats,
      notes: acc.notes?.length ? acc.notes : localRec?.notes || [],
    };
  }

  // Fallback when running static Vite dev without server.mjs
  const cleanEmail = normalizeEmail(fallbackProfile.email);
  const localRec = loadAccountRecord(cleanEmail);
  return {
    ok: true,
    isNewAccount: !localRec,
    email: cleanEmail,
    googleName: fallbackProfile.name,
    googleSub: fallbackProfile.sub,
    avatarUrl: fallbackProfile.picture,
    stats: localRec?.stats || null,
    notes: localRec?.notes || [],
  };
}

export async function authenticateWithGoogleEmail(rawEmail: string): Promise<AuthResponse> {
  const cleanEmail = normalizeEmail(rawEmail);
  if (!isValidEmail(cleanEmail)) {
    return { ok: false, error: 'Lütfen gerçek ve geçerli bir Google e-posta adresi giriniz.' };
  }

  const apiRes = await postJson('/api/auth/google-email', { email: cleanEmail });
  if (apiRes && apiRes.data) {
    if (!apiRes.data.ok) {
      return { ok: false, error: apiRes.data.error || 'Giriş başarısız.' };
    }
    if (apiRes.data.sessionToken) setSessionToken(apiRes.data.sessionToken);
    const acc = apiRes.data.account;
    const localRec = loadAccountRecord(cleanEmail);
    const mergedStats = acc.stats || localRec?.stats || null;
    return {
      ok: true,
      isNewAccount: apiRes.data.isNewAccount && !localRec,
      email: cleanEmail,
      stats: mergedStats,
      notes: acc.notes?.length ? acc.notes : localRec?.notes || [],
    };
  }

  const localRec = loadAccountRecord(cleanEmail);
  return {
    ok: true,
    isNewAccount: !localRec,
    email: cleanEmail,
    stats: localRec?.stats || null,
    notes: localRec?.notes || [],
  };
}

export async function registerWithEmailPassword(rawEmail: string, password: string): Promise<AuthResponse> {
  const cleanEmail = normalizeEmail(rawEmail);
  if (!isValidEmail(cleanEmail)) {
    return { ok: false, error: 'Lütfen geçerli bir e-posta adresi giriniz.' };
  }
  if (password.length < 6) {
    return { ok: false, error: 'Şifreniz en az 6 karakter olmalıdır.' };
  }

  if (isFirebaseConfigured()) {
    const fb = await registerWithFirebaseEmail(cleanEmail, password);
    if (!fb.ok || !fb.email) {
      return { ok: false, error: fb.error || 'Kayıt başarısız.' };
    }
    return {
      ok: true,
      isNewAccount: true,
      email: fb.email,
      firebaseUid: fb.uid,
      stats: fb.stats || null,
      notes: fb.notes || [],
    };
  }

  const apiRes = await postJson('/api/auth/register', { email: cleanEmail, password });
  if (apiRes && apiRes.data) {
    if (!apiRes.data.ok) {
      return { ok: false, error: apiRes.data.error || 'Kayıt başarısız.' };
    }
    if (apiRes.data.sessionToken) setSessionToken(apiRes.data.sessionToken);
    // Keep local registry synced too
    registerEmailAccount(cleanEmail, password);
    const acc = apiRes.data.account;
    return {
      ok: true,
      isNewAccount: true,
      email: cleanEmail,
      stats: acc?.stats || null,
      notes: acc?.notes || [],
    };
  }

  const localRes = registerEmailAccount(cleanEmail, password);
  if (!localRes.ok) {
    return { ok: false, error: localRes.error };
  }
  return {
    ok: true,
    isNewAccount: true,
    email: cleanEmail,
    stats: null,
    notes: [],
  };
}

export async function loginWithEmailPassword(rawEmail: string, password: string): Promise<AuthResponse> {
  const cleanEmail = normalizeEmail(rawEmail);
  if (!isValidEmail(cleanEmail) || !password) {
    return { ok: false, error: 'Lütfen e-posta ve şifrenizi giriniz.' };
  }

  if (isFirebaseConfigured()) {
    const fb = await loginWithFirebaseEmail(cleanEmail, password);
    if (!fb.ok || !fb.email) {
      return { ok: false, error: fb.error || 'E-posta veya şifre hatalı.' };
    }
    return {
      ok: true,
      isNewAccount: fb.isNewAccount,
      email: fb.email,
      firebaseUid: fb.uid,
      googleName: fb.displayName,
      avatarUrl: fb.photoURL,
      stats: fb.stats || null,
      notes: fb.notes || [],
    };
  }

  const apiRes = await postJson('/api/auth/login', { email: cleanEmail, password });
  if (apiRes && apiRes.data) {
    if (!apiRes.data.ok) {
      return { ok: false, error: apiRes.data.error || 'E-posta veya şifre hatalı.' };
    }
    if (apiRes.data.sessionToken) setSessionToken(apiRes.data.sessionToken);
    const acc = apiRes.data.account;
    const localRec = loadAccountRecord(cleanEmail);
    return {
      ok: true,
      isNewAccount: false,
      email: cleanEmail,
      stats: acc?.stats || localRec?.stats || null,
      notes: acc?.notes?.length ? acc.notes : localRec?.notes || [],
    };
  }

  const verified = verifyEmailAccount(cleanEmail, password);
  if (!verified.ok) {
    return { ok: false, error: verified.error };
  }
  const localRec = loadAccountRecord(cleanEmail);
  return {
    ok: true,
    isNewAccount: false,
    email: cleanEmail,
    stats: localRec?.stats || null,
    notes: localRec?.notes || [],
  };
}

export async function syncAccountToServer(stats: UserStats, notes: StudyNote[]): Promise<void> {
  // Always persist locally first
  saveAccountRecord(stats, notes);

  if (isFirebaseConfigured() && stats.firebaseUid) {
    await saveAccountToFirestore(stats, notes);
  }

  const token = getSessionToken();
  if (!token || !stats.isLoggedIn || !stats.email) return;

  await postJson(
    '/api/account/save',
    { email: normalizeEmail(stats.email), stats, notes },
    token
  );
}

export async function fetchServerLeaderboard(): Promise<ServerLeaderboardPlayer[]> {
  if (isFirebaseConfigured()) {
    const fbPlayers = await fetchFirestoreLeaderboard();
    if (fbPlayers.length > 0) return fbPlayers;
  }

  try {
    const res = await fetch('/api/leaderboard');
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data.players) ? data.players : [];
  } catch {
    return [];
  }
}

export async function createLiveDuelRoom(params: {
  playerId: string;
  playerName: string;
  playerElo: number;
  frameId: string;
  questionPoolSize: number;
}): Promise<LiveDuelRoom | null> {
  if (isFirebaseConfigured()) {
    const fbRoom = await createFirestoreDuelRoom(params);
    if (fbRoom) return fbRoom;
  }

  const res = await postJson('/api/duel/room', params);
  if (res?.data?.ok && res.data.room) return res.data.room as LiveDuelRoom;
  return null;
}

export async function joinLiveDuelRoom(params: {
  code: string;
  playerId: string;
  playerName: string;
  playerElo: number;
  frameId: string;
}): Promise<{ room?: LiveDuelRoom; error?: string }> {
  if (isFirebaseConfigured()) {
    const fbRes = await joinFirestoreDuelRoom(params);
    if (fbRes) return fbRes;
  }

  const res = await postJson('/api/duel/room/join', params);
  if (!res) return { error: 'Sunucuya bağlanılamadı.' };
  if (!res.data?.ok) return { error: res.data?.error || 'Odaya katılınamadı.' };
  return { room: res.data.room as LiveDuelRoom };
}

export async function fetchLiveDuelRoom(code: string): Promise<LiveDuelRoom | null> {
  try {
    const res = await fetch(`/api/duel/room?code=${encodeURIComponent(code)}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.ok ? (data.room as LiveDuelRoom) : null;
  } catch {
    return null;
  }
}

export async function submitLiveDuelScore(params: {
  code: string;
  role: 'host' | 'guest';
  score: number;
  finished?: boolean;
}): Promise<LiveDuelRoom | null> {
  if (isFirebaseConfigured()) {
    const fbRoom = await submitFirestoreDuelScore(params);
    if (fbRoom) return fbRoom;
  }

  const res = await postJson('/api/duel/room/score', params);
  if (res?.data?.ok) return res.data.room as LiveDuelRoom;
  return null;
}
