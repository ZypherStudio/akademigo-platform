import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { sound } from '../utils/audio';
import {
  isFounderAccount,
  listSavedAccounts,
  loadAccountRecord,
  removeSavedAccount,
  SavedAccountSummary,
} from '../utils/accountStorage';
import {
  authenticateWithFirebaseGoogle,
  authenticateWithGoogleEmail,
  authenticateWithGoogleToken,
  loginWithEmailPassword,
  registerWithEmailPassword,
} from '../utils/apiClient';
import { isFirebaseConfigured } from '../utils/firebaseClient';
import { resolveGoogleClientId, signInWithGoogleOAuth } from '../utils/googleOAuth';
import {
  X,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  Loader2,
  Flame,
  Swords,
  Trash2,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface AuthModalProps {
  onClose?: () => void;
  isOpenAsScreen?: boolean;
  initialMode?: 'google' | 'email';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  onClose,
  isOpenAsScreen = false,
  initialMode = 'google',
}) => {
  const { loginUser } = useGame();
  const [activeTab, setActiveTab] = useState<'google' | 'email'>(initialMode);
  const [emailSubTab, setEmailSubTab] = useState<'login' | 'register'>('login');

  // Google / Firebase Auth State
  const [firebaseReady] = useState<boolean>(() => isFirebaseConfigured());
  const [googleClientId, setGoogleClientId] = useState<string>('');
  const [googleEmail, setGoogleEmail] = useState<string>('');
  const [isGoogleLoading, setIsGoogleLoading] = useState<boolean>(false);
  const [googleLoadingMessage, setGoogleLoadingMessage] = useState<string>('');
  const [savedAccounts, setSavedAccounts] = useState<SavedAccountSummary[]>(() => listSavedAccounts());
  const googleEmailInputRef = useRef<HTMLInputElement>(null);

  // Email form state (NO forced name field!)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    resolveGoogleClientId().then((id) => {
      setGoogleClientId(id);
    });
  }, []);

  const finishAuthLogin = (
    provider: 'google' | 'email',
    res: Awaited<ReturnType<typeof authenticateWithGoogleEmail>>
  ) => {
    if (!res.ok || !res.email) {
      sound.playWrong();
      setFeedback(res.error || 'Giriş yapılamadı.');
      return;
    }

    const cleanEmail = res.email.toLowerCase().trim();
    const isFounder = isFounderAccount(cleanEmail);
    const localRec = loadAccountRecord(cleanEmail);
    const isExisting = !res.isNewAccount || Boolean(res.stats) || Boolean(localRec) || isFounder;

    loginUser(provider, cleanEmail, {
      username: res.googleName || '',
      firebaseUid: res.firebaseUid,
      googleSub: res.googleSub,
      avatarUrl: res.avatarUrl,
      existingStats: res.stats ?? localRec?.stats ?? null,
      existingNotes: res.notes ?? localRec?.notes ?? [],
      isNewAccount: !isExisting,
    });
    if (onClose) onClose();
  };

  // Instant 1-click resume for saved accounts (zero lag, offline-ready)
  const handleSelectSavedAccount = (acc: SavedAccountSummary) => {
    sound.playClick();
    const cleanEmail = acc.email.toLowerCase().trim();
    const localRec = loadAccountRecord(cleanEmail);
    const existingStats = localRec?.stats || null;

    loginUser(acc.authProvider || 'google', cleanEmail, {
      username: acc.username || cleanEmail.split('@')[0],
      avatarUrl: acc.avatarUrl,
      existingStats: existingStats ? { ...existingStats, hasCompletedOnboarding: true } : null,
      existingNotes: localRec?.notes || [],
      isNewAccount: false,
    });
    if (onClose) onClose();
  };

  // Real Firebase Google Account Picker Sign-In (with seamless email fallback)
  const handleFirebaseGoogleLogin = async () => {
    setFeedback(null);
    if (!firebaseReady) {
      if (googleClientId) {
        return handleGoogleOAuthLogin();
      }
      if (googleEmail.trim()) {
        return handleGoogleEmailLogin(googleEmail);
      }
      setFeedback('Aşağıya Google e-posta adresini yazarak tek tıkla devam edebilirsin.');
      googleEmailInputRef.current?.focus();
      return;
    }

    let didRedirect = false;
    try {
      setIsGoogleLoading(true);
      setGoogleLoadingMessage('Google hesap seçici açılıyor...');
      sound.playClick();

      const res = await authenticateWithFirebaseGoogle();
      if (res.redirecting) {
        didRedirect = true;
        setGoogleLoadingMessage('Google hesap seçiciye yönlendiriliyor...');
        return;
      }

      if (!res.ok) {
        const errCode = String(res.errorCode || '');
        const isWebRestriction =
          errCode === 'auth/unauthorized-domain' ||
          errCode === 'auth/popup-blocked' ||
          errCode === 'auth/operation-not-supported-in-this-environment' ||
          errCode === 'auth/not-configured' ||
          Boolean(res.error?.includes('Authorized domains')) ||
          Boolean(res.error?.includes('alan adı'));

        if (isWebRestriction) {
          if (googleClientId) {
            setIsGoogleLoading(false);
            return await handleGoogleOAuthLogin();
          }
          if (googleEmail.trim()) {
            setIsGoogleLoading(false);
            return await handleGoogleEmailLogin(googleEmail);
          }
          setFeedback('Aşağıya Google e-posta adresini yazarak şifresiz devam edebilirsin.');
          setTimeout(() => googleEmailInputRef.current?.focus(), 50);
          return;
        }
      }

      finishAuthLogin('google', res);
    } catch (err: any) {
      sound.playWrong();
      setFeedback(err?.message || 'Google ile giriş tamamlanamadı.');
    } finally {
      if (!didRedirect) setIsGoogleLoading(false);
    }
  };

  // Real Google Identity Services OAuth Popup
  const handleGoogleOAuthLogin = async () => {
    setFeedback(null);
    if (!googleClientId) {
      if (googleEmail.trim()) {
        return handleGoogleEmailLogin(googleEmail);
      }
      setFeedback('Aşağıya Google e-posta adresini yazarak devam edebilirsin.');
      googleEmailInputRef.current?.focus();
      return;
    }

    try {
      setIsGoogleLoading(true);
      setGoogleLoadingMessage('Google hesap seçici açılıyor...');
      sound.playClick();

      const profile = await signInWithGoogleOAuth(googleClientId);
      setGoogleLoadingMessage('Hesap ve kayıt verileri yükleniyor...');

      const res = await authenticateWithGoogleToken(profile.accessToken, profile);
      finishAuthLogin('google', res);
    } catch (err: any) {
      if (googleEmail.trim()) {
        return await handleGoogleEmailLogin(googleEmail);
      }
      sound.playWrong();
      setFeedback(err?.message || 'Google ile giriş tamamlanamadı.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // Connect or resume real Google Email account (zero fake defaults!)
  const handleGoogleEmailLogin = async (targetEmail: string) => {
    setFeedback(null);
    const trimmed = targetEmail.trim().toLowerCase();
    if (!trimmed) {
      setFeedback('Lütfen kendi Google e-posta adresini yaz (örn: adin@gmail.com).');
      return;
    }

    const localRec = loadAccountRecord(trimmed);
    const isFounder = isFounderAccount(trimmed);

    // If already known on this device or is founder, instant resume
    if (localRec || isFounder) {
      sound.playClick();
      loginUser('google', trimmed, {
        username: localRec?.stats?.username || trimmed.split('@')[0],
        existingStats: localRec?.stats ? { ...localRec.stats, hasCompletedOnboarding: true } : null,
        existingNotes: localRec?.notes || [],
        isNewAccount: false,
      });
      if (onClose) onClose();
      return;
    }

    try {
      setIsGoogleLoading(true);
      setGoogleLoadingMessage('Hesap kontrol ediliyor & kayıt yükleniyor...');
      sound.playClick();

      const res = await authenticateWithGoogleEmail(trimmed);
      finishAuthLogin('google', res);
    } catch {
      sound.playWrong();
      setFeedback('Hesaba bağlanılırken hata oluştu.');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleRemoveSavedAccount = (targetEmail: string, e: React.MouseEvent) => {
    e.stopPropagation();
    sound.playClick();
    removeSavedAccount(targetEmail);
    setSavedAccounts(listSavedAccounts());
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setIsEmailLoading(true);

    try {
      if (emailSubTab === 'register') {
        const res = await registerWithEmailPassword(email, password);
        finishAuthLogin('email', res);
      } else {
        const res = await loginWithEmailPassword(email, password);
        finishAuthLogin('email', res);
      }
    } finally {
      setIsEmailLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade ${
        isOpenAsScreen ? 'static bg-transparent p-0' : ''
      }`}
      onClick={() => onClose && onClose()}
    >
      <div
        className="relative w-full max-w-sm bg-white rounded-3xl p-5 sm:p-6 shadow-2xl border border-amber-200/80 text-slate-800 animate-scale-up overflow-y-auto overflow-x-hidden max-h-[92dvh] no-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute inset-0 overflow-hidden pointer-events-none rounded-3xl">
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/10 rounded-full blur-2xl" />
        </div>

        {onClose && (
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 font-bold transition"
          >
            <X className="w-4 h-4" />
          </button>
        )}

        {/* Header Branding */}
        <div className="text-center pt-1 pb-3">
          <div className="w-36 mx-auto mb-1">
            <img
              src="/assets/knowza_logo_hd.png"
              alt="Knowza Logo"
              className="w-full h-auto object-contain"
            />
          </div>
          <p className="text-xs font-black text-slate-500">
            İlerlemen, Düello ELO & Serin Hesabında Saklansın 🎯
          </p>
        </div>

        {/* Tabs: Google vs E-posta */}
        <div className="flex bg-slate-100 p-1 rounded-2xl mb-4 text-xs font-black">
          <button
            type="button"
            onClick={() => {
              setActiveTab('google');
              setFeedback(null);
              sound.playClick();
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'google'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span>Google Hesabı</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('email');
              setFeedback(null);
              sound.playClick();
            }}
            className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition ${
              activeTab === 'email'
                ? 'bg-white text-slate-900 shadow-sm border border-slate-200/50'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>E-posta & Şifre</span>
          </button>
        </div>

        {/* ================= TAB 1: GOOGLE AUTH ================= */}
        {activeTab === 'google' && (
          <div className="space-y-3">
            {isGoogleLoading ? (
              <div className="py-8 flex flex-col items-center justify-center text-center space-y-3">
                <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                <p className="text-xs font-black text-slate-700 animate-pulse">
                  {googleLoadingMessage}
                </p>
                <span className="text-[10px] font-bold text-slate-400">
                  Kayıtlı ilerleme ve düello ELO verilerin eşitleniyor
                </span>
              </div>
            ) : (
              <>
                {/* Real Saved Accounts on This Device */}
                {savedAccounts.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-black uppercase text-slate-500 block">
                      Kayıtlı Hesaplarından Devam Et
                    </span>
                    <div className="space-y-1.5 max-h-40 overflow-y-auto pr-0.5">
                      {savedAccounts.map((acc) => (
                        <div
                          key={acc.email}
                          onClick={() => handleSelectSavedAccount(acc)}
                          className="p-2.5 rounded-2xl bg-amber-50/70 hover:bg-amber-100/70 border-2 border-amber-200/80 hover:border-[#FFB800] transition cursor-pointer flex items-center justify-between gap-2 group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            {acc.avatarUrl ? (
                              <img
                                src={acc.avatarUrl}
                                alt={acc.email}
                                className="w-9 h-9 rounded-full object-cover border border-amber-300 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-full bg-white border border-amber-300 flex items-center justify-center text-xs font-black text-amber-800 flex-shrink-0">
                                {acc.email.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div className="min-w-0">
                              <span className="text-xs font-black text-slate-900 block truncate">
                                {acc.username || acc.email}
                              </span>
                              <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500">
                                {acc.username && (
                                  <span className="truncate max-w-[110px]">{acc.email}</span>
                                )}
                                <span className="flex items-center gap-0.5 text-amber-700">
                                  <Sparkles className="w-2.5 h-2.5" /> {acc.xp} XP
                                </span>
                                <span className="flex items-center gap-0.5 text-orange-600">
                                  <Flame className="w-2.5 h-2.5" /> {acc.streak}g
                                </span>
                                <span className="flex items-center gap-0.5 text-rose-600">
                                  <Swords className="w-2.5 h-2.5" /> {acc.eloRating}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleRemoveSavedAccount(acc.email, e)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                              title="Bu cihazdan kaldır"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                            <ArrowRight className="w-4 h-4 text-amber-700 group-hover:translate-x-0.5 transition" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Official Google Account Chooser Button (Firebase Auth or GSI OAuth) */}
                <button
                  type="button"
                  onClick={handleFirebaseGoogleLogin}
                  className="w-full py-3 bg-white hover:bg-slate-50 text-slate-900 font-black text-xs rounded-2xl border-2 border-blue-500 shadow-sm transition active:scale-98 flex items-center justify-center gap-2.5"
                >
                  <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span>Google Hesabını Seç & Giriş Yap</span>
                  {(firebaseReady || googleClientId) && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  )}
                </button>

                {/* Direct Google Email Quick Connect (No Web Domain Warning) */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border-2 border-slate-200 space-y-2.5">
                  <div className="min-w-0">
                    <span className="text-xs font-black text-slate-900 block">
                      Google E-postan ile Hızlı Giriş
                    </span>
                    <span className="text-[10px] font-bold text-slate-500 block">
                      Kayıtların, serilerin & düello ELO'n bu adrese bağlanır
                    </span>
                  </div>

                  <input
                    ref={googleEmailInputRef}
                    type="email"
                    value={googleEmail}
                    onChange={(e) => setGoogleEmail(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleGoogleEmailLogin(googleEmail);
                    }}
                    placeholder="Kendi e-postanı yaz (örn: adin@gmail.com)"
                    className="w-full px-3 py-2.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 outline-none focus:border-blue-500"
                  />

                  <button
                    type="button"
                    onClick={() => handleGoogleEmailLogin(googleEmail)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-black text-xs rounded-xl shadow-sm transition active:scale-98 flex items-center justify-center gap-1.5"
                  >
                    <span>Bu E-posta ile Bağlan</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {feedback ? (
                  <div className="text-[11px] font-bold text-amber-800 bg-amber-50 border border-amber-200 p-2.5 rounded-xl text-center">
                    {feedback}
                  </div>
                ) : null}
              </>
            )}
          </div>
        )}

        {/* ================= TAB 2: EMAIL & PASSWORD ================= */}
        {activeTab === 'email' && (
          <div>
            <div className="flex items-center justify-center gap-4 mb-3 border-b border-slate-200 pb-2">
              <button
                type="button"
                onClick={() => {
                  setEmailSubTab('login');
                  setFeedback(null);
                  sound.playClick();
                }}
                className={`text-xs font-black transition ${
                  emailSubTab === 'login' ? 'text-amber-800 border-b-2 border-amber-500 pb-1' : 'text-slate-400'
                }`}
              >
                Giriş Yap
              </button>
              <button
                type="button"
                onClick={() => {
                  setEmailSubTab('register');
                  setFeedback(null);
                  sound.playClick();
                }}
                className={`text-xs font-black transition ${
                  emailSubTab === 'register' ? 'text-amber-800 border-b-2 border-amber-500 pb-1' : 'text-slate-400'
                }`}
              >
                Yeni Hesap Aç
              </button>
            </div>

            <form onSubmit={handleEmailSubmit} className="space-y-3">
              <div>
                <label className="text-[10px] font-black text-slate-700 block mb-0.5">
                  E-posta Adresin
                </label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="eposta@adresiniz.com"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black text-slate-700 block mb-0.5">
                  Şifren
                </label>
                <div className="relative">
                  <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="En az 6 karakter"
                    className="w-full pl-8 pr-3 py-2.5 bg-slate-50 border border-slate-200 focus:border-[#FFB800] rounded-xl text-xs font-bold text-slate-900 outline-none"
                  />
                </div>
              </div>

              {feedback && (
                <div className="text-[11px] font-bold text-rose-600 bg-rose-50 border border-rose-200 p-2.5 rounded-xl text-center">
                  {feedback}
                </div>
              )}

              <button
                type="submit"
                disabled={isEmailLoading}
                className="w-full py-3 mt-1 bg-gradient-to-r from-[#FFC700] via-[#FFB800] to-[#FFA000] hover:brightness-105 disabled:opacity-60 text-[#2A1E00] font-black text-xs rounded-xl border-b-4 border-[#D99000] active:border-b-0 active:translate-y-1 transition shadow-sm flex items-center justify-center gap-1.5"
              >
                {isEmailLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <span>{emailSubTab === 'register' ? 'Hesabımı Oluştur & Sorulara Geç 🚀' : 'Giriş Yap'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Security Trust Footnote */}
        <div className="flex items-center justify-center gap-1 mt-4 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-400">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>İlerlemen, Düello ELO & Çerçevelerin Hesabına Kaydedilir</span>
        </div>
      </div>
    </div>
  );
};
