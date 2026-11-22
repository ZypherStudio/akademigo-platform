import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import pkg from 'pg';

const { Pool } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = Number(process.env.PORT || 3000);
const DIST_DIR = path.join(__dirname, 'dist');
const BLAST_DIST_DIR = path.join(DIST_DIR, 'blast');
const AKADEMI_DIST_DIR = path.join(DIST_DIR, 'akademi');
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'knowza_db.json');
const DATABASE_URL = (process.env.DATABASE_URL || '').trim();

const BLOCKED_FAKE_EMAILS = new Set([
  'ali@gmail.com',
  'ogrenci@gmail.com',
  'demo@knowza.app',
]);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
};

function createEmptyDb() {
  return {
    accounts: {}, // key: normalized email
    sessions: {}, // key: token -> { email, createdAt }
    duelRooms: {}, // key: roomCode -> room object
    blastPlayers: {}, // key: playerId -> Knowza Blast profile & daily scores
  };
}

function loadDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (!fs.existsSync(DB_FILE)) {
      return createEmptyDb();
    }
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const parsed = JSON.parse(raw);
    return {
      accounts: parsed.accounts && typeof parsed.accounts === 'object' ? parsed.accounts : {},
      sessions: parsed.sessions && typeof parsed.sessions === 'object' ? parsed.sessions : {},
      duelRooms: parsed.duelRooms && typeof parsed.duelRooms === 'object' ? parsed.duelRooms : {},
      blastPlayers: parsed.blastPlayers && typeof parsed.blastPlayers === 'object' ? parsed.blastPlayers : {},
    };
  } catch (err) {
    console.error('[DB Load Warning]', err.message);
    return createEmptyDb();
  }
}

let db = loadDb();
let pgPool = null;
let pgPersistChain = Promise.resolve();

async function initDatabase() {
  if (!DATABASE_URL) {
    console.log('[Knowza DB] DATABASE_URL ayarlı değil; yerel JSON deposu kullanılıyor.');
    return;
  }

  try {
    const isLocal = DATABASE_URL.includes('localhost') || DATABASE_URL.includes('127.0.0.1');
    pgPool = new Pool({
      connectionString: DATABASE_URL,
      ssl: isLocal ? false : { rejectUnauthorized: false },
    });

    await pgPool.query(`
      CREATE TABLE IF NOT EXISTS knowza_store (
        id TEXT PRIMARY KEY,
        payload JSONB NOT NULL,
        updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);

    const result = await pgPool.query('SELECT payload FROM knowza_store WHERE id = $1', ['main']);
    if (result.rows.length > 0 && result.rows[0].payload) {
      const remote = result.rows[0].payload;
      db = {
        accounts: remote.accounts && typeof remote.accounts === 'object' ? remote.accounts : {},
        sessions: remote.sessions && typeof remote.sessions === 'object' ? remote.sessions : {},
        duelRooms: remote.duelRooms && typeof remote.duelRooms === 'object' ? remote.duelRooms : {},
        blastPlayers: remote.blastPlayers && typeof remote.blastPlayers === 'object' ? remote.blastPlayers : {},
      };
      console.log(`[Knowza DB] PostgreSQL bağlandı (${Object.keys(db.accounts).length} hesap yüklendi).`);
    } else {
      await pgPool.query(
        'INSERT INTO knowza_store (id, payload, updated_at) VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()',
        ['main', JSON.stringify(db)]
      );
      console.log('[Knowza DB] PostgreSQL ilk tablo ve veri kaydı oluşturuldu.');
    }
  } catch (err) {
    console.error('[Knowza DB Warning] PostgreSQL bağlantısı başarısız, yerel JSON ile devam ediliyor:', err.message);
    pgPool = null;
  }
}

function persistDb() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    const tmpFile = `${DB_FILE}.tmp`;
    fs.writeFileSync(tmpFile, JSON.stringify(db, null, 2), 'utf8');
    fs.renameSync(tmpFile, DB_FILE);
  } catch (err) {
    console.error('[DB Persist Warning]', err.message);
  }

  if (pgPool) {
    const snapshot = JSON.stringify(db);
    pgPersistChain = pgPersistChain
      .then(() =>
        pgPool.query(
          'INSERT INTO knowza_store (id, payload, updated_at) VALUES ($1, $2::jsonb, NOW()) ON CONFLICT (id) DO UPDATE SET payload = EXCLUDED.payload, updated_at = NOW()',
          ['main', snapshot]
        )
      )
      .catch((err) => {
        console.error('[PostgreSQL Persist Warning]', err.message);
      });
  }
}

const normalizeEmail = (email) => String(email || '').trim().toLowerCase();

function isValidEmail(email) {
  const clean = normalizeEmail(email);
  if (!clean || BLOCKED_FAKE_EMAILS.has(clean)) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(clean);
}

function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  const derived = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return `${salt}:${derived}`;
}

function verifyPassword(password, storedHash) {
  const [salt, key] = String(storedHash || '').split(':');
  if (!salt || !key) return false;
  const derived = crypto.scryptSync(String(password), salt, 64);
  const keyBuf = Buffer.from(key, 'hex');
  if (derived.length !== keyBuf.length) return false;
  return crypto.timingSafeEqual(derived, keyBuf);
}

function issueSession(email) {
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions[token] = {
    email: normalizeEmail(email),
    createdAt: new Date().toISOString(),
  };
  persistDb();
  return token;
}

function getSessionEmail(req) {
  const authHeader = req.headers.authorization || '';
  if (!authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.slice(7).trim();
  const session = db.sessions[token];
  return session ? session.email : null;
}

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let size = 0;
    req.on('data', (chunk) => {
      size += chunk.length;
      if (size > 2 * 1024 * 1024) {
        reject(new Error('Body too large'));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on('end', () => {
      try {
        const raw = Buffer.concat(chunks).toString('utf8');
        resolve(raw ? JSON.parse(raw) : {});
      } catch {
        reject(new Error('Invalid JSON'));
      }
    });
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
  });
  res.end(JSON.stringify(data));
}

function sanitizeAccountForClient(record) {
  if (!record) return null;
  return {
    email: record.email,
    authProvider: record.authProvider,
    googleSub: record.googleSub,
    avatarUrl: record.avatarUrl,
    stats: record.stats ?? null,
    notes: Array.isArray(record.notes) ? record.notes : [],
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
  };
}

function buildPublicDisplayName(account) {
  const stats = account.stats || {};
  const rawName = String(stats.username || '').trim();
  if (rawName && !['ali', 'öğrenci', 'ogrenci'].includes(rawName.toLowerCase())) {
    return rawName;
  }
  const handle = String(account.email || '').split('@')[0] || 'Knowza';
  if (handle.length <= 3) return `${handle[0]}***`;
  return `${handle.slice(0, 3)}***`;
}

function cleanupExpiredDuelRooms() {
  const cutoff = Date.now() - 2 * 60 * 60 * 1000;
  let removed = false;
  for (const [code, room] of Object.entries(db.duelRooms)) {
    if (new Date(room.createdAt).getTime() < cutoff) {
      delete db.duelRooms[code];
      removed = true;
    }
  }
  if (removed) persistDb();
}

function computeBlastLeague(player) {
  const best = Math.max(Number(player.highBlockScore || 0), Number(player.highSprintScore || 0));
  const lvl = Number(player.unlockedLevel || 1);
  if (best >= 3500 || lvl >= 250) return 'Efsane';
  if (best >= 2000 || lvl >= 120) return 'Elmas';
  if (best >= 1200 || lvl >= 45) return 'Altın';
  if (best >= 600 || lvl >= 15) return 'Gümüş';
  if (best >= 250 || lvl >= 4) return 'Bronz';
  return 'Çırak';
}

function generateBlastInviteCode(playerId) {
  const hash = crypto.createHash('sha256').update(String(playerId)).digest('hex').slice(0, 4).toUpperCase();
  return `KB-${hash}`;
}

function ensureBlastPlayer(playerId, defaults = {}) {
  if (!db.blastPlayers || typeof db.blastPlayers !== 'object') {
    db.blastPlayers = {};
  }
  const cleanId = String(playerId || '').trim().slice(0, 64);
  if (!cleanId) return null;
  const existing = db.blastPlayers[cleanId];
  if (existing) {
    if (!existing.inviteCode) existing.inviteCode = generateBlastInviteCode(cleanId);
    if (!Array.isArray(existing.pendingGifts)) existing.pendingGifts = [];
    if (!existing.dailyScores || typeof existing.dailyScores !== 'object') existing.dailyScores = {};
    if (!existing.lastGiftSent || typeof existing.lastGiftSent !== 'object') existing.lastGiftSent = {};
    return existing;
  }
  const created = {
    playerId: cleanId,
    inviteCode: String(defaults.inviteCode || generateBlastInviteCode(cleanId)).toUpperCase(),
    name: String(defaults.name || 'Knowza').trim().slice(0, 16) || 'Knowza',
    unlockedLevel: Math.max(1, Number(defaults.unlockedLevel || 1)),
    highBlockScore: Math.max(0, Number(defaults.highBlockScore || 0)),
    highSprintScore: Math.max(0, Number(defaults.highSprintScore || 0)),
    bestWinStreak: Math.max(0, Number(defaults.bestWinStreak || 0)),
    stars: Math.max(0, Number(defaults.stars || 0)),
    outfit: String(defaults.outfit || 'classic'),
    accessory: String(defaults.accessory || 'none'),
    dailyScores: {},
    claimedReferralCode: null,
    pendingGifts: [],
    lastGiftSent: {},
    updatedAt: new Date().toISOString(),
  };
  db.blastPlayers[cleanId] = created;
  return created;
}

async function handleApi(req, res, pathname, urlObj) {
  // Health & Config
  if (req.method === 'GET' && pathname === '/api/health') {
    return sendJson(res, 200, {
      ok: true,
      storage: pgPool ? 'postgresql' : 'local-json',
      accounts: Object.keys(db.accounts).length,
    });
  }

  if (req.method === 'GET' && pathname === '/api/config') {
    const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
    return sendJson(res, 200, {
      googleClientId,
      oauthConfigured: Boolean(googleClientId),
    });
  }

  // Real Google OAuth Access Token Verification
  if (req.method === 'POST' && pathname === '/api/auth/google') {
    const body = await readJsonBody(req);
    const accessToken = String(body.accessToken || '').trim();
    if (!accessToken) {
      return sendJson(res, 400, { ok: false, error: 'Google token eksik.' });
    }

    const googleRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!googleRes.ok) {
      return sendJson(res, 401, { ok: false, error: 'Google oturumu doğrulanamadı.' });
    }

    const profile = await googleRes.json();
    const email = normalizeEmail(profile.email);
    if (!email || !profile.email_verified || !isValidEmail(email)) {
      return sendJson(res, 400, { ok: false, error: 'Doğrulanmış bir Google e-posta adresi bulunamadı.' });
    }

    let existing = db.accounts[email];
    const isNewAccount = !existing;
    const nowIso = new Date().toISOString();

    if (!existing) {
      existing = {
        email,
        authProvider: 'google',
        googleSub: profile.sub,
        avatarUrl: profile.picture || undefined,
        stats: null,
        notes: [],
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      db.accounts[email] = existing;
    } else {
      existing.authProvider = 'google';
      existing.googleSub = profile.sub || existing.googleSub;
      existing.avatarUrl = profile.picture || existing.avatarUrl;
      existing.updatedAt = nowIso;
    }

    const sessionToken = issueSession(email);
    return sendJson(res, 200, {
      ok: true,
      isNewAccount,
      sessionToken,
      googleName: profile.name || profile.given_name || '',
      account: sanitizeAccountForClient(existing),
    });
  }

  // Real Email Login / Create when Google Cloud Client ID is not configured yet
  if (req.method === 'POST' && pathname === '/api/auth/google-email') {
    const body = await readJsonBody(req);
    const email = normalizeEmail(body.email);
    if (!isValidEmail(email)) {
      return sendJson(res, 400, { ok: false, error: 'Lütfen gerçek ve geçerli bir Google e-posta adresi giriniz.' });
    }

    const isFounder = (email === 'zypherstudio330@gmail.com' || email === 'emirhanfif@gmail.com');
    let existing = db.accounts[email];
    const isNewAccount = !existing && !isFounder;
    const nowIso = new Date().toISOString();

    if (!existing) {
      existing = {
        email,
        authProvider: 'google',
        stats: isFounder ? {
          xp: 0,
          streak: 0,
          hearts: 999999,
          maxHearts: 999999,
          gems: 99999,
          email,
          username: email.split('@')[0],
          isLoggedIn: true,
          authProvider: 'google',
          hasCompletedOnboarding: true,
          theme: 'gold',
          avatar: 'haribo',
          title: '👑 Kurucu Mimar & VIP',
          eloRating: 1000,
          equippedAvatarFrame: 'royal_crown',
          unlockedAvatarFrames: [
            'none', 'gold_flame', 'lightning_bolt', 'cyber_neon', 'nature_leaf',
            'cherry_blossom', 'royal_crown', 'blood_web', 'cosmic_stars', 'dark_wings',
            'dragon_fire', 'moon_reverie', 'deadpool_hearts', 'eous_astronaut'
          ],
        } : null,
        notes: [],
        createdAt: nowIso,
        updatedAt: nowIso,
      };
      db.accounts[email] = existing;
    } else {
      existing.updatedAt = nowIso;
    }

    const sessionToken = issueSession(email);
    return sendJson(res, 200, {
      ok: true,
      isNewAccount,
      sessionToken,
      account: sanitizeAccountForClient(existing),
    });
  }

  // Register Email + Password
  if (req.method === 'POST' && pathname === '/api/auth/register') {
    const body = await readJsonBody(req);
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');

    if (!isValidEmail(email)) {
      return sendJson(res, 400, { ok: false, error: 'Lütfen geçerli bir e-posta adresi giriniz.' });
    }
    if (password.length < 6) {
      return sendJson(res, 400, { ok: false, error: 'Şifreniz en az 6 karakter olmalıdır.' });
    }

    const existing = db.accounts[email];
    if (existing && existing.passwordHash) {
      return sendJson(res, 409, { ok: false, error: 'Bu e-posta adresiyle kayıtlı bir hesap zaten var. Giriş Yap sekmesini kullanın.' });
    }

    const nowIso = new Date().toISOString();
    const record = existing
      ? {
          ...existing,
          authProvider: 'email',
          passwordHash: hashPassword(password),
          updatedAt: nowIso,
        }
      : {
          email,
          authProvider: 'email',
          passwordHash: hashPassword(password),
          stats: null,
          notes: [],
          createdAt: nowIso,
          updatedAt: nowIso,
        };

    db.accounts[email] = record;
    const sessionToken = issueSession(email);

    return sendJson(res, 201, {
      ok: true,
      isNewAccount: !existing,
      sessionToken,
      account: sanitizeAccountForClient(record),
    });
  }

  // Login Email + Password
  if (req.method === 'POST' && pathname === '/api/auth/login') {
    const body = await readJsonBody(req);
    const email = normalizeEmail(body.email);
    const password = String(body.password || '');

    if (!isValidEmail(email) || !password) {
      return sendJson(res, 400, { ok: false, error: 'Lütfen e-posta ve şifrenizi giriniz.' });
    }

    const existing = db.accounts[email];
    if (!existing) {
      return sendJson(res, 404, { ok: false, error: 'Bu e-posta ile kayıtlı hesap bulunamadı.' });
    }
    if (!existing.passwordHash) {
      return sendJson(res, 400, { ok: false, error: 'Bu hesap Google ile oluşturulmuş. Google sekmesinden giriş yapabilirsiniz.' });
    }
    if (!verifyPassword(password, existing.passwordHash)) {
      return sendJson(res, 401, { ok: false, error: 'Şifre hatalı. Lütfen kontrol edip tekrar deneyin.' });
    }

    const sessionToken = issueSession(email);
    return sendJson(res, 200, {
      ok: true,
      isNewAccount: false,
      sessionToken,
      account: sanitizeAccountForClient(existing),
    });
  }

  // Save authenticated account state
  if (req.method === 'POST' && pathname === '/api/account/save') {
    const sessionEmail = getSessionEmail(req);
    const body = await readJsonBody(req);
    const email = normalizeEmail(body.email || sessionEmail);

    if (!sessionEmail || sessionEmail !== email) {
      return sendJson(res, 401, { ok: false, error: 'Oturum doğrulanamadı.' });
    }

    const existing = db.accounts[email];
    if (!existing) {
      return sendJson(res, 404, { ok: false, error: 'Hesap bulunamadı.' });
    }

    const nowIso = new Date().toISOString();
    existing.stats = body.stats ? { ...body.stats, email, lastSavedAt: nowIso } : existing.stats;
    if (Array.isArray(body.notes)) {
      existing.notes = body.notes;
    }
    existing.updatedAt = nowIso;
    persistDb();

    return sendJson(res, 200, { ok: true, updatedAt: nowIso });
  }

  // Load authenticated account state
  if (req.method === 'GET' && pathname === '/api/account/load') {
    const sessionEmail = getSessionEmail(req);
    if (!sessionEmail) {
      return sendJson(res, 401, { ok: false, error: 'Oturum gerekli.' });
    }
    const existing = db.accounts[sessionEmail];
    if (!existing) {
      return sendJson(res, 404, { ok: false, error: 'Hesap bulunamadı.' });
    }
    return sendJson(res, 200, { ok: true, account: sanitizeAccountForClient(existing) });
  }

  // Real Leaderboard & Registered Players (No raw email exposure)
  if (req.method === 'GET' && pathname === '/api/leaderboard') {
    const players = Object.values(db.accounts)
      .filter((acc) => acc?.stats)
      .map((acc) => {
        const s = acc.stats;
        const xp = Number(s.xp || 0);
        const tier = xp >= 500 ? 'diamond' : xp >= 250 ? 'gold' : xp >= 100 ? 'silver' : 'bronze';
        return {
          id: `acc-${crypto.createHash('sha256').update(acc.email).digest('hex').slice(0, 10)}`,
          name: buildPublicDisplayName(acc),
          xp,
          eloRating: Number(s.eloRating || 1000),
          duelWins: Number(s.duelWins || 0),
          duelLosses: Number(s.duelLosses || 0),
          streak: Number(s.streak || 0),
          costume: s.selectedCostume || 'classic',
          frameId: s.equippedAvatarFrame || 'none',
          tier,
        };
      })
      .sort((a, b) => b.xp - a.xp || b.eloRating - a.eloRating)
      .slice(0, 30);

    return sendJson(res, 200, { ok: true, players });
  }

  // Live 1v1 Duel Room API
  if (req.method === 'POST' && pathname === '/api/duel/room') {
    cleanupExpiredDuelRooms();
    const body = await readJsonBody(req);
    let code = `GO-${Math.floor(100 + Math.random() * 900)}`;
    while (db.duelRooms[code]) {
      code = `GO-${Math.floor(100 + Math.random() * 900)}`;
    }
    const totalPool = Number(body.questionPoolSize || 25);
    const indices = Array.from({ length: totalPool }, (_, i) => i)
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    const room = {
      code,
      status: 'waiting', // waiting | active | finished
      questionIndices: indices,
      host: {
        id: String(body.playerId || crypto.randomBytes(6).toString('hex')),
        name: String(body.playerName || 'Ev Sahibi'),
        elo: Number(body.playerElo || 1000),
        frameId: String(body.frameId || 'none'),
        score: 0,
        finished: false,
      },
      guest: null,
      createdAt: new Date().toISOString(),
    };

    db.duelRooms[code] = room;
    persistDb();
    return sendJson(res, 201, { ok: true, room });
  }

  if (req.method === 'POST' && pathname === '/api/duel/room/join') {
    cleanupExpiredDuelRooms();
    const body = await readJsonBody(req);
    const code = String(body.code || '').trim().toUpperCase();
    const room = db.duelRooms[code];
    if (!room) {
      return sendJson(res, 404, { ok: false, error: 'Bu oda kodu bulunamadı veya süresi doldu.' });
    }

    const playerId = String(body.playerId || crypto.randomBytes(6).toString('hex'));
    if (room.host.id !== playerId && !room.guest) {
      room.guest = {
        id: playerId,
        name: String(body.playerName || 'Rakip'),
        elo: Number(body.playerElo || 1000),
        frameId: String(body.frameId || 'none'),
        score: 0,
        finished: false,
      };
      room.status = 'active';
      persistDb();
    }

    return sendJson(res, 200, { ok: true, room });
  }

  if (req.method === 'GET' && pathname === '/api/duel/room') {
    const code = String(urlObj.searchParams.get('code') || '').trim().toUpperCase();
    const room = db.duelRooms[code];
    if (!room) {
      return sendJson(res, 404, { ok: false, error: 'Oda bulunamadı.' });
    }
    return sendJson(res, 200, { ok: true, room });
  }

  if (req.method === 'POST' && pathname === '/api/duel/room/score') {
    const body = await readJsonBody(req);
    const code = String(body.code || '').trim().toUpperCase();
    const role = body.role === 'host' ? 'host' : 'guest';
    const room = db.duelRooms[code];
    if (!room || !room[role]) {
      return sendJson(res, 404, { ok: false, error: 'Oda veya oyuncu bulunamadı.' });
    }

    room[role].score = Number(body.score ?? room[role].score);
    if (body.finished) {
      room[role].finished = true;
    }
    if (room.host?.finished && room.guest?.finished) {
      room.status = 'finished';
    }
    persistDb();
    return sendJson(res, 200, { ok: true, room });
  }

  if (req.method === 'POST' && pathname === '/api/ai/chat') {
    const body = await readJsonBody(req);
    const userText = String(body.userText || '').trim();
    const systemInstruction = String(body.systemInstruction || '').trim();
    const history = Array.isArray(body.history) ? body.history.slice(-6) : [];
    const imageBase64 = typeof body.imageBase64 === 'string' ? body.imageBase64 : '';
    const imageMimeType = typeof body.imageMimeType === 'string' ? body.imageMimeType : '';
    const serverGeminiKey = (process.env.GEMINI_API_KEY || '').trim();

    if (serverGeminiKey) {
      try {
        const userParts = [];
        if (imageBase64 && imageMimeType) {
          userParts.push({ inlineData: { mimeType: imageMimeType, data: imageBase64 } });
        }
        userParts.push({ text: userText || 'Bu soruyu adım adım açıkla.' });

        const gRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${serverGeminiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
              contents: [...history, { role: 'user', parts: userParts }],
            }),
          }
        );
        if (gRes.ok) {
          const gData = await gRes.json();
          const reply = gData?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return sendJson(res, 200, { ok: true, text: reply, provider: 'gemini' });
          }
        }
      } catch (err) {
        console.warn('[AI Chat Gemini Warning]', err.message);
      }
    }

    return sendJson(res, 200, { ok: false, fallbackRequired: true });
  }

  if (req.method === 'POST' && pathname === '/api/tts') {
    const body = await readBody(req);
    const rawText = String(body.text || '').trim().slice(0, 1200);
    if (!rawText) {
      return sendJson(res, 400, { ok: false, error: 'Metin boş olamaz.' });
    }
    const voiceGender = body.voiceGender === 'male' ? 'male' : 'female';
    const voiceId =
      voiceGender === 'male'
        ? 'TX3LPaxmHKxFdv7VOQHJ' // Liam (Doğal Erkek Sesi)
        : 'EXAVITQu4vr4xnSDxMaL'; // Sarah (Doğal Kadın Sesi)
    const apiKey =
      process.env.ELEVENLABS_API_KEY || 'sk_bd77470feb0e4fd290d9f5b9cc60468a648c0793897f9a13';

    try {
      const ttsRes = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
        method: 'POST',
        headers: {
          'xi-api-key': apiKey,
          'Content-Type': 'application/json',
          Accept: 'audio/mpeg',
        },
        body: JSON.stringify({
          text: rawText,
          model_id: 'eleven_multilingual_v2',
          voice_settings: {
            stability: 0.45,
            similarity_boost: 0.78,
            style: 0.2,
          },
        }),
      });

      if (!ttsRes.ok) {
        const errTxt = await ttsRes.text();
        console.error('[ElevenLabs TTS Error]', ttsRes.status, errTxt);
        return sendJson(res, 502, { ok: false, error: 'Ses üretimi başarısız oldu.' });
      }

      const audioBuf = Buffer.from(await ttsRes.arrayBuffer());
      res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuf.length,
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*',
      });
      return res.end(audioBuf);
    } catch (err) {
      console.error('[ElevenLabs TTS Exception]', err);
      return sendJson(res, 502, { ok: false, error: 'Ses sunucusuna bağlanılamadı.' });
    }
  }

  // Knowza Blast: Sync Profile & Daily Challenge Score
  if (req.method === 'POST' && pathname === '/api/blast/sync') {
    const body = await readJsonBody(req);
    const p = ensureBlastPlayer(body.playerId, body);
    if (!p) {
      return sendJson(res, 400, { ok: false, error: 'playerId gerekli.' });
    }
    if (typeof body.name === 'string' && body.name.trim()) {
      p.name = body.name.trim().slice(0, 16);
    }
    p.unlockedLevel = Math.max(p.unlockedLevel || 1, Number(body.unlockedLevel || 1));
    p.highBlockScore = Math.max(p.highBlockScore || 0, Number(body.highBlockScore || 0));
    p.highSprintScore = Math.max(p.highSprintScore || 0, Number(body.highSprintScore || 0));
    p.bestWinStreak = Math.max(p.bestWinStreak || 0, Number(body.bestWinStreak || 0));
    p.stars = Math.max(0, Number(body.stars ?? p.stars));
    if (body.outfit) p.outfit = String(body.outfit);
    if (body.accessory) p.accessory = String(body.accessory);

    const dailyDate = typeof body.dailyDate === 'string' ? body.dailyDate.slice(0, 10) : '';
    const dailyScore = Number(body.dailyScore || 0);
    const dailyLines = Number(body.dailyLines || 0);
    if (dailyDate && dailyScore > 0) {
      const prevDaily = p.dailyScores[dailyDate];
      if (!prevDaily || dailyScore > prevDaily.score) {
        p.dailyScores[dailyDate] = {
          score: dailyScore,
          lines: dailyLines,
          updatedAt: new Date().toISOString(),
        };
      }
    }
    p.updatedAt = new Date().toISOString();
    persistDb();
    return sendJson(res, 200, {
      ok: true,
      player: {
        playerId: p.playerId,
        inviteCode: p.inviteCode,
        league: computeBlastLeague(p),
        claimedReferralCode: p.claimedReferralCode,
        pendingGiftsCount: p.pendingGifts.length,
      },
    });
  }

  // Knowza Blast: Global Real-Player Leaderboard
  if (req.method === 'GET' && pathname === '/api/blast/leaderboard') {
    const tab = String(urlObj.searchParams.get('tab') || 'endless');
    const date = String(urlObj.searchParams.get('date') || new Date().toISOString().slice(0, 10)).slice(0, 10);
    const myId = String(urlObj.searchParams.get('playerId') || '').trim();
    const list = Object.values(db.blastPlayers || {});

    const mapped = list
      .map((p) => {
        const daily = p.dailyScores?.[date];
        return {
          playerId: p.playerId,
          inviteCode: p.inviteCode || generateBlastInviteCode(p.playerId),
          name: p.name || 'Knowza',
          unlockedLevel: Number(p.unlockedLevel || 1),
          highBlockScore: Number(p.highBlockScore || 0),
          highSprintScore: Number(p.highSprintScore || 0),
          bestWinStreak: Number(p.bestWinStreak || 0),
          stars: Number(p.stars || 0),
          outfit: p.outfit || 'classic',
          accessory: p.accessory || 'none',
          dailyScore: Number(daily?.score || 0),
          dailyLines: Number(daily?.lines || 0),
          league: computeBlastLeague(p),
        };
      })
      .filter((item) => (tab === 'daily' ? item.dailyScore > 0 : true))
      .sort((a, b) => {
        if (tab === 'daily') return b.dailyScore - a.dailyScore || b.dailyLines - a.dailyLines;
        if (tab === 'sprint') return b.highSprintScore - a.highSprintScore || b.unlockedLevel - a.unlockedLevel;
        if (tab === 'level') return b.unlockedLevel - a.unlockedLevel || b.stars - a.stars;
        return b.highBlockScore - a.highBlockScore || b.unlockedLevel - a.unlockedLevel;
      });

    const myIndex = myId ? mapped.findIndex((x) => x.playerId === myId) : -1;
    return sendJson(res, 200, {
      ok: true,
      tab,
      date,
      totalPlayers: mapped.length,
      myRank: myIndex >= 0 ? myIndex + 1 : null,
      players: mapped.slice(0, 40),
    });
  }

  // Knowza Blast: Referral Code Claim (?ref=KB-XXXX)
  if (req.method === 'POST' && pathname === '/api/blast/referral/claim') {
    const body = await readJsonBody(req);
    const claimer = ensureBlastPlayer(body.playerId, body);
    const rawCode = String(body.inviteCode || '').trim().toUpperCase();
    if (!claimer || !rawCode) {
      return sendJson(res, 400, { ok: false, error: 'Geçersiz davet kodu.' });
    }
    if (claimer.claimedReferralCode) {
      return sendJson(res, 409, { ok: false, error: 'Davet ödülünü zaten aldın.' });
    }
    const inviter = Object.values(db.blastPlayers || {}).find(
      (p) => (p.inviteCode || '').toUpperCase() === rawCode
    );
    if (!inviter) {
      return sendJson(res, 404, { ok: false, error: 'Bu davet koduyla kayıtlı oyuncu bulunamadı.' });
    }
    if (inviter.playerId === claimer.playerId) {
      return sendJson(res, 400, { ok: false, error: 'Kendi davet kodunu kullanamazsın.' });
    }

    claimer.claimedReferralCode = rawCode;
    if (!Array.isArray(inviter.pendingGifts)) inviter.pendingGifts = [];
    inviter.pendingGifts.push({
      id: `ref_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      type: 'referral',
      fromName: claimer.name || 'Yeni Oyuncu',
      coins: 300,
      hearts: 1,
      createdAt: new Date().toISOString(),
    });
    persistDb();
    return sendJson(res, 200, {
      ok: true,
      rewardCoins: 300,
      rewardRocket: 1,
      inviterName: inviter.name || 'Knowza Dostu',
    });
  }

  // Knowza Blast: Send Friend Gift / Answer Heart Request
  if (req.method === 'POST' && pathname === '/api/blast/gift/send') {
    const body = await readJsonBody(req);
    const sender = ensureBlastPlayer(body.fromPlayerId, { name: body.fromName });
    const targetId = String(body.targetPlayerId || '').trim();
    const targetCode = String(body.targetInviteCode || '').trim().toUpperCase();
    const target = targetId
      ? db.blastPlayers?.[targetId]
      : Object.values(db.blastPlayers || {}).find((p) => (p.inviteCode || '').toUpperCase() === targetCode);

    if (!sender || !target) {
      return sendJson(res, 404, { ok: false, error: 'Oyuncu bulunamadı.' });
    }
    if (sender.playerId === target.playerId) {
      return sendJson(res, 400, { ok: false, error: 'Kendine hediye gönderemezsin.' });
    }
    const today = new Date().toISOString().slice(0, 10);
    if (sender.lastGiftSent?.[target.playerId] === today) {
      return sendJson(res, 429, { ok: false, error: 'Bugün bu oyuncuya zaten can gönderdin.' });
    }
    sender.lastGiftSent[target.playerId] = today;
    if (!Array.isArray(target.pendingGifts)) target.pendingGifts = [];
    target.pendingGifts.push({
      id: `gift_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      type: 'heart',
      fromName: sender.name || 'Arkadaş',
      coins: 40,
      hearts: 1,
      createdAt: new Date().toISOString(),
    });
    persistDb();
    return sendJson(res, 200, {
      ok: true,
      receiverName: target.name || 'Arkadaş',
      helperCoins: 50,
    });
  }

  // Knowza Blast: Collect Pending Referral / Heart Gifts
  if (req.method === 'POST' && pathname === '/api/blast/gifts/claim') {
    const body = await readJsonBody(req);
    const p = ensureBlastPlayer(body.playerId);
    if (!p) {
      return sendJson(res, 400, { ok: false, error: 'playerId gerekli.' });
    }
    const gifts = Array.isArray(p.pendingGifts) ? [...p.pendingGifts] : [];
    p.pendingGifts = [];
    if (gifts.length > 0) persistDb();
    return sendJson(res, 200, { ok: true, gifts });
  }

  return sendJson(res, 404, { ok: false, error: 'API endpoint bulunamadı.' });
}

function serveStatic(req, res, pathname, baseDir = DIST_DIR) {
  let reqPath = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
  const safePath = path.normalize(reqPath).replace(/^(\.\.(\/|\\|$))+/, '').replace(/^[/\\]+/, '');
  let fullPath = path.join(baseDir, safePath);

  if (fullPath !== baseDir && !fullPath.startsWith(baseDir + path.sep)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    fullPath = path.join(baseDir, 'index.html');
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const headers = {
      'Content-Type': contentType,
      'Cross-Origin-Opener-Policy': 'same-origin-allow-popups',
    };
    if (ext === '.html') {
      headers['Cache-Control'] = 'no-cache';
    } else {
      headers['Cache-Control'] = 'public, max-age=86400';
    }
    res.writeHead(200, headers);
    res.end(content);
  });
}

const server = http.createServer(async (req, res) => {
  try {
    const urlObj = new URL(req.url || '/', `http://${req.headers.host || 'localhost'}`);
    const pathname = urlObj.pathname;

    if (pathname.startsWith('/api/')) {
      await handleApi(req, res, pathname, urlObj);
      return;
    }

    if (pathname === '/blast') {
      res.writeHead(301, { Location: '/blast/' });
      res.end();
      return;
    }

    if (pathname.startsWith('/blast/')) {
      const blastPath = pathname.slice('/blast'.length) || '/';
      serveStatic(req, res, blastPath, BLAST_DIST_DIR);
      return;
    }

    if (pathname === '/akademi') {
      res.writeHead(301, { Location: '/akademi/' });
      res.end();
      return;
    }

    if (pathname.startsWith('/akademi/')) {
      const akademiPath = pathname.slice('/akademi'.length) || '/';
      serveStatic(req, res, akademiPath, AKADEMI_DIST_DIR);
      return;
    }

    serveStatic(req, res, pathname, DIST_DIR);
  } catch (err) {
    console.error('[Server Error]', err);
    sendJson(res, 500, { ok: false, error: 'Sunucu hatası.' });
  }
});

initDatabase().then(() => {
  server.listen(PORT, () => {
    console.log(`Knowza server listening on port ${PORT}`);
  });
});
