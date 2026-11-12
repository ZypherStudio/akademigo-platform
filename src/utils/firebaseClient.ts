import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  Auth,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  orderBy,
  limit,
  getDocs,
  onSnapshot,
  Firestore,
} from 'firebase/firestore';
import { AvatarFrameId, KnowzaCostume, StudyNote, UserStats } from '../types';
import {
  getDisplayIdentity,
  isBlockedFakeAccount,
  loadAccountRecord,
  normalizeEmail,
} from './accountStorage';
import type { LiveDuelRoom, ServerLeaderboardPlayer } from './apiClient';

export interface FirebaseWebConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId: string;
}

const FIREBASE_CONFIG_STORAGE_KEY = 'knowza_firebase_config_v1';

let cachedApp: FirebaseApp | null = null;
let cachedAuth: Auth | null = null;
let cachedDb: Firestore | null = null;
let cachedConfigFingerprint = '';

function stripUndefinedDeep<T>(val: T): T {
  if (Array.isArray(val)) {
    return val.map((item) => stripUndefinedDeep(item)) as unknown as T;
  }
  if (val && typeof val === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(val as Record<string, unknown>)) {
      if (v !== undefined) {
        out[k] = stripUndefinedDeep(v);
      }
    }
    return out as T;
  }
  return val;
}

export function getSavedFirebaseConfig(): FirebaseWebConfig | null {
  try {
    const raw = localStorage.getItem(FIREBASE_CONFIG_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as FirebaseWebConfig;
    if (parsed?.apiKey && parsed?.authDomain && parsed?.projectId && parsed?.appId) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearSavedFirebaseConfig(): void {
  localStorage.removeItem(FIREBASE_CONFIG_STORAGE_KEY);
  cachedApp = null;
  cachedAuth = null;
  cachedDb = null;
  cachedConfigFingerprint = '';
}

export function getEnvFirebaseConfig(): FirebaseWebConfig | null {
  const envMeta = (import.meta as unknown as { env?: Record<string, string | undefined> }).env || {};
  if (envMeta.VITE_FIREBASE_CONFIG) {
    try {
      const parsed = JSON.parse(envMeta.VITE_FIREBASE_CONFIG) as FirebaseWebConfig;
      if (parsed?.apiKey && parsed?.authDomain && parsed?.projectId && parsed?.appId) {
        return parsed;
      }
    } catch {
      // Ignore malformed JSON env
    }
  }

  const apiKey = (envMeta.VITE_FIREBASE_API_KEY || '').trim();
  const authDomain = (envMeta.VITE_FIREBASE_AUTH_DOMAIN || '').trim();
  const projectId = (envMeta.VITE_FIREBASE_PROJECT_ID || '').trim();
  const appId = (envMeta.VITE_FIREBASE_APP_ID || '').trim();

  if (apiKey && authDomain && projectId && appId) {
    return {
      apiKey,
      authDomain,
      projectId,
      storageBucket: (envMeta.VITE_FIREBASE_STORAGE_BUCKET || '').trim() || undefined,
      messagingSenderId: (envMeta.VITE_FIREBASE_MESSAGING_SENDER_ID || '').trim() || undefined,
      appId,
    };
  }

  return null;
}

export function resolveFirebaseConfig(): FirebaseWebConfig | null {
  return getSavedFirebaseConfig() || getEnvFirebaseConfig();
}

export function isFirebaseConfigured(): boolean {
  return resolveFirebaseConfig() !== null;
}

/**
 * Accepts either JSON or the raw JS snippet copied from Firebase Console:
 * `const firebaseConfig = { apiKey: "...", authDomain: "...", projectId: "...", appId: "..." };`
 */
export function parseAndSaveFirebaseConfig(rawInput: string): {
  ok: boolean;
  config?: FirebaseWebConfig;
  error?: string;
} {
  const text = rawInput.trim();
  if (!text) {
    return { ok: false, error: 'Lütfen Firebase config kodunu yapıştır.' };
  }

  const pick = (key: string): string => {
    const regex = new RegExp(`["']?${key}["']?\\s*:\\s*["']([^"']+)["']`);
    const match = text.match(regex);
    return match ? match[1].trim() : '';
  };

  let parsed: Partial<FirebaseWebConfig> | null = null;
  try {
    parsed = JSON.parse(text) as Partial<FirebaseWebConfig>;
  } catch {
    parsed = {
      apiKey: pick('apiKey'),
      authDomain: pick('authDomain'),
      projectId: pick('projectId'),
      storageBucket: pick('storageBucket') || undefined,
      messagingSenderId: pick('messagingSenderId') || undefined,
      appId: pick('appId'),
    };
  }

  if (!parsed?.apiKey || !parsed?.authDomain || !parsed?.projectId || !parsed?.appId) {
    return {
      ok: false,
      error: 'Geçersiz Firebase ayarı. `apiKey`, `authDomain`, `projectId` ve `appId` alanları eksiksiz olmalı.',
    };
  }

  const cleanConfig: FirebaseWebConfig = {
    apiKey: String(parsed.apiKey).trim(),
    authDomain: String(parsed.authDomain).trim(),
    projectId: String(parsed.projectId).trim(),
    storageBucket: parsed.storageBucket ? String(parsed.storageBucket).trim() : undefined,
    messagingSenderId: parsed.messagingSenderId ? String(parsed.messagingSenderId).trim() : undefined,
    appId: String(parsed.appId).trim(),
  };

  localStorage.setItem(FIREBASE_CONFIG_STORAGE_KEY, JSON.stringify(cleanConfig));
  cachedApp = null;
  cachedAuth = null;
  cachedDb = null;
  cachedConfigFingerprint = '';

  return { ok: true, config: cleanConfig };
}

function getFirebaseInstances(): { app: FirebaseApp; auth: Auth; db: Firestore } | null {
  const config = resolveFirebaseConfig();
  if (!config) return null;

  const fingerprint = `${config.projectId}:${config.apiKey}:${config.appId}`;
  if (cachedApp && cachedAuth && cachedDb && cachedConfigFingerprint === fingerprint) {
    return { app: cachedApp, auth: cachedAuth, db: cachedDb };
  }

  const appName = `knowza-${config.projectId}`;
  const existing = getApps().find((a) => a.name === appName);
  cachedApp = existing || (getApps().length === 0 ? initializeApp(config) : initializeApp(config, appName));
  cachedAuth = getAuth(cachedApp);
  cachedDb = getFirestore(cachedApp);
  cachedConfigFingerprint = fingerprint;

  return { app: cachedApp, auth: cachedAuth, db: cachedDb };
}

export interface FirebaseAuthResult {
  ok: boolean;
  error?: string;
  uid?: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  isNewAccount?: boolean;
  stats?: UserStats | null;
  notes?: StudyNote[];
}

async function loadOrInitializeFirestoreProfile(params: {
  db: Firestore;
  uid: string;
  email: string;
  displayName?: string;
  photoURL?: string;
  authProvider: 'google' | 'email';
}): Promise<FirebaseAuthResult> {
  const cleanEmail = normalizeEmail(params.email);
  if (!cleanEmail || isBlockedFakeAccount(cleanEmail, params.displayName)) {
    return { ok: false, error: 'Geçersiz veya sahte hesap reddedildi.' };
  }

  const userRef = doc(params.db, 'users', params.uid);
  const snap = await getDoc(userRef);
  const localRec = loadAccountRecord(cleanEmail);

  if (snap.exists()) {
    const data = snap.data() as {
      stats?: UserStats;
      notes?: StudyNote[];
      displayName?: string;
      photoURL?: string;
    };
    const remoteStats = data.stats || null;
    return {
      ok: true,
      uid: params.uid,
      email: cleanEmail,
      displayName: params.displayName || data.displayName || '',
      photoURL: params.photoURL || data.photoURL,
      isNewAccount: !remoteStats?.hasCompletedOnboarding && !localRec?.stats?.hasCompletedOnboarding,
      stats: remoteStats || localRec?.stats || null,
      notes: Array.isArray(data.notes) ? data.notes : localRec?.notes || [],
    };
  }

  const nowIso = new Date().toISOString();
  await setDoc(
    userRef,
    stripUndefinedDeep({
      uid: params.uid,
      email: cleanEmail,
      displayName: params.displayName || '',
      photoURL: params.photoURL || '',
      authProvider: params.authProvider,
      xp: localRec?.stats?.xp || 0,
      eloRating: localRec?.stats?.eloRating || 1000,
      duelWins: localRec?.stats?.duelWins || 0,
      duelLosses: localRec?.stats?.duelLosses || 0,
      streak: localRec?.stats?.streak || 0,
      stats: localRec?.stats || null,
      notes: localRec?.notes || [],
      createdAt: nowIso,
      updatedAt: nowIso,
    })
  );

  return {
    ok: true,
    uid: params.uid,
    email: cleanEmail,
    displayName: params.displayName || '',
    photoURL: params.photoURL,
    isNewAccount: !localRec,
    stats: localRec?.stats || null,
    notes: localRec?.notes || [],
  };
}

function mapFirebaseError(err: unknown): string {
  const code = String((err as { code?: string })?.code || '');
  switch (code) {
    case 'auth/popup-closed-by-user':
      return 'Google hesap seçme penceresi kapatıldı.';
    case 'auth/popup-blocked':
      return 'Tarayıcı açılır pencereyi (pop-up) engelledi. Lütfen izin verip tekrar dene.';
    case 'auth/unauthorized-domain':
      return 'Bu alan adı Firebase Authentication → Authorized domains listesinde ekli değil.';
    case 'auth/email-already-in-use':
      return 'Bu e-posta adresiyle kayıtlı bir hesap zaten var.';
    case 'auth/invalid-credential':
    case 'auth/wrong-password':
    case 'auth/user-not-found':
      return 'E-posta veya şifre hatalı.';
    case 'auth/weak-password':
      return 'Şifreniz en az 6 karakter olmalıdır.';
    default:
      return (err as { message?: string })?.message || 'Firebase kimlik doğrulama hatası.';
  }
}

/** Real Firebase Google Account Picker Sign-In */
export async function signInWithFirebaseGoogle(): Promise<FirebaseAuthResult> {
  const instances = getFirebaseInstances();
  if (!instances) {
    return { ok: false, error: 'Firebase henüz yapılandırılmadı.' };
  }

  try {
    const provider = new GoogleAuthProvider();
    provider.addScope('email');
    provider.addScope('profile');
    provider.setCustomParameters({ prompt: 'select_account' });

    const cred = await signInWithPopup(instances.auth, provider);
    const user = cred.user;
    if (!user.email) {
      return { ok: false, error: 'Google hesabından e-posta bilgisi alınamadı.' };
    }

    return await loadOrInitializeFirestoreProfile({
      db: instances.db,
      uid: user.uid,
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || undefined,
      authProvider: 'google',
    });
  } catch (err) {
    return { ok: false, error: mapFirebaseError(err) };
  }
}

export async function registerWithFirebaseEmail(email: string, password: string): Promise<FirebaseAuthResult> {
  const instances = getFirebaseInstances();
  if (!instances) return { ok: false, error: 'Firebase yapılandırılmadı.' };

  try {
    const cred = await createUserWithEmailAndPassword(instances.auth, normalizeEmail(email), password);
    return await loadOrInitializeFirestoreProfile({
      db: instances.db,
      uid: cred.user.uid,
      email: cred.user.email || normalizeEmail(email),
      displayName: '',
      authProvider: 'email',
    });
  } catch (err) {
    return { ok: false, error: mapFirebaseError(err) };
  }
}

export async function loginWithFirebaseEmail(email: string, password: string): Promise<FirebaseAuthResult> {
  const instances = getFirebaseInstances();
  if (!instances) return { ok: false, error: 'Firebase yapılandırılmadı.' };

  try {
    const cred = await signInWithEmailAndPassword(instances.auth, normalizeEmail(email), password);
    return await loadOrInitializeFirestoreProfile({
      db: instances.db,
      uid: cred.user.uid,
      email: cred.user.email || normalizeEmail(email),
      displayName: cred.user.displayName || '',
      photoURL: cred.user.photoURL || undefined,
      authProvider: 'email',
    });
  } catch (err) {
    return { ok: false, error: mapFirebaseError(err) };
  }
}

export async function signOutFirebase(): Promise<void> {
  const instances = getFirebaseInstances();
  if (!instances) return;
  try {
    await signOut(instances.auth);
  } catch {
    // Ignore sign-out errors
  }
}

export async function saveAccountToFirestore(stats: UserStats, notes: StudyNote[]): Promise<void> {
  const instances = getFirebaseInstances();
  if (!instances) return;

  const uid = stats.firebaseUid || instances.auth.currentUser?.uid;
  if (!uid || !stats.isLoggedIn || !stats.email) return;

  try {
    const nowIso = new Date().toISOString();
    const userRef = doc(instances.db, 'users', uid);
    const identity = getDisplayIdentity(stats);
    await setDoc(
      userRef,
      stripUndefinedDeep({
        uid,
        email: normalizeEmail(stats.email),
        displayName: stats.username || identity.handle,
        photoURL: stats.avatarUrl || '',
        xp: Number(stats.xp || 0),
        eloRating: Number(stats.eloRating || 1000),
        duelWins: Number(stats.duelWins || 0),
        duelLosses: Number(stats.duelLosses || 0),
        streak: Number(stats.streak || 0),
        selectedCostume: stats.selectedCostume || 'classic',
        equippedAvatarFrame: stats.equippedAvatarFrame || 'none',
        stats: { ...stats, firebaseUid: uid, lastSavedAt: nowIso },
        notes,
        updatedAt: nowIso,
      }),
      { merge: true }
    );
  } catch (err) {
    console.warn('[Firestore Save Warning]', err);
  }
}

export async function fetchFirestoreLeaderboard(): Promise<ServerLeaderboardPlayer[]> {
  const instances = getFirebaseInstances();
  if (!instances) return [];

  try {
    const q = query(collection(instances.db, 'users'), orderBy('xp', 'desc'), limit(50));
    const snap = await getDocs(q);
    const players: ServerLeaderboardPlayer[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data() as {
        uid?: string;
        email?: string;
        displayName?: string;
        xp?: number;
        eloRating?: number;
        duelWins?: number;
        duelLosses?: number;
        streak?: number;
        selectedCostume?: KnowzaCostume;
        equippedAvatarFrame?: AvatarFrameId;
        stats?: UserStats;
      };
      if (!data.stats && !data.email) return;
      const xp = Number(data.xp ?? data.stats?.xp ?? 0);
      const tier = xp >= 500 ? 'diamond' : xp >= 250 ? 'gold' : xp >= 100 ? 'silver' : 'bronze';
      const fallbackHandle = String(data.email || '').split('@')[0];
      const safeHandle =
        fallbackHandle.length <= 3 ? `${fallbackHandle[0] || 'K'}***` : `${fallbackHandle.slice(0, 3)}***`;
      const name = (data.displayName || data.stats?.username || '').trim() || safeHandle;

      players.push({
        id: data.uid || docSnap.id,
        name,
        xp,
        eloRating: Number(data.eloRating ?? data.stats?.eloRating ?? 1000),
        duelWins: Number(data.duelWins ?? data.stats?.duelWins ?? 0),
        duelLosses: Number(data.duelLosses ?? data.stats?.duelLosses ?? 0),
        streak: Number(data.streak ?? data.stats?.streak ?? 0),
        costume: (data.selectedCostume || data.stats?.selectedCostume || 'classic') as KnowzaCostume,
        frameId: (data.equippedAvatarFrame || data.stats?.equippedAvatarFrame || 'none') as AvatarFrameId,
        tier,
      });
    });
    return players;
  } catch (err) {
    console.warn('[Firestore Leaderboard Warning]', err);
    return [];
  }
}

// ─── Real-Time 1v1 Duel Rooms on Firestore ──────────────────────────────────

export async function createFirestoreDuelRoom(params: {
  playerId: string;
  playerName: string;
  playerElo: number;
  frameId: string;
  questionPoolSize: number;
}): Promise<LiveDuelRoom | null> {
  const instances = getFirebaseInstances();
  if (!instances) return null;

  try {
    const code = 'KZ-' + Math.floor(1000 + Math.random() * 9000);
    const poolSize = Math.max(5, Number(params.questionPoolSize || 10));
    const indices = Array.from({ length: poolSize }, (_, i) => i)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const room: LiveDuelRoom & { createdAt: string } = {
      code,
      status: 'waiting',
      questionIndices: indices,
      host: {
        id: params.playerId,
        name: params.playerName,
        elo: params.playerElo,
        frameId: params.frameId || 'none',
        score: 0,
        finished: false,
      },
      guest: null,
      createdAt: new Date().toISOString(),
    };

    await setDoc(doc(instances.db, 'duel_rooms', code), room);
    return room;
  } catch (err) {
    console.warn('[Firestore Create Duel Room Warning]', err);
    return null;
  }
}

export async function joinFirestoreDuelRoom(params: {
  code: string;
  playerId: string;
  playerName: string;
  playerElo: number;
  frameId: string;
}): Promise<{ room?: LiveDuelRoom; error?: string } | null> {
  const instances = getFirebaseInstances();
  if (!instances) return null;

  try {
    const cleanCode = params.code.trim().toUpperCase();
    const roomRef = doc(instances.db, 'duel_rooms', cleanCode);
    const snap = await getDoc(roomRef);
    if (!snap.exists()) {
      return { error: 'Oda bulunamadı. Kodu kontrol et.' };
    }
    const room = snap.data() as LiveDuelRoom;
    if (room.guest && room.guest.id !== params.playerId) {
      return { error: 'Bu oda dolu.' };
    }

    const guestData = {
      id: params.playerId,
      name: params.playerName,
      elo: params.playerElo,
      frameId: params.frameId || 'none',
      score: 0,
      finished: false,
    };

    await updateDoc(roomRef, {
      guest: guestData,
      status: 'active',
    });

    return {
      room: {
        ...room,
        guest: guestData,
        status: 'active',
      },
    };
  } catch (err) {
    return { error: (err as { message?: string })?.message || 'Odaya katılınamadı.' };
  }
}

export async function submitFirestoreDuelScore(params: {
  code: string;
  role: 'host' | 'guest';
  score: number;
  finished?: boolean;
}): Promise<LiveDuelRoom | null> {
  const instances = getFirebaseInstances();
  if (!instances) return null;

  try {
    const roomRef = doc(instances.db, 'duel_rooms', params.code.trim().toUpperCase());
    const snap = await getDoc(roomRef);
    if (!snap.exists()) return null;

    const room = snap.data() as LiveDuelRoom;
    const target = params.role === 'host' ? { ...room.host } : room.guest ? { ...room.guest } : null;
    if (!target) return room;

    target.score = Number(params.score || 0);
    if (params.finished) target.finished = true;

    const nextHost = params.role === 'host' ? target : room.host;
    const nextGuest = params.role === 'guest' ? target : room.guest;
    const nextStatus =
      nextHost.finished && nextGuest?.finished ? 'finished' : room.status;

    await updateDoc(roomRef, {
      [params.role]: target,
      status: nextStatus,
    });

    return {
      ...room,
      host: nextHost,
      guest: nextGuest,
      status: nextStatus,
    };
  } catch {
    return null;
  }
}

export function subscribeFirestoreDuelRoom(
  code: string,
  onUpdate: (room: LiveDuelRoom) => void
): (() => void) | null {
  const instances = getFirebaseInstances();
  if (!instances || !code) return null;

  const roomRef = doc(instances.db, 'duel_rooms', code.trim().toUpperCase());
  return onSnapshot(roomRef, (snap) => {
    if (snap.exists()) {
      onUpdate(snap.data() as LiveDuelRoom);
    }
  });
}
