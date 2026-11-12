declare global {
  interface Window {
    google?: {
      accounts?: {
        oauth2?: {
          initTokenClient: (config: {
            client_id: string;
            scope: string;
            prompt?: string;
            callback: (response: {
              access_token?: string;
              error?: string;
              error_description?: string;
            }) => void;
            error_callback?: (err: { type: string; message?: string }) => void;
          }) => {
            requestAccessToken: (overrideConfig?: { prompt?: string }) => void;
          };
        };
      };
    };
  }
}

const CUSTOM_CLIENT_ID_KEY = 'knowza_google_client_id';
let cachedServerClientId: string | null = null;

export interface GoogleUserProfile {
  email: string;
  name: string;
  picture?: string;
  sub: string;
  accessToken: string;
}

export function getCustomGoogleClientId(): string {
  return (localStorage.getItem(CUSTOM_CLIENT_ID_KEY) || '').trim();
}

export function setCustomGoogleClientId(clientId: string): void {
  const clean = clientId.trim();
  if (clean) {
    localStorage.setItem(CUSTOM_CLIENT_ID_KEY, clean);
  } else {
    localStorage.removeItem(CUSTOM_CLIENT_ID_KEY);
  }
}

export async function resolveGoogleClientId(): Promise<string> {
  const custom = getCustomGoogleClientId();
  if (custom) return custom;

  const envMeta = (import.meta as unknown as { env?: Record<string, string | undefined> }).env;
  const envId = (envMeta?.VITE_GOOGLE_CLIENT_ID || '').trim();
  if (envId) return envId;

  if (cachedServerClientId !== null) return cachedServerClientId;

  try {
    const res = await fetch('/api/config');
    if (res.ok) {
      const data = await res.json();
      cachedServerClientId = String(data.googleClientId || '').trim();
      return cachedServerClientId;
    }
  } catch {
    // Ignore when static dev server runs without /api
  }
  cachedServerClientId = '';
  return '';
}

async function ensureGsiScriptLoaded(): Promise<void> {
  if (window.google?.accounts?.oauth2) return;

  await new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[src*="accounts.google.com/gsi/client"]');
    if (existing) {
      let attempts = 0;
      const timer = setInterval(() => {
        attempts += 1;
        if (window.google?.accounts?.oauth2) {
          clearInterval(timer);
          resolve();
        } else if (attempts > 40) {
          clearInterval(timer);
          reject(new Error('Google Identity Services yüklenemedi.'));
        }
      }, 100);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google servisine bağlanılamadı.'));
    document.head.appendChild(script);
  });
}

export async function signInWithGoogleOAuth(clientId: string): Promise<GoogleUserProfile> {
  await ensureGsiScriptLoaded();
  const oauth2 = window.google?.accounts?.oauth2;
  if (!oauth2) {
    throw new Error('Google OAuth başlatılamadı. Lütfen sayfayı yenileyip tekrar deneyin.');
  }

  const accessToken = await new Promise<string>((resolve, reject) => {
    const client = oauth2.initTokenClient({
      client_id: clientId,
      scope: 'openid email profile',
      callback: (res) => {
        if (res.error || !res.access_token) {
          reject(new Error(res.error_description || 'Google girişi iptal edildi.'));
          return;
        }
        resolve(res.access_token);
      },
      error_callback: (err) => {
        reject(new Error(err.message || 'Google penceresi açılamadı (pop-up iznini kontrol edin).'));
      },
    });
    client.requestAccessToken({ prompt: 'select_account' });
  });

  const userRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (!userRes.ok) {
    throw new Error('Google hesap bilgileri alınamadı.');
  }

  const user = await userRes.json();
  if (!user.email) {
    throw new Error('Google hesabınızdan e-posta bilgisi alınamadı.');
  }

  return {
    email: String(user.email).trim().toLowerCase(),
    name: String(user.name || user.given_name || '').trim(),
    picture: user.picture ? String(user.picture) : undefined,
    sub: String(user.sub || ''),
    accessToken,
  };
}
