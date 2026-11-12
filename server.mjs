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

    let existing = db.accounts[email];
    const isNewAccount = !existing;
    const nowIso = new Date().toISOString();

    if (!existing) {
      existing = {
        email,
        authProvider: 'google',
        stats: null,
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

  return sendJson(res, 404, { ok: false, error: 'API endpoint bulunamadı.' });
}

function serveStatic(req, res, pathname) {
  let reqPath = pathname === '/' ? '/index.html' : decodeURIComponent(pathname);
  const safePath = path.normalize(reqPath).replace(/^(\.\.(\/|\\|$))+/, '');
  let fullPath = path.join(DIST_DIR, safePath);

  if (!fullPath.startsWith(DIST_DIR)) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
    fullPath = path.join(DIST_DIR, 'index.html');
  }

  const ext = path.extname(fullPath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(fullPath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const headers = { 'Content-Type': contentType };
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

    serveStatic(req, res, pathname);
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
